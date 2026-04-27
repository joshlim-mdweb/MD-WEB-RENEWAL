import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/credits/balance
// 현재 사용자의 AI 크레딧 잔량을 반환한다.
// Cost: 1 auth + 1 read
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("ai_credits")
    .select("balance, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "credits_fetch_failed" }, { status: 500 });
  }

  return NextResponse.json({
    balance: data?.balance ?? 0,
    updatedAt: data?.updated_at ?? null,
  });
}
