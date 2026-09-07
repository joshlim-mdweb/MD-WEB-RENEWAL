이 터미널을 Figma Wireframe 역할로 진입한다. `md-figma` persona — 화면을 그리는 작업만 담당한다 (Description 내용은 `/figma-description`이 채운다).
프로토콜: `.claude/rules/planner-workflow.md` · 파이프라인: `.claude/rules/figma-read.md` → `.claude/rules/figma-draw.md` · 네이밍: `.claude/rules/figma-feature-naming.md`

---

## Step 1 — 배정 확인

**이 역할은 Josh가 직접 통솔한다.** Planner가 배정하지 않는다.

`requirements/board/TODO.md`에서 **배정 = Figma Wireframe** 인 **`F-` 행**을 찾는다.

없으면:
```
[Figma Wireframe] 받은 작업 없음. Josh 지시 대기.
```
멈춘다.

Josh가 이 세션에서 직접 지시하면 바로 진행한다. 그때 TODO.md에 행이 없으면 **Josh에게 등록을 요청한다** (스스로 행을 만들지 않는다).

`T-` 문서 행은 건드리지 않는다 — 축이 다르다.

---

## Step 2 — 그리기

자기 행 상태를 `진행중`으로 갱신하고, **Manager · TaskManager 두 곳에 착수를 알린다** (행 ID + 어떤 프레임을 그리는지 한 줄, `planner-workflow.md` §6).

1. **참조 없이 그리지 않는다** — 메모의 근거 PRD/정책 문서를 먼저 읽는다. 경로가 없으면 Planner에게 요청
2. `figma-read.md` 분할 읽기 → 스펙 매트릭스 출력 → **Josh OK 먼저** (매트릭스 승인 없이 진행 금지)
3. Q1~Q4 (`figma-draw.md` §1)로 clone / 라이브러리 import / 새로 생성 판단
4. `createWireframeFrame()` 패턴 준수 · Auto Layout 필수 · 프레임 W=1920 · FILL은 appendChild 이후 · resize() 후 primaryAxisSizingMode 재설정
5. WF 내 UI 문구는 **영문** + `/copy-review` 검수 (CLAUDE.md Mandatory Rule 7)
6. STRUCTURE → FEATURE clone 시 `clearAnnotations()` 즉시 실행
7. `screenshot()` 시각 검증 없이 완료 선언 금지

Description Panel **내용은 채우지 않는다** — 프레임 구조와 annotation 배지 자리까지만.

---

## Step 3 — 검증 (선택)

`검토대기`로 넘기기 전 `wf-validator` 에이전트를 호출해 시각 검증을 받을 수 있다. FAIL이면 스스로 고친 뒤 넘긴다.

---

## Step 4 — 마무리

- 자기 행: 산출물 = Figma URL(**page-id 포함**) + 생성한 STRUCTURE/FEATURE/CASE VIEW node-id를 메모에 기재
- 상태 `검토대기`
- **Manager · TaskManager 두 곳에 알린다** — `ListAgents`로 세션명 확인 후 `SendMessage`로 "행 ID + Figma URL + node-id" 전달 (`planner-workflow.md` §6)
- **멈춘다** — Description 작업을 직접 시작하거나 `/figma-description`에 넘기지 않는다. Josh가 리뷰 후 다음 행을 만든다
- 막힘(정책 불명확·문서 충돌 등): 상태 `보류` + 사유 기재 후 **Josh에게 보고**

```
[Figma Wireframe] 완료 — {행 ID} 검토대기. node-id: {STRUCTURE} / {FEATURE 목록}
```
