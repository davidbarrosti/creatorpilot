import type { ApifyAffiliateProductRaw } from "./apifyTypes";

/**
 * Interim product data source via Apify's "sentry/tiktok-shop-affiliate-products"
 * actor — a third-party scraper, not the official TikTok Shop API. Used for the
 * Radar module (US market only) while our own Affiliate Creator API access is
 * blocked by a region issue (melhorias.md MEL-006). Never use this for
 * Collabs/Performance — those need real per-creator data that only the
 * official, authenticated API can provide.
 *
 * ⚠️ Input schema (searchRegion, category, maxItems) is a best guess — the
 * actor's real input fields haven't been confirmed against a live run yet.
 */

const APIFY_ACTOR_ID = process.env.APIFY_ACTOR_ID ?? "sentry~tiktok-shop-affiliate-products";
const APIFY_BASE_URL = "https://api.apify.com/v2";

interface ApifyRunInput {
  searchRegion?: string;
  category?: string;
  maxItems?: number;
}

export async function fetchApifyAffiliateProducts(
  input: ApifyRunInput = {},
): Promise<ApifyAffiliateProductRaw[]> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN is not set");

  const url = `${APIFY_BASE_URL}/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchRegion: input.searchRegion ?? "US",
      maxItems: input.maxItems ?? 20,
      ...(input.category ? { category: input.category } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Apify actor run failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}
