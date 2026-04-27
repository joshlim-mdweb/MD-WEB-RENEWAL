import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string; rid: string }> };

// PATCH /api/surveys/[id]/responses/[rid]/disqualify
//
// Creator-initiated disqualification of a single response's reward eligibility.
// Distinct from POST /api/admin/reward-eligibility/disqualify which is admin-only
// and accepts arbitrary reasons.
//
// This endpoint:
//   1. Verifies caller is the survey creator (not admin)
//   2. Verifies the response belongs to this survey
//   3. Sets reward_eligibility status = 'disqualified', reason = 'creator_flagged'
//
// The service-role client is required because reward_eligibility RLS only
// permits service role writes.
//
// No-op if no eligibility row exists (survey has no reward budget).
// Returns 409 if already disqualified or paid.
export async function PATCH(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId, rid: responseId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Confirm this response belongs to the caller's survey in one join query.
  const { data: responseRow, error: responseError } = await supabase
    .from("responses")
    .select("id, survey_id")
    .eq("id", responseId)
    .eq("survey_id", surveyId)
    .maybeSingle();

  if (responseError) {
    return NextResponse.json({ error: "response_fetch_failed" }, { status: 500 });
  }

  if (!responseRow) {
    return NextResponse.json({ error: "response_not_found" }, { status: 404 });
  }

  // Confirm caller owns the survey.
  const { data: surveyRow, error: surveyError } = await supabase
    .from("surveys")
    .select("id")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (surveyError) {
    return NextResponse.json({ error: "survey_fetch_failed" }, { status: 500 });
  }

  if (!surveyRow) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // reward_eligibility RLS blocks user-level writes — use service role.
  const admin = createAdminClient();

  const { data: existing, error: eligibilityError } = await admin
    .from("reward_eligibility")
    .select("id, status")
    .eq("response_id", responseId)
    .maybeSingle();

  if (eligibilityError) {
    return NextResponse.json({ error: "eligibility_fetch_failed" }, { status: 500 });
  }

  // No eligibility row — no reward budget was set, treat as no-op success.
  if (!existing) {
    return NextResponse.json({ success: true, responseId, status: "disqualified" });
  }

  // Guard against invalid transitions.
  if (existing.status === "disqualified" || existing.status === "paid") {
    return NextResponse.json(
      { error: "invalid_status_transition", current: existing.status },
      { status: 409 }
    );
  }

  const { error: updateError } = await admin
    .from("reward_eligibility")
    .update({ status: "disqualified", disqualify_reason: "creator_flagged" })
    .eq("id", existing.id);

  if (updateError) {
    console.error("[responses/[rid]/disqualify:PATCH] update failed", updateError);
    return NextResponse.json({ error: "disqualify_failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, responseId, status: "disqualified" });
}
