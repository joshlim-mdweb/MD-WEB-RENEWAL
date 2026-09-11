# Figma 작업 통합 스펙

Figma 에이전트(figma-wireframe, figma-description 역할, md-figma persona)가 와이어프레임, Description, PRD 문서를 만들 때 따르는 단일 운영 스펙이다.

## 버전 관리표

| 버전 | 날짜 | 작성자 | 변경 내용 |
|---|---|---|---|
| 1.0.00 | 2026-09-01 | Josh Lim | 최초 작성: Figma 룰 7종 통합, 5대 변경 반영 (Screen Auto Layout, 최상위 FIXED, 하위 FILL, 간격 표, Description 텍스트 스타일), 화면별 분기 표현 3방법, PRD 표준 구성, Version 관리표 규격 추가 |
| 1.1.00 | 2026-09-01 | Josh Lim | 기획 문서 3종 체계 확정 (PRD 문서형, 기능명세, Version Table), Case Matrix 표 정본 지정, 기능명세 ID 체계와 페이지 코드 등록표 확정, 시각 토큰을 spec-visual.md로 분리, 문서 빌더 코드 이관, 기존 룰 파일 스텁화 |
| 1.2.00 | 2026-09-01 | Josh Lim | 버전 체계 3자리(x.x.xx) 전환, Description 검정 #18181E 통일, 기능명세 컬럼 개편 (요구사항 ID 삭제, 케이스와 권한 신설, 기능 ID 단축 FC-CO-001), PRD에 Screen Structure 섹션 신설, 관련 문서 블록에 Slack Canvas와 Jira 포함 |
| 1.3.00 | 2026-09-01 | Josh Lim | Screen Structure를 정보구조(IA) Depth 표로 재정의 (기능, 진입 경로 서술 금지), PRD 본문 폭 1400 확정, 프레임 폭 1920은 패딩 포함 외곽 폭임을 명시 |
| 1.3.01 | 2026-09-01 | Josh Lim | 기능명세 컬럼명 워딩 변경: 권한 → 사용자 (의미 동일) |
| 1.4.00 | 2026-09-01 | Josh Lim | PRD 본문 폭 제한 폐지: 본문도 콘텐츠 폭 전체(1792) 사용. 범용 템플릿(§9.7) 추가: PRD, 기능명세, Version Table 복붙 골격 |
| 1.5.00 | 2026-09-01 | Josh Lim | 관련 문서 블록을 문서 제목 바로 아래로 이동, 라벨 간소화 (정책 문서, 티켓). docs/policy 지칭을 "정책 문서"로 통일 |
| 1.6.00 | 2026-09-01 | Josh Lim | 상위 워크플로우 확정: 정책 문서 확정, 기획, 기획 문서 3종 작성, Figma 화면 작업 순. 기획 문서 3종 없이 와이어프레임 착수 금지 게이트 추가. User Flow 차트를 Figma에 그리는 규격(§9.8) 신설 |
| 1.7.00 | 2026-09-01 | Josh Lim | User Flow 제작 도구를 에디터 아티팩트로 확정: 에디터에서 작성과 수정, Figma에는 2x PNG 삽입. Figma 벡터 렌더러는 보류 |
| 1.8.00 | 2026-09-01 | Josh Lim | 와이어프레임 셸 색 변경: Outer 배경 #F5F5F5 → #FFFFFF, Screen, Description 패널, Description Header에 #E6E6E6 2px border 신설 (Board Header와 동일). §11.3 코드 반영 |
| 1.9.00 | 2026-09-09 | Josh Lim | 플로우 목록 도출 기준 신설 (§9.8): 사용자 목표 단위, 도출 소스 3곳, 차트 조건, 분할 기준. 기능명세 사용자 표기 확정: 로그인 주체는 Member (§9.5). 문서 빌더 docText 순서 정정 (§11.5): characters 먼저, 사이징 마지막 |

---

## 0. 문서 소개

### 0.1 적용 범위

- **이 문서 확정 이후의 신규 작업부터 적용한다.** 기존 화면은 소급 수정하지 않는다
- 이 문서와 `spec-visual.md`(시각 토큰)가 정본이다. 프로젝트의 figma 계열 룰 7종은 스텁화됐다 (2026-09-01)
- 전역 `~/.claude/rules/figma-description.md`는 타 프로젝트(CLO-SET, CLOVER-ADMIN)가 계속 쓰므로 내용을 유지한다. MD-WEB 작업에서 충돌하면 이 문서가 우선한다

### 0.2 통합 원본 (스텁화됨)

| 원본 | 이 문서에서의 위치 |
|---|---|
| `~/.claude/rules/figma-description.md` (전역, 내용 유지) | §6 Description 작성 |
| `.claude/rules/figma-read.md` | §1 파이프라인 |
| `.claude/rules/figma-draw.md` | §2 프레임 계층, §11 코드 패턴 |
| `.claude/rules/figma-write.md` | §12 금지 패턴, QA |
| `.claude/rules/figma-wireframe-ds.md` | §3 간격, §4 + `spec-visual.md` |
| `.claude/rules/figma-annotation.md` | §8 Annotation |
| `.claude/rules/figma-feature-naming.md` | §5 네이밍 |
| `.claude/rules/figma-spec-card.md` | §9 기획 문서 3종, §11.5 문서 빌더 |

### 0.3 5대 변경 (2026-09-01 확정)

기존 룰 대비 달라진 핵심. 근거는 Account 섹션(`PeCid7uJcg0HenViaaiHUp`, 5933:3427) 실측.

| # | 변경 | 기존 | 신규 |
|---|---|---|---|
| 1 | Screen에 Auto Layout | `layoutMode = NONE` | VERTICAL Auto Layout (§2.3) |
| 2 | 최상위는 FIXED width | 혼재 | 캔버스 직속 프레임은 전부 고정 폭 (§2.2) |
| 3 | 하위는 FILL | 혼재 (FIXED 다수) | Auto Layout 자식은 FILL 기본 (§2.2) |
| 4 | 상황별 간격 명시 | 산발 정의 | 간격 표 단일 기준 (§3) |
| 5 | Description 텍스트 스타일 | 단일 스타일 | 링크 파란색, 중요 SemiBold, 정책 결정 필요 빨간색 (§7) |

---

## 1. 파이프라인

**상위 워크플로우 (2026-09-01 확정).** 페이지 하나의 작업은 이 순서로 굴러간다.

```
정책 문서 확정 (docs/policy) → 기획 (Josh와 협의)
→ 기획 문서 3종 작성 (§9: PRD, 기능명세, Version Table)
→ Figma 화면 작업 (아래 실행 파이프라인)
```

**화면 그리기는 기획 문서 3종 작성 후에 시작한다.** PRD 세트 없이 와이어프레임 착수 금지.

Figma 화면 작업은 이 실행 순서를 따른다. 단계를 건너뛰지 않는다.

```
읽기 (§1.1) → 스펙 매트릭스 유저 확인 (§1.2) → 그리기 (§2~§5, §11)
→ Description (§6~§7) → Annotation (§8) → Screenshot 검증 (§12.3)
```

### 1.1 읽기 프로토콜

**참조 없이는 아무것도 하지 않는다.** 추측으로 쓴 수치는 전부 틀린다.

읽기 시작 전 체크:

- 참조 프레임 URL 또는 node-id를 유저에게 받았는가
- `setCurrentPageAsync`로 대상 페이지를 전환했는가 (한 스크립트에 1회만)
- 이전 세션 node ID를 재사용한다면 `getNodeByIdAsync` + null 체크로 실존 확인했는가

**분할 읽기.** `use_figma` 출력은 20kb 상한이 있다. 대형 프레임은 반드시 3단계로 나눈다.

1. top-level children만 추출 (id, name, type)
2. 섹션 목록을 유저에게 보고
3. 섹션별 개별 호출로 상세 읽기. 예상 섹션 수와 반환 수가 다르면 잘림 의심, 재추출

**측정 항목.** 컴포넌트 하나를 만들기 전에 전부 측정한다: fills, strokes, cornerRadius, layoutMode, sizing mode 2종, align 2종, padding 4방향 개별, itemSpacing, width, height, layoutSizing 2종, 폰트 family + style + size, 텍스트 색, clipsContent.

**색상 정밀도.** Figma 내부 색상은 `r: 0.2705882489681244` 같은 정밀값이다. 실측 소수를 그대로 쓴다. 반올림 추측 금지. 새 색을 정의할 때만 HEX에서 4자리 변환. DS 토큰 표 값과 실측이 다르면 **실측 우선**.

### 1.2 스펙 매트릭스

읽기 완료 후 아래를 출력하고 유저 OK를 기다린다. OK 없이 그리기 시작 금지.

```
[작업명] 스펙 확인
섹션 목록: (번호, 섹션명, 주요 내용)
조건 분기: (케이스별 ON/OFF 항목)
참조 프레임: (사용한 node-id)
측정 완료 항목: (컴포넌트별 측정 여부)
→ 이 스펙으로 진행할까요?
```

---

## 2. 프레임 계층 규격 ★ 변경 1, 2, 3

### 2.1 와이어프레임 프레임 전체 구조

```
Outer Frame        2448 FIXED × HUG(minH 1216) · VERTICAL · pad 24 · gap 24 · radius 12
├── Header         FILL × HUG · HORIZONTAL · gap 12
│   ├── Board Header        1920 FIXED × 64 · HORIZONTAL (§2.4)
│   └── Description Header  FILL × 64 · 중앙 정렬 · "DESCRIPTION" Medium 18
└── Contents       FILL × 1080 FIXED · HORIZONTAL · gap 12
    ├── Screen             1920 FIXED × FILL · VERTICAL Auto Layout (§2.3)
    └── Description 패널    FILL × FILL · VERTICAL (§2.5)
```

이 문서의 트리 다이어그램(코드 블록) 안에서만 `·` 구분자를 쓴다. 산문과 표에서는 쓰지 않는다.

**Outer 높이는 1216이 표준이다.** Outer가 HUG이므로 자식을 더 붙이면 조용히 늘어난다. 실측에서 하단에 주석 프레임을 붙여 2448×1260으로 이탈한 사례(6228:4350)가 확인됐다. **Contents 아래에 형제 노드를 추가하지 않는다.** 각주가 필요하면 Description 패널 안에 쓴다.

### 2.2 Sizing 3원칙 ★

| 원칙 | 규칙 | 이유 |
|---|---|---|
| **최상위는 FIXED** | 캔버스에 직접 놓이는 프레임(Outer, 케이스 프레임, 상태 시트, 기획 문서 3종)은 고정 폭. FILL, HUG 금지 | 폭이 콘텐츠에 끌려다니면 캔버스 그리드가 깨진다 |
| **하위는 FILL** | Auto Layout 자식 프레임은 `layoutSizingHorizontal = "FILL"` 기본. 고정 폭은 명시된 예외(Screen 1920, Board Header 1920, 레이블 폭)뿐 | 부모 폭 변경이 자동 전파된다 |
| **높이는 HUG** | 콘텐츠 컨테이너 높이는 `primaryAxisSizingMode = "AUTO"`. 고정 높이는 규격 값(Contents 1080, 버튼 48)뿐 | 내용 증감에 자동 대응 |

표준 고정 폭:

| 프레임 | 폭 |
|---|---|
| Outer, TITLE | 2448 |
| Screen, Board Header | 1920 |
| 케이스 프레임 | 992 (카드 960 + 패딩 16×2) |
| 컴포넌트 상태 시트 | 대상 컴포넌트 폭 + 패딩 16 |
| PRD, 기능명세, Version Table | 1920 기본. 표 문서는 컬럼 수에 따라 확장 허용 (§9.4) |

### 2.3 Screen Auto Layout ★ 변경 1

**`layoutMode = NONE` Screen은 폐기한다.** Screen은 VERTICAL Auto Layout이다.

```
Screen          1920 FIXED × FILL · VERTICAL · gap 0 · pad 0 · clipsContent true · radius 8
├── GNB instance   FILL × 96 (고정 높이)
└── Body           FILL × FILL · HORIZONTAL · 정렬 CENTER/MIN · gap 0
    └── ContentArea   콘텐츠 폭 FIXED × FILL · VERTICAL · pad 40 · gap 24
        ├── Breadcrumb Row
        ├── Page Title
        ├── 카드 스택 (gap 24)
        └── ...
```

- **Page 래퍼 제거.** 기존 Screen 안의 `Page`(1920×1080 동일 크기 중복 래핑)는 만들지 않는다. Screen이 곧 페이지 컨테이너다
- **ContentArea 중앙 정렬은 Body의 `counterAxis`가 아니라 `primaryAxisAlignItems = "CENTER"`로 만든다.** 좌우 padding 340 하드코딩(실측에서 발견)은 금지: ContentArea 폭이 바뀌면 어긋난다
- ContentArea 폭은 화면 설계값(마이페이지 계열 1040 등)으로 FIXED. 내부 자식은 FILL

**오버레이(dim, modal, toast)는 절대 배치로 얹는다.** Auto Layout 자식이 되면 레이아웃을 밀어낸다.

```javascript
screen.appendChild(dim);
dim.layoutPositioning = 'ABSOLUTE';   // append 후에만 설정 가능
dim.x = 0; dim.y = 0;
dim.resize(1920, screen.height);
dim.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
```

**Screen 오버플로 처리.** 콘텐츠가 1080을 넘으면 Screen을 늘리는 게 아니라 Contents 높이를 키운다.

```javascript
contents.resize(contents.width, newHeight);   // Screen과 Description은 FILL이라 따라온다
```

### 2.4 Board Header

기존 화면에서 layoutMode NONE으로 남아 있던 것을 교정한다. **HORIZONTAL Auto Layout**으로 만든다.

```
Board Header   1920 FIXED × 64 FIXED · HORIZONTAL · 정렬 MIN/CENTER
               padLeft 14, padRight 14 · gap 8 · 흰 배경 · stroke #E6E6E6 2 · radius 8
├── texts[0]  Main Label   Poppins Medium 18 · #454545 · ALL CAPS
├── texts[1]  "  |  "      Poppins Regular 18 · #454545
└── texts[2]  Sub Label    Poppins Regular 18 · #858585 · 경로형
```

텍스트 형식은 §5.2를 따른다.

### 2.5 Description 패널

```
Description 패널    FILL × FILL · VERTICAL · pad 12 · clipsContent true · radius 8
└── Description List   FILL × HUG · VERTICAL · pad 10 · gap 10
    └── Annotation 카드 × N   FILL × HUG · VERTICAL · pad 8 · gap 6
        ├── Title Row   FILL × HUG · HORIZONTAL · gap 6 · 정렬 MIN/CENTER
        │   ├── Annotation Badge  25×25 · 원형 #E25927 · 번호 Medium 12 흰색
        │   └── 제목 텍스트       FILL · Poppins Medium 13 · #18181E (desc.ink)
        └── 본문 텍스트           FILL · Poppins Regular 12 · #666666 · native 불릿 (§7)
```

- **프레임 높이는 양쪽을 다 보고 정한다.** Description 패널은 clipsContent라 Screen보다 길면 조용히 잘린다. Screen 콘텐츠와 Description List 중 큰 쪽 기준으로 Contents 높이를 잡는다
- 카드 삽입 완료 후 `screenshot()`으로 gap 육안 확인. itemSpacing이 변했으면 10으로 재설정

### 2.6 케이스 프레임, 컴포넌트 상태 시트

캔버스에 직접 놓이는 보조 프레임. 최상위이므로 **FIXED 폭** (§2.2).

```
케이스 프레임      992 FIXED × HUG · VERTICAL · pad 16 · gap 16 · radius 8
컴포넌트 상태 시트  (컴포넌트 폭+16) FIXED × HUG · VERTICAL · pad 8 · gap 24 · radius 8
└── 상태 항목       FILL × HUG · VERTICAL · gap 8
    ├── 상태 레이블  Poppins Regular 12 · #666666
    └── 컴포넌트 샘플
```

**간격, 크기는 정수만 쓴다.** 실측에서 `itemSpacing 6.5242719650268555`가 HUG 체인을 타고 올라가 프레임 높이를 `328.61163330078125`로 만든 사례가 확인됐다. 소수 간격이 보이면 §3 스케일 값으로 교정 후 진행한다.

### 2.7 캔버스 배치

```
프레임 크기   TITLE, Outer 모두 2448 × 1216
열 간 gap    40
행 간 gap    120

x 좌표: TITLE 100 → 이후 열마다 +2488 (2448 + 40)
y 좌표: Row 1 100 → 이후 행마다 +1336 (1216 + 120)
```

케이스 프레임, 상태 시트는 소속 행의 와이어프레임 오른쪽에 열 gap 40으로 나란히 배치한다. 높이가 1216을 넘는 프레임이 있는 행은 행 pitch를 실제 높이 + 120으로 늘린다.

---

## 3. 간격 체계 ★ 변경 4

### 3.1 스케일

**허용 값: 0, 4, 8, 12, 16, 24, 40.** 캔버스 배치 전용으로 120을 추가 허용한다.
Description 계열은 기존 화면과의 연속성을 위해 6, 10을 예외로 유지한다.

이 표에 없는 값이 필요하면 임의로 만들지 않고 유저와 논의한다. **소수 금지** (§2.6).

### 3.2 상황별 간격 표

Account 섹션 실측 기반. 그리기 전에 이 표에서 값을 찾고, 없으면 §3.1 스케일에서 고른다.

| 레벨 | 상황 | 값 |
|---|---|---|
| 캔버스 | 와이어프레임 열 간 | 40 |
| 캔버스 | 행 간 | 120 |
| 보드 | Outer 패딩 | 24 |
| 보드 | Header와 Contents 사이 | 24 |
| 보드 | Board Header와 Description Header 사이 | 12 |
| 보드 | Screen과 Description 패널 사이 | 12 |
| Screen | GNB와 Body 사이 | 0 |
| Screen | ContentArea 패딩 | 40 |
| Screen | 섹션 간 (Breadcrumb, 타이틀, 카드 그룹, Danger Zone) | 24 |
| 카드 | 카드와 카드 사이 | 24 |
| 카드 | 카드 내부 패딩 | 16 |
| 카드 | 정보 행(Form Row) 간 | 24 |
| 카드 | 콤팩트 요소 간 (배너 내부, 요약 행) | 12 |
| 카드 | 인라인 요소 간 (아이콘과 텍스트, 레이블과 배지) | 4 또는 8 |
| Description | 패널 패딩 | 12 |
| Description | List 패딩, 카드 간 | 10 |
| Description | 카드 패딩 | 8 |
| Description | 배지, 제목, 본문 사이 | 6 |
| 보조 | 케이스 프레임 패딩 | 16 |
| 보조 | 상태 시트 패딩 | 8 |
| 보조 | 상태 시트 항목 간 | 24 |
| 보조 | 상태 레이블과 샘플 사이 | 8 |

기존 룰과 다른 값 두 곳은 실측 우선으로 확정했다: 카드 간 gap 16 → **24**, 정보 카드 행 간 12 → **24**. 콤팩트 맥락(Checkout Form 등)의 12는 유지한다.

---

## 4. 디자인 토큰

색, 폰트, 컴포넌트의 시각 규격은 **`spec-visual.md`가 정본**이다. 토큰 표와 컴포넌트 생성 함수(createCard, createFormRow, createCTA, createActionButton)는 전부 그 파일에 있다. 여기서는 원칙만 잠근다.

### 4.1 원칙

- 팔레트 값이 아닌 **용도** 기준으로 토큰을 고른다. 자의적 색상, 크기 지정 금지
- Screen 안에서 유채색은 State 3종(`state.warning-bg`, `state.warning-border`, `state.error-text`)만. 강조는 굵기와 크기로만
- **Figma 안에서는 Poppins만 쓴다.** Regular, Medium, SemiBold 3종. 한글도 Poppins로 지정하고 Figma fallback에 맡긴다. Bold, Italic, Inter, Pretendard 금지
- 폰트 3종을 스크립트 시작에서 사전 로드한다. 대상 페이지에 기존 Inter 노드가 있으면 Inter Regular도 함께 로드

```javascript
await figma.loadFontAsync({ family: 'Poppins', style: 'Regular' });
await figma.loadFontAsync({ family: 'Poppins', style: 'Medium' });
await figma.loadFontAsync({ family: 'Poppins', style: 'SemiBold' });
```

- 상태 표현: selected는 `border.strong`, disabled는 `border.faint` + `text.muted`. 배경색 변경 금지
- Billing Toggle Card의 순서 규칙(연간 왼쪽 + default 선택)은 변경 금지 (`spec-visual.md` §3)

### 4.2 언어 규칙

**와이어프레임 내 모든 UI 문구는 영문.** 버튼 레이블, 상태 텍스트, 안내 문구, 섹션 헤딩, Board Header sub label 전부 해당한다. 가상 데이터(더미 이름, 샘플 날짜)만 한국어 허용. UI 문구는 출력 전 `/copy-review` 검수를 거친다 (기준 `.claude/rules/ux-writing.md`).

Description, Annotation 설명 문장은 한국어로 쓰되, UI에 실제 표시되는 텍스트 인용은 영문 그대로 유지한다.

---

## 5. 네이밍

### 5.1 섹션 타입 3종

| 타입 | 정의 | 판단 |
|---|---|---|
| **STRUCTURE** | 화면 전체 구조 문서화 | 특정 상태 기준의 기본 화면 |
| **FEATURE** | 특정 플로우의 액션 흐름 | 버튼 클릭 후 상태 변화를 단계별 추적 |
| **CASE VIEW** | 조건별 UI 분기를 한 프레임에 나열 | 특정 섹션 하나만 조건별로 달라질 때 |

화면 전체 레이아웃이 계정 유형별로 다르면 STRUCTURE 프레임을 분리하고, 섹션 하나만 다르면 CASE VIEW를 쓴다.

### 5.2 프레임명과 Board Header 텍스트

**STRUCTURE**: Main Label `"[SCOPE]: [SCREEN] — [STATE]"` (ALL CAPS), Sub Label `"[Tab] | [Full Screen Name]"`.

**FEATURE**: 프레임명 `"[Feature Name] N"` (번호는 섹션 전체 연속, 케이스마다 1부터 재시작 금지). Sub Label `"[Feature Name] N — [상태 설명]"`. 상태 설명 키워드: View, Form Open, Edit Mode, Saved, Changed, Dropdown Open 등.

**CASE VIEW**: 프레임명 `"[Section]_CaseView"`. Sub Label 끝에 `"| Case View"`.

clone 직후 즉시 이름을 부여한다. Board Header가 "COMMON"으로 방치되면 식별 불가.

### 5.3 Row Label (FEATURE 전용)

케이스 분기가 있을 때 각 케이스 영역 위에 배치. 형식 `"Case N — [케이스 설명]"`. A/B/C 표기 금지, 숫자만. CASE VIEW에서는 Row Label을 쓰지 않는다 (번호 배지 + 케이스 레이블로 대체).

### 5.4 약어 금지

**머리글자 + 번호로 케이스 코드를 만들지 않는다.** `BP1`, `OS3`, `H1` 금지. `Billing Preference 1 — Individual, Student`처럼 전체 명칭 + 번호 + em dash + 설명. 나열 구분자는 쉼표.

- 폐지 용어를 프레임, 섹션명에 쓰지 않는다: `License ID`, `Group`, `Copy`, `MemberType`, `Personal` (개인 계열 통칭도 Individual)
- 레이어 이름과 렌더 텍스트를 함께 확인한다. 텍스트를 고치면 `node.name`도 맞춘다
- 허용 약어: 업계 표준(CTA, GNB, SNB, VAT, PG)과 승인 용어(SW Account, Seat, Organization)

---

## 6. Description 작성

Description은 Markdown 원고를 먼저 쓰고(§6.1~6.6), §7 규약으로 Figma에 삽입한다. **골격 선행: 컴포넌트 식별 → Q1~Q3 판단 → 구조 잠금 → 내용 채우기.** 자유 작문 금지.

### 6.1 계층 구조 L0~L3

```
L0  **[화면명]**            화면 식별자. 이 한 줄이 전부, 불릿 절대 금지
L1  **① [컴포넌트명]**      독립 UI 요소. 번호 필수
L2  - 불릿                  컴포넌트의 속성 1개 (1불릿 1사실)
L3    - 서브불릿             L2 속성의 상세값. 카테고리 레이블 뒤에만. L4 금지
```

L3 서브불릿은 반드시 카테고리 레이블(`상태:`, `옵션:`, `조건부 노출:`, `케이스 분기:`) 뒤에 온다. "비즈니스 로직:" 레이블은 쓰지 않고 "케이스 분기:"를 쓴다. 분기가 1개면 레이블 없이 단독 불릿.

### 6.2 컴포넌트 판단 Q1~Q3 (L1과 L2 결정)

```
Q1. 화면에서 시각적으로 독립된 영역인가? (카드, 섹션, 배너, 모달, 테이블, 탭)  YES → L1
Q2. 자체 상태를 가지는가? (Default, Hover, Disabled, Loading, Error)            YES → L1
Q3. 사용자 인터랙션이 있는가? (클릭, 호버, 입력)                                YES → L1
전부 NO → L2 (소속 컴포넌트의 속성으로 기술)
```

- **콜론 판별법**: L2 불릿에 `요소명: 설명` 패턴이 보이면 L1 분리 검토 신호
- **평탄화 원칙**: 카드 안의 버튼처럼 L1 안에 L1이 있으면 중첩하지 않고 둘 다 독립 Numbered Note로 분리
- **예외**: 확인 모달과 그 내부 액션 버튼은 노트 하나로 통합. 평탄화 분리는 화면 레벨 컴포넌트에만 적용

### 6.3 불릿 작성 원칙

| 쓴다 (화면에서 안 보이는 것) | 안 쓴다 (화면에서 보이는 것) |
|---|---|
| 동작 (클릭 시 결과) | 버튼 레이블 텍스트 반복 |
| 상태 변화, 조건, 케이스 분기 | 요소의 위치, 색상, 크기 |
| 에러 처리, 이동 경로 | 디자인 스펙 (px, hex) |

- 1불릿 1사실. 주어 생략. 단문
- **조건 분기는 `~한 경우:` 형식만.** IF, ELSE, 화살표 표기 금지
- 인터랙션 구조 고정: `- [트리거] 시: [동작]` 아래 `- 성공:` `- 실패:`. 성공 후 분기는 `케이스 분기:` 블록으로, 실패 분기가 여러 개면 `실패 케이스:` 블록으로 분리
- 상태 나열은 라이프사이클 순서 고정: Active → Trial → Pause Scheduled → Paused → Cancel Scheduled → Cancelled → Expired
- API 연동 컴포넌트는 Loading(Skeleton 기준, 로딩 휠 금지), Empty, Error 필수 작성. 상태별 실제 표시 문자열을 따옴표로 명시. "Default/Filled/Error 상태"로 압축 금지
- 토스트 기본값: 실패 `"Something went wrong. Please try again."`, 성공 `"Changes have been saved."` 구체 문구가 확정된 케이스만 그 문구 사용
- 노트 제목은 명사형, 담백하게. `(신규 기능)` 같은 괄호 부가 표기 금지
- **화면 요소를 "행"으로 부르지 않는다** (2026-09-08 확정). 요소는 자기 이름으로(`Discount는 쿠폰 전용`), 집합 지칭은 "항목"(`각 항목은 이름과 산식을 두 줄로`), 캡션 위치는 `Seats 아래` 형식
- 동적 치환은 실제 표시 문자열에 `{변수명}` 인라인. 값에만 중괄호, 고정 레이블에는 금지. 금액은 `n USD`
- 근거 줄(`근거: docs/policy/...`)은 Description 본문에 넣지 않는다

### 6.4 포맷 선택과 COMMON

- **Format B (Numbered Note)가 기본값.** Format A(전체 패널, 단계 번호)는 로그인, 회원가입처럼 단계형 플로우에만
- GNB, SNB 등 반복 요소는 COMMON 섹션에서 한 번만 정의. 개별 화면에서는 별도 Numbered Note로 `→ COMMON 참조` 한 줄 (Header Note에 넣지 않는다)
- 파생 프레임은 근간 프레임 참조 + 차이점만 기술. 중복 기재 금지

### 6.5 화면별 분기 표현 3방법 ★

한 화면이 사용자 상태나 조건에 따라 다르게 보이면, 아래 셋 중에서 조합해 표현한다.

| 방법 | 언제 | 이 스펙에서의 구현 |
|---|---|---|
| ① 케이스별 화면 분리 | 화면 전체가 케이스별로 다를 때 | STRUCTURE 프레임 분리 (§5.1). 섹션 하나만 다르면 CASE VIEW |
| ② 케이스 표 | 조건과 노출 결과를 대조할 때 | CASE VIEW Description의 `조건부 노출:` 블록. 케이스 × 컴포넌트 매트릭스가 크면 Case Matrix 표(§9.4)로 분리: 케이스는 열, 컴포넌트는 행 |
| ③ 플로우차트 첨부 | 분기 3개 이상이거나 조건이 복잡할 때 | Figma User Flow 차트(§9.8)를 PRD 옆에 배치. 검토용 임시본은 `/flowchart` 스킬 산출물 |

분기가 3개 이상인 화면 설계에는 ③을 기본 첨부한다. 화면만 보고 흐름을 이해하기 어려운 경우 필수.

케이스 레이블은 축약 금지, 전체 명칭. 해당 없는 케이스는 `미표시`. 동일 결과는 `/`로 묶는다.

### 6.6 Header Note와 케이스 컨텍스트

Header Note는 `**[화면명]**` 한 줄이 전부다. 컨텍스트, 접근 조건, COMMON 참조를 불릿으로 추가하지 않는다. 진입 조건이 정말 필요하면 별도 `**① Page Context**` Note를 만들고, 화면에서 자명하면 그것도 생략한다.

노트 본문 첫 줄에 제목(요소명, 변형명)을 반복하지 않는다 (2026-09-07 확정). `~을 구매한 경우의 형태` 류 첫 줄 금지, 규칙 줄부터 시작한다. 제목이 말한 것을 본문이 다시 말하는 것은 정책 문서 금지 패턴 4와 같은 원리다.

---

## 7. Description 텍스트 스타일 ★ 변경 5

### 7.1 스타일 4종

| 용도 | 원고 표기 | Figma 스타일 |
|---|---|---|
| 기본 본문 | 일반 텍스트 | Poppins Regular 12, `#666666` |
| **링크** (다른 프레임, 문서, COMMON 참조) | `[표시 텍스트](url)` | Regular 12, **`desc.link` `#0066CC`** + hyperlink |
| **중요** (확정 정책값, 절대 규칙, 금액, 기한) | `**텍스트**` | **Poppins SemiBold 12**, `desc.ink` `#18181E` |
| **정책 결정 필요** | `*(정책 확인 필요: ...)*` `*(결정 필요: ...)*` `*(협의 필요)*` | Regular 12, **`desc.flag` `#CC3300`** |

- 링크 url이 Figma 노드 링크면 `setRangeHyperlink`에 `{ type: 'NODE', value: nodeId }`, 외부 url이면 `{ type: 'URL', value: url }`
- 중요 표시는 절제한다. 카드 하나에 SemiBold가 3곳을 넘으면 강조가 아니다
- Bold는 쓰지 않는다. 강조는 SemiBold까지 (§4.2)

### 7.2 삽입 코드: applyRichDescription()

`-` 하이픈을 plain text로 넣으면 화면에 그대로 노출된다. 반드시 native 불릿 + 스타일 변환을 함께 적용한다. 기존 `applyBullets()`를 대체한다.

```javascript
async function applyRichDescription(node) {
  await figma.loadFontAsync({ family: 'Poppins', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Poppins', style: 'SemiBold' });
  const LINK = { r: 0, g: 0.4, b: 0.8 };      // #0066CC desc.link
  const FLAG = { r: 0.8, g: 0.2, b: 0 };      // #CC3300 desc.flag
  const EM_COLOR = { r: 0.0941, g: 0.0941, b: 0.1176 };   // #18181E desc.ink

  // 1. 불릿 레벨 파싱
  const parsed = node.characters.split('\n').map(line => {
    if (line.startsWith('  - ')) return { text: line.slice(4), level: 2 };
    if (line.startsWith('- '))   return { text: line.slice(2), level: 1 };
    return { text: line, level: 0 };
  });

  // 2. 인라인 span 파싱: **중요**, [링크](url), *(플래그)*
  const spans = [], clean = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\(([^)]*)\)\*/g;
  for (const l of parsed) {
    let out = '', last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(l.text))) {
      out += l.text.slice(last, m.index);
      if (m[1] !== undefined) {
        spans.push({ line: clean.length, start: out.length, len: m[1].length, kind: 'em' });
        out += m[1];
      } else if (m[2] !== undefined) {
        spans.push({ line: clean.length, start: out.length, len: m[2].length, kind: 'link', url: m[3] });
        out += m[2];
      } else {
        const s = '(' + m[4] + ')';
        spans.push({ line: clean.length, start: out.length, len: s.length, kind: 'flag' });
        out += s;
      }
      last = m.index + m[0].length;
    }
    out += l.text.slice(last);
    clean.push({ text: out, level: l.level });
  }

  // 3. 텍스트 교체 + native 불릿 + range 스타일
  node.textAutoResize = 'HEIGHT';
  node.characters = clean.map(l => l.text).join('\n');
  let pos = 0; const lineStart = [];
  for (const line of clean) {
    lineStart.push(pos);
    const end = pos + line.text.length;
    if (line.level > 0 && line.text.length > 0) {
      node.setRangeListOptions(pos, end, { type: 'UNORDERED' });
      if (line.level === 2) node.setRangeIndentation(pos, end, 2);
    }
    pos = end + 1;
  }
  for (const s of spans) {
    const a = lineStart[s.line] + s.start, b = a + s.len;
    if (s.kind === 'em') {
      node.setRangeFontName(a, b, { family: 'Poppins', style: 'SemiBold' });
      node.setRangeFills(a, b, [{ type: 'SOLID', color: EM_COLOR }]);
    }
    if (s.kind === 'link') {
      node.setRangeFills(a, b, [{ type: 'SOLID', color: LINK }]);
      if (/^https?:/.test(s.url)) node.setRangeHyperlink(a, b, { type: 'URL', value: s.url });
      else if (/^\d+:\d+$/.test(s.url)) node.setRangeHyperlink(a, b, { type: 'NODE', value: s.url });
    }
    if (s.kind === 'flag') node.setRangeFills(a, b, [{ type: 'SOLID', color: FLAG }]);
  }
  return node.id;
}
```

삽입 후 반드시 `screenshot()`으로 불릿, 색, 굵기를 육안 확인한다.

---

## 8. Annotation

**모든 어노테이션은 한국어.** UI에 실제 표시되는 텍스트만 영문 유지. 기술, 디자인 스펙(px, hex, CSS) 금지. 의도, 상태, 하위 옵션만 기술.

### 8.1 타입별 형식

| 타입 | 범위 | 형식 |
|---|---|---|
| **STRUCTURE** | 모든 주요 UI 요소 | `[요소명]` + 의도 + `상태:` (버튼은 호버, 클릭 필수) |
| **FEATURE** | 액션 버튼, 변화 요소만 | `→ [버튼명] 클릭 시 [결과]` 한 줄. 의도 설명 없음. end state 프레임은 어노테이션 없음 |
| **CASE VIEW** | 케이스 레이블 | 번호 배지 + 케이스명 텍스트만. 설명 없음 |
| **델타** (Flow 2번째 화면부터) | 변화 요소만 | `→` 액션 결과, `+` 조건 등장, `×` 조건 소멸 |

### 8.2 Clone 후 처리

STRUCTURE를 clone해 FEATURE를 만들 때 **clone 직후 즉시** 어노테이션 전체 삭제. STRUCTURE에서 STRUCTURE로 분리할 때는 유지하고 내용만 수정.

```javascript
const ANNOTATABLE_TYPES = new Set(['FRAME','COMPONENT','INSTANCE','TEXT','RECTANGLE',
  'ELLIPSE','VECTOR','LINE','POLYGON','STAR','GROUP','BOOLEAN_OPERATION']);
function clearAnnotations(node) {
  if (node.type !== 'SECTION' && ANNOTATABLE_TYPES.has(node.type)) {
    try { if (node.annotations && node.annotations.length > 0) node.annotations = []; } catch(e) {}
  }
  if ('children' in node) node.children.forEach(c => clearAnnotations(c));
}
clearAnnotations(clonedFrame);   // 건너뛰기 금지
```

와이어프레임 본문에 `*` 접두 footnote 텍스트 삽입 금지. 설명은 어노테이션으로만.

---

## 9. 기획 문서 3종: PRD, 기능명세, Version Table

한 페이지(기능 단위)의 기획 문서는 Figma에 **3개가 생성된다** (2026-09-01 확정). 이전의 Spec Doc 3종(Scope, Feature Spec, Flow & Case) 체계는 이 체계로 대체하고, Scope와 Flow & Case의 내용은 PRD 안의 섹션과 표로 흡수한다.

| # | 문서 | 형식 | 역할 |
|---|---|---|---|
| 1 | **PRD** | 문서형 (읽는 문서) | 왜, 무엇을, 어디까지, 어떤 흐름으로 (§9.2, §9.3) |
| 2 | **기능명세** | 표형 | 화면별 기능 목록과 상세. Description과 대응 (§9.5) |
| 3 | **Version Table** | 표형 | 개정 이력 (§10) |

**기능명세까지가 PRD 세트다.** 기능명세 없이 PRD를 완료 처리하지 않는다.

### 9.1 그릴 것과 전달만 할 것

```
Q1. 여러 사람이 반복해서 열어보는가?        YES → 그린다
Q2. 다 쓰이면 사라지는 작업 지시인가?        YES → 그리지 않는다. TODO.md 행으로 배정
```

PRD, 기능명세, Version Table은 그린다. 화면 목록, 프레임 인벤토리, 미결 항목 목록은 전달만 한다.

### 9.2 PRD 표준 목차

PRD는 아래 7개 섹션 순서로 쓴다. 섹션을 임의로 빼거나 다른 이름으로 바꾸지 않는다. 순서가 작업 순서다: 여정(User Flow)을 그리고, 화면 뼈대(Screen Structure)를 세우고, 그 위의 정책(Requirements)을 쓴다.

| # | 섹션 | 답하는 질문 |
|---|---|---|
| 1 | **Background** | 왜 하는지 |
| 2 | **Goal** | 무엇을 해결하려는지 |
| 3 | **Scope** | 어디까지 하는지, 안 하는지 |
| 4 | **User Flow** | 사용자가 어떻게 진입하고 행동하는지 |
| 5 | **Screen Structure** | 화면이 어떤 Depth 계층으로 놓이는지 (정보구조, 화면 ID 발급) |
| 6 | **Requirements** | 정책과 조건, 예외 케이스 |
| 7 | **Acceptance Criteria** | 어디까지 되면 완료인지 |

- **Screen Structure는 정보구조(IA)다.** 메뉴와 화면의 Depth 계층을 표로 보여준다: 컬럼은 `Depth 1 / Depth 2 / Depth 3 / 화면 ID / 유형`이고 Depth 컬럼 수는 구조에 따라 조정한다. **기능, 분기, 진입 경로 서술은 쓰지 않는다** (Requirements와 기능명세 몫)
- 모달과 레이어는 부모 화면의 하위 Depth 행으로 놓고 `유형` 컬럼(페이지, 모달, 레이어)으로 구분한다
- **화면 ID는 이 표에서 발급한다.** 팝업과 레이어의 `-P` 번호도 마찬가지다. 별도 화면 인벤토리 문서는 여전히 전달만 한다 (§9.1): PRD 안의 이 섹션이 유일한 실물이다
- **Requirements와 기능명세의 역할 분리**: Requirements는 정책, 조건, 예외만 다룬다 (무엇이 가능해야 하는가). 화면별 기능 나열은 기능명세 전담 (어느 화면에서 어떤 기능으로). 같은 내용을 두 곳에 쓰지 않는다
- 말투는 `~한다` (PRD 기준). 정책 문서 인용 시 원문 유지
- **관련 문서 블록은 문서 제목 바로 아래에 둔다. 4종 고정**: 정책 문서(`docs/policy/`), 정책 게시본(Slack Canvas 링크), Figma(file-key, page, section), 티켓(Jira 키)
- 케이스 매트릭스, 조건 표가 필요한 섹션은 §9.4 표 규격으로 본문 안에 넣는다
- User Flow는 분기 3개 이상이면 플로우차트를 함께 첨부한다 (§6.5)

### 9.3 PRD 문서형 프레임 규격 ★

PRD는 표가 아니라 **읽는 문서**다. 문서 형식으로 읽기 편하게 만든다.

```
프레임명   {페이지명} PRD          (여러 장이면 {페이지명} PRD 1, 2, ...)
크기      1920 FIXED × HUG (minHeight 1020) / VERTICAL / pad 64
          1920은 패딩 포함 외곽 폭이다 (콘텐츠 폭 1792)
배경      surface.doc #0A0A0A / radius 12 / itemSpacing 0 (간격은 전부 Spacer)
본문 폭   콘텐츠 폭 전체 (1792). 텍스트 블록은 FILL
표        콘텐츠 폭 1792까지 쓰고, 넘치면 별도 표 프레임으로 분리
```

텍스트 스타일 (색 토큰은 `spec-visual.md`):

| 요소 | 폰트 | 색 |
|---|---|---|
| 문서 제목 | Medium 32 | `text.doc-head` |
| 섹션 헤딩 (Background 등) | Medium 20 | `text.doc-head` |
| 본문, 불릿 (native 불릿) | Regular 14 | `text.doc-body` |
| 캡션, 참조 | Regular 14 | `text.doc-label` |

간격은 Spacer 프레임으로만 만든다: 문서 제목 아래 24, 섹션 헤딩 위 48 아래 14, 문단 사이 12.

**프레임 분할.** 내용이 많아 높이가 대략 2000을 넘으면 **섹션 경계에서** 프레임을 나눠 가로로 나열한다. 섹션 중간에서 자르지 않는다. 프레임 간 gap 140, 프레임명 뒤에 순번을 붙인다.

### 9.4 표 규격: Case Matrix 정본

문서 안의 표와 기능명세는 `Checkout Case Matrix`(7876:1479) 스타일이 정본이다.

- 구조: 케이스 그룹 행(해당 시) + Header + Row × N. 행 하단 border만 `border.doc-row` 1px
- 행 패딩 상하 10, 셀 오른쪽 패딩 8, 셀은 VERTICAL 컨테이너
- Header는 Medium 14 `text.doc-head`. Row는 Regular 14: 식별자, 라벨, 참조 열은 `text.doc-label`, 본문 열은 `text.doc-body` (가리키는 이름은 회색, 실제 내용은 밝은 회색)
- 케이스 매트릭스는 **케이스가 열, 컴포넌트가 행.** 케이스가 그룹(Individual, Organization)으로 묶이면 Header 위에 그룹 행을 얹는다
- 셀 값: 노출은 `O (노출 방법)`, 미노출은 `X`, 무신호 행은 각주로
- **표 문서의 폭은 컬럼 수에 따라 확장을 허용한다.** 컬럼이 넘치면 프레임 폭 자체를 키운다 (정본 실측 2706). 문서형(§9.3)의 1920 고정과 구분되는 예외다
- 표 제목은 Medium 20, 한 프레임에 표가 2개 이상일 때만 붙인다
- 배치: 열 pitch는 프레임 폭 + 140, 행 pitch는 그 행의 최대 높이 + 140. 같은 문서 종류를 한 행에 모은다

### 9.5 기능명세

화면 구조 위에 기능을 나열한 명세표. 화면설계서(Description)와 개발 범위 산정의 공통 근거다. 프레임은 §9.4 표 규격을 따르고, 프레임명은 `{페이지명} 기능명세`.

**작성 순서와 정렬 (화면 우선 설계)**

1. PRD Screen Structure(§9.2)에서 화면 ID를 확정한다
2. 화면 ID 순으로 기능 행을 나열한다. 같은 화면 안에서는 화면 노출 순서(위에서 아래)
3. 케이스와 사용자를 채운다

**컬럼 8개 (고정)**

| 컬럼 | 내용 |
|---|---|
| No | 행 번호. 문서 전체 연속 |
| 화면 ID | 기능이 속한 화면. PRD Screen Structure에서 발급된 ID |
| 화면명 | 화면 이름. 전체 명칭 (§5.4) |
| 케이스 | 이 기능이 적용되는 조건 케이스. 전 케이스 공통이면 `공통` |
| 기능 ID | 아래 ID 체계 참조. Description Numbered Note와 대응 |
| 기능명 | 명사형. 예: 검색 기능, 목록 노출 기능, 파일 첨부 기능 |
| 기능상세 | 기능이 하는 일. 불릿, 1불릿 1사실. 상태값 나열은 괄호 안에 `/` 구분. 예: `처리 상태 포함 (접수/처리중/완료)` |
| 사용자 | 이 기능을 사용할 수 있는 주체. 예: 전체, Member, Organization Owner, 관리자. 승인 용어만 사용 (로그인 주체는 "로그인"이 아니라 Member로 쓴다, 2026-09-09 확정) |

**ID 체계 (2026-09-01 확정, 화면 ID + 기능 ID 2계층)**

| 계층 | 형식 | 예 |
|---|---|---|
| 화면 ID | `{페이지 코드}-{모듈 번호}-{일련번호}` | `CO-100-000` |
| 팝업, 레이어 | 부모 화면 ID + `-P{번호}` | `CO-100-000-P01` |
| 기능 ID | `FC-{페이지 코드}-{일련번호}` | `FC-CO-001` |

- **기능 ID는 페이지 단위 일련번호다.** 화면 소속은 같은 행의 화면 ID 열이 말해주므로 ID에 화면 정보를 넣지 않는다. 기능이 다른 화면으로 이동해도 ID는 바뀌지 않는다
- 모듈 번호 대역: 100번대 사용자 화면, 900번대 관리자 화면
- **페이지 코드는 아래 등록표에 있는 것만 쓴다.** 등록된 코드는 식별자 예외(§5.4)이고, 등록 없는 머리글자 코드는 약어 금지 위반이다. 새 페이지는 이 표에 행을 추가한 뒤 쓴다

| 코드 | 페이지 |
|---|---|
| CO | Checkout |
| MP | My Page |
| PL | Plan |
| AC | Account |
| SO | Solutions |

**Description 연계**

- 화면 ID는 와이어프레임 프레임과, **기능 ID는 Description Numbered Note와 대응**한다
- Description 작성 완료 시 해당 화면의 기능 ID가 Note로 전부 커버되는지 대조한다. 누락이면 Note를 추가하거나, 명세표 기능상세에 제외 사유를 남긴다
- 기능상세와 Description 본문이 어긋나면 기능명세를 먼저 고치고 Description을 따라 맞춘다 (명세가 상위 근거)

### 9.6 문서 내용 규칙

- 한 셀 1사실, `~인 경우` 문형, `~한다` 또는 명사형 (합니다체 금지)
- 없는 것은 `없음`, `미표시`. 없어진 기능의 부재를 설명하지 않는다
- 미확정은 멈추지 않고 표기 후 계속: `*(정책 필요: 무엇이 없는지)*`, `*(결정 필요: 무엇 중 골라야 하는지)*`, `*(개발 확인 필요: 무엇이 가능한지)*`. 무엇을 정해야 하는지가 셀 안에 있어야 한다
- UI 문구 인용은 영문 원문 + `/copy-review` 검수

### 9.7 템플릿 (복붙용)

어느 페이지든 이 골격으로 시작한다. 중괄호가 치환 자리다. 페이지 코드는 §9.5 등록표에서 가져오고, 채우면서 §9.6 내용 규칙을 따른다.

**PRD 원고**

```
{페이지명} PRD

관련 문서
- 정책 문서: docs/policy/{파일명}.md
- 정책 게시본: Slack Canvas {링크}
- Figma: {file-key}, {페이지}
- 티켓: {Jira 키}

Background
{현재 구조가 담지 못하는 문제 한 문장}

Goal
{이 개편으로 해결하려는 것 한 문장}

Scope
- 다룬다: {항목 1}, {항목 2}
- 다루지 않는다: {항목 3}

User Flow
- {진입 경로}
- {핵심 행동과 분기}
- {완료 상태}
(분기 3개 이상: 플로우차트 첨부)

Screen Structure
| Depth 1 | Depth 2 | Depth 3 | 화면 ID | 유형 |
| {메뉴} | {화면명} | | {코드}-100-000 | 페이지 |
| | | {모달명} | {코드}-100-000-P01 | 모달 |

Requirements
- {정책 문장}
- {조건}인 경우: {처리}
- {예외 케이스}: {처리}

Acceptance Criteria
- {완료 판정 조건}
- 기능명세의 기능 ID 전부가 화면설계서 Numbered Note로 커버된다
```

**기능명세 행**

```
| No | 화면 ID | 화면명 | 케이스 | 기능 ID | 기능명 | 기능상세 | 사용자 |
| 1 | {코드}-100-000 | {화면명} | 공통 | FC-{코드}-001 | {기능명} 기능 | {하는 일} | Member |
```

**Version Table 행**

```
| 버전 | 날짜 | 작성자 | 변경 내용 | 대상 프레임 |
| 1.0.00 | {YYYY-MM-DD} | {작성자} | 최초 작성: {범위 한 문장} | {프레임명} |
```

### 9.8 User Flow 차트 (Figma)

PRD User Flow 섹션의 시각화. 분기 3개 이상이면 필수 첨부(§6.5)이고, `/flowchart` 스킬의 시각 언어를 Figma로 승계한다.

```
프레임명   {페이지명} User Flow
크기      1920 FIXED × HUG. 흐름이 길면 폭 확장 허용 (§9.4와 같은 예외)
배경      surface.doc #0A0A0A / radius 12 / pad 64 / 제목 Medium 32
배치      PRD 프레임 오른쪽에 gap 140으로 나란히
```

**플로우 목록 도출 기준 (2026-09-09 확정)**

어떤 플로우가 필요한지를 아래 기준으로 먼저 도출한다. 형식(아래 시각 언어)은 그 다음이다.

| 기준 | 내용 |
|---|---|
| 단위 | 사용자 목표 1개 = 플로우 1개. 화면이 아니라 사용자가 끝내려는 일(구매 완료, 계정 지정, 실패 복구) 단위로 자른다 |
| 도출 소스 | PRD User Flow 불릿(진입, 분기, 완료), Screen Structure의 화면 전이, 기능명세의 케이스 열. 세 곳을 훑어 후보 목록을 만든다 |
| 차트 조건 | 화면 2개 이상을 지나거나 판단이 3개 이상인 후보만 차트로 만든다. 단일 화면 안의 인터랙션은 Description 몫이다. 시간 축 여정(Trial 경과 등)은 차트가 아니라 표로 쓴다 |
| 분할 | 한 차트의 노드가 15개를 넘으면 목표 단위로 나눈다. 공통 골격(진입 판정)은 차트 1개로 두고, 각 여정 차트는 그 끝에서 시작점을 이어받는다 |

**시각 언어 (변형 금지)**

| 요소 | 형태 |
|---|---|
| 액션 | 사각형 |
| 판단 | 다이아몬드. 분기 라벨은 커넥터 위 |
| 시작, 종료 | 필(pill) |
| 짧은 결과 | 원 |
| actor 태그 | USER, SYSTEM, SCREEN, EXTERNAL, WAIT 중 하나를 도형 안에 표기 |
| 커넥터 | 90도 직선만, 곡선 금지. 화살촉은 오른쪽 또는 아래만 |
| Note | 차트 하단 번호 밴드: 판단이 보는 값, 화면 변화 |

- 화면을 지나는 노드는 Screen Structure의 화면 ID를 라벨에 병기한다. 예: `결제 정보 입력 (CO-100-000)`
- 도형 크기와 그리드는 전 차트에서 고정. 여러 플로우는 하나의 거대한 캔버스가 아니라 플로우 단위로 나눈다

**제작 도구: User Flow 에디터 (2026-09-01 확정)**

- 차트의 작성과 수정은 **User Flow 에디터 아티팩트**에서 한다: https://claude.ai/code/artifact/7b03170c-f6e7-486c-9ebc-c0853b802dcd
- 흐름: Figma 에이전트가 초안 데이터를 심어 게시 → Josh가 에디터에서 수정(캔버스 드래그, 패널 편집, 선 조건 라벨, 복사와 붙여넣기, 실행 취소) → 저장하면 새 버전으로 게시되어 에이전트가 회수
- **Figma에는 에디터의 2x PNG 복사로 삽입한다.** 프레임 규격(위 표)은 그대로 쓰되 내용은 이미지다. 수정은 에디터에서 하고 이미지를 교체한다
- Figma 벡터 렌더러(buildUserFlow)는 보류: Figma 안 직접 수정이나 화면 ID 하이퍼링크가 필요해지는 시점에 구축한다

---

## 10. Version 관리표 (Version Table)

기획 문서 3종(§9)의 세 번째 문서. 화면설계서의 개정 이력을 남기는 표이며, **Figma 작업 페이지마다 1개**를 페이지 좌상단(첫 섹션 왼쪽 위)에 둔다.

### 10.1 프레임 규격

표 규격(§9.4)을 준용하되 minHeight 없이 HUG로 둔다.

```
프레임명   {페이지명} Version Table
크기      1920 FIXED × HUG · VERTICAL · pad 64 · fill #0A0A0A · radius 12
제목      "Version Table"  Medium 32
컬럼      버전(90) / 날짜(180) / 작성자(180) / 변경 내용(FILL) / 대상 프레임(340)
```

컬럼 폭 단위는 px, 열 색 규칙은 §9.4와 동일.

### 10.2 버전 체계 (x.x.xx)

버전은 `{Major}.{Minor}.{Patch}` 3자리로 쓴다. Patch는 2자리 제로 패딩. 예: `2.1.03`. 상위 자리가 오르면 하위 자리는 0으로 리셋한다.

| 자리 | 올리는 변화 | 기록 후 행동 |
|---|---|---|
| **Major** (첫째) | 구조 변경: 화면과 프레임 추가 또는 삭제, 플로우 변경, 문서 체계 개편 | 이해관계자 리뷰 요청 |
| **Minor** (둘째) | 내용 변경: 정책 반영으로 기능, Description, 표 내용 수정, 케이스 추가 | 채널 공유 |
| **Patch** (셋째, 2자리) | 표기 보정: 오타, 문구 다듬기, 정렬과 간격 보정. 정책 의미 변화 없음 | 기록만, 공유 생략 |

**세 등급 전부 Version Table에 기록한다.** 판별 기준은 하나다: 읽는 사람의 판단이 달라지는가. 달라지면 Minor 이상, 화면 구성 자체가 달라지면 Major다.

- 한 작업 세션에서 여러 변경이 나오면 가장 높은 등급 기준으로 묶어 1행
- `변경 내용`은 결과 중심 한 문장. `대상 프레임`은 프레임명 (node-id는 선택)
- 작성자는 세션을 지시한 사람 기준 (기본 Josh)

### 10.3 문서 파일의 버전 관리

spec.md를 포함한 규격 문서는 문서 상단에 같은 4컬럼 Markdown 표(버전, 날짜, 작성자, 변경 내용)를 두고, §10.2와 같은 3자리 체계를 쓴다. 이 문서 최상단 표가 그 예시다.

---

## 11. 코드 패턴

### 11.1 노드 생성 판단 Q1~Q4

```
Q1. 같은 역할의 노드가 이 파일에 이미 있는가?      YES → clone() 후 텍스트만 수정
Q2. 디자인 시스템 라이브러리 컴포넌트인가?          YES → importComponentByKeyAsync
Q3. 기존 노드의 스타일을 따라야 하는가?             YES → getStyledTextSegments로 복사
Q4. 완전히 새로 만드는 최초 노드인가?               YES → §2~§4 규격으로 생성
```

FRAME 타입이어도 재사용 가능하다. 타입만 보고 "컴포넌트 없음" 판단 금지. 비어 보여도 `findAllWithCriteria`로 페이지 전체 재검색 후 판단한다.

### 11.2 필수 패턴 6개

**ap() 패턴** (FILL은 append 후에만):

```javascript
function ap(parent, child, fill) {
  parent.appendChild(child);
  if (fill) child.layoutSizingHorizontal = 'FILL';
  return child;
}
```

**resize 후 sizing 재설정**: `resize()`는 `primaryAxisSizingMode`를 FIXED로 되돌린다. 호출 직후 `'AUTO'` 재설정.

**텍스트 생성 순서**: `resize(너비, 10)` → `textAutoResize = 'HEIGHT'` → `characters` 할당. 역순이면 높이 폭발.

**boundVariables 확인**: 변수 바인딩된 fills는 덮어쓰지 않는다.

**페이지는 이름으로 실시간 조회**: `figma.root.children.find(p => p.name === '...')` 후 `await figma.setCurrentPageAsync(page)`. ID 하드코딩 금지. `getNodeByIdAsync`는 페이지 로드 후에만 신뢰.

**clipsContent 의도 설정**: 새 프레임은 `clipsContent = false` 기본. 셀 경계 밖 배지가 있으면 필수. Screen과 Description 패널만 true.

### 11.3 와이어프레임 생성 골격 (신규 규격 반영)

`createWireframeFrame()`만 사용한다. `createInstance()` clone, 수동 절대좌표 그리기 금지. 아래 골격은 §2 규격(Screen Auto Layout)을 반영한 정본이다.

```javascript
async function createWireframeFrame(sectionName, frameName, mainLabel, subLabel, contentWidth) {
  await figma.loadFontAsync({ family: 'Poppins', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Poppins', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Poppins', style: 'SemiBold' });
  const gray = v => ({ r: v, g: v, b: v });

  // Outer: 최상위 FIXED (§2.2)
  const outer = figma.createFrame();
  outer.name = frameName;
  outer.layoutMode = 'VERTICAL';
  outer.resize(2448, 1216);
  outer.primaryAxisSizingMode = 'AUTO';       // resize가 FIXED로 되돌리므로 재설정
  outer.counterAxisSizingMode = 'FIXED';
  outer.minHeight = 1216;
  outer.paddingTop = outer.paddingBottom = outer.paddingLeft = outer.paddingRight = 24;
  outer.itemSpacing = 24;
  outer.cornerRadius = 12;
  outer.clipsContent = false;
  outer.fills = [{ type: 'SOLID', color: gray(1) }];   // 흰 배경 (2026-09-01: 구 gray 0.96 폐기, 내부 패널은 border로 구분)

  // Header 행
  const header = figma.createFrame();
  header.name = 'Header';
  header.layoutMode = 'HORIZONTAL';
  header.itemSpacing = 12;
  header.counterAxisSizingMode = 'AUTO';
  header.fills = [];
  ap(outer, header, true);

  const bh = figma.createFrame();
  bh.name = 'Board Header';
  bh.layoutMode = 'HORIZONTAL';
  bh.resize(1920, 64);
  bh.primaryAxisSizingMode = 'FIXED';
  bh.counterAxisSizingMode = 'FIXED';
  bh.counterAxisAlignItems = 'CENTER';
  bh.paddingLeft = bh.paddingRight = 14;
  bh.itemSpacing = 8;
  bh.cornerRadius = 8;
  bh.fills = [{ type: 'SOLID', color: gray(1) }];
  bh.strokes = [{ type: 'SOLID', color: gray(0.9019607901573181) }];
  bh.strokeWeight = 2;
  header.appendChild(bh);
  const mk = (s, style, v) => {
    const t = figma.createText();
    t.fontName = { family: 'Poppins', style };
    t.fontSize = 18;
    t.fills = [{ type: 'SOLID', color: gray(v) }];
    t.characters = s;
    bh.appendChild(t);
    return t;
  };
  mk(mainLabel, 'Medium', 0.27);
  mk('  |  ', 'Regular', 0.27);
  mk(subLabel, 'Regular', 0.52);

  const dh = figma.createFrame();
  dh.name = 'Description Header';
  dh.layoutMode = 'HORIZONTAL';
  dh.resize(100, 64);
  dh.counterAxisSizingMode = 'FIXED';
  dh.primaryAxisAlignItems = 'CENTER';
  dh.counterAxisAlignItems = 'CENTER';
  dh.cornerRadius = 8;
  dh.fills = [{ type: 'SOLID', color: gray(1) }];
  dh.strokes = [{ type: 'SOLID', color: gray(0.9019607901573181) }];
  dh.strokeWeight = 2;
  ap(header, dh, true);
  const dht = figma.createText();
  dht.fontName = { family: 'Poppins', style: 'Medium' };
  dht.fontSize = 18;
  dht.characters = 'DESCRIPTION';
  dh.appendChild(dht);

  // Contents 행
  const contents = figma.createFrame();
  contents.name = 'Contents';
  contents.layoutMode = 'HORIZONTAL';
  contents.resize(2400, 1080);
  contents.counterAxisSizingMode = 'FIXED';
  contents.itemSpacing = 12;
  contents.fills = [];
  ap(outer, contents, true);

  // Screen: VERTICAL Auto Layout ★ 변경 1
  const screen = figma.createFrame();
  screen.name = 'Screen';
  screen.layoutMode = 'VERTICAL';
  screen.resize(1920, 1080);
  screen.primaryAxisSizingMode = 'FIXED';
  screen.counterAxisSizingMode = 'FIXED';
  screen.itemSpacing = 0;
  screen.clipsContent = true;
  screen.cornerRadius = 8;
  screen.fills = [{ type: 'SOLID', color: gray(1) }];
  screen.strokes = [{ type: 'SOLID', color: gray(0.9019607901573181) }];
  screen.strokeWeight = 2;
  contents.appendChild(screen);
  screen.layoutSizingVertical = 'FILL';

  // Body (GNB instance는 호출부에서 screen 첫 자식으로 삽입)
  const body = figma.createFrame();
  body.name = 'Body';
  body.layoutMode = 'HORIZONTAL';
  body.primaryAxisAlignItems = 'CENTER';   // ContentArea 중앙 정렬. 좌우 padding 하드코딩 금지
  body.fills = [];
  screen.appendChild(body);
  body.layoutSizingHorizontal = 'FILL';
  body.layoutSizingVertical = 'FILL';

  const contentArea = figma.createFrame();
  contentArea.name = 'ContentArea';
  contentArea.layoutMode = 'VERTICAL';
  contentArea.resize(contentWidth || 1040, 984);
  contentArea.counterAxisSizingMode = 'FIXED';
  contentArea.paddingTop = contentArea.paddingBottom = 40;
  contentArea.paddingLeft = contentArea.paddingRight = 40;
  contentArea.itemSpacing = 24;
  contentArea.fills = [];
  body.appendChild(contentArea);
  contentArea.layoutSizingVertical = 'FILL';

  // Description 패널
  const desc = figma.createFrame();
  desc.name = 'Description';
  desc.layoutMode = 'VERTICAL';
  desc.paddingTop = desc.paddingBottom = desc.paddingLeft = desc.paddingRight = 12;
  desc.clipsContent = true;
  desc.cornerRadius = 8;
  desc.fills = [{ type: 'SOLID', color: gray(1) }];
  desc.strokes = [{ type: 'SOLID', color: gray(0.9019607901573181) }];
  desc.strokeWeight = 2;
  contents.appendChild(desc);
  desc.layoutSizingHorizontal = 'FILL';
  desc.layoutSizingVertical = 'FILL';

  const descList = figma.createFrame();
  descList.name = 'Description List';
  descList.layoutMode = 'VERTICAL';
  descList.paddingTop = descList.paddingBottom = descList.paddingLeft = descList.paddingRight = 10;
  descList.itemSpacing = 10;
  descList.fills = [];
  ap(desc, descList, true);

  // Section 래핑 (섹션이 이미 있으면 호출부에서 appendChild)
  return { outerId: outer.id, screenId: screen.id, contentAreaId: contentArea.id, descListId: descList.id };
}
```

### 11.4 자주 깨지는 지점

| 증상 | 원인 | 조치 |
|---|---|---|
| 카드 높이가 내용과 다름 | resize()가 sizing mode를 FIXED로 되돌림 | resize 직후 AUTO 재설정 |
| FILL 설정 에러 | appendChild 전에 설정 | append 후로 이동 |
| 텍스트가 세로 한 글자씩 | 폭 없이 characters 먼저 | resize → textAutoResize → characters |
| 폰트 에러로 중단 | SemiBold 미로드, 기존 Inter 노드 | 3종 사전 로드 + Inter Regular 추가 |
| 프레임 높이 소수점 | 소수 gap, 소수 크기가 HUG로 전파 | §3.1 정수 스케일로 교정 |
| 다른 페이지 노드 null | setCurrentPageAsync 없이 접근 | 페이지 전환 먼저 |
| Outer가 1216보다 커짐 | Contents 아래 형제 추가 | 각주는 Description 패널 안으로 |
| 오버레이가 레이아웃을 밀어냄 | Auto Layout 자식으로 추가 | layoutPositioning ABSOLUTE (§2.3) |
| Description 하단 잘림 | 패널 clipsContent + 높이 부족 | 양쪽 콘텐츠 중 큰 쪽 기준으로 Contents 확장 |

### 11.5 문서 빌더 (PRD, 기능명세, Version Table)

기획 문서 3종(§9, §10)을 그리는 헬퍼. 색 값은 `spec-visual.md`의 doc 계열 토큰과 같다.

```javascript
const hex = h => ({
  r: parseInt(h.slice(1,3),16)/255,
  g: parseInt(h.slice(3,5),16)/255,
  b: parseInt(h.slice(5,7),16)/255
});
const C = { bg:'#0A0A0A', line:'#292929', head:'#FFFFFF', label:'#C7C7C7', body:'#EBEBEB' };
const PAD = 64, MIN_H = 1020;

async function loadDocFonts() {
  await figma.loadFontAsync({ family:'Poppins', style:'Regular' });
  await figma.loadFontAsync({ family:'Poppins', style:'Medium' });
}

// width 지정: 고정 폭 텍스트. 생략: FILL
// 순서 주의 (2026-09-09 정정): characters를 먼저 넣고 사이징을 마지막에 건다.
// 사이징을 먼저 걸면 빈 텍스트 기준 폭 0으로 붕괴해 글자가 세로로 한 자씩 쌓인다.
function docText(parent, s, size, style, color, width) {
  const t = figma.createText();
  t.fontName = { family:'Poppins', style };
  t.fontSize = size;
  t.characters = s;
  t.fills = [{ type:'SOLID', color: hex(color) }];
  parent.appendChild(t);
  t.textAutoResize = 'HEIGHT';
  if (width) t.resize(width, t.height);
  else t.layoutSizingHorizontal = 'FILL';
  t.name = s.slice(0, 40);
  return t;
}

function spacer(parent, h) {
  const f = figma.createFrame();
  f.name = 'Spacer';
  f.resize(10, h);
  f.fills = [];
  parent.appendChild(f);
  return f;
}

// 문서 프레임 공통 골격. w 기본 1920, 표 문서는 컬럼 수에 따라 확장 (§9.4)
function docFrame(name, w, x, y) {
  const card = figma.createFrame();
  card.name = name;
  card.layoutMode = 'VERTICAL';
  card.itemSpacing = 0;
  card.paddingTop = card.paddingBottom = card.paddingLeft = card.paddingRight = PAD;
  card.counterAxisSizingMode = 'FIXED';
  card.resize(w || 1920, MIN_H);
  card.primaryAxisSizingMode = 'AUTO';   // resize가 FIXED로 되돌리므로 재설정
  card.minHeight = MIN_H;
  card.fills = [{ type:'SOLID', color: hex(C.bg) }];
  card.cornerRadius = 12;
  card.clipsContent = true;
  card.x = x; card.y = y;
  figma.currentPage.appendChild(card);
  docText(card, name, 32, 'Medium', C.head);
  spacer(card, 24);
  return card;
}

// PRD 문서형 (§9.3): 본문은 FILL (콘텐츠 폭 전체)
function prdHeading(card, s) { spacer(card, 48); docText(card, s, 20, 'Medium', C.head); spacer(card, 14); }
function prdPara(card, s)    { docText(card, s, 14, 'Regular', C.body); spacer(card, 12); }
function prdBullets(card, lines) {
  const t = docText(card, lines.join('\n'), 14, 'Regular', C.body);
  let pos = 0;
  for (const line of lines) {
    const end = pos + line.length;
    if (line.length > 0) t.setRangeListOptions(pos, end, { type:'UNORDERED' });
    pos = end + 1;
  }
  spacer(card, 12);
  return t;
}

// 표 (§9.4). cols: [{key, label, w, tone}] (w 생략 = FILL, tone 'label' | 'body')
// groups: [{label, span}] 케이스 그룹 행. groups 사용 시 모든 컬럼에 고정 폭 필요
function addTable(card, cols, rows, groups) {
  const mkRow = kind => {
    const row = figma.createFrame();
    row.name = kind;
    row.layoutMode = 'HORIZONTAL';
    row.itemSpacing = 0;
    row.counterAxisAlignItems = 'MIN';
    row.counterAxisSizingMode = 'AUTO';
    row.paddingTop = row.paddingBottom = 10;
    row.clipsContent = true;
    row.fills = [];
    row.strokes = [{ type:'SOLID', color: hex(C.line) }];
    row.strokeAlign = 'INSIDE';
    row.strokeTopWeight = row.strokeLeftWeight = row.strokeRightWeight = 0;
    row.strokeBottomWeight = 1;
    card.appendChild(row);
    row.layoutSizingHorizontal = 'FILL';
    return row;
  };
  const mkCell = (row, w) => {
    const cell = figma.createFrame();
    cell.name = 'Cell';
    cell.layoutMode = 'VERTICAL';
    cell.primaryAxisSizingMode = 'AUTO';
    cell.paddingRight = 8;
    cell.clipsContent = true;
    cell.fills = [];
    if (w) { cell.counterAxisSizingMode = 'FIXED'; cell.resize(w, 1); cell.primaryAxisSizingMode = 'AUTO'; }
    row.appendChild(cell);
    if (!w) cell.layoutSizingHorizontal = 'FILL';
    return cell;
  };
  if (groups) {
    const g = mkRow('Group');
    let ci = 0;
    for (const grp of groups) {
      let w = 0;
      for (let k = 0; k < grp.span; k++) w += cols[ci + k].w;
      ci += grp.span;
      const cell = mkCell(g, w);
      if (grp.label) docText(cell, grp.label, 12, 'Medium', C.head);
    }
  }
  const header = mkRow('Header');
  cols.forEach(c => docText(mkCell(header, c.w), c.label, 14, 'Medium', C.head));
  rows.forEach(r => {
    const row = mkRow('Row');
    cols.forEach(c => {
      const tone = c.tone || (c.w ? 'label' : 'body');
      docText(mkCell(row, c.w), String(r[c.key] ?? ''), 14, 'Regular', C[tone]);
    });
  });
}
```

호출 예 (기능명세):

```javascript
await loadDocFonts();
const page = figma.root.children.find(p => p.name === '대상 페이지명');
await figma.setCurrentPageAsync(page);

const spec = docFrame('Checkout 기능명세', 1920, 100, 100);
addTable(spec, [
  { key:'no',     label:'No',       w:60  },
  { key:'sid',    label:'화면 ID',  w:190 },
  { key:'sname',  label:'화면명',   w:200 },
  { key:'kase',   label:'케이스',   w:220 },
  { key:'fid',    label:'기능 ID',  w:150 },
  { key:'fname',  label:'기능명',   w:200 },
  { key:'detail', label:'기능상세', tone:'body' },
  { key:'user',   label:'사용자',   w:170 }
], rows);
return { id: spec.id, screenshot: await spec.screenshot() };   // 검증 없이 완료 선언 금지
```

---

## 12. 금지 패턴과 QA

### 12.1 절대 금지 패턴

**그리기**

1. 참조 없이 색상, 폰트, 수치 하드코딩 (실측만)
2. Screen을 layoutMode NONE으로 생성 (§2.3 위반)
3. 소수 간격, 소수 크기 입력
4. Screenshot 없이 완료 선언
5. 수정 범위 이탈 (지시된 노드만. TITLE 지적에 와이어프레임 수정 금지)
6. 유저가 직접 바꾼 구조를 규격 위반으로 지적하거나 되돌리기 (규격은 새로 만들 때 지킨다)

**Description**

7. Header Note에 불릿 추가
8. 컴포넌트를 L2 불릿으로 나열 (`요소명: 설명` 패턴)
9. 성공 후 분기를 `클릭 시:` 하위에 직접 나열 (케이스 분기 블록으로 분리)
10. 에러, 유효성 동작을 자유 문장으로 서술 (`상태:` `Error:` 블록으로)
11. 미완성 문장, 메모 혼입 (플래그 형식 `*(정책 확인 필요: ...)*`으로)
12. L3 아래 L4 중첩

**공통**

13. 규칙에 없는 상황에서 자의적 이탈 (유저와 먼저 논의)
14. 약어 코드 생성 (§5.4)
15. 이음표(`—`, `·`)를 산문에 사용 (콜론 구조, 쉼표. 라벨 형식의 em dash는 예외)

### 12.2 Pre-flight 체크리스트

**문구 (가장 먼저)**

- [ ] UI 문구를 `/copy-review`로 검수했는가 (버튼 `하기` 없음, 해요체, 명령조 없음, 영문)

**구조**

- [ ] 최상위 프레임이 FIXED 폭인가 (§2.2)
- [ ] Screen이 VERTICAL Auto Layout인가, Page 래퍼가 없는가 (§2.3)
- [ ] 하위 프레임이 FILL인가 (명시된 예외 제외)
- [ ] 간격이 전부 §3.2 표 또는 §3.1 스케일 값인가 (정수)
- [ ] 오버레이가 ABSOLUTE 포지셔닝인가

**Description**

- [ ] Header Note가 화면명 한 줄뿐인가
- [ ] 독립 UI 요소가 전부 Numbered Note인가 (Q1~Q3)
- [ ] 상태가 라이프사이클 순서인가, Loading(Skeleton), Empty, Error가 있는가
- [ ] 조건 분기가 `~한 경우:` 형식인가
- [ ] 링크, 중요, 플래그가 §7.1 표기로 원고에 들어 있는가
- [ ] 분기 3개 이상 화면에 플로우차트를 첨부했는가 (§6.5)
- [ ] 기능명세가 있는 화면이면 기능 ID가 Numbered Note로 전부 커버되는가 (§9.5)

**마무리**

- [ ] clone 후 clearAnnotations, 이름 부여를 했는가
- [ ] Version 관리표에 이번 변경을 기록했는가 (§10.2 트리거 해당 시)
- [ ] 프레임마다 screenshot 검증을 했는가

### 12.3 Screenshot 검증

코드가 에러 없이 실행돼도 시각적으로 틀릴 수 있다. 완료 선언 전 반드시 `await node.screenshot()` 결과를 확인한다: 높이 이상, 텍스트 잘림, gap 이상, 불릿 미적용, 스타일 색 누락.

---

## 관련 문서

- 시각 토큰, 컴포넌트 함수: 루트 `spec-visual.md`
- 기존 룰 원본: §0.2 표 참조 (2026-09-01 스텁화, 전역 figma-description.md만 내용 유지)
- 문구 기준: `.claude/rules/ux-writing.md`
- 정책 문서: `docs/policy/`
- Figma 패턴 라이브러리: `requirements/board/patterns.md`
