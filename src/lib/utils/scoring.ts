import type { OpportunityScoreBreakdown, ProductCache } from "@/types";

/**
 * Opportunity score algorithm — PRD.md seção 5, Módulo 1 (Radar de Produtos).
 * Weights: comissão 30%, tendência 30%, saturação 25%, TikTok PSS 15%.
 */

const COMMISSION_WEIGHT = 0.3;
const TREND_WEIGHT = 0.3;
const SATURATION_WEIGHT = 0.25;
const PSS_WEIGHT = 0.15;

/** Commission rate ≥20% maps to a full 100 sub-score; scales linearly below that. */
function scoreCommission(commissionRate: number): number {
  const CEILING = 20;
  return Math.min(100, (commissionRate / CEILING) * 100);
}

function scoreTrend(trend: ProductCache["trend_direction"]): number {
  switch (trend) {
    case "rising":
      return 100;
    case "stable":
      return 55;
    case "declining":
      return 15;
    default:
      return 50; // unknown — neutral
  }
}

/** Low saturation is good (fewer creators competing for the same audience). */
function scoreSaturation(saturation: ProductCache["saturation_level"]): number {
  switch (saturation) {
    case "low":
      return 100;
    case "medium":
      return 55;
    case "high":
      return 15;
    default:
      return 50;
  }
}

export function calculateOpportunityScore(
  product: Pick<ProductCache, "id" | "commission_rate" | "trend_direction" | "saturation_level"> & {
    product_selection_score?: number | null;
  },
): OpportunityScoreBreakdown {
  const commission_score = scoreCommission(product.commission_rate);
  const trend_score = scoreTrend(product.trend_direction);
  const saturation_score = scoreSaturation(product.saturation_level);
  const pss_score = product.product_selection_score ?? 50; // neutral fallback if TikTok didn't return one

  const total_score = Math.round(
    commission_score * COMMISSION_WEIGHT +
      trend_score * TREND_WEIGHT +
      saturation_score * SATURATION_WEIGHT +
      pss_score * PSS_WEIGHT,
  );

  const visual_tier: OpportunityScoreBreakdown["visual_tier"] =
    total_score >= 70 ? "high" : total_score >= 40 ? "medium" : "low";

  return {
    product_id: product.id,
    total_score,
    commission_score: Math.round(commission_score),
    trend_score: Math.round(trend_score),
    saturation_score: Math.round(saturation_score),
    pss_score: Math.round(pss_score),
    visual_tier,
  };
}
