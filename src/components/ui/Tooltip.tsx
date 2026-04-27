"use client";

import { type FC, type ReactElement, useState } from "react";

interface TooltipProps {
  content: string;
  children: ReactElement;
  position?: "top" | "bottom" | "left" | "right";
}

// Tooltip은 테마와 무관하게 항상 다크 배경 + 흰 텍스트
// (다크모드에서 TEXT_INVERSE가 어두운 색이 되어 안 보이는 문제 방지)
const TOOLTIP_STYLE: React.CSSProperties = {
  position: "absolute",
  backgroundColor: "#3a4a5a",
  color: "#ffffff",
  fontSize: 11,
  fontWeight: 500,
  padding: "4px 8px",
  borderRadius: 6,
  whiteSpace: "nowrap",
  pointerEvents: "none",
  zIndex: 50,
};

const POSITION_STYLE: Record<NonNullable<TooltipProps["position"]>, React.CSSProperties> = {
  top: { bottom: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)" },
  bottom: { top: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)" },
  left: { right: "calc(100% + 4px)", top: "50%", transform: "translateY(-50%)" },
  right: { left: "calc(100% + 4px)", top: "50%", transform: "translateY(-50%)" },
};

export const Tooltip: FC<TooltipProps> = ({ content, children, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <div style={{ ...TOOLTIP_STYLE, ...POSITION_STYLE[position] }}>{content}</div>}
    </div>
  );
};
