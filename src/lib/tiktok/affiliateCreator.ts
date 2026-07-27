import type { ProductFilter } from "@/types";
import type {
  TikTokOrderRaw,
  TikTokSharingLinkRaw,
  TikTokShopProductRaw,
  TikTokTargetCollabRaw,
} from "./types";

/**
 * Direct calls to the TikTok Shop Affiliate Creator API.
 *
 * Endpoint paths confirmed via partner.tiktokshop.com/dev/api-testing-tool
 * (2026-07-27) — see docs/API.md for the full list and caveats. Request/
 * response body shapes are still best-effort guesses: the testing tool
 * wouldn't reveal them without a valid access token, and the main scope
 * (`creator.affiliate.info`) was still "Aguardando envio" (pending
 * submission) at the time. Adjust once a real token is available.
 *
 * ⚠️ API_VERSION is a placeholder — the testing tool showed paths with a
 * literal `{version}` placeholder, so the real value (likely a date string
 * like TikTok Shop's other APIs, e.g. "202309") still needs confirming.
 */

const API_BASE_URL = process.env.TIKTOK_SHOP_API_BASE_URL ?? "https://open-api.tiktokglobalshop.com";
const API_VERSION = process.env.TIKTOK_SHOP_API_VERSION ?? "202501";

interface AuthedRequestOptions {
  accessToken: string;
  path: string;
  query?: Record<string, string>;
  body?: unknown;
}

async function authedRequest<T>({
  accessToken,
  path,
  query,
  body,
}: AuthedRequestOptions): Promise<T> {
  const url = new URL(path.replace("{version}", API_VERSION), API_BASE_URL);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new Error(`TikTok API error ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

/**
 * GET /affiliate/{version}/shop_products — produtos disponíveis pra afiliação.
 * Provavelmente já cobre tanto Open quanto Target Collaboration (o campo
 * `collaboration_type` na resposta distingue os dois) — usado pelo Radar.
 */
export async function fetchShopProducts(
  accessToken: string,
  filters?: ProductFilter,
): Promise<TikTokShopProductRaw[]> {
  const data = await authedRequest<{ products: TikTokShopProductRaw[] }>({
    accessToken,
    path: "/affiliate/{version}/shop_products",
    query: {
      ...(filters?.search ? { keyword: filters.search } : {}),
      ...(filters?.commissionMin != null ? { commission_min: String(filters.commissionMin) } : {}),
    },
  });
  return data.products;
}

/**
 * POST /affiliate_creator/{version}/target_collaborations/search — Target
 * Collaborations que o criador já foi convidado para / participa. Usado pelo
 * módulo Minhas Collabs.
 *
 * ⚠️ Sem endpoint creator-side equivalente encontrado ainda pra Open
 * Collaborations já aceitas (só existe /affiliate_seller/.../open_collaborations/search,
 * que é do lado do seller, não deveria ser acessível com token de creator).
 * Precisa confirmar isso quando tivermos um token real.
 */
export async function searchTargetCollaborations(
  accessToken: string,
): Promise<TikTokTargetCollabRaw[]> {
  const data = await authedRequest<{ target_collaborations: TikTokTargetCollabRaw[] }>({
    accessToken,
    path: "/affiliate_creator/{version}/target_collaborations/search",
    body: {},
  });
  return data.target_collaborations;
}

/** POST /affiliate_creator/{version}/orders/search — pedidos/conversões do criador. */
export async function searchCreatorOrders(accessToken: string): Promise<TikTokOrderRaw[]> {
  const data = await authedRequest<{ orders: TikTokOrderRaw[] }>({
    accessToken,
    path: "/affiliate_creator/{version}/orders/search",
    body: {},
  });
  return data.orders;
}

/**
 * POST /affiliate_creator/{version}/affiliate_sharing_links/generate_batch
 * Gera links promocionais rastreáveis — usado no módulo Briefing/Collabs
 * pra dar ao criador o link que ele cola na bio/vídeo.
 */
export async function generateAffiliateSharingLinks(
  accessToken: string,
  productIds: string[],
): Promise<TikTokSharingLinkRaw[]> {
  const data = await authedRequest<{ sharing_links: TikTokSharingLinkRaw[] }>({
    accessToken,
    path: "/affiliate_creator/{version}/affiliate_sharing_links/generate_batch",
    body: { product_ids: productIds },
  });
  return data.sharing_links;
}
