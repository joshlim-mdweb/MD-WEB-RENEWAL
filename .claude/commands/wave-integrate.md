wave-prep의 Gate 4 확인 후 산출물을 정리한다 (오케스트레이터 전용).
실수노트 누적 → Wave 로그 작성 → 파일 아카이브 → Jira 동기화 → 다음 wave 준비 안내.

포맷 기준: `.claude/rules/planning-packet.md`

---

## Step 0 — 전제 확인

아래가 전부 충족돼야 한다. 하나라도 없으면 중단 후 보고.

```bash
ls requirements/waves/active/REPORT-pm.md
ls requirements/waves/active/REPORT-design.md
ls requirements/waves/active/REPORT-figma.md
ls requirements/waves/active/REPORT-wf-validator.md
ls requirements/waves/active/REPORT-desc-validator.md
```

- REPORT-wf-validator.md 판정이 PASS인가
- REPORT-desc-validator.md 판정이 PASS인가
- Gate 4 Josh 확인이 완료됐는가 (wave-prep Step 5 통과)

미충족 항목이 있으면: "Gate 4가 아직 완료되지 않았어요 — `/wave-prep` 상태를 확인해주세요."

---

## Step 1 — Wave 번호 결정

```bash
ls requirements/waves/archive/ | grep "^wave-" | sort -V | tail -1
```

마지막 wave 번호 + 1 = 이번 wave 번호. archive/ 가 비어있으면 wave-01.

---

## Step 2 — 실수노트 수집 + 로그 누적

각 REPORT의 `## 실수노트` 를 읽고 해당 채널 로그에 append한다.
"없음" 항목도 기록한다 (패턴 부재도 데이터).

**pm-log.md append:**
```markdown
## {YYYY-MM-DD} · wave-{N} · {Jira}
{REPORT-pm.md의 ## 실수노트 내용}
```

**design-log.md append:**
```markdown
## {YYYY-MM-DD} · wave-{N} · {Jira}
{REPORT-design.md의 ## 실수노트 내용}
```

**figma-log.md append:**
```markdown
## {YYYY-MM-DD} · wave-{N} · {Jira}
{REPORT-figma.md의 ## 실수노트 내용}

Figma 실행 로그:
{REPORT-figma.md의 ## Figma 실행 로그 내용}
```

**반복 패턴 감지:**
각 로그에서 같은 실수가 3회 이상 등장하면:
```
⚠️ 반복 패턴 감지 — figma-log.md
"clone 후 clipsContent 미설정" 3회 반복
→ .claude/rules/figma-draw.md §10 절대 금지 패턴에 추가 필요
Josh에게 규칙 파일 업데이트 제안
```

---

## Step 3 — Wave 로그 작성

`docs/backlog/waves/wave-{N}.md` 를 작성한다.
(디렉토리 없으면 생성)

```markdown
# Wave {N} — {피처명} ({Jira})

날짜: {YYYY-MM-DD}
채널: pm → design → figma
Gate 3 재하달: {횟수}회

## 한 줄 요약
{무엇을 기획했는가}

## 산출물
- PRD: requirements/waves/archive/wave-{N}/prd-draft.md
- Figma STRUCTURE: {node-id}
- Figma FEATURE: {node-id 목록}

## Gate 결과
- Gate 1 (PRD 검토): PASS | {재하달 N회}
- Gate 2 (UX 일치): PASS
- Gate 3 wf-validator: PASS | FAIL→재하달→PASS
- Gate 3 desc-validator: PASS | FAIL→재하달→PASS
- Gate 4 (최종): PASS

## 주요 판단과 근거
{이번 wave에서 내린 정책·UX·Figma 결정 + 이유}
예: "CASE VIEW 프레임 추가 — MemberType 7종 분기가 STRUCTURE 단일 프레임으로 표현 불가"

## Gate 3 이슈 요약
(wf/desc validator 재하달이 있었으면)
- {이슈 항목}: {해소 방법}

## 실수노트 요약
- pm: {없음 | 항목}
- design: {없음 | 항목}
- figma: {없음 | 항목}

## 다음 wave에 넘기는 것
{미완료 항목, 후속 필요 화면, 정책 미결 항목}
```

---

## Step 4 — 파일 아카이브

```bash
mkdir -p requirements/waves/archive/wave-{N}
mv requirements/waves/active/PACKET-pm.md requirements/waves/archive/wave-{N}/
mv requirements/waves/active/REPORT-pm.md requirements/waves/archive/wave-{N}/
mv requirements/waves/active/PACKET-design.md requirements/waves/archive/wave-{N}/
mv requirements/waves/active/REPORT-design.md requirements/waves/archive/wave-{N}/
mv requirements/waves/active/PACKET-figma.md requirements/waves/archive/wave-{N}/
mv requirements/waves/active/REPORT-figma.md requirements/waves/archive/wave-{N}/
mv requirements/waves/active/REPORT-wf-validator.md requirements/waves/archive/wave-{N}/
mv requirements/waves/active/REPORT-desc-validator.md requirements/waves/archive/wave-{N}/
```

`prd-draft.md` 가 active/ 에 있으면 함께 이동.
이동 후 active/ 가 비어있는지 확인:

```bash
ls requirements/waves/active/
```

잔여 파일 있으면 목록 출력 후 Josh 판단 요청.

---

## Step 5 — Jira 동기화

PACKET-pm.md에서 Jira 티켓 번호 읽기.
`mcp__atlassian__addCommentToJiraIssue` 로 아래 코멘트 추가:

```
[Wave {N} 기획 완료]
- PRD: requirements/waves/archive/wave-{N}/prd-draft.md
- Figma STRUCTURE: {Figma URL with node-id}
- Figma FEATURE: {Figma URL with node-id}
- Gate 3 재하달: {N}회
- 실수 패턴 감지: {없음 | 항목}
```

Jira 연결 실패 시: 코멘트 내용을 출력하고 Josh가 직접 추가하도록 안내.

---

## Step 6 — 완료 보고

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Wave {N} 완료 — {피처명} ({Jira})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

산출물
  PRD:    requirements/waves/archive/wave-{N}/prd-draft.md
  Figma:  STRUCTURE {node-id} / FEATURE {node-id}
  로그:   docs/backlog/waves/wave-{N}.md

Gate 3 재하달:  {N}회
실수 패턴 감지: {없음 | ⚠️ 항목 → 규칙 파일 업데이트 필요}

planning-logs 업데이트:
  pm-log.md     ✅
  design-log.md ✅
  figma-log.md  ✅

다음 wave에 넘기는 것:
  {없음 | 항목 목록}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
requirements/waves/active/ 비어있음 — 다음 wave 준비됐어요.
```

반복 패턴 감지가 있으면:
```
⚠️ 규칙 파일 업데이트 권고
  {로그 파일}: "{실수 내용}" {N}회 반복
  → .claude/rules/{해당 파일} §절대 금지 패턴에 추가하세요.
```
