-- Usuários (extend Supabase Auth) — ver PRD.md seção 9
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tiktok_user_id text,
  display_name text,
  avatar_url text,
  niche text[],
  follower_count integer,
  tier text not null default 'free' check (tier in ('free', 'pro', 'power')),
  tiktok_access_token text,  -- encrypted at the application layer before insert
  tiktok_refresh_token text, -- encrypted at the application layer before insert
  token_expires_at timestamptz,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);
