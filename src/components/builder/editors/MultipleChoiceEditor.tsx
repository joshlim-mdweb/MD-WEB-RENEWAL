"use client";

import { useState } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { Question, MultipleChoiceConfig } from "@/lib/types/survey";
import { BUTTON, COLOR, TYPOGRAPHY, SECTION_LABEL_STYLE } from "@/lib/design-tokens";
import { Toggle } from "../QuestionSettings";
import { OptionsEditor } from "./OptionsEditor";
import { useConditionalRouteRows } from "./ConditionalLogicEditor";

interface Props {
  question: Question;
  surveyId: string;
}

export function MultipleChoiceEditor({ question, surveyId }: Props) {
  const { updateQuestionOptions, updateQuestionConfig, setIsSaving, responseCount } =
    useBuilderStore();
  const optionsLocked = responseCount > 0;
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [showConditionalConflictWarning, setShowConditionalConflictWarning] = useState(false);
  const { renderRouteRow, renderDefaultRouteRow } = useConditionalRouteRows(question, surveyId);

  const config = (question.config as MultipleChoiceConfig) ?? {
    allowMultiple: false,
    randomOrder: false,
  };

  async function saveOptions(nextOptions: string[]) {
    updateQuestionOptions(question.id, nextOptions);

    // Keep conditionalRules.answerValue in sync with the option text at the same index.
    // answerValue is used for runtime response evaluation, so stale text would silently
    // break branching for any response submitted after the option was renamed (BUG-003).
    const existingRules = config.conditionalRules;
    const syncedConfig =
      existingRules && existingRules.length > 0
        ? {
            ...config,
            conditionalRules: existingRules.map((rule) => {
              if (rule.optionIndex === undefined) return rule;
              const updatedText = nextOptions[rule.optionIndex];
              // Only update when the text actually changed to avoid unnecessary writes
              if (updatedText === undefined || updatedText === rule.answerValue) return rule;
              return { ...rule, answerValue: updatedText };
            }),
          }
        : config;

    const hasConfigChange = syncedConfig !== config;

    setIsSaving(true);
    try {
      const optionsRes = await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          hasConfigChange
            ? { options: nextOptions, config: syncedConfig }
            : { options: nextOptions }
        ),
      });
      if (!optionsRes.ok) {
        window.dispatchEvent(
          new CustomEvent("survey-save-error", { detail: "저장에 실패했습니다." })
        );
      } else if (hasConfigChange) {
        updateQuestionConfig(question.id, syncedConfig);
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function applyConditionalToggle() {
    const next = !config.conditionalEnabled;
    const nextConfig: MultipleChoiceConfig = {
      ...config,
      conditionalEnabled: next,
      ...(next && config.allowMultiple ? { allowMultiple: false } : {}),
    };
    updateQuestionConfig(question.id, nextConfig);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: nextConfig }),
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

  function handleConditionalToggle() {
    // Turning ON while allowMultiple is ON → confirm before silently resetting allowMultiple
    if (!config.conditionalEnabled && config.allowMultiple) {
      setShowConditionalConflictWarning(true);
      return;
    }
    applyConditionalToggle();
  }

  async function confirmConditionalToggle() {
    setShowConditionalConflictWarning(false);
    await applyConditionalToggle();
  }

  async function toggleConfig(key: keyof MultipleChoiceConfig) {
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

  function handleAllowMultipleToggle() {
    // Turning ON while conditional rules exist → show warning before clearing
    if (
      !config.allowMultiple &&
      (config.conditionalEnabled || (config.conditionalRules?.length ?? 0) > 0)
    ) {
      setShowConflictWarning(true);
      return;
    }
    toggleConfig("allowMultiple");
  }

  async function confirmAllowMultiple() {
    const next: MultipleChoiceConfig = {
      ...config,
      allowMultiple: true,
      conditionalEnabled: false,
      conditionalRules: undefined,
    };
    updateQuestionConfig(question.id, next);
    setShowConflictWarning(false);
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
    <>
      {showConditionalConflictWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[400px] p-6 flex flex-col gap-4">
            <h2
              className="text-center"
              style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}
            >
              개별 경로 설정 켜기
            </h2>
            <p
              className="leading-relaxed text-center"
              style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}
            >
              개별 경로 설정을 켜면 설정된{" "}
              <span style={{ fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM, color: COLOR.TEXT_PRIMARY }}>
                다중 선택이 해제
              </span>
              됩니다.
              <br />이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                onClick={() => setShowConditionalConflictWarning(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ backgroundColor: BUTTON.NEUTRAL_BG, color: BUTTON.NEUTRAL_TEXT }}
              >
                취소
              </button>
              <button
                onClick={confirmConditionalToggle}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ backgroundColor: BUTTON.DANGER_BG, color: BUTTON.DANGER_TEXT }}
              >
                확인하기
              </button>
            </div>
          </div>
        </div>
      )}
      {showConflictWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[400px] p-6 flex flex-col gap-4">
            <h2
              className="text-center"
              style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}
            >
              다중 선택 켜기
            </h2>
            <p
              className="leading-relaxed text-center"
              style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}
            >
              다중 선택을 켜면 설정된{" "}
              <span style={{ fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM, color: COLOR.TEXT_PRIMARY }}>
                개별 경로 설정이 모두 초기화
              </span>
              됩니다.
              <br />이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                onClick={() => setShowConflictWarning(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ backgroundColor: BUTTON.NEUTRAL_BG, color: BUTTON.NEUTRAL_TEXT }}
              >
                취소
              </button>
              <button
                onClick={confirmAllowMultiple}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ backgroundColor: BUTTON.DANGER_BG, color: BUTTON.DANGER_TEXT }}
              >
                초기화하기
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="multiple_choice_editor_wrap space-y-6">
        <OptionsEditor
          options={question.options ?? []}
          onChange={saveOptions}
          placeholder="보기"
          locked={optionsLocked}
          headerRight={
            <div className="flex items-center gap-2">
              <div
                className="flex items-center rounded-lg p-0.5"
                style={{ backgroundColor: COLOR.BG_SURFACE }}
              >
                {(["공통 경로", "개별 경로"] as const).map((label) => {
                  const isIndividual = label === "개별 경로";
                  const isActive = (config.conditionalEnabled ?? false) === isIndividual;
                  const isDisabled = isIndividual && config.allowMultiple;
                  return (
                    <button
                      key={label}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => !isActive && handleConditionalToggle()}
                      className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap"
                      style={{
                        backgroundColor: isActive ? COLOR.BG_BASE : "transparent",
                        color: isDisabled
                          ? COLOR.TEXT_MUTED
                          : isActive
                            ? COLOR.TEXT_PRIMARY
                            : COLOR.TEXT_SECONDARY,
                        cursor: isDisabled ? "not-allowed" : isActive ? "default" : "pointer",
                        boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {renderDefaultRouteRow(config.conditionalEnabled ?? false)}
            </div>
          }
          renderAfterOption={config.conditionalEnabled ? renderRouteRow : undefined}
        />

        <div className="settings_area">
          <p className="mb-2" style={SECTION_LABEL_STYLE}>
            설정
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span
                  style={{
                    ...TYPOGRAPHY.STYLE.BODY_2,
                    color: COLOR.TEXT_PRIMARY,
                    opacity: config.conditionalEnabled ? 0.4 : 1,
                  }}
                >
                  다중 선택
                </span>
                <Toggle
                  isOn={config.allowMultiple}
                  onToggle={handleAllowMultipleToggle}
                  disabled={!config.allowMultiple && config.conditionalEnabled}
                />
              </div>
              {config.conditionalEnabled && (
                <p
                  className="mt-1"
                  style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
                >
                  개별 경로 설정이 켜져 있으면 다중 선택을 사용할 수 없습니다.
                </p>
              )}
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
    </>
  );
}
