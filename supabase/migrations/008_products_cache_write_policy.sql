-- Permite que usuários autenticados sincronizem o cache de produtos (Apify
-- hoje, Affiliate Creator API no futuro). Sem dado sensível nessa tabela —
-- é só metadado público de produto — então não precisamos de service role
-- key pra isso (mantém a política de nunca usar credencial elevada no app).
create policy "products_cache_insert_authenticated" on products_cache
  for insert to authenticated with check (true);

create policy "products_cache_update_authenticated" on products_cache
  for update to authenticated using (true) with check (true);
