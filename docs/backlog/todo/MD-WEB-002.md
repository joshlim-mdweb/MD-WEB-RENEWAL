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
updated: "2026-08-05"
sprint: "W17"
policy_refs:
  - "docs/policy/plan.md"
  - "docs/policy/member.md"
  - "docs/policy/plan-card.md"
  - "requirements/[MD-SITE]-checkout-feature-spec.md"
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
플랜 선택 → Checkout 단일 페이지 → PG (카드 / PayPal / AliPay(중국))
```

---

## 화면 구성

### Checkout 페이지: "Set up your license"

**Card 1 — 라이선스 설정**

노출 순서는 고정이다. 축 B는 사용자가 고르지 않고 **시스템이 판정**하며, SW Account 선택 과정 안에서 결과를 표시한다 (선택된 계정의 라이선스 상태에 종속).

| # | 필드 | 표시 조건 | 형태 |
|---|------|-----------|------|
| 1 | Product | 항상 (read-only) | 텍스트 |
| 2 | Billing | 항상 | Yearly / Monthly 카드 토글 (플랜별 고정 여부는 아래 분기표) |
| 3 | SW Account | Enterprise · Academic | 기존: 드롭다운 / 신규: 인라인 생성. **Indie는 미노출** (Enduser ID 1개 고정) |
| 4 | 축 B 판정 결과 | Enterprise · Academic · Indie | 시스템 판정. New / Extend 결과와 근거(현재 만료일 → 구매 후 만료일) 표시. **선택 컨트롤 없음** |
| 5 | 구매 유형 — 축 A (Seat 수량) | Enterprise Team · Team Linux · Academic · Indie | 신규 구매 / Add |
| 6 | Seats | Enterprise Team · Team Linux · Academic · Indie | 프리셋 칩. Enterprise `[5][10][20][직접 입력]` · Academic `[1][5][10][직접 입력]` · Indie `[1][5]` |

**구매 유형 2원 구조**

두 축은 독립이며 동시에 성립한다.

축 A — Seat 수량

| 값 | 의미 |
|------|------|
| 신규 구매 | 라이선스를 처음 구매 |
| Add | 기존 Organization에 수량 추가 |

축 B — 선택한 SW Account 처리

| 값 | 조건 | 결과 |
|------|------|------|
| New | 라이선스 없는 계정 (신규 생성 포함) | 신규 할당. 시작일 = 결제일 |
| Extend | 활성 라이선스 보유 | 기존 만료일 이후로 기간 연장 |

플랜별 허용

| 플랜 | 축 A | 축 B |
|------|------|------|
| Enterprise Single | 신규만 (Seat 1) | New · Extend |
| Enterprise Team · Team Linux | 신규 · Add | New · Extend |
| Academic Annual | 신규 · Add | New · Extend |
| **Indie Annual** | 신규 · **Add** | **New만 — Extend 불가** |

> Indie: Enduser ID 1개 고정, 최대 5개 네트워크 온라인 라이선스. 최초 구매 후 추가 결제는 지정된 Enduser에 **Add만** 가능하다 (MDWEB-590). SW Account 선택 단계 자체가 없다.

**Card 2 — 결제 정보**

| 필드 | 설명 |
|------|------|
| Billing Address | 개인 계열 → 개인 주소 / Organization 계열 → 조직 주소. 있으면 표시 + [수정] 버튼(모달), 없으면 Checkout에서 모달로 생성 |
| 국가 · 주(미국만) · ZIP | Billing Address 안에서 입력. **세율·결제 수단 결정 입력.** 별도 Country 드롭다운 없음 |
| 가격 재조회 | 주소 저장 성공 후 1회 호출 → 화면 금액 갱신 |
| Payment Method | **Billing Address 국가** 기준 카드형 선택 — 중국(접속 IP 또는 선택 국가): 카드 + AliPay / 그 외(한국 포함): 카드 + PayPal |

> **Kakao Pay는 제공하지 않는다.** 한국도 카드 + PayPal이다.
> 주소 또는 ZIP이 없으면 가격 미확정 → CTA 비활성. 주소 유효성 검사는 **PG 이동 직전**에 수행한다.

**하단**

| 요소 | 설명 |
|------|------|
| Terms Disclosure | 구독 갱신·환불 안내 7개 항목 |
| Terms Agreement | 체크박스 2개 (이용약관 · 결제조건) |
| CTA 버튼 | 선택 PM 따라 텍스트 변경 (아래 UX Writing 참고) |

### 플랜별 분기 요약

계정 유형이 아니라 **플랜 8종**을 기준으로 분기한다. 개인 계열(Individual M·A / Student M)은 Seat 1 고정, SW Account 없음, 개인 주소. Organization 계열(Enterprise 3종 / Academic / Indie)은 SW Account 지정, 조직 주소.

| 항목 | Indiv M | Indiv A | Student M | Ent Single | Ent Team | Ent Linux | Academic | Indie |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 지불 방식 토글 | 월·연 | 월·연 | 월 고정 | 월 고정 | 연 고정 | 연 고정 | 연 고정 | 연 고정 |
| Trial 진입 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Student Benefit 표기 | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| SW Account 지정 | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | 1개 고정 |
| 구매 유형 축 A (수량) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| 구매 유형 축 B (계정) | ❌ | ❌ | ❌ | 판정 | 판정 | 판정 | 판정 | New 고정 |
| Seat 선택 | 1 | 1 | 1 | 1 | 프리셋 | 프리셋 | 프리셋 | 최대 5 |
| 주소 출처 | 개인 | 개인 | 개인 | 조직 | 조직 | 조직 | 조직 | 조직 |
| 쿠폰 입력 | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

- 쿠폰은 **개인 플랜 Checkout 전용**이며 그중 Annual만 가능. Organization 계열은 입력 UI 미노출
- Seat 프리셋: Enterprise Team·Team Linux `[5][10][20][직접 입력]` · Academic `[1][5][10][직접 입력]` · Indie `[1][5]`
- 소계: Individual M $39.00 / Individual A $280.00 / Student M $8.25(Benefit 기간 중 $0.00) / Ent Single $199.00 / Ent Team $2,000×Seat / Ent Team Linux $2,300×Seat / Academic $1,500×Seat / Indie $800×라이선스 수(최대 5)

### Figma 스토리보드 (2026-RENEWAL 파일)

| 노드 | 화면 |
|------|------|
| `1487:231` | Individual / Student |
| `1487:325` | Organization 신규 (SW Account 생성 + Seats) |
| `1487:419` | Organization 기존 (SW Account 드롭다운 + 축 B 판정 표시 + Seats) |
| `1800:72` | Indie (SW Account 미노출, 축 B New 고정, max 5 라이선스) |
| `1803:93` | Global — PayPal 결제수단 (Billing Address 국가: United States) |

> 위 프레임은 구 구조(License ID · Extend/Reserve 2종) 기준으로 그려져 있다. 2원 구조 반영 재작업 필요.

**DOC 페이지 (2026-RENEWAL > DOC)**

| 섹션 | 내용 |
|------|------|
| COVER | `[MD\|SITE] Checkout Redesign` 커버 |
| Page 1 | Background & Feature Specs (AS-IS/TO-BE, 요구사항, 회원 타입 분기) |
| Page 2 | Flow & History (메인 플로우, 예외 플로우, UX Writing, 히스토리) |

---

## 완료 조건 (Definition of Done)

- [ ] Individual/Student: SW Account · 구매 유형 · Seats 미표시 확인
- [ ] Student: 월 고정. 지불 방식 토글 미노출
- [ ] Organization 신규: SW Account 인라인 생성 (모달 없음)
- [ ] Organization 기존: SW Account 드롭다운 + 축 B 판정 결과(New / Extend) 표시
- [ ] 축 B에 사용자 선택 컨트롤이 없음 (시스템 판정 결과만 표시)
- [ ] Reserve 선택지가 어디에도 없음
- [ ] Indie: SW Account 선택 단계 미노출 + 축 B는 New 고정
- [ ] Enterprise Team · Team Linux · Academic · Indie: 축 A(신규 구매 / Add) 노출
- [ ] Billing Address 없을 때 Checkout 모달로 생성 → 저장 후 가격 재조회 1회
- [ ] 주소 또는 ZIP 미입력 시 가격 미확정 + CTA 비활성 (전 국가)
- [ ] Billing Address 국가 변경 시 Payment method 목록 교체 + 기존 선택 해제
- [ ] 중국(접속 IP 또는 선택 국가)에서 AliPay 노출 / 그 외 국가에서 미노출
- [ ] 한국에서 Kakao Pay 미노출 (카드 + PayPal만)
- [ ] 주소 유효성 검사가 PG 이동 직전에 수행됨
- [ ] 결제 확정 시 Avalara commit 수행
- [ ] Payment Method 선택에 따라 CTA 버튼 텍스트 변경
- [ ] sessionStorage로 새로고침·PG 뒤로가기 상태 복원
- [ ] Student 인증 시점 4년 경과 시 진입 차단
- [ ] Indie 5 라이선스 초과 시 블락
- [ ] Academic · Indie 인증 pending 시 진입 차단
- [ ] Non-member Checkout 직접 접근 시 로그인 리다이렉트
- [ ] Individual: Checkout에서 Trial 진입 (Monthly·Annual 선택 → 14일 무료 → 자동 결제)
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

- **단일 페이지 vs 멀티 스텝**: 단일 페이지 — Billing Address·Payment가 상호 의존적이고 플랜별 필드도 동적으로 변하므로, 한 화면에서 전체를 보여주는 게 적합
- **SW Account 신규 생성**: 인라인 입력 — 모달 전환이 현재 이탈의 원인이므로 제거. Team Console에서도 생성 가능
- **축 B는 시스템 판정**: 사용자가 고르지 않는다. SW Account 선택 과정 안에서 판정 결과를 표시한다. Reserve는 제공하지 않는다. 선행 노출 불가
- **sessionStorage**: PG 뒤로가기 복원 목적. localStorage는 범위가 불필요하게 넓으므로 session 사용
- **결제수단 UI**: 카드형 선택. Country 변경 시 PM 카드 목록 즉시 교체 + 기존 선택 초기화

### UX Writing (확정 문구)

| 상황 | 문구 |
|------|------|
| CTA — 카드 선택 | `Check out with Card →` |
| CTA — PayPal 선택 | `Continue to PayPal →` |
| CTA — AliPay 선택 (중국) | `Continue to AliPay →` |
| CTA — Payment Method 미선택 | `Check out →` (disabled) |
| Student 4년 경과 진입 차단 | "학생 플랜 이용 기간이 끝났어요. 일반 플랜을 확인해 보세요." |
| Indie 5 라이선스 초과 | "Indie 플랜은 최대 5개까지예요. 더 필요하다면 Enterprise를 확인해 주세요." |
| Academic · Indie 인증 pending | "인증을 검토하고 있어요. 완료 후 구매할 수 있어요." |
| Non-member 접근 | 로그인 후 Checkout 복귀 (`?redirect=/checkout?plan=xxx`) |
| Trial 중 첫 결제 | "14일 무료 체험 중 — [종료일]에 자동 결제가 시작돼요." |
| Billing Address 국가 변경으로 결제 수단 초기화 | "선택한 결제 수단이 이 국가에서는 지원되지 않아요. 다시 선택해 주세요." |
| 주소·ZIP 미입력 (가격 미확정) | "청구지 주소를 입력하면 최종 금액을 확인할 수 있어요." |

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
| `src/app/api/orders/route.ts` | `seats`, `swAccountId`, `quantityType`, `accountType` 필드 추가 |

### sessionStorage 스키마

```typescript
interface CheckoutSession {
  plan: string;
  billing: 'yearly' | 'monthly';
  swAccountId?: string;
  quantityType?: 'new' | 'add';            // 축 A — Seat 수량
  accountType?: 'new' | 'extend';          // 축 B — 시스템 판정값
  seats?: number;
  billingAddressId?: string;
  paymentMethod: 'card' | 'paypal' | 'alipay';
}
```

### 결제수단 국가별 매핑

```typescript
// 기준은 Billing Address 국가. 접속 IP가 중국이면 주소 입력 전에도 AliPay 노출
const PAYMENT_OPTIONS: Record<string, string[]> = {
  China: ['card', 'alipay'],
  default: ['card', 'paypal'],
};
```

### 예외 처리

| 케이스 | 처리 방법 |
|--------|-----------|
| E1: Organization에 SW Account 없음 | 드롭다운 대신 인라인 생성 |
| E2: Student 인증 시점 4년 경과 | Checkout 진입 차단 + 일반 플랜 CTA |
| E3: Indie 5 라이선스 초과 | 수량 선택 시 블락 + Enterprise CTA |
| E4: Monthly → Annual 전환 (활성 구독 중) | 축 B = Extend로 판정 — 만료 후 적용 안내 안내 |
| E5: Academic · Indie 인증 pending | 진입 차단 + "인증 검토 중" 안내 |
| E6: Billing Address 국가 변경 시 결제 수단 불일치 | 기존 선택 해제 + 인라인 안내 문구 |
| E7: 새로고침 / PG 뒤로가기 | sessionStorage 복원 |
| E8: Non-member 직접 접근 | 로그인 리다이렉트 + redirect 파라미터 |
| E9: PayPal 리다이렉트 | `/api/payments/paypal/success·cancel` 처리 |
| E10: Trial 만료 후 첫 결제 | Trial 배너 표시. 재Trial 불가 처리 |
| E11: Enterprise Team Linux 선택 | 일반 Checkout 진입 (웹 구매 가능) — Seats·연간 일시납 고정 |
| E12: Organization 미보유 상태에서 Organization 계열 구매 | Organization 생성 단계 선행. 이미 1개 보유 시 추가 생성 차단 |
| E13: Indie 추가 결제 | 축 B는 항상 New로 판정. Extend로 판정하지 않음 |
| E14: Billing Address 없음 | Checkout 모달로 생성·저장 → 가격 재조회 1회 |
| E15: 주소 유효성 검사 실패 (PG 이동 직전) | PG 이동 중단 + 주소 수정 모달 재노출. 우편번호 없는 국가(홍콩·UAE 등)는 형식만 검사 |

---

## 정책 참고

- **plan.md**: Individual $39/mo · $280/yr, Student $8.25/mo (Monthly only, 최초 인증 시점부터 4년 이내), Enterprise Single $199/mo · Team $2,000/yr · Team Linux $2,300/yr, Academic $1,500/seat/yr, Indie $800/yr (max 5)
- **member.md**: 계정 유형 — Non-Member · Member(인증 없음) · Member(Student 인증) · Organization Owner(인증 없음 / Academic / Indie). SW Account는 Web 로그인 불가
- **plan-card.md**: 구매 자격은 "그 플랜을 살 자격"만 판정. 다른 플랜 보유 여부는 막지 않음
- **`requirements/[MD-SITE]-checkout-feature-spec.md`**: 본 문서의 기준 명세 (2026-08-05 확정)

---

## CS 문의 예상 지점

- **"왜 결제수단이 바뀌었나요?"**: Billing Address 국가 변경 시 자동 초기화 — 인라인 안내 문구로 사전 고지
- **"카카오페이는 없나요?"**: 제공하지 않음. 한국도 카드 + PayPal
- **"Indie인데 기간 연장이 안 돼요"**: Indie는 Add만 가능하고 Extend는 불가 — 구조상 제약
- **"인증은 언제 완료되나요?"**: 인증 대기 화면에서 소요 시간 미노출 (현행 정책 유지)
- **"이미 Trial 사용했는데 또 Trial 받을 수 있나요?"**: Trial 이력 있으면 재Trial 차단 처리 필요
