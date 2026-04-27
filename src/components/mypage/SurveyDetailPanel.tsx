"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Button } from "@/components/ui";
import { AppIcon, IconSurvey } from "@/components/ui/icons";
import { COLOR, TYPOGRAPHY, RADIUS, SHADOW } from "@/lib/design-tokens";
import type { SurveyListItem } from "./MySurveysClient";

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}일 전`;
}

function formatDday(endDate: string): { label: string; color: string } {
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: "마감됨", color: COLOR.TEXT_MUTED };
  if (diff === 0) return { label: "오늘 마감", color: COLOR.NEGATIVE };
  if (diff <= 3) return { label: `D-${diff}`, color: COLOR.WARNING };
  return { label: `D-${diff}`, color: COLOR.TEXT_MUTED };
}

interface SurveyDetailPanelProps {
  survey: SurveyListItem;
  actionLoadingIds: Set<string>;
  userPlan: "free" | "pro" | "max";
  onPublish: (id: string) => Promise<void>;
  onClose: (id: string) => Promise<void>;
  onFollowUp: (id: string) => Promise<void>;
}

export function SurveyDetailPanel({
  survey,
  actionLoadingIds,
  userPlan,
  onPublish,
  onClose,
  onFollowUp,
}: SurveyDetailPanelProps) {
  const router = useRouter();
  const isClosed = survey.status === "closed" || survey.status === "archived";
  const isLoading = actionLoadingIds.has(survey.id);

  return (
    <div
      className="survey_detail_panel_wrap w-full"
      style={{
        backgroundColor: COLOR.BG_BASE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        padding: "20px",
        boxShadow: SHADOW.CARD,
      }}
    >
      {/* Header: icon + title + badge */}
      <div className="flex items-start gap-3" style={{ marginBottom: 16 }}>
        <AppIcon size={40} variant="light">
          <IconSurvey />
        </AppIcon>
        <div className="flex-1 min-w-0">
          <p
            className="line-clamp-3"
            style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY, marginBottom: 6 }}
          >
            {survey.title || "제목 없음"}
          </p>
          <Badge status={survey.status} />
        </div>
      </div>

      {/* Stats block */}
      <div
        style={{
          backgroundColor: COLOR.BG_SURFACE,
          borderRadius: RADIUS.MD,
          padding: "12px 16px",
          marginBottom: 16,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_SECONDARY }}>응답</span>
          <span style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}>
            {survey.responseCount}
            {survey.maxResponses !== null && (
              <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
                {" / "}
                {survey.maxResponses}
              </span>
            )}
          </span>
        </div>

        {survey.maxResponses !== null && (
          <div
            style={{
              height: 4,
              backgroundColor: COLOR.BORDER_DEFAULT,
              borderRadius: 2,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (survey.responseCount / survey.maxResponses) * 100)}%`,
                backgroundColor: COLOR.ACCENT,
                borderRadius: 2,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}>
            {survey.status === "published"
              ? survey.lastResponseAt
                ? `마지막 응답 ${formatRelativeTime(survey.lastResponseAt)}`
                : "아직 응답이 없어요"
              : survey.status === "draft"
                ? `수정 ${formatRelativeTime(survey.updated_at)}`
                : "마감된 설문"}
          </span>
          {survey.status === "published" &&
            survey.end_date &&
            (() => {
              const dday = formatDday(survey.end_date);
              return (
                <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: dday.color, fontWeight: 500 }}>
                  {dday.label}
                </span>
              );
            })()}
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex gap-2" style={{ marginBottom: 16 }}>
        <Link
          href={`/survey/${survey.id}/edit`}
          className="flex-1 flex items-center justify-center gap-1.5"
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            padding: "8px 0",
            borderRadius: RADIUS.SM,
            backgroundColor: COLOR.BG_SURFACE,
            color: COLOR.TEXT_SECONDARY,
            textDecoration: "none",
          }}
        >
          빌더 열기
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M2 6h8M7 3l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        {isClosed && (
          <Link
            href={`/survey/${survey.id}/report`}
            className="flex-1 flex items-center justify-center gap-1.5"
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              padding: "8px 0",
              borderRadius: RADIUS.SM,
              backgroundColor: COLOR.ACCENT_BG,
              color: COLOR.ACCENT,
              textDecoration: "none",
            }}
          >
            결과 보기
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M2 6h8M7 3l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: COLOR.BORDER_DEFAULT, marginBottom: 16 }} />

      {/* CTA */}
      {survey.status === "draft" &&
        (survey.isPublishable === false ? (
          <Button
            variant="neutral"
            size="lg"
            onClick={() => router.push(`/survey/${survey.id}/edit`)}
            className="w-full"
          >
            이어서 수정하기
          </Button>
        ) : (
          <Button
            variant="solid"
            size="lg"
            loading={isLoading}
            onClick={() => onPublish(survey.id)}
            className="w-full"
          >
            공개하기
          </Button>
        ))}
      {survey.status === "published" && (
        <Button
          variant="neutral"
          size="lg"
          loading={isLoading}
          onClick={() => onClose(survey.id)}
          className="w-full"
        >
          마감하기
        </Button>
      )}
      {isClosed && (
        <Button
          variant="ghost"
          size="lg"
          loading={isLoading}
          disabled={userPlan === "free"}
          onClick={() => onFollowUp(survey.id)}
          className="w-full"
        >
          후속 설문 만들기
        </Button>
      )}
    </div>
  );
}
