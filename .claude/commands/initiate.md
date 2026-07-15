# initiate

세션 시작 루틴. MCP 커넥터(Figma, Jira, Confluence, Slack) 연결 상태를 확인하고 작업 컨텍스트를 로드한다.

**왜 필요한가:** MCP 연결이 끊기거나 인증이 만료된 채로 작업하면 Figma 드로잉·Jira 티켓 생성·Slack 읽기가 모두 무음 실패한다. 세션 시작 시 1분으로 30분 삽질을 방지한다.

---

## Step 1 — MCP 커넥터 확인

아래 4개를 **병렬로** 호출한다. 각각 성공/실패를 기록한다.

| 커넥터 | 도구 | 확인 기준 |
|--------|------|-----------|
| Figma  | `mcp__figma__whoami` | 이름·이메일 반환 시 ✅ |
| Jira / Confluence | `mcp__atlassian__atlassianUserInfo` | 계정 정보 반환 시 ✅ |
| Slack  | `mcp__claude_ai_Slack__slack_search_channels` (query: "general") | 채널 목록 반환 시 ✅ |

실패 시 아래 복구 안내를 즉시 출력한다:

```
❌ Figma 연결 실패
   → Figma MCP는 settings.json에 global 등록됨
   → Claude Code 재시작 후 재시도, 또는 MCP 서버 상태 확인

❌ Jira / Confluence 연결 실패
   → .mcp.json 기반 OAuth 필요 (프로젝트별 1회 인증)
   → ! npx @anthropic-ai/mcp-client auth (또는 재인증 명령 실행)

❌ Slack 연결 실패
   → Slack MCP는 settings.json에 global 등록됨
   → Claude Code 재시작 후 재시도
```

---

## Step 2 — 활성 프로젝트 TODO 로드

`docs/backlog/projects/` 디렉토리에서 **가장 최근에 수정된 파일 1개**를 찾는다.

파일이 있으면:
1. frontmatter에서 `project` 이름과 `updated` 날짜를 읽는다.
2. `## TODO` 섹션 항목을 추출한다.
3. `## 관련 Jira 티켓` 섹션 항목을 추출한다.
4. 리포트에 프로젝트명·TODO·Jira 티켓을 함께 출력한다.

파일이 없으면: "활성 프로젝트 없음"으로 표시한다.

---

## Step 3 — 메모리 로드

`~/.claude/projects/.../memory/MEMORY.md` 가 세션 컨텍스트에 이미 포함되어 있으므로 별도 파일 읽기 없이 확인됐음을 기록한다.

---

## Step 3.5 — Slack 요청 미리보기 (가벼운 스캔)

**Slack 커넥터가 ✅일 때만 실행한다.** ❌면 이 단계 전체를 건너뛰고 리포트에서 `📥 Slack 요청` 블록도 생략한다.

목적: 요청 채널에 미티켓 항목이 쌓였는지 **카운트만** 빠르게 파악. 여기서는 절대 정독·분류·티켓 생성하지 않는다 — 그건 `/slackrequest`의 일이다.

1. `cell_mdweb`·`cell_request_to_mdweb` 두 채널 ID를 `slack_search_channels`로 조회.
2. `slack_read_channel`로 최근 메시지 읽기 (limit: 30). **스레드는 열지 않는다.**
3. 72시간 이내 메시지 중 **요청성 신호**가 있는 건수만 센다:
   - 신호: 질문·버그 보고·수정 요청·`@mention` 호출·`urgent`/`긴급`/`재현` 등
   - 단순 잡담·봇 알림·이미 "처리 완료" 언급된 건은 제외
4. 채널별 추정 건수만 기록. (정확한 중복 판별 X — 어디까지나 미리보기)

스캔 중 에러가 나도 멈추지 않는다. 카운트를 `?`로 두고 리포트를 계속한다.

---

## Step 4 — 상태 리포트 출력

아래 포맷으로 출력한다. 3초 안에 읽힐 수 있도록 짧게.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 세션 준비 완료 — {오늘 날짜}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

커넥터
  Figma          {✅ {이름} / ❌ 연결 안 됨}
  Jira/Confluence {✅ {이름} / ❌ 연결 안 됨}
  Slack          {✅ 연결됨 / ❌ 연결 안 됨}

프로젝트  {project 이름} (updated: {날짜} / 없으면 "활성 프로젝트 없음")
  Jira  {MDWEB-xxx — 제목 / 없음}
  TODO
    1. {첫 번째 항목}
    2. {두 번째 항목}
    ...
  (프로젝트 파일 없으면 "/checkout으로 프로젝트를 저장해두면 다음 세션에 바로 이어받을 수 있어요")

📥 Slack 요청  (Slack ✅일 때만 표시. ❌면 블록 전체 생략)
  cell_mdweb             {N}건 (미티켓 추정)
  cell_request_to_mdweb  {N}건
  → 지금 트리아지 할까요? (/slackrequest 실행)
  (두 채널 합계 0건이면 "요청 채널 깨끗해요 — 미티켓 요청 없음" 한 줄로 대체하고 아래 확인 질문 생략)

주요 규칙 (자동 적용)
  ux-writing · copywriting · figma-annotation · figma-layout
  atlassian · jira-ticket · prd-writing

사용 가능한 주요 커맨드
  /cowork        기획 루프 (아이디어 → PRD → Jira)
  /slackrequest  Slack 요청 채널 → MDWEB-625 하위 트리아지
  /create-jira   PRD → Jira 티켓 생성
  /slack-to-jira Slack 스레드 → Jira 이슈
  /checkout      세션 마감 (TODO 저장 + 실수 노트)
  /handoff       세션 종료 전 인계 (구현 중간)
  /eod           코드 컴플라이언스 + 빌드 확인

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 커넥터가 있으면 상단 복구 안내를 따른다.
모두 ✅면 바로 시작할 수 있다.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 5 — Slack 요청 트리아지 위임 (조건부)

Step 3.5에서 미티켓 추정 건수가 **1건 이상**이고, 리포트에 확인 질문을 띄운 경우:

- 사용자가 **YES / "해줘" / "트리아지"** 등으로 응답 → `/slackrequest` 스킬을 그대로 실행한다 (Step 1부터). 미리보기 카운트를 재사용하지 말고 slackrequest의 정식 워크플로우(72시간 필터·중복 판별·분류 표·생성 전 확인)를 처음부터 탄다.
- 사용자가 **NO / 무응답 / 다른 작업 지시** → 위임하지 않고 세션을 그대로 넘긴다. 강제하지 않는다.

추정 건수가 0건이면 이 단계 자체를 건너뛴다.

---

## 중단 조건

커넥터 확인 중 에러가 발생해도 **절대 멈추지 않는다.** 실패한 커넥터는 ❌로 표시하고 나머지를 계속 진행한다.

Slack 요청 스캔(Step 3.5)이 실패해도 마찬가지로 멈추지 않는다 — 카운트를 `?`로 두고 리포트를 완료한 뒤, 트리아지 위임 여부는 사용자에게 맡긴다.
