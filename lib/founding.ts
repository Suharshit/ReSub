// Server-only: founding-spot cap and recording saved cards. Nothing here charges a card.
import type Stripe from "stripe";
import { notifyOwner } from "./notify";
import { db } from "./supabase";
import { stripe } from "./stripe";

export const FOUNDING_CAP = 20;
export const FOUNDING_PURPOSE = "founding_spot";

/** Spots taken = reservations that still hold a saved card, or were charged. */
export async function foundingSpotsTaken(): Promise<number> {
  const { count, error } = await db()
    .from("founding_reservations")
    .select("id", { count: "exact", head: true })
    .in("status", ["saved", "charged"]);
  if (error) throw error;
  return count ?? 0;
}

/**
 * Record a completed setup-mode Checkout Session as a founding reservation.
 * Idempotent: called from both the webhook and the thank-you page.
 */
export async function recordReservation(session: Stripe.Checkout.Session): Promise<boolean> {
  if (session.mode !== "setup" || session.status !== "complete") return false;
  if (session.metadata?.purpose !== FOUNDING_PURPOSE) return false;

  const setupIntentId =
    typeof session.setup_intent === "string" ? session.setup_intent : session.setup_intent?.id;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (!setupIntentId || !customerId) return false;

  const setupIntent = await stripe().setupIntents.retrieve(setupIntentId);
  if (setupIntent.status !== "succeeded") return false;
  const paymentMethodId =
    typeof setupIntent.payment_method === "string"
      ? setupIntent.payment_method
      : (setupIntent.payment_method?.id ?? null);

  // Make the saved card the customer's default so it can be charged once their campaign is live.
  if (paymentMethodId) {
    await stripe().customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  }

  const email = (session.metadata?.email ?? session.customer_details?.email ?? "").toLowerCase();

  const { data: inserted, error } = await db().from("founding_reservations").upsert(
    {
      email,
      stripe_customer_id: customerId,
      stripe_checkout_session_id: session.id,
      stripe_setup_intent_id: setupIntentId,
      stripe_payment_method_id: paymentMethodId,
      status: "saved",
    },
    { onConflict: "stripe_setup_intent_id", ignoreDuplicates: true },
  ).select("id");
  if (error) throw error;

  // Empty when the row already existed (webhook retry, or thank-you page reload).
  if (inserted && inserted.length > 0) {
    await notifyOwner(`ReSub founding spot reserved: ${email}`, `Card saved (not charged) for ${email}.`);
  }
  return true;
}
