Jira 이슈를 읽어 로컬 티켓 파일을 생성하고 /cowork을 실행한다.

## 입력

`$ARGUMENTS`: Jira 이슈 키 (예: MDWEB-42)

---

## Step 1 — Jira 이슈 읽기

Atlassian MCP로 이슈 조회.

Atlassian 미인증 상태이면: `mcp__atlassian__authenticate` 먼저 실행.

추출:
- `summary` → title
- `description` → 목적/현황
- `priority` → P0~P3 변환 (Highest→P0, High→P1, Medium→P2, Low→P3)
- `assignee` → 담당 에이전트 추론 (FE/BE/PM 키워드 기반)
- `labels` → agents 배정 힌트

---

## Step 2 — 로컬 티켓 생성

현재 프로젝트 CLAUDE.md에서 `PROJECT_PREFIX`, `BACKLOG_PATH` 읽기.

`{BACKLOG_PATH}/index.md`에서 다음 ID 확인.
`{BACKLOG_PATH}/_template.md` 기반으로 파일 생성:

```
{BACKLOG_PATH}/todo/{PROJECT_PREFIX}-{id}.md
```

frontmatter 필드:
- `id`: 다음 번호
- `title`: Jira summary
- `jira_ref`: $ARGUMENTS (이슈 키 — 연결 유지)
- `agents`: 추론된 담당 에이전트
- `priority`: 변환된 P0~P3

`{BACKLOG_PATH}/index.md` 업데이트.

---

## Step 3 — Jira 상태 업데이트

Atlassian MCP로 이슈 상태 → "In Progress" 전환.

---

## Step 4 — /cowork 실행

생성된 로컬 티켓 경로로 실행:

```
/cowork {BACKLOG_PATH}/todo/{PROJECT_PREFIX}-{id}.md
```

---

## Step 5 — 완료 후 Jira 동기화

/cowork 완료 (`result: PASS`) 시:
- Atlassian MCP로 이슈 상태 → "Done"
- 코멘트 추가: "완료. QA 리포트: `{BACKLOG_PATH}/reports/{PROJECT_PREFIX}-{id}-qa.md`"

---

입력: $ARGUMENTS
