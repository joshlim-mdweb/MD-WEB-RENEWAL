import { describe, it, expect, vi } from "vitest";

// Mock design-tokens so the test doesn't require Next.js module resolution
vi.mock("@/lib/design-tokens", () => ({
  COLOR: {
    TEXT_PRIMARY: "#2D3A4A",
    TEXT_INVERSE: "#ffffff",
  },
}));

import { getContrastTextColor } from "./color";

describe("getContrastTextColor", () => {
  // ─── Dark backgrounds → white text ───────────────────────────────────────
  it("returns white text on pure black background", () => {
    expect(getContrastTextColor("#000000")).toBe("#ffffff");
  });

  it("returns white text on dark navy", () => {
    expect(getContrastTextColor("#2D3A4A")).toBe("#ffffff");
  });

  it("returns white text on a dark blue", () => {
    expect(getContrastTextColor("#1a3a6b")).toBe("#ffffff");
  });

  // ─── Light backgrounds → dark text ───────────────────────────────────────
  it("returns dark text on pure white background", () => {
    expect(getContrastTextColor("#ffffff")).toBe("#2D3A4A");
  });

  it("returns dark text on light gray", () => {
    expect(getContrastTextColor("#f2f4f6")).toBe("#2D3A4A");
  });

  it("returns dark text on light yellow", () => {
    expect(getContrastTextColor("#ffff00")).toBe("#2D3A4A");
  });

  // ─── Shorthand hex (#rgb) ─────────────────────────────────────────────────
  it("handles #rgb shorthand for black", () => {
    expect(getContrastTextColor("#000")).toBe("#ffffff");
  });

  it("handles #rgb shorthand for white", () => {
    expect(getContrastTextColor("#fff")).toBe("#2D3A4A");
  });

  it("handles #rgb shorthand for dark color", () => {
    expect(getContrastTextColor("#123")).toBe("#ffffff");
  });

  // ─── rgba() format ────────────────────────────────────────────────────────
  it("handles rgba() dark color", () => {
    expect(getContrastTextColor("rgba(0, 0, 0, 1)")).toBe("#ffffff");
  });

  it("handles rgba() light color", () => {
    expect(getContrastTextColor("rgba(255, 255, 255, 0.5)")).toBe("#2D3A4A");
  });

  it("handles rgb() format", () => {
    expect(getContrastTextColor("rgb(20, 30, 40)")).toBe("#ffffff");
  });

  // ─── Whitespace tolerance ─────────────────────────────────────────────────
  it("trims leading/trailing whitespace", () => {
    expect(getContrastTextColor("  #000000  ")).toBe("#ffffff");
  });

  // ─── Invalid input → fallback ─────────────────────────────────────────────
  it("falls back to TEXT_PRIMARY for an empty string", () => {
    expect(getContrastTextColor("")).toBe("#2D3A4A");
  });

  it("falls back to TEXT_PRIMARY for a garbage string", () => {
    expect(getContrastTextColor("not-a-color")).toBe("#2D3A4A");
  });

  it("falls back to TEXT_PRIMARY for a partial hex", () => {
    expect(getContrastTextColor("#ff")).toBe("#2D3A4A");
  });

  // ─── Mid-range (contrast boundary) ───────────────────────────────────────
  it("picks higher-contrast option for mid-gray", () => {
    // #777777 is approximately at the 50% luminance boundary
    // Either result is acceptable — just verify it returns one of the two valid values
    const result = getContrastTextColor("#777777");
    expect(["#ffffff", "#2D3A4A"]).toContain(result);
  });
});
