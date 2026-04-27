# Polls API

<!-- version: 1.2.0 | 최초 작성: 2026-04-07 | 최종 수정: 2026-04-10 -->

---

## GET /api/polls

> 공개된 폴 목록을 커서 기반 페이지네이션으로 반환합니다. 인증 여부에 따라 오늘 투표 현황과 내 투표 여부가 함께 내려옵니다.

**인증:** 불필요 (인증 시 `userVotedOption`, `todayVoteCount` 추가 반환)

**Query Parameters:**

| 파라미터 | 타입   | 기본값 | 설명                           |
| -------- | ------ | ------ | ------------------------------ |
| cursor   | string | -      | 이전 페이지 마지막 항목의 `id` |
| limit    | number | 10     | 페이지 크기 (최대 30)          |

**Response 200:**

```json
{
  "polls": [
    {
      "id": "01234567-0000-0000-0000-000000000001",
      "question": "가장 좋아하는 프레임워크는?",
      "options": ["React", "Vue", "Svelte"],
      "status": "published",
      "createdAt": "2026-04-07T00:00:00.000Z",
      "creatorId": "01234567-0000-0000-0000-000000000002",
      "creatorNickname": "닉네임",
      "responseCount": 42,
      "optionCounts": [20, 15, 7],
      "userVotedOption": null,
      "isOwner": false,
      "todayVoteCount": 2
    }
  ],
  "nextCursor": "01234567-0000-0000-0000-000000000001",
  "todayVoteCount": 2
}
```

- `userVotedOption`: 로그인 사용자가 선택한 옵션 인덱스 (0-based), 미참여 시 `null`
- `nextCursor`: 다음 페이지 없으면 `null`
- `todayVoteCount`: 미인증 시 `0`

**에러:**

| Status | error              | 설명         |
| ------ | ------------------ | ------------ |
| 500    | polls_fetch_failed | DB 조회 실패 |

---

## POST /api/polls

> 새 폴 초안을 생성합니다. 생성 후 별도 발행 액션이 필요합니다.

**인증:** 필요

**Request Body:**

```json
{
  "question": "가장 좋아하는 프레임워크는?",
  "options": ["React", "Vue", "Svelte"]
}
```

| 필드     | 타입     | 필수 | 제약                                    |
| -------- | -------- | ---- | --------------------------------------- |
| question | string   | ✅   | 최대 500자                              |
| options  | string[] | ✅   | 최소 2개, 최대 10개, 각 항목 최대 200자 |

**Response 201:**

```json
{
  "id": "01234567-0000-0000-0000-000000000001",
  "question": "가장 좋아하는 프레임워크는?",
  "options": ["React", "Vue", "Svelte"],
  "status": "draft",
  "createdAt": "2026-04-07T00:00:00.000Z",
  "updatedAt": "2026-04-07T00:00:00.000Z"
}
```

**에러:**

| Status | error              | 설명                          |
| ------ | ------------------ | ----------------------------- |
| 401    | unauthorized       | 미인증                        |
| 422    | question_required  | 질문 없음                     |
| 422    | question_too_long  | 질문 500자 초과               |
| 422    | options_invalid    | 옵션 2개 미만 또는 빈 값 포함 |
| 422    | options_too_many   | 옵션 10개 초과                |
| 422    | option_too_long    | 개별 옵션 200자 초과          |
| 500    | poll_create_failed | DB 저장 실패                  |

---

## GET /api/polls/[id]

> 단일 폴의 상세 정보를 반환합니다. draft 상태는 생성자만 조회 가능하며, 로그인 사용자에게는 본인 투표 여부도 함께 내려옵니다.

**인증:** 불필요 (draft는 생성자만 접근 가능)

**Path Parameters:**

| 파라미터 | 타입 | 설명  |
| -------- | ---- | ----- |
| id       | uuid | 폴 ID |

**Response 200:**

```json
{
  "id": "01234567-0000-0000-0000-000000000001",
  "question": "가장 좋아하는 프레임워크는?",
  "options": ["React", "Vue", "Svelte"],
  "status": "published",
  "createdAt": "2026-04-07T00:00:00.000Z",
  "updatedAt": "2026-04-07T00:00:00.000Z",
  "responseCount": 42,
  "userVote": null
}
```

- `userVote`: 로그인 사용자가 투표한 옵션 텍스트, 미참여 시 `null`

**에러:**

| Status | error          | 설명                         |
| ------ | -------------- | ---------------------------- |
| 404    | poll_not_found | 없거나 draft에 비생성자 접근 |

---

## POST /api/polls/[id]/vote

> 폴에 투표합니다. 하루 최대 5회, 폴당 1회만 가능하며 성공 시 100P가 pending 상태로 적립됩니다.

**인증:** 필요

**Path Parameters:**

| 파라미터 | 타입 | 설명  |
| -------- | ---- | ----- |
| id       | uuid | 폴 ID |

**Request Body:**

```json
{
  "optionId": "React"
}
```

- `optionId`: `poll.options` 배열의 텍스트 값 (인덱스 아님)

**Response 201:**

```json
{
  "success": true,
  "pointsEarned": 100,
  "rewardPending": true,
  "todayVoteCount": 3
}
```

| 필드           | 설명                                           |
| -------------- | ---------------------------------------------- |
| pointsEarned   | 적립 예정 포인트 (100P), ledger 저장 실패 시 0 |
| rewardPending  | 포인트가 pending 상태로 기록됨                 |
| todayVoteCount | 오늘 참여한 폴 수 (방금 참여 포함)             |

**에러:**

| Status | error/reason        | 설명                                  |
| ------ | ------------------- | ------------------------------------- |
| 400    | —                   | optionId 누락 또는 유효하지 않은 옵션 |
| 400    | poll_not_published  | 폴이 published 상태가 아님            |
| 401    | Unauthorized        | 미인증                                |
| 404    | Poll not found      | 폴 없음                               |
| 409    | already_voted       | 이미 투표함                           |
| 429    | daily_limit_reached | 일일 한도 5회 초과                    |
| 500    | —                   | 서버 오류                             |

**정책 연동:**

- 일일 최대 참여: 5회/일 (KST 자정 기준 리셋)
- 포인트: 100P/투표, status=`pending`으로 기록
- 중복 투표: DB UNIQUE(poll_id, user_id) 제약으로 차단

---

## GET /api/polls/[id]/results

> 폴의 옵션별 투표 집계 결과를 반환합니다. 인증 없이도 공개 폴은 조회 가능합니다.

**인증:** 불필요 (draft는 생성자만)

**Path Parameters:**

| 파라미터 | 타입 | 설명  |
| -------- | ---- | ----- |
| id       | uuid | 폴 ID |

**Response 200:**

```json
{
  "pollId": "01234567-0000-0000-0000-000000000001",
  "totalVotes": 42,
  "options": [
    { "text": "React", "votes": 20, "percentage": 47.6 },
    { "text": "Vue", "votes": 15, "percentage": 35.7 },
    { "text": "Svelte", "votes": 7, "percentage": 16.7 }
  ]
}
```

- `percentage`: 소수점 1자리 (0 votes 시 0)
- options 순서는 `poll.options` 배열 순서와 동일

**에러:**

| Status | error          | 설명                         |
| ------ | -------------- | ---------------------------- |
| 404    | poll_not_found | 없거나 draft에 비생성자 접근 |
| 500    | internal_error | DB 조회 실패                 |

---

## POST /api/polls/[id]/publish

> draft 폴을 published 상태로 전환합니다. 생성자만 가능합니다.

**인증:** 필요

**Response 200:** 업데이트된 폴 row (`id, question, options, status, created_at, updated_at`)

**에러:**

| Status | error              | 설명                          |
| ------ | ------------------ | ----------------------------- |
| 401    | unauthenticated    | 미인증                        |
| 403    | forbidden          | 생성자 아님                   |
| 404    | poll_not_found     | 없음                          |
| 409    | invalid_transition | draft 아닌 상태에서 발행 시도 |
| 500    | internal_error     | DB 오류                       |

---

## POST /api/polls/[id]/close

> published 폴을 closed 상태로 전환합니다. 생성자만 가능합니다.

**인증:** 필요

**Response 200:** 업데이트된 폴 row

**에러:**

| Status | error              | 설명                              |
| ------ | ------------------ | --------------------------------- |
| 401    | unauthenticated    | 미인증                            |
| 403    | forbidden          | 생성자 아님                       |
| 404    | poll_not_found     | 없음                              |
| 409    | invalid_transition | published 아닌 상태에서 마감 시도 |
| 500    | internal_error     | DB 오류                           |

---

## POST /api/polls/[id]/archive

> closed 폴을 archived 상태로 전환합니다. 생성자만 가능합니다. 보관은 terminal 상태입니다.

**인증:** 필요

**Response 200:** 업데이트된 폴 row

**에러:**

| Status | error              | 설명                           |
| ------ | ------------------ | ------------------------------ |
| 401    | unauthenticated    | 미인증                         |
| 403    | forbidden          | 생성자 아님                    |
| 404    | poll_not_found     | 없음                           |
| 409    | invalid_transition | closed 아닌 상태에서 보관 시도 |
| 500    | internal_error     | DB 오류                        |

**상태 전환 흐름:**

```
draft → published → closed → archived
```

---

## GET /api/polls/[id]/comments

> published 또는 closed 폴의 댓글 목록을 반환합니다. 최상위 댓글과 replies를 트리 구조로 내려줍니다.

**인증:** 불필요 (로그인 시 `myVote` 포함)

**Path Parameters:**

| 파라미터 | 타입 | 설명  |
| -------- | ---- | ----- |
| id       | uuid | 폴 ID |

**Response 200:**

```json
{
  "comments": [
    {
      "id": "uuid",
      "pollId": "uuid",
      "userId": "uuid",
      "parentId": null,
      "content": "댓글 내용",
      "upvotes": 12,
      "createdAt": "2026-04-10T00:00:00.000Z",
      "authorNick": "닉네임",
      "myVote": 1,
      "replies": [
        {
          "id": "uuid",
          "parentId": "부모댓글uuid",
          "content": "대댓글 내용",
          "upvotes": 3,
          "myVote": null,
          "replies": []
        }
      ]
    }
  ],
  "total": 5
}
```

- `myVote`: 로그인 유저의 투표값 (`1`, `-1`, `null`). 비로그인 시 항상 `null`.
- `authorNick`: 탈퇴/익명 유저면 `null`.
- `replies`: upvotes 내림차순 → created_at 오름차순 정렬.

**에러:**

| Status | error                 | 설명                   |
| ------ | --------------------- | ---------------------- |
| 403    | poll_not_accessible   | draft 또는 archived 폴 |
| 404    | poll_not_found        | 폴 없음                |
| 500    | comments_fetch_failed | DB 조회 실패           |

---

## POST /api/polls/[id]/comments

> published 폴에 댓글을 작성합니다. closed 폴은 읽기 전용입니다.

**인증:** 필요

**Path Parameters:**

| 파라미터 | 타입 | 설명  |
| -------- | ---- | ----- |
| id       | uuid | 폴 ID |

**Request Body:**

```json
{
  "content": "댓글 내용",
  "parent_id": "부모댓글uuid"
}
```

| 필드      | 타입   | 필수 | 제약                      |
| --------- | ------ | ---- | ------------------------- |
| content   | string | ✅   | 최대 500자, 공백만은 불가 |
| parent_id | string | ❌   | 같은 폴의 댓글 id여야 함  |

**Response 201:**

```json
{
  "comment": {
    "id": "uuid",
    "pollId": "uuid",
    "userId": "uuid",
    "parentId": null,
    "content": "댓글 내용",
    "upvotes": 0,
    "createdAt": "2026-04-10T00:00:00.000Z",
    "authorNick": "닉네임",
    "myVote": null,
    "replies": []
  }
}
```

**에러:**

| Status | error                    | 설명                               |
| ------ | ------------------------ | ---------------------------------- |
| 401    | unauthorized             | 미인증                             |
| 403    | poll_not_published       | published 아닌 폴에 댓글 작성 시도 |
| 404    | poll_not_found           | 폴 없음                            |
| 422    | content_required         | content 누락 또는 공백             |
| 422    | content_too_long         | 500자 초과                         |
| 422    | invalid_parent_id        | parent_id가 string이 아님          |
| 422    | parent_comment_not_found | parent_id 댓글이 없거나 타 폴 소속 |
| 500    | comment_create_failed    | DB 저장 실패                       |

---

## POST /api/polls/[id]/comments/[commentId]/vote

> 댓글에 upvote(1) 또는 downvote(-1)를 합니다. 같은 방향 재투표 시 취소(toggle)됩니다.

**인증:** 필요

**Path Parameters:**

| 파라미터  | 타입 | 설명    |
| --------- | ---- | ------- |
| id        | uuid | 폴 ID   |
| commentId | uuid | 댓글 ID |

**Request Body:**

```json
{ "vote": 1 }
```

| 필드 | 타입     | 필수 | 허용값    |
| ---- | -------- | ---- | --------- |
| vote | smallint | ✅   | `1`, `-1` |

**Response 200:**

```json
{
  "upvotes": 13,
  "myVote": 1
}
```

| 필드    | 설명                                     |
| ------- | ---------------------------------------- |
| upvotes | 반영 후 댓글의 최신 upvotes 값           |
| myVote  | 투표 취소 시 `null`, 그 외 `1` 또는 `-1` |

**에러:**

| Status | error                        | 설명                     |
| ------ | ---------------------------- | ------------------------ |
| 401    | unauthorized                 | 미인증                   |
| 404    | comment_not_found            | 댓글 없거나 다른 폴 소속 |
| 422    | vote_must_be_1_or_negative_1 | vote 값 유효하지 않음    |
| 500    | vote_failed                  | DB 오류                  |
