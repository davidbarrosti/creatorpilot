import type { TikTokOAuthTokenResponse } from "./types";

/**
 * OAuth flow for the "Creator / affiliate integrator" app type — confirmed
 * in docs/API.md. Authorizes the CreatorPilot app to act on behalf of a
 * TikTok Shop creator (user_type=1), not a seller.
 *
 * ⚠️ Param names for the token endpoint (`auth_code`, `grant_type`, response
 * envelope shape) follow TikTok Shop's usual OAuth convention but haven't
 * been exercised against a real response yet — no creator has completed the
 * flow (see melhorias.md MEL-007, creator.affiliate.info still pending
 * approval). Confirm and adjust once the first real callback lands.
 */

const AUTH_BASE_URL = "https://shop.tiktok.com/alliance/creator/auth";
const TOKEN_URL = "https://auth.tiktok-shops.com/api/v2/token/get";
const REFRESH_URL = "https://auth.tiktok-shops.com/api/v2/token/refresh";

/** Most TikTok Shop API responses wrap the payload in this envelope. */
interface TikTokEnvelope<T> {
  code: number;
  message: string;
  data: T;
  request_id?: string;
}

export function buildCreatorAuthUrl(state: string): string {
  const appKey = process.env.TIKTOK_SHOP_APP_KEY;
  if (!appKey) throw new Error("TIKTOK_SHOP_APP_KEY is not set");

  const params = new URLSearchParams({ app_key: appKey, state });
  return `${AUTH_BASE_URL}?${params.toString()}`;
}

function requiredCredentials(): { appKey: string; appSecret: string } {
  const appKey = process.env.TIKTOK_SHOP_APP_KEY;
  const appSecret = process.env.TIKTOK_SHOP_APP_SECRET;
  if (!appKey || !appSecret) {
    throw new Error("TIKTOK_SHOP_APP_KEY / TIKTOK_SHOP_APP_SECRET are not set");
  }
  return { appKey, appSecret };
}

export async function exchangeCodeForToken(code: string): Promise<TikTokOAuthTokenResponse> {
  const { appKey, appSecret } = requiredCredentials();

  const url = new URL(TOKEN_URL);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("app_secret", appSecret);
  url.searchParams.set("auth_code", code);
  url.searchParams.set("grant_type", "authorized_code");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TikTok token exchange failed: ${response.status} ${await response.text()}`);
  }

  const envelope: TikTokEnvelope<TikTokOAuthTokenResponse> = await response.json();
  if (envelope.code !== 0) {
    throw new Error(`TikTok token exchange failed: [${envelope.code}] ${envelope.message}`);
  }

  return envelope.data;
}

export async function refreshAccessToken(refreshToken: string): Promise<TikTokOAuthTokenResponse> {
  const { appKey, appSecret } = requiredCredentials();

  const url = new URL(REFRESH_URL);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("app_secret", appSecret);
  url.searchParams.set("refresh_token", refreshToken);
  url.searchParams.set("grant_type", "refresh_token");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TikTok token refresh failed: ${response.status} ${await response.text()}`);
  }

  const envelope: TikTokEnvelope<TikTokOAuthTokenResponse> = await response.json();
  if (envelope.code !== 0) {
    throw new Error(`TikTok token refresh failed: [${envelope.code}] ${envelope.message}`);
  }

  return envelope.data;
}
