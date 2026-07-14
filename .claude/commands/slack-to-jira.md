슬랙 채널이나 스레드에서 내용을 읽어 Jira 이슈를 생성한다.

## 입력

`$ARGUMENTS`: Slack 채널명 또는 스레드 URL (없으면 사용자에게 요청)

---

## Step 1 — Slack 읽기

Slack MCP 도구로 메시지 읽기:
- 채널명이 주어지면: 최근 메시지 목록 조회
- 스레드 URL이 주어지면: 해당 스레드 전체 읽기

추출 대상:
- 제목 / 요청 내용 (핵심 요약)
- 우선순위 힌트 (`urgent`, `blocker`, `critical` 키워드)
- 담당자 언급 (`@name`)
- 첨부 링크 / 관련 컨텍스트

---

## Step 2 — Jira 이슈 생성

현재 프로젝트 CLAUDE.md에서 `JIRA_PROJECT_KEY` 읽기.

Atlassian MCP로 이슈 생성:
- `summary`: Slack 메시지 핵심 요약 (첫 줄 또는 추출한 제목)
- `description`: Slack 메시지 전체 내용 + 출처 링크
- `issuetype`: Story (기본) / Bug (`bug`, `fix`, `오류` 키워드 감지 시)
- `priority`: Slack에서 감지한 우선순위 (Highest/High/Medium/Low)
- `project`: `JIRA_PROJECT_KEY`

Atlassian 미인증 상태이면: `mcp__atlassian__authenticate` 먼저 실행.

---

## Step 3 — 결과 출력

```
생성된 Jira 이슈: {JIRA_PROJECT_KEY}-{n}
제목: {summary}
우선순위: {priority}

/jira-cowork {JIRA_PROJECT_KEY}-{n} 으로 바로 실행할 수 있습니다.
```

---

입력: $ARGUMENTS
