# CreatorPilot TypeScript Types

Core TypeScript interfaces and types for the application.

---

## Creator Types

```typescript
// User/Creator profile
interface Creator {
  id: string;                 // UUID from Supabase auth
  tiktok_user_id?: string;    // TikTok Shop creator ID (after OAuth)
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  follower_count?: number;
  niche?: string;             // Selected category/niche
  tier?: 'aspirant' | 'active' | 'top';  // Based on follower count
  created_at: Date;
  updated_at: Date;
}

interface CreatorSettings {
  id: string;
  creator_id: string;
  notification_emails: boolean;
  notification_push: boolean;
  default_commission_threshold?: number;  // Min % commission to show
  default_category?: string;
  dark_mode: boolean;
  created_at: Date;
  updated_at: Date;
}
```

---

## Radar (Products) Types

```typescript
// Product from TikTok Shop Marketplace
interface Product {
  id: string;
  tiktok_product_id: string;
  title: string;
  description: string;
  image_urls: string[];
  price: number;
  currency: 'USD' | 'CNY' | 'BRL' | 'INR';
  category: string;
  seller_id: string;
  seller_name: string;
  
  // Commission info
  commission_percentage: number;
  commission_fixed?: number;
  commission_type: 'percentage' | 'fixed' | 'tiered';
  
  // Collaboration info
  collaboration_types: ('open' | 'target')[];
  
  // TikTok metrics
  product_selection_score?: number;  // 0-100, TikTok's score
  trending_status?: 'rising' | 'stable' | 'declining';
  saturation_level?: 'low' | 'medium' | 'high';
  
  created_at: Date;
  updated_at: Date;
}

interface ProductOpportunityScore {
  product_id: string;
  total_score: number;              // 0-100
  commission_score: number;          // 30% weight
  trend_score: number;               // 30% weight
  saturation_score: number;          // 25% weight
  pss_score: number;                 // 15% weight (TikTok Product Selection Score)
  visual_tier: 'high' | 'medium' | 'low';
  calculated_at: Date;
}

interface ProductFilter {
  search?: string;
  categories?: string[];
  commission_min?: number;
  commission_max?: number;
  price_min?: number;
  price_max?: number;
  collaboration_types?: ('open' | 'target')[];
  trending_only?: boolean;
  sort_by?: 'score' | 'commission' | 'trend' | 'latest';
}

interface ProductPerformance {
  product_id: string;
  creator_id: string;
  total_clicks: number;
  total_conversions: number;
  total_earnings: number;
  conversion_rate: number;          // percentage
  avg_order_value: number;
  roi: number;                       // percentage
  videos_posted: number;
  updated_at: Date;
}
```

---

## Briefing Types

```typescript
// AI-generated brief
interface Brief {
  id: string;
  product_id: string;
  creator_id: string;
  
  hooks: string[];                  // 3 suggested opening lines
  talking_points: string[];         // 5-8 main points to cover
  cta: string;                       // Call-to-action
  content_angles: ContentAngle[];
  claims_to_avoid: string[];        // Compliance warnings
  
  seller_brief?: string;             // If Target collab has a brief
  custom_notes?: string;             // Creator's personal notes
  
  is_saved: boolean;
  created_at: Date;
  updated_at: Date;
}

interface ContentAngle {
  type: 'demo' | 'before_after' | 'routine' | 'comparison' | 'review' | 'unboxing';
  title: string;
  description: string;
}

interface SavedHook {
  id: string;
  creator_id: string;
  content: string;
  tags?: string[];
  usage_count: number;
  created_at: Date;
}
```

---

## Collaboration Types

```typescript
// Affiliate partnership/collaboration
interface Collaboration {
  id: string;
  product_id: string;
  creator_id: string;
  seller_id: string;
  
  // Type
  type: 'open' | 'target';
  
  // Status flow: invited → accepted → sample_sent → content_posted → selling → closed
  status: 'invited' | 'accepted' | 'sample_sent' | 'content_posted' | 'selling' | 'closed';
  
  // Commission
  commission_percentage: number;
  commission_fixed?: number;
  total_earnings: number;
  
  // Dates
  invited_at: Date;
  accepted_at?: Date;
  sample_requested_at?: Date;
  sample_received_at?: Date;
  sample_expires_at?: Date;
  first_post_at?: Date;
  closed_at?: Date;
  
  // Sample tracking
  sample_status?: 'pending' | 'shipped' | 'received' | 'expired';
  sample_tracking_url?: string;
  
  // Seller brief (if Target)
  seller_brief?: string;
  seller_contact?: string;
  
  // Creator tracking
  videos_posted: number;
  views_total: number;
  conversions_total: number;
  
  updated_at: Date;
}

interface CollaborationFilter {
  status?: string[];
  type?: ('open' | 'target')[];
  category?: string[];
  commission_min?: number;
  sort_by?: 'commission' | 'earnings' | 'latest' | 'deadline';
}

interface CollabAlert {
  id: string;
  collab_id: string;
  alert_type: 'no_posts_7days' | 'sample_expiring' | 'deadline_approaching' | 'low_performance';
  message: string;
  severity: 'low' | 'medium' | 'high';
  created_at: Date;
  dismissed: boolean;
}
```

---

## Performance Types

```typescript
// Analytics and performance metrics
interface PerformanceMetric {
  creator_id: string;
  date: Date;
  total_clicks: number;
  total_conversions: number;
  total_earnings: number;
  avg_conversion_rate: number;
  top_product_id?: string;
}

interface PerformanceByProduct {
  product_id: string;
  product_title: string;
  clicks: number;
  conversions: number;
  conversion_rate: number;
  earnings: number;
  roi: number;
  videos_posted: number;
  updated_at: Date;
}

interface PerformanceByCategory {
  category: string;
  total_clicks: number;
  total_conversions: number;
  total_earnings: number;
  avg_conversion_rate: number;
  product_count: number;
}

interface PerformanceInsight {
  id: string;
  creator_id: string;
  insight_type: 'best_performer' | 'underperformer' | 'trend' | 'recommendation';
  title: string;
  description: string;
  metric_value?: number;
  related_product_id?: string;
  created_at: Date;
}

interface PerformanceDashboard {
  period: 'week' | 'month' | 'all_time';
  total_earnings: number;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
  avg_order_value: number;
  top_products: PerformanceByProduct[];
  by_category: PerformanceByCategory[];
  trends: PerformanceMetric[];
  insights: PerformanceInsight[];
}
```

---

## Calendar Types

```typescript
// Content planning
interface CalendarEntry {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  entry_date: Date;
  entry_time?: string;          // HH:mm format
  status: 'planned' | 'posted' | 'archived';
  
  // Links
  product_id?: string;
  collaboration_id?: string;
  
  // Metadata
  tags?: string[];
  video_url?: string;            // If already posted
  created_at: Date;
  updated_at: Date;
}

interface WeekPlan {
  week_start: Date;
  entries: CalendarEntry[];
  total_planned: number;
  total_posted: number;
}

interface MonthPlan {
  year: number;
  month: number;
  entries: CalendarEntry[];
  entries_by_date: Map<number, CalendarEntry[]>;
}
```

---

## API Response Types

```typescript
// TikTok Shop API responses
interface TikTokProductResponse {
  products: Product[];
  total_count: number;
  cursor?: string;
}

interface TikTokCollaborationResponse {
  collaborations: Collaboration[];
  total_count: number;
}

interface TikTokPerformanceResponse {
  metrics: {
    clicks: number;
    conversions: number;
    earnings: number;
    conversion_rate: number;
  };
  period_start: Date;
  period_end: Date;
}

// Claude API responses
interface ClaudeBriefResponse {
  hooks: string[];
  talking_points: string[];
  cta: string;
  angles: ContentAngle[];
  warnings: string[];
}

// Generic API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
```

---

## Database Schema (Supabase)

```sql
-- Creators
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  avatar_url TEXT,
  tiktok_user_id VARCHAR,
  niche VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tiktok_product_id VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR,
  commission_percentage DECIMAL(5, 2),
  trending_status VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Opportunity Scores
CREATE TABLE product_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  total_score INTEGER,
  commission_score INTEGER,
  trend_score INTEGER,
  saturation_score INTEGER,
  pss_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collaborations
CREATE TABLE collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  creator_id UUID REFERENCES creators(id),
  type VARCHAR,  -- 'open' or 'target'
  status VARCHAR,  -- status enum
  commission_percentage DECIMAL(5, 2),
  total_earnings DECIMAL(12, 2),
  videos_posted INTEGER DEFAULT 0,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Logs
CREATE TABLE performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  creator_id UUID REFERENCES creators(id),
  clicks INTEGER,
  conversions INTEGER,
  earnings DECIMAL(12, 2),
  conversion_rate DECIMAL(5, 2),
  logged_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Entries
CREATE TABLE calendar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id),
  title VARCHAR NOT NULL,
  description TEXT,
  entry_date DATE NOT NULL,
  entry_time TIME,
  status VARCHAR,  -- 'planned', 'posted', 'archived'
  product_id UUID REFERENCES products(id),
  collaboration_id UUID REFERENCES collaborations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Enums & Constants

```typescript
// Status enums
export enum CollaborationStatus {
  Invited = 'invited',
  Accepted = 'accepted',
  SampleSent = 'sample_sent',
  ContentPosted = 'content_posted',
  Selling = 'selling',
  Closed = 'closed',
}

export enum CalendarStatus {
  Planned = 'planned',
  Posted = 'posted',
  Archived = 'archived',
}

export enum AlertSeverity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

// Scoring weights
export const OPPORTUNITY_SCORE_WEIGHTS = {
  COMMISSION: 0.30,
  TREND: 0.30,
  SATURATION: 0.25,
  PSS: 0.15,
};

// Commission thresholds
export const COMMISSION_TIERS = {
  LOW: 5,
  MEDIUM: 10,
  HIGH: 15,
};
```

---

These types should be created in `src/types/` as separate files:
- `src/types/creator.ts`
- `src/types/product.ts`
- `src/types/brief.ts`
- `src/types/collaboration.ts`
- `src/types/performance.ts`
- `src/types/calendar.ts`
- `src/types/api.ts`
- `src/types/index.ts` (exports all)
