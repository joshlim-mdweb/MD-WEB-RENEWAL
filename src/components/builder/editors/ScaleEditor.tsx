"use client";

import { useState } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { Question, ScaleConfig } from "@/lib/types/survey";
import { COLOR, INPUT, TYPOGRAPHY, SECTION_LABEL_STYLE } from "@/lib/design-tokens";
import { NumberStepper } from "@/components/ui";

interface Props {
  question: Question;
  surveyId: string;
}

export function ScaleEditor({ question, surveyId }: Props) {
  const { updateQuestionConfig, setIsSaving } = useBuilderStore();

  const config: ScaleConfig = (question.config as ScaleConfig) ?? { min: 1, max: 5 };

  // Validate min < max before persisting. Error clears automatically when the
  // constraint is satisfied on the next blur.
  const [rangeError, setRangeError] = useState<string | null>(null);

  async function saveConfig(patch: Partial<ScaleConfig>) {
    const next = { ...config, ...patch };

    if (next.min >= next.max) {
      setRangeError("최솟값은 최댓값보다 작아야 합니다");
      return; // Do not persist invalid state
    }

    setRangeError(null);
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

  const scaleValues = Array.from({ length: config.max - config.min + 1 }, (_, i) => config.min + i);

  return (
    <div className="scale_editor_wrap space-y-4">
      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          미리보기
        </p>
        <div className="rounded px-3 py-3" style={{ backgroundColor: COLOR.BG_SURFACE }}>
          <div className="flex items-center justify-between gap-1">
            {scaleValues.map((v) => (
              <div
                key={v}
                className="flex-1 text-center py-1.5 rounded"
                style={{
                  backgroundColor: COLOR.BG_INPUT,
                  border: `1px solid ${COLOR.BORDER_DEFAULT}`,
                  ...TYPOGRAPHY.STYLE.LABEL_2,
                  color: COLOR.TEXT_SECONDARY,
                }}
              >
                {v}
              </div>
            ))}
          </div>
          {(config.minLabel || config.maxLabel) && (
            <div className="flex justify-between mt-1.5">
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
                {config.minLabel}
              </span>
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
                {config.maxLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          설정
        </p>
        <div className="rounded px-3 py-3 space-y-3" style={{ backgroundColor: COLOR.BG_SURFACE }}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="mb-1" style={SECTION_LABEL_STYLE}>
                최솟값
              </p>
              <NumberStepper
                value={config.min}
                max={config.max - 1}
                onChange={(v) => saveConfig({ min: v ?? config.min })}
              />
            </div>
            <div className="flex-1">
              <p className="mb-1" style={SECTION_LABEL_STYLE}>
                최댓값
              </p>
              <NumberStepper
                value={config.max}
                min={config.min + 1}
                onChange={(v) => saveConfig({ max: v ?? config.max })}
              />
            </div>
          </div>
          {/* Shown only when min >= max — clears automatically on next valid blur */}
          {rangeError && (
            <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.NEGATIVE }}>{rangeError}</p>
          )}
          <div>
            <p className="mb-1" style={SECTION_LABEL_STYLE}>
              최솟값 레이블
            </p>
            <input
              type="text"
              defaultValue={config.minLabel ?? ""}
              onBlur={(e) => saveConfig({ minLabel: e.target.value || undefined })}
              placeholder="예: 매우 나쁨"
              className="w-full rounded px-2 py-2 opinion-input"
              style={{
                backgroundColor: COLOR.BG_INPUT,
                border: `1px solid ${COLOR.BORDER_INPUT}`,
                ...TYPOGRAPHY.STYLE.BODY_2,
                color: COLOR.TEXT_PRIMARY,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = COLOR.BORDER_FOCUS)}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = COLOR.BORDER_INPUT)}
            />
          </div>
          <div>
            <p className="mb-1" style={SECTION_LABEL_STYLE}>
              최댓값 레이블
            </p>
            <input
              type="text"
              defaultValue={config.maxLabel ?? ""}
              onBlur={(e) => saveConfig({ maxLabel: e.target.value || undefined })}
              placeholder="예: 매우 좋음"
              className="w-full rounded px-2 py-2 opinion-input"
              style={{
                backgroundColor: COLOR.BG_INPUT,
                border: `1px solid ${COLOR.BORDER_INPUT}`,
                ...TYPOGRAPHY.STYLE.BODY_2,
                color: COLOR.TEXT_PRIMARY,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = COLOR.BORDER_FOCUS)}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = COLOR.BORDER_INPUT)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
