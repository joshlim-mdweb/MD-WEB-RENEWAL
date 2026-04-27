---
id: "OPIN-045"
title: "Survey Publish 유효성 검증 강화 — 서버사이드"
priority: "P2"
status: "ready"
agents:
  - owner: "opin-be"
  - reviewer: "opin-qa"
  - consulted: ["opin-fe"]
created: "2026-04-10"
updated: "2026-04-10"
sprint: "2026-W16"
policy_refs:
  - "docs/policy/survey.md"
  - "docs/policy/shared.md"
code_refs:
  - "src/app/api/surveys/[id]/publish/route.ts"
  - "src/lib/survey-validation.ts"
---

## 목적

설문 발행 시 서버에서 필수 조건을 모두 검증해야 한다.
클라이언트 검증만으로는 API 직접 호출로 우회 가능하다.

## 현황

`src/lib/survey-validation.ts`의 `validateSurveyForPublish` 현재 검증 범위:

- survey.title 비어있으면 에러
- questions 배열이 비어있으면 에러
- 질문 type별 options 유무 체크

**미검증 범위:**

- max_participants가 음수이거나 0인 경우
- 동일 order_index 중복
- endpoint 타입 질문이 중간에 있는 경우
- 조건부 로직에서 존재하지 않는 question_id를 참조하는 경우

## 완료 조건 (Definition of Done)

- [ ] max_participants 검증: null 허용, 설정 시 1 이상 정수
- [ ] endpoint 질문 위치 검증: order_index 최대값이어야 함
- [ ] 조건부 로직 무결성: conditionalRules의 target question_id가 실제 존재하는지
- [ ] order_index 중복 검증: 동일 survey 내 중복 불가
- [ ] 에러 응답 422 구조 일관성: `{ errors: [{ field, message }] }` 배열
- [ ] 기존 통과 케이스 regression 없음
- [ ] TypeScript strict 통과
- [ ] npm run build 에러 없음

## UX 리서치

### 핵심 UX 결정

- **에러 표시 방식**: 서버 422 에러를 클라이언트가 받아 토스트 + 해당 질문 하이라이트
- **에러 구조**: field별 배열 — 여러 에러 동시 반환 가능하게

### UX Writing (확정 문구)

| 에러 케이스           | 문구                                                  |
| --------------------- | ----------------------------------------------------- |
| max_participants 음수 | "참여 인원은 1명 이상으로 설정해 주세요."             |
| endpoint 위치 오류    | "종료 화면은 설문의 마지막에 있어야 해요."            |
| 조건부 로직 참조 오류 | "연결된 질문이 없어요. 조건부 로직을 확인해 주세요."  |
| order_index 중복      | "질문 순서가 중복됐어요. 저장 후 다시 시도해 주세요." |

## 구현 힌트

### 기술 스펙

수정 파일: `src/lib/survey-validation.ts` (canonical 위치)

ValidationSurvey 타입 확장:

```typescript
interface ValidationSurvey {
  title: string;
  questions: ValidationQuestion[];
  max_participants?: number | null; // 추가
}
```

추가할 검증 함수:

```typescript
function validateMaxParticipants(value: number | null | undefined): ValidationError | null;
function validateEndpointPosition(questions: ValidationQuestion[]): ValidationError | null;
function validateConditionalRefs(questions: ValidationQuestion[]): ValidationError[];
function validateOrderIndexUnique(questions: ValidationQuestion[]): ValidationError | null;
```

publish route.ts에서 max_participants 쿼리 추가:

```typescript
.select(`id, creator_id, title, status, description, max_participants, questions(...)`)
```

에러 응답 구조:

```typescript
// 422
{
  errors: [{ field: "max_participants", message: "참여 인원은 1명 이상으로 설정해 주세요." }];
}
```

### 예외 처리

| 케이스                | HTTP | 에러 코드                   |
| --------------------- | ---- | --------------------------- |
| max_participants < 1  | 422  | `max_participants_invalid`  |
| endpoint 중간 위치    | 422  | `endpoint_position_invalid` |
| 조건부 로직 참조 오류 | 422  | `conditional_ref_invalid`   |
| order_index 중복      | 422  | `order_index_duplicate`     |

## 정책 참고

- **survey.md 5.3**: draft → published 전환 조건 — 검증 실패 시 전환 불가
- **survey.md 5.4**: 발행 후 응답 있으면 구조 편집 제한
- **shared.md**: 발행 실패 시 draft 유지, 삭제 없음

## CS 문의 예상 지점

- "발행이 안 돼요": 422 에러 내 field 값으로 원인 특정 가능

## 운영 포인트

- 검증 로직 변경 시 기존 draft 설문이 발행 불가 상태가 될 수 있음 — 배포 전 현황 파악 필요
- validateSurveyForPublish는 클라이언트·서버 양쪽에서 사용 중 — FE 동시 반영 필요
