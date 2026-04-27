"use client";

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBuilderStore } from "@/lib/store/builder";
import { type Question, type Section } from "@/lib/types/survey";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { QuestionTypeIcon, QUESTION_TYPE_COLORS } from "./QuestionTypeIcon";
import { QUESTION_TYPE_LABELS, QUESTION_TYPES } from "./constants";
import { Dropdown, DropdownTrigger, DropdownItem, Button, Tooltip } from "@/components/ui";
import { Toggle, QuestionEditor } from "./QuestionSettings";
import { SectionHeader } from "./SectionHeader";
import { ListViewToolbar } from "./ListViewToolbar";

// Prevents KeyboardSensor from swallowing space/enter inside inputs
class SmartKeyboardSensor extends KeyboardSensor {
  static activators = KeyboardSensor.activators.map((activator) => ({
    ...activator,
    handler: (...args: Parameters<(typeof activator)["handler"]>) => {
      const active = document.activeElement as HTMLElement | null;
      if (
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        active?.isContentEditable
      ) {
        return false;
      }
      return activator.handler(...args);
    },
  }));
}

// ─── Single question card ─────────────────────────────────────────────────────

interface CenterQuestionCardProps {
  question: Question;
  questionIndex: number;
  surveyId: string;
  isActive: boolean;
  isNewlyAdded: boolean;
  onActivate: () => void;
  onAddAfter: (questionId: string) => void;
  onAddToEnd: (sectionId: string) => void;
  onAddSection: () => void;
  onAddTextBlock: (sectionId: string) => void;
  onGenerateWithAI: () => void;
}

const CenterQuestionCard: FC<CenterQuestionCardProps> = ({
  question,
  questionIndex,
  surveyId,
  isActive,
  isNewlyAdded,
  onActivate,
  onAddAfter,
  onAddToEnd,
  onAddSection,
  onAddTextBlock,
  onGenerateWithAI,
}) => {
  const {
    responseCount,
    surveyStatus,
    updateQuestionTitle,
    updateQuestionRequired,
    updateQuestionType,
    setIsSaving,
    setNewlyAddedQuestionId,
  } = useBuilderStore();

  const canDrag = responseCount === 0 && surveyStatus === "draft";
  const canChangeType = responseCount === 0;
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the title textarea when this card becomes active AND was just added.
  // After focusing, clear the newlyAddedQuestionId flag so subsequent activations
  // (e.g. clicking another question and back) don't re-trigger focus.
  useEffect(() => {
    if (isActive && isNewlyAdded && titleRef.current) {
      titleRef.current.focus();
      setNewlyAddedQuestionId(null);
    }
  }, [isActive, isNewlyAdded, setNewlyAddedQuestionId]);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [showTypeChangeConfirm, setShowTypeChangeConfirm] = useState(false);
  const [pendingTypeChange, setPendingTypeChange] = useState<Question["type"] | null>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
    data: { sectionId: question.section_id },
    disabled: !canDrag,
  });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const iconColor = QUESTION_TYPE_COLORS[question.type];
  const conditionalRules = (question.config as Record<string, unknown> | null)?.conditionalRules;
  const hasConditionalRules = Array.isArray(conditionalRules) && conditionalRules.length > 0;

  async function saveField(field: string, value: unknown) {
    if (!surveyId) return;
    setIsSaving(true);
    try {
      await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleTypeChange(newType: Question["type"]) {
    const hasData = (question.options?.length ?? 0) > 0 || question.config != null;
    if (hasData) {
      setPendingTypeChange(newType);
      setShowTypeChangeConfirm(true);
      return;
    }
    updateQuestionType(question.id, newType);
    saveField("type", newType);
    setIsTypeDropdownOpen(false);
  }

  function confirmTypeChange() {
    if (!pendingTypeChange) return;
    updateQuestionType(question.id, pendingTypeChange);
    saveField("type", pendingTypeChange);
    setIsTypeDropdownOpen(false);
    setPendingTypeChange(null);
    setShowTypeChangeConfirm(false);
  }

  function handleRequiredToggle() {
    const next = !question.required;
    updateQuestionRequired(question.id, next);
    saveField("required", next);
  }

  return (
    <>
      {showTypeChangeConfirm && (
        <div className="type_change_confirm_overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="type_change_confirm_wrap rounded-xl shadow-xl w-[400px] p-6 flex flex-col gap-4"
            style={{ backgroundColor: "var(--color-bg-base)" }}
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
      <div
        ref={setNodeRef}
        style={dndStyle}
        className="center_question_card_wrap relative"
        data-question-id={question.id}
      >
        {isActive && question.section_id && (
          <div
            style={{
              position: "absolute",
              right: -60,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            <ListViewToolbar
              questionId={question.id}
              sectionId={question.section_id}
              onAddAfter={onAddAfter}
              onAddToEnd={onAddToEnd}
              onAddSection={onAddSection}
              onAddTextBlock={onAddTextBlock}
              onGenerateWithAI={onGenerateWithAI}
            />
          </div>
        )}
        <div
          onClick={onActivate}
          className="center_question_card rounded-2xl overflow-hidden cursor-pointer"
          style={{
            backgroundColor: "var(--color-bg-base)",
            border: isActive ? `1.5px solid ${COLOR.ACCENT}` : `1px solid ${COLOR.BORDER_DEFAULT}`,
          }}
        >
          {/* Card header — always visible */}
          <div
            className="center_question_card_header flex items-center gap-2 px-4 pt-3 pb-2"
            onClick={(e) => isActive && e.stopPropagation()}
          >
            {/* Drag handle */}
            <button
              {...(canDrag ? { ...attributes, ...listeners } : {})}
              disabled={!canDrag}
              tabIndex={-1}
              aria-label="질문 순서 변경하기"
              onClick={(e) => e.stopPropagation()}
              className={`flex-shrink-0 ${
                canDrag
                  ? "text-[#c7c8d0] hover:text-(--color-text-secondary) cursor-grab active:cursor-grabbing"
                  : "text-[#e0e0e0] cursor-not-allowed"
              }`}
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                <circle cx="2.5" cy="2.5" r="1.3" />
                <circle cx="7.5" cy="2.5" r="1.3" />
                <circle cx="2.5" cy="7" r="1.3" />
                <circle cx="7.5" cy="7" r="1.3" />
                <circle cx="2.5" cy="11.5" r="1.3" />
                <circle cx="7.5" cy="11.5" r="1.3" />
              </svg>
            </button>

            {/* Q-number */}
            <span
              className="flex-shrink-0"
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
                color: COLOR.TEXT_MUTED,
              }}
            >
              Q{questionIndex + 1}
            </span>

            {/* Type selector */}
            <div
              className="flex items-center gap-1.5 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <QuestionTypeIcon type={question.type} color={iconColor} size={13} />
              <Dropdown
                open={isTypeDropdownOpen}
                onOpenChange={(next) => {
                  if (!canChangeType) return;
                  setIsTypeDropdownOpen(next);
                }}
                title="질문 유형"
                trigger={
                  <DropdownTrigger
                    label={QUESTION_TYPE_LABELS[question.type]}
                    isSelected={false}
                    variant="text"
                    disabled={!canChangeType}
                    open={isTypeDropdownOpen}
                    title={canChangeType ? undefined : "응답이 있어 유형을 변경할 수 없습니다"}
                  />
                }
              >
                {QUESTION_TYPES.map((type) => (
                  <DropdownItem
                    key={type}
                    label={QUESTION_TYPE_LABELS[type]}
                    selected={question.type === type}
                    onClick={() => handleTypeChange(type)}
                  />
                ))}
              </Dropdown>
            </div>

            {/* Conditional branch indicator */}
            {hasConditionalRules && (
              <Tooltip content="조건 분기 설정됨" position="top">
                <span className="flex-shrink-0" style={{ color: COLOR.ACCENT }}>
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

            <div className="flex-1" />

            {/* Required toggle — always visible */}
            <div onClick={(e) => e.stopPropagation()}>
              <Toggle
                isOn={!!question.required}
                onToggle={handleRequiredToggle}
                label="필수"
                labelStyle={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
              />
            </div>
          </div>

          {/* Title textarea — always visible */}
          <div className="px-4 pb-3" onClick={(e) => isActive && e.stopPropagation()}>
            <textarea
              ref={titleRef}
              key={question.id}
              defaultValue={question.title}
              onFocus={onActivate}
              onChange={(e) => {
                updateQuestionTitle(question.id, e.target.value);
                const el = e.target;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
              onBlur={(e) => saveField("title", e.target.value)}
              placeholder="질문을 입력하세요"
              rows={1}
              className="w-full bg-transparent px-0 py-2 resize-none overflow-hidden placeholder-[#c4cbd4] border-b-2 border-(--color-border-default) focus:border-(--color-accent) opinion-input"
              style={{
                ...TYPOGRAPHY.STYLE.BODY_1,
                fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
                color: COLOR.TEXT_PRIMARY,
              }}
            />
          </div>

          {/* Full editor — only when active */}
          {isActive && (
            <div
              className="center_question_card_editor px-4 pb-5"
              onClick={(e) => e.stopPropagation()}
            >
              <QuestionEditor question={question} surveyId={surveyId} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Section block ────────────────────────────────────────────────────────────

interface SectionBlockProps {
  section: Section;
  sectionIndex: number;
  questions: Question[];
  surveyId: string;
  onActivateQuestion: (id: string) => void;
  activeQuestionId: string | null;
  newlyAddedQuestionId: string | null;
  questionIndexOffset: number;
  onAddAfter: (questionId: string) => void;
  onAddToEnd: (sectionId: string) => void;
  onAddSection: () => void;
  onAddTextBlock: (sectionId: string) => void;
  onGenerateWithAI: () => void;
}

const SectionBlock: FC<SectionBlockProps> = ({
  section,
  sectionIndex,
  questions,
  surveyId,
  onActivateQuestion,
  activeQuestionId,
  newlyAddedQuestionId,
  questionIndexOffset,
  onAddAfter,
  onAddToEnd,
  onAddSection,
  onAddTextBlock,
  onGenerateWithAI,
}) => {
  const { updateSection } = useBuilderStore();

  return (
    <div className="section_block_wrap space-y-3">
      {/* Section header — reuses the same component as flow view */}
      <SectionHeader
        section={section}
        sectionIndex={sectionIndex}
        surveyId={surveyId}
        onUpdate={(patch) => updateSection(section.id, patch)}
      />

      {/* Questions */}
      <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
        {questions.length === 0 ? (
          <div
            className="rounded-2xl px-6 py-5 text-center"
            style={{
              border: `1px dashed ${COLOR.BORDER_INPUT}`,
              ...TYPOGRAPHY.STYLE.BODY_2,
              color: COLOR.TEXT_DISABLED,
            }}
          >
            질문을 추가하거나 드래그하여 이동하세요
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, i) => (
              <CenterQuestionCard
                key={question.id}
                question={question}
                questionIndex={questionIndexOffset + i}
                surveyId={surveyId}
                isActive={activeQuestionId === question.id}
                isNewlyAdded={newlyAddedQuestionId === question.id}
                onActivate={() => onActivateQuestion(question.id)}
                onAddAfter={onAddAfter}
                onAddToEnd={onAddToEnd}
                onAddSection={onAddSection}
                onAddTextBlock={onAddTextBlock}
                onGenerateWithAI={onGenerateWithAI}
              />
            ))}
          </div>
        )}
      </SortableContext>
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ListViewCanvas() {
  const {
    surveyId,
    questions,
    sections,
    activeQuestionId,
    newlyAddedQuestionId,
    setActiveQuestion,
    reorderQuestions,
    updateQuestion,
    addSection,
    addQuestionOptimistic,
    confirmQuestion,
    rollbackQuestion,
    insertQuestionAfter,
  } = useBuilderStore();

  const canvasScrollRef = useRef<HTMLDivElement>(null);
  // 마운트 직후 기존 activeQuestionId로 스크롤되는 것을 방지
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    if (!activeQuestionId) return;
    requestAnimationFrame(() => {
      const el = canvasScrollRef.current?.querySelector(`[data-question-id="${activeQuestionId}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [activeQuestionId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(SmartKeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAddQuestion = useCallback(
    async (sectionId: string) => {
      if (!surveyId) return;
      const sectionQs = questions
        .filter((q) => q.section_id === sectionId)
        .sort((a, b) => a.order_index - b.order_index);
      const nextOrderIndex = (sectionQs[sectionQs.length - 1]?.order_index ?? -1) + 1;
      const tempId = `temp-${crypto.randomUUID()}`;
      const tempQuestion: Question = {
        id: tempId,
        survey_id: surveyId,
        section_id: sectionId,
        type: "multiple_choice",
        title: "",
        options: null,
        order_index: nextOrderIndex,
        required: false,
        config: null,
        created_at: new Date().toISOString(),
      };
      addQuestionOptimistic(tempId, tempQuestion);
      setActiveQuestion(tempId);
      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "multiple_choice", section_id: sectionId }),
      });
      if (!res.ok) {
        rollbackQuestion(tempId);
        return;
      }
      const question: Question = await res.json();
      confirmQuestion(tempId, question);
    },
    [
      surveyId,
      questions,
      addQuestionOptimistic,
      confirmQuestion,
      rollbackQuestion,
      setActiveQuestion,
    ]
  );

  const handleAddSection = useCallback(async () => {
    if (!surveyId) return;
    const res = await fetch(`/api/surveys/${surveyId}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });
    if (!res.ok) return;
    const section: Section = await res.json();
    addSection(section);
    const tempId = `temp-${crypto.randomUUID()}`;
    const maxOrder = questions.length > 0 ? Math.max(...questions.map((q) => q.order_index)) : -1;
    const tempQuestion: Question = {
      id: tempId,
      survey_id: surveyId,
      section_id: section.id,
      type: "multiple_choice",
      title: "",
      options: null,
      order_index: maxOrder + 1,
      required: false,
      config: null,
      created_at: new Date().toISOString(),
    };
    addQuestionOptimistic(tempId, tempQuestion);
    setActiveQuestion(tempId);
    const qRes = await fetch(`/api/surveys/${surveyId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "multiple_choice", section_id: section.id }),
    });
    if (!qRes.ok) {
      rollbackQuestion(tempId);
      return;
    }
    const question: Question = await qRes.json();
    confirmQuestion(tempId, question);
  }, [
    surveyId,
    questions,
    addSection,
    addQuestionOptimistic,
    confirmQuestion,
    rollbackQuestion,
    setActiveQuestion,
  ]);

  const handleAddAfter = useCallback(
    async (questionId: string) => {
      if (!surveyId) return;
      const afterQ = questions.find((q) => q.id === questionId);
      if (!afterQ?.section_id) return;
      const tempId = `temp-${crypto.randomUUID()}`;
      const tempQuestion: Question = {
        id: tempId,
        survey_id: surveyId,
        section_id: afterQ.section_id,
        type: "multiple_choice",
        title: "",
        options: null,
        order_index: afterQ.order_index + 0.5,
        required: false,
        config: null,
        created_at: new Date().toISOString(),
      };
      insertQuestionAfter(questionId, tempQuestion);
      setActiveQuestion(tempId);
      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "multiple_choice",
          section_id: afterQ.section_id,
          insert_after_id: questionId,
        }),
      });
      if (!res.ok) {
        rollbackQuestion(tempId);
        return;
      }
      const question: Question = await res.json();
      confirmQuestion(tempId, question);
    },
    [surveyId, questions, insertQuestionAfter, setActiveQuestion, confirmQuestion, rollbackQuestion]
  );

  const handleAddTextBlock = useCallback(
    (sectionId: string) => {
      handleAddQuestion(sectionId);
    },
    [handleAddQuestion]
  );

  const handleGenerateWithAI = useCallback(() => {
    // AI 생성 기능 준비 중 — toast는 store의 showToast 없이 직접 처리
    alert("AI 생성 기능을 준비하고 있어요.");
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeQ = questions.find((q) => q.id === active.id);
      const overQ = questions.find((q) => q.id === over.id);
      if (!activeQ || !overQ) return;

      const isCrossSection = activeQ.section_id !== overQ.section_id;

      if (isCrossSection) {
        const targetSectionId = overQ.section_id ?? null;
        const targetSectionQs = [...questions]
          .filter((q) => q.section_id === targetSectionId && q.id !== activeQ.id)
          .sort((a, b) => a.order_index - b.order_index);
        const overIndex = targetSectionQs.findIndex((q) => q.id === over.id);
        targetSectionQs.splice(overIndex === -1 ? 0 : overIndex + 1, 0, {
          ...activeQ,
          section_id: targetSectionId,
        });
        const updatedIds = targetSectionQs.map((q) => q.id);
        updateQuestion(activeQ.id, { section_id: targetSectionId ?? undefined });
        reorderQuestions([
          ...questions
            .filter((q) => q.section_id !== targetSectionId && q.id !== activeQ.id)
            .sort((a, b) => a.order_index - b.order_index)
            .map((q) => q.id),
          ...updatedIds,
        ]);
        if (!surveyId) return;
        await fetch(`/api/surveys/${surveyId}/questions/${activeQ.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section_id: targetSectionId }),
        });
        await fetch(`/api/surveys/${surveyId}/questions/reorder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedIds: updatedIds }),
        });
      } else {
        const sectionId = activeQ.section_id;
        const sectionQs = [...questions]
          .filter((q) => q.section_id === sectionId)
          .sort((a, b) => a.order_index - b.order_index);
        const reordered = arrayMove(
          sectionQs,
          sectionQs.findIndex((q) => q.id === active.id),
          sectionQs.findIndex((q) => q.id === over.id)
        );
        const orderedIds = reordered.map((q) => q.id);
        reorderQuestions([
          ...questions
            .filter((q) => q.section_id !== sectionId)
            .sort((a, b) => a.order_index - b.order_index)
            .map((q) => q.id),
          ...orderedIds,
        ]);
        if (!surveyId) return;
        await fetch(`/api/surveys/${surveyId}/questions/reorder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedIds }),
        });
      }
    },
    [questions, reorderQuestions, updateQuestion, surveyId]
  );

  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  const sortedAllQs = [...questions].sort((a, b) => a.order_index - b.order_index);

  let offset = 0;
  const sectionOffsets = new Map<string, number>();
  for (const s of sortedSections) {
    sectionOffsets.set(s.id, offset);
    offset += sortedAllQs.filter((q) => q.section_id === s.id).length;
  }

  return (
    <div ref={canvasScrollRef} className="list_view_canvas flex-1 overflow-y-auto">
      <div className="max-w-[720px] mx-auto px-6 py-6 space-y-8">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {sortedSections.map((section, idx) => (
            <SectionBlock
              key={section.id}
              section={section}
              sectionIndex={idx}
              questions={sortedAllQs.filter((q) => q.section_id === section.id)}
              surveyId={surveyId ?? ""}
              onActivateQuestion={(id) => setActiveQuestion(id)}
              activeQuestionId={activeQuestionId}
              newlyAddedQuestionId={newlyAddedQuestionId}
              questionIndexOffset={sectionOffsets.get(section.id) ?? 0}
              onAddAfter={handleAddAfter}
              onAddToEnd={handleAddQuestion}
              onAddSection={handleAddSection}
              onAddTextBlock={handleAddTextBlock}
              onGenerateWithAI={handleGenerateWithAI}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
