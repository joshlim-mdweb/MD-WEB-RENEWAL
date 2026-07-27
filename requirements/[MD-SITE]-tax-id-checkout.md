# [MD|SITE] Checkout Tax ID 수집 — 글로벌 B2B 세금 처리

Epic Key: `(미정)` | 요청: Reo Jeon | 출처: [Slack #md-web C05EJCG8BG9/p1779747311050969](https://clo3d.slack.com/archives/C05EJCG8BG9/p1779747311050969) | 작성일: 2026-05-27

---

## 배경

멕시코 고객이 RFC(사업자번호)를 인보이스에 표기 요청한다. 현재 Checkout은 EU/UK VAT만 처리하며, 멕시코를 포함한 글로벌 감면 대상 국가에 Tax ID 수집 기능이 없다. 이를 계기로 Enterprise Checkout 전반에 글로벌 Tax ID 수집·저장·세율 처리 정책을 반영한다.

---

## 1. Agenda

| 항목 | 내용 |
|------|------|
| TITLE | Checkout Tax ID 수집 — 글로벌 B2B 세금 처리 |
| DESCRIPTION | Enterprise Checkout에 국가별 Tax ID 수집 필드를 추가하고, Avalara·Stripe·PayPal 각 PG에서 세율 처리 및 저장을 반영한다 |
| 요청 | Reo Jeon |
| DUE DATE | (미정) |

---

## 2. Background

### AS-IS

```
EU/UK 국가 선택 시 → "사업자이신가요?" 링크 클릭 → VAT ID 입력 확장
멕시코 · 호주 · 캐나다 등 → Tax ID 수집 없음
```

- EU/UK VAT는 현재 Avalara에서 `WithBusinessIdentificationNumber` + `WithTaxOverride(taxAmount: 0)`로 처리
- 멕시코 RFC는 Avalara 처리 대상 아님 → 수동 세율 override 필요
- PayPal 결제 시 Tax ID 저장 경로 없음

### TO-BE

```
감면 대상 국가 선택 → Tax ID 입력 필드 자동 노출 (Optional)
  → Tax ID 입력 시 → Avalara 역과세 처리 → Order Summary 0% Reverse Charge 표시
  → 주문 확정 시 → Stripe Customer / PayPal custom_field / MD DB 저장
```

- "사업자이신가요?" 질문 제거 — 국가 선택 자체가 트리거
- 결제 수단(Stripe/PayPal) 무관하게 동일한 UX 제공
- Avalara가 세율 계산 후 각 PG에 결과값 전달하는 기존 구조 유지

---

## 3. Requirements

| 기능명 | Description |
|--------|-------------|
| Tax ID 필드 노출 조건 | 시스템은 감면 대상 국가 선택 시 Country 드롭다운 바로 아래에 Tax ID 입력 행을 자동으로 표시한다. 비감면 국가 선택 시 표시하지 않는다 |
| 국가별 Tax ID 레이블 | 시스템은 선택된 국가에 따라 Tax ID 레이블과 placeholder를 동적으로 변경한다 |
| Optional 입력 | 사용자는 Tax ID를 입력하지 않고 결제를 진행한다. 미입력 시 일반 세율을 적용한다 |
| 비동기 검증 배지 | 시스템은 EU VAT / GB VAT / AU ABN 입력 시 외부 기관(VIES / HMRC / ABR)에 검증 요청을 보내고 검증 상태(Verifying / Verified / Unverified)를 배지로 표시한다 |
| 검증 전 Reverse Charge 적용 | 시스템은 Tax ID 형식이 올바르면 외부 검증 완료 전에도 역과세를 적용한다 |
| Order Summary 세율 변동 표시 | 시스템은 역과세 적용 시 Order Summary 부가세 행을 "Tax: €0.00 (Reverse Charge)"로 업데이트하고 결제금액을 재계산한다 |
| Stripe Tax ID 저장 | 시스템은 Stripe 결제 확정 시 `customers.createTaxId()`로 Tax ID를 Customer 레벨에 저장한다. Tax ID는 저장 후 수정 불가(삭제 후 재생성)이며 Customer당 최대 5개를 저장한다 |
| PayPal Tax ID 저장 | 시스템은 PayPal 결제 시 Invoice `custom_fields`에 Tax ID 타입과 값을 텍스트로 삽입한다 |
| MD DB 저장 | 시스템은 결제 수단에 무관하게 `orders` 테이블의 `tax_id`, `tax_id_type` 컬럼에 Tax ID를 저장한다 |
| Avalara 역과세 처리 | 시스템은 Tax ID 입력 시 Avalara에 `WithBusinessIdentificationNumber` + `WithTaxOverride(taxAmount: 0)`를 전달하여 세율을 0%로 override한다 |
| 재결제 시 Tax ID 자동 채움 | 시스템은 동일 국가로 재결제 시 이전에 저장된 Tax ID를 입력 필드에 자동으로 채운다. 사용자는 수정 후 결제를 진행한다 |
| 국가 변경 시 Tax ID 초기화 | 사용자가 국가를 변경하면 Tax ID 입력 필드를 초기화한다 |

---

## 4. Scope

### 4.1 Web

적용 대상: **Enterprise (CompanyID / Academic / Indie)** Checkout 전용. Individual / Student Checkout에는 Tax ID 행을 표시하지 않는다.

- Country 드롭다운 선택 → 감면 대상 국가 코드 목록 조회 → Tax ID 행 표시/숨김
- 국가별 레이블·placeholder 동적 변경 (아래 국가별 Tax ID 유형 표 참조)
- Tax ID 입력 필드: Optional 배지, 국가별 형식 힌트 표시
- 검증 상태 배지: EU VAT / GB VAT / AU ABN에만 노출 (비동기, VIES / HMRC / ABR)
- Order Summary: Tax ID 입력 시 부가세 행 "Tax: 0.00 (Reverse Charge)"로 실시간 업데이트
- 결제 수단(Stripe / PayPal) 선택과 무관하게 Tax ID 필드 동일 표시

### 4.2 Backend

**감면 대상 국가 목록 관리**

1차 적용:

| 국가 | Tax ID 명칭 | Stripe 타입 | Avalara 처리 | 검증 방식 |
|------|------------|------------|-------------|----------|
| EU 27개국 | VAT Number | `eu_vat` | `WithTaxOverride(0)` | VIES 비동기 |
| 영국 | VAT Number | `gb_vat` | `WithTaxOverride(0)` | HMRC 비동기 |
| 멕시코 | RFC | `mx_rfc` | (논의 필요) | 형식만 |

2차 적용 (논의 필요):

| 국가 | Tax ID 명칭 | Stripe 타입 | 비고 |
|------|------------|------------|------|
| 호주 | ABN | `au_abn` | ABR 비동기 검증 |
| 캐나다 | GST/HST Number | `ca_gst_hst` | 세율 변동 여부 확인 필요 |
| 일본 | 適格請求書番号 | `jp_trn` | 세율 변동 여부 확인 필요 |

**Avalara 역과세 처리**

```
Tax ID 입력 시
→ Avalara: WithBusinessIdentificationNumber(taxId) + WithTaxOverride(taxAmount: 0)
→ 최종 세율 0% → Order Summary 반영
→ EU/UK Zero Return 신고 의무: Avalara에 0원 기록 유지 (현행 정책 그대로)
```

**Stripe Tax ID 저장**

```
주문 확정 시
→ stripe.customers.createTaxId({ type: stripeType, value: taxId })
→ Customer 레벨 저장 (이후 모든 Invoice에 자동 표기)
→ 저장 후 수정 불가 — 변경 필요 시 삭제 후 재생성
```

**PayPal Tax ID 저장**

```
주문 확정 시
→ PayPal Invoice custom_fields에 { name: taxIdType, value: taxId } 삽입
→ MD DB에서 재결제 시 custom_fields 재주입
→ 세율 계산은 Avalara에서 완료 후 총액을 PayPal에 전달 (기존 구조 동일)
```

**MD DB**

```sql
-- orders 테이블 컬럼 추가
tax_id       VARCHAR(100) NULL  -- 입력값 그대로 저장
tax_id_type  VARCHAR(50)  NULL  -- eu_vat, gb_vat, mx_rfc 등 Stripe 타입 코드
```

---

## 5. Flow

### Flow A — 비감면 국가 선택 (Tax ID 미노출)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Checkout 페이지에서 Country를 "United States"로 선택한다 |
| 2 | System | 감면 대상 국가 목록을 조회한다. US는 감면 대상이 아니므로 Tax ID 행을 표시하지 않는다 |
| 3 | 사용자 | 나머지 주소·결제 수단을 입력하고 주문을 확정한다 |
| 4 | System | Avalara에서 US 주 기준 세율을 계산하여 Order Summary에 반영한다 |

### Flow B — 감면 대상 국가 선택 → Tax ID 입력 → Reverse Charge 적용

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Checkout 페이지에서 Country를 "Germany (DE)"로 선택한다 |
| 2 | System | 감면 대상 국가로 판단하여 Country 드롭다운 바로 아래에 "VAT Number" 입력 행을 노출한다 |
| 3 | 사용자 | VAT Number 필드에 "DE123456789"를 입력한다 |
| 4 | System | 입력 형식이 올바르면 즉시 Avalara에 역과세 override를 적용하고 Order Summary를 "Tax: €0.00 (Reverse Charge)"로 업데이트한다 |
| 5 | System | 비동기로 VIES에 VAT Number 검증을 요청하고 검증 배지를 "Verifying"으로 표시한다 |
| 6 | System | VIES 검증 완료 시 배지를 "Verified"로 업데이트한다. 검증 실패 시 "Unverified"로 표시하되 세율은 유지한다 |
| 7 | 사용자 | 결제 수단을 선택하고 주문을 확정한다 |
| 8 | System | Stripe 결제 시 `customers.createTaxId()`로 Tax ID를 저장한다. PayPal 결제 시 Invoice `custom_fields`에 삽입한다. MD DB `orders` 테이블에 `tax_id`, `tax_id_type`을 저장한다 |

### Flow C — 재결제 시 Tax ID 자동 채움

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | 동일 Enterprise 라이선스를 재결제하기 위해 Checkout에 진입한다 |
| 2 | System | MD DB에서 이전 결제의 `tax_id`, `tax_id_type`을 조회한다 |
| 3 | System | Country가 이전 결제와 동일하면 Tax ID 필드에 이전 값을 자동으로 채운다 |
| 4 | 사용자 | 자동 채워진 Tax ID를 확인하고 수정 또는 그대로 결제를 진행한다 |

---

## 6. Action Item

### 6.1 Web

- [ ] 감면 대상 국가 코드 목록 관리 모듈 구현 (1차: EU 27개국 + UK + MX)
- [ ] Country 선택 시 Tax ID 행 표시/숨김 로직 구현
- [ ] 국가별 Tax ID 레이블·placeholder 동적 변경 구현
- [ ] Tax ID 입력 시 Order Summary 세율 행 실시간 업데이트 구현
- [ ] 검증 상태 배지 (Verifying / Verified / Unverified) UI 구현
- [ ] 재결제 시 Tax ID 자동 채움 구현
- [ ] 국가 변경 시 Tax ID 초기화 처리

### 6.2 Backend

- [ ] `orders` 테이블 `tax_id`, `tax_id_type` 컬럼 추가 (DB 마이그레이션)
- [ ] Avalara `WithBusinessIdentificationNumber` + `WithTaxOverride` 파라미터 연동
- [ ] Stripe `customers.createTaxId()` API 연동
- [ ] PayPal Invoice `custom_fields` Tax ID 삽입 로직 구현
- [ ] EU VAT / GB VAT / AU ABN 비동기 검증 webhook 처리
- [ ] 멕시코 RFC Avalara override 처리 방식 확인 (@Mark Ko) — (논의 필요)

---

## 7. Impact

| 지표 | 기대 효과 |
|------|---------|
| 인보이스 정확도 | B2B 고객 Tax ID 인보이스 표기 요청 CS 건수 감소 |
| Enterprise 결제 완료율 | Tax ID 입력 마찰 최소화 (Optional, 국가 선택 자동 트리거) |
| 세금 처리 정확도 | 감면 대상 국가 B2B 거래에서 세율 0% 자동 적용 |

---

## 미결 항목

| 항목 | 상태 | 담당 |
|------|------|------|
| 멕시코 RFC → Avalara override 가능 여부 | (논의 필요) | @Mark Ko |
| 호주 ABN / 캐나다 GST / 일본 適格 → 2차 적용 일정 | (논의 필요) | PM |
| Tax ID 수정 경로 — 주문 확정 후 MyPage 제공 여부 | (논의 필요) | PM |
| Stripe Tax ID 저장 후 수정 불가 → 고객 CS 대응 정책 | (논의 필요) | BD / CS |

---

## 다음 할 일

- [ ] Confluence에 Tax ID 정책 페이지 작성
- [ ] Tax ID 인풋 컴포넌트 상태별 와이어프레임
- [ ] WF annotation을 Tax ID 관련 요소만으로 교체
