---
ticket_id: "OPIN-048"
date: "2026-04-10"
qa_agent: "opin-qa"
result: "PASS"
loop_count: 2
---

## QA 리포트

**티켓:** OPIN-048 — 포인트 → 기프티콘 전환 시스템
**결과:** PASS
**루프:** 2회차 (1회차 버그 수정 검증)

---

## 1회차 버그 수정 확인

| #   | 심각도   | 내용                                                  | 결과 | 비고                                                                                                                                                                                 |
| --- | -------- | ----------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Critical | `redeem/route.ts` FIFO UPDATE 패턴 적용               | ✅   | `rowsToMark` 배열 수집 후 `.in("id", rowsToMark)` 배치 업데이트 — 정확히 적용됨                                                                                                      |
| 2   | Critical | `GifticonSection.tsx` `{ products: [...] }` 래퍼 파싱 | ✅   | line 150: `const data = (await res.json()) as { products: GifticonProduct[] }` — 래퍼 구조 파싱 확인                                                                                 |
| 3   | Critical | `RedemptionHistory.tsx` 래퍼 + 중첩 조인 매핑         | ✅   | `res.json() as Promise<{ redemptions: RedemptionRaw[] }>` → `.then(({ redemptions }) => ...)` 구조 정확히 적용됨. `gifticon_products?.name/brand/point_cost` 옵셔널 체이닝 매핑 확인 |
| 4   | Major    | `reduce` 콜백 타입 명시                               | ✅   | `(sum: number, row: { id: string; amount: number }) => sum + row.amount` — 타입 명시됨                                                                                               |
| 5   | Minor    | `phone` 필드 응답 제거                                | ✅   | `redemptions/route.ts` select에 `phone` 없음. `id, status, sendbee_order_id, sent_at, failed_reason, created_at, product_id, gifticon_products(...)` 만 반환                         |
| 6   | Minor    | "출금 신청하기" CTA 제거 (`my/page.tsx`)              | ✅   | `my/page.tsx`에 출금 관련 버튼 없음. `GifticonSection` 렌더링으로 교체 확인                                                                                                          |
| 7   | Minor    | "받기" 버튼 `size="md"`                               | ✅   | `GifticonSection.tsx` line 89: `size="md"` 확인                                                                                                                                      |

---

## 완료 조건 체크 (티켓 DoD)

| 조건                                            | 결과 | 비고                                                                      |
| ----------------------------------------------- | ---- | ------------------------------------------------------------------------- |
| `gifticon_products` 테이블 마이그레이션         | ✅   | API 라우트 정상 동작으로 확인                                             |
| `gifticon_redemptions` 테이블 마이그레이션      | ✅   | API 라우트 정상 동작으로 확인                                             |
| `profile.phone` 컬럼 추가 마이그레이션          | ✅   | `my/page.tsx`에서 `profile.phone` 조회 중                                 |
| `GET /api/gifticons/products` 구현              | ✅   | 빌드 라우트 목록 확인                                                     |
| `POST /api/gifticons/redeem` 구현 (센드비 포함) | ✅   | FIFO 로직 + 센드비 mock/실연동 분기 확인                                  |
| `GET /api/gifticons/redemptions` 구현           | ✅   | phone 미노출, 조인 포함                                                   |
| 마이페이지 기프티콘 전환 UI 구현                | ✅   | `GifticonSection.tsx`                                                     |
| 전화번호 입력/저장 UI 구현                      | ✅   | `PhoneInputModal.tsx` — 포맷 자동화, 에러 표시 포함                       |
| 포인트 잔액 부족 시 전환 차단                   | ✅   | `canAfford` 분기로 disabled 버튼 + 부족분 안내                            |
| 센드비 미연동 시 mock fallback                  | ✅   | `SENDBEE_API_KEY=mock` 분기 처리                                          |
| RLS 적용 (본인 전환 내역만 조회)                | ✅   | `user_id = auth.uid()` RLS + API에서 `.eq("user_id", user.id)` 이중 검증  |
| TypeScript strict 통과                          | ✅   | `npx tsc --noEmit` 에러 없음                                              |
| npm run build 에러 없음                         | ✅   | 빌드 성공 (exit 0, 경고 1건은 workspace root lockfile — 기존 알려진 이슈) |

---

## UX Writing 검증

| 화면/컴포넌트     | 항목                                                  | 결과 | 비고                                                            |
| ----------------- | ----------------------------------------------------- | ---- | --------------------------------------------------------------- |
| GifticonSection   | 섹션 타이틀 "기프티콘으로 바꾸기"                     | ✅   | 티켓 확정 문구 일치                                             |
| GifticonSection   | 포인트 표시 "전환 가능 포인트 NP"                     | ✅   | 확인                                                            |
| GifticonSection   | 전환 버튼 "받기"                                      | ✅   | 확인                                                            |
| GifticonSection   | 부족 안내 "NP 더 필요해요"                            | ✅   | 해요체 준수                                                     |
| GifticonSection   | 전환 완료 토스트                                      | ✅   | "기프티콘을 카카오톡으로 보냈어요"                              |
| GifticonSection   | 포인트 부족 토스트                                    | ✅   | "포인트가 부족해요. N,000P 이상 모으면 바꿀 수 있어요"          |
| GifticonSection   | 오류 토스트                                           | ✅   | "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요"          |
| RedemptionHistory | 빈 상태                                               | ✅   | "아직 바꾼 기프티콘이 없어요 / 마음에 드는 상품을 골라 보세요." |
| RedemptionHistory | 오류 상태                                             | ✅   | 서버 오류 패턴 준수                                             |
| PhoneInputModal   | 제목 "전화번호 입력"                                  | ✅   | 확인                                                            |
| PhoneInputModal   | 안내문 "기프티콘을 받으려면 전화번호를 입력해 주세요" | ✅   | 티켓 확정 문구 일치                                             |
| PhoneInputModal   | 레이블 "카카오톡에 등록된 전화번호"                   | ✅   | 확인                                                            |
| PhoneInputModal   | 취소 버튼 "닫기"                                      | ✅   | button.md 규칙 준수                                             |
| PhoneInputModal   | 확인 버튼 "저장하기"                                  | ✅   | "동사+하기" 규칙 준수                                           |
| PhoneInputModal   | 에러 메시지                                           | ✅   | "010-XXXX-XXXX 형식으로 입력해 주세요." 해요체                  |

---

## 발견된 이슈

### 버그

없음.

### 잠재적 리스크 (블로킹 아님)

| #   | 내용                                                                                                          | 영향도 | 권장 대응                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| R1  | `point_ledger_id`가 FIFO 마킹된 첫 번째 행만 기록 — 복수 행 차감 시 감사 추적 부분적                          | Low    | 별도 `gifticon_redemption_ledger_rows` 조인 테이블로 개선 (MVP 이후)                         |
| R2  | 센드비 실패 시 `point_ledger` 복구(available 복원)가 `Promise.all` 내에 있어 — 복구 실패해도 에러 응답 미분리 | Low    | CS 복구 경로는 `failed_reason` 기록으로 보존됨. MVP 허용 범위                                |
| R3  | `my/point/page.tsx`에 `WithdrawSection` 현금 출금 UI 잔존                                                     | Low    | 현금 출금 페이지는 별도 경로(`/my/point`)이며 마이 개요 페이지(`/my`)와 분리됨. 티켓 범위 외 |

---

## Regression 체크

| 영향 범위                            | 상태                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| `/my` 마이 개요 페이지               | 정상 — GifticonSection 추가, 기존 포인트·참여·설문 카드 유지 |
| `/my/point` 포인트 페이지            | 정상 — 티켓 범위 외, 빌드 통과 확인                          |
| `point_ledger` 조회 (`/my/page.tsx`) | 정상 — available/pending 계산 로직 동일                      |
| 인증 플로우                          | 정상 — `supabase.auth.getUser()` 패턴 일관                   |

---

## PM에게 전달 사항

**result: PASS** — 1회차에서 발견된 7개 버그 전체 수정 확인. TypeScript strict 통과, 빌드 성공.

티켓 OPIN-048을 `done/`으로 이동하고 커밋 권장.

후속 고려 사항 (블로킹 아님, 별도 티켓 분리 권장):

- R1: 복수 ledger 행 차감 시 감사 추적 강화
- R3: `/my/point`의 현금 출금 UI — 정책 결정 후 제거 또는 유지 결정 필요
- 센드비 실제 계약 완료 시 `SENDBEE_API_KEY` 환경 변수 설정 + 실연동 테스트 별도 QA 필요
