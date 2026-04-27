"use client";

import { useBuilderStore, type BuilderView, type PageTab } from "@/lib/store/builder";
import { COLOR, SHADOW } from "@/lib/design-tokens";

// Floating bottom toolbar — two-layer pill structure:
//   Layer 1 (always visible): PageTab [ 빌더 | 응답 | 분석 ]
//   Layer 2 (builder tab only): ViewPill [ 목록 | 흐름 ]
export function ViewToggle() {
  const { view, setView, pageTab, setPageTab } = useBuilderStore();

  return (
    <div
      className="view_toggle_wrap flex items-center gap-2 rounded-2xl px-3 py-2"
      style={{
        boxShadow: SHADOW.AMBIENT,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        backgroundColor: COLOR.BG_BASE,
      }}
    >
      {/* Page tab — always visible */}
      <div
        className="flex items-center gap-[2px] rounded-[34px] p-[3px]"
        style={{ backgroundColor: COLOR.BG_SURFACE }}
      >
        <PageTabPill label="빌더" value="builder" current={pageTab} onSelect={setPageTab} />
        <PageTabPill label="응답" value="responses" current={pageTab} onSelect={setPageTab} />
        <PageTabPill label="분석" value="analysis" current={pageTab} onSelect={setPageTab} />
      </div>

      {/* Divider + view pill — builder tab only */}
      {pageTab === "builder" && (
        <>
          <div
            aria-hidden="true"
            style={{ width: 1, height: 16, backgroundColor: COLOR.BORDER_DEFAULT, flexShrink: 0 }}
          />
          <div
            className="flex items-center gap-[2px] rounded-[34px] p-[3px]"
            style={{ backgroundColor: COLOR.BG_SURFACE }}
          >
            <ViewPill label="목록" value="list" current={view} onSelect={setView} />
            <ViewPill label="흐름" value="flow" current={view} onSelect={setView} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── PageTab pill ─────────────────────────────────────────────────────────────

interface PageTabPillProps {
  label: string;
  value: PageTab;
  current: PageTab;
  onSelect: (tab: PageTab) => void;
}

function PageTabPill({ label, value, current, onSelect }: PageTabPillProps) {
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className="text-xs font-semibold px-3 py-1 rounded-[19px] transition-all"
      style={{
        backgroundColor: isActive ? COLOR.BG_BASE : "transparent",
        color: isActive ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
        boxShadow: isActive ? "0 1px 4px rgba(25,28,30,0.06)" : undefined,
      }}
    >
      {label}
    </button>
  );
}

// ─── View pill (목록 / 흐름) ──────────────────────────────────────────────────

interface ViewPillProps {
  label: string;
  value: BuilderView;
  current: BuilderView;
  onSelect: (view: BuilderView) => void;
}

function ViewPill({ label, value, current, onSelect }: ViewPillProps) {
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className="text-xs font-semibold px-3 py-1 rounded-[19px] transition-all"
      style={{
        backgroundColor: isActive ? COLOR.BG_BASE : "transparent",
        color: isActive ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
        boxShadow: isActive ? "0 1px 4px rgba(25,28,30,0.06)" : undefined,
      }}
    >
      {label}
    </button>
  );
}
