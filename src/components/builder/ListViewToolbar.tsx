"use client";

import { useState, useRef, useEffect, type FC } from "react";
import { COLOR, RADIUS, SHADOW } from "@/lib/design-tokens";
import { Tooltip } from "@/components/ui";

const IconCirclePlus = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);
const IconLayers = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);
const IconType = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);
const IconImage = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const IconVideo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

interface ListViewToolbarProps {
  questionId: string;
  sectionId: string;
  onAddAfter: (questionId: string) => void;
  onAddToEnd: (sectionId: string) => void;
  onAddSection: () => void;
  onAddTextBlock: (sectionId: string) => void;
  onGenerateWithAI: () => void;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

const ToolbarButton: FC<ToolbarButtonProps> = ({ icon, label, disabled = false, onClick }) => (
  <Tooltip content={disabled ? "준비 중이에요" : label} position="right">
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: disabled ? COLOR.TEXT_DISABLED : COLOR.TEXT_MUTED,
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: 8,
        background: "transparent",
        border: "none",
        transition: "color 120ms",
      }}
      onMouseOver={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_PRIMARY;
      }}
      onMouseOut={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_MUTED;
      }}
    >
      {icon}
    </button>
  </Tooltip>
);

const DropdownItem: FC<{
  label: string;
  accent?: boolean;
  onClick: () => void;
}> = ({ label, accent = false, onClick }) => (
  <div
    role="button"
    aria-label={label}
    onClick={onClick}
    className="rounded-lg cursor-pointer"
    style={{
      padding: "8px 10px",
      fontSize: 13,
      fontWeight: 500,
      color: accent ? COLOR.ACCENT : COLOR.TEXT_PRIMARY,
      display: "flex",
      alignItems: "center",
      gap: 8,
      transition: "background-color 120ms",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
  >
    <span>{accent ? "✦" : "✏️"}</span>
    {label}
  </div>
);

export const ListViewToolbar: FC<ListViewToolbarProps> = ({
  questionId,
  sectionId,
  onAddAfter,
  onAddToEnd,
  onAddSection,
  onAddTextBlock,
  onGenerateWithAI,
}) => {
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!addDropdownOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAddDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [addDropdownOpen]);

  return (
    <div
      className="list_view_toolbar_wrap"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: COLOR.BG_BASE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.LG,
        boxShadow: SHADOW.CARD,
        padding: 4,
        gap: 2,
      }}
    >
      {/* + 버튼 — 클릭 시 위치/방식 드롭다운 */}
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <Tooltip content="질문 추가하기" position="right">
          <button
            aria-label="질문 추가하기"
            onClick={() => setAddDropdownOpen((prev) => !prev)}
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: addDropdownOpen ? COLOR.ACCENT : COLOR.TEXT_MUTED,
              cursor: "pointer",
              borderRadius: 8,
              background: "transparent",
              border: "none",
              transition: "color 120ms",
            }}
            onMouseOver={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_PRIMARY)
            }
            onMouseOut={(e) => {
              if (!addDropdownOpen)
                (e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_MUTED;
            }}
          >
            <IconCirclePlus />
          </button>
        </Tooltip>

        {addDropdownOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: "calc(100% + 8px)",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: COLOR.BG_BASE,
              borderRadius: RADIUS.LG,
              boxShadow: SHADOW.DROPDOWN,
              zIndex: 30,
              minWidth: 172,
              padding: "6px",
            }}
          >
            <DropdownItem
              label="다음에 추가하기"
              onClick={() => {
                setAddDropdownOpen(false);
                onAddAfter(questionId);
              }}
            />
            <DropdownItem
              label="섹션 끝에 추가하기"
              onClick={() => {
                setAddDropdownOpen(false);
                onAddToEnd(sectionId);
              }}
            />
            <div style={{ height: 1, backgroundColor: COLOR.BORDER_DEFAULT, margin: "4px 8px" }} />
            <DropdownItem
              label="AI로 다음에 추가하기"
              accent
              onClick={() => {
                setAddDropdownOpen(false);
                onGenerateWithAI();
              }}
            />
            <DropdownItem
              label="AI로 섹션 끝에 추가하기"
              accent
              onClick={() => {
                setAddDropdownOpen(false);
                onGenerateWithAI();
              }}
            />
          </div>
        )}
      </div>

      <ToolbarButton icon={<IconLayers />} label="섹션 추가하기" onClick={onAddSection} />
      <ToolbarButton
        icon={<IconType />}
        label="텍스트 블록 추가하기"
        onClick={() => onAddTextBlock(sectionId)}
      />
      <ToolbarButton icon={<IconImage />} label="이미지 추가하기" disabled />
      <ToolbarButton icon={<IconVideo />} label="동영상 추가하기" disabled />
    </div>
  );
};
