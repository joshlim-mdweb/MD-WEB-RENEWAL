# [MD|SITE] 결제 페이지 & 흐름 — 화면 설계서 필요 목록

Epic Key: `MDWEB-870` | 요청: Josh Lim | 출처: Jira MDWEB-870 | 작성일: 2026-07-29

> **Phase A 산출물.** Figma에 그려야 할 프레임을 목록으로만 정리한다. 그리지 않는다.
> Figma page: `Order/Checkout (In progress🔥)` (file `PeCid7uJcg0HenViaaiHUp`, node `237-3132`) — 현재 비어 있음.

---

## 1. 프레임 선별 기준

플로우 4종 × 계정 유형 × Verification 상태 조합에서 **화면 구성이 실제로 달라지는 지점만** 프레임으로 잡았다.

| 판단 | 처리 |
|---|---|
| 카드 구성·필드 세트가 다름 | STRUCTURE 프레임 분리 |
| 사용자 액션으로 화면이 변함 | FEATURE 프레임 |
| 같은 레이아웃에서 값·노출 여부만 다름 | CASE VIEW 한 프레임에 케이스로 묶음 |

플랜 8종을 각각 STRUCTURE로 만들지 않는다. 개인 플랜(SW Account·Seat 없음)과 Organization 플랜(SW Account·Seat 있음) 2종이 구조적으로 다른 유일한 지점이며, 나머지 플랜 차이(지불 방식 고정 여부, Seat 프리셋 구성)는 CASE VIEW로 처리한다.

---

## 2. 화면 설계서 필요 목록

| # | 프레임명 | 타입 | 왜 필요한가 | 근거 (정책 섹션) |
|---|---|---|---|---|
| 1 | Checkout — Personal Plan (Individual / Student) | STRUCTURE | SW Account·구매 유형·Seat 행이 없는 개인 플랜 결제 레이아웃을 기준선으로 확정해야 하기 때문 | `plan.md` §2-2 · §4-1 · `checkout.md` §4 · §6 |
| 2 | Checkout — Organization Plan (Enterprise / Academic / Indie) | STRUCTURE | SW Account 선택 → 축 B 판정 표시 → Seat 수가 추가된 Organization 플랜 레이아웃이 개인 플랜과 다르기 때문 | `member.md` §3-2 · spec §4 |
| 3 | SW Account 선택 → 축 B 판정 표시 | FEATURE | 계정을 고르면 시스템이 New·Extend를 판정하고 근거(현재 만료일 → 구매 후 만료일)를 선택 영역 안에 표시하는 동작을 확인해야 하기 때문. 사용자 선택 컨트롤은 없다 | spec §4-2 · `prd-draft.md` §7-2 |
| 4 | SW Account 신규 생성 | FEATURE | 보유 SW Account가 없을 때 결제 흐름 안에서 생성·초대가 가능한지 확인해야 하기 때문 | `member.md` §3-2 |
| 5 | 지불 방식 — Monthly 전환 | FEATURE | Annual 기본 선택에서 Monthly로 바꿀 때 Coupon 입력 필드가 사라지는 변화를 확인해야 하기 때문 | `plan.md` §4-1 · §4-6 |
| 6 | Seat 수 — 직접 입력 | FEATURE | 프리셋 탭에서 `직접 입력` 선택 시 입력 필드로 전환되고 금액이 재계산되는 동작을 확인해야 하기 때문 | `plan.md` §4-3 · spec §7-3 T-10 |
| 7 | Billing Address 없음 → 모달 생성 → 가격 확정 | FEATURE | 주소가 없으면 가격이 미확정이고, 모달로 생성·저장한 뒤 가격 재조회 1회로 금액이 갱신되는 흐름을 확인해야 하기 때문 | spec §3-1 · §8-4 |
| 8 | Tax ID 입력 → Reverse Charge | FEATURE | 감면 대상 국가 선택만으로 Tax ID 행이 노출되고, 입력 시 세율이 0%로 바뀌는 흐름을 확인해야 하기 때문 (사업자 확인 링크 없음) | spec §3-2 TX-05 · `tax-id-checkout.md` |
| 9 | Coupon 적용 — 성공 / 실패 | FEATURE | 쿠폰 적용 결과가 Order Summary 행 추가와 인라인 에러 두 방향으로 갈리기 때문 | `plan.md` §4-6 · `error-copy.md` §2 License/Billing |
| 10 | 결제 실행 실패 — Payment Failed 모달 | FEATURE | 결제 실패가 토스트가 아니라 모달로 처리되는 확정 문구를 화면으로 고정해야 하기 때문 | `error-copy.md` §2 · §3 (500 결제) |
| 11 | 결제 완료 (Order Complete) | FEATURE | 결제 성공 후 사용자가 다음에 할 행동(라이선스 배정·SW Account 초대)이 정의돼야 하기 때문 | `member.md` §3-2 · `checkout.md` §7 (세션 데이터 삭제 시점) |
| 12 | Seat Add — 기존 라이선스에 Seat 추가 | FEATURE | 신규 구매와 달리 대상 라이선스가 이미 고정된 상태에서 증분만 결제하는 화면이 필요하기 때문 | `plan.md` §3 Indie 운영 정책 · §4-2 |
| 13 | Extend — 기간 연장 | FEATURE | Extend는 Seat 수가 아니라 기간을 늘리는 결제이고 Indie는 이 경로가 차단되기 때문 | `plan.md` §3 Indie 운영 정책 · §4-2 |
| 14 | Enterprise Single → Team 전환 | FEATURE | 만료 후 시작 방식이라 즉시 전환이 아니고, Team 시작 예정일과 Seat 수를 함께 보여줘야 하기 때문 (`정책 초안`) | `prd-draft.md` §12 · PACKET 추가 지시 §1 |
| 15 | 진입 차단 케이스 | CASE VIEW | 결제 페이지에 들어오지 못하는 상태별로 사용자가 보는 화면이 다르기 때문 | `checkout.md` §1 · `member.md` §3-2 · §4 · `plan-card.md` 업데이트 필요사항 §3 |
| 16 | 플랜별 지불 방식 · Seat UI 케이스 | CASE VIEW | 플랜 8종이 같은 레이아웃에서 토글·Seat 구성만 다르고, Seat 수가 금액에 직접 반영되므로 프리셋 구성과 단가 표기를 한 프레임에서 대조해야 하기 때문 | `plan.md` §2-1 · §2-2 · §4-1 · §4-3 · `prd-draft.md` §9 |
| 17 | Order Summary 케이스 | CASE VIEW | 세금·쿠폰·할인·무료 혜택 조합에 따라 표시 행 수가 달라지고, Organization 플랜은 `단가 / Seat` · `Seat 수` 행이 추가돼 소계 계산식 자체가 달라지기 때문 | `checkout.md` §5-1 · `plan.md` §4-4 · §4-5 · §4-6 · `prd-draft.md` §15 |
| 18 | CTA 상태 케이스 | CASE VIEW | 약관 동의·결제수단 선택·가격 확정·SW Account 선택 조건에 따라 CTA 활성 여부와 문구가 달라지기 때문 | `checkout.md` §8 · spec §8-6 |
| 19 | 에러 · 빈 상태 · 로딩 케이스 | CASE VIEW | 전면 에러·인라인 실패·Skeleton 기준을 결제 페이지 맥락에서 한 번에 확정해야 하기 때문 | `error-states.md` §2 · §3 · §4 · §6 · spec §8-8 |
| 20 | Billing Address 모달 | CASE VIEW | 개인·조직 × 생성·수정 4가지가 같은 모달을 쓰되 저장 대상과 진입 문구가 다르기 때문 | spec §3-1 · §8-4 |

**총 20 프레임** — STRUCTURE 2 · FEATURE 12 · CASE VIEW 6

---

## 3. CASE VIEW 프레임별 케이스 목록

### #15 진입 차단 케이스

| 케이스 | 화면 |
|---|---|
| Non-Member | 로그인 페이지로 리다이렉트 (`?redirect=` 유지) — 결제 페이지 미표시 |
| Member (Student 인증 완료, 최초 인증 승인일 기준 4년 초과) | 진입 차단 + Individual 플랜 안내 (4년 기준 확정 — G2·G3 해소) |
| Member (Student 인증 없음) | 진입 차단 + 인증 절차 안내 |
| Organization Owner (Academic 인증 대기 중) | 진입 차단 + 인증 검토 중 안내, CTA 비활성 |
| Organization Owner (Indie 인증 대기 중) | 진입 차단 안내 *(정책 확인 필요 — Indie 상태값 UI 미노출 정책과 충돌, G22)* |
| Member (Organization 없음, Organization 플랜 대상) | Organization 생성 선행 안내 |
| Organization 이미 1개 보유 + 추가 생성 시도 | 생성 차단 (spec §7-1 B-08) |
| SW Account | 해당 없음 — Web 로그인 불가로 진입 경로 자체 없음 (`member.md` §3-2) |
| Member (Student Benefit Active) — Student 플랜 재구매 | 진입 차단 (이미 보유) |
| Member (Student Benefit Active) — Individual·Organization 플랜 | **정상 진입** — 막지 않음 |
| 정상 진입 | 결제 페이지 표시 |

### #16 플랜별 지불 방식 · Seat UI 케이스

| 플랜 | 지불 방식 | Seat UI |
|---|---|---|
| Individual Monthly / Annual | Annual(기본) · Monthly | 없음 |
| Student Monthly | Monthly 고정 — 토글 미노출 | 없음 |
| Enterprise Single | Monthly 고정 | 1 고정 (Max 1) |
| Enterprise Team | Annual 고정 | 프리셋 `[5][10][20][직접 입력]` |
| Enterprise Team Linux | Annual 고정 (Prepaid only) | 프리셋 `[5][10][20][직접 입력]` |
| Academic Annual | Annual 고정 | 프리셋 `[5][10][20][직접 입력]` |
| Indie Annual | Annual 고정 | 프리셋 `[1][3][5][직접 입력]` + 5 초과 차단 |

### #17 Order Summary 케이스

| 케이스 | 표시 |
|---|---|
| 세율 0% 국가 | 세금 행 숨김 |
| 부가세 국가 (KR·JP·AU·SG·EU·GB) | 국가별 세금 행 라벨 표시 |
| 주소 또는 ZIP 없음 (전 국가) | 세금 행에 미확정 안내, 합계 미확정, CTA 비활성 |
| 주소 + ZIP 입력 완료 | 세율 확정 + 합계 표시 |
| Tax ID 입력 완료 (EU·GB·MX 등) | `Tax: 0.00 (Reverse Charge)` 표시 |
| Coupon 적용 | `Coupon` 행 `-$n` 표시 |
| Discount 적용 | `Discount` 행 `-$n` 표시 |
| Organization 플랜 (Enterprise Team · Team Linux · Academic · Indie) | `단가 / Seat` · `Seat 수` 행 표시, 소계 = 단가 × Seat 수 |
| Enterprise Single | 단가 · Seat 수 행 숨김 (Max 1 — Seat 개념 미적용) |
| 개인 플랜 | 단가 · Seat 수 행 숨김 |
| Student Benefit | 결제 예정 금액 $0.00 + "3개월 후 $8.25 청구" 안내 |

### #18 CTA 상태 케이스

결제수단은 Billing Address 국가 기준이다. 중국(접속 IP 또는 주소 국가)만 카드 + AliPay, 그 외는 카드 + PayPal. Kakao Pay는 제공하지 않는다.

| 케이스 | CTA |
|---|---|
| 결제수단 미선택 | `Continue` (비활성) |
| 신용카드 / 체크카드 선택 | `Pay with Card` |
| PayPal 선택 | `Continue to PayPal` |
| AliPay 선택 (중국) | `Continue to AliPay` |
| 약관 2종 중 하나라도 미동의 | 비활성 |
| 주소 또는 ZIP 미입력 (전 국가) | 비활성 (합계 미확정) |
| Organization 플랜 — SW Account 미선택 | 비활성 |
| 전 조건 충족 | 활성 |
| 결제 처리 중 | 버튼 내부 인디케이터 (로딩 휠 금지) |

### #19 에러 · 빈 상태 · 로딩 케이스

| 케이스 | 처리 |
|---|---|
| 페이지 로딩 | Skeleton (로딩 휠 금지) |
| SW Account 목록 조회 실패 | 인라인 EmptyState(Error) + `Try again` |
| SW Account 없음 | Empty 상태 + 생성 유도 |
| 세션 만료 | 전면 401 `Session expired` |
| 서버 오류 | 전면 500 `Something went wrong` |
| 쿠폰 코드 오류 | 인라인 에러 (`This coupon code is invalid.` 등) |
| 필수 입력 미완 | 필드 인라인 에러 (`This field is required.`) |
| 결제 요청 실패 | Payment Failed 모달 (#10) |
| Avalara 조회 실패 | 가격 미확정 + 재시도 (spec §7-3 T-13) |
| PG 이동 직전 주소 유효성 실패 | 이동 중단 + 주소 수정 모달 (spec §7-4 A-10·A-11) |

---

## 4. 프레임에 넣지 않은 것 (의도적 제외)

| 제외 항목 | 이유 |
|---|---|
| 플랜 8종 각각의 STRUCTURE 프레임 | 레이아웃이 같고 토글·Seat 구성만 다름 → #16 CASE VIEW로 흡수 |
| Verification 신청·코드 입력 화면 | 결제 페이지 범위 밖 (`verification.md` 소유, Plan 페이지 진입) |
| Plan 카드 화면 | `plan-card.md` 소유. 결제 진입점이지 결제 화면 아님 |
| MyPage License/Billing 화면 | `mypage.md` 소유. 결제 완료 이후 관리 영역 |
| PG(Stripe · PayPal) 화면 | 외부 서비스 화면 |
| 국가별 세율 프레임 (국가 수만큼) | 값만 다름 → #17 CASE VIEW로 흡수 |
| 구매 유형 선택 UI (라디오·드롭다운) | 축 B는 시스템 판정이라 선택 컨트롤이 없다. 판정 결과 표시는 #3 |
| Kakao Pay 결제수단 | 제공하지 않음 (2026-08-05 확정) |
| Team Console 화면 (Add · Extend 시작 지점) | Team Console 소유. 이 문서는 결제 단계만 다룸 |
| Organization 생성 화면 | `member.md` §3-1 소유. 결제 전 독립 수행 |
