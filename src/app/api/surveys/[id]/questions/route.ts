import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { QuestionType } from "@/lib/types/survey";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/surveys/[id]/questions — add a new question to the survey
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: surveyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify survey ownership before adding a question
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id")
    .eq("id", surveyId)
    .eq("creator_id", user.id)
    .single();

  if (surveyError || !survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  const body = await req.json();
  const questionType: QuestionType = body.type ?? "multiple_choice";
  const sectionId: string | null = body.section_id ?? null;

  const insertAfterId: string | null = body.insert_after_id ?? null;
  let nextOrderIndex: number;

  if (insertAfterId) {
    // "바로 다음에" 모드: pivot 이후 질문들 order_index +1 shift
    const { data: pivotQ } = await supabase
      .from("questions")
      .select("order_index")
      .eq("id", insertAfterId)
      .eq("survey_id", surveyId)
      .single();

    if (!pivotQ) {
      return NextResponse.json({ error: "insert_after_id not found" }, { status: 422 });
    }

    const pivotOrder = pivotQ.order_index;

    // pivot 이후 질문들 가져와서 order_index +1 (내림차순으로 충돌 방지)
    const { data: toShift } = await supabase
      .from("questions")
      .select("id, order_index")
      .eq("survey_id", surveyId)
      .gt("order_index", pivotOrder)
      .order("order_index", { ascending: false });

    if (toShift && toShift.length > 0) {
      for (const q of toShift) {
        await supabase
          .from("questions")
          .update({ order_index: q.order_index + 1 })
          .eq("id", q.id);
      }
    }

    nextOrderIndex = pivotOrder + 1;
  } else {
    // "맨 끝에" 모드: 기존 동작 유지
    const { data: lastQuestion } = await supabase
      .from("questions")
      .select("order_index")
      .eq("survey_id", surveyId)
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    nextOrderIndex = lastQuestion ? lastQuestion.order_index + 1 : 0;
  }
  if (!sectionId) {
    return NextResponse.json({ error: "section_id is required" }, { status: 400 });
  }

  const { data: question, error } = await supabase
    .from("questions")
    .insert({
      survey_id: surveyId,
      type: questionType,
      title: body.title ?? "",
      options: body.options ?? null,
      order_index: nextOrderIndex,
      required: body.required ?? false,
      config: body.config ?? null,
      section_id: sectionId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(question, { status: 201 });
}
