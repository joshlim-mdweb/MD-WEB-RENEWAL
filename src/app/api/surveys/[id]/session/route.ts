import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

// POST /api/surveys/[id]/session
// Reserve a slot by creating an in_progress response row.
// Called when the user clicks "시작하기" on the survey intro screen.
//
// responses.status: 'in_progress' | 'completed' (added in migration 20260418000002)
// DB trigger check_survey_capacity counts:
//   completed rows + in_progress rows within 30-min TTL
export async function POST(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  // ── 1. Auth ───────────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요해요.", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  // ── 2. Survey exists and is published ─────────────────────────────────────
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, status, max_responses")
    .eq("id", surveyId)
    .single();

  if (surveyError || !survey) {
    return NextResponse.json(
      { error: "설문을 찾을 수 없어요.", code: "SURVEY_NOT_FOUND" },
      { status: 404 }
    );
  }

  if (survey.status !== "published") {
    return NextResponse.json(
      { error: "참여할 수 없는 설문이에요.", code: "SURVEY_NOT_PUBLISHED" },
      { status: 403 }
    );
  }

  // ── 3. Check existing row ──────────────────────────────────────────────────
  // responses.status is either 'in_progress' or 'completed' (see migration 20260418000002)
  const { data: existing } = await supabase
    .from("responses")
    .select("id, status")
    .eq("survey_id", surveyId)
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existing) {
    if (existing.status === "completed") {
      return NextResponse.json(
        { error: "이미 참여한 설문이에요.", code: "ALREADY_RESPONDED" },
        { status: 409 }
      );
    }
    // In-progress: reset TTL
    await supabase
      .from("responses")
      .update({ started_at: new Date().toISOString() })
      .eq("id", existing.id);

    return NextResponse.json({
      session_id: existing.id,
      expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    });
  }

  // ── 4. Cleanup expired sessions, then INSERT in_progress row ─────────────
  await supabase.rpc("cleanup_expired_sessions");

  const { data: row, error: insertError } = await supabase
    .from("responses")
    .insert({
      survey_id: surveyId,
      user_id: user.id,
      status: "in_progress",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError) {
    if (insertError.code === "P0001" && insertError.message === "SURVEY_FULL") {
      return NextResponse.json(
        { error: "참여 인원이 모두 찼어요.", code: "SURVEY_FULL" },
        { status: 409 }
      );
    }
    if (insertError.code === "23505") {
      return NextResponse.json({
        session_id: null,
        expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
      });
    }
    console.error("[session:POST] insert failed", insertError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    session_id: row.id,
    expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });
}
