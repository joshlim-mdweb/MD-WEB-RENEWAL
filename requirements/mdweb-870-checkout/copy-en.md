# Checkout WF — EN 문구 세트 (T-01-3)

**이 파일이 F-01 WF 30프레임 문구의 단일 출처다.** WF에 넣는 EN 문구는 여기서 가져가고, 문구 변경도 여기서 한다. 같은 폴더의 다른 파일(`design-spec.md` 등)은 문구 출처로 쓰지 않는다.

기준: `docs/policy/checkout.md` §0 2-step 구조 · `ux-writing.md` §1.1 (EN 원본) · `/copy-review` 통과본
작성일: 2026-08-13 | 화면 단위: **Step 1 / Step 2** 분리 (개인 계열 단일 화면은 Step 2 세트에서 개인 전용 항목 사용)

표기 원칙 (T-01-4 확정): Seat 수량은 `N Seats`, N=1은 `1 Seat`. 버튼·제목 Title Case, 본문·에러 Sentence case. 날짜는 `January 1, 2026` 형식 (아래 날짜·금액은 더미값).

상태 표기: ✅ 기확정 (출처 명시) · ✍ 신규 작성 · 🚩 정책 부재 — 창작하지 않음

---

## 1. Step 1 — SW Account 지정 (Organization 계열 전용)

| 요소 | EN | 상태 |
|---|---|---|
| 화면 제목 | `Assign Licenses` | ✍ |
| 단계 표시 | `Step 1 of 2` | ✍ |
| 셀렉터 Label | `Assign to` | ✅ checkout-renewal.md 2026-08-11 확정 |
| 셀렉터 Placeholder | `Select an SW Account for these licenses` (폭 좁으면 `Select an SW Account`) | ✅ 동일 |
| 셀렉터 Helper | `An SW Account is a license-only account. It can't sign in to the web.` | ✅ 동일 |
| Empty (보유 계정 0개) | `No SW Accounts yet. Create one to assign licenses.` | ✍ 확정본 수정 — 아래 수정 노트 참조 |
| 신규 생성 버튼 | `Create SW Account` | ✍ |
| 신규 생성 입력 필드 | *(정책 필요 — SW Account 생성 시 입력 필드 정의가 `checkout.md` §9·`design-spec.md` §2.2 어디에도 없음)* | 🚩 |
| 판정 배지 — 신규 할당 | `New Assignment` | ✍ Canvas EN 표기 `New assignment`의 배지형 (Title Case) |
| 판정 근거 — 신규 할당 | `The license starts on the payment date.` | ✍ §9 판정표 |
| 판정 배지 — 기존 라이선스 있음 | `Existing License` | ✍ Canvas EN 표기 `Existing license`의 배지형 |
| 판정 근거 — 기존 라이선스 있음 | `The current license expires on January 1, 2026.` | ✍ §9 판정 근거(현재 만료일) 표시 |
| Error 제목 (목록 조회 실패) | `Couldn't load this list` | ✍ 이 파일이 최종 출처 |
| Error 본문 | `A temporary error occurred.` | ✍ 이 파일이 최종 출처 |
| Error 재시도 버튼 | `Try Again` | ✍ 버튼 Title Case (`ux-writing.md` §1.1) |
| Loading | 문구 없음 — Skeleton | — |
| 다음 버튼 | `Next` | ✍ `ux-writing.md` §4.5 (Continue/Next → 다음) |
| 뒤로 버튼 (Step 2에서) | `Back` | ✍ §4.5 |

---

## 2. Step 2 — 결제 (개인 계열 단일 화면 공용)

### 2.1 지불 방식 · 액션 · Seat

| 요소 | EN | 상태 |
|---|---|---|
| 화면 제목 | `Checkout` | ✍ |
| 단계 표시 (Organization만) | `Step 2 of 2` | ✍ |
| 지불 방식 섹션 제목 | `Subscription Option` | ✅ Canvas EN 용어 |
| 지불 방식 토글 | `Annual` / `Monthly` | ✍ 연간 왼쪽 고정 (Josh 확정 — checkout-renewal.md WF 행 분리 기준) |
| 액션 선택 (판정 = 기존 라이선스 있음) | `Add Seats` / `Extend License` / `Switch to Team` | ✍ §11 액션 3종. `Extend` 단독은 목적어 없음(§4.3)이라 `Extend License` |
| Seat 섹션 제목 | `Seats` | ✍ |
| Seat 프리셋 탭 | `5` / `10` / `20` / `Custom` (Indie: `1` / `3` / `5` / `Custom`) | ✅ Canvas EN `[Custom]` |
| Custom 입력 Placeholder | `Number of Seats` | ✍ 명사구 단독 (§5.4) |
| Seat 0·빈 값 인라인 에러 | `Enter at least 1 Seat.` | ✍ `checkout.md` §14 CTA 활성 조건 대응 |
| Indie 상한 안내 | `Indie plans include up to 5 Seats.` | ✍ §10 · P6 (제약은 결정 전에) |
| 기존 Seat 참조 (Seat 추가 시) | `Current Seats: 10` | ✍ §10 (읽기 전용 병기) |
| 추가 수량 Label (Seat 추가 시) | `Seats to Add` | ✍ |
| 연장 연수 Label (기간 연장 시) | `Years to Extend` | ✍ |

### 2.2 Billing Address · Tax

| 요소 | EN | 상태 |
|---|---|---|
| 섹션 제목 | `Billing Address` | ✍ |
| 주소 없음 안내 | `No billing address yet. Add one to see the final price including tax.` | ✍ 빈 상태 = 이유 + 다음 행동 (§5.3) |
| 주소 등록 버튼 | `Add Billing Address` | ✍ 목적어 포함 (§4.3) |
| 주소 수정 버튼 | `Edit` | ✍ §4.5 |
| 모달 필드 Label | `Country` / `State` / `ZIP Code` / `Address Line 1` / `Address Line 2` | ✍ §8.3 필드 |
| 모달 버튼 | `Close` / `Save` | ✍ §4.4 (왼쪽 = Close 고정) |
| 세금 미확정 안내 (ZIP·주 미입력) | `Enter your ZIP Code to calculate tax.` | ✍ §7.3 (합계 미확정 + CTA 비활성) |
| 주소 검증 실패 (PG 이동 직전) | `Check your billing address.` + 주소 수정 모달 오픈 | ✍ §8.4 · 에러 템플릿 `Check your [field].` |
| Tax ID Label (EU 청구지만) | `VAT Number` | ✍ Canvas §2-1 EN 표기 준거 |
| Tax ID Helper | `Optional. With a valid VAT Number, reverse charge applies.` | ✍ §7.2 (선택 입력 · 역과세) |
| 역과세 세금 행 | `Tax: €0.00 (Reverse Charge)` | ✅ checkout.md §7.2 확정 |

### 2.3 Coupon · Order Summary · 결제

| 요소 | EN | 상태 |
|---|---|---|
| Coupon 입력 Placeholder | `Coupon Code` | ✍ 명사구 단독 |
| Coupon 적용 버튼 | `Apply` | ✍ §4.5 |
| Coupon 에러 — 잘못된 코드 | `This coupon code is invalid.` | ✍ 이 파일이 최종 출처 |
| Coupon 에러 — 만료 | `This coupon has expired.` | ✍ 이 파일이 최종 출처 |
| Coupon 에러 — 적용 불가 | `This coupon can't be applied to your current subscription.` | ✍ 이 파일이 최종 출처 |
| Order Summary 제목 | `Order Summary` | ✍ |
| 행 Label | `Subscription Option` / `Unit Price` / `Seats` / `Subtotal` / `Coupon` / `Discount` / `Total` | ✍ §6 행 구성 |
| Seats 행 값 | `10 Seats` (1이면 `1 Seat`) | ✅ T-01-4 ⑫ 확정 |
| 세금 행 Label | 국가별 — `VAT 19%` · `Tax` 등 | ✅ §7.1-1 표 준거 |
| 결제수단 섹션 제목 | `Payment Method` | ✍ |
| 결제수단 옵션 | `Credit / Debit Card` / `PayPal` / `AliPay` | ✅ Canvas §2-2 EN 표기 |
| 약관 체크박스 1 | *(정책 필요 — 약관 문구 원문. F-04에서 개수 2개만 확정, 근거 정책·법무 원문 부재)* | 🚩 |
| 약관 체크박스 2 | *(정책 필요 — 동일)* | 🚩 |
| CTA — 카드 | `Pay with Card` | ✅ checkout.md §14 확정 |
| CTA — AliPay | `Pay with AliPay` | ✅ 동일 |
| CTA — PayPal | `Continue to PayPal` | ✅ 동일 |
| CTA — 미선택 (비활성) | `Continue` | ✅ 동일 |

### 2.4 개인 계열 전용 (Trial · Student Benefit)

| 요소 | EN | 상태 |
|---|---|---|
| Trial 배지 | `14-Day Free Trial` | ✍ §4 (14일 무료) |
| Trial 안내 | `Free for 14 days. Your plan starts automatically when the trial ends.` | ✍ §4 · P6 (자동 결제를 결정 전에 고지) |
| Trial 결제 금액 표시 | `$0.00` | ✅ §4 확정 |
| Student Benefit 배지 | `Student Benefit` | ✅ 용어 고정 (localization.md) |
| Student Benefit 합계 표시 | `$0.00` — "Trial" 표기 금지 | ✅ §6 확정 (2026-08-11) |

---

## 3. 결과 · 에러 화면

| 요소 | EN | 상태 |
|---|---|---|
| 완료 제목 | `Order Complete` | ✍ |
| 완료 본문 (개인) | `Your license is ready. Download Marvelous Designer to get started.` | ✍ §7.3 · P1 (결과 먼저) |
| 완료 본문 (Organization) | `Your licenses are assigned to the selected SW Account. Manage them in Team Console.` | ✍ §7.3 · §9 배정 규칙 |
| 완료 버튼 (개인) | `Download Marvelous Designer` / `Go to My Page` | ✍ |
| 완료 버튼 (Organization) | `Go to Team Console` | ✍ |
| 결제 실패 모달 제목 | `Payment Failed` | ✍ 이 파일이 최종 출처 |
| 결제 실패 모달 본문 | `There was an error while requesting the payment. Please try again shortly.` | ✍ 이 파일이 최종 출처 |
| 결제 실패 모달 버튼 | `Close` / `Try Again` | ✍ §4.4 액션 에코 |
| 401 제목 / 본문 | `Session Expired` / `Your session has ended. Sign in to continue.` | ✍ 이 파일이 최종 출처 (제목 Title Case) |
| 401 버튼 | `Sign In` | ✍ |
| 500 제목 / 본문 | `Something Went Wrong` / `A temporary error occurred. Try again in a moment.` | ✍ 이 파일이 최종 출처 (제목 Title Case) |
| 500 버튼 | `Try Again` | ✍ |
| 점검 제목 / 본문 | `Under Maintenance` / `The service is temporarily unavailable. Check back soon.` | ✍ 이 파일이 최종 출처 |
| 필수 입력 인라인 | `This field is required.` | ✍ 이 파일이 최종 출처 |
| 이메일 형식 인라인 | `Enter a valid email.` | ✍ 이 파일이 최종 출처 |

---

## 4. 진입 차단 화면 (Row: BLOCKED)

공통 구조: 제목 + 본문 + 다음 행동 버튼. 근거: `checkout.md` §1 · §12, Figma Flow & Case 진입차단 03~진입차단 09.

| 케이스 | 제목 | 본문 | 버튼 | 상태 |
|---|---|---|---|---|
| Student 4년 초과 (진입차단 03) | `Student Plan Unavailable` | `Student plans are available for 4 years after your first verification approval. Your 4-year period has ended.` | `Upgrade to Individual` | ✍ §1 |
| 인증 미완료 (진입차단 04·진입차단 06) | `Verification Required` | `Verification is required to purchase this plan.` | `Get Verified` / `View Plans` | ✍ §12 |
| 인증 대기 (진입차단 05) | `Verification in Process` | `Your verification is under review. You can purchase this plan after approval.` | `View Plans` | ✍ §1 · §12. 처리 기간은 노출하지 않음 (solutions-copy §6) |
| Organization 없음 (진입차단 07·진입차단 08) | `Organization Required` | `You need an Organization to purchase this plan.` | `Create Organization` | ✍ §1 |
| 라이선스 보유 (진입차단 09) | `Active License Found` | `This account already has an active license.` | `Go to My Page` | ✍ *(정책 확인 필요 — 진입차단 09의 정확한 차단 조건·이동 목적지가 원장에 없음. Flow & Case 진입차단 09만 근거)* |
| Non-Member | 화면 없음 — 로그인 리다이렉트 (`?redirect=` 유지) | — | — | ✅ §1 |

---

## 수정 노트 (이전 문안 대비 변경 2건)

- **Empty 문구**: 확정본 `No SW Accounts yet. Create one in Team Console to assign licenses.` → `No SW Accounts yet. Create one to assign licenses.` — `checkout.md` §9가 Step 1 안에서도 생성을 허용하므로 Team Console 한정 표현이 정책과 어긋남 (Planner 지시)
- **버튼·제목 Title Case 정정**: 이전 문안의 `Try again`·`Session expired`·`Something went wrong`을 `Try Again`·`Session Expired`·`Something Went Wrong`으로 정정 (`ux-writing.md` §1.1 — 버튼·제목은 Title Case)

## 미결 (창작하지 않고 플래그)

| # | 항목 | 필요한 것 |
|---|---|---|
| 1 | 약관 체크박스 2개 | 약관 문구 원문 — 정책·법무 원문 부재. **문장화 문제가 아니라 정책 부재** |
| 2 | SW Account 생성 입력 필드 | 생성 모달 필드 정의 (§9·design-spec 모두 없음) |
| 3 | 진입차단 09 라이선스 보유 차단 | 정확한 차단 조건·이동 목적지의 원장 근거 |

---

## 관련 문서

- 정책: `docs/policy/checkout.md` (§0 Step 구조 · §14 CTA)
- 확정 문구 출처: `docs/backlog/projects/checkout-renewal.md` "확정 문구 — SW Account 배정 드롭다운 (2026-08-11)"
- Figma: `PeCid7uJcg0HenViaaiHUp` / `Order/Checkout (In progress🔥)` — F-01 WF 30프레임
- Jira: MDWEB-870

---

## 코드 명칭 대응

`진입차단 01`~`진입차단 10`은 Checkout 진입 차단 조건이다 (구 코드 `B-01`~`B-10`). 대응표는 `requirements/board/TODO.md` 「코드 명칭 대응」 참조.

이 파일의 `T-01-3` · `T-01-4`는 Flow & Case 코드가 아니라 **Planner 작업 행 ID**다.
