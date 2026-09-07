# [MD|SITE] 결제 페이지 — 화면 설계 상세

Epic Key: `MDWEB-870` | 요청: Josh Lim | 출처: Jira MDWEB-870 (Epic MDWEB-827) | 작성일: 2026-07-29
독자: 설계 · 개발 | 정책 기준: `policy-doc.md` | 분할 원본: `prd-draft.md` | 프레임 목록: `screen-list.md`

이 문서는 Figma Description 작성 재료다. 정책 판단은 `policy-doc.md`가 소유하고, 이 문서는 화면 구성 · 상태 · 인터랙션만 다룬다. 와이어프레임에 그리는 문구는 EN으로 작성한다.

---

## 1. 결제 페이지 화면 구성 개요

### 1.1 카드 구성

| 영역 | 구성 | 노출 조건 |
|---|---|---|
| Card 1 — 구매 대상 | SW Account 선택 · 신규 생성, Seat 수 | Organization 플랜만 |
| Card 2 — 지불 방식 | 지불 방식 선택 (연간 / 월간) | 선택 가능한 플랜만 |
| Card 3 — 결제 정보 | Country, 주소 필드, 결제수단 | 전 플랜 |
| Coupon 입력 | 쿠폰 코드 입력 + 적용 | 연간 결제만 |
| Order Summary | 금액 내역 | 전 플랜 |
| 약관 동의 | 약관 체크박스 2종 | 전 플랜 |
| CTA | 결제 실행 | 전 플랜 |

Order Summary는 약관 체크박스 아래, CTA 버튼 위에 고정 배치한다.

### 1.2 개인 플랜과 Organization 플랜의 차이

| 항목 | 개인 플랜 | Organization 플랜 |
|---|---|---|
| SW Account 선택 | 없음 | 있음 |
| Seat 수 선택 | 없음 | 있음 (Enterprise Single 제외) |
| Order Summary 단가 · Seat 수 행 | 숨김 | 표시 (Enterprise Single 제외) |

**구매 유형 선택 UI는 존재하지 않는다.** Seat 수량(축 A)은 진입 경로가 정하고, 계정 처리(축 B — New · Extend)는 SW Account를 고르면 시스템이 판정한다. 판정 결과와 근거(현재 만료일 → 구매 후 만료일)를 SW Account 선택 영역 안에 표시한다. **Reserve는 제공하지 않는다.**

### 1.3 지불 방식 토글

- 연간(Annual)을 항상 왼쪽에, 월간(Monthly)을 오른쪽에 배치한다.
- 기본 선택은 연간이다.
- 지불 방식이 하나뿐인 플랜은 토글을 노출하지 않고 확정된 지불 방식만 표시한다.
- Individual에서 연간 → 월간으로 바꾸면 **Coupon 입력 필드가 사라진다.**

---

## 2. SW Account 선택 · 신규 생성

Organization 플랜은 라이선스를 붙일 대상을 먼저 지정해야 결제할 수 있다.

### 2.1 선택

- Card 1에서 Group이 보유한 SW Account 목록을 드롭다운으로 표시한다.
- Seat 수가 2 이상이면 Seat 수만큼 SW Account를 지정한다. *(정책 확인 필요 — §9 G24)*
- 목록 조회 실패 시 인라인 에러와 재시도를 표시한다 (§8-3).

### 2.2 신규 생성

- 보유 SW Account가 없거나 부족하면 결제 흐름 안에서 신규 생성한다.
- 생성 주체는 Organization Owner만 가능하고 인원 제한은 없다. Checkout·Team Console 둘 다에서 생성할 수 있다.
- Organization Owner가 이메일을 지정해 SW Account 하위에 초대한다. 초대받은 사람은 해당 이메일로 CLO-SET 회원가입 후 사용한다.
- SW Account는 Web 로그인이 없고 라이선스 할당 전용 마스터키로 동작한다.
- SW Account의 CLO-SET 계정 통합은 지원하지 않는다.

### 2.3 상태

| 상태 | 처리 |
|---|---|
| Loading | Skeleton |
| Empty (SW Account 0개) | 목록 대신 생성 유도 안내 + 생성 진입 |
| Error (조회 실패) | `Couldn't load this list` / `A temporary error occurred.` + `Try again` |
| Selected | 선택된 SW Account 표시. 하위 Seat 수 행 활성 |

---

## 3. Seat 수 선택 UI

- 스텝퍼를 사용하지 않고 **프리셋 탭**으로 제공한다.
- Organization 플랜 가격이 Seat 단가이므로 Seat 수를 변경하면 Order Summary의 `Seat 수` 행과 소계 · 세금 · 합계를 즉시 다시 계산한다.

| 플랜 | Seat UI | 최대 |
|---|---|---|
| Enterprise Single | 선택 UI 없음 — 1 고정 | 1 |
| Enterprise Team | 프리셋 탭 `[5] [10] [20] [직접 입력]` | 제한 없음 |
| Enterprise Team Linux | 프리셋 탭 `[5] [10] [20] [직접 입력]` | 제한 없음 |
| Academic Annual | 프리셋 탭 `[5] [10] [20] [직접 입력]` | 제한 없음 |
| Indie Annual | 프리셋 탭 `[1] [3] [5] [직접 입력]` | 5 |

### 3.1 직접 입력

- `[직접 입력]` 탭 선택 시 프리셋 탭이 입력 필드로 전환된다.
- Indie는 5 초과 입력을 차단하고 안내를 표시한다.
- 빈 값 · 0 입력 시 CTA를 비활성 처리한다.

### 3.2 Add · Extend 시

| 결제 모드 | Seat 수 행 |
|---|---|
| Add | 추가할 Seat 수만 입력. 기존 Seat 수는 참조 표시 |
| Extend | 변경 불가 — 기존 Seat 수 고정 표시 |

---

## 4. Order Summary

### 4.1 행 구성

| 행 | 내용 | 노출 조건 |
|---|---|---|
| 제품명 | 플랜명 | 항상 |
| 지불 방식 | 연간 / 월간 | 항상 |
| 단가 | 금액 / Seat | Organization 플랜만 (Enterprise Single 제외) |
| Seat 수 | N Seat | Organization 플랜만 (Enterprise Single 제외) |
| 소계 | 할인 전 금액 | 항상 |
| Coupon | `-$n` | 쿠폰 적용 시 |
| Discount | `-$n` | 할인 적용 시 |
| 세금 | 국가별 라벨 + 금액 | 세율 0% 국가는 행 숨김 |
| 합계 | 최종 금액 / 주기 | 항상 |
| 세금 안내 문구 | 보조 안내 | 국가별 조건부 |

### 4.2 플랜별 소계

Organization 플랜은 **Seat 단가 × Seat 수**로 계산한다.

| 플랜 | 단가 | 소계 계산 |
|---|---|---|
| Individual Monthly | — | $39.00 |
| Individual Annual | — | $280.00 |
| Student Monthly | — | $8.25 *(정책 확인 필요 — Student Benefit 첫 결제 표기, §9 G17)* |
| Enterprise Single | — | $199.00 (Max 1 — Seat 개념 미적용) |
| Enterprise Team | $2,000.00 / Seat | $2,000.00 × Seat 수 |
| Enterprise Team Linux | $2,300.00 / Seat | $2,300.00 × Seat 수 |
| Academic Annual | $1,500.00 / Seat | $1,500.00 × Seat 수 |
| Indie Annual | $800.00 / Seat | $800.00 × Seat 수 (최대 5 Seat) |

### 4.3 Add · Extend 시 소계

| 결제 모드 | 소계 |
|---|---|
| Add | 추가 Seat 수 × Seat 단가 |
| Extend | 연장 기간 기준 금액 |

### 4.4 계산 순서

소계 → Coupon → Discount → 세금 → 합계. 세금은 Coupon · Discount 적용 후 금액을 기준으로 계산한다.

### 4.5 상태

| 상태 | 처리 |
|---|---|
| Loading | Skeleton |
| 세금 미확정 (US · CA, ZIP 미입력) | 세금 행에 계산 대기 안내. 합계 미확정 |
| Error (금액 조회 실패) | 인라인 에러 + `Try again` |

---

## 5. Coupon 입력

- **연간 결제에서만** 노출한다. 월간으로 전환하면 필드 자체가 사라진다.
- Order Summary 위에 입력 필드와 적용 버튼을 배치한다.

| 상태 | 처리 |
|---|---|
| Default | 빈 입력 필드 + 적용 버튼 비활성 |
| Filled | 입력값 표시 + 적용 버튼 활성 |
| Applied | Order Summary에 `Coupon` 행 `-$n` 추가. 입력 필드에 적용된 코드 표시 |
| Error | 입력 필드 하단 인라인 에러 |

| 실패 케이스 | 문구 (WF EN) |
|---|---|
| 잘못된 코드 | `This coupon code is invalid.` |
| 만료된 코드 | `This coupon has expired.` |
| 적용 불가 | `This coupon can't be applied to your current subscription.` |

Discount는 사용자 입력 없이 프로모션 코드 또는 관리자 지정으로 적용되며, Order Summary에 `Discount` 행으로만 표시된다.

---

## 6. Billing Address · 세금 · 결제수단

### 6.1 기준 국가

세율·결제수단을 정하는 기준 국가는 **Billing Address의 국가**다. Checkout 내 별도 Country 드롭다운을 두지 않는다.

| 상황 | 기준 국가 |
|---|---|
| 주소 있음 | 해당 주소의 국가 |
| 주소 없음 | 미확정. 생성 모달에서 입력받는다 |
| 주소 입력 전 결제수단 노출 | 접속 IP로 중국 여부만 판정 |

### 6.2 조회 · 생성 · 수정

| 상태 | 화면 |
|---|---|
| 주소 있음 | 주소 표시 + **[수정] 버튼** → 모달 |
| 주소 없음 | 안내 + **[등록] 버튼** → 모달. 금액은 세전만 표시, CTA 비활성 (spec A-01) |
| 저장 성공 | 모달 닫힘 → **가격 재조회 1회** → Order Summary 갱신 (spec A-04) |

| 플랜 그룹 | 주소 출처 | 관리 위치 |
|---|---|---|
| 개인 계열 | 개인 주소 | MyPage |
| Organization 계열 | **조직 주소** | Team Console |

### 6.3 주소 필드

| 필드 | 필수 | 세액 계산 사용 |
|---|:---:|:---:|
| 국가 | O | O |
| 주 (State) — 미국만 | O | O |
| ZIP · 우편번호 | **O (전 국가)** | O |
| Address line 1 · 2 | O | ✖ (인보이스 표기용) |

### 6.4 가격 확정 중간 상태

| 단계 | 화면 |
|---|---|
| 주소 없음 | 세전 금액만. 세금 행에 계산 대기 안내. **CTA 비활성** (spec A-01) |
| ZIP 없음 | 동일 — 세금 미확정. **CTA 비활성** (spec A-02) |
| 미국 · 주 없음 | 동일 (spec A-03) |
| 입력 완료 | Avalara 조회 → 세금 행 · 합계 표시 → CTA 활성 조건 재평가 |
| Seat · 쿠폰 변경 | 가격 재계산 (spec T-10 · T-11) |
| 조회 실패 | 가격 미확정 + 재시도 (spec T-13) |

### 6.5 세액 계산 주체

| 지역 | 계산 주체 |
|---|---|
| US (주별) · EU | **Avalara** |
| KR | 10% 고정 |
| CN | ItemCode별 (CLO_PLC 13% / CLO_RLC 6%) |
| 그 외 | CLOver Admin 내 계산 |

**주소 검증에 Avalara를 쓰지 않는다.** 미국 외 주소 검증을 지원하지 않는다.

### 6.6 Tax ID 역과세

| 단계 | 화면 |
|---|---|
| 감면 대상 국가 선택 | Tax ID 입력 행이 **자동 노출**. 사업자 확인 링크를 두지 않는다 |
| 미입력 | 해당 국가 표준 세율 유지 |
| 입력 완료 | 세율 0% 전환. 세금 행에 `Tax: 0.00 (Reverse Charge)` 표시 |
| 국가 변경 | Tax ID 초기화 |

### 6.7 유효성 검사

**시점: PG 이동 직전.** 통과해야 PG로 이동한다.

| 국가 | 검사 | 실패 시 |
|---|---|---|
| 미국 | 실제 주소 존재 여부 | 이동 중단 + 주소 수정 모달 (spec A-10) |
| 우편번호 있는 국가 | 국가 내 ZIP 실재 여부 | 이동 중단 + 주소 수정 모달 (spec A-11) |
| 우편번호 없는 국가 | 형식만. 존재 검증 스킵 | — (spec A-05) |

### 6.8 결제수단

| 조건 | 노출 |
|---|---|
| 중국 — 접속 IP 또는 주소 국가가 중국 | 카드 + **AliPay** |
| 그 외 (한국 포함) | 카드 + PayPal |

- **Kakao Pay는 제공하지 않는다.**
- 주소 국가가 바뀌면 목록을 교체하고 기존 선택을 초기화한다 (spec A-13).

---

## 7. 결제 실행과 결과 처리

### 7.1 CTA 활성 조건

아래를 모두 충족할 때 활성화된다.

- 약관 체크박스 2종 모두 동의
- 결제수단 선택 완료
- US · CA는 ZIP · Postal Code 입력 완료 (§6-3)
- Organization 플랜은 SW Account 선택 완료 (§2-1)
- Seat 수가 유효한 값 (§3-1)

### 7.2 CTA 상태

| 상태 | 문구 (WF EN) |
|---|---|
| 결제수단 미선택 | `Continue` (비활성) |
| 신용카드 / 체크카드 선택 | `Pay with Card` |
| PayPal 선택 | `Continue to PayPal` |
| 조건 미충족 | 비활성 |
| 결제 처리 중 | 버튼 내부 인디케이터 (로딩 휠 금지) |

### 7.3 결제 성공

- 결제 완료 화면으로 이동한다.
- 저장된 결제 세션 데이터를 삭제한다 (§7-5).

| 플랜 | 완료 화면 다음 행동 |
|---|---|
| 개인 플랜 | 소프트웨어 다운로드 · MyPage 확인 |
| Organization 플랜 | SW Account 초대 · Team Console 확인 |

### 7.4 결제 실패

모달로 처리한다. 토스트를 사용하지 않는다.

| 요소 | 문구 (WF EN) |
|---|---|
| Title | `Payment Failed` |
| Body | `There was an error while requesting the payment. Please try again shortly.` |

- Error Code를 UI에 노출하지 않는다.
- 모달을 닫으면 입력값을 유지한 채 결제 페이지로 복귀한다.

### 7.5 이탈 · 복귀 시 입력값 유지

- 사용자가 PG 페이지에서 뒤로 오거나 페이지를 새로고침해도 입력값을 유지한다.
- 유지 대상: 플랜, 지불 방식, SW Account 선택, Seat 수, Country, 주소 필드, 결제수단, 쿠폰 적용 상태
- 결제 완료 시 저장 데이터를 삭제한다.

---

## 8. 에러 · 빈 상태 · 로딩 기준

### 8.1 패턴 선택

| 상황 | 패턴 |
|---|---|
| 화면 전체 사용 불가 | 전면 페이지 에러 |
| 특정 섹션 · 리스트만 실패 | 인라인 에러 + 재시도 |
| 입력값 검증 실패 | 필드 인라인 에러 |
| 결제 요청 실패 | 모달 (§7-4) |
| 로딩 중 | Skeleton |

### 8.2 전면 에러

| 상황 | Title (WF EN) | Body (WF EN) |
|---|---|---|
| 세션 만료 | `Session expired` | `Your session has ended. Sign in to continue.` |
| 서버 오류 | `Something went wrong` | `A temporary error occurred. Try again in a moment.` |
| 점검 | `Under maintenance` | `The service is temporarily unavailable. Check back soon.` |

에러 코드 숫자를 UI에 노출하지 않는다.

### 8.3 인라인 상태

| 상황 | 문구 (WF EN) |
|---|---|
| SW Account 목록 조회 실패 | `Couldn't load this list` / `A temporary error occurred.` + `Try again` |
| 필수 입력 미완 | `This field is required.` |
| 이메일 형식 오류 | `Enter a valid email.` |
| 쿠폰 오류 | §5 참조 |

재시도는 해당 섹션 조회만 재실행한다.

### 8.4 빈 상태

| 상황 | 처리 |
|---|---|
| SW Account 없음 | 생성 유도 안내 + 생성 진입 |

### 8.5 로딩

- 페이지 · 컴포넌트 모두 **Skeleton**으로 처리한다. 로딩 휠을 사용하지 않는다.
- 액션 처리 중에는 버튼 내부 인디케이터만 사용한다.

### 8.6 진입 차단 화면

정책 조건은 `policy-doc.md` §4를 따른다. 차단 화면은 결제 페이지 대신 렌더하고, 사유별 안내 문구와 다음 행동(인증하기 / 플랜 보기 / 문의하기)을 함께 노출한다. Non-Member는 화면을 렌더하지 않고 로그인으로 리다이렉트하며 진입 전 경로를 보존한다.

---

## 9. 정책 격차 상세 (내부용)

### 9.1 해소된 항목

| # | 항목 | 결정 |
|---|---|---|
| G1 | 진입 조건 판별 주체 | MemberType 분기 → Member + Verification, Organization + Verification 기준으로 재정의 (`policy-doc.md` §2 · §4) |
| G2 · G3 | Student 구매 제한 · 가격 | 확정 (2026-07-29 `plan.md` 갱신) — Monthly only $8.25, **최초 학생 인증 승인일 기준** 4년 이내, **구매 횟수 제한 없음**. `checkout.md` §1 "2회 초과 차단" · §4 "Student Annual $99.00"은 stale, 폐기 대상 |
| G4 | Enterprise 플랜 명칭 | Enterprise Single / Enterprise Team으로 통일 |
| G5 | Seat 용어 | "Seat" 고정. "Copy" · "시트 수" 폐기 |
| G6 | 지불 방식 레이블 | "지불 방식" 고정. "결제 주기" 폐기 |
| G7 | 단가 · Seat 행 노출 조건 | Organization 플랜 기준으로 재정의 (§1-2) |
| G8 · G9 | 결제수단 국가 분기 · AliPay CTA | **이번 범위 제외.** 기본 구성만 (§6-5) |
| G10 | 구매 유형 종속 대상 | **해소** — 축 B는 시스템 판정. 사용자 선택 컨트롤 없음. 판정 결과는 SW Account 선택 영역 안에 표시 (§1-2) |
| G11 | 상태 복원 저장 키 | SW Account 기준으로 통일 (§7-5) |
| G12 | Coupon · Discount 누락 | `plan.md` 기준으로 §5에 편입 |
| G14 | Enterprise Team Linux | 확정 — Enterprise Team과 동일 구조, Linux OS 전용, Annual Prepaid only, $2,300 / Seat |
| G15 | Single → Team 전환 | 정책 초안 — 만료 후 시작 방식, 잔여 기간 정산 · 환불 없음, Seat 수 선택 가능 |
| G16 | Add / Extend / Reserve | **해소 (2026-08-05)** — 2원 구조. 축 A(신규 · Add, 진입 경로 결정) × 축 B(New · Extend, 시스템 판정). **Reserve 미제공** |
| G19 | SW Account 결제 페이지 접근 | 진입 경로 없음으로 명시 |
| G21 | Seat 단가 vs 총액 기준 | **해소 (2026-07-29 확정)** — Organization 플랜 표기 금액은 Seat 단가. 소계 = 단가 × Seat 수. Enterprise Single은 Max 1이라 단가 개념 미적용 (§4-2) |
| G26 | Single → Team 전환 시 SW Account 승계 | **해소 (2026-07-29 확정)** — 기존 SW Account를 그대로 승계. 재생성 · 재초대 불필요 |

### 9.2 미결 항목

| # | 항목 | 내용 | 관련 섹션 |
|---|---|---|---|
| G13 | Academic · Indie 구매 자격 주체 | **해소 (2026-08-04)** — `plan.md` §3을 Organization 기준으로 갱신 완료 | `policy-doc.md` §2 |
| G17 | Student Benefit 결제 표기 | 3개월 무료 구간의 첫 결제 금액 표기 방식 미정의. 첫 결제를 $0으로 표시할지, $8.25로 표시하고 첫 청구일을 별도 안내할지, 결제수단 등록만 받고 청구를 3개월 뒤로 미룰지. "Trial" 라벨 금지 하의 대체 표현도 필요 | §4-2 |
| G18 | Individual Annual 자동 갱신 | **해소 (2026-08-05)** — 옵션이 아니다. 토글·섹션·취소 CTA 없음. 갱신 중단은 구독 해지 | §1-1 |
| G20 | Student Benefit Active 진입 가능 여부 | `plan-card.md` 업데이트 필요사항 §3 P1 미해소 | §8-6 |
| G22 | Indie 인증 대기 상태 표시 | `checkout.md` §1(검토 중 안내)과 `plan.md` §3(신청 상태값 클라이언트 미노출)이 충돌. 차단 화면에 무엇을 표시할지 확정 필요 | §8-6 |
| G23 | Organization 미보유 Member의 Organization 플랜 진입 | **해소** — Organization 생성 단계를 선행한다. Organization은 1개만 보유 | §8-6 |
| G24 | Seat 수 > 1일 때 SW Account 지정 | Seat 수만큼 SW Account를 결제 시점에 지정할지, 결제 후 배정할지 미정의. Card 1 구성에 직결 | §2-1 |
| G25 | Add 시 추가 Seat 만료일 | 기존 라이선스 만료일에 맞추는지, 별도 기간으로 시작하는지 미정의 | §3-2 |
| G27 | Individual 14일 Trial 결제 경로 | Trial 시작이 결제 페이지를 경유하는지, 결제수단 등록만 받는지 미정의 | §1-1 |
| G28 | Single → Team 전환 시 라이선스 할당 상태 유지 | SW Account 계정 승계는 확정(G26). 승계 시점에 라이선스 할당 상태까지 유지되는지, Card 1에 SW Account 선택 UI를 노출할지 미정의 | §2-1 |
| G29 | `checkout.md` §4 Indie 총액 표기 stale | `Indie Annual \| $800.00` 은 총액 표기이며 Seat 단가 기준(G21 확정)과 충돌한다. 폐기 대상 | §4-2 |
| — | ~~Enterprise Team · Enterprise Team Linux Seat 프리셋 구성~~ | **2026-08-06 확정** — 전 플랜 프리셋 정의 완료 (§3 표 참조) | §3 |
| G30 | Student Legacy 4년 기산점 이원화 | 신규는 최초 학생 인증 승인일 기준(2026-07-29 확정). `plan.md` §3 Student Legacy Users는 `첫 구매일 기준` · `Legacy 4년 카운트 기준: 첫 번째 결제일 기준`으로 잔존. 의도한 이원화인지 미확인 — Legacy 계정에 인증 승인일 데이터가 없는 것이 이유로 추정되나 근거 미기재 | — |

### 9.3 정책 파일 갱신 필요

| 파일 | 갱신 항목 |
|---|---|
| `checkout.md` | **2026-08-05 갱신 완료** — Billing Address 모델·Avalara·AliPay·Seat 단가 반영 |
| `plan.md` | **2026-08-04~05 갱신 완료** — Enterprise Team Linux 추가, Organization 용어, Seat 프리셋, 자동 갱신, 결제수단 |
| `plan-card.md` | 업데이트 필요사항 P1 2건(SW Account 카드 처리, Student Benefit Active 버튼) 미해소. 전체 재작성 필요 |

---

## 10. 이벤트 로깅 포인트

| 지점 | 목적 |
|---|---|
| 결제 페이지 진입 (플랜 · 결제 모드별) | 유입 퍼널 시작 |
| 진입 차단 발생 (차단 사유별) | 차단 사유 분포 |
| SW Account 선택 완료 · 신규 생성 | Organization 플랜 이탈 구간 파악 |
| 지불 방식 변경 | 연간 기본값 유효성 |
| Seat 수 확정 | 실제 구매 Seat 분포 |
| 쿠폰 적용 성공 · 실패 (실패 사유별) | 프로모션 효율 |
| Country 변경 | 세금 · 주소 이탈 구간 |
| CTA 활성 전환 | 결제 직전 도달률 |
| 결제 요청 · 성공 · 실패 | 전환율 · 실패율 |

---

## 11. 프레임 매핑

`screen-list.md`의 프레임 번호와 이 문서 섹션의 대응 관계다.

| 프레임 | 참조 섹션 |
|---|---|
| #1 Checkout — Personal Plan (STRUCTURE) | §1-1 · §1-2 · §1-3 · §4 · §6 · §7 |
| #2 Checkout — Organization Plan (STRUCTURE) | §1-1 · §1-2 · §2 · §3 · §4 |
| #3 SW Account 선택 → 축 B 판정 표시 (FEATURE) | §1-2 · §2 |
| #4 SW Account 신규 생성 | §2-2 |
| #5 지불 방식 Monthly 전환 | §1-3 · §5 |
| #6 Seat 수 직접 입력 | §3-1 |
| #7 Country US / CA | §6-2 · §6-3 |
| #8 Country EU / GB VAT ID | §6-4 |
| #9 Coupon 적용 | §5 |
| #10 Payment Failed 모달 | §7-4 |
| #11 결제 완료 | §7-3 |
| #12 Seat Add | §3-2 · §4-3 |
| #13 Extend | §3-2 · §4-3 |
| #14 Single → Team 전환 | §2-1 · §3 · §9-2 (G28) |
| #15 진입 차단 케이스 (CASE VIEW) | §8-6 |
| #16 플랜별 지불 방식 · Seat UI (CASE VIEW) | §1-3 · §3 |
| #17 Order Summary 케이스 (CASE VIEW) | §4 |
| #18 CTA 상태 케이스 (CASE VIEW) | §7-1 · §7-2 |
| #19 에러 · 빈 상태 · 로딩 (CASE VIEW) | §8 |
