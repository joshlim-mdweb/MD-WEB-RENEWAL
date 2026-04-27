import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/surveys/[id]/close
//
// Transitions a published survey to 'closed' and settles rewards.
//
// Reward settlement policy (survey.md):
//   reward_type='none'       — no point_ledger inserts
//   reward_type='first_come' — all authenticated respondents receive reward_amount (pending)
//   reward_type='random'     — reward_winner_count respondents drawn at random, each gets reward_amount
//
// Points are inserted with status='pending'. The nightly cron
// (POST /api/internal/points/release) transitions them to 'available' the next day.
//
// Settlement is best-effort after the status update — a failure here does NOT
// roll back the status change. Ops can re-run settlement via a separate reconcile
// endpoint in future. For MVP this is an acceptable trade-off (no DB transactions
// available from the Supabase JS client).
//
// Cost: 1 auth + 1 survey read + 1 status update +
//       (if reward) 1 respondents read + 1 batch point_ledger insert.
//
// Returns:
//   200  — updated survey row + settlement summary
//   400  — survey not in 'published' status
//   401  — unauthenticated
//   403  — not the creator
//   404  — survey not found
export async function POST(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Read reward fields alongside status — needed for settlement after close.
  const { data: survey, error: fetchError } = await supabase
    .from("surveys")
    .select("id, creator_id, status, reward_type, reward_amount, reward_winner_count")
    .eq("id", id)
    .single();

  if (fetchError || !survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  if (survey.creator_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (survey.status !== "published") {
    return NextResponse.json(
      {
        error: `Only published surveys can be closed. Current status: '${survey.status}'.`,
        code: "INVALID_TRANSITION",
      },
      { status: 400 }
    );
  }

  // Transition status first. If reward settlement fails afterward, the survey is
  // still closed and ops can reconcile — leaving it open is worse.
  const { data: updatedSurvey, error: updateError } = await supabase
    .from("surveys")
    .update({ status: "closed", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("creator_id", user.id)
    .select("id, title, description, status, created_at, updated_at")
    .single();

  if (updateError || !updatedSurvey) {
    console.error("[close POST] status update failed", updateError);
    return NextResponse.json({ error: "Failed to close survey" }, { status: 500 });
  }

  // No reward configured — return early.
  const rewardType = survey.reward_type ?? "none";
  const rewardAmount = survey.reward_amount ?? 0;

  if (rewardType === "none" || rewardAmount <= 0) {
    return NextResponse.json({ ...updatedSurvey, settlement: { rewarded: 0 } });
  }

  // Fetch all authenticated respondents (user_id IS NOT NULL).
  // We only need user_id — select minimal columns.
  const { data: responses, error: responsesError } = await supabase
    .from("responses")
    .select("id, user_id")
    .eq("survey_id", id)
    .not("user_id", "is", null);

  if (responsesError) {
    console.error("[close POST] respondents fetch failed after close", responsesError);
    // Survey is already closed — report partial success.
    return NextResponse.json(
      { ...updatedSurvey, settlement: { rewarded: 0, error: "respondents_fetch_failed" } },
      { status: 200 }
    );
  }

  const allRespondents = (responses ?? []) as { id: string; user_id: string }[];

  if (allRespondents.length === 0) {
    return NextResponse.json({ ...updatedSurvey, settlement: { rewarded: 0 } });
  }

  // Determine which respondents receive rewards.
  let winners: { id: string; user_id: string }[];

  if (rewardType === "random") {
    const winnerCount = survey.reward_winner_count ?? 1;
    // Fisher-Yates partial shuffle to pick winnerCount unique entries.
    const pool = [...allRespondents];
    const count = Math.min(winnerCount, pool.length);
    for (let i = 0; i < count; i++) {
      const j = i + Math.floor(Math.random() * (pool.length - i));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    winners = pool.slice(0, count);
  } else {
    // first_come — all respondents win
    winners = allRespondents;
  }

  // Batch insert all point_ledger rows in a single write.
  const ledgerRows = winners.map((r) => ({
    user_id: r.user_id,
    source_type: "survey" as const,
    source_id: r.id,
    amount: rewardAmount,
    status: "pending" as const,
  }));

  const { error: ledgerError } = await supabase.from("point_ledger").insert(ledgerRows);

  if (ledgerError) {
    console.error("[close POST] point_ledger batch insert failed", id, ledgerError);
    return NextResponse.json(
      { ...updatedSurvey, settlement: { rewarded: 0, error: "ledger_insert_failed" } },
      { status: 200 }
    );
  }

  return NextResponse.json({ ...updatedSurvey, settlement: { rewarded: winners.length } });
}
