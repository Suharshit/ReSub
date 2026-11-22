# Waitlist page spec (Phase 1 build)

The only thing to build before Nov 24. One public page on the new domain plus a thank-you page. Goal: collect PayPal subscriber counts and saved cards for founding spots.

## Must have

1. **Hackathon traffic tracker** snippet on every page (from the hackathon dashboard). Install before sharing any link.
2. **Page copy** from `docs/brief.md` → "The offer". Headline, subhead, problem, how it works, what you get, pricing, guarantee, timing, footer disclaimer.
3. **Waitlist form (free):**
   - Email (required)
   - "Roughly how many of your subscribers pay with PayPal?" (number, required)
   - "Where are you moving?" (Stripe, Stripe Managed Payments, Polar, Paddle, Dodo, Creem, Not sure)
   - Store in `waitlist_entries`.
4. **Reserve a founding spot ($49, charged when live):**
   - Button opens Stripe Checkout in `mode: "setup"` (saves a card, charges nothing).
   - Collect the same two questions first so every reservation also counts as a waitlist entry.
   - On success, store a row in `founding_reservations` with status `saved`.
   - Show clearly: "You won't be charged until ReSub is live for your store (from Dec 2). Remove your card any time before that."
   - Cap founding spots at 20; after that, show waitlist only.
5. **Thank-you page** for both paths, with what happens next and a contact email.
6. **Footer:** "ReSub is an independent tool. Not affiliated with Lemon Squeezy or Stripe."

## Nice to have (only if time)

- A small "spots left: N of 20" counter.
- Owner notification email (Resend) on each new waitlist entry or reservation.

## Not now

Login, dashboard, any Lemon Squeezy/Stripe/Polar connection for merchants. That's Phase 2.

## Env vars

See `.env.example`: Supabase URL and keys, Stripe secret and publishable keys, Stripe webhook secret, site URL.
