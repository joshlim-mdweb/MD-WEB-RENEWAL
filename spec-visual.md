# Figma 시각 토큰 (spec-visual.md)

`spec.md`의 참조 파일. 와이어프레임, Description, PRD 문서에 쓰는 색, 폰트, 컴포넌트의 시각 규격을 정의한다. 구조 규격(계층, 간격, 네이밍)은 `spec.md`가 정본이다.

## 버전 관리표

| 버전 | 날짜 | 작성자 | 변경 내용 |
|---|---|---|---|
| 1.0.00 | 2026-09-01 | Josh Lim | 최초 작성: figma-wireframe-ds.md의 시각 토큰과 컴포넌트 함수 이관, Description 전용 색 추가 |
| 1.1.00 | 2026-09-01 | Josh Lim | Description 검정을 desc.ink #18181E로 통일 (노트 제목, 중요 강조), 버전 표기 3자리 전환 |
| 1.2.00 | 2026-09-01 | Josh Lim | 캔버스 상태 Border 토큰 3종 추가 (status.new, status.modified, status.keep). EMAIL CONTENTS v2 필드에서 확정 |
| 1.3.00 | 2026-09-01 | Josh Lim | 와이어프레임 셸 색 변경: Outer 배경 흰색 전환, Screen과 Description 패널과 Description Header에 #E6E6E6 2px border (§3 와이어프레임 셸 절 신설) |

---

## 1. 시맨틱 컬러

팔레트 값이 아닌 **용도** 기준으로 색을 고른다. 자의적 색상 지정 금지. 실측과 표 값이 다르면 실측 우선.

### Surface

| 토큰 | HEX | Figma RGB | 사용처 |
|---|---|---|---|
| `surface.page` | `#FFFFFF` | `{r:1, g:1, b:1}` | 화면, 스크린 배경 |
| `surface.card` | `#FFFFFF` | `{r:1, g:1, b:1}` | 카드 배경 (border로 구분) |
| `surface.input` | `#F5F5F5` | `{r:0.96, g:0.96, b:0.96}` | 입력 필드, 드롭다운, 선택지 배경 |
| `surface.subtle` | `#E5E5E5` | `{r:0.90, g:0.90, b:0.90}` | 비활성 영역, 서브 영역 |
| `surface.doc` | `#0A0A0A` | `{r:0.0392, g:0.0392, b:0.0392}` | PRD, 기능명세, Version Table 문서 프레임 배경 |

### Border

| 토큰 | HEX | Figma RGB | 사용처 |
|---|---|---|---|
| `border.default` | `#D1D1D1` | `{r:0.82, g:0.82, b:0.82}` | 카드, 인풋, 일반 컨테이너 |
| `border.strong` | `#999999` | `{r:0.60, g:0.60, b:0.60}` | 선택됨, 포커스 |
| `border.faint` | `#E5E5E5` | `{r:0.90, g:0.90, b:0.90}` | 비활성, 구분선 |
| `border.doc-row` | `#292929` | `{r:0.1608, g:0.1608, b:0.1608}` | 문서 표의 행 하단 보더 |

### Text

| 토큰 | HEX | Figma RGB | 사용처 |
|---|---|---|---|
| `text.heading` | `#1A1A1A` | `{r:0.10, g:0.10, b:0.10}` | 타이틀, 강조 레이블 |
| `text.body` | `#333333` | `{r:0.20, g:0.20, b:0.20}` | 본문, 값 텍스트 |
| `text.label` | `#666666` | `{r:0.40, g:0.40, b:0.40}` | 폼 레이블, 보조 설명 |
| `text.muted` | `#999999` | `{r:0.60, g:0.60, b:0.60}` | 비활성 텍스트, 힌트 |
| `text.placeholder` | `#CCCCCC` | `{r:0.80, g:0.80, b:0.80}` | 입력 전 placeholder |
| `text.doc-head` | `#FFFFFF` | `{r:1, g:1, b:1}` | 문서 제목, 표 헤더 |
| `text.doc-label` | `#C7C7C7` | `{r:0.78, g:0.78, b:0.78}` | 문서 표의 식별자, 라벨, 참조 열 |
| `text.doc-body` | `#EBEBEB` | `{r:0.9216, g:0.9216, b:0.9216}` | 문서 표의 본문 열, PRD 본문 |

### State (Screen 내 유채색 허용 예외 3종)

| 토큰 | HEX | 사용처 |
|---|---|---|
| `state.warning-bg` | `#FFF9E6` | 경고 배너 배경 |
| `state.warning-border` | `#E5C84A` | 경고 배너 테두리 |
| `state.error-text` | `#CC3300` | 에러 메시지 텍스트 |

Screen 안에서는 이 3종 외 유채색 금지. 강조는 굵기와 크기로만.

### 캔버스 상태 Border (Outer Frame 전용)

캔버스에서 프레임의 판정 상태를 표시한다. Outer Frame stroke에만 쓴다. Screen 내부 유채색 금지는 그대로 유지된다. 정의 출처: `email-spec.md` §3.1 (EMAIL CONTENTS v2).

| 토큰 | HEX | 굵기 | 사용처 |
|---|---|---|---|
| `status.new` | `#2BA84A` | 8 | 신규 제작 프레임 |
| `status.modified` | `#F5A623` | 8 | 원본 대비 수정된 프레임 |
| `status.keep` | `#D1D1D1` | 2 | 원본 유지 (border.default와 동일 외관) |

### Description 전용

| 토큰 | HEX | Figma RGB | 사용처 |
|---|---|---|---|
| `desc.link` | `#0066CC` | `{r:0, g:0.4, b:0.8}` | 링크, 참조 (2026-09-01 확정) |
| `desc.flag` | `#CC3300` | `{r:0.8, g:0.2, b:0}` | 정책 결정 필요 플래그 |
| `desc.ink` | `#18181E` | `{r:0.0941, g:0.0941, b:0.1176}` | Description 검정 통일: 노트 제목, 중요 강조 (SemiBold와 함께) |
| `desc.badge` | `#E25927` | `{r:0.8863, g:0.3490, b:0.1529}` | Annotation Badge 원형 |

---

## 2. 폰트

**Figma 안에서는 Poppins만 쓴다.** 허용 스타일: Regular, Medium, SemiBold. 한글도 Poppins로 지정하고 Figma fallback에 맡긴다. Bold, Italic, Inter, Pretendard 금지. 스크립트 시작에서 3종 사전 로드, 대상 페이지에 기존 Inter 노드가 있으면 Inter Regular도 로드.

| 위치 | 폰트 | 색 |
|---|---|---|
| TITLE 텍스트 | Medium 60 | 오렌지 `{r:1, g:0.5411764979362488, b:0}` |
| Board Header Main Label | Medium 18 | `{r:0.27, g:0.27, b:0.27}` |
| Board Header Sub Label | Regular 18 | `{r:0.52, g:0.52, b:0.52}` |
| 카드 타이틀 | Medium 14~16 | `text.heading` |
| 본문, 폼 텍스트 | Regular 14 | `text.body` |
| 보조 텍스트, 배지 | Regular 12 | `text.label` |
| Description 노트 제목 | Medium 13 | `desc.ink` |
| Description 본문 | Regular 12 | `text.label` |
| Annotation Badge 번호 | Medium 12 | 흰색 |
| 문서 제목 (PRD, 표) | Medium 32 | `text.doc-head` |
| 문서 섹션 헤딩 | Medium 20 | `text.doc-head` |
| 문서 표 헤더 | Medium 14 | `text.doc-head` |
| 문서 표 Row, PRD 본문 | Regular 14 | `text.doc-label` 또는 `text.doc-body` |

---

## 3. 컴포넌트 토큰

### 와이어프레임 셸 (Outer, Screen, Description)

2026-09-01 변경: 구 회색 배경(#F5F5F5) Outer를 폐기하고 흰 배경 + 내부 패널 border 구분으로 전환. 코드 정본은 `spec.md` §11.3.

```
Outer               bg #FFFFFF / radius 12 / stroke = 상태 Border (아래 status.* 토큰, 상태 표시 없는 일반 화면은 border.default 2)
Board Header        bg #FFFFFF / stroke #E6E6E6 2 / radius 8
Description Header  bg #FFFFFF / stroke #E6E6E6 2 / radius 8
Screen              bg #FFFFFF / stroke #E6E6E6 2 / radius 8
Description 패널    bg #FFFFFF / stroke #E6E6E6 2 / radius 8
```

### Card (섹션 컨테이너)

```
bg surface.card / border 1 border.default / radius 8 / pad 16
FILL × HUG / VERTICAL / 행 간 gap: 정보 카드 24, 콤팩트 12 (spec.md §3.2)
```

```javascript
function createCard(parent, name, gap) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'VERTICAL';
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.itemSpacing = gap || 24;
  f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = 16;
  f.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  f.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.82, b: 0.82 } }];
  f.strokeWeight = 1;
  f.cornerRadius = 8;
  parent.appendChild(f);
  f.layoutSizingHorizontal = 'FILL';
  return f;
}
```

### Form Row (폼 한 행)

```
HORIZONTAL / FILL × HUG / primaryAxisAlignItems SPACE_BETWEEN / 인라인 gap 4
레이블 Regular 14 text.label / 값 Regular 14 text.body
```

```javascript
function createFormRow(parent, labelText, valueText) {
  const row = figma.createFrame();
  row.name = labelText;
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';
  row.primaryAxisAlignItems = 'SPACE_BETWEEN';
  row.itemSpacing = 4;
  row.fills = [];
  parent.appendChild(row);
  row.layoutSizingHorizontal = 'FILL';

  const mk = (s, color) => {
    const t = figma.createText();
    t.fontName = { family: 'Poppins', style: 'Regular' };
    t.fontSize = 14;
    t.fills = [{ type: 'SOLID', color }];
    t.characters = s;
    row.appendChild(t);
    return t;
  };
  mk(labelText, { r: 0.40, g: 0.40, b: 0.40 });
  mk(valueText || '', { r: 0.20, g: 0.20, b: 0.20 });
  return row;
}
```

### Input, Dropdown

```
bg surface.input / border 1 border.default / radius 6 / 높이 32 / FILL 폭 / 좌우 pad 10
```

### CTA Button (Primary, Full-width)

```
FILL 폭 × 높이 48 / bg text.heading / 텍스트 흰색 Medium 14 중앙 / radius 6
```

```javascript
function createCTA(parent, label) {
  const btn = figma.createFrame();
  btn.name = 'CTA Button';
  btn.layoutMode = 'HORIZONTAL';
  btn.primaryAxisAlignItems = 'CENTER';
  btn.counterAxisAlignItems = 'CENTER';
  btn.resize(100, 48);
  btn.counterAxisSizingMode = 'FIXED';
  btn.fills = [{ type: 'SOLID', color: { r: 0.10, g: 0.10, b: 0.10 } }];
  btn.cornerRadius = 6;
  parent.appendChild(btn);
  btn.layoutSizingHorizontal = 'FILL';

  const t = figma.createText();
  t.fontName = { family: 'Poppins', style: 'Medium' };
  t.fontSize = 14;
  t.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  t.characters = label;
  btn.appendChild(t);
  return btn;
}
```

### Action Button (Inline, Compact)

카드 내 특정 행에 붙는 액션 버튼. **FILL 폭, 고정 높이 금지.** 텍스트 길이에 따라 폭이 맞춰진다.

```
HUG × HUG / pad 10 / bg text.heading / 텍스트 흰색 Medium 14 / radius 6
```

```javascript
function createActionButton(parent, label) {
  const btn = figma.createFrame();
  btn.name = label;
  btn.layoutMode = 'HORIZONTAL';
  btn.primaryAxisAlignItems = 'CENTER';
  btn.counterAxisAlignItems = 'CENTER';
  btn.primaryAxisSizingMode = 'AUTO';
  btn.counterAxisSizingMode = 'AUTO';
  btn.paddingTop = btn.paddingBottom = btn.paddingLeft = btn.paddingRight = 10;
  btn.fills = [{ type: 'SOLID', color: { r: 0.10, g: 0.10, b: 0.10 } }];
  btn.cornerRadius = 6;
  parent.appendChild(btn);

  const t = figma.createText();
  t.fontName = { family: 'Poppins', style: 'Medium' };
  t.fontSize = 14;
  t.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  t.characters = label;
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  btn.appendChild(t);
  return btn;
}
```

### Badge, Plan Tag

```
HUG 폭 / bg surface.card / border 1 border.default / radius 4 / pad 상하 4 좌우 8
텍스트 Regular 12 text.label
```

**레이블 텍스트는 항상 한 줄.** 고정 폭이 불가피하면 가장 긴 텍스트 케이스 기준으로 폭 설정. 줄바꿈이 생기면 레이블 대신 다른 패턴 검토.

### Notice Banner

```
FILL × HUG / radius 6 / pad 상하 12 좌우 14 / 텍스트 Regular 14 text.body
warning: bg state.warning-bg, border 1 state.warning-border
info: bg surface.input, border 1 border.default
```

### Billing Toggle Card (지불 방식 선택)

```
default: border 1 border.default / radius 8 / pad 12
selected: border 2 border.strong
내부: 타이틀 Medium 14 text.heading + 가격 Regular 13 text.label
```

**순서와 Default 규칙 (변경 금지):** 연간(Annual) 항상 왼쪽 + default 선택(border 2 strong). Monthly 오른쪽 비선택. Monthly 선택 상태를 명시적으로 표현하는 프레임에서만 예외.

### Terms Checkbox Row

```
HORIZONTAL / gap 8 / FILL 폭
체크박스 13×13 rect, border 1 border.default, radius 2 / 텍스트 Regular 14 text.body
```

---

## 4. 상태 표현 원칙

| 상태 | 표현 |
|---|---|
| selected | `border.strong` (배경색 변경 금지) |
| disabled | `border.faint` + `text.muted` |
| error | `state.error-text` 텍스트 |

---

## 관련 문서

- 구조 규격, 간격, 파이프라인: 루트 `spec.md`
