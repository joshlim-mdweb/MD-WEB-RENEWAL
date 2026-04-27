"use client";

import { useState, useEffect, useCallback, type FC } from "react";
import { COLOR, RADIUS, SHADOW } from "@/lib/design-tokens";
import { Button } from "@/components/ui";

export interface ResponsesViewProps {
  surveyId: string;
  surveyStatus: string;
}

type RewardEligibility = {
  status: string;
  disqualify_reason: string | null;
};

type ResponseRow = {
  id: string;
  created_at: string;
  completed_at: string | null;
  respondent_ip: string | null;
  respondent_ua: string | null;
  answer_count: number;
  reward_eligibility: RewardEligibility | null;
};

type AnswerDisplay = {
  question_title: string;
  question_type: string;
  value: unknown;
  display: string;
};

type QuestionMeta = {
  id: string;
  title: string;
  type: string;
  order_index: number;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function calcAbuseScore(row: ResponseRow, allRows: ResponseRow[]): number {
  let score = 0;

  // ABR-01: duplicate IP → +40
  if (row.respondent_ip) {
    const sameIp = allRows.filter((r) => r.respondent_ip === row.respondent_ip);
    if (sameIp.length > 1) score += 40;
  }

  // ABR-02: total time < question_count × 5s → +30
  if (row.completed_at && row.created_at) {
    const secs = (new Date(row.completed_at).getTime() - new Date(row.created_at).getTime()) / 1000;
    if (secs < row.answer_count * 5) score += 30;
  }

  return Math.min(score, 100);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDuration(startIso: string, endIso: string | null): string {
  if (!endIso) return "—";
  const secs = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 1000);
  if (secs < 0) return "—";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m === 0 ? `${s}초` : `${m}분 ${s}초`;
}

function shortId(uuid: string): string {
  return `#${uuid.replace(/-/g, "").slice(0, 8)}`;
}

// ── Status badge ───────────────────────────────────────────────────────────────

const EligibilityBadge: FC<{ eligibility: RewardEligibility | null }> = ({ eligibility }) => {
  const status = eligibility?.status ?? "pending";

  if (status === "confirmed") {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
        style={{ backgroundColor: COLOR.ACCENT_SUBTLE, color: COLOR.POSITIVE }}
      >
        보상 확정
      </span>
    );
  }

  if (status === "disqualified") {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
        style={{ backgroundColor: COLOR.NEGATIVE_BG, color: COLOR.NEGATIVE }}
      >
        어뷰징
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ backgroundColor: COLOR.BG_SURFACE, color: COLOR.TEXT_MUTED }}
    >
      검토 중
    </span>
  );
};

// ── Disqualify modal ───────────────────────────────────────────────────────────

const DisqualifyModal: FC<{
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}> = ({ onConfirm, onClose, loading }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm mx-4 p-6 flex flex-col gap-4"
      style={{
        backgroundColor: COLOR.BG_SURFACE,
        borderRadius: RADIUS.XL,
        boxShadow: SHADOW.MODAL,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
          이 응답을 어뷰징으로 표시할까요?
        </p>
        <p className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
          보상이 취소되고 응답이 집계에서 제외돼요. 이 작업은 되돌릴 수 없어요.
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="neutral" size="sm" onClick={onClose} disabled={loading}>
          닫기
        </Button>
        <Button variant="danger" size="sm" loading={loading} onClick={onConfirm}>
          어뷰징으로 표시하기
        </Button>
      </div>
    </div>
  </div>
);

// ── Confirm-all modal ──────────────────────────────────────────────────────────

const ConfirmAllModal: FC<{
  pendingCount: number;
  rewardType: "first_come" | "random";
  winnerCount: number | null;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}> = ({ pendingCount, rewardType, winnerCount, onConfirm, onClose, loading }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm mx-4 p-6 flex flex-col gap-4"
      style={{
        backgroundColor: COLOR.BG_SURFACE,
        borderRadius: RADIUS.XL,
        boxShadow: SHADOW.MODAL,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
          {rewardType === "random"
            ? `랜덤 ${winnerCount ?? "?"}명을 추첨할까요?`
            : "선착순 보상을 확정할까요?"}
        </p>
        <p className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
          {rewardType === "random"
            ? `검토 중인 응답 ${pendingCount}건 중 ${winnerCount ?? "?"}명이 무작위로 선정돼요. 어뷰징으로 표시된 응답은 제외됩니다.`
            : `제출 시간 순으로 최대 ${winnerCount ?? pendingCount}명의 보상이 확정돼요. 어뷰징으로 표시된 응답은 제외됩니다.`}
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="neutral" size="sm" onClick={onClose} disabled={loading}>
          닫기
        </Button>
        <Button variant="solid" size="sm" loading={loading} onClick={onConfirm}>
          {rewardType === "random" ? "추첨하기" : "보상 확정하기"}
        </Button>
      </div>
    </div>
  </div>
);

// ── Response detail slide panel ────────────────────────────────────────────────

const ResponseDetailPanel: FC<{
  row: ResponseRow;
  score: number;
  answers: Record<string, AnswerDisplay> | null;
  questions: QuestionMeta[];
  onDisqualify: () => void;
  onClose: () => void;
  detailLoading: boolean;
}> = ({ row, score, answers, questions, onDisqualify, onClose, detailLoading }) => {
  const isDisqualified = row.reward_eligibility?.status === "disqualified";
  const canFlag = !isDisqualified;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        onClick={onClose}
      />

      {/* Slide panel */}
      <div
        className="response_detail_panel fixed right-0 top-0 bottom-0 z-40 flex flex-col overflow-hidden"
        style={{
          width: 360,
          backgroundColor: COLOR.BG_SURFACE,
          boxShadow: SHADOW.MODAL,
          borderLeft: `1px solid ${COLOR.BORDER_DEFAULT}`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
              응답 상세
            </p>
            <p className="text-xs font-mono mt-0.5" style={{ color: COLOR.TEXT_MUTED }}>
              {shortId(row.id)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: COLOR.TEXT_MUTED }}
            aria-label="닫기"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {/* Meta */}
        <div
          className="flex flex-col gap-2 px-5 py-3 shrink-0"
          style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
              제출 시각
            </span>
            <span className="text-xs" style={{ color: COLOR.TEXT_SECONDARY }}>
              {formatDate(row.created_at)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
              응답 시간
            </span>
            <span className="text-xs" style={{ color: COLOR.TEXT_SECONDARY }}>
              {formatDuration(row.created_at, row.completed_at)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
              어뷰징 점수
            </span>
            <span
              className="text-xs font-semibold"
              style={{
                color:
                  score >= 60 ? COLOR.NEGATIVE : score >= 30 ? COLOR.WARNING : COLOR.TEXT_MUTED,
              }}
            >
              {score > 0 ? `${score}점` : "이상 없음"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
              상태
            </span>
            <EligibilityBadge eligibility={row.reward_eligibility} />
          </div>
        </div>

        {/* Answers */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {detailLoading && (
            <p className="text-xs text-center py-8" style={{ color: COLOR.TEXT_DISABLED }}>
              불러오는 중이에요
            </p>
          )}

          {!detailLoading && answers && (
            <div className="flex flex-col gap-4">
              {questions
                .filter((q) => q.type !== "startpoint" && q.type !== "endpoint")
                .map((q, i) => {
                  const ans = answers[q.id];
                  return (
                    <div key={q.id} className="flex flex-col gap-1.5">
                      <p className="text-xs font-medium" style={{ color: COLOR.TEXT_MUTED }}>
                        Q{i + 1}. {q.title}
                      </p>
                      <div
                        className="text-xs px-3 py-2 rounded-lg"
                        style={{
                          backgroundColor: COLOR.BG_BASE,
                          color: ans ? COLOR.TEXT_PRIMARY : COLOR.TEXT_DISABLED,
                          border: `1px solid ${COLOR.BORDER_DEFAULT}`,
                        }}
                      >
                        {ans ? ans.display : "응답 없음"}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {!detailLoading && !answers && (
            <p className="text-xs text-center py-8" style={{ color: COLOR.TEXT_DISABLED }}>
              응답 내용을 불러오지 못했어요. 다시 시도해 주세요
            </p>
          )}
        </div>

        {/* Footer action */}
        {canFlag && (
          <div
            className="px-5 py-4 shrink-0"
            style={{ borderTop: `1px solid ${COLOR.BORDER_DEFAULT}` }}
          >
            <Button variant="danger" size="sm" className="w-full" onClick={onDisqualify}>
              어뷰징으로 표시하기
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

// ── Draft/locked empty state ───────────────────────────────────────────────────

function DraftEmptyState() {
  return (
    <div
      className="responses_view_wrap flex flex-col items-center justify-center h-full px-6"
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
            <rect x="3" y="3" width="16" height="16" rx="2" />
            <line x1="7" y1="8" x2="15" y2="8" />
            <line x1="7" y1="12" x2="12" y2="12" />
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
          아직 응답이 없어요
        </p>
        <p className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
          설문을 공개한 후 응답을 확인할 수 있어요
        </p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ResponsesView({ surveyId, surveyStatus }: ResponsesViewProps) {
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reward config
  const [rewardType, setRewardType] = useState<"none" | "first_come" | "random">("none");
  // winnerCount: reward_winner_count for random, max_recipients for first_come
  const [winnerCount, setWinnerCount] = useState<number | null>(null);

  // Table data (for slide panel answers)
  const [tableAnswers, setTableAnswers] = useState<Map<string, Record<string, AnswerDisplay>>>(
    new Map()
  );
  const [questions, setQuestions] = useState<QuestionMeta[]>([]);

  // Disqualify modal state
  const [pendingDisqualify, setPendingDisqualify] = useState<string | null>(null);
  const [disqualifyLoading, setDisqualifyLoading] = useState(false);

  // Confirm-all modal state
  const [showConfirmAll, setShowConfirmAll] = useState(false);
  const [confirmAllLoading, setConfirmAllLoading] = useState(false);

  // Slide panel state
  const [selectedRow, setSelectedRow] = useState<ResponseRow | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (surveyStatus === "draft") return;

    setLoading(true);
    setError(null);

    // Fetch response metadata + table data + survey reward config + budget in parallel
    Promise.all([
      fetch(`/api/surveys/${surveyId}/responses?page=1&limit=20`).then((r) => r.json()),
      fetch(`/api/surveys/${surveyId}/responses/table?page=1&limit=100`).then((r) => r.json()),
      fetch(`/api/surveys/${surveyId}`).then((r) => r.json()),
      fetch(`/api/surveys/${surveyId}/reward-budget`).then((r) => r.json()),
    ])
      .then(([responsesJson, tableJson, surveyJson, budgetJson]) => {
        if (responsesJson.error) {
          setError("응답 데이터를 불러올 수 없어요. 잠시 후 다시 시도해 주세요.");
        } else {
          setRows(responsesJson.responses ?? responsesJson.data ?? []);
          setTotal(responsesJson.total ?? 0);
        }

        // Extract reward config
        const survey = surveyJson.survey ?? surveyJson;
        if (survey && !surveyJson.error) {
          const type: "none" | "first_come" | "random" = survey.reward_type ?? "none";
          setRewardType(type);
          if (type === "random") {
            setWinnerCount(survey.reward_winner_count ?? null);
          } else if (type === "first_come") {
            setWinnerCount(budgetJson.budget?.max_recipients ?? null);
          }
        }

        if (!tableJson.error) {
          const map = new Map<string, Record<string, AnswerDisplay>>();
          for (const row of tableJson.data ?? []) {
            map.set(row.response_id, row.answers);
          }
          setTableAnswers(map);
          setQuestions(tableJson.questions ?? []);
        }
      })
      .catch(() => {
        setError("네트워크 연결을 확인하고 다시 시도해 주세요.");
      })
      .finally(() => setLoading(false));
  }, [surveyId, surveyStatus]);

  const refetchRows = useCallback(() => {
    fetch(`/api/surveys/${surveyId}/responses?page=1&limit=20`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.error) {
          setRows(json.responses ?? json.data ?? []);
          setTotal(json.total ?? 0);
        }
      });
  }, [surveyId]);

  const handleRowClick = useCallback(
    (row: ResponseRow) => {
      setSelectedRow(row);

      // If answers not yet cached, fetch lazily
      if (!tableAnswers.has(row.id)) {
        setDetailLoading(true);
        fetch(`/api/surveys/${surveyId}/responses/table?page=1&limit=1000`)
          .then((r) => r.json())
          .then((json) => {
            if (!json.error) {
              const map = new Map(tableAnswers);
              for (const r of json.data ?? []) {
                map.set(r.response_id, r.answers);
              }
              setTableAnswers(map);
              setQuestions(json.questions ?? []);
            }
          })
          .catch(() => {})
          .finally(() => setDetailLoading(false));
      }
    },
    [surveyId, tableAnswers]
  );

  const handleDisqualify = async () => {
    const targetId = pendingDisqualify ?? selectedRow?.id;
    if (!targetId) return;
    setDisqualifyLoading(true);

    // Optimistic update
    setRows((prev) =>
      prev.map((r) =>
        r.id === targetId
          ? {
              ...r,
              reward_eligibility: { status: "disqualified", disqualify_reason: "creator_flagged" },
            }
          : r
      )
    );
    if (selectedRow?.id === targetId) {
      setSelectedRow((prev) =>
        prev
          ? {
              ...prev,
              reward_eligibility: { status: "disqualified", disqualify_reason: "creator_flagged" },
            }
          : prev
      );
    }

    try {
      const res = await fetch(`/api/surveys/${surveyId}/responses/${targetId}/disqualify`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
    } catch {
      // Rollback
      refetchRows();
    } finally {
      setDisqualifyLoading(false);
      setPendingDisqualify(null);
    }
  };

  const handleConfirmAll = async () => {
    setConfirmAllLoading(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/reward-eligibility/confirm-all`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      setShowConfirmAll(false);
      // For random: server picks winners we can't know client-side → refetch
      // For first_come: also refetch for accuracy
      refetchRows();
    } catch {
      // silent — user can retry
    } finally {
      setConfirmAllLoading(false);
    }
  };

  if (surveyStatus === "draft") return <DraftEmptyState />;

  const pendingCount = rows.filter(
    (r) => !r.reward_eligibility || r.reward_eligibility.status === "pending"
  ).length;

  const isClosed = surveyStatus === "closed" || surveyStatus === "archived";

  return (
    <div
      className="responses_view_wrap flex flex-col h-full"
      style={{ backgroundColor: COLOR.BG_BASE, padding: 24 }}
    >
      {/* Header */}
      <div className="responses_header flex items-center justify-between mb-4 shrink-0">
        <p className="text-sm font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
          응답 <span style={{ color: COLOR.ACCENT }}>{total}</span>건
        </p>

        <div className="flex items-center gap-2">
          {/* Bulk confirm — closed only, reward_type must be set */}
          {isClosed && pendingCount > 0 && rewardType !== "none" && (
            <Button variant="solid" size="sm" onClick={() => setShowConfirmAll(true)}>
              {rewardType === "random"
                ? `랜덤 ${winnerCount ?? "?"}명 추첨하기`
                : "선착순 보상 확정하기"}
            </Button>
          )}

          {/* CSV export */}
          <button
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{
              color: COLOR.TEXT_SECONDARY,
              backgroundColor: COLOR.BG_SURFACE,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            }}
            onClick={() => {
              const csv = [
                ["#", "응답 ID", "제출 시각", "어뷰징 점수", "상태"].join(","),
                ...rows.map((r, i) => {
                  const score = calcAbuseScore(r, rows);
                  const status = r.reward_eligibility?.status ?? "pending";
                  return [i + 1, shortId(r.id), formatDate(r.created_at), score, status].join(",");
                }),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `responses-${surveyId}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
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
              <path d="M6.5 1v7M4 6l2.5 2.5L9 6" />
              <path d="M1.5 9.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" />
            </svg>
            응답 내보내기
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="responses_table_area flex flex-col overflow-hidden rounded-xl flex-1 min-h-0"
        style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        {/* Column headers */}
        <div
          className="grid items-center px-4 py-2.5 text-xs font-semibold shrink-0"
          style={{
            gridTemplateColumns: "40px 1fr 140px 100px 60px 100px 1fr",
            backgroundColor: COLOR.BG_SURFACE,
            borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
            color: COLOR.TEXT_MUTED,
          }}
        >
          <span>#</span>
          <span>응답 ID</span>
          <span>제출 시각</span>
          <span>응답 시간</span>
          <span>어뷰징</span>
          <span>상태</span>
          <span />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-xs" style={{ color: COLOR.TEXT_DISABLED }}>
                불러오는 중이에요
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center justify-center py-16">
              <p className="text-xs" style={{ color: COLOR.NEGATIVE }}>
                {error}
              </p>
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <p className="text-xs" style={{ color: COLOR.TEXT_DISABLED }}>
                아직 응답이 없어요
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            rows.map((row, i) => {
              const score = calcAbuseScore(row, rows);
              const isDisqualified = row.reward_eligibility?.status === "disqualified";
              const isSelected = selectedRow?.id === row.id;

              let rowBorderLeft = "none";
              let rowBg = "transparent";
              if (!isDisqualified) {
                if (score >= 60) {
                  rowBorderLeft = `3px solid ${COLOR.NEGATIVE}`;
                  rowBg = COLOR.NEGATIVE_BG;
                } else if (score >= 30) {
                  rowBorderLeft = `3px solid ${COLOR.WARNING}`;
                  rowBg = COLOR.WARNING_MUTED;
                }
              }
              if (isSelected) {
                rowBg = COLOR.ACCENT_SUBTLE;
              }

              return (
                <div
                  key={row.id}
                  className="grid items-center px-4 py-2.5 text-xs cursor-pointer transition-colors"
                  style={{
                    gridTemplateColumns: "40px 1fr 140px 100px 60px 100px 1fr",
                    borderLeft: rowBorderLeft,
                    backgroundColor: rowBg,
                    opacity: isDisqualified ? 0.5 : 1,
                    borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
                  }}
                  onClick={() => handleRowClick(row)}
                >
                  <span style={{ color: COLOR.TEXT_MUTED }}>{i + 1}</span>
                  <span className="font-mono" style={{ color: COLOR.TEXT_SECONDARY }}>
                    {shortId(row.id)}
                  </span>
                  <span style={{ color: COLOR.TEXT_SECONDARY }}>{formatDate(row.created_at)}</span>
                  <span style={{ color: COLOR.TEXT_SECONDARY }}>
                    {formatDuration(row.created_at, row.completed_at)}
                  </span>
                  <span
                    style={{
                      color:
                        score >= 60
                          ? COLOR.NEGATIVE
                          : score >= 30
                            ? COLOR.WARNING
                            : COLOR.TEXT_MUTED,
                      fontWeight: score >= 30 ? 600 : 400,
                    }}
                  >
                    {score > 0 ? score : "—"}
                  </span>
                  <EligibilityBadge eligibility={row.reward_eligibility} />
                  <div className="flex justify-end">
                    {!isDisqualified && (
                      <button
                        className="text-xs px-2 py-1 rounded-md transition-colors"
                        style={{ color: COLOR.WARNING, backgroundColor: COLOR.WARNING_MUTED }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDisqualify(row.id);
                        }}
                      >
                        어뷰징으로 표시하기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Slide panel */}
      {selectedRow && (
        <ResponseDetailPanel
          row={selectedRow}
          score={calcAbuseScore(selectedRow, rows)}
          answers={tableAnswers.get(selectedRow.id) ?? null}
          questions={questions}
          onDisqualify={() => setPendingDisqualify(selectedRow.id)}
          onClose={() => setSelectedRow(null)}
          detailLoading={detailLoading}
        />
      )}

      {/* Disqualify modal */}
      {pendingDisqualify && (
        <DisqualifyModal
          onConfirm={handleDisqualify}
          onClose={() => setPendingDisqualify(null)}
          loading={disqualifyLoading}
        />
      )}

      {/* Confirm-all modal */}
      {showConfirmAll && rewardType !== "none" && (
        <ConfirmAllModal
          pendingCount={pendingCount}
          rewardType={rewardType}
          winnerCount={winnerCount}
          onConfirm={handleConfirmAll}
          onClose={() => setShowConfirmAll(false)}
          loading={confirmAllLoading}
        />
      )}
    </div>
  );
}
