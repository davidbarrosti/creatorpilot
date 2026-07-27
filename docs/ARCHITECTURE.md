# ARCHITECTURE.md

## Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, PWA (Service Worker + manifest)
- **Backend:** Supabase — Auth, PostgreSQL, Realtime, Edge Functions, Storage
- **APIs externas:** TikTok Shop Affiliate Creator API (ver [API.md](API.md)), Claude API (Anthropic) para briefs e insights
- **Hosting:** Contabo VPS — só a partir do Sprint 7; até lá, desenvolvimento 100% local contra Supabase na nuvem

## Estrutura de pastas

```
creatorpilot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing/login
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── callback/page.tsx     # OAuth callback
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx      # Sidebar (desktop) + bottom nav (mobile)
│   │   │   ├── radar/page.tsx
│   │   │   ├── brief/
│   │   │   ├── collabs/page.tsx
│   │   │   ├── performance/page.tsx
│   │   │   └── calendar/page.tsx
│   │   └── api/                # Route handlers (proxy TikTok API, brief generation)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui
│   │   ├── radar/ brief/ collabs/ performance/ calendar/
│   │   └── layout/
│   ├── lib/
│   │   ├── supabase/           # client.ts, server.ts, types.ts
│   │   ├── tiktok/             # auth.ts, api.ts, affiliateCreator.ts, types.ts
│   │   ├── ai/                 # briefGenerator.ts, insightGenerator.ts
│   │   └── utils/               # scoring.ts, formatters.ts
│   ├── hooks/                  # useProducts, useCollabs, usePerformance, useCalendar
│   ├── stores/                 # Zustand: userStore, filterStore
│   └── types/
├── supabase/
│   ├── migrations/             # 001_users.sql ... 005_hooks_library.sql
│   └── seed.sql
└── docs/
```

Detalhe completo por módulo: seção 8 do [PRD.md](../PRD.md).

## Banco de dados

Tabelas principais (Supabase/Postgres) — schema completo na seção 9 do [PRD.md](../PRD.md):

- `profiles` — extende `auth.users`, guarda tokens TikTok (encrypted), tier, nicho
- `products_cache` — cache de produtos do marketplace + score de oportunidade calculado
- `collabs` — colaborações do criador, status pipeline, comissão
- `briefs` — briefs gerados por IA (hooks, talking points, claims a evitar)
- `hooks_library` — biblioteca pessoal de hooks salvos
- `calendar_entries` — planejamento de conteúdo
- `performance_daily` — snapshots agregados diários (views, GMV, comissão)

## Padrão adapter (mock ↔ API real)

Toda integração externa segue o mesmo padrão: uma função pública que decide entre mock e chamada real via `NEXT_PUBLIC_USE_MOCK`, permitindo construir toda a UI e lógica de negócio antes do registro no TikTok Shop Partner Center estar desbloqueado (ver [bugs.md](../bugs.md) BUG-001).

```typescript
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getProducts(filters: ProductFilters) {
  if (USE_MOCK) return getMockProducts(filters);
  return fetchTikTokProducts(filters);
}
```

## Decisões de arquitetura em aberto

Ver [melhorias.md](../melhorias.md) para o histórico completo de decisões e riscos ainda sendo validados (MEL-001 a MEL-006), em especial:
- MEL-001: se/como registrar como TAP pra Fase 3 de monetização
- MEL-006: se Brasil é um mercado-alvo viável pra Affiliate Creator API
