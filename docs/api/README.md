# OPINION API 문서

<!-- version: 1.1.0 | 최초 작성: 2026-04-07 | 최종 수정: 2026-04-08 -->

내부 개발용 API 레퍼런스. 모든 엔드포인트는 Next.js App Router 기반으로 `src/app/api/` 하위에 구현됩니다.

---

## Base URL

```
NEXT_PUBLIC_APP_URL/api
```

로컬: `http://localhost:3000/api`

---

## 인증

Supabase session cookie(`sb-*`) 기반. 로그인 후 자동으로 쿠키가 설정되며, 서버 컴포넌트/API route에서 `createClient()`로 세션 확인.

인증이 필요한 엔드포인트에 미인증 요청 시 `401` 반환.

---

## 공통 에러 포맷

```json
{ "error": "snake_case_reason" }
```

| Status | 의미                                      |
| ------ | ----------------------------------------- |
| 400    | 잘못된 요청 (파싱 불가, 유효하지 않은 값) |
| 401    | 미인증                                    |
| 403    | 권한 없음 (인증됐으나 접근 불가)          |
| 404    | 리소스 없음                               |
| 409    | 중복 (이미 존재)                          |
| 422    | 유효성 검사 실패                          |
| 429    | 한도 초과                                 |
| 500    | 서버 오류                                 |

---

## 도메인별 문서

| 파일                           | 경로                                 | 내용                                    |
| ------------------------------ | ------------------------------------ | --------------------------------------- |
| [polls.md](./polls.md)         | `/api/polls/**`                      | 폴 목록, 생성, 투표, 결과, 상태 전환    |
| [surveys.md](./surveys.md)     | `/api/surveys/**`                    | 설문 CRUD, 라이프사이클, 응답 제출      |
| [my.md](./my.md)               | `/api/my/**`                         | 대시보드, 출금, 프로필, 포인트 이력     |
| [billing.md](./billing.md)     | `/api/billing/**`, `/api/credits/**` | 구독, 결제, AI 크레딧                   |
| [share.md](./share.md)         | `/api/share/**`                      | 공유 링크 기반 설문 조회 및 응답        |
| [gifticons.md](./gifticons.md) | `/api/gifticons/**`                  | 포인트 → 기프티콘 전환, 상품 목록, 내역 |
| [analyze.md](./analyze.md)     | `/api/analyze`                       | AI 설문 초안 생성 (URL 분석 / 프롬프트) |

---

## 보안 주의사항

- `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — 서버 전용, 코드/문서에 값 기재 금지
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — 공개 설계 키이나 문서 예시에 실제 값 기재 금지 (`YOUR_SUPABASE_ANON_KEY` placeholder 사용)
- `payout_info` 예시 — 실제 계좌번호 형식 사용 금지
- 예시 ID — 실제 프로덕션 ID 사용 금지, dummy UUID 사용 (`01234567-0000-0000-0000-000000000001`)
