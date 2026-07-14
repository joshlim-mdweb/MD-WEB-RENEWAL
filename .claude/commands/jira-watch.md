Jira 프로젝트의 'To Do' 이슈를 확인하고 자동으로 /jira-cowork를 실행한다.
/loop과 함께 사용: `/loop 30m /jira-watch`

---

## Step 1 — Jira 이슈 조회

현재 프로젝트 CLAUDE.md에서 `JIRA_PROJECT_KEY` 읽기.

Atlassian MCP로 JQL 검색:
```
project = {JIRA_PROJECT_KEY} AND status = "To Do" ORDER BY priority DESC
```

최대 5개 조회. Atlassian 미인증이면: `mcp__atlassian__authenticate` 먼저 실행.

---

## Step 2 — 처리 판단

**이슈 없음:**
```
대기 중 — {JIRA_PROJECT_KEY} 프로젝트에 새 'To Do' 이슈 없음
```
루프 계속 (다음 실행 대기).

**이슈 있음:**
우선순위 가장 높은 이슈 1개 선택 → `/jira-cowork {issueKey}` 실행.

---

## Step 3 — 중단 조건

아래 상황에서 루프 중단 후 사용자에게 보고:

- 3회 루프 후 QA PASS 안 될 때
- DB 스키마 변경 승인 필요
- 정책 결정이 필요한 모호한 케이스
- Jira 인증 만료

```
⚠️ jira-watch 중단
이유: {중단 사유}
마지막 이슈: {issueKey}
필요한 조치: {사용자에게 요청할 것}
```

---

사용법: `/loop 30m /jira-watch`
