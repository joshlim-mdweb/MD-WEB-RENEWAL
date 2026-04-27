"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { Button } from "@/components/ui";

// TossPayments JS SDK from CDN supports requestBillingAuth (payment widget SDK does not)
async function loadTossPaymentsSDK(clientKey: string) {
  return new Promise<{
    requestBillingAuth: (
      method: string,
      options: {
        customerKey: string;
        successUrl: string;
        failUrl: string;
        customerEmail?: string;
        customerName?: string;
      }
    ) => Promise<void>;
  }>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("SSR not supported"));
      return;
    }
    if ((window as unknown as Record<string, unknown>).TossPayments) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).TossPayments(clientKey));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1/payment";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).TossPayments(clientKey));
    };
    script.onerror = () => reject(new Error("TossPayments SDK 로딩 실패"));
    document.head.appendChild(script);
  });
}

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan") as "pro" | "max" | null;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    orderName: string;
    amount: number;
    customerKey: string;
  } | null>(null);

  const sdkRef = useRef<Awaited<ReturnType<typeof loadTossPaymentsSDK>> | null>(null);

  useEffect(() => {
    if (plan !== "pro" && plan !== "max") {
      router.replace("/my");
      return;
    }

    async function init() {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "subscription", plan }),
        });

        if (res.status === 409) {
          setError("이미 구독 중인 플랜이에요.");
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error("주문 생성 실패");

        const data = await res.json();
        setOrderInfo(data);

        sessionStorage.setItem("toss_order_id", data.orderId);
        sessionStorage.setItem("toss_plan", plan!);

        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
        sdkRef.current = await loadTossPaymentsSDK(clientKey);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("결제 준비 중 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
        setLoading(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  async function handlePay() {
    if (!sdkRef.current || !orderInfo) return;
    setSubmitting(true);
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      await sdkRef.current.requestBillingAuth("카드", {
        customerKey: orderInfo.customerKey,
        successUrl: `${appUrl}/payments/billing/success`,
        failUrl: `${appUrl}/payments/fail`,
      });
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  }

  const planLabel = plan === "pro" ? "Pro" : "Max";
  const planAmount = plan === "pro" ? "19,000" : "39,000";

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-4 px-6"
        style={{ backgroundColor: COLOR.BG_BASE }}
      >
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>{error}</p>
        <Button variant="neutral" size="md" onClick={() => router.push("/my")}>
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
          <h1 style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>
            OPINION {planLabel} 구독
          </h1>
          <p className="mt-1" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            월 ₩{planAmount} · 매월 자동갱신
          </p>
        </div>

        <div
          style={{
            backgroundColor: COLOR.BG_SURFACE,
            borderRadius: 12,
            padding: "20px",
          }}
        >
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            카드를 등록하면 매월 자동으로 결제돼요. 언제든지 해지할 수 있어요.
          </p>
        </div>

        <Button
          variant="solid"
          size="lg"
          loading={submitting}
          disabled={loading || submitting || !orderInfo}
          onClick={handlePay}
          className="w-full"
        >
          {loading ? "준비 중이에요..." : `카드 등록 후 ₩${planAmount} 결제하기`}
        </Button>

        <p
          className="text-center"
          style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}
        >
          결제 후 즉시 {planLabel} 플랜이 활성화돼요
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
