"use client";

import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBuilderStore } from "@/lib/store/builder";
import { useToastStore } from "@/lib/store/toast";
import { Question, MultipleChoiceConfig } from "@/lib/types/survey";
import { DeleteQuestionModal } from "./DeleteQuestionModal";
import { QuestionTypeIcon, QUESTION_TYPE_COLORS } from "./QuestionTypeIcon";
import { COLOR, INTERACTION, SHADOW, TYPOGRAPHY } from "@/lib/design-tokens";
import { Tooltip } from "@/components/ui";

interface QuestionCardProps {
  question: Question;
  index: number;
  surveyId: string;
}

export function QuestionCard({ question, index, surveyId }: QuestionCardProps) {
  const {
    activeQuestionId,
    setActiveQuestion,
    removeQuestion,
    insertQuestionAfter,
    questions,
    responseCount,
    validationErrors,
    surveyStatus,
    pendingDeleteQuestionId,
    setPendingDeleteQuestionId,
  } = useBuilderStore();
  const { showToast } = useToastStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  // When the keyboard hook sets pendingDeleteQuestionId to this question's ID,
  // open the delete modal and immediately clear the pending flag so other cards
  // don't also react.
  useEffect(() => {
    if (pendingDeleteQuestionId === question.id) {
      setPendingDeleteQuestionId(null);
      if (responseCount === 0) setShowDeleteModal(true);
    }
  }, [pendingDeleteQuestionId, question.id, responseCount, setPendingDeleteQuestionId]);

  const canDelete = responseCount === 0;
  const canDrag = responseCount === 0 && surveyStatus === "draft";
  const isActive = activeQuestionId === question.id;
  const hasValidationError = validationErrors.includes(question.id);

  // Count conditional rules in other questions that reference this question
  const brokenRuleCount = questions.reduce((count, q) => {
    if (q.id === question.id) return count;
    const config = q.config as MultipleChoiceConfig | null;
    const rules = config?.conditionalRules ?? [];
    return count + rules.filter((r) => r.targetQuestionId === question.id).length;
  }, 0);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
    data: { sectionId: question.section_id },
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  async function handleDeleteConfirm() {
    const res = await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
      method: "DELETE",
    });
    // Only mutate store after confirmed API success — prevents UI/DB divergence on failure
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? "Delete failed");
    }

    // Clean up ConditionalRules in other questions that referenced this question
    const cleanupPromises = questions
      .filter((q) => {
        if (q.id === question.id) return false;
        const cfg = q.config as MultipleChoiceConfig | null;
        return cfg?.conditionalRules?.some((r) => r.targetQuestionId === question.id);
      })
      .map(async (q) => {
        const cfg = q.config as MultipleChoiceConfig;
        const cleaned = {
          ...cfg,
          conditionalRules: cfg.conditionalRules?.filter((r) => r.targetQuestionId !== question.id),
        };
        await fetch(`/api/surveys/${surveyId}/questions/${q.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: cleaned }),
        });
      });
    await Promise.all(cleanupPromises);

    removeQuestion(question.id);
    setShowDeleteModal(false);
    showToast("질문이 삭제되었습니다");
  }

  async function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation();
    if (!surveyId) return;
    // Conditional rules must not be copied — they reference specific question/section IDs
    // that no longer apply to the duplicate and would silently misbehave at survey runtime.
    const newConfig = question.config ? { ...question.config, conditionalRules: undefined } : null;
    const res = await fetch(`/api/surveys/${surveyId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: question.type,
        title: question.title ? `${question.title} (copy)` : "",
        options: question.options,
        required: question.required,
        config: newConfig,
        section_id: question.section_id,
      }),
    });
    if (!res.ok) return;
    const duplicated: Question = await res.json();
    insertQuestionAfter(question.id, duplicated);
  }

  const iconColor = QUESTION_TYPE_COLORS[question.type];

  // Show branch indicator when this question has outgoing conditional rules configured
  const questionConfig = question.config as Record<string, unknown> | null;
  const conditionalRules = questionConfig?.conditionalRules;
  const hasConditionalRules = Array.isArray(conditionalRules) && conditionalRules.length > 0;

  return (
    <>
      <div className="question_card_wrap group relative" ref={setNodeRef} style={style}>
        <div
          onClick={() => setActiveQuestion(question.id)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="question_card_inner relative flex items-center gap-2 px-3 h-10 cursor-pointer"
          style={{
            backgroundColor: isActive
              ? COLOR.BG_SURFACE
              : hovered
                ? INTERACTION.HOVER_BG
                : "transparent",
            boxShadow: isActive ? SHADOW.CARD : "none",
            borderRadius: isActive ? "8px" : undefined,
            transition: INTERACTION.TRANSITION_BG,
          }}
        >
          {/* Active indicator — 2px left bar in accent color */}
          {isActive && (
            <div
              className="absolute left-0 top-0 bottom-0 w-[2px] rounded-r"
              style={{ backgroundColor: COLOR.ACCENT }}
            />
          )}

          {/* Validation error dot — appears when this question ID is in validationErrors */}
          {hasValidationError && (
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-(--color-negative)" />
          )}

          {/* Drag handle */}
          <Tooltip
            content={canDrag ? "드래그해서 순서 변경" : "응답이 있어 순서를 변경할 수 없어요"}
            position="top"
          >
            <button
              {...(canDrag ? { ...attributes, ...listeners } : {})}
              onClick={(e) => e.stopPropagation()}
              disabled={!canDrag}
              className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                canDrag
                  ? "text-[#c7c8d0] hover:text-(--color-text-secondary) cursor-grab active:cursor-grabbing"
                  : "text-[#c7c8d0] cursor-not-allowed"
              }`}
              tabIndex={-1}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
                <circle cx="2" cy="2" r="1.2" />
                <circle cx="6" cy="2" r="1.2" />
                <circle cx="2" cy="6" r="1.2" />
                <circle cx="6" cy="6" r="1.2" />
                <circle cx="2" cy="10" r="1.2" />
                <circle cx="6" cy="10" r="1.2" />
              </svg>
            </button>
          </Tooltip>

          {/* Type icon */}
          <span className="flex-shrink-0">
            <QuestionTypeIcon type={question.type} color={iconColor} size={14} />
          </span>

          {/* Index + title — on_surface / on_surface_variant */}
          <span
            className="flex-1 min-w-0 truncate"
            style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_PRIMARY }}
          >
            <span style={{ color: COLOR.TEXT_SECONDARY, marginRight: 4 }}>{index + 1}.</span>
            {question.title || <span style={{ color: COLOR.TEXT_DISABLED }}>제목 없음</span>}
          </span>

          {/* Conditional branch indicator — visible only when outgoing rules exist */}
          {hasConditionalRules && (
            <Tooltip content="조건 분기가 설정된 질문" position="top">
              <span
                className="conditional_branch_indicator flex-shrink-0"
                style={{ color: COLOR.ACCENT }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M5 1 L5 5 M5 5 L2 9 M5 5 L8 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </Tooltip>
          )}

          {/* Duplicate */}
          <Tooltip content="질문 복제" position="top">
            <button
              onClick={handleDuplicate}
              aria-label="질문 복제하기"
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-[#c7c8d0] hover:text-(--color-accent) transition-colors"
              tabIndex={-1}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <rect x="3" y="3" width="6" height="6" rx="1" />
                <path d="M1 7V1.5A.5.5 0 0 1 1.5 1H7" />
              </svg>
            </button>
          </Tooltip>

          {/* Delete — opens modal */}
          <Tooltip
            content={canDelete ? "질문 삭제" : "응답이 있어 삭제할 수 없어요"}
            position="top"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (canDelete) setShowDeleteModal(true);
              }}
              aria-label={canDelete ? "질문 삭제하기" : "응답이 있어 삭제할 수 없습니다"}
              disabled={!canDelete}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-[#c7c8d0] hover:text-(--color-negative) transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-[#c7c8d0]"
              tabIndex={-1}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="1" y1="1" x2="9" y2="9" />
                <line x1="9" y1="1" x2="1" y2="9" />
              </svg>
            </button>
          </Tooltip>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteQuestionModal
          question={question}
          brokenRuleCount={brokenRuleCount}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
