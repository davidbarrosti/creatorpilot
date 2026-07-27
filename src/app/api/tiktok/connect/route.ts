import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { buildCreatorAuthUrl } from "@/lib/tiktok/auth";

const STATE_COOKIE = "tiktok_oauth_state";

/** Starts the TikTok Shop creator OAuth flow. Requires an existing CreatorPilot session. */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const state = randomUUID();
  const response = NextResponse.redirect(buildCreatorAuthUrl(state));

  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 min — só precisa sobreviver até o usuário voltar do TikTok
    path: "/",
  });

  return response;
}
