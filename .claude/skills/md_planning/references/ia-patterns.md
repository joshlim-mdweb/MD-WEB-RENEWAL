# IA 차트 레퍼런스 패턴

출처: 2026-RENEWAL Figma (MD Web Renewal 실제 IA)

---

## 핵심 규칙

### 배경: 라이트

IA 차트는 화이트 배경 사용. 와이어프레임과 동일 테마.

```
캔버스 배경: #FFFFFF
Depth 1 노드: #1A1A1A (다크 필), 텍스트 #FFFFFF
Depth 2 노드: #FFFFFF (화이트 필), 테두리 #D1D1D1, 텍스트 #333333
```

### 연결선: 없음

선 없이 열(column) 위치만으로 계층을 암시.
Depth 1 → 상단 수평 / Depth 2 → 부모 바로 아래 수직 스택.

### 레이아웃

```
[IA]  ← 좌상단 뱃지

[Home]  [Feature]    [Plan]  [Enterprise]  [Resource]     [Download]    [My Page]            [SIGN IN]
        [Personal]           [...]          [Manual]       [Recent Ver]  [Account] [Essential] [CLO-SET]
        [Enterprise]                        [Release]      [Archive]     [Connected]           [MD SIGN IN]
        [Verify]                            [Learn]        [Personal]    [Connected]           [Find ID/PW]
                                            [Community]    [Enterprise]  [License/Billing]     [SIGN UP]
```

- Depth 1 노드: 동일 Y축 (수평 정렬)
- Depth 2 노드: 부모 X축 기준으로 정렬, Y축은 순서대로 아래
- Depth 2가 여러 열로 나뉘는 경우(My Page, SIGN IN): 가로로 나열 후 아래로 확장

---

## 노드 스타일

### Depth 1 (최상위 페이지)

```
크기: 100×32
cornerRadius: 6
배경: #1E1E1E
테두리: rgba(255,255,255,0.25), strokeWeight 1
텍스트: 12px SemiBold, #FFFFFF, 중앙정렬
```

### Depth 2 (하위 페이지/섹션)

```
크기: 100×28
cornerRadius: 6
배경: #181818
테두리: rgba(255,255,255,0.15), strokeWeight 1
텍스트: 11px Regular, #FFFFFF, 중앙정렬
```

### IA 뱃지 (좌상단)

```
크기: 24×18
cornerRadius: 4
배경: #4F46E5 (인디고)
텍스트: "IA", 10px SemiBold, #FFFFFF, 중앙정렬
위치: 캔버스 좌상단 (x: 20, y: 20)
```

---

## Figma 구현 패턴

```javascript
// IA 차트 캔버스 (다크 배경)
const iaFrame = figma.createFrame();
iaFrame.name = "IA Chart";
iaFrame.layoutMode = "NONE";
iaFrame.resize(1440, canvasHeight);
iaFrame.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.067, b: 0.067 } }]; // #111111

// IA 뱃지
function createIABadge(parent) {
  const badge = figma.createFrame();
  badge.resize(24, 18);
  badge.x = 20; badge.y = 20;
  badge.fills = [{ type: 'SOLID', color: { r: 0.31, g: 0.28, b: 0.90 } }]; // #4F46E5
  badge.cornerRadius = 4;
  const t = figma.createText();
  t.characters = "IA";
  t.fontSize = 10;
  t.fontName = { family: "Poppins", style: "SemiBold" };
  t.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  badge.appendChild(t);
  t.x = (24 - t.width) / 2; t.y = (18 - t.height) / 2;
  parent.appendChild(badge);
}

// Depth 1 노드
function createDepth1Node(parent, label, x, y) {
  const W = 100, H = 32;
  const frame = figma.createFrame();
  frame.resize(W, H);
  frame.x = x; frame.y = y;
  frame.fills = [{ type: 'SOLID', color: { r: 0.118, g: 0.118, b: 0.118 } }]; // #1E1E1E
  frame.cornerRadius = 6;
  frame.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.25 } }];
  frame.strokeWeight = 1;
  const t = figma.createText();
  t.characters = label;
  t.fontSize = 12;
  t.fontName = { family: "Pretendard", style: "SemiBold" };
  t.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  frame.appendChild(t);
  t.x = (W - t.width) / 2; t.y = (H - t.height) / 2;
  parent.appendChild(frame);
  return { cx: x + W / 2, bottom: y + H, x, y, W, H };
}

// Depth 2 노드
function createDepth2Node(parent, label, x, y) {
  const W = 100, H = 28;
  const frame = figma.createFrame();
  frame.resize(W, H);
  frame.x = x; frame.y = y;
  frame.fills = [{ type: 'SOLID', color: { r: 0.094, g: 0.094, b: 0.094 } }]; // #181818
  frame.cornerRadius = 6;
  frame.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 0.15 } }];
  frame.strokeWeight = 1;
  const t = figma.createText();
  t.characters = label;
  t.fontSize = 11;
  t.fontName = { family: "Pretendard", style: "Regular" };
  t.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  frame.appendChild(t);
  t.x = (W - t.width) / 2; t.y = (H - t.height) / 2;
  parent.appendChild(frame);
  return { x, y, W, H };
}
```

---

## 레이아웃 간격 기준

| 항목 | 값 |
|------|-----|
| Depth 1 노드 간 수평 간격 | 16px |
| Depth 1 → Depth 2 수직 간격 | 12px |
| Depth 2 노드 간 수직 간격 | 8px |
| 캔버스 상단 패딩 | 60px |
| 캔버스 좌측 패딩 | 40px |
| Depth 2 다열 배치 시 수평 간격 | 8px |

---

## 배치 알고리즘

PRD에서 IA 구조를 파싱한 뒤 아래 순서로 배치:

```
1. Depth 1 노드를 왼→오른쪽으로 수평 배치
   x = 40 + (노드너비 + 간격) * index
   y = 60 (고정)

2. 각 Depth 1 노드 아래에 Depth 2 자식을 수직 배치
   x = 부모 x (왼쪽 정렬)
   y = 부모 bottom + 12 + (노드높이 + 8) * childIndex

3. Depth 2가 2개 이상의 열로 구성되는 경우
   x = 부모 x + (노드너비 + 8) * colIndex
   y = 부모 bottom + 12 + (노드높이 + 8) * rowIndex
```

---

## 캔버스 크기 기준

| 페이지 수 | 권장 캔버스 높이 |
|-----------|----------------|
| Depth 1 최대 8개 이하 | 400px |
| Depth 2 최대 5개 이하 | 400px |
| Depth 2 6개 이상 | 500~600px |
