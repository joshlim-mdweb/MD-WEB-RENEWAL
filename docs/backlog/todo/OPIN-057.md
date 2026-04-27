---
id: "OPIN-057"
title: "아이콘 시스템 적용 — SuccessScreen · EmptyState · 설문 카드 썸네일"
priority: "P2"
status: "ready"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-design"]
created: "2026-04-12"
updated: "2026-04-12"
sprint: "W17"
policy_refs: []
code_refs:
  - "src/components/ui/icons/AppIcon.tsx"
  - "src/components/ui/icons/IconSurveySuccess.tsx"
  - "src/components/ui/icons/IconEmpty.tsx"
  - "src/components/ui/icons/IconSurvey.tsx"
  - "src/components/ui/EmptyState.tsx"
  - "src/app/(main)/survey/[id]/respond/SurveyRespondClient.tsx"
  - "src/components/mypage/MySurveysClient.tsx"
  - "src/components/mypage/MySurveysList.tsx"
  - "src/app/(main)/SurveyListClient.tsx"
---

## 목적

설문 완료·빈 상태·카드 썸네일에서 직접 그린 인라인 SVG를 제거하고 AppIcon 시스템으로 통일해,
아이콘 스타일 일관성을 확보하고 성취감·컨텍스트 전달을 강화한다.

비즈니스 임팩트: 아이콘 시스템이 완성됐음에도 실제 사용자 접점에 미적용 상태 — 디자인 시스템 완성도가
낮아 보이는 구간을 해소하고, 향후 아이콘 변경 시 단일 소스 수정으로 전파 가능하게 만든다.

## 현황

아이콘 시스템 구현 완료 (`src/components/ui/icons/`):

- `AppIcon` — size/variant/iconColor 지원, 반응형 border-radius 자동 계산
- `IconSurveySuccess` — 별+체크 형태 (설문 완료 의미)
- `IconEmpty` — 빈 상자 형태 (빈 상태 의미)
- `IconSurvey` — 클립보드 형태 (설문 문서 의미)
- 모두 `src/components/ui/icons/index.ts`에서 export 중

현재 미적용 지점 (3곳):

1. **SuccessScreen** (`SurveyRespondClient.tsx:603–661`)
   - `w-20 h-20` 초록 원 + 인라인 SVG 체크마크로 직접 구현
   - `IconSurveySuccess` + `AppIcon`으로 교체 가능

2. **EmptyState 호출부** (MySurveysList, MySurveysClient, SurveyListClient 등)
   - `EmptyState` 컴포넌트는 이미 `icon?: ReactNode` prop을 지원
   - 실제 호출부 전부 `icon` prop을 전달하지 않음 → 텍스트만 렌더

3. **SurveyGridCard 썸네일** (`MySurveysClient.tsx:134–148`)
   - 120px 회색 배경에 인라인 SVG 문서 아이콘 직접 작성
   - `IconSurvey` + `AppIcon`으로 교체 가능

## 완료 조건 (Definition of Done)

- [ ] SuccessScreen: 초록 원+인라인 SVG → `<AppIcon size={80} variant="light" iconColor={COLOR.POSITIVE}><IconSurveySuccess /></AppIcon>` 교체
- [ ] EmptyState 호출부 전체: `icon` prop에 `<AppIcon size={48}><IconEmpty /></AppIcon>` 전달
  - `MySurveysList`: 진행 중 없음 / 완료 없음 / 참여 기록 없음 (3곳)
  - `MySurveysClient`: 전체 없음 / 탭별 없음 / 검색 결과 없음 (3곳)
  - `SurveyListClient` 또는 홈 설문 리스트 EmptyState 사용처 확인 후 적용
- [ ] SurveyGridCard 썸네일: 인라인 SVG → `<AppIcon size={36} variant="light"><IconSurvey /></AppIcon>`
- [ ] 색상 하드코딩 없음 — AppIcon `iconColor` 파라미터로 전달
- [ ] TypeScript strict 통과
- [ ] npm run build 에러 없음
- [ ] QA: 빈 상태 / 성공 화면 / 마이페이지 카드 시각 확인

## UX 리서치

### 레퍼런스 패턴

| 서비스 | 패턴                                                                      | OPINION 적용 포인트                                                            |
| ------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Toss   | 완료 화면: 브랜드 색 원형 + 심플 아이콘. 초록 체크 아님                   | SuccessScreen에서 POSITIVE(초록) 유지하되 AppIcon 컨테이너로 통일              |
| Notion | 빈 상태: 아이콘 48px + 2줄 텍스트. 아이콘이 없으면 허전함이 명확히 드러남 | EmptyState에 48px AppIcon 필수                                                 |
| Linear | 카드 썸네일: 문서 아이콘을 회색 배경에 중앙 배치                          | SurveyGridCard 현재 패턴과 동일 — AppIcon으로 통일하면 hover 시 색상 연동 가능 |

### 핵심 UX 결정

- **SuccessScreen 아이콘 크기**: `size={80}` — 현재 `w-20 h-20`(80px)과 동일, 임팩트 유지
- **SuccessScreen 색상**: `iconColor={COLOR.POSITIVE}` — 성공 의미의 semantic color 유지. `COLOR.ACCENT`(파란색) 아님
- **EmptyState 아이콘 크기**: `size={48}` — 설명 텍스트 대비 과도하지 않은 비율
- **EmptyState variant**: `"light"` (기본) — BG_SECTION 배경, 다크모드 자동 대응
- **SurveyGridCard 아이콘**: `size={36}`, `variant="light"` — 120px 썸네일 내 여백 확보
- **MyDashboardCards**: 이번 티켓 제외 — 숫자 대시보드는 아이콘 추가 시 시각 노이즈 증가. 별도 판단 필요
- **필터 탭 아이콘**: 이번 티켓 제외 — 텍스트 탭이 충분히 명확하고, 아이콘 추가 시 탭 너비 문제 발생

### UX Writing (확정 문구)

빈 상태 문구는 기존 유지. 아이콘만 추가.

| 상황      | 문구                                                   |
| --------- | ------------------------------------------------------ |
| 설문 완료 | (기존) "답변을 제출했어요" + "참여해 주셔서 감사해요." |
| 설문 없음 | (기존) "아직 설문이 없어요"                            |
| 완료 없음 | (기존) "완료된 설문이 없어요"                          |

## 구현 힌트

### 기술 스펙

**SuccessScreen 교체 (`SurveyRespondClient.tsx:610–622`)**

```tsx
// 제거
<div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
  style={{ backgroundColor: COLOR.POSITIVE_MUTED }}>
  <svg ...>...</svg>
</div>

// 교체
import { AppIcon, IconSurveySuccess } from "@/components/ui/icons";

<div className="flex justify-center">
  <AppIcon size={80} variant="light" iconColor={COLOR.POSITIVE}>
    <IconSurveySuccess />
  </AppIcon>
</div>
```

**EmptyState 호출부 패턴 (`MySurveysList.tsx` 등)**

```tsx
import { AppIcon, IconEmpty } from "@/components/ui/icons";

<EmptyState
  icon={
    <AppIcon size={48}>
      <IconEmpty />
    </AppIcon>
  }
  title="아직 설문이 없어요"
  description="첫 번째 설문을 만들어 보세요."
  ctaLabel="설문 만들기"
  onCtaClick={() => router.push("/survey/new")}
/>;
```

**SurveyGridCard 썸네일 (`MySurveysClient.tsx:134–148`)**

```tsx
import { AppIcon, IconSurvey } from "@/components/ui/icons";

// 인라인 SVG 제거, AppIcon으로 교체
<AppIcon size={36} variant="light">
  <IconSurvey />
</AppIcon>;
```

### 예외 처리

| 케이스                                                      | 처리 방법                                                                         |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| BlockedScreen (already_responded, survey_full, daily_limit) | 이번 티켓 제외 — 아이콘이 경고/정보 의미라 별도 아이콘 필요. 현재 인라인 SVG 유지 |
| EmptyState `icon` prop에 null 전달                          | EmptyState 컴포넌트는 이미 `{icon && ...}` 조건부 렌더 — 안전                     |
| 다크모드                                                    | AppIcon `variant="light"` → `BG_SECTION` 배경 (다크모드에서 자동 대응)            |

## 정책 참고

없음 (UI 일관성 작업, 정책 변경 없음)

## CS 문의 예상 지점

없음. 시각 변경만, 기능 변경 없음.
