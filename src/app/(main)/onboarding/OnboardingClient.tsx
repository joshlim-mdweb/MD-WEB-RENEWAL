"use client";

import { Button } from "@/components/ui";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OnboardingClient() {
  const router = useRouter();

  return (
    <div
      className="onboarding_cta_area"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}
    >
      <Button
        variant="solid"
        size="lg"
        className="w-full max-w-[320px]"
        onClick={() => router.push("/builder")}
      >
        첫 설문 만들기
      </Button>

      <Link
        href="/"
        style={{
          ...TYPOGRAPHY.STYLE.BODY_2,
          color: COLOR.TEXT_MUTED,
          textDecoration: "none",
          padding: "8px 16px",
          display: "inline-block",
        }}
      >
        나중에 하기
      </Link>
    </div>
  );
}
