---
project: mypage-renewal
updated: 2026-07-23
---

## 관련 Jira 티켓

- MDWEB (Epic 미정) — My Page 리뉴얼 5탭 재설계 (진행 중)
- 없음 (Coupon/Payment History/License-Billing 상태별 Description 작업 — 명시적 요청 전 Jira 생성 금지)

## TODO

1. **License/Billing 상태별 배너·모달 컴포넌트화 (신규 최우선)** — 지금까지 완료한 Paused/Pause Scheduled/Suspended Description 내용을 기준으로 Figma 와이어프레임을 실제로 그리는 작업. 그리기 전 컴포넌트 구조부터 확정:
   - License Information Card / Payment Method Card — 상태 무관 base 컴포넌트
   - Status Banner — variant 3종 (Paused / Pause Scheduled / Suspended, 텍스트만 스왑)
   - Action Row — variant 3종 (버튼 조합별: [Cancel/Resume Now] / [Undo Pause] / [Cancel/Retry Payment])
   - Modal Shell (닫기 아이콘 + Title + Body + Button Row) — Undo Pause·Retry Payment 모달이 공유
   - Modal Button Row — variant (Cancel/Complete, Done, Close/Contact Us, Cancel/Make Payment)
   - 그릴 파일/페이지는 `figma-read.md` 프로토콜대로 기존 컴포넌트·variant 유무부터 확인 후 진행
2. **Loading 상태 표기 일괄 재확인** — `figma-description.md`가 "Loading: Skeleton 표시, 로딩 휠 금지"로 개정됨. 이미 작성된 Description 중 "로딩 휠"로 적힌 곳 전부 Skeleton 기준으로 교체 필요
   - Coupon Card (node `6131:3017`, ③번 노트) — 현재 "Loading: 로딩 휠"
   - Payment History Table (node `6131:2615`, ①번 노트) — 현재 "Loading: *(정책 확인 필요)*" — 확정 시 Skeleton 기준으로 작성
3. **Coupon 협의/확인 대기 항목 확정** (구 파일 `PeCid7uJcg0HenViaaiHUp` Coupon WF)
   - Apply 시 비구독자 처리 정책 (Checkout 유도 or 비활성)
   - 만료 쿠폰 목록 노출 여부
   - Coupon Card "Expires on" 만료일 레이블 카드별 표기 불일치 → 통일
   - Coupon 목록 Empty 상태 안내 문구
4. **Payment History Table Error 상태 정책 확인** (구 파일 `PeCid7uJcg0HenViaaiHUp` Payment History WF `6131:2482`) — API 연동 여부에 따른 실제 문구 확정 필요
5. Account STRUCTURE Description 최종 확인 — CLO-SET 행이 "Connected" 기준으로 작성됐는지 확인
6. Account FEATURE 섹션 Description Panel 보강 — 현재 단순 1줄 action text. Format B 스타일(Header Note + Numbered Note)로 정식 확장 검토
7. figma-description.md 컴플라이언스 확인 — Account STRUCTURE 10개 WF 전체 `클릭 시:` 트리거 + 상태 라이프사이클 순서 재확인
8. License/Billing ActionRow_CaseView — Description 검토 (구독 상태 라이프사이클 순서 확인)
9. Slack Canvas에 정책서 업로드 (BD·CX 공유용 — 합니다 체 초안 완성본)
10. Jira Epic 생성 후 PRD 연결
11. `docs/policy/mypage.md` 잔여 업데이트
    - "Shared License" → "Invited Projects" 전체 변경
    - "License Account Admin" → "Team Console" 전체 변경
    - 비밀번호 변경 방식: 인라인 편집 확정 반영
    - Paused → Suspended 이메일 알림 발송 확정 반영

## License ID 웹 로그인 차단 — 확정 정책 (2026-06-09)

**License ID = MD Web 로그인 불가.** 데스크탑 앱 전용.

삭제 완료 목록 (Figma):
- Overview_License ID WF 삭제
- License/Billing WF7 (License ID) 삭제
- AIStudio_CaseView Case 2 삭제 → ①②로 재정리
- InvitedProjects_CaseView Case 2 삭제
- BasicInfo_CaseView Case 3 삭제
- DangerZone_CaseView Case 4 삭제
- ActionRow_CaseView License ID 행 삭제
- Invoice CaseView License ID 케이스 삭제
- 전체 Description/Annotation License ID 참조 제거 (0건 잔존 확인)
- `docs/policy/mypage.md` §1·§3·§5·§6·§8·§9 업데이트 완료

## 컨텍스트

### Figma 파일

| 파일 | 용도 |
|------|------|
| `NYShAqeBVSmpQYdk3HgPwN` (AI 파일) | 새 Wireframe Rule 기반 MyPage WF — 현재 작업 대상 (Page 7) |
| `PeCid7uJcg0HenViaaiHUp` (구 MyPage 파일) | 이전 STRUCTURE/FEATURE WF — 참고용 |

### 탭 구성 확정 (5개)

Overview · Account · License/Billing · Invited Projects · Preferences

### Account Tab WF 그리드 구조 (AI 파일 Page 7)

탭 기준 재구성 — 계정 유형별이 아닌 섹션별 TC × WF 그리드

| TC | WF 1 | WF 2 | WF 3 | WF 4 | WF 5 | WF 6 |
|---|---|---|---|---|---|---|
| **기본 정보** | Individual | Student (미인증) | Student (Approved) | Academic | Indie | Company ID |
| **CLO-SET** | 미연결 | 연결됨 | | | | |
| **Danger Zone** | 기본 | | | | | |

> License ID WF 삭제됨 (2026-06-09) — MD Web 로그인 차단 정책

캔버스 좌표 (Account section `5778:5546`):
- TC 너비: 2448px (WF와 동일), 프레임 간격 40px (x step = 2488px)
- 행 Y: 기본 정보 y=449 / CLO-SET y=1705 / Danger Zone y=2961

생성된 Frame ID:
- TC 기본 정보 `5778:5549` / WF Individual `5778:5952` (기존 STRUCTURE)
- WF Student(미인증) `5814:287` / WF Student(Approved) `5778:6063`
- WF Academic `5814:415` / WF Indie `5814:543`
- WF Company ID `5814:671` / WF License ID `5814:799`
- TC CLO-SET `5815:372` / WF 미연결 `5815:374` / WF 연결됨 `5815:502`
- TC Danger Zone `5815:630` / WF Danger Zone `5815:632`

### CaseView 프레임 (이번 세션 신규)

| 프레임 | ID | x | y | 케이스 수 |
|---|---|---|---|---|
| `BasicInfo_CaseView` | `5997:365` | 5202 | 449 | 3 |
| `DangerZone_CaseView` | `6019:365` | 7690 | 449 | 4 |

**BasicInfo 케이스**: ① Individual/Student (Integrated) · ② Company ID/Academic/Indie (Integrated)
**DangerZone 케이스**: ① Individual/Student · ② Company ID (통합) · ③ Company ID (미통합)/Academic/Indie

### docs/policy/mypage.md 이번 세션 확정 수정 사항

- **Card 구조**: 4카드 → 2카드 (계정 정보 카드 + Danger Zone 카드)
- **Certification 행**: 정책·Figma 모두 완전 삭제
- **Password 분기**: Individual/Student = CLO-SET PW 1행 / Company ID·Academic·Indie = CLO-SET PW + MD PW 2행
- **Email·Nickname**: CLO-SET 통합 시 CLO-SET에서만 수정 (MemberType 무관)
- **Danger Zone 설명문구**: MemberType별 텍스트 확정 (정책 파일 §5 blockquote 참조)

### License/Billing WF 기술 메모

- Action Row 버튼 정렬: `primaryAxisAlignItems = 'MAX'` + `layoutSizingHorizontal = 'FILL'`
- Invoice Table: Header 행(배경 #F5F5F5, h=40) + Upcoming/Paid 행 구조
  - 컬럼: Due date(120px) | Description(FILL) | Status(90px) | Amount(90px) | View PDF(100px)
- CLO-SET 칩: outline 배지, "Connected" / "Not Connected" + 우측 정렬 버튼
- Annual Active: Auto Renew toggle 미노출, Pause for Now 버튼 없음, Invoice 1행

### 확정 정책

- 탭 명칭: "Shared License" → "Invited Projects"
- 관리자 콘솔 명칭: "License Account Admin" → "Team Console"
- 비밀번호 변경 방식: 인라인 편집
- Annual = 무조건 갱신 → Auto Renew toggle 미노출
- Annual Invoice = 연간 단일 결제 1행만 (상태: Paid)
- 만료일 라벨: "만료일" (다음 결제일 아님)
- Pause 기능: Annual 미지원
- Paused → Suspended 전환 시 이메일 알림 발송
- **미결**: Jira Epic 키 미정

## 컨텍스트

### License/Billing Tab WF 그리드 구조 (AI 파일 Page My Page)

분기 축: **구독 상태** (MemberType 아님)

| 프레임 | ID | 캔버스 x | 캔버스 y |
|---|---|---|---|
| TC — License/Billing | `6070:338` | -6082 | 18649 |
| WF1 Monthly Active | `6073:364` | -3594 | 18649 |
| WF2 Pause Scheduled | `6085:338` | -1106 | 18649 |
| WF3 Paused | `6086:338` | 1382 | 18649 |
| WF4 Suspended | `6087:338` | 3870 | 18649 |
| WF5 Annual Active | `6088:338` | 6358 | 18649 |
| WF6 Student Benefit Active | `6089:338` | 8846 | 18649 |
| ~~WF7 License ID~~ | ~~`6090:338`~~ | 삭제됨 | |
| ActionRow_CaseView | `6091:365` | -6082 | 19985 |
| Section "License/Billing" | `6122:338` | — | — |

**WF1 Screen 구조**: Page(VERTICAL 1920×1080) → Header Default(96px) + Body(HORIZONTAL: SNB 240px + ContentArea FILL)
**ContentArea node ID**: `6082:353`

---

## 컨텍스트

### Preferences Tab WF (AI 파일 `NYShAqeBVSmpQYdk3HgPwN` My Page)

| 프레임 | ID | 캔버스 x | 캔버스 y |
|---|---|---|---|
| TC — Preferences | `6238:149` | -6082 | 23111 |
| WF1 Default | `6238:151` | -3594 | 23111 |
| AIStudio_CaseView | `6247:150` | -1106 | 23111 |
| Section "Preferences" | `6249:150` | -6182 | 23011 |

**PM 결정 (정책 override):**
- AI Studio: Company ID = 카드 미노출 (정책: 노출)

### Invited Projects Tab WF (AI 파일 `NYShAqeBVSmpQYdk3HgPwN` My Page)

| 프레임 | ID | 캔버스 x | 캔버스 y |
|---|---|---|---|
| TC — Invited Projects | `6256:150` | -6082 | 24647 |
| WF1 Empty | `6256:152` | -3594 | 24647 |
| WF2 Active | `6261:160` | -1106 | 24647 |
| InvitedProjects_CaseView | `6265:152` | 1382 | 24647 |
| Section "Invited Projects" | `6266:152` | -6182 | 24547 |

**PM 결정 (정책 override):**
- License ID: 웹 로그인 차단 정책으로 CaseView에서 삭제됨 (2026-06-09)

---

## 완료 로그

### 2026-07-23 (License/Billing 상태별 배너·모달 Description — 구 파일 `PeCid7uJcg0HenViaaiHUp`)

- **Paused 상태** (node `6487:2096`) — ① Pause 안내 배너 ② Resume Now 버튼 ③ Cancel Subscription 버튼, 3개 노트로 정리
- **Resume Subscription 풀페이지** (node `6538:3597`) — 스크린샷 기반 신규 작성. 기존 무관한 플레이스홀더(Team Console 관련) 5개 카드 전체 교체 → ① Account 뒤로가기 ② Page Context ③ Resume Summary Card ④ Terms List ⑤ Resume Subscription 버튼
- **Pause Scheduled 상태** (node `6464:2160`) — ① Pause Scheduled 안내 배너 ② Undo Pause 버튼 + 모달 2단계(③④ → 이후 **Undo Pause 1 / Undo Pause 2**로 개명, 확인/완료 구분은 본문 첫 줄에 명시)
- **Suspended 상태** (node `6548:3875`) — ① Suspended 안내 배너 ② Retry Payment 버튼 + 모달 3단계를 **2-1(확인) / 2-2(완료) / 2-3(실패)** 서브 넘버링으로 구성. 실패는 잔액 부족·일반 오류(Error Code 400) 2케이스를 `실패 케이스:` 블록 하나로 통합
- **신규 확정 컨벤션 — 모달 서브 넘버링**: 버튼 하나에서 갈라지는 다단계 모달(확인→완료/실패)은 부모 번호에 `-1/-2/-3` 서브 번호를 붙여 그룹으로 묶는다. 실패 변형이 여러 개라도 트리거가 같으면 하나의 서브 노트에서 `실패 케이스:` 블록으로 통합 — 매 실패마다 별도 노트 분리하지 않는다
- native 불릿 + screenshot 검증 전 카드 완료. 일부 화면은 진입 경로(Resume Now → Resume Subscription 확인 화면)가 실제 정책과 맞는지 `*(정책 확인 필요)*` 플래그 유지
- **다음 단계로 합의**: 지금까지의 상태별 Description을 기반으로 컴포넌트 구조(License Info Card / Payment Method Card / Status Banner / Action Row / Modal Shell) 식별 완료 — 실제 Figma 와이어프레임 드로잉은 다음 세션 TODO 1순위로 이관

### 2026-07-16 (Coupon Description — Add Coupon 모달 내용 보강)

- 스크린샷 재확인 결과 ① Add Coupon Button 노트에 모달 내부 동작(입력 필드 상태/Add 버튼 활성화/성공·실패 케이스)이 누락된 것 발견 → **② Add Coupon 모달** Numbered Note 신규 삽입 (기존 ②③④는 ③④⑤로 renumber). 총 5개 Numbered Note로 재구성 완료 (node `6131:3017`)
- Add Coupon 모달(`6156:2834`)에 남아있던 출처 불명 문구 `"Your subscription will end on {endDate}."`는 Josh가 이미 Figma에서 직접 `"This coupon code is invalid."`로 교체 완료 확인 — Description 작업은 불필요해짐 (Figma 화면 삭제 작업 스킵)
- native 불릿 적용 + Description List·전체 WF screenshot 검증 완료
- TODO 1번에서 `Subscription End Notice` 항목 해결 완료로 제거 (Josh가 직접 수정)

### 2026-07-16 (구 MyPage 파일 `PeCid7uJcg0HenViaaiHUp` — Coupon + Payment History Description 삽입)

- **Coupon 목록 Description 삽입 완료** (node `6131:3016`, WF `6131:2935`) — Numbered Note 4개: ① Add Coupon Button ② Coupon Card ③ Apply Button ④ Already Subscribed 안내 모달. 협의 대기 5항목은 `*(협의 필요)*`/`*(정책 확인 필요)*` 플래그로 카드 내 반영. native 불릿 적용 + screenshot 검증 완료.
- Add Coupon 모달(`6156:2807`)·에러 프레임(`6156:2834`, `6218:4329`)은 Description List가 없는 FEATURE형 모달 — 별도 Description 삽입 대상 아님 확인. Already Subscribed 안내 모달은 Figma 화면 자체가 아직 그려지지 않음.
- **Payment History Description 삽입 완료** (node `6131:2615`, WF `6131:2482`) — 기존 잔여 초안(테이블/Paid/View PDF 한 카드에 혼재) 제거 후 Numbered Note 3개로 재작성: ① Payment History Table ② Status Badge ③ View PDF. Empty 상태("No payment history" / "Your payment history will appear here.") 반영. native 불릿 적용 + screenshot 검증 완료.
- **신규 규칙 확정 — 기본 토스트 문구 고정값**: 에러 "Something went wrong. Please try again." / 성공(데이터 변경) "Changes have been saved." → 특정 문구 미확정 시 `*(정책 확인 필요)*` 대신 이 기본값 사용. `~/.claude/rules/figma-description.md` 섹션 4.6 반영 + 메모리 `feedback_default_toast_copy.md` 저장.
- `docs/backlog/projects/coupon-description.md` 내용을 이 파일로 통합 후 삭제 (프로젝트 파일 일원화)

### 2026-06-09 (Account FEATURE 섹션 — 4개 섹션 13 WF 생성)

- **CLO-SET Connect** 섹션 (`6338:134`) — 3 WF, x=4200, y=14721
  - WF1 View: Status "Not Connected" + Connect CLO-SET 버튼 annotation
  - WF2 CLO-SET Redirect: 인증 완료 후 MD 복귀 annotation
  - WF3 Connected: end state (annotation 없음)
- **CLO-SET Disconnect** 섹션 (`6342:185`) — 3 WF, x=12024, y=14721
  - WF1 View: Status "Connected" + Disconnect 버튼 annotation
  - WF2 Confirm Modal: Dim + 모달 카드(닫기/연결 해제하기) 직접 생성 + annotation
  - WF3 Disconnected: end state
- **Password Change** 섹션 (`6343:236`) — 5 WF + Row Label 2개, x=19848, y=14721
  - Row Label Case 1 (Not Integrated: Individual/Student) → WF1 View + WF2 Form Open
  - Row Label Case 2 (CLO-SET Integrated: Company ID/Academic/Indie) → WF3 View + WF4 CLO-SET Redirect + WF5 Changed
- **Nickname** 섹션 (`6345:321`) — 2 WF, x=32648, y=14721
  - WF1 View: Edit 버튼 annotation (CLO-SET 닉네임 변경 페이지 이동)
  - WF2 CLO-SET Redirect: end state
- 각 WF: clearAnnotations + Board Header 업데이트 + Description List 초기화 후 FEATURE annotation 1줄 주입
- 각 액션 WF: native annotation + Description Panel 이중 설정 완료
- End state WF: Description Panel 비움 (annotation 없음 원칙 준수)

### 2026-06-09 (License ID 웹 차단 — Figma 전체 정리)

- **정책 확정**: License ID = MD Web 로그인 불가, 데스크탑 앱 전용
- `docs/policy/mypage.md` §1·§3·§5·§6·§8·§9 업데이트
- Figma `NYShAqeBVSmpQYdk3HgPwN` My Page — License ID 케이스 전체 삭제:
  - Overview_License ID WF (`5823:6693`) 삭제
  - License/Billing WF7 (`6090:338`) 삭제
  - AIStudio_CaseView: Case 2(License ID) 삭제 → ①② 재정리, 배지 ③→② 이동
  - InvitedProjects_CaseView: Case 2(License ID) 삭제
  - BasicInfo_CaseView: Case 3(License ID) 삭제
  - DangerZone_CaseView: Case 4(License ID 노출X) 삭제
  - ActionRow_CaseView: License ID 행 삭제
  - Invoice CaseView: License ID 케이스 삭제
- 전체 Description/Annotation License ID 참조 제거 (잔존 0건 검증 완료)
  - Account_STRUCTURE 5개 annotation 업데이트
  - BasicInfo_CaseView 4개 description 업데이트
  - DangerZone Description Box 삭제
  - Overview/License-Billing/Preferences 등 기타 annotation 업데이트

### 2026-06-09 (Preferences WF1 + AIStudio_CaseView UI 수정)

- Language 행: 드롭다운 → `English ›` 탐색 행 패턴
- Notifications / App Settings toggle: pill toggle 복원 (ON 상태) + chevron `›`
- AIStudio_CaseView Case 2: "관리자 설정" 텍스트 (chevron 없음) — 이후 License ID 삭제로 제거

### 2026-06-09 (Preferences + Invited Projects STRUCTURE — AI 파일 `NYShAqeBVSmpQYdk3HgPwN` My Page)

- Preferences 섹션 TC + WF1 + AIStudio_CaseView 생성 (Section `6249:150`)
  - WF1: Language 드롭다운 / Notifications 토글 / App Settings 토글 + 재시작 안내
  - AIStudio_CaseView: 3케이스 (Individual/Student/Academic/Indie · License ID · Company ID)
- Invited Projects 섹션 TC + WF1(Empty) + WF2(Active) + InvitedProjects_CaseView 생성 (Section `6266:152`)
  - WF1: 빈 상태 카드 ("초대된 프로젝트가 없어요.")
  - WF2: Project Card (License Type / My Status / Contact)
  - InvitedProjects_CaseView: 2케이스 (기본 카드 · License ID + 안내 배너)
- 전체 프레임 Description 작성 완료

### 2026-06-09 (License/Billing STRUCTURE — AI 파일 `NYShAqeBVSmpQYdk3HgPwN` My Page)

- License/Billing 섹션 TC + WF1~7 + ActionRow_CaseView 신규 생성 (총 9개 프레임)
- WF1 Monthly Active: 전체 콘텐츠 구현 (LicenseInfo + PaymentMethod + BillingAddress + Invoice)
- WF2~4: WF1 clone → Action Row 수정 (Pause Scheduled / Paused / Suspended)
- WF5 Annual: Action Row 제거, Invoice 1행 Paid
- WF6 Student Benefit: 혜택 배너 추가, Invoice Upcoming $0
- WF7 License ID: 관리자 배너, PM/BA/Invoice 섹션 전체 제거
- ActionRow_CaseView: 7가지 구독 상태별 Action Row 비교
- Section `License/Billing` (`6122:338`) 래핑 완료
- 전체 WF + CaseView Description 작성 완료

### 2026-06-08 (헬퍼 함수 정비 — `.claude/skills/md_figma_wireframe/`)

- `helpers-mypage.md` 신규 생성 — 6개 함수 완전 정의:
  - `createTitleCard(text, x, y)` — W=2448, H=1216, 거의검정 bg, 오렌지 텍스트, 중앙 정렬
  - `wrapInSection(frames, sectionName)` — bounding box 계산 + 좌표 보정 + Section 래핑
  - `createActionButton(parent, label, bgColor, textColor, borderColor)` — HUG, 텍스트 CENTER 정렬 확정
  - `applyBullets(node)` — `- ` / `  - ` 파싱 → native Figma UNORDERED list
  - `makeBadge(screen, num, x, y)` — 25×25 원형 배지 (screen param 분리)
  - `makeLabel(screen, text, x, y)` — 케이스 레이블 텍스트 (screen param 분리)
- `figma-wireframe-protocol.md` 5a 수정 — 타이틀 카드 배경 `fills=[]` (오류) → 실측값 `{r:0.0606, g:0.0606, b:0.0606}` (거의 검정)로 교정
- `md_figma_wireframe/SKILL.md` — 헬퍼 함수 참조 테이블 추가 (`helpers-mypage.md` 포인터)
- `mistakes.md` 2개 항목 추가 (Unicode 원문자 사용, Company ID 삭제 경로 추측)
- `docs/backlog/projects/mypage-wf.md` 삭제 (내용 mypage-renewal.md에 통합 완료)

### 2026-06-08 (Account CaseView — AI 파일 `NYShAqeBVSmpQYdk3HgPwN` Page 7)

- `docs/policy/mypage.md` 4가지 정책 수정 (Certification 삭제, Password 분기, Email/Nickname 통합 수정 방식, Danger Zone 설명문구)
- Account_STRUCTURE (`5778:5952`) Description 수정 — Certification 어노테이션 삭제, 배지 번호 재정렬, 내용 업데이트
- `BasicInfo_CaseView` (`5997:365`) 신규 생성 — 3케이스 + Description 6노트
- `DangerZone_CaseView` (`6019:365`) 신규 생성 — 4케이스 + Description 5노트

### 2026-06-08 (Account WF 그리드 — AI 파일 `NYShAqeBVSmpQYdk3HgPwN` Page 7)

- Account 섹션 TC×WF 그리드 신규 생성 (총 13개 프레임 — TC 3 + WF 10)
- 기본 정보 행 7개 WF Board Header 텍스트 업데이트 (계정 유형별)
- CLO-SET 행 2개 WF: 미연결 / 연결됨 상태 분기
- Danger Zone 행 1개 WF: 기본 상태
- 10개 WF Description 전체 작성 (mypage.md Section 5 기반)

### 2026-06-08 (구 MyPage 파일 `PeCid7uJcg0HenViaaiHUp`)

- MyPage 5개 탭 WF 전체 완료 확인 (STRUCTURE_COMMON 3710:2163 기준)
- Slack Canvas용 My Page 정책서 초안 완성 (5탭 구조, BD·CX 대상, 합니다 체)
- 정책 3종 확정 (Invited Projects 명칭 / Team Console 명칭 / 인라인 편집 / Paused→Suspended 이메일)

### 2026-06-04

- `Personal: License/Billing — Monthly Active` (`5679:191`): Action Row 우측 정렬 + Invoice Table 헤더 재작성
- `Personal: License/Billing — Student Benefit Active` (`5680:192`): Edit Row 수정
- `Personal: Account — Individual` (`5665:204`): CLO-SET 칩 스타일 적용
- `Personal: License/Billing — Annual Active` (`5707:167`) 신규 생성 — Monthly Active clone → Annual 전용 수정
