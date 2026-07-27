# gnbResearch2 — Features GNB 분석

수집일: 2026-04-27
소스: figma.com/design/, MD-Renewal-Comments FigJam, 2026-RENEWAL Figma

---

## 파일 목록

| 파일 | 내용 |
|------|------|
| `gnbResearch2.spec.ts` | Playwright 수집 스크립트 |
| `gnbResearch2-figma-design-page.png` | figma.com/design/ 페이지 상단 |
| `gnbResearch2-2026renewal-168-2.png` | 2026-RENEWAL node 168:2 전체 뷰 |
| `gnbResearch2-figjam-stickies.txt` | FigJam 보드 스티키 전체 원문 |

---

## FigJam 핵심 인사이트

### Josh GNB 아이템 목록 (Sticky 4)
```
Banner / Plan / 활용 분야 / Other / Interview / FAQ / Feature / Solution / 결제
```

### 현재 진행 중인 고민 (Sticky 15 — 260416)
> "개인/엔터프라이즈/학생/교육기관 과 기능 랜딩 페이지 컨셉이 겹쳐서 고민 중
>  플랜의 특장점을 소개하는 페이지로 활용해야 하는지에 대한 고민"

### Feature 페이지 구조 초안 (Sticky 12)
```
1. Hero
   "의상을 더 자연스럽고 빠르게 구현하는 시뮬레이션 기반 작업 환경"
   디스크립션: 복잡한 레이어, 자연스러운 주름, 움직임에 반응하는 옷의 흐름까지.

2. Core Value 1
   "주름을 그리는 대신, 물성을 반영해 움직이게"
   → 폴리곤 직접 깎는 방식 vs 시뮬레이션 방식
```

### Landing 페이지 개념 (Sticky 1)
- 각 화면으로 이동하는 인덱스 페이지
- 애니메이션 배제, 가벼움 유지
- MD로 만든 결과물 이미지 → MD 강점 표현

---

## Figma.com Products 드롭다운 패턴

4열 카드 그리드. 제품명 + 설명 1줄.

```
Figma Design           Dev Mode               FigJam                 Figma Slides
Design and prototype   Translate designs      Collaborate with       Co-create presentations
in one place           into code              a digital whiteboard

Figma Draw             Figma Buzz [BETA]      Figma Sites [BETA]     Figma Make
...                    ...                    ...                    ...
────────────────────────────────────────────────────────────────────────────
AI                     MCP                   Downloads              Release Notes
```

---

## Features vs Solutions 역할 분리

| 항목 | Features | Solutions |
|------|---------|----------|
| 질문 | "MD로 무엇을 할 수 있나?" | "내가 MD를 써야 하는 이유?" |
| 내용 | 기능 목록 + 각 기능 상세 | 페르소나별 use case + 가치 |
| 타겟 | 기능 확인 단계 유저 | 의사결정 단계 유저 |

---

## MD GNB 제안 구조

```
[MD 로고]   Features ∨   Solutions ∨   Resources ∨   Pricing     [로그인]  [무료 체험]
```

### Features 드롭다운 (Figma Products 패턴 적용)

```
Simulation              Pattern Editor          Export & Integration
물리 기반 시뮬레이션     패턴 제작 & 편집          Unreal / Unity / Maya 연동

3D Visualization        MD CONNECT
실시간 3D 미리보기        에셋 마켓플레이스
```

### Solutions 드롭다운 (Figma Solutions 패턴 적용)

```
BY WORKFLOW                    BY TEAM
Game / VFX                     Individual Designers
Fashion Design                 Enterprise
Virtual Fashion                Students
Architecture Viz               Academic Institutions
```

---

## 레퍼런스 링크

- FigJam 보드: https://www.figma.com/board/TseUBUbn6qp2ABsGjMDwfB/MD-Renewal-Comments
- 2026-RENEWAL: https://www.figma.com/design/PeCid7uJcg0HenViaaiHUp/2026-RENEWAL?node-id=168-2
- gnbResearch1: `tests/research/gnbResearch1-*`
