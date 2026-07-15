기획 루프를 실행한다. 아이디어(자연어)를 받아 UX 리서치 → PRD 작성까지 진행한다.

---

## 입력

`$ARGUMENTS`: 아이디어 설명 (자연어)  
Slack 링크가 포함되어 있으면 자동으로 인식한다.

---

## Step 1 — 인풋 파싱

`$ARGUMENTS`에서 아래를 추출한다:

- **Slack 링크** (`slack.com/archives/...`): 있으면 Slack MCP로 해당 메시지/스레드 읽기
- **아이디어 본문**: 나머지 텍스트 전체

---

## Step 2 — 리서치

아래 순서로 진행한다.

1. WebSearch: `"[기능명] UX pattern best practice 2024"` — 레퍼런스 패턴 수집
2. `docs/policy/` 디렉토리 확인 → 관련 정책 파일 읽기
   - 예: 결제·플랜 관련이면 `plan.md`, 멤버 관련이면 `member.md` 등

---

## Step 3 — 트랙 판단

아래 기준으로 **Full Cycle** 또는 **Fast Track** 결정.

### Full Cycle 조건 (하나라도 해당 시)

- 새 기능 또는 새 페이지
- 사용자 플로우/UX가 바뀜
- DB 스키마 변경 필요
- 비즈니스 정책 결정 필요
- 영향 범위 3개 파일 초과 예상
- 보안/결제/포인트 관련

### Fast Track 조건 (모두 해당 시)

- 기존 기능 내 개선 (UX 흐름 변경 없음)
- 영향 범위 1~3개 파일
- 정책 결정 불필요
- 텍스트, 스타일, 버그 수정, 성능 개선

---

## Step 4 — PRD 작성

1. `docs/backlog/index.md` 읽어서 다음 ID 확인
2. `docs/backlog/_template.md` 기반으로 PRD 작성
   - frontmatter의 `id`: `MD-WEB-{n}` 형식
   - `agents.owner`: 트랙 및 아이디어 기반으로 추론 (`md-fe` / `md-be` / `md-pm`)
   - `policy_refs`: Step 2에서 참조한 파일 목록
   - PRD 본문에 Step 2 리서치 결과 채워넣기
3. 저장: `docs/backlog/todo/MD-WEB-{n}.md`
4. `docs/backlog/index.md` 업데이트

---

## Step 5 — 사용자 확인

```
PRD 생성 완료: docs/backlog/todo/MD-WEB-{n}.md
제목: {title}
트랙: {Full Cycle / Fast Track}
담당: {agents.owner}

이 방향으로 맞나요? (YES / 수정사항 말해줘)
```

수정 요청 시 → PRD 반영 후 재출력.  
YES → Step 6으로 진행.

---

## Step 6 — Jira 티켓 생성 여부 확인

PRD 확정 후 반드시 아래 질문을 출력하고 대기한다.

```
Jira 티켓 생성할까요? (YES / NO)
```

- **YES** → `/create-jira` 실행하여 Epic + Story 생성
- **NO** → 아래 메시지 출력 후 종료

```
PRD 파일: docs/backlog/todo/MD-WEB-{n}.md
Jira가 필요하면 나중에 /create-jira 를 실행하세요.
```

---

## 중단 조건

아래 상황에서 멈추고 사용자에게 보고:

- 정책 파일이 없어서 결정 불가한 케이스
- 아이디어가 너무 모호해서 PRD 작성 불가 → 구체화 질문

---

입력: $ARGUMENTS
