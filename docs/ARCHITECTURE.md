# ARCHITECTURE.md

> **Status:** Sprint 0 (setup) concluído em 2026-07-27 — projeto Next.js real, `npm run build` e `npm run dev` validados, Radar renderiza dados mockados end-to-end. Ver [ROADMAP.md](../ROADMAP.md).

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

## Decisões tomadas no Sprint 0 (não estavam no PRD original)

- **Versões:** PRD dizia "Next.js 14+"; como o projeto começou do zero em julho/2026, usamos as versões atuais: Next.js 16, React 19, Tailwind CSS 4 (config CSS-first via `@theme` em `globals.css`, sem `tailwind.config.ts`). TypeScript ficou fixado em `^6.0.3` (não `7.x`) porque o Next.js 16 ainda não suporta a API do compilador do TypeScript 7 (erro confirmado em build real).
- **`middleware.ts` → `proxy.ts`:** Next.js 16 renomeou a convenção; usamos `src/proxy.ts` com `export function proxy(...)` (não `middleware`).
- **Rotas dos módulos usam `/dashboard/radar` etc. (pasta real, não route group `(dashboard)`)**, diferente do diagrama da seção 8 do PRD (que usava `(dashboard)/radar`). Escolhido porque simplifica o matcher do proxy/auth (`/dashboard/:path*`) e bate com o `ROADMAP.md`. É um detalhe de implementação, não uma mudança de produto.
- **`src/lib/tiktok/`** segue o padrão adapter: `api.ts` (interface pública, usada pelo resto do app) decide entre `mocks.ts` (dados 100% locais, sem Supabase) e `affiliateCreator.ts` (chamadas reais — endpoints ainda não confirmados, ver `docs/API.md`) via `NEXT_PUBLIC_USE_MOCK`.
- **`src/proxy.ts` não quebra em dev sem Supabase configurado:** se `NEXT_PUBLIC_SUPABASE_URL` não estiver setada, o proxy pula a checagem de auth em vez de derrubar toda rota `/dashboard/*` — necessário porque o Sprint 0 rodou sem projeto Supabase criado ainda.

## Decisões de arquitetura em aberto

Ver [melhorias.md](../melhorias.md) para o histórico completo de decisões e riscos ainda sendo validados (MEL-001 a MEL-006), em especial:
- MEL-001: se/como registrar como TAP pra Fase 3 de monetização
- MEL-006: se Brasil é um mercado-alvo viável pra Affiliate Creator API
