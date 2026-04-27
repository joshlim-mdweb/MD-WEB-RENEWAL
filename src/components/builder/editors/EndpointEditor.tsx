"use client";

import { useBuilderStore } from "@/lib/store/builder";
import { Question, EndpointConfig } from "@/lib/types/survey";
import { COLOR, INPUT, TYPOGRAPHY, SECTION_LABEL_STYLE } from "@/lib/design-tokens";

interface Props {
  question: Question;
  surveyId: string;
}

export function EndpointEditor({ question, surveyId }: Props) {
  const { updateQuestionConfig, setIsSaving } = useBuilderStore();

  const config: EndpointConfig = (question.config as EndpointConfig) ?? { message: "" };

  async function saveConfig(patch: Partial<EndpointConfig>) {
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
    <div className="endpoint_editor_wrap space-y-4">
      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          설명
        </p>
        <textarea
          defaultValue={config.message}
          onBlur={(e) => saveConfig({ message: e.target.value })}
          placeholder="마지막 메시지를 작성하세요."
          rows={4}
          className="w-full rounded px-3 py-2.5 resize-none opinion-input"
          style={{
            backgroundColor: COLOR.BG_SURFACE,
            border: `1px solid ${INPUT.BORDER_DEFAULT}`,
            ...TYPOGRAPHY.STYLE.BODY_2,
            color: COLOR.TEXT_PRIMARY,
          }}
        />
      </div>

      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          설정
        </p>
        <div className="rounded px-3 py-3" style={{ backgroundColor: COLOR.BG_SURFACE }}>
          <p className="mb-1" style={SECTION_LABEL_STYLE}>
            리디렉션 URL (선택사항)
          </p>
          <input
            type="url"
            defaultValue={config.redirectUrl ?? ""}
            onBlur={(e) => saveConfig({ redirectUrl: e.target.value || undefined })}
            placeholder="https://..."
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
    </div>
  );
}
