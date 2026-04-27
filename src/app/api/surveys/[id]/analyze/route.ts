import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// ── Types ─────────────────────────────────────────────────────────────────────

interface DistributionItem {
  value: string;
  count: number;
  percentage: number;
}

interface AnalyzeResponse {
  question: {
    id: string;
    title: string;
    type: string;
    options: unknown;
  };
  filter_applied: boolean;
  filter_info?: {
    question_title: string;
    answer_value: string;
    matched_count: number;
  };
  total_responses: number;
  distribution: DistributionItem[];
  // true when the filtered segment has fewer than 5 respondents
  insufficient_data: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Normalize a stored answer value to a flat list of string tokens for matching.
// Handles: plain string, number, string[] (checkbox/ranking).
function toStringTokens(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

// ── Route ─────────────────────────────────────────────────────────────────────

// GET /api/surveys/[id]/analyze
//
// Auth: creator-only.
// Returns the answer distribution for a target question, optionally filtered
// to the subset of respondents who gave a specific answer to another question.
//
// Query params (all required except filter_*):
//   question_id        — ID of the question whose distribution to analyze
//   filter_question_id — (optional) condition question ID
//   filter_answer      — (optional) condition answer value; requires filter_question_id
//
// Cost (with filter):
//   Read 1 — survey (creator auth)
//   Read 2 — target question metadata
//   Read 3 — filter question metadata
//   Read 4 — answers for filter question → matched response_ids
//   Read 5 — answers for target question scoped to matched response_ids
//   Read 6 — total response count (head: true)
//
// Cost (no filter):
//   Read 1 — survey (creator auth)
//   Read 2 — target question metadata
//   Read 3 — answers for target question (all responses for this survey)
//   Read 4 — total response count (head: true)
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
  const questionId = url.searchParams.get("question_id");
  const filterQuestionId = url.searchParams.get("filter_question_id");
  const filterAnswer = url.searchParams.get("filter_answer");

  if (!questionId) {
    return NextResponse.json(
      { error: "missing_param", message: "question_id가 필요해요." },
      { status: 400 }
    );
  }

  // filter_answer without filter_question_id is meaningless
  if (filterAnswer && !filterQuestionId) {
    return NextResponse.json(
      {
        error: "missing_param",
        message: "filter_answer를 사용하려면 filter_question_id도 필요해요.",
      },
      { status: 400 }
    );
  }

  const filterApplied = !!(filterQuestionId && filterAnswer);

  // ── Auth gate: verify caller is survey creator ────────────────────────────
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .single();

  if (surveyError || !survey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  // ── Fetch target question metadata ────────────────────────────────────────
  const { data: targetQuestion, error: targetQError } = await supabase
    .from("questions")
    .select("id, title, type, options, order_index")
    .eq("id", questionId)
    .eq("survey_id", surveyId)
    .single();

  if (targetQError || !targetQuestion) {
    return NextResponse.json(
      { error: "question_not_found", message: "질문을 찾을 수 없어요." },
      { status: 404 }
    );
  }

  // ── Total response count for this survey ─────────────────────────────────
  const { count: totalResponses } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq("survey_id", surveyId);

  const total = totalResponses ?? 0;

  // ── Step 1 (conditional): resolve matched response IDs ───────────────────
  let matchedResponseIds: string[] | null = null; // null = no filter applied
  let filterInfo: AnalyzeResponse["filter_info"] | undefined;

  if (filterApplied) {
    // Fetch filter question title for the response payload
    const { data: filterQuestion, error: filterQError } = await supabase
      .from("questions")
      .select("id, title")
      .eq("id", filterQuestionId!)
      .eq("survey_id", surveyId)
      .single();

    if (filterQError || !filterQuestion) {
      return NextResponse.json(
        { error: "filter_question_not_found", message: "조건 질문을 찾을 수 없어요." },
        { status: 404 }
      );
    }

    // Fetch all answers for the filter question in this survey
    const { data: filterAnswers, error: filterAnswersError } = await supabase
      .from("answers")
      .select("response_id, value, responses!inner(survey_id)")
      .eq("question_id", filterQuestionId!)
      .eq("responses.survey_id", surveyId);

    if (filterAnswersError) {
      return NextResponse.json({ error: filterAnswersError.message }, { status: 500 });
    }

    // Collect response_ids where the stored answer contains filterAnswer token
    const matched: string[] = [];
    for (const row of filterAnswers ?? []) {
      const tokens = toStringTokens(row.value);
      if (tokens.includes(filterAnswer!)) {
        matched.push(row.response_id);
      }
    }

    matchedResponseIds = matched;
    filterInfo = {
      question_title: filterQuestion.title,
      answer_value: filterAnswer!,
      matched_count: matched.length,
    };
  }

  // ── Step 2: fetch target question answers, scoped to matched IDs ──────────
  let targetAnswersQuery = supabase
    .from("answers")
    .select("value, responses!inner(survey_id)")
    .eq("question_id", questionId)
    .eq("responses.survey_id", surveyId);

  if (matchedResponseIds !== null) {
    if (matchedResponseIds.length === 0) {
      // No matched respondents — return empty distribution immediately
      const result: AnalyzeResponse = {
        question: {
          id: targetQuestion.id,
          title: targetQuestion.title,
          type: targetQuestion.type,
          options: targetQuestion.options,
        },
        filter_applied: true,
        filter_info: filterInfo,
        total_responses: total,
        distribution: [],
        insufficient_data: true,
      };
      return NextResponse.json(result);
    }
    targetAnswersQuery = targetAnswersQuery.in("response_id", matchedResponseIds);
  }

  const { data: targetAnswers, error: targetAnswersError } = await targetAnswersQuery;

  if (targetAnswersError) {
    return NextResponse.json({ error: targetAnswersError.message }, { status: 500 });
  }

  // ── Aggregate distribution ────────────────────────────────────────────────
  const counts: Record<string, number> = {};
  for (const row of targetAnswers ?? []) {
    const tokens = toStringTokens(row.value);
    for (const token of tokens) {
      counts[token] = (counts[token] ?? 0) + 1;
    }
  }

  const segmentTotal = matchedResponseIds !== null ? matchedResponseIds.length : total;
  const denominator = segmentTotal > 0 ? segmentTotal : 1;

  const distribution: DistributionItem[] = Object.entries(counts)
    .map(([value, count]) => ({
      value,
      count,
      percentage: Math.round((count / denominator) * 1000) / 10, // one decimal place
    }))
    .sort((a, b) => b.count - a.count);

  const result: AnalyzeResponse = {
    question: {
      id: targetQuestion.id,
      title: targetQuestion.title,
      type: targetQuestion.type,
      options: targetQuestion.options,
    },
    filter_applied: filterApplied,
    filter_info: filterInfo,
    total_responses: total,
    distribution,
    insufficient_data: filterApplied && (matchedResponseIds?.length ?? 0) < 5,
  };

  return NextResponse.json(result);
}
