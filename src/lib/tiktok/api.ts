import type { Collab, CollabStatus, ProductCache, ProductFilter } from "@/types";
import { fetchShopProducts, searchTargetCollaborations } from "./affiliateCreator";
import { getMockCollabs, getMockProducts } from "./mocks";
import type { TikTokShopProductRaw, TikTokTargetCollabRaw } from "./types";

/**
 * Public adapter — every module (Radar, Collabs, Performance) should import
 * from here, never from affiliateCreator.ts or mocks.ts directly. Switches
 * between mock and real TikTok Shop data based on NEXT_PUBLIC_USE_MOCK, so
 * the rest of the app never needs to know which one is active.
 */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

function mapTikTokProduct(raw: TikTokShopProductRaw): ProductCache {
  return {
    id: raw.product_id,
    title: raw.product_name,
    description: raw.product_desc ?? null,
    category: raw.category_name ?? null,
    price_cents: Math.round(parseFloat(raw.price.amount) * 100),
    currency: raw.price.currency,
    commission_rate: parseFloat(raw.commission_rate),
    collaboration_type: raw.collaboration_type === "OPEN" ? "open" : "target",
    seller_name: raw.seller_name ?? null,
    image_urls: raw.main_images?.map((img) => img.url) ?? [],
    opportunity_score: null, // computed client-side — see lib/utils/scoring.ts
    saturation_level: null,
    trend_direction: null,
    creator_count: null,
    last_synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
}

// ⚠️ Vocabulário de status ainda não confirmado — testing tool não revelou o
// payload de resposta sem token válido. Ajustar assim que tivermos um exemplo real.
const TIKTOK_STATUS_MAP: Record<string, CollabStatus> = {
  INVITED: "invited",
  ACCEPTED: "accepted",
  SAMPLE_REQUESTED: "sample_requested",
  SAMPLE_RECEIVED: "sample_received",
  POSTED: "posted",
  SELLING: "selling",
  FINISHED: "finished",
};

function mapTikTokTargetCollab(raw: TikTokTargetCollabRaw, userId: string): Collab {
  return {
    id: raw.target_collaboration_id,
    user_id: userId,
    product_id: raw.product_id,
    collaboration_type: "target",
    status: TIKTOK_STATUS_MAP[raw.status] ?? "invited",
    commission_rate: parseFloat(raw.commission_rate),
    seller_name: raw.seller_name ?? null,
    seller_brief: raw.seller_brief ?? null,
    sample_status: "none",
    sample_deadline: null,
    post_deadline: null,
    videos_posted: 0,
    gmv_generated: 0,
    commission_earned: 0,
    commission_status: "pending",
    started_at: new Date(raw.create_time * 1000).toISOString(),
    last_activity_at: new Date(raw.update_time * 1000).toISOString(),
    created_at: new Date(raw.create_time * 1000).toISOString(),
    updated_at: new Date(raw.update_time * 1000).toISOString(),
  };
}

export async function getProducts(filters?: ProductFilter): Promise<ProductCache[]> {
  if (USE_MOCK) return getMockProducts(filters);

  const accessToken = await getAccessTokenForCurrentUser();
  const raw = await fetchShopProducts(accessToken, filters);
  return raw.map(mapTikTokProduct);
}

/**
 * Retorna as Target Collaborations do criador. Open Collaborations já
 * aceitas ainda não têm endpoint creator-side confirmado — ver comentário em
 * affiliateCreator.ts. Por enquanto, no modo real, só cobre Target.
 */
export async function getCollabs(userId: string): Promise<Collab[]> {
  if (USE_MOCK) return getMockCollabs();

  const accessToken = await getAccessTokenForCurrentUser();
  const raw = await searchTargetCollaborations(accessToken);
  return raw.map((c) => mapTikTokTargetCollab(c, userId));
}

/**
 * Resolves the current user's TikTok access token, refreshing it if needed.
 * Not implemented yet — depende do fluxo OAuth estar ligado a
 * `profiles.tiktok_access_token` (encrypted) e do scope `creator.affiliate.info`
 * estar aprovado (hoje "Aguardando envio", ver melhorias.md).
 */
async function getAccessTokenForCurrentUser(): Promise<string> {
  throw new Error(
    "TikTok access token resolution not implemented yet — real API mode requires " +
      "the OAuth flow to be wired up and creator.affiliate.info to be approved. " +
      "Use NEXT_PUBLIC_USE_MOCK=true until then.",
  );
}
