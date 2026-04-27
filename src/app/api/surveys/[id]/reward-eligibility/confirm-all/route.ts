import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/surveys/[id]/reward-eligibility/confirm-all
//
// Auth: creator-only.
// Only allowed when survey.status === 'closed'.
//
// Behavior varies by survey.reward_type:
//
//   first_come — confirm the first max_recipients non-abusive pending responses
//                (ordered by responses.created_at ASC)
//
//   random     — randomly select reward_winner_count from non-abusive pending responses
//
//   none       — 422: no reward type configured
//
// Response:
//   { confirmed: number, reward_type: string }

export async function PATCH(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Fetch survey with reward config
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, status, reward_type, reward_winner_count")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (surveyError) {
    return NextResponse.json({ error: "survey_fetch_failed" }, { status: 500 });
  }

  if (!survey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  if (survey.status !== "closed") {
    return NextResponse.json(
      {
        error: "survey_not_closed",
        message: "마감된 설문에서만 보상을 확정할 수 있어요.",
      },
      { status: 422 }
    );
  }

  const rewardType = survey.reward_type ?? "none";

  if (rewardType === "none") {
    return NextResponse.json(
      { error: "no_reward_type", message: "보상 유형이 설정되지 않은 설문이에요." },
      { status: 422 }
    );
  }

  // For first_come: fetch max_recipients from reward_budgets
  let maxRecipients: number | null = null;
  if (rewardType === "first_come") {
    const { data: budget } = await supabase
      .from("reward_budgets")
      .select("max_recipients")
      .eq("survey_id", surveyId)
      .maybeSingle();

    maxRecipients = budget?.max_recipients ?? null;
    if (!maxRecipients) {
      return NextResponse.json(
        { error: "no_budget", message: "보상 예산이 설정되지 않았어요." },
        { status: 422 }
      );
    }
  }

  const winnerCount =
    rewardType === "random" ? (survey.reward_winner_count ?? null) : maxRecipients;

  if (!winnerCount || winnerCount < 1) {
    return NextResponse.json(
      { error: "invalid_winner_count", message: "당첨자 수가 올바르지 않아요." },
      { status: 422 }
    );
  }

  // Fetch all pending, non-abusive (not disqualified) eligibility rows for this survey
  const { data: pendingRows, error: pendingError } = await supabase
    .from("reward_eligibility")
    .select("id, response_id, created_at")
    .eq("survey_id", surveyId)
    .eq("status", "pending");

  if (pendingError) {
    return NextResponse.json({ error: "eligibility_fetch_failed" }, { status: 500 });
  }

  if (!pendingRows || pendingRows.length === 0) {
    return NextResponse.json({ confirmed: 0, reward_type: rewardType });
  }

  // Determine which rows to confirm
  let winnersToConfirm: string[];

  if (rewardType === "first_come") {
    // For first_come: need submission time from responses table — sort by created_at ASC
    const responseIds = pendingRows.map((r) => r.response_id);
    const { data: responseTimes } = await supabase
      .from("responses")
      .select("id, created_at")
      .in("id", responseIds)
      .order("created_at", { ascending: true })
      .limit(winnerCount);

    const winnerResponseIds = new Set((responseTimes ?? []).map((r) => r.id));
    winnersToConfirm = pendingRows
      .filter((r) => winnerResponseIds.has(r.response_id))
      .map((r) => r.id);
  } else {
    // random: shuffle array and pick winnerCount
    const shuffled = [...pendingRows].sort(() => Math.random() - 0.5);
    winnersToConfirm = shuffled.slice(0, winnerCount).map((r) => r.id);
  }

  if (winnersToConfirm.length === 0) {
    return NextResponse.json({ confirmed: 0, reward_type: rewardType });
  }

  const { data: updated, error: updateError } = await supabase
    .from("reward_eligibility")
    .update({ status: "confirmed", updated_at: new Date().toISOString() })
    .in("id", winnersToConfirm)
    .select("id");

  if (updateError) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({
    confirmed: updated?.length ?? 0,
    reward_type: rewardType,
  });
}
