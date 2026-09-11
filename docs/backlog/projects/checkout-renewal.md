---
project: checkout-renewal
updated: 2026-09-09
---

## 관련 Jira 티켓
- MDWEB-870 — 결제 페이지 & 흐름 (진행중)
- MDWEB-916 — BE 개인 연간 구독 상품 (읽기 전용 참조)

## TODO

1. **F-26 리뷰 (기획 문서 3종)** — Version Table, PRD 1과 2, 기능명세 39행. 검토대기, Josh 몫
2. **F-19, F-20 리뷰** — 둘 다 검토대기, Josh 몫. F-24(Case 포맷 + 항목별 노트 + 변수화), F-25(VAT 편입)도 검토대기
3. **User Flow 차트 2개** — 에디터 초안(0.3.00)을 Josh가 직접 수정. PNG 삽입은 이번 라운드 제외(09-09 결정), 별도 지시 대기
4. **§6 Order Summary 다이어그램 개정 제안** — 확정 체계(Discount 쿠폰 전용에 Coupon 행 통합, Total 라벨, 배너, n USD 표기, Subtotal 위치)와 어긋난 부분이 남아 있다. Josh OK 후 재작성
5. 기존 원장 반영 잔여 — `checkout.md` 일괄 정리(Indie 웹 판매 제외, §9 Purchase Type 필터 모델 재작성 마무리, CTA 명칭), `plan.md` Academic 단가 300 USD + 구간 할인, 게시본 Canvas(`F0BL0SRE4TZ`) 구 모델 잔재(판정 표, [다음] 버튼명) 정리 — Step 표기는 09-09 해소됨
6. 미도출 프레임 2종: Single→Team Convert, Individual 재구매(잔여 안내) — Josh 선정 대기
7. F-01 잔여 갭 (Individual 축 5프레임, RESULT 축 4프레임, BLOCKED 축 + 신규 동일 플랜 차단 모달 CO-100-300-P01) — Josh가 고르면 개별 행 등록

### 살아있는 플래그 (PRD 2 미확정 항목 블록과 동기)
- Tax ID(VAT Number) 무효 시 처리 — BE 확인 (D-1). 위치가 Add Address 모달로 바뀌어도 쟁점 동일
- SW Account 생성 모달 입력 필드 (D-10)
- CTA 명칭: 화면은 Check out 고정, 정책은 결제수단별 4종 *(와이어프레임 갱신 필요 플래그가 구성 노트에 있음)*
- 동일 플랜 차단 모달의 판정 상태 범위: Trial, Paused, Cancel Scheduled 포함 여부. D-11(진입차단 09)과 같은 케이스인지 확인
- Convert 시 라이선스 할당 상태 유지 여부 (구 G28)
- Seat와 Coupon 변경 시 Avalara 재조회와 디바운스 (구 G31, 개발 확인)
- SW Account 지정 화면 목록 기준, 교차 플랜, Coupon 판정 기준 등 기존 플래그 유지 (TODO.md 결정 대기 표 참조)

## 컨텍스트

### 기획 문서 3종과 화면 ID 체계 (09-09 신설, F-26)
- page `Order/Checkout ✅`에 생성: `Order/Checkout Version Table`(`8872:1705`, 1.0.00), `Order/Checkout PRD 1`(`8873:1705`), `Order/Checkout PRD 2`(`8874:1705`), `Order/Checkout 기능명세`(`8875:1705`, FC-CO-001~039)
- **화면 ID `CO` 최초 발급, PRD Screen Structure가 발급 원본**: SW Account 지정 `CO-100-000`(+P01 생성 모달), 결제 `CO-100-100`(+P01 Add Address, P02 Coupon, P03 Payment Failed), Order Complete `CO-100-200`, 진입 차단 `CO-100-300`(+P01 동일 플랜 차단 모달). 401과 500은 error-states 공용이라 미발급
- **단어 Step 폐지 (09-09 Josh 확정)**: 화면명으로 쓴다 — SW Account 지정 화면, 결제 화면. 정책 문서 3개(checkout.md 13곳, plan.md, plan-card.md)와 게시본 Canvas 12개 섹션 교체 완료. 메모리 등재
- **동일 플랜 보유 차단 모달 신설 (09-09 Josh 확정)**: 개인 계열이 동일 플랜 활성 구독 보유 시 Plan 페이지 Start 클릭에서 차단. 제목 `You Already Have This Plan`, 본문 `Your {planName} subscription is already active. Manage renewal and payment details in My Page.`, 버튼 `Close`와 `Go to My Page`. 동일 계열 다른 지불 방식 구매(전환 허용, 잔여 안내)와는 별개 케이스
- 기능명세 사용자 열: 로그인 주체는 "로그인"이 아니라 **Member** (spec §9.5 반영)
- checkout.md 하단 관련 문서 블록을 문서 3종 좌표로 교체 (구 Spec Doc 좌표와 구 페이지명 폐기, Josh OK)
- User Flow: 에디터(`7b03170c-f6e7-486c-9ebc-c0853b802dcd`)에 차트 2개 초안 — 진입 판정과 결제, SW Account 지정과 Purchase Type 판정. 도출 기준은 spec.md §9.8 신설(1.9.00): 후보 4개 중 결제 실패 복구는 골격 분기로 충분, Trial 경과는 시간 축이라 표 소관으로 제외
- `requirements/mdweb-870-checkout/` 7개 파일은 구조적 스테일 판정(2-step 이전 모델, 축 A와 축 B, Indie 웹 판매 포함) — 재사용 가능한 것은 배경, §1 범위 표, §22.1 에러 패턴 표뿐

### Order Summary 할인 표시 체계 (09-07~08 확정, 이 스트림의 핵심)
- **쿠폰 외 정책 할인은 Discount를 쓰지 않는다.** Seat 할인(Academic)은 해당 구간 금액에 직접 반영: 정가 회색 취소선 + 할인 후 금액 병기, Subtotal은 할인 반영 후 금액. Discount는 쿠폰 전용(기본 0 USD)
- 할인 캡션 2종, 구간 아래 우측 정렬: 미달 `Add {n} more Seats for 50% off`, 충족 `50% off applied`. 판정: Add 구간은 추가 Seat 수, Extend 구간은 총 Seat 수, 각 10석 이상 50%
- 기간 칩(Add/Extend 공통, Enterprise 포함, New 미표기): Extra Seats `Remaining Period`, Extension `Next Period`
- Subtotal은 Breakdown 박스 위. 합계 라벨 `Total`. USD 소수 2자리, 정수는 소수점 없음
- **Individual Trial과 Student Benefit applied는 Subtotal에 정가 취소선 + 0 USD 병기** (Trial 280, Benefit 8.25), VAT와 Total 0 USD, 첫 청구는 First Payment 배너가 전달
- 배너: `Your next/first payment of {금액} USD is due on {날짜}.` 새 디자인(주황 테두리 + 주황 14% 배경 + 주황 Medium 텍스트, Josh 확정) — 12개 전수 통일. 구독 케이스만, 선불(Enterprise Team, Academics) 미노출
- Academic Add/Extend 4케이스 Total 검산: 1,617 / 1,155 / 4,917 / 5,445 USD

### VAT Number → Billing Address 편입 (09-08 확정)
- standalone 입력 폐지. 입력은 Add Address 모달의 VAT Number 필드(Enterprise 플랜 + EU 회원국 선택 시에만 노출, Academics 미노출), 표시는 Billing Address 카드 안 `VAT Number: DE123456789` 줄
- 역과세 로직 유지: 선택 입력, 미입력 시 표준 세율, 입력 시 Reverse Charge 전환, 국가 변경 시 초기화
- EU 케이스 정본은 COMPONENTS: BILLING INFORMATION의 EU 변형. 미국 더미 주소 화면 카드에는 표시 없음이 정합

### Description 작성 규약 (이 스트림에서 확정, patterns.md와 메모리에 등재)
- **계산 케이스는 Case 포맷**: Page Context가 케이스 정의 소유(제목 `Case N: {제목}`, 이유 문장, Add 여부와 Seat 수 필드 서브불릿) + **UI 항목별 번호 노트**(Extra Seats, Extension, Subtotal, VAT) + 항목별 Screen 배지(카드 좌측 거터 정렬)
- **단어 "행" 금지**: 요소명 그대로, 집합은 "항목", 위치는 "Seats 아래"
- 노트 본문 첫 줄에 제목 반복 금지("~한 경우의 형태" 류)
- 배지와 노트는 1:1 절대 조건. 변수 정의는 적용 범위 기준: 공통({total}, {regularPrice}, 쿠폰, 배너)은 구성 노트, Academic 전용({remainingDays}, {totalSeats}, {n} 등)은 쓰이는 프레임 노트에
- 컴포넌트 시트(`7992:1577`)는 예시 숫자 대신 {} 변수 표기 (규칙값 0 USD는 리터럴), 화면은 더미 데이터

### Figma — 활성 위치
파일 `PeCid7uJcg0HenViaaiHUp`, page `Order/Checkout ✅` (page-id 237:3132)
- `COMPONENTS: ORDER SUMMARY` `7992:1568` (Screen `7992:1577`, 구성 노트 `8025:1555` = 변수 사전 정본, 케이스 노트 1~10)
- Academic Add/Extend 4프레임: `8555:1727` / `8556:1745` / `8547:2394` / `8554:1709` (섹션 `Checkout_Organization`), 요약 카드 `8668:1763`
- `COMPONENTS: BILLING INFORMATION` `7991:1582` (EU 변형에 VAT 카드 표시), Add Address 모달 `8489:1946` (Address 섹션)
- Canvas: 표기 규칙 `F0BSUTFMMEV`, Academic Checkout UI 변경 `F0BV7UUE84T`, Order/Checkout 게시본 `F0BL0SRE4TZ`

### 스테일 주의
- 시안 Artifact `8398f512`는 취소선 모델 이전 상태
- 이 파일 하단 완료 로그의 08월 항목 일부(캡션을 Discount 아래 두는 서술 등)는 09-07 취소선 모델로 대체됨

## 완료 로그
### 2026-09-09
- **F-26 완료(검토대기): 기획 문서 3종 Figma 생성** — 신설 커맨드 `/figma-document` 첫 실행. Version Table(1.0.00), PRD 1과 2(표준 7섹션, 미확정 플래그 6건), 기능명세 39행. 화면 ID `CO` 최초 발급
- **단어 Step 전면 폐지(Josh)** — 정책 문서 3개 15곳과 게시본 Canvas 12개 섹션을 화면명으로 교체, 재검색 0건 확인
- **동일 플랜 보유 차단 모달 확정(Josh)** — 문구 3종 확정, `CO-100-300-P01` 발급, PRD와 기능명세 등재
- checkout.md 관련 문서 블록 갱신(Josh OK): PRD 줄을 Figma 정본 좌표로, 페이지명을 `Order/Checkout ✅`로 현행화
- spec.md 1.9.00: 플로우 목록 도출 기준 신설(§9.8), 기능명세 사용자 Member 표기(§9.5), 문서 빌더 docText 순서 정정(§11.5 텍스트 폭 0 붕괴 버그)
- User Flow 에디터에 차트 2개 초안 게시(0.3.00). Josh 직접 수정 예정, PNG 삽입은 이번 라운드 제외
- 구 미결 재판정: G25(추가 Seat 만료일)와 G22(Indie 대기 표시)는 원장 확인으로 해소, G28(Convert 할당 상태)과 G31(Avalara 재조회)은 PRD 플래그로 이관
- `/figma-document` 커맨드 신설과 역할 등록(CLAUDE.md, planner-workflow.md) — Figma 축 세 번째 역할

### 2026-09-08
- **원장 반영 완료** (Josh OK): `checkout.md` §11.1 신설(Academic 구간별 판정 표 + 예시), §6 각주와 §0 구성, §7.2 Tax ID의 Billing Address 편입, §8.3 필드 표에 VAT Number 추가. `plan.md` §2-1에 §11.1 참조 연결
- 규칙 반영(Josh 승인): `spec.md` §6.3에 화면 요소 "행" 호칭 금지, §6.6에 노트 첫 줄 제목 반복 금지 추가
- **Order Summary 할인 표시 마무리**: Trial과 Student Benefit applied에 Subtotal 정가 취소선 + 0 USD 병기 적용(VAT와 Total 0), 배너 새 디자인(주황) 화면 6곳 통일, 컴포넌트 시트 숫자 전부 {} 변수화(신규 변수와 표기 템플릿은 구성 노트 등재)
- **Academic Add/Extend Description 재구조화**(Josh 제안): Page Context가 케이스 정의 소유, UI 항목별 노트(Extra Seats, Extension, Subtotal, VAT)와 항목별 배지. 변수 정의는 적용 프레임으로 이동(공통 아님, Josh 지시)
- **단어 "행" 전면 제거**(Josh 지시) — Description 22곳 + 노트 제목 6곳, 규칙 메모리 등재
- **VAT Number의 Billing Address 편입 반영**(F-25): standalone 필드 5곳 삭제, Description 9곳 갱신, Case Matrix 라벨 변경
- F-24, F-25 검토대기 등록

### 2026-09-07
- **Seat 할인을 Discount에서 분리**(Josh 확정): 정가 취소선 + 할인 후 금액 병기, Subtotal 선반영, Discount 쿠폰 전용, 캡션 우측 정렬, Subtotal을 Breakdown 위로. Student Benefit도 Discount 미사용
- **F-21(배너), F-22(Academic 4케이스), F-23(Description 정리) 완료 처리** — F-23에서 컴포넌트 배지와 노트 1~10 재번호(중복 5와 결번 해소), 신설 노트 3장(Trial, Benefit applied, Benefit used), 케이스 노트 첫 줄 제목 반복 삭제
- Case 포맷 확정(Josh 템플릿): 계산 서술은 화면 예시 값 + 필드 + 계산식 + UI 표시 블록
- 개발과 디자인 공유용 슬랙 초안 2건 전달(변경 대상별 정리, 결정 사항 목록)

### 2026-09-03
- **Next Payment와 First Payment를 문장형 배너로 전환**(F-21): `Your next payment of {금액} USD is due on {날짜}.`, 첫 결제 전은 first, 날짜 월 3글자 축약(ux-writing §1.1 개정)
- 합계 라벨 `Total for today`를 `Total`로, USD 소수 표기 규칙 확정. Canvas `F0BSUTFMMEV` 개정

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
