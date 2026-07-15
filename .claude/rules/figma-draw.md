# Figma 화면 그리기 프로토콜

Figma에서 노드를 만들고 배치하는 모든 행위에 적용. 와이어프레임 생성, Clone, 수정, 삽입 전 반드시 이 프로토콜을 따른다.

---

## 파이프라인 연계

```
이전 단계: figma-read.md (측정값·참조 스펙)
           figma-description.md (Numbered Note → Annotation 기준)
이 단계 output: 완성된 WF 프레임 + Description 삽입 + Screenshot 검증
다음 단계: 없음 (워크플로우 종료)
```

---

## 최우선 원칙

**참조 없이 그리지 않는다. 추측으로 쓴 수치는 전부 틀린다.**
`figma-read.md`에서 측정한 값만 사용한다. 색상, 패딩, 폰트, 정렬 — 전부 실측값.

---

## 1. 노드 생성 의사결정 (Q1~Q4)

노드를 만들기 전에 반드시 이 플로우를 거친다.

```
Q1. 같은 역할의 노드가 이 파일 어딘가에 이미 있는가?
    YES → clone (Case 1)
    NO  → Q2로

Q2. 디자인 시스템 라이브러리 컴포넌트인가?
    YES → importComponentByKeyAsync (Case 2)
    NO  → Q3으로

Q3. 기존 노드의 스타일(폰트·색상·간격)을 그대로 따라야 하는가?
    YES → getStyledTextSegments로 읽어서 복사 (Case 3)
    NO  → Q4로

Q4. 완전히 새로 만들어야 하는 최초 노드인가?
    YES → 아래 규칙 적용
```

### 주요 케이스

| Case | 상황 | 규칙 |
|---|---|---|
| Clone | 같은 파일 내 반복 UI | `node.clone()` → 텍스트만 수정 |
| 라이브러리 | 다른 파일의 컴포넌트 | `figma.importComponentByKeyAsync(KEY)` |
| 페이지 전환 Clone | 다른 페이지 노드 | `setCurrentPageAsync` 먼저 → `getNodeById` |
| 스타일 복사 | 기존 스타일 유지 필요 | `getStyledTextSegments(['fontName', 'fills', 'fontSize'])` |
| FRAME ≠ 컴포넌트 없음 | FRAME 타입이어도 재사용 가능 | Q1부터 시작 — 타입만 보고 판단 금지 |

---

## 2. Auto Layout 규칙

### 2.1 필수 원칙

| 규칙 | 설명 |
|---|---|
| Auto Layout 필수 | 모든 콘텐츠 프레임은 `layoutMode = "VERTICAL"` 또는 `"HORIZONTAL"`. `NONE` 금지 (Screen 예외) |
| 패딩 16px 기본값 | 모든 AL 프레임의 padding 상하좌우 16px. 예외 시 이유 명시 |
| Poppins 전용 | Regular / Medium / SemiBold만 사용. Bold / Inter / Pretendard 금지 (기존 페이지의 Inter 노드 있으면 Inter도 프리로드) |
| FILL은 appendChild 후 | `layoutSizingHorizontal = "FILL"`은 반드시 `appendChild()` 이후에 설정 |
| resize() 후 재설정 | `resize()` 호출 시 `primaryAxisSizingMode`가 `FIXED`로 초기화됨 → 반드시 재설정 |

### 2.2 크기 자동화

| 속성 | 설정값 | 이유 |
|---|---|---|
| `primaryAxisSizingMode` | `"AUTO"` | 콘텐츠 높이 자동 확장 |
| `counterAxisSizingMode` | `"FIXED"` (루트) 또는 `"AUTO"` (내부) | 너비는 고정, 높이만 자동 |
| `layoutSizingHorizontal` | `"FILL"` | 부모 너비 100% 채움 |

### 2.3 ap() 패턴 — FILL 설정 필수 패턴

```javascript
function ap(parent, child, fill) {
  parent.appendChild(child);
  if (fill) child.layoutSizingHorizontal = "FILL";
  return child;
}

// ✅ 올바른 패턴
ap(page, secF, true);

// ❌ 금지 — appendChild 전에 FILL 설정
secF.layoutSizingHorizontal = "FILL";
page.appendChild(secF);
```

---

## 3. WF 프레임 생성

모든 WF 프레임은 `createWireframeFrame()` 패턴으로 생성한다. `createInstance()` / 수동 그리기 금지.

### 3.1 WF 프레임 구조

```
Outer Frame (VERTICAL, 2448×1216, PAD=24, GAP=24, radius=12)
├── Header (HORIZONTAL, FILL×64, gap=12)
│   ├── Board Header (FIXED 1920×64, paddingLeft=14, gap=8)
│   │   texts[0]: mainLabel  — Poppins Medium 18px (ALL CAPS)
│   │   texts[1]: "  |  "    — Poppins Regular 18px
│   │   texts[2]: subLabel   — Poppins Regular 18px (경로형)
│   └── Description Header (FILL×64, CENTER 정렬)
│       text: "DESCRIPTION"  — Poppins Medium 18px CENTER
└── Contents (HORIZONTAL, FILL×1080 FIXED, gap=12)
    ├── Screen (FIXED 1920, FILL height, layoutMode=NONE)
    └── Description (FILL×FILL, padding=12)
        └── Description List (FILL, HUG height, padding=10, gap=10)
            └── Annotation Box × N
```

### 3.2 Board Header 텍스트 형식

```
texts[0] = Main Label  →  ALL CAPS: "[SCOPE]: [SCREEN] — [STATE]"
texts[1] = "  |  "     →  건드리지 않음
texts[2] = Sub Label   →  경로형: "[Tab Name] | [Full Screen Name]"
```

예시:
```
Main:  "PERSONAL: OVERVIEW — 기본"
Sub:   "Overview | Personal: Overview — 기본"
```

### 3.3 Board Header 실측 스펙

```javascript
header.resize(1920, 64);
header.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
header.strokes = [{ type: 'SOLID', color: { r: 0.9019607901573181, g: 0.9019607901573181, b: 0.9019607901573181 } }];
header.strokeWeight = 2;
header.cornerRadius = 8;
header.layoutMode = "HORIZONTAL";
header.primaryAxisSizingMode = "FIXED";
header.counterAxisSizingMode = "FIXED";
header.primaryAxisAlignItems = "MIN";
header.counterAxisAlignItems = "CENTER";
header.paddingLeft = header.paddingRight = 14;
header.itemSpacing = 8;

// t1: Main Label — Poppins Medium 18px, r:0.27
// t2: "  |  "   — Poppins Regular 18px, r:0.27
// t3: Sub Label  — Poppins Regular 18px, r:0.52
```

### 3.4 TITLE 프레임

각 탭 행의 첫 번째 컬럼에 배치하는 레이블 프레임. WF와 동일 크기.

```
크기:    W=2448, H=1216
배경:    fills=[{type:'SOLID', color:{r:0.0606, g:0.0606, b:0.0606}}]  ← 거의 검정
폰트:    Poppins Medium 60px
색상:    {r:1, g:0.5411764979362488, b:0}  ← 오렌지
정렬:    CENTER/CENTER
텍스트:  ALL CAPS — "[Member Type] [Tab Name]"
```

---

## 4. 캔버스 배치

```
프레임 크기:       W=2448, H=1216 (TITLE + WF 모두 동일)
컬럼 간 gap:       40px
행 간 gap:         120px

x 좌표 (SECTION 기준):
  TITLE   x = 100
  col 1   x = 2588  (100 + 2448 + 40)
  col 2   x = 5076  (2588 + 2448 + 40)
  col 3   x = 7564  (5076 + 2448 + 40)

y 좌표 (SECTION 기준):
  Row 1   y = 100
  Row 2   y = 1436  (100 + 1216 + 120)
  Row 3   y = 2772  (1436 + 1216 + 120)
  Row N   y = 100 + (N-1) × (1216 + 120)
```

---

## 5. 텍스트 처리

### 5.1 텍스트 너비 순서 (반드시 지킴)

```javascript
const body = figma.createText();
body.resize(408, 10);              // 1. 너비 먼저 설정
body.textAutoResize = 'HEIGHT';    // 2. 높이 자동 확장
body.characters = longText;        // 3. 텍스트 마지막에 할당
```

역순 (characters 먼저 → resize 나중) 금지 — 높이 11034px 같은 폭발 발생.

### 5.2 boundVariables 확인

```javascript
// 변수 바인딩된 fills는 덮어쓰지 않는다
if (!node.boundVariables?.fills) {
  node.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
}
```

### 5.3 applyBullets() — Description 삽입 시 필수

```javascript
function applyBullets(node) {
  const parsed = node.characters.split('\n').map(line => {
    if (line.startsWith('  - ')) return { text: line.slice(4), level: 2 };
    if (line.startsWith('- '))   return { text: line.slice(2), level: 1 };
    return { text: line, level: 0 };
  });
  node.characters = parsed.map(l => l.text).join('\n');
  let pos = 0;
  for (const line of parsed) {
    const end = pos + line.text.length;
    if (line.level > 0 && line.text.length > 0) {
      node.setRangeListOptions(pos, end, { type: 'UNORDERED' });
      if (line.level === 2) node.setRangeIndentation(pos, end, 2);
    }
    pos = end + 1;
  }
}
```

`-` 하이픈을 plain text로 넣으면 화면에 하이픈이 그대로 노출됨. 반드시 native 불릿 사용.

---

## 6. Clone 후 처리 (Single Source of Truth)

### 6.1 clearAnnotations — 이 정의가 유일한 정본

STRUCTURE → FEATURE clone, 또는 다른 섹션으로 clone할 때 **clone 직후 즉시** 실행.

```javascript
const ANNOTATABLE_TYPES = new Set([
  'FRAME','COMPONENT','INSTANCE','TEXT','RECTANGLE',
  'ELLIPSE','VECTOR','LINE','POLYGON','STAR','GROUP','BOOLEAN_OPERATION'
]);

function clearAnnotations(node) {
  // SECTION 타입은 .annotations 프로퍼티 없음 → guard 필수
  if (node.type !== 'SECTION' && ANNOTATABLE_TYPES.has(node.type)) {
    try {
      if (node.annotations && node.annotations.length > 0) node.annotations = [];
    } catch(e) {}
  }
  if ('children' in node) node.children.forEach(child => clearAnnotations(child));
}

// clone 직후 — 절대 건너뛰지 않는다
clearAnnotations(clonedFrame);
```

### 6.2 Clone 후 처리 순서

```
Step 1 — clone 직후 clearAnnotations 실행
Step 2 — Board Header 텍스트 수정 (Main Label + Sub Label)
Step 3 — Screen 내 상태 변화 요소 수정
Step 4 — FEATURE annotation 추가 (action button만)
```

### 6.3 Screen children 확인 — 추가 전 필수

```javascript
// dim/modal/toast 추가 전 기존 children 확인
const screen = frame.children[1];
const existing = Array.from(screen.children).map(c => `${c.name}(${c.type})`);
// 기존 레이어 있으면 제거 후 추가 — 이중 dim/modal 방지
```

### 6.4 clearAnnotations 적용 기준

| 상황 | 적용 |
|---|---|
| STRUCTURE → FEATURE | 필수 |
| FEATURE → 파생 FEATURE | 필수 |
| STRUCTURE → STRUCTURE (MemberType 분리) | 금지 (annotation 유지 후 내용만 수정) |

---

## 7. 수정 범위 제한

지시된 노드의 ID/이름을 정확히 확인 후 그것만 수정한다.
parent/sibling/ancestor 노드는 절대 건드리지 않는다.

TC(타이틀 카드) 수정 지시에 WF(와이어프레임)를 건드리는 것 금지.

---

## 8. Screenshot 검증 — 완료 선언 전 필수

```javascript
const result = await targetNode.screenshot();
return { screenshot: result, ...otherData };
```

코드가 에러 없이 실행돼도 시각적으로 틀릴 수 있다 (높이 이상, 스타일 불일치, 텍스트 잘림, gap 이상).

Description 삽입 후에는 반드시 `descListNode.screenshot()`으로 gap 육안 확인.

---

## 9. 기타 규칙

### 9.1 clipsContent = false

```javascript
const f = figma.createFrame();
f.clipsContent = false; // createFrame() 직후 항상 추가
```

### 9.2 노드 삭제 전 백업

```javascript
const backup = descList.children.map(c => ({
  id: c.id, name: c.name, type: c.type
}));
return { backup }; // 확인 후 삭제 진행
```

### 9.3 Screen 오버플로 처리

Screen 내용이 1080px를 초과할 때:

```javascript
function expandScreen(wfId, newHeight) {
  const wf = figma.getNodeById(wfId);
  const contents = wf.children[1];
  const screen = contents.children[0];
  screen.layoutSizingVertical = 'FIXED';
  screen.resize(1920, newHeight);
  contents.resize(contents.width, newHeight);
  screen.layoutSizingVertical = 'FILL';
}
```

### 9.4 페이지 ID — 실시간 조회 필수

```javascript
// ❌ 금지 — ID 하드코딩
figma.root.children.find(p => p.id === '237:3133');

// ✅ 올바름 — 이름으로 실시간 조회
figma.root.children.find(p => p.name === 'Plan');
```

---

## 10. 절대 금지 패턴

### 패턴 1 — 참조 없이 색상/폰트 하드코딩

```
❌ fontName: { family: 'Inter', style: 'Regular' } ← 추측
✅ getStyledTextSegments로 읽어서 복사
```

### 패턴 2 — FRAME 타입만 보고 "컴포넌트 없다" 판단

```
❌ node.type === 'FRAME' → "컴포넌트 없으니 코드로 재생성"
✅ Q1부터 시작 — 같은 역할의 노드가 파일에 있는지 먼저 확인
```

### 패턴 3 — resize() 후 primaryAxisSizingMode 미재설정

```
❌ frame.resize(424, 100);  ← AUTO가 FIXED로 초기화됨
✅ frame.resize(424, 100);
   frame.primaryAxisSizingMode = 'AUTO';
```

### 패턴 4 — FILL 설정 후 appendChild (역순)

```
❌ child.layoutSizingHorizontal = "FILL";
   parent.appendChild(child);

✅ parent.appendChild(child);
   child.layoutSizingHorizontal = "FILL";
```

### 패턴 5 — Screenshot 없이 완료 선언

```
❌ "완료됐습니다" (시각 검증 없이)
✅ await node.screenshot() → 결과 확인 → "완료됐습니다"
```

### 패턴 6 — 수정 범위 이탈

```
❌ TC 수정 지시 → WF까지 수정
✅ 지시된 노드만 수정 — 의심스러우면 유저에게 범위 확인
```

---

## 11. QA 체크리스트

### 노드 생성
- [ ] Q1~Q4 의사결정을 거쳤는가?
- [ ] 같은 역할의 기존 노드를 먼저 확인했는가?
- [ ] 스타일이 필요하면 getStyledTextSegments로 읽었는가?

### Auto Layout
- [ ] layoutMode가 NONE이 아닌가? (Screen 예외)
- [ ] 패딩이 16px 기본값인가? (예외 시 이유 있는가?)
- [ ] FILL 설정이 appendChild 이후인가?
- [ ] resize() 후 primaryAxisSizingMode를 재설정했는가?

### 텍스트
- [ ] resize → textAutoResize → characters 순서인가?
- [ ] boundVariables 확인 후 fills를 수정했는가?
- [ ] Description 삽입 시 applyBullets()를 적용했는가?

### Clone
- [ ] clone 직후 clearAnnotations를 실행했는가?
- [ ] Board Header 텍스트를 수정했는가?
- [ ] Screen children을 확인 후 추가했는가?

### 검증
- [ ] 수정 대상이 지시된 노드만인가? (범위 이탈 없음)
- [ ] screenshot으로 시각 검증했는가?
- [ ] Description 삽입 후 gap을 확인했는가?
