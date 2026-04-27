---
ticket_id: "OPIN-043"
date: "2026-04-15"
qa_agent: "opin-qa"
result: "PARTIAL"
loop_count: 1
---

## QA 리포트

**티켓:** OPIN-043 — Survey 응답 제출 플로우
**결과:** PARTIAL
**루프:** 1회차

---

## 완료 조건 체크

| 조건                                | 결과 | 비고                                                                                        |
| ----------------------------------- | ---- | ------------------------------------------------------------------------------------------- |
| 인트로 화면 (description 있을 때)   | ✅   | description 있으면 intro phase 노출                                                         |
| 인트로 화면 (description 없을 때)   | ✅   | 바로 form phase 진입                                                                        |
| 폼 렌더링 (7개 질문 타입)           | ✅   | short_text, long_text, scale, grade, multiple_choice, checkbox, dropdown, ranking 모두 구현 |
| 필수 질문 미응답 validation         | ✅   | getFirstUnansweredRequired + scrollIntoView                                                 |
| 중복 제출 방지 (isSubmitting guard) | ✅   | pageState.kind === "submitting" 체크                                                        |
| 이미 참여 에러 처리                 | ✅   | 409 → already_responded BlockedScreen                                                       |
| 마감 (survey_full) 에러 처리        | ✅   | 403 SURVEY_FULL → BlockedScreen                                                             |
| 포인트 부족 에러 처리               | ✅   | 402 → networkError 메시지                                                                   |
| 성공 화면                           | ✅   | SuccessScreen 렌더링                                                                        |
| 프리뷰 모드                         | ✅   | preview=true → 실제 제출 없이 success                                                       |
| 일일 참여 한도 처리 (daily_limit)   | ❌   | BUG-1 참조 — API가 daily_limit 코드를 반환하지 않음                                         |
| 500P 차감 동의 모달                 | ⚠️   | BUG-2 참조 — 모달이 인트로 화면 뒤에 숨음                                                   |
| startpoint 질문 타입 (인삿말 화면)  | ❌   | 미구현 — QuestionType에 없음                                                                |
| TypeScript strict                   | ✅   | 타입 오류 없음 (수동 분석)                                                                  |
| npm run build                       | -    | 실행 불가 (환경 제한) — 이전 세션 기록: PASS                                                |

---

## 발견된 이슈

### 버그 (블로킹)

| #     | 심각도 | 설명                                                                                  | 재현 조건                                                                              |
| ----- | ------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| BUG-1 | High   | daily_limit 처리 경로 단절 — API가 daily_limit_reached 코드를 절대 반환하지 않는다    | 하루 5개 설문 참여 후 6번째 시도, 포인트 500P 미만일 때                                |
| BUG-2 | Medium | PointDeductionModal이 인트로 화면에서 노출되지 않는다                                 | requiresPointDeduction=true, description 있는 설문 진입 시                             |
| BUG-3 | Medium | 정책 위반 — 일일 무료 참여 한도가 3회인데 코드는 5회로 구현됨                         | 코드: `todaySurveyCount >= 5` / 정책(survey.md §5.6): "하루 무료 참여: 3회"            |
| BUG-4 | Low    | RPC `spend_survey_access_points`의 일일 카운트가 UTC+9 기준으로 계산되지 않을 수 있음 | page.tsx의 todaySurveyCount는 `setHours(0,0,0,0)` (로컬 시간대), RPC는 Asia/Seoul 고정 |

### 버그 상세

#### BUG-1: daily_limit 처리 경로 단절 (High)

API `POST /api/surveys/[id]/respond`의 `spend_survey_access_points` RPC는 포인트 부족 시 `INSUFFICIENT_POINTS`를 raise하고 HTTP 402를 반환한다. "한도 초과 but 포인트 충분" 케이스는 RPC 내부에서 그냥 통과(RETURN)한다 — `daily_limit_reached` 코드를 raise하지 않는다.

클라이언트 `SurveyRespondClient.tsx`(line 975)는 `daily_limit_reached`를 기다리지만, API가 이 코드를 반환하는 경로가 존재하지 않는다.

**결과:** 사용자가 하루 5회 초과 + 500P 보유 시 → 정상 제출됨 (의도한 동작). 하지만 `BlockedScreen reason="daily_limit"`이 렌더링되는 시나리오는 현재 구현에서 도달 불가능(dead code).

정책(survey.md §5.6)의 "참여 제한 도달 시 메시지: 오늘 무료 참여를 모두 사용했어요. 500P를 사용하면 더 참여할 수 있어요."가 노출되지 않음. 포인트 부족 시에는 402→networkError로 노출되므로 최소한의 에러 메시지는 있으나, 정책에서 요구하는 맥락("무료 참여 소진 + 500P 차감 안내")과 다른 메시지("포인트가 부족해요")가 표시된다.

#### BUG-2: PointDeductionModal이 인트로 화면에서 노출되지 않음 (Medium)

`SurveyRespondClient`의 렌더링 순서:

1. `requiresPointDeduction && !preview && !canAfford` → PointBlockScreen (포인트 부족)
2. `pageState.kind === "blocked"` → BlockedScreen
3. `pageState.kind === "success"` → SuccessScreen
4. `phase === "intro" && surveyDescription` → **인트로 화면 반환 (early return)**
5. `return <>` — 여기서 `{pointGateState === "pending" && <PointDeductionModal />}` 렌더링

description이 있으면 step 4에서 early return하므로 `PointDeductionModal`이 렌더링되지 않는다. 사용자는 인트로에서 "시작하기"를 누르면 바로 폼으로 진입하고, 500P가 차감될 것이라는 동의 없이 제출을 시도하게 된다. 실제 차감은 POST 시 RPC에서 일어나므로 사용자는 동의 없이 500P가 차감된다.

#### BUG-3: 일일 무료 참여 한도 정책 위반 (Medium)

| 위치               | 한도 값                                 |
| ------------------ | --------------------------------------- |
| `survey.md §5.6`   | **3회**                                 |
| `page.tsx` line 62 | **5회** (`>= 5`)                        |
| `RPC` line 20      | **5회** (`<= 4` = 0~4번 = 5회까지 무료) |

정책은 3회인데 구현은 5회. 어느 쪽이 맞는지 PM 확인 필요.

#### BUG-4: 시간대 불일치 가능성 (Low)

`page.tsx`의 `todayStart.setHours(0,0,0,0)`는 브라우저/서버의 **로컬 시간대** 기준. RPC는 `Asia/Seoul` 고정. 서버가 UTC 환경(Supabase 기본)이라면 page.tsx의 사전 계산과 RPC의 실제 차감 기준이 최대 9시간 차이날 수 있다. 사전 게이트(requiresPointDeduction)와 실제 RPC 결과가 불일치하는 엣지가 발생할 수 있다.

### 미구현 항목

- **startpoint 질문 타입 없음:** 사용자가 언급한 "안녕하세요, 이 설문은..." 형태의 인삿말 화면은 현재 `QuestionType`에 `startpoint`가 존재하지 않는다. `endpoint`만 있다. 빌더에서 startpoint를 생성할 수 없고, 응답 페이지도 이를 처리하지 않는다.
- **인트로 화면이 `description` 필드에 의존:** 현재 인트로 화면은 `survey.description`이 있을 때만 표시된다. startpoint 질문 타입으로 인삿말/참여 조건/예상 소요 시간을 구조적으로 표현하는 것이 정책 및 UX 상 더 적합하다.

---

## PM에게 전달 사항

**result: PARTIAL**

현재 구현은 기본 응답 제출 플로우(폼→제출→성공)는 완성되어 있으나, 아래 사항 확인 및 결정이 필요합니다.

### 즉시 결정 필요

1. **일일 무료 참여 한도 — 3회 vs 5회?**
   - `survey.md §5.6`은 3회, 코드는 5회. 어느 게 맞는지 PM 결정 후 둘 중 하나를 수정해야 합니다.
   - poll은 5회/일, survey는 3회/일로 다르게 설계된 게 맞는지 확인.

2. **`startpoint` 질문 타입 추가 여부 — MVP 범위인지?**
   - 사용자 언급대로 인삿말/소개/참여 조건을 구조적으로 보여주려면 빌더와 응답 페이지 모두 수정 필요.
   - 현재 `description` 필드로 임시 처리 중. MVP에서 startpoint를 별도 타입으로 구현할지 결정 필요.

### 수정 필요 (구현)

- **BUG-2 (Medium):** PointDeductionModal이 인트로 화면이 있을 때 노출되지 않는 렌더링 순서 버그. 인트로 화면에서 "시작하기" 클릭 시 모달을 표시하거나, 모달을 인트로 화면 위에 렌더링하도록 수정.
- **BUG-1 (High):** `daily_limit_reached` 처리 경로가 dead code. API가 이 코드를 반환하는 경로를 추가하거나, 클라이언트의 해당 분기를 제거하고 402 처리로 통합.

### 수정 권장 (낮은 우선순위)

- **BUG-4:** 서버 시간대 확인 후 `page.tsx`의 `todayStart` 계산을 UTC+9 고정으로 맞추거나, sever component에서 KST 기준으로 계산.

---

## Regression 체크

| 영향 범위                    | 상태                                     |
| ---------------------------- | ---------------------------------------- |
| `/survey/[id]` (설문 상세)   | 영향 없음                                |
| `/my` (마이페이지 참여 내역) | 정상 — responses 테이블 insert 방식 동일 |
| `/api/surveys/[id]` (GET)    | 영향 없음                                |
| Poll 참여 플로우             | 영향 없음 (별도 테이블)                  |

---

## Session Handoff

**구현 상태:**

- 변경된 파일: `src/app/api/surveys/[id]/respond/route.ts`, `src/app/(main)/survey/[id]/respond/page.tsx`, `src/app/(main)/survey/[id]/respond/SurveyRespondClient.tsx`
- 완료된 것: 기본 응답 제출 플로우 전체, 7개 질문 타입 렌더링, 중복 제출 방지, 포인트 게이트, 프리뷰 모드
- 의도적으로 제외한 것: 조건부 로직(next_target) 기반 분기 응답 — QuestionCard에 routing 없음

**다음 세션에서 알아야 할 것:**

- daily_limit 3회 vs 5회는 PM 결정 사항. 코드 수정 전 확인 필요.
- startpoint 질문 타입은 현재 DB 스키마(QuestionType)에 없어 마이그레이션 + 빌더 + 응답 페이지 동시 수정 필요.
- BUG-2 수정 시: intro phase 렌더링 블록 안에서 PointDeductionModal을 같이 렌더링하거나, phase를 "intro"로 두되 modal을 그 위에 overlay로 띄우는 방식 검토.

**다음 세션 시작 액션:**

1. PM에게 한도(3회 vs 5회) 확인
2. BUG-2 PointDeductionModal 렌더링 순서 수정 (opin-fe)
3. startpoint MVP 범위 결정 후 범위 확정되면 별도 티켓으로 분리
