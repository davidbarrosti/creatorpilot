-- Dados de teste — só popula products_cache, que não depende de um usuário
-- autenticado. Tabelas como collabs/briefs/calendar_entries/performance_daily
-- exigem um profiles.id real (FK pra auth.users) — crie um usuário via
-- Supabase Auth primeiro (signup) e use o mock layer em
-- src/lib/tiktok/mocks.ts pra popular a UI sem depender do banco.

insert into products_cache (
  id, title, description, category, price_cents, currency, commission_rate,
  collaboration_type, seller_name, image_urls, opportunity_score,
  saturation_level, trend_direction, creator_count, last_synced_at
) values
  ('mock-001', 'Sérum Facial Vitamina C 30ml', 'Sérum antioxidante para uniformizar o tom da pele.', 'Beleza', 8990, 'USD', 18.00, 'open', 'GlowLab', array['https://picsum.photos/seed/mock-001/400'], 87, 'low', 'rising', 12, now()),
  ('mock-002', 'Fone Bluetooth Esportivo', 'Fone sem fio resistente à água, 20h de bateria.', 'Eletrônicos', 12990, 'USD', 12.00, 'open', 'SoundGo', array['https://picsum.photos/seed/mock-002/400'], 74, 'medium', 'stable', 45, now()),
  ('mock-003', 'Organizador de Maquiagem Acrílico', 'Organizador transparente empilhável.', 'Casa', 4990, 'USD', 22.00, 'target', 'HomeTidy', array['https://picsum.photos/seed/mock-003/400'], 91, 'low', 'rising', 6, now()),
  ('mock-004', 'Creatina Monohidratada 300g', 'Suplemento para performance e recuperação muscular.', 'Suplementos', 6990, 'USD', 15.00, 'open', 'PureFit', array['https://picsum.photos/seed/mock-004/400'], 65, 'high', 'stable', 120, now()),
  ('mock-005', 'Luminária LED RGB para Quarto', 'Luminária com controle por app e sincronização de música.', 'Casa', 5990, 'USD', 20.00, 'open', 'GlowRoom', array['https://picsum.photos/seed/mock-005/400'], 82, 'low', 'rising', 9, now()),
  ('mock-006', 'Kit Pincéis de Maquiagem 12pç', 'Pincéis profissionais com cerdas sintéticas.', 'Beleza', 3490, 'USD', 25.00, 'target', 'BrushCo', array['https://picsum.photos/seed/mock-006/400'], 58, 'high', 'declining', 88, now()),
  ('mock-007', 'Garrafa Térmica Inox 1L', 'Mantém temperatura por até 24h.', 'Casa', 4290, 'USD', 14.00, 'open', 'ThermoDay', array['https://picsum.photos/seed/mock-007/400'], 70, 'medium', 'stable', 34, now()),
  ('mock-008', 'Mini Massageador Elétrico', 'Massageador portátil para pescoço e ombros.', 'Bem-estar', 7990, 'USD', 19.00, 'open', 'RelaxTech', array['https://picsum.photos/seed/mock-008/400'], 79, 'low', 'rising', 15, now())
on conflict (id) do nothing;
