---
paths:
  - "src/**/*.{ts,tsx}"
---

# Design System — Tokens & Universal Rules

모든 파일에 적용. 예외 없음.

## Origin

색상 토큰 룰은 에이전트가 반복적으로 `style={{ color: "#3182f6" }}` 같은 hex 하드코딩을 넣으면서 추가됐다. 디자인 토큰이 업데이트될 때마다 6개 이상의 파일을 수동으로 찾아 고쳐야 했다. 토큰 import를 강제하면 토큰 파일 한 곳만 수정하면 된다.

**제거 조건:** TypeScript가 COLOR 토큰 타입을 컴파일 레벨에서 강제하거나, 30일간 hex 하드코딩이 git log에 없으면 검토.

## 색상 하드코딩 절대 금지

```tsx
// ❌
style={{ color: "#3182f6", backgroundColor: "#f4f7fa" }}

// ✅
import { COLOR } from "@/lib/design-tokens"
style={{ color: COLOR.ACCENT, backgroundColor: COLOR.BG_SURFACE }}
```

## Semantic Color 의미 (역할 외 사용 금지)

| 토큰               | 의미                      | 금지             |
| ------------------ | ------------------------- | ---------------- |
| `COLOR.ACCENT`     | 인터랙티브·진행 중·선택됨 | 단순 강조·장식   |
| `COLOR.POSITIVE`   | 성공·완료·수익·증가       | 경고성 메시지    |
| `COLOR.NEGATIVE`   | 오류·삭제·위험 액션       | 단순 강조용 빨강 |
| `COLOR.WARNING`    | 주의·만료 예정·보관됨     | 에러 대체        |
| `COLOR.TEXT_MUTED` | 부가 정보·비활성          | 주요 콘텐츠      |

색상만으로 의미 전달 금지 — 반드시 텍스트 or 아이콘 병행.

## Weight 결정 트리

```
화면 내 단 하나의 최상위 숫자·히어로인가?
  → YES: 700 (금액, KPI, H1)

구조를 만드는 레이블인가? (읽지 않아도 섹션이 구분되어야 하는가?)
  → YES: 600 (H3, 카드 헤딩, 네비, 섹션 타이틀)

배경(색·border)이 있는 UI 컨트롤인가?
  → YES: 500 (버튼 레이블, 배지, 탭)

위 모두 아님 → 400 (본문, 설명, 입력값, 메타)
```

추가 제약:

- 한 화면에 700 요소 3개 이상 → Bold 1–2개로 줄인다
- 한국어 단독 타이틀 → 600을 500으로 낮춤 (Wanted Sans 600이 시각적으로 무거움)
- 11px 이하 → 700 금지

## CSS 클래스 네이밍

주요 레이아웃 최상위 엘리먼트에 semantic class 필수.

| 접미사    | 용도                | 예시                 |
| --------- | ------------------- | -------------------- |
| `_area`   | 페이지 내 독립 구역 | `question_list_area` |
| `_wrap`   | 컴포넌트 루트       | `question_card_wrap` |
| `_header` | 상단 헤딩           | `builder_header`     |
| `_body`   | 본문                | `section_card_body`  |
| `_footer` | 하단                | `builder_footer`     |

버튼·span·label 등 세부 인라인 요소는 Tailwind만으로 충분.

## 인터랙션 시스템 (INTERACTION 토큰)

**Toss 원칙: border 변경으로 hover 표현 금지. 배경색 전환 또는 scale 사용.**

```tsx
import { INTERACTION } from "@/lib/design-tokens"

// ✅ MainList (리스트 행, flat 카드) — 배경색 전환
style={{
  backgroundColor: hovered ? INTERACTION.HOVER_BG : COLOR.BG_BASE,
  transition: INTERACTION.TRANSITION_BG,
}}

// ✅ SummarizedContainer (compact 카드) — scale + 배경색
style={{
  backgroundColor: hovered ? INTERACTION.HOVER_BG : COLOR.BG_BASE,
  transform: hovered ? INTERACTION.SCALE_UP : INTERACTION.SCALE_NONE,
  transition: INTERACTION.TRANSITION_CARD,
}}

// ❌ border-color 변경으로 hover 표현
style={{ border: `1px solid ${hovered ? COLOR.BORDER_FOCUS : COLOR.BORDER_DEFAULT}` }}

// ❌ box-shadow 추가/강화로 hover 표현
style={{ boxShadow: hovered ? SHADOW.CARD_HOVER : SHADOW.CARD }}
```

| 토큰                           | 값            | 용도                |
| ------------------------------ | ------------- | ------------------- |
| `INTERACTION.HOVER_BG`         | `#EEF1F4`     | white base 위 hover |
| `INTERACTION.HOVER_BG_SURFACE` | `#E8ECF0`     | BG_SURFACE 위 hover |
| `INTERACTION.ACTIVE_BG`        | `#E2E7EB`     | pressed / active    |
| `INTERACTION.SCALE_UP`         | `scale(1.02)` | compact 카드 hover  |
| `INTERACTION.TRANSITION_BG`    | `150ms ease`  | 배경색 전환         |
| `INTERACTION.TRANSITION_CARD`  | `200ms ease`  | scale + 배경색      |

## 버튼 텍스트

액션 버튼은 **"~하기"** 형태. 예외: "취소".

✅ 공개하기, 삭제하기, 저장하기 / ❌ 발행, 삭제, 저장
