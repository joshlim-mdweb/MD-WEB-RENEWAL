특정 에이전트 파일에 새 컨텍스트나 규칙을 추가한다.

## 실행 순서

1. `$ARGUMENTS`에서 에이전트 이름과 업데이트 내용 파싱
   - 예: `opin-fe — 새 컴포넌트 추가 규칙 반영`
   - 예: `survey-builder-lead — 섹션 기능 추가됨`

2. `.claude/agents/<name>.md` 파일 읽기

3. 아래 중 해당하는 섹션을 업데이트:
   - 새 책임이 생겼으면 Core Responsibilities에 추가
   - 새 파일/디렉토리가 생겼으면 Key Files에 추가
   - 새 규칙이 생겼으면 Guardrails에 추가
   - 협업 관계가 바뀌었으면 Collaboration 업데이트
   - description이 더 이상 정확하지 않으면 frontmatter description 업데이트

4. 변경 내용 요약을 출력한다.

업데이트 내용: $ARGUMENTS
