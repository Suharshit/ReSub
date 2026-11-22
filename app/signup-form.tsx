"use client";

import { useState, type FormEvent } from "react";
import { DESTINATIONS, type Intent, type SignupResult } from "@/lib/signup";
import { IconLock } from "./icons";

export function SignupForm({ foundingOpen }: { foundingOpen: boolean }) {
  const [pending, setPending] = useState<Intent | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent: Intent = submitter?.value === "reserve" ? "reserve" : "waitlist";
    const form = new FormData(e.currentTarget);

    setPending(intent);
    setError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          paypalSubCount: form.get("paypalSubCount"),
          destination: form.get("destination"),
          website: form.get("website"),
          intent,
        }),
      });
      const data = (await res.json()) as SignupResult;
      if (!data.ok) {
        setError(data.error);
        setPending(null);
        return;
      }
      if (data.next === "checkout") window.location.href = data.url;
      else if (data.next === "full") window.location.href = "/thanks?type=full";
      else window.location.href = "/thanks?type=waitlist";
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(null);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="full">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" placeholder="you@yourapp.com" />
      </label>

      <label>
        <span>Roughly how many of your subscribers pay with PayPal?</span>
        <input name="paypalSubCount" type="number" required min={0} step={1} inputMode="numeric" placeholder="e.g. 120" />
      </label>

      <label>
        <span>Where are you moving?</span>
        <select name="destination" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {DESTINATIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </label>

      {/* Honeypot for bots. Hidden from people and screen readers. */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="actions">
        {foundingOpen && (
          <button type="submit" name="intent" value="reserve" className="btn primary" disabled={pending !== null}>
            {pending === "reserve" ? "Opening secure checkout…" : "Reserve a founding spot ($49, charged when live)"}
          </button>
        )}
        <button
          type="submit"
          name="intent"
          value="waitlist"
          className={foundingOpen ? "btn secondary" : "btn primary"}
          disabled={pending !== null}
        >
          {pending === "waitlist" ? "Joining…" : "Join the waitlist, free"}
        </button>
      </div>

      {foundingOpen && (
        <p className="fineprint">
          <IconLock className="ico-sm" />
          You won&apos;t be charged until ReSub is live for your store (from Dec 2). Remove your card any time
          before that. Card details go only to Stripe&apos;s secure checkout.
        </p>
      )}
    </form>
  );
}
