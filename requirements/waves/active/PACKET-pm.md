[착수 패킷 · pm · 1차 웨이브] Plan Page Renewal

## 스코프
- 피처: Plan Page Renewal
- 대상 화면/플로우: Plan Page 전체 (STRUCTURE 1개 프레임)
- Jira: 없음 (추후 부여 예정)

## 섹션 구성
Plan 페이지는 3개 섹션으로 구성된다.

**① Individual Plans**
- Individual (Monthly $39 / Annual $280 Subscription)
- Individual Student (Monthly $8.25 + 3개월 Benefit)

**② Organization**
- Enterprise Single ($199/mo) + Enterprise Team ($2,000/yr)
- Academics ($1,500/Seat/yr)
- Indie 배너 (Enterprise 섹션 내 통합 — 별도 카드 없음)

**③ Linux Environment**
- Enterprise Linux ($2,300/yr, Annual only, Organization 전용)
- 정책 신규 정의 필요 (plan.md에 미등재)

## 입력 참조
- 정책: docs/policy/plan.md
- 정책: docs/policy/plan-card.md
- Slack canvas: Marvelous Designer Plan Renew (F0BCBS8G88N)
  - 주요 변경사항: Individual Annual Prepaid→Subscription, Student Monthly+Benefit, Enterprise 명칭 변경, Indie 배너 통합

## 작업 지시

### 1. 페이지 IA 정의
- 3개 섹션(Individual / Organization / Linux) 배치 순서 및 구분 방식 정의
- 섹션별 헤더, 카드 나열 방식 (가로 배치 vs 그리드 등) 명시
- Billing Toggle(Annual/Monthly)의 위치: 페이지 상단 전체 토글 vs 섹션별 토글

### 2. 플랜 카드 스펙 정의 (카드별)
각 플랜 카드에 표시할 정보를 명세한다:
- 플랜명, 가격, 과금 주기, 라이선스 유형
- 주요 특징/혜택 (Feature list)
- CTA 버튼 텍스트 및 상태

**카드 목록:**
- Individual (Monthly / Annual)
- Individual Student
- Enterprise Single / Enterprise Team
- Academics
- Linux Enterprise
- Indie 배너 (카드 아님 — 배너 형태로 표시)

### 3. 버튼 로직 재정의 (plan-card.md 업데이트)
plan-card.md의 MemberType → 신 계정 구조(Member/Group Owner/SW Account)로 전환.

각 카드에 대해 아래 케이스를 정의한다:
- **Member (인증 없음)** — 구 Individual
- **Member (Student 인증 완료)** — 구 Student
- **Member (Student 인증 대기 중)** — 신규 상태
- **Member (Student Benefit Active)** — 신규 상태 (버튼 미정의 → 이번에 정의)
- **Group Owner (인증 없음)** — 구 CompanyID
- **Group Owner (Academic 인증 완료)** — 구 Academic
- **Group Owner (Academic 인증 대기 중)** — Verification in process 상태
- **Group Owner (Indie 인증 완료)** — 구 Indie
- **Group Owner (Indie 인증 대기 중)** — Verification in process 상태
- **SW Account** — 웹 로그인 불가 → 플랜 카드 접근 없음 (각 카드에서 행 제거)
- **비로그인(Non-Member)** — 모든 카드에 표시

버튼 상태: 활성화 | 비활성화
버튼 텍스트: Start Now / Get Verified / Check my Status / Check my License Status / Verification in process / For Individual / For Student / For Enterprise / Contact your Group Manager 등

### 4. Billing Toggle 정책 정의
- Individual 플랜에만 적용 (Monthly / Annual 선택)
- Enterprise 섹션: Enterprise Single(Monthly) + Enterprise Team(Annual) — 토글 없음, 별도 카드
- Toggle 위치: 페이지 상단 vs Individual 섹션 상단 결정 필요
- Default: Annual 선택 (plan.md 기준)
- Trial 진입 시 선택한 플랜(Monthly/Annual) 기억 여부

### 5. Indie 배너 정의
- 위치: Organization 섹션 내 Enterprise 카드 하단 또는 섹션 하단
- 표시 조건: 모든 사용자에게 표시 (로그인 여부 무관)
- 버튼 CTA 및 클릭 동작 (Get Verified → 인증 신청 플로우)
- 배너 형태: 카드보다 얇은 가로형 배너

### 6. Linux 플랜 카드 신규 정의
- 플랜명: Enterprise Linux
- 가격: $2,300/yr
- 과금: Annual only (Monthly 없음)
- 대상: Organization (Group Owner) 전용
- 버튼 로직: Group Owner 기준 정의 필요 (Enterprise와 동일 여부 확인)
- Individual/Student는 이 카드에서 "For Enterprise" 표시 여부 결정

### 7. 예외·엣지케이스 정의
- 비로그인 상태에서 버튼 클릭 시: 로그인 유도 또는 직접 Checkout
- Trial 이미 사용한 Member가 Individual 카드 접근 시 버튼 처리
- Student Benefit Active 상태의 Member가 Individual 카드 접근 시
- Group Owner가 Individual/Student 카드 접근 시 (For Individual 비활성화)

## 작성 규칙
- .claude/rules/prd-writing.md (문체·구조)
- .claude/rules/ux-writing.md (UX Writing)

## 완료 조건
- End: requirements/waves/active/prd-draft.md 작성 완료
- Verification:
  - 3개 섹션 IA 정의 완료
  - 전체 플랜 카드 스펙 정의 완료
  - 신 계정 구조 기준 버튼 로직 테이블 완성 (카드별)
  - Indie 배너 정의 완료
  - Linux 플랜 카드 정의 완료
  - 예외 케이스 처리 정의 완료
- Constraints: 개발 구현·CSS·빌드 스펙 포함 금지 / 정책·UX·화면 구성만

## 이전 실수 주의
없음 (최초 wave)
