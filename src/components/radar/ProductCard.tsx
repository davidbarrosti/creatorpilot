import type { ProductCache } from "@/types";
import { calculateOpportunityScore } from "@/lib/utils/scoring";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";

const TIER_STYLES = {
  high: "bg-opportunity-high/10 text-opportunity-high border-opportunity-high/30",
  medium: "bg-opportunity-medium/10 text-opportunity-medium border-opportunity-medium/30",
  low: "bg-opportunity-low/10 text-opportunity-low border-opportunity-low/30",
} as const;

const TIER_EMOJI = { high: "🟢", medium: "🟡", low: "🔴" } as const;

export function ProductCard({ product }: { product: ProductCache }) {
  const score =
    product.opportunity_score != null
      ? { total_score: product.opportunity_score, visual_tier: tierFromScore(product.opportunity_score) }
      : calculateOpportunityScore(product);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{product.title}</h3>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_STYLES[score.visual_tier]}`}
        >
          {TIER_EMOJI[score.visual_tier]} {score.total_score}
        </span>
      </div>

      <p className="text-sm text-slate-500">{product.category ?? "Sem categoria"}</p>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{formatCurrency(product.price_cents, product.currency)}</span>
        {product.commission_rate > 0 && (
          <span className="text-slate-600">{formatPercent(product.commission_rate)} comissão</span>
        )}
      </div>

      <span className="w-fit rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
        {product.collaboration_type === "open" ? "Open Collaboration" : "Target Collaboration"}
      </span>
    </div>
  );
}

function tierFromScore(score: number): "high" | "medium" | "low" {
  return score >= 70 ? "high" : score >= 40 ? "medium" : "low";
}
