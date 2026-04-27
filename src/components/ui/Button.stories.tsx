import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="8" cy="8" rx="7" ry="4.5" />
    <circle cx="8" cy="8" r="2" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="8" x2="13" y2="8" />
    <polyline points="9,4 13,8 9,12" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "solid", "danger", "ghost", "neutral"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "발행하기",
  },
};

export const Solid: Story = {
  args: {
    variant: "solid",
    size: "md",
    children: "공개하기",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    size: "md",
    children: "삭제하기",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "md",
    children: "취소",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    size: "md",
    children: "닫기",
  },
};

export const Small: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "저장하기",
  },
};

export const Large: Story = {
  args: {
    variant: "primary",
    size: "lg",
    children: "설문 시작하기",
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    size: "md",
    loading: true,
    children: "발행하기",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "md",
    disabled: true,
    children: "발행하기",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="solid">공개하기</Button>
      <Button variant="primary">발행하기</Button>
      <Button variant="danger">삭제하기</Button>
      <Button variant="ghost">취소</Button>
      <Button variant="neutral">닫기</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Button variant="primary" size="sm">
        작게
      </Button>
      <Button variant="primary" size="md">
        보통
      </Button>
      <Button variant="primary" size="lg">
        크게
      </Button>
    </div>
  ),
};

export const WithLeftIcon: Story = {
  render: () => (
    <Button variant="primary" size="md" leftIcon={<EyeIcon />}>
      미리보기
    </Button>
  ),
};

export const WithRightIcon: Story = {
  render: () => (
    <Button variant="solid" size="md" rightIcon={<ArrowIcon />}>
      다음으로
    </Button>
  ),
};

export const AllIconVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="solid" leftIcon={<PlusIcon />}>
        만들기
      </Button>
      <Button variant="primary" leftIcon={<EyeIcon />}>
        미리보기
      </Button>
      <Button variant="danger" leftIcon={<PlusIcon />}>
        삭제하기
      </Button>
      <Button variant="ghost" leftIcon={<EyeIcon />}>
        보기
      </Button>
      <Button variant="neutral" leftIcon={<ArrowIcon />}>
        닫기
      </Button>
    </div>
  ),
};
