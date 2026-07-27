# [MD|SITE] MyPage 리뉴얼 — 4탭 재설계

Epic Key: `(미정)` | 요청: Josh Lim | 출처: 세션 논의 | 작성일: 2026-05-12

## 배경

기존 MyPage는 MemberType 분기 구조가 불명확하고 탭 구성이 최신 정책을 반영하지 않은 채 운영 중이다. License/Billing 외에 Overview(대시보드), Shared License(외부 라이선스 제공자 확인) 탭을 추가하고, 6종 MemberType 전체에 대한 UI 분기를 정확히 재설계한다.

---

## 1. Agenda

| 항목 | 내용 |
|---|---|
| TITLE | MyPage 리뉴얼 — 4탭 재설계 |
| DESCRIPTION | Overview / Account / License/Billing / Shared License 4탭 구조로 개편. 6종 MemberType × CLO-SET 통합 여부 × 라이선스 상태 전체 분기 반영 |
| 요청자 | Josh Lim |
| DUE DATE | (미정) |

---

## 2. Background

### 2.1 대상 페이지

| URL | 설명 |
|---|---|
| `/mypage/overview` | 계정 + 라이선스 상태 대시보드 (신규) |
| `/mypage/account` | 계정 정보 조회 및 편집 |
| `/mypage/license` | 라이선스 / 결제 / 인보이스 관리 |
| `/mypage/shared-license` | 외부 라이선스 제공자 정보 확인 (신규) |

### 2.2 MemberType 정의

| MemberType | 설명 |
|---|---|
| Individual | 개인 사용자 계정 |
| Student | Individual 중 학생 인증 완료 |
| Company ID | 기업 대표 계정 |
| Academic | Company ID 중 교육기관 인증 완료 |
| Indie | Company ID 중 Indie 인증 완료 |
| License ID | Company ID 소속 실무자 계정 |

### 2.3 탭 노출 매트릭스

| 탭 | Individual | Student | Company ID | Academic | Indie | License ID |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Overview | O | O | O | O | O | O |
| Account | O | O | O | O | O | O |
| License / Billing | O | O | O | O | O | **X** |
| Shared License | △ | △ | △ | △ | △ | **O** |

> △ = 조건부. 타 Company의 Userpool Guest로 할당된 경우에만 탭 노출.
> Shared License = License ID는 항상 노출. 소속 Company 없으면 계정 자체가 없음.
> Company ID의 유저풀 관리(License ID 생성·삭제·Guest 초대)는 Team Console에서 수행. MyPage 미포함.

### 2.4 제외 범위 (이번 배포 외)

- `/mypage/store`, `/mypage/store/history` — MD Store Archive
- Seat 수 조회 — Shared License 탭에서 Company 사용 규모 유추 방지

---

## 3. Requirements

### 3.1 Overview 탭 (ACC-OV)

| 기능명 | Description | 노출 조건 |
|---|---|---|
| Account Summary | 시스템은 MemberType 뱃지, 이메일, CLO-SET 통합 상태를 표시한다. | 전체 |
| My License | 시스템은 내 구독 플랜명, 상태, 만료일, Auto Renew 상태를 표시한다. | 내 구독 보유 시 (Individual / Company ID 계열) |
| Shared License | 시스템은 제공 Company명, 라이선스 유형, 내 상태, 만료일을 표시한다. Seat 수는 표시하지 않는다. | Userpool Guest 할당 시 또는 License ID |
| Verification Status | 시스템은 자격 인증 현황 뱃지(Student / Academic / Indie)를 표시한다. | 해당 인증 보유 MemberType만 |
| Quick Actions | 시스템은 라이선스 상태 기반 컨텍스트 CTA를 표시한다. | 전체 (상태에 따라 CTA 내용 변경) |

> My License와 Shared License는 동시 노출 가능 — Individual이 자체 구독 + Guest 할당을 동시에 보유한 경우.

### 3.2 Account 탭

#### 기능 목록

| Feature ID | 기능명 | Description |
|---|---|---|
| ACC-01 | 계정 정보 조회 | 사용자는 이메일, 닉네임, MemberType 등 기본 계정 정보를 조회한다. |
| ACC-02 | 닉네임 변경 | 사용자는 닉네임을 변경한다. CLO-SET 통합 상태 및 MemberType에 따라 편집 가능 여부가 달라진다. |
| ACC-03 | 비밀번호 변경 | 사용자는 비밀번호를 변경한다. CLO-SET 통합 여부에 따라 UI가 분기된다. |
| ACC-04 | CLO-SET 통합 연결 | 미통합 사용자는 CLO-SET 통합 유도 CTA를 통해 통합을 진행한다. 전체 MemberType 노출. |
| ACC-05 | CLO-SET 통합 해제 | Company ID 계열 + 통합 상태일 때 해제 CTA를 노출한다. 해제 확인 모달 후 처리한다. |
| ACC-06 | Student 인증 신청 | Individual(미인증) 사용자는 학생 인증 신청 버튼을 통해 인증을 진행한다. |
| ACC-07 | Academic / Indie 인증 신청 | Company ID(미인증) 사용자는 인증 신청 버튼을 통해 Academic 또는 Indie 인증을 진행한다. |
| ACC-08 | 인증 상태 조회 | 시스템은 Student / Academic / Indie 인증 상태(In process / Rejected / Approved)를 표시한다. |
| ACC-09 | 계정 삭제 | Individual 사용자는 계정을 영구 삭제한다. 삭제 모달 최종 확인 후 로그아웃 및 홈 리다이렉트한다. |
| ACC-10 | License Admin 이동 | Company ID 사용자는 License Admin 권한을 다른 License ID로 이동한다. |

#### MemberType × 기능 노출 매트릭스

| 항목 | Individual | Student | Company ID | Academic | Indie | License ID |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 이메일 조회 | O (읽기전용) | O (읽기전용) | O (읽기전용) | O (읽기전용) | O (읽기전용) | O (읽기전용) |
| 닉네임 편집 | △ (CLO-SET 미통합 시만) | △ (CLO-SET 미통합 시만) | O (항상) | O (항상) | O (항상) | X |
| 비밀번호 변경 (MD) | O | O | O | O | O | O |
| CLO-SET 통합 섹션 | O | O | O | O | O | O |
| CLO-SET 통합 유도 CTA | 미통합 시 | 미통합 시 | 미통합 시 | 미통합 시 | 미통합 시 | 미통합 시 |
| CLO-SET 해제 CTA | X | X | 통합 시만 | 통합 시만 | 통합 시만 | X |
| Student 인증 신청 | O (미인증) | — (인증완료) | X | X | X | X |
| Academic / Indie 인증 신청 | X | X | O (미인증) | — (인증완료) | — (인증완료) | X |
| 인증 상태 조회 | X | O | X | O | O | X |
| 계정 삭제 | O | O | X | X | X | X |
| License Admin 이동 | X | X | O | O | O | X |

#### CLO-SET 통합 상태별 편집 분기

| MemberType | Not Integrated | Integrated |
|---|---|---|
| Individual / Student | CLO-SET 통합 유도 CTA 표시. **닉네임 편집 가능**, 비밀번호 변경 가능 | 연동 정보 조회. **닉네임·비밀번호 MD 내 편집 불가** — CLO-SET 이동 링크만 표시 |
| Company ID / Academic / Indie | CLO-SET 통합 유도 CTA 표시. 닉네임 편집 가능, 비밀번호 변경 가능 | 연동 정보 + 통합 해제 CTA. **닉네임만 MD 내 편집 가능** — 이메일·비밀번호는 CLO-SET 이동 |
| License ID | CLO-SET 통합 유도 CTA 표시. 닉네임 편집 X, 비밀번호 변경 가능 | 연동 정보 조회. **CLO-SET PW는 CLO-SET에서, MD PW는 MD 내 별도 변경** (독립 관리) |

#### 자격 인증 상태 레이블

| 상태 | 표시 레이블 |
|---|---|
| 승인 중 | `In process` |
| 거절 | `Rejected` |
| 승인됨 | `Student` / `Academics` / `Indie` |

### 3.3 License / Billing 탭

> License ID는 이 탭에 접근할 수 없다.

#### 기능 목록

| Feature ID | 기능명 | Description |
|---|---|---|
| LIC-01 | 라이선스 정보 조회 | 사용자는 플랜명, 라이선스 유형, 상태, 시작일/만료일을 조회한다. No License 시 빈 상태 표시한다. |
| LIC-02 | Trial 취소 | Trial 상태 사용자는 Trial을 즉시 취소한다. 재Trial 불가 고지를 포함한 확인 모달 후 처리한다. |
| LIC-03 | Monthly 구독 취소 | Monthly Active/Paused 사용자는 Stop Subscription 진입 후 Cancel 선택으로 구독을 취소한다. 이탈 서베이 포함. |
| LIC-04 | Enterprise Single 구독 취소 | Company ID Enterprise Single Active 사용자는 구독을 취소한다. |
| LIC-05 | Auto Renew 취소 | Individual Annual + Auto Renew ON 상태 사용자는 자동 갱신을 해제한다. |
| LIC-06 | 플랜 구매 이동 | No License / Expired / Trial 취소 완료 시 Pricing 페이지로 이동하는 CTA를 노출한다. Individual 계열만. |
| LIC-07 | 청구지 주소 조회 / 편집 | 사용자는 청구지 주소를 조회하고 편집한다. |
| LIC-08 | Payment Method 조회 | 사용자는 등록된 결제 수단 정보를 조회한다. |
| LIC-09 | 인보이스 목록 조회 | 사용자는 결제 내역(날짜, 금액, 다운로드)을 조회한다. |
| LIC-10 | Userpool Guest 정보 조회 | Individual이 Enterprise Guest로 할당된 경우, 속한 Company와 라이선스 유형을 read-only로 표시한다. |
| LIC-11 | Monthly 구독 일시정지 (Pause) | Monthly Active 사용자는 Stop Subscription 진입 후 Pause 선택으로 1~6개월 일시정지를 예약한다. 완료 후 변경 불가. |
| LIC-12 | Pause 예약 취소 (Undo Pause) | Monthly Pause Scheduled 상태 사용자는 일시정지 예약을 취소하고 Active로 복귀한다. |
| LIC-13 | 구독 재개 (Resume Now) | Monthly Paused 상태 사용자는 수동으로 구독을 즉시 재개한다. 결제 실패 시 Suspended로 전환한다. |
| LIC-14 | 결제 재시도 (Retry Payment) | Monthly Suspended 상태 사용자는 결제를 재시도한다. 성공 시 Active, 실패 시 에러 모달 표시한다. |

#### 항목별 노출 조건

| 항목 | 조건 |
|---|---|
| 라이선스 정보 | 항상 노출. No License 시 빈 상태 표시 |
| Trial 취소 CTA | Trial 상태일 때만 |
| Stop Subscription CTA | Monthly Active일 때만 |
| Pause Subscription | Stop Subscription 모달 내 선택지 (Monthly Active에서만 진입) |
| Undo Pause CTA | Monthly Pause Scheduled 상태일 때만 |
| Resume Now CTA | Monthly Paused 상태일 때만 |
| Retry Payment CTA | Monthly Suspended 상태일 때만 |
| Cancel Subscription CTA | Monthly Active/Paused 또는 Enterprise Single Active일 때 |
| Auto Renew 섹션 | Individual Annual일 때만 |
| Auto Renew 취소 CTA | Individual Annual + Auto Renew ON일 때만 |
| 플랜 구매 CTA | No License / Expired / Trial 취소 완료 시 (Individual 계열만) |
| 결제 정보 / 청구지 주소 | Individual O, Company ID O, License ID X |
| 인보이스 목록 | Individual O, Company ID O, License ID X |
| Userpool Guest 섹션 | Individual이 Enterprise Guest로 할당된 경우만 |

#### Monthly 라이선스 상태 전이

| 상태 | 가능한 액션 | 다음 상태 |
|---|---|---|
| Active | Stop Subscription → Pause 또는 Cancel 선택 | Pause Scheduled / Cancel Scheduled |
| Pause Scheduled | Undo Pause | Active |
| Paused | Resume Now / Cancel Subscription | Active 또는 Suspended / Cancel Scheduled |
| Suspended | Retry Payment | Active (성공) / Suspended + 에러 (실패) |
| Cancel Scheduled | — (대기) | No License (만료 후) |
| No License | Go to Pricing | — |

### 3.4 Shared License 탭

| Feature ID | 기능명 | Description |
|---|---|---|
| SHL-01 | Shared License Provider 정보 조회 | 사용자는 나에게 라이선스를 제공하는 Company명, 라이선스 유형, 내 상태(Active / Inactive), 만료일을 read-only로 조회한다. Seat 수는 표시하지 않는다. |

| 표시 항목 | 표시 여부 | 비고 |
|---|---|---|
| 제공 Company명 | O | |
| 라이선스 유형 | O | |
| 내 상태 (Active / Inactive) | O | |
| 만료일 | O | |
| Seat 수 / 사용 현황 | **X** | Company 사용 규모 유추 방지 |

---

## 4. Scope

### 4.1 Web

- `/mypage/overview` — Overview 탭: Account Summary, My License, Shared License, Verification Status, Quick Actions
- `/mypage/account` — Account 탭: 계정 정보, 비밀번호 변경(CLO-SET 분기), 인증 상태, CLO-SET 통합, 관리 액션
- `/mypage/license` — License/Billing 탭: 라이선스 정보, 구독 관리(Pause/Resume/Cancel/Retry), Auto Renew, 청구지, Payment Method, 인보이스
- `/mypage/shared-license` — Shared License 탭: Provider 정보 read-only 조회
- License ID는 `/mypage/license` 탭 미노출

### 4.2 Admin

- 본 PRD 범위 외

### 4.3 제외

- `/mypage/store`, `/mypage/store/history` — 추후 추가
- Company ID 유저풀 관리(License ID 생성·삭제·Guest 초대) — Team Console (MyPage 미포함)
- Seat 수 노출 — 미노출 정책

---

## 5. Flow

### 5.1 비밀번호 변경 (ACC-03)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Account 탭 비밀번호 변경 영역에 진입한다. |
| 2 | System | CLO-SET 통합 여부를 확인한다. |
| 3a | System (미통합) | 현재 PW / 새 PW / 확인 PW 입력 폼을 표시한다. |
| 3b | System (통합 — Individual/Student) | "CLO-SET에서 변경하기" 링크만 표시한다. MD 입력 폼 없음. |
| 3c | System (통합 — Company ID 계열) | CLO-SET PW 변경 링크 + 닉네임은 MD 내 편집 폼을 표시한다. |
| 3d | System (통합 — License ID) | CLO-SET PW 변경 링크 + MD PW 변경 폼을 각각 독립적으로 표시한다. |
| 4 | 사용자 | 해당 폼을 작성하고 저장한다. |
| 5 | System | 입력 불일치 시 인라인 에러를 표시한다. 성공 시 완료 상태를 표시한다. |

### 5.2 CLO-SET 통합 해제 (ACC-05)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Account 탭 CLO-SET 통합 섹션에서 해제 CTA를 클릭한다. |
| 2 | System | 해제 확인 모달을 노출한다. |
| 3 | 사용자 | 모달에서 해제를 최종 확인한다. |
| 4 | System | CLO-SET 통합을 해제하고 Account 탭을 미통합 상태로 갱신한다. |

### 5.3 계정 삭제 (ACC-09)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Account 탭 Danger Zone에서 계정 삭제 CTA를 클릭한다. |
| 2 | System | 삭제 확인 모달을 노출한다. 영구 삭제·복구 불가 고지 포함. |
| 3 | 사용자 | 모달에서 삭제를 최종 확인한다. |
| 4 | System | 계정을 삭제하고 로그아웃 후 홈으로 리다이렉트한다. |

### 5.4 Trial 취소 (LIC-02)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | License/Billing 탭 Trial 정보 카드에서 "Cancel Trial" 버튼을 클릭한다. |
| 2 | System | 확인 모달을 노출한다. 즉시 중단 + 재Trial 불가 고지 포함. |
| 3 | 사용자 | 모달에서 취소를 최종 확인한다. |
| 4 | System | Trial을 종료하고 상태를 No License로 전환한다. |

### 5.5 Monthly 구독 취소 (LIC-03)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | License/Billing 탭에서 "Stop Subscription" 버튼을 클릭한다. |
| 2 | System | STOP SUBSCRIPTION 모달을 노출한다. Pause / Cancel 2-패널 설명 제공. |
| 3 | 사용자 | "Cancel Subscription" 선택지를 선택한다. |
| 4 | System | CANCEL SUBSCRIPTION 1 모달을 노출한다. [Change to Pause] / [Cancel Subscription] 버튼 제공. |
| 5 | 사용자 | "Cancel Subscription" 버튼을 클릭한다. |
| 6 | System | CANCEL SUBSCRIPTION 2 모달(취소 이유 서베이)을 노출한다. 서베이 완료 후 COMPLETE 버튼이 활성화된다. |
| 7 | 사용자 | 서베이를 완료하고 COMPLETE 버튼을 클릭한다. |
| 8 | System | 구독 상태를 Cancel Scheduled로 전환하고 완료 모달을 표시한다. |
| 9 | System | 구독 기간 만료 후 상태를 No License로 전환한다. |

> STOP SUBSCRIPTION 모달에서 "Pause for Now" 선택 시 5.6 Pause 플로우로 이동한다.
> CANCEL SUBSCRIPTION 1 모달에서 "Change to Pause" 선택 시 5.6 Pause 플로우로 이동한다.

### 5.6 Monthly 구독 일시정지 (LIC-11)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | STOP SUBSCRIPTION 모달에서 "Pause for Now"를 선택한다. |
| 2 | System | PAUSE SUBSCRIPTION 1 모달을 노출한다. 기간 선택(1~6개월, 기본 6) + "잔여 기간 사용, 자동 재개, 기간 변경 불가" 안내 포함. |
| 3 | 사용자 | 기간을 선택하고 PAUSE SUBSCRIPTION 버튼을 클릭한다. |
| 4 | System | PAUSE SUBSCRIPTION 2 확인 모달을 노출한다. 정지 시작일 · 재개일 · 재개 후 청구 금액 안내 포함. |
| 5 | 사용자 | COMPLETE 버튼을 클릭한다. |
| 6 | System | 구독 상태를 Pause Scheduled로 전환하고 완료 모달을 표시한다. 라이선스 정보에 예약 날짜 + UNDO PAUSE 버튼 노출. |
| 7 | System | 실제 정지 시작일이 되면 상태를 Paused로 전환한다. Cancel Subscription / Resume Now 버튼 노출. |

### 5.7 Pause 예약 취소 (LIC-12)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Pause Scheduled 상태에서 "Undo Pause" 버튼을 클릭한다. |
| 2 | System | UNDO PAUSE 확인 모달을 노출한다. "예약된 일시정지가 취소되며 구독 조건은 동일하게 유지" 안내. |
| 3 | 사용자 | COMPLETE 버튼을 클릭한다. |
| 4 | System | 상태를 Pause Scheduled → Active로 전환하고 완료 모달을 표시한다. |

### 5.8 구독 재개 (LIC-13)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Paused 상태에서 "Resume Now" 버튼을 클릭한다. |
| 2 | System | RESUME SUBSCRIPTION 모달을 노출한다. "오늘 재개, 오늘 결제 시작, 매월 청구일·금액" 안내. |
| 3 | 사용자 | RESUME 버튼을 클릭한다. |
| 4 | System | 결제를 시도한다. |
| 5a | System (성공) | 상태를 Paused → Active로 전환한다. |
| 5b | System (실패) | 상태를 Paused → Suspended로 전환하고 에러 안내를 표시한다. |

### 5.9 결제 재시도 (LIC-14)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Suspended 상태에서 "Retry Payment" 버튼을 클릭한다. |
| 2 | System | RETRY PAYMENT 모달을 노출한다. 결제 금액 / 갱신일 안내. |
| 3 | 사용자 | MAKE PAYMENT 버튼을 클릭한다. |
| 4 | System | 결제를 시도한다. |
| 5a | System (성공) | 상태를 Suspended → Active로 전환한다. |
| 5b | System (API 에러) | 에러 모달을 노출한다. Error Code 표시 + [Close] / [Contact Us] 버튼. |
| 5c | System (결제 실패) | 에러 모달을 노출한다. 잔액 부족/결제사 문제 안내 + [Retry] 버튼. |

### 5.10 Auto Renew 취소 (LIC-05)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | License/Billing 탭 Auto Renew 섹션에서 취소 버튼을 클릭한다. |
| 2 | System | 확인 모달을 노출한다. "잔여 기간 사용 가능, 만료 후 미갱신" 안내. |
| 3 | 사용자 | 확인 버튼을 클릭한다. |
| 4 | System | Auto Renew를 OFF 상태로 전환한다. |

### 5.11 License Admin 이동 (ACC-10)

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 사용자 | Account 탭 Danger Zone에서 "Admin 이동" 버튼을 클릭한다. |
| 2 | System | 이동 대상 License ID 목록을 표시한다. |
| 3 | 사용자 | 이동 대상 License ID를 선택한다. |
| 4 | System | 확인 모달을 노출한다. "현재 계정은 License ID로 강등됨" 경고 포함. |
| 5 | 사용자 | 모달에서 최종 확인한다. |
| 6 | System | Admin 권한을 이동하고 현재 세션을 License ID로 전환한다. |

---

## 6. Action Item

### 6.1 UX / 화면 구성

- [ ] OVERVIEW — Account Summary + My License + Shared License + Verification Status + Quick Actions 와이어프레임 (MemberType별)
- [ ] ACCOUNT_INDIVIDUAL — CLO-SET 통합 여부별 편집 상태 분기 화면 (Not Integrated / Integrated 2케이스)
- [ ] ACCOUNT_COMPANYID — CLO-SET 분기 + Academic/Indie 인증 + CLO-SET 해제 CTA + License Admin 이동
- [ ] ACCOUNT_LICENSEID — 조회 전용 + 비밀번호 독립 변경 화면
- [ ] LICENSE_INDIVIDUAL — Monthly 상태 전이 6케이스 (Active / Pause Scheduled / Paused / Suspended / Cancel Scheduled / No License)
- [ ] LICENSE_INDIVIDUAL_ANNUAL — Auto Renew ON/OFF + Retry Payment 케이스
- [ ] LICENSE_COMPANYID — Enterprise Single Active / Cancel Scheduled
- [ ] SHARED_LICENSE — Provider 정보 read-only (License ID 상시 / Guest 조건부)
- [ ] FLOW_STOP_SUBSCRIPTION — Stop Subscription 모달 분기 흐름 (Pause / Cancel)
- [ ] FLOW_PAUSE — Pause Subscription 3단계 모달
- [ ] FLOW_RESUME — Resume Now 모달 + 결제 결과 분기
- [ ] FLOW_RETRY — Retry Payment 모달 + 에러 분기 3종

### 6.2 정책 확인 필요

- [ ] 비밀번호 변경 방식 확정 — 인라인 편집 vs 모달 (논의 필요)
- [ ] License Admin 이동 후 현 사용자 처리 방식 확인
- [ ] Monthly Paused → Suspended 전환 시 이메일 알림 여부

---

## 7. Impact

| 지표 | 방향 |
|---|---|
| CS 문의 감소 | MemberType별 기능 제한이 명확히 UI에 반영되어 혼선 감소 |
| 구독 이탈 감소 | Pause 옵션 제공으로 Cancel 대신 Pause 선택 유도 |
| 인증 전환율 | Student / Academic / Indie 인증 신청 CTA 명확화 |
| CLO-SET 통합 전환율 | 미통합 상태에서 통합 유도 CTA 노출으로 통합률 향상 |
