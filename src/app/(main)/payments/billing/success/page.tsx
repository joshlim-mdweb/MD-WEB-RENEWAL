"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { Button } from "@/components/ui";

function BillingSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  const authKey = params.get("authKey");
  const customerKey = params.get("customerKey");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [plan, setPlan] = useState<"pro" | "max" | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!authKey || !customerKey) {
      setErrorMessage("결제 정보가 올바르지 않아요. 다시 시도해 주세요.");
      setStatus("error");
      return;
    }

    const orderId = sessionStorage.getItem("toss_order_id");
    const savedPlan = sessionStorage.getItem("toss_plan") as "pro" | "max" | null;

    if (!orderId) {
      setErrorMessage("주문 정보를 찾을 수 없어요. 다시 시도해 주세요.");
      setStatus("error");
      return;
    }

    if (savedPlan) setPlan(savedPlan);

    async function confirm() {
      try {
        const res = await fetch("/api/payments/billing/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authKey, customerKey, orderId }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const msg =
            data.error === "order_already_processed"
              ? "이미 처리된 결제예요."
              : "결제 처리 중 오류가 생겼어요. 잠시 후 다시 시도해 주세요.";
          setErrorMessage(msg);
          setStatus("error");
          return;
        }

        sessionStorage.removeItem("toss_order_id");
        sessionStorage.removeItem("toss_plan");
        setStatus("success");
      } catch {
        setErrorMessage("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
        setStatus("error");
      }
    }

    confirm();
  }, [authKey, customerKey]);

  const planLabel = plan === "max" ? "Max" : "Pro";

  if (status === "loading") {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-4 px-6"
        style={{ backgroundColor: COLOR.BG_BASE }}
      >
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>
          결제를 처리하고 있어요...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-4 px-6"
        style={{ backgroundColor: COLOR.BG_BASE }}
      >
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>{errorMessage}</p>
        <Button variant="neutral" size="md" onClick={() => router.push("/my")}>
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-6 px-6"
      style={{ backgroundColor: COLOR.BG_BASE }}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#E8F5E9" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#2E7D32"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>
          OPINION {planLabel} 플랜이 시작됐어요
        </h1>
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
          AI 크레딧과 모든 {planLabel} 기능을 이용할 수 있어요.
        </p>
      </div>

      <Button
        variant="solid"
        size="lg"
        onClick={() => router.push("/my")}
        className="w-full max-w-[320px]"
      >
        마이페이지로 가기
      </Button>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense>
      <BillingSuccessContent />
    </Suspense>
  );
}
