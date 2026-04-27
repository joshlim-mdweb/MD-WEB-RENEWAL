# Backend Features PRD — 미구현 API 전체 목록

<!-- 작성일: 2026-04-07 | 기준: UX Flow 완결 + 정책 파일 갭 분석 -->

---

## 1. 분석 방법

현재 구현된 API (`src/app/api/`)와 DB 스키마 (`supabase/migrations/`)를 전수 확인 후, 정책 파일 (`docs/policy/`) 기준 UX Flow를 완결하기 위해 누락된 기능을 도출했다.

---

## 2. 현재 구현 완료 목록 (기준선)

| 도메인  | 엔드포인트                                     | 상태             |
| ------- | ---------------------------------------------- | ---------------- |
| Survey  | GET/POST /api/surveys                          | 완료             |
| Survey  | GET/PATCH/DELETE /api/surveys/[id]             | 완료             |
| Survey  | POST /api/surveys/[id]/publish                 | 완료             |
| Survey  | POST /api/surveys/[id]/close                   | 완료             |
| Survey  | POST /api/surveys/[id]/reopen                  | 완료             |
| Survey  | GET/POST /api/surveys/[id]/questions           | 완료             |
| Survey  | PATCH/DELETE /api/surveys/[id]/questions/[qid] | 완료             |
| Survey  | POST /api/surveys/[id]/questions/reorder       | 완료             |
| Survey  | GET/POST /api/surveys/[id]/sections            | 완료             |
| Survey  | PATCH/DELETE /api/surveys/[id]/sections/[sid]  | 완료             |
| Survey  | POST /api/surveys/[id]/sections/reorder        | 완료             |
| Survey  | GET/POST /api/surveys/[id]/respond             | 완료             |
| Survey  | GET /api/surveys/[id]/report                   | 완료 (기본 집계) |
| Poll    | GET/POST /api/polls                            | 완료             |
| Poll    | GET /api/polls/[id]                            | 완료             |
| Poll    | POST /api/polls/[id]/vote                      | 완료             |
| Poll    | GET /api/polls/[id]/results                    | 완료             |
| My Page | GET /api/my/dashboard                          | 완료             |
| My Page | GET/POST /api/my/withdraw                      | 완료             |
| Events  | POST /api/events                               | 완료             |
| Billing | POST /api/billing/checkout                     | 완료             |
| Billing | GET /api/billing/subscription                  | 완료             |
| Billing | POST /api/billing/webhook                      | 완료             |
| Billing | POST /api/billing/portal                       | 완료             |
| Credits | GET /api/credits/balance                       | 완료             |
| Credits | POST /api/credits/use                          | 완료             |
| Credits | POST /api/credits/purchase                     | 완료             |

---

## 3. 미구현 API 목록

### P1 — 서비스 핵심 플로우 차단 (즉시 구현 필요)

---

#### 3.1 Survey Share 링크 관리

현재 `survey_shares` 테이블은 DB에 존재하지만 관리 API가 전혀 없다. 응답 제출(`/api/surveys/[id]/respond`)이 shareToken을 받는 로직은 구현됐으나, 토큰을 생성하거나 조회하는 API가 없어 실제 공유 링크 발급이 불가능하다.

**필요한 엔드포인트:**

| Method | Path                               | 설명                                                     |
| ------ | ---------------------------------- | -------------------------------------------------------- |
| GET    | /api/surveys/[id]/shares           | 설문에 연결된 공유 링크 목록 조회                        |
| POST   | /api/surveys/[id]/shares           | 공유 링크 생성 (토큰 발급)                               |
| DELETE | /api/surveys/[id]/shares/[shareId] | 공유 링크 비활성화 (soft delete 또는 expires_at = now()) |

**Request body (POST):**

```json
{
  "expires_at": "2026-05-01T00:00:00Z", // null = 만료 없음
  "max_responses": 50 // null = 무제한
}
```

**Response (POST):**

```json
{
  "id": "uuid",
  "token": "abc12xYZ9k4f",
  "share_url": "https://opinionapp.com/survey/[id]?token=abc12xYZ9k4f",
  "expires_at": null,
  "max_responses": null,
  "response_count": 0,
  "created_at": "2026-04-07T..."
}
```

**정책 근거:** `docs/policy/survey.md` §5.11 — 공유 링크를 통한 외부 응답자 유입 경로. `supabase/migrations/20260313000001_schema_hardening.sql` — `survey_shares` 테이블 및 token 인덱스 구현됨.

**운영 포인트:** 토큰 생성은 `nanoid` 또는 `crypto.randomUUID()` 기반 12자 슬러그. creator_id 검증 필수 (타인의 설문에 공유 링크 생성 불가).

**이벤트 로깅:** `share_link_created`, `share_link_deleted` with survey_id, token.

---

#### 3.2 포인트 pending → available 자동 전환 (스케줄 배치)

현재 모든 Poll/Survey 보상이 `pending` 상태로 삽입되지만, `available`로 전환하는 메커니즘이 없다. T+1 00:00 KST 전환 규칙은 정책에 확정됐으나 실행 로직이 미구현이다.

**필요한 구현:**

| 방식                  | Path                              | 설명                                     |
| --------------------- | --------------------------------- | ---------------------------------------- |
| API (Cron Trigger)    | POST /api/internal/points/release | T+1 00:00 KST에 호출되는 내부 엔드포인트 |
| 또는 Supabase pg_cron | DB 레벨 스케줄                    | pg_cron 확장으로 DB 내부 실행            |

**권장 방식:** Vercel Cron Job → `POST /api/internal/points/release` (매일 00:01 KST)

**처리 로직:**

1. `point_ledger`에서 `status = 'pending'` AND `created_at <= 어제 23:59:59 KST` 행 일괄 조회
2. `status = 'available'`로 업데이트
3. `processed_at` 컬럼 갱신 (이미 `20260403000001_add_point_ledger_processed_at.sql`로 추가됨)
4. 전환된 행 수 로깅

**예외 처리:**

- `reversed` 상태 행은 스킵
- 대상 행이 0건이면 조기 종료
- 배치 크기 제한 (한 번에 최대 1,000행, 초과 시 다음 실행 처리)

**인증:** `CRON_SECRET` 환경변수 헤더 검증으로 외부 직접 호출 차단.

**정책 근거:** `docs/policy/poll.md` §6.11, `docs/policy/points.md` §9.5.

**Admin 처리 필요:** 배치 실패 시 수동 재실행 커맨드 필요. Supabase SQL Editor에서 실행 가능한 복구 쿼리를 `docs/ops/` 에 보관.

---

#### 3.3 Survey 보상 지급 로직 (정상 마감 처리)

현재 `POST /api/surveys/[id]/respond`에서 `reward_amount`를 단순히 `pending`으로 기록하지만, 정책 §9.11에 따른 **정상 마감 조건 확인 → 티어별 선정 → 지급 전환** 로직이 전혀 없다.

**현재 구현의 문제:**

- `respond` 라우트가 `reward_amount`를 즉시 개인에게 기록 — 이는 틀린 구현. 티어 1(선착순 전원)은 마감 시에 일괄 지급, 티어 2/3(랜덤)은 마감 후 추첨이다.
- `reward_amount`는 개인 지급액이 아닌 설문 총 보상액이다.

**필요한 엔드포인트:**

| Method | Path                                      | 설명                                    |
| ------ | ----------------------------------------- | --------------------------------------- |
| POST   | /api/surveys/[id]/close-with-reward       | 설문 마감 + 보상 지급 트리거            |
| POST   | /api/internal/surveys/[id]/settle-rewards | 보상 정산 실행 (정상 마감 확인 후 호출) |

**`/close-with-reward` 처리 흐름:**

1. creator 권한 확인
2. survey status → `closed`
3. `target_participant_count` 달성 여부 확인
4. 어뷰저 비율 확인 (`responses` 중 플래그된 비율 < 10%)
5. 정상 마감이면 `settle-rewards` 호출
6. 조기 종료이면 기존 `pending` → `reversed` 일괄 처리

**`/settle-rewards` 처리 흐름 (reward_type별):**

- `none`: 아무것도 하지 않음
- `first_come`: 참여자 전원 `point_ledger`에 `pending` 삽입 → T+1 자동 전환 배치에 맡김
- `random`: 어뷰저 제외 풀에서 `reward_winner_count`명 랜덤 선정 → 당첨자 `pending`, 미당첨자 기록 없음 (또는 `reversed`)

**DB 변경 필요:**

- `responses` 테이블에 `is_abuser boolean DEFAULT false` 컬럼 추가 (어뷰저 플래그)
- `point_ledger`의 `source_type`에 `'survey_reward'` 추가 (현재는 `'survey'`만 있음 — 확인 필요)

**정책 근거:** `docs/policy/points.md` §9.11.3 ~ §9.11.7.

**Admin 처리 필요:**

- 어뷰저 비율 10% 초과 시 Admin 알림 (정상 마감 불가 상태)
- 랜덤 선정 실패 시 Admin 수동 선정 권한

---

#### 3.4 My Page — 포인트 내역 상세 API

현재 `/api/my/dashboard`는 포인트 합계만 반환. 포인트 히스토리(획득/전환/출금) 페이지에 필요한 API가 없다.

**필요한 엔드포인트:**

| Method | Path           | 설명                            |
| ------ | -------------- | ------------------------------- |
| GET    | /api/my/points | 포인트 잔액 + 페이지네이션 내역 |

**Query params:** `?cursor=<created_at>&limit=20&status=all|pending|available|withdrawn|reversed`

**Response:**

```json
{
  "balance": {
    "total": 1200,
    "pending": 300,
    "available": 900
  },
  "items": [
    {
      "id": "uuid",
      "source_type": "poll",
      "amount": 100,
      "status": "available",
      "created_at": "2026-04-06T...",
      "processed_at": "2026-04-07T..."
    }
  ],
  "next_cursor": "2026-04-05T..."
}
```

**정책 근거:** `docs/policy/points.md` §9.9 — 포인트 히스토리 신뢰성 원칙.

**이벤트 로깅:** `point_history_viewed` with user_id, filter_status.

---

#### 3.5 My Page — 참여한 설문 목록 API

현재 `/api/my/dashboard`는 최근 활동 10개만 반환. 마이페이지 "참여한 설문" 탭 전체 목록 API가 없다.

**필요한 엔드포인트:**

| Method | Path                         | 설명                            |
| ------ | ---------------------------- | ------------------------------- |
| GET    | /api/my/participated-surveys | 참여한 설문 목록 (페이지네이션) |

**Query params:** `?cursor=<created_at>&limit=20`

**Response:**

```json
{
  "items": [
    {
      "response_id": "uuid",
      "survey_id": "uuid",
      "survey_title": "...",
      "survey_status": "published",
      "reward_amount": 1000,
      "reward_status": "pending",
      "responded_at": "2026-04-06T..."
    }
  ],
  "next_cursor": "..."
}
```

**조인 필요:** `responses` → `surveys` (title, status, reward_amount) + `point_ledger` (해당 response의 포인트 상태)

**정책 근거:** `docs/policy/mypage.md` §8.6.

---

### P2 — 기능 완결을 위해 필요 (1-2주 내)

---

#### 3.6 프로필 조회 및 수정 API

현재 profile 테이블에 RLS는 있으나 조회/수정 API가 없다.

**필요한 엔드포인트:**

| Method | Path            | 설명                                            |
| ------ | --------------- | ----------------------------------------------- |
| GET    | /api/my/profile | 프로필 조회 (nick_name, email, plan, status)    |
| PATCH  | /api/my/profile | 프로필 수정 (nick_name만 허용, email 변경 별도) |

**허용 수정 필드:** `nick_name` only (email은 Supabase Auth를 통해야 함)

**Validation:**

- `nick_name`: 2-20자, 특수문자 일부 허용, 중복 확인 필요

**정책 근거:** `docs/policy/mypage.md` §8.2 — Account 섹션.

**CS 문의 발생 가능:** "닉네임을 변경하고 싶어요" — API 없으면 CS 수동 처리 필요.

---

#### 3.7 계정 탈퇴 API

`profile.status = 'deleted'`로 전환하는 소프트 탈퇴 API. hard delete 아님.

**필요한 엔드포인트:**

| Method | Path               | 설명                        |
| ------ | ------------------ | --------------------------- |
| POST   | /api/my/deactivate | 계정 비활성화 (soft delete) |

**처리 규칙:**

1. `available` 포인트 > 0이면 탈퇴 차단 ("출금 후 탈퇴해 주세요")
2. `requested` 또는 `processing` 상태 출금이 있으면 차단
3. 조건 통과 시 `profile.status = 'deleted'`
4. Supabase Auth signOut 처리

**에러 메시지 예시:**

- "출금 가능한 포인트가 있어요. 출금 후 탈퇴해 주세요."
- "진행 중인 출금 신청이 있어요. 완료 후 탈퇴해 주세요."

**정책 근거:** `docs/policy/shared.md` §2.4 — 상태 변경 선호.

---

#### 3.8 AI 크레딧 사용 내역 API

현재 `/api/credits/balance`는 잔량만 반환. `ai_credit_transactions` 테이블이 존재하지만 내역 조회 API가 없다.

**필요한 엔드포인트:**

| Method | Path                      | 설명                |
| ------ | ------------------------- | ------------------- |
| GET    | /api/credits/transactions | AI 크레딧 사용 내역 |

**Response:**

```json
{
  "balance": 150,
  "items": [
    {
      "id": "uuid",
      "amount": -50,
      "type": "usage",
      "source": "survey_generation",
      "created_at": "..."
    }
  ],
  "next_cursor": "..."
}
```

**정책 근거:** `docs/policy/ai-tokens.md` — 토큰 노출 정책: "Users should always see recent usage history".

---

#### 3.9 Survey 응답자 목록 조회 API (Creator 전용)

창작자가 자신의 설문 응답자 수와 기본 정보를 확인할 수 있는 API. 현재 `GET /api/surveys/[id]/report`는 집계 데이터만 제공하며 응답 목록이 없다.

**필요한 엔드포인트:**

| Method | Path                        | 설명                                   |
| ------ | --------------------------- | -------------------------------------- |
| GET    | /api/surveys/[id]/responses | 응답 목록 (페이지네이션, creator 전용) |

**Response:**

```json
{
  "total": 47,
  "items": [
    {
      "response_id": "uuid",
      "responded_at": "2026-04-06T...",
      "is_abuser": false,
      "reward_status": "pending"
    }
  ],
  "next_cursor": "..."
}
```

**주의:** `user_id`, IP, UA는 응답에서 제외 (개인정보). Admin 전용 뷰에서만 노출 가능.

**정책 근거:** `docs/policy/report.md` §7.3 — creator-only access.

---

#### 3.10 Survey 발행 전 검증 API

현재 클라이언트가 publish 전 validation 상태를 알 수 있는 별도 엔드포인트가 없다. Builder에서 "공개하기" 버튼 활성/비활성 판단을 위해 서버 사이드 검증 결과를 사전에 조회할 수 있어야 한다.

**필요한 엔드포인트:**

| Method | Path                            | 설명                              |
| ------ | ------------------------------- | --------------------------------- |
| GET    | /api/surveys/[id]/publish-check | 발행 가능 여부 + 블로킹 사유 목록 |

**Response:**

```json
{
  "can_publish": false,
  "blocking_reasons": [
    { "code": "NO_QUESTIONS", "message": "질문을 1개 이상 추가해 주세요." },
    { "code": "EMPTY_TITLE", "message": "설문 제목을 입력해 주세요." }
  ]
}
```

**정책 근거:** `docs/policy/survey.md` §5.5 — Publish blocking conditions.

---

#### 3.11 Survey 일일 참여 제한 확인 API

정책 §5.6에 따라 응답자는 하루 무료 3회 참여, 이후 500P 소비 시 추가 참여 가능. 현재 이 제한을 확인하는 API가 없어 FE가 참여 가능 여부를 알 수 없다.

**필요한 엔드포인트:**

| Method | Path                               | 설명                     |
| ------ | ---------------------------------- | ------------------------ |
| GET    | /api/my/survey-participation-quota | 오늘 설문 참여 가능 여부 |

**Response:**

```json
{
  "free_used": 2,
  "free_limit": 3,
  "can_participate_free": true,
  "can_participate_paid": false,
  "available_points": 300,
  "paid_cost": 500
}
```

**정책 근거:** `docs/policy/survey.md` §5.6.

**주의:** 현재 `POST /api/surveys/[id]/respond`에 이 제한이 구현되지 않은 것도 갭이다. respond 라우트에도 동시에 추가 필요.

---

### P3 — 운영/완성도 (다음 스프린트)

---

#### 3.12 Poll 관리 API (Admin/Creator)

현재 Poll은 `GET /api/polls`로 목록 조회, `POST /api/polls`로 생성만 가능. Status 변경(publish/close/archive) API가 없다.

**필요한 엔드포인트:**

| Method | Path                    | 설명                                                  |
| ------ | ----------------------- | ----------------------------------------------------- |
| POST   | /api/polls/[id]/publish | Poll 발행                                             |
| POST   | /api/polls/[id]/close   | Poll 마감                                             |
| PATCH  | /api/polls/[id]         | Poll 수정 (draft 상태에서만, 또는 zero-response 상태) |
| DELETE | /api/polls/[id]         | Poll 삭제 (응답 없을 때만)                            |

**정책 근거:** `docs/policy/poll.md` §6.4, §6.8.

---

#### 3.13 My Page — 만든 설문 전체 목록 API

현재 `/api/my/dashboard`의 surveys는 status별 count만 반환. 실제 목록(제목, 응답 수, 상태) API가 없다.

**필요한 엔드포인트:**

| Method | Path            | 설명                               |
| ------ | --------------- | ---------------------------------- |
| GET    | /api/my/surveys | 내가 만든 설문 목록 (페이지네이션) |

**Query params:** `?status=draft|published|closed|archived&cursor=...&limit=20`

**Response:**

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "...",
      "status": "published",
      "response_count": 23,
      "target_participant_count": 50,
      "reward_type": "random",
      "reward_amount": 5000,
      "created_at": "..."
    }
  ],
  "next_cursor": "..."
}
```

---

#### 3.14 출금 상태 확인 API

현재 `GET /api/my/withdraw`가 최근 10건의 출금 내역을 반환하나, 특정 출금 건의 상세 상태를 확인하는 API가 없다.

**필요한 엔드포인트:**

| Method | Path                            | 설명                   |
| ------ | ------------------------------- | ---------------------- |
| GET    | /api/my/withdraw/[withdrawalId] | 특정 출금 건 상태 조회 |

**CS 문의 발생 가능:** "출금 신청했는데 언제 입금되나요?" — 출금 ID 기반 상태 조회가 없으면 CS가 DB 직접 조회해야 함.

---

#### 3.15 내부 Admin API (운영용)

MVP 운영에 최소한으로 필요한 Admin 기능. 이 목록은 Supabase Dashboard SQL Editor 쿼리로 대체 가능하나, 빈번하게 필요한 케이스는 API화 권장.

| 필요 기능                             | 우선순위 | 현재 대체 수단 |
| ------------------------------------- | -------- | -------------- |
| 특정 포인트 reversed 처리             | P2       | SQL Editor     |
| 출금 상태 processing → completed 전환 | P1       | SQL Editor     |
| 어뷰저 플래그 설정                    | P2       | SQL Editor     |
| 설문 강제 마감                        | P2       | SQL Editor     |

---

## 4. DB 갭 — 추가 마이그레이션 필요 항목

| 테이블         | 컬럼                 | 타입                              | 이유                                                                                 | 우선순위 |
| -------------- | -------------------- | --------------------------------- | ------------------------------------------------------------------------------------ | -------- |
| `responses`    | `is_abuser`          | `boolean DEFAULT false`           | 보상 정산 시 어뷰저 제외 로직에 필요 (§9.11.3)                                       | P1       |
| `point_ledger` | `survey_id`          | `uuid REFERENCES surveys(id)`     | 설문 참여 이력과 포인트를 연결하기 위해 (현재 `source_id`만 있어 `response.id` 참조) | P2       |
| `responses`    | `survey_daily_count` | 필요 없음 — 별도 집계 쿼리로 처리 | —                                                                                    | —        |
| `profile`      | `payout_info`        | `jsonb`                           | 출금 정보 사전 등록 기능 추가 시 필요 (현재 매번 출금 신청 시 입력)                  | P3       |
| `profile`      | `phone_verified`     | `boolean DEFAULT false`           | 출금 본인인증 추가 시 필요                                                           | P3       |

---

## 5. UX Flow별 BE 기능 매핑

### Flow 1: Survey 생성 → 발행

| UX 단계                    | 필요 API                              | 현재 상태       |
| -------------------------- | ------------------------------------- | --------------- |
| Step 1 Essential Info 저장 | POST /api/surveys                     | 완료            |
| Step 2 Builder 자동저장    | PATCH /api/surveys/[id]               | 완료            |
| Step 3 Compensation 설정   | PATCH /api/surveys/[id] (reward 필드) | 완료            |
| 발행 전 검증 확인          | GET /api/surveys/[id]/publish-check   | **미구현 (P2)** |
| 발행                       | POST /api/surveys/[id]/publish        | 완료            |

### Flow 2: Survey 응답 → 보상 수령

| UX 단계                  | 필요 API                                 | 현재 상태                  |
| ------------------------ | ---------------------------------------- | -------------------------- |
| 참여 가능 여부 확인      | GET /api/my/survey-participation-quota   | **미구현 (P2)**            |
| 공유 링크로 진입         | GET /api/surveys/[id] (shareToken 검증)  | 완료                       |
| 응답 제출                | POST /api/surveys/[id]/respond           | 완료 (보상 로직 수정 필요) |
| 보상 대기                | pending 상태 자동 기록                   | 완료                       |
| pending → available 전환 | POST /api/internal/points/release (배치) | **미구현 (P1)**            |
| 포인트 내역 확인         | GET /api/my/points                       | **미구현 (P1)**            |

### Flow 3: 설문 마감 → 보상 정산

| UX 단계                      | 필요 API                                       | 현재 상태             |
| ---------------------------- | ---------------------------------------------- | --------------------- |
| 설문 마감                    | POST /api/surveys/[id]/close                   | 완료 (보상 정산 없음) |
| 정상 마감 조건 확인          | 마감 API 내부 로직                             | **미구현 (P1)**       |
| 티어별 보상 정산             | POST /api/internal/surveys/[id]/settle-rewards | **미구현 (P1)**       |
| 조기 종료 pending → reversed | 마감 API 내부 로직                             | **미구현 (P1)**       |

### Flow 4: Poll 참여 → 포인트 적립

| UX 단계            | 필요 API                                 | 현재 상태       |
| ------------------ | ---------------------------------------- | --------------- |
| 투표               | POST /api/polls/[id]/vote                | 완료            |
| pending 기록       | 투표 API 내부                            | 완료            |
| T+1 available 전환 | POST /api/internal/points/release (배치) | **미구현 (P1)** |
| 포인트 내역 확인   | GET /api/my/points                       | **미구현 (P1)** |

### Flow 5: 포인트 출금

| UX 단계             | 필요 API                  | 현재 상태       |
| ------------------- | ------------------------- | --------------- |
| 출금 가능 여부 확인 | GET /api/my/withdraw      | 완료            |
| 출금 신청           | POST /api/my/withdraw     | 완료            |
| 출금 상태 확인      | GET /api/my/withdraw/[id] | **미구현 (P3)** |
| Admin 상태 전환     | (내부 Admin API)          | **미구현 (P3)** |

### Flow 6: 공유 링크 발송

| UX 단계               | 필요 API                                    | 현재 상태       |
| --------------------- | ------------------------------------------- | --------------- |
| 공유 링크 생성        | POST /api/surveys/[id]/shares               | **미구현 (P1)** |
| 공유 링크 목록 조회   | GET /api/surveys/[id]/shares                | **미구현 (P1)** |
| 공유 링크 비활성화    | DELETE /api/surveys/[id]/shares/[shareId]   | **미구현 (P1)** |
| 공유 링크로 설문 열기 | GET /api/surveys/[id] (token 포함)          | 완료            |
| 공유 링크로 응답 제출 | POST /api/surveys/[id]/respond (shareToken) | 완료            |

---

## 6. 현재 구현의 정책 갭 (수정 필요)

기존 API에 정책 위반 또는 불완전한 구현이 있는 항목.

### 6.1 respond API — 보상 로직 오류 (P1)

**위치:** `POST /api/surveys/[id]/respond` 라인 359

**현재 동작:** 응답 제출 즉시 `survey.reward_amount`를 `point_ledger`에 개인 기록.

**문제:** 정책 §9.11에 따르면:

- 티어 1 (first_come): 정상 마감 시 전원 일괄 지급
- 티어 2/3 (random): 마감 후 추첨으로 지급
- 현재 구현은 마감 전에 모든 참여자에게 보상을 기록해버림 (정합성 파괴)

**수정 방향:** respond API에서 point_ledger 즉시 삽입 제거. 보상은 `/close-with-reward` → `/settle-rewards` 플로우에서만 지급.

### 6.2 respond API — Survey 일일 참여 제한 미적용 (P2)

**현재 동작:** 인증된 사용자라면 횟수 제한 없이 응답 가능.

**문제:** 정책 §5.6 — 하루 3회 무료, 이후 500P 소비 시 추가 가능.

**수정 방향:** `POST /api/surveys/[id]/respond`에 일일 참여 횟수 확인 로직 추가.

### 6.3 withdraw API — 수수료 미적용 (P3)

**현재 동작:** 출금 금액 그대로 `withdrawals` 테이블에 삽입.

**문제:** `docs/policy/README.md` §9.7 및 Monetization 정책에 따르면 Free/Pro 8%, Max 6% 수수료 적용 필요.

**수정 방향:** 플랜 조회 → 수수료 계산 → 실제 지급액 = 신청액 - 수수료. 최소 수수료 500원 적용.

---

## 7. 이벤트 로깅 누락 항목

현재 `POST /api/events`는 구현됐으나 아래 핵심 이벤트의 클라이언트/서버 측 로깅이 누락됨.

| 이벤트                 | 로깅 주체                | 현재 상태                |
| ---------------------- | ------------------------ | ------------------------ |
| `survey_published`     | Server (publish API)     | 미구현                   |
| `survey_responded`     | Server (respond API)     | 미구현                   |
| `survey_closed`        | Server (close API)       | 미구현                   |
| `share_link_created`   | Server (shares API)      | 미구현 (API 자체 미구현) |
| `poll_voted`           | Server (vote API)        | 미구현                   |
| `points_released`      | Server (배치 API)        | 미구현 (API 자체 미구현) |
| `withdrawal_requested` | Server (withdraw API)    | 미구현                   |
| `ai_credit_used`       | Server (credits/use API) | 미구현                   |

---

## 8. CS 문의 발생 가능 지점 정리

| 문의 유형                               | 현재 대응 가능 여부   | 미구현 API         |
| --------------------------------------- | --------------------- | ------------------ |
| "포인트가 언제 들어오나요?"             | 불가 — 배치 없음      | 3.2 points/release |
| "설문 목표 달성했는데 포인트 안 왔어요" | 불가 — 정산 로직 없음 | 3.3 settle-rewards |
| "공유 링크를 만들고 싶어요"             | 불가 — API 없음       | 3.1 shares         |
| "닉네임 바꾸고 싶어요"                  | 불가 — API 없음       | 3.6 profile PATCH  |
| "출금 상태 확인하고 싶어요"             | 최근 10건만 가능      | 3.14 withdraw/[id] |
| "포인트 내역 상세히 보고 싶어요"        | 불가 — API 없음       | 3.4 points         |
| "탈퇴하고 싶어요"                       | 불가 — API 없음       | 3.7 deactivate     |

---

## 9. 구현 우선순위 요약

### P1 — 즉시 (서비스 불완전 상태)

1. **3.1** Survey Share 링크 생성/관리 API
2. **3.2** pending → available 배치 (Vercel Cron + `/api/internal/points/release`)
3. **3.3** Survey 보상 정산 로직 + close-with-reward API
4. **6.1** respond API 보상 로직 수정 (즉시 기록 → 마감 후 정산으로)
5. **3.4** `/api/my/points` 포인트 내역 API
6. **3.5** `/api/my/participated-surveys` 참여 설문 목록 API

### P2 — 단기 (기능 완결)

7. **3.6** 프로필 조회/수정 API
8. **3.7** 계정 탈퇴 API
9. **3.8** AI 크레딧 사용 내역 API
10. **3.9** 설문 응답자 목록 API
11. **3.10** 발행 전 검증 API
12. **3.11** Survey 일일 참여 제한 API + respond API 수정
13. **DB 갭** `responses.is_abuser` 컬럼 추가

### P3 — 중기 (운영 완성도)

14. **3.12** Poll 관리 API
15. **3.13** 내가 만든 설문 목록 API
16. **3.14** 출금 상태 개별 조회 API
17. **3.15** Admin 운영 API
18. **6.3** 출금 수수료 로직 적용
