# [MD|SITE] GNB 재설계 — B Variant 구조 확정

Epic Key: `MD-WEB-003` | 요청: Josh Lim | 출처: 세션 작업 | 작성일: 2026-05-07

---

## 배경

marvelousdesigner.com 홈페이지의 GNB가 Solutions 페르소나 진입점 없이 기능 중심 메뉴 4개(`Key Feature / New Feature / Pricing / Support/FAQ`)로만 구성되어 있었다. Enterprise·Academics·Students 구분이 GNB에 없어 각 고객군의 진입 경로가 부재한 상태였고, Free Trial CTA 위치도 시각적 우선순위가 낮았다. MD 홈페이지 리뉴얼을 계기로 GNB 전체 구조를 재설계한다.

---

## 1. Agenda

| 항목 | 내용 |
|---|---|
| TITLE | GNB 재설계 — B Variant 구조 확정 및 드롭다운 설계 |
| DESCRIPTION | Marvelous Designer 홈페이지 GNB를 페르소나 진입점 중심으로 재설계한다. Solutions·Resources 드롭다운 신설, 메뉴 명칭 정리, CTA 우선순위 재정립 포함. |
| 요청자 | Josh Lim |
| DUE DATE | (미정) |

---

## 2. Background

### 2.1 현재 GNB (As-Is)

```
[Key Feature]  [New Feature]  [Pricing]  [Support/FAQ]    [Sign In]  [Free Trial]
```

**문제점:**

| 문제 | 설명 |
|---|---|
| 페르소나 진입점 없음 | Enterprise·Academics·Students 구분이 GNB에 없음. Solutions 페이지로의 유입 경로 부재. |
| Learn 콘텐츠 숨겨짐 | 튜토리얼·User Spotlight·Manual 진입점이 GNB에 노출되지 않음. |
| Free Trial 시각적 강조 부족 | Sign In 이후 배치, 버튼 스타일 미강조. 전환 CTA 우선순위 낮음. |
| 다운로드 진입점 없음 | SW 다운로드가 GNB에서 직접 접근 불가. |
| 메뉴명 불명확 | "Key Feature" / "New Feature" — 사용자 행동 기준이 아닌 내부 분류 기준 명칭. |

### 2.2 변경 후 GNB (To-Be)

```
[MD Logo]  Features  Solutions∨  Plan  Download  Resources∨    [Free Trial]  [Sign In]
```

---

## 3. Requirements

### 3.1 GNB 바 전체

| 기능명 | Description |
|---|---|
| 고정 헤더 | 시스템은 모든 페이지에서 GNB를 상단에 고정 표시한다. 높이 80px. |
| 로고 링크 | 사용자는 로고 클릭 시 홈(`/`)으로 이동한다. |
| Active 상태 | 시스템은 현재 경로와 일치하는 nav item에 active 스타일(font-weight 600)을 적용한다. |

### 3.2 네비게이션 항목

| 기능명 | Description |
|---|---|
| Features | 사용자는 Features 클릭 시 `/features`로 이동한다. 드롭다운 없음. |
| Solutions 드롭다운 | 사용자는 Solutions hover 시 드롭다운을 확인한다. 항목: Enterprise / Academics / Students. |
| Plan | 사용자는 Plan 클릭 시 `/plan`으로 이동한다. 드롭다운 없음. |
| Download | 사용자는 Download 클릭 시 `/download`로 이동한다. 드롭다운 없음. |
| Resources 드롭다운 | 사용자는 Resources hover 시 드롭다운을 확인한다. 항목: User Spotlight / Newsroom / Release / Manual / Contact Us / Asset Store. |

### 3.3 CTA

| 기능명 | Description |
|---|---|
| Free Trial | 사용자는 Free Trial 클릭 시 `/product/trial`으로 이동한다. |
| Sign In | 사용자는 Sign In 클릭 시 `/member/signin`으로 이동한다. |

### 3.4 드롭다운 동작

| 기능명 | Description |
|---|---|
| hover 열기·닫기 | 사용자는 Solutions·Resources에 hover하면 드롭다운이 열리고, 벗어나면 닫힌다. |
| gap 브릿지 | 시스템은 nav item과 드롭다운 사이 투명 영역(4px)을 채워 마우스 이탈 없이 드롭다운이 유지되도록 한다. |

---

## 4. Scope

### 4.1 홈페이지 프론트엔드

- `src/components/marketing/GNB.tsx` 신규 생성
- `src/app/(marketing)/layout.tsx` 교체: 기존 GnbNav + NavAuth → `<GNB />`
- header 높이 52px → 80px, `<main>` padding-top 동기화

### 4.2 Figma 설계 문서

- `_GNB & Footer` 페이지 > GNB 섹션 업데이트
  - 기본 상태: `GNB — B (Features Single Link)`
  - 호버 씬: `Solutions-Hover (B)`, `Resources-Hover (B)`
  - 구 A Variant 씬 삭제 완료

### 4.3 Out of Scope

- 모바일 GNB (Hamburger 메뉴) — 별도 진행 예정
- Authority 마커 서브바 — Hero 섹션 기획 시 함께 결정
- Resources 하위 항목 실제 링크 경로 일부 — 콘텐츠 확정 후 업데이트

---

## 5. 변경 항목 상세

| # | As-Is | To-Be | 변경 이유 |
|---|---|---|---|
| 1 | Key Feature | Features | 사용자 기준 명칭으로 통일. 단일 링크로 처리 — MD는 단일 제품이라 드롭다운이 진입 마찰을 추가한다. |
| 2 | New Feature | 제거 → Resources > Release | Release Notes는 독립 상위 메뉴보다 Resources 하위가 적합. GNB 항목 수 축소. |
| 3 | (없음) | Solutions∨ 신설 | Enterprise / Academics / Students 페르소나 진입점이 기존 GNB에 없었다. Solutions 페이지 유입 경로 생성. |
| 4 | Pricing | Plan | 홈페이지 내 용어 통일. (`/pricing` → `/plan`) |
| 5 | (없음) | Download 신설 | SW 다운로드 직접 진입점을 상위 레벨에 노출한다. |
| 6 | Support/FAQ | Resources∨ 통합 | Support 단독 메뉴보다 User Spotlight·Newsroom·Manual·Contact Us 등을 묶어 Resources로 노출한다. |
| 7 | Sign In (첫 번째) | Sign In (Free Trial 우측) | Free Trial을 우선 CTA로 강조. Sign In은 보조 CTA로 위치 조정. |
| 8 | Free Trial (두 번째, 미강조) | Free Trial (오렌지, 첫 번째) | 전환 CTA 시각적 우선순위 강화. 오렌지 컬러(`#f44e00`) 강조 버튼 적용. |

### 5.1 Solutions 드롭다운 — 구조 선택 근거

후보 A(2축: Use Cases + Organizations) 대비 **후보 B(단순 페르소나 리스트)** 채택.

- 현재 각 Use Case(Game&VFX, Fashion 등)별 전용 페이지 콘텐츠 미확정
- 2축 구조는 콘텐츠 볼륨이 뒷받침되어야 효과적. 볼륨 증가 시 재검토.
- Individual(개인) 항목 제외: Solutions 페이지가 아닌 Plan 페이지에서 처리한다.

### 5.2 Resources 드롭다운 — 통합 이유

Learn · Support · Release를 각각 상위 메뉴로 분리하지 않고 Resources 하나로 통합.

- 각 항목의 콘텐츠 볼륨이 아직 상위 메뉴를 독립 분리할 수준이 아님
- GNB 항목 수 최소화로 인지 부하 감소
- 향후 볼륨 충분 시 Learn · Support 분리 재검토 예정

---

## 6. Flow

| Step | Actor | Description |
|---|---|---|
| 1 | 사용자 | 홈페이지 진입 시 상단 GNB를 확인한다. |
| 2 | 사용자 | Solutions 또는 Resources에 hover한다. |
| 3 | System | 드롭다운을 표시한다. nav item과 드롭다운 사이 투명 브릿지로 gap을 채워 마우스 이탈 없이 유지한다. |
| 4 | 사용자 | 드롭다운 항목 또는 단일 링크를 클릭해 해당 페이지로 이동한다. |
| 5 | 사용자 | Free Trial 클릭 시 Trial 페이지로 이동한다. |
| 6 | 사용자 | Sign In 클릭 시 로그인 페이지로 이동한다. |

---

## 7. Action Item

### 7.1 완료

- [x] Figma B Variant 기본 상태 + 호버 씬 2종 완성
- [x] Figma A Variant 구 씬 삭제

### 7.2 잔여

- [ ] Resources 하위 항목 링크 경로 확정
- [ ] 모바일 GNB 설계 착수

---

## 8. Impact

| 지표 | 기대 효과 |
|---|---|
| Free Trial CTA 노출 | 전체 페이지에서 Trial 진입점 확보 |
| Solutions 페이지 유입 | Enterprise·Academics·Students 페르소나별 진입 경로 생성 |
| 콘텐츠 접근성 | User Spotlight·Manual 등 Learn 콘텐츠 GNB 직접 노출 |
