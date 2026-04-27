"use client";

import type { Meta } from "@storybook/react";
import { useState } from "react";
import { DatePicker, CalendarPanel } from "./DatePicker";

const meta: Meta = {
  title: "Builder/DatePicker",
  parameters: { layout: "padded" },
};

export default meta;

// ─── CalendarPanel 직접 확인 (레퍼런스 이미지 기준) ──────────────────────────

export const CalendarUI = {
  name: "달력 UI (인라인)",
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: 360, padding: 24, backgroundColor: "#fff", borderRadius: 16 }}>
        <CalendarPanel
          value={value}
          onChange={setValue}
          onConfirm={() => console.log("confirmed:", value)}
        />
        <p style={{ marginTop: 12, fontSize: 12, color: "#6B7D8E" }}>
          선택된 값: {value ?? "없음"}
        </p>
      </div>
    );
  },
};

// ─── DatePicker 드롭다운 (SurveyOverviewPanel 실사용 형태) ────────────────────

export const DropdownDefault = {
  name: "드롭다운 — 기본",
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: 280, paddingBottom: 400 }}>
        <p style={{ fontSize: 11, color: "#6B7D8E", marginBottom: 6 }}>마감일</p>
        <DatePicker
          value={value}
          onChange={setValue}
          onConfirm={() => console.log("confirmed:", value)}
        />
      </div>
    );
  },
};

export const DropdownOpen = {
  name: "드롭다운 — 열린 상태",
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: 280, paddingBottom: 500 }}>
        <p style={{ fontSize: 11, color: "#6B7D8E", marginBottom: 6 }}>마감일</p>
        <DatePicker
          value={value}
          onChange={setValue}
          onConfirm={() => console.log("confirmed:", value)}
          initialOpen
        />
      </div>
    );
  },
};
