"use client";

import { useBuilderStore } from "@/lib/store/builder";
import { COLOR } from "@/lib/design-tokens";

export interface ValidationError {
  field: string;
  message: string;
  // Present when the error is tied to a specific question — enables click-to-focus.
  questionId?: string;
}

interface PublishValidationPanelProps {
  errors: ValidationError[];
  onDismiss: () => void;
}

export function PublishValidationPanel({ errors, onDismiss }: PublishValidationPanelProps) {
  const setActiveQuestion = useBuilderStore((s) => s.setActiveQuestion);

  return (
    <div
      className="publish_validation_wrap mx-5 mt-2 mb-0 bg-white rounded-lg px-4 py-3 shadow-sm flex items-start gap-3"
      style={{ border: `1px solid ${COLOR.NEGATIVE_LIGHT}` }}
    >
      <ul className="flex-1 space-y-1">
        {errors.map((error, index) => {
          const isClickable = Boolean(error.questionId);
          return (
            <li
              key={`${error.field}-${index}`}
              className={[
                "flex items-center gap-2 rounded px-1 -mx-1",
                isClickable ? "cursor-pointer transition-colors" : "",
              ]
                .join(" ")
                .trim()}
              style={isClickable ? undefined : undefined}
              onClick={isClickable ? () => setActiveQuestion(error.questionId!) : undefined}
              onMouseEnter={
                isClickable
                  ? (e) => {
                      (e.currentTarget as HTMLLIElement).style.backgroundColor = COLOR.NEGATIVE_BG;
                    }
                  : undefined
              }
              onMouseLeave={
                isClickable
                  ? (e) => {
                      (e.currentTarget as HTMLLIElement).style.backgroundColor = "";
                    }
                  : undefined
              }
            >
              {/* Red dot indicator — communicates error severity at a glance */}
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLOR.NEGATIVE }}
                aria-hidden="true"
              />
              <span className="text-sm" style={{ color: COLOR.TEXT_PRIMARY }}>
                {error.message}
              </span>
              {/* Arrow hint — shown only on clickable items to signal navigation */}
              {isClickable && (
                <svg
                  className="ml-auto flex-shrink-0 opacity-50"
                  style={{ color: COLOR.NEGATIVE }}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M2 5h6M5 2l3 3-3 3" />
                </svg>
              )}
            </li>
          );
        })}
      </ul>
      <button
        onClick={onDismiss}
        aria-label="유효성 오류 닫기"
        className="flex-shrink-0 transition-colors leading-none mt-0.5"
        style={{ color: COLOR.TEXT_MUTED }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_PRIMARY;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_MUTED;
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 1L11 11M11 1L1 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
