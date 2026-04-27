import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/my/profile — returns the authenticated user's profile.
//
// Cost: 1 auth read + 1 profile row read.
// Returns only non-sensitive fields. email is included for display in settings.
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profile")
    .select("id, email, nick_name, signup_type, status, created_at")
    .eq("uuid", user.id)
    .single();

  if (error || !profile) {
    console.error("[profile GET] profile read failed", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json(profile);
}

// PATCH /api/my/profile — updates the authenticated user's nick_name.
//
// Only nick_name is mutable via this endpoint.
// Rules: 2–20 characters, trimmed.
//
// Cost: 1 auth + 1 profile update.
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { nick_name } = body as { nick_name?: unknown };

  if (typeof nick_name !== "string") {
    return NextResponse.json({ error: "nick_name_required" }, { status: 400 });
  }

  const trimmed = nick_name.trim();

  if (trimmed.length < 2 || trimmed.length > 20) {
    return NextResponse.json(
      {
        error: "nick_name_invalid_length",
        message: "닉네임은 2자 이상 20자 이하로 입력해 주세요.",
      },
      { status: 422 }
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("profile")
    .update({ nick_name: trimmed })
    .eq("uuid", user.id)
    .select("id, email, nick_name, signup_type, status, created_at")
    .single();

  if (updateError || !updated) {
    console.error("[profile PATCH] profile update failed", updateError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json(updated);
}
