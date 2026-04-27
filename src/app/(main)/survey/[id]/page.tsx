import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import SurveyViewTracker from "@/components/SurveyViewTracker";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

function formatMinutes(mins: number) {
  if (mins < 60) return `약 ${mins}분`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `약 ${h}시간` : `약 ${h}시간 ${m}분`;
}

function formatAvgTime(seconds: number) {
  if (seconds < 60) return `약 ${Math.round(seconds)}초`;
  const mins = seconds / 60;
  if (mins < 60) return `약 ${Math.round(mins)}분`;
  return `약 ${Math.floor(mins / 60)}시간 ${Math.round(mins % 60)}분`;
}

function MetaChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        backgroundColor: COLOR.BG_SECTION,
        ...TYPOGRAPHY.STYLE.LABEL_1,
        color: COLOR.TEXT_MUTED,
      }}
    >
      {icon}
      {label}
    </div>
  );
}

export default async function SurveyLandingPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Parallel fetch: survey, question count, response count, completion time samples
  const [
    { data: survey, error: surveyError },
    { count: questionCount },
    { count: responseCount },
    { data: completionSamples },
  ] = await Promise.all([
    supabase
      .from("surveys")
      .select("id, title, description, status, estimated_time, max_participants")
      .eq("id", id)
      .single(),
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("survey_id", id),
    supabase.from("responses").select("id", { count: "exact", head: true }).eq("survey_id", id),
    supabase
      .from("responses")
      .select("started_at, created_at")
      .eq("survey_id", id)
      .not("started_at", "is", null)
      .limit(200),
  ]);

  if (surveyError || !survey) {
    return (
      <main className="survey_landing_page min-h-[60vh] flex items-center justify-center px-4">
        <div
          className="rounded-2xl px-8 py-12 max-w-lg w-full text-center"
          style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>
            존재하지 않는 설문입니다.
          </p>
          <Link
            href="/"
            className="inline-block mt-6"
            style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.ACCENT }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  if (survey.status !== "published") {
    return (
      <main className="survey_landing_page min-h-[60vh] flex items-center justify-center px-4">
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
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  // Capacity check
  const totalResponses = responseCount ?? 0;
  const isFull = survey.max_participants !== null && totalResponses >= survey.max_participants;

  if (isFull) {
    return (
      <main className="survey_landing_page min-h-[60vh] flex items-center justify-center px-4">
        <div
          className="rounded-2xl px-8 py-12 max-w-lg w-full text-center"
          style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: COLOR.BG_SECTION }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLOR.TEXT_MUTED}
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M4.93 4.93L19.07 19.07" />
            </svg>
          </div>
          <p
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
              color: COLOR.TEXT_PRIMARY,
            }}
          >
            참여 인원이 마감되었습니다
          </p>
          <p className="mt-2" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            {survey.max_participants}명이 이미 참여했어요
          </p>
          <Link
            href="/"
            className="inline-block mt-6"
            style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.ACCENT }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  // Already responded check (authenticated only)
  let hasResponded = false;
  if (user) {
    const { data: existing } = await supabase
      .from("responses")
      .select("id")
      .eq("survey_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    hasResponded = !!existing;
  }

  // Compute avg completion time in JS (only when >= 5 samples with started_at)
  const MIN_SAMPLES = 5;
  let avgCompletionSeconds: number | null = null;
  if (completionSamples && completionSamples.length >= MIN_SAMPLES) {
    const totalMs = completionSamples.reduce((sum, r) => {
      const ms = new Date(r.created_at).getTime() - new Date(r.started_at as string).getTime();
      return ms > 0 ? sum + ms : sum;
    }, 0);
    avgCompletionSeconds = totalMs / completionSamples.length / 1000;
  }

  const qCount = questionCount ?? 0;

  return (
    <main className="survey_landing_page min-h-[60vh] flex items-center justify-center px-4 py-12">
      {/* 비로그인 사용자용 최근 본 설문 기록 */}
      {!user && <SurveyViewTracker id={survey.id} title={survey.title} />}
      <div
        className="survey_landing_card rounded-2xl w-full max-w-2xl shadow-sm overflow-hidden"
        style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        {/* Header */}
        <div
          className="px-8 pt-8 pb-6"
          style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          <h1
            style={{
              ...TYPOGRAPHY.STYLE.TITLE_2,
              fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
              color: COLOR.TOAST_BG,
              lineHeight: "1.35",
            }}
          >
            {survey.title}
          </h1>
          {survey.description && (
            <p
              className="mt-3"
              style={{
                ...TYPOGRAPHY.STYLE.BODY_1,
                color: COLOR.TEXT_MUTED,
                lineHeight: "1.6",
              }}
            >
              {survey.description}
            </p>
          )}
        </div>

        {/* Meta info */}
        <div className="px-8 py-5 flex flex-wrap gap-2">
          {/* Question count */}
          <MetaChip
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
              </svg>
            }
            label={`${qCount}개 질문`}
          />

          {/* Estimated time */}
          {survey.estimated_time && (
            <MetaChip
              icon={
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              label={formatMinutes(survey.estimated_time)}
            />
          )}

          {/* Response count */}
          <MetaChip
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            label={
              survey.max_participants
                ? `${totalResponses.toLocaleString()} / ${survey.max_participants.toLocaleString()}명`
                : `${totalResponses.toLocaleString()}명 참여`
            }
          />
        </div>

        {/* Avg completion time */}
        <div
          className="mx-8 mb-6 rounded-xl px-5 py-4"
          style={{ backgroundColor: COLOR.BG_SECTION }}
        >
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLOR.ACCENT}
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_1,
                fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
                color: COLOR.TEXT_PRIMARY,
              }}
            >
              평균 소요 시간
            </span>
          </div>
          {avgCompletionSeconds !== null ? (
            <p className="mt-1" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              참여자들의 평균 완료 시간은{" "}
              <span
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
                  color: COLOR.ACCENT,
                }}
              >
                {formatAvgTime(avgCompletionSeconds)}
              </span>
              입니다.
            </p>
          ) : (
            <p className="mt-1" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              아직 정보가 없어요. 더 많은 참여자가 필요해요.
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="px-8 pb-8">
          {hasResponded ? (
            <div className="text-center">
              <p className="mb-4" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
                이미 참여한 설문입니다.
              </p>
              <Link href="/" style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.ACCENT }}>
                홈으로 돌아가기
              </Link>
            </div>
          ) : (
            <Link
              href={`/survey/${id}/respond`}
              className="block w-full text-center font-semibold py-3 rounded-xl transition-colors"
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_1,
                fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
                backgroundColor: COLOR.ACCENT,
                color: COLOR.TEXT_INVERSE,
              }}
            >
              시작하기
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
