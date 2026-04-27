---
paths:
  - "src/components/ui/**"
---

# Design System — UI Component Rules

`src/components/ui/` 작업 시 로드.

## Button

**정의:** 즉시 수행할 액션을 트리거. 네비게이션은 Link.

| Variant   | 언제                           | 한 화면 최대 | 금지                        |
| --------- | ------------------------------ | ------------ | --------------------------- |
| `solid`   | 해당 화면 최상위 단일 CTA      | **1개**      | 섹션별 반복, 보조 액션      |
| `primary` | 기본 확인·저장                 | 2–3개        | 위험 액션                   |
| `neutral` | 취소·닫기·뒤로가기             | 제한 없음    | 단독 메인 CTA               |
| `danger`  | 삭제·초기화 (되돌릴 수 없음)   | 1개          | 반드시 확인 다이얼로그 병행 |
| `ghost`   | 카드 내부 인라인·컨텍스트 메뉴 | 제한 없음    | 페이지 수준 CTA             |

Size: `lg`(44px) 주요 CTA / `md`(36px) 일반 폼·모달 기본 / `sm`(28px) 테이블 인라인·Builder

`solid` + `neutral` 페어링이 표준 (확인 + 취소).
`disabled` 남용 금지 — 왜 비활성인지 tooltip 또는 helper text 병행.

## Badge

**정의:** 설문·폴의 status를 읽기 전용 표시. non-interactive.

- `draft` / `published` / `closed` / `archived` 상태 표시 전용
- 클릭 가능한 필터·태그 → Chip 사용 (미구현)

## Input

**정의:** 폼 컨텍스트에서 텍스트 수집. Builder 인라인 편집에 쓰지 않음.

- `type="text"` 한 줄 / `type="textarea"` 여러 줄
- `state="error"` + `errorMessage` 병행 필수 (색상만으로 에러 표현 금지)
- maxLength는 soft limit — 초과 허용, 제출 시 validate

## Toggle

**정의:** 즉시 적용되는 on/off. 저장 버튼 없이 즉시 반영.

- 즉시 적용 설정 → Toggle
- 폼 제출 전 선택·복수 선택 → Checkbox
- label wrapper min-height 44px 필수 (WCAG 2.5.5)

## Dropdown

**정의:** 5개 이상 옵션에서 공간 절약 단일/복수 선택.

- 2–4개 옵션 → Radio/Checkbox
- 네이티브 `<select>` → 모바일 폼, 접근성 우선 폼

## Toast / ToastPill

**정의:** 사용자 액션 결과 즉각 피드백. 3초 자동 소멸.

- 화면당 1개, 3초 자동 소멸, 하단 중앙 고정
- 중요한 에러 → inline error 또는 modal
- 스택/누적 금지

## EmptyState

세 케이스 구분:

| 케이스                     | CTA                 |
| -------------------------- | ------------------- |
| No data (아직 없음)        | solid 버튼 (만들기) |
| No result (검색 결과 없음) | 검색 초기화         |
| Error (로드 실패)          | 다시 시도하기       |

아이콘/일러스트 없이 텍스트만 쓰지 않는다.

## Elevation (Shadow)

| 레이어     | 토큰                | 컴포넌트             |
| ---------- | ------------------- | -------------------- |
| 카드 기본  | `SHADOW.CARD`       | Card, QuestionCard   |
| 카드 hover | `SHADOW.CARD_HOVER` | hover 상태만         |
| 드롭다운   | `SHADOW.DROPDOWN`   | Dropdown             |
| 모달       | `SHADOW.MODAL`      | Modal                |
| 플로팅/GNB | `SHADOW.AMBIENT`    | GNB, FloatingToolbar |

같은 레이어에 두 가지 shadow 공존 금지.

## 모션

| 상황       | Duration                |
| ---------- | ----------------------- |
| 버튼 press | 100ms                   |
| hover 색상 | `DURATION.BASE` (200ms) |
| 모달 진입  | `DURATION.SLOW` (320ms) |
| Toast      | 150ms ease-out          |

500ms 이상 transition 금지. scroll-triggered animation 금지.
