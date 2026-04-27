"use client";

import { useState, useEffect } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { Question, GradeConfig } from "@/lib/types/survey";
import { COLOR, INPUT, TYPOGRAPHY, SECTION_LABEL_STYLE } from "@/lib/design-tokens";

interface Props {
  question: Question;
  surveyId: string;
}

const DEFAULT_GRADES = ["A", "B", "C", "D", "E"];

export function GradeEditor({ question, surveyId }: Props) {
  const { updateQuestionConfig, setIsSaving } = useBuilderStore();

  const config: GradeConfig = (question.config as GradeConfig) ?? { grades: DEFAULT_GRADES };

  // Local draft — keeps input responsive without firing API on every keystroke.
  // saveGrades() is called only on blur or on structural changes (add/remove).
  const [localGrades, setLocalGrades] = useState<string[]>(config.grades);

  // Sync local state when the selected question changes.
  // useState initializer runs only once, so switching between questions would
  // leave localGrades stale without this reset.
  useEffect(() => {
    setLocalGrades(config.grades);
  }, [question.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveGrades(grades: string[]) {
    const next = { grades };
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

  function handleGradeChange(index: number, value: string) {
    // Update local state only — no API call here
    setLocalGrades((prev) => prev.map((g, i) => (i === index ? value : g)));
  }

  function handleGradeBlur() {
    // Persist to server only when user leaves the field
    saveGrades(localGrades);
  }

  function addGrade() {
    const next = [...localGrades, ""];
    setLocalGrades(next);
    saveGrades(next);
  }

  function removeGrade(index: number) {
    const next = localGrades.filter((_, i) => i !== index);
    setLocalGrades(next);
    saveGrades(next);
  }

  return (
    <div className="grade_editor_wrap space-y-4">
      <div>
        <p className="mb-2" style={SECTION_LABEL_STYLE}>
          등급
        </p>
        <div className="flex flex-wrap gap-2">
          {localGrades.map((grade, index) => (
            <div key={index} className="flex items-center gap-1">
              <input
                type="text"
                value={grade}
                onChange={(e) => handleGradeChange(index, e.target.value)}
                onBlur={handleGradeBlur}
                className="w-12 text-center rounded px-2 py-2 opinion-input"
                style={{
                  backgroundColor: COLOR.BG_SURFACE,
                  border: `1px solid ${INPUT.BORDER_DEFAULT}`,
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  color: COLOR.TEXT_PRIMARY,
                }}
              />
              {localGrades.length > 1 && (
                <button
                  onClick={() => removeGrade(index)}
                  style={{ color: COLOR.TEXT_MUTED }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.TEXT_PRIMARY)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.TEXT_MUTED)}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="1" y1="1" x2="11" y2="11" />
                    <line x1="11" y1="1" x2="1" y2="11" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addGrade}
            className="w-12 text-center rounded px-2 py-2 transition-colors"
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              ...TYPOGRAPHY.STYLE.BODY_2,
              color: COLOR.TEXT_MUTED,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLOR.BG_SECTION)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLOR.BG_SURFACE)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
