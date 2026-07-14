---
paths:
  - "requirements/**/*.md"
---

# Atlassian 워크플로우

MD Web Renewal 프로젝트의 Jira · Confluence 사용 규칙.

---

## 1. Jira

**프로젝트**: `MDWEB` (고정 — 이 레포에서 생성하는 모든 티켓은 MDWEB)
**티켓 형식**: `MDWEB-{숫자}`

### 티켓 계층

```
Epic
└── Story (기능 단위)
    └── Tasks (Story 본문 체크리스트 — 별도 Sub-task 생성 안 함)
```

- Epic: PRD 1개 = Epic 1개
- Story: PRD의 S1, S2… 각각 = Story 1개
- Sub-task 생성 금지 — Tasks는 Story 설명 내 `- [ ]` 체크리스트로 처리

### 우선순위 매핑

| PRD 표기 | Jira Priority |
|---|---|
| P1 | High |
| P2 | Medium |
| P3 | Low |

---

## 2. Confluence

**스페이스**: `MD_TEAM` (key: M)
**URL**: https://clo.atlassian.net/wiki/spaces/M

### 페이지 트리 구조

```
MD Web Renewal          ← 최상위 섹션
├── Policy              ← 운영 정책 · 영향 정책 원문
├── PRD                 ← requirements/*.md 원본 미러
└── Meeting Notes       ← 회의록
```

### 페이지 네이밍

| 유형 | 형식 | 예시 |
|---|---|---|
| Policy | `[영역] 정책명` | `[License] Indie License 정책` |
| PRD | PRD 제목 그대로 | `CLOver Admin SW Release UX 개선 — Phase 2` |
| Meeting Notes | `[YYYY-MM-DD] 제목` | `[2026-04-27] SW Release Phase 2 킥오프` |

---

## 3. Jira ↔ Confluence 연결

- Epic 생성 시 → 해당 PRD Confluence 페이지를 Epic의 **Confluence pages** 필드에 링크
- Policy 페이지 작성 시 → 관련 Jira Epic을 페이지 본문 상단에 `관련 티켓: MDWEB-{숫자}` 형태로 명시
- Story에서 정책 참조가 필요하면 → Confluence Policy 페이지 URL을 Story 설명에 인라인 링크로 삽입

---

## 4. 금지

- `CWD` 프로젝트에 MD Web Renewal 티켓 생성 금지 — `MDWEB`만 사용
- Confluence에 MD_Store(MDSTO) 스페이스 사용 금지 — `MD_TEAM(M)` 만 사용
- Epic 없이 Story 단독 생성 금지
