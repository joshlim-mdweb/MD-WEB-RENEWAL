"use client";

import Link from "next/link";
import { useState } from "react";
import { COLOR, TYPOGRAPHY, RADIUS, INTERACTION } from "@/lib/design-tokens";

interface Props {
  available: number;
  pending: number;
  totalThisMonth: number;
  surveyThisMonth: number;
  surveyTotal: number;
  publishedCount: number;
  draftCount: number;
  closedCount: number;
}

function HoverCard({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} className={`block ${className ?? ""}`}>
      <section
        style={{
          backgroundColor: hovered ? INTERACTION.HOVER_BG_SURFACE : COLOR.BG_SURFACE,
          borderRadius: RADIUS.XL,
          transition: INTERACTION.TRANSITION_BG,
          padding: "20px",
          height: "100%",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </section>
    </Link>
  );
}

export function MyDashboardCards({
  available,
  pending,
  totalThisMonth,
  surveyThisMonth,
  surveyTotal,
  publishedCount,
  draftCount,
  closedCount,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 포인트 카드 — col-span-2 풀 width */}
      <HoverCard href="/my/point" className="col-span-2">
        <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }} className="mb-2">
          사용 가능 포인트
        </p>
        <p style={{ ...TYPOGRAPHY.STYLE.DISPLAY, color: COLOR.TEXT_PRIMARY }}>
          {available.toLocaleString("ko-KR")}
          <span style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_MUTED, marginLeft: 6 }}>P</span>
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-3">
            {pending > 0 && (
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_DISABLED }}>
                대기 중 {pending.toLocaleString("ko-KR")}P
              </span>
            )}
          </div>
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.ACCENT }}>
            기프티콘 교환하기 →
          </span>
        </div>
      </HoverCard>

      {/* 이번 달 참여 카드 */}
      <HoverCard href="/my/survey/history">
        <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }} className="mb-2">
          이번 달 참여
        </p>
        <p style={{ ...TYPOGRAPHY.STYLE.H2, color: COLOR.TEXT_PRIMARY }}>
          {totalThisMonth}
          <span style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_MUTED, marginLeft: 4 }}>
            회
          </span>
        </p>
        <p className="mt-2" style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
          설문 {surveyThisMonth}회
        </p>
      </HoverCard>

      {/* 내 설문 카드 */}
      <HoverCard href="/my/survey">
        <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }} className="mb-2">
          내 설문
        </p>
        <p style={{ ...TYPOGRAPHY.STYLE.H2, color: COLOR.TEXT_PRIMARY }}>
          {surveyTotal}
          <span style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_MUTED, marginLeft: 4 }}>
            개
          </span>
        </p>
        <div className="flex flex-col gap-0.5 mt-2">
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            진행 중{" "}
            <strong style={{ color: COLOR.ACCENT, fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD }}>
              {publishedCount}
            </strong>
          </span>
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            임시저장{" "}
            <strong style={{ color: COLOR.TEXT_SECONDARY, fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD }}>
              {draftCount}
            </strong>{" "}
            · 종료{" "}
            <strong style={{ color: COLOR.TEXT_DISABLED, fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD }}>
              {closedCount}
            </strong>
          </span>
        </div>
      </HoverCard>
    </div>
  );
}
