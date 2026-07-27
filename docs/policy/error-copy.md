# POLICY_ERROR_COPY

Figma 전체 화면(MyPage 등)에서 실제로 그려져 사용 중인 에러·토스트·배너 문구의 인벤토리. `error-states.md`가 패턴·카테고리 기준(WF EN)이라면, 이 문서는 **실사용 문구 원장**이다.

작성일: 2026-07-20
소스: Figma `PeCid7uJcg0HenViaaiHUp` MyPage 페이지(`3945:4822`) 전수 조사

---

## 1. 공통 (Shared — 여러 화면에서 재사용)

| 문구 | 용도 | 사용처 (일부) |
| --- | --- | --- |
| `"Something went wrong. Please try again."` | 기본 에러 토스트 | Nickname / Username / Language / Marketing / Profile Picture / Pause / Cancel Subscription / Invoice PDF 등 |
| `"Changes have been saved."` | 기본 성공 토스트 | 위와 동일 화면군 |
| `"This field is required."` | 필수값 미입력 인라인 에러 | Address 폼, Organization Name 등 입력 폼 전반 |
| `"Couldn't load this list"` / `"A temporary error occurred."` | 리스트 로딩 실패 (EmptyState Error) | 리스트·섹션 공통 컴포넌트 |
| `"Page not found"` 등 404/500/503/401 세트 | 전면 페이지 에러 | 앱 전체 라우트 공통 (§3 참조) |

> 기본 토스트 출처: `figma-description.md` §4.6. 구체 문구가 정의된 케이스는 그 문구를 쓰고, 그 외 일반 성공/실패에만 기본값 적용.

---

## 2. 페이지별 (Page/Domain-specific)

### Account 탭

| 상황 | 문구 |
| --- | --- |
| Danger Zone — 계정 삭제 차단 (조직 보유 중) | `"Your account cannot be deleted because it has an active organization. Please delete the organization first and try again. If you cannot delete it, please contact us."` |
| AI Terms 미동의 | `"Agreement is required to use AI tools"` / `"Consent to AI Terms Required to Use the Plug-in and Activate AI Features"` |
| Organization Name 필드 미입력 | Figma: `"Organization Name을 입력해 주세요."` → 교체안 `"Enter your organization name."` *(WF EN 위반 — Figma 교체 필요)* |
| 이메일 변경 — 형식 오류 | Figma: `"이메일 형식을 다시 확인해 주세요."` → 교체안 `"Enter a valid email."` (error-states.md §3.2 예시와 일치) *(WF EN 위반 — Figma 교체 필요)* |

### License/Billing 탭

| 상황 | 문구 |
| --- | --- |
| Suspended — 결제 실패 배너 | `"Payment failed. Please update your payment method and try again."` (확정 — mypage.md §6-2-1 반영됨) |
| Suspended — 3ds 인증 필요 배너 | `"Additional verification is required to complete your payment."` (확정 — mypage.md §6-2-1 반영됨) |
| Payment Failed 모달 (확정 통일본) | Title `"Payment Failed"` / Body `"There was an error while requesting the payment. Please try again shortly."` — Error Code 라인 없음 *(Figma 반영 대기 — §4 참조)* |
| Coupon — 잘못된 코드 | `"This coupon code is invalid."` |
| Coupon — 만료 | `"This coupon has expired."` |
| Coupon — 적용 불가 | `"This coupon can't be applied to your current subscription."` |
| Cancel Subscription — 최종 확인 안내 | `"Please review your cancelation details below. Once confirmed, this action can't be undone."` |
| Resume 실패 (토스트) | `"Couldn't resume your subscription. Please try again."` *(확정 초안 — 검토 필요)* |
| Pause 실패 (토스트) | `"Couldn't pause your subscription. Please try again."` *(확정 초안 — 검토 필요)* |

### Invited Projects 탭

| 상황 | 문구 |
| --- | --- |
| 라이선스 만료로 프로젝트 접근 불가 안내 | `"Only active projects are shown. Projects become unavailable when the owner's license expires. Please download Enterprise Software to use these licenses."` |

### 인증 / 통합계정 감지 (Account 진입 전 플로우)

> `verification.md`가 다루는 Student/Academic/Indie 인증 코드 플로우와는 **별개**의 통합계정 감지 배너.

| 상황 | 문구 |
| --- | --- |
| 인증 코드 만료 | `"The verification code has expired. Please resend the code."` |
| 인증 이메일 발송 한도 초과 | `"You've reached the verification email limit. Please contact us."` |

---

## 3. 에러 코드별

| HTTP 코드 | 표시 패턴 | 문구 | 비고 |
| --- | --- | --- | --- |
| 400 | 인라인 | `"This field is required."` | 입력 폼 공통 |
| 400 | 인라인 | `"Enter your organization name."` (Figma는 KO로 그려짐 → 교체 대기) | Account — Organization Name *(WF EN 위반)* |
| 400 | 인라인 | `"This coupon code is invalid."` / `"This coupon has expired."` / `"This coupon can't be applied to your current subscription."` | License/Billing — Coupon |
| 401 | 전면 | `"Session expired"` / `"Your session has ended. Sign in to continue."` | `error-states.md` §2.1 |
| 403 | — | *(v1 스코프 밖)* | `error-states.md` §5 |
| 404 | 전면 | `"Page not found"` / `"This page doesn't exist or has moved."` | `error-states.md` §2.1 |
| 500 / 502 / 504 | 전면 | `"Something went wrong"` / `"A temporary error occurred. Try again in a moment."` | `error-states.md` §2.1, 502/504는 500 문구 재사용 |
| 500 (결제) | 모달 | `"Payment Failed"` + `"There was an error while requesting the payment. Please try again shortly."` (Error Code 라인 없음) | *(개발 확인 필요 — 어떤 HTTP 코드에 매핑되는지)* |
| 503 | 전면 | `"Under maintenance"` / `"The service is temporarily unavailable. Check back soon."` | `error-states.md` §2.1 |
| 코드 미상 | 배너 | `"Payment failed. Please update your payment method and try again."` (Suspended 결제 실패) | *(개발 확인 필요 — 결제 실패 세부 코드 매핑)* |
| 코드 미상 | 배너 | `"Additional verification is required to complete your payment."` (Suspended 3ds) | *(개발 확인 필요)* |
| 코드 미상 | 인라인/토스트 | `"The verification code has expired. Please resend the code."` / `"You've reached the verification email limit. Please contact us."` | 통합계정 감지 — verification.md와 별개 플로우, 코드 매핑 미정 |

---

## 4. 이슈 처리 상태

### 4-1. 해소 (문구·정책 확정 — 실행은 아래 잔여 액션)

1. **Error Code UI 노출** — Payment Failed 모달 (1)·(2)를 단일 확정본으로 통일하고 Error Code 라인을 제거하기로 결정. Title `"Payment Failed"` / Body `"There was an error while requesting the payment. Please try again shortly."` (§2 반영). → 잔여: Figma 반영.
2. **미완성 플레이스홀더** — Pause/Resume 실패 문구 확정 초안 작성. Resume `"Couldn't resume your subscription. Please try again."` / Pause `"Couldn't pause your subscription. Please try again."` (§2 반영, 검토 필요).
3. **mypage.md §6-2-1 불일치** — Suspended 배너 문구 2종(결제 실패 / 3ds)이 Figma에 확정 반영됨을 명시하고, `mypage.md` §6-2-1 주석을 "확정 (error-copy.md §2 참조)"으로 정정 완료.
4. **WF 언어 위반** — Account 탭 KO 문구 2건(`"Organization Name을 입력해 주세요."` / `"이메일 형식을 다시 확인해 주세요."`)에 EN 교체안·플래그 병기 (§2·§3 반영). → 잔여: Figma 교체.

### 4-2. 잔여 액션 (이 문서 범위 밖 후속)

- **Figma 반영 대기** — Payment Failed 모달 Error Code 라인 제거 / Account 탭 KO 위반 문구 2건 EN 교체.
- **확정 초안 검토** — Pause/Resume 실패 토스트 문구 최종 승인.
- **통합계정 감지 배너 정책 문서 신규 필요** — `verification.md`는 Student/Academic/Indie 인증만 다루고, 통합계정 감지 인증 코드 플로우(§2 인증 배너 2종)는 어떤 정책 문서에도 없음. **별도 작업으로 정책 문서 신규 작성 필요.**
- **결제 실패 세부 HTTP 코드 매핑** — Suspended 결제 실패 / 3ds / 통합계정 감지 배너의 코드 매핑 미정 (§3 *(개발 확인 필요)* 3건).

---

## 관련 문서

- `error-states.md` — 에러 패턴·카테고리 기준 (WF EN)
- `verification.md` — Student/Academic/Indie 인증 코드 플로우 (한국어 확정)
- `mypage.md` §6-2-1 · §6-5 — 구독 상태 배너
