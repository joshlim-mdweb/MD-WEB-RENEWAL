---
id: "OPIN-046"
title: "My Page 디자인 고도화 — 설문 페이지 패턴 일치"
priority: "P2"
status: "ready"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-design"]
created: "2026-04-09"
updated: "2026-04-09"
sprint: "W16"
policy_refs:
  - "docs/policy/mypage.md"
  - "docs/policy/points.md"
code_refs:
  - "src/app/(main)/my/page.tsx"
  - "src/app/(main)/my/survey/page.tsx"
  - "src/components/mypage/MySurveysList.tsx"
  - "src/components/mypage/DashboardSummaryRow.tsx"
  - "src/app/(main)/SurveyListClient.tsx"
---

## 목적

마이페이지를 사용하는 크리에이터가 설문 목록과 대시보드를 볼 때 설문 메인 페이지와 동일한 시각 언어로 정보를 빠르게 파악할 수 있어야 한다.
현재 마이페이지 설문 리스트(`MySurveysList`)와 대시보드 카드 스타일이 설문 메인 페이지(`SurveyListClient`)의 카드 패턴과 불일치해 시각적 통일감이 없고, 정보 밀도도 낮아 개선이 필요하다.

## 현황

### 설문 메인 페이지 (레퍼런스 — 이 패턴을 마이페이지에 적용)

- `SurveyCard`: `INTERACTION.HOVER_BG` 배경 전환 hover, 왼쪽 3px accent border (선택 시), 썸네일 40px 원형, purpose Pill + NEW/D-day 뱃지, 제목 + 설명 + 메타(시간·리워드·참여자 수) 구조
- `HorizontalSurveyCard`: 가로 스크롤 compact 카드, 썸네일 상단, 정보 하단
- 컨테이너: `RADIUS.XL`, `COLOR.BG_BASE` 기반, border 없이 hover 시 배경색 전환

### 마이페이지 설문 리스트 (현재 — 개선 대상)

- `MySurveysList` (`src/components/mypage/MySurveysList.tsx`): `BG_SURFACE` 배경 고정, hover 없음, 썸네일 없음, `RADIUS.XL` 사용 중이나 패딩/레이아웃이 설문 카드보다 밀도 낮음
- 탭바(진행 중 / 완료 / 참여 기록): 현재 구조는 유지 가능하나 스타일 개선 필요
- 설문 아이템에 status badge만 있고 리워드·예상 시간·응답 수 메타 표현 미흡

### 마이페이지 대시보드 (현재 — 개선 대상)

- `/my/page.tsx`: 2열 그리드 카드 3개. 내용은 있으나 카드간 위계 불명확
- `DashboardSummaryRow.tsx`: 별도 컴포넌트지만 `/my/page.tsx`에서 미사용 (직접 렌더링 중) — 정리 필요

## 완료 조건 (Definition of Done)

- [ ] `MySurveysList` 설문 아이템이 `SurveyCard`와 동일한 hover 패턴 적용 (`INTERACTION.HOVER_BG`, border 전환 없음)
- [ ] `MySurveysList` 설문 아이템에 썸네일(40px 원형, fallback SVG), purpose Pill, status badge, 응답 수 메타 표시
- [ ] `/my/page.tsx` 대시보드 카드 시각 위계 개선 — 포인트 카드 강조, 참여·설문 카드 보조 배치 일관성
- [ ] 설문 리스트와 대시보드 컨테이너 전반에 `RADIUS.XL`, `COLOR.BG_SURFACE` 토큰 일관 적용 (하드코딩 금지)
- [ ] TypeScript strict 통과 (`npx tsc --noEmit`)
- [ ] `npm run build` 에러 없음
- [ ] QA 시나리오 통과 (빈 상태, 로딩, 데이터 있음 3개 케이스)

## UX 리서치

### 레퍼런스 패턴

| 서비스            | 패턴                                                                | OPINION 적용 포인트                                              |
| ----------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Toss 내 계좌      | 카드 리스트: 좌측 아이콘 원형 + 제목 + 서브텍스트 + 우측 숫자       | MySurveysList 아이템: 썸네일 원형 + 설문 제목 + 메타 + 우측 액션 |
| Linear 대시보드   | sidebar + KPI 카드 4개 + 컨텐츠 그리드 — 단일 뷰에서 모든 상태 파악 | /my/page.tsx: 포인트·참여·설문 3개 카드로 핵심 KPI 한눈에 파악   |
| Notion My Account | 탭 기반 콘텐츠 분리 (진행 중 / 완료 / 히스토리)                     | MySurveysList 탭 구조 유지, 각 탭 빈 상태 UX 강화                |
| Stripe Dashboard  | 각 카드가 단일 지표 + trend indicator — 5초 내 핵심 파악            | 대시보드 카드: 라벨 → 숫자 → 서브 지표 구조 통일                 |

### 핵심 UX 결정

- **설문 리스트 hover**: `INTERACTION.HOVER_BG` 배경 전환 방식으로 설문 메인 페이지와 동일하게 — 이유: border 변경은 DS 토큰 규칙 위반, 배경 전환이 Toss 원칙
- **썸네일 표시**: 마이페이지 설문 리스트에도 40px 원형 썸네일 + fallback SVG 추가 — 이유: 설문 메인 페이지와 시각 언어 일치, `survey.thumbnail_url`은 이미 DB에 존재
- **대시보드 카드 위계**: 포인트 카드 `col-span-2` 풀 width 배치 → 참여·설문 카드 2열 — 이유: 포인트가 가장 중요 지표, 시선 흐름 상단→하단 자연스럽게

### UX Writing (확정 문구)

| 상황                               | 문구                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| 설문 리스트 진행 중 탭 빈 상태     | "아직 설문이 없어요. 첫 번째 설문을 만들어 보세요."          |
| 설문 리스트 완료 탭 빈 상태        | "완료된 설문이 없어요. 공개 후 마감된 설문이 여기 표시돼요." |
| 참여 기록 탭 빈 상태               | "아직 참여 기록이 없어요. 폴이나 설문에 참여해 보세요."      |
| 설문 리스트 응답 수 메타           | "{n}명 응답"                                                 |
| 설문 아이템 draft 상태 결과 비활성 | "결과 없음" (disabled 스타일)                                |

## 구현 힌트

### 변경 범위

**파일 1: `src/components/mypage/MySurveysList.tsx`**

- `SurveyListItem` 타입에 `thumbnail_url?: string | null`, `purpose?: string | null` 필드 추가
- 설문 아이템 `li` 스타일 변경:
  - `backgroundColor: COLOR.BG_BASE` (현재 `BG_SURFACE` → `BG_BASE`로 변경)
  - `onMouseEnter/Leave` hover 상태 추가 → `backgroundColor: hovered ? INTERACTION.HOVER_BG : COLOR.BG_BASE`
  - `transition: INTERACTION.TRANSITION_BG`
  - 썸네일 40px 원형 추가 (설문 메인 카드와 동일한 fallback SVG 패턴)
  - purpose Pill 컴포넌트 추가 (설문 메인 `Pill` 패턴 참고)
- 기존 Border 관련 hover 스타일이 있다면 제거

**파일 2: `src/app/(main)/my/survey/page.tsx`**

- DB 쿼리에 `thumbnail_url`, `purpose` 필드 추가
- `surveyItems` 매핑에 신규 필드 포함

**파일 3: `src/app/(main)/my/page.tsx`**

- 대시보드 카드 레이아웃 개선:
  - 포인트 카드 → `col-span-2` (풀 width) 배치
  - 참여 카드 + 내 설문 카드 → 2열 그리드
- 카드 내부 시각 위계: 라벨(LABEL_2) → 큰 숫자(H2/DISPLAY) → 서브지표(LABEL_1) 구조 통일
- hover 인터랙션: 각 카드 Link 컨테이너에 `INTERACTION.HOVER_BG` 적용

### 예외 처리

| 케이스                    | 처리 방법                                           |
| ------------------------- | --------------------------------------------------- |
| thumbnail_url = null      | fallback SVG 아이콘 (설문 메인과 동일 패턴)         |
| purpose = null            | Pill 미표시 (조건부 렌더링)                         |
| 설문 0개 (진행 중 탭)     | EmptyState — "아직 설문이 없어요" + 설문 만들기 CTA |
| 설문 0개 (완료 탭)        | EmptyState — CTA 없음 (자연 달성 유도)              |
| 참여 기록 0개             | EmptyState — 폴 보러가기 CTA                        |
| 대시보드 포인트 로딩 실패 | 0 표시 유지 (서버 컴포넌트, 예외 catch 필요)        |

### 이벤트 로깅 포인트

- `my_survey_list_item_click` — 설문 아이템 클릭 (survey_id, status, tab)
- `my_dashboard_card_click` — 대시보드 카드 클릭 (card_type: point|participation|survey)

## 정책 참고

- **shared.md §상태 변경 선호**: 삭제 없이 archived 상태로 처리 — 설문 리스트 archived 탭 처리에 반영
- **survey.md §draft/published/closed/archived**: 각 상태별 액션 버튼 매핑은 현행 유지

## CS 문의 예상 지점

- "내 설문 목록에 썸네일이 안 보여요": thumbnail_url이 null인 경우 fallback SVG 표시 — 정상 동작임을 안내
- "마이페이지 설문과 메인 페이지 설문 스타일이 달라요": 이 티켓으로 해결됨
