/**
 * Raw shape returned by the Apify actor "sentry/tiktok-shop-affiliate-products".
 * This is a third-party scraper, NOT the official TikTok Shop API — used as an
 * interim data source for the Radar module while creator.affiliate.info's
 * region block (see melhorias.md MEL-006) is unresolved. US-market only today.
 *
 * Field names/types are best-effort based on the actor's public description —
 * not yet validated against a real response. Adjust once we have live output.
 */
export interface ApifyAffiliateProductRaw {
  product_id: string;
  product_name: string;
  product_url: string;
  product_image_url?: string;
  brand_name?: string;
  seller?: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  currency_symbol?: string; // e.g. "$"
  product_rating?: number;
  review_count?: number;
  sold_count?: number;

  affiliate_opportunity_score: number; // 0-100, pre-computed by the actor
  affiliate_opportunity_tier: "A" | "B" | "C" | "D";
  opportunity_reasons?: string[];
  opportunity_cautions?: string[];
  price_band?: string;
  rating_strength?: string;
  demand_signal?: "low" | "medium" | "high" | string;
  competition_signal?: "low" | "medium" | "high" | string;
  content_fit_signal?: string;
  category_fit?: string;

  commission_signal?: string;
  creator_signal_count?: number;
  video_signal_count?: number;
  live_signal_count?: number;
  public_affiliate_data_available?: boolean;
}
