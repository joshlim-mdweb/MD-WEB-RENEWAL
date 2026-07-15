72시간 내 `cell_mdweb`·`cell_request_to_mdweb` 채널의 요청사항을 파악하고,
MDWEB-625 Maintenance 하위에 Bug 또는 Improvement 티켓 생성 대상을 추려 검토 후 생성한다.

---

## Step 1 — Slack 채널 읽기 (병렬)

두 채널을 병렬로 읽는다:
- `cell_mdweb`
- `cell_request_to_mdweb`

`mcp__claude_ai_Slack__slack_search_channels`로 채널 ID 조회 후
`mcp__claude_ai_Slack__slack_read_channel`로 최근 메시지 읽기 (limit: 50).

**72시간 필터**: 현재 시각 기준 72시간 이전 이후 메시지만 처리.

추출 대상:
- 요청 내용 / 이슈 설명
- 작성자 (`@mention`)
- 우선순위 힌트 (`urgent`, `blocker`, `critical`, `긴급`, `재현됨`)
- 관련 링크·스크린샷 언급

스레드가 달린 메시지는 `mcp__claude_ai_Slack__slack_read_thread`로 스레드 전체 추가 읽기.

---

## Step 2 — MDWEB-625 기존 하위 티켓 조회

Atlassian MCP 인증 확인 (미인증 시 `mcp__atlassian__authenticate` 먼저 실행).

JQL로 MDWEB-625 하위 티켓 조회:
```
parent = MDWEB-625 ORDER BY created DESC
```

조회된 티켓 목록과 Slack 메시지를 키워드 매칭해 **중복 여부 판단**.

---

## Step 3 — 분류 & 검토 표 출력

중복 제외 후 신규 항목만 아래 형식으로 출력:

| # | 채널 | 내용 요약 | 분류 | 제안 제목 | 우선순위 |
|---|---|---|---|---|---|

**분류 기준:**
- `Bug(MD)` — 기존 기능 오작동, 에러, 화면 표시 오류
- `Improvement(MD)` — 기존 기능 개선 요청, UX 불편, 문구 수정

**제목 형식:** `Site | {내용 요약}`
- `[Bug]` / `[Improvement]` 단독 시작 금지 — `Site |` prefix 필수
- 예: `Site | 플랜 카드 가격 표시 오류`, `Site | Checkout 버튼 텍스트 변경 요청`

**우선순위 판단:**
- 🔴 High — `urgent`, `blocker`, `critical`, `긴급`, `이미 고객에게 나간`, `재현됨`
- 🟡 Medium — 기능 이슈, 반복 접수
- 🟢 Low — UI 버그, 번역 오류, 질문성

표 출력 후 사용자에게 확인 요청:
```
위 목록 중 티켓으로 생성할 항목 번호를 알려주세요.
전체 생성: "전체" / 특정 항목: "1, 3, 5" / 없으면: "없음"
```

---

## Step 4 — 티켓 생성

사용자가 선택한 항목만 `mcp__claude_ai_Atlassian_Rovo__createJiraIssue`로 생성:

| 필드 | 값 |
|---|---|
| `project` | `MDWEB` |
| `issuetype` | `Sub-Task(MD)` |
| `parent` | `MDWEB-625` |
| `summary` | Step 3 제안 제목 (생성 전 최종 편집 기회 제공) |
| `description` | Slack 메시지 원문 + 채널명 출처 |
| `priority` | 분류된 우선순위 |

생성 완료 후 출력:
```
생성 완료: {count}건
- MDWEB-{n}: {제목}
- MDWEB-{n}: {제목}
```
