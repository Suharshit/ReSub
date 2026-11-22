# ReSub

ReSub wins back the Lemon Squeezy subscribers who can't migrate. It finds them, sends each one a personal checkout link on the merchant's new payment provider, chases them with reminders, and cancels the old Lemon Squeezy subscription once the new one is live. No double billing.

Built solo by Suharshit for Marc Lou's **Ship or Die $100K Hackathon** (Nov 16 to Dec 16, 2026). Winners are ranked by **verified profit** (revenue minus refunds, fees and ad spend), checked through TrustMRR.

## Read these first

- @docs/plan.md: current phase, dates, go/stop rule, hackathon rules that affect the code
- @docs/architecture.md: how it works, stack, data model, API facts to verify
- `docs/waitlist-spec.md`: spec for the first thing we build (the waitlist page)
- `docs/brief.md`: the product, the offer copy, answers to customer questions

Business source of truth (offer, outreach, lead tracker) lives in the Claude doc: https://claude.ai/artifact/2f5FRMho3ZS5GcXb7Tjc4u

## Where we are now

**Phase 1, Validate (Nov 22 to 24, 2026).** Only the waitlist page gets built. Do not start the full app until the go signal: 5+ merchants share real PayPal subscriber counts and 2+ save a card for a founding spot by **Nov 24**. If that doesn't happen, the project stops.

Phase 2 (Nov 25 to Dec 1) builds the MVP. Launch is **Dec 2**, the day Lemon Squeezy's migration tooling opens.

## The problem in one paragraph

Lemon Squeezy stops processing payments on **March 31, 2027** (announced Nov 16, 2026, no extension). Card subscriptions can migrate. **PayPal subscriptions cannot migrate anywhere**; those customers must repurchase. Customers on India-issued cards must reauthorise. Lemon Squeezy also sends customers an automatic cancellation email during migration that merchants can't switch off. Merchants are moving to Stripe Managed Payments, Polar, Paddle, Dodo and Creem.

## Stack

- Next.js (App Router, TypeScript strict) on Vercel
- Supabase Postgres
- Stripe (ReSub's own payments, plus merchant destination in v1)
- Polar (merchant destination in v1)
- Resend (email)
- Vercel Cron (reminder job)

Use free tiers. Any paid service is a hackathon cost: note it in `docs/plan.md` under Costs.

## Rules that affect the code

- **Payments only through Stripe**, connected to TrustMRR. No Razorpay, no other processor for ReSub's own revenue.
- **The hackathon traffic tracker must be on every public page before any link is shared.** Get the snippet from the hackathon dashboard.
- **Founding spots save a card (Stripe Checkout `mode: "setup"`) and are charged $49 only once the merchant's campaign is live.** Never charge before that.
- **Never store card data.** Card details only ever go into Stripe or Polar hosted checkout.
- Merchant API keys (Lemon Squeezy key, Stripe restricted key, Polar token) are stored encrypted at rest. Ask for the narrowest scope possible.
- Store only what the campaign needs: customer name, email, plan, price, renewal date. Delete it 30 days after a campaign ends.
- Never put "Lemon" or "Stripe" in ReSub's name, logo or domain. Footer: "ReSub is an independent tool. Not affiliated with Lemon Squeezy or Stripe."

## Working style

- Ship small and simple; the deadline is fixed. Prefer boring, well-documented APIs.
- Ask before adding a dependency or a paid service.
- Secrets live in `.env.local` (never committed). Keep `.env.example` up to date with names only.
- Anything marked "verify" in `docs/architecture.md` must be checked against the official API docs before code depends on it.
- Small commits with clear messages; the organisers review GitHub history.
