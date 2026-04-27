import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string; aid: string }> };

// GET /api/surveys/[id]/analysis/[aid]
//
// Auth: creator-only.
// Returns a single analysis record. Returns 404 if the analysis doesn't exist
// or belongs to a different creator/survey — both collapse to 404 to avoid
// leaking existence information.
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId, aid: analysisId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // The RLS policy already enforces creator_id = auth.uid(), so the
  // creator_id filter here is redundant but makes the auth intent explicit.
  const { data: analysis, error } = await supabase
    .from("survey_analyses")
    .select("id, prompt, sentence, data_point, status, created_at")
    .eq("id", analysisId)
    .eq("survey_id", surveyId)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "analysis_fetch_failed" }, { status: 500 });
  }

  if (!analysis) {
    return NextResponse.json({ error: "analysis_not_found" }, { status: 404 });
  }

  return NextResponse.json(analysis);
}
