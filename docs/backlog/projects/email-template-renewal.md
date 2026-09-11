---
project: email-template-renewal
updated: 2026-09-11
---

## 관련 Jira 티켓
- MDWEB-955 — Email Template Renewal (Epic, 진행 중). 하위 MDWEB-956 [UX] / 957 [PD] / 958 [FE] / 959 [BE]
- MDWEB-831 — Site | 3DS 인증 요구로 인한 Suspended, 인증 링크 이메일 발송 (참조. `All_MonthlyPaymentFail_3DS` 제작 근거)

## TODO

1. **Academic과 Indie 인증 코드 2종 제작 여부 결정** — `verification.md` §1이 Student, Academic, Indie 세 인증 모두 이메일 코드 방식으로 규정하는데 Student 것만 만들었다. 선행 조건은 §6의 수신 이메일 미결(가입 이메일 가정) 확정. 골격은 `Student_VerificationCode`와 같아 결정만 나면 빠르다
2. **확인 플래그 3건 회수** — `Enterprise_VerifyEmailJoin` 존속(개발), `Enterprise_DeleteEndUser` 통지 여부(Josh), `Personal_LearningContents3` 보류 중 표기(운영)
3. **미커버 지점 7건 판단** — `renewal-trigger-mapping.md`의 2026-09-11 발굴 표 참조. WeChat CN 이메일 부재, SW Account 재배정, Enterprise Trial 계정 발급 완료, Organization 선불 만료 당일, Benefit 중 인증 거부, 통합계정 감지 OTP, 마케팅 수신 동의 변경
4. **문서 간 충돌 2건 해소** — Student 인증 재인증 여부(`plan.md:97` vs `mypage.md:406`), Benefit 3개월 기산점(`plan.md:92` vs `student-license-promotion.md`)
5. **Klay 회신 마무리** — 이메일 관련 답변은 채팅에 초안까지 냈다. 나머지 3건(전환 시 만료일 승계, 쿠폰 효력, 24시간 환불)은 Legal 회신 후 확정
6. Team Console 축 경계 정리 — SW Account 초대와 추가 완료는 웹 축이 제작했는데 트리거 화면은 Team Console이다. 삭제와 재배정은 어느 축도 소유하지 않는다

## 컨텍스트

### 현재 상태
Figma `EMAIL AUTOMATION`(`E3Azp4DyASPSK3uQGUrxru`) 페이지 `EMAIL CONTENTS v2`(`2007:2`)에 **57종 제작 완료**(유지 26, 수정 26, 신규 5). 쓰지 않는 **16종**은 최상위 섹션 `미사용으로 예상되는 대상 템플릿`(`2618:1164`)에 붉은 테두리와 사유 annotation을 달아 보관한다. 레거시 64종 = v2 이관 45 + 미사용 16, 레거시 캔버스 중복 1건은 옮기지 않았다.

### 확정된 규칙
- **상태는 Border 색이 전부.** 신규 그린 20, 수정 앰버 20, 미사용 예상 빨강 20, 원본 유지 회색 2. 원본 유지만 얇게 둬서 손댄 것이 도드라진다
- **원본 유지도 셸과 본문을 현행 컴포넌트로 만든다.** 레거시에서 가져오는 것은 문구뿐이다. 이식 규칙 표는 `email-spec.md` §3.6
- **문구는 옮겨 적되 예외 3가지는 규격이 이긴다**: 변수 키는 §4.6 사전 표기, 더미값은 변수로, 명백한 오타는 수정
- **미사용 예상 섹션은 재제작하지 않는다.** 구형 모습 자체가 Renewal 세트가 아니라는 신호다
- Student 전용 템플릿 작성 제약 4가지: Trial 단어 금지, 24시간 환불 고지 금지, Benefit 중 취소와 일시정지 안내 금지, 평생 1회 할인 문장 금지

### 살아 있는 미결
- Academic과 Indie 인증 코드 수신 이메일 (가입 이메일 가정, 확인 필요)
- 이메일 언어: Preferred Language가 이메일에 적용되는지 근거 없음. 다국어 제작 범위를 정하는 선결 문제
- 3DS 인증 링크 유효 기간이 유예 7일과 같은지 (개발 확인)
- 결제 실패 2차 알림 발송 시점 (재시도 결제 일정에 달려 있음, 개발 확인)

### 정본 위치
- 이메일 축 허브: 루트 `email-spec.md`
- 판정 정본: `docs/email/renewal-trigger-mapping.md`
- 와이어프레임 발송 표기와 링크 규격: `docs/email/wireframe-email-notes.md`
- 레거시 원문: 루트 `emailTemplate.md`, 인벤토리 `docs/email/*.md`
- Figma 문서 4종: PRD `2536:2`, 정책 변경사항 `2541:2`, 템플릿 리스트 `2544:2`, Version Table `2539:56`(1.8.00)

## 완료 로그

### 2026-09-11
- 원본 유지 28종의 **본문을 현행 컴포넌트로 재조립**. 통짜 텍스트를 문단으로 분해하고 대괄호를 버튼과 인라인 링크로, 키와 값 나열은 Info Block으로, 이미지는 회색 자리표시로 전환. 53종 전부 Poppins 단일 폰트가 됐다
- 변수 키 19건을 사전 표기로 통일하고 레거시 오타 2건 수정
- 와이어프레임 4개 페이지 25개 노드에 **템플릿 프레임 링크 31개** 연결 (링크 색 `#0066CC`, URL에 page-id 포함)
- 레거시와 v2 **문구 전수 대조**. 컨텐츠 변경은 대괄호 제거, 변수 키, 오타와 더미값 3종류뿐이고 문장을 다시 쓴 곳은 없음을 확인
- **미사용 예상 19종을 캔버스에 보존**. 섹션 신설, 붉은 Border, 사유별 하위 섹션 3개
- Border 굵기를 20으로 상향(원본 유지 제외)하고 clipsContent 18건 적용
- **2차 라운드**: Student 전용 2종 복원, `All_MonthlyPaymentFail_3DS` 본문 제작, `Student_DocRegisterReceived` 신설, 문구 정합성 4건 수정, 미사용 16종에 사유 annotation
- 정책 전수 조사로 **미커버 지점 8건과 문서 충돌 2건** 발굴해 판정 정본에 기록

### 2026-09-10
- 원본 유지 28종을 v2 셸로 재제작 (Board Header, Description 7카드, 회색 Border)
- PRD 이관 제외 표기 정정 (17종에서 19종으로, `Personal_AnnualExpiring1` 누락 보정)

### 2026-09-09
- 캔버스 백지 재구축: 마스터 컴포넌트 7종, COMMON, 범례, 카테고리 4섹션
- 수정 21종과 신규 4종 제작 완료 (배치 1~5)
- Figma 문서 4종 작성, Jira 에픽 MDWEB-955와 하위 4건 정리
- 갱신 고지 통합(`All_MonthlyPaymentNotice` 한 장)과 Benefit 종료 통합(`Student_BenefitEnding` 한 장 3회 발송)
- 원본 유지 28종 레거시 클론 이관, Indie와 System 하위 섹션 신설
