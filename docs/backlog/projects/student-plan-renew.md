---
project: student-plan-renew
updated: 2026-06-25
---

## 관련 Jira 티켓
- MDWEB-773 — Site | Student Plan Renewal — Monthly Trial 모델 전환

## TODO
### 정책 결정 대기
1. **[정책 결정 필요]** 구세대 Monthly Student 구매 이력이 2회 제한 카운팅에 포함되는지 확인 (Dahye Jang / Layla Jo / 개발팀)
2. **[정책 결정 필요]** 구세대 Monthly 구매 카운팅 기준 확정 — 월별 1회 vs 기간 전체 1회
3. 위 정책 확정 후 구세대 Monthly 이력 유저 8개 edge case 정책 정의

### Figma 작업
4. Plan Card CASE VIEW 3종 (Enterprise/Academic/Indie) Figma 그리기 — 보류 (정책 변경으로 재작업)
5. Organization Dashboard STRUCTURE WF 작업 (ORG_DASHBOARD / ORG_SW_ACCOUNTS / ORG_VERIFICATION) — MyPage 작업 시 같이
6. Student Renewal 신규 이메일 템플릿 3개 Figma에 추가 (EMAIL-AUTOMATION v2 페이지)
   - `Student_TrialExpiring7` (Trial 종료 D-7)
   - `Student_TrialExpiring3` (Trial 종료 D-3)
   - `Student_TrialExpiry` (Trial 종료 D-0, 청구 시작 고지)

### 이메일 템플릿
7. DS팀 확인 후 Figma 반영
   - Stripe 로고: "Continue via [Stripe]" 버튼에 인라인 로고 컴포넌트 여부
   - 로딩 인디케이터: Retry Payment 2 모달 Loading 상태에 쓸 컴포넌트 여부
8. Personal_AnnualExpiring1 v2 제거 배경 확인 (의도적 정책 변경인지 검증)
9. 정책 문서 Slack Canvas 업로드 (채널 미정 — 사용자 결정 필요)
10. 동적 변수 컨벤션 전체 정의 ({country}, {user_id}, {name}, {email}, {activation_link} 등)

## 컨텍스트
- **Organization 워딩 확정** — 내부 기획 용어 Group 사용 금지, UI/문서 전체 Organization으로 통일
- **신규 계정 구조** — MemberType 폐지. 모든 멤버 동일. Organization Owner(생성자) + SW Account(구 License ID) + 인증 레이어 분리
- **Create Organization 페이지** — `/organization/create` 별도 페이지, 4개 필드(Name*, Country*, Industry, Website)
  - Figma file `PeCid7uJcg0HenViaaiHUp`, node `4599:5781`
  - Left Panel 콘텐츠 채움 완료, Description 5개 슬롯 Figma 삽입 완료
- **Plan Card 분기** — 3축: Org 보유 여부 / 인증 상태 / 라이선스 보유 여부 (기존 MemberType 7종 무효화)
- **[미결] 구세대 Monthly Student 이력 유저 edge case** — Dahye Jang·Layla Jo에게 공유됨
  - 구세대 Monthly 구매가 2회 제한 카운팅에 포함되는가 (가장 먼저 결정 필요)
  - Monthly 여러 달 사용 시 카운팅 기준 (월별 1회 vs 기간 전체 1회)
  - 상세 기획: `/Users/josh.lim/.claude/plans/compiled-questing-mountain.md`
- **이메일 템플릿 Figma 파일**: EMAIL-AUTOMATION (`E3Azp4DyASPSK3uQGUrxru`)
  - v2 현행 기준 총 58개 템플릿 (ACCOUNT 17 / Subscription/Payment 21 / Trial 8 / System 13)
  - MDWEB-773 신규 3개 추가 예정 → 최종 61개
- **템플릿 속성 스키마** (snake_case): email_template_name / email_trigger / email_subject / email_contents / email_buttons_and_values / email_footer
- **Student Renewal**: 3개월 무료 Trial → $8.25/월 자동갱신 구독 전환. D-7/D-3/D-0 알림 시퀀스 필요

## 완료 로그
### 2026-06-22
- Create Organization Description 슬롯 5개 Figma 삽입 완료 (node 4614:5977/6081/6087/6093/5983)
- Academic/Indie 패널 Left Panel {Description} placeholder 채우기 완료 (node 237:3133)
- 인증 플로우 화면 작업 안 하기로 결정 (ORG_VERIFY_FORM / PENDING / COMPLETE)
- Student_MonthlyPaymentStart Order Summary {Next Price} 이슈 완료
- Free period 종료 후 결제 수단 미등록 처리 정책 확정 (해당 케이스 없음)
- 구세대 Monthly Student 이력 유저 edge case 분석 정리 (기존 3종 + 추가 5종)

### 2026-06-17
- Organization vs Group 워딩 결정 → Organization 확정
- Organization 중심 계정 구조 기능 정의 (Owner / SW Account / 인증 레이어)
- Create Organization 페이지 기획 확정 (별도 페이지 / 4개 필드 / 에러 케이스 2종 인라인)
- MY-PAGE 파일 3DS 이메일 및 모달 Description 수정 (suspend1/2, Retry Payment)
- DS팀 확인 질문 작성 (Stripe 로고 컴포넌트, 로딩 인디케이터 가용 여부)

### 2026-06-09
- Annual Expiring 이메일 본문 수정 (Personal 4종, Enterprise 2종)

### 2026-06-08
- EMAIL-AUTOMATION Figma v1 vs v2 전체 구조 분석 완료
- 이메일 템플릿 속성 스키마 (snake_case 6개 필드) 정의
- 전체 58개 템플릿 목록 + Student Renewal TBD 3개 포함 정책 문서 초안 작성

### 2026-06-04
- MDWEB-773 Jira description 작성 및 반영
- Figma 이메일 템플릿 수정 5건 반영 (MonthlyPaymentStart, MonthlyPaymentCancel)
- 이메일 템플릿 `{variable}` 텍스트 orange 처리 (6종 전체)
- 용어 정리: Benefit → free period 확정
