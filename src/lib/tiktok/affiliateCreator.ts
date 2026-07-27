import type { ProductFilter } from "@/types";
import type { TikTokCollabRaw, TikTokOrderRaw, TikTokProductRaw } from "./types";

/**
 * Direct calls to the TikTok Shop Affiliate Creator API.
 *
 * ⚠️ Endpoint paths below are placeholders. The CreatorPilot app registration
 * is still blocked (see bugs.md BUG-001), so exact paths/params haven't been
 * confirmed against Manage API yet — only the OAuth flow and scope prefix
 * (`creator.*`) are confirmed (docs/API.md). Update these once the app
 * exists and the real endpoint list is visible in the console.
 */

const API_BASE_URL = process.env.TIKTOK_SHOP_API_BASE_URL ?? "https://open-api.tiktokglobalshop.com";

interface AuthedRequestOptions {
  accessToken: string;
  path: string;
  query?: Record<string, string>;
}

async function authedGet<T>({ accessToken, path, query }: AuthedRequestOptions): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`TikTok API error ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

export async function fetchTikTokProducts(
  accessToken: string,
  filters?: ProductFilter,
): Promise<TikTokProductRaw[]> {
  const data = await authedGet<{ products: TikTokProductRaw[] }>({
    accessToken,
    path: "/affiliate_creator/202501/products/search",
    query: {
      ...(filters?.search ? { keyword: filters.search } : {}),
      ...(filters?.commissionMin != null ? { commission_min: String(filters.commissionMin) } : {}),
    },
  });
  return data.products;
}

export async function fetchTikTokCollabs(accessToken: string): Promise<TikTokCollabRaw[]> {
  const data = await authedGet<{ collaborations: TikTokCollabRaw[] }>({
    accessToken,
    path: "/affiliate_creator/202501/collaborations/list",
  });
  return data.collaborations;
}

export async function fetchTikTokOrders(accessToken: string): Promise<TikTokOrderRaw[]> {
  const data = await authedGet<{ orders: TikTokOrderRaw[] }>({
    accessToken,
    path: "/affiliate_creator/202501/orders/search",
  });
  return data.orders;
}
