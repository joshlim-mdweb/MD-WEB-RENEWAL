import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { QuestionType } from "@/lib/types/survey";

type RouteParams = { params: Promise<{ id: string }> };

// ── Inline response shapes ────────────────────────────────────────────────────

interface ReportSurvey {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface QuestionAnswerAggregate {
  // short_text / long_text
  texts?: string[];
  // multiple_choice / checkbox / dropdown
  counts?: Record<string, number>;
  // scale / grade
  values?: number[];
  average?: number;
  // ranking: label → average rank position (1-indexed, lower = ranked higher)
  rankAverages?: Record<string, number>;
  // total answer records for this question
  total: number;
}

interface ReportQuestion {
  id: string;
  title: string;
  type: QuestionType;
  order_index: number;
  options: string[] | null;
  answers: QuestionAnswerAggregate;
}

interface ReportData {
  survey: ReportSurvey;
  summary: { totalResponses: number };
  questions: ReportQuestion[];
}

// ── Raw DB row types ──────────────────────────────────────────────────────────

interface RawQuestion {
  id: string;
  title: string;
  type: QuestionType;
  options: string[] | null;
  order_index: number;
}

// The answers query joins through responses to filter by survey_id.
// Supabase returns the joined relation as a nested object on each row.
interface RawAnswerRow {
  question_id: string;
  value: string | string[] | number;
  // responses relation is present due to !inner join but we only use it for filtering;
  // we do not reference the nested field in aggregation.
  responses: { survey_id: string } | null;
}

// ── Aggregation ───────────────────────────────────────────────────────────────

function aggregateAnswers(questions: RawQuestion[], answerRows: RawAnswerRow[]): ReportQuestion[] {
  // Group raw answer rows by question_id in one pass — O(n) over total answers.
  const byQuestion = new Map<string, Array<string | string[] | number>>();
  for (const row of answerRows) {
    const bucket = byQuestion.get(row.question_id);
    if (bucket) {
      bucket.push(row.value);
    } else {
      byQuestion.set(row.question_id, [row.value]);
    }
  }

  return questions.map((q): ReportQuestion => {
    const rawValues = byQuestion.get(q.id) ?? [];
    const total = rawValues.length;
    let agg: QuestionAnswerAggregate = { total };

    switch (q.type) {
      case "short_text":
      case "long_text": {
        // Each value is a plain string from the respondent.
        const texts = rawValues.filter((v): v is string => typeof v === "string");
        agg = { texts, total };
        break;
      }

      case "multiple_choice":
      case "dropdown": {
        // Each value is a single option string chosen by the respondent.
        const counts: Record<string, number> = {};
        for (const v of rawValues) {
          if (typeof v === "string") {
            counts[v] = (counts[v] ?? 0) + 1;
          }
        }
        agg = { counts, total };
        break;
      }

      case "checkbox": {
        // Each value is string[] — one or more selected options per respondent.
        const counts: Record<string, number> = {};
        for (const v of rawValues) {
          if (Array.isArray(v)) {
            for (const option of v) {
              if (typeof option === "string") {
                counts[option] = (counts[option] ?? 0) + 1;
              }
            }
          }
        }
        agg = { counts, total };
        break;
      }

      case "scale":
      case "grade": {
        // Each value is a number (scale position or grade score).
        const values = rawValues.filter((v): v is number => typeof v === "number");
        const average =
          values.length > 0
            ? Math.round((values.reduce((sum, n) => sum + n, 0) / values.length) * 100) / 100
            : 0;
        agg = { values, average, total };
        break;
      }

      case "ranking": {
        // Each value is string[] where index 0 = rank 1 (best).
        // We compute average rank position (1-indexed) per label.
        // Lower average = ranked higher (more preferred) by respondents.
        const rankSums: Record<string, number> = {};
        const rankCounts: Record<string, number> = {};
        for (const v of rawValues) {
          if (Array.isArray(v)) {
            v.forEach((label, zeroBasedIndex) => {
              if (typeof label === "string") {
                rankSums[label] = (rankSums[label] ?? 0) + (zeroBasedIndex + 1);
                rankCounts[label] = (rankCounts[label] ?? 0) + 1;
              }
            });
          }
        }
        const rankAverages: Record<string, number> = {};
        for (const label of Object.keys(rankSums)) {
          rankAverages[label] = Math.round((rankSums[label] / rankCounts[label]) * 100) / 100;
        }
        agg = { rankAverages, total };
        break;
      }

      case "endpoint": {
        // endpoint questions do not collect answers — no aggregation needed.
        agg = { total: 0 };
        break;
      }
    }

    return {
      id: q.id,
      title: q.title,
      type: q.type,
      order_index: q.order_index,
      options: q.options,
      answers: agg,
    };
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

// GET /api/surveys/[id]/report
//
// Auth: creator-only. Returns aggregate response data for the survey report page.
//
// Cost breakdown:
//   Read 1 — surveys: single row, 7 fields (includes creator_id auth check in WHERE)
//   Read 2 — questions: all questions for this survey, 5 fields, ordered
//   Read 3 — responses: count only, head: true — 0 bytes transferred
//   Read 4 — answers: all answer rows for this survey via !inner join on responses.survey_id
//
// Queries 1–3 fire in parallel. Query 4 fires after the auth gate (must confirm
// caller is creator before exposing any response data).
// Aggregation is done in JS — no per-question DB round-trips.
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parallel: survey (with creator check), questions, response count.
  // The survey query embeds the creator_id check in the WHERE clause — if the
  // row is missing (wrong owner or nonexistent), .single() returns an error.
  const [surveyResult, questionsResult, countResult] = await Promise.all([
    supabase
      .from("surveys")
      .select("id, title, description, status, creator_id, created_at, updated_at")
      .eq("id", surveyId)
      .eq("creator_id", user.id)
      .single(),

    supabase
      .from("questions")
      .select("id, title, type, options, order_index")
      .eq("survey_id", surveyId)
      .order("order_index", { ascending: true }),

    // head: true — transfers only the count header, zero row bytes.
    supabase
      .from("responses")
      .select("*", { count: "exact", head: true })
      .eq("survey_id", surveyId),
  ]);

  if (surveyResult.error || !surveyResult.data) {
    // .single() errors when no row matches — could be not found or wrong owner.
    // We intentionally collapse both into 404 to avoid leaking survey existence
    // to non-owners (no 403 oracle on this endpoint).
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  if (questionsResult.error) {
    return NextResponse.json({ error: questionsResult.error.message }, { status: 500 });
  }

  const rawSurvey = surveyResult.data;
  const questions = (questionsResult.data ?? []) as RawQuestion[];
  const totalResponses = countResult.count ?? 0;

  // Fetch all answers for this survey in a single query.
  // The !inner join on responses filters to only answers whose response belongs
  // to this survey — avoids a separate subquery or per-question reads.
  const { data: rawAnswers, error: answersError } = await supabase
    .from("answers")
    .select("question_id, value, responses!inner(survey_id)")
    .eq("responses.survey_id", surveyId);

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 });
  }

  const answerRows = (rawAnswers ?? []) as unknown as RawAnswerRow[];

  // Strip creator_id from the survey shape before returning — callers do not
  // need it and it is mildly sensitive (internal Supabase user UUID).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { creator_id: _unused, ...surveyFields } = rawSurvey;

  const reportData: ReportData = {
    survey: surveyFields,
    summary: { totalResponses },
    questions: aggregateAnswers(questions, answerRows),
  };

  return NextResponse.json(reportData);
}
