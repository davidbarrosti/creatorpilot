import { createClient } from "./client";

/**
 * Magic-link auth — Client Component side. Supabase's `signInWithOtp` covers
 * both signup and login in one call (it creates the user on first use), so
 * there's no separate "sign up" flow to build — same form, same function.
 */
export async function signInWithMagicLink(email: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });

  return { error: error?.message ?? null };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
