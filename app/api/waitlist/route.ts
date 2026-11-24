import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getMailerLiteConfig } from "../../mailerlite";

async function writePreviewRecord(path: string, record: object) {
  try {
    await writeFile(path, JSON.stringify(record), { mode: 0o600, flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }
}

export async function POST(request: Request) {
  const mailerLite = getMailerLiteConfig();
  if (!mailerLite && process.env.NODE_ENV !== "development") {
    return Response.json({ message: "Launch signups aren’t open yet." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  const feedback = body.feedback ?? "";
  if (typeof feedback !== "string" || feedback.length > 1000) {
    return Response.json({ message: "Enter feedback of 1,000 characters or fewer." }, { status: 400 });
  }

  const comment = feedback.trim();
  if (mailerLite) {
    try {
      const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mailerLite.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          groups: [mailerLite.groupId],
          ...(comment && { fields: { [mailerLite.feedbackField]: comment } }),
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error(`MailerLite returned ${response.status}`);

      const { data } = await response.json();
      if (comment && data?.fields?.[mailerLite.feedbackField] !== comment) {
        throw new Error("MailerLite did not store the feedback");
      }
      if (data?.status !== "active" && data?.status !== "unconfirmed") {
        throw new Error("MailerLite subscriber is not eligible for delivery");
      }

      return Response.json({ saved: true, needsConfirmation: data.status === "unconfirmed" });
    } catch (error) {
      console.error("Waitlist subscription failed:", error instanceof Error ? error.name : "Unknown error");
      return Response.json({ message: "We couldn’t save your submission. Please try again." }, { status: 502 });
    }
  }

  const folder = join(tmpdir(), "asterra-waitlist-preview");
  const key = createHash("sha256").update(email).digest("hex");

  try {
    await mkdir(folder, { recursive: true, mode: 0o700 });
    await writePreviewRecord(join(folder, `${key}.json`), {
      email, signedUpAt: new Date().toISOString(),
    });
    if (comment) {
      const feedbackFolder = join(folder, "feedback");
      const feedbackKey = createHash("sha256").update(JSON.stringify([email, comment])).digest("hex");
      await mkdir(feedbackFolder, { recursive: true, mode: 0o700 });
      await writePreviewRecord(join(feedbackFolder, `${feedbackKey}.json`), {
        email, feedback: comment, submittedAt: new Date().toISOString(),
      });
    }
  } catch {
    return Response.json({ message: "We couldn’t save your submission. Please try again." }, { status: 500 });
  }

  return Response.json({ saved: true, preview: true });
}
