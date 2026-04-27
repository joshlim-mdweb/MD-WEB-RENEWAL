"use client";

import { useEffect, useRef, type FC } from "react";
import { type QuestionType } from "@/lib/types/survey";
import { COLOR, QUESTION_TYPE_COLOR } from "@/lib/design-tokens";
import { QuestionTypeIcon } from "./QuestionTypeIcon";
import { QUESTION_TYPE_LABELS, QUESTION_TYPES } from "./constants";

interface QuestionTypePickerProps {
  onSelect: (type: QuestionType) => void;
  onClose: () => void;
}

export const QuestionTypePicker: FC<QuestionTypePickerProps> = ({ onSelect, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Use capture so the click fires before anything else
    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="question_type_picker_wrap absolute bottom-full left-0 mb-2 z-50 rounded-xl p-2"
      style={{
        backgroundColor: COLOR.BG_BASE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
        width: 252,
      }}
    >
      <p className="text-xs font-semibold px-1 pb-2" style={{ color: COLOR.TEXT_MUTED }}>
        질문 유형 선택
      </p>
      <div className="grid grid-cols-3 gap-1">
        {QUESTION_TYPES.map((type) => {
          const iconColor = QUESTION_TYPE_COLOR[type];
          return (
            <button
              key={type}
              onClick={() => {
                onSelect(type);
                onClose();
              }}
              className="question_type_picker_cell flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg transition-colors text-center"
              style={{ color: COLOR.TEXT_SECONDARY }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.BG_SURFACE;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{ backgroundColor: COLOR.ACCENT_BG }}
              >
                <QuestionTypeIcon type={type} color={iconColor} size={16} />
              </span>
              <span
                className="text-[10px] leading-tight font-medium"
                style={{ color: COLOR.TEXT_SECONDARY }}
              >
                {QUESTION_TYPE_LABELS[type]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
