"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { COLOR, TYPOGRAPHY, RADIUS, SPACING, INTERACTION } from "@/lib/design-tokens";
import { createClient } from "@/lib/supabase/client";
import { SurveyDetailPanel, type SurveyPreview } from "./survey/SurveyDetailPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParticipatedSurvey {
  id: string;
  title: string;
  status: string;
  end_date: string | null;
  created_at: string;
}

interface PointsData {
  available: number;
  pending: number;
}

export interface RightSidebarProps {
  selectedSurveyId?: string | null;
  onClearSelection?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysLeft(endDate: string): number | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: COLOR.BG_BASE,
        borderRadius: RADIUS.XL,
        padding: SPACING["5"],
      }}
    >
      {children}
    </div>
  );
}

function DdayBadge({ endDate }: { endDate: string }) {
  const days = getDaysLeft(endDate);
  if (days === null) {
    return (
      <span
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_2,
          backgroundColor: COLOR.BG_SURFACE,
          color: COLOR.TEXT_DISABLED,
          padding: "2px 8px",
          borderRadius: RADIUS.PILL,
          whiteSpace: "nowrap",
        }}
      >
        마감
      </span>
    );
  }
  const isUrgent = days <= 3;
  return (
    <span
      style={{
        ...TYPOGRAPHY.STYLE.LABEL_2,
        backgroundColor: isUrgent ? COLOR.NEGATIVE_BG : COLOR.BG_SURFACE,
        color: isUrgent ? COLOR.NEGATIVE : COLOR.TEXT_MUTED,
        padding: "2px 8px",
        borderRadius: RADIUS.PILL,
        whiteSpace: "nowrap",
      }}
    >
      {days === 0 ? "오늘 마감" : `D-${days}`}
    </span>
  );
}

// ─── Points Card ──────────────────────────────────────────────────────────────

function PointsCard({ points }: { points: PointsData }) {
  return (
    <CardShell>
      <div className="flex items-center justify-between mb-3">
        <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>내 포인트</span>
        <Link
          href="/my"
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_2,
            color: COLOR.ACCENT,
            textDecoration: "none",
          }}
        >
          내 페이지 →
        </Link>
      </div>

      <div
        className="mb-1"
        style={{
          ...TYPOGRAPHY.STYLE.DISPLAY,
          color: COLOR.TEXT_PRIMARY,
        }}
      >
        {points.available.toLocaleString("ko-KR")}
        <span
          style={{
            ...TYPOGRAPHY.STYLE.TITLE_2,
            color: COLOR.TEXT_MUTED,
            marginLeft: "4px",
          }}
        >
          P
        </span>
      </div>

      {points.pending > 0 && (
        <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
          검토 중 {points.pending.toLocaleString("ko-KR")}P
        </p>
      )}

      <Link
        href="/my/point"
        className="block mt-3 text-center"
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_1,
          fontWeight: "600",
          padding: "8px 0",
          borderRadius: RADIUS.MD,
          backgroundColor: COLOR.BG_SURFACE,
          color: COLOR.TEXT_SECONDARY,
          textDecoration: "none",
          transition: INTERACTION.TRANSITION_BG,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            INTERACTION.HOVER_BG_SURFACE;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = COLOR.BG_SURFACE;
        }}
      >
        출금하기
      </Link>
    </CardShell>
  );
}

// ─── Participated Surveys Card ────────────────────────────────────────────────

function ParticipatedCard({ surveys }: { surveys: ParticipatedSurvey[] }) {
  return (
    <CardShell>
      <p className="mb-3" style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>
        참여한 설문
      </p>

      {surveys.length === 0 ? (
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_DISABLED }}>
          아직 참여한 설문이 없어요
        </p>
      ) : (
        /* [B] maxHeight + 내부 스크롤 — 목록이 길어도 하단 CTA 고정 */
        <div
          className="flex flex-col gap-2"
          style={{ maxHeight: "200px", overflowY: "auto", scrollbarWidth: "none" }}
        >
          {surveys.map((s) => (
            <Link
              key={s.id}
              href={`/survey/${s.id}`}
              className="participated_item_wrap flex items-center justify-between gap-2"
              style={{ textDecoration: "none" }}
            >
              <span
                className="line-clamp-1"
                style={{
                  ...TYPOGRAPHY.STYLE.BODY_2,
                  color: COLOR.TEXT_PRIMARY,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {s.title}
              </span>
              {s.end_date ? (
                <DdayBadge endDate={s.end_date} />
              ) : (
                <span
                  style={{
                    ...TYPOGRAPHY.STYLE.LABEL_2,
                    color: COLOR.TEXT_DISABLED,
                    whiteSpace: "nowrap",
                  }}
                >
                  기간 없음
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </CardShell>
  );
}

// ─── Detail Skeleton ──────────────────────────────────────────────────────────

function DetailSkeleton() {
  const rows = [140, 16, 20, 14, 14, 48];
  return (
    <div className="survey_detail_skeleton_wrap" style={{ padding: "4px 0" }}>
      {rows.map((h, i) => (
        <div
          key={i}
          style={{
            height: `${h}px`,
            borderRadius: RADIUS.MD,
            backgroundColor: COLOR.BG_BASE,
            marginBottom: i < rows.length - 1 ? "10px" : "0",
            width: i === 1 ? "60%" : "100%",
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

// ─── Login Prompt Card ────────────────────────────────────────────────────────

function LoginPromptCard() {
  return (
    <CardShell>
      {/* 비로그인 상태 표시 */}
      <div className="flex items-center gap-1.5 mb-3">
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: COLOR.TEXT_DISABLED,
            flexShrink: 0,
          }}
        />
        <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
          로그인이 안 되어 있어요
        </span>
      </div>
      <p className="mb-1" style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}>
        내 활동을 확인해 보세요
      </p>
      <p className="mb-4" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
        로그인하면 포인트와 참여한 설문을 볼 수 있어요
      </p>
      <Link
        href="/login"
        className="block text-center"
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_1,
          fontWeight: "600",
          padding: "10px 0",
          borderRadius: RADIUS.MD,
          backgroundColor: COLOR.ACCENT,
          color: COLOR.TEXT_INVERSE,
          textDecoration: "none",
        }}
      >
        로그인하기
      </Link>
    </CardShell>
  );
}

// ─── Main RightSidebar ────────────────────────────────────────────────────────

export default function RightSidebar({ selectedSurveyId, onClearSelection }: RightSidebarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [points, setPoints] = useState<PointsData | null>(null);
  const [participatedSurveys, setParticipatedSurveys] = useState<ParticipatedSurvey[]>([]);
  const [detailSurvey, setDetailSurvey] = useState<SurveyPreview | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const previewCacheRef = useRef<Record<string, SurveyPreview>>({});

  // 인증 상태 + 대시보드 데이터 로드
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      setUserId(user.id);

      fetch("/api/my/dashboard")
        .then((r) => r.json())
        .then((data) => {
          if (data.points) {
            setPoints({ available: data.points.available, pending: data.points.pending });
          }
        })
        .catch(() => {});

      supabase
        .from("responses")
        .select("survey_id, surveys!inner(id, title, status, end_date, created_at)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data: rows }) => {
          if (!rows) return;
          const items: ParticipatedSurvey[] = rows
            .map((row) => {
              const s = row.surveys as unknown as {
                id: string;
                title: string;
                status: string;
                end_date: string | null;
                created_at: string;
              };
              return {
                id: s.id,
                title: s.title,
                status: s.status,
                end_date: s.end_date,
                created_at: s.created_at,
              };
            })
            .filter((item) => item.id);
          setParticipatedSurveys(items);
        });
    });
  }, []);

  // 선택된 설문 디테일 로드
  useEffect(() => {
    if (!selectedSurveyId) {
      setDetailSurvey(null);
      setIsDetailLoading(false);
      return;
    }

    if (previewCacheRef.current[selectedSurveyId]) {
      setDetailSurvey(previewCacheRef.current[selectedSurveyId]);
      setIsDetailLoading(false);
      return;
    }

    setIsDetailLoading(true);
    setDetailSurvey(null);

    fetch(`/api/surveys/${selectedSurveyId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          const preview: SurveyPreview = {
            id: data.id,
            title: data.title,
            description: data.description ?? null,
            thumbnail_url: data.thumbnail_url ?? null,
            end_date: data.end_date ?? null,
            estimated_time: data.estimated_time ?? null,
            reward_amount: data.reward_amount ?? null,
            status: data.status,
            response_count: data.responseCount ?? 0,
            question_count: Array.isArray(data.questions) ? data.questions.length : 0,
            questions: Array.isArray(data.questions)
              ? data.questions.map((q: { type: string; title: string }) => ({
                  type: q.type,
                  title: q.title,
                }))
              : [],
          };
          previewCacheRef.current[selectedSurveyId] = preview;
          setDetailSurvey(preview);
        }
        setIsDetailLoading(false);
      })
      .catch(() => {
        setIsDetailLoading(false);
      });
  }, [selectedSurveyId]);

  // ESC 키로 패널 닫기
  useEffect(() => {
    if (!selectedSurveyId) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClearSelection?.();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSurveyId, onClearSelection]);

  const showDetail = !!selectedSurveyId;

  return (
    <aside
      className="right_sidebar_wrap flex flex-col gap-4"
      style={{
        height: "100%",
        overflowY: "auto",
        scrollbarWidth: "none",
        /* [A] 사이드바 배경 회색 + 패딩 */
        backgroundColor: COLOR.BG_SURFACE,
        padding: "16px",
      }}
    >
      {/* 타이틀 */}
      {!showDetail && (
        <p style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY, marginBottom: "4px" }}>
          My
        </p>
      )}

      {/* [F] DETAIL 뷰 — 설문 선택 시 (로그인 무관) */}
      {showDetail && (
        <div style={{ opacity: 1, transition: "opacity 150ms ease" }}>
          {isDetailLoading ? (
            <DetailSkeleton />
          ) : detailSurvey ? (
            <SurveyDetailPanel
              survey={detailSurvey}
              userId={userId}
              onClose={() => onClearSelection?.()}
              size="sm"
              showCloseButton={true}
            />
          ) : null}
        </div>
      )}

      {/* DEFAULT 뷰 — 선택 없을 때 */}
      {!showDetail && (
        <>
          {/* 비로그인 */}
          {isLoggedIn === false && <LoginPromptCard />}

          {/* 로그인 — 포인트 + 참여 설문 */}
          {isLoggedIn === true && (
            <div className="flex flex-col gap-4">
              {points && <PointsCard points={points} />}
              <ParticipatedCard surveys={participatedSurveys} />
            </div>
          )}
        </>
      )}

      {/* 설문 만들기 CTA — 항상 최하단 */}
      {isLoggedIn !== null && (
        <Link
          href="/survey/new"
          className="block text-center"
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            fontWeight: 600,
            padding: "10px 0",
            borderRadius: RADIUS.MD,
            backgroundColor: COLOR.ACCENT,
            color: COLOR.TEXT_INVERSE,
            textDecoration: "none",
          }}
        >
          + 설문 만들기
        </Link>
      )}
    </aside>
  );
}
