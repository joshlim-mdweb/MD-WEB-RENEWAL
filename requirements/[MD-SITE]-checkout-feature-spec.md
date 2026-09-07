# [MD|SITE] Checkout 기능 명세

작성일: 2026-08-05 | 상태: 초안 — P1 미결 없음. P2 6건
기준 정책: `docs/policy/plan.md` · `checkout.md` · `member.md` · `plan-card.md`
Canvas: [[RENEWAL] Order/Checkout](https://clo3d.slack.com/docs/T04BT3VBR/F0BL0SRE4TZ)
흐름 출처: Jay Lee, [#md_web_part 2026-08-04](https://clo3d.slack.com/archives/C04599ZA9QQ/p1785824554602609)

---

## 0. 명세 축

| 축 | 값 |
|---|---|
| **구매 주체** | Member (인증 없음) · Member (Student 인증) · Organization Owner (인증 없음 / Academic / Indie) |
| **플랜** | Individual Monthly·Annual · Student Monthly · Enterprise Single·Team·Team Linux · Academic Annual · Indie Annual |
| **구매 유형** | 2원 구조 — §4-2 |

### 0-1. 플랜 그룹

| 그룹 | 플랜 | 특징 |
|---|---|---|
| **개인 계열** | Individual Monthly·Annual · Student Monthly | Seat 1 고정. SW Account 없음. 개인 주소 |
| **Organization 계열** | Enterprise Single·Team·Team Linux · Academic Annual · Indie Annual | SW Account 지정. 조직 주소 |

### 0-2. 구매 자격 (2026-08-05 확정)

**플랜 카드는 "이 사람이 그 플랜을 살 자격이 있나"만 본다. 다른 플랜 보유 여부는 막지 않는다.**

| 카드 | 활성 조건 |
|---|---|
| Individual | 누구나 (Non-Member 포함) |
| Student | Student 인증 완료 |
| Enterprise (3종) | 누구나 — Organization 없으면 생성 단계 경유 |
| Academic | Academic 인증 Organization |
| Indie | Indie 인증 Organization |

- Student 인증자도 Individual 구매 가능
- Organization Owner도 개인용 Individual·Student 구매 가능
- Indie 인증 Organization도 Enterprise 구매 가능 (5 Seat 초과분은 Enterprise 정가)
- → `plan-card.md`의 `For Student` / `For Individual` / `For Enterprise` **비활성 문구 전부 삭제 대상**

### 0-3. Organization 보유 개수

**한 Member는 Organization을 1개만 보유한다.** Checkout에 Organization 선택 단계는 없다. 이미 1개 보유 시 추가 생성을 차단한다.

---

## 1. 공통 기능

| ID | 기능 | 설명 |
|---|---|---|
| CM-01 | 진입 권한 검사 | 비로그인 시 로그인 리다이렉트. `?redirect=` 유지 |
| CM-02 | 진입 차단 검사 | Student 4년 경과 / Academic·Indie 인증 Pending 시 차단 |
| CM-03 | 플랜 정보 로드 | 상품명·단가·지불 방식 read-only 표시 |
| CM-04 | Billing Address 조회 | §3 |
| CM-05 | 세액 계산·가격 확정 | §3-3 |
| CM-06 | 결제 수단 구성 | **Billing Address 국가** 기준 — §3-7 |
| CM-07 | Order Summary 렌더 | 소계 · 세금 · 합계 |
| CM-08 | 약관 동의 | 체크박스 2개 |
| CM-09 | CTA 활성 조건 | 필수 입력 + 가격 확정 + 약관 2개 |
| CM-10 | 주소 유효성 검사 | **PG 이동 직전** — §3-4 |
| CM-11 | PG 이동 | 선택 결제 수단으로 |
| CM-12 | 결제 확정 | Avalara commit + 라이선스 활성화 + sessionStorage 삭제 |
| CM-13 | 상태 복원 | PG 뒤로가기·새로고침 시 sessionStorage 복원 |

---

## 2. 플랜별 분기 매트릭스

| 기능 | Indiv M | Indiv A | Student M | Ent Single | Ent Team | Ent Linux | Academic | Indie |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 지불 방식 토글 | 월·연 | 월·연 | 월 고정 | 월 고정 | 연 고정 | 연 고정 | 연 고정 | 연 고정 |
| Trial 진입 | O | O | — | — | — | — | — | — |
| Student Benefit 표기 | — | — | O | — | — | — | — | — |
| SW Account 지정 | — | — | — | O | O | O | O | **1개 고정** |
| 구매 유형 축 A (수량) | — | — | — | — | O | O | O | O |
| 구매 유형 축 B (계정) | — | — | — | 판정 | 판정 | 판정 | 판정 | New 고정 |
| Seat 선택 | 1 | 1 | 1 | 1 | 프리셋 | 프리셋 | 프리셋 | 최대 5 |
| 주소 출처 | 개인 | 개인 | 개인 | 조직 | 조직 | 조직 | 조직 | 조직 |
| 쿠폰 입력 | — | **O** | — | — | — | — | — | — |

> 쿠폰은 **개인 플랜 Checkout 전용**이며 그중 Annual만 가능하다. Organization 계열은 입력 UI를 노출하지 않는다. Seat 프리셋 — Enterprise Team·Team Linux `[5][10][20][직접 입력]` · Academic `[5][10][20][직접 입력]` · Indie `[1][3][5][직접 입력]`. 프리셋에 없는 수량은 직접 입력으로 지정한다. Indie는 직접 입력으로 5 이하만 지정할 수 있다.

### 2-1. 소계

| 플랜 | 소계 |
|---|---|
| Individual Monthly | $39.00 |
| Individual Annual | $280.00 |
| Student Monthly | $8.25 — Benefit 기간 중 $0.00 |
| Enterprise Single | $199.00 |
| Enterprise Team | $2,000 × Seat |
| Enterprise Team Linux | $2,300 × Seat |
| Academic Annual | $1,500 × Seat |
| Indie Annual | $800 × Seat 수 (최대 5) |

---

## 3. Billing Address & 세금

### 3-1. 조회·생성·수정

| ID | 기능 | 설명 |
|---|---|---|
| BA-01 | 조회 대상 | 개인 계열 → 개인 주소 / Organization 계열 → **조직 주소** |
| BA-02 | 관리 위치 | 개인 = MyPage / 조직 = Team Console |
| BA-03 | 주소 있음 | 주소 표시 + **[수정] 버튼** (모달) |
| BA-04 | 주소 없음 | Checkout에서 **모달로 생성**. 개인·조직 모두 동일. 저장 시 각각 개인 주소 / 조직 주소로 DB 생성 |
| BA-05 | 저장 성공 후 | **가격 재조회 API 1회 호출** → 화면 금액 갱신 |
| BA-06 | 미확정 상태 | 주소 또는 ZIP 없으면 가격 미확정. CTA 비활성 |

### 3-2. 주소 필드

| 필드 | 필수 | 세금 계산 사용 |
|---|:---:|:---:|
| 국가 | O | **O** |
| 주 (State) — 미국만 | O | **O** |
| ZIP / 우편번호 | **O (전 국가)** | **O** |
| Address line 1 · 2 | O | ✖ — 인보이스 표기용 |

### 3-3. 가격 결정

| 국가 | 세율 결정 입력 |
|---|---|
| 미국 | 국가 + **주 + ZIP** |
| 그 외 | 국가 + **ZIP** |

> EU는 ZIP이 필요하다. 카나리아 제도(ES)·마데이라(PT)·올란드(FI) 등 특별 VAT 지역이 우편번호로 갈린다.

### 3-4. 유효성 검사

**시점: PG(PayPal·Stripe) 이동 직전**

| 국가 | 검사 내용 |
|---|---|
| 미국 | 실제 주소 존재 여부 |
| 우편번호 있는 국가 | 해당 국가 안에 그 ZIP이 존재하는지 |
| 우편번호 없는 국가 (홍콩·UAE 등) | 형식만. **존재 검증 스킵** |

### 3-5. Avalara 호출

| 시점 | 호출 |
|---|---|
| MyPage · Team Console 주소 저장 | **미호출** — 저장만 |
| Checkout 진입 (주소 있음) | 조회 (uncommitted) |
| Checkout 주소 생성·수정 저장 후 | 조회 1회 |
| **Seat 수 변경** | 조회 — 과세표준이 바뀌므로 재계산 |
| **쿠폰 적용·해제** | 조회 — 세금은 쿠폰 적용 후 금액 기준 |
| 결제 확정 | **commit** — 조회 시 발급된 transaction id를 그대로 커밋 |

**주소 검증은 Avalara로 하지 않는다.** Avalara는 미국 외 주소 검증을 지원하지 않는다.

> Klay Kim, #md_web_part 2026-08-04 — "Avalara를 이용해서는 주소에 대한 검증이 불가능한 것으로 확인됩니다. 미국만 정확히 주소검증이 가능하고, EU의 경우에는 해당 Zipcode가 어느정도의 세율을 가진다 정도의 정보만"

**Avalara 계산 범위는 US(주별) + EU뿐이다.**

| 지역 | 세액 계산 주체 |
|---|---|
| US · EU | Avalara |
| KR | 10% 고정 |
| CN | ItemCode별 (CLO_PLC 13% / CLO_RLC 6%) |
| 그 외 | CLOver Admin 내 계산 |

### 3-6. 흐름

```
[Order 진입]
   ↓
Billing Address 조회 (개인 or 조직)
   ├─ 있음 → Avalara 조회 → 가격 확정 → Order Summary
   └─ 없음 → 모달로 생성·저장 → 콜백 → 가격 재조회 1회 → Order Summary
   ↓
결제 버튼 클릭
   ↓
주소 유효성 검사 (미국: 주소 실재 / 그 외: ZIP 실재)
   ↓
PG 이동 → 결제 완료 → Avalara commit
```

### 3-7. 결제 수단 노출

| 조건 | 노출 결제 수단 |
|---|---|
| **중국** — 접속 IP가 중국 **또는** 선택된 국가가 중국 | 카드 + **AliPay** |
| 그 외 (한국 포함) | 카드 + PayPal |

- AliPay는 중국 전용이다. 다른 국가에는 노출하지 않는다.
- 트리거가 IP와 국가 선택 두 가지다. Billing Address 입력 전에도 중국 IP면 AliPay를 노출한다.
- **Kakao Pay는 제공하지 않는다.** 한국도 카드 + PayPal이다.

---

## 4. Organization 계열 전용

### 4-1. SW Account

| ID | 기능 | 설명 |
|---|---|---|
| SW-01 | 목록 조회 | 보유 Organization의 SW Account 목록 |
| SW-02 | 신규 생성 | **Checkout·Team Console 둘 다 가능** |
| SW-03 | 기존 선택 | 드롭다운 |
| SW-04 | 라이선스 상태 확인 | 선택 계정의 라이선스 유무·만료일을 조회해 **축 B를 자동 판정**하고 결과를 표시 |
| SW-05 | Organization 미보유 | Organization 생성 단계 선행 |
| SW-06 | Indie 예외 | **Enduser ID 1개 고정.** 선택 단계 없음. 첫 구매 시 1개 생성 후 이후 라이선스만 추가 |

### 4-2. 구매 유형 — 2원 구조

두 축은 독립이다. 동시에 성립한다.

**축 A — Seat 수량**

| 값 | 의미 |
|---|---|
| 신규 구매 | 라이선스를 처음 구매 |
| **Add** | 기존 Organization에 수량 추가 |

**축 B — 선택한 SW Account 처리 (시스템 판정)**

사용자가 고르지 않는다. **SW Account를 선택하면 시스템이 그 계정의 라이선스 상태를 보고 판정**한다.

| 값 | 조건 | 결과 |
|---|---|---|
| **New** | 라이선스 없는 계정 (신규 생성 포함) | 신규 할당. 시작일 = 결제일 |
| **Extend** | 활성 라이선스 보유 | 기존 만료일 이후로 기간 연장 |

- **Reserve는 제공하지 않는다.**
- 노출 위치는 **SW Account 선택 과정 안**이다. 판정 결과와 근거(현재 만료일 → 구매 후 만료일)를 표시하고, 선택 컨트롤은 두지 않는다.

**플랜별 허용**

| 플랜 | 축 A | 축 B |
|---|---|---|
| Enterprise Single | 신규만 (Seat 1) | New · Extend |
| Enterprise Team · Team Linux | 신규 · Add | New · Extend |
| Academic Annual | 신규 · Add | New · Extend |
| **Indie Annual** | 신규 · **Add** | **New만** — Extend 불가 |

> MDWEB-590 원문 — "Indie 구매 가능 개수: **1개의 Enduser ID, 최대 5개의 네트워크 온라인 라이선스**", "최초 구매후 추가 결제시: 지정된 Enduser에 **Add만 가능한 구조 (Extend는 불가)**"
> → `MD-WEB-002.md`의 `Indie = Extend only`는 **오기**. 정반대다.

### 4-3. 노출 순서 (고정)

```
1. 제품 (read-only)
2. 지불 방식
3. SW Account 선택·생성        ← Indie 제외
   └ 축 B 판정 결과 표시        ← 선택 즉시. 사용자 선택 컨트롤 없음
4. Seat 수 (축 A)
6. Billing Address
7. 결제 수단
```

> 축 B는 SW Account 선택 완료 전 노출할 수 없다. 선택된 계정의 라이선스 상태로 판정되기 때문이다.

---

## 5. 플랜별 특이사항

| 플랜 | 내용 |
|---|---|
| Individual M·A | **Checkout이 Trial 진입을 겸한다.** 카드 정보를 수집해야 하므로 Trial 시작도 Checkout을 경유한다. Trial 시작 시 Monthly·Annual 중 선택 → 14일 무료 → 선택 플랜으로 자동 결제 |
| Individual Annual | **자동 갱신이 기본 동작.** Auto Renew 토글 없음. 갱신 중단은 구독 해지로 처리 (MyPage). 쿠폰 입력 가능 |
| Student Monthly | 결제 예정 금액 $0.00 + "3개월 후 $8.25 청구" 안내. **"Trial" 라벨 금지** |
| Enterprise Single | Seat 1 고정. Seat UI 미노출 |
| Enterprise Team Linux | 웹 직접 구매 가능. Contact Sales는 보조 CTA |
| Academic Annual | 인증 심사 중 구매 차단. 처리 기간 대외 미노출 |
| Indie Annual | 연 매출 $500,000 이하. 최대 5. 초과 시 Enterprise 정가. 신청 상태 미노출 |

### 5-1. Student Benefit 이용 중 Plan 카드 (제안)

3개월 무료 혜택을 이용 중인 사용자가 Plan 페이지에 왔을 때.

| 카드 | 상태 | 버튼 |
|---|---|---|
| Student | Benefit 이용 중 | **활성 — `Check my Status`** + 보조 문구 "무료 기간 종료까지 D-NN" |
| Individual | — | 활성. Student 보유가 막지 않음 (§0-2) |
| Enterprise 계열 | — | 활성. 개인 라이선스 보유가 막지 않음 |

**제안 근거** — 별도 상태를 새로 만들지 않고 `plan-card.md`에 이미 있는 `Check my Status`(라이선스 보유 시 문구)를 그대로 쓴다. 상태 하나를 덜 만들고, 사용자는 남은 무료 기간을 확인하러 갈 수 있다.

비활성 처리도 가능하나, 비활성은 "왜 못 누르는지"를 따로 설명해야 해서 문구가 하나 더 필요하다.

> Organization 계열 카드는 막지 않는다. 개인 회원 자격으로 Benefit을 쓰는 것과 조직 구매는 별개다.


---

## 6. 케이스 매트릭스

### 6-1. 진입 경로

| 코드 | 진입 경로 | 결정되는 값 |
|---|---|---|
| **EP1** | Plan 페이지 플랜 카드 → 신규 구매 | 축 A = 신규 |
| **EP2** | Plan 페이지 → Trial 시작 | 축 A = 신규 · Trial 플래그 |
| **EP3** | Team Console → Seat 추가 | 축 A = Add · 대상 Organization 확정 |
| **EP4** | Team Console → 기간 연장 | 축 A = 신규(수량 불변) · 대상 SW Account 확정 |

### 6-2. 플랜 × 진입 경로 (정상 케이스)

| 코드 | 플랜 | EP1 | EP2 | EP3 | EP4 | 비고 |
|---|---|:---:|:---:|:---:|:---:|---|
| N-01 | Individual Monthly | O | O | — | — | 지불 방식 토글 노출 |
| N-02 | Individual Annual | O | O | — | — | 지불 방식 토글 노출 · 쿠폰 |
| N-03 | Student Monthly | O | — | — | — | Trial 없음. Benefit 3개월 |
| N-04 | Enterprise Single | O | — | — | O | Seat 1 고정 → Add 불가 |
| N-05 | Enterprise Team | O | — | O | O | |
| N-06 | Enterprise Team Linux | O | — | O | O | |
| N-07 | Academic Annual | O | — | O | O | |
| N-08 | Indie Annual | O | — | O | — | **Extend 불가** → EP4 없음 |

### 6-3. 축 B 판정 (Organization 계열)

SW Account를 고르면 시스템이 판정한다. 사용자 선택 없음.

| 코드 | 선택한 SW Account 상태 | 판정 | 화면 표시 |
|---|---|---|---|
| N-10 | 신규 생성 | New | 시작일 = 결제일 |
| N-11 | 라이선스 없음 | New | 시작일 = 결제일 |
| N-12 | 활성 라이선스 보유 | Extend | 현재 만료일 → 구매 후 만료일 |
| N-13 | 만료된 라이선스 보유 | New | 시작일 = 결제일 |
| N-14 | Indie (Enduser 1개 고정) | **New 고정** | 선택 단계 없음 |

### 6-4. Billing Address 상태

| 코드 | 주소 | ZIP | 결과 |
|---|---|---|---|
| N-20 | 있음 | 있음 | Avalara 조회 → 가격 확정 → CTA 활성 가능 |
| A-01 | **없음** | — | 모달로 생성 유도. 가격 미확정 · CTA 비활성 |
| A-02 | 있음 | **없음** | 가격 미확정 · CTA 비활성. 수정 모달 유도 |
| A-03 | 있음(미국) | 있음 · 주 없음 | 가격 미확정. 주 입력 요구 |
| A-04 | 저장 성공 직후 | — | 가격 재조회 1회 → 금액 갱신 |
| A-05 | 우편번호 없는 국가 | 형식값 | 존재 검증 스킵. 국가 세율로 확정 |

### 6-5. 국가별 세액 계산

| 코드 | 국가 | 계산 주체 | 입력 |
|---|---|---|---|
| T-01 | 미국 | Avalara | 국가 + 주 + ZIP |
| T-02 | EU | Avalara | 국가 + ZIP (특별 VAT 지역 판별) |
| T-03 | 한국 | 10% 고정 | 국가 |
| T-04 | 중국 | ItemCode별 (13% / 6%) | 국가 + 상품 |
| T-05 | 그 외 | CLOver Admin | 국가 |
| T-06 | Tax ID 입력 (EU·GB·MX 등) | Avalara override | 세율 0% · `Reverse Charge` 표시 |

---

## 7. 엣지 케이스

### 7-1. 진입 차단

| 코드 | 조건 | 처리 |
|---|---|---|
| B-01 | 비로그인 | 로그인 리다이렉트. `?redirect=` 유지 후 복귀 |
| B-02 | SW Account 계정 | 해당 없음 — Web 로그인 불가로 진입 경로 자체가 없음 |
| B-03 | Student 인증 **4년 경과** | 차단 + Individual 플랜 안내 |
| B-04 | Student 플랜인데 인증 없음 | 차단 + 인증 안내 |
| B-05 | Academic 인증 Pending | 차단 + "Verification in process" |
| B-06 | Indie 인증 Pending | 차단 + 안내 |
| B-07 | Organization 계열인데 Organization 없음 | Organization 생성 단계 선행 |
| B-08 | Organization 이미 1개 보유 + 추가 생성 시도 | 생성 차단 |
| B-09 | Student Benefit 이용 중 + Student 플랜 재구매 | 차단 (이미 보유) |
| B-10 | Student Benefit 이용 중 + **Individual·Organization 플랜** | **정상 진입** — 막지 않음 |

### 7-2. 수량 · 자격

| 코드 | 조건 | 처리 |
|---|---|---|
| Q-01 | Indie 5 라이선스 초과 선택 | 블락 + "Enterprise로 구매" 안내 |
| Q-02 | Indie가 Enterprise 구매 | 허용. 정가 적용 |
| Q-03 | Enterprise Single에 Add 시도 | 축 A에 Add 미노출 (Seat 1 고정) |
| Q-04 | Indie에 Extend 시도 | 축 B가 항상 New로 판정. Extend 미발생 |
| Q-05 | Seat 직접 입력에 0 또는 음수 | 인라인 에러. 최소 1 |
| Q-06 | Academic 인증 Org가 Indie 카드 진입 | Organization 1개 제한 → **재인증 불가** |

### 7-3. 가격 · 세금

| 코드 | 조건 | 처리 |
|---|---|---|
| T-10 | Seat 수 변경 | **가격 재계산** (Avalara 재조회) |
| T-11 | 쿠폰 적용 · 해제 | **가격 재계산.** 세금은 쿠폰 적용 후 금액 기준 |
| T-12 | 지불 방식 변경 (개인) | 가격 재계산. Monthly 전환 시 쿠폰 입력 필드 소멸 |
| T-13 | Avalara 조회 실패 | 가격 미확정 · CTA 비활성 + 재시도 |
| T-14 | 조회 후 결제까지 시간 경과 | 결제 확정 시 조회 transaction 그대로 commit — 금액 불변 |
| T-15 | 쿠폰 무효 · 만료 · 적용 불가 | 인라인 에러. 금액 변동 없음 |
| T-16 | 세율 0% 국가 | 세금 행 숨김 |

### 7-4. 주소 · 유효성

| 코드 | 조건 | 처리 |
|---|---|---|
| A-10 | PG 이동 직전 유효성 검사 실패 (미국) | 이동 중단 + 주소 수정 모달 |
| A-11 | PG 이동 직전 ZIP 실재 확인 실패 | 이동 중단 + 주소 수정 모달 |
| A-12 | 조직 주소 없음 (Organization 계열) | Checkout 모달로 생성 → 조직 주소로 저장 |
| A-13 | 주소 수정 후 국가 변경 | 결제수단 목록 교체 + 기존 선택 초기화 + 가격 재계산 |
| A-14 | 다른 탭에서 주소를 수정한 상태로 결제 | 결제 직전 최신 주소로 재조회 *(개발 확인 필요)* |

### 7-5. 결제 · 세션

| 코드 | 조건 | 처리 |
|---|---|---|
| P-01 | 결제 실패 | **모달** (토스트 아님). `Payment Failed` / Error Code 미노출. 닫으면 입력값 유지 |
| P-02 | PG에서 뒤로가기 | sessionStorage 복원 |
| P-03 | 새로고침 | sessionStorage 복원. 축 A·B는 진입 경로·SW Account에서 재도출 |
| P-04 | 결제 성공 | 라이선스 활성화 + Avalara commit + sessionStorage 삭제 |
| P-05 | 결제 성공 후 완료 화면 | 개인 = 다운로드·MyPage / Organization = SW Account 초대·Team Console |
| P-06 | 결제수단 미선택 | CTA `Continue` 비활성 |
| P-07 | 약관 미동의 | CTA 비활성 |
| P-08 | 중국 IP인데 Billing Address는 타 국가 | 주소 국가 기준 우선. AliPay 미노출 *(개발 확인 필요)* |

### 7-6. Trial

| 코드 | 조건 | 처리 |
|---|---|---|
| TR-01 | Trial 진입 | Checkout 경유. 카드 정보 수집 |
| TR-02 | Trial 중 플랜 선택 | Monthly · Annual 중 선택 → 14일 후 그 플랜으로 자동 결제 |
| TR-03 | Trial 취소 이력 있는 계정 | 재Trial 불가. 바로 구매만 |
| TR-04 | Trial 중 조기 구매 | Trial 종료 + 구독 즉시 시작 |


---

## 8. 기능 명세

각 기능의 트리거 · 처리 · 예외를 정의한다. 케이스 코드는 §6 · §7을 참조한다.

### 8-1. 진입

| ID | 기능 | 트리거 | 처리 | 예외 |
|---|---|---|---|---|
| F-01 | 로그인 확인 | 페이지 진입 | 비로그인이면 로그인으로 이동 후 복귀 | B-01 |
| F-02 | 진입 자격 검사 | 로그인 확인 통과 | 인증 상태·기간을 검사해 차단 여부 결정 | B-03 ~ B-09 |
| F-03 | 진입 파라미터 수신 | 진입 직후 | 플랜 · 축 A · 대상 Organization/SW Account를 경로에서 수신 | 파라미터 누락 시 Plan 페이지로 |
| F-04 | 플랜 정보 로드 | F-03 이후 | 상품명 · 단가 · 지불 방식 조회 | 실패 시 재시도 |

### 8-2. SW Account (Organization 계열)

| ID | 기능 | 트리거 | 처리 | 예외 |
|---|---|---|---|---|
| F-10 | 목록 조회 | 카드 렌더 | 보유 Organization의 SW Account 목록 조회 | 빈 목록이면 생성 유도 |
| F-11 | 선택 | 사용자 선택 | 선택 계정의 라이선스 상태 조회 → F-13 실행 | 조회 실패 시 인라인 에러 |
| F-12 | 신규 생성 | 생성 입력 | 이메일 지정해 SW Account 생성 | 중복 이메일 인라인 에러 |
| F-13 | 축 B 판정 | F-11 · F-12 직후 | 라이선스 없음 → New / 활성 → Extend. 결과와 근거를 선택 영역 안에 표시 | N-10 ~ N-14 |
| F-14 | Indie 예외 | Indie 플랜 진입 | SW Account 단계 미노출. 축 B = New 고정 | N-14 |

### 8-3. Seat

| ID | 기능 | 트리거 | 처리 | 예외 |
|---|---|---|---|---|
| F-20 | 프리셋 렌더 | 카드 렌더 | 플랜별 프리셋 탭 노출 | Enterprise Single·개인 계열 미노출 |
| F-21 | 수량 변경 | 탭·직접 입력 | 소계 재계산 → F-42 재조회 | Q-01 · Q-05 |
| F-22 | 상한 검사 | 수량 변경 | Indie는 5 초과 블락 | Q-01 |

### 8-4. Billing Address

| ID | 기능 | 트리거 | 처리 | 예외 |
|---|---|---|---|---|
| F-30 | 조회 | 페이지 진입 | 개인 계열 → 개인 주소 / Organization 계열 → 조직 주소 | A-01 |
| F-31 | 표시 | 주소 있음 | 주소 + [수정] 버튼 | — |
| F-32 | 생성 모달 | 주소 없음 · [등록] 클릭 | 국가 · 주(미국) · ZIP · line 1·2 입력 → 저장 | 필수 누락 시 인라인 에러 |
| F-33 | 수정 모달 | [수정] 클릭 | 동일 폼. 저장 시 기존 레코드 갱신 | — |
| F-34 | 저장 후 재조회 | F-32 · F-33 성공 | **가격 재조회 1회** → 금액 갱신 | A-04 |
| F-35 | 유효성 검사 | **PG 이동 직전** | 미국 = 주소 실재 / 그 외 = 국가 내 ZIP 실재 / 우편번호 없는 국가 = 스킵 | A-10 · A-11 · A-05 |

### 8-5. 가격

| ID | 기능 | 트리거 | 처리 | 예외 |
|---|---|---|---|---|
| F-40 | 소계 계산 | 플랜 · Seat 확정 | 단가 × 수량 | §6-2-1 |
| F-41 | 쿠폰 적용 | 코드 입력 + 적용 | 할인 반영 → F-42 재조회 | T-15 |
| F-42 | 세액 조회 | 진입 · 주소 저장 · Seat 변경 · 쿠폰 변경 | Avalara 조회(uncommitted). 국가별 계산 주체는 §3-5 | T-13 |
| F-43 | 합계 확정 | F-42 성공 | Order Summary 렌더 · CTA 활성 조건 충족 | 실패 시 가격 미확정 |
| F-44 | 미확정 표시 | 주소·ZIP 없음 | 세전 금액만. 합계 미확정 · CTA 비활성 | A-01 · A-02 |

### 8-6. 결제

| ID | 기능 | 트리거 | 처리 | 예외 |
|---|---|---|---|---|
| F-50 | 결제수단 렌더 | 주소 국가 확정 | 중국 = 카드 + AliPay / 그 외 = 카드 + PayPal | P-08 |
| F-51 | 국가 변경 반영 | 주소 국가 변경 | 목록 교체 + 기존 선택 초기화 | A-13 |
| F-52 | CTA 활성 판정 | 입력 변화 시마다 | 가격 확정 + 결제수단 선택 + 약관 2개 | P-06 · P-07 |
| F-53 | PG 이동 | CTA 클릭 | F-35 통과 후 선택 PG로 이동 | A-10 · A-11 |
| F-54 | 결제 성공 | PG 콜백 | Avalara **commit** + 라이선스 활성화 + 세션 삭제 | P-04 |
| F-55 | 결제 실패 | PG 콜백 | 모달 표시. Error Code 미노출. 입력값 유지 | P-01 |
| F-56 | 완료 화면 | F-54 이후 | 개인 = 다운로드·MyPage / Organization = 초대·Team Console | P-05 |

### 8-7. 세션

| ID | 기능 | 트리거 | 처리 | 예외 |
|---|---|---|---|---|
| F-60 | 저장 | 입력 변화 | 플랜 · 지불 방식 · SW Account · Seat · 결제수단을 sessionStorage에 저장 | — |
| F-61 | 복원 | 새로고침 · PG 뒤로가기 | 저장값 복원. 축 A·B는 재도출 | P-02 · P-03 |
| F-62 | 삭제 | 결제 완료 | sessionStorage 삭제 | — |

### 8-8. 화면 상태

| 상태 | 조건 | 표시 |
|---|---|---|
| Loading | 플랜 정보 · SW Account 목록 · 세액 조회 중 | **Skeleton** (로딩 휠 금지) |
| Empty | SW Account 없음 | 생성 유도 안내 |
| 가격 미확정 | 주소 또는 ZIP 없음 | 세전 금액 + 안내. CTA 비활성 |
| Error (조회) | 목록·세액 조회 실패 | 인라인 에러 + 재시도 |
| Error (결제) | PG 실패 | 모달 |
| Blocked | 진입 자격 미충족 | 차단 안내 + 다음 행동 CTA |

---

## 9. 정합성 이슈

| # | 위치 | 문제 |
|---|---|---|
| C1 | `checkout.md` §2 · §3 | Country 드롭다운으로 세율·결제수단 결정 → **Billing Address 국가 기준**으로 변경 |
| C2 | `checkout.md` §5.3 | "**Stripe Tax API**로 세율 확정" → 실제는 **Avalara**. 문서 오류 |
| C3 | `checkout.md` §5.3 | "ZIP 미입력 시 CTA 비활성"은 유지. 단 **US·CA 한정 → 전 국가**로 확대 |
| C4 | `checkout.md` §5.1 | 하드코딩 세율표 — US·EU는 Avalara 응답이 기준, 그 외는 이 표가 실제 기준. **구분 명기 필요** |
| C5 | `checkout.md` §3 | 결제수단 표에 **중국 AliPay 누락** (`plan.md` §4-7과 충돌) |
| C6 | `MD-WEB-002.md` | 구매 유형 `Extend / Reserve` 2종 · Indie `Extend only` → **2원 구조로 전면 교체** |
| C7 | **MDWEB-863** | Organization 별도 주소가 "리뉴얼 이후"로 분류돼 있음. 본 명세 기준(이번 스코프)으로 티켓 분류 정리 필요 |
| C8 | **MDWEB-863** | 본문에 "등록하기 전에 아발라라 체크를 하게 됩니다 (우편번호 검증)" — 8/4 확정 흐름과 **정반대**. 티켓 갱신 필요 |
| C9 | `checkout.md` §5.2 vs `tax-id-checkout.md` | checkout.md는 "사업자이신가요?" 링크 유지 / tax-id-checkout.md TO-BE는 **제거하고 국가 선택이 트리거**. 상충 |
| C10 | `MD-WEB-002.md` | `License ID 드롭다운` → `SW Account` |

---

## 10. 미결 항목

| # | 항목 | 우선순위 |
|---|---|---|
| **M11** | Student Benefit 이용 중 Plan 카드 버튼 — §5-1 제안 적용. 확정 대기 | P2 |

---

## 11. 2026-08-05 확정 이력

| 항목 | 확정 |
|---|---|
| Organization 보유 | 1개만. Checkout에 선택 단계 없음 |
| SW Account 생성 | Checkout · Team Console 둘 다 |
| 구매 유형 | 2원 구조 (수량 × 계정 처리). **축 B는 시스템 판정, Reserve 미제공** |
| Indie | Enduser ID 1개 고정 · 최대 5 · Add 가능 · Extend 불가 · 매출 $500,000 |
| 구매 자격 | 인증은 선택지를 넓힌다. 카드는 자격만 판정 |
| 주소 관리 위치 | 개인 = MyPage / 조직 = Team Console |
| 주소 없을 때 | Checkout 모달로 생성·저장 (개인·조직 동일) |
| 가격 결정 입력 | 국가 + ZIP (미국은 주 추가) |
| line 1·2 | 입력받되 세금 미사용, 인보이스용 |
| ZIP | 전 국가 필수. 우편번호 없는 국가는 존재 검증 스킵 |
| 유효성 검사 | PG 이동 직전 |
| Avalara | Checkout에서만. 조회 → 결제 시 commit. 주소 검증 용도로는 사용 불가 |
| AliPay | 중국 전용. 중국 IP 또는 국가 선택이 중국일 때 노출 |
| Kakao Pay | **제공 안 함.** 한국도 카드 + PayPal |
| Trial 진입 | **Checkout이 겸한다.** 카드 정보 수집 필요 |
| 축 B | **시스템 판정.** 사용자 선택 없음. Reserve 미제공 |
| Auto Renew | **옵션 아님.** Annual은 자동 갱신이 기본. 토글 없음 |
| Seat 프리셋 | Enterprise `[5][10][20][직접 입력]` · Academic `[5][10][20][직접 입력]` · Indie `[1][3][5][직접 입력]` (직접 입력은 5 이하) |
| 쿠폰 | **개인 플랜 Checkout만.** Organization 계열 미노출 |
| Organization 인증 전환 | Indie ↔ Academic 재인증 **불가** (Organization 1개 제한) |
| Student Benefit 중 카드 | `Check my Status` 재사용 (제안). Organization 카드는 막지 않음 |
