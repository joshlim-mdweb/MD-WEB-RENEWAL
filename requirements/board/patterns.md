# Figma 화면 패턴 라이브러리

Figma Description 터미널이 화면을 읽으며 발견한 **반복되는 컴포넌트·레이아웃 패턴**을 누적한다.
새 화면 작업 시 여기부터 확인 — 매번 새로 판단하지 않고 이미 정의된 패턴을 재사용한다.

갱신 주체: Figma Description 역할만. 항목 추가 시 최초 발견 화면 + node-id를 근거로 남긴다.

---

## 컴포넌트 패턴

포맷:
```
### {컴포넌트명}
- 판단: L1(Numbered Note) / L2(불릿) — 근거: figma-description.md Q1~Q3
- 상태 목록: {상태 나열}
- 최초 발견: {화면명} ({node-id})
- 재등장: {화면명 목록}
```

### SW Account Selector (드롭다운)
- 판단: L1 — Q2 자체 상태 O · Q3 클릭 인터랙션 O
- 상태 목록: Default · Open · Loading(Skeleton) · Empty · Error
- 특징: 선택 결과가 하위 단계(Purchase Type · Seat)의 노출·판정을 좌우한다. 미선택 시 하위 단계 미노출
- Error 문구 고정값: `Couldn't load this list` + `Try again`
- 최초 발견: Checkout — Enterprise Team (`7223:182` / Note 1 `7228:91`)
- 재등장: —

### 판정 결과 표시 행 (Purchase Type)
- 판단: L1 — Q2 자체 상태 O (New / Extend) · Q3 인터랙션 X
- 상태 목록: New · Extend
- 특징: 사용자 입력이 아니라 **선행 선택값으로 판정한 결과**를 표시한다. 상태를 `상태:`로 쓰고 판정 규칙은 `케이스 분기:`로 분리한다
- 최초 발견: Checkout — Enterprise Team (`7223:182` / Note 2 `7228:98`) — **이 노드는 2-step 전환 중 삭제됨(08-24 확인)**
- 재등장: Checkout Enterprise Team — Step 2 (`7172:3150` / Note① `7913:1547`) — 상태 New·Add·Extend·Add+Extend 4종으로 확장 (Team 화면은 Convert 미해당) · **Checkout Enterprise Team - Add/Extend (`7905:5757` / Note① `8007:1542`)** — 노트명 `Purchase Type 표기`. 파생 프레임에서는 상태 목록을 다시 쓰지 않고 **읽기 전용 표시 + 이 화면에서 변경 불가**만 남긴다 (값은 Step 1이 정함)

### 프리셋 탭 + Custom 입력
- 판단: L1 — Q2 O · Q3 O
- 상태 목록: Default · Selected · Custom(입력 필드 전환) · Error(빈 값·0)
- 특징: 스테퍼를 쓰지 않는다. `옵션:` 블록에 프리셋 값과 Custom을 나열하고, 변경 시 금액 재계산을 인터랙션으로 기술
- 최초 발견: Checkout — Enterprise Team (`7223:182` / Note 3 `7228:105`) — **이 노드는 2-step 전환 중 삭제됨(08-24 확인)**
- **컨테이너는 `Seats` 카드다 (2026-08-26).** 이 프리셋과 아래 "Seat 계산 박스"는 화면에서 `Seats` 카드 하나 안에 같이 들어간다 — 행 구성은 Software Account(읽기 전용), 수량 컨트롤, 계산 박스 3행. Components 섹션의 `COMPONENTS: SEATS`(`8061:1775`)가 이 카드의 케이스 5종을 모아 둔 프레임이다
- 재등장: Checkout Enterprise Team — Step 2 (`7172:3150` / Note② `7913:1554`) — Purchase Type(New/Add/Extend/Add+Extend)에 따라 컨트롤 자체가 바뀌는 `케이스 분기:` 추가, Software Account 읽기전용 표시 + Sub Total 계산 행을 같은 노트에 통합 · **Add/Extend (`7905:5757` / Note② `8007:1549`)** · **Components 섹션 `COMPONENTS: SEATS`(`8061:1775`)** — Description 작성 완료 (2026-08-26), List `8061:1805`: ①Team New(`8061:1806`), ②Add and Extend(`8061:1813`), ③Enterprise Single(`8067:1525`), ④Academics 할인 미달(`8067:1532`), ⑤Academics 할인 적용(`8067:1539`), 무번호 `Seats 구성`(`8061:1820`). Screen 배지 ①~⑤(`8061:1798`, `8061:1801`, `8066:1525`, `8066:1528`, `8066:1531`) — 프리셋이 **2행**으로 분화한다: `Extra Seats`(No extra seats/+5/+10/+20/Custom) + `Period of use`(No Extension/+1/+2/+3/Custom). 둘 다 선택 입력이고 **하나만 지정 가능**, 둘 다 기본값이면 CTA 비활성. 기존 Seat 수는 `Current Seats` 읽기 전용 행으로 병기 · **Enterprise Single (`7782:28043` / Note① `8008:1542`)** — 프리셋 **미제공**(Seat 1 고정), 노트명 `Seat 표시 행`

### 결제수단 카드 그룹
- 판단: L1 — Q2 O · Q3 O
- 상태 목록: Default(미선택) · Hover · Selected
- 특징: 목록 구성이 **국가 조건부**다. `조건부 노출:` 블록으로 기술하고, 국가 변경 시 목록 교체 + 선택 초기화를 별도 불릿으로 남긴다. 조건: China(접속 IP 또는 청구지 국가) → `{Card, AliPay}` / 그 외 전 국가 → `{Card, PayPal}` (Kakao Pay 미제공, `checkout.md` §3)
- **★ 원장 공백 (2026-08-26 발견) — 접속 IP × 청구지 국가 조합이 규정되지 않았다.** §3 표는 청구지 국가 기준으로 2개씩 주는데, 같은 절의 단서는 "접속 IP가 중국이면 AliPay를 노출한다 — 주소 입력 여부와 무관하게 상시 적용"이다. **IP 중국 × 청구지 미국일 때 Stripe, PayPal, AliPay 3개인지 Stripe, AliPay 2개인지 답이 없다.** Individual Monthly 화면(`7793:1366`)이 3개로 그려져 있어 이 공백이 드러났다. 해당 노트에 미결 플래그로 남겼다
- 최초 발견: Checkout — Enterprise Team (`7223:182` / Note 4 `7228:112`) — **이 노드는 2-step 전환 중 삭제됨(08-24 확인)**
- 재등장: Checkout Enterprise Team — Step 2 (`7172:3150` / Note③ `7913:1561`) · Components 섹션 `COMPONENTS: BILLING INFORMATION`(`7991:1582`) — Description 작성 완료 (2026-08-26), List `7991:1596`: ①Default(`7995:1572`), ③China(`7995:1586`), 목록 구성은 무번호 `Billing Information 구성`(`8056:1569`)이 소유. **화면 오류 1건 (Josh 수정 대기)**: China 케이스에 결제수단이 Stripe, Paypal, Alipay 3개인데 `checkout.md` §3은 China면 Stripe, AliPay 2개다 — 노트는 정책값으로 썼다

### 주소 표시 블록 + Edit 링크
- 판단: L1 — 링크는 별도 노트로 분리하지 않고 같은 노트에 둔다 (화면 레벨 컴포넌트가 아닌 내부 액션)
- 상태 목록: Default · Loading(Skeleton) · Empty · Error
- 특징: 모달 저장 성공 시 **가격 재조회 1회**가 따라붙는다. 저장 성공/실패를 인터랙션 성공/실패로 기술
- **★ 2026-08-26 정정 (Josh) — 양쪽 다 목록을 불러온다.** 아래 08-25 항목의 "Organization은 단일 카드" 판단은 폐기한다. **Organization 계열은 조직에 등록된 주소 목록**(Team Console 관리), **개인 계열(Individual, Student)은 개인에 등록된 주소 목록**(My Page 관리)을 불러오고, 양쪽 모두 그 목록에서 청구 주소를 선택한다. 차이는 **카드 모양이 아니라 목록의 출처**다. 화면이 선택된 항목 하나 + Edit로 그려져 있는 것은 목록에서 선택된 상태를 그린 것으로 읽는다
- **불일치 해소 (2026-08-25, Josh 확인)** *(위 08-26 정정으로 대체됨)*: Organization 계열은 조직 주소 **1개만** 표시(Team Console 관리, `checkout.md` §8.1) — "Home" 라벨 + 주소 + Edit 링크 카드 하나가 맞는 형태다. "Other address" 등 개인 다중 주소 전환 UI는 **Individual/Student 전용**이며 이쪽은 보유 주소 **목록에서 선택**(2026-08-25 개정, §8.2) 후 클릭 시 입력 모달. 두 계열의 카드 모양이 다른 것이 정상 — Org는 단일 카드, Individual/Student는 목록형
- 최초 발견: Checkout — Enterprise Team (`7223:182` / Note 5 `7228:119`) — **이 노드는 2-step 전환 중 삭제됨(08-24 확인)**
- 재등장: Checkout Enterprise Team — Step 2 (`7172:3150` / Note④ `7913:1568`) · Components 섹션 `COMPONENTS: BILLING INFORMATION`(`7991:1582`) — Description 작성 완료 (2026-08-26). **주소 없는 상태가 별도 케이스로 신설됐다** — ④Address Empty(`8056:1562`): Billing Address 자리에 `+ Add address` 진입점만, 청구지 국가 미확정이라 세액·합계 미확정, 결제수단은 접속 IP로 China 여부만 판정. Edit 클릭 시 동작과 상태 4종(Default/Loading/Empty/Error)은 무번호 `Billing Information 구성`(`8056:1569`)이 소유. Individual/Student 목록형은 별도 케이스로 추가 예정

### 금액 요약 패널 (Order Summary)
- 판단: L1 — Q1 독립 영역 O
- 상태 목록: Default · Loading(Skeleton) · 세금 미확정 · Error
- 특징: 항목별 조건부 노출(Coupon · Discount · 세금)을 `조건부 노출:`로, 계산식을 단독 불릿으로 남긴다. 단가·Seat 수처럼 **화면에 보이는 값은 쓰지 않는다**. 우측 컬럼에서 Order Summary → 약관 체크박스 → CTA 버튼이 한 세트로 배치된다(`checkout.md` §6, §14 — 별개 카드로 쪼개지 않는다)
- **★ 2026-08-25 개편 — 케이스를 5종에서 2종으로 줄였다 (Josh 지시).** 기준을 Purchase Type이 아니라 **결제 성격(정기 결제 유무)**으로 바꿨다. 구 5종(Order Summary 1~5)은 삭제 — 백업은 `order-summary-notes-backup-2026-08-25.md`
    - **① Prepaid** — 선불. 결제 기간 종료 후 만료, 정기 결제 없음. 대상: Enterprise Team, Enterprise Team Linux, Academic Annual / Purchase Type New·Add/Extend·Convert 전체 (Single→Team Convert도 결과가 선불이라 여기)
    - **② Subscription, Trial** — 구독. 즉시 결제 후 다음 정기 결제로 이어짐. 대상: Individual Monthly, Individual Annual, Student Monthly, Enterprise Single (Annual도 구독, Enterprise Single은 Organization 계열이나 월간 정기 결제)
    - **★ 2026-08-31 합계 라벨 통일 (Josh 확정).** 합계 라벨은 결제 성격과 무관하게 **`Total for today`**다 (→ **2026-09-03 `Total`로 재개정**, 아래 09-03 항목 참조). 오늘 지불하는 금액이라는 뜻이고 `Next Payment` 행의 유무와 연동되지 않는다. `Next Payment` 표기는 구독인 경우에만 추가한다(2026-09-03부터 행이 아니라 문장형 배너, 아래 09-03 항목 참조). 구 규정(`선불은 Total 하나, 구독은 Total for today와 Next Payment 둘`)과 그에 딸린 와이어프레임 갱신 플래그는 폐기했다
    - **무번호 `Order Summary 구성`** — 두 케이스 공통 스펙(구성·변수 정의·계산식·조건부 노출·상태)을 한 노트로 모았다. 케이스 노트에 스펙을 두 번 쓰지 않는다. **이 노트의 변수 표기 형식이 전 구성 노트의 정본이다** — 구성 노트 표기 규약 참조 (2026-08-26 Josh 확정)
- **★ 2026-08-31 구조 개편. 케이스가 7종이 됐고 계산식을 흡수했다.** Josh가 화면을 다시 만들었다
    - 케이스 7종: Enterprise Team New, Individual Annual Subscription, Enterprise Team Add and Extend, Individual Monthly Subscription, Academics New Discount x, Academics New Discount O, Enterprise Team Single
    - **Screen 배지가 1, 2, 4, 5, 6, 7, 8이고 3이 없다.** 노트를 배지 번호에 그대로 맞췄다. 번호를 다시 매기려면 화면을 고쳐야 해서 별건으로 뒀다
    - **Subtotal 하위 계산식 박스**를 흡수했다 (Sub Total Breakdown 항목 참조)
    - **Discount 캡션**: Discount 행 아래 사유 한 줄. 쿠폰이면 `n% off for n months applied`, 학생 할인이면 `50% off for 10 seats or above`, 미적용이면 캡션 없이 `0 USD`
    - **VAT 3패턴**: 적용이면 `VAT {taxRate} applied`, 0% 국가면 `VAT 0% applied`, 미적용이면 `VAT` 라벨만 두고 값 `0 USD`
    - 화면에 참조 블록 2개(Discount 3패턴, VAT 3패턴)가 배지 없이 있다. 무번호 구성 노트가 흡수한다
- **★ 2026-09-03 Next Payment 행을 문장형 배너로 전환 (Josh 지시).** `Next Payment`/`First Payment` 3조각 행(라벨, 날짜, 금액)을 삭제하고 Total 아래 배너 1장으로 대체했다. 적용: 컴포넌트 변형 6곳 + 화면 6곳(Individual Trial, Individual Monthly, Individual Annual, Student Benefit applied, Student Benefit used, Enterprise Single). 선불형(Enterprise Team, Academics)은 기존대로 없음
    - 표시 문자열: `Your next payment of {nextPaymentAmount} USD is due on {nextPaymentDate}.` 첫 결제 전 케이스(Individual Trial, Student Benefit applied)는 `first payment`로 표기
    - 날짜는 월 3글자 축약(`Nov 26, 2026`): `ux-writing.md` §1.1에 허용 명시 (2026-09-03 확정)
    - 배너는 신규 드로잉이 아니라 기존 `Alert` 컴포넌트(`8489:1710`, type=Noti) 인스턴스. **컴포넌트 기본값이 노란 테두리 + 버튼 노출이라, 레퍼런스 인스턴스(`8489:1883`)의 오버라이드(파랑 테두리, `Basic / Mono` 버튼 숨김)를 복제해야 한다**
    - 구성 노트(`8025:1555`)에 배너 블록 신설, 화면 노트 5곳과 Case Matrix 셀 6곳의 `행` 표기를 `배너`로 갱신
- **★ 2026-09-03 Academics Add/Extend 4케이스 신설 (Josh 지시).** `Checkout_Organization` 섹션 Academics 행 우측에 4프레임 추가: `Checkout Academics - Add Seats`(`8555:1727`), `Checkout Academics - Add Seats, 50% Discount applied`(`8556:1745`), `Checkout Academics - Add and Extend, 50% Discount on Extension`(`8547:2394`), `Checkout Academics - Add and Extend, 50% Discount applied`(`8554:1709`)
    - 구조는 `Checkout Enterprise Team - Add/Extend` 기반(Josh가 미리 만든 사본 `8547:2394` 재활용). Academics 치환: Product명, 단가 300 USD, `student_space_01`, VAT number 행 제거, Billing Address `Home`
    - 할인 판정 2구간: Add 구간은 {addedSeats}가 10 이상, Extend 구간은 {totalSeats}가 10 이상인 경우 각각 50%. 구성 노트(`8025:1555`) Discount 캡션 절에 등재
    - 일할 더미는 잔여 0.7년(일할 단가 210 USD): Enterprise Add/Extend 더미(1,400 = 2,000 × 0.7)와 동일 기준
    - Breakdown은 정가, 구간 할인은 Discount 한 행에 합산. 캡션은 할인 적용 시 `50% off for 10 seats or above` 단독, 전부 미적용이면 `Add 3 more Seats for 50% off` (→ **2026-09-07 캡션 체계 개정으로 대체**, 아래 항목 참조)
    - Description은 파생 프레임 규칙 적용: Page Context 무번호(근간 2개 참조) + Order Summary 케이스 노트 1장, Screen 배지 1개만
- **★ 2026-09-07 Seat 할인 캡션 체계 개정 (Josh 확정).** Seat 할인 안내를 Discount 행 캡션에서 **Sub Total Breakdown 행 캡션**으로 옮겼다. Discount 행의 `50% off for 10 seats or above` 캡션은 폐기. 쿠폰 캡션(`n% off for n months applied`)과 Student Benefit 캡션은 Discount 행에 그대로 남는다
    - 빨간 캡션 2종: 기준 미달이면 `Add {n} more Seats for 50% off`, 충족이면 `50% off applied`. 판정 기준은 Extra Seats와 Seats 행은 자기 수량, Extension 행은 {totalSeats}
    - 기간 칩(행 라벨 옆, Add/Extend만): Extra Seats 행 `Remaining Period`, Extension 행 `Next Period`. New는 칩 미표기. 칩 규격: 흰 배경, 테두리 `#D1D1D1`, radius 4, pad 2와 6, Poppins Regular 10. **칩은 할인이 아니라 Add/Extend 공통 안내라 플랜 무관** (Josh 확인, 2026-09-07): Enterprise Team Add/Extend 화면(`7905:5757`)과 컴포넌트 변형 4(Enterprise Team Add and Extend)에도 적용 완료. 빨간 할인 캡션은 Seat 할인이 있는 Academic 전용
    - 왼쪽 컨트롤(Seat 프리셋, Period of use)에는 캡션을 두지 않는다
    - 적용 완료: Academics 6프레임(Add/Extend 4 + New 2)과 컴포넌트 변형 6, 7. 구성 노트(`8025:1555`)에 Breakdown 행 캡션과 기간 칩 블록 신설
    - New 50% 프레임의 결정 대기 플래그(할인을 계산 박스 취소선과 Discount 양쪽에 표시할지)는 이 결정으로 해소
    - 시안: Artifact `8398f512` (16:9 풀 스크린 6장, 캡션 체계 진화 이력은 버전 히스토리)
    - **★ 09-07 2차 (Josh 확정) — Seat 할인을 Discount 행에서 분리.** 할인은 구간 행 금액에 직접 반영: 정가에 취소선을 긋고 할인 후 금액을 병기, Subtotal도 할인 반영 후 금액. Discount 행은 쿠폰 전용(Seat 할인 미반영, 기본 0 USD). 캡션은 행 아래 **우측 정렬**로 이동. Subtotal 행은 Breakdown 박스 위로(컴포넌트 변형 4와 Enterprise Add/Extend 포함). Total은 전 케이스 불변. Case 3(`8547:2394`)은 Josh가 직접 만든 목업이 정본: 취소선을 별도 텍스트 노드 2개로 구현(`8667:4548` 취소선 정가 + `8667:4549` 할인가), 나머지 프레임은 단일 노드 range 취소선 — 렌더 동일. **주의**: 구버전 행은 좌컬럼 고정폭이라 금액이 길어지면 잘림 — 좌컬럼 FILL + 금액 컨테이너 HUG로 전환
    - **Student Benefit applied도 Discount 미사용 (Josh 확정, 09-07).** 컴포넌트 변형 10과 화면 `7793:1681`: Discount 0, 캡션 `Student Benefit applied` 삭제, 정가 요약 그대로(Subtotal 8.25, VAT + 0.83, Total 9.08). 오늘 무료라는 사실은 First Payment 배너(금액 9.08로 Total과 일치)와 약관이 전달. 취소선도 쓰지 않음: 개인 계열은 Breakdown 구간 행이 없다. **Trial(변형 9)은 Subtotal 0 모델 유지** — 플랜 미개시 상태라 성격이 다름
    - **★ 09-07 3차 — Description 정리 (F-23).** ①배지와 노트는 1:1이 절대 조건: 변형을 추가하다 배지가 중복(5 두 개)되고 결번(7, 8)이 생겼다. 읽기 순서 1~10 연속 재번호 + 노트 재배치 + 배지 프레임 레이어명까지 동기화. ②**케이스 노트 본문 첫 줄에 변형명을 다시 쓰지 않는다** — 제목 노드가 이미 말한다(`~을 구매한 경우의 형태` 류 전부 삭제, 금지 패턴 4의 노트판). ③배지가 있는 변형은 노트도 반드시 만든다: Individual Trial, Student Benefit applied, Student Benefit used 3장 신설(`8714:1763`, `8714:1770`, `8714:1777`). ④화면 프레임 Order Summary 노트 첫 줄은 `→ COMPONENTS: ORDER SUMMARY 참조 (공통 구성, 할인 표시 규칙)` — Academics Add/Extend 4프레임 적용, 구성 노트와 겹치는 판정 기준 줄은 삭제
- **★ 2026-09-03 합계 라벨 재개정 (Josh 확정).** `Total for today`를 **`Total`**로 전환했다. 08-31 통일 규정을 대체한다. 적용: 화면 라벨 21곳(화면 프레임 10, 컴포넌트 변형 10, 페이지 레벨 작업 프레임 1) + Description 노트와 Case Matrix 서술 14곳 15회. 정책 문서에는 이 라벨이 명문화된 곳 없음(grep 확인). Academics 50% 노트의 라벨 불일치 플래그는 중복 블록 정리 건만 남기고 정리
- **작성 관점**: "무엇이 보이나"가 아니라 **"어느 결제로 들어왔을 때 이 형태가 되나"**를 케이스 노트에 쓴다 (Josh 지시). Page Context를 두지 않고 진입 조건을 케이스 노트 안에 넣는다
- **★ 갱신 트리거는 트리거 쪽 컴포넌트가 쓴다 (2026-08-26 Josh 지적).** 값을 바꾸는 컴포넌트 노트에 `Order Summary 금액 재계산`까지 적고, **어떤 행이 어떻게 바뀌는지는 이 노트가 소유**한다. 이 경계를 지키면 중복이 안 난다. 현재 트리거를 쓰는 곳: Coupon `Apply 클릭 시` · Billing Preference `Annual 카드 선택 시` · Seats `수량을 변경한 경우` · Billing Information `가격 재조회 후` · Tax ID `역과세 적용 시`(세금 행이 Reverse Charge 표기로 전환, `checkout.md` §7.2). **예외 — 정책이 표기 문자열까지 정한 경우는 트리거 쪽에도 결과를 쓴다**(역과세가 그 사례). 안 쓰면 BD·개발이 Tax ID에서 찾다가 놓친다
- **다른 컴포넌트의 상태를 쓰지 않는다** — 잔여 기간 안내 배너는 이 노트 범위 밖 (Josh 지시). **★ 08-31 개정 — CTA는 예외가 됐다.** 2컬럼 전환으로 약관 문구와 Check out 버튼이 Order Summary 음영 카드 안으로 들어왔기 때문에 이 노트가 소유한다. 소유 경계는 아래와 같다
  - **이 노트(정본)**: 체크박스 위치, 활성 조건의 일반 규칙(`체크 + 필수 항목 전부 = 활성`, `세금 미확정 = 비활성`, `Tax ID는 조건 아님`)
  - **각 화면 노트**: 그 케이스의 **필수 항목 구성**. 케이스마다 실제로 다르다 — Team `Seat 수량, 결제수단, 약관 동의 체크` · Add/Extend `추가 수량 또는 연장 연수 중 하나 이상, 결제수단, 약관 동의 체크` · Single `결제수단, 약관 동의 체크`(Seat 1 고정) · Academics `Seat 수량, 결제수단, 약관 동의 체크`(Tax ID 미노출)
  - 파생 프레임(Academics 50%)은 쓰지 않는다. 근간 프레임 참조로 충분하다
- **`{}`는 치환되는 값에만 쓴다 (2026-08-25 Josh 지적).** 금액 · 세금 지역 · 세율 · 다음 결제일이 `{}`다. `Total for today` / `Next Payment` / `VAT`처럼 케이스로 정해지는 **고정 레이블에는 `{}`를 쓰지 않는다** — 구 `{taxLabel}`이 레이블을 변수로 만든 오류였고 `{taxRegion}` · `{taxRate}`로 쪼갰다. 표기 형식은 메모 `feedback_variable_text_format`대로 **실제 표시 문자열을 쓰고 그 안의 값만 `{}`** — `VAT ({taxRegion}) {taxRate} applied — {tax}`. 추상 목록으로 적지 않는다
- 금액 단위는 `n USD` (`$` 기호 쓰지 않음, 2026-08-25 Josh 확정). **★ 08-26 — 이 규칙이 Order Summary를 넘어 전 화면으로 확정됐다.** `.claude/rules/ux-writing.md` §1.1 `금액` 절이 정본이며, 기존 `$39.00` 규칙은 그 절로 대체됐다. Order/Checkout 페이지 화면 UI 문구 20곳을 일괄 변환했다 — Billing Preference(`23.33 USD/month`, `39 USD/month`, `8.25 USD/month`, `Save 188 USD per year`), Individual Annual 합계(`308 USD`), Enterprise Team 전환 배너(`Save 388 USD per Seat`), Enterprise Single 소계 `/Month`→`/month`. **Spec Doc 표 셀(`7897:15xx`)과 비밀번호 특수문자 목록(`7566:3535`)은 제외** — 앞은 정책 원장 인용이라 원장과 함께 바꿔야 하고, 뒤는 금액이 아니다
- 세금은 이 컴포넌트가 판정하지 않는다 — **Billing Address에서 가져오는 값**으로 기술한다. `{taxLabel}` 지역은 미국이면 주와 국가, 그 외는 국가만
- 최초 발견: Checkout — Enterprise Team (`7223:182` / Note 7 `7228:133`) — **이 노드는 2-step 전환 중 삭제됨(08-24 확인)**
- 재등장: Checkout Enterprise Team — Step 2 (`7172:3150` / Note⑥ `7913:1582`) · Components 섹션 `COMPONENTS: ORDER SUMMARY`(`7992:1568`) — Screen `7992:1577` 2카드, Description List `7992:1584`: ①Prepaid(`8025:1538`)·②Subscription, Trial(`8025:1545`)·무번호 구성(`8025:1552`), 배지 ①②(`8025:1556`·`8025:1559`). 구 노드 `7983:16xx`~`7983:17xx`는 삭제됨 · **Enterprise Single (`8008:1549`)** — 구독 결제라 `Total` 아래 `Next Payment` 배너(09-03 전환 전에는 날짜·금액 행) · **Academics (`8009:1549`)** · **Academics 50% (`8009:1567`)** — 할인 적용 시 `Discount`에 음수 표시. 세 프레임 모두 **구성·계산식은 `Organization 공통`으로 넘기고 케이스 차이만** 기술

### 약관 동의 그룹
- 판단: L1 — Q2 O · Q3 O
- 상태 목록: Default(해제) · Checked
- **헤더 문구는 `I agree to the terms and conditions below.`** (2026-08-31 Josh 확정). 구 `By clicking this button, you agree to the terms below:`는 체크박스가 생기면서 폐기됐다 — 동의 주체가 버튼이 아니라 체크박스다. 페이지 전체 18곳 일괄 교체. **원장 §14.1은 아직 `I agree to the following:`이라 갱신 대기 상태다**
- **★ 08-31 — clone 원본을 고쳤으면 사본을 전수 확인한다.** 2컬럼 전환 때 우 컬럼을 `COMPONENTS: ORDER SUMMARY` 변형에서 clone했고, 그 뒤 변형 3개의 약관을 구독 6항목으로 고쳤는데 **화면으로 전파하지 않았다.** `Checkout Enterprise Single` 화면이 자동결제인데도 `Your license does not renew automatically.`를 달고 있었다(Josh 지적). 이 파일에 "약관 문구는 대상 프레임의 것을 살린다"고 적어두고 **실제로 그런지 확인하지 않은 것**이 직접 원인이다. 기록은 확인의 대체물이 아니다
- **케이스 판별을 겹치는 문자열로 하지 않는다.** 같은 사고를 감사할 때 `automatically charged`로 구독을 판별했는데 Free Trial 세트 6번 항목에도 그 문구가 있어서 **Trial과 Student를 오탐**했다. 세트마다 고유한 문장으로 판별한다 — Prepaid `does not renew automatically` · Free Trial `free for 14 days` · Student `Student plan includes` · Subscription `automatically charged`(마지막에 판별)
- **★ 08-31 해소 — 체크박스가 들어왔다.** Josh가 `Interface / Checkbox_Unchecked` 인스턴스(24px)를 약관 문구 헤더 왼쪽에 배치했다. 적용 범위는 `COMPONENTS: ORDER SUMMARY` 케이스 변형 7개와 Organization 화면 5개 전부다. **Individual 4프레임에는 아직 없다** — 2컬럼 전환과 함께 들어간다. 헤더 문구는 `By clicking this button, you agree to the terms below:`
- 체크박스를 찾을 때 크기로 검색하지 않는다. 24px INSTANCE라 13px 사각형을 찾는 코드에 잡히지 않는다. `name`에 `Checkbox`가 들어가는 노드로 찾는다
- **★ 주어는 소유 주체가 정한다 (2026-08-31 Josh 확정).** Organization 계열은 라이선스 소유자가 조직이므로 `Your license`가 어긋난다. **Organization 계열은 `The license`, 개인 계열은 `Your`**를 쓴다
  - 바꾸는 것은 **라이선스를 개인 소유로 지칭하는 `Your`**뿐이다. 1번 항목 `I agree to...`는 동의 주체가 사람이라 그대로 두고, `Cancel before the next billing date`처럼 행위자가 사람인 문장의 `you`도 유지한다 (`If you cancel, the license remains available...`)
  - 적용 범위는 **Enterprise Single 포함 Organization 계열 전부**다. Team, Single, Academics, Academics 50%, Add/Extend
  - Prepaid 3번 항목은 `purchased license period`를 `purchased term`으로 줄였다. 한 문장에 `license`가 두 번 나오던 중복이다
  - Enterprise Single은 **결제 주기 선택이 없어** Subscription 3번 항목이 다르다: `The subscription is automatically charged monthly.` 원장 §14.1은 Individual 둘과 한 세트로 묶고 `monthly or annually based on your selected billing cycle`로 쓰므로 케이스 분리가 필요하다 (`TODO.md` D-19)
- **문구 원본은 Components의 `Checkout Agreement Copy` 프레임이다.** 6개 세트가 다 있으니 새로 쓰지 말고 여기서 가져온다. 화면별 배정은 아래와 같다 (08-31 전수 확인 완료)

| 세트 | 적용 화면 |
|---|---|
| Subscription | Individual Monthly, Individual Annual, **Enterprise Single** |
| Free Trial | Individual Trial |
| Student | Checkout Student 2프레임 (`7793:1681`, `7875:2476`) |
| Prepaid New Purchase | Enterprise Team, Academics, Academics 50% |
| Add Seats / Extend | 원장이 단독 케이스로만 정의 — **결합 케이스 문구 없음** |

- **★ 케이스는 화면 수만큼만 만든다 (2026-08-31 Josh 확정).** 새 상황을 만나면 케이스를 늘리기 전에 **쓰이지 않는 케이스가 있는지 먼저 본다.** Add/Extend 결합 케이스를 8번으로 새로 만들려다, 구 케이스 5(Add Seats)와 6(Extend)을 **쓰는 화면이 하나도 없다**는 것을 확인하고 셋을 하나로 합쳤다. 원장 케이스가 8개가 될 뻔한 것이 6개로 줄었다
  - 합치는 방식은 Student와 같다. **선택하지 않은 항목이 자기 얘기가 아님이 읽히도록** 쓴다. `Your extension`이 아니라 `An extended term`이라고 쓰면 연장하지 않은 사람에게 없는 걸 있다고 말하지 않는다
  - **★ 08-31 2차 통합 — 5개가 됐다.** 개인 계열도 `The license`로 주어를 통일하자 구독 케이스 둘(개인 구독, Enterprise Single)이 3번 항목 하나만 남기고 같아졌다. 그 한 줄을 `The subscription is charged automatically at the start of each billing period.`로 쓰면 월간·연간·월간고정을 다 덮어서 합쳐졌다. **주기를 문구에 쓰지 않는 이유**: 같은 화면의 Billing Preference와 Order Summary `Next Payment`에 이미 보인다
  - 현재 5개: 1 Subscription(개인 구독 + Enterprise Single) · 2 Free Trial · 3 Student · 4 Prepaid 신규 · 5 Add Seats and Extend
  - **주어 규칙 최종**: 라이선스를 지칭하면 `The license` / `The subscription`. `you`·`your`는 **사람이 행위자이거나 사람에게 귀속되는 자리에만** 남긴다 (`I agree` · `Cancel before` · `If you cancel` · `You can request a refund` · `If you already used` · `gives you`)
  - 2번과 3번은 합치지 않았다. 무료 기간 길이와 이름이 다르고 환불 조건이 반대(24시간 가능 vs 불가)라 합치면 둘 다 뭉개진다
- **(해소됨) Add/Extend 화면은 세트가 없었다.** Seat 추가와 기간 연장을 한 결제로 함께 받는데(`8182:1899`) 원장은 둘을 따로 쓴 세트만 갖고 있다. 08-31 현재 선불 New Purchase 세트를 임시로 달고 있으며 신규 문구 작성 중 (Josh 의뢰)
- 특징: 개별 항목을 노트로 쪼개지 않고 그룹 1개로 둔다. CTA 활성 조건과의 연결을 명시
- 최초 발견: Checkout — Enterprise Team (`7223:182` / Note 8 `7228:140`) — **이 노드는 2-step 전환 중 삭제됨(08-24 확인)**
- 재등장: Checkout Enterprise Team — Step 2 (`7172:3150` / Note⑧ `7913:1589`) — **불일치 발견**: 정책 §14.1(2026-08-23)은 통합 체크박스 1개(License Agreement·Refund Policy 링크 + 조건부 자동 청구 고지) 구조로 확정됐으나, 화면은 체크박스 없이 안내 문구 5줄만 노출하는 구(舊) 구조. 이 화면 기준으로는 Description을 정책값대로 쓰지 않고 **현재 화면 그대로 기술 + WF 갱신 필요 플래그**로 처리 — 정책이 확정됐다고 화면과 다른 내용을 노트에 써넣지 않는다 · **Enterprise Single (`7782:28043` / Note③ `8008:1556`)** — 항목 구성이 **구독 케이스**(자동 청구, 다음 청구일 전 취소, 환불 불가)라 선불 케이스와 다르므로 파생 프레임에서도 **케이스 고유 노트로 유지**한다. 선불 5항목이 그대로인 프레임(Academics)은 노트를 만들지 않고 `Organization 공통`으로 넘긴다. **★ 08-25 — Team Step 2의 Note⑦⑧이 현재 파일에서 사라진 상태 확인**(Screen 배지 ⑦⑧은 남아 있고 Note⑥ 본문이 "⑦ 참조"를 하고 있어 끊긴 참조). Josh 지시로 Team 프레임은 건드리지 않음 — 복원은 별도 판단

### 결제 실행 CTA 버튼
- 판단: L1 — Q2 O · Q3 O
- 상태 목록: Default(비활성) · 결제수단별 문구 3종 · Loading(버튼 내부 인디케이터) · Disabled
- 특징: 문구가 **다른 컴포넌트의 선택값에 종속**된다. 활성 조건은 단독 불릿으로 나열하고, 다중 실패는 `실패 케이스:` 블록으로 분리
- 최초 발견: Checkout — Enterprise Team (`7223:182` / Note 9 `7228:147`) — **이 노드는 2-step 전환 중 삭제됨(08-24 확인)**
- 재등장: Checkout Enterprise Team — Step 2 (`7172:3150` / Note⑦ `7913:1596`) — 화면 라벨 "Agree and checkout"은 placeholder, 실제 문구는 결제수단별 4종(§14.2)이라고 노트에 명시 + WF 갱신 필요 플래그

### Tax ID 입력 필드 *(신규)*
- 판단: L1 — Q2 O (Default/Filled/Error) · Q3 O (입력)
- 상태 목록: Default("Please write down tax ID" placeholder) · Filled · Error
- 특징: Organization 그룹의 Enterprise·Indie 플랜 + 청구지 국가 EU인 경우에만 노출(조건부 노출 1건, 레이블 없이 단독 불릿). 입력 시 역과세 적용 → Order Summary 세금 행 문구 변경까지 인터랙션 성공 결과로 기술. Error 처리는 D-1 미결과 동일 사안이라 교차 참조
- **2026-08-25 갱신**: Indie는 웹 판매 제외로 대상에서 삭제 — 조건은 **Enterprise 그룹 + 청구지 EU**만 남는다. Academic은 여전히 미노출
- 최초 발견: Checkout Enterprise Team — Step 2 (`7172:3150` / Note⑤ `7913:1575`)
- 재등장: Components 섹션 `COMPONENTS: BILLING INFORMATION`(`7991:1582`) — Description 작성 완료 (2026-08-26), ②Enterprise(`7995:1579`). 무효 Tax ID 처리는 D-1과 같은 사안이라 노트에 미결 플래그로 남겼다. **화면 오류 1건 (Josh 수정 대기)**: Enterprise 케이스 더미 주소가 미국인데 Tax ID 행이 노출된다 — 노출 조건이 청구지 EU라 더미를 EU로 바꿔야 정합

### Sub Total Breakdown (구 Seat 계산 박스)

**★ 2026-08-31 소유 이전. 이 컴포넌트는 Seats를 떠나 Order Summary로 갔다.**

Seats 카드에서 계산 박스를 제거하고, 계산식을 Order Summary의 **Subtotal 하위 들여쓴 음영 박스**로 옮겼다. 같은 이름이 두 자리에 쓰이던 혼동이 없어졌다.

```
Subtotal                          47,000 USD
┌ 들여쓴 음영 박스 ────────────────────────┐
│ Extra Seats                              │
│ 5 Seats x 1,400 USD            7,000 USD │
│ Extension                                │
│ 10 Seats x 2,000 USD x 2 Year 40,000 USD │
└──────────────────────────────────────────┘
```

- 행마다 항목명과 산식을 두 줄로 쓰고 오른쪽에 금액을 둔다
- New인 경우 `Seats` 1행, Add/Extend인 경우 `Extra Seats`와 `Extension` 2행, **개인 계열은 박스 자체가 없다**
- `{seatCount}`와 `{unitPrice}` 정의도 Order Summary 구성 노트로 함께 옮겼다. 값이 표시되는 쪽이 정의를 소유한다
- **부작용**: 계산 박스가 빠지면서 Seats의 Academics 두 케이스가 화면상 같아졌다. 이제 차이는 선택한 프리셋뿐이고 할인 판정 표기는 Order Summary가 갖는다
- 실물: `COMPONENTS: SEATS`(`8061:1775`) 케이스 6종에서 제거 완료, `COMPONENTS: ORDER SUMMARY`(`7992:1568`) 케이스 7종에 반영

아래는 이전 기록이다.

### (구) Seat 계산 박스 *(2026-08-25, 08-31 소유 이전으로 대체됨)*
- 판단: L1 — Q1 독립 영역 O (음영 박스) · Q2 O (할인·분해 상태)
- 상태 목록: Default · 할인 미적용 · 할인 적용 · 분해(추가분/연장분)
- 특징: Seat 프리셋과 **별개 컴포넌트**다. 프리셋은 입력, 이 박스는 산식과 결과 표시. 화면에 보이는 금액·단가는 쓰지 않고 **어떤 조건에서 어떤 행이 나오는지**만 기술한다
- 케이스별 형태:
    - New(Team·Academics): 단일 계산 행 + Subtotal
    - Add/Extend(Team): `Extra Seats`(기존 만료일까지 일할) + `Extension`(총 Seat × 단가 × 연수) 2행 `조건부 노출:` — 하나만 지정하면 그 행만 노출, 둘 다면 합산
    - Academics 할인: 10석 이상 지정 시 50% 할인. 미달이면 남은 수량 안내, 적용되면 할인 전 금액 취소선 + 할인 후 금액 강조
    - Single: 프리셋 없음, 단가만 반영 + 소계에 결제 주기 병기
- **★ Description은 "몇 행"이 아니라 "어떤 계산 요소가 들어가는지"를 쓴다 (2026-08-26 Josh 지적).** 행 개수는 화면을 보면 아는 것이라 `figma-description.md` §4.2의 "화면에서 보이는 것" 금지에 걸린다. `계산 박스 요소:` 뒤에 들어가는 값을 나열하고, 결과는 소계로 맺는다
    - ❌ `계산 박스는 1행 — 지정한 Seat 수와 단가를 곱한 금액`
    - ✅ `계산 박스 요소: 지정한 Seat 수, 플랜 단가` + `소계는 두 값을 곱한 금액`
- **계산 요소는 케이스가 정한다 (2026-08-26 실측)**: New는 지정 Seat 수와 플랜 단가. Add/Extend는 Extra Seats를 지정하면 추가 Seat 수, 플랜 단가, 기존 만료일까지 남은 기간이고, Period of use를 지정하면 총 Seat 수, 플랜 단가, 연장 연수다 — **연장 계산은 추가분이 아니라 총 Seat 수 기준**(예: 기존 5 + 추가 5 = 10 Seats × 단가 × 2년). 둘 다 지정하면 두 계산을 합산한다. 화면 라벨은 `Seats` / `Extra Seats`(부제 `Prorated to current expiry`) / `Extension`(부제 `total Seats × unit price × years`), 맺음은 항상 `Subtotal`
- **Academics 할인 표기는 New 전용이 아니다 (2026-08-26 Josh 지적).** 할인 미달과 할인 적용 표기가 **Academics New와 Academics Add/Extend 양쪽**에 걸린다. 케이스 노트를 New 기준으로만 쓰면 Add/Extend에서 같은 표기가 나오는 걸 놓친다 — 양쪽 노트에 적용 범위를 명시한다
- 최초 발견: Checkout Enterprise Team - Add/Extend (`7905:5757` / Note③ `8007:1556`)
- 재등장: Academics (`7793:2008` / Note① `8009:1542`) · Academics 50% (`7793:2454` / Note① `8009:1560`) · **Components 섹션 `COMPONENTS: SEATS`(`8061:1775`)** — 5케이스를 한 화면에 모아 실측 확인. 계산 박스를 별도 노트로 쪼개지 않고 케이스 노트 안에서 `계산 박스는 ~` 불릿으로 다루고, 공통 산식은 무번호 `Seats 구성`(`8061:1820`)이 소유한다

### Checkout Header *(신규, 2026-08-25)*
- 판단: L1 — Q2 O(Individual/Student ↔ Organization으로 상태 갈림) · Q3 X(표시 전용, 인터랙션 없음)
- 상태 목록: Individual·Student(Purchase Type 줄 없음) · Organization(Purchase Type 줄 있음)
- 특징: 박스 없이 세로 스택 — `Product`(회색 라벨) → `{productName}`(볼드) → `{purchaseType}`(회색, Organization만). Seat 수량 컨트롤은 이 카드에 포함하지 않는다 — "프리셋 탭 + Custom 입력" 패턴 참조(별도 컴포넌트)
- 조건부 노출: `{purchaseType}` 줄 — Organization 계열만 표시. 값은 New · Add/Extend · Convert 3종(`checkout.md` §9, §11)
- 최초 발견: Components 섹션(`7961:8773`) — 케이스 Checkout Header 1(Individual·Student, `7982:1542`)·Checkout Header 2(Organization, `7983:1542`) 2종. 표준 WF 킷(Board Header + 1920×1080 Screen + Description) 적용
- **Description 작성 완료 (2026-08-26)**: 프레임 `7991:1542`, List `7991:1555` — ①Individual, Student(`7995:1540`), ②Organization(`7995:1547`), 무번호 `Checkout Header 구성`(`8056:1525`). Screen 배지 ①②(`8056:1529`, `8056:1532`) 신설. 변수 정의(`{productName}`, `{purchaseType}`)를 케이스 노트에서 구성 노트로 이관
- 재등장: —

### Billing Preference *(신규, 2026-08-25, 08-25 정정)*
- 판단: L1 — Q2 O(Annual/Monthly 선택 카드) · Q3 O(클릭으로 선택 전환)
- 상태 목록: Default — 카드 2개(Annual·Monthly), 하나는 선택(orange border+checkmark), 하나는 미선택(gray border)
- 특징: **Individual·Student 전용 컴포넌트다.** Organization 계열은 이 카드를 쓰지 않는다 — Organization에서 같은 위치의 개념은 **`Seats` 카드**(수량 선택, 별도 컴포넌트 — "프리셋 탭 + Custom 입력" 패턴과 Components 섹션 `COMPONENTS: SEATS` `8061:1775` 참조)이며 이름과 컴포넌트가 다르다. **08-25 Josh 정정** — 이전에 "Organization 고정 라벨(Billing Preference 2)"로 잘못 기술했던 것을 제거함. "Billing Preference"라는 이름 자체가 Individual/Student 전용이라 Organization엔 존재하지 않는다
- 실측 스펙: 카드 2개 HORIZONTAL(gap 15), 각 카드 169×82, 흰 배경, radius 8, padding[10,16,10,16]. 선택: stroke `#DF4D18`(0.8745,0.3022,0.0941) + 제목·체크마크(Vector 1, 11×7) 동색, 미선택: stroke `#D1D1D1`(0.82). Annual 카드는 항상 "Save {annualSavings} per year" 서브텍스트 보유(선택 여부 무관, orange 고정) — 가격 텍스트는 미선택일 때만 Bold+orange(마케팅 강조), 선택 시 Regular+black으로 전환. Monthly 카드는 서브텍스트 없음, 가격은 항상 Regular+black
- 조건부 노출: 기본 선택 = Annual(plan.md §4-1). `{annualRate}`/`{annualSavings}`/`{monthlyRate}` = 플랜별 실제 금액
- 최초 발견(실제 컴포넌트): Checkout Individual 계열 화면(`7792:28688` — Annual 선택 기본형) · 동일 패턴 재등장 다수(`7956:8284`, `7956:8516` 등, Monthly 선택형 포함)
- **★ 2026-08-26 — 케이스가 3종으로 확정됐다.** 카드 수가 **진입 플랜에 따라 달라진다** — 화면 기준: Individual Monthly 진입은 카드 2개(Annual 미선택, Monthly 선택), Individual Annual 진입은 Annual 1개, Student는 Monthly 1개(Annual 옵션 없음, `plan.md` §3). 단일 카드 케이스는 선택 상태로 표기한다 — `plan.md` §4-1이 "Default 선택은 Annual, 모든 Checkout 화면 공통"으로 규정하므로 Individual Annual 카드도 선택이 맞다. **진입 플랜별 카드 노출 규칙 자체는 원장에 없어 미결 플래그로 남겼다**
- 재등장: Components 섹션(`7961:8773`) — 표준 WF 킷 적용. Billing Preference 2(Organization)는 존재하지 않음으로 정정. **Description 작성 완료 (2026-08-26)**: 프레임 `7991:1562`, List `7991:1575` — ①Individual Monthly 진입(`7995:1556`), ②Individual Annual 진입(`8056:1535`), ③Student 진입(`8056:1542`), 무번호 `Billing Preference 구성`(`8056:1549`). Screen 배지 ①②③(`8056:1553`, `8056:1556`, `8056:1559`) 신설

### Coupon *(신규, 2026-08-25)*
- 판단: L1 — Q2 O(목록/적용/빈 상태) · Q3 O(항목 클릭 → 모달)
- 상태 목록: 미적용(트리거 필드) · 적용됨(쿠폰 표기) · 목록 모달 · 코드 입력
- 특징: 트리거 필드는 **입력창이 아니라 목록 모달 진입 트리거**다. 코드 등록은 목록 모달 안의 `+ Add Coupon`으로 들어가는 별도 단계
- **적용됨 표기는 목록 카드와 같다** — `[{couponRate} | {couponDuration}] {couponName}`. 할인액은 이 컴포넌트가 아니라 Order Summary의 Coupon에 노출한다
- 조건부 노출: Individual Monthly·Annual **최초 구매에만** 컴포넌트 자체가 노출. 그 외 모든 케이스(Organization 전체, 갱신·재구매, Trial 등)는 컴포넌트가 아예 없음 — Empty 상태와 혼동하지 않는다
- **★ 2026-08-25 개편 — 케이스 재정의.** 구 4종(목록/적용됨/**비어있음**/**모달 에러**)에서 화면 기준 4종(**미적용 / 적용됨 / 목록 모달 / 코드 입력**)으로 바꿨다. 빈 목록은 화면 시안이 없어 `목록 모달`의 Empty 상태로 흡수, 코드 검증 에러는 `코드 입력`의 Error 상태로 흡수
- **변수 정의는 무번호 `Coupon 구성` 노트 한 곳에** 모은다 — 케이스 노트는 표시 문자열에서 쓰기만 하고 다시 정의하지 않는다. 표기 형식은 **구성 노트 표기 규약** 참조(`Order Summary 구성` 방식이 정본)
- 최초 발견: Components 섹션(`7961:8773`) `COMPONENTS: COUPON`(`7992:1542`) — Screen `7992:1551`, Description List `7992:1557`: ①미적용(`8033:1525`)·②적용됨(`8033:1532`)·③목록 모달(`8033:1539`)·④코드 입력(`8033:1546`)·무번호 구성(`8033:1553`), 배지 ①~④(`8033:1557`~`8033:1566`). 구 노드 `7983:16xx`와 `7996:15xx`는 삭제됨
- 재등장: —
- 주의: 케이스 라벨과 **레이어 이름이 실제 렌더와 어긋날 수 있다.** 적용됨 필드는 레이어명이 `{couponCode} · -{discountAmount}`인데 실제 렌더는 쿠폰 배지+이름이었다 — `characters`를 읽어서 쓴다 (`figma-feature-naming.md` §8-4)

---

### 파일 업로드 필드 *(신규, 2026-09-01)*
- 판단: L1 — Q2 O (Default/Uploaded/Error) · Q3 O (파일 선택)
- 상태 목록: Default(기본 아바타) · Uploaded(업로드된 이미지)
- 특징: 트리거와 모달을 노트 하나로 통합한다. 모달 안의 Edit Image, Set to Default, Save를 같은 노트에서 다룬다
- 필수 4항목: 허용 형식(확장자 나열) · 선택 시 검사(유효/무효) · 실패 케이스 2종(형식, 크기) · 저장 성공/실패 토스트
- **형식 표기는 두 곳이 다르다.** Description은 확장자 전부(`jpg, jpeg, png, gif, bmp`), 사용자 문구는 대표 형식만(`JPG, PNG, GIF, or BMP`). jpeg는 jpg와 같은 형식이라 화면에서 둘 다 적으면 문구만 길어진다
- **제외 형식의 사유를 노트에 쓰지 않는다.** SVG는 XSS 우려로 뺐지만 부재를 설명하지 않고 허용 형식만 진술한다
- 에러 문구: `"This file type isn't supported. Use JPG, PNG, GIF, or BMP."` · `"This file is too large. Choose a file under {maxFileSize}."`
- 최초 발견: My Page_Main (`5933:2848` / 노트 ④ `5950:1794`) — 근거는 Arden Figma 코멘트(`5950:1789`). 크기 상한은 D-22로 미결

---

## 레이아웃 패턴

포맷:
```
### {패턴명}
- 구조: {요약}
- 적용 화면: {목록}
```

### Description List 오버플로 — Contents 높이 확장
- 구조: WF 프레임은 `2448×1216`이 기본이지만, Numbered Note 9개 이상이면 Description List가 1080을 초과한다. 이때 **Screen을 `layoutSizingVertical = FIXED` + 1080으로 고정**하고 `Contents`를 `Description List 높이 + 24`로 resize한다. 프레임(VERTICAL·AUTO)이 따라 늘어난다
- 주의: `resize()` 후 `primaryAxisSizingMode` · `counterAxisSizingMode`를 재설정한다 (`figma-draw.md` 패턴 3)
- 주의: Screen을 FILL로 두면 1080 아래가 빈 흰 화면으로 늘어난다 — FIXED가 맞다
- 적용 화면: Checkout — Enterprise Team (`7223:182`, 최종 높이 3237) · `COMPONENTS: BILLING INFORMATION`(`7991:1582`, 최종 높이 1340 — 노트 5개로 List가 1180)
- **섹션이 세로로 이어지면 아래 섹션까지 내린다 (2026-09-01).** MyPage는 프레임이 아니라 섹션이 세로로 쌓여 있다. My Page_Main 노트 ④가 173에서 407로 늘자 Description이 180px 잘렸고, Contents를 2159로 키우니 프레임이 2295가 되어 아래 Account 섹션과 겹쳤다. 섹션 높이를 +180 하고 부모 섹션의 자식 중 `y >= 2463`인 것을 **섹션과 낱개 프레임 가리지 않고 전부** 180px 내려 해소했다. 낱개 이미지가 특정 섹션 안에 얹혀 있는 경우가 있어 섹션만 옮기면 어긋난다
- **Screen이 FILL이면 같이 늘어난다.** MyPage Screen은 흰 배경 FILL이라 Contents를 키우자 아래 180px가 빈 흰 화면이 됐다. Screen을 `layoutSizingVertical = FIXED` + 원래 높이로 되돌려야 한다

- **행이 늘어나면 아래 프레임을 전부 다시 내린다 (2026-08-26).** Components 섹션은 세로 1열이라 한 프레임이 커지면 다음 프레임과 겹친다. Billing Information이 1216에서 1340으로 늘자 Coupon과 4px 겹쳤고, Coupon(4189→4313)과 Order Summary(5817→5941)를 각 124px 내리고 섹션 높이를 7738로 키워 해소했다. **행 간격은 120px 고정** — 프레임 높이가 규격을 벗어나도 이 간격은 유지한다

---

## 케이스 노출 매트릭스 축 전환 (2026-08-27 Josh 확정)

케이스별 노출 Spec Doc은 **케이스를 열, 컴포넌트를 행**으로 놓는다. 2026-08-24의 "케이스를 행으로" 판단은 이 결정으로 대체됐다. 노출 방법까지 담게 되면서 컴포넌트를 행에 두는 쪽이 맞아졌다.

셀은 노출 여부와 노출 방법을 함께 담는다.

```
O
O (형태, 상태)
X
X (사유)
*(정책 확인 필요: 무엇을 정해야 하는지)*
```

노출 형태는 통제 어휘를 쓴다.

```
카드 2개, 카드 1개, 카드 목록, 프리셋 탭, 입력 행, 트리거 필드,
읽기 전용 라벨, 읽기 전용 행, 배너, 금액 행, 계산 박스, 통합 체크박스
```

- **무신호 행은 만들지 않는다.** 전 케이스가 같은 값이면 행을 없애고 각주로 내린다. 각주는 `전 케이스 공통 노출`과 `전 케이스 미노출` 두 블록이다
- 케이스가 6개를 넘어 열이 좁아지면, 차이가 한 행에만 나타나는 케이스는 열을 나누지 않고 그 셀 안에서 조건으로 처리한다. Academics 할인 미달과 적용을 계산 박스 셀 하나에 넣은 것이 그 예다
- 폭: content 1792에서 컴포넌트 라벨 열을 뺀 값을 케이스 수로 나눈다. 6케이스면 256px, 12케이스면 131px이다
- **컴포넌트 이름은 화면에서 쓰는 영문 레이블로 쓴다** (2026-08-27 Josh 확정). `지불 방식 토글`이 아니라 `Billing Preference`, `계산 박스`가 아니라 `Sub Total Breakdown`이다. 화면에 레이블이 없는 컴포넌트는 Description과 patterns에서 쓰는 영문 컴포넌트명을 쓴다(`Existing Subscription Notice`, `Terms Agreement`, `Checkout CTA`, `Order Summary Totals`)
- **개인 계열과 Organization을 한 표로 합친다** (2026-08-27 Josh 확정). 케이스 12열, 컴포넌트 12행이다. 계열 경계는 헤더 위 **그룹 행**으로 표시한다(첫 열은 비우고 각 계열의 첫 열에만 `Individual`, `Organization`을 적고 하단 border를 없앤다)
    - 12열이면 셀 폭이 131px이라 부연을 짧게 유지해야 한다. `O (프리셋 탭)`처럼 형태만 쓰고, 프리셋 값과 산식 같은 상세는 각주 `셀 부연` 블록으로 뺀다
    - 합친 표에는 계열 전용 컴포넌트 때문에 X 블록이 크게 생긴다. 이것은 낭비가 아니라 **계열 경계를 보여주는 신호**로 읽는다
- **★ 셀에 위젯 수를 세지 않는다 (2026-08-27 Josh 지적).** `카드 2개`, `프리셋 탭`, `1항목`, `합계 2개`는 화면을 보면 아는 것이라 읽는 사람에게 정보가 없다. **무엇이 보이는지**를 쓴다
    - `O (카드 2개, Monthly)` 대신 `O (Annual and Monthly 선택)`
    - `O (카드 1개, Annual)` 대신 `O (Annual만 제공)`
    - `O (프리셋 탭)` 대신 `O (5, 10, 20, Custom)`
    - `O (1항목)` 대신 `O (Seat 수 × 단가)`
    - `O (합계 2개)` 대신 `O (Total, Next Payment 배너)` (09-03 라벨 재개정과 배너 전환 반영)
    - 이 실수는 계산 박스에서 지적받은 것과 같은 계열이다. 형태를 세지 말고 내용을 쓴다 ([[feedback_calc_box_elements_not_rows]])
- 셀에서 빠진 규칙은 각주 `컴포넌트별 노출 방법` 블록에 컴포넌트당 한 줄로 내린다
- **프레임 폭이 밀리는 함정.** 케이스 열을 FILL로 두면 긴 셀이 열을 밀어내 프레임이 1920을 넘는다(실측 2096까지 늘었다). 재구성 후 `counterAxisSizingMode = 'FIXED'` + `resize(1920, height)`로 되돌리고 `primaryAxisSizingMode = 'AUTO'`를 다시 세운다
- 실물: `Checkout Case Matrix`(`7876:1479`, 1920×1488). 각주는 `컴포넌트별 노출 방법`, `전 케이스 공통 노출` 두 블록이다
- **v1 대비 정정 2건**: `Annual 최초`의 지불 방식이 v1에서 `X (Annual Only)`였으나 컴포넌트는 노출되고 카드가 1개다. `재구매`의 Coupon이 v1에서 `O`였으나 `checkout.md` §5는 최초 구매에만 노출로 규정한다

---

## Checkout 2컬럼 레이아웃 (2026-08-31 확정)

`checkout.md` §6이 규정한 `Order Summary, 약관, CTA` 우측 컬럼 배치를 실제로 적용한 형태다. 1컬럼이 규정 이탈이었다.

```
Screen 1920 × 1080
└ wrap        x=360   1200 wide      ← 좌우 여백 360 대칭
  ├ 좌 컬럼   x=0      720
  └ 우 컬럼   x=1094   466           ← gap 14
```

우 컬럼 내부 순서는 `Order Summary` 제목(음영 카드 **밖**), 음영 카드(금액 패널, 약관, CTA)다.

- **좌 컬럼**: Product, Seats 또는 Billing Preference, Billing Information. 입력 폼만
- **우 컬럼**: 금액과 동의와 실행. 세로가 절반 가까이 줄어 프레임이 표준 2448×1216으로 돌아온다
- **약관이 CTA 위**다. 1컬럼은 반대였다
- 우 컬럼은 새로 그리지 않고 **`COMPONENTS: ORDER SUMMARY`(`7992:1577`)의 케이스 변형을 clone**한다. 케이스별 변형이 이미 만들어져 있다
- **약관 문구는 대상 프레임의 것을 살린다.** 컴포넌트 변형이 케이스에 맞지 않을 수 있다. Enterprise Single은 구독 6항목인데 변형은 선불 문구를 갖고 있었다
- **세금 행은 세 조각**이다. `VAT`(Medium, 진한 색) 더하기 `{세율} applied`(회색 이탤릭) 더하기 `+ {금액}`. **명칭은 `VAT`로 고정한다 (2026-08-31 Josh 확정).** 케이스·국가와 무관하며 `Tax`를 쓰지 않는다. Order/Checkout 페이지 전체를 일괄 전환했다 — 화면 5프레임, `COMPONENTS: ORDER SUMMARY` 케이스 변형 7개와 참조 블록, Trial의 `VAT (if applicable)`, Trial·Student의 세금 병기 문구, `Order Summary 구성` 노트. **`Tax ID`는 필드 이름이라 그대로 둔다.** 국가별 분기 규정은 Description이 갖는다
- **세금 계산은 `(Subtotal - Discount) × 세율`**이다. 할인을 먼저 뺀다. Academics 50%가 이걸 드러낸다: `(3,000 - 1,500) × 10% = 150`. 할인 전에 붙이면 300이 되어 틀린다

### 개인 계열 적용 (2026-08-31 완료)

Organization과 같은 규격으로 `Checkout_Individual` 5프레임을 전환했다. **프레임은 4개가 아니라 5개다** — Student가 `Benefit applied`(`7793:1681`)와 `Benefit used`(`7875:2476`) 두 케이스다.

전환 전에는 5프레임 모두 1컬럼 750이었고 **약관과 CTA가 `Frame 2560`으로 Screen 밖 y≥1080에 떠 있어** 높이가 1726~1789였다. 전부 2448×1216으로 돌아왔다.

- 전환 절차: `Header Default`를 Screen 루트로 올림 → 새 `Frame 2573`(720, VERTICAL gap42) x=360 y=162 생성 → `ContentArea`를 그 안으로 옮기고 FILL + 세로 HUG → `Frame 2542`(구 Order Summary)와 그 위 divider 제거 → 변형 clone을 x=1094 y=162에 배치 → `Frame 2560`과 `Page` 래퍼 제거 → Screen 1920×1080 재설정
- **`ContentArea`의 세로가 FIXED로 남아 있으면 좌 컬럼 배경이 내용보다 길게 늘어난다.** 옮긴 뒤 `primaryAxisSizingMode='AUTO'`로 되돌린다
- **Annual만 구조가 달랐다.** 나머지는 `Page` + `Frame 2560`인데 Annual은 `Frame 2578` 하나에 전부 들어 있었다
- 배지는 좌 컬럼 x=343, 우 컬럼 x=1061. y는 앵커 텍스트의 절대 y에서 Screen 절대 y를 뺀 값

### `COMPONENTS: ORDER SUMMARY` 개인 계열 변형

Organization은 변형이 다 있었지만 개인 계열은 2개뿐이었고 **화면에 있는 `Next Payment` 행이 변형에 없었다.** 그대로 clone하면 그 행이 사라진다. 변형에 먼저 추가하고 없는 케이스 3개를 신설했다.

| 배지 | 변형 | 금액 |
|---|---|---|
| 9 | Individual Trial | 오늘 0, `VAT (if applicable)`, First Payment 308 |
| 10 | Student: Benefit applied | 8.25 − 8.25 = 0, VAT 0, First Payment 9.08 |
| 11 | Student: Benefit used | 8.25, VAT 0.83, 합계 9.08, Next Payment 9.08 |

- `Next Payment` 행을 다른 폭의 프레임에서 clone하면 **왼쪽 라벨 프레임이 FIXED 350으로 따라와 금액이 밀려 잘린다.** append 후 `layoutSizingHorizontal='HUG'`로 바꾼다
- 날짜는 월을 단어로 쓴다. 더미 기준일은 `November 12, 2026`이고 케이스별로 무료 기간과 결제 주기를 반영한다 — Monthly `December 12, 2026` · Annual `November 12, 2027` · Trial `November 26, 2026` · Student benefit `February 12, 2027`
- **무료 기간은 Discount로 드러낸다** (Josh 확정). 정가를 Subtotal에 두고 무료분을 Discount로 전액 차감하며 캡션은 `Student Benefit applied`. `Subtotal 0`으로 두면 정가가 화면에서 사라진다

### CTA 문구는 컴포넌트가 소유한다

결제수단별 문구 4종(`Pay with Card` · `Pay with AliPay` · `Continue to PayPal` · `Continue`)은 케이스와 무관하므로 `Order Summary 구성` 노트가 소유한다. 화면 노트는 **그 케이스의 필수 항목만** 쓴다. 개인 계열은 `결제수단, 약관 동의 체크`로 Organization보다 짧다 — Seat가 없다.

### 작업 시 함정 3가지

- **배지 앵커를 화면 전체에서 찾지 않는다.** `Product`로 검색하면 GNB 메뉴가 먼저 잡힌다. 좌 컬럼 앵커는 wrap 안에서, 우 컬럼 앵커는 clone 안에서 찾는다
- **CTA 배지는 텍스트가 아니라 버튼 프레임에 붙인다.** 텍스트가 버튼 가운데 정렬이라 배지가 버튼 안으로 들어간다
- **배지를 Screen 최상위 레이어로 올린다** (Josh 지시). clone을 appendChild하면 배지 위를 덮는다. 작업 끝에 배지를 다시 appendChild한다

### 적용 완료 (Checkout_Organization `7793:2634`)

| 프레임 | node-id | 우 컬럼 clone 출처 |
|---|---|---|
| Checkout Enterprise Team - Add/Extend | `7905:5757` | Josh 예시 |
| Checkout Enterprise Team | `7172:3150` | `8185:2673` Enterprise Team New |
| Checkout Enterprise Single | `7782:28043` | `8185:2878` Enterprise Team Single |
| Checkout Academics | `7793:2008` | `8182:2047` Academics New Discount x |
| Checkout Academics - 50% Discount applied | `7793:2454` | `8182:2205` Academics New Discount O |

---

## 구성 노트 표기 규약 (2026-08-26 Josh 확정)

무번호 `{컴포넌트명} 구성` 노트(`Order Summary 구성` · `Coupon 구성` 등)에서 변수·값을 정의할 때의 형식이다. **`Order Summary 구성` 방식이 정본**이고, 다른 구성 노트를 이 방식에 맞춘다.

**값에 조건이 2개 이상 걸리면 값을 불릿으로 올리고 조건별 설명을 서브불릿으로 쪼갠다.** 한 줄에 쉼표로 압축하지 않는다 — 설명 대상이 무엇인지 한눈에 보여야 한다 (독자 가독성, Josh 지시).

```
❌ - {subtotal}: 선불인 경우 단가 × Seat 수, 구독인 경우 선택한 지불 주기의 플랜 정가

✅ - {subtotal}
     - 선불인 경우 단가 × Seat 수
     - 구독인 경우 선택한 지불 주기의 플랜 정가
```

- `변수:` 카테고리 레이블을 두지 않는다. 변수명 자체가 최상위 불릿이다
- 조건이 하나뿐인 항목은 `{couponName} = 쿠폰 이름`처럼 한 줄로 남겨도 된다. 조건이 갈리는 항목만 위 방식으로 승격한다
- 이 서브불릿에는 `상태:`/`옵션:`/`조건부 노출:`/`케이스 분기:` 정식 레이블이 없다 — `figma-description.md` §4.3 폐쇄 목록의 **예외**이며 **구성 노트에만** 적용된다. 상태·인터랙션을 다루는 일반 컴포넌트 노트는 정식 레이블 규칙 그대로
- 전체 계산식처럼 개별 변수 정의를 요약하는 줄은 **변수 나열보다 앞**에 둔다 (정의 → 공식이 아니라 공식 → 정의 순서면 읽는 사람이 되짚지 않는다)

---

## 화면 프레임 — 개인 계열 단일 화면 (2026-08-26)

**화면 프레임은 Components 섹션을 참조하고 케이스 차이만 쓴다 (2026-08-26 Josh 확정).**

자립형(컴포넌트 스펙을 화면에서 다시 전문으로 쓰는 방식)을 먼저 시도했다가 되돌렸다. 실물로 보면 Description List가 **3498px까지 늘어 프레임이 1789에서 3658로 두 배가 됐고**, 아래 프레임 3장을 밀어내며 섹션 전체가 재배치됐다. 읽는 사람도 같은 내용을 두 곳에서 보게 된다. 참조형으로 다시 쓰자 List 1598로 줄어 **표준 규격 2448×1789 안에 그대로 들어갔다.**

노트 한 장의 형태:

```
- Components 섹션 {컴포넌트} {케이스 번호} {케이스명}과 동일
- {이 화면에서 달라지는 것 1~2줄}
```

- **적용 프레임**: `Checkout Individual Monthly`(`7793:1366`, 섹션 `Checkout_Individual` `7854:1641` 2열 x=2659). 같은 컬럼에 Annual, Trial, Student 프레임이 이어진다
- **Components 섹션에 없는 컴포넌트만 전문으로 쓴다** — 약관 동의, 결제 실행 CTA, 페이지 상태 3개가 그렇다. 나머지 6개(Checkout Header, Billing Preference, Payment Methods, Billing Address, Coupon, Order Summary)는 참조 + 차이
- **노트 구성 — 무번호 2개 + 번호 8개**: 무번호 `Page Context` → ①Product ②Billing Preference ③Payment Methods ④Billing Address ⑤Coupon ⑥Order Summary ⑦결제 실행 CTA ⑧약관 동의 → 무번호 `페이지 상태`
    - **GNB는 쓰지 않는다** (Josh 지시). 로그인 상태 GNB 자체가 미설계라 근거가 없다
    - Billing Information을 **Payment Methods와 Billing Address 두 노트로 쪼갠다** — 둘 다 자체 상태와 인터랙션을 가지므로. 컴포넌트 패턴도 별개로 등록돼 있다
    - 약관과 CTA도 별개 노트다. 화면에서 한 블록에 붙어 있어도 컴포넌트가 둘이다
    - 페이지 레벨 Loading·Error·리다이렉트는 배지가 붙을 자리가 없어 **무번호 `페이지 상태` 노트**로 뺀다. 진입 조건과 상태 복원은 Page Context가 갖는다
- **배지는 한 열로 정렬한다.** 카드마다 왼쪽 33px에 붙이면 카드 들여쓰기 차이 때문에 x가 흔들린다 — 가장 왼쪽 값으로 통일해 거터 열을 만든다 (이 프레임은 x=552)
- **Contents `counterAxisAlignItems`를 MIN으로 둔다.** Description이 길어져 Contents가 커지면 기본값 CENTER 때문에 Screen이 세로 가운데로 떠서 위아래에 큰 흰 여백이 생긴다
- 이 프레임 실측(참조형): List 1598 → Contents 1653 → 프레임 1789, 섹션 7587. 표준 규격 유지

---

## Description 문구 재사용 조각

동일한 의미로 반복 등장하는 불릿(예: 기본 토스트 문구, 공통 에러 문구)을 여기 모아 복붙 소스로 쓴다.

```
- 상태:
  - Loading: Skeleton 표시
```

```
  - Error: "Couldn't load this list" 인라인 에러 + "Try again" 노출
```

```
  - 실패: "Something went wrong. Please try again." 토스트 노출
```

**근거 줄은 쓰지 않는다** (2026-08-12 Josh 확정). Description 본문에 `- 근거: docs/policy/...` 형태의 출처 표기를 넣지 않는다. `planner-workflow.md` §4 / `multi-terminal-workflow.md` §3의 근거 줄 규칙은 이 결정으로 무효다.

미확정 항목은 멈추지 않고 플래그로 남긴다.
```
*(정책 필요 — {무엇이 없는지})*
*(문구 필요 — {어떤 문구가 미확정인지})*
```
