import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/surveys/[id]/reward-budget
// Returns the reward budget for the given survey (creator only).
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("reward_budgets")
    .select(
      "id, survey_id, per_response_amount, max_recipients, total_amount, status, payment_ref, paid_at, created_at, updated_at"
    )
    .eq("survey_id", surveyId)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[reward-budget:GET]", error);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({ budget: null });
  }

  return NextResponse.json({ budget: data });
}

interface BudgetBody {
  per_response_amount: number;
  max_recipients: number;
}

// POST /api/surveys/[id]/reward-budget
// Creates or replaces the reward budget for a survey.
// Only allowed when the budget is in 'draft' status (or does not exist yet).
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: BudgetBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { per_response_amount, max_recipients } = body;

  if (
    typeof per_response_amount !== "number" ||
    per_response_amount < 100 ||
    !Number.isInteger(per_response_amount)
  ) {
    return NextResponse.json(
      { error: "per_response_amount must be an integer >= 100" },
      { status: 422 }
    );
  }

  if (
    typeof max_recipients !== "number" ||
    max_recipients < 1 ||
    !Number.isInteger(max_recipients)
  ) {
    return NextResponse.json(
      { error: "max_recipients must be a positive integer" },
      { status: 422 }
    );
  }

  // Verify the survey belongs to this creator
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, creator_id")
    .eq("id", surveyId)
    .single();

  if (surveyError || !survey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  if (survey.creator_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Reject edits if existing budget is no longer in draft
  const { data: existing } = await supabase
    .from("reward_budgets")
    .select("id, status")
    .eq("survey_id", surveyId)
    .maybeSingle();

  if (existing && existing.status !== "draft") {
    return NextResponse.json(
      { error: "budget_not_editable", message: "draft 상태일 때만 수정할 수 있어요." },
      { status: 409 }
    );
  }

  const total_amount = per_response_amount * max_recipients;

  const { data: upserted, error: upsertError } = await supabase
    .from("reward_budgets")
    .upsert(
      {
        survey_id: surveyId,
        creator_id: user.id,
        per_response_amount,
        max_recipients,
        total_amount,
        status: "draft",
      },
      { onConflict: "survey_id" }
    )
    .select(
      "id, survey_id, per_response_amount, max_recipients, total_amount, status, created_at, updated_at"
    )
    .single();

  if (upsertError || !upserted) {
    console.error("[reward-budget:POST]", upsertError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({ budget: upserted }, { status: 200 });
}
