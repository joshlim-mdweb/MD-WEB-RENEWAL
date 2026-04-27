import { type FC } from "react";
import { COLOR, TYPOGRAPHY, RADIUS, SPACING, SHADOW } from "@/lib/design-tokens";

// ─── 1. IndustryStandardViz ───────────────────────────────────────────────────
// MD logo center + category tag orbit + Academy Award badge (light theme)
export const IndustryStandardViz: FC = () => {
  const studios = [
    { name: "AAA Game Studio", x: 60, y: 48 },
    { name: "VFX House", x: 500, y: 40 },
    { name: "Animation Studio", x: 575, y: 165 },
    { name: "Fashion Brand", x: 500, y: 280 },
    { name: "Film Production", x: 30, y: 280 },
    { name: "Indie Studio", x: 22, y: 155 },
  ];
  const cx = 320;
  const cy = 170;

  return (
    <div
      style={{
        position: "relative",
        height: 340,
        backgroundColor: COLOR.BG_SURFACE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        overflow: "hidden",
      }}
    >
      {/* SVG overlay — connection lines and orbit rings */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 640 340"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Orbit rings */}
        <circle
          cx={cx}
          cy={cy}
          r={140}
          fill="none"
          style={{ stroke: COLOR.BORDER_DEFAULT }}
          strokeWidth={1}
          opacity={0.5}
        />
        <circle
          cx={cx}
          cy={cy}
          r={80}
          fill="none"
          style={{ stroke: COLOR.BORDER_DEFAULT }}
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Connection lines */}
        {studios.map((s) => {
          const tx = s.x + s.name.length * 3.5;
          const ty = s.y + 14;
          return (
            <line
              key={s.name}
              x1={cx}
              y1={cy}
              x2={tx}
              y2={ty}
              style={{ stroke: COLOR.BORDER_STRONG }}
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.6}
            />
          );
        })}
      </svg>

      {/* Studio tags */}
      {studios.map((s) => (
        <div
          key={s.name}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            backgroundColor: COLOR.BG_SECTION,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            borderRadius: RADIUS.SM,
            padding: "5px 10px",
            whiteSpace: "nowrap",
            ...TYPOGRAPHY.STYLE.LABEL_2,
            color: COLOR.TEXT_MUTED,
          }}
        >
          {s.name}
        </div>
      ))}

      {/* Center MD badge */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: COLOR.BG_SURFACE,
          border: `1px solid ${COLOR.ACCENT}`,
          borderRadius: RADIUS.MD,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 2,
          boxShadow: SHADOW.CARD_HOVER,
        }}
      >
        <span style={{ fontSize: 18 }}>🐝</span>
        <span
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            color: COLOR.TEXT_PRIMARY,
          }}
        >
          Marvelous Designer
        </span>
      </div>

      {/* Academy Award badge */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          backgroundColor: COLOR.BG_SECTION,
          border: `1px solid ${COLOR.BORDER_DEFAULT}`,
          borderRadius: RADIUS.SM,
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 14 }}>🏆</span>
        <span
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_2,
            color: COLOR.TEXT_MUTED,
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
          }}
        >
          Academy Award 2024
        </span>
      </div>
    </div>
  );
};

// ─── 2. UserpoolViz ───────────────────────────────────────────────────────────
// Team member table UI mockup (light theme)
export const UserpoolViz: FC = () => {
  const members = [
    { name: "Alex Chen", role: "Character Artist", project: "Project Orion", active: true },
    { name: "Sarah Kim", role: "VFX Artist", project: "Project Nova", active: true },
    { name: "Tom Walsh", role: "Animator", project: "—", active: false },
    { name: "Mia Park", role: "3D Generalist", project: "Project Orion", active: true },
    { name: "James Li", role: "Pipeline TD", project: "—", active: false },
  ];

  return (
    <div
      style={{
        backgroundColor: COLOR.BG_SURFACE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_PRIMARY }}>
          Userpool · Studio Alpha
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#febc2e" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#28c840" }} />
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.2fr 80px",
          padding: "8px 20px",
          borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
          gap: 12,
        }}
      >
        {["Member", "Role", "Project", "License"].map((h) => (
          <span
            key={h}
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_2,
              color: COLOR.TEXT_DISABLED,
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {members.map((m, i) => (
        <div
          key={m.name}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1.2fr 80px",
            padding: "10px 20px",
            gap: 12,
            borderBottom: i < members.length - 1 ? `1px solid ${COLOR.BORDER_DEFAULT}` : "none",
            alignItems: "center",
          }}
        >
          <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_PRIMARY }}>{m.name}</span>
          <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>{m.role}</span>
          <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>{m.project}</span>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              borderRadius: RADIUS.XS,
              backgroundColor: COLOR.BG_SECTION,
              border: m.active
                ? `1px solid ${COLOR.ACCENT}`
                : `1px solid ${COLOR.BORDER_DEFAULT}`,
              width: "fit-content",
              opacity: m.active ? 1 : undefined,
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: m.active ? COLOR.ACCENT : COLOR.TEXT_DISABLED,
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                color: m.active ? COLOR.ACCENT : COLOR.TEXT_MUTED,
              }}
            >
              {m.active ? "Active" : "Open"}
            </span>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          padding: "10px 20px",
          borderTop: `1px solid ${COLOR.BORDER_DEFAULT}`,
          display: "flex",
          gap: 20,
        }}
      >
        {[
          { label: "Total seats", value: "5" },
          { label: "Active", value: "3" },
          { label: "Available", value: "2" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>{s.label}</span>
            <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_PRIMARY, fontWeight: "600" }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── 3. PipelineViz ───────────────────────────────────────────────────────────
// DCC tools → MD → Output node graph (light theme)
export const PipelineViz: FC = () => {
  const tools = [
    { name: "Maya", icon: "M", x: 30, y: 60 },
    { name: "Houdini", icon: "H", x: 30, y: 130 },
    { name: "Unreal", icon: "U", x: 30, y: 200 },
    { name: "Blender", icon: "B", x: 30, y: 270 },
  ];

  // Each tool node: right edge x = 30 + 80 = 110, cy = y + 20
  // MD left edge x = 268, cy = 170
  // dx = (268 - 110) * 0.45 ≈ 71

  return (
    <div
      style={{
        position: "relative",
        height: 340,
        backgroundColor: COLOR.BG_SURFACE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        overflow: "hidden",
      }}
    >
      {/* SVG overlay */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 560 340"
      >
        {/* DCC → MD curves */}
        {tools.map((t) => {
          const fromX = 110;
          const fromY = t.y + 20;
          const toX = 268;
          const toY = 170;
          const dx = (toX - fromX) * 0.45;
          return (
            <path
              key={t.name}
              d={`M ${fromX} ${fromY} C ${fromX + dx} ${fromY} ${toX - dx} ${toY} ${toX} ${toY}`}
              fill="none"
              style={{ stroke: COLOR.BORDER_STRONG }}
              strokeWidth={1}
              strokeDasharray="5 4"
            />
          );
        })}

        {/* MD → Output */}
        <path
          d="M 372 170 L 440 170"
          fill="none"
          style={{ stroke: COLOR.ACCENT }}
          strokeWidth={1.5}
        />
        {/* Arrow */}
        <polygon
          points="448,170 440,166 440,174"
          style={{ fill: COLOR.ACCENT }}
        />
      </svg>

      {/* DCC tool nodes */}
      {tools.map((t) => (
        <div
          key={t.name}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            width: 80,
            height: 40,
            backgroundColor: COLOR.BG_SECTION,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            borderRadius: RADIUS.SM,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 10px",
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              backgroundColor: COLOR.BG_SURFACE,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.XS,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLOR.TEXT_MUTED,
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            {t.icon}
          </span>
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED, whiteSpace: "nowrap" as const }}>
            {t.name}
          </span>
        </div>
      ))}

      {/* MD center node */}
      <div
        style={{
          position: "absolute",
          left: 268,
          top: 142,
          width: 104,
          height: 56,
          backgroundColor: COLOR.BG_SURFACE,
          border: `1px solid ${COLOR.ACCENT}`,
          borderRadius: RADIUS.MD,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          boxShadow: SHADOW.CARD,
        }}
      >
        <span style={{ fontSize: 14 }}>🐝</span>
        <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_PRIMARY }}>
          Marvelous Designer
        </span>
      </div>

      {/* Output node */}
      <div
        style={{
          position: "absolute",
          left: 450,
          top: 150,
          backgroundColor: COLOR.BG_SECTION,
          border: `1px solid ${COLOR.BORDER_DEFAULT}`,
          borderRadius: RADIUS.SM,
          padding: "8px 12px",
          display: "flex",
          flexDirection: "column" as const,
          gap: 2,
        }}
      >
        <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}>Output</span>
        <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>FBX / OBJ / ABC</span>
      </div>
    </div>
  );
};

// ─── 4. CentralizedMgmtViz ────────────────────────────────────────────────────
// Admin dashboard UI mockup + donut chart (light theme)
export const CentralizedMgmtViz: FC = () => {
  const rows = [
    { user: "Alex Chen", expires: "Dec 2025", status: "active" as const },
    { user: "Sarah Kim", expires: "Mar 2026", status: "active" as const },
    { user: "Tom Walsh", expires: "—", status: "inactive" as const },
    { user: "Mia Park", expires: "Jun 2025", status: "warning" as const },
  ];

  const statusColor = (s: "active" | "inactive" | "warning") => {
    if (s === "active") return COLOR.POSITIVE;
    if (s === "warning") return COLOR.WARNING;
    return COLOR.TEXT_DISABLED;
  };

  const statusLabel = (s: "active" | "inactive" | "warning") => {
    if (s === "active") return "Active";
    if (s === "warning") return "Expiring";
    return "Inactive";
  };

  // Donut: 3/5 = 60% → circumference of r=28: 2πr ≈ 175.9
  // dasharray: 60% × 175.9 ≈ 105, gap = 175.9 - 105 ≈ 71
  // dashoffset = 175.9/4 ≈ 44 (start at 12 o'clock)
  const CIRC = 2 * Math.PI * 28;
  const DASH = CIRC * 0.6;

  return (
    <div
      style={{
        backgroundColor: COLOR.BG_SURFACE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        overflow: "hidden",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          padding: "0 20px",
          borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
          gap: 0,
        }}
      >
        {["Members", "Devices", "Licenses"].map((tab, i) => (
          <div
            key={tab}
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              padding: "12px 16px",
              color: i === 0 ? COLOR.ACCENT : COLOR.TEXT_MUTED,
              borderBottom: i === 0 ? `2px solid ${COLOR.ACCENT}` : "2px solid transparent",
              cursor: "default",
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Body: table + donut */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 120px",
        }}
      >
        {/* Table */}
        <div>
          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 80px",
              padding: "8px 16px",
              backgroundColor: COLOR.BG_SECTION,
            }}
          >
            {["User", "Expires", "Status"].map((h) => (
              <span
                key={h}
                style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.user}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 80px",
                padding: "9px 16px",
                borderBottom: i < rows.length - 1 ? `1px solid ${COLOR.BORDER_DEFAULT}` : "none",
                alignItems: "center",
              }}
            >
              <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_PRIMARY }}>
                {row.user}
              </span>
              <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
                {row.expires}
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_2,
                  color: statusColor(row.status),
                }}
              >
                {statusLabel(row.status)}
              </span>
            </div>
          ))}
        </div>

        {/* Donut chart sidebar */}
        <div
          style={{
            borderLeft: `1px solid ${COLOR.BORDER_DEFAULT}`,
            padding: 16,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
          }}
        >
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>
            License Usage
          </span>
          <svg width={80} height={80} viewBox="0 0 80 80">
            {/* Background ring */}
            <circle
              cx={40}
              cy={40}
              r={28}
              style={{ stroke: COLOR.BG_SECTION, fill: "none" }}
              strokeWidth={8}
            />
            {/* Progress ring */}
            <circle
              cx={40}
              cy={40}
              r={28}
              fill="none"
              style={{ stroke: COLOR.ACCENT }}
              strokeWidth={8}
              strokeDasharray={`${DASH} ${CIRC - DASH}`}
              strokeDashoffset={CIRC / 4}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <span
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_2,
              color: COLOR.TEXT_MUTED,
              textAlign: "center" as const,
            }}
          >
            3 / 5 active
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── 5. ScalabilityViz ────────────────────────────────────────────────────────
// Team size stages: Small → Medium → Large
export const ScalabilityViz: FC = () => {
  const stages = [
    {
      label: "Small Team",
      count: 3,
      accentCount: 0,
      dotSize: 12,
    },
    {
      label: "Mid-size",
      count: 10,
      accentCount: 5,
      dotSize: 12,
    },
    {
      label: "Large Studio",
      count: 15,
      accentCount: 7,
      dotSize: 10,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: COLOR.BG_SURFACE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        padding: SPACING[6],
        height: 300,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        gap: SPACING[6],
      }}
    >
      {/* Stage grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          alignItems: "center",
          gap: 0,
        }}
      >
        {stages.map((stage, si) => (
          <>
            <div
              key={stage.label}
              style={{
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                gap: 0,
              }}
            >
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED, textAlign: "center" as const }}>
                {stage.label}
              </span>
              {/* Dot grid */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap" as const,
                  gap: 6,
                  justifyContent: "center",
                  marginTop: 8,
                  maxWidth: 100,
                }}
              >
                {Array.from({ length: stage.count }).map((_, di) => (
                  <div
                    key={di}
                    style={{
                      width: stage.dotSize,
                      height: stage.dotSize,
                      borderRadius: "50%",
                      backgroundColor: di < stage.accentCount ? COLOR.ACCENT : COLOR.BG_SECTION,
                      border: `1px solid ${di < stage.accentCount ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
              {/* MD badge */}
              <div
                style={{
                  marginTop: 12,
                  backgroundColor: COLOR.BG_SECTION,
                  border: `1px solid ${COLOR.BORDER_DEFAULT}`,
                  borderRadius: RADIUS.SM,
                  padding: "3px 8px",
                  display: "inline-flex",
                }}
              >
                <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}>MD</span>
              </div>
            </div>

            {/* Arrow between stages */}
            {si < stages.length - 1 && (
              <div
                key={`arrow-${si}`}
                style={{
                  ...TYPOGRAPHY.STYLE.TITLE_1,
                  color: COLOR.TEXT_DISABLED,
                  textAlign: "center" as const,
                  padding: "0 8px",
                  paddingBottom: 20,
                }}
              >
                →
              </div>
            )}
          </>
        ))}
      </div>

      {/* Bottom message */}
      <p
        style={{
          ...TYPOGRAPHY.STYLE.BODY_2,
          color: COLOR.TEXT_MUTED,
          textAlign: "center" as const,
          margin: 0,
        }}
      >
        규모가 달라져도 워크플로우는 같습니다
      </p>
    </div>
  );
};

// ─── 6. TechSupportViz ────────────────────────────────────────────────────────
// Onboarding timeline — 3 stages
export const TechSupportViz: FC = () => {
  type StepStatus = "done" | "active" | "pending";

  const steps: {
    status: StepStatus;
    phase: string;
    title: string;
    desc: string;
  }[] = [
    {
      status: "done",
      phase: "Day 1",
      title: "팀 온보딩",
      desc: "계정 설정 및 기본 교육 완료",
    },
    {
      status: "active",
      phase: "Week 1–2",
      title: "파이프라인 셋업",
      desc: "기존 DCC 툴 연동 및 워크플로우 구성",
    },
    {
      status: "pending",
      phase: "Ongoing",
      title: "운영 지원",
      desc: "",
    },
  ];

  const phaseColor = (s: StepStatus) => {
    if (s === "active") return COLOR.ACCENT;
    if (s === "done") return COLOR.TEXT_MUTED;
    return COLOR.TEXT_DISABLED;
  };

  const titleColor = (s: StepStatus) => {
    if (s === "active") return COLOR.TEXT_PRIMARY;
    if (s === "done") return COLOR.TEXT_MUTED;
    return COLOR.TEXT_DISABLED;
  };

  return (
    <div
      style={{
        backgroundColor: COLOR.BG_SURFACE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        padding: SPACING[6],
        height: 300,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        gap: SPACING[4],
      }}
    >
      <p style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_PRIMARY, margin: 0, marginBottom: SPACING[2] }}>
        Support Journey
      </p>

      {steps.map((step, i) => (
        <div
          key={step.phase}
          style={{
            display: "flex",
            gap: SPACING[3],
            alignItems: "flex-start",
          }}
        >
          {/* Icon column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {/* Status circle */}
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: `1px solid ${step.status !== "pending" ? COLOR.ACCENT : COLOR.BORDER_DEFAULT}`,
                backgroundColor: step.status === "active" ? COLOR.BG_SURFACE : COLOR.BG_SECTION,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {step.status === "done" && (
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6L5 9L10 3"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ stroke: COLOR.ACCENT }}
                  />
                </svg>
              )}
              {step.status === "active" && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: COLOR.ACCENT,
                  }}
                />
              )}
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 1,
                  flexGrow: 1,
                  minHeight: 16,
                  marginTop: 4,
                  backgroundColor: i === 0 ? COLOR.ACCENT : COLOR.BORDER_DEFAULT,
                }}
              />
            )}
          </div>

          {/* Text */}
          <div style={{ paddingBottom: i < steps.length - 1 ? SPACING[2] : 0 }}>
            <p
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                color: phaseColor(step.status),
                textTransform: "uppercase" as const,
                margin: 0,
              }}
            >
              {step.phase}
            </p>
            <p
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_1,
                color: titleColor(step.status),
                margin: 0,
              }}
            >
              {step.title}
            </p>
            {step.desc && (
              <p
                style={{
                  ...TYPOGRAPHY.STYLE.BODY_2,
                  color: COLOR.TEXT_DISABLED,
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Legacy components — kept for students page compatibility
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT_HEX = "#f54e00";

// ─── Career Flow (Students) ───────────────────────────────────────────────────
export const CareerFlowViz: FC = () => {
  const steps = [
    { label: "School", sub: "MD 학습 시작", icon: "📚" },
    { label: "Portfolio", sub: "실무 포맷 결과물", icon: "🎨" },
    { label: "Studio", sub: "파이프라인 호환", icon: "🏢" },
  ];

  return (
    <div
      style={{
        background: "#141414",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "48px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        height: 340,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,78,0,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {steps.map((step, i) => (
        <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 72,
                height: 72,
                background: i === 1 ? "#1a1a1a" : "#181818",
                border: `1px solid ${i === 1 ? "rgba(245,78,0,0.35)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                boxShadow: i === 1 ? "0 0 24px rgba(245,78,0,0.1)" : "none",
              }}
            >
              {step.icon}
            </div>
            <div style={{ textAlign: "center" as const }}>
              <div
                style={{
                  color: i === 1 ? ACCENT_HEX : "rgba(255,255,255,0.75)",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 12,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  marginTop: 2,
                  whiteSpace: "nowrap" as const,
                }}
              >
                {step.sub}
              </div>
            </div>
          </div>

          {i < steps.length - 1 && (
            <div style={{ display: "flex", alignItems: "center", padding: "0 20px", marginBottom: 40 }}>
              <svg width={48} height={16} viewBox="0 0 48 16">
                <line x1={0} y1={8} x2={42} y2={8} stroke="rgba(245,78,0,0.35)" strokeWidth={1.5} strokeDasharray="4 3" />
                <polygon points="48,8 40,4 40,12" fill="rgba(245,78,0,0.35)" />
              </svg>
            </div>
          )}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          background: "#1e1a14",
          border: "1px solid rgba(245,78,0,0.2)",
          borderRadius: 8,
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ color: ACCENT_HEX, fontSize: 11, fontFamily: "system-ui", letterSpacing: "0.04em", textTransform: "uppercase" as const, fontWeight: 500 }}>
          Studio Pipeline Compatible
        </span>
      </div>
    </div>
  );
};

// ─── Studio Dashboard Viz (Students) ─────────────────────────────────────────
export const StudioDashboardViz: FC = () => {
  const xs = [30, 117, 204, 291, 378, 465, 552];
  const toY = (v: number) => 150 - (v / 1000) * 140;

  const curr = [320, 480, 520, 610, 580, 720, 890].map(toY);
  const prev = [280, 350, 390, 420, 410, 480, 520].map(toY);

  const makePath = (ys: number[]) => {
    let d = `M${xs[0]},${ys[0]}`;
    for (let i = 1; i < xs.length; i++) {
      const dx = (xs[i] - xs[i - 1]) * 0.45;
      d += ` C${xs[i - 1] + dx},${ys[i - 1]} ${xs[i] - dx},${ys[i]} ${xs[i]},${ys[i]}`;
    }
    return d;
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const kpis = [
    { label: "Simulations", value: "1,240", delta: "+12.4%", up: true },
    { label: "Active Projects", value: "24", delta: "+3", up: true },
    { label: "Avg. Sim Time", value: "4.2s", delta: "-8.0%", up: true },
    { label: "Assets Ready", value: "8,720", delta: "+5.2%", up: true },
  ];

  const tableRows = [
    { date: "Overall Mon – Sun", sim: "1,240", proj: "24", time: "4.2s", assets: "8,720" },
    { date: "Sun May 17", sim: "890", proj: "18", time: "3.9s", assets: "1,820" },
    { date: "Sat May 16", sim: "720", proj: "16", time: "4.1s", assets: "1,540" },
  ];

  const navItems = [
    { label: "Projects", icon: "▦", color: "#4ade80" },
    { label: "Simulation", icon: "⟳", color: "#a78bfa" },
    { label: "Assets", icon: "◈", color: "#38bdf8" },
    { label: "Team", icon: "◉", color: ACCENT_HEX },
  ];

  const font = "system-ui, -apple-system, sans-serif";
  const border = "1px solid rgba(255,255,255,0.07)";

  return (
    <div style={{ position: "relative", width: "100%", height: 480, userSelect: "none" as const }}>
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: 0,
          top: 0,
          bottom: 0,
          background: "#161616",
          borderRadius: 16,
          border,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ padding: "18px 24px 12px", borderBottom: border }}>
          <span style={{ color: "#fff", fontFamily: font, fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Studio Performance
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: border }}>
          {kpis.map((k, i) => (
            <div key={k.label} style={{ padding: "14px 20px", borderRight: i < 3 ? border : "none" }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: font, fontSize: 11, marginBottom: 4, letterSpacing: "0.02em" }}>
                {k.label}
              </div>
              <div style={{ color: "#fff", fontFamily: font, fontSize: 20, fontWeight: 600, letterSpacing: "-0.5px", lineHeight: 1 }}>
                {k.value}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 4, color: k.up ? "#4ade80" : "#f87171", fontFamily: font, fontSize: 11 }}>
                <span>{k.up ? "↑" : "↓"}</span>
                <span>{k.delta}</span>
                <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 2 }}>vs. prev 7 days</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 24px 8px", borderBottom: border }}>
          <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginBottom: 8 }}>
            {[{ label: "Current", color: ACCENT_HEX }, { label: "Previous", color: "#a78bfa" }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: font, fontSize: 11 }}>{l.label}</span>
              </div>
            ))}
          </div>

          <svg width="100%" viewBox="0 0 580 160" style={{ display: "block", overflow: "visible" }}>
            {[0, 40, 80, 120, 150].map((y) => (
              <line key={y} x1={30} y1={y} x2={552} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            ))}
            <path d={`${makePath(curr)} L${xs[xs.length - 1]},150 L${xs[0]},150 Z`} fill="url(#grad-curr)" opacity={0.3} />
            <defs>
              <linearGradient id="grad-curr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT_HEX} stopOpacity={0.4} />
                <stop offset="100%" stopColor={ACCENT_HEX} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={makePath(prev)} fill="none" stroke="#a78bfa" strokeWidth={1.5} opacity={0.7} />
            <path d={makePath(curr)} fill="none" stroke={ACCENT_HEX} strokeWidth={2} />
            {xs.map((x, i) => (
              <text key={i} x={x} y={158} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize={9} fontFamily={font}>
                {days[i]}
              </text>
            ))}
          </svg>
        </div>

        <div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "8px 20px", borderBottom: border }}>
            {["Date", "Simulations", "Projects", "Avg. Time", "Assets"].map((h) => (
              <span key={h} style={{ color: "rgba(255,255,255,0.28)", fontFamily: font, fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                {h}
              </span>
            ))}
          </div>
          {tableRows.map((row, i) => (
            <div key={row.date} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "9px 20px", borderBottom: i < tableRows.length - 1 ? border : "none", alignItems: "center" }}>
              <span style={{ color: i === 0 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.55)", fontFamily: font, fontSize: 12, fontWeight: i === 0 ? 600 : 400 }}>{row.date}</span>
              <span style={{ color: "rgba(255,255,255,0.65)", fontFamily: font, fontSize: 12 }}>{row.sim}</span>
              <span style={{ color: "rgba(255,255,255,0.65)", fontFamily: font, fontSize: 12 }}>{row.proj}</span>
              <span style={{ color: "rgba(255,255,255,0.65)", fontFamily: font, fontSize: 12 }}>{row.time}</span>
              <span style={{ color: "rgba(255,255,255,0.65)", fontFamily: font, fontSize: 12 }}>{row.assets}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: "12%",
          width: "22%",
          background: "#111111",
          borderRadius: 14,
          border,
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
          zIndex: 2,
        }}
      >
        <div style={{ padding: "16px 16px 12px", borderBottom: border, display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 16 }}>🐝</span>
          <span style={{ color: "#fff", fontFamily: font, fontSize: 12, fontWeight: 600, letterSpacing: "-0.02em" }}>MD Studio</span>
        </div>
        <div style={{ padding: "8px 0" }}>
          {navItems.map((item, i) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 16px",
                background: i === 3 ? "rgba(245,78,0,0.08)" : "transparent",
                borderLeft: i === 3 ? `2px solid ${ACCENT_HEX}` : "2px solid transparent",
              }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 6, background: `${item.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: item.color }}>
                {item.icon}
              </div>
              <span style={{ color: i === 3 ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: font, fontSize: 12, fontWeight: i === 3 ? 500 : 400 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Discount Viz (Students) ──────────────────────────────────────────────────
export const DiscountViz: FC = () => (
  <div
    style={{
      background: "#141414",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.07)",
      padding: "40px",
      height: 340,
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      gap: 24,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,78,0,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
      <div
        style={{
          background: "rgba(245,78,0,0.12)",
          border: "1px solid rgba(245,78,0,0.3)",
          borderRadius: 8,
          padding: "8px 16px",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ color: ACCENT_HEX, fontSize: 32, fontWeight: 700, fontFamily: "system-ui", letterSpacing: "-1px", lineHeight: 1 }}>70%</span>
        <span style={{ color: ACCENT_HEX, fontSize: 14, fontWeight: 500, fontFamily: "system-ui" }}>OFF</span>
      </div>
      <div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "system-ui", textDecoration: "line-through" }}>$280/year</div>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 600, fontFamily: "system-ui", letterSpacing: "-0.03em" }}>$99/year</div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
      {[
        "14일 무료 체험 후 자동 시작",
        "MD CONNECT 에셋 전체 접근",
        "실무 포맷 FBX / OBJ / ABC 내보내기",
        "최대 2회 구매 가능",
      ].map((item) => (
        <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(245,78,0,0.15)", border: "1px solid rgba(245,78,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width={8} height={8} viewBox="0 0 8 8">
              <path d="M1.5 4L3.5 6L6.5 2" stroke={ACCENT_HEX} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "system-ui" }}>{item}</span>
        </div>
      ))}
    </div>

    <div
      style={{
        background: "#1e1e1e",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 8,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>🎓</span>
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "system-ui" }}>
        학교 이메일 또는 재학증명서 인증 필요
      </span>
    </div>
  </div>
);

// ─── Studio Grid Viz (Students — legacy alias) ────────────────────────────────
// Kept for students page import compatibility
export const StudioGridViz: FC = () => {
  const studios = [
    { name: "AAA Game Studio", x: 60, y: 48 },
    { name: "VFX House", x: 500, y: 40 },
    { name: "Animation Studio", x: 575, y: 165 },
    { name: "Fashion Brand", x: 500, y: 280 },
    { name: "Film Production", x: 30, y: 280 },
    { name: "Indie Studio", x: 22, y: 155 },
  ];
  const cx = 320;
  const cy = 170;

  return (
    <div
      style={{
        position: "relative",
        height: 340,
        background: "#141414",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,78,0,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 640 340"
        preserveAspectRatio="xMidYMid meet"
      >
        {studios.map((s) => {
          const tx = s.x + s.name.length * 3.5;
          const ty = s.y + 14;
          return (
            <line
              key={s.name}
              x1={cx} y1={cy}
              x2={tx} y2={ty}
              stroke="rgba(245,78,0,0.15)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={140} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={80} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      </svg>

      {studios.map((s) => (
        <div
          key={s.name}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            background: "#1e1e1e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            padding: "5px 10px",
            color: "rgba(255,255,255,0.55)",
            fontSize: 12,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap" as const,
          }}
        >
          {s.name}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#1a1a1a",
          border: "1px solid rgba(245,78,0,0.35)",
          borderRadius: 12,
          padding: "12px 22px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 2,
          boxShadow: "0 0 32px rgba(245,78,0,0.12)",
        }}
      >
        <span style={{ fontSize: 18 }}>🐝</span>
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "-0.02em" }}>
          Marvelous Designer
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          background: "#1e1a14",
          border: "1px solid rgba(245,78,0,0.2)",
          borderRadius: 8,
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 14 }}>🏆</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
          Academy Award 2024
        </span>
      </div>
    </div>
  );
};
