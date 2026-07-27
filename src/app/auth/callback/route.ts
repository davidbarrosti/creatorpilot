import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/supabase/auth-server";
import { createClient } from "@/lib/supabase/server";

/**
 * Exchanges the Supabase magic-link code for a session, then routes to
 * onboarding (first login) or straight to the Radar (returning user).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const profile = await getCurrentProfile();
  const destination = profile?.onboarding_completed ? "/dashboard/radar" : "/dashboard/onboarding";

  return NextResponse.redirect(`${origin}${destination}`);
}
