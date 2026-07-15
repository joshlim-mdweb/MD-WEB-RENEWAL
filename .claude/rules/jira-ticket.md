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

---

## 3. Tasks 구성 규칙

Tasks 섹션은 **디자인 / 개발** 두 섹션으로 구분한다.

### Tasks 작성 전 현재 상태 확인 필수

Tasks의 각 항목을 "추가" / "수정" / "변경"으로 표현하기 전에, 반드시 현재 화면·폼의 실제 구현 상태를 확인한다.

- 이미 존재하는 요소 → "추가" 금지, "수정" / "문구 변경" 등으로 표현
- 스크린샷, 코드, 또는 사용자 확인을 통해 검증 후 작성
- 확인 없이 PRD 내용만 보고 "추가"로 단정하지 않는다

```
디자인

- [ ] 항목 A
- [ ] 항목 B

개발

- [ ] 항목 C
- [ ] 항목 D
```

**디자인**: 타이틀·배지·문구·레이아웃·이메일 템플릿 등 시각/UX 산출물  
**개발**: 필드 추가·로직·API·이벤트 등 코드 구현 항목  
FE/BE는 개발 안에서 따로 나누지 않는다.

---

## 4. 작성 금지 항목

Story/이슈 설명에 포함하지 않는다:

- Story Points (SP) — 개발팀 추정
- 스프린트 배분 — 개발팀 결정
- 기술 구현 방법 (CSS, API 방식 등) — 개발팀 판단
- 이벤트 로깅 스펙 — 분석팀 판단
- 컴포넌트/화면 경로 — 개발팀 판단
- 외부 시스템 고유명사 (HubSpot, Salesforce 등) — PM이 모르는 용어는 제외
- 담당자명 인라인 표기 ((Arsen), (담당자) 등) — 담당자 지정은 Jira 필드로

---

## 5. 하위 티켓 (FE / BE / PD) 네이밍

상위 이슈 제목 그대로 + prefix 형식:

```
[FE] {상위 이슈 제목}
[BE] {상위 이슈 제목}
[PD] {상위 이슈 제목}
```

- 이슈 타입: **`Sub-Task(MD)`** (hierarchyLevel: -1, subtask: true)
  - `Task(MD)`는 hierarchyLevel 0으로 상위 이슈와 동급 → parent 설정 불가
- 생성 시 `parent` 필드로 상위 이슈 직접 지정 (`createIssueLink` 사용 금지)
- prefix만 앞에 붙이고 제목은 변경하지 않는다

```
예: 상위 이슈 "Site | 기업 트라이얼 신청 폼 개선"
    → [FE] Site | 기업 트라이얼 신청 폼 개선
    → [BE] Site | 기업 트라이얼 신청 폼 개선
    → [PD] Site | 기업 트라이얼 신청 폼 개선
```

---

## 6. 변환 예시

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
