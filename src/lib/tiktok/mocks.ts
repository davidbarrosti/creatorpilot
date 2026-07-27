import type { Collab, PerformanceDaily, ProductCache, ProductFilter } from "@/types";

/**
 * Pure in-memory mock data — no Supabase dependency. This is what powers
 * local development (`NEXT_PUBLIC_USE_MOCK=true`) before a Supabase project
 * exists and before the TikTok Shop registration (bugs.md BUG-001) unblocks.
 */

const MOCK_PRODUCTS: ProductCache[] = [
  {
    id: "mock-001",
    title: "Sérum Facial Vitamina C 30ml",
    description: "Sérum antioxidante para uniformizar o tom da pele.",
    category: "Beleza",
    price_cents: 8990,
    currency: "USD",
    commission_rate: 18,
    collaboration_type: "open",
    seller_name: "GlowLab",
    image_urls: ["https://picsum.photos/seed/mock-001/400"],
    opportunity_score: 87,
    saturation_level: "low",
    trend_direction: "rising",
    creator_count: 12,
    last_synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-002",
    title: "Fone Bluetooth Esportivo",
    description: "Fone sem fio resistente à água, 20h de bateria.",
    category: "Eletrônicos",
    price_cents: 12990,
    currency: "USD",
    commission_rate: 12,
    collaboration_type: "open",
    seller_name: "SoundGo",
    image_urls: ["https://picsum.photos/seed/mock-002/400"],
    opportunity_score: 74,
    saturation_level: "medium",
    trend_direction: "stable",
    creator_count: 45,
    last_synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-003",
    title: "Organizador de Maquiagem Acrílico",
    description: "Organizador transparente empilhável.",
    category: "Casa",
    price_cents: 4990,
    currency: "USD",
    commission_rate: 22,
    collaboration_type: "target",
    seller_name: "HomeTidy",
    image_urls: ["https://picsum.photos/seed/mock-003/400"],
    opportunity_score: 91,
    saturation_level: "low",
    trend_direction: "rising",
    creator_count: 6,
    last_synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-004",
    title: "Creatina Monohidratada 300g",
    description: "Suplemento para performance e recuperação muscular.",
    category: "Suplementos",
    price_cents: 6990,
    currency: "USD",
    commission_rate: 15,
    collaboration_type: "open",
    seller_name: "PureFit",
    image_urls: ["https://picsum.photos/seed/mock-004/400"],
    opportunity_score: 65,
    saturation_level: "high",
    trend_direction: "stable",
    creator_count: 120,
    last_synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

const MOCK_COLLABS: Collab[] = [
  {
    id: "collab-001",
    user_id: "mock-user",
    product_id: "mock-001",
    collaboration_type: "open",
    status: "posted",
    commission_rate: 18,
    seller_name: "GlowLab",
    seller_brief: null,
    sample_status: "received",
    sample_deadline: null,
    post_deadline: null,
    videos_posted: 2,
    gmv_generated: 340.5,
    commission_earned: 61.29,
    commission_status: "pending",
    started_at: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    last_activity_at: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    created_at: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "collab-002",
    user_id: "mock-user",
    product_id: "mock-003",
    collaboration_type: "target",
    status: "sample_requested",
    commission_rate: 22,
    seller_name: "HomeTidy",
    seller_brief: "Foque na organização de maquiagem para viagem.",
    sample_status: "requested",
    sample_deadline: new Date(Date.now() + 2 * 86_400_000).toISOString(),
    post_deadline: null,
    videos_posted: 0,
    gmv_generated: 0,
    commission_earned: 0,
    commission_status: "pending",
    started_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    last_activity_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_PERFORMANCE: PerformanceDaily[] = Array.from({ length: 7 }).map((_, i) => {
  const date = new Date(Date.now() - i * 86_400_000);
  return {
    id: `perf-${i}`,
    user_id: "mock-user",
    date: date.toISOString().slice(0, 10),
    product_id: "mock-001",
    content_type: "video",
    views: 1200 + i * 85,
    clicks: 90 + i * 6,
    orders: 4 + (i % 3),
    gmv: 60 + i * 12.5,
    commission: 10 + i * 2.1,
    conversion_rate: 0.038,
    created_at: date.toISOString(),
  };
});

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getMockProducts(filters?: ProductFilter): Promise<ProductCache[]> {
  let results = [...MOCK_PRODUCTS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter((p) => p.title.toLowerCase().includes(q));
  }
  if (filters?.categories?.length) {
    results = results.filter((p) => p.category && filters.categories!.includes(p.category));
  }
  if (filters?.commissionMin != null) {
    results = results.filter((p) => p.commission_rate >= filters.commissionMin!);
  }
  if (filters?.commissionMax != null) {
    results = results.filter((p) => p.commission_rate <= filters.commissionMax!);
  }
  if (filters?.collaborationTypes?.length) {
    results = results.filter((p) => filters.collaborationTypes!.includes(p.collaboration_type));
  }
  if (filters?.sortBy === "score") {
    results.sort((a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0));
  } else if (filters?.sortBy === "commission") {
    results.sort((a, b) => b.commission_rate - a.commission_rate);
  }

  return delay(results);
}

export async function getMockCollabs(): Promise<Collab[]> {
  return delay(MOCK_COLLABS);
}

export async function getMockPerformance(): Promise<PerformanceDaily[]> {
  return delay(MOCK_PERFORMANCE);
}
