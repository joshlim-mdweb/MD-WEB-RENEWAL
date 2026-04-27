import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string; sid: string }> };

// PATCH /api/surveys/[id]/sections/[sid] — update a section (title)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId, sid: sectionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: survey } = await supabase
    .from("surveys")
    .select("id")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .single();
  if (!survey) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};
  if ("title" in body) updates.title = body.title;
  if ("description" in body) updates.description = body.description;
  if ("color" in body) updates.color = body.color;
  if ("border_color" in body) updates.border_color = body.border_color;

  const { data: section, error } = await supabase
    .from("sections")
    .update(updates)
    .eq("id", sectionId)
    .eq("survey_id", surveyId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(section);
}

// DELETE /api/surveys/[id]/sections/[sid] — delete a section and its questions
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId, sid: sectionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: survey } = await supabase
    .from("surveys")
    .select("id, creator_id")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .single();
  if (!survey) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Block delete if responses exist — deleting sections would corrupt response data
  const { count: responseCount } = await supabase
    .from("responses")
    .select("id", { count: "exact", head: true })
    .eq("survey_id", surveyId);

  if ((responseCount ?? 0) > 0) {
    return NextResponse.json(
      { error: "Cannot delete sections after responses have been collected" },
      { status: 403 }
    );
  }

  // Delete child questions scoped to both section AND survey — prevents cross-survey deletion
  await supabase.from("questions").delete().eq("section_id", sectionId).eq("survey_id", surveyId);

  const { error } = await supabase
    .from("sections")
    .delete()
    .eq("id", sectionId)
    .eq("survey_id", surveyId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
