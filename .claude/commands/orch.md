오케스트레이터 세션의 현재 상태를 복구한다.
`/clear` 직후·새 터미널·"지금 몇 번째 wave이고 어느 단계인지" 헷갈릴 때 진입점.
읽기 전용 — 아무것도 수정하지 않는다.

---

## Step 1 — 진행 중 Wave 확인

```bash
ls requirements/waves/active/ 2>/dev/null
```

**파일 없음** → "진행 중인 wave 없음. `/wave-prep` 으로 새 wave를 시작하세요."

**파일 있음** → 아래 Step 2~3 진행.

---

## Step 2 — 단계 판정

active/ 에 있는 파일 조합으로 현재 단계를 판정한다.

| 파일 조합 | 단계 | 상태 |
|---|---|---|
| PACKET-pm만 있음, REPORT-pm 없음 | pm 실행 중 | md-pm 작업 중 |
| REPORT-pm 있음, PACKET-design 없음 | Gate 1 대기 | design 검토 필요 |
| PACKET-design 있음, REPORT-design 없음 | design 실행 중 | md-design 작업 중 |
| REPORT-design 있음, PACKET-figma 없음 | Gate 2 대기 | 오케스트레이터 확인 필요 |
| PACKET-figma 있음, REPORT-figma 없음 | figma 실행 중 | md-figma 작업 중 |
| REPORT-figma 있음, validator REPORT 없음 | Gate 3 대기 | validator 호출 필요 |
| validator REPORT 둘 다 있음, FAIL | Gate 3 FAIL | figma 재하달 필요 |
| validator REPORT 둘 다 PASS | Gate 4 대기 | 오케스트레이터 최종 확인 |

---

## Step 3 — 상태 리포트 출력

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 오케스트레이터 상태 복구
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

진행 중 Wave:  {Jira} {피처명} (PACKET-pm.md에서 읽기)
현재 단계:     {판정 결과}
재하달 횟수:   figma {N}회 (PACKET-figma.md ## 추가 지시 개수로 추산)

파일 현황
  PACKET-pm        {있음 ✅ | 없음 —}
  REPORT-pm        {있음 ✅ | 없음 ⏳}
  PACKET-design    {있음 ✅ | 없음 —}
  REPORT-design    {있음 ✅ | 없음 ⏳}
  PACKET-figma     {있음 ✅ | 없음 —}
  REPORT-figma     {있음 ✅ | 없음 ⏳}
  REPORT-wf-val    {PASS ✅ | FAIL ❌ | 없음 ⏳}
  REPORT-desc-val  {PASS ✅ | FAIL ❌ | 없음 ⏳}

다음 액션:     {판정에 따른 안내}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**다음 액션 안내 예시:**

| 단계 | 다음 액션 |
|---|---|
| md-pm 작업 중 | "md-pm이 REPORT-pm.md를 작성하면 자동 수거됩니다. 별도 터미널이면 완료 후 알려주세요." |
| Gate 1 대기 | "`/wave-prep Step 2-3` — Gate 1 검토를 실행하세요." |
| Gate 3 FAIL | "`/wave-prep Step 4-1` — figma 재하달을 실행하세요. (재하달 {N}회)" |
| Gate 4 대기 | "validator REPORT 두 개 다 PASS. 육안 확인 후 `/wave-integrate` 를 실행하세요." |
| figma 별도 터미널 | "md-figma가 작업 중이면 REPORT-figma.md 생성 후 알려주세요." |

---

## Step 4 — 별도 터미널 figma 워처 재가동 (선택)

진행 중 wave가 있고 REPORT-figma.md 가 아직 없으며 별도 터미널 모드이면,
Josh 요청 시 워처를 `run_in_background` 로 재가동한다:

```bash
while true; do
  if [ -f "requirements/waves/active/REPORT-figma.md" ]; then
    echo "FIGMA_DONE: $(date)"
    exit 0
  fi
  sleep 30
done
```

워처가 깨우면 → Gate 3 (wf-validator + desc-validator 병렬) 즉시 실행.
