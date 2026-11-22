import { stripeConfigured } from "@/lib/env";
import { FOUNDING_CAP, foundingSpotsTaken } from "@/lib/founding";
import {
  IconArrow,
  IconBan,
  IconCalendarX,
  IconChart,
  IconCheck,
  IconChevron,
  IconDownload,
  IconLock,
  IconMail,
  IconPlug,
  IconRadar,
  IconSend,
  IconShield,
  IconTrendDown,
} from "./icons";
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

const FAQ = [
  {
    q: "Can't Lemon Squeezy's tool do this?",
    a: "It moves card subscriptions. PayPal subscriptions can't migrate; customers must repurchase. It doesn't give each one a personal checkout, chase them, cancel the old subscription, or track who came back.",
  },
  {
    q: "Will customers be charged twice?",
    a: "No. The new subscription's first charge is on the old renewal date, and the old one is cancelled at period end once the new one is active.",
  },
  {
    q: "What access do you need?",
    a: "A fresh Lemon Squeezy API key (revoke it after) and a Stripe restricted key or Polar token. Card details go only into Stripe or Polar checkout. We store names, emails, plan and dates, and delete them 30 days after the campaign.",
  },
  { q: "Which providers?", a: "Stripe and Polar first. Paddle, Creem and Dodo next if founding stores ask." },
  { q: "Why one-time pricing?", a: "It's a one-off job that ends March 31, 2027." },
];

export default async function Home({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const [left, params] = await Promise.all([spotsLeft(), searchParams]);
  const foundingLive = stripeConfigured();
  const foundingOpen = foundingLive && (left === null || left > 0);
  const taken = left === null ? 0 : FOUNDING_CAP - left;

  return (
    <main>
      {/* Hero */}
      <section className="hero container">
        <div className="hero-copy">
          <p className="pill">
            <span className="pulse" aria-hidden="true" />
            Lemon Squeezy stops processing payments on March 31, 2027
          </p>
          <h1>
            Don&apos;t lose your <span className="grad">PayPal subscribers</span> when Lemon Squeezy shuts down.
          </h1>
          <p className="lede">
            PayPal subscriptions can&apos;t migrate to Stripe or anywhere else. ReSub wins them back for you: one personal
            checkout link per customer, automatic reminders, and no double charges.
          </p>
          <div className="hero-ctas">
            <a href="#join" className="btn primary lg">
              Reserve a spot <IconArrow className="ico-sm" />
            </a>
            <a href="#how" className="btn ghost lg">
              See how it works
            </a>
          </div>
          <ul className="trust">
            <li>
              <IconCheck className="ico-sm" /> No double billing
            </li>
            <li>
              <IconLock className="ico-sm" /> Card details stay in Stripe or Polar
            </li>
            <li>
              <IconShield className="ico-sm" /> Full refund guarantee
            </li>
          </ul>
        </div>

        <div className="mock" aria-label="Example ReSub campaign dashboard (illustration)">
          <div className="mock-bar">
            <span />
            <span />
            <span />
            <p>Example campaign</p>
          </div>
          <div className="mock-body">
            <div className="mock-stats">
              <div>
                <p className="mock-label">Revenue at risk</p>
                <p className="mock-num risk">$2,480/mo</p>
              </div>
              <div>
                <p className="mock-label">Recovered</p>
                <p className="mock-num ok">$1,615/mo</p>
              </div>
            </div>
            <div className="mock-progress" role="presentation">
              <span style={{ width: "65%" }} />
            </div>
            <p className="mock-caption">65% won back · 18 days to the last renewal</p>
            <ul className="mock-list">
              <li>
                <span className="avatar a1">JM</span>
                <span className="who">j•••@studio.dev</span>
                <span className="tag ok">Recovered</span>
              </li>
              <li>
                <span className="avatar a2">AR</span>
                <span className="who">a•••@gmail.com</span>
                <span className="tag ok">Recovered</span>
              </li>
              <li>
                <span className="avatar a3">KS</span>
                <span className="who">k•••@acme.io</span>
                <span className="tag warn">Reminder 2 sent</span>
              </li>
              <li>
                <span className="avatar a4">PL</span>
                <span className="who">p•••@hey.com</span>
                <span className="tag">Heads-up sent</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section container">
        <p className="kicker">The problem</p>
        <h2 className="section-title">Half your PayPal subscribers could quietly disappear.</h2>
        <div className="grid3">
          <article className="card">
            <span className="ico-box risk">
              <IconCalendarX />
            </span>
            <p>Lemon Squeezy stops processing payments on March 31, 2027, renewals included.</p>
          </article>
          <article className="card">
            <span className="ico-box risk">
              <IconBan />
            </span>
            <p>Card subscriptions can move. PayPal subscriptions can&apos;t, so those customers have to buy again.</p>
          </article>
          <article className="card">
            <span className="ico-box risk">
              <IconTrendDown />
            </span>
            <p>
              One &ldquo;please re-subscribe&rdquo; email won&apos;t bring them all back. Every one you lose costs you every
              month.
            </p>
          </article>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="section container">
        <p className="kicker">How it works</p>
        <h2 className="section-title">Three steps. Then ReSub does the chasing.</h2>
        <ol className="steps">
          <li className="card step">
            <span className="step-num">1</span>
            <span className="ico-box">
              <IconPlug />
            </span>
            <h3>Connect</h3>
            <p>Connect Lemon Squeezy and your new provider (Stripe or Polar). Two keys, two minutes.</p>
          </li>
          <li className="card step">
            <span className="step-num">2</span>
            <span className="ico-box">
              <IconRadar />
            </span>
            <h3>See what&apos;s at risk</h3>
            <p>Every subscriber who can&apos;t migrate, with plan, renewal date and monthly value.</p>
          </li>
          <li className="card step">
            <span className="step-num">3</span>
            <span className="ico-box">
              <IconSend />
            </span>
            <h3>Launch</h3>
            <p>
              Each customer gets a one-click checkout at the same price, with nothing to pay until their current period
              ends. Reminders go out automatically. When they re-subscribe, the old subscription is cancelled for you.
            </p>
          </li>
        </ol>
      </section>

      {/* What you get */}
      <section className="section container">
        <p className="kicker">What you get</p>
        <h2 className="section-title">Everything to win them back, nothing to babysit.</h2>
        <div className="grid2">
          <article className="card feature">
            <span className="ico-box ok">
              <IconChart />
            </span>
            <p>Revenue at risk vs. revenue recovered, on one screen</p>
          </article>
          <article className="card feature">
            <span className="ico-box ok">
              <IconMail />
            </span>
            <p>
              A 4-email sequence sent in your name, starting with a heads-up so Lemon Squeezy&apos;s automatic cancellation
              email doesn&apos;t scare customers away
            </p>
          </article>
          <article className="card feature">
            <span className="ico-box ok">
              <IconShield />
            </span>
            <p>No double billing: the new subscription starts when the old one would have renewed</p>
          </article>
          <article className="card feature">
            <span className="ico-box ok">
              <IconDownload />
            </span>
            <p>CSV export of everyone who re-subscribed and everyone still outstanding</p>
          </article>
        </div>
      </section>

      {/* Pricing + join */}
      <section id="pricing" className="section container">
        <p className="kicker">Join</p>
        <h2 className="section-title">Get in before Dec 2.</h2>

        <div className="pricing">
          <div className="tier">
            <p className="tier-name">Waitlist</p>
            <p className="price">Free</p>
            <p className="tier-desc">Tell us how many subscribers pay with PayPal and where you&apos;re moving.</p>
          </div>
          <div className={`tier featured ${foundingLive && !foundingOpen ? "soldout" : ""}`}>
            <span className="badge">Founding · first {FOUNDING_CAP} stores</span>
            <p className="tier-name">Founding spot</p>
            <p className="price">
              $49 <span>one-time</span>
            </p>
            <p className="tier-desc">
              Save a card now. Charged only once ReSub is live for your store (from Dec 2). First {FOUNDING_CAP} stores,
              then $99.
            </p>
            {!foundingLive ? (
              <p className="spots">Opens in a day or two. Join the waitlist to get first pick.</p>
            ) : left !== null ? (
              <div className="spots-wrap">
                <div className="spots-bar" role="presentation">
                  <span style={{ width: `${(taken / FOUNDING_CAP) * 100}%` }} />
                </div>
                <p className="spots">
                  {foundingOpen ? `${left} of ${FOUNDING_CAP} spots left` : "All founding spots taken"}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div id="join" className="join-panel">
          {params.cancelled && (
            <p className="notice">No card saved. You can try again, or just join the free waitlist.</p>
          )}
          <SignupForm foundingOpen={foundingOpen} />
        </div>
      </section>

      {/* Guarantee */}
      <section className="section container">
        <div className="guarantee">
          <span className="ico-box ok lg">
            <IconShield />
          </span>
          <div>
            <h2>Guarantee</h2>
            <p>
              You pay nothing until your campaign is live. If ReSub then doesn&apos;t win back at least one subscriber,
              full refund.
            </p>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section className="section container">
        <p className="kicker">Timing</p>
        <h2 className="section-title">The clock is already running.</h2>
        <ol className="timeline">
          <li>
            <span className="dot" />
            <p className="when">Dec 2, 2026</p>
            <p>Lemon Squeezy&apos;s migration tooling opens. ReSub goes live for founding stores.</p>
          </li>
          <li>
            <span className="dot" />
            <p className="when">Mid-January 2027</p>
            <p>Recommended latest start. A move can take up to 8 weeks.</p>
          </li>
          <li>
            <span className="dot end" />
            <p className="when">Mar 31, 2027</p>
            <p>All Lemon Squeezy processing stops, renewals included. No extension.</p>
          </li>
        </ol>
      </section>

      {/* FAQ */}
      <section id="faq" className="section container narrow">
        <p className="kicker">Questions</p>
        <h2 className="section-title">Answers before you ask.</h2>
        <div className="faq">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <IconChevron className="chev" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section container">
        <div className="cta-band">
          <h2>Every PayPal subscriber you don&apos;t win back costs you every month.</h2>
          <a href="#join" className="btn light lg">
            Reserve a spot <IconArrow className="ico-sm" />
          </a>
        </div>
      </section>
    </main>
  );
}
