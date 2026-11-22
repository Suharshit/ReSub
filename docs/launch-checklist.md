# Waitlist launch checklist

Code is done. What's left needs Suharshit's accounts. Do these in order. Don't share any link until steps 1 to 4 are ticked.

Already done: GitHub repo, Supabase project `resub` (us-east-1, `https://bthxgezvrpxhjubdrkaa.supabase.co`) with the waitlist schema applied.

## 1. Vercel project (5 min)

- [ ] vercel.com → Add New → Project → import `Suharshit/ReSub`. Framework: Next.js (auto). Don't deploy yet.
- [ ] Settings → Environment Variables (Production + Preview):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://<project>.vercel.app` for now, `https://tryresub.com` after step 3 |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bthxgezvrpxhjubdrkaa.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API keys → publishable/anon key (not used by the waitlist yet, but set it) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API keys → service_role / secret key. **Mark as Sensitive.** |
| `NEXT_PUBLIC_CONTACT_EMAIL` | the public contact address you want shown |

- [ ] Deploy. With no Stripe keys, the page runs **waitlist-only** and founding spots say "Opens in a day or two". That's safe to test.
- [ ] Test: submit the form once, then check the row in Supabase → Table Editor → `waitlist_entries`. Delete the test row after.
- [ ] Plan note: Vercel Hobby is for non-commercial use. Upgrade to Pro ($20/mo, log under Costs) before card saving goes live, or decide to stay on Hobby knowingly.

## 2. Hackathon tracker (before ANY link is shared)

- [ ] Copy the snippet from the hackathon dashboard into `app/tracker.tsx` (instructions in the file), commit, push.
- [ ] Open the live site, view source or the network tab, and confirm the tracker loads on `/` and `/thanks`.

## 3. Domain: tryresub.com

- [ ] Re-check Wayback history at https://web.archive.org/web/*/tryresub.com (was clean on Nov 22), then buy it.
- [ ] Log the cost in `docs/plan.md` → Costs.
- [ ] Vercel → Project → Settings → Domains → add `tryresub.com` (and `www` redirecting to it). Set DNS as Vercel shows.
- [ ] Change `NEXT_PUBLIC_SITE_URL` to `https://tryresub.com`, then redeploy.

## 4. Stripe (founding spots)

- [ ] Stripe account activated; **connect it to TrustMRR first**.
- [ ] Confirm the account can save and later charge international cards (Indian accounts have limits; see `docs/architecture.md`).
- [ ] Developers → Webhooks → add endpoint `https://tryresub.com/api/stripe/webhook`, event `checkout.session.completed`.
- [ ] Set in Vercel (Sensitive): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (the endpoint's signing secret), plus `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Redeploy. Founding spots appear automatically once both secret vars exist.
- [ ] Test with test-mode keys first (card 4242 4242 4242 4242): reserve, confirm the `founding_reservations` row has status `saved`, confirm nothing was charged in Stripe. Then switch to live keys and delete the test rows.

## 5. Optional: signup alerts by email

- [ ] Resend account → API key → `RESEND_API_KEY`; `OWNER_EMAIL` = your Resend login email.
- [ ] After the domain is verified in Resend, set `RESEND_FROM` = `ReSub <hello@tryresub.com>`.
