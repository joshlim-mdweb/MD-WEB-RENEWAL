[착수 패킷 · pm · 1차 웨이브] MDWEB-870 결제 페이지 & 흐름

## 스코프
- 피처: 결제 페이지 & 흐름 (Order / Checkout)
- 대상 화면/플로우: 아래 4종
- Jira: MDWEB-870 (Epic MDWEB-827 "2026 | 결제 페이지" 하위)

### 대상 플로우 4종 (MDWEB-870 기준)

**① 각 플랜 신규 구매**
- Individual Monthly / Individual Annual
- Student Monthly
- Enterprise Single / Enterprise Team
- Academic Annual
- Indie Annual
- Enterprise Linux

**② Enterprise Team · Academic Seat Add / Extend**
- 기존 Group이 보유한 라이선스에 Seat 추가(Add) 또는 기간 연장(Extend)
- Indie는 Add만 가능, Extend 불가 (plan.md §3 Indie 운영 정책)

**③ Enterprise Single → Team 전환**
- Enterprise Single(월간, Max 1) 사용자가 Enterprise Team(연간, N Seat)으로 전환

**④ SW Account 생성 / 선택 → 결제 (전 시나리오 공통 선행 단계)**
- 기존 SW Account 선택 또는 신규 생성 후 결제 진행
- 구매 유형(Extend / Reserve)은 SW Account 선택 완료 후에만 노출 (plan.md §4-2)

## 입력 참조

로컬 정책 파일을 직접 읽어 작성한다. 추측 금지.

| 파일 | 읽을 내용 |
|---|---|
| `docs/policy/checkout.md` | 진입 조건 · Country 감지 · 결제수단 매핑 · Order Summary · Tax/VAT · 주소 필드 분기 · 상태 복원 · CTA 동작 |
| `docs/policy/plan.md` | 플랜별 가격·기간·Concurrent User, §3 플랜별 정책, §4 Checkout UI 정책 (지불 방식 · 구매 유형 · Seat · Tax · Discount · Coupon · 결제수단 지역 분기) |
| `docs/policy/member.md` | 계정 유형 3종(Non-Member / Member / SW Account) · Group 정책 · SW Account 생성·초대 · Verification 레이어 · SWAccess 케이스 매트릭스 |
| `docs/policy/plan-card.md` | Checkout 진입점 버튼 로직 + `## 업데이트 필요사항` (계정 구조 미반영 항목 파악용) |
| `docs/policy/error-states.md` | 전면/인라인/토스트 에러 + Loading = Skeleton 기준 |
| `docs/policy/error-copy.md` | 확정된 에러 문구 원문 |
| `docs/policy/verification.md` | Student / Academic / Indie 인증 절차 |

- 기존 PRD: 없음
- 참고 Figma: https://www.figma.com/design/PeCid7uJcg0HenViaaiHUp/2026-RENEWAL?node-id=237-3132 (page `Order/Checkout (In progress🔥)` — 현재 비어 있음, 새로 그릴 예정)

### ⚠️ 정책 격차 — 반드시 목차(안)에 명시

`docs/policy/checkout.md` 는 MDWEB-634 시점 문서로 **구 MemberType 기준**(CompanyID · Academic · Indie · License ID)이다.
`docs/policy/member.md` 2026-06-23 계정 구조 전면 개편(MemberType 폐지 → Member / SW Account / Group)이 **미반영** 상태다.

- 이 격차가 어디에서 충돌하는지 식별해 목차(안)에 별도 섹션으로 잡는다
- 임의로 어느 한쪽을 정답으로 단정하지 않는다 — 충돌 지점은 *(정책 확인 필요)* 플래그 처리
- `plan-card.md` `## 업데이트 필요사항` 의 P1 항목(SW Account 카드 처리, Student Benefit Active 버튼)도 Checkout 진입 조건에 영향을 주는지 확인

## 작업 지시

**Phase A만 수행한다.** 정책 문서 본문(`prd-draft.md`)은 작성하지 않는다.

### A-1. 정책 문서 목차(안) — `requirements/waves/active/policy-outline.md`

이해관계자(BD · CS · 글로벌팀)가 읽고 "새 결제에서 무엇이 어떻게 동작하는지" 이해할 수 있는 문서의 **목차와 각 섹션이 답할 질문**을 설계한다.

- 섹션별로 `이 섹션이 답하는 질문` 을 한 문장으로 명시
- 각 섹션의 근거 정책 파일·섹션 번호를 인용
- 본문은 쓰지 않는다 — 목차와 질문만
- 플로우 4종이 각각 어느 섹션에서 다뤄지는지 매핑
- Appendix — 신규 용어 섹션을 목차에 포함

### A-2. 화면 설계서 필요 목록 — `requirements/waves/active/screen-list.md`

Figma에 그려야 할 프레임을 **목록으로만** 정리한다. 그리지 않는다.

- 프레임 단위로 나열 (섹션 단위 아님)
- 각 프레임의 타입 지정: STRUCTURE / FEATURE / CASE VIEW
- `왜 필요한가` 를 한 문장으로 — "정책 X를 화면으로 확인해야 하기 때문" 수준의 근거
- 근거 정책 섹션 인용 필수
- 플로우 4종 × 계정 유형 × Verification 상태 조합에서 **화면이 실제로 달라지는 지점만** 프레임으로 잡는다
  - 달라지지 않는 조합은 CASE VIEW 한 프레임에 케이스로 묶는다
  - 프레임 수를 부풀리지 않는다 — 근거 없는 프레임은 넣지 않는다

### A-3. 신규 용어 정리

이번 개편으로 **바뀐 정책 용어만** `구 용어 | 신 용어 | 바뀐 이유` 3컬럼으로 정리한다.

아래는 오케스트레이터가 사전 확인한 후보다. **각 항목의 근거를 정책 파일에서 직접 재확인**하고, 누락된 용어를 추가하고, 근거가 없는 항목은 제거한다.

| 구 용어 | 신 용어 | 근거 (확인 필요) |
|---|---|---|
| Copy | Seat | plan.md §4-3 |
| 결제 주기 | 지불 방식 | plan.md §4-1 |
| MemberType | 계정 유형 (Account Type) | member.md §1-1 |
| License ID | SW Account | member.md §1-1 |
| CompanyID | Group Owner | plan-card.md 매핑표 |
| Individual · Student · Academic · Indie (MemberType) | Member / Group Owner + Verification | member.md §4 |
| Enterprise Monthly | Enterprise Single | plan.md §2-1 |
| Enterprise Annual | Enterprise Team | plan.md §2-1 |
| Student Trial | Student Benefit | plan.md §3 ("Trial" 라벨 노출 금지) |

## 정책 문서 필수 구성
- 본문: 기능·플로우 중심. 이해관계자(BD·CS·글로벌팀)가 읽고 이해 가능한 수준
- **Appendix — 신규 용어**: 이번 개편으로 바뀐 정책 용어만. `구 용어 | 신 용어 | 바뀐 이유` 3컬럼 표
  - 용어 설명만 다룬다. 기능 설명·플로우 재기술 금지
  - 안 바뀐 용어는 넣지 않는다

## 작성 규칙
- .claude/rules/prd-writing.md (문체·구조)
- .claude/rules/ux-writing.md (UX Writing)
- .claude/rules/atlassian.md (Jira·Confluence 연계)

## 완료 조건
- End — Phase A (플랜, 필수 선행):
  1. requirements/waves/active/policy-outline.md — 정책 문서 목차(안) + 각 섹션이 답할 질문
  2. requirements/waves/active/screen-list.md — 화면 설계서 필요 목록 (프레임 단위, 타입·근거 포함)
  → 여기까지 작성 후 **중단**. 오케스트레이터 보고 → Josh OK 없이 Phase B 진행 금지
- End — Phase B (집행, Josh OK 후에만):
  3. requirements/waves/active/prd-draft.md — 정책 문서 본문
- Verification: 계정 유형 전체 케이스 (Non-Member / Member / Group Owner / SW Account) × Verification 상태 + Empty/Error/Loading 상태 커버
- Constraints:
  - 개발 구현·CSS·빌드 스펙 포함 금지 / 정책·UX·화면 구성만
  - **`prd-draft.md` 작성 금지** — Phase A에서 멈춘다
  - Figma 읽기·쓰기 금지 — 화면 목록은 정책 기준으로만 도출
  - Slack 쓰기 금지 — 게시는 오케스트레이터가 수행

## 이전 실수 주의
없음 (최초 wave)

---

## 추가 지시 — Gate A 승인 + P1 정책 결정 (2026-07-29 Josh)

Phase A 플랜(목차 24+2섹션 · 프레임 19개 · 용어 11건) **승인**. 아래 결정을 반영해 Phase B(`prd-draft.md`)를 작성한다.

### 1. [CRITICAL] G15 — Enterprise Single → Team 전환 (정책 초안 수준으로 확정)

- 현재 Monthly 결제로 확보된 **사용 기간이 끝난 뒤** Team으로 전환된다 — **Reserve 방식**
- 잔여 기간 일할 정산·환불 없음. 현 기간은 그대로 소진
- 구매 시점에 **Seat 수를 선택**할 수 있다
- 문서에 `정책 초안` 임을 명시한다 — 확정 정책이 아님

### 2. [CRITICAL] G14 — Enterprise Linux (확정)

- Linux 사용자를 위한 플랜. **사용자 구조는 Enterprise Team과 동일**
- 차이점은 **Linux OS에서만 사용 가능**하다는 것 하나뿐
- 지불 방식: **Annual Prepaid만** (Monthly 없음)
- 가격: **$2,300**
- `plan.md` §2-1에 항목이 없는 것은 정책 파일 누락 — 새 정책 문서 기준으로 작성하고, `plan.md` 갱신 필요를 이월 항목에 남긴다

### 3. [CRITICAL] G16 — Reserve / Add / Extend 관계 (확정)

- **Reserve: 당장 구현하지 않는다** — 구매 유형 선택 UI 없음
- **Add / Extend는 Team Console에서 시작**한다
  - Add = Seat 추가
  - Extend = 기간 연장
- **단, 결제 자체는 이 결제 페이지로 넘어와서 진행한다** — 플로우 ②는 이 문서 범위에 포함
  - 진입 시 Add인지 Extend인지는 **진입 컨텍스트로 이미 결정**돼 있다. 사용자가 결제 페이지에서 고르지 않는다

**→ 결제 페이지에서 "구매 유형(Purchase Type)" 행 자체를 삭제한다.**
- Card 1 구성: **SW Account 선택 / 신규 생성 + Seat 수**만 (구매 유형 행 없음)
- `plan.md` §4-2 (License ID 선택 완료 후 구매 유형 Extend/Reserve 표시) → **폐기 대상**으로 명시
- 목차 §7 "구매 유형 (Extend / Reserve / Add)" → 제목·내용 재구성: 사용자 선택 항목이 아니라 **진입 경로별 결제 모드** 설명으로 전환
- `screen-list.md` **#3 "SW Account 선택 → 구매 유형 노출" 프레임 삭제** (19 → 18개). 이후 번호는 재정렬하지 않고 #3을 결번 처리하고 표에 `삭제 — 구매 유형 행 폐기` 로 남긴다
- `screen-list.md` #12 Seat Add · #13 Extend 프레임은 **유지** (Team Console 진입 → 결제 페이지)

### 4. [CRITICAL] G8 — 결제수단 국가 분기: 이번 범위 제외

- Kakao Pay / AliPay 국가별 분기는 **이번 wave에서 다루지 않는다**
- 목차 §18은 국가 선택 → 주소 필드 분기 · 세금 확정까지만 다룬다
- 결제수단은 기본 구성(신용카드/체크카드 + PayPal)만 기술하고, 국가별 교체 로직은 `이번 범위 제외` 로 명시
- `screen-list.md` #18 "결제수단 · CTA 상태 케이스" → 케이스에서 국가별 결제수단 교체 제거, **CTA 상태 케이스로 축소**
- G9 (AliPay CTA 문구) 도 함께 범위 제외

### 5. [CRITICAL] G2 · G3 — Student 플랜 (확정)

- **`plan.md` §2-2 · §3 이 맞다** — Student Monthly only, $8.25/월, 4년(48개월) 이내
- `checkout.md` §1 "누적 구매 2회 초과 차단" · §4 "Student Annual $99.00" → **stale. 구 Annual 전제 문서**
- 새 정책 문서는 Monthly only 기준으로 작성하고, `checkout.md` 해당 항목이 폐기 대상임을 §24 정책 격차에 명시

### 6. P2 항목 처리

P2 7건(G17 · G18 · G20 · G13 · Indie 인증 대기 표시 · `checkout.md` 갱신 소유권 · `plan-card.md` 재작성)은 **미결 상태로 본문을 진행**한다.
- 해당 지점에 *(정책 확인 필요)* 플래그를 달고 §24 정책 격차에 항목으로 남긴다
- 임의로 결정해서 단정하지 않는다

### 7. Phase B 산출물 제약

- `requirements/waves/active/prd-draft.md` 작성
- 승인된 목차(안)를 따른다. **§7과 §18은 위 3·4번 결정대로 내용을 재구성**하되 섹션 자체는 유지
- 목차에 없는 섹션 임의 추가 금지
- `screen-list.md` 도 위 3·4번 결정을 반영해 갱신한다 (#3 결번 처리, #18 축소)
- Appendix — 신규 용어 11건 필수 포함
- Slack · Figma 쓰기 금지

---

## 추가 지시 2 — Phase B 후속 정책 결정 (2026-07-29 Josh)

Phase B에서 새로 식별한 격차 2건이 확정됐다. **해당 섹션만 targeted 수정**한다. 전체 재작성 금지.

### 1. [CRITICAL] G21 — Group 플랜 가격은 Seat 단가 (확정)

Enterprise Team · Enterprise Linux · Indie Annual의 표기 금액은 **총액이 아니라 Seat 단가**다.

| 플랜 | 가격 표기 | 소계 계산 |
|---|---|---|
| Enterprise Team | $2,000 / Seat | $2,000 × Seat 수 |
| Enterprise Linux | $2,300 / Seat | $2,300 × Seat 수 |
| Academic Annual | $1,500 / Seat | $1,500 × Seat 수 (기존과 동일) |
| Indie Annual | $800 / Seat | $800 × Seat 수 (최대 5 Seat) |
| Enterprise Single | $199 / 월 | Max 1 — Seat 선택 없음, 단가 개념 미적용 |

수정 대상:
- **§3-2 Group 플랜 표** — 가격 컬럼을 `$2,000 / Seat` 형식으로 교체. G21 *(정책 확인 필요)* 플래그 제거
- **§9 Seat 수 선택** — Seat 수 변경이 결제 금액에 직접 반영된다는 점 명시
- **§15 Order Summary 구성** — 플랜별 소계 계산 표를 위 기준으로 교체. `단가 / Seat` 행과 `Seat 수` 행이 Group 플랜에서 표시된다는 점 반영
- **§24 정책 격차** — G21을 `해소 (2026-07-29 확정)` 로 상태 변경
- **§24에 신규 격차 추가** — `checkout.md` §4 플랜별 소계의 `Indie Annual | $800.00` 은 총액 표기이므로 **stale**. Seat 단가 기준과 충돌함을 명시

### 2. [CRITICAL] G26 — Single → Team 전환 시 SW Account 승계 (확정)

전환 시 **기존 SW Account는 그대로 승계**된다. 재생성·재초대 불필요.

수정 대상:
- **§12-2 결제 페이지 처리** — "기존 SW Account 승계 여부는 정의돼 있지 않다 *(정책 확인 필요 — §24 G26)*" 문장을 삭제하고, 승계된다는 내용으로 교체
- 승계 대상이 SW Account 계정 자체임을 명시 (라이선스 할당 상태까지 유지되는지는 별건이므로 단정하지 않는다 — 필요하면 그 부분만 플래그)
- **§24 정책 격차** — G26을 `해소 (2026-07-29 확정)` 로 상태 변경

### 3. 파급 확인

- `screen-list.md` #16(플랜별 지불 방식·Seat UI 케이스) · #17(Order Summary 케이스)의 `왜 필요한가` 근거가 Seat 단가 기준으로 여전히 맞는지 확인하고, 어긋나면 근거 문장만 수정한다. **프레임 추가·삭제 금지**
- `REPORT-pm.md` `## 추가 지시 이행표` 에 이번 2건을 8·9번 행으로 append
- `REPORT-pm.md` 이월 항목에서 G21 · G26 제거, `checkout.md` §4 Indie 총액 표기 stale 항목 추가
