import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { QuestionType } from "@/lib/types/survey";

type RouteParams = { params: Promise<{ id: string }> };

// ─── DB row types ─────────────────────────────────────────────────────────────

interface QuestionRow {
  id: string;
  type: QuestionType;
  title: string;
  options: string[] | null;
  order_index: number;
  required: boolean;
  config: Record<string, unknown> | null;
}

interface AnswerRow {
  id: string;
  response_id: string;
  question_id: string;
  value: unknown;
}

// ─── Answer shape ─────────────────────────────────────────────────────────────

interface AnswerSummary {
  texts?: string[];
  counts?: Record<string, number>;
  values?: number[];
  average?: number;
  rankAverages?: Record<string, number>;
  total: number;
}

// ─── Aggregation ──────────────────────────────────────────────────────────────
// Copied verbatim from src/app/(main)/survey/[id]/report/page.tsx
// (not exported there — must be duplicated here to avoid "use client" boundary issues)

function aggregateAnswers(question: QuestionRow, answers: AnswerRow[]): AnswerSummary {
  const { type } = question;

  const questionAnswers = answers.filter((a) => a.question_id === question.id);

  switch (type) {
    case "short_text":
    case "long_text": {
      const texts = questionAnswers
        .map((a) => (typeof a.value === "string" ? a.value.trim() : null))
        .filter((t): t is string => t !== null && t.length > 0);
      return { texts, total: texts.length };
    }

    case "multiple_choice":
    case "dropdown":
    case "checkbox": {
      const counts: Record<string, number> = {};

      for (const answer of questionAnswers) {
        const selections = Array.isArray(answer.value)
          ? (answer.value as string[])
          : typeof answer.value === "string"
            ? [answer.value]
            : [];

        for (const selection of selections) {
          if (typeof selection === "string") {
            counts[selection] = (counts[selection] ?? 0) + 1;
          }
        }
      }

      return { counts, total: questionAnswers.length };
    }

    case "scale": {
      const counts: Record<string, number> = {};
      const numericValues: number[] = [];

      for (const answer of questionAnswers) {
        const numeric = typeof answer.value === "number" ? answer.value : Number(answer.value);
        if (!isNaN(numeric)) {
          counts[String(numeric)] = (counts[String(numeric)] ?? 0) + 1;
          numericValues.push(numeric);
        }
      }

      const average =
        numericValues.length > 0
          ? numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length
          : undefined;

      return { counts, values: numericValues, average, total: questionAnswers.length };
    }

    case "grade": {
      const counts: Record<string, number> = {};
      const numericValues: number[] = [];

      for (const answer of questionAnswers) {
        const numeric = typeof answer.value === "number" ? answer.value : Number(answer.value);
        if (!isNaN(numeric)) {
          counts[String(numeric)] = (counts[String(numeric)] ?? 0) + 1;
          numericValues.push(numeric);
        }
      }

      const average =
        numericValues.length > 0
          ? numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length
          : undefined;

      return { counts, average, total: questionAnswers.length };
    }

    case "ranking": {
      const rankSums: Record<string, number> = {};
      const rankCounts: Record<string, number> = {};

      for (const answer of questionAnswers) {
        if (!Array.isArray(answer.value)) continue;

        const ranked = answer.value as string[];
        ranked.forEach((optionLabel, index) => {
          if (typeof optionLabel !== "string") return;
          rankSums[optionLabel] = (rankSums[optionLabel] ?? 0) + (index + 1);
          rankCounts[optionLabel] = (rankCounts[optionLabel] ?? 0) + 1;
        });
      }

      const rankAverages: Record<string, number> = {};
      for (const [label, sum] of Object.entries(rankSums)) {
        rankAverages[label] = sum / (rankCounts[label] ?? 1);
      }

      return { rankAverages, total: questionAnswers.length };
    }

    case "startpoint":
    case "endpoint":
      return { total: 0 };

    default: {
      const _exhaustive: never = type;
      console.warn("Unknown question type in aggregation:", _exhaustive);
      return { total: 0 };
    }
  }
}

// ─── GET /api/surveys/[id]/summary ───────────────────────────────────────────
//
// Auth: creator-only.
// Returns aggregated question-level answer data for the builder result view.
//
// Response shape:
//   { survey, summary: { totalResponses }, questions: QuestionWithAnswers[] }
//
// Cost:
//   Read 1 — survey (creator auth check)
//   Read 2+3 — questions + response count (parallel)
//   Read 4 — response IDs (parallel with 2+3)
//   Read 5 — answers for all responses (single bulk fetch)

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Fetch survey (enforces creator_id)
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, creator_id, title, description, status, created_at, updated_at")
    .eq("id", id)
    .single();

  if (surveyError || !survey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  if (survey.creator_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Parallel: questions + response count + response IDs
  const [
    { data: questionRows, error: questionsError },
    { count: totalResponses },
    { data: responseIds },
  ] = await Promise.all([
    supabase
      .from("questions")
      .select("id, type, title, options, order_index, required, config")
      .eq("survey_id", id)
      .order("order_index", { ascending: true })
      .returns<QuestionRow[]>(),
    supabase.from("responses").select("id", { count: "exact", head: true }).eq("survey_id", id),
    supabase.from("responses").select("id").eq("survey_id", id),
  ]);

  if (questionsError) {
    return NextResponse.json({ error: questionsError.message }, { status: 500 });
  }

  const questions = questionRows ?? [];
  const responseCount = totalResponses ?? 0;

  // Bulk fetch answers for all responses
  let answers: AnswerRow[] = [];

  if (responseIds && responseIds.length > 0) {
    const responseIdList = responseIds.map((r) => r.id);
    const { data: answerRows } = await supabase
      .from("answers")
      .select("id, response_id, question_id, value")
      .in("response_id", responseIdList)
      .returns<AnswerRow[]>();

    answers = answerRows ?? [];
  }

  // Aggregate per question
  const aggregatedQuestions = questions.map((question) => ({
    id: question.id,
    title: question.title,
    type: question.type,
    order_index: question.order_index,
    options: question.options,
    answers: aggregateAnswers(question, answers),
  }));

  return NextResponse.json({
    survey: {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      created_at: survey.created_at,
      updated_at: survey.updated_at,
    },
    summary: { totalResponses: responseCount },
    questions: aggregatedQuestions,
  });
}
