# POLICY_MYPAGE

Source: https://clo.atlassian.net/wiki/spaces/MDT/pages/3851354161/POLICY_MYPAGE

---

## 1. Account Type 정의

| Account Type | 정의 |
| --- | --- |
| Personal | 개인 사용자 계정 |
| Company ID | 기업 계정 (관리자 단위) |
| License ID | Company ID 소속 라이선스 사용자 계정 |

> License ID는 Company ID의 Member를 대체하는 유일한 계정 타입.

---

## 2. 분기 축

| 분기 축 | 값 |
| --- | --- |
| Account Type | Personal / Company ID / License ID |
| CLO-SET 통합 여부 | Integrated / Not integrated |

> Company ID 내부 Role(Admin/Member)은 MY Page 정책에서 사용하지 않음. Member는 항상 License ID로 표현.

---

## 3. 기능 매트릭스

| 기능 | Personal | Company ID | License ID |
| --- | --- | --- | --- |
| 계정 정보 조회 | O | O | O |
| 청구지 주소 변경 | O | O | X |
| CLO-SET 통합 상태 확인 | O | O | O |
| CLO-SET 통합 해제 | X | O | X |
| 계정 삭제 | O | X | X |
| License Admin 이동 | X | O | X |

---

## 4. CLO-SET 통합 여부 기반 UI 분기

| Account Type | Not integrated | Integrated |
| --- | --- | --- |
| Personal | CLO-SET UI 없음 | 연동 정보 조회만 |
| Company ID | CLO-SET UI 없음 | 연동 정보 + 통합 해제 |
| License ID | CLO-SET UI 없음 | 연동 정보 조회만 |

---

## 5. License ID 취급 원칙

| 항목 | 정책 |
| --- | --- |
| 계정 성격 | 조회 전용 |
| 결제/청구 정보 | 접근 불가 |
| 통합 관리 | 직접 관리 불가 |
| 관리 액션 | 제공하지 않음 |

> 모든 관리 책임은 Company ID에 귀속.

---

## 6. 제한 정책

| 제한 항목 | 대상 | 정책 |
| --- | --- | --- |
| 계정 삭제 | Company ID / License ID | MY Page에서 제공하지 않음 |
| 청구지 수정 | License ID | 편집 UI 미노출 |
| 통합 해제 | Personal / License ID | 해제 CTA 미노출 |
| License 운영 | MY Page 전체 | Admin 영역에서만 수행 |

---

## 7. 자격 인증 상태 노출 정책

### Account Type × 자격 인증

| Account Type | 적용 가능한 자격 |
| --- | --- |
| Personal | Student |
| Company ID | Academic, Indie |
| License ID | Academic, Indie |

### 상태 표현

| 상태 | 표시 |
| --- | --- |
| 승인 중 | `In process` |
| 거절 | `Rejected` |
| 승인됨 | `Student` / `Academics` / `Indie` |

노출 위치: Account 정보 영역
