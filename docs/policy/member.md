# POLICY_MEMBER

Source: https://clo.atlassian.net/wiki/spaces/MDT/pages/3120070692/POLICY_MEMBER

---

## 1. 회원 유형 (MemberType)

| MemberType | 시스템 명칭 | 설명 |
| --- | --- | --- |
| Non-Member | - | 로그인하지 않은 사용자 |
| Personal | Personal | 일반 개인 계정. CLO-SET 통해 가입, 개인용 라이선스 사용 |
| Student | Student | 개인 회원 중 학생 인증 완료. 할인 학생 라이선스 구매 가능 |
| CompanyID | Company ID | 기업 대표 계정. License ID 생성 및 라이선스 구매/관리 |
| Academic | Academic Company | CompanyID 중 교육기관 인증 완료. 할인 라이선스 이용 가능 |
| Indie | Indie | CompanyID 중 Indie 인증 완료. 할인 라이선스 이용 가능 |
| License ID | License ID | CompanyID 하위 실무자 계정. 동시접속 Copy 수만큼 접속 가능 |

---

## 2. 회원 가입 정책

### Personal
- CLO-SET 통한 통합 가입만 허용
- 가입 시 마케팅 수신 동의 선택, Region 기반 기본 언어 자동 설정
- Legacy 사용자: 로그인/주요 기능 진입 시 CLO-SET 가입 의무 유도 → 완료 시 기존 데이터 자동 통합

### CompanyID
- CLO-SET 통합 선택 사항 (MD WEB 가입 후 동일 이메일로 CLO-SET 가입 시 통합)
- 직접 제품 사용 불가, 실무 계정 생성 및 라이선스 관리만 수행

### License ID
- CompanyID만 생성 가능
- 이메일 인증 방식 또는 ID만 생성 후 실무자 직접 인증
- 하나의 ID/PW 공유, 구매된 Copy 수만큼 동시접속 가능

### Student 인증
- 대상: 기존 Personal 회원
- 방식: 학교 이메일 인증 또는 재학 증명서 업로드
- 완료 시: Student 라이선스 구매 가능 ($99/연간, 최대 2년)

### Academic 인증
- 대상: CompanyID 중 교육기관
- 방식: 교육기관 전용 증빙 서류 제출
- 완료 시: Academic 전용 라이선스 구매 가능

### Indie 인증
- 대상: CompanyID 중 2~5인, 직전 사이클 매출 $500,000 이하
- 방식: Business Registration Document + Revenue Proof 제출
- 완료 시: Indie License 구매 가능

---

## 3. 회원 객체 필드

### MD Essentials
| 필드 | 설명 |
| --- | --- |
| `userID` | 로그인 ID (이메일 아님, 개인 회원은 난수) |
| `email` | 가입 시 등록 이메일 |
| `password` | 가입 시 등록 비밀번호 |
| `memberType` | 회원 타입 |
| `language` | 언어 |
| `hasLicense` | 라이선스 소유 여부 |
| `licenseStatus` | Active / paused / pause scheduled / cancel scheduled / suspended / none |
| `paymentInformation` | 월 구독 시 저장되는 결제 정보 |
| `invoice` | 구매 완료 시 생성 |
| `verification` | 인증 정보 (Academic / Indie / Student) |
| `coupon` | 소유 쿠폰 |

### CLO-SET
| 필드 | 설명 |
| --- | --- |
| `integration` | CLO-SET 통합 여부 |
| `HQClosetIntegration` | CLO-SET 통합 허용 여부 (기업만) |
| `guestList` | 소유 게스트 목록 |
| `isGuest` | 타 계정의 게스트 여부 |

---

## 4. 라이선스 유효성

| 필드 | 설명 |
| --- | --- |
| `startDate` | 라이선스 시작일 |
| `endDate` | 라이선스 종료일 (Perpetual은 만료 없음) |
| `Status` | 현재 날짜 기준 유효 상태 (startDate~endDate: Active, 외: Inactive) |
| `StatusAdmin` | 스태프 설정 허용 여부 (Deactivated 시 사용 불가) |
| `SWAccess` | 소프트웨어 로그인/사용 가능 여부 |

### SWAccess 케이스 매트릭스

| Case | subscriptionType | startDate | endDate | Status | StatusAdmin | SWAccess |
| --- | --- | --- | --- | --- | --- | --- |
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
- **#12**: Perpetual 보유 License ID에 Subscription이 추가된 경우 → Subscription 플랜 기준으로 인식
- **#16**: 미리 구매(Back-order) Annual 플랜
  - #16-1: 현재 Active 라이선스 보유 중 Reserve → SWAccess = True
  - #16-2: StatusAdmin Deleted 상태에서 Reserve 발생 → SWAccess = False
