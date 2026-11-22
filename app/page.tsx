import { stripeConfigured } from "@/lib/env";
import { FOUNDING_CAP, foundingSpotsTaken } from "@/lib/founding";
import { SignupForm } from "./signup-form";

export const dynamic = "force-dynamic";

async function spotsLeft(): Promise<number | null> {
  try {
    return Math.max(0, FOUNDING_CAP - (await foundingSpotsTaken()));
  } catch (err) {
    console.error("could not count founding spots", err);
    return null; // Unknown: hide the counter but keep the offer open; the API enforces the cap.
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const [left, params] = await Promise.all([spotsLeft(), searchParams]);
  const foundingLive = stripeConfigured();
  const foundingOpen = foundingLive && (left === null || left > 0);

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Lemon Squeezy stops processing payments on March 31, 2027</p>
        <h1>Don&apos;t lose your PayPal subscribers when Lemon Squeezy shuts down.</h1>
        <p className="lede">
          PayPal subscriptions can&apos;t migrate to Stripe or anywhere else. ReSub wins them back for you: one personal
          checkout link per customer, automatic reminders, and no double charges.
        </p>
        <a href="#join" className="btn primary">
          Reserve a spot
        </a>
      </section>

      <section>
        <h2>The problem</h2>
        <ul className="bullets">
          <li>Lemon Squeezy stops processing payments on March 31, 2027, renewals included.</li>
          <li>Card subscriptions can move. PayPal subscriptions can&apos;t, so those customers have to buy again.</li>
          <li>One &ldquo;please re-subscribe&rdquo; email won&apos;t bring them all back. Every one you lose costs you every month.</li>
        </ul>
      </section>

      <section>
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <strong>Connect</strong> Lemon Squeezy and your new provider (Stripe or Polar). Two keys, two minutes.
          </li>
          <li>
            <strong>See what&apos;s at risk:</strong> every subscriber who can&apos;t migrate, with plan, renewal date and
            monthly value.
          </li>
          <li>
            <strong>Launch:</strong> each customer gets a one-click checkout at the same price, with nothing to pay until
            their current period ends. Reminders go out automatically. When they re-subscribe, the old subscription is
            cancelled for you.
          </li>
        </ol>
      </section>

      <section>
        <h2>What you get</h2>
        <ul className="bullets">
          <li>Revenue at risk vs. revenue recovered, on one screen</li>
          <li>
            A 4-email sequence sent in your name, starting with a heads-up so Lemon Squeezy&apos;s automatic cancellation
            email doesn&apos;t scare customers away
          </li>
          <li>No double billing: the new subscription starts when the old one would have renewed</li>
          <li>CSV export of everyone who re-subscribed and everyone still outstanding</li>
        </ul>
      </section>

      <section id="join" className="join">
        <h2>Join</h2>
        <div className="pricing">
          <div className="tier">
            <h3>Waitlist</h3>
            <p className="price">Free</p>
            <p>Tell us how many subscribers pay with PayPal and where you&apos;re moving.</p>
          </div>
          <div className={`tier ${foundingOpen || !foundingLive ? "featured" : "soldout"}`}>
            <h3>Founding spot</h3>
            <p className="price">
              $49 <span>one-time</span>
            </p>
            <p>
              Save a card now. Charged only once ReSub is live for your store (from Dec 2). First {FOUNDING_CAP} stores,
              then $99.
            </p>
            {!foundingLive ? (
              <p className="spots">Opens in a day or two. Join the waitlist to get first pick.</p>
            ) : (
              left !== null && (
                <p className="spots">{foundingOpen ? `${left} of ${FOUNDING_CAP} spots left` : "All founding spots taken"}</p>
              )
            )}
          </div>
        </div>

        {params.cancelled && (
          <p className="notice">No card saved. You can try again, or just join the free waitlist.</p>
        )}

        <SignupForm foundingOpen={foundingOpen} />
      </section>

      <section>
        <h2>Guarantee</h2>
        <p>
          You pay nothing until your campaign is live. If ReSub then doesn&apos;t win back at least one subscriber, full
          refund.
        </p>
      </section>

      <section>
        <h2>Timing</h2>
        <table className="dates">
          <tbody>
            <tr>
              <td>Dec 2, 2026</td>
              <td>Lemon Squeezy&apos;s migration tooling opens. ReSub goes live for founding stores.</td>
            </tr>
            <tr>
              <td>Mid-January 2027</td>
              <td>Recommended latest start. A move can take up to 8 weeks.</td>
            </tr>
            <tr>
              <td>Mar 31, 2027</td>
              <td>All Lemon Squeezy processing stops, renewals included. No extension.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Questions</h2>
        <dl className="faq">
          <dt>Can&apos;t Lemon Squeezy&apos;s tool do this?</dt>
          <dd>
            It moves card subscriptions. PayPal subscriptions can&apos;t migrate; customers must repurchase. It doesn&apos;t
            give each one a personal checkout, chase them, cancel the old subscription, or track who came back.
          </dd>
          <dt>Will customers be charged twice?</dt>
          <dd>
            No. The new subscription&apos;s first charge is on the old renewal date, and the old one is cancelled at period
            end once the new one is active.
          </dd>
          <dt>What access do you need?</dt>
          <dd>
            A fresh Lemon Squeezy API key (revoke it after) and a Stripe restricted key or Polar token. Card details go
            only into Stripe or Polar checkout. We store names, emails, plan and dates, and delete them 30 days after the
            campaign.
          </dd>
          <dt>Which providers?</dt>
          <dd>Stripe and Polar first. Paddle, Creem and Dodo next if founding stores ask.</dd>
          <dt>Why one-time pricing?</dt>
          <dd>It&apos;s a one-off job that ends March 31, 2027.</dd>
        </dl>
      </section>
    </main>
  );
}
