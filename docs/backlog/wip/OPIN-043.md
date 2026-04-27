---
id: "OPIN-043"
title: "Survey 응답 제출 전체 플로우 완성"
priority: "P1"
status: "in-progress"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-be", "opin-design"]
created: "2026-04-10"
updated: "2026-04-10"
sprint: "2026-W15"
policy_refs:
  - "docs/policy/survey.md"
  - "docs/policy/shared.md"
  - "docs/policy/abuse.md"
code_refs:
  - "src/app/survey/[id]/respond/SurveyRespondClient.tsx"
  - "src/app/survey/[id]/respond/page.tsx"
  - "src/app/api/surveys/[id]/respond/route.ts"
---

## 목적

설문에 참여한 응답자가 모든 질문에 답하고 제출까지 완료할 수 있어야 한다.
이 플로우가 막히면 Survey의 핵심 수익 지표(응답 수집)가 발생하지 않는다.

## 현황

page.tsx, SurveyRespondClient.tsx, /api/.../respond/route.ts 모두 존재.
페이지 가드(중복 참여, 마감, capacity) 로직은 page.tsx에 구현 완료.
SurveyRespondClient.tsx에 조건부 로직(getNextQuestion)과 블록 상태 처리 있음.

**미완성 범위:**

- 필수 질문 미응답 시 제출 차단 및 인라인 에러 표시
- 제출 성공 후 완료 화면 전환 (kind: "success" 상태)
- 프로그레스 표시 (진행률)
- 섹션 간 이동 시 스크롤 처리

## 완료 조건 (Definition of Done)

- [ ] 모든 required 질문에 답하지 않고 제출 시 해당 질문 위치로 스크롤 + 인라인 에러
- [ ] 제출 성공 시 kind: "success" 화면 전환 (애니메이션 포함)
- [ ] 성공 화면에 "홈으로 가기" + "결과 보기" 버튼
- [ ] 프리뷰 모드에서는 실제 DB 저장 없이 성공 화면만 보여줌
- [ ] 섹션 전환 시 최상단 스크롤
- [ ] 제출 중 중복 요청 방지 (isSubmitting guard)
- [ ] /api/.../respond POST 에서 already_responded, survey_full 에러 처리
- [ ] TypeScript strict 통과
- [ ] npm run build 에러 없음
- [ ] 모바일(375px) 레이아웃 정상 작동

## UX 리서치

### 레퍼런스 패턴

| 서비스       | 패턴                                         | OPINION 적용 포인트                             |
| ------------ | -------------------------------------------- | ----------------------------------------------- |
| Typeform     | One question at a time + 진행률 바 상단 고정 | 섹션 단위로 진행률 표시 (질문 단위는 정보 과다) |
| Google Forms | 섹션별 페이지 분리 + 이전/다음 버튼          | 섹션이 있을 때는 페이지 단위 이동               |
| Toss         | 제출 후 포인트 적립 애니메이션               | 설문 완료 시 적립 예정 포인트 + 콘페티          |
| SurveyMonkey | 필수 항목 미입력 시 빨간 인라인 에러         | 스크롤 없이 인라인 표시 필수                    |

### 핵심 UX 결정

- **진행률 표시 단위**: 섹션 단위 — 질문 수가 많으면 퍼센트가 오히려 불안감 유발
- **제출 버튼 위치**: 마지막 질문 하단 고정 (float 아님) — 스크롤 흐름 방해 없이
- **에러 표시**: 제출 시도 시만 에러 표시 (입력 중 실시간 에러는 UX 방해)
- **성공 화면 전환**: 페이지 이동(redirect) 아닌 동일 페이지 내 상태 전환 — 뒤로가기 방지

### UX Writing (확정 문구)

| 상황              | 문구                                            |
| ----------------- | ----------------------------------------------- |
| 필수 질문 미응답  | "필수 항목이에요. 답해 주세요."                 |
| 제출 버튼         | "제출하기"                                      |
| 제출 중           | "제출하기" (loading state)                      |
| 성공 타이틀       | "답변을 제출했어요"                             |
| 성공 서브         | "참여해 주셔서 감사해요."                       |
| 성공 CTA 1        | "결과 보기"                                     |
| 성공 CTA 2        | "홈으로 가기"                                   |
| already_responded | "이미 참여한 설문이에요. 결과를 확인해 보세요." |
| survey_full       | "마감된 설문이에요."                            |

## 구현 힌트

### 기술 스펙

API: `POST /api/surveys/[id]/respond`

- Request: `{ answers: { question_id: string, value: AnswerValue }[], started_at: string }`
- Response 200: `{ response_id: string }`
- Response 409: `{ error: 'already_responded' }`
- Response 410: `{ error: 'survey_full' | 'SURVEY_FULL' }`
- Response 422: `{ error: 'survey_not_published' | 'SURVEY_NOT_PUBLISHED' }`

클라이언트 상태 머신 (현재 PageState 타입 확장):

```typescript
type PageState =
  | { kind: "form" }
  | { kind: "blocked"; reason: RespondBlockReason }
  | { kind: "success"; responseId: string }
  | { kind: "submitting" }; // 추가 필요
```

필수 질문 검증 함수 (클라이언트):

```typescript
function getFirstUnansweredRequired(
  questions: Question[],
  answers: Record<string, AnswerValue>
): Question | null;
```

스크롤 처리: `questionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'center' })`

### 예외 처리

| 케이스                   | 처리 방법                                                       |
| ------------------------ | --------------------------------------------------------------- |
| 필수 질문 미응답         | 첫 번째 미응답 질문으로 smooth scroll + 인라인 에러             |
| 네트워크 오류            | 토스트: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." |
| already_responded (race) | blocked 상태 전환 + 안내 문구                                   |
| survey_full (race)       | blocked 상태 전환 + 안내 문구                                   |
| 프리뷰 모드 제출         | API 호출 없이 kind: 'success' 상태로 전환                       |

## 정책 참고

- **survey.md 5.8**: 중복 참여 방지는 user_id 기반 (비로그인은 IP)
- **shared.md**: responses 테이블 row 생성 = 참여 완료, 이후 수정 불가
- **abuse.md**: 동일 IP 1분 내 3회 이상 제출 시 throttle 적용

## CS 문의 예상 지점

- "제출했는데 완료가 안 됐어요": response_id 조회로 실제 저장 여부 확인
- "이미 참여했다고 나와요": 계정 공유 또는 세션 충돌 — user_id 기반 responses 조회 확인
- "중간에 튕겼어요": 부분 저장 없음, 재시작 안내
