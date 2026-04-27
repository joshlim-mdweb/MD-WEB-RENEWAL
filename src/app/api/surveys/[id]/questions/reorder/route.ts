import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/surveys/[id]/questions/reorder
// Body: { orderedIds: string[] } — full ordered list of question IDs
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify survey ownership
  const { data: survey } = await supabase
    .from("surveys")
    .select("id")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .single();

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  const body = await req.json();
  const orderedIds: string[] = body.orderedIds;

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: "orderedIds must be a non-empty array" }, { status: 400 });
  }

  // Batch update all order_indexes in one go
  const updates = orderedIds.map((questionId, index) =>
    supabase
      .from("questions")
      .update({ order_index: index })
      .eq("id", questionId)
      .eq("survey_id", surveyId)
  );

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}
