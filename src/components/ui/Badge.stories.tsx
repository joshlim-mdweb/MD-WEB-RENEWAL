import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["draft", "published", "closed", "archived"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Draft: Story = {
  args: { status: "draft" },
};

export const Published: Story = {
  args: { status: "published" },
};

export const Closed: Story = {
  args: { status: "closed" },
};

export const Archived: Story = {
  args: { status: "archived" },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
      <Badge status="draft" />
      <Badge status="published" />
      <Badge status="closed" />
      <Badge status="archived" />
    </div>
  ),
};
