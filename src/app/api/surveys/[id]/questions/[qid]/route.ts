import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string; qid: string }> };

// PATCH /api/surveys/[id]/questions/[qid] — update a question
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId, qid } = await params;
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
  const allowedFields = [
    "title",
    "type",
    "options",
    "required",
    "config",
    "order_index",
    "section_id",
    "next_target",
  ];

  // Validate next_target shape if present
  if (body.next_target !== undefined && body.next_target !== null) {
    const nt = body.next_target as Record<string, unknown>;
    if (!["question", "section", "end"].includes(nt.type as string)) {
      return NextResponse.json(
        { error: "next_target.type must be 'question', 'section', or 'end'" },
        { status: 400 }
      );
    }
  }
  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  const { data: question, error } = await supabase
    .from("questions")
    .update(updates)
    .eq("id", qid)
    .eq("survey_id", surveyId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(question);
}

// DELETE /api/surveys/[id]/questions/[qid] — delete a question
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId, qid } = await params;
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

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", qid)
    .eq("survey_id", surveyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
