"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { createClient } from "@/lib/supabase/server";

export async function completeOnboarding(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const niche = formData.getAll("niche").map(String);
  if (niche.length === 0) {
    throw new Error("Selecione ao menos um nicho.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ niche, onboarding_completed: true })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  redirect("/dashboard/radar");
}
