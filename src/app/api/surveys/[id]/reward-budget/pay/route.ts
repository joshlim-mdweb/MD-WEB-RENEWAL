import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/surveys/[id]/reward-budget/pay
// Phase 0 mock: transitions budget status to 'payment_pending'.
// Real PG integration is deferred to Phase 1.
export async function POST(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { data: budget, error: fetchError } = await supabase
    .from("reward_budgets")
    .select("id, status")
    .eq("survey_id", surveyId)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("[reward-budget/pay:POST]", fetchError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  if (!budget) {
    return NextResponse.json({ error: "budget_not_found" }, { status: 404 });
  }

  if (budget.status !== "draft") {
    return NextResponse.json(
      { error: "budget_already_submitted", message: "이미 결제가 요청된 예산이에요." },
      { status: 409 }
    );
  }

  const { error: updateError } = await supabase
    .from("reward_budgets")
    .update({ status: "payment_pending" })
    .eq("id", budget.id);

  if (updateError) {
    console.error("[reward-budget/pay:POST] update failed", updateError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "payment_pending" });
}
