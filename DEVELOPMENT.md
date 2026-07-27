# Development Guide — CreatorPilot

How to set up your local environment, run the app, and test with mock/real APIs.

---

## 🔧 Local Setup

### 1. Prerequisites
```bash
# Check Node.js version (need 18+)
node --version
npm --version
```

### 2. Clone & Install
```bash
git clone https://github.com/davidbarrosti/creatorpilot.git
cd creatorpilot
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your variables (see section below).

### 4. Supabase Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize local Supabase
supabase init

# Start local Postgres
supabase start

# Apply migrations
supabase db pull
npm run db:migrate
```

### 5. Run Locally
```bash
# Development mode (hot reload)
npm run dev

# Open http://localhost:3000
```

---

## 🔑 Environment Variables

Create `.env.local` in project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/creatorpilot

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-YOUR_API_KEY

# TikTok Shop (get from Partner Center → App Management)
TIKTOK_SHOP_CLIENT_ID=YOUR_CLIENT_ID
TIKTOK_SHOP_CLIENT_SECRET=YOUR_CLIENT_SECRET
TIKTOK_SHOP_SANDBOX_URL=https://sandbox.tiktokshop.com  # or https://tiktokshop.com for production

# Dev / Testing
NEXT_PUBLIC_USE_MOCK=true                              # Use mock data (development)
NODE_ENV=development

# Optional: Analytics, error tracking
NEXT_PUBLIC_SENTRY_DSN=                                # (phase 2)
```

### Getting API Keys:

**Supabase:**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy `Project URL` and `Anon Key` from Settings → API

**Anthropic (Claude):**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create new API key
3. Copy to `ANTHROPIC_API_KEY`

**TikTok Shop:**
> ⚠️ Bloqueado no momento — ver `bugs.md` BUG-001. O app "CreatorPilot" ainda não existe no Partner Center porque o registro da conta não foi aprovado. Não tem Client ID/Secret pra copiar ainda. Passos abaixo são referência pra quando isso for resolvido:
1. Go to [partner.tiktokshop.com](https://partner.tiktokshop.com)
2. App Management → Your App (CreatorPilot)
3. Copy `Client ID` and `Client Secret`
4. Sandbox or Production URL depends on your environment

---

## 📊 Database Setup

### Initialize Supabase
```bash
# Create tables from schema
npx supabase db push

# Seed with mock data
npm run db:seed
```

### Or manually:
```bash
# Log into Supabase dashboard
# SQL Editor → run migrations from src/db/migrations/

# Or via CLI:
supabase migration new init
supabase db push
```

---

## 🎮 Running with Mock Data

Great for initial development — no need for real API keys until later.

```bash
# Development with mock data (default)
NEXT_PUBLIC_USE_MOCK=true npm run dev
```

Mock data is loaded from `src/lib/mocks/seed.ts` and stored in local Supabase.

**Test account:**
- Email: `creator@test.com`
- Password: `test123456`

---

## 🔌 Connecting Real TikTok Shop API

When you're ready to test against real APIs (after sandbox is ready):

### 1. Get Sandbox Credentials
```
1. Log into TikTok Shop Partner Center
2. App Management → CreatorPilot → Development Kits
3. Copy Sandbox Shop ID, Sandbox Creator ID
4. Generate Test Access Token
5. Add to .env.local:
   TIKTOK_SHOP_SANDBOX_SHOP_ID=...
   TIKTOK_SHOP_SANDBOX_CREATOR_ID=...
   TIKTOK_SHOP_SANDBOX_TOKEN=...
```

### 2. Switch to Real API
```bash
NEXT_PUBLIC_USE_MOCK=false npm run dev
```

### 3. Test Endpoints
```bash
# Manually test TikTok API from CLI:
curl -X GET "https://sandbox.tiktokshop.com/api/v1/affiliate/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Shop-Cipher-Text: YOUR_SHOP_ID"
```

---

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### End-to-End Tests (Playwright)
```bash
npm run test:e2e
```

### Test with specific environment
```bash
# Test with mock data
NEXT_PUBLIC_USE_MOCK=true npm run test

# Test with real API
NEXT_PUBLIC_USE_MOCK=false npm run test
```

---

## 🐛 Troubleshooting

### "Cannot find module '@/lib/...'"
- Check `tsconfig.json` has `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }`
- Restart dev server: `npm run dev`

### "Supabase connection refused"
```bash
# Make sure local Postgres is running:
supabase status

# If not:
supabase start

# Check DB is working:
psql postgresql://postgres:postgres@localhost:5432/creatorpilot
```

### "Invalid API Key for TikTok Shop"
- Verify you're using Client ID + Secret (not OAuth token)
- Check sandbox vs production URL in `.env.local`
- Test manually: `npm run test:tiktok-api`

### "Claude API error: unauthorized"
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check it's not expired: [console.anthropic.com](https://console.anthropic.com)
- Test: `npm run test:claude-api`

### "Port 3000 already in use"
```bash
# Use different port:
npm run dev -- -p 3001

# Or kill process on 3000:
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Project Structure

```
creatorpilot/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home/login
│   │   ├── dashboard/           # Main app
│   │   │   ├── layout.tsx       # Dashboard layout (sidebar + nav)
│   │   │   ├── radar/           # Module 1: Radar
│   │   │   ├── briefing/        # Module 2: Briefing
│   │   │   ├── collabs/         # Module 3: Minhas Collabs
│   │   │   ├── performance/     # Module 4: Performance
│   │   │   └── calendar/        # Module 5: Calendário
│   │   ├── api/                 # API routes
│   │   │   ├── auth/
│   │   │   ├── tiktok/          # TikTok Shop proxies
│   │   │   └── claude/          # Claude API proxies
│   │   └── auth/                # Authentication pages
│   ├── components/              # Reusable UI
│   │   ├── layout/
│   │   ├── modules/             # Module-specific components
│   │   └── common/              # Buttons, modals, cards
│   ├── lib/
│   │   ├── tiktok/              # TikTok Shop API integration
│   │   │   ├── api.ts           # API client
│   │   │   ├── types.ts         # TypeScript types
│   │   │   └── mocks.ts         # Mock data
│   │   ├── claude/              # Claude API
│   │   │   ├── client.ts
│   │   │   └── prompts.ts
│   │   ├── supabase/            # Database helpers
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   └── realtime.ts
│   │   ├── mocks/               # Mock data for development
│   │   │   └── seed.ts
│   │   └── utils/               # Helpers
│   └── types/                   # TypeScript definitions
│       ├── tiktok.ts
│       ├── creator.ts
│       └── product.ts
├── public/                      # Static assets, PWA manifest
├── supabase/
│   ├── migrations/              # Database migrations
│   └── seed.sql                 # Initial data
├── docs/
│   ├── API.md                   # TikTok Shop API docs
│   ├── ARCHITECTURE.md          # Design decisions
│   └── DEPLOYMENT.md            # Contabo deployment
├── .env.example                 # Environment template
├── next.config.ts               # Next.js config (PWA)
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
├── package.json
└── README.md
```

---

## 🚀 Building for Production

```bash
# Build static export
npm run build

# Test production build locally
npm run start

# Should serve from http://localhost:3000
```

---

## 📤 Deploying to Contabo

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full guide.

Quick version:
```bash
# Build
npm run build

# SSH to Contabo
ssh user@your_vps_ip

# Upload files
scp -r .next dist user@your_vps_ip:/var/www/creatorpilot/

# Restart app (via PM2)
pm2 restart creatorpilot
```

---

## 📝 Useful Commands

```bash
# Dev server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Reset local database
supabase db reset

# Generate TypeScript types from Supabase
supabase gen types typescript > src/types/supabase.ts

# Check environment setup
npm run env:check
```

---

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TikTok Shop API Docs](https://developers.tiktok.com/doc/tiktok-shop-api)
- [Anthropic Claude API](https://docs.anthropic.com)
- [TikTok Shop Developer Discord](https://discord.gg/tiktokshop)
- [Contabo VPS Docs](https://contabo.com/en/docs/)

---

## 💬 Getting Help

- **Local issues?** Check troubleshooting section above
- **TikTok API questions?** Ask in [TikTok Shop Developer Discord](https://discord.gg/tiktokshop)
- **Code issues?** Open [GitHub Issue](https://github.com/davidbarrosti/creatorpilot/issues)
- **Direct questions?** Email: davidtisium@gmail.com

---

Last updated: July 27, 2026
