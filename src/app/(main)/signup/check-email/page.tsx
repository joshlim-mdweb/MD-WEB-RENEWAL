"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { COLOR, RADIUS, SHADOW, TYPOGRAPHY } from "@/lib/design-tokens";
import Link from "next/link";

const RESEND_COOLDOWN_SECONDS = 60;

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // 컴포넌트 마운트 시 바로 쿨다운 시작 (방금 가입했으므로)
  useEffect(() => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }, []);

  // 쿨다운 카운트다운
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleResend() {
    if (cooldown > 0 || !email) return;
    setIsResending(true);
    setResendMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email });

    if (error) {
      setResendMessage("인증 메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.");
    } else {
      setResendMessage("인증 메일을 다시 보냈어요.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }
    setIsResending(false);
  }

  return (
    <div
      className="check_email_page_wrap"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOR.BG_BASE,
        padding: "24px",
      }}
    >
      <div
        className="check_email_card_wrap"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: COLOR.BG_SURFACE,
          border: `1px solid ${COLOR.BORDER_DEFAULT}`,
          borderRadius: RADIUS.XL,
          padding: "40px 32px",
          boxShadow: SHADOW.CARD,
          textAlign: "center",
        }}
      >
        {/* 아이콘 */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: COLOR.ACCENT_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <MailIcon />
        </div>

        {/* 제목 */}
        <h1
          style={{
            ...TYPOGRAPHY.STYLE.H2,
            color: COLOR.TEXT_PRIMARY,
            marginBottom: "12px",
          }}
        >
          이메일을 확인해 주세요
        </h1>

        {/* 안내 문구 */}
        <p
          style={{
            ...TYPOGRAPHY.STYLE.BODY_1,
            color: COLOR.TEXT_SECONDARY,
            marginBottom: "8px",
          }}
        >
          <strong style={{ color: COLOR.TEXT_PRIMARY }}>{email}</strong>로 인증 링크를 보냈어요.
        </p>
        <p
          style={{
            ...TYPOGRAPHY.STYLE.BODY_2,
            color: COLOR.TEXT_MUTED,
            marginBottom: "32px",
          }}
        >
          링크를 클릭하면 바로 시작할 수 있어요.
        </p>

        {/* 재발송 버튼 */}
        <div style={{ marginBottom: "16px" }}>
          <Button
            variant="neutral"
            size="md"
            loading={isResending}
            disabled={cooldown > 0}
            onClick={handleResend}
            className="w-full"
          >
            {cooldown > 0 ? `${cooldown}초 후 다시 보낼 수 있어요` : "인증 메일 다시 보내기"}
          </Button>
        </div>

        {/* 재발송 결과 메시지 */}
        {resendMessage && (
          <p
            style={{
              ...TYPOGRAPHY.STYLE.BODY_2,
              color: resendMessage.includes("못했어요") ? COLOR.NEGATIVE : COLOR.POSITIVE,
              marginBottom: "16px",
            }}
          >
            {resendMessage}
          </p>
        )}

        {/* 다른 이메일로 가입 링크 */}
        <Link
          href="/signup"
          style={{
            ...TYPOGRAPHY.STYLE.BODY_2,
            color: COLOR.TEXT_MUTED,
            textDecoration: "none",
          }}
        >
          다른 이메일로 가입하기
        </Link>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  );
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ color: COLOR.ACCENT }}
      />
      <path
        d="M2 8l10 7 10-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ color: COLOR.ACCENT }}
      />
    </svg>
  );
}
