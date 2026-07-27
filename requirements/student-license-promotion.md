# [MD|SITE] Student License & Promotion — 정책 및 시스템 변경

Epic Key: `(미정)` | 요청: CX팀 (Dahye Jang) | 출처: Slack #CEV7QB151 · Internal Decision Doc | 작성일: 2026-04-27 | 업데이트: 2026-05-18

## 배경

기존 Student 플랜은 연간 $99 일회성 구매(Prepaid), 최대 2회(2년) 구조였으나, 3개월 무료 Student Benefit 후 월 $8.25 자동결제 구독 모델로 전환한다. 라이선스 기간은 최대 4년으로 확장되며, 기존 시스템의 Pause/Suspended 상태값은 Individual 플랜과 동일 로직으로 처리한다.

> 영향 정책: `docs/policy/plan.md` · `docs/policy/member.md` — Confluence 정리 예정

---

## 확정 사항

| 항목 | 내용 |
|---|---|
| 프로모션 구조 | 3개월 무료 Student Benefit → 월 $8.25 자동결제 전환 ("Trial" 라벨 사용 금지) |
| 무료 기간 시작 기준 | 학생 인증 승인 시점 |
| 라이선스 기간 | 첫 구독일 기준 4년 윈도우 (구매 횟수 제한 폐지) |
| 4년 카운터 | Pause · Suspended · Cancelled 중에도 계속 흐름 (멈추지 않음) |
| Pause / Suspended | Individual 플랜과 동일 로직 적용 |
| Suspended 처리 | 결제 실패 → 1주일 유예 → 알림 3회 → 미해결 시 취소 |
| Legacy users 기준 | 첫 번째 결제일 기준 4년 카운트 |
| Legacy users (활성) | 쿠폰 자동 발급 + 이메일 발송 |
| Legacy users (만료, 4년 이내) | 무료 혜택 + Monthly 구독 제공 |
| Legacy users 환불 | 불가 |
| Checkout 결제 정보 | 무료 기간에도 결제 정보 등록 필수 ($0 결제 → 3개월 후 $8.25/월) |
| Annual 옵션 | 제거 (Student 플랜은 Monthly only) |
| Phase 2 | 지역별 가격 정책 별도 진행 |

---

## 확정된 미결 사항 (2026-05-18 합의)

| 항목 | 결정 내용 |
|---|---|
| C1: Pause 중 과금 | Individual 플랜과 동일 처리 (별도 정책 없음) |
| C2: Pause 중 4년 카운트 | 계속 흐름 — Pause 중에도 4년 윈도우 차감 |
| C3: Pause 허용 횟수·기간 | Individual 플랜과 동일 한도 적용 |
| C4: Resume 후 billing cycle | Individual 플랜과 동일 로직 적용 |
| B1: Grace period | Suspended 로직 적용 — 결제 실패 → 1주일 유예 → 알림 3회 → 취소 |

---

## 미결 사항 (논의 필요)

**Student Benefit 무료 기간**
- A2: Student Benefit 중 자발적 취소 시 즉시 종료 vs 기간 소진 — (논의 필요) 사용자 기대값과 어뷰징 방지 방향 결정 선행
- A3: Student Benefit 중 Pause 허용 여부 — (논의 필요) 4년 카운트 포함 여부와 연동
- A5: 해지 후 재가입 시 무료 혜택 재수령 가능 여부 — (논의 필요) 어뷰징 방지 정책과 직결
- A6: Student Benefit 중 인증 Rejected 전환 시 처리 — (논의 필요) 즉시 Lock vs 잔여 기간 소진

**결제 실패**
- B3: 블랙리스트 기준 결제 실패 횟수 임계값 — (논의 필요) ToS 업데이트와 병행

**Legacy Users**
- D1: 기존 연간 라이선스 만료 후 자동 새 구독 합류 vs 별도 액션 필요 여부 — (논의 필요)
- D2: 1회 구매자 만료 후 무료 혜택 재수령 가능 여부 — (논의 필요) A5와 동일 기준 적용 여부

**인증**
- F1: 구독 중 졸업 시 재검증 절차 도입 여부 — (논의 필요) 4년 구독 기간 중 학생 신분 변경 케이스 처리

---

## Dev 협의 사항

개발 착수 전 공수 확인 및 구현 방향 협의가 필요한 항목.

| # | 항목 | 협의 내용 |
|---|---|---|
| D-1 | Individual Pause/Suspended 로직 확장 | Student 플랜에 동일 로직 적용 시 기존 Individual 구현 재사용 가능 여부 + 공수 |
| D-2 | 4년 윈도우 기준 필드 | `verification_approved_at` vs `first_subscription_date` — 어느 타임스탬프 기준으로 카운트할지 결정 필요 |
| D-3 | Legacy 쿠폰 발급 스케줄러 | 신규 배치 스케줄러 구현 필요 여부 vs 기존 쿠폰 시스템 활용 가능 여부 |
| D-4 | Billing $0 → $8.25 자동전환 로직 | Stripe 등 외부 결제 모듈에서 무료 기간 후 자동 과금 전환 구현 복잡도 |
| D-5 | Checkout UI 변경 범위 | 기존 Individual Checkout 컴포넌트 공유 가능 여부 — Student 전용 UI 추가 범위 확인 |

---

## 우려 사항

| # | 항목 | 내용 |
|---|---|---|
| R-1 | Suspended 중 4년 카운터 처리 | Individual과 동일 처리이지만, Student Benefit 무료 기간 중 Suspended 전환 케이스는 별도 예외 검토 필요 |
| R-2 | Legacy 쿠폰 발급 타이밍 | 발급 시점 미확정 상태에서 출시 당일 일괄 발송 시 CS 폭주 리스크 — 분산 발송 또는 사전 안내 고려 필요 |
| R-3 | 무료 기간 결제 정보 수집 → 전환율 | Student Benefit 시작 시 결제 정보 등록 강제는 전환율 저하 우려 — UX 검토 및 안내 문구 전략 필요 |
| R-4 | 인증 + Checkout 통합 플로우 복잡도 | 학생 인증 완료 → 결제 정보 입력 → 무료 기간 시작 플로우를 Phase 1 범위에 포함할지 재검토 필요 |
| R-5 | Blacklist 기준 미확정 시 ToS 업데이트 | 블랙리스트 임계값(B3)이 확정되지 않은 상태에서 ToS 업데이트 시점 및 범위 조율 필요 |

---

## Part A. 핵심 정책 변경

### S1 — 자동 갱신(Auto-Renewal) 과금 로직
*현황: 연간 $99 일회성 Prepaid 구조. 자동결제 로직 없음.*

- [ ] Student Benefit(3개월) 종료 시 월 $8.25 자동결제 전환 로직 정의
- [ ] Student Benefit 시작 시 결제 정보 수집 Checkout 단계 추가 ($0 결제)
- [ ] 자동 결제 전환 D-7, D-1 사전 안내 이메일 발송 트리거 추가
- [ ] 월 결제 성공 시 `licenseStatus` → `Active`, 영수증 이메일 발송

---

### S2 — 라이선스 기간 정책 재정의
*현황: 최대 2회(2년) 구매 제한. 횟수 기준 관리.*

- [ ] 라이선스 기간 추적 기준을 횟수 → 구독 활성 누적 기간으로 변경
- [ ] 최대 4년 도달 시 신규 결제 차단 및 안내 처리
- [ ] Legacy users: 첫 번째 결제일 기준 4년 카운트 적용
- [ ] Legacy users 환불 불가 정책 시스템 반영 및 안내 문구 추가
- [ ] `plan.md` Student Annual 정책 항목 업데이트

---

### S3 — 취소 및 환불 정책
*현황: Prepaid 구조로 별도 취소 플로우 없음.*

- [ ] Student Benefit 중 취소 정책 처리 방식 확정 후 구현 (A2 결정 의존)
- [ ] 월정액 구독 중도 해지 시 처리 방식 확정 후 구현
- [ ] `cancel scheduled` 상태 동작: 다음 결제일까지 `Active` 유지 → 이후 `none` 전환
- [ ] 취소·환불 관련 사용자 안내 문구 및 이메일 템플릿 작성

---

### S4 — 인증 및 구매 플로우 개편
*현황: 학생 인증 완료 → 마이페이지에서 연간 $99 Prepaid 구매. 결제 정보 수집 단계 없음.*

- [ ] 인증 완료 후 플로우: 결제 정보 입력 → Student Benefit 시작 ($0 결제, 3개월 무료)
- [ ] 기존 '구입하러 가기(연간 구매)' 플로우 제거 및 Student Benefit 플로우로 교체
- [ ] Student Benefit 중 인증 Rejected 전환 시 처리 방식 구현 (A6 결정 의존)
- [ ] F1 졸업 후 재검증 플로우 설계 (F1 결정 의존)

---

## Part B. Pause / Resume 정책 재정의

### S5 — Pause / Resume 월정액 모델 적용
*현황: `licenseStatus`에 `paused` / `pause scheduled` 존재. 기존 Prepaid 기준 설계로 월정액 전환 후 의미 불명확. **2026-05-18 합의: Individual 플랜과 동일 로직 전체 적용. 4년 카운터는 Pause 중에도 계속 흐름.***

- [ ] Individual Pause/Suspended 로직을 Student 플랜에 확장 적용 (D-1 공수 확인 필요)
- [ ] A3 결정 후: Student Benefit 무료 기간 중 Pause 허용 여부 시스템 반영
- [ ] `pause scheduled` 상태: 다음 결제일 기준 `paused` 전환 로직 — Individual과 동일 확인
- [ ] `paused` → `Active` 전환 시 결제 트리거 타이밍 — Individual과 동일 확인

---

## Part C. 어뷰징 방지

### S6 — 결제 실패 대응 및 라이선스 Lock
*현황: Prepaid 구조로 결제 실패 시나리오 없음. 월정액 전환 후 의도적 결제 실패 어뷰징 방지 필요.*

- [ ] 결제 실패 즉시 `licenseStatus` → `suspended` 처리
- [ ] 결제 실패 안내 이메일 발송 및 재결제 유도 링크 포함
- [ ] Grace period 도입 여부 및 기간 결정 후 반영 (B1 결정 의존)
- [ ] 반복 실패 계정 블랙리스트 임계값 결정 및 처리 로직 추가 (B3 결정 의존)
- [ ] ToS 결제 실패 관련 항목 업데이트

---

### S7 — 프로모션 악용 방지
*현황: 기존 인증 심사는 수동. Student Benefit 무료 기간 반복 수령 및 가짜 서류 어뷰징 경로 대응 필요.*

- [ ] 동일 결제 정보 / 이메일 / 기기 기준 Student Benefit 중복 수령 차단 로직 추가
- [ ] 해지 후 재가입 시 무료 혜택 재수령 허용 여부 결정 및 시스템 반영 (A5 결정 의존)
- [ ] 가짜·중복 서류 탐지 모니터링 강화 방안 검토 (TBD)

---

## Action Items

| 담당 | 항목 | 비고 |
|---|---|---|
| PM | CX에 미결 사항(A2, A3, A5, A6, D1, D2, F1) 답변 취합 | 문의 완료, 회신 대기 중 |
| PM | Legacy 쿠폰 발급 타이밍·유효 기간 CX 확인 | R-2 리스크 관련 |
| Dev | 공수 체크 — Billing $0→$8.25 자동전환(D-4), 4년 윈도우(D-2), Legacy 쿠폰(D-3), Individual 로직 확장(D-1) | 리뉴얼 일정 + 공수 합산 후 적용 시점 결정 |
| UX | Checkout 결제 정보 수집 플로우 검토 (R-3 전환율 우려) | Phase 1 포함 여부 재검토 (R-4) |
| 전체 | 적용 시점 — dev 공수 + 리뉴얼 일정 + CX 회신 취합 후 결정 | 현재 미정 |
