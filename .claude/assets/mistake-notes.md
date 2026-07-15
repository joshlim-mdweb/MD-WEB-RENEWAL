# 실수노트 — Figma WF 작업

---

## 2026-05-18

### [1] 정책 변경 후 annotation 미업데이트

**상황**: License ID의 License/Billing 탭 정책이 "접근 불가(X)" → "제한적 접근(O*)"으로 변경됨. 그런데 WF2 Account (License ID)의 License ID Banner annotation에는 기존 문구인 **"License/Billing 탭은 License ID 접근 불가"** 가 그대로 남아있었음.

**원인**: annotation 작성 후 정책이 바뀌면 관련 annotation을 모두 찾아 동시에 업데이트해야 하는데, 누락됨.

**재발 방지**: 정책 변경 시 변경된 항목과 관련된 annotation을 모두 grep 후 일괄 수정. 정책 변경 = annotation 검토 세트.

---

### [2] clearAnnotations를 잘못된 컨텍스트에 적용

**상황**: STRUCTURE_COMPANY_ID 신규 프레임 5개(WF1, WF3, WF3b, WF4, WF5)를 STRUCTURE_INDIVIDUAL에서 clone 후 annotation이 전부 0개.

**원인**: clone 시 clearAnnotations를 일괄 적용함. clearAnnotations는 STRUCTURE → FEATURE 이동 시에만 써야 하는데, 같은 STRUCTURE 섹션 내 MemberType별 분리 clone에도 적용해버림.

**재발 방지**: clearAnnotations 사용 전 컨텍스트 확인 필수.
- STRUCTURE → FEATURE clone: clearAnnotations 적용 O
- STRUCTURE → STRUCTURE (같은 유형 MemberType 분리): clearAnnotations 금지. annotation 유지 후 내용만 수정.

---

### [3] 공통 LNB annotation 전 프레임 중복 삽입 + 내용 오류

**상황**: LNB 탭 노출 조건 annotation을 Individual WF1~WF5, WF3b, Company ID, License ID 전 프레임의 SNB 노드에 동일 내용으로 반복 삽입. 그런데 해당 내용에 오류가 있었음:
- `License/Billing: Company ID / Academic / Indie 미노출` → **오류**. 정책상 Company ID도 O.
- `Shared License: 전체 MemberType` → **오류**. 정책상 △(Userpool Guest 시만).

**원인**: annotation을 복사-붙여넣기 방식으로 전 프레임에 넣으면서 내용 검증 없이 진행. 수정 시에도 모든 프레임을 일일이 수정해야 하는 구조.

**재발 방지**: 탭 노출 조건 같은 공통 정보는 STRUCTURE_COMMON Title 카드 annotation 1곳에만 기술. 개별 프레임에 반복 삽입 금지.

---

### [4] WF3 License/Billing (License ID) — Individual용 annotation 그대로 방치

**상황**: License ID WF3의 License Information annotation + Sub-tab Bar annotation이 Individual용 내용(Stop Subscription / Undo Pause / Resume Now / Retry Payment / Cancel Subscription / Cancel Trial CTAs + Invoices 서브탭) 그대로 남아있었음.

**원인**: WF3 License ID 프레임 생성 시 화면 UI는 License ID에 맞게 수정했지만, annotation은 clone 원본인 Individual용이 그대로 남아 있었음.

**재발 방지**: clone 후 UI 수정과 동시에 annotation도 반드시 검토. 특히 CTA 및 접근 제한이 달라지는 MemberType 전용 프레임은 annotation 필수 재작성.

---

### [6] 아이콘을 유니코드 문자로 대체 — SVG 아이콘 미사용

**상황**: 드롭다운 필드에 체브론 아이콘이 필요할 때, 프로젝트에 저장된 SVG 아이콘(`wireframe-icons.json`)을 쓰지 않고 유니코드 문자 `▾`를 텍스트 노드로 삽입함.

**원인**: SVG 아이콘 파일의 존재를 확인하지 않고 즉흥적으로 유니코드 대체.

**재발 방지**: 아이콘이 필요할 때는 반드시 `.claude/assets/wireframe-icons.json` 먼저 확인.
- 파일 구조: `{ "카테고리 / 아이콘명": "<path ... />" }` 형태의 SVG path 모음
- 체브론: `Arrow / Chevron_Down`, `Arrow / Chevron_Up`, `Arrow / Chevron_Left`, `Arrow / Chevron_Right`
- 사용법: `figma.createNodeFromSvg(svgStr)` 으로 벡터 노드 생성 후 크기 지정
- 유니코드 문자(▾ ▸ › 등) 아이콘 대체 **절대 금지**

---

---

## 2026-05-19

### [7] FEATURE clone 시 clearAnnotations 미실행 — annotation 오염

**상황**: FEATURE_TOAST 프레임 6개를 FEATURE end-state 프레임에서 clone할 때 `clearAnnotations()`를 실행하지 않음. 원본 FEATURE 프레임의 annotation (→ 버튼 클릭 시 결과 등)이 TOAST 프레임에 그대로 복사됨.

**원인**: clone 후 clearAnnotations를 실행해야 한다는 규칙이 "STRUCTURE → FEATURE" 맥락에서만 기억됨. FEATURE → FEATURE_TOAST clone에도 동일하게 적용해야 하는데 누락됨.

**재발 방지**: clone 대상이 무엇이든 새 섹션에 넣는 clone은 clearAnnotations 필수. 맥락 관계없이 "새 섹션에 들어가는 clone = clearAnnotations 실행"으로 규칙 단순화.

---

### [8] 작업 전 기존 Screen 상태 미검증 — 중복 레이어 발생

**상황**: Task 7(FEATURE 모달 오버레이 적용)에서 CLO-SET Disconnect 2 Screen에 dim + modal card를 추가했는데, 해당 프레임에 이미 기존 dim(Rectangle) + modal card(Frame)가 있었음. 중복으로 두 개의 dim + 두 개의 modal card가 쌓임.

**원인**: 모달 추가 전 Screen의 기존 children을 확인하지 않고 바로 append 실행. `figma-wireframe-protocol.md` "수정 전 현재 값 확인" 규칙 위반.

**재발 방지**: FEATURE 프레임에 새 요소 추가 전 반드시 Screen children 목록 먼저 조회. 기존에 dim/modal/overlay 성격의 노드가 있으면 제거 후 추가.

---

### [9] 용어 오해로 완전히 다른 결과물 생성

**상황**: 사용자가 "toast message" 섹션을 요청했는데 "tooltip" 오버레이 섹션으로 해석해서 FEATURE_TOOLTIP을 만들었음. 삭제 후 FEATURE_TOAST로 재작업.

**원인**: 명확히 다른 두 UI 패턴(toast = 하단 일시 알림, tooltip = 호버 팝오버)을 혼동. 불확실할 때 확인 없이 추측으로 진행.

**재발 방지**: UI 패턴 용어가 모호하거나 처음 나오는 경우 작업 전 의도 확인. "toast/tooltip/snackbar/popover" 등은 서로 다른 컴포넌트 — 추측 금지.

---

### [5] WF2 Account (License ID) — Danger Zone annotation 오류

**상황**: License ID는 Danger Zone 카드 자체가 미노출인데, WF2 Account (License ID)에 Danger Zone annotation이 그대로 있었음. 내용도 "Delete Account (Individual만) / Move License Admin (Company ID만)"으로 기술됨.

**원인**: clone 후 Danger Zone 카드 UI는 화면에서 숨겼지만 annotation은 삭제하지 않음.

**재발 방지**: 화면에서 제거한 요소의 annotation은 반드시 함께 삭제하거나 "License ID: 미노출" 로 명시적으로 수정.
