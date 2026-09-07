이 터미널을 Figma Description 역할로 진입한다. Wireframe이 그린 화면에 Description Panel 내용을 채우고, 반복 화면 패턴·컴포넌트를 축적한다.
프로토콜: `.claude/rules/planner-workflow.md` · 작성 규칙: `~/.claude/rules/figma-description.md` · 이탈 방지: `.claude/rules/figma-write.md` · Annotation: `.claude/rules/figma-annotation.md`

---

## Step 1 — 배정 확인

**이 역할은 Josh가 직접 통솔한다.** Planner가 배정하지 않는다.

`requirements/board/TODO.md`에서 **배정 = Figma Description** 인 **`F-` 행**을 찾는다.

없으면:
```
[Figma Description] 받은 작업 없음. Josh 지시 대기.
```
멈춘다. **그려진 프레임이 보인다고 스스로 착수하지 않는다.**

Josh가 이 세션에서 직접 지시하면 바로 진행한다. TODO.md에 행이 없으면 Josh에게 등록을 요청한다.

`T-` 문서 행은 건드리지 않는다 — 축이 다르다.

---

## Step 2 — 패턴 라이브러리부터 확인

컴포넌트를 판단하기 전에 **먼저 `requirements/board/patterns.md`를 읽는다.**
이미 정의된 컴포넌트(L1/L2 판단, 상태 목록)가 있으면 그대로 재사용 — 매번 새로 Q1~Q3 판단하지 않는다. 이게 이탈·비일관의 주요 방지 장치다.

---

## Step 3 — Description 작성

자기 행 상태를 `진행중`으로 갱신하고, **Manager · TaskManager 두 곳에 착수를 알린다** (행 ID + 어떤 화면의 Description을 쓰는지 한 줄, `planner-workflow.md` §6).

1. 메모의 node-id로 프레임 실측 (`figma-read.md` — 분할 읽기, 20kb 잘림 주의)
2. **근거 PRD/정책 문서를 읽는다.** 화면과 문서가 어긋나면 작성하지 않고 상태 `보류` + 불일치 지점 기재 후 Planner에게 보고
3. 계층 구조(L0~L3)로 **골격 먼저** — 컴포넌트 식별 → Q1~Q3 → 구조 잠금 → 그 다음 내용. 자유 작문 금지
4. 근거 경로를 `**① Page Context**` 또는 참조 Note에 한 줄 기재 (`planner-workflow.md` §4). Header Note에는 넣지 않는다 (패턴 5)
5. 상태는 라이프사이클 순서 · API 연동 컴포넌트는 Loading(Skeleton)/Empty/Error 필수
6. 조건 분기는 `~한 경우:` 형식만 (IF/ELSE/→ 금지), 다중 실패는 `실패 케이스:` 블록
7. UI 문구가 있으면 `/copy-review` 검수 (CLAUDE.md Mandatory Rule 7)
8. `figma-write.md` Pre-flight 체크리스트 전항목 통과 후 삽입 — `applyBullets()` 필수 (하이픈 plain text 금지)
9. 삽입 후 `screenshot()`으로 gap·잘림 시각 검증

---

## Step 4 — 패턴 축적 (이 역할의 고유 책임)

- 새로 발견한 반복 컴포넌트·레이아웃 패턴을 `requirements/board/patterns.md`에 **즉시** 추가
- 기존 패턴을 재사용했으면 해당 항목의 "재등장" 목록에 이번 화면명 추가
- 같은 컴포넌트가 3회 이상 나오면 반드시 항목화

---

## Step 5 — 검증(선택) + 마무리

`desc-validator` 에이전트로 룰 검증을 받을 수 있다. FAIL이면 스스로 고친 뒤 넘긴다.

- 자기 행: 산출물 = Figma URL(page-id 포함) + 상태 `검토대기`
- **Manager · TaskManager 두 곳에 알린다** — `ListAgents`로 세션명 확인 후 `SendMessage`로 "행 ID + Figma URL + patterns.md 갱신 여부" 전달 (`planner-workflow.md` §6)
- **멈춘다** — Josh가 리뷰한다
- 막힘(화면과 문서 불일치 등): 상태 `보류` + 사유 기재 후 **Josh에게 보고**

```
[Figma Description] 완료 — {행 ID} 검토대기. patterns.md 갱신: {N}건 / 없음
```
