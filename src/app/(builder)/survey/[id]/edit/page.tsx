import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SurveyBuilder } from "@/components/builder/SurveyBuilder";
import { SurveyWithQuestions } from "@/lib/types/survey";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; new?: string }>;
};

export default async function SurveyEditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { from, new: isNew } = await searchParams;
  const fromAnalyze = from === "analyze";
  const isNewSurvey = isNew === "1";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch survey, sections, and response count in parallel.
  // The count drives the edit-lock guard in the builder (see survey policy §5.4).
  const [{ data: survey, error }, { data: sections }, { count: responseCount }] = await Promise.all(
    [
      supabase
        .from("surveys")
        .select(
          `
        id, title, description, status, created_at, updated_at,
        questions (
          id, survey_id, section_id, type, title, options, order_index, required, config, created_at
        )
      `
        )
        .eq("id", id)
        .eq("creator_id", user.id)
        .single(),
      supabase
        .from("sections")
        .select("id, survey_id, title, order_index, created_at, updated_at")
        .eq("survey_id", id)
        .order("order_index", { ascending: true }),
      supabase.from("responses").select("id", { count: "exact", head: true }).eq("survey_id", id),
    ]
  );

  if (error || !survey) {
    redirect("/");
  }

  survey.questions.sort(
    (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
  );

  const initialSurvey = {
    ...(survey as unknown as SurveyWithQuestions),
    sections: sections ?? [],
    responseCount: responseCount ?? 0,
  };

  return (
    <SurveyBuilder
      initialSurvey={initialSurvey}
      fromAnalyze={fromAnalyze}
      isNewSurvey={isNewSurvey}
    />
  );
}
