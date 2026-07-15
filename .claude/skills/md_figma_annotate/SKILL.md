---
name: md_figma_annotate
description: "기존 Figma 프레임에 native annotation 추가/수정/삭제. 'annotation 달아줘', '여기에 annotation', Figma URL + 'annotation', '전체 annotation 지워줘'에서 트리거."
user_invocable: true
---

# md_figma_annotate 스킬

기존 Figma 프레임에 **native annotation**을 추가·수정·삭제합니다.

신규 STRUCTURE 섹션 → `/md_figma_structure` 사용.
신규 FEATURE 섹션 → `/md_figma_feature` 사용.

---

## 트리거 조건

```
"annotation 달아줘"
"여기에 annotation"
[Figma URL] + "annotation 추가해줘"
"전체 annotation 지워줘"
"annotation 수정해줘"
"annotation 없애줘"
```

---

## 작업 모드 (4가지)

```
A — 추가    : 특정 노드에 annotation 신규 추가
B — 수정    : 기존 annotation 내용 변경
C — 단건 삭제 : 특정 노드 annotation 제거
D — 일괄 삭제 : 섹션/프레임 단위 재귀 전체 삭제
```

입력을 받으면 즉시 모드를 판단한다. 모호하면 한 줄 확인 후 진행.

---

## 공통 사전 작업

```javascript
// 1. 페이지 전환 (getNodeById 전 필수)
await figma.setCurrentPageAsync(targetPage);

// 2. 폰트 사전 로드 (text 쓰기 전 필수)
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "Medium" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });

// 3. 노드 구조 확인 (get_screenshot 또는 children 조회)
const target = figma.getNodeById('NODE_ID');
```

---

## 사전 탐색 프로토콜 — annotation 추가 전 필수 (건너뛰기 금지)

annotation을 달기 전에 대상 프레임의 버튼·인터랙션 요소를 **반드시 스캔 먼저** 실행한다.
버튼명·노드 ID 추측 사용 금지. 이전 세션 메모 ID도 검증 없이 사용 금지.

### Step 1 — 전체 노드 스캔 (재귀 패턴 사용)

```javascript
// ✅ 필수 패턴 — 'children' in node guard 포함
function scanNodes(node, results, depth) {
  if (depth > 8) return;
  results.push({
    id: node.id,
    name: node.name,
    type: node.type,
    depth,
    chars: node.type === 'TEXT' ? node.characters?.substring(0, 50) : undefined,
    parentName: node.parent?.name
  });
  if ('children' in node) { // TEXT 노드에는 children 없음 → guard 필수
    node.children.forEach(c => scanNodes(c, results, depth + 1));
  }
}

const allNodes = [];
scanNodes(targetFrame, allNodes, 0);

// 버튼 후보 필터 — FRAME 타입 + 인터랙션 이름 키워드
const buttonCandidates = allNodes.filter(n =>
  (n.type === 'FRAME' || n.type === 'INSTANCE') &&
  /Button|btn|CTA|Edit|Save|Connect|Disconnect|Delete|Change|Download|Cancel|Confirm|Pause|Resume|Retry/i.test(n.name)
);

return JSON.stringify({ total: allNodes.length, buttonCandidates }, null, 2);
```

**금지:**
- `slice(0, 20)`, `slice(20, 50)` 방식으로 나눠서 여러 번 호출 → 전체를 한 번에 필터링
- `node.findAll()` 결과를 다시 `findAll()`로 재호출 → TypeError 발생
- 버튼명 추측 검색 (`n.name === 'Complete'` 등) → 전체 스캔 후 필터

### Step 2 — 노드 ID 검증 (annotation 추가 직전)

```javascript
// annotation 추가 전 ID → name 반드시 확인
const node = figma.getNodeById('NODE_ID');
console.log(`검증: id="${node?.id}" name="${node?.name}" type="${node?.type}"`);
// 예상 이름과 다르면 → 탐색 재실행, 추측으로 진행 금지
```

### Step 3 — 중복 이름 노드 처리

같은 이름의 버튼이 여러 개인 경우(모달 내 동일 버튼명 등):

```javascript
const duplicates = allNodes.filter(n => n.name === '버튼명');
if (duplicates.length > 1) {
  // 부모 프레임명으로 위치 구분
  duplicates.forEach(n => {
    console.log(`id=${n.id} / depth=${n.depth} / parent="${n.parentName}"`);
  });
  // 의도한 위치의 노드 ID만 선택
}
```

### Step 4 — get_screenshot 전 섹션 ID 실시간 조회

```javascript
// ❌ 금지 — 추측 ID로 screenshot → 43×11px 반환 가능
// get_screenshot({ nodeId: '2862:1383' })  // 실제론 tiny thumbnail

// ✅ 올바름 — 이름으로 실시간 조회 후 screenshot
const section = page.children.find(n => n.name === 'FEATURE_PASSWORD_CHANGE');
console.log(section.id); // 이 ID로 screenshot 호출
```

---

## 모드 A — Annotation 추가

### 단건 추가

```javascript
const node = figma.getNodeById('NODE_ID');

// SECTION 타입 guard (필수)
if (node.type === 'SECTION') {
  console.error("SECTION은 annotation 불가");
  return;
}

node.annotations = [{
  label: "[요소명]\n- 의도 설명\n- 상태:\n  - 호버: ...\n  - 클릭: ..."
}];
```

### 여러 노드 동시 추가

```javascript
const annotationMap = [
  { nodeId: 'ID_1', label: "annotation 1" },
  { nodeId: 'ID_2', label: "annotation 2" },
];

for (const { nodeId, label } of annotationMap) {
  const node = figma.getNodeById(nodeId);
  if (!node || node.type === 'SECTION') continue;
  node.annotations = [{ label }];
}
```

---

## 모드 B — Annotation 수정

```javascript
const node = figma.getNodeById('NODE_ID');

// 기존 annotation 읽기
const existing = node.annotations?.[0]?.label ?? '';
console.log('기존:', existing);

// 새 내용으로 교체
node.annotations = [{
  label: "수정된 annotation 내용"
}];
```

---

## 모드 C — 단건 삭제

```javascript
const node = figma.getNodeById('NODE_ID');
if (node && node.type !== 'SECTION') {
  node.annotations = [];
}
```

---

## 모드 D — 일괄 삭제 (재귀)

STRUCTURE WF를 clone한 후 FEATURE 섹션 만들 때, 또는 섹션 전체 초기화 시 사용.

```javascript
const ANNOTATABLE_TYPES = new Set([
  'FRAME','COMPONENT','INSTANCE','TEXT','RECTANGLE',
  'ELLIPSE','VECTOR','LINE','POLYGON','STAR','GROUP','BOOLEAN_OPERATION'
]);

function clearAnnotations(node) {
  // SECTION 타입은 .annotations 프로퍼티 없음
  if (node.type !== 'SECTION' && ANNOTATABLE_TYPES.has(node.type)) {
    try {
      if (node.annotations && node.annotations.length > 0) {
        node.annotations = [];
      }
    } catch(e) {}
  }
  if ('children' in node) {
    node.children.forEach(child => clearAnnotations(child));
  }
}

// 사용 예 — 섹션 전체 삭제
const section = figma.getNodeById('SECTION_ID');
section.children.forEach(child => clearAnnotations(child));

// 사용 예 — 프레임 단건 삭제
const frame = figma.getNodeById('FRAME_ID');
clearAnnotations(frame);
```

---

## Annotation 언어 규칙

**모든 annotation은 한국어로 작성.**
- UI 레이블, 버튼명, 상태값 등 UI에 실제 표시되는 텍스트는 영문 그대로 유지
- 설명 문장은 전부 한국어

```
✅ [Stop Subscription 버튼]
   - 구독을 중단하는 플로우를 시작하는 버튼
   - 상태:
     - 클릭: Stop Subscription 모달 오픈

❌ [Stop Subscription Button]
   - Button to start the subscription stop flow
```

---

## STRUCTURE vs FEATURE 형식 구분

### STRUCTURE annotation 형식

```
[요소명]
- [의도 설명]
- 상태:
  - 기본: ...
  - 호버: ...
  - 클릭: ...
  - Disabled: [비활성 조건]
- 옵션:
  - 옵션 1
  - 옵션 2
- 조건:
  - [조건]: [결과]
```

### FEATURE annotation 형식

```
→ [버튼명] 클릭 시 [결과]
```

또는 델타:
```
→ [사용자 액션] — [화면 변화]
+ [요소명] — [등장 조건]
× [요소명] — [사라지는 조건]
```

### 어떤 형식을 사용할지 판단 기준

| 대상 | 형식 |
|------|------|
| STRUCTURE 섹션의 컴포넌트 | STRUCTURE 형식 |
| FEATURE 섹션의 action button | FEATURE 형식 (`→ 클릭 시 ...`) |
| FEATURE 섹션의 end state 프레임 | annotation 없음 |
| 플로우 중간 변화 요소 | 델타 형식 (`→/+/×`) |

---

## 에러 처리

### SECTION 타입 에러

```javascript
// 에러: "node.annotations: no such property 'annotations' on SECTION node"
// 해결: SECTION 타입 guard 적용
if (node.type === 'SECTION') return; // 건너뜀
```

### findAll on TEXT node TypeError

```javascript
// 에러: "TypeError: node.findAll: no such property 'findAll' on TEXT node"
// 원인: findAll 결과 배열을 iterate하면서 TEXT 노드에 다시 findAll 호출

// ❌ 잘못된 패턴
const nodes = frame.findAll(n => true);
nodes.forEach(n => {
  const sub = n.findAll(x => x.type === 'TEXT'); // ← TEXT에서 에러
});

// ✅ 해결 — 자체 구현 재귀 사용 (상단 scanNodes 함수 참조)
// 'children' in node guard로 TEXT 노드 건너뜀
```

### Screenshot 43×11px (의미없는 썸네일)

```javascript
// 원인: 잘못된 nodeId 사용 (TEXT 노드, 행 프레임, 존재하지 않는 ID 등)
// 증상: width=43, height=11 처럼 매우 작은 이미지 반환

// ❌ 원인
get_screenshot({ nodeId: '2862:1383' }); // 실제론 텍스트 노드

// ✅ 해결 — 반드시 섹션/WF 프레임 ID 실시간 조회 후 사용
const section = page.children.find(n => n.name === 'FEATURE_XXX');
// 조회된 section.id로 screenshot 호출
```

### 폰트 로드 에러

```javascript
// 에러: "font not loaded: Poppins Regular"
// 해결: use_figma 호출 시작에 loadFontAsync 추가
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
```

### 노드 null

```javascript
// 원인: setCurrentPageAsync 없이 getNodeById 호출
// 해결: 반드시 setCurrentPageAsync 먼저
await figma.setCurrentPageAsync(page);
const node = figma.getNodeById('ID'); // 이제 정상 반환
```

---

## 검증

작업 완료 후 `get_screenshot`으로 확인:
```
□ 추가한 annotation이 정확한 노드에 달렸는가
□ 내용(한국어, 형식)이 올바른가
□ SECTION 타입 에러 없이 완료됐는가
□ 삭제 작업 시 대상 annotation이 모두 제거됐는가
```

---

## 참조 파일

| 파일 | 용도 |
|------|------|
| `.claude/rules/figma-annotation.md` | Annotation 형식 규칙 (전체) |
| `.claude/skills/md_figma_structure/SKILL.md` | STRUCTURE annotation 예시 |
| `.claude/skills/md_figma_feature/SKILL.md` | FEATURE annotation 예시 + clearAnnotations 코드 |
