# Surveys API

<!-- version: 1.3.0 | 최초 작성: 2026-04-07 | 최종 수정: 2026-04-18 -->

---

## 상태 머신

```
draft → (POST /publish) → published → (POST /close) → closed → (POST /reopen) → draft
                                                              → (PATCH status=archived) → archived
```

- `draft → published`: `/publish` 엔드포인트 전용 (유효성 검사 포함)
- `published → closed`: PATCH 또는 `/close` 엔드포인트
- `closed → draft`: `/reopen` 엔드포인트
- `closed → archived`: PATCH `status: "archived"`
- `archived`: 더 이상 전환 없음

---

## GET /api/surveys

> 로그인한 사용자가 만든 설문 목록을 반환합니다. 본인 설문만 조회됩니다.

**인증:** 필요

**Response 200:**

```json
[
  {
    "id": "01234567-0000-0000-0000-000000000001",
    "title": "고객 만족도 조사",
    "description": "설문 설명",
    "status": "draft",
    "purpose": "research",
    "tags": ["ux", "satisfaction"],
    "end_date": "2026-05-01T00:00:00.000Z",
    "target_participant_count": 30,
    "reward_type": "none",
    "reward_amount": null,
    "reward_winner_count": null,
    "created_at": "2026-04-07T00:00:00.000Z",
    "updated_at": "2026-04-07T00:00:00.000Z"
  }
]
```

**에러:**

| Status | error               | 설명         |
| ------ | ------------------- | ------------ |
| 401    | unauthorized        | 미인증       |
| 500    | survey_fetch_failed | DB 조회 실패 |

---

## POST /api/surveys

> 새 설문 초안을 생성합니다. 생성 시 기본 섹션 1개와 빈 질문 1개가 자동으로 추가됩니다.

**인증:** 필요

**Request Body:**

```json
{
  "title": "고객 만족도 조사",
  "description": "설문 설명",
  "purpose": "research",
  "tags": ["ux"],
  "end_date": "2026-05-01T00:00:00.000Z",
  "target_participant_count": 30,
  "max_responses": null,
  "thumbnail_url": null,
  "reward_type": "none",
  "reward_amount": null,
  "reward_winner_count": null
}
```

| 필드                     | 타입                           | 필수 | 제약                               |
| ------------------------ | ------------------------------ | ---- | ---------------------------------- |
| title                    | string                         | -    | 없으면 "Untitled Survey"           |
| description              | string\|null                   | -    |                                    |
| purpose                  | string\|null                   | -    |                                    |
| tags                     | string[]\|null                 | -    | 최대 5개, 각 1-15자, 특수문자 금지 |
| end_date                 | ISO string\|null               | -    |                                    |
| target_participant_count | 10\|30\|50\|null               | -    | 지정값 외 422                      |
| reward_type              | "none"\|"first_come"\|"random" | -    | 기본값 "none"                      |
| reward_amount            | number\|null                   | -    | reward_type과 조합 규칙 준수       |
| reward_winner_count      | number\|null                   | -    | reward_type과 조합 규칙 준수       |

**보상 조합 규칙 (정책 9.11.2):**

| reward_type | reward_amount | reward_winner_count |
| ----------- | ------------- | ------------------- |
| none        | null          | null                |
| first_come  | 1000          | null                |
| random      | 5000          | 10                  |
| random      | 10000         | 5                   |

위 조합 외 422 반환.

**Response 201:** 생성된 설문 row (GET /api/surveys/[id]와 동일한 필드)

**에러:**

| Status | error                                                                                         | 설명                  |
| ------ | --------------------------------------------------------------------------------------------- | --------------------- |
| 401    | unauthorized                                                                                  | 미인증                |
| 422    | invalid_target_participant_count                                                              | 허용값(10\|30\|50) 외 |
| 422    | invalid_tags_format / tags_limit_exceeded / tag_length_invalid / tag_contains_forbidden_chars | 태그 유효성 실패      |
| 422    | invalid_reward_combination                                                                    | 보상 조합 규칙 위반   |
| 500    | survey_create_failed                                                                          | DB 저장 실패          |

---

## GET /api/surveys/[id]

> 설문 상세 정보, 질문 목록, 응답 수를 반환합니다. 비로그인 사용자와 비생성자는 published 상태 설문만 조회할 수 있습니다.

**인증:** 불필요 (published만 공개. 본인 설문은 모든 status 조회 가능)

**Path Parameters:**

| 파라미터 | 타입 | 설명    |
| -------- | ---- | ------- |
| id       | uuid | 설문 ID |

**Response 200:**

```json
{
  "id": "01234567-0000-0000-0000-000000000001",
  "title": "고객 만족도 조사",
  "description": "설문 설명",
  "status": "published",
  "purpose": "research",
  "tags": ["ux"],
  "end_date": "2026-05-01T00:00:00.000Z",
  "target_participant_count": 30,
  "max_responses": null,
  "thumbnail_url": null,
  "reward_type": "none",
  "reward_amount": null,
  "reward_winner_count": null,
  "estimated_time": null,
  "max_participants": null,
  "created_at": "2026-04-07T00:00:00.000Z",
  "updated_at": "2026-04-07T00:00:00.000Z",
  "questions": [
    {
      "id": "01234567-0000-0000-0000-000000000002",
      "survey_id": "01234567-0000-0000-0000-000000000001",
      "type": "multiple_choice",
      "title": "질문 텍스트",
      "options": ["옵션1", "옵션2"],
      "order_index": 0,
      "required": true,
      "config": null,
      "created_at": "2026-04-07T00:00:00.000Z"
    }
  ],
  "responseCount": 5
}
```

`questions`는 `order_index` 오름차순 정렬.

**에러:**

| Status | 설명                                         |
| ------ | -------------------------------------------- |
| 404    | 없거나 미인증 사용자의 비published 설문 접근 |

---

## PATCH /api/surveys/[id]

> 설문 필드를 수정하거나 일부 상태를 전환합니다. `draft → published`는 `/publish`, `closed → draft`는 `/reopen` 전용입니다.

**인증:** 필요 (생성자만)

**허용 상태 전환 (PATCH 경유):**

- `published → closed`
- `closed → archived`

**Request Body (수정할 필드만 포함):**

```json
{
  "title": "수정된 제목",
  "description": "수정된 설명",
  "status": "closed",
  "tags": ["updated"],
  "end_date": "2026-06-01T00:00:00.000Z",
  "target_participant_count": 50,
  "reward_type": "first_come",
  "reward_amount": 1000,
  "reward_winner_count": null
}
```

허용 필드: `title`, `description`, `status`, `purpose`, `tags`, `end_date`, `target_participant_count`, `max_responses`, `thumbnail_url`, `max_participants`, `estimated_time`, `reward_type`, `reward_amount`, `reward_winner_count`

**Response 200:** 업데이트된 설문 row

**에러:**

| Status | error                   | 설명                            |
| ------ | ----------------------- | ------------------------------- |
| 400    | INVALID_STATUS          | 유효하지 않은 status 값         |
| 400    | INVALID_TRANSITION      | 허용되지 않는 상태 전환         |
| 400    | USE_PUBLISH_ENDPOINT    | draft→published는 /publish 사용 |
| 401    | Unauthorized            | 미인증                          |
| 404    | Survey not found        | 없거나 본인 설문 아님           |
| 422    | (태그/보상 유효성 실패) | POST /api/surveys와 동일        |

---

## DELETE /api/surveys/[id]

> 설문을 영구 삭제합니다. 응답이 1건이라도 있으면 삭제가 차단됩니다. 대신 close 또는 archive를 사용하세요.

**인증:** 필요 (생성자만)

**Response 204:** 본문 없음

**에러:**

| Status | error         | 설명                                            |
| ------ | ------------- | ----------------------------------------------- |
| 401    | Unauthorized  | 미인증                                          |
| 409    | HAS_RESPONSES | 응답이 있어 삭제 불가 — close 또는 archive 사용 |

---

## POST /api/surveys/[id]/questions

> 설문에 질문을 추가합니다. `insert_after_id` 없으면 맨 뒤에 붙고, 있으면 해당 질문 바로 다음 위치에 삽입합니다.

**인증:** 필요 (생성자만)

**Request Body:**

```json
{
  "section_id": "01234567-0000-0000-0000-000000000003",
  "type": "multiple_choice",
  "title": "질문 텍스트",
  "options": ["옵션1", "옵션2"],
  "required": false,
  "config": null,
  "insert_after_id": "01234567-0000-0000-0000-000000000010"
}
```

| 필드            | 타입           | 필수 | 설명                                                                                             |
| --------------- | -------------- | ---- | ------------------------------------------------------------------------------------------------ |
| section_id      | uuid           | ✅   | 속할 섹션 ID                                                                                     |
| type            | QuestionType   | -    | 기본값 "multiple_choice"                                                                         |
| title           | string         | -    | 기본값 ""                                                                                        |
| options         | string[]\|null | -    | multiple_choice, checkbox, dropdown, ranking에 사용                                              |
| required        | boolean        | -    | 기본값 false                                                                                     |
| config          | object\|null   | -    | scale, grade 등 타입별 설정                                                                      |
| insert_after_id | uuid           | -    | 지정하면 해당 질문 바로 다음에 삽입. 이후 질문들의 order_index가 +1 shift됨. 없으면 맨 끝에 추가 |

**QuestionType 목록:** `multiple_choice`, `checkbox`, `short_text`, `long_text`, `scale`, `grade`, `dropdown`, `ranking`, `endpoint`

**Response 201:** 생성된 질문 row

**에러:**

| Status | error                     | 설명                               |
| ------ | ------------------------- | ---------------------------------- |
| 400    | section_id is required    | section_id 없음                    |
| 401    | Unauthorized              | 미인증                             |
| 404    | Survey not found          | 없거나 본인 설문 아님              |
| 422    | insert_after_id not found | insert_after_id가 해당 설문에 없음 |

---

## GET /api/surveys/[id]/sections

> 설문의 섹션 목록을 order_index 오름차순으로 반환합니다.

**인증:** 필요

**Response 200:**

```json
[
  {
    "id": "01234567-0000-0000-0000-000000000003",
    "survey_id": "01234567-0000-0000-0000-000000000001",
    "title": "",
    "order_index": 0,
    "created_at": "2026-04-07T00:00:00.000Z",
    "updated_at": "2026-04-07T00:00:00.000Z"
  }
]
```

---

## POST /api/surveys/[id]/sections

> 섹션을 추가합니다. `after_section_id`를 지정하면 해당 섹션 바로 다음에 삽입되고, 생략하면 맨 뒤에 추가됩니다.

**인증:** 필요 (생성자만)

**Request Body:**

```json
{
  "title": "섹션 제목",
  "after_section_id": "01234567-0000-0000-0000-000000000003"
}
```

**Response 201:** 생성된 섹션 row

---

## POST /api/surveys/[id]/publish

> 설문을 draft에서 published로 전환합니다. 제목, 질문 수, 옵션 등 유효성 검사를 통과해야 발행됩니다.

**인증:** 필요 (생성자만)

**Request Body:** 없음

**Response 200:**

```json
{
  "id": "01234567-0000-0000-0000-000000000001",
  "title": "고객 만족도 조사",
  "description": "설문 설명",
  "status": "published",
  "created_at": "2026-04-07T00:00:00.000Z",
  "updated_at": "2026-04-07T00:00:00.000Z"
}
```

**에러:**

| Status | error/errors                       | 설명                                       |
| ------ | ---------------------------------- | ------------------------------------------ |
| 400    | INVALID_TRANSITION                 | draft가 아닌 설문 발행 시도                |
| 401    | Unauthorized                       | 미인증                                     |
| 403    | Forbidden                          | 본인 설문 아님                             |
| 404    | Survey not found                   | 없음                                       |
| 422    | `{ errors: [{ field, message }] }` | 유효성 검사 실패 (제목 없음, 질문 없음 등) |

---

## POST /api/surveys/[id]/close

> published 설문을 closed로 전환합니다. 이후 응답 수집이 중단됩니다.

**인증:** 필요 (생성자만)

**Request Body:** 없음

**Response 200:** 업데이트된 설문 row (`status: "closed"`)

**에러:**

| Status | error              | 설명                            |
| ------ | ------------------ | ------------------------------- |
| 400    | INVALID_TRANSITION | published가 아닌 설문 마감 시도 |
| 401    | Unauthorized       | 미인증                          |
| 403    | Forbidden          | 본인 설문 아님                  |
| 404    | Survey not found   | 없음                            |

---

## POST /api/surveys/[id]/reopen

> closed 설문을 draft로 되돌립니다. 수정 후 다시 `/publish`를 통해 발행할 수 있습니다.

**인증:** 필요 (생성자만)

**Request Body:** 없음

**Response 200:** 업데이트된 설문 row (`status: "draft"`)

**에러:**

| Status | error              | 설명                         |
| ------ | ------------------ | ---------------------------- |
| 400    | INVALID_TRANSITION | closed가 아닌 설문 재개 시도 |
| 401    | Unauthorized       | 미인증                       |
| 403    | Forbidden          | 본인 설문 아님               |
| 404    | Survey not found   | 없음                         |

---

## POST /api/surveys/[id]/session

> 설문 참여 슬롯을 예약합니다. "시작하기" 클릭 시 호출되며, `in_progress` 응답 row를 생성합니다.
> 슬롯은 30분 TTL을 가지며, 제출(POST /respond) 또는 만료 시 해제됩니다.

**인증:** 필요

**Request Body:** 없음

**Response 200:**

```json
{
  "session_id": "01234567-0000-0000-0000-000000000010",
  "expires_at": "2026-04-18T10:30:00.000Z"
}
```

- 기존 `in_progress` 세션이 있으면 `started_at`을 갱신(TTL 리셋)하고 동일 형식 반환

**에러:**

| Status | code                 | 설명                                |
| ------ | -------------------- | ----------------------------------- |
| 401    | UNAUTHORIZED         | 미인증                              |
| 403    | SURVEY_NOT_PUBLISHED | 참여 불가 상태                      |
| 404    | SURVEY_NOT_FOUND     | 없음                                |
| 409    | ALREADY_RESPONDED    | 이미 완료 제출한 설문               |
| 409    | SURVEY_FULL          | max_responses 초과 (DB 트리거 적용) |

---

## GET /api/surveys/[id]/respond

> 현재 로그인 사용자가 이미 응답했는지 확인합니다. 미인증 시 항상 `false`를 반환합니다.

**인증:** 불필요

**Response 200:**

```json
{ "hasResponded": false }
```

---

## POST /api/surveys/[id]/respond

> 설문 응답을 제출합니다. 세션 API로 예약된 `in_progress` row를 `completed`로 전환하고 답변을 저장합니다.
> 세션이 만료됐거나 없는 경우(구 클라이언트) INSERT fallback으로 처리됩니다.

**인증:** 필요

**Request Body:**

```json
{
  "answers": [
    { "question_id": "01234567-0000-0000-0000-000000000002", "value": "옵션1" },
    { "question_id": "01234567-0000-0000-0000-000000000004", "value": ["옵션1", "옵션2"] },
    { "question_id": "01234567-0000-0000-0000-000000000005", "value": 4 }
  ],
  "shareToken": "optional-share-token",
  "started_at": "2026-04-07T00:00:00.000Z"
}
```

| 필드                  | 타입                     | 필수 | 설명                                                |
| --------------------- | ------------------------ | ---- | --------------------------------------------------- |
| answers               | AnswerInput[]            | ✅   | 배열 필수 (빈 배열 허용, required 질문은 별도 검사) |
| answers[].question_id | uuid                     | ✅   | 이 설문에 속한 질문 ID만 허용                       |
| answers[].value       | string\|string[]\|number | ✅   | 질문 타입에 따라 다름                               |
| shareToken            | string                   | -    | 공유 링크 토큰                                      |
| started_at            | ISO string               | -    | 응답 시작 시각 (소요 시간 측정용, fallback 경로만)  |

**value 타입별 형식:**

| QuestionType              | value 형식                  |
| ------------------------- | --------------------------- |
| short_text, long_text     | string (최대 5000자)        |
| multiple_choice, dropdown | string (선택한 옵션 텍스트) |
| checkbox, ranking         | string[] (최대 20개)        |
| scale, grade              | number                      |

**Response 201:**

```json
{
  "success": true,
  "responseId": "01234567-0000-0000-0000-000000000010"
}
```

**에러:**

| Status | error/code               | 설명                                       |
| ------ | ------------------------ | ------------------------------------------ |
| 401    | UNAUTHORIZED             | 미인증                                     |
| 403    | SURVEY_NOT_PUBLISHED     | 응답 불가 상태                             |
| 403    | SURVEY_FULL              | max_responses 초과 (fallback INSERT 경로)  |
| 404    | SURVEY_NOT_FOUND         | 없음                                       |
| 409    | already_responded        | 이미 완료 응답함                           |
| 422    | INVALID_QUESTION_ID      | 이 설문에 없는 question_id 포함            |
| 422    | ANSWER_TOO_LONG          | 텍스트 5000자 초과 또는 옵션 20개 초과     |
| 422    | MISSING_REQUIRED_ANSWERS | 필수 질문 미응답 (missingQuestionIds 포함) |

---

## GET /api/surveys/[id]/report

> 설문 응답 데이터를 질문 타입별로 집계해서 반환합니다. 생성자만 접근 가능합니다.

**인증:** 필요 (생성자만)

**Response 200:**

```json
{
  "survey": {
    "id": "01234567-0000-0000-0000-000000000001",
    "title": "고객 만족도 조사",
    "description": "설문 설명",
    "status": "closed",
    "created_at": "2026-04-07T00:00:00.000Z",
    "updated_at": "2026-04-07T00:00:00.000Z"
  },
  "summary": { "totalResponses": 42 },
  "questions": [
    {
      "id": "01234567-0000-0000-0000-000000000002",
      "title": "질문 텍스트",
      "type": "multiple_choice",
      "order_index": 0,
      "options": ["옵션1", "옵션2"],
      "answers": {
        "counts": { "옵션1": 30, "옵션2": 12 },
        "total": 42
      }
    }
  ]
}
```

**answers 집계 형식 (타입별):**

| type                      | 집계 필드                                                   |
| ------------------------- | ----------------------------------------------------------- |
| short_text, long_text     | `texts: string[]`                                           |
| multiple_choice, dropdown | `counts: Record<string, number>`                            |
| checkbox                  | `counts: Record<string, number>`                            |
| scale, grade              | `values: number[], average: number`                         |
| ranking                   | `rankAverages: Record<string, number>` (낮을수록 높은 순위) |
| endpoint                  | `total: 0`                                                  |

**에러:**

| Status | error            | 설명                  |
| ------ | ---------------- | --------------------- |
| 401    | Unauthorized     | 미인증                |
| 404    | Survey not found | 없거나 본인 설문 아님 |

---

## POST /api/surveys/[id]/follow-up

> 완료(closed/archived)된 설문의 질문+응답 데이터를 AI(Gemini)로 분석해 후속 설문 초안을 생성한다. Pro/Max 전용 (50 AI 크레딧 소모).

**인증:** 필요  
**플랜:** Pro / Max (Free → 403)  
**크레딧:** 50 소모 (생성 성공 시에만 차감)

**요청 Body:** 없음

**Response 201:**

```json
{
  "surveyId": "uuid"
}
```

응답 받은 `surveyId`는 새로 생성된 draft 설문의 ID. `/survey/{surveyId}/edit` 으로 리다이렉트.

**에러:**

| Status | error                | 설명                                |
| ------ | -------------------- | ----------------------------------- |
| 401    | unauthorized         | 미인증                              |
| 402    | insufficient_credits | AI 크레딧 부족 (잔량 < 50)          |
| 403    | follow_up_pro_only   | Free 플랜 (Pro/Max만 사용 가능)     |
| 404    | survey_not_found     | 없거나 본인 소유 아님 / closed 아님 |
| 422    | no_questions_found   | 원본 설문에 질문 없음               |
| 500    | ai_generation_failed | Gemini 응답 파싱 실패               |
| 500    | survey_create_failed | 새 설문 DB 저장 실패                |

---

## GET /api/surveys/[id]/responses

> 설문 응답 목록을 페이지 단위로 반환합니다. 창작자 본인만 접근 가능합니다.

**인증:** 필요 (창작자만)

**Query Parameters:**

| 파라미터 | 타입 | 기본값 | 설명                  |
| -------- | ---- | ------ | --------------------- |
| page     | int  | 1      | 1-based 페이지 번호   |
| limit    | int  | 20     | 페이지 크기 (max 100) |

**Response 200:**

```json
{
  "responses": [
    {
      "id": "uuid",
      "created_at": "2026-04-18T00:00:00.000Z",
      "completed_at": "2026-04-18T00:00:00.000Z",
      "respondent_ip": "1.2.3.4",
      "respondent_ua": "Mozilla/5.0 ...",
      "answer_count": 7,
      "reward_eligibility": {
        "status": "confirmed",
        "disqualify_reason": null
      }
    }
  ],
  "total": 42
}
```

- `reward_eligibility`: 보상 설정이 없는 설문은 `null`
- `reward_eligibility.status`: `pending` | `confirmed` | `disqualified` | `paid` | `failed`

**에러:**

| Status | error                  | 설명                  |
| ------ | ---------------------- | --------------------- |
| 401    | unauthorized           | 미인증                |
| 404    | survey_not_found       | 없거나 본인 설문 아님 |
| 500    | responses_fetch_failed | DB 조회 실패          |

---

## PATCH /api/surveys/[id]/responses/[rid]/disqualify

> 특정 응답의 보상 자격을 창작자가 직접 취소합니다. admin 전용 endpoint와 별개로 창작자 전용으로 분리됩니다.

**인증:** 필요 (창작자만)

**Request Body:** 없음

**Response 200:**

```json
{ "success": true, "responseId": "uuid", "status": "disqualified" }
```

**동작:**

- `reward_eligibility` row의 `status` = `"disqualified"`, `disqualify_reason` = `"creator_flagged"` 으로 업데이트
- 보상 예산이 없는 설문(row 없음)은 no-op으로 200 반환
- 이미 `disqualified` 또는 `paid` 상태이면 409

**에러:**

| Status | error                     | 설명                             |
| ------ | ------------------------- | -------------------------------- |
| 401    | unauthorized              | 미인증                           |
| 403    | forbidden                 | 본인 설문 아님                   |
| 404    | response_not_found        | 응답이 없거나 다른 설문 소속     |
| 409    | invalid_status_transition | 이미 disqualified 또는 paid 상태 |
| 500    | disqualify_failed         | DB 업데이트 실패                 |

---

## GET /api/surveys/[id]/analysis

> 설문의 AI 분석 목록을 최신순으로 반환합니다. 창작자 본인만 접근 가능합니다.

**인증:** 필요 (창작자만)

**Response 200:**

```json
[
  {
    "id": "uuid",
    "prompt": "가장 많이 선택된 옵션과 이유를 분석해줘",
    "status": "done",
    "created_at": "2026-04-18T00:00:00.000Z"
  }
]
```

빈 배열 가능.

**에러:**

| Status | error            | 설명                  |
| ------ | ---------------- | --------------------- |
| 401    | unauthorized     | 미인증                |
| 404    | survey_not_found | 없거나 본인 설문 아님 |

---

## POST /api/surveys/[id]/analysis

> 설문 응답 데이터를 Claude로 분석합니다. `closed` 상태 설문만 가능. Pro/Max 전용, 80 AI 크레딧 소모.

**인증:** 필요  
**플랜:** Pro / Max (Free → 403)  
**크레딧:** 80 소모 (성공 시에만 차감)  
**전제 조건:** `survey.status === 'closed'`

**Request Body:**

```json
{ "prompt": "어떤 질문에서 이탈률이 가장 높았나요?" }
```

| 필드   | 타입   | 필수 | 설명                       |
| ------ | ------ | ---- | -------------------------- |
| prompt | string | ✅   | 분석 질문 (비어있으면 422) |

**Response 200:**

```json
{
  "id": "uuid",
  "status": "done",
  "sentence": "Q3 척도 질문의 평균 점수는 3.8점으로, Q1 선택 응답자 중 76%가 4점 이상을 부여했어요.",
  "data_point": {
    "label": "Q3 평균 점수",
    "value": 76,
    "comparison": 31
  }
}
```

- `data_point.comparison`: 비교 기준값 (옵션, 없을 수 있음)
- 실패 시 `status: "failed"` 로 row 업데이트 후 500 반환

**에러:**

| Status | error                  | 설명                       |
| ------ | ---------------------- | -------------------------- |
| 400    | invalid_body           | body 파싱 실패             |
| 401    | unauthorized           | 미인증                     |
| 402    | insufficient_credits   | AI 크레딧 부족 (잔량 < 80) |
| 403    | analysis_pro_only      | Free 플랜                  |
| 404    | survey_not_found       | 없거나 본인 소유 아님      |
| 422    | prompt_required        | prompt 비어있음            |
| 422    | survey_not_closed      | closed 상태 아님           |
| 500    | ai_analysis_failed     | Claude 응답 파싱 실패      |
| 500    | analysis_create_failed | DB insert 실패             |

---

## GET /api/surveys/[id]/analysis/[aid]

> 단일 분석 결과를 반환합니다. 창작자 본인만 접근 가능합니다.

**인증:** 필요 (창작자만)

**Response 200:**

```json
{
  "id": "uuid",
  "prompt": "어떤 질문에서 이탈률이 가장 높았나요?",
  "sentence": "Q3 척도 질문의 평균 점수는 3.8점으로 ...",
  "data_point": { "label": "Q3 평균 점수", "value": 76, "comparison": 31 },
  "status": "done",
  "created_at": "2026-04-18T00:00:00.000Z"
}
```

**에러:**

| Status | error                 | 설명                         |
| ------ | --------------------- | ---------------------------- |
| 401    | unauthorized          | 미인증                       |
| 404    | analysis_not_found    | 없거나 다른 창작자/설문 소속 |
| 500    | analysis_fetch_failed | DB 조회 실패                 |
