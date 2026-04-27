import type { Meta, StoryObj } from "@storybook/react";
import { ToastPill } from "./ToastPill";

const meta: Meta<typeof ToastPill> = {
  title: "UI/ToastPill",
  component: ToastPill,
  parameters: {
    // Toast is fixed-positioned — use fullscreen layout so it renders naturally
    layout: "fullscreen",
  },
  argTypes: {
    message: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ToastPill>;

export const WithMessage: Story = {
  args: {
    message: "저장되었습니다.",
  },
};

export const LongMessage: Story = {
  args: {
    message: "설문이 성공적으로 발행되었습니다. 응답 링크를 공유해보세요.",
  },
};

export const NullMessage: Story = {
  name: "Null message (renders nothing)",
  args: {
    message: null,
  },
};
