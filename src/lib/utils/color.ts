import { COLOR } from "@/lib/design-tokens";

/**
 * W3C WCAG 2.1 상대 휘도 공식으로 배경색 대비를 계산하여
 * 가장 높은 대비비를 가진 텍스트 색상을 반환한다.
 *
 * 지원 포맷: #rrggbb, #rgb, rgba(r,g,b,a)
 * 파싱 실패 시 폴백: COLOR.TEXT_PRIMARY (#191c1e)
 */
export function getContrastTextColor(hexBg: string): string {
  const rgb = parseColorToRgb(hexBg);

  if (rgb === null) {
    // 파싱 실패 — 안전한 기본값
    return COLOR.TEXT_PRIMARY;
  }

  const [r, g, b] = rgb;

  // 각 채널을 0–1로 정규화 후 선형화 (IEC 61966-2-1 sRGB gamma)
  const linearize = (channel: number): number => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  // WCAG 2.1 상대 휘도 (ITU-R BT.709 primaries)
  const L = 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);

  // 흰 텍스트 대비비 (배경이 어두울수록 높아짐)
  const contrastWithWhite = 1.05 / (L + 0.05);
  // 검정 텍스트 대비비 (배경이 밝을수록 높아짐)
  const contrastWithBlack = (L + 0.05) / 0.05;

  return contrastWithWhite > contrastWithBlack
    ? COLOR.TEXT_INVERSE // #ffffff — 어두운 배경
    : COLOR.TEXT_PRIMARY; // #191c1e — 밝은 배경
}

// ─── Internal ─────────────────────────────────────────────────────────────────

/**
 * 다양한 CSS 색상 문자열을 [R, G, B] (0–255) 튜플로 파싱한다.
 * 파싱할 수 없으면 null을 반환한다.
 */
function parseColorToRgb(raw: string): [number, number, number] | null {
  const trimmed = raw.trim().toLowerCase();

  // rgba(r, g, b, a) 또는 rgb(r, g, b)
  const rgbaMatch = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
  if (rgbaMatch) {
    return [parseInt(rgbaMatch[1], 10), parseInt(rgbaMatch[2], 10), parseInt(rgbaMatch[3], 10)];
  }

  // #rrggbb
  const hexFullMatch = trimmed.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/);
  if (hexFullMatch) {
    return [
      parseInt(hexFullMatch[1], 16),
      parseInt(hexFullMatch[2], 16),
      parseInt(hexFullMatch[3], 16),
    ];
  }

  // #rgb → #rrggbb 확장
  const hexShortMatch = trimmed.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
  if (hexShortMatch) {
    return [
      parseInt(hexShortMatch[1] + hexShortMatch[1], 16),
      parseInt(hexShortMatch[2] + hexShortMatch[2], 16),
      parseInt(hexShortMatch[3] + hexShortMatch[3], 16),
    ];
  }

  return null;
}
