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
Step 3 — 중복 제거 → 변경 지점 필터 → 분류 표 출력 → 사용자 확인
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

## Step 3 — 변경 지점 필터 & 검토 표

### 3-1. 변경 지점 필터 (분류보다 먼저)

티켓 대상은 **변경 지점이 있는 건**뿐이다. 각 항목마다 먼저 묻는다:

> 이 건으로 무엇이 바뀌었는가 / 바뀌어야 하는가?

| 판정 | 조건 | 처리 |
|---|---|---|
| 티켓 대상 | 코드·데이터·문구·배포에 실제 손을 댔거나 대야 함 | 표에 포함 |
| 티켓 제외 | 안내·조언만 하고 끝남 | 표에서 제외 |

**제외 대상 예시**
- "지금 시스템으로는 불가합니다" 조언성 회신
- 현황·통계·데이터 확인 요청
- 기술 검토 가능성 문의 → "가능하지만 나중에" 일정 답변
- recurring 이슈 문의처럼 조언만 하고 종결된 건

아직 안 고쳤어도 **고쳐야 하는 버그는 포함**한다. 판정 기준은 "완료 여부"가 아니라 "변경 지점 유무"다.

제외한 항목은 표 아래에 `⛔ 티켓 제외` 목록으로 사유와 함께 남긴다 — 누락이 아니라 판정임을 보이기 위함.

### 3-2. 분류 표

남은 항목만 출력:

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
- 변경 지점 없는 건 티켓화 금지 (Step 3-1 필수) — 조언·현황 확인·검토 문의는 제외
