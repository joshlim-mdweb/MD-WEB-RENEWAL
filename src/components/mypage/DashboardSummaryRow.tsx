"use client";

// Points are split into Available (spendable) and Pending (under review).
// See docs/policy/points.md §9.3 for the full point status lifecycle.

import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

interface UserInfo {
  email: string;
  createdAt: string;
}

interface PointsSummary {
  available: number;
  pending: number;
  todayEarned: number;
  monthlyEarned: number;
}

interface SurveysSummary {
  draftCount: number;
  publishedCount: number;
}

interface DashboardSummaryRowProps {
  user: UserInfo;
  points: PointsSummary;
  surveys: SurveysSummary;
}

function formatJoinDate(isoString: string): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 가입`;
}

export function DashboardSummaryRow({ user, points, surveys }: DashboardSummaryRowProps) {
  return (
    <div className="dashboard_summary_wrap space-y-4">
      <ProfileCard user={user} />
      <PointsCard points={points} />
      <ActiveSurveysCard surveys={surveys} />
    </div>
  );
}

function ProfileCard({ user }: { user: UserInfo }) {
  const initial = user.email ? user.email[0].toUpperCase() : "?";
  const displayName = user.email ? user.email.split("@")[0] : "사용자";

  return (
    <div
      className="profile_card_wrap flex items-center gap-4 rounded-2xl px-5 py-4"
      style={{ backgroundColor: COLOR.BG_SURFACE }}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ ...TYPOGRAPHY.STYLE.H3, backgroundColor: COLOR.ACCENT_LIGHT, color: COLOR.ACCENT }}
      >
        {initial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate" style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}>
          {displayName}
        </p>
        <p
          className="truncate mt-0.5"
          style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
        >
          {user.email}
        </p>
        {user.createdAt && (
          <p className="mt-0.5" style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}>
            {formatJoinDate(user.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}

function PointsCard({ points }: { points: PointsSummary }) {
  return (
    <div
      className="points_card_wrap rounded-2xl px-5 py-5"
      style={{ backgroundColor: COLOR.BG_SURFACE }}
    >
      {/* Header label */}
      <p className="mb-1" style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_MUTED }}>
        사용 가능 포인트
      </p>

      {/* Big number */}
      <p className="mb-4" style={{ ...TYPOGRAPHY.STYLE.DISPLAY, color: COLOR.TEXT_PRIMARY }}>
        {points.available.toLocaleString()}
        <span
          className="ml-1.5"
          style={{
            fontSize: TYPOGRAPHY.SIZE.LG,
            fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
            color: COLOR.TEXT_MUTED,
          }}
        >
          P
        </span>
      </p>

      {/* 3-column stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 mb-5">
        <div>
          <p className="mb-1" style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            검토 중
          </p>
          <p
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
              color: COLOR.TEXT_PRIMARY,
            }}
          >
            {points.pending.toLocaleString()} P
          </p>
        </div>
        <div>
          <p className="mb-1" style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            오늘 적립
          </p>
          <p
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
              color: COLOR.ACCENT,
            }}
          >
            +{points.todayEarned.toLocaleString()} P
          </p>
        </div>
        <div>
          <p className="mb-1" style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            이번달 적립
          </p>
          <p
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
              color: COLOR.TEXT_SECONDARY,
            }}
          >
            +{points.monthlyEarned.toLocaleString()} P
          </p>
        </div>
      </div>
    </div>
  );
}

function ActiveSurveysCard({ surveys }: { surveys: SurveysSummary }) {
  const total = surveys.draftCount + surveys.publishedCount;

  return (
    <div
      className="surveys_summary_card_wrap rounded-2xl px-4 py-4"
      style={{ backgroundColor: COLOR.BG_SURFACE }}
    >
      <p className="mb-1" style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
        내 설문
      </p>
      <p className="mb-3" style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>
        {total}
        <span
          className="ml-1"
          style={{
            fontSize: TYPOGRAPHY.SIZE.SM,
            fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
            color: COLOR.TEXT_MUTED,
          }}
        >
          개
        </span>
      </p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>임시저장</span>
          <span
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
              color: COLOR.TEXT_PRIMARY,
            }}
          >
            {surveys.draftCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>진행 중</span>
          <span
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
              color: COLOR.POSITIVE,
            }}
          >
            {surveys.publishedCount}
          </span>
        </div>
      </div>
    </div>
  );
}
