import type { Meta, StoryObj } from "@storybook/react";
import { DropdownItem } from "./DropdownItem";

const meta: Meta<typeof DropdownItem> = {
  title: "UI/DropdownItem",
  component: DropdownItem,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "200px", padding: "8px", background: "#fff", borderRadius: "12px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownItem>;

export const Default: Story = {
  args: {
    label: "임시저장",
    selected: false,
    disabled: false,
    onClick: () => {},
  },
};

export const Selected: Story = {
  args: {
    label: "진행중",
    selected: true,
    disabled: false,
    onClick: () => {},
  },
};

export const Disabled: Story = {
  args: {
    label: "비활성화 항목",
    selected: false,
    disabled: true,
    onClick: () => {},
  },
};

export const List: Story = {
  render: () => (
    <div>
      <DropdownItem label="임시저장" selected={false} onClick={() => {}} />
      <DropdownItem label="진행중" selected={true} onClick={() => {}} />
      <DropdownItem label="마감됨" selected={false} onClick={() => {}} />
      <DropdownItem label="보관됨" selected={false} disabled onClick={() => {}} />
    </div>
  ),
};
