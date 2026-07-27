# POLICY_ERROR_STATES

에러 · 빈 상태 · 로딩 · 토스트 문구의 통합 기준 문서. 에러 코드별 전면 페이지와 인라인/토스트 상태의 source of truth.

작성일: 2026-07-16

---

## 0. 사용법 · 스코프 · 레이어 구분

이 문서는 도메인 횡단(cross-cutting) 관심사인 에러/빈/로딩/토스트 상태를 한곳에 정의한다. 도메인별 문서(mypage / checkout / auth)에는 각 화면 고유 에러만 두고, 공통 패턴·전면 에러·매핑 기준은 이 문서를 참조한다.

### 0.1 스코프 (v1 확정)

| 구분 | 커버 범위 |
| --- | --- |
| 전면(페이지) 에러 | 404 / 500 / 503 / 401 |
| 인라인(부분) 상태 | 리스트 로딩 실패 · 부분 실패/인라인 에러 |
| 토스트 | Success / Error / Info |
| 로딩 | Skeleton (페이지 · 컴포넌트 전 범위) |
| 문구 언어 | EN only (WF 기준) |

> KO / ZH-CN / JA 서비스 카피는 이 문서 확정 후 `ux-writing.md` 원칙 + `/translate`로 후속 생성한다. v1 산출물은 EN.

### 0.2 레이어 구분 (중요)

문구는 두 레이어로 나뉜다. 혼용하면 안 된다.

| 레이어 | 언어 | 권위 | 적용 대상 |
| --- | --- | --- | --- |
| WF (Wireframe) | **EN 필수** | `figma-wireframe-ds.md` §6 | Figma 와이어프레임에 그리는 문자열 |
| Service (실서비스) | KO 해요체 | `ux-writing.md` | 실제 배포되는 사용자 노출 문구 (후속) |

이 문서의 카피 표는 **WF(EN)** 기준이다. 실서비스 KO는 이후 ux-writing에서 생성한다.

---

## 1. Taxonomy — 어떤 실패에 어떤 패턴

### 1.1 결정 트리

```
Q1. 화면 전체가 사용 불가한가? (라우트 자체 실패 / 인증 없음 / 서버 다운 / 점검)
    YES → 전면 페이지 (§2)
    NO  → Q2

Q2. 특정 섹션/리스트만 실패했는가?
    YES → 인라인 상태 (§3) — EmptyState(Error) 또는 섹션 배너
    NO  → Q3

Q3. 사용자 액션의 즉시 결과 피드백인가? (저장/제출/복사 성공·실패)
    YES → 토스트 (§4)
    NO  → Q4

Q4. 데이터가 정상이나 비어있는가?
    YES → Empty 상태 (EmptyState No data / No result)
    NO  → 로딩 중 → Skeleton (§6)
```

### 1.2 재사용 자산 맵 (중복 정의 금지 — 링크만)

이 문서는 아래 자산을 **재정의하지 않는다.** 참조만 한다.

| 자산 | 위치 | 이 문서에서의 관계 |
| --- | --- | --- |
| 구독 상태 배너 (Suspended / 결제 실패 / 3ds) | `mypage.md` §6-2-1 · §6-5 | 구독 도메인 소유. 전면 에러 아님 → 링크만 |
| 기본 토스트 고정값 | `figma-description.md` §4.6 | §4에서 인용 |
| EmptyState 컴포넌트 (No data / No result / Error) | `src/components/ui/EmptyState.tsx`, 규칙 `ds-components.md` | 인라인 빈/에러에 재사용. 신규 컴포넌트 금지 |
| Skeleton 로딩 | `ds-web.md` "로딩 상태" | 로딩 표준 → §6에서 참조 |

---

## 2. 전면(페이지) 에러

각 화면 공통 구조: GNB(COMMON) + 아이콘/일러스트 슬롯 + Title + Body + CTA row. 에러 코드 숫자는 **UI에 노출하지 않는다** (문서 매핑표 §5 · Figma Description에만 기록).

### 2.1 코드별 카피 (WF EN)

| Code | Trigger | Title | Body | CTA (좌 → 우) |
| --- | --- | --- | --- | --- |
| 404 | 없는 경로 · 삭제된 리소스 | `Page not found` | `This page doesn't exist or has moved.` | `Go back` (neutral) / `Go to Home` (primary) |
| 500 | 서버 미처리 오류 | `Something went wrong` | `A temporary error occurred. Try again in a moment.` | `Go to Home` (neutral) / `Try again` (primary, reset) |
| 503 | 점검 · 과부하 | `Under maintenance` | `The service is temporarily unavailable. Check back soon.` | `Try again` (primary — risk §8.2 참조) |
| 401 | 세션 만료 · 로그인 필요 | `Session expired` | `Your session has ended. Sign in to continue.` | `Sign in` (primary, return URL 유지) |

> **401 변형**: 미인증 상태로 보호된 페이지 직접 접근 시 Title `Sign in required` / Body `Sign in to access this page.` 사용. (페이지 vs 즉시 리다이렉트 분기는 §8.1)

### 2.2 상태 정의 (Figma Description용)

- 500 / 503: `Try again` 클릭 시 → 재요청. 성공 시 원래 화면 복귀, 재실패 시 동일 에러 유지.
- 401 `Sign in` 클릭 시 → 로그인 화면 이동(진입 전 URL 보존) → 로그인 성공 시 원래 화면 복귀.
- 404: 데이터 없음이 정상 결과 → 재시도 없음, 네비게이션(Home/Back)만.

---

## 3. 인라인(부분) 상태

전면 페이지가 아니라 특정 섹션/리스트/필드 범위에서만 발생. `EmptyState` 컴포넌트 재사용.

### 3.1 리스트 로딩 실패 (재시도)

`EmptyState`의 **Error 케이스**를 리스트/섹션 영역 내부에 표시.

| Element | WF (EN) |
| --- | --- |
| Title | `Couldn't load this list` |
| Body | `A temporary error occurred.` |
| CTA | `Try again` |

- `Try again` 클릭 시: **해당 섹션 쿼리만 재실행** (전면 reset 아님).
- 상태: Loading(Skeleton) → 성공(리스트 렌더) / 실패(이 Error 상태 유지).

### 3.2 부분 실패 / 인라인 에러

- **섹션 부분 실패**: 일부만 렌더된 섹션 내 배너 — `Some items couldn't load.` + `Try again`.
- **필드 인라인 에러**: `Input state="error" + errorMessage` 재사용. 색상 단독 표기 금지(`ds-components.md`). 문구는 필드별 정의(예: `Enter a valid email.`).

---

## 4. 토스트 (Toast)

토스트는 사용자 액션의 **즉시·비차단 결과 피드백**이다. 화면/섹션을 막지 않고 잠시 떴다 사라진다.

### 4.1 언제 쓰나

- 쓴다: 저장 / 삭제 / 복사 / 적용 등 액션 성공·실패 즉시 피드백
- 안 쓴다:
  - 화면/섹션 전체가 사용 불가한 실패 → 전면(§2) 또는 인라인(§3)
  - 입력값 검증 실패 → 필드 인라인 에러(§3.2)
  - 사용자가 반드시 인지·조치해야 하는 차단성 오류 → 토스트 금지(놓칠 수 있음)

### 4.2 타입별 기본 문구 (WF EN)

| Type | 기본값 | 구체 문구 예시 |
| --- | --- | --- |
| Success | `Changes have been saved.` | `Link copied.` · `Coupon applied.` |
| Error | `Something went wrong. Please try again.` | `This coupon has already been used.` |
| Info | (고정 기본값 없음 — 상황별 작성) | `Your session will end soon.` |

- 기본값 출처: `figma-description.md` §4.6. **구체 문구가 정의된 케이스는 그 문구를 쓰고**, 그 외 일반 성공/실패에만 기본값 적용.

### 4.3 작성 규칙

- 결과만 짧게 (KO 서비스: 15자 내외, `ux-writing.md` §6).
- 감정 과잉 금지 (`Sorry` / `Thank you` / `성공적으로`).
- 에러 토스트도 에러 코드·기술 용어 노출 금지.
- 되돌리기 가능한 액션은 Undo 액션 포함 가능 (예: `Deleted. Undo`). *(디자인 확인 필요 — Undo 지원 여부)*

---

## 5. HTTP 코드 ↔ 문구 매핑

API는 현재 머신 코드만 반환한다. 이 표가 코드 → 표시 패턴 → copy key의 기준이다.

| HTTP | 표시 패턴 | Copy key | 비고 |
| --- | --- | --- | --- |
| 400 | 인라인/토스트 | 필드별 문구 또는 기본 토스트 | 입력값 오류 — 필드 인라인 우선 |
| 401 | 전면 페이지 | `error.401.session` / `error.401.signin` | §8.1 분기 |
| 403 | (v1 스코프 밖) | — | 후속 |
| 404 | 전면 페이지 | `error.404` | |
| 500 | 전면 페이지 | `error.500` | |
| 502 / 504 | 전면 페이지 | `error.500` 재사용 | 게이트웨이 오류 → 500과 동일 문구 |
| 503 | 전면 페이지 | `error.503` | §8.2 정적 여부 확인 |
| 리스트/섹션 조회 실패 | 인라인 | `error.inline.list` | §3.1 |
| 섹션 부분 실패 | 인라인 배너 | `error.inline.partial` | §3.2 |
| 일반 액션 실패 | 토스트 | `toast.error.default` (§4.2) | 기본값 재사용 |
| 일반 액션 성공 | 토스트 | `toast.success.default` (§4.2) | 기본값 재사용 |

> 매핑 유지 주체는 §8.4 확인 필요.

---

## 6. 로딩 컨벤션

콘텐츠 로딩(페이지 · 컴포넌트)은 **전 범위 Skeleton으로 통일한다. 로딩 휠(스피너)은 쓰지 않는다.** 상세 규칙은 `ds-web.md` "로딩 상태".

- 페이지 로딩 → `loading.tsx` Skeleton (Next.js Suspense)
- 컴포넌트/섹션 로딩 → Skeleton (형태 유지)
- 액션 처리 중 → Button `loading` prop (버튼 내부 인라인 인디케이터만 허용)
- **로딩 휠 / 전체화면 스피너 단독 사용 금지**
- Figma Description에 Loading 상태 기술 시 **"Skeleton"으로 쓴다** (로딩 휠 금지)
- 로딩에는 별도 문구를 두지 않음(Skeleton). 텍스트가 꼭 필요하면 서비스 KO `불러오는 중이에요`.

---

## 7. 카피 규칙 체크리스트

작성/리뷰 시 전 문구가 아래를 통과해야 한다.

### EN (localization §3)
- [ ] `Kindly` / `Simply` / `Just` / `With ease` 없음
- [ ] `You will be able to` / `Proceed to` 없음
- [ ] 미래시제 남발 없음
- [ ] `Please` 과다 없음 (전면 body는 `Please` 0회, 기본 토스트의 1회만 예외)
- [ ] `Sorry` / `Thank you` 등 감정 과잉 없음
- [ ] 에러 코드 숫자 UI 노출 없음 (문서·Description에만)
- [ ] CTA 동사 시작 · 단독 의미 성립 (`Go to Home` / `Try again` / `Sign in` / `Go back`). `OK` / `Submit` / `Confirm` 금지

### KO (후속, ux-writing §15)
- [ ] 해요체 (`~합니다` / `~됩니다` 금지)
- [ ] 에러 코드·기술 용어 노출 없음
- [ ] `[무슨 상황] + [어떻게 하면 되는지]` 구조
- [ ] 토스트는 결과만 15자 내외

---

## 8. Open questions · risks

작성/구현 중 아래는 `*(정책 확인 필요)*`로 플래그한다. 블로커 아님.

1. **401 페이지 vs 리다이렉트** — 권장: 사용 중 세션 만료 → return URL 유지한 interstitial 페이지(`Sign in`) / 미인증 직접 접근 → 즉시 로그인 리다이렉트(페이지 미표시). *(정책 확인 필요)*
2. **503 정적 vs 앱 페이지** — CDN/edge 정적 HTML로 서빙되면 앱 컴포넌트·실제 `Try again` 재시도 불가 → 재시도 CTA 제거 or 단순 reload 링크. *(개발 확인 필요)*
3. **`global-error.tsx` 제약** — App Router `global-error.tsx`는 자체 `<html><body>` 렌더, 공유 layout/provider 사용 불가 → 500 화면의 GNB 노출 방식에 영향. *(개발 확인 필요)*
4. **매핑 유지 주체** — API 머신코드 ↔ 문구 동기화를 프론트 에러 바운더리 / API 계약 중 누가 소유하는지. *(개발 확인 필요)*
5. **일러스트 vs 아이콘** — 전면 에러 일러스트 에셋 존재 여부. EmptyState는 현재 아이콘 슬롯 → 전면도 아이콘으로 v1 진행할지. *(디자인 확인 필요)*
6. **토스트 Undo 지원** — 되돌리기 가능한 액션에 Undo 액션 토스트를 제공할지. *(디자인 확인 필요)*

---

## 관련 문서

- `mypage.md` §6-2-1 · §6-5 — 구독 상태 배너 (Suspended / 결제 실패 / 3ds)
- `figma-description.md` §4.6 — 기본 토스트 고정값
- `ux-writing.md` §5 · §6 · §7 · §14 — 서비스 KO 에러/빈 상태/토스트 문구 (후속)
- `localization.md` §3 — 언어별 금지 표현
- `ds-components.md` — EmptyState 3케이스 / Input error
- `ds-web.md` "로딩 상태" — Skeleton 규칙
- Figma: `PeCid7uJcg0HenViaaiHUp` page "Error" (`6337:1959`)
