/**
 * Raw shapes returned by the TikTok Shop Affiliate Creator API.
 *
 * Endpoint paths are confirmed (see docs/API.md, partner.tiktokshop.com/dev/api-testing-tool,
 * checked 2026-07-27), but the exact field names in each response body are
 * still our best guess — the testing tool wouldn't show them without a
 * valid access token, and `creator.affiliate.info` (the scope covering most
 * of this) was still pending submission. Reconcile against real payloads
 * once a token is available and adjust affiliateCreator.ts's mappers.
 */

export interface TikTokOAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds, 24h per PRD seção 10
  refresh_expires_in: number; // seconds, 365 days per PRD seção 10
  open_id: string;
  seller_name?: string;
}

/** GET /affiliate/{version}/shop_products */
export interface TikTokShopProductRaw {
  product_id: string;
  product_name: string;
  product_desc?: string;
  category_name?: string;
  price: { amount: string; currency: string };
  commission_rate: string; // e.g. "18.00"
  collaboration_type: "OPEN" | "TARGET";
  seller_name?: string;
  main_images?: { url: string }[];
  product_selection_score?: number;
}

/** POST /affiliate_creator/{version}/target_collaborations/search */
export interface TikTokTargetCollabRaw {
  target_collaboration_id: string;
  product_id: string;
  status: string; // TikTok's own status vocabulary — mapped in api.ts
  commission_rate: string;
  seller_name?: string;
  seller_brief?: string;
  create_time: number; // unix seconds
  update_time: number;
}

/** POST /affiliate_creator/{version}/orders/search */
export interface TikTokOrderRaw {
  order_id: string;
  product_id: string;
  gmv_amount: string;
  commission_amount: string;
  order_status: string;
  create_time: number;
}

/** POST /affiliate_creator/{version}/affiliate_sharing_links/generate_batch */
export interface TikTokSharingLinkRaw {
  product_id: string;
  sharing_link: string;
}
