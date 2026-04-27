---
ticket_id: "OPIN-059"
date: "2026-04-18"
qa_agent: "opin-qa"
result: "PASS"
loop_count: 2
---

## QA 리포트

**티켓:** OPIN-059 — FlowView Expanded 모드 — 질문 카드 실제 크기 렌더링 + 모드 토글
**결과:** PASS
**루프:** 2회차 (1차: PARTIAL → 2차: PASS)

---

## 완료 조건 체크

| 조건                                                           | 결과 | 비고                                                                  |
| -------------------------------------------------------------- | ---- | --------------------------------------------------------------------- |
| 우측 상단 컨트롤 바에 "compact / expanded" 토글 버튼 추가      | ✅   | "요약 / 확장" 세그먼트 컨트롤, 방향 토글과 동일한 pill 스타일         |
| Compact 모드 — 현재 동작 동일 (regression 없음)                | ✅   | `activeNodeW === NODE_W` 분기로 기존 경로 완전 보존                   |
| Expanded 모드 — 카드 너비 400px                                | ✅   | `EXPANDED_CARD_W = 400` 상수 적용                                     |
| Expanded 모드 — 카드 높이 auto (최소 200px)                    | ✅   | `minHeight: EXPANDED_CARD_MIN_H`, ResizeObserver로 측정               |
| Expanded 모드 — QuestionEditor 인라인 동작 (타입, 옵션)        | ✅   | `QuestionEditor` 컴포넌트 직접 포함                                   |
| Expanded 모드 — 질문 제목 인라인 편집                          | ✅   | `TextareaWithFocus` import 후 적용. blur 시 API 저장 동작             |
| Expanded 모드 — 섹션 컨테이너, 베지어 엣지, 조건 뱃지 표시     | ✅   | FlowArrows + SectionContainer 동일 렌더링                             |
| Expanded 모드 — 레이아웃 좌표 재계산 (NODE_W=400, NODE_H=auto) | ✅   | measuredHeights + EXPANDED_CARD_MIN_H fallback으로 layout 함수에 주입 |
| Expanded 모드 — hover 시 엣지 강조                             | ✅   | onHover/onLeave prop 추가, setHoveredNodeId 연결 완료                 |
| 줌 아웃 transform scale로 전체 오버뷰 가능                     | ✅   | 기존 PanCanvas zoom 유지, expanded에도 동일 동작                      |
| flowCardMode: "compact" \| "expanded" builder store 추가       | ✅   | 초기값 "compact", setFlowCardMode 액션 포함                           |
| TypeScript strict 통과                                         | ✅   | `npm run build` TypeScript 에러 없음                                  |
| npm run build 에러 없음                                        | ✅   | 빌드 성공 확인                                                        |
| UX Writing — "요약 / 확장" 문구                                | ✅   | compact→"요약", expanded→"확장", title tooltip 적용                   |

---

## 발견된 이슈

### 버그 (2차 검증 — 수정 확인)

| #   | 심각도 | 설명                                                                                                                                                                                                                        | 2차 결과 |
| --- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Medium | **Expanded 모드에서 엣지 hover 강조 비활성** — `ExpandedQuestionNode`에 `onHover` prop이 없어 `hoveredNodeId`가 갱신되지 않음. FlowArrows의 active 조건 `hoveredNodeId === fromId \|\| hoveredNodeId === toId`이 항상 false | FIXED    |
| 2   | Medium | **질문 제목 인라인 편집 불가** — expanded 카드 내부에서 `question.title`이 `<p>` 읽기 전용으로 렌더링됨. 티켓 DoD "질문 제목 편집 인라인 동작" 미충족                                                                       | FIXED    |

### 코드 품질 이슈 (비블로킹)

| #   | 심각도 | 설명                                                                                                                                                                                                                                                                                                                   |
| --- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3   | Low    | **FlowArrows `nodeH` prop이 expanded 모드에서 dead code** — `FlowView`가 `nodeH={EXPANDED_CARD_MIN_H}`를 전달하지만 `resolveNodeH`는 expanded 시 이를 무시하고 `measuredHeights`를 사용. 혼란을 줄이기 위해 prop 제거 또는 주석 추가 권장                                                                              |
| 4   | Low    | **`computeFlowLayout` (가로 모드) 높이 계산 한계** — 가로 모드에서 한 섹션 내 모든 노드의 y 좌표가 동일한데 섹션 높이는 가장 큰 카드 기준으로 설정됨. 카드별 높이가 달라도 y 좌표가 고정이어서 짧은 카드의 엣지 연결점 오차 발생 가능. 현재 QuestionEditor 특성상 동일 옵션 수일 때 높이 유사하므로 실용적 영향 제한적 |

### 미완성 항목

- [x] 질문 제목 인라인 편집 — `TextareaWithFocus` 재사용으로 해결 (2차 수정)
- [x] Expanded 노드 hover 연결 — `onHover`/`onLeave` prop 추가로 해결 (2차 수정)

---

## PM에게 전달 사항

**result: PASS** → 모든 DoD 충족, 빌드 통과, regression 없음. 티켓 종료 가능.

**완료된 것 (2차 포함 전체):**

- store `flowCardMode` 추가 (초기값 compact, 영속 상태 유지)
- 토글 UI — 우측 상단 컨트롤 바에 "요약 / 확장" 세그먼트 추가, UX Writing 확정 문구 사용
- QuestionEditor 인라인 렌더 (타입 드롭다운, 옵션 편집 동작)
- ResizeObserver 기반 동적 높이 측정 + 레이아웃 재계산
- EXPANDED_CARD_MIN_H=200 fallback, ResizeObserver 미지원 환경 처리
- 섹션 컨테이너, 조건 뱃지, 베지어 엣지 유지
- Compact 모드 regression 없음
- TypeScript strict 통과, 빌드 성공
- [2차 수정] `ExpandedQuestionNode` hover prop 연결 → 엣지 강조 동작
- [2차 수정] `TextareaWithFocus` export + import → 제목 인라인 편집 동작
- respond 페이지 불필요 prop(sections, totalSections) 정리 완료

---

## Regression 체크

| 영향 범위                      | 상태                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------- |
| Compact FlowView (vertical)    | 정상 — `nodeW === NODE_W` 분기 완전 보존                                      |
| Compact FlowView (horizontal)  | 정상 — 동일 분기 보존                                                         |
| Builder store (다른 상태)      | 정상 — `flowCardMode` 독립 추가, 기존 state 변경 없음                         |
| QuestionSettings 우측 패널     | 정상 — expanded 모드 노드 클릭 시 `setActiveQuestion` 호출로 패널 동기화 유지 |
| Legacy layout (섹션 없는 경우) | 정상 — `sections.length > 0` 분기 외부, 영향 없음                             |

---

## Session Handoff

**구현 상태:**

- 변경된 파일: `src/lib/store/builder.ts`, `src/components/builder/FlowView.tsx`
- 완료된 것: store 확장, 토글 UI, ResizeObserver 측정, QuestionEditor 인라인, 레이아웃 재계산
- 의도적으로 제외한 것: 조건 뱃지 y 좌표 개선 (티켓에서 검토 대상으로만 언급)

**다음 세션에서 알아야 할 것:**

- `ExpandedQuestionNode`에 `onHover?: (id: string | null) => void` prop 추가 → 외부 div에 `onMouseEnter/Leave` 연결 필요
- 제목 편집은 `QuestionSettings.tsx`의 `TextareaWithFocus` 패턴 참조 가능. expanded 카드에서는 `updateQuestionTitle` store action 사용
- React 19에서 callback ref의 cleanup return은 지원됨 — `return () => ro.disconnect()` 패턴 정상

**다음 세션 시작 액션:**

1. `ExpandedQuestionNode`에 `onHover` prop 추가하여 hover 강조 복구 (낮은 공수)
2. expanded 카드 제목을 `<p>` → 편집 가능 컴포넌트로 교체 (중간 공수)
3. 두 항목 수정 후 opin-qa 재호출하여 PASS 확인
