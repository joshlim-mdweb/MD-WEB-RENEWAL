import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/credits/purchase
// 크레딧 추가 구매 진입점. 플랜 확인 후 TossPayments 체크아웃으로 리다이렉트.
// 실제 결제 흐름: /checkout/credits → /api/orders → TossPayments 위젯 → /payments/success → /api/payments/confirm
//
// Free 플랜은 크레딧 구매 불가.
export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profileRow } = await supabase
    .from("profile")
    .select("plan")
    .eq("uuid", user.id)
    .maybeSingle();

  const plan = profileRow?.plan ?? "free";
  if (plan === "free") {
    return NextResponse.json(
      { error: "credit_purchase_not_available_on_free_plan" },
      { status: 403 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return NextResponse.json({ url: `${appUrl}/checkout/credits` });
  // 실제 결제 흐름: /checkout/credits → /api/billing/checkout (type=credits) → Stripe → /payments/success
}
