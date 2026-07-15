지정한 Slack 채널을 읽고, 미티켓 이슈를 정리해 Jira 생성 후보 표로 출력한다.

## 입력

`$ARGUMENTS`: 채널명(들) + 옵션 날짜 필터
예) `cell_mdweb cell_request_to_mdweb`
예) `cell_mdweb 2026-04-29이후`

---

## Step 1 — Slack 채널 읽기

`mcp__claude_ai_Slack__slack_search_channels`로 채널 ID 조회 후
`mcp__claude_ai_Slack__slack_read_channel`로 최근 메시지 읽기 (limit: 30).

날짜 필터가 있으면 해당 날짜 이후 메시지만 처리.
여러 채널이면 병렬로 읽기.

---

## Step 2 — Jira 기존 티켓 비교

`mcp__atlassian__searchJiraIssuesUsingJql`로 최근 티켓 조회:
```
project = {JIRA_PROJECT_KEY} ORDER BY created DESC
```

Slack 이슈와 요약 키워드 매칭으로 중복 여부 판단.
미인증 상태이면 `mcp__atlassian__authenticate` 먼저 실행.

---

## Step 3 — 이슈 분류 & 표 출력

미티켓 이슈만 추려서 아래 스키마로 출력:

| 출처 | 내용 | Epic 위치 또는 생성 | 타이틀 | 잠재 task 할당 | 우선순위 |
|---|---|---|---|---|---|

**분류 기준:**
- **Maintenance 하위 (MDWEB-625)**: 기존 기능 버그 / 단순 수정
- **Feature Request**: 신규 기능 추가 성격
- **새 Epic**: 여러 스토리를 묶는 대규모 작업
- **CS 처리**: 결제·계정 이슈 등 개발 불필요

**우선순위 판단:**
- 🔴 High: `urgent`, `blocker`, `이미 고객에게 나간`, `재현됨` 키워드
- 🟡 Medium: 기능 이슈, 반복 접수
- 🟢 Low: UI 버그, 번역 오류, 질문성

**타이틀 형식:** `[Bug] ...` / `[Feature] ...` / `[Improvement] ...`

---

## Step 4 — 생성 여부 확인

표 출력 후:
```
위 목록 중 티켓으로 생성할 항목 번호를 알려주세요.
전체 생성: "전체" / 특정 항목: "1, 3, 5"
```

사용자가 확인하면 `mcp__atlassian__createJiraIssue`로 생성.

---

입력: $ARGUMENTS
