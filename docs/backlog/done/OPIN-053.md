---
id: "OPIN-053"
title: "설문 생성 진입점 — 3-option 선택 플로우"
priority: "P2"
status: "ready"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-design"]
created: "2026-04-12"
updated: "2026-04-12"
sprint: "W16"
policy_refs:
  - "docs/policy/survey.md#5.11"
code_refs:
  - "src/app/(builder)/survey/new/page.tsx"
  - "src/app/(builder)/layout.tsx"
---

## 목적

설문을 만들려는 사용자가 자신의 상황에 맞는 시작 방법을 직접 고를 수 있어야 한다.
현재 `/survey/new` 페이지가 URL 입력 중심으로만 구성되어 있어, URL 없이 설문을 만들고 싶은 사용자나 텍스트 프롬프트로 AI를 쓰고 싶은 사용자가 진입 경로를 찾지 못하는 전환 손실이 발생한다.

## 현황

`src/app/(builder)/survey/new/page.tsx`에 이미 두 가지 기능이 존재한다:

- URL 분석 → AI 설문 생성 (`handleAnalyze` → `pageState: "analyzing" | "result"`)
- 빈 설문 직접 만들기 (`handleCreateBlank` → `/survey/{id}/edit`)

현재 UI는 URL 입력창이 주(primary) 옵션이고 "빈 설문으로 직접 만들기"가 neutral 버튼으로 종속되어 있다. 프롬프트 진입점은 미구현 상태다.

재사용 가능 코드:

- `handleCreateBlank` — 빈 설문 생성 로직 그대로 재사용
- `handleAnalyze` + `handleCreate` — URL 분석 플로우 그대로 재사용
- `POST /api/analyze` — `source` 파라미터를 URL 대신 텍스트 프롬프트로도 전달 가능한지 확인 필요

## 완료 조건 (Definition of Done)

- [ ] `/survey/new` 진입 시 3개 옵션 선택 화면이 최초로 표시된다
- [ ] "직접 만들기" 선택 → 빈 설문 즉시 생성 후 `/survey/{id}/edit` 이동
- [ ] "프롬프트로 만들기" 선택 → 텍스트 입력 UI 표시 → AI 생성 → result 화면 → Builder
- [ ] "URL로 만들기" 선택 → 기존 URL 입력 UI 표시 → 기존 플로우 그대로
- [ ] 옵션 선택 후 "뒤로가기" 버튼으로 선택 화면으로 돌아올 수 있다
- [ ] 비로그인 상태에서 옵션 선택 시 로그인 유도 (`/login?redirect=/survey/new`)
- [ ] 3개 옵션 카드 모두 loading / error / 선택된 상태 처리
- [ ] TypeScript strict 통과
- [ ] `npm run build` 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 레퍼런스 패턴

| 서비스       | 패턴                                                                | OPINION 적용 포인트               |
| ------------ | ------------------------------------------------------------------- | --------------------------------- |
| Notion       | "템플릿으로 시작 / 빈 페이지" 2-option 선택                         | 카드형 옵션 선택 후 즉시 진입     |
| Typeform     | 첫 화면에서 "Start from scratch / Use a template / Import" 3-option | 아이콘 + 짧은 설명 구조           |
| Google Forms | 빈 폼 / 템플릿 갤러리 2-path                                        | 진입 후 선택 (모달 아닌 페이지)   |
| Tally        | "Start blank / Use AI" 2-option with AI가 primary CTA               | AI를 solid CTA로 배치해 전환 유도 |

### 핵심 UX 결정

- **선택 UI 방식**: 모달 아닌 페이지 인라인 — `/survey/new`가 이미 전용 페이지이므로 모달 오버헤드 불필요. `pageState`를 `"select" | "prompt" | "url" | "analyzing" | "result"`로 확장.
- **Primary CTA 배치**: "프롬프트로 만들기"를 solid 카드로 배치 (AI 전환율 측정 목적). "직접 만들기"는 neutral. "URL로 만들기"는 ghost.
- **프롬프트 API**: `/api/analyze`의 `source` 파라미터가 URL과 텍스트 프롬프트 모두를 수용하는지 먼저 확인. 수용 불가 시 `source_type: "prompt" | "url"` 파라미터 추가.
- **선택 화면 레이아웃**: 3개 카드를 세로 스택으로 배치 (모바일 우선). 데스크탑에서는 가로 3-column.
- **직접 만들기 동작**: 클릭 즉시 API 호출 → 로딩 → Builder 이동 (선택 확인 단계 없음).

### UX Writing (확정 문구)

| 상황                    | 문구                                                   |
| ----------------------- | ------------------------------------------------------ |
| 페이지 헤딩             | "어떻게 시작할까요?"                                   |
| 페이지 서브             | "원하는 방법을 선택하면 바로 시작할 수 있어요"         |
| 옵션 1 레이블           | "직접 만들기"                                          |
| 옵션 1 설명             | "빈 캔버스에서 질문을 하나씩 추가해요"                 |
| 옵션 2 레이블           | "AI로 만들기"                                          |
| 옵션 2 설명             | "원하는 설문 내용을 말하면 AI가 초안을 만들어줘요"     |
| 옵션 3 레이블           | "URL로 만들기"                                         |
| 옵션 3 설명             | "서비스나 페이지 링크를 분석해 설문을 만들어요"        |
| 프롬프트 placeholder    | "예: 신제품 사용성 테스트 설문, 고객 만족도 조사"      |
| 프롬프트 CTA 버튼       | "초안 만들기"                                          |
| URL 입력 placeholder    | "URL 또는 GitHub 링크를 붙여넣어 주세요"               |
| 뒤로가기 버튼           | "다른 방법 선택하기"                                   |
| 직접 만들기 로딩 중     | (버튼 loading 상태 — 별도 문구 불필요)                 |
| 프롬프트 입력 없이 제출 | "설문 내용을 입력해 주세요"                            |
| API 오류                | "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요" |

## 구현 힌트

### 기술 스펙

**State 확장**

```typescript
type PageState = "select" | "prompt" | "url" | "analyzing" | "result";
// 기존: "start" | "analyzing" | "result"
// "start" → "select"로 rename, "prompt" | "url" substate 추가
```

**프롬프트 API 확인 포인트**

`/api/analyze` POST body 현재: `{ source: string }` (URL 문자열)

- URL 여부는 `isValidUrl()` 헬퍼로 구분 가능 → API가 자동 판별하도록 처리 OR
- body에 `{ source: string, type: "url" | "prompt" }` 추가

opin-be 확인 필요: `POST /api/analyze`가 URL이 아닌 텍스트도 Gemini에 전달할 수 있는가?

**3-option 카드 컴포넌트**

```typescript
interface CreationOptionCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  variant: "primary" | "neutral" | "ghost"; // solid 카드 강조 수준
  onClick: () => void;
  loading?: boolean;
}
```

**pageState 전이**

```
"select"
  → "직접 만들기" 클릭 → API 호출 → builder redirect (pageState 변경 없이 isCreatingBlank로 처리)
  → "AI로 만들기" 클릭 → "prompt"
  → "URL로 만들기" 클릭 → "url"

"prompt"
  → 제출 → "analyzing" → "result"
  → 뒤로가기 → "select"

"url"
  → 분석하기 → "analyzing" → "result"
  → 뒤로가기 → "select"

"result"
  → 뒤로가기 → 이전 substate ("prompt" or "url")
```

**레이아웃**

```
모바일: flex-col, 카드 3개 세로 스택, 각 카드 full-width
데스크탑 (768px+): grid 3-column, 동일 높이
카드 내부: 아이콘 (24px) + 레이블 (TITLE_2) + 설명 (BODY_2)
선택 상태: 클릭 즉시 다음 state로 전환 (selected 스타일 불필요)
```

### 예외 처리

| 케이스                     | 처리 방법                                                              |
| -------------------------- | ---------------------------------------------------------------------- |
| 비로그인 + 어떤 옵션 선택  | `/login?redirect=/survey/new` 리다이렉트 — 옵션 선택 시점에 auth check |
| 프롬프트 빈 값으로 제출    | 인라인 에러: "설문 내용을 입력해 주세요"                               |
| 프롬프트 API 미지원 (503)  | "서비스를 준비하고 있어요. 곧 이용할 수 있어요"                        |
| 직접 만들기 API 실패       | 인라인 에러 + 재시도 가능 (isCreatingBlank false로 복구)               |
| result 화면에서 질문 0개   | "질문이 1개 이상 있어야 만들 수 있어요" (기존 로직 유지)               |
| 모바일에서 result 2-column | 1-column으로 collapse (기존 media query 유지)                          |

## 이벤트 로깅 포인트

| 이벤트              | 로그 항목                                                                   |
| ------------------- | --------------------------------------------------------------------------- |
| 옵션 선택           | `survey_creation_option_selected`: option_type (`blank` / `prompt` / `url`) |
| 프롬프트 제출       | `survey_ai_prompt_submitted`: prompt_length                                 |
| URL 분석 시작       | `survey_url_analyze_started`: url_domain                                    |
| Builder 진입        | `survey_builder_entered`: source (`blank` / `prompt` / `url`)               |
| 옵션 선택 화면 이탈 | `survey_creation_abandoned`: abandoned_at (`select` / `prompt` / `url`)     |

## 정책 참고

- **survey.md#5.7**: AI는 초안 생성, 질문 개선, 옵션 추천 포함 — 프롬프트 기반 생성도 이 범주
- **survey.md#5.8**: AI 기능은 토큰 기반 (플랜 기반 아님) — 추후 크레딧 차감 연결 고려
- **monetization.md**: Free 플랜 AI 기능 차단 (`"AI 기능은 Pro 이상 플랜에서 사용할 수 있어요"`) — MVP에서는 플랜 체크 없이 진행, 추후 연결

## CS 문의 예상 지점

- "AI로 만들기를 눌렀는데 오류가 나요": 서버 오류 → 인라인 에러 메시지 표시 + 다시 시도 안내
- "프롬프트로 입력했는데 엉뚱한 설문이 만들어졌어요": result 화면에서 질문 직접 편집 가능 → 빌더에서 추가 수정 안내
- "URL이 없는데 어떻게 시작하나요?": "직접 만들기" 또는 "AI로 만들기" 옵션 안내
