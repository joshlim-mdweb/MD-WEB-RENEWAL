import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/surveys/[id]/share — list all share links for a survey.
//
// Only the survey owner can view share links.
//
// Cost: 1 auth + 1 survey ownership check + 1 share links read = 3 reads.
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Verify ownership before returning share links.
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, creator_id")
    .eq("id", surveyId)
    .single();

  if (surveyError || !survey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  if (survey.creator_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data: shares, error: sharesError } = await supabase
    .from("survey_shares")
    .select("id, token, expires_at, max_responses, response_count, created_at")
    .eq("survey_id", surveyId)
    .order("created_at", { ascending: false });

  if (sharesError) {
    console.error("[share GET] survey_shares read failed", sharesError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json({ shares: shares ?? [] });
}

// POST /api/surveys/[id]/share — create a new share link for a survey.
//
// Body (all optional):
//   expires_at     — ISO date string; null means no expiry
//   max_responses  — positive integer; null means unlimited
//
// Token is the first 8 characters of a UUID (collision chance acceptable for MVP).
// Only the survey owner can create share links.
//
// Cost: 1 auth + 1 survey ownership check + 1 insert = 3 ops.
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Verify ownership.
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, creator_id")
    .eq("id", surveyId)
    .single();

  if (surveyError || !survey) {
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  if (survey.creator_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: { expires_at?: string | null; max_responses?: number | null } = {};
  try {
    body = await req.json();
  } catch {
    // Body is optional — empty body is valid (creates link with no expiry/cap).
    body = {};
  }

  // Validate expires_at if provided.
  let expiresAt: string | null = null;
  if (body.expires_at !== undefined && body.expires_at !== null) {
    const parsed = new Date(body.expires_at);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json(
        { error: "invalid_expires_at", message: "expires_at는 유효한 날짜 형식이어야 해요." },
        { status: 400 }
      );
    }
    if (parsed <= new Date()) {
      return NextResponse.json(
        { error: "expires_at_in_past", message: "만료일은 현재보다 미래여야 해요." },
        { status: 400 }
      );
    }
    expiresAt = parsed.toISOString();
  }

  // Validate max_responses if provided.
  let maxResponses: number | null = null;
  if (body.max_responses !== undefined && body.max_responses !== null) {
    if (
      typeof body.max_responses !== "number" ||
      !Number.isInteger(body.max_responses) ||
      body.max_responses < 1
    ) {
      return NextResponse.json(
        {
          error: "invalid_max_responses",
          message: "max_responses는 1 이상의 정수여야 해요.",
        },
        { status: 400 }
      );
    }
    maxResponses = body.max_responses;
  }

  // Generate an 8-character token from a UUID.
  const token = crypto.randomUUID().replace(/-/g, "").slice(0, 8);

  const { data: share, error: insertError } = await supabase
    .from("survey_shares")
    .insert({
      survey_id: surveyId,
      token,
      expires_at: expiresAt,
      max_responses: maxResponses,
      response_count: 0,
      created_by: user.id,
    })
    .select("id, token, expires_at, max_responses, response_count, created_at")
    .single();

  if (insertError || !share) {
    // 23505 = unique violation on token — extremely rare but handle gracefully.
    if (insertError?.code === "23505") {
      return NextResponse.json(
        {
          error: "token_collision",
          message: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.",
        },
        { status: 409 }
      );
    }
    console.error("[share POST] insert failed", insertError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json(share, { status: 201 });
}
