"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { COLOR, TYPOGRAPHY, RADIUS, INTERACTION, SPACING } from "@/lib/design-tokens";
import { useThemeStore, type Theme } from "@/lib/stores/useThemeStore";
import { createClient } from "@/lib/supabase/client";
import { getRecentSurveys, type RecentSurveyEntry } from "@/lib/recent-surveys";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParticipatedSurvey {
  id: string;
  title: string;
  status: string;
  end_date: string | null;
  created_at: string;
}

interface PointsData {
  available: number;
  pending: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysLeft(endDate: string): number | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: COLOR.BG_BASE,
        borderRadius: RADIUS.XL,
        padding: SPACING["5"],
      }}
    >
      {children}
    </div>
  );
}

function DdayBadge({ endDate }: { endDate: string }) {
  const days = getDaysLeft(endDate);
  if (days === null) {
    return (
      <span
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_2,
          backgroundColor: COLOR.BG_SURFACE,
          color: COLOR.TEXT_MUTED,
          padding: "2px 8px",
          borderRadius: RADIUS.PILL,
          whiteSpace: "nowrap",
        }}
      >
        마감
      </span>
    );
  }
  return (
    <span
      style={{
        ...TYPOGRAPHY.STYLE.LABEL_2,
        backgroundColor: days <= 1 ? COLOR.NEGATIVE_BG : COLOR.BG_SURFACE,
        color: days <= 1 ? COLOR.NEGATIVE : COLOR.TEXT_MUTED,
        padding: "2px 8px",
        borderRadius: RADIUS.PILL,
        whiteSpace: "nowrap",
      }}
    >
      {days === 0 ? "D-Day" : `D-${days}`}
    </span>
  );
}

// ─── Points Card ──────────────────────────────────────────────────────────────

function PointsCard({ points }: { points: PointsData }) {
  return (
    <CardShell>
      <div className="flex items-center justify-between mb-3">
        <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>내 포인트</span>
        <Link
          href="/my"
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_2,
            color: COLOR.ACCENT,
            textDecoration: "none",
          }}
        >
          내 페이지 →
        </Link>
      </div>

      <div
        className="mb-1"
        style={{
          ...TYPOGRAPHY.STYLE.DISPLAY,
          color: COLOR.TEXT_PRIMARY,
        }}
      >
        {points.available.toLocaleString("ko-KR")}
        <span
          style={{
            ...TYPOGRAPHY.STYLE.TITLE_2,
            color: COLOR.TEXT_MUTED,
            marginLeft: "4px",
          }}
        >
          P
        </span>
      </div>

      {points.pending > 0 && (
        <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
          검토 중 {points.pending.toLocaleString("ko-KR")}P
        </p>
      )}

      <Link
        href="/my/point"
        className="block mt-3 text-center"
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_1,
          fontWeight: "600",
          padding: "8px 0",
          borderRadius: RADIUS.MD,
          backgroundColor: COLOR.BG_SURFACE,
          color: COLOR.TEXT_SECONDARY,
          textDecoration: "none",
          transition: INTERACTION.TRANSITION_BG,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            INTERACTION.HOVER_BG_SURFACE;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = COLOR.BG_SURFACE;
        }}
      >
        기프티콘 교환하기
      </Link>
    </CardShell>
  );
}

// ─── Participated Surveys Card ────────────────────────────────────────────────

function ParticipatedCard({ surveys }: { surveys: ParticipatedSurvey[] }) {
  return (
    <CardShell>
      <p className="mb-3" style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>
        참여한 설문
      </p>

      {surveys.length === 0 ? (
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_DISABLED }}>
          아직 참여한 설문이 없어요
        </p>
      ) : (
        <div
          className="flex flex-col gap-2"
          style={{ maxHeight: "200px", overflowY: "auto", scrollbarWidth: "none" }}
        >
          {surveys.map((s) => (
            <Link
              key={s.id}
              href={`/survey/${s.id}`}
              className="participated_item_wrap flex items-center justify-between gap-2"
              style={{ textDecoration: "none" }}
            >
              <span
                className="line-clamp-1"
                style={{
                  ...TYPOGRAPHY.STYLE.BODY_2,
                  color: COLOR.TEXT_PRIMARY,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {s.title}
              </span>
              {s.end_date ? (
                <DdayBadge endDate={s.end_date} />
              ) : (
                <span
                  style={{
                    ...TYPOGRAPHY.STYLE.LABEL_2,
                    color: COLOR.TEXT_DISABLED,
                    whiteSpace: "nowrap",
                  }}
                >
                  기간 없음
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </CardShell>
  );
}

// ─── Recently Viewed Card (비로그인) ─────────────────────────────────────────

function RecentlyViewedCard({ surveys }: { surveys: RecentSurveyEntry[] }) {
  return (
    <CardShell>
      <div className="flex items-center justify-between mb-3">
        <p style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>최근 본 설문</p>
        <Link
          href="/login"
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_2,
            color: COLOR.ACCENT,
            textDecoration: "none",
          }}
        >
          로그인하기
        </Link>
      </div>

      {surveys.length === 0 ? (
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_DISABLED }}>
          아직 본 설문이 없어요
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {surveys.map((s) => (
            <Link
              key={s.id}
              href={`/survey/${s.id}`}
              className="flex items-center gap-2"
              style={{ textDecoration: "none" }}
            >
              <span
                className="line-clamp-1"
                style={{
                  ...TYPOGRAPHY.STYLE.BODY_2,
                  color: COLOR.TEXT_PRIMARY,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {s.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </CardShell>
  );
}

// ─── ThemeButton ──────────────────────────────────────────────────────────────

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "라이트",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "시스템",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "다크",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

function currentThemeIcon(theme: Theme) {
  return THEME_OPTIONS.find((o) => o.value === theme)?.icon ?? THEME_OPTIONS[0].icon;
}

function ThemeButton({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* 32px 트리거 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="테마 변경"
        style={{
          width: 32,
          height: 32,
          borderRadius: RADIUS.MD,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: open ? COLOR.BG_SECTION : "transparent",
          color: COLOR.TEXT_MUTED,
          transition: "background-color 150ms ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.BG_SECTION;
        }}
        onMouseLeave={(e) => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
      >
        {currentThemeIcon(theme)}
      </button>

      {/* 드롭다운 — 가로 리스트 */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            display: "flex",
            flexDirection: "row",
            gap: "2px",
            backgroundColor: COLOR.BG_BASE,
            borderRadius: RADIUS.LG,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
            padding: "4px",
            zIndex: 200,
            whiteSpace: "nowrap",
          }}
        >
          {THEME_OPTIONS.map((opt) => {
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                aria-label={opt.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  padding: "8px 10px",
                  borderRadius: RADIUS.MD,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isActive ? COLOR.BG_SECTION : "transparent",
                  color: isActive ? COLOR.TEXT_PRIMARY : COLOR.TEXT_MUTED,
                  transition: "background-color 150ms ease, color 150ms ease",
                  minWidth: 48,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.BG_SURFACE;
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                {opt.icon}
                <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, fontWeight: isActive ? 600 : 400 }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main MySidebar ───────────────────────────────────────────────────────────

export default function MySidebar() {
  const { theme, setTheme } = useThemeStore();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [points, setPoints] = useState<PointsData | null>(null);
  const [participatedSurveys, setParticipatedSurveys] = useState<ParticipatedSurvey[]>([]);
  const [recentSurveys, setRecentSurveys] = useState<RecentSurveyEntry[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setIsLoggedIn(false);
        setRecentSurveys(getRecentSurveys());
        return;
      }
      setIsLoggedIn(true);

      fetch("/api/my/dashboard")
        .then((r) => r.json())
        .then((data) => {
          if (data.points) {
            setPoints({ available: data.points.available, pending: data.points.pending });
          }
        })
        .catch(() => {});

      supabase
        .from("responses")
        .select("survey_id, surveys!inner(id, title, status, end_date, created_at)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data: rows }) => {
          if (!rows) return;
          const items: ParticipatedSurvey[] = rows
            .map((row) => {
              const s = row.surveys as unknown as {
                id: string;
                title: string;
                status: string;
                end_date: string | null;
                created_at: string;
              };
              return {
                id: s.id,
                title: s.title,
                status: s.status,
                end_date: s.end_date,
                created_at: s.created_at,
              };
            })
            .filter((item) => item.id);
          setParticipatedSurveys(items);
        });
    });
  }, []);

  return (
    <aside
      className="my_sidebar_wrap flex flex-col gap-4"
      style={{
        height: "100%",
        overflowY: "auto",
        scrollbarWidth: "none",
        backgroundColor: COLOR.BG_SURFACE,
        padding: "16px",
      }}
    >
      {/* 타이틀 + 테마 버튼 */}
      <div className="flex items-center justify-between" style={{ marginBottom: "4px" }}>
        <p style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}>My</p>
        <ThemeButton theme={theme} setTheme={setTheme} />
      </div>

      {/* 비로그인 — 최근 본 설문 */}
      {isLoggedIn === false && <RecentlyViewedCard surveys={recentSurveys} />}

      {/* 로그인 — 포인트 + 참여 설문 */}
      {isLoggedIn === true && (
        <div className="flex flex-col gap-4">
          {points && <PointsCard points={points} />}
          <ParticipatedCard surveys={participatedSurveys} />
        </div>
      )}

      {/* 설문 만들기 CTA — 항상 최하단 */}
      {isLoggedIn !== null && (
        <Link
          href="/survey/new"
          className="block text-center"
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            fontWeight: 600,
            padding: "10px 0",
            borderRadius: RADIUS.MD,
            backgroundColor: COLOR.ACCENT,
            color: COLOR.TEXT_INVERSE,
            textDecoration: "none",
          }}
        >
          + 설문 만들기
        </Link>
      )}
    </aside>
  );
}
