---
paths:
  - "**/*figma*"
  - "**/*wireframe*"
  - "**/*prd*"
---

# Wireframe Design System

`md_figma_wireframe` 및 `md_figma_prd` 작업 시 전체 적용.
컴포넌트 생성 시 아래 토큰을 반드시 따른다. 자의적 색상·크기 지정 금지.

---

## 1. 시맨틱 컬러

팔레트 값이 아닌 **용도** 기준으로 색을 선택한다.

### Surface (배경)

| 토큰 | HEX | Figma RGB | 사용처 |
|------|-----|-----------|--------|
| `surface.page` | `#FFFFFF` | `{r:1, g:1, b:1}` | 화면·스크린 배경 |
| `surface.card` | `#FFFFFF` | `{r:1, g:1, b:1}` | 카드 배경 (border로 구분) |
| `surface.input` | `#F5F5F5` | `{r:0.96, g:0.96, b:0.96}` | 입력 필드, 드롭다운, 선택지 배경 |
| `surface.subtle` | `#E5E5E5` | `{r:0.90, g:0.90, b:0.90}` | 비활성 영역, bg 구분이 필요한 서브 영역 |

### Border

| 토큰 | HEX | Figma RGB | 사용처 |
|------|-----|-----------|--------|
| `border.default` | `#D1D1D1` | `{r:0.82, g:0.82, b:0.82}` | 카드, 인풋, 일반 컨테이너 |
| `border.strong` | `#999999` | `{r:0.60, g:0.60, b:0.60}` | 선택됨(selected), 포커스 |
| `border.faint` | `#E5E5E5` | `{r:0.90, g:0.90, b:0.90}` | 비활성(disabled), 구분선 |

### Text

| 토큰 | HEX | Figma RGB | 사용처 |
|------|-----|-----------|--------|
| `text.heading` | `#1A1A1A` | `{r:0.10, g:0.10, b:0.10}` | 타이틀, 강조 레이블 |
| `text.body` | `#333333` | `{r:0.20, g:0.20, b:0.20}` | 본문, 값 텍스트 |
| `text.label` | `#666666` | `{r:0.40, g:0.40, b:0.40}` | 폼 레이블, 보조 설명 |
| `text.muted` | `#999999` | `{r:0.60, g:0.60, b:0.60}` | 비활성 텍스트, 힌트 |
| `text.placeholder` | `#CCCCCC` | `{r:0.80, g:0.80, b:0.80}` | 입력 전 placeholder |

### State (유채색 허용 예외 — 3가지만)

| 토큰 | HEX | 사용처 |
|------|-----|--------|
| `state.warning-bg` | `#FFF9E6` | 경고 배너 배경 |
| `state.warning-border` | `#E5C84A` | 경고 배너 테두리 |
| `state.error-text` | `#CC3300` | 에러 메시지 텍스트 |

> 이 세 가지 외에 유채색 사용 금지. 강조는 굵기(weight)와 크기(size)로만.

---

## 2. 컴포넌트 토큰

### Card (섹션 컨테이너)

```
bg:      surface.card
border:  1px solid border.default
radius:  8px
padding: 16px (상하좌우)
sizing:  FILL width, HUG height
layout:  VERTICAL AL, gap 12px
```

```javascript
function createCard(parent, name) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = "VERTICAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.layoutSizingHorizontal = "FILL";
  f.itemSpacing = 12;
  f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = 16;
  f.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  f.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.82, b: 0.82 } }];
  f.strokeWeight = 1;
  f.cornerRadius = 8;
  parent.appendChild(f);
  return f;
}
```

---

### Form Row (폼 한 행)

```
layout:  HORIZONTAL AL, gap 0, FILL width, HUG height
label:   고정 너비 58px, 14px Regular, text.label
value:   FILL width, 14px Regular, text.body
```

```javascript
function createFormRow(parent, labelText, valueText) {
  const row = figma.createFrame();
  row.name = labelText;
  row.layoutMode = "HORIZONTAL";
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.layoutSizingHorizontal = "FILL";
  row.itemSpacing = 0;
  row.paddingTop = row.paddingBottom = row.paddingLeft = row.paddingRight = 0;
  row.fills = [];
  parent.appendChild(row);

  // Label
  const lbl = figma.createText();
  lbl.characters = labelText;
  lbl.fontSize = 14;
  lbl.fontName = { family: "Poppins", style: "Regular" };
  lbl.fills = [{ type: 'SOLID', color: { r: 0.40, g: 0.40, b: 0.40 } }];
  lbl.resize(58, lbl.height);
  lbl.textAutoResize = "HEIGHT";
  row.appendChild(lbl);

  // Value
  const val = figma.createText();
  val.characters = valueText || "";
  val.fontSize = 14;
  val.fontName = { family: "Poppins", style: "Regular" };
  val.fills = [{ type: 'SOLID', color: { r: 0.20, g: 0.20, b: 0.20 } }];
  val.layoutSizingHorizontal = "FILL";
  val.textAutoResize = "HEIGHT";
  row.appendChild(val);

  return row;
}
```

---

### Input / Dropdown

```
bg:      surface.input
border:  1px solid border.default
radius:  6px
height:  32px
sizing:  FILL width, padding 0 10px
```

---

### Billing Toggle Card (지불 방식 선택)

```
default:  bg surface.card, border 1px border.default, radius 8px, padding 12px
selected: bg surface.card, border 2px border.strong, radius 8px, padding 12px
내부:     타이틀 14px Medium text.heading + 가격 13px Regular text.label
```

**순서 및 Default 규칙 (절대 변경 금지):**
- 연간(Annual) 항상 왼쪽, 월간(Monthly) 항상 오른쪽
- Default 선택: 연간(Annual) — strokeWeight:2, border.strong
- Monthly: strokeWeight:1, border.default (비선택 상태)
- BILLING_TOGGLE-B 등 "Monthly 선택" 상태를 명시적으로 표현하는 프레임에서만 예외 허용

---

### Payment Method Card (결제 수단)

```
sizing:   FILL width, HUG height
bg:       surface.input
border:   1px solid border.default, radius 8px
padding:  12px 16px
selected: border 2px border.strong
내부:     PM명 14px Medium text.heading
```

---

### Badge / Plan Tag

```
sizing:  HUG width
bg:      surface.card
border:  1px solid border.default, radius 4px
padding: 4px 8px
text:    12px Regular, text.label
```

> **레이블 텍스트는 반드시 한 줄.** 컨테이너는 `primaryAxisSizingMode = "AUTO"` (HUG width) 우선 사용.
> 고정 너비가 불가피하면, 가장 긴 텍스트 케이스("Individual", "Enterprise", "Academic" 등) 기준으로 너비 설정.
> 줄바꿈이 생기는 텍스트는 레이블 대신 다른 컴포넌트 패턴 검토.

---

### Notice Banner

```
sizing:  FILL width, HUG height
radius:  6px
padding: 12px 14px

type=warning: bg state.warning-bg, border 1px state.warning-border
type=info:    bg surface.input, border 1px border.default
text:         14px Regular, text.body
```

---

### CTA Button (Primary / Full-width)

```
sizing:  FILL width, height 48px
bg:      text.heading (#1A1A1A)
text:    #FFFFFF, 14px Medium, center align
radius:  6px
```

### Action Button (Inline / Compact)

카드 내 특정 행에 붙는 액션 버튼 (Stop Subscription, Cancel Auto Renew, Connect CLO-SET 등).

```
layout:  HORIZONTAL AL
sizing:  HUG width (primaryAxisSizingMode: AUTO)
         HUG height (counterAxisSizingMode: AUTO)
padding: 10px 상하좌우 모두
bg:      text.heading (#1A1A1A)
text:    #FFFFFF, 14px Medium
radius:  6px
```

**절대 FILL width 또는 고정 height 사용 금지.** 텍스트 길이에 따라 너비가 자동으로 맞춰진다.

```javascript
function createActionButton(parent, label) {
  const btn = figma.createFrame();
  btn.name = label;
  btn.layoutMode = "HORIZONTAL";
  btn.primaryAxisAlignItems = "CENTER";
  btn.counterAxisAlignItems = "CENTER";
  btn.primaryAxisSizingMode = "AUTO";    // HUG width
  btn.counterAxisSizingMode = "AUTO";    // HUG height
  btn.paddingTop = btn.paddingBottom = btn.paddingLeft = btn.paddingRight = 10;
  btn.fills = [{ type: 'SOLID', color: { r: 0.10, g: 0.10, b: 0.10 } }];
  btn.cornerRadius = 6;
  parent.appendChild(btn);

  const t = figma.createText();
  t.characters = label;
  t.fontSize = 14;
  t.fontName = { family: "Poppins", style: "Medium" };
  t.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  btn.appendChild(t);
  return btn;
}
```

```javascript
function createCTA(parent, label) {
  const btn = figma.createFrame();
  btn.name = "CTA Button";
  btn.layoutMode = "HORIZONTAL";
  btn.primaryAxisAlignItems = "CENTER";
  btn.counterAxisAlignItems = "CENTER";
  btn.layoutSizingHorizontal = "FILL";
  btn.resize(btn.width, 48);
  btn.primaryAxisSizingMode = "AUTO"; // FILL after resize
  btn.fills = [{ type: 'SOLID', color: { r: 0.10, g: 0.10, b: 0.10 } }];
  btn.cornerRadius = 6;
  parent.appendChild(btn);

  const t = figma.createText();
  t.characters = label;
  t.fontSize = 14;
  t.fontName = { family: "Poppins", style: "Medium" };
  t.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  btn.appendChild(t);
  return btn;
}
```

---

### Terms Checkbox Row

```
layout:   HORIZONTAL AL, gap 8px, FILL width
checkbox: 13×13px rect, border 1px border.default, radius 2px
text:     14px Regular, text.body
```

---

## 3. 스페이싱 스케일

| 용도 | 값 |
|------|-----|
| 스케일 단위 | 4 / 8 / 12 / 16 / 24 / 32 / 48px |
| 카드 내부 padding | 16px |
| 카드 내부 row gap | 12px |
| 카드 간 gap (wrapper) | 16px |
| 섹션 간 gap | 24px |
| Checkout Form 너비 | 566px |
| Full Page 콘텐츠 너비 | 1440px |
| **WF/TITLE 프레임 너비** | **2448px** |
| **WF/TITLE 프레임 높이** | **1216px** |
| **WF 컬럼 간 gap** | **40px** |
| **WF 행 간 gap** | **120px** |

---

## 4. Checkout Form 조합 패턴

**Student-1 (`1814:181`)** 기준. 모든 Checkout 화면이 이 구조를 따른다.

```
Checkout Form (566px FIXED, VERTICAL AL, gap 16px, HUG height)
├── 타이틀 "라이센스 설정"    — 24px SemiBold, text.heading
├── [Plan Badge]              — 조건부 (Personal/Student/CompanyID/Academic/Indie)
├── [Context Banner]          — 조건부 (구매 횟수, Trial 안내, 인증 상태 등)
├── Card 1 — 라이센스 설정    — createCard()
│   ├── Form Row: 제품
│   ├── Form Row: 지불 방식   — Billing Toggle Cards (연간 왼쪽 default, 월간 오른쪽)
│   ├── [Form Row: License ID] — CompanyID/Academic/Indie만
│   ├── [Form Row: 구매 유형] — License ID 선택 완료 후에만 표시 (조건부)
│   └── [Form Row: Seat 수]   — CompanyID/Academic/Indie만
│       Academic: [1][5][10][직접 입력] 프리셋 탭
│       Indie:    [1][5] 프리셋 탭 + "최대 5개까지 선택 가능합니다" 안내
├── Card 2 — 결제 정보        — createCard()
│   ├── Form Row: 국가         — Dropdown FILL
│   └── Form Row: 결제 수단    — Payment Method Cards
├── [Terms Disclosure]        — 조건부 (구독 안내 7개 항목)
├── Terms Agreement           — 체크박스 2개
└── CTA Button                — createCTA(), FILL, 48px
```

> Personal 플랜은 Plan Badge가 없어도 되지만, 다른 플랜(Student, CompanyID 등)은 반드시 Badge 포함.

**Checkout Form 용어 규칙:**
- "결제 주기" 금지 → 반드시 **"지불 방식"** 사용
- "Copy" 금지 (Academic/Indie) → 반드시 **"Seat"** 사용 (Seat 수, 1 Seat, 5 Seats)
- "구매 유형(PURCHASE_TYPE)"은 License ID 선택 완료 전 **절대 표시 금지**

---

## 5. 적용 원칙

1. **컴포넌트 생성 순서**: Card → Form Row → 내부 요소. 역순 생성 후 append 금지.
2. **FILL 우선**: 자식 노드는 특별한 이유 없으면 `layoutSizingHorizontal = "FILL"`.
3. **HUG 기본**: 컨테이너 높이는 항상 `primaryAxisSizingMode = "AUTO"` (HUG).
4. **컬러 이름으로 생각**: 코드 작성 전 "이건 card bg → surface.card" 식으로 토큰 먼저 결정.
5. **상태 표현**: selected → border.strong. disabled → border.faint + text.muted. 배경색 변경 금지.

---

## 6. 언어 규칙

**와이어프레임 내 모든 UI 문구는 영문으로 작성한다.**

| 구분 | 규칙 |
|---|---|
| UI 문구 (버튼 레이블, 상태 텍스트, 안내 문구, 섹션 헤딩 등) | **영문 필수** |
| 가상 데이터 (더미 이름, placeholder 값, 샘플 날짜 등) | 한국어 허용 |

```
✅ 버튼: "Purchase" / "Cancel" / "Find a Plan"
✅ 안내 문구: "You have a coupon. Start your purchase."
✅ 상태 텍스트: "No active plan."
✅ 가상 데이터: "홍길동" / "2025-03-05" / "couponTitle" (더미값)

❌ 버튼: "구매하기" / "취소"
❌ 안내 문구: "쿠폰이 있어요. 구매를 시작해보세요."
❌ Board Header sub label: "라이선스 없는 사용자가 쿠폰 선택 후 구매"
```

**Board Header 텍스트도 동일 규칙 적용** — sub label의 상태 설명은 영문으로.
