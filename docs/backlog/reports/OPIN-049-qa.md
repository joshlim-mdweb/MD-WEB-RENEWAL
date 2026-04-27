---
ticket_id: "OPIN-049"
date: "2026-04-11"
qa_agent: "opin-qa"
result: "PARTIAL"
loop_count: 1
---

## QA 리포트

**티켓:** OPIN-049 — 피봇: URL/GitHub AI 설문 자동 생성 + Poll/Withdraw 제거
**결과:** PARTIAL
**루프:** 1회차

---

## 완료 조건 체크

| 조건                                   | 결과 | 비고                                                          |
| -------------------------------------- | ---- | ------------------------------------------------------------- |
| `src/app/(main)/poll/` 제거            | ✅   | 디렉토리 없음                                                 |
| `src/app/(main)/create/` 제거          | ✅   | 디렉토리 없음                                                 |
| `src/app/api/polls/` 제거              | ✅   | 디렉토리 없음                                                 |
| `src/components/poll/` 제거            | ✅   | 디렉토리 없음                                                 |
| `src/lib/types/poll.ts` 제거           | ✅   | 파일 없음                                                     |
| `WithdrawSection.tsx` 제거             | ✅   | 파일 없음                                                     |
| `WithdrawForm.tsx` 제거                | ✅   | 파일 없음                                                     |
| `/api/my/withdraw/route.ts` 제거       | ✅   | 파일 없음 (디렉토리는 빈 상태로 잔존)                         |
| nav/sidebar에 `/my/withdraw` 링크 없음 | ✅   | GnbNav, LeftSidebar, BottomTabBar 모두 없음                   |
| `/api/analyze` 구현 — URL 처리         | ✅   | fetchUrlContext 함수 구현                                     |
| `/api/analyze` 구현 — GitHub 분기      | ✅   | fetchGitHubContext 함수 구현                                  |
| `/api/analyze` 구현 — Claude API 호출  | ✅   | @anthropic-ai/sdk 사용, generateSurveyQuestions               |
| `/api/analyze` — API key 없을 때 503   | ✅   | ANTHROPIC_API_KEY 없을 때 503 반환                            |
| `/api/analyze` — 에러 핸들링           | ✅   | invalid_body(400), source_required(422), analysis_failed(500) |
| `/analyze` 페이지 — 로그인 체크        | ✅   | supabase.auth.getUser() 분석 버튼 클릭 시 체크                |
| `/analyze` 페이지 — 로딩 상태          | ✅   | isAnalyzing, isCreating 상태 처리                             |
| `/analyze` 페이지 — 503 별도 처리      | ✅   | "서비스를 준비하고 있어요" 별도 메시지                        |
| `/analyze` 페이지 — builder redirect   | ✅   | router.push(`/survey/${id}/edit`)                             |
| `/analyze` 페이지 — COLOR 토큰 사용    | ✅   | 하드코딩 없음, design-tokens 사용                             |
| 홈 hero `/analyze` CTA 추가            | ✅   | 데스크탑+모바일 모두 추가됨                                   |
| 홈 hero 디자인 토큰 사용               | ✅   | COLOR, TYPOGRAPHY, RADIUS, SPACING 사용                       |
| npm run build                          | ✅   | Compiled successfully, 29 pages                               |
| mypage poll 잔존 참조 없음             | ❌   | 3개 파일에 잔존 링크 발견                                     |
| 빈 디렉토리 `/api/my/withdraw/` 정리   | ❌   | 빈 디렉토리가 남아있음 (route.ts 없음)                        |

---

## 발견된 이슈

### 버그 (FAIL 원인)

| #   | 심각도 | 설명                                                                                     | 재현 조건                                               |
| --- | ------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | Medium | `ParticipatedContentList.tsx` — `/poll/{id}` 링크 잔존, "폴 둘러보기" 링크(`/poll`) 잔존 | `/my/history` 페이지, 참여 기록 없을 때 EmptyState 렌더 |
| 2   | Medium | `MySurveysList.tsx` — "폴 보러가기" CTA(`router.push("/poll")`), `/poll/${id}` href 잔존 | `/my/survey` 페이지, history 탭, 참여 기록 없을 때      |
| 3   | Low    | `/api/my/withdraw/` 빈 디렉토리 잔존                                                     | 디렉토리 존재하지만 route.ts 없음 — 런타임 영향 없음    |

### 상세 재현 조건

**이슈 1 — ParticipatedContentList.tsx**

- `/my/history` 진입 후 참여 기록이 없을 때 EmptyState 렌더 → "폴 둘러보기" 링크가 `/poll`로 이동
- 참여 기록이 있을 때 poll contentType 활동이 있으면 `/poll/{id}`로 링크됨
- 파일: `src/components/mypage/ParticipatedContentList.tsx` 라인 153, 218

**이슈 2 — MySurveysList.tsx**

- `/my/survey` 의 history 탭에서 활동이 없을 때 "폴 보러가기" 버튼 → `/poll`로 push
- 활동 목록에 poll 타입 항목이 있으면 `/poll/${id}`로 링크됨
- 파일: `src/components/mypage/MySurveysList.tsx` 라인 316, 323

### 미완성 항목

- [ ] `ParticipatedContentList.tsx`: poll 관련 링크/탭/뱃지 제거 또는 survey 전용으로 교체
- [ ] `MySurveysList.tsx`: "폴 보러가기" EmptyState CTA 제거/교체, poll href 분기 제거
- [ ] `/api/my/withdraw/` 빈 디렉토리 삭제 (선택, 런타임 영향 없음)

---

## PM에게 전달 사항

**result: PARTIAL** — 핵심 기능(분석 API, 분석 페이지, 홈 hero, nav 정리)은 모두 완성됐으며 빌드도 정상 통과함. 블로킹 버그는 없음.

단, mypage 내 두 컴포넌트에 poll 잔존 참조가 있어 사용자가 삭제된 `/poll` 페이지로 이동할 수 있는 dead link 상태임.

- 완료된 것:
  - Poll 페이지·API·타입 파일 완전 제거
  - Withdraw 컴포넌트·API 제거, nav 링크 없음
  - `/api/analyze` 전체 구현 (URL/GitHub 분기, Claude API, 에러 핸들링)
  - `/analyze` 페이지 구현 (로그인 체크, 로딩, 503 처리, builder redirect)
  - 홈 hero에 `/analyze` CTA 추가 (데스크탑/모바일)
  - 빌드 PASS

- 미완성:
  - `ParticipatedContentList.tsx` poll 링크 잔존 → poll 제거에 맞게 survey 전용 UI로 교체 필요
  - `MySurveysList.tsx` poll 링크·CTA 잔존 → 동일 처리 필요

후속 액션 권장:

- [ ] opin-fe — `ParticipatedContentList.tsx` poll 탭/링크/뱃지 제거, survey 전용으로 단순화
- [ ] opin-fe — `MySurveysList.tsx` poll EmptyState CTA 및 href 분기 제거
- [ ] 위 수정 후 opin-qa 재검증

---

## Regression 체크

| 영향 범위                  | 상태                                    |
| -------------------------- | --------------------------------------- |
| `/analyze` 페이지          | 정상 (신규 구현)                        |
| 홈 (`/`) hero              | 정상 (CTA 추가됨)                       |
| GnbNav / LeftSidebar       | 정상 — poll/withdraw 링크 없음          |
| BottomTabBar               | 정상 — poll 링크 없음                   |
| `/my/history` EmptyState   | 영향 있음 — "폴 둘러보기" dead link     |
| `/my/survey` history 탭    | 영향 있음 — "폴 보러가기" dead link     |
| `/api/surveys` (설문 CRUD) | 정상 — 변경 없음                        |
| 빌드                       | 정상 — Compiled successfully (29 pages) |
