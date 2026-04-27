"use client";

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { type StartpointConfig } from "@/lib/types/survey";

// Prevents KeyboardSensor from intercepting space/enter in input/textarea elements.
// Without this, typing spaces in any text field while the list is mounted is broken.
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
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useBuilderStore } from "@/lib/store/builder";
import {
  type Question,
  type Section,
  type QuestionType,
  type MultipleChoiceConfig,
  type EndpointConfig,
  type SurveyStatus,
} from "@/lib/types/survey";
import { QuestionCard } from "./QuestionCard";
import { DeleteSectionModal } from "./DeleteSectionModal";
import { SurveyOverviewPanel } from "./SurveyOverviewPanel";
import { COLOR, INTERACTION, TYPOGRAPHY } from "@/lib/design-tokens";
import { Tooltip } from "@/components/ui";
import { useToastStore } from "@/lib/store/toast";

// --- Pinned node (startpoint / endpoint) ---

interface PinnedNodeProps {
  kind: "startpoint" | "endpoint";
  question: Question | null;
  isActive: boolean;
  surveyId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

const PinnedNode: FC<PinnedNodeProps> = ({ kind, question, isActive, onSelect, onAdd }) => {
  const isStart = kind === "startpoint";

  const accentColor = isStart ? COLOR.ACCENT : COLOR.TEXT_MUTED;
  const label = isStart ? "시작" : "종료";
  const addLabel = isStart ? "시작 노드 추가하기" : "종료 노드 추가하기";

  // Subtitle: brief config preview
  let subtitle = "";
  if (question) {
    if (isStart) {
      const cfg = question.config as StartpointConfig | null;
      subtitle = cfg?.message
        ? cfg.message.slice(0, 24) + (cfg.message.length > 24 ? "…" : "")
        : "";
    } else {
      const cfg = question.config as EndpointConfig | null;
      subtitle = cfg?.message
        ? cfg.message.slice(0, 24) + (cfg.message.length > 24 ? "…" : "")
        : "";
    }
  }

  if (!question) {
    return (
      <div
        className="pinned_node_add_wrap flex items-center gap-2 px-3 py-2 mx-2 my-1 rounded-lg cursor-pointer transition-colors"
        style={{ border: `1px dashed ${COLOR.BORDER_DEFAULT}` }}
        onClick={onAdd}
        role="button"
        aria-label={addLabel}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = accentColor;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = COLOR.BORDER_DEFAULT;
        }}
      >
        <div
          className="flex-shrink-0 w-1 self-stretch rounded-full"
          style={{ backgroundColor: COLOR.BORDER_DEFAULT }}
        />
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="text-xs font-medium" style={{ color: COLOR.TEXT_DISABLED }}>
            {label}
          </span>
        </div>
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          style={{ color: COLOR.TEXT_DISABLED, flexShrink: 0 }}
        >
          <path
            d="M6.5 1.5v10M1.5 6.5h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="pinned_node_wrap flex items-center gap-2 px-3 py-2 mx-2 my-1 rounded-lg cursor-pointer transition-colors"
      style={{
        backgroundColor: isActive ? COLOR.ACCENT_BG : COLOR.BG_SURFACE,
        border: `1px solid ${isActive ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
      }}
      onClick={() => onSelect(question.id)}
      role="button"
      aria-label={`${label} 노드 편집하기`}
    >
      {/* Left color bar */}
      <div
        className="flex-shrink-0 w-1 self-stretch rounded-full"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-xs font-semibold" style={{ color: accentColor }}>
          {label}
        </span>
        {subtitle && (
          <span className="text-xs truncate" style={{ color: COLOR.TEXT_MUTED }}>
            {subtitle}
          </span>
        )}
      </div>
      {/* Lock icon — pinned, not draggable */}
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        aria-hidden="true"
        style={{ color: COLOR.TEXT_DISABLED, flexShrink: 0 }}
      >
        <rect
          x="1.5"
          y="4.5"
          width="8"
          height="5.5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M3.5 4.5V3a2 2 0 0 1 4 0v1.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// --- Section card ---

interface SectionCardProps {
  section: Section;
  sectionNumber: number;
  questions: Question[];
  allQuestions: Question[];
  questionIndexMap: Map<string, number>;
  surveyId: string;
  isActive: boolean;
  activeQuestionId: string | null;
  onActivate: () => void;
  onAddQuestion: (type: QuestionType) => void;
  onGenerateWithAI?: () => void;
  onGenerateAll?: () => void;
  canDelete: boolean;
}

const SectionCard: FC<SectionCardProps> = ({
  section,
  sectionNumber,
  questions,
  allQuestions,
  questionIndexMap,
  surveyId,
  isActive,
  activeQuestionId,
  onActivate,
  onAddQuestion,
  onGenerateWithAI,
  onGenerateAll,
  canDelete,
}) => {
  // 이 섹션 안에 선택된 질문이 있는지 (section은 포커스 안 됐지만 내부 question이 선택됨)
  const hasActiveQuestion = questions.some((q) => q.id === activeQuestionId);
  const { updateSection, removeSection } = useBuilderStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(section.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  // Tracks whether Escape was pressed to prevent handleTitleBlur from saving stale state
  const escapedRef = useRef(false);

  useEffect(() => {
    if (!showAddMenu) return;
    const handler = (e: MouseEvent) => {
      if (!addMenuRef.current?.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAddMenu]);

  // Count ConditionalRules in other sections that reference this section's questions
  const brokenRuleCount = allQuestions.reduce((count, q) => {
    if (q.section_id === section.id) return count;
    const config = q.config as MultipleChoiceConfig | null;
    const rules = config?.conditionalRules ?? [];
    return (
      count +
      rules.filter((r) => r.action === "jump_to_section" && r.targetSectionId === section.id).length
    );
  }, 0);

  const handleTitleBlur = useCallback(() => {
    // Escape key sets this ref to prevent saving the reverted (stale closure) value
    if (escapedRef.current) {
      escapedRef.current = false;
      return;
    }
    setIsEditingTitle(false);
    if (draftTitle !== section.title) {
      updateSection(section.id, { title: draftTitle });
      fetch(`/api/surveys/${surveyId}/sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: draftTitle }),
      });
    }
  }, [draftTitle, section.id, section.title, surveyId, updateSection]);

  const handleDeleteConfirm = useCallback(async () => {
    const res = await fetch(`/api/surveys/${surveyId}/sections/${section.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? "Delete failed");
    }

    // Clean up ConditionalRules in remaining questions that referenced any question
    // in the deleted section (targetQuestionId), or the section itself (targetSectionId).
    const deletedQuestionIds = new Set(questions.map((q) => q.id));
    const deletedSectionId = section.id;
    const questionsWithBrokenRules = allQuestions.filter((q) => {
      if (q.section_id === deletedSectionId) return false;
      const cfg = q.config as MultipleChoiceConfig | null;
      return cfg?.conditionalRules?.some(
        (r) =>
          (r.targetQuestionId && deletedQuestionIds.has(r.targetQuestionId)) ||
          r.targetSectionId === deletedSectionId
      );
    });
    await Promise.all(
      questionsWithBrokenRules.map(async (q) => {
        const cfg = q.config as MultipleChoiceConfig;
        const cleaned = {
          ...cfg,
          conditionalRules: cfg.conditionalRules?.filter(
            (r) =>
              (!r.targetQuestionId || !deletedQuestionIds.has(r.targetQuestionId)) &&
              r.targetSectionId !== deletedSectionId
          ),
        };
        await fetch(`/api/surveys/${surveyId}/questions/${q.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: cleaned }),
        });
      })
    );

    removeSection(section.id);
    setShowDeleteModal(false);
  }, [surveyId, section.id, questions, allQuestions, removeSection]);

  // Active header uses accent tint; inactive uses the subtle surface tint
  const headerBg = isActive ? COLOR.ACCENT_BG : COLOR.BG_SURFACE;

  // 프레임 배경:
  //   section 포커스 → 연한 액센트 tint (소속 공간 표현)
  //   내부 question 선택 → 더 연한 tint (소속 암시)
  //   기본 → 투명
  const frameBg = isActive
    ? "rgba(49,130,246,0.18)"
    : hasActiveQuestion
      ? "rgba(49,130,246,0.09)"
      : "transparent";

  return (
    // Section group — Figma 프레임처럼 배경색으로 소속 표현
    <div
      className="section_card_wrap group/section mb-1 overflow-hidden relative"
      style={{
        backgroundColor: frameBg,
        borderRadius: 10,
        transition: "background-color 150ms ease",
      }}
    >
      {/* Section header — clicking anywhere here activates the section */}
      <div
        className="section_card_header flex items-center justify-between px-3 h-8 cursor-pointer"
        style={{ backgroundColor: headerBg }}
        onClick={onActivate}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isEditingTitle ? (
            <input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
                if (e.key === "Escape") {
                  escapedRef.current = true;
                  setDraftTitle(section.title);
                  setIsEditingTitle(false);
                  e.currentTarget.blur();
                }
              }}
              className="text-xs font-medium bg-white rounded px-1.5 py-0.5 opinion-input min-w-0 flex-1"
              style={{ color: COLOR.TEXT_PRIMARY, border: `1px solid ${COLOR.ACCENT}` }}
            />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className="text-xs font-medium truncate transition-colors text-left"
              style={{ color: COLOR.TEXT_SECONDARY }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_PRIMARY;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_SECONDARY;
              }}
            >
              {section.title || `Section ${sectionNumber}`}
            </button>
          )}
        </div>

        {/* Action buttons — always render "+ 질문", show delete only when section is active */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* + 질문 드롭다운 — AI 생성 or 직접 추가 */}
          <div className="relative" ref={addMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddMenu((v) => !v);
              }}
              className="flex items-center justify-center w-5 h-5 rounded-full transition-colors"
              style={{
                color: showAddMenu ? COLOR.ACCENT : COLOR.TEXT_MUTED,
                backgroundColor: showAddMenu ? COLOR.ACCENT_BG : "transparent",
                border: `1px solid ${showAddMenu ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
              }}
              aria-label="질문 추가하기"
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M4.5 1v7M1 4.5h7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {showAddMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden"
                style={{
                  background: "#18181b",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
                  minWidth: 188,
                }}
              >
                {/* AI로 생성하기 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddMenu(false);
                    onGenerateWithAI?.();
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left transition-colors hover:bg-white/5"
                >
                  <span style={{ color: "#df4d18" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5L7 1z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>
                    AI로 생성하기
                  </span>
                </button>

                {/* 전체 생성하기 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddMenu(false);
                    onGenerateAll?.();
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left transition-colors hover:bg-white/5"
                >
                  <span style={{ color: "#df4d18" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="2" fill="currentColor" />
                      <path
                        d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41M2.93 11.07l1.41-1.41M9.66 4.34l1.41-1.41"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>
                    전체 생성하기
                  </span>
                </button>

                {/* 구분선 */}
                <div
                  style={{ height: 1, backgroundColor: "rgba(255,255,255,0.07)", margin: "2px 0" }}
                />

                {/* 직접 추가하기 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddMenu(false);
                    onAddQuestion("multiple_choice");
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left transition-colors hover:bg-white/5"
                >
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M9.5 2.5l2 2L4 12H2v-2l7.5-7.5z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                    직접 추가하기
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Delete button only visible when section is focused — reduces visual noise */}
          {isActive && (
            <Tooltip
              content={canDelete ? "섹션 삭제" : "응답이 있어 삭제할 수 없어요"}
              position="top"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                disabled={!canDelete}
                aria-label={canDelete ? "섹션 삭제하기" : "응답이 있어 삭제할 수 없습니다"}
                className="flex-shrink-0 text-[#c7c8d0] hover:text-(--color-negative) transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
          )}
        </div>
      </div>

      {/* Question rows — section 포커스 시 내용물 연하게 (Figma 프레임 효과) */}
      <div
        className="section_card_body"
        style={{
          backgroundColor: COLOR.BG_BASE,
          opacity: isActive && !hasActiveQuestion ? 0.55 : 1,
          transition: "opacity 150ms ease",
        }}
      >
        {questions.length === 0 ? (
          // Empty section placeholder — guides the user to add or drag questions in
          <div
            className="empty_section_state mx-3 my-2 px-3 py-3 rounded-lg border border-dashed text-xs text-center"
            style={{ borderColor: "rgba(199,200,208,0.6)", color: COLOR.TEXT_DISABLED }}
          >
            질문을 추가하거나 드래그하여 이동하세요
          </div>
        ) : (
          questions.map((question) => (
            <div key={question.id} data-question-id={question.id}>
              <QuestionCard
                question={question}
                index={questionIndexMap.get(question.id) ?? 0}
                surveyId={surveyId}
              />
            </div>
          ))
        )}
      </div>

      {showDeleteModal && (
        <DeleteSectionModal
          section={section}
          questionCount={questions.length}
          brokenRuleCount={brokenRuleCount}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

// --- Survey Info Block (Figma 파일명 패턴) ---

const STATUS_LABELS: Record<SurveyStatus, string> = {
  draft: "초안",
  published: "공개 중",
  closed: "마감",
  archived: "보관됨",
};

const STATUS_COLORS: Record<SurveyStatus, string> = {
  draft: COLOR.TEXT_DISABLED,
  published: COLOR.POSITIVE,
  closed: COLOR.TEXT_MUTED,
  archived: COLOR.TEXT_DISABLED,
};

function SurveyInfoBlock({
  title,
  status,
  onClick,
}: {
  title: string;
  status: SurveyStatus;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="survey_info_block w-full flex items-center justify-between px-4 py-3 flex-shrink-0 text-left"
      style={{
        backgroundColor: hovered ? INTERACTION.HOVER_BG : "transparent",
        borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        transition: INTERACTION.TRANSITION_BG,
        cursor: "pointer",
      }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="truncate"
          style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_PRIMARY }}
        >
          {title || "제목 없는 설문"}
        </span>
        <span style={{ fontSize: "11px", color: STATUS_COLORS[status] }}>
          {STATUS_LABELS[status]}
        </span>
      </div>
      {/* 편집 아이콘 — hover 시 표시 */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          color: COLOR.TEXT_MUTED,
          flexShrink: 0,
          opacity: hovered ? 1 : 0,
          transition: "opacity 120ms ease",
          marginLeft: 8,
        }}
      >
        <path d="M8.5 1.5l2 2L3 11H1v-2L8.5 1.5Z" />
      </svg>
    </button>
  );
}

// --- Main QuestionList ---

export function QuestionList({
  width,
  onMetaSave,
  onOpenMeta,
  floating = false,
}: {
  width?: number;
  onMetaSave?: () => void;
  onOpenMeta?: () => void;
  floating?: boolean;
}) {
  const {
    surveyId,
    surveyTitle,
    surveyStatus,
    questions,
    sections,
    activeSectionId,
    activeQuestionId,
    responseCount,
    addSection,
    reorderQuestions,
    updateQuestion,
    setActiveQuestion,
    setActiveSection,
    addQuestionOptimistic,
    confirmQuestion,
    rollbackQuestion,
  } = useBuilderStore();
  const { showToast } = useToastStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToQuestion = useCallback((id: string) => {
    requestAnimationFrame(() => {
      const el = scrollContainerRef.current?.querySelector(`[data-question-id="${id}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(SmartKeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeQuestion = questions.find((q) => q.id === active.id);
      const overQuestion = questions.find((q) => q.id === over.id);
      if (!activeQuestion || !overQuestion) return;

      const isCrossSection = activeQuestion.section_id !== overQuestion.section_id;

      if (isCrossSection) {
        const targetSectionId = overQuestion.section_id ?? null;
        const targetSectionQuestions = [...questions]
          .filter((q) => q.section_id === targetSectionId && q.id !== activeQuestion.id)
          .sort((a, b) => a.order_index - b.order_index);

        const overIndex = targetSectionQuestions.findIndex((q) => q.id === over.id);
        const insertAt = overIndex === -1 ? 0 : overIndex + 1;
        targetSectionQuestions.splice(insertAt, 0, {
          ...activeQuestion,
          section_id: targetSectionId,
        });
        const updatedTargetIds = targetSectionQuestions.map((q) => q.id);

        // Optimistic update
        updateQuestion(activeQuestion.id, { section_id: targetSectionId ?? undefined });
        reorderQuestions([
          ...questions
            .filter((q) => q.section_id !== targetSectionId && q.id !== activeQuestion.id)
            .sort((a, b) => a.order_index - b.order_index)
            .map((q) => q.id),
          ...updatedTargetIds,
        ]);

        if (!surveyId) return;
        await fetch(`/api/surveys/${surveyId}/questions/${activeQuestion.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section_id: targetSectionId }),
        });
        await fetch(`/api/surveys/${surveyId}/questions/reorder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedIds: updatedTargetIds }),
        });
      } else {
        // Same-section reorder scoped to within-section questions only
        const sectionId = activeQuestion.section_id;
        const sectionQuestions = [...questions]
          .filter((q) => q.section_id === sectionId)
          .sort((a, b) => a.order_index - b.order_index);

        const oldIndex = sectionQuestions.findIndex((q) => q.id === active.id);
        const newIndex = sectionQuestions.findIndex((q) => q.id === over.id);
        const reordered = arrayMove(sectionQuestions, oldIndex, newIndex);
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

    // Auto-add first question optimistically — multiple_choice is the default type
    const tempId = `temp-${crypto.randomUUID()}`;
    const tempQuestion: Question = {
      id: tempId,
      survey_id: surveyId,
      section_id: section.id,
      type: "multiple_choice",
      title: "",
      options: null,
      order_index: 0,
      required: false,
      config: null,
      created_at: new Date().toISOString(),
    };
    addQuestionOptimistic(tempId, tempQuestion);
    setActiveQuestion(tempId);
    scrollToQuestion(tempId);
    setActiveSection(section.id);

    const qRes = await fetch(`/api/surveys/${surveyId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "multiple_choice", section_id: section.id }),
    });
    if (!qRes.ok) {
      rollbackQuestion(tempId);
      showToast("질문을 추가하지 못했어요. 다시 시도해주세요.");
      return;
    }
    const question: Question = await qRes.json();
    confirmQuestion(tempId, question);
    scrollToQuestion(question.id);
  }, [
    surveyId,
    addSection,
    addQuestionOptimistic,
    confirmQuestion,
    rollbackQuestion,
    setActiveQuestion,
    scrollToQuestion,
    showToast,
  ]);

  const handleAddQuestion = useCallback(
    async (sectionId: string, type: QuestionType) => {
      if (!surveyId) return;

      const tempId = `temp-${crypto.randomUUID()}`;
      const sortedSectionQs = questions
        .filter((q) => q.section_id === sectionId)
        .sort((a, b) => a.order_index - b.order_index);
      const nextOrderIndex = (sortedSectionQs[sortedSectionQs.length - 1]?.order_index ?? -1) + 1;

      const tempQuestion: Question = {
        id: tempId,
        survey_id: surveyId,
        section_id: sectionId,
        type,
        title: "",
        options: null,
        order_index: nextOrderIndex,
        required: false,
        config: null,
        created_at: new Date().toISOString(),
      };

      addQuestionOptimistic(tempId, tempQuestion);
      setActiveQuestion(tempId);
      scrollToQuestion(tempId);

      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, section_id: sectionId }),
      });
      if (!res.ok) {
        rollbackQuestion(tempId);
        showToast("질문을 추가하지 못했어요. 다시 시도해주세요.");
        return;
      }
      const question: Question = await res.json();
      confirmQuestion(tempId, question);
      scrollToQuestion(question.id);
    },
    [
      surveyId,
      questions,
      addQuestionOptimistic,
      confirmQuestion,
      rollbackQuestion,
      setActiveQuestion,
      scrollToQuestion,
      showToast,
    ]
  );

  // handleAddPinnedNode: creates a startpoint or endpoint question (section_id = null)
  const handleAddPinnedNode = useCallback(
    async (kind: "startpoint" | "endpoint") => {
      if (!surveyId) return;
      const alreadyExists = questions.some((q) => q.type === kind && q.section_id == null);
      if (alreadyExists) return;

      const tempId = `temp-${crypto.randomUUID()}`;
      const tempQuestion: Question = {
        id: tempId,
        survey_id: surveyId,
        section_id: null,
        type: kind,
        title: kind === "startpoint" ? "시작" : "종료",
        options: null,
        // startpoint gets order_index -1 (before everything), endpoint gets a large value
        order_index: kind === "startpoint" ? -1 : 99999,
        required: false,
        config: null,
        created_at: new Date().toISOString(),
      };
      addQuestionOptimistic(tempId, tempQuestion);
      setActiveQuestion(tempId);

      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: kind,
          title: tempQuestion.title,
          section_id: null,
          order_index: tempQuestion.order_index,
        }),
      });
      if (!res.ok) {
        rollbackQuestion(tempId);
        showToast("노드를 추가하지 못했어요. 다시 시도해 주세요.");
        return;
      }
      const question: Question = await res.json();
      confirmQuestion(tempId, question);
      setActiveQuestion(question.id);
    },
    [
      surveyId,
      questions,
      addQuestionOptimistic,
      confirmQuestion,
      rollbackQuestion,
      setActiveQuestion,
      showToast,
    ]
  );

  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  const sortedAllQuestions = [...questions].sort((a, b) => a.order_index - b.order_index);

  // Pinned nodes: section_id is null and type is startpoint/endpoint
  const startpointQuestion =
    questions.find((q) => q.type === "startpoint" && q.section_id == null) ?? null;
  const endpointQuestion =
    questions.find((q) => q.type === "endpoint" && q.section_id == null) ?? null;

  // Regular questions (assigned to a section) — used for DnD and section rendering
  const regularQuestions = sortedAllQuestions.filter(
    (q) =>
      !(q.type === "startpoint" && q.section_id == null) &&
      !(q.type === "endpoint" && q.section_id == null)
  );

  // Section-scoped numbering: each question's index is relative to its section,
  // not the global question list. This matches the breadcrumb display in QuestionSettings.
  const questionIndexMap = new Map<string, number>();
  sortedSections.forEach((section) => {
    regularQuestions
      .filter((q) => q.section_id === section.id)
      .forEach((q, i) => questionIndexMap.set(q.id, i));
  });

  // Sections can only be deleted when no responses exist — deleting a section cascades to its questions
  const canDeleteSection = responseCount === 0;

  return (
    // Panel background: surface_container_low (not white) — creates visual hierarchy vs canvas
    // floating=true → wrapper가 width/shadow 담당, 컴포넌트는 w-full로
    <div
      style={
        floating
          ? { backgroundColor: COLOR.BG_BASE }
          : width
            ? {
                width,
                minWidth: width,
                maxWidth: width,
                boxShadow: "1px 0 0 rgba(199,200,208,0.15)",
                backgroundColor: COLOR.BG_BASE,
              }
            : { boxShadow: "1px 0 0 rgba(199,200,208,0.15)", backgroundColor: COLOR.BG_BASE }
      }
      className={`question_list_area flex flex-col overflow-hidden ${floating ? "w-full h-full flex-1" : "w-[280px] flex-shrink-0"}`}
    >
      <>
        {/* 설문 info 블록 — Figma 파일명 패턴, 클릭 시 메타 편집 모달 오픈 */}
        {onOpenMeta && (
          <SurveyInfoBlock title={surveyTitle} status={surveyStatus} onClick={onOpenMeta} />
        )}

        {/* Questions tab header — question count + 섹션 추가 */}
        <div
          className="question_list_header flex items-center justify-between px-4 h-9 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
            backgroundColor: COLOR.BG_BASE,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
              질문 리스트
            </span>
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
              style={{ color: COLOR.TEXT_MUTED, backgroundColor: COLOR.BG_SURFACE }}
            >
              {questions.length}
            </span>
          </div>
          <button
            onClick={handleAddSection}
            className="flex items-center gap-0.5 text-xs font-medium hover:bg-(--color-accent-bg) px-2 py-1 rounded-lg transition-colors"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = COLOR.ACCENT;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_MUTED;
            }}
            style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}`, color: COLOR.TEXT_MUTED }}
          >
            + 섹션
          </button>
        </div>

        {/* Scrollable list */}
        <div ref={scrollContainerRef} className="question_list_body flex-1 overflow-y-auto pb-2">
          {/* Startpoint pinned node — always at the top, above all sections */}
          <PinnedNode
            kind="startpoint"
            question={startpointQuestion}
            isActive={activeQuestionId === startpointQuestion?.id}
            surveyId={surveyId ?? ""}
            onSelect={setActiveQuestion}
            onAdd={() => handleAddPinnedNode("startpoint")}
          />

          {sections.length === 0 ? (
            // Empty state — on_surface_variant text
            <div className="px-4 py-10 text-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{
                  backgroundColor: "var(--color-bg-base)",
                  boxShadow: "0 1px 4px rgba(25,28,30,0.06)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  style={{ color: COLOR.TEXT_DISABLED }}
                >
                  <rect
                    x="3"
                    y="3"
                    width="12"
                    height="12"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 9h6M9 6v6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: COLOR.TEXT_MUTED }}>
                섹션을 추가하면
                <br />
                질문을 구성할 수 있어요
              </p>
              <button
                onClick={handleAddSection}
                className="text-xs font-semibold text-white rounded-lg px-3 py-1.5 transition-opacity hover:opacity-90"
                style={{ background: COLOR.ACCENT }}
              >
                첫 번째 섹션 추가하기
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={regularQuestions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedSections.map((section, idx) => {
                  const sectionQuestions = regularQuestions.filter(
                    (q) => q.section_id === section.id
                  );
                  return (
                    <SectionCard
                      key={section.id}
                      section={section}
                      sectionNumber={idx + 1}
                      questions={sectionQuestions}
                      allQuestions={regularQuestions}
                      questionIndexMap={questionIndexMap}
                      surveyId={surveyId ?? ""}
                      isActive={activeSectionId === section.id}
                      activeQuestionId={activeQuestionId}
                      onActivate={() => {
                        setActiveSection(section.id);
                        setActiveQuestion(null);
                      }}
                      onAddQuestion={(type) => handleAddQuestion(section.id, type)}
                      onGenerateWithAI={() => showToast("AI 생성 기능을 준비하고 있어요.")}
                      onGenerateAll={() => showToast("AI 전체 생성 기능을 준비하고 있어요.")}
                      canDelete={canDeleteSection}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          )}

          {/* Endpoint pinned node — always at the bottom, below all sections */}
          <PinnedNode
            kind="endpoint"
            question={endpointQuestion}
            isActive={activeQuestionId === endpointQuestion?.id}
            surveyId={surveyId ?? ""}
            onSelect={setActiveQuestion}
            onAdd={() => handleAddPinnedNode("endpoint")}
          />
        </div>
      </>
    </div>
  );
}
