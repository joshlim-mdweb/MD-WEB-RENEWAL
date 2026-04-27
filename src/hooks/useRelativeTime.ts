"use client";

import { useEffect, useState } from "react";

/**
 * Returns a human-readable relative time string that refreshes every 30s.
 * Kept intentionally simple — no i18n needed for MVP.
 */
export function useRelativeTime(date: Date | null): string | null {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!date) return;
    const intervalId = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(intervalId);
  }, [date]);

  return formatRelativeTime(date);
}

function formatRelativeTime(date: Date | null): string | null {
  if (!date) return null;

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSeconds < 60) return "Saved just now";
  if (diffSeconds < 120) return "Saved 1 min ago";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `Saved ${diffMinutes} mins ago`;

  return "Saved a while ago";
}
