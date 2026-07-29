/**
 * Maps the PT-BR niche categories selected during onboarding
 * (src/app/dashboard/onboarding/page.tsx) to English search terms the Apify
 * actor understands (it searches TikTok Shop US, so PT keywords return
 * nothing useful).
 */
const NICHE_TO_QUERY: Record<string, string> = {
  Beleza: "beauty skincare",
  Eletrônicos: "electronics gadgets",
  Casa: "home organization",
  Suplementos: "fitness supplements",
  "Bem-estar": "wellness self care",
  Moda: "fashion accessories",
  Alimentos: "kitchen gadgets",
  Pet: "pet accessories",
};

/** Falls back to the actor's own defaults (a broad "trending gadgets" mix) if no niche is set. */
export function nichesToQueries(niches: string[] | null | undefined): string[] | undefined {
  if (!niches || niches.length === 0) return undefined;

  const queries = niches.map((n) => NICHE_TO_QUERY[n]).filter((q): q is string => Boolean(q));
  return queries.length > 0 ? queries : undefined;
}
