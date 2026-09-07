---
name: flowchart
description: "분기·체크포인트가 있는 사용자 플로우를 직선(orthogonal) 커넥터 다이어그램 Artifact로 그린다. 도형은 사각형(액션), 다이아몬드(판단), 필(시작/종료), 원(짧은 결과) 넷뿐이고, 사각형과 다이아몬드에는 누가 하는 일인지(USER, SYSTEM, SCREEN, EXTERNAL, WAIT) 태그를 반드시 붙인다. 커넥터는 항상 90도로 꺾이는 직선이며 곡선(bezier) 절대 금지, 화살촉은 오른쪽 또는 아래만 향한다. 도형 크기와 그리드는 전 패널 고정. 판단이 보는 값과 화면 변화는 차트 하단 번호 밴드에 적는다. 여러 플로우를 그릴 때는 하나의 거대한 캔버스가 아니라 섹션마다 '제목 → 설명 → 그래프' 프레임을 세로로 반복 배치한다. 라벨은 EN/KO 양쪽을 넣어 토글하고, 각 차트는 이미지로 클립보드 복사할 수 있다. '플로우차트 그려줘', '유저플로우 그려줘', '분기/판단 다이어그램 그려줘' 요청에 사용."
user_invocable: true
---

# /flowchart — 직선 커넥터, 다중 패널 플로우 다이어그램

체크아웃·로그인·어드민 등 **분기와 판단 지점이 있는 사용자 플로우**를 HTML Artifact로 그린다.
한 번 만들고 버리는 게 아니라 이 Skill 자체가 반복 재사용되는 렌더러다 — 좌표나 경로를 손으로 계산하지 않는다.

---

## 선행 로드 (필수)

작성 전에 Anthropic 내장 skill 두 개를 먼저 로드한다:

1. `artifact-design` — Artifact 전반의 팔레트·타이포·라이트/다크 토큰 규칙
2. `artifact-diagramming` — inline SVG 다이어그램 규칙 (`viewBox`, `currentColor` 테마, `<marker>` 화살표, `<figure>`+`<figcaption>`+`role="img"`)

이 Skill은 그 두 규칙 위에 **이 프로젝트가 원하는 도형·커넥터·패널 문법**을 얹은 것이다.

---

## 절대 규칙 6개

1. **커넥터는 항상 직각으로 꺾이는 직선이다.** 곡선(bezier) 금지.
2. **화살촉은 오른쪽 또는 아래만 향한다.** 왼쪽으로 되돌아가는 화살표 금지 (§화살표 방향 규칙).
3. **도형 크기와 그리드는 고정이다.** 라벨 길이에 맞춰 도형을 늘리지 않는다 (§고정 치수).
4. **패널 1개 = 제목 → 설명 → 그래프.** 세 요소가 다 있어야 한다. 여러 플로우는 이 묶음을 세로로 반복한다.
5. **색은 의미가 있을 때만.** 액션 박스·판단 다이아몬드·커넥터·actor 태그는 전부 무채색(`currentColor` / `--fk-muted`). 리터럴 색은 시작/종료 필(pill), 노트 번호 배지, zone 테두리, 그리고 긍정/부정 엣지 라벨(Yes=파랑, No=빨강 — 2026-08-26 확정)에만 예약한다. 색이 붙는 건 라벨 **텍스트**뿐이다 — 도형 채우기·테두리·커넥터 선은 이 예외에도 여전히 무채색이다.
6. **`action-rect`·`decision-diamond`에는 `actor`가 필수다.** 누가 하는 일인지 안 정하고 박스를 놓지 않는다 (§Actor).

---

## 노드 종류

노드는 두 속성을 가진다. **`shape`은 그래프에서의 구조적 역할, `actor`는 누가 하는가.**

| shape | 모양 | 언제 쓰나 | actor | 색 |
|---|---|---|---|---|
| `action-rect` | 모서리 둥근 사각형 | 한 단계에서 일어나는 일 | **필수** | 무채색 |
| `decision-diamond` | 다이아몬드 (라벨 최대 2줄) | 분기 판단 지점 | **필수** | 무채색 |
| `terminal-pill` | 완전히 둥근 필 | 플로우의 시작/종료 | **금지** | 리터럴 hue (blue) |
| `outcome-circle` | 작은 원 | 3자 이내 결과 라벨이 그 자체로 노드일 때 (줄바꿈 불가) | **금지** | 무채색 |
| `zone` (`zones` 배열) | 멤버 노드 bbox를 감싸는 점선 사각형 | 관련 노드 그룹 콜아웃 | — | 리터럴 hue (green/blue) |

`terminal-pill`과 `outcome-circle`에 actor를 금지하는 이유: 경계 표시라 **행위자가 없다.** 시작·종료는 accent 색만으로 구분된다.

Note는 노드가 아니다 — 차트 하단 밴드로 따로 나간다 (§Note 밴드).

### 고정 치수 (라벨에서 도형 크기를 유추하지 않는다)

| 도형 | 고정 폭 | 고정 높이 |
|---|---|---|
| `terminal-pill` | 110 | 38 |
| `action-rect` | 170 | 56 |
| `decision-diamond` | **190** | **104** |
| `outcome-circle` | 44 | 44 |

그리드도 전 패널 공통 고정: `colW: 260, rowH: 180, padX: 40, padY: 50`. **패널마다 다르게 튜닝하지 않는다** — 그래야 도형 사이 간격이 패널 전체·패널 간에 균일하게 보인다. 차트 카드에는 그 위에 **24px CSS 패딩**이 더 붙어 테두리와 내용이 붙지 않는다.

`colW`는 도형 폭이 아니라 **엣지 라벨 칩 폭**에서 나온 값이다 (2026-08-27, 215 → 260). 라벨 칩은 두 도형 사이 수평 구간 한가운데 앉으므로, 그 구간이 칩보다 넉넉히 길어야 양옆에 선이 보인다. 가장 빡빡한 조합은 **다이아몬드 → 사각형에 KO `아니오` 칩(48px)** 이다. 215에서는 구간이 35px뿐이라 칩이 양쪽 도형을 6.5px씩 파고들었다. 260이면 구간 80px, 여백 16px가 남는다.

칩 폭이 늘어나는 변경(패딩, 폰트 크기, 더 긴 라벨)을 하면 **`colW`를 다시 검산한다.** 수평 구간 길이는 `colW − (출발 도형 폭 + 도착 도형 폭) / 2`다.

라벨이 폭을 넘으면 **최대 2줄까지 줄바꿈**하고, 폭은 절대 늘리지 않는다. 다이아몬드 높이 104가 2줄을 가능하게 하는 핵심이다 — 마름모의 `dy` 지점 반폭은 `(w/2)·(1 − |dy|/(h/2))`이므로, 두 베이스라인(`cy ± 8.5`)에서 약 159px가 확보되고 `maxTextW`(138)를 넉넉히 넘는다. 높이가 72면 145px로 빠듯해 글자가 마름모 밖으로 삐져나온다.

---

## Actor — 누가 하는가

박스 하나가 "우리 서버 처리"인지 "사용자 조작"인지 "남의 시스템 응답"인지는 모양으로 구분되지 않는다. 그런데 이 차트를 읽는 사람이 알고 싶은 게 정확히 그거다 — **어디가 사용자 접점이고, 어디가 화면 변화고, 어디가 우리가 못 고치는 구간인가.**

```js
{ id: "select", shape: "action-rect", actor: "user", col: 3, row: 0, label: {...} }
```

| actor | EN | KO | 무엇 | 예 |
|---|---|---|---|---|
| `user` | `USER` | `사용자` | 사용자가 직접 하는 조작 | 계정 선택, 약관 동의, Trial 선택 |
| `system` | `SYSTEM` | `시스템` | 우리 서버가 안 보이게 하는 일 | 목록 조회, 라이선스 배정, 정책 판정 |
| `screen` | `SCREEN` | `화면` | 사용자에게 보이는 상태 변화 | 생성 안내 노출, 버튼 비활성 유지 |
| `external` | `EXTERNAL` | `외부` | 우리가 응답을 못 정하는 남의 시스템 | 결제 승인, 세액 산출 |
| `wait` | `WAIT` | `대기` | 흐름이 이 세션에서 멈추고 외부 처리를 기다림 | 인증 심사 대기 |

**SYSTEM과 EXTERNAL을 가르는 한 줄** — 실패했을 때 우리 저장소를 고쳐서 해결되면 SYSTEM, 남한테 문의해야 하면 EXTERNAL.
**SCREEN과 WAIT을 가르는 한 줄** — 사용자가 다음에 할 게 남아 있으면 SCREEN, 남의 처리가 끝나야만 흐름이 재개되면 WAIT.

WAIT 라벨은 `Show ~`로 시작하지 않는다. "화면에 뭘 띄운다"가 아니라 **"여기서 이 세션은 끝난다"**가 요지다 — `Wait For Review`, `인증 심사 대기`.

### 다이아몬드의 actor가 분기의 성격을 정한다

같은 다이아몬드라도 `system`이면 **정책 게이트**(기획이 정한 규칙), `user`면 **사용자 선택**(UX 설계 지점)이다. 이 둘은 검토하는 사람도 고치는 방법도 다르므로 반드시 갈라 쓴다.

```js
{ shape: "decision-diamond", actor: "system", label: "Has Active License" }  // 정책
{ shape: "decision-diamond", actor: "user",   label: "Wants Trial" }         // UX
```

### 태그 렌더링 — 왼쪽 정렬이 규칙이다

태그는 도형 **바로 위**에 9px, weight 600, letter-spacing 0.09em, `--fk-muted`로 앉는다. 가운데 정렬을 안 쓰는 이유는 미학이 아니라 충돌 회피다 — 위에서 내려오는 세로 화살표는 항상 `cx`(도형 중앙)로 진입한다.

| shape | 정렬 | 왜 |
|---|---|---|
| `action-rect` | 왼쪽 변에서 시작 | 가장 긴 태그 `EXTERNAL`이 9px에서 약 48px, 반폭이 85px이라 **화살표에 닿지 못한다** |
| `decision-diamond` | `cx − 10`에서 끝나도록 오른쪽 정렬 | 위쪽에 왼쪽 변이 없다 (꼭짓점 하나). 꼭짓점 바로 왼쪽에서 끝나면 붙어 보이면서 화살표와 10px 떨어진다 |

KO 태그는 전부 2~3자라 EN보다 짧다 — EN에서 안 겹치면 KO에서도 안 겹친다.

`actor`가 없거나 목록에 없는 값이면 `console.error` + 태그 자리에 `--fk-bad` 색 `??`를 찍는다. illegal edge와 같은 "조용히 넘어가지 않는다" 원칙이다.

---

## 라벨 규칙

### EN/KO 양쪽을 넣는다

**영문이 원본이다** (`ux-writing.md` 원칙). 모든 라벨·제목·설명·엣지 라벨·Note 본문은 `{ en, ko }` 객체로 쓰고, 페이지의 토글이 `FlowKit.setLang()`으로 전체를 다시 그린다. 양쪽이 같은 문자열이면(제품명 등) 그냥 문자열 하나로 둔다.

```js
label: { en: "Has Billing Address", ko: "청구지 주소 보유" }
label: "Card And PayPal"        // 제품명이라 번역 안 함
```

한 다이어그램 안에서 언어를 섞지 않는다 — 토글이 전부 바꾼다.

### 줄임말 금지

의미가 자명하지 않은 축약을 쓰지 않는다. 폭이 부족하면 2줄로 쓴다.

```
❌ Past 4Y Mark      ❌ CTA Ready       ❌ Verify Pending
✅ Within Student Term   ✅ Ready To Pay   ✅ Verification Complete
```

### 다이아몬드는 긍정형 선언문, 물음표 금지

```
❌ "Has Address?"   ❌ "Is Signed Out"   ❌ "No Organization"
✅ "Has Billing Address"   ✅ "Is Signed In"   ✅ "Has Organization"
```

- Yes/No 두 갈래 게이트는 `Has {X}` / `Is {X}` / `{X} Complete` 형태로 세운다. **긍정형이라 Yes가 "충족"에 대응한다.**
- 부정형을 긍정형으로 뒤집으면 **Yes/No 타깃도 같이 뒤집힌다.** `No Organization`(Yes→생성 안내)을 `Has Organization`으로 바꾸면 Yes→다음 게이트, No→생성 안내가 된다. 게이트를 고칠 때 엣지를 반드시 재점검한다.
- 3갈래 이상 나뉘는 분류형 분기는 짧은 명사구 하나로: `Member Type`.

### 다른 패널을 번호로 가리키지 않는다 (2026-08-27)

라벨·설명·노트에서 다른 패널을 **패널 번호로 부르지 않는다.** 읽는 사람은 번호와 내용을
짝지어 기억하지 못하므로, `9번 패널로`를 만나면 되돌아가 확인해야 한다. 목적지를 그 자체의
이름으로 부른다.

```
❌ To Panel 9 / 9번 패널로        ❌ 2번부터 4번은 단일 화면
✅ To Payment Screen / 결제 화면으로  ✅ Individual, Student 카드는 단일 화면
```

제목의 번호(`5. Enterprise Team`)는 읽는 **순서**를 나타내는 것이지 참조 수단이 아니다.

컨테이너를 부르는 단어를 바꾸는 것으로는 안 고쳐진다 — `패널`을 `차트`로 바꿔도 번호 참조가
남아 있으면 읽는 사람이 겪는 일은 똑같다. 실제로 이 순서로 두 번 지적받았다.

### Yes/No 엣지 색상 (sentiment)

`decision-diamond`에서 나가는 엣지 중 Yes/No처럼 긍정·부정이 뚜렷한 것은 라벨 텍스트에 색을
붙인다. 엣지 객체에 `sentiment`를 추가한다.

```js
{ from: "hasAddr", to: "saved", label: YES, sentiment: "positive" }
{ from: "hasAddr", to: "modal", label: NO,  sentiment: "negative" }
```

- `sentiment: "positive"` → `var(--fk-yes)` 파랑, `--fk-accent`와 같은 hue
- `sentiment: "negative"` → `var(--fk-no)` 핑크 레드, 신규 토큰
- `sentiment` 생략 → 기존과 동일하게 `currentColor` 무채색
- 색은 **엣지 라벨 칩에만** 적용된다. 커넥터 선, 도착 노드의 도형과 테두리는 계속 무채색이다
- Member Type처럼 3갈래 이상인 분류형 라벨, 또는 긍정/부정으로 나눌 수 없는 라벨에는
  `sentiment`를 붙이지 않는다

### 엣지 라벨은 칩이다

라벨은 맨 텍스트가 아니라 **칩**으로 그린다 (2026-08-27 확정). 규격은 `CHIP` 상수 하나에
모여 있고, 패널마다 바꾸지 않는다.

| 항목 | 값 |
|---|---|
| 가로 패딩 | 6px |
| 세로 패딩 | 3px |
| 높이 | `12 + 3×2 = 18px` (폰트 크기 + 세로 패딩) |
| 모서리 | `rx 4` — 필(pill) 노드와 헷갈리지 않게 |
| 배경 | 라벨 색을 `fill-opacity 0.23`으로 |

배경 사각형은 **두 장**이다. 아래는 `--fk-bg` 불투명 판, 위는 23% 틴트. 23% 한 장만 깔면
화살표 줄기가 라벨을 관통해 그대로 비친다.

### 칩은 전용 레이어에 올린다 (2026-08-27)

칩을 자기 엣지 바로 뒤에 `edgeLayer`로 붙이면 **뒤에 그려지는 엣지의 선이 앞 엣지의 칩을
덮는다.** 실제로 `Tax ID 입력 노출 → 세액 산출`의 꺾임 구간이 `EU Tax ID 대상 → 세액 산출`의
`아니오` 칩을 관통하는 사고가 있었다.

레이어 순서를 고정한다:

```
zoneLayer → edgeLayer → labelLayer → nodeLayer → noteLayer
```

칩 배경 두 장과 글자는 전부 `labelLayer`로 간다. 그러면 엣지 배열 순서와 무관하게 칩이 항상
모든 커넥터 위에 온다. **노드보다는 아래**에 둔다 — 칩이 도형을 덮으면 그건 z-order로 가릴
문제가 아니라 `colW`가 부족하다는 신호다.

`colW`를 늘려도 이 문제는 안 고쳐진다. 칩과 선이 교차하는 것 자체는 정상이고, 관건은 **누가
위로 오느냐**다.

---

## Note 밴드

판단이 **어떤 값을 보는지**와 **그 결과로 화면에서 뭐가 바뀌는지**는 도형만으로 안 보인다. Note가 그 두 가지를 담는다.

Note는 **그리드에 놓지 않는다.** 도형에는 번호 배지만 남기고 본문은 차트 하단 밴드로 내린다 — Figma Description 패널이 화면의 ①②③ 배지와 번호 노트를 짝짓는 것과 같은 관례다.

```js
notes: [
  { n: 1, linkTo: "hasActiveLicense",
    reads: { en: "licence state of the chosen account",
             ko: "선택한 계정의 라이선스 상태" },
    shows: { en: "none — start date is the payment date",
             ko: "없음 — 시작일은 결제일" } },
]
```

```
┌─ SVG ────────────────────────────────────────────┐
│   ○──▢──◆①──▢──◆②──▢          ← 그래프 영역       │
├──────────────────────────────────────────────────┤ ← 1px --fk-border
│  ① Has Active License      ② Is Indie Plan       │
│    reads  선택한 계정의        reads  선택한 플랜   │
│           라이선스 상태               종류         │
│    shows  없음 — 신규 배정     shows  Indie —      │
│                                      Seat 추가만  │
└──────────────────────────────────────────────────┘
```

- **`col`·`row`가 없다.** 밴드가 `n` 순서로 자동 배치하므로 작성자가 빈 칸을 찾아다니지 않는다.
- **제목은 `linkTo` 노드의 라벨을 자동으로 가져온다.** 노드 이름을 다시 쓰지 않으므로 둘이 어긋날 수가 없다. `linkTo`를 못 찾으면 `console.error`.
- **필드는 `reads` / `shows` 둘뿐이고, 최소 하나는 있어야 한다.** `Value:` / `Shows:` 접두어를 손으로 쓰던 방식은 포맷이 흔들려서 필드로 고정했다. 한 필드 = 한 사실.
- **리더 라인 없음.** "점선이 뭘 관통하나"를 매번 확인하던 버그 클래스가 통째로 사라진다.
- **번호 배지**는 대상 도형에서 엣지가 절대 안 쓰는 자리에 앉는다 — 다이아몬드는 **우상단 facet 중점**(좌·우 꼭짓점은 수평 엣지, 아래 꼭짓점은 분기가 씀), 사각형은 **우상단 모서리**(엣지는 변의 중점으로만 드나든다). 문자는 `1`을 쓴다 — `①`은 작은 크기에서 Poppins에 없어 CJK 폰트로 폴백된다.
- 밴드는 **그래프 바로 아래**에 붙는다. 높이 하한 800 때문에 남는 여백은 그래프 위와 밴드 아래로 **절반씩 나눈다** — 바닥에 고정하면 짧은 패널에서 구분선이 캔버스 한가운데 떠 보이고, 전부 아래로 흘리면 차트가 위로 쏠린다.
- 값과 UI 노출이 **실제로 갈리는** 판단에만 붙인다. 단순 통과 게이트는 비워둔다 (그 뉘앙스는 패널 **설명** 줄에 쓴다).

### `screen` 노드와 `shows` 필드의 경계

둘이 겹쳐 보이므로 기준을 고정한다.

| | 쓰는 곳 |
|---|---|
| **`screen` 노드** | 흐름이 눈에 띄게 다른 화면 상태로 넘어갈 때 (`Open Address Modal`, `Show Tax ID Field`) |
| **노트의 `shows`** | 같은 화면 안에서 게이트 결과로 뭐가 미묘하게 달라질 때 (`Indie — 액션은 Seat 추가로 고정`) |

같은 사실을 둘 다에 쓰지 않는다.

---

## 화살표 방향 규칙

> **엣지는 마지막 구간이 오른쪽 또는 아래를 향할 때만 적법하다.**

"오른쪽으로만"을 좌표로 직역하면(`dRow<0` 금지) "옆 분기가 본선에 다시 합류"하는 정상 엣지(`dCol=+1, dRow=−1`)까지 죽는다. 그 엣지는 열 경계에서 꺾여 대상의 **왼쪽 변으로 수평 진입**하므로 화살촉은 오른쪽을 향한다. 그래서 규칙은 좌표가 아니라 화살촉으로 쓴다.

| 관계 | 라우팅 | 화살촉 |
|---|---|---|
| `dRow=0, dCol≥1` | 직선 한 줄 (중간 칸이 비어 있을 때만 `dCol≥2` 허용) | → |
| `dCol=0, dRow≥1` | 직선 한 줄 (아래로) | ↓ |
| `dCol=1`, dRow 무관 | 두 열 사이 **경계**에서 꺾임 → 대상 왼쪽 변 진입 | → |
| **그 외 전부** | **금지** — `console.error` + 빨간 점선 stub | — |

- `dCol < 0`(왼쪽), `dCol = 0 && dRow < 0`(같은 열 위로)은 금지다.
- **분기 결과(No·차단·예외)는 바로 아래 칸으로 떨어뜨린다.** 되돌아가지 않는다. "조건 미충족이라 아무 일도 안 일어남"은 아래 칸의 결과 박스(`Keep Button Disabled` 등)로 표현한다.
- **전진 엣지는 `dCol ≤ 1`을 기본으로 한다.** 2칸 이상 건너뛰어야 하면 중간 단계를 실제 노드로 만들거나, 아래 행으로 내려 다음 열에서 합류시킨다.
- 행을 나눠 감아야 할 때만 `{ wrap: true }`를 명시한다. 이때만 행 경계 우회 경로가 열리고, 마지막 진입도 대상 왼쪽 변으로 꺾여 화살촉이 오른쪽을 향한다. `back`이 아니라 `wrap`인 이유: 정당한 케이스는 "행이 다음 블록으로 감긴다"이고, 진짜 페이지 뒤로가기는 노드를 복제해 앞으로 가는 엣지로 그린다.
- **엣지 라벨은 경로에서 가장 긴 직선 구간의 정중앙**에 배경 박스와 함께 놓인다 — 화살표 줄기와 항상 중앙 정렬된다.

---

## 패널 구성

**패널 1개 = 논리적 섹션 1개 = `<figure>` 1개.** 안에 세 요소가 순서대로 들어간다.

```
figure.flow-figure
  figcaption.flow-caption
    span.flow-title      ← config.title        (700 17px)
    p.flow-dek           ← config.description  (400 13.5px, muted)
    button.flow-copy     ← 이미지 클립보드 복사
  div.flow-scroll        ← padding 24px + 테두리
    svg.flow-svg
```

- **폭 1400 × 높이 800은 바닥값(하한)이다.** 열·행이 더 필요하면 그보다 커지는 게 정상이고, 절대 그 아래로 줄어들지 않는다.
- `<svg>`는 `viewBox`뿐 아니라 **`width`/`height`도 실제 픽셀값**으로 명시한다(퍼센트 아님). 좁은 뷰포트에서 글자까지 줄어드는 걸 막는다 — 그때는 `.flow-scroll`의 **가로 스크롤**이 대신 걸린다. 세로는 캡을 두지 않는다.
- 한 패널이 8열을 넘어갈 것 같으면 **폭을 늘리기보다 패널을 둘로 쪼갠다.** 한 패널이 두 가지 일을 하고 있다는 신호다.
- **순차 게이트 N개는 세로 복도가 아니라 가로 한 행으로 그린다.** 한 행에 나란히 놓고 각 게이트의 탈출 분기만 아래 행으로 떨어뜨린다.

### 이미지는 다운로드가 아니라 클립보드 복사

Artifact 뷰어의 샌드박스는 페이지가 스스로 시작한 다운로드를 **차단**한다 (`<a download>`도 무력). 그래서 "Save as image" 버튼은 아무 일도 안 하는 죽은 버튼이 된다. 대신 **PNG를 클립보드로 복사**한다 — Slack·Confluence에 바로 붙는다.

`copyPng()`은 SVG를 복제해 `var(--fk-*)`·`currentColor`를 현재 테마의 실제 색으로 치환한 뒤 2배 캔버스에 그려 `navigator.clipboard.write()`로 넘긴다. **주의: 복사된 이미지의 글꼴은 시스템 기본 sans로 폴백된다** (SVG-as-image는 외부 폰트를 로드하지 않는다). 글자 위치는 tspan마다 절대 좌표라 정렬은 그대로 유지된다.

---

## `FlowKit` — 복붙용 렌더러

아래 CSS + JS를 새 Artifact HTML 파일에 **그대로 복사**한다.

```html
<style>
  :root{
    --fk-ink:#1c1d22; --fk-bg:#ffffff; --fk-surface:#ffffff; --fk-border:#d8d8dc;
    --fk-accent:#2f6fed; --fk-accent-text:#ffffff; --fk-muted:#6b6b74;
    --fk-zone-a:#2f9e64; --fk-zone-b:#3f83c9; --fk-bad:#c9453a;
    --fk-yes:#2f6fed; --fk-no:#c2477a;
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]){
      --fk-ink:#e8e8ec; --fk-bg:#101114; --fk-surface:#101114; --fk-border:#33343a;
      --fk-accent:#5b8def; --fk-accent-text:#0a0a0c; --fk-muted:#93939c;
      --fk-zone-a:#4cc98a; --fk-zone-b:#6fb0ef; --fk-bad:#e0705f;
      --fk-yes:#5b8def; --fk-no:#e37fab;
    }
  }
  :root[data-theme="dark"]{
    --fk-ink:#e8e8ec; --fk-bg:#101114; --fk-surface:#101114; --fk-border:#33343a;
    --fk-accent:#5b8def; --fk-accent-text:#0a0a0c; --fk-muted:#93939c;
    --fk-zone-a:#4cc98a; --fk-zone-b:#6fb0ef; --fk-bad:#e0705f;
    --fk-yes:#5b8def; --fk-no:#e37fab;
  }

  .flow-figure{ margin:0; }
  .flow-caption{
    position:relative; padding-bottom:12px; margin-bottom:16px;
    border-bottom:1px solid var(--fk-border);
  }
  .flow-title{
    display:block;
    font:700 17px/1.4 'Poppins','Noto Sans KR',sans-serif;
    color:var(--fk-ink);
  }
  .flow-dek{
    margin:6px 0 0; padding-right:140px;
    font:400 13.5px/1.6 'Poppins','Noto Sans KR',sans-serif;
    color:var(--fk-muted); max-width:80ch;
  }
  .flow-copy{
    position:absolute; right:0; top:0;
    font:500 12px/1 'Poppins','Noto Sans KR',sans-serif;
    color:var(--fk-muted); background:transparent;
    border:1px solid var(--fk-border); border-radius:8px;
    padding:7px 11px; cursor:pointer;
  }
  .flow-copy:hover{ color:var(--fk-ink); border-color:var(--fk-muted); }
  .flow-copy:focus-visible{ outline:2px solid var(--fk-accent); outline-offset:2px; }
  /* 1400x800 is a FLOOR, not a cap. This box only ever clips the WIDTH axis —
     a page scrolls vertically on its own but must never scroll horizontally.
     The <svg> gets explicit pixel width/height (set in JS, not "100%") so it is
     never shrunk to fit a narrow viewport: text stays full-size and this box
     takes over instead. */
  .flow-scroll{
    overflow-x:auto; padding:24px;
    background:var(--fk-bg);
    border:1px solid var(--fk-border); border-radius:12px;
  }
  .flow-svg{ display:block; background:transparent; }
</style>
<script>
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  let lang = "en";
  // Labels may be a plain value (same in every language) or {en, ko}.
  const T = (v) => (v && typeof v === "object" && !Array.isArray(v) ? (v[lang] !== undefined ? v[lang] : v.en) : v);

  let mctx = null;
  function measure(text, font) {
    if (!mctx) mctx = document.createElement("canvas").getContext("2d");
    mctx.font = font;
    return mctx.measureText(text).width;
  }
  const sans = (s) => s + "px Poppins, 'Noto Sans KR', sans-serif";
  const mono = (s) => s + "px 'JetBrains Mono', monospace";

  function wrap(text, font, maxW) {
    const words = String(text).split(" ");
    const out = []; let cur = "";
    for (const w of words) {
      const t = cur ? cur + " " + w : w;
      if (cur && measure(t, font) > maxW) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur);
    return out.length ? out : [""];
  }

  // Every shape has ONE fixed footprint, never sized from its label — that is
  // what makes the gaps between shapes read as uniform across a whole page.
  // A label that doesn't fit wraps to at most 2 lines; it never grows the shape.
  const FIXED = {
    "terminal-pill":    { w: 110, h: 38 },
    "action-rect":      { w: 170, h: 56 },
    "decision-diamond": { w: 190, h: 104 },
    "outcome-circle":   { w: 44,  h: 44 },
  };
  // colW carries the connector runs, so it is sized from the widest edge-label
  // chip, not from the shapes: a KO "아니오" chip is 48px, and it has to sit on a
  // horizontal run between two shapes with clear line showing on both sides.
  const GRID = { colW: 260, rowH: 180, padX: 40, padY: 50 };

  // The note band lives at the BOTTOM of the svg — notes are not grid citizens.
  const BAND = { pad: 26, gap: 26, colMin: 460, labelW: 46, lh: 17, blockGap: 22 };

  // An edge label is a chip, not bare text: 6px horizontal / 3px vertical padding
  // around the label, filled with the label's own colour at low opacity.
  const CHIP = { size: 12, padX: 6, padY: 3, radius: 4, tint: 0.23 };

  // Who acts. Required on action-rect and decision-diamond; forbidden on the two
  // boundary shapes — a terminal marks an edge of the flow, nobody "does" it.
  const ACTOR = {
    user:     { en: "USER",     ko: "사용자" },
    system:   { en: "SYSTEM",   ko: "시스템" },
    screen:   { en: "SCREEN",   ko: "화면" },
    external: { en: "EXTERNAL", ko: "외부" },
    wait:     { en: "WAIT",     ko: "대기" },
  };
  const NEEDS_ACTOR = new Set(["action-rect", "decision-diamond"]);

  function sizeOf(node) {
    const v = T(node.label);
    const raw = Array.isArray(v) ? v.slice() : [String(v)];
    const f = FIXED[node.shape] || FIXED["action-rect"];

    if (node.shape === "outcome-circle") {
      return { w: f.w, h: f.h, lines: [raw[0]], fontSize: 12 };
    }
    if (node.shape === "decision-diamond") {
      // Up to 2 lines. h:104 is what keeps both baselines (cy ± 8.5) inside the
      // diamond's wide middle band, so text never spills past the taper.
      const maxW = f.w - 52;
      let size = 13;
      const lines = raw.length > 1 ? raw.slice(0, 2) : wrap(raw[0], sans(size), maxW).slice(0, 2);
      while (size > 11 && lines.some((l) => measure(l, sans(size)) > maxW)) size--;
      return { w: f.w, h: f.h, lines, fontSize: size };
    }
    const size = 13;
    const maxW = f.w - (node.shape === "terminal-pill" ? 24 : 28);
    const lines = raw.length > 1 ? raw.slice(0, 2) : wrap(raw[0], sans(size), maxW).slice(0, 2);
    return { w: f.w, h: f.h, lines, fontSize: size };
  }

  function textBlock(x, y, lines, opts) {
    opts = opts || {};
    const size = opts.size || 13, lh = opts.lineHeight || size + 4;
    const t = el("text", {
      x, "text-anchor": opts.anchor || "middle",
      "font-size": size, "font-weight": opts.weight || 400,
      "font-family": opts.mono ? "'JetBrains Mono', monospace" : "Poppins, 'Noto Sans KR', sans-serif",
      fill: opts.color || "currentColor",
    });
    const start = y - ((lines.length - 1) * lh) / 2 + size * 0.34;
    lines.forEach((line, i) => {
      const ts = el("tspan", { x, y: start + i * lh });
      ts.textContent = line;
      t.appendChild(ts);
    });
    return t;
  }

  // Left-aligned just above the shape. A vertical edge always enters at cx, and
  // the widest tag ("EXTERNAL", ~52px at 9px) ends well short of cx on every
  // shape that carries one — so a tag can never sit underneath an arrow.
  function drawActorTag(g, node, r) {
    if (!NEEDS_ACTOR.has(node.shape)) return;
    const spec = ACTOR[node.actor];
    if (!spec) {
      console.error(`[FlowKit] missing actor on "${node.id}" — ${node.shape} needs one of: ${Object.keys(ACTOR).join(", ")}`);
    }
    // A rect anchors to its left edge. A diamond has no left edge up here — its
    // top is a single point at cx — so the tag ends just short of that point,
    // which reads as attached to the apex and still clears the arrow at cx.
    const dia = node.shape === "decision-diamond";
    const cx = r.x + r.w / 2;
    const t = textBlock(dia ? cx - 10 : r.x, r.y - 7, [spec ? T(spec) : "??"], {
      size: 9, weight: 600, anchor: dia ? "end" : "start",
      color: spec ? "var(--fk-muted)" : "var(--fk-bad)",
    });
    t.setAttribute("letter-spacing", "0.09em");
    g.appendChild(t);
  }

  function drawShape(g, node, r) {
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    drawActorTag(g, node, r);
    if (node.shape === "terminal-pill") {
      g.appendChild(el("rect", { x: r.x, y: r.y, width: r.w, height: r.h, rx: r.h / 2, fill: "var(--fk-accent)" }));
      g.appendChild(textBlock(cx, cy, r.lines, { size: r.fontSize, weight: 500, color: "var(--fk-accent-text)" }));
      return;
    }
    if (node.shape === "outcome-circle") {
      g.appendChild(el("circle", { cx, cy, r: r.w / 2, fill: "var(--fk-surface)", stroke: "currentColor", "stroke-width": 1.5 }));
      g.appendChild(textBlock(cx, cy, r.lines, { size: r.fontSize, weight: 500 }));
      return;
    }
    if (node.shape === "decision-diamond") {
      const pts = [[cx, r.y], [r.x + r.w, cy], [cx, r.y + r.h], [r.x, cy]].map((p) => p.join(",")).join(" ");
      g.appendChild(el("polygon", { points: pts, fill: "var(--fk-surface)", stroke: "currentColor", "stroke-width": 1.5, "stroke-linejoin": "round" }));
      g.appendChild(textBlock(cx, cy, r.lines, { size: r.fontSize, weight: 600, lineHeight: 17 }));
      return;
    }
    g.appendChild(el("rect", { x: r.x, y: r.y, width: r.w, height: r.h, rx: 8, fill: "var(--fk-surface)", stroke: "currentColor", "stroke-width": 1.5 }));
    g.appendChild(textBlock(cx, cy, r.lines, { size: r.fontSize, weight: 400 }));
  }

  // Where a note's number badge can sit without ever covering an edge.
  // A diamond's incoming/outgoing horizontals own the left and right vertices
  // (at cy) and its down-branch owns the bottom vertex (at cx), which leaves the
  // upper-right facet permanently free. A rect is entered and left only at edge
  // MIDpoints, so its top-right corner is free for the same reason.
  function badgePos(target) {
    const r = target.rect;
    if (target.shape === "decision-diamond") {
      return { x: r.x + r.w / 2 + r.w / 4, y: r.y + r.h / 2 - r.h / 4 };
    }
    return { x: r.x + r.w, y: r.y };
  }

  function drawNoteBadge(layer, n, target) {
    const p = badgePos(target);
    layer.appendChild(el("circle", { cx: p.x, cy: p.y, r: 10, fill: "var(--fk-accent)" }));
    layer.appendChild(textBlock(p.x, p.y, [String(n)], {
      size: 11, weight: 600, color: "var(--fk-accent-text)",
    }));
  }

  const FIELDS = ["reads", "shows"];

  // A note's title is PULLED from the node it points at, so the author never
  // retypes a label and the two can never drift apart.
  function noteBlock(note, byId, colW) {
    const target = byId[note.linkTo];
    if (!target) console.error(`[FlowKit] note ${note.n} has no reachable linkTo ("${note.linkTo}")`);
    const raw = target ? T(target.label) : "?";
    const title = Array.isArray(raw) ? raw.join(" ") : String(raw);
    const rows = [];
    FIELDS.forEach((f) => {
      if (note[f] === undefined) return;
      rows.push({ label: f, lines: wrap(T(note[f]), sans(12), colW - BAND.labelW).slice(0, 3) });
    });
    if (!rows.length) console.error(`[FlowKit] note ${note.n} has neither reads nor shows`);
    const lineCount = rows.reduce((a, r) => a + r.lines.length, 0);
    return { note, target, title, rows, h: 20 + lineCount * BAND.lh + Math.max(0, rows.length - 1) * 5 };
  }

  function layoutBand(notes, byId, width, grid) {
    if (!notes.length) return { h: 0, blocks: [], cols: 0, colW: 0 };
    const inner = width - grid.padX * 2;
    let cols = Math.floor((inner + BAND.gap) / (BAND.colMin + BAND.gap));
    cols = Math.min(Math.max(2, Math.min(3, cols || 2)), notes.length);
    const colW = (inner - BAND.gap * (cols - 1)) / cols;
    const blocks = notes.map((n) => noteBlock(n, byId, colW));
    let h = BAND.pad;
    for (let i = 0; i < blocks.length; i += cols) {
      const row = blocks.slice(i, i + cols);
      row.forEach((b, j) => { b.col = j; b.rowTop = h; });
      h += Math.max(...row.map((b) => b.h)) + BAND.blockGap;
    }
    return { h: h - BAND.blockGap + BAND.pad, blocks, cols, colW };
  }

  function drawNoteBand(layer, band, y, width, grid) {
    layer.appendChild(el("line", {
      x1: grid.padX, y1: y, x2: width - grid.padX, y2: y,
      stroke: "var(--fk-border)", "stroke-width": 1,
    }));
    band.blocks.forEach((b) => {
      const bx = grid.padX + b.col * (band.colW + BAND.gap), by = y + b.rowTop;
      layer.appendChild(el("circle", { cx: bx + 8, cy: by + 6, r: 8, fill: "var(--fk-accent)" }));
      layer.appendChild(textBlock(bx + 8, by + 6, [String(b.note.n)], {
        size: 10, weight: 600, color: "var(--fk-accent-text)",
      }));
      layer.appendChild(textBlock(bx + 23, by + 6, [b.title], { size: 12.5, weight: 600, anchor: "start" }));
      let ly = by + 25;
      b.rows.forEach((row) => {
        layer.appendChild(textBlock(bx, ly, [row.label], {
          size: 10, mono: true, anchor: "start", color: "var(--fk-muted)",
        }));
        row.lines.forEach((line, i) => {
          layer.appendChild(textBlock(bx + BAND.labelW, ly + i * BAND.lh, [line], { size: 12, anchor: "start" }));
        });
        ly += row.lines.length * BAND.lh + 5;
      });
    });
  }

  function pathD(pts) { return pts.map((p, i) => (i ? "L " : "M ") + p[0] + " " + p[1]).join(" "); }

  // Label rides the exact midpoint of the path's LONGEST straight run, so it is
  // always centred on the arrow's stem no matter which routing tier ran.
  function labelPos(pts) {
    let best = 0, bestLen = -1;
    for (let i = 0; i < pts.length - 1; i++) {
      const len = Math.abs(pts[i + 1][0] - pts[i][0]) + Math.abs(pts[i + 1][1] - pts[i][1]);
      if (len > bestLen) { bestLen = len; best = i; }
    }
    const a = pts[best], b = pts[best + 1];
    return { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 };
  }

  // Nodes only ever sit at column/row CENTRES, so a bend placed exactly on a
  // column boundary is provably empty — that single fact makes every legal tier
  // below non-crossing. Returns null for an illegal (leftward/upward) edge.
  function edgeGeometry(a, b, grid) {
    const dCol = b.col - a.col, dRow = b.row - a.row;
    if (dRow === 0 && dCol >= 1) {
      return [[a.rect.x + a.rect.w, a.rect.cy], [b.rect.x, b.rect.cy]];
    }
    if (dCol === 0 && dRow >= 1) {
      return [[a.rect.cx, a.rect.y + a.rect.h], [b.rect.cx, b.rect.y]];
    }
    if (dCol === 1) {
      const midX = grid.padX + (a.col + 1) * grid.colW;
      return [[a.rect.x + a.rect.w, a.rect.cy], [midX, a.rect.cy], [midX, b.rect.cy], [b.rect.x, b.rect.cy]];
    }
    return null;
  }

  // Opt-in only, via {wrap:true}: a row wrapping into the next block. Travels a
  // lane BELOW the lower endpoint's node band (never through it), then enters
  // the target's left edge so the arrowhead still points right.
  function wrapGeometry(a, b, grid, lane) {
    const laneRow = Math.max(a.row, b.row) + 1;
    const gy = grid.padY + laneRow * grid.rowH - 24 - lane * 14;
    const ax = b.rect.x - 24;
    return [[a.rect.cx, a.rect.y + a.rect.h], [a.rect.cx, gy], [ax, gy], [ax, b.rect.cy], [b.rect.x, b.rect.cy]];
  }

  const CSS_VARS = ["--fk-ink", "--fk-bg", "--fk-surface", "--fk-border", "--fk-accent",
    "--fk-accent-text", "--fk-muted", "--fk-zone-a", "--fk-zone-b", "--fk-bad",
    "--fk-yes", "--fk-no"];

  // An SVG serialised for export is a standalone document — CSS custom
  // properties and currentColor no longer resolve, so bake them in.
  function bakeColors(markup) {
    const cs = getComputedStyle(document.documentElement);
    const ink = cs.getPropertyValue("--fk-ink").trim() || "#000";
    let out = markup;
    CSS_VARS.forEach((v) => {
      out = out.split("var(" + v + ")").join(cs.getPropertyValue(v).trim() || ink);
    });
    return out.split("currentColor").join(ink);
  }

  // Downloads are blocked inside the artifact sandbox, so copy a PNG to the
  // clipboard instead — it pastes straight into Slack or Confluence.
  async function copyPng(svg, width, height) {
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", NS);
    const markup = bakeColors(new XMLSerializer().serializeToString(clone));
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res; img.onerror = rej;
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
    });
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale; canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--fk-bg").trim() || "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  }

  const COPY_LABEL = { en: "Copy image", ko: "이미지 복사" };
  const COPY_DONE = { en: "Copied", ko: "복사했습니다" };
  const COPY_FAIL = { en: "Copy blocked", ko: "복사 차단됨" };

  function render(container, config) {
    const grid = Object.assign({}, GRID, config.grid);
    const cellCx = (col) => grid.padX + col * grid.colW + grid.colW / 2;
    const cellCy = (row) => grid.padY + row * grid.rowH + grid.rowH / 2;

    const byId = {};
    (config.nodes || []).forEach((n) => {
      const s = sizeOf(n);
      const cx = cellCx(n.col), cy = cellCy(n.row);
      byId[n.id] = Object.assign({}, n, s, {
        rect: { x: cx - s.w / 2, y: cy - s.h / 2, w: s.w, h: s.h, cx, cy, lines: s.lines, fontSize: s.fontSize },
      });
    });

    // Size follows content. 1400x800 is a FLOOR, never a cap. The note band is
    // measured separately and pinned to the BOTTOM, so a panel that only exists
    // because of the 800 floor still shows its band as a footer, not mid-air.
    const cols = (config.nodes || []).map((n) => n.col);
    const rows = (config.nodes || []).map((n) => n.row);
    const width = Math.max(1400, grid.padX * 2 + (Math.max(0, ...cols) + 1) * grid.colW);
    const graphH = grid.padY * 2 + (Math.max(0, ...rows) + 1) * grid.rowH;
    const band = layoutBand(config.notes || [], byId, width, grid);
    const height = Math.max(800, graphH + band.h);

    // When the 800 floor leaves slack, split it evenly above the graph and
    // below the band instead of dumping it all at the bottom — a short panel
    // then reads as centred rather than as a chart that ran out.
    const yShift = Math.round(Math.max(0, height - band.h - graphH) / 2);
    if (yShift) {
      Object.keys(byId).forEach((id) => {
        const r = byId[id].rect;
        r.y += yShift; r.cy += yShift;
      });
      grid.padY += yShift;   // keeps wrapGeometry's lane maths in the same frame
    }

    const uid = "fk" + Math.random().toString(36).slice(2, 8);
    const figure = document.createElement("figure");
    figure.className = "flow-figure";
    const cap = document.createElement("figcaption");
    cap.className = "flow-caption";
    const title = document.createElement("span");
    title.className = "flow-title";
    title.textContent = T(config.title) || "";
    cap.appendChild(title);
    if (config.description) {
      const dek = document.createElement("p");
      dek.className = "flow-dek";
      dek.id = uid + "-dek";
      dek.textContent = T(config.description);
      cap.appendChild(dek);
    }
    figure.appendChild(cap);
    const scroll = document.createElement("div");
    scroll.className = "flow-scroll";
    figure.appendChild(scroll);

    const svg = el("svg", {
      viewBox: `0 0 ${width} ${height}`, width, height,
      role: "img", "aria-label": T(config.title) || "flow diagram",
    });
    if (config.description) svg.setAttribute("aria-describedby", uid + "-dek");
    svg.setAttribute("class", "flow-svg");

    const copy = document.createElement("button");
    copy.className = "flow-copy";
    copy.type = "button";
    copy.textContent = T(COPY_LABEL);
    copy.addEventListener("click", () => {
      copyPng(svg, width, height).then(
        () => { copy.textContent = T(COPY_DONE); },
        () => { copy.textContent = T(COPY_FAIL); }
      ).then(() => setTimeout(() => { copy.textContent = T(COPY_LABEL); }, 1800));
    });
    cap.appendChild(copy);

    const defs = el("defs");
    const marker = el("marker", {
      id: uid + "-ah", viewBox: "0 0 10 10", refX: "8", refY: "5",
      markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse",
    });
    marker.appendChild(el("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "currentColor" }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Label chips get their OWN layer above every connector. Painting a chip into
    // edgeLayer right after its own path is not enough — a later edge's path is
    // drawn on top of an earlier edge's chip, which is how a connector ends up
    // running straight through a label.
    const zoneLayer = el("g"), edgeLayer = el("g", { fill: "none" }), labelLayer = el("g"),
      nodeLayer = el("g"), noteLayer = el("g");
    [zoneLayer, edgeLayer, labelLayer, nodeLayer, noteLayer].forEach((l) => svg.appendChild(l));

    (config.zones || []).forEach((z) => {
      const rs = z.members.map((id) => byId[id] && byId[id].rect).filter(Boolean);
      if (!rs.length) return;
      const p = 26;
      const x0 = Math.min(...rs.map((r) => r.x)) - p, y0 = Math.min(...rs.map((r) => r.y)) - p;
      const x1 = Math.max(...rs.map((r) => r.x + r.w)) + p, y1 = Math.max(...rs.map((r) => r.y + r.h)) + p;
      const c = z.color === "blue" ? "var(--fk-zone-b)" : "var(--fk-zone-a)";
      zoneLayer.appendChild(el("rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 16, fill: "none", stroke: c, "stroke-width": 1.5, "stroke-dasharray": "6 5" }));
    });

    let lane = 0;
    (config.edges || []).forEach((e, ei) => {
      const a = byId[e.from], b = byId[e.to];
      if (!a || !b) { console.error("[FlowKit] unknown node in edge", e); return; }
      let pts = e.wrap ? wrapGeometry(a, b, grid, lane++) : edgeGeometry(a, b, grid);
      let illegal = false;
      if (!pts) {
        illegal = true;
        console.error(`[FlowKit] illegal edge ${e.from} -> ${e.to} (dCol ${b.col - a.col}, dRow ${b.row - a.row}) — arrowheads must point right or down. Add {wrap:true} only for a deliberate row wrap.`);
        pts = [[a.rect.cx, a.rect.y + a.rect.h], [a.rect.cx, a.rect.y + a.rect.h + 28]];
      }
      const attrs = {
        d: pathD(pts), stroke: illegal ? "var(--fk-bad)" : "currentColor",
        "stroke-width": 1.5, "marker-end": `url(#${uid}-ah)`,
      };
      if (illegal) attrs["stroke-dasharray"] = "5 4";
      edgeLayer.appendChild(el("path", attrs));
      // [editor hook] 넓은 투명 히트 경로 — 에디터가 엣지를 클릭으로 잡는다. 정적 차트에선 무해.
      const hitPath = el("path", { d: attrs.d, stroke: "rgba(0,0,0,0)", "stroke-width": 14 });
      hitPath.setAttribute("data-fk-edge", ei);
      edgeLayer.appendChild(hitPath);
      const lbl = T(e.label);
      if (lbl) {
        const p = labelPos(pts);
        const w = measure(lbl, sans(CHIP.size)) + CHIP.padX * 2;
        const h = CHIP.size + CHIP.padY * 2;
        // Color lives on the chip only — the connector stroke above and the shapes
        // it touches stay achromatic either way (absolute rule 5 exception).
        const tint = e.sentiment === "positive" ? "var(--fk-yes)"
          : e.sentiment === "negative" ? "var(--fk-no)"
          : "currentColor";
        const box = { x: p.x - w / 2, y: p.y - h / 2, width: w, height: h, rx: CHIP.radius };
        // Two rects, not one: the opaque plate knocks the connector out from under
        // the chip, then the tint rides on top. A 23% fill on its own would let the
        // arrow's stem show straight through the label.
        labelLayer.appendChild(el("rect", Object.assign({}, box, { fill: "var(--fk-bg)" })));
        labelLayer.appendChild(el("rect", Object.assign({}, box, { fill: tint, "fill-opacity": CHIP.tint })));
        labelLayer.appendChild(textBlock(p.x, p.y, [lbl], { size: CHIP.size, color: tint }));
      }
    });

    Object.keys(byId).forEach((id) => {
      const g = el("g");
      g.setAttribute("data-fk-node", id);   // [editor hook]
      drawShape(g, byId[id], byId[id].rect);
      nodeLayer.appendChild(g);
    });

    band.blocks.forEach((b) => { if (b.target) drawNoteBadge(noteLayer, b.note.n, b.target); });
    // Straight under the graph, not pinned to the floor — a short panel that
    // only reaches 800 because of the floor would otherwise show its divider
    // hanging in mid-canvas.
    if (band.h) drawNoteBand(noteLayer, band, graphH + yShift, width, grid);

    scroll.appendChild(svg);
    // [editor hook] 에디터가 기하 정보를 읽는다 (드래그 스냅, 선택 하이라이트).
    figure._fk = { svg, byId, width, height, grid };
    container.appendChild(figure);
    return figure;
  }

  // Panels are remembered so a language switch can redraw every one of them.
  const registry = [];

  function panel(container, config) {
    const entry = { container, config, figure: null };
    entry.figure = render(container, config);
    registry.push(entry);
    return entry.figure;
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    registry.forEach((e) => { if (e.figure) e.figure.remove(); e.figure = null; });
    registry.forEach((e) => { e.figure = render(e.container, e.config); });
  }

  // `actors` is exported so a page legend reads the same table the renderer
  // draws from — the two can't drift.
  global.FlowKit = { panel, setLang, t: T, getLang: () => lang, actors: ACTOR, render, grid: GRID, shapes: FIXED };
})(window);
</script>
```

### 호출 예시

```js
// Web fonts load async — measureText() would use fallback metrics and wrap
// labels at the wrong words. Always wait for the real fonts.
document.fonts.ready.then(() => {
  const app = document.getElementById("panels");

  FlowKit.panel(app, {
    title: { en: "Organization Step 1 — Assign SW Account", ko: "Organization 1단계 — SW Account 지정" },
    description: {
      en: "Which SW Account the licence lands on, and what the account's current licence state changes about the next step.",
      ko: "라이선스를 어느 SW Account에 얹을지, 그리고 그 계정의 현재 라이선스 상태가 다음 단계를 어떻게 바꾸는지.",
    },
    // Never pass `grid` — every panel shares the one default so gaps stay uniform.
    nodes: [
      { id: "start",   shape: "terminal-pill",                      col: 0, row: 0, label: { en: "Start", ko: "시작" } },
      { id: "load",    shape: "action-rect",      actor: "system",  col: 1, row: 0, label: { en: "Load Account List", ko: "SW Account 목록 조회" } },
      { id: "hasAcct", shape: "decision-diamond", actor: "system",  col: 2, row: 0, label: { en: "Has SW Account", ko: "SW Account 보유" } },
      { id: "prompt",  shape: "action-rect",      actor: "screen",  col: 2, row: 1, label: { en: "Show Create Prompt", ko: "생성 안내 노출" } },
      { id: "select",  shape: "action-rect",      actor: "user",    col: 3, row: 0, label: { en: "Select Account", ko: "계정 선택" } },
    ],
    edges: [
      { from: "start",   to: "load" },
      { from: "load",    to: "hasAcct" },
      { from: "hasAcct", to: "select", label: { en: "Yes", ko: "예" } },
      { from: "hasAcct", to: "prompt", label: { en: "No",  ko: "아니오" } },
    ],
    // No col/row — the band lays notes out in `n` order and pulls each title
    // from the node it points at.
    notes: [
      { n: 1, linkTo: "hasAcct",
        reads: { en: "SW Accounts owned by the Organization",
                 ko: "Organization이 보유한 SW Account" },
        shows: { en: "none — a create prompt replaces the list",
                 ko: "없음 — 목록 대신 생성 안내" } },
    ],
  });
});

// 언어 토글: 페이지 버튼이 이걸 호출하면 전 패널이 다시 그려진다.
document.querySelectorAll("[data-lang]").forEach((b) => {
  b.addEventListener("click", () => FlowKit.setLang(b.dataset.lang));
});
```

패널이 여러 개면 같은 컨테이너에 `FlowKit.panel(...)`을 순서대로 호출한다 — 그게 곧 "제목 → 설명 → 그래프" 반복 스택이다. 패널 사이 세로 간격은 컨테이너에 `display:flex; flex-direction:column; gap:52px`를 준다.

---

## 출력 절차

1. HTML을 scratchpad에 작성한다. 페이지 헤더·범례·언어 토글은 이번 다이어그램에 맞게 쓴다.

   렌더러는 **손으로 옮겨 적지 않는다.** 파일을 세 조각으로 나눠 두고 이 SKILL.md에서 JS를 뽑아 붙이면 아티팩트와 스킬이 어긋날 수가 없다. 나중에 렌더러를 고쳐도 이 명령만 다시 돌리면 된다.

   ```bash
   awk '/^<script>$/{f=1;next} /^<\/script>$/{f=0} f' .claude/skills/flowchart/SKILL.md > flowkit.js
   cat part_head.html flowkit.js part_tail.js > diagram.html
   printf '</script>\n' >> diagram.html
   ```

   `part_head.html`은 `<title>`부터 `<script>` 여는 태그까지, `part_tail.js`는 페이지 카피와 `FlowKit.panel()` 호출들이다.
2. 패널마다 `FlowKit.panel()`을 호출해 노드·엣지·노트를 채운다. 호출 전체를 `document.fonts.ready.then(...)`으로 감싼다.
3. `node --check`로 JS 문법을 확인한다 (`<script>` 블록만 추출해서).
4. `Artifact` 툴로 publish. 파비콘·타이틀 컨벤션은 `artifact-design` skill 기준.
5. 브라우저 콘솔에 `[FlowKit]` 경고가 하나도 없는지 확인한다 — `illegal edge`, `missing actor`, `no reachable linkTo`, `neither reads nor shows`. 그리고 결과를 눈으로 확인한다.

---

## 페이지가 자기를 저장하게 만들기 (2026-08-27)

`capabilities: { artifact: {} }`를 선언하면 페이지가 **자기 자신의 새 버전을 발행**할 수 있다.
읽는 사람이 브라우저에서 고치고 저장하면 그게 새 버전이 되고, 링크를 연 모두가 그걸 본다.
문구 교정이 반복되는 차트라면 이걸 켜는 게 왕복을 없애는 가장 빠른 길이다.

### 전제 — 데이터를 코드에서 떼어낸다

`FlowKit.panel(app, {...})`를 나열한 형태로는 안 된다. 라벨이 `label: YES`처럼 **상수 참조**로
들어가 있으면 `JSON.stringify`로 직렬화되지 않는다. 차트를 `CHARTS` 배열 하나로 모으고 모든
상수를 **실제 값으로 인라인**한다.

기존 파일에서 옮길 때 **손으로 전사하지 않는다.** node에서 `FlowKit.panel`을 가로채는 스텁을
물려 파일을 실행시키면 config가 그대로 떨어진다.

### 자리표시자 두 개로 자기를 재생산한다

살아 있는 DOM을 직렬화하면 안 된다 — 그려 넣은 SVG가 박제되고 플랫폼이 주입한 frame-runtime까지
딸려간다. 대신 페이지가 **자기 소스를 문자열로** 들고 있게 한다.

```js
const SHELL = __SHELL__;   // 자리표시자가 살아 있는 채로의 페이지 소스
const DOC   = __DATA__;

// 마커를 런타임에 조립한다. 리터럴로 쓰면 셸 안에 자리표시자가 두 번 생겨
// 빌드가 어느 쪽을 채울지 알 수 없다.
const MARK_SHELL = "__" + "SHELL__";
const MARK_DATA  = "__" + "DATA__";

function encodeShell(s) { return JSON.stringify(s).replace(/<\//g, "<\\/"); }

function buildDoc() {
  return SHELL
    .replace(MARK_DATA,  () => JSON.stringify({ page: PAGE, charts: CHARTS }))
    .replace(MARK_SHELL, () => encodeShell(SHELL));
}
```

깨지는 지점 네 개. 전부 한 번씩 밟았다.

| 함정 | 증상 | 지킬 것 |
|---|---|---|
| 치환 순서 | 두 번째 저장에서 데이터가 엉뚱한 자리에 박힘 | **데이터 먼저**, 셸 나중. 셸을 먼저 넣으면 인코딩된 데이터 마커가 앞에 묻힌다 |
| 문자열 치환 | 내용에 `$&`가 있으면 조용히 갉아먹힘 | `replace`의 두 번째 인자를 **함수로** |
| `</` 미이스케이프 | 셸 안의 `</script>`가 자기를 감싼 블록을 조기 종료 | `JSON.stringify` 후 `</` → `<\/` |
| 마커를 리터럴로 | 빌드가 "자리표시자 2개" 라고 실패 | 마커를 런타임에 조립 |

빌드 쪽 `JSON.stringify` 대응은 `json.dumps(o, ensure_ascii=False, separators=(",", ":"))`다.
안 맞추면 1세대와 2세대가 바이트 단위로 달라져 왕복 검증이 무의미해진다.

### 편집과 저장

- 기본은 보기 모드. **편집 토글**을 눌러야 어포던스가 나온다
- 노드는 **드래그**해서 옮기고 격자 칸에 스냅한다. 자유 배치는 불가능하다 — 화살표 경로를
  열·행에서 계산하기 때문이다. 끄는 느낌만 자유롭게, 착지는 격자에
- 연결은 **갈 수 있는 노드만** 목록에 띄운다. 불법 화살표를 애초에 만들 수 없다
- 매 변경마다 검사기를 돌려 위반이면 **저장 버튼을 잠근다**
- `await claude.use("artifact")`가 `null`이면 편집 토글을 숨기고 보기 전용으로 렌더한다
- `conflict`는 **재시도하지 않는다.** 모든 뷰가 이긴 버전으로 다시 로드된다
- 저장은 **사용자가 저장을 누를 때만.** 로드 시점이나 타이핑 중에 발행하지 않는다

### 검증 — 왕복이 핵심이다

`buildDoc`을 두 번 돌려 **2세대가 1세대와 바이트 단위로 같은지** 본다. 여기서 어긋나면
사용자가 두 번째 저장을 하는 순간 페이지가 깨진다. 세 번째 세대에서 편집이 살아남는지,
셸이 여전히 원본과 같은지도 함께 본다.

검사기는 **위반을 실제로 잡는지** 반대 방향으로도 시험한다. 0을 뱉는 검사기는 통과한 게
아니라 아무것도 안 본 것일 수 있다.

---

## 출고 전 체크리스트

**구조**
- [ ] 패널마다 제목 → 설명 → 그래프 세 요소가 다 있는가?
- [ ] 모든 패널이 `grid` 인자 없이(=공통 기본값) 호출됐는가?
- [ ] 한 패널이 8열을 넘지 않는가? (넘으면 두 패널로 쪼갠다)
- [ ] 차트 카드에 24px 패딩이 있는가?

**Actor**
- [ ] 모든 `action-rect`·`decision-diamond`에 `actor`가 있는가? (콘솔에 `missing actor` 0건)
- [ ] `terminal-pill`·`outcome-circle`에 actor를 안 붙였는가?
- [ ] SYSTEM으로 몰아놓은 것 중 실제로는 EXTERNAL인 게 없는가? (실패 시 남한테 문의해야 하면 EXTERNAL)
- [ ] 사용자가 고르는 분기를 `system` 다이아몬드로 두지 않았는가?
- [ ] `wait` 노드 라벨이 `Show ~`로 시작하지 않는가?
- [ ] KO 토글에서도 태그가 도형 반폭을 안 넘는가? (세로 화살표와 충돌)

**라벨**
- [ ] 모든 라벨·제목·설명·엣지 라벨·Note 필드에 EN/KO 양쪽이 있는가? (제품명 예외)
- [ ] 의미가 자명하지 않은 줄임말이 없는가? (`4Y Mark`·`CTA` 류)
- [ ] 다이아몬드가 전부 긍정형 선언문이고 물음표가 없는가?
- [ ] 긍정형으로 뒤집은 게이트의 Yes/No 타깃을 재점검했는가?
- [ ] KO로 토글했을 때도 라벨이 도형 안에 들어오는가?
- [ ] 긍정/부정이 뚜렷한 엣지에 `sentiment`가 붙어 있는가? 3갈래 이상 분류형 라벨에는 안 붙였는가?

**화살표**
- [ ] 모든 화살촉이 오른쪽 또는 아래를 향하는가?
- [ ] 콘솔에 `[FlowKit] illegal edge`가 없는가? (빨간 점선이 보이면 좌표를 고친다)
- [ ] 전진 엣지가 `dCol ≤ 1`인가?
- [ ] `wrap:true`가 정말 행 감기에만 쓰였는가?

**Note**
- [ ] 노트에 `col`·`row`가 남아 있지 않은가? (밴드가 배치한다)
- [ ] 필드가 `reads`·`shows`이고 최소 하나가 있는가? (`body` 배열 폐기)
- [ ] 도형의 배지 번호와 밴드의 번호가 1:1인가? 배지가 엣지를 가리지 않는가?
- [ ] 밴드가 그래프 바로 아래에 붙어 있는가? (구분선이 캔버스 한가운데 뜨지 않는가)
- [ ] 값과 UI 노출이 실제로 갈리는 판단에만 붙었는가?
- [ ] `screen` 노드로 이미 그린 화면 변화를 `shows`에 또 쓰지 않았는가?

**내보내기**
- [ ] `Copy image` 버튼이 실제로 클립보드에 붙는가? (다운로드 버튼은 만들지 않는다 — 샌드박스가 차단한다)

---

## 참조

- `src/components/builder/FlowView.tsx` (라인 ~1000-1470) — 이 프로젝트의 실제 프로덕션 플로우 다이어그램. 같은 행 직선 / 다른 행 ㄱ자 꺾임 / 분기 시 slot 오프셋 라우팅의 원출처.
- `.claude/rules/figma-spec-card.md` — "룰 파일에 완전한 JS 헬퍼를 박아두고 선언적으로 호출한다"는 이 저장소의 기존 컨벤션. `FlowKit`은 같은 성격의 헬퍼다.
- `.claude/rules/ux-writing.md` — 영문이 원본이고 KO는 번역본이라는 원칙. EN/KO 라벨 쌍이 여기서 왔다.
- `.claude/rules/localization.md` — 승인된 다국어 용어집 (SW Account·Organization·Seat 등 번역 금지 목록).
- `~/.claude/rules/figma-description.md` — 번호 배지 ↔ 번호 노트 1:1 대응 관례.
