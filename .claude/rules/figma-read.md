# Figma 화면 읽기 프로토콜

Figma 화면을 읽고 분석하는 모든 행위에 적용. 와이어프레임 작업 전, Description 작성 전 반드시 이 프로토콜을 따른다.

---

## 파이프라인 연계

```
이전 단계: 없음 (워크플로우 시작점)
이 단계 output: 컴포넌트 목록 + 측정값 + 스펙 매트릭스
다음 단계: figma-description.md (컴포넌트 목록 → Q1~Q3 판단 input)
           또는 figma-draw.md (측정값 → 그리기 참조값)
```

---

## 최우선 원칙

**참조 없이는 아무것도 하지 않는다.**
추측으로 쓴 수치는 전부 틀린다 — 색상, 패딩, 폰트, 정렬 전부.
참조 프레임을 먼저 측정하지 않으면 작업을 시작하지 않는다.

---

## 1. 읽기 시작 전 필수 체크

```
□ 참조 프레임 URL 또는 node-id를 유저에게 받았는가?
□ 어떤 페이지에 있는지 확인했는가? (setCurrentPageAsync 필수)
□ 이전 세션 node ID를 재사용하려 하는가? → 실존 확인 필수
```

하나라도 NO이면 → 읽기 시작 금지.

### 1.1 페이지 전환 규칙

```javascript
// ✅ 올바름 — 이름으로 실시간 조회
const page = figma.root.children.find(p => p.name === 'MyPage');
await figma.setCurrentPageAsync(page);

// ❌ 금지 — ID 하드코딩
figma.root.children.find(p => p.id === '237:3133');
```

- `getNodeById`는 currentPage 로드 없이 다른 페이지 노드 접근 불가 → null 반환
- 반드시 `setCurrentPageAsync` 먼저 실행

### 1.2 이전 세션 node ID 검증

이전 세션 요약의 node ID는 신뢰 불가. 반드시 실존 확인 후 사용.

```javascript
// ✅ 올바름 — 실존 확인
const node = figma.getNodeById('4805:7284');
if (!node) return { error: 'Node not found' };

// ✅ 더 나은 방법 — 이름으로 탐색
const section = page.children.find(c => c.name === 'Invited Projects');
```

---

## 2. 분할 읽기 원칙

`use_figma`는 **20kb 출력 상한**이 있다. 대형 프레임을 한 번에 읽으면 중간에 잘려서 섹션이 조용히 누락된다. 잘려도 에러가 없어서 발견이 늦다.

### 2.1 3단계 분할 읽기

```
Step 1 — top-level children만 먼저 (ID + name만)
Step 2 — 섹션 이름·ID 목록을 유저에게 보고
Step 3 — 섹션별 개별 use_figma 호출로 상세 내용 읽기
```

### 2.2 Step 1 코드 패턴

```javascript
// top-level children만 추출 — 전체 트리 덤프 금지
const frame = figma.getNodeById('참조_노드_ID');
return JSON.stringify(
  frame.children.map(c => ({ id: c.id, name: c.name, type: c.type }))
);
```

### 2.3 Step 3 코드 패턴 — 섹션별 개별 호출

```javascript
// 섹션 ID로 개별 접근 — 필요한 속성만 추출
const section = figma.getNodeById('섹션_ID');
// 전체 트리가 아닌 필요한 속성만 return
```

### 2.4 20kb 잘림 의심 판별

읽기 결과에서 예상 섹션 수와 실제 반환된 섹션 수가 다르면 잘림 의심.
→ top-level 목록 재추출 후 섹션 수 재확인.

---

## 3. 측정 항목

컴포넌트 하나를 만들기 전에 아래를 전부 측정한다. 빠짐 = 추측 = 오류.

### 3.1 필수 측정 항목 테이블

| 카테고리 | 항목 | 측정 방법 |
|---|---|---|
| **배경·테두리** | fills (배경색) | `node.fills[0].color` — r/g/b 소수 전체 복사 |
| | strokes (테두리) | `node.strokes[0].color` + `node.strokeWeight` |
| | cornerRadius | `node.cornerRadius` |
| **레이아웃** | layoutMode | `node.layoutMode` (VERTICAL / HORIZONTAL / NONE) |
| | primaryAxisSizingMode | `node.primaryAxisSizingMode` (AUTO vs FIXED) |
| | counterAxisSizingMode | `node.counterAxisSizingMode` |
| | primaryAxisAlignItems | `node.primaryAxisAlignItems` (MIN / CENTER / MAX) |
| | counterAxisAlignItems | `node.counterAxisAlignItems` |
| **간격** | padding | `paddingTop / Bottom / Left / Right` 각각 개별 (상하 ≠ 좌우일 수 있음) |
| | itemSpacing | `node.itemSpacing` |
| **크기** | width / height | `node.width`, `node.height` |
| | layoutSizingHorizontal | HUG / FILL / FIXED 구분 |
| **텍스트** | 폰트 | `textNode.fontName.family` + `textNode.fontName.style` |
| | 폰트 크기 | `textNode.fontSize` |
| | 텍스트 색상 | `textNode.fills[0].color` — r/g/b 소수 전체 복사 |
| **기타** | clipsContent | true / false 실측 (기본값 true) |

### 3.2 측정 코드 패턴

```javascript
// 기존 노드에서 스타일 읽기 — 추측하지 않는다
const segs = existingText.getStyledTextSegments(['fontName', 'fills', 'fontSize']);
const font = segs[0].fontName;     // { family: 'Poppins', style: 'Medium' }
const color = segs[0].fills[0].color; // { r: 0.1, g: 0.1, b: 0.1 }
const size = segs[0].fontSize;     // 18

const spacing = existingFrame.itemSpacing; // 6
const padding = existingFrame.paddingTop;  // 8
```

---

## 4. 색상 정밀도

Figma 내부 색상은 `r: 0.2705882489681244` 같은 정밀값이다.

### 4.1 반올림 금지

```javascript
// ❌ 금지 — 추측 반올림
{ r: 0.27, g: 0.27, b: 0.27 }

// ✅ 올바름 — 실측 소수 그대로
{ r: 0.2705882489681244, g: 0.2705882489681244, b: 0.2705882489681244 }
```

### 4.2 HEX → RGB 변환

새 색상을 정의할 때는 4자리까지:

```javascript
// HEX #454545 → RGB
const r = Math.round((0x45 / 255) * 10000) / 10000; // 0.2706
```

### 4.3 DS 토큰 색상도 실측 우선

`figma-wireframe-ds.md` 테이블 값은 참고용. 실제 파일에서 측정한 값과 다르면 **실측값 우선 적용**.

---

## 5. 스펙 매트릭스 — 유저 확인 없이 진행 금지

읽기 완료 후 아래 형식으로 출력하고 유저 OK를 기다린다.

### 5.1 출력 형식

```
[작업명] 스펙 확인

섹션 목록: (번호 / 섹션명 / 주요 내용)
조건 분기: (케이스별 ON/OFF 항목)
참조 프레임: (사용한 node-id)

측정 완료 항목:
- Board Header: fills / stroke / padding / font ✓
- Form Row: label width / value sizing ✓
- Card: bg / border / radius / padding ✓
- ...

→ 이 스펙으로 진행할까요?
```

### 5.2 확인 흐름

```
유저 OK → 다음 단계 진행 (description 또는 draw)
수정 요청 → 반영 후 매트릭스 재출력
YES 없이 진행 → 금지
```

---

## 6. 컴포넌트 목록 → Description 연계

읽기 결과에서 추출한 컴포넌트 목록은 `figma-description.md` Phase 1의 입력이 된다.

### 6.1 읽기에서 넘기는 정보

| 항목 | Description Phase 1에서 사용 |
|---|---|
| UI 요소 이름 목록 | Q1~Q3 판단 대상 |
| 각 요소의 타입 (카드/버튼/텍스트/입력) | Q1 (독립 영역) 판단 |
| 인터랙션 여부 | Q3 (인터랙션) 판단 |
| API 연동 여부 | Loading/Empty/Error 필수 여부 결정 |

### 6.2 연계 예시

```
READ output:
  요소 목록: Plan Badge, License Card, CTA Button, Plan Name 텍스트, Expiry Date 텍스트

  ↓ figma-description.md Phase 1에 전달

DESCRIPTION Phase 1:
  | 요소 | Q1 | Q2 | Q3 | 결과 |
  | Plan Badge | X | O | X | L1 |
  | CTA Button | X | O | O | L1 |
  | Plan Name | X | X | X | L2 |
  ...
```

---

## 7. 절대 금지 패턴

### 패턴 1 — 참조 없이 그리기 시작

```
❌ 유저가 "이 화면 그려줘"라고 하자마자 바로 코드 작성
✅ 참조 프레임 URL 요청 → 분할 읽기 → 스펙 매트릭스 확인 → 그리기
```

### 패턴 2 — 20kb 잘림 무시

```
❌ 읽기 결과에서 섹션 3개를 기대했는데 2개만 왔지만 그냥 진행
✅ top-level 목록 재추출 → 섹션 수 확인 → 누락 섹션 개별 재호출
```

### 패턴 3 — 색상 반올림

```
❌ { r: 0.27, g: 0.27, b: 0.27 }  ← 추측
✅ { r: 0.2705882489681244, ... }  ← 실측
```

### 패턴 4 — 유저 확인 없이 진행

```
❌ 스펙 매트릭스 출력 없이 바로 draw 단계로
✅ 매트릭스 출력 → 유저 OK → draw 단계
```

### 패턴 5 — 이전 세션 node ID 맹신

```
❌ 이전 세션에서 "4805:7284가 Description 프레임"이라고 했으니 바로 사용
✅ getNodeById + null 체크 → 실존 확인 후 사용
```

### 패턴 6 — 전체 트리 덤프

```
❌ 프레임 전체를 JSON.stringify(node, null, 2)로 반환
✅ 필요한 속성만 선택적 추출 (id, name, type, width, height 등)
```

---

## 8. QA 체크리스트

읽기 완료 후 다음 단계로 넘어가기 전 확인:

### 분할 읽기
- [ ] top-level children 목록을 먼저 추출했는가?
- [ ] 섹션별 개별 호출로 상세 읽기를 완료했는가?
- [ ] 예상 섹션 수와 실제 반환 섹션 수가 일치하는가?

### 측정
- [ ] fills, strokes, cornerRadius를 측정했는가?
- [ ] layoutMode, sizing mode를 측정했는가?
- [ ] padding 4방향을 개별 측정했는가?
- [ ] font family + style + size를 측정했는가?
- [ ] 색상이 실측 소수값 그대로인가? (반올림 없음)

### 노드 접근
- [ ] setCurrentPageAsync로 페이지를 전환했는가?
- [ ] 이전 세션 node ID를 재사용하는 경우 실존 확인을 했는가?
- [ ] getNodeById 결과에 null 체크를 했는가?

### 연계
- [ ] 스펙 매트릭스를 유저에게 출력하고 OK를 받았는가?
- [ ] 컴포넌트 목록이 다음 단계 (description 또는 draw)에 전달 가능한 형태인가?
