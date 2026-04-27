"use client";

import { useEffect, useRef, useState } from "react";
import { COLOR, RADIUS, SHADOW, TYPOGRAPHY } from "@/lib/design-tokens";
import { Button } from "@/components/ui";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const QUICK_OPTIONS = [
  { label: "3일", days: 3 },
  { label: "5일", days: 5 },
  { label: "1주", days: 7 },
  { label: "2주", days: 14 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function getToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─── CalendarPanel (인라인 달력 UI) ──────────────────────────────────────────

interface CalendarPanelProps {
  value: string | null;
  onChange: (date: string | null) => void;
  onConfirm: () => void;
}

function CalendarPanel({ value, onChange, onConfirm }: CalendarPanelProps) {
  const today = getToday();
  const todayStr = toDateStr(today);

  const [viewYear, setViewYear] = useState(() =>
    value ? new Date(value).getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(() =>
    value ? new Date(value).getMonth() : today.getMonth()
  );

  // 달력 그리드 계산
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  function selectDay(day: number) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const dateStr = `${viewYear}-${m}-${d}`;
    if (dateStr < todayStr) return;
    onChange(dateStr);
  }

  function selectQuick(days: number) {
    const target = addDays(today, days);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    onChange(toDateStr(target));
  }

  return (
    <div className="calendar_panel_wrap" style={{ userSelect: "none" }}>
      {/* ─── 섹션 헤더 ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
          마감일
        </span>
        <span className="text-xs" style={{ color: COLOR.TEXT_MUTED }}>
          설문 마감 날짜를 선택해 주세요.
        </span>
      </div>

      {/* ─── 퀵셀렉트 ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-5">
        {QUICK_OPTIONS.map((opt) => {
          const targetStr = toDateStr(addDays(today, opt.days));
          const isSelected = value === targetStr;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => selectQuick(opt.days)}
              className="flex-1 py-1.5 rounded-lg transition-colors"
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                backgroundColor: isSelected ? COLOR.ACCENT_SUBTLE : COLOR.BG_SURFACE,
                color: isSelected ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
                fontWeight: isSelected ? 600 : 500,
                border: `1px solid ${isSelected ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* ─── 월 네비게이션 ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-base font-bold"
          style={{ color: COLOR.TEXT_PRIMARY, letterSpacing: "-0.01em" }}
        >
          {viewYear}.{String(viewMonth + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="이전 달"
            className="flex items-center justify-center rounded-md transition-colors"
            style={{
              width: 28,
              height: 28,
              color: COLOR.TEXT_MUTED,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path
                d="M6 1L1 6l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="다음 달"
            className="flex items-center justify-center rounded-md transition-colors"
            style={{
              width: 28,
              height: 28,
              color: COLOR.TEXT_PRIMARY,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path
                d="M1 1l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── 요일 헤더 ───────────────────────────────────────────── */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <span
            key={d}
            className="text-center py-1"
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              color: COLOR.TEXT_MUTED,
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* ─── 날짜 그리드 ─────────────────────────────────────────── */}
      <div className="grid grid-cols-7 mb-5">
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const m = String(viewMonth + 1).padStart(2, "0");
          const d = String(day).padStart(2, "0");
          const dateStr = `${viewYear}-${m}-${d}`;
          const isPast = dateStr < todayStr;
          const isSelected = dateStr === value;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => selectDay(day)}
              className="flex items-center justify-center mx-auto my-0.5 rounded-full transition-colors"
              style={{
                width: 36,
                height: 36,
                backgroundColor: isSelected ? COLOR.ACCENT : "transparent",
                color: isSelected
                  ? COLOR.TEXT_INVERSE
                  : isPast
                    ? COLOR.TEXT_DISABLED
                    : COLOR.TEXT_PRIMARY,
                fontWeight: isSelected || isToday ? 700 : isPast ? 400 : 600,
                border: isToday && !isSelected ? `1.5px solid ${COLOR.ACCENT}` : "none",
                cursor: isPast ? "not-allowed" : "pointer",
                fontSize: "15px",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* ─── 푸터 ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="날짜 초기화"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: COLOR.TEXT_MUTED,
            padding: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M2 2l10 10M12 2L2 12" />
          </svg>
        </button>
        <Button variant="solid" size="sm" disabled={!value} onClick={onConfirm}>
          완료하기
        </Button>
      </div>
    </div>
  );
}

// ─── DatePicker (드롭다운 래퍼) ───────────────────────────────────────────────

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  onConfirm: () => void;
  /** Storybook 전용 — 패널을 처음부터 열린 상태로 렌더링 */
  initialOpen?: boolean;
}

export function DatePicker({ value, onChange, onConfirm, initialOpen = false }: DatePickerProps) {
  const [open, setOpen] = useState(initialOpen);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "마감 기간을 선택해 주세요";

  function handleConfirm() {
    setOpen(false);
    onConfirm();
  }

  return (
    <div className="date_picker_wrap relative" ref={wrapRef}>
      {/* ─── Trigger ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left transition-colors"
        style={{
          backgroundColor: COLOR.BG_BASE,
          border: `1px solid ${open ? COLOR.BORDER_FOCUS : COLOR.BORDER_DEFAULT}`,
          borderRadius: RADIUS.MD,
          padding: "8px 12px",
          fontSize: "13px",
          color: value ? COLOR.TEXT_PRIMARY : COLOR.TEXT_DISABLED,
          cursor: "pointer",
        }}
      >
        {displayValue}
      </button>

      {/* ─── Dropdown Panel ──────────────────────────────────────── */}
      {open && (
        <div
          className="date_picker_dropdown absolute z-50 mt-1 left-0"
          style={{
            backgroundColor: COLOR.BG_BASE,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            borderRadius: RADIUS.LG,
            boxShadow: SHADOW.DROPDOWN,
            padding: "16px",
            minWidth: 300,
          }}
        >
          <CalendarPanel value={value} onChange={onChange} onConfirm={handleConfirm} />
        </div>
      )}
    </div>
  );
}

// ─── CalendarPanel export (Storybook 직접 렌더링용) ──────────────────────────
export { CalendarPanel };
