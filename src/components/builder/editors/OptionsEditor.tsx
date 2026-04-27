"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { COLOR, INPUT, SECTION_LABEL_STYLE } from "@/lib/design-tokens";

// Special options are stored as sentinel strings in the options array.
export const OPTION_OTHER = "__other__";
export const OPTION_NONE = "__none__";

interface Props {
  options: string[];
  onChange: (options: string[]) => void;
  placeholder?: string;
  allowSpecialOptions?: boolean;
  headerRight?: ReactNode;
  /** Renders additional content below each option row (e.g. inline route selector) */
  renderAfterOption?: (idx: number, option: string) => ReactNode;
  /**
   * When true, all destructive edits are blocked: option text is read-only,
   * deletion buttons are hidden, and add-option controls are hidden.
   * Set this when the survey already has responses (policy §5.4).
   */
  locked?: boolean;
}

export function OptionsEditor({
  options,
  onChange,
  placeholder = "보기",
  allowSpecialOptions = true,
  headerRight,
  renderAfterOption,
  locked = false,
}: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const shouldFocusLastRef = useRef(false);
  // Track focused input index to swap border color without Tailwind focus-ring
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (shouldFocusLastRef.current) {
      shouldFocusLastRef.current = false;
      inputRefs.current[options.length - 1]?.focus();
    }
  }, [options.length]);

  function updateOption(index: number, value: string) {
    onChange(options.map((o, i) => (i === index ? value : o)));
  }

  function addOption() {
    shouldFocusLastRef.current = true;
    onChange([...options, ""]);
  }

  function addSpecial(sentinel: typeof OPTION_OTHER | typeof OPTION_NONE) {
    onChange([...options, sentinel]);
  }

  function removeOption(index: number) {
    onChange(options.filter((_, i) => i !== index));
  }

  const hasOther = options.includes(OPTION_OTHER);
  const hasNone = options.includes(OPTION_NONE);

  return (
    <div className="options_editor_wrap">
      {/* Uppercase micro-label — matches SECTION_LABEL_STYLE across all editors */}
      <div className="flex items-center justify-between mb-2">
        <p style={SECTION_LABEL_STYLE}>보기</p>
        {headerRight}
      </div>
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSpecialOther = option === OPTION_OTHER;
          const isSpecialNone = option === OPTION_NONE;
          const isSpecial = isSpecialOther || isSpecialNone;
          const isFocused = focusedIndex === index;

          return (
            <div key={index} className="option_item_wrap">
              <div className="flex items-center gap-2">
                {isSpecial ? (
                  <>
                    <span
                      className="flex-shrink-0 select-none font-semibold tabular-nums"
                      style={{
                        color: COLOR.TEXT_SECONDARY,
                        minWidth: "32px",
                        fontSize: "11px",
                      }}
                    >
                      {`보기 ${index + 1}.`}
                    </span>
                    <span
                      className="flex-1 rounded-lg px-3 py-2 text-sm italic"
                      style={{ backgroundColor: COLOR.BG_SURFACE, color: COLOR.TEXT_MUTED }}
                    >
                      {isSpecialOther ? "기타 (직접 입력)" : "없음"}
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className="flex-shrink-0 select-none font-semibold tabular-nums"
                      style={{
                        color: COLOR.TEXT_SECONDARY,
                        minWidth: "32px",
                        fontSize: "11px",
                      }}
                    >
                      {`보기 ${index + 1}.`}
                    </span>
                    <input
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      value={option}
                      readOnly={locked}
                      onChange={locked ? undefined : (e) => updateOption(index, e.target.value)}
                      onFocus={() => !locked && setFocusedIndex(index)}
                      onBlur={() => {
                        setFocusedIndex(null);
                        if (!locked) onChange(options);
                      }}
                      placeholder=""
                      className="flex-1 rounded-lg px-3 py-2 text-sm transition-colors"
                      style={{
                        background: locked ? COLOR.BG_SURFACE : COLOR.BG_INPUT,
                        border: `1px solid ${isFocused ? INPUT.BORDER_FOCUS : INPUT.BORDER_DEFAULT}`,
                        color: locked ? COLOR.TEXT_MUTED : COLOR.TEXT_PRIMARY,
                        outline: "none",
                        cursor: locked ? "default" : undefined,
                      }}
                    />
                  </>
                )}

                {!locked && options.length > 1 && (
                  <button
                    onClick={() => removeOption(index)}
                    aria-label="옵션 삭제하기"
                    className="flex-shrink-0 transition-colors"
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
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <line x1="1" y1="1" x2="11" y2="11" />
                      <line x1="11" y1="1" x2="1" y2="11" />
                    </svg>
                  </button>
                )}
              </div>
              {renderAfterOption?.(index, option)}
            </div>
          );
        })}

        {/* Bottom row: + 옵션 추가 + special option buttons — hidden when locked */}
        {!locked && (
          <div className="flex items-center gap-0.5 pt-0.5">
            <button
              onClick={addOption}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: COLOR.ACCENT,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLOR.ACCENT_BG)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="7" y1="2" x2="7" y2="12" />
                <line x1="2" y1="7" x2="12" y2="7" />
              </svg>
              옵션 추가
            </button>

            {allowSpecialOptions && (
              <>
                <span style={{ color: COLOR.BORDER_DEFAULT, fontSize: "12px", padding: "0 2px" }}>
                  ·
                </span>
                <button
                  onClick={() => addSpecial(OPTION_OTHER)}
                  disabled={hasOther}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                  style={{
                    color: hasOther ? COLOR.TEXT_DISABLED : COLOR.TEXT_MUTED,
                    background: "transparent",
                    border: "none",
                    cursor: hasOther ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!hasOther) e.currentTarget.style.backgroundColor = COLOR.BG_SURFACE;
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  기타
                </button>
                <span style={{ color: COLOR.BORDER_DEFAULT, fontSize: "12px", padding: "0 2px" }}>
                  ·
                </span>
                <button
                  onClick={() => addSpecial(OPTION_NONE)}
                  disabled={hasNone}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                  style={{
                    color: hasNone ? COLOR.TEXT_DISABLED : COLOR.TEXT_MUTED,
                    background: "transparent",
                    border: "none",
                    cursor: hasNone ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!hasNone) e.currentTarget.style.backgroundColor = COLOR.BG_SURFACE;
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  없음
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
