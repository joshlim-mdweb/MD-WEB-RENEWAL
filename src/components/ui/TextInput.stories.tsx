"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState, type FC } from "react";
import { TextInput } from "./TextInput";
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
    <TextInput placeholder="텍스트를 입력해 주세요" />
  </Story>
);

export const WithLabel: FC = () => (
  <Story title="With Label">
    <TextInput label="이름" placeholder="이름을 입력해 주세요" />
  </Story>
);

export const Required: FC = () => (
  <Story title="Required">
    <TextInput label="이메일" required placeholder="이메일을 입력해 주세요" type="email" />
  </Story>
);

export const Optional: FC = () => (
  <Story title="Optional">
    <TextInput label="소속" optional placeholder="소속을 입력해 주세요" />
  </Story>
);

export const WithHelperText: FC = () => (
  <Story title="With Helper Text">
    <TextInput
      label="비밀번호"
      type="password"
      placeholder="비밀번호를 입력해 주세요"
      helperText="8자 이상, 영문·숫자·특수문자를 포함해 주세요"
    />
  </Story>
);

export const ErrorState: FC = () => (
  <Story title="Error State">
    <TextInput
      label="이메일"
      type="email"
      value="notanemail"
      state="error"
      errorMessage="올바른 이메일 형식으로 입력해 주세요"
    />
  </Story>
);

export const Disabled: FC = () => (
  <Story title="Disabled">
    <TextInput label="이메일" type="email" value="user@example.com" state="disabled" />
  </Story>
);

export const WithMaxLength: FC = () => {
  const [value, setValue] = useState("안녕하세요");
  return (
    <Story title="With MaxLength Counter">
      <TextInput
        label="한 줄 소개"
        placeholder="자신을 소개해 주세요"
        value={value}
        onChange={setValue}
        maxLength={50}
      />
    </Story>
  );
};

export const SizeSm: FC = () => (
  <Story title="Size SM (36px)">
    <TextInput size="sm" placeholder="작은 인풋" />
  </Story>
);

export const WithLeftSlot: FC = () => (
  <Story title="With Left Slot (Search Icon)">
    <TextInput
      placeholder="검색어를 입력해 주세요"
      type="search"
      leftSlot={
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="7" cy="7" r="4.5" stroke={COLOR.TEXT_MUTED} strokeWidth="1.5" />
          <path
            d="M10.5 10.5L13 13"
            stroke={COLOR.TEXT_MUTED}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      }
    />
  </Story>
);

export const WithRightSlot: FC = () => {
  const [value, setValue] = useState("지울 수 있는 텍스트");
  return (
    <Story title="With Right Slot (Clear Button)">
      <TextInput
        value={value}
        onChange={setValue}
        placeholder="입력해 주세요"
        rightSlot={
          value ? (
            <button
              onClick={() => setValue("")}
              aria-label="입력 내용 지우기"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="6" fill={COLOR.TEXT_MUTED} opacity="0.3" />
                <path
                  d="M6 6l4 4M10 6l-4 4"
                  stroke={COLOR.TEXT_MUTED}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null
        }
      />
    </Story>
  );
};

export const FormLayout: FC = () => (
  <Story title="Form Layout (spacing showcase)">
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "400px" }}>
      <TextInput label="이름" required placeholder="이름을 입력해 주세요" />
      <TextInput label="이메일" required type="email" placeholder="이메일을 입력해 주세요" />
      <TextInput label="소속" optional placeholder="소속을 입력해 주세요" />
    </div>
  </Story>
);

export const AllStates: FC = () => (
  <Story title="All States (가로 나열)">
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <TextInput label="기본" placeholder="기본 상태" />
      </div>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <TextInput label="오류" state="error" value="잘못된 값" errorMessage="다시 확인해 주세요" />
      </div>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <TextInput label="비활성" state="disabled" value="비활성 상태" />
      </div>
    </div>
  </Story>
);

// ─── Storybook CSF default export ────────────────────────────────────────────

const meta: Meta<typeof TextInput> = {
  title: "UI/TextInput",
  component: TextInput,
  parameters: { layout: "padded" },
};

export default meta;
