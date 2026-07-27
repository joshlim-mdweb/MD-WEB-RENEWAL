# POLICY_MYPAGE

Source: https://clo.atlassian.net/wiki/spaces/MDT/pages/3851354161/POLICY_MYPAGE

---

## 1. MemberType 정의

| MemberType | 정의 |
| --- | --- |
| Individual | 개인 사용자 계정 (구 Personal) |
| Student | Individual 중 학생 인증 완료 |
| Company ID | 기업 계정 (관리자 단위) |
| Academic | Company ID 중 교육기관 인증 완료 |
| Indie | Company ID 중 Indie 인증 완료 |
| License ID | Company ID 소속 라이선스 사용자 계정 |

> Individual / Student / Company ID / Academic / Indie는 정책상 동일 규칙을 적용하는 경우 `Individual` 또는 `Company ID` 그룹으로 묶어 표기한다.

> **License ID — MD Web 로그인 불가 (확정)**  
> License ID는 MD Web(marvelousdesigner.com) 로그인이 허용되지 않는다. 데스크톱 앱 전용 계정.  
> MyPage 포함 모든 웹 기능 접근 불가. 이하 정책에서 License ID 관련 항목은 레거시 참고용으로만 유지한다.

---

## 2. 탭 구조

MyPage는 LNB 사이드탭 5개로 구성된다.

| 탭 | 역할 |
| --- | --- |
| Overview | 계정 상태 · 라이선스 상태 대시보드 |
| Account | 계정 정보 조회 및 편집 (Identity · Security · Certification) |
| License / Billing | 라이선스 · 결제 · 인보이스 관리 |
| Shared License | 나에게 라이선스를 제공하는 Provider 정보 확인 |
| Preferences | 언어 · 알림 · 앱 설정 관리 |

---

## 3. 탭 노출 매트릭스

| 탭 | Individual | Student | Company ID | Academic | Indie | License ID |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| Overview | O | O | O | O | O | **—** |
| Account | O | O | O | O | O | **—** |
| License / Billing | O | O | O | O | O | **—** |
| Invited Projects | O | O | O | O | O | **—** |
| Preferences | O | O | O | O | O | **—** |

> **License ID** = MD Web 로그인 불가. MyPage 전체 탭 접근 불가 (—).  
> **Invited Projects** = Individual·Student·Company ID 계열에 노출. Userpool Guest 할당 여부와 무관하게 탭 자체는 노출, 데이터 없을 시 빈 상태 표시.  
> Company ID 계열의 유저풀 관리(License ID 생성 · 삭제 · Guest 초대 등)는 Team Console에서 수행. MyPage 미포함.

---

## 4. Overview 탭

계정 상태와 라이선스 상태를 한눈에 확인하는 대시보드.

### 섹션별 노출 조건

| 섹션 | 표시 내용 | 노출 조건 |
| --- | --- | --- |
| Account Summary | MemberType 뱃지 · 이메일 · CLO-SET 통합 상태 | 전체 |
| My License | 내 구독 플랜명 · 상태 · 만료일 · Auto Renew 상태 | 내 구독 보유 시 (Individual 계열, Company ID 계열, License ID) |
| Quick Actions | 상태 기반 컨텍스트 CTA | 전체 (상태에 따라 CTA 내용 변경) |

> 인보이스는 Overview 미노출. License / Billing 탭에서만 확인 가능.  
> Shared License 정보는 Shared License 탭에서만 확인 가능.

### 4-1. License Account Admin 이동 버튼

| 항목 | 노출 조건 | 동작 |
| --- | --- | --- |
| License Account Admin으로 이동 버튼 | Company ID 계열 / Academic / Indie MemberType만 | 클릭 시 License Account Admin 페이지로 이동 |

> Overview에서 License Account Admin 직접 접근이 필요한 MemberType에게만 표시.  
> Individual / Student / License ID에는 미노출.

---

## 5. Account 탭

### 5-1. 분기 축

| 분기 축 | 값 |
| --- | --- |
| MemberType | Individual / Student / Company ID / Academic / Indie / License ID |
| CLO-SET 통합 여부 | Not Integrated / Integrated |

### 5-2. 항목별 노출 조건

Account 탭은 **계정 정보 카드** (Member Type · Email · Nickname · CLO-SET · Password 통합) + **Danger Zone 카드** 2개 카드로 구성된다.

| 항목 | Individual | Student | Company ID | Academic | Indie |
| --- | :---: | :---: | :---: | :---: | :---: |
| 이메일 편집 | O* | O* | O* | O* | O* |
| 닉네임 편집 | O* | O* | O* | O* | O* |
| 비밀번호 변경 | O** | O** | O*** | O*** | O*** |
| CLO-SET 통합 섹션 | O | O | O | O | O |
| Visit my CLO-SET CTA | O† | O† | O† | O† | O† |
| CLO-SET 해제 CTA | X | X | O† | O† | O† |
| 계정 삭제 | O§§ | O§§ | O§§§ | X¶ | X¶ |
| License Admin 이동 | X | X | O | O | O |

> **Danger Zone 카드** (계정 삭제 + License Admin 이동)는 Academic / Indie에게 카드 자체가 미노출된다.
>
> **Delete Account 버튼 노출 조건**: Individual / Student, Company ID (CLO-SET 통합)만 표시. Company ID (미통합) / Academic / Indie는 미표시 — Contact Us 링크만 안내.
>
> **카드 내 설명 문구 (MemberType별)**
> - Individual / Student: "계정 삭제는 CLO-SET에서 진행돼요. Delete Account 클릭 시 CLO-SET으로 이동해요."
> - Company ID (CLO-SET 통합): "계정 삭제는 CLO-SET에서 진행돼요. Delete Account 클릭 시 CLO-SET으로 이동해요."
> - Company ID (CLO-SET 미통합): "계정 삭제가 필요한 경우 Contact Us를 통해 문의해 주세요."
> - Academic / Indie: "계정 삭제가 필요한 경우 Contact Us를 통해 요청해 주세요."
>
> **Contact Us 이동**: Company ID / Academic / Indie 표시.

> \* CLO-SET 통합 시 이메일·닉네임 편집 불가 (CLO-SET에서만 변경 가능). MemberType 무관.  
> \*\* Individual / Student + CLO-SET 통합 시: CLO-SET PW만 변경 가능 (MD 내 비밀번호 변경 UI 비활성화)  
> \*\*\* Company ID / Academic / Indie + CLO-SET 통합 시: CLO-SET PW (CLO-SET에서 변경) + MD PW (MD 내에서 별도 변경) — 두 비밀번호 독립 관리  
> † 통합 상태일 때만 노출. Visit my CLO-SET CTA는 전체 MemberType (Connected 상태). CLO-SET 해제 CTA는 Company ID / Academic / Indie만.

### 5-3. CLO-SET 통합 상태별 UI 분기

> **Not Integrated 케이스는 현재 해당 없음.** 신규 가입 시 CLO-SET 연동 상태로 시작한다. 아래 테이블은 레거시 케이스 참고용으로만 유지한다.

| MemberType | Not Integrated (레거시) | Integrated |
| --- | --- | --- |
| Individual / Student | CLO-SET 통합 유도 CTA 표시. **닉네임·이메일 편집 가능**, 비밀번호 변경 가능 | 연동 정보 조회 + **Visit my CLO-SET CTA**. **이메일·닉네임 CLO-SET에서만 변경**. 비밀번호: CLO-SET PW만 변경 가능 |
| Company ID / Academic / Indie | CLO-SET 통합 유도 CTA 표시. 닉네임·이메일 편집 가능, 비밀번호 변경 가능 | 연동 정보 + **Visit my CLO-SET CTA** + 통합 해제 CTA. **이메일·닉네임 CLO-SET에서만 변경**. 비밀번호: CLO-SET PW (CLO-SET에서) + MD PW (MD 내에서) 독립 관리 |

---

## 6. License / Billing 탭

> **탭 내 구조**: License/Billing 탭은 서브탭(License / Invoices) 없이 단일 스크롤로 구성된다. 라이선스 정보 → 결제 정보 → 인보이스 목록 순서로 연속 노출.

### 6-1. 섹션별 노출 조건

| 섹션 / 항목 | 조건 |
| --- | --- |
| 라이선스 정보 (제품명·만료일 + 상태 안내 배너) | 항상 노출. No License 시 빈 상태 표시. **상태 배지 미노출 — 상태는 안내 배너 문구로만 표시 (6-2-1 참조)** |
| **Student Benefit Active 배너** | Student Benefit Active 상태일 때만. 무료 기간 종료일 및 남은 일수 표시. (e.g., "3개월 무료 혜택 종료까지 D-45") |
| **Student 인증 만료 임박 배너** | Student MemberType이고 인증 만료 D-30 이내일 때. 경고 배너 노출. (e.g., "학생 인증이 30일 후 만료됩니다. 만료 시 구독이 종료됩니다.") |
| Pause for Now CTA | Monthly Active 상태일 때만. **Student Benefit Active 상태 제외 (Benefit 기간 중 일시정지 불가).** |
| Undo Pause CTA | Monthly Pause Scheduled 상태일 때만. |
| Resume Now CTA | Monthly Paused 상태일 때만. |
| Retry Payment CTA | Monthly Suspended(결제 실패) 상태일 때만. |
| Verify CTA | Monthly Suspended(3ds 인증 필요) 상태일 때만. |
| Cancel Subscription CTA | Monthly Active / Paused 또는 Enterprise Single Active일 때. **Student Benefit Active 상태 제외 (Benefit 기간 중 취소 불가).** |
| Trial 취소 CTA | Trial 상태일 때만. |
| 플랜 구매 CTA | No License / Expired / Trial 취소 완료 시. Individual 계열만. **Student 4년 만료 후: TBD (재인증 or 개인 플랜 전환 안내로 대체 여부 미확정).** |
| 결제 정보 / 청구지 주소 | Individual 계열 O, Company ID 계열 O (조회만. 수정은 License Account Admin > Invoice에서) |
| 인보이스 목록 | Individual 계열 O, Company ID 계열 O |
| 인보이스 PDF 다운로드 | 인보이스 목록 내 Paid 행에서 직접 다운로드 가능. |
| Userpool Guest 섹션 | Individual이 Enterprise Guest로 할당된 경우만 |

### 6-2. Monthly 라이선스 상태 전이

| 상태 | 설명 | 가능한 액션 | 다음 상태 |
| --- | --- | --- | --- |
| **Benefit Active** | Student 전용. 3개월 무료 혜택 기간 중. 결제 정보는 수집되었으나 $0 청구. | 없음 (Pause·Cancel 불가) | Benefit 종료 시 자동으로 **Monthly Active** 전환 |
| **Monthly Active** | 정상 구독 중. 매월 청구 발생. | Pause for Now 또는 Cancel Subscription 버튼 직접 클릭 | Pause Scheduled / Cancel Scheduled |
| Pause Scheduled | 일시정지 예약 완료. 실제 정지 전 상태. | Undo Pause | Monthly Active |
| Paused | 일시정지 중. | Resume Now / Cancel Subscription | Monthly Active 또는 Suspended / Cancel Scheduled |
| Suspended | 결제 실패로 인한 접속 제한. 라이선스 즉시 Lock. | Retry Payment | Monthly Active (성공) / Suspended (실패) |
| Cancel Scheduled | 취소 예약 완료. 만료 대기 중. | — (대기) | No License (만료 후) |
| No License | 라이선스 없음. | Go to Pricing (Student 4년 만료 후 처리: TBD) | — |

> **Benefit Active 진입 조건**: Student MemberType이 Checkout에서 Student Benefit을 시작할 때. 결제 정보를 입력하고 $0으로 구독 시작.  
> **Benefit Active → Monthly Active 전환**: 무료 기간(3개월) 종료 시 자동 전환. 별도 사용자 액션 없음. 전환 시점 D-7/D-3/D-0에 이메일 알림 발송.  
> **기존 Monthly Active**: Student 이외의 Individual 계열(Monthly 구독 중인 경우) 동일하게 적용.

### 6-2-1. 구독 상태 표시 방식 (2026-07-16 변경)

> **변경 요지**: 상태 배지(Pause Scheduled / Paused / Suspended 등) UI 표시를 폐지한다. 현재 구독 상태는 License Information 카드 내 **안내 배너 문구**로만 전달한다.

- License Information 카드에 상태 배지를 노출하지 않는다.
- 상태 전이 모델(6-2)은 백엔드 기준 그대로 유지된다. **표시 방식만** 배너로 대체.
- 각 상태에 대응하는 배너 문구는 아래와 같다.

버튼은 좌측 Cancel 계열(secondary) + 우측 primary(검정) 순으로 배치된다. (단일 버튼은 우측 primary)

| 상태 (내부) | 안내 배너 문구 (변수) | 노출 버튼 (좌 → 우) |
| --- | --- | --- |
| Monthly Active | 배너 미표시 | Pause Subscription / Cancel Subscription |
| Cancel Scheduled | 구독 종료 예정일 안내 (`{endDate}`) | Pause Subscription / Cancel Subscription |
| Pause Scheduled | 일시정지 시작 예정일 안내 (`{subscriptionPauseStart}`) | Undo Pause |
| Paused | 자동 재개 예정일 안내 (`{subscriptionResumeDate}`) | Cancel Subscription / Resume Now |
| Suspended (결제 실패) | 결제 실패 및 결제 수단 업데이트 안내 | Cancel Subscription / Retry Payment |
| Suspended (3ds 인증 필요) | 추가 인증 필요 안내 | Cancel Subscription / Verify |

> 배너 문구 원문·변수 및 버튼 구성은 Figma 확정 반영됨 (구독 상태 배너 케이스). Suspended 배너 확정 문구는 `error-copy.md` §2 License/Billing 참조. 실제 서비스 KO 카피는 ux-writing 규칙 적용 (후속).
> **3ds 상태 버튼**: 결제 실패(4)는 `Retry Payment`, 3ds 인증 필요(5)는 `Verify`로 구분된다. (이전 Suspended 단일 처리에서 분리)

### 6-3. 구독 중단 플로우

License Information 카드 내 Action Row에 **Pause for Now** 와 **Cancel Subscription** 두 버튼이 직접 노출된다. 별도 선택 모달 없음.

```
[Pause for Now] 버튼 클릭
→ PAUSE FOR NOW 모달 (기간 선택 1~6개월)
    완료 시: Active → Pause Scheduled

[Cancel Subscription] 버튼 클릭
→ Cancel Subscription 풀페이지 3단 플로우 (모달 아님, 2026-07-16 변경)
```

> **Cancel Subscription 풀페이지 플로우 (2026-07-16 변경)**
> 기존 모달 3단 → **풀페이지 3단**으로 변경. 각 페이지는 GNB + Back(< Account) + 화면 타이틀 "Cancel Subscription" 구조.

| 단계 | 화면 | 주요 요소 | 진행 |
| --- | --- | --- | --- |
| 1 | 취소 안내 | Cancellation Notice(종료 예정일·재구독 필요·혜택 소멸) + Pause for now(리텐션) | [Continue] → 2단계 / [Pause for now] → Pause 플로우 전환 |
| 2 | 사유 서베이 | 취소 사유(최대 3) + 개선점(최대 3) + 자유 피드백(선택) + Pause for now(리텐션) | [Cancel Subscription] → 3단계(최종 확인)로 이동 / [Pause for now] → Pause 플로우 전환 |
| 3 | 최종 확인 | Cancellation Summary(Current Plan · Cancellation Effective Date · Access Until) + 영향 안내 목록 | [Cancel Subscription] → 취소 확정(Active → Cancel Scheduled) → 4단계 |
| 4 | 완료 | 완료 메시지(재방문 가능 시점 안내) | [My License] → License / Billing 이동 |

> **취소 확정 시점**: 3단계(최종 확인)의 [Cancel Subscription] 버튼 클릭 시 실제 취소 확정(Cancel Scheduled 전환).
> **취소 후**: 현재 구독 기간 종료 시점까지 이용 가능 → 기간 종료 시 No License 전환.
> **상태 표시**: Cancel Scheduled 상태는 License Information 배너로 종료 예정일 표시 (상태 배지 없음, 6-2-1 참조).
> **Figma 레퍼런스**: Cancel Subscription 1/2/3/4 프레임 (node 6300:3486 / 6300:3757 / 6328:1859 / 6300:4429).

> **Pause Scheduled 상태**: Undo Pause 버튼만 표시. Pause for Now / Cancel Subscription 미노출.  
> **Paused 상태**: Resume Now / Cancel Subscription 버튼 표시.  
> **Student Benefit Active 상태**: Pause for Now / Cancel Subscription 버튼 미노출. Benefit 기간 중에는 구독 중단 불가. Benefit 종료(Monthly Active 전환) 이후부터 일반 Monthly 구독 관리 플로우 적용.

### 6-4. Pause 관련 정책

- Pause 기간: 1~6개월 선택 가능. 완료 후 변경 불가.
- Pause Scheduled: 실제 일시정지 시작 전. Undo Pause로 취소 가능.
- Paused: 일시정지 중. 잔여 구독 기간 내 사용 가능. 자동 재개 또는 수동 Resume Now 가능.
- Resume Now 결제 실패 시 상태: Paused → Suspended.

### 6-5. Suspended 상태 정책

- 결제 실패로 인한 접속 제한 상태.
- Retry Payment 성공 시 Active 복귀.
- 결제 실패 유형별 에러 분기: API 오류 / Stripe 잔액 부족 / PayPal·Alipay 오류.

### 6-6. Student 인증 기간 & 구독 정책

> 이 섹션은 MDWEB-773 (Student Plan Renewal — Monthly 전환) 정책을 MyPage 관점에서 정의한다.  
> 확정 기준일: 2026-05-19

#### 인증 만료일 계산 기준

| 항목 | 정책 |
| --- | --- |
| 기준 시점 | **인증 승인 시점** (구매 시점 아님) |
| 유효 기간 | 인증 승인 시점으로부터 **4년** |
| Legacy Annual 유저 | 최초 Annual 구매일로부터 4년을 기준으로 산정. 이미 사용한 Annual 라이선스 기간(1년 단위)은 4년에서 차감. |

#### Legacy Annual 유저 처리 (MyPage 표시)

| 상황 | 표시 내용 |
| --- | --- |
| Annual 라이선스 아직 활성 중 | 기존 연간 플랜 만료일까지 Annual 상태 유지. 만료 후 자동으로 Student Monthly Benefit 또는 Monthly 전환 안내 표시. |
| Annual 만료 후 4년 이내 | Student Monthly Benefit 적용 가능. Checkout에서 Student Benefit 시작 가능. |
| Annual 만료 후 4년 초과 | No License 상태. **플랜 구매 CTA 처리: TBD** (재인증 또는 개인 플랜 전환 안내로 대체 여부 미확정) |

> Legacy 유저에게 발송되는 이메일(프로모션 쿠폰 + 안내)은 MyPage 정책 범위 밖. 이메일 발송은 개발팀 별도 처리.

#### 4년 만료 후 상태 (TBD)

4년 인증 기간 만료 시 MyPage 처리 방법은 **확정되지 않음**. 아래 옵션 중 하나로 결정 예정.

| 옵션 | 내용 | 상태 |
| --- | --- | --- |
| A | No License 상태. Go to Pricing → Individual 플랜 구매 유도 | TBD |
| B | 재인증 신청 안내 표시. 4년 연장 가능 여부 CS 처리 | TBD |
| C | 50% 졸업 후 할인 프로모션으로 Individual 전환 유도 | TBD |

> 고등학생 인증 기간 정책(4년 적용 여부)도 미확정. TBD.

#### Benefit 만료 임박 배지 기준

Benefit Active 상태에서 종료일이 가까워질 때 MyPage License/Billing 탭에 시각적 강조를 표시한다.

| 기준 | 표시 |
| --- | --- |
| D-30 이내 | Benefit 종료일 텍스트 강조 (일반 색상 → 경고 색상) |
| D-7 이내 | 경고 배너 노출 ("무료 혜택이 7일 후 종료됩니다. 이후 $8.25/월로 자동 청구됩니다.") |
| D-0 (당일) | 당일 안내 배너 ("오늘 무료 혜택이 종료되고 월간 구독이 시작됩니다.") |

> 이메일 알림(D-7/D-3/D-0)은 별도 발송. MyPage 배너는 이메일과 독립적으로 동작.  
> 배너 디자인 및 정확한 문구는 Figma 와이어프레임 작업 시 확정.

---

## 7. Shared License 탭

나에게 라이선스를 제공하는 Provider 정보를 확인하는 탭.

### 7-1. 노출 대상

| MemberType | 노출 조건 |
| --- | --- |
| Individual / Student | 타 Company의 Userpool Guest로 할당된 경우 |
| Company ID / Academic / Indie | 타 Company의 Userpool Guest로 할당된 경우 |
| License ID | **X** — Provider 소속 사용자로 Shared License 관계의 수혜자가 아님. 이 탭 불필요. |

> **멀티 Provider**: 한 사용자가 여러 Company에 동시에 Guest로 초대받을 수 있다. 이 경우 Provider별로 카드를 나열하여 표시한다.

### 7-2. 표시 내용

| 항목 | 표시 여부 | 비고 |
| --- | --- | --- |
| 제공 Company명 | O | 카드 헤더에 표시 |
| 라이선스 유형 | O | |
| 내 상태 (Active / Inactive) | O | |
| Contact (관리자 이메일) | O | Company ID 라이선스 소유자(관리자) 이메일 |
| 만료일 (Expiry Date) | **X** | Guest에게 미노출 |
| 금액 / Amount | **X** | Guest에게 미노출 |
| Seat 수 / 사용 현황 | **X** | Company 사용 규모 유추 방지 |

> 모든 항목 read-only. 관리 액션 없음.

---

## 8. Preferences 탭

사용자 환경 설정을 관리하는 탭. 모든 MemberType에 노출.

### 8-1. 섹션별 항목

| 섹션 | 항목 | 비고 |
| --- | --- | --- |
| Region / Language | Preferred Language | 클릭 시 전체화면 언어 선택 오버레이 열림. 변경 즉시 적용 |
| Notifications | Marketing & Promotions ON/OFF 토글 | 마케팅 수신 동의 여부. 클릭 시 알림 설정 상세 화면으로 이동 |
| App Settings | AI Studio Plug-In 토글 | MD 앱 재시작 후 적용. 웹에서 설정 저장. 클릭 시 AI Studio 설정 상세 화면으로 이동 |

> AI Studio Plug-In 상태 변경은 Marvelous Designer 앱 재시작 후 반영된다.  
> License ID는 MD Web 로그인 불가이므로 Preferences 탭 접근 없음. License ID 대상 App Settings 관리자 제어 정책은 데스크톱 앱 범위에서 별도 정의.

---

## 9. 제한 정책 요약

| 제한 항목 | 대상 | 정책 |
| --- | --- | --- |
| **MD Web 로그인** | **License ID** | **불가. 데스크톱 앱 전용 계정. MyPage 전체 접근 없음.** |
| 계정 삭제 | Academic / Indie | MyPage에서 제공하지 않음 |
| 계정 삭제 처리 위치 | Individual / Student | MD 내 처리 X — 무조건 CLO-SET으로 이동 |
| 계정 삭제 처리 위치 | Company ID (CLO-SET 통합) | MD 내 처리 X — CLO-SET으로 이동 |
| 계정 삭제 처리 위치 | Company ID (CLO-SET 미통합) | MD 내 처리 X — Contact Us로 연락 |
| Danger Zone 섹션 | Academic / Indie | 미노출 — 계정 삭제·License Admin 이동 모두 해당 없음 |
| 청구지 수정 | Company ID 계열 | MyPage에서 편집 UI 미제공. 조회만 가능. 수정은 License Account Admin > Invoice에서. MyPage에서 "License Account Admin으로 이동" 버튼 제공 |
| CLO-SET 통합 해제 | Individual / Student | 해제 CTA 미노출 |
| 유저풀 관리 | MyPage 전체 | Team Console에서만 수행 |
| Invited Projects Seat 수 조회 | 전체 | 미노출 |

---

## 10. 와이어프레임 수정 작업 목록 (MDWEB-773 선반영)

> 기준: 6-6 Student 인증 기간 & 구독 정책 확정 사항 기반.  
> 현재 버전(리뉴얼 전) MyPage에 반영될 WF 수정 항목.

| # | 탭 | 항목 | 내용 | 우선순위 |
|---|---|---|---|---|
| 1 | Account | Certification 행 — Student 만료일 표시 | `Student · 만료 YYYY.MM.DD` 형식 추가. D-30 이내 경고 배지 | P1 |
| 2 | License/Billing | Student Benefit Active 배너 신규 | 라이선스 정보 카드 내 or 상단. "3개월 무료 혜택 종료까지 D-XX" | P1 |
| 3 | License/Billing | Student Benefit Active 상태 WF | Pause for Now / Cancel Subscription CTA 미노출. Benefit 배너만 표시 | P1 |
| 4 | License/Billing | Student Monthly Active 상태 WF | Benefit 종료 후. Pause / Cancel CTA 노출. 일반 Monthly와 동일 플로우 | P1 |
| 5 | License/Billing | Student 인증 만료 임박 배너 (D-30) | 경고 배너 신규. "학생 인증이 N일 후 만료됩니다. 만료 시 구독이 종료됩니다." | P2 |
| 6 | License/Billing | Benefit 만료 임박 배너 (D-7) | 경고 배너 신규. "무료 혜택이 7일 후 종료됩니다. 이후 $8.25/월로 자동 청구됩니다." | P2 |
| 7 | License/Billing | Auto Renew 섹션 — Student Monthly | 기존 Individual Annual 전용 섹션에 Student Monthly 상태 추가 | P2 |

> **미포함 항목 (TBD 대기)**  
> - 4년 만료 후 상태 WF (옵션 A/B/C 미확정)  
> - 고등학생 인증 기간 정책 관련 WF  
> - 졸업 후 개인 플랜 전환 할인 WF

---

## 11. 업데이트 필요사항

> 기준: `member.md` 2026-06-23 계정 구조 전면 개편. MemberType 폐지 → Member / SW Account / Group 구조로 전환.  
> 이 문서 전반에 걸쳐 구 MemberType 표현이 남아 있음. 아래 표 기준으로 순차 재작성 필요.

### 11-1. MemberType → 신 계정 구조 명칭 매핑

| 구 MemberType | 신 계정 구조 | 비고 |
| --- | --- | --- |
| Individual | Member (인증 없음) | 기본 멤버 |
| Student | Member (Student 인증 완료) | 개인 레벨 Verification |
| Company ID | Group Owner (인증 없음) | Group을 보유한 Member |
| Academic | Group Owner (Academic 인증 완료) | Group 레벨 Verification |
| Indie | Group Owner (Indie 인증 완료) | Group 레벨 Verification |
| License ID | SW Account | 웹 로그인 불가 — MyPage 전체 접근 없음 (기존 정책 유지, 명칭만 변경) |

### 11-2. 섹션별 변경 필요 항목

| 섹션 | 변경 항목 | 내용 | 우선순위 |
| --- | --- | --- | --- |
| 1. MemberType 정의 | 전체 재작성 | MemberType 폐지. Member / SW Account / Group / Verification 구조로 대체 | P1 |
| 3. 탭 노출 매트릭스 | 컬럼 헤더 전체 | Individual · Student · Company ID · Academic · Indie · License ID → 신 구조 컬럼으로 교체 | P1 |
| 4. Overview | License Account Admin 이동 버튼 노출 조건 | "Company ID 계열 / Academic / Indie" → "Group Owner (인증 무관)" | P1 |
| 4. Overview | Account Summary 섹션 | "MemberType 뱃지" 표현 → 신 구조 용어로 교체 | P2 |
| 5. Account | 항목별 노출 조건 테이블 | 5개 MemberType 컬럼 → 신 구조 컬럼(Member / Group Owner 등)으로 재작성 | P1 |
| 5. Account | CLO-SET 통합 상태별 UI 분기 | "Individual / Student" / "Company ID / Academic / Indie" 그룹핑 표현 → 신 구조로 교체 | P2 |
| 5. Account | 계정 삭제 조건 주석 | License ID 관련 주석 제거. SW Account는 웹 접근 없음으로 단순화 | P2 |
| 6. License/Billing | Userpool Guest 섹션 노출 조건 | "Individual이 Enterprise Guest로 할당된 경우" → "Member가 타 Group의 SW Account 없이 Guest로 할당된 경우"로 재검토 | P2 |
| 7. Shared License | 노출 대상 MemberType 컬럼 | Individual · Student · Company ID 계열 → Member / Group Owner로 재표현. SW Account 행 제거 | P1 |
| 9. 제한 정책 요약 | 전체 항목 | "Individual / Student", "Company ID 계열", "Academic / Indie" 표현 → 신 구조 용어로 일괄 교체 | P2 |

### 11-3. 용어 일관성 교체 목록

| 현재 표현 | 교체 표현 | 적용 범위 |
| --- | --- | --- |
| `MemberType` | `계정 유형 (Account Type)` | 문서 전체 |
| `Individual` | `Member (인증 없음)` | 분기 조건 명시 시 |
| `Student` | `Member (Student 인증 완료)` | 분기 조건 명시 시 |
| `Company ID` | `Group Owner` | 분기 조건 명시 시 |
| `Academic` | `Group Owner (Academic 인증 완료)` | 분기 조건 명시 시 |
| `Indie` | `Group Owner (Indie 인증 완료)` | 분기 조건 명시 시 |
| `License ID` | `SW Account` | 문서 전체 |
| `Individual 계열` | `Member 계열` | 그룹핑 표현 시 |
| `Company ID 계열` | `Group Owner 계열` | 그룹핑 표현 시 |
