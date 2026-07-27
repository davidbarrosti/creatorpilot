-- Calendário de conteúdo — ver PRD.md seção 9
create table calendar_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  collab_id text references collabs(id),
  product_id text references products_cache(id),
  scheduled_date date not null,
  content_type text not null check (content_type in ('video', 'live', 'showcase')),
  hook_id uuid references hooks_library(id),
  notes text,
  status text not null default 'planned' check (status in ('planned', 'producing', 'posted')),
  posted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index calendar_entries_user_id_idx on calendar_entries(user_id);
create index calendar_entries_scheduled_date_idx on calendar_entries(scheduled_date);

alter table calendar_entries enable row level security;

create policy "calendar_entries_all_own" on calendar_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
