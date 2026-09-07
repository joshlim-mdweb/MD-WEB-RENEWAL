# POLICY_MEMBER

---

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-06-23 | 계정 구조 전면 개편. MemberType 폐지, SW Account 도입, Organization 신설 |
| 2026-08-04 | 용어 정합 — `Group` → `Organization`, `CompanyID` → `Company ID` (내부 기획 용어 Group 사용 금지) |
| 2026-08-07 | CLO-SET 연동 동의 선택 → 필수 전환. §7 CLO-SET 연동 동의 정책 신설 |
| 2026-08-07 (2차) | §7의 "CompanyID/MemberType" 표현을 "레거시 미통합 Company ID 계정"으로 명확화 — 폐지된 MemberType 분류와 구분되는 실존 레거시 상태임을 명시. §3-4 Userpool 정책 신설. Legacy ID/PW 로그인 범위(§2)를 레거시 미통합 Company ID로 한정 명시. 3개 Slack Canvas(Plan Renew·Order/Checkout·Account Structure) 대조 기준 |

---

## 1. 계정 유형 (Account Types)

### 1-1. 개요

| 계정 유형 | 설명 |
|---|---|
| Non-Member | 로그인하지 않은 사용자 |
| Member | 로그인한 모든 사용자. 구 Individual / Company ID / Academic / Indie 통합 |
| SW Account | Organization Owner가 생성하는 라이선스 할당 전용 계정. 구 License ID |

> **MemberType 폐지:** 기존 Individual / Student / Company ID / Academic / Indie / License ID 구분 없음. 모든 로그인 사용자는 동일한 "Member"로 취급. 플랜 구매 자격은 인증(Verification)으로 부여.

---

## 2. Member 가입 정책

- **CLO-SET 통합 가입만 허용** — MD Web 독립 가입 미지원
- 예외: Back office에서 개별 지원 가능
- 가입 시 마케팅 수신 동의 선택, Region 기반 기본 언어 자동 설정
- **Legacy ID/PW 로그인은 레거시 미통합(un-integrated) Company ID 계정에 한해서만 유지된다.** 개인 레거시 계정은 이미 CLO-SET으로 통합 완료됐다. 상세는 `auth.md` §4, §7 참조

---

## 3. Organization 정책

> 용어: 조직 단위는 **Organization**으로 표기한다. 내부 기획 용어 `Group` 사용 금지.

### 3-1. Organization 생성

- **생성 주체:** SW Account를 제외한 모든 Member
- **생성 시점:** 플랜 구매 전 독립적으로 생성 가능 (구매가 Organization 생성을 트리거하지 않음)
- Organization을 생성한 Member = **Organization Owner**
- Organization 내 하위 권한 역할 없음 (Owner 단일)

### 3-2. SW Account 생성 및 초대

- **생성 주체:** Organization Owner만 가능
- **인원 제한:** 없음
- SW Account는 Web 로그인 없음 — 라이선스 할당 전용 마스터키로 동작
- Organization Owner가 이메일을 지정해 SW Account 하위에 초대
- 초대받은 사람은 해당 이메일로 CLO-SET 회원가입 후 사용
- **CLO-SET 통합 미지원:** SW Account(구 License ID)의 CLO-SET 계정 통합은 지원하지 않음

### 3-3. 개인 Member와 Organization

- 개인 Member도 Organization 생성 및 Enterprise 플랜 구매 가능
- 남용 방지를 위해 Abusing System을 통해 의심 계정 모니터링

### 3-4. Userpool (SW Account 재배정)

| 항목 | Legacy | Renewal |
|---|---|---|
| Enterprise Monthly → Single | SW Account 1개 제한 | SW Account 무제한 |
| Enterprise Annual → Team | SW Account 무제한 | SW Account 무제한 (동일) |

- SW Account는 프로젝트 종료 후 다른 팀원에게 재배정할 수 있다
- 시즌·스프린트 단위로 기간별 할당이 가능하다 — 사용하지 않는 라이선스가 그대로 남지 않는다
- Userpool 관리(SW Account 생성·삭제·재배정)는 Team Console에서만 수행한다

---

## 4. 인증 (Verification) 정책

인증은 특정 플랜의 구매 자격을 부여하는 행위. 인증 대상과 플랜은 레이어별로 분리.

| 레이어 | 인증 주체 | 인증 종류 | 획득 자격 |
|---|---|---|---|
| 개인 | Member (개인) | Student 인증 | Student 플랜 구매 가능 |
| Organization | Organization | Academic 인증 | Academic 플랜 구매 가능 |
| Organization | Organization | Indie 인증 | Indie 플랜 구매 가능 |
| Organization | Organization | (인증 없음) | Enterprise 플랜 구매 가능 |

### 4-1. Student 인증

- 대상: 모든 Member (개인 레벨, Organization과 무관)
- 방식: 학교 이메일 인증 또는 재학 증명서 업로드
- 완료 시: Student 플랜 구매 가능

### 4-2. Academic 인증

- 대상: Organization (Organization 레벨 인증)
- 방식: 교육기관 공식 도메인 심사 등록 → 도메인/서류 확인 후 Confirm
- 인증 서류: 정규 교육기관임을 증명하는 문서 사본 또는 PDF
- 완료 시: Academic 플랜 구매 가능

### 4-3. Indie 인증

- 대상: Organization (Organization 레벨 인증)
- 조건: 직전 사이클 연 매출 $500,000 USD 이하 사업자
- 인증 서류: 사업자 등록 서류 + 매출 증빙 서류 제출
- 자동 Reject 없음 (수동 처리)
- 완료 시: Indie 플랜 구매 가능

---

## 5. 회원 객체 필드

### 5-1. Member

| 필드 | 설명 |
|---|---|
| `userID` | 로그인 ID |
| `email` | 가입 이메일 |
| `password` | 가입 비밀번호 |
| `language` | 언어 |
| `hasLicense` | 라이선스 소유 여부 |
| `licenseStatus` | Active / Paused / Pause Scheduled / Cancel Scheduled / Suspended / None |
| `paymentInformation` | 월 구독 시 저장되는 결제 정보 |
| `invoice` | 구매 완료 시 생성 |
| `verification` | 인증 정보 (Student) |
| `coupon` | 소유 쿠폰 |
| `integration` | CLO-SET 통합 여부 |

### 5-2. SW Account

| 필드 | 설명 |
|---|---|
| `swAccountID` | SW Account ID |
| `groupID` | 소속 Organization ID — *(개발 확인 필요: 필드명은 아직 `group*` 기준)* |
| `invitedEmail` | 초대된 이메일 |
| `hasLicense` | 라이선스 소유 여부 |
| `licenseStatus` | Active / Paused / Pause Scheduled / Cancel Scheduled / Suspended / None |
| `SWAccess` | 소프트웨어 로그인/사용 가능 여부 |

### 5-3. Organization

| 필드 | 설명 |
|---|---|
| `groupID` | Organization ID — *(개발 확인 필요: 필드명은 아직 `group*` 기준)* |
| `ownerMemberID` | Organization Owner의 Member ID |
| `verification` | 인증 정보 (Academic / Indie) |
| `licenseList` | 보유 라이선스 목록 |
| `swAccountList` | 소속 SW Account 목록 |

---

## 6. 라이선스 유효성 (SW Access 판별)

| 필드 | 설명 |
|---|---|
| `startDate` | 라이선스 시작일 |
| `endDate` | 라이선스 종료일 (Perpetual은 만료 없음) |
| `Status` | 현재 날짜 기준 유효 상태 (startDate~endDate: Active, 외: Inactive) |
| `StatusAdmin` | 스태프 설정 허용 여부 (Deactivated 시 사용 불가) |
| `SWAccess` | 소프트웨어 로그인/사용 가능 여부 |

### SWAccess 케이스 매트릭스

| Case | subscriptionType | startDate | endDate | Status | StatusAdmin | SWAccess |
|---|---|---|---|---|---|---|
| 1 | Trial | 과거 | 미래 | Active | Activated | ✅ |
| 2 | Trial | 과거 | 과거 | Inactive | Activated | ❌ |
| 3 | Trial | 과거 | 미래 | Active | Deleted | ❌ |
| 4 | Monthly | 과거 | 미래 | Active | Activated | ✅ |
| 5 | Monthly | 과거 | 과거 | Inactive | Activated | ❌ |
| 6 | Monthly | 과거 | 미래 | Active | Deleted | ❌ |
| 7 | Annual | 과거 | 미래 | Active | Activated | ✅ |
| 8 | Annual | 과거 | 과거 | Inactive | Activated | ❌ |
| 9 | Annual | 과거 | 미래 | Active | Deleted | ❌ |
| 10 | Perpetual | 과거 | - | Active | Activated | ✅ |
| 11 | Perpetual | 과거 | - | Active | Deleted | ❌ |
| 12 | Perpetual + Subscription | 과거 | 미래 | Active | Activated | ✅ |
| 15 | No License | - | - | Inactive | - | ❌ |
| 16 | Annual (Reserved) | 미래 | 미래 | Inactive (Reserved) | - | ❌ |

**특이 케이스:**
- **#12:** Perpetual 보유 SW Account에 Subscription이 추가된 경우 → Subscription 플랜 기준으로 인식
- **#16-1:** 현재 Active 라이선스 보유 중 Reserve → SWAccess = True
- **#16-2:** StatusAdmin Deleted 상태에서 Reserve 발생 → SWAccess = False

---

## 7. CLO-SET 연동 동의 정책

CLO-SET 연동 동의 여부에 따라 로그인 이후 서비스 진입 가능 여부가 결정됩니다.

### 대상

SW Account는 CLO-SET 연동 확인 대상에서 제외합니다.
CLO-SET를 통해 신규 가입하는 Member는 가입 절차에서 연동을 완료하므로 대상에서 제외합니다.
**레거시 미통합(un-integrated) Company ID 계정**을 대상으로 합니다 — CLO-SET 통합 이전에 생성된 기업용 계정 중 아직 CLO-SET에 연동하지 않은 계정입니다. §1의 폐지된 MemberType 분류 체계와는 별개로 실존하는 레거시 계정 상태입니다.

### 고지

2026-09-01부터 2026-09-30까지 로그인 배너와 이메일로 정책 변경을 고지합니다.
고지 기간 중에는 로그인과 서비스 이용을 제한하지 않습니다.

### 시행

2026-10-01부터 대상 계정이 로그인하면 확인 화면을 노출합니다.
확인 화면은 닫을 수 없습니다.
체크박스를 확인하기 전까지 확인 화면 외 다른 화면으로 진입할 수 없습니다.
확인을 완료하면 로그인 시도 시점의 화면으로 이동합니다.

### 정책

체크박스는 CLO-SET 연동 필수 전환 사실을 확인했는지 여부를 확인하는 용도로 사용합니다.
체크박스 확인과 실제 CLO-SET 계정 연동은 별개로 처리합니다.
레거시 미통합 Company ID 계정은 일괄로 CLO-SET에 연동할 수 없으므로, 확인 이후 실제 연동을 유도하는 방식은 *(정책 확인 필요)*.
