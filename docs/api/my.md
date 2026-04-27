# My API

<!-- version: 1.1.0 | 최초 작성: 2026-04-07 | 최종 수정: 2026-04-08 -->

---

## GET /api/my/dashboard

> 로그인 사용자의 포인트 현황, 폴 참여 현황, 설문 상태 카운트, 최근 활동을 한 번에 반환합니다. 5개 쿼리를 병렬 실행합니다.

**인증:** 필요

**Response 200:**

```json
{
  "points": {
    "total": 500,
    "pending": 200,
    "available": 300,
    "todayEarned": 100
  },
  "poll": {
    "todayCount": 2,
    "dailyLimit": 5
  },
  "surveys": {
    "draft": 1,
    "published": 2,
    "closed": 0
  },
  "recentActivity": [
    {
      "contentType": "poll",
      "id": "01234567-0000-0000-0000-000000000001",
      "title": "가장 좋아하는 프레임워크는?",
      "createdAt": "2026-04-07T00:00:00.000Z"
    },
    {
      "contentType": "survey",
      "id": "01234567-0000-0000-0000-000000000002",
      "title": "고객 만족도 조사",
      "createdAt": "2026-04-06T00:00:00.000Z"
    }
  ]
}
```

| 필드               | 설명                                                    |
| ------------------ | ------------------------------------------------------- |
| points.total       | 전체 누적 포인트 (pending + available + withdrawn 합산) |
| points.pending     | 검토 대기 중 포인트                                     |
| points.available   | 출금 가능 포인트                                        |
| points.todayEarned | 오늘 적립 포인트 (자정 기준)                            |
| poll.todayCount    | 오늘 참여한 폴 수                                       |
| poll.dailyLimit    | 일일 최대 참여 한도 (5)                                 |
| surveys            | 본인이 만든 설문 상태별 카운트                          |
| recentActivity     | 최근 활동 최대 10건 (폴 참여 + 설문 생성 합산, 최신순)  |

**에러:**

| Status | error        | 설명         |
| ------ | ------------ | ------------ |
| 401    | Unauthorized | 미인증       |
| 500    | —            | DB 조회 실패 |

---

## GET /api/my/withdraw

> 출금 가능 여부와 최근 출금 내역을 반환합니다. 출금 신청 전 가능 여부 확인에 사용합니다.

**인증:** 필요

**Response 200:**

```json
{
  "available_points": 15000,
  "pending_points": 200,
  "min_threshold": 10000,
  "can_withdraw": true,
  "recent_withdrawals": [
    {
      "id": "01234567-0000-0000-0000-000000000010",
      "amount": 10000,
      "status": "completed",
      "created_at": "2026-04-01T00:00:00.000Z"
    }
  ]
}
```

| 필드               | 설명                              |
| ------------------ | --------------------------------- |
| available_points   | 현재 출금 가능 포인트             |
| pending_points     | 검토 대기 중 포인트 (출금 불가)   |
| min_threshold      | 최소 출금 금액 (10,000P)          |
| can_withdraw       | available_points >= min_threshold |
| recent_withdrawals | 최근 10건, 최신순                 |

**withdrawal status 값:** `requested` \| `processing` \| `completed` \| `failed` \| `canceled`

**에러:**

| Status | error           | 설명         |
| ------ | --------------- | ------------ |
| 401    | unauthenticated | 미인증       |
| 500    | internal_error  | DB 조회 실패 |

---

## POST /api/my/withdraw

> 출금을 신청합니다. 동시에 진행 중인 신청이 있거나 잔액이 부족하면 차단됩니다. 성공 시 FIFO 방식으로 가장 오래된 포인트부터 차감됩니다.

**인증:** 필요

**Request Body:**

```json
{
  "amount": 10000,
  "payout_info": {
    "bank_name": "은행명",
    "account_number": "계좌번호",
    "account_holder": "예금주명"
  }
}
```

| 필드                       | 타입   | 필수 | 제약              |
| -------------------------- | ------ | ---- | ----------------- |
| amount                     | number | ✅   | 정수, 최소 10,000 |
| payout_info.bank_name      | string | ✅   | 공백 불가         |
| payout_info.account_number | string | ✅   | 공백 불가         |
| payout_info.account_holder | string | ✅   | 공백 불가         |

**Response 201:**

```json
{
  "withdrawal_id": "01234567-0000-0000-0000-000000000010",
  "amount": 10000,
  "status": "requested"
}
```

**에러:**

| Status | error                  | 설명                                                   |
| ------ | ---------------------- | ------------------------------------------------------ |
| 400    | invalid_amount         | amount < 10,000, 정수 아님, 또는 payout_info 필드 누락 |
| 400    | insufficient_points    | available_points < amount                              |
| 401    | unauthenticated        | 미인증                                                 |
| 409    | WITHDRAWAL_IN_PROGRESS | 이미 진행 중인 출금 신청 있음                          |
| 500    | internal_error         | DB 오류                                                |

**정책 연동:**

- 최소 출금: 10,000P
- 동시 출금 신청 1건 제한 (`requested` 또는 `processing` 상태 존재 시 차단)
- 포인트 차감: FIFO (가장 오래된 available 행부터 전체 행 단위로 `withdrawn` 처리)

---

## GET /api/my/profile

> 로그인 사용자의 프로필 정보를 반환합니다.

**인증:** 필요

**Response 200:**

```json
{
  "id": "01234567-0000-0000-0000-000000000001",
  "email": "user@example.com",
  "nick_name": "닉네임",
  "signup_type": "email",
  "status": "active",
  "created_at": "2026-04-07T00:00:00.000Z"
}
```

**에러:**

| Status | error           | 설명         |
| ------ | --------------- | ------------ |
| 401    | unauthenticated | 미인증       |
| 500    | internal_error  | DB 조회 실패 |

---

## PATCH /api/my/profile

> 닉네임을 수정합니다. nick_name 필드만 변경 가능합니다.

**인증:** 필요

**Request Body:**

```json
{
  "nick_name": "새닉네임"
}
```

| 필드      | 타입   | 필수 | 제약                              |
| --------- | ------ | ---- | --------------------------------- |
| nick_name | string | ✅   | 2자 이상 20자 이하 (trim 후 기준) |

**Response 200:** 수정된 프로필 (GET 응답과 동일 구조)

**에러:**

| Status | error                    | 설명                              |
| ------ | ------------------------ | --------------------------------- |
| 400    | nick_name_required       | nick_name 필드 누락 또는 비문자열 |
| 401    | unauthenticated          | 미인증                            |
| 422    | nick_name_invalid_length | 2자 미만 또는 20자 초과           |
| 500    | internal_error           | DB 오류                           |

---

## DELETE /api/my/account

> 계정을 탈퇴합니다. 소프트 삭제 (profile.status = 'deleted'). 출금 가능한 포인트가 있으면 차단됩니다.

**인증:** 필요

**Response 200:**

```json
{ "success": true }
```

**에러:**

| Status | error                | 설명                                           |
| ------ | -------------------- | ---------------------------------------------- |
| 401    | unauthenticated      | 미인증                                         |
| 409    | has_available_points | 출금 가능 포인트 잔액 있음 — 출금 후 탈퇴 필요 |
| 500    | internal_error       | DB 오류                                        |

**정책 연동:**

- 물리 삭제 없음 — `profile.status = 'deleted'` 상태 전환만 수행
- 탈퇴 후 auth 세션은 클라이언트가 직접 sign out 처리

---

## GET /api/my/points

> 포인트 이력 목록을 페이지네이션으로 반환합니다.

**인증:** 필요

**Query Parameters:**

| 파라미터 | 타입   | 기본값 | 설명                                                              |
| -------- | ------ | ------ | ----------------------------------------------------------------- |
| page     | number | 1      | 1-based 페이지 번호                                               |
| limit    | number | 20     | 페이지 크기 (최대 100)                                            |
| status   | string | -      | `earned` \| `pending` \| `available` \| `withdrawn` \| `reversed` |

**Response 200:**

```json
{
  "items": [
    {
      "id": "01234567-0000-0000-0000-000000000001",
      "source_type": "poll",
      "source_id": "01234567-0000-0000-0000-000000000002",
      "amount": 100,
      "status": "pending",
      "created_at": "2026-04-07T00:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "hasMore": true
}
```

**에러:**

| Status | error           | 설명                    |
| ------ | --------------- | ----------------------- |
| 400    | invalid_status  | 유효하지 않은 status 값 |
| 401    | unauthenticated | 미인증                  |
| 500    | internal_error  | DB 조회 실패            |

---

## GET /api/my/participated

> 내가 참여한 설문과 폴 이력을 페이지네이션으로 반환합니다.

**인증:** 필요

**Query Parameters:**

| 파라미터 | 타입   | 기본값 | 설명                                      |
| -------- | ------ | ------ | ----------------------------------------- |
| type     | string | -      | `survey` \| `poll` (생략 시 두 가지 모두) |
| page     | number | 1      | 1-based 페이지 번호                       |
| limit    | number | 20     | 페이지 크기 (최대 100)                    |

**Response 200:**

```json
{
  "items": [
    {
      "type": "poll",
      "participation_id": "01234567-0000-0000-0000-000000000001",
      "content_id": "01234567-0000-0000-0000-000000000002",
      "title": "가장 좋아하는 프레임워크는?",
      "status": "published",
      "selected_option": "React",
      "created_at": "2026-04-07T00:00:00.000Z"
    },
    {
      "type": "survey",
      "participation_id": "01234567-0000-0000-0000-000000000003",
      "content_id": "01234567-0000-0000-0000-000000000004",
      "title": "고객 만족도 조사",
      "status": "closed",
      "created_at": "2026-04-06T00:00:00.000Z"
    }
  ],
  "total": 15,
  "hasMore": false
}
```

- `selected_option`: poll 참여 항목만 포함 (survey 항목에는 없음)
- type 미지정 시 두 가지를 병합해 `created_at` 내림차순 정렬 후 페이지네이션

**에러:**

| Status | error           | 설명                          |
| ------ | --------------- | ----------------------------- |
| 400    | invalid_type    | type이 survey/poll 이 아닌 값 |
| 401    | unauthenticated | 미인증                        |
| 500    | internal_error  | DB 조회 실패                  |

---

## GET /api/my/settlements

> 출금 신청 이력 목록을 페이지네이션으로 반환합니다.

**인증:** 필요

**Query Parameters:**

| 파라미터 | 타입   | 기본값 | 설명                   |
| -------- | ------ | ------ | ---------------------- |
| page     | number | 1      | 1-based 페이지 번호    |
| limit    | number | 20     | 페이지 크기 (최대 100) |

**Response 200:**

```json
{
  "items": [
    {
      "id": "01234567-0000-0000-0000-000000000010",
      "amount": 10000,
      "status": "completed",
      "payout_info": {
        "bank_name": "은행명",
        "account_number": "계좌번호",
        "account_holder": "예금주명"
      },
      "created_at": "2026-04-01T00:00:00.000Z",
      "updated_at": "2026-04-02T00:00:00.000Z"
    }
  ],
  "total": 3,
  "page": 1,
  "hasMore": false
}
```

**withdrawal status 값:** `requested` \| `processing` \| `completed` \| `failed` \| `canceled`

**에러:**

| Status | error           | 설명         |
| ------ | --------------- | ------------ |
| 401    | unauthenticated | 미인증       |
| 500    | internal_error  | DB 조회 실패 |
