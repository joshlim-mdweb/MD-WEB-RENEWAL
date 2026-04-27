"use client";

import { useRef, useState } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { Section } from "@/lib/types/survey";
import { COLOR } from "@/lib/design-tokens";

export function SectionSettings() {
  const { surveyId, sections, questions, activeSectionId, updateSection } = useBuilderStore();

  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  const activeSection = sortedSections.find((s) => s.id === activeSectionId) ?? null;
  const sectionIndex = activeSection ? sortedSections.indexOf(activeSection) : 0;

  const questionCount = questions.filter((q) => q.section_id === activeSectionId).length;

  if (!activeSection || !surveyId) return <div className="flex-1 h-full" />;

  return (
    <SectionSettingsForm
      key={activeSection.id}
      section={activeSection}
      sectionIndex={sectionIndex}
      questionCount={questionCount}
      surveyId={surveyId}
      onUpdate={(patch) => updateSection(activeSection.id, patch)}
    />
  );
}

function SectionSettingsForm({
  section,
  sectionIndex,
  questionCount,
  surveyId,
  onUpdate,
}: {
  section: Section;
  sectionIndex: number;
  questionCount: number;
  surveyId: string;
  onUpdate: (patch: Partial<Pick<Section, "description">>) => void;
}) {
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

  return (
    <div className="section_settings_area flex-1 flex flex-col overflow-y-auto">
      <div className="py-8 px-6 max-w-[500px] w-full">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold mb-1 select-none" style={{ color: COLOR.TEXT_MUTED }}>
            Section {sectionIndex + 1}
          </p>
          <p className="text-xs" style={{ color: COLOR.TEXT_DISABLED }}>
            질문 {questionCount}개
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-xs font-medium mb-2" style={{ color: COLOR.TEXT_MUTED }}>
            섹션 설명
          </p>
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
            rows={3}
            className="w-full rounded-lg px-3 py-2 text-sm resize-none placeholder-[#c4cbd4]"
            style={{
              outline: "none",
              border: `1px solid ${COLOR.BORDER_INPUT}`,
              color: COLOR.TEXT_PRIMARY,
              background: COLOR.BG_INPUT,
            }}
            onFocus={(e) => (e.target.style.borderColor = COLOR.BORDER_FOCUS)}
            onBlurCapture={(e) => (e.target.style.borderColor = COLOR.BORDER_INPUT)}
          />
        </div>
      </div>
    </div>
  );
}
