import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asterra: Collect the Stars",
  description:
    "Turn the night sky into a treasure hunt. Catch real stars with your iPhone and keep what you discover in your own Sky Garden.",
  openGraph: {
    title: "Asterra: Collect the Stars",
    description: "Catch real stars and build your own Sky Garden.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
