"use client";

import { useBuilderStore } from "@/lib/store/builder";
import { Question, DropdownConfig } from "@/lib/types/survey";
import { COLOR, TYPOGRAPHY, SECTION_LABEL_STYLE } from "@/lib/design-tokens";
import { Toggle } from "../QuestionSettings";
import { OptionsEditor } from "./OptionsEditor";

interface Props {
  question: Question;
  surveyId: string;
}

export function DropdownEditor({ question, surveyId }: Props) {
  const { updateQuestionOptions, updateQuestionConfig, setIsSaving, responseCount } =
    useBuilderStore();
  const optionsLocked = responseCount > 0;

  const config = (question.config as DropdownConfig) ?? {
    allowMultiple: false,
    randomOrder: false,
  };

  async function saveOptions(options: string[]) {
    updateQuestionOptions(question.id, options);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ options }),
      });
      if (!res.ok) {
        window.dispatchEvent(
          new CustomEvent("survey-save-error", { detail: "저장에 실패했습니다." })
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleConfig(key: keyof DropdownConfig) {
    const next = { ...config, [key]: !config[key] };
    updateQuestionConfig(question.id, next);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: next }),
      });
      if (!res.ok) {
        window.dispatchEvent(
          new CustomEvent("survey-save-error", { detail: "저장에 실패했습니다." })
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="dropdown_editor_wrap space-y-5">
      <OptionsEditor
        options={question.options ?? []}
        onChange={saveOptions}
        placeholder="보기"
        locked={optionsLocked}
      />

      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          설정
        </p>
        <div className="rounded px-3 py-3 space-y-3" style={{ backgroundColor: COLOR.BG_SURFACE }}>
          <div className="flex items-center justify-between">
            <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_PRIMARY }}>다중 선택</span>
            <Toggle isOn={config.allowMultiple} onToggle={() => toggleConfig("allowMultiple")} />
          </div>
          <div className="flex items-center justify-between">
            <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_PRIMARY }}>
              보기 무작위 배치
            </span>
            <Toggle isOn={config.randomOrder} onToggle={() => toggleConfig("randomOrder")} />
          </div>
        </div>
      </div>
    </div>
  );
}
