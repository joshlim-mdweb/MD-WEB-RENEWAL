import { createClient } from "@/lib/supabase/server";
import { ParticipatedContentList } from "@/components/mypage";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function ParticipationHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("responses")
    .select("id, created_at, survey_id, surveys(id, title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const activities = (data ?? []).flatMap((row) => {
    const survey = Array.isArray(row.surveys) ? row.surveys[0] : row.surveys;
    if (!survey) return [];
    const typedSurvey = survey as { id: string; title: string };
    return [
      {
        id: typedSurvey.id,
        contentType: "survey" as const,
        title: typedSurvey.title,
        participatedAt: row.created_at,
      },
    ];
  });

  return (
    <div className="participation_history_page">
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            ...TYPOGRAPHY.STYLE.TITLE_1,
            color: COLOR.TEXT_PRIMARY,
            marginBottom: "16px",
          }}
        >
          참여 내역
        </h1>
        <div style={{ height: "1px", backgroundColor: COLOR.BORDER_DEFAULT }} />
      </div>

      <ParticipatedContentList activities={activities} />
    </div>
  );
}
