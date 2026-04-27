"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  COLOR,
  TYPOGRAPHY,
  RADIUS,
  INTERACTION,
  QUESTION_TYPE_ICON_BG,
  QUESTION_TYPE_COLOR,
} from "@/lib/design-tokens";
import { createClient } from "@/lib/supabase/client";
import { QuestionTypeIcon } from "@/components/builder/QuestionTypeIcon";
import type { QuestionType } from "@/lib/types/survey";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SurveyPreview {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  end_date: string | null;
  estimated_time: number | null;
  reward_amount: number | null;
  status: string;
  response_count: number;
  question_count: number;
  questions?: { type: string; title: string }[];
}

export type PanelSize = "sm" | "md"; // sm = col3 RightSidebar, md = col2 SurveyDetailColumn

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysLeft(endDate: string): number | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `약 ${mins}분`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `약 ${h}시간` : `약 ${h}시간 ${m}분`;
}

// purpose별 썸네일 플레이스홀더 색상
const PURPOSE_PLACEHOLDER: Record<string, { bg: string; color: string; label: string }> = {
  research: { bg: "#EBF5FF", color: COLOR.ACCENT, label: "리서치" },
  feedback: { bg: "#EFF9F6", color: COLOR.REWARD, label: "피드백" },
  event: { bg: "#FFF8EB", color: COLOR.WARNING, label: "이벤트" },
  education: { bg: "#F3F0FF", color: COLOR.TEXT_SECONDARY, label: "학습" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// 아이콘: 사람 실루엣
function PeopleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M1.5 12.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 아이콘: 시계
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// 아이콘: 목록 (질문 수)
function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M5 3.5h6M5 7h6M5 10.5h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="2.5" cy="3.5" r="0.8" fill="currentColor" />
      <circle cx="2.5" cy="7" r="0.8" fill="currentColor" />
      <circle cx="2.5" cy="10.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

// D-Day 배지
function DdayBadge({ endDate }: { endDate: string }) {
  const days = getDaysLeft(endDate);
  if (days === null) {
    return (
      <span
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_2,
          backgroundColor: COLOR.BG_SURFACE,
          color: COLOR.TEXT_DISABLED,
          padding: "3px 8px",
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
        padding: "3px 8px",
        borderRadius: RADIUS.PILL,
        whiteSpace: "nowrap",
      }}
    >
      {days === 0 ? "오늘 마감" : `D-${days}`}
    </span>
  );
}

// 질문 미리보기 목록
function QuestionPreviewList({
  questions,
  size,
}: {
  questions: { type: string; title: string }[];
  size: PanelSize;
}) {
  const limit = size === "md" ? 4 : 3;
  const shown = questions.slice(0, limit);
  const remaining = questions.length - shown.length;

  return (
    <div
      className="question_preview_list_wrap"
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      {shown.map((q, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: RADIUS.SM,
              backgroundColor: QUESTION_TYPE_ICON_BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <QuestionTypeIcon
              type={q.type as QuestionType}
              color={QUESTION_TYPE_COLOR[q.type as QuestionType]}
              size={11}
            />
          </div>
          <span
            className="line-clamp-1"
            style={{
              ...TYPOGRAPHY.STYLE.BODY_2,
              color: COLOR.TEXT_SECONDARY,
              flex: 1,
              paddingTop: "2px",
            }}
          >
            {q.title || "제목 없음"}
          </span>
        </div>
      ))}
      {remaining > 0 && (
        <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED, paddingLeft: "30px" }}>
          외 {remaining}문항 더
        </p>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

type ParticipationState = "loading" | "unparticipated" | "participated" | "closed";

export interface SurveyDetailPanelProps {
  survey: SurveyPreview;
  userId: string | null;
  onClose: () => void;
  size?: PanelSize;
  /** col2에서는 닫기 버튼 행을 보여주고, col3에서는 숨길 수 있음 */
  showCloseButton?: boolean;
}

export function SurveyDetailPanel({
  survey,
  userId,
  onClose,
  size = "md",
  showCloseButton = true,
}: SurveyDetailPanelProps) {
  const router = useRouter();
  const [participationState, setParticipationState] = useState<ParticipationState>("loading");

  const estimatedMins =
    survey.estimated_time && survey.estimated_time > 0
      ? survey.estimated_time
      : Math.max(1, Math.ceil((survey.question_count * 30) / 60));

  const isClosed =
    survey.status === "closed" ||
    survey.status === "archived" ||
    (survey.end_date !== null && getDaysLeft(survey.end_date) === null);

  // survey 변경 시 participationState 즉시 리셋 (이전 설문 상태 잔상 방지)
  useEffect(() => {
    setParticipationState("loading");
  }, [survey.id]);

  useEffect(() => {
    if (isClosed) {
      setParticipationState("closed");
      return;
    }
    if (!userId) {
      setParticipationState("unparticipated");
      return;
    }

    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase
          .from("responses")
          .select("id")
          .eq("survey_id", survey.id)
          .eq("user_id", userId)
          .limit(1);
        setParticipationState(data && data.length > 0 ? "participated" : "unparticipated");
      } catch {
        setParticipationState("unparticipated");
      }
    })();
  }, [survey.id, userId, isClosed]);

  const thumbnailHeight = size === "md" ? 160 : 140;
  const purpose = (survey as SurveyPreview & { purpose?: string }).purpose;
  const purposePlaceholder = purpose ? PURPOSE_PLACEHOLDER[purpose] : undefined;

  // 배지 존재 여부 (빈 행 방지)
  const hasBadge = !!survey.end_date || (!!survey.reward_amount && survey.reward_amount > 0);

  return (
    <div className="survey_detail_panel_wrap" style={{ position: "relative" }}>
      {/* ── 닫기 버튼 행 ──────────────────────────────────────────── */}
      {showCloseButton && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button
            aria-label="닫기"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              padding: "4px", // 터치 영역 보완
              background: "none",
              border: "none",
              cursor: "pointer",
              color: COLOR.TEXT_MUTED,
              borderRadius: RADIUS.MD,
              transition: INTERACTION.TRANSITION_BG,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                INTERACTION.HOVER_BG_SURFACE;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* ── Block A: 썸네일 ───────────────────────────────────────── */}
      <div
        className="overflow-hidden"
        style={{
          width: "100%",
          height: `${thumbnailHeight}px`,
          borderRadius: RADIUS.LG,
          backgroundColor: purposePlaceholder ? purposePlaceholder.bg : COLOR.BG_SURFACE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          flexShrink: 0,
        }}
      >
        {survey.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={survey.thumbnail_url}
            alt={survey.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : purposePlaceholder ? (
          <span
            style={{
              ...TYPOGRAPHY.STYLE.TITLE_2,
              color: purposePlaceholder.color,
              fontWeight: "600",
            }}
          >
            {purposePlaceholder.label}
          </span>
        ) : (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            style={{ color: COLOR.TEXT_DISABLED }}
          >
            <rect
              x="6"
              y="4"
              width="20"
              height="24"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 11h12M10 15h12M10 19h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* ── Block B: 배지 행 ──────────────────────────────────────── */}
      {hasBadge && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          {survey.end_date && <DdayBadge endDate={survey.end_date} />}
          {survey.reward_amount && survey.reward_amount > 0 && (
            <span
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                backgroundColor: COLOR.REWARD_BG,
                color: COLOR.REWARD,
                padding: "3px 8px",
                borderRadius: RADIUS.PILL,
                whiteSpace: "nowrap",
              }}
            >
              {survey.reward_amount.toLocaleString("ko-KR")}P
            </span>
          )}
        </div>
      )}

      {/* ── Block C: 제목 ─────────────────────────────────────────── */}
      <h3
        className="line-clamp-2"
        style={{
          ...TYPOGRAPHY.STYLE.TITLE_1,
          color: COLOR.TEXT_PRIMARY,
          marginBottom: survey.description ? "6px" : "0",
        }}
      >
        {survey.title}
      </h3>

      {/* ── Block D: 설명 ─────────────────────────────────────────── */}
      {survey.description && (
        <p
          className="line-clamp-3"
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            color: COLOR.TEXT_MUTED,
            marginBottom: "0",
          }}
        >
          {survey.description}
        </p>
      )}

      {/* ── Block E-pre: 질문 미리보기 ──────────────────────────────── */}
      {survey.questions && survey.questions.length > 0 && (
        <div style={{ marginTop: survey.description ? "16px" : "12px" }}>
          <p
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_2,
              color: COLOR.TEXT_DISABLED,
              marginBottom: "10px",
            }}
          >
            질문 미리보기
          </p>
          <QuestionPreviewList questions={survey.questions} size={size} />
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${COLOR.BORDER_DEFAULT}`, margin: "16px 0" }} />

      {/* ── Block E: 메타 정보 ────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {/* 소요 시간 */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            ...TYPOGRAPHY.STYLE.LABEL_2,
            color: COLOR.TEXT_MUTED,
          }}
        >
          <ClockIcon />
          <span aria-label={`예상 소요 시간 ${formatMinutes(estimatedMins)}`}>
            {formatMinutes(estimatedMins)}
          </span>
        </span>

        {/* 문항 수 */}
        {survey.question_count > 0 && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              ...TYPOGRAPHY.STYLE.LABEL_2,
              color: COLOR.TEXT_MUTED,
            }}
          >
            <ListIcon />
            <span aria-label={`질문 수 ${survey.question_count}문항`}>
              {survey.question_count}문항
            </span>
          </span>
        )}

        {/* 참여자 수 */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            ...TYPOGRAPHY.STYLE.LABEL_2,
            color: COLOR.TEXT_MUTED,
          }}
        >
          <PeopleIcon />
          <span aria-label={`참여자 수 ${survey.response_count.toLocaleString()}명`}>
            {survey.response_count.toLocaleString()}명 참여
          </span>
        </span>
      </div>

      {/* ── Block F: CTA ──────────────────────────────────────────── */}
      {participationState === "loading" ? (
        <div
          aria-label="참여 여부 확인 중이에요"
          style={{
            height: "48px",
            borderRadius: RADIUS.MD,
            backgroundColor: COLOR.BG_SURFACE,
          }}
        />
      ) : participationState === "closed" ? (
        <div
          role="status"
          aria-label="이 설문은 마감됐어요"
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            fontWeight: "600",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: RADIUS.MD,
            backgroundColor: COLOR.BG_SURFACE,
            color: COLOR.TEXT_DISABLED,
            cursor: "not-allowed",
          }}
        >
          마감된 설문이에요
        </div>
      ) : participationState === "participated" ? (
        <div>
          <p
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_2,
              color: COLOR.TEXT_MUTED,
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            참여를 완료했어요
          </p>
          <button
            onClick={() => router.push(`/survey/${survey.id}/report`)}
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: "600",
              height: "48px",
              width: "100%",
              borderRadius: RADIUS.MD,
              backgroundColor: "transparent",
              border: `1.5px solid ${COLOR.ACCENT}`,
              color: COLOR.ACCENT,
              cursor: "pointer",
              transition: INTERACTION.TRANSITION_BG,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.ACCENT_SUBTLE;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            결과 보기
          </button>
        </div>
      ) : (
        <button
          onClick={() => router.push(`/survey/${survey.id}/respond`)}
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            fontWeight: "600",
            height: "48px",
            width: "100%",
            borderRadius: RADIUS.MD,
            backgroundColor: COLOR.ACCENT,
            color: COLOR.TEXT_INVERSE,
            border: "none",
            cursor: "pointer",
            transition: INTERACTION.TRANSITION_BG,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.ACCENT_HOVER;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.ACCENT;
          }}
        >
          참여하기
        </button>
      )}
    </div>
  );
}
