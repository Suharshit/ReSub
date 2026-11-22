import type { Metadata } from "next";
import { env } from "@/lib/env";
import { recordReservation } from "@/lib/founding";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Thanks | ReSub", robots: { index: false } };

type Params = { type?: string; session_id?: string };

/** Confirms the card was saved. Also records it, in case the webhook hasn't arrived yet. */
async function confirmReservation(sessionId: string | undefined): Promise<boolean> {
  if (!sessionId || !sessionId.startsWith("cs_")) return false;
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    return await recordReservation(session);
  } catch (err) {
    console.error("could not confirm reservation", err);
    return false;
  }
}

export default async function Thanks({ searchParams }: { searchParams: Promise<Params> }) {
  const { type, session_id } = await searchParams;
  const contact = env.contactEmail();
  const reserved = type === "reserved" && (await confirmReservation(session_id));

  return (
    <main className="thanks">
      {reserved ? (
        <>
          <h1>Your founding spot is reserved.</h1>
          <p className="lede">Your card is saved with Stripe. Nothing has been charged.</p>
          <h2>What happens next</h2>
          <ol className="steps">
            <li>We&apos;ll email you before Dec 2 to set up your store: connect Lemon Squeezy and your new provider.</li>
            <li>You review every subscriber at risk before anything is sent.</li>
            <li>
              The $49 one-time charge happens only once your campaign is live. If ReSub doesn&apos;t win back at least one
              subscriber, full refund.
            </li>
          </ol>
          <p>Changed your mind? Email us before your campaign goes live and we&apos;ll remove your card.</p>
        </>
      ) : type === "reserved" ? (
        <>
          <h1>We couldn&apos;t confirm your card yet.</h1>
          <p className="lede">
            If you finished Stripe checkout, refresh this page in a few seconds. Nothing has been charged either way.
          </p>
        </>
      ) : (
        <>
          <h1>{type === "full" ? "Founding spots are gone, but you're on the waitlist." : "You're on the waitlist."}</h1>
          <p className="lede">Thanks for sharing your numbers. They decide what we build first.</p>
          <h2>What happens next</h2>
          <ol className="steps">
            <li>We&apos;ll email you when ReSub opens for your provider (from Dec 2).</li>
            <li>Nothing to pay, nothing to connect until then.</li>
          </ol>
          {type !== "full" && (
            <p>
              Want to be first? <a href="/#join">Reserve a founding spot</a>: $49 one-time, charged only once ReSub is
              live for your store.
            </p>
          )}
        </>
      )}

      {contact && (
        <p className="contact">
          Questions? <a href={`mailto:${contact}`}>{contact}</a>
        </p>
      )}
      <p>
        <a href="/">← Back to ReSub</a>
      </p>
    </main>
  );
}
