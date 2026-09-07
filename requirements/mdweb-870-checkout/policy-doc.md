# [MD|SITE] 결제 정책 — Order / Checkout

Epic Key: `MDWEB-870` | 요청: Josh Lim | 출처: Jira MDWEB-870 (Epic MDWEB-827) | 작성일: 2026-07-29 | 갱신: 2026-08-05
독자: BD · CS · 글로벌팀 | 화면 설계 상세: `design-spec.md`

## 범위

플랜을 고른 뒤 결제를 마칠 때까지 일어나는 일만 다룹니다. 계정 구조와 플랜 정책 자체는 각 문서를 따릅니다.

## 1. 플랜과 금액

| 플랜 | 금액 | 지불 방식 | Seat | 구분 |
|---|---|---|---|---|
| Individual Monthly | $39 / 월 | 월간 자동결제 | 1 | 개인 |
| Individual Annual | $280 / 년 | 연간 자동결제 | 1 | 개인 |
| Student Monthly | $8.25 / 월 | 월간 자동결제 | 1 | 개인 |
| Enterprise Single | $199 / 월 | 월간 자동결제 | 1 | 개인 |
| Enterprise Team | $2,000 / Seat | 연간 | N (제한 없음) | Organization |
| Enterprise Team Linux | $2,300 / Seat | 연간 | N (제한 없음) | Organization |
| Academic Annual | $1,500 / Seat | 연간 | N (제한 없음) | Organization |
| Indie Annual | $800 / Seat | 연간 | 최대 5 | Organization |

- Organization 플랜 표기 금액은 Seat 1개당 단가. 총액 = 단가 × Seat 수
- Seat 수 = 동시접속 허용 수. 한 번의 결제로 산 Seat는 하나의 SW Account에 배정
- 동시접속 집계 대상 — SW Account 로그인 + Userpool Guest 접속

## 2. Order → Checkout 플로우

**Order와 Checkout을 한 페이지에서 처리합니다.** 주문 내역 확인과 결제 정보 입력을 분리하지 않습니다.

| 페이지 구성 요소 | 역할 | 노출 |
|---|---|---|
| 구매 대상 | SW Account 선택 · 신규 생성, Seat 수 | Organization 플랜만 |
| 지불 방식 | 연간 / 월간 선택 | 선택 가능한 플랜만 |
| 결제 정보 | 청구지 주소, 결제수단 | 전 플랜 |
| Coupon 입력 | 쿠폰 코드 입력 + 적용 | **개인 플랜 연간 결제만.** Organization 플랜은 미노출 |
| Order Summary | 소계 · 할인 · 세금 · 합계 | 전 플랜 |
| 약관 동의 | 약관 체크박스 | 전 플랜 |
| CTA | 결제 실행 | 전 플랜 |

### 진입 경로

| 결제 모드 | 진입 경로 | 결제 대상 |
|---|---|---|
| 신규 구매 | Plan 페이지 플랜 카드 | 새 라이선스 |
| Seat 추가 (Add) | Team Console | 기존 라이선스의 Seat 증가분 |
| 기간 연장 (Extend) | Team Console | 기존 라이선스의 연장 기간 |

- 사용자가 결제 페이지에서 모드를 고르지 않습니다.
  - **Seat 수량**은 진입 경로가 정합니다 (Plan 페이지 = 신규 / Team Console = Add)
  - **계정 처리(New · Extend)** 는 SW Account를 고르면 시스템이 판정합니다. 선택 컨트롤이 없고, 판정 결과와 근거(현재 만료일 → 구매 후 만료일)를 선택 영역 안에 표시합니다
- **Reserve(예약 구매)는 제공하지 않습니다.**

### 진입 조건

| 상태 | 처리 |
|---|---|
| Non-Member | 로그인 페이지로 이동. 로그인 후 원래 경로 복귀 |
| SW Account | 진입 경로 없음 — 웹 로그인 불가 |
| NFR 라이선스 | Checkout 경유 안 함 |
| 라이선스 보유 | 같은 종류의 플랜 재구매 차단. My Page 라이선스 관리로 안내 |
| Student 플랜 — **최초 학생 인증 승인일 기준 4년** 초과 | 차단. Individual 플랜 안내 |
| Student · Academic · Indie 플랜 — 인증 미완료 | 차단. 인증 절차 안내 |
| Academic 플랜 — 인증 대기 중 | 차단. 인증 검토 중 안내 |
| Indie 플랜 — 인증 대기 중 | 차단. 인증 대기 상태 미노출 — 인증 미완료와 동일한 안내 |
| Organization 플랜 — Organization 없음 | 진입 전 Organization 생성 · 인증 선행 |
| 그 외 | 정상 진입 |

- 차단 시 빈 화면 금지 — 막힌 이유 + 다음 행동(인증하기 / 플랜 보기 / 라이선스 관리 / 문의하기) 제시
- 재구매 차단은 같은 종류끼리만 적용합니다.

**인증은 살 수 있는 플랜을 넓힙니다. 좁히지 않습니다.**

| 보유 상태 | 추가로 살 수 있는 것 |
|---|---|
| Student 인증 보유 | Student + **Individual도 구매 가능** |
| Organization 보유 | Enterprise + **개인 플랜도 구매 가능** |
| Indie 인증 Organization | Indie(최대 5) + **Enterprise도 구매 가능** (초과분은 정가) |

**Organization은 한 사람당 1개만 보유합니다.** 이미 1개가 있으면 추가로 만들 수 없고, 결제 페이지에 Organization을 고르는 단계도 없습니다. Indie ↔ Academic 인증 전환은 지원하지 않습니다.

### Trial

**Trial도 결제 페이지를 거칩니다.** 카드 정보를 받아야 하기 때문입니다.

| 항목 | 처리 |
|---|---|
| 대상 | Individual만. Student·Organization 플랜은 자동 Trial 없음 |
| 진입 | Plan 페이지 Individual 카드 → 결제 페이지 |
| 플랜 선택 | Trial 시작 시 Monthly · Annual 중 하나를 고름 |
| 기간 | 14일 무료 |
| 종료 후 | 고른 플랜으로 자동 결제 시작 |
| 재Trial | 취소 이력이 있으면 불가. 바로 구매만 가능 |

## 3. Individual · Organization 구매 차이

같은 결제 페이지를 쓰지만 노출 항목이 다릅니다.

| 항목 | Individual (개인 플랜) | Organization 플랜 |
|---|---|---|
| SW Account 선택 | 없음 | 있음 — 결제 전 지정 필수 |
| Seat 수 | 1 고정 · UI 없음 | 선택 · 금액에 직접 반영 |
| 지불 방식 | 연간 · 월간 토글 (Individual만) | 고정 — 토글 없음 |
| Order Summary 단가 · Seat 수 행 | 숨김 | 표시 |
| Coupon 입력 | 최초 구매 시 노출 | 미제공 |
| Tax ID | 감면 대상 국가 선택 시 자동 노출 (사업자 확인 링크 없음) | 동일 |
| 선행 조건 | 개인 인증 (Student 플랜만) | Organization 생성 + 조직 인증 |

> **Indie는 예외입니다.** SW Account(Enduser ID)를 1개만 보유하므로 결제 페이지에 SW Account 선택 단계가 없습니다. 최초 구매 때 1개를 만들고, 이후에는 그 계정에 라이선스만 추가합니다. (MDWEB-590)

### 지불 방식

레이블은 "지불 방식"으로 고정합니다. 구 명칭 "결제 주기"는 쓰지 않습니다.

| 플랜 | 연간 | 월간 |
|---|---|---|
| Individual | 가능 (기본 선택) | 가능 |
| Student · Enterprise Single | 없음 | 고정 |
| Enterprise Team · Enterprise Team Linux · Academic · Indie | 고정 | 없음 |

- Plan 페이지에서 주기를 고르지 않고 진입. 결제 페이지 진입 시 연간이 선택된 상태
- 선택지가 없는 플랜은 고정 표시 + 토글 미제공
- 자동 갱신은 상시 적용. 결제 페이지에 on/off 제어 미제공

### Seat 수

용어는 "Seat"으로 고정합니다. 구 용어 "Copy"는 쓰지 않습니다.

| 플랜 | 최대 Seat | 초과 시 |
|---|---|---|
| Enterprise Team · Enterprise Team Linux | 제한 없음 | — |
| Academic Annual | 제한 없음 | — |
| Indie Annual | 5 | Enterprise 플랜 구매 요구 |

- Seat 수 변경 시 소계 · 세금 · 합계 즉시 재계산
- SW Account 배정 시점은 결제 시점. 보유 계정이 없으면 결제 흐름 안에서 생성
- Seat 선택은 결제 페이지에서 프리셋 탭으로 합니다. 스텝퍼·슬라이더는 쓰지 않습니다

| 플랜 | 프리셋 |
|---|---|
| Enterprise Team · Enterprise Team Linux | `[5] [10] [20] [직접 입력]` |
| Academic Annual | `[5] [10] [20] [직접 입력]` |
| Indie Annual | `[1] [3] [5] [직접 입력]` |

프리셋에 없는 수량은 직접 입력으로 지정합니다.
Indie는 직접 입력으로 5 이하만 지정할 수 있습니다.

### Billing Address · 결제수단

청구지 주소의 국가와 우편번호로 세율이 결정됩니다.

| 국가 | 세율 결정 입력 | 확정 시점 |
|---|---|---|
| 미국 | 국가 + 주 + ZIP | ZIP까지 입력 후 |
| 그 외 | 국가 + ZIP | ZIP 입력 후 |

**ZIP은 전 국가 필수입니다.** 없으면 금액이 확정되지 않고 결제 버튼이 비활성입니다. 우편번호 제도가 없는 국가(홍콩·UAE 등)는 입력만 받고 실재 검증은 하지 않습니다.
Address line 1·2는 세금 계산에 쓰지 않습니다. 인보이스 표기용입니다.

### 세액 계산 주체

| 지역 | 계산 주체 |
|---|---|
| 미국 · EU | Avalara |
| 한국 | 10% 고정 |
| 중국 | 상품별 (13% / 6%) |
| 그 외 | CLOver Admin |

Tax ID는 감면 대상 국가를 선택하면 입력 행이 자동으로 나타납니다. 별도의 사업자 확인 링크를 두지 않습니다. 입력 시 세율이 0%가 되고 `Reverse Charge`로 표시됩니다.

### 결제수단

| 조건 | 제공 |
|---|---|
| 중국 — 접속 IP가 중국 또는 청구지 국가가 중국 | 신용카드 / 체크카드 + **AliPay** |
| 그 외 (한국 포함) | 신용카드 / 체크카드 + PayPal |

- **Kakao Pay는 제공하지 않습니다.**
- 기준 국가는 **청구지 주소(Billing Address)의 국가**입니다. Checkout에 별도 국가 드롭다운을 두지 않습니다.

### 청구지 주소 (Billing Address)

| 항목 | 내용 |
|---|---|
| 개인 플랜 | 개인 주소를 사용합니다. My Page에서 관리합니다 |
| Organization 플랜 | **조직 주소**를 사용합니다. Team Console에서 관리합니다 |
| 주소가 없을 때 | 결제 페이지에서 모달로 등록합니다. 저장 후 금액이 다시 계산됩니다 |
| 주소가 있을 때 | 주소를 보여주고 수정 버튼을 제공합니다 |
| 유효성 확인 | 결제 직전에 확인합니다. 미국은 주소 실재 여부, 그 외는 해당 국가에 그 우편번호가 있는지 확인합니다 |

My Page·Team Console에서 주소를 저장할 때는 세율을 조회하지 않습니다. 세율 조회는 결제 페이지에서만 합니다.

## 4. Organization 전용 정책 — Add · Extend · Single → Team

개인 플랜은 Seat 1 고정 + 자동 갱신이라 신규 구매만 해당합니다.

### Add · Extend

| 플랜 | Add (Seat 추가) | Extend (기간 연장) |
|---|---|---|
| Enterprise Team · Enterprise Team Linux · Academic Annual | 가능 | 가능 |
| Indie Annual | 가능 | 불가 |

| 결제 모드 | 금액 |
|---|---|
| Add (Seat 추가만) | 기존 라이선스 `endDate`까지 남은 기간을 일할 계산한 추가 Seat 금액 |
| Extend (기간 연장) | `연장 연수 × Seat 수` |
| Extend · Seat 추가 동시 | `연장 연수 × Seat 수` + 잔여 기간에 대한 추가 Seat 금액(일할 계산) |

- Team Console에서 시작하고 결제 단계만 결제 페이지로 넘어옴
- 대상 라이선스 · 플랜 · 지불 방식은 기존 라이선스에서 승계 — 다시 고르지 않음
- Add로 추가한 Seat의 만료일 = 기존 라이선스 `endDate`. 한 라이선스의 모든 Seat가 같은 날 만료
- 일할 계산은 Annual 라이선스의 Add · Extend에만 적용

### Enterprise Single → Team 전환

**즉시 전환입니다. 예약이 아닙니다.**

| 항목 | 처리 |
|---|---|
| 전환 시점 | 구매 즉시 Annual로 변경 |
| 기간 | 기존 만료일 + 1년 |
| 일할 정산 | 없음 — 즉시 변경이므로 정산 안 함 |
| 환불 | 없음 — 남은 월간 기간은 만료일에 더해짐 |
| Seat 수 | 구매 시점에 선택 |
| SW Account | 기존 계정 승계 — 재생성 · 재초대 불필요 |

- 예: 월간 기간 20일 남은 상태에서 전환 → 20일 + 1년이 새 만료일

## 5. Coupon

**Coupon은 Individual 플랜에만 적용됩니다.** 다른 플랜에는 입력창 자체를 노출하지 않습니다.

| 플랜 | Coupon |
|---|---|
| Individual Annual | 가능 — 최초 구매만 |
| Individual Monthly | 불가 — 연간 결제만 지원 |
| Student Monthly | 불가 |
| Enterprise Single | 불가 |
| Enterprise Team · Enterprise Team Linux · Academic · Indie | 불가 |
| NFR 라이선스 | 불가 — Checkout 미경유 |

| 결제 상황 | Coupon |
|---|---|
| Individual Annual 최초 구매 | 가능 |
| Individual Annual 재구매 · 갱신 | 불가 |
| Add · Extend | 불가 |

- 적용 조건 — Individual 플랜 · 연간 결제 · 최초 구매. 세 가지를 모두 만족해야 입력창 노출
- Discount는 Coupon과 별개. 사용자 입력 없이 프로모션 코드 또는 관리자 지정으로 적용되며 전 플랜에 붙을 수 있음

## 6. 그 외 특이사항

### 금액 계산 순서

`플랜 금액 × Seat 수` 에서 할인을 빼고, 그 결과에 세금을 더합니다. 세금은 할인 적용 **후** 금액을 기준으로 계산합니다.

| 항목 | 적용 대상 | 적용 방식 | 표시 |
|---|---|---|---|
| Coupon | Individual 플랜 최초 구매만 (§5) | 사용자가 코드 입력 | `Coupon` 항목 `-$n` |
| Discount | 전 플랜 · 연간 · 월간 모두 | 프로모션 코드 또는 관리자 지정 | `Discount` 항목 `-$n` |

### 세금 — VAT ID · ZIP

| 지역 | 세율 결정 입력 | 미입력 시 |
|---|---|---|
| 미국 | 국가 + 주 + ZIP | 합계 미확정 · 결제 진행 불가 |
| 그 외 전 국가 | 국가 + ZIP | 합계 미확정 · 결제 진행 불가 |

**ZIP은 전 국가 필수입니다.** 미국만이 아닙니다. EU도 카나리아 제도·마데이라·올란드처럼 우편번호로 갈리는 특별 세율 지역이 있습니다.
우편번호 제도가 없는 국가(홍콩·UAE 등)는 입력만 받고 실재 확인은 하지 않습니다.

Tax ID는 감면 대상 국가를 고르면 입력란이 자동으로 나타납니다. 개인·Organization 구분 없이 동일합니다. 입력하면 세율이 0%가 되고 `Reverse Charge`로 표시됩니다.

### 무료 기간이 있는 플랜

| 플랜 | 결제 페이지 처리 |
|---|---|
| Student Monthly | 결제 금액 $0 표시. "Trial" 라벨 미노출 |
| Individual (14일 Trial) | 결제 페이지 경유. 결제 금액 $0 표시. 14일 후 진입 시 고른 플랜(Monthly $39 / Annual $280)으로 자동 결제 |

- 금액이 $0이어도 결제 페이지를 거침 — 결제 수단을 등록받아야 무료 기간 종료 후 자동 전환

## Appendix — 결제 페이지 표시 용어

결제 페이지에 노출되는 용어 중 이번 개편으로 바뀐 것입니다.

| 구 용어 | 신 용어 | 바뀐 이유 |
|---|---|---|
| 결제 주기 | 지불 방식 | 결제 반복 주기가 아니라 사용자가 고르는 지불 방식임을 드러내기 위해 레이블 변경 |
| Copy | Seat | 좌석 단위 용어를 전 플랜에서 통일. Seat는 계정 개수가 아니라 동시접속 허용 수 |
| Enterprise Monthly | Enterprise Single | 월간 여부보다 동시접속 1이라는 성격이 핵심이라 명칭 변경 |
| Enterprise Annual | Enterprise Team | 연간 여부보다 N Seat 팀 단위 사용이 핵심이라 명칭 변경 |
| Network Online Linux | Enterprise Team Linux | Enterprise Team과 같은 사용자 구조이며 Linux OS 전용이라는 제약만 다름 |
| Student Trial | Student Benefit | 학생 인증 완료 후 제공되는 무료 혜택이며 Trial과 성격이 달라 "Trial" 라벨 노출 금지 |
| Auto Renew 설정 | (폐지) | 켜고 끄는 옵션이 아닙니다. 구독은 자동 갱신이 기본이며, 멈추려면 해지합니다 |
| Kakao Pay | (미제공) | 한국도 카드 + PayPal입니다 |
