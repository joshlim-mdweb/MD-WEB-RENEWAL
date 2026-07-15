기획 웨이브를 준비하고 실행한다 (오케스트레이터 전용).
스코프 정의 → pm·design·figma 순차 게이트 → Gate 3 자동 크로스체크 → Gate 4 최종 확인까지 한 번에.
창구는 `requirements/waves/active/` 의 PACKET/REPORT 파일이다.

포맷 기준: `.claude/rules/planning-packet.md`

---

## Step 0 — 전제 확인

1. **진행 중 wave 없는가** — `requirements/waves/active/` 에 PACKET-*.md 파일이 있으면 중단:
   "진행 중인 wave가 있어요 — `/orch` 로 현재 상태를 먼저 확인해주세요."

2. **planning-logs 로드** — 각 채널 최신 실수 3개 읽기:
   - `.claude/planning-logs/pm-log.md`
   - `.claude/planning-logs/design-log.md`
   - `.claude/planning-logs/figma-log.md`
   없거나 비어있으면 "없음"으로 처리.

3. **실패 카운터 초기화** — figma 채널 재하달 횟수를 0으로 시작 (Step 4에서 추적).

---

## Step 1 — Wave 스코프 정의

Josh로부터 아래를 확인한다. 대화에서 이미 언급됐으면 재확인 생략.

```
- 피처명:
- Jira 티켓:
- 대상 화면/섹션 목록:
- 정책 파일: docs/policy/{파일명} (복수 가능)
- Figma: file={key} / page={page} / 섹션={section}
- 참조 프레임 ID: (clone 소스 있으면)
- 작업 범위: STRUCTURE / FEATURE / CASE VIEW (해당 항목 선택)
```

스코프를 아래 형식으로 출력하고 Josh 확인을 기다린다:

```
[Wave 스코프 확인]
피처:    {피처명} ({Jira})
화면:    {목록}
채널:    pm → design → figma
Figma:   {file}/{page}/{섹션}
정책:    {파일명 목록}

→ 이 스코프로 진행할까요?
```

Josh OK 없이 Step 2 진행 금지.

---

## Step 2 — pm PACKET 하달 + Gate 1

### 2-1. PACKET-pm.md 작성

`requirements/waves/active/PACKET-pm.md` 를 `planning-packet.md §1 pm-PACKET` 포맷으로 작성.
`## 이전 실수 주의` 에 pm-log.md 최신 3개 항목 포함.

### 2-2. md-pm 에이전트 호출

```
Agent(md-pm):
  "requirements/waves/active/PACKET-pm.md 를 읽고 그대로 이행하라.
   완료 시 requirements/waves/active/REPORT-pm.md 를 planning-packet.md §2 포맷으로 작성하라."
```

md-pm이 REPORT-pm.md를 작성하면 수거한다.

### 2-3. Gate 1 — design이 PRD 검토

md-pm과 **별도 Agent 호출**로 md-design을 Gate 1 검토자로 사용한다:

```
Agent(md-design):
  "requirements/waves/active/REPORT-pm.md (PRD 초안) 을 읽고
   planning-packet.md §3 design-PACKET의 [검토 지시] 항목만 수행하라.
   결과를 아래 포맷으로 반환하라:
   - Gate 1 판정: PASS | FAIL
   - 이슈 목록 (심각도·PRD 섹션·정책 근거)
   - PRD 재작업 필요 항목 (있을 때만)"
```

**Gate 1 판정:**
- PASS → Step 3 진행
- FAIL (CRITICAL/HIGH 이슈 있음) → PACKET-pm.md 하단에 `## 추가 지시` append 후 2-2 재실행
  - 재하달은 1회만. 2회 연속 FAIL → Josh에게 에스컬레이션 후 대기

---

## Step 3 — design PACKET 하달 + Gate 2

### 3-1. PACKET-design.md 작성

`requirements/waves/active/PACKET-design.md` 를 `planning-packet.md §3 design-PACKET` 포맷으로 작성.
`## 입력 참조` 에 `REPORT-pm.md` 경로 포함.
`## 이전 실수 주의` 에 design-log.md 최신 3개 항목 포함.

### 3-2. md-design 에이전트 호출

```
Agent(md-design):
  "requirements/waves/active/PACKET-design.md 를 읽고 그대로 이행하라.
   완료 시 requirements/waves/active/REPORT-design.md 를 planning-packet.md §4 포맷으로 작성하라."
```

### 3-3. Gate 2 — PRD ↔ UX 일치 확인 (오케스트레이터 직접)

REPORT-design.md를 읽고 아래를 확인한다:
- PRD 재작업 요청 항목이 있는가 → 있으면 pm 재하달 후 design 재실행
- Figma 진입 체크 4항목이 모두 체크됐는가
- 이슈 전부 정책 파일 근거가 있는가

**Gate 2 판정:**
- PASS → Step 4 진행
- FAIL → pm 재하달 or 오케스트레이터 직접 수정 후 design 재실행

---

## Step 4 — figma PACKET 하달 + Gate 3 (핵심)

### 4-1. PACKET-figma.md 작성

`requirements/waves/active/PACKET-figma.md` 를 `planning-packet.md §5 figma-PACKET` 포맷으로 작성.
- `## 입력 참조` 에 REPORT-pm.md + REPORT-design.md 경로 포함
- `## 이전 실수 주의` 에 figma-log.md 최신 3개 항목 포함
- 재하달이면 `## 추가 지시` 에 validator 재하달 지시 초안 그대로 붙여넣기

### 4-2. figma 실행 — 단일 터미널 vs 별도 터미널

**단일 터미널 (기본):**
```
Agent(md-figma):
  "requirements/waves/active/PACKET-figma.md 를 읽고 그대로 이행하라.
   figma-read.md → figma-description.md → figma-draw.md 파이프라인 필수.
   완료 시 requirements/waves/active/REPORT-figma.md 를 planning-packet.md §6 포맷으로 작성하라.
   screenshot 없이 완료 선언 금지."
```

**별도 터미널 (Josh가 md-figma를 다른 창에서 실행할 때):**
PACKET-figma.md 작성 후 아래 워처를 `run_in_background` 로 실행:

```bash
while true; do
  if [ -f "requirements/waves/active/REPORT-figma.md" ]; then
    echo "FIGMA_DONE: $(date)"
    exit 0
  fi
  sleep 30
done
```

워처가 깨우면 → REPORT-figma.md 수거 후 Gate 3 진행.
Josh에게: "별도 터미널에서 md-figma를 실행하고 PACKET-figma.md 대로 진행해주세요."

### 4-3. Gate 3 — wf-validator + desc-validator 병렬 크로스체크

figma REPORT 수거 직후 **두 validator를 병렬로 동시 호출**한다:

```
Agent(wf-validator) + Agent(desc-validator) — 동시 실행
  각자: "requirements/waves/active/PACKET-figma.md 와 REPORT-figma.md 를 읽고
         planning-packet.md 포맷으로 각각 REPORT-wf-validator.md / REPORT-desc-validator.md 를 작성하라."
```

두 REPORT 수거 후 집계:

| 판정 조합 | 처리 |
|---|---|
| wf PASS + desc PASS | Gate 4 진행 |
| 어느 쪽이든 CRITICAL/HIGH 있음 | 재하달 → 4-1로 돌아감 (실패 카운터 +1) |
| 실패 카운터 = 2 | 에스컬레이션 — Josh에게 수동 확인 요청 후 대기 |
| LOW만 있음 | Gate 4 진행 + LOW 항목 오케스트레이터 노트에 기록 |

재하달 시 PACKET-figma.md `## 추가 지시` 에 validator 재하달 지시 초안을 **그대로** 붙여넣는다 (요약·수정 금지).

---

## Step 5 — Gate 4: 오케스트레이터 최종 확인

모든 REPORT를 읽고 아래 항목을 순서대로 확인한다:

```
[ ] REPORT-wf-validator.md: PASS
[ ] REPORT-desc-validator.md: PASS
[ ] REPORT-figma.md screenshot: 육안으로 PACKET 명세와 일치
[ ] LOW 이슈: 오케스트레이터 노트에 기록했는가
[ ] figma-log.md 실수노트 반복 패턴: 3회 이상이면 규칙 파일 추가 요청 필요
```

**Gate 4 판정:**
- 전항목 OK → `/wave-integrate` 진행 안내
- 육안 불일치 발견 → 해당 항목 targeted 재하달 (Gate 3부터 재실행)

---

## Step 6 — 오케스트레이터 메모 출력

Wave 완료 후 아래를 출력한다:

```
[Wave {N} 완료 준비]
pm:     REPORT-pm.md ✅
design: REPORT-design.md ✅
figma:  REPORT-figma.md ✅  |  STRUCTURE: {node-id}  FEATURE: {node-id}
Gate 3: wf ✅ / desc ✅
Gate 4: ✅

LOW 이월:
  {항목 있으면} / 없음

figma 실수 패턴 주의:
  {figma-log에서 반복 3회 항목} / 없음

→ /wave-integrate 로 산출물을 정리하세요.
```
