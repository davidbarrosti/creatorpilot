# 🚀 CreatorPilot — Next Steps (START HERE)

⚠️ **Correção importante:** o registro no TikTok Shop Partner Center ainda **não** foi aprovado — está bloqueado (ver `bugs.md`, BUG-001: as qualificações da conta estão em rascunho, nenhuma ativa). Não existem Client ID/Secret reais ainda. As seções abaixo sobre credenciais TikTok são só referência de onde procurar quando o registro for aprovado — comece pelo setup local com `NEXT_PUBLIC_USE_MOCK=true`.

Aqui está **exatamente o que fazer agora**, considerando esse bloqueio.

---

## ⏱️ Timeline
- **Today (Jul 27):** Setup project locally
- **This week (Sprint 0):** Deploy first version to Contabo
- **Next 11 weeks (Sprints 1-7):** Build the 5 modules
- **Week 12:** Launch on TikTok Shop App Store

---

## 📋 IMMEDIATE ACTIONS (Today/Tomorrow)

### 1. Push para o GitHub

Os arquivos já estão na pasta local do projeto (`c:\Users\User\Documents\creatorpilot`). Feito via Claude Code: `git init`, commit e push pra `github.com/davidbarrosti/creatorpilot`.

### 2. Setup Your IDE (VS Code or similar)

```bash
# Open your project in IDE
code ~/projects/creatorpilot

# Or if using your Contabo VPS directly:
ssh user@your_vps_ip
cd /var/www/creatorpilot
```

### 3. Create `.env.local` Locally

```bash
# Copy the template
cp .env.example .env.local

# Fill in your keys (see DEVELOPMENT.md for where to find each)
# - Supabase keys (from supabase.com)
# - Anthropic API key (from console.anthropic.com)
# - TikTok Shop credentials (from partner.tiktokshop.com)
```

### 4. Run the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
# You should see a login page
```

---

## 📖 READ THESE FIRST

1. **README.md** (2 min) — Overview of what CreatorPilot does
2. **DEVELOPMENT.md** (5 min) — How to setup locally + troubleshooting
3. **ROADMAP.md** (10 min) — The 7 sprints, what to build when
4. **TYPES.md** (5 min) — TypeScript types/database schema

---

## 🎯 Sprint 0 Checklist (This Week)

Goal: **Get project running locally + deploy skeleton to Contabo**

### Phase 1: Local Setup (Today)
- [ ] Clone/setup repository locally
- [ ] Create `.env.local` with your API keys
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] See login page at http://localhost:3000

### Phase 2: Database Setup (Tomorrow)
- [ ] Create Supabase project (free tier)
- [ ] Add database URL + keys to `.env.local`
- [ ] Run `supabase start` (local Postgres)
- [ ] Seed database with mock data: `npm run db:seed`
- [ ] Verify data in Supabase dashboard

### Phase 3: Structure (Wed-Thu)
- [ ] Create folder structure in `src/` (see DEVELOPMENT.md)
- [ ] Create TypeScript type definitions (`src/types/`)
- [ ] Create mock data (`src/lib/mocks/seed.ts`)
- [ ] Update `next.config.ts` for PWA support
- [ ] Verify `npm run build` succeeds

### Phase 4: Deploy to Contabo (Fri)
- [ ] SSH into your Contabo VPS
- [ ] Clone repository
- [ ] Setup `.env.local` on server
- [ ] Run `npm install && npm run build`
- [ ] Start with PM2: `pm2 start npm --name "creatorpilot" -- start`
- [ ] Visit http://your_vps_ip:3000
- [ ] Verify it works!

**Total time: 4-6 hours**

---

## 🔗 Important URLs

Keep these bookmarks handy:

### Your Accounts
- **GitHub:** https://github.com/davidbarrosti/creatorpilot
- **Supabase Dashboard:** https://app.supabase.com
- **TikTok Partner Center:** https://partner.tiktokshop.com
- **Anthropic Console:** https://console.anthropic.com

### Documentation
- **TikTok Shop APIs:** https://developers.tiktok.com/doc/tiktok-shop-api
- **TikTok Developer Discord:** https://discord.gg/tiktokshop
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Claude API Docs:** https://docs.anthropic.com

### Tools
- **Postman (TikTok API testing):** https://www.postman.com
- **GitHub (Code):** https://github.com
- **Contabo (Your VPS):** https://contabo.com

---

## 💡 Development Tips

### Use Mock Data First
During development (Sprints 0-6), work with mock data from `src/lib/mocks/seed.ts`. This way:
- No need to connect to real TikTok API yet
- No need to be a real creator/seller
- Faster iteration
- Easy to test

Switch to real API in Sprint 7 when ready.

### Adapter Pattern
Your code should support both mock + real API:

```typescript
// src/lib/tiktok/api.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getProducts(filters) {
  if (USE_MOCK) {
    return getMockProducts(filters);
  }
  return fetchTikTokProducts(filters);
}
```

### TypeScript Strict Mode
The project has `"strict": true` in `tsconfig.json`. This is good — it catches bugs early.

### Tailwind + shadcn/ui
Use these for styling. Avoid custom CSS unless necessary.

---

## 🚨 Common Stumbling Blocks

### "Cannot connect to Supabase"
- Make sure Supabase local is running: `supabase start`
- Check DATABASE_URL in `.env.local`
- Verify credentials in Supabase dashboard

### "TikTok API returns 401 Unauthorized"
- Verify Client ID + Secret are correct (not token)
- Check you're using sandbox URL for testing
- Verify access token is fresh

### "Claude API not working"
- Verify ANTHROPIC_API_KEY is set
- Check key is not expired in console.anthropic.com
- Look for rate limits if testing heavily

### "npm run dev fails to start"
- Delete `.next` folder: `rm -rf .next`
- Clear npm cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules && npm install`

---

## 📞 When You Get Stuck

**Order of operations:**
1. Check error message in console
2. Google the error
3. Check relevant `.md` file (DEVELOPMENT.md, API.md, etc)
4. Ask in [TikTok Shop Developer Discord](https://discord.gg/tiktokshop)
5. Open GitHub issue
6. Email: davidtisium@gmail.com

**Never:**
- Commit `.env.local` to GitHub
- Use real production credentials during development
- Test with real creator/seller accounts until Sprint 7

---

## 📊 Success Metrics

### After Sprint 0:
- ✅ App runs locally on port 3000
- ✅ Can login with email
- ✅ See placeholder screens for all 5 modules
- ✅ Deployed to Contabo, accessible via IP

### After Sprint 1:
- ✅ Authentication works (login/logout)
- ✅ Responsive layout on mobile + desktop
- ✅ Onboarding wizard after signup

### After Sprint 2:
- ✅ Product list displays with mock data
- ✅ Filtering works
- ✅ Opportunity score calculates correctly

### After Sprint 7:
- ✅ Real TikTok data flows through
- ✅ All 5 modules are functional
- ✅ Approved by TikTok, live on App Store

---

## 🎬 Next: Start Sprint 0

When you're ready to begin development:

1. Open this checklist: **ROADMAP.md → Sprint 0**
2. Go through each item
3. Update checklist as you complete tasks
4. Move to Sprint 1 when all boxes are checked

**Estimated time for Sprint 0: 5-7 hours**

---

## 🆘 Help Resources

- **This folder:** All `.md` files have answers
- **DEVELOPMENT.md:** Setup + troubleshooting
- **ROADMAP.md:** Detailed sprint-by-sprint guide
- **TYPES.md:** Data structures
- **[TikTok Shop API Docs](https://developers.tiktok.com/doc/tiktok-shop-api):** Official reference

---

## ✨ Let's Build!

O registro no TikTok Shop ainda está bloqueado (BUG-001), mas isso não impede começar: você tem o PRD, a stack definida, e o padrão mock/adapter permite desenvolver os 5 módulos localmente enquanto o registro é resolvido em paralelo.

**The time to build is now.** 🚀

Good luck, and enjoy building CreatorPilot!

---

**Questions?** Start with DEVELOPMENT.md, then ask in the TikTok Shop Developer Discord.

**Last Updated:** July 27, 2026
