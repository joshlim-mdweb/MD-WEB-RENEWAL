import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { COLOR, RADIUS, SHADOW, TYPOGRAPHY } from "@/lib/design-tokens";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      className="onboarding_page_wrap"
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
        className="onboarding_card_wrap"
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
        {/* 환영 아이콘 */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: COLOR.ACCENT_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <WaveIcon />
        </div>

        {/* 환영 제목 */}
        <h1
          style={{
            ...TYPOGRAPHY.STYLE.H2,
            color: COLOR.TEXT_PRIMARY,
            marginBottom: "12px",
          }}
        >
          OPINION에 오신 걸 환영해요
        </h1>

        {/* 부제 */}
        <p
          style={{
            ...TYPOGRAPHY.STYLE.BODY_1,
            color: COLOR.TEXT_SECONDARY,
            marginBottom: "40px",
          }}
        >
          설문을 만들어 진짜 의견을 모아보세요.
        </p>

        {/* CTA 버튼들 — 클라이언트 컴포넌트로 분리 */}
        <OnboardingClient />
      </div>
    </div>
  );
}

function WaveIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <text x="0" y="24" fontSize="24" style={{ userSelect: "none" }}>
        👋
      </text>
    </svg>
  );
}
