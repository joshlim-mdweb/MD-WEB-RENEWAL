# Renewal 이메일 트리거 매핑

Renewal 기획서(정책 문서, PRD, Figma Description)에서 이메일 발송 트리거를 전수 추출하고, 기존 템플릿 64종과 대조해 재사용 여부를 판정한다. 신규 제작 최소화가 원칙이다.

작성일: 2026-09-01
근거: `docs/policy/**`, `docs/prd/**`, `requirements/**` 전수 grep + Figma `2026-RENEWAL` 파일 Order/Checkout, MyPage, Plan 페이지 텍스트 전수 검색 + `EMAIL AUTOMATION` 파일 템플릿 64종 (인벤토리: `accountEmail.md`, `subscriptionEmail.md`, `trialEmail.md`, `systemEmail.md`)

## 판정 기준

| 판정 | 기준 |
|---|---|
| 재사용 | 트리거, 수신자, 내용이 Renewal 후에도 동일 |
| 문구 수정 | 트리거는 같고 용어나 정책만 변경 (Personal을 Individual로, License ID를 SW Account로, 자동갱신 도입, 금액 표기 등) |
| 신규 | 의미상 근접한 기존 템플릿이 전무한 경우만 |

## 요약

| 판정 | 건수 |
|---|---|
| 재사용 (그대로) | 30종 |
| 문구 수정 후 재사용 | 16종 |
| **신규 필요** | **1건 (Student 인증 코드, Josh 확정 2026-09-01)** |
| 판정 보류 (정책 미확정) | 5건 |

가장 중요한 결론 2가지:

1. **Renewal 인증 체계는 OTP 코드 방식인데, 기존 인증 이메일은 전부 링크 방식이다.** `verification.md`가 Student, Academic, Indie 인증과 MyPage의 이메일 변경, 비밀번호 변경을 모두 OTP 코드(10분 유효, 재발송 60초 쿨다운, 5회 한도)로 규정한다. 코드를 본문에 싣는 템플릿이 하나도 없어 신규 1건이 필요하다.
2. **Checkout 축에는 이메일 규정이 한 줄도 없다.** `checkout.md` 전문과 Figma Order/Checkout 페이지 텍스트 2,035개에 발송 관련 문구가 0건이다. 주문 완료 메일은 기존 템플릿(OrderComplete 계열)이 커버하지만, 정책 문서에 근거가 없는 상태다.

---

## 1. 구매, 주문 완료

| 트리거 | 근거 | 수신자 | 판정 | 템플릿 | 수정 사항 |
|---|---|---|---|---|---|
| Individual Monthly 첫 구매 완료 | checkout 플로우 (정책 문서 규정 없음, 아래 갭 참조) | Individual | 문구 수정 | `All_MonthlyPaymentStart` | Personal 표기를 Individual로, 금액 `n USD` 표기 |
| Individual Annual 구매 완료 | 동일 | Individual | 문구 수정 | `Personal_AnnualOrderComplete` | **본문 반전 필수**: 기존 본문이 "Your license will not automatically renew"인데 Renewal Annual은 자동갱신 구독. 갱신 고지 문장으로 교체 |
| Organization 구매 완료 (Enterprise Team, Single, Academic) | 동일 | Organization Owner | 문구 수정 | `Enterprise_AnnualOrderComplete` | License ID를 SW Account로, Seat 수 표기 추가, Team Console 링크 유지 |
| Seat 추가, 기간 연장 (Add·Extend) 결제 완료 | `checkout.md` §9~§11 Purchase Type | Organization Owner | 문구 수정 | `Enterprise_UpgradeOrderComplete` | 전환 구매용 본문을 Add·Extend 내역(추가 Seat 수, 새 만료일)으로 개편 |
| Single에서 Team 전환 (Convert) 결제 완료 | `checkout.md` §11 | Organization Owner | 문구 수정 | `Enterprise_UpgradeOrderComplete` | 전환 완료와 새 만료일(기존+1년) 명시 |
| Monthly 정기 결제 성공 (영수증) | `student-license-promotion.md:99` | 구독자 전체 | 재사용 | `All_MonthlyPaymentComplete` | 없음 |

## 2. 갱신 사전 고지

| 트리거 | 근거 | 수신자 | 판정 | 템플릿 | 수정 사항 |
|---|---|---|---|---|---|
| Annual 자동갱신 D-30 고지 (금액 명시) | `plan.md:62`, `mypage.md:206` | Individual Annual | 문구 수정 | `Personal_AnnualExpiring14` 프레임 기반 | **전면 재작성**: 기존은 "만료되니 재구매" 전제, Renewal은 "자동갱신 청구 예정 + 금액". 목적이 반대라 본문 전체를 새로 쓰되 템플릿 틀은 재사용 |
| Annual 자동갱신 D-7 고지 (금액 명시) | 동일 | Individual Annual | 문구 수정 | `All_MonthlyPaymentNotice` | 정확히 "recurring 결제 7일 전" 용도. 금액 명시 추가, Annual 대상 확장 |
| Monthly 정기 결제 D-7 고지 | 기존 운영 | 구독자 전체 | 재사용 | `All_MonthlyPaymentNotice` | 없음 |
| Organization 선불 라이선스 만료 임박 (Extend 유도) | `checkout.md` §11 Add·Extend 진입 경로 | Organization Owner | 문구 수정 | `Enterprise_AnnualExpiring14CompanyID`, `Enterprise_AnnualExpiring14EndUser` | 재구매 안내를 Checkout Add·Extend 진입 링크로 교체, License ID를 SW Account로 |

## 3. 결제 실패, Suspended

`plan.md:86` 종결 규칙: 실패 즉시 접속 제한, 1주 유예 + 알림 3회, 미해결 시 취소. Monthly, Annual, Trial 종료 후 첫 결제에 동일 적용.

| 트리거 | 근거 | 수신자 | 판정 | 템플릿 | 수정 사항 |
|---|---|---|---|---|---|
| 결제 실패 직후 (1차 알림) | `plan.md:86`, `mypage.md:275` | 구독자 전체 | 문구 수정 | `Personal_SubscriptionSuspend1` (+3DS 변형) | 기존 발송 조건이 "구독 자동 재개 시점 결제 실패"로 좁다. Renewal 규칙(모든 결제 실패)으로 트리거 재정의 |
| 유예 중 2차 알림 | 동일 | 구독자 전체 | 재사용 | `Personal_SubscriptionSuspend2` | 없음 |
| 유예 만료, 구독 취소 (3차) | 동일 | 구독자 전체 | 문구 수정 | `Personal_SubscriptionSuspend3` | 취소 확정과 재구독 경로 명시 |
| 결제 불가로 구독 취소 (즉시 취소 케이스) | 기존 운영 | 구독자 전체 | 재사용 | `All_MonthlyPaymentFail` | Student 포함 전 타입 커버 (기존 COMMENT 확인). **주의: `All_MonthlyPaymentFail_3DS`는 캔버스가 비어 있어 본문 미작성 상태** |
| Student 결제 실패, 라이선스 Lock | `[MD-SITE]-student-plan-renewal.md:93` | Student | 재사용 | `All_MonthlyPaymentFail` | 결제 수단 업데이트 링크가 이미 본문에 있음 |

## 4. 구독 취소

| 트리거 | 근거 | 수신자 | 판정 | 템플릿 | 수정 사항 |
|---|---|---|---|---|---|
| 구독 취소 (취소 예약) 확인 | `mypage.md` §6-3 | 구독자 전체 | 문구 수정 | `All_MonthlyPaymentCancel` | Annual 포함으로 대상 확장, 잔여 기간 사용 가능 문구 유지 |

## 5. Trial

Renewal Trial 정책(`plan.md`, T-06 확정): 계정당 평생 1회, 14일, 종료 후 선택 플랜으로 자동 결제 시작.

| 트리거 | 근거 | 수신자 | 판정 | 템플릿 | 수정 사항 |
|---|---|---|---|---|---|
| Trial 시작 (Checkout 완료 직후) | `[MD-SITE]-download-page.md:57` | Trial 사용자 | 재사용 | `Personal_TrialStart` | 없음 |
| 계정 생성 환영 | `[MD-SITE]-download-page.md:57` | 신규 가입자 | 재사용 | `All_WelcomeEmail_MarketingYes`, `All_WelcomeEmail_MarketingNo` | 없음 |
| Trial 시작 3일 후 활용 안내 | 기존 운영 | Trial 사용자 | 재사용 | `Personal_HelpTrial` | 없음 |
| Trial 종료 3일 전 (전환 예정자) | `docs/prd/solutions/individual.md:139` | Trial 사용자 | 문구 수정 | `Personal_TrialExpiring3Continue` | 전환될 플랜 금액 명시 강화 ($39/월 또는 $280/년), 24시간 환불 규정 반영 여부는 정책 확인 |
| Trial 종료 3일 전 (취소자) | 기존 운영 | Trial 취소자 | 재사용 | `Personal_TrialExpiring3Cancel` | 없음 |
| Trial 취소 직후 | 기존 운영 | Trial 취소자 | 재사용 | `Personal_TrialCancel` | 없음 |
| Trial 종료, 유료 전환 당일 | 기존 운영 | Trial 사용자 | 재사용 | `Personal_TrialExpiry` | 제목 느낌표(`finished!`)는 신규 발송분부터 개정 권장 |
| Enterprise Trial 신청 (Staff 통지, 신청자 확인) | `[MD-SITE]-enterprise-trial-form-improvement.md` | MD_BIZDEV, 신청자 | 문구 수정 | `Enterprise_TrialInquiryStaff`, `Enterprise_TrialInquiryUser` | 개선된 폼 필드(DNS 검증 결과 등) 반영 |

## 6. Student

| 트리거 | 근거 | 수신자 | 판정 | 템플릿 | 수정 사항 |
|---|---|---|---|---|---|
| 학교 이메일 인증 코드 발송 | `verification.md:13`, Plan 페이지 Figma | 학교 이메일 | **신규 (아래 N-1)** | 기존 `Student_VerifyStudent`는 링크 방식이라 코드 방식으로 대체 | |
| 학교 도메인 등록 승인, 거부 | `docs/prd/solutions/students.md:99` | 신청자 | 재사용 | `Student_SchoolDomainRegisterSuccess`, `Student_SchoolDomainRegisterFail` | 없음 |
| 재학 서류 인증 승인 (4년 시작 고지) | `[MD-SITE]-student-plan-renewal.md:86` | 신청자 | 문구 수정 | `Student_DocRegisterSuccess` | "오늘부터 4년간 학생 플랜 이용 가능" 고지 추가 (필수), 기산점은 `plan.md` §3 기준 최초 인증 승인일 |
| 재학 서류 인증 거부 | `docs/prd/solutions/students.md:156` | 신청자 | 재사용 | `Student_DocRegisterFail` | 없음 |
| Student Benefit 종료 알림 시퀀스 D-7, D-3, D-0 | `mypage.md:190`, `[MD-SITE]-student-plan-renewal.md:90~91` | Student | 문구 수정 | `Personal_TrialExpiring3Continue` 기반 파생 3장 | 무료 기간 종료 후 $8.25/월 청구 시작이라는 구조가 Trial 전환과 동일. 금액과 시점만 교체. **주기 충돌 미결: `student-license-promotion.md:98`은 D-7, D-1로 규정** *(정책 확인 필요: 주기 확정)* |
| Legacy Annual 활성 유저 혜택 부여 + 쿠폰 | `mypage.md:301`, `student-license-promotion.md:24` | Legacy Student | **신규 (아래 N-2)** | | |

## 7. 계정, Organization

| 트리거 | 근거 | 수신자 | 판정 | 템플릿 | 수정 사항 |
|---|---|---|---|---|---|
| 이메일 변경 인증 코드 (MyPage) | MyPage Figma `6322:1862` (쿨다운 60초, 한도 5회) | 새 이메일 | N-1 공용 재사용 | Student 인증 코드 템플릿(N-1) | 인증 컨텍스트 문구만 교체 |
| 비밀번호 변경 인증 (MyPage) | MyPage Figma `6420:3838` | 계정 이메일 | N-1 공용 재사용 | 코드 방식이면 N-1 공용, 링크 방식 유지면 `Enterprise_ResetPwRequest` 재사용 *(개발 확인 필요: 방식)* | |
| 비밀번호 재설정 (Legacy 로그인) | `auth.md:117~128` | 계정 이메일 | 재사용 | `Enterprise_ResetPwRequest` | 없음 |
| SW Account 초대 (Owner가 이메일 지정) | `member.md:55`, checkout PRD `prd-draft.md:192` | 초대받은 사람 | 문구 수정 | `All_UserpoolInvitation` | Userpool을 Organization, SW Account 용어로 개편. **CS 리스크 반영: SW Account는 Web 로그인이 없다는 오해 방지 문구 필수** (`prd-draft.md:764`). CLO-SET 가입 유도 유지 |
| SW Account 추가 완료 (Owner 통지) | 동일 | Organization Owner | 문구 수정 | `Enterprise_ UserpoolMemberAdded` | Company ID를 Organization으로, License ID를 SW Account로 |
| 소프트웨어 설치 파일 공유 | 기존 운영 | 멤버 | 재사용 | `All_UserpoolSoftwareShared` | 다운로드 링크 버전만 최신화 (기존 COMMENT에 이미 예고됨) |
| 계정 삭제 확인 | 기존 운영 | 본인 | 재사용 | `Personal_DeleteUser` | 없음 |
| 원격 로그아웃 (Deactivate) 완료 | 기존 운영 | 본인 | 재사용 | `All_Deactivation` | 없음 |
| CLO-SET 통합 정책 변경 고지 (2026-09 한 달 캠페인) | `member.md:200` | Legacy 미통합 Company ID | **신규 (아래 N-3)** | | |

## 8. Academic, Indie

| 트리거 | 근거 | 수신자 | 판정 | 템플릿 | 수정 사항 |
|---|---|---|---|---|---|
| Academic 신청 접수 확인 | `docs/prd/solutions/academics.md:113` | 기관 대표 | 재사용 | `Academic_RegisterComplete` | 없음 |
| Academic 인증 승인 | `academics.md:177` (**이메일이 유일한 결과 통지 채널**) | 기관 대표 | 문구 수정 | `Academic_RegisterApprove` | Pricing 링크를 Renewal Plan 페이지로 갱신, Company ID 용어 정리 |
| Academic 인증 거부 | 동일 | 기관 대표 | 재사용 | `Academic_RegisterReject` | 없음 |
| Indie 인증 접수, 승인, 거부 | `plan.md` §3 Indie (백오더 전용으로 인증 플로우 유지) | 신청자 | 재사용 | `Indie_RequestSuccess`, `Indie_RequestApproved`, `Indie_RequestDenied` | 없음 |
| Indie 신청 Staff 통지 | 동일 | MD_BIZDEV | 재사용 | `Indie_VerificationRequestStaff` | 없음 |
| 기타 현행 유지 | 기존 운영 | | 재사용 | `All_ContactUs`, `All_ForumComments`, `All_OfflineAuth`, `Personal_LearningContents1~3` | 없음 |

---

## 신규 필요 1건 (Josh 확정, 2026-09-01)

### N-1. Student 인증 코드 (OTP) 이메일

- 용도: Student 학교 이메일 인증 코드 발송. `verification.md`가 규정하는 코드 방식 (10분 유효, 재발송 60초 쿨다운, 5회 한도)
- 가장 가까운 기존 템플릿: `Student_VerifyStudent`, `EnterpriseVerifyEmail` (둘 다 링크 클릭 방식)
- 재사용 불가 사유: 본문에 코드 표시 영역 자체가 없다. 링크 방식과 코드 방식은 본문 구조가 다르다 (코드 N자리 + 10분 유효 안내 + 요청하지 않았다면 무시 안내)
- **공용 재사용**: MyPage 이메일 변경, 비밀번호 변경 등 다른 코드 인증 플로우도 이 템플릿 하나를 재사용한다. 별도 신규를 만들지 않는다

### 신규 제작 범위에서 제외 (분석 기록 보존)

아래 2건은 근접 템플릿이 없다는 분석은 유효하나, Josh 확정으로 이 매핑의 템플릿 제작 범위에서 제외한다.

| 항목 | 트리거 | 기록 |
|---|---|---|
| Legacy Student 혜택 안내 + 쿠폰 | Annual 활성 Legacy Student에게 3개월 무료 혜택 자동 부여 안내 | `mypage.md:301`이 이메일 발송을 개발팀 별도 처리로 규정. 분산 발송 리스크는 `student-license-promotion.md:84` 참조 |
| CLO-SET 통합 정책 변경 고지 | 2026-09-01부터 한 달간 Legacy 미통합 Company ID 대상 고지 (`member.md:200`) | 템플릿 신규 제작 없이 처리 |

## 판정 보류 (정책 미확정)

| 항목 | 쟁점 | 근거 |
|---|---|---|
| Paused에서 Suspended 전환 알림 | 이메일 발송 여부 자체가 미결 | `[MD-SITE]-mypage-redesign.md:371` |
| 환불 완료 확인 메일 | 환불 정책은 신설됐으나(`plan.md` §3) 메일 규정 없음. Trial 경유 24시간 환불 케이스 한정이라 건수 적음 | `plan.md` §3 |
| Newsletter 구독 확인 | 구독 CTA 강화만 규정, 확인 메일과 발행 주기는 미규정 | `[MD-SITE]-newsroom-page.md:95` |
| Student 4년 도래 시 Individual 전환 안내 | 안내 채널(이메일 또는 화면)이 미정 | `plan.md:96` |
| 주문 완료 메일의 정책 문서 근거 | `checkout.md`에 이메일 규정 0건. 어떤 시점에 어떤 메일이 나가는지 Checkout 정책에 명문화 필요 | `checkout.md` 전문, Figma Order/Checkout 페이지 0건 |

## 문서 간 충돌 (해소는 Josh)

1. **Benefit 종료 알림 주기**: D-7, D-3, D-0 (`mypage.md:190`, `student-plan-renewal.md`) vs D-7, D-1 (`student-license-promotion.md:98`)
2. **"알림 3회"의 채널과 타이밍**: 5개 문서 모두 이메일인지 인앱인지, 1주 유예 중 언제 3회인지 미정의. 기존 Suspend1, 2, 3 시퀀스를 그대로 쓴다면 그 발송 시점을 정책으로 역수입하는 것이 가장 빠르다
3. **이메일 언어**: Preferred Language 설정이 이메일에 적용되는지 근거 없음 (TODO.md 결정 대기 D-23). 다국어 제작 범위를 정하는 선결 문제

## 역방향 점검: Renewal 트리거에 매핑되지 않은 템플릿

| 템플릿 | 상태 |
|---|---|
| `Enterprise_OfflineKeyComplete` | 캔버스에 "사용하지 않음" 오버레이. 폐기 확정으로 보임 |
| `Enterprise_MonthlyExpiring7`, `Enterprise_StandaloneAnnualExpiring14/7/3/1CompanyID` (5종) | Standalone 폐지 이관 캠페인용. Legacy 소진 시 폐기 |
| `Student_MonthlyPaymentStart`, `Student_MonthlyPaymentCancel` | Legacy Student Monthly 64명 잔존으로 유지 (기존 COMMENT 명시). 소진 시 폐기 |
| `Personal_AnnualExpiring14/7/3/1` (Expiring1은 Expiring3 섹션에 중첩) | D-30/D-7 자동갱신 고지로 개편되면 만료 안내 원본은 폐기 |
| `Enterprise_VerifyEmailJoin` | Renewal 가입은 CLO-SET 계정 체계. 이 템플릿의 존속 여부 *(개발 확인 필요)* |
| `All_MonthlyPaymentFail_3DS` | 본문 미작성 (캔버스 비어 있음). 3DS 케이스 본문 제작 필요 여부 확인 |

## EMAIL AUTOMATION 파일 데이터 결함 (Figma 수정 필요, 이 문서는 기록만)

- 섹션명 중복: `Indie_RequestApproved` 2개 (하나는 내용이 Denied), `Enterprise_StandaloneAnnualExpiring1CompanyID` 2개 (완전 중복)
- `All_UserpoolInvitation`의 DESCRIPTION이 MemberAdded 설명으로 복제돼 있음 (제목은 초대 문구)
- `Personal_AnnualOrderComplete`와 `Student_MonthlyPaymentStart`의 TARGET이 COMPANY ID로 잘못 적혀 있음 (실제 수신자는 개인 계정)
- `systemEmail.md`(repo)와 라이브 Figma의 Subject 불일치 7건: OfflineKeyComplete, Deactivation, WelcomeEmail 2종(느낌표), UserpoolSoftwareShared, UserpoolInvitation, UserpoolMemberAdded. 라이브 Figma가 최신이므로 `systemEmail.md` 갱신 필요
- 발송 조건 원본으로 보이는 Google Spreadsheet(`docs.google.com/spreadsheets/d/1Bm1g7RYZbbY32ojQPn-SleFf_HHXJ3T5f_5UuapItGM`)는 인증이 필요해 접근 못 함. 대조하려면 접근 권한 필요

## 관련 문서

- 인벤토리: `docs/email/accountEmail.md`, `subscriptionEmail.md`, `trialEmail.md`, `systemEmail.md`
- 제목 공식: `docs/email/subjectPatterns.md`
- 정책 문서: `docs/policy/plan.md`, `mypage.md`, `verification.md`, `member.md`, `auth.md`, `checkout.md`
- Figma: EMAIL AUTOMATION `E3Azp4DyASPSK3uQGUrxru` node 2:59, 2026-RENEWAL `PeCid7uJcg0HenViaaiHUp`
