import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { completeOnboarding } from "./actions";

const NICHES = [
  "Beleza",
  "Eletrônicos",
  "Casa",
  "Suplementos",
  "Bem-estar",
  "Moda",
  "Alimentos",
  "Pet",
] as const;

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-2xl font-bold">Bem-vindo ao CreatorPilot</h1>
        <p className="mt-1 text-slate-600">
          Escolhe os nichos que você já promove ou quer promover. Isso ajusta o Radar pra você.
        </p>
      </div>

      <form action={completeOnboarding} className="flex flex-col gap-4">
        <fieldset className="grid grid-cols-2 gap-2">
          {NICHES.map((niche) => (
            <label
              key={niche}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm has-checked:border-slate-900 has-checked:bg-slate-50"
            >
              <input type="checkbox" name="niche" value={niche} className="accent-slate-900" />
              {niche}
            </label>
          ))}
        </fieldset>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800"
        >
          Continuar
        </button>
      </form>
    </main>
  );
}
