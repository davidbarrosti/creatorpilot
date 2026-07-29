/**
 * Raw shape returned by the Apify actor "sentry/tiktok-shop-affiliate-products"
 * (run-sync-get-dataset-items endpoint) — confirmed against a real response on
 * 2026-07-28 (query "neck fan", US market). This is a third-party scraper, NOT
 * the official TikTok Shop API — used as an interim data source for the Radar
 * module while creator.affiliate.info's region block (melhorias.md MEL-006) is
 * unresolved.
 */
export interface ApifySku {
  sku_id: string;
  sale_price: number;
  sale_price_format: string;
  origin_price: number | null;
  origin_price_format: string | null;
  discount_decimal: number | null;
  discount_format: string | null;
  currency_name: string;
  currency_symbol: string;
}

export interface ApifyAffiliateProductRaw {
  productId: string;
  name: string;
  productUrl: string;
  slug?: string;
  sourceUrl: string;
  image: string;

  amount: number; // current/sale price, numeric
  price: string; // "$15.99"
  priceFormat: string; // "15.99"
  originalPrice?: number;
  originalPriceFormat?: string;
  discountDecimal?: number;
  discountFormat?: string;
  currencyName: string; // "USD"
  currencySymbol: string; // "$"

  rating: number;
  ratingStrength: string; // "good" | "acceptable" | "strong" | ...
  reviews: string; // numeric string, e.g. "4937"
  sold: number;

  sellerId: string;
  shopName: string;

  affiliateOpportunityScore: number; // 0-100
  score: string; // "88 · A" (score + tier combined)
  categoryFit: string;
  priceBand: string;
  demandSignal: string; // "Very High" | "High" | "Moderate" | ...
  competitionSignal: string; // "Low Saturation" | "Validated Demand" | "Early / Unproven" | ...
  contentFitSignal: string; // "strong" | "moderate" | ...
  promoSignal: boolean;
  opportunityReasons: string[];
  opportunityCautions: string[];

  query: string;
  searchRegion: string; // "US"
  rank: number;
  rankOnPage: number;
  page: number;
  scrapedAt: string;
  skuCount: number;
  skus: ApifySku[];
}
