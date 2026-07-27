-- Biblioteca de hooks salvos — ver PRD.md seção 9
create table hooks_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  hook_text text not null,
  category text,
  source text not null check (source in ('ai_generated', 'manual', 'from_performance')),
  performance_score numeric(5, 2),
  times_used integer not null default 0,
  created_at timestamptz not null default now()
);

create index hooks_library_user_id_idx on hooks_library(user_id);

alter table hooks_library enable row level security;

create policy "hooks_library_all_own" on hooks_library
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
