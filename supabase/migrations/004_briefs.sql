-- Briefs gerados por IA — ver PRD.md seção 9
create table briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id text references products_cache(id),
  hooks text[] not null default '{}', -- 3 opções de hook
  talking_points text[] not null default '{}',
  claims_to_avoid text[] not null default '{}',
  content_angles text[] not null default '{}',
  cta_suggestion text,
  seller_brief_included boolean not null default false,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create index briefs_user_id_idx on briefs(user_id);

alter table briefs enable row level security;

create policy "briefs_all_own" on briefs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
