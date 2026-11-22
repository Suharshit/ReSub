# ReSub

Win back the Lemon Squeezy subscribers who can't migrate (PayPal, India-issued cards) before Lemon Squeezy stops processing payments on March 31, 2027.

Built for the Ship or Die $100K Hackathon (Nov 16 to Dec 16, 2026).

- Project context for Claude Code: `CLAUDE.md`
- Current phase and plan: `docs/plan.md`
- First build (waitlist page): `docs/waitlist-spec.md`
- How it works: `docs/architecture.md`
- Product and offer: `docs/brief.md`

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

Database schema: `supabase/migrations/`. Apply it to the Supabase project before the first signup.

To test founding reservations locally, forward Stripe webhooks:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Waitlist page: what's where

| Path | What |
| --- | --- |
| `app/page.tsx` | Landing page (copy from `docs/brief.md`) and founding-spot counter |
| `app/signup-form.tsx` | Form: email, PayPal subscriber count, destination; two buttons (waitlist / founding) |
| `app/api/signup/route.ts` | Saves the waitlist entry; for founding, opens Stripe Checkout `mode: "setup"` (saves a card, charges nothing) |
| `app/api/stripe/webhook/route.ts` | `checkout.session.completed` → row in `founding_reservations` (status `saved`) |
| `app/thanks/page.tsx` | Thank-you page for both paths; also records the reservation if the webhook is late |
| `app/tracker.tsx` | **Hackathon traffic tracker slot.** Must be filled before any link is shared |
| `lib/founding.ts` | Cap of 20 founding spots, idempotent reservation recording |

## Go-live checklist (waitlist)

- [ ] Hackathon tracker snippet pasted into `app/tracker.tsx`
- [ ] Supabase project created, `supabase/migrations/0001_waitlist.sql` applied
- [ ] Stripe account connected to TrustMRR; live keys set in Vercel
- [ ] Stripe webhook endpoint `https://<domain>/api/stripe/webhook` for `checkout.session.completed`; signing secret in `STRIPE_WEBHOOK_SECRET`
- [ ] New domain (Wayback Machine checked) attached in Vercel; `NEXT_PUBLIC_SITE_URL` set to it
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` set
- [ ] One real test: join waitlist, reserve a spot with a test card, check both rows in Supabase
