import type { Meta, StoryObj } from "@storybook/react";
import { COLOR, RADIUS, SHADOW, SPACING, TYPOGRAPHY, BUTTON, TOGGLE } from "@/lib/design-tokens";

// ─── Color Swatch ─────────────────────────────────────────────────────────────

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: 100 }}>
      <div
        style={{
          width: 100,
          height: 56,
          borderRadius: RADIUS.MD,
          backgroundColor: value,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      />
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#191c1e", margin: 0, lineHeight: 1.4 }}>
          {name}
        </p>
        <p style={{ fontSize: 10, color: "#6b7684", margin: 0, fontFamily: "monospace" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Radius Swatch ────────────────────────────────────────────────────────────

function RadiusSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: value,
          backgroundColor: "#ebf3fe",
          border: "1.5px solid #3182f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#191c1e", margin: 0 }}>{name}</p>
        <p style={{ fontSize: 10, color: "#6b7684", margin: 0, fontFamily: "monospace" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Shadow Swatch ────────────────────────────────────────────────────────────

function ShadowSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          width: 140,
          height: 80,
          borderRadius: RADIUS.LG,
          backgroundColor: "#ffffff",
          boxShadow: value,
        }}
      />
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#191c1e", margin: 0 }}>{name}</p>
        <p
          style={{
            fontSize: 9,
            color: "#6b7684",
            margin: "2px 0 0",
            fontFamily: "monospace",
            wordBreak: "break-all",
            maxWidth: 140,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Section helper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#191c1e",
          marginBottom: 4,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          width: "100%",
          height: 1,
          backgroundColor: "rgba(199,200,208,0.35)",
          marginBottom: 20,
        }}
      />
      {children}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#6b7684",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 12,
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>{children}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function DesignTokensPage() {
  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "48px 40px",
        maxWidth: 1100,
        backgroundColor: "#f7f9fb",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#191c1e",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          OPINION Design Tokens
        </h1>
        <p style={{ fontSize: 13, color: "#6b7684", marginTop: 6, margin: "6px 0 0" }}>
          Single source of truth —{" "}
          <code style={{ fontFamily: "monospace" }}>src/lib/design-tokens.ts</code>
        </p>
      </div>

      {/* ── Colors ───────────────────────────────────────────────────────── */}
      <Section title="Color">
        <Group label="Text">
          {(
            [
              ["TEXT_PRIMARY", COLOR.TEXT_PRIMARY],
              ["TEXT_SECONDARY", COLOR.TEXT_SECONDARY],
              ["TEXT_MUTED", COLOR.TEXT_MUTED],
              ["TEXT_DISABLED", COLOR.TEXT_DISABLED],
              ["TEXT_INVERSE", COLOR.TEXT_INVERSE],
            ] as [string, string][]
          ).map(([n, v]) => (
            <ColorSwatch key={n} name={n} value={v} />
          ))}
        </Group>

        <Group label="Background">
          {(
            [
              ["BG_BASE", COLOR.BG_BASE],
              ["BG_SURFACE", COLOR.BG_SURFACE],
              ["BG_SECTION", COLOR.BG_SECTION],
              ["BG_INPUT", COLOR.BG_INPUT],
              ["BG_OVERLAY", COLOR.BG_OVERLAY],
            ] as [string, string][]
          ).map(([n, v]) => (
            <ColorSwatch key={n} name={n} value={v} />
          ))}
        </Group>

        <Group label="Border">
          {(
            [
              ["BORDER_DEFAULT", COLOR.BORDER_DEFAULT],
              ["BORDER_INPUT", COLOR.BORDER_INPUT],
              ["BORDER_STRONG", COLOR.BORDER_STRONG],
              ["BORDER_FOCUS", COLOR.BORDER_FOCUS],
            ] as [string, string][]
          ).map(([n, v]) => (
            <ColorSwatch key={n} name={n} value={v} />
          ))}
        </Group>

        <Group label="Accent / Interactive">
          {(
            [
              ["ACCENT", COLOR.ACCENT],
              ["ACCENT_HOVER", COLOR.ACCENT_HOVER],
              ["ACCENT_LIGHT", COLOR.ACCENT_LIGHT],
              ["ACCENT_MUTED", COLOR.ACCENT_MUTED],
              ["ACCENT_BG", COLOR.ACCENT_BG],
            ] as [string, string][]
          ).map(([n, v]) => (
            <ColorSwatch key={n} name={n} value={v} />
          ))}
        </Group>

        <Group label="Status">
          {(
            [
              ["POSITIVE", COLOR.POSITIVE],
              ["POSITIVE_MUTED", COLOR.POSITIVE_MUTED],
              ["NEGATIVE", COLOR.NEGATIVE],
              ["NEGATIVE_LIGHT", COLOR.NEGATIVE_LIGHT],
              ["NEGATIVE_BG", COLOR.NEGATIVE_BG],
              ["WARNING", COLOR.WARNING],
              ["WARNING_MUTED", COLOR.WARNING_MUTED],
            ] as [string, string][]
          ).map(([n, v]) => (
            <ColorSwatch key={n} name={n} value={v} />
          ))}
        </Group>

        <Group label="Button Backgrounds">
          {(
            [
              ["PRIMARY_BG", BUTTON.PRIMARY_BG],
              ["PRIMARY_BG_HOVER", BUTTON.PRIMARY_BG_HOVER],
              ["DANGER_BG", BUTTON.DANGER_BG],
              ["DANGER_BG_HOVER", BUTTON.DANGER_BG_HOVER],
              ["NEUTRAL_BG", BUTTON.NEUTRAL_BG],
              ["NEUTRAL_BG_HOVER", BUTTON.NEUTRAL_BG_HOVER],
            ] as [string, string][]
          ).map(([n, v]) => (
            <ColorSwatch key={n} name={n} value={v} />
          ))}
        </Group>

        <Group label="Toggle">
          {(
            [
              ["TOGGLE_ACTIVE", COLOR.TOGGLE_ACTIVE],
              ["TOGGLE_INACTIVE", COLOR.TOGGLE_INACTIVE],
              ["TOGGLE_KNOB", COLOR.TOGGLE_KNOB],
              ["TOAST_BG", COLOR.TOAST_BG],
            ] as [string, string][]
          ).map(([n, v]) => (
            <ColorSwatch key={n} name={n} value={v} />
          ))}
        </Group>
      </Section>

      {/* ── Radius ───────────────────────────────────────────────────────── */}
      <Section title="Border Radius">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {(Object.entries(RADIUS) as [string, string][]).map(([name, value]) => (
            <RadiusSwatch key={name} name={name} value={value} />
          ))}
        </div>
      </Section>

      {/* ── Shadow ───────────────────────────────────────────────────────── */}
      <Section title="Shadow">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            backgroundColor: "#ffffff",
            padding: 24,
            borderRadius: RADIUS.LG,
          }}
        >
          {(Object.entries(SHADOW) as [string, string][]).map(([name, value]) => (
            <ShadowSwatch key={name} name={name} value={value} />
          ))}
        </div>
      </Section>

      {/* ── Typography ───────────────────────────────────────────────────── */}
      <Section title="Typography">
        <Group label="Type Scale">
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {(
              [
                ["DISPLAY", TYPOGRAPHY.STYLE.DISPLAY, "Hero numbers, big KPIs"],
                ["H1", TYPOGRAPHY.STYLE.H1, "Page titles"],
                ["H2", TYPOGRAPHY.STYLE.H2, "Section headings"],
                ["H3", TYPOGRAPHY.STYLE.H3, "Card headings"],
                ["TITLE_1", TYPOGRAPHY.STYLE.TITLE_1, "Nav labels, content titles"],
                ["TITLE_2", TYPOGRAPHY.STYLE.TITLE_2, "Section labels, subtitles"],
                ["BODY_1", TYPOGRAPHY.STYLE.BODY_1, "Primary body copy"],
                ["BODY_2", TYPOGRAPHY.STYLE.BODY_2, "Secondary body, descriptions"],
                ["LABEL_1", TYPOGRAPHY.STYLE.LABEL_1, "Buttons, badges, UI controls"],
                ["LABEL_2", TYPOGRAPHY.STYLE.LABEL_2, "Captions, hints, timestamps"],
              ] as [string, (typeof TYPOGRAPHY.STYLE)[keyof typeof TYPOGRAPHY.STYLE], string][]
            ).map(([name, style, usage]) => (
              <div
                key={name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 200px",
                  alignItems: "center",
                  gap: 16,
                  padding: "10px 0",
                  borderBottom: "1px solid #f0f2f4",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#6b7684",
                    fontFamily: "monospace",
                  }}
                >
                  STYLE.{name}
                </span>
                <span style={{ ...style, color: "#191c1e" }}>가나다 Ag 123</span>
                <span style={{ fontSize: 11, color: "#9da6b0", fontFamily: "monospace" }}>
                  {style.fontSize} / {style.fontWeight} / lh {style.lineHeight}
                </span>
              </div>
            ))}
          </div>
        </Group>

        <Group label="Font Weight">
          <div style={{ display: "flex", gap: 32 }}>
            {(Object.entries(TYPOGRAPHY.WEIGHT) as [string, string][]).map(([name, value]) => (
              <div key={name} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: parseInt(value),
                    color: "#191c1e",
                    margin: "0 0 4px",
                  }}
                >
                  Ag
                </p>
                <p style={{ fontSize: 11, color: "#6b7684", margin: 0 }}>
                  {name}
                  <br />
                  <span style={{ fontFamily: "monospace" }}>{value}</span>
                </p>
              </div>
            ))}
          </div>
        </Group>
      </Section>

      {/* ── Spacing ──────────────────────────────────────────────────────── */}
      <Section title="Spacing (4px grid)">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(Object.entries(SPACING) as [string, string][]).map(([name, value]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: value,
                  height: 16,
                  backgroundColor: COLOR.ACCENT_MUTED,
                  borderRadius: 2,
                  border: `1px solid ${COLOR.ACCENT}`,
                  flexShrink: 0,
                  minWidth: 4,
                }}
              />
              <span
                style={{ fontSize: 11, color: "#191c1e", fontFamily: "monospace", minWidth: 60 }}
              >
                SPACING[{name}]
              </span>
              <span style={{ fontSize: 11, color: "#6b7684", fontFamily: "monospace" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Toggle ───────────────────────────────────────────────────────── */}
      <Section title="Component Dimensions">
        <Group label="Toggle">
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: RADIUS.LG,
              padding: "20px 24px",
              border: `1px solid ${COLOR.BORDER_INPUT}`,
              display: "flex",
              gap: 32,
              alignItems: "center",
            }}
          >
            <div>
              {/* Live toggle preview */}
              <div
                style={{
                  width: TOGGLE.TRACK_WIDTH,
                  height: TOGGLE.TRACK_HEIGHT,
                  borderRadius: 100,
                  backgroundColor: COLOR.TOGGLE_ACTIVE,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: TOGGLE.KNOB_OFFSET,
                    right: TOGGLE.KNOB_OFFSET,
                    width: TOGGLE.KNOB_SIZE,
                    height: TOGGLE.KNOB_SIZE,
                    borderRadius: "50%",
                    backgroundColor: COLOR.TOGGLE_KNOB,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: "#6b7684",
                  margin: "6px 0 0",
                  fontFamily: "monospace",
                }}
              >
                ON
              </p>
            </div>
            <div>
              <div
                style={{
                  width: TOGGLE.TRACK_WIDTH,
                  height: TOGGLE.TRACK_HEIGHT,
                  borderRadius: 100,
                  backgroundColor: COLOR.TOGGLE_INACTIVE,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: TOGGLE.KNOB_OFFSET,
                    left: TOGGLE.KNOB_OFFSET,
                    width: TOGGLE.KNOB_SIZE,
                    height: TOGGLE.KNOB_SIZE,
                    borderRadius: "50%",
                    backgroundColor: COLOR.TOGGLE_KNOB,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: "#6b7684",
                  margin: "6px 0 0",
                  fontFamily: "monospace",
                }}
              >
                OFF
              </p>
            </div>
            <div style={{ borderLeft: `1px solid ${COLOR.BORDER_INPUT}`, paddingLeft: 24 }}>
              <table style={{ fontSize: 11, color: "#6b7684", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["TRACK_WIDTH", TOGGLE.TRACK_WIDTH + "px"],
                    ["TRACK_HEIGHT", TOGGLE.TRACK_HEIGHT + "px"],
                    ["KNOB_SIZE", TOGGLE.KNOB_SIZE + "px"],
                    ["KNOB_OFFSET", TOGGLE.KNOB_OFFSET + "px"],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ paddingRight: 16, paddingBottom: 4, fontFamily: "monospace" }}>
                        {k}
                      </td>
                      <td style={{ color: "#191c1e", fontFamily: "monospace", fontWeight: 600 }}>
                        {v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Group>
      </Section>
    </div>
  );
}

// ─── Story config ─────────────────────────────────────────────────────────────

const meta: Meta = {
  title: "Design System/Tokens",
  component: DesignTokensPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Visual reference for all design tokens defined in `src/lib/design-tokens.ts`. This is the single source of truth — do not hardcode values in components.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const All: Story = {};
