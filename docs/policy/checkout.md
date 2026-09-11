# POLICY_CHECKOUT

관련 티켓: MDWEB-870 | 출처: `requirements/[MD-SITE]-checkout-redesign.md`
Canvas: [[RENEWAL] Order/Checkout](https://clo3d.slack.com/docs/T04BT3VBR/F0BL0SRE4TZ)

---

## 0. 화면 구성

Checkout은 플랜 계열에 따라 화면 구성이 다르다.

| 계열 | 화면 구성 |
|---|---|
| 개인 계열 (Individual · Student) | 단일 화면 |
| Organization 계열 (Enterprise · Academic) | SW Account 지정 화면, 결제 화면 순서 |

Organization 계열의 두 화면 구성은 아래와 같다.

| 화면 | 내용 |
|---|---|
| **SW Account 지정 화면** | Purchase Type 카드(필터) · 계정 선택 · 신규 생성, `Set Order` 버튼 (§9) |
| **결제 화면** | Seat (§10) · Purchase Type (§11) · 지불 방식 · 결제수단 (§3) · Order Summary (§6) · Billing Address (§8, Tax ID는 §7.2) · 약관 체크박스 · CTA (§14) |

---

## 1. 진입 조건

Checkout 페이지 접근 전 System이 아래 조건을 순서대로 확인한다.

| 조건 | 처리 |
|------|------|
| Non-member (비로그인) | 로그인 페이지로 리다이렉트. `?redirect=/checkout?plan=xxx` 유지 |
| Student 인증 시점 4년 경과 | 진입 차단. "일반 Individual 플랜으로 업그레이드" CTA 표시 |
| Academic 인증 Pending | 진입 차단. "인증 검토 중" 안내 표시. 버튼 비활성 |
| Organization 계열 플랜 · Organization 미보유 | Organization 생성 단계로 안내 |
| 그 외 | 정상 진입 |

정상 진입 시 개인 계열은 결제 화면으로, Organization 계열은 SW Account 지정 화면으로 진입한다.

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

> Kakao Pay는 제공하지 않는다 (2026-08-05 확정). 접속 IP가 중국이거나 Billing Address 국가가 중국인 경우 AliPay를 노출한다 — 두 조건은 주소 입력 여부와 무관하게 상시 함께 적용된다. 상세는 `plan.md` §4-7.

---

## 4. Trial

Individual 플랜의 Trial도 Checkout 페이지를 거친다.

Trial 시작 시 월간·연간 중 하나를 선택한다.
선택한 지불 방식 기준으로 14일 무료 기간을 부여한다.
결제 금액은 $0으로 표시한다.
Trial 종료 후 선택한 플랜(월간 $39 / 연간 $280)으로 자동 결제를 시작한다.

**Trial은 계정당 1회다.** 취소했든 정상 완료했든 Trial 이력이 있는 계정은 재진입 시 Trial 없이 바로 구매 경로로 진입한다.
Trial 진행 중 즉시 유료 전환은 제공하지 않는다. 종료 후 자동 결제로 시작한다.
Trial 종료 후 첫 결제 실패는 Suspended 처리를 따른다 (`plan.md` §3 개인용 공통, `mypage.md` §6-5).
Trial 진행 중 전환 대상 플랜 변경(월간 ↔ 연간) *(개발 확인 필요 — PG 구독 구조상 가능한지)*

---

## 5. Coupon · Discount

Coupon은 **보유 쿠폰 목록에서 선택**한다 (2026-08-25 개정 — 입력창 단독 방식 폐기).
목록은 Individual Monthly와 Individual Annual의 최초 구매, 그리고 Trial을 경유한 첫 결제에 노출한다. 그 외 모든 경우 노출하지 않는다. (2026-08-31 확정 — Trial 경유 첫 결제 포함)
목록 항목을 클릭하면 입력 모달이 열린다. 코드 등록과 적용은 모달에서 처리한다.
자동 갱신 결제에는 Coupon을 적용하지 않는다.

적용한 쿠폰은 Order Summary에 `Coupon` 행으로 `-$n`을 표시한다.
유효하지 않은 코드는 모달 안에 안내 문구를 표시한다.

Discount는 Coupon과 별개다.
Discount는 프로모션 코드 또는 관리자 지정으로 적용한다.
Discount는 전 플랜에 적용할 수 있다.

---

## 6. Order Summary 구성

화면 우측 컬럼에 고정 배치한다. 우측 컬럼은 Order Summary → 약관 체크박스 → CTA 버튼 순으로 구성한다. 좌측 컬럼에는 입력 폼을 배치한다.

```
[제품명]
지불 방식          연간 / 월간
단가              [금액 / Seat]    ← Enterprise·Academic만 표시
Seat 수            N Seats         ← Enterprise·Academic만 표시
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

Seat 수 행은 `N Seats`로 표기한다. N이 1인 경우 `1 Seat`로 표기한다.
Seat 수를 변경하거나 Coupon·Discount를 적용하면 금액을 다시 계산한다.

개인 계열에서 동일 계열의 활성 구독을 보유한 채 결제하는 경우 Order Summary 위에 기존 구독의 잔여 기간을 안내한다. 재구매한 구독은 결제 즉시 시작한다 (`plan.md` §3 플랜 전환).

### 플랜별 소계 계산

| 플랜 | 소계 |
|------|------|
| Individual Monthly | $39.00 |
| Individual Annual | $280.00 |
| Student Monthly | $8.25 (Student Benefit 기간 중 $0.00) |
| Enterprise Single | $199.00 |
| Enterprise Team | $2,000 × Seat 수 |
| Enterprise Team Linux | $2,300 × Seat 수 |
| Academic | $300 × Seat 수* |

\* Academic의 50% 할인은 구간별로 판정한다 (§11.1). 할인은 해당 구간 금액에 반영해 소계를 구하고, Discount에는 반영하지 않는다 (2026-09-07 확정 — `plan.md` §2-1)

Student Benefit 기간 중에는 합계를 $0.00으로 표시한다. Trial로 표기하지 않고 일반 구매와 동일하게 표시한다.

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

- Tax ID(화면 라벨 `VAT Number`)는 Billing Address에 편입한다 (2026-09-08 확정). 입력 필드는 주소 입력 모달 안에 두고, 저장한 값은 Billing Address 카드에 표시한다. Checkout 화면에 별도 입력란을 두지 않는다.
- **"사업자이신가요?" 링크는 두지 않는다.** 모달에서 감면 대상 국가를 선택하는 것이 필드 노출의 트리거다. (`requirements/[MD-SITE]-tax-id-checkout.md` TO-BE)
- 필드는 Organization 그룹의 Enterprise 플랜 결제에서 국가를 EU 회원국으로 선택한 경우에만 노출한다. (2026-08-11 확정, 2026-08-25 Indie 웹 판매 제외로 대상에서 삭제) Academic은 노출하지 않는다.
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

- ZIP이 입력되지 않은 경우 세액을 산출할 수 없으므로 합계를 확정하지 않고 CTA를 비활성 처리한다.
- 유럽을 포함한 일부 국가는 우편번호에 따라 적용 세율 지역이 갈리므로 국가와 ZIP을 함께 사용해 세율을 판정한다.
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
| Organization 계열 (Enterprise · Academic) | **조직 주소** | Team Console |

### 8.2 Checkout 내 동작 (2026-08-25 개정)

Billing Address는 **보유 주소 목록에서 선택**한다. 주소 항목을 클릭하면 입력 모달이 열린다.

| 상태 | 처리 |
|------|------|
| 주소 있음 | 보유 주소 목록에서 선택. 항목 클릭 시 입력 모달로 수정 |
| 주소 없음 | 입력 모달로 생성. 개인·조직 모두 동일. 저장 시 각각 개인 주소 / 조직 주소로 생성 |
| 저장 성공 후 | **가격 재조회 API 1회 호출** → 화면 금액 갱신 |

### 8.3 필드

| 필드 | 필수 | 세액 계산 사용 |
|------|:---:|:---:|
| 국가 | O | O |
| 주 (State) — 미국만 | O | O |
| ZIP · 우편번호 | O (전 국가) | O |
| Address line 1 · 2 | O | ✖ (인보이스 표기용) |
| VAT Number (Tax ID) — Enterprise 결제에서 EU 회원국 선택 시만 노출 | ✖ (선택) | O (역과세 — §7.2) |

### 8.4 유효성 검사

**시점: PG 이동 직전**

| 국가 | 검사 |
|------|------|
| 미국 | 실제 주소 존재 여부 |
| 우편번호 있는 국가 | 해당 국가 안에 그 ZIP이 존재하는지 |
| 우편번호 없는 국가 | 형식 검증 미수행 (존재 검증도 스킵) |

---

## 9. SW Account 지정 화면 (Organization 계열 전용, 2026-08-25 필터 모델 전환)

결제 대상 SW Account를 지정한다. Purchase Type 카드, SW Account 목록, 생성 진입으로 구성한다.

**Purchase Type 카드가 계정 목록을 필터한다.** 카드는 2종이다.

| 카드 | 목록에 표시하는 계정 |
|---|---|
| Assign (기본 선택) | 라이선스가 없는 빈 계정. Team 진입에서는 Enterprise Single 활성 계정(전환 대상)도 표시 |
| Add/Extend | 해당 플랜의 활성 라이선스를 보유한 계정 |

만료된 라이선스만 보유한 계정이라는 상태는 존재하지 않는다. 라이선스가 만료되면 빈 계정으로 취급한다. (2026-08-24 정정)

선택한 카드와 계정에 따라 주문의 **Purchase Type**이 정해진다. 값은 `New`, `Add/Extend`, `Convert` 3종이다 (§11).

| 선택 | Purchase Type | 처리 |
|---|---|---|
| Assign 카드에서 빈 계정 선택 | New | 시작일은 결제일 |
| Assign 카드에서 Enterprise Single 활성 계정 선택 (Team 진입) | Convert | Single을 Team으로 전환 (§11) |
| Add/Extend 카드에서 계정 선택 | Add/Extend | 결제 화면에서 추가 수량과 연장 연수 입력 (§10) |

보유한 계정이 없는 경우 이 화면 안에서 새로 생성한다. Team Console에서도 생성할 수 있다.
구매한 Seat 전체를 선택한 SW Account 1개에 배정한다.

### 9.1 화면 상태

| 상태 | 처리 |
|---|---|
| Loading | Skeleton으로 표시한다 |
| Empty — 보유 계정 0개 | 목록 대신 생성 안내와 생성 진입을 표시한다 |
| Error — 목록 조회 실패 | 인라인 에러와 재시도를 표시한다. 재시도는 목록 조회만 다시 실행한다 |
| Selected | 선택한 계정과 Purchase Type을 표시한다 |

### 9.2 화면 이동

`Set Order` 동작은 §14를, 이동 시 입력값 유지는 §13을 따른다.
결제 화면에서 뒤로 가면 SW Account 지정 화면으로 돌아온다.

---

## 10. Seat (Organization 계열 전용 · 결제 화면)

Seat는 구매할 동시접속 허용 수다. 결제 화면에서 지정한다.
금액에 단가 × Seat 수로 직접 반영한다.

Seat 컨트롤은 Purchase Type(§9, §11)에 따라 달라진다.

| Purchase Type | Seat 컨트롤 |
|---|---|
| New | 프리셋 탭으로 구매할 총 Seat 수를 지정한다 |
| Add/Extend | 추가 수량과 연장 연수를 입력한다. 둘 다 선택 입력이며 하나만 입력할 수 있다. 기존 Seat 수는 읽기 전용으로 병기한다 |
| Convert | 프리셋 탭으로 Seat 수를 새로 지정한다 (§11) |

| 플랜 | 프리셋 |
|---|---|
| Enterprise Team · Enterprise Team Linux | 5 / 10 / 20 / 직접 입력 |
| Academic Annual | 5 / 10 / 20 / 직접 입력 |

프리셋에 없는 수량은 직접 입력으로 지정한다.
Enterprise Single은 Seat 1로 고정하며 **신규 할당(New) 단일 여정**이다. Add/Extend를 제공하지 않고, Team 전환 유도는 화면 하단 프로모 배너로만 처리한다. Convert는 Team 진입에서 수행한다 (§9).

---

## 11. Purchase Type — New · Add/Extend · Convert (2026-08-25 개정)

**Purchase Type**은 주문의 유형이다. 값은 `New`, `Add/Extend`, `Convert` 3종이다 (2026-08-24 확정 — Add와 Extend는 한 타입으로 통합하고, 화면에서 수량과 연수를 선택적으로 입력한다).

Checkout과 Team Console 어느 쪽에서든 시작할 수 있다. Team Console에서 진입한 경우 결제 단계만 Checkout 페이지로 넘어온다.
진입 경로는 초기 선택값만 정한다. Purchase Type은 SW Account 지정 화면의 카드와 계정 선택이 정하며, 진입 경로와 어긋나면 계정 선택을 우선한다 (§9).
Add/Extend와 Convert의 대상 라이선스·플랜·지불 방식은 기존 라이선스에서 승계한다.

| Purchase Type | 금액 |
|---|---|
| New | 단가 × Seat 수 |
| Add/Extend — 추가만 | 기존 라이선스 만료일까지 남은 기간을 일할 계산한 금액 |
| Add/Extend — 연장만 | 단가 × Seat 수 × 연장 연수 |
| Add/Extend — 둘 다 | 두 금액을 합산 |
| Convert | 단가 × 새로 지정한 Seat 수 (연간) |

추가한 Seat는 기존 라이선스와 같은 날 만료된다.
일할 계산은 연간 라이선스에만 적용한다.

Convert는 Enterprise Single을 Team으로 전환하는 경우에만 발생한다. Team 진입의 Assign 카드에서 Single 활성 계정을 선택하면 Convert로 처리한다 (§9).
결제 즉시 연간으로 전환되고 Seat 수를 새로 지정한다.
새 만료일은 기존 만료일에 1년을 더한 날이다.
기존 SW Account는 그대로 승계한다. 기존 Single 잔여 기간은 환불하지 않는다.
선택 영역에 전환 미리보기를 표시한다: `Convert {swAccount} from {currentProductName} to {newProductName}.` — `{swAccount}` = 선택한 SW Account, `{currentProductName}`, `{newProductName}` = 전환 전후 플랜명

### 11.1 Academic Seat 할인의 구간별 판정 (2026-09-07 확정)

Academic의 50% 할인은 주문 전체가 아니라 구간별로 판정한다.

| 구간 | 판정 기준 | 할인 대상 |
|---|---|---|
| New | 구매 Seat 수가 10석 이상 | 구매 금액 전체 |
| Add/Extend — 추가분 | 추가 Seat 수가 10석 이상 | 추가분 일할 금액 |
| Add/Extend — 연장분 | 총 Seat 수(현재 + 추가)가 10석 이상 | 연장 금액 |

추가분이 기준에 못 미쳐도 총 Seat 수가 기준을 넘으면 연장분에는 할인을 적용한다.
할인은 해당 구간 금액에 직접 반영해 소계를 구한다. Discount에는 반영하지 않는다 (Discount는 쿠폰 전용).

**예시:** 현재 3 Seats에 7 Seats를 추가하며 2년 연장하는 경우, 추가분은 7석이라 할인하지 않고 연장분은 총 10석 기준으로 50% 할인한다.

---

## 12. Organization Type (2026-08-25 개정)

인증 상태에 따라 구매 가능한 플랜과 화면이 달라진다.

| 구분 | Enterprise | Academic |
|---|---|---|
| 인증 | 불필요 | 교육기관 인증 |
| 플랜 | Single · Team · Team Linux | Academic Annual |
| SW Account | 목록 선택 또는 생성 | 목록 선택 또는 생성 |
| Seat 상한 | Single 1 / Team·Linux 제한 없음 | 제한 없음 |
| Add/Extend | 가능* | 가능 |

\* Enterprise Single 제외 — 신규 할당(New) 단일 여정 (§10)

Academic은 인증을 마치지 않은 경우 인증 절차로 안내한다.
Academic 인증 심사 중인 경우 검토 중임을 안내한다.

**Indie는 웹 판매 대상이 아니다 — 백오더 전용이며 웹 Checkout에 도달하지 않는다.** Plan 카드의 Start Indie는 Organization 생성과 Indie 인증 신청 리다이렉트만 제공한다. (2026-08-25 확정, `plan.md` §3 Indie 참조)

---

## 13. 상태 복원

- 사용자가 PG 페이지에서 뒤로가기 하거나 페이지를 새로고침해도 Checkout 입력값을 유지한다.
- Organization 계열의 SW Account 지정 화면과 결제 화면 사이 이동에도 저장한 선택값을 유지한다. 새로고침하면 진행 중이던 화면에서 복원한다.
- `sessionStorage`에 플랜·지불 방식·SW Account·Purchase Type 카드 선택·Seat 수·연장 연수·결제수단 선택값을 저장한다. Purchase Type 값은 저장하지 않고 카드와 계정 선택에서 다시 계산한다. 기준 국가는 Billing Address에서 다시 읽는다.
- sessionStorage 데이터는 결제 완료 시 삭제한다.

---

## 14. 약관 동의 · CTA 버튼 동작 (2026-08-23 개정, 2026-08-25 Canvas 동기화)

### 14.1 약관 동의 — 통합 체크박스

약관 동의는 **통합 체크박스 1개**로 받는다. 체크박스 문구는 `I agree to the terms and conditions below.`이며 아래에 케이스별 동의 항목을 나열한다. 모달을 사용하지 않는다. (2026-08-31 개정 — 구 `I agree to the following:` 폐기. 동의 주체는 버튼이 아니라 체크박스다)

라이선스를 지칭하는 주어는 **전 케이스에서 `The license`, `The subscription`**으로 쓴다. 소유물처럼 부르지 않는다. `you`와 `your`는 **사람이 행위자이거나 사람에게 귀속되는 자리에만** 남긴다 — `I agree to...`, `Cancel before...`, `If you cancel...`, `You can request a refund...`, `If you already used...`, `Student Benefit gives you...`. (2026-08-31 확정)

전 케이스의 1번 항목은 License Agreement 동의이며 https://legal.clo-set.com/additional-md 로 링크한다 (새 탭). 나머지 항목은 링크 없는 텍스트다.
문구 원문(EN·KO)은 Canvas `F0BS2C3653P`("[Renewal] Checkout: Policy Statements", 2026-08-24)가 최종본이다. 아래는 EN 기준 이관본이다.

**1. Subscription** (Individual Monthly, Individual Annual, Enterprise Single)
1. I agree to the Marvelous Designer License Agreement.
2. The license is available immediately after payment.
3. The subscription is charged automatically at the start of each billing period.
4. Cancel before the next billing date to avoid further charges.
5. If you cancel, the license remains available until the end of the current billing period.
6. Payments are non-refundable.

3번 항목은 주기를 명시하지 않는다. 월간, 연간, 월간 고정을 한 문장으로 덮기 위해서다. 결제 주기는 같은 화면의 Billing Preference와 Order Summary의 `Next Payment` 행에 이미 보인다. (2026-08-31 개정 — 구 케이스 `Subscription — Direct Purchase`와 `Subscription — Enterprise Single`을 통합. Enterprise Single은 월간 고정이라 `monthly or annually based on your selected billing cycle`이 성립하지 않아 분리돼 있었다)

**2. Individual — Free Trial** (Individual Monthly, Individual Annual, 14일 무료)
1. I agree to the Marvelous Designer License Agreement.
2. The license is free for 14 days, with no charge today.
3. Billing starts automatically when the free trial ends.
4. Cancel before the free trial ends to avoid being charged.
5. You can request a refund within 24 hours of the first payment.
6. After the first payment, the subscription is charged automatically at the start of each billing period.

**3. Student** (Student Monthly)
1. I agree to the Marvelous Designer License Agreement.
2. Student Benefit gives you 3 months of free access on your first Student subscription.
3. Monthly billing starts automatically when Student Benefit ends.
4. If you already used Student Benefit, billing starts today.
5. Cancel before the next billing date to avoid further charges.
6. Payments are non-refundable.

Student Benefit을 이미 소진했거나 받았다가 취소한 사람도 같은 화면으로 결제한다. 케이스를 나누지 않고 **무료 대상을 문구에 밝혀** 한 세트가 두 상황을 모두 커버한다. 2번 항목이 대상을, 4번 항목이 소진한 경우를 담당한다. (2026-08-31 개정)

**4. Prepaid — New Purchase** (Enterprise Team, Enterprise Team Linux, Academic)
1. I agree to the Marvelous Designer License Agreement.
2. The license is available immediately after payment.
3. The license is valid for the purchased term.
4. The license does not renew automatically. To continue using it after expiration, you must purchase it again.
5. Once payment is completed, the purchase cannot be canceled or refunded.

**5. Prepaid — Add Seats and Extend** (Adding Seats to an existing license, extending its term, or both)
1. I agree to the Marvelous Designer License Agreement.
2. Added Seats are available immediately after payment.
3. Added Seats are charged only for the time left on the existing license.
4. Added Seats expire on the same date as the existing license.
5. An extended term begins after the current license expires.
6. The license does not renew automatically. To continue using it after expiration, you must purchase it again.
7. Once payment is completed, the purchase cannot be canceled or refunded.

Seat 추가와 기간 연장은 한 화면에서 함께 또는 하나만 선택한다. 구매 유형도 `Add·Extend` 하나다. 따라서 케이스를 쪼개지 않고 **선택하지 않은 항목이 자기 얘기가 아님이 읽히도록** 한 세트로 쓴다. 2번부터 4번은 Seat를 추가한 경우, 5번은 기간을 연장한 경우를 담당한다. (2026-08-31 개정 — 구 케이스 5 `Add Seats`와 케이스 6 `Extend`를 통합. 두 케이스를 쓰는 화면이 없었다)

Checkout 동의 문구는 현재 구매와 직접 관련된 정보만 담는다. 동시 접속 제한, 계정 공유와 어뷰징, 그 외 일반 라이선스 사용 제한은 License Agreement에서 다룬다.

> Canvas는 케이스 4의 Applies to에 Indie를 포함하나, Indie는 웹 판매 제외(백오더 전용, §12)로 웹 Checkout에 도달하지 않아 원장에서는 제외했다.

### 14.2 CTA 버튼 동작

| 결제수단 선택 | CTA 버튼 텍스트 |
|-------------|--------------|
| Stripe (Card) | `Pay with Card` |
| AliPay | `Pay with AliPay` |
| PayPal | `Continue to PayPal` |
| 미선택 | `Continue` (비활성) |

필수 항목을 모두 채우고 통합 체크박스에 동의해야 CTA가 활성화된다. 필수 항목은 계열마다 다르다.

| 계열 | 필수 항목 |
|---|---|
| 개인 (Individual, Student) | 결제수단 |
| Organization 신규 구매 | Seat 설정, 결제수단 |
| Organization Seat 추가·기간 연장 | 추가 수량 또는 연장 연수 중 하나 이상, 결제수단 |
| Enterprise Single | 결제수단 (Seat는 1로 고정) |

Tax ID는 선택 입력이므로 활성 조건에 포함하지 않는다.
세율을 확정할 수 없는 경우 합계가 미확정이므로 CTA를 비활성한다. (§7.3)

Organization 계열 SW Account 지정 화면의 `Set Order` 버튼은 SW Account 선택을 완료하면 활성화된다. 클릭하면 결제 화면으로 진입한다. (2026-08-25 — 구 `[다음]` 명칭 변경)

---

## 관련 문서

- PRD: Figma `Order/Checkout PRD 1, 2`(`8873:1705`, `8874:1705`) + `Order/Checkout 기능명세`(`8875:1705`)
- Figma: `PeCid7uJcg0HenViaaiHUp` / `Order/Checkout ✅`(`237:3132`)
- Jira: MDWEB-870
