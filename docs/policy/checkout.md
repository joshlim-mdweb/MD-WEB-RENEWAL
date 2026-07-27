# POLICY_CHECKOUT

관련 티켓: MDWEB-634 | 출처: `requirements/[MD-SITE]-checkout-redesign.md`

---

## 1. 진입 조건

Checkout 페이지 접근 전 System이 아래 조건을 순서대로 확인한다.

| 조건 | 처리 |
|------|------|
| Non-member (비로그인) | 로그인 페이지로 리다이렉트. `?redirect=/checkout?plan=xxx` 유지 |
| Student 누적 구매 2회 초과 | 진입 차단. "일반 Individual 플랜으로 업그레이드" CTA 표시 |
| Academic·Indie 인증 Pending | 진입 차단. "인증 검토 중" 안내 표시. 버튼 비활성 |
| 그 외 | 정상 진입 |

---

## 2. Country 기본값 감지

System은 아래 순서로 Country 기본값을 자동 설정한다.

1. `Intl.DateTimeFormat().resolvedOptions().timeZone` — 브라우저 시간대 (1순위)
2. `navigator.language` — 브라우저 언어 (2순위)
3. 감지 불가 → `US` 기본값

사용자는 드롭다운으로 언제든 수동 변경할 수 있다.

---

## 3. 결제수단 국가별 매핑

Country 선택이 변경될 때 결제수단 목록을 즉시 교체한다. 기존 선택이 새 목록에 없으면 선택을 초기화하고 인라인 안내를 표시한다.

| Country | 표시 결제수단 |
|---------|-------------|
| South Korea (KR) | Stripe (Card) · Kakao Pay |
| 그 외 모든 국가 | Stripe (Card) · PayPal |

---

## 4. Order Summary 구성

CTA 버튼 위, 약관 체크박스 아래에 고정 배치한다.

```
[제품명]
결제 주기          연간 / 월간
단가              [금액 / unit]    ← CompanyID·Academic·Indie만 표시
시트 수            N석             ← CompanyID·Academic·Indie만 표시
──────────────────────────────────
소계              $XXX.XX
세금 [라벨 XX%]   $XXX.XX         ← 세율 0% 국가는 행 숨김
──────────────────────────────────
합계              $XXX.XX / 주기   ← 18px SemiBold
* 세금 안내 문구                   ← 국가별 조건부 표시
```

### 플랜별 소계 계산

| 플랜 | 소계 |
|------|------|
| Individual Monthly | $39.00 |
| Individual Annual | $280.00 |
| Student Annual | $99.00 |
| CompanyID | 단가 × 시트 수 |
| Academic | $1,500 × Copy 수 |
| Indie Annual | $800.00 |

---

## 5. Tax / VAT 정책

### 5.1 국가별 세율 분기

| 그룹 | 국가 | 세율 | 세금 행 라벨 |
|------|------|------|-------------|
| 부가세 | KR | 10% | `VAT 10%` |
| 부가세 | JP | 10% | `消費税 10%` |
| 부가세 | AU | 10% | `GST 10%` |
| 부가세 | SG | 9% | `GST 9%` |
| 부가세 | EU (DE·FR·NL 등) | 국가별 19~27% | `MwSt XX%` / `TVA XX%` |
| 부가세 | GB | 20% | `VAT 20%` |
| 주소 기반 | US | State tax (ZIP 입력 후 확정) | `Tax` |
| 주소 기반 | CA | Province tax (우편번호 입력 후 확정) | `Tax` |
| 세금 없음 | CN 및 그 외 | 0% | 행 표시 안 함 |

### 5.2 EU·GB — VAT ID 역과세

- EU·GB 선택 시 결제 정보 카드 내 "사업자이신가요?" 링크를 표시한다.
- 링크 클릭 시 VAT ID 입력 필드를 확장 표시한다.
- VAT ID 입력 완료 시 세율을 0%로 변경하고 Order Summary 세금 행에 `VAT 0% (Reverse Charge)`를 표시한다.
- VAT ID 미입력 시 해당 국가 표준 세율을 적용한다.

### 5.3 US·CA — 주소 기반 세금

- Country를 US·CA로 선택하면 결제 정보 카드 내에 State 드롭다운 + ZIP·Postal Code 입력 필드를 노출한다.
- ZIP·Postal Code 미입력 상태: Order Summary 세금 행에 "ZIP 입력 후 계산"을 표시하고 합계를 확정하지 않는다.
- ZIP·Postal Code 입력 완료: Stripe Tax API를 호출해 세율을 확정하고 합계를 표시한다.
- ZIP·Postal Code 미입력 상태에서는 CTA 버튼을 비활성 처리한다. (논의 필요)

---

## 6. 주소 필드 분기 규칙

| Country | 추가 필드 | 비고 |
|---------|---------|------|
| US | State 드롭다운 + ZIP 입력 | ZIP 입력 전 세금 미확정 |
| CA | Province 드롭다운 + Postal Code 입력 | Postal Code 입력 전 세금 미확정 |
| EU · GB | "사업자이신가요?" 링크 → VAT ID 입력 확장 | 선택 항목 |
| 그 외 | 추가 필드 없음 | 세율 즉시 확정 |

---

## 7. 상태 복원

- 사용자가 PG 페이지에서 뒤로가기 하거나 페이지를 새로고침해도 Checkout 입력값을 유지한다.
- `sessionStorage`에 플랜·결제주기·License ID·Purchase Type·Seats·Country·결제수단 선택값을 저장한다.
- sessionStorage 데이터는 결제 완료 시 삭제한다.

---

## 8. CTA 버튼 동작

| 결제수단 선택 | CTA 버튼 텍스트 |
|-------------|--------------|
| Stripe (Card) | `Pay with Card` |
| Kakao Pay | `Pay with Kakao Pay` |
| PayPal | `Continue to PayPal` |
| 미선택 | `Continue` (비활성) |

약관 체크박스 2개 모두 동의 + 결제수단 선택 완료 시 CTA가 활성화된다.
