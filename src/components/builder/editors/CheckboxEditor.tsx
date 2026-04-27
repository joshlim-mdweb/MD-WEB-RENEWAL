"use client";

import { useBuilderStore } from "@/lib/store/builder";
import { Question, CheckboxConfig } from "@/lib/types/survey";
import { COLOR, INPUT, TYPOGRAPHY, SECTION_LABEL_STYLE } from "@/lib/design-tokens";
import { Toggle } from "../QuestionSettings";
import { OptionsEditor } from "./OptionsEditor";

interface Props {
  question: Question;
  surveyId: string;
}

export function CheckboxEditor({ question, surveyId }: Props) {
  const { updateQuestionOptions, updateQuestionConfig, setIsSaving, responseCount } =
    useBuilderStore();
  const optionsLocked = responseCount > 0;

  const config = (question.config as CheckboxConfig) ?? { randomOrder: false };

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

  async function toggleRandomOrder() {
    const next = { ...config, randomOrder: !config.randomOrder };
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

  async function updateSelectionLimit(key: "minSelection" | "maxSelection", value: string) {
    const parsed = value === "" ? undefined : parseInt(value, 10);
    const next = { ...config, [key]: parsed };
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
    <div className="checkbox_editor_wrap space-y-6">
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
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="mb-1" style={SECTION_LABEL_STYLE}>
                최소 선택
              </p>
              <input
                type="number"
                min={1}
                defaultValue={config.minSelection ?? ""}
                onBlur={(e) => updateSelectionLimit("minSelection", e.target.value)}
                placeholder="–"
                className="w-full rounded px-2 py-2 opinion-input"
                style={{
                  backgroundColor: COLOR.BG_INPUT,
                  border: `1px solid ${INPUT.BORDER_DEFAULT}`,
                  ...TYPOGRAPHY.STYLE.BODY_2,
                  color: COLOR.TEXT_PRIMARY,
                }}
              />
            </div>
            <div className="flex-1">
              <p className="mb-1" style={SECTION_LABEL_STYLE}>
                최대 선택
              </p>
              <input
                type="number"
                min={1}
                defaultValue={config.maxSelection ?? ""}
                onBlur={(e) => updateSelectionLimit("maxSelection", e.target.value)}
                placeholder="–"
                className="w-full rounded px-2 py-2 opinion-input"
                style={{
                  backgroundColor: COLOR.BG_INPUT,
                  border: `1px solid ${INPUT.BORDER_DEFAULT}`,
                  ...TYPOGRAPHY.STYLE.BODY_2,
                  color: COLOR.TEXT_PRIMARY,
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_PRIMARY }}>
              보기 무작위 배치
            </span>
            <Toggle isOn={config.randomOrder} onToggle={toggleRandomOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}
