-- Performance snapshots (dados agregados diários) — ver PRD.md seção 9
create table performance_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  date date not null,
  product_id text,
  content_type text check (content_type in ('video', 'live', 'showcase')),
  views integer not null default 0,
  clicks integer not null default 0,
  orders integer not null default 0,
  gmv numeric(12, 2) not null default 0,
  commission numeric(10, 2) not null default 0,
  conversion_rate numeric(5, 4),
  created_at timestamptz not null default now(),
  unique (user_id, date, product_id, content_type)
);

create index performance_daily_user_id_idx on performance_daily(user_id);
create index performance_daily_date_idx on performance_daily(date);

alter table performance_daily enable row level security;

create policy "performance_daily_all_own" on performance_daily
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
