import type { Meta, StoryObj } from "@storybook/react";
import { AppIcon } from "./AppIcon";
import { IconEdit } from "./IconEdit";
import { IconResults } from "./IconResults";
import { IconAnalysis } from "./IconAnalysis";
import { IconPollSuccess } from "./IconPollSuccess";
import { IconSurveySuccess } from "./IconSurveySuccess";
import { IconCoin } from "./IconCoin";
import { IconSurvey } from "./IconSurvey";
import { IconParticipation } from "./IconParticipation";
import { IconEmpty } from "./IconEmpty";
import { IconQuestionMultipleChoice } from "./IconQuestionMultipleChoice";
import { IconQuestionShortText } from "./IconQuestionShortText";
import { IconQuestionLongText } from "./IconQuestionLongText";
import { IconQuestionScale } from "./IconQuestionScale";
import { IconQuestionGrade } from "./IconQuestionGrade";
import { IconQuestionCheckbox } from "./IconQuestionCheckbox";
import { IconQuestionDropdown } from "./IconQuestionDropdown";
import { IconQuestionRanking } from "./IconQuestionRanking";
import { IconQuestionEndpoint } from "./IconQuestionEndpoint";

const meta: Meta = {
  title: "UI/Icons",
  parameters: { layout: "padded" },
};
export default meta;

const SIZES = [32, 48, 64] as const;

function IconRow({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 0" }}>
      {SIZES.map((size) => (
        <AppIcon key={`light-${size}`} size={size} variant="light">
          {icon}
        </AppIcon>
      ))}
      {SIZES.map((size) => (
        <AppIcon key={`dark-${size}`} size={size} variant="dark">
          {icon}
        </AppIcon>
      ))}
      <span style={{ fontSize: 13, color: "#6B7D8E", marginLeft: 8 }}>{label}</span>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#9DB0BC",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "24px 0 8px",
        borderBottom: "1px solid #e6e7e9",
        marginBottom: 8,
      }}
    >
      {title}
    </div>
  );
}

export const Gallery: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "sans-serif", maxWidth: 720 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: "#2D3A4A" }}>
        OPINION Icon System
      </h2>
      <p style={{ fontSize: 13, color: "#6B7D8E", marginBottom: 8 }}>
        아이콘 색상: ACCENT 파란색 단일 · 배경: light / dark 2종
      </p>
      <div style={{ display: "flex", gap: 24, marginBottom: 24, fontSize: 12, color: "#9DB0BC" }}>
        <span>← Light 32 / 48 / 64px &nbsp;&nbsp; Dark 32 / 48 / 64px →</span>
      </div>

      <SectionHeader title="빌더 (Builder)" />
      <IconRow label="IconEdit — 편집" icon={<IconEdit />} />
      <IconRow label="IconResults — 결과" icon={<IconResults />} />
      <IconRow label="IconAnalysis — 분석" icon={<IconAnalysis />} />

      <SectionHeader title="앱 전반 (App-wide)" />
      <IconRow label="IconPollSuccess — 폴 완료" icon={<IconPollSuccess />} />
      <IconRow label="IconSurveySuccess — 설문 완료" icon={<IconSurveySuccess />} />
      <IconRow label="IconCoin — 포인트" icon={<IconCoin />} />
      <IconRow label="IconSurvey — 내 설문" icon={<IconSurvey />} />
      <IconRow label="IconParticipation — 참여" icon={<IconParticipation />} />
      <IconRow label="IconEmpty — 빈 상태" icon={<IconEmpty />} />

      <SectionHeader title="질문 유형 (Question Types)" />
      <IconRow label="객관식 (multiple_choice)" icon={<IconQuestionMultipleChoice />} />
      <IconRow label="단답형 (short_text)" icon={<IconQuestionShortText />} />
      <IconRow label="장문형 (long_text)" icon={<IconQuestionLongText />} />
      <IconRow label="척도 (scale)" icon={<IconQuestionScale />} />
      <IconRow label="별점 (grade)" icon={<IconQuestionGrade />} />
      <IconRow label="체크박스 (checkbox)" icon={<IconQuestionCheckbox />} />
      <IconRow label="드롭다운 (dropdown)" icon={<IconQuestionDropdown />} />
      <IconRow label="순위 (ranking)" icon={<IconQuestionRanking />} />
      <IconRow label="엔드포인트 (endpoint)" icon={<IconQuestionEndpoint />} />
    </div>
  ),
};
