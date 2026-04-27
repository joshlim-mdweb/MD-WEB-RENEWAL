"use client";

import { useState, useEffect, type FC } from "react";
import { COLOR, SHADOW } from "@/lib/design-tokens";
import { Button } from "@/components/ui";
import type { QuestionType } from "@/lib/types/survey";

export interface AnalysisViewProps {
  surveyId: string;
  surveyStatus: string;
}

// ── Summary types ──────────────────────────────────────────────────────────────

interface AnswerSummary {
  texts?: string[];
  counts?: Record<string, number>;
  values?: number[];
  average?: number;
  rankAverages?: Record<string, number>;
  total: number;
}

interface QuestionSummary {
  id: string;
  title: string;
  type: QuestionType;
  order_index: number;
  options: string[] | null;
  answers: AnswerSummary;
}

// ── Analysis card types ────────────────────────────────────────────────────────

type AnalysisResult = {
  id: string;
  prompt: string;
  sentence: string | null;
  data_point: { label: string; value: number; comparison?: number } | null;
  status: "processing" | "done" | "failed";
  created_at: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// ── Question distribution — compact bar ───────────────────────────────────────

const CompactBar: FC<{ label: string; pct: number; count: number; max: number }> = ({
  label,
  pct,
  count,
  max,
}) => {
  const width = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-xs shrink-0 truncate"
        style={{ color: COLOR.TEXT_MUTED, width: 72 }}
        title={label}
      >
        {label}
      </span>
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: COLOR.BG_BASE }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${width}%`, backgroundColor: COLOR.ACCENT }}
        />
      </div>
      <span
        className="text-xs tabular-nums shrink-0"
        style={{ color: COLOR.TEXT_MUTED, width: 36, textAlign: "right" }}
      >
        {pct}%
      </span>
    </div>
  );
};

// ── Question distribution card ─────────────────────────────────────────────────

const QuestionDistCard: FC<{ q: QuestionSummary; num: number; totalResponses: number }> = ({
  q,
  num,
  totalResponses,
}) => {
  const { type, answers, options } = q;

  // Skip startpoint/endpoint
  if (type === "startpoint" || type === "endpoint") return null;

  function renderBody() {
    switch (type) {
      case "multiple_choice":
      case "checkbox":
      case "dropdown": {
        const opts = options ?? Object.keys(answers.counts ?? {});
        const total = totalResponses > 0 ? totalResponses : answers.total;
        const maxCount = Math.max(...opts.map((o) => answers.counts?.[o] ?? 0), 1);
        return (
          <div className="flex flex-col gap-1.5 mt-2">
            {opts.map((opt) => {
              const count = answers.counts?.[opt] ?? 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return <CompactBar key={opt} label={opt} pct={pct} count={count} max={maxCount} />;
            })}
          </div>
        );
      }

      case "scale":
      case "grade": {
        const avgVal = answers.average;
        const total = answers.total;
        const maxCount = Math.max(
          ...Object.values(answers.counts ?? {}).map((v) => v as number),
          1
        );
        const sortedKeys = Object.keys(answers.counts ?? {}).sort((a, b) => Number(a) - Number(b));
        return (
          <div className="flex flex-col gap-1.5 mt-2">
            {avgVal !== undefined && (
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xl font-bold tabular-nums" style={{ color: COLOR.ACCENT }}>
                  {avgVal.toFixed(1)}
                </span>
                <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
                  / {sortedKeys.at(-1) ?? "—"} 평균
                </span>
                <span className="text-xs ml-1" style={{ color: COLOR.TEXT_DISABLED }}>
                  ({total}명)
                </span>
              </div>
            )}
            {sortedKeys.map((k) => {
              const count = (answers.counts?.[k] ?? 0) as number;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return <CompactBar key={k} label={k} pct={pct} count={count} max={maxCount} />;
            })}
          </div>
        );
      }

      case "short_text":
      case "long_text": {
        const texts = answers.texts ?? [];
        if (texts.length === 0) {
          return (
            <p className="text-xs mt-2" style={{ color: COLOR.TEXT_DISABLED }}>
              응답이 없어요.
            </p>
          );
        }
        return (
          <div className="flex flex-col gap-1.5 mt-2">
            {texts.slice(0, 5).map((t, i) => (
              <div
                key={i}
                className="text-xs px-2.5 py-1.5 rounded-lg"
                style={{
                  backgroundColor: COLOR.BG_BASE,
                  color: COLOR.TEXT_SECONDARY,
                  border: `1px solid ${COLOR.BORDER_DEFAULT}`,
                }}
              >
                {t}
              </div>
            ))}
            {texts.length > 5 && (
              <p className="text-xs" style={{ color: COLOR.TEXT_DISABLED }}>
                외 {texts.length - 5}개
              </p>
            )}
          </div>
        );
      }

      case "ranking": {
        const sorted = Object.entries(answers.rankAverages ?? {}).sort(([, a], [, b]) => a - b);
        return (
          <div className="flex flex-col gap-1 mt-2">
            {sorted.map(([label, avg], i) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="text-xs w-4 text-center font-semibold"
                  style={{ color: COLOR.ACCENT }}
                >
                  {i + 1}
                </span>
                <span className="text-xs flex-1" style={{ color: COLOR.TEXT_SECONDARY }}>
                  {label}
                </span>
                <span className="text-xs tabular-nums" style={{ color: COLOR.TEXT_MUTED }}>
                  평균 {avg.toFixed(1)}위
                </span>
              </div>
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  }

  return (
    <div
      className="question_dist_card_wrap flex flex-col p-3.5 rounded-xl shrink-0"
      style={{
        backgroundColor: COLOR.BG_SURFACE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
      }}
    >
      <div className="flex items-start gap-1.5">
        <span className="text-xs font-semibold shrink-0" style={{ color: COLOR.TEXT_MUTED }}>
          Q{num}
        </span>
        <p
          className="text-xs font-medium leading-tight line-clamp-2"
          style={{ color: COLOR.TEXT_PRIMARY }}
        >
          {q.title || "(제목 없음)"}
        </p>
        <span
          className="text-xs px-1.5 py-0.5 rounded ml-auto shrink-0"
          style={{ backgroundColor: COLOR.BG_BASE, color: COLOR.TEXT_DISABLED }}
        >
          {answers.total}건
        </span>
      </div>
      {renderBody()}
    </div>
  );
};

// ── AI insight card ────────────────────────────────────────────────────────────

const DataBar: FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs shrink-0 w-16 truncate" style={{ color: COLOR.TEXT_MUTED }}>
      {label}
    </span>
    <div
      className="flex-1 h-1.5 rounded-full overflow-hidden"
      style={{ backgroundColor: COLOR.BG_BASE }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
    <span
      className="text-xs font-semibold w-8 text-right shrink-0"
      style={{ color: COLOR.TEXT_PRIMARY }}
    >
      {value}%
    </span>
  </div>
);

const InsightCard: FC<{ result: AnalysisResult }> = ({ result }) => {
  if (result.status === "processing") {
    return (
      <div
        className="insight_card_wrap flex flex-col gap-3 p-4 rounded-xl"
        style={{ backgroundColor: COLOR.BG_SURFACE, border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        <p className="text-xs line-clamp-2" style={{ color: COLOR.TEXT_MUTED }}>
          {result.prompt}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full border-2 animate-spin shrink-0"
            style={{ borderColor: COLOR.ACCENT, borderTopColor: "transparent" }}
          />
          <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
            분석하고 있어요…
          </span>
        </div>
      </div>
    );
  }

  if (result.status === "failed") {
    return (
      <div
        className="insight_card_wrap flex flex-col gap-2 p-4 rounded-xl"
        style={{ backgroundColor: COLOR.NEGATIVE_BG, border: `1px solid ${COLOR.NEGATIVE_LIGHT}` }}
      >
        <p className="text-xs line-clamp-2" style={{ color: COLOR.TEXT_MUTED }}>
          {result.prompt}
        </p>
        <p className="text-xs" style={{ color: COLOR.NEGATIVE }}>
          분석에 실패했어요.
        </p>
      </div>
    );
  }

  return (
    <div
      className="insight_card_wrap flex flex-col gap-3 p-4 rounded-xl"
      style={{
        backgroundColor: COLOR.BG_SURFACE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        boxShadow: SHADOW.CARD,
      }}
    >
      <p className="text-xs line-clamp-2" style={{ color: COLOR.TEXT_MUTED }}>
        {result.prompt}
      </p>

      {result.sentence && (
        <p className="text-sm leading-relaxed font-medium" style={{ color: COLOR.TEXT_PRIMARY }}>
          {result.sentence}
        </p>
      )}

      {result.data_point && (
        <div className="flex flex-col gap-1.5 pt-1">
          <DataBar
            label={result.data_point.label}
            value={result.data_point.value}
            color={COLOR.ACCENT}
          />
          {result.data_point.comparison !== undefined && (
            <DataBar
              label="비교"
              value={result.data_point.comparison}
              color={COLOR.TEXT_DISABLED}
            />
          )}
        </div>
      )}

      <p className="text-xs" style={{ color: COLOR.TEXT_DISABLED }}>
        {formatDate(result.created_at)}
      </p>
    </div>
  );
};

// ── Locked state ───────────────────────────────────────────────────────────────

function LockedState() {
  return (
    <div
      className="analysis_view_wrap flex flex-col items-center justify-center h-full"
      style={{ backgroundColor: COLOR.BG_BASE }}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: COLOR.BG_SURFACE }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            stroke={COLOR.TEXT_MUTED}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="10" width="12" height="10" rx="2" />
            <path d="M8 10V7a3 3 0 0 1 6 0v3" />
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
          설문을 마감한 후 분석을 시작할 수 있어요
        </p>
        <p className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
          마감된 설문의 응답을 분석해 인사이트를 얻어요
        </p>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export function AnalysisView({ surveyId, surveyStatus }: AnalysisViewProps) {
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cards, setCards] = useState<AnalysisResult[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Question distribution state
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [distLoading, setDistLoading] = useState(false);

  // Load question distribution data
  useEffect(() => {
    if (surveyStatus !== "closed") return;
    setDistLoading(true);
    fetch(`/api/surveys/${surveyId}/summary`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          const sorted = (json.questions ?? []).sort(
            (a: QuestionSummary, b: QuestionSummary) => a.order_index - b.order_index
          );
          setQuestions(sorted);
          setTotalResponses(json.summary?.totalResponses ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => setDistLoading(false));
  }, [surveyId, surveyStatus]);

  // Load existing insight cards
  useEffect(() => {
    if (surveyStatus !== "closed") return;
    setCardsLoading(true);
    fetch(`/api/surveys/${surveyId}/analysis?page=1&limit=50`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) setCards(json.data ?? []);
      })
      .catch(() => {})
      .finally(() => setCardsLoading(false));
  }, [surveyId, surveyStatus]);

  if (surveyStatus !== "closed") return <LockedState />;

  const handleSubmit = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || submitting) return;

    const tempId = `temp-${Date.now()}`;
    const tempCard: AnalysisResult = {
      id: tempId,
      prompt: trimmed,
      sentence: null,
      data_point: null,
      status: "processing",
      created_at: new Date().toISOString(),
    };
    setCards((prev) => [tempCard, ...prev]);
    setPrompt("");
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/surveys/${surveyId}/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const json = await res.json();

      if (!res.ok || json.error) {
        setCards((prev) =>
          prev.map((c) => (c.id === tempId ? { ...tempCard, status: "failed" } : c))
        );
        setSubmitError(json.message ?? "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
      } else {
        setCards((prev) => prev.map((c) => (c.id === tempId ? (json as AnalysisResult) : c)));
      }
    } catch {
      setCards((prev) =>
        prev.map((c) => (c.id === tempId ? { ...tempCard, status: "failed" } : c))
      );
      setSubmitError("네트워크 연결을 확인하고 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const visibleQuestions = questions.filter(
    (q) => q.type !== "startpoint" && q.type !== "endpoint"
  );

  return (
    <div
      className="analysis_view_wrap flex flex-col h-full overflow-y-auto"
      style={{ backgroundColor: COLOR.BG_BASE, padding: 24, gap: 24 }}
    >
      {/* ── 1. Question distribution cards ── */}
      <section className="analysis_dist_section flex flex-col gap-3 shrink-0">
        <p className="text-xs font-semibold" style={{ color: COLOR.TEXT_MUTED }}>
          질문별 응답 분포
        </p>

        {distLoading && (
          <p className="text-xs" style={{ color: COLOR.TEXT_DISABLED }}>
            불러오는 중이에요
          </p>
        )}

        {!distLoading && visibleQuestions.length === 0 && (
          <p className="text-xs" style={{ color: COLOR.TEXT_DISABLED }}>
            질문이 없거나 응답 데이터가 없어요
          </p>
        )}

        {!distLoading && visibleQuestions.length > 0 && (
          <div
            className="analysis_dist_grid grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
          >
            {visibleQuestions.map((q, i) => (
              <QuestionDistCard key={q.id} q={q} num={i + 1} totalResponses={totalResponses} />
            ))}
          </div>
        )}
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, backgroundColor: COLOR.BORDER_DEFAULT, flexShrink: 0 }} />

      {/* ── 2. AI insight panel ── */}
      <section className="analysis_ai_section flex flex-col gap-4 shrink-0">
        <p className="text-xs font-semibold" style={{ color: COLOR.TEXT_MUTED }}>
          AI 인과관계 분석
        </p>

        {/* Prompt input */}
        <div
          className="analysis_prompt_area flex flex-col gap-3 p-4 rounded-xl"
          style={{
            backgroundColor: COLOR.BG_SURFACE,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            boxShadow: SHADOW.CARD,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
            어떤 인사이트가 궁금하세요?
          </p>
          <textarea
            className="w-full resize-none text-sm outline-none bg-transparent"
            rows={2}
            placeholder="예: 만족도가 높은 사람이 재구매를 더 선택했나요?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void handleSubmit();
            }}
            style={{
              color: COLOR.TEXT_PRIMARY,
              borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
              paddingBottom: 8,
            }}
          />
          {submitError && (
            <p className="text-xs" style={{ color: COLOR.NEGATIVE }}>
              {submitError}
            </p>
          )}
          <div className="flex justify-end">
            <Button
              variant="solid"
              size="sm"
              loading={submitting}
              disabled={!prompt.trim()}
              onClick={() => void handleSubmit()}
              rightIcon={
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" />
                </svg>
              }
            >
              분석하기
            </Button>
          </div>
        </div>

        {/* Insight cards grid */}
        {cardsLoading && (
          <p className="text-xs text-center py-8" style={{ color: COLOR.TEXT_DISABLED }}>
            불러오는 중이에요
          </p>
        )}

        {!cardsLoading && cards.length === 0 && (
          <div className="flex flex-col items-center gap-1 py-8 text-center">
            <p className="text-xs" style={{ color: COLOR.TEXT_DISABLED }}>
              분석 결과가 없어요. 궁금한 점을 입력해 보세요
            </p>
          </div>
        )}

        {!cardsLoading && cards.length > 0 && (
          <div className="analysis_cards_area grid grid-cols-3 gap-3">
            {cards.map((card) => (
              <InsightCard key={card.id} result={card} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
