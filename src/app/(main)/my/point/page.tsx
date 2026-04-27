import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { COLOR, TYPOGRAPHY, RADIUS, SPACING } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

function formatPoints(n: number) {
  return n.toLocaleString("ko-KR");
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const SOURCE_LABEL: Record<string, string> = {
  poll: "폴 참여",
  survey: "설문 참여",
  survey_access: "설문 추가 참여",
  event: "이벤트",
  reversal: "포인트 환수",
};

interface HistoryEntry {
  id: string;
  label: string;
  amountSigned: number;
  date: string;
  balance: number;
  isCredit: boolean;
}

export default async function PointPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let available = 0;
  let pending = 0;
  let historyEntries: HistoryEntry[] = [];

  try {
    const { data: rows } = await supabase
      .from("point_ledger")
      .select("id, amount, status, source_type, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    const ledgerRows = rows ?? [];

    let runningBalance = 0;
    const allEntries: HistoryEntry[] = [];

    for (const row of ledgerRows) {
      if (row.status === "available") available += row.amount;
      else if (row.status === "pending") pending += row.amount;

      // isCredit: amount > 0 (부호 기반, source_type 기반 아님)
      const isCredit = row.amount > 0;
      const amountSigned = row.amount;
      runningBalance += amountSigned;

      allEntries.push({
        id: row.id,
        label: SOURCE_LABEL[row.source_type] ?? row.source_type,
        amountSigned,
        date: formatDate(row.created_at),
        balance: runningBalance,
        isCredit,
      });
    }

    // 최신순, 최대 10개
    historyEntries = allEntries.reverse().slice(0, 10);
  } catch {
    // 에러 시 빈 데이터로 렌더
  }

  const hasNoPoints = available === 0 && pending === 0;

  return (
    <div className="point_page px-5 py-8 max-w-[800px] mx-auto w-full">
      {/* ── 1. 잔액 섹션 ── */}
      <div className="point_balance_area mb-6">
        <div className="mb-1">
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>사용 가능</p>
          <p style={{ ...TYPOGRAPHY.STYLE.DISPLAY, color: COLOR.TEXT_PRIMARY }}>
            {formatPoints(available)}
            <span
              style={{ ...TYPOGRAPHY.STYLE.TITLE_2, marginLeft: "6px", color: COLOR.TEXT_MUTED }}
            >
              P
            </span>
          </p>
        </div>

        {/* 검토 중 — pending > 0일 때만 표시 */}
        {pending > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              검토 중{" "}
              <span
                style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_SECONDARY, fontWeight: 500 }}
              >
                {formatPoints(pending)} P
              </span>
            </p>
            {/* 툴팁 아이콘 */}
            <span
              title="내일 00시에 사용 가능한 포인트로 바뀌어요"
              aria-label="내일 00시에 사용 가능한 포인트로 바뀌어요"
              className="inline-flex items-center justify-center w-4 h-4 rounded-full cursor-default"
              style={{
                backgroundColor: COLOR.BG_SECTION,
                color: COLOR.TEXT_MUTED,
                fontSize: "10px",
                fontWeight: 600,
              }}
            >
              ?
            </span>
          </div>
        )}
      </div>

      {/* ── 2. 사용처 안내 배너 (항상 고정, 닫기 없음) ── */}
      <div
        className="point_usage_banner"
        style={{
          backgroundColor: COLOR.ACCENT_BG,
          border: `1px solid ${COLOR.ACCENT_LIGHT}`,
          borderRadius: RADIUS.MD,
          padding: "12px 16px",
          marginBottom: SPACING[6],
        }}
      >
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.ACCENT }}>
          포인트는 설문 추가 참여에만 사용할 수 있어요
        </p>
      </div>

      {/* ── 3. 포인트 내역 ── */}
      <div className="point_history_area">
        <p className="mb-3" style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>
          포인트 내역
        </p>

        {historyEntries.length === 0 ? (
          <div
            className="px-4 py-10 text-center"
            style={{ backgroundColor: COLOR.BG_SURFACE, borderRadius: RADIUS.MD }}
          >
            <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              아직 포인트 내역이 없어요
            </p>
          </div>
        ) : (
          <div
            className="point_history_table_wrap overflow-hidden"
            style={{ backgroundColor: COLOR.BG_SURFACE, borderRadius: RADIUS.MD }}
          >
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-4 px-4 py-3">
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>항목</span>
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>금액</span>
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>날짜</span>
              <span
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  color: COLOR.TEXT_MUTED,
                  textAlign: "right",
                }}
              >
                잔여 포인트
              </span>
            </div>

            {/* 데이터 행 */}
            {historyEntries.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-4 px-4 py-3"
                style={{ borderTop: `1px solid ${COLOR.BORDER_DEFAULT}` }}
              >
                <span style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>
                  {entry.label}
                </span>
                <span
                  style={{
                    ...TYPOGRAPHY.STYLE.BODY_1,
                    fontWeight: 600,
                    color: entry.isCredit ? COLOR.POSITIVE : COLOR.NEGATIVE,
                  }}
                >
                  {entry.amountSigned > 0 ? "+" : ""}
                  {formatPoints(Math.abs(entry.amountSigned))}
                </span>
                <span style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_SECONDARY }}>
                  {entry.date}
                </span>
                <span
                  style={{
                    ...TYPOGRAPHY.STYLE.BODY_1,
                    color: COLOR.TEXT_MUTED,
                    textAlign: "right",
                  }}
                >
                  {formatPoints(entry.balance)} P
                </span>
              </div>
            ))}

            {/* 전체 내역 링크 */}
            <div
              className="px-4 py-3 text-center"
              style={{ borderTop: `1px solid ${COLOR.BORDER_DEFAULT}` }}
            >
              <Link
                href="/my/point/history"
                style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.ACCENT }}
              >
                전체 내역 보기 →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. 빈 상태 CTA — available 0P AND pending 0P일 때만 ── */}
      {hasNoPoints && (
        <div className="point_empty_cta mt-8 text-center">
          <p className="mb-4" style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>
            아직 쌓인 포인트가 없어요. 폴에 참여해서 첫 포인트를 받아 보세요.
          </p>
          <Link
            href="/poll"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl transition-colors"
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              color: COLOR.TEXT_PRIMARY,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              backgroundColor: "transparent",
            }}
          >
            폴 참여하러 가기
          </Link>
        </div>
      )}
    </div>
  );
}
