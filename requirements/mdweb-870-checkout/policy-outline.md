# [MD|SITE] 결제 페이지 & 흐름 — 정책 문서 목차(안)

Epic Key: `MDWEB-870` | 요청: Josh Lim | 출처: Jira MDWEB-870 (Epic MDWEB-827) | 작성일: 2026-07-29

> **Phase A 산출물.** 목차와 각 섹션이 답할 질문만 정의한다. 본문은 Josh 승인 후 Phase B에서 작성한다.

---

## 0. 이 문서의 독자와 목적

독자는 BD · CS · 글로벌팀이다. 개발 스펙이 아니라 "새 결제에서 무엇이 어떻게 동작하는지"를 읽고 이해할 수 있는 수준으로 쓴다.

전제 — 2026-06-23 계정 구조 전면 개편(`member.md` 변경 이력)으로 MemberType이 폐지됐다. `checkout.md`(MDWEB-634 시점)는 구 MemberType 기준으로 작성돼 있어 이 문서가 신 구조 기준의 단일 기준선이 된다.

---

## 1. 정책 문서 목차(안)

| # | 섹션명 | 이 섹션이 답하는 질문 | 근거 정책 파일 |
|---|---|---|---|
| 1 | 문서 범위와 전제 | 이 문서가 다루는 결제 범위는 어디까지이고, 어떤 계정 구조를 전제하는가 | `member.md` 변경 이력 · §1-1 |
| 2 | 계정 구조 요약 (Member / SW Account / Group) | 결제를 시작할 수 있는 주체는 누구이고, 누가 어떤 플랜을 살 수 있는가 | `member.md` §1-1 · §3 · §4 |
| 3 | 판매 플랜 목록과 가격 | 결제 페이지에서 팔 수 있는 플랜은 몇 종이고, 각 가격·기간·동시접속 조건은 무엇인가 | `plan.md` §2-1 · §2-2 |
| 4 | 결제 진입 조건과 차단 규칙 | 어떤 상태의 사용자가 결제 페이지에 들어올 수 있고, 못 들어오면 무엇을 보게 되는가 | `checkout.md` §1 · `plan-card.md` 매핑표 · `member.md` §4 |
| 5 | 결제 페이지 화면 구성 개요 | 결제 페이지는 어떤 카드·영역으로 구성되고 각 영역의 역할은 무엇인가 | `checkout.md` §4 · §6 · `plan.md` §4 |
| 6 | SW Account 선택 · 신규 생성 (플로우 ④) | Group 플랜을 살 때 라이선스를 누구에게 붙일지 어떻게 정하고, 없으면 어떻게 만드는가 | `member.md` §3-2 · `plan.md` §4-2 |
| 7 | 구매 유형 (Extend / Reserve / Add) | 구매 유형은 언제 노출되고, 선택된 SW Account 상태에 따라 어떻게 달라지는가 | `plan.md` §4-2 · §3 Indie 운영 정책 · `member.md` §6 SWAccess #16 |
| 8 | 지불 방식 (Annual / Monthly) | 플랜별로 어떤 지불 방식을 고를 수 있고 기본값은 무엇인가 | `plan.md` §4-1 · §2-1 · §2-2 |
| 9 | Seat 수 선택 | Seat 수는 어떤 플랜에서 고를 수 있고, 최대 몇 개까지 가능한가 | `plan.md` §4-3 · §3 Indie 운영 정책 |
| 10 | 플랜별 신규 구매 (플로우 ①) | 8종 플랜 각각의 신규 구매는 무엇이 다른가 | `plan.md` §2-1 · §2-2 · §3 · §4 |
| 11 | Seat 추가 · 기간 연장 (플로우 ②) | 이미 라이선스를 보유한 Group이 Seat를 늘리거나 기간을 늘릴 때 무엇이 달라지는가 | `plan.md` §3 Indie 운영 정책 · §4-2 |
| 12 | Enterprise Single → Team 전환 (플로우 ③) | 월간 1석 사용자가 연간 N석으로 옮길 때 잔여 기간·금액·SW Account는 어떻게 처리되는가 | `plan.md` §2-1 *(정책 확인 필요 — 전환 규칙 미정의)* |
| 13 | Student Benefit 처리 | 학생 인증 완료자의 3개월 무료 혜택은 결제 페이지에서 어떻게 표시되고 첫 결제는 언제인가 | `plan.md` §3 Student · `member.md` §4-1 |
| 14 | Individual Trial · Auto Renew | 14일 Trial과 Annual Auto Renew는 결제 시점과 어떻게 맞물리는가 | `plan.md` §3 Trial 정책 · Auto Renew 정책 |
| 15 | Order Summary 구성 | 사용자가 결제 직전에 확인하는 금액 내역은 어떤 행으로 구성되는가 | `checkout.md` §4 · `plan.md` §4-4 · §4-5 · §4-6 |
| 16 | Coupon · Discount | 쿠폰은 어떤 결제에서만 쓸 수 있고, 할인은 금액에 어떤 순서로 반영되는가 | `plan.md` §4-6 · §4-5 · `error-copy.md` §2 Coupon |
| 17 | Tax / VAT | 국가별 세금은 어떻게 계산되고, 사업자는 어떻게 면세를 받는가 | `checkout.md` §5-1 · §5-2 · §5-3 · `plan.md` §4-4 |
| 18 | 국가 · 주소 · 결제수단 | 국가가 바뀌면 결제 페이지에서 무엇이 함께 바뀌는가 | `checkout.md` §2 · §3 · §6 · `plan.md` §4-7 |
| 19 | 결제 실행과 결과 처리 | CTA는 언제 활성화되고, 결제 성공·실패 시 사용자는 무엇을 보게 되는가 | `checkout.md` §8 · `error-copy.md` §2 License/Billing · §3 |
| 20 | 이탈 · 복귀 시 입력값 유지 | PG 화면에서 뒤로 오거나 새로고침하면 입력값은 어떻게 되는가 | `checkout.md` §7 |
| 21 | 인증 대기 · 거절 상태에서의 결제 | Student · Academic · Indie 인증이 끝나지 않았을 때 결제는 어떻게 처리되는가 | `member.md` §4 · `verification.md` §1 · §6 · `plan-card.md` 업데이트 필요사항 §3 |
| 22 | 에러 · 빈 상태 · 로딩 기준 | 결제 페이지에서 실패·대기 상황을 사용자에게 어떻게 알리는가 | `error-states.md` §1-1 · §2 · §3 · §4 · §6 · `error-copy.md` §2 · §3 |
| 23 | 운영 · CS 대응 포인트 | Admin 수동 처리가 필요한 지점과 CS 문의가 몰릴 지점은 어디인가 | `plan.md` §3 Indie 운영 정책 · `verification.md` §6 · `error-copy.md` §4-2 |
| 24 | 정책 격차 · 미결 항목 | 기존 정책 문서 간 충돌 지점은 어디이고 무엇이 아직 안 정해졌는가 | `checkout.md` 전체 ↔ `member.md` §1-1 · `plan-card.md` 업데이트 필요사항 |
| A1 | Appendix — 신규 용어 | 이번 개편으로 바뀐 정책 용어는 무엇이고 왜 바뀌었는가 | `member.md` §1-1 · `plan.md` §2-1 · §4 · `plan-card.md` 매핑표 |
| A2 | Appendix — 플로우 × 섹션 매핑 | 4종 플로우는 각각 이 문서 어느 섹션을 읽어야 이해되는가 | 이 문서 §2 |

---

## 2. 플로우 4종 → 섹션 매핑

| 플로우 | 주요 섹션 | 보조 섹션 |
|---|---|---|
| ① 각 플랜 신규 구매 | 10 | 3 · 4 · 8 · 9 · 13 · 14 · 15 · 17 · 18 · 19 |
| ② Enterprise Team · Academic Seat Add / Extend | 11 | 6 · 7 · 9 · 15 · 19 |
| ③ Enterprise Single → Team 전환 | 12 | 6 · 8 · 9 · 15 · 19 |
| ④ SW Account 생성 / 선택 (공통 선행) | 6 | 2 · 7 · 21 |

---

## 3. §24 정책 격차 — 하위 항목 (반드시 본문에 포함)

`checkout.md`(구 MemberType 기준) ↔ `member.md`(2026-06-23 계정 구조 개편) 충돌 지점. 어느 쪽도 정답으로 단정하지 않는다.

| # | 충돌 항목 | `checkout.md` 기술 | 신 구조 · 타 정책 기술 | 처리 |
|---|---|---|---|---|
| G1 | 진입 조건의 판별 주체 | MemberType(Non-member / Student / Academic·Indie)으로 분기 (§1) | Member + Verification, Group + Verification으로 분기 (`member.md` §4) | *(정책 확인 필요)* |
| G2 | Student 구매 제한 기준 | "누적 구매 2회 초과 시 진입 차단" (§1) | "첫 구독일 기준 4년(48개월) 이내, Monthly only" (`plan.md` §3) | *(정책 확인 필요)* — 2회 기준은 구 Annual 전제로 보임 |
| G3 | Student 플랜 가격·주기 | Student Annual $99.00 (§4) | Student Monthly $8.25, Annual 옵션 없음 (`plan.md` §2-2) | *(정책 확인 필요)* |
| G4 | Enterprise 플랜 명칭 | 소계표에 `CompanyID` 항목 (§4) | Enterprise Single / Enterprise Team (`plan.md` §2-1) | 신 명칭으로 통일 |
| G5 | Seat 용어 | "시트 수", "Copy 수" 혼용 (§4) | "Seat" 고정, "Copy" 사용 금지 (`plan.md` §4-3) | 신 용어로 통일 |
| G6 | 지불 방식 레이블 | "결제 주기" (§4) | "지불 방식", "결제 주기" 사용 금지 (`plan.md` §4-1) | 신 용어로 통일 |
| G7 | 단가·Seat 행 노출 조건 | "CompanyID·Academic·Indie만 표시" (§4) | Group 플랜 기준으로 재정의 필요 (`member.md` §1-1) | *(정책 확인 필요)* |
| G8 | 결제수단 국가 분기 | KR = Card + Kakao Pay / 그 외 = Card + PayPal (§3). CN 별도 정의 없음 | 기본 Card + PayPal / CN = Card + AliPay (`plan.md` §4-7). Kakao Pay 언급 없음 | *(정책 확인 필요)* — 두 문서가 서로 없는 항목을 가짐 |
| G9 | AliPay CTA 문구 | Card / Kakao Pay / PayPal 3종만 정의 (§8) | AliPay CTA 미정의 (`plan.md` §4-7) | *(정책 확인 필요)* |
| G10 | 구매 유형 종속 대상 | "License ID 선택 완료 후 노출" (`plan.md` §4-2) | SW Account 선택 완료 후 노출 (`member.md` §1-1) | 신 용어로 통일 |
| G11 | 상태 복원 저장 키 | sessionStorage에 `License ID` 저장 (§7) | SW Account 기준 (`member.md` §1-1) | 신 용어로 통일 |
| G12 | Coupon · Discount 누락 | `checkout.md`에 정의 없음 | Coupon Annual 전용, Discount 음수 표시 (`plan.md` §4-5 · §4-6) | `plan.md` 기준으로 §16에 편입 |
| G13 | Academic · Indie 구매 자격 주체 | — | `plan.md` §3은 "인증 완료된 CompanyID만 구매 가능", `member.md` §4는 Group 레벨 인증 | *(정책 확인 필요)* — `plan.md` 자체에 구 용어 잔존 |
| G14 | Enterprise Linux | 정의 없음 | `plan.md` §2-1에 항목 없음(Enterprise Offline만). `plan-card.md`는 "ENTERPRISE (Online / Linux)" | *(정책 확인 필요)* — 판매 대상·가격·기간 미정의 |
| G15 | Single → Team 전환 규칙 | 정의 없음 | 어느 정책 파일에도 없음 | *(정책 확인 필요)* — 잔여 기간 정산·SW Account 승계 규칙 전무 |
| G16 | Add / Extend / Reserve 관계 | Extend / Reserve 2종만 언급 (`plan.md` §4-2) | Indie는 "Add만 가능, Extend 불가" (`plan.md` §3) → Add가 별도 유형인지 불명 | *(정책 확인 필요)* |
| G17 | Student Benefit 결제 표기 | 정의 없음 | 3개월 무료, "Trial" 라벨 노출 금지 (`plan.md` §3) | *(정책 확인 필요)* — Order Summary 첫 결제 금액 표기 방식 미정의 |
| G18 | Individual Annual Auto Renew 노출 | 정의 없음 | 구매 시 설정 가능 (`plan.md` §3) | *(정책 확인 필요)* — 결제 페이지 노출 여부·기본값 미정의 |
| G19 | SW Account의 결제 페이지 접근 | §1 진입 조건에 License ID 케이스 없음 | SW Account는 Web 로그인 없음 (`member.md` §3-2) → 진입 자체 불가 | 진입 조건에서 "해당 없음"으로 명시 |
| G20 | Student Benefit Active 상태 진입점 | 정의 없음 | `plan-card.md` 업데이트 필요사항 §3 P1 — 버튼 텍스트·상태 미정의 | *(정책 확인 필요)* — 결제 진입 가능 여부에 직결 |

---

## 4. 작성 규칙 (Phase B 적용)

- 문체: `.claude/rules/prd-writing.md` — 본문 `~한다`, 항목·레이블 명사형
- 사용자 노출 문구: `.claude/rules/ux-writing.md`. 와이어프레임 문구는 EN (`error-states.md` §0-2)
- 개발 구현·CSS·빌드 스펙 포함 금지
- 미결 항목은 단정하지 않고 *(정책 확인 필요)* 표기
