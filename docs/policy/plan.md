# POLICY_PLAN

Source: https://clo.atlassian.net/wiki/spaces/MDT/pages/3120529409/POLICY_PLAN
Canvas: [[RENEWAL] Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N) · 레포 원본 `requirements/[MD-SITE]-plan-renewal-changes.md`

---

## 1. 라이선스 유형

| 유형 | 설명 | 사용 기준 |
| --- | --- | --- |
| Network Online | 네트워크 기반 라이선스 | SW Account (구 License ID) 기준 사용 |
| Subscription | 기간제 구독 라이선스 | 월간 자동결제 |
| Prepaid | 일시 결제형 라이선스 | 연간 단일 결제 |

---

## 2. 플랜별 상세

### 2-1. 기업용 (Enterprise / Academic / Indie)

| 플랜명 | 라이선스 유형 | 가격 | 기간 | Concurrent User | 비고 |
| --- | --- | --- | --- | --- | --- |
| Enterprise Single | Network Online | $199 | 월간 | Max 1 | 동시접속 불가, 자동결제 (구 Network Online Monthly) |
| Enterprise Team | Network Online | $2,000 | 연간 | 구매된 N Seat | Prepaid (구 Network Online Annual) |
| Enterprise Team Linux | Network Online | $2,300 | 연간 | 구매된 N Seat | Prepaid, Linux 환경 (구 Network Online Linux). 웹 구매 가능 |
| Academic Annual | Network Online | $300/Seat | 연간 | 구매된 N Seat | Academic 인증 필요. 10석 이상 구매 시 50% 할인 (2026-08-25 개정 — 구 $1,500/Seat 폐기) |
| Indie Annual | Network Online | 가격 미노출* | 연간 | Max 5 Seat | Indie 인증 필요, 웹 판매 제외 |

\* Indie는 웹 판매 대상이 아니다 — 백오더 전용으로 판매하며 사이트에 가격을 노출하지 않는다 (2026-08-25 확정, §3 Indie 참조)

### 2-2. 개인용 (Individual / Student)

| 플랜명 | 라이선스 유형 | 가격 | 기간 | 사용 기준 | 비고 |
| --- | --- | --- | --- | --- | --- |
| Individual Monthly | Subscription | $39 | 월간 | 1명 | 자동결제 |
| Individual Annual | Subscription | $280 | 연간 | 1명 | 자동 갱신 (구 Prepaid에서 전환) |
| Student Monthly | Subscription | $8.25 | 월간 | 1명 | 학생 인증 필수, 4년 이내, 3개월 무료 Student Benefit |

---

## 3. 플랜별 정책

### Trial 정책 (2026-08-21 보강, ref: MDWEB-916)
- **개인 (Individual)**: 두 가지 진입 경로가 있다
  - Trial 경유: Trial 시작 시 Monthly, Annual 중 하나를 선택 → 14일 무료 → 종료 후 선택한 플랜으로 자동 결제 시작
    - Monthly를 선택한 경우: $39/월
    - Annual을 선택한 경우: $280/년
  - 바로 구매: Trial 없이 Monthly 또는 Annual 즉시 구매
- **Trial은 계정당 1회**: 취소했든 정상 완료했든 Trial 이력이 있는 계정은 재진입 시 바로 구매 경로로 진입한다
- **Trial 취소**: Trial 기간 중 취소 가능
- Trial 진행 중 즉시 유료 전환은 제공하지 않는다. 종료 후 자동 결제로 시작한다
- Trial 진행 중 Student 인증을 완료해도 Trial은 유지된다
- Trial 종료 후 첫 결제 실패: Suspended 처리를 동일 적용한다 (개인용 공통 참조)
- Trial 진행 중 전환 대상 플랜 변경(Monthly ↔ Annual) *(개발 확인 필요 — PG 구독 구조상 가능한지)*
- **기업 (Enterprise / Academic / Indie)**: Trial 제공 여부는 문의를 통해 결정 (자동 Trial 없음)

### Individual Annual 자동 갱신 (2026-08-05 확정, 2026-08-21 보강)
- Individual Annual은 Subscription이므로 **자동 갱신이 기본 동작**이다. 켜고 끄는 옵션이 아니다.
- Checkout·MyPage 어디에도 Auto Renew 토글을 두지 않는다.
- 만료일 전 자동 갱신 결제를 진행한다.
- **갱신 D-30, D-7에 이메일로 고지한다.** 고지에 갱신 청구 금액을 명시한다.
- 갱신 결제에는 Coupon을 적용하지 않는다.
- 갱신 결제 실패: Suspended 처리를 동일 적용한다 (개인용 공통 참조)
- 갱신을 원하지 않으면 **구독을 해지**한다. 해지 시 잔여 기간 종료 후 갱신하지 않고, 기간 내 사용은 유지된다.

### 환불 (2026-08-23 확정)
- Trial 경유 첫 자동 결제(Monthly, Annual): **결제 후 24시간 이내 환불 가능.** 이후 불가
- 바로 구매 첫 결제: 환불 불가 — 결제 즉시 사용 개시로 간주
- 갱신 결제: 환불 불가
- Student Benefit 종료 후 첫 결제: 환불 불가 (Trial 24시간 룰 미적용 — Benefit 3개월이 무료 체험 역할)
- Prepaid(Enterprise Team, Team Linux, Academic, Indie): 기간 중 취소와 환불 불가. 만료 후 재구매
- Refund Policy 전문은 legal 페이지에 게재하고 Checkout 통합 체크박스에서 링크한다 (`checkout.md` §14) *(법무 확인 필요 — 페이지 신설)*

### 플랜 전환 (2026-08-21 확정, ref: MDWEB-916)
- Monthly ↔ Annual, Individual ↔ Student 간 직접 전환을 제공하지 않는다. 구독을 해지하고 새 플랜을 구매한다 (PG 내 플랜 분리)
- 해지 후 잔여 기간 중에도 새 플랜을 구매할 수 있다
- 재구매한 구독은 결제 즉시 시작한다. 기존 구독 잔여 기간과 겹칠 수 있으며 Checkout에서 잔여 기간을 안내한다 (`checkout.md` §6)
- 이전 플랜 만료 후 새 플랜을 적용하는 예약 방식은 리뉴얼 이후 검토 항목
- Enterprise Single → Team 전환은 예외적으로 제공한다 (`checkout.md` §11)

### 개인용 공통
- Individual / Student 플랜은 단일 사용자 전용
- 계정 공유 불허
- 동시접속 미지원
- **Suspended (결제 실패)**: 실패 즉시 접속 제한 → 1주일 유예 + 알림 3회 → 미해결 시 취소. Monthly, Annual, Trial 종료 후 첫 결제에 동일 적용
- Retry Payment의 결제수단 변경은 Stripe(카드)만 가능하다. PayPal, AliPay는 기존 수단으로만 재시도한다
- 자동 결제는 전 결제수단(Stripe, PayPal, AliPay)에서 동일하게 동작한다

### Student
- 학생 인증 완료 후 3개월 Student Benefit(무료) 제공 — "Trial" 라벨 노출 금지
- **무료 기간 시작: Student 구독 시작 시점** (2026-08-21 정정 — 인증은 구매 자격만 부여하며, 인증 승인 시점과 무관)
- 무료 기간 종료 후 $8.25/월 자동결제 시작 (Subscription)
- 이용 기간: 최초 학생 인증 승인일 기준 4년(48개월) 이내. 구매 횟수 제한 없음 — 기간 내 언제든 구매 가능
- 4년 카운터: Pause · Suspended · Cancelled 중에도 계속 흐름 (멈추지 않음)
- 4년 초과 시 Student 플랜 이용 불가 — 구독 중간에 4년이 도래하면 결제된 기간은 끝까지 사용하고, 이후 갱신부터 거부한다. Individual 플랜 전환을 안내한다 (2026-08-21 확정)
- Student 인증에 유효기간 없음 — 4년 카운터만 적용 (재인증 없음)
- Annual 옵션 없음 (Monthly only)
- Pause / Suspended 처리: Individual 플랜과 동일 로직 적용 (개인용 공통 참조)

### Student 취소 및 환불
- Student Benefit 중 취소 후 재구독: 유료로 시작, 4년 기간 유지 (취소 처리 방식은 미결 — A2 결정 의존)
- 첫 결제 이후 환불: 불가
- Legacy users 환불 요청: 불가

### Student Legacy Users (구 Annual Prepaid 사용자)
- 4년 카운트 기준은 Legacy 사용자도 동일하게 **최초 학생 인증 승인일**이다
- 이 4년 이내라면 Legacy 사용자도 Monthly로 전환해 자유롭게 이용할 수 있다
- 기존 Annual 구독자(만료, 4년 이내): 무료 혜택 + Monthly 구독 제공

### Enterprise Team / Team Linux — Userpool
- Seat(SW Account)는 프로젝트 종료 후 다른 팀원에게 재배정할 수 있다
- 시즌·스프린트 단위로 기간별 할당이 가능하다 — 사용하지 않는 라이선스가 그대로 남지 않는다
- Userpool 관리(SW Account 생성·삭제·재배정)는 **Team Console에서만 수행한다. MyPage에서는 관리하지 않는다**

### Academic
1. Academic 인증 완료된 Organization만 구매 가능 (인증 주체는 Organization, 구매 주체는 Organization Owner)
2. 교육기관 소속 사용자만 신청 가능
3. 인증 방법: 교육기관 공식 도메인 심사 등록 → 인증 메일 → 도메인/서류 확인 후 Confirm
4. 인증 서류: 정규 교육기관임을 증명하는 문서 사본 또는 PDF
5. Seat·라이선스 관리는 Team Console에서 수행한다

### Indie (2026-08-25 개정 — 웹 판매 제외)
**Indie는 웹 판매 대상이 아니다. 백오더 전용으로 판매하며 사이트에 가격을 노출하지 않는다.**
Plan 카드의 Start Indie 클릭 시 Organization 생성과 Indie 인증 신청 리다이렉트만 제공하고, 구매는 백오더로 처리한다.

1. Indie 인증 완료된 Organization만 구매 가능 (인증 주체는 Organization, 구매는 백오더로 접수)
2. 직전 사이클 연 매출 $500,000 USD 이하 사업자만 신청 가능
3. 인증 절차: 매출 증빙 + 사업자 등록 증빙 제출 → 접수
4. Annual 플랜만 제공
5. 구매 이후 사용/SW Account 운영/동시접속 기준은 Enterprise Team과 동일

### Indie 운영 정책 (1차 배포 확정, ref: MDWEB-590)
- **추가 결제**: 지정된 Enduser에 Add만 가능. Extend 불가
- **인증 만료일**: `licenseEndDate` 기준
- **자동 Reject 없음**: 신청 후 일정 기간 경과 시 자동 거절 없음 (수동 처리)
- **신청 상태 클라이언트 미노출**: Pending / In Review 등 상태값 UI 미노출
- **최대 구매 수량**: Indie 인증 Organization 기준 최대 5 Seat. 초과 시 Enterprise 라이선스로만 구매 가능

---

## 4. Checkout UI 정책 (확정, 2026-05-11)

### 4-1. 지불 방식 (Billing Toggle)

- 레이블: **"지불 방식"** — "결제 주기" 사용 금지
- 배치: **연간(Annual) 항상 왼쪽**, 월간(Monthly) 오른쪽
- Default 선택: **연간(Annual)** — 모든 Checkout 화면 공통
- 예외: "Monthly 선택" 시나리오를 명시적으로 보여주는 WF 프레임에서만 Monthly selected 허용

### 4-2. 구매 유형 (Purchase Type) (2026-08-25 개정)

- Purchase Type은 `New`, `Add/Extend`, `Convert` 3종이다. 정의, 필터 기준, 금액 계산은 `checkout.md` §9~§11을 따른다
- Step 1에서 Purchase Type 카드가 SW Account 목록을 필터하고, 선택한 카드와 계정에 따라 Purchase Type이 정해진다

### 4-3. Seat 수 용어 및 UI

- 용어: **"Seat"** — Academic/Indie 포함 전 플랜에서 "Copy" 사용 금지
- Enterprise Team · Team Linux Seat 선택 UI: 프리셋 탭 **[5][10][20][직접 입력]** — 프리셋에 1은 없으나 직접 입력으로 1석 구매 가능
- Academic Seat 선택 UI: 프리셋 탭 **[5][10][20][직접 입력]** (스텝퍼 사용 금지)
- Indie: 웹 판매 제외 — Checkout에 도달하지 않는다 (§3 Indie, 2026-08-25)

### 4-4. 세금 (Tax)

- 부과 조건: 특정 국가/지역(미국 일부 주, EU VAT 등) 결제 시 자동 계산
- Order Summary 표시: `세금` 항목 소계 아래 별도 행으로 표시
- 세금 계산 미확정 국가: 항목 미노출

### 4-5. Discount

- 발생 조건: 특정 프로모션 코드 또는 관리자 지정 할인 적용 시
- Order Summary 표시: `Discount` 항목으로 `-$n` 음수 표시
- Annual / Monthly 모두 적용 가능

### 4-6. Coupon (2026-08-05 확정, 2026-08-21 정정)

- 적용 대상: **Individual Monthly와 Individual Annual의 최초 구매**에 쿠폰 입력 가능. 그 외 모든 경우 미노출 (기존 "Annual만"은 오기)
- 자동 갱신 결제에는 적용하지 않음
- Trial 경유 첫 결제의 적용 여부 *(정책 확인 필요 — Trial Checkout에서 Coupon 입력을 받을지)*
- UI: 보유 쿠폰 목록에서 선택. 항목 클릭 시 입력 모달 (2026-08-25 개정 — `checkout.md` §5)
- 유효 쿠폰: Order Summary에 `Coupon` 항목 `-$n` 표시
- 유효하지 않은 쿠폰: 모달 안에 안내 문구 표시
- Tax와 중복 적용 가능 (Tax는 Coupon 적용 후 금액 기준으로 계산)

### 4-7. 결제 수단 (2026-08-05 확정, 근거: Order·Checkout canvas F0BL0SRE4TZ)

| 조건 | 노출 결제 수단 |
| --- | --- |
| 중국 — 접속 IP가 중국 또는 Billing Address 국가가 중국 | 카드 + **AliPay** |
| 그 외 (한국 포함) | 카드 + PayPal |

- **Kakao Pay는 제공하지 않습니다.** 한국도 카드 + PayPal입니다.
- AliPay는 중국 전용입니다. 다른 국가에 노출하지 않습니다.
- 노출 기준은 **접속 IP 또는 Billing Address 국가 중 하나라도 중국이면** AliPay를 노출합니다. 두 조건은 주소 입력 여부와 무관하게 상시 함께 적용됩니다 (주소 입력 전에만 IP로 판정하는 것이 아님).
- Legacy 대비 변경: 한국 Kakao Pay 제거.
