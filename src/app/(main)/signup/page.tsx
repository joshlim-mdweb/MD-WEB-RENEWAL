"use client";

import { useState, type FC } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { TextInput, Button } from "@/components/ui";
import { COLOR, RADIUS, SHADOW, TYPOGRAPHY } from "@/lib/design-tokens";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 에러 상태
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // 비밀번호 확인 실시간 검증
  function handlePasswordConfirmChange(value: string) {
    setPasswordConfirm(value);
    if (value && password && value !== password) {
      setPasswordConfirmError("비밀번호가 일치하지 않아요.");
    } else {
      setPasswordConfirmError("");
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    // 이미 입력된 confirm 값과 비교
    if (passwordConfirm && value !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않아요.");
    } else if (passwordConfirm) {
      setPasswordConfirmError("");
    }
  }

  function validate(): boolean {
    let isValid = true;

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 주소를 입력해 주세요.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      setPasswordError("비밀번호는 8자 이상으로 만들어 주세요.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // 비밀번호 일치 검증
    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않아요.");
      isValid = false;
    } else {
      setPasswordConfirmError("");
    }

    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setIsLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=/onboarding`,
      },
    });

    if (error) {
      if (
        error.message.includes("User already registered") ||
        error.message.includes("already_exists") ||
        error.message.includes("user_already_exists")
      ) {
        setEmailError("이미 사용 중인 이메일이에요. 로그인해 보세요.");
      } else {
        setGeneralError("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
      }
      setIsLoading(false);
    } else if (data.session) {
      // 이메일 인증 비활성화 상태 — 즉시 세션 발급됨
      router.push("/onboarding");
    } else {
      // 이메일 인증 필요 — 메일 확인 안내
      router.push(`/signup/check-email?email=${encodeURIComponent(email)}`);
    }
  }

  const hasError = !!(emailError || passwordError || passwordConfirmError || generalError);

  return (
    <div
      className="signup_page_wrap"
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
        className="signup_card_wrap"
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
        {/* 제목 */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              ...TYPOGRAPHY.STYLE.H2,
              color: COLOR.TEXT_PRIMARY,
              marginBottom: "8px",
            }}
          >
            계정 만들기
          </h1>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            이메일과 비밀번호로 가입해요.
          </p>
        </div>

        {/* 일반 에러 배너 */}
        {generalError && (
          <div
            style={{
              backgroundColor: COLOR.NEGATIVE_BG,
              border: `1px solid ${COLOR.NEGATIVE_LIGHT}`,
              borderRadius: RADIUS.MD,
              padding: "12px 16px",
              marginBottom: "16px",
            }}
          >
            <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.NEGATIVE }}>{generalError}</p>
          </div>
        )}

        {/* 가입 폼 */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextInput
            label="이메일"
            type="email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (emailError) setEmailError("");
            }}
            placeholder="이메일 주소를 입력해 주세요"
            required
            state={emailError ? "error" : "default"}
            errorMessage={emailError || undefined}
          />

          <TextInput
            label="비밀번호"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="8자 이상 입력해 주세요"
            required
            state={passwordError ? "error" : "default"}
            errorMessage={passwordError || undefined}
            rightSlot={
              <PasswordToggleButton
                isVisible={isPasswordVisible}
                onToggle={() => setIsPasswordVisible((v) => !v)}
              />
            }
          />

          <TextInput
            label="비밀번호 확인"
            type={isPasswordConfirmVisible ? "text" : "password"}
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            placeholder="비밀번호를 다시 입력해 주세요"
            required
            state={passwordConfirmError ? "error" : "default"}
            errorMessage={passwordConfirmError || undefined}
            rightSlot={
              <PasswordToggleButton
                isVisible={isPasswordConfirmVisible}
                onToggle={() => setIsPasswordConfirmVisible((v) => !v)}
              />
            }
          />

          <div style={{ marginTop: "8px" }}>
            <Button
              type="submit"
              variant="solid"
              size="lg"
              loading={isLoading}
              disabled={hasError && !isLoading}
              className="w-full"
            >
              가입하기
            </Button>
          </div>
        </form>

        {/* 로그인 링크 */}
        <p
          style={{
            ...TYPOGRAPHY.STYLE.BODY_2,
            color: COLOR.TEXT_MUTED,
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          이미 계정이 있어요?{" "}
          <Link
            href="/login"
            style={{
              color: COLOR.ACCENT,
              fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM,
              textDecoration: "none",
            }}
          >
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── 아이콘 컴포넌트 ──────────────────────────────────────────────────────────

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
