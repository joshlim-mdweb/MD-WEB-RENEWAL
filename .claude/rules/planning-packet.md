---
name: planning-packet
description: 기획 웨이브 PACKET/REPORT 파일 포맷 정의. pm·design·figma 채널 + validator 포맷 포함. wave-prep·wave-integrate·orch 커맨드가 이 포맷을 기준으로 동작한다.
---

# Planning Wave — PACKET / REPORT 포맷 정의

기획 오케스트레이션 시스템의 채널 간 통신 규약.
모든 PACKET·REPORT는 이 포맷을 정확히 따른다. 임의 섹션 추가·생략 금지.

---

## 파일 위치 규약

```
requirements/waves/
├── active/                   ← 진행 중인 wave
│   ├── PACKET-pm.md
│   ├── REPORT-pm.md
│   ├── PACKET-design.md
│   ├── REPORT-design.md
│   ├── PACKET-figma.md
│   └── REPORT-figma.md
└── archive/
    ├── wave-01/              ← 완료된 wave (wave-integrate 후 이동)
    └── wave-02/
```

**완료 신호 정의**
- `REPORT-{agent}.md` 파일 생성 = 해당 채널 완료
- 오케스트레이터가 읽은 REPORT는 `REPORT-{agent}.md.seen` 생성으로 표시

---

## 1. pm-PACKET

```markdown
[착수 패킷 · pm · {N}차 웨이브] {Jira} {피처명}

## 스코프
- 피처:
- 대상 화면/플로우:
- Jira:

## 입력 참조
- 정책: docs/policy/{파일명}
- 기존 PRD: {경로 또는 "없음"}
- 참고 Figma: {url 또는 "없음"}

## 작업 지시
{구체적 작업 항목 — 추측 작성 금지, 정책 파일 기준}

## 작성 규칙
- .claude/rules/prd-writing.md (문체·구조)
- .claude/rules/ux-writing.md (UX Writing)
- .claude/rules/atlassian.md (Jira·Confluence 연계)

## 완료 조건
- End: requirements/waves/active/prd-draft.md 작성 완료
- Verification: 모든 MemberType 케이스 + Empty/Error/Loading 상태 커버
- Constraints: 개발 구현·CSS·빌드 스펙 포함 금지 / 정책·UX·화면 구성만

## 이전 실수 주의
{.claude/planning-logs/pm-log.md 최신 실수노트 발췌 — 없으면 "없음"}
```

---

## 2. pm-REPORT

```markdown
# REPORT — pm · {N}차 웨이브 · {Jira} {피처명}

- 상태: 완료 | 중단(사유)
- 산출물: requirements/waves/active/prd-draft.md

## 한 일
- {항목별}

## 추가 지시 이행표
(PACKET에 ## 추가 지시 있을 때만)
1. ✅/⛔ {내용}

## 커버 항목
- [ ] MemberType 전체 케이스 (Non-Member / Individual / Student / CompanyID / Academic / Indie / License ID)
- [ ] Empty 상태
- [ ] Error 상태
- [ ] Loading 상태
- [ ] 비즈니스 로직 분기

## 오케스트레이터 이월
없음 | {항목}

## 실수노트
없음 | {구체적 실수 — 패턴 파악용}
```

---

## 3. design-PACKET

```markdown
[착수 패킷 · design · {N}차 웨이브] {Jira} {피처명}

## 스코프
- 피처:
- 검토 대상 PRD: requirements/waves/active/prd-draft.md
- 검토 화면:

## 입력 참조
- PRD: requirements/waves/active/prd-draft.md
- 정책: docs/policy/{파일명}

## 검토 지시
1. 플로우 일관성 — 진입·종료 조건이 PRD와 정책 파일 일치하는가
2. 상태 완전성 — Default·Loading·Empty·Error + 비즈니스 상태 전부 정의됐는가
3. 예외·엣지케이스 — 네트워크 실패, 중복 제출, 권한 부족 등 누락 여부
4. MemberType 분기 — 7종 케이스 처리가 명확한가
5. PRD ↔ 정책 충돌 — docs/policy/ 기준으로 상충 항목 있는가

## 완료 조건
- End: REPORT에 이슈 목록(심각도) + Figma 진입 가능 여부 판정
- Verification: 이슈마다 PRD 섹션 번호 + 정책 파일명 근거 인용 필수
- Constraints: Figma 작업 금지 / UX 검증·문서 검토만

## 이전 실수 주의
없음 | {.claude/planning-logs/design-log.md 발췌}
```

---

## 4. design-REPORT

```markdown
# REPORT — design · {N}차 웨이브 · {Jira} {피처명}

- 상태: 완료 | 중단(사유)
- 판정: Figma 진입 가능 | PRD 재작업 필요

## 이슈 목록
| # | 심각도 | 항목 | PRD 섹션 | 근거 정책 |
|---|---|---|---|---|
| 1 | CRITICAL/HIGH/LOW | | | |

(이슈 없으면 "없음")

## PRD 재작업 요청
(CRITICAL/HIGH 이슈 있을 때만 — 오케스트레이터가 pm 재하달 판단)
- {항목}

## Figma 진입 체크
- [ ] 모든 화면의 상태 정의 완료
- [ ] MemberType별 분기 명확
- [ ] 인터랙션 트리거·결과 명시
- [ ] 예외 케이스 처리 정의

## 오케스트레이터 이월
없음 | {항목}

## 실수노트
없음 | {구체적 실수}
```

---

## 5. figma-PACKET

```markdown
[착수 패킷 · figma · {N}차 웨이브] {Jira} {피처명} — {화면명}

## 스코프
- 피처:
- 그릴 WF 목록:
  - STRUCTURE: {프레임명}
  - FEATURE: {프레임명}
  - CASE VIEW: {프레임명 또는 "없음"}
- Figma: file={key} / page={page name} / 섹션={section name}

## 입력 참조
- PRD: requirements/waves/active/prd-draft.md
- UX 검토: requirements/waves/active/ (REPORT-design.md 참조)
- 참조 프레임 ID: {clone 소스 node-id 또는 "없음 — 새로 생성"}

## 작업 규칙 (파이프라인 순서 필수)
1. figma-read.md — 참조 프레임 실측 후 스펙 매트릭스 확인
2. figma-description.md — Numbered Note Q1~Q3 판단 후 골격 확정
3. figma-draw.md — 실측값으로만 작업, 추측 수치 금지
4. figma-write.md — Pre-flight 체크리스트 전 항목 완료 후 삽입

## 완료 조건
- End: WF 프레임 생성 + Description 삽입 + screenshot 첨부
- Verification: Pre-flight 체크리스트 체크박스로 REPORT에 포함
- Constraints: 스펙 매트릭스 Josh OK 없이 진행 금지 / screenshot 없이 완료 선언 금지

## 이전 실수 주의
{.claude/planning-logs/figma-log.md 최신 실수노트 발췌 — 없으면 "없음"}
```

---

## 6. figma-REPORT

```markdown
# REPORT — figma · {N}차 웨이브 · {Jira} {피처명} — {화면명}

- 상태: 완료 | 중단(사유)
- 생성 프레임 ID:
  - STRUCTURE: {node-id}
  - FEATURE: {node-id 목록}

## 한 일
- {항목별}

## Pre-flight 체크리스트
- [ ] Header Note가 화면명 한 줄만인가
- [ ] 독립 UI 요소가 Numbered Note로 분리됐는가
- [ ] 상태가 라이프사이클 순서인가
- [ ] 인터랙션 구조 [트리거] 시: + 성공/실패인가
- [ ] L4 중첩 없는가
- [ ] screenshot으로 시각 검증했는가
- [ ] resize() 후 primaryAxisSizingMode 재설정했는가
- [ ] FILL 설정이 appendChild 이후인가

## Figma 실행 로그
- 사용 패턴: clone | createFrame | importComponent (해당 항목 표시)
- screenshot: [첨부] | 실패 — {사유}
- 에러: 없음 | {에러 전문}

## 오케스트레이터 이월
없음 | {항목}

## 실수노트
없음 | {구체적 실수 — 패턴 파악 필수}
```

---

## 7. wf-validator REPORT (Gate 3a)

md-figma가 아닌 **별도 에이전트**가 작성. figma-lane의 REPORT와 PACKET만 보고 독립 판정.

```markdown
# REPORT — wf-validator · {N}차 웨이브 · {Jira} {화면명}

- 판정: PASS | FAIL

## 시각 체크리스트
- [ ] screenshot 존재 (없으면 즉시 FAIL)
- [ ] 프레임 W=2448 / Screen W=1920 기준
- [ ] Auto Layout — NONE 프레임 없음 (Screen 제외)
- [ ] Board Header: Main ALL CAPS + Sub 경로형 텍스트
- [ ] 패딩 16px 기본 (예외 시 근거 있음)
- [ ] STRUCTURE → FEATURE clone 시 annotation 삭제됨
- [ ] 레이어 구조가 PACKET 명세와 일치

## 이슈
| # | 심각도 | 항목 | 위치 | 근거 규칙 |
|---|---|---|---|---|
| | CRITICAL/HIGH/LOW | | | figma-draw.md §N |

## 재하달 지시 초안 (FAIL 시 — 오케스트레이터가 PACKET ## 추가 지시로 사용)
1. [CRITICAL] {수정 항목 구체적으로}
```

---

## 8. desc-validator REPORT (Gate 3b)

wf-validator와 **병렬** 실행. figma-description.md + figma-write.md 전체를 context로 로드 후 판정.

```markdown
# REPORT — desc-validator · {N}차 웨이브 · {Jira} {화면명}

- 판정: PASS | FAIL

## 룰 체크리스트 (figma-write.md Pre-flight 기준)
- [ ] Header Note(L0) 화면명 한 줄만 — 불릿 없음 (패턴 5)
- [ ] 독립 UI 요소가 Numbered Note(L1)로 분리 (패턴 4)
- [ ] L2 불릿에 "요소명: 설명" 패턴 없음
- [ ] L3 서브불릿 위에 카테고리 레이블 있음
- [ ] L4 중첩 없음
- [ ] 상태 라이프사이클 순서 (Active → ... → Expired)
- [ ] 인터랙션 구조: [트리거] 시: + 성공/실패 (패턴 1)
- [ ] 에러 동작이 상태: Error: 블록 안에 있음 (패턴 2)
- [ ] 성공 후 분기가 비즈니스 로직 블록으로 분리 (패턴 1)
- [ ] API 연동 컴포넌트에 Loading/Empty/Error 있음
- [ ] px·hex·CSS 수치 없음

## 이슈
| # | 심각도 | 항목 | 위반 패턴 | 근거 규칙 |
|---|---|---|---|---|
| | CRITICAL/HIGH/LOW | | 패턴 N | figma-description.md §N |

## 재하달 지시 초안 (FAIL 시)
1. [CRITICAL] {수정 항목 구체적으로}
```

---

## 9. 자정작용 규칙

### 재하달 조건
| 판정 | 처리 |
|---|---|
| wf + desc 둘 다 PASS | Gate 4 오케스트레이터 최종 확인 |
| CRITICAL 이슈 있음 | 즉시 재하달 — PACKET에 `## 추가 지시` append |
| LOW만 있음 | 오케스트레이터 이월 큐 — 다음 재하달 또는 수동 수정 |
| 같은 이슈 2회 반복 | 에스컬레이션 — "규칙 불명확 또는 에이전트 한계, 수동 확인 필요" |

### 추가 지시 재하달 포맷
PACKET 하단에 append (삭제 후 재생성 금지 — 내용 해시 변화로 채널 감지):

```markdown
## 추가 지시
1. [CRITICAL] {validator 재하달 지시 그대로}
2. [HIGH] {항목}
```

---

## 10. 실수 누적 로그

각 REPORT의 `## 실수노트`를 wave-integrate 시 아래에 append:

```
.claude/planning-logs/
├── pm-log.md
├── design-log.md
└── figma-log.md
```

포맷:
```markdown
## {YYYY-MM-DD} · {N}차 웨이브 · {Jira}
{실수노트 내용 — "없음"도 기록}
```

다음 wave-prep 시 해당 채널 로그 최신 3개를 PACKET `## 이전 실수 주의`에 포함.
반복 패턴이 3회 이상이면 해당 규칙 파일에 금지 패턴으로 추가 요청.
