# REPORT — pm · 1차 웨이브 · MDWEB-870 결제 페이지 & 흐름

- 상태: Phase B 완료
- 산출물:
  - requirements/waves/active/policy-doc.md — **정책 문서 (Slack canvas 게시용)** · 199줄
  - requirements/waves/active/design-spec.md — **화면 설계 상세 (Figma Description 재료)** · 418줄
  - requirements/waves/active/screen-list.md — 프레임 목록 · 139줄
  - requirements/waves/active/policy-outline.md — Phase A 목차(안)
  - requirements/waves/active/prd-draft.md — 분할 원본 (추적용, 삭제하지 않음) · 733줄

## 한 일

### Phase A

- `docs/policy/` 7개 파일 전수 읽기 (checkout.md · plan.md · member.md · plan-card.md · verification.md · error-states.md · error-copy.md)
- 정책 문서 목차(안) 24섹션 + Appendix 2종 설계, 섹션별 답할 질문·근거 정책 인용
- `checkout.md` ↔ `member.md` 정책 격차 20건 식별 (policy-outline §3 G1~G20)
- 화면 설계서 필요 목록 19프레임 도출 + CASE VIEW 5종의 케이스 상세
- 신규 용어 11건 정리 — PACKET 후보 9건 전부 정책 파일에서 근거 재확인, 2건 추가

### Phase B

- `prd-draft.md` 신규 작성 — 승인된 목차 24섹션 + Appendix A·B 그대로 준수. 목차에 없는 섹션 추가 없음
- §7 재구성 — "구매 유형 (Extend / Reserve / Add)" → "결제 모드 — 진입 경로별 결정". 구매 유형 행 폐기 및 `plan.md` §4-2 폐기 대상 명시
- §18 재구성 — 국가 선택 · 주소 필드 분기 · 세금 확정까지만. 결제수단은 기본 구성만, 국가별 교체는 `이번 범위 제외` 명시
- §12 Enterprise Single → Team — `정책 초안` 표기 후 Reserve 방식 기술
- §3 Enterprise Linux 신규 반영 ($2,300, Annual Prepaid only, Linux OS 전용)
- §24를 해소 13건 / 미결 12건 / 정책 파일 갱신 필요 3건으로 재구성
- Phase B 작성 중 신규 격차 7건 추가 발견 (G21~G27) — 임의 결정 없이 전부 *(정책 확인 필요)* 플래그
- §23에 Admin 수동 처리 5건 · CS 문의 발생 지점 9건 · 이벤트 로깅 9건 추가
- `screen-list.md` 갱신 — #3 결번 처리, #18 CTA 상태 케이스로 축소, #14 근거 교체, #16에 Enterprise Linux 행 추가, 제외 목록 4건 추가

### 문서 분할 (정책 / 설계)

- `policy-doc.md` 신규 — 정책만 추출·압축. **199줄** (목표 200줄 이내). 독자 BD · CS · 글로벌팀
  - 화면 레이아웃 · 행 구성 · 상태(Default/Hover/Error) · placeholder 문구 전부 제외 (검증: 해당 키워드 0건)
  - 지시된 정책 항목 20개를 유지하되 H2 10개 + Appendix로 그룹화 — 200줄 제약을 맞추려면 섹션 오버헤드를 줄여야 했다
  - 이벤트 로깅은 분석·설계 영역이라 `design-spec.md`로 이동
- `design-spec.md` 신규 — 설계 상세 **418줄**. 카드 구성 · SW Account 동작 · Seat UI · Order Summary · Coupon · 국가/주소/세금 중간 상태 · CTA · 이탈 복원 · 에러/빈/로딩 · 정책 격차 G1~G29 전문 · 이벤트 로깅 · 프레임 매핑
  - §11에 `screen-list.md` 프레임 19개 ↔ 이 문서 섹션 매핑 추가 (Figma 작업 시 참조 경로)
- `prd-draft.md` 733줄 그대로 보존. `screen-list.md` 미변경
- Figma MCP · Slack MCP 미호출

## 추가 지시 이행표

| # | 지시 | 결과 |
|---|---|---|
| 1 | [CRITICAL] G15 Single → Team = Reserve 방식, 정산·환불 없음, Seat 선택 가능, `정책 초안` 명시 | ✅ prd-draft §12 |
| 2 | [CRITICAL] G14 Enterprise Linux = Team 동일 구조 + Linux 전용, Annual Prepaid only, $2,300 | ✅ prd-draft §3-2 · §8-1 · §9 · §10 |
| 3 | [CRITICAL] G16 Reserve 미구현 · Add·Extend는 Team Console 진입 · 구매 유형 행 삭제 · `plan.md` §4-2 폐기 대상 명시 · screen-list #3 결번 · #12·#13 유지 | ✅ prd-draft §7 · §11 · §5-2, screen-list #3 결번 |
| 4 | [CRITICAL] G8·G9 결제수단 국가 분기 범위 제외, 기본 구성만, screen-list #18 CTA 상태로 축소 | ✅ prd-draft §18-3 · §19-2, screen-list #18 |
| 5 | [CRITICAL] G2·G3 Student = `plan.md` 기준 Monthly only $8.25 · 4년 이내, `checkout.md` stale 명시 | ✅ prd-draft §3-1 · §4 · §13 · §24-1 |
| 6 | P2 7건 미결 유지 + *(정책 확인 필요)* 플래그 + §24 격차 항목 | ✅ G13 · G17 · G18 · G20 · G22 · §24-3(checkout.md 갱신 소유권 · plan-card.md 재작성) |
| 7 | 목차 준수 · 목차 외 섹션 금지 · Appendix 신규 용어 11건 · Slack·Figma 금지 | ✅ 24섹션 + Appendix A(11행)·B, MCP 미호출 |
| 8 | [CRITICAL] G21 Group 플랜 가격 = Seat 단가. §3-2 표기 교체 · §9 금액 반영 명시 · §15 소계 계산표 교체 · §24 해소 처리 · `checkout.md` §4 Indie 총액 stale 신규 격차 추가 | ✅ prd-draft §3-2 · §9 · §15-1 · §15-2 · §24-1(G21 해소) · §24-2(G29 신규) · §24-3 |
| 9 | [CRITICAL] G26 Single → Team 시 SW Account 승계. §12-2 플래그 문장 교체 · §24 해소 처리 · 라이선스 할당 상태는 단정 금지 | ✅ prd-draft §12-2 · §24-1(G26 해소) · §24-2(G28로 할당 상태만 분리 플래그) |
| 10 | 문서를 정책/설계로 분리. `policy-doc.md` 200줄 이내 · `design-spec.md` 상세 · `prd-draft.md` 보존 · `screen-list.md` 미변경 · 새 정책 생성 금지 | ✅ policy-doc.md **199줄** / design-spec.md **418줄** / prd-draft.md **733줄 보존** / screen-list.md **미변경(139줄)**. 재배치·압축만 수행, 신규 정책 없음 |

## 정책 문서 목차(안)

| # | 섹션명 | 이 섹션이 답하는 질문 | 근거 정책 파일 |
|---|---|---|---|
| 1 | 문서 범위와 전제 | 이 문서가 다루는 결제 범위는 어디까지이고, 어떤 계정 구조를 전제하는가 | `member.md` 변경 이력 · §1-1 |
| 2 | 계정 구조 요약 (Member / SW Account / Group) | 결제를 시작할 수 있는 주체는 누구이고, 누가 어떤 플랜을 살 수 있는가 | `member.md` §1-1 · §3 · §4 |
| 3 | 판매 플랜 목록과 가격 | 결제 페이지에서 팔 수 있는 플랜은 몇 종이고, 각 가격·기간·동시접속 조건은 무엇인가 | `plan.md` §2-1 · §2-2 |
| 4 | 결제 진입 조건과 차단 규칙 | 어떤 상태의 사용자가 결제 페이지에 들어올 수 있고, 못 들어오면 무엇을 보게 되는가 | `checkout.md` §1 · `plan-card.md` 매핑표 · `member.md` §4 |
| 5 | 결제 페이지 화면 구성 개요 | 결제 페이지는 어떤 카드·영역으로 구성되고 각 영역의 역할은 무엇인가 | `checkout.md` §4 · §6 · `plan.md` §4 |
| 6 | SW Account 선택 · 신규 생성 (플로우 ④) | Group 플랜을 살 때 라이선스를 누구에게 붙일지 어떻게 정하고, 없으면 어떻게 만드는가 | `member.md` §3-2 · `plan.md` §4-2 |
| 7 | 구매 유형 (Extend / Reserve / Add) | 구매 유형은 언제 노출되고, 선택된 SW Account 상태에 따라 어떻게 달라지는가 | `plan.md` §4-2 · §3 · `member.md` §6 SWAccess #16 |
| 8 | 지불 방식 (Annual / Monthly) | 플랜별로 어떤 지불 방식을 고를 수 있고 기본값은 무엇인가 | `plan.md` §4-1 · §2-1 · §2-2 |
| 9 | Seat 수 선택 | Seat 수는 어떤 플랜에서 고를 수 있고, 최대 몇 개까지 가능한가 | `plan.md` §4-3 · §3 Indie 운영 정책 |
| 10 | 플랜별 신규 구매 (플로우 ①) | 8종 플랜 각각의 신규 구매는 무엇이 다른가 | `plan.md` §2-1 · §2-2 · §3 · §4 |
| 11 | Seat 추가 · 기간 연장 (플로우 ②) | 이미 라이선스를 보유한 Group이 Seat를 늘리거나 기간을 늘릴 때 무엇이 달라지는가 | `plan.md` §3 Indie 운영 정책 · §4-2 |
| 12 | Enterprise Single → Team 전환 (플로우 ③) | 월간 1석 사용자가 연간 N석으로 옮길 때 잔여 기간·금액·SW Account는 어떻게 처리되는가 | `plan.md` §2-1 *(정책 확인 필요)* |
| 13 | Student Benefit 처리 | 학생 인증 완료자의 3개월 무료 혜택은 결제 페이지에서 어떻게 표시되고 첫 결제는 언제인가 | `plan.md` §3 Student · `member.md` §4-1 |
| 14 | Individual Trial · Auto Renew | 14일 Trial과 Annual Auto Renew는 결제 시점과 어떻게 맞물리는가 | `plan.md` §3 Trial 정책 · Auto Renew 정책 |
| 15 | Order Summary 구성 | 사용자가 결제 직전에 확인하는 금액 내역은 어떤 행으로 구성되는가 | `checkout.md` §4 · `plan.md` §4-4 · §4-5 · §4-6 |
| 16 | Coupon · Discount | 쿠폰은 어떤 결제에서만 쓸 수 있고, 할인은 금액에 어떤 순서로 반영되는가 | `plan.md` §4-6 · §4-5 · `error-copy.md` §2 |
| 17 | Tax / VAT | 국가별 세금은 어떻게 계산되고, 사업자는 어떻게 면세를 받는가 | `checkout.md` §5-1 · §5-2 · §5-3 · `plan.md` §4-4 |
| 18 | 국가 · 주소 · 결제수단 | 국가가 바뀌면 결제 페이지에서 무엇이 함께 바뀌는가 | `checkout.md` §2 · §3 · §6 · `plan.md` §4-7 |
| 19 | 결제 실행과 결과 처리 | CTA는 언제 활성화되고, 결제 성공·실패 시 사용자는 무엇을 보게 되는가 | `checkout.md` §8 · `error-copy.md` §2 · §3 |
| 20 | 이탈 · 복귀 시 입력값 유지 | PG 화면에서 뒤로 오거나 새로고침하면 입력값은 어떻게 되는가 | `checkout.md` §7 |
| 21 | 인증 대기 · 거절 상태에서의 결제 | Student · Academic · Indie 인증이 끝나지 않았을 때 결제는 어떻게 처리되는가 | `member.md` §4 · `verification.md` §1 · §6 · `plan-card.md` 업데이트 필요사항 §3 |
| 22 | 에러 · 빈 상태 · 로딩 기준 | 결제 페이지에서 실패·대기 상황을 사용자에게 어떻게 알리는가 | `error-states.md` §1-1 · §2 · §3 · §4 · §6 · `error-copy.md` §2 · §3 |
| 23 | 운영 · CS 대응 포인트 | Admin 수동 처리가 필요한 지점과 CS 문의가 몰릴 지점은 어디인가 | `plan.md` §3 Indie 운영 정책 · `verification.md` §6 · `error-copy.md` §4-2 |
| 24 | 정책 격차 · 미결 항목 | 기존 정책 문서 간 충돌 지점은 어디이고 무엇이 아직 안 정해졌는가 | `checkout.md` 전체 ↔ `member.md` §1-1 · `plan-card.md` 업데이트 필요사항 |
| A1 | Appendix — 신규 용어 | 이번 개편으로 바뀐 정책 용어는 무엇이고 왜 바뀌었는가 | `member.md` §1-1 · `plan.md` §2-1 · §4 · `plan-card.md` 매핑표 |
| A2 | Appendix — 플로우 × 섹션 매핑 | 4종 플로우는 각각 이 문서 어느 섹션을 읽어야 이해되는가 | policy-outline §2 |

26행 (본문 24 + Appendix 2)

## 화면 설계서 필요 목록

| # | 프레임명 | 타입 | 왜 필요한가 | 근거 (정책 섹션) |
|---|---|---|---|---|
| 1 | Checkout — Personal Plan (Individual / Student) | STRUCTURE | SW Account·구매 유형·Seat 행이 없는 개인 플랜 결제 레이아웃을 기준선으로 확정해야 하기 때문 | `plan.md` §2-2 · §4-1 · `checkout.md` §4 · §6 |
| 2 | Checkout — Group Plan (Enterprise / Academic / Indie) | STRUCTURE | SW Account 선택 → 구매 유형 → Seat 수가 추가된 레이아웃이 개인 플랜과 다르기 때문 | `member.md` §3-2 · `plan.md` §4-2 · §4-3 |
| 3 | ~~SW Account 선택 → 구매 유형 노출~~ | — | **삭제 — 구매 유형 행 폐기** (Gate A 결정 G16). 결번 처리, 번호 재정렬 없음 | `prd-draft.md` §7-2 |
| 4 | SW Account 신규 생성 | FEATURE | 보유 SW Account가 없을 때 결제 흐름 안에서 생성·초대가 가능한지 확인해야 하기 때문 | `member.md` §3-2 |
| 5 | 지불 방식 — Monthly 전환 | FEATURE | Annual 기본에서 Monthly로 바꿀 때 Coupon 입력 필드가 사라지는 변화를 확인해야 하기 때문 | `plan.md` §4-1 · §4-6 |
| 6 | Seat 수 — 직접 입력 | FEATURE | Academic 프리셋 탭에서 `직접 입력` 선택 시 입력 필드로 전환되는 동작을 확인해야 하기 때문 | `plan.md` §4-3 |
| 7 | Country US / CA — State·ZIP 입력 → 세금 확정 | FEATURE | ZIP 미입력 상태에서 합계 미확정 + CTA 비활성인 중간 상태를 확인해야 하기 때문 | `checkout.md` §5-3 · §6 |
| 8 | Country EU / GB — VAT ID 입력 → Reverse Charge | FEATURE | 사업자 링크로 VAT ID 필드가 확장되고 세율이 0%로 바뀌는 흐름을 확인해야 하기 때문 | `checkout.md` §5-2 · §6 |
| 9 | Coupon 적용 — 성공 / 실패 | FEATURE | 쿠폰 결과가 Order Summary 행 추가와 인라인 에러 두 방향으로 갈리기 때문 | `plan.md` §4-6 · `error-copy.md` §2 |
| 10 | 결제 실행 실패 — Payment Failed 모달 | FEATURE | 결제 실패가 토스트가 아니라 모달로 처리되는 확정 문구를 화면으로 고정해야 하기 때문 | `error-copy.md` §2 · §3 (500 결제) |
| 11 | 결제 완료 (Order Complete) | FEATURE | 결제 성공 후 다음 행동(라이선스 배정·SW Account 초대)이 정의돼야 하기 때문 | `member.md` §3-2 · `checkout.md` §7 |
| 12 | Seat Add — 기존 라이선스에 Seat 추가 | FEATURE | 대상 라이선스가 고정된 상태에서 증분만 결제하는 화면이 신규 구매와 다르기 때문 | `plan.md` §3 Indie 운영 정책 · §4-2 |
| 13 | Extend — 기간 연장 | FEATURE | Extend는 Seat가 아니라 기간을 늘리는 결제이고 Indie는 이 경로가 차단되기 때문 | `plan.md` §3 Indie 운영 정책 · §4-2 |
| 14 | Enterprise Single → Team 전환 | FEATURE | Reserve 방식이라 즉시 전환이 아니고, Team 시작 예정일과 Seat 수를 함께 보여줘야 하기 때문 (`정책 초안`) | `prd-draft.md` §12 |
| 15 | 진입 차단 케이스 | CASE VIEW | 결제 페이지에 들어오지 못하는 상태별로 사용자가 보는 화면이 다르기 때문 | `checkout.md` §1 · `member.md` §3-2 · §4 · `plan-card.md` 업데이트 필요사항 §3 |
| 16 | 플랜별 지불 방식 · Seat UI 케이스 | CASE VIEW | 플랜 8종이 같은 레이아웃에서 토글·Seat 구성만 다르므로 한 프레임에 묶어야 하기 때문 | `plan.md` §2-1 · §2-2 · §4-1 · §4-3 |
| 17 | Order Summary 케이스 | CASE VIEW | 세금·쿠폰·할인·무료 혜택 조합에 따라 표시 행 수가 달라지기 때문 | `checkout.md` §4 · §5-1 · `plan.md` §4-4 · §4-5 · §4-6 |
| 18 | CTA 상태 케이스 | CASE VIEW | 약관 동의·결제수단 선택·세금 확정·SW Account 선택 조건에 따라 CTA 활성 여부와 문구가 달라지기 때문 (국가별 결제수단 교체는 범위 제외) | `checkout.md` §8 · `prd-draft.md` §19-1 · §19-2 |
| 19 | 에러 · 빈 상태 · 로딩 케이스 | CASE VIEW | 전면 에러·인라인 실패·Skeleton 기준을 결제 페이지 맥락에서 확정해야 하기 때문 | `error-states.md` §2 · §3 · §4 · §6 |

19행 (표 기준) — 유효 프레임 **18개**: STRUCTURE 2 · FEATURE 11 · CASE VIEW 5 (#3 결번)

## 신규 용어 Appendix

| 구 용어 | 신 용어 | 바뀐 이유 |
|---|---|---|
| MemberType | 계정 유형 (Account Type) | 2026-06-23 개편으로 회원 유형별 구분을 폐지하고 계정 유형 3종(Non-Member / Member / SW Account)으로 단순화 (`member.md` §1-1) |
| Individual · Student · Academic · Indie (MemberType) | Member + Verification | 모든 로그인 사용자를 동일한 Member로 취급하고, 플랜 구매 자격은 인증으로만 부여 (`member.md` §1-1 · §4) |
| CompanyID | Group Owner | 조직 단위 구매 주체를 Group을 보유한 Member로 재정의 (`plan-card.md` 업데이트 필요사항 §1) |
| (조직 단위 개념 없음) | Group | 라이선스·SW Account·Group 레벨 인증을 담는 단위를 신설. 플랜 구매 전 독립 생성 가능 (`member.md` §3-1) |
| License ID | SW Account | 라이선스 할당 전용 계정임을 명확히 하기 위해 명칭 변경. Web 로그인 없음 (`member.md` §1-1 · §3-2) |
| Copy | Seat | Academic · Indie 포함 전 플랜에서 좌석 단위 용어를 통일하고 "Copy" 사용을 금지 (`plan.md` §4-3) |
| 결제 주기 | 지불 방식 | 결제 반복 주기가 아니라 사용자가 고르는 지불 방식임을 드러내기 위해 레이블 변경 (`plan.md` §4-1) |
| Enterprise Monthly | Enterprise Single | 월간 여부보다 동시접속 Max 1이라는 성격이 핵심이라 명칭 변경 (`plan.md` §2-1) |
| Enterprise Annual | Enterprise Team | 연간 여부보다 N Seat 팀 단위 사용이 핵심이라 명칭 변경 (`plan.md` §2-1) |
| Student Trial | Student Benefit | 학생 인증 완료 후 3개월 무료 혜택이며 Trial과 성격이 달라 "Trial" 라벨 노출을 금지 (`plan.md` §3 Student) |
| Student Annual | Student Monthly | Annual 옵션을 폐지하고 Monthly 단일 구성으로 변경 ($8.25/월) (`plan.md` §2-2 · §3) |

11행

## 커버 항목

- [x] 계정 유형 전체 케이스 (Non-Member / Member / Group Owner / SW Account) — screen-list #15 진입 차단 케이스
- [x] Verification 상태 (Student · Academic · Indie 인증 없음 / 대기 / 완료 / 재인증) — policy-outline §21, screen-list #15
- [x] Empty 상태 — screen-list #19 (SW Account 없음)
- [x] Error 상태 — screen-list #10 · #19, policy-outline §22
- [x] Loading 상태 — screen-list #19 (Skeleton, 로딩 휠 금지)
- [x] 비즈니스 로직 분기 — prd-draft §7 · §8 · §9 · §17 · §19, screen-list #16 · #17 · #18
- [x] 플로우 ③ Enterprise Single → Team 전환 — prd-draft §12 (`정책 초안`)
- [x] Enterprise Linux — prd-draft §3-2 · §8-1 · §9 · §10
- [x] 플로우 ② Add · Extend — prd-draft §11 (Team Console 진입 → 결제 페이지)
- [x] 운영 · CS · 로깅 포인트 — prd-draft §23

## 오케스트레이터 이월

### 해소된 항목 (반영 완료)

| 출처 | 항목 |
|---|---|
| PACKET 추가 지시 1~5번 (Gate A) | G2 · G3 · G8 · G9 · G14 · G15 · G16 |
| PACKET 추가 지시 2번 (Phase B 후속) | G21 (Seat 단가 확정) · G26 (SW Account 승계 확정) |

이월 종료.

### 미결 — 정책 결정 필요 (본문은 플래그로 진행)

Phase A 이월 5건 + 신규 7건. 총 12건.

**Phase A 이월 유지**

1. **G13 Academic · Indie 구매 자격 주체** — `plan.md` §3은 "인증 완료된 CompanyID만 구매 가능"으로 구 용어 잔존. `member.md` §4는 Group 레벨 인증. → prd-draft §2-2
2. **G17 Student Benefit 결제 표기** — 3개월 무료 구간의 Order Summary 첫 결제 금액 표기 방식 미정의. "Trial" 라벨 금지 제약 하의 대체 표현 필요. → prd-draft §13-1
3. **G18 Individual Annual Auto Renew 노출** — 결제 페이지 노출 여부·기본값 미정의. → prd-draft §14-2
4. **G20 Student Benefit Active 진입 가능 여부** — `plan-card.md` 업데이트 필요사항 §3 P1 미해소. 진입 조건에 직결. → prd-draft §4
5. **G22 Indie 인증 대기 상태 표시 충돌** — `checkout.md` §1(검토 중 안내)과 `plan.md` §3(상태값 미노출)이 충돌. 차단 화면에 무엇을 표시할지 확정 필요. → prd-draft §21-2

**신규 발견**

6. **G23 Group 미보유 Member의 Group 플랜 진입** — Group 생성을 결제 흐름 안에서 처리할지, 선행 차단할지 미정의. → prd-draft §4
7. **G24 Seat 수 > 1일 때 SW Account 지정 시점** — Seat 수만큼 결제 시점에 지정할지, 결제 후 배정할지 미정의. Card 1 구성에 직결. → prd-draft §6-1
8. **G25 Add 시 추가 Seat 만료일** — 기존 라이선스 만료일에 맞추는지, 별도 기간으로 시작하는지 미정의. CS 문의 예상 지점. → prd-draft §11-2
9. **G27 Individual 14일 Trial 결제 경로** — Trial 시작이 결제 페이지를 경유하는지, 결제수단 등록만 받는지 미정의. 플로우 ① 범위 판단에 영향. → prd-draft §14-1
10. **G28 Single → Team 전환 시 라이선스 할당 상태 유지** — SW Account 계정 승계는 확정(G26). 승계 시점에 라이선스 할당 상태까지 유지되는지, Card 1에 SW Account 선택 UI를 노출할지 미정의. → prd-draft §12-2
11. **G29 `checkout.md` §4 Indie 총액 표기 stale** — `Indie Annual | $800.00` 은 총액 표기이며 Seat 단가 기준(G21 확정)과 충돌. 폐기 대상. → prd-draft §15-2 · §24-3
12. **Enterprise Team · Linux Seat 프리셋 구성** — Academic `[1][5][10][직접 입력]` · Indie `[1][5]`만 확정. Team · Linux 프리셋 미정의. Seat 단가 확정으로 프리셋이 금액 선택지와 직결됨. → prd-draft §9

### 정책 파일 갱신 필요

| 파일 | 항목 |
|---|---|
| `plan.md` | **§2-1에 Enterprise Linux 누락** — Annual Prepaid only, $2,300 / Seat 항목 추가 필요 (Gate A 결정 2번). **§2-1 Enterprise Team · Indie 가격에 `/Seat` 표기 추가** — Seat 단가 확정(추가 지시 2번 1항) 반영 필요. §3 Academic · Indie의 CompanyID 표현 갱신. §4-2 구매 유형 규칙 폐기 반영 |
| `checkout.md` | 구 MemberType 기준 전면. §1 Student 2회 제한 · §4 Student Annual $99.00 · **§4 `Indie Annual \| $800.00` 총액 표기(G29)** · §4 CompanyID 항목 · §7 License ID 폐기 대상. **갱신 소유권 미정** — 원본을 갱신할지 새 정책 문서가 대체할지 결정 필요 |
| `plan-card.md` | 업데이트 필요사항 P1 2건(SW Account 카드 처리, Student Benefit Active 버튼) 미해소. 전체 재작성 필요 |

## 실수노트

- **Phase A** — 초기에 플랜 8종을 각각 STRUCTURE 프레임으로 잡으려 했다. 실제 레이아웃 차이는 SW Account·구매 유형·Seat 행의 유무 하나뿐이어서 STRUCTURE 2종 + CASE VIEW로 정리했다. 다음 wave에서도 "플랜 수 = 프레임 수"로 반사적으로 잡지 않는다.
- **Phase A** — `checkout.md`가 구 문서라는 사실을 PACKET이 알려줬음에도, 격차 항목을 세는 과정에서 `plan.md` 자체에도 구 용어(CompanyID)가 잔존하는 것을 뒤늦게 발견했다(G13). 개편 문서(`member.md`)를 기준으로 나머지 전 파일을 역방향 검증하는 절차를 먼저 두는 게 맞다.
- **Phase B** — Phase A에서 격차를 20건으로 확정해 보고했으나, 본문을 실제로 쓰는 단계에서 7건(G21~G27)이 추가로 나왔다. 특히 G21(Seat 단가 여부)은 금액 계산식에 직결되는데 Phase A 목차 단계에서 잡히지 않았다. 원인은 Phase A가 "섹션이 답할 질문"까지만 내려가고 표의 실제 셀을 채워보지 않았다는 점이다. 다음 wave에서는 Phase A 단계에서 금액·수량·날짜가 들어가는 표만이라도 셀을 한 번 채워보고 빈 칸을 격차로 올린다.
- **Phase B** — Phase A REPORT의 화면 목록 표를 REPORT와 `screen-list.md` 양쪽에 중복 기재해, Gate A 결정 반영 시 같은 수정을 두 파일에 각각 넣어야 했다. 다음 wave에서는 REPORT에 표를 복제하지 않고 산출물 파일을 참조하는 형태로 줄인다.
