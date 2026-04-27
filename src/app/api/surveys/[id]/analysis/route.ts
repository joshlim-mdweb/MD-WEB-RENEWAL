import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { Json } from "@/lib/types/database";

type RouteParams = { params: Promise<{ id: string }> };

const ANALYSIS_CREDIT_COST = 80;
const CLAUDE_MODEL = "claude-haiku-4-5-20251001";

interface DataPoint {
  label: string;
  value: number;
  comparison?: number;
}

interface ClaudeAnalysisOutput {
  sentence: string;
  data_point: DataPoint;
}

// Build per-question aggregated summaries to embed in the Claude system prompt.
// Handles choice, scale/grade, and text question types.
function buildAnswerSummaries(
  questions: { id: string; title: string; type: string; options: unknown }[],
  answerRows: { question_id: string; value: unknown }[]
): string {
  const byQuestion = new Map<string, unknown[]>();
  for (const row of answerRows) {
    if (!byQuestion.has(row.question_id)) byQuestion.set(row.question_id, []);
    byQuestion.get(row.question_id)!.push(row.value);
  }

  return questions
    .map((q, idx) => {
      const answers = byQuestion.get(q.id) ?? [];
      const optionsStr =
        Array.isArray(q.options) && q.options.length > 0
          ? `\n   선택지: ${(q.options as string[]).join(", ")}`
          : "";

      let summaryStr = "";

      if (
        ["multiple_choice", "single_choice", "checkbox", "dropdown", "ranking"].includes(q.type)
      ) {
        const counts: Record<string, number> = {};
        for (const a of answers) {
          const tokens: string[] = Array.isArray(a) ? (a as unknown[]).map(String) : [String(a)];
          for (const token of tokens) {
            counts[token] = (counts[token] ?? 0) + 1;
          }
        }
        const sorted = Object.entries(counts)
          .sort((x, y) => y[1] - x[1])
          .slice(0, 5)
          .map(
            ([v, c]) =>
              `"${v}": ${c}명 (${answers.length > 0 ? Math.round((c / answers.length) * 100) : 0}%)`
          )
          .join(", ");
        summaryStr = sorted ? `응답 분포: ${sorted}` : "응답 없음";
      } else if (["scale", "grade"].includes(q.type)) {
        const nums = answers.map((a) => parseFloat(String(a))).filter((n) => !isNaN(n));
        if (nums.length > 0) {
          const avg = (nums.reduce((s, n) => s + n, 0) / nums.length).toFixed(2);
          const dist: Record<number, number> = {};
          for (const n of nums) dist[n] = (dist[n] ?? 0) + 1;
          const distStr = Object.entries(dist)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([v, c]) => `${v}점: ${c}명`)
            .join(", ");
          summaryStr = `평균: ${avg} (${nums.length}명) | 분포: ${distStr}`;
        } else {
          summaryStr = "응답 없음";
        }
      } else {
        // short_text / long_text — up to 20 samples
        const samples = answers
          .map((a) => String(a ?? "").trim())
          .filter(Boolean)
          .slice(0, 20)
          .map((s, i) => `  ${i + 1}. "${s.slice(0, 120)}"`)
          .join("\n");
        summaryStr = samples ? `응답 샘플 (${answers.length}건):\n${samples}` : "응답 없음";
      }

      return `Q${idx + 1}. [${q.type}] ${q.title}${optionsStr}\n   ${summaryStr}`;
    })
    .join("\n\n");
}

// GET /api/surveys/[id]/analysis
//
// Auth: creator-only.
// Returns all analyses for a survey, newest first. Empty array if none exist.
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Auth gate: confirm caller owns the survey.
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

  const { data: analyses, error: listError } = await supabase
    .from("survey_analyses")
    .select("id, prompt, status, created_at")
    .eq("survey_id", surveyId)
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  if (listError) {
    return NextResponse.json({ error: "analyses_fetch_failed" }, { status: 500 });
  }

  return NextResponse.json(analyses ?? []);
}

// POST /api/surveys/[id]/analysis
//
// Auth: creator-only. Plan: Pro/Max (Free → 403). Credits: 80 (deducted on success).
// Survey must be in 'closed' status.
//
// Body: { prompt: string }
//
// Steps:
//   1. Auth
//   2. Plan check (Pro/Max only)
//   3. Credit balance >= 80
//   4. Survey must be closed + creator-owned
//   5. Insert survey_analyses row (status = 'processing')
//   6. Fetch questions + answers (parallel)
//   7. Call Claude haiku with structured system prompt + creator's prompt
//   8. Parse JSON → update row (status = 'done')
//   9. Deduct 80 credits via service role (success path only)
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  // ── 1. Auth ────────────────────────────────────────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // ── 2. Plan check ──────────────────────────────────────────────────────────
  const { data: profileRow } = await supabase
    .from("profile")
    .select("plan")
    .eq("uuid", user.id)
    .maybeSingle();

  const plan = profileRow?.plan ?? "free";
  if (plan === "free") {
    return NextResponse.json({ error: "analysis_pro_only" }, { status: 403 });
  }

  // ── 3. Credit check ────────────────────────────────────────────────────────
  const { data: creditRow, error: creditError } = await supabase
    .from("ai_credits")
    .select("balance")
    .eq("user_id", user.id)
    .maybeSingle();

  if (creditError) {
    return NextResponse.json({ error: "credits_fetch_failed" }, { status: 500 });
  }

  const currentBalance = creditRow?.balance ?? 0;
  if (currentBalance < ANALYSIS_CREDIT_COST) {
    return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
  }

  // ── 4. Parse body ──────────────────────────────────────────────────────────
  let prompt: string;
  try {
    const body = await req.json();
    prompt = (body.prompt ?? "").trim();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: "prompt_required" }, { status: 422 });
  }

  // ── 5. Verify survey: closed + creator-owned ───────────────────────────────
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, title, description, status")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (surveyError || !survey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  if (survey.status !== "closed") {
    return NextResponse.json({ error: "survey_not_closed" }, { status: 422 });
  }

  // ── 6. Insert analysis row (status = 'processing') ─────────────────────────
  const { data: analysisRow, error: insertError } = await supabase
    .from("survey_analyses")
    .insert({
      survey_id: surveyId,
      creator_id: user.id,
      prompt,
      status: "processing",
    })
    .select("id")
    .single();

  if (insertError || !analysisRow) {
    console.error("[analysis POST] insert failed", insertError);
    return NextResponse.json({ error: "analysis_create_failed" }, { status: 500 });
  }

  const analysisId = analysisRow.id;

  // ── 7. Fetch questions + answers (parallel) ────────────────────────────────
  const [questionsResult, answersResult] = await Promise.all([
    supabase
      .from("questions")
      .select("id, title, type, options")
      .eq("survey_id", surveyId)
      .order("order_index", { ascending: true }),

    supabase
      .from("answers")
      .select("question_id, value, responses!inner(survey_id)")
      .eq("responses.survey_id", surveyId)
      .limit(500),
  ]);

  if (questionsResult.error) {
    await supabase.from("survey_analyses").update({ status: "failed" }).eq("id", analysisId);
    return NextResponse.json({ error: "questions_fetch_failed" }, { status: 500 });
  }

  const questions = questionsResult.data ?? [];
  const rawAnswerRows = (answersResult.data ?? []).map((r) => ({
    question_id: r.question_id,
    value: r.value,
  }));

  // ── 8. Build Claude system prompt ─────────────────────────────────────────
  const questionStructure = questions
    .map((q, i) => {
      const opts =
        Array.isArray(q.options) && q.options.length > 0
          ? `\n   선택지: ${(q.options as string[]).join(", ")}`
          : "";
      return `Q${i + 1}. [${q.type}] ${q.title}${opts}`;
    })
    .join("\n");

  const answerSummary = buildAnswerSummaries(
    questions.map((q) => ({
      id: q.id,
      title: q.title ?? "",
      type: q.type ?? "short_text",
      options: q.options,
    })),
    rawAnswerRows
  );

  const systemPrompt = `당신은 설문 데이터 분석가입니다. 아래 설문 데이터를 바탕으로 창작자의 질문에 답하세요.

[설문 정보]
제목: ${survey.title}${survey.description ? `\n설명: ${survey.description}` : ""}

[질문 구조]
${questionStructure}

[질문별 응답 집계]
${answerSummary}

[지시 사항]
아래 설문 데이터를 바탕으로, 창작자의 질문에 대한 인과관계 문장 1개와 수치 데이터를 JSON으로 반환하세요. 추측 금지, 실제 데이터에서 계산 가능한 수치만 사용하세요.

반드시 아래 JSON 형식만 출력하세요. 코드블록, 설명 텍스트 없음.

{"sentence": "분석 요약 문장", "data_point": {"label": "지표명", "value": 76, "comparison": 31}}

data_point의 value와 comparison은 실제 데이터에서 산출한 퍼센트(0-100) 또는 평균 점수여야 합니다.`;

  // ── 9. Call Claude ─────────────────────────────────────────────────────────
  let claudeOutput: ClaudeAnalysisOutput;
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "";

    // Strip markdown fences if Claude wraps the JSON.
    const cleaned = raw
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    claudeOutput = JSON.parse(cleaned) as ClaudeAnalysisOutput;

    if (
      typeof claudeOutput.sentence !== "string" ||
      typeof claudeOutput.data_point?.label !== "string" ||
      typeof claudeOutput.data_point?.value !== "number"
    ) {
      throw new Error("invalid_output_structure");
    }
  } catch (err) {
    console.error("[analysis POST] Claude failed", err);
    await supabase.from("survey_analyses").update({ status: "failed" }).eq("id", analysisId);
    return NextResponse.json({ error: "ai_analysis_failed" }, { status: 500 });
  }

  // ── 10. Update analysis row with results ──────────────────────────────────
  const { error: updateError } = await supabase
    .from("survey_analyses")
    .update({
      status: "done",
      sentence: claudeOutput.sentence,
      data_point: claudeOutput.data_point as unknown as Json,
    })
    .eq("id", analysisId);

  if (updateError) {
    console.error("[analysis POST] update failed", updateError);
    // Row remains as 'processing' — best effort; don't block the caller.
  }

  // ── 11. Deduct 80 credits via service role (success path only) ─────────────
  const admin = createAdminClient();
  const newBalance = currentBalance - ANALYSIS_CREDIT_COST;
  const now = new Date().toISOString();

  const [, txResult] = await Promise.all([
    admin
      .from("ai_credits")
      .upsert(
        { user_id: user.id, balance: newBalance, updated_at: now },
        { onConflict: "user_id" }
      ),
    admin
      .from("ai_credit_transactions")
      .insert({
        user_id: user.id,
        amount: -ANALYSIS_CREDIT_COST,
        type: "usage",
        source: "analysis",
        created_at: now,
      })
      .select("id")
      .single(),
  ]);

  // Record the credit transaction id for auditability.
  if (!txResult.error && txResult.data) {
    await admin
      .from("survey_analyses")
      .update({ credit_tx_id: txResult.data.id })
      .eq("id", analysisId);
  }

  return NextResponse.json({
    id: analysisId,
    status: "done",
    sentence: claudeOutput.sentence,
    data_point: claudeOutput.data_point,
  });
}
