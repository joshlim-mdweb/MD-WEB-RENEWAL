---
paths:
  - "requirements/**/*clover*"
  - "requirements/**/*admin*"
---

# CLOver Admin — SW Release 도메인 룰

CLOver Admin의 SW Release(New Feature / Patch Note) 기능 기획·UX 작업 시 전체 적용.
출처: Figma Slides `qduhcoexGhPvKmcsU8rfHJ` (New Feature / Patch Note Manual)

---

## 1. 화면 구조

```
Version List                     ← 전체 버전 목록
└── Version Detail               ← 버전 상세 (버전 헤더 + Feature List + Patch Note List)
    └── Feature / Patch Note
        ├── Feature List         ← 기능 목록 (필터 / 다중 선택 / Edit Order)
        └── Feature Detail       ← 기능 상세 편집
            ├── Essential Information  ← EN 기준 필드 (Title, Desc, Category, Key Feature, Thumbnail, Links)
            └── Localization           ← KR / CN / JP / SP / FR / PR 탭별 필드
```

---

## 2. 데이터 구조

### Essential Information (EN 전용 — 기준 언어)

| 필드 | 타입 | 비고 |
|------|------|------|
| Title_EN | text | 필수 |
| Description_EN | textarea | 필수 |
| Manual Link_EN | input | 선택 |
| Video Link_EN | input | 선택 |
| Thumbnail | image | 공통 (모든 언어 공유) |
| Category | dropdown | Effortless & Intuitive / Precision & Workflow / ... |
| isKeyFeature | checkbox | |
| isLive | toggle | |

### Localization 탭 (KR / CN / JP / SP / FR / PR)

각 언어 탭에 동일 구조:
- Title
- Description
- Manual Link
- Video Link
- [Clear] [Import EN] [Save] 버튼

---

## 3. 웹 Language Fallback 로직

| 조건 | 결과 |
|------|------|
| 해당 언어 Title + Description 모두 없음 | Feature **Hidden** (해당 언어 사용자에게 비노출) |
| 해당 언어 Title/Desc 있음, 링크 없음 | Feature Visible + **EN 링크 fallback** 적용 |
| CN: Video Link가 Bilibili/Rednote 아님 | CN 사용자에게 Video 버튼 **Hidden** |

**결론: EN이 base language이자 링크 fallback 언어. KR-first 전환은 별도 스코프.**

---

## 4. 현재 워크플로우 (EN-first)

```
Create EN CONTENTS → Upload on Admin → Set Essential Information → Localization (각 언어) → Preview → Live
```

---

## 5. JSON Import/Export

- **Export**: Version Detail 페이지 우상단에서 JSON 복사
- **Import**: 새 버전 생성 시 "Import from JSON" 옵션 → JSON 붙여넣기 → 버전 번호만 수정 후 생성
- **용도**: 기존 버전을 복사해 새 버전 초안 빠르게 생성

---

## 6. Excel 템플릿 현재 컬럼 구조

현재 EN 기준:
`Title (EN)` | `Description (EN)` | `Category` | `Key Feature` | `Manual Link (EN)` | `Video Link (EN)`

다국어 컬럼은 현재 미포함 → 다국어 Excel 개선 시 추가 (별도 스코프).

---

## 7. 개선 요구사항 (Improve 1~7 + Bug 1)

Figma CLOVER-ADMIN (`nDRbIcqjM4FVKkOrLYgEpz`) 페이지 `3712:2` Legacy Section(`3787:2`) 기준.

| # | 항목 | Priority | 화면 영역 | 변경 내용 |
|---|------|----------|-----------|-----------|
| S1 | Import Excel Overwrite 모달 | P1 | Feature List → Import | 재Import 시 기존 데이터 Overwrite 확인 Dialog |
| S2 | Feature Name 동기화 | P1 | List ↔ Detail | Detail에서 이름 수정 후 List 즉시 반영 |
| S3 | Set to Live/Off 일괄 처리 | P1 | List 멀티셀렉트 액션바 | Publish(N) / Unpublish(N) 분리 버튼, N=0이면 disabled |
| S4 | Sort Direction 변경 기억 | P2 | List 정렬 | 정렬 방향 세션 동안 유지, 기본값 오름차순 |
| S5 | List View 스크롤 고정 | P2 | List 헤더 | Max Height 고정, 헤더 sticky |
| S6 | Assigned Image 제거 기능 | P1 | Detail — Thumbnail | Delete 버튼 추가 + 확인 Dialog + 빈 상태 placeholder |
| S7 | Manual Field 2행 표시 | P3 | Detail — Manual Link 필드 | 1행 input → 2행 textarea, 줄바꿈 허용 |

### S1 상세

- 기능 1건 이상 등록 상태에서 Import 실행 → Confirmation Dialog
- Dialog: "기존 데이터를 덮어쓸까요?" / [닫기] [Overwrite]
- [Overwrite] 클릭 → 기존 기능 전체 삭제 후 새 파일 Import
- 빈 Feature List 상태 → Dialog 없이 바로 Import

### S3 상세

- `Publish(N)` — N = 선택 항목 중 현재 Off 상태인 건수
- `Unpublish(N)` — N = 선택 항목 중 현재 Live 상태인 건수
- N = 0이면 해당 버튼 disabled (회색)

### S6 상세

- Essential Information — Thumbnail 영역 오른쪽 상단에 [Delete] 버튼
- 클릭 시 Dialog: "Are you sure you want to remove this image?" / [닫기] [제거]
- 제거 완료 → "Click or drag to upload" 빈 상태 placeholder

### S7 상세

- Manual Link 필드: 현재 1행 input → 2행 textarea로 변경
- URL 구조: `https://support.marvelousdesigner.com/hc/en-us/articles/XXXX` 에서 언어 코드(en-us)만 교체하는 방식이므로 2행이면 URL 전체 확인 가능
- Essential Information(EN) + Localization 모든 탭 동일 적용

---

## 8. Figma 파일 정보

| 항목 | 값 |
|------|-----|
| 파일 키 | `nDRbIcqjM4FVKkOrLYgEpz` |
| 작업 페이지 node ID | `3712:2` |
| Legacy Section | `3787:2` |
| 폰트 | Avenir Next LT Pro (Regular / Medium / Demi) |
| 정책서 (Figma Slides) | `qduhcoexGhPvKmcsU8rfHJ` |

---

## 9. Korean-first (별도 스코프 — Improve 1~7 미포함)

CLO Admin은 Korean-first 등록 워크플로우가 필요. MD Admin 내부 담당자도 한국어 먼저 입력을 원한다.

### 변경 시 영향 범위

1. **데이터 모델**: `Title_EN` → `Title_BASE` (또는 KR 필드 Essential Information에 추가)
2. **웹 fallback 로직**: EN 대신 KR을 fallback으로 쓰거나 우선순위 방식으로 변경
3. **Excel 템플릿**: "Title (EN)" 컬럼 → "Title (Base Language)" 또는 KR/EN 선택
4. **JSON 구조**: `title_en` 키 → `title_base` 또는 `title_kr`

### 정책 결정 필요 사항

- [ ] 기준 언어를 EN 고정에서 선택 가능으로 바꿀 것인가?
- [ ] KR을 EN과 동등한 "필수 언어"로 추가할 것인가?
- [ ] 웹 fallback 우선순위: EN 우선 유지 vs KR 우선 vs 등록된 순서?
- [ ] Excel/JSON 구조 하위 호환 유지 여부

→ **정책 결정 후 별도 PRD 작성.**
