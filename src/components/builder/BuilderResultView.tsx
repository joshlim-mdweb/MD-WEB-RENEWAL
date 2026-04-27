"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuestionType } from "@/lib/types/survey";
import { COLOR } from "@/lib/design-tokens";
import {
  AnalysisBarChart,
  type DistributionItem,
} from "@/components/survey/report/AnalysisBarChart";

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface SurveyInfo {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SummaryResponse {
  survey: SurveyInfo;
  summary: { totalResponses: number };
  questions: QuestionSummary[];
}

interface QuestionMeta {
  id: string;
  title: string;
  type: string;
  order_index: number;
}

interface AnswerDisplay {
  question_title: string;
  question_type: string;
  value: unknown;
  display: string;
}

interface ResponseRow {
  response_id: string;
  submitted_at: string;
  duration_seconds: number | null;
  answers: Record<string, AnswerDisplay>;
}

interface TableResponse {
  data: ResponseRow[];
  questions: QuestionMeta[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ─── Type labels ──────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<QuestionType, string> = {
  short_text: "단답형",
  long_text: "장문형",
  multiple_choice: "객관식",
  checkbox: "체크박스",
  dropdown: "드롭다운",
  scale: "선형 척도",
  grade: "별점",
  ranking: "순위",
  startpoint: "시작",
  endpoint: "마무리",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSubmittedAt(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-5"
          style={{ backgroundColor: "white", border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          <div
            className="h-3 rounded-lg animate-pulse mb-3 w-1/3"
            style={{ backgroundColor: COLOR.BG_SECTION }}
          />
          <div
            className="h-2 rounded-lg animate-pulse mb-2 w-2/3"
            style={{ backgroundColor: COLOR.BG_SECTION }}
          />
          <div
            className="h-2 rounded-lg animate-pulse mb-2 w-1/2"
            style={{ backgroundColor: COLOR.BG_SECTION }}
          />
          <div
            className="h-2 rounded-lg animate-pulse w-3/4"
            style={{ backgroundColor: COLOR.BG_SECTION }}
          />
        </div>
      ))}
    </div>
  );
}

function TypeBadge({ type }: { type: QuestionType }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ backgroundColor: COLOR.BG_SECTION, color: COLOR.TEXT_MUTED }}
    >
      {TYPE_LABELS[type] ?? type}
    </span>
  );
}

// ─── Graph renderers ──────────────────────────────────────────────────────────

function TextAnswerListCompact({ texts }: { texts: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 5;

  if (texts.length === 0) {
    return (
      <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
        응답이 없어요.
      </p>
    );
  }

  const visible = expanded ? texts : texts.slice(0, LIMIT);
  const remaining = texts.length - LIMIT;

  return (
    <div className="space-y-1.5">
      {visible.map((text, i) => (
        <div
          key={i}
          className="px-3 py-2 rounded-lg text-sm"
          style={{
            backgroundColor: COLOR.BG_SURFACE,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            color: COLOR.TEXT_PRIMARY,
            lineHeight: "1.5",
          }}
        >
          {text}
        </div>
      ))}
      {!expanded && remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-xs mt-1"
          style={{ color: COLOR.ACCENT }}
        >
          {remaining}개 더 보기
        </button>
      )}
    </div>
  );
}

function ChoiceGraphView({
  options,
  counts,
  total,
}: {
  options: string[];
  counts: Record<string, number>;
  total: number;
}) {
  if (total === 0 || options.length === 0) {
    return (
      <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
        응답이 없어요.
      </p>
    );
  }

  const distribution: DistributionItem[] = options
    .map((value) => {
      const count = counts[value] ?? 0;
      return {
        value,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  return <AnalysisBarChart distribution={distribution} />;
}

function ScaleGraphView({
  counts,
  average,
  total,
}: {
  counts: Record<string, number>;
  average: number | undefined;
  total: number;
}) {
  if (total === 0) {
    return (
      <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
        응답이 없어요.
      </p>
    );
  }

  const distribution: DistributionItem[] = Object.entries(counts)
    .map(([value, count]) => ({
      value,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
    }))
    .sort((a, b) => Number(a.value) - Number(b.value));

  return (
    <div className="space-y-3">
      {average !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tabular-nums" style={{ color: COLOR.ACCENT }}>
            {average.toFixed(1)}
          </span>
          <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
            평균
          </span>
        </div>
      )}
      <AnalysisBarChart distribution={distribution} />
    </div>
  );
}

function GradeGraphView({
  counts,
  average,
  total,
  options,
}: {
  counts: Record<string, number>;
  average: number | undefined;
  total: number;
  options: string[] | null;
}) {
  if (total === 0) {
    return (
      <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
        응답이 없어요.
      </p>
    );
  }

  const gradeLabels =
    options && options.length > 0
      ? options
      : Object.keys(counts).sort((a, b) => Number(a) - Number(b));

  const distribution: DistributionItem[] = gradeLabels.map((label, i) => {
    const key = String(i + 1);
    const count = counts[key] ?? 0;
    return {
      value: label,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
    };
  });

  return (
    <div className="space-y-3">
      {average !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tabular-nums" style={{ color: COLOR.STAR }}>
            {average.toFixed(1)}
          </span>
          <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
            평균
          </span>
        </div>
      )}
      <AnalysisBarChart distribution={distribution} />
    </div>
  );
}

function RankingGraphView({
  rankAverages,
  options,
}: {
  rankAverages: Record<string, number>;
  options: string[] | null;
}) {
  const optionList = options ?? Object.keys(rankAverages);

  if (optionList.length === 0 || Object.keys(rankAverages).length === 0) {
    return (
      <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
        응답이 없어요.
      </p>
    );
  }

  const sorted = [...optionList].sort(
    (a, b) => (rankAverages[a] ?? Infinity) - (rankAverages[b] ?? Infinity)
  );

  return (
    <ul className="space-y-2">
      {sorted.map((label, idx) => {
        const avg = rankAverages[label];
        return (
          <li
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
              style={{ backgroundColor: COLOR.BORDER_DEFAULT, color: COLOR.TEXT_MUTED }}
            >
              {idx + 1}
            </span>
            <span className="flex-1 text-sm" style={{ color: COLOR.TEXT_PRIMARY }}>
              {label}
            </span>
            {avg !== undefined && (
              <span className="text-xs tabular-nums" style={{ color: COLOR.TEXT_MUTED }}>
                평균 {avg.toFixed(1)}위
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ─── Question graph card ──────────────────────────────────────────────────────

function QuestionGraphCard({
  question,
  number,
  totalResponses,
}: {
  question: QuestionSummary;
  number: number;
  totalResponses: number;
}) {
  const { type, answers, options } = question;

  function renderBody() {
    switch (type) {
      case "short_text":
      case "long_text":
        return <TextAnswerListCompact texts={answers.texts ?? []} />;

      case "multiple_choice":
      case "dropdown":
      case "checkbox":
        return (
          <ChoiceGraphView
            options={options ?? []}
            counts={answers.counts ?? {}}
            total={totalResponses}
          />
        );

      case "scale":
        return (
          <ScaleGraphView
            counts={answers.counts ?? {}}
            average={answers.average}
            total={answers.total}
          />
        );

      case "grade":
        return (
          <GradeGraphView
            counts={answers.counts ?? {}}
            average={answers.average}
            total={answers.total}
            options={options}
          />
        );

      case "ranking":
        return <RankingGraphView rankAverages={answers.rankAverages ?? {}} options={options} />;

      case "startpoint":
      case "endpoint":
        return null;

      default: {
        const _exhaustive: never = type;
        return (
          <p className="text-xs" style={{ color: COLOR.NEGATIVE }}>
            알 수 없는 타입: {_exhaustive}
          </p>
        );
      }
    }
  }

  // Skip startpoint/endpoint questions — they don't collect answers
  if (type === "startpoint" || type === "endpoint") return null;

  const body = renderBody();

  return (
    <div
      className="question_card_wrap rounded-xl p-5"
      style={{ backgroundColor: "white", border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
    >
      <div className="flex items-start gap-2 mb-3">
        <span
          className="text-xs font-medium tabular-nums flex-shrink-0"
          style={{ color: COLOR.TEXT_MUTED }}
        >
          Q{number}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight" style={{ color: COLOR.TEXT_PRIMARY }}>
            {question.title || "(제목 없음)"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <TypeBadge type={type} />
            <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
              응답 {answers.total}건
            </span>
          </div>
        </div>
      </div>
      {body}
    </div>
  );
}

// ─── Table tab ────────────────────────────────────────────────────────────────

function ResponseTable({
  surveyId,
  tableData,
  onLoadMore,
  isLoadingMore,
}: {
  surveyId: string;
  tableData: TableResponse | null;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}) {
  if (!tableData) {
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-lg animate-pulse"
            style={{ backgroundColor: COLOR.BG_SECTION }}
          />
        ))}
      </div>
    );
  }

  if (tableData.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
          아직 응답이 없어요.
        </p>
      </div>
    );
  }

  const { questions, data, has_more } = tableData;
  const _ = surveyId; // used externally for fetch

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
            }}
          >
            <th
              className="sticky left-0 px-3 py-2.5 text-left font-medium whitespace-nowrap"
              style={{
                color: COLOR.TEXT_MUTED,
                backgroundColor: COLOR.BG_SURFACE,
                minWidth: "120px",
              }}
            >
              제출 시각
            </th>
            {questions.map((q) => (
              <th
                key={q.id}
                className="px-3 py-2.5 text-left font-medium"
                style={{
                  color: COLOR.TEXT_MUTED,
                  maxWidth: "120px",
                  minWidth: "80px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={q.title}
              >
                {q.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.response_id}
              style={{
                borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
                backgroundColor: rowIdx % 2 === 0 ? "white" : COLOR.BG_SURFACE,
              }}
            >
              <td
                className="sticky left-0 px-3 py-2.5 whitespace-nowrap tabular-nums"
                style={{
                  color: COLOR.TEXT_MUTED,
                  backgroundColor: rowIdx % 2 === 0 ? "white" : COLOR.BG_SURFACE,
                }}
              >
                {formatSubmittedAt(row.submitted_at)}
              </td>
              {questions.map((q) => {
                const cell = row.answers[q.id];
                return (
                  <td
                    key={q.id}
                    className="px-3 py-2.5"
                    style={{
                      color: cell ? COLOR.TEXT_PRIMARY : COLOR.TEXT_DISABLED,
                      maxWidth: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={cell?.display ?? "—"}
                  >
                    {cell?.display ?? "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {has_more && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: isLoadingMore ? COLOR.BG_SECTION : COLOR.BG_SURFACE,
              color: COLOR.TEXT_SECONDARY,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            }}
          >
            {isLoadingMore ? "불러오는 중이에요…" : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

interface BuilderResultViewProps {
  surveyId: string;
}

export function BuilderResultView({ surveyId }: BuilderResultViewProps) {
  const [tab, setTab] = useState<"graph" | "table">("graph");
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [tableData, setTableData] = useState<TableResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tablePage, setTablePage] = useState(1);

  // Fetch summary on mount
  useEffect(() => {
    if (!surveyId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/surveys/${surveyId}/summary`)
      .then((res) => {
        if (!res.ok) throw new Error("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
        return res.json() as Promise<SummaryResponse>;
      })
      .then((data) => {
        if (!cancelled) {
          setSummaryData(data);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [surveyId]);

  // Fetch table data when switching to table tab (first time only)
  useEffect(() => {
    if (tab !== "table" || tableData !== null || !surveyId) return;

    let cancelled = false;

    fetch(`/api/surveys/${surveyId}/responses/table?page=1&limit=20`)
      .then((res) => {
        if (!res.ok) throw new Error("응답 표를 불러올 수 없어요.");
        return res.json() as Promise<TableResponse>;
      })
      .then((data) => {
        if (!cancelled) {
          setTableData(data);
          setTablePage(1);
        }
      })
      .catch(() => {
        // Silent fail on table — graph still works
      });

    return () => {
      cancelled = true;
    };
  }, [tab, tableData, surveyId]);

  const handleLoadMoreTable = useCallback(async () => {
    if (!surveyId || isLoadingMore || !tableData?.has_more) return;

    setIsLoadingMore(true);
    const nextPage = tablePage + 1;

    try {
      const res = await fetch(`/api/surveys/${surveyId}/responses/table?page=${nextPage}&limit=20`);
      if (!res.ok) return;
      const more = (await res.json()) as TableResponse;
      setTableData((prev) =>
        prev
          ? {
              ...more,
              data: [...prev.data, ...more.data],
            }
          : more
      );
      setTablePage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  }, [surveyId, isLoadingMore, tableData, tablePage]);

  const totalResponses = summaryData?.summary.totalResponses ?? 0;
  const sortedQuestions = summaryData
    ? [...summaryData.questions].sort((a, b) => a.order_index - b.order_index)
    : [];

  return (
    <div
      className="builder_result_view_wrap flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: COLOR.BG_SURFACE }}
    >
      {/* Header */}
      <div
        className="result_view_header flex items-center justify-between px-6 py-0 flex-shrink-0 bg-white"
        style={{
          borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
          minHeight: "44px",
        }}
      >
        {/* Tabs */}
        <div className="flex items-center gap-0">
          {(["graph", "table"] as const).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="px-4 h-11 text-sm font-medium transition-colors relative"
                style={{
                  color: isActive ? COLOR.ACCENT : COLOR.TEXT_MUTED,
                  borderBottom: isActive ? `2px solid ${COLOR.ACCENT}` : "2px solid transparent",
                  backgroundColor: "transparent",
                }}
              >
                {t === "graph" ? "그래프" : "응답 표"}
              </button>
            );
          })}
        </div>

        {/* Response count badge */}
        {!isLoading && (
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: totalResponses > 0 ? COLOR.ACCENT_SUBTLE : COLOR.BG_SECTION,
              color: totalResponses > 0 ? COLOR.ACCENT : COLOR.TEXT_MUTED,
            }}
          >
            {totalResponses.toLocaleString()}개 응답
          </span>
        )}
      </div>

      {/* Body */}
      <div className="result_view_body flex-1 overflow-y-auto">
        {isLoading && <LoadingSkeleton />}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center h-full py-20">
            <p className="text-sm mb-3" style={{ color: COLOR.NEGATIVE }}>
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                setSummaryData(null);
                setIsLoading(true);
                setError(null);
                fetch(`/api/surveys/${surveyId}/summary`)
                  .then((r) => r.json())
                  .then((d: SummaryResponse) => {
                    setSummaryData(d);
                    setIsLoading(false);
                  })
                  .catch((e: Error) => {
                    setError(e.message);
                    setIsLoading(false);
                  });
              }}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: COLOR.BG_SECTION,
                color: COLOR.TEXT_SECONDARY,
                border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              }}
            >
              다시 시도하기
            </button>
          </div>
        )}

        {!isLoading && !error && tab === "graph" && (
          <>
            {totalResponses === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
                  아직 응답이 없어요.
                </p>
                <p className="text-xs mt-1" style={{ color: COLOR.TEXT_DISABLED }}>
                  설문 링크를 공유하면 응답을 받을 수 있어요.
                </p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {sortedQuestions.map((question, idx) => (
                  <QuestionGraphCard
                    key={question.id}
                    question={question}
                    number={idx + 1}
                    totalResponses={totalResponses}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {!isLoading && !error && tab === "table" && (
          <ResponseTable
            surveyId={surveyId}
            tableData={tableData}
            onLoadMore={handleLoadMoreTable}
            isLoadingMore={isLoadingMore}
          />
        )}
      </div>
    </div>
  );
}
