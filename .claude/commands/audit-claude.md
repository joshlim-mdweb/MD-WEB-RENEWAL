CLAUDE.md의 규칙이 현재 코드베이스에서 실제로 지켜지고 있는지 감사한다.

## 감사 항목

### 1. CSS 네이밍 규칙

- `src/components/` 파일들에서 루트 엘리먼트에 semantic class가 있는지 확인
- `_area`, `_wrap`, `_header`, `_body`, `_footer` suffix 패턴 적용 여부

### 2. 색상 하드코딩 금지

- `style={{ color: "#` 패턴으로 인라인 색상 하드코딩 탐지
- design-tokens를 import하지 않고 색상을 직접 사용하는 파일 탐지

### 3. 컴포넌트 export 규칙

- `src/components/ui/`, `src/components/builder/editors/` 등의 index.ts가 실제 컴포넌트를 모두 export하는지 확인

### 4. 타입 안전성

- `any` 타입 사용 여부 탐지
- `as unknown as` 패턴 탐지

### 5. 에이전트 파일 일관성

- `.claude/agents/` 파일들에 name, description frontmatter가 모두 있는지 확인
- CLAUDE.md 팀 테이블과 실제 에이전트 파일 목록이 일치하는지 확인

## 출력 형식

위반 항목을 아래 형식으로 정리한다:

- 규칙: [위반한 규칙]
- 파일: [파일 경로:라인번호]
- 내용: [문제가 되는 코드]
- 수정 방법: [어떻게 고쳐야 하는지]

수정이 필요한 항목 수와 우선순위도 함께 출력한다.
