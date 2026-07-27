# GNB & Features 콘텐츠 전략

작성일: 2026-04-27  
기반 리서치: gnbResearch1 (Figma.com GNB), gnbResearch2 (MD FigJam + 2026-RENEWAL), gnbResearch3 (CLO3D, Blender)  
Figma 레퍼런스: 2026-RENEWAL `Landing_Feature` (1332:953), `Landing_Enterprise` (1332:1116), `Landing_Acadmics` (1264:2641)

---

## 1. GNB 구조 결론

### 확정 구조

```
[MD 로고]   Features   Solutions ∨   Plan   Resources ∨   Download     [Sign In]
```

| 항목 | 타입 | 비고 |
|------|------|------|
| Features | 단일 링크 (`/features`) | 드롭다운 없음 |
| Solutions | 드롭다운 메가메뉴 | BY WORKFLOW / BY TEAM 2그룹 |
| Plan | 단일 링크 (`/plan`) | — |
| Resources | 드롭다운 | Manual / Release Notes / Tutorial / Blog |
| Download | 단일 링크 | — |
| Sign In | pill 버튼 | 우측 고정 |

> Figma.com처럼 "Pricing" 을 GNB에 노출하지 않음. 내부 명칭 "Plan" 사용.  
> Download는 CLO-SET, CONNECT 등 외부 링크 포함 가능 (FigJam Sticky 5 참조).

### Solutions 드롭다운 (Figma Solutions 패턴)

```
BY WORKFLOW                 BY TEAM
Game / VFX                  Individual Designers
Fashion Design              Enterprise
Virtual Fashion             Students
Architecture Viz            Academic Institutions
                            ─────────────────────
                            See all solutions →
```

---

## 2. Features — 단일 페이지 vs 다단계 Depth

### 검토한 옵션

**Option A — 단일 스크롤 페이지** (현 Figma 설계 방향)
```
/features
└── Hero
└── Feature Block 1: Simulation
└── Feature Block 2: Fabric & Material
└── Feature Block 3: Workflow Integration
└── CONNECT 섹션
└── CTA
```

**Option B — Depth 분리** (Figma Products / Blender 방식)
```
/features              ← 피처 인덱스 페이지
/features/simulation   ← 기능별 상세 페이지
/features/pattern
/features/export
/features/connect
```

### 결론: **Option A (단일 페이지)**

| 판단 기준 | A (단일) | B (Depth) |
|---------|---------|----------|
| Figma 설계 일치 | ✓ | — |
| 현재 MVP 범위 | 적합 | 과도 |
| 첫 방문자 UX | 낮은 마찰 | 클릭 depth↑ |
| SEO | 단일 URL 집중 | URL 분산 |
| 운영 부담 | 낮음 | 콘텐츠 N배 |
| 레퍼런스 | Blender (단일), MD Figma | Figma.com, CLO3D |

**Blender 레퍼런스 포인트**: `/features` 단일 페이지 + 상단 앵커 탭 (Modeling / Sculpting / Simulation / Rendering...) → 각 섹션은 상세하지만 서브 URL 없음.

**단, Depth 확장 조건**: 방문자 수 증가 후 기능별 트래픽 분석 → 특정 기능에 집중도 높으면 그때 서브 페이지로 분리.

---

## 3. Feature 페이지 콘텐츠 설계

> 레이아웃 기준: `Landing_Feature` (1332:953) — 다크 테마, 좌우 교번 블록

### GNB
```
Features (active)  Solutions ∨  Plan  Resources ∨  Download     [Sign In]
```

### Hero
```
Title:        Feature
Sub-title:    복잡함을 줄이고, 자연스러운 의상 표현을 위한 시뮬레이션 기반 작업 환경
              (Figma 1332:953 그대로)
CTA:          [Try Free]  [Get Started]
```

### Feature Block 구조 (반복 패턴)

각 블록 = `텍스트(좌/우) + 이미지 플레이스홀더 + 2개 sub-tag 링크`

```
[Block N]
H2:         기능명
Body:       기능 설명 (2~3문장, 기술 언어 아닌 결과 언어)
IMAGE:      기능 시연 GIF / 스크린샷
sub-tags:   [개인 디자이너에게 →]  [엔터프라이즈에게 →]
            ↓                        ↓
            /solutions/personal      /solutions/enterprise
```

sub-tag = 해당 기능이 각 페르소나에게 어떤 의미인지 한 줄 + Solutions 링크.  
→ **Feature ↔ Solutions 겹침 문제 해결**: Feature 페이지에서 페르소나 연결, Solutions에서 기능 심화.

### Feature 블록 목록 (우선순위 순)

| # | 블록 제목 | 핵심 메시지 | 이미지 타입 |
|---|---------|----------|-----------|
| 1 | 시뮬레이션 기반 의상 제작 | "폴리곤을 깎는 대신 물리엔진으로 자연스럽게" | 시뮬 GIF |
| 2 | 섬세한 소재 & 물성 표현 | "천의 성질, 중력, 마찰까지 의도한 그대로" | Fabric 클로즈업 |
| 3 | 워크플로우 통합 | "Maya, Houdini, Unreal Engine — 기존 툴 그대로" | 파이프라인 다이어그램 |
| 4 | 패턴 제작 & 편집 | "재단 패턴에서 시뮬레이션까지 한 캔버스에" | 패턴 에디터 화면 |
| 5 | MD CONNECT | "에셋 마켓에서 바로 가져다 시작" | CONNECT UI |

### Feature 페이지 하단 CTA
```
[CONNECT에서 Asset 가져와서 시작하기 →]
[Start with Free Trial]
```

---

## 4. Solutions — Features 겹침 해소 원칙

FigJam Sticky 15: "개인/엔터프라이즈/학생/교육기관 과 기능 랜딩 페이지 컨셉이 겹쳐서 고민 중"

**해소 방식:**

```
Feature 페이지              Solutions 페이지
─────────────────────       ─────────────────────────────
"이 기능이 뭐야?"            "이 기능이 나한테 왜 필요해?"

기능 설명 (how it works)    페르소나 가치 (what I get)
기술적 차별점                비즈니스/커리어 결과
→ Solutions sub-tag 링크    → Feature 상세 링크 (View feature →)
```

**규칙**: Feature 블록에는 기능 설명만. "당신에게 왜 좋은가"는 Solutions에.

---

## 5. Enterprise 페이지 콘텐츠

> 레이아웃 기준: `Landing_Enterprise` (1332:1116)  
> 레퍼런스: CLO3D Enterprise (`/en/enterprise`), gnbResearch3

### GNB
```
Features  Solutions ∨ (Enterprise active)  Plan  Resources ∨  Enrollment     [Sign In]
```
→ Download → Enrollment 로 변경 (Enterprise 컨텍스트).

### 섹션 구조

```
1. Hero
   Title:    Enterprise
   Sub:      팀과 스튜디오를 위한 의상 제작 환경.
             라이선스 운영부터 파이프라인 통합까지 규모에 맞게 구성합니다.
   CTA:      [View Plan]  [Request Demo]

2. Plan Cards — Enterprise Single / Enterprise Multi
   ├── Enterprise Single: $23/mo · 개인 라이선스 단위 팀 운영
   └── Enterprise Multi (Userpool): 라이선스 공유 · 프로젝트별 재할당
   → Indie Studio 배너 (Enterprise 조건 충족 시 특가)

3. 도메인별 활용 사례
   ├── VFX / Animation Studio
   └── Fashion Industry
   (이미지 2열 + 설명)

4. 핵심 기능 블록 (Feature 페이지에서 Enterprise 관련 발췌)
   ├── Linux OS 별도 기술지원
   │    "Windows 외 Linux 환경에서도 안정적으로 운영"
   │    [기술 지원 문의 →]
   └── 유연한 디자이너 & 리소스 관리
        "Maya / Houdini / Unreal Engine과 기존 파이프라인 그대로"
        "팀원·기기·라이선스 한 화면에서 관리"

5. Testimonial Callout (다크 박스)
   "MD로 만든 결과물은 스튜디오가 요구하는 포켓게 같습니다"
   (FigJam Sticky 12: 시뮬레이션 품질 강조)

6. CTA 블록
   [Ready to start Trial]
   [← CONNECT에서 Asset 가져와서 시작하기]
```

### CLO3D 대비 차별화 포인트

CLO3D Enterprise는 서비스(컨설팅, 전담 스페셜리스트) 중심.  
MD는 **소프트웨어 + Userpool 라이선스 유연성**이 차별점. 서비스보다 제품 기능으로 어필.

| CLO3D Enterprise | MD Enterprise |
|-----------------|--------------|
| Dedicated 3D Specialist | Userpool — 라이선스 재할당 |
| Material Digitalization Service | Linux 기술지원 |
| Digital Transformation Consulting | 파이프라인 통합 (Maya/Houdini/UE) |
| 100% Live Demos | Request Demo (자동 승인 범위 정책 필요) |

---

## 6. Academic 페이지 콘텐츠

> 레이아웃 기준: `Landing_Acadmics` (1264:2641)  
> 주의: 현 Figma 와이어프레임은 Content Section 1~4 플레이스홀더만 있음 → 콘텐츠 채워야 함

### 섹션 구조

```
1. Hero
   Title:    Academics
   Sub:      학교와 교육 기관을 위한 3D 의상 제작 교육 환경.
             수업 단위 라이선스 운영과 합리적인 가격으로 실무 툴을 교육합니다.
   CTA:      [Get Plan]  [Contact]

2. Trusted by (로고 바)
   → 파트너 교육기관 8개 로고 슬롯
   → 없으면 "학교 목록" 텍스트 리스트로 대체 가능 (FigJam 언급)

3. Content Section 1 — 합리적인 교육 가격
   "$1,500 / Copy / 연간 (Academic Annual)"
   Enterprise 대비 가격 우위 강조
   Copy 당 단가 — 수업 규모에 따라 조정 가능

4. Content Section 2 — 유연한 학생 관리
   학기·과정·클래스 단위 라이선스 운영
   "수업이 끝나면 다음 학기 학생에게 재할당"
   인증 상태: CompanyID 인증 대기 중 → "Verification in process" 표시

5. Content Section 3 — 커리큘럼 통합
   Game Art / Fashion Design / VFX 전공 커리큘럼에 바로 연결
   실무 툴로 교육하면 졸업 후 취업에 바로 이어짐
   (Students 페이지와 연결: "학생 개인 플랜 보기 →")

6. Content Section 4 — 학생 포트폴리오 / 성과
   수업에서 나온 결과물 이미지 슬롯
   또는 "교육기관 케이스 스터디" 텍스트 블록 (FigJam Sticky: "케이스 스터디 또는 학교 리스트")

7. CTA
   [Contact Academic Sales]
   인증 처리 기간 노출 안 함 (정책: 처리 기간 비공개)
```

### Academic vs Students 역할 분리

| | Academic (교육기관) | Students (학생 개인) |
|--|------------------|-------------------|
| 구매자 | 학교·교수·기관 담당자 | 학생 본인 |
| 플랜 | Academic Annual $1,500/Copy | Student 플랜 (최대 70% 할인) |
| 인증 | CompanyID 기관 인증 | 학교 이메일 / 재학증명서 |
| CTA | Contact Sales | 바로 구매 가능 |
| 최대 구매 | 라이선스 다수 운영 | **최대 2회 (2년) 구매 제한** |

---

## 7. Feature ↔ Solutions 연결 플로우

```
GNB
 ├── Features  ──────────────────────────────────────────── /features
 │                ↓ (sub-tag: "개인 디자이너에게")
 └── Solutions ─► Individual  ◄── Landing_Individual
                  Enterprise  ◄── Landing_Enterprise
                  Students    ◄── Landing_Students
                  Academic    ◄── Landing_Acadmics

Feature 블록                    Solutions 페이지
"시뮬레이션이 어떻게 작동하나"  "시뮬레이션으로 내 작업이 어떻게 달라지나"
    ↓ [엔터프라이즈에게 →]           ↓ [View feature →]
    /solutions/enterprise            /features#simulation
```

---

## 8. 미결 정책 항목 (개발·기획 협의 필요)

| 항목 | 현황 | 연관 페이지 |
|------|------|-----------|
| Enterprise Demo 자동 승인 범위 | 미정 | Enterprise CTA |
| Indie 가격 전면 노출 여부 | 고민 중 (FigJam) | Enterprise Plan Cards |
| Academic 인증 처리 기간 노출 | 비공개 원칙 | Academic Hero |
| 다국어 지원 언어 확정 | ko/zh/ja/en (Zendesk 기준) | 전체 GNB |
| Download vs Enrollment GNB 전환 조건 | 미정 | GNB 컨텍스트 분기 |
