# Billing & Credits API

<!-- version: 2.0.0 | 최초 작성: 2026-04-07 | 최종 수정: 2026-04-13 -->

> ⚠️ Breaking change (2026-04-13): Stripe → TossPayments 전환. `/api/billing/checkout`, `/api/billing/portal`, `/api/billing/webhook` 삭제. 구독 결제는 `/checkout?plan=pro|max`, 크레딧 구매는 `/checkout/credits`로 전환.

---

## 플랜 정의

| 플랜 | 월 요금 | AI 크레딧/월 | 설문 제한 | 출금 수수료 |
| ---- | ------- | ------------ | --------- | ----------- |
| free | ₩0      | 0            | 3개       | 10%         |
| pro  | ₩19,000 | 200          | 무제한    | 8%          |
| max  | ₩39,000 | 600          | 무제한    | 6%          |

---

## 구독 결제 흐름 (TossPayments 빌링키)

```
/checkout?plan=pro|max
  → POST /api/orders { type: "subscription", plan }
  → TossPayments 위젯 (requestBillingAuth)
  → /payments/billing/success?authKey=&customerKey=
      → POST /api/payments/billing/confirm
  → /payments/fail?code=&message= (실패 시)
```

## 크레딧 추가 구매 흐름 (TossPayments 일반 결제)

```
/checkout/credits
  → POST /api/orders { type: "credits" }
  → TossPayments 위젯 (requestPayment)
  → /payments/success?paymentKey=&orderId=&amount=
      → POST /api/payments/confirm
  → /payments/fail?code=&message= (실패 시)
```

---

## GET /api/billing/subscription

> 현재 구독 플랜, AI 크레딧 잔량, 플랜별 한도를 반환합니다. 구독이 없으면 free 플랜 기본값을 내려줍니다.

**인증:** 필요

**Response 200:**

```json
{
  "subscription": {
    "id": "01234567-0000-0000-0000-000000000001",
    "plan": "pro",
    "status": "active",
    "expires_at": "2026-05-13T00:00:00.000Z",
    "created_at": "2026-04-13T00:00:00.000Z",
    "updated_at": "2026-04-13T00:00:00.000Z"
  },
  "plan": "pro",
  "credits": {
    "balance": 185,
    "updatedAt": "2026-04-13T00:00:00.000Z"
  },
  "limits": {
    "surveyLimit": null,
    "monthlyCredits": 200,
    "withdrawalFeeRate": 0.08
  }
}
```

- `subscription`: 활성 구독 없으면 `null` (= free 플랜)
- `plan`: `"free"` \| `"pro"` \| `"max"`
- `limits.surveyLimit`: free=3, pro/max=`null`(무제한)

**에러:**

| Status | error                                             | 설명         |
| ------ | ------------------------------------------------- | ------------ |
| 401    | unauthorized                                      | 미인증       |
| 500    | subscription_fetch_failed \| credits_fetch_failed | DB 조회 실패 |

---

## POST /api/orders

> 결제 전 주문을 생성합니다. 구독(빌링키) 또는 크레딧 추가 구매 모두 이 API로 주문을 먼저 만든 뒤 결제 위젯을 렌더링합니다.

**인증:** 필요

**Request Body:**

```json
{ "type": "subscription", "plan": "pro" }
```

```json
{ "type": "credits" }
```

| 필드 | 타입                      | 필수            | 제약                         |
| ---- | ------------------------- | --------------- | ---------------------------- |
| type | "subscription"\|"credits" | ✅              |                              |
| plan | "pro"\|"max"              | subscription 시 | credits 시 profile.plan 참조 |

**Response 200 — subscription:**

```json
{
  "orderId": "OPIN-A1B2C3D4-1713020400000",
  "orderName": "OPINION Pro",
  "amount": 19000,
  "customerKey": "uuid-of-user"
}
```

**Response 200 — credits:**

```json
{
  "orderId": "OPIN-A1B2C3D4-1713020400000",
  "orderName": "AI 크레딧 100개",
  "amount": 8000,
  "credits": 100
}
```

**에러:**

| Status | error              | 설명                       |
| ------ | ------------------ | -------------------------- |
| 401    | unauthorized       | 미인증                     |
| 403    | credits_pro_only   | Free 플랜 크레딧 구매 불가 |
| 409    | already_subscribed | 이미 활성 구독 있음        |
| 422    | invalid_plan       | pro/max 외 값              |
| 422    | invalid_type       | subscription/credits 외 값 |

---

## POST /api/payments/billing/confirm

> 빌링키 발급 + 첫 결제를 처리합니다. TossPayments 카드 등록 성공 후 `/payments/billing/success` 페이지에서 호출합니다.

**인증:** 필요

**Request Body:**

```json
{
  "authKey": "...",
  "customerKey": "...",
  "orderId": "OPIN-A1B2C3D4-1713020400000"
}
```

**처리 순서:**

1. `POST /v1/billing/authorizations/{authKey}` → billingKey 발급
2. `billing_keys` 테이블 INSERT
3. `POST /v1/billing/{billingKey}` → 즉시 첫 결제
4. `orders.status = 'paid'`
5. `subscriptions` upsert (expires_at = now()+30일)
6. `profile.plan` 업데이트
7. AI 크레딧 월 지급

**Response 200:**

```json
{ "success": true, "plan": "pro", "expiresAt": "2026-05-13T00:00:00.000Z" }
```

**에러:**

| Status | error                | 설명             |
| ------ | -------------------- | ---------------- |
| 401    | unauthorized         | 미인증           |
| 404    | order_not_found      | 주문 없음        |
| 409    | already_processed    | 이미 처리된 주문 |
| 400    | billing_auth_failed  | 빌링키 발급 실패 |
| 400    | first_payment_failed | 첫 결제 실패     |

---

## POST /api/payments/confirm

> 크레딧 추가 구매 서버사이드 승인. TossPayments 결제 성공 후 `/payments/success` 페이지에서 호출합니다.

**인증:** 필요

**Request Body:**

```json
{
  "paymentKey": "...",
  "orderId": "OPIN-A1B2C3D4-1713020400000",
  "amount": 8000
}
```

**보안:** amount를 DB의 orders.amount와 대조 — 불일치 시 400 반환.

**Response 200:**

```json
{ "success": true, "credits": 100, "newBalance": 285 }
```

**에러:**

| Status | error                   | 설명                    |
| ------ | ----------------------- | ----------------------- |
| 401    | unauthorized            | 미인증                  |
| 400    | amount_mismatch         | 금액 불일치 (보안 차단) |
| 404    | order_not_found         | 주문 없음               |
| 403    | forbidden               | 타인의 주문             |
| 409    | order_already_processed | 이미 처리된 주문        |
| 400    | payment_failed          | Toss 승인 실패          |

---

## POST /api/credits/purchase

> 크레딧 추가 구매 플랜 검증 후 체크아웃 URL 반환. Free 플랜은 403. 실제 결제는 `/checkout/credits`에서 처리됩니다.

**인증:** 필요

**Response 200:**

```json
{ "url": "http://localhost:3000/checkout/credits" }
```

**에러:**

| Status | error                                      | 설명           |
| ------ | ------------------------------------------ | -------------- |
| 401    | unauthorized                               | 미인증         |
| 403    | credit_purchase_not_available_on_free_plan | Free 플랜 불가 |

---

## POST /api/payments/webhook

> TossPayments 웹훅 수신. 가상계좌 등 비동기 결제 상태를 처리합니다. 멱등성 보장.

**인증:** 없음 (TossPayments 서버에서 호출)

**지원 이벤트:**

- `PAYMENT_STATUS_CHANGED` — 결제 상태 변화 반영
- `VIRTUAL_ACCOUNT_DEPOSIT` — 가상계좌 입금 완료

---

## POST /api/internal/subscriptions/renew

> Vercel Cron이 매일 00:00에 호출. 만료 예정 구독을 자동갱신합니다.

**인증:** `Authorization: Bearer {CRON_SECRET}` 헤더 필요

**스케줄:** `0 0 * * *` (UTC 00:00)

**동작:**

- expires_at ≤ tomorrow 인 active 구독 조회
- 빌링키로 정기결제 실행
- 성공: expires_at += 30일, 월 크레딧 지급
- 실패: status = past_due, profile.plan = free

---

## GET /api/credits/balance

> 현재 사용자의 AI 크레딧 잔량을 반환합니다.

**인증:** 필요

**Response 200:**

```json
{
  "balance": 185,
  "updatedAt": "2026-04-13T00:00:00.000Z"
}
```

---

## POST /api/credits/use

> AI 크레딧을 차감합니다. Free 플랜은 잔량 무관하게 차단됩니다.

**인증:** 필요

**Request Body:**

```json
{
  "amount": 15,
  "source": "survey_generation"
}
```

**source 허용값:**

| source            | 설명           | 소비 크레딧 (기준) |
| ----------------- | -------------- | ------------------ |
| survey_generation | 설문 초안 생성 | 50                 |
| analysis          | 결과 분석 요약 | 80                 |

**Response 200:**

```json
{ "balance": 170, "deducted": 15 }
```

**에러:**

| Status | error                         | 설명                    |
| ------ | ----------------------------- | ----------------------- |
| 401    | unauthorized                  | 미인증                  |
| 402    | insufficient_credits          | 잔량 부족               |
| 403    | ai_not_available_on_free_plan | Free 플랜 차단          |
| 422    | invalid_amount                | 양의 정수 아님          |
| 422    | invalid_source                | 허용되지 않는 source 값 |

---

## 보안 주의사항

- `TOSS_SECRET_KEY` — 서버 전용, 절대 클라이언트 노출 금지
- `NEXT_PUBLIC_TOSS_CLIENT_KEY` — 클라이언트 노출 허용 (공개 키)
- `CRON_SECRET` — 내부 크론 엔드포인트 인증, 서버 전용
- amount 검증은 서버사이드 DB 값과 대조 — 클라이언트 금액 신뢰 금지
