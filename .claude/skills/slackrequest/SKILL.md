---
name: slackrequest
description: "cell_mdweb·cell_request_to_mdweb 채널의 72시간 내 요청을 읽고, MDWEB-625 Maintenance 하위에 Bug/Improvement 티켓을 생성한다. /slackrequest 커맨드와 동일한 워크플로우."
user_invocable: true
---

# slackrequest 스킬

`cell_mdweb`·`cell_request_to_mdweb` 채널의 72시간 내 요청사항을 수집하고,
MDWEB-625 Maintenance 하위에 **Bug(MD)** 또는 **Improvement(MD)** 티켓을 생성한다.

---

## 트리거 조건

- "슬랙 요청 확인해줘" / "cell_mdweb 정리해줘"
- "Maintenance 티켓 만들어줘" / "MDWEB-625에 넣어줘"
- "72시간 슬랙 정리" / "요청사항 티켓화"
- `/slackrequest` 커맨드 실행

---

## 실행 흐름

```
Step 1 — cell_mdweb + cell_request_to_mdweb 병렬 읽기 (72hr 필터)
Step 2 — MDWEB-625 기존 하위 티켓 조회 (JQL: parent = MDWEB-625)
Step 3 — 중복 제거 → 분류 표 출력 → 사용자 확인
Step 4 — 확인된 항목 Sub-Task(MD) 생성 (parent: MDWEB-625)
```

---

## Step 1 — Slack 채널 읽기

두 채널을 **병렬**로 처리:

```
채널: cell_mdweb, cell_request_to_mdweb
도구: slack_search_channels → slack_read_channel (limit: 50)
시간 필터: 현재 시각 기준 -72시간 이후
스레드 있는 메시지: slack_read_thread로 전체 추가 읽기
```

추출:
- 요청 내용·이슈 설명
- 작성자 (`@mention`)
- 우선순위 힌트 (`urgent`, `blocker`, `critical`, `긴급`, `재현됨`)
- 관련 링크·스크린샷 언급

---

## Step 2 — MDWEB-625 기존 하위 티켓 조회

```jql
parent = MDWEB-625 ORDER BY created DESC
```

Atlassian 미인증 시 `mcp__atlassian__authenticate` 먼저 실행.

Slack 메시지 ↔ 기존 티켓 키워드 매칭으로 중복 판단.

---

## Step 3 — 분류 & 검토 표

신규 항목만 추려 출력:

| # | 채널 | 내용 요약 | 분류 | 제안 제목 | 우선순위 |
|---|---|---|---|---|---|

**분류:**
- `Bug(MD)` — 기존 기능 오작동, 에러, 표시 오류
- `Improvement(MD)` — 개선 요청, UX 불편, 문구 수정

**제목 형식:** `Site | {내용 요약}`
- `Site |` prefix 필수 — `[Bug]` 단독 시작 금지

**우선순위:**
- 🔴 High — urgent, blocker, 긴급, 이미 고객에게 나간
- 🟡 Medium — 기능 이슈, 반복 접수
- 🟢 Low — UI 버그, 번역 오류

표 출력 후:
```
위 목록 중 티켓으로 생성할 항목 번호를 알려주세요.
전체: "전체" / 선택: "1, 3" / 건너뜀: "없음"
```

---

## Step 4 — 티켓 생성

| 필드 | 값 |
|---|---|
| project | MDWEB |
| issuetype | Sub-Task(MD) |
| parent | MDWEB-625 |
| summary | Step 3 제안 제목 |
| description | Slack 메시지 원문 + 채널 출처 |
| priority | 분류 우선순위 |

완료 후:
```
생성 완료: {count}건
- MDWEB-{n}: {제목}
```

---

## 주의사항

- `Task(MD)` 타입 사용 금지 — `Sub-Task(MD)` 전용
- `createIssueLink` 사용 금지 — `parent` 필드로 직접 지정
- 생성 전 제목 최종 편집 기회 제공
- Jira 티켓 존재 확인 없이 생성 금지 (Step 2 필수)
