import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types";
import { createClient } from "./server";

/** Server Components / Route Handlers only — reads the session from cookies. */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Fetches the current user's `profiles` row, creating it on first login if missing. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing as Profile;

  const { data: created } = await supabase
    .from("profiles")
    .insert({ id: user.id })
    .select("*")
    .single();

  return created as Profile | null;
}
