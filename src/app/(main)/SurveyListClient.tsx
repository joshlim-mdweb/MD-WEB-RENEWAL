"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import { COLOR, TYPOGRAPHY, RADIUS, INTERACTION } from "@/lib/design-tokens";
import { Dropdown, DropdownTrigger, DropdownItem } from "@/components/ui";
import { SURVEY_PURPOSE_LABELS, TAG_PRESETS } from "@/lib/types/survey";
import type { SurveyPurpose } from "@/lib/types/survey";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SurveyListItem = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  estimated_time: number | null;
  question_count: number;
  response_count: number;
  purpose: string | null;
  tags: string[] | null;
  end_date: string | null;
  max_responses: number | null;
  status: string;
  reward_amount: number | null;
  thumbnail_url: string | null;
};

type SortKey = "latest" | "popular";
type RewardTier = null | 1000 | 5000 | 10000;
type QuestionLimit = null | 5 | 10 | 20;

const REWARD_TIERS: { value: NonNullable<RewardTier>; label: string }[] = [
  { value: 1000, label: "1,000P+" },
  { value: 5000, label: "5,000P+" },
  { value: 10000, label: "10,000P+" },
];

const QUESTION_LIMITS: { value: NonNullable<QuestionLimit>; label: string }[] = [
  { value: 5, label: "5문항 이하" },
  { value: 10, label: "10문항 이하" },
  { value: 20, label: "20문항 이하" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveEstimatedMinutes(estimatedTime: number | null, questionCount: number): number {
  if (estimatedTime !== null && estimatedTime > 0) return estimatedTime;
  if (questionCount === 0) return 1;
  return Math.max(1, Math.ceil((questionCount * 30) / 60));
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `약 ${mins}분`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `약 ${h}시간` : `약 ${h}시간 ${m}분`;
}

function getKSTToday(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function isCreatedToday(createdAt: string): boolean {
  const today = getKSTToday();
  const kstDate = new Date(new Date(createdAt).getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return kstDate === today;
}

function getDaysUntilEnd(endDate: string): number | null {
  const today = getKSTToday();
  const todayMs = new Date(today).getTime();
  const endMs = new Date(endDate).getTime();
  const diffDays = Math.ceil((endMs - todayMs) / (1000 * 60 * 60 * 24));
  if (diffDays >= 0 && diffDays <= 3) return diffDays;
  return null;
}

// ─── Inline badge (compact — used in title row) ───────────────────────────────

function InlineBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "1px 7px",
        borderRadius: RADIUS.PILL,
        fontSize: "11px",
        fontWeight: "600",
        lineHeight: "16px",
        letterSpacing: "0",
        backgroundColor: bgColor,
        color,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

// ─── SurveyCard ───────────────────────────────────────────────────────────────

function SurveyCard({
  survey,
  onSelect,
  isSelected,
  isLast,
}: {
  survey: SurveyListItem;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  isLast?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const estimatedMins = resolveEstimatedMinutes(survey.estimated_time, survey.question_count);
  const isClosed = survey.status === "closed" || survey.status === "archived";
  const isNew = isCreatedToday(survey.created_at);
  const spotsLeft =
    survey.max_responses != null ? Math.max(0, survey.max_responses - survey.response_count) : null;
  const daysLeft = survey.end_date ? getDaysUntilEnd(survey.end_date) : null;
  const isDesktopSelect = !!onSelect;

  const cardInner = (
    <div style={{ padding: "12px 16px", paddingRight: "44px" }}>
      {/* ─── 제목 행 + 인라인 뱃지 ─────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
        <h2
          className="line-clamp-1"
          style={{
            ...TYPOGRAPHY.STYLE.TITLE_2,
            color: isClosed ? COLOR.TEXT_MUTED : COLOR.TEXT_PRIMARY,
            minWidth: 0,
            flex: "1 1 0",
          }}
        >
          {survey.title}
        </h2>
        {isNew && !isClosed && (
          <InlineBadge label="NEW" color={COLOR.POSITIVE} bgColor={COLOR.POSITIVE_MUTED} />
        )}
        {isClosed && (
          <InlineBadge label="마감" color={COLOR.TEXT_MUTED} bgColor={COLOR.BG_SURFACE} />
        )}
        {!isClosed && daysLeft !== null && (
          <InlineBadge
            label={daysLeft === 0 ? "오늘 마감" : `D-${daysLeft}`}
            color={COLOR.NEGATIVE}
            bgColor={COLOR.NEGATIVE_BG}
          />
        )}
      </div>

      {/* ─── 설명 (1줄 clamp) ───────────────────────────────────────── */}
      {survey.description && (
        <p
          className="line-clamp-1"
          style={{
            ...TYPOGRAPHY.STYLE.BODY_2,
            color: COLOR.TEXT_MUTED,
            marginBottom: "6px",
          }}
        >
          {survey.description}
        </p>
      )}

      {/* ─── 메타 행 ────────────────────────────────────────────────── */}
      <div
        className="flex items-center flex-wrap"
        style={{ gap: "4px", ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
      >
        {survey.purpose && (
          <>
            <span>{SURVEY_PURPOSE_LABELS[survey.purpose as SurveyPurpose] ?? survey.purpose}</span>
            <span style={{ color: COLOR.TEXT_DISABLED }}>·</span>
          </>
        )}
        <span>{survey.question_count > 0 ? formatMinutes(estimatedMins) : "집계 중"}</span>
        {survey.reward_amount && survey.reward_amount > 0 && (
          <>
            <span style={{ color: COLOR.TEXT_DISABLED }}>·</span>
            <span style={{ color: COLOR.REWARD, fontWeight: 600 }}>
              {survey.reward_amount.toLocaleString("ko-KR")}P
            </span>
          </>
        )}
        {survey.max_responses != null ? (
          <>
            <span style={{ color: COLOR.TEXT_DISABLED }}>·</span>
            <span>
              {survey.response_count.toLocaleString()}/{survey.max_responses.toLocaleString()}명
            </span>
          </>
        ) : survey.response_count > 0 ? (
          <>
            <span style={{ color: COLOR.TEXT_DISABLED }}>·</span>
            <span>{survey.response_count.toLocaleString()}명 참여</span>
          </>
        ) : null}
        {spotsLeft !== null && spotsLeft <= 10 && (
          <>
            <span style={{ color: COLOR.TEXT_DISABLED }}>·</span>
            <span style={{ color: spotsLeft === 0 ? COLOR.NEGATIVE : COLOR.WARNING }}>
              {spotsLeft === 0 ? "마감 임박" : `${spotsLeft}자리 남음`}
            </span>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="survey_card_wrap relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor:
          isSelected || (hovered && !isClosed) ? INTERACTION.HOVER_BG : "transparent",
        borderLeft: isSelected ? `2px solid ${COLOR.ACCENT}` : "2px solid transparent",
        // reduce paddingLeft to offset the 2px border so text stays aligned
        paddingLeft: isSelected ? "14px" : "16px",
        marginLeft: "-16px",
        paddingRight: "0",
        // bottom divider — last card has no divider
        borderBottom: isLast ? "none" : `1px solid ${COLOR.BORDER_DEFAULT}`,
        opacity: isClosed ? 0.5 : 1,
        transition: INTERACTION.TRANSITION_BG + ", opacity 200ms ease",
      }}
    >
      {isDesktopSelect ? (
        <div
          className="block"
          style={{ paddingLeft: 0 }}
          onClick={() => {
            if (!isClosed) onSelect(survey.id);
          }}
        >
          {cardInner}
        </div>
      ) : (
        <Link href={`/survey/${survey.id}/respond`} className="block" style={{ paddingLeft: 0 }}>
          {cardInner}
        </Link>
      )}

      {/* ─── 3-dot menu ──────────────────────────────────────────── */}
      <div
        className="absolute top-3 right-3"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
      >
        <Dropdown
          open={menuOpen}
          onOpenChange={setMenuOpen}
          align="right"
          trigger={
            <button
              aria-label="더보기"
              onClick={() => setMenuOpen((v) => !v)}
              onMouseEnter={() => setHovered(false)}
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 28,
                height: 28,
                color: COLOR.TEXT_MUTED,
                backgroundColor: menuOpen ? COLOR.BG_SURFACE : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background-color 150ms ease",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.BG_SURFACE;
              }}
              onMouseOut={(e) => {
                if (!menuOpen)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="8" cy="3" r="1.2" />
                <circle cx="8" cy="8" r="1.2" />
                <circle cx="8" cy="13" r="1.2" />
              </svg>
            </button>
          }
        >
          <DropdownItem
            label="신고하기"
            onClick={() => {
              setMenuOpen(false);
            }}
          />
        </Dropdown>
      </div>
    </div>
  );
}

// ─── HorizontalSurveyCard ─────────────────────────────────────────────────────

function HorizontalSurveyCard({
  survey,
  badge,
}: {
  survey: SurveyListItem;
  badge?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const estimatedMins = resolveEstimatedMinutes(survey.estimated_time, survey.question_count);
  const progressText = survey.max_responses
    ? `${survey.response_count.toLocaleString()}/${survey.max_responses.toLocaleString()}명`
    : `${survey.response_count.toLocaleString()}명`;

  return (
    <Link
      href={`/survey/${survey.id}/respond`}
      className="horizontal_survey_card_wrap pressable block flex-shrink-0 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: "220px",
        maxWidth: "220px",
        backgroundColor: hovered ? INTERACTION.HOVER_BG : COLOR.BG_SURFACE,
        borderRadius: RADIUS.LG,
        padding: "14px 16px",
        transform: hovered ? INTERACTION.SCALE_UP : INTERACTION.SCALE_NONE,
        transition: INTERACTION.TRANSITION_CARD,
      }}
    >
      {badge && <div className="absolute top-3 right-3">{badge}</div>}

      {survey.purpose && (
        <p
          style={{
            fontSize: "11px",
            fontWeight: "500",
            lineHeight: "16px",
            color: COLOR.TEXT_MUTED,
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {SURVEY_PURPOSE_LABELS[survey.purpose as SurveyPurpose] ?? survey.purpose}
        </p>
      )}

      <h3
        className="line-clamp-2"
        style={{
          ...TYPOGRAPHY.STYLE.TITLE_2_KO,
          color: hovered ? COLOR.ACCENT_HOVER : COLOR.TEXT_PRIMARY,
          transition: "color 200ms ease",
          paddingRight: badge ? "28px" : "0",
          marginBottom: "10px",
        }}
      >
        {survey.title}
      </h3>

      <div
        className="flex items-center gap-2"
        style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
      >
        <span>{progressText} 참여</span>
        <span style={{ color: COLOR.TEXT_DISABLED }}>·</span>
        <span>{formatMinutes(estimatedMins)}</span>
        {survey.reward_amount && survey.reward_amount > 0 && (
          <>
            <span style={{ color: COLOR.TEXT_DISABLED }}>·</span>
            <span style={{ color: COLOR.REWARD, fontWeight: 600 }}>
              {survey.reward_amount.toLocaleString("ko-KR")}P
            </span>
          </>
        )}
      </div>
    </Link>
  );
}

// ─── TagFilterModal ───────────────────────────────────────────────────────────

const TAG_CATEGORY_KEYS = [
  "경제금융",
  "사회문화",
  "건강라이프",
  "테크IT",
  "교육학습",
  "기타",
] as const;
type TagCategoryKey = (typeof TAG_CATEGORY_KEYS)[number];

function TagFilterModal({
  open,
  onClose,
  selectedTags,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  selectedTags: string[];
  onApply: (tags: string[]) => void;
}) {
  const [pendingTags, setPendingTags] = useState<string[]>(selectedTags);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setPendingTags(selectedTags);
  }

  if (!open) return null;

  function toggleTag(tag: string) {
    setPendingTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  const chipStyle = (selected: boolean): React.CSSProperties => ({
    ...TYPOGRAPHY.STYLE.LABEL_1,
    padding: "5px 12px",
    borderRadius: RADIUS.PILL,
    border: `1.5px solid ${selected ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
    backgroundColor: selected ? COLOR.ACCENT_MUTED : COLOR.BG_SURFACE,
    color: selected ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
  });

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        onClick={onClose}
      />
      <div
        className="tag_filter_modal_wrap fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col"
        style={{
          maxWidth: 480,
          maxHeight: "85vh",
          backgroundColor: COLOR.BG_BASE,
          borderRadius: RADIUS.XL,
          boxShadow: "0 8px 32px rgba(45,58,74,0.12), 0 2px 8px rgba(45,58,74,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          <span style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}>
            관심 태그를 선택해 주세요
          </span>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: COLOR.TEXT_MUTED,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-5">
            {TAG_CATEGORY_KEYS.map((category) => (
              <div key={category}>
                <p
                  className="mb-2"
                  style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}
                >
                  {category}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {TAG_PRESETS[category as TagCategoryKey].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      style={chipStyle(pendingTags.includes(tag))}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {pendingTags.length > 0 && (
          <div
            className="flex items-center gap-2 px-5 py-3 overflow-x-auto flex-shrink-0"
            style={{
              borderTop: `1px solid ${COLOR.BORDER_DEFAULT}`,
              scrollbarWidth: "none" as const,
            }}
          >
            {pendingTags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  ...TYPOGRAPHY.STYLE.LABEL_2,
                  padding: "4px 10px",
                  borderRadius: RADIUS.PILL,
                  backgroundColor: COLOR.ACCENT_MUTED,
                  color: COLOR.ACCENT,
                  border: `1px solid ${COLOR.ACCENT}`,
                  whiteSpace: "nowrap" as const,
                  flexShrink: 0,
                }}
              >
                {tag}
                <button
                  type="button"
                  aria-label={`${tag} 태그 제거`}
                  onClick={() => toggleTag(tag)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: COLOR.ACCENT,
                    lineHeight: 1,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1 1l8 8M9 1L1 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderTop: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          {pendingTags.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setPendingTags([]);
                onApply([]);
                onClose();
              }}
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_1,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: COLOR.TEXT_MUTED,
                padding: "8px 0",
              }}
            >
              필터 해제하기
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            disabled={pendingTags.length === 0}
            onClick={() => {
              onApply(pendingTags);
              onClose();
            }}
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: "600",
              padding: "10px 20px",
              borderRadius: RADIUS.LG,
              border: "none",
              backgroundColor: pendingTags.length > 0 ? COLOR.ACCENT : COLOR.BG_SURFACE,
              color: pendingTags.length > 0 ? COLOR.TEXT_INVERSE : COLOR.TEXT_DISABLED,
              cursor: pendingTags.length > 0 ? "pointer" : "default",
              transition: "background-color 150ms ease, color 150ms ease",
            }}
          >
            {pendingTags.length > 0 ? `${pendingTags.length}개의 태그 적용하기` : "태그 선택하기"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── PillSegment ──────────────────────────────────────────────────────────────

function PillSegment({
  items,
  value,
  onChange,
}: {
  items: { value: number; label: string }[];
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  const pillStyle = (active: boolean): React.CSSProperties => ({
    ...TYPOGRAPHY.STYLE.LABEL_1,
    fontWeight: "600",
    backgroundColor: active ? COLOR.BG_BASE : "transparent",
    color: active ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
    boxShadow: active ? "0 1px 4px rgba(25,28,30,0.06)" : "none",
    whiteSpace: "nowrap",
    border: "none",
    cursor: "pointer",
  });

  return (
    <div
      className="flex items-center gap-[2px] rounded-[34px] p-[3px] flex-shrink-0 overflow-x-auto scrollbar-hide"
      style={{
        backgroundColor: COLOR.BG_SURFACE,
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <button
        onClick={() => onChange(null)}
        className="px-2.5 py-[4px] rounded-[19px] transition-all flex-shrink-0"
        style={{ ...pillStyle(value === null), scrollSnapAlign: "start" }}
      >
        전체
      </button>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className="px-2.5 py-[4px] rounded-[19px] transition-all flex-shrink-0"
          style={{ ...pillStyle(value === item.value), scrollSnapAlign: "start" }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── CategoryDropdown ─────────────────────────────────────────────────────────

function CategoryDropdown({
  tags,
  selectedTags,
  onToggle,
}: {
  tags: SurveyPurpose[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const triggerLabel =
    selectedTags.length === 0
      ? "설문 목적"
      : selectedTags.length === 1
        ? SURVEY_PURPOSE_LABELS[selectedTags[0] as SurveyPurpose]
        : `${SURVEY_PURPOSE_LABELS[selectedTags[0] as SurveyPurpose]} +${selectedTags.length - 1}`;

  const isActive = selectedTags.length > 0;

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      align="left"
      trigger={
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: RADIUS.LG,
            border: `1px solid ${isActive ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
            backgroundColor: isActive ? COLOR.ACCENT_LIGHT : COLOR.BG_BASE,
            color: isActive ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all 150ms ease",
          }}
        >
          {triggerLabel}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 150ms ease",
              flexShrink: 0,
            }}
          >
            <path d="M2 4l4 4 4-4" />
          </svg>
        </button>
      }
    >
      {tags.map((tag) => {
        const checked = selectedTags.includes(tag);
        return (
          <li
            key={tag}
            onClick={() => onToggle(tag)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 14px",
              cursor: "pointer",
              ...TYPOGRAPHY.STYLE.LABEL_1,
              color: COLOR.TEXT_PRIMARY,
              backgroundColor: "transparent",
              transition: "background-color 100ms ease",
              listStyle: "none",
              userSelect: "none",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = COLOR.BG_SURFACE)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
            }
          >
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                border: `1.5px solid ${checked ? COLOR.ACCENT : COLOR.BORDER_INPUT}`,
                backgroundColor: checked ? COLOR.ACCENT : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 120ms ease",
              }}
            >
              {checked && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke={COLOR.TEXT_INVERSE}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              )}
            </span>
            {SURVEY_PURPOSE_LABELS[tag]}
          </li>
        );
      })}
    </Dropdown>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

function FilterBar({
  purposeTags,
  selectedPurposeTags,
  onPurposeTagToggle,
  selectedTagFilters,
  onTagFiltersApply,
  rewardTier,
  onRewardTierChange,
  questionLimit,
  onQuestionLimitChange,
}: {
  purposeTags: SurveyPurpose[];
  selectedPurposeTags: string[];
  onPurposeTagToggle: (tag: string) => void;
  selectedTagFilters: string[];
  onTagFiltersApply: (tags: string[]) => void;
  rewardTier: RewardTier;
  onRewardTierChange: (tier: RewardTier) => void;
  questionLimit: QuestionLimit;
  onQuestionLimitChange: (limit: QuestionLimit) => void;
}) {
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const isTagActive = selectedTagFilters.length > 0;

  return (
    <>
      <div className="filter_bar_wrap flex items-center gap-3 overflow-x-auto">
        <CategoryDropdown
          tags={purposeTags}
          selectedTags={selectedPurposeTags}
          onToggle={onPurposeTagToggle}
        />
        <button
          type="button"
          onClick={() => setTagModalOpen(true)}
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: RADIUS.LG,
            border: `1px solid ${isTagActive ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
            backgroundColor: isTagActive ? COLOR.ACCENT_MUTED : COLOR.BG_BASE,
            color: isTagActive ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
            cursor: "pointer",
            whiteSpace: "nowrap" as const,
            flexShrink: 0,
            transition: "all 150ms ease",
          }}
        >
          {isTagActive ? `태그 ${selectedTagFilters.length}개` : "태그로 찾기"}
        </button>
        <PillSegment
          items={REWARD_TIERS}
          value={rewardTier}
          onChange={(v) => onRewardTierChange(v as RewardTier)}
        />
        <PillSegment
          items={QUESTION_LIMITS}
          value={questionLimit}
          onChange={(v) => onQuestionLimitChange(v as QuestionLimit)}
        />
      </div>

      <TagFilterModal
        open={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        selectedTags={selectedTagFilters}
        onApply={onTagFiltersApply}
      />
    </>
  );
}

// ─── FilterResetButton ────────────────────────────────────────────────────────

function FilterResetButton({ onReset }: { onReset: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label="필터 초기화"
      onClick={onReset}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: hovered ? COLOR.TEXT_SECONDARY : COLOR.TEXT_MUTED,
        padding: 0,
        transition: "color 150ms ease",
        flexShrink: 0,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <path d="M3 3l10 10M13 3L3 13" />
      </svg>
    </button>
  );
}

// ─── SortDropdown ─────────────────────────────────────────────────────────────

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "latest", label: "최신순" },
  { key: "popular", label: "참여 많은 순" },
];

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (next: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const currentLabel = SORT_OPTIONS.find((o) => o.key === value)?.label ?? "최신순";

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      align="right"
      trigger={<DropdownTrigger label={currentLabel} open={open} variant="ghost" />}
    >
      {SORT_OPTIONS.map((opt) => (
        <DropdownItem
          key={opt.key}
          label={opt.label}
          selected={value === opt.key}
          onClick={() => {
            onChange(opt.key);
            setOpen(false);
          }}
        />
      ))}
    </Dropdown>
  );
}

// ─── ClosingSection ───────────────────────────────────────────────────────────

const CARD_SCROLL_WIDTH = 220 + 12;

function ClosingSection({ surveys }: { surveys: SurveyListItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  if (surveys.length === 0) return null;

  function scrollTo(nextIndex: number) {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(nextIndex, surveys.length - 1));
    setScrollIndex(clamped);
    el.scrollTo({ left: clamped * CARD_SCROLL_WIDTH, behavior: "smooth" });
  }

  const atStart = scrollIndex === 0;
  const atEnd = scrollIndex >= surveys.length - 1;

  const arrowBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: `1px solid ${COLOR.BORDER_DEFAULT}`,
    backgroundColor: COLOR.BG_BASE,
    cursor: "pointer",
    flexShrink: 0,
    transition: INTERACTION.TRANSITION_BG,
    color: COLOR.TEXT_SECONDARY,
  };

  return (
    <div className="closing_section_area mb-6">
      {/* 섹션 헤딩 */}
      <div
        style={{
          fontSize: "11px",
          fontWeight: "600",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: COLOR.TEXT_MUTED,
          padding: "0 0 8px",
        }}
      >
        곧 마감
      </div>

      <div className="relative">
        <button
          aria-label="이전 설문"
          onClick={() => scrollTo(scrollIndex - 1)}
          style={{
            ...arrowBase,
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            opacity: atStart ? 0 : 1,
            pointerEvents: atStart ? "none" : "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = INTERACTION.HOVER_BG;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.BG_BASE;
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 2L4 7l5 5" />
          </svg>
        </button>

        <button
          aria-label="다음 설문"
          onClick={() => scrollTo(scrollIndex + 1)}
          style={{
            ...arrowBase,
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            opacity: atEnd ? 0 : 1,
            pointerEvents: atEnd ? "none" : "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = INTERACTION.HOVER_BG;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.BG_BASE;
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 2l5 5-5 5" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 pb-1"
          style={{ overflowX: "hidden", scrollbarWidth: "none" }}
        >
          {surveys.map((survey) => {
            const daysLeft = survey.end_date ? getDaysUntilEnd(survey.end_date) : null;
            const badge =
              daysLeft !== null ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "1px 7px",
                    borderRadius: RADIUS.PILL,
                    fontSize: "11px",
                    fontWeight: "600",
                    lineHeight: "16px",
                    backgroundColor: COLOR.NEGATIVE_BG,
                    color: COLOR.NEGATIVE,
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {daysLeft === 0 ? "D-Day" : `D-${daysLeft}`}
                </span>
              ) : null;

            return <HorizontalSurveyCard key={survey.id} survey={survey} badge={badge} />;
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SurveyListClient({
  surveys,
  onSurveySelect,
  selectedSurveyId,
}: {
  surveys: SurveyListItem[];
  onSurveySelect?: (id: string) => void;
  selectedSurveyId?: string | null;
}) {
  const CHUNK_SIZE = 12;

  const [sortKey, setSortKey] = useState<SortKey>("latest");
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedPurposeTags, setSelectedPurposeTags] = useState<string[]>([]);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [rewardTier, setRewardTier] = useState<RewardTier>(null);
  const [questionLimit, setQuestionLimit] = useState<QuestionLimit>(null);
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handlePurposeTagToggle = (tag: string) => {
    setSelectedPurposeTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const purposeTags = Object.keys(SURVEY_PURPOSE_LABELS) as SurveyPurpose[];

  useEffect(() => {
    setVisibleCount(CHUNK_SIZE);
  }, [sortKey, activeOnly, selectedPurposeTags, selectedTagFilters, rewardTier, questionLimit]);

  const closingSurveys = surveys.filter(
    (s) => s.end_date !== null && getDaysUntilEnd(s.end_date) !== null
  );

  const filteredSurveys = surveys.filter((s) => {
    if (activeOnly && (s.status === "closed" || s.status === "archived")) return false;
    if (selectedPurposeTags.length > 0 && (!s.purpose || !selectedPurposeTags.includes(s.purpose)))
      return false;
    if (selectedTagFilters.length > 0) {
      if (!s.tags || !s.tags.some((t) => selectedTagFilters.includes(t))) return false;
    }
    if (rewardTier !== null && !(s.reward_amount && s.reward_amount >= rewardTier)) return false;
    if (questionLimit !== null && s.question_count > questionLimit) return false;
    return true;
  });

  const sortedSurveys = [...filteredSurveys].sort((a, b) => {
    if (sortKey === "popular") {
      return b.response_count - a.response_count;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    if (visibleCount >= sortedSurveys.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + CHUNK_SIZE, sortedSurveys.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, sortedSurveys.length]);

  const hasActiveFilter =
    selectedPurposeTags.length > 0 ||
    selectedTagFilters.length > 0 ||
    rewardTier !== null ||
    questionLimit !== null;

  return (
    <div className="survey_list_area">
      {/* 전체 빈 상태 */}
      {surveys.length === 0 && (
        <div
          className="survey_empty_state flex flex-col items-center justify-center py-20 rounded-xl text-center"
          style={{ backgroundColor: COLOR.BG_SURFACE }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            className="mb-3"
            style={{ color: COLOR.TEXT_DISABLED }}
          >
            <rect
              x="8"
              y="6"
              width="24"
              height="28"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M14 14h12M14 19h12M14 24h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_SECONDARY }}>
            아직 공개된 설문이 없어요
          </p>
          <p className="mt-1" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            첫 번째 설문을 만들어보세요
          </p>
        </div>
      )}

      {/* 곧 마감 섹션 */}
      <ClosingSection surveys={closingSurveys} />

      {/* 필터 바 — sticky */}
      <div
        className="filter_bar_outer_wrap flex items-center justify-between gap-3"
        style={{
          position: "sticky",
          top: 52,
          zIndex: 90,
          backgroundColor: COLOR.BG_BASE,
          paddingTop: 12,
          paddingBottom: 12,
          marginTop: -12,
        }}
      >
        <FilterBar
          purposeTags={purposeTags}
          selectedPurposeTags={selectedPurposeTags}
          onPurposeTagToggle={handlePurposeTagToggle}
          selectedTagFilters={selectedTagFilters}
          onTagFiltersApply={setSelectedTagFilters}
          rewardTier={rewardTier}
          onRewardTierChange={setRewardTier}
          questionLimit={questionLimit}
          onQuestionLimitChange={setQuestionLimit}
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <SortDropdown value={sortKey} onChange={setSortKey} />
          {(selectedPurposeTags.length > 0 ||
            selectedTagFilters.length > 0 ||
            sortKey !== "latest" ||
            rewardTier !== null ||
            questionLimit !== null) && (
            <FilterResetButton
              onReset={() => {
                setActiveOnly(false);
                setSelectedPurposeTags([]);
                setSelectedTagFilters([]);
                setSortKey("latest");
                setRewardTier(null);
                setQuestionLimit(null);
              }}
            />
          )}
        </div>
      </div>

      {/* 필터 요약 문장 */}
      {hasActiveFilter &&
        (() => {
          const keywords: string[] = [];
          selectedPurposeTags
            .slice(0, 2)
            .forEach((t) => keywords.push(SURVEY_PURPOSE_LABELS[t as SurveyPurpose] ?? t));
          if (rewardTier !== null) {
            const tier = REWARD_TIERS.find((r) => r.value === rewardTier);
            if (tier) keywords.push(tier.label);
          }
          if (questionLimit !== null) {
            const limit = QUESTION_LIMITS.find((l) => l.value === questionLimit);
            if (limit) keywords.push(limit.label);
          }
          if (keywords.length === 0) return null;
          return (
            <div
              className="flex items-center gap-1.5 mb-2"
              style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  backgroundColor: COLOR.ACCENT,
                  flexShrink: 0,
                }}
              />
              <span>
                <span style={{ color: COLOR.TEXT_PRIMARY }}>{keywords.join(", ")}</span> 설문을 보고
                있어요
              </span>
            </div>
          );
        })()}

      {/* 카드 리스트 */}
      {sortedSurveys.length === 0 && surveys.length > 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 rounded-xl text-center"
          style={{ backgroundColor: COLOR.BG_SURFACE }}
        >
          <p style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_SECONDARY }}>
            조건에 맞는 설문이 없어요
          </p>
          <p className="mt-1" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            필터를 바꿔서 다시 확인해 보세요
          </p>
        </div>
      ) : (
        <>
          {/* 섹션 헤딩 */}
          {sortedSurveys.length > 0 && (
            <div className="flex items-center justify-between" style={{ padding: "20px 0 8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  color: COLOR.TEXT_MUTED,
                }}
              >
                전체 설문 {sortedSurveys.length}개
              </span>
              <label
                className="flex items-center gap-1.5 cursor-pointer"
                style={{ userSelect: "none" }}
              >
                <input
                  type="checkbox"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                  style={{ cursor: "pointer", accentColor: COLOR.ACCENT }}
                />
                <span
                  style={{
                    ...TYPOGRAPHY.STYLE.LABEL_2,
                    color: COLOR.TEXT_SECONDARY,
                    whiteSpace: "nowrap",
                  }}
                >
                  진행 중인 설문
                </span>
              </label>
            </div>
          )}
          <div
            className="survey_card_list_area"
            style={{
              // left offset for the isSelected border-left indent
              paddingLeft: "16px",
            }}
          >
            {sortedSurveys.slice(0, visibleCount).map((survey, i) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                onSelect={onSurveySelect}
                isSelected={selectedSurveyId === survey.id}
                isLast={i === Math.min(visibleCount, sortedSurveys.length) - 1}
              />
            ))}
          </div>
          {visibleCount < sortedSurveys.length && <div ref={sentinelRef} style={{ height: 1 }} />}
        </>
      )}
    </div>
  );
}
