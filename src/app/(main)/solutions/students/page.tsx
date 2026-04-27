import type { FC } from "react";
import Link from "next/link";
import MDNav from "@/components/solutions/MDNav";
import {
  StudioGridViz,
  CareerFlowViz,
  DiscountViz,
} from "@/components/solutions/MDInfographics";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG = "#0a0a0a";
const BG_SECTION = "#111111";
const TEXT = "#ffffff";
const TEXT_MUTED = "rgba(255,255,255,0.55)";
const ACCENT = "#f54e00";
const BORDER = "rgba(255,255,255,0.1)";
const font = "system-ui, -apple-system, sans-serif";

// ─── Primitives ───────────────────────────────────────────────────────────────
const OutlinePill: FC<{ href: string; children: string }> = ({ href, children }) => (
  <Link
    href={href}
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "10px 24px",
      borderRadius: 9999,
      border: `1px solid rgba(255,255,255,0.3)`,
      color: TEXT,
      textDecoration: "none",
      fontFamily: font,
      fontSize: 15,
      fontWeight: 400,
      letterSpacing: "-0.01em",
    }}
  >
    {children}
  </Link>
);

const AccentPill: FC<{ href: string; children: string }> = ({ href, children }) => (
  <Link
    href={href}
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "10px 24px",
      borderRadius: 9999,
      backgroundColor: ACCENT,
      color: "#ffffff",
      textDecoration: "none",
      fontFamily: font,
      fontSize: 15,
      fontWeight: 500,
      letterSpacing: "-0.01em",
    }}
  >
    {children}
  </Link>
);

const Section: FC<{ children: React.ReactNode; bg?: string; className?: string }> = ({
  children,
  bg = BG,
  className,
}) => (
  <section className={className} style={{ backgroundColor: bg, borderBottom: `1px solid ${BORDER}` }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 24px" }}>
      {children}
    </div>
  </section>
);

const Label: FC<{ children: string }> = ({ children }) => (
  <p style={{ fontFamily: font, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: ACCENT, margin: 0 }}>
    {children}
  </p>
);

const SectionH2: FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={{ fontFamily: font, fontSize: 40, fontWeight: 500, lineHeight: "52px", letterSpacing: "-0.03em", color: TEXT, margin: 0 }}>
    {children}
  </h2>
);

const Body: FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontFamily: font, fontSize: 16, lineHeight: 1.75, color: TEXT_MUTED, margin: 0 }}>
    {children}
  </p>
);

const FeaturePoint: FC<{ text: string }> = ({ text }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(245,78,0,0.12)", border: "1px solid rgba(245,78,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
      <svg width={8} height={8} viewBox="0 0 8 8">
        <path d="M1.5 4L3.5 6L6.5 2" stroke={ACCENT} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
    <p style={{ fontFamily: font, fontSize: 15, lineHeight: 1.6, color: TEXT_MUTED, margin: 0 }}>{text}</p>
  </div>
);

// ─── Plan Card ────────────────────────────────────────────────────────────────
const StudentPlanCard: FC = () => (
  <div
    className="student_plan_card_wrap"
    style={{
      background: "#141414",
      border: `1px solid rgba(245,78,0,0.2)`,
      borderRadius: 20,
      overflow: "hidden",
      maxWidth: 400,
      width: "100%",
    }}
  >
    {/* Header */}
    <div
      style={{
        padding: "32px 32px 24px",
        borderBottom: `1px solid rgba(255,255,255,0.07)`,
        background: "linear-gradient(180deg, rgba(245,78,0,0.05) 0%, transparent 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <p style={{ fontFamily: font, fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT, margin: "0 0 6px" }}>
            Students
          </p>
          <h3 style={{ fontFamily: font, fontSize: 22, fontWeight: 600, letterSpacing: "-0.04em", color: TEXT, margin: 0 }}>
            Student Plan
          </h3>
        </div>
        <div
          style={{
            background: "rgba(245,78,0,0.1)",
            border: "1px solid rgba(245,78,0,0.25)",
            borderRadius: 8,
            padding: "6px 10px",
            textAlign: "center",
          }}
        >
          <div style={{ color: ACCENT, fontFamily: font, fontSize: 18, fontWeight: 700, lineHeight: 1 }}>70%</div>
          <div style={{ color: ACCENT, fontFamily: font, fontSize: 10, letterSpacing: "0.04em", marginTop: 1 }}>OFF</div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: font, fontSize: 40, fontWeight: 600, letterSpacing: "-1.5px", color: TEXT, lineHeight: 1 }}>
          $99
        </span>
        <span style={{ fontFamily: font, fontSize: 15, color: TEXT_MUTED }}>/year</span>
        <span
          style={{
            fontFamily: font,
            fontSize: 14,
            color: "rgba(255,255,255,0.3)",
            textDecoration: "line-through",
            marginLeft: 4,
          }}
        >
          $280
        </span>
      </div>

      <p style={{ fontFamily: font, fontSize: 13, color: TEXT_MUTED, margin: "10px 0 0" }}>
        14일 무료 체험 후 자동으로 구독이 시작됩니다.
      </p>
    </div>

    {/* Features */}
    <div style={{ padding: "24px 32px" }}>
      {[
        "MD CONNECT 에셋 전체 접근",
        "실무 포맷 FBX / OBJ / Alembic 내보내기",
        "패턴 기반 물리 시뮬레이션 전체 기능",
        "클라우드 저장 및 프로젝트 관리",
      ].map((f) => (
        <FeaturePoint key={f} text={f} />
      ))}

      {/* Limit notice */}
      <div
        style={{
          background: "#1e1e1e",
          border: `1px solid rgba(255,255,255,0.08)`,
          borderRadius: 8,
          padding: "12px 14px",
          marginTop: 8,
          marginBottom: 24,
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
        <p style={{ fontFamily: font, fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>
          최대 <strong style={{ color: "rgba(255,255,255,0.65)" }}>2회</strong>까지 구매할 수 있습니다.
          (최대 2년간 학생 할인 적용)
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/verify/student"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "14px",
          borderRadius: 12,
          background: ACCENT,
          color: "#fff",
          textDecoration: "none",
          fontFamily: font,
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          marginBottom: 12,
        }}
      >
        Verify Student Status
      </Link>
      <Link
        href="/plan"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "14px",
          borderRadius: 12,
          background: "transparent",
          border: `1px solid rgba(255,255,255,0.12)`,
          color: TEXT_MUTED,
          textDecoration: "none",
          fontFamily: font,
          fontSize: 15,
          fontWeight: 400,
        }}
      >
        Compare all plans
      </Link>
    </div>

    {/* Verification note */}
    <div
      style={{
        padding: "14px 32px",
        borderTop: `1px solid rgba(255,255,255,0.06)`,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ fontSize: 14 }}>🎓</span>
      <span style={{ fontFamily: font, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
        학교 이메일 또는 재학증명서로 인증
      </span>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const StudentsPage: FC = () => {
  return (
    <div className="students_page_wrap" style={{ backgroundColor: BG, minHeight: "100vh", color: TEXT }}>
      <MDNav />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="students_hero_area"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(245,78,0,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "120px 24px 96px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 12px",
              borderRadius: 9999,
              border: `1px solid rgba(245,78,0,0.4)`,
              backgroundColor: "rgba(245,78,0,0.08)",
              color: ACCENT,
              fontFamily: font,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Students
          </div>

          <h1
            style={{
              fontFamily: font,
              fontSize: 60,
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              color: TEXT,
              margin: 0,
              maxWidth: 760,
            }}
          >
            지금 만드는 포트폴리오가
            <br />
            스튜디오 파이프라인 포맷과 같습니다
          </h1>

          <p
            style={{
              fontFamily: font,
              fontSize: 18,
              lineHeight: 1.65,
              color: TEXT_MUTED,
              margin: 0,
              maxWidth: 540,
            }}
          >
            AAA 스튜디오가 매일 쓰는 소프트웨어로 만든 결과물입니다.
            학생 포트폴리오가 실무에서 그대로 통합됩니다.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <OutlinePill href="/plan">View Plan</OutlinePill>
            <AccentPill href="/verify/student">Verify Student Status</AccentPill>
          </div>

          {/* Trust row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 40,
              paddingTop: 40,
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            <span style={{ fontFamily: font, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Trusted by professionals in</span>
            {["Game", "VFX", "Animation", "Fashion", "Film"].map((s) => (
              <span key={s} style={{ fontFamily: font, fontSize: 13, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Core 1: Industry Standard ─────────────────────────────────────── */}
      <Section bg={BG_SECTION} className="students_industry_area">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Label>Industry Standard</Label>
            <SectionH2>
              AAA 스튜디오가 프로덕션에서
              <br />
              매일 쓰는 바로 그 툴
            </SectionH2>
            <Body>
              지금 배우는 것이 이력서에 직접 올라갑니다. 대형 게임사·VFX 스튜디오 채용
              공고에 &ldquo;Marvelous Designer&rdquo;가 명시되어 있는 이유가 있습니다.
              학생 때 익힌 툴이 실무에서 그대로 쓰입니다.
            </Body>
            <Body>
              블록버스터 20편 이상의 의상 제작에 사용되었습니다. 이 툴을 쓴다는 것은
              검증된 파이프라인 위에 있다는 의미입니다.
            </Body>

            {/* Pull quote */}
            <div
              style={{
                padding: "20px 24px",
                background: "#181818",
                borderRadius: 10,
                border: `1px solid ${BORDER}`,
                borderLeft: `3px solid ${ACCENT}`,
              }}
            >
              <p style={{ fontFamily: font, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: "0 0 10px", fontStyle: "italic" }}>
                &ldquo;You need this program if you want to design 3D clothes at a professional&apos;s pace.&rdquo;
              </p>
              <div style={{ fontFamily: font, fontSize: 12, color: TEXT_MUTED }}>
                Joseph Drust — Senior Character Artist, Redstorm (Ubisoft)
              </div>
            </div>
          </div>

          <StudioGridViz />
        </div>
      </Section>

      {/* ── 3. Core 2: Career Connection ─────────────────────────────────────── */}
      <Section bg={BG} className="students_career_area">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <CareerFlowViz />

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Label>Career Connection</Label>
            <SectionH2>
              MD로 만든 결과물은 스튜디오가
              <br />
              요구하는 포맷과 같습니다
            </SectionH2>
            <Body>
              학생 때 완성한 의상이 실무 파이프라인에 그대로 통합됩니다. FBX, OBJ,
              Alembic — 스튜디오가 요구하는 포맷으로 바로 내보낼 수 있습니다.
            </Body>
            <Body>
              포트폴리오를 만드는 과정이 곧 실무 연습입니다. 패턴 기반 물리 시뮬레이션으로
              만든 의상은 스튜디오 리뷰에서 바로 검토될 수 있는 수준입니다.
            </Body>

            <div style={{ marginTop: 4 }}>
              <FeaturePoint text="FBX / OBJ / Alembic 실무 포맷으로 직접 내보내기" />
              <FeaturePoint text="패턴 기반 시뮬레이션 — 실제 의상처럼 움직이는 결과물" />
              <FeaturePoint text="Unreal / Maya / Blender 파이프라인 호환" />
              <FeaturePoint text="포트폴리오에 올라가는 순간 달라지는 이력서" />
            </div>
          </div>
        </div>
      </Section>

      {/* ── 4. Core 3: Discount + CONNECT ────────────────────────────────────── */}
      <Section bg={BG_SECTION} className="students_discount_area">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Label>Student Discount</Label>
            <SectionH2>
              학교 인증 한 번으로
              <br />
              최대 70% 할인된 가격에 시작합니다
            </SectionH2>
            <Body>
              MD CONNECT 에셋으로 첫날부터 결과물이 나옵니다.
              학교 이메일 또는 재학증명서 인증 한 번으로 학생 할인이 적용됩니다.
            </Body>
            <Body>
              14일 무료 체험 후 자동으로 구독이 시작됩니다. 학생 플랜은
              최대 2회 구매할 수 있습니다. (최대 2년간 학생 할인 적용)
            </Body>

            <div style={{ marginTop: 4 }}>
              <FeaturePoint text="학교 이메일 또는 재학증명서로 간단 인증" />
              <FeaturePoint text="MD CONNECT 에셋 전체 접근 — 첫날부터 결과물" />
              <FeaturePoint text="14일 무료 체험 → 종료 후 자동 구독 시작" />
              <FeaturePoint text="최대 2회 구매 제한 (2년간 적용)" />
            </div>
          </div>

          <DiscountViz />
        </div>
      </Section>

      {/* ── 5. Plan Card + CTA ───────────────────────────────────────────────── */}
      <section
        className="students_plan_area"
        style={{ backgroundColor: BG, borderBottom: `1px solid ${BORDER}` }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "96px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 72,
            alignItems: "center",
          }}
        >
          {/* Left: CTA text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h2
              style={{
                fontFamily: font,
                fontSize: 48,
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-1.5px",
                color: TEXT,
                margin: 0,
              }}
            >
              지금 시작하면
              <br />
              이미 한 발 앞서 있습니다
            </h2>
            <Body>
              학생 때 배운 툴이 졸업 후 가장 강력한 무기가 됩니다.
              MD를 쓴다는 것은 AAA 스튜디오와 같은 툴로 만든다는 의미입니다.
            </Body>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
              {[
                { step: "01", text: "학교 이메일 또는 재학증명서로 인증" },
                { step: "02", text: "14일 무료 체험 시작" },
                { step: "03", text: "MD CONNECT 에셋으로 첫 프로젝트 시작" },
              ].map((s) => (
                <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: `1px solid rgba(245,78,0,0.3)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: ACCENT, fontFamily: font, fontSize: 11, fontWeight: 600 }}>{s.step}</span>
                  </div>
                  <span style={{ fontFamily: font, fontSize: 15, color: TEXT_MUTED }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Plan card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <StudentPlanCard />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer
        className="students_footer_wrap"
        style={{
          backgroundColor: BG,
          borderTop: `1px solid ${BORDER}`,
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontFamily: font, fontSize: 13, color: TEXT_MUTED, margin: 0 }}>
          © 2024 CLO Virtual Fashion. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default StudentsPage;
