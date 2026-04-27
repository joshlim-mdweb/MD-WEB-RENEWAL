"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { Button } from "@/components/ui";
import type { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

async function loadWidget(clientKey: string): Promise<PaymentWidgetInstance> {
  const { loadPaymentWidget, ANONYMOUS } = await import("@tosspayments/payment-widget-sdk");
  return loadPaymentWidget(clientKey, ANONYMOUS);
}

function CreditsCheckoutContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    orderName: string;
    amount: number;
    credits: number;
  } | null>(null);

  const widgetRef = useRef<PaymentWidgetInstance | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "credits" }),
        });

        if (res.status === 403) {
          setError("크레딧 추가 구매는 Pro 이상 플랜에서 이용할 수 있어요.");
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error("주문 생성 실패");

        const data = await res.json();
        setOrderInfo(data);

        sessionStorage.setItem("toss_order_id", data.orderId);

        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
        const widget = await loadWidget(clientKey);
        widgetRef.current = widget;

        await Promise.all([
          widget.renderPaymentMethods("#payment-widget", data.amount),
          widget.renderAgreement("#agreement"),
        ]);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("결제 준비 중 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
        setLoading(false);
      }
    }

    init();
  }, []);

  async function handlePay() {
    if (!widgetRef.current || !orderInfo) return;
    setSubmitting(true);
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      await widgetRef.current.requestPayment({
        orderId: orderInfo.orderId,
        orderName: orderInfo.orderName,
        successUrl: `${appUrl}/payments/success`,
        failUrl: `${appUrl}/payments/fail`,
      });
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-4 px-6"
        style={{ backgroundColor: COLOR.BG_BASE }}
      >
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>{error}</p>
        <Button variant="neutral" size="md" onClick={() => router.push("/my/point")}>
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-12 px-4"
      style={{ backgroundColor: COLOR.BG_BASE }}
    >
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div>
          <h1 style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>AI 크레딧 추가 구매</h1>
          {orderInfo && (
            <p className="mt-1" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
              +{orderInfo.credits}크레딧 · ₩{orderInfo.amount.toLocaleString()}
            </p>
          )}
        </div>

        <div
          id="payment-widget"
          style={{
            minHeight: loading ? 200 : undefined,
            backgroundColor: COLOR.BG_SURFACE,
            borderRadius: 12,
          }}
        >
          {loading && (
            <div
              className="flex items-center justify-center"
              style={{ height: 200, color: COLOR.TEXT_DISABLED }}
            >
              <p style={TYPOGRAPHY.STYLE.BODY_2}>결제 수단을 불러오는 중이에요...</p>
            </div>
          )}
        </div>

        <div id="agreement" />

        <Button
          variant="solid"
          size="lg"
          loading={submitting}
          disabled={loading || submitting || !orderInfo}
          onClick={handlePay}
          className="w-full"
        >
          {orderInfo ? `₩${orderInfo.amount.toLocaleString()} 결제하기` : "결제하기"}
        </Button>
      </div>
    </div>
  );
}

export default function CreditsCheckoutPage() {
  return (
    <Suspense>
      <CreditsCheckoutContent />
    </Suspense>
  );
}
