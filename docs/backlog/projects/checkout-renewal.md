---
project: checkout-renewal
updated: 2026-08-06
---

## 관련 Jira 티켓
- 없음 (Figma WF 작업 전용 세션)

## TODO

### 기획 착수 전 결정 필요 — 잔여 (Plan Card 스코프, checkout Canvas로 미해소)
1. **Trial 진입 경로** — Plan 카드 `Start Now`가 Trial 진입을 겸하는지, Trial과 바로 구매를 분리 노출할지 미정 (`docs/policy/plan-card.md` 미결 2번). **Card1_CaseView ② Trial 케이스 구성에 직결**
2. **Student Benefit 이용 중 버튼 상태** — 3개월 무료 중인 유저의 Plan 카드 버튼 정의 없음 (`plan-card.md` 미결 1번)

### 정책 확인 필요 (2026-08-06 Canvas에도 플래그로 남은 항목)
3. VAT 번호 입력란 노출을 EU 회원국으로 한정할지 여부 (`docs/policy/checkout.md` §7.2)
4. Tax ID가 유효하지 않은 경우의 처리 (`docs/policy/checkout.md` §7.2)

### Figma WF 작업
5. 3개 CASE VIEW 프레임에 Description Panel annotation 추가 (figma-description.md Format B 기준)
   - Card1_CaseView: 각 케이스별 행 구성 차이 설명
   - Card2_CaseView: 국가 선택 → 결제 수단 분기 설명
   - OrderSummary_CaseView: 케이스별 행 추가/차감 항목 설명
6. FEATURE_CHECKOUT_INDIVIDUAL 섹션 이후 추가 WF 필요 여부 확인 (Coupon 플로우 FEATURE 섹션 등)
7. Enterprise/Academic/Indie Checkout용 별도 CASE VIEW 섹션 필요 여부 확인
8. **기존 프레임 용어 갱신** — Card1 ③④⑤의 `License ID dropdown` → `SW Account`, OrderSummary ① `CompanyID` → `Enterprise`. 정책 파일은 2026-08-04에 전환 완료, Figma는 미반영
9. **Seat 프리셋 값 갱신 (신규)** — Card1_CaseView ④⑤의 프리셋이 Canvas 확정값과 다름. Academic `[1][5][10][직접입력]` → `[5][10][20][직접입력]`. Indie `[1][5]` → `[1][3][5][직접입력]` (Canvas §4-2)
10. **SW Account 판정 UI (신규)** — 선택한 계정이 라이선스 없음(신규 할당)인지 활성 라이선스 보유(기간 연장)인지 판정 결과·근거를 선택 영역에 표시하는 컴포넌트 필요 (Canvas §4-1) — 기존 3개 CASE VIEW에 없음
11. **Coupon vs Discount 분리 (신규)** — OrderSummary_CaseView가 현재 Coupon 행만 다룸. Discount는 별개 항목(프로모션 코드·관리자 지정, 전 플랜 적용 가능)이라 케이스 추가 필요 여부 확인 (Canvas §2-3)
12. **Seat 추가·기간 연장·Single→Team 전환 플로우 (신규)** — Team Console에서 시작해 결제 단계만 Checkout으로 넘어오는 진입 경로. 기존 WF 스코프에 없음, 별도 FEATURE 섹션 필요 여부 확인 (Canvas §4-3)

## 컨텍스트

### 정책 기준 (2026-08-04 갱신 — 이 기준으로 WF 재검토 필요)
- **계정 구조**: MemberType 폐지. `Member` / `Organization Owner` / `SW Account`(웹 로그인 불가). 용어 기준 `docs/policy/member.md`
- **단위**: 전 플랜 `Seat`. `Copy` 금지. Academic·Indie Seat 선택은 **프리셋 탭**(스테퍼·슬라이더·계산기 금지)
- **Trial(D1)**: Trial 진입 시 Monthly·Annual 중 선택 → 14일 무료 → 선택한 플랜으로 자동 결제. Trial 없이 바로 구매하는 경로도 병존
- **플랜명**: Enterprise Single / Team / Team Linux (구 Network Online Monthly / Annual / Linux). Team Linux는 $2,300/Seat/yr **웹 구매 가능**
- **Student**: Monthly $8.25 only. 인증 시점부터 4년, 횟수 제한 없음. 3개월 무료는 `Student Benefit` — "Trial" 라벨 금지
- **소계 계산**: `docs/policy/checkout.md` — Enterprise Single $199 / Team $2,000×Seat / Team Linux $2,300×Seat / Academic $1,500×Seat / Indie $800 / Individual $39·$280 / Student $8.25(Benefit 중 $0.00)
- 관련 Canvas: [[RENEWAL] Order/Checkout](https://clo3d.slack.com/docs/T04BT3VBR/F0BL0SRE4TZ) · [[RENEWAL] Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N)

### Figma
- Figma file: `NYShAqeBVSmpQYdk3HgPwN`, page: `Order/Checkout`
- Target section: `CASEVIEW_CHECKOUT_INDIVIDUAL` (id=6039:51)
- 3개 CASE VIEW 프레임 생성 완료 (id 목록 아래)

### 완성된 프레임 ID
- `Card1_CaseView` (id=6232:60) — 5케이스, screen h=1599px
- `Card2_CaseView` (id=6233:61) — 2케이스, screen h=964px
- `OrderSummary_CaseView` (id=6235:60) — 5케이스, screen h=1166px

### 실측값 (Annual 1 프레임 `6000:44` 기준)
- 제품 row label: **80px** (DS spec 58px 아님)
- 지불 방식 section label: **12px** Regular (DS spec 14px 아님)
- Billing toggle card: **263×69 FIXED**, padding 12, gap 4
- 연간 selected: border.strong 2px / 월간 unselected: border.default 1px
- OrderSummary card: padding **12px** (DS spec 16px 아님), gap **8px**, inner width **542px**
- OrderSummary label column: **379px FIXED**, 13px Regular, text.label
- Address inputs: **bg white** (surface.card, not surface.input)
- Payment method card: 263×45, bg surface.input

### Card1_CaseView 케이스 구성 (⚠ TODO 8·9 반영 전 상태 — Figma 미반영)
- ① Individual/Student: 제품 + 지불 방식 (연간+월간)
- ② Trial: Warning banner(노란색) + 제품("Marvelous Designer Trial") + 지불 방식
- ③ Enterprise: 제품 + License ID dropdown(→SW Account) + 지불 방식 (연간+월간)
- ④ Academic: 제품 + License ID dropdown(→SW Account) + Seat tabs[1][5][10][직접입력](→`[5][10][20][직접입력]`) + 연간only 카드
- ⑤ Indie: 제품 + License ID dropdown(→SW Account) + Seat tabs[1][5](→`[1][3][5][직접입력]`) + "최대 5개까지" hint + 연간only 카드

### Card2_CaseView 케이스 구성
- ① 기본(전체): 신용카드/체크카드 + PayPal
- ② China 선택 시: 신용카드/체크카드 + AliPay

### OrderSummary_CaseView 케이스 구성 (⚠ TODO 8·11 반영 전 상태 — Figma 미반영)
- ① Standard (Individual/CompanyID→Enterprise): 플랜금액 + 세금 + divider + 결제예정금액
- ② Trial: 플랜금액 + 첫결제일 + 이후결제금액 + divider + 결제예정금액 ($0)
- ③ Student: 플랜금액 + 세금 + divider + 결제예정금액 + 3개월 후 안내 notice
- ④ Coupon 미선택: 쿠폰입력 + 플랜금액 + 세금 + divider + 결제예정금액
- ⑤ Coupon 적용됨: 쿠폰입력(선택됨) + 플랜금액 + 쿠폰할인(-) + 세금 + divider + 결제예정금액
- (신규 검토) Discount 별도 행 케이스 — Coupon과 동시 적용 가능 여부 확인 필요 (TODO 11)

## 완료 로그
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
- `[MD-SITE]-checkout-feature-spec.md` 표 포맷을 확정: 플랜별 개별 표, 3칸(번호/기능/설명) — Compare Plans(`6959:4144`) 색상·셀 크기만 참조, 매트릭스 구조는 미차용
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
