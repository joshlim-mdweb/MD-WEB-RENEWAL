---
id: "MD-WEB-001"
title: "GNB 구조 확정 및 드롭다운 콘텐츠 설계"
priority: "P1"
status: "research"
agents:
  - owner: "md-pm"
  - reviewer: "md-design"
  - consulted: ["md-fe"]
created: "2026-04-27"
updated: "2026-04-27"
sprint: "W18"
policy_refs:
  - "docs/policy/plan.md"
  - "docs/policy/member.md"
  - "docs/ux/gnbResearch2.md"
code_refs: []
---

## 목적

사이트 방문자가 GNB에서 자신의 역할(Individual/Enterprise/Academic)과 필요(기능/가격/지원)를 즉시 찾을 수 있도록
MD 웹사이트 GNB 구조와 드롭다운 내부 콘텐츠를 확정한다.

비즈니스 임팩트: GNB가 페르소나 진입 경로를 제공하지 않으면 Solutions 페이지 유입이 막히고 Trial/Buy 전환율이 낮아진다.

## 확정된 사항

### GNB 바 구조 (확정)

```
[Logo] Product▼ | Solutions▼ | Learn | Pricing | Support
                                          [Log in] [Free Trial]
```

- Connect 메뉴 제외
- Contact Sales CTA 제외
- 메뉴 5개 + CTA 2개

### MD 5 Core Capabilities (확정)

Product 드롭다운의 기반이 되는 핵심 기능 축:

| 기능 | 핵심 포인트 |
|---|---|
| MODELING | 패턴 기반 의상 구성, 시뮬레이션 기반 드레이핑, Quad Mesh 변환 |
| TEXTURE/FABRIC | 실제 물성 기반 원단 표현, PBR 텍스처, AI 그래픽 |
| RIGGING | 외부 아바타 호환, IK 지원, Everywear 리깅 |
| ANIMATION | 중력·바람 시뮬레이션, 외부 모션파일 지원, 모션 프리셋 |
| RENDERING | 스타일라이즈 렌더링, 영상 녹화 내장, Fur Strand 프리뷰 |

---

## 미결 항목 — 논의 필요

### [1] Product 드롭다운 구조

**현재 후보 A — 5 Core Capabilities 카드형 (Figma Products 스타일)**
```
┌──────────────────────────────────────────────────┐
│ MODELING          TEXTURE/FABRIC    RIGGING       │
│ 패턴 기반 시뮬     실제 물성 원단    IK · Everywear │
│                                                  │
│ ANIMATION         RENDERING                      │
│ 중력·바람 모션     PBR · Fur Strand               │
└──────────────────────────────────────────────────┘
```

**현재 후보 B — 심플 링크 리스트**
```
Features Overview
Modeling & Simulation
Texture & Fabric
Rigging
Animation
Rendering
What's New
```

**결정 필요:**
- [ ] 카드형 vs 리스트형
- [ ] Product 드롭다운이 필요한가? (단일 제품이므로 드롭다운 없이 Product 페이지 직접 링크도 고려)
- [ ] "What's New" / Release Notes 포함 여부

---

### [2] Solutions 드롭다운 구조

**현재 후보 A — 2축 (Figma Solutions 스타일)**
```
USE CASES                     ORGANIZATIONS
───────────────────────────────────────────
Game & VFX                    Enterprise
Fashion & Apparel             Academic Institutions
Virtual Fashion / Metaverse   Students
Architecture / Product Viz
```

**현재 후보 B — 단순 페르소나 리스트 (CLO3D 스타일)**
```
Individual Designers
Enterprise
Students
Institutions & Educators
```

**결정 필요:**
- [ ] 2축(Use Cases + Organizations) vs 단순 리스트
- [ ] Use Cases 항목: Game&VFX / Fashion / Virtual Fashion / Architecture 4개가 맞는가?
- [ ] Indie는 Solutions에 노출 여부 (현재 정책: Enterprise 내 배너)

---

### [3] Learn 메뉴 콘텐츠

**결정 필요:**
- [ ] 드롭다운 있나? 없나? (Maxon은 드롭다운 없이 Learn 단일 링크)
- [ ] 드롭다운 있다면 하위 항목:
  - Tutorials
  - Documentation / Manual
  - What's New / Release Notes
  - User Stories / Case Studies
  - Community / Forum
  - YouTube Channel
- [ ] User Stories가 Learn에 포함되나? 별도 섹션인가?

---

### [4] Pricing 메뉴

**결정 필요:**
- [ ] Pricing 단일 링크 vs 드롭다운
- [ ] 드롭다운 있다면: Individual / Enterprise / Student / Academic 플랜 카드 프리뷰?
- [ ] "Compare Plans" 표기 방식

---

### [5] Support 메뉴

**결정 필요:**
- [ ] 드롭다운 있나? 없나?
- [ ] 하위 항목 후보:
  - FAQ
  - Technical Support (TS) — MDWEB-700 정책 기준
  - Contact
  - System Status
- [ ] TS 문의 폼 진입점: Support 메뉴인가? 별도 CTA인가?

---

### [6] Free Trial CTA

**결정 필요:**
- [ ] 텍스트: "Free Trial" vs "Try Free" vs "Start Free Trial" vs "Get Started"
- [ ] Buy CTA 별도 추가 여부 (현재 제외됨)
- [ ] Log in 위치: CTA 왼쪽 텍스트 링크 (현재 구조 유지)

---

### [7] 모바일 GNB

**결정 필요:**
- [ ] Hamburger 메뉴 사용 여부
- [ ] 모바일에서 Solutions 드롭다운 처리 (아코디언 vs 별도 페이지)
- [ ] 모바일 CTA 배치 (상단 고정 vs Hamburger 내부)

---

### [8] Authority 마커 위치

**현재 후보:**
- GNB 바 바로 아래 서브바: `🏆 Academy Award-Winning · Weta Digital · DreamWorks · Avatar · Avengers`
- Hero 섹션 내 배지로만 처리
- GNB에는 없음

**결정 필요:**
- [ ] 서브바 사용 여부
- [ ] 서브바 사용 시 노출 항목과 순서

---

## UX 리서치 요약

| 경쟁사 | GNB 패턴 | MD 적용 포인트 |
|---|---|---|
| Figma | Products(카드형) + Solutions(2축: Use Cases/Roles/Organizations) + Community + Resources + Pricing | Solutions 2축 구조 참고 |
| CLO3D | Product + Solution(단순 리스트) + Assets + Learn + Support | 단순 페르소나 리스트 참고 |
| Houdini | Products + Industries(도메인별) + Community + Learn + Support + Try/Buy | Use Cases 도메인 분류 참고 |
| Maxon | Products + News + Learn + Support + Try/Buy | 심플 구조, Pricing 없이 Buy CTA |
| Foundry | Products + Community + Support + Learn + Insights Hub | Insights Hub(케이스스터디) 참고 |

---

## 완료 조건 (Definition of Done)

- [ ] GNB 바 5개 메뉴 확정 (Product / Solutions / Learn / Pricing / Support)
- [ ] Product 드롭다운 구조 + 콘텐츠 확정
- [ ] Solutions 드롭다운 구조 + 하위 항목 확정
- [ ] Learn / Pricing / Support 드롭다운 유무 + 하위 항목 확정
- [ ] CTA 텍스트 확정
- [ ] 모바일 처리 방향 확정
- [ ] Authority 마커 위치 확정
- [ ] md-design UX 검증 완료
- [ ] 결정 내용 gnbResearch2.md 또는 별도 spec 문서로 저장

## 다음 단계

기획 확정 후 → md-fe 구현 티켓 (MD-WEB-002) 분리 생성
