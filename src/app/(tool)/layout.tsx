import type { ReactNode } from "react";

export const metadata = {
  title: "Flowchart Tool — MD Internal",
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0e0e12", fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {children}
    </div>
  );
}
