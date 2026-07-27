# CreatorPilot — PRD (Product Requirements Document)

## O cockpit do criador afiliado do TikTok Shop

**Versão:** 1.0  
**Data:** 2026-07-20  
**Autor:** D4M4 Soluções Ltda  
**Status:** Discovery → Ready for Development

---

## 1. VISÃO GERAL

### O que é

CreatorPilot é um web app responsivo (desktop + mobile / PWA) que funciona como painel de controle unificado para criadores afiliados do TikTok Shop. Ele centraliza seleção de produtos, geração de briefs, gestão de colaborações, analytics de performance e planejamento de conteúdo em uma única interface.

### Analogia

A Utmify deu um cockpit ao gestor de tráfego do Facebook Ads — visibilidade de atribuição, profit, e controle de campanhas em um dashboard único. O CreatorPilot faz o mesmo para o criador afiliado do TikTok Shop.

### Por que agora

- TikTok Shop atingiu $15.82B em vendas nos EUA em 2025 (+108% YoY)
- 11 milhões de influenciadores no ecossistema, 475K sellers ativos
- Afiliados geram 42% do GMV total da plataforma
- TikTok abriu Affiliate Creator API, Seller API, e Partner API para desenvolvedores
- 95% dos criadores afiliados não performam — não por falta de talento, mas por falta de sistema
- Todas as ferramentas existentes (Euka, Reacher, Cruva, Kalodata, FastMoss) são feitas para SELLERS. Ninguém construiu o painel do CRIADOR
- TikTok Shop App Store tem zero listing fees para desenvolvedores
- TikTok está depreciando o TTCM (Creator Marketplace standalone) e centralizando tudo no Seller Center — criando gap de ferramentas

---

## 2. PÚBLICO-ALVO

### Persona Primária: Criador Afiliado Ativo

- Criador com 1K-100K seguidores no TikTok
- Já aprovado no TikTok Shop Affiliate Program
- Produz 3-10 vídeos/semana com produtos tagados
- Renda mensal de $200-$5.000 em comissões
- Dor principal: não sabe QUAL produto promover, gasta tempo demais procurando, não tem visão clara de quanto está ganhando por produto
- Usa: celular (80% do tempo), desktop (20% — quando vai pesquisar produtos ou analisar performance)

### Persona Secundária: Criador Aspirante

- 1K-5K seguidores
- Acabou de entrar no programa de afiliados ou está no Creator Pilot Program
- Limitado a 5 vídeos de afiliado + 3 LIVEs por semana
- Dor principal: não sabe por onde começar — qual produto pegar, como falar, o que funciona
- Usa: quase 100% celular

### Persona Terciária (futuro): Seller que quer ativar criadores

- Usa o módulo B2B reverso (boost de produto no radar dos criadores)
- Não é usuário do app — é cliente da monetização

---

## 3. DORES MAPEADAS (PESQUISA)

### Dores do Criador

| # | Dor | Evidência | Severidade |
|---|---|---|---|
| C1 | Seleção de produto é tiro no escuro — promovem tarde demais, copiam vencedores saturados, mantêm produtos fracos | EchoTik 2026: "muitos criadores promovem produtos too late, copiam obvious marketplace winners, ignoram saturação" | CRÍTICA |
| C2 | Comissão flat desmotiva os melhores — 10% flat em item de $22 rende menos que um Reel patrocinado | Influencers-Time 2026: "top affiliates doing 5 videos/week start asking why am I paid the same as someone who posted once and quit" | ALTA |
| C3 | Gestão de mensagens/collabs é caótica — volume de convites e briefs desorganizado | TikTok Dev Summit 2024: creators said "trying to search through my messages on TikTok Shop is impossible" | ALTA |
| C4 | Briefings genéricos ou inexistentes — sellers mandam descrição + comissão e esperam conteúdo bom | Eva 2026: "generic briefing quietly kills most affiliate programs" | ALTA |
| C5 | Burnout de conteúdo — pressão por 3-5 vídeos/semana sem estrutura, hooks, ou calendário | NetInfluencer 2026: "sustained volume matters more than brand affinity" — sistema recompensa volume | MÉDIA |
| C6 | Compliance/risco de punição — Creator Health Rating (CHR) com pontos que deduzem sem clareza | TikTok Policy 2026: CHR system with milestone-based enforcement | MÉDIA |
| C7 | Views caem com produto errado — product selection score afeta distribuição do vídeo | BrandsMeetCreators: "Struggling with low views? It might be your product choice" | ALTA |

### Dores do Seller (contexto — não é nosso usuário direto, mas alimenta features)

| # | Dor | Evidência |
|---|---|---|
| S1 | 58% de churn de criadores em 90 dias — gap entre recrutar e ativar | Hamster Garage 2026 |
| S2 | Gestão manual trava em ~50 criadores | ShortFormNation, Hubfluence 2026 |
| S3 | Logística de amostras vira pesadelo | Hubfluence: "sample tracking is the bottleneck at 50-500 affiliates" |
| S4 | Sem controle sobre conteúdo do afiliado — brand safety | DarkRoom Agency 2026 |
| S5 | Ferramentas nativas limitam a 20-30 criadores ativos | Hamster Garage 2026 |

---

## 4. CONCORRÊNCIA E POSICIONAMENTO

### Landscape atual (todas focadas em SELLER)

| Ferramenta | Foco | O que faz | Gap pro criador |
|---|---|---|---|
| Euka | Seller | AI matching, outreach, sampling, campaign mgmt | Nada pro criador |
| Reacher | Seller | Creator DB 3.4M+, AI outreach, CRM, P&L | Nada pro criador |
| Cruva | Seller | AI OS para brands no TikTok Shop | Nada pro criador |
| Kalodata | Seller/Pesquisa | Analytics de produtos, GMV, trends | Criador pode usar mas não é feito pra ele |
| FastMoss | Seller/Pesquisa | Trending products, viral content | Idem Kalodata |
| TikTok Affiliate Center | Ambos (nativo) | Colaborações básicas, comissões | Limitado: sem outbound, sem analytics de lucro, sem automação |

### Nosso posicionamento

**Único app construído DO LADO DO CRIADOR.** Não somos mais uma ferramenta de gestão de afiliados para sellers — somos o painel de controle que o criador abre todo dia para decidir o que promover, produzir e acompanhar quanto está ganhando.

---

## 5. FUNCIONALIDADES — OS 5 MÓDULOS

### Módulo 1: RADAR DE PRODUTOS — "O que promover?"

**Dores resolvidas:** C1, C7

**Descrição:** Dashboard de descoberta de produtos com scoring de oportunidade. O criador vê quais produtos do TikTok Shop Marketplace têm boa comissão, estão em tendência, e ainda não estão saturados.

**Features:**

- Lista de produtos disponíveis no Marketplace (via Affiliate Creator API)
- Filtros: nicho/categoria, faixa de comissão (%), tipo de colaboração (Open/Target), faixa de preço
- Score de oportunidade por produto (0-100):
  - Comissão (peso 30%)
  - Tendência — produto em ascensão vs estável vs declínio (peso 30%)
  - Saturação — quantos criadores já promovem (peso 25%)
  - Product Selection Score do TikTok (peso 15%)
- Indicador visual: 🟢 Oportunidade alta | 🟡 Média | 🔴 Saturado
- Alertas push: "Produto X do seu nicho entrou em tendência — 12 criadores promovendo, comissão 18%"
- Histórico de produtos promovidos pelo criador com resultado (vendeu/não vendeu)

**Dados necessários:**
- Affiliate Creator API: listar produtos disponíveis, detalhes de comissão, tipo de colaboração
- Analytics: dados de performance por produto (views, conversão)
- Dados externos (fase 2): tendência de buscas, volume de vídeos por produto

**Tela:**
- Mobile: lista scrollable com cards, filtros no topo
- Desktop: grid com filtros laterais + gráficos de tendência

---

### Módulo 2: BRIEFING INTELIGENTE — "O que falar?"

**Dores resolvidas:** C4, C6

**Descrição:** Ao aceitar/selecionar um produto para promover, o app gera automaticamente um brief de conteúdo usando IA, baseado nos dados do produto e nas policies do TikTok.

**Features:**

- Puxar dados do produto automaticamente via API (título, descrição, categoria, preço, imagens, seller info)
- Geração de brief via Claude API:
  - 3 opções de hook (abertura do vídeo)
  - Talking points (o que destacar)
  - Claims a evitar (baseado nas policies de compliance do TikTok Shop)
  - Sugestão de ângulo de conteúdo (demo, antes/depois, rotina, comparação)
  - CTA recomendado
- Se o seller enviou brief via Target Collaboration → mostrar integrado, com os pontos gerados pela IA como complemento
- Biblioteca pessoal de hooks e ângulos que o criador salva
- Seção de "não falar" — regras de compliance simplificadas para a categoria do produto

**Dados necessários:**
- Affiliate Creator API: dados do produto, brief do seller (se Target)
- Claude API: geração de brief
- Base estática: policies do TikTok Shop por categoria (scraped e mantida)

**Tela:**
- Card do produto no topo
- Abas: Brief Gerado | Brief do Seller | Meus Hooks Salvos
- Botão "Gerar novo brief" (re-roll com IA)
- Copiar hooks para clipboard em um tap

---

### Módulo 3: MINHAS COLLABS — "Onde estou?"

**Dores resolvidas:** C3

**Descrição:** Inbox/dashboard unificado de todas as colaborações ativas, com status tracking e deadlines.

**Features:**

- Lista de todas as colaborações:
  - Open Collaborations ativas (produtos que o criador aceitou promover)
  - Target Collaborations (convites recebidos, aceitos, pendentes)
- Status pipeline visual por collab:
  - Convite recebido → Aceito → Amostra solicitada → Amostra recebida → Conteúdo postado → Vendendo → Finalizado
- Deadlines visíveis: prazo pra postar, prazo da amostra expirar
- Comissão acumulada por collab (real-time)
- Flag automática: "3 collabs sem postar há 7+ dias" / "amostra expira em 2 dias"
- Contador de conteúdo: quantos vídeos postados por collab
- Filtros: status, tipo de colaboração, nicho, comissão

**Dados necessários:**
- Affiliate Creator API: listar colaborações, status, detalhes de comissão, samples
- Webhooks: atualização real-time de status

**Tela:**
- Mobile: lista com badges de status (estilo Kanban simplificado)
- Desktop: Kanban board com colunas de status + lista lateral

---

### Módulo 4: PERFORMANCE — "Quanto ganhei e por quê?"

**Dores resolvidas:** C2 (visibilidade), C1 (aprender com dados)

**Descrição:** O "dashboard Utmify" do criador afiliado. Visão clara de ganhos, conversões e performance por produto/conteúdo.

**Features:**

- Resumo geral (header):
  - GMV total gerado (período selecionável)
  - Comissões acumuladas | Pendentes | Pagas
  - Número de pedidos gerados
  - Taxa de conversão média
- Performance por produto:
  - Tabela: produto | views | cliques | pedidos | GMV | comissão | taxa de conversão
  - Ordenável por qualquer coluna
  - Highlight: top 3 produtos vs piores 3
- Performance por tipo de conteúdo: vídeo curto vs LIVE vs showcase
- Tendência temporal: gráfico de comissão nos últimos 7/30/90 dias
- Insights automáticos (IA):
  - "Seu produto X tem views altas mas conversão baixa — pode ser problema de preço ou descrição"
  - "Produtos de [categoria] convertem 3x mais pra você — considere focar"
  - "Sua frequência de postagem caiu 40% vs semana passada"

**Dados necessários:**
- Affiliate Creator API: dados de conversão, comissões, pedidos
- Analytics: views, cliques (se disponível via API)
- Claude API: geração de insights automáticos

**Tela:**
- Mobile: cards empilhados (resumo → gráfico → tabela)
- Desktop: dashboard com grid de métricas + gráficos + tabela

---

### Módulo 5: CALENDÁRIO DE CONTEÚDO — "O que produzir?"

**Dores resolvidas:** C5

**Descrição:** Planejador visual de conteúdo com sugestões de frequência e biblioteca de hooks reutilizáveis.

**Features:**

- Calendário visual (semana/mês): o que postar, quando, pra qual produto
- Arrastar collab do módulo 3 para um dia do calendário
- Sugestão de frequência: baseada no nicho e volume mínimo recomendado (3-5/semana)
- Biblioteca de hooks:
  - Hooks que funcionaram (alimentada pelo módulo de Performance — hooks dos top vídeos)
  - Hooks por categoria (templates)
  - Favoritos salvos
- Status: planejado → produzindo → postado
- Quando marca "postado" → atualiza status da collab automaticamente
- Reminder/notificação: "Você tem 2 conteúdos planejados para hoje"

**Dados necessários:**
- Dados internos (Supabase): calendário, hooks salvos, status
- Affiliate Creator API: vincular post ao produto/collab
- Performance data: para alimentar hooks que funcionaram

**Tela:**
- Mobile: lista por dia (estilo agenda) + FAB para adicionar
- Desktop: calendário mensal/semanal com cards arrastáveis

---

## 6. MODELO DE NEGÓCIO

### Fase 1 — Freemium (lançamento)

| Tier | Preço | Inclui |
|---|---|---|
| Free | $0 | Radar (5 buscas/dia), Minhas Collabs, Performance básica (último 7 dias) |
| Pro | $9.99/mês | Radar ilimitado, Briefing IA (30 briefs/mês), Performance completa (90 dias), Calendário, Alertas push |
| Power | $19.99/mês | Tudo do Pro + Briefs ilimitados, Insights IA automáticos, Export de dados, Prioridade em novas features |

### Fase 2 — B2B Reverso (escala)

Sellers pagam para "boostar" seus produtos no Radar dos criadores:

- **Produto em destaque:** $X/dia para aparecer no topo do Radar para criadores do nicho
- **Alinha incentivos:** criador usa grátis, seller paga pela distribuição
- **Similar a:** ads dentro de marketplace (modelo Mercado Livre / Amazon Sponsored)

### Fase 3 — TAP (TikTok Affiliate Partner)

Registrar como TAP via Affiliate Partner API — possibilita commission sharing:
- CreatorPilot ganha % sobre comissões geradas por criadores que usam a plataforma
- Zero custo para o criador — receita vem do spread de comissão

---

## 7. STACK TÉCNICA

### Frontend

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Styling:** Tailwind CSS
- **Responsividade:** Mobile-first, funciona em desktop e celular
- **PWA:** Service Worker + manifest para instalação no celular
- **Gráficos:** Recharts ou Chart.js

### Backend

- **BaaS:** Supabase
  - Auth (login com email/magic link + OAuth TikTok futuro)
  - PostgreSQL (dados do usuário, collabs cached, calendário, hooks salvos)
  - Realtime (atualização de status de collabs)
  - Edge Functions (proxy para APIs do TikTok, geração de briefs)
  - Storage (imagens de produtos cached)

### APIs Externas

- **TikTok Shop Affiliate Creator API:** colaborações, produtos, comissões, conversões
- **TikTok Shop Partner API v2:** dados operacionais
- **Claude API (Anthropic):** geração de briefs, insights automáticos
- **TikTok Marketing API (fase 2):** dados de ads/GMV Max

### Infraestrutura

- **Hosting:** Contabo VPS (já disponível)
- **CI/CD:** GitHub Actions
- **Monitoramento:** Sentry (erros) + Plausible (analytics)

### Distribuição

- **TikTok Shop App Store** (zero listing fee)
- **Web direto** (creatorpilot.com ou similar)
- **PWA** instalável via browser

---

## 8. ARQUITETURA DO PROJETO

```
creatorpilot/
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .env.local.example          # variáveis de ambiente
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker
│   └── icons/                  # App icons
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing/login
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── callback/page.tsx  # OAuth callback
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx      # Dashboard layout (sidebar + nav)
│   │   │   ├── radar/page.tsx  # Módulo 1: Radar de Produtos
│   │   │   ├── brief/
│   │   │   │   ├── page.tsx    # Lista de briefs
│   │   │   │   └── [productId]/page.tsx  # Brief de produto
│   │   │   ├── collabs/page.tsx  # Módulo 3: Minhas Collabs
│   │   │   ├── performance/page.tsx  # Módulo 4: Performance
│   │   │   └── calendar/page.tsx     # Módulo 5: Calendário
│   │   └── api/                # Route handlers (proxy TikTok API)
│   │       ├── tiktok/
│   │       │   ├── products/route.ts
│   │       │   ├── collabs/route.ts
│   │       │   └── analytics/route.ts
│   │       └── ai/
│   │           └── brief/route.ts    # Claude API brief generation
│   ├── components/
│   │   ├── ui/                 # Componentes base (shadcn/ui)
│   │   ├── radar/              # Componentes do Radar
│   │   ├── brief/              # Componentes do Brief
│   │   ├── collabs/            # Componentes de Collabs
│   │   ├── performance/        # Componentes de Performance
│   │   ├── calendar/           # Componentes do Calendário
│   │   └── layout/             # Header, Sidebar, BottomNav
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Supabase browser client
│   │   │   ├── server.ts       # Supabase server client
│   │   │   └── types.ts        # Database types (generated)
│   │   ├── tiktok/
│   │   │   ├── auth.ts         # OAuth flow TikTok Shop
│   │   │   ├── api.ts          # TikTok API client wrapper
│   │   │   ├── affiliateCreator.ts  # Affiliate Creator API
│   │   │   └── types.ts        # TikTok API types
│   │   ├── ai/
│   │   │   ├── briefGenerator.ts  # Claude brief generation
│   │   │   └── insightGenerator.ts  # Claude insights
│   │   └── utils/
│   │       ├── scoring.ts      # Opportunity score calculation
│   │       └── formatters.ts   # Currency, date, etc.
│   ├── hooks/                  # React hooks customizados
│   │   ├── useProducts.ts
│   │   ├── useCollabs.ts
│   │   ├── usePerformance.ts
│   │   └── useCalendar.ts
│   ├── stores/                 # State management (Zustand)
│   │   ├── userStore.ts
│   │   └── filterStore.ts
│   └── types/                  # Types globais
│       └── index.ts
├── supabase/
│   ├── migrations/             # SQL migrations
│   │   ├── 001_users.sql
│   │   ├── 002_products_cache.sql
│   │   ├── 003_collabs.sql
│   │   ├── 004_calendar.sql
│   │   └── 005_hooks_library.sql
│   └── seed.sql                # Dados de teste
└── docs/
    ├── PRD.md                  # Este documento
    ├── API_MAPPING.md          # Mapeamento endpoints TikTok ↔ features
    └── TESTING.md              # Estratégia de testes
```

---

## 9. BANCO DE DADOS (Supabase/PostgreSQL)

### Tabelas principais

```sql
-- Usuários (extend Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  tiktok_user_id TEXT,
  display_name TEXT,
  avatar_url TEXT,
  niche TEXT[],                    -- categorias de interesse
  follower_count INTEGER,
  tier TEXT DEFAULT 'free',        -- free | pro | power
  tiktok_access_token TEXT,        -- encrypted
  tiktok_refresh_token TEXT,       -- encrypted
  token_expires_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cache de produtos do marketplace
CREATE TABLE products_cache (
  id TEXT PRIMARY KEY,              -- TikTok product ID
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_cents INTEGER,
  currency TEXT DEFAULT 'USD',
  commission_rate NUMERIC(5,2),
  collaboration_type TEXT,          -- open | target
  seller_name TEXT,
  image_urls TEXT[],
  opportunity_score INTEGER,        -- 0-100 calculado
  saturation_level TEXT,            -- low | medium | high
  trend_direction TEXT,             -- rising | stable | declining
  creator_count INTEGER,            -- quantos criadores promovem
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Colaborações do criador
CREATE TABLE collabs (
  id TEXT PRIMARY KEY,              -- TikTok collab ID
  user_id UUID REFERENCES profiles(id),
  product_id TEXT REFERENCES products_cache(id),
  collaboration_type TEXT,          -- open | target
  status TEXT,                      -- invited|accepted|sample_requested|sample_received|posted|selling|finished
  commission_rate NUMERIC(5,2),
  seller_name TEXT,
  seller_brief TEXT,                -- brief do seller se Target
  sample_status TEXT,               -- none|requested|shipped|received|expired
  sample_deadline TIMESTAMPTZ,
  post_deadline TIMESTAMPTZ,
  videos_posted INTEGER DEFAULT 0,
  gmv_generated NUMERIC(12,2) DEFAULT 0,
  commission_earned NUMERIC(10,2) DEFAULT 0,
  commission_status TEXT,           -- pending | paid
  started_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Briefs gerados por IA
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  product_id TEXT REFERENCES products_cache(id),
  hooks TEXT[],                     -- 3 opções de hook
  talking_points TEXT[],
  claims_to_avoid TEXT[],
  content_angles TEXT[],
  cta_suggestion TEXT,
  seller_brief_included BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biblioteca de hooks salvos
CREATE TABLE hooks_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  hook_text TEXT NOT NULL,
  category TEXT,                    -- categoria do produto
  source TEXT,                      -- 'ai_generated' | 'manual' | 'from_performance'
  performance_score NUMERIC(5,2),   -- se veio de vídeo que performou
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendário de conteúdo
CREATE TABLE calendar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  collab_id TEXT REFERENCES collabs(id),
  product_id TEXT REFERENCES products_cache(id),
  scheduled_date DATE NOT NULL,
  content_type TEXT,                -- video | live | showcase
  hook_id UUID REFERENCES hooks_library(id),
  notes TEXT,
  status TEXT DEFAULT 'planned',    -- planned | producing | posted
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance snapshots (dados agregados diários)
CREATE TABLE performance_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  product_id TEXT,
  content_type TEXT,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  gmv NUMERIC(12,2) DEFAULT 0,
  commission NUMERIC(10,2) DEFAULT 0,
  conversion_rate NUMERIC(5,4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, product_id, content_type)
);
```

---

## 10. APIs DO TIKTOK SHOP — MAPEAMENTO

### Registro como Desenvolvedor

1. Acessar **TikTok Shop Partner Center** (partner.tiktokshop.com)
2. Registrar como **Affiliate App Developer**
3. Criar app com scopes necessários
4. Usar **Sandbox** para desenvolvimento e testes
5. Submeter para review antes de ir a produção

### API Families usadas

| API Family | Uso no CreatorPilot | Endpoints chave |
|---|---|---|
| **Affiliate Creator API** | Core — tudo que o criador vê | Listar collabs, produtos disponíveis, aceitar/rejeitar, dados de conversão, showcases |
| **Affiliate Partner API** | Fase 2 — modelo TAP com commission sharing | Gerenciar campanhas de matchmaking, commission splits |
| **Products API** | Cache de dados de produto | Detalhes de produto, categorias, imagens |
| **Analytics** | Módulo Performance | GMV, conversões, views (via Seller Center analytics ou Partner API) |
| **Marketing API** | Fase 3 — dados de GMV Max | Performance de ads, integração orgânico + pago |

### Autenticação

- OAuth 2.0 (padrão TikTok)
- Access tokens expiram em 24h (86.400 segundos)
- Refresh tokens válidos por 365 dias
- Implementar refresh automático em background
- Todas as requests assinadas (request signing obrigatório)
- HTTPS obrigatório em todas as chamadas

### Sandbox / Testes

O TikTok Shop Partner Center oferece:

- **Sandbox Environment:** ambiente simulado com contas de teste (Seller Account e TikTok Account criados pelo TikTok)
- **API Testing Tool:** ferramenta integrada no Partner Center (seção "Development Kits") para simular requests
- **Test Access Token Generator:** página oficial para gerar tokens de teste
- **Postman Collection:** TikTok Shop tem workspace público no Postman com todas as APIs
- **Development Shop:** permite atualizar status de pedidos de teste manualmente para validar fluxos end-to-end

---

## 11. ESTRATÉGIA DE TESTES (SEM CONTA REAL)

Você não precisa ser criador ou seller para desenvolver. O caminho é:

### Fase 1: Setup Sandbox (Semana 1)

1. **Registrar no Partner Center** como desenvolvedor (não precisa ser seller/criador)
   - URL: partner.tiktokshop.com → "Join now"
   - Selecionar tipo: "App Developer"
   - Região: US (maior ecossistema de APIs disponíveis)
   - Documentos: CNPJ da D4M4 ou EIN se tiver

2. **Criar app no Partner Center**
   - Solicitar scopes: affiliate_creator, products, analytics
   - Configurar redirect URL de desenvolvimento (localhost:3000)

3. **Ativar Sandbox**
   - TikTok cria contas simuladas (seller + creator)
   - Gerar test access tokens via ferramenta oficial
   - Importar Postman Collection do TikTok Shop

4. **Dados mockados para UI**
   - Criar seed.sql com dados realistas (produtos, collabs, performance)
   - Desenvolver UI inteira com dados do Supabase local
   - Substituir por dados reais da API quando sandbox estiver ativo

### Fase 2: Desenvolvimento com Mock (Semanas 2-6)

```typescript
// src/lib/tiktok/api.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getProducts(filters: ProductFilters) {
  if (USE_MOCK) {
    return getMockProducts(filters); // dados do seed
  }
  return fetchTikTokProducts(filters); // API real/sandbox
}
```

- Desenvolver toda a UI e lógica com dados mockados
- Padrão adapter: trocar mock por API real sem mudar componentes
- Testes unitários com dados mockados
- Testes de integração com sandbox quando disponível

### Fase 3: Beta com criadores reais (Semana 7+)

- Recrutar 5-10 criadores beta via TikTok/Discord
- Eles conectam conta real via OAuth
- Validar dados reais vs mockados
- Iterar baseado em feedback

### Fase 4: Publicação no TikTok Shop App Store

- Submeter app para review do TikTok
- Demo video cobrindo todos os scopes solicitados
- Privacy policy URL
- Aprovação em ~1-2 semanas

---

## 12. ROADMAP DE DESENVOLVIMENTO

### Sprint 0 — Setup (1 semana)

- [ ] Registrar no TikTok Shop Partner Center
- [ ] Criar projeto Next.js + Supabase
- [ ] Configurar Tailwind + shadcn/ui
- [ ] Setup PWA (manifest + service worker)
- [ ] Criar migrations do banco
- [ ] Seed com dados mockados
- [ ] Deploy initial no Contabo

### Sprint 1 — Auth + Layout (1 semana)

- [ ] Login com Supabase Auth (email/magic link)
- [ ] Layout responsivo: sidebar (desktop) + bottom nav (mobile)
- [ ] Onboarding flow: selecionar nicho, configurar perfil
- [ ] Placeholder das 5 telas

### Sprint 2 — Radar de Produtos (2 semanas)

- [ ] Lista de produtos com cards
- [ ] Filtros (categoria, comissão, tipo)
- [ ] Score de oportunidade (algoritmo local)
- [ ] Detalhe do produto
- [ ] Mock da API / adapter pattern
- [ ] Mobile + desktop responsivo

### Sprint 3 — Minhas Collabs (1 semana)

- [ ] Lista de colaborações com status
- [ ] Kanban view (desktop)
- [ ] Status pipeline visual
- [ ] Flags automáticas (sem postar, amostra expirando)

### Sprint 4 — Briefing Inteligente (2 semanas)

- [ ] Geração de brief via Claude API
- [ ] Tela de brief com hooks, talking points, claims a evitar
- [ ] Biblioteca de hooks salvos
- [ ] Copiar para clipboard
- [ ] Integração com dados do produto

### Sprint 5 — Performance (2 semanas)

- [ ] Dashboard de métricas
- [ ] Gráficos de tendência (Recharts)
- [ ] Tabela de performance por produto
- [ ] Insights automáticos via Claude API

### Sprint 6 — Calendário (1 semana)

- [ ] Calendário visual (semana/mês)
- [ ] CRUD de entradas
- [ ] Vincular a collabs e produtos
- [ ] Status: planejado → postado

### Sprint 7 — Integração real + Polish (2 semanas)

- [ ] Conectar com TikTok Shop API (sandbox → produção)
- [ ] OAuth flow completo com TikTok
- [ ] Sync de dados real-time
- [ ] PWA install prompt
- [ ] Testes end-to-end
- [ ] Submeter para TikTok Shop App Store

**Total estimado: ~12 semanas para MVP**

---

## 13. MÉTRICAS DE SUCESSO

### Produto

- DAU/MAU ratio > 30% (criadores abrindo o app regularmente)
- Criadores usando Radar > 3x/semana
- Briefs gerados por criador > 5/mês
- Retenção D30 > 40%

### Negócio

- 1.000 criadores ativos em 3 meses pós-launch
- Conversão free → pro > 5%
- MRR target 6 meses: $10K+

### Impacto

- Criadores usando CreatorPilot convertem 2x mais vs média do marketplace
- GMV médio por criador aumenta 30% após 30 dias usando o app

---

## 14. RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| TikTok muda/limita APIs | Média | Alto | Arquitetura adapter; não depender de um único endpoint; cache agressivo |
| Sandbox não cobre Affiliate Creator API | Média | Médio | Desenvolver com mocks; recrutar beta testers cedo |
| Competidor grande entra no espaço do criador | Baixa | Alto | First-mover advantage; focar em UX mobile-first; build comunidade |
| Regulação TikTok nos EUA muda | Baixa (deal fechou Jan/2026) | Alto | App funciona globalmente; não depender apenas do mercado US |
| Criadores não pagam por ferramentas | Alta | Médio | Modelo B2B reverso (seller paga) + TAP (commission sharing) como monetização principal |
| Dados de saturação/tendência limitados via API oficial | Alta | Médio | Complementar com dados públicos / Research API / scraping controlado (fase 2) |

---

## 15. PRÓXIMOS PASSOS IMEDIATOS

1. **Registrar no TikTok Shop Partner Center** — criar conta de developer
2. **Explorar Sandbox** — testar quais endpoints da Affiliate Creator API estão disponíveis
3. **Entrar no Discord do TikTok Shop Developer Hub** — comunidade oficial, suporte direto
4. **Assistir webinars do TikTok Shop** — eles têm sessões semanais sobre Affiliate APIs
5. **Iniciar Sprint 0** — setup do projeto no IDE com Claude Code

---

*Documento vivo — atualizar conforme descobertas na API e feedback de beta testers.*
