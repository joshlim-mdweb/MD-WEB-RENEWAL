"use client";

import { useBuilderStore } from "@/lib/store/builder";
import { Question, LongTextConfig } from "@/lib/types/survey";
import { COLOR, TYPOGRAPHY, SECTION_LABEL_STYLE } from "@/lib/design-tokens";
import { NumberStepper } from "@/components/ui";

interface Props {
  question: Question;
  surveyId: string;
}

export function LongTextEditor({ question, surveyId }: Props) {
  const { updateQuestionConfig, setIsSaving } = useBuilderStore();

  const config = (question.config as LongTextConfig) ?? {};

  async function saveMaxLength(value: number | undefined) {
    const next = { ...config, maxLength: value };
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
    <div className="long_text_editor_wrap space-y-4">
      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          답변
        </p>
        <div
          className="rounded px-3 py-2.5"
          style={{
            backgroundColor: COLOR.BG_SURFACE,
            ...TYPOGRAPHY.STYLE.BODY_2,
            color: COLOR.TEXT_MUTED,
          }}
        >
          장문의 답변을 입력합니다.
        </div>
      </div>

      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          설정
        </p>
        <div className="rounded px-3 py-3" style={{ backgroundColor: COLOR.BG_SURFACE }}>
          <p className="mb-1" style={SECTION_LABEL_STYLE}>
            최대 길이
          </p>
          <NumberStepper
            value={config.maxLength}
            min={1}
            placeholder="제한 없음"
            onChange={saveMaxLength}
          />
        </div>
      </div>
    </div>
  );
}
