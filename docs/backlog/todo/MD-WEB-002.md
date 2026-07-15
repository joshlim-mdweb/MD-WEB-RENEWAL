---
id: "MD-WEB-002"
title: "Checkout 플로우 리디자인 — 8단계 → 단일 페이지"
priority: "P1"
status: "ready"
agents:
  - owner: "md-fe"
  - reviewer: "md-qa"
  - consulted: ["md-be", "md-design"]
created: "2026-04-28"
updated: "2026-05-07"
sprint: "W17"
policy_refs:
  - "docs/policy/plan.md"
  - "docs/policy/member.md"
code_refs:
  - "src/app/(marketing)/checkout/page.tsx"
  - "src/app/api/orders/route.ts"
  - "src/lib/checkout-session.ts"
---

## 목적

결제 단계가 8단계에 달해 중간 이탈이 발생하는 현재 구조를, 단일 "Set up your license" 페이지로 통합하여 결제 완료율을 높인다.
현재 구조는 License ID 모달·구매타입 선택 스텝·청구지주소 분리 등으로 인해 상태가 유실되고, 신규/기존 사용자 구분 없이 동일한 단계를 강제하고 있다.

---

## 현황

### AS-IS — 8단계

```
플랜 선택
  → 구매타입 선택 (별도 스텝)
    → License ID 모달 팝업
      → 추가라이선스 (신규에게도 노출 — 버그)
        → 주문확인 (확인 버튼)
          → 다음 (비활성 상태)
            → 청구지주소 (저장 후 결제수단 활성화)
              → 약관 체크박스 2개 + Stripe 카드 재입력
```

**문제:**
- 단계마다 새로고침하면 처음부터 다시 입력
- 신규 CompanyID 사용자에게 "추가라이선스" UI가 노출되는 버그
- "다음" 버튼이 비활성 상태로 노출 → 사용자 혼란

### TO-BE — 2단계

```
플랜 선택 → Checkout 단일 페이지 → PG (Stripe / Kakao Pay / PayPal)
```

---

## 화면 구성

### Checkout 페이지: "Set up your license"

**Card 1 — 라이선스 설정**

| 필드 | 표시 조건 | 형태 |
|------|-----------|------|
| Product | 항상 (read-only) | 텍스트 |
| Billing | 항상 | Yearly / Monthly 카드 토글 |
| License ID | CompanyID · Academic · Indie | 기존: 드롭다운 / 신규: 인라인 텍스트 입력 |
| Purchase Type | CompanyID · Academic · Indie | Extend / Reserve 라디오. Indie는 Extend only |
| Seats | CompanyID · Academic | 1 / 5 / 10 / Custom 칩 선택 |

**Card 2 — 결제 정보**

| 필드 | 설명 |
|------|------|
| Country | 드롭다운. IP 자동감지 기본값, 수동 변경 가능 |
| Payment Method | Country 기준 카드형 선택 (Korea: Stripe · Kakao Pay / Global: Stripe · PayPal) |

**하단**

| 요소 | 설명 |
|------|------|
| Terms Disclosure | 구독 갱신·환불 안내 7개 항목 |
| Terms Agreement | 체크박스 2개 (이용약관 · 결제조건) |
| CTA 버튼 | 선택 PM 따라 텍스트 변경 (아래 UX Writing 참고) |

### 회원 타입별 분기 요약

| 항목 | Individual | Student | CompanyID | Academic | Indie |
|------|:---:|:---:|:---:|:---:|:---:|
| Billing | 월·연 | 연 only | 월·연 | 연 only | 연 only |
| License ID | ❌ | ❌ | ✅ | ✅ | ✅ |
| Purchase Type | ❌ | ❌ | ✅ | ✅ | Extend only |
| Seats | ❌ | ❌ | ✅ | ✅ | 최대 5 |

### Figma 스토리보드 (2026-RENEWAL 파일)

| 노드 | 화면 |
|------|------|
| `1487:231` | Individual / Student |
| `1487:325` | CompanyID 신규 (License ID 드롭다운 + Seats) |
| `1487:419` | CompanyID 기존 (드롭다운 + Extend / Reserve + Seats) |
| `1800:72` | Indie (Extend only, max 5 seats) |
| `1803:93` | Global — PayPal 결제수단 (Country: United States) |

**DOC 페이지 (2026-RENEWAL > DOC)**

| 섹션 | 내용 |
|------|------|
| COVER | `[MD\|SITE] Checkout Redesign` 커버 |
| Page 1 | Background & Feature Specs (AS-IS/TO-BE, 요구사항, 회원 타입 분기) |
| Page 2 | Flow & History (메인 플로우, 예외 플로우, UX Writing, 히스토리) |

---

## 완료 조건 (Definition of Done)

- [ ] Individual/Student: License ID · Purchase Type · Seats 미표시 확인
- [ ] Student: Billing Monthly 비활성 처리
- [ ] CompanyID 신규: License ID 인라인 생성 (모달 없음)
- [ ] CompanyID 기존: License ID 드롭다운 + Extend / Reserve 분기
- [ ] Country 변경 시 Payment method 목록 교체 + 기존 선택 해제
- [ ] PM 선택에 따라 CTA 버튼 텍스트 변경
- [ ] sessionStorage로 새로고침·PG 뒤로가기 상태 복원
- [ ] Student 2회 구매 초과 시 진입 차단
- [ ] Indie 5 Copy 초과 시 Seats 블락
- [ ] Academic · Indie 인증 pending 시 진입 차단
- [ ] Non-member Checkout 직접 접근 시 로그인 리다이렉트
- [ ] Trial 중 첫 결제: 만료일 안내 배너 표시
- [ ] TypeScript strict 통과
- [ ] `npx tsc --noEmit && npm run lint && npm run build` 통과
- [ ] QA 시나리오 통과

---

## UX 리서치

### 레퍼런스 패턴

| 서비스 | 패턴 | MD 적용 포인트 |
|--------|------|----------------|
| Cursor | Stripe 호스티드 페이지로 직행. 커스텀 입력 최소화 | "최대한 빨리 PG로 넘긴다" 방향 채택 |
| Baymard | 결제수단 선택 = 카드형 UI. 드롭다운 금지 | PM 선택 카드형으로 구현 |
| Baymard | CTA 버튼 텍스트를 선택 PM에 맞게 변경 | PM별 버튼 텍스트 분기 |

### 핵심 UX 결정

- **단일 페이지 vs 멀티 스텝**: 단일 페이지 — Country·Payment가 상호 의존적이고 회원 타입별 필드도 동적으로 변하므로, 한 화면에서 전체를 보여주는 게 적합
- **License ID 신규 생성**: 인라인 입력 — 모달 전환이 현재 이탈의 원인이므로 제거
- **sessionStorage**: PG 뒤로가기 복원 목적. localStorage는 범위가 불필요하게 넓으므로 session 사용
- **결제수단 UI**: 카드형 선택. Country 변경 시 PM 카드 목록 즉시 교체 + 기존 선택 초기화

### UX Writing (확정 문구)

| 상황 | 문구 |
|------|------|
| CTA — Stripe 선택 | `Check out with Card →` |
| CTA — Kakao Pay 선택 | `Continue to Kakao Pay →` |
| CTA — PayPal 선택 | `Continue to PayPal →` |
| CTA — PM 미선택 | `Check out →` (disabled) |
| Student 2회 초과 진입 차단 | "학생 플랜은 최대 2회 구매할 수 있어요. 일반 플랜을 확인해 보세요." |
| Indie 5 Copy 초과 | "Indie 플랜은 최대 5 Copy예요. 더 필요하다면 Enterprise를 문의해 주세요." |
| Academic · Indie 인증 pending | "인증을 검토하고 있어요. 완료 후 구매할 수 있어요." |
| Non-member 접근 | 로그인 후 Checkout 복귀 (`?redirect=/checkout?plan=xxx`) |
| Trial 중 첫 결제 | "14일 무료 체험 중 — [종료일]에 자동 결제가 시작돼요." |
| Country 변경으로 PM 초기화 | "선택한 결제 수단이 이 국가에서는 지원되지 않아요. 다시 선택해 주세요." |

---

## 구현 힌트

### 신규 파일

| 파일 | 역할 |
|------|------|
| `src/app/(marketing)/checkout/page.tsx` | 단일 페이지 폼 |
| `src/lib/checkout-session.ts` | sessionStorage 상태 관리 |
| `src/app/api/payments/paypal/success/route.ts` | PayPal 성공 콜백 |
| `src/app/api/payments/paypal/cancel/route.ts` | PayPal 취소 콜백 |

### 기존 파일 수정

| 파일 | 변경 내용 |
|------|-----------|
| `src/app/api/orders/route.ts` | `seats`, `licenseId`, `purchaseType` 필드 추가 |

### sessionStorage 스키마

```typescript
interface CheckoutSession {
  plan: string;
  billing: 'yearly' | 'monthly';
  licenseId?: string;
  purchaseType?: 'extend' | 'reserve';
  seats?: number;
  country: string;
  paymentMethod: 'stripe' | 'kakao' | 'paypal';
}
```

### 결제수단 국가별 매핑

```typescript
const PAYMENT_OPTIONS: Record<string, string[]> = {
  'South Korea': ['stripe', 'kakao'],
  default: ['stripe', 'paypal'],
};
```

### 예외 처리

| 케이스 | 처리 방법 |
|--------|-----------|
| E1: CompanyID License ID 없음 | 드롭다운 대신 인라인 텍스트 입력 |
| E2: Student 구매 2회 초과 | Checkout 진입 차단 + 일반 플랜 CTA |
| E3: Indie 5 Copy 초과 | Seats 선택 시 블락 + Enterprise CTA |
| E4: Monthly → Annual 전환 (활성 구독 중) | Extend: 만료 후 적용 안내 / Reserve: 예약 안내 |
| E5: Academic · Indie 인증 pending | 진입 차단 + "인증 검토 중" 안내 |
| E6: Country 변경 시 PM 불일치 | 기존 선택 해제 + 인라인 안내 문구 |
| E7: 새로고침 / PG 뒤로가기 | sessionStorage 복원 |
| E8: Non-member 직접 접근 | 로그인 리다이렉트 + redirect 파라미터 |
| E9: PayPal 리다이렉트 | `/api/payments/paypal/success·cancel` 처리 |
| E10: Trial 만료 후 첫 결제 | Trial 배너 표시. 재Trial 불가 처리 |
| E11: Enterprise Offline 선택 | Contact Sales CTA로 리다이렉트 |

---

## 정책 참고

- **plan.md**: Individual $39/mo · $280/yr, Student $99/yr (max 2회), Enterprise $199/seat/mo · $2,000/yr, Academic $1,500/copy/yr, Indie $800/yr (max 5 copy)
- **member.md**: MemberType 7종 — Non-Member · Individual · Student · CompanyID · Academic · Indie · License ID

---

## CS 문의 예상 지점

- **"왜 결제수단이 바뀌었나요?"**: Country 변경 시 자동 초기화 — 인라인 안내 문구로 사전 고지
- **"인증은 언제 완료되나요?"**: 인증 대기 화면에서 소요 시간 미노출 (현행 정책 유지)
- **"이미 Trial 사용했는데 또 Trial 받을 수 있나요?"**: Trial 이력 있으면 재Trial 차단 처리 필요
