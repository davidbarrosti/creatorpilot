import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForToken } from "@/lib/tiktok/auth";
import { encrypt } from "@/lib/utils/encryption";

const STATE_COOKIE = "tiktok_oauth_state";

/** Receives the TikTok creator OAuth redirect, exchanges the code, saves encrypted tokens. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const redirectTo = (status: "connected" | "error", detail?: string) => {
    const url = new URL("/dashboard/radar", origin);
    url.searchParams.set("tiktok", status);
    if (detail) url.searchParams.set("detail", detail);
    return NextResponse.redirect(url);
  };

  if (errorParam) {
    return redirectTo("error", errorParam);
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectTo("error", "invalid_state");
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    const token = await exchangeCodeForToken(code);

    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        tiktok_user_id: token.open_id,
        tiktok_access_token: encrypt(token.access_token),
        tiktok_refresh_token: encrypt(token.refresh_token),
        token_expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;

    const response = redirectTo("connected");
    response.cookies.delete(STATE_COOKIE);
    return response;
  } catch (err) {
    console.error("TikTok OAuth callback failed:", err);
    return redirectTo("error", "token_exchange_failed");
  }
}
