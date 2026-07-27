# [MD|SITE] Features 페이지 콘텐츠 전략

Epic Key: `(미정)` | 요청: Josh Lim | 출처: 2026-04-28 세션 | 작성일: 2026-04-28

---

## 배경

MD 웹사이트 리뉴얼에서 Features 페이지는 제품의 5대 핵심 기능을 소개하는 핵심 마케팅 페이지다. 기존 카피는 기술 설명 중심이어서 사용자가 얻는 결과와 경험을 전달하지 못했다. Apple(Final Cut Pro), Cursor, Linear 레퍼런스 리서치를 통해 결과 선언 방식으로 전면 재설계했다. 목표는 기능을 설명하는 것이 아니라 "MD가 왜 다른 카테고리인지"를 5개 섹션으로 증명하는 것이다.

---

## 1. Agenda

| 항목 | 내용 |
|---|---|
| TITLE | [MD\|SITE] Features 페이지 콘텐츠 전략 |
| DESCRIPTION | Features 페이지 5개 섹션 카피 확정 + 콘텐츠 구조 정의 |
| 요청자 | Josh Lim |
| DUE DATE | (미정) |

---

## 2. Background

MD Features 페이지를 찾는 사용자는 이미 MD를 알고 있는 상태다. 설득이 아닌 확인 단계다. 이 페이지는 기능 목록이 아니라 MD가 왜 Maya·Houdini와 다른 카테고리인지를 증명하는 페이지다.

레퍼런스 리서치 결과 다음 패턴을 적용했다:
- **결과 선언** (Apple): 기능이 아닌 달성 상태 선언. "Battery life. All-time high."
- **without 구조** (Final Cut Pro): 기존 방식의 번거로움을 암시적으로 제거. "without a single keyframe"
- **대비 쌍** (Apple): 짧게 끊어 긴장감 생성. "Silk drapes. Denim holds."
- **spec 나열** (Apple): 기술 신뢰도 확보. "FBX, Alembic, OBJ"

---

## 3. Requirements

| 기능명 | Description |
|---|---|
| Hero 섹션 | 사용자는 핵심 가치 선언 + 2개 CTA로 진입 여부를 결정한다 |
| MODELLING 섹션 | 사용자는 패턴 기반 제작 방식의 차별점을 인지한다 |
| TEXTURE & FABRIC 섹션 | 사용자는 소재별 물리 시뮬레이션의 정확도를 체감한다 |
| RIGGING 섹션 | 사용자는 1개 파일로 모든 캐릭터에 적용 가능함을 확인한다 |
| ANIMATION 섹션 | 사용자는 키프레임 없이 물리 기반 애니메이션이 생성됨을 이해한다 |
| RENDERING 섹션 | 사용자는 기존 파이프라인 변경 없이 연동됨을 확인한다 |
| Footer CTA | 사용자는 무료 체험 또는 플랜 조회로 전환한다 |
| Solutions 태그 | 사용자는 자신의 페르소나(Individual / Enterprise)에 맞는 솔루션 페이지로 이동한다 |

---

## 4. Scope

### 4.1 Web (`/features`)

- Hero 섹션: 타이틀 + 서브카피 + CTA Primary/Secondary
- Feature 섹션 × 5: Eyebrow / Headline / Description / Feature Tag 1·2 / Section CTA / Solutions 태그
- Footer CTA: 헤드라인 + 서브텍스트 + CTA Primary/Secondary
- Alternating layout: 홀수 이미지 좌, 짝수 이미지 우

### 4.2 카피 규칙 (non-negotiable)

- 명사형 종결 또는 동사 생략형
- 추상 감성 카피 금지 ("powerful", "innovative", "seamless")
- "without" 패턴으로 기존 방식과 암시적 대비
- 이미지 70% : 카피 30% 비율

### 4.3 연결 페이지

- `For individual designers →` → `/solutions/individual`
- `For enterprise →` → `/solutions/enterprise`
- Section CTA 목적지: UX 리뷰 후 확정

---

## 5. Flow

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Nav 또는 외부 링크를 통해 `/features` 진입한다 |
| 2 | System | Hero 섹션을 렌더링한다. 타이틀 + 서브카피 + CTA 노출. |
| 3 | 사용자 | 스크롤하며 5개 Feature 섹션을 순서대로 탐색한다 |
| 4 | 사용자 | 관심 섹션에서 Section CTA 또는 Solutions 태그를 클릭한다 |
| 5 | System | 해당 Solutions 페이지 또는 섹션 상세 페이지로 이동한다 |
| 6 | 사용자 | Footer CTA에서 "Start Free Trial" 또는 "View Plans" 선택한다 |
| 7 | System | `/pricing` 또는 Trial 시작 플로우로 이동한다 |

---

## 6. Action Item

### 6.1 Brand / Copy

- [ ] 각 섹션 이미지 에셋 준비 (Result-first: 결과물 메인, UI 서브)
- [ ] Section CTA 목적지 URL 확정 (UX 리뷰 후)
- [ ] 한국어 버전 카피 작성 (영문 확정 후)

### 6.2 FE (`md-fe`)

- [ ] Features 페이지 레이아웃 구현 (`/features`)
- [ ] Alternating layout 컴포넌트 구현 (홀짝 이미지 좌우 전환)
- [ ] Feature Section 컴포넌트: Eyebrow / Headline / Desc / Tags / CTA
- [ ] Solutions 태그 링크 연결

### 6.3 Design

- [ ] 각 섹션 이미지 플레이스홀더 비율 정의
- [ ] Sub 이미지 오버랩 위치/크기 가이드

---

## 카피 확정본

`requirements/copy-features-page.md` (v2, 2026-04-28)

### Hero

| Element | Copy |
|---|---|
| Title | `Creation powered by simulation.` |
| Subtitle | `Define the pattern, set the fabric, and watch your clothes move like the real thing.` |
| CTA Primary | `Start Free Trial` |
| CTA Secondary | `View Plans` |

### Section 헤드라인 요약

| Section | Headline |
|---|---|
| MODELLING | `Sewn, not sculpted.` |
| TEXTURE & FABRIC | `Silk drapes. Denim holds.` |
| RIGGING | `One file. Any body.` |
| ANIMATION | `No keyframes. Just physics.` |
| RENDERING | `Your pipeline, unchanged.` |
