import { createClient } from "@/lib/supabase/server";
import { MySurveysClient } from "@/components/mypage";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import type { SurveyStatus } from "@/lib/types/survey";
import { validateSurveyForPublish, type ValidationQuestion } from "@/lib/survey-validation";

export const dynamic = "force-dynamic";

export default async function MySurveysPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch surveys with questions so we can compute isPublishable server-side.
  // questions are stripped before sending to the client — only the boolean is passed.
  const { data: rawSurveys } = await supabase
    .from("surveys")
    .select(
      "id, title, status, created_at, updated_at, max_responses, end_date, questions(id, type, title, options, order_index, required, config, next_target)"
    )
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  const surveys = rawSurveys ?? [];
  const surveyIds = surveys.map((s) => s.id);

  // Fetch response counts for the user's surveys in a single query.
  // We aggregate client-side from the flat list — acceptable at MVP scale
  // where a user's survey count is small. Avoids needing an RPC or DB function.
  let responseCountMap: Record<string, number> = {};
  let lastResponseMap: Record<string, string> = {};
  if (surveyIds.length > 0) {
    const { data: responseRows } = await supabase
      .from("responses")
      .select("survey_id, created_at")
      .in("survey_id", surveyIds);

    (responseRows ?? []).forEach((row) => {
      responseCountMap[row.survey_id] = (responseCountMap[row.survey_id] ?? 0) + 1;
      const current = lastResponseMap[row.survey_id];
      if (!current || row.created_at > current) {
        lastResponseMap[row.survey_id] = row.created_at;
      }
    });
  }

  const surveyItems = surveys.map((s) => {
    const isPublishable =
      s.status !== "draft"
        ? undefined
        : validateSurveyForPublish({
            title: s.title,
            questions: (s.questions as unknown as ValidationQuestion[]) ?? [],
          }).length === 0;

    return {
      id: s.id,
      title: s.title,
      status: s.status as SurveyStatus,
      created_at: s.created_at,
      updated_at: s.updated_at,
      responseCount: responseCountMap[s.id] ?? 0,
      maxResponses: (s.max_responses as number | null) ?? null,
      end_date: (s.end_date as string | null) ?? null,
      lastResponseAt: lastResponseMap[s.id] ?? null,
      isPublishable,
    };
  });

  const { data: profileRow } = await supabase
    .from("profile")
    .select("plan")
    .eq("uuid", user.id)
    .maybeSingle();
  const userPlan = ((profileRow?.plan as string) ?? "free") as "free" | "pro" | "max";

  return (
    <div className="my_surveys_page px-5 py-8 max-w-[1400px] mx-auto w-full">
      <p className="mb-6" style={{ ...TYPOGRAPHY.STYLE.TITLE_1, color: COLOR.TEXT_PRIMARY }}>
        내 설문
      </p>
      <MySurveysClient surveys={surveyItems} userPlan={userPlan} />
    </div>
  );
}
