PRD를 기반으로 Jira 티켓을 생성한다.

---

## 입력

`$ARGUMENTS`: 없으면 가장 최근 PRD 자동 사용. 또는 아래 형식으로 직접 지정:
- PRD 파일 경로 (예: `docs/backlog/todo/MD-WEB-3.md`)
- Figma 링크 (선택, 공백으로 구분)

예시:
```
/create-jira
/create-jira docs/backlog/todo/MD-WEB-3.md
/create-jira docs/backlog/todo/MD-WEB-3.md https://figma.com/...
```

---

## Step 1 — PRD 읽기

- `$ARGUMENTS`에 파일 경로 있으면 해당 파일 읽기
- 없으면 `docs/backlog/todo/` 에서 가장 최근 수정된 PRD 파일 자동 사용
- `$ARGUMENTS`에 Figma 링크 있으면 추출해서 보관

---

## Step 2 — 담당자 확인

PRD frontmatter의 `agents.owner` 기반으로 담당자 후보 출력:

```
담당자 후보: {agents.owner}
변경하려면 이름 입력, 그대로면 엔터
```

---

## Step 3 — Jira 티켓 생성

Atlassian MCP 인증 확인 (미인증 시 `mcp__atlassian__authenticate` 실행).

이슈 생성 (`MDWEB` 프로젝트):
- `summary`: `{Site | Admin} | {PRD 제목}` 형식으로 작성
  - `Site |` — 웹사이트·마케팅 관련 (checkout, landing, features page 등)
  - `Admin |` — Team Console·Clover Admin 관련 (userpool, license, activity log 등)
  - PRD 내용 기반으로 추천 prefix 제안 후 사용자에게 확인 (`Site | 로 할까요?`)
  - 사용자가 수정 없이 진행하면 그대로 사용
- `description`: 아래 순서로 구성
  1. Slack 링크 (PRD frontmatter에 있으면)
  2. Figma 링크 (있으면)
  3. PRD 전문
- `assignee`: Step 2에서 확인된 담당자
- `priority`: frontmatter priority 기반 (P0→Highest, P1→High, P2→Medium, P3→Low)

---

## Step 4 — 완료 출력

```
Jira 티켓 생성 완료
티켓: MDWEB-{n}
URL: {jira_url}
PRD: {prd_path}
```

---

입력: $ARGUMENTS
