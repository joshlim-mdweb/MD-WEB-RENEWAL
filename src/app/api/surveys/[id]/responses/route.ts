import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

interface RewardEligibilityRow {
  status: string;
  disqualify_reason: string | null;
}

interface ResponseItem {
  id: string;
  created_at: string;
  completed_at: string | null;
  respondent_ip: string | null;
  respondent_ua: string | null;
  answer_count: number;
  reward_eligibility: RewardEligibilityRow | null;
}

// GET /api/surveys/[id]/responses
//
// Auth: creator-only.
// Returns a paginated list of responses with reward eligibility status,
// respondent metadata, and answer count.
//
// Query params:
//   page  — 1-based page number (default: 1)
//   limit — rows per page (default: 20, max: 100)
//
// Cost:
//   Read 1 — surveys: auth gate (single row, id only)
//   Read 2 — responses: paginated rows (parallel with Read 3)
//   Read 3 — responses: count head (parallel with Read 2)
//   Read 4 — answers: response_id only, for page's response IDs
//   Read 5 — reward_eligibility: for page's response IDs
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const rawLimit = parseInt(url.searchParams.get("limit") ?? "20", 10) || 20;
  const limit = Math.min(100, Math.max(1, rawLimit));
  const offset = (page - 1) * limit;

  // Auth gate: confirm caller owns the survey before exposing response data.
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (surveyError) {
    return NextResponse.json({ error: "survey_fetch_failed" }, { status: 500 });
  }

  if (!survey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  // Fire paginated rows + total count in parallel.
  const [rowsResult, countResult] = await Promise.all([
    supabase
      .from("responses")
      .select("id, created_at, started_at, respondent_ip, respondent_ua")
      .eq("survey_id", surveyId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1),

    supabase
      .from("responses")
      .select("*", { count: "exact", head: true })
      .eq("survey_id", surveyId),
  ]);

  if (rowsResult.error) {
    return NextResponse.json({ error: "responses_fetch_failed" }, { status: 500 });
  }

  const responsesPage = rowsResult.data ?? [];

  if (responsesPage.length === 0) {
    return NextResponse.json({ responses: [], total: countResult.count ?? 0 });
  }

  const responseIds = responsesPage.map((r) => r.id);

  // Fetch answer counts + reward eligibility for this page in parallel.
  const [answersResult, eligibilityResult] = await Promise.all([
    supabase.from("answers").select("response_id").in("response_id", responseIds),
    supabase
      .from("reward_eligibility")
      .select("response_id, status, disqualify_reason")
      .in("response_id", responseIds),
  ]);

  // Build answer count map — O(n) over answer rows.
  const answerCounts = new Map<string, number>();
  for (const row of answersResult.data ?? []) {
    answerCounts.set(row.response_id, (answerCounts.get(row.response_id) ?? 0) + 1);
  }

  // Build eligibility map — at most one row per response.
  const eligibilityMap = new Map<string, RewardEligibilityRow>();
  for (const row of eligibilityResult.data ?? []) {
    eligibilityMap.set(row.response_id, {
      status: row.status,
      disqualify_reason: row.disqualify_reason ?? null,
    });
  }

  const responses: ResponseItem[] = responsesPage.map((r) => ({
    id: r.id,
    created_at: r.created_at,
    completed_at: r.created_at,
    respondent_ip: r.respondent_ip as string | null,
    respondent_ua: r.respondent_ua ?? null,
    answer_count: answerCounts.get(r.id) ?? 0,
    reward_eligibility: eligibilityMap.get(r.id) ?? null,
  }));

  return NextResponse.json({ responses, total: countResult.count ?? 0 });
}
