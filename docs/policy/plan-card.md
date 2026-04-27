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

## CARD: PERSONAL

| MemberType | Has License | Button State | Button Text |
| --- | --- | --- | --- |
| Non-Member | 없음 | 활성화 | Start Now |
| Personal | 없음 | 활성화 | Start Now |
| Student | 없음 | 비활성화 | For Student |
| CompanyID | - | 비활성화 | For Personal |
| Academic | - | 비활성화 | For Personal |
| Indie | - | 비활성화 | For Personal |
| License ID | 있음 | 활성화 | Check my Status |
| License ID | 없음 | 비활성화 | For Personal |

---

## CARD: STUDENT

| MemberType | Verification Status | Has License | Button State | Button Text |
| --- | --- | --- | --- | --- |
| Non-Member | 인증 X | 없음 | 활성화 | Get Verified |
| Personal | 인증 X | 없음 | 활성화 | Get Verified |
| Personal | 인증 대기 중 | 없음 | 비활성화 | Start Now |
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
| Personal | - | 비활성화 | For Enterprise |
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
| Personal | - | - | 비활성화 | For Enterprise |
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
| Personal | - | - | 비활성화 | For Enterprise |
| Student | - | - | 비활성화 | For Enterprise |
| CompanyID | 인증 X | 없음 | 활성화 | Get Verified |
| CompanyID | 인증 대기 중 | 없음 | 비활성화 | Verification in process |
| Indie | 인증 완료 | 없음 | 활성화 | Check my License Status |
| Indie | 인증 완료 | 있음 | 활성화 | Check my License Status |
| Indie | 재인증 필요 | - | 활성화 | Get Verified |
| Academic | - | - | 비활성화 | For Indie |
| License ID | - | 있음 | 활성화 | Check my License Status |
| License ID | - | 없음 | 비활성화 | Contact your Group Manager |
