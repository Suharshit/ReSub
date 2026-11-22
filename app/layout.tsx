import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Logo } from "./icons";
import { HackathonTracker } from "./tracker";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

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
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <HackathonTracker />
        <div className="bg-glow" aria-hidden="true" />
        <header className="nav">
          <div className="nav-inner">
            <a href="/" className="brand" aria-label="ReSub home">
              <Logo />
              <span>ReSub</span>
            </a>
            <nav className="nav-links" aria-label="Main">
              <a href="/#how">How it works</a>
              <a href="/#pricing">Pricing</a>
              <a href="/#faq">FAQ</a>
            </nav>
            <a href="/#join" className="btn primary sm">
              Reserve a spot
            </a>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="footer-inner">
            <a href="/" className="brand" aria-label="ReSub home">
              <Logo />
              <span>ReSub</span>
            </a>
            <p>ReSub is an independent tool. Not affiliated with Lemon Squeezy or Stripe.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
