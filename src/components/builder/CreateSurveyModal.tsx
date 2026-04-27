"use client";

import { useRef, useState, useEffect, type FC } from "react";
import { COLOR, INPUT, RADIUS, SHADOW } from "@/lib/design-tokens";

type ModalState = "DEFAULT" | "READY" | "LOADING" | "ERROR";

interface CreateSurveyModalProps {
  onConfirm: (title: string) => Promise<void>;
  onCancel: () => void;
}

export const CreateSurveyModal: FC<CreateSurveyModalProps> = ({ onConfirm, onCancel }) => {
  const [title, setTitle] = useState("");
  const [modalState, setModalState] = useState<ModalState>("DEFAULT");
  const inputRef = useRef<HTMLInputElement>(null);

  const isReady = title.trim().length > 0;
  const isLoading = modalState === "LOADING";

  // Auto-focus the input when the modal mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on ESC (unless loading)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoading) onCancel();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isLoading, onCancel]);

  async function handleSubmit() {
    if (!isReady || isLoading) return;
    setModalState("LOADING");
    try {
      await onConfirm(title.trim());
      // onConfirm handles redirect — no need to reset state
    } catch {
      setModalState("ERROR");
    }
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    setModalState(value.trim().length > 0 ? "READY" : "DEFAULT");
  }

  return (
    // Backdrop
    <div
      className="create_survey_modal_backdrop fixed inset-0 z-[9000] flex items-center justify-center"
      style={{ backgroundColor: "rgba(15, 30, 46, 0.45)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        className="create_survey_modal_wrap flex flex-col bg-white"
        style={{
          width: 480,
          borderRadius: RADIUS.XL,
          boxShadow: SHADOW.MODAL,
          padding: "28px 28px 24px",
        }}
      >
        {/* Title */}
        <h2 className="text-base font-semibold mb-5" style={{ color: COLOR.TEXT_PRIMARY }}>
          새 설문 만들기
        </h2>

        {/* Input */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-xs font-medium" style={{ color: COLOR.TEXT_MUTED }}>
            설문 제목
          </label>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="설문 제목을 입력해 주세요"
            disabled={isLoading}
            data-error={modalState === "ERROR" ? "true" : undefined}
            className="w-full px-3 py-2 text-sm rounded-lg disabled:opacity-60 opinion-input"
            style={{
              border: `1px solid ${INPUT.BORDER_DEFAULT}`,
              color: COLOR.TEXT_PRIMARY,
              backgroundColor: COLOR.BG_BASE,
              borderRadius: RADIUS.MD,
            }}
          />
          {/* Error inline message */}
          {modalState === "ERROR" && (
            <p className="text-xs" style={{ color: COLOR.NEGATIVE }}>
              설문을 만들 수 없어요. 다시 시도해 주세요.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            style={{
              color: COLOR.TEXT_MUTED,
              backgroundColor: "transparent",
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.MD,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLOR.BG_SURFACE;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            닫기
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isReady || isLoading}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: COLOR.ACCENT,
              borderRadius: RADIUS.MD,
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <svg
                  className="animate-spin"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="6.5" cy="6.5" r="5" strokeOpacity="0.3" />
                  <path d="M6.5 1.5 A5 5 0 0 1 11.5 6.5" strokeLinecap="round" />
                </svg>
                만드는 중...
              </span>
            ) : (
              "만들기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
