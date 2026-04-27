import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "320px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: { control: "select", options: ["text", "textarea"] },
    state: { control: "select", options: ["default", "error", "disabled"] },
    maxLength: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    type: "text",
    placeholder: "입력해주세요",
    state: "default",
  },
};

export const WithHelperText: Story = {
  args: {
    type: "text",
    placeholder: "설문 제목",
    state: "default",
    helperText: "응답자에게 표시되는 제목입니다.",
  },
};

export const ErrorState: Story = {
  args: {
    type: "text",
    value: "잘못된 값",
    state: "error",
    errorMessage: "이미 사용 중인 제목입니다.",
  },
};

export const Disabled: Story = {
  args: {
    type: "text",
    value: "수정 불가",
    state: "disabled",
  },
};

export const WithMaxLength: Story = {
  render: () => {
    // Controlled story to demonstrate live char count
    const [val, setVal] = useState("안녕하세요");
    return (
      <Input
        type="text"
        placeholder="설문 제목"
        value={val}
        onChange={setVal}
        maxLength={50}
        state="default"
      />
    );
  },
};

export const TextareaDefault: Story = {
  args: {
    type: "textarea",
    placeholder: "설문 설명을 입력해주세요",
    state: "default",
  },
};

export const TextareaWithMaxLength: Story = {
  render: () => {
    const [val, setVal] = useState("");
    return (
      <Input
        type="textarea"
        placeholder="응답자에게 보내는 메시지"
        value={val}
        onChange={setVal}
        maxLength={200}
        helperText="최대 200자까지 입력할 수 있습니다."
      />
    );
  },
};

export const TextareaError: Story = {
  args: {
    type: "textarea",
    value: "내용",
    state: "error",
    errorMessage: "내용을 입력해주세요.",
  },
};
