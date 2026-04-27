import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Dropdown, DropdownTrigger } from "./Dropdown";
import { DropdownItem } from "./DropdownItem";

const meta: Meta<typeof Dropdown> = {
  title: "UI/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const SAMPLE_OPTIONS = ["임시저장", "진행중", "마감됨", "보관됨"];

export const Closed: Story = {
  render: () => (
    <Dropdown
      open={false}
      onOpenChange={() => {}}
      trigger={<DropdownTrigger label="상태 선택" open={false} />}
    >
      {SAMPLE_OPTIONS.map((opt) => (
        <DropdownItem key={opt} label={opt} onClick={() => {}} />
      ))}
    </Dropdown>
  ),
};

export const Open: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div
        style={{ height: "220px", display: "flex", alignItems: "flex-start", paddingTop: "8px" }}
      >
        <Dropdown
          open={open}
          onOpenChange={setOpen}
          trigger={<DropdownTrigger label="상태 선택" open={open} />}
        >
          {SAMPLE_OPTIONS.map((opt) => (
            <DropdownItem key={opt} label={opt} onClick={() => setOpen(false)} />
          ))}
        </Dropdown>
      </div>
    );
  },
};

export const WithSelectedItem: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("진행중");

    return (
      <div
        style={{ height: "220px", display: "flex", alignItems: "flex-start", paddingTop: "8px" }}
      >
        <Dropdown
          open={open}
          onOpenChange={setOpen}
          trigger={<DropdownTrigger label={selected} open={open} isSelected />}
          title="상태 변경"
        >
          {SAMPLE_OPTIONS.map((opt) => (
            <DropdownItem
              key={opt}
              label={opt}
              selected={opt === selected}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
            />
          ))}
        </Dropdown>
      </div>
    );
  },
};

export const FilledVariant: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div
        style={{ height: "200px", display: "flex", alignItems: "flex-start", paddingTop: "8px" }}
      >
        <Dropdown
          open={open}
          onOpenChange={setOpen}
          trigger={<DropdownTrigger label="추가하기" open={open} variant="filled" />}
        >
          {SAMPLE_OPTIONS.map((opt) => (
            <DropdownItem key={opt} label={opt} onClick={() => setOpen(false)} />
          ))}
        </Dropdown>
      </div>
    );
  },
};
