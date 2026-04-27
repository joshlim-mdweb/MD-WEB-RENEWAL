"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SurveyStatus } from "@/lib/types/survey";
import { SURVEY_PURPOSE_LABELS } from "@/lib/types/survey";
import type { SurveyPurpose } from "@/lib/types/survey";
import { Badge, Button, EmptyState } from "@/components/ui";
import { AppIcon, IconEmpty } from "@/components/ui/icons";
import { useToastStore } from "@/lib/store/toast";
import { COLOR, TYPOGRAPHY, RADIUS, INTERACTION } from "@/lib/design-tokens";

type ArchiveState = { isLoading: boolean };

interface SurveyListItem {
  id: string;
  title: string;
  status: SurveyStatus;
  responseCount: number;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string | null;
  purpose?: string | null;
}

interface ActivityItem {
  id: string;
  contentType: "survey";
  title: string;
  participatedAt: string;
}

interface MySurveysListProps {
  surveys: SurveyListItem[];
  activities?: ActivityItem[];
}

type TabKey = "active" | "completed" | "history";

// ── 공통 탭 스타일 ─────────────────────────────────────────────────────────────
function tabStyle(isActive: boolean) {
  return {
    ...TYPOGRAPHY.STYLE.LABEL_1,
    fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
    padding: "10px 16px",
    color: isActive ? COLOR.ACCENT : COLOR.TEXT_MUTED,
    borderBottom: isActive ? `2px solid ${COLOR.ACCENT}` : "2px solid transparent",
    marginBottom: "-1px",
    background: "none",
    cursor: "pointer",
  } as const;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ── 설문 카드 ──────────────────────────────────────────────────────────────────
function SurveyListItemRow({
  survey,
  isArchived,
  archiveLoading,
  onArchive,
}: {
  survey: SurveyListItem;
  isArchived: boolean;
  archiveLoading: boolean;
  onArchive: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const effectiveStatus: SurveyStatus = isArchived ? "archived" : survey.status;
  const purposeLabel =
    survey.purpose && SURVEY_PURPOSE_LABELS[survey.purpose as SurveyPurpose]
      ? SURVEY_PURPOSE_LABELS[survey.purpose as SurveyPurpose]
      : null;
  const isDraft = effectiveStatus === "draft";
  const isDone = effectiveStatus === "closed" || effectiveStatus === "archived";

  return (
    <li className="survey_card_wrap" style={{ listStyle: "none" }}>
      <Link
        href={`/survey/${survey.id}/edit`}
        style={{
          display: "block",
          border: `1px solid ${hovered ? COLOR.BORDER_STRONG : COLOR.BORDER_DEFAULT}`,
          borderRadius: RADIUS.XL,
          padding: "16px 20px",
          transition: "border-color 150ms ease",
          textDecoration: "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* 상단: 배지 + 액션 버튼 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Badge status={effectiveStatus} />
            {purposeLabel && (
              <span
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_2,
                  color: COLOR.TEXT_MUTED,
                  whiteSpace: "nowrap",
                }}
              >
                {purposeLabel}
              </span>
            )}
          </div>

          {/* 상태별 액션 버튼 */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {isDraft && (
              <Link
                href={`/survey/${survey.id}/edit?publish=1`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  color: COLOR.ACCENT,
                  backgroundColor: COLOR.ACCENT_LIGHT,
                  borderRadius: RADIUS.SM,
                  padding: "5px 12px",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                }}
              >
                공개하기
              </Link>
            )}
            {!isDraft && (
              <Link
                href={`/survey/${survey.id}/report`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  color: COLOR.TEXT_SECONDARY,
                  backgroundColor: COLOR.BG_SECTION,
                  borderRadius: RADIUS.SM,
                  padding: "5px 12px",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                }}
              >
                결과 보기
              </Link>
            )}
            {isDone && effectiveStatus === "closed" && (
              <Button
                variant="neutral"
                size="sm"
                loading={archiveLoading}
                onClick={() => onArchive(survey.id)}
              >
                보관하기
              </Button>
            )}
          </div>
        </div>

        {/* 제목 */}
        <p
          style={{
            ...TYPOGRAPHY.STYLE.TITLE_2,
            color: isDraft ? COLOR.TEXT_SECONDARY : COLOR.TEXT_PRIMARY,
            marginBottom: "8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {survey.title || "제목 없음"}
        </p>

        {/* 하단: 응답 수 + 날짜 */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            {survey.responseCount.toLocaleString()}명 응답
          </span>
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}>
            {formatDate(survey.created_at)}
          </span>
        </div>
      </Link>
    </li>
  );
}

export function MySurveysList({ surveys, activities = [] }: MySurveysListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [archiveStates, setArchiveStates] = useState<Record<string, ArchiveState>>({});
  const { showToast } = useToastStore();
  const router = useRouter();

  const activeSurveys = surveys.filter(
    (s) => (s.status === "draft" || s.status === "published") && !archivedIds.has(s.id)
  );
  const completedSurveys = surveys.filter(
    (s) => s.status === "closed" || archivedIds.has(s.id) || s.status === "archived"
  );

  async function handleArchive(surveyId: string) {
    setArchiveStates((prev) => ({ ...prev, [surveyId]: { isLoading: true } }));
    try {
      const res = await fetch(`/api/surveys/${surveyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      if (res.ok) {
        setArchivedIds((prev) => new Set([...prev, surveyId]));
        setArchiveStates((prev) => {
          const next = { ...prev };
          delete next[surveyId];
          return next;
        });
      } else {
        setArchiveStates((prev) => {
          const next = { ...prev };
          delete next[surveyId];
          return next;
        });
        showToast("보관에 실패했어요.");
      }
    } catch {
      setArchiveStates((prev) => {
        const next = { ...prev };
        delete next[surveyId];
        return next;
      });
      showToast("네트워크 연결을 확인하고 다시 시도해 주세요.");
    }
  }

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "active", label: "진행 중", count: activeSurveys.length },
    { key: "completed", label: "완료", count: completedSurveys.length },
    { key: "history", label: "참여 기록", count: activities.length },
  ];

  return (
    <section className="my_surveys_area">
      {/* ── Tab bar ── */}
      <div className="flex mb-5" style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}>
        {tabs.map(({ key, label, count }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={tabStyle(activeTab === key)}>
            {label}
            <span
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                marginLeft: "4px",
                color: activeTab === key ? COLOR.ACCENT : COLOR.TEXT_DISABLED,
              }}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── 진행 중 / 완료 ── */}
      {activeTab !== "history" &&
        (() => {
          const list = activeTab === "active" ? activeSurveys : completedSurveys;
          if (list.length === 0) {
            return activeTab === "active" ? (
              <EmptyState
                icon={
                  <AppIcon size={48} variant="light">
                    <IconEmpty />
                  </AppIcon>
                }
                title="아직 설문이 없어요"
                description="첫 번째 설문을 만들어 보세요."
                ctaLabel="설문 만들기"
                onCtaClick={() => router.push("/survey/new")}
              />
            ) : (
              <EmptyState
                icon={
                  <AppIcon size={48} variant="light">
                    <IconEmpty />
                  </AppIcon>
                }
                title="완료된 설문이 없어요"
                description="공개 후 마감된 설문이 여기 표시돼요."
              />
            );
          }
          return (
            <ul className="space-y-2">
              {list.map((survey) => (
                <SurveyListItemRow
                  key={survey.id}
                  survey={survey}
                  isArchived={archivedIds.has(survey.id)}
                  archiveLoading={archiveStates[survey.id]?.isLoading ?? false}
                  onArchive={handleArchive}
                />
              ))}
            </ul>
          );
        })()}

      {/* ── 참여 기록 ── */}
      {activeTab === "history" &&
        (activities.length === 0 ? (
          <EmptyState
            icon={
              <AppIcon size={48} variant="light">
                <IconEmpty />
              </AppIcon>
            }
            title="아직 참여한 설문이 없어요"
            description="공개된 설문에 참여해 보세요."
          />
        ) : (
          <ul className="space-y-2">
            {activities.map((a) => (
              <li key={`survey-${a.id}`}>
                <Link
                  href={`/survey/${a.id}`}
                  className="activity_item_wrap flex items-center gap-3 rounded-2xl px-4 py-3.5"
                  style={{ backgroundColor: COLOR.BG_BASE, transition: INTERACTION.TRANSITION_BG }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                      INTERACTION.HOVER_BG;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = COLOR.BG_BASE;
                  }}
                >
                  <span
                    className="flex-shrink-0 px-2 py-0.5 rounded-md"
                    style={{
                      ...TYPOGRAPHY.STYLE.LABEL_2,
                      backgroundColor: COLOR.BG_SECTION,
                      color: COLOR.TEXT_SECONDARY,
                    }}
                  >
                    설문
                  </span>
                  <p
                    className="flex-1 min-w-0 truncate"
                    style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}
                  >
                    {a.title}
                  </p>
                  <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}>
                    {formatDate(a.participatedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
