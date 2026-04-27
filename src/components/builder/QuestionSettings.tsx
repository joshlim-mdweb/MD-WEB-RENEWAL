"use client";

import { useEffect, useRef, useState } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { QuestionType } from "@/lib/types/survey";
import { MultipleChoiceEditor } from "./editors/MultipleChoiceEditor";
import { CheckboxEditor } from "./editors/CheckboxEditor";
import { DropdownEditor } from "./editors/DropdownEditor";
import { ShortTextEditor } from "./editors/ShortTextEditor";
import { LongTextEditor } from "./editors/LongTextEditor";
import { ScaleEditor } from "./editors/ScaleEditor";
import { GradeEditor } from "./editors/GradeEditor";
import { RankingEditor } from "./editors/RankingEditor";
import { StartpointEditor } from "./editors/StartpointEditor";
import { EndpointEditor } from "./editors/EndpointEditor";
import { QUESTION_TYPE_LABELS, QUESTION_TYPES } from "./constants";
import { QuestionTypeIcon } from "./QuestionTypeIcon";
import {
  Toggle as OfficialToggle,
  Dropdown,
  DropdownItem,
  EmptyState,
  Button,
} from "@/components/ui";
import { COLOR, TYPOGRAPHY, QUESTION_TYPE_COLOR } from "@/lib/design-tokens";
import { useToastStore } from "@/lib/store/toast";
import { SectionHeader } from "./SectionHeader";

export function QuestionSettings({ variant = "panel" }: { variant?: "panel" | "center" }) {
  const {
    surveyId,
    questions,
    sections,
    activeQuestionId,
    responseCount,
    updateQuestionTitle,
    updateQuestionRequired,
    updateQuestionType,
    updateSection,
    setIsSaving,
  } = useBuilderStore();

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) ?? null;

  // Type changes are locked once responses exist — changing type would invalidate stored answers.
  // startpoint/endpoint are pinned types and cannot be changed regardless of response count.
  const canChangeType =
    responseCount === 0 &&
    activeQuestion?.type !== "startpoint" &&
    activeQuestion?.type !== "endpoint";

  const { showToast } = useToastStore();
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [showTypeChangeConfirm, setShowTypeChangeConfirm] = useState(false);
  const [pendingTypeChange, setPendingTypeChange] = useState<QuestionType | null>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [activeQuestion?.title]);

  // Listen for save errors dispatched by any editor's fetch failure path
  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail;
      showToast(msg);
    };
    window.addEventListener("survey-save-error", handler);
    return () => window.removeEventListener("survey-save-error", handler);
  }, [showToast]);

  if (!activeQuestion) {
    if (variant === "center") {
      return (
        <div className="flex-1 h-full flex items-center justify-center">
          <EmptyState
            icon={
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: COLOR.ACCENT_BG }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: COLOR.ACCENT }}
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 12h8M12 8v8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            }
            title="질문을 선택하세요"
            description={"왼쪽 패널에서 질문을 클릭하면\n여기서 편집할 수 있습니다"}
          />
        </div>
      );
    }
    return <div className="flex-1 h-full" />;
  }

  async function saveField(field: string, value: unknown) {
    if (!surveyId || !activeQuestion) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions/${activeQuestion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) {
        window.dispatchEvent(
          new CustomEvent("survey-save-error", { detail: "저장에 실패했어요. 다시 시도해 주세요." })
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  function handleTitleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    saveField("title", e.target.value);
  }

  function handleRequiredToggle() {
    if (!activeQuestion) return;
    const next = !activeQuestion.required;
    updateQuestionRequired(activeQuestion.id, next);
    saveField("required", next);
  }

  function handleTypeChange(newType: QuestionType) {
    if (!activeQuestion) return;

    const hasData = (activeQuestion.options?.length ?? 0) > 0 || activeQuestion.config != null;
    if (hasData) {
      setPendingTypeChange(newType);
      setShowTypeChangeConfirm(true);
      return;
    }

    updateQuestionType(activeQuestion.id, newType);
    saveField("type", newType);
    setIsTypeDropdownOpen(false);
  }

  function confirmTypeChange() {
    if (!activeQuestion || !pendingTypeChange) return;
    updateQuestionType(activeQuestion.id, pendingTypeChange);
    saveField("type", pendingTypeChange);
    setIsTypeDropdownOpen(false);
    setPendingTypeChange(null);
    setShowTypeChangeConfirm(false);
  }

  // Section-scoped question index — matches the numbering shown in QuestionList.
  // Using global findIndex would give "Question 5" when it's actually the 2nd question
  // in its section, which conflicts with what the user sees in the left panel.
  const sortedSectionQuestions = [...questions]
    .filter((q) => q.section_id === activeQuestion?.section_id)
    .sort((a, b) => a.order_index - b.order_index);
  const questionIndex = sortedSectionQuestions.findIndex((q) => q.id === activeQuestion?.id);

  // Section data for the SectionHeader (center variant only)
  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  const activeSection = sortedSections.find((s) => s.id === activeQuestion?.section_id) ?? null;
  const activeSectionIndex = activeSection ? sortedSections.indexOf(activeSection) : 0;

  const contentMaxW = variant === "center" ? "max-w-[900px]" : "max-w-[500px]";
  const contentPadding = variant === "center" ? "py-12 px-12" : "py-8 px-6";

  return (
    <>
      {showTypeChangeConfirm && (
        <div className="type_change_confirm_overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="type_change_confirm_wrap rounded-xl shadow-xl w-[400px] p-6 flex flex-col gap-4"
            style={{ backgroundColor: COLOR.BG_BASE, border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
          >
            <h2 style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}>
              질문 유형 변경
            </h2>
            <p
              className="leading-relaxed"
              style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}
            >
              유형을 변경하면 현재{" "}
              <span style={{ fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM, color: COLOR.TEXT_PRIMARY }}>
                설정이 모두 초기화
              </span>
              됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="neutral"
                size="md"
                onClick={() => {
                  setShowTypeChangeConfirm(false);
                  setPendingTypeChange(null);
                }}
              >
                닫기
              </Button>
              <Button variant="danger" size="md" onClick={confirmTypeChange}>
                변경하기
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="question_settings_area flex-1 flex flex-col">
        <div className={`question_settings_body ${contentMaxW} w-full mx-auto ${contentPadding}`}>
          {/* Section header — center variant only; shows section info above the question card */}
          {variant === "center" && activeSection && surveyId && (
            <SectionHeader
              section={activeSection}
              sectionIndex={activeSectionIndex}
              surveyId={surveyId}
              onUpdate={(patch) => updateSection(activeSection.id, patch)}
            />
          )}

          {/* Breadcrumb — question number only; section info will be shown in section header */}
          <div
            className="flex items-center gap-1 mb-3"
            style={{ fontSize: "12px", color: COLOR.TEXT_MUTED, letterSpacing: "0.02em" }}
          >
            <span>Question {questionIndex + 1}</span>
          </div>

          {/* Card — only in center (list view) variant */}
          <div
            className={
              variant === "center"
                ? "question_card_wrap bg-white rounded-2xl px-10 pt-6 pb-8"
                : "question_card_wrap"
            }
            style={
              variant === "center"
                ? { boxShadow: "0 2px 16px rgba(25,28,30,0.07), 0 1px 4px rgba(25,28,30,0.04)" }
                : undefined
            }
          >
            {/* Header: type selector (left) + required toggle (right) */}
            <div className="flex items-center justify-between mb-4">
              <Dropdown
                open={isTypeDropdownOpen}
                onOpenChange={(next) => {
                  // Blocked when responses exist — type is locked to protect stored answers
                  if (!canChangeType) return;
                  setIsTypeDropdownOpen(next);
                }}
                title="질문 유형"
                trigger={
                  <button
                    type="button"
                    disabled={!canChangeType}
                    title={canChangeType ? undefined : "응답이 있어 유형을 변경할 수 없습니다"}
                    className="dropdown_trigger flex items-center gap-1.5"
                    style={{
                      padding: "6px 10px",
                      fontSize: "13px",
                      fontWeight: 500,
                      borderRadius: "6px",
                      border: `1px solid ${COLOR.BORDER_DEFAULT}`,
                      background: COLOR.BG_SURFACE,
                      color: COLOR.TEXT_PRIMARY,
                      cursor: canChangeType ? "pointer" : "not-allowed",
                      opacity: canChangeType ? 1 : 0.5,
                    }}
                  >
                    <QuestionTypeIcon
                      type={activeQuestion.type}
                      size={13}
                      color={QUESTION_TYPE_COLOR[activeQuestion.type]}
                    />
                    <span>{QUESTION_TYPE_LABELS[activeQuestion.type]}</span>
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden="true"
                      style={{
                        transform: isTypeDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
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
                {QUESTION_TYPES.filter((t) => t !== "startpoint" && t !== "endpoint").map(
                  (type) => (
                    <DropdownItem
                      key={type}
                      label={QUESTION_TYPE_LABELS[type]}
                      selected={activeQuestion.type === type}
                      onClick={() => handleTypeChange(type)}
                    />
                  )
                )}
              </Dropdown>

              <Toggle
                isOn={activeQuestion.required}
                onToggle={handleRequiredToggle}
                label="필수 질문"
              />
            </div>

            {/* Question title — above the divider, part of the header block */}
            <TextareaWithFocus
              titleRef={titleRef}
              activeQuestion={activeQuestion}
              onBlur={handleTitleBlur}
              onTitleChange={(id, value, target) => {
                updateQuestionTitle(id, value);
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />

            {/* Type-specific editor — divider로 질문 헤더와 시각적 분리 */}
            <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${COLOR.BORDER_DEFAULT}` }}>
              <p
                className="mb-3"
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: COLOR.TEXT_DISABLED,
                  textTransform: "uppercase",
                }}
              >
                옵션 설정
              </p>
              <QuestionEditor question={activeQuestion} surveyId={surveyId ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Textarea with focus-driven bottom-only glow effect.
// Extracted so the focused state hook stays local and doesn't trigger outer re-renders.
export function TextareaWithFocus({
  titleRef,
  activeQuestion,
  onBlur,
  onTitleChange,
}: {
  titleRef: React.RefObject<HTMLTextAreaElement | null>;
  activeQuestion: ReturnType<typeof useBuilderStore.getState>["questions"][number];
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onTitleChange: (id: string, value: string, target: HTMLTextAreaElement) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <textarea
      ref={titleRef}
      key={activeQuestion.id}
      defaultValue={activeQuestion.title}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur(e);
      }}
      onChange={(e) => onTitleChange(activeQuestion.id, e.target.value, e.target)}
      placeholder="질문을 입력하세요"
      rows={1}
      className="w-full bg-transparent px-0 py-2 resize-none overflow-hidden mt-5 mb-1 border-b-2"
      style={{
        ...TYPOGRAPHY.STYLE.BODY_1,
        color: COLOR.TEXT_PRIMARY,
        outline: "none",
        borderBottomColor: isFocused ? COLOR.BORDER_FOCUS : COLOR.BORDER_DEFAULT,
        boxShadow: isFocused ? "0 1px 0 0 #3182f6" : "none",
        transition: "border-color 120ms, box-shadow 120ms",
      }}
    />
  );
}

// Routes to the right editor component based on question type
export function QuestionEditor({
  question,
  surveyId,
}: {
  question: ReturnType<typeof useBuilderStore.getState>["questions"][number];
  surveyId: string;
}) {
  switch (question.type) {
    case "multiple_choice":
      return <MultipleChoiceEditor question={question} surveyId={surveyId} />;
    case "checkbox":
      return <CheckboxEditor key={question.id} question={question} surveyId={surveyId} />;
    case "dropdown":
      return <DropdownEditor question={question} surveyId={surveyId} />;
    case "short_text":
      return <ShortTextEditor key={question.id} question={question} surveyId={surveyId} />;
    case "long_text":
      return <LongTextEditor key={question.id} question={question} surveyId={surveyId} />;
    case "scale":
      return <ScaleEditor key={question.id} question={question} surveyId={surveyId} />;
    case "grade":
      return <GradeEditor question={question} surveyId={surveyId} />;
    case "ranking":
      return <RankingEditor question={question} surveyId={surveyId} />;
    case "startpoint":
      return <StartpointEditor key={question.id} question={question} surveyId={surveyId} />;
    case "endpoint":
      return <EndpointEditor key={question.id} question={question} surveyId={surveyId} />;
    default:
      return null;
  }
}

// Thin adapter so editors can keep the { isOn, onToggle } call-site API
// while delegating to the canonical Toggle in src/components/ui.
// This avoids a second implementation with different visual specs.
export function Toggle({
  isOn,
  onToggle,
  disabled,
  label,
  labelStyle,
}: {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
  label?: string;
  labelStyle?: React.CSSProperties;
}) {
  // onChange passes the new boolean but callers manage their own state — drop the arg
  return (
    <OfficialToggle
      checked={isOn}
      onChange={() => onToggle()}
      disabled={disabled}
      label={label}
      labelStyle={labelStyle}
    />
  );
}
