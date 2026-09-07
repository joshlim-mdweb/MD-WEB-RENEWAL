---
project: claude-workflow
updated: 2026-09-03
---

## 2026-09-03 신규
- **Claude Code 피드백 초안 큐 동작 파악**: 세션이 SendFeedback으로 만든 초안은 `~/.claude/feedback/drafts/*.json`에 `queued` 상태로 저장되고 `/clear`로는 사라지지 않는다. 처리 방법은 두 가지: 박스가 뜬 터미널에서 키 입력(1 리뷰, 2 전송, 0 버리기) 또는 `/feedback` 커맨드로 전송. 큐 파일만 지우면 초안을 만든 원 세션이 메모리로 박스를 다시 그린다

## 2026-09-01 신규
- **Figma 규격 통합 — 루트 `spec.md`(1.7.00) + `spec-visual.md`(1.1.00) 정본 체계 확립** — 기존 figma 룰 7종 스텁화, 5대 변경(Screen Auto Layout 등), 기획 문서 3종(PRD·기능명세·Version Table), 버전 체계 x.x.xx, 시안 아티팩트 2종
- **User Flow 에디터 구축** — /flowchart 스킬의 FlowKit 렌더러 + 편집 레이어 병합, SHELL/DATA 자가 저장 패턴, 저장 루프 실검증 완료 (셸 바이트 무결, 데이터 무손실 왕복)
- **용어 확정** — "원장" 전면 금지 (docs/policy = "정책 문서"). 메모리 등재, 규칙 파일 등재는 아래 규칙 제안 참조

## 2026-08-19 신규
- **Manager 세션 — TODO.md ↔ 세션 task list 최초 동기화** — 세션 진입 시 task list가 비어 있어 TODO.md의 `T-01-8·T-02~05·F-01~05` 10건을 전부 새로 생성해 맞췄다. Josh 지시로 T-04(튜토리얼)·T-05(교육기관 인증)를 한 행으로 병합 (`MDWEB-871 · MDWEB-900`)
- **리뉴얼 3축(Product&Policy / UI·UX / 개발) 발표자료 준비 — 별도 세션(Ticket Manager)과 진행 중이던 것을 이 세션으로 이관** — `docs/backlog/projects/*.md` 14개 + `docs/policy/**` 전수 조사해 리뉴얼 스코프 11개 항목 매트릭스 초안 작성. Account Structure AS-IS→TO-BE 10항목 표 작성
- **Jira 조사로 `MDWEB-634 "2026 | Website Renewal"` 마스터 에픽 발견** — 기존에 TODO.md가 추적하던 `T-`(870·868·773·871·900·873) 개별 UX 에픽과는 별도로, 개발 축 전체가 이 에픽 하나에 걸려 있었다. 하위 15건(인프라 셋업·GA 재설계·로그인 리서치·Features 페이지 S1~S8·계정 정책 사이드이펙트 스캔 등) 확인. Student Plan Renewal(MDWEB-773) 밑에는 내용 없는 빈 껍데기 3건(PD/FE/BE)만 존재
- **출력 압축 실패 — Josh 재지시 발생** — "쭉 읽어보고 정리해줘"를 조사 결과 전체 상세 리포트로 응답했다가, Josh가 "아오 그니까 걍 스콥 내가 발표할 문장이나 타이틀만 말해주라니까"라고 지적. 최종적으로 축당 한 줄 타이틀 4개로 재압축해 종료 (아래 완료 로그 · `mistakes.md` 참조)

## 2026-08-18 신규
- **Task Manager 실운영 — MDWEB-870 문서 축 전체 사이클 라이브 관찰** — Planner·PolicyWriter·Manager 3세션이 하루 동안 T-01-3~T-01-9까지 배정→진행중→검토대기→재작업→완료를 여러 번 순환하는 것을 알림 수신 시마다 TODO.md 재읽기로 관찰. `기획 워크플로우 (2026-08-11 신규)` TODO 2·3번(알림 실사용 검증·1사이클 검증)이 이번에 실증됨 — 아래 완료 로그 참조
- **TaskManager 능동 대조 방식 확립** — Josh 요청으로 알림을 그대로 옮기지 않고 TODO.md 재독 + 실제 산출물(`docs/policy/checkout.md`) 대조로 전환. 이 과정에서 실제 정책 문서 결함 2건을 알림-반영 이전에 선제 발견 (§6 Order Summary 배치 모순, §7.3 `policy-writing.md` 금지 패턴 재생산) — 둘 다 이후 Planner 검수에서 동일하게 지적되어 교차검증됨
- **TODO.md 상태값 enum 이탈 발견** — F-04·F-05가 정의된 5개 상태값(`대기·진행중·검토대기·완료·보류`)에 없는 `재작업 필요`를 도입. 세션 끝까지 미해결

## 2026-08-11 신규
- **`/overtime` 스킬 신설** (`.claude/skills/overtime/SKILL.md`) — 야근 일지 Canvas `F0BNWCDB163` 자동 기입. plan/done 2모드, 30분 단위 검증, Overtime 버림 계산, 리더 컬럼 기입 금지. 테스트 완료
- **`slackrequest` Step 3-1 변경 지점 필터 추가** — 변경 지점 없는 건(조언·현황 확인·검토 문의) 티켓화 금지. 제외 건은 사유와 함께 표기
- **기획 워크플로우 전면 개편 — wave 폐지 → Planner 허브** (`.claude/rules/planner-workflow.md`) — 역할별 터미널 커맨드 7개 신설, `requirements/board/TODO.md` 단일 투두리스트. 삭제: `/wave-prep`·`/wave-integrate`·`/orch`·`planning-packet.md`·`.claude/planning-logs/`
- **세션 간 알림 규약** — `ListAgents`/`SendMessage`로 터미널 간 통신 검증 완료. 폴링 루프 불필요. Planner=액션 라우팅 / TaskManager=가시성 2축 분리
- **MDWEB-870 이관** — `requirements/waves/active/` → `requirements/mdweb-870-checkout/` (7파일 무손실, git rename 추적)

## 관련 Jira 티켓
- 없음 (내부 툴링 작업)

## TODO
### Figma 규격 체계 후속 (2026-09-01 신규)
1. **User Flow 에디터 실편집 검증** — 오늘은 무변경 저장만 확인됨. 실제로 노드 이동과 라벨 수정 후 저장 → 세션에서 diff 회수까지 1회 돌린다
2. **다음 페이지 착수 시 문서 3종 첫 실전 작성** — `spec.md` §9.7 템플릿으로 PRD, 기능명세, Version Table을 만들고 규격이 실전에서 버티는지 검증. 페이지 코드는 §9.5 등록표에 행 추가
3. **역할 커맨드 본문을 spec.md 정본과 대조** — `/figma-description` 등이 구 함수(`applyBullets`) 필수라고 적혀 있어 잘못된 근거를 재확인시킴 (mistakes 09-01 1차). `applyRichDescription`과 spec.md 참조로 갱신
4. **기존 룰 스텁 상태 점검** — 전역 `~/.claude/rules/figma-description.md`는 CLO-SET, CLOVER-ADMIN용으로 내용 유지 중. 타 프로젝트 세션이 MD-WEB spec.md 배너를 잘 타는지 확인
5. **Figma 벡터 User Flow 렌더러(buildUserFlow)는 보류** — Figma 안 직접 수정이나 화면 ID 하이퍼링크가 필요해지면 그때 구축 (spec.md §9.8)

### 기획 워크플로우 (2026-08-18 갱신)
1. **F-01 WF 프레임 참조 표 정정** — `TODO.md` §F-01 번호 중복·Row 미갱신 상태 확인 필요 (09-01 3차 정리에서 해소됐는지 대조)
2. **상태값 enum에 `재작업 필요` 정식 등재 여부 결정** — F-04·F-05가 `planner-workflow.md` 정의에 없는 값을 씀
3. **`requirements/board/TODO.md` git 커밋 여부 결정** — 워크플로우의 유일한 진실 소스가 untracked
4. **세션명 표기 통일** — `Policy`/`PolicyWriter`, 소문자 세션명 혼재
5. **`.claude/settings.local.json` 스테일 permission 정리** — `requirements/waves/active` 등 잔존

### 라이팅 룰 마무리 (2026-08-07 신규)
1. **`policy-writing.md` §5.1 부정문 트리거 1번 삭제** — 레거시 비교 금지와 정면 충돌
2. **Auto Renew 잔존 제거** — `policy-writing.md:113-114`, `docs/policy/plan.md:51-55`, `mypage.md:196,205,405` 등 문자열 0건 만들기 + 폐지 용어 표 등재 (figma-wireframe-ds는 스텁화로 해소됨)
3. **Canvas §3 Individual 개정 반영** — section ID 재조회 후 반영, 통과 시 §4~§9 확대
4. `/copy-review` 실사용 검증 — 자동 호출 안 걸리면 `UserPromptSubmit` 훅 도입 검토

### AI 워크플로우 발표 준비
1. `docs/backlog/ai-pipeline-review.md`(1105줄) 기준 발표 슬라이드/시각화 제작
2. 매니지 축(Slack 트리아지, 버그 대응, 세션 관리) 상세 분석
3. Figma Plan 페이지 화면이 계정 구조 개편을 반영했는지 실물 확인

### 레포 정리
1. `.DS_Store` 등 gitignore 등재됐지만 tracked인 파일 `git rm --cached` 판단
2. `.vscode/`, `test-results/` 처리 방침 결정

### Flowchart Tool (localhost:3001 — User Flow 에디터와 별개 프로덕션 툴)
1. 브라우저에서 드래그 연결 동작 최종 확인 (hover zone 수정 후 미검증)
2. 집에서 standalone으로 재구현 — `docs/flowchart-tool-reference.md` 참조
3. 기존 Supabase 세션 데이터 마이그레이션 검토 (col/row → step/track 구 포맷 잔존)
4. 더블클릭 빈 영역 → 노드 추가 동작 확인

## 컨텍스트
### Figma 규격 통합 (2026-09-01)

**발단**: 와이어프레임이 반복해서 규격을 벗어나게 만들어졌다 (Screen 절대좌표, 소수 gap이 HUG 타고 소수 높이 전파, Outer 규격 이탈 2448×1260). Josh가 5대 변경을 직접 지정하고, 세션 내에서 미결을 전부 결정해 규격을 완성했다.

**정본 체계**

| 파일 | 역할 |
|---|---|
| 루트 `spec.md` (1.7.00) | 구조 규격 정본: 파이프라인, 프레임 계층, 간격, 네이밍, Description, Annotation, 기획 문서 3종, 코드 패턴, QA |
| 루트 `spec-visual.md` (1.1.00) | 시각 토큰 정본: 컬러, 폰트, 컴포넌트 8종 값과 생성 함수 |
| `.claude/rules/figma-*.md` 7종 | 스텁 (spec.md로 리다이렉트). 전역 `figma-description.md`만 타 프로젝트용 내용 유지 + MD-WEB 배너 |

**핵심 결정 (전부 Josh 확정)**
- 5대 변경: ① Screen VERTICAL Auto Layout (NONE 폐기, Page 래퍼 제거, 오버레이 ABSOLUTE) ② 최상위 FIXED 폭 ③ 하위 FILL ④ 간격 §3.2 표만, 정수만 ⑤ Description 링크 파랑 #0066CC, 중요 SemiBold, 플래그 빨강 (검정은 desc.ink #18181E)
- 상위 워크플로우: 정책 문서 → 기획 → **기획 문서 3종** → Figma. 문서 없이 화면 착수 금지
- 문서 3종: PRD(문서형, 본문 콘텐츠 폭 전체 1792, 목차 7섹션 — Screen Structure는 **정보구조 Depth 표**, 기능·진입 경로 서술 금지), 기능명세(8컬럼: 케이스와 **사용자**(구 권한) 신설, 요구사항 ID 폐지), Version Table
- ID 체계 2계층: 화면 `CO-100-000`(-P01 팝업), 기능 `FC-CO-001`(페이지 단위, 화면 이동에도 불변). 페이지 코드 등록표: CO, MP, PL, AC, SO
- 버전 x.x.xx: Major 구조 / Minor 내용 / Patch 표기(2자리). 전부 기록, 등급별 공유 수준만 다름
- 관련 문서 블록: 문서 **제목 바로 아래**, 4종 (정책 문서, 정책 게시본 Slack Canvas, Figma, 티켓)
- 용어: **"원장" 전면 금지** (절대×3 강조) → "정책 문서"

**시안과 도구**
- 기획 문서 3종 시안: https://claude.ai/code/artifact/0a3c0a24-a628-43be-a192-1859f9ed7cbd (범용 템플릿 포함)
- 와이어프레임 규격 시안: https://claude.ai/code/artifact/c69a0b13-b532-447d-844b-a9f5a7d95ffd (실축척 16:9, 컴포넌트 라이브러리, 폰트와 spacing, Do/Don't)
- **User Flow 에디터**: https://claude.ai/code/artifact/7b03170c-f6e7-486c-9ebc-c0853b802dcd — 렌더링은 `/flowchart` SKILL.md의 FlowKit 원본(awk 추출, 에디터 후크 3개는 SKILL.md에 반영), 편집 레이어(드래그 스냅, 패널, 검사기 저장 잠금, undo, 복붙)만 에디터 소유. 저장은 SHELL/DATA 자기 재생산 패턴, 왕복 바이트 검증 통과. 재조립 조각: scratchpad `uf-head.html` + `flowkit.js` + `uf-tail.js` + `seed.json` (세션 소멸 시 게시본에서 SHELL 복원 가능)
- Figma 삽입: User Flow는 에디터의 차트별 이미지 복사(2x)로. 벡터 렌더러 보류

**교훈**: FlowKit이 이미 있는데 확인 없이 에디터를 처음부터 새로 만들었다가 Josh 지적 후 병합 재작업 (mistakes 09-01 4차). 렌더러·헬퍼·도구를 만들기 전에 `.claude/skills/`와 `.claude/rules/`부터 검색한다.

### 기획 워크플로우 개편 (2026-08-11)

**발단**: Josh가 터미널을 여러 개 띄워 병행 작업하는 방식이 굳어졌는데, 기존 wave 시스템(`/wave-prep` → pm→design→figma 순차 게이트)은 **한 세션이 순서대로 게이트를 통과시키는** 구조였다. 실제 작업 형태와 어긋났다.

폐지 근거는 이미 7/28 발표 준비 조사에 있었다 — 아래 "AI 워크플로우 발표 준비" 항목의 *"wave-prep이 이 프로젝트에 안 맞는 이유(개발 게이트 불필요)"*. 오늘 그 관찰을 실행으로 옮겼다. 결정적 증거는 `requirements/waves/archive/`가 **완전히 비어 있었다**는 것 — 1년치 작업에서 완주한 wave가 0건이다. `.claude/planning-logs/*.md` 3개도 헤더만 있는 빈 템플릿이었다.

**확정된 기준**

| 항목 | 결정 |
|---|---|
| 구조 | 피어 간 파일 핸드오프 → **2축**. 문서 축은 Planner 허브, Figma 축은 Josh 직접 통솔 |
| 축 경계 | Planner는 **문서까지**. 문서 완료 후 `F-` 행을 만들지 않고 Josh에게 넘긴다 |
| 투두리스트 소유권 | 행 ID 접두어로 구분 — **`T-` 문서 행 = Planner** / **`F-` Figma 행 = Josh**. 배정받은 역할은 `진행중`→`검토대기`까지만 |
| Task Manager | **읽기 전용.** 두 축 전체를 조망하는 Josh용 뷰. 재배정 요청은 소유자로 안내만 |
| 역할 간 직접 핸드오프 | **금지.** `T-`는 Planner, `F-`는 Josh를 거친다 — 취합 지점 소실 방지 |
| 통신 | 파일(`TODO.md`)이 진실, `SendMessage` 알림은 속도 개선. **폴링 금지** |
| 알림 경로 | **수신처 2곳** — Planner는 액션 라우팅(`T-`의 `검토대기`·`보류`만), TaskManager는 가시성(`진행중` 포함 전부). `F-`는 TaskManager에만 알린다 |
| 소스 | Jira `UX \|` 티켓 (기획 축). `PD\|/FE\|/BE\|`는 제외. 티켓 생성 안 함 |
| 실수 로그 | `mistakes.md` 하나로 통일 (planning-logs 3개는 빈 템플릿이라 폐기) |

**wave에서 흡수한 것** — 폐지가 아니라 이전이다. 이걸 잃으면 개편이 후퇴가 된다:
- 플랜 승인 게이트(구 Gate A) → `planner-workflow.md` §3 Phase A/B. PACKET/REPORT 파일 없이 대화로
- 커버 항목 체크리스트 → §3.3. 이때 신 계정 구조 반영(Non-Member/Member/Group Owner/SW Account — 구 MemberType 7종 폐기)
- 정책 문서 Appendix 신규 용어 표 → §3.4
- `wf-validator`/`desc-validator` → **삭제하지 않고** 경량화. PACKET/REPORT 의존 제거, 파일 안 쓰고 PASS/FAIL + 이슈 목록만 반환

삭제 직전 `planning-packet.md`의 미커밋 변경분에서 위 항목들을 발견해 옮겼다. 그냥 지웠으면 Phase A 승인 개념이 사라졌을 것이다.

**세션 간 통신 실측** — 룰을 쓰기 전에 실제로 보내서 확인했다:
- 첫 접촉에는 `[ref]` 해시 필요 (`TaskManager [43840d]`). 이름만 쓰면 거부되고 확인을 요구한다. 두 번째부터는 이름만으로 도달
- 세션명 매칭은 **대소문자 무관** (소문자 `taskmanager` → `TaskManager` 도달 확인)
- 이름 자체는 정확해야 함 — `Policy` 세션을 `PolicyWriter`로 부르면 실패
- 갓 띄운 세션은 turn을 한 번도 안 돌리면 `ListAgents`에 안 잡히는 것으로 보임

**설계 오류 3건 (Josh 지적으로 수정)**
1. 초안은 `Planner → Josh (세션 안에서 보고)`였다. Josh가 Planner 터미널을 보고 있어야만 성립 → TaskManager를 뷰로 쓰는 전제와 모순. Planner→TaskManager 알림 추가
2. 그래도 **`진행중` 착수는 아무도 알림을 안 받는 구멍**이 남아 있었다. Figma Wireframe이 지금 무슨 프레임을 그리는지 Josh가 알 수 없다. 역할 전원이 착수 시 TaskManager에 알리도록 수정
3. 초안은 Figma까지 Planner가 배정하는 구조였다. Josh가 **"Figma는 내가 직접 통솔, 너희끼리는 문서까지"**로 범위를 그었다 → `T-`/`F-` 접두어로 소유권 분리. 추적은 TODO.md에서 계속하되(TaskManager가 전체를 봐야 함) 배정·리뷰 주체만 나눴다

**MDWEB-870 상태 발견** — 이관 중 조사 결과:
- `policy-doc.md`(297줄)는 **완성본**(게시본 등급). 재작성 불필요
- `design-spec.md`(457줄)는 그릴 수 있는 상태. 20프레임 중 **15개 즉시 착수 가능**
- `policy-outline.md`(24섹션 목차)와 `REPORT-pm.md` 프레임 표는 **스테일** — REPORT는 19행 구버전. 프레임 기준은 `screen-list.md`(20개)
- **문서 충돌**: `policy-doc.md` §4는 "Single→Team 즉시 전환, 예약 아님"이라 단정하는데 `screen-list.md` #14·`design-spec.md` G15는 "만료 후 시작 / 정책 초안". 완성본 정책과 화면 목록이 반대로 말하고 있음
- WF는 영문 필수인데 **EN 문구 세트가 없음** → `/copy-review` 선행이 실질 선결 과제

### 라이팅 룰 체계 (2026-08-07)

**발단**: Plan 페이지 FAQ를 쓰다가 말투 기준이 파일마다 어긋나 있는 게 드러났다. 구 `ux-writing.md`는 전 영역 해요체 **강제**, `solutions-copy.md`는 해요체 **지양**, `copywriting.md`는 마케팅 명사형. 같은 질문에 파일마다 다른 답이 나왔다.

**확정된 기준**

| 항목 | 결정 |
|---|---|
| 말투는 **텍스트 종류**로 결정 | 마케팅=명사형 / 사이트 본문·제품 UI=합니다체 / 버튼=명사형 |
| 해요체 | **전 영역 금지** — 전문가용 프로덕션 툴의 목소리가 아님 |
| KO 격 | 합니다체 고정하되 **종결어미는 묶지 않는다**. 고정 경계는 해요체 금지·명령조 금지 둘뿐 |
| 버튼 `하기` | `하기`를 떼도 말이 되면 뗀다 (`저장하기`→`저장`). 순우리말 `닫기`는 예외 |
| EN | **원본 언어.** 구 룰엔 규칙이 거의 없었음 → §1.1 신설 |
| 정책 문서 | **등급 분기** — 게시본(Canvas)은 구조·불릿·검산예시 허용 / 정본(`docs/policy`)은 압축 |
| 부정문 | 기본 금지 유지 ("안 쓰는 결제창구가 2000개는 될 텐데 다 쓸 거냐") |
| 레거시 | **Legacy↔Renewal 비교 금지.** 지금도 유지되는 레거시만 서술 |
| 외부 레퍼런스 톤 | 표기하지 않음 (Apple·Toss 모두 제거) |

**리서치 근거**: Cursor(`cursor.com/docs`, `/ko/docs` 존재)·Anthropic(`platform.claude.com/docs/en|ko|ja`) 문서 전수 조사. 둘 다 KO는 합니다체, 인과는 프로즈·열거는 불릿로 분리, 불릿 2등급(조각=마침표 없음 / 완결문장=마침표 있음), 중첩 2단 제한, 섹션은 한 문장 정의로 오픈.

**Auto Renew 문제**: 존재하지 않는 기능인데 반복 재등장. 원인은 개별 실수가 아니라 **문서들이 "Auto Renew는 없다"를 설명하고 있는 구조**. 부재를 서술하는 문장이 그 개념의 생존 경로다. Josh가 이번에 강하게 재확인 — "몇 번째냐 도대체. 의무적으로 subscription이라 기능 자체가 없다고." 정리는 보류하고 메모리에만 기록.

**Canvas 게시본 문제 인식**: BD·영업·CS·글로벌팀·개발·SW PM이 전부 읽고 게시자 이름이 걸린다. Josh — "필자가 개아마추어같음. 사람들은 내가 쓴 줄 알텐데." 규칙만 끊어 나열하면 문서가 아니라 메모가 된다는 게 진단.

### AI 워크플로우 발표 준비 (2026-07-28)
- 목적: Josh가 "기획 vs 매니지" 두 축으로 자신의 AI 활용 방식을 발표하기 위한 원자료 문서 작성
- 대화로 범위를 좁혀감: 전체 레포 → 기획 축 → Figma 파이프라인 + 정책 동기화 지연 두 갈래로 확정
- 최종 요청은 "요약"이 아니라 "발표 재료 원본(raw)" — What(무엇을 했나) → How(AI를 어떻게 썼나) → So what(효과) 구조 + 나중에 시각화할 수 있는 데이터 스펙까지
- 산출물: `docs/backlog/ai-pipeline-review.md` (1105줄)
  - memory 61개 파일 전수 분석 — 70%가 Figma/와이어프레임 관련
  - mistakes.md 43개 사례 카테고리 분석 — Figma 관련이 약 53%
  - My Page 프로젝트 세션 타임라인 재구성, 정책→Figma 반영 소요 3사례 비교(34일 지연 vs 당일 반영 vs 몰아서 처리)
  - wave-prep이 이 프로젝트에 안 맞는 이유(개발 게이트 불필요) 정리
  - 부록에 mistakes.md·mypage-renewal.md 원문 전체 포함 (발표 인용용)
- 커밋 `53ad43c6`으로 저장, origin/main에 push 완료

### 레포 커밋 정리 (2026-07-27~28)
- 세션 시작 시 브랜치 없이 미커밋 상태로 방치된 변경사항이 다수 발견됨: 31개 수정 + 54개 신규 파일, 서로 무관한 13개 이상 워크스트림 혼재 (My Page Description, 계정 구조 개편, Admin phase2/3, 마케팅 카피, MD-SITE 요구사항, 신규 정책 문서, Enterprise Trial 폼, BD/이메일 문서, 내부 Flowchart 툴, Supabase 타입, Figma 레퍼런스 테스트 등)
- 워크스트림별로 분리해 총 15개 커밋으로 정리 (오늘 세션만 13개 + 이후 2개 추가) → origin/main에 전부 push 완료
- `.DS_Store`/`tsconfig.tsbuildinfo`/`next-env.d.ts`/`supabase/.temp/*`는 `.gitignore`에 있지만 이미 tracked라 계속 diff에 잡힘 — 이번엔 손대지 않고 남겨둠

### /checkout · /initiate
- `/checkout` 커맨드 운영 중 (`.claude/commands/checkout.md`)
  - Step 0: 프로젝트 선택 + 네이밍 규칙 안내
  - Step 1: 프로젝트 파일 덮어쓰기 갱신
  - Step 2: 세션 대화 자동 분석 → 실수 노트
  - Step 3: 규칙 제안 (제안만, 승인 후 적용)
  - Step 4: 상태 리포트
- `/initiate` Step 2 동작 검증 완료 — `docs/backlog/projects/` 최신 파일 읽어 TODO 출력 정상

### Flowchart Tool (localhost:3001 — 프로덕션 툴, User Flow 에디터와 별개)
- `localhost:3001/flowchart` — 내부 기획 툴, Supabase `tool_flowcharts` 테이블 사용
- Phase 1~7 전부 구현 완료 (step/track 리네임, hover ＋버튼, drag-to-connect, zoom/pan, undo/redo, 삭제 모달, 멀티선택)
- hover zone 버그 수정: `<g> onMouseEnter/Leave` + 큰 투명 rect 패턴 적용 (미최종 확인)
- 파일 폴링: Claude Code → `public/flowchart-current.json` → 브라우저 2초 간격 auto-detect
- 레퍼런스 문서: `docs/flowchart-tool-reference.md` (집에서 재구현용 올인원)

## 완료 로그
### 2026-09-03

**피드백 초안 큐 정리**

- 09-01 세션이 큐에 넣은 버그 리포트 초안(FlowKit 미확인 재구현 건)이 `/clear` 후에도 반복 표시되는 원인 규명: 초안은 대화 컨텍스트와 별도인 `~/.claude/feedback/drafts/`에 저장되어 `/clear` 리셋 대상이 아니다
- 큐 파일 삭제만으로는 해소 안 됨을 확인: 원 세션이 메모리에 초안을 들고 있어 박스를 재표시. 실제 처리 경로는 박스 하단 키 안내(1 리뷰, 2 전송, 0 버리기)와 `/feedback` 커맨드
- Josh가 `/feedback`으로 해당 리포트 전송 완료, 큐 비움

### 2026-09-01

**Figma 규격 통합 — spec.md 체계 확립 (1.0.00 → 1.7.00, 하루 7판)**

- `spec.md` 신설: figma 룰 7종(read, draw, write, wireframe-ds, annotation, feature-naming, spec-card) 통합. Account 섹션(5933:3427) 실측으로 근거 확보 (Screen NONE, 소수 gap 6.5242…가 소수 높이 328.61…을 만드는 메커니즘 특정)
- 5대 변경 확정: Screen VERTICAL Auto Layout, 최상위 FIXED, 하위 FILL, 상황별 간격 표(실측+8pt), Description 텍스트 스타일(링크 파랑, 중요 SemiBold, 플래그 빨강) + `applyRichDescription()` 신설
- 기획 문서 3종 체계: PRD(문서형 7섹션, Screen Structure=정보구조 Depth 표), 기능명세(8컬럼, 기능 ID `FC-CO-001` 페이지 단위), Version Table(x.x.xx 3자리). 관련 문서 블록은 제목 바로 아래 4종. §9.7 범용 템플릿(Lorem Ipsum placeholder)
- `spec-visual.md` 신설 (시각 토큰, 컴포넌트 함수). Description 검정 `desc.ink #18181E` 통일
- 룰 7종 스텁화, 전역 figma-description.md에 MD-WEB 배너, CLAUDE.md 룰 표와 Mandatory Rules 5·6 갱신
- 용어 확정: "원장" 전면 금지 → "정책 문서" (메모리 등재)
- 시안 2종 게시: 기획 문서 3종 시안(0a3c0a24, 7회 개정), 와이어프레임 규격 시안(c69a0b13, 실축척 16:9 + 컴포넌트 라이브러리 + 폰트/spacing + Do/Don't)
- **User Flow 에디터 구축** (7b03170c): FlowKit 렌더러 원본(SKILL.md awk 추출) + 편집 레이어(드래그 격자 스냅, 갈 수 있는 노드만 연결, 검사기 저장 잠금, undo 100단계, 복붙, EN/KO, 노트 reads/shows 편집). FlowKit에 에디터 후크 3개를 SKILL.md 원본에 반영해 이중 관리 제거. 저장은 SHELL/DATA 자기 재생산 — 빌드에서 2세대 바이트 동일 + 3세대 편집 생존 검증, 실사용 저장 1회 회수로 셸 무결·frame-runtime 비오염 확인
- 실수 기록: FlowKit 미확인 재구현 (mistakes 4차) — 병합으로 복구

### 2026-08-19

**Manager 세션 — TODO.md/task list 동기화 + 리뉴얼 3축 발표자료 준비**

- TODO.md `T-01-8·T-02~05·F-01~05` 10건을 세션 task list에 신규 생성해 동기화. T-04(튜토리얼)·T-05(교육기관 인증)를 Josh 지시로 한 행 병합, TODO.md·task list 양쪽 반영
- 리뉴얼 스코프 11개 항목(계정구조·가입로그인·GNB·랜딩·플랜·체크아웃·마이페이지·학생플랜·무료체험·튜토리얼·교육기관) × Product&Policy/UI·UX/개발 매트릭스 초안 작성. Maintenance·Article Architect·Product Units Redefine·Renewal Announcement 4건은 스코프 제외로 판정
- Account Structure AS-IS→TO-BE 10항목 표 작성 (`docs/policy/member.md` 근거) — MemberType 폐지, License ID→SW Account, Group→Organization, Indie SW Account 무제한 정정 등
- Jira 실사 — `MDWEB-634 "2026 | Website Renewal"`이 개발 축 전체를 쥔 별도 마스터 에픽임을 발견. 하위 15건(인프라 셋업 MDWEB-682·GA 재설계 661/675·로그인 리서치 725/805·Features 페이지 S1~S8 743~750·계정 정책 사이드이펙트 스캔 807 등) 확인. `MDWEB-773` 밑 PD/FE/BE 3건은 내용 없는 빈 껍데기로 확인
- 발표용 최종 산출물은 축당 한 줄 타이틀 4개 (전체·Product&Policy·UI·UX·개발)로 압축해 종료

### 2026-08-18

**Task Manager 라이브 운영 — MDWEB-870 문서 축 알림 프로토콜 실증**

`기획 워크플로우 (2026-08-11 신규)` TODO 2·3번을 실제 작업 중에 검증:
- **알림 실사용**: PolicyWriter·Planner 세션이 착수·완료·재작업 전환마다 TaskManager에 알림 전송 → 전부 도달 확인. 다만 **알림이 파일 반영보다 먼저 도착하는 시차가 반복 관찰됨** (Manager가 TODO.md에 쓰기 전에 발신 세션이 다음 알림을 보내는 경우) — TaskManager는 알림 텍스트를 옮기지 않고 매번 TODO.md를 재독해 이 시차를 흡수
- **1사이클 검증**: T-01-4·T-01-6·T-01-9·T-01-3이 각각 배정→진행중→검토대기→(일부는 미달 재작업)→완료를 실제로 순환. **배정받은 역할이 스스로 완료 처리하지 않고 Planner 검수를 거치는 권한 경계가 전 사이클에서 유지됨** (T-01-4·T-01-6은 1차 검토대기에서 미달 판정 후 재작업, 재검토 후 완료)

**정책 문서 실물 대조로 결함 선제 발견** (알림 내용을 그대로 믿지 않고 `docs/policy/checkout.md`를 직접 열어 대조):
- §6 Order Summary 배치 문장이 2단 레이아웃 확정(F-04)과 반대 순서로 남아있던 것 발견 → 이후 T-01-4 항목⑥으로 정식 반영
- §7.3 "카나리아 제도·마데이라·올란드" 지명 나열이 `policy-writing.md` §4.3 금지 예시와 축자 일치하는 것 발견 → T-01-4 항목⑪로 정식 반영
- 둘 다 Planner의 자체 검수에서도 동일하게 걸러져 **교차검증 성립** — 알림만 받아 옮겼다면 놓쳤을 오류

**남은 문제**: F-01 WF 프레임 표의 번호 중복·Row 미갱신(2-step 개정 시 발생), F-04·F-05의 비표준 상태값 `재작업 필요`는 세션 종료 시점까지 미해결

### 2026-08-11

**기획 워크플로우 개편 — wave 폐지 → Planner 허브**

| 대상 | 처리 |
|---|---|
| `.claude/commands/{planner,task-manager,research,policy-writer,figma-wireframe,figma-description,manager}.md` | **신규 7개.** 역할별 터미널 진입 커맨드. 커맨드명 = 역할명 = 세션명 일치 |
| `.claude/rules/planner-workflow.md` | **신규.** §0 터미널 실행 · §1 역할·권한 · §2 TODO 갱신 · §3 플랜 승인(Phase A/B) · §4 문서 상호링크 · §5 작업 루프 · §6 알림(2축) · §7 Jira · §8 실수로그 · §9 Figma 검증 · §10 금지 패턴 |
| `requirements/board/TODO.md` | **신규.** 단일 투두리스트. Jira `UX\|` 시드 5행(T-01~05) + `## 결정 대기` 3건 + MDWEB-870 상태 |
| `requirements/board/patterns.md` | 유지 — Figma Description 전용 패턴 라이브러리 |
| `.claude/agents/{wf,desc}-validator.md` | 경량화 — PACKET/REPORT 의존 제거, 파일 미작성, PASS/FAIL + 이슈 목록 반환. desc-validator에 S6(조건 분기 `~한 경우:` 형식) 체크 추가 |
| `CLAUDE.md` | Wave 섹션 삭제 → `### Planner 중심 워크플로우` 교체 · Rules 표에서 `planning-packet.md` → `planner-workflow.md` |
| `.claude/rules/policy-writing.md` | 적용 경로 `requirements/waves/**` → `requirements/**` |
| **삭제** | `/wave-prep` · `/wave-integrate` · `/orch` · `planning-packet.md` · `.claude/planning-logs/`(빈 템플릿 3개) · `requirements/waves/` · `board/inbox/`(5개) · `TASKBOARD.md` |
| **이관** | `requirements/waves/active/` → `requirements/mdweb-870-checkout/` (7파일, git rename 추적) |
| `~/.zshrc` | `mdweb` + `md-*` alias 7개 추가 — 경로에 공백(`MD RENEWAL`)이 있어 따옴표 필수 |

**중간 수정** — Josh 지적 2건 반영: ① `Planner → Josh` 보고를 `Planner → TaskManager` 알림으로 교체 ② 역할 전원이 `진행중` 착수 시 TaskManager에 알리도록 추가 (착수 알림 구멍)

**검증** — 세션 간 `SendMessage` 실제 전송 성공. 첫 접촉 `[ref]` 필요·대소문자 무관 확인. 알림 규약 실사용 검증은 미완 (TODO 1~3)

### 2026-08-07

**정책 문서 감사** (상세는 `plan-renewal.md` 8/7 로그)
- 리서치 에이전트 6개 병렬 — `docs/policy/**` 내부 충돌 감사 3건 + 3개 Slack Canvas 대조 3건
- `plan.md`·`member.md`·`auth.md`·`checkout.md` 정합성 수정 · Plan Renew Canvas(Appendix B·§4) 수정
- 스코프 오염 삭제: `docs/policy/README.md`(1057줄, OPINION 서베이앱) · `.claude/rules/monetization.md`

**라이팅 룰 체계 정비**

| 파일 | 처리 |
|---|---|
| `.claude/rules/ux-writing.md` | 전면 재작성. 구 `ux-writing`+`copywriting` 통합. §0 목소리 · §1 말투 결정표 · **§1.1 EN 원본 규칙 신설** · §2 원칙 P1~P7 · §3 마케팅 카피 · §4 버튼 `하기` 금지 |
| `.claude/rules/policy-writing.md` | 전면 개정. §1 문서 등급 분기 · §2 게시본 구조 · §3 불릿 A·B 2등급 · §4 결과문장·검산예시 · §5 부정문 트리거 · §6 용어 정의 |
| `.claude/rules/localization.md` | KO 말투 규칙 **뒤집음** (`~합니다 금지→해요` → `~해요 금지→합니다체`), 명령조 금지 추가 |
| `.claude/rules/solutions-copy.md` | 말투 지침 2줄 → `ux-writing.md` 참조로 대체 |
| `.claude/rules/figma-write.md` | Pre-flight **최상단**에 문구 검수 항목 추가 |
| `.claude/skills/copy-review/SKILL.md` | **신규.** 4단계 검수 — 종류 판별 → 기계적 검출(EN 우선) → 판단 필요 → **정책 사실 대조** |
| `.claude/skills/writing/SKILL.md` | `/copy-review` 연계 명시 |
| `.claude/commands/policy.md` | **Phase 0 문서 등급 판별** 신설 · Phase 1 분류표 등급별 2열화 |
| `.claude/commands/description.md` | `/copy-review` 검수 필수 문구 추가 |
| `CLAUDE.md` | Rules 표 2행 갱신 · **Mandatory Rules 7번 신설**(문구 검수 필수) |

**메모리** — 신규 5 (`no_auto_renew` · `no_legacy_comparison` · `copy_review_mandatory` · `renewal_doc_scope` · `check_tools_before_declining`) / 갱신 3 (`doc_tone_by_type` · `copywriting_tone` · `policy_doc_style`)

### 2026-07-28
- 방치된 미커밋 변경사항(31개 수정 + 54개 신규 파일)을 워크스트림별로 분리해 15개 커밋으로 정리, origin/main push 완료
- `docs/backlog/ai-pipeline-review.md`(1105줄) 작성 — 기획 축 AI 활용 파이프라인 발표 준비 자료 (memory 61개·mistakes.md 43개 사례·프로젝트 세션 로그·커밋 히스토리 전수 분석 + 시각화 후보 12종)
- MD-WEB-003.md Plan 페이지 카드 구성 확정 반영 커밋 (Enterprise Team/Single/Team Linux 개명, Student 가격 수정 등 — Josh 직접 편집분 확인 후 커밋)

### 2026-06-22
- FlowNode `col`/`row` → `step`/`track` 타입 리네임
- 엣지 key 파싱 버그 수정 (`${from}-${to}` → `${from}__${to}`)
- 노드 hover ＋버튼 (right/below/left insert) 구현
- 연결 포인트(●) drag-to-connect 구현 (decision → yes/no 팝업)
- Ctrl+스크롤 줌 (25~200%) + 빈 영역 드래그 패닝
- Cmd+Z / Cmd+Shift+Z Undo/Redo (20단계 ref 스택)
- 노드 삭제 모달 (bridge/edges-only/cascade 모드)
- 멀티 선택 + step/track delta 이동
- hover zone 버그 수정 (어포던스 전체 커버)
- `docs/flowchart-tool-reference.md` 올인원 레퍼런스 문서 작성

### 2026-06-08
- `/initiate` Step 2 동작 검증 완료
- `/checkout` Step 0에 프로젝트 네이밍 규칙 추가

### 2026-06-04
- `/checkout` 커맨드 초안 작성 → project 기반 구조로 전환
- `/initiate` 커맨드 목록 업데이트
