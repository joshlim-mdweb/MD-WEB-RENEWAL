# [MD|SITE] Release 페이지 개편

Epic Key: `(미정)` | 요청: Josh Lim | 출처: 2026-05-13 기획 세션 | 작성일: 2026-05-13

## 배경

현재 Feature 페이지(/product/newfeature)는 버전별 릴리즈 내용을 담고 있음에도 페이지명이 "Feature"로 표기되어 방문자에게 혼란을 준다. 기능 카드에 이미지가 없고 새 버전의 핵심 기능을 먼저 보여주는 Highlights 섹션이 없어 신규 버전의 가치를 효과적으로 전달하지 못한다. 리뉴얼을 통해 페이지명을 "Release"로 변경하고 시각적 임팩트를 강화한다.

---

## 1. Agenda

| 항목 | 내용 |
|---|---|
| TITLE | Release 페이지 개편 (Feature → Release) |
| DESCRIPTION | 버전별 릴리즈 정보를 시각적으로 전달하는 페이지 개편. Highlights 섹션 추가, 기능 카드 이미지 추가, 페이지명 변경. |
| 요청자 | Josh Lim |
| DUE DATE | (미정) |

---

## 2. Background

현재 `/product/newfeature` 경로의 "Feature" 페이지는 기능 카드(텍스트+배지)와 버전 셀렉터로만 구성된다. Linear Changelog, Figma What's New 등 업계 레퍼런스는 각 릴리즈의 핵심 기능을 이미지 또는 영상과 함께 상단에서 먼저 전달한다. MD Release 페이지는 두 방식의 중간 — 시각적 Highlights와 스캔 가능한 All Features 그리드를 결합하는 방향으로 개편한다.

---

## 3. Requirements

| 기능명 | Description |
|---|---|
| 페이지명 변경 | 시스템은 페이지 타이틀을 "Feature"에서 "Release"로 변경한다. |
| URL 변경 | 시스템은 URL을 `/product/newfeature`에서 `/product/release`로 변경한다. 기존 URL은 301 리다이렉트한다. |
| Hero 섹션 | 사용자는 최신 버전명, Tagline, 출시일, Download CTA를 확인한다. |
| Version Selector | 사용자는 버전을 선택해 해당 릴리즈 내용으로 전환한다. 최신 버전이 default 선택 상태다. |
| Highlights 섹션 | 사용자는 선택한 버전의 핵심 기능 3~5개를 이미지/영상 + 설명 + Manual 링크와 함께 확인한다. |
| All Features 섹션 | 사용자는 카테고리 필터(ALL / Boost Assets / Seamless Workflow / ALL-IN-ONE / Effortless & Intuitive)로 전체 기능 카드를 필터링한다. |
| 기능 카드 이미지 | 각 기능 카드에 스크린샷 또는 GIF 썸네일을 표시한다. |
| Feature / Patch Notes 탭 | 사용자는 Feature 탭과 Patch Notes 탭을 전환한다. Feature 탭이 default다. |
| Download CTA 섹션 | 사용자는 해당 버전 다운로드 또는 Trial 시작으로 이동하는 CTA를 확인한다. |

---

## 4. Scope

### 4.1 Web (marvelousdesigner.com)

- Release 페이지 신규 구조 구현
- Version Selector 컴포넌트 (탭 또는 드롭다운 — 디자이너 결정)
- Highlights 섹션: 버전별 핵심 기능 3~5개, 이미지 영역 포함
- All Features 그리드: 기존 카테고리 필터 유지 + 카드 이미지 추가
- Patch Notes 탭: 기존 구조 유지
- URL 301 리다이렉트 설정

### 4.2 Admin / CMS

- 버전별 Highlights 기능 등록/편집 기능 (논의 필요)
- 기능 카드 썸네일 업로드 기능 (논의 필요)

---

## 5. Flow

| Step | Actor | Description |
|---|---|---|
| 1 | 사용자 | `/product/release`에 진입한다. |
| 2 | System | 최신 버전(예: 2026.0)을 default로 렌더링한다. |
| 3 | 사용자 | Hero에서 버전명, Tagline, 출시일을 확인한다. |
| 4 | 사용자 | Highlights 섹션에서 핵심 기능 3~5개를 이미지와 함께 확인한다. |
| 5 | 사용자 | Version Selector에서 이전 버전을 선택한다. |
| 6 | System | 선택한 버전의 Hero, Highlights, All Features, Patch Notes를 전환한다. |
| 7 | 사용자 | All Features 섹션에서 카테고리 필터를 선택한다. |
| 8 | System | 선택한 카테고리에 해당하는 기능 카드만 표시한다. |
| 9 | 사용자 | Download CTA를 클릭한다. |
| 10 | System | 다운로드 페이지 또는 Trial 시작 플로우로 이동한다. |

---

## 6. Action Item

### Web

- [ ] URL 구조 확정: `/product/release` @개발팀
- [ ] Version Selector 컴포넌트 방향 결정: 탭 vs 드롭다운 @디자이너
- [ ] Highlights 섹션 이미지 가이드라인 확정: 비율(16:9 권장), 최소 해상도 @디자이너
- [ ] 기능 카드 썸네일 비율 확정 @디자이너
- [ ] Feature / Patch Notes 탭 전환 상태 정의 @디자이너

### 콘텐츠

- [ ] 버전별 Highlights 기능 3~5개 선정 기준 정의 @PM
- [ ] 기존 기능 카드 이미지 자산 수급 계획 @콘텐츠팀

### 있으면 더 좋을 것 (★★★)

- [ ] 기능별 GIF/짧은 영상 클립 — 현재 이미지만 계획, 영상 확장 가능
- [ ] "Try This Feature" CTA — Trial 유도 연결
- [ ] OG 이미지/SNS 공유 최적화

---

## 7. Impact

- 신규 버전 출시 시 다운로드 전환율 향상
- 기능 페이지 체류 시간 증가 (Highlights 섹션)
- "Feature" 페이지 이름 혼란 제거
