import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// Shape of each answer in the request body
interface AnswerInput {
  question_id: string;
  value: string | string[] | number;
}

// Shape of the POST body
interface RespondBody {
  shareToken?: string;
  answers: AnswerInput[];
  started_at?: string;
}

// GET /api/surveys/[id]/respond
// Check whether the current authenticated user has already responded.
// Anonymous users always get hasResponded: false (they have no persistent identity).
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Anonymous callers have no session — they cannot have "already responded"
    // in a trackable way at this point.
    return NextResponse.json({ hasResponded: false });
  }

  const { data, error } = await supabase
    .from("responses")
    .select("id")
    .eq("survey_id", id)
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[respond:GET] responses lookup failed", error);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({ hasResponded: data !== null });
}

// POST /api/surveys/[id]/respond
// Submit a response + batch of answers for a published survey.
//
// Auth model:
//   authenticated user  — user_id is set, share_id is optional
//   anonymous user      — user_id is null, shareToken is REQUIRED
//
// Cost notes:
//   1 SELECT on surveys (status check)
//   1 SELECT on responses (duplicate check, auth only) — only when authenticated
//   1 SELECT on survey_shares (token validation) — only when shareToken is provided
//   1 SELECT on questions (required-field validation)
//   1 INSERT into responses
//   1 batch INSERT into answers (single round-trip regardless of answer count)
//   Total: 4–5 reads + 2 writes per submission. Acceptable for a form submit.
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  // ── 1. Parse and validate request body ──────────────────────────────────────
  let body: RespondBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_BODY" }, { status: 400 });
  }

  if (!Array.isArray(body.answers)) {
    return NextResponse.json(
      { error: "answers must be an array", code: "INVALID_BODY" },
      { status: 400 }
    );
  }

  // ── 2. Resolve caller identity ───────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAnonymous = user === null;

  // Unauthenticated users cannot submit responses — redirect them to login.
  if (isAnonymous) {
    return NextResponse.json(
      { success: false, error: "로그인이 필요해요.", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  // ── 3. Verify survey exists and is published ─────────────────────────────────
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, status, max_responses")
    .eq("id", surveyId)
    .single();

  if (surveyError || !survey) {
    return NextResponse.json(
      { success: false, error: "Survey not found", code: "SURVEY_NOT_FOUND" },
      { status: 404 }
    );
  }

  if (survey.status !== "published") {
    return NextResponse.json(
      {
        success: false,
        error: "Survey is not accepting responses",
        code: "SURVEY_NOT_PUBLISHED",
      },
      { status: 403 }
    );
  }

  // ── 4. Duplicate-participation guard (authenticated users only) ───────────────
  // Only completed rows block re-submission. in_progress rows are handled in
  // step 8 — they represent an active session started via the session API.
  if (!isAnonymous) {
    // The responses table has no `status` column. Completion is inferred by
    // checking whether any answer rows exist for this response.
    const { data: existing } = await supabase
      .from("responses")
      .select("id")
      .eq("survey_id", surveyId)
      .eq("user_id", user!.id)
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { count: answerCount } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("response_id", existing.id);

      if ((answerCount ?? 0) > 0) {
        return NextResponse.json({ success: false, reason: "already_responded" }, { status: 409 });
      }
    }
  }

  // ── 4b. Survey access fee — first 5/day free, then 500P per additional ───────
  // Policy: first 5 survey responses per day are free.
  // From the 6th onwards, 500P is deducted atomically via RPC.
  // The RPC raises INSUFFICIENT_POINTS if balance is too low.
  if (!isAnonymous) {
    const { error: rpcError } = await supabase.rpc("spend_survey_access_points", {
      p_user_id: user!.id,
      p_survey_id: surveyId,
    });

    if (rpcError) {
      if (rpcError.message.includes("INSUFFICIENT_POINTS")) {
        return NextResponse.json(
          {
            error: "포인트가 부족해요. 폴에 참여해서 포인트를 모아보세요.",
            code: "INSUFFICIENT_POINTS",
          },
          { status: 402 }
        );
      }
      console.error("[respond:POST] spend_survey_access_points rpc failed", rpcError);
      return NextResponse.json(
        { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
        { status: 500 }
      );
    }
  }

  // ── 5. Validate share token (when provided) ───────────────────────────────────
  let shareId: string | null = null;

  if (body.shareToken) {
    const { data: share, error: shareError } = await supabase
      .from("survey_shares")
      .select("id, survey_id, expires_at, max_responses, response_count")
      .eq("token", body.shareToken)
      .maybeSingle();

    if (shareError || !share) {
      return NextResponse.json({ success: false, reason: "invalid_share_token" }, { status: 403 });
    }

    // Token must belong to this survey
    if (share.survey_id !== surveyId) {
      return NextResponse.json({ success: false, reason: "invalid_share_token" }, { status: 403 });
    }

    // Check expiry — null means no expiry
    if (share.expires_at !== null && new Date(share.expires_at) <= new Date()) {
      return NextResponse.json({ success: false, reason: "invalid_share_token" }, { status: 403 });
    }

    // Check response cap — null means unlimited
    if (share.max_responses !== null && share.response_count >= share.max_responses) {
      return NextResponse.json({ success: false, reason: "invalid_share_token" }, { status: 403 });
    }

    shareId = share.id;
  }

  // ── 6. Fetch ALL questions for validation ────────────────────────────────────
  // We need all questions (not just required) to:
  //   a) build a validQuestionIds Set to reject answers for phantom question IDs
  //   b) check required-field presence for submitted answers
  // Fetching all avoids a second query and prevents orphaned-answer injection.
  const { data: allQuestions, error: qError } = await supabase
    .from("questions")
    .select("id, required, type, options, config")
    .eq("survey_id", surveyId);

  if (qError) {
    console.error("[respond:POST] questions fetch failed", qError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  // Set of question IDs that legitimately belong to this survey.
  const validQuestionIds = new Set((allQuestions ?? []).map((q) => q.id));

  // Build a set of answered question ids for O(1) lookup
  const answeredQuestionIds = new Set(body.answers.map((a: AnswerInput) => a.question_id));

  // Reject any submitted answer whose question_id is not in the survey.
  // This prevents answer-stuffing against questions from other surveys.
  for (const answer of body.answers) {
    if (!validQuestionIds.has(answer.question_id)) {
      return NextResponse.json(
        { error: "Invalid question ID in submission", code: "INVALID_QUESTION_ID" },
        { status: 422 }
      );
    }
  }

  // Enforce per-answer size limits to cap payload abuse.
  for (const answer of body.answers) {
    const { value } = answer;
    if (typeof value === "string" && value.length > 5000) {
      return NextResponse.json(
        { error: "Answer text exceeds maximum length", code: "ANSWER_TOO_LONG" },
        { status: 422 }
      );
    }
    if (Array.isArray(value) && value.length > 20) {
      return NextResponse.json(
        { error: "Too many options selected", code: "ANSWER_TOO_LONG" },
        { status: 422 }
      );
    }
  }

  // All required questions must have a corresponding answer with a non-empty value.
  const requiredQuestions = (allQuestions ?? []).filter((q) => q.required);

  const missingRequired = requiredQuestions.filter((q) => {
    if (!answeredQuestionIds.has(q.id)) return true;
    const answer = body.answers.find((a: AnswerInput) => a.question_id === q.id);
    if (!answer) return true;
    const { value } = answer;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "string") return value.trim().length === 0;
    // number — 0 is a valid answer (e.g. scale starting at 0)
    return false;
  });

  if (missingRequired.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Required questions are unanswered",
        code: "MISSING_REQUIRED_ANSWERS",
        missingQuestionIds: missingRequired.map((q) => q.id),
      },
      { status: 422 }
    );
  }

  // ── 7. Capture abuse-prevention metadata ─────────────────────────────────────
  // Store IP and UA for abuse review (per policy/abuse.md §11.3).
  // These are never surfaced publicly — only accessible by service role.
  const forwardedFor = req.headers.get("x-forwarded-for");
  const respondentIp = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : (req.headers.get("x-real-ip") ?? null);
  const respondentUa = req.headers.get("user-agent") ?? null;

  // ── 8. Persist response row ───────────────────────────────────────────────────
  // Primary path: UPDATE the in_progress row created by the session API.
  // Fallback path: INSERT directly (session expired or old client without session API).

  // Validate started_at — accept only ISO strings, ignore anything malformed
  let startedAt: string | null = null;
  if (typeof body.started_at === "string") {
    const parsed = new Date(body.started_at);
    if (!isNaN(parsed.getTime())) {
      startedAt = parsed.toISOString();
    }
  }

  let responseId: string;

  if (!isAnonymous) {
    // Look for an active in_progress session reserved via the session API
    const { data: inProgressRow } = await supabase
      .from("responses")
      .select("id")
      .eq("survey_id", surveyId)
      .eq("user_id", user!.id)
      .eq("status", "in_progress")
      .limit(1)
      .maybeSingle();

    if (inProgressRow) {
      // Session found — mark as completed and attach submission metadata
      const { data: updatedRow, error: updateError } = await supabase
        .from("responses")
        .update({
          status: "completed",
          respondent_ip: respondentIp,
          respondent_ua: respondentUa,
          share_id: shareId,
        })
        .eq("id", inProgressRow.id)
        .select("id")
        .single();

      if (updateError || !updatedRow) {
        console.error("[respond:POST] session update to completed failed", updateError);
        return NextResponse.json(
          { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
          { status: 500 }
        );
      }

      responseId = updatedRow.id;
    } else {
      // Fallback: no session row — INSERT directly (session expired or old client)
      const { data: responseRow, error: insertResponseError } = await supabase
        .from("responses")
        .insert({
          survey_id: surveyId,
          user_id: user!.id,
          share_id: shareId,
          respondent_ip: respondentIp,
          respondent_ua: respondentUa,
          started_at: startedAt,
          status: "completed",
        })
        .select("id")
        .single();

      if (insertResponseError || !responseRow) {
        if (insertResponseError?.code === "23505") {
          return NextResponse.json(
            { success: false, reason: "already_responded" },
            { status: 409 }
          );
        }
        if (
          insertResponseError?.code === "P0001" &&
          insertResponseError?.message === "SURVEY_FULL"
        ) {
          return NextResponse.json(
            { success: false, error: "Survey is at capacity", code: "SURVEY_FULL" },
            { status: 403 }
          );
        }
        console.error("[respond:POST] response insert failed", insertResponseError);
        return NextResponse.json(
          { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
          { status: 500 }
        );
      }

      responseId = responseRow.id;
    }
  } else {
    // Anonymous user (share link) — always INSERT
    const { data: responseRow, error: insertResponseError } = await supabase
      .from("responses")
      .insert({
        survey_id: surveyId,
        user_id: null,
        share_id: shareId,
        respondent_ip: respondentIp,
        respondent_ua: respondentUa,
        started_at: startedAt,
        status: "completed",
      })
      .select("id")
      .single();

    if (insertResponseError || !responseRow) {
      if (insertResponseError?.code === "P0001" && insertResponseError?.message === "SURVEY_FULL") {
        return NextResponse.json(
          { success: false, error: "Survey is at capacity", code: "SURVEY_FULL" },
          { status: 403 }
        );
      }
      console.error("[respond:POST] anonymous response insert failed", insertResponseError);
      return NextResponse.json(
        { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    responseId = responseRow.id;
  }

  // ── 9. Batch insert all answers ───────────────────────────────────────────────
  // Single INSERT round-trip regardless of answer count.
  // Cost: 1 write, N rows — far cheaper than N individual inserts.
  const answerRows = body.answers.map((a: AnswerInput) => ({
    response_id: responseId,
    question_id: a.question_id,
    value: a.value as string | number | boolean | null,
  }));

  const { error: insertAnswersError } = await supabase.from("answers").insert(answerRows);

  if (insertAnswersError) {
    // Answers failed to insert after the response row was already committed.
    // This is a partial failure — the response row exists but is answer-less.
    // Log and return 500; a retry from the client will hit the duplicate guard.
    // In production, a DB transaction would be ideal — Supabase does not expose
    // client-side transactions, so we accept this rare partial-write edge case.
    return NextResponse.json(
      {
        error: "Failed to save answers",
        code: "ANSWERS_INSERT_FAILED",
      },
      { status: 500 }
    );
  }

  // Points are NOT awarded at respond time.
  // Policy (survey.md): rewards are settled in batch when the survey is closed.
  //   - reward_type='first_come': all respondents receive reward_amount at close
  //   - reward_type='random': reward_winner_count winners are drawn at close
  // See POST /api/surveys/[id]/close for the settlement logic.

  return NextResponse.json({ success: true, responseId }, { status: 201 });
}
