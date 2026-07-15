---
project: checkout-renewal
updated: 2026-06-09
---

## 관련 Jira 티켓
- 없음 (Figma WF 작업 전용 세션)

## TODO
1. 3개 CASE VIEW 프레임에 Description Panel annotation 추가 (figma-description.md Format B 기준)
   - Card1_CaseView: 각 케이스별 행 구성 차이 설명
   - Card2_CaseView: 국가 선택 → 결제 수단 분기 설명
   - OrderSummary_CaseView: 케이스별 행 추가/차감 항목 설명
2. FEATURE_CHECKOUT_INDIVIDUAL 섹션 이후 추가 WF 필요 여부 확인 (Coupon 플로우 FEATURE 섹션 등)
3. Enterprise/Academic/Indie Checkout용 별도 CASE VIEW 섹션 필요 여부 확인

## 컨텍스트
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

### Card1_CaseView 케이스 구성
- ① Individual/Student: 제품 + 지불 방식 (연간+월간)
- ② Trial: Warning banner(노란색) + 제품("Marvelous Designer Trial") + 지불 방식
- ③ Enterprise: 제품 + License ID dropdown + 지불 방식 (연간+월간)
- ④ Academic: 제품 + License ID dropdown + Seat tabs[1][5][10][직접입력] + 연간only 카드
- ⑤ Indie: 제품 + License ID dropdown + Seat tabs[1][5] + "최대 5개까지" hint + 연간only 카드

### Card2_CaseView 케이스 구성
- ① 기본(전체): 신용카드/체크카드 + PayPal
- ② China 선택 시: 신용카드/체크카드 + AliPay

### OrderSummary_CaseView 케이스 구성
- ① Standard (Individual/CompanyID): 플랜금액 + 세금 + divider + 결제예정금액
- ② Trial: 플랜금액 + 첫결제일 + 이후결제금액 + divider + 결제예정금액 ($0)
- ③ Student: 플랜금액 + 세금 + divider + 결제예정금액 + 3개월 후 안내 notice
- ④ Coupon 미선택: 쿠폰입력 + 플랜금액 + 세금 + divider + 결제예정금액
- ⑤ Coupon 적용됨: 쿠폰입력(선택됨) + 플랜금액 + 쿠폰할인(-) + 세금 + divider + 결제예정금액

## 완료 로그
### 2026-06-09
- 3개 CASE VIEW 프레임 생성 완료 (Card1, Card2, OrderSummary)
- Annotation badge 25×25 circle로 수정 (이전: squished 형태)
- 실제 FEATURE 프레임(Annual 1) 측정값 기반으로 컴포넌트 전체 재건
  - DS spec 기본값(58px label, 14px label font) → 실측값(80px, 12px)으로 교체
  - Billing toggle card: 263×69 FIXED 실측 적용
  - OrderSummary: pad:12, gap:8, inner 542px, label col 379px 실측 적용
