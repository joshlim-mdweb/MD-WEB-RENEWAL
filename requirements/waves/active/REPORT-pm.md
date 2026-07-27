# REPORT — pm · 1차 웨이브 · Plan Page Renewal

- 상태: 완료
- 산출물: requirements/waves/active/prd-draft.md

## 한 일
- plan.md, plan-card.md 전체 정독 및 변경사항 파악
- Slack canvas (F0BCBS8G88N) 반영: 명칭 변경, Student Benefit, Indie 배너 통합
- 3개 섹션 IA 정의 (Individual Plans / Organization / Linux Environment)
- 플랜 카드 6종 스펙 정의 (Individual Monthly/Annual, Student, Enterprise Single, Enterprise Team, Academics, Linux)
- 신 계정 구조(Member/Group Owner/SW Account) 기준 버튼 로직 테이블 전면 재정의
- Billing Toggle 정책 (Individual 섹션 한정, Annual 왼쪽 Default)
- Indie 배너 정의 (위치, 형태, 버튼 로직)
- Enterprise Linux 신규 카드 정의 ($2,300/yr, Annual only, Organization 전용)
- 예외 및 엣지케이스 8개 정의
- 미결 정책 8개 항목 목록화

## 커버 항목
- [x] Member (인증 없음) — 구 Individual
- [x] Member (Student 인증 완료) — 구 Student
- [x] Member (Student 인증 대기 중) — 신규 상태
- [x] Member (Student Benefit Active) — 버튼 신규 정의
- [x] Group Owner (인증 없음) — 구 CompanyID
- [x] Group Owner (Academic 인증 완료)
- [x] Group Owner (Academic 인증 대기 중)
- [x] Group Owner (Indie 인증 완료)
- [x] Group Owner (Indie 인증 대기 중)
- [x] SW Account — 웹 로그인 불가, 카드 행 제거
- [x] 비로그인 (Non-Member)
- [x] Indie 배너 버튼 로직
- [x] 예외 케이스 8개

## 오케스트레이터 이월
1. Enterprise Linux 동시접속 수 (A1) — plan.md 미등재, BD/정책팀 확인 필요
2. Student 4년 초과 버튼 처리 (A2) — 정책 미결. 임시: 비활성화 + 안내 문구
3. Indie 배너 위치 (카드 행 하단 vs 섹션 하단) — design 단계 확정 권장

## 실수노트
없음 (최초 wave)
