# Email Spec — 이메일 통합 정책

Renewal 이메일 작업의 정본이다. 트리거 발굴, 템플릿 재사용 판정, 신규 제작, 문구 작성까지 이메일에 관한 모든 작업은 이 문서에서 출발한다.

작성일: 2026-09-01

---

## 1. 참조 문서 맵

이 스펙은 지도다. 상세 내용은 아래 문서가 정본이며, 여기에 중복 기술하지 않는다.

| 문서 | 역할 |
|---|---|
| **루트 `emailTemplate.md`** | **레거시 이메일 원문 소스**: 64종 전문, 한 템플릿당 한 레코드 (Section, Type, Template, Title, Contents). 버튼은 `[레이블]` 표기. v2 양산의 원자재 |
| **루트 `emailTemplate-visual.md`** | **레거시 시각 표현 기록**: 버튼 3계열, 링크 색, 정보 박스, 경고, 오버레이 실측. 순수 레거시 캡처 |
| **루트 `email-visual.md`** | **v2 이메일 화면설계 정본**: 시각 토큰 실측(레퍼런스 2479:1017) + 컴포넌트 생성 함수 9종 (함수화). 버튼 HUG 절대규칙 |
| `docs/email/accountEmail.md` | 기존 템플릿 인벤토리: ACCOUNT 17종 (발송 조건, 수신자, Subject, Body, 변수) |
| `docs/email/subscriptionEmail.md` | 기존 템플릿 인벤토리: Subscription/Payment 26종 |
| `docs/email/trialEmail.md` | 기존 템플릿 인벤토리: Trial 8종 |
| `docs/email/systemEmail.md` | 기존 템플릿 인벤토리: System 13종 (구버전, Subject 7건이 라이브 Figma와 불일치) |
| **MY-PAGE 파일 `zpwY4fJfCeQtukQXrKeyTZ` EMAIL TEMPLATE 섹션(`109:390`)** | 구독 라이프사이클 템플릿 소스: PauseScheduled, Pause, Resume, ResumeBefore7, Suspend 1~3. 64종 밖의 별도 세트. **Suspend는 이 파일이 정본** (2026-09-08 Josh 확정) |
| `docs/email/wireframe-email-notes.md` | 와이어프레임 발송 표기 추적표: 어느 프레임 어느 노트에 어떤 템플릿을 적었는지. v2 템플릿 완성 후 이 표 기준으로 템플릿 프레임 링크를 먹인다 |
| `docs/email/subjectPatterns.md` | 제목 작성 공식: 구조 유형 4가지, 상황별 공식표, 세부 규칙 |
| `docs/email/renewal-trigger-mapping.md` | 트리거 전수 × 템플릿 매핑: 판정 결과, 신규 3건, 보류 5건, 충돌 3건 |
| `.claude/rules/ux-writing.md` | 문구 기준: EN 원본 규칙, 금지 표현, 번역 안전 |
| `docs/policy/verification.md` | OTP 인증 정책: 유효 시간, 재발송 규칙 |

Figma 정본: `EMAIL AUTOMATION` 파일(`E3Azp4DyASPSK3uQGUrxru`) node 2:59. 캔버스가 항상 최신이고 repo 인벤토리는 추출 시점(2026-09-01)의 스냅샷이다.

---

## 2. 통합 발송 정책

정책 문서 곳곳에 흩어진 이메일 발송 규칙을 한 표로 모은다. 개별 규칙의 정본은 근거 열의 문서다.

### 2.1 발송 규칙 (확정)

**발송 시점은 두 종류다** (2026-09-03 Josh 확정): 이벤트성(구매 완료, 결제 실패, 인증 결과 등)은 **즉시 발송**, 예약성(갱신 고지 D-N, 만료 임박, 시퀀스 알림)은 **UTC 오전 10시 발송**. 예외가 있는 템플릿만 TRIGGER 필드에 개별 시점을 명기한다.

| 이벤트 | 발송 | 근거 |
|---|---|---|
| Annual 자동갱신 | D-30, D-7에 고지. 갱신 청구 금액 명시 필수 | `plan.md:62`, `mypage.md:206` |
| Monthly 정기 결제 | 결제 7일 전 고지 | 기존 운영 (`All_MonthlyPaymentNotice`) |
| 결제 실패 | 즉시 접속 제한, 1주 유예 동안 알림 3회, 미해결 시 취소. Monthly, Annual, Trial 종료 후 첫 결제 동일 적용 | `plan.md:86`, `mypage.md:275` |
| Student Benefit 종료 | D-7, D-3, D-0에 청구 시작 알림 | `mypage.md:190` (충돌 1건, §4 참조) |
| Student 인증 승인 | 인증 완료 메일에 "오늘부터 4년" 고지 포함 필수 | `[MD-SITE]-student-plan-renewal.md:86` |
| Academic 인증 결과 | 이메일이 유일한 통지 채널. 화면 통지 없음 | `docs/prd/solutions/academics.md:177` |
| 인증 코드(OTP) | 발송 후 10분 유효, 재발송 쿨다운 60초, 최대 5회, 재발송 시 이전 코드 즉시 무효화 | `verification.md` |
| 구독 일시정지, 재개 | 예약 확정 즉시, 시작일 오전 10시, 재개 7일 전 예고(신청과 시작이 1주 미만이면 미발송), 재개 확정 시 | MY-PAGE 파일 EMAIL TEMPLATE 섹션, `mypage.md` §6-4 |
| Retry Payment 성공 | `All_MonthlyPaymentComplete`로 커버 (2026-09-08 Josh 확정) | `mypage.md` §6-2 |
| 마케팅 발송 | 가입 시 수신 동의가 게이트. 동의 여부로 Welcome 템플릿 분기 | `member.md:34`, `mypage.md:370` |
| CLO-SET 통합 고지 | 2026-09-01부터 2026-09-30까지 로그인 배너와 이메일로 고지 | `member.md:200` |

### 2.2 템플릿 운영 원칙

- **신규 제작 최소화.** 트리거가 생기면 먼저 `renewal-trigger-mapping.md`의 매핑표와 인벤토리 4종을 대조한다. 신규 판정은 근접 템플릿과 재사용 불가 사유를 함께 기록한 뒤에만 한다
- 판정 3등급: 재사용, 문구 수정, 신규. 집계와 개별 판정은 `renewal-trigger-mapping.md`가 정본이다
- **확정 신규는 3건이다** (2026-09-08 Josh 확정): `Student_VerificationCode`(완성, Student 전용), `All_ChangeEmailVerificationCode`(이메일 변경 OTP), `Student_VerificationComplete`(코드 인증 즉시 완료 통지, 4년 시작 고지). **코드 인증 템플릿은 어드민 추적을 위해 용도별 개별 코드로 만든다.** 2026-09-01의 공용 재사용 방침은 폐기. 비밀번호 변경은 이메일을 사용하지 않고, 비밀번호 찾기는 레거시 계정 한정으로 이메일 링크(`Enterprise_ResetPwRequest`)를 유지한다. Legacy Student 혜택 안내와 CLO-SET 통합 고지는 템플릿 제작 범위에서 제외 (매핑 문서 §신규 참조)
- **`Enterprise_UpgradeOrderComplete` 폐기** (2026-09-08 Josh 확정): Add, Extend, Convert 결제 완료도 신규 구매와 같은 `Enterprise_AnnualOrderComplete`를 쓴다
- 용어는 Renewal 기준으로 교체한다: Personal은 Individual로, License ID는 SW Account로, Userpool은 Organization 체계로. 폐지 용어 기준은 `localization.md` §2.1
- 금액은 `n USD` 표기, 날짜는 월을 단어로. 기준은 `ux-writing.md` §1.1

### 2.3 제목과 본문 작성

- 제목은 `subjectPatterns.md`의 상황별 공식을 따른다. 새 유형을 만들지 않는다
- 본문은 §4 문구 스타일(블록 6종 표준)을 따른다. 기존 발송본의 위반은 소급 수정하지 않되 신규 작성분에 반복하지 않는다

---

## 3. EMAIL CONTENTS v2 필드 (2026-09-01 신설)

Renewal 템플릿 세트는 `EMAIL AUTOMATION` 파일의 새 페이지 **`EMAIL CONTENTS v2`**(node `2007:2`)에 와이어프레임으로 구축한다. 레거시 64종은 구 페이지 `EMAIL CONTENTS`(`2:59`)에 그대로 둔다. 프레임 규격은 루트 `spec.md` §2를 따른다 (Outer 2448×1216, Screen 1920, Description 패널).

**2026-09-09 캔버스 초기화**: v2 페이지 콘텐츠 전량 삭제 후 재구축한다. 이전 v2 node ID는 전부 무효다.

**페이지 최상위 섹션은 카테고리 4개에 제거 대상 1개다**: `Account`, `Subscription and Payment`, `Trial`, `System` (2026-09-09 복귀 확정), 그리고 맨 아래 `확인 후 제거 대상` (2026-09-11 신설, §3.1). 판정 상태(신규, 수정, 원본 유지)는 §3.1 Border 색과 Board Header 병기로만 표시한다. 상태 3섹션 구조와 AS IS 레거시 클론 나란히 배치(2026-09-08 방식)는 폐기됐다.

### 3.1 상태 Border 스펙

Outer Frame의 stroke가 템플릿 판정을 표시한다. 페이지 좌상단 범례 카드(`2355:2`)와 1:1.

| 상태 | HEX | 굵기 | 의미 |
|---|---|---|---|
| 신규 | `#2BA84A` | 20 | 근접한 기존 템플릿이 없어 새로 만든 것 |
| 수정 | `#F5A623` | 20 | 트리거는 같고 용어와 문구를 고친 것 |
| 원본 유지 | `#D1D1D1` | 2 | 레거시 템플릿을 문구 그대로 재사용 |
| 확인 후 제거 | `#CC3300` | 20 | Renewal에서 쓰지 않는 레거시 (2026-09-11 신설) |

**굵기는 원본 유지만 2이고 나머지 3종은 20이다** (2026-09-11 Josh 확정, 구 8에서 상향). 캔버스를 축소한 상태에서도 손댄 템플릿이 한눈에 구분되게 하려는 것이다. 원본 유지가 가장 많아서 이쪽을 얇게 두면 손댄 것만 도드라진다. stroke는 INSIDE이고 Outer 패딩이 24라 20까지는 내용이 잘리지 않는다.

상태 표시는 Border 색이 전부다. Board Header에는 상태를 병기하지 않는다 (2026-09-09 Josh 확정).

**제거 대상도 캔버스에 남긴다** (2026-09-11 Josh 확정). 빠진 템플릿이 왜 빠졌는지 캔버스만 봐도 알 수 있어야 한다. 최상위 섹션 `확인 후 제거 대상`에 레거시 클론 그대로 두고 붉은 Border를 입힌다. 이 섹션의 프레임은 현행 규격으로 재제작하지 않는다. 하위 섹션은 사유 3개다: `폐기`, `Legacy 소진 대기`, `확인 필요`.

### 3.2 Description 공통 골격 (2026-09-01 4차 확정: 레거시 필드 세트 + TITLE)

Description에는 **레거시 필드 세트만** 들어간다. 번호는 필드 고정 순번이다 (화면 요소 배지가 아니며, Screen에 배지를 달지 않는다). 전 템플릿이 이 7카드를 이 순서로 쓴다.

| 카드 | 배지 | 내용 |
|---|---|---|
| `[템플릿 코드]` | 없음 | TITLE 카드 |
| UPDATE DATE | 없음, 오렌지 대문자 라벨 | 작성일 또는 개정일 (유일한 무번호 필드) |
| TARGET | ① | 수신자 |
| TRIGGER | ② | 발송 조건. 재발송 규칙, 유효 시간 등 발송 동작 전부 (레거시 DESCRIPTION 필드 계승 — 패널 헤더 DESCRIPTION과의 혼동을 피해 개명, 2026-09-03 Josh 확정) |
| LINK or Button | 3-1 | `[버튼명]:` 클릭 결과. 없으면 `-` |
| VALUE | 3-2 | `{변수명}: 정의`. 금액 `n USD`, 날짜는 월 단어. 없으면 `-` |
| COMMENT | ④ | 참고사항과 미결 플래그만. 기본 `-`. 변경 내역은 쓰지 않는다 (컴포넌트에 연결한 annotation이 담당) |

**변경사항 기록 (2026-09-09 4차 개정, Josh 확정): Figma native annotation으로 작성한다.** 형식은 두 줄 고정, 실제 문자열이나 상태를 그대로 적는다:

```
AS IS: {이전 문자열 또는 상태}
TO BE: {바뀐 문자열 또는 상태}
```

**annotation은 변경 대상 컴포넌트 노드에 정확히 연결한다. Screen이나 Wrapper에 대충 붙이지 않는다** (절대규칙). 템플릿 차원의 변경도 해당되는 가장 가까운 요소에 단다. 남이 읽는 말로 쓰고 내부 작업 용어(배치, 양산, 스펙 절 번호)는 금지. annotation은 스크린샷과 export에 찍히지 않는다 (Figma 캔버스와 Dev Mode에서만 보임). 미결 사항은 Description의 COMMENT 필드에 `*(정책 확인 필요: 무엇)*` 플래그로.

폐기 이력: 1차 `**수정: 제목**` + ASIS/TOBE 전사(09-03), 2차 포인터와 이유(09-07), 3차 무기록 + AS IS 클론 대조(09-07~08) 전부 이 4차로 대체.

넣지 않는 것: STATUS 카드(Border 색 + Board Header가 담당), Subject 카드(화면에 보임), 제목 유형 등 분석성 줄, 화면 요소별 번호 노트, `→ COMMON 참조` 카드.

**노트 카드 디자인 (RENEWAL Design 파일 TOBE 기준, 노드 `0eVqTgd0vqpLXNQlScoEb7` 1891:34773)**: 흰 카드 + 테두리 `#D1D1D1` 1px + radius 6 + pad 8 + gap 8, 컨테이너 gap 10. 배지 원형 25px `#E25927` + 흰 번호 Medium 12 (`3-1` 같은 복합 번호는 같은 색 pill, 높이 25 폭 HUG). 제목 Poppins Medium 13 `#1A1A1A`, UPDATE DATE 라벨만 `#E25927`. 본문 Poppins Regular 12 `#333333`, **native 불릿 필수** (중요 SemiBold `#18181E`, 플래그 `#CC3300`).

공통 푸터와 Common Links는 페이지 `COMMON` 섹션(`2356:2`)에서 1회만 정의한다. 레거시처럼 템플릿마다 반복하지 않는다.

### 3.3 네이밍 (2026-09-01 정정: 템플릿명은 코드다)

템플릿명은 `All_MonthlyPaymentStart`처럼 `{Target}_{Event}` 형식의 **템플릿 코드**다. 사람용 풀어쓰기를 만들지 않는다.

- **수정, 원본 유지 템플릿은 레거시 코드를 그대로 유지한다** (발송 시스템 식별자이므로 개명 금지, `Personal_` 접두 포함 — 코드는 식별자라 폐지 용어 규칙의 예외)
- 신규만 같은 컨벤션으로 새 코드를 짓는다. 예: `Student_VerificationCode`
- Board Header: `{카테고리} | {템플릿 코드}` (2026-09-09 Josh 확정: EMAIL 접두와 상태 병기 제거. Main Label = 카테고리, Sub Label = 템플릿 코드, 코드는 대문자 변환하지 않음)
- 섹션 4개: `Account`, `Subscription and Payment`, `Trial`, `System` (2026-09-09 카테고리 구조 복귀)

### 3.4 화면설계 스타일 (2026-09-03 확정)

이메일 뷰의 시각 정본은 Josh 확정 레퍼런스 프레임(`2479:1017`)이며, 실측 토큰과 생성 함수는 **`email-visual.md`**에 있다.

- **버튼과 내부 텍스트는 무조건 HUG.** 고정 폭 금지 (절대규칙)
- **컴포넌트 재활용**: v2 페이지 `Email Components` 섹션에 마스터 컴포넌트 7종 — `Email/Subject`(`2490:160`), `Email/Paragraph`(`2490:162`), `Email/CTA Button`(`2490:164`), `Email/Code Block`(`2490:166`), `Email/Sign-off`(`2490:168`), `Email/Footer`(`2490:172`), `Email/Info Block`(`2491:173`, §4.3 키 9행 내장, 인스턴스에서 안 쓰는 행은 숨김). 템플릿은 인스턴스로 조립하고, 마스터 수정이 전 템플릿에 전파된다
- Wrapper, Container, Body는 컴포넌트가 아니라 레이아웃 함수(`createEmailWrapper()`)로 만든다: 문단 수가 템플릿마다 달라 구조를 잠그지 않는다
- 본문 텍스트 스케일: Subject Medium 20, 문단 Regular 14, 버튼 Medium 14, 맺음 14+16, 푸터 11 (실측표는 `email-visual.md` §1)

### 3.5 기획 문서 산출물 규칙 (2026-09-09 Josh 확정)

- **"판정" 같은 내부 판단어를 산출물에 쓰지 않는다.** 리스트 제목은 내용으로 쓴다: `V1 유지 대상`, `수정 대상`, `신규 제작`, `이관 제외`
- **문서 프레임의 메인 제목은 내용 제목이다** (`정책 변경사항`, `템플릿 리스트`). 순번 제목은 같은 문서를 분할할 때만 쓴다
- 개발과 디자인과 비즈니스가 함께 읽는 섹션(정책 변경사항 등)은 고유명사를 제외하고 합니다체로 쓴다
- 리스트 표는 형식을 통일한다: 한 템플릿이 한 줄, 2컬럼 (템플릿, 설명이나 비고)
- Jira 에픽 게시는 담백하게: 템플릿 리스트는 유지, 수정, 신규 3종만 싣는다 (이관 제외는 PRD에만)

### 3.6 진행 상태 — 양산 배치 (2026-09-03 순서 확정)

**캔버스 그룹핑**: 카테고리 섹션 4개. 각 섹션 Row 1 = 수정과 신규 (앰버, 그린), Row 2 이하 = 원본 유지 (회색). **원본 유지도 셸과 본문을 전부 현행 규격으로 만든다** (2026-09-10 셸, 2026-09-11 본문, Josh 확정): 레거시에서 가져오는 것은 문구뿐이고 담는 그릇은 전부 v2 컴포넌트다. 레거시 클론을 그대로 두는 방식(2026-09-09)과 셸만 바꾸는 방식(2026-09-10)은 폐기됐다.

**본문 이식 규칙 (2026-09-11 확정)**

| 레거시 | v2 |
|---|---|
| 통짜 텍스트 한 덩어리 | 문단 단위 `Email/Paragraph` 인스턴스, 간격 16 |
| 본문 안에 섞인 제목 | `Email/Subject` 인스턴스로 분리 |
| 독립 동작의 `[레이블]` | `Email/CTA Button` 인스턴스 |
| 문장 안의 `[레이블]` | 대괄호를 지우고 인라인 링크 색 `#4A9DFF` |
| `키: 값` 나열 | `Email/Info Block` 인스턴스 |
| 본문에 적힌 맺음과 푸터 | `Email/Sign-off`, `Email/Footer` 인스턴스 (표준 문구로 통일) |
| 이미지 | 회색 `#E6E6E6` 프레임에 `Image` 한 줄 (와이어프레임 표기) |
| 섹션 제목 줄 | Paragraph를 Poppins Medium 14 `#18181E`로 |

문구는 옮겨 적기만 한다. 예외 3가지는 규격이 이기는 항목이라 이식 시 교체한다: **변수 키는 §4.6 사전 표기로 통일**, **더미값은 변수로 교체**(`YYYY.MM.DD`를 `{expiryDate}`로), **명백한 오타는 수정**(2026-09-11 Josh 확정. `charged charged`와 `hesistate` 2건 처리).

**하위 섹션 (2026-09-09 Josh 확정)**: 템플릿이 많은 카테고리는 섹션 안에 수신 대상별 하위 섹션을 둔다. Subscription and Payment는 `All`, `Individual`, `Enterprise` 3개 (템플릿 코드 접두 기준, Personal_ 코드는 Individual 섹션에). **하위 섹션은 세로로 쌓고, 템플릿은 하위 섹션 안에서 가로로 나열한다.** 원본 유지 이관분도 해당 하위 섹션의 Row 2 이하로 넣는다.

**진행 상태는 2026-09-09 캔버스 초기화로 리셋됐다.** 아래 완료 표시는 문구와 판정 결정의 완료를 뜻하고, 프레임은 전부 재제작 대상이다.

| 배치 | 내용 | 선행 조건 | 상태 |
|---|---|---|---|
| 견본 | 수정 `All_MonthlyPaymentStart` (인프라 재구축: 컴포넌트 7종, COMMON, 범례, 카테고리 4섹션 포함). 신규 `Student_VerificationCode`는 배치 3에서 재제작 | 없음 | 완료 (2026-09-09, Josh confirm) |
| 1 | 구매·주문 완료 3종: Personal_AnnualOrderComplete(자동갱신 반전), Enterprise_AnnualOrderComplete, All_MonthlyPaymentCancel(Annual 겸용). Enterprise_UpgradeOrderComplete는 폐기(2026-09-08)로 제외 | 없음 | 완료 (2026-09-09) |
| 2 | 갱신·만료 고지 3종: All_MonthlyPaymentNotice(**갱신 고지 통합**: Annual D-30과 D-7, Monthly D-7. Personal_AnnualExpiring14 폐기, 2026-09-09 확정), Enterprise_AnnualExpiring14 CompanyID와 EndUser(버튼 Extend Licenses). ~~Convert 변형 신설~~ 취소 (Upgrade 폐기로 겸용) | 없음 | 완료 (2026-09-09) |
| 3 | 인증·계정 7종: Student_VerificationCode(재제작), Student_DocRegisterSuccess(4년 고지, 1주 구매 제한 폐지), Academic_RegisterApprove, All_UserpoolInvitation(SW Account 개편, 웹 로그인 오해 방지), Enterprise_UserpoolMemberAdded(코드 공백 오타 정리) + 신설 2장: All_ChangeEmailVerificationCode, Student_VerificationComplete. Account 섹션에 하위 섹션 4개(All, Student, Academic, Enterprise) | 없음 | 완료 (2026-09-09) |
| 4 | Enterprise Trial 문의 2종: 개선된 신청 폼 필드와 DNS 검증 결과 반영, China 조건부 연락처 | 없음 | 완료 (2026-09-09) |
| 5 | 시퀀스와 라이프사이클 9장: Suspend 1(+3DS 변형)과 3 (기준 MY-PAGE), TrialExpiring3Continue 개정(24시간 환불 고지 포함), **Student_BenefitEnding 신설 1장** (파생 3장 통합: D-7, D-3, D-0 같은 템플릿 3회 발송, 2026-09-09 확정), Pause와 Resume 4종 | 없음 (미결 2건 해소: D-7/D-3/D-0, 알림 3회 = 이메일 Suspend 구조) | 완료 (2026-09-09) |
| 상시 병행 | 원본 유지 28종 이관 (해당 카테고리·하위 섹션 Row 2 이하, 현행 셸 + 레거시 본문 원문 이식, 회색 border 2, 리뷰 게이트 없음) | 없음 | 완료 (2026-09-11 본문 재조립까지) |
| 마무리 | 제거 대상 19종을 `확인 후 제거 대상` 섹션으로 이관 (레거시 클론 그대로, 붉은 border 20, 사유별 하위 섹션 3개) | 없음 | 완료 (2026-09-11) |

**2차 개정 (2026-09-11)**: Klay의 1년 구독 정책 문의를 계기로 신규 필요 템플릿을 재점검해 4종을 더했다. v2는 **57종**(유지 26, 수정 26, 신규 5), 제거 대상은 **16종**이다.

| 변경 | 내용 |
|---|---|
| Student 전용 복원 2종 | `Student_MonthlyPaymentStart`, `Student_MonthlyPaymentCancel`을 제거 대상에서 되살려 Renewal 정책으로 재작성. `All_MonthlyPaymentStart`와 `All_MonthlyPaymentCancel`의 Student 겸용은 해제. 레거시 발송 시스템도 All 템플릿에서 Student를 제외하고 있었다 (`docs/email/subscriptionEmail.md:436,612`) |
| 본문 제작 1종 | `All_MonthlyPaymentFail_3DS`. 레거시 캔버스가 비어 있었고 Jira MDWEB-831이 발송을 요구한다 |
| 신규 1종 | `Student_DocRegisterReceived` (서류 접수 확인). Academic에는 있고 Student에는 없던 단계 |
| 재분류 2종 | `Personal_SubscriptionSuspend2`와 `All_ContactUs`를 원본 유지에서 수정으로. 결제수단 변경이 PayPal과 AliPay에서 불가능한 점과 답변 수신 이메일이 별도 필드로 바뀐 점을 반영 |
| 제거 대상 사유 기재 | 16종 각각에 native annotation `사유: {한 문장}` 부착 |

**Student 전용 템플릿 작성 제약** (`plan.md:71,91,94`, `mypage.md:164,169,263`): Trial 단어 금지, 24시간 환불 고지 금지(Student는 Trial 24시간 룰 미적용), Benefit 기간 중 취소와 일시정지 안내 금지, 평생 1회 할인 문장 금지(구매 횟수 제한 없음).

**캔버스 초기 구성 (2026-09-11 오전 기준)**: 레거시 64종 = v2 이관 45종 + 제거 대상 19종. v2 제작 53종 = 이관 45종 + 신규 8종 (완전 신규 4종, MY-PAGE 파일에서 편입한 구독 라이프사이클 4종). 제거 대상 내역은 폐기 9종(`Enterprise_UpgradeOrderComplete`, `Personal_DeleteUser`, `Student_VerifyStudent`, `EnterpriseVerifyEmail`, `Enterprise_OfflineKeyComplete`, `Personal_AnnualExpiring14`와 `7`과 `3`과 `1`), Legacy 소진 대기 7종(`Student_MonthlyPaymentStart`, `Student_MonthlyPaymentCancel`, `Enterprise_MonthlyExpiring7`, `Enterprise_StandaloneAnnualExpiring14CompanyID`와 `7`과 `3`과 `1`), 확인 필요 3종(`Enterprise_VerifyEmailJoin`, `All_MonthlyPaymentFail_3DS`, `Enterprise_DeleteEndUser`)이다. 레거시 캔버스의 `Enterprise_StandaloneAnnualExpiring1CompanyID` 완전 중복 1건은 옮기지 않았다.

**원본 유지 이관 기록 (2026-09-09 이관, 2026-09-10 셸 재제작, 2026-09-11 본문 재조립 완료)**: 28종 전부 v2 셸(Board Header `{카테고리} | {코드}`, Description 7카드, 회색 Border 2)로 다시 만들고, 본문도 위 이식 규칙에 따라 v2 컴포넌트로 재조립했다. 이로써 53종 전부 동일 규격이고 Poppins 단일 폰트다 (레거시는 Avenir Next 계열 혼용). Description은 레거시 노트(UPDATE DATE, TARGET, DESCRIPTION은 ②TRIGGER로, LINK or BUTTON, VALUE, COMMENT)를 7카드에 옮겨 적었고, COMMON LINK 카드는 COMMON 섹션이 담당하므로 제외했다. 레거시에 없는 카드 값은 `-`로 뒀다. 배치는 카테고리·하위 섹션 코드 접두 기준이며, Userpool 계열과 Welcome, Deactivation은 배치 3 전례에 따라 Account에 편입했다.

- Account 14종: All 4 (Welcome 2종, UserpoolSoftwareShared, Deactivation), Student 3, Academic 2, Enterprise 1 (ResetPwRequest), **Indie 하위 섹션 신설**(`2581:2484`) 4
- Subscription and Payment 3종: All 2 (MonthlyPaymentComplete, MonthlyPaymentFail), Individual 1 (Suspend2)
- Trial 5종: Personal 하위 섹션에 TrialStart, HelpTrial, TrialExpiring3Cancel, TrialCancel, TrialExpiry
- System 6종: **하위 섹션 All(`2581:3685`), Personal(`2581:3686`) 신설.** All 3 (ContactUs, ForumComments, OfflineAuth), Personal 3 (LearningContents 1~3)
- 정정 1건: 레거시 섹션명 중복 `Indie_RequestApproved` 2개 중 내용이 Denied인 판(`1778:2590`)을 클론해 **`Indie_RequestDenied`로 이름 정정** (레거시 페이지는 수정하지 않음)
- Suspend2: MY-PAGE 판(`1649:786`)과 레거시 판(`2292:988`)이 동일본(2024.11.14 개정)으로 확인돼 레거시 클론 사용
- 확인 플래그: `Personal_LearningContents3` 레거시 원본에 "보류 중" 오버레이 존재. 문구는 온전하나 발송 운영 여부 확인 필요

## 4. 문구 스타일 (EN) — 이메일 블록 6종 표준

2026-09-03 확정. 이메일 본문은 EN만 다루며, 모든 이메일이 아래 블록 순서를 따른다: **서문 → 리드와 본문 → 정보 블록(해당 시) → 버튼(해당 시) → 마무리 안내 → 맺음**. 공통 전제는 `ux-writing.md` §1.1이다 (현재 시제, 능동, 2인칭, 문장 20단어 이내, 느낌표 금지, Successfully와 Sorry 금지, Oxford comma). 근거: 레거시 64종 정량 분석 (`emailTemplate.md`, 서문 6변형, 맺음 3변형, 우회 관용구 다수).

### 4.1 서문 (Greeting)

`Hello,` 한 종으로 고정한다. 개인화 변수를 쓰지 않는다: 레거시의 `Hi {userID},`, `Hello {Company Name},`은 폐기 (값이 없을 때 깨지고 번역에서 어순이 무너진다). Staff 내부 메일(BIZDEV 수신)만 서문 생략을 허용한다.

### 4.2 리드 문장과 본문 (Body)

첫 문장이 이 메일이 온 이유를 직접 진술한다 (결과 먼저). 우회 관용구 폐기 표:

| 폐기 (레거시 실측) | 대체 |
|---|---|
| `This is to inform you that X` | X를 그대로 문장으로: `Your subscription is canceled.` |
| `This is a friendly reminder that X` | 사실 직접 진술: `Your subscription renews on {date}.` |
| `We are writing to inform you that X` | 동일 |
| `We regret to inform you that X` | 사실 + 다음 행동: `Your payment didn't go through. Update your payment method to keep your subscription.` |
| `Thank you for purchasing!` | 구매 완료 계열만 유지하되 느낌표 제거: `Thank you for your purchase.` |
| `Last step!`, `We are excited to ...`, `We are thrilled to ...` | 감탄과 감정 연출 제거 |

유형별 리드 공식:

| 이메일 유형 | 리드 공식 | 예 |
|---|---|---|
| 완료 통지 (구매, 취소, 변경) | `Your {대상} is {상태}.` 또는 `Thank you for your purchase.` + 요약 1문장 | Your order is confirmed. |
| 사전 고지 (갱신, 만료, 청구) | `Your {대상} {동사}s on {date}` + 금액 명시 | Your subscription renews on October 3, 2026 for 280 USD. |
| 행동 필요 (결제 실패, 인증 요청) | 무슨 일이 있었는지 1문장 + 무엇을 하면 되는지 1문장 | Your payment didn't go through. Update your payment method to keep your subscription. |
| 인증 결과 | `Your {대상} is verified.` 실패는 사유 + 재시도 경로 | Your student status is verified. |

본문은 최대 3문단, 문단당 1~2문장. 제약(기간 제한, 만료, 환불 불가)은 행동 요구보다 먼저 알린다.

### 4.3 정보 블록 (결제, 주문, 라이선스)

회색 박스 1개. **Title Case 키 고정 세트를 이 순서로만 쓴다.** 해당 없는 키는 뺀다.

```
Plan: {product name}
Billing Cycle: Monthly | Annual
Order Date: January 1, 2026
Amount: 280 USD
Payment Method: Stripe | PayPal | Alipay
Next Payment Date: {date}         구독형만
Expiry Date: {date} (GMT)         선불형만
Seats: {n}                        Organization만
SW Account: {account name}        Organization만
```

레거시의 ALL CAPS 키(`LICENSE:`, `TYPE:`, `EXPIRATION DATE:`), `Target License ID`, 오타 키(`GUSET EMAIL`)는 전부 폐기. 금액은 `{price} USD` (통화 기호 금지), 날짜는 월을 단어로.

### 4.4 버튼 (Action)

주 CTA는 1개. Title Case, 목적어 포함: `Update Payment Method`, `Verify My Student Email`. 소형 카드 버튼 나열(Welcome, 러닝 콘텐츠 계열)은 콘텐츠 카드당 1개를 유지한다. `Click here` 금지. 버튼이 자명하면 버튼 앞 안내 문장은 생략한다.

### 4.5 마무리 안내 (Support line)

한 문장으로 고정한다: **`If you have any questions, please [contact us].`**
폐기: `do not hesitate to`, `don't hesitate to`, `questions or concerns`, `We apologize for any inconvenience`.

### 4.6 변수 키 사전 ★

**화면에 더미값을 쓰지 않는다. 가변 값은 전부 `{키}` 표기다** — 정보 블록 값, 본문 인라인, Subject 인라인, OTP 코드까지. 값에만 `{}`를 쓰고 고정 레이블에는 금지. 금액은 `{price} {currency}`, 고정 문자는 키 밖에(`{expiryDate} (GMT)`).

**Screen 안 `{키}` 토큰은 텍스트 색 `#E25927`** (2026-09-03 Josh 확정). 키를 감싼 고정 문자((GMT) 등)와 문장 나머지는 본문 색 유지. Description 패널의 키 표기에는 적용하지 않는다.

**표준 키는 camelCase다** *(개발 확인 필요: 실제 발송 시스템의 키 표기 대조)*. 레거시 올드 버전(`EMAIL CONTENTS` 페이지)에서 수집한 66종을 아래로 분류했다. 각 템플릿의 Description VALUE 필드는 그 화면이 쓰는 키와 1:1이어야 한다. 사전에 없는 키가 필요하면 여기 등록부터 한다.

**표준 키 (레거시 계승, camelCase 통일)**

| 키 | 의미 | 레거시 변형 |
|---|---|---|
| `{price}` | 결제 금액 | {Price} |
| `{currency}` | USD 또는 CNY | {Currency} |
| `{orderDate}` | 결제 완료 날짜 | {Order Date} |
| `{paymentMethod}` | 결제 수단 | {Payment Method} |
| `{nextPaymentDate}` | 다음 결제 예정일 | {Next Payment Date}, 오타 {Next Payment Date Date} |
| `{nextPrice}` | 다음 결제 금액 | {Next Price} |
| `{expiryDate}` | 이용 기간 마지막 날 | {Expiry Date}, {expirationDate} |
| `{subscriptionType}` | Monthly 또는 Annual | {Subscription Type} |
| `{productName}` | 플랜명 | {product name}, {Product Name} |
| `{paymentFailureDate}` | 결제 실패 시점 | {Payment Failure Date} |
| `{subscriptionCancelDate}` | 구독 취소 확정일 | 변형 3종 통일 |
| `{userID}` | 계정 userID | {user ID} |
| `{name}`, `{email}`, `{companyName}`, `{country}`, `{city}` | 신청 폼 값 | {Name}, {Company Name} 등 |
| `{schoolName}`, `{schoolWebsiteURL}` | Academic 신청 값 | {School Name}, {School website URL} |
| `{trialStartDate}`, `{trialExpiryDate}` | Trial 기간 | {Trial start date} 등 변형 |
| `{subscriptionStartDate}` | Trial 종료 후 구독 시작일 | {Subscription Start Date} |
| `{memberEmail}`, `{joinedDate}`, `{joinedPath}` | 멤버 추가 내역 | {Member Email}, {JOINED DATE}, {JOINED PATH} |
| `{requestedLicenseName}` | 원격 로그아웃된 라이선스 | {Requested License Name} |
| `{FORM1_FULL NAME}` ~ `{FORM8_INQUIRY}` | Enterprise Trial 폼 필드 | 폼 시스템 키라 원형 유지 (변형 {FORM 4_COMPANY NAME} 등은 통일 대상) |

**신규 키 (Renewal 신설)**

| 키 | 의미 | 쓰는 템플릿 |
|---|---|---|
| `{otpCode}` | 이메일 인증 코드, 6자리 난수 | Student_VerificationCode, All_ChangeEmailVerificationCode |
| `{seats}` | Seat 수 | Organization 주문 계열 |
| `{swAccount}` | 라이선스를 배정한 SW Account | Organization 주문 계열 |
| `{organizationName}` | Organization 이름 | 초대, 멤버 추가 계열 |
| `{pauseStartDate}`, `{resumeDate}` | 일시정지 시작일과 재개일 | Pause와 Resume 계열 |
| `{benefitEndDate}` | Student Benefit 마지막 날 | Student_BenefitEnding |
| `{jobTitle}`, `{companyWebsite}`, `{companyDomain}` | Enterprise Trial 신청 값 | Trial 문의 2종 |
| `{organizationType}`, `{trialPurpose}`, `{adoptionTimeline}`, `{currentUsage}`, `{additionalNotes}` | 개선된 신청 폼 값 (2026-09-09 등록) | Trial 문의 2종 |
| `{dnsCheckResult}` | 도메인 DNS 검증 결과 (pass, fail, skip) | Enterprise_TrialInquiryStaff |
| `{wechatID}`, `{mobileNumberChina}` | 국가가 China인 경우의 연락처 | Trial 문의 2종 |

**폐지 키 (v2 미사용)**

| 폐지 | 대체 |
|---|---|
| {License ID}, {Company ID} | `{swAccount}`, `{organizationName}` (계정 구조 변경) |
| {Headquarter Name} | `{organizationName}` |
| {Deleted License ID} | 대체 후보 `{deletedSWAccount}` *(해당 템플릿 이관 시 확정)* |
| 설명문이 중괄호에 들어간 가짜 키 6종, 더미 키({bb@email.com} 등) | 키 아님, 사용 금지 |

### 4.7 맺음 (Sign-off)

고정, 변형 금지. 뒤에 COMMON 푸터가 따른다.

```
Best,
Marvelous Designer Team
```

레거시의 `Best regards,` + `The Marvelous Designer team.` 계열과 소문자 `team`은 전부 이 표기로 통일한다.

## 5. 작업 파이프라인

1. 트리거 발굴: 정책 문서와 PRD에서 발송 문장을 찾으면 매핑 문서의 표에 행을 추가한다
2. 판정: 인벤토리 4종 전 카테고리를 검색한 뒤 3등급 판정. 레거시 명명 때문에 못 찾는 경우가 있으니 이름이 아니라 발송 조건으로 찾는다
3. 문구 작성: 제목은 `subjectPatterns.md` 공식, 본문은 §4 블록 6종 표준. 출력 전 `/copy-review`
4. 반영: Figma `EMAIL AUTOMATION` 캔버스가 정본이므로 확정 문구는 캔버스에 반영하고, repo 인벤토리는 추출 스냅샷으로 유지한다

---

## 6. 미결 (Josh 결정 대기)

| # | 항목 | 쟁점 |
|---|---|---|
| 1 | ~~Benefit 종료 알림 주기~~ 해소 (2026-09-09) | **D-7, D-3, D-0 확정** (`mypage.md` 기준. `student-license-promotion.md`의 D-7/D-1은 폐기) |
| 2 | ~~"알림 3회" 채널과 타이밍~~ 해소 (2026-09-09) | **이메일 3회, Suspend 구조 확정**: 실패 직후 1차(Suspend1), 유예 중간 2차(Suspend2), 유예 만료에 취소 확정 3차(Suspend3) *(개발 확인 필요: 정확한 재시도 결제 일정)* |
| 3 | 이메일 언어 | Preferred Language 적용 여부 근거 없음 (TODO.md 결정 대기 D-23) |
| 4 | Paused에서 Suspended 전환 알림 | 발송 여부 미결 (`[MD-SITE]-mypage-redesign.md:371`) |
| 5 | 주문 완료 메일의 정책 근거 | `checkout.md`에 이메일 규정 0건. Checkout 정책에 명문화 필요 |

## 관련 문서

- PRD: Figma `E3Azp4DyASPSK3uQGUrxru` EMAIL CONTENTS v2 페이지. 문서 프레임 4개: `Email Template PRD`(`2536:2`), `정책 변경사항`(`2541:2`), `템플릿 리스트`(`2544:2`), `Email Template Version Table`(`2539:56`)
- 티켓: MDWEB-955 (에픽, 판정 리스트 게시), 하위 MDWEB-956 UX, 957 PD, 958 FE, 959 BE
- 매핑: `docs/email/renewal-trigger-mapping.md`
- 인벤토리: `docs/email/accountEmail.md`, `subscriptionEmail.md`, `trialEmail.md`, `systemEmail.md`
- 제목 공식: `docs/email/subjectPatterns.md`
- Figma: `EMAIL AUTOMATION` `E3Azp4DyASPSK3uQGUrxru` node 2:59
