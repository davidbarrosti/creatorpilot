import { createClient } from "@/lib/supabase/server";
import { translateProductTitles } from "@/lib/ai/translate";
import { fetchApifyAffiliateProducts, mapApifyProduct } from "./apify";
import { nichesToQueries } from "./niches";

const CACHE_STALE_AFTER_MS = 6 * 60 * 60 * 1000; // 6h — Apify runs are slow, don't refetch too often

/**
 * Syncs real (Apify-sourced) products into `products_cache`, translating
 * titles to PT-BR, so the Radar reads from the fast local cache instead of
 * calling the slow live scraper on every page view. Searches the creator's
 * own niche (from onboarding) instead of the actor's generic demo defaults.
 */
export async function syncApifyProductsToCache(niches?: string[] | null): Promise<void> {
  const raw = await fetchApifyAffiliateProducts({
    queries: nichesToQueries(niches),
    maxResultsPerQuery: 12,
  });

  const products = raw.map(mapApifyProduct);
  const translatedTitles = await translateProductTitles(products.map((p) => p.title));

  const rows = products.map((p, i) => ({ ...p, title: translatedTitles[i] ?? p.title }));

  const supabase = await createClient();
  const { error } = await supabase.from("products_cache").upsert(rows, { onConflict: "id" });
  if (error) throw error;
}

/** True if the cache is empty or older than CACHE_STALE_AFTER_MS. */
export async function isProductsCacheStale(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products_cache")
    .select("last_synced_at")
    .order("last_synced_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data?.last_synced_at) return true;

  return Date.now() - new Date(data.last_synced_at).getTime() > CACHE_STALE_AFTER_MS;
}
