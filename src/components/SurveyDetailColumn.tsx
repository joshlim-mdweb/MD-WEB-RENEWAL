"use client";

import { useState, useEffect, useRef } from "react";
import { COLOR, TYPOGRAPHY, RADIUS } from "@/lib/design-tokens";
import { createClient } from "@/lib/supabase/client";
import { SurveyDetailPanel, type SurveyPreview } from "./survey/SurveyDetailPanel";

// ─── Detail Skeleton ──────────────────────────────────────────────────────────

function DetailSkeleton() {
  const rows = [160, 16, 22, 14, 14, 48];
  return (
    <div className="survey_detail_skeleton_wrap" style={{ padding: "24px" }}>
      {rows.map((h, i) => (
        <div
          key={i}
          style={{
            height: `${h}px`,
            borderRadius: RADIUS.MD,
            backgroundColor: COLOR.BG_SURFACE,
            marginBottom: i < rows.length - 1 ? "12px" : "0",
            width: i === 1 ? "55%" : "100%",
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function DetailEmptyState() {
  return (
    <div
      className="survey_detail_empty_wrap flex flex-col items-center justify-center h-full"
      style={{ padding: "24px", textAlign: "center" }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        style={{ color: COLOR.TEXT_DISABLED, marginBottom: "12px" }}
      >
        <rect x="10" y="6" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16 16h16M16 22h16M16 28h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED, marginBottom: "6px" }}>
        참여할 설문을 선택해 보세요
      </p>
      <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_DISABLED }}>
        왼쪽 목록에서 설문을 클릭하면 내용을 볼 수 있어요
      </p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function DetailErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="survey_detail_error_wrap flex flex-col items-center justify-center h-full"
      style={{ padding: "24px", textAlign: "center" }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        style={{ color: COLOR.TEXT_DISABLED, marginBottom: "12px" }}
      >
        <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="2" />
        <path d="M20 12v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="27" r="1.5" fill="currentColor" />
      </svg>
      <p
        style={{
          ...TYPOGRAPHY.STYLE.BODY_2,
          color: COLOR.TEXT_MUTED,
          marginBottom: "16px",
        }}
      >
        설문 정보를 불러오지 못했어요
      </p>
      <button
        onClick={onRetry}
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_1,
          color: COLOR.ACCENT,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 0",
        }}
      >
        다시 시도하기
      </button>
    </div>
  );
}

// ─── Main SurveyDetailColumn ──────────────────────────────────────────────────

export default function SurveyDetailColumn({
  selectedSurveyId,
  onClearSelection,
}: {
  selectedSurveyId: string | null;
  onClearSelection: () => void;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [detailSurvey, setDetailSurvey] = useState<SurveyPreview | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const previewCacheRef = useRef<Record<string, SurveyPreview>>({});

  // 인증 상태 로드
  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data: { user } }: { data: { user: { id: string } | null } }) => {
        setUserId(user?.id ?? null);
      });
  }, []);

  // 선택된 설문 디테일 로드
  const loadSurvey = (id: string) => {
    if (previewCacheRef.current[id]) {
      setDetailSurvey(previewCacheRef.current[id]);
      setIsDetailLoading(false);
      setHasError(false);
      return;
    }

    setIsDetailLoading(true);
    setDetailSurvey(null);
    setHasError(false);

    fetch(`/api/surveys/${id}`)
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
          previewCacheRef.current[id] = preview;
          setDetailSurvey(preview);
        } else {
          setHasError(true);
        }
        setIsDetailLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsDetailLoading(false);
      });
  };

  useEffect(() => {
    if (!selectedSurveyId) {
      setDetailSurvey(null);
      setIsDetailLoading(false);
      setHasError(false);
      return;
    }
    loadSurvey(selectedSurveyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSurveyId]);

  // ESC 키로 패널 닫기
  useEffect(() => {
    if (!selectedSurveyId) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClearSelection();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSurveyId, onClearSelection]);

  if (!selectedSurveyId) {
    return <DetailEmptyState />;
  }

  if (isDetailLoading) {
    return <DetailSkeleton />;
  }

  if (hasError || !detailSurvey) {
    return <DetailErrorState onRetry={() => selectedSurveyId && loadSurvey(selectedSurveyId)} />;
  }

  return (
    <div
      style={{
        padding: "20px 24px 24px",
        opacity: 1,
        transition: "opacity 150ms ease",
      }}
    >
      <SurveyDetailPanel
        survey={detailSurvey}
        userId={userId}
        onClose={onClearSelection}
        size="md"
        showCloseButton={true}
      />
    </div>
  );
}
