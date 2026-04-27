import type { Meta, StoryObj } from "@storybook/react";
import { COLOR, RADIUS, SHADOW, SPACING, TYPOGRAPHY, BUTTON, DURATION } from "@/lib/design-tokens";
import { Button } from "./Button";
import { Badge } from "./Badge";
import Toggle from "./Toggle";
import { Input } from "./Input";
import { useState } from "react";

// ─── Shared primitives ────────────────────────────────────────────────────────

function RuleTag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: RADIUS.PILL,
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        backgroundColor: COLOR.ACCENT_MUTED,
        color: COLOR.ACCENT,
        fontFamily: "monospace",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function DoBox({
  label,
  children,
  type = "do",
}: {
  label: string;
  children: React.ReactNode;
  type?: "do" | "dont";
}) {
  const isDo = type === "do";
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: isDo ? COLOR.POSITIVE_MUTED : COLOR.NEGATIVE_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: isDo ? COLOR.POSITIVE : COLOR.NEGATIVE,
            flexShrink: 0,
          }}
        >
          {isDo ? "✓" : "✕"}
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: isDo ? COLOR.POSITIVE : COLOR.NEGATIVE,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          padding: "14px 16px",
          borderRadius: RADIUS.LG,
          border: `1.5px solid ${isDo ? COLOR.POSITIVE_MUTED : COLOR.NEGATIVE_BG}`,
          backgroundColor: isDo ? "rgba(2,162,98,0.03)" : "rgba(240,68,56,0.03)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2
        style={{
          ...TYPOGRAPHY.STYLE.H3,
          color: COLOR.TEXT_PRIMARY,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            ...TYPOGRAPHY.STYLE.BODY_2,
            color: COLOR.TEXT_MUTED,
            margin: "4px 0 0",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: "100%",
        height: 1,
        backgroundColor: COLOR.BORDER_DEFAULT,
        margin: "32px 0",
      }}
    />
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        backgroundColor: COLOR.BG_BASE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        padding: "20px",
        boxShadow: SHADOW.CARD,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section: Button Hierarchy ────────────────────────────────────────────────

function ButtonHierarchySection() {
  return (
    <div>
      <SectionTitle
        title="Button — 계층 규칙"
        sub="한 화면에서 solid는 반드시 1개. 역할에 맞는 variant를 선택한다."
      />

      {/* Variant table */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr 1fr 140px",
          gap: "0",
          border: `1px solid ${COLOR.BORDER_DEFAULT}`,
          borderRadius: RADIUS.LG,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {/* Header */}
        {["Variant", "언제 쓰는가", "금지", "최대 개수"].map((h) => (
          <div
            key={h}
            style={{
              padding: "10px 14px",
              backgroundColor: COLOR.BG_SURFACE,
              borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
              fontSize: "11px",
              fontWeight: 600,
              color: COLOR.TEXT_MUTED,
              letterSpacing: "0.02em",
            }}
          >
            {h}
          </div>
        ))}

        {/* Rows */}
        {[
          {
            variant: "solid" as const,
            label: "solid",
            when: "해당 화면 최상위 CTA (공개하기, 제출하기)",
            no: "섹션별 반복, 보조 액션",
            max: "1개",
            maxColor: COLOR.NEGATIVE,
          },
          {
            variant: "primary" as const,
            label: "primary",
            when: "기본 확인·저장 액션",
            no: "위험 액션, solid와 동일 섹션 내 중복",
            max: "2–3개",
            maxColor: COLOR.TEXT_SECONDARY,
          },
          {
            variant: "neutral" as const,
            label: "neutral",
            when: "취소, 닫기, 뒤로가기",
            no: "단독 메인 CTA",
            max: "제한 없음",
            maxColor: COLOR.TEXT_MUTED,
          },
          {
            variant: "danger" as const,
            label: "danger",
            when: "삭제·초기화 등 되돌릴 수 없는 액션",
            no: "일반 확인 버튼",
            max: "1개",
            maxColor: COLOR.NEGATIVE,
          },
          {
            variant: "ghost" as const,
            label: "ghost",
            when: "카드 내부 인라인 액션, 컨텍스트 메뉴",
            no: "페이지 수준 CTA",
            max: "제한 없음",
            maxColor: COLOR.TEXT_MUTED,
          },
        ].map((row, i) => {
          const isLast = i === 4;
          const cellBase: React.CSSProperties = {
            padding: "12px 14px",
            borderBottom: isLast ? "none" : `1px solid ${COLOR.BORDER_DEFAULT}`,
            display: "flex",
            alignItems: "center",
          };
          return [
            <div key={`${row.label}-btn`} style={cellBase}>
              <Button variant={row.variant} size="sm">
                {row.label}
              </Button>
            </div>,
            <div
              key={`${row.label}-when`}
              style={{ ...cellBase, fontSize: "12px", color: COLOR.TEXT_SECONDARY }}
            >
              {row.when}
            </div>,
            <div
              key={`${row.label}-no`}
              style={{ ...cellBase, fontSize: "12px", color: COLOR.TEXT_MUTED }}
            >
              {row.no}
            </div>,
            <div
              key={`${row.label}-max`}
              style={{
                ...cellBase,
                fontSize: "12px",
                fontWeight: 600,
                color: row.maxColor,
              }}
            >
              {row.max}
            </div>,
          ];
        })}
      </div>

      {/* Do/Don't */}
      <div style={{ display: "flex", gap: 16 }}>
        <DoBox label="올바른 계층" type="do">
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED, margin: "0 0 10px" }}>
            모달 하단 — solid 1개 + neutral 1개
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="neutral" size="md">
              취소
            </Button>
            <Button variant="solid" size="md">
              공개하기
            </Button>
          </div>
        </DoBox>
        <DoBox label="잘못된 계층" type="dont">
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED, margin: "0 0 10px" }}>
            solid가 2개 — 어느 것이 우선인지 알 수 없음
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="solid" size="md">
              저장하기
            </Button>
            <Button variant="solid" size="md">
              공개하기
            </Button>
          </div>
        </DoBox>
      </div>
    </div>
  );
}

// ─── Section: Weight ──────────────────────────────────────────────────────────

function WeightSection() {
  return (
    <div>
      <SectionTitle
        title="Typography — Weight 결정 트리"
        sub="weight는 꾸밈이 아니라 계층이다. 화면에서 Bold가 3개 이상이면 모두 평범해 보인다."
      />

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {/* Decision tree */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: COLOR.BG_SURFACE,
            borderRadius: RADIUS.LG,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
          }}
        >
          <p style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED, margin: "0 0 14px" }}>
            결정 트리
          </p>
          {[
            { q: "화면 내 단 하나의 최상위 숫자·히어로인가?", a: "700 Bold", color: COLOR.ACCENT },
            {
              q: "읽지 않아도 섹션이 구분되어야 하는 레이블인가?",
              a: "600 SemiBold",
              color: COLOR.POSITIVE,
            },
            { q: "배경(색상·border)이 있는 UI 컨트롤인가?", a: "500 Medium", color: COLOR.WARNING },
            { q: "위 모두 아님 — 본문·설명·입력값", a: "400 Regular", color: COLOR.TEXT_MUTED },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                paddingBottom: i < 3 ? 12 : 0,
                marginBottom: i < 3 ? 12 : 0,
                borderBottom: i < 3 ? `1px solid ${COLOR.BORDER_DEFAULT}` : "none",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: COLOR.BG_SECTION,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: COLOR.TEXT_MUTED,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    ...TYPOGRAPHY.STYLE.BODY_2,
                    color: COLOR.TEXT_SECONDARY,
                    margin: "0 0 3px",
                  }}
                >
                  {item.q}
                </p>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: item.color,
                    fontFamily: "monospace",
                  }}
                >
                  → {item.a}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live example */}
        <Card style={{ flex: 1 }}>
          <p style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED, margin: "0 0 14px" }}>
            실제 적용 예시
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "16px",
              backgroundColor: COLOR.BG_SURFACE,
              borderRadius: RADIUS.LG,
            }}
          >
            <span style={{ ...TYPOGRAPHY.STYLE.DISPLAY, color: COLOR.TEXT_PRIMARY }}>
              12,400
              <span style={{ ...TYPOGRAPHY.STYLE.TITLE_1, color: COLOR.TEXT_MUTED }}> 포인트</span>
            </span>
            <span style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}>
              이번 달 획득
            </span>
            <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              설문 3건 · 폴 5건 참여
            </span>
            <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
              <RuleTag label="DISPLAY / 700" />
              <RuleTag label="TITLE_2 / 600" />
              <RuleTag label="BODY_2 / 400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Do/Don't */}
      <div style={{ display: "flex", gap: 16 }}>
        <DoBox label="계층 명확 (Bold 1개)" type="do">
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: COLOR.BG_SURFACE,
              borderRadius: RADIUS.MD,
              width: "100%",
            }}
          >
            <p style={{ ...TYPOGRAPHY.STYLE.H2, color: COLOR.TEXT_PRIMARY, margin: "0 0 4px" }}>
              마이페이지
            </p>
            <p
              style={{
                ...TYPOGRAPHY.STYLE.TITLE_2,
                color: COLOR.TEXT_SECONDARY,
                margin: "0 0 2px",
              }}
            >
              내 설문 관리
            </p>
            <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED, margin: 0 }}>
              총 8개 설문 · 응답 127건
            </p>
          </div>
        </DoBox>
        <DoBox label="Bold 남용 — 계층 없음" type="dont">
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: COLOR.BG_SURFACE,
              borderRadius: RADIUS.MD,
              width: "100%",
            }}
          >
            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: COLOR.TEXT_PRIMARY,
                margin: "0 0 4px",
              }}
            >
              마이페이지
            </p>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: COLOR.TEXT_SECONDARY,
                margin: "0 0 2px",
              }}
            >
              내 설문 관리
            </p>
            <p style={{ fontSize: "13px", fontWeight: 700, color: COLOR.TEXT_MUTED, margin: 0 }}>
              총 8개 설문 · 응답 127건
            </p>
          </div>
        </DoBox>
      </div>
    </div>
  );
}

// ─── Section: Spacing ─────────────────────────────────────────────────────────

function SpacingSection() {
  return (
    <div>
      <SectionTitle
        title="Spacing — 레벨 4단계"
        sub="Page → Section → Component → Element. 레벨을 건너뛰지 않는다."
      />

      <div style={{ display: "flex", gap: 16 }}>
        {/* Levels diagram */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "#f8faff",
            border: `2px dashed ${COLOR.ACCENT_MUTED}`,
            borderRadius: RADIUS.LG,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -10,
              left: 16,
              backgroundColor: "#f8faff",
              padding: "0 6px",
              fontSize: "10px",
              fontWeight: 700,
              color: COLOR.ACCENT,
              letterSpacing: "0.04em",
            }}
          >
            PAGE 24px
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {[
              {
                label: "SECTION 32px",
                bg: "rgba(49,130,246,0.06)",
                border: `1px dashed ${COLOR.ACCENT}`,
              },
              {
                label: "SECTION 32px",
                bg: "rgba(49,130,246,0.06)",
                border: `1px dashed ${COLOR.ACCENT}`,
              },
            ].map((sec, si) => (
              <div
                key={si}
                style={{
                  padding: "12px",
                  backgroundColor: sec.bg,
                  border: sec.border,
                  borderRadius: RADIUS.MD,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -9,
                    left: 10,
                    backgroundColor: COLOR.BG_BASE,
                    padding: "0 5px",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: COLOR.ACCENT,
                  }}
                >
                  {sec.label}
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[0, 1].map((ci) => (
                    <div
                      key={ci}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: COLOR.BG_BASE,
                        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
                        borderRadius: RADIUS.MD,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: -8,
                          left: 8,
                          backgroundColor: COLOR.BG_BASE,
                          padding: "0 4px",
                          fontSize: "8px",
                          fontWeight: 700,
                          color: COLOR.TEXT_MUTED,
                        }}
                      >
                        COMPONENT 20px
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div
                          style={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: COLOR.BG_SECTION,
                          }}
                        />
                        <div
                          style={{
                            height: 6,
                            width: "70%",
                            borderRadius: 4,
                            backgroundColor: COLOR.BG_SECTION,
                          }}
                        />
                        <div
                          style={{
                            marginTop: 2,
                            fontSize: "8px",
                            color: COLOR.TEXT_MUTED,
                            display: "flex",
                            gap: 4,
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: COLOR.ACCENT_MUTED,
                              border: `1px solid ${COLOR.ACCENT}`,
                            }}
                          />
                          ELEMENT 8px
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reference table */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.LG,
              overflow: "hidden",
            }}
          >
            {[
              { situation: "페이지 좌우 여백 (웹)", value: "24px", token: "SPACING[6]" },
              { situation: "페이지 좌우 여백 (모바일)", value: "16px", token: "SPACING[4]" },
              { situation: "섹션 간 gap", value: "32px", token: "SPACING[8]" },
              { situation: "카드 내부 패딩 (Web)", value: "20px", token: "SPACING[5]" },
              { situation: "카드 내부 패딩 (Builder)", value: "12px", token: "—" },
              { situation: "카드 간 gap", value: "12–16px", token: "SPACING[3/4]" },
              { situation: "폼 필드 간 gap", value: "16px", token: "SPACING[4]" },
              { situation: "레이블 → 인풋", value: "8px", token: "SPACING[2]" },
              { situation: "아이콘 → 텍스트", value: "6px", token: "—" },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 100px",
                  borderBottom: i < 8 ? `1px solid ${COLOR.BORDER_DEFAULT}` : "none",
                }}
              >
                <div
                  style={{
                    padding: "9px 14px",
                    fontSize: "12px",
                    color: COLOR.TEXT_SECONDARY,
                    backgroundColor: i % 2 === 0 ? COLOR.BG_BASE : COLOR.BG_SURFACE,
                  }}
                >
                  {row.situation}
                </div>
                <div
                  style={{
                    padding: "9px 14px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: COLOR.ACCENT,
                    backgroundColor: i % 2 === 0 ? COLOR.BG_BASE : COLOR.BG_SURFACE,
                  }}
                >
                  {row.value}
                </div>
                <div
                  style={{
                    padding: "9px 14px",
                    fontSize: "11px",
                    color: COLOR.TEXT_MUTED,
                    fontFamily: "monospace",
                    backgroundColor: i % 2 === 0 ? COLOR.BG_BASE : COLOR.BG_SURFACE,
                  }}
                >
                  {row.token}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Color Semantics ─────────────────────────────────────────────────

function ColorSemanticsSection() {
  return (
    <div>
      <SectionTitle
        title="Color — Semantic 규칙"
        sub="색상은 역할을 전달한다. 꾸밈용으로 쓰지 않는다."
      />

      {/* Color roles */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          {
            token: "ACCENT",
            value: COLOR.ACCENT,
            bg: COLOR.ACCENT_MUTED,
            label: "인터랙티브·진행 중·선택됨",
            example: "CTA 버튼, 포커스 링, 링크",
            no: "단순 강조",
          },
          {
            token: "POSITIVE",
            value: COLOR.POSITIVE,
            bg: COLOR.POSITIVE_MUTED,
            label: "성공·완료·수익·증가",
            example: "완료 뱃지, 수익 숫자, 공개 상태",
            no: "경고성 메시지",
          },
          {
            token: "NEGATIVE",
            value: COLOR.NEGATIVE,
            bg: COLOR.NEGATIVE_BG,
            label: "오류·삭제·위험 액션",
            example: "에러 메시지, 삭제 버튼",
            no: "단순 강조용 빨강",
          },
          {
            token: "WARNING",
            value: COLOR.WARNING,
            bg: COLOR.WARNING_MUTED,
            label: "주의·만료 예정·보관됨",
            example: "아카이브 뱃지, 기간 만료",
            no: "에러 대체",
          },
        ].map((c) => (
          <div
            key={c.token}
            style={{
              flex: "1 1 200px",
              padding: "16px",
              backgroundColor: COLOR.BG_BASE,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.LG,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: RADIUS.MD,
                  backgroundColor: c.bg,
                  border: `2px solid ${c.value}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: c.value,
                  }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: c.value,
                    margin: 0,
                    fontFamily: "monospace",
                  }}
                >
                  COLOR.{c.token}
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    color: COLOR.TEXT_MUTED,
                    margin: 0,
                    fontFamily: "monospace",
                  }}
                >
                  {c.value}
                </p>
              </div>
            </div>
            <p
              style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_PRIMARY, margin: "0 0 4px" }}
            >
              {c.label}
            </p>
            <p style={{ fontSize: "11px", color: COLOR.POSITIVE, margin: "0 0 2px" }}>
              ✓ {c.example}
            </p>
            <p style={{ fontSize: "11px", color: COLOR.NEGATIVE, margin: 0 }}>✕ {c.no}</p>
          </div>
        ))}
      </div>

      {/* Color-only meaning: Do/Don't */}
      <div style={{ display: "flex", gap: 16 }}>
        <DoBox label="색상 + 텍스트 병행" type="do">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 12px",
              backgroundColor: COLOR.NEGATIVE_BG,
              borderRadius: RADIUS.MD,
              width: "100%",
            }}
          >
            <span style={{ fontSize: 14 }}>⚠</span>
            <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.NEGATIVE }}>
              이메일 형식이 올바르지 않습니다
            </span>
          </div>
        </DoBox>
        <DoBox label="색상만으로 의미 전달" type="dont">
          <div style={{ padding: "10px 12px", width: "100%" }}>
            <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.NEGATIVE }}>
              이메일 형식이 올바르지 않습니다
            </span>
            <p style={{ fontSize: "10px", color: COLOR.TEXT_MUTED, margin: "6px 0 0" }}>
              색맹 사용자는 빨간색을 인식 못할 수 있음
            </p>
          </div>
        </DoBox>
      </div>
    </div>
  );
}

// ─── Section: Component Context ───────────────────────────────────────────────

function ContextSection() {
  const [toggleOn, setToggleOn] = useState(true);

  return (
    <div>
      <SectionTitle
        title="Context — Web vs Builder"
        sub="동일한 정보도 컨텍스트에 따라 다른 밀도로 표시한다."
      />

      <div style={{ display: "flex", gap: 16 }}>
        {/* Web context */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <RuleTag label="Web Service" />
            <span style={{ fontSize: "11px", color: COLOR.TEXT_MUTED }}>
              comfortable · 16–24px 기반
            </span>
          </div>
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h3
                    style={{
                      ...TYPOGRAPHY.STYLE.TITLE_1,
                      color: COLOR.TEXT_PRIMARY,
                      margin: "0 0 4px",
                    }}
                  >
                    UX 리서치 설문
                  </h3>
                  <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED, margin: 0 }}>
                    5분 소요 · 100 포인트 지급
                  </p>
                </div>
                <Badge status="published" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_SECONDARY }}>
                  이름
                </label>
                <Input placeholder="홍길동" />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button variant="neutral" size="lg">
                  취소
                </Button>
                <Button variant="solid" size="lg">
                  제출하기
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Builder context */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <RuleTag label="Builder" />
            <span style={{ fontSize: "11px", color: COLOR.TEXT_MUTED }}>
              compact · 10–12px 기반 · TYPOGRAPHY 금지
            </span>
          </div>
          <div
            style={{
              backgroundColor: COLOR.BG_BASE,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.LG,
              padding: "12px",
            }}
          >
            {/* Question card (builder style) */}
            <div
              style={{
                backgroundColor: COLOR.BG_SURFACE,
                borderRadius: RADIUS.MD,
                padding: "10px 12px",
                marginBottom: 8,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: "11px", fontWeight: 600, color: COLOR.TEXT_MUTED }}>
                  Q1 · 주관식
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: COLOR.ACCENT,
                    backgroundColor: COLOR.ACCENT_MUTED,
                    padding: "2px 6px",
                    borderRadius: RADIUS.PILL,
                    fontWeight: 600,
                  }}
                >
                  필수
                </span>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: COLOR.TEXT_PRIMARY }}>
                이름을 입력해 주세요
              </span>
            </div>

            {/* Settings row (builder style) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: "10px 12px",
                backgroundColor: COLOR.BG_SECTION,
                borderRadius: RADIUS.MD,
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: COLOR.TEXT_DISABLED,
                  letterSpacing: "0",
                }}
              >
                설정
              </span>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: "12px", color: COLOR.TEXT_SECONDARY }}>필수 응답</span>
                <Toggle checked={toggleOn} onChange={setToggleOn} />
              </div>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: "12px", color: COLOR.TEXT_SECONDARY }}>최대 글자 수</span>
                <span style={{ fontSize: "12px", fontWeight: 500, color: COLOR.ACCENT }}>
                  200자
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Elevation ───────────────────────────────────────────────────────

function ElevationSection() {
  return (
    <div>
      <SectionTitle
        title="Elevation — Shadow 레이어"
        sub="레이어 높이와 shadow는 1:1 대응이다. 같은 레이어에 두 가지 shadow를 쓰지 않는다."
      />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {[
          {
            label: "SHADOW.CARD",
            value: SHADOW.CARD,
            when: "카드 기본 (resting)",
            bg: COLOR.BG_SURFACE,
          },
          {
            label: "SHADOW.CARD_HOVER",
            value: SHADOW.CARD_HOVER,
            when: "카드 hover (lifted)",
            bg: COLOR.BG_SURFACE,
          },
          {
            label: "SHADOW.DROPDOWN",
            value: SHADOW.DROPDOWN,
            when: "드롭다운·팝오버",
            bg: COLOR.BG_BASE,
          },
          {
            label: "SHADOW.MODAL",
            value: SHADOW.MODAL,
            when: "모달·다이얼로그",
            bg: COLOR.BG_BASE,
          },
          {
            label: "SHADOW.AMBIENT",
            value: SHADOW.AMBIENT,
            when: "GNB·플로팅 요소",
            bg: COLOR.BG_BASE,
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: "1 1 180px",
              padding: "20px 16px",
              backgroundColor: s.bg,
              borderRadius: RADIUS.LG,
              boxShadow: s.value,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: COLOR.TEXT_PRIMARY,
                fontFamily: "monospace",
              }}
            >
              {s.label}
            </span>
            <span style={{ fontSize: "11px", color: COLOR.TEXT_MUTED }}>{s.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function DesignSystemRulesPage() {
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Wanted Sans", "Apple SD Gothic Neo", sans-serif',
        padding: "48px 40px",
        maxWidth: 1100,
        margin: "0 auto",
        backgroundColor: COLOR.BG_SURFACE,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h1
            style={{
              ...TYPOGRAPHY.STYLE.H1,
              color: COLOR.TEXT_PRIMARY,
              margin: 0,
            }}
          >
            OPINION Design Rules
          </h1>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: COLOR.TEXT_INVERSE,
              backgroundColor: COLOR.ACCENT,
              padding: "2px 8px",
              borderRadius: RADIUS.PILL,
            }}
          >
            v2.0
          </span>
        </div>
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED, margin: 0 }}>
          "무엇을 쓰는가"가 아니라{" "}
          <strong style={{ color: COLOR.TEXT_PRIMARY }}>"언제 무엇을 왜 쓰는가"</strong>를 정의한다.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {["계층 (Hierarchy)", "의미 (Semantics)", "밀도 (Density)"].map((p) => (
            <span
              key={p}
              style={{
                padding: "4px 12px",
                borderRadius: RADIUS.PILL,
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: COLOR.BG_BASE,
                color: COLOR.TEXT_SECONDARY,
                border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Sections */}
      <Card style={{ marginBottom: 16 }}>
        <ButtonHierarchySection />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <WeightSection />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <SpacingSection />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <ColorSemanticsSection />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <ContextSection />
      </Card>

      <Card>
        <ElevationSection />
      </Card>
    </div>
  );
}

// ─── Story config ─────────────────────────────────────────────────────────────

const meta: Meta = {
  title: "Design System/Rules Overview",
  component: DesignSystemRulesPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "OPINION 디자인 시스템 규칙 개요. 컴포넌트 용도, weight 결정 트리, 간격 레벨, 색상 의미, 컨텍스트 분리, elevation 시스템을 시각적으로 확인한다.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const RulesOverview: Story = {};
