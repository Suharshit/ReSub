import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { env } from "@/lib/env";
import { recordReservation } from "@/lib/founding";
import { stripe } from "@/lib/stripe";

// Stripe → us. Subscribe this endpoint to: checkout.session.completed
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, signature, env.stripeWebhookSecret());
  } catch (err) {
    console.error("webhook signature check failed", err);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await recordReservation(event.data.object);
    }
  } catch (err) {
    console.error("webhook handling failed", event.id, err);
    // 500 makes Stripe retry later.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
