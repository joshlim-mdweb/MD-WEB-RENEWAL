---
project: maintenance
updated: 2026-06-22
---

## 관련 Jira 티켓
- MDWEB-625 — Maintenance (Epic, 활성)
- MDWEB-831 — Site | 3DS 인증 요구로 인한 Suspended — 인증 링크 이메일 발송 및 My Page 노출 (새 항목)
- MDWEB-832 — Site | License ID 삭제 불가 — 조건별 툴팁 노출 (새 항목)
  - MDWEB-834 — [FE] 삭제 버튼 disabled 상태 hover 툴팁 구현
  - MDWEB-835 — [PD] 삭제 버튼 disabled + 툴팁 UX 디자인
- MDWEB-833 — Site | License ID 생성 모달 — 드래그 중 모달 외부 mouseup 시 강제 닫힘 (새 항목)
  - MDWEB-836 — [FE] outside click 닫힘 동작 제거
- MDWEB-755 — Site | 기업 월간 구독 실패시 Suspended 상태로 남는 오류 개선 (종료)
- MDWEB-560 — [구독 일시중지] Suspend 상태 및 기획 추가 (종료)

## TODO
1. MDWEB-835 (PD) — License ID 삭제 버튼 disabled + 툴팁 UX 디자인 착수
2. MDWEB-831 작업 착수 — 디자인: Suspended 이메일 템플릿(3DS 인증 링크 포함) + My Page 모달 설계
3. MDWEB-831 개발 범위 확인 — Stripe 3DS 취소 이벤트 처리 + 이메일 트리거 + My Page 모달 노출 조건

## 컨텍스트
- 슬랙 스레드 (CEV7QB151): 기업 계정 유저가 Zendesk 2회에 걸쳐 온보딩/라이선스 관리 전반 pain point 제출
- MDWEB-832: 삭제 불가 조건(라이선스 할당 / CLO-SET 연동)을 툴팁으로 안내 — 현재는 이유 안내 없이 버튼만 비활성화
- MDWEB-833: 모달 입력 중 드래그로 커서가 밖에 나간 상태에서 mouseup → 모달 강제 닫힘 + 입력 소실. outside click dismiss 제거로 해결
- 라이선스 구조 개편(이메일 중복 허용, License ID 삭제 가능 등) 논의는 Reo Jeon이 Userpool 기반 개선 방향 제안 → Jay Lee가 "다음 스프린트"로 보류
- MDWEB-831 컨텍스트: 구독 갱신 중 카드사 3DS 인증 요구 → Stripe 결제 실패 → MD 상태 Suspended 잔존 → 유저 인증 방법 없음

## 완료 로그
### 2026-06-22
- 슬랙 스레드(CEV7QB151) 분석 — 기업 계정 온보딩/라이선스 버그 피드백 정리
- MDWEB-832 생성 — License ID 삭제 불가 툴팁 Improvement
- MDWEB-833 생성 — 모달 강제 닫힘 Bug
- MDWEB-834, 835 생성 — MDWEB-832 하위 Sub-Task (FE, PD)
- MDWEB-836 생성 — MDWEB-833 하위 Sub-Task (FE)

### 2026-06-18
- 슬랙 스레드 분석 및 관련 Jira 티켓 조회 (MDWEB-755, MDWEB-560)
- MDWEB-831 생성 — MDWEB-625 (Maintenance) 하위 Improvement(MD) 티켓
