---
id: "OPIN-059"
title: "FlowView Expanded 모드 — 질문 카드 실제 크기 렌더링 + 모드 토글"
priority: "P2"
status: "done"
completed: "2026-04-18"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: []
created: "2026-04-18"
updated: "2026-04-18"
sprint: "W17"
policy_refs: []
code_refs:
  - "src/components/builder/FlowView.tsx"
  - "src/components/builder/QuestionSettings.tsx"
  - "src/lib/store/builder.ts"
  - ".claude/rules/flow-view-pattern.md"
---

## 목적

설문 제작자가 FlowView에서 질문 카드를 실제 편집 크기로 보면서 전체 흐름을 파악할 수 있게 한다.
현재 compact 노드(240×107px) 방식으로는 질문 내용·옵션·분기 조건이 카드 안에 들어오지 않아
피그마 슬라이드처럼 "전체 구조를 한눈에 보는" 경험을 줄 수 없다.

## 현황

### 현재 FlowView (compact 모드)

- `NODE_W = 240`, `NODE_H = 107` — 요약 카드만 렌더링
- 노드 클릭 시 우측 패널(`QuestionSettings variant="panel"`)에서 편집
- 섹션 컨테이너, 베지어 엣지, 조건부 분기 뱃지 구현 완료
- 두 가지 레이아웃 함수: `computeFlowLayout` (horizontal), `computeVerticalFlowLayout` (vertical)
- `PanCanvas` 컴포넌트: pan(space+drag) + zoom(wheel) 구현 완료
- `flowDirection`: `"vertical" | "horizontal"` — builder store에 저장됨

### 재사용 가능 코드

- `QuestionSettings variant="center"` — 이미 목록 뷰에서 카드 크기 렌더링에 사용 중
  - `QuestionEditor` 포함, `TextareaWithFocus` 포함
  - center 변형은 `max-w-[900px]` 너비에서 동작
- `PanCanvas` — zoom/pan 인프라 그대로 사용 가능
- 섹션 컨테이너 렌더링 로직 재사용 가능

## 완료 조건 (Definition of Done)

- [ ] FlowView 우측 상단 컨트롤 바에 "compact / expanded" 토글 버튼 추가
- [ ] **Compact 모드** — 현재 동작 동일 (변경 없음, regression 없음)
- [ ] **Expanded 모드** — 각 질문 노드를 `QuestionEditor` 기반의 실제 카드로 렌더링
  - 카드 너비: 400px (compact NODE_W 240px → expanded)
  - 카드 높이: 콘텐츠 기반 auto (최소 200px)
  - 카드 배경/border: `QuestionSettings center variant` 스타일 그대로
  - 질문 제목 편집, 타입 드롭다운, 옵션 편집 모두 인라인 동작
- [ ] Expanded 모드에서 섹션 컨테이너, 베지어 엣지, 조건 뱃지 그대로 표시
- [ ] Expanded 모드에서 레이아웃 좌표 재계산: NODE_W=400, NODE_H=auto(height 측정 후 엣지 연결)
- [ ] 줌 아웃 transform scale로 전체 오버뷰 가능 (기존 PanCanvas zoom 유지)
- [ ] 모드 상태 `flowCardMode: "compact" | "expanded"` 를 builder store에 추가
- [ ] TypeScript strict 통과
- [ ] `npm run build` 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 레퍼런스 패턴

| 서비스                         | 패턴                                                        | OPINION 적용 포인트                                                          |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Figma                          | 프레임 오버뷰 — 실제 크기 컴포넌트를 캔버스에서 한눈에 파악 | Expanded 모드의 핵심 레퍼런스. 줌아웃하면 전체 구조 파악, 줌인하면 편집 가능 |
| Typeform Logic                 | 질문 블록을 실제 미리보기 크기로 플로우 뷰에 렌더링         | 질문 옵션이 카드 안에 보이는 패턴                                            |
| Notion Database — Gallery View | 카드 밀도 토글 (compact / full)                             | 동일한 데이터를 두 가지 밀도로 전환하는 UX 패턴                              |
| Miro / Whimsical               | 스티키노트 + 연결선 — 실제 콘텐츠 크기 카드                 | 카드가 크더라도 연결선이 유지되는 레이아웃 패턴                              |

### 핵심 UX 결정

- **토글 위치**: 기존 우측 상단 컨트롤 바에 추가 — "compact | expanded" 세그먼트 컨트롤
  - 이유: 방향(vertical/horizontal) 토글과 동일 패턴, 사용자가 이미 익숙한 위치
- **Expanded 카드 편집**: 인라인 편집 (노드 클릭 후 우측 패널 분리 방식 아님)
  - 이유: expanded 모드의 핵심 가치는 "카드 안에서 직접 편집" — 패널 방식이면 compact와 차별화 없음
- **레이아웃 재계산 타이밍**: expanded 카드 높이는 렌더 후 `ResizeObserver`로 측정 → 측정값으로 엣지 좌표 업데이트
  - 이유: QuestionEditor 높이는 옵션 개수, 질문 타입에 따라 동적으로 바뀜. 정적 상수로 고정 불가
- **섹션 컨테이너 크기**: 자식 카드 높이 합산 + padding으로 동적 계산
- **기존 우측 패널 동작**: expanded 모드에서도 노드 클릭 시 우측 패널 동기화 유지 (일관성)

### UX Writing (확정 문구)

| 상황               | 문구                                 |
| ------------------ | ------------------------------------ |
| compact 토글 버튼  | 요약                                 |
| expanded 토글 버튼 | 확장                                 |
| expanded 모드 툴팁 | 질문 카드를 실제 크기로 볼 수 있어요 |

## 구현 힌트

### 기술 스펙

**1. Builder Store 확장 (`src/lib/store/builder.ts`)**

```ts
// 추가할 상태
flowCardMode: "compact" | "expanded";
setFlowCardMode: (mode: "compact" | "expanded") => void;
```

초기값: `"compact"` (기존 동작 유지)

**2. Expanded 레이아웃 상수**

```ts
const EXPANDED_CARD_W = 400;
const EXPANDED_CARD_MIN_H = 200;
```

`computeFlowLayout`, `computeVerticalFlowLayout` 함수가 `NODE_W`, `NODE_H` 상수를 직접 참조한다.
`flowCardMode`에 따라 다른 상수를 주입하는 방식으로 분기:

```ts
const nodeW = flowCardMode === "expanded" ? EXPANDED_CARD_W : NODE_W;
const nodeH = flowCardMode === "expanded" ? (measuredHeights[q.id] ?? EXPANDED_CARD_MIN_H) : NODE_H;
```

**3. 카드 높이 측정 — ResizeObserver 패턴**

```ts
const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});

// 각 expanded 카드에 ref 부착
const cardRef = useCallback((el: HTMLDivElement | null, questionId: string) => {
  if (!el) return;
  const ro = new ResizeObserver(([entry]) => {
    setMeasuredHeights((prev) => ({
      ...prev,
      [questionId]: entry.contentRect.height,
    }));
  });
  ro.observe(el);
  return () => ro.disconnect();
}, []);
```

측정값이 바뀌면 레이아웃 재계산 → 엣지 좌표 자동 갱신.

**4. Expanded 카드 렌더링**

`QuestionEditor` 컴포넌트를 그대로 사용. `activeQuestionId` 상관없이 모든 질문 카드를 렌더링.
단, `QuestionSettings`의 타입 드롭다운·기타 상태 종속 로직은 `activeQuestionId` 기준으로 동작하므로
expanded 카드 클릭 시 `setActiveQuestion`을 호출해 동기화 필요.

**5. 섹션 컨테이너 크기 — expanded 모드**

```ts
// expanded 섹션 높이 = 카드 높이 합 + 카드 간 gap + 상하 padding
const secHeight =
  nodes.reduce((acc, n) => acc + (measuredHeights[n.question.id] ?? EXPANDED_CARD_MIN_H), 0) +
  (nodes.length - 1) * VERT_NODE_GAP +
  SEC_PAD_Y +
  SEC_PAD_Y_BOT;
```

**6. 토글 UI 위치**

기존 우측 상단 컨트롤 바에 "요약 / 확장" 세그먼트 추가.
방향 토글과 동일한 `pill` 스타일 (`rounded-[34px] p-[3px]`, BG_SURFACE 배경).

**7. 엣지 연결점 변경 없음**

expanded 모드에서도 엣지는 동일한 cubic bezier + 화살표 패턴 유지.
연결점 좌표만 `nodeW`, `nodeH` 기반으로 재계산됨 — 별도 엣지 렌더 분기 불필요.

### 예외 처리

| 케이스                              | 처리 방법                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| expanded 전환 직후 높이 미측정 상태 | `EXPANDED_CARD_MIN_H = 200px` fallback 사용, 측정 완료 후 레이아웃 갱신             |
| startpoint / endpoint 핀드 노드     | expanded 모드에서도 별도 핀드 노드 렌더링 유지 (타입 특수 처리 그대로)              |
| 질문 없는 섹션                      | 현재 compact 동작과 동일 — "질문 추가" CTA 노드 표시                                |
| 조건부 분기 뱃지 + expanded 카드    | 뱃지 y 좌표가 카드 중간을 가리킬 수 있음 — 뱃지를 카드 하단 아래에 배치하는 것 검토 |
| 많은 질문(20개+)에서 expanded 전환  | PanCanvas zoom 0.3 수준까지 줌아웃 가능하므로 허용. 성능 모니터링 필요              |
| ResizeObserver 미지원 환경          | `typeof ResizeObserver === "undefined"` 시 EXPANDED_CARD_MIN_H 고정값 fallback      |

## 정책 참고

해당 없음 (순수 UI 기능, 데이터 정책 변경 없음).

## CS 문의 예상 지점

- "expanded 모드에서 편집한 내용이 저장되나요?" → QuestionEditor가 기존 save 로직 그대로 사용하므로 저장됨. 응답 확인 메시지 필요시 기존 toast 시스템 활용
- "expanded로 전환하면 카드 배치가 바뀌어요" → 레이아웃 재계산이 발생하는 정상 동작임. 컨트롤 바 툴팁으로 사전 안내
