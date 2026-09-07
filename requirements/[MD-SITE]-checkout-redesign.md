# [MD|SITE] Checkout 플로우 리디자인

Epic Key: `MDWEB-634` | 요청: Josh Lim | 출처: MD-WEB-002 | 작성일: 2026-05-07
Canvas: [[RENEWAL] Order/Checkout](https://clo3d.slack.com/docs/T04BT3VBR/F0BL0SRE4TZ) · 상위 플랜 정책 [[RENEWAL] Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N)

---

## 배경

현재 결제 플로우는 8단계에 달해 중간 이탈이 빈번히 발생한다. License ID 선택을 별도 모달로 처리하고, 구매타입·청구지주소를 각 스텝으로 분리한 구조가 원인이다. 신규 CompanyID 사용자에게 기존 사용자 전용 UI가 노출되는 버그도 함께 존재한다.

---

## 1. Agenda

| 항목 | 내용 |
|------|------|
| TITLE | Checkout 플로우 리디자인 — 8단계 → 단일 페이지 |
| DESCRIPTION | 결제 완료율 향상을 위해 다단계 구조를 "Set up your license" 단일 페이지로 통합한다 |
| 요청 | Josh Lim |
| DUE DATE | (미정) |

---

## 2. Background

### AS-IS — 8단계 구조

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

**문제점**

- 단계마다 새로고침하면 처음부터 다시 입력해야 한다
- 신규 CompanyID 사용자에게 "추가라이선스" UI가 노출된다
- "다음" 버튼이 비활성 상태로 노출되어 사용자 혼란을 유발한다

### TO-BE — 2단계 구조

```
플랜 선택  →  Checkout 단일 페이지  →  PG (Stripe / Kakao Pay / PayPal)
```

---

## 3. Requirements

| 기능명 | Description |
|--------|-------------|
| 단일 Checkout 페이지 | 사용자는 "Set up your license" 단일 페이지에서 모든 구매 정보를 입력한다 |
| Billing 토글 | 사용자는 Yearly / Monthly를 카드형 토글로 선택한다. Student는 Monthly 비활성 처리한다 |
| License ID 선택 | CompanyID·Academic·Indie 사용자는 기존 License ID를 드롭다운으로 선택한다. 신규는 인라인 텍스트 입력으로 생성한다 |
| Purchase Type 선택 | CompanyID·Academic·Indie 사용자는 Extend / Reserve를 라디오로 선택한다. Indie는 Extend only |
| Seats 선택 | CompanyID·Academic 사용자는 1 / 5 / 10 / Custom 칩으로 좌석 수를 선택한다. Indie는 최대 5 |
| Country 선택 | System은 브라우저 시간대(Intl API) → 언어(`navigator.language`) 순으로 Country 기본값을 감지한다. 사용자는 수동 변경할 수 있다 |
| 결제수단 선택 | 사용자는 Country 기준으로 표시되는 결제수단 카드 중 하나를 선택한다 |
| Order Summary 표시 | System은 사용자가 입력한 플랜·결제주기·시트 수를 기반으로 소계·세금·합계를 CTA 위에 표시한다 |
| 세금(Tax/VAT) 표시 | System은 선택된 Country에 따라 세율을 적용하고 세금 행을 표시한다. 세율이 0%인 국가는 세금 행을 표시하지 않는다 |
| 주소 필드 조건부 표시 | System은 Country 선택 후 주소 입력이 필요한 국가(US·CA)에 한해 State·ZIP 입력 필드를 결제 정보 카드 내에 표시한다 |
| EU VAT ID 입력 | System은 EU 국가 선택 시 사업자 VAT ID 입력 필드(선택)를 노출한다. VAT ID 입력 시 역과세(0%) 처리한다 |
| 약관 동의 | 사용자는 이용약관 및 결제조건 체크박스 2개에 동의한 후 결제를 진행한다 |
| CTA 버튼 동적 텍스트 | System은 선택된 결제수단에 따라 CTA 버튼 텍스트를 변경한다 |
| 진입 차단 | System은 Student 인증 시점 4년 경과·Academic/Indie 인증 Pending·Non-member 직접 접근 시 Checkout 진입을 차단한다 |
| 상태 복원 | System은 새로고침·PG 뒤로가기 시 sessionStorage에서 이전 입력값을 복원한다 |

---

## 4. Scope

### 4.1 Web — Checkout 페이지

- 단일 "Set up your license" 페이지 구현
- 회원 타입별 동적 필드 분기 (아래 표 참고)
- Country 선택 시 결제수단 목록 동적 교체
- 결제수단 선택에 따른 CTA 버튼 텍스트 변경
- sessionStorage 상태 관리 (새로고침·PG 뒤로가기 복원)

**회원 타입별 필드 분기**

| 항목 | Individual | Student | CompanyID | Academic | Indie |
|------|:---:|:---:|:---:|:---:|:---:|
| Billing 토글 | 월·연 | 연 only | 월·연 | 연 only | 연 only |
| License ID | ❌ | ❌ | ✅ | ✅ | ✅ |
| Purchase Type | ❌ | ❌ | ✅ Extend/Reserve | ✅ Extend/Reserve | Extend only |
| Seats | ❌ | ❌ | ✅ | ✅ | 최대 5 |

**결제수단 국가별 매핑**

| Country | 표시 결제수단 |
|---------|------------|
| South Korea | Stripe (Card) · Kakao Pay |
| 그 외 | Stripe (Card) · PayPal |

**Country 기본값 감지 순서**

1. `Intl.DateTimeFormat().resolvedOptions().timeZone` — 시간대 기반 (1순위)
2. `navigator.language` — 브라우저 언어 기반 (2순위)
3. 감지 불가 시 → US 기본값

**Order Summary 컴포넌트**

CTA 버튼 위, 약관 체크박스 아래에 고정 배치한다.

```
[제품명]
결제 주기          [연간 / 월간]
단가              [금액 / unit]    ← CompanyID·Academic·Indie만 표시
시트 수            [N석]           ← CompanyID·Academic·Indie만 표시
─────────────────────────────
소계              [금액]
세금 [VAT XX%]    [금액]          ← 세율 0% 국가는 행 숨김
─────────────────────────────
합계              [금액]/[주기]    ← 18px SemiBold
* 세금 안내 문구                   ← 국가별 조건부 표시
```

| 플랜 | 소계 계산 | 세금 행 |
|------|-----------|---------|
| Individual | 고정 (월·연) | Country 세율 적용 |
| Student | 고정 (연 only) | Country 세율 적용 |
| CompanyID | 단가 × 시트 수 | Country 세율 적용 |
| Academic | $1,500 × Copy 수 | Country 세율 적용 |
| Indie | 고정 (연 only) | Country 세율 적용 |

**국가별 Tax/VAT 분기**

| 그룹 | 해당 국가 | 세율 | 추가 필드 |
|------|-----------|------|-----------|
| 부가세 적용 | KR | 10% (VAT) | 없음 |
| 부가세 적용 | JP | 10% (消費税) | 없음 |
| 부가세 적용 | AU · SG | 10% / 9% (GST) | 없음 |
| 부가세 적용 | EU (DE·FR·NL 등) | 19~27% (MwSt/TVA) | VAT ID 입력 (선택) |
| 부가세 적용 | GB | 20% (VAT) | VAT ID 입력 (선택) |
| 주소 기반 | US | State tax (ZIP 입력 후 계산) | State + ZIP 입력 필수 |
| 주소 기반 | CA | Province tax | Province + Postal Code 입력 필수 |
| 세금 없음 | 그 외 | 0% | 없음 |

**주소 필드 분기 규칙**

- US·CA 선택 시: 결제 정보 카드 내 국가 행 아래에 State 드롭다운 + ZIP·Postal Code 입력 필드를 노출한다
- ZIP 미입력 상태에서는 Order Summary의 세금 행에 "ZIP 입력 후 계산"을 표시하고 합계를 확정하지 않는다
- ZIP 입력 완료 시: Stripe Tax API를 호출해 세율을 확정하고 합계를 표시한다
- EU·GB 선택 시: "사업자이신가요?" 링크를 노출한다. 클릭 시 VAT ID 입력 필드를 확장 표시한다
- VAT ID 입력 시: 역과세(Reverse Charge) 처리 → 세율 0%, 세금 행에 "VAT 0% (Reverse Charge)" 표시
- 그 외 국가: 추가 필드 없음, 세율 즉시 확정

**우려 사항 및 결정 필요 항목**

| 항목 | 내용 | 결정 |
|------|------|------|
| 폼 높이 | US 주소 필드 추가 시 프레임 높이 약 80~100px 증가 | (논의 필요) 스크롤 허용 여부 |
| EU B2B 진입 UX | VAT ID 필드 기본 노출 vs "사업자이신가요?" 링크 클릭 후 확장 | 링크 확장 방식으로 확정 |
| US ZIP 미완성 상태 | Order Summary 합계 미확정 → CTA 비활성 처리 여부 | (논의 필요) |
| FLOW 프레임 증가 | COUNTRY_CHANGE 섹션에 US·EU 케이스 프레임 각 1개 추가 필요 | FLOW_CHECKOUT_COMMON에 추가 예정 |

### 4.2 API

- `orders/route.ts`: `seats`, `licenseId`, `purchaseType` 필드 추가
- PayPal 콜백 라우트 신규 추가: `/api/payments/paypal/success`, `/api/payments/paypal/cancel`

---

## 5. Flow

### 5.1 메인 플로우 — Individual / Student

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | 플랜 선택 페이지에서 플랜을 고른 후 Checkout으로 진입한다 |
| 2 | System | 로그인 여부를 확인한다. Non-member면 로그인 리다이렉트 후 복귀한다 |
| 3 | 사용자 | Billing (Yearly / Monthly)을 선택한다 |
| 4 | 사용자 | Country를 확인·수정한다 |
| 5 | 사용자 | 결제수단 카드를 선택한다 |
| 6 | 사용자 | 약관 2개에 동의한다 |
| 7 | 사용자 | CTA 버튼을 클릭한다 |
| 8 | System | 선택된 결제수단의 PG 페이지로 이동한다 |
| 9 | System | 결제 완료 후 라이선스를 즉시 활성화한다 |

### 5.2 추가 단계 — CompanyID / Academic / Indie

| Step | Actor | Description |
|------|-------|-------------|
| 3a | 사용자 | License ID를 선택한다 (기존: 드롭다운 / 신규: 인라인 입력) |
| 3b | 사용자 | Purchase Type을 선택한다 (Extend / Reserve. Indie는 Extend only) |
| 3c | 사용자 | Seats 수를 선택한다 (1 / 5 / 10 / Custom. Indie 최대 5) |

### 5.3 예외 플로우

| Step | Actor | Description |
|------|-------|-------------|
| E1 | System | Student 인증 시점 4년 경과 감지 시 진입을 차단하고 일반 플랜 CTA를 표시한다 |
| E2 | System | Academic·Indie 인증 Pending 감지 시 진입을 차단하고 "인증 검토 중" 안내를 표시한다 |
| E3 | System | Non-member 직접 접근 시 로그인 페이지로 리다이렉트한다. `?redirect=/checkout?plan=xxx` 유지 |
| E4 | System | Country 변경으로 기존 선택 결제수단이 불일치할 경우 선택을 초기화하고 인라인 안내를 표시한다 |
| E6 | System | US·CA 선택 시 State·ZIP 필드를 노출하고, ZIP 미입력 상태에서는 CTA를 비활성 처리한다 (논의 필요) |
| E7 | System | EU·GB 선택 시 "사업자이신가요?" 링크를 노출한다. VAT ID 입력 시 세율을 0%로 변경하고 Order Summary를 업데이트한다 |
| E5 | System | PG 뒤로가기·새로고침 시 sessionStorage에서 입력값을 복원한다 |

---

## 6. Action Item

### 6.1 Web (md-fe)

- [ ] `src/app/(marketing)/checkout/page.tsx` 신규 구현
- [ ] `src/lib/checkout-session.ts` sessionStorage 상태 관리 구현
- [ ] 회원 타입별 동적 필드 분기 처리
- [ ] Country 변경 → 결제수단 목록 동적 교체
- [ ] CTA 버튼 텍스트 PM 연동
- [ ] 브라우저 시간대·언어 기반 Country 기본값 감지 (`Intl.DateTimeFormat`, `navigator.language`)
- [ ] Order Summary 컴포넌트 구현 (소계·세금·합계 실시간 계산)
- [ ] 국가별 Tax/VAT 세율 테이블 및 조건부 렌더링
- [ ] US·CA: State 드롭다운 + ZIP 입력 필드 조건부 표시
- [ ] EU·GB: VAT ID 입력 필드 확장 표시 ("사업자이신가요?" 링크)
- [ ] ZIP 미입력 상태 Order Summary "계산 중" 처리 및 CTA 비활성 (논의 필요)

### 6.2 API (md-be)

- [ ] `src/app/api/orders/route.ts` 필드 추가 (`seats`, `licenseId`, `purchaseType`)
- [ ] `src/app/api/payments/paypal/success/route.ts` 신규
- [ ] `src/app/api/payments/paypal/cancel/route.ts` 신규

### 6.2 API (md-be)

- [ ] `src/app/api/orders/route.ts` 필드 추가 (`seats`, `licenseId`, `purchaseType`)
- [ ] `src/app/api/payments/paypal/success/route.ts` 신규
- [ ] `src/app/api/payments/paypal/cancel/route.ts` 신규
- [ ] Stripe Tax API 연동 — ZIP 입력 후 세율 계산 엔드포인트

### 6.3 QA (md-qa)

- [ ] 회원 타입 5종 × 결제수단 3종 시나리오 검증
- [ ] 진입 차단 케이스 3종 검증 (Student 초과 / 인증 Pending / Non-member)
- [ ] PG 뒤로가기 상태 복원 검증
- [ ] 국가별 Tax 표시 검증: KR·JP·AU·SG·DE·GB·US·CA + 그 외
- [ ] Order Summary 실시간 계산 검증 (시트 수 변경 시 합계 즉시 반영)
- [ ] EU VAT ID 입력 → 0% 역과세 전환 검증
- [ ] US ZIP 미입력 → CTA 비활성 상태 검증 (논의 결과 반영 후)

---

## 7. Impact

| 지표 | 방향 |
|------|------|
| 결제 완료율 | 향상 (8단계 → 2단계 감소) |
| 결제 중 이탈률 | 감소 |
| CS 문의 (License ID 모달 오류) | 감소 |
| CS 문의 (세금 예상 금액 불일치) | 감소 (결제 전 합계 명시) |
| 글로벌 전환율 | 향상 (국가별 세금 자동 계산으로 이탈 방지) |
