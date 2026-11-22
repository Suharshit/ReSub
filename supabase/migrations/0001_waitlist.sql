-- Phase 1: waitlist + founding reservations.
-- Only the server (service role) touches these tables. RLS is on with no
-- policies, so the public anon key can neither read nor write them.

create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  paypal_sub_count integer not null check (paypal_sub_count >= 0),
  destination text not null check (destination in (
    'stripe', 'stripe_managed_payments', 'polar', 'paddle', 'dodo', 'creem', 'not_sure'
  )),
  wants_founding boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.founding_reservations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_customer_id text not null,
  stripe_checkout_session_id text not null unique,
  stripe_setup_intent_id text not null unique,
  stripe_payment_method_id text,
  status text not null default 'saved'
    check (status in ('saved', 'charged', 'cancelled', 'failed')),
  charged_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists founding_reservations_status_idx
  on public.founding_reservations (status);

alter table public.waitlist_entries enable row level security;
alter table public.founding_reservations enable row level security;

revoke all on public.waitlist_entries from anon, authenticated;
revoke all on public.founding_reservations from anon, authenticated;
