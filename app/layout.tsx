import type { Metadata } from "next";
import { HackathonTracker } from "./tracker";
import "./globals.css";

const title = "ReSub: keep your PayPal subscribers when Lemon Squeezy shuts down";
const description =
  "PayPal subscriptions can't migrate off Lemon Squeezy. ReSub wins them back: one personal checkout link per customer, automatic reminders, no double charges.";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "ReSub" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HackathonTracker />
        <header className="topbar">
          <a href="/" className="brand">
            ReSub
          </a>
        </header>
        {children}
        <footer className="footer">
          <p>ReSub is an independent tool. Not affiliated with Lemon Squeezy or Stripe.</p>
        </footer>
      </body>
    </html>
  );
}
