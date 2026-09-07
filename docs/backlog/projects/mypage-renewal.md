---
project: mypage-renewal
updated: 2026-09-01
---

## 관련 Jira 티켓

- MDWEB (Epic 미정) — My Page 리뉴얼 5탭 재설계 (진행 중)
- 없음 (Coupon/Payment History/License-Billing 상태별 Description 작업 — 명시적 요청 전 Jira 생성 금지)

## TODO

1. **파일 크기 상한 확인 (BE)** — 프로필 이미지 업로드 상한값이 원장·Figma 어디에도 없다. Arden 코멘트에 "기존 BE는 파일 크기만 검증"이라고만 있음. 확정되면 노트 ④ `5950:1794`, 모달 `6124:1863`·`6124:1925`, `docs/policy/error-copy.md` 세 곳의 `{maxFileSize}`를 함께 치환 (TODO.md D-22)
2. **Preferred Language 모달 안내 문구 확정** — 설정이 웹사이트 문구에만 적용되는지 이메일까지 포함하는지 근거가 없어 문구를 쓸 수 없다. clone으로 잘못 들어가 있던 `Please enter a new username.`은 삭제했고 자리가 비어 있다. 모달 `6124:1881` (TODO.md D-23)
3. **Loading 상태 표기 일괄 재확인** (이월) — 이미 작성된 Description 중 "로딩 휠"로 적힌 곳을 Skeleton 기준으로 교체
   - Coupon Card (`6131:3017`, ③번 노트) — 현재 "로딩 휠"
   - Payment History Table (`6131:2615`, ①번 노트) — 현재 "*(정책 확인 필요)*"
4. **구 노트 `5442:225` 처리 판단** — `Edit v3` 섹션(`4805:5821`)에 모달 없이 hover 오버레이로 업로드하는 옛 설계가 남아 있다. 현행과 불일치하나 폐기 섹션이라 이번 범위에서 제외했다. 삭제할지 유지할지 Josh 판단

## Billing Address Description — 확정 정책 (2026-08-04)

| 항목 | 확정 |
|---|---|
| 필드명 | "Address Lable"(오타) → **Address Name** 확정 (목록 카드 `{Address Name}` 표기와 통일) — Figma는 Josh 직접 수정 |
| 등록 개수 | 현재 1개만 등록 가능. UI는 추후 다중 등록 확장을 고려한 목록형 구성 |
| Add Address 위치 | Empty: 카드 중앙 / 1개 이상: 상단 타이틀 우측 |
| Add·Edit 폼 | 별도 폼 페이지 (모달 아님). Edit 진입 시 기존 값 프리필 |
| Back Button | 입력값 있어도 별도 확인 없이 이동 (입력값 파기) |
| 인라인 에러 | Save 클릭 시점 검증 — "This field is required." (실시간 검증 아님) |
| State 분기 | 미국 선택: Dropdown + 필수 / 그 외: Text Input + 선택 |
| Remove 모달 | 외부 클릭 시 닫히지 않음. X(Close) 버튼 없음 — Cancel/Remove만 |
| 토스트 | 기본값 사용 (성공 "Changes have been saved." / 실패 "Something went wrong. Please try again.") |

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

### 2026-08-04 (Billing Address Description — 구 파일 `PeCid7uJcg0HenViaaiHUp` MyPage ✅)

- **Billing Address 목록 + Remove 모달 Description 삽입** (node `6131:2762`) — 스크린샷 기반 작성 → 9개 노트로 삽입했으나 Josh가 Remove 모달 3개 노트(모달/Cancel/Remove 버튼)를 1개로 직접 통합 → 최종 7개 노트. 기존 초안 5장(구 인터랙션 모델: 카드 내 인라인 Edit) 덮어씀
- **Add / Edit Address 폼 Description 삽입** (node `6796:3596`) — 5개 노트: ① Back Button ② Address Form ③ Country Dropdown ④ State Field ⑤ Save Button. 입력 필드 7개는 ② 한 노트로 통합 (분기 있는 Country·State만 분리)
- **신규 컨벤션 2건 확정** (메모리 + mistakes.md 기록):
  - "비즈니스 로직:" 레이블 폐기 → **"케이스 분기:"** 사용. 분기 1개면 레이블 없이 단독 불릿
  - **확인 모달은 노트 하나로 통합** — 모달 설명 + 외부 클릭 + Cancel 닫힘 불릿 + 액션 버튼 성공/실패까지 한 노트. 평탄화 분리는 화면 레벨 컴포넌트에만 적용
- 필드명 Address Name 확정 (디자인 오타 "Address Lable"은 Josh 직접 수정)
- native 불릿 + screenshot 검증 완료 (두 노드 모두)

### 2026-07-27 (TODO 일괄 완료 처리)

- 아래 항목 완료 처리 (b 항목 제외):
  - License/Billing 상태별 배너·모달 컴포넌트화
  - Coupon 협의/확인 대기 항목 확정
  - Payment History Table Error 상태 정책 확인
  - Account STRUCTURE Description 최종 확인
  - Account FEATURE 섹션 Description Panel 보강
  - figma-description.md 컴플라이언스 확인
  - License/Billing ActionRow_CaseView Description 검토
  - Slack Canvas 정책서 업로드
  - Jira Epic 생성 후 PRD 연결
  - `docs/policy/mypage.md` 잔여 업데이트
- 남은 TODO: Loading 상태 표기 일괄 재확인 (진행 중)

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

---

## Profile Picture 업로드 제약 — 확정 (2026-09-01)

근거: Arden Figma 코멘트 (노트 `5950:1789`). FE가 확장자를 jpg, jpeg, png, gif, bmp로 제한 중이고 BE도 동일하게 맞춘다. SVG는 XSS 우려로 제외.

| 항목 | 확정 |
|---|---|
| 허용 확장자 | jpg, jpeg, png, gif, bmp |
| 사용자 문구의 형식 표기 | `JPG, PNG, GIF, or BMP` — jpeg는 jpg와 같은 형식이라 화면에서는 4개만 |
| Description의 형식 표기 | 확장자 5개 전부. 개발 기준을 남긴다 |
| SVG 제외 사유 | Description에 쓰지 않는다. 부재를 설명하지 않고 허용 형식만 진술 |
| 형식 불일치 에러 | `"This file type isn't supported. Use JPG, PNG, GIF, or BMP."` |
| 크기 초과 에러 | `"This file is too large. Choose a file under {maxFileSize}."` — 상한 미확정 |
| 모달 안내 문구 | `Use a JPG, PNG, GIF, or BMP file under {maxFileSize}.` |

## 완료 로그

### 2026-09-01

- **노트 ④ Profile Picture (`5950:1794`) 재작성** — 허용 형식, 파일 선택 시 검사(유효/무효), 실패 케이스 2종(형식, 크기), Set to Default 노출 조건, Save 성공/실패를 추가. 루트 `spec.md` §7 `applyRichDescription()` 적용(허용 형식 SemiBold, 플래그 `#CC3300`)
- **모달 clone 오류 3장 정리** — `Please enter a new username.`가 Profile Image 2장(`6124:1863`, `6124:1925`)과 Preferred Language 1장(`6124:1885`)에 복제돼 있었다. 앞 2장은 업로드 안내로 교체, Preferred Language는 근거가 없어 삭제만 하고 미결로 남김
- **프레임 높이 확장** — 노트가 173에서 407로 늘어 Description이 180px 잘렸다. Contents를 2159로 키우고, Screen은 흰 배경 FILL이라 1979로 고정해 빈 여백을 막았다. 프레임이 2295가 되며 아래 Account 섹션과 겹쳐 부모 섹션 자식 중 `y >= 2463`인 것 전부(섹션 5개 + 낱개 3개)를 180px 하향 이동. 겹침 0건 확인
- **`docs/policy/error-copy.md`** Account 탭에 에러 문구 2행 추가
- **`requirements/board/patterns.md`** `파일 업로드 필드` 패턴 신설 + 오버플로 패턴에 섹션 이동·Screen FILL 함정 2줄 추가
- **`requirements/board/TODO.md`** F-20 등록(검토대기), D-22·D-23 결정 대기 2건 추가
