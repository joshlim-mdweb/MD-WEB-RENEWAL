전체 에이전트 파일을 검토하고 CLAUDE.md 규칙과의 일관성을 확인한다.

## 실행 순서

1. `.claude/agents/` 파일 목록 읽기
2. CLAUDE.md의 Team Operating Model 테이블 읽기
3. 각 에이전트 파일의 frontmatter(name, description) 확인

## 검사 항목

### 구조 검사

- [ ] 모든 에이전트 파일에 `name`과 `description` frontmatter가 있는가
- [ ] CLAUDE.md 팀 테이블과 실제 파일 목록이 일치하는가 (누락/잉여 에이전트 탐지)
- [ ] `tools: mcp__*` 와일드카드 패턴 사용 여부 (Known Issue — 사용 금지)

### 컨텍스트 일관성

- [ ] 각 에이전트의 Key Files가 현재 폴더 구조와 일치하는가
- [ ] 팀장 에이전트(survey-builder-lead, poll-lead, main-lead)가 산하 에이전트를 올바르게 참조하는가
- [ ] 중복된 역할 정의가 없는가

## 출력 형식

이슈별로:

- 에이전트: [파일명]
- 문제: [무엇이 잘못됐는가]
- 수정 방법: [어떻게 고쳐야 하는가]

자동으로 수정 가능한 항목은 바로 수정하고, 판단이 필요한 항목은 목록으로 출력한다.
