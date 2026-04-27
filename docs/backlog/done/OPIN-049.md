---
id: "OPIN-049"
title: "피봇 — URL/GitHub AI 설문 자동 생성 + Poll/Withdraw 제거"
priority: "P0"
status: "in-progress"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-be"]
created: "2026-04-11"
updated: "2026-04-11"
sprint: "W15"
policy_refs: []
code_refs:
  - "src/app/api/analyze/route.ts"
  - "src/app/(main)/analyze/page.tsx"
  - "src/app/(main)/page.tsx"
  - "src/app/(main)/HomeContent.tsx"
---

## 목적

서비스 창작자가 URL 또는 GitHub 링크를 붙여넣으면 AI가 피드백 설문을 자동 생성해주는 핵심 피봇 기능을 구현한다.
기존 Poll/출금 기능을 제거해 제품 방향을 명확히 한다.

## 현황

완료된 작업:

- [x] Poll 전체 제거 (pages, components, API, types)
- [x] Withdraw 전체 제거 (components, API, nav)
- [x] `@anthropic-ai/sdk` 설치
- [x] `/api/analyze` 구현 (URL fetch + GitHub API + Claude 설문 생성)

남은 작업:

- [ ] `/analyze` 페이지 UI (입력 → 분석 → 설문 생성 → builder redirect)
- [ ] 홈 페이지 hero 업데이트 (새 제품 방향 반영)
- [ ] `ANTHROPIC_API_KEY` .env.local 추가 안내
- [ ] 빌드 확인

## 완료 조건 (Definition of Done)

- [x] Poll 관련 파일 전체 제거 (빌드 에러 없음)
- [x] Withdraw 관련 파일 전체 제거
- [x] `/api/analyze` POST 구현 (URL + GitHub 분기)
- [ ] `/analyze` 페이지: URL/GitHub 입력 → 분석 → 설문 자동 생성 → builder로 이동
- [ ] 홈 히어로에 "분석하기" CTA 추가
- [ ] TypeScript strict 통과
- [ ] npm run build 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 핵심 UX 결정

- **입력 방식**: 단일 텍스트 입력 (URL/GitHub 자동 감지) — 두 개의 탭보다 단순함 우선
- **분석 중 상태**: 로딩 스피너 + "분석하고 있어요..." 메시지
- **결과 표시**: 생성된 질문 미리보기 → "이 설문으로 만들기" 버튼
- **에러**: API 키 없을 때 503 → "서비스 준비 중이에요" 처리

### UX Writing

| 상황             | 문구                                                   |
| ---------------- | ------------------------------------------------------ |
| 입력 placeholder | "서비스 URL 또는 GitHub 링크를 붙여넣어 주세요"        |
| 분석 중          | "분석하고 있어요..."                                   |
| 생성 완료        | "설문 {N}개를 만들었어요"                              |
| URL 오류         | "올바른 URL을 입력해 주세요"                           |
| 서버 오류        | "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요" |

## 구현 힌트

### API 플로우

```
POST /api/analyze { source: "https://..." }
→ { title, description, questions: [{type, title, options?}] }

POST /api/surveys { title, description }
→ { id }

POST /api/surveys/[id]/questions (× N, 순차)
→ redirect /survey/[id]/edit
```

### 예외 처리

| 케이스                 | 처리 방법                           |
| ---------------------- | ----------------------------------- |
| 미로그인               | 로그인 페이지로 redirect            |
| ANTHROPIC_API_KEY 없음 | 503 → "서비스 준비 중이에요"        |
| URL fetch 실패         | og 메타 없어도 URL 자체로 분석 시도 |
| GitHub private repo    | 공개 정보만으로 분석                |
