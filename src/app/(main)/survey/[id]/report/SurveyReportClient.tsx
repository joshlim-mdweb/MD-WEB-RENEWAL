"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { SurveyStatus, QuestionType } from "@/lib/types/survey";
import { COLOR, TYPOGRAPHY, RADIUS, SHADOW, INTERACTION } from "@/lib/design-tokens";
import { AnalysisPanel } from "@/components/survey/report/AnalysisPanel";

// ─── Data shape ──────────────────────────────────────────────────────────────
// Mirrors the aggregation produced in page.tsx. Kept local to this client
// boundary — not shared with the API route to avoid coupling.

export interface QuestionAnswerSummary {
  id: string;
  title: string;
  type: QuestionType;
  order_index: number;
  options: string[] | null;
  answers: {
    texts?: string[];
    counts?: Record<string, number>;
    values?: number[];
    average?: number;
    rankAverages?: Record<string, number>;
    total: number;
  };
}

export interface ReportData {
  survey: {
    id: string;
    title: string;
    description: string | null;
    status: SurveyStatus;
    created_at: string;
    updated_at: string;
  };
  summary: { totalResponses: number };
  questions: QuestionAnswerSummary[];
}

interface SurveyReportClientProps {
  report: ReportData;
  surveyId: string;
}

// ─── Status badge metadata ────────────────────────────────────────────────────
const STATUS_BADGE: Record<SurveyStatus, { label: string; bg: string; color: string }> = {
  draft: { label: "임시저장", bg: COLOR.BG_SURFACE, color: COLOR.TEXT_MUTED },
  published: { label: "진행 중", bg: "#f0faf5", color: "#046b4c" },
  closed: { label: "완료", bg: "#fff0f0", color: COLOR.NEGATIVE },
  archived: { label: "보관됨", bg: COLOR.BG_SURFACE, color: COLOR.TEXT_MUTED },
};

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Root client component ────────────────────────────────────────────────────

export function SurveyReportClient({ report, surveyId }: SurveyReportClientProps) {
  const { survey, summary, questions } = report;
  const badge = STATUS_BADGE[survey.status];
  const sortedQuestions = [...questions].sort((a, b) => a.order_index - b.order_index);

  // Analysis panel state
  const [activeQuestion, setActiveQuestion] = useState<QuestionAnswerSummary | null>(null);
  const [activeQuestionNumber, setActiveQuestionNumber] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <main
      className="report_wrap min-h-screen px-4 py-12"
      style={{ backgroundColor: COLOR.BG_SURFACE }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ── Report header card ── */}
        <div
          className="report_header_card px-8 py-7"
          style={{
            backgroundColor: COLOR.BG_BASE,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            borderRadius: RADIUS.XL,
            boxShadow: SHADOW.CARD,
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_2,
                  color: COLOR.TEXT_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "4px",
                }}
              >
                응답 현황
              </p>
              <h1
                style={{
                  ...TYPOGRAPHY.STYLE.TITLE_1,
                  color: COLOR.TEXT_PRIMARY,
                  lineHeight: "1.4",
                }}
              >
                {survey.title || "제목 없음"}
              </h1>
              {survey.description && (
                <p
                  style={{
                    ...TYPOGRAPHY.STYLE.BODY_2,
                    color: COLOR.TEXT_MUTED,
                    marginTop: "6px",
                    lineHeight: "1.6",
                  }}
                >
                  {survey.description}
                </p>
              )}
            </div>
            <span
              className="flex-shrink-0 px-2.5 py-1 rounded-full"
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                fontWeight: "600",
                backgroundColor: badge.bg,
                color: badge.color,
                whiteSpace: "nowrap",
              }}
            >
              {badge.label}
            </span>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-4"
            style={{
              borderTop: `1px solid ${COLOR.BORDER_DEFAULT}`,
              ...TYPOGRAPHY.STYLE.BODY_2,
              color: COLOR.TEXT_MUTED,
            }}
          >
            <span>
              총{" "}
              <strong style={{ fontWeight: "600", color: COLOR.TEXT_PRIMARY }}>
                {summary.totalResponses.toLocaleString()}
              </strong>
              명 참여
            </span>
            <span>생성일: {formatDate(survey.created_at)}</span>
          </div>
        </div>

        {/* ── No-response state ── */}
        {summary.totalResponses === 0 && (
          <div
            className="px-8 py-16 text-center"
            style={{
              backgroundColor: COLOR.BG_BASE,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.XL,
              boxShadow: SHADOW.CARD,
            }}
          >
            <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              아직 응답이 없어요.
            </p>
            {survey.status === "published" && (
              <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED, marginTop: "4px" }}>
                설문 링크를 공유하면 응답을 받을 수 있어요.
              </p>
            )}
          </div>
        )}

        {/* ── Question result cards ── */}
        {summary.totalResponses > 0 &&
          sortedQuestions.map((question, index) => (
            <QuestionResultCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              isAnalyzing={activeQuestion?.id === question.id}
              onAnalyze={(q, num, ref) => {
                triggerRef.current = ref;
                setActiveQuestion(q);
                setActiveQuestionNumber(num);
              }}
            />
          ))}

        {/* ── Back link ── */}
        <div
          className="pt-2 pb-4 pb-safe"
          style={{ paddingBottom: activeQuestion ? "60vh" : undefined }}
        >
          <Link
            href="/my"
            style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}
            className="hover:underline transition-colors"
          >
            내 설문 목록으로 가기
          </Link>
        </div>
      </div>

      {/* ── Analysis panel ── */}
      <AnalysisPanel
        surveyId={surveyId}
        question={activeQuestion}
        questionNumber={activeQuestionNumber}
        allQuestions={sortedQuestions}
        triggerRef={triggerRef}
        onClose={() => setActiveQuestion(null)}
      />
    </main>
  );
}

// ─── Question result card dispatcher ─────────────────────────────────────────

const UNANALYZABLE_TYPES = new Set(["endpoint", "short_text", "long_text"]);

function QuestionResultCard({
  question,
  questionNumber,
  isAnalyzing,
  onAnalyze,
}: {
  question: QuestionAnswerSummary;
  questionNumber: number;
  isAnalyzing: boolean;
  onAnalyze: (q: QuestionAnswerSummary, num: number, ref: HTMLButtonElement) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const canAnalyze = !UNANALYZABLE_TYPES.has(question.type);

  return (
    <article
      className="question_card_wrap px-8 py-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: COLOR.BG_BASE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        boxShadow: SHADOW.CARD,
        position: "relative",
      }}
    >
      {/* Question header */}
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_2,
              color: COLOR.TEXT_MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Q{questionNumber}
          </span>
          <h2
            style={{
              ...TYPOGRAPHY.STYLE.BODY_2,
              fontWeight: "600",
              color: COLOR.TEXT_PRIMARY,
              lineHeight: "1.4",
              marginTop: "2px",
            }}
          >
            {question.title}
          </h2>
          <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED, marginTop: "2px" }}>
            응답 {question.answers.total.toLocaleString()}건
          </p>
        </div>

        {/* 분석하기 button — shown on hover or when analyzing */}
        {canAnalyze && (
          <button
            ref={btnRef}
            type="button"
            aria-label={`Q${questionNumber}. ${question.title} 분석하기`}
            onClick={() => btnRef.current && onAnalyze(question, questionNumber, btnRef.current)}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg transition-all"
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_2,
              opacity: hovered || isAnalyzing ? 1 : 0,
              pointerEvents: hovered || isAnalyzing ? "auto" : "none",
              backgroundColor: isAnalyzing ? COLOR.ACCENT_SUBTLE : INTERACTION.HOVER_BG,
              color: isAnalyzing ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
              fontWeight: isAnalyzing ? "600" : "500",
              transition: `opacity 150ms, background-color ${INTERACTION.TRANSITION_BG}`,
              // Always visible for keyboard navigation
              ...(hovered || isAnalyzing ? {} : { "&:focus-visible": { opacity: 1 } }),
            }}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
          >
            분석하기
          </button>
        )}
      </header>

      {/* Delegate to per-type renderer */}
      <QuestionResultBody question={question} />
    </article>
  );
}

// ─── Per-type result renderers ────────────────────────────────────────────────

function QuestionResultBody({ question }: { question: QuestionAnswerSummary }) {
  const { type, answers, options } = question;

  switch (type) {
    case "short_text":
    case "long_text":
      return <TextAnswerList texts={answers.texts ?? []} />;

    case "multiple_choice":
    case "dropdown":
    case "checkbox":
      return (
        <ChoiceBarChart
          options={options ?? []}
          counts={answers.counts ?? {}}
          total={answers.total}
        />
      );

    case "scale":
      return (
        <ScaleResult
          average={answers.average ?? null}
          values={answers.values ?? []}
          counts={answers.counts ?? {}}
          total={answers.total}
          // scale max defaults to 10 — the actual min/max is not stored in the
          // aggregation shape, so we infer the range from the answer keys
        />
      );

    case "grade":
      return (
        <GradeResult
          average={answers.average ?? null}
          counts={answers.counts ?? {}}
          total={answers.total}
          options={options}
        />
      );

    case "ranking":
      return <RankingResult rankAverages={answers.rankAverages ?? {}} options={options ?? []} />;

    case "startpoint":
      return null;

    case "endpoint":
      return <EndpointResult />;

    default: {
      // Exhaustiveness guard — surfaces unknown types in dev
      const _exhaustive: never = type;
      return <p className="text-xs text-red-400">알 수 없는 질문 유형: {_exhaustive}</p>;
    }
  }
}

// ─── Text answers (short_text / long_text) ────────────────────────────────────

const TEXT_PREVIEW_LIMIT = 10;

function TextAnswerList({ texts }: { texts: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (texts.length === 0) {
    return <EmptyAnswers />;
  }

  const visibleTexts = isExpanded ? texts : texts.slice(0, TEXT_PREVIEW_LIMIT);
  const hasMore = texts.length > TEXT_PREVIEW_LIMIT;
  const remainingCount = texts.length - TEXT_PREVIEW_LIMIT;

  return (
    <div className="space-y-2">
      <ul className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
        {visibleTexts.map((text, i) => (
          <li
            key={i}
            className="px-3 py-2.5 rounded-lg"
            style={{
              ...TYPOGRAPHY.STYLE.BODY_2,
              color: COLOR.TEXT_PRIMARY,
              backgroundColor: COLOR.BG_SURFACE,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              lineHeight: "1.6",
            }}
          >
            {text}
          </li>
        ))}
      </ul>
      {hasMore && !isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.ACCENT }}
          className="hover:underline mt-1"
        >
          {remainingCount}개 더 보기
        </button>
      )}
    </div>
  );
}

// ─── Choice bar chart (multiple_choice / dropdown / checkbox) ────────────────

function ChoiceBarChart({
  options,
  counts,
  total,
}: {
  options: string[];
  counts: Record<string, number>;
  total: number;
}) {
  if (options.length === 0 || total === 0) {
    return <EmptyAnswers />;
  }

  // Sort options by count descending for clearer visual hierarchy
  const sortedOptions = [...options].sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0));

  return (
    <ul className="space-y-3">
      {sortedOptions.map((optionLabel) => {
        const count = counts[optionLabel] ?? 0;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <li key={optionLabel}>
            <div className="flex items-center justify-between mb-1">
              <span
                className="truncate mr-2"
                style={{ ...TYPOGRAPHY.STYLE.BODY_2, fontWeight: "500", color: COLOR.TEXT_PRIMARY }}
              >
                {optionLabel}
              </span>
              <span
                className="flex-shrink-0 tabular-nums"
                style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
              >
                {count.toLocaleString()}명 ({percentage}%)
              </span>
            </div>
            {/* Pure CSS bar — no chart library */}
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: COLOR.BORDER_DEFAULT }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: COLOR.ACCENT }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Scale result ─────────────────────────────────────────────────────────────

function ScaleResult({
  average,
  counts,
  total,
}: {
  average: number | null;
  values: number[];
  counts: Record<string, number>;
  total: number;
}) {
  // Derive the range from the keys present in counts
  const numericKeys = Object.keys(counts)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  const scaleMax = numericKeys.length > 0 ? Math.max(...numericKeys) : 10;

  if (total === 0 || average === null) {
    return <EmptyAnswers />;
  }

  return (
    <div className="space-y-5">
      {/* Average score prominence */}
      <div className="flex items-baseline gap-1.5">
        <span
          className="tabular-nums"
          style={{ ...TYPOGRAPHY.STYLE.DISPLAY, color: COLOR.TEXT_PRIMARY }}
        >
          {average.toFixed(1)}
        </span>
        <span style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>/ {scaleMax}</span>
        <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED, marginLeft: "8px" }}>
          평균
        </span>
      </div>

      {/* Frequency bar chart per value */}
      <ul className="space-y-2">
        {numericKeys.map((value) => {
          const count = counts[String(value)] ?? 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <li key={value} className="flex items-center gap-3">
              <span
                className="w-6 text-right tabular-nums flex-shrink-0"
                style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
              >
                {value}
              </span>
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: COLOR.BORDER_DEFAULT }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: COLOR.ACCENT }}
                />
              </div>
              <span
                className="w-10 tabular-nums"
                style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
              >
                {count}명
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Grade (star) result ──────────────────────────────────────────────────────

function GradeResult({
  average,
  counts,
  total,
  options,
}: {
  average: number | null;
  counts: Record<string, number>;
  total: number;
  options: string[] | null;
}) {
  // Grade labels come from options (config.grades). Fall back to numeric keys.
  const gradeLabels =
    options && options.length > 0
      ? options
      : Object.keys(counts).sort((a, b) => Number(a) - Number(b));

  const gradeMax = gradeLabels.length;

  if (total === 0 || average === null) {
    return <EmptyAnswers />;
  }

  const STAR_COLOR = COLOR.STAR;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-1.5">
        <span className="tabular-nums" style={{ ...TYPOGRAPHY.STYLE.DISPLAY, color: STAR_COLOR }}>
          {average.toFixed(1)}
        </span>
        <span style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>/ {gradeMax}</span>
        <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED, marginLeft: "8px" }}>
          평균
        </span>
      </div>

      <ul className="space-y-2">
        {Array.from({ length: gradeMax }, (_, i) => {
          const key = String(i + 1);
          const count = counts[key] ?? 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          const label = gradeLabels[i] ?? key;
          return (
            <li key={key} className="flex items-center gap-3">
              <span
                className="w-16 truncate flex-shrink-0"
                style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
              >
                {label}
              </span>
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: COLOR.BORDER_DEFAULT }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: STAR_COLOR }}
                />
              </div>
              <span
                className="w-10 tabular-nums"
                style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
              >
                {count}명
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Ranking result ───────────────────────────────────────────────────────────
// Options are sorted by rankAverages ascending — lower average rank = ranked higher
// by respondents (rank 1 = best, so lower average is better).

function RankingResult({
  rankAverages,
  options,
}: {
  rankAverages: Record<string, number>;
  options: string[];
}) {
  if (options.length === 0 || Object.keys(rankAverages).length === 0) {
    return <EmptyAnswers />;
  }

  const sortedOptions = [...options].sort(
    (a, b) => (rankAverages[a] ?? Infinity) - (rankAverages[b] ?? Infinity)
  );

  return (
    <ul className="space-y-2">
      {sortedOptions.map((optionLabel, index) => {
        const avg = rankAverages[optionLabel];
        return (
          <li
            key={optionLabel}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                fontWeight: "700",
                backgroundColor: COLOR.BORDER_DEFAULT,
                color: COLOR.TEXT_MUTED,
              }}
            >
              {index + 1}
            </span>
            <span
              className="flex-1"
              style={{ ...TYPOGRAPHY.STYLE.BODY_2, fontWeight: "500", color: COLOR.TEXT_PRIMARY }}
            >
              {optionLabel}
            </span>
            {avg !== undefined && (
              <span
                className="tabular-nums"
                style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
              >
                평균 {avg.toFixed(1)}위
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ─── Endpoint display ─────────────────────────────────────────────────────────

function EndpointResult() {
  return (
    <p className="italic" style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
      아직 응답이 없어요
    </p>
  );
}

// ─── Shared empty state ───────────────────────────────────────────────────────

function EmptyAnswers() {
  return <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>아직 응답이 없어요</p>;
}
