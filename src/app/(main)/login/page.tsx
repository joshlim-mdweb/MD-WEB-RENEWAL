"use client";

import { useState, Suspense, type FC } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { TextInput, Button } from "@/components/ui";
import { COLOR, RADIUS, SHADOW, TYPOGRAPHY } from "@/lib/design-tokens";
import Link from "next/link";

// useSearchParams() requires a Suspense boundary in Next.js App Router.
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(callbackError ?? "");
  const [loginMode, setLoginMode] = useState<"password" | "magic">("password");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoginLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_credentials")
      ) {
        setErrorMessage("이메일 또는 비밀번호를 다시 확인해 주세요.");
      } else if (
        error.message.includes("Email not confirmed") ||
        error.message.includes("email_not_confirmed")
      ) {
        setErrorMessage("이메일 인증이 필요해요. 받은 편지함을 확인해 주세요.");
      } else {
        setErrorMessage("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
      }
      setIsLoginLoading(false);
    } else {
      router.push(redirectTo);
    }
  }

  async function handleMagicLinkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoginLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
      },
    });

    if (error) {
      setErrorMessage("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
    } else {
      setMagicLinkSent(true);
    }
    setIsLoginLoading(false);
  }

  async function handleGoogleSignIn() {
    setErrorMessage("");
    setIsGoogleLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
      },
    });

    if (error) {
      setErrorMessage("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
      setIsGoogleLoading(false);
    }
  }

  async function handleKakaoSignIn() {
    setErrorMessage("");
    setIsKakaoLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
      },
    });

    if (error) {
      setErrorMessage("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
      setIsKakaoLoading(false);
    }
  }

  const isSocialLoading = isGoogleLoading || isKakaoLoading;

  return (
    <div
      className="login_page_wrap"
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
        className="login_card_wrap"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: COLOR.BG_SURFACE,
          border: `1px solid ${COLOR.BORDER_DEFAULT}`,
          borderRadius: RADIUS.XL,
          padding: "40px 32px",
          boxShadow: SHADOW.CARD,
        }}
      >
        {/* 로고 / 제목 */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ ...TYPOGRAPHY.STYLE.H1, color: COLOR.TEXT_PRIMARY, marginBottom: "8px" }}>
            OPINION
          </h1>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            설문을 만들고 진짜 의견을 모아보세요.
          </p>
        </div>

        {/* 소셜 로그인 */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}
        >
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSocialLoading || isLoginLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.MD,
              padding: "11px 16px",
              backgroundColor: COLOR.BG_BASE,
              color: COLOR.TEXT_PRIMARY,
              fontSize: TYPOGRAPHY.SIZE.SM,
              fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM,
              cursor: isSocialLoading || isLoginLoading ? "not-allowed" : "pointer",
              opacity: isSocialLoading || isLoginLoading ? 0.6 : 1,
              transition: "background-color 150ms ease",
            }}
          >
            <GoogleIcon />
            {isGoogleLoading ? "연결하는 중이에요…" : "Google로 계속하기"}
          </button>

          <button
            type="button"
            onClick={handleKakaoSignIn}
            disabled={isSocialLoading || isLoginLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              border: "none",
              borderRadius: RADIUS.MD,
              padding: "11px 16px",
              backgroundColor: "#FEE500",
              color: "#191919",
              fontSize: TYPOGRAPHY.SIZE.SM,
              fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM,
              cursor: isSocialLoading || isLoginLoading ? "not-allowed" : "pointer",
              opacity: isSocialLoading || isLoginLoading ? 0.6 : 1,
              transition: "background-color 150ms ease",
            }}
          >
            <KakaoIcon />
            {isKakaoLoading ? "연결하는 중이에요…" : "카카오로 계속하기"}
          </button>
        </div>

        {/* 구분선 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: COLOR.BORDER_DEFAULT }} />
          <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>또는</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: COLOR.BORDER_DEFAULT }} />
        </div>

        {/* 이메일+비밀번호 폼 */}
        {loginMode === "password" && (
          <form
            onSubmit={handleLoginSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <TextInput
              label="이메일"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="이메일 주소를 입력해 주세요"
              required
              state={errorMessage ? "error" : "default"}
            />

            <TextInput
              label="비밀번호"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="비밀번호를 입력해 주세요"
              required
              state={errorMessage ? "error" : "default"}
              errorMessage={errorMessage || undefined}
              rightSlot={
                <PasswordToggleButton
                  isVisible={isPasswordVisible}
                  onToggle={() => setIsPasswordVisible((v) => !v)}
                />
              }
            />

            <Button
              type="submit"
              variant="solid"
              size="lg"
              loading={isLoginLoading}
              disabled={isSocialLoading}
              className="w-full"
            >
              로그인하기
            </Button>

            <button
              type="button"
              onClick={() => {
                setLoginMode("magic");
                setErrorMessage("");
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                ...TYPOGRAPHY.STYLE.BODY_2,
                color: COLOR.TEXT_MUTED,
                textAlign: "center",
                padding: 0,
              }}
            >
              비밀번호가 없어요 →
            </button>
          </form>
        )}

        {/* 매직링크 폼 */}
        {loginMode === "magic" && !magicLinkSent && (
          <form
            onSubmit={handleMagicLinkSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <TextInput
              label="이메일"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="이메일 주소를 입력해 주세요"
              required
              state={errorMessage ? "error" : "default"}
              errorMessage={errorMessage || undefined}
            />

            <Button
              type="submit"
              variant="solid"
              size="lg"
              loading={isLoginLoading}
              disabled={isSocialLoading}
              className="w-full"
            >
              이메일 링크 보내기
            </Button>

            <button
              type="button"
              onClick={() => {
                setLoginMode("password");
                setErrorMessage("");
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                ...TYPOGRAPHY.STYLE.BODY_2,
                color: COLOR.TEXT_MUTED,
                textAlign: "center",
                padding: 0,
              }}
            >
              ← 비밀번호로 로그인하기
            </button>
          </form>
        )}

        {/* 매직링크 발송 완료 */}
        {loginMode === "magic" && magicLinkSent && (
          <div style={{ textAlign: "center" }}>
            <p
              style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY, marginBottom: "8px" }}
            >
              이메일을 확인해 주세요
            </p>
            <p
              style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED, marginBottom: "20px" }}
            >
              {email}로 로그인 링크를 보냈어요.
            </p>
            <button
              type="button"
              onClick={() => {
                setMagicLinkSent(false);
                setEmail("");
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                ...TYPOGRAPHY.STYLE.BODY_2,
                color: COLOR.TEXT_MUTED,
              }}
            >
              다른 이메일로 시도하기
            </button>
          </div>
        )}

        {/* 회원가입 링크 */}
        {!magicLinkSent && (
          <p
            style={{
              ...TYPOGRAPHY.STYLE.BODY_2,
              color: COLOR.TEXT_MUTED,
              textAlign: "center",
              marginTop: "24px",
            }}
          >
            아직 계정이 없어요?{" "}
            <Link
              href="/signup"
              style={{
                color: COLOR.ACCENT,
                fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM,
                textDecoration: "none",
              }}
            >
              회원가입하기
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

// ── 아이콘 컴포넌트 ──────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#191919"
        d="M9 1.5C4.305 1.5.75 4.37.75 7.875c0 2.198 1.384 4.127 3.468 5.243L3.375 16.5l4.621-3.086C8.325 13.47 8.658 13.5 9 13.5c4.695 0 8.25-2.87 8.25-6.375S13.695 1.5 9 1.5Z"
      />
    </svg>
  );
}

const PasswordToggleButton: FC<{ isVisible: boolean; onToggle: () => void }> = ({
  isVisible,
  onToggle,
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보이기"}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: COLOR.TEXT_MUTED,
    }}
  >
    {isVisible ? <EyeOffIcon /> : <EyeIcon />}
  </button>
);

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 2l12 12M6.5 6.6A2 2 0 0 0 9.4 9.5M4.2 4.3C2.7 5.3 1.5 7 1.5 7S3.8 11.5 8 11.5c1.1 0 2.1-.3 3-.8M7 4.5c.3 0 .7-.1 1-.1 4.2 0 6.5 4.5 6.5 4.5s-.7 1.4-2 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
