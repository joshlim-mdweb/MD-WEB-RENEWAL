# [MD|SITE] Student Plan Renewal — Monthly Trial 모델 전환

Epic Key: `MDWEB-773` | 출처: 미팅 2026-05-19 + Slack Doc | 작성일: 2026-05-21
Canvas: [Student Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0B4B5D86J1) · 상위 플랜 정책 [[RENEWAL] Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N)

---

## 2. Background

기존 Student Annual License($99)는 1회 단건 구매 구조로, 구독 전환율 추적이 불가능하고 장기 유지 유인이 없었다. 졸업 후 개인 플랜($X/월)으로 전환 시 가격 갭이 커 이탈 위험이 높다는 내부 판단에 따라, 3개월 무료 Student Benefit → $8.25/월 자동갱신 구독 모델로 전환한다. 3개월 무료는 고정 정책이 아닌 **일시적 프로모션**으로, 전환율 테스트 후 기간 및 지속 여부를 재결정한다.

> 미팅 확정 사항: 2026-05-19 Dahye Jang, Emma Chang, 개발팀 참석

---

## 미팅 확정 내용

| 항목 | 이전 | 확정 |
|---|---|---|
| 3개월 무료 성격 | 고정 정책 | **일시적 프로모션** — 전환율 테스트 후 재결정. 사라질 수 있음 |
| 4년 기간 기준 | 구매 시점 | **인증 시점**으로 확정 (Dahye 동의) |
| Legacy Annual 차감 | 미정 | 기존 Annual 사용 기간 차감 후 남은 기간만 학생 플랜 이용 가능 |
| 4년 연장 | 미정 | CS 요청 기반 운영, 퍼블릭 공시 없이. 기술적으로 어렵지 않음 |
| 고등학생 정책 | 미정 | (논의 필요) — Dahye 검토 예정 |
| 졸업 후 할인 | 미정 | (논의 필요) — 50% 개인 플랜 할인 아이디어 (Emma 제안) |
| 쿠폰 방식 | 쿠폰 발급 | 방식 미정 — 쿠폰 아니어도 됨. 3개월 무료 적용이 목적 |
| 적용 시점 | 미정 | **6월 말 ~ 7월 초** |
| 릴리즈 분리 | 미정 | 상품 변경 → 리뉴얼 **전** / UI 변경 → 리뉴얼 **후** (또는 현재 컴포넌트 활용) |

---

## 3. Requirements

| 기능명 | Description |
|---|---|
| Monthly 상품 전환 | 기존 Annual $99 상품을 비활성화하고 $8.25/월 Monthly 상품으로 대체한다. |
| 3개월 무료 Student Benefit | 신규 학생 인증 유저는 최초 3개월간 무료로 이용한다. Student Benefit 기간 중 실제 청구는 없다. |
| Benefit 시작 시 결제 정보 수집 | Student Benefit 시작 시점에 결제 수단을 등록한다. Benefit 종료 후 자동으로 $8.25 청구가 시작된다. |
| 자동갱신 구독 | Benefit 종료 후 $8.25/월 자동갱신이 시작된다. 사용자는 사전 이메일 알림을 받는다. |
| 4년 기간 기준 변경 | 학생 플랜 이용 가능 기간 4년을 구매 시점이 아닌 **인증 시점** 기준으로 카운트한다. |
| 인증 시 고지 | 인증 완료 시 "오늘부터 4년간 학생 플랜을 이용할 수 있습니다"를 명시한다. |
| Legacy Annual 유저 — 활성 | Annual 구독이 활성인 Legacy 유저에게 3개월 무료 혜택을 자동 부여하고 이메일로 안내한다. (Annual 만료 후 Monthly 재구독 시 적용) |
| Legacy Annual 유저 — 만료 | Annual 구독이 만료됐고 최초 인증일로부터 4년 이내인 유저는 프로모션 + Monthly 구독 이용이 가능하다. |
| Legacy 기간 차감 | Legacy 유저가 Monthly로 재구독할 때 기존 Annual 사용 기간(1년 단위)을 4년에서 차감한다. |
| Legacy 환불 불가 | Legacy 유저의 기존 Annual 구매에 대한 환불은 불가하다. |
| 결제 실패 Lock | 결제 실패 즉시 라이선스를 자동으로 Lock 처리한다. |
| 4년 기간 연장 | CS 요청 시 관리자가 학생 인증 기간을 연장할 수 있다. 퍼블릭 공시 없이 CS 판단으로 운영한다. |
| My Page 만료일 표시 | Student 타입 유저의 My Page에 학생 인증 만료일을 표시한다. |
| Benefit 종료 전 알림 이메일 | Benefit 종료 7일 전 / 3일 전 / 당일에 청구 시작 알림 이메일을 발송한다. |

---

## 4. Scope

### 4.1 Web (Site)

- Checkout 페이지: Monthly Student Benefit 플로우로 변경. Annual 옵션 제거. Benefit 시작 시 결제 정보 입력 단계 추가.
- 학생 인증 완료 화면: 4년 시작 고지 메시지 추가.
- My Page: Student 타입 시 학생 인증 만료일 표시. (기존 컴포넌트에 날짜 필드 추가 수준)
- Student Solutions 페이지: Benefit 조건 및 유의사항 문구 업데이트.

### 4.2 Admin (CLOver)

- $8.25/월 Monthly 학생 상품 생성 및 Annual 상품 비활성화.
- 학생 인증 만료일 조회 및 수동 연장 기능 추가 (CS용).
- Legacy 유저 일괄 처리 (활성/만료 분류, 혜택 자동 부여).
- 결제 실패 감지 → 라이선스 자동 Lock 로직.

### 4.3 Email Communication Management

- **Benefit 종료 전 알림 시퀀스**: D-7 / D-3 / D-0 발송.
- **Legacy 유저 혜택 안내**: Annual 활성 유저 대상 혜택 적용 안내.
- **인증 완료 이메일**: 4년 기간 시작 고지 포함.
- **결제 실패 알림**: Lock 처리 안내 + 결제 수단 업데이트 유도.

---

## 5. Flow

### 5.1 신규 학생 — Student Benefit 가입 플로우

| Step | Actor | Description |
|---|---|---|
| 1 | 학생 | 학생 인증을 신청한다. (이메일 또는 서류) |
| 2 | System | 인증을 확인하고 Student 타입으로 전환한다. 4년 카운트를 시작한다. |
| 3 | System | 인증 완료 이메일을 발송한다. "오늘부터 4년간 학생 플랜을 이용할 수 있습니다" 고지 포함. |
| 4 | 학생 | Checkout 페이지에서 [Start Student Benefit]을 클릭한다. |
| 5 | 학생 | 결제 수단을 등록한다. ($0 결제) |
| 6 | System | Student Benefit을 시작한다. 3개월간 청구 없이 라이선스를 활성화한다. |
| 7 | System | Benefit 종료 D-7에 알림 이메일을 발송한다. |
| 8 | System | Benefit 종료 D-3에 알림 이메일을 발송한다. |
| 9 | System | Benefit 종료 당일 $8.25 첫 청구를 진행한다. 성공 시 구독 유지. |
| 10 | System | 결제 실패 시 라이선스를 즉시 Lock 처리하고 결제 수단 업데이트 유도 이메일을 발송한다. |

### 5.2 Legacy Annual 유저 — 활성 상태

| Step | Actor | Description |
|---|---|---|
| 1 | System | 프로모션 런칭 시점에 활성 Annual 학생 유저를 일괄 식별한다. |
| 2 | System | 3개월 무료 혜택을 해당 계정에 자동 부여하고 안내 이메일을 발송한다. |
| 3 | 유저 | 기존 Annual이 만료된 후 Monthly 구독을 시작한다. |
| 4 | System | 혜택을 적용해 최초 3개월을 무료로 제공한다. 기존 Annual 사용 기간(1년)을 4년에서 차감한 잔여 기간 내에서 구독이 유지된다. |

### 5.3 4년 만료 후 CS 요청

| Step | Actor | Description |
|---|---|---|
| 1 | 유저 | CS에 학생 플랜 연장을 요청한다. |
| 2 | CS | 요청 내용을 검토하고 타당성을 판단한다. |
| 3 | Admin | 관리자 화면에서 해당 계정의 학생 인증 만료일을 연장한다. |
| 4 | System | 연장된 기간 내에서 구독이 유지된다. |

---

## 6. Action Item

| # | 영역 | 작업 | 담당 | 우선순위 |
|---|---|---|---|---|
| 1 | BE | $8.25/월 Monthly 학생 상품 생성, Annual 비활성화 | BE | P0 |
| 2 | BE | 3개월 무료 Student Benefit 로직 + 자동갱신 결제 로직 | BE | P0 |
| 3 | BE | Benefit 시작 시 결제 정보 수집 플로우 | BE | P0 |
| 4 | BE | 4년 카운트 기준 인증 시점으로 변경 | BE | P0 |
| 5 | BE | Legacy Annual 유저 분류 및 혜택 자동 부여 로직 | BE | P0 |
| 6 | BE | Legacy 기간 차감 로직 (Annual 사용분 4년에서 차감) | BE | P0 |
| 7 | BE | 결제 실패 시 라이선스 즉시 Lock | BE | P0 |
| 8 | BE/Email | Benefit 종료 전 알림 이메일 시퀀스 (D-7/D-3/D-0) | BE | P0 |
| 9 | Admin | CS용 학생 인증 만료일 연장 기능 | Admin | P1 |
| 10 | FE | Checkout UI — Monthly Student Benefit 플로우 (결제 정보 수집 포함) | FE | P0 |
| 11 | FE | My Page — Student 인증 만료일 표시 | FE | P1 |
| 12 | PM | 고등학생 4년 기간 정책 확정 | PM | (논의 필요) |
| 13 | PM | 졸업 후 개인 플랜 전환 할인 프로모션 설계 | PM | (논의 필요) |
| 14 | PM | 월간 구독 중도 해지/환불 정책 확정 | PM | (논의 필요) |

---

## 7. Impact

| 지표 | 측정 방법 |
|---|---|
| 학생 Benefit 전환율 | Benefit 시작 수 / 인증 완료 수 |
| Benefit → 유료 전환율 | 첫 $8.25 결제 성공 수 / Benefit 시작 수 |
| 결제 실패율 | Lock 발생 수 / 월간 청구 시도 수 |
| Legacy 유저 재구독율 | Legacy 유저 중 Monthly 재구독 수 / 전체 Legacy 수 |
| 프로모션 어뷰징 탐지 수 | (모니터링 시스템 구축 후 측정) |
