---
project: checkout-renewal
updated: 2026-08-07
---

## 관련 Jira 티켓
- 없음 (Figma WF 작업 전용 세션)

## TODO

### Figma WF 작업 — 진행 중 (우선순위 1)
1. **나머지 6개 플랜 WF 작성** — Individual / Student / Enterprise Single / Enterprise Team Linux / Academic / Indie. Enterprise Team 1(`6980:2`)에서 확정한 방식 그대로: `화면설계서` 마스터 템플릿(`6627:7050`, 파일 `PeCid7uJcg0HenViaaiHUp`) 클론 → Screen에 checkout-feature-spec.md §4-3 노출 순서대로 카드 구성 → `/description` 스킬로 Description 작성 → Annotation 카드 클론해 삽입 → Screen 배지 8개(or 해당 플랜 카드 수)와 1:1 매칭
2. **구 CASE VIEW 프레임 파일 접근 확인 필요** — `checkout-renewal.md`에 기존에 기록된 `NYShAqeBVSmpQYdk3HgPwN` 파일의 `Order/Checkout` 페이지가 2026-08-06 세션에서 조회되지 않음(페이지 목록에 없음), target node `6039:51`도 존재하지 않음. 아래 "구 CASE VIEW 관련 미결" 항목(TODO 5~12였던 것)이 참조하는 `Card1_CaseView`(6232:60) 등 프레임이 삭제·이동됐는지, 아니면 다른 파일/페이지로 옮겨졌는지 확인 필요. **이 확인 전까지는 구 항목들의 유효성 불확실**

### 기획 착수 전 결정 필요 — 잔여 (Plan Card 스코프)
3. **Trial 진입 경로** — Plan 카드 `Start Now`가 Trial 진입을 겸하는지, Trial과 바로 구매를 분리 노출할지 미정 (`docs/policy/plan-card.md` 미결 2번)
4. **Student Benefit 이용 중 버튼 상태** — 3개월 무료 중인 유저의 Plan 카드 버튼 정의 없음 (`plan-card.md` 미결 1번)

### 정책 확인 필요 (Canvas에도 플래그로 남은 항목)
5. VAT 번호 입력란 노출을 EU 회원국으로 한정할지 여부 (`docs/policy/checkout.md` §7.2)
6. Tax ID가 유효하지 않은 경우의 처리 (`docs/policy/checkout.md` §7.2)

### 구 CASE VIEW 관련 미결 (파일 접근 확인 후 유효성 재검토 — TODO 2 참조)
7. 3개 CASE VIEW 프레임에 Description Panel annotation 추가 (figma-description.md Format B 기준)
   - Card1_CaseView: 각 케이스별 행 구성 차이 설명
   - Card2_CaseView: 국가 선택 → 결제 수단 분기 설명
   - OrderSummary_CaseView: 케이스별 행 추가/차감 항목 설명
8. FEATURE_CHECKOUT_INDIVIDUAL 섹션 이후 추가 WF 필요 여부 확인 (Coupon 플로우 FEATURE 섹션 등)
9. Enterprise/Academic/Indie Checkout용 별도 CASE VIEW 섹션 필요 여부 확인
10. 기존 프레임 용어 갱신 — Card1 ③④⑤의 `License ID dropdown` → `SW Account`, OrderSummary ① `CompanyID` → `Enterprise`
11. Seat 프리셋 값 갱신 — Card1_CaseView ④⑤ 프리셋이 Canvas 확정값과 다름. Academic `[1][5][10][직접입력]` → `[5][10][20][직접입력]`. Indie `[1][5]` → `[1][3][5][직접입력]`
12. SW Account 판정 UI — 선택한 계정이 신규 할당인지 기간 연장인지 판정 결과·근거를 표시하는 컴포넌트 (기존 3개 CASE VIEW에 없음). **참고: Enterprise Team 1 WF에서 이미 신규 구현함 — 구 CASE VIEW에도 반영할지, 아니면 신규 WF 방식으로 대체할지 판단 필요**
13. Coupon vs Discount 분리 — OrderSummary_CaseView가 현재 Coupon 행만 다룸
14. Seat 추가·기간 연장·Single→Team 전환 플로우 — 기존 WF 스코프에 없음

## 컨텍스트

### 진행 방식 전환 (2026-08-06~07)
이번 세션에서 Checkout 기획 방식이 바뀌었다. 화면을 바로 그리기 전에:
1. **플랜별 기능명세 표** (텍스트 초안 → Figma 반영) — 각 플랜 진입 시 UI/기능을 번호·기능·설명 3칸으로 정리. 설명 문형: 사용자 행동이 있으면 "사용자는 [행동]을 통해 [결과]를 할 수 있다", 조건·상태성 행은 declarative 유지
2. **플랜별 개별 와이어프레임** — 표 하나당 화면 하나. 고정 마스터 템플릿(`화면설계서`, `6627:7050`) 클론 + `/description` 스킬로 Description 작성이 필수 워크플로우로 확정됨

구 CASE VIEW 방식(여러 플랜을 한 프레임에 케이스 분기로 나열)은 계속 쓸지, 신규 플랜별 개별 WF로 완전히 대체할지는 **미결정** — 다음 세션에서 Josh 확인 필요.

### 정책 기준 (2026-08-06 Canvas 최종본 반영 완료)
- **계정 구조**: MemberType 폐지. `Member` / `Organization Owner` / `SW Account`(웹 로그인 불가). 용어 기준 `docs/policy/member.md`
- **단위**: 전 플랜 `Seat`. `Copy` 금지. Academic·Indie Seat 선택은 **프리셋 탭**(스테퍼·슬라이더·계산기 금지)
- **Trial**: Trial 진입 시 Monthly·Annual 중 선택 → 14일 무료 → 선택한 플랜으로 자동 결제. Trial도 Checkout 페이지 경유. Trial 없이 바로 구매하는 경로도 병존
- **플랜명**: Enterprise Single / Team / Team Linux. Team Linux는 $2,300/Seat/yr **웹 구매 가능**
- **Student**: Monthly $8.25 only. 인증 시점부터 4년, 횟수 제한 없음. 3개월 무료는 `Student Benefit`
- **결제수단**: China(IP 또는 청구지 국가) → 신용카드·AliPay / 그 외 → 신용카드·PayPal. Kakao Pay 없음
- **SW Account 판정**: 사용자가 선택하지 않음. 시스템이 라이선스 상태로 New(신규 할당)/Extension(기간 연장) 자동 판정
- **VAT/Tax ID**: Organization 그룹의 Enterprise·Indie 플랜 결제에서만 노출 (Academic 제외)
- 상세 정책: `docs/policy/checkout.md` §1~§14 (2026-08-06 Canvas 기준 전면 갱신 완료)
- 관련 Canvas: [[RENEWAL] Order/Checkout](https://clo3d.slack.com/docs/T04BT3VBR/F0BL0SRE4TZ) · [[RENEWAL] Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N)

### Figma — 현재 활성 위치
파일 `PeCid7uJcg0HenViaaiHUp`, page `Order/Checkout (In progress🔥)`

- **마스터 템플릿**: `화면설계서` (`6627:7050`) — Board Header + Screen + Description(Annotation 카드: 오렌지 25×25 배지 + Title + native bullet). 모든 신규 WF는 이걸 클론해서 시작
- **플랜별 기능명세 표** (번호/기능/설명 3칸, 다크 배경): Individual `6967:21` · Student `6967:31` · Enterprise Single `6967:41` · Enterprise Team `6967:51` · Enterprise Team Linux `6967:61` · Academic `6967:71` · Indie `6967:81`
- **완성된 WF**: `Enterprise Team 1` (`6980:2`) — Screen `6980:10` (8개 카드: Product → SW Account → Seat → Billing Address → Payment Method → Tax ID → Order Summary → 결제 진행), Description List `6980:12` (Numbered Note ①~⑧)

### Figma — 구 위치 (유효성 미확인, TODO 2 참조)
- Figma file: `NYShAqeBVSmpQYdk3HgPwN`, page: `Order/Checkout` — **2026-08-06 세션에서 조회 시 해당 페이지 없음** (실제 페이지: Cover/COMPONENT/---/Reference/---)
- Target section: `CASEVIEW_CHECKOUT_INDIVIDUAL` (id=6039:51) — **조회 시 존재하지 않음**
- 아래는 마지막으로 확인됐던 상태 (2026-06-09 기준, 이후 미검증)
  - `Card1_CaseView` (id=6232:60) — 5케이스, screen h=1599px
  - `Card2_CaseView` (id=6233:61) — 2케이스, screen h=964px
  - `OrderSummary_CaseView` (id=6235:60) — 5케이스, screen h=1166px

### 실측값 (Annual 1 프레임 `6000:44` 기준 — 구 위치, 미검증)
- 제품 row label: 80px / 지불 방식 section label: 12px Regular
- Billing toggle card: 263×69 FIXED, padding 12, gap 4
- OrderSummary card: padding 12px, gap 8px, inner width 542px, label column 379px FIXED
- Payment method card: 263×45, bg surface.input

### Card1_CaseView / Card2_CaseView / OrderSummary_CaseView 케이스 구성 (구 위치, 미검증 — TODO 2 참조)
- Card1: ① Individual/Student ② Trial ③ Enterprise(License ID dropdown→SW Account 갱신 필요) ④ Academic(Seat 프리셋 갱신 필요) ⑤ Indie(Seat 프리셋 갱신 필요)
- Card2: ① 기본(신용카드·PayPal) ② China(신용카드·AliPay)
- OrderSummary: ① Standard ② Trial ③ Student ④ Coupon 미선택 ⑤ Coupon 적용됨 (Discount 별도 행 미반영)

## 완료 로그
### 2026-08-07
- `/checkout` 세션 마감 — TODO·컨텍스트 전체 재정리. 구 CASE VIEW 파일(`NYShAqeBVSmpQYdk3HgPwN`) 접근 안 되는 것 발견해 TODO 2로 등록, 관련 구 항목 전부 "미검증" 표시로 이동

### 2026-08-06 (3) — Enterprise Team WF 1개 시안 작성
- Josh 선택: 7개 플랜 중 Enterprise Team이 신규 확정 요소(SW Account 선택+판정, Seat 프리셋, Tax ID)를 가장 많이 포함해 우선 시안으로 선정
- Screen 내용(8개 카드: Product → SW Account → Seat → Billing Address → Payment Method → Tax ID → Order Summary → 결제 진행, checkout-feature-spec.md §4-3 노출 순서)은 직접 구성
- **1차 시도 실수 → Josh 지적 후 재작업**
  - 고정 마스터 템플릿(`화면설계서`, id=`6627:7050`, 파일 내 재사용 컴포넌트) 존재를 확인하지 않고 WF 외곽(Board Header/Screen/Description)을 직접 새로 만듦 → 템플릿 클론으로 재작업. Board Header 단일 타이틀 텍스트, Description Annotation 카드(오렌지 배지 25×25 + Title Row + native bullet) 전부 템플릿 그대로 사용
  - Description 패널 내용을 자유 작문으로 채움 → `/description` 스킬(Phase 1~4: Q1~Q3 판단 → 골격 → 내용 → QA) 프로세스를 거쳐 재작성 후 반영
  - Screen 쪽 row 프레임이 기본 100px 높이를 유지해 여백 과다 발생 → `counterAxisSizingMode="AUTO"` 일괄 적용으로 수정 (1차 시도에서 발생, 최종본에 반영됨)
- 최종 프레임: `Enterprise Team 1` (`6980:2`), Screen `6980:10`, Description List `6980:12` — Screen 배지 8개 ↔ Description Numbered Note 8개 1:1 매칭, 배지 색상도 템플릿 실측값(`r:0.886, g:0.349, b:0.153`)으로 통일
- TODO: 나머지 6개 플랜(Individual/Student/Enterprise Single·Team Linux/Academic/Indie) WF는 아직 미작성 — Enterprise Team 시안 확인 후 진행. **다음 WF부터는 반드시 `화면설계서`(6627:7050) 클론 + `/description` 스킬로 시작할 것**

### 2026-08-06 (2) — 플랜별 기능명세 표 Figma 작성
- `[MD-SITE]-checkout-feature-spec.md` 표 포맷을 확정: 플랜별 개별 표, 3칸(번호/기능/설명) — Compare Plans(`6959:4144`, 이후 Josh가 삭제) 색상·셀 크기만 참조, 매트릭스 구조는 미차용
- Figma `PeCid7uJcg0HenViaaiHUp` / page `Order/Checkout (In progress🔥)`에 7개 플랜 표 생성 (배경 #0a0a0a, Poppins, border-bottom row 구분)
  - Individual `6967:21` · Student `6967:31` · Enterprise Single `6967:41` · Enterprise Team `6967:51` · Enterprise Team Linux `6967:61` · Academic `6967:71` · Indie `6967:81`
  - 각 표는 checkout.md §4~§12 + Canvas 확정 내용 기준 11~14행
- TODO: 이 표를 `checkout-feature-spec.md`에도 텍스트로 동기화할지 확인 필요 (현재 Figma에만 존재)
- **"설명" 문형 규칙 확정 (Josh, 2026-08-06)** — 사용자 행동이 있는 행은 "사용자는 [행동]을 통해 [결과]를 할 수 있다" 문형, 조건·상태성 행은 기존 declarative 문형(`~된다/~이다`) 유지. 7개 플랜 표 전체(기능·설명 컬럼) 이 기준으로 갱신 완료 — Figma 반영까지 완료
- **1차 작업 시 반올림·기본값 이탈 발견 → 수정 완료** (Josh 지적, figma-read.md §4 반올림 금지 위반)
  - 색상을 반올림해서 사용함 (`#c7c7c7`→0.78, `#ebebeb`→0.92 등) → 실측 소수값(199/255, 235/255 등)으로 교체
  - Row에 참조에 없던 `itemSpacing:16`을 추가함 → 0으로 제거 (간격은 원래 셀 `paddingRight:8`만으로 구성)
  - **Row·Header·셀 wrapper 프레임이 `createAutoLayout()` 기본값인 불투명 흰색 배경을 그대로 가진 채 방치됨** — 어두운 배경 위에 흰 줄무늬로 렌더링되는 문제 발생 → 전체 Row/Header/셀 프레임 372개 `fills=[]`로 일괄 수정
  - 수정 후 7개 프레임 전체 스크린샷으로 재검증 완료

### 2026-08-06 (1)
- Order/Checkout Canvas 최종본(`F0BL0SRE4TZ`, KR+EN 전문) 확인 후 `docs/policy/checkout.md`에 반영
  - 신규 섹션 추가: §4 Trial · §5 Coupon·Discount · §9 SW Account · §10 Seat · §11 Seat 추가/기간연장/Single→Team 전환 · §12 Organization Type
  - 기존 §5→§7 Tax/VAT 재번호, §6→§8 Billing Address 재번호, §7→§13 상태복원, §8→§14 CTA
  - §7.2에 VAT 노출 범위(Organization Enterprise·Indie 한정) 반영 + 정책 확인 필요 플래그 2건 유지(EU 한정 여부, Tax ID 무효 처리)
- 기획 착수 전 결정 4건 중 3건 해소 확인 (결제 수단 지역 분기 / Trial 결제 경로 — Canvas로 확정. Student Benefit 버튼은 Plan Card 스코프라 잔존)
- Figma WF 미반영 항목 3건 신규 등록 (TODO 9·10·11·12) — Seat 프리셋 값 불일치, SW Account 판정 UI 부재, Coupon/Discount 분리 부재, Seat 추가·연장 플로우 부재

### 2026-08-04
- plan-renewal 세션에서 Checkout 관련 결정 3건 이월 (결제 수단 지역 분기 / Trial 진입 경로 / Student Benefit 버튼)
- 정책 파일 6개 용어 전환 완료 — Checkout WF가 참조할 기준을 컨텍스트에 정리
- 기존 CASE VIEW 프레임의 구 용어(License ID, CompanyID) 갱신 필요 항목을 TODO 8번으로 등록

### 2026-06-09
- 3개 CASE VIEW 프레임 생성 완료 (Card1, Card2, OrderSummary)
- Annotation badge 25×25 circle로 수정 (이전: squished 형태)
- 실제 FEATURE 프레임(Annual 1) 측정값 기반으로 컴포넌트 전체 재건
  - DS spec 기본값(58px label, 14px label font) → 실측값(80px, 12px)으로 교체
  - Billing toggle card: 263×69 FIXED 실측 적용
  - OrderSummary: pad:12, gap:8, inner 542px, label col 379px 실측 적용
