import type { ProductCache } from "@/types";
import type { ApifyAffiliateProductRaw } from "./apifyTypes";

/**
 * Interim product data source via Apify's "sentry/tiktok-shop-affiliate-products"
 * actor — a third-party scraper, not the official TikTok Shop API. Used for the
 * Radar module (US market only — the actor has no region input at all, confirms
 * this is US-fixed) while our own Affiliate Creator API access is blocked by a
 * region issue (melhorias.md MEL-006). Never use this for Collabs/Performance —
 * those need real per-creator data that only the official, authenticated API
 * can provide.
 *
 * Endpoint + input schema confirmed against the actor's real OpenAPI definition
 * and a live run on 2026-07-28.
 */

const APIFY_ACTOR_ID = process.env.APIFY_ACTOR_ID ?? "sentry~tiktok-shop-affiliate-products";
const APIFY_BASE_URL = "https://api.apify.com/v2";

interface ApifyRunInput {
  /** Keywords/niches to search — actor defaults to ["neck fan", "walking pad", "ergo chair"] if omitted. */
  queries?: string[];
  maxResultsPerQuery?: number;
  minAffiliateScore?: number;
}

export async function fetchApifyAffiliateProducts(
  input: ApifyRunInput = {},
): Promise<ApifyAffiliateProductRaw[]> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN is not set");

  const url = `${APIFY_BASE_URL}/actors/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(input.queries ? { queries: input.queries } : {}),
      maxResultsPerQuery: input.maxResultsPerQuery ?? 20,
      minAffiliateScore: input.minAffiliateScore ?? 0,
    }),
  });

  if (!response.ok) {
    throw new Error(`Apify actor run failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
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
export function mapApifyProduct(raw: ApifyAffiliateProductRaw): ProductCache {
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
