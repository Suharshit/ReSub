// Shared by the form (client) and the API route (server). No secrets here.
export const DESTINATIONS = [
  { value: "stripe", label: "Stripe" },
  { value: "stripe_managed_payments", label: "Stripe Managed Payments" },
  { value: "polar", label: "Polar" },
  { value: "paddle", label: "Paddle" },
  { value: "dodo", label: "Dodo" },
  { value: "creem", label: "Creem" },
  { value: "not_sure", label: "Not sure" },
] as const;

export type Destination = (typeof DESTINATIONS)[number]["value"];
export type Intent = "waitlist" | "reserve";

export type SignupInput = {
  email: string;
  paypalSubCount: number;
  destination: Destination;
  intent: Intent;
};

export type SignupResult =
  | { ok: true; next: "thanks" }
  | { ok: true; next: "checkout"; url: string }
  | { ok: true; next: "full" }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseSignup(raw: unknown): SignupInput | string {
  if (!raw || typeof raw !== "object") return "Invalid request.";
  const r = raw as Record<string, unknown>;

  const email = typeof r.email === "string" ? r.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) return "Please enter a valid email.";

  const count = Number(r.paypalSubCount);
  if (r.paypalSubCount === "" || !Number.isInteger(count) || count < 0 || count > 10_000_000) {
    return "Please enter roughly how many subscribers pay with PayPal (a whole number).";
  }

  const destination = DESTINATIONS.find((d) => d.value === r.destination)?.value;
  if (!destination) return "Please choose where you're moving.";

  const intent: Intent = r.intent === "reserve" ? "reserve" : "waitlist";
  return { email, paypalSubCount: count, destination, intent };
}
