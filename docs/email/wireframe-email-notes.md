# 와이어프레임 이메일 발송 표기 추적표

2026-RENEWAL 파일(`PeCid7uJcg0HenViaaiHUp`) 와이어프레임 Description 노트에 단 이메일 발송 불릿의 위치 기록이다. 판정 근거는 `renewal-trigger-mapping.md`.

작성일: 2026-09-08. **링크 연결 완료: 2026-09-11** (25개 노드, 링크 31곳, 누락 없음)

## 링크 규격

템플릿 코드 문자열 자체에 하이퍼링크를 걸고 링크 색 `#0066CC`를 함께 적용한다 (`spec.md` 텍스트 스타일 4종). 다른 파일을 가리키므로 노드 링크가 아니라 URL 링크를 쓴다.

```
https://www.figma.com/design/E3Azp4DyASPSK3uQGUrxru/EMAIL-AUTOMATION?page-id=2007%3A2&node-id={노드 ID, 콜론 대신 하이픈}
```

템플릿을 다시 만들어 node-id가 바뀌면 아래 부록의 매핑을 갱신하고 같은 방식으로 다시 건다.

## 표기 위치 (본문 노드 = 링크를 걸 텍스트 노드)

### Order/Checkout (페이지 `237:3132`)

| 프레임 | 노트 | 본문 노드 | 표기한 템플릿 |
|---|---|---|---|
| Checkout Individual Monthly `7793:1366` | Order Summary | `8089:1684` | `All_MonthlyPaymentStart` |
| Checkout Individual Annual `7892:2882` | Order Summary | `8258:1596` | `Personal_AnnualOrderComplete` |
| Checkout Individual Trial `7782:28345` | Order Summary | `8259:1603` | `Personal_TrialStart` |
| Checkout Student - Benefit applied `7793:1681` | Order Summary | `8259:1630` | `All_MonthlyPaymentStart` |
| Checkout Enterprise Team `7172:3150` | Order Summary | `7913:1588` | `Enterprise_AnnualOrderComplete` |
| Checkout Enterprise Single `7782:28043` | Order Summary | `8008:1555` | `Enterprise_AnnualOrderComplete` |
| Checkout Enterprise Team - Add/Extend `7905:5757` | Order Summary | `8732:1922` | `Enterprise_AnnualOrderComplete` |
| Checkout Academics `7793:2008` | Order Summary | `8009:1555` | `Enterprise_AnnualOrderComplete` |

파생 프레임(Benefit used, 50% Discount applied, Academics Add/Extend 케이스 4장)은 근간 프레임 참조 규칙에 따라 표기하지 않았다. End Page도 중복 방지로 표기하지 않았다.

### Sign Up/In (페이지 `3631:8`)

| 프레임 | 노트 | 본문 노드 | 표기한 템플릿 |
|---|---|---|---|
| Sign Up `4386:3148` | CLO-SET에서 회원가입하기 버튼 | `5112:10` | `All_WelcomeEmail_MarketingYes`, `All_WelcomeEmail_MarketingNo` |
| 비밀번호 찾기: 이메일 입력 `4260:26` | 재설정 링크 보내기 | `4300:22` | `Enterprise_ResetPwRequest` (레거시 계정 한정) |

비밀번호 찾기는 통합 계정은 CLO-SET 처리라 이메일 미사용, 레거시 계정만 이메일 링크 유지 (2026-09-08 확정).

### Plan (페이지 `237:3133`, Verification 섹션)

| 프레임 | 노트 | 본문 노드 | 표기한 템플릿 |
|---|---|---|---|
| Student Email `4499:5408` | 인증 메일 보내기 | `4614:5958` | `Student_VerificationCode` |
| Student Code Sent `4502:7364` | 다시 보내기 | `4553:1260` | `Student_VerificationCode` |
| Application Done (Student) `4509:4802` | 서류 제출 완료 메시지 | `4614:5967` | `Student_DocRegisterSuccess`, `Student_DocRegisterFail` |
| Indie Verification `4614:5999` | 인디 팀 인증하기 버튼 | `4778:31` | `Indie_RequestSuccess` (Staff 통지 `Indie_VerificationRequestStaff`) |
| Application Done (Indie) `4711:1335` | 서류 제출 완료 메시지 | `4711:1374` | `Indie_RequestApproved`, `Indie_RequestDenied` |
| Academic Verfication `4614:6040` | 인증 신청하기 버튼 | `4799:1217` | `Academic_RegisterComplete` |
| Application Done (Academic) `4711:1382` | 서류 제출 완료 메시지 | `4711:1421` | `Academic_RegisterApprove`, `Academic_RegisterReject` |
| Student Done `4599:5706` | 헤드라인 | `4599:5768` | `Student_VerificationComplete` (신규, 4년 시작 고지) |

### MyPage (페이지 `3945:4822`, My Page 섹션)

| 프레임 | 노트 | 본문 노드 | 표기한 템플릿 |
|---|---|---|---|
| Change Email `6155:1910` | Send Verification 버튼 | `6322:1862` | `All_ChangeEmailVerificationCode` |
| Change Email (코드 입력) `6228:4350` | 다시 보내기 버튼 | `6322:1883` | `All_ChangeEmailVerificationCode` |
| Pause Subscription 2 `6288:4719` | Pause Subscription 버튼 | `6313:1876` | `Personal_SubscriptionPauseScheduled` |
| Cancel Subscription 3 `6328:1859` | Cancel Subscription 버튼 | `6328:1929` | `All_MonthlyPaymentCancel` |
| Resume Now `6538:3563` | Resume Subscription 버튼 | `6538:3633` | `Personal_SubscriptionResume` (실패: `Personal_SubscriptionSuspend1`) |
| Retry Payment `6548:3805` | Retry Payment (완료 모달) | `6583:15` | `All_MonthlyPaymentComplete` |
| Retry Payment (3DS) `6571:4767` | Verify 버튼 | `6571:4847` | `All_MonthlyPaymentComplete` |

Change Password와 Delete Account는 발송 없음(2026-09-08 확정), Undo Pause는 발송 없음, SW Account 초대는 Team Console 축, 이메일 변경 완료의 기존 이메일 보안 통지는 도입하지 않기로 확정(2026-09-08)이라 표기하지 않았다.

## 표기 못 한 곳 (화면 미설계, 2026-09-08 기준)

| 대상 | 상태 |
|---|---|
| Enterprise Trial 신청 폼 (`Enterprise_TrialInquiryUser`, `Staff`) | Trial 페이지(`6630:2`)가 비어 있음. 화면이 생기면 표기 |
| Academic Certificate 페이지 | 프레임 1개뿐인 초기 상태. 플로우가 생기면 Plan 쪽과 동일 표기 |
| 24시간 셀프 환불 확인 메일 | **발송 없음 확정** (2026-09-08): 환불 완료 여부를 시스템이 알 수 없어 (은행 처리) 화면 모달로만 안내 |
| 학교 도메인 등록 신청 | 화면 없음: Renewal은 미지원 도메인을 서류 인증으로 우회. `Student_SchoolDomainRegister*` 2종 사용 여부 재검토 플래그 (매핑 §6) |

## 프레임 높이 조정 기록

표기와 함께 잘림을 발견해 수정한 프레임: Indie Verification `4614:5999` (Contents +52), Academic Verfication `4614:6040` (외곽 1378에서 1758로). 둘 다 표기 전부터 Description List가 잘려 있었다.

## 부록: 링크가 가리키는 템플릿 node-id (2026-09-11 기준)

EMAIL CONTENTS v2 페이지(`2007:2`)의 프레임이다. 위 4개 표에 쓰인 24종만 적는다.

| 템플릿 | node-id | 템플릿 | node-id |
|---|---|---|---|
| All_MonthlyPaymentStart | `2547:6` | Student_VerificationCode | `2564:227` |
| Personal_AnnualOrderComplete | `2553:41` | Student_VerificationComplete | `2564:238` |
| Enterprise_AnnualOrderComplete | `2553:52` | Student_DocRegisterSuccess | `2564:249` |
| All_MonthlyPaymentCancel | `2553:63` | Student_DocRegisterFail | `2589:1133` |
| All_MonthlyPaymentComplete | `2588:18` | Academic_RegisterComplete | `2589:1211` |
| All_ChangeEmailVerificationCode | `2564:216` | Academic_RegisterApprove | `2564:260` |
| Personal_SubscriptionPauseScheduled | `2572:373` | Academic_RegisterReject | `2589:1286` |
| Personal_SubscriptionResume | `2572:406` | Indie_RequestSuccess | `2589:1812` |
| Personal_SubscriptionSuspend1 | `2572:340` | Indie_RequestApproved | `2589:1884` |
| Personal_TrialStart | `2589:2125` | Indie_RequestDenied | `2589:1956` |
| All_WelcomeEmail_MarketingYes | `2589:1433` | Indie_VerificationRequestStaff | `2589:2032` |
| All_WelcomeEmail_MarketingNo | `2589:1538` | Enterprise_ResetPwRequest | `2589:1358` |

## 관련 문서

- 판정 정본: `docs/email/renewal-trigger-mapping.md`
- 이메일 축 허브: 루트 `email-spec.md`
