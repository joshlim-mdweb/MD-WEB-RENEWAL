import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type RouteParams = { params: Promise<{ id: string }> };

const FOLLOW_UP_CREDIT_COST = 50;

const VALID_QUESTION_TYPES = [
  "multiple_choice",
  "checkbox",
  "short_text",
  "long_text",
  "scale",
  "dropdown",
] as const;

type ValidQuestionType = (typeof VALID_QUESTION_TYPES)[number];

interface GeneratedQuestion {
  type: ValidQuestionType;
  title: string;
  options?: string[];
  required: boolean;
}

interface GeminiOutput {
  title: string;
  description: string;
  questions: GeneratedQuestion[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Normalize stored answer value → flat string tokens
function toStringTokens(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return (value as unknown[]).map(String);
  return [String(value)];
}

// Build per-question response summaries to embed in the Gemini prompt
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
          ? `선택지: ${(q.options as string[]).join(", ")}`
          : "";

      let summaryStr = "";
      if (["multiple_choice", "checkbox", "dropdown", "ranking"].includes(q.type)) {
        const counts: Record<string, number> = {};
        for (const a of answers) {
          for (const token of toStringTokens(a)) {
            counts[token] = (counts[token] ?? 0) + 1;
          }
        }
        const top = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([v, c]) => `"${v}" (${c}명)`)
          .join(", ");
        summaryStr = top ? `주요 응답: ${top}` : "응답 없음";
      } else if (["scale", "grade"].includes(q.type)) {
        const nums = answers.map((a) => parseFloat(String(a))).filter((n) => !isNaN(n));
        if (nums.length > 0) {
          const avg = (nums.reduce((s, n) => s + n, 0) / nums.length).toFixed(1);
          summaryStr = `평균: ${avg}점 (${nums.length}명 응답)`;
        }
      } else {
        // short_text / long_text — first 3 samples
        const samples = answers
          .map((a) => String(a ?? "").trim())
          .filter(Boolean)
          .slice(0, 3)
          .map((s) => `"${s.slice(0, 80)}"`)
          .join(", ");
        summaryStr = samples ? `응답 샘플: ${samples}` : "응답 없음";
      }

      return `${idx + 1}. (${q.type}) ${q.title}${optionsStr ? "\n   " + optionsStr : ""}\n   ${summaryStr}`;
    })
    .join("\n\n");
}

// POST /api/surveys/[id]/follow-up
//
// 완료된 설문의 질문+응답 데이터를 Gemini로 분석해 후속 설문 초안을 생성한다.
// Pro/Max 전용. 50 AI 크레딧 소모. 크레딧은 성공 시에만 차감.
//
// Auth:    required
// Plan:    pro | max (free → 403)
// Credits: 50 (부족 → 402)
// Survey:  closed | archived 상태, 본인 소유 (아니면 404)
//
// Response 201: { surveyId: string }
export async function POST(_req: NextRequest, { params }: RouteParams) {
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
    return NextResponse.json({ error: "follow_up_pro_only" }, { status: 403 });
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
  if (currentBalance < FOLLOW_UP_CREDIT_COST) {
    return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
  }

  // ── 4. Fetch original survey (creator-owned, closed/archived) ──────────────
  const { data: originalSurvey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, title, description, purpose")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .in("status", ["closed", "archived"])
    .maybeSingle();

  if (surveyError || !originalSurvey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  // ── 5. Fetch questions ─────────────────────────────────────────────────────
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("id, title, type, options")
    .eq("survey_id", surveyId)
    .order("order_index", { ascending: true });

  if (qError || !questions || questions.length === 0) {
    return NextResponse.json({ error: "no_questions_found" }, { status: 422 });
  }

  // ── 6. Fetch aggregated answers (max 200 responses) ────────────────────────
  const questionIds = questions.map((q) => q.id);
  const { data: answerRows } = await supabase
    .from("answers")
    .select("question_id, value, responses!inner(survey_id)")
    .in("question_id", questionIds)
    .eq("responses.survey_id", surveyId)
    .limit(200);

  const typedAnswerRows = (answerRows ?? []).map((r) => ({
    question_id: r.question_id,
    value: r.value,
  }));

  // ── 7. Build Gemini prompt ─────────────────────────────────────────────────
  const answerSummary = buildAnswerSummaries(
    questions.map((q) => ({
      id: q.id,
      title: q.title ?? "",
      type: q.type ?? "short_text",
      options: q.options,
    })),
    typedAnswerRows
  );

  const prompt = `당신은 설문 설계 전문가입니다. 아래 완료된 설문의 응답 데이터를 분석해 후속 조사가 필요한 영역에 대한 새 설문을 JSON 형식으로 생성해 주세요.

[원본 설문]
제목: ${originalSurvey.title}
${originalSurvey.description ? `설명: ${originalSurvey.description}` : ""}

[질문별 응답 현황]
${answerSummary}

[규칙]
- 원본 설문의 응답 패턴에서 추가로 탐색할 가치가 있는 영역을 찾아 3~7개 질문을 만드세요
- 사용 가능한 질문 타입: multiple_choice, checkbox, short_text, long_text, scale, dropdown
- multiple_choice, checkbox, dropdown 타입은 반드시 options 배열을 포함하세요
- scale 타입은 options 불필요
- 질문 제목은 한국어로 작성하세요
- JSON만 출력하세요 (코드블록, 설명 텍스트 없음)

[출력 형식]
{
  "title": "후속 설문 제목",
  "description": "이 설문의 목적을 한 문장으로",
  "questions": [
    {
      "type": "multiple_choice",
      "title": "질문 내용",
      "options": ["선택지1", "선택지2", "선택지3"],
      "required": true
    }
  ]
}`;

  // ── 8. Call Gemini ─────────────────────────────────────────────────────────
  let geminiOutput: GeminiOutput;
  try {
    const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Strip markdown code fences if present
    const cleaned = raw
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
    geminiOutput = JSON.parse(cleaned) as GeminiOutput;

    if (
      !geminiOutput.title ||
      !Array.isArray(geminiOutput.questions) ||
      geminiOutput.questions.length === 0
    ) {
      throw new Error("invalid_structure");
    }
  } catch (err) {
    console.error("[follow-up] Gemini generation failed", err);
    return NextResponse.json({ error: "ai_generation_failed" }, { status: 500 });
  }

  // ── 9. Create new survey draft ─────────────────────────────────────────────
  const { data: newSurvey, error: createError } = await supabase
    .from("surveys")
    .insert({
      creator_id: user.id,
      title: geminiOutput.title,
      description: geminiOutput.description ?? null,
      purpose: originalSurvey.purpose ?? null,
      status: "draft",
    })
    .select("id")
    .single();

  if (createError || !newSurvey) {
    console.error("[follow-up] survey create failed", createError);
    return NextResponse.json({ error: "survey_create_failed" }, { status: 500 });
  }

  // ── 10. Create default section ─────────────────────────────────────────────
  const { data: newSection, error: sectionError } = await supabase
    .from("sections")
    .insert({ survey_id: newSurvey.id, title: "", order_index: 0 })
    .select("id")
    .single();

  if (sectionError || !newSection) {
    console.error("[follow-up] section create failed", sectionError);
    // Survey created but unusable — best effort cleanup
    await supabase.from("surveys").delete().eq("id", newSurvey.id);
    return NextResponse.json({ error: "survey_create_failed" }, { status: 500 });
  }

  // ── 11. Batch-insert generated questions ───────────────────────────────────
  const questionsToInsert = geminiOutput.questions
    .filter((q) => VALID_QUESTION_TYPES.includes(q.type))
    .slice(0, 10) // cap at 10 questions
    .map((q, idx) => ({
      survey_id: newSurvey.id,
      section_id: newSection.id,
      type: q.type,
      title: q.title ?? "",
      options: Array.isArray(q.options) && q.options.length > 0 ? q.options : null,
      order_index: idx,
      required: q.required === true,
      config: null,
    }));

  if (questionsToInsert.length > 0) {
    const { error: qInsertError } = await supabase.from("questions").insert(questionsToInsert);

    if (qInsertError) {
      console.error("[follow-up] question insert failed", qInsertError);
      // Survey and section created — still usable, return surveyId
    }
  }

  // ── 12. Deduct 50 credits (success path only) ──────────────────────────────
  const admin = createAdminClient();
  const newBalance = currentBalance - FOLLOW_UP_CREDIT_COST;
  const now = new Date().toISOString();

  await Promise.all([
    admin
      .from("ai_credits")
      .upsert(
        { user_id: user.id, balance: newBalance, updated_at: now },
        { onConflict: "user_id" }
      ),
    admin.from("ai_credit_transactions").insert({
      user_id: user.id,
      amount: -FOLLOW_UP_CREDIT_COST,
      type: "usage",
      source: "survey_generation",
      created_at: now,
    }),
  ]);

  return NextResponse.json({ surveyId: newSurvey.id }, { status: 201 });
}
