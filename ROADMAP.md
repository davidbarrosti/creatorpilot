# CreatorPilot Development Roadmap

**Target:** MVP launch in 12 weeks

---

## 📅 Sprint 0: Setup & Foundation (Week 1)
**Goal:** Project scaffolding, database, and boilerplate

- [ ] **Project Setup**
  - [ ] Initialize Next.js 14 project with TypeScript
  - [ ] Setup Tailwind CSS + shadcn/ui
  - [ ] Configure path aliases (@/*)
  - [ ] Setup `.env.local` with all variables

- [ ] **Database (Supabase)**
  - [ ] Create Supabase project
  - [ ] Create database schema (migrations):
    - [ ] `creators` table (profiles, settings)
    - [ ] `products` table (cache from TikTok API)
    - [ ] `collaborations` table (affiliate partnerships)
    - [ ] `performance_logs` table (earnings, clicks, conversions)
    - [ ] `calendar_entries` table (content planning)
  - [ ] Setup authentication with Supabase Auth
  - [ ] Seed database with mock data
  - [ ] Test local Supabase: `supabase start`

- [ ] **PWA Setup**
  - [ ] Create `public/manifest.json`
  - [ ] Create `public/app-192x192.png` + `app-512x512.png`
  - [ ] Setup service worker (`src/public/sw.js`)
  - [ ] Configure `next.config.ts` for PWA support

- [ ] **API Structure**
  - [ ] Setup API routes structure (`src/app/api/`)
  - [ ] Create TikTok Shop API client (`src/lib/tiktok/api.ts`)
  - [ ] Create Claude API client (`src/lib/claude/client.ts`)
  - [ ] Create database helpers (`src/lib/supabase/database.ts`)
  - [ ] Setup mock data adapter pattern

- [ ] **Deployment**
  - [ ] Create GitHub repository
  - [ ] Push initial commit
  - [ ] Setup Contabo VPS (basic SSH access + Node.js)
  - [ ] Test initial deployment with `/api/health` endpoint

**Success Criteria:** `npm run dev` works, mock data loads, basic pages render

---

## 🔐 Sprint 1: Auth & Layout (Week 2)
**Goal:** Authentication flow and responsive layout foundation

- [ ] **Authentication**
  - [ ] Supabase Auth setup (email/magic link)
  - [ ] Create login page (`src/app/auth/login/page.tsx`)
  - [ ] Create signup page
  - [ ] Magic link email integration
  - [ ] Auth guards (middleware to protect /dashboard)
  - [ ] Test: Sign up → verify email → login

- [ ] **Core Layout**
  - [ ] Dashboard layout (`src/app/dashboard/layout.tsx`)
  - [ ] Sidebar navigation (desktop)
  - [ ] Bottom navigation (mobile)
  - [ ] User profile menu
  - [ ] Dark mode toggle (optional)
  - [ ] Responsive breakpoints (mobile: 375px, tablet: 768px, desktop: 1024px)

- [ ] **Onboarding Flow**
  - [ ] Onboarding wizard after signup
  - [ ] Select niche/category
  - [ ] Configure profile (name, avatar, bio)
  - [ ] Save preferences to database
  - [ ] Redirect to dashboard on complete

- [ ] **Module Placeholders**
  - [ ] Create empty pages for all 5 modules:
    - [ ] `/dashboard/radar`
    - [ ] `/dashboard/briefing`
    - [ ] `/dashboard/collabs`
    - [ ] `/dashboard/performance`
    - [ ] `/dashboard/calendar`
  - [ ] Add navigation links
  - [ ] Test routing

**Success Criteria:** Can login, see all 5 module pages, responsive on mobile/desktop

---

## 📊 Sprint 2: Radar de Produtos (Weeks 3-4)
**Goal:** Core discovery feature for finding products to promote

- [ ] **Product List**
  - [ ] Fetch products from TikTok Shop Affiliate API (mock or real)
  - [ ] Create product card component (`components/modules/ProductCard.tsx`)
  - [ ] Display 20 products in grid/list
  - [ ] Lazy load on scroll
  - [ ] Add to favorites button

- [ ] **Filtering**
  - [ ] Filter by category/niche
  - [ ] Filter by commission range (%)
  - [ ] Filter by collaboration type (Open/Target)
  - [ ] Filter by price range
  - [ ] Search by product name
  - [ ] Save favorite filters

- [ ] **Opportunity Scoring**
  - [ ] Implement scoring algorithm:
    - Commission (weight 30%)
    - Trend status (weight 30%)
    - Saturation level (weight 25%)
    - Product Selection Score from TikTok (weight 15%)
  - [ ] Display score (0-100) visually: 🟢 / 🟡 / 🔴
  - [ ] Sort by score

- [ ] **Product Detail View**
  - [ ] Click product → detail modal/page
  - [ ] Show all product info (title, description, images, seller)
  - [ ] Show commission structure
  - [ ] Show collaboration requirements
  - [ ] Show trending indicators
  - [ ] Button: "Use this product" → goes to Briefing module

- [ ] **API Integration**
  - [ ] Implement adapter pattern: mock ↔ real API
  - [ ] Test with mock data (default during dev)
  - [ ] Prepare to switch to real API in Sprint 7
  - [ ] Error handling & loading states

- [ ] **Responsive Design**
  - [ ] Mobile: single column, full-width cards
  - [ ] Tablet: 2-column grid
  - [ ] Desktop: 3-column grid with sidebar filters
  - [ ] Test on real devices / browser DevTools

**Success Criteria:** Product list renders, filtering works, scores display correctly

---

## 💬 Sprint 3: Minhas Collabs (Week 5)
**Goal:** Unified inbox for managing affiliate partnerships

- [ ] **Collaboration List**
  - [ ] Query creator's collaborations from Supabase + TikTok API
  - [ ] Display Open & Target collaborations
  - [ ] Create collab card component
  - [ ] Show status badge: "Accepted" / "Pending" / "Posted" / "Selling"
  - [ ] Show commission per collab (real-time)

- [ ] **Status Pipeline**
  - [ ] Visual status pipeline: Invited → Accepted → Sample → Content → Selling → Closed
  - [ ] Show timeline/Kanban view (desktop only initially)
  - [ ] Drag-drop to move between columns (phase 2)

- [ ] **Alerts & Flags**
  - [ ] Auto-flag: "3 collabs not posted in 7+ days"
  - [ ] Auto-flag: "Sample expires in 2 days"
  - [ ] Auto-flag: "Collaboration deadline approaching"
  - [ ] Show badges/badges on collabs with alerts

- [ ] **Filtering & Search**
  - [ ] Filter by status
  - [ ] Filter by product category
  - [ ] Filter by commission
  - [ ] Search by product name or seller name

- [ ] **Detail View**
  - [ ] Click collab → show full details
  - [ ] Product image + title + commission
  - [ ] Seller info + contact
  - [ ] Sample tracking (if applicable)
  - [ ] Posted videos count
  - [ ] Action button: "Go to Briefing" or "Mark as Posted"

- [ ] **Real-time Updates**
  - [ ] Setup webhook listeners for collab status changes
  - [ ] Update UI when status changes (via Supabase Realtime or polling)

**Success Criteria:** Collab list displays, status badges show correctly, filtering works

---

## 🎬 Sprint 4: Briefing Inteligente (Weeks 6-7)
**Goal:** AI-powered content brief generation

- [ ] **Brief Generation**
  - [ ] Create brief generation function with Claude API
  - [ ] Input: product data (title, desc, images, category, price)
  - [ ] Output: 3 hook options + 5 talking points + CTA
  - [ ] Show loading state while generating
  - [ ] Add "Regenerate" button for alternate options

- [ ] **Claude Integration**
  - [ ] Setup Anthropic SDK (`src/lib/claude/client.ts`)
  - [ ] Create prompt template for brief generation
  - [ ] Include compliance warnings (claims to avoid)
  - [ ] Test with mock product data
  - [ ] Implement error handling

- [ ] **Brief Display**
  - [ ] Create brief card layout
  - [ ] Tab: "Brief Gerado" (AI-generated)
  - [ ] Tab: "Brief do Seller" (if Target collab provides one)
  - [ ] Tab: "Meus Hooks Salvos" (personal library)
  - [ ] Each hook/talking point: clickable, copyable to clipboard

- [ ] **Personal Library**
  - [ ] Save favorite hooks/angles to library
  - [ ] View all saved snippets
  - [ ] Add tags/categories to snippets
  - [ ] Delete/edit saved items
  - [ ] Quick search in library

- [ ] **Compliance Features**
  - [ ] Display "Claims to Avoid" section
  - [ ] Show TikTok Shop policies for product category
  - [ ] Highlight risky language in suggestions
  - [ ] Add disclaimer/checklist before posting

- [ ] **Mobile Optimization**
  - [ ] Copy-to-clipboard works on mobile
  - [ ] Tap to expand hooks/talking points
  - [ ] Swipe between tabs

**Success Criteria:** Brief generates successfully via Claude, copy-to-clipboard works, UI is mobile-friendly

---

## 📈 Sprint 5: Performance Dashboard (Weeks 8-9)
**Goal:** Analytics and ROI tracking

- [ ] **Metrics Dashboard**
  - [ ] Create main performance page
  - [ ] Key metrics cards:
    - Total earnings (week/month)
    - Total clicks
    - Conversion rate (%)
    - Avg. order value
  - [ ] Period selector (week/month/all-time)

- [ ] **Charts (Recharts)**
  - [ ] Earnings trend line chart (last 30 days)
  - [ ] Click breakdown by product (pie chart)
  - [ ] Conversion funnel (bar chart)
  - [ ] Top performing products (table)
  - [ ] Earnings by category (stacked bar)

- [ ] **Performance Table**
  - [ ] Create sortable/filterable table of all products
  - [ ] Columns: Product | Clicks | Conversions | Earnings | ROI | Status
  - [ ] Click row → see detail analytics for that product
  - [ ] Export as CSV (phase 2)

- [ ] **Product Detail Analytics**
  - [ ] Drill down into single product performance
  - [ ] Views over time
  - [ ] Conversions timeline
  - [ ] Earnings breakdown
  - [ ] Compare to category average

- [ ] **AI Insights**
  - [ ] Use Claude to analyze performance data
  - [ ] Generate insights: "Best performing category: Beauty (avg ROI +40%)"
  - [ ] Suggest products based on performance trends
  - [ ] Weekly summary email template (phase 2)

- [ ] **Responsive Design**
  - [ ] Mobile: scroll-able cards, simplified charts
  - [ ] Desktop: full dashboard with all charts
  - [ ] Tablet: hybrid layout

**Success Criteria:** Metrics display correctly, charts render, can drill down into product details

---

## 📅 Sprint 6: Calendário (Week 10)
**Goal:** Content planning and scheduling

- [ ] **Calendar View**
  - [ ] Create calendar component (week view + month view)
  - [ ] Display current month by default
  - [ ] Highlight dates with planned/posted content
  - [ ] Show entry count on each day

- [ ] **Create/Edit Entries**
  - [ ] Click date → create event modal
  - [ ] Form fields:
    - Title (product/content idea)
    - Description/notes
    - Link to product/collab
    - Status (Planned / Posted / Archived)
    - Time (optional)
  - [ ] Save to database
  - [ ] Edit existing entries
  - [ ] Delete entries

- [ ] **Link to Collaborations**
  - [ ] When creating/editing calendar entry, can link to a collab
  - [ ] Show collab details in calendar entry preview
  - [ ] Auto-create calendar entry when accepting collab (optional)

- [ ] **Status Tracking**
  - [ ] Mark entry as "Planned" → "Posted" → "Sold"
  - [ ] Track which calendar entries resulted in posts
  - [ ] Analytics: how many planned entries → posted

- [ ] **Mobile Optimization**
  - [ ] Month view on mobile (small calendar)
  - [ ] List view of week's events
  - [ ] Tap to create event

- [ ] **Syncing (Phase 2)**
  - [ ] Placeholder for iCal/Google Calendar export
  - [ ] UI prepared, backend TBD

**Success Criteria:** Can create/view calendar entries, link to collabs, mark status as posted

---

## 🔧 Sprint 7: Integration + Polish (Weeks 11-12)
**Goal:** Connect real APIs, final polish, launch

- [ ] **TikTok Shop API Integration**
  - [ ] Replace mock data with real API calls
  - [ ] Test sandbox endpoints with Partner Center credentials
  - [ ] Implement OAuth flow: "Connect Your TikTok Account"
  - [ ] Test token refresh/expiry handling
  - [ ] Error handling for rate limits

- [ ] **OAuth Flow**
  - [ ] Create login page with "Connect TikTok Shop" button
  - [ ] Redirect to TikTok OAuth
  - [ ] Save access token securely in Supabase
  - [ ] Auto-fetch creator data (name, followers, profile)
  - [ ] Logout/disconnect account

- [ ] **Real Data Sync**
  - [ ] First sync: pull all products, collabs, performance data
  - [ ] Webhooks: listen for collab status changes
  - [ ] Real-time updates: when creator posts video, update performance
  - [ ] Backfill historical data

- [ ] **PWA Enhancement**
  - [ ] Test install prompt on mobile
  - [ ] Add to homescreen works
  - [ ] Offline mode (basic — show cached data)
  - [ ] Test on iOS + Android

- [ ] **Testing**
  - [ ] Unit tests for utility functions
  - [ ] Integration tests for main flows:
    - [ ] Login → see products
    - [ ] Select product → generate brief
    - [ ] Accept collab → see in list
    - [ ] Create calendar entry → link to collab
  - [ ] E2E tests (Playwright): full user journeys
  - [ ] Manual testing on real devices

- [ ] **Performance Optimization**
  - [ ] Measure Lighthouse scores
  - [ ] Optimize images (next/image)
  - [ ] Lazy load modules
  - [ ] Test on slow 3G network

- [ ] **Documentation**
  - [ ] Update README with launch info
  - [ ] Create API documentation for future integrations
  - [ ] Prepare demo video for TikTok Shop App Store

- [ ] **Bug Fixes & Polish**
  - [ ] Fix any issues found in testing
  - [ ] UI polish: hover states, animations, spacing
  - [ ] Accessibility: ARIA labels, keyboard navigation
  - [ ] Verify all forms work properly

- [ ] **Deployment to Production**
  - [ ] Build production bundle: `npm run build`
  - [ ] Deploy to Contabo VPS
  - [ ] Test app on live URL
  - [ ] Setup CI/CD (GitHub Actions optional)
  - [ ] Create backup strategy

- [ ] **TikTok Shop App Store Submission**
  - [ ] Prepare demo video (features breakdown)
  - [ ] Write app description + privacy policy
  - [ ] Verify all API scopes are properly requested
  - [ ] Submit app for TikTok review
  - [ ] Respond to review feedback

**Success Criteria:** App runs on real APIs, all features work, passes TikTok review, live on App Store

---

## 🎯 Key Metrics to Track

Throughout development, monitor these metrics:

- **Velocity:** Tasks completed per sprint (target: 15-20 per sprint)
- **Code Coverage:** Unit test coverage (target: >70%)
- **Performance:** Lighthouse score (target: >90)
- **API Response Time:** TikTok API calls (target: <500ms)
- **Build Time:** Production build (target: <30s)

---

## 📝 Notes

- **Mock Data:** All sprints use mock data first, switch to real APIs in Sprint 7
- **Testing:** Each sprint includes testing of new features
- **Deployment:** Continuous deployment to Contabo after each sprint (optional but recommended)
- **Feedback:** After Sprint 3, recruit 2-3 beta testers for early feedback
- **Risk Mitigation:** If TikTok APIs are slower to approve than expected, Sprint 7 may be extended

---

## 🚀 Post-MVP Roadmap (Phase 2)

After MVP launch, consider:
- Live shopping integration
- Sample tracking & logistics
- Affiliate network management (for sellers)
- Performance benchmarking vs other creators
- Influencer discovery (sellers find creators)
- Automated content templating
- Mobile app (React Native)
- Analytics integrations (Mixpanel, Amplitude)

---

Last updated: July 27, 2026
