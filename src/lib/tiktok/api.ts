import type { Collab, CollabStatus, ProductCache, ProductFilter } from "@/types";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { createClient } from "@/lib/supabase/server";
import { decrypt, encrypt } from "@/lib/utils/encryption";
import { fetchShopProducts, searchTargetCollaborations } from "./affiliateCreator";
import { fetchApifyAffiliateProducts } from "./apify";
import type { ApifyAffiliateProductRaw } from "./apifyTypes";
import { refreshAccessToken } from "./auth";
import { getMockCollabs, getMockProducts } from "./mocks";
import type { TikTokShopProductRaw, TikTokTargetCollabRaw } from "./types";

export class TikTokNotConnectedError extends Error {
  constructor() {
    super("User has not connected a TikTok Shop account yet.");
    this.name = "TikTokNotConnectedError";
  }
}

/**
 * Public adapter — every module (Radar, Collabs, Performance) should import
 * from here, never from affiliateCreator.ts, apify.ts or mocks.ts directly.
 * Three product data sources, checked in order:
 *   1. NEXT_PUBLIC_USE_MOCK=true       -> static in-memory mock data
 *   2. NEXT_PUBLIC_USE_APIFY=true      -> Apify scraper (real US products,
 *      not the official API — interim source while MEL-006 is unresolved)
 *   3. neither                         -> official Affiliate Creator API
 * Collabs always use mock or the official API — Apify has no per-creator data.
 */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const USE_APIFY = process.env.NEXT_PUBLIC_USE_APIFY === "true";

function mapTikTokProduct(raw: TikTokShopProductRaw): ProductCache {
  return {
    id: raw.product_id,
    title: raw.product_name,
    description: raw.product_desc ?? null,
    category: raw.category_name ?? null,
    price_cents: Math.round(parseFloat(raw.price.amount) * 100),
    currency: raw.price.currency,
    commission_rate: parseFloat(raw.commission_rate),
    collaboration_type: raw.collaboration_type === "OPEN" ? "open" : "target",
    seller_name: raw.seller_name ?? null,
    image_urls: raw.main_images?.map((img) => img.url) ?? [],
    opportunity_score: null, // computed client-side — see lib/utils/scoring.ts
    saturation_level: null,
    trend_direction: null,
    creator_count: null,
    last_synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
}

/** demandSignal is a free-form phrase ("Very High", "High", "Moderate", ...) — match by substring. */
function demandSignalToTrend(signal: string): ProductCache["trend_direction"] {
  const s = signal.toLowerCase();
  if (s.includes("high")) return "rising";
  if (s.includes("moderate")) return "stable";
  return "declining";
}

/** competitionSignal is also free-form ("Low Saturation", "Validated Demand", "Early / Unproven") — heuristic match. */
function competitionSignalToSaturation(signal: string): ProductCache["saturation_level"] {
  const s = signal.toLowerCase();
  if (s.includes("low") || s.includes("early") || s.includes("unproven")) return "low";
  if (s.includes("high") || s.includes("saturat")) return "high";
  return "medium"; // e.g. "Validated Demand"
}

/**
 * Maps the Apify scraper's product shape — field names confirmed against a
 * real response on 2026-07-28 (see apifyTypes.ts). No commission data is
 * available from this actor (public scrape, not authenticated) — commission_rate
 * is always 0 here, clearly a placeholder, never a real TikTok Shop commission.
 */
function mapApifyProduct(raw: ApifyAffiliateProductRaw): ProductCache {
  return {
    id: raw.productId,
    title: raw.name,
    description: raw.opportunityReasons?.join(" ") ?? null,
    category: raw.categoryFit ?? null,
    price_cents: Math.round(raw.amount * 100),
    currency: raw.currencyName || "USD",
    commission_rate: 0, // não disponível neste actor — dado público, sem info de comissão real
    collaboration_type: "open", // não informado pelo actor; produtos públicos assumem Open
    seller_name: raw.shopName ?? null,
    image_urls: raw.image ? [raw.image] : [],
    opportunity_score: raw.affiliateOpportunityScore, // já vem pronto do actor
    saturation_level: raw.competitionSignal
      ? competitionSignalToSaturation(raw.competitionSignal)
      : null,
    trend_direction: raw.demandSignal ? demandSignalToTrend(raw.demandSignal) : null,
    creator_count: null, // não fornecido por este actor
    last_synced_at: raw.scrapedAt ?? new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
}

// ⚠️ Vocabulário de status ainda não confirmado — testing tool não revelou o
// payload de resposta sem token válido. Ajustar assim que tivermos um exemplo real.
const TIKTOK_STATUS_MAP: Record<string, CollabStatus> = {
  INVITED: "invited",
  ACCEPTED: "accepted",
  SAMPLE_REQUESTED: "sample_requested",
  SAMPLE_RECEIVED: "sample_received",
  POSTED: "posted",
  SELLING: "selling",
  FINISHED: "finished",
};

function mapTikTokTargetCollab(raw: TikTokTargetCollabRaw, userId: string): Collab {
  return {
    id: raw.target_collaboration_id,
    user_id: userId,
    product_id: raw.product_id,
    collaboration_type: "target",
    status: TIKTOK_STATUS_MAP[raw.status] ?? "invited",
    commission_rate: parseFloat(raw.commission_rate),
    seller_name: raw.seller_name ?? null,
    seller_brief: raw.seller_brief ?? null,
    sample_status: "none",
    sample_deadline: null,
    post_deadline: null,
    videos_posted: 0,
    gmv_generated: 0,
    commission_earned: 0,
    commission_status: "pending",
    started_at: new Date(raw.create_time * 1000).toISOString(),
    last_activity_at: new Date(raw.update_time * 1000).toISOString(),
    created_at: new Date(raw.create_time * 1000).toISOString(),
    updated_at: new Date(raw.update_time * 1000).toISOString(),
  };
}

export async function getProducts(filters?: ProductFilter): Promise<ProductCache[]> {
  if (USE_MOCK) return getMockProducts(filters);

  if (USE_APIFY) {
    const raw = await fetchApifyAffiliateProducts({
      queries: filters?.search ? [filters.search] : undefined,
      maxResultsPerQuery: 20,
    });
    const products = raw.map(mapApifyProduct);

    if (filters?.sortBy === "score") {
      products.sort((a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0));
    }
    return products;
  }

  const accessToken = await getAccessTokenForCurrentUser();
  const raw = await fetchShopProducts(accessToken, filters);
  return raw.map(mapTikTokProduct);
}

/**
 * Retorna as Target Collaborations do criador. Open Collaborations já
 * aceitas ainda não têm endpoint creator-side confirmado — ver comentário em
 * affiliateCreator.ts. Por enquanto, no modo real, só cobre Target.
 */
export async function getCollabs(userId: string): Promise<Collab[]> {
  if (USE_MOCK) return getMockCollabs();

  const accessToken = await getAccessTokenForCurrentUser();
  const raw = await searchTargetCollaborations(accessToken);
  return raw.map((c) => mapTikTokTargetCollab(c, userId));
}

const REFRESH_SAFETY_MARGIN_MS = 5 * 60 * 1000; // refresh 5 min before real expiry

/**
 * Resolves the current user's TikTok access token, refreshing it in the
 * background if it's expired or close to it. Throws TikTokNotConnectedError
 * if the user never went through /api/tiktok/connect.
 */
async function getAccessTokenForCurrentUser(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("No authenticated CreatorPilot user");

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("tiktok_access_token, tiktok_refresh_token, token_expires_at")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  if (!profile?.tiktok_access_token || !profile.tiktok_refresh_token) {
    throw new TikTokNotConnectedError();
  }

  const expiresAt = profile.token_expires_at ? new Date(profile.token_expires_at).getTime() : 0;
  const isExpiringSoon = Date.now() >= expiresAt - REFRESH_SAFETY_MARGIN_MS;

  if (!isExpiringSoon) {
    return decrypt(profile.tiktok_access_token);
  }

  const refreshToken = decrypt(profile.tiktok_refresh_token);
  const refreshed = await refreshAccessToken(refreshToken);

  await supabase
    .from("profiles")
    .update({
      tiktok_access_token: encrypt(refreshed.access_token),
      tiktok_refresh_token: encrypt(refreshed.refresh_token),
      token_expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
    })
    .eq("id", user.id);

  return refreshed.access_token;
}
