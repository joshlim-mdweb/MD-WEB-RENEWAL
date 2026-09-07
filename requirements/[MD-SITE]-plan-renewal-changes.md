# [MD|SITE] Plan Renewal — 플랜 정책 변경

출처: Slack Canvas [[RENEWAL] Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N) 재작성 | 작성일: 2026-07-29 | 갱신: 2026-08-04
Canvas(게시본): https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N — 이 문서와 KR·EN 1:1 동기화
독자: BD · SW PM · CS
범위: 플랜 정책만. Checkout·MyPage 화면 스펙은 이 문서에서 다루지 않습니다.

---

## 1. 변경 요약

이번 Renewal에서 바뀌는 항목은 아래 5가지입니다. 각 항목의 상세는 해당 섹션에서 다룹니다.

| 구분 | 변경 내용 | 상세 |
|---|---|---|
| 1 | 기업용 플랜명 변경 — Network Online Monthly → Enterprise Single, Network Online Annual → Enterprise Team, Network Online Linux → Enterprise Team Linux | §5·6·7 |
| 2 | Individual Annual을 Prepaid에서 Subscription으로 전환 (자동 갱신) | §3 |
| 3 | Student를 Annual $99에서 Monthly $8.25로 전환 — 인증 시점 기준 4년, 구매 횟수 제한 없음, 3개월 무료 | §4 |
| 4 | MemberType 폐지 — Member + Organization + Verification 3축으로 재편 | §2 |
| 5 | 용어 통일 — Copy → Seat 등 | Appendix A |

---

## 2. 플랜 구매 자격 구조

2026-06-23자로 계정 구조가 전면 개편됐습니다. **MemberType은 폐지됐습니다.** 이 섹션의 용어가 이후 모든 플랜 섹션의 "구매 자격" 기준입니다.

### 2-1. 계정 유형

| 계정 유형 | 설명 | Web 로그인 | SW 로그인 |
|---|---|---|---|
| Non-Member | 로그인하지 않은 사용자 | — | — |
| Member | 로그인한 모든 사용자. 구 Individual / Company ID / Academic / Indie 통합 | 가능 | 가능 |
| SW Account | Organization Owner가 생성하는 라이선스 할당 전용 계정. 구 License ID | **불가** | 가능 |

로그인한 사용자는 전부 동일한 Member입니다. 플랜 구매 자격은 계정 유형이 아니라 인증(Verification)이 부여합니다.

SW Account는 Web 로그인이 불가하므로 Plan 페이지에 도달하지 않습니다. CLO-SET 계정 통합도 지원하지 않습니다.

### 2-2. Organization

- 생성 주체: SW Account를 제외한 모든 Member
- 생성 시점: 플랜 구매와 무관하게 독립적으로 생성 가능
- Organization을 생성한 Member = **Organization Owner**
- 하위 권한 역할 없음 (Owner 단일)
- SW Account 생성은 Organization Owner만 가능. 인원 제한 없음

### 2-3. 인증 레이어

| 레이어 | 인증 주체 | 인증 종류 | 획득 자격 |
|---|---|---|---|
| 개인 | Member | Student 인증 | Student 플랜 |
| Organization | Organization | Academic 인증 | Academic 플랜 |
| Organization | Organization | Indie 인증 | Indie 플랜 |
| Organization | Organization | 인증 없음 | Enterprise 플랜 |

Student 인증은 개인 레벨이므로 Organization 소속과 무관합니다. Academic·Indie 인증은 Organization 레벨이므로 Organization 없이는 신청할 수 없습니다.

---

## 3. Individual

| 항목 | Legacy | Renewal |
|---|---|---|
| 플랜명 | Individual Monthly / Individual Annual | 동일 |
| 가격 | Monthly $39 / Annual $280 | 동일 |
| 지불 방식 | Monthly 자동결제 / **Annual 일시납** | Monthly 자동결제 / **Annual 자동결제** |
| 라이선스 유형 | Subscription / **Prepaid** | Subscription / **Subscription** |
| 최대 Seat | 1 | 동일 |
| 구매 자격 | Individual MemberType | **Member 전체 (인증 불필요)** |

### 정책 상세

- Individual Annual이 일시납에서 구독으로 전환됩니다. 만료일 전 자동 갱신 결제가 진행됩니다.
  - **자동 갱신은 켜고 끄는 옵션이 아닙니다.** 구독의 기본 동작입니다.
  - 갱신을 원하지 않으면 구독을 해지합니다. 해지 시 잔여 기간 종료 후 갱신하지 않고, 기간 내 사용은 유지됩니다.
- 구매 경로는 두 가지입니다.
  - **Trial 경유**: Trial 시작 시 Monthly·Annual 중 하나를 선택합니다. 14일 무료 종료 후 선택한 플랜으로 자동 결제가 시작됩니다.
    - Monthly를 선택한 경우: $39/월
    - Annual을 선택한 경우: $280/년
  - **바로 구매**: Trial 없이 Monthly 또는 Annual을 즉시 구매합니다.
- Trial 기간 중 취소 가능하되, **취소 후 동일 계정으로 재Trial은 불가**합니다.
- Individual 플랜은 단일 사용자 전용입니다. 계정 공유와 동시접속을 지원하지 않습니다.

### Legacy와의 차이

- Legacy에서도 **Trial 종료 후 자동으로 Subscription이 시작**됐습니다. 현행 Trial은 별도 라이선스가 아니라 유료 구독 상품에 무료 기간을 얹은 구조여서, 자동 청구가 기본입니다. (2023-11 정책 결정 · 2026-06 현황 확인)
- Legacy에도 연간 라이선스 Trial이 있었으나 **2024-04-04에 폐지**되어 이후로는 월간 전용이었습니다. Renewal은 이를 되살리는 것이 아니라, **Trial 진입 시 플랜을 선택하는 구조**로 새로 정의한 것입니다.

---

## 4. Student

| 항목 | Legacy | Renewal |
|---|---|---|
| 플랜명 | Student Annual | **Student Monthly** |
| 가격 | $99/연 | **$8.25/월** |
| 지불 방식 | 연간 일시납 | **월간 자동결제** |
| 라이선스 유형 | Prepaid | **Subscription** |
| 최대 Seat | 1 | 동일 |
| 구매 자격 | Student MemberType | **Student 인증 완료 Member** |

### 정책 상세

- Annual 옵션은 제공하지 않습니다. Monthly 전용입니다.
- **구매 시점·횟수 제약이 없습니다.** 최초 Student 인증 시점부터 4년 이내라면 언제든 구매할 수 있습니다.
- **Legacy Annual 이용 중에도 Monthly로 전환할 수 있습니다.** 이미 사용한 Annual 기간은 4년에서 차감합니다.
- **3개월 무료 Student Benefit**을 제공합니다. Benefit 기간 중 청구 금액은 $0.00이며, 종료 후 $8.25/월 자동 청구가 시작됩니다.
- **"Trial" 라벨 노출 금지** — "Student Benefit"으로 표기합니다.

> 상세 정책은 Slack Canvas [Student Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0B4B5D86J1) 및 `requirements/[MD-SITE]-student-plan-renewal.md` 참조.

---

## 5. Enterprise Single

| 항목 | Legacy | Renewal |
|---|---|---|
| 플랜명 | Network Online Monthly | **Enterprise Single** |
| 가격 | $199/월 | 동일 |
| 지불 방식 | 월간 자동결제 | 동일 |
| 라이선스 유형 | Network Online | 동일 |
| 최대 Seat | 1 | 동일 |
| 구매 자격 | Company ID | **Organization 보유 Member (인증 불필요)** |

### 정책 상세

- 명칭 변경입니다. 가격·라이선스 유형·정책은 동일합니다.
- Concurrent User는 Max 1입니다. 동시접속을 지원하지 않습니다.
- Organization이 없는 Member가 구매를 시작하면 Organization 생성 단계를 먼저 거칩니다. 인증은 필요하지 않습니다.
- 자동 Trial은 제공하지 않습니다. Trial 제공 여부는 문의를 통해 결정합니다.

---

## 6. Enterprise Team

| 항목 | Legacy | Renewal |
|---|---|---|
| 플랜명 | Network Online Annual | **Enterprise Team** |
| 가격 | $2,000/연 | 동일 |
| 지불 방식 | 연간 일시납 | 동일 |
| 라이선스 유형 | Network Online (Prepaid) | 동일 |
| 최대 Seat | 구매 수량 N | 동일 |
| 구매 자격 | Company ID | **Organization 보유 Member (인증 불필요)** |

### 정책 상세

- 명칭 변경입니다. 가격·라이선스 유형·정책은 동일합니다.
- Concurrent User는 구매한 Seat 수만큼입니다.
- **Userpool** — 구매한 Seat를 팀원 간에 재배정할 수 있습니다.
  - 프로젝트 종료 후 다른 팀원에게 Seat 이관 가능
  - 기간별 할당으로 시즌·스프린트 단위 운영 가능
  - 사용하지 않는 라이선스가 그대로 남지 않습니다.
  - Userpool 관리(SW Account 생성·삭제·초대)는 **Team Console에서 수행**합니다. MyPage에서는 지원하지 않습니다.
- Organization이 없는 Member가 구매를 시작하면 Organization 생성 단계를 먼저 거칩니다.
- 자동 Trial은 제공하지 않습니다.

---

## 7. Enterprise Team Linux

| 항목 | Legacy | Renewal |
|---|---|---|
| 플랜명 | Network Online Linux | **Enterprise Team Linux** |
| 가격 | $2,300/연 | 동일 |
| 지불 방식 | 연간 일시납 | 동일 |
| 라이선스 유형 | Network Online (Prepaid) | 동일 |
| 최대 Seat | 구매 수량 N | 동일 |
| 구매 자격 | Company ID | **Organization 보유 Member (인증 불필요)** |

### 정책 상세

- 명칭 변경입니다. Legacy `Network Online Linux`가 `Enterprise Team Linux`로 바뀝니다.
- Linux 환경을 사용하는 팀 대상입니다. 라이선스 유형은 Enterprise Team과 동일한 Network Online입니다.
- 웹에서 직접 구매할 수 있습니다.
- Organization이 없는 Member가 구매를 시작하면 Organization 생성 단계를 먼저 거칩니다.

---

## 8. Academics

| 항목 | Legacy | Renewal |
|---|---|---|
| 플랜명 | Academic Annual | 동일 |
| 가격 | $1,500 / **Copy** / 연 | $1,500 / **Seat** / 연 |
| 지불 방식 | 연간 일시납 | 동일 |
| 라이선스 유형 | Network Online | 동일 |
| 최대 Seat | 구매 수량 N | 동일 |
| 구매 자격 | Academic 인증 완료 Company ID | **Academic 인증 완료 Organization** |

### 정책 상세

- 가격과 정책은 동일합니다. 변경된 것은 단위 용어(Copy → Seat)와 구매 자격 표현입니다.
- 교육기관 소속 사용자만 신청할 수 있습니다.
- 인증 절차: 교육기관 공식 도메인 심사 등록 → 인증 메일 → 도메인·서류 확인 후 Confirm
- 인증 서류: 정규 교육기관임을 증명하는 문서 사본 또는 PDF
- 인증은 Organization 레벨입니다. Organization이 없는 Member는 Organization 생성과 인증 신청을 함께 진행합니다.
- 인증 심사 중에는 구매를 진행할 수 없습니다. 인증 처리 소요 기간은 대외 노출하지 않습니다.
- Seat·라이선스 관리는 Team Console에서 수행합니다.
- Seat 수는 프리셋 탭으로 선택합니다. 스테퍼 방식은 사용하지 않습니다.

---

## 9. Indie

| 항목 | Legacy | Renewal |
|---|---|---|
| 플랜명 | Indie Annual | 동일 |
| 가격 | $800/연 | 동일 |
| 지불 방식 | 연간 일시납 | 동일 |
| 라이선스 유형 | Network Online | 동일 |
| 최대 Seat | 5 **Copy** | 5 **Seat** |
| 구매 자격 | Indie 인증 완료 Company ID | **Indie 인증 완료 Organization** |

### 정책 상세

- 가격과 인증 조건은 동일합니다. 변경된 것은 단위 용어와 구매 자격 표현, 그리고 진입 경로입니다.
- 진입 경로: Legacy에서는 독립 플랜 카드였고, Renewal에서는 Enterprise 영역 내에서 안내합니다.
- Annual 플랜만 제공합니다.
- 인증 조건: 직전 사이클 연 매출 $500,000 USD 이하 사업자
- 인증 서류: 사업자 등록 서류 + 매출 증빙 서류
- 자동 Reject 없음 — 신청 후 기간이 경과해도 자동 거절되지 않습니다. 수동 처리합니다.
- 신청 상태를 클라이언트에 노출하지 않습니다. Pending / In Review 등 상태값은 표시하지 않습니다.
- 인증 만료일은 `licenseEndDate` 기준입니다.
- 추가 결제는 지정된 Enduser에 **Add만 가능**하며 Extend는 불가합니다.
- 최대 5 Seat입니다. 초과 시 Enterprise 라이선스로만 구매할 수 있습니다.
- 구매 이후 사용·SW Account 운영·동시접속 기준은 Enterprise Team과 동일합니다.
- Enterprise Team 대비 약 60% 낮은 가격입니다.

---

## Appendix A. 용어 변경

이번 개편으로 표현이 바뀐 용어만 정리합니다.

| 구 용어 | 신 용어 | 바뀐 이유 |
|---|---|---|
| Copy | **Seat** | 전 플랜 단위 용어 통일. Academic·Indie 포함 |
| MemberType | **계정 유형 (Account Type)** | MemberType 개념 자체가 폐지됨 |
| Individual / Student / Academic / Indie (계정 유형으로서) | **Member + 개인 Verification** 또는 **Organization Owner + Organization Verification** | 계정 유형이 아니라 인증이 구매 자격을 부여하는 구조로 전환 |
| Company ID | **Organization Owner** | Organization을 생성한 Member(사람) |
| — | **Organization** | 조직 자체를 가리키는 신규 개념. Academic·Indie 인증의 주체 |
| License ID | **SW Account** | 라이선스 할당 전용 계정임을 명확히. Web 로그인 불가 |
| Network Online Monthly | **Enterprise Single** | 라이선스 유형·결제 주기 조합에서 구매 규모 중심으로 |
| Network Online Annual | **Enterprise Team** | 라이선스 유형·결제 주기 조합에서 구매 규모 중심으로 |
| Network Online Linux | **Enterprise Team Linux** | 라이선스 유형·결제 주기 조합에서 구매 규모 중심으로 |
| Student Trial | **Student Benefit** | 3개월 무료는 Trial이 아니므로 Trial 라벨 노출 금지 |
| Personal | **Individual** | 플랜명과 일치 |

---

## Appendix B. 정책 파일 갱신 이력

이 문서가 기준이며, 아래 파일들이 확정 정책을 따라오지 못한 상태였습니다. 2026-08-04에 전부 갱신했습니다.

| # | 파일 | 갱신 전 | 갱신 결과 |
|---|---|---|---|
| 1 | `docs/policy/checkout.md` | `Student Annual $99.00` 상품 행 잔존 | `Student Monthly $8.25` 행으로 교체 |
| 2 | `docs/policy/plan.md` · `MD-WEB-003.md` | Academic 단위를 `Copy`로 표기 | `Seat`로 수정. 스테퍼 → 프리셋 탭 |
| 3 | `docs/prd/solutions/students.md` · `individual.md` | Legacy 기준 문서 — 구매 횟수 제한 문구 포함 | 인증 시점 4년·횟수 무제한으로 갱신 |
| 4 | `docs/backlog/todo/MD-WEB-003.md` | Enterprise Team Linux를 "가격 미표기 · Contact Sales 전용 카드"로 확정 | $2,300/Seat/yr 표기 + 웹 구매 가능으로 수정 |
| 5 | `docs/policy/plan.md` | 기업용 플랜 Legacy 명칭이 `Enterprise Monthly / Annual / Offline` | `Network Online Monthly / Annual / Linux`로 수정 |

### 이번 범위 제외

- **국가별 결제 수단 분기** — Stripe · PayPal만 유지합니다. AliPay·Kakao Pay 등 지역별 결제 수단은 이번 범위에서 제외합니다.

---

## 참조

| 용도 | 경로 |
|---|---|
| 플랜 가격·라이선스 유형·Trial·플랜별 정책 | `docs/policy/plan.md` |
| 계정 구조·Organization·SW Account·인증 레이어 | `docs/policy/member.md` |
| Student 상세 정책 | `docs/policy/mypage.md` §6-6, `requirements/[MD-SITE]-student-plan-renewal.md` |
| Plan 페이지 카드 구성 | `docs/backlog/todo/MD-WEB-003.md` |
| 구 → 신 용어 매핑 | `docs/policy/plan-card.md` |

### 관련 Slack Canvas

| Canvas | 용도 | 링크 |
|---|---|---|
| [RENEWAL] Plan Renew | 이 문서의 게시본 (KR·EN) | https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N |
| [RENEWAL] Order/Checkout | Checkout 정책 게시본 | https://clo3d.slack.com/docs/T04BT3VBR/F0BL0SRE4TZ |
| [RENEWAL] Account Structure | 계정 구조 개편 게시본 | https://clo3d.slack.com/docs/T04BT3VBR/F0BBYNQ3S8P |
| Student Plan Renew | Student 상세 정책 | https://clo3d.slack.com/docs/T04BT3VBR/F0B4B5D86J1 |

---

# `EN`

# Plan Policy Changes

Audience: BD · SW PM · CS | Updated: 2026-08-04
Scope: plan policy only. Checkout and MyPage screen specs are out of scope for this document.

---

## 1. Summary of Changes

The renewal changes the following five items. Details are covered in the corresponding sections.

| No. | What changes | Details |
|---|---|---|
| 1 | Enterprise plan names renamed — Network Online Monthly → Enterprise Single, Network Online Annual → Enterprise Team, Network Online Linux → Enterprise Team Linux | §5, §6, §7 |
| 2 | Individual Annual moves from Prepaid to Subscription (auto-renewing) | §3 |
| 3 | Student moves from Annual $99 to Monthly $8.25 — 4 years from verification, no purchase-count limit, 3 months free | §4 |
| 4 | MemberType retired — restructured into Member + Organization + Verification | §2 |
| 5 | Terminology unified — Copy → Seat, etc. | Appendix A |

---

## 2. Purchase Eligibility Structure

The account structure was fully restructured as of 2026-06-23. **MemberType has been retired.** The terms in this section define "Eligibility" in every plan section that follows.

### 2-1. Account Types

| Account type | Description | Web login | SW login |
|---|---|---|---|
| Non-Member | Not logged in | — | — |
| Member | Every logged-in user. Consolidates the former Individual / Company ID / Academic / Indie | Yes | Yes |
| SW Account | License-assignment-only account created by an Organization Owner. Former License ID | **No** | Yes |

Every logged-in user is the same Member. Purchase eligibility comes from Verification, not from account type.

SW Accounts cannot log in to the web, so they never reach the Plan page. CLO-SET account integration is not supported for them either.

### 2-2. Organization

- Created by: any Member except an SW Account
- Can be created independently, with no plan purchase required
- The Member who creates an Organization becomes the **Organization Owner**
- No sub-roles (Owner only)
- Only an Organization Owner can create SW Accounts. No headcount limit

### 2-3. Verification Layers

| Layer | Verified entity | Verification | Unlocks |
|---|---|---|---|
| Individual | Member | Student verification | Student plan |
| Organization | Organization | Academic verification | Academic plan |
| Organization | Organization | Indie verification | Indie plan |
| Organization | Organization | None | Enterprise plans |

Student verification sits at the individual level and is independent of Organization membership. Academic and Indie verification sit at the Organization level, so they cannot be requested without an Organization.

---

## 3. Individual

| Item | Legacy | Renewal |
|---|---|---|
| Plan name | Individual Monthly / Individual Annual | Same |
| Price | Monthly $39 / Annual $280 | Same |
| Billing | Monthly auto-charge / **Annual one-time** | Monthly auto-charge / **Annual auto-charge** |
| License type | Subscription / **Prepaid** | Subscription / **Subscription** |
| Max Seats | 1 | Same |
| Eligibility | Individual MemberType | **All Members (no verification)** |

### Policy details

- Individual Annual moves from a one-time payment to a subscription. The renewal charge processes before the expiry date.
  - **Auto-renewal is not a toggle.** It is how the subscription works.
  - To stop renewing, the user cancels the subscription. After cancelling, there is no renewal once the remaining term ends, and access continues through that term.
- There are two purchase paths.
  - **Via trial**: the user picks Monthly or Annual when starting the trial. After 14 free days, auto-charging begins on the plan they picked.
    - Monthly selected: $39/mo
    - Annual selected: $280/yr
  - **Direct purchase**: buy Monthly or Annual immediately, with no trial.
- The trial can be cancelled while active, but **the same account cannot start another trial** afterward.
- Individual plans are single-user only. Account sharing and concurrent access are not supported.

### Differences from Legacy

- Legacy also **started a subscription automatically when the trial ended.** The current trial is not a separate license — it is a free period layered on the paid subscription product, so auto-charging is the default. (Policy decision 2023-11 · status confirmed 2026-06)
- Legacy did have an annual-license trial, but it was **retired on 2024-04-04**, leaving monthly only. The renewal does not restore it — it defines a new structure where **the plan is chosen at trial entry**.

---

## 4. Student

| Item | Legacy | Renewal |
|---|---|---|
| Plan name | Student Annual | **Student Monthly** |
| Price | $99/yr | **$8.25/mo** |
| Billing | Annual one-time | **Monthly auto-charge** |
| License type | Prepaid | **Subscription** |
| Max Seats | 1 | Same |
| Eligibility | Student MemberType | **Member with completed Student verification** |

### Policy details

- No Annual option. Monthly only.
- **No restriction on when or how many times a student purchases.** Any purchase within 4 years of the first Student verification is allowed.
- **Users on a legacy Annual license can switch to Monthly mid-term.** Annual time already used is deducted from the 4 years.
- **A 3-month free Student Benefit** applies. $0.00 is charged during the benefit period, and $8.25/mo auto-charging begins when it ends.
- **Never label this a "Trial"** — use "Student Benefit."

> See the Slack Canvas [Student Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0B4B5D86J1) and `requirements/[MD-SITE]-student-plan-renewal.md` for the full policy.

---

## 5. Enterprise Single

| Item | Legacy | Renewal |
|---|---|---|
| Plan name | Network Online Monthly | **Enterprise Single** |
| Price | $199/mo | Same |
| Billing | Monthly auto-charge | Same |
| License type | Network Online | Same |
| Max Seats | 1 | Same |
| Eligibility | Company ID | **Member with an Organization (no verification)** |

### Policy details

- Name change only. Price, license type, and policy are unchanged.
- Concurrent users: max 1. Concurrent access is not supported.
- A Member without an Organization is routed through Organization creation first. No verification required.
- No automatic trial. Trial availability is decided through inquiry.

---

## 6. Enterprise Team

| Item | Legacy | Renewal |
|---|---|---|
| Plan name | Network Online Annual | **Enterprise Team** |
| Price | $2,000/yr | Same |
| Billing | Annual one-time | Same |
| License type | Network Online (Prepaid) | Same |
| Max Seats | Quantity purchased (N) | Same |
| Eligibility | Company ID | **Member with an Organization (no verification)** |

### Policy details

- Name change only. Price, license type, and policy are unchanged.
- Concurrent users match the number of Seats purchased.
- **Userpool** — purchased Seats can be reassigned among team members.
  - Seats can be handed to another member once a project ends
  - Time-based allocation supports season- or sprint-level operation
  - Unused licenses do not sit idle
  - Userpool management (creating, deleting, and inviting SW Accounts) is handled **in Team Console**. It is not available in MyPage.
- A Member without an Organization is routed through Organization creation first.
- No automatic trial.

---

## 7. Enterprise Team Linux

| Item | Legacy | Renewal |
|---|---|---|
| Plan name | Network Online Linux | **Enterprise Team Linux** |
| Price | $2,300/yr | Same |
| Billing | Annual one-time | Same |
| License type | Network Online (Prepaid) | Same |
| Max Seats | Quantity purchased (N) | Same |
| Eligibility | Company ID | **Member with an Organization (no verification)** |

### Policy details

- Name change. Legacy `Network Online Linux` becomes `Enterprise Team Linux`.
- Built for teams working in Linux environments. The license type is Network Online, the same as Enterprise Team.
- Available for direct purchase on the web.
- A Member without an Organization is routed through Organization creation first.

---

## 8. Academics

| Item | Legacy | Renewal |
|---|---|---|
| Plan name | Academic Annual | Same |
| Price | $1,500 / **Copy** / yr | $1,500 / **Seat** / yr |
| Billing | Annual one-time | Same |
| License type | Network Online | Same |
| Max Seats | Quantity purchased (N) | Same |
| Eligibility | Company ID with Academic verification | **Organization with Academic verification** |

### Policy details

- Price and policy are unchanged. What changed is the unit term (Copy → Seat) and how eligibility is expressed.
- Only users affiliated with an educational institution may apply.
- Verification flow: register the institution's official domain for review → verification email → confirm after checking the domain and documents.
- Verification documents: a copy or PDF proving the applicant is an accredited educational institution.
- Verification sits at the Organization level. A Member without an Organization creates one and applies for verification in the same flow.
- Purchase is blocked while verification is under review. Processing time is not disclosed externally.
- Seat and license management is handled in Team Console.
- Seat count is selected from preset tabs. A stepper is not used.

---

## 9. Indie

| Item | Legacy | Renewal |
|---|---|---|
| Plan name | Indie Annual | Same |
| Price | $800/yr | Same |
| Billing | Annual one-time | Same |
| License type | Network Online | Same |
| Max Seats | 5 **Copies** | 5 **Seats** |
| Eligibility | Company ID with Indie verification | **Organization with Indie verification** |

### Policy details

- Price and eligibility conditions are unchanged. What changed is the unit term, how eligibility is expressed, and the entry point.
- Entry point: Legacy had a standalone plan card; the renewal surfaces it within the Enterprise area.
- Annual only.
- Eligibility: businesses with annual revenue of $500,000 USD or less in the previous cycle.
- Verification documents: business registration plus proof of revenue.
- No auto-reject — applications are not declined automatically after any period. They are processed manually.
- Application status is not exposed to the client. States such as Pending or In Review are not displayed.
- Verification expiry follows `licenseEndDate`.
- Additional purchases can only **Add** to a designated Enduser. Extend is not allowed.
- Max 5 Seats. Beyond that, only an Enterprise license can be purchased.
- After purchase, usage, SW Account operation, and concurrent access follow the same rules as Enterprise Team.
- Roughly 60% lower than Enterprise Team.

---

## Appendix A. Terminology Changes

Only terms whose wording changed in this renewal are listed.

| Former term | New term | Why it changed |
|---|---|---|
| Copy | **Seat** | Unifies the unit term across all plans, including Academic and Indie |
| MemberType | **Account Type** | The MemberType concept itself has been retired |
| Individual / Student / Academic / Indie (as account types) | **Member + individual Verification** or **Organization Owner + Organization Verification** | Eligibility now comes from verification, not from account type |
| Company ID | **Organization Owner** | The Member (a person) who created an Organization |
| — | **Organization** | New concept for the organization itself. The entity that holds Academic and Indie verification. Do not use the internal planning term Group |
| License ID | **SW Account** | Makes clear it is a license-assignment-only account. Cannot log in to the web |
| Network Online Monthly | **Enterprise Single** | Shifts from a license-type-plus-billing-cycle combination to purchase scale |
| Network Online Annual | **Enterprise Team** | Shifts from a license-type-plus-billing-cycle combination to purchase scale |
| Network Online Linux | **Enterprise Team Linux** | Shifts from a license-type-plus-billing-cycle combination to purchase scale |
| Student Trial | **Student Benefit** | The 3 free months are not a trial, so the "Trial" label must not appear |
| Personal | **Individual** | Matches the plan name |

---

## Appendix B. Policy File Update Log

This document is the source of truth. The files below had fallen behind it and were all updated on 2026-08-04.

| # | File | Before | After |
|---|---|---|---|
| 1 | `docs/policy/checkout.md` | `Student Annual $99.00` row still present | Replaced with a `Student Monthly $8.25` row |
| 2 | `docs/policy/plan.md` · `MD-WEB-003.md` | Academic unit written as `Copy` | Changed to `Seat`. Stepper → preset tabs |
| 3 | `docs/prd/solutions/students.md` · `individual.md` | Legacy-era docs — included a purchase-count cap | Updated to 4 years from verification, no count limit |
| 4 | `docs/backlog/todo/MD-WEB-003.md` | Enterprise Team Linux fixed as "no price shown · Contact Sales only card" | Changed to $2,300/Seat/yr with web purchase available |
| 5 | `docs/policy/plan.md` | Legacy enterprise names read `Enterprise Monthly / Annual / Offline` | Corrected to `Network Online Monthly / Annual / Linux` |

### Out of Scope

- **Region-specific payment methods** — only Stripe and PayPal are retained. Regional methods such as AliPay and Kakao Pay are out of scope for this renewal.
- **Checkout and MyPage screen specs** — the Seat selection UI, the order in which purchase type appears, Order Panel composition, and similar details are covered in a separate document.

---

## References

| Purpose | Path |
|---|---|
| Plan pricing, license types, trial, per-plan policy | `docs/policy/plan.md` |
| Account structure, Organization, SW Account, verification layers | `docs/policy/member.md` |
| Student policy detail | `docs/policy/mypage.md` §6-6, `requirements/[MD-SITE]-student-plan-renewal.md` |
| Plan page card composition | `docs/backlog/todo/MD-WEB-003.md` |
| Former → new terminology mapping | `docs/policy/plan-card.md` |

### Related Slack Canvases

| Canvas | Purpose | Link |
|---|---|---|
| [RENEWAL] Plan Renew | Published version of this document (KR·EN) | https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N |
| [RENEWAL] Order/Checkout | Published checkout policy | https://clo3d.slack.com/docs/T04BT3VBR/F0BL0SRE4TZ |
| [RENEWAL] Account Structure | Published account structure changes | https://clo3d.slack.com/docs/T04BT3VBR/F0BBYNQ3S8P |
| Student Plan Renew | Student policy detail | https://clo3d.slack.com/docs/T04BT3VBR/F0B4B5D86J1 |
