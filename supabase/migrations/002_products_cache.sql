-- Cache de produtos do marketplace — ver PRD.md seção 9
create table products_cache (
  id text primary key, -- TikTok product ID
  title text not null,
  description text,
  category text,
  price_cents integer not null,
  currency text not null default 'USD',
  commission_rate numeric(5, 2) not null,
  collaboration_type text not null check (collaboration_type in ('open', 'target')),
  seller_name text,
  image_urls text[] not null default '{}',
  opportunity_score integer check (opportunity_score between 0 and 100),
  saturation_level text check (saturation_level in ('low', 'medium', 'high')),
  trend_direction text check (trend_direction in ('rising', 'stable', 'declining')),
  creator_count integer,
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

-- Cache compartilhado entre todos os usuários: leitura pública, escrita só via service role
alter table products_cache enable row level security;

create policy "products_cache_select_all" on products_cache
  for select using (true);
