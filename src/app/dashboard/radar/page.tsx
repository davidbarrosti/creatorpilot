import { getProducts } from "@/lib/tiktok/api";
import { getCurrentProfile } from "@/lib/supabase/auth-server";
import { ProductCard } from "@/components/radar/ProductCard";
import { TikTokConnectionBanner } from "@/components/radar/TikTokConnectionBanner";

export default async function RadarPage({
  searchParams,
}: {
  searchParams: Promise<{ tiktok?: string; detail?: string }>;
}) {
  const [products, profile, params] = await Promise.all([
    getProducts({ sortBy: "score" }),
    getCurrentProfile(),
    searchParams,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Radar de Produtos</h1>

      <TikTokConnectionBanner
        isConnected={!!profile?.tiktok_user_id}
        status={params.tiktok}
        detail={params.detail}
      />

      <p className="text-sm text-slate-500">
        {products.length} produtos disponíveis
        {process.env.NEXT_PUBLIC_USE_MOCK === "true" && " (dados mockados)"}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
