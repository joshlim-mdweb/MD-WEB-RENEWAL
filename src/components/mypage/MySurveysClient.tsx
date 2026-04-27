"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SurveyStatus } from "@/lib/types/survey";
import {
  Badge,
  Button,
  EmptyState,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
} from "@/components/ui";
import { AppIcon, IconSurvey, IconEmpty } from "@/components/ui/icons";
import { useToastStore } from "@/lib/store/toast";
import { COLOR, TYPOGRAPHY, RADIUS, INTERACTION } from "@/lib/design-tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SurveyListItem {
  id: string;
  title: string;
  status: SurveyStatus;
  responseCount: number;
  maxResponses: number | null;
  created_at: string;
  updated_at: string;
  end_date: string | null;
  lastResponseAt: string | null;
  // undefined = non-draft (not applicable). false = draft but not publishable yet.
  isPublishable?: boolean;
}

interface MySurveysClientProps {
  surveys: SurveyListItem[];
  userPlan: "free" | "pro" | "max";
}

// Filter tabs mirror the task spec: 전체 / 진행중 / 임시저장 / 종료
type FilterTab = "all" | "published" | "draft" | "closed";

type SortKey = "newest" | "most_responses";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "published", label: "진행중" },
  { key: "draft", label: "임시저장" },
  { key: "closed", label: "종료" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "최신순" },
  { value: "most_responses", label: "응답 많은 순" },
];

function tabStyle(isActive: boolean): React.CSSProperties {
  return {
    ...TYPOGRAPHY.STYLE.LABEL_1,
    fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
    padding: "10px 16px",
    color: isActive ? COLOR.ACCENT : COLOR.TEXT_MUTED,
    borderBottom: isActive ? `2px solid ${COLOR.ACCENT}` : "2px solid transparent",
    marginBottom: "-1px",
    background: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "color 0.15s, border-color 0.15s",
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

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

// Maps archived surveys into the "closed" bucket for filter purposes.
function getFilterBucket(status: SurveyStatus): FilterTab {
  if (status === "closed" || status === "archived") return "closed";
  if (status === "published") return "published";
  return "draft";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SurveyGridCard({
  survey,
  effectiveStatus,
  isLoading,
  isSelected,
  userPlan,
  onPublish,
  onClose,
  onFollowUp,
  onCardClick,
}: {
  survey: SurveyListItem;
  effectiveStatus: SurveyStatus;
  isLoading: boolean;
  isSelected: boolean;
  userPlan: "free" | "pro" | "max";
  onPublish: (id: string) => void;
  onClose: (id: string) => void;
  onFollowUp: (id: string) => void;
  onCardClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const isClosed = effectiveStatus === "closed" || effectiveStatus === "archived";

  return (
    <li
      className="survey_grid_card_wrap"
      style={{
        backgroundColor: isSelected
          ? INTERACTION.ACTIVE_BG
          : hovered
            ? INTERACTION.HOVER_BG
            : COLOR.BG_BASE,
        border: `1px solid ${isSelected ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        overflow: "hidden",
        cursor: "pointer",
        transition: "background-color 150ms ease, border-color 150ms ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onCardClick}
    >
      {/* 썸네일 영역 */}
      <div
        style={{
          height: 120,
          backgroundColor: COLOR.BG_SURFACE,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppIcon size={36} variant="light">
          <IconSurvey />
        </AppIcon>

        {/* 상태 배지 오버레이 */}
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <Badge status={effectiveStatus} />
        </div>

        {/* 프로그레스 바 */}
        {survey.maxResponses !== null && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: COLOR.BORDER_DEFAULT,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (survey.responseCount / survey.maxResponses) * 100)}%`,
                backgroundColor: COLOR.ACCENT,
                borderRadius: "0 2px 2px 0",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}
      </div>

      {/* 카드 본문 */}
      <div style={{ padding: "12px" }}>
        {/* 제목 */}
        <p
          className="line-clamp-2"
          style={{
            ...TYPOGRAPHY.STYLE.TITLE_2,
            color: COLOR.TEXT_PRIMARY,
            marginBottom: "6px",
          }}
        >
          {survey.title || "제목 없음"}
        </p>

        {/* 날짜 / 마지막 응답 + D-day */}
        <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}>
            {effectiveStatus === "published"
              ? survey.lastResponseAt
                ? `마지막 응답 ${formatRelativeTime(survey.lastResponseAt)}`
                : "아직 응답이 없어요"
              : effectiveStatus === "draft"
                ? `수정 ${formatRelativeTime(survey.updated_at)}`
                : formatDate(survey.updated_at)}
          </span>
          {effectiveStatus === "published" &&
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

        {/* 액션 버튼 1개 */}
        <div onClick={(e) => e.stopPropagation()}>
          {effectiveStatus === "draft" &&
            (survey.isPublishable === false ? (
              <Button
                variant="neutral"
                size="sm"
                onClick={() => router.push(`/survey/${survey.id}/edit`)}
                className="w-full"
              >
                이어서 수정하기
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                loading={isLoading}
                onClick={() => onPublish(survey.id)}
                className="w-full"
              >
                공개하기
              </Button>
            ))}
          {effectiveStatus === "published" && (
            <Button
              variant="neutral"
              size="sm"
              loading={isLoading}
              onClick={() => onClose(survey.id)}
              className="w-full"
            >
              마감하기
            </Button>
          )}
          {isClosed && (
            <div className="flex gap-2">
              <Link
                href={`/survey/${survey.id}/edit?tab=responses`}
                className="flex-1 block text-center"
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  padding: "6px 0",
                  borderRadius: RADIUS.SM,
                  backgroundColor: COLOR.ACCENT_BG,
                  color: COLOR.ACCENT,
                  textDecoration: "none",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                결과 보기
              </Link>
              <Button
                variant="ghost"
                size="sm"
                loading={isLoading}
                disabled={userPlan === "free"}
                onClick={() => onFollowUp(survey.id)}
                className="flex-1"
              >
                후속 설문 만들기
              </Button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MySurveysClient({ surveys, userPlan }: MySurveysClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  // Optimistic status overrides: surveyId → new status after a quick action.
  const [statusOverrides, setStatusOverrides] = useState<Record<string, SurveyStatus>>({});
  // Per-card loading state for publish/close actions.
  const [actionLoadingIds, setActionLoadingIds] = useState<Set<string>>(new Set());

  const { showToast } = useToastStore();
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Merge server status with optimistic overrides.
  const surveysWithStatus = useMemo(
    () =>
      surveys.map((s) => ({
        ...s,
        status: (statusOverrides[s.id] ?? s.status) as SurveyStatus,
      })),
    [surveys, statusOverrides]
  );

  // Filter: tab + search query
  const filteredSurveys = useMemo(() => {
    let list =
      activeFilter === "all"
        ? surveysWithStatus
        : surveysWithStatus.filter((s) => getFilterBucket(s.status) === activeFilter);

    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return list;

    return list.filter((s) => (s.title ?? "").toLowerCase().includes(trimmed));
  }, [surveysWithStatus, activeFilter, searchQuery]);

  // Sort
  const sortedSurveys = useMemo(() => {
    const copy = [...filteredSurveys];
    if (sortKey === "most_responses") {
      return copy.sort((a, b) => b.responseCount - a.responseCount);
    }
    // newest: sort by created_at desc (default from server, but re-sort to be safe after status overrides)
    return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [filteredSurveys, sortKey]);

  function handleCardClick(surveyId: string) {
    router.push(`/survey/${surveyId}/edit`);
  }

  // Tab counts reflect the full list (not the current search query) so counts
  // feel stable as the user types — only the rendered list changes.
  const tabCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = { all: 0, published: 0, draft: 0, closed: 0 };
    surveysWithStatus.forEach((s) => {
      counts.all += 1;
      counts[getFilterBucket(s.status)] += 1;
    });
    return counts;
  }, [surveysWithStatus]);

  // ── Quick action handlers ────────────────────────────────────────────────

  async function handlePublish(surveyId: string) {
    setActionLoadingIds((prev) => new Set([...prev, surveyId]));
    try {
      const res = await fetch(`/api/surveys/${surveyId}/publish`, { method: "POST" });
      if (res.ok) {
        // Optimistically flip to published so the UI updates without a full re-fetch.
        setStatusOverrides((prev) => ({ ...prev, [surveyId]: "published" }));
        showToast("설문이 공개됐어요.");
        startTransition(() => router.refresh());
      } else {
        const body = await res.json().catch(() => ({}));
        if (res.status === 422 && body.errors) {
          showToast("제목과 질문을 입력해야 공개할 수 있어요.");
        } else {
          showToast(body.error ?? "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
        }
      }
    } catch {
      showToast("네트워크 연결을 확인하고 다시 시도해 주세요.");
    } finally {
      setActionLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(surveyId);
        return next;
      });
    }
  }

  async function handleFollowUp(surveyId: string) {
    if (userPlan === "free") {
      showToast("후속 설문은 Pro 플랜부터 사용할 수 있어요.");
      return;
    }
    setActionLoadingIds((prev) => new Set([...prev, surveyId]));
    try {
      const res = await fetch(`/api/surveys/${surveyId}/follow-up`, { method: "POST" });
      if (res.ok) {
        const body = await res.json();
        startTransition(() => router.push(`/survey/${body.surveyId}/edit`));
      } else {
        const body = await res.json().catch(() => ({}));
        if (body.error === "insufficient_credits") {
          showToast("AI 크레딧이 부족해요. 충전 후 이용해 주세요.");
        } else if (body.error === "ai_generation_failed") {
          showToast("AI 생성에 실패했어요. 잠시 후 다시 시도해 주세요.");
        } else {
          showToast("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
        }
      }
    } catch {
      showToast("네트워크 연결을 확인하고 다시 시도해 주세요.");
    } finally {
      setActionLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(surveyId);
        return next;
      });
    }
  }

  async function handleClose(surveyId: string) {
    setActionLoadingIds((prev) => new Set([...prev, surveyId]));
    try {
      const res = await fetch(`/api/surveys/${surveyId}/close`, { method: "POST" });
      if (res.ok) {
        setStatusOverrides((prev) => ({ ...prev, [surveyId]: "closed" }));
        showToast("설문이 마감됐어요.");
        startTransition(() => router.refresh());
      } else {
        const body = await res.json().catch(() => ({}));
        showToast(body.error ?? "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
      }
    } catch {
      showToast("네트워크 연결을 확인하고 다시 시도해 주세요.");
    } finally {
      setActionLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(surveyId);
        return next;
      });
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="my_surveys_client_area">
      {/* ── Filter tabs ── */}
      <div
        className="my_surveys_tabs flex"
        style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            style={tabStyle(activeFilter === key)}
          >
            {label}
            <span
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                marginLeft: "5px",
                color: activeFilter === key ? COLOR.ACCENT : COLOR.TEXT_DISABLED,
              }}
            >
              {tabCounts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search + Sort toolbar ── */}
      <div className="my_surveys_toolbar flex items-center gap-3 mt-4 mb-4">
        <div className="flex-1">
          {/* Plain input — the shared Input component only supports "text"|"textarea"
              and takes string values, not events. For this search field we need
              a native input with a search icon affordance which is simpler inline. */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="설문 검색"
            style={{
              ...TYPOGRAPHY.STYLE.BODY_1,
              width: "100%",
              padding: "8px 12px",
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.SM,
              backgroundColor: COLOR.BG_BASE,
              color: COLOR.TEXT_PRIMARY,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
        <Dropdown
          open={sortOpen}
          onOpenChange={setSortOpen}
          align="right"
          trigger={
            <DropdownTrigger
              label={SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? "최신순"}
              open={sortOpen}
              variant="ghost"
            />
          }
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <DropdownItem
              key={value}
              label={label}
              selected={sortKey === value}
              onClick={() => {
                setSortKey(value);
                setSortOpen(false);
              }}
            />
          ))}
        </Dropdown>
      </div>

      {/* ── 3컬럼 그리드 ── */}
      <div className="my_surveys_list_panel">
        {sortedSurveys.length === 0 ? (
          searchQuery.trim() ? (
            <EmptyState
              icon={
                <AppIcon size={48} variant="light">
                  <IconEmpty />
                </AppIcon>
              }
              title="검색 결과가 없어요"
              description={`"${searchQuery}"와 일치하는 설문이 없어요`}
            />
          ) : activeFilter === "all" ? (
            <EmptyState
              icon={
                <AppIcon size={48} variant="light">
                  <IconEmpty />
                </AppIcon>
              }
              title="아직 설문이 없어요"
              description="설문을 만들어 응답을 받아보세요"
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
              title={`${FILTER_TABS.find((t) => t.key === activeFilter)?.label} 설문이 없어요`}
              description="다른 탭을 확인해보세요"
            />
          )
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSurveys.map((survey) => (
              <SurveyGridCard
                key={survey.id}
                survey={survey}
                effectiveStatus={survey.status}
                isLoading={actionLoadingIds.has(survey.id)}
                isSelected={false}
                userPlan={userPlan}
                onPublish={handlePublish}
                onClose={handleClose}
                onFollowUp={handleFollowUp}
                onCardClick={() => handleCardClick(survey.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
