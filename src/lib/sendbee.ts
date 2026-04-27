// 센드비 B2B 기프티콘 발송 클라이언트
//
// SENDBEE_API_KEY=mock 이면 mock 응답 반환 (계약 완료 전 개발 가능).
// 실제 계약 후 SENDBEE_API_KEY와 SENDBEE_API_URL을 설정하면 실 API로 전환됨.

export interface SendGifticonParams {
  phone: string;
  productCode: string;
  recipientName?: string;
}

export interface SendGifticonResult {
  orderId: string;
  success: boolean;
}

export async function sendGifticon(params: SendGifticonParams): Promise<SendGifticonResult> {
  const apiKey = process.env.SENDBEE_API_KEY;

  if (!apiKey || apiKey === "mock") {
    // 센드비 계약 전 mock — 실제 발송 없이 성공 응답 반환
    return {
      orderId: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      success: true,
    };
  }

  const apiUrl = process.env.SENDBEE_API_URL;
  if (!apiUrl) {
    throw new Error("SENDBEE_API_URL is not configured");
  }

  const response = await fetch(`${apiUrl}/v1/gifticons/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      phone: params.phone,
      product_code: params.productCode,
      recipient_name: params.recipientName ?? "",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Sendbee API error: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { order_id: string };
  return {
    orderId: data.order_id,
    success: true,
  };
}
