-- BLACKLINK AI — Supabase schema (PostgreSQL)
-- Run with: supabase db push  or paste into the SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text unique,
  password_hash text,
  language text default 'en',
  country text,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.linkedin_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  linkedin_sub text unique,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  connected_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text,
  content text not null,
  image_url text,
  status text default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
  scheduled_date timestamptz,
  published_at timestamptz,
  language text default 'en',
  created_at timestamptz default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  impressions int default 0,
  clicks int default 0,
  engagement numeric default 0,
  followers_delta int default 0,
  recorded_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id text unique,
  status text,
  current_period_end timestamptz,
  plan text,
  created_at timestamptz default now()
);

create index if not exists idx_posts_user on public.posts(user_id);
create index if not exists idx_analytics_user on public.analytics(user_id);
create index if not exists idx_linkedin_user on public.linkedin_accounts(user_id);

-- ── Nova AI Memory ──────────────────────────────────────────────────────────
create table if not exists public.user_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade unique,
  role text default '',
  niche text default '',
  language text default 'en',
  preferred_tone text default 'authority',
  style_notes text default '',
  top_hashtags text default '',
  recruiter_keywords text default '',
  updated_at timestamptz default now()
);

-- ── Affiliate / Referrals ────────────────────────────────────────────────────
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.users(id) on delete cascade,
  referred_id uuid not null references public.users(id) on delete cascade,
  code text not null,
  commission_cents int default 0,
  paid boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_referrals_referrer on public.referrals(referrer_id);

-- ── Network suggestions cache ────────────────────────────────────────────────
create table if not exists public.network_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz default now()
);
