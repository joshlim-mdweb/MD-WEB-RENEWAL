# Email Subject Patterns

기존 템플릿 63종의 Subject 전수 분석. 새 제목을 쓰거나 기존 제목을 고칠 때 이 공식을 따른다.
근거: `accountEmail.md`, `subscriptionEmail.md`, `trialEmail.md`, `systemEmail.md` (2026-09-01 추출)

---

## 1. 구조 유형 4가지

### A. 결과 통지형: `Your {대상} has been {완료동사}.`

가장 많은 유형. 이미 일어난 일을 수신자 관점으로 통지한다. 마침표를 붙인다.

```
Your account has been deleted.
Your student status has been verified.
Your Academic Registration has been approved.
Your order has been confirmed.
Your subscription has been canceled.
Your license has been signed out.
```

변형: 행위 주체가 제3자면 주어를 그 주체로 쓴다.

```
{Headquarter Name} has sent an installer.
{Headquarter Name} has invited you to Userpool.
New reply posted on your subscribed topic.
```

### B. 사전 고지형: `Your {대상} will {동사} in {기간}.`

앞으로 일어날 일을 시점과 함께 알린다. D-N 시퀀스는 기간 숫자만 바꾼다.

```
Your subscription will expire in 2 weeks.
Your subscription will expire in 1 week.
Your subscription will expire in 3 days.
Your subscription will be renewed and charged after 7 days.
```

최근 제작분(2025 이후)은 접두 레이블 형식을 쓴다:

```
[Marvelous Designer]Reminder: License expiring D-7
Reminder: Marvelous Designer License Ending in 14 Days
Upcoming Renewal: Marvelous Designer Monthly License
```

### C. 행동 요청형: `{동사원형} your {대상}.`

수신자가 해야 할 일이 있을 때. 동사는 Verify, Activate, Update 3종만 쓰였다.

```
Verify your student email address.
Activate your email address
Please activate your account.
Update Required: Your account is on hold.
```

### D. 명사구형: 레이블

내부 전달용(Staff), 서류성 메일, 환영 메일에 쓴다.

```
Password Change Request
Billing Statement
Student subscription confirmation
Enterprise Trial Inquiry [{Name}, {Country}]
Welcome to Marvelous Designer
```

---

## 2. 상황별 공식

| 상황 | 공식 | 실제 예 |
|---|---|---|
| 완료(구매, 취소, 삭제) | `Your {대상} has been {동사}.` | Your order has been confirmed. |
| 예정(갱신, 만료, 청구) | `Your {대상} will {동사} in {기간}.` | Your subscription will be renewed and charged after 7 days. |
| 인증 요청 | `Verify your {대상}.` | Verify your student email address. |
| 인증 실패(완곡) | `Issue verifying your {대상}.` | Issue verifying your school domain. |
| 결제 문제(행동 필요) | `Update Required: {상태 문장}` | Update Required: Your account is on hold. |
| 단계 경과(2차 이상) | 상태 문장으로 전환 | Your Subscription Is Still On Hold |
| Staff 내부 알림 | `{이벤트 명사구} [{변수}]` | Enterprise Trial Inquiry [{Name}, {Country}] |
| 신형(2025 이후) 리마인더 | `[Marvelous Designer]Reminder: {명사구} D-{N}` | [Marvelous Designer]Reminder: License expiring D-7 |

## 3. Suspended 시퀀스 (강도 상승 공식)

같은 사건의 반복 알림은 제목의 긴박도를 단계적으로 올린다.

```
1차: Update Required: Your account is on hold.    (행동 요청)
2차: Your Subscription Is Still On Hold            (지속 상태)
3차: Your Subscription Has Been Canceled           (결과 확정)
```

## 4. 세부 규칙

| 항목 | 관례 |
|---|---|
| 대소문자 | Sentence case가 기본. 예외: 명사구형 레이블과 Suspend 2·3차는 Title Case |
| 마침표 | 완결 문장이면 붙인다. 명사구는 붙이지 않는다 (혼재 있음: 일관성은 신규 작성 시 이 규칙으로) |
| 변수 | 제목 내 변수는 Staff 메일과 제3자 주어에만: `{Name}`, `{Country}`, `{Headquarter Name}` |
| 길이 | 3~9단어. 최장 10단어 (How to Fully Experience Your Marvelous Designer Trial) |
| 브랜드 접두 | `[Marvelous Designer]` 접두는 2025 이후 신형 템플릿(Indie, Standalone Expiring)만 사용. 신규 작성 시 채택 여부는 정책 결정 필요 |
| 수신자 관점 | Your 주어가 전체의 약 60%. 시스템 관점(We) 제목은 0건: We로 시작하는 제목을 쓰지 않는다 |

## 5. 기존 제목 중 현행 룰(`ux-writing.md`) 위반 (참고용, 소급 수정 금지)

새로 쓰는 제목에는 아래 패턴을 반복하지 않는다.

| 기존 제목 | 위반 |
|---|---|
| `Payment failed! Your subscription has been canceled.` | 느낌표 금지 |
| `Your trial is finished!` | 느낌표 금지 |
| `Start Creating with Marvelous Designer Today!` | 느낌표 금지 |
| `Your Subscription Is Still On Hold` | 본문형 문장의 Title Case (Sentence case가 맞다) |
| `[Marvelous Designer]Reminder:` | 접두 뒤 공백 누락 |

## 관련 문서

- 문구 기준: `.claude/rules/ux-writing.md`
- 인벤토리: `docs/email/accountEmail.md`, `subscriptionEmail.md`, `trialEmail.md`, `systemEmail.md`
- 매핑: `docs/email/renewal-trigger-mapping.md`
