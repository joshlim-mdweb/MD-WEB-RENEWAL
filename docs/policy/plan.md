# POLICY_PLAN

Source: https://clo.atlassian.net/wiki/spaces/MDT/pages/3120529409/POLICY_PLAN

---

## 1. 라이선스 유형

| 유형 | 설명 | 사용 기준 |
| --- | --- | --- |
| Network Online | 네트워크 기반 라이선스 | License ID 기준 사용 |
| Network Offline | 오프라인 전용 네트워크 라이선스 | 고객 서버 구축, 별도 계약 |
| Subscription | 기간제 구독 라이선스 | 월간 자동결제 |
| Prepaid | 일시 결제형 라이선스 | 연간 단일 결제 |

---

## 2. 플랜별 상세

### 2-1. 기업용 (Enterprise / Academic / Indie)

| 플랜명 | 라이선스 유형 | 가격 | 기간 | Concurrent User | 비고 |
| --- | --- | --- | --- | --- | --- |
| Enterprise Single | Network Online | $199 | 월간 | Max 1 | 동시접속 불가, 자동결제 (구 Enterprise Monthly) |
| Enterprise Team | Network Online | $2,000 | 연간 | 구매된 N Copy | Prepaid (구 Enterprise Annual) |
| Enterprise Offline | Network Offline | Variable | 별도 계약 | 구매된 N Copy | BD 계약 |
| Academic Annual | Network Online | $1,500/Copy | 연간 | 구매된 N Copy | Academic 인증 필요 |
| Indie Annual | Network Online | $800 | 연간 | Max 5 Copy | Indie 인증 필요, Enterprise 내 특가 |

### 2-2. 개인용 (Individual / Student)

| 플랜명 | 라이선스 유형 | 가격 | 기간 | 사용 기준 | 비고 |
| --- | --- | --- | --- | --- | --- |
| Individual Monthly | Subscription | $39 | 월간 | 1명 | 자동결제 |
| Individual Annual | Prepaid | $280 | 연간 | 1명 | Auto Renew 설정 가능 (신규) |
| Student Monthly | Subscription | $8.25 | 월간 | 1명 | 학생 인증 필수, 4년 이내, 3개월 무료 Student Benefit |

---

## 3. 플랜별 정책

### Trial 정책
- **개인 (Individual)**: 14일 무료 Trial → 종료 후 자동으로 Subscription 시작
- **Trial 취소**: Trial 기간 중 취소 가능. 취소 후 **재Trial 불가** (동일 계정으로 Trial 재시작 불허)
- **기업 (Enterprise / Academic / Indie)**: Trial 제공 여부는 문의를 통해 결정 (자동 Trial 없음)

### Individual Annual Auto Renew 정책 (신규)
- Individual Annual 구매 시 Auto Renew 설정 가능
- Auto Renew 활성: 만료일 전 자동 갱신 결제 진행
- Auto Renew 취소: 잔여 기간 종료 후 갱신 없음. 기간 내 사용 유지
- Auto Renew ON/OFF 상태는 MyPage License/Billing 탭에서 관리

### 개인용 공통
- Individual / Student 플랜은 단일 사용자 전용
- License ID 공유 불허
- 동시접속 미지원

### Student
- 학생 인증 완료 후 3개월 Student Benefit(무료) 제공 — "Trial" 라벨 노출 금지
- 무료 기간 시작: 학생 인증 승인 시점
- 무료 기간 종료 후 $8.25/월 자동결제 시작 (Subscription)
- 이용 기간: 첫 구독일 기준 4년(48개월) 이내
- 4년 카운터: Pause · Suspended · Cancelled 중에도 계속 흐름 (멈추지 않음)
- 4년 초과 시 Student 플랜 이용 불가
- Annual 옵션 없음 (Monthly only)
- Pause / Suspended 처리: Individual 플랜과 동일 로직 적용
- Suspended: 결제 실패 → 1주일 유예 → 알림 3회 → 미해결 시 취소

### Student 취소 및 환불
- Student Benefit 중 취소 후 재구독: 유료로 시작, 4년 기간 유지 (취소 처리 방식은 미결 — A2 결정 의존)
- 첫 결제 이후 환불: 불가
- Legacy users 환불 요청: 불가

### Student Legacy Users (구 Annual Prepaid 사용자)
- 기존 Annual 구독자(활성): 쿠폰 자동 발급 + 이메일 발송
- 기존 Annual 구독자(만료, 첫 구매일 기준 4년 이내): 무료 혜택 + Monthly 구독 제공
- Legacy 4년 카운트 기준: 첫 번째 결제일 기준

### Academic
1. Academic 인증 완료된 CompanyID만 구매 가능
2. 교육기관 소속 사용자만 신청 가능
3. 인증 방법: 교육기관 공식 도메인 심사 등록 → 인증 메일 → 도메인/서류 확인 후 Confirm
4. 인증 서류: 정규 교육기관임을 증명하는 문서 사본 또는 PDF

### Indie
1. Indie 인증 완료된 CompanyID만 구매 가능
2. 연 매출 $500,000 USD 이하 사업자만 신청 가능
3. 인증 절차: 매출 증빙 + 사업자 등록 증빙 제출 → 접수
4. Annual 플랜만 제공
5. 구매 이후 사용/License ID 운영/동시접속 기준은 Enterprise Network Online Annual과 동일

### Indie 운영 정책 (1차 배포 확정, ref: MDWEB-590)
- **추가 결제**: 지정된 Enduser에 Add만 가능. Extend 불가
- **인증 만료일**: `licenseEndDate` 기준
- **자동 Reject 없음**: 신청 후 일정 기간 경과 시 자동 거절 없음 (수동 처리)
- **신청 상태 클라이언트 미노출**: Pending / In Review 등 상태값 UI 미노출
- **최대 구매 수량**: Indie 인증 CompanyID 기준 최대 5개. 초과 시 Enterprise 라이선스로만 구매 가능

---

## 4. Checkout UI 정책 (확정, 2026-05-11)

### 4-1. 지불 방식 (Billing Toggle)

- 레이블: **"지불 방식"** — "결제 주기" 사용 금지
- 배치: **연간(Annual) 항상 왼쪽**, 월간(Monthly) 오른쪽
- Default 선택: **연간(Annual)** — 모든 Checkout 화면 공통
- 예외: "Monthly 선택" 시나리오를 명시적으로 보여주는 WF 프레임에서만 Monthly selected 허용

### 4-2. 구매 유형 (Purchase Type)

- **License ID 선택 완료 전 미노출** — Card 1에서 License ID 드롭다운 선택이 완료된 이후에만 구매 유형 행(Extend / Reserve) 표시
- 이유: 구매 유형(Extend/Reserve)은 선택된 License ID의 상태에 종속

### 4-3. Seat 수 용어 및 UI

- 용어: **"Seat"** — Academic/Indie 포함 전 플랜에서 "Copy" 사용 금지
- Academic Seat 선택 UI: 프리셋 탭 **[1][5][10][직접 입력]** (스텝퍼 사용 금지)
- Indie Seat 선택 UI: 프리셋 탭 **[1][5]** + 안내 문구 "최대 5개까지 선택 가능합니다"
- Indie 최대 5개 제한은 정책(4-1. Indie 운영 정책)과 동일

### 4-4. 세금 (Tax)

- 부과 조건: 특정 국가/지역(미국 일부 주, EU VAT 등) 결제 시 자동 계산
- Order Summary 표시: `세금` 항목 소계 아래 별도 행으로 표시
- 세금 계산 미확정 국가: 항목 미노출

### 4-5. Discount

- 발생 조건: 특정 프로모션 코드 또는 관리자 지정 할인 적용 시
- Order Summary 표시: `Discount` 항목으로 `-$n` 음수 표시
- Annual / Monthly 모두 적용 가능

### 4-6. Coupon (Annual 전용)

- 적용 대상: Annual Checkout에서만 쿠폰 입력 가능
- UI: Order Summary 위에 쿠폰 입력 필드 (입력 후 Apply 버튼)
- 유효 쿠폰: Order Summary에 `Coupon` 항목 `-$n` 표시
- 유효하지 않은 쿠폰: 인풋 하단 에러 메시지 표시
- Tax와 중복 적용 가능 (Tax는 Coupon 적용 후 금액 기준으로 계산)

### 4-7. 결제 수단 지역 분기

- 기본: 신용카드/체크카드 + PayPal
- 중국(China): 신용카드/체크카드 + AliPay (PayPal 대체)
- 국가 드롭다운 선택 시 결제 수단 실시간 업데이트
