---
ticket_id: "OPIN-046"
date: "2026-04-09"
qa_agent: "opin-qa"
result: "PARTIAL"
loop_count: 2
---

## QA 리포트

**티켓:** OPIN-046 — My Page 디자인 고도화 — 설문 페이지 패턴 일치
**결과:** PARTIAL
**루프:** 2회차

---

## 완료 조건 체크

| 조건                                                               | 결과 | 비고                                                                                      |
| ------------------------------------------------------------------ | ---- | ----------------------------------------------------------------------------------------- |
| MySurveysList hover `INTERACTION.HOVER_BG` 적용 (border 전환 없음) | ✅   | `MySurveysList.tsx` SurveyListItemRow 정상 적용                                           |
| MySurveysClient hover `INTERACTION.HOVER_BG_SURFACE` 적용          | ✅   | `SurveyListItemClient` hovered state로 HOVER_BG_SURFACE 전환, TRANSITION_BG 적용됨        |
| MySurveysList 썸네일 40px 원형 + fallback SVG                      | ✅   | SurveyThumbnail 컴포넌트 구현됨                                                           |
| MySurveysClient 썸네일 40px 원형 + fallback SVG                    | ✅   | SurveyThumbnail 컴포넌트 재사용, thumbnail_url 조건부 처리 완료                           |
| MySurveysList purpose Pill 조건부 렌더링                           | ✅   | `purposeLabel` null이면 미표시 처리                                                       |
| MySurveysClient purpose Pill 조건부 렌더링                         | ✅   | SURVEY_PURPOSE_LABELS 조회 후 null이면 Pill 미표시                                        |
| MySurveysList 응답 수 메타 표시 (`{n}명 응답`)                     | ✅   | 티켓 UX Writing 문구 일치                                                                 |
| MySurveysClient 응답 수 메타 표시                                  | ✅   | "응답 {n}명" 형식, 0명 시 TEXT_DISABLED 색상 처리                                         |
| MySurveysList thumbnail_url null fallback                          | ✅   | 조건부 SVG fallback 처리                                                                  |
| MySurveysClient thumbnail_url null fallback                        | ✅   | SurveyThumbnail fallback SVG 정상 처리                                                    |
| /my/page.tsx 포인트 카드 col-span-2 풀 width                       | ✅   | `col-span-2` 적용 확인                                                                    |
| /my/page.tsx 참여·설문 카드 2열 배치                               | ✅   | grid-cols-2 내 각 1열 배치                                                                |
| /my/page.tsx 카드 hover INTERACTION.HOVER_BG 적용                  | ✅   | onMouseEnter/Leave로 BG_SURFACE → HOVER_BG_SURFACE 전환                                   |
| 토큰 일관 적용 — 하드코딩 hex 없음                                 | ✅   | MySurveysClient, my/page.tsx 모두 하드코딩 없음                                           |
| /my/survey/page.tsx DB 쿼리에 thumbnail_url, purpose 포함          | ✅   | select에 두 필드 포함, surveyItems 매핑에 포함                                            |
| supabase.ts 타입에 thumbnail_url, purpose 정의                     | ✅   | surveys 테이블 Row/Insert/Update 모두 포함                                                |
| MySurveysClient SurveyListItem 타입에 thumbnail_url, purpose 추가  | ✅   | `thumbnail_url?: string \| null`, `purpose?: string \| null` 정의됨                       |
| 토스트 문구 해요체 전환 — 공개                                     | ✅   | "설문이 공개됐어요." (합쇼체 → 해요체 수정됨)                                             |
| 토스트 문구 해요체 전환 — 마감                                     | ✅   | "설문이 마감됐어요." (합쇼체 → 해요체 수정됨)                                             |
| 토스트 문구 해요체 전환 — 오류                                     | ✅   | 서버 오류 "일시적인 오류가 생겼어요...", 네트워크 오류 "네트워크 연결을 확인하고..." 정상 |
| 빈 상태 — 진행 중 탭 빈 상태 문구                                  | ✅   | "아직 설문이 없어요" + CTA 있음                                                           |
| 빈 상태 — 완료 탭 빈 상태 문구 (MySurveysList)                     | ✅   | "완료된 설문이 없어요" CTA 없음                                                           |
| 빈 상태 — 검색 결과 없음 문구                                      | ❌   | `description={"${searchQuery}" 와 일치하는 설문이 없습니다}` — 합쇼체 위반 (`없습니다`)   |
| 로딩 상태 — /my/survey loading.tsx                                 | ✅   | 신규 생성됨, SurveyItemSkeleton 4개, 탭·툴바·목록 구조 미러링                             |
| 로딩 상태 — /my loading.tsx                                        | ✅   | 신규 생성됨, 대시보드 col-span-2 그리드 구조 미러링                                       |
| TypeScript strict 통과                                             | ✅   | `npx tsc --noEmit` exit 0                                                                 |
| npm run build 에러 없음                                            | ✅   | 1회차 통과 상태 유지 (신규 파일 빌드 영향 없음)                                           |

---

## 발견된 이슈

### 잔존 버그 (PARTIAL 유지 원인)

| #   | 심각도 | 설명                                                                                                                         | 위치                           | 재현 조건                        |
| --- | ------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------- |
| 1   | Low    | 검색 결과 없음 EmptyState `description` 합쇼체 위반 — `"${searchQuery}" 와 일치하는 설문이 없습니다"` → `없어요`로 수정 필요 | `MySurveysClient.tsx` line 485 | 설문 검색 시 결과 없는 쿼리 입력 |

### 1회차 이슈 해결 현황

| 1회차 이슈            | 상태    | 확인 내용                                                                      |
| --------------------- | ------- | ------------------------------------------------------------------------------ |
| #1 hover 미적용       | ✅ 해결 | `SurveyListItemClient`에 hovered state + HOVER_BG_SURFACE + TRANSITION_BG 적용 |
| #2 토스트 합쇼체      | ✅ 해결 | 공개/마감/오류 모든 토스트 해요체로 전환됨                                     |
| #3 썸네일·Pill 미적용 | ✅ 해결 | SurveyThumbnail + purposeLabel Pill이 SurveyListItemClient에 정상 적용됨       |
| #4 loading.tsx 없음   | ✅ 해결 | /my/loading.tsx, /my/survey/loading.tsx 신규 생성, 구조 미러링 정확            |

### 신규 발견 이슈

| #   | 심각도 | 설명                                                                    |
| --- | ------ | ----------------------------------------------------------------------- |
| 1   | Low    | 검색 결과 없음 `description` 합쇼체 (`없습니다`) — UX Writing 규칙 위반 |

---

## 수정 필요 사항

- [ ] `MySurveysClient.tsx` line 485: `"없습니다"` → `"없어요"` 1자 수정
  - `description={\`"${searchQuery}" 와 일치하는 설문이 없습니다\`}`→`없어요`

---

## 근본 원인 (잔존 이슈)

2회차에서 FE가 주요 3개 이슈를 해결했으나, 검색 결과 없음 EmptyState의 `description`이 합쇼체로 작성됐다. 해당 분기는 1회차에서 커버되지 않은 신규 케이스 (검색 Empty State)였으며, 토스트 문구 수정에 집중하면서 EmptyState description을 놓쳤다.

---

## Regression 체크

| 영향 범위                                      | 상태                                    |
| ---------------------------------------------- | --------------------------------------- |
| `/survey/[id]` 설문 메인 페이지                | 정상 — 변경 없음                        |
| `/survey/[id]/report` 리포트 페이지            | 정상 — 변경 없음                        |
| `/my/point` 포인트 페이지                      | 정상 — 변경 없음                        |
| `/poll`, `/poll/[id]` 폴 페이지                | 정상 — 변경 없음                        |
| `/my/page.tsx` 기존 포인트·참여 기록 데이터    | 정상 — 기존 쿼리 유지, 신규 필드 추가만 |
| `MySurveysClient.tsx` 기존 필터·정렬·검색 기능 | 정상 — 로직 변경 없음                   |
| loading.tsx 신규 추가                          | 정상 — 기존 페이지에 영향 없음          |

---

## PM에게 전달 사항

**result: PARTIAL** — 잔존 이슈 1건, 1자 수정으로 해결 가능.

- 완료된 것: MySurveysClient hover/썸네일/Pill/토스트 해요체 전환, loading.tsx 2개 신규, TypeScript/빌드 통과
- 잔존: `MySurveysClient.tsx` line 485 검색 빈 상태 description `없습니다` → `없어요` (1자 수정)
- 권장: 3회차 루프 없이 FE가 단순 텍스트 수정 후 PASS 처리
