import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuestionMeta {
  id: string;
  title: string;
  type: string;
  order_index: number;
}

interface AnswerDisplay {
  question_title: string;
  question_type: string;
  value: unknown;
  display: string;
}

interface ResponseRow {
  response_id: string;
  submitted_at: string;
  duration_seconds: number | null;
  answers: Record<string, AnswerDisplay>;
}

interface TableResponse {
  data: ResponseRow[];
  questions: QuestionMeta[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDisplayText(value: unknown, type: string): string {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "number") {
    if (type === "scale" || type === "grade") return `${value}점`;
    return String(value);
  }
  return String(value);
}

// ── Route ─────────────────────────────────────────────────────────────────────

// GET /api/surveys/[id]/responses/table
//
// Auth: creator-only.
// Returns a paginated respondent × question matrix for the response table view.
//
// Query params:
//   page  — 1-based page number (default: 1)
//   limit — rows per page (default: 20, max: 100)
//
// Cost:
//   Read 1 — survey (creator auth check)
//   Read 2 — questions (column metadata)
//   Read 3 — responses count (head: true, 0 bytes)
//   Read 4 — responses page (with started_at for duration calc)
//   Read 5 — answers for the current page of response IDs
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Parse pagination params
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const rawLimit = parseInt(url.searchParams.get("limit") ?? "20", 10);
  const limit = Math.min(100, Math.max(1, rawLimit));
  const offset = (page - 1) * limit;

  // Parallel: survey auth check + questions metadata + total response count
  const [surveyResult, questionsResult, countResult] = await Promise.all([
    supabase.from("surveys").select("id").eq("id", surveyId).eq("creator_id", user.id).single(),

    supabase
      .from("questions")
      .select("id, title, type, order_index")
      .eq("survey_id", surveyId)
      .order("order_index", { ascending: true }),

    supabase
      .from("responses")
      .select("*", { count: "exact", head: true })
      .eq("survey_id", surveyId),
  ]);

  if (surveyResult.error || !surveyResult.data) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  if (questionsResult.error) {
    return NextResponse.json({ error: questionsResult.error.message }, { status: 500 });
  }

  const questions = (questionsResult.data ?? []) as QuestionMeta[];
  const total = countResult.count ?? 0;

  // Fetch the current page of responses
  const { data: responsesPage, error: responsesError } = await supabase
    .from("responses")
    .select("id, created_at, started_at")
    .eq("survey_id", surveyId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (responsesError) {
    return NextResponse.json({ error: responsesError.message }, { status: 500 });
  }

  if (!responsesPage || responsesPage.length === 0) {
    const result: TableResponse = {
      data: [],
      questions,
      total,
      page,
      limit,
      has_more: false,
    };
    return NextResponse.json(result);
  }

  const responseIds = responsesPage.map((r) => r.id);

  // Fetch all answers for this page of responses in a single query
  const { data: answersRaw, error: answersError } = await supabase
    .from("answers")
    .select("response_id, question_id, value")
    .in("response_id", responseIds);

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  // Build a question lookup map for O(1) access
  const questionMap = new Map<string, QuestionMeta>(questions.map((q) => [q.id, q]));

  // Group answers by response_id
  const answersByResponse = new Map<string, Array<{ question_id: string; value: unknown }>>();
  for (const answer of answersRaw ?? []) {
    const bucket = answersByResponse.get(answer.response_id);
    if (bucket) {
      bucket.push({ question_id: answer.question_id, value: answer.value });
    } else {
      answersByResponse.set(answer.response_id, [
        { question_id: answer.question_id, value: answer.value },
      ]);
    }
  }

  // Build response rows
  const data: ResponseRow[] = responsesPage.map((response) => {
    const responseAnswers = answersByResponse.get(response.id) ?? [];
    const answerMap: Record<string, AnswerDisplay> = {};

    for (const answer of responseAnswers) {
      const q = questionMap.get(answer.question_id);
      if (!q) continue;
      answerMap[answer.question_id] = {
        question_title: q.title,
        question_type: q.type,
        value: answer.value,
        display: toDisplayText(answer.value, q.type),
      };
    }

    // Duration = created_at - started_at (seconds), null if started_at not recorded
    let durationSeconds: number | null = null;
    if (response.started_at) {
      const start = new Date(response.started_at).getTime();
      const end = new Date(response.created_at).getTime();
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        durationSeconds = Math.round((end - start) / 1000);
      }
    }

    return {
      response_id: response.id,
      submitted_at: response.created_at,
      duration_seconds: durationSeconds,
      answers: answerMap,
    };
  });

  const result: TableResponse = {
    data,
    questions,
    total,
    page,
    limit,
    has_more: offset + responsesPage.length < total,
  };

  return NextResponse.json(result);
}
