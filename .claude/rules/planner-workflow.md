# Planner 중심 워크플로우

적용: `requirements/board/**`, 그리고 이 파일을 로드하는 역할 커맨드 전체.

**Planner 허브는 문서 축까지다.** Planner가 기획(intake) → 배정(assign) → 취합(close)까지 소유하지만, 그 범위는 **기획 문서·정책 문서**다. Figma 작업(Wireframe·Description)은 **Josh가 직접 통솔**한다 — Planner가 배정하지 않는다.

```
문서 축 (Planner 소유)          Figma 축 (Josh 직접)
Research · Policy Writer   →    Figma Wireframe · Figma Description
                          Josh
```

Planner는 문서를 완성해 `완료` 처리하면 거기서 끝난다. Figma로 넘기지 않고 **Josh에게 넘긴다.** Figma 두 역할끼리도 직접 핸드오프하지 않는다 — Josh를 거친다.

---

## 0. 터미널 실행 규칙

터미널은 `claude --name {역할}` 로 세션 이름을 역할명과 동일하게 띄운다 (예: `claude --name Planner`). 세션 진입 후 같은 이름의 슬래시 커맨드(`/planner` 등)를 실행해 persona를 로드한다. 세션명·커맨드명·역할명 셋이 항상 일치한다.

---

## 1. 역할

```
                            Josh
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   /planner            [Figma 축 — Josh 직접]   /task-manager
   문서 축 허브                │                (읽기 전용 뷰)
        │ 배정                 ├── /figma-wireframe
   ┌────┴────┐                 └── /figma-description
/research  /policy-writer
        │                      │
        └──► /manager · /task-manager ◄──┘
          기록 (TODO.md+task list) / 대시보드
```

**상태 변경은 두 곳으로 간다.** `Manager`가 TODO.md와 세션 task list에 **기록**하고, `TaskManager`가 현황표를 **즉시 재출력**한다. 역할은 어디로 보낼지 판단하지 않는다 — 항상 둘 다.

| 역할 | 커맨드 | 책임 | 배정 주체 |
|---|---|---|---|
| **Manager** | `/manager` | **진행 상황 트래킹**(TODO.md + task list) · 워크플로우 개선 | — |
| **Planner** | `/planner` | 기획·기능 정의·문서 작업 분해·`T-` 배정. `md-pm` persona | — |
| **Task Manager** | `/task-manager` | Josh가 현황을 보는 뷰 (읽기 전용) | — |
| **Research** | `/research` | 자료 취합만, 판단 없음 | Planner |
| **Policy Writer** | `/policy-writer` | 확정 기능을 정책 문서 문장으로 | Planner |
| **Figma Wireframe** | `/figma-wireframe` | 화면 그리기 (`md-figma` persona) | **Josh 직접** |
| **Figma Description** | `/figma-description` | Description Panel + 패턴 라이브러리 축적 | **Josh 직접** |

행 ID 접두어로 축을 구분한다 — **`T-` 문서 축** / **`F-` Figma 축**. 둘 다 Manager가 추적한다.

---

## 2. TODO.md 갱신 규칙

**`requirements/board/TODO.md`는 Manager가 관리한다.** 문서 축과 Figma 축을 모두 추적한다.

트래킹 책임을 각 역할에 분산시키지 않는다 — 역할은 일을 하고, **Manager가 받아서 기록한다.** 역할마다 자기 행을 고치게 하면 갱신이 누락되고 Josh가 현황을 못 본다.

| 역할 | 하는 일 | TODO.md |
|---|---|---|
| **Manager** | 진행 상황 기록·집계 | **쓴다** (여기 + 세션 task list 양쪽) |
| Planner | 기획·문서 작업 분해·`T-` 배정 | 자기 판단을 Manager에게 알림 |
| Research · Policy Writer | 배정받은 문서 작업 | 상태 변경을 Manager에게 알림 |
| Figma Wireframe · Description | **Josh와 직접** 작업 | 상태 변경을 Manager에게 알림 |
| Task Manager | Josh용 현황 뷰 | 읽기 전용 |

역할이 TODO.md를 직접 고쳐도 되지만 **의무는 아니다.** 알리기만 하면 Manager가 반영한다. 알림이 누락되면 Manager가 물어서 채운다.

- 배정받은 역할은 작업을 끝내면 **멈춘다.** 다음 단계를 스스로 만들거나 다른 역할에게 넘기지 않는다
- `T-` 리뷰는 Planner, `F-` 리뷰는 Josh
- **Planner는 `F-` 작업을 배정하지 않는다.** 문서를 완료하면 Josh에게 알리고 끝낸다

---

## 3. Planner의 작업 분해 — 플랜 승인 선행 ★

큰 작업(여러 화면·정책 파일에 걸치는 것)은 **행을 만들기 전에 Josh 승인을 받는다.** 집행부터 시작하지 않는다.

### 3.1 Phase A — 플랜 (필수 선행)

Josh에게 아래 두 표를 채워 보고하고 OK를 받는다. 파일로 남길 필요는 없다 — 대화 안에서.

**정책 문서 목차(안)**

| # | 섹션명 | 이 섹션이 답하는 질문 | 근거 정책 파일 |
|---|---|---|---|

**화면 설계서 필요 목록**

| # | 프레임명 | 타입 | 왜 필요한가 | 근거 (정책 섹션) |
|---|---|---|---|---|

타입: `STRUCTURE` / `FEATURE` / `CASE VIEW`

### 3.2 Phase B — 집행 (Josh OK 후에만)

승인된 목차·화면 목록을 **그대로** TODO.md 행으로 만든다. 승인 목록에 없는 섹션·프레임을 임의 추가하거나 생략하지 않는다.

### 3.3 커버 항목 — Planner가 완료 처리 전 확인

기획 산출물이 아래를 커버했는지 확인한다. 누락되면 `완료` 처리하지 않고 재배정한다.

- [ ] 계정 유형 전체 케이스 (Non-Member / Member / Group Owner / SW Account)
- [ ] Verification 상태 분기 (Student / Academic × 인증 없음·대기·완료)
- [ ] Empty 상태
- [ ] Error 상태
- [ ] Loading 상태 (Skeleton — 로딩 휠 금지)
- [ ] 케이스 분기 (조건별 처리)

### 3.4 정책 문서 필수 구성

Policy Writer에게 배정할 때 아래를 명시한다.

- 본문: 기능·플로우 중심. 이해관계자(BD·CS·글로벌팀)가 읽고 이해 가능한 수준
- **Appendix — 신규 용어**: 이번 개편으로 바뀐 용어만. `구 용어 | 신 용어 | 바뀐 이유` 3컬럼 표
  - 용어 설명만 다룬다. 기능 설명·플로우 재기술 금지
  - 안 바뀐 용어는 넣지 않는다

---

## 4. 문서 간 상호 링크 규칙 ★ 핵심

**기능명세(PRD) ↔ 정책 문서(`docs/policy/**`) ↔ 화면설계서(Figma Description)** 세 축이 이 워크플로우의 실제 참조물이다. 하나만 갱신하고 나머지를 두면 다음 작업이 스테일한 문서를 근거로 진행된다 — 가장 흔한 사고다.

**작업 착수 시 (모든 역할):** 배정된 행의 근거 문서(PRD·정책·화면설계서) 중 존재하는 것을 전부 읽고 시작한다.

**Planner가 완료 처리 시:** 세 문서의 교차 링크가 최신인지 확인한다. 이게 취합(close)의 핵심 검수 항목이다.

### PRD / 기능명세 하단

```markdown
## 관련 문서
- 정책: docs/policy/{파일명}
- Figma: {file-key}/{page-id}/{section} — node-id {있으면}
- Jira: {키 또는 "미생성"}
```

### 정책 문서(`docs/policy/**`) 하단

```markdown
## 관련 문서
- PRD: requirements/{경로}
- Figma: {file-key}/{page-id}/{section}
```

### Figma Description Panel (화면설계서)

**Description 본문에 근거 출처 줄을 쓰지 않는다** (2026-08-26 확정, Josh 결정). `- 근거: PRD … · 정책 …` 형식의 줄을 Header Note든 개별 Note든 어디에도 넣지 않는다. 근거 문서는 이 워크플로우 문서(TODO.md 각 행의 메모)에서만 추적한다.

---

## 5. 작업 루프

### 문서 축 — Research / Policy Writer

1. `requirements/board/TODO.md`에서 **자기에게 배정된 `T-` 행** 확인
2. 없으면: "받은 작업 없음" 보고하고 멈춘다. 스스로 일을 만들지 않는다
3. 있으면: 상태 → `진행중` + TaskManager 알림, 근거 문서 읽기, 관련 rule 로드, 작업 수행
4. 완료: 산출물 경로 기재 + 상태 → `검토대기` + Planner·TaskManager 알림. **멈춘다**
5. 막힘: 상태 → `보류` + 메모에 사유. Planner에게 보고

### Figma 축 — Figma Wireframe / Figma Description

배정 주체가 **Josh**다. 나머지 흐름은 문서 축과 같다.

1. `TODO.md`에서 **자기에게 배정된 `F-` 행** 확인. Josh가 이 세션에서 직접 지시하는 경우도 있다 — 그때는 바로 진행하고, TODO에 행이 없으면 Josh에게 등록을 요청한다
2. 상태 → `진행중` + TaskManager 알림
3. 작업 수행 (`figma-read.md` → `figma-draw.md` / `figma-description.md` 파이프라인)
4. 완료: 산출물(Figma URL·node-id) 기재 + 상태 → `검토대기` + TaskManager 알림. **멈춘다**
5. **Planner에게 알리지 않는다** — `F-` 행의 리뷰·완료 처리는 Josh 몫이다
6. 막힘(정책 불명확·문서 충돌 등): 상태 → `보류` + 사유. **Josh에게 보고** (Planner가 아니다)

### Planner

1. `TODO.md`의 **`T-` 행만** 확인 — `검토대기`부터 처리 (취합 우선)
2. Josh 신규 요청이 있으면 intake → 큰 작업이면 §3 Phase A 승인부터
3. `검토대기` 리뷰: §3.3 커버 항목 + §4 교차 링크 확인 → 통과면 `완료`, 미달이면 메모 달고 `진행중`으로 되돌림
4. 완료 처리 후 후속 **문서** 작업이 있으면 새 `T-` 행 생성·배정
5. **화면 설계가 필요한 단계가 되면 `F-` 행을 만들지 않는다.** Josh에게 "문서 완료, Figma 착수 가능" 알리고 끝낸다
6. 배울 점이 있으면 `docs/backlog/mistakes.md`에 append (상황/실수/원인/다음엔 4필드)

### Task Manager

`TODO.md`를 읽어 Josh에게 렌더링. 정체 항목·적체 지적. **쓰지 않는다.**

---

## 6. 알림 — 폴링하지 않는다

**TODO.md를 주기적으로 다시 읽으며 변화를 감시하지 않는다.** 상태를 바꾼 쪽이 알린다.

**수신처는 두 곳이다. 같은 내용을 둘 다에게 보낸다.**

```
                    ┌──► Manager      기록 (TODO.md + task list). 진실을 남긴다
모든 역할 ── 상태 ──┤
                    └──► TaskManager  대시보드. 받는 즉시 현황표를 다시 출력한다
```

역할이 "어디로 보낼지" 판단하지 않는다 — **항상 두 곳 다.** 그래야 누락이 없다.

| 시점 | 알릴 내용 |
|---|---|
| 작업 착수 | 행 ID + 무엇을 시작했는지 한 줄 |
| 작업 완료 | 행 ID + 산출물 경로 (파일 경로 또는 Figma URL·node-id) |
| 막힘 | 행 ID + 막힌 사유 |
| Josh 결정이 필요한 항목 발견 | 무엇을 결정해야 하는지 |

착수 알림이 핵심이다. 이게 없으면 Josh는 각 터미널이 지금 무엇을 하는지 알 수 없다.

**리뷰 경로는 별개다** — `T-` 산출물 검수는 Planner, `F-`는 Josh. Manager·TaskManager는 검수하지 않는다.

### 역할별 알림 처리

| 받는 쪽 | 하는 일 |
|---|---|
| **Manager** | `TODO.md` 행 갱신 + 세션 task list 동기화(`TaskUpdate`). **양쪽 다** 고친다 |
| **TaskManager** | `TODO.md`를 다시 읽고 **현황표를 즉시 재출력.** 파일은 수정하지 않는다 |

**task list는 세션마다 별개다.** Manager 세션의 task list는 TaskManager에 보이지 않는다. 그래서 TaskManager는 `TODO.md`를 근거로 렌더링한다 — **알림은 트리거, 진실은 파일.**

### 규칙

- 알릴 때는 `SendMessage`를 쓴다. **대상 이름을 추측하지 말고 `ListAgents`로 실제 세션명을 먼저 확인한다.** 첫 접촉에는 `[ref]` 해시가 필요하다 (`TaskManager [43840d]`) — 그 뒤엔 이름만으로 된다. 대소문자는 구분하지 않는다
- **한 턴에 여러 건이면 묶어서 1건으로** 보낸다
- 안 떠 있는 세션은 생략하고 진행한다. **알림 실패로 작업을 멈추지 않는다.** 둘 중 하나만 떠 있어도 흐름이 남는다
- Manager·TaskManager 둘 다 꺼져 있으면 **역할이 직접 TODO.md를 갱신하고** 진행한다

TODO.md가 항상 진실이고, 알림은 그 위에 얹는 속도 개선일 뿐이다. 알림이 없어도 워크플로우는 굴러간다.

---

## 7. Jira 연계

Jira는 **읽기 전용 소스**다. 이 워크플로우에서 티켓을 새로 만들지 않는다 (명시적 요청 시에만).

- 기획 축 = `UX |` 티켓. Epic은 페이지 단위
- `PD | / FE | / BE |` 는 디자인·개발 축 — TODO.md에 넣지 않는다
- TODO.md 각 행의 `Jira` 컬럼에 티켓 키를 적어 근거를 남긴다
- 티켓 상태를 TODO.md와 억지로 동기화하지 않는다 — Jira는 조직 전체 뷰, TODO.md는 기획 실행 목록이라 granularity가 다르다

---

## 8. 실수 로그

`docs/backlog/mistakes.md` 가 유일한 실수 로그다. 포맷은 기존 그대로 — `## YYYY-MM-DD` 헤더 + 상황 / 실수 / 원인 / 다음엔 4필드. Planner가 완료 처리 시 append한다.

---

## 9. Figma 검증 (선택)

Figma Wireframe / Figma Description 역할은 `검토대기`로 넘기기 전 프로젝트 로컬 validator 에이전트를 선택적으로 호출할 수 있다.

- `wf-validator` — 와이어프레임 시각 검증 (프레임 규격·Auto Layout·Board Header·annotation 정리 여부)
- `desc-validator` — Description 룰 검증 (`figma-description.md` + `figma-write.md` 기준)

둘 다 읽기·판정 전용. PASS/FAIL + 이슈 목록만 반환한다. FAIL이면 스스로 고친 뒤 `검토대기`로 넘긴다.

---

## 10. 금지 패턴

| 금지 | 이유 |
|---|---|
| 배정받은 역할이 TODO 행을 생성·재배정·`완료` 처리 | 소유권은 `T-`=Planner / `F-`=Josh |
| **Planner가 `F-` 행을 만들거나 배정** | Figma 축은 Josh 직접 통솔. Planner는 문서 완료를 알리고 끝낸다 |
| **Figma 역할이 `T-` 행을 건드림** | 축 경계 침범 |
| **Figma 역할이 `F-` 완료를 Planner에게 보고** | `F-` 리뷰 주체는 Josh다. Planner는 관여하지 않는다 |
| 역할끼리 직접 핸드오프 (Wireframe → Description 등) | `T-`는 Planner, `F-`는 Josh를 거친다 — 취합 지점 소실 방지 |
| 배정받은 역할이 후속 작업을 스스로 시작 | 범위 이탈. `검토대기`로 넘기고 멈춘다 |
| Task Manager가 TODO.md를 수정 | 읽기 전용 |
| Josh 승인 없이 큰 문서 작업 집행 시작 | §3 Phase A 선행 규칙 위반 |
| 승인된 목차·화면 목록에 없는 항목 임의 추가·생략 | 플랜 승인이 무의미해진다 |
| 산출물 경로 없이 `검토대기`로 넘김 | 리뷰할 대상이 없다 |
