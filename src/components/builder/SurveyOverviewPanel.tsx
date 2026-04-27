"use client";

import { useState, type FC } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { COLOR, INTERACTION, RADIUS, SHADOW, TYPOGRAPHY } from "@/lib/design-tokens";
import { DatePicker } from "./DatePicker";
import { SURVEY_PURPOSE_LABELS } from "@/lib/types/survey";
import type { SurveyPurpose, TargetParticipantCount, RewardType } from "@/lib/types/survey";

interface SurveyOverviewPanelProps {
  onMetaSave: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  draft: "초안",
  published: "공개 중",
  closed: "마감",
  archived: "보관됨",
};

function statusBadgeStyle(status: string): { backgroundColor: string; color: string } {
  switch (status) {
    case "published":
      return { backgroundColor: "rgba(2, 162, 98, 0.1)", color: COLOR.POSITIVE };
    case "closed":
      return { backgroundColor: COLOR.BG_SECTION, color: COLOR.TEXT_MUTED };
    case "archived":
      return { backgroundColor: "rgba(217, 119, 6, 0.1)", color: COLOR.WARNING };
    default:
      return { backgroundColor: COLOR.ACCENT_MUTED, color: COLOR.ACCENT };
  }
}

const CATEGORIES = Object.keys(SURVEY_PURPOSE_LABELS) as SurveyPurpose[];

const TARGET_COUNTS: TargetParticipantCount[] = [10, 30, 50];

interface RewardTier {
  id: string;
  label: string;
  pointLabel: string;
  rewardType: RewardType;
  rewardAmount: number;
  rewardWinnerCount: number | null;
}

const REWARD_TIERS: RewardTier[] = [
  {
    id: "first_come_1000",
    label: "참여자 전원",
    pointLabel: "1,000P",
    rewardType: "first_come",
    rewardAmount: 1000,
    rewardWinnerCount: null,
  },
  {
    id: "random_5000",
    label: "추첨 10명",
    pointLabel: "5,000P",
    rewardType: "random",
    rewardAmount: 5000,
    rewardWinnerCount: 10,
  },
  {
    id: "random_10000",
    label: "추첨 5명",
    pointLabel: "10,000P",
    rewardType: "random",
    rewardAmount: 10000,
    rewardWinnerCount: 5,
  },
];

function getSelectedTierId(rewardType: RewardType, rewardAmount: number | null): string | null {
  if (rewardType === "none") return null;
  const tier = REWARD_TIERS.find(
    (t) => t.rewardType === rewardType && t.rewardAmount === rewardAmount
  );
  return tier?.id ?? null;
}

export const SurveyOverviewPanel: FC<SurveyOverviewPanelProps> = ({ onMetaSave }) => {
  const surveyTitle = useBuilderStore((s) => s.surveyTitle);
  const surveyStatus = useBuilderStore((s) => s.surveyStatus);
  const surveyDescription = useBuilderStore((s) => s.surveyDescription);
  const surveyPurpose = useBuilderStore((s) => s.surveyPurpose);
  const surveyEndDate = useBuilderStore((s) => s.surveyEndDate);
  const surveyEstimatedTime = useBuilderStore((s) => s.surveyEstimatedTime);
  const surveyRewardAmount = useBuilderStore((s) => s.surveyRewardAmount);
  const surveyRewardType = useBuilderStore((s) => s.surveyRewardType);
  const surveyRewardWinnerCount = useBuilderStore((s) => s.surveyRewardWinnerCount);
  const surveyTargetParticipantCount = useBuilderStore((s) => s.surveyTargetParticipantCount);
  const sections = useBuilderStore((s) => s.sections);
  const questions = useBuilderStore((s) => s.questions);
  const responseCount = useBuilderStore((s) => s.responseCount);

  const setSurveyDescription = useBuilderStore((s) => s.setSurveyDescription);
  const setSurveyPurpose = useBuilderStore((s) => s.setSurveyPurpose);
  const setSurveyEndDate = useBuilderStore((s) => s.setSurveyEndDate);
  const setSurveyEstimatedTime = useBuilderStore((s) => s.setSurveyEstimatedTime);
  const setSurveyRewardAmount = useBuilderStore((s) => s.setSurveyRewardAmount);
  const setSurveyRewardType = useBuilderStore((s) => s.setSurveyRewardType);
  const setSurveyRewardWinnerCount = useBuilderStore((s) => s.setSurveyRewardWinnerCount);
  const setSurveyTargetParticipantCount = useBuilderStore((s) => s.setSurveyTargetParticipantCount);

  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [hoveredCount, setHoveredCount] = useState<number | null>(null);
  const [hoveredTierId, setHoveredTierId] = useState<string | null>(null);

  const badgeStyle = statusBadgeStyle(surveyStatus);
  const selectedTierId = getSelectedTierId(surveyRewardType, surveyRewardAmount);
  const isPublished = surveyStatus === "published";

  function handleCategoryClick(cat: SurveyPurpose) {
    if (surveyPurpose === cat) {
      setSurveyPurpose(null);
    } else {
      setSurveyPurpose(cat);
    }
    onMetaSave();
  }

  function handleTargetCountClick(count: TargetParticipantCount) {
    if (surveyTargetParticipantCount === count) {
      setSurveyTargetParticipantCount(null);
    } else {
      setSurveyTargetParticipantCount(count);
    }
    onMetaSave();
  }

  function handleTierClick(tier: RewardTier) {
    if (isPublished) return;
    if (selectedTierId === tier.id) {
      setSurveyRewardType("none");
      setSurveyRewardAmount(null);
      setSurveyRewardWinnerCount(null);
    } else {
      setSurveyRewardType(tier.rewardType);
      setSurveyRewardAmount(tier.rewardAmount);
      setSurveyRewardWinnerCount(tier.rewardWinnerCount);
    }
    onMetaSave();
  }

  return (
    <div
      className="survey_overview_wrap flex flex-col h-full overflow-y-auto"
      style={{ backgroundColor: COLOR.BG_BASE }}
    >
      {/* ── 기본 정보 ── */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}>
        <p className="mb-4 text-xs font-semibold" style={{ color: COLOR.TEXT_MUTED }}>
          기본 정보
        </p>

        <div className="flex flex-col gap-4">
          {/* 설명 */}
          <FieldGroup label="설명">
            <textarea
              rows={3}
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              onBlur={onMetaSave}
              placeholder="설문 목적이나 주제를 간단히 적어 주세요"
              className="w-full resize-none opinion-input"
              style={inputStyle}
            />
          </FieldGroup>

          {/* 카테고리 */}
          <FieldGroup label="카테고리">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {CATEGORIES.map((cat) => {
                const isSelected = surveyPurpose === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    onMouseEnter={() => setHoveredCat(cat)}
                    onMouseLeave={() => setHoveredCat(null)}
                    aria-pressed={isSelected}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      borderRadius: RADIUS.PILL,
                      cursor: "pointer",
                      border: `1px solid ${isSelected ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
                      backgroundColor: isSelected
                        ? hoveredCat === cat
                          ? INTERACTION.ACTIVE_BG
                          : COLOR.ACCENT_MUTED
                        : hoveredCat === cat
                          ? INTERACTION.HOVER_BG_SURFACE
                          : COLOR.BG_SURFACE,
                      color: isSelected ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
                      lineHeight: "1.4",
                      transition: INTERACTION.TRANSITION_BG,
                    }}
                  >
                    {SURVEY_PURPOSE_LABELS[cat]}
                  </button>
                );
              })}
            </div>
          </FieldGroup>

          {/* 마감일 */}
          <FieldGroup label="마감일">
            <DatePicker value={surveyEndDate} onChange={setSurveyEndDate} onConfirm={onMetaSave} />
          </FieldGroup>

          {/* 목표 참여자 수 */}
          <FieldGroup label="목표 참여자 수">
            <div style={{ display: "flex", gap: "6px" }}>
              {TARGET_COUNTS.map((count) => {
                const isSelected = surveyTargetParticipantCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handleTargetCountClick(count)}
                    onMouseEnter={() => setHoveredCount(count)}
                    onMouseLeave={() => setHoveredCount(null)}
                    aria-pressed={isSelected}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "6px 0",
                      borderRadius: RADIUS.PILL,
                      cursor: "pointer",
                      fontSize: "12px",
                      border: `1px solid ${isSelected ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
                      backgroundColor: isSelected
                        ? hoveredCount === count
                          ? INTERACTION.ACTIVE_BG
                          : COLOR.ACCENT_MUTED
                        : hoveredCount === count
                          ? INTERACTION.HOVER_BG_SURFACE
                          : COLOR.BG_SURFACE,
                      color: isSelected ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
                      lineHeight: "1.4",
                      transition: INTERACTION.TRANSITION_BG,
                    }}
                  >
                    {count}명
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: "11px", color: COLOR.TEXT_MUTED, marginTop: "4px" }}>
              {surveyEndDate && surveyTargetParticipantCount
                ? "먼저 도달하는 조건에서 자동으로 마감돼요"
                : "목표 인원이 채워지면 자동 마감돼요"}
            </p>
          </FieldGroup>

          {/* 예상 소요 시간 */}
          <FieldGroup label="예상 소요 시간 (분)">
            <input
              type="number"
              min={1}
              value={surveyEstimatedTime ?? ""}
              onChange={(e) =>
                setSurveyEstimatedTime(e.target.value ? parseInt(e.target.value, 10) : null)
              }
              onBlur={onMetaSave}
              placeholder="직접 입력 (분)"
              className="opinion-input"
              style={inputStyle}
            />
          </FieldGroup>

          {/* 참여 혜택 — published 상태에서는 변경 불가 */}
          <FieldGroup label="참여 혜택">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                opacity: isPublished ? 0.5 : 1,
              }}
            >
              {REWARD_TIERS.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleTierClick(tier)}
                    onMouseEnter={() => !isPublished && setHoveredTierId(tier.id)}
                    onMouseLeave={() => setHoveredTierId(null)}
                    disabled={isPublished}
                    aria-pressed={isSelected}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderRadius: RADIUS.MD,
                      cursor: isPublished ? "not-allowed" : "pointer",
                      border: `1px solid ${isSelected ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
                      backgroundColor: isSelected
                        ? hoveredTierId === tier.id
                          ? INTERACTION.ACTIVE_BG
                          : COLOR.ACCENT_MUTED
                        : hoveredTierId === tier.id
                          ? INTERACTION.HOVER_BG_SURFACE
                          : COLOR.BG_SURFACE,
                      width: "100%",
                      textAlign: "left",
                      transition: INTERACTION.TRANSITION_BG,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: isSelected ? COLOR.ACCENT : COLOR.TEXT_PRIMARY,
                      }}
                    >
                      {tier.pointLabel}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: isSelected ? COLOR.ACCENT : COLOR.TEXT_MUTED,
                      }}
                    >
                      {tier.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {isPublished && (
              <p style={{ fontSize: "11px", color: COLOR.TEXT_MUTED, marginTop: "2px" }}>
                공개된 설문의 혜택은 변경할 수 없어요
              </p>
            )}
            {!isPublished && surveyRewardType === "none" && (
              <p style={{ fontSize: "11px", color: COLOR.TEXT_MUTED, marginTop: "2px" }}>
                혜택을 선택하지 않으면 참여 인센티브가 없어요
              </p>
            )}
          </FieldGroup>
        </div>
      </div>

      {/* ── 현황 ── */}
      <div className="px-5 pt-5 pb-6">
        <p className="text-xs font-semibold mb-3" style={{ color: COLOR.TEXT_MUTED }}>
          현황
        </p>
        <div className="flex flex-col gap-2">
          <StatRow label="섹션" value={sections.length} unit="개" />
          <StatRow label="질문" value={questions.length} unit="개" />
          <StatRow label="응답" value={responseCount} unit="건" />
          {responseCount > 0 && (
            <p style={{ fontSize: "11px", color: COLOR.TEXT_MUTED, marginTop: "2px" }}>
              응답이 있어 일부 수정이 제한돼요
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── 공통 input 스타일 ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: COLOR.BG_BASE,
  border: `1px solid ${COLOR.BORDER_DEFAULT}`,
  borderRadius: RADIUS.MD,
  padding: "8px 12px",
  fontSize: "13px",
  color: COLOR.TEXT_PRIMARY,
};

// ── FieldGroup ────────────────────────────────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label
        style={{
          fontSize: "11px",
          fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
          color: COLOR.TEXT_MUTED,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ── StatRow ───────────────────────────────────────────────────────────────────

interface StatRowProps {
  label: string;
  value: number;
  unit: string;
}

const StatRow: FC<StatRowProps> = ({ label, value, unit }) => (
  <div
    className="flex items-center justify-between py-2.5 px-3 rounded-lg"
    style={{ backgroundColor: COLOR.BG_SURFACE, borderRadius: RADIUS.MD, boxShadow: SHADOW.CARD }}
  >
    <span className="text-sm" style={{ color: COLOR.TEXT_SECONDARY }}>
      {label}
    </span>
    <span className="text-sm font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
      {value.toLocaleString()}
      <span className="ml-0.5 font-normal text-xs" style={{ color: COLOR.TEXT_MUTED }}>
        {unit}
      </span>
    </span>
  </div>
);
