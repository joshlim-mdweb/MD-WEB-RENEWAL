"use client";

import { useState } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { COLOR, RADIUS, DURATION, EASE, SECTION_LABEL_STYLE } from "@/lib/design-tokens";
import type { SurveyPurpose } from "@/lib/types/survey";
import { SURVEY_PURPOSE_LABELS, TAG_PRESETS } from "@/lib/types/survey";

interface SurveyMetaPanelProps {
  surveyId: string;
  onSave: () => Promise<void>;
  onTitleSave: (title: string) => Promise<void>;
}

export function SurveyMetaPanel({ onSave, onTitleSave }: SurveyMetaPanelProps) {
  const {
    surveyTitle,
    surveyDescription,
    surveyPurpose,
    surveyEstimatedTime,
    surveyTags,
    setSurveyTitle,
    setSurveyDescription,
    setSurveyPurpose,
    setSurveyEstimatedTime,
    setSurveyTags,
  } = useBuilderStore();

  const [titleError, setTitleError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState<string | null>(null);

  const tags = surveyTags ?? [];

  async function handleTitleBlur(value: string) {
    if (!value.trim()) {
      setTitleError("설문 제목을 입력해 주세요");
      return;
    }
    setTitleError(null);
    try {
      await onTitleSave(value.trim());
    } catch {
      setSaveError("저장하지 못했어요. 잠시 후 다시 시도해 주세요");
    }
  }

  async function handleMetaSave() {
    setSaveError(null);
    try {
      await onSave();
    } catch {
      setSaveError("저장하지 못했어요. 잠시 후 다시 시도해 주세요");
    }
  }

  async function handlePurposeClick(key: SurveyPurpose) {
    const next = surveyPurpose === key ? null : key;
    setSurveyPurpose(next);
    await handleMetaSave();
  }

  function addTag(raw: string) {
    const value = raw.trim().toLowerCase();
    if (!value) return;
    if (value.length > 15) {
      setTagError("태그는 15자 이내로 입력해 주세요");
      return;
    }
    if (/[!@#$%^&*()+={}\[\]|\\:;"'<>,.?/~`]/.test(value)) {
      setTagError("특수문자는 사용할 수 없어요");
      return;
    }
    if (tags.includes(value)) {
      setTagInput("");
      return;
    }
    if (tags.length >= 5) return;
    const next = [...tags, value];
    setSurveyTags(next);
    setTagInput("");
    setTagError(null);
    handleMetaSave();
  }

  function removeTag(tag: string) {
    const next = tags.filter((t) => t !== tag);
    setSurveyTags(next.length > 0 ? next : null);
    handleMetaSave();
  }

  function togglePresetTag(preset: string) {
    const val = preset.toLowerCase();
    const isSelected = tags.includes(val);
    if (isSelected) {
      removeTag(val);
    } else {
      addTag(preset);
    }
  }

  return (
    <div className="survey_meta_panel_wrap px-6 py-5 flex flex-col gap-5">
      {/* 제목 */}
      <div className="flex flex-col gap-1">
        <label style={SECTION_LABEL_STYLE}>
          제목 <span style={{ color: COLOR.NEGATIVE }}>*</span>
        </label>
        <input
          type="text"
          value={surveyTitle}
          onChange={(e) => {
            setSurveyTitle(e.target.value);
            if (titleError) setTitleError(null);
          }}
          onBlur={(e) => handleTitleBlur(e.target.value)}
          placeholder="설문 제목을 입력해 주세요"
          className="w-full opinion-input"
          style={inputStyle}
        />
        {titleError && <p style={{ fontSize: "11px", color: COLOR.NEGATIVE }}>{titleError}</p>}
      </div>

      {/* 설명 */}
      <div className="flex flex-col gap-1">
        <label style={SECTION_LABEL_STYLE}>설명</label>
        <textarea
          rows={3}
          value={surveyDescription ?? ""}
          onChange={(e) => setSurveyDescription(e.target.value)}
          onBlur={handleMetaSave}
          placeholder="설문에 대한 설명을 입력해 주세요"
          className="w-full resize-none opinion-input"
          style={inputStyle}
        />
      </div>

      {/* 설문 목적 */}
      <div className="flex flex-col gap-2">
        <div>
          <p style={SECTION_LABEL_STYLE}>설문 목적</p>
          <p style={{ fontSize: "11px", color: COLOR.TEXT_MUTED, marginTop: 4 }}>
            어떤 목적으로 만드는지 선택하면 더 잘 맞는 질문을 추천해 드릴 수 있어요{" "}
            <span style={{ color: COLOR.TEXT_DISABLED }}>(선택)</span>
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {(Object.keys(SURVEY_PURPOSE_LABELS) as SurveyPurpose[]).map((key) => {
            const isSelected = surveyPurpose === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handlePurposeClick(key)}
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: "16px",
                  padding: "5px 12px",
                  borderRadius: RADIUS.PILL,
                  border: `1.5px solid ${isSelected ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
                  backgroundColor: isSelected ? COLOR.ACCENT_LIGHT : "transparent",
                  color: isSelected ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: `background-color ${DURATION.FAST} ${EASE.DEFAULT}, border-color ${DURATION.FAST} ${EASE.DEFAULT}, color ${DURATION.FAST} ${EASE.DEFAULT}`,
                }}
              >
                {SURVEY_PURPOSE_LABELS[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 예상 소요 시간 */}
      <div className="flex flex-col gap-1">
        <label style={SECTION_LABEL_STYLE}>예상 소요 시간 (분)</label>
        <input
          type="number"
          min={1}
          value={surveyEstimatedTime ?? ""}
          onChange={(e) => setSurveyEstimatedTime(e.target.value ? Number(e.target.value) : null)}
          onBlur={handleMetaSave}
          placeholder="자동 계산"
          className="w-full opinion-input"
          style={inputStyle}
        />
      </div>

      {/* 태그 */}
      <div className="flex flex-col gap-2">
        <label style={SECTION_LABEL_STYLE}>
          태그 <span style={{ color: COLOR.TEXT_DISABLED }}>(선택)</span>
        </label>

        {/* 프리셋 칩 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {(Object.keys(TAG_PRESETS) as Array<keyof typeof TAG_PRESETS>)
            .flatMap((k) => TAG_PRESETS[k])
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .map((preset) => {
              const isSelected = tags.includes(preset.toLowerCase());
              const isDisabled = !isSelected && tags.length >= 5;
              return (
                <button
                  key={preset}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => togglePresetTag(preset)}
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    lineHeight: "16px",
                    padding: "4px 10px",
                    borderRadius: RADIUS.PILL,
                    border: `1.5px solid ${isSelected ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
                    backgroundColor: isSelected ? COLOR.ACCENT_MUTED : "transparent",
                    color: isSelected ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
                    cursor: isDisabled ? "default" : "pointer",
                    opacity: isDisabled ? 0.4 : 1,
                    pointerEvents: isDisabled ? "none" : "auto",
                    whiteSpace: "nowrap",
                    transition: `background-color ${DURATION.FAST} ${EASE.DEFAULT}, border-color ${DURATION.FAST} ${EASE.DEFAULT}`,
                  }}
                >
                  {preset}
                </button>
              );
            })}
        </div>

        {/* 선택된 태그 칩 */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "4px 10px",
                  borderRadius: RADIUS.PILL,
                  backgroundColor: COLOR.ACCENT_MUTED,
                  color: COLOR.ACCENT,
                  border: `1px solid ${COLOR.ACCENT}`,
                }}
              >
                {tag}
                <button
                  type="button"
                  aria-label={`${tag} 태그 제거`}
                  onClick={() => removeTag(tag)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: COLOR.ACCENT,
                    lineHeight: 1,
                  }}
                >
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1 1l8 8M9 1L1 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 직접 입력 */}
        <input
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
            setTagError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(tagInput);
            }
          }}
          disabled={tags.length >= 5}
          placeholder="태그를 직접 입력해 보세요"
          className="w-full opinion-input"
          style={{ ...inputStyle, opacity: tags.length >= 5 ? 0.5 : 1 }}
        />

        {tagError ? (
          <p style={{ fontSize: "11px", color: COLOR.NEGATIVE }}>{tagError}</p>
        ) : (
          <p style={{ fontSize: "11px", color: COLOR.TEXT_MUTED }}>최대 5개까지 추가할 수 있어요</p>
        )}
      </div>

      {/* 저장 실패 에러 */}
      {saveError && <p style={{ fontSize: "11px", color: COLOR.NEGATIVE }}>{saveError}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: COLOR.BG_SURFACE,
  border: `1px solid ${COLOR.BORDER_DEFAULT}`,
  borderRadius: RADIUS.MD,
  padding: "8px 12px",
  fontSize: "13px",
  color: COLOR.TEXT_PRIMARY,
};
