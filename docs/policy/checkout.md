# POLICY_CHECKOUT

관련 티켓: MDWEB-634 | 출처: `requirements/[MD-SITE]-checkout-redesign.md`
기능 명세: `requirements/[MD-SITE]-checkout-feature-spec.md` (2026-08-05)
Canvas: [[RENEWAL] Order/Checkout](https://clo3d.slack.com/docs/T04BT3VBR/F0BL0SRE4TZ)

---

## 1. 진입 조건

Checkout 페이지 접근 전 System이 아래 조건을 순서대로 확인한다.

| 조건 | 처리 |
|------|------|
| Non-member (비로그인) | 로그인 페이지로 리다이렉트. `?redirect=/checkout?plan=xxx` 유지 |
| Student 인증 시점 4년 경과 | 진입 차단. "일반 Individual 플랜으로 업그레이드" CTA 표시 |
| Academic·Indie 인증 Pending | 진입 차단. "인증 검토 중" 안내 표시. 버튼 비활성 |
| 그 외 | 정상 진입 |

---

## 2. 기준 국가 판정 (2026-08-05 개정)

세율·결제수단을 정하는 기준 국가는 **Billing Address의 국가**다. Checkout 내 별도 Country 드롭다운은 두지 않는다.

| 상황 | 기준 국가 |
|------|---------|
| Billing Address 있음 | 해당 주소의 국가 |
| Billing Address 없음 | 미확정. 주소 생성 모달에서 국가를 입력받는다 |
| 주소 입력 전 결제수단 노출 | 접속 IP로 중국 여부만 판정 (§3) |

국가를 바꾸려면 Billing Address를 수정한다. 상세는 §6.

---

## 3. 결제수단 국가별 매핑

Billing Address 국가가 변경될 때 결제수단 목록을 즉시 교체한다. 기존 선택이 새 목록에 없으면 선택을 초기화하고 인라인 안내를 표시한다.

| Country | 표시 결제수단 |
|---------|-------------|
| China (CN) | Stripe (Card) · AliPay |
| 그 외 모든 국가 | Stripe (Card) · PayPal |

> Kakao Pay는 제공하지 않는다 (2026-08-05 확정). 기준 국가는 Billing Address 국가이며, 주소 입력 전에는 접속 IP로 중국 여부를 판정한다. 상세는 `plan.md` §4-7.

---

## 4. Trial

Individual 플랜의 Trial도 Checkout 페이지를 거친다.

Trial 시작 시 월간·연간 중 하나를 선택한다.
선택한 지불 방식 기준으로 14일 무료 기간을 부여한다.
결제 금액은 $0으로 표시한다.
Trial 종료 후 선택한 플랜(월간 $39 / 연간 $280)으로 자동 결제를 시작한다.

Trial을 취소한 이력이 있는 계정은 재진입 시 Trial 없이 바로 구매 경로로 진입한다.

---

## 5. Coupon · Discount

Coupon 입력창은 Individual 플랜의 최초 구매에만 노출한다.
그 외 모든 경우 입력창을 숨긴다.

유효한 코드는 Order Summary에 `Coupon` 행으로 `-$n`을 표시한다.
잘못된 코드는 입력란 아래에 안내 문구를 표시한다.

Discount는 Coupon과 별개다.
Discount는 프로모션 코드 또는 관리자 지정으로 적용한다.
Discount는 전 플랜에 적용할 수 있다.

---

## 6. Order Summary 구성

CTA 버튼 위, 약관 체크박스 아래에 고정 배치한다.

```
[제품명]
지불 방식          연간 / 월간
단가              [금액 / Seat]    ← Enterprise·Academic·Indie만 표시
Seat 수            N Seat          ← Enterprise·Academic·Indie만 표시
──────────────────────────────────
소계              $XXX.XX
Coupon            -$XX.XX          ← 적용 시만 표시
Discount          -$XX.XX          ← 적용 시만 표시
세금 [라벨 XX%]   $XXX.XX         ← 세율 0% 국가는 행 숨김
──────────────────────────────────
합계              $XXX.XX / 주기   ← 18px SemiBold
* 세금 안내 문구                   ← 국가별 조건부 표시
```

계산식: 소계 − (Coupon + Discount) = 과세표준 + 세금 = 합계

Seat 수를 변경하거나 Coupon·Discount를 적용하면 금액을 다시 계산한다.

### 플랜별 소계 계산

| 플랜 | 소계 |
|------|------|
| Individual Monthly | $39.00 |
| Individual Annual | $280.00 |
| Student Monthly | $8.25 (Student Benefit 기간 중 $0.00) |
| Enterprise Single | $199.00 |
| Enterprise Team | $2,000 × Seat 수 |
| Enterprise Team Linux | $2,300 × Seat 수 |
| Academic | $1,500 × Seat 수 |
| Indie Annual | $800 × Seat 수 (최대 5) |

---

## 7. Tax / VAT 정책

### 7.1 세액 계산 주체

세율을 어디서 계산하는지가 지역마다 다르다. **Avalara가 전부를 계산하지 않는다.**

| 지역 | 계산 주체 |
|------|---------|
| US (주별) · EU | **Avalara** |
| KR | 10% 고정 |
| CN | ItemCode별 (CLO_PLC 13% / CLO_RLC 6%) |
| 그 외 | CLOver Admin 내 계산 |

### 7.1-1 국가별 세율 참고표

US·EU는 아래 값이 아니라 **Avalara 응답이 기준**이다. 그 외 국가는 이 표가 실제 기준이다.

| 그룹 | 국가 | 세율 | 세금 행 라벨 |
|------|------|------|-------------|
| 부가세 | KR | 10% | `VAT 10%` |
| 부가세 | JP | 10% | `消費税 10%` |
| 부가세 | AU | 10% | `GST 10%` |
| 부가세 | SG | 9% | `GST 9%` |
| 부가세 | EU (DE·FR·NL 등) | 국가별 19~27% | `MwSt XX%` / `TVA XX%` |
| 부가세 | GB | 20% | `VAT 20%` |
| 주소 기반 | US | Avalara 응답 (주 + ZIP 기준) | `Tax` |
| 주소 기반 | CA | Province tax (우편번호 기준) | `Tax` |
| ItemCode 기반 | CN | CLO_PLC 13% / CLO_RLC 6% | `增值税 XX%` |
| 세금 없음 | 그 외 | 0% | 행 표시 안 함 |

### 7.2 Tax ID 역과세

- **"사업자이신가요?" 링크는 두지 않는다.** 감면 대상 국가 선택 자체가 Tax ID 입력 행의 트리거다. (`requirements/[MD-SITE]-tax-id-checkout.md` TO-BE)
- Tax ID 입력란은 Organization 그룹의 Enterprise·Indie 플랜 결제에서만 노출한다. *(정책 확인 필요 — EU 회원국으로 한정할지 여부)*
- Tax ID는 선택 입력이다. 미입력 시 해당 국가 표준 세율을 적용한다.
- 청구지 국가를 변경하면 입력값을 초기화한다.
- Tax ID 입력 시 Avalara에 `WithBusinessIdentificationNumber` + `WithTaxOverride(taxAmount: 0)`를 전달해 세율을 0%로 override한다.
- 역과세 적용 시 Order Summary 세금 행을 `Tax: €0.00 (Reverse Charge)`로 표시하고 합계를 재계산한다.
- Tax ID가 유효하지 않은 경우의 처리 *(정책 확인 필요)*

### 7.3 가격 확정 조건

| 국가 | 세율 결정 입력 |
|------|-------------|
| 미국 | 국가 + **주 + ZIP** |
| 그 외 | 국가 + **ZIP** |

- ZIP은 **전 국가 필수**다. ZIP이 없으면 세액을 계산할 수 없어 합계를 확정하지 않고 CTA를 비활성 처리한다.
- EU도 ZIP이 필요하다. 카나리아 제도(ES)·마데이라(PT)·올란드(FI) 등 특별 VAT 지역이 우편번호로 갈린다.
- Address line 1·2는 세액 계산에 사용하지 않는다. 인보이스 표기용이다.

### 7.4 Avalara 호출 시점

| 시점 | 호출 |
|------|------|
| MyPage · Team Console 주소 저장 | **미호출** — 저장만 |
| Checkout 진입 (주소 있음) | 조회 (uncommitted) |
| Checkout 주소 생성·수정 저장 후 | 조회 1회 |
| 결제 확정 | **commit** — 조회 시 발급된 transaction id를 그대로 커밋 |

**주소 검증은 Avalara로 하지 않는다.** Avalara는 미국 외 주소 검증을 지원하지 않는다.

---

## 8. Billing Address

### 8.1 조회 대상

| 플랜 그룹 | 주소 출처 | 관리 위치 |
|---------|---------|---------|
| 개인 계열 (Individual · Student) | 개인 주소 | MyPage |
| Organization 계열 (Enterprise · Academic · Indie) | **조직 주소** | Team Console |

### 8.2 Checkout 내 동작

| 상태 | 처리 |
|------|------|
| 주소 있음 | 주소 표시 + **[수정] 버튼** (모달) |
| 주소 없음 | **모달로 생성**. 개인·조직 모두 동일. 저장 시 각각 개인 주소 / 조직 주소로 생성 |
| 저장 성공 후 | **가격 재조회 API 1회 호출** → 화면 금액 갱신 |

### 8.3 필드

| 필드 | 필수 | 세액 계산 사용 |
|------|:---:|:---:|
| 국가 | O | O |
| 주 (State) — 미국만 | O | O |
| ZIP · 우편번호 | O (전 국가) | O |
| Address line 1 · 2 | O | ✖ (인보이스 표기용) |

### 8.4 유효성 검사

**시점: PG 이동 직전**

| 국가 | 검사 |
|------|------|
| 미국 | 실제 주소 존재 여부 |
| 우편번호 있는 국가 | 해당 국가 안에 그 ZIP이 존재하는지 |
| 우편번호 없는 국가 (홍콩·UAE 등) | 형식만. 존재 검증 스킵 |

---

## 9. SW Account (Organization 계열 전용)

결제 대상 SW Account는 결제 전에 지정한다.

보유한 계정이 있는 경우 목록에서 선택한다.
보유한 계정이 없는 경우 Checkout 흐름 안에서 새로 생성한다. Team Console에서도 생성할 수 있다.

선택한 계정의 라이선스 상태에 따라 처리 방식을 판정한다. 판정 결과와 근거는 선택 영역에 표시한다.

| 선택한 계정 상태 | 처리 | 화면 표시 |
|---|---|---|
| 라이선스 없음 · 신규 생성 계정 | 신규 할당 | 시작일은 결제일 |
| 활성 라이선스 보유 | 기간 연장 | 기존 만료일 이후로 연장 |

---

## 10. Seat (Organization 계열 전용)

Seat는 구매할 동시접속 허용 수다.
금액에 단가 × Seat 수로 직접 반영한다.
Seat는 프리셋 탭으로 선택한다.

| 플랜 | 프리셋 |
|---|---|
| Enterprise Team · Enterprise Team Linux | 5 / 10 / 20 / 직접 입력 |
| Academic Annual | 5 / 10 / 20 / 직접 입력 |
| Indie Annual | 1 / 3 / 5 / 직접 입력 |

프리셋에 없는 수량은 직접 입력으로 지정한다.
Indie는 직접 입력으로 5 이하만 지정할 수 있다.
Enterprise Single은 Seat 1로 고정한다.

---

## 11. Seat 추가 · 기간 연장 · Single → Team 전환

Team Console에서 시작하고 결제 단계만 Checkout 페이지로 넘어온다.
대상 라이선스·플랜·지불 방식은 기존 라이선스에서 승계한다.

| 결제 모드 | 금액 |
|---|---|
| Seat 추가 | 기존 라이선스 만료일까지 남은 기간을 일할 계산한 금액 |
| 기간 연장 | 연장 연수 × Seat 수 |
| 둘을 동시에 | 연장 연수 × Seat 수 + 잔여 기간에 대한 추가 Seat 금액(일할 계산) |

추가한 Seat는 기존 라이선스와 같은 날 만료된다.
일할 계산은 연간 라이선스에만 적용한다.

Enterprise Single에서 Team으로 전환하는 경우 구매 즉시 연간으로 전환된다.
새 만료일은 기존 만료일에 1년을 더한 날이다.
기존 SW Account는 그대로 승계한다.

---

## 12. Organization Type

인증 상태에 따라 구매 가능한 플랜과 화면이 달라진다.

| 구분 | Enterprise | Academic | Indie |
|---|---|---|---|
| 인증 | 불필요 | 교육기관 인증 | Indie 인증 |
| 플랜 | Single · Team · Team Linux | Academic Annual | Indie Annual |
| SW Account | 목록 선택 또는 생성 | 목록 선택 또는 생성 | 1개 고정 |
| Seat 상한 | Single 1 / Team·Linux 제한 없음 | 제한 없음 | 5 |
| Seat 추가 | 가능 | 가능 | 가능 |
| 기간 연장 | 가능 | 가능 | 불가 |

Academic·Indie는 인증을 마치지 않은 경우 인증 절차로 안내한다.
Academic 인증 심사 중인 경우 검토 중임을 안내한다.
Indie 인증 심사 중인 경우 인증 미완료와 동일한 안내를 표시한다.

6 Seat 이상이 필요한 Organization은 Enterprise 플랜을 정가로 구매한다.

---

## 13. 상태 복원

- 사용자가 PG 페이지에서 뒤로가기 하거나 페이지를 새로고침해도 Checkout 입력값을 유지한다.
- `sessionStorage`에 플랜·지불 방식·SW Account·구매 유형(축 A·B)·Seats·결제수단 선택값을 저장한다. 기준 국가는 Billing Address에서 다시 읽는다.
- sessionStorage 데이터는 결제 완료 시 삭제한다.

---

## 14. CTA 버튼 동작

| 결제수단 선택 | CTA 버튼 텍스트 |
|-------------|--------------|
| Stripe (Card) | `Pay with Card` |
| AliPay | `Pay with AliPay` |
| PayPal | `Continue to PayPal` |
| 미선택 | `Continue` (비활성) |

약관 체크박스 2개 모두 동의 + 결제수단 선택 완료 시 CTA가 활성화된다.

---

## 15. 환불 (2026-08-11 확정)

Individual 플랜의 환불 기준을 정의한다.

**정책**

결제가 완료된 시점에 디지털 서비스의 제공이 개시된 것으로 간주한다.
제공이 개시된 구독은 환불하지 않는다.
Trial에서 유료 구독으로 전환된 경우 전환 결제 시점부터 24시간 이내에 환불을 신청할 수 있다.
24시간 이내 환불은 전환 결제 금액 전액을 반환한다.
환불한 구독의 라이선스는 환불 처리와 함께 종료한다.

**처리 기간**

환불 신청일의 다음 영업일부터 기산한다.
기산일부터 3영업일 이내에 환불을 처리한다.

**적용 범위**

Student 플랜의 환불 기준은 `plan.md` Student 취소 및 환불을 따른다.
Enterprise · Academic · Indie 플랜의 환불 기준 *(정책 확인 필요)*

**미결**

24시간 이내 환불 후 동일 계정의 Trial 재진입 허용 여부 *(정책 확인 필요)* — §4의 Trial 취소 이력 규칙과 충돌 가능
