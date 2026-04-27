"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { AppIcon, IconSurveySuccess } from "@/components/ui/icons";
import type {
  Question,
  AnswerValue,
  QuestionConfig,
  ScaleConfig,
  GradeConfig,
  MultipleChoiceConfig,
  CheckboxConfig,
  Section,
} from "@/lib/types/survey";

// ─── Types ────────────────────────────────────────────────────────────────────

type PageState =
  | { kind: "form" }
  | { kind: "submitting" }
  | { kind: "success"; responseId: string }
  | { kind: "blocked"; reason: "already_responded" | "survey_full" | "daily_limit" };

interface Props {
  surveyId: string;
  surveyTitle: string;
  surveyDescription?: string;
  questions: Question[];
  sections: Section[];
  preview?: boolean;
  requiresPointDeduction?: boolean;
  availablePoints?: number;
  canAfford?: boolean;
}

type RespondStep =
  | { kind: "section_transition"; sectionIdx: number }
  | { kind: "question"; sectionIdx: number; questionIdx: number };

interface QuestionGroup {
  section: Section | null;
  questions: Question[];
}

// ─── Group helpers (module-level) ─────────────────────────────────────────────

function groupQuestionsBySection(questions: Question[], sections: Section[]): QuestionGroup[] {
  if (sections.length === 0) return [{ section: null, questions }];

  const groups: QuestionGroup[] = sections.map((s) => ({
    section: s,
    questions: [] as Question[],
  }));
  const unsectioned: Question[] = [];

  for (const q of questions) {
    const idx = q.section_id ? groups.findIndex((g) => g.section?.id === q.section_id) : -1;
    if (idx >= 0) groups[idx].questions.push(q);
    else unsectioned.push(q);
  }

  if (unsectioned.length > 0) groups.push({ section: null, questions: unsectioned });
  return groups;
}

function calcNextStep(groups: QuestionGroup[], step: RespondStep): RespondStep | "submit" {
  if (step.kind === "section_transition") {
    const group = groups[step.sectionIdx];
    if (group.questions.length > 0) {
      return { kind: "question", sectionIdx: step.sectionIdx, questionIdx: 0 };
    }
    if (step.sectionIdx + 1 < groups.length) {
      return { kind: "section_transition", sectionIdx: step.sectionIdx + 1 };
    }
    return "submit";
  }

  const group = groups[step.sectionIdx];
  const nextQIdx = step.questionIdx + 1;
  if (nextQIdx < group.questions.length) {
    return { kind: "question", sectionIdx: step.sectionIdx, questionIdx: nextQIdx };
  }
  if (step.sectionIdx + 1 < groups.length) {
    return { kind: "section_transition", sectionIdx: step.sectionIdx + 1 };
  }
  return "submit";
}

function calcPrevStep(groups: QuestionGroup[], step: RespondStep): RespondStep | null {
  if (step.kind === "section_transition") {
    const prevSectionIdx = step.sectionIdx - 1;
    if (prevSectionIdx < 0) return null;
    const prevGroup = groups[prevSectionIdx];
    if (prevGroup.questions.length > 0) {
      return {
        kind: "question",
        sectionIdx: prevSectionIdx,
        questionIdx: prevGroup.questions.length - 1,
      };
    }
    return { kind: "section_transition", sectionIdx: prevSectionIdx };
  }

  if (step.questionIdx > 0) {
    return { kind: "question", sectionIdx: step.sectionIdx, questionIdx: step.questionIdx - 1 };
  }
  if (step.sectionIdx > 0) {
    return { kind: "section_transition", sectionIdx: step.sectionIdx };
  }
  return null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isAnswerEmpty(value: AnswerValue | undefined): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

// ─── Question Input Components ────────────────────────────────────────────────

function ScaleInput({
  config,
  value,
  onChange,
  hasError,
}: {
  config: ScaleConfig;
  value: AnswerValue | undefined;
  onChange: (v: number) => void;
  hasError: boolean;
}) {
  const current = typeof value === "number" ? value : null;
  const steps: number[] = [];
  for (let i = config.min; i <= config.max; i++) steps.push(i);

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        {steps.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="w-10 h-10 rounded-xl text-sm font-medium transition-colors"
            style={{
              backgroundColor: current === n ? COLOR.ACCENT : COLOR.BG_SECTION,
              color: current === n ? COLOR.TEXT_INVERSE : COLOR.TEXT_PRIMARY,
              border: hasError ? `1.5px solid ${COLOR.NEGATIVE}` : "none",
            }}
          >
            {n}
          </button>
        ))}
      </div>
      {(config.minLabel || config.maxLabel) && (
        <div className="flex justify-between mt-2">
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            {config.minLabel}
          </span>
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            {config.maxLabel}
          </span>
        </div>
      )}
    </div>
  );
}

function GradeInput({
  config,
  value,
  onChange,
  hasError,
}: {
  config: GradeConfig;
  value: AnswerValue | undefined;
  onChange: (v: string) => void;
  hasError: boolean;
}) {
  const current = typeof value === "string" ? value : null;
  return (
    <div className="flex gap-2 flex-wrap">
      {config.grades.map((grade, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onChange(grade)}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{
            backgroundColor: current === grade ? COLOR.ACCENT : COLOR.BG_SECTION,
            color: current === grade ? COLOR.TEXT_INVERSE : COLOR.TEXT_PRIMARY,
            border: hasError ? `1.5px solid ${COLOR.NEGATIVE}` : "none",
          }}
        >
          {grade}
        </button>
      ))}
    </div>
  );
}

function RankingInput({
  options,
  value,
  onChange,
  hasError,
}: {
  options: string[];
  value: AnswerValue | undefined;
  onChange: (v: string[]) => void;
  hasError: boolean;
}) {
  const ranked: string[] = Array.isArray(value) ? (value as string[]) : [];
  const unranked = options.filter((o) => !ranked.includes(o));

  function addToRank(option: string) {
    onChange([...ranked, option]);
  }
  function removeFromRank(option: string) {
    onChange(ranked.filter((o) => o !== option));
  }
  function moveUp(idx: number) {
    if (idx === 0) return;
    const next = [...ranked];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  }
  function moveDown(idx: number) {
    if (idx === ranked.length - 1) return;
    const next = [...ranked];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {ranked.length > 0 && (
        <div className="space-y-1.5">
          {ranked.map((option, idx) => (
            <div
              key={option}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{
                backgroundColor: COLOR.ACCENT_SUBTLE,
                border: `1px solid ${COLOR.ACCENT}`,
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                style={{ backgroundColor: COLOR.ACCENT, color: COLOR.TEXT_INVERSE }}
              >
                {idx + 1}
              </span>
              <span className="flex-1 text-sm" style={{ color: COLOR.TEXT_PRIMARY }}>
                {option}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="w-6 h-6 flex items-center justify-center rounded opacity-60 hover:opacity-100 disabled:opacity-20"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 9V3M3 6l3-3 3 3"
                      stroke={COLOR.TEXT_PRIMARY}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={idx === ranked.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded opacity-60 hover:opacity-100 disabled:opacity-20"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 3v6M3 6l3 3 3-3"
                      stroke={COLOR.TEXT_PRIMARY}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeFromRank(option)}
                  className="w-6 h-6 flex items-center justify-center rounded opacity-60 hover:opacity-100"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M9 3L3 9M3 3l6 6"
                      stroke={COLOR.TEXT_MUTED}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {unranked.length > 0 && (
        <div className="space-y-1.5">
          {ranked.length > 0 && (
            <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }} className="mt-2">
              아래 항목을 탭해서 순서에 추가해요
            </p>
          )}
          {unranked.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => addToRank(option)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left"
              style={{
                backgroundColor: COLOR.BG_SECTION,
                border: hasError
                  ? `1.5px solid ${COLOR.NEGATIVE}`
                  : `1px solid ${COLOR.BORDER_DEFAULT}`,
              }}
            >
              <span
                className="w-5 h-5 rounded-full border shrink-0"
                style={{ borderColor: COLOR.BORDER_DEFAULT }}
              />
              <span className="text-sm" style={{ color: COLOR.TEXT_PRIMARY }}>
                {option}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Single Question Card ─────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  value,
  onChange,
  error,
  questionRef,
}: {
  question: Question;
  index: number;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
  error: boolean;
  questionRef?: React.RefObject<HTMLDivElement | null>;
}) {
  if (question.type === "endpoint") {
    const cfg = question.config as { message?: string } | null;
    return (
      <div
        ref={questionRef}
        className="question_card_wrap rounded-2xl px-6 py-6"
        style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}`, backgroundColor: COLOR.BG_BASE }}
      >
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>
          {cfg?.message ?? question.title}
        </p>
      </div>
    );
  }

  function renderInput() {
    const cfg = question.config as QuestionConfig | null;

    switch (question.type) {
      case "short_text": {
        const c = cfg as { placeholder?: string; maxLength?: number } | null;
        return (
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={c?.placeholder ?? "답변을 입력해 주세요"}
            maxLength={c?.maxLength}
            className="w-full px-4 py-3 rounded-xl outline-none transition-colors"
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              border: `1.5px solid ${error ? COLOR.NEGATIVE : COLOR.BORDER_INPUT}`,
              ...TYPOGRAPHY.STYLE.BODY_1,
              color: COLOR.TEXT_PRIMARY,
            }}
          />
        );
      }

      case "long_text": {
        const c = cfg as { maxLength?: number } | null;
        return (
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="답변을 입력해 주세요"
            maxLength={c?.maxLength}
            rows={4}
            className="w-full px-4 py-3 rounded-xl outline-none transition-colors resize-none"
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              border: `1.5px solid ${error ? COLOR.NEGATIVE : COLOR.BORDER_INPUT}`,
              ...TYPOGRAPHY.STYLE.BODY_1,
              color: COLOR.TEXT_PRIMARY,
            }}
          />
        );
      }

      case "scale": {
        const c = (cfg as ScaleConfig | null) ?? { min: 1, max: 5 };
        return (
          <ScaleInput config={c} value={value} onChange={(n) => onChange(n)} hasError={error} />
        );
      }

      case "grade": {
        const c = (cfg as GradeConfig | null) ?? { grades: ["A", "B", "C", "D", "E"] };
        return (
          <GradeInput config={c} value={value} onChange={(v) => onChange(v)} hasError={error} />
        );
      }

      case "multiple_choice": {
        const c = cfg as MultipleChoiceConfig | null;
        const allowMultiple = c?.allowMultiple ?? false;
        const opts = question.options ?? [];

        if (allowMultiple) {
          const selected: string[] = Array.isArray(value) ? (value as string[]) : [];
          return (
            <div className="space-y-2">
              {opts.map((opt) => {
                const checked = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(checked ? selected.filter((o) => o !== opt) : [...selected, opt]);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
                    style={{
                      backgroundColor: checked ? COLOR.ACCENT_SUBTLE : COLOR.BG_SECTION,
                      border: `1.5px solid ${error && !checked ? COLOR.NEGATIVE : checked ? COLOR.ACCENT : "transparent"}`,
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: checked ? COLOR.ACCENT : COLOR.BG_BASE,
                        border: `1.5px solid ${checked ? COLOR.ACCENT : COLOR.BORDER_INPUT}`,
                      }}
                    >
                      {checked && (
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                          <path
                            d="M1 4l3 3 6-6"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        }

        const selected = typeof value === "string" ? value : null;
        return (
          <div className="space-y-2">
            {opts.map((opt) => {
              const isSelected = selected === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange(opt)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
                  style={{
                    backgroundColor: isSelected ? COLOR.ACCENT_SUBTLE : COLOR.BG_SECTION,
                    border: `1.5px solid ${error && !isSelected ? COLOR.NEGATIVE : isSelected ? COLOR.ACCENT : "transparent"}`,
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isSelected ? COLOR.ACCENT : COLOR.BG_BASE,
                      border: `1.5px solid ${isSelected ? COLOR.ACCENT : COLOR.BORDER_INPUT}`,
                    }}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                  <span style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        );
      }

      case "checkbox": {
        const c = cfg as CheckboxConfig | null;
        const selected: string[] = Array.isArray(value) ? (value as string[]) : [];
        const opts = question.options ?? [];

        return (
          <div className="space-y-2">
            {c?.minSelection != null && (
              <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
                최소 {c.minSelection}개 선택
                {c.maxSelection != null ? ` / 최대 ${c.maxSelection}개` : ""}
              </p>
            )}
            {opts.map((opt) => {
              const checked = selected.includes(opt);
              const atMax =
                c?.maxSelection != null && selected.length >= c.maxSelection && !checked;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={atMax}
                  onClick={() => {
                    onChange(checked ? selected.filter((o) => o !== opt) : [...selected, opt]);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: checked ? COLOR.ACCENT_SUBTLE : COLOR.BG_SECTION,
                    border: `1.5px solid ${error && !checked ? COLOR.NEGATIVE : checked ? COLOR.ACCENT : "transparent"}`,
                  }}
                >
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: checked ? COLOR.ACCENT : COLOR.BG_BASE,
                      border: `1.5px solid ${checked ? COLOR.ACCENT : COLOR.BORDER_INPUT}`,
                    }}
                  >
                    {checked && (
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path
                          d="M1 4l3 3 6-6"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        );
      }

      case "dropdown": {
        const opts = question.options ?? [];
        const selected = typeof value === "string" ? value : "";
        return (
          <select
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl outline-none appearance-none"
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              border: `1.5px solid ${error ? COLOR.NEGATIVE : COLOR.BORDER_INPUT}`,
              ...TYPOGRAPHY.STYLE.BODY_1,
              color: selected ? COLOR.TEXT_PRIMARY : COLOR.TEXT_MUTED,
            }}
          >
            <option value="">선택해 주세요</option>
            {opts.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      }

      case "ranking": {
        const opts = question.options ?? [];
        return (
          <RankingInput
            options={opts}
            value={value}
            onChange={(v) => onChange(v)}
            hasError={error}
          />
        );
      }

      default:
        return null;
    }
  }

  return (
    <div
      ref={questionRef}
      className="question_card_wrap rounded-2xl px-6 py-6 space-y-4"
      style={{
        border: `1.5px solid ${error ? COLOR.NEGATIVE : COLOR.BORDER_DEFAULT}`,
        backgroundColor: COLOR.BG_BASE,
      }}
    >
      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <span
            className="shrink-0 text-xs font-semibold mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLOR.BG_SECTION, color: COLOR.TEXT_MUTED }}
          >
            {index + 1}
          </span>
          <div className="flex-1">
            <p style={{ ...TYPOGRAPHY.STYLE.TITLE_2_KO, color: COLOR.TEXT_PRIMARY }}>
              {question.title}
              {question.required && (
                <span className="ml-1" style={{ color: COLOR.NEGATIVE }}>
                  *
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {renderInput()}

      {error && (
        <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.NEGATIVE }}>
          필수 항목이에요. 답해 주세요.
        </p>
      )}
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ surveyId }: { surveyId: string }) {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6 max-w-sm w-full">
        <div className="flex justify-center">
          <AppIcon size={80} variant="light">
            <IconSurveySuccess />
          </AppIcon>
        </div>

        <div className="space-y-2">
          <h2 style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>답변을 제출했어요</h2>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>
            참여해 주셔서 감사해요.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push(`/survey/${surveyId}/report`)}
            className="w-full py-3 rounded-xl font-semibold transition-colors"
            style={{
              backgroundColor: COLOR.ACCENT,
              color: COLOR.TEXT_INVERSE,
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: "600",
            }}
          >
            결과 보기
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl font-medium transition-colors"
            style={{
              backgroundColor: COLOR.BG_SECTION,
              color: COLOR.TEXT_PRIMARY,
              ...TYPOGRAPHY.STYLE.LABEL_1,
            }}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Blocked Screen ───────────────────────────────────────────────────────────

function BlockedScreen({
  reason,
  surveyId,
}: {
  reason: "already_responded" | "survey_full" | "daily_limit";
  surveyId: string;
}) {
  const router = useRouter();

  const messages: Record<string, { title: string; sub: string }> = {
    already_responded: {
      title: "이미 참여한 설문이에요",
      sub: "결과를 확인해 보세요.",
    },
    survey_full: {
      title: "마감된 설문이에요",
      sub: "참여 인원이 모두 찼어요.",
    },
    daily_limit: {
      title: "오늘 참여 한도에 도달했어요",
      sub: "내일 다시 참여할 수 있어요.",
    },
  };

  const msg = messages[reason];

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6 max-w-sm w-full">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: COLOR.BG_SECTION }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={COLOR.TEXT_MUTED} strokeWidth="1.5" />
            <path
              d="M12 8v5M12 16h.01"
              stroke={COLOR.TEXT_MUTED}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 style={{ ...TYPOGRAPHY.STYLE.TITLE_1_KO, color: COLOR.TEXT_PRIMARY }}>{msg.title}</h2>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>{msg.sub}</p>
        </div>
        <div className="flex flex-col gap-3">
          {reason === "already_responded" && (
            <button
              type="button"
              onClick={() => router.push(`/survey/${surveyId}/report`)}
              className="w-full py-3 rounded-xl font-semibold"
              style={{
                backgroundColor: COLOR.ACCENT,
                color: COLOR.TEXT_INVERSE,
                ...TYPOGRAPHY.STYLE.LABEL_1,
                fontWeight: "600",
              }}
            >
              결과 보기
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl"
            style={{
              backgroundColor: COLOR.BG_SECTION,
              color: COLOR.TEXT_PRIMARY,
              ...TYPOGRAPHY.STYLE.LABEL_1,
            }}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PointDeductionModal ─────────────────────────────────────────────────────
// 설문 진입 전 500P 차감 동의를 받는 모달.
// 실제 차감은 POST /api/surveys/[id]/respond 시 spend_survey_access_points RPC로 처리됨.
// 이 모달은 사용자 동의만 수집하고 onConfirm을 호출한다.

function PointDeductionModal({
  availablePoints,
  onConfirm,
  onClose,
}: {
  availablePoints: number;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="point-deduction-title"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="point_deduction_modal_wrap w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
        style={{ backgroundColor: COLOR.BG_BASE, border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        <div className="space-y-2">
          <h2
            id="point-deduction-title"
            style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}
          >
            추가 참여권이 필요해요
          </h2>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_SECONDARY }}>
            오늘 이미 5개 설문에 참여했어요. 추가로 참여하려면 500P가 차감돼요.
          </p>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            현재 사용 가능한 포인트: {availablePoints.toLocaleString("ko-KR")}P
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 rounded-xl font-semibold"
            style={{
              backgroundColor: COLOR.ACCENT,
              color: COLOR.TEXT_INVERSE,
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: "600",
            }}
          >
            500P 차감하고 참여하기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl transition-colors"
            style={{
              backgroundColor: COLOR.BG_SECTION,
              color: COLOR.TEXT_PRIMARY,
              ...TYPOGRAPHY.STYLE.LABEL_1,
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PointBlockScreen ─────────────────────────────────────────────────────────

function PointBlockScreen() {
  const router = useRouter();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6 max-w-sm w-full">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: COLOR.BG_SECTION }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={COLOR.TEXT_MUTED} strokeWidth="1.5" />
            <path
              d="M12 8v5M12 16h.01"
              stroke={COLOR.TEXT_MUTED}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>포인트가 부족해요</h2>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>
            오늘 이미 5개 설문에 참여했어요. 추가 참여는 500P가 필요해요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full py-3 rounded-xl font-semibold"
          style={{
            backgroundColor: COLOR.ACCENT,
            color: COLOR.TEXT_INVERSE,
            ...TYPOGRAPHY.STYLE.LABEL_1,
            fontWeight: "600",
          }}
        >
          폴 참여하러 가기
        </button>
      </div>
    </div>
  );
}

// ─── Section Transition Screen ────────────────────────────────────────────────

function SectionTransitionScreen({
  group,
  sectionNumber,
  totalSections,
  onContinue,
  onBack,
}: {
  group: QuestionGroup;
  sectionNumber: number;
  totalSections: number;
  onContinue: () => void;
  onBack: (() => void) | null;
}) {
  return (
    <div className="section_transition_wrap min-h-screen px-4 py-12 max-w-2xl mx-auto flex flex-col">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center gap-1.5 mb-8"
          style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          이전으로
        </button>
      )}

      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: COLOR.ACCENT_SUBTLE, color: COLOR.ACCENT }}
          >
            {sectionNumber} / {totalSections} 섹션
          </span>
        </div>

        <div className="space-y-3">
          {group.section?.title ? (
            <h2 style={{ ...TYPOGRAPHY.STYLE.H2, color: COLOR.TEXT_PRIMARY }}>
              {group.section.title}
            </h2>
          ) : (
            <h2 style={{ ...TYPOGRAPHY.STYLE.H2, color: COLOR.TEXT_PRIMARY }}>
              {sectionNumber}번째 섹션이 시작돼요
            </h2>
          )}
          {group.section?.description && (
            <p
              style={{
                ...TYPOGRAPHY.STYLE.BODY_1,
                color: COLOR.TEXT_SECONDARY,
                whiteSpace: "pre-wrap",
              }}
            >
              {group.section.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-semibold"
          style={{
            backgroundColor: COLOR.ACCENT,
            color: COLOR.TEXT_INVERSE,
            ...TYPOGRAPHY.STYLE.LABEL_1,
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          계속하기
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SurveyRespondClient({
  surveyId,
  surveyTitle,
  surveyDescription,
  questions,
  sections,
  preview = false,
  requiresPointDeduction = false,
  availablePoints = 0,
  canAfford = false,
}: Props) {
  const router = useRouter();
  const initialGate = requiresPointDeduction && !preview && canAfford ? ("pending" as const) : null;
  const [pointGateState, setPointGateState] = useState<"pending" | "confirmed" | null>(initialGate);

  // Intro phase — shown when survey has a description. Skipped if no description.
  const [phase, setPhase] = useState<"intro" | "form">(
    surveyDescription && !preview ? "intro" : "form"
  );

  const [isReservingSlot, setIsReservingSlot] = useState(false);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [errorQuestionIds, setErrorQuestionIds] = useState<Set<string>>(new Set());
  const [pageState, setPageState] = useState<PageState>({ kind: "form" });
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Reserve slot on mount when there is no intro screen (no description).
  // When a description exists, the slot is reserved on "시작하기" click instead.
  useEffect(() => {
    if (preview || surveyDescription) return;

    fetch(`/api/surveys/${surveyId}/session`, { method: "POST" })
      .then(async (res) => {
        if (!res.ok) {
          const data = (await res.json()) as { code?: string };
          if (data.code === "SURVEY_FULL") {
            setPageState({ kind: "blocked", reason: "survey_full" });
          } else if (data.code === "ALREADY_RESPONDED") {
            setPageState({ kind: "blocked", reason: "already_responded" });
          }
          // Other errors: proceed and let submit fail if needed
        }
      })
      .catch(() => {
        // Network error: non-blocking — submit will surface the error
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build question groups and step state
  const groups = groupQuestionsBySection(questions, sections);
  const hasSections = sections.length > 1;

  const initialStep: RespondStep =
    hasSections && groups.length > 0
      ? { kind: "section_transition", sectionIdx: 0 }
      : { kind: "question", sectionIdx: 0, questionIdx: 0 };

  const [currentStep, setCurrentStep] = useState<RespondStep>(initialStep);

  const startedAt = useRef<string>(new Date().toISOString());
  // Ref for the currently displayed question card — used to scroll into view on error
  const currentQuestionRef = useRef<HTMLDivElement | null>(null);

  // Progress — answerable questions only (endpoint excluded)
  const allAnswerableQs = groups.flatMap((g) => g.questions.filter((q) => q.type !== "endpoint"));
  const totalQ = allAnswerableQs.length;
  const answeredCount = allAnswerableQs.filter((q) => !isAnswerEmpty(answers[q.id])).length;

  const setAnswer = useCallback((questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrorQuestionIds((prev) => {
      if (!prev.has(questionId)) return prev;
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
  }, []);

  // Core submit — called when all questions are done
  async function doSubmit() {
    if (preview) {
      setPageState({ kind: "success", responseId: "preview" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setPageState({ kind: "submitting" });
    setNetworkError(null);

    try {
      const body = {
        answers: Object.entries(answers).map(([question_id, value]) => ({ question_id, value })),
        started_at: startedAt.current,
      };

      const res = await fetch(`/api/surveys/${surveyId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = (await res.json()) as { responseId?: string; response_id?: string };
        setPageState({ kind: "success", responseId: data.responseId ?? data.response_id ?? "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const errData = (await res.json()) as { reason?: string; error?: string; code?: string };

      if (res.status === 409) {
        const reason = errData.reason ?? errData.error ?? "";
        if (reason === "already_responded") {
          setPageState({ kind: "blocked", reason: "already_responded" });
        } else if (reason === "daily_limit_reached" || errData.error === "daily_limit_reached") {
          setPageState({ kind: "blocked", reason: "daily_limit" });
        } else {
          setPageState({ kind: "form" });
          setNetworkError("이미 참여한 설문이에요. 결과를 확인해 보세요.");
        }
        return;
      }

      // 403 or 410 — survey full / not published
      if (res.status === 403 || res.status === 410) {
        const code = errData.code ?? errData.reason ?? errData.error ?? "";
        if (code === "SURVEY_FULL" || code === "survey_full") {
          setPageState({ kind: "blocked", reason: "survey_full" });
          return;
        }
        if (code === "SURVEY_NOT_PUBLISHED" || code === "survey_not_published") {
          setPageState({ kind: "blocked", reason: "survey_full" });
          return;
        }
      }

      if (res.status === 402) {
        setPageState({ kind: "blocked", reason: "daily_limit" });
        return;
      }

      setPageState({ kind: "form" });
      setNetworkError("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
    } catch {
      setPageState({ kind: "form" });
      setNetworkError("네트워크 연결을 확인하고 다시 시도해 주세요.");
    }
  }

  async function handleNext() {
    if (pageState.kind === "submitting") return;

    // Validate required question before advancing
    if (currentStep.kind === "question") {
      const group = groups[currentStep.sectionIdx];
      const question = group?.questions[currentStep.questionIdx];
      if (
        question &&
        question.required &&
        question.type !== "endpoint" &&
        isAnswerEmpty(answers[question.id])
      ) {
        setErrorQuestionIds(new Set([question.id]));
        // Scroll the question card into view so the inline error is visible
        currentQuestionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      setErrorQuestionIds(new Set());
    }

    const next = calcNextStep(groups, currentStep);
    if (next === "submit") {
      await doSubmit();
      return;
    }
    setCurrentStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    const prev = calcPrevStep(groups, currentStep);
    if (prev === null) return;
    setCurrentStep(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── 포인트 부족 차단 화면 ────────────────────────────────────────────────────
  if (requiresPointDeduction && !preview && !canAfford) {
    return <PointBlockScreen />;
  }

  // ── Blocked state ──────────────────────────────────────────────────────────
  if (pageState.kind === "blocked") {
    return <BlockedScreen reason={pageState.reason} surveyId={surveyId} />;
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (pageState.kind === "success") {
    return (
      <>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{ animation: "fadeInUp 300ms ease forwards" }}>
          <SuccessScreen surveyId={surveyId} />
        </div>
      </>
    );
  }

  // ── Intro phase ────────────────────────────────────────────────────────────
  if (phase === "intro" && surveyDescription) {
    return (
      <>
        {pointGateState === "pending" && (
          <PointDeductionModal
            availablePoints={availablePoints}
            onConfirm={() => {
              setPointGateState("confirmed");
              setPhase("form");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onClose={() => router.back()}
          />
        )}
        <main className="survey_intro_area min-h-screen px-4 py-12 max-w-2xl mx-auto flex flex-col justify-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 style={{ ...TYPOGRAPHY.STYLE.H2, color: COLOR.TEXT_PRIMARY }}>{surveyTitle}</h1>
              <p
                style={{
                  ...TYPOGRAPHY.STYLE.BODY_1,
                  color: COLOR.TEXT_SECONDARY,
                  whiteSpace: "pre-wrap",
                }}
              >
                {surveyDescription}
              </p>
            </div>

            {requiresPointDeduction && canAfford && (
              <div
                className="px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: COLOR.ACCENT_BG,
                  border: `1px solid ${COLOR.ACCENT_LIGHT}`,
                }}
              >
                <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.ACCENT }}>
                  이 설문 참여에는 500P가 필요해요. 현재 잔액:{" "}
                  {availablePoints.toLocaleString("ko-KR")}P
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={isReservingSlot}
              onClick={async () => {
                if (pointGateState === "pending") return;

                if (!preview) {
                  setIsReservingSlot(true);
                  try {
                    const res = await fetch(`/api/surveys/${surveyId}/session`, {
                      method: "POST",
                    });
                    if (!res.ok) {
                      const data = (await res.json()) as { code?: string };
                      if (data.code === "SURVEY_FULL") {
                        setPageState({ kind: "blocked", reason: "survey_full" });
                        return;
                      }
                      if (data.code === "ALREADY_RESPONDED") {
                        setPageState({ kind: "blocked", reason: "already_responded" });
                        return;
                      }
                      // Other errors: proceed anyway — submit will catch it
                    }
                  } catch {
                    // Network error: non-blocking
                  } finally {
                    setIsReservingSlot(false);
                  }
                }

                setPhase("form");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full py-4 rounded-2xl font-semibold transition-opacity"
              style={{
                backgroundColor: COLOR.ACCENT,
                color: COLOR.TEXT_INVERSE,
                ...TYPOGRAPHY.STYLE.LABEL_1,
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {isReservingSlot ? "자리 확인 중..." : "시작하기"}
            </button>
          </div>
        </main>
      </>
    );
  }

  const isSubmitting = pageState.kind === "submitting";

  // ── Section transition screen ─────────────────────────────────────────────
  if (currentStep.kind === "section_transition") {
    const group = groups[currentStep.sectionIdx];
    const prev = calcPrevStep(groups, currentStep);

    return (
      <>
        {pointGateState === "pending" && (
          <PointDeductionModal
            availablePoints={availablePoints}
            onConfirm={() => setPointGateState("confirmed")}
            onClose={() => router.back()}
          />
        )}
        {preview && (
          <div
            className="fixed top-0 left-0 right-0 z-40 px-4 py-3 text-center"
            style={{
              backgroundColor: COLOR.WARNING_MUTED,
              border: `1px solid ${COLOR.WARNING}`,
            }}
          >
            <p style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.WARNING }}>
              미리보기 모드 — 실제로 저장되지 않아요
            </p>
          </div>
        )}
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div
          key={`section_transition-${currentStep.sectionIdx}`}
          style={{ animation: "fadeInUp 200ms ease forwards" }}
        >
          <SectionTransitionScreen
            group={group}
            sectionNumber={currentStep.sectionIdx + 1}
            totalSections={groups.length}
            onContinue={handleNext}
            onBack={prev !== null ? handleBack : null}
          />
        </div>
      </>
    );
  }

  // ── Question screen ───────────────────────────────────────────────────────
  const group = groups[currentStep.sectionIdx];
  const question = group?.questions[currentStep.questionIdx];
  const isLast = calcNextStep(groups, currentStep) === "submit";
  const prev = calcPrevStep(groups, currentStep);

  const progressText = hasSections
    ? `섹션 ${currentStep.sectionIdx + 1} / ${groups.length} · 질문 ${answeredCount} / ${totalQ}`
    : `질문 ${answeredCount} / ${totalQ}`;

  if (!question) return null;

  return (
    <>
      {pointGateState === "pending" && (
        <PointDeductionModal
          availablePoints={availablePoints}
          onConfirm={() => setPointGateState("confirmed")}
          onClose={() => router.back()}
        />
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="survey_respond_area min-h-screen px-4 pt-6 pb-24 max-w-2xl mx-auto">
        {preview && (
          <div
            className="mb-6 px-4 py-3 rounded-xl text-center"
            style={{
              backgroundColor: COLOR.WARNING_MUTED,
              border: `1px solid ${COLOR.WARNING}`,
            }}
          >
            <p style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.WARNING }}>
              미리보기 모드 — 실제로 저장되지 않아요
            </p>
          </div>
        )}

        {/* Header: back + progress */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {prev !== null ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 shrink-0"
                style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8l4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                이전으로
              </button>
            ) : (
              <div className="w-16" />
            )}

            <div className="flex-1 text-right">
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
                {progressText}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: COLOR.BG_SECTION }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${totalQ > 0 ? Math.round((answeredCount / totalQ) * 100) : 0}%`,
                backgroundColor: COLOR.ACCENT,
              }}
            />
          </div>
        </div>

        {/* Question card — animated on step change */}
        <div
          key={`question-${currentStep.sectionIdx}-${currentStep.questionIdx}`}
          style={{ animation: "fadeInUp 200ms ease forwards" }}
        >
          <QuestionCard
            question={question}
            index={currentStep.questionIdx}
            value={answers[question.id]}
            onChange={(v) => setAnswer(question.id, v)}
            error={errorQuestionIds.has(question.id)}
            questionRef={currentQuestionRef}
          />
        </div>

        {/* Network error */}
        {networkError && (
          <div
            className="mt-4 px-4 py-3 rounded-xl"
            style={{
              backgroundColor: COLOR.NEGATIVE_BG,
              border: `1px solid ${COLOR.NEGATIVE_LIGHT}`,
            }}
          >
            <p style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.NEGATIVE }}>{networkError}</p>
          </div>
        )}
      </main>

      {/* Fixed bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3"
        style={{ backgroundColor: COLOR.BG_BASE }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-semibold disabled:opacity-60"
            style={{
              backgroundColor: COLOR.ACCENT,
              color: COLOR.TEXT_INVERSE,
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            {isSubmitting ? "제출하는 중이에요..." : isLast ? "제출하기" : "다음으로"}
          </button>
        </div>
      </div>
    </>
  );
}
