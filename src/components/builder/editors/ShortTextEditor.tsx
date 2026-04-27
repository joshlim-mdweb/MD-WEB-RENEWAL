"use client";

import { useBuilderStore } from "@/lib/store/builder";
import { Question, ShortTextConfig } from "@/lib/types/survey";
import { COLOR, INPUT, TYPOGRAPHY, SECTION_LABEL_STYLE } from "@/lib/design-tokens";
import { NumberStepper } from "@/components/ui";

interface Props {
  question: Question;
  surveyId: string;
}

export function ShortTextEditor({ question, surveyId }: Props) {
  const { updateQuestionConfig, setIsSaving } = useBuilderStore();

  const config = (question.config as ShortTextConfig) ?? {};

  async function saveConfig(patch: Partial<ShortTextConfig>) {
    const next = { ...config, ...patch };
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
    <div className="short_text_editor_wrap space-y-4">
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
          짧은 문장으로 답변을 입력합니다.
        </div>
      </div>

      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          설정
        </p>
        <div className="rounded px-3 py-3 space-y-3" style={{ backgroundColor: COLOR.BG_SURFACE }}>
          <div>
            <p className="mb-1" style={SECTION_LABEL_STYLE}>
              플레이스홀더
            </p>
            <input
              type="text"
              defaultValue={config.placeholder ?? ""}
              onBlur={(e) => saveConfig({ placeholder: e.target.value || undefined })}
              placeholder="플레이스홀더 입력..."
              className="w-full rounded px-2 py-2 opinion-input"
              style={{
                backgroundColor: COLOR.BG_INPUT,
                border: `1px solid ${INPUT.BORDER_DEFAULT}`,
                ...TYPOGRAPHY.STYLE.BODY_2,
                color: COLOR.TEXT_PRIMARY,
              }}
            />
          </div>
          <div>
            <p className="mb-1" style={SECTION_LABEL_STYLE}>
              최대 길이
            </p>
            <NumberStepper
              value={config.maxLength}
              min={1}
              placeholder="제한 없음"
              onChange={(v) => saveConfig({ maxLength: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
