# Plan

As of Nov 22, 2026. Hackathon ends Dec 16, 2026.

## Phases

| Phase | Dates | What happens | Done when |
| --- | --- | --- | --- |
| 1. Validate | Nov 22 to 24 | Outreach on X, waitlist page live, collect PayPal counts and saved cards | Go/stop decision on Nov 24 |
| 2. Build the MVP | Nov 25 to Dec 1 | Connect, scan, map, checkout links, emails, auto-cancel | A test store runs a full campaign end to end |
| 3. Launch | Dec 2 | Lemon Squeezy migration tooling opens; founding stores onboarded; campaigns go live; saved cards charged | First founding store live and charged |
| 4. Sell and recover | Dec 3 to 16 | Daily outreach, share recovered-revenue numbers, log costs | Hackathon ends Dec 16 |

## Go / stop rule (Nov 24)

Build the MVP only if, by Nov 24:

- 5 or more merchants share real PayPal subscriber counts (in X replies or on the waitlist), and
- 2 or more save a card for a founding spot.

Otherwise stop. No build without that signal.

## Hackathon rules checklist

- [ ] Brand-new domain (check its Wayback Machine history first)
- [ ] Contest rules signed and public profile completed on the hackathon dashboard
- [ ] Hackathon traffic tracker installed on every public page before any link is shared
- [ ] Stripe account connected to TrustMRR before the first charge
- [ ] Payments only through Stripe; confirm the account can charge saved international cards later
- [ ] Fresh GitHub repo, pushed from the first commit
- [ ] Every cost logged below
- [ ] Founding cards charged only once each store's campaign is live (from Dec 2)

## Outreach log

- Nov 22: public replies posted on X to @Fugiman, @nkdevv, @alexellisuk, @RobinLinee, @David_cbolt, @roozfir, @ajthakur_, @tahajiru (X blocks DMs from unverified accounts). Full tracker in the Claude doc.
- Strongest lead: @Fugiman (Reactive Premium). 45% of his Premium subs paid via PayPal (Jul 2025); 35% still on Lemon Squeezy (Nov 17, 2026).

## Costs (for profit)

| Date | Item | Amount (USD) |
| --- | --- | --- |
| Nov 23 (planned) | Domain tryresub.com | |
| (if upgraded) | Vercel Pro (Hobby is non-commercial) | 20/mo |

## Decisions

- Nov 22: domain will be **tryresub.com** (unregistered, no Wayback history on Nov 22). resub.com and similar are taken; getresub.com has 2024 history.
- Nov 22: hosting stays on Vercel Hobby (free) during validation. If the Nov 24 go signal comes, upgrade to Pro ($20/mo) or move to AWS Amplify (credits) before the first charge on Dec 2. Only spend on Nov 23: the domain.
- Nov 22: Supabase project `resub` created (free tier, us-east-1). Launch steps left for Suharshit: `docs/launch-checklist.md`.
