# OPINION Monetization Rules

`src/app/api/billing/**`, `src/app/api/credits/**`, `src/components/billing/**`, `src/components/pricing/**` 에 적용.

---

## 1. 구독 플랜 정의

플랜 값은 항상 `'free' | 'pro' | 'max'` 리터럴 타입 사용. string 타입 금지.

| 플랜 | 월 요금 | AI 크레딧/월 | 설문 제한 | 출금 수수료 |
| ---- | ------- | ------------ | --------- | ----------- |
| free | $0      | 0            | 3개       | 8%          |
| pro  | $29     | 200          | 무제한    | 8%          |
| max  | $59     | 600          | 무제한    | 6%          |

---

## 2. AI 크레딧 규칙

### 차감 전 반드시 확인

- 잔량 부족 시 AI 액션 실행 전에 차단 (실행 후 차감 금지)
- Free 플랜은 크레딧 잔량 여부와 무관하게 AI 기능 차단

### 크레딧 부족 에러 메시지

```
"크레딧이 부족해요. 충전 후 이용해 주세요."
```

HTTP 402 반환.

### 액션별 크레딧 소비량 (기준값)

| 액션           | 소비 크레딧 |
| -------------- | ----------- |
| 설문 초안 생성 | 50          |
| 질문 개선      | 15          |
| 결과 분석 요약 | 80          |
| 인사이트 생성  | 60          |

### 크레딧 트랜잭션 기록 필수

AI 기능 사용 시 반드시 `ai_credit_transactions` 테이블에 기록. 기록 실패 시 액션 롤백.

---

## 3. 출금 수수료 규칙

- 수수료율: Free/Pro 8%, Max 6%
- 최소 수수료: ₩500 (수수료 계산값이 500원 미만이면 500원 적용)
- 최소 출금 금액: ₩10,000
- 출금 금액 미만 시 에러: `"최소 출금 금액은 10,000P예요."`

```typescript
// 수수료 계산 예시
function calcWithdrawalFee(amount: number, plan: "free" | "pro" | "max"): number {
  const rate = plan === "max" ? 0.06 : 0.08;
  return Math.max(500, Math.floor(amount * rate));
}
```

---

## 4. 플랜 게이팅 규칙

### 설문 생성 제한 (Free)

Free 플랜 유저가 설문 4개 이상 생성 시도 시:

```
"설문은 최대 3개까지 만들 수 있어요. Pro로 업그레이드하면 무제한으로 만들 수 있어요."
```

### AI 기능 접근 (Free)

Free 플랜에서 AI 기능 접근 시:

```
"AI 기능은 Pro 이상 플랜에서 사용할 수 있어요."
```

### 응답자 풀 접근 (Max 전용)

Max 미만 플랜에서 응답자 풀 접근 시:

```
"응답자 풀은 Max 플랜 전용 기능이에요."
```

---

## 5. Stripe 연동 규칙

- Stripe secret key는 서버 사이드 전용 (`STRIPE_SECRET_KEY`)
- Publishable key만 클라이언트 노출 가능 (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
- Webhook 검증 반드시 수행 (`stripe.webhooks.constructEvent`)
- Webhook 미검증 시 400 반환, 처리 중단
- 구독 상태는 Stripe가 source of truth — DB는 Stripe 상태를 미러링

---

## 6. 크레딧 추가 구매 가격

| 플랜 | 패키지      | 가격 |
| ---- | ----------- | ---- |
| pro  | +100 크레딧 | $8   |
| max  | +100 크레딧 | $7   |

Free 플랜은 크레딧 추가 구매 불가 — Pro 업그레이드 유도.
