import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/surveys/[id]/sections/reorder — batch-update section order_index values
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
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

  const body = await req.json();
  const { orderedIds } = body as { orderedIds: string[] };

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: "orderedIds is required" }, { status: 400 });
  }

  await Promise.all(
    orderedIds.map((sectionId, index) =>
      supabase
        .from("sections")
        .update({ order_index: index })
        .eq("id", sectionId)
        .eq("survey_id", surveyId)
    )
  );

  const { data: sections } = await supabase
    .from("sections")
    .select("id, survey_id, title, order_index, created_at, updated_at")
    .eq("survey_id", surveyId)
    .order("order_index", { ascending: true });

  return NextResponse.json({ sections: sections ?? [] });
}
