export default function BriefPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">Briefing Inteligente</h1>
      <p className="text-sm text-slate-500">
        Em construção — Sprint 4. Geração de brief via Claude API já implementada em{" "}
        <code>src/lib/ai/briefGenerator.ts</code>, falta a UI.
      </p>
    </div>
  );
}
