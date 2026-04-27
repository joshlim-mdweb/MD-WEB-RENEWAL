/**
 * Date/number formatting utilities shared across the app.
 *
 * Centralised here so that every page uses identical output,
 * eliminating subtle inconsistencies between inline formatDate helpers.
 */

/**
 * Formats an ISO date string as "YYYY년 M월 D일".
 * Used for profile join date and other long-form date displays.
 */
export function formatKoreanDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/**
 * Formats an ISO date string as "YYYY.MM.DD".
 * Used in tables/lists where compact display is preferred.
 */
export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
