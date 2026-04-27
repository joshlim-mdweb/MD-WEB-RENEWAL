import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ token: string }> };

// GET /api/share/[token] — public endpoint to fetch survey info via share token.
//
// No authentication required — share links are publicly accessible.
//
// Guards (in order):
//   1. Token must exist in survey_shares
//   2. Link must not be expired (expires_at null = no expiry)
//   3. Response count must not exceed max_responses (null = unlimited)
//
// Returns survey title + questions + sections for rendering the respond form.
//
// Cost: 1 share lookup + 1 survey + questions + sections join = 2 reads.
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { token } = await params;
  const supabase = await createClient();

  // Lookup the share record.
  const { data: share, error: shareError } = await supabase
    .from("survey_shares")
    .select("id, survey_id, expires_at, max_responses, response_count")
    .eq("token", token)
    .maybeSingle();

  if (shareError) {
    console.error("[share token GET] share lookup failed", shareError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  if (!share) {
    return NextResponse.json({ error: "share_not_found" }, { status: 404 });
  }

  // Expiry check.
  if (share.expires_at !== null && new Date(share.expires_at) <= new Date()) {
    return NextResponse.json({ error: "share_expired" }, { status: 409 });
  }

  // Capacity check.
  if (share.max_responses !== null && share.response_count >= share.max_responses) {
    return NextResponse.json({ error: "share_limit_reached" }, { status: 409 });
  }

  // Fetch survey with questions and sections in a single joined read.
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select(
      `
      id,
      title,
      description,
      status,
      questions (
        id,
        type,
        title,
        options,
        order_index,
        required,
        config,
        section_id
      ),
      sections (
        id,
        title,
        description,
        order_index
      )
    `
    )
    .eq("id", share.survey_id)
    .single();

  if (surveyError || !survey) {
    console.error("[share token GET] survey fetch failed", surveyError);
    return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
  }

  return NextResponse.json({
    share_id: share.id,
    token,
    expires_at: share.expires_at,
    max_responses: share.max_responses,
    response_count: share.response_count,
    survey: {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      questions: survey.questions,
      sections: survey.sections,
    },
  });
}
