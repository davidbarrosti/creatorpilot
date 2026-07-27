import { getProducts } from "@/lib/tiktok/api";
import { ProductCard } from "@/components/radar/ProductCard";

export default async function RadarPage() {
  const products = await getProducts({ sortBy: "score" });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Radar de Produtos</h1>
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
