# Architecture

ReSub is a thin layer between a merchant's Lemon Squeezy store and their new payment provider (Stripe or Polar in v1). It reads stuck subscriptions from Lemon Squeezy, creates matching checkouts on the new provider, emails customers, and cancels the old subscription once the new one is active. It never holds money or card details.

```
Merchant ──setup──▶ ReSub (Next.js + Supabase + cron)
                      │  ▲
       read subs,     │  │ webhooks (new sub active)
       cancel old     ▼  │
  Lemon Squeezy ◀──── ReSub ────▶ Stripe / Polar (checkout per customer)
                      │
                      ▼ heads-up + reminders (Resend)
                 Their customer ──clicks own checkout──▶ Stripe / Polar
```

## Merchant flow (MVP)

1. **Connect**: paste a Lemon Squeezy API key; connect Stripe (restricted key) or Polar (access token).
2. **Scan**: pull active subscriptions; flag the ones that can't migrate (paid via PayPal, or listed in the merchant's CSV of affected subscriptions from the Lemon Squeezy dashboard).
3. **Map**: match each Lemon Squeezy product/variant to a destination price. Same price by default.
4. **Preview**: list customer, plan, monthly value, next renewal date; total recurring revenue at risk.
5. **Launch**: create one checkout per customer whose first charge falls on the old renewal date (no double billing).
6. **Chase**: heads-up email first (warns that Lemon Squeezy will send an automatic cancellation notice, says to ignore it, gives the link), then reminders 7, 3 and 1 days before the old renewal date.
7. **Close the loop**: on the provider's webhook, cancel the Lemon Squeezy subscription at period end; mark the customer recovered.
8. **Report**: revenue at risk vs. recovered, outstanding customers, CSV export.

## Components

| Part | Tool | What it does |
| --- | --- | --- |
| Landing page + app | Next.js on Vercel, new domain | Waitlist page, merchant dashboard, API routes |
| Database | Supabase Postgres | Waitlist answers, stores, subscriptions, campaigns, email and webhook events |
| Lemon Squeezy connection | Lemon Squeezy REST API, merchant's own key | List subscriptions; cancel old ones |
| Destination | Stripe API (restricted key) or Polar API (access token) | Checkout per customer with delayed first charge; webhooks back |
| Reminders | Vercel Cron + Resend | Send the 4-email sequence; stop when a customer re-subscribes |
| ReSub's own payments | Stripe Checkout `mode: "setup"`, connected to TrustMRR | Save founding cards now; charge $49 once the store is live |

## Data model (draft)

- `waitlist_entries`: email, paypal_sub_count, destination, created_at
- `founding_reservations`: email, stripe_customer_id, stripe_setup_intent_id, status (saved, charged, cancelled, failed), charged_at
- `stores`: owner email, name, ls_store_id, destination (stripe | polar), encrypted keys
- `ls_subscriptions`: store_id, ls_subscription_id, customer name/email, product/variant, price, renews_at, payment method, migratable (bool)
- `price_mappings`: store_id, ls_variant_id, destination_price_id
- `campaigns`: store_id, status, launched_at, ended_at
- `campaign_customers`: campaign_id, ls_subscription_id, checkout_url, status (sent, recovered, outstanding, opted_out), recovered_at
- `email_events`, `webhook_events`: raw logs for debugging and the report

## API facts to verify before coding

These come from research, not from testing. Check each against the official docs first.

- [ ] **Lemon Squeezy:** does the subscription object say whether it's paid via PayPal (a payment-processor field)? If not, rely on the merchant's CSV export. Which field holds the next renewal date (`renews_at`)?
- [ ] **Lemon Squeezy:** how to cancel a subscription via API, and does it end at period end?
- [ ] **Lemon Squeezy:** what the official migration FAQ says about subscriptions that need customer action (docs.lemonsqueezy.com/migration/faq).
- [ ] **Stripe:** Checkout in subscription mode with a delayed first charge (`subscription_data.trial_end`), and its minimum/maximum lead time.
- [ ] **Stripe Managed Payments:** does it accept a delayed first charge in Checkout? If not, v1 supports regular Stripe accounts only.
- [ ] **Stripe:** Checkout `mode: "setup"` then charging the saved card off-session later; what an Indian Stripe account allows for international cards.
- [ ] **Polar:** creating a checkout per customer with a delayed first charge or trial; webhook for subscription created.

## Out of scope

License keys, file delivery, affiliates, storefronts, holding merchant money, storing card data. Paddle, Creem and Dodo destinations come after v1 if founding stores ask.
