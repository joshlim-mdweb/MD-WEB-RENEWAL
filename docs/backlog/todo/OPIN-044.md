---
id: "OPIN-044"
title: "My Page — 내 설문 리포트 링크 연결"
priority: "P2"
status: "ready"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-design"]
created: "2026-04-10"
updated: "2026-04-10"
sprint: "2026-W16"
policy_refs:
  - "docs/policy/report.md"
  - "docs/policy/survey.md"
code_refs:
  - "src/components/mypage/MySurveysList.tsx"
  - "src/app/api/surveys/[id]/report/route.ts"
---

## 목적

설문 창작자가 My Page에서 자신의 설문 목록을 보고 바로 리포트로 이동할 수 있어야 한다.
현재 MySurveysList에 리포트 링크가 없어 설문 분석 기능이 사실상 접근 불가 상태다.

## 현황

- MySurveysList.tsx: 설문 목록 + archived 처리 존재. 리포트 링크 없음.
- `GET /api/surveys/[id]/report` 엔드포인트: 완전 구현됨 (집계 로직 포함).
- 리포트 페이지 (`/survey/[id]/report`): 구현 여부 확인 필요.
- responseCount 필드: MySurveysList의 SurveyListItem 타입에 이미 존재 — 추가 API 불필요.

## 완료 조건 (Definition of Done)

- [ ] MySurveysList에서 published / closed / archived 설문에 "리포트 보기" 링크 표시
- [ ] draft 설문에는 리포트 링크 없음
- [ ] 링크 클릭 시 `/survey/[id]/report` 이동
- [ ] responseCount === 0이면 "리포트 보기" 대신 비활성 텍스트 표시
- [ ] 리포트 페이지가 없으면 "준비 중이에요" 빈 상태 페이지 임시 구현
- [ ] 모바일(375px)에서 카드 레이아웃 깨지지 않음
- [ ] TypeScript strict 통과
- [ ] npm run build 에러 없음

## UX 리서치

### 레퍼런스 패턴

| 서비스       | 패턴                                                         | OPINION 적용 포인트                           |
| ------------ | ------------------------------------------------------------ | --------------------------------------------- |
| SurveyMonkey | 설문 카드 우측에 "X responses" + "View Results" 버튼         | 응답 수 숫자를 리포트 진입점으로 활용         |
| Google Forms | 응답 탭에서 바로 차트 — 별도 리포트 페이지 없음              | OPINION은 별도 페이지가 맞음 (더 복잡한 집계) |
| Typeform     | "See responses" CTA를 카드 내 유일한 secondary 액션으로 배치 | ghost 버튼으로 인라인 처리                    |

### 핵심 UX 결정

- **링크 형태**: ghost 버튼 ("리포트 보기") — 카드 내 인라인이므로 solid 금지
- **응답 0건 처리**: 링크 완전 숨김 대신 비활성 텍스트 표시 — 기능 존재를 인지시킴
- **draft 처리**: 리포트 링크 미표시 — draft 상태에서 응답 자체가 불가하므로

### UX Writing (확정 문구)

| 상황           | 문구                                              |
| -------------- | ------------------------------------------------- |
| 리포트 링크    | "리포트 보기"                                     |
| 응답 0건       | "아직 응답이 없어요"                              |
| 응답 N건       | "응답 {N}개 · 리포트 보기"                        |
| 리포트 준비 중 | "리포트를 준비하고 있어요. 조금만 기다려 주세요." |

## 구현 힌트

### 기술 스펙

변경 파일: `src/components/mypage/MySurveysList.tsx`
추가 필요: `src/app/survey/[id]/report/page.tsx` (빈 상태라도)

```tsx
// responseCount > 0 && status !== 'draft' 인 경우
<Link href={`/survey/${survey.id}/report`}>
  <Button variant="ghost" size="sm">리포트 보기</Button>
</Link>

// responseCount === 0 && status !== 'draft' 인 경우
<span className="text-sm text-[color:var(--text-muted)]">아직 응답이 없어요</span>
```

### 예외 처리

| 케이스               | 처리 방법                        |
| -------------------- | -------------------------------- |
| responseCount === 0  | 비활성 텍스트 표시, 링크 없음    |
| draft 상태           | 리포트 링크 미표시               |
| archived 설문        | 리포트 링크 표시 (closed와 동일) |
| 리포트 페이지 미구현 | 빈 상태 페이지 임시 구현         |

## 정책 참고

- **report.md**: 리포트는 창작자 전용 (creator_id === user.id 검증 필수)
- **survey.md 5.3**: archived 설문도 데이터 보존 — 리포트 조회 가능

## CS 문의 예상 지점

- "리포트가 안 보여요": survey status가 draft인지 확인, responseCount 확인
- "응답이 있는데 리포트에 반영 안 돼요": /api/surveys/[id]/report 서버 로그 확인
