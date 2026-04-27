import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Only allow redirects to relative paths within the same origin.
// Strips scheme/host to prevent open-redirect abuse via crafted login URLs.
function sanitizeRedirect(raw: string): string {
  try {
    const url = new URL(raw, "https://placeholder.invalid");
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

// Map OAuth provider error codes to safe user-facing messages.
// Unmapped codes fall back to the generic error message.
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "로그인이 취소됐어요.",
  server_error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.",
  temporarily_unavailable: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.",
};
const GENERIC_AUTH_ERROR = "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawRedirect = searchParams.get("redirectTo") ?? "/";
  const redirectTo = sanitizeRedirect(rawRedirect);

  // Supabase sends an error param when OAuth fails (e.g. user denied access,
  // provider not configured). Map to a safe user-facing message to prevent
  // reflected content injection via crafted callback URLs.
  const oauthError = searchParams.get("error");
  if (oauthError) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", OAUTH_ERROR_MESSAGES[oauthError] ?? GENERIC_AUTH_ERROR);
    return NextResponse.redirect(loginUrl.toString());
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const loginUrl = new URL("/login", origin);
      loginUrl.searchParams.set("error", GENERIC_AUTH_ERROR);
      return NextResponse.redirect(loginUrl.toString());
    }
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
