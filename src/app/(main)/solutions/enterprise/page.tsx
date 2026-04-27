"use client";

import { type FC } from "react";
import Link from "next/link";
import MDNav from "@/components/solutions/MDNav";
import {
  IndustryStandardViz,
  UserpoolViz,
  PipelineViz,
  CentralizedMgmtViz,
  ScalabilityViz,
  TechSupportViz,
} from "@/components/solutions/MDInfographics";
import { COLOR, TYPOGRAPHY, RADIUS, SPACING, SHADOW } from "@/lib/design-tokens";

// ─── TextBlock ────────────────────────────────────────────────────────────────

const TextBlock: FC<{ label: string; h2: string; body: string }> = ({ label, h2, body }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column" as const,
      gap: SPACING[4],
    }}
  >
    <p
      style={{
        ...TYPOGRAPHY.STYLE.LABEL_2,
        color: COLOR.ACCENT,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        margin: 0,
      }}
    >
      {label}
    </p>
    <h2
      style={{
        ...TYPOGRAPHY.STYLE.H2,
        fontSize: "40px",
        lineHeight: "52px",
        letterSpacing: "-0.03em",
        color: COLOR.TEXT_PRIMARY,
        margin: 0,
      }}
    >
      {h2}
    </h2>
    <p
      style={{
        ...TYPOGRAPHY.STYLE.BODY_1,
        color: COLOR.TEXT_MUTED,
        margin: 0,
      }}
    >
      {body}
    </p>
  </div>
);

// ─── Section data ─────────────────────────────────────────────────────────────

type SectionBg = "base" | "section";

type SectionEntry = {
  id: string;
  label: string;
  h2: string;
  body: string;
  Viz: FC;
  flip: boolean;
  bg: SectionBg;
};

const SECTIONS: SectionEntry[] = [
  {
    id: "industry",
    label: "Industry Standard",
    h2: "도메인에 관계없이 최상위 스튜디오의 공통 선택",
    body: "한 팀에서 검증된 워크플로우가 조직 전체에 그대로 적용됩니다. 업계 표준 툴은 외부 협업과 납품 호환도 자연스럽게 맞아 떨어집니다.",
    Viz: IndustryStandardViz,
    flip: false,
    bg: "base",
  },
  {
    id: "userpool",
    label: "Userpool",
    h2: "프로젝트가 끝나면 라이선스를 다른 팀원에게 옮길 수 있습니다",
    body: "사용하지 않는 라이선스가 그대로 남지 않습니다. 필요할 때 늘리고, 시즌이 끝나면 줄입니다. 기간별 할당으로 시즌·스프린트에 맞게 조정합니다.",
    Viz: UserpoolViz,
    flip: true,
    bg: "section",
  },
  {
    id: "pipeline",
    label: "Pipeline Integration",
    h2: "Maya, Houdini, Unreal Engine — 기존 툴 옆에 바로 연결됩니다",
    body: "파이프라인을 바꾸지 않아도 됩니다. FBX, OBJ, Alembic 포맷으로 직접 내보내고, Python API·REST API를 통한 자동화도 지원합니다.",
    Viz: PipelineViz,
    flip: false,
    bg: "base",
  },
  {
    id: "management",
    label: "Centralized Management",
    h2: "팀원·기기·라이선스를 한 화면에서 파악할 수 있습니다",
    body: "누가 어떤 기기에서 사용 중인지 관리자 화면에서 바로 확인됩니다. 권한 위임, 멀티 팀 운영, 사용량 추적까지 중앙화된 대시보드로 관리합니다.",
    Viz: CentralizedMgmtViz,
    flip: true,
    bg: "section",
  },
  {
    id: "scalability",
    label: "Scalability",
    h2: "팀이 10명이든 100명이든 같은 방식으로 운영됩니다",
    body: "규모가 커져도 워크플로우를 새로 짜지 않아도 됩니다. 소규모 팀에서 검증한 방식이 스튜디오 전체로 그대로 확장됩니다.",
    Viz: ScalabilityViz,
    flip: false,
    bg: "base",
  },
  {
    id: "support",
    label: "Technical Support",
    h2: "도입부터 운영까지 전담 기술 지원이 함께합니다",
    body: "팀 온보딩, 파이프라인 셋업, 기술 문의까지 전담 팀이 지원합니다. 도입 초기부터 안정적인 운영까지 함께합니다.",
    Viz: TechSupportViz,
    flip: true,
    bg: "section",
  },
];

// ─── Button styles ────────────────────────────────────────────────────────────

const accentBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 24px",
  borderRadius: RADIUS.PILL,
  backgroundColor: COLOR.ACCENT,
  color: COLOR.TEXT_INVERSE,
  textDecoration: "none",
  ...TYPOGRAPHY.STYLE.LABEL_1,
} as const;

const neutralBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 24px",
  borderRadius: RADIUS.PILL,
  border: `1px solid ${COLOR.BORDER_DEFAULT}`,
  backgroundColor: COLOR.BG_SURFACE,
  color: COLOR.TEXT_PRIMARY,
  textDecoration: "none",
  ...TYPOGRAPHY.STYLE.LABEL_1,
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

const EnterprisePage: FC = () => {
  return (
    <div
      className="enterprise_page_wrap"
      style={{ backgroundColor: COLOR.BG_BASE, minHeight: "100vh" }}
    >
      <MDNav />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="enterprise_hero_area"
        style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 24px 72px",
            textAlign: "center" as const,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: SPACING[6],
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              padding: "4px 12px",
              borderRadius: RADIUS.PILL,
              border: `1px solid ${COLOR.ACCENT_LIGHT}`,
              backgroundColor: COLOR.ACCENT_BG,
              color: COLOR.ACCENT,
              ...TYPOGRAPHY.STYLE.LABEL_2,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
            }}
          >
            Enterprise
          </div>

          <h1
            style={{
              ...TYPOGRAPHY.STYLE.H1,
              color: COLOR.TEXT_PRIMARY,
              margin: 0,
              maxWidth: 560,
            }}
          >
            스튜디오가 선택한
            <br />
            의상 제작 표준
          </h1>

          <p
            style={{
              ...TYPOGRAPHY.STYLE.BODY_1,
              color: COLOR.TEXT_MUTED,
              margin: 0,
              maxWidth: 500,
            }}
          >
            업계 주요 스튜디오가 프로덕션에서 사용하는 툴. 팀 단위 라이선스 관리부터
            파이프라인 통합까지, 제작 환경에 맞게 구성할 수 있습니다.
          </p>

          <div style={{ display: "flex", gap: SPACING[3] }}>
            <Link href="/contact" style={accentBtnStyle}>
              Talk to Sales
            </Link>
            <Link href="/plan" style={neutralBtnStyle}>
              플랜 보기
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6 Feature sections ───────────────────────────────────────────────── */}
      {SECTIONS.map((sec) => {
        const VizComponent = sec.Viz;
        return (
          <section
            key={sec.id}
            className={`enterprise_${sec.id}_area`}
            style={{
              backgroundColor: sec.bg === "section" ? COLOR.BG_SECTION : COLOR.BG_BASE,
              borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: "96px 24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: SPACING[16],
                alignItems: "center",
              }}
            >
              {sec.flip ? (
                <>
                  <TextBlock label={sec.label} h2={sec.h2} body={sec.body} />
                  <VizComponent />
                </>
              ) : (
                <>
                  <VizComponent />
                  <TextBlock label={sec.label} h2={sec.h2} body={sec.body} />
                </>
              )}
            </div>
          </section>
        );
      })}

      {/* ── Indie Banner ─────────────────────────────────────────────────────── */}
      <section
        className="enterprise_indie_area"
        style={{
          backgroundColor: COLOR.BG_BASE,
          borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px 96px",
          }}
        >
          <div
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.XL,
              padding: "48px 56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: SPACING[12],
              boxShadow: SHADOW.CARD,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: SPACING[4],
              }}
            >
              <p
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_2,
                  color: COLOR.ACCENT,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  margin: 0,
                }}
              >
                Indie Plan
              </p>
              <h3
                style={{
                  ...TYPOGRAPHY.STYLE.H3,
                  color: COLOR.TEXT_PRIMARY,
                  margin: 0,
                }}
              >
                소규모 스튜디오를 위한 특가 플랜
              </h3>
              <p
                style={{
                  ...TYPOGRAPHY.STYLE.BODY_2,
                  color: COLOR.TEXT_MUTED,
                  margin: 0,
                  maxWidth: 480,
                }}
              >
                연 매출 $500,000 이하 소규모 스튜디오라면, Enterprise 인증 후 Indie 플랜으로
                더 합리적인 가격에 이용할 수 있습니다. 최대 5카피까지 지원합니다.
              </p>
            </div>
            <Link href="/contact" style={{ ...neutralBtnStyle, flexShrink: 0 }}>
              Indie 플랜 문의하기
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section
        className="enterprise_cta_area"
        style={{
          backgroundColor: COLOR.BG_SECTION,
          borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "96px 24px",
            textAlign: "center" as const,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: SPACING[6],
          }}
        >
          <h2
            style={{
              ...TYPOGRAPHY.STYLE.H2,
              color: COLOR.TEXT_PRIMARY,
              margin: 0,
            }}
          >
            팀 규모에 맞는 플랜으로 시작하세요
          </h2>
          <p
            style={{
              ...TYPOGRAPHY.STYLE.BODY_1,
              color: COLOR.TEXT_MUTED,
              margin: 0,
              maxWidth: 440,
            }}
          >
            Enterprise 플랜은 문의를 통해 결정됩니다. 팀 규모와 파이프라인 요건을
            알려주시면 맞춤 견적을 보내드립니다.
          </p>
          <Link href="/contact" style={accentBtnStyle}>
            Talk to Sales
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer
        className="enterprise_footer_wrap"
        style={{
          borderTop: `1px solid ${COLOR.BORDER_DEFAULT}`,
          padding: "28px 24px",
          textAlign: "center" as const,
        }}
      >
        <p
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_2,
            color: COLOR.TEXT_DISABLED,
            margin: 0,
          }}
        >
          © 2024 CLO Virtual Fashion. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default EnterprisePage;
