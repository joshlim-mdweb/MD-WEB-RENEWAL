"use client";

import { useRef, useState } from "react";
import { Section } from "@/lib/types/survey";
import { COLOR } from "@/lib/design-tokens";

interface SectionHeaderProps {
  section: Section;
  sectionIndex: number; // 0-based, displayed as "Section N+1"
  surveyId: string;
  onUpdate: (patch: Partial<Pick<Section, "description">>) => void;
}

export function SectionHeader({ section, sectionIndex, surveyId, onUpdate }: SectionHeaderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [description, setDescription] = useState(section.description ?? "");
  const descRef = useRef<HTMLTextAreaElement>(null);

  async function saveField(value: string) {
    onUpdate({ description: value });
    await fetch(`/api/surveys/${surveyId}/sections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: value }),
    });
  }

  function handleDescriptionBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    if (val !== (section.description ?? "")) {
      saveField(val);
    }
  }

  function handleContainerBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
    }
  }

  function handleContainerClick() {
    if (!isFocused) {
      setIsFocused(true);
      setTimeout(() => descRef.current?.focus(), 0);
    }
  }

  return (
    <div
      className="section_header_wrap relative z-10 w-full rounded-xl cursor-pointer transition-all overflow-hidden"
      style={{
        backgroundColor: COLOR.BG_SECTION,
        border: `1px solid ${isFocused ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
        // Left accent bar via box-shadow inset — avoids border-left affecting layout
        boxShadow: isFocused
          ? `inset 3px 0 0 ${COLOR.ACCENT}, 0 0 0 2px ${COLOR.ACCENT}22`
          : `inset 3px 0 0 ${COLOR.BORDER_STRONG}`,
      }}
      onClick={handleContainerClick}
      onBlur={handleContainerBlur}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
    >
      <div className="px-5 py-4">
        {/* Section badge */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold select-none"
            style={{
              backgroundColor: COLOR.ACCENT_BG,
              color: COLOR.ACCENT,
              letterSpacing: "0.04em",
            }}
          >
            SECTION {sectionIndex + 1}
          </span>
        </div>

        {/* Description */}
        {isFocused ? (
          <textarea
            ref={descRef}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onBlur={handleDescriptionBlur}
            placeholder="섹션 설명을 입력하세요 (선택)"
            rows={1}
            className="w-full bg-transparent resize-none overflow-hidden text-sm leading-relaxed placeholder-[#c4cbd4]"
            style={{
              outline: "none",
              border: "none",
              color: COLOR.TEXT_PRIMARY,
              minHeight: "20px",
            }}
          />
        ) : (
          <p
            className="text-sm leading-relaxed"
            style={{
              color: description ? COLOR.TEXT_SECONDARY : COLOR.TEXT_DISABLED,
              minHeight: "20px",
            }}
          >
            {description || "섹션 설명을 입력하세요 (선택)"}
          </p>
        )}
      </div>
    </div>
  );
}
