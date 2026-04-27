import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import type { Question, Section } from "@/lib/types/survey";
import SurveyRespondClient from "./SurveyRespondClient";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ preview?: string }> };

export default async function SurveyRespondPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "1";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch survey + questions + sections in parallel (core — always needed)
  const [
    { data: survey, error: surveyError },
    { data: questions, error: questionsError },
    { data: sections },
  ] = await Promise.all([
    supabase
      .from("surveys")
      .select("id, title, description, status, max_participants, creator_id")
      .eq("id", id)
      .single(),
    supabase
      .from("questions")
      .select(
        "id, survey_id, section_id, type, title, options, order_index, required, config, next_target"
      )
      .eq("survey_id", id)
      .order("order_index", { ascending: true }),
    supabase
      .from("sections")
      .select("id, survey_id, title, description, order_index, created_at, updated_at")
      .eq("survey_id", id)
      .order("order_index", { ascending: true }),
  ]);

  // Point-gate data — only meaningful for authenticated users
  let requiresPointDeduction = false;
  let availablePoints = 0;
  let canAfford = false;

  if (user) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [{ count: todaySurveyCount }, { data: pointRows }] = await Promise.all([
      supabase
        .from("responses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", todayStart.toISOString()),
      supabase
        .from("point_ledger")
        .select("amount")
        .eq("user_id", user.id)
        .eq("status", "available"),
    ]);

    requiresPointDeduction = (todaySurveyCount ?? 0) >= 5;
    availablePoints = (pointRows ?? []).reduce(
      (sum: number, row: { amount: number }) => sum + row.amount,
      0
    );
    canAfford = availablePoints >= 500;
  }

  // ── Guard: survey not found ──────────────────────────────────────────────────
  if (surveyError || !survey) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>
            존재하지 않는 설문입니다.
          </p>
          <Link href="/" style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.ACCENT }}>
            홈으로 가기
          </Link>
        </div>
      </main>
    );
  }

  // ── Guard: preview mode — only creator can preview ───────────────────────────
  if (isPreview) {
    if (!user || user.id !== survey.creator_id) {
      redirect(`/survey/${id}`);
    }
    // Creator previewing — skip all other guards (startpoint 제외)
    const previewQuestions = (questions ?? ([] as Question[])).filter(
      (q) => (q as Question).type !== "startpoint"
    ) as Question[];
    return (
      <SurveyRespondClient
        surveyId={id}
        surveyTitle={survey.title}
        surveyDescription={survey.description ?? undefined}
        questions={previewQuestions}
        sections={(sections ?? []) as Section[]}
        preview
      />
    );
  }

  // ── Guard: survey must be published ─────────────────────────────────────────
  if (survey.status !== "published") {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div
          className="rounded-2xl px-8 py-12 max-w-lg w-full text-center"
          style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>
            현재 참여할 수 없는 설문입니다.
          </p>
          <Link
            href="/"
            className="inline-block mt-6"
            style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.ACCENT }}
          >
            홈으로 가기
          </Link>
        </div>
      </main>
    );
  }

  // ── Guard: capacity ──────────────────────────────────────────────────────────
  if (survey.max_participants !== null) {
    const { count: responseCount } = await supabase
      .from("responses")
      .select("id", { count: "exact", head: true })
      .eq("survey_id", id);

    if (responseCount !== null && responseCount >= survey.max_participants) {
      return (
        <main className="min-h-[60vh] flex items-center justify-center px-4">
          <div
            className="rounded-2xl px-8 py-12 max-w-lg w-full text-center"
            style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
          >
            <p
              style={{
                ...TYPOGRAPHY.STYLE.TITLE_2_KO,
                color: COLOR.TEXT_PRIMARY,
              }}
            >
              마감된 설문이에요
            </p>
            <p className="mt-2" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              참여 인원이 모두 찼어요.
            </p>
            <Link
              href="/"
              className="inline-block mt-6"
              style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.ACCENT }}
            >
              홈으로 가기
            </Link>
          </div>
        </main>
      );
    }
  }

  // ── Guard: already responded (authenticated users only) ──────────────────────
  if (user) {
    const { data: existing } = await supabase
      .from("responses")
      .select("id")
      .eq("survey_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return (
        <main className="min-h-[60vh] flex items-center justify-center px-4">
          <div
            className="rounded-2xl px-8 py-12 max-w-lg w-full text-center"
            style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
          >
            <p style={{ ...TYPOGRAPHY.STYLE.TITLE_2_KO, color: COLOR.TEXT_PRIMARY }}>
              이미 참여한 설문이에요
            </p>
            <p className="mt-2" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              결과를 확인해 보세요.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <Link
                href={`/survey/${id}/report`}
                className="block py-3 rounded-xl text-center font-semibold"
                style={{
                  backgroundColor: COLOR.ACCENT,
                  color: COLOR.TEXT_INVERSE,
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  fontWeight: "600",
                }}
              >
                결과 보기
              </Link>
              <Link
                href="/"
                className="block py-3 rounded-xl text-center"
                style={{
                  backgroundColor: COLOR.BG_SECTION,
                  color: COLOR.TEXT_PRIMARY,
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                }}
              >
                홈으로 가기
              </Link>
            </div>
          </div>
        </main>
      );
    }
  } else {
    // Unauthenticated — redirect to login, return to this page after
    redirect(`/auth/login?next=/survey/${id}/respond`);
  }

  // ── Questions error ──────────────────────────────────────────────────────────
  if (questionsError || !questions) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>
            일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.
          </p>
          <Link href={`/survey/${id}`} style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.ACCENT }}>
            돌아가기
          </Link>
        </div>
      </main>
    );
  }

  // startpoint는 설문 단위 고정 노드 — 응답 폼에서 제외 (intro phase에서 별도 표시)
  const sortedQuestions = (questions as Question[])
    .filter((q) => q.type !== "startpoint")
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <SurveyRespondClient
      surveyId={id}
      surveyTitle={survey.title}
      surveyDescription={survey.description ?? undefined}
      questions={sortedQuestions}
      sections={(sections ?? []) as Section[]}
      preview={false}
      requiresPointDeduction={requiresPointDeduction}
      availablePoints={availablePoints}
      canAfford={canAfford}
    />
  );
}
