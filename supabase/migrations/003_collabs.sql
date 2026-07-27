-- Colaborações do criador — ver PRD.md seção 9
create table collabs (
  id text primary key, -- TikTok collab ID
  user_id uuid not null references profiles(id) on delete cascade,
  product_id text references products_cache(id),
  collaboration_type text not null check (collaboration_type in ('open', 'target')),
  status text not null check (
    status in ('invited', 'accepted', 'sample_requested', 'sample_received', 'posted', 'selling', 'finished')
  ),
  commission_rate numeric(5, 2) not null,
  seller_name text,
  seller_brief text,
  sample_status text not null default 'none' check (
    sample_status in ('none', 'requested', 'shipped', 'received', 'expired')
  ),
  sample_deadline timestamptz,
  post_deadline timestamptz,
  videos_posted integer not null default 0,
  gmv_generated numeric(12, 2) not null default 0,
  commission_earned numeric(10, 2) not null default 0,
  commission_status text not null default 'pending' check (commission_status in ('pending', 'paid')),
  started_at timestamptz,
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index collabs_user_id_idx on collabs(user_id);
create index collabs_status_idx on collabs(status);

alter table collabs enable row level security;

create policy "collabs_all_own" on collabs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
