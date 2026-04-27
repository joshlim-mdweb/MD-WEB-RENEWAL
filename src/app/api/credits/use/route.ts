import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import type { CreditTransactionSource } from "@/lib/stripe";

type UseCreditsBody = {
  amount: number;
  source: CreditTransactionSource;
};

// POST /api/credits/use
// AI 크레딧을 차감한다.
//
// Body: { amount: number, source: CreditTransactionSource }
// 잔량 부족: 402
// Free 플랜 (크레딧 없음): 403
//
// 차감은 admin 클라이언트로 처리 — RLS write 정책이 service_role 전용이므로.
// Cost: 1 auth + 1 profile read + 1 credits read + 1 credits update + 1 tx insert
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: UseCreditsBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request_body" }, { status: 422 });
  }

  const { amount, source } = body;

  if (!Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 422 });
  }

  const validSources: CreditTransactionSource[] = [
    "subscription",
    "topup",
    "survey_generation",
    "analysis",
  ];
  if (!validSources.includes(source)) {
    return NextResponse.json({ error: "invalid_source" }, { status: 422 });
  }

  // 플랜 확인 — Free 플랜은 AI 기능 차단
  const { data: profileRow } = await supabase
    .from("profile")
    .select("plan")
    .eq("uuid", user.id)
    .maybeSingle();

  const plan = profileRow?.plan ?? "free";
  if (plan === "free") {
    return NextResponse.json({ error: "ai_not_available_on_free_plan" }, { status: 403 });
  }

  // 크레딧 잔량 확인 (read는 anon 클라이언트 — 본인 row 조회)
  const { data: creditRow, error: creditError } = await supabase
    .from("ai_credits")
    .select("balance")
    .eq("user_id", user.id)
    .maybeSingle();

  if (creditError) {
    return NextResponse.json({ error: "credits_fetch_failed" }, { status: 500 });
  }

  const currentBalance = creditRow?.balance ?? 0;

  if (currentBalance < amount) {
    return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
  }

  // 차감은 service_role로 처리
  const admin = createAdminClient();
  const newBalance = currentBalance - amount;
  const now = new Date().toISOString();

  const [updateResult, txResult] = await Promise.all([
    admin
      .from("ai_credits")
      .upsert(
        { user_id: user.id, balance: newBalance, updated_at: now },
        { onConflict: "user_id" }
      ),
    admin.from("ai_credit_transactions").insert({
      user_id: user.id,
      amount: -amount,
      type: "usage",
      source,
      created_at: now,
    }),
  ]);

  if (updateResult.error) {
    console.error("[credits/use] balance update failed", updateResult.error);
    return NextResponse.json({ error: "credits_update_failed" }, { status: 500 });
  }

  if (txResult.error) {
    // 트랜잭션 기록 실패는 로깅만 — 잔량 차감은 완료됨
    console.error("[credits/use] tx insert failed", txResult.error);
  }

  return NextResponse.json({
    balance: newBalance,
    deducted: amount,
  });
}
