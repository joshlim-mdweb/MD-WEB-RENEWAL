import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Toggle from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Unchecked: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    onChange: () => {},
  },
};

export const WithLabel: Story = {
  args: {
    checked: true,
    label: "필수 응답",
    onChange: () => {},
  },
};

export const UncheckedWithLabel: Story = {
  args: {
    checked: false,
    label: "필수 응답",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: "비활성화됨",
    onChange: () => {},
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    label: "비활성화됨 (켜짐)",
    onChange: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    // Demonstrates live toggle behavior in Storybook canvas
    const [checked, setChecked] = useState(false);
    return (
      <Toggle checked={checked} onChange={setChecked} label={checked ? "응답 필수" : "응답 선택"} />
    );
  },
};
