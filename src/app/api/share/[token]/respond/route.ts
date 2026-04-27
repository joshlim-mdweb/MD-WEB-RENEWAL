import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ token: string }> };

interface AnswerInput {
  question_id: string;
  value: string | string[] | number;
}

interface ShareRespondBody {
  answers: AnswerInput[];
  started_at?: string;
}

// POST /api/share/[token]/respond — anonymous response submission via share link.
//
// No authentication required. Identity is tracked via respondent_ip + respondent_ua only.
// share_id is recorded on the response row and survey_shares.response_count is incremented.
//
// Logic mirrors /api/surveys/[id]/respond POST but:
//   - user_id is always null
//   - No duplicate-participation guard (anonymous users have no persistent identity)
//   - share token must be valid, unexpired, and under capacity
//
// Cost: 1 share lookup + 1 survey status check + 1 questions fetch +
//       1 response insert + 1 batch answers insert + 1 response_count increment = 6 ops.
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { token } = await params;
  const supabase = await createClient();

  // Parse body first to fail fast on malformed requests.
  let body: ShareRespondBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!Array.isArray(body.answers)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Validate share token.
  const { data: share, error: shareError } = await supabase
    .from("survey_shares")
    .select("id, survey_id, expires_at, max_responses, response_count")
    .eq("token", token)
    .maybeSingle();

  if (shareError) {
    console.error("[share respond POST] share lookup failed", shareError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  if (!share) {
    return NextResponse.json({ error: "share_not_found" }, { status: 404 });
  }

  if (share.expires_at !== null && new Date(share.expires_at) <= new Date()) {
    return NextResponse.json({ error: "share_expired" }, { status: 409 });
  }

  if (share.max_responses !== null && share.response_count >= share.max_responses) {
    return NextResponse.json({ error: "share_limit_reached" }, { status: 409 });
  }

  // Verify survey is published.
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, status, max_participants")
    .eq("id", share.survey_id)
    .single();

  if (surveyError || !survey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  if (survey.status !== "published") {
    return NextResponse.json({ error: "survey_not_published" }, { status: 403 });
  }

  // Capacity check against max_participants.
  if (survey.max_participants !== null) {
    const { count: responseCount } = await supabase
      .from("responses")
      .select("id", { count: "exact", head: true })
      .eq("survey_id", survey.id);

    if (responseCount !== null && responseCount >= survey.max_participants) {
      return NextResponse.json({ error: "survey_full" }, { status: 403 });
    }
  }

  // Fetch all questions for validation.
  const { data: allQuestions, error: qError } = await supabase
    .from("questions")
    .select("id, required, type, options, config")
    .eq("survey_id", survey.id);

  if (qError) {
    console.error("[share respond POST] questions fetch failed", qError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  const validQuestionIds = new Set((allQuestions ?? []).map((q) => q.id));
  const answeredQuestionIds = new Set(body.answers.map((a) => a.question_id));

  // Reject answers for questions not belonging to this survey.
  for (const answer of body.answers) {
    if (!validQuestionIds.has(answer.question_id)) {
      return NextResponse.json({ error: "invalid_question_id" }, { status: 422 });
    }
  }

  // Enforce per-answer size limits.
  for (const answer of body.answers) {
    const { value } = answer;
    if (typeof value === "string" && value.length > 5000) {
      return NextResponse.json({ error: "answer_too_long" }, { status: 422 });
    }
    if (Array.isArray(value) && value.length > 20) {
      return NextResponse.json({ error: "answer_too_long" }, { status: 422 });
    }
  }

  // Required-field check.
  const requiredQuestions = (allQuestions ?? []).filter((q) => q.required);
  const missingRequired = requiredQuestions.filter((q) => {
    if (!answeredQuestionIds.has(q.id)) return true;
    const answer = body.answers.find((a) => a.question_id === q.id);
    if (!answer) return true;
    const { value } = answer;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "string") return value.trim().length === 0;
    return false;
  });

  if (missingRequired.length > 0) {
    return NextResponse.json(
      {
        error: "missing_required_answers",
        missingQuestionIds: missingRequired.map((q) => q.id),
      },
      { status: 422 }
    );
  }

  // Capture IP and UA for abuse review (abuse.md §11.3).
  const forwardedFor = req.headers.get("x-forwarded-for");
  const respondentIp = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : (req.headers.get("x-real-ip") ?? null);
  const respondentUa = req.headers.get("user-agent") ?? null;

  // Validate started_at.
  let startedAt: string | null = null;
  if (typeof body.started_at === "string") {
    const parsed = new Date(body.started_at);
    if (!isNaN(parsed.getTime())) {
      startedAt = parsed.toISOString();
    }
  }

  // Insert the response row (user_id is null for anonymous submissions).
  const { data: responseRow, error: insertResponseError } = await supabase
    .from("responses")
    .insert({
      survey_id: survey.id,
      user_id: null,
      share_id: share.id,
      respondent_ip: respondentIp,
      respondent_ua: respondentUa,
      started_at: startedAt,
    })
    .select("id")
    .single();

  if (insertResponseError || !responseRow) {
    if (insertResponseError?.code === "P0001" && insertResponseError?.message === "SURVEY_FULL") {
      return NextResponse.json({ error: "survey_full" }, { status: 403 });
    }
    console.error("[share respond POST] response insert failed", insertResponseError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  // Batch insert all answers in a single write.
  const answerRows = body.answers.map((a) => ({
    response_id: responseRow.id,
    question_id: a.question_id,
    value: a.value as string | number | boolean | null,
  }));

  const { error: insertAnswersError } = await supabase.from("answers").insert(answerRows);

  if (insertAnswersError) {
    console.error("[share respond POST] answers insert failed", insertAnswersError);
    return NextResponse.json({ error: "answers_insert_failed" }, { status: 500 });
  }

  // Increment response_count on the share link.
  // Non-fatal: if this fails the response is still recorded. Ops can reconcile.
  const { error: countUpdateError } = await supabase
    .from("survey_shares")
    .update({ response_count: share.response_count + 1 })
    .eq("id", share.id);

  if (countUpdateError) {
    console.error(
      "[share respond POST] response_count increment failed for share",
      share.id,
      countUpdateError
    );
  }

  return NextResponse.json({ success: true, responseId: responseRow.id }, { status: 201 });
}
