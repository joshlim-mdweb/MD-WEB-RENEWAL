---
project: checkout-renewal
updated: 2026-09-01
---

## 관련 Jira 티켓
- MDWEB-870 — 결제 페이지 & 흐름 (진행중, `requirements/board/TODO.md` T-01)
- MDWEB-916 — BE 개인 연간 구독 상품 (읽기 전용 참조)

## TODO

### ★ 최우선 — 원장 반영 (Figma 축은 F-19만 남음)

**2026-09-01 — Josh가 F-02~F-18을 일괄 완료 처리했다.** Step 2 Description 작업(Team New 노트 검수, Add/Extend 패널, Components 3프레임, SEATS, Individual Monthly, 케이스 매트릭스, Order Summary 이관)은 전부 닫혔다. 남은 Figma 행은 **F-19 Checkout Organization 4프레임 2컬럼 전환**(검토대기) 하나다.

1. **F-19 후속** — 2컬럼 전환에 따른 Description 개정(재계산 트리거 통합, CTA 활성 조건, 약관 체크박스) + Individual 4프레임 적용. Josh 리뷰 후 착수
2. 미도출 프레임 2종: **Single→Team Convert**, **Individual 재구매(잔여 안내)** — Josh 선정 대기

### 원장 반영 배정 (Policy Writer, Planner가 T- 행 생성)
5. `checkout.md` 일괄 정리 — ①Indie 웹 판매 제외(§0, §1, §6, §9, §10, §12) ②§9 "만료된 라이선스만 보유" 행 삭제 (만료 = 빈 계정, 상태 자체가 없음 — 08-24 Josh 확정) ③§9를 판정 모델에서 **Purchase Type 필터 모델**로 재작성 (Step 1 화면 확정 구조) ④CTA 명칭 `[다음]` → `Set Order` 정합
6. `plan.md` — Academic 단가 **$300/Seat + 10석 구매 시 50% 할인** (08-24 확정, 현행 $1,500는 개정 대상) / Indie 웹 판매 제외 / plan-card.md Indie 행 재정의(Start 클릭 시 Create Organization + Indie verification 리다이렉트)
7. 게시본 Canvas 갱신 (원장 반영 후) — Order/Checkout `F0BL0SRE4TZ` Indie 행, Academic 가격

### 대기·예고
8. **사용자 플로우 차트** — Josh 예고 (진입점 섹션 구조 기반)
9. Manager 일괄 보고 발송됨(08-25) — TODO.md 반영은 Manager 몫, 확인만
10. Page Context 추출 문서/표 만들기 — Josh 예고 (각 프레임 Page Context는 삭제 금지)

### 살아있는 플래그 (결정·정책 확인 대기)
- Step 1 목록: 다중 Organization 조회 기준 / Reserved, Suspended, Perpetual 라이선스 보유 계정 포함 기준 / 탭 전환 시 선택 유지 여부 / 기본 선택 도입 시 "Select a Purchase type" 안내 문구
- 교차 플랜: Single→Team Linux 전환 제공 여부 / Team(Win/Mac)↔Linux 병존 기준 (product group 분리)
- 금액: 연장분 Seat 수가 추가분 포함인지 / Coupon "최초 구매" 판정 기준 / Trial 경유 Coupon / Trial $0 세금 행 / Trial CTA 문구 / Student 재구매 잔여 안내의 "동일 계열" 범위
- Tax ID 무효 처리 (BE 확인, D-1)

## 컨텍스트

### 화면 체계 (2026-08-23~25 확립)
- **진입점 기준 섹션**: 플랜별 행 세로 나열, 각 행의 프레임들 가로 나열. Indie는 웹 판매 제외(백오더 전용, 가격 미노출, Start 클릭 → Create Organization + Indie verification 리다이렉트만)
- **Select SW Account 섹션(`7322:4767`)** — 완비: Team 원장 `7319:4177`(근간) / Single `7782:28531`(카드 없음 + Team 전환 프로모 배너 "Save $388 per Seat with Enterprise Team.") / Academics `7798:1436` / Team Linux `7855:1453` + 상태 프레임 3장(`7319:3969` 전환 대상 선택, `7322:4777` 빈 계정 선택, `7319:4374` Add/Extend 탭)
- **Step 1 화면 모델 = Purchase Type 탭 필터** (판정 표시 아님): Assign 탭 = 빈 계정 + 활성 Single 보유 계정(전환 대상, Team 진입만) / Add·Extend 탭 = 해당 플랜 활성 계정만. 원장 §9 재작성 필요 (TODO 5)
- **Checkout_Organization(`7793:2634`)**: Team New `7172:3150` / Team Add/Extend `7905:5757`(완성 — Add Seats·Extend by 칩 + Sub Total 분해 박스) / Single `7782:28043` / Academics `7793:2008` + 50% 할인 적용 `7793:2454`
- **Checkout_Individual(`7854:1641`)**: Trial `7782:28345` / Monthly `7793:1366` / Annual `7892:2882` / Student Benefit `7793:1681` / Student 유료 `7875:2476` — 이름 꼬임 정리 완료
- **케이스별 노출 매트릭스 Spec Doc 2장**: Individual `7876:1479` / Organization `7876:1897` — 케이스=행, 차이 나는 컴포넌트만 열, 공통은 각주, O/X + 괄호 부연

### Description 컨벤션 (전 프레임 공통, 08-24 확정)
- **Page Context는 무번호** (배지 제거), 넘버링은 다음 노트부터 ①. 노트 제목은 요소명만 담백하게 — (신규 기능) 류 괄호 표기 금지
- **파생 프레임은 근간(Enterprise Team) 참조**: "Enterprise Team과 동일" + `차이:` 블록만. 단 화면 구조가 다른 파생(Single)은 동일 선언 없이 독립 전문
- 탭별 노출 기준은 테이블 노트 단일 소관 (중복 기재 금지). 상태 프레임은 액션 중심: Page Context(상태 선언) + 트리거 노트 + Set Order(상황별 문구·버튼 상태 상세, "컨텍스트 전달" 류 추상 표현 금지)
- **한글 fallback 함정**: 플러그인으로 characters를 쓰면 export에서 한글 미렌더 — 한글 범위에 Noto Sans KR 명시 적용 + scale-1 검증 필수 (mistakes.md 08-23)

### 신규 확정 (08-23~25, 원장 미반영 — TODO 5~7)
- Purchase Type 값 3종: **New / Add/Extend / Convert** (Add와 Extend 통합). Organization 프레임 전부에 "Purchase Type" 라벨+값을 Product 위에 표기 (컨벤션 통일 완료)
- Academic 단가 **$300/Seat, 10석 구매 시 50% 할인**
- **Coupon과 Billing Address는 보유 목록 선택형, 클릭 시 입력 모달**
- Payment Methods는 화면에 3종(Stripe, Paypal, Alipay) 전시 유지 — 국가 분기는 Description에서 기술
- "만료된 라이선스 보유 계정" 상태 없음 (만료 = 빈 계정)
- Seat 프리셋 5/10/20/Custom (1 제거), Enterprise Single은 프리셋 없음
- Team New의 Seats 카드에 계산 박스 도입 (Seats 산식 행 + Subtotal, Order Summary의 Subtotal과 동일 값)

### 스테일 주의
- 구 "SW Account 배정 드롭다운" 확정 문구(08-11) — Step 1이 목록 테이블 방식으로 바뀌어 **드롭다운 자체가 사라짐**. 문구 재사용 금지
- `requirements/board/TODO.md`의 F-01 30프레임 표 — 진입점 섹션 체계로 사실상 대체 진행 중. Manager 반영 대기

### Figma — 활성 위치
파일 `PeCid7uJcg0HenViaaiHUp`, page `Order/Checkout (In progress🔥)` (page-id 237:3132)
- Spec Doc 15장: `Scope`(`7148:2061`) · `Docs`(`7148:2062`) 섹션 — 좌표·목록은 이전 로그 참조. 신규 2장: 케이스별 노출 (Individual `7876:1479` x8446, Organization `7876:1897` x10506, y2730)
- Add/Extend 계산 로직 비교 다이어그램 `7910:1543` (참고용 — Josh 판단 후 삭제 가능)
- Add/Extend Seats 카드 단독 시안 `7907:6002`

## 완료 로그
### 2026-09-01
- **F-02~F-18 16행 완료 처리** (Josh 일괄 지시) — Figma 축 `검토대기` 적체 해소. F-04·F-05는 기존 완료 표기 유지, F-19는 지시 범위 밖이라 `검토대기` 유지
- 결정 대기 표에 **D-22**(프로필 이미지 파일 크기 상한), **D-23**(Preferred Language 모달 안내 문구) 추가 — MyPage 건이나 결정 추적은 같은 보드에서 한다

### 2026-08-25 (세션 08-23~25 일괄)
- **Checkout 엣지 케이스 스윕** — E-01~E-29 카탈로그 (스코프: 진입 성공 후), 진입점 기준 재정렬, 케이스별 노출 매트릭스 Spec Doc 2장 (케이스=행, O/X 표기)
- **Select SW Account 섹션 완성** — Single(배너 $388 확정), Academics, Team Linux 행 신설(파생 참조 스타일), Team 원장 테이블 노트 신설(탭 중심), 상태 프레임 3장 Description + 배지, Page Context 무번호화 일괄, 폐지 용어(License ID) 헤더 정정
- **Checkout Step 2** — 프리셋 5/10/20 일괄 변경(선택 상태 유지), Purchase Type 표기 란 5개 프레임 추가, Team Add/Extend 프레임 완성(Add Seats·Extend by 칩 + Sub Total 분해 박스 + 레이아웃 성장 처리), Tax ID 플레이스홀더 정정, Individual 축 프레임 이름 꼬임 정리, Team New Description ② 재작성
- **신규 정책 접수** — Indie 웹 판매 제외(백오더), Academic $300 + 10석 50% 할인, Coupon/Address 선택형+모달, Purchase Type 3종, 만료 보유 상태 없음
- **한글 fallback 결함 발견·수리** — Single/Academics 노트 전체 미렌더를 Noto Sans KR 명시 적용으로 복구, 재발 방지 규칙화 (mistakes 08-23)
- 컨벤션 확정: 파생 Description 참조 스타일, Page Context 무번호, 노트 제목 담백, 케이스 매트릭스 레이아웃 — 전부 메모리 저장

### 2026-08-21 — "Organization Team 1: Select License ID" 화면 Description 재작성 (`7319:4177`)

- **화면 배지 5개 신규 배치** — `7319:4185` Screen(`layoutMode: NONE`)에 Annotation Badge(`7319:4714`)를 clone해 최상단 z-order로 추가. Auto Layout 프레임이어도 `NONE`이면 append가 순수 추가라 기존 레이아웃을 안 건드린다는 것 확인
- **③ "신규 SW Account 생성" 노트 재작성** — 실제 모달 스크린샷 대조 결과, User ID가 자동생성 read-only 값이 아니라 **placeholder**였음(오류 정정). 필드별(User ID/Nickname/Password/Confirm password) 하위 불릿 분리, 비밀번호 유효성은 `auth.md` §5 참조로 축약. **"Assign to this account" 체크박스 → 체크 시 Checkout 즉시 이동** 케이스 분기 신규 추가
- **신규 노트 "라이선스 적용 미리보기 안내" 추가** (`7584:2`, 배지 5번) — SW Account 미선택 시 노출되는 안내 영역, 케이스 3종(신규 할당/전환/Seat 추가·기간연장) 미리보기 문구. 이 삽입으로 뒤 노트가 5→6번으로 밀려 "Set Order" 노트(`7572:1404`) 배지·본문 재정렬
- **② "Purchase Type 선택 카드" 기본값 변경** (`7319:4719`) — "Assign to a new Software Account" 카드를 Default 선택 상태로 확정. `*(정책 확인 필요 — 기본 선택 도입으로 "Select a Purchase type" 안내 문구가 더 이상 노출되지 않는지)*` 플래그 남김
- 세션 중 라이팅 절대 규칙 2건 신규 확정 (전역 적용, `.claude/rules/` 미반영 — 새 산출물에만 적용 중): 가운데 점(·) 나열 금지 → 쉼표로 대체 / 동적 치환 문구는 `{변수명}` 인라인 + `{변수명} = 정의` 줄 형식
- 잔여 플래그: `*(문구 필요 — 최종 EN 확정 전 임시값, T-01-3 참조)*` (Set Order 버튼), 위 Purchase Type 기본값 정책 확인 필요 1건

### 2026-08-13 — 판정 → 구매 타입 → Seat 컨트롤 사슬 보강

**끊긴 원인**: `Extend`가 두 계층을 동시에 가리켰다. 판정값으로도 Extend, 사용자 액션으로도 Extend. 그래서 Seat UI 분기 서술은 있는데(`design-spec.md` §3.2) 트리거가 **판정이 아니라 진입 경로**에 걸려 있었고, 둘을 잇는 문장을 쓰면 순환 정의가 됐다.

- **어휘를 두 계층으로 분리 (Josh 확정)** — 판정 = `신규 할당` · `기존 라이선스 있음` (시스템) / 액션 = `Seat 추가` · `기간 연장` · `Team 전환` (사용자). `New` · `Extend` · `Add`를 판정·액션 어디에도 쓰지 않는다
- **Enterprise Single도 SW Account UI 노출 확정 (Josh)** — 판정값만 있고 판정을 받을 UI가 없던 상태를 해소. Seat만 1 고정
- **신규 카드 `Checkout Flow & Case — 구매 타입`** (`7276:55`, PT-01~PT-14) — 판정 → 액션 → Seat 컨트롤 · 금액 · 만료일 전수
- **`design-spec.md` §3.2 "Extend = Seat 변경 불가" 폐기 결정** — `checkout.md` §11에 "둘을 동시에" 금액식이 이미 있어 §3.2가 틀린 쪽이다. Single → Team은 `Team 전환` 액션으로 분리해 Seat 재지정을 정상 동작으로 만들었다
- **진입 경로의 역할 확정** — 액션의 초기 선택값만 정한다. 판정은 언제나 계정 상태가 하고, 둘이 어긋나면 판정을 우선한다 (PT-13 · PT-14)
- 재작성 6장: Scope `7275:55` · SW Account 판정 `7275:504`(N-18 신설) · Feature Spec Ent Single `7277:55` · Ent Team `7277:163` · Ent Team Linux `7277:278` · Academic `7278:55` · Indie `7278:170`
- 15장 전체를 `Scope` · `Docs` 섹션 4열 그리드로 정렬

**발견한 문서 결함 (T-01-4로 이관)** — `checkout.md` §9 판정표가 2행뿐이라 **만료된 라이선스 → 신규 할당** 케이스와 **Indie 신규 할당 고정** 예외가 빠져 있다. 후자는 §12 "Indie 기간 연장 불가"와 문서 내부 모순이다.

### 2026-08-11 (4) — 미결 4건 전건 해소 (Josh)
- **Single → Team 전환 = 결제 즉시.** 만료일 = 기존 만료일 + 1년. **기존 Single의 잔여 기간은 환불하지 않는다** → Flow `EP5` · `EP6`
- **Seat 배정 = 선택한 SW Account 1개에 구매 Seat 전체.** Seat 프리셋(1/5/10/Custom)이 곧 그 수량이다. **미배정 Seat는 남지 않는다** → `design-spec.md` G24 "Seat>1일 때 SW Account 지정 미정의"는 **잘못 세운 문제**였다. Flow `N-16` · `N-17`
- **Student Benefit = $0.00 표시** ("Trial" 표기 금지 유지) → Flow `TR-06` · `TR-07`
- **Tax ID 입력란 = 청구지가 EU 국가일 때만 노출** → Flow `세액계산 06`, Scope 플랜별 분기에 `Tax ID 입력란` 행 추가
- 남은 미결 1건: **Tax ID 무효 시 처리** — BE에 검증 API 유무와 응답 시점 확인 필요 (Flow `T-08`)
- Spec Doc 6장 재작성: Scope `7149:38` · FS Enterprise Single `7149:480` · Flow 진입 경로 `7149:581` · SW Account 판정 `7150:38` · 세금 `7150:122` · Trial `7150:269`

### 2026-08-11 (3) — 결정 3건 (Josh)
- **Single → Team 전환 진입 = Checkout · Team Console 양쪽.** Team Console 화면과 Plan 페이지 화면은 이 스코프에서 그리지 않는다 (진입점으로만 참조)
- **SW Account를 먼저 지정하고 Seat를 지정한다.** 계정이 정해져야 New · Extend가 판정되기 때문. SW Account 미선택 상태에서는 Seat 단계를 노출하지 않는다
- **미결 처리 방식 확정** — 정해지지 않았다고 멈추지 않는다. `*(정책 필요 — 무엇이 없는지)*` / `*(결정 필요 — 무엇 중에 고르는지)*`로 **무엇이 필요한지까지 써서** 이어 그리고, 다 그린 뒤에 묻는다. `figma-spec-card.md` §6.1로 규칙화
- Spec Doc 4장 재작성 — Scope `7146:38` · Feature Spec Enterprise Single `7146:454` · Flow & Case 진입 경로 `7147:38` (EP5 신설) · SW Account 판정 `7147:185` (N-15 순서 · N-16 미배정 Seat)
- `board/TODO.md` D-1~D-4 재정의 + T-01-2 보류 해제. **남은 블로커는 EN 문구 세트(T-01-3) 하나**

### 2026-08-11 (2) — 기획 문서 Spec Doc 체계 확립
- **`.claude/rules/figma-spec-card.md` 신설** — 기획 문서를 Figma에 표로 그리는 규격. 프레임 1920 × 1020 고정(높이만 확장), padding 64, 문서 제목 32 / 표 제목 20 / 본문 14, `buildSpecDoc()` 헬퍼. CLAUDE.md Rules 표 등록
- **그릴 것 vs 전달만 할 것 판단 기준(§0.1) 신설** — 반복해서 읽는 문서만 그린다. 작업 지시서·미결 목록은 그리지 않고 `board/TODO.md`가 관리
- **문서 3종 체계 확정** — Scope(범위) → Feature Spec(시나리오별 기능) → Flow & Case(조건 분기). 분할 축은 Feature Spec = 시나리오, Flow & Case = 주제
- Figma에 14장 생성. 구 1000폭 기능명세 표 7장 삭제
- 케이스 표를 전부 `코드 / 조건 / 처리 / 화면` 4열로 정규화 — 원본이 표마다 컬럼이 달라 대조가 안 되던 것을 통일. `화면` 열이 WF 프레임을 가리켜 Flow & Case ↔ WF가 코드로 이어진다
- **WF 구조 7-Row 재확정 (Josh)** — 08-07 "플랜별 개별 WF"와 `screen-list.md` 20프레임(CASE VIEW 6 포함)을 모두 대체
- `checkout-policy-wave.md` L111 "작은 프레임 16" 오집계 발견 → 실제 18 (3+4+2+0+0+3+6). 총 28프레임

### 2026-08-11
- Enterprise Checkout **SW Account 배정 드롭다운 문구 확정 (EN)** — Label / Placeholder / Helper / Empty 4종 (★ 08-25 스테일 처리 — Step 1이 목록 테이블 방식으로 전환되며 드롭다운 소멸)
- 드롭다운 단위를 **구매 전체 1개**로 결정 (Seat당 1개·멀티 선택 안 씀)
- 정책 충돌 가능성 2건 발견 → TODO 6·7 등록 (SW Account 선택 주체 · 미배정 Seat 처리)

### 2026-08-07
- `/checkout` 세션 마감 — TODO·컨텍스트 전체 재정리. 구 CASE VIEW 파일(`NYShAqeBVSmpQYdk3HgPwN`) 접근 안 되는 것 발견
- **CASE VIEW 방식 폐기 확정 (Josh)** — 여러 플랜을 한 프레임에 케이스 분기로 나열하는 구 방식은 더 이상 쓰지 않는다. 플랜별 개별 WF(화면설계서 템플릿 + `/description` 스킬)로 완전 대체. 구 CASE VIEW 관련 TODO 8건(용어 갱신·Seat 프리셋 갱신·SW Account 판정 UI·Coupon/Discount 분리 등) 전부 폐기 — 신규 WF 작업 시 자연히 반영되므로 별도 이관 불필요

### 2026-08-06 (3) — Enterprise Team WF 1개 시안 작성
- Josh 선택: 7개 플랜 중 Enterprise Team이 신규 확정 요소(SW Account 선택+판정, Seat 프리셋, Tax ID)를 가장 많이 포함해 우선 시안으로 선정
- Screen 내용(8개 카드: Product → SW Account → Seat → Billing Address → Payment Method → Tax ID → Order Summary → 결제 진행, checkout-feature-spec.md §4-3 노출 순서)은 직접 구성
- **1차 시도 실수 → Josh 지적 후 재작업**
  - 고정 마스터 템플릿(`화면설계서`, id=`6627:7050`, 파일 내 재사용 컴포넌트) 존재를 확인하지 않고 WF 외곽(Board Header/Screen/Description)을 직접 새로 만듦 → 템플릿 클론으로 재작업. Board Header 단일 타이틀 텍스트, Description Annotation 카드(오렌지 배지 25×25 + Title Row + native bullet) 전부 템플릿 그대로 사용
  - Description 패널 내용을 자유 작문으로 채움 → `/description` 스킬(Phase 1~4: Q1~Q3 판단 → 골격 → 내용 → QA) 프로세스를 거쳐 재작성 후 반영
  - Screen 쪽 row 프레임이 기본 100px 높이를 유지해 여백 과다 발생 → `counterAxisSizingMode="AUTO"` 일괄 적용으로 수정 (1차 시도에서 발생, 최종본에 반영됨)
- 최종 프레임: `Enterprise Team 1` (`6980:2`), Screen `6980:10`, Description List `6980:12` — Screen 배지 8개 ↔ Description Numbered Note 8개 1:1 매칭, 배지 색상도 템플릿 실측값(`r:0.886, g:0.349, b:0.153`)으로 통일
- TODO: 나머지 6개 플랜(Individual/Student/Enterprise Single·Team Linux/Academic/Indie) WF는 아직 미작성 — Enterprise Team 시안 확인 후 진행. **다음 WF부터는 반드시 `화면설계서`(6627:7050) 클론 + `/description` 스킬로 시작할 것**

### 2026-08-06 (2) — 플랜별 기능명세 표 Figma 작성
- `[MD-SITE]-checkout-feature-spec.md` 표 포맷을 확정: 플랜별 개별 표, 3칸(번호/기능/설명) — Compare Plans(`6959:4144`, 이후 Josh가 삭제) 색상·셀 크기만 참조, 매트릭스 구조는 미차용
- Figma `PeCid7uJcg0HenViaaiHUp` / page `Order/Checkout (In progress🔥)`에 7개 플랜 표 생성 (배경 #0a0a0a, Poppins, border-bottom row 구분)
  - Individual `6967:21` · Student `6967:31` · Enterprise Single `6967:41` · Enterprise Team `6967:51` · Enterprise Team Linux `6967:61` · Academic `6967:71` · Indie `6967:81`
  - 각 표는 checkout.md §4~§12 + Canvas 확정 내용 기준 11~14행
- TODO: 이 표를 `checkout-feature-spec.md`에도 텍스트로 동기화할지 확인 필요 (현재 Figma에만 존재)
- **"설명" 문형 규칙 확정 (Josh, 2026-08-06)** — 사용자 행동이 있는 행은 "사용자는 [행동]을 통해 [결과]를 할 수 있다" 문형, 조건·상태성 행은 기존 declarative 문형(`~된다/~이다`) 유지. 7개 플랜 표 전체(기능·설명 컬럼) 이 기준으로 갱신 완료 — Figma 반영까지 완료
- **1차 작업 시 반올림·기본값 이탈 발견 → 수정 완료** (Josh 지적, figma-read.md §4 반올림 금지 위반)
  - 색상을 반올림해서 사용함 (`#c7c7c7`→0.78, `#ebebeb`→0.92 등) → 실측 소수값(199/255, 235/255 등)으로 교체
  - Row에 참조에 없던 `itemSpacing:16`을 추가함 → 0으로 제거 (간격은 원래 셀 `paddingRight:8`만으로 구성)
  - **Row·Header·셀 wrapper 프레임이 `createAutoLayout()` 기본값인 불투명 흰색 배경을 그대로 가진 채 방치됨** — 어두운 배경 위에 흰 줄무늬로 렌더링되는 문제 발생 → 전체 Row/Header/셀 프레임 372개 `fills=[]`로 일괄 수정
  - 수정 후 7개 프레임 전체 스크린샷으로 재검증 완료

### 2026-08-06 (1)
- Order/Checkout Canvas 최종본(`F0BL0SRE4TZ`, KR+EN 전문) 확인 후 `docs/policy/checkout.md`에 반영
  - 신규 섹션 추가: §4 Trial · §5 Coupon·Discount · §9 SW Account · §10 Seat · §11 Seat 추가/기간연장/Single→Team 전환 · §12 Organization Type
  - 기존 §5→§7 Tax/VAT 재번호, §6→§8 Billing Address 재번호, §7→§13 상태복원, §8→§14 CTA
  - §7.2에 VAT 노출 범위(Organization Enterprise·Indie 한정) 반영 + 정책 확인 필요 플래그 2건 유지(EU 한정 여부, Tax ID 무효 처리)
- 기획 착수 전 결정 4건 중 3건 해소 확인 (결제 수단 지역 분기 / Trial 결제 경로 — Canvas로 확정. Student Benefit 버튼은 Plan Card 스코프라 잔존)
- Figma WF 미반영 항목 3건 신규 등록 (TODO 9·10·11·12) — Seat 프리셋 값 불일치, SW Account 판정 UI 부재, Coupon/Discount 분리 부재, Seat 추가·연장 플로우 부재

### 2026-08-04
- plan-renewal 세션에서 Checkout 관련 결정 3건 이월 (결제 수단 지역 분기 / Trial 진입 경로 / Student Benefit 버튼)
- 정책 파일 6개 용어 전환 완료 — Checkout WF가 참조할 기준을 컨텍스트에 정리
- 기존 CASE VIEW 프레임의 구 용어(License ID, CompanyID) 갱신 필요 항목을 TODO 8번으로 등록

### 2026-06-09
- 3개 CASE VIEW 프레임 생성 완료 (Card1, Card2, OrderSummary)
- Annotation badge 25×25 circle로 수정 (이전: squished 형태)
- 실제 FEATURE 프레임(Annual 1) 측정값 기반으로 컴포넌트 전체 재건
  - DS spec 기본값(58px label, 14px label font) → 실측값(80px, 12px)으로 교체
  - Billing toggle card: 263×69 FIXED 실측 적용
  - OrderSummary: pad:12, gap:8, inner 542px, label col 379px 실측 적용

---

## 코드 명칭 대응 (2026-08-25)

Flow & Case 코드는 전체 명칭으로 쓴다 (`CLAUDE.md` Mandatory Rules 8항). 대응표는 `requirements/board/TODO.md` 「코드 명칭 대응」 참조.

이 파일에 남은 `PT-01`~`PT-14` · `EP5` · `EP6` · `N-15`~`N-18` · `G24` · `T-08`은 **정의 원본이 삭제돼(2026-08-24) 명칭으로 풀지 못한 코드**다. Josh 판단 대기 — 상세는 TODO.md 「정의 소실 코드」.
