"use client";

import { useState } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { ConditionalRule, MultipleChoiceConfig, Question } from "@/lib/types/survey";
import { COLOR } from "@/lib/design-tokens";
import { Dropdown, DropdownItem } from "@/components/ui";

interface Props {
  question: Question;
  surveyId: string;
}

export function encodeTarget(
  rule:
    | ConditionalRule
    | {
        action: "jump_to_section" | "jump_to_question";
        targetSectionId?: string;
        targetQuestionId?: string;
      }
    | undefined
    | null
): string {
  if (!rule) return "";
  if (rule.action === "jump_to_section" && rule.targetSectionId)
    return `section:${rule.targetSectionId}`;
  if (rule.action === "jump_to_question" && rule.targetQuestionId)
    return `question:${rule.targetQuestionId}`;
  return "";
}

export function decodeTarget(
  value: string
): Omit<ConditionalRule, "answerValue" | "optionIndex"> | null {
  if (!value) return null;
  const [type, id] = value.split(":");
  if (type === "section") return { action: "jump_to_section", targetSectionId: id };
  if (type === "question") return { action: "jump_to_question", targetQuestionId: id };
  return null;
}

// Hook that provides a per-option route-row renderer and a default route row renderer —
// used by MultipleChoiceEditor to render inline route selectors within OptionsEditor
// and a global default destination selector below the options list.
export function useConditionalRouteRows(question: Question, surveyId: string, locked = false) {
  const { sections, questions, updateQuestionConfig, setIsSaving } = useBuilderStore();
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);
  const [openDefaultDropdown, setOpenDefaultDropdown] = useState(false);

  const config = (question.config as MultipleChoiceConfig) ?? {
    allowMultiple: false,
    randomOrder: false,
  };
  const rules: ConditionalRule[] = config.conditionalRules ?? [];

  const sortedSections = sections.slice().sort((a, b) => a.order_index - b.order_index);
  const sortedAll = questions.slice().sort((a, b) => a.order_index - b.order_index);
  const questionPos = sortedAll.findIndex((q) => q.id === question.id);
  const laterQuestions = sortedAll.slice(questionPos + 1);

  async function saveRules(nextRules: ConditionalRule[]) {
    const nextConfig: MultipleChoiceConfig = {
      ...config,
      conditionalRules: nextRules.length > 0 ? nextRules : undefined,
    };
    updateQuestionConfig(question.id, nextConfig);
    setIsSaving(true);
    const res = await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: nextConfig }),
    });
    if (!res.ok) {
      window.dispatchEvent(
        new CustomEvent("survey-save-error", { detail: "저장에 실패했습니다." })
      );
    }
    setIsSaving(false);
  }

  function findRuleByIndex(idx: number, option: string): ConditionalRule | undefined {
    return rules.find((r) =>
      r.optionIndex !== undefined ? r.optionIndex === idx : r.answerValue === option
    );
  }

  async function saveDefaultRoute(selectValue: string) {
    const decoded = decodeTarget(selectValue);
    const nextConfig: MultipleChoiceConfig = {
      ...config,
      defaultRoute: decoded
        ? {
            action: decoded.action,
            targetSectionId: decoded.targetSectionId,
            targetQuestionId: decoded.targetQuestionId,
          }
        : null,
    };
    updateQuestionConfig(question.id, nextConfig);
    setIsSaving(true);
    const res = await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: nextConfig }),
    });
    if (!res.ok) {
      window.dispatchEvent(
        new CustomEvent("survey-save-error", { detail: "저장에 실패했습니다." })
      );
    }
    setIsSaving(false);
    setOpenDefaultDropdown(false);
  }

  function handleRuleChange(idx: number, answerValue: string, selectValue: string) {
    const decoded = decodeTarget(selectValue);
    const without = rules.filter((r) =>
      r.optionIndex !== undefined ? r.optionIndex !== idx : r.answerValue !== answerValue
    );
    if (!decoded) {
      saveRules(without);
    } else {
      saveRules([...without, { optionIndex: idx, answerValue, ...decoded }]);
    }
    setOpenDropdownIdx(null);
  }

  function sectionQIndex(questionId: string): number {
    const q = sortedAll.find((q) => q.id === questionId);
    if (!q) return 0;
    return sortedAll
      .filter((sq) => sq.section_id === q.section_id)
      .findIndex((sq) => sq.id === questionId);
  }

  function getTargetLabel(value: string): string {
    if (!value) return "다음 질문으로 이동";
    const [type, id] = value.split(":");
    if (type === "section") {
      const idx = sortedSections.findIndex((s) => s.id === id);
      const section = sortedSections[idx];
      return `섹션 ${idx + 1}${section?.title ? ` — ${section.title}` : ""}`;
    }
    if (type === "question") {
      const q = sortedAll.find((sq) => sq.id === id);
      if (!q) return "Q?";
      const qIdx = sectionQIndex(id);
      return `Q${qIdx + 1}${q.title ? `: ${q.title}` : ""}`;
    }
    return "다음 질문으로 이동";
  }

  const laterBySection = sortedSections
    .map((section, sIdx) => ({
      section,
      sIdx,
      questions: laterQuestions.filter((q) => q.section_id === section.id),
    }))
    .filter((g) => g.questions.length > 0);

  // Returns the inline route-row for a single option — rendered below its option row
  function renderRouteRow(idx: number, option: string) {
    const existingRule = findRuleByIndex(idx, option);
    const currentValue = encodeTarget(existingRule);

    return (
      <div
        className="flex items-center justify-end gap-2 mt-1"
        style={{ paddingRight: locked ? 0 : 20 }}
      >
        <span
          className="flex-shrink-0 font-medium flex items-center gap-1"
          style={{ color: COLOR.TEXT_MUTED, minWidth: 28, fontSize: "11px" }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M2 3C2 3 2 7 6 7H9M9 7L7 5M9 7L7 9"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          경로
        </span>
        <Dropdown
          className="w-[160px]"
          open={openDropdownIdx === idx}
          onOpenChange={(next) => setOpenDropdownIdx(next ? idx : null)}
          trigger={
            <button
              type="button"
              className="w-full flex items-center justify-between gap-1 text-sm rounded-lg px-[9px] py-1.5 transition-colors text-left"
              style={{
                color: COLOR.TEXT_PRIMARY,
                backgroundColor: COLOR.BG_INPUT,
                border: `1px solid ${COLOR.BORDER_DEFAULT}`,
                outline: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = COLOR.ACCENT;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = COLOR.BORDER_DEFAULT;
              }}
            >
              <span className="truncate">{getTargetLabel(currentValue)}</span>
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  transform: openDropdownIdx === idx ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 120ms ease",
                }}
              >
                <path
                  d="M1 2.5L4 5.5L7 2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          }
        >
          <DropdownItem
            label="다음 질문으로 이동"
            selected={!currentValue}
            onClick={() => handleRuleChange(idx, option, "")}
          />
          {laterBySection.map(({ section, sIdx, questions: sectionQs }) => (
            <div key={section.id}>
              <p className="text-xs font-medium px-3 pt-3 pb-1" style={{ color: COLOR.TEXT_MUTED }}>
                섹션 {sIdx + 1}
                {section.title ? ` — ${section.title}` : ""}
              </p>
              {sectionQs.map((q) => {
                const qIdx = sectionQIndex(q.id);
                return (
                  <DropdownItem
                    key={q.id}
                    label={`Q${qIdx + 1}${q.title ? `: ${q.title}` : ""}`}
                    selected={currentValue === `question:${q.id}`}
                    onClick={() => handleRuleChange(idx, option, `question:${q.id}`)}
                  />
                );
              })}
            </div>
          ))}
        </Dropdown>
      </div>
    );
  }

  // Renders a single "default route" selector — used both when conditionalEnabled=false
  // (all options follow this route) and when conditionalEnabled=true (fallback for unmatched options).
  function renderDefaultRouteRow(disabled = false) {
    const currentValue = encodeTarget(config.defaultRoute);

    return (
      <Dropdown
        className="w-[160px]"
        open={!disabled && openDefaultDropdown}
        onOpenChange={(next) => !disabled && setOpenDefaultDropdown(next)}
        trigger={
          <button
            type="button"
            disabled={disabled}
            className="w-full flex items-center justify-between gap-1 text-sm rounded-lg px-[9px] py-1.5 transition-colors text-left"
            style={{
              color: disabled ? COLOR.TEXT_MUTED : COLOR.TEXT_PRIMARY,
              backgroundColor: COLOR.BG_INPUT,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              outline: "none",
              cursor: disabled ? "not-allowed" : undefined,
            }}
            onMouseEnter={(e) => {
              if (!disabled)
                (e.currentTarget as HTMLButtonElement).style.borderColor = COLOR.ACCENT;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = COLOR.BORDER_DEFAULT;
            }}
          >
            <span className="truncate">{getTargetLabel(currentValue)}</span>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              aria-hidden="true"
              style={{
                flexShrink: 0,
                transform: openDefaultDropdown ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 120ms ease",
              }}
            >
              <path
                d="M1 2.5L4 5.5L7 2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        }
      >
        <DropdownItem
          label="다음 질문으로 이동"
          selected={!currentValue}
          onClick={() => saveDefaultRoute("")}
        />
        {laterBySection.map(({ section, sIdx, questions: sectionQs }) => (
          <div key={section.id}>
            <p className="text-xs font-medium px-3 pt-3 pb-1" style={{ color: COLOR.TEXT_MUTED }}>
              섹션 {sIdx + 1}
              {section.title ? ` — ${section.title}` : ""}
            </p>
            {sectionQs.map((q) => {
              const qIdx = sectionQIndex(q.id);
              return (
                <DropdownItem
                  key={q.id}
                  label={`Q${qIdx + 1}${q.title ? `: ${q.title}` : ""}`}
                  selected={currentValue === `question:${q.id}`}
                  onClick={() => saveDefaultRoute(`question:${q.id}`)}
                />
              );
            })}
          </div>
        ))}
      </Dropdown>
    );
  }

  return { renderRouteRow, renderDefaultRouteRow };
}

// Legacy component — kept for backward compat; rendering is now handled inline via useConditionalRouteRows
export function ConditionalLogicEditor({ question, surveyId }: Props) {
  const config = (question.config as MultipleChoiceConfig) ?? {};
  // Rendering moved inline into OptionsEditor via useConditionalRouteRows hook
  void surveyId;
  void question;
  void config;
  return null;
}
