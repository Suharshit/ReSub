import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { FOUNDING_CAP, FOUNDING_PURPOSE, foundingSpotsTaken } from "@/lib/founding";
import { parseSignup, type SignupResult } from "@/lib/signup";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/supabase";

function reply(body: SignupResult, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return reply({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: real people never fill the hidden "website" field.
  if (raw && typeof raw === "object" && (raw as Record<string, unknown>).website) {
    return reply({ ok: true, next: "thanks" });
  }

  const input = parseSignup(raw);
  if (typeof input === "string") return reply({ ok: false, error: input }, 400);

  try {
    // Every signup, free or founding, is a waitlist entry. Re-submitting updates the answers.
    const { error } = await db().from("waitlist_entries").upsert(
      {
        email: input.email,
        paypal_sub_count: input.paypalSubCount,
        destination: input.destination,
        wants_founding: input.intent === "reserve",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    );
    if (error) throw error;

    if (input.intent === "waitlist") return reply({ ok: true, next: "thanks" });

    if ((await foundingSpotsTaken()) >= FOUNDING_CAP) return reply({ ok: true, next: "full" });

    // Save a card only. mode "setup" never charges.
    const customer = await stripe().customers.create({
      email: input.email,
      metadata: { purpose: FOUNDING_PURPOSE },
    });

    const site = env.siteUrl();
    const session = await stripe().checkout.sessions.create({
      mode: "setup",
      currency: "usd",
      allowed_payment_method_types: ["card"],
      customer: customer.id,
      success_url: `${site}/thanks?type=reserved&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/?cancelled=1#join`,
      metadata: { purpose: FOUNDING_PURPOSE, email: input.email },
      setup_intent_data: { metadata: { purpose: FOUNDING_PURPOSE, email: input.email } },
      custom_text: {
        submit: {
          message:
            "You won't be charged now. $49 one-time is charged only once ReSub is live for your store (from Dec 2). Remove your card any time before that.",
        },
      },
    });

    if (!session.url) throw new Error("Stripe returned no Checkout URL");
    return reply({ ok: true, next: "checkout", url: session.url });
  } catch (err) {
    console.error("signup failed", err);
    return reply({ ok: false, error: "Something went wrong. Please try again in a minute." }, 500);
  }
}
