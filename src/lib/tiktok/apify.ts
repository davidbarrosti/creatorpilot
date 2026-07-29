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
