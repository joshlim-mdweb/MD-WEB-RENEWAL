import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/surveys/[id]/reopen
 *
 * Transitions a closed survey back to 'draft'.
 * Use this when you want to edit and re-publish a previously closed survey.
 * The survey must go through /publish again to become published.
 *
 * Cost: 1 read (status check) + 1 write (status update).
 *
 * Returns:
 *   200  — updated survey row (id, title, description, status, timestamps)
 *   400  — survey is not in 'closed' status
 *   401  — unauthenticated
 *   403  — authenticated but not the creator
 *   404  — survey not found
 */
export async function POST(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Lightweight read — only status + creator_id needed for the guard.
  const { data: survey, error: fetchError } = await supabase
    .from("surveys")
    .select("id, creator_id, status")
    .eq("id", id)
    .single();

  if (fetchError || !survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  if (survey.creator_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (survey.status !== "closed") {
    return NextResponse.json(
      {
        error: `Only closed surveys can be reopened. Current status: '${survey.status}'.`,
        code: "INVALID_TRANSITION",
      },
      { status: 400 }
    );
  }

  const { data: updatedSurvey, error: updateError } = await supabase
    .from("surveys")
    .update({ status: "draft", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("creator_id", user.id)
    .select("id, title, description, status, created_at, updated_at")
    .single();

  if (updateError || !updatedSurvey) {
    return NextResponse.json({ error: "Failed to reopen survey" }, { status: 500 });
  }

  return NextResponse.json(updatedSurvey);
}
