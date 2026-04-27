"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { Button } from "@/components/ui";

function PaymentSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [creditsAdded, setCreditsAdded] = useState<number | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!paymentKey || !orderId || !amount) {
      setErrorMessage("결제 정보가 올바르지 않아요. 다시 시도해 주세요.");
      setStatus("error");
      return;
    }

    async function confirm() {
      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const msg =
            data.error === "order_already_processed"
              ? "이미 처리된 결제예요."
              : data.error === "amount_mismatch"
                ? "결제 금액이 일치하지 않아요. 고객센터에 문의해 주세요."
                : "결제 처리 중 오류가 생겼어요. 잠시 후 다시 시도해 주세요.";
          setErrorMessage(msg);
          setStatus("error");
          return;
        }

        const data = await res.json();
        setCreditsAdded(data.credits);
        sessionStorage.removeItem("toss_order_id");
        setStatus("success");
      } catch {
        setErrorMessage("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
        setStatus("error");
      }
    }

    confirm();
  }, [paymentKey, orderId, amount]);

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
        <Button variant="neutral" size="md" onClick={() => router.push("/my/point")}>
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
        <h1 style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>크레딧이 추가됐어요</h1>
        {creditsAdded != null && (
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            +{creditsAdded}크레딧이 지급됐어요.
          </p>
        )}
      </div>

      <Button
        variant="solid"
        size="lg"
        onClick={() => router.push("/my/point")}
        className="w-full max-w-[320px]"
      >
        크레딧 확인하기
      </Button>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
