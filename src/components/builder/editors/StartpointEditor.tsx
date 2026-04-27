"use client";

import { useBuilderStore } from "@/lib/store/builder";
import { type Question, type StartpointConfig } from "@/lib/types/survey";
import { COLOR, INPUT, TYPOGRAPHY, SECTION_LABEL_STYLE } from "@/lib/design-tokens";

interface Props {
  question: Question;
  surveyId: string;
}

export function StartpointEditor({ question, surveyId }: Props) {
  const { updateQuestionConfig, setIsSaving } = useBuilderStore();

  const config: StartpointConfig = (question.config as StartpointConfig) ?? {};

  async function saveConfig(patch: Partial<StartpointConfig>) {
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
          new CustomEvent("survey-save-error", { detail: "저장에 실패했어요." })
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="startpoint_editor_wrap space-y-4">
      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          인사말 / 설문 소개
        </p>
        <textarea
          defaultValue={config.message ?? ""}
          onBlur={(e) => saveConfig({ message: e.target.value || undefined })}
          placeholder="설문을 시작하기 전 참여자에게 보여줄 소개 문구를 작성하세요."
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
          시작 버튼 레이블
        </p>
        <input
          type="text"
          defaultValue={config.buttonLabel ?? ""}
          onBlur={(e) => saveConfig({ buttonLabel: e.target.value || undefined })}
          placeholder="시작하기"
          className="w-full rounded px-3 py-2 opinion-input"
          style={{
            backgroundColor: COLOR.BG_SURFACE,
            border: `1px solid ${INPUT.BORDER_DEFAULT}`,
            ...TYPOGRAPHY.STYLE.BODY_2,
            color: COLOR.TEXT_PRIMARY,
          }}
        />
        <p className="mt-1 text-xs" style={{ color: COLOR.TEXT_MUTED }}>
          비워두면 &ldquo;시작하기&rdquo;로 표시돼요.
        </p>
      </div>
    </div>
  );
}
