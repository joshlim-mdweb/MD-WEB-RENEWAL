---
name: md_planning
description: "DEPRECATED — /md_figma_prd (PRD + IA + 플로우 + DOC) 또는 /md_figma_wireframe (와이어프레임) 사용."
user_invocable: false
---

> **DEPRECATED.** 이 스킬은 더 이상 사용하지 않습니다.
> - PRD 작성 + IA 차트 + 플로우 차트 + DOC 페이지 → `/md_figma_prd`
> - 와이어프레임 → `/md_figma_wireframe`

# md_planning 스킬

`/cowork`으로 생성된 PRD를 기반으로 **Jira 티켓 + Figma 기획 산출물 4종**을 자동 제작합니다.

| 산출물 | 도구 | 참조 |
|--------|------|------|
| Jira 티켓 | Atlassian MCP | `rules/jira-ticket.md`, `rules/atlassian.md` |
| IA 차트 | Figma | `references/ia-patterns.md` |
| 플로우 차트 | Figma | `references/flowchart-patterns.md` |
| 문서 페이지 | Figma | `references/document.md` |
| 와이어프레임 | Figma | `references/wireframe.md` |
| 모달 컴포넌트 | Figma | `references/modal.md` |

---

## 스킬 시작 가이드

스킬 실행 즉시 사용자에게 안내:

```
📐 md_planning 스킬을 시작합니다.

/cowork으로 생성된 PRD를 공유해주세요.
PRD 하나로 Jira 티켓 생성 → Figma 기획 산출물 4종을 순서대로 제작합니다.

각 단계 완료 후 결과를 확인하고 다음 단계로 진행합니다.
특정 단계만 요청해도 됩니다. (예: "플로우만 그려줘", "Jira 티켓만 만들어줘")
```

---

## 실행 흐름

```
1. PRD 수신 및 파싱
   → 화면 목록, 계층 구조, 사용자 플로우, Story 목록 추출
   → 추출 결과 사용자 확인

2. Jira 티켓 생성
   → Epic 1개 + Story N개 (jira-ticket.md 규칙 준수)
   → 생성된 티켓 URL 목록 공유 → 사용자 확인

3. IA 차트 생성 (Figma)
   → 화면 계층 트리 시각화
   → get_screenshot 검증 → 사용자 확인

4. 플로우 차트 생성 (Figma)
   → 화면 간 이동 + 분기 조건 시각화
   → get_screenshot 검증 → 사용자 확인

5. 문서 페이지 생성 (Figma)
   → DESCRIPTION + FLOW REF + ROUTE + HISTORY 테이블
   → get_screenshot 검증 → 사용자 확인

6. 와이어프레임 생성 (Figma)
   → 화면별 섹션 분할 호출
   → get_screenshot 검증
```

단계별로 사용자 확인 후 진행. 특정 단계만 요청 시 해당 단계만 실행.

---

## 흑백 컬러 규칙 (전 산출물 공통)

모든 산출물은 그레이스케일만 사용. 브랜드 컬러, Primary 컬러 일체 금지.

| 용도 | HEX | Figma RGB |
|------|-----|-----------|
| 배경 White | `#FFFFFF` | `{ r: 1, g: 1, b: 1 }` |
| 배경 Light | `#F5F5F5` | `{ r: 0.96, g: 0.96, b: 0.96 }` |
| 배경 Gray | `#E5E5E5` | `{ r: 0.90, g: 0.90, b: 0.90 }` |
| 테두리 Light | `#D1D1D1` | `{ r: 0.82, g: 0.82, b: 0.82 }` |
| 테두리 | `#999999` | `{ r: 0.60, g: 0.60, b: 0.60 }` |
| 텍스트 Light | `#666666` | `{ r: 0.40, g: 0.40, b: 0.40 }` |
| 텍스트 Default | `#333333` | `{ r: 0.20, g: 0.20, b: 0.20 }` |
| 텍스트 Dark | `#1A1A1A` | `{ r: 0.10, g: 0.10, b: 0.10 }` |
| 플레이스홀더 | `#CCCCCC` | `{ r: 0.80, g: 0.80, b: 0.80 }` |

강조는 굵기(Weight)와 크기(Size)로만 표현. 컬러 강조 금지.

---

## 1. IA 차트

> 구현 코드: `references/ia-patterns.md`

### 핵심 원칙

- 배경: **화이트(#FFFFFF)**
- 연결선: **없음** — 열 위치로 계층 암시
- Depth 1: 상단 수평 배열
- Depth 2: 부모 노드 바로 아래 수직 스택 (다열 가능)
- 좌상단 `IA` 뱃지 배치

### 노드 스타일

| Depth | 배경 | 테두리 | 크기 | 텍스트 |
|-------|------|--------|------|--------|
| 1 | `#1A1A1A` | 없음 | 100×32 | 12px SemiBold, `#FFF` |
| 2 | `#FFFFFF` | `#D1D1D1` | 100×28 | 11px Regular, `#333` |

### 레이아웃 간격 기준

| 항목 | 값 |
|------|-----|
| Depth 1 노드 간 수평 | 16px |
| Depth 1 → Depth 2 수직 | 12px |
| Depth 2 노드 간 수직 | 8px |
| Depth 2 다열 수평 | 8px |
| 캔버스 상단 패딩 | 60px |
| 캔버스 좌측 패딩 | 40px |

---

## 2. 플로우 차트

> 구현 코드: `references/flowchart-patterns.md`

### 핵심 원칙

- 연결선: **Orthogonal (직각 꺾임)** — cubic bezier 금지
- 노드 라벨: `<CHECK>`, `<END>`, `<Modal>` 꺾쇠 표기
- 분기 라벨: If NO → 오렌지(`#DF4D18`), If YES → 그레이(`#666666`)
- 멀티 플로우: 섹션 헤더 + 수직 스택

### 노드 타입

| 타입 | 모양 | 크기 | 용도 |
|------|------|------|------|
| `terminal-start` | 타원 | 60×32 | 시작점 |
| `screen` | 둥근 직사각형 | 140×44 | 일반 화면 |
| `decision` | 다이아몬드 (vectorPaths) | 80×80 | `<CHECK>` 분기 |
| `terminal-end` | Pill 직사각형 | 100×44 | `<END>` 종료 |
| `input-list` | 점선 직사각형 | 160×가변 | Inputs 목록 |
| `group-zone` | 배경 영역 | 가변 | 구간 표시 |

### 레이아웃 간격 기준

- 노드 간 수평: 80px / 분기 수직: 60px
- 섹션 간 간격 (멀티 플로우): 80px
- 섹션 헤더: 12px SemiBold, 플로우 위 16px
- 전체 캔버스 패딩: 80px

---

## 3. 와이어프레임

> 구현 코드: `references/wireframe.md`

### 레이아웃 기준

- Desktop 기준 너비: **1440px**
- Content 좌우 패딩: **100px**
- 섹션 간 수직 간격: **80~100px**
- 절대 좌표 금지 — Auto Layout + Hug Contents 전용

### MD Web Renewal 화면 패턴

| 화면 | 패턴 |
|------|------|
| Home | Hero (2단) + Authority Badge Bar + Testimonial Cards + Feature Grid + CTA |
| Solutions/Personal | Hero + Who it's for + Core Block × 3 + Workflow + Plan CTA |
| Solutions/Enterprise | Hero + Core Block Grid (3×2) + Userpool 섹션 + CTA |
| Solutions/Students | Hero + Core Block × 3 + 할인 고지 배너 + Plan CTA |
| Pricing | Plan Card × 3~5 + Feature 비교 테이블 + Authority Badge |
| About | 타임라인 섹션 + 필모그래피 그리드 |

### 공통 컴포넌트 패턴

| 컴포넌트 | 스펙 |
|----------|------|
| 헤더 | 로고(좌) + 네비(중앙) + CTA(우), 높이 64~80px |
| 히어로 2단 | 좌: 타이틀+서브카피+CTA / 우: 이미지 플레이스홀더 |
| 히어로 중앙정렬 | 타이틀+서브카피+CTA center align |
| Core Block | 아이콘 플레이스홀더 + 타이틀 + 설명 1~2줄 |
| Authority Badge Bar | `[뱃지] · [로고] · [로고]` 가로 1열 |
| Plan Card | 플랜명 + 가격 + 피처 리스트 + CTA / 추천 플랜 strokeWeight 2 |
| Feature 비교 테이블 | 행: 기능명 / 열: 플랜 / 체크 = 다크 원 |
| Testimonial Card | 인용구 + 이름 + 직함 + 소속 |
| Workflow Step | 01/02/03 Step 인디케이터 + 제목 + 설명 |
| 푸터 | 회사정보 + 링크 3~4열 + 저작권 |

### 서체 스케일 (와이어프레임 — 그레이스케일)

| 역할 | 크기 | Weight | 색상 |
|------|------|--------|------|
| Hero 타이틀 | 40~56px | Bold | `#1A1A1A` |
| 섹션 타이틀 | 32~40px | Bold | `#1A1A1A` |
| 서브헤딩 | 20~24px | SemiBold | `#333333` |
| 본문 | 16~18px | Regular | `#333333` |
| 캡션/라벨 | 12~14px | Regular | `#666666` |

행간: 24px 이상 → `140%` / 20px 이하 → `180%`

---

### MD Renewal Website Visual Reference (실제 구현용)

> 와이어프레임은 그레이스케일. 아래는 실제 컴포넌트 구현 시 참조값.
> 출처: Figma 2026-RENEWAL node 835:6890 (Pricing 페이지)

**폰트**: `Poppins` 전용 (Regular/Medium/SemiBold/Bold)

**다크 테마 컬러**:
| 용도 | HEX |
|------|-----|
| 페이지 배경 | `#19191e` |
| 카드 배경 | `#202027` |
| 토글 배경 | `#373743` |
| 섹션 라벨 | `#d7d7d7` |
| 기본 텍스트 | `#ffffff` |

**Plan Card 스펙**: `420×550px` · `rounded-[7px]` · 버튼 `top-[444px]`

**버튼 (pill)**:
- Primary: `bg-white text-[#19191e] rounded-[22px] px-[14px] py-[10px]`
- Outline: `border border-white text-white rounded-[22px] px-[14px] py-[10px]`

**Navbar**: `px-[48px] py-[20px]` · 로고 + 네비 + Sign In pill + language selector

상세 규칙: `.claude/rules/ds-renewal-website.md`

### 섹션 분할 호출 원칙

한 번의 `use_figma` 호출당 노드 수 제한 → 3단계 분할:
1. 메인 프레임 + Header + Hero
2. 본문 섹션
3. CTA + Footer

---

## 3.5 모달 컴포넌트

> 구현 코드: `references/modal.md`

CLOver Admin 디자인 기준 (Figma node `3721:666`). Confirmation Dialog에 사용.

### 스펙

| 항목 | 값 |
|------|-----|
| 컨테이너 크기 | 528×320px |
| 컨테이너 radius | 8px |
| 배경 | #FFFFFF |
| 폰트 | **Poppins Regular** (모달 내 모든 텍스트) |
| Title | SemiBold 16px, #000000, 중앙정렬, y=68 |
| Body | Regular 14px, #333333, 중앙정렬 |
| 버튼 y | 컨테이너 하단에서 64px 위 |
| 버튼 간격 | 19px / radius 6px / padding 수직 8px 수평 20px |

### 버튼 스타일

| 버튼 | 배경 | 테두리 | 텍스트 |
|------|------|--------|--------|
| Cancel (왼쪽) | 없음 | `#929292` 1px | `#454545` |
| Primary (오른쪽) | `#8096FF` | 없음 | `#FFFFFF` |

### 버튼 텍스트 규칙

- 모든 버튼 텍스트 **영어**
- 왼쪽: 항상 `Cancel` / 오른쪽: 동작명 (`Overwrite`, `Remove`, `Delete`, `Publish` 등)
- Title: 동작 대상 + `?` 의문형 (`"Overwrite existing data?"`)

### 배치 규칙

- DOC 프레임 우측에 세로 나열
- 각 모달 위에 `storyId` 라벨 (Poppins SemiBold 11px, #6B6B6B)
- 모달 간 수직 간격: 80px

---

## 4. Jira 티켓

> 규칙 레퍼런스: `.claude/rules/jira-ticket.md`, `.claude/rules/atlassian.md`

### 생성 규칙

- PRD 1개 = Epic 1개 + Story N개
- Project key: `MDWEB`
- `jira-ticket.md` 규칙 그대로 준수 (SP·스프린트·기술구현 기재 금지)

### 생성 순서

```
1. Epic 생성 (mcp__claude_ai_Atlassian__createJiraIssue)
   - issuetype: Epic
   - summary: PRD H1 제목
   - description: PRD Background 섹션

2. Story 생성 (PRD의 S1, S2... 각각)
   - issuetype: Story
   - summary: "[S번호] 기능명"
   - description: 현황 + Tasks 체크리스트
   - priority: P1→High / P2→Medium / P3→Low
   - parent: Epic key
```

### 완료 후 출력 형식

```
Epic: MDWEB-{n}  — {Epic 제목}
Story: MDWEB-{n} — [S1] {기능명}
Story: MDWEB-{n} — [S2] {기능명}
...
```

---

## 5. 문서 페이지 (Figma)

> 구현 코드: `references/document.md`

### 구조

```
┌──────────────┬──────────────┬────────────────────────────────┬──────────────┐
│ DESCRIPTION  │ POLICY       │ FLOW REF                       │ ROUTE        │
│ 기능 설명    │ 정책 내용    │ 플로우 차트 섹션명 + 링크      │ URL 라우트   │
│ 배경/목적    │ 예외 처리    │                                │ API 엔드포인트│
└──────────────┴──────────────┴────────────────────────────────┴──────────────┘

HISTORY
┌──────────┬──────────┬────────────────────────────────────────┐
│ DATE     │ TITLE    │ DESCRIPTION                            │
├──────────┼──────────┼────────────────────────────────────────┤
│ YYMMDD   │ Draft    │ 초안 작성                              │
└──────────┴──────────┴────────────────────────────────────────┘
```

### 패널별 내용

| 패널 | 내용 | PRD 소스 |
|------|------|---------|
| DESCRIPTION | 기능 설명, 배경, 사용자 시나리오 | Background, Overview |
| POLICY | 정책 규칙, 예외 처리, 제약 조건 | Policy, Rules 섹션 |
| FLOW REF | 플로우 차트 프레임명 + Jira Epic 링크 | — |
| ROUTE | 화면 URL 경로, 주요 API 엔드포인트 | PRD 화면 목록 |

HISTORY 초기 행은 생성 날짜 기준으로 자동 삽입. 이후 변경 시 행 추가.

---

## AI 느낌 배제 규칙

- 이모지 아이콘 사용 금지 (✅, ⚠️, 🔔 등)
- 챗봇 말풍선 UI 지양
- 과도한 불릿 나열 지양
- 컬러 그라디언트/글로우 효과 금지
- 아이콘 = 회색 원/사각형 플레이스홀더
- 여백 활용, 명확한 정보 위계

---

## 주의사항

- IA 차트, 플로우 차트는 `layoutMode = "NONE"` — 나머지는 Auto Layout
- 흑백 규칙 절대 위반 금지
- 각 단계 완료 후 `get_screenshot`으로 검증 필수
- Figma 다른 페이지에 그릴 때: 반드시 `setCurrentPageAsync` 먼저 호출
- Figma 링크는 항상 `page-id` 파라미터 포함 (`page-id=XXXX%3AYYYY`)
- 어드민/대시보드/복잡한 폼 등 범위 외 화면은 사용자에게 명시적으로 고지
- Jira 티켓 생성 전 반드시 Atlassian MCP 인증 상태 확인
