"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState, type FC } from "react";
import { TextArea } from "./TextArea";
import { COLOR } from "@/lib/design-tokens";

// ─── Storybook-style story wrapper ────────────────────────────────────────────

const Story: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: "40px" }}>
    <p
      style={{
        fontSize: "11px",
        fontWeight: 600,
        color: COLOR.TEXT_MUTED,
        marginBottom: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {title}
    </p>
    {children}
  </div>
);

// ─── Individual stories ────────────────────────────────────────────────────────

export const Default: FC = () => (
  <Story title="Default">
    <TextArea placeholder="텍스트를 입력해 주세요" />
  </Story>
);

export const WithLabel: FC = () => (
  <Story title="With Label">
    <TextArea label="내용" placeholder="내용을 입력해 주세요" />
  </Story>
);

export const Required: FC = () => (
  <Story title="Required">
    <TextArea label="설문 설명" required placeholder="설문에 대한 설명을 입력해 주세요" />
  </Story>
);

export const WithHelperText: FC = () => (
  <Story title="With Helper Text">
    <TextArea
      label="자기소개"
      placeholder="자신을 소개해 주세요"
      helperText="응답자에게 보여지는 안내 문구예요"
    />
  </Story>
);

export const ErrorState: FC = () => (
  <Story title="Error State">
    <TextArea label="내용" value="너무 짧음" state="error" errorMessage="10자 이상 입력해 주세요" />
  </Story>
);

export const Disabled: FC = () => (
  <Story title="Disabled">
    <TextArea label="내용" value="수정할 수 없는 내용이에요" state="disabled" />
  </Story>
);

export const WithMaxLength: FC = () => {
  const [value, setValue] = useState("설문 내용을 작성해 보세요.");
  return (
    <Story title="With MaxLength Counter">
      <TextArea
        label="설문 설명"
        placeholder="설명을 입력해 주세요"
        value={value}
        onChange={setValue}
        maxLength={200}
      />
    </Story>
  );
};

export const ResizeNone: FC = () => (
  <Story title="Resize None">
    <TextArea label="고정 높이 영역" placeholder="크기를 조절할 수 없어요" resize="none" rows={3} />
  </Story>
);

export const AllStates: FC = () => (
  <Story title="All States (가로 나열)">
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <TextArea label="기본" placeholder="기본 상태" rows={3} />
      </div>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <TextArea
          label="오류"
          state="error"
          value="잘못된 내용"
          errorMessage="다시 확인해 주세요"
          rows={3}
        />
      </div>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <TextArea label="비활성" state="disabled" value="비활성 상태" rows={3} />
      </div>
    </div>
  </Story>
);

// ─── Storybook CSF default export ────────────────────────────────────────────

const meta: Meta<typeof TextArea> = {
  title: "UI/TextArea",
  component: TextArea,
  parameters: { layout: "padded" },
};

export default meta;
