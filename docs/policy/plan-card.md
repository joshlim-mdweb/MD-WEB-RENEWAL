# PLAN CARD 정책

Source: https://clo.atlassian.net/wiki/spaces/MDT/pages/3842572289/PLAN+CARD

---

## 필드 정의

| Field | Description |
| --- | --- |
| MemberType | 플랜 카드 노출 및 버튼 동작의 1차 분기 조건 |
| Verification Status | 인증 필요 플랜(Student/Academic/Indie)의 인증 진행 단계 |
| Trial Status | Trial 사용 이력 및 현재 진행 여부. 버튼 활성 여부 보조 조건 |
| Has License | 라이선스 할당 여부 |
| Button State | 버튼 클릭 가능 여부 (활성화 / 비활성화) |
| Button Text | 버튼 CTA 문구 |

---

## CARD: INDIVIDUAL

| MemberType | Has License | Button State | Button Text |
| --- | --- | --- | --- |
| Non-Member | 없음 | 활성화 | Start Now |
| Individual | 없음 | 활성화 | Start Now |
| Student | 없음 | 비활성화 | For Student |
| CompanyID | - | 비활성화 | For Individual |
| Academic | - | 비활성화 | For Individual |
| Indie | - | 비활성화 | For Individual |
| License ID | 있음 | 활성화 | Check my Status |
| License ID | 없음 | 비활성화 | For Individual |

---

## CARD: STUDENT

| MemberType | Verification Status | Has License | Button State | Button Text |
| --- | --- | --- | --- | --- |
| Non-Member | 인증 X | 없음 | 활성화 | Get Verified |
| Individual | 인증 X | 없음 | 활성화 | Get Verified |
| Individual | 인증 대기 중 | 없음 | 비활성화 | Start Now |
| Student | 인증 완료 | 없음 | 활성화 | Start Now |
| Student | 인증 완료 | 있음 | 활성화 | Check my Status |
| Student | 재인증 필요 | - | 활성화 | Get Verified |
| CompanyID | - | - | 비활성화 | For Student |
| Academic | - | - | 비활성화 | For Student |
| Indie | - | - | 비활성화 | For Student |
| License ID | - | - | 비활성화 | For Student |

---

## CARD: ENTERPRISE (Online / Linux)

| MemberType | Has License | Button State | Button Text |
| --- | --- | --- | --- |
| Non-Member | - | 활성화 | Start Now |
| Individual | - | 비활성화 | For Enterprise |
| Student | - | 비활성화 | For Enterprise |
| CompanyID | 없음 | 활성화 | Start Now |
| Academic | 없음 | 활성화 | Start Now |
| Indie | 없음 | 활성화 | Start Now |
| License ID | 있음 | 활성화 | Check my License Status |
| License ID | 없음 | 비활성화 | Contact your Group Manager |

---

## CARD: ACADEMICS

| MemberType | Verification Status | Has License | Button State | Button Text |
| --- | --- | --- | --- | --- |
| Non-Member | - | - | 활성화 | Get Verified |
| Individual | - | - | 비활성화 | For Enterprise |
| Student | - | - | 비활성화 | For Enterprise |
| CompanyID | 인증 X | 없음 | 활성화 | Get Verified |
| CompanyID | 인증 대기 중 | 없음 | 비활성화 | Verification in process |
| Academic | 인증 완료 | 있음 | 활성화 | Start Now |
| Indie | - | - | 비활성화 | For Academic |
| License ID | - | 있음 | 활성화 | Check my License Status |
| License ID | - | 없음 | 비활성화 | Contact your Group Manager |

---

## CARD: INDIE

| MemberType | Verification Status | Has License | Button State | Button Text |
| --- | --- | --- | --- | --- |
| Non-Member | - | - | 활성화 | Get Verified |
| Individual | - | - | 비활성화 | For Enterprise |
| Student | - | - | 비활성화 | For Enterprise |
| CompanyID | 인증 X | 없음 | 활성화 | Get Verified |
| CompanyID | 인증 대기 중 | 없음 | 비활성화 | Verification in process |
| Indie | 인증 완료 | 없음 | 활성화 | Check my License Status |
| Indie | 인증 완료 | 있음 | 활성화 | Check my License Status |
| Indie | 재인증 필요 | - | 활성화 | Get Verified |
| Academic | - | - | 비활성화 | For Indie |
| License ID | - | 있음 | 활성화 | Check my License Status |
| License ID | - | 없음 | 비활성화 | Contact your Group Manager |

---

## 업데이트 필요사항

> 기준: `member.md` 2026-06-23 계정 구조 전면 개편. MemberType 폐지 → Member / SW Account / Group 구조로 전환.  
> 아래 항목을 반영해 플랜 카드 테이블 전체를 재작성해야 한다.

### 1. MemberType → 신 계정 구조 명칭 매핑

| 구 MemberType | 신 계정 구조 | 비고 |
| --- | --- | --- |
| Individual | Member (인증 없음) | 기본 멤버. Verification 없음 |
| Student | Member (Student 인증 완료) | 개인 레벨 Verification |
| CompanyID | Group Owner (인증 없음) | Group을 보유한 Member |
| Academic | Group Owner (Academic 인증 완료) | Group 레벨 Verification |
| Indie | Group Owner (Indie 인증 완료) | Group 레벨 Verification |
| License ID | SW Account | 웹 로그인 불가 — 플랜 카드 접근 자체 없음 |

### 2. 카드별 변경 필요 항목

| 카드 | 변경 항목 | 내용 |
| --- | --- | --- |
| INDIVIDUAL | MemberType 컬럼 전체 | 구 명칭 → 신 명칭으로 교체. SW Account 행은 "웹 접근 불가" 주석 처리 |
| STUDENT | MemberType 컬럼 전체 | 구 명칭 → 신 명칭으로 교체 |
| STUDENT | Benefit Active 상태 행 신규 추가 | Member (Student 인증 완료) + Has License + Benefit 중: `Check my Status` (현재 정의 없음) |
| ENTERPRISE | MemberType 컬럼 전체 | CompanyID → Group Owner. SW Account 행 재검토 (웹 접근 불가) |
| ACADEMICS | MemberType 컬럼 전체 | CompanyID → Group Owner 교체. Verification 상태 컬럼 그대로 유지 |
| INDIE | MemberType 컬럼 전체 | CompanyID → Group Owner 교체. Verification 상태 컬럼 그대로 유지 |

### 3. 신규 분기 추가 필요

| 항목 | 내용 | 우선순위 |
| --- | --- | --- |
| SW Account 전체 카드 처리 방침 | SW Account는 웹 로그인 불가이므로 플랜 카드 진입 자체 없음. 각 카드에서 행 제거 or 주석 처리 | P1 |
| Student Benefit Active 상태 버튼 | 3개월 무료 혜택 중인 Member(Student 인증)의 버튼 텍스트·상태 미정의 | P1 |
| Member (인증 없음) → Student 카드 | `인증 대기 중` 상태 처리 방식 (현재 Individual 기준 정의, 신 구조로 동일 적용 여부 확인) | P2 |
| Group Owner 인증 대기 중 → Academic/Indie 카드 | `Verification in process` 상태는 Group Owner(인증 없음)로 재표현 | P2 |
