"use client";

import { useRef, useState, useCallback, useEffect, type FC, type CSSProperties } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { useToastStore } from "@/lib/store/toast";
import { type Question, type Section, type QuestionType } from "@/lib/types/survey";
import {
  COLOR,
  QUESTION_TYPE_COLOR,
  QUESTION_TYPE_ICON_BG,
  SHADOW,
  RADIUS,
} from "@/lib/design-tokens";
import { getContrastTextColor } from "@/lib/utils/color";
import { QuestionTypeIcon } from "@/components/builder/QuestionTypeIcon";
import { QUESTION_TYPE_LABELS } from "@/components/builder/constants";
import { QuestionEditor, TextareaWithFocus } from "@/components/builder/QuestionSettings";

// FlowView-only canvas values — not part of the system palette
// canvas bg → design token (다크모드 자동 대응, 하드코딩 #f6f7f9 제거)
const FLOW_COLOR = {
  canvas: COLOR.BG_SECTION,
  sectionLabelBg: "#faf8ff", // subtle purple-tint badge bg (section color 있을 때만 사용)
  border: "#c3c6d7", // solid border for SVG paths (rgba won't render in SVG markers)
};

// ─── Flow Edge Design System ──────────────────────────────────────────────────
// 선 스타일 변경은 여기서만. FlowArrows 렌더 코드는 건드리지 않는다.
const FLOW_EDGE = {
  // Default sequential arrows (조건 없는 순차 흐름)
  default: {
    stroke: "rgba(180,183,195,0.85)",
    strokeWidth: 1,
    strokeDasharray: "4 3", // 기본: 점선
    markerFill: "rgba(180,183,195,0.95)",
    markerSize: 8, // userSpaceOnUse px
  },
  // Hover / active state (노드 호버 시 연결된 엣지)
  active: {
    stroke: COLOR.ACCENT,
    strokeWidth: 1.2,
    strokeDasharray: undefined, // 호버: 실선
    markerFill: COLOR.ACCENT,
    markerSize: 8,
  },
  // Within-section arrows on light section bg
  sectionDark: {
    stroke: "rgba(25,28,30,0.35)",
    markerFill: "rgba(25,28,30,0.6)",
  },
  // Within-section arrows on dark section bg
  sectionLight: {
    stroke: "rgba(255,255,255,0.7)",
    markerFill: "rgba(255,255,255,0.8)",
  },
  // Conditional branch arrows (조건부 분기)
  cond: {
    stroke: "rgba(49,130,246,0.75)",
    strokeWidth: 1.2,
    strokeDasharray: "5,4",
    markerFill: "rgba(49,130,246,0.85)",
    markerSize: 8, // userSpaceOnUse — strokeWidth 영향 없이 고정 크기
  },
  // Default destination override arrows (next_target set, no conditional rules)
  defaultTarget: {
    stroke: "rgba(180,183,195,0.95)" as string,
    strokeWidth: 1.2,
    strokeDasharray: undefined as string | undefined,
    markerFill: "rgba(180,183,195,0.95)" as string,
    markerSize: 8,
  },
  // Condition label badge
  badge: {
    fill: COLOR.BG_BASE,
    stroke: "rgba(49,130,246,0.35)",
    textColor: COLOR.ACCENT,
    height: 22,
    rx: 11,
    fontSize: 10,
    padH: 16, // badge 양옆 여백 (gap 계산에도 사용)
  },
} as const;

// Duck-typed conditional rule shape
interface RawConditionEntry {
  answerValue?: string;
  action?: string;
  targetQuestionId?: string;
  targetSectionId?: string;
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const NODE_W = 240;
const NODE_H = 107;
const EXPANDED_CARD_W = 400;
const EXPANDED_CARD_MIN_H = 200;
const DEFAULT_COL_GAP = 48; // horizontal gap between nodes with no condition
const COND_BADGE_PAD = 16; // badge padding on each side
const SEC_PAD_X = 24;
const SEC_PAD_Y = 24; // top padding inside section container
const SEC_PAD_Y_BOT = 48; // bottom padding — extra room for the "+" add-question button
const SEC_V_GAP = 80;
const CANVAS_MARGIN_X = 60;
const CANVAS_MARGIN_TOP = 60;

// 가로모드: sections stack vertically, questions extend horizontally in one row (no wrapping)
function sectionContainerHeight(): number {
  return SEC_PAD_Y + SEC_PAD_Y_BOT + NODE_H;
}

function estimateBadgeWidth(label: string | undefined): number {
  if (!label) return 60;
  return Math.max(60, label.length * 7 + 24);
}

// ─── Layout types ─────────────────────────────────────────────────────────────

interface NodePos {
  question: Question;
  x: number;
  y: number;
}

interface SectionLayout {
  section: Section;
  x: number;
  y: number;
  width: number;
  height: number;
  nodes: NodePos[];
}

interface FlowLayout {
  sections: SectionLayout[];
  canvasWidth: number;
  canvasHeight: number;
}

// Additional constants for vertical layout (sections side-by-side, questions stacked)
const VERT_NODE_GAP = 48; // vertical gap between stacked nodes within a section
const VERT_SEC_H_GAP = 80; // horizontal gap between sections in vertical mode

function computeVerticalFlowLayout(
  sections: Section[],
  questions: Question[],
  secGap = VERT_SEC_H_GAP,
  nodeW = NODE_W,
  measuredHeights: Record<string, number> = {}
): FlowLayout {
  const sorted = [...sections].sort((a, b) => a.order_index - b.order_index);

  const qBySection = new Map<string, Question[]>();
  for (const q of questions) {
    if (q.section_id) {
      const arr = qBySection.get(q.section_id) ?? [];
      arr.push(q);
      qBySection.set(q.section_id, arr);
    }
  }
  for (const [sid, qs] of qBySection) {
    qBySection.set(
      sid,
      [...qs].sort((a, b) => a.order_index - b.order_index)
    );
  }

  // Resolve node height: use measured height for expanded mode, else NODE_H
  function nodeH(qId: string): number {
    return measuredHeights[qId] ?? (nodeW === NODE_W ? NODE_H : EXPANDED_CARD_MIN_H);
  }

  // Build slot-0 label map to determine per-pair gap (same pattern as computeFlowLayout)
  const slot0LabelMap = new Map<string, string | undefined>();
  for (const q of questions) {
    const cfg = q.config as Record<string, unknown> | null;
    if (!cfg?.["conditionalEnabled"]) continue;
    const rules = cfg["conditionalRules"];
    if (!Array.isArray(rules)) continue;
    for (const r of rules as { targetQuestionId?: string; answerValue?: string }[]) {
      if (r.targetQuestionId) {
        const key = `${q.id}→${r.targetQuestionId}`;
        if (!slot0LabelMap.has(key)) {
          slot0LabelMap.set(key, r.answerValue);
        }
      }
    }
  }

  let currentX = CANVAS_MARGIN_X;
  let maxHeight = 0;
  const sectionLayouts: SectionLayout[] = [];

  for (const section of sorted) {
    const sqs = qBySection.get(section.id) ?? [];
    const secW = SEC_PAD_X * 2 + nodeW;

    // Accumulate nodeY per node using per-pair gap
    const nodes: NodePos[] = [];
    let nodeY = CANVAS_MARGIN_TOP + SEC_PAD_Y;
    for (let i = 0; i < sqs.length; i++) {
      nodes.push({ question: sqs[i], x: currentX + SEC_PAD_X, y: nodeY });
      if (i < sqs.length - 1) {
        const key = `${sqs[i].id}→${sqs[i + 1].id}`;
        const label = slot0LabelMap.get(key);
        // When a label badge sits on the slot-0 line, reserve extra vertical space for it
        const gap =
          label !== undefined
            ? FLOW_EDGE.badge.height + COND_BADGE_PAD * 2 // 22 + 32 = 54px
            : VERT_NODE_GAP;
        nodeY += nodeH(sqs[i].id) + gap;
      }
    }

    const lastNodeH = sqs.length > 0 ? nodeH(sqs[sqs.length - 1].id) : NODE_H;
    // expanded 모드: 섹션 컨테이너 숨김 → SEC_PAD_Y_BOT 불필요, 카드 크기에 맞게만
    const padBot = nodeW === NODE_W ? SEC_PAD_Y_BOT : SEC_PAD_Y;
    const secH =
      nodes.length > 0
        ? nodes[nodes.length - 1].y - (CANVAS_MARGIN_TOP + SEC_PAD_Y) + lastNodeH + padBot
        : SEC_PAD_Y + padBot + (nodeW === NODE_W ? NODE_H : EXPANDED_CARD_MIN_H);

    sectionLayouts.push({
      section,
      x: currentX,
      y: CANVAS_MARGIN_TOP,
      width: secW,
      height: secH,
      nodes,
    });
    maxHeight = Math.max(maxHeight, secH);
    currentX += secW + secGap;
  }

  return {
    sections: sectionLayouts,
    canvasWidth: Math.max(currentX + 60, 600),
    canvasHeight: Math.max(CANVAS_MARGIN_TOP + maxHeight + 60, 400),
  };
}

function computeFlowLayout(
  sections: Section[],
  questions: Question[],
  secGap = SEC_V_GAP,
  nodeW = NODE_W,
  measuredHeights: Record<string, number> = {}
): FlowLayout {
  const sorted = [...sections].sort((a, b) => a.order_index - b.order_index);

  const qBySection = new Map<string, Question[]>();
  for (const q of questions) {
    if (q.section_id) {
      const arr = qBySection.get(q.section_id) ?? [];
      arr.push(q);
      qBySection.set(q.section_id, arr);
    }
  }
  for (const [sid, qs] of qBySection) {
    qBySection.set(
      sid,
      [...qs].sort((a, b) => a.order_index - b.order_index)
    );
  }

  // Build slot-0 label map: key = "srcId→tgtId", value = first answerValue
  const slot0LabelMap = new Map<string, string | undefined>();
  for (const q of questions) {
    const cfg = q.config as Record<string, unknown> | null;
    if (!cfg?.["conditionalEnabled"]) continue;
    const rules = cfg["conditionalRules"];
    if (!Array.isArray(rules)) continue;
    for (const r of rules as { targetQuestionId?: string; answerValue?: string }[]) {
      if (r.targetQuestionId) {
        const key = `${q.id}→${r.targetQuestionId}`;
        if (!slot0LabelMap.has(key)) {
          slot0LabelMap.set(key, r.answerValue);
        }
      }
    }
  }

  let currentY = CANVAS_MARGIN_TOP;
  let maxRight = 0;
  const sectionLayouts: SectionLayout[] = [];

  for (const section of sorted) {
    const sqs = qBySection.get(section.id) ?? [];
    // For expanded mode, use the measured/fallback height of the tallest card in this section
    const sectionNodeH =
      nodeW === NODE_W
        ? NODE_H
        : Math.max(
            ...sqs.map((q) => measuredHeights[q.id] ?? EXPANDED_CARD_MIN_H),
            EXPANDED_CARD_MIN_H
          );
    const h = nodeW === NODE_W ? sectionContainerHeight() : SEC_PAD_Y + sectionNodeH + SEC_PAD_Y; // expanded: 상하 동일 패딩, 버튼 공간 없음

    // Accumulate x per node using per-pair gap
    const nodes: NodePos[] = [];
    let nodeX = CANVAS_MARGIN_X + SEC_PAD_X;
    for (let i = 0; i < sqs.length; i++) {
      nodes.push({ question: sqs[i], x: nodeX, y: currentY + SEC_PAD_Y });
      if (i < sqs.length - 1) {
        const key = `${sqs[i].id}→${sqs[i + 1].id}`;
        const label = slot0LabelMap.get(key);
        const gap =
          label !== undefined ? estimateBadgeWidth(label) + COND_BADGE_PAD * 2 : DEFAULT_COL_GAP;
        nodeX += nodeW + gap;
      }
    }

    const w =
      nodes.length > 0
        ? nodes[nodes.length - 1].x - CANVAS_MARGIN_X + nodeW + SEC_PAD_X
        : SEC_PAD_X * 2 + nodeW;

    sectionLayouts.push({ section, x: CANVAS_MARGIN_X, y: currentY, width: w, height: h, nodes });
    maxRight = Math.max(maxRight, CANVAS_MARGIN_X + w);
    currentY += h + secGap;
  }

  return {
    sections: sectionLayouts,
    canvasWidth: Math.max(maxRight + 80, 600),
    canvasHeight: currentY + 60,
  };
}

// ─── Pinned Flow Node (startpoint / endpoint) ────────────────────────────────

const PINNED_NODE_W = 160;
const PINNED_NODE_H = 60;

const PinnedFlowNode: FC<{
  kind: "startpoint" | "endpoint";
  question: Question;
  x: number;
  y: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
}> = ({ kind, question, x, y, isActive, onSelect, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isStart = kind === "startpoint";

  const borderColor = isActive
    ? COLOR.ACCENT
    : isHovered
      ? "rgba(49,130,246,0.35)"
      : COLOR.BORDER_DEFAULT;

  return (
    <div
      data-flow-node="true"
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.(question.id);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover?.(null);
      }}
      onClick={() => onSelect(question.id)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: PINNED_NODE_W,
        height: PINNED_NODE_H,
        backgroundColor: isStart ? COLOR.ACCENT_BG : COLOR.BG_SURFACE,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        cursor: "pointer",
        transition: "border-color 120ms ease",
        boxShadow: isActive ? `0 0 0 2px ${COLOR.ACCENT}22` : "none",
      }}
      className="flow_pinned_node_wrap"
    >
      <span
        className="text-xs font-semibold leading-none"
        style={{ color: isStart ? COLOR.ACCENT : COLOR.TEXT_SECONDARY }}
      >
        {isStart ? "시작" : "종료"}
      </span>
      {question.title && (
        <span
          className="text-xs leading-none px-2 text-center line-clamp-1"
          style={{ color: COLOR.TEXT_MUTED }}
        >
          {question.title}
        </span>
      )}
    </div>
  );
};

// ─── Question Card node ───────────────────────────────────────────────────────

// ─── Node state styles ────────────────────────────────────────────────────────
const NODE_STYLE = {
  default: {
    border: "1px solid rgba(25,28,30,0.07)",
    boxShadow: "0 1px 3px rgba(25,28,30,0.06)",
  },
  hover: {
    border: "1.2px solid rgba(49,130,246,0.4)",
    boxShadow: "0 2px 8px rgba(25,28,30,0.08)",
  },
  clicked: {
    border: `1.2px solid ${COLOR.ACCENT}`,
    boxShadow: "0 2px 10px rgba(25,28,30,0.10)",
  },
} as const;

const ADD_QUESTION_TYPES: { type: QuestionType; label: string }[] = [
  { type: "multiple_choice", label: QUESTION_TYPE_LABELS.multiple_choice },
  { type: "short_text", label: QUESTION_TYPE_LABELS.short_text },
  { type: "long_text", label: QUESTION_TYPE_LABELS.long_text },
  { type: "checkbox", label: QUESTION_TYPE_LABELS.checkbox },
  { type: "scale", label: QUESTION_TYPE_LABELS.scale },
];

function NodeCard({
  question,
  x,
  y,
  globalIndex,
  isActive,
  onSelect,
  onHover,
  onAddQuestion,
  onGenerateWithAI,
}: {
  question: Question;
  x: number;
  y: number;
  globalIndex: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
  onAddQuestion?: (id: string, mode: "after" | "end") => void;
  onGenerateWithAI?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const nodeStyle = isActive
    ? NODE_STYLE.clicked
    : isHovered
      ? NODE_STYLE.hover
      : NODE_STYLE.default;

  return (
    <div
      data-flow-node="true"
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.(question.id);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover?.(null);
        setDropdownOpen(false);
      }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: NODE_W,
        height: NODE_H,
      }}
      className="flow_question_node_wrap group"
    >
      {/* Inner card — click target, overflow-hidden so rounded corners clip content */}
      <div
        onClick={() => onSelect(question.id)}
        style={{
          width: "100%",
          height: "100%",
          border: nodeStyle.border,
          boxShadow: nodeStyle.boxShadow,
          backgroundColor: COLOR.BG_BASE,
          transition: "border 120ms ease, box-shadow 120ms ease",
        }}
        className="rounded-2xl cursor-pointer select-none flex items-center overflow-hidden"
      >
        <div className="px-3 w-full flex items-center gap-2.5 overflow-hidden">
          {/* Type icon badge */}
          <div
            className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center"
            style={{ backgroundColor: QUESTION_TYPE_ICON_BG }}
          >
            <QuestionTypeIcon
              type={question.type}
              color={QUESTION_TYPE_COLOR[question.type]}
              size={13}
            />
          </div>
          {/* Label + title */}
          <div className="flex flex-col gap-0.5 overflow-hidden min-w-0">
            <span
              className="text-xs font-medium leading-none"
              style={{ color: COLOR.TEXT_DISABLED }}
            >
              Question {String(globalIndex + 1).padStart(2, "0")}
              {question.required && (
                <span className="ml-1" style={{ color: COLOR.ACCENT }}>
                  *
                </span>
              )}
            </span>
            <p
              className="text-sm font-semibold leading-snug line-clamp-2"
              style={{ color: COLOR.TEXT_PRIMARY }}
            >
              {question.title || (
                <span className="font-normal" style={{ color: COLOR.TEXT_DISABLED }}>
                  Untitled question
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Hover CirclePlus button — right-center of node */}
      {onAddQuestion && (isHovered || dropdownOpen) && (
        <div
          style={{
            position: "absolute",
            right: -16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 21,
          }}
        >
          <button
            aria-label="질문 추가하기"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((prev) => !prev);
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: COLOR.BG_BASE,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              boxShadow: SHADOW.CARD,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: dropdownOpen ? COLOR.ACCENT : COLOR.TEXT_MUTED,
              transition: "color 120ms",
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.color = COLOR.ACCENT)}
            onMouseOut={(e) => {
              if (!dropdownOpen)
                (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_MUTED;
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </button>

          {/* Add question dropdown */}
          {dropdownOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                left: "calc(100% + 8px)",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: COLOR.BG_BASE,
                borderRadius: RADIUS.LG,
                boxShadow: SHADOW.DROPDOWN,
                zIndex: 22,
                minWidth: 164,
                padding: "6px",
              }}
            >
              {[
                {
                  label: "다음에 추가하기",
                  icon: "✏️",
                  action: () => onAddQuestion(question.id, "after"),
                },
                {
                  label: "섹션 끝에 추가하기",
                  icon: "✏️",
                  action: () => onAddQuestion(question.id, "end"),
                },
              ].map(({ label, icon, action }) => (
                <div
                  key={label}
                  role="button"
                  aria-label={label}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                    action();
                  }}
                  className="dropdown_item rounded-lg cursor-pointer"
                  style={{
                    padding: "8px 10px",
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLOR.TEXT_PRIMARY,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background-color 120ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span>{icon}</span>
                  {label}
                </div>
              ))}
              <div
                style={{ height: 1, backgroundColor: COLOR.BORDER_DEFAULT, margin: "4px 8px" }}
              />
              {[
                { label: "AI로 다음에 추가하기", mode: "after" as const },
                { label: "AI로 섹션 끝에 추가하기", mode: "end" as const },
              ].map(({ label, mode: _mode }) => (
                <div
                  key={label}
                  role="button"
                  aria-label={label}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onGenerateWithAI?.();
                  }}
                  className="dropdown_item rounded-lg cursor-pointer"
                  style={{
                    padding: "8px 10px",
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLOR.ACCENT,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background-color 120ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span>✦</span>
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const QuestionNode: FC<{
  nodePos: NodePos;
  globalIndex: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
  onAddQuestion?: (id: string, mode: "after" | "end") => void;
  onGenerateWithAI?: () => void;
}> = ({ nodePos, globalIndex, isActive, onSelect, onHover, onAddQuestion, onGenerateWithAI }) => (
  <NodeCard
    question={nodePos.question}
    x={nodePos.x}
    y={nodePos.y}
    globalIndex={globalIndex}
    isActive={isActive}
    onSelect={onSelect}
    onHover={onHover}
    onAddQuestion={onAddQuestion}
    onGenerateWithAI={onGenerateWithAI}
  />
);

// ─── Expanded question card node ─────────────────────────────────────────────

const ExpandedQuestionNode: FC<{
  nodePos: NodePos;
  globalIndex: number;
  isActive: boolean;
  surveyId: string;
  onSelect: (id: string) => void;
  onMeasure: (id: string, height: number) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
}> = ({ nodePos, globalIndex, isActive, surveyId, onSelect, onMeasure, onHover, onLeave }) => {
  const { question, x, y } = nodePos;
  const { updateQuestionTitle, setIsSaving } = useBuilderStore();
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const cardRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;
      const supported = typeof ResizeObserver !== "undefined";
      if (!supported) {
        onMeasure(question.id, EXPANDED_CARD_MIN_H);
        return;
      }
      const ro = new ResizeObserver(([entry]) => {
        onMeasure(question.id, entry.contentRect.height);
      });
      ro.observe(el);
      return () => ro.disconnect();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question.id]
  );

  async function saveField(field: string, value: unknown) {
    if (!surveyId) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
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

  return (
    <div
      data-flow-node="true"
      onMouseEnter={() => onHover(question.id)}
      onMouseLeave={() => onLeave()}
      onClick={() => onSelect(question.id)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: EXPANDED_CARD_W,
        minHeight: EXPANDED_CARD_MIN_H,
        cursor: "pointer",
      }}
      className="flow_expanded_node_wrap"
    >
      <div
        ref={cardRef}
        className="question_card_wrap rounded-2xl px-10 pt-6 pb-8"
        style={{
          backgroundColor: COLOR.BG_BASE,
          boxShadow: isActive
            ? `0 0 0 2px ${COLOR.ACCENT}, 0 2px 16px rgba(25,28,30,0.07)`
            : "0 2px 16px rgba(25,28,30,0.07), 0 1px 4px rgba(25,28,30,0.04)",
          transition: "box-shadow 120ms ease",
        }}
      >
        {/* Question label */}
        <div
          className="mb-3"
          style={{ fontSize: "12px", color: COLOR.TEXT_MUTED, letterSpacing: "0.02em" }}
        >
          Question {String(globalIndex + 1).padStart(2, "0")}
          {question.required && (
            <span className="ml-1" style={{ color: COLOR.ACCENT }}>
              *
            </span>
          )}
        </div>

        {/* Question title — inline editable textarea (same pattern as QuestionSettings) */}
        <TextareaWithFocus
          titleRef={titleRef}
          activeQuestion={question}
          onBlur={handleTitleBlur}
          onTitleChange={(id, value, target) => {
            updateQuestionTitle(id, value);
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        {/* Type-specific editor — reads/writes from store same as QuestionSettings */}
        <div className="mt-5">
          <QuestionEditor question={question} surveyId={surveyId} />
        </div>
      </div>
    </div>
  );
};

// ─── Section container ────────────────────────────────────────────────────────

const SectionContainer: FC<{
  layout: SectionLayout;
  sectionNumber: number;
  isActive: boolean;
  onSelect: (sectionId: string) => void;
  zoomLevel?: number;
  cardMode?: "compact" | "expanded";
}> = ({ layout, sectionNumber, isActive, onSelect, zoomLevel = 1, cardMode = "compact" }) => {
  const { section, x, y, width, height } = layout;
  const label = section.title || `Section ${sectionNumber}`;
  const labelScale = 1 / zoomLevel;

  // expanded 모드: 섹션 컨테이너 박스 숨김, 레이블 + 작은 구분선만 표시
  // 카드들이 이미 충분히 시각적 그룹을 형성하므로 큰 박스가 불필요
  if (cardMode === "expanded") {
    return (
      <div
        data-flow-section
        style={{
          position: "absolute",
          left: x,
          top: y - 28,
          zIndex: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transform: `scale(${labelScale})`,
          transformOrigin: "left bottom",
        }}
        onClick={() => onSelect(section.id)}
      >
        <span
          className="text-xs font-semibold"
          style={{ color: section.color ?? COLOR.TEXT_MUTED, letterSpacing: "0.04em" }}
        >
          {label.toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Section label — sits above the box, Figma frame-title style */}
      <div
        data-flow-section
        style={{
          position: "absolute",
          left: x,
          top: y - 30,
          zIndex: 1,
          cursor: "pointer",
          padding: "4px 10px",
          borderRadius: "8px",
          backgroundColor: section.color ?? "transparent",
          transform: `scale(${labelScale})`,
          transformOrigin: "left bottom",
        }}
        onClick={() => onSelect(section.id)}
      >
        <span
          className="text-xs font-medium leading-none"
          style={{
            color: section.color ? getContrastTextColor(section.color) : COLOR.TEXT_SECONDARY,
          }}
        >
          {label}
        </span>
      </div>

      {/* Dashed container outline — clickable to select section */}
      <div
        data-flow-section
        onClick={() => onSelect(section.id)}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          height,
          borderRadius: 16,
          border: isActive ? `1.5px solid ${COLOR.ACCENT}` : `1px solid ${COLOR.BORDER_DEFAULT}`,
          backgroundColor: section.color ?? "transparent",
          cursor: "pointer",
        }}
      />
    </>
  );
};

// ─── Flow arrows SVG ──────────────────────────────────────────────────────────
//
// Line rules:
//   Default (sequential flow) — gray solid, 1.5px, small gray arrowhead
//   Conditional (branch)      — blue dashed, 1.5px, blue arrowhead + label badge
//
// Routing rules:
//   Within section   : right-edge → left-edge, horizontal cubic bezier
//   Between sections : bottom-center → top-center, vertical S-curve
//   Conditional fwd  : right-edge → left-edge, tight cubic
//   Conditional back : right-edge → left-edge, outward arc via extended control points

const FlowArrows: FC<{
  sections: SectionLayout[];
  canvasWidth: number;
  canvasHeight: number;
  questions: Question[];
  direction: "horizontal" | "vertical";
  hoveredNodeId: string | null;
  nodeW?: number;
  nodeH?: number;
  measuredHeights?: Record<string, number>;
}> = ({
  sections,
  canvasWidth,
  canvasHeight,
  questions,
  direction,
  hoveredNodeId,
  nodeW = NODE_W,
  nodeH: nodeHProp = NODE_H,
  measuredHeights = {},
}) => {
  function resolveNodeH(qId: string): number {
    if (nodeW === NODE_W) return nodeHProp;
    return measuredHeights[qId] ?? EXPANDED_CARD_MIN_H;
  }
  const nodeMap = new Map<string, NodePos>();
  for (const sec of sections) {
    for (const np of sec.nodes) nodeMap.set(np.question.id, np);
  }

  type DefaultArrow = { d: string; key: string; color?: string; fromId?: string; toId?: string };
  type CondArrow = { d: string; key: string; label?: string; mx: number; my: number };
  type DefaultTargetArrow = { d: string; key: string; fromId: string; toId: string };

  const defaultArrows: DefaultArrow[] = [];
  const condArrows: CondArrow[] = [];
  const defaultTargetArrows: DefaultTargetArrow[] = [];

  // Build global next-question map (sorted by order_index)
  const sortedAll = [...questions].sort((a, b) => a.order_index - b.order_index);
  const nextQuestionMap = new Map<string, string>();
  for (let i = 0; i < sortedAll.length - 1; i++) {
    nextQuestionMap.set(sortedAll[i].id, sortedAll[i + 1].id);
  }

  // Helper: true when a question has active conditional rules (toggle must be ON).
  // When active, default sequential arrow from that question is suppressed.
  function hasConditionalRules(q: Question): boolean {
    const cfg = q.config as Record<string, unknown> | null;
    if (!cfg?.["conditionalEnabled"]) return false;
    const rules = cfg?.["conditionalRules"];
    return Array.isArray(rules) && rules.length > 0;
  }

  // ── Within-section arrows ──────────────────────────────────────────────────
  for (const sec of sections) {
    const arrowColor = getContrastTextColor(sec.section.color ?? "#f5f5f5");
    for (let i = 0; i < sec.nodes.length - 1; i++) {
      const from = sec.nodes[i];
      const to = sec.nodes[i + 1];

      // Suppress default arrow when source has conditional rules —
      // conditional arrows already show where that question leads.
      if (hasConditionalRules(from.question)) continue;

      // next_target override: draw a gray solid line to the target instead of sequential arrow.
      const nt = from.question.next_target;
      if (!hasConditionalRules(from.question) && nt?.type === "question" && nt.targetId) {
        const tgtNode = nodeMap.get(nt.targetId);
        if (tgtNode) {
          // Skip the sequential arrow; add a defaultTarget arrow instead.
          const fromH = resolveNodeH(from.question.id);
          const tgtH = resolveNodeH(nt.targetId);
          const x1 = from.x + nodeW / 2;
          const y1 = direction === "vertical" ? from.y + fromH : from.y + fromH / 2;
          const x2 = tgtNode.x + nodeW / 2;
          const y2 = direction === "vertical" ? tgtNode.y : tgtNode.y + tgtH / 2;
          const midY = Math.max(y1 + 24, (y1 + y2) / 2);
          const d =
            direction === "vertical"
              ? `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`
              : `M ${from.x + nodeW} ${from.y + fromH / 2} L ${tgtNode.x} ${tgtNode.y + tgtH / 2}`;
          defaultTargetArrows.push({
            d,
            key: `dt-${from.question.id}`,
            fromId: from.question.id,
            toId: nt.targetId,
          });
          continue;
        }
      }

      if (direction === "vertical") {
        // Cubic Bezier S-curve: bottom-center → top-center
        const fromH = resolveNodeH(from.question.id);
        const x1 = from.x + nodeW / 2,
          y1 = from.y + fromH;
        const x2 = to.x + nodeW / 2,
          y2 = to.y;
        const dy = Math.max(30, (y2 - y1) * 0.45);
        defaultArrows.push({
          d: `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`,
          key: `w-${sec.section.id}-${i}`,
          color: arrowColor,
          fromId: from.question.id,
          toId: to.question.id,
        });
      } else if (from.y === to.y) {
        // Same row — straight line is shortest path
        const fromH = resolveNodeH(from.question.id);
        const toH = resolveNodeH(to.question.id);
        const x1 = from.x + nodeW,
          y1 = from.y + fromH / 2;
        const x2 = to.x,
          y2 = to.y + toH / 2;
        defaultArrows.push({
          d: `M ${x1} ${y1} L ${x2} ${y2}`,
          key: `w-${sec.section.id}-${i}`,
          color: arrowColor,
          fromId: from.question.id,
          toId: to.question.id,
        });
      } else {
        // Different row — straight line
        const fromH = resolveNodeH(from.question.id);
        const x1 = from.x + nodeW / 2,
          y1 = from.y + fromH;
        const x2 = to.x + nodeW / 2,
          y2 = to.y;
        defaultArrows.push({
          d: `M ${x1} ${y1} L ${x2} ${y2}`,
          key: `w-${sec.section.id}-${i}`,
          color: arrowColor,
          fromId: from.question.id,
          toId: to.question.id,
        });
      }
    }
  }

  // ── Between-section arrows ─────────────────────────────────────────────────
  for (let s = 0; s < sections.length - 1; s++) {
    const cur = sections[s];
    const nxt = sections[s + 1];
    if (!cur.nodes.length || !nxt.nodes.length) continue;
    const last = cur.nodes[cur.nodes.length - 1];
    const first = nxt.nodes[0];

    // Same suppression rule: if the section's last question has conditional rules,
    // hide the default between-section arrow (conditional arrows show its paths).
    if (hasConditionalRules(last.question)) continue;

    // next_target override on last node of a section → defaultTarget arrow to the specific node.
    const ntBetween = last.question.next_target;
    if (ntBetween?.type === "question" && ntBetween.targetId) {
      const tgtNode = nodeMap.get(ntBetween.targetId);
      if (tgtNode) {
        const lastH = resolveNodeH(last.question.id);
        const x1 = last.x + nodeW / 2;
        const y1 = last.y + lastH;
        const x2 = tgtNode.x + nodeW / 2;
        const y2 = tgtNode.y;
        const midY = Math.max(y1 + 24, (y1 + y2) / 2);
        defaultTargetArrows.push({
          d: `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`,
          key: `dt-b-${s}`,
          fromId: last.question.id,
          toId: ntBetween.targetId,
        });
        continue;
      }
    }

    if (direction === "vertical") {
      // Bottom-center of last → down → right through gap → up/down to mid-height → enter left side of first
      // Entering from left prevents the path from passing through the node body.
      const lastH = resolveNodeH(last.question.id);
      const firstH = resolveNodeH(first.question.id);
      const x1 = last.x + nodeW / 2;
      const y1 = last.y + lastH;
      const xEntry = first.x; // left edge of target node
      const yMid = first.y + firstH / 2; // mid-height of target
      const outY = y1 + 24;
      // midX sits in the section gap so the path stays clear of both sections' node columns
      const midX = (cur.x + cur.width + nxt.x) / 2;
      defaultArrows.push({
        d: `M ${x1} ${y1} L ${x1} ${outY} L ${midX} ${outY} L ${midX} ${yMid} L ${xEntry} ${yMid}`,
        key: `b-${s}`,
        fromId: last.question.id,
        toId: first.question.id,
      });
    } else {
      // Bottom-center → down through gap → enter left side of first node (ㄱㄴ routing)
      // Avoids a straight vertical line passing through the center of both nodes.
      const lastH = resolveNodeH(last.question.id);
      const firstH = resolveNodeH(first.question.id);
      const x1 = last.x + nodeW / 2;
      const y1 = last.y + lastH;
      const xEntry = first.x; // left edge of target node
      const yMid = first.y + firstH / 2; // mid-height of target
      // midY sits in the section gap
      const midY = Math.max(y1 + 8, (cur.y + cur.height + nxt.y) / 2);
      // Route: down → left to node's left edge → down to mid-height → right 8px into node
      const xApproach = Math.max(0, xEntry - 8);
      defaultArrows.push({
        d: `M ${x1} ${y1} L ${x1} ${midY} L ${xApproach} ${midY} L ${xApproach} ${yMid} L ${xEntry} ${yMid}`,
        key: `b-${s}`,
        fromId: last.question.id,
        toId: first.question.id,
      });
    }
  }

  // Helper: build grouped label string (outside loop to avoid TS1128)
  function groupedLabel(parts: string[]): string | undefined {
    if (parts.length === 0) return undefined;
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]}, ${parts[1]}`;
    return `${parts[0]}, ${parts[1]} +${parts.length - 2}`;
  }

  // Tracks condArrows grouped by source question ID — used for label overlap resolution below.
  const condArrowsBySrc = new Map<string, CondArrow[]>();

  // ── Conditional arrows ─────────────────────────────────────────────────────
  // Phase 1: collect raw entries per source question (no path computation yet)
  interface RawCondEntry {
    srcId: string;
    tgtId: string | null; // null = section target
    tgtSecId: string | null;
    label: string | undefined;
    isNextSeq: boolean;
  }
  const rawCondEntries: RawCondEntry[] = [];

  for (const q of questions) {
    const cfg = q.config as Record<string, unknown> | null;
    if (!cfg?.["conditionalEnabled"]) continue;
    const rules = cfg["conditionalRules"];
    if (!Array.isArray(rules)) continue;
    if (!nodeMap.get(q.id)) continue;

    const byTargetQ = new Map<string, string[]>();
    const sectionRules: RawConditionEntry[] = [];
    for (const rule of rules as RawConditionEntry[]) {
      if (rule.targetQuestionId) {
        const labelArr = byTargetQ.get(rule.targetQuestionId) ?? [];
        if (rule.answerValue) labelArr.push(rule.answerValue);
        byTargetQ.set(rule.targetQuestionId, labelArr);
      } else if (rule.targetSectionId) {
        sectionRules.push(rule);
      }
    }

    for (const [targetId, labelParts] of byTargetQ) {
      if (!nodeMap.get(targetId)) continue;
      rawCondEntries.push({
        srcId: q.id,
        tgtId: targetId,
        tgtSecId: null,
        label: groupedLabel(labelParts),
        isNextSeq: nextQuestionMap.get(q.id) === targetId,
      });
    }
    for (const rule of sectionRules) {
      if (!rule.targetSectionId) continue;
      rawCondEntries.push({
        srcId: q.id,
        tgtId: null,
        tgtSecId: rule.targetSectionId,
        label: rule.answerValue,
        isNextSeq: false,
      });
    }
  }

  // Phase 2: group by source, sort targets by order_index, assign slots
  // Slot 0  → horizontal straight line (isNextSeq OR first non-seq in horizontal)
  // Slot 1,3,5… → top arch (arcH = 44 + floor(slot/2)*24)
  // Slot 2,4,6… → bottom arch
  const entriesBySrc = new Map<string, RawCondEntry[]>();
  for (const e of rawCondEntries) {
    const arr = entriesBySrc.get(e.srcId) ?? [];
    arr.push(e);
    entriesBySrc.set(e.srcId, arr);
  }

  // Phase 3: compute paths per slot and push to condArrows

  // Build a fast lookup: question id → its SectionLayout
  const questionSectionMap = new Map<string, SectionLayout>();
  for (const sec of sections) {
    for (const node of sec.nodes) {
      questionSectionMap.set(node.question.id, sec);
    }
  }

  for (const [srcId, entries] of entriesBySrc) {
    const src = nodeMap.get(srcId)!;

    if (direction === "vertical") {
      // Vertical layout: slot-based right/left arch routing
      // Sort: isNextSeq first, then by target order_index ascending
      const sortedEntries = [...entries].sort((a, b) => {
        if (a.isNextSeq !== b.isNextSeq) return a.isNextSeq ? -1 : 1;
        const ai = sortedAll.findIndex((q) => q.id === a.tgtId);
        const bi = sortedAll.findIndex((q) => q.id === b.tgtId);
        return ai - bi;
      });

      let currentSlot = 0;
      for (const e of sortedEntries) {
        // Section-level targets: bottom-center → down → midX → mid-height → left side of first node
        if (!e.tgtId && e.tgtSecId) {
          const tgtSec = sections.find((s) => s.section.id === e.tgtSecId);
          if (!tgtSec?.nodes.length) continue;
          const first = tgtSec.nodes[0];
          // Find src section to compute gap midpoint
          const srcSec = sections.find((s) => s.nodes.some((n) => n.question.id === srcId));
          const srcH = resolveNodeH(srcId);
          const firstH = resolveNodeH(first.question.id);
          const x1 = src.x + nodeW / 2;
          const y1 = src.y + srcH;
          const xEntry = first.x; // enter left side of target
          const yMid = first.y + firstH / 2;
          const outY = y1 + 24;
          const midX = srcSec ? (srcSec.x + srcSec.width + tgtSec.x) / 2 : (x1 + xEntry) / 2;
          const secArrow: CondArrow = {
            d: `M ${x1} ${y1} L ${x1} ${outY} L ${midX} ${outY} L ${midX} ${yMid} L ${xEntry} ${yMid}`,
            key: `cs-${srcId}-${e.tgtSecId}`,
            label: e.label,
            mx: midX,
            my: (outY + yMid) / 2,
          };
          condArrows.push(secArrow);
          const g = condArrowsBySrc.get(srcId) ?? [];
          g.push(secArrow);
          condArrowsBySrc.set(srcId, g);
          continue;
        }

        if (!e.tgtId) continue;
        const tgt = nodeMap.get(e.tgtId);
        if (!tgt) continue;

        // Cross-section routing: route through the gap between sections
        {
          const srcSec = questionSectionMap.get(srcId);
          const tgtSec = questionSectionMap.get(e.tgtId);
          const isSameSection = srcSec && tgtSec && srcSec.section.id === tgtSec.section.id;

          if (!isSameSection && srcSec && tgtSec) {
            const goRight = tgtSec.x > srcSec.x;
            const gapMidX = goRight
              ? (srcSec.x + srcSec.width + tgtSec.x) / 2
              : (tgtSec.x + tgtSec.width + srcSec.x) / 2;

            const srcCrossH = resolveNodeH(srcId);
            const tgtCrossH = resolveNodeH(e.tgtId ?? "");
            const x1 = goRight ? src.x + nodeW : src.x;
            const y1 = src.y + srcCrossH / 2;
            const x2 = goRight ? tgt.x : tgt.x + nodeW;
            const y2 = tgt.y + tgtCrossH / 2;

            const slotOffset = currentSlot * 20;
            const routeY1 = y1 + slotOffset;
            const routeY2 = y2;

            const d = `M ${x1} ${y1} L ${gapMidX} ${routeY1} L ${gapMidX} ${routeY2} L ${x2} ${y2}`;
            const mx = gapMidX;
            const my = (routeY1 + routeY2) / 2;

            currentSlot++;
            const arrow: CondArrow = { d, key: `cq-${srcId}-${e.tgtId}`, label: e.label, mx, my };
            condArrows.push(arrow);
            const g = condArrowsBySrc.get(srcId) ?? [];
            g.push(arrow);
            condArrowsBySrc.set(srcId, g);
            continue;
          }
        }

        let d: string;
        let mx: number, my: number;

        // Non-sequential targets skip slot 0 (straight path) — it would pass through intermediate nodes
        if (!e.isNextSeq && currentSlot === 0) currentSlot = 1;

        if (currentSlot === 0) {
          // Slot 0 (sequential only): straight vertical line — bottom-center → top-center
          const srcH0 = resolveNodeH(srcId);
          const x1 = src.x + nodeW / 2,
            y1 = src.y + srcH0;
          const x2 = tgt.x + nodeW / 2,
            y2 = tgt.y;
          d = `M ${x1} ${y1} L ${x2} ${y2}`;
          mx = x1;
          my = (y1 + y2) / 2;
        } else if (currentSlot % 2 === 1) {
          // Odd slots: right arch
          const arcW = 44 + Math.floor(currentSlot / 2) * 24;
          const srcHOdd = resolveNodeH(srcId);
          const tgtHOdd = resolveNodeH(e.tgtId ?? "");
          const rx1 = src.x + nodeW,
            ry1 = src.y + srcHOdd / 2;
          const rx2 = tgt.x + nodeW,
            ry2 = tgt.y + tgtHOdd / 2;
          d = `M ${rx1} ${ry1} L ${rx1 + arcW} ${ry1} L ${rx1 + arcW} ${ry2} L ${rx2} ${ry2}`;
          mx = rx1 + arcW;
          my = (ry1 + ry2) / 2;
        } else {
          // Even slots (≥2): left arch
          const arcW = 44 + Math.floor(currentSlot / 2) * 24;
          const srcHEven = resolveNodeH(srcId);
          const tgtHEven = resolveNodeH(e.tgtId ?? "");
          const lx1 = src.x,
            ly1 = src.y + srcHEven / 2;
          const lx2 = tgt.x,
            ly2 = tgt.y + tgtHEven / 2;
          d = `M ${lx1} ${ly1} L ${lx1 - arcW} ${ly1} L ${lx1 - arcW} ${ly2} L ${lx2} ${ly2}`;
          mx = lx1 - arcW;
          my = (ly1 + ly2) / 2;
        }

        currentSlot++;
        const arrow: CondArrow = { d, key: `cq-${srcId}-${e.tgtId}`, label: e.label, mx, my };
        condArrows.push(arrow);
        const g = condArrowsBySrc.get(srcId) ?? [];
        g.push(arrow);
        condArrowsBySrc.set(srcId, g);
      }
    } else {
      // Horizontal layout: slot-based routing to prevent overlap

      // Sort: isNextSeq first, then by target order_index ascending
      const sorted = [...entries].sort((a, b) => {
        if (a.isNextSeq && !b.isNextSeq) return -1;
        if (!a.isNextSeq && b.isNextSeq) return 1;
        const oa = a.tgtId ? (nodeMap.get(a.tgtId)?.question.order_index ?? 0) : 9999;
        const ob = b.tgtId ? (nodeMap.get(b.tgtId)?.question.order_index ?? 0) : 9999;
        return oa - ob;
      });

      // isNextSeq entry occupies slot 0; remaining entries get slots 1, 2, 3, ...
      // If no isNextSeq, first entry still takes slot 0 (straight line).
      let slotIndex = 0;
      for (const e of sorted) {
        const currentSlot = slotIndex;
        slotIndex++;

        if (e.tgtSecId) {
          // Section-level conditional: top arch routing
          const tgtSec = sections.find((s) => s.section.id === e.tgtSecId);
          if (!tgtSec?.nodes.length) continue;
          const first = tgtSec.nodes[0];
          const x1 = src.x + nodeW / 2,
            y1 = src.y;
          const x2 = first.x + nodeW / 2,
            y2 = first.y;
          const arcH = Math.max(60, Math.abs(y2 - y1) * 0.5 + 40);
          const d = `M ${x1} ${y1} L ${x1} ${y1 - arcH} L ${x2} ${y2 - arcH} L ${x2} ${y2}`;
          const mx = (x1 + x2) / 2,
            my = y1 - arcH;
          const secArrow: CondArrow = {
            d,
            key: `cs-${srcId}-${e.tgtSecId}`,
            label: e.label,
            mx,
            my,
          };
          condArrows.push(secArrow);
          const g = condArrowsBySrc.get(srcId) ?? [];
          g.push(secArrow);
          condArrowsBySrc.set(srcId, g);
          continue;
        }

        if (!e.tgtId) continue;
        const tgt = nodeMap.get(e.tgtId)!;

        // Cross-section routing: route through the gap between sections
        {
          const srcSec = questionSectionMap.get(srcId);
          const tgtSec = questionSectionMap.get(e.tgtId);
          const isSameSection = srcSec && tgtSec && srcSec.section.id === tgtSec.section.id;

          if (!isSameSection && srcSec && tgtSec) {
            const goDown = tgtSec.y > srcSec.y;
            const gapMidY = goDown
              ? (srcSec.y + srcSec.height + tgtSec.y) / 2
              : (tgtSec.y + tgtSec.height + srcSec.y) / 2;

            const srcHCross = resolveNodeH(srcId);
            const tgtHCross = resolveNodeH(e.tgtId);
            const x1 = src.x + nodeW / 2;
            const y1 = goDown ? src.y + srcHCross : src.y;
            const x2 = tgt.x + nodeW / 2;
            const y2 = goDown ? tgt.y : tgt.y + tgtHCross;

            const slotOffset = currentSlot * 20;
            const routeX1 = x1 + slotOffset;

            const d = `M ${x1} ${y1} L ${routeX1} ${gapMidY} L ${x2} ${gapMidY} L ${x2} ${y2}`;
            const mx = (routeX1 + x2) / 2;
            const my = gapMidY;

            slotIndex++;
            const arrow: CondArrow = { d, key: `cq-${srcId}-${e.tgtId}`, label: e.label, mx, my };
            condArrows.push(arrow);
            const g = condArrowsBySrc.get(srcId) ?? [];
            g.push(arrow);
            condArrowsBySrc.set(srcId, g);
            continue;
          }
        }

        let d: string;
        let mx: number, my: number;

        if (currentSlot === 0) {
          // Slot 0: straight horizontal line — right-center → left-center
          const srcH0H = resolveNodeH(srcId);
          const tgtH0H = resolveNodeH(e.tgtId);
          const x1 = src.x + nodeW,
            y1 = src.y + srcH0H / 2;
          const x2 = tgt.x,
            y2 = tgt.y + tgtH0H / 2;
          d = `M ${x1} ${y1} L ${x2} ${y2}`;
          mx = (x1 + x2) / 2;
          my = (y1 + y2) / 2;
        } else if (currentSlot % 2 === 1) {
          // Odd slots: top arch
          const arcH = 44 + Math.floor(currentSlot / 2) * 24;
          const x1 = src.x + nodeW / 2,
            y1 = src.y;
          const x2 = tgt.x + nodeW / 2,
            y2 = tgt.y;
          d = `M ${x1} ${y1} L ${x1} ${y1 - arcH} L ${x2} ${y2 - arcH} L ${x2} ${y2}`;
          mx = (x1 + x2) / 2;
          my = y1 - arcH;
        } else {
          // Even slots (≥2): bottom arch
          const arcH = 44 + Math.floor(currentSlot / 2) * 24;
          const srcHEvenH = resolveNodeH(srcId);
          const tgtHEvenH = resolveNodeH(e.tgtId);
          const x1 = src.x + nodeW / 2,
            y1 = src.y + srcHEvenH;
          const x2 = tgt.x + nodeW / 2,
            y2 = tgt.y + tgtHEvenH;
          d = `M ${x1} ${y1} L ${x1} ${y1 + arcH} L ${x2} ${y2 + arcH} L ${x2} ${y2}`;
          mx = (x1 + x2) / 2;
          my = y1 + arcH;
        }

        const arrow: CondArrow = { d, key: `cq-${srcId}-${e.tgtId}`, label: e.label, mx, my };
        condArrows.push(arrow);
        const g = condArrowsBySrc.get(srcId) ?? [];
        g.push(arrow);
        condArrowsBySrc.set(srcId, g);
      }
    }
  }

  // ── Spread overlapping condition labels from the same source ─────────────────
  // When multiple condArrows from the same source have nearby mid-points,
  // their label badges (h=22) stack on top of each other. Push them apart vertically.
  for (const group of condArrowsBySrc.values()) {
    if (group.length < 2) continue;
    group.sort((a, b) => a.my - b.my);
    for (let i = 1; i < group.length; i++) {
      const minDist = 30; // badge height(22) + gap(8)
      if (group[i].my - group[i - 1].my < minDist) {
        group[i].my = group[i - 1].my + minDist;
      }
    }
  }

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}
      width={canvasWidth}
      height={canvasHeight}
    >
      <defs>
        <marker
          id="flow-arrow-default"
          markerWidth={FLOW_EDGE.default.markerSize}
          markerHeight={FLOW_EDGE.default.markerSize}
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,1 L7,4 L0,7 Z" fill={FLOW_EDGE.default.markerFill} />
        </marker>
        <marker
          id="flow-arrow-dark"
          markerWidth={FLOW_EDGE.default.markerSize}
          markerHeight={FLOW_EDGE.default.markerSize}
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,1 L7,4 L0,7 Z" fill={FLOW_EDGE.sectionDark.markerFill} />
        </marker>
        <marker
          id="flow-arrow-white"
          markerWidth={FLOW_EDGE.default.markerSize}
          markerHeight={FLOW_EDGE.default.markerSize}
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,1 L7,4 L0,7 Z" fill={FLOW_EDGE.sectionLight.markerFill} />
        </marker>
        <marker
          id="flow-arrow-cond"
          markerWidth={FLOW_EDGE.cond.markerSize}
          markerHeight={FLOW_EDGE.cond.markerSize}
          markerUnits="userSpaceOnUse"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,1 L7,4 L0,7 Z" fill={FLOW_EDGE.cond.markerFill} />
        </marker>
        <marker
          id="flow-arrow-active"
          markerWidth={FLOW_EDGE.active.markerSize}
          markerHeight={FLOW_EDGE.active.markerSize}
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,1 L7,4 L0,7 Z" fill={FLOW_EDGE.active.markerFill} />
        </marker>
        <marker
          id="flow-arrow-defaulttarget"
          markerWidth={FLOW_EDGE.defaultTarget.markerSize}
          markerHeight={FLOW_EDGE.defaultTarget.markerSize}
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,1 L7,4 L0,7 Z" fill={FLOW_EDGE.defaultTarget.markerFill} />
        </marker>
      </defs>

      {/* Default Target Arrows — next_target set, no conditional rules; gray solid line */}
      {defaultTargetArrows.map((a) => {
        const active =
          hoveredNodeId !== null && (a.fromId === hoveredNodeId || a.toId === hoveredNodeId);
        return (
          <path
            key={a.key}
            d={a.d}
            fill="none"
            stroke={active ? FLOW_EDGE.active.stroke : FLOW_EDGE.defaultTarget.stroke}
            strokeWidth={
              active ? FLOW_EDGE.active.strokeWidth : FLOW_EDGE.defaultTarget.strokeWidth
            }
            strokeLinecap="round"
            strokeDasharray={
              active ? FLOW_EDGE.active.strokeDasharray : FLOW_EDGE.defaultTarget.strokeDasharray
            }
            markerEnd={active ? "url(#flow-arrow-active)" : "url(#flow-arrow-defaulttarget)"}
          />
        );
      })}

      {defaultArrows.map((a) => {
        const active =
          hoveredNodeId !== null && (a.fromId === hoveredNodeId || a.toId === hoveredNodeId);
        const isWhite = a.color === "#ffffff";
        const stroke = active
          ? FLOW_EDGE.active.stroke
          : a.color
            ? isWhite
              ? FLOW_EDGE.sectionLight.stroke
              : FLOW_EDGE.sectionDark.stroke
            : FLOW_EDGE.default.stroke;
        const marker = active
          ? "url(#flow-arrow-active)"
          : a.color
            ? isWhite
              ? "url(#flow-arrow-white)"
              : "url(#flow-arrow-dark)"
            : "url(#flow-arrow-default)";
        return (
          <path
            key={a.key}
            d={a.d}
            fill="none"
            stroke={stroke}
            strokeWidth={active ? FLOW_EDGE.active.strokeWidth : FLOW_EDGE.default.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={
              active ? FLOW_EDGE.active.strokeDasharray : FLOW_EDGE.default.strokeDasharray
            }
            markerEnd={marker}
          />
        );
      })}

      {condArrows.map((a) => {
        const bw = estimateBadgeWidth(a.label);
        return (
          <g key={a.key}>
            <path
              d={a.d}
              fill="none"
              stroke={FLOW_EDGE.cond.stroke}
              strokeWidth={FLOW_EDGE.cond.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={FLOW_EDGE.cond.strokeDasharray}
              markerEnd="url(#flow-arrow-cond)"
            />
            {a.label && (
              <>
                <rect
                  x={a.mx - bw / 2}
                  y={a.my - FLOW_EDGE.badge.height / 2}
                  width={bw}
                  height={FLOW_EDGE.badge.height}
                  rx={FLOW_EDGE.badge.rx}
                  fill={FLOW_EDGE.badge.fill}
                  stroke={FLOW_EDGE.badge.stroke}
                  strokeWidth={1}
                />
                <text
                  x={a.mx}
                  y={a.my + FLOW_EDGE.badge.fontSize / 2 - 0.5}
                  textAnchor="middle"
                  fontSize={FLOW_EDGE.badge.fontSize}
                  fill={FLOW_EDGE.badge.textColor}
                  fontFamily="system-ui,-apple-system,sans-serif"
                  fontWeight="600"
                >
                  {a.label.length > 10 ? a.label.slice(0, 9) + "…" : a.label}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ─── Legacy layout (no sections) ─────────────────────────────────────────────

const LEG_W = 240;
const LEG_H = 107;
const LEG_V_GAP = 60;
const LEG_START_X = 60;
const LEG_START_Y = 60;
const LEG_BRANCH_X = 340;

interface LegacyNodePos {
  questionId: string;
  x: number;
  y: number;
}
interface LegacyArrow {
  fromId: string;
  toId: string;
  label?: string;
  isBranch: boolean;
}

function computeLegacyLayout(questions: Question[]): {
  positions: LegacyNodePos[];
  arrows: LegacyArrow[];
  canvasWidth: number;
  canvasHeight: number;
} {
  const sorted = [...questions].sort((a, b) => a.order_index - b.order_index);
  const branchTargets = new Set<string>();
  const condsBySource = new Map<string, RawConditionEntry[]>();

  for (const q of sorted) {
    const cfg = q.config as Record<string, unknown> | null;
    if (!cfg) continue;
    const rules = cfg["conditionalRules"];
    if (Array.isArray(rules)) {
      condsBySource.set(q.id, rules as RawConditionEntry[]);
      for (const r of rules as RawConditionEntry[]) {
        if (r.targetQuestionId) branchTargets.add(r.targetQuestionId);
      }
    }
  }

  const mainChain = sorted.filter((q) => !branchTargets.has(q.id));
  const branchList = sorted.filter((q) => branchTargets.has(q.id));
  const posMap = new Map<string, LegacyNodePos>();
  const positions: LegacyNodePos[] = [];

  mainChain.forEach((q, i) => {
    const pos = { questionId: q.id, x: LEG_START_X, y: LEG_START_Y + i * (LEG_H + LEG_V_GAP) };
    posMap.set(q.id, pos);
    positions.push(pos);
  });

  for (const q of branchList) {
    let srcY = LEG_START_Y;
    for (const [sid, rules] of condsBySource) {
      if ((rules as RawConditionEntry[]).find((r) => r.targetQuestionId === q.id)) {
        srcY = posMap.get(sid)?.y ?? LEG_START_Y;
        break;
      }
    }
    const pos = { questionId: q.id, x: LEG_START_X + LEG_BRANCH_X, y: srcY };
    posMap.set(q.id, pos);
    positions.push(pos);
  }

  const arrows: LegacyArrow[] = [];
  for (let i = 0; i < mainChain.length - 1; i++) {
    // Suppress default sequential arrow only when conditional toggle is ON
    // and rules exist — mirrors FlowArrows.hasConditionalRules() logic exactly.
    const src = mainChain[i];
    const cfg = src.config as Record<string, unknown> | null;
    if (cfg?.["conditionalEnabled"]) {
      const rules = cfg["conditionalRules"];
      if (Array.isArray(rules) && rules.length > 0) continue;
    }
    arrows.push({ fromId: src.id, toId: mainChain[i + 1].id, isBranch: false });
  }
  for (const [sid, rules] of condsBySource) {
    for (const r of rules as RawConditionEntry[]) {
      if (r.targetQuestionId) {
        arrows.push({
          fromId: sid,
          toId: r.targetQuestionId,
          label: r.answerValue,
          isBranch: true,
        });
      }
    }
  }

  const maxX = positions.length ? Math.max(...positions.map((p) => p.x + LEG_W)) : 600;
  const maxY = positions.length ? Math.max(...positions.map((p) => p.y + LEG_H)) : 600;
  return {
    positions,
    arrows,
    canvasWidth: Math.max(maxX + 100, 600),
    canvasHeight: Math.max(maxY + 100, 600),
  };
}

// ─── Legacy node card ─────────────────────────────────────────────────────────

const LegacyNode: FC<{
  question: Question;
  pos: LegacyNodePos;
  globalIndex: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
}> = ({ question, pos, globalIndex, isActive, onSelect, onHover }) => (
  <NodeCard
    question={question}
    x={pos.x}
    y={pos.y}
    globalIndex={globalIndex}
    isActive={isActive}
    onSelect={onSelect}
    onHover={onHover}
  />
);

// ─── Pan + Zoom canvas ────────────────────────────────────────────────────────

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.05;

const PanCanvas: FC<{
  canvasWidth: number;
  canvasHeight: number;
  children: React.ReactNode;
  onClearSelection?: () => void;
  onPanZoomChange?: (pan: { x: number; y: number }, zoom: number) => void;
  containerRefOut?: React.RefObject<HTMLDivElement | null>;
  hideViewToggle?: boolean;
  /** px covered by the floating left panel — used for centering fit */
  leftInset?: number;
  /** px covered by the floating right panel — used for centering fit */
  rightInset?: number;
}> = ({
  canvasWidth,
  canvasHeight,
  children,
  onClearSelection,
  onPanZoomChange,
  containerRefOut,
  hideViewToggle = false,
  leftInset = 0,
  rightInset = 0,
}) => {
  const [panOffset, setPanOffset] = useState({ x: 40, y: 40 });
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Refs hold latest inset values so the one-shot rAF closure always reads current props
  const leftInsetRef = useRef(leftInset);
  const rightInsetRef = useRef(rightInset);
  leftInsetRef.current = leftInset;
  rightInsetRef.current = rightInset;

  // Builder store — for the unified top-left control bar
  const view = useBuilderStore((s) => s.view);
  const setView = useBuilderStore((s) => s.setView);
  const flowDirection = useBuilderStore((s) => s.flowDirection);
  const setFlowDirection = useBuilderStore((s) => s.setFlowDirection);
  const flowCardMode = useBuilderStore((s) => s.flowCardMode);
  const setFlowCardMode = useBuilderStore((s) => s.setFlowCardMode);
  const secGap = useBuilderStore((s) => s.secGap);
  const setSecGap = useBuilderStore((s) => s.setSecGap);

  // All panning state lives in refs so event handlers never go stale.
  // Using refs here avoids the classic "stale closure" trap where useEffect
  // captures an outdated value of isPanning/lastX/lastY from the initial render.
  const isSpaceDown = useRef(false);
  const isPanning = useRef(false);
  const panLastX = useRef(0);
  const panLastY = useRef(0);
  // Tracks whether the pointer actually moved between mousedown and mouseup.
  // A zero-movement click on empty canvas triggers clearSelection; a drag does not.
  const hasMoved = useRef(false);
  // Keep onClearSelection in a ref so the document-level event handler (registered
  // once at mount) always calls the latest version without needing to re-register.
  const onClearSelectionRef = useRef(onClearSelection);
  onClearSelectionRef.current = onClearSelection;
  const onPanZoomChangeRef = useRef(onPanZoomChange);
  onPanZoomChangeRef.current = onPanZoomChange;
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync containerRef to caller when provided
  useEffect(() => {
    if (containerRefOut && "current" in containerRefOut) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (containerRefOut as any).current = containerRef.current;
    }
  });

  // Notify caller of pan/zoom changes
  useEffect(() => {
    onPanZoomChangeRef.current?.(panOffset, zoomLevel);
  }, [panOffset, zoomLevel]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "Space" && !e.repeat) {
        const active = document.activeElement as HTMLElement | null;
        if (
          active?.tagName === "INPUT" ||
          active?.tagName === "TEXTAREA" ||
          active?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        isSpaceDown.current = true;
        if (containerRef.current) containerRef.current.style.cursor = "grab";
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "Space") {
        isSpaceDown.current = false;
        if (containerRef.current && !isPanning.current) {
          containerRef.current.style.cursor = "default";
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    // rAF defers until after the browser has completed layout.
    // In the new floating-panel builder the canvas container is inside
    // `absolute inset-0` whose dimensions may not be resolved synchronously
    // on mount — getBoundingClientRect() would return 0, leaving zoom=1 and
    // panOffset={40,40}, which clips nodes near the right/bottom edge.
    let rafId: number;
    const tryFit = () => {
      const c = containerRef.current;
      if (!c) return;
      const { width: cw, height: ch } = c.getBoundingClientRect();
      if (!cw || !ch) {
        rafId = requestAnimationFrame(tryFit);
        return;
      }
      // Use refs so the rAF closure always sees the latest prop values
      const li = leftInsetRef.current;
      const ri = rightInsetRef.current;
      const effectiveCw = Math.max(120, cw - li - ri);
      const zoom = Math.min(
        ZOOM_MAX,
        Math.max(ZOOM_MIN, Math.min(effectiveCw / canvasWidth, ch / canvasHeight) * 0.85)
      );
      setPanOffset({
        x: li + (effectiveCw - canvasWidth * zoom) / 2,
        y: (ch - canvasHeight * zoom) / 2,
      });
      setZoomLevel(zoom);
    };
    rafId = requestAnimationFrame(tryFit);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fit whenever insets change (e.g. panel resize) so content stays centered
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const { width: cw, height: ch } = c.getBoundingClientRect();
    if (!cw || !ch) return;
    const li = leftInsetRef.current;
    const ri = rightInsetRef.current;
    const effectiveCw = Math.max(120, cw - li - ri);
    const zoom = Math.min(
      ZOOM_MAX,
      Math.max(ZOOM_MIN, Math.min(effectiveCw / canvasWidth, ch / canvasHeight) * 0.85)
    );
    setPanOffset({
      x: li + (effectiveCw - canvasWidth * zoom) / 2,
      y: (ch - canvasHeight * zoom) / 2,
    });
    setZoomLevel(zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftInset, rightInset]);

  const fitToScreen = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const { width: cw, height: ch } = c.getBoundingClientRect();
    const effectiveCw = Math.max(120, cw - leftInset - rightInset);
    const zoom = Math.min(
      ZOOM_MAX,
      Math.max(ZOOM_MIN, Math.min(effectiveCw / canvasWidth, ch / canvasHeight) * 0.85)
    );
    setPanOffset({
      x: leftInset + (effectiveCw - canvasWidth * zoom) / 2,
      y: (ch - canvasHeight * zoom) / 2,
    });
    setZoomLevel(zoom);
  }, [canvasWidth, canvasHeight, leftInset, rightInset]);

  const handleWheel = useCallback((e: globalThis.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const c = containerRef.current;
    if (!c) return;
    if (e.ctrlKey || e.metaKey) {
      const rect = c.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      setZoomLevel((prev) => {
        const next = Math.min(
          ZOOM_MAX,
          Math.max(ZOOM_MIN, prev + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP))
        );
        const scale = next / prev;
        setPanOffset((p) => ({ x: cx - (cx - p.x) * scale, y: cy - (cy - p.y) * scale }));
        return next;
      });
    } else {
      setPanOffset((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  }, []);

  // Attach wheel listener as non-passive so preventDefault() actually works.
  // React's synthetic onWheel is passive by default — it cannot prevent browser zoom.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Panning via native events. All three handlers (down/move/up) are registered once
  // at mount time on document, so there is no risk of losing the move/up events when
  // the cursor briefly leaves the container during a fast drag.
  //
  // Why document-level for all three (not just move/up)?
  // Registering mousedown on the container but move/up on document inside the handler
  // is the classic approach, but it fails on macOS Safari/Chrome when e.preventDefault()
  // is called on mousedown — the browser suppresses subsequent document mousemove events
  // in some configurations. Registering everything on document from the start avoids this.
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      // Middle mouse button — skip (let browser handle scroll)
      if (e.button !== 0) return;

      const container = containerRef.current;
      if (!container) return;

      // Only intercept events that originate inside our canvas container
      if (!container.contains(e.target as Node)) return;

      const isOnNode = !!(e.target as HTMLElement).closest("[data-flow-node]");

      // Reset movement tracker on every new press so we can distinguish
      // a stationary click (clearSelection) from a drag (pan).
      hasMoved.current = false;

      // Pan when:
      //   (a) Space is held — Figma-style "grab any area" panning, OR
      //   (b) click is on the empty canvas (not on a node card)
      const shouldPan = isSpaceDown.current || !isOnNode;
      if (!shouldPan) return;

      // Prevent text selection and default drag behaviour during pan
      e.preventDefault();

      isPanning.current = true;
      panLastX.current = e.clientX;
      panLastY.current = e.clientY;
      container.style.cursor = "grabbing";
    }

    function onMouseMove(e: MouseEvent) {
      if (!isPanning.current) return;

      hasMoved.current = true;

      const dx = e.clientX - panLastX.current;
      const dy = e.clientY - panLastY.current;
      panLastX.current = e.clientX;
      panLastY.current = e.clientY;

      // Functional update avoids stale closure — setPanOffset always reads latest state
      setPanOffset((p) => ({ x: p.x + dx, y: p.y + dy }));
    }

    function onMouseUp(e: MouseEvent) {
      const container = containerRef.current;

      // Stationary click on empty canvas — clear selection to enter IDLE state.
      // Conditions:
      //   - pointer did not move (no drag)
      //   - space is not held (not a pan-mode click)
      //   - click target is not a question node or section container
      if (
        container &&
        container.contains(e.target as Node) &&
        !hasMoved.current &&
        !isSpaceDown.current
      ) {
        const target = e.target as HTMLElement;
        const isOnFlowNode = !!target.closest("[data-flow-node]");
        const isOnSectionContainer = !!target.closest("[data-flow-section]");
        if (!isOnFlowNode && !isOnSectionContainer) {
          onClearSelectionRef.current?.();
        }
      }

      if (!isPanning.current) return;
      isPanning.current = false;
      if (container) {
        container.style.cursor = isSpaceDown.current ? "grab" : "default";
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="flow_view_canvas w-full h-full overflow-hidden relative"
      style={{
        cursor: "default",
        backgroundColor: FLOW_COLOR.canvas,
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Canvas */}
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        {children}
      </div>

      {/* ── 좌측 상단 — 목록 / 흐름 토글 — floating panel 모드에서는 하단 바로 대체 */}
      {!hideViewToggle && (
        <div
          className="absolute top-3 left-3 flex items-center rounded-2xl px-3 py-2 glass pointer-events-auto"
          style={{ boxShadow: SHADOW.AMBIENT, border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
        >
          <div
            className="flex items-center gap-[2px] rounded-[34px] p-[3px]"
            style={{ backgroundColor: COLOR.BG_SURFACE }}
          >
            {(["list", "flow"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="text-xs font-semibold px-3 py-1 rounded-[19px] transition-all"
                style={{
                  backgroundColor: view === v ? COLOR.BG_BASE : "transparent",
                  color: view === v ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
                  boxShadow: view === v ? "0 1px 4px rgba(25,28,30,0.06)" : undefined,
                }}
              >
                {v === "list" ? "목록" : "흐름"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 우측 상단 — 방향 · 간격 · 맞춤 · 줌 ──── */}
      <div
        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-2xl px-3 py-2 glass pointer-events-auto"
        style={{ boxShadow: SHADOW.AMBIENT, border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        {/* 방향 */}
        <div
          className="flex items-center gap-[2px] rounded-[34px] p-[3px]"
          style={{ backgroundColor: COLOR.BG_SURFACE }}
        >
          {(["vertical", "horizontal"] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => setFlowDirection(dir)}
              className="text-xs font-semibold px-3 py-1 rounded-[19px] transition-all"
              style={{
                backgroundColor: flowDirection === dir ? COLOR.BG_BASE : "transparent",
                color: flowDirection === dir ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
                boxShadow: flowDirection === dir ? "0 1px 4px rgba(25,28,30,0.06)" : undefined,
              }}
            >
              {dir === "vertical" ? "세로" : "가로"}
            </button>
          ))}
        </div>

        <div
          className="w-px h-4 shrink-0 self-center"
          style={{ backgroundColor: COLOR.BORDER_DEFAULT }}
        />

        {/* 카드 모드 */}
        <div
          className="flex items-center gap-[2px] rounded-[34px] p-[3px]"
          style={{ backgroundColor: COLOR.BG_SURFACE }}
          title="질문 카드를 실제 크기로 볼 수 있어요"
        >
          {(["compact", "expanded"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFlowCardMode(mode)}
              className="text-xs font-semibold px-3 py-1 rounded-[19px] transition-all"
              style={{
                backgroundColor: flowCardMode === mode ? COLOR.BG_BASE : "transparent",
                color: flowCardMode === mode ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
                boxShadow: flowCardMode === mode ? "0 1px 4px rgba(25,28,30,0.06)" : undefined,
              }}
            >
              {mode === "compact" ? "요약" : "확장"}
            </button>
          ))}
        </div>

        <div
          className="w-px h-4 shrink-0 self-center"
          style={{ backgroundColor: COLOR.BORDER_DEFAULT }}
        />

        {/* 간격 */}
        <div
          className="flex items-center gap-[2px] rounded-[34px] p-[3px]"
          style={{ backgroundColor: COLOR.BG_SURFACE }}
        >
          <button
            onClick={() => setSecGap((g: number) => Math.max(40, g - 20))}
            disabled={secGap <= 40}
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            style={{
              color: secGap <= 40 ? COLOR.TEXT_DISABLED : COLOR.TEXT_SECONDARY,
              cursor: secGap <= 40 ? "not-allowed" : "pointer",
              background: "transparent",
              border: "none",
            }}
          >
            −
          </button>
          <span
            className="text-xs font-semibold tabular-nums select-none"
            style={{ minWidth: 28, textAlign: "center", color: COLOR.TEXT_PRIMARY }}
          >
            {secGap}
          </span>
          <button
            onClick={() => setSecGap((g: number) => Math.min(300, g + 20))}
            disabled={secGap >= 300}
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            style={{
              color: secGap >= 300 ? COLOR.TEXT_DISABLED : COLOR.TEXT_SECONDARY,
              cursor: secGap >= 300 ? "not-allowed" : "pointer",
              background: "transparent",
              border: "none",
            }}
          >
            +
          </button>
        </div>

        <div
          className="w-px h-4 shrink-0 self-center"
          style={{ backgroundColor: COLOR.BORDER_DEFAULT }}
        />

        {/* 맞춤 + 줌 */}
        <div
          className="flex items-center gap-[2px] rounded-[34px] p-[3px]"
          style={{ backgroundColor: COLOR.BG_SURFACE }}
        >
          <button
            onClick={fitToScreen}
            className="text-xs font-semibold px-2.5 py-1 rounded-[19px] transition-all"
            style={{ color: COLOR.TEXT_SECONDARY }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLOR.BG_BASE;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            맞춤
          </button>
          <div className="w-px h-4 shrink-0" style={{ backgroundColor: FLOW_COLOR.border }} />
          <button
            onClick={() => setZoomLevel((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
            className="w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold transition-all"
            style={{ color: COLOR.TEXT_MUTED }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLOR.BG_BASE;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            −
          </button>
          <span
            className="w-11 text-center text-xs font-semibold select-none tabular-nums"
            style={{ color: COLOR.TEXT_PRIMARY }}
          >
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
            className="w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold transition-all"
            style={{ color: COLOR.TEXT_MUTED }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLOR.BG_BASE;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main FlowView ────────────────────────────────────────────────────────────

export const FlowView: FC<{ leftInset?: number; rightInset?: number }> = ({
  leftInset = 0,
  rightInset = 0,
}) => {
  const questions = useBuilderStore((s) => s.questions);
  const sections = useBuilderStore((s) => s.sections);
  const activeQuestionId = useBuilderStore((s) => s.activeQuestionId);
  const activeSectionId = useBuilderStore((s) => s.activeSectionId);
  const setActiveQuestion = useBuilderStore((s) => s.setActiveQuestion);
  const setActiveSection = useBuilderStore((s) => s.setActiveSection);
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const surveyId = useBuilderStore((s) => s.surveyId);
  const addQuestionOptimistic = useBuilderStore((s) => s.addQuestionOptimistic);
  const insertQuestionAfter = useBuilderStore((s) => s.insertQuestionAfter);
  const confirmQuestion = useBuilderStore((s) => s.confirmQuestion);
  const flowDirection = useBuilderStore((s) => s.flowDirection);
  const flowCardMode = useBuilderStore((s) => s.flowCardMode);
  const secGap = useBuilderStore((s) => s.secGap);
  const showToast = useToastStore((s) => s.showToast);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  // 줌 아웃해도 섹션 레이블이 읽히도록 — PanCanvas에서 zoom 값 수신
  const [canvasZoom, setCanvasZoom] = useState(1.0);
  // ResizeObserver — expanded 카드 높이 측정
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});
  const handleMeasure = useCallback((id: string, height: number) => {
    setMeasuredHeights((prev) => {
      if (prev[id] === height) return prev;
      return { ...prev, [id]: height };
    });
  }, []);

  // ── Add-question handler ─────────────────────────────────────────────────────
  async function handleAddQuestion(afterId: string, mode: "after" | "end") {
    if (!surveyId) return;
    const afterQ = questions.find((q) => q.id === afterId);
    if (!afterQ?.section_id) return;

    const tempId = `temp-${Date.now()}`;
    const maxOrder = questions.length > 0 ? Math.max(...questions.map((q) => q.order_index)) : 0;
    const tempOrderIndex = mode === "after" ? afterQ.order_index + 0.5 : maxOrder + 1;

    const tempQ: Question = {
      id: tempId,
      survey_id: surveyId,
      section_id: afterQ.section_id,
      type: "multiple_choice",
      title: "",
      options: null,
      order_index: tempOrderIndex,
      required: false,
      config: null,
      created_at: new Date().toISOString(),
    };

    if (mode === "after") {
      insertQuestionAfter(afterId, tempQ);
    } else {
      addQuestionOptimistic(tempId, tempQ);
    }
    setActiveQuestion(tempId);

    try {
      const body: Record<string, unknown> = {
        type: "multiple_choice",
        title: "",
        section_id: afterQ.section_id,
      };
      if (mode === "after") {
        body.insert_after_id = afterId;
      }

      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const real = (await res.json()) as Question;
        confirmQuestion(tempId, real);
        setActiveQuestion(real.id);
      }
    } catch {
      // optimistic stays
    }
  }

  async function handleAddFirstQuestion(sectionId: string) {
    if (!surveyId || !sectionId) return;
    const tempId = `temp-${Date.now()}`;
    const tempQ: Question = {
      id: tempId,
      survey_id: surveyId,
      section_id: sectionId,
      type: "multiple_choice",
      title: "",
      options: null,
      order_index: 0,
      required: false,
      config: null,
      created_at: new Date().toISOString(),
    };
    addQuestionOptimistic(tempId, tempQ);
    setActiveQuestion(tempId);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "multiple_choice", title: "", section_id: sectionId }),
      });
      if (res.ok) {
        const real = (await res.json()) as Question;
        confirmQuestion(tempId, real);
        setActiveQuestion(real.id);
      }
    } catch {
      // optimistic stays
    }
  }

  function handleSectionSelect(sectionId: string) {
    setActiveSection(sectionId);
    setActiveQuestion(null); // clear question focus so right panel shows SectionSettings
  }

  if (questions.length === 0) {
    return (
      <div
        className="flow_view_empty w-full h-full flex items-center justify-center"
        style={{
          backgroundColor: FLOW_COLOR.canvas,
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <button
          aria-label="첫 번째 질문 추가하기"
          onClick={() => handleAddFirstQuestion(sections[0]?.id ?? "")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "24px 32px",
            backgroundColor: COLOR.BG_BASE,
            border: `1.5px dashed ${COLOR.BORDER_DEFAULT}`,
            borderRadius: RADIUS.LG,
            cursor: "pointer",
            color: COLOR.TEXT_MUTED,
            boxShadow: SHADOW.CARD,
            transition: "border-color 120ms, box-shadow 120ms",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = COLOR.ACCENT;
            (e.currentTarget as HTMLButtonElement).style.color = COLOR.ACCENT;
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = COLOR.BORDER_DEFAULT;
            (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_MUTED;
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 500 }}>첫 번째 질문을 추가해요</span>
        </button>
      </div>
    );
  }

  // Separate pinned nodes (section_id = null, type startpoint/endpoint) from regular questions
  const startpointQ =
    questions.find((q) => q.type === "startpoint" && q.section_id == null) ?? null;
  const endpointQ = questions.find((q) => q.type === "endpoint" && q.section_id == null) ?? null;
  // Regular questions only — used by layout functions and DnD
  const regularQuestions = questions.filter(
    (q) =>
      !(q.type === "startpoint" && q.section_id == null) &&
      !(q.type === "endpoint" && q.section_id == null)
  );

  const sortedAll = [...regularQuestions].sort((a, b) => a.order_index - b.order_index);
  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);

  // Section-scoped numbering — matches QuestionList left sidebar (resets per section)
  const questionIndexMap = new Map<string, number>();
  if (sortedSections.length > 0) {
    sortedSections.forEach((section) => {
      sortedAll
        .filter((q) => q.section_id === section.id)
        .forEach((q, i) => questionIndexMap.set(q.id, i));
    });
  } else {
    sortedAll.forEach((q, i) => questionIndexMap.set(q.id, i));
  }

  if (sections.length > 0) {
    const activeNodeW = flowCardMode === "expanded" ? EXPANDED_CARD_W : NODE_W;
    const {
      sections: sectionLayouts,
      canvasWidth: baseCanvasWidth,
      canvasHeight: baseCanvasHeight,
    } = flowDirection === "vertical"
      ? computeVerticalFlowLayout(sections, regularQuestions, secGap, activeNodeW, measuredHeights)
      : computeFlowLayout(sections, regularQuestions, secGap, activeNodeW, measuredHeights);

    // ── Pinned node positions ─────────────────────────────────────────────────
    // Pinned nodes sit outside section containers, connected by a simple line.
    // horizontal: startpoint left of first section, endpoint right of last section
    // vertical: startpoint left column, endpoint right column
    const PINNED_GAP = 48; // gap between pinned node and adjacent section

    let startpointPos: { x: number; y: number } | null = null;
    let endpointPos: { x: number; y: number } | null = null;
    let canvasWidth = baseCanvasWidth;
    let canvasHeight = baseCanvasHeight;

    if (flowDirection === "vertical") {
      // vertical layout: sections expand rightward — startpoint is the leftmost column
      // endpoint is the rightmost column
      const firstSec = sectionLayouts[0];
      const lastSec = sectionLayouts[sectionLayouts.length - 1];
      const midY = CANVAS_MARGIN_TOP + (firstSec?.height ?? 120) / 2 - PINNED_NODE_H / 2;

      if (startpointQ && firstSec) {
        startpointPos = {
          x: firstSec.x - PINNED_GAP - PINNED_NODE_W,
          y: midY,
        };
        // Expand canvas left if needed — shift all sections right instead via extra margin
        canvasWidth = Math.max(baseCanvasWidth + PINNED_GAP + PINNED_NODE_W, baseCanvasWidth);
      }
      if (endpointQ && lastSec) {
        endpointPos = {
          x: lastSec.x + lastSec.width + PINNED_GAP,
          y: midY,
        };
        canvasWidth = Math.max(endpointPos.x + PINNED_NODE_W + 60, canvasWidth);
      }
    } else {
      // horizontal layout: sections stack vertically — startpoint above, endpoint below
      const firstSec = sectionLayouts[0];
      const lastSec = sectionLayouts[sectionLayouts.length - 1];
      const midX = CANVAS_MARGIN_X + PINNED_NODE_W / 2 - PINNED_NODE_W / 2;

      if (startpointQ && firstSec) {
        startpointPos = {
          x: midX,
          y: firstSec.y - PINNED_GAP - PINNED_NODE_H,
        };
        canvasHeight = Math.max(baseCanvasHeight, baseCanvasHeight);
      }
      if (endpointQ && lastSec) {
        endpointPos = {
          x: midX,
          y: lastSec.y + lastSec.height + PINNED_GAP,
        };
        canvasHeight = Math.max(endpointPos.y + PINNED_NODE_H + 60, baseCanvasHeight);
      }
    }

    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <PanCanvas
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          onClearSelection={clearSelection}
          onPanZoomChange={(_, zoom) => setCanvasZoom(zoom)}
          hideViewToggle
          leftInset={leftInset}
          rightInset={rightInset}
        >
          {/* Pinned node connector lines — drawn under nodes */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "visible",
              pointerEvents: "none",
            }}
            width={canvasWidth}
            height={canvasHeight}
          >
            {startpointPos &&
              sectionLayouts[0]?.nodes[0] &&
              (() => {
                const first = sectionLayouts[0].nodes[0];
                const firstH =
                  flowCardMode === "expanded"
                    ? (measuredHeights[first.question.id] ?? EXPANDED_CARD_MIN_H)
                    : NODE_H;
                if (flowDirection === "vertical") {
                  const x1 = startpointPos.x + PINNED_NODE_W;
                  const y1 = startpointPos.y + PINNED_NODE_H / 2;
                  const x2 = first.x;
                  const y2 = first.y + firstH / 2;
                  return (
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2}`}
                      fill="none"
                      stroke={FLOW_EDGE.default.stroke}
                      strokeWidth={FLOW_EDGE.default.strokeWidth}
                      strokeDasharray={FLOW_EDGE.default.strokeDasharray}
                    />
                  );
                } else {
                  const x1 = startpointPos.x + PINNED_NODE_W / 2;
                  const y1 = startpointPos.y + PINNED_NODE_H;
                  const x2 = first.x + activeNodeW / 2;
                  const y2 = first.y;
                  return (
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2}`}
                      fill="none"
                      stroke={FLOW_EDGE.default.stroke}
                      strokeWidth={FLOW_EDGE.default.strokeWidth}
                      strokeDasharray={FLOW_EDGE.default.strokeDasharray}
                    />
                  );
                }
              })()}
            {endpointPos &&
              (() => {
                const lastSec = sectionLayouts[sectionLayouts.length - 1];
                const last = lastSec?.nodes[lastSec.nodes.length - 1];
                if (!last) return null;
                const lastH =
                  flowCardMode === "expanded"
                    ? (measuredHeights[last.question.id] ?? EXPANDED_CARD_MIN_H)
                    : NODE_H;
                if (flowDirection === "vertical") {
                  const x1 = last.x + activeNodeW;
                  const y1 = last.y + lastH / 2;
                  const x2 = endpointPos.x;
                  const y2 = endpointPos.y + PINNED_NODE_H / 2;
                  return (
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2}`}
                      fill="none"
                      stroke={FLOW_EDGE.default.stroke}
                      strokeWidth={FLOW_EDGE.default.strokeWidth}
                      strokeDasharray={FLOW_EDGE.default.strokeDasharray}
                    />
                  );
                } else {
                  const x1 = last.x + activeNodeW / 2;
                  const y1 = last.y + lastH;
                  const x2 = endpointPos.x + PINNED_NODE_W / 2;
                  const y2 = endpointPos.y;
                  return (
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2}`}
                      fill="none"
                      stroke={FLOW_EDGE.default.stroke}
                      strokeWidth={FLOW_EDGE.default.strokeWidth}
                      strokeDasharray={FLOW_EDGE.default.strokeDasharray}
                    />
                  );
                }
              })()}
          </svg>

          {sectionLayouts.map((layout, idx) => (
            <SectionContainer
              key={layout.section.id}
              layout={layout}
              sectionNumber={idx + 1}
              isActive={activeSectionId === layout.section.id && activeQuestionId === null}
              onSelect={handleSectionSelect}
              zoomLevel={canvasZoom}
              cardMode={flowCardMode}
            />
          ))}
          {sectionLayouts.flatMap((layout) =>
            layout.nodes.map((nodePos) =>
              flowCardMode === "expanded" ? (
                <ExpandedQuestionNode
                  key={nodePos.question.id}
                  nodePos={nodePos}
                  globalIndex={questionIndexMap.get(nodePos.question.id) ?? 0}
                  isActive={activeQuestionId === nodePos.question.id}
                  surveyId={surveyId ?? ""}
                  onSelect={setActiveQuestion}
                  onMeasure={handleMeasure}
                  onHover={setHoveredNodeId}
                  onLeave={() => setHoveredNodeId(null)}
                />
              ) : (
                <QuestionNode
                  key={nodePos.question.id}
                  nodePos={nodePos}
                  globalIndex={questionIndexMap.get(nodePos.question.id) ?? 0}
                  isActive={activeQuestionId === nodePos.question.id}
                  onSelect={setActiveQuestion}
                  onHover={setHoveredNodeId}
                  onAddQuestion={handleAddQuestion}
                  onGenerateWithAI={() => showToast("AI 생성 기능을 준비하고 있어요.")}
                />
              )
            )
          )}

          {/* Pinned nodes — rendered above section nodes */}
          {startpointQ && startpointPos && (
            <PinnedFlowNode
              kind="startpoint"
              question={startpointQ}
              x={startpointPos.x}
              y={startpointPos.y}
              isActive={activeQuestionId === startpointQ.id}
              onSelect={setActiveQuestion}
              onHover={setHoveredNodeId}
            />
          )}
          {endpointQ && endpointPos && (
            <PinnedFlowNode
              kind="endpoint"
              question={endpointQ}
              x={endpointPos.x}
              y={endpointPos.y}
              isActive={activeQuestionId === endpointQ.id}
              onSelect={setActiveQuestion}
              onHover={setHoveredNodeId}
            />
          )}

          <FlowArrows
            sections={sectionLayouts}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            questions={regularQuestions}
            direction={flowDirection}
            hoveredNodeId={hoveredNodeId}
            nodeW={activeNodeW}
            nodeH={flowCardMode === "expanded" ? EXPANDED_CARD_MIN_H : NODE_H}
            measuredHeights={measuredHeights}
          />
        </PanCanvas>
      </div>
    );
  }

  const { positions, arrows, canvasWidth, canvasHeight } = computeLegacyLayout(questions);
  const posMap = new Map(positions.map((p) => [p.questionId, p]));
  const qMap = new Map(questions.map((q) => [q.id, q]));

  return (
    <PanCanvas
      canvasWidth={canvasWidth}
      canvasHeight={canvasHeight}
      onClearSelection={clearSelection}
      hideViewToggle
      leftInset={leftInset}
      rightInset={rightInset}
    >
      <svg
        style={
          {
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "visible",
            pointerEvents: "none",
          } as CSSProperties
        }
        width={canvasWidth}
        height={canvasHeight}
      >
        <defs>
          <marker id="leg-def" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,1.5 L0,6.5 L7,4 z" fill={FLOW_COLOR.border} />
          </marker>
          <marker id="leg-cond" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,1.5 L0,6.5 L7,4 z" fill={COLOR.ACCENT} />
          </marker>
        </defs>
        {arrows.map((arrow, idx) => {
          const fp = posMap.get(arrow.fromId);
          const tp = posMap.get(arrow.toId);
          if (!fp || !tp) return null;
          const lx = arrow.isBranch ? (fp.x + LEG_W + tp.x) / 2 : fp.x + LEG_W / 2;
          const ly = arrow.isBranch ? fp.y + LEG_H / 2 : (fp.y + LEG_H + tp.y) / 2;
          let d: string;
          if (arrow.isBranch) {
            const cp = Math.abs(tp.x - fp.x - LEG_W) * 0.5;
            d = `M ${fp.x + LEG_W} ${fp.y + LEG_H / 2} C ${fp.x + LEG_W + cp} ${fp.y + LEG_H / 2}, ${tp.x - cp} ${tp.y + LEG_H / 2}, ${tp.x} ${tp.y + LEG_H / 2}`;
          } else {
            const co = Math.max(40, Math.abs(tp.y - fp.y - LEG_H) * 0.4);
            d = `M ${fp.x + LEG_W / 2} ${fp.y + LEG_H} C ${fp.x + LEG_W / 2} ${fp.y + LEG_H + co}, ${tp.x + LEG_W / 2} ${tp.y - co}, ${tp.x + LEG_W / 2} ${tp.y}`;
          }
          return (
            <g key={`arr-${idx}`}>
              <path
                d={d}
                fill="none"
                stroke={arrow.isBranch ? COLOR.ACCENT : FLOW_COLOR.border}
                strokeWidth={1.5}
                strokeDasharray={arrow.isBranch ? "5,3" : undefined}
                markerEnd={arrow.isBranch ? "url(#leg-cond)" : "url(#leg-def)"}
              />
              {arrow.label && (
                <>
                  <rect
                    x={lx - 30}
                    y={ly - 11}
                    width={60}
                    height={22}
                    rx={6}
                    fill={COLOR.BG_BASE}
                    stroke={COLOR.ACCENT}
                    strokeWidth={1}
                  />
                  <text
                    x={lx}
                    y={ly + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fill={COLOR.ACCENT}
                    fontFamily="system-ui,sans-serif"
                    fontWeight="500"
                  >
                    {arrow.label.length > 9 ? arrow.label.slice(0, 8) + "…" : arrow.label}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      {positions.map((pos) => {
        const q = qMap.get(pos.questionId);
        if (!q) return null;
        return (
          <LegacyNode
            key={q.id}
            question={q}
            pos={pos}
            globalIndex={questionIndexMap.get(q.id) ?? 0}
            isActive={activeQuestionId === q.id}
            onSelect={setActiveQuestion}
            onHover={setHoveredNodeId}
          />
        );
      })}
    </PanCanvas>
  );
};
