import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

// Inline SVG icons used only in stories — no external icon library dependency
function IconClipboard() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px", border: "1px dashed #e5e8eb", borderRadius: "12px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const TitleOnly: Story = {
  args: {
    title: "설문이 없습니다",
  },
};

export const WithDescription: Story = {
  args: {
    title: "아직 설문이 없어요",
    description: "첫 번째 설문을 만들어 응답을 수집해보세요.",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <IconClipboard />,
    title: "아직 설문이 없어요",
    description: "첫 번째 설문을 만들어 응답을 수집해보세요.",
  },
};

export const WithCta: Story = {
  args: {
    icon: <IconClipboard />,
    title: "아직 설문이 없어요",
    description: "첫 번째 설문을 만들어 응답을 수집해보세요.",
    ctaLabel: "설문 만들기",
    onCtaClick: () => alert("설문 만들기 클릭"),
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: <IconSearch />,
    title: "검색 결과가 없습니다",
    description: "다른 키워드로 검색해보세요.",
  },
};

export const NoCtaWhenLabelMissing: Story = {
  name: "CTA hidden when ctaLabel is empty",
  args: {
    icon: <IconClipboard />,
    title: "데이터가 없어요",
    description: "CTA 없는 상태입니다.",
    // onCtaClick provided but no ctaLabel → CTA must not render
    onCtaClick: () => alert("this should not appear"),
  },
};
