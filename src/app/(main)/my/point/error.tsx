"use client";

import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

// Next.js App Router requires error.tsx to be a Client Component
// and receive error + reset props for ErrorBoundary integration.
export default function AssetError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="asset_page px-8 py-8 max-w-2xl">
      <div
        className="asset_error_card rounded-2xl py-16 text-center"
        style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        {/* Exclamation circle icon */}
        <div className="flex justify-center mb-4">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="19" stroke={COLOR.TEXT_DISABLED} strokeWidth="1.5" />
            <path
              d="M20 12v10"
              stroke={COLOR.TEXT_DISABLED}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="20" cy="27" r="1.5" fill={COLOR.TEXT_DISABLED} />
          </svg>
        </div>

        <p className="mb-2" style={{ ...TYPOGRAPHY.STYLE.TITLE_2, color: COLOR.TEXT_PRIMARY }}>
          자산 정보를 불러오지 못했습니다
        </p>
        <p className="mb-6" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
          잠시 후 다시 시도해 주세요
        </p>

        <button
          onClick={reset}
          className="rounded-xl px-6 py-2.5 transition-colors"
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            backgroundColor: COLOR.ACCENT,
            color: "#ffffff",
          }}
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
