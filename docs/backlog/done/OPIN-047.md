---
id: "OPIN-047"
title: "마이페이지 전체 리디자인 — 2-column Settings 레이아웃"
priority: "P2"
status: "ready"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-design"]
created: "2026-04-10"
updated: "2026-04-10"
sprint: "W17"
policy_refs:
  - "docs/policy/mypage.md"
  - "docs/policy/shared.md"
  - "docs/policy/points.md"
code_refs:
  - "src/app/(main)/my/page.tsx"
  - "src/components/mypage/"
  - "src/app/(main)/my/layout.tsx"
---

## 목적

사용자가 자신의 포인트, 설문, 참여 기록, 계정 설정을 한 화면에서 탐색할 수 있도록 Cursor IDE / Claude.ai settings 스타일의 2-column 레이아웃으로 마이페이지를 전면 재설계한다.

기존 dashboard summary card 구조는 정보 밀도가 낮고 섹션 간 이동이 단절되어 있어, 리텐션 지표(재방문율, 포인트 확인 빈도)를 막는 핵심 원인이다.

## 현황

### 현재 구조 (버릴 것)

- `src/app/(main)/my/page.tsx` — 서버 컴포넌트, 포인트 요약 + MyDashboardCards 그리드
- `MyDashboardCards` — 2×2 카드 그리드 (포인트, 참여 횟수, 내 설문)
- `AccountSideNavigation` — 독립 사이드 네비 컴포넌트 (일부 재사용 가능)
- `MySurveysList` — 탭(진행중/완료/참여기록) + 리스트 (재사용 가능)
- `ParticipatedContentList` — 탭 + 검색 + 테이블 (재사용 가능)
- `WithdrawSection`, `WithdrawForm`, `WithdrawConfirmModal`, `WithdrawHistory` — 포인트 섹션 (재사용 가능)
- `PointHistoryList` — 포인트 내역 리스트 (재사용 가능)

### 재사용 가능한 것

- `AccountSideNavigation` — nav 항목 구조 재활용, 스타일 교체
- `MySurveysList` — 컴포넌트 로직 그대로 유지, 위치만 이동
- `ParticipatedContentList` — 컴포넌트 로직 그대로 유지
- `WithdrawSection` / `WithdrawForm` / `WithdrawConfirmModal` / `WithdrawHistory` — 그대로 재사용
- `PointHistoryList` — 그대로 재사용

### 버릴 것

- `MyDashboardCards` — 2-column 레이아웃에서 불필요한 카드 그리드
- `DashboardSummaryRow` — 새 레이아웃으로 대체

## 완료 조건 (Definition of Done)

- [ ] 2-column layout: 좌측 고정 nav (240px), 우측 content area (flex-1)
- [ ] nav 섹션 5개: 프로필, 포인트 / 지갑, 내 설문, 참여 내역, 계정 설정
- [ ] 각 섹션은 독립 라우트 (`/my`, `/my/point`, `/my/survey`, `/my/history`, `/my/account`)
- [ ] 활성 nav 항목: `COLOR.ACCENT_LIGHT` 배경 + `COLOR.ACCENT` 텍스트 (기존 AccountSideNavigation 패턴 유지)
- [ ] 프로필 섹션: 닉네임, 이메일, 가입일 표시 + 닉네임 인라인 편집
- [ ] 포인트 섹션: available / pending 잔액, 일별 폴 참여 현황, 출금 신청 플로우, 내역 테이블
- [ ] 내 설문 섹션: `MySurveysList` 재사용 (탭: 진행중 / 완료)
- [ ] 참여 내역 섹션: `ParticipatedContentList` 재사용
- [ ] 계정 설정 섹션: 이메일 표시(읽기전용), 비밀번호 변경 링크, 로그아웃 버튼, 회원 탈퇴 링크
- [ ] 모바일 (< 768px): nav 수평 탭으로 전환, content 풀 width
- [ ] 모든 섹션 empty state 정의 및 구현
- [ ] loading skeleton: 각 섹션 데이터 로딩 중 skeleton 표시
- [ ] `COLOR.*` 토큰 준수, 하드코딩 금지
- [ ] `TYPOGRAPHY.STYLE.*` 스프레드 준수
- [ ] TypeScript strict 통과 (`any` 금지)
- [ ] `npm run build` 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 레퍼런스 패턴

| 서비스              | 패턴                                                 | OPINION 적용 포인트                            |
| ------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| Cursor IDE Settings | 좌측 고정 nav (섹션 그룹), 우측 content 스크롤       | nav width 240px, 섹션 구분선으로 그룹핑        |
| Claude.ai Settings  | 좌측 nav + 우측 full-page content, 활성 항목 bg 강조 | 활성 항목 배경색 전환 패턴 (border 변경 아님)  |
| Toss 마이페이지     | 상단 요약(포인트/이름) + 하단 섹션 리스트            | 프로필 헤더를 content 상단에 고정              |
| Linear 설정         | 좌측 nav에 아이콘 + 텍스트, 우측 form 섹션           | 아이콘 없이 텍스트만으로도 충분 (OPINION 규모) |

### 핵심 UX 결정

- **nav 고정 여부**: 좌측 nav는 `sticky top-0`으로 스크롤에도 고정 — 긴 콘텐츠 탐색 중 섹션 전환 가능
- **섹션 이동 방식**: URL 라우팅 (`/my/point` 등) — 딥링크 가능, 뒤로가기 동작 자연스러움
- **모바일 전환**: 768px 미만 시 nav를 수평 스크롤 탭으로 전환, content는 풀 width
- **포인트 헤더**: 프로필 영역에 `available` 포인트 요약 노출 — 포인트 확인 동기 부여
- **MyDashboardCards 제거**: 2-column 에서 카드 그리드는 중복 정보 — 삭제

### UX Writing (확정 문구)

| 상황                       | 문구                                                                |
| -------------------------- | ------------------------------------------------------------------- |
| nav: 프로필                | 프로필                                                              |
| nav: 포인트/지갑           | 포인트                                                              |
| nav: 내 설문               | 내 설문                                                             |
| nav: 참여 내역             | 참여 내역                                                           |
| nav: 계정 설정             | 계정 설정                                                           |
| 프로필 empty (닉네임 없음) | "닉네임을 설정해 보세요"                                            |
| 설문 empty                 | "아직 만든 설문이 없어요. 첫 설문을 만들어 보세요."                 |
| 참여 내역 empty            | "아직 참여 기록이 없어요. 폴이나 설문에 참여해 보세요."             |
| 포인트 0                   | "폴에 참여하면 포인트를 받을 수 있어요."                            |
| 출금 불가 (잔액 부족)      | "출금 가능한 포인트가 부족해요. 10,000P 이상이면 출금할 수 있어요." |
| 로그아웃 버튼              | 로그아웃하기                                                        |
| 회원 탈퇴                  | 탈퇴하기                                                            |
| 탈퇴 확인 모달 제목        | "정말 탈퇴할까요?"                                                  |
| 탈퇴 확인 모달 본문        | "탈퇴하면 모든 설문과 포인트가 삭제돼요. 되돌릴 수 없어요."         |
| 탈퇴 확인 버튼             | 탈퇴하기 (danger variant)                                           |

## 구현 힌트

### 레이아웃 구조

```
/my/layout.tsx (새로 생성)
  └── MySettingsLayout (2-column wrapper)
        ├── MySettingsNav (좌측 240px, sticky)  ← AccountSideNavigation 교체
        └── <main> (우측 flex-1, 스크롤)
              └── {children}  ← 각 섹션 페이지

라우트 구조:
  /my              → 프로필 섹션 (기본 랜딩)
  /my/point        → 포인트 섹션 (기존 유지)
  /my/survey       → 내 설문 섹션 (기존 유지)
  /my/history      → 참여 내역 섹션 (새 라우트, 기존 /my/survey/history 대체)
  /my/account      → 계정 설정 섹션 (기존 유지)
```

### 기술 스펙

- `src/app/(main)/my/layout.tsx` — 2-column wrapper 신규 작성
- `src/components/mypage/MySettingsNav.tsx` — nav 컴포넌트 신규 작성 (AccountSideNavigation 대체)
- `src/app/(main)/my/page.tsx` — 프로필 섹션으로 교체 (기존 MyDashboardCards 제거)
- `src/app/(main)/my/history/page.tsx` — 참여 내역 페이지 신규 작성
- `MyDashboardCards.tsx`, `DashboardSummaryRow.tsx` — 삭제 대상

### MySettingsNav 섹션 정의

```typescript
const NAV_ITEMS = [
  { href: "/my", label: "프로필", exact: true },
  { href: "/my/point", label: "포인트" },
  { href: "/my/survey", label: "내 설문" },
  { href: "/my/history", label: "참여 내역" },
  { href: "/my/account", label: "계정 설정" },
] as const;
```

### 레이아웃 스타일 기준

```
데스크톱 (>= 768px):
  - 컨테이너: max-w-[1000px] mx-auto, flex gap-8, px-6 py-8
  - 좌측 nav: w-[200px] flex-shrink-0, sticky top-8
  - 우측 content: flex-1, min-w-0

모바일 (< 768px):
  - 컨테이너: flex-col
  - nav: 수평 스크롤 탭 (overflow-x-auto)
  - content: px-4 py-6
```

### 프로필 섹션 데이터

Supabase `profile` 테이블 + `auth.users`에서 직접 조회:

- `nick_name` (nullable)
- `email`
- `created_at` (가입일)
- `point_ledger`에서 available 포인트 요약 (헤더 표시용)

### 예외 처리

| 케이스                                | 처리 방법                                        |
| ------------------------------------- | ------------------------------------------------ |
| 비로그인 접근                         | `layout.tsx`에서 redirect → `/login`             |
| 닉네임 없음                           | "닉네임을 설정해 보세요" CTA 표시                |
| /my/history → 기존 /my/survey/history | 301 redirect 처리                                |
| 포인트 0                              | empty state + 폴 참여 유도 CTA                   |
| 출금 잔액 부족                        | 출금 버튼 disabled + 안내 문구                   |
| 네트워크 오류                         | 각 섹션 개별 에러 처리 (전체 페이지 블로킹 금지) |

### 이벤트 로깅 포인트

| 이벤트                     | 트리거                             | 파라미터                |
| -------------------------- | ---------------------------------- | ----------------------- |
| `my_nav_click`             | nav 항목 클릭                      | `{ section: string }`   |
| `my_profile_nickname_edit` | 닉네임 편집 시작                   | —                       |
| `my_profile_nickname_save` | 닉네임 저장 성공                   | —                       |
| `my_withdraw_cta_click`    | 출금 신청하기 클릭                 | `{ available: number }` |
| `my_survey_create_cta`     | 설문 만들기 CTA 클릭 (empty state) | —                       |

## 정책 참고

- **mypage.md §8.3**: 대시보드는 summary-first — 포인트 합계, 오늘 참여 가능 폴 수, 진행 중 설문 수가 최우선 노출 정보
- **mypage.md §8.5**: My Surveys = 창작자 소유 설문만, 진행중(draft+published) / 완료(closed) 구분
- **mypage.md §8.6**: 참여 콘텐츠는 폴 + 설문 통합, 타입 배지로 구분
- **mypage.md §8.7**: 포인트 섹션 — Total / Pending / Available / 오늘 폴 획득량 / 오늘 남은 폴 횟수 모두 표시
- **mypage.md §8.9**: 빈 상태마다 다음 액션 CTA 필수
- **shared.md §2.4**: 삭제 대신 상태 변경 선호 — 탈퇴 시 profile.status = 'deleted'
- **shared.md §3.2**: 포인트 상태 — pending → available → withdrawn 표시

## CS 문의 예상 지점

- "포인트가 안 보여요": available / pending 상태 분리 표시 여부 확인 → 각 상태 레이블 명확히 표시
- "출금 신청이 안 돼요": 10,000P 미만 시 disabled + "10,000P 이상이면 출금할 수 있어요" 안내 문구 표시
- "참여 기록 URL이 바뀌었어요": /my/survey/history → /my/history 리디렉트 처리 필수
- "탈퇴 후 포인트는?": 탈퇴 확인 모달에서 "포인트가 삭제돼요" 명시
