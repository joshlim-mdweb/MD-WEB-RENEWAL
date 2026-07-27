# [MD|SITE] Plan Page Renewal — 플랜 카드 및 섹션 구조 재정의

Epic Key: `(미정)` | 요청: Josh Lim | 출처: Slack Canvas F0BCBS8G88N · PACKET-pm.md · 1차 웨이브 | 작성일: 2026-07-10

---

## 배경

Marvelous Designer 웹사이트의 Plan 페이지를 전면 개편한다. 주요 변경 배경은 세 가지다.

첫째, 계정 구조가 MemberType 다중 분류에서 Member / Group Owner / SW Account 3종으로 단순화됐다. 플랜 카드의 버튼 로직이 구 MemberType 기반으로 정의되어 있어 전면 재정의가 필요하다.

둘째, 플랜 명칭 및 구조가 변경됐다. Enterprise Monthly → Enterprise Single, Enterprise Annual → Enterprise Team으로 명칭이 바뀌고, Indie가 별도 플랜 카드에서 배너로 전환된다.

셋째, Individual Annual이 Prepaid에서 Subscription으로 전환되고, Student 플랜에 3개월 무료 Benefit이 도입된다. Linux 전용 Enterprise 플랜이 신규 등재된다.

---

## 1. 개요

### 1.1 페이지 목적

Plan 페이지는 사용자가 자신의 상황에 맞는 플랜을 선택하고 구매 플로우로 진입하는 전환 페이지다. 가격 비교, 버튼 CTA, 인증 진입 등 구매 결정의 마지막 관문 역할을 한다.

### 1.2 섹션 구성 (3개)

| # | 섹션명 | 포함 카드 |
|---|---|---|
| ① | Individual Plans | Individual (Monthly/Annual 토글), Individual Student |
| ② | Organization | Enterprise Single, Enterprise Team, Academics, Indie 배너 |
| ③ | Linux Environment | Enterprise Linux |

---

## 2. 섹션별 IA

### 2.1 Individual Plans 섹션

- **배치**: 페이지 최상단 섹션
- **Billing Toggle**: 섹션 헤더 내 또는 섹션 상단에 위치. Toggle은 Individual 카드에만 적용 (Student 카드는 Monthly only, Toggle 미적용)
- **카드 배치**: 가로 2열. 왼쪽 Individual, 오른쪽 Individual Student

### 2.2 Organization 섹션

- **배치**: Individual Plans 섹션 하단
- **카드 배치**: 가로 3열. Enterprise Single | Enterprise Team | Academics
- **Indie 배너**: 카드 행 하단에 가로 전폭 배너로 배치
- **토글**: 없음. Enterprise Single(Monthly)과 Enterprise Team(Annual)은 별개 카드로 나란히 표시

### 2.3 Linux Environment 섹션

- **배치**: Organization 섹션 하단, 페이지 하단 섹션
- **카드 배치**: 단일 카드 (세로로 심플하게 표시하거나, 가로 배치 후 나머지 공간 설명 텍스트)
- **안내 문구**: Organization(Group Owner) 전용임을 명시

---

## 3. 플랜 카드 스펙

### 3.1 CARD: Individual

Billing Toggle에 따라 Monthly / Annual 두 상태로 전환된다.

| 항목 | Monthly | Annual |
|---|---|---|
| 플랜명 | Individual | Individual |
| 가격 | $39 / month | $280 / year |
| 라이선스 유형 | Subscription | Subscription (신규 — 구 Prepaid에서 전환) |
| 과금 방식 | 자동결제 | 일시 결제 + Auto Renew 옵션 |
| 사용 기준 | 단일 사용자 | 단일 사용자 |
| License ID 공유 | 불허 | 불허 |
| 동시접속 | 미지원 | 미지원 |

**Feature list (카드 표시 항목)**

- 14일 무료 Trial 제공
- Trial 종료 후 자동 Subscription 시작
- Annual: Auto Renew 설정 가능
- 단일 사용자 전용

**Trial 정책 안내 문구**
- "14-day free trial, then [price] billed [monthly/annually]"
- Trial 취소 시 재Trial 불가 — 카드 하단 또는 버튼 인근에 소형 안내 필요

### 3.2 CARD: Individual Student

| 항목 | 값 |
|---|---|
| 플랜명 | Individual Student |
| 가격 | $8.25 / month |
| 라이선스 유형 | Subscription |
| 과금 방식 | 3개월 무료 Student Benefit → 이후 자동결제 $8.25/월 |
| 이용 기간 제한 | 최초 구독일 기준 4년(48개월) 이내 |
| Billing Toggle 적용 | 없음 (Monthly only) |

**Feature list (카드 표시 항목)**

- Student 인증 필요 (학교 이메일 또는 재학 증명)
- 3개월 무료 Student Benefit (Trial 라벨 사용 금지)
- 인증 후 혜택 시작 → 이후 $8.25/월 자동결제
- 4년 이용 기간 제한 (Pause · Suspended · Cancelled 기간 포함)
- Annual 옵션 없음

**중요 고지**: 4년 이용 제한을 카드 내 또는 카드 인근에 눈에 띄게 표시한다. (CS 리스크 1순위)

### 3.3 CARD: Enterprise Single

| 항목 | 값 |
|---|---|
| 플랜명 | Enterprise Single |
| 가격 | $199 / month |
| 라이선스 유형 | Network Online |
| 과금 방식 | 자동결제 (월간) |
| 동시접속 | Max 1 (동시접속 불가) |
| 구 명칭 | Enterprise Monthly |

**Feature list (카드 표시 항목)**

- Network Online 라이선스
- 1인 동시사용
- Organization (Group Owner) 전용
- Trial: 자동 Trial 없음, 문의를 통해 결정

### 3.4 CARD: Enterprise Team

| 항목 | 값 |
|---|---|
| 플랜명 | Enterprise Team |
| 가격 | $2,000 / year |
| 라이선스 유형 | Network Online |
| 과금 방식 | Prepaid (연간 일시 결제) |
| 동시접속 | 구매된 Seat 수 기준 |
| 구 명칭 | Enterprise Annual |

**Feature list (카드 표시 항목)**

- Network Online 라이선스
- Seat 수만큼 동시사용
- Organization (Group Owner) 전용
- Trial: 자동 Trial 없음, 문의를 통해 결정

### 3.5 CARD: Academics

| 항목 | 값 |
|---|---|
| 플랜명 | Academics |
| 가격 | $1,500 / Seat / year |
| 라이선스 유형 | Network Online |
| 과금 방식 | Prepaid (연간) |
| 동시접속 | 구매된 Seat 수 기준 |
| Seat 용어 | "Copy" 사용 금지. "Seat"으로 표시 |

**Feature list (카드 표시 항목)**

- Academic 인증 필요 (교육기관 소속 확인)
- Seat 단위 구매 (프리셋: 1 / 5 / 10 / 직접 입력)
- Network Online 라이선스
- Organization (Group Owner) 전용

### 3.6 CARD: Enterprise Linux (신규 정의)

| 항목 | 값 |
|---|---|
| 플랜명 | Enterprise Linux |
| 가격 | $2,300 / year |
| 라이선스 유형 | Network Online |
| 과금 방식 | Annual only (Monthly 없음) |
| 동시접속 | 구매된 Seat 수 기준 (상한 없음) |
| 대상 | Organization (Group Owner) 전용 |
| Billing Toggle | 적용 안 함 (Annual only) |

**Feature list (카드 표시 항목)**

- Linux 환경 전용
- Annual only (월간 없음)
- Organization (Group Owner) 전용
- Network Online 라이선스
- 구매한 Seat 수만큼 동시사용 (상한 없음)

---

## 4. 버튼 로직 테이블 (신 계정 구조 기준)

> 신 계정 구조: Member (인증 없음) / Member (Student 인증 완료) / Group Owner (인증 없음) / Group Owner (Academic 인증 완료) / Group Owner (Indie 인증 완료) / SW Account (웹 로그인 불가) / 비로그인

> SW Account는 웹 로그인 자체가 불가하므로 플랜 카드에 도달할 수 없다. 각 카드에서 행 제거.

### 4.1 CARD: Individual

| 계정 상태 | Has License | Button State | Button Text |
|---|---|---|---|
| 비로그인 | - | 활성화 | Start Now |
| Member (인증 없음) | 없음 | 활성화 | Start Now |
| Member (인증 없음) — Trial 사용 이력 있음 | 없음 | 활성화 | Start Now |
| Member (Student 인증 완료) — Benefit Active | 없음 | 비활성화 | For Student |
| Member (Student 인증 완료) — Benefit Active | 있음 | 비활성화 | For Student |
| Member (Student 인증 완료) — Benefit 만료 | - | 비활성화 | For Student |
| Member (Student 인증 대기 중) | - | 비활성화 | For Student |
| Group Owner (인증 없음) | - | 비활성화 | For Individual |
| Group Owner (Academic 인증 완료) | - | 비활성화 | For Individual |
| Group Owner (Indie 인증 완료) | - | 비활성화 | For Individual |

> Trial 사용 이력이 있어도 Individual 카드 버튼은 "Start Now" 유지. Trial 재시작이 아닌 유료 Subscription 진입으로 안내. (Checkout 단계에서 Trial 미노출 처리)

### 4.2 CARD: Individual Student

| 계정 상태 | Verification Status | Has License | Button State | Button Text |
|---|---|---|---|---|
| 비로그인 | 인증 없음 | - | 활성화 | Get Verified |
| Member (인증 없음) | 인증 없음 | 없음 | 활성화 | Get Verified |
| Member (인증 없음) | 인증 대기 중 | 없음 | 비활성화 | Verification in process |
| Member (Student 인증 완료) | 인증 완료 | 없음 | 활성화 | Start Now |
| Member (Student 인증 완료) | 인증 완료 | 있음 — Benefit Active | 활성화 | Check my Status |
| Member (Student 인증 완료) | 인증 완료 | 있음 — Benefit 종료, 구독 중 | 활성화 | Check my Status |
| Member (Student 인증 완료) | 재인증 필요 | - | 활성화 | Get Verified |
| Group Owner (인증 없음) | - | - | 비활성화 | For Student |
| Group Owner (Academic 인증 완료) | - | - | 비활성화 | For Student |
| Group Owner (Indie 인증 완료) | - | - | 비활성화 | For Student |

> "Benefit Active" 상태는 Student Benefit(3개월 무료) 진행 중인 상태. 이 상태에서 Student 카드의 License가 이미 있으므로 "Check my Status"를 표시한다.
> Student 플랜 이용 기간: 최초 Student 인증 시점부터 4년(48개월). Pause·Cancelled 기간 포함. 4년이 지나면 플랜 만료이나, 별도 버튼 차단 처리 없음 — 만료 후 재구독 시 플랜 갱신 여부는 Checkout 단계에서 처리.

### 4.3 CARD: Enterprise Single

| 계정 상태 | Has License | Button State | Button Text |
|---|---|---|---|
| 비로그인 | - | 활성화 | Start Now |
| Member (인증 없음) | - | 비활성화 | For Enterprise |
| Member (Student 인증 완료) | - | 비활성화 | For Enterprise |
| Group Owner (인증 없음) | 없음 | 활성화 | Start Now |
| Group Owner (인증 없음) | 있음 | 활성화 | Start Now |
| Group Owner (Academic 인증 완료) | 없음 | 활성화 | Start Now |
| Group Owner (Academic 인증 완료) | 있음 | 활성화 | Start Now |
| Group Owner (Indie 인증 완료) | 없음 | 활성화 | Start Now |
| Group Owner (Indie 인증 완료) | 있음 | 활성화 | Start Now |

> SW Account는 웹 로그인 불가 → 행 없음.
> Group Owner가 라이선스를 보유한 상태에서도 "Start Now" 활성화 — 추가 구매 허용. 어뷰징 케이스는 백엔드에서 수동으로 감지·처리한다.

### 4.4 CARD: Enterprise Team

Enterprise Single과 동일한 버튼 로직을 적용한다.

| 계정 상태 | Has License | Button State | Button Text |
|---|---|---|---|
| 비로그인 | - | 활성화 | Start Now |
| Member (인증 없음) | - | 비활성화 | For Enterprise |
| Member (Student 인증 완료) | - | 비활성화 | For Enterprise |
| Group Owner (인증 없음) | 없음 | 활성화 | Start Now |
| Group Owner (인증 없음) | 있음 | 활성화 | Start Now |
| Group Owner (Academic 인증 완료) | - | 활성화 | Start Now |
| Group Owner (Indie 인증 완료) | - | 활성화 | Start Now |

> Group Owner + Has License 있음도 Start Now 활성화. 추가 구매 허용, 어뷰징은 백엔드 수동 처리.

### 4.5 CARD: Academics

| 계정 상태 | Verification Status | Has License | Button State | Button Text |
|---|---|---|---|---|
| 비로그인 | - | - | 활성화 | Get Verified |
| Member (인증 없음) | - | - | 비활성화 | For Enterprise |
| Member (Student 인증 완료) | - | - | 비활성화 | For Enterprise |
| Group Owner (인증 없음) | 인증 없음 | 없음 | 활성화 | Get Verified |
| Group Owner (인증 없음) | 인증 대기 중 | 없음 | 비활성화 | Verification in process |
| Group Owner (Academic 인증 완료) | 인증 완료 | 없음 | 활성화 | Start Now |
| Group Owner (Academic 인증 완료) | 인증 완료 | 있음 | 활성화 | Start Now |
| Group Owner (Indie 인증 완료) | - | - | 비활성화 | For Academic |

> "Verification in process" 상태의 버튼은 비활성화. 카드 내 인라인 안내 문구 표시: "Verification in process" (progress 상태 시각화).

### 4.6 CARD: Enterprise Linux (신규)

Enterprise Single/Team과 동일한 로직을 기본으로 한다. Group Owner 전용.

| 계정 상태 | Has License | Button State | Button Text |
|---|---|---|---|
| 비로그인 | - | 활성화 | Start Now |
| Member (인증 없음) | - | 비활성화 | For Enterprise |
| Member (Student 인증 완료) | - | 비활성화 | For Enterprise |
| Group Owner (인증 없음) | 없음 | 활성화 | Start Now |
| Group Owner (인증 없음) | 있음 | 활성화 | Start Now |
| Group Owner (Academic 인증 완료) | - | 활성화 | Start Now |
| Group Owner (Indie 인증 완료) | - | 활성화 | Start Now |

---

## 5. Billing Toggle 정책

### 5.1 적용 범위

- **적용 섹션**: Individual Plans 섹션 내 Individual 카드에만 적용
- **미적용**: Individual Student 카드 (Monthly only), Organization 섹션 전체, Linux 섹션

### 5.2 Toggle 위치

- Individual Plans 섹션 헤더 내 또는 카드 상단 독립 행에 배치
- 페이지 상단 전체 토글 방식이 아닌 섹션 내 토글 방식으로 확정
- Student 카드는 Toggle 영향을 받지 않으며, Monthly 가격 고정 표시

### 5.3 Default 및 레이블

- **Default**: Annual 선택 (항상 왼쪽 배치, plan.md §4-1 기준)
- **레이블**: "지불 방식" (Billing Toggle 레이블. "결제 주기" 사용 금지)
- **옵션**: Annual (왼쪽, Default) | Monthly (오른쪽)

### 5.4 Toggle 전환 동작

- Toggle 전환 시 Individual 카드 가격 실시간 업데이트
  - Annual: "$280 / year"
  - Monthly: "$39 / month"
- Student 카드는 Toggle 상태와 무관하게 "$8.25 / month" 고정
- Trial 진입 시 선택한 지불 방식(Monthly/Annual)을 Checkout으로 전달한다. (Checkout 단에서 기억 여부 확인 필요 — 섹션 9 참조)

### 5.5 Annual 전환 시 가격 강조

- Annual 선택 시 월 환산 단가 표시 가능: "$23.33 / month (billed annually)"
- 절감액 표시 여부: (논의 필요)

---

## 6. Indie 배너 정의

### 6.1 배치 위치

- Organization 섹션 내 카드 행(Enterprise Single / Enterprise Team / Academics) 하단
- 또는 Organization 섹션 하단 (섹션 마지막 요소)
- 섹션 완전히 이탈하지 않도록 Organization 섹션 경계 내에 위치

### 6.2 표시 조건

- 모든 사용자에게 표시 (로그인 여부 무관)
- 단, Group Owner (Indie 인증 완료)에게는 별도 처리 필요 — 섹션 8 참조

### 6.3 배너 형태

- 플랜 카드보다 얇은 가로형 배너 (full-width 또는 카드 영역 너비 동일)
- 좌측: 플랜 정보 텍스트 영역 / 우측: CTA 버튼

### 6.4 배너 표시 정보

| 항목 | 내용 |
|---|---|
| 배너 레이블 | "Indie" 또는 "Indie Plan" |
| 설명 | 연 매출 $500,000 이하 사업자 대상 특가 |
| 가격 | $800 / year (최대 5 Seat) |
| CTA 버튼 | "Get Verified" |
| 인증 조건 안내 | 연 매출 $500,000 USD 이하 (카드 내 표시 여부 논의 필요) |

### 6.5 버튼 로직 (배너)

| 계정 상태 | Button State | Button Text |
|---|---|---|
| 비로그인 | 활성화 | Get Verified |
| Member (인증 없음) | 활성화 | Get Verified |
| Member (Student 인증 완료) | 비활성화 | For Enterprise |
| Group Owner (인증 없음) | 활성화 | Get Verified |
| Group Owner (인증 없음) — Indie 인증 대기 중 | 비활성화 | Verification in process |
| Group Owner (Academic 인증 완료) | 비활성화 | For Academic |
| Group Owner (Indie 인증 완료) | 활성화 | Check my License Status |

> **"Get Verified" 클릭 플로우 (확정)**
> 1. 비로그인 → 로그인 페이지로 이동 → 로그인 완료 후 아래 플로우 진행
> 2. Organization(Group) 보유 여부 확인
>    - 없음 → Organization 생성 페이지로 이동 → 생성 완료 후 Indie 인증 신청 페이지로
>    - 있음 → Indie 인증 신청 페이지로 바로 이동
> 3. Member(인증 없음)도 위 플로우 동일 적용 (Organization 없으므로 생성 단계 포함)

---

## 7. Linux 플랜 카드 정의

### 7.1 기본 스펙

- **플랜명**: Enterprise Linux
- **가격**: $2,300 / year
- **라이선스 유형**: Network Online
- **과금**: Annual only (Monthly 없음)
- **대상**: Organization (Group Owner) 전용
- **동시접속**: 구매된 Seat 수 기준 (상한 없음)
- **Trial**: 자동 Trial 없음. Enterprise 정책과 동일하게 문의를 통해 결정

### 7.2 카드 배치 및 섹션

- Linux Environment 섹션에 단독 배치
- 섹션 헤더에 "Linux 환경 사용자 전용" 안내 문구

### 7.3 Linux 섹션 안내 문구

- "Linux 환경에서 Marvelous Designer를 사용하는 Organization을 위한 플랜입니다."
- 또는 "For teams running Marvelous Designer on Linux."

### 7.4 버튼 로직

Section 4.6 Enterprise Linux 버튼 로직 테이블과 동일하게 적용.

### 7.5 미정 항목

- Enterprise Linux vs Enterprise Team 기능 차이 (Feature list 분리 기준 — 추후 카피라이팅 단계에서 확정)

---

## 8. 예외 및 엣지케이스

### 8.1 비로그인 → 버튼 클릭

- 비로그인 상태에서 "Start Now" 또는 "Get Verified" 클릭 시: 로그인 페이지로 이동
- 로그인 완료 후 선택한 플랜의 Checkout 또는 인증 신청 페이지로 리다이렉트
- 선택 플랜 및 지불 방식(Monthly/Annual)을 로그인 전 세션에 임시 저장한다

### 8.2 Trial 이미 사용한 Member → Individual 카드

- Trial 사용 이력 있는 Member(인증 없음)가 Individual 카드 접근 시
- 버튼: "Start Now" 활성화 유지 (플랜 카드에서는 Trial 이력 노출 없음)
- Trial 재시작 불가는 Checkout 단계에서 처리 (Plan 페이지에서 차단하지 않음)

### 8.3 Student Benefit Active 상태 → Individual 카드

- Member(Student 인증 완료) + Benefit 진행 중 상태에서 Individual 카드 접근 시
- 버튼: "For Student" 비활성화 표시
- 이유: Student 인증 완료 상태이므로 Individual 전환은 My Page에서 처리

### 8.4 Group Owner → Individual / Student 카드

- Group Owner (인증 여부 무관)는 Individual/Student 카드 버튼 비활성화
- 표시: "For Individual" / "For Student"
- 이유: Group Owner는 플랜 구매를 My Page 또는 Enterprise 경로로 진행

### 8.5 Group Owner Indie 인증 완료 → Indie 배너

- Group Owner (Indie 인증 완료)가 Indie 배너에 접근 시
- 버튼: "Check my License Status" → My Page Indie 라이선스 관리 화면으로 이동

### 8.6 Student 4년 경과

- Student 플랜 이용 기간은 최초 Student 인증 시점부터 4년(48개월)
- Pause·Cancelled 기간 포함하여 카운터가 흐른다
- 4년 경과 후 별도 플랜 카드 차단 처리 없음 — 만료 후 재구독 시 Checkout 단계에서 처리
- 카드 내 4년 제한 고지 문구는 유지 (CS 리스크 방지)

### 8.7 Academic Verification in process 상태의 시각 표현

- Group Owner (인증 없음) + Academic 인증 대기 중 상태
- Academics 카드: 버튼 "Verification in process" 비활성화
- 카드 내 상태 인라인 표시: 진행 중임을 알 수 있는 시각 요소 (예: 진행 표시, 텍스트 안내)
- 처리 기간은 페이지에 노출하지 않는다 (plan.md 기준)

### 8.8 플랜 카드 API 로딩 / 오류 상태

Plan 페이지 진입 시 로그인 계정 상태를 API로 조회한다. 조회 완료 전·실패 시 처리:

- **로딩 중**: 버튼 영역 로딩 상태 표시 (스켈레톤 or 스피너). 버튼 클릭 불가.
- **조회 실패**: 버튼을 비로그인 상태와 동일하게 표시 ("Start Now" 활성화). 재시도 없이 기본 플로우로 진입.
- **비로그인**: 버튼은 기본 활성화 상태 (plan-card.md 비로그인 행 기준).

### 8.9 Enterprise Single과 Enterprise Team 동시 표시

- 두 카드가 같은 섹션에 나란히 위치하므로 사용자가 선택 기준을 혼동할 수 있다
- 카드 하단 또는 섹션 내에 간략 비교 안내 필요: "Single: 1인용, Team: 팀 규모에 맞게"
- (자세한 문구는 UX Writing 검토 시 확정)

---

## 9. 미결 정책 (협의 필요)

| # | 항목 | 현재 상태 | 확인 필요 |
|---|---|---|---|
| A1 | ~~Enterprise Linux 동시접속 수~~ | **확정** — 구매 Seat 수만큼, 상한 없음 | — |
| A2 | ~~Student 4년 초과 버튼 처리~~ | **확정** — 별도 버튼 차단 없음. 만료 처리는 Checkout 단계 | — |
| A3 | Student Benefit 중 취소 후 재구독 시작 지점 | plan.md 미결 | 재구독 시 유료 즉시 시작 여부 확인 |
| A4 | Individual Annual Toggle 선택 → Checkout 전달 방식 | 미정 | Monthly/Annual 선택값 Checkout 페이지 인계 방식 |
| A5 | Annual Toggle 절감액 표시 여부 | 미정 | "(월 $23.33)" 등 환산 단가 표기 확정 필요 |
| A6 | Enterprise Linux vs Enterprise Team Feature list 차이 | 미정 | 카피라이팅 단계에서 확정 |
| A7 | Indie 배너 내 연 매출 기준 표기 여부 | 미정 | "$500,000 이하" 문구 노출 여부 |
| A8 | Non-Member 클릭 후 플랜 선택값 세션 유지 방식 | 미정 | 로그인 후 리다이렉트 시 Monthly/Annual 복원 여부 |
