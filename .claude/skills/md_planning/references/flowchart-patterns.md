# Flow Chart 레퍼런스 패턴

실제 MD 프로젝트 Figma 플로우 차트에서 추출한 패턴.
출처: ZENDESK flow, PENDING-LICENSE flow, COMPONENT template

---

## 핵심 규칙

### 연결선: Orthogonal (직각 꺾임)

cubic bezier 금지. 모든 엣지는 수평/수직 직각 꺾임으로 그린다.

```
A ──────────────── B
                   │
                   C
```

Figma에서는 Vector의 vectorNetwork로 꺾임 포인트를 명시적으로 지정.

### 노드 라벨 표기 규칙

특수 노드는 꺾쇠 괄호(`<>`) 표기 사용:

| 표기 | 의미 |
|------|------|
| `<CHECK>` | 조건 분기 다이아몬드 |
| `<END>` | 플로우 종료 노드 |
| `<Modal>` | 모달 팝업 화면 |
| `<Loop>` | 루프백 연결 |

꺾쇠 표기는 노드 내 첫 번째 줄에 작게, 그 아래 실제 조건 내용 표기.

### 분기 라벨 색상

| 분기 방향 | 색상 | HEX |
|-----------|------|-----|
| If NO / Fail | 오렌지 (MD 브랜드) | `#DF4D18` |
| If YES / Success | 그레이 | `#666666` |
| 기본 흐름 (라벨 없음) | — | — |

---

## 노드 타입 정의

### 1. Terminal — Start

원형/타원형. 플로우 시작점.

```
크기: 60×32 (타원)
배경: #FFFFFF
테두리: #1A1A1A, strokeWeight 1.5
텍스트: "Start", 12px Regular, #333333
```

### 2. Screen — 일반 화면

둥근 모서리 직사각형.

```
크기: 140×44
cornerRadius: 6
배경: #FFFFFF
테두리: #333333, strokeWeight 1
텍스트: 화면명, 12px Regular, #1A1A1A, 중앙정렬
```

### 3. Decision — 조건 분기

다이아몬드. `<CHECK>` 표기.

```
크기: 100×60 (rotated 45° rectangle처럼 보이게)
배경: #FFFFFF
테두리: #333333, strokeWeight 1
텍스트 상단: "<CHECK>", 10px Regular, #999999
텍스트 하단: 조건 내용, 11px Regular, #1A1A1A
```

Figma 구현: rotate(45°) 된 정사각형 프레임.

### 4. Terminal — End

둥근 직사각형. `<END>` 표기.

```
크기: 100×44
cornerRadius: 22 (완전 pill)
배경: #1A1A1A
테두리: 없음
텍스트: "<END>", 12px Regular, #FFFFFF
```

### 5. Input-List — 입력 필드 목록

불릿 리스트를 포함하는 정보 박스. 화면 옆에 부가 정보로 붙음.

```
크기: 160×(내용에 따라 가변)
cornerRadius: 4
배경: #FFFFFF
테두리: #D1D1D1, strokeWeight 1, dashPattern [3, 2]
상단 라벨: "Inputs:", 11px SemiBold, #333333
내용: 불릿 리스트, 11px Regular, #666666, lineHeight 180%
```

### 6. Group Zone — 영역 표시

여러 노드를 묶는 배경 영역. 라벨은 좌상단.

```
배경: #F5F5F5 (불투명)
cornerRadius: 8
테두리: 없음
라벨: 좌상단, 11px Regular, #999999
```

Group Zone은 다른 노드들 뒤에 배치 (z-index 최하단).

---

## 레이아웃 패턴

### 단일 플로우

왼→오른쪽 수평 흐름. 분기는 위아래.

```
Start → Screen1 → <CHECK> → Screen2 → <END>
                     │
                  Screen3
```

- 노드 수평 간격: 80px (노드 간 엣지 길이)
- 분기 수직 간격: 60px

### 멀티 플로우 (플로우 여러 개를 한 캔버스에)

섹션 헤더를 좌상단에 배치, 플로우를 수직으로 쌓음.

```
SECTION A FLOW
[Start] → [...] → [End]

SECTION B FLOW
[Start] → [...] → [End]

SECTION C FLOW
[Start] → [...]
         ├── [...] → [End]
         └── [...] → [End]
```

- 섹션 간 수직 간격: 80px
- 섹션 헤더: 12px SemiBold, #1A1A1A, 플로우 위 16px

### 루프백

같은 노드로 되돌아가는 경우, 아래로 우회하는 직각 경로 사용.

```
      ┌──────────────────┐
      │                  │
   [Node A] → <CHECK> → [Node B]
                │
              FAIL ─────►
```

---

## Figma 구현 — Orthogonal Edge

```javascript
// 직각 꺾임 엣지 (A 오른쪽 → B 왼쪽, 수직 오프셋 있는 경우)
function createOrthogonalEdge(parent, x1, y1, x2, y2, label, isNegative) {
  const midX = x1 + (x2 - x1) / 2;

  // 꺾임 포인트: x1 → midX → midX → x2 (수직 이동 포함)
  const path = figma.createVector();
  path.vectorPaths = [{
    windingRule: "NONE",
    data: `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`,
  }];
  path.strokes = [{ type: 'SOLID', color: { r: 0.60, g: 0.60, b: 0.60 } }];
  path.strokeWeight = 1;
  path.fills = [];
  parent.appendChild(path);

  // 화살표 삼각형 (도착점 왼쪽)
  const arrowSize = 6;
  const arrow = figma.createVector();
  arrow.vectorPaths = [{
    windingRule: "NONZERO",
    data: `M ${x2} ${y2} L ${x2 - arrowSize} ${y2 - arrowSize / 2} L ${x2 - arrowSize} ${y2 + arrowSize / 2} Z`,
  }];
  arrow.fills = [{ type: 'SOLID', color: { r: 0.40, g: 0.40, b: 0.40 } }];
  arrow.strokes = [];
  parent.appendChild(arrow);

  // 분기 라벨
  if (label) {
    const labelColor = isNegative
      ? { r: 0.87, g: 0.30, b: 0.09 }  // #DF4D18 — If NO
      : { r: 0.40, g: 0.40, b: 0.40 }; // #666666 — If YES
    const t = figma.createText();
    t.characters = label;
    t.fontSize = 10;
    t.fontName = { family: "Poppins", style: "Regular" };
    t.fills = [{ type: 'SOLID', color: labelColor }];
    t.textAutoResize = "WIDTH_AND_HEIGHT";
    // 라벨은 꺾임 지점 근처에 배치
    t.x = midX + 4;
    t.y = Math.min(y1, y2) + 4;
    parent.appendChild(t);
  }
}

// 직선 엣지 (같은 y 레벨)
function createStraightEdge(parent, x1, y, x2, label) {
  const line = figma.createVector();
  line.vectorPaths = [{
    windingRule: "NONE",
    data: `M ${x1} ${y} L ${x2} ${y}`,
  }];
  line.strokes = [{ type: 'SOLID', color: { r: 0.60, g: 0.60, b: 0.60 } }];
  line.strokeWeight = 1;
  line.fills = [];
  parent.appendChild(line);

  // 화살표
  const arrowSize = 6;
  const arrow = figma.createVector();
  arrow.vectorPaths = [{
    windingRule: "NONZERO",
    data: `M ${x2} ${y} L ${x2 - arrowSize} ${y - arrowSize / 2} L ${x2 - arrowSize} ${y + arrowSize / 2} Z`,
  }];
  arrow.fills = [{ type: 'SOLID', color: { r: 0.40, g: 0.40, b: 0.40 } }];
  arrow.strokes = [];
  parent.appendChild(arrow);
}

// Decision 다이아몬드 노드 — vectorPaths 사용, rotation 금지
function createDecisionNode(parent, conditionText, x, y) {
  const size = 80;
  const cx = x + size / 2;
  const cy = y + size / 2;

  // 로컬 좌표 기준 closed diamond path
  const diamond = figma.createVector();
  diamond.vectorPaths = [{
    windingRule: "NONZERO",
    data: `M ${size / 2} 0 L ${size} ${size / 2} L ${size / 2} ${size} L 0 ${size / 2} Z`,
  }];
  diamond.x = x;
  diamond.y = y;
  diamond.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  diamond.strokes = [{ type: 'SOLID', color: { r: 0.20, g: 0.20, b: 0.20 } }];
  diamond.strokeWeight = 1;
  parent.appendChild(diamond);

  // <CHECK> 라벨 — append 후 width 읽기
  const t1 = figma.createText();
  t1.characters = "<CHECK>";
  t1.fontSize = 10;
  t1.fontName = { family: "Poppins", style: "Regular" };
  t1.fills = [{ type: 'SOLID', color: { r: 0.60, g: 0.60, b: 0.60 } }];
  t1.textAutoResize = "WIDTH_AND_HEIGHT";
  parent.appendChild(t1);
  t1.x = cx - t1.width / 2;
  t1.y = cy - t1.height - 2;

  // 조건 내용 — append 후 width 읽기
  const t2 = figma.createText();
  t2.characters = conditionText;
  t2.fontSize = 11;
  t2.fontName = { family: "Pretendard", style: "Regular" };
  t2.fills = [{ type: 'SOLID', color: { r: 0.10, g: 0.10, b: 0.10 } }];
  t2.textAutoResize = "WIDTH_AND_HEIGHT";
  parent.appendChild(t2);
  t2.x = cx - t2.width / 2;
  t2.y = cy - t2.height / 2;

  return {
    right:  { x: x + size, y: cy },
    bottom: { x: cx,       y: y + size },
    left:   { x: x,        y: cy },
    top:    { x: cx,       y: y },
  };
}
```

---

## 문서 레이아웃 템플릿 (COMPONENT 참고)

플로우 차트 페이지를 만들 때 4섹션 구조 사용 가능:

```
┌──────────────────┬──────────────────┬──────────────────────────────┬──────────────────┐
│ PRE-ANALYTICS    │ DESCRIPTION      │ FLOW                         │ ROUTE            │
│                  │                  │                              │                  │
│ 연관 지표        │ 기능 설명        │ 실제 플로우 차트              │ 화면 라우트      │
│ 분석 포인트      │ 상태 정의        │                              │ API 엔드포인트   │
│                  │ 색상 범례        │                              │                  │
└──────────────────┴──────────────────┴──────────────────────────────┴──────────────────┘
```

단순 플로우는 FLOW 섹션만 사용, 복잡한 기능은 4섹션 전체 활용.

---

## 캔버스 크기 기준

| 플로우 복잡도 | 권장 캔버스 크기 |
|--------------|-----------------|
| 단순 (노드 5개 이하) | 1440×400 |
| 중간 (노드 6~12개) | 1440×600 |
| 복잡 (분기 다수) | 1440×900 |
| 멀티 플로우 | 1440×(플로우 수 × 300) |
