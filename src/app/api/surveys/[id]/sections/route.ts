import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/surveys/[id]/sections — list all sections for a survey
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: sections, error } = await supabase
    .from("sections")
    .select("*")
    .eq("survey_id", surveyId)
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(sections ?? []);
}

// POST /api/surveys/[id]/sections — create a new section
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

  const body = await req.json().catch(() => ({}));

  let nextOrderIndex: number;

  if (body.after_section_id) {
    // Positional insert: find the anchor section's order_index, shift all siblings, insert after it
    const { data: anchorSection } = await supabase
      .from("sections")
      .select("order_index")
      .eq("id", body.after_section_id)
      .eq("survey_id", surveyId)
      .single();

    if (!anchorSection) {
      return NextResponse.json({ error: "after_section_id not found" }, { status: 400 });
    }

    nextOrderIndex = anchorSection.order_index + 1;

    // Shift all sections that come after the anchor.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.rpc as any)("increment_sections_order_index", {
      p_survey_id: surveyId,
      p_min_order_index: nextOrderIndex,
    });
  } else {
    // Append at the end
    const { data: lastSection } = await supabase
      .from("sections")
      .select("order_index")
      .eq("survey_id", surveyId)
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    nextOrderIndex = lastSection ? lastSection.order_index + 1 : 0;
  }

  const { data: section, error } = await supabase
    .from("sections")
    .insert({
      survey_id: surveyId,
      title: body.title ?? "",
      order_index: nextOrderIndex,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(section, { status: 201 });
}
