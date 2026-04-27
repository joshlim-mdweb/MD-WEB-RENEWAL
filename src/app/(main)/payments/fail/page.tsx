"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { Button } from "@/components/ui";

const ERROR_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: "결제를 취소했어요.",
  PAY_PROCESS_ABORTED: "결제 도중 오류가 생겼어요. 잠시 후 다시 시도해 주세요.",
  REJECT_CARD_COMPANY: "카드사에서 결제를 거절했어요. 다른 카드로 시도해 보세요.",
  INVALID_CARD_EXPIRATION: "카드 유효기간을 확인해 주세요.",
  INVALID_STOPPED_CARD: "정지된 카드예요. 다른 카드로 시도해 보세요.",
  EXCEED_MAX_DAILY_PAYMENT_COUNT: "일일 결제 한도를 초과했어요.",
  NOT_ENOUGH_BALANCE: "잔액이 부족해요. 충전 후 다시 시도해 주세요.",
  EXCEED_MAX_AMOUNT: "결제 한도를 초과했어요.",
  INVALID_CARD_NUMBER: "카드 번호를 다시 확인해 주세요.",
  CARD_PROCESSING_ERROR: "카드 처리 중 오류가 생겼어요. 잠시 후 다시 시도해 주세요.",
};

const DEFAULT_MESSAGE = "결제 중 오류가 생겼어요. 잠시 후 다시 시도해 주세요.";

function PaymentFailContent() {
  const router = useRouter();
  const params = useSearchParams();

  const code = params.get("code") ?? "";
  const message = params.get("message");
  const orderId = params.get("orderId");

  function handleRetry() {
    const plan = sessionStorage.getItem("toss_plan");
    if (plan === "pro" || plan === "max") {
      router.push(`/checkout?plan=${plan}`);
    } else {
      router.push("/checkout/credits");
    }
  }

  const userMessage = ERROR_MESSAGES[code] ?? (message || DEFAULT_MESSAGE);
  const isCanceled = code === "PAY_PROCESS_CANCELED";

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-6 px-6"
      style={{ backgroundColor: COLOR.BG_BASE }}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: isCanceled ? "#F5F5F5" : "#FFEBEE" }}
        >
          {isCanceled ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#757575"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01"
                stroke="#C62828"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="9" stroke="#C62828" strokeWidth="2" />
            </svg>
          )}
        </div>
        <h1 style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>
          {isCanceled ? "결제를 취소했어요" : "결제에 실패했어요"}
        </h1>
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>{userMessage}</p>
        {orderId && (
          <p style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}>
            주문번호: {orderId}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        {!isCanceled && (
          <Button variant="solid" size="lg" onClick={handleRetry} className="w-full">
            다시 시도하기
          </Button>
        )}
        <Button
          variant="neutral"
          size={isCanceled ? "lg" : "md"}
          onClick={() => router.push("/my")}
          className="w-full"
        >
          마이페이지로 가기
        </Button>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense>
      <PaymentFailContent />
    </Suspense>
  );
}
