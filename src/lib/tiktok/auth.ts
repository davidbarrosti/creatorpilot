import type { TikTokOAuthTokenResponse } from "./types";

/**
 * OAuth flow for the "Creator / affiliate integrator" app type — confirmed
 * in docs/API.md. Authorizes the CreatorPilot app to act on behalf of a
 * TikTok Shop creator (user_type=1), not a seller.
 */

const AUTH_BASE_URL = "https://shop.tiktok.com/alliance/creator/auth";
const TOKEN_URL = "https://auth.tiktok-shops.com/api/v2/token/get";

export function buildCreatorAuthUrl(state: string): string {
  const appKey = process.env.TIKTOK_SHOP_APP_KEY;
  if (!appKey) throw new Error("TIKTOK_SHOP_APP_KEY is not set");

  const params = new URLSearchParams({ app_key: appKey, state });
  return `${AUTH_BASE_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<TikTokOAuthTokenResponse> {
  const appKey = process.env.TIKTOK_SHOP_APP_KEY;
  const appSecret = process.env.TIKTOK_SHOP_APP_SECRET;
  if (!appKey || !appSecret) {
    throw new Error("TIKTOK_SHOP_APP_KEY / TIKTOK_SHOP_APP_SECRET are not set");
  }

  const response = await fetch(TOKEN_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // Exact param names to be confirmed once the app is created and Manage
    // API scopes are visible — see docs/API.md.
  });

  if (!response.ok) {
    throw new Error(`TikTok token exchange failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<TikTokOAuthTokenResponse> {
  const response = await fetch(TOKEN_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`TikTok token refresh failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}
