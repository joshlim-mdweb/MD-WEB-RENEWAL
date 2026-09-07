# [MD|SITE] 결제 페이지 & 흐름

Epic Key: `MDWEB-870` | 요청: Josh Lim | 출처: Jira MDWEB-870 (Epic MDWEB-827) | 작성일: 2026-07-29

> 2026-08-05: checkout-feature-spec.md 확정 반영 (13곳)

## 배경

2026-06-23 계정 구조가 전면 개편돼 MemberType이 폐지되고 Member / SW Account / Organization 구조로 전환됐다. 기존 결제 정책 문서(`docs/policy/checkout.md`, MDWEB-634 시점)는 구 MemberType 기준으로 작성돼 신 구조와 충돌한다. 이 문서가 신 계정 구조 기준의 결제 정책 기준선이 된다.

---

## 1. 문서 범위와 전제

### 1.1 다루는 범위

| 플로우 | 내용 |
|---|---|
| ① 각 플랜 신규 구매 | 8종 플랜의 최초 구매 |
| ② Seat 추가 · 기간 연장 | Team Console에서 시작해 이 페이지에서 결제 |
| ③ Enterprise Single → Team 전환 | 월간 1석에서 연간 N Seat으로 전환 |
| ④ SW Account 선택 · 신규 생성 | Organization 플랜 결제의 공통 선행 단계 |

### 1.2 다루지 않는 범위

| 항목 | 소유 문서 |
|---|---|
| 플랜 카드 버튼 상태 | `plan-card.md` |
| Student · Academic · Indie 인증 신청·코드 입력 | `verification.md` |
| 결제 완료 이후 라이선스·청구 관리 | `mypage.md` |
| Enterprise Offline (BD 별도 계약) | 계약 영역 — 웹 결제 대상 아님 |
| Billing Address 관리 화면 | 개인 = `mypage.md` / 조직 = Team Console. 결제 페이지는 조회·생성·수정만 (§18-1) |
| Reserve 구매 유형 (만료 후 시작 예약) | **이번 범위 제외** — 축 B는 New · Extend 2종 (§7-2) |

### 1.3 전제

- 계정 구조는 `member.md`(2026-06-23) 기준으로 한다.
- `checkout.md`와 충돌하는 항목은 §24에 격차로 명시한다.
- 와이어프레임에 그리는 문구는 EN으로 작성한다.

---

## 2. 계정 구조 요약

### 2.1 계정 유형

| 계정 유형 | 설명 | 결제 페이지 진입 |
|---|---|---|
| Non-Member | 로그인하지 않은 사용자 | 불가 — 로그인 후 복귀 |
| Member | 로그인한 모든 사용자 | 가능 |
| SW Account | Organization Owner가 생성하는 라이선스 할당 전용 계정 | 불가 — Web 로그인 없음 |

Organization을 생성한 Member를 **Organization Owner**라 한다. Organization 내 하위 권한 역할은 없다.

**한 Member는 Organization을 1개만 보유한다.** 이미 1개를 보유한 Member의 추가 생성을 차단한다. 따라서 결제 페이지에 Organization 선택 단계는 존재하지 않는다. (`checkout-feature-spec.md` §0-3)

### 2.2 구매 자격

플랜 구매 자격은 계정 유형이 아니라 인증(Verification)으로 부여된다. **인증은 선택지를 넓히는 장치이며, 다른 플랜의 구매를 막지 않는다.** 플랜 카드는 "이 사람이 그 플랜을 살 자격이 있는가"만 판정한다. (`checkout-feature-spec.md` §0-2)

| 플랜 | 구매 자격 |
|---|---|
| Individual | 누구나 (Non-Member 포함 — 로그인 후 진입) |
| Student | Student 인증 완료 |
| Enterprise Single · Team · Linux | 누구나 — Organization 미보유 시 생성 단계 경유 |
| Academic | Academic 인증 Organization |
| Indie | Indie 인증 Organization |

배타 관계는 없다. 구체적으로 다음을 모두 허용한다.

- Student 인증자도 Individual 플랜을 구매할 수 있다.
- Organization Owner도 개인용 Individual · Student 플랜을 구매할 수 있다.
- Indie 인증 Organization도 Enterprise 플랜을 구매할 수 있다. Indie 5 Seat 초과분은 Enterprise 정가로 구매한다.

Organization은 플랜 구매 전에 독립적으로 생성할 수 있다. 구매가 Organization 생성을 트리거하지 않는다.

> `plan-card.md`의 `For Student` / `For Individual` / `For Enterprise` 비활성 문구는 전부 삭제 대상이다.

---

## 3. 판매 플랜 목록과 가격

### 3.1 개인 플랜

| 플랜명 | 라이선스 유형 | 가격 | 지불 방식 | 사용 기준 |
|---|---|---|---|---|
| Individual Monthly | Subscription | $39 | 월간 | 1명 |
| Individual Annual | Prepaid | $280 | 연간 | 1명 |
| Student Monthly | Subscription | $8.25 | 월간 | 1명 |

### 3.2 Organization 플랜

| 플랜명 | 라이선스 유형 | 가격 | 지불 방식 | Concurrent User |
|---|---|---|---|---|
| Enterprise Single | Network Online | $199 / 월 | 월간 | Max 1 |
| Enterprise Team | Network Online | $2,000 / Seat | 연간 | 구매된 N Seat |
| Enterprise Linux | Network Online | $2,300 / Seat | 연간 | 구매된 N Seat |
| Academic Annual | Network Online | $1,500 / Seat | 연간 | 구매된 N Seat |
| Indie Annual | Network Online | $800 / Seat | 연간 | Max 5 Seat |

- Organization 플랜의 표기 금액은 **Seat 단가**다. 총액은 단가 × Seat 수로 계산한다 (§15-2). `checkout-feature-spec.md` §2-1과 일치한다.
- Enterprise Single은 Max 1이라 Seat 선택이 없고 단가 개념을 적용하지 않는다. 동시접속을 지원하지 않는다.
- Enterprise Linux는 사용자 구조가 Enterprise Team과 동일하고, **Linux OS에서만 사용 가능**하다는 점만 다르다. Annual Prepaid만 제공한다.

### 3.3 개인 플랜 공통 제약

- 단일 사용자 전용이며 SW Account 공유를 허용하지 않는다.
- 동시접속을 지원하지 않는다.

---

## 4. 결제 진입 조건과 차단 규칙

System은 결제 페이지 접근 전 아래 조건을 순서대로 확인한다.

| # | 조건 | 처리 |
|---|---|---|
| 1 | Non-Member | 로그인 페이지로 이동. 진입 전 경로를 보존해 로그인 후 복귀 |
| 2 | SW Account | 해당 없음 — Web 로그인이 없어 진입 경로 자체가 존재하지 않는다 |
| 3 | Member — Student 플랜, **최초 학생 인증 승인일** 기준 4년 초과 | 진입 차단. Individual 플랜 안내 표시 |
| 4 | Member — Student 인증 없음, Student 플랜 대상 | 진입 차단. 인증 절차 안내 |
| 5 | Organization Owner — Academic 인증 대기 중, Academic 플랜 대상 | 진입 차단. 인증 검토 중 안내. CTA 비활성 |
| 6 | Organization Owner — Indie 인증 대기 중, Indie 플랜 대상 | 진입 차단 *(정책 확인 필요 — §24 G22)* |
| 7 | Member — Organization 없음, Organization 플랜 대상 | Organization 생성 단계를 선행한다 (§6-4) |
| 8 | 그 외 | 정상 진입 |

- 4년 기산점은 **최초 학생 인증 승인일**이다. 첫 구독일이 아니다. (`docs/policy/plan.md` §3 Student, 2026-07-30 확정)
- Student Benefit 이용 중인 Member도 Individual · Organization 플랜에 정상 진입한다. Student 플랜 재구매 진입 처리는 `checkout-feature-spec.md` §5-1 제안 확정 대기다. *(정책 확인 필요 — §24 G20)*
- 진입 차단 시 사용자는 결제 페이지 대신 차단 안내 화면을 본다. 차단 안내에는 다음 행동(인증하기 / 플랜 보기 / 문의하기)이 함께 노출된다.

---

## 5. 결제 페이지 화면 구성 개요

### 5.1 카드 구성

| 영역 | 구성 | 노출 조건 |
|---|---|---|
| Card 1 — 구매 대상 | SW Account 선택 · 신규 생성 (축 B 판정 결과 인라인 표시), Seat 수 | Organization 플랜만 |
| Card 2 — 지불 방식 | 지불 방식 선택 (연간 / 월간) | 선택 가능한 플랜만 |
| Card 3 — 결제 정보 | Billing Address 표시 · 생성 · 수정, 결제수단 | 전 플랜 |
| Coupon 입력 | 쿠폰 코드 입력 + 적용 | 연간 결제만 |
| Order Summary | 금액 내역 | 전 플랜 |
| 약관 동의 | 약관 체크박스 2종 | 전 플랜 |
| CTA | 결제 실행 | 전 플랜 |

Order Summary는 약관 체크박스 아래, CTA 버튼 위에 고정 배치한다.

노출 순서는 고정한다 (`checkout-feature-spec.md` §4-3).

```
1. 제품 (read-only)
2. 지불 방식
3. SW Account 선택 · 생성        ← Indie 제외
   └ 축 B 판정 결과 인라인 표시   ← 선택 완료 후. 사용자 선택 컨트롤 없음
4. Seat 수 (축 A)
5. Billing Address
6. 결제 수단
```

### 5.2 개인 플랜과 Organization 플랜의 차이

| 항목 | 개인 플랜 | Organization 플랜 |
|---|---|---|
| SW Account 선택 | 없음 | 있음 (Indie는 1개 고정 — 선택 UI 없음) |
| 구매 유형 축 B 판정 표시 | 없음 | 있음 — SW Account 선택 영역 안 |
| Seat 수 선택 | 없음 | 있음 |
| Billing Address 출처 | 개인 주소 | 조직 주소 |
| Order Summary 단가 · Seat 수 행 | 숨김 | 표시 |

구매 유형(Purchase Type)을 고르는 선택 행은 존재하지 않는다. 축 A는 진입 경로로, 축 B는 시스템 판정으로 결정된다. 근거와 구성은 §7에 기술한다.

---

## 6. SW Account 선택 · 신규 생성 (플로우 ④)

Organization 플랜은 라이선스를 붙일 대상을 먼저 지정해야 결제할 수 있다. SW Account 선택 결과가 구매 유형 축 B의 판정 입력이 되므로(§7-2), 이 단계를 완료하기 전에는 판정 결과를 표시하지 않는다.

### 6.1 선택

- Card 1에서 Organization이 보유한 SW Account 목록을 드롭다운으로 표시한다.
- 선택된 SW Account의 라이선스 유무·만료일을 조회해 축 B를 New 또는 Extend로 판정하고, 판정 결과와 근거(현재 만료일 → 구매 후 만료일)를 선택 영역 안에 인라인으로 표시한다 (§7-2). 사용자 선택 컨트롤은 두지 않는다.
- Seat 수는 구매 수량이며, SW Account 지정과 별개 축이다. Seat 수만큼 SW Account를 결제 시점에 지정하지 않는다. 결제 완료 후 Team Console에서 배정한다. (`checkout-feature-spec.md` §4-1 · §4-2)
- 목록 조회 실패 시 인라인 에러와 재시도를 표시한다. 상세는 §22에 기술한다.

### 6.2 신규 생성

- **SW Account 생성은 Checkout과 Team Console 두 곳에서 모두 가능하다.** (`checkout-feature-spec.md` §4-1 SW-02)
- 보유 SW Account가 없거나 새 계정에 붙이려면 결제 흐름 안에서 신규 생성한다.
- 생성 주체는 Organization Owner만 가능하다.
- 생성 인원 제한은 없다.
- Organization Owner가 이메일을 지정해 SW Account 하위에 초대한다. 초대받은 사람은 해당 이메일로 CLO-SET 회원가입 후 사용한다.
- SW Account는 Web 로그인이 없고 라이선스 할당 전용 마스터키로 동작한다.
- SW Account의 CLO-SET 계정 통합은 지원하지 않는다.

### 6.3 빈 상태

SW Account가 하나도 없으면 목록 대신 생성 유도 안내를 표시한다.

### 6.4 Organization 미보유

Organization 플랜 대상이면서 Organization을 보유하지 않은 Member는 Organization 생성 단계를 선행한다. 생성 후 결제 흐름으로 복귀한다. Member당 Organization은 1개이므로 생성 이후 선택 단계는 발생하지 않는다 (§2-1).

### 6.5 Indie 예외

Indie Annual은 **Enduser ID(SW Account) 1개로 고정**한다. (`checkout-feature-spec.md` §4-1 SW-06, 근거 MDWEB-590)

- SW Account 선택 단계를 노출하지 않는다.
- 첫 구매 시 Enduser ID 1개를 생성하고, 이후 구매는 그 계정에 라이선스만 추가한다.
- 최대 5 라이선스까지 구매할 수 있고, 초과분은 Enterprise 정가로 구매한다.

---

## 7. 구매 유형 — 2원 구조

구매 유형은 **두 개의 독립된 축**으로 구성한다. 두 축은 동시에 성립한다. (`checkout-feature-spec.md` §4-2)

**사용자는 결제 페이지에서 구매 유형을 고르지 않는다.** 축 A는 진입 경로로 이미 결정돼 있고, 축 B는 시스템이 판정한다. 구매 유형을 선택하는 UI 컨트롤은 결제 페이지에 존재하지 않는다.

### 7.1 축 A — Seat 수량 (진입 경로로 결정)

무엇을 몇 개 사는가를 정하는 축이다.

| 값 | 의미 | 진입 경로 |
|---|---|---|
| 신규 구매 | 라이선스를 처음 구매 | Plan 페이지 플랜 카드 |
| Add | 기존 Organization에 수량 추가 | Team Console |

Add는 Team Console에서 시작하고 결제 단계만 이 페이지로 넘어온다. 진입 시점에 대상 Organization과 플랜이 확정된 상태로 전달된다.

### 7.2 축 B — 선택한 SW Account 처리 (시스템 판정)

선택한 SW Account에 라이선스를 어떻게 붙이는가를 정하는 축이다. **사용자가 고르지 않는다. 시스템이 선택된 계정의 라이선스 상태를 보고 판정한다.**

| 판정값 | 판정 조건 | 결과 |
|---|---|---|
| New | 선택한 계정에 라이선스 없음 (신규 생성 포함) | 신규 할당. 시작일 = 결제일 |
| Extend | 선택한 계정에 활성 라이선스 있음 | 기존 만료일 이후로 기간 연장 |

**Reserve는 제공하지 않는다.** 만료 후 시작하도록 예약하는 구매 유형은 이번 범위에서 구현하지 않는다. 축 B는 New · Extend 2종이다.

#### 노출 방식

- 노출 위치는 **SW Account 선택 과정 안**이다. 별도의 구매 유형 행을 두지 않는다.
- 사용자 선택 컨트롤(라디오 · 드롭다운 · 탭)을 두지 않는다.
- 계정을 선택하면 판정 결과와 그 근거를 함께 표시한다.
  - 판정 결과: New 또는 Extend
  - 근거: 현재 만료일 → 구매 후 만료일
- 라이선스 없는 계정을 선택했거나 신규 생성한 경우에는 만료일이 없으므로 시작일 = 결제일을 표시한다.

### 7.3 플랜별 허용 조합

| 플랜 | 축 A | 축 B (시스템 판정) |
|---|---|---|
| Enterprise Single | 신규만 (Seat 1) | New · Extend |
| Enterprise Team | 신규 · Add | New · Extend |
| Enterprise Linux | 신규 · Add | New · Extend |
| Academic Annual | 신규 · Add | New · Extend |
| Indie Annual | 신규 · Add | **New 고정** — Extend 불가 |

- 개인 플랜(Individual · Student)은 두 축을 모두 적용하지 않는다. Seat 1 고정, SW Account 없음.
- Indie는 Enduser ID가 1개로 고정돼 있어(§6-5) 축 B를 항상 New로 확정한다. 추가 구매는 축 A의 Add로 처리한다.

> MDWEB-590 원문 — "Indie 구매 가능 개수: 1개의 Enduser ID, 최대 5개의 네트워크 온라인 라이선스", "최초 구매후 추가 결제시: 지정된 Enduser에 Add만 가능한 구조 (Extend는 불가)".
> `MD-WEB-002.md`의 `Indie = Extend only` 표기는 오기이며 정반대다.

---

## 8. 지불 방식

- 레이블은 **"지불 방식"** 으로 고정한다. "결제 주기"를 사용하지 않는다.
- 연간(Annual)을 항상 왼쪽에 배치하고 월간(Monthly)을 오른쪽에 배치한다.
- 기본 선택은 연간이다.

### 8.1 플랜별 선택 가능 여부

| 플랜 | 연간 | 월간 | 토글 노출 |
|---|---|---|---|
| Individual | 가능 (기본) | 가능 | 노출 |
| Student | 없음 | 고정 | 미노출 |
| Enterprise Single | 없음 | 고정 | 미노출 |
| Enterprise Team | 고정 | 없음 | 미노출 |
| Enterprise Linux | 고정 | 없음 | 미노출 |
| Academic Annual | 고정 | 없음 | 미노출 |
| Indie Annual | 고정 | 없음 | 미노출 |

지불 방식이 하나뿐인 플랜은 토글을 노출하지 않고 확정된 지불 방식만 표시한다.

### 8.2 지불 방식 변경의 파급

Individual에서 연간 → 월간으로 바꾸면 Coupon 입력 필드가 사라진다. 쿠폰은 연간 결제에만 적용된다.

---

## 9. Seat 수 선택

- 용어는 **"Seat"** 으로 고정한다. "Copy"를 사용하지 않는다.
- Seat 선택은 Organization 플랜만 제공한다.
- 스텝퍼를 사용하지 않고 프리셋 탭으로 제공한다.
- Organization 플랜 가격은 Seat 단가이므로 **Seat 수 변경이 결제 금액에 직접 반영된다.** Seat 수를 변경하면 Order Summary의 `Seat 수` 행과 소계 · 세금 · 합계를 즉시 다시 계산한다.

| 플랜 | Seat UI | 최대 |
|---|---|---|
| Enterprise Single | 1 고정 — 선택 UI 없음 | 1 |
| Enterprise Team | 프리셋 탭 `[5] [10] [20] [직접 입력]` | 제한 없음 |
| Enterprise Linux | 프리셋 탭 `[5] [10] [20] [직접 입력]` | 제한 없음 |
| Academic Annual | 프리셋 탭 `[5] [10] [20] [직접 입력]` | 제한 없음 |
| Indie Annual | 프리셋 탭 `[1] [3] [5] [직접 입력]` | 5 |

Indie는 인증된 Organization 기준 최대 5 Seat까지만 구매할 수 있고, 초과분은 Enterprise 정가로만 구매할 수 있다. Indie의 Seat은 Enduser ID 1개에 붙는 네트워크 온라인 라이선스 수를 의미한다 (§6-5).

---

## 10. 플랜별 신규 구매 (플로우 ①)

| 플랜 | 선행 조건 | 지불 방식 | Seat | 특이사항 |
|---|---|---|---|---|
| Individual Monthly | 없음 | 월간 | — | 14일 Trial 진입 가능 — §14 |
| Individual Annual | 없음 | 연간 | — | 14일 Trial 진입 가능 · 자동 갱신 — §14 |
| Student Monthly | Student 인증 완료, 4년 이내 | 월간 고정 | — | 3개월 Student Benefit — §13 |
| Enterprise Single | Organization 보유 | 월간 고정 | 1 고정 | 동시접속 불가 |
| Enterprise Team | Organization 보유 | 연간 고정 | 선택 | — |
| Enterprise Linux | Organization 보유 | 연간 고정 | 선택 | Linux OS 전용 |
| Academic Annual | Organization + Academic 인증 완료 | 연간 고정 | 선택 | — |
| Indie Annual | Organization + Indie 인증 완료 | 연간 고정 | 최대 5 | Enduser ID 1개 고정 · Extend 불가 |

Organization 플랜은 §6 SW Account 선택을 선행한다. Indie는 예외로 선택 단계가 없다 (§6-5).

---

## 11. Seat 추가 · 기간 연장 (플로우 ②)

### 11.1 진입

Team Console에서 Add 또는 Extend를 시작하면 결제 단계로 이 페이지에 진입한다. 진입 시 대상 Organization과 플랜이 확정돼 있다.

두 흐름은 §7의 서로 다른 축에 속한다. Add는 축 A(수량)이고, Extend는 축 B(선택한 SW Account 처리)다. 따라서 Add로 진입해도 SW Account를 고르면 축 B가 New · Extend 중 하나로 판정된다.

### 11.2 신규 구매와의 차이

| 항목 | 신규 구매 | Add | Extend |
|---|---|---|---|
| 대상 라이선스 | 신규 생성 | 기존 라이선스 고정 | 기존 라이선스 고정 |
| 플랜 선택 | 가능 | 불가 — 기존 플랜 승계 | 불가 — 기존 플랜 승계 |
| 지불 방식 선택 | 플랜별 | 불가 — 기존 승계 | 불가 — 기존 승계 |
| Seat 수 | 선택 | 추가할 Seat 수만 입력 | 변경 불가 |
| 기간 | 신규 시작 | 기존 만료일에 맞춤 *(정책 확인 필요 — §24 G25)* | 연장 기간 선택 |
| 결제 금액 | 전체 | 추가 Seat 증분 | 연장 기간분 |

### 11.3 플랜별 제약

| 플랜 | Add | Extend |
|---|---|---|
| Enterprise Team | 가능 | 가능 |
| Enterprise Linux | 가능 | 가능 |
| Academic Annual | 가능 | 가능 |
| Indie Annual | 가능 | 불가 — Enduser ID 1개 고정, 축 B는 New만 (§7-3) |

---

## 12. Enterprise Single → Team 전환 (플로우 ③)

> `policy-doc.md` §4 확정 반영 (2026-08-05).

### 12.1 전환 방식

Enterprise Single(월간)에서 Enterprise Team(연간)으로 전환할 때 **즉시 전환한다. 예약이 아니다.** 남은 월간 기간은 새 만료일에 더해진다. (`policy-doc.md` §4 확정)

| 항목 | 처리 |
|---|---|
| 전환 시점 | **구매 즉시 Annual로 변경** |
| 기간 | 기존 만료일 + 1년 |
| 잔여 기간 일할 정산 | 없음 — 즉시 변경이므로 정산하지 않는다 |
| 환불 | 없음 — 남은 월간 기간은 만료일에 더해진다 |
| Seat 수 | 구매 시점에 선택 가능 |

예: 월간 기간이 20일 남은 상태에서 전환하면 **20일 + 1년**이 새 만료일이 된다.

### 12.2 결제 페이지 처리

- 전환 대상 기존 라이선스와 만료일을 화면에 표시한다.
- 즉시 전환이며 남은 기간이 새 만료일에 더해진다는 점을 안내한다.
- Seat 수는 §9 Enterprise Team 기준으로 선택한다.
- **기존 SW Account는 그대로 승계된다.** 전환을 위해 SW Account를 재생성하거나 재초대하지 않는다.
- 승계 대상은 SW Account 계정 자체다. 승계 시점에 라이선스 할당 상태까지 그대로 유지되는지는 별건이다. *(정책 확인 필요 — §24 G28)*
- Card 1에서 SW Account 선택 UI 노출 여부는 승계 전제에 따라 달라진다. *(정책 확인 필요 — §24 G28)*

---

## 13. Student Benefit 처리

- 학생 인증 완료 후 3개월 무료 혜택을 제공한다.
- **"Trial" 라벨을 노출하지 않는다.**
- 무료 기간은 학생 인증 승인 시점에 시작한다.
- 무료 기간 종료 후 $8.25/월 자동결제를 시작한다.
- 이용 기간은 **최초 학생 인증 승인일** 기준 4년(48개월) 이내이며, 4년 카운터는 Pause · Suspended · Cancelled 중에도 계속 흐른다. 구매 횟수 제한은 없다. (`docs/policy/plan.md` §3 Student)
- Annual 옵션은 없다.

### 13.1 결제 페이지 표기

무료 기간이 있는 첫 결제는 아래와 같이 표기한다. (`checkout-feature-spec.md` §2-1 · §5)

- Order Summary의 결제 예정 금액은 `$0.00`으로 표시한다.
- 보조 안내로 "3개월 후 $8.25 청구"를 함께 노출한다.
- 결제수단은 등록만 받고 실제 청구를 무료 기간 종료 시점으로 미룬다.
- "Trial" 라벨은 어떤 위치에도 노출하지 않는다.

---

## 14. Individual Trial · 자동 갱신

### 14.1 14일 Trial

- Individual 구매 경로는 두 가지다.
  - Trial 경유: Trial 시작 시 Monthly·Annual 중 하나를 선택하고, 14일 무료 종료 후 선택한 플랜으로 자동 결제가 시작된다.
    - Monthly를 선택한 경우: $39/월
    - Annual을 선택한 경우: $280/년
  - 바로 구매: Trial 없이 Monthly 또는 Annual을 즉시 구매한다.
- Trial 기간 중 취소할 수 있고, 취소 후 동일 계정으로 재Trial은 불가하다.
- Enterprise · Academic · Indie는 자동 Trial이 없다. 제공 여부는 문의로 결정한다.
- **Trial 시작도 Checkout을 경유한다.** 카드 정보를 수집해야 하므로 Trial 진입과 구매가 같은 페이지를 쓴다. (2026-08-05 확정)

### 14.2 자동 갱신 (2026-08-05 확정)

- Individual Annual은 **Subscription이므로 자동 갱신이 기본 동작**이다. 켜고 끄는 옵션이 아니다.
- 결제 페이지에 Auto Renew 토글을 노출하지 않는다.
- 갱신을 원하지 않으면 구독 자체를 해지한다. 해지 처리는 MyPage에서 수행한다.

---

## 15. Order Summary 구성

### 15.1 행 구성

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

### 15.2 플랜별 소계

Organization 플랜은 **Seat 단가 × Seat 수**로 계산한다.

| 플랜 | 단가 | 소계 계산 |
|---|---|---|
| Individual Monthly | — | $39.00 |
| Individual Annual | — | $280.00 |
| Student Monthly | — | $8.25 *(정책 확인 필요 — Student Benefit 첫 결제 표기, §13-1)* |
| Enterprise Single | — | $199.00 (Max 1 — Seat 개념 미적용) |
| Enterprise Team | $2,000.00 / Seat | $2,000.00 × Seat 수 |
| Enterprise Linux | $2,300.00 / Seat | $2,300.00 × Seat 수 |
| Academic Annual | $1,500.00 / Seat | $1,500.00 × Seat 수 |
| Indie Annual | $800.00 / Seat | $800.00 × Seat 수 (최대 5 Seat) |

### 15.3 Add · Extend 시 소계

- Add: 추가 Seat 수 기준 증분 금액
- Extend: 연장 기간 기준 금액

---

## 16. Coupon · Discount

### 16.1 Coupon

- **개인 플랜 Checkout에서만** 쿠폰을 입력할 수 있다. Organization 계열(Enterprise · Academic · Indie)은 입력 UI를 노출하지 않는다. (2026-08-05 확정)
- 개인 플랜 중에서도 **연간 결제에서만** 입력할 수 있다.
- Order Summary 위에 쿠폰 입력 필드와 적용 버튼을 배치한다.
- 유효한 쿠폰은 Order Summary에 `Coupon` 행으로 `-$n`을 표시한다.
- 유효하지 않은 쿠폰은 입력 필드 하단에 인라인 에러를 표시한다.

| 실패 케이스 | 문구 (WF EN) |
|---|---|
| 잘못된 코드 | `This coupon code is invalid.` |
| 만료된 코드 | `This coupon has expired.` |
| 적용 불가 | `This coupon can't be applied to your current subscription.` |

### 16.2 Discount

- 프로모션 코드 또는 관리자 지정 할인이 적용될 때 발생한다.
- Order Summary에 `Discount` 행으로 `-$n`을 표시한다.
- 연간 · 월간 모두 적용할 수 있다.

### 16.3 계산 순서

세금은 Coupon · Discount 적용 후 금액을 기준으로 계산한다.

---

## 17. Tax / VAT

### 17.1 세액 계산 주체와 국가별 세율

세액을 누가 계산하는지가 국가에 따라 다르다. (`checkout-feature-spec.md` §3-5)

| 지역 | 세액 계산 주체 |
|---|---|
| US · EU | Avalara |
| KR | 10% 고정 |
| CN | ItemCode별 — `CLO_PLC` 13% / `CLO_RLC` 6% |
| 그 외 | CLOver Admin 내 계산 |

Avalara 계산 범위는 US(주별)와 EU뿐이다. `checkout.md` §5.3의 "Stripe Tax API로 세율 확정"은 오류이며, 실제 엔진은 Avalara다.

아래 세율표는 **US · EU에서는 Avalara 응답이 기준이고, 그 외 국가에서는 이 표가 기준**이다.

| 그룹 | 국가 | 세율 | 세금 행 라벨 |
|---|---|---|---|
| 부가세 | KR | 10% | `VAT 10%` |
| 부가세 | JP | 10% | `消費税 10%` |
| 부가세 | AU | 10% | `GST 10%` |
| 부가세 | SG | 9% | `GST 9%` |
| 부가세 | EU (DE · FR · NL 등) | 국가별 19~27% | `MwSt XX%` / `TVA XX%` |
| 부가세 | GB | 20% | `VAT 20%` |
| 부가세 | CN | ItemCode별 13% / 6% | `增值税 XX%` |
| 주소 기반 | US | State tax | `Tax` |
| 주소 기반 | CA | Province tax | `Tax` |
| 세금 없음 | 그 외 | 0% | 행 표시 안 함 |

### 17.2 감면 대상 국가 Tax ID

- **"사업자이신가요?" 확인 링크를 두지 않는다.** 감면 대상 국가를 선택하는 것 자체가 Tax ID 입력 행의 노출 트리거다. (`requirements/[MD-SITE]-tax-id-checkout.md` TO-BE)
- Billing Address의 국가가 감면 대상이면 Tax ID 입력 행을 자동으로 노출한다. 입력은 Optional이다.
- 유효한 Tax ID 입력 시 세율을 0%로 적용하고 세금 행에 `VAT 0% (Reverse Charge)`를 표시한다.
- 미입력 시 해당 국가 표준 세율을 적용한다.
- 1차 감면 대상: EU 27개국 · 영국 · 멕시코. 세부 목록과 검증 방식은 `tax-id-checkout.md`가 소유한다.

### 17.3 ZIP 기반 세금 확정

- **ZIP · 우편번호는 전 국가 필수 입력이다.** (`checkout-feature-spec.md` §3-2 · §3-3)
- 미국은 국가 + 주(State) + ZIP으로 세율을 결정한다.
- 그 외 국가는 국가 + ZIP으로 세율을 결정한다. EU도 ZIP이 필요하다 — 카나리아 제도(ES) · 마데이라(PT) · 올란드(FI) 등 특별 VAT 지역이 우편번호로 갈린다.
- Address line 1 · 2는 입력받되 세금 계산에 사용하지 않는다. 인보이스 표기용이다.
- ZIP 미확보 상태에서는 세금 행에 계산 대기 안내를 표시하고 합계를 확정하지 않으며, CTA를 비활성 처리한다.

---

## 18. Billing Address · 결제수단

### 18.1 Billing Address 개념

결제 페이지에는 Country 드롭다운이 없다. 국가·주·ZIP은 모두 **Billing Address**에서 온다. (`checkout-feature-spec.md` §3-1)

| 항목 | 개인 플랜 | Organization 플랜 |
|---|---|---|
| 조회 대상 | 개인 주소 | 조직 주소 |
| 관리 위치 | MyPage | Team Console |

- 결제 페이지는 해당 주소를 조회해 표시하고, 없으면 생성하고, 있으면 수정할 수 있게 한다.
- 주소 관리 화면 자체는 이 문서 범위 밖이다 (§1-2).

### 18.2 조회 · 생성 · 수정

| 상태 | 처리 |
|---|---|
| 주소 있음 | 주소를 표시하고 **[수정] 버튼**으로 모달을 연다 |
| 주소 없음 | 결제 페이지에서 **모달로 생성**한다. 개인·조직 동일한 모달을 쓰고, 저장 시 각각 개인 주소 / 조직 주소로 생성한다 |
| 저장 성공 후 | **가격 재조회를 1회 호출**하고 화면 금액을 갱신한다 |
| 주소 또는 ZIP 없음 | 가격 미확정. 세금·합계를 표시하지 않고 CTA를 비활성 처리한다 |

### 18.3 주소 필드

| 필드 | 필수 | 세금 계산 사용 |
|---|:---:|:---:|
| 국가 | O | O |
| 주 (State) — 미국만 | O | O |
| ZIP · 우편번호 | O (전 국가) | O |
| Address line 1 · 2 | O | ✖ — 인보이스 표기용 |

### 18.4 유효성 검사

검사 시점은 **PG(PayPal · Stripe) 이동 직전**이다. 입력 중에는 검사하지 않는다.

| 국가 | 검사 내용 |
|---|---|
| 미국 | 실제 주소 존재 여부 |
| 우편번호가 있는 국가 | 해당 국가 안에 그 ZIP이 존재하는지 |
| 우편번호가 없는 국가 (홍콩 · UAE 등) | 형식만 검사. 존재 검증은 건너뛴다 |

**주소 검증에 Avalara를 사용하지 않는다.** Avalara는 미국 외 주소 검증을 지원하지 않는다.

Avalara 호출 시점은 다음과 같다.

| 시점 | 호출 |
|---|---|
| MyPage · Team Console에서 주소 저장 | 미호출 — 저장만 |
| 결제 페이지 진입 (주소 있음) | 조회 (uncommitted) |
| 결제 페이지에서 주소 생성 · 수정 저장 후 | 조회 1회 |
| 결제 확정 | commit — 조회 시 발급된 transaction id를 그대로 커밋 |

### 18.5 결제수단

노출 결제수단은 **Billing Address의 국가**를 기준으로 결정한다. 주소 입력 전에는 접속 IP로 중국 여부만 판정한다. (`checkout-feature-spec.md` §3-7)

| 조건 | 노출 결제수단 |
|---|---|
| 중국 — 접속 IP가 중국 **또는** Billing Address 국가가 중국 | 신용카드 / 체크카드 + **AliPay** |
| 그 외 (한국 포함) | 신용카드 / 체크카드 + PayPal |

- AliPay는 중국 전용이다. 다른 국가에 노출하지 않는다.
- **Kakao Pay는 제공하지 않는다.** 한국도 카드 + PayPal이다.

---

## 19. 결제 실행과 결과 처리

### 19.1 CTA 활성 조건

아래를 모두 충족할 때 CTA가 활성화된다.

- 약관 체크박스 2종 모두 동의
- 결제수단 선택 완료
- Billing Address 확보 — 전 국가 ZIP 입력 완료로 가격이 확정된 상태 (§17-3 · §18-2)
- Organization 플랜은 SW Account 선택 완료 — 선택 완료 시 축 B가 자동 판정되므로 별도 사용자 입력은 없다 (§6 · §7-2)

### 19.2 CTA 문구

| 결제수단 | CTA (WF EN) |
|---|---|
| 신용카드 / 체크카드 | `Pay with Card` |
| PayPal | `Continue to PayPal` |
| 미선택 | `Continue` (비활성) |

### 19.3 결제 성공

- 결제 완료 화면으로 이동한다.
- 완료 화면에서 다음 행동을 안내한다.

| 플랜 | 다음 행동 |
|---|---|
| 개인 플랜 | 소프트웨어 다운로드 · MyPage 확인 |
| Organization 플랜 | SW Account 초대 · Team Console 확인 |

- 저장된 결제 세션 데이터를 삭제한다 (§20).

### 19.4 결제 실패

모달로 처리한다. 토스트를 사용하지 않는다.

| 요소 | 문구 (WF EN) |
|---|---|
| Title | `Payment Failed` |
| Body | `There was an error while requesting the payment. Please try again shortly.` |

- Error Code를 UI에 노출하지 않는다.
- 모달을 닫으면 입력값을 유지한 채 결제 페이지로 복귀한다.

---

## 20. 이탈 · 복귀 시 입력값 유지

- 사용자가 PG 페이지에서 뒤로 오거나 페이지를 새로고침해도 입력값을 유지한다.
- 유지 대상: 플랜, 지불 방식, SW Account 선택, Seat 수, Billing Address 선택 상태, 결제수단, 쿠폰 적용 상태
- 축 A는 진입 경로에서, 축 B는 SW Account 선택 결과에서 다시 도출되므로 별도로 저장하지 않는다.
- 결제 완료 시 저장 데이터를 삭제한다.

---

## 21. 인증 대기 · 거절 상태에서의 결제

### 21.1 인증 상태별 처리

| 인증 | 상태 | 결제 |
|---|---|---|
| Student | 인증 없음 | Student 플랜 결제 불가. 인증 안내 |
| Student | 인증 완료 | 결제 가능 |
| Student | 재인증 필요 | 결제 불가. 재인증 안내 |
| Academic | 인증 없음 | Academic 플랜 결제 불가. 인증 안내 |
| Academic | 인증 대기 중 | 결제 불가. 검토 중 안내. CTA 비활성 |
| Academic | 인증 완료 | 결제 가능 |
| Indie | 인증 없음 | Indie 플랜 결제 불가. 인증 안내 |
| Indie | 인증 대기 중 | 결제 불가 *(정책 확인 필요 — §24 G22)* |
| Indie | 인증 완료 | 결제 가능 |

### 21.2 Indie 상태 표시 충돌

`checkout.md` §1은 Indie 인증 Pending 시 "인증 검토 중" 안내를 표시한다고 정의하지만, `plan.md` §3 Indie 운영 정책은 신청 상태값을 클라이언트에 노출하지 않는다고 정의한다. 차단 화면에서 무엇을 표시할지 확정이 필요하다. *(정책 확인 필요 — §24 G22)*

### 21.3 인증 절차 범위

인증 신청·서류 제출·이메일 코드 입력은 이 문서 범위 밖이며 `verification.md`가 소유한다. 결제 페이지는 인증 결과만 참조한다.

---

## 22. 에러 · 빈 상태 · 로딩 기준

### 22.1 패턴 선택

| 상황 | 패턴 |
|---|---|
| 화면 전체 사용 불가 | 전면 페이지 에러 |
| 특정 섹션·리스트만 실패 | 인라인 에러 + 재시도 |
| 입력값 검증 실패 | 필드 인라인 에러 |
| 결제 요청 실패 | 모달 (§19-4) |
| 로딩 중 | Skeleton |

### 22.2 전면 에러

| 상황 | Title (WF EN) | Body (WF EN) |
|---|---|---|
| 세션 만료 | `Session expired` | `Your session has ended. Sign in to continue.` |
| 서버 오류 | `Something went wrong` | `A temporary error occurred. Try again in a moment.` |
| 점검 | `Under maintenance` | `The service is temporarily unavailable. Check back soon.` |

에러 코드 숫자를 UI에 노출하지 않는다.

### 22.3 인라인 상태

| 상황 | 문구 (WF EN) |
|---|---|
| SW Account 목록 조회 실패 | `Couldn't load this list` / `A temporary error occurred.` + `Try again` |
| 필수 입력 미완 | `This field is required.` |
| 이메일 형식 오류 | `Enter a valid email.` |
| 쿠폰 오류 | §16-1 참조 |

재시도는 해당 섹션 조회만 재실행한다.

### 22.4 빈 상태

| 상황 | 처리 |
|---|---|
| SW Account 없음 | 생성 유도 안내 + 생성 진입 |

### 22.5 로딩

- 페이지 · 컴포넌트 모두 **Skeleton**으로 처리한다. 로딩 휠을 사용하지 않는다.
- 결제 처리 중에는 CTA 버튼 내부 인디케이터만 사용한다.

---

## 23. 운영 · CS 대응 포인트

### 23.1 Admin 수동 처리 필요 지점

| 지점 | 내용 |
|---|---|
| Academic 인증 심사 | 도메인 · 서류 확인 후 Confirm |
| Indie 인증 심사 | 사업자 등록 · 매출 증빙 확인. 자동 Reject 없음 |
| Enterprise Offline | BD 별도 계약 — 웹 결제 대상 아님 |
| Discount 지정 | 관리자 지정 할인 적용 |
| Indie 5 Seat 초과 요청 | Enterprise 라이선스 전환 안내 |

### 23.2 CS 문의 발생 가능 지점

| 지점 | 예상 문의 |
|---|---|
| Student 4년 초과 차단 | "왜 결제가 안 되는가" — 최초 인증 승인일 기준이며 Pause · Cancelled 중에도 카운터가 흐름 |
| Indie 인증 대기 중 상태 미노출 | "신청이 접수됐는지 알 수 없다" |
| ZIP 미입력으로 가격 미확정 | "합계가 안 나오고 결제 버튼이 눌리지 않는다" — 전 국가 ZIP 필수 |
| Billing Address 없음 | "결제하려는데 주소부터 넣으라고 한다" — 개인은 MyPage, 조직은 Team Console에서도 등록 가능 |
| 감면 대상 국가 Tax ID | "사업자인데 세금이 붙는다" — Tax ID 입력 시 0% |
| 한국에서 Kakao Pay 미노출 | "간편결제가 없다" — 카드 + PayPal만 제공 |
| Single → Team 전환 | "남은 월간 기간은 어떻게 되는가" — 즉시 전환 + 만료일에 가산 |
| Add 시 기간 | "추가한 Seat의 만료일이 기존과 다르다" |
| Student Benefit 첫 결제 | "무료라고 했는데 금액이 표시된다" |
| SW Account 초대 이메일 | "초대받은 사람이 로그인이 안 된다" — SW Account는 Web 로그인 없음 |
| 쿠폰 월간 미적용 | "쿠폰 입력창이 안 보인다" |

### 23.3 이벤트 로깅 포인트

| 지점 | 목적 |
|---|---|
| 결제 페이지 진입 (플랜 · 결제 모드별) | 유입 퍼널 시작 |
| 진입 차단 발생 (차단 사유별) | 차단 사유 분포 |
| SW Account 선택 완료 · 신규 생성 | Organization 플랜 이탈 구간 파악 |
| 구매 유형 축 B 판정 결과 (New · Extend) | 연장 수요 분포 |
| 지불 방식 변경 | 연간 기본값 유효성 |
| Seat 수 확정 | 실제 구매 Seat 분포 |
| 쿠폰 적용 성공 · 실패 (실패 사유별) | 프로모션 효율 |
| Billing Address 생성 · 수정 | 세금 · 주소 이탈 구간 |
| CTA 활성 전환 | 결제 직전 도달률 |
| 결제 요청 · 성공 · 실패 | 전환율 · 실패율 |

---

## 24. 정책 격차 · 미결 항목

### 24.1 이번 문서에서 해소된 항목

| # | 항목 | 결정 |
|---|---|---|
| G2 · G3 | Student 구매 제한 · 가격 | `plan.md` 기준 — Monthly only $8.25, 4년 이내. `checkout.md` §1 "2회 초과 차단" · §4 "Student Annual $99.00"은 stale, 폐기 대상 |
| G4 | Enterprise 플랜 명칭 | Enterprise Single / Enterprise Team으로 통일 |
| G5 | Seat 용어 | "Seat" 고정. "Copy" · "시트 수" 폐기 |
| G6 | 지불 방식 레이블 | "지불 방식" 고정. "결제 주기" 폐기 |
| G7 | 단가 · Seat 행 노출 조건 | Organization 플랜 기준으로 재정의 (§5-2) |
| G8 · G9 | 결제수단 국가 분기 · AliPay CTA | **해소 (2026-08-05 확정)** — 중국(IP 또는 Billing Address 국가)만 카드 + AliPay, 그 외는 카드 + PayPal. Kakao Pay 미제공 (§18-5) |
| G10 | 구매 유형 종속 대상 | **해소 (2026-08-05 확정)** — 축 B는 선택된 SW Account의 라이선스 상태에 종속하며 시스템이 판정한다. 사용자 선택 컨트롤 없음. 판정 결과는 SW Account 선택 영역 안에 표시 (§7-2) |
| G11 | 상태 복원 저장 키 | SW Account 기준으로 통일 (§20) |
| G12 | Coupon · Discount 누락 | `plan.md` 기준으로 §16에 편입 |
| G14 | Enterprise Linux | 확정 — Enterprise Team과 동일 구조, Linux OS 전용, Annual Prepaid only, $2,300 |
| G15 | Single → Team 전환 | **해소 (`policy-doc.md` §4 확정)** — 즉시 전환. 기존 만료일 + 1년. 정산·환불 없음 (§12) |
| G16 | Add / Extend / Reserve | **해소 (2026-08-05 확정)** — 2원 구조. 축 A(신규 · Add) × 축 B(New · Extend, 시스템 판정). **Reserve 미제공** (§7) |
| G19 | SW Account 결제 페이지 접근 | 진입 경로 없음으로 명시 (§4) |
| G21 | Seat 단가 vs 총액 기준 | **해소 (2026-07-29 확정)** — Organization 플랜 표기 금액은 Seat 단가. 소계 = 단가 × Seat 수. Enterprise Single은 Max 1이라 단가 개념 미적용 (§3-2 · §15-2) |
| G26 | Single → Team 전환 시 SW Account 승계 | **해소 (2026-07-29 확정)** — 기존 SW Account를 그대로 승계. 재생성 · 재초대 불필요 (§12-2) |
| G13 | Academic · Indie 구매 자격 주체 | **해소 (2026-08-05 확정)** — Academic · Indie 자격은 인증 Organization 단위. 인증은 선택지를 넓히며 다른 플랜 구매를 막지 않는다 (§2-2) |
| G17 | Student Benefit 결제 표기 | **해소 (2026-08-05 확정)** — 결제 예정 금액 `$0.00` + "3개월 후 $8.25 청구" 보조 안내. "Trial" 라벨 금지 유지 (§13-1) |
| G23 | Organization 미보유 Member의 Organization 플랜 진입 | **해소 (2026-08-05 확정)** — 차단하지 않고 Organization 생성 단계를 선행한다. Member당 1개 (§2-1 · §6-4) |
| G24 | Seat 수 > 1일 때 SW Account 지정 | **해소 (2026-08-05 확정)** — Seat 수와 SW Account 지정은 별개 축. 결제 시점에 Seat 수만큼 지정하지 않고 결제 후 Team Console에서 배정 (§6-1) |
| G27 | Individual 14일 Trial 결제 경로 | **해소 (2026-08-05 확정)** — Checkout이 Trial 진입을 겸한다. 카드 정보 수집이 필요하기 때문 (§14-1) |
| G29 | `checkout.md` §4 Indie 총액 표기 stale | **해소 (2026-08-05 확정)** — 기준은 Seat 단가 `$800 / Seat`. `checkout.md` §4 총액 표기는 수정 예정 (§15-2 · §24-3) |

### 24.2 미결 항목

| # | 항목 | 내용 | 관련 섹션 |
|---|---|---|---|

| G20 | Student Benefit 이용 중 Plan 카드 · 진입 처리 | `checkout-feature-spec.md` §5-1 제안(`Check my Status` 재사용) 확정 대기. 동 문서 미결 M11 | §4 |
| G22 | Indie 인증 대기 상태 표시 | `checkout.md` §1(검토 중 안내)과 `plan.md` §3(상태값 미노출)이 충돌 | §4 · §21-2 |
| G25 | Add 시 추가 Seat 만료일 | 기존 라이선스 만료일에 맞추는지, 별도 기간으로 시작하는지 미정의 | §11-2 |
| G28 | Single → Team 전환 시 라이선스 할당 상태 유지 | SW Account 계정 승계는 확정(G26). 승계 시점에 라이선스 할당 상태까지 유지되는지, Card 1에 SW Account 선택 UI를 노출할지 미정의 | §12-2 |
| G31 | Seat · 쿠폰 변경 시 Avalara 재조회 | 재조회 여부와 디바운스 정책 미정의. `checkout-feature-spec.md` 미결 M9 | §18-4 |

### 24.3 정책 파일 갱신 필요

| 파일 | 갱신 항목 |
|---|---|
| `checkout.md` | 구 MemberType 기준 전면. §1 Student 2회 제한 · §4 Student Annual $99.00 · §4 Indie Annual $800.00 총액 표기(G29) · §4 CompanyID 항목 · §7 License ID 폐기. §2 · §3 Country 드롭다운 기준을 Billing Address 국가로 교체. §5.1 하드코딩 세율표에 계산 주체 구분 명기. §5.2 "사업자이신가요?" 링크 제거. §5.3 "Stripe Tax API" → Avalara. §5.3 ZIP 필수 범위 US · CA → 전 국가. §3 결제수단표에 중국 AliPay 추가 · Kakao Pay 제거. 갱신 소유권 미정 |
| `plan.md` | §2-1에 Enterprise Linux 누락 — 항목 추가 필요. §2-1 Enterprise Team · Indie 가격에 `/Seat` 표기 추가(G21 확정 반영). §3 Academic · Indie의 CompanyID 표현 갱신. §4-2 구매 유형 규칙을 2원 구조로 갱신 |
| `plan-card.md` | `For Student` · `For Individual` · `For Enterprise` 비활성 문구 전부 삭제(§2-2). Student Benefit 이용 중 버튼 처리(G20) 확정 후 반영. 전체 재작성 필요 |
| `MD-WEB-002.md` | 구매 유형 `Extend / Reserve` 2종 → 2원 구조로 교체. `Indie = Extend only` 오기 수정. `License ID 드롭다운` → `SW Account` |
| MDWEB-863 | Organization 별도 주소가 "리뉴얼 이후"로 분류돼 있고, 본문의 "등록 전 Avalara 우편번호 검증"이 §18-4 확정 흐름과 상충. 티켓 갱신 필요 |

---

## Appendix A — 신규 용어

이번 개편으로 바뀐 정책 용어만 정리한다.

| 구 용어 | 신 용어 | 바뀐 이유 |
|---|---|---|
| MemberType | 계정 유형 (Account Type) | 2026-06-23 개편으로 회원 유형별 구분을 폐지하고 계정 유형 3종(Non-Member / Member / SW Account)으로 단순화 |
| Individual · Student · Academic · Indie (MemberType) | Member + Verification | 모든 로그인 사용자를 동일한 Member로 취급하고, 플랜 구매 자격은 인증으로만 부여 |
| CompanyID | Organization Owner | 조직 단위 구매 주체를 Organization을 보유한 Member로 재정의 |
| (조직 단위 개념 없음) | Organization | 라이선스 · SW Account · 조직 레벨 인증을 담는 단위를 신설. 플랜 구매 전 독립 생성 가능하며 Member당 1개만 보유 |
| License ID | SW Account | 라이선스 할당 전용 계정임을 명확히 하기 위해 명칭 변경. Web 로그인 없음 |
| Copy | Seat | Academic · Indie 포함 전 플랜에서 좌석 단위 용어를 통일하고 "Copy" 사용을 금지 |
| 결제 주기 | 지불 방식 | 결제 반복 주기가 아니라 사용자가 고르는 지불 방식임을 드러내기 위해 레이블 변경 |
| Enterprise Monthly | Enterprise Single | 월간 여부보다 동시접속 Max 1이라는 성격이 핵심이라 명칭 변경 |
| Enterprise Annual | Enterprise Team | 연간 여부보다 N Seat 팀 단위 사용이 핵심이라 명칭 변경 |
| Student Trial | Student Benefit | 학생 인증 완료 후 3개월 무료 혜택이며 Trial과 성격이 달라 "Trial" 라벨 노출을 금지 |
| Student Annual | Student Monthly | Annual 옵션을 폐지하고 Monthly 단일 구성으로 변경 ($8.25/월) |

---

## Appendix B — 플로우 × 섹션 매핑

| 플로우 | 주요 섹션 | 보조 섹션 |
|---|---|---|
| ① 각 플랜 신규 구매 | 10 | 3 · 4 · 8 · 9 · 13 · 14 · 15 · 17 · 18 · 19 |
| ② Seat 추가 · 기간 연장 | 11 | 6 · 7 · 9 · 15 · 19 |
| ③ Enterprise Single → Team 전환 | 12 | 6 · 8 · 9 · 15 · 19 |
| ④ SW Account 선택 · 신규 생성 | 6 | 2 · 7 · 21 |

---

## 관련 문서

- 정책: `docs/policy/checkout.md`
- Figma: `PeCid7uJcg0HenViaaiHUp` / `Order/Checkout (In progress🔥)` — Spec Doc 섹션 `Scope`(`7148:2061`) · `Docs`(`7148:2062`) · 구매 타입 카드 `7276:55`
- Jira: MDWEB-870
