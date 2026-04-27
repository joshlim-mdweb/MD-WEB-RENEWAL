---
paths:
  - "src/components/builder/**"
  - "src/app/(builder)/**"
---

# Survey Builder Rules

## Origin

Builder 룰은 두 가지 반복 실수에서 만들어졌다:

1. **QUESTION_TYPE_COLORS 이중 정의 (2026-03-24):** `design-tokens.ts`와 `QuestionTypeIcon.tsx` 두 곳에 색상 맵이 정의됐고, 값이 조용히 달라져서 빌더에서 타입별 색상이 불일치했다. 단일 소스 룰로 해결.
2. **응답 있는 질문 타입 변경 허용:** 응답이 이미 들어온 질문의 타입을 바꾸면 기존 답변 데이터가 파싱 불가능해진다. Edit guard 룰로 응답 존재 시 타입 변경을 차단.

**제거 조건:** QUESTION_TYPE_COLORS TypeScript enum으로 강제 시 단일소스 룰 검토 가능.

## 질문 타입 (10개)

`multiple_choice` · `short_text` · `long_text` · `scale` · `grade` · `checkbox` · `dropdown` · `ranking` · `startpoint` · `endpoint`

### startpoint / endpoint — 설문 단위 고정 노드

- **설문 당 1개씩만 존재** (section_id = null)
- **삭제/이동 불가** — QuestionList에서 DnD SortableContext 제외, FlowView에서 layout 계산 고정
- `startpoint`: 인사말 + 시작 버튼 (`StartpointConfig`: message, buttonLabel)
- `endpoint`: 마무리 메시지 + 리디렉션 URL (`EndpointConfig`: message, redirectUrl)
- 타입 변경 드롭다운에서 제외 (`QuestionSettings.tsx`)
- `order_index`: startpoint = -1, endpoint = 99999 관례

## 상태

- Survey: `draft` → `published` → `closed` → `archived`
- Builder view: `list` (기본) | `flow`
- `order_index` — DB에서 순서 관리
- 조건 분기 — question `config` 필드에 저장

## 편집 제한

responses 존재 시:

- ❌ 기존 질문 삭제
- ❌ 질문 타입 변경
- ❌ 옵션 삭제/변경
- ✅ 설명/도움말/마무리 문구 편집

## QUESTION_TYPE_COLOR

`design-tokens.ts`의 `QUESTION_TYPE_COLOR`만 수정. `QuestionTypeIcon.tsx`는 re-export만.
두 곳에서 정의하면 값 불일치 버그 발생.

## 공개 조건 (publish validation)

- 제목 필수
- 질문 1개 이상
- 모든 질문 완성
- 끊어진 로직 참조 없음
