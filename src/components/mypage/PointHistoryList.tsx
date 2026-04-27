"use client";

import { useState, useMemo } from "react";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

type SourceType = "poll" | "survey" | "survey_access" | "event" | "reversal";

export interface PointEntry {
  id: string;
  amount: number;
  status: string;
  source_type: string;
  created_at: string;
}

interface PointHistoryListProps {
  entries: PointEntry[];
}

const SOURCE_LABEL: Record<string, string> = {
  poll: "폴 참여",
  survey: "설문 참여",
  survey_access: "설문 추가 참여",
  event: "이벤트",
  reversal: "포인트 환수",
};

const FILTERS: { key: "all" | SourceType; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "poll", label: "폴 참여" },
  { key: "survey", label: "설문 참여" },
  { key: "survey_access", label: "설문 추가 참여" },
  { key: "event", label: "이벤트" },
  { key: "reversal", label: "포인트 환수" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatPoints(n: number) {
  return n.toLocaleString("ko-KR");
}

export function PointHistoryList({ entries }: PointHistoryListProps) {
  const [active, setActive] = useState<"all" | SourceType>("all");

  const filtered = useMemo(
    () => (active === "all" ? entries : entries.filter((e) => e.source_type === active)),
    [entries, active]
  );

  // hide filters that have no entries
  const visibleFilters = FILTERS.filter(
    (f) => f.key === "all" || entries.some((e) => e.source_type === f.key)
  );

  return (
    <div className="point_history_list_wrap">
      {/* ── Filter chips ── */}
      <div className="flex gap-2 flex-wrap mb-5">
        {visibleFilters.map((f) => {
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-full transition-colors"
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_1,
                fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM,
                backgroundColor: isActive ? COLOR.TOAST_BG : COLOR.BG_SECTION,
                color: isActive ? COLOR.TEXT_INVERSE : COLOR.TEXT_SECONDARY,
                border: "none",
                cursor: "pointer",
              }}
            >
              {f.label}
              {f.key === "all" && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{ marginLeft: 2, opacity: 0.7 }}
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <div
          className="rounded-2xl px-5 py-10 text-center"
          style={{ backgroundColor: COLOR.BG_SECTION }}
        >
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            해당 내역이 없습니다
          </p>
        </div>
      ) : (
        <section
          className="point_history_list rounded-2xl overflow-hidden"
          style={{ backgroundColor: COLOR.BG_SECTION }}
        >
          {filtered.map((row, i) => {
            // isCredit: amount 부호 기반 (source_type 기반 아님)
            const isCredit = row.amount > 0;
            return (
              <div
                key={row.id}
                className="flex items-center justify-between px-5 py-3.5"
                style={i > 0 ? { borderTop: `1px solid ${COLOR.BG_OVERLAY}` } : undefined}
              >
                <div>
                  <p style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_PRIMARY }}>
                    {SOURCE_LABEL[row.source_type] ?? row.source_type}
                  </p>
                  <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}>
                    {formatDate(row.created_at)} · {row.status === "pending" ? "정산 대기" : "완료"}
                  </p>
                </div>
                <p
                  style={{
                    ...TYPOGRAPHY.STYLE.LABEL_1,
                    fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
                    color: isCredit ? COLOR.POSITIVE : COLOR.NEGATIVE,
                  }}
                >
                  {row.amount > 0 ? "+" : ""}
                  {formatPoints(Math.abs(row.amount))} P
                </p>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
