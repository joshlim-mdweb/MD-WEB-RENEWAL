---
paths:
  - "requirements/**/*.md"
---

# Jira 티켓 작성 규칙

`requirements/*.md` → Jira MDWEB 티켓 변환 기준.

---

## 1. Epic 생성

PRD 파일 1개 = Epic 1개.

| 필드 | 값 |
|---|---|
| 제목 | PRD 제목 (파일명 아닌 H1 제목) |
| 설명 | PRD의 Background 섹션 내용 |
| Priority | PRD 전체 우선순위 기준 (P1 Epic → High) |
| Confluence 링크 | 해당 PRD Confluence 페이지 URL |

---

## 2. Story 생성

PRD의 `S1`, `S2`… 각각 = Story 1개. Epic에 연결.

### 제목 형식

```
[S번호] 기능명
```

```
예: [S1] Import Excel Overwrite 다이얼로그
    [S3] Set to Live / Set to Off 일괄 처리
```

### 설명 구조

```
**현황**
(PRD의 현황 텍스트 그대로)

**Tasks**
- [ ] 항목 1
- [ ] 항목 2
- [ ] 항목 3
```

- 현황은 1~2문장. PRD에서 복붙.
- Tasks는 PRD의 `- [ ]` 체크리스트 그대로 복붙.
- AC 코드블록, 기술 구현 힌트는 포함하지 않는다.

### Priority 매핑

| PRD | Jira |
|---|---|
| `P1` | High |
| `P2` | Medium |
| `P3` | Low |

---

## 3. 작성 금지 항목

Story 설명에 포함하지 않는다:

- Story Points (SP) — 개발팀 추정
- 스프린트 배분 — 개발팀 결정
- 기술 구현 방법 (CSS, API 방식 등) — 개발팀 판단
- 이벤트 로깅 스펙 — 분석팀 판단
- 컴포넌트/화면 경로 — 개발팀 판단

---

## 4. 변환 예시

**PRD 원본**

```markdown
### S1 — Import Excel Overwrite 다이얼로그 `P1`

기능이 등록된 상태에서 엑셀을 다시 Import하면 에러가 출력되고 로드가 차단된다.

**Tasks**
- [ ] 기능 1건 이상 등록 상태에서 Import 실행 시 Confirmation Dialog 표시
- [ ] Dialog: "기존 데이터를 덮어쓸까요?" / [닫기] [Overwrite]
```

**Jira Story**

```
제목: [S1] Import Excel Overwrite 다이얼로그
Priority: High

---
**현황**
기능이 등록된 상태에서 엑셀을 다시 Import하면 에러가 출력되고 로드가 차단된다.

**Tasks**
- [ ] 기능 1건 이상 등록 상태에서 Import 실행 시 Confirmation Dialog 표시
- [ ] Dialog: "기존 데이터를 덮어쓸까요?" / [닫기] [Overwrite]
...
```
