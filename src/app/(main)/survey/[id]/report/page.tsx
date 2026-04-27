import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { QuestionType } from "@/lib/types/survey";
import {
  SurveyReportClient,
  type ReportData,
  type QuestionAnswerSummary,
} from "./SurveyReportClient";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

// ─── DB row types (raw Supabase shapes) ───────────────────────────────────────
// Typed locally to avoid coupling survey-report concerns into the global types.

interface SurveyRow {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface QuestionRow {
  id: string;
  survey_id: string;
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
  // Supabase returns the `value` JSONB column as unknown — we narrow per question type
  value: unknown;
}

// ─── Answer aggregation ────────────────────────────────────────────────────────
// Runs in JS after a single bulk fetch of all answers for the survey.
// This avoids N+1 queries (one per question).
//
// Aggregation rules by type:
//   short_text / long_text  → collect raw strings
//   multiple_choice / dropdown / checkbox / grade → count occurrences per option
//   scale                   → count occurrences per value, compute average
//   ranking                 → compute average rank position per option
//   endpoint                → no answers recorded; total = 0

function aggregateAnswers(
  question: QuestionRow,
  answers: AnswerRow[]
): QuestionAnswerSummary["answers"] {
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
      // multiple_choice / dropdown: value is a string
      // checkbox: value is a string[] (multiple selections)
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
      // Grade answers are numeric (star index, 1-based)
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
      // Ranking answers are string[] where index = rank position (0-indexed) and value = option label.
      // We compute the average rank (1-indexed) each option received across all responses.
      const rankSums: Record<string, number> = {};
      const rankCounts: Record<string, number> = {};

      for (const answer of questionAnswers) {
        if (!Array.isArray(answer.value)) continue;

        const ranked = answer.value as string[];
        ranked.forEach((optionLabel, index) => {
          if (typeof optionLabel !== "string") return;
          rankSums[optionLabel] = (rankSums[optionLabel] ?? 0) + (index + 1); // 1-indexed rank
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
      // Pinned nodes are display-only — no answers are ever submitted for them.
      return { total: 0 };

    default: {
      // Exhaustiveness guard
      const _exhaustive: never = type;
      console.warn("Unknown question type in aggregation:", _exhaustive);
      return { total: 0 };
    }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SurveyReportPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth — creator-only page
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ── 1. Fetch survey (enforcing creator_id so non-owners get a 404 experience) ──
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, creator_id, title, description, status, created_at, updated_at")
    .eq("id", id)
    .eq("creator_id", user.id)
    .single<SurveyRow>();

  if (surveyError || !survey) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-[#fafafa]">
        <div className="border border-[#e5e5e5] rounded-2xl px-8 py-12 max-w-lg w-full text-center shadow-sm">
          <p className="text-sm font-semibold text-[#18181e] mb-2">설문을 찾을 수 없습니다</p>
          <p className="text-sm text-[#717171]">존재하지 않거나 접근 권한이 없는 설문입니다.</p>
        </div>
      </main>
    );
  }

  // ── 2. Fetch questions + response count + all answers in parallel ─────────────
  // All three reads are independent — run concurrently to minimise latency.
  const [
    { data: questionRows, error: questionsError },
    { count: totalResponses },
    { data: responseIds },
  ] = await Promise.all([
    supabase
      .from("questions")
      .select("id, survey_id, type, title, options, order_index, required, config")
      .eq("survey_id", id)
      .order("order_index", { ascending: true })
      .returns<QuestionRow[]>(),
    supabase.from("responses").select("id", { count: "exact", head: true }).eq("survey_id", id),
    // We need response IDs to fetch answers via the response FK
    supabase.from("responses").select("id").eq("survey_id", id),
  ]);

  if (questionsError) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-[#fafafa]">
        <div className="border border-[#e5e5e5] rounded-2xl px-8 py-12 max-w-lg w-full text-center shadow-sm">
          <p className="text-sm text-[#717171]">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </main>
    );
  }

  const questions = questionRows ?? [];
  const responseCount = totalResponses ?? 0;

  // ── 3. Fetch answers for all responses in one query ───────────────────────────
  // We use an `in` filter on response_id rather than joining through surveys,
  // because Supabase client doesn't support direct cross-table aggregation.
  // Cost: 1 read regardless of question count — avoids N+1.
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

  // ── 4. Aggregate answers per question ────────────────────────────────────────
  const aggregatedQuestions: QuestionAnswerSummary[] = questions.map((question) => ({
    id: question.id,
    title: question.title,
    type: question.type,
    order_index: question.order_index,
    options: question.options,
    answers: aggregateAnswers(question, answers),
  }));

  // ── 5. Build the report payload and pass to the client component ──────────────
  const reportData: ReportData = {
    survey: {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      status: survey.status as ReportData["survey"]["status"],
      created_at: survey.created_at,
      updated_at: survey.updated_at,
    },
    summary: { totalResponses: responseCount },
    questions: aggregatedQuestions,
  };

  return <SurveyReportClient report={reportData} surveyId={id} />;
}
