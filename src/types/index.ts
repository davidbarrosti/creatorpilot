/**
 * Core domain types for CreatorPilot.
 * Mirrors the database schema defined in PRD.md (seção 9) 1:1 — table names
 * and columns here MUST stay in sync with supabase/migrations/*.sql.
 */

export type Tier = "free" | "pro" | "power";

export type CollaborationType = "open" | "target";

export type CollabStatus =
  | "invited"
  | "accepted"
  | "sample_requested"
  | "sample_received"
  | "posted"
  | "selling"
  | "finished";

export type SampleStatus = "none" | "requested" | "shipped" | "received" | "expired";

export type CommissionStatus = "pending" | "paid";

export type SaturationLevel = "low" | "medium" | "high";

export type TrendDirection = "rising" | "stable" | "declining";

export type ContentType = "video" | "live" | "showcase";

export type CalendarStatus = "planned" | "producing" | "posted";

export type HookSource = "ai_generated" | "manual" | "from_performance";

/** `profiles` table — extends Supabase `auth.users` */
export interface Profile {
  id: string; // UUID, references auth.users(id)
  tiktok_user_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
  niche: string[] | null;
  follower_count: number | null;
  tier: Tier;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  // tiktok_access_token / tiktok_refresh_token / token_expires_at are stored
  // encrypted server-side and are never exposed to client-side types.
}

/** `products_cache` table — cache of the TikTok Shop marketplace */
export interface ProductCache {
  id: string; // TikTok product ID
  title: string;
  description: string | null;
  category: string | null;
  price_cents: number;
  currency: string;
  commission_rate: number;
  collaboration_type: CollaborationType;
  seller_name: string | null;
  image_urls: string[];
  opportunity_score: number | null; // 0-100, computed — see lib/utils/scoring.ts
  saturation_level: SaturationLevel | null;
  trend_direction: TrendDirection | null;
  creator_count: number | null;
  last_synced_at: string | null;
  created_at: string;
}

/** `collabs` table */
export interface Collab {
  id: string; // TikTok collab ID
  user_id: string;
  product_id: string;
  collaboration_type: CollaborationType;
  status: CollabStatus;
  commission_rate: number;
  seller_name: string | null;
  seller_brief: string | null;
  sample_status: SampleStatus;
  sample_deadline: string | null;
  post_deadline: string | null;
  videos_posted: number;
  gmv_generated: number;
  commission_earned: number;
  commission_status: CommissionStatus;
  started_at: string | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

/** `briefs` table — AI-generated content briefs (Módulo 2) */
export interface Brief {
  id: string;
  user_id: string;
  product_id: string;
  hooks: string[]; // 3 options
  talking_points: string[];
  claims_to_avoid: string[];
  content_angles: string[];
  cta_suggestion: string;
  seller_brief_included: boolean;
  is_favorite: boolean;
  created_at: string;
}

/** `hooks_library` table */
export interface HooksLibrary {
  id: string;
  user_id: string;
  hook_text: string;
  category: string | null;
  source: HookSource;
  performance_score: number | null;
  times_used: number;
  created_at: string;
}

/** `calendar_entries` table */
export interface CalendarEntry {
  id: string;
  user_id: string;
  collab_id: string | null;
  product_id: string | null;
  scheduled_date: string; // DATE
  content_type: ContentType;
  hook_id: string | null;
  notes: string | null;
  status: CalendarStatus;
  posted_at: string | null;
  created_at: string;
  updated_at: string;
}

/** `performance_daily` table — aggregated daily snapshots */
export interface PerformanceDaily {
  id: string;
  user_id: string;
  date: string; // DATE
  product_id: string | null;
  content_type: ContentType | null;
  views: number;
  clicks: number;
  orders: number;
  gmv: number;
  commission: number;
  conversion_rate: number | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Derived / non-persisted types
// ---------------------------------------------------------------------------

/** Weighted breakdown behind ProductCache.opportunity_score — see PRD seção 5, Módulo 1 */
export interface OpportunityScoreBreakdown {
  product_id: string;
  total_score: number; // 0-100
  commission_score: number; // 30% weight
  trend_score: number; // 30% weight
  saturation_score: number; // 25% weight
  pss_score: number; // 15% weight (TikTok's own Product Selection Score)
  visual_tier: "high" | "medium" | "low"; // 🟢 / 🟡 / 🔴
}

export interface ProductFilter {
  search?: string;
  categories?: string[];
  commissionMin?: number;
  commissionMax?: number;
  priceMin?: number;
  priceMax?: number;
  collaborationTypes?: CollaborationType[];
  sortBy?: "score" | "commission" | "trend" | "latest";
}

/** Input to the Claude-powered brief generator — see lib/ai/briefGenerator.ts */
export interface BriefGenerationInput {
  productTitle: string;
  productDescription: string;
  category: string;
  priceCents: number;
  currency: string;
  commissionRate: number;
  sellerBrief?: string | null;
}

export interface BriefGenerationResult {
  hooks: [string, string, string];
  talkingPoints: string[]; // 5
  cta: string;
  claimsToAvoid: string[];
}
