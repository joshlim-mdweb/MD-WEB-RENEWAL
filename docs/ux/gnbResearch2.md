# GNB Research 2 — MD Strengths + Competitor Analysis

수집일: 2026-04-27  
목적: GNB 재설계를 위한 MD 강점 정리 + 경쟁사 GNB 패턴 조사

---

## 1. MD 핵심 강점 & 포지셔닝

### 기술 차별점 (1개, 명확하게)
**패턴 기반 물리 시뮬레이션**  
실제 재단 패턴으로 의상을 구성하고 물성(중력, 마찰, 탄성)을 그대로 시뮬레이션하는 방식.  
다른 3D 툴은 폴리곤 메시에서 출발하지만, MD는 실제 의상 제작과 동일한 방식으로 작동한다.

> 카피 방향: "패턴으로 만들기 때문에 실제 의상처럼 움직인다"

### 권위 지표 (Authority Markers)

| 지표 | 내용 |
|---|---|
| Academy Sci-Tech Award | 2024 아카데미 과학기술상 수상 (Sci-Tech Oscar) |
| 블록버스터 필모그래피 | Avatar: The Way of Water, Avengers: Infinity War, Spider-Man: Into the Spider-Verse, Doctor Strange, Mulan, The Hobbit 시리즈 |
| 도입 스튜디오 | Weta Digital (2011년 업계 최초), DreamWorks Animation, Konami, EA, Redstorm (Ubisoft), Playground Games (Xbox Game Studios) |
| 전문 미디어 | Creative Bloq 9/10 ("forerunner in digital clothing creation") |

### 전문가 인용 (검증된 출처 보유)

| 인물 | 소속 | 핵심 인용 |
|---|---|---|
| Joseph Drust | Senior Character Artist, Redstorm (Ubisoft) | "튜토리얼 없이 10분 만에 드레스 완성. 전문가 속도로 의상을 만들고 싶다면 필수." |
| Diego Conte | VFX Artist, Love Death + Robots (Netflix) | "리얼타임으로 디테일을 공짜로 얻는다. Houdini Vellum보다 품질이 더 좋은 경우가 많다." |
| Eugenia Peruzzo | Character Artist, Playground Games (Xbox) | "매일 쓰는 핵심 툴. AAA 업계표준." Disney, LEGO, Nintendo 프로젝트 이력 |
| Alzubair Akhimova | 3D Character Artist | "인터페이스가 직관적이라 간단한 에셋을 빠르게 만들 수 있었다." |

---

## 2. MD 현재 GNB (As-Is, 추정)

```
[Key Feature] [New Feature] [Pricing] [Support/FAQ] | [Sign In] [Free Trial]
```

### 문제점
- Solutions/페르소나 메뉴 없음 → Individual / Enterprise / Academic 구분이 GNB에 없음
- MD CONNECT 노출 없음 → 에셋 마켓플레이스가 숨겨져 있음
- CTA 1개 (Free Trial) → Try/Buy 듀얼 CTA 없음
- Learn 메뉴 없음 → 튜토리얼·커뮤니티 진입점 부재
- Authority 마커 없음 → Academy Award, 스튜디오 사용 이력 GNB에서 비노출

---

## 3. 경쟁사 GNB 패턴 분석

### CLO3D (가장 유사한 포지션)
```
Product | Solution▼ | Assets | Learn | Support | [START FREE TRIAL] [Sign In]
              ├─ Enterprise
              ├─ Academic
              └─ Individual
```
- **시사점**: Solution 메뉴로 페르소나 세그먼트화, Assets(=CONNECT 역할) 독립 항목, 단일 CTA

### SideFX Houdini (VFX 전문 툴)
```
Products | Industries▼ | Community | Learn | Support | [Try] [Buy]
              ├─ Film & TV
              ├─ Games
              ├─ Motion Graphics
              └─ Architecture
```
- **시사점**: Industries 메뉴로 사용 케이스 분류, Try/Buy 듀얼 CTA, Community 독립 항목

### Maxon (Cinema 4D, ZBrush)
```
PRODUCTS | NEWS | LEARN | SUPPORT | [TRY] [BUY] [Account]
```
- **시사점**: 심플 구조, Try/Buy 듀얼 CTA, 계정 접근 별도 아이콘

### Foundry (Nuke, Katana)
```
Products | Community | Support | Learn | Insights Hub | About Us | [Try] [Buy]
```
- **시사점**: Insights Hub(케이스 스터디·업계 인사이트), 콘텐츠 마케팅 강화

---

## 4. 경쟁사 GNB 공통 패턴

| 패턴 | CLO3D | Houdini | Maxon | Foundry |
|---|---|---|---|---|
| Solutions/Industries 페르소나 메뉴 | ✓ | ✓ | - | - |
| Try + Buy 듀얼 CTA | - | ✓ | ✓ | ✓ |
| Assets/Marketplace 독립 메뉴 | ✓ | - | - | - |
| Learn 독립 메뉴 | ✓ | ✓ | ✓ | ✓ |
| Community 독립 메뉴 | - | ✓ | - | ✓ |
| Insights/Content Hub | - | - | - | ✓ |

### 핵심 인사이트
1. **Solutions 메뉴로 페르소나 세그먼트** — CLO3D, Houdini 모두 사용. Individual/Enterprise/Academic 분기 필수
2. **Try + Buy 듀얼 CTA** — Houdini, Maxon, Foundry 공통. Trial ≠ 구매 두 경로 명확 분리
3. **CONNECT = Assets 독립 메뉴** — CLO3D의 Assets 포지션이 MD CONNECT에 해당
4. **Learn은 독립 메뉴** — 4사 모두 Learn/Support를 분리. 콘텐츠 볼륨이 클수록 독립 항목
5. **Community 섹션** — Houdini, Foundry. 포럼·갤러리·이벤트 묶음

---

## 5. MD 페르소나별 GNB 진입 필요

| 페르소나 | GNB에서 필요한 것 | 우선순위 |
|---|---|---|
| Individual Designer (프리랜서) | 플랜 가격 · CONNECT 에셋 · Trial CTA | 高 |
| Enterprise (스튜디오/팀) | Contact Sales · 라이선스 관리 · 파이프라인 정보 | 高 |
| Students | Student Plan · 인증 방법 · Trial CTA | 中 |
| Institutions | Academic Plan · 기관 인증 문의 | 中 |
| 기존 사용자 | Sign In · 계정 관리 · Support | 常時 |

---

## 6. GNB 구조 Option 3가지

### Option A — Solutions 페르소나 중심 (CLO3D 스타일)
```
Product | Solutions▼ | Connect | Learn | Pricing | Support
              ├─ Individual Designers
              ├─ Enterprise
              ├─ Students
              └─ Institutions / Educators
                                              [Free Trial] [Buy] [Sign In]
```
- **장점**: 페르소나별 진입 명확, CONNECT 독립 노출, Pricing 직접 노출
- **단점**: 메뉴 항목 6개로 다소 많음

### Option B — Minimal 콘텐츠 중심
```
Product | Solutions▼ | Pricing | Learn | Support
              ├─ Individual
              ├─ Enterprise
              └─ Academic
                                              [Free Trial] [Sign In]
```
- **장점**: 심플, 항목 최소화
- **단점**: CONNECT 미노출, Try/Buy 듀얼 CTA 없음

### Option C — Use Case/Industry 하이브리드 (Houdini 스타일)
```
Product | Use Cases▼ | Connect | Learn▼ | Support
              ├─ Game & VFX
              ├─ Fashion & Apparel
              ├─ Virtual Fashion
              └─ Architecture / Visualization
                                              [Free Trial] [Buy]
```
- **장점**: 도메인 기반 — 사용자가 자신의 분야로 진입, 업계 포지셔닝 강화
- **단점**: Solutions(플랜)와 Use Cases(도메인) 혼재 → Pricing 진입점 불명확

---

## 7. 검토 시 고려 사항

- **CONNECT 노출**: MD CONNECT는 경쟁사 대비 차별화 자산. Option A/C에서 독립 메뉴로 노출 필요
- **Pricing vs Buy CTA**: Pricing 메뉴 vs Buy CTA 중복 아닌지 검토 — Houdini는 Pricing 메뉴 없이 Buy CTA만 사용
- **Learn 볼륨**: 튜토리얼·Workshop·User Story 콘텐츠 볼륨에 따라 Learn 독립 메뉴 정당성 결정
- **Indie 플랜**: GNB에 노출 안 함 — Enterprise 페이지 내 배너로 처리 (solutions-copy.md 기준)
- **Authority 마커**: GNB 아래 sub-bar에 "Academy Award-Winning · Used by Weta Digital, DreamWorks" 1줄 바 검토

---

## 8. gnbResearch1과 합칠 때 확인 항목

- [ ] 기존 GNB 구조 최종 결정안 (gnbResearch1 내용)
- [ ] CONNECT 메뉴 레이블 확정 ("Connect" vs "Assets" vs "MD Connect")
- [ ] Learn 메뉴 하위 항목 목록
- [ ] Mobile GNB 처리 방식 (Hamburger 메뉴 구조)
- [ ] CTA 텍스트 최종안 ("Free Trial" vs "Try Free" vs "Start Free Trial")
- [ ] 언어 전환 (글로벌 vs CN 분기) 표시 위치
