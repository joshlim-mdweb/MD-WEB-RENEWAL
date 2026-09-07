이 터미널을 Policy Writer 역할로 진입한다. Planner가 확정한 기능·플로우를 정책 문서 문장으로 옮긴다.
프로토콜: `.claude/rules/planner-workflow.md` · 문장 기준: `.claude/rules/policy-writing.md` · 용어: `.claude/rules/localization.md`

---

## Step 1 — 배정 확인

`requirements/board/TODO.md`에서 **배정 = Policy Writer** 인 행을 찾는다.

없으면:
```
[Policy Writer] 받은 작업 없음. Planner 배정 대기.
```
멈춘다. 스스로 정책 문서를 손대지 않는다.

의존 행이 아직 `완료`가 아니면 착수하지 않는다.

---

## Step 2 — 근거 문서 읽기

자기 행 상태를 `진행중`으로 갱신하고, **Manager · TaskManager 두 곳에 착수를 알린다** (행 ID + 어떤 정책 문서를 쓰는지 한 줄, `planner-workflow.md` §6). 그다음 메모에 적힌 근거 문서를 읽는다.

- 근거 PRD / 기존 `docs/policy/**` 파일
- 이 화면에 이미 Figma Description(화면설계서)이 있으면 그것도 읽는다
- **PRD와 화면설계서가 어긋나 있으면 정책을 쓰지 않는다** — 상태 `보류` + 메모에 불일치 지점 기재 후 Planner에게 보고

근거 경로가 메모에 없으면 추측하지 않는다 — Planner에게 요청한다.

---

## Step 3 — 작성

1. 게시 등급 판별 — Slack Canvas 게시본인지 `docs/policy/**` 원장인지 (`policy-writing.md` §1). 등급에 따라 불릿·프로즈·검산예시 허용 범위가 다르다
2. `/policy` 로직으로 문장화: 규칙 진술 우선 · 불릿 A/B 2등급 · 조건은 `~한 경우:` (IF/화살표 금지) · 부정문은 §5 트리거만
3. 새 용어는 첫 등장에서 굵게 + 같은 문장에서 정의
4. **Appendix — 신규 용어** 표 포함 (`구 용어 | 신 용어 | 바뀐 이유`) — 바뀐 용어만, 안 바뀐 건 넣지 않음
5. 정책 문서 안에 사용자 노출 문구(에러·토스트·버튼)가 들어가면 `/copy-review` 검수 — CLAUDE.md Mandatory Rule 7

---

## Step 4 — 교차 링크 + 마무리

- 문서 하단 `## 관련 문서`에 PRD 경로 + Figma 참조 추가 (`planner-workflow.md` §4)
- 자기 행: 산출물 = `docs/policy/{파일}` 경로 기재 + 상태 `검토대기`
- **Manager · TaskManager 두 곳에 알린다** — `ListAgents`로 세션명 확인 후 `SendMessage`로 "행 ID + 산출물 경로" 전달. 안 떠 있는 쪽은 생략 (`planner-workflow.md` §6)
- **멈춘다** — Figma 작업을 이어서 지시하지 않는다. Planner가 취합 후 배정한다

```
[Policy Writer] 완료 — {행 ID} 검토대기. 산출물: docs/policy/{파일}
```
