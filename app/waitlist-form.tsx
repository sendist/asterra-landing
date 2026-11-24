"use client";

import { useRef, useState, type FormEvent } from "react";

export function WaitlistForm({ isPreview }: { isPreview: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "complete" | "error">("idle");
  const [message, setMessage] = useState("");
  const submitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    submitting.current = true;
    const form = event.currentTarget;
    setState("sending");
    setMessage("");

    try {
      const formData = new FormData(form);
      const email = formData.get("email");
      const feedback = String(formData.get("feedback") ?? "").trim();
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, feedback }),
      });
      const result = await response.json();
      if (!response.ok) {
        setState("error");
        setMessage(result.message ?? "We couldn’t save your signup. Please try again.");
        return;
      }

      form.reset();
      setState("complete");
      if (result.preview) {
        setMessage(feedback ? "Test signup and feedback saved." : "Test signup saved.");
      } else if (result.needsConfirmation) {
        setMessage("Check your inbox to confirm your launch reminder.");
      } else {
        setMessage(feedback ? "You’re on the launch list. Thanks for your feedback." : "You’re on the launch list.");
      }
    } catch {
      setState("error");
      setMessage("We couldn’t save your signup. Please try again.");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <form className="waitlist-form" onSubmit={submit} aria-describedby="waitlist-note">
      <div className="waitlist-field">
        <label htmlFor="waitlist-email">Email address</label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={254}
          required
        />
      </div>
      <div className="waitlist-field">
        <label htmlFor="waitlist-feedback">Feedback</label>
        <textarea
          id="waitlist-feedback"
          name="feedback"
          rows={3}
          maxLength={1000}
          placeholder="Help us improve Asterra"
        />
      </div>
      <button className="button waitlist-submit" disabled={state === "sending"} type="submit">
        {state === "sending" ? "Saving…" : "Notify me"}
      </button>
      <p id="waitlist-note" className="waitlist-note">
        {isPreview ? "Local preview. Use a test email address. No emails are sent." : "We’ll email you when Asterra launches."}
      </p>
      <p className="form-status" role="status" data-state={state}>{message}</p>
    </form>
  );
}
