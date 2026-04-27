---
ticket_id: "OPIN-060"
date: "2026-04-18"
qa_agent: "opin-qa"
result: "PARTIAL"
loop_count: 1
---

## QA 리포트

**티켓:** OPIN-060 — 설문 응답 페이지 — 질문별 페이지네이션 + 섹션 전환 화면
**결과:** PARTIAL
**루프:** 1회차

---

## 완료 조건 체크

| 조건                                                                         | 결과 | 비고                                                                             |
| ---------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------- |
| page.tsx에서 sections 테이블 추가 fetch (survey_id 기준, order_index 정렬)   | ✅   | Promise.all에서 order("order_index", {ascending: true})                          |
| sections fetch 실패 시 폴백 처리                                             | ✅   | `sections ?? []` 폴백. questionsError와 달리 sections 오류는 조용히 빈 배열 처리 |
| SurveyRespondClient에 sections: Section[] prop 전달                          | ✅   | preview 경로/일반 경로 모두 전달                                                 |
| 상태 머신 { sectionIdx, questionIdx } 기반 진행 위치 추적                    | ✅   | RespondStep 타입으로 구현                                                        |
| 질문을 한 번에 하나씩 표시 — "다음으로" 버튼으로 진행                        | ✅   | QuestionCard 단건 렌더 + 하단 고정 버튼                                          |
| 섹션 경계에서 SectionTransitionScreen 표시 — "계속하기" 버튼                 | ✅   | calcNextStep이 section_transition 반환 시 표시                                   |
| 진행 표시: "섹션 N / M · 질문 K / L" (섹션 있음)                             | ✅   | hasSections 분기로 구현. K=answeredCount (질문 번호 아닌 완료 수)                |
| 진행 표시: "질문 K / L" (섹션 없음/1개)                                      | ✅   | hasSections = sections.length > 1                                                |
| 섹션 없는 설문 — 섹션 전환 화면 없이 질문만                                  | ✅   | groupQuestionsBySection이 단일 그룹 반환 + hasSections=false                     |
| 섹션 1개짜리 설문 — 섹션 전환 화면 없음                                      | ✅   | hasSections = false → initialStep이 question으로 시작                            |
| 빈 섹션(questions.length===0) — 다음 섹션으로 즉시 skip                      | ✅   | calcNextStep line 71: questions.length > 0 아니면 다음 section_transition        |
| section_id=null 질문 처리                                                    | ✅   | groupQuestionsBySection에서 unsectioned 배열로 모아 마지막 그룹에 추가           |
| required 질문 미답 시 현재 질문 에러 표시 + 진행 차단                        | ✅   | handleNext에서 setErrorQuestionIds + return                                      |
| 하단 버튼: 마지막 질문에서 "제출하기"                                        | ✅   | isLast = calcNextStep === "submit"                                               |
| nextStep==="submit" 시 doSubmit() 호출                                       | ✅   | handleNext에서 `if (next === "submit") { await doSubmit() }`                     |
| Intro phase (surveyDescription) 유지                                         | ✅   | phase === "intro" 분기 그대로                                                    |
| SuccessScreen / BlockedScreen / PointDeductionModal 유지                     | ✅   | 구조 변경 없음                                                                   |
| QuestionCard의 questionRef prop optional 처리                                | ✅   | `questionRef?: React.RefObject<HTMLDivElement \| null>`                          |
| TypeScript any 사용 없음                                                     | ✅   | grep 결과 0건                                                                    |
| 색상 hex 하드코딩 없음                                                       | ✅   | grep 결과 0건                                                                    |
| TYPOGRAPHY.STYLE.\* 스프레드 사용                                            | ✅   | 전체 텍스트 스타일에서 사용 확인                                                 |
| 버튼 텍스트 UX Writing 준수 ("계속하기", "다음으로", "제출하기", "이전으로") | ✅   | 티켓 DoD 확정 문구 준수                                                          |
| TypeScript strict 통과                                                       | ✅   | `npx tsc --noEmit` 오류 없음                                                     |
| npm run build 에러 없음                                                      | ✅   | Compiled successfully, 정적 페이지 생성 완료                                     |

---

## 발견된 이슈

### 버그 (블로킹)

| #   | 심각도 | 설명                                            | 재현 조건                                                                                                    |
| --- | ------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | Medium | PointBlockScreen이 삭제된 `/poll` 경로로 라우팅 | requiresPointDeduction=true, canAfford=false 상태에서 포인트 부족 화면 진입 후 "폴 참여하러 가기" 클릭 → 404 |

### 설계 이슈 (비블로킹, 행동 이상)

| #   | 심각도 | 설명                                                                            | 재현 조건                                                                                                                                                                                             |
| --- | ------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2   | Low    | 섹션 N의 첫 질문에서 "이전으로" 클릭 시 동일 섹션의 section_transition으로 귀환 | sections >= 2, sectionIdx=1, questionIdx=0 → "이전으로" → section_transition(sectionIdx=1) → "계속하기" → question(sectionIdx=1, questionIdx=0) 순환                                                  |
| 3   | Low    | 진행 표시에서 "질문 K"가 질문 번호가 아닌 완료한 답변 수                        | 첫 질문 진입 직후 progressText = "섹션 1 / 3 · 질문 0 / 5" — 아직 답하지 않았으므로 0이 표시됨. 티켓 구현 힌트는 answeredCount를 K로 사용하도록 명시했으므로 스펙 범위 내이나 사용자 혼란 가능성 있음 |

### 미완성 항목

없음. DoD 항목은 모두 구현됨.

---

## PM에게 전달 사항

**result: PARTIAL** — 핵심 기능(섹션 전환, 질문 페이지네이션, 상태 머신)은 DoD 기준으로 완료됐고 빌드도 통과했다. 블로킹 버그 1건(Medium)이 있으므로 PASS가 아닌 PARTIAL로 판정한다.

**후속 액션 권장:**

1. **버그 #1 (Medium) — `/poll` 404**: `PointBlockScreen`의 "폴 참여하러 가기" 버튼이 삭제된 `/poll` 라우트로 이동한다. OPIN-049에서 Poll 전체가 제거됐으므로, 버튼을 "홈으로 가기" (`/`)로 교체하거나 포인트 충전 유도 경로로 변경해야 한다. opin-fe 1줄 수정으로 해결 가능.

2. **설계 이슈 #2 — 이전으로 순환**: `calcPrevStep`에서 `kind="question", questionIdx=0, sectionIdx>0`일 때 현재 섹션의 `section_transition`이 아닌 이전 섹션의 마지막 질문으로 이동해야 자연스럽다. 현재 구현은 동일 섹션 전환 화면으로 돌아가 순환이 발생한다. MVP 범위 내 허용 여부를 PM이 결정해야 한다.

3. **설계 이슈 #3 — 진행 표시 K**: `질문 answeredCount / totalQ`는 구현 힌트 스펙과 일치하지만 첫 질문에서 "0 / N"이 표시되는 UX가 어색하다. 티켓 v2에서 `currentStep.questionIdx + 1` 방식으로 변경 검토 권장.

**버그 #1만 수정 후 재QA하면 PASS 예상.**

---

## Regression 체크

| 영향 범위                                               | 상태                                     |
| ------------------------------------------------------- | ---------------------------------------- |
| 설문 응답 제출 API (`/api/surveys/[id]/respond`)        | 정상 — doSubmit 로직 변경 없음           |
| Intro phase (surveyDescription 있는 설문)               | 정상 — phase 분기 유지                   |
| Preview 모드 (creator 미리보기)                         | 정상 — sections 전달 + preview flag 유지 |
| PointDeductionModal (일 5회 초과)                       | 정상 — pointGateState 로직 변경 없음     |
| SuccessScreen / BlockedScreen                           | 정상 — 변경 없음                         |
| page.tsx Guard (unpublished/capacity/already_responded) | 정상 — guard 로직 변경 없음              |
| sections fetch 실패 시 폴백                             | 정상 — `sections ?? []`                  |

---

## Session Handoff

**구현 상태:**

- 변경된 파일: `src/app/(main)/survey/[id]/respond/page.tsx`, `src/app/(main)/survey/[id]/respond/SurveyRespondClient.tsx`
- 완료된 것: sections fetch, RespondStep 상태 머신, SectionTransitionScreen, groupQuestionsBySection, calcNextStep/calcPrevStep, 진행 표시바, required 검증 위치 변경, 페이드 애니메이션
- 의도적으로 제외한 것 (scope out): 이벤트 로깅 (티켓에서 MVP = console.log 레벨로 명시했으나 구현되지 않음 — DoD 항목 아님)

**다음 세션에서 알아야 할 것:**

- `PointBlockScreen`의 `/poll` 라우팅은 OPIN-049에서 Poll이 제거됐음에도 수정되지 않았다. 이 컴포넌트는 OPIN-060 이전부터 존재하던 레거시 코드이며, 이번 구현에서 새로 도입한 버그가 아니다. 그러나 현재 코드에 존재하는 버그이므로 수정이 필요하다.
- `calcPrevStep`에서 `sectionIdx > 0, questionIdx === 0` 케이스는 현재 섹션의 `section_transition`으로 돌아간다. 이전 섹션 마지막 질문으로 돌아가는 것이 더 자연스럽지만 MVP 허용 범위 판단이 필요하다.

**다음 세션 시작 액션:**

1. `PointBlockScreen`에서 `router.push("/poll")` → `router.push("/")` 수정 (opin-fe)
2. PM에게 설계 이슈 #2(이전으로 순환), #3(진행 표시 K) 판단 요청
3. opin-qa 재검증
