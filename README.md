# CreatorPilot 🚀

**The Dashboard for TikTok Shop Affiliate Creators**

A unified cockpit for creators to discover trending products, generate AI-powered content briefs, manage collaborations, track performance, and plan their content calendar — all in one place.

![Status](https://img.shields.io/badge/status-Sprint%200%20done-blue)
![TikTok Shop Partner](https://img.shields.io/badge/TikTok%20Shop-Registration%20Blocked-red)
![Stack](https://img.shields.io/badge/Stack-Next.js%2016%20|%20Supabase%20|%20Claude%20API-black)

> **Status atual:** Sprint 0 concluído — projeto Next.js real rodando localmente com dados mockados (sem Supabase nem TikTok configurados ainda). O registro do app no TikTok Shop Partner Center segue bloqueado (ver [bugs.md](bugs.md) — BUG-001) e não existem credenciais reais de TikTok Shop App Key/Secret — não procure por elas ainda.

---

## 🎯 Why CreatorPilot?

**The Problem:** 95% of TikTok Shop affiliates don't know what products to promote, when to post, or how much they're earning. Existing tools (Euka, Reacher, Cruva, FastMoss) are built FOR SELLERS, not creators.

**The Solution:** CreatorPilot is the first app built FROM THE CREATOR'S SIDE — a mobile-first dashboard that shows:
- 📊 **Radar**: Which products are trending + have best margins + aren't saturated
- 🎬 **Briefs**: AI-generated content angles, hooks, and talking points
- 📋 **Collabs**: Unified inbox for all affiliate partnerships & deadlines
- 📈 **Performance**: Real-time earnings, conversion rates, ROI per product
- 📅 **Calendar**: Plan your content week-by-week

---

## 📱 The 5 Modules

| Module | What it does | Solves |
|--------|-------------|--------|
| **Radar** | Discover products by opportunity score (commission + trend + saturation) | "What should I promote?" |
| **Briefing** | AI generates 3 content hooks + talking points + compliance warnings | "What should I say?" |
| **Minhas Collabs** | Unified inbox: Open Collabs + Target Collabs + deadlines + earnings | "Where am I?" |
| **Performance** | Dashboard: earnings/product, conversion rates, top performers, AI insights | "How am I doing?" |
| **Calendário** | Visual week/month planner, link collabs to posts, sync with TikTok calendar | "When should I post?" |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Supabase account (free tier works) — ⚠️ ainda não criado neste projeto
- TikTok Shop Partner Center approval — ⚠️ **ainda não obtida**, registro bloqueado (ver [bugs.md](bugs.md) BUG-001). Até resolver, use `NEXT_PUBLIC_USE_MOCK=true`.
- Anthropic API key (Claude) — para o módulo de Briefing

### Installation

```bash
# Clone repo
git clone https://github.com/davidbarrosti/creatorpilot.git
cd creatorpilot

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Fill in your keys (veja .env.example para a lista completa):
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# ANTHROPIC_API_KEY
# TIKTOK_SHOP_APP_KEY / TIKTOK_SHOP_APP_SECRET (não existem ainda — BUG-001)

# Run locally (funciona sem Supabase/TikTok configurados, em modo mock)
npm run dev
# Open http://localhost:3000 (ou a porta que o terminal indicar, se 3000 estiver ocupada)
```

### Deploy to Contabo

```bash
# Build
npm run build

# Deploy via SSH/SCP to your Contabo VPS
# Or use: pm2 start npm --name "creatorpilot" -- start
```

---

## 🏗️ Architecture

```
creatorpilot/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── dashboard/    # Os 5 módulos (radar, brief, collabs, performance, calendar)
│   │   ├── login/        # Auth (magic link)
│   │   └── auth/callback/  # OAuth/magic link callback
│   ├── components/       # Componentes (layout, radar, ...)
│   ├── lib/
│   │   ├── tiktok/       # Adapter pattern: api.ts, affiliateCreator.ts, mocks.ts, auth.ts
│   │   ├── supabase/     # client.ts (browser), server.ts (SSR)
│   │   ├── ai/           # briefGenerator.ts (Claude API)
│   │   └── utils/        # scoring.ts, formatters.ts
│   ├── types/            # Fonte da verdade dos tipos — ver TYPES.md
│   └── proxy.ts          # Auth guard (era middleware.ts — renomeado no Next.js 16)
├── supabase/
│   ├── migrations/       # SQL, 1:1 com PRD.md seção 9
│   └── seed.sql
├── public/               # manifest.json, sw.js, icons/
├── docs/
│   ├── API.md            # TikTok Shop Affiliate Creator API
│   └── ARCHITECTURE.md   # decisões técnicas, inclusive as do Sprint 0
└── PRD.md
```

**Stack:**
- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **Mobile**: PWA (responsive + installable)
- **Backend**: Supabase (auth + database + RLS)
- **APIs**: TikTok Shop Affiliate Creator API + Claude API + custom webhooks
- **Hosting**: Contabo VPS

---

## 📅 Roadmap (MVP: 12 weeks)

### ✅ Sprint 0: Setup (Week 1) — concluído em 2026-07-27
- [ ] Register as TikTok Shop Developer — **bloqueado, ver bugs.md BUG-001** (não impede o resto do Sprint 0)
- [x] Create Next.js project + folder structure
- [x] Tailwind config (v4)
- [x] PWA manifest + service worker (faltam ícones reais, ver `public/icons/README.md`)
- [x] Mock data adapter (`src/lib/tiktok/mocks.ts`) + Radar renderizando dados mockados (`npm run build`/`npm run dev` validados)
- [ ] Supabase project — ainda não criado, migrations prontas em `supabase/migrations/`
- [ ] Deploy skeleton to Contabo — adiado pro Sprint 7 de propósito (ver docs/ARCHITECTURE.md)

Checklist completo com detalhes: [ROADMAP.md](ROADMAP.md).

### 🚀 Sprint 1: Auth + Layout (Week 2)
- [ ] Supabase Auth (email/magic link)
- [ ] Responsive layout: sidebar (desktop) + bottom nav (mobile)
- [ ] Onboarding: select niche, configure profile
- [ ] Placeholder screens for all 5 modules

### 📊 Sprint 2: Radar (Weeks 3-4)
- [ ] Product list with cards + filtering
- [ ] Opportunity score algorithm
- [ ] Product detail view
- [ ] Adapter pattern for mock → real API
- [ ] Mobile + desktop responsiveness

### 💬 Sprint 3: Minhas Collabs (Week 5)
- [ ] Collaboration list with status pipeline
- [ ] Kanban view (desktop)
- [ ] Automated flags (not posted in 7+ days, sample expiring)
- [ ] Real-time sync via webhooks

### 🎬 Sprint 4: Briefing (Weeks 6-7)
- [ ] Claude API integration for brief generation
- [ ] 3 hook options + talking points + compliance warnings
- [ ] Personal hook library
- [ ] Copy-to-clipboard for mobile creators

### 📈 Sprint 5: Performance (Weeks 8-9)
- [ ] Metrics dashboard with Recharts
- [ ] Trend charts (earnings, CTR, conversion by product)
- [ ] Performance table with sorting/filtering
- [ ] AI-powered insights via Claude

### 📅 Sprint 6: Calendário (Week 10)
- [ ] Week/month calendar views
- [ ] Drag-drop to plan posts
- [ ] Link collabs to calendar entries
- [ ] Status tracking (planned → posted → sold)

### 🔧 Sprint 7: Integration + Polish (Weeks 11-12)
- [ ] Real TikTok Shop API integration (sandbox → production)
- [ ] OAuth flow with TikTok
- [ ] Real-time data sync
- [ ] PWA install prompt
- [ ] E2E testing
- [ ] Submit to TikTok Shop App Store

---

## 🔑 API Keys Setup

### From TikTok Shop Partner Center:
```
TIKTOK_SHOP_CLIENT_ID=your_client_id
TIKTOK_SHOP_CLIENT_SECRET=your_secret
TIKTOK_SHOP_SANDBOX_URL=https://sandbox.tiktokshop.com (or production)
```

### From Anthropic:
```
ANTHROPIC_API_KEY=your_claude_api_key
```

### From Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_connection_string (private)
```

---

## 📚 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** — How to run locally, troubleshooting
- **[docs/API.md](./docs/API.md)** — TikTok Shop Affiliate Creator API integration guide
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — Project structure + design decisions
- **[PRD.md](./PRD.md)** — Full product requirements document
- **[bugs.md](./bugs.md)** / **[melhorias.md](./melhorias.md)** — living trackers for issues and decisions (deployment guide will be added in Sprint 7, when Contabo setup actually happens)

---

## 🧪 Testing

### Mock Data
Development starts with mock data from `src/lib/mocks/seed.ts`. Switch between mock and real API with:

```bash
NEXT_PUBLIC_USE_MOCK=true npm run dev   # Use mock data
NEXT_PUBLIC_USE_MOCK=false npm run dev  # Use TikTok API
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Unit Tests
```bash
npm run test
```

---

## 🎯 Success Metrics

**Product:**
- DAU/MAU > 30% (creators opening daily/weekly)
- Radar used > 3x/week per creator
- 5+ briefs generated per creator per month
- D30 retention > 40%

**Business:**
- 1,000 active creators in 3 months post-launch
- Free → Pro conversion > 5%
- $10K+ MRR in 6 months

---

## 🤝 Contributing

This is currently a solo project by [D4M4 Soluções](https://github.com/davidbarrosti). 

For now: bug reports & feature requests via GitHub Issues. Beta testing sign-up: [coming soon]

---

## ⚖️ License

Proprietário — D4M4 Soluções Ltda. Todos os direitos reservados.

---

## 📧 Support

Questions? Issues? 
- GitHub: [Open an issue](https://github.com/davidbarrosti/creatorpilot/issues)
- Email: davidtisium@gmail.com
- Discord: [TikTok Shop Developer Hub](https://discord.gg/tiktokshop)

---

**Built with ❤️ by [D4M4 Soluções](https://d4m4.dev)**

Status: 🔵 **Sprint 0 concluído — Sprint 1 (Auth + Layout) é o próximo.** Registro no TikTok Shop Partner Center segue bloqueado (ver [bugs.md](bugs.md))
Last updated: July 27, 2026
