/**
 * Raw shapes returned by the TikTok Shop Affiliate Creator API.
 * Field names here are our best guess based on docs/API.md — TikTok's exact
 * response schema is still unconfirmed because the app registration is
 * blocked (see bugs.md BUG-001). Once Manage API scopes are enumerated,
 * reconcile these against the real payloads and adjust the mappers in
 * affiliateCreator.ts accordingly.
 */

export interface TikTokOAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds, 24h per PRD seção 10
  refresh_expires_in: number; // seconds, 365 days per PRD seção 10
  open_id: string;
  seller_name?: string;
}

export interface TikTokProductRaw {
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

export interface TikTokCollabRaw {
  collaboration_id: string;
  product_id: string;
  collaboration_type: "OPEN" | "TARGET";
  status: string; // TikTok's own status vocabulary — mapped in affiliateCreator.ts
  commission_rate: string;
  seller_name?: string;
  seller_brief?: string;
  created_time: number; // unix seconds
  updated_time: number;
}

export interface TikTokOrderRaw {
  order_id: string;
  product_id: string;
  gmv_amount: string;
  commission_amount: string;
  order_status: string;
  create_time: number;
}
