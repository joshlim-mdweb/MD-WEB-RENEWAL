import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface PayoutBatchBody {
  surveyId: string;
}

// POST /api/admin/payout-batches
// Collects all 'confirmed' reward_eligibility rows for a survey
// and creates a single payout_batch record.
// Requires authenticated admin session.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: PayoutBatchBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { surveyId } = body;

  if (!surveyId || typeof surveyId !== "string") {
    return NextResponse.json({ error: "surveyId is required" }, { status: 422 });
  }

  const adminClient = createAdminClient();

  // Fetch the budget for this survey
  const { data: budget, error: budgetError } = await adminClient
    .from("reward_budgets")
    .select("id")
    .eq("survey_id", surveyId)
    .maybeSingle();

  if (budgetError) {
    console.error("[admin/payout-batches:POST] budget fetch failed", budgetError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  if (!budget) {
    return NextResponse.json({ error: "budget_not_found" }, { status: 404 });
  }

  // Collect confirmed eligibility rows
  const { data: eligibleRows, error: eligibleError } = await adminClient
    .from("reward_eligibility")
    .select("id, amount")
    .eq("survey_id", surveyId)
    .eq("status", "confirmed");

  if (eligibleError) {
    console.error("[admin/payout-batches:POST] eligibility fetch failed", eligibleError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  if (!eligibleRows || eligibleRows.length === 0) {
    return NextResponse.json(
      { error: "no_confirmed_eligibility", message: "확정된 지급 대상이 없어요." },
      { status: 422 }
    );
  }

  const totalRecipients = eligibleRows.length;
  const totalAmount = eligibleRows.reduce((sum, row) => sum + row.amount, 0);

  const { data: batch, error: batchError } = await adminClient
    .from("payout_batches")
    .insert({
      budget_id: budget.id,
      survey_id: surveyId,
      total_recipients: totalRecipients,
      total_amount: totalAmount,
      status: "draft",
      created_by: user.id,
    })
    .select("id, budget_id, survey_id, total_recipients, total_amount, status, created_at")
    .single();

  if (batchError || !batch) {
    console.error("[admin/payout-batches:POST] batch insert failed", batchError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({ batch }, { status: 201 });
}
