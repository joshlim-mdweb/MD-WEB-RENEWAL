"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { COLOR, TYPOGRAPHY, RADIUS, SHADOW } from "@/lib/design-tokens";
import { AnalysisBarChart, type DistributionItem } from "./AnalysisBarChart";
import type { QuestionAnswerSummary } from "@/app/(main)/survey/[id]/report/SurveyReportClient";

// ── Types ─────────────────────────────────────────────────────────────────────

type AnalysisTab = "distribution" | "cross";

interface AnalyzeApiResponse {
  question: { id: string; title: string; type: string; options: unknown };
  filter_applied: boolean;
  filter_info?: {
    question_title: string;
    answer_value: string;
    matched_count: number;
  };
  total_responses: number;
  distribution: DistributionItem[];
  insufficient_data: boolean;
}

interface AnalysisPanelProps {
  surveyId: string;
  question: QuestionAnswerSummary | null; // null = closed
  questionNumber: number;
  allQuestions: QuestionAnswerSummary[];
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

// Question types that support analysis
const ANALYZABLE_TYPES = new Set([
  "multiple_choice",
  "dropdown",
  "checkbox",
  "scale",
  "grade",
  "ranking",
]);

// ── Main component ────────────────────────────────────────────────────────────

export function AnalysisPanel({
  surveyId,
  question,
  questionNumber,
  allQuestions,
  triggerRef,
  onClose,
}: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>("distribution");
  const [isVisible, setIsVisible] = useState(false);

  // Distribution tab state
  const [distData, setDistData] = useState<AnalyzeApiResponse | null>(null);
  const [distLoading, setDistLoading] = useState(false);
  const [distError, setDistError] = useState(false);

  // Cross-analysis tab state
  const [filterQuestionId, setFilterQuestionId] = useState<string>("");
  const [filterAnswer, setFilterAnswer] = useState<string>("");
  const [crossData, setCrossData] = useState<AnalyzeApiResponse | null>(null);
  const [crossLoading, setCrossLoading] = useState(false);
  const [crossError, setCrossError] = useState(false);
  const [baseDistData, setBaseDistData] = useState<DistributionItem[]>([]);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prevQuestionIdRef = useRef<string | null>(null);

  // ── Visibility animation ──────────────────────────────────────────────────

  useEffect(() => {
    if (question) {
      // Slight delay so transform transition is visible
      const t = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
    }
  }, [question]);

  // ── Fetch distribution when question changes ──────────────────────────────

  const fetchDistribution = useCallback(
    async (qId: string) => {
      setDistLoading(true);
      setDistError(false);
      setDistData(null);
      try {
        const res = await fetch(
          `/api/surveys/${surveyId}/analyze?question_id=${encodeURIComponent(qId)}`
        );
        if (!res.ok) throw new Error("fetch failed");
        const data: AnalyzeApiResponse = await res.json();
        setDistData(data);
        setBaseDistData(data.distribution);
      } catch {
        setDistError(true);
      } finally {
        setDistLoading(false);
      }
    },
    [surveyId]
  );

  useEffect(() => {
    if (!question) return;

    // If question changed, reset cross-analysis tab and reload distribution
    if (prevQuestionIdRef.current !== question.id) {
      prevQuestionIdRef.current = question.id;
      setActiveTab("distribution");
      setFilterQuestionId("");
      setFilterAnswer("");
      setCrossData(null);
      setCrossError(false);
      fetchDistribution(question.id);
    }
  }, [question, fetchDistribution]);

  // ── Cross-analysis fetch when both dropdowns selected ────────────────────

  useEffect(() => {
    if (!question || !filterQuestionId || !filterAnswer) return;

    const run = async () => {
      setCrossLoading(true);
      setCrossError(false);
      try {
        const params = new URLSearchParams({
          question_id: question.id,
          filter_question_id: filterQuestionId,
          filter_answer: filterAnswer,
        });
        const res = await fetch(`/api/surveys/${surveyId}/analyze?${params}`);
        if (!res.ok) throw new Error("fetch failed");
        const data: AnalyzeApiResponse = await res.json();
        setCrossData(data);
      } catch {
        setCrossError(true);
      } finally {
        setCrossLoading(false);
      }
    };

    run();
  }, [question, surveyId, filterQuestionId, filterAnswer]);

  // ── Focus management ──────────────────────────────────────────────────────

  useEffect(() => {
    if (isVisible && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      // Return focus to the trigger button
      triggerRef.current?.focus();
    }, 250);
  }, [onClose, triggerRef]);

  // ── ESC key ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  // ── Focus trap ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isVisible || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableSelectors =
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelectors));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [isVisible]);

  // ── Derived state ─────────────────────────────────────────────────────────

  // Questions available as filter (exclude current question, unsupported types)
  const filterableQuestions = allQuestions.filter(
    (q) => q.id !== question?.id && ANALYZABLE_TYPES.has(q.type)
  );

  const selectedFilterQuestion = allQuestions.find((q) => q.id === filterQuestionId);
  const filterAnswerOptions: string[] = selectedFilterQuestion?.options ?? [];

  // Panel height: wider when cross tab active and condition set
  const panelHeight = activeTab === "cross" && filterQuestionId ? "70vh" : "55vh";

  if (!question) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Q${questionNumber}. ${question.title} 분석`}
      className="analysis_panel_wrap"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: panelHeight,
        maxHeight: "85vh",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLOR.BG_BASE,
        borderTop: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: `${RADIUS.XL} ${RADIUS.XL} 0 0`,
        boxShadow: SHADOW.MODAL,
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
        transition: isVisible
          ? "transform 300ms cubic-bezier(0.32, 0.72, 0, 1), height 200ms ease"
          : "transform 250ms ease-in, height 200ms ease",
        overflow: "hidden",
      }}
    >
      {/* ── Panel header ── */}
      <div
        className="analysis_panel_header flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        <div className="min-w-0">
          <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED, marginBottom: "2px" }}>
            Q{questionNumber}
          </p>
          <h2
            className="truncate"
            style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}
          >
            {question.title}
          </h2>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="분석 패널 닫기"
          onClick={handleClose}
          className="flex-shrink-0 ml-3 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ color: COLOR.TEXT_MUTED }}
        >
          ✕
        </button>
      </div>

      {/* ── Tabs ── */}
      <div
        className="flex px-6 gap-1 flex-shrink-0"
        style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        {(["distribution", "cross"] as AnalysisTab[]).map((tab) => {
          const label = tab === "distribution" ? "전체 분포" : "교차 분석";
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="py-3 px-1 mr-3"
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_1,
                color: isActive ? COLOR.ACCENT : COLOR.TEXT_MUTED,
                borderBottom: isActive ? `2px solid ${COLOR.ACCENT}` : "2px solid transparent",
                fontWeight: isActive ? "600" : "500",
                transition: "color 150ms, border-color 150ms",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content (scrollable) ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {activeTab === "distribution" ? (
          <DistributionTab
            loading={distLoading}
            error={distError}
            data={distData}
            onRetry={() => fetchDistribution(question.id)}
          />
        ) : (
          <CrossTab
            question={question}
            filterableQuestions={filterableQuestions}
            filterQuestionId={filterQuestionId}
            filterAnswer={filterAnswer}
            filterAnswerOptions={filterAnswerOptions}
            onFilterQuestionChange={(id) => {
              setFilterQuestionId(id);
              setFilterAnswer("");
              setCrossData(null);
            }}
            onFilterAnswerChange={setFilterAnswer}
            loading={crossLoading}
            error={crossError}
            data={crossData}
            baseDistribution={baseDistData}
            onRetry={() => {
              if (filterQuestionId && filterAnswer) {
                // re-trigger by toggling
                const saved = filterAnswer;
                setFilterAnswer("");
                setTimeout(() => setFilterAnswer(saved), 0);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

// ── Distribution tab ──────────────────────────────────────────────────────────

function DistributionTab({
  loading,
  error,
  data,
  onRetry,
}: {
  loading: boolean;
  error: boolean;
  data: AnalyzeApiResponse | null;
  onRetry: () => void;
}) {
  if (loading) return <BarSkeleton />;

  if (error) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <p
        role="status"
        aria-live="polite"
        style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}
      >
        전체 응답 분포 · {data.total_responses.toLocaleString()}명 응답
      </p>

      {/* Small sample warning */}
      {data.insufficient_data && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "#fef3c7" }}
        >
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: "#92400e" }}>
            응답이 적어 참고용으로만 활용해요
          </span>
        </div>
      )}

      <AnalysisBarChart distribution={data.distribution} />
    </div>
  );
}

// ── Cross-analysis tab ────────────────────────────────────────────────────────

function CrossTab({
  question,
  filterableQuestions,
  filterQuestionId,
  filterAnswer,
  filterAnswerOptions,
  onFilterQuestionChange,
  onFilterAnswerChange,
  loading,
  error,
  data,
  baseDistribution,
  onRetry,
}: {
  question: QuestionAnswerSummary;
  filterableQuestions: QuestionAnswerSummary[];
  filterQuestionId: string;
  filterAnswer: string;
  filterAnswerOptions: string[];
  onFilterQuestionChange: (id: string) => void;
  onFilterAnswerChange: (v: string) => void;
  loading: boolean;
  error: boolean;
  data: AnalyzeApiResponse | null;
  baseDistribution: DistributionItem[];
  onRetry: () => void;
}) {
  if (filterableQuestions.length === 0) {
    return (
      <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
        조건으로 사용할 다른 질문이 없어요.
      </p>
    );
  }

  const conditionComplete = !!(filterQuestionId && filterAnswer);

  return (
    <div className="space-y-5">
      {/* Builder */}
      <div
        className="p-4 rounded-xl space-y-3"
        style={{ backgroundColor: COLOR.BG_SURFACE, border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter question dropdown */}
          <select
            aria-label="조건 질문 선택"
            value={filterQuestionId}
            onChange={(e) => onFilterQuestionChange(e.target.value)}
            disabled={loading}
            className="px-3 py-2 rounded-lg"
            style={{
              ...TYPOGRAPHY.STYLE.BODY_2,
              color: filterQuestionId ? COLOR.TEXT_PRIMARY : COLOR.TEXT_MUTED,
              backgroundColor: COLOR.BG_BASE,
              border: `1px solid ${COLOR.BORDER_INPUT}`,
              borderRadius: RADIUS.MD,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <option value="">질문을 선택해 주세요</option>
            {filterableQuestions.map((q, idx) => (
              <option key={q.id} value={q.id}>
                Q{idx + 1}. {q.title}
              </option>
            ))}
          </select>

          {filterQuestionId && (
            <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>에서</span>
          )}

          {/* Filter answer dropdown */}
          {filterQuestionId && (
            <select
              aria-label="조건 답변 선택"
              value={filterAnswer}
              onChange={(e) => onFilterAnswerChange(e.target.value)}
              disabled={loading || filterAnswerOptions.length === 0}
              className="px-3 py-2 rounded-lg"
              style={{
                ...TYPOGRAPHY.STYLE.BODY_2,
                color: filterAnswer ? COLOR.TEXT_PRIMARY : COLOR.TEXT_MUTED,
                backgroundColor: COLOR.BG_BASE,
                border: `1px solid ${COLOR.BORDER_INPUT}`,
                borderRadius: RADIUS.MD,
                cursor: loading || filterAnswerOptions.length === 0 ? "not-allowed" : "pointer",
                opacity: filterAnswerOptions.length === 0 ? 0.5 : 1,
              }}
            >
              <option value="">답변을 선택해 주세요</option>
              {filterAnswerOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {conditionComplete && (
            <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              라고 한 응답자 중
            </span>
          )}
        </div>

        {conditionComplete && (
          <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            <strong style={{ color: COLOR.TEXT_PRIMARY }}>{question.title}</strong>에서 어떻게
            답했는지 비교해요
          </p>
        )}

        {!filterQuestionId && (
          <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            답변을 선택하면 바로 결과를 보여줘요
          </p>
        )}

        {/* Reset */}
        {filterQuestionId && (
          <button
            type="button"
            onClick={() => {
              onFilterQuestionChange("");
              onFilterAnswerChange("");
            }}
            style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
            className="hover:underline"
          >
            조건 없애기
          </button>
        )}
      </div>

      {/* Results */}
      {loading && <BarSkeleton />}

      {error && !loading && <ErrorState onRetry={onRetry} />}

      {!loading && !error && data && conditionComplete && (
        <div className="space-y-4">
          {/* Respondent count summary */}
          <p
            role="status"
            aria-live="polite"
            style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}
          >
            전체{" "}
            <strong style={{ color: COLOR.TEXT_PRIMARY }}>
              {data.total_responses.toLocaleString()}명
            </strong>{" "}
            중{" "}
            <strong style={{ color: COLOR.ACCENT }}>
              {data.filter_info?.matched_count.toLocaleString() ?? 0}명
            </strong>{" "}
            (
            {data.total_responses > 0
              ? Math.round(((data.filter_info?.matched_count ?? 0) / data.total_responses) * 100)
              : 0}
            %)이 이 조건에 해당해요
          </p>

          {/* Small sample warning */}
          {data.insufficient_data && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#fef3c7" }}
            >
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: "#92400e" }}>
                응답이 적어 참고용으로만 활용해요
              </span>
            </div>
          )}

          {/* Empty result */}
          {data.distribution.length === 0 ? (
            <div className="py-8 text-center">
              <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
                이 조건에 해당하는 응답이 없어요.
              </p>
              <p
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_2,
                  color: COLOR.TEXT_MUTED,
                  marginTop: "4px",
                }}
              >
                다른 조건으로 다시 시도해 보세요.
              </p>
            </div>
          ) : (
            <AnalysisBarChart
              distribution={data.distribution}
              baseDistribution={baseDistribution}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function BarSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-live="polite"
      aria-label="응답 데이터를 불러오는 중이에요"
    >
      {[60, 40, 25].map((w) => (
        <div key={w} className="space-y-2">
          <div
            className="h-3 rounded animate-pulse"
            style={{ width: `${w}%`, backgroundColor: COLOR.BG_SECTION }}
          />
          <div
            className="h-2 rounded-full animate-pulse"
            style={{ width: "100%", backgroundColor: COLOR.BG_SECTION }}
          />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-6 text-center space-y-3">
      <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
        일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 rounded-lg"
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_1,
          color: COLOR.ACCENT,
          backgroundColor: COLOR.ACCENT_SUBTLE,
        }}
      >
        다시 시도하기
      </button>
    </div>
  );
}
