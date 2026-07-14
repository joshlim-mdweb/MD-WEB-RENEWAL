---
name: md_planning
description: "MD Web Renewal 기획 산출물 자동 생성 스킬 — /cowork으로 생성된 PRD를 받아 Jira 티켓 생성 + Figma에 IA 차트, 플로우 차트, 문서 페이지, 흑백 와이어프레임을 제작합니다. 'md_planning', 'planning', 'IA 그려줘', '플로우 그려줘', '와이어프레임 그려줘', 'Jira 티켓 만들어줘' 등에서 트리거."
user_invocable: true
---

# md_planning 스킬

`/cowork`으로 생성된 PRD를 기반으로 **Jira 티켓 + Figma 기획 산출물 4종**을 자동 제작합니다.

| 산출물 | 도구 | 내용 |
|--------|------|------|
| Jira 티켓 | Atlassian MCP | Epic + Story (jira-ticket.md 규칙 준수) |
| IA 차트 | Figma | 화면 계층 구조 |
| 플로우 차트 | Figma | 화면 간 이동 흐름 + 분기 조건 |
| 문서 페이지 | Figma | 정책·작업순서·히스토리 테이블 |
| 와이어프레임 | Figma | 흑백 로우피델리티 화면 구조 |

---

## 스킬 시작 가이드

스킬 실행 즉시 사용자에게 안내:

```
📐 md_planning 스킬을 시작합니다.

/cowork으로 생성된 PRD를 공유해주세요.
PRD 하나로 Jira 티켓 생성 → Figma 기획 산출물 4종을 순서대로 제작합니다.

각 단계 완료 후 결과를 확인하고 다음 단계로 진행합니다.
특정 단계만 요청해도 됩니다. (예: "플로우만 그려줘", "Jira 티켓만 만들어줘")
```

---

## 실행 흐름

```
1. PRD 수신 및 파싱
   → 화면 목록, 계층 구조, 사용자 플로우, Story 목록 추출
   → 추출 결과 사용자 확인

2. Jira 티켓 생성
   → Epic 1개 + Story N개 (jira-ticket.md 규칙 준수)
   → 생성된 티켓 URL 목록 공유 → 사용자 확인

3. IA 차트 생성 (Figma)
   → 화면 계층 트리 시각화
   → get_screenshot 검증 → 사용자 확인

4. 플로우 차트 생성 (Figma)
   → 화면 간 이동 + 분기 조건 시각화
   → get_screenshot 검증 → 사용자 확인

5. 문서 페이지 생성 (Figma)
   → DESCRIPTION + FLOW REF + ROUTE + HISTORY 테이블
   → get_screenshot 검증 → 사용자 확인

6. 와이어프레임 생성 (Figma)
   → 화면별 섹션 분할 호출
   → get_screenshot 검증
```

단계별로 사용자 확인 후 진행. 특정 단계만 요청 시 해당 단계만 실행.

---

## 흑백 컬러 규칙 (전 산출물 공통)

모든 산출물은 그레이스케일만 사용. 브랜드 컬러, Primary 컬러 일체 금지.

| 용도 | HEX | Figma RGB |
|------|-----|-----------|
| 배경 White | `#FFFFFF` | `{ r: 1, g: 1, b: 1 }` |
| 배경 Light | `#F5F5F5` | `{ r: 0.96, g: 0.96, b: 0.96 }` |
| 배경 Gray | `#E5E5E5` | `{ r: 0.90, g: 0.90, b: 0.90 }` |
| 테두리 Light | `#D1D1D1` | `{ r: 0.82, g: 0.82, b: 0.82 }` |
| 테두리 | `#999999` | `{ r: 0.60, g: 0.60, b: 0.60 }` |
| 텍스트 Light | `#666666` | `{ r: 0.40, g: 0.40, b: 0.40 }` |
| 텍스트 Default | `#333333` | `{ r: 0.20, g: 0.20, b: 0.20 }` |
| 텍스트 Dark | `#1A1A1A` | `{ r: 0.10, g: 0.10, b: 0.10 }` |
| 플레이스홀더 | `#CCCCCC` | `{ r: 0.80, g: 0.80, b: 0.80 }` |

강조는 굵기(Weight)와 크기(Size)로만 표현. 컬러 강조 금지.

---

## 1. IA 차트

> 상세 패턴 레퍼런스: `references/ia-patterns.md`

### 핵심 원칙

- 배경: **라이트(#FFFFFF)**
- 연결선: **없음** — 열 위치로 계층 암시
- Depth 1: 상단 수평 배열
- Depth 2: 부모 노드 바로 아래 수직 스택 (다열 가능)
- 좌상단 `IA` 뱃지 배치

### 노드 스타일

| Depth | 배경 | 테두리 | 크기 | 텍스트 |
|-------|------|--------|------|--------|
| 1 | `#1A1A1A` | 없음 | 100×32 | 12px SemiBold, `#FFF` |
| 2 | `#FFFFFF` | `#D1D1D1` | 100×28 | 11px Regular, `#333` |

### Figma 구현 패턴

```javascript
// IA 차트 캔버스 (라이트 배경)
const iaFrame = figma.createFrame();
iaFrame.name = "IA Chart";
iaFrame.layoutMode = "NONE";
iaFrame.resize(1440, canvasHeight);
iaFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

// IA 뱃지 (좌상단)
const badge = figma.createFrame();
badge.resize(24, 18);
badge.x = 20; badge.y = 20;
badge.fills = [{ type: 'SOLID', color: { r: 0.31, g: 0.28, b: 0.90 } }]; // #4F46E5
badge.cornerRadius = 4;
const badgeText = figma.createText();
badgeText.characters = "IA";
badgeText.fontSize = 10;
badgeText.fontName = { family: "Poppins", style: "SemiBold" };
badgeText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
badgeText.textAutoResize = "WIDTH_AND_HEIGHT";
badge.appendChild(badgeText);
badgeText.x = (24 - badgeText.width) / 2;
badgeText.y = (18 - badgeText.height) / 2;
iaFrame.appendChild(badge);

// 노드 헬퍼 (depth: 1 | 2)
function createIANode(parent, label, depth, x, y) {
  const W = 100, H = depth === 1 ? 32 : 28;
  const bg = depth === 1
    ? { r: 0.10, g: 0.10, b: 0.10 }
    : { r: 1, g: 1, b: 1 };
  const textColor = depth === 1
    ? { r: 1, g: 1, b: 1 }
    : { r: 0.20, g: 0.20, b: 0.20 };
  const fontWeight = depth === 1 ? "SemiBold" : "Regular";
  const fontSize = depth === 1 ? 12 : 11;

  const frame = figma.createFrame();
  frame.resize(W, H);
  frame.x = x; frame.y = y;
  frame.fills = [{ type: 'SOLID', color: bg }];
  frame.cornerRadius = 6;
  if (depth === 2) {
    frame.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.82, b: 0.82 } }];
    frame.strokeWeight = 1;
  }

  const t = figma.createText();
  t.characters = label;
  t.fontSize = fontSize;
  t.fontName = { family: "Pretendard", style: fontWeight };
  t.fills = [{ type: 'SOLID', color: textColor }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  frame.appendChild(t);
  t.x = (W - t.width) / 2; t.y = (H - t.height) / 2;
  parent.appendChild(frame);
  return { x, y, W, H, bottom: y + H };
}
```

### 레이아웃 간격 기준

| 항목 | 값 |
|------|-----|
| Depth 1 노드 간 수평 | 16px |
| Depth 1 → Depth 2 수직 | 12px |
| Depth 2 노드 간 수직 | 8px |
| Depth 2 다열 수평 | 8px |
| 캔버스 상단 패딩 | 60px |
| 캔버스 좌측 패딩 | 40px |

---

## 2. 플로우 차트

> 상세 패턴 레퍼런스: `references/flowchart-patterns.md`

### 핵심 원칙

- 연결선: **Orthogonal (직각 꺾임)** — cubic bezier 금지
- 노드 라벨: `<CHECK>`, `<END>`, `<Modal>` 꺾쇠 표기
- 분기 라벨: If NO → 오렌지(`#DF4D18`), If YES → 그레이(`#666666`)
- 멀티 플로우: 섹션 헤더 + 수직 스택

### 노드 타입

| 타입 | 모양 | 크기 | 용도 |
|------|------|------|------|
| `terminal-start` | 타원 | 60×32 | 시작점 |
| `screen` | 둥근 직사각형 | 140×44 | 일반 화면 |
| `decision` | 다이아몬드 (45° 회전) | 80×80 | `<CHECK>` 분기 |
| `terminal-end` | Pill 직사각형 | 100×44 | `<END>` 종료 |
| `input-list` | 점선 직사각형 | 160×가변 | Inputs 목록 |
| `group-zone` | 배경 영역 | 가변 | 구간 표시 |

### Figma 구현 패턴

```javascript
// 플로우 차트 캔버스
const flowFrame = figma.createFrame();
flowFrame.name = "Flow Chart";
flowFrame.layoutMode = "NONE";
flowFrame.resize(1440, canvasHeight);
flowFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

// 화면 노드
function createScreenNode(parent, label, x, y) {
  const W = 140, H = 44;
  const frame = figma.createFrame();
  frame.resize(W, H);
  frame.x = x; frame.y = y;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.cornerRadius = 6;
  frame.strokes = [{ type: 'SOLID', color: { r: 0.20, g: 0.20, b: 0.20 } }];
  frame.strokeWeight = 1;
  const t = figma.createText();
  t.characters = label;
  t.fontSize = 12;
  t.fontName = { family: "Pretendard", style: "Regular" };
  t.fills = [{ type: 'SOLID', color: { r: 0.10, g: 0.10, b: 0.10 } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  frame.appendChild(t);
  t.x = (W - t.width) / 2; t.y = (H - t.height) / 2;
  parent.appendChild(frame);
  return {
    right:  { x: x + W, y: y + H / 2 },
    left:   { x: x,     y: y + H / 2 },
    bottom: { x: x + W / 2, y: y + H },
    top:    { x: x + W / 2, y: y },
  };
}

// 결정 노드 (다이아몬드) — vectorPaths 사용, rotation 금지
function createDecisionNode(parent, conditionText, x, y) {
  const size = 80;
  const cx = x + size / 2;
  const cy = y + size / 2;

  // 다이아몬드: 로컬 좌표(0,0 기준) closed path
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
    left:   { x: x,        y: cy },
    bottom: { x: cx,       y: y + size },
    top:    { x: cx,       y: y },
  };
}

// Orthogonal 엣지 (직각 꺾임)
function createOrthogonalEdge(parent, x1, y1, x2, y2, label, isNegative) {
  const midX = x1 + (x2 - x1) / 2;
  const path = figma.createVector();
  path.vectorPaths = [{
    windingRule: "NONE",
    data: y1 === y2
      ? `M ${x1} ${y1} L ${x2} ${y2}`
      : `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`,
  }];
  path.strokes = [{ type: 'SOLID', color: { r: 0.60, g: 0.60, b: 0.60 } }];
  path.strokeWeight = 1;
  path.fills = [];
  parent.appendChild(path);

  // 화살표
  const arrowSize = 6;
  const arrow = figma.createVector();
  arrow.vectorPaths = [{
    windingRule: "NONZERO",
    data: `M ${x2} ${y2} L ${x2 - arrowSize} ${y2 - arrowSize / 2} L ${x2 - arrowSize} ${y2 + arrowSize / 2} Z`,
  }];
  arrow.fills = [{ type: 'SOLID', color: { r: 0.40, g: 0.40, b: 0.40 } }];
  arrow.strokes = [];
  parent.appendChild(arrow);

  // 분기 라벨 (If YES / If NO)
  if (label) {
    const labelColor = isNegative
      ? { r: 0.87, g: 0.30, b: 0.09 }  // #DF4D18
      : { r: 0.40, g: 0.40, b: 0.40 }; // #666666
    const t = figma.createText();
    t.characters = label;
    t.fontSize = 10;
    t.fontName = { family: "Poppins", style: "Regular" };
    t.fills = [{ type: 'SOLID', color: labelColor }];
    t.textAutoResize = "WIDTH_AND_HEIGHT";
    t.x = midX + 4; t.y = Math.min(y1, y2) + 4;
    parent.appendChild(t);
  }
}

// Group Zone (배경 영역)
function createGroupZone(parent, label, x, y, w, h) {
  const zone = figma.createRectangle();
  zone.resize(w, h);
  zone.x = x; zone.y = y;
  zone.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.96 } }];
  zone.cornerRadius = 8;
  zone.strokes = [];
  parent.insertChild(0, zone); // 최하단 z-order
  const t = figma.createText();
  t.characters = label;
  t.fontSize = 11;
  t.fontName = { family: "Pretendard", style: "Regular" };
  t.fills = [{ type: 'SOLID', color: { r: 0.60, g: 0.60, b: 0.60 } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  t.x = x + 12; t.y = y + 12;
  parent.appendChild(t);
}
```

### 레이아웃 간격 기준

- 노드 간 수평 간격: 80px (엣지 길이)
- 분기 수직 간격: 60px
- 섹션 간 간격 (멀티 플로우): 80px
- 섹션 헤더: 12px SemiBold, 플로우 위 16px
- 전체 캔버스 패딩: 80px

---

## 3. 와이어프레임

### 레이아웃 기준

- Desktop 기준 너비: **1440px**
- Content 좌우 패딩: **100px**
- 섹션 간 수직 간격: **80~100px**
- 절대 좌표 금지 — Auto Layout + Hug Contents 전용

### MD Web Renewal 화면 패턴

PRD에서 아래 화면이 나오면 해당 패턴을 우선 적용.

| 화면 | 패턴 |
|------|------|
| Home | Hero (2단) + Authority Badge Bar + Testimonial Cards + Feature Grid + CTA |
| Solutions/Personal | Hero + Who it's for + Core Block × 3 + Workflow + Plan CTA |
| Solutions/Enterprise | Hero + Core Block Grid (3×2) + Userpool 섹션 + CTA |
| Solutions/Students | Hero + Core Block × 3 + 할인 고지 배너 + Plan CTA |
| Pricing | Plan Card × 3~5 + Feature 비교 테이블 + Authority Badge |
| About | 타임라인 섹션 + 필모그래피 그리드 |

### 공통 컴포넌트 패턴

**헤더**
- 로고(좌) + 네비게이션(중앙) + CTA 버튼(우)
- 높이: 64~80px

**히어로 2단**
- 좌: 타이틀 + 서브카피 + CTA 버튼
- 우: 이미지 플레이스홀더

**히어로 중앙정렬**
- 중앙: 타이틀 + 서브카피 + CTA 버튼 (모두 center align)

**Core Block**
- 아이콘 플레이스홀더 + 타이틀 + 설명 1~2줄

**Authority Badge Bar**
- `[뱃지] · [로고] · [로고] · [로고]` 가로 1열

**Plan Card**
- 플랜명 + 가격 + 피처 리스트 + CTA 버튼
- 추천 플랜: 테두리 강조 (strokeWeight 2)

**Feature 비교 테이블**
- 행: 기능명 / 열: 플랜
- 체크 = 다크 원, 미지원 = 라이트 대시

**Testimonial Card**
- 인용구 + 이름 + 직함 + 소속

**Workflow Step**
- 01 / 02 / 03 Step 인디케이터 + 제목 + 설명

**푸터**
- 회사정보 + 링크 3~4열 + 저작권

### Figma API 기본 패턴

```javascript
// 폰트 로드 (필수)
await figma.loadFontAsync({ family: "Pretendard", style: "Regular" });
await figma.loadFontAsync({ family: "Pretendard", style: "Medium" });
await figma.loadFontAsync({ family: "Pretendard", style: "SemiBold" });
await figma.loadFontAsync({ family: "Pretendard", style: "Bold" });
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
await figma.loadFontAsync({ family: "Poppins", style: "Bold" });

// 메인 프레임 (Auto Layout)
const mainFrame = figma.createFrame();
mainFrame.name = "화면명";
mainFrame.layoutMode = "VERTICAL";
mainFrame.primaryAxisSizingMode = "AUTO";
mainFrame.counterAxisSizingMode = "FIXED";
mainFrame.resize(1440, 100);
mainFrame.primaryAxisSizingMode = "AUTO"; // resize 후 재설정
mainFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

// 텍스트 헬퍼
function createText(parent, text, fontSize, fontWeight, color, isEnglish) {
  const t = figma.createText();
  t.characters = text;
  t.fontSize = fontSize;
  t.fontName = { family: isEnglish ? "Poppins" : "Pretendard", style: fontWeight || "Regular" };
  t.fills = [{ type: 'SOLID', color: color || { r: 0.20, g: 0.20, b: 0.20 } }];
  t.lineHeight = { value: fontSize >= 24 ? 140 : 180, unit: "PERCENT" };
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  parent.appendChild(t);
  return t;
}

// Auto Layout 프레임 헬퍼
function createAutoFrame(parent, name, direction, spacing, padding, fills) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction || "VERTICAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "FIXED";
  f.itemSpacing = spacing || 0;
  if (padding) {
    f.paddingTop = padding; f.paddingBottom = padding;
    f.paddingLeft = padding; f.paddingRight = padding;
  }
  f.fills = fills || [];
  parent.appendChild(f);
  return f;
}

// 이미지 플레이스홀더
function createImagePlaceholder(parent, w, h, label) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = [{ type: 'SOLID', color: { r: 0.80, g: 0.80, b: 0.80 } }];
  r.cornerRadius = 4;
  parent.appendChild(r);
  if (label) {
    const t = figma.createText();
    t.characters = label || "IMG";
    t.fontSize = 12;
    t.fontName = { family: "Poppins", style: "Regular" };
    t.fills = [{ type: 'SOLID', color: { r: 0.60, g: 0.60, b: 0.60 } }];
    t.textAutoResize = "WIDTH_AND_HEIGHT";
    parent.appendChild(t);
  }
  return r;
}
```

### 서체 스케일

- Hero 타이틀: Bold 40~56px, `#1A1A1A`
- 섹션 타이틀: Bold 32~40px, `#1A1A1A`
- 서브헤딩: SemiBold 20~24px, `#333333`
- 본문: Regular 16~18px, `#333333`
- 캡션/라벨: Regular 12~14px, `#666666`

### 행간

- 24px 이상: `{ value: 140, unit: "PERCENT" }`
- 20px 이하: `{ value: 180, unit: "PERCENT" }`

### 섹션 분할 호출 원칙

한 번의 `use_figma` 호출당 노드 수 제한 → 섹션 분할:
1. 1차: 메인 프레임 + Header + Hero
2. 2차: 본문 섹션
3. 3차: CTA + Footer

재참조: `figma.currentPage.findOne(n => n.name === "프레임명")`

---

## 4. Jira 티켓

> 규칙 레퍼런스: `.claude/rules/jira-ticket.md`, `.claude/rules/atlassian.md`

### 생성 규칙

- PRD 1개 = Epic 1개 + Story N개
- Project key: `MDWEB`
- `jira-ticket.md` 규칙 그대로 준수 (SP·스프린트·기술구현 기재 금지)

### 생성 순서

```
1. Epic 생성 (mcp__claude_ai_Atlassian__createJiraIssue)
   - issuetype: Epic
   - summary: PRD H1 제목
   - description: PRD Background 섹션

2. Story 생성 (PRD의 S1, S2... 각각)
   - issuetype: Story
   - summary: "[S번호] 기능명"
   - description: 현황 + Tasks 체크리스트
   - priority: P1→High / P2→Medium / P3→Low
   - parent: Epic key
```

### 완료 후 출력 형식

```
Epic: MDWEB-{n}  — {Epic 제목}
Story: MDWEB-{n} — [S1] {기능명}
Story: MDWEB-{n} — [S2] {기능명}
...
```

---

## 5. 문서 페이지 (Figma)

> 상세 패턴 레퍼런스: `references/document-patterns.md`

### 구조

COMPONENT 파일 템플릿 기반 4패널 + 하단 HISTORY 테이블.

```
┌──────────────┬──────────────┬────────────────────────────────┬──────────────┐
│ DESCRIPTION  │ POLICY       │ FLOW REF                       │ ROUTE        │
│              │              │                                │              │
│ 기능 설명    │ 정책 내용    │ 플로우 차트 섹션명 + 링크      │ URL 라우트   │
│ 배경/목적    │ 예외 처리    │ (실제 차트는 별도 프레임)      │ API 엔드포인트│
│ 사용자 시나리오│ 제약 조건  │                                │              │
└──────────────┴──────────────┴────────────────────────────────┴──────────────┘

HISTORY
┌──────────┬──────────┬────────────────────────────────────────────────────────┐
│ DATE     │ VERSION  │ DESCRIPTION                                            │
├──────────┼──────────┼────────────────────────────────────────────────────────┤
│ 2026-04-27│ v0.1    │ 초안 작성                                              │
└──────────┴──────────┴────────────────────────────────────────────────────────┘
```

### 패널별 내용

| 패널 | 내용 | PRD 소스 |
|------|------|---------|
| DESCRIPTION | 기능 설명, 배경, 사용자 시나리오 | Background, Overview |
| POLICY | 정책 규칙, 예외 처리, 제약 조건 | Policy, Rules 섹션 |
| FLOW REF | 플로우 차트 프레임명 + Jira Epic 링크 | — |
| ROUTE | 화면 URL 경로, 주요 API 엔드포인트 | PRD 화면 목록 |

### Figma 구현 패턴

```javascript
// 문서 페이지 캔버스 (Auto Layout — 와이어프레임과 동일)
const docFrame = figma.createFrame();
docFrame.name = "DOC — {기능명}";
docFrame.layoutMode = "VERTICAL";
docFrame.primaryAxisSizingMode = "AUTO";
docFrame.counterAxisSizingMode = "FIXED";
docFrame.resize(1440, 100);
docFrame.primaryAxisSizingMode = "AUTO";
docFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
docFrame.paddingTop = 48; docFrame.paddingBottom = 48;
docFrame.paddingLeft = 60; docFrame.paddingRight = 60;
docFrame.itemSpacing = 40;

// 상단 타이틀
function createDocTitle(parent, title) {
  const t = figma.createText();
  t.characters = title;
  t.fontSize = 20;
  t.fontName = { family: "Poppins", style: "SemiBold" };
  t.fills = [{ type: 'SOLID', color: { r: 0.10, g: 0.10, b: 0.10 } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  parent.appendChild(t);
  return t;
}

// 4패널 가로 컨테이너
const panelRow = figma.createFrame();
panelRow.layoutMode = "HORIZONTAL";
panelRow.primaryAxisSizingMode = "FIXED";
panelRow.counterAxisSizingMode = "AUTO";
panelRow.resize(1320, 10); // 좌우 패딩 60×2 제외
panelRow.counterAxisSizingMode = "AUTO";
panelRow.itemSpacing = 16;
panelRow.fills = [];
docFrame.appendChild(panelRow);

// 개별 패널
function createDocPanel(parent, panelTitle, bodyText, flexGrow) {
  const panel = figma.createFrame();
  panel.layoutMode = "VERTICAL";
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";
  panel.resize(300, 10);
  panel.primaryAxisSizingMode = "AUTO";
  panel.paddingTop = 20; panel.paddingBottom = 20;
  panel.paddingLeft = 20; panel.paddingRight = 20;
  panel.itemSpacing = 12;
  panel.cornerRadius = 6;
  panel.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
  panel.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  panel.strokeWeight = 1;
  if (flexGrow) panel.layoutGrow = 1;

  // 패널 헤더
  const header = figma.createText();
  header.characters = panelTitle;
  header.fontSize = 11;
  header.fontName = { family: "Poppins", style: "SemiBold" };
  header.fills = [{ type: 'SOLID', color: { r: 0.40, g: 0.40, b: 0.40 } }];
  header.textAutoResize = "WIDTH_AND_HEIGHT";
  panel.appendChild(header);

  // 구분선
  const divider = figma.createRectangle();
  divider.resize(260, 1);
  divider.fills = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  panel.appendChild(divider);

  // 본문
  const body = figma.createText();
  body.characters = bodyText;
  body.fontSize = 13;
  body.fontName = { family: "Pretendard", style: "Regular" };
  body.fills = [{ type: 'SOLID', color: { r: 0.20, g: 0.20, b: 0.20 } }];
  body.lineHeight = { value: 180, unit: "PERCENT" };
  body.textAutoResize = "WIDTH_AND_HEIGHT";
  panel.appendChild(body);

  parent.appendChild(panel);
  return panel;
}

// HISTORY 테이블
function createHistoryTable(parent, rows) {
  // rows: [{ date, version, description }]
  const table = figma.createFrame();
  table.layoutMode = "VERTICAL";
  table.primaryAxisSizingMode = "AUTO";
  table.counterAxisSizingMode = "FIXED";
  table.resize(1320, 10);
  table.primaryAxisSizingMode = "AUTO";
  table.fills = [];
  table.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  table.strokeWeight = 1;
  table.cornerRadius = 6;
  table.clipsContent = true;

  // 헤더 행
  const COLS = [{ label: "DATE", w: 120 }, { label: "TITLE", w: 200 }, { label: "DESCRIPTION", w: 1000 }];
  const headerRow = figma.createFrame();
  headerRow.layoutMode = "HORIZONTAL";
  headerRow.primaryAxisSizingMode = "FIXED";
  headerRow.counterAxisSizingMode = "FIXED";
  headerRow.resize(1320, 36);
  headerRow.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
  table.appendChild(headerRow);

  COLS.forEach(col => {
    const cell = figma.createFrame();
    cell.resize(col.w, 36);
    cell.layoutMode = "HORIZONTAL";
    cell.paddingLeft = 16; cell.paddingRight = 16;
    cell.primaryAxisAlignItems = "CENTER";
    cell.counterAxisAlignItems = "CENTER";
    cell.fills = [];
    cell.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
    cell.strokeWeight = 1;
    const t = figma.createText();
    t.characters = col.label;
    t.fontSize = 11;
    t.fontName = { family: "Poppins", style: "SemiBold" };
    t.fills = [{ type: 'SOLID', color: { r: 0.40, g: 0.40, b: 0.40 } }];
    t.textAutoResize = "WIDTH_AND_HEIGHT";
    cell.appendChild(t);
    headerRow.appendChild(cell);
  });

  // 데이터 행
  rows.forEach(row => {
    const dataRow = figma.createFrame();
    dataRow.layoutMode = "HORIZONTAL";
    dataRow.primaryAxisSizingMode = "FIXED";
    dataRow.counterAxisSizingMode = "FIXED";
    dataRow.resize(1320, 36);
    dataRow.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    table.appendChild(dataRow);

    [{ val: row.date, w: 120 }, { val: row.title, w: 200 }, { val: row.description, w: 1000 }].forEach(d => {
      const cell = figma.createFrame();
      cell.resize(d.w, 36);
      cell.layoutMode = "HORIZONTAL";
      cell.paddingLeft = 16; cell.paddingRight = 16;
      cell.primaryAxisAlignItems = "CENTER";
      cell.counterAxisAlignItems = "CENTER";
      cell.fills = [];
      cell.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
      cell.strokeWeight = 1;
      const t = figma.createText();
      t.characters = d.val;
      t.fontSize = 12;
      t.fontName = { family: "Pretendard", style: "Regular" };
      t.fills = [{ type: 'SOLID', color: { r: 0.20, g: 0.20, b: 0.20 } }];
      t.textAutoResize = "WIDTH_AND_HEIGHT";
      cell.appendChild(t);
      dataRow.appendChild(cell);
    });
  });

  parent.appendChild(table);
  return table;
}
```

### HISTORY 초기 행

문서 페이지 생성 시 첫 번째 행은 항상 자동 삽입:

```javascript
createHistoryTable(docFrame, [
  { date: "YYYY-MM-DD", version: "v0.1", description: "초안 작성" }
]);
```

날짜는 오늘 날짜 기준. 이후 변경 시 행 추가.

---

## AI 느낌 배제 규칙

- 이모지 아이콘 사용 금지 (✅, ⚠️, 🔔 등)
- 챗봇 말풍선 UI 지양
- 과도한 불릿 나열 지양
- 컬러 그라디언트/글로우 효과 금지
- 아이콘 = 회색 원/사각형 플레이스홀더
- 여백 활용, 명확한 정보 위계

---

## 주의사항

- IA 차트, 플로우 차트는 `layoutMode = "NONE"` (절대 좌표) — 나머지는 Auto Layout
- 흑백 규칙 절대 위반 금지
- 각 단계 완료 후 `get_screenshot`으로 검증 필수
- 어드민/대시보드/복잡한 폼 등 범위 외 화면은 사용자에게 명시적으로 고지
- Jira 티켓 생성 전 반드시 Atlassian MCP 인증 상태 확인
