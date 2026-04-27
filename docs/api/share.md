# Share API

<!-- version: 1.0.0 | 최초 작성: 2026-04-08 | 최종 수정: 2026-04-08 -->

공유 링크 토큰 기반으로 설문 정보 조회 및 익명 응답 제출에 사용합니다.
인증 불필요 — 토큰을 아는 누구나 접근할 수 있습니다.

---

## GET /api/share/[token]

> 공유 토큰으로 설문 정보를 조회합니다. 만료 및 응답 한도 초과 여부를 함께 검증합니다.

**인증:** 불필요

**Path Parameters:**

| 파라미터 | 타입   | 설명            |
| -------- | ------ | --------------- |
| token    | string | 8자리 공유 토큰 |

**Response 200:**

```json
{
  "share_id": "01234567-0000-0000-0000-000000000001",
  "token": "ab12cd34",
  "expires_at": "2026-05-01T00:00:00.000Z",
  "max_responses": 100,
  "response_count": 42,
  "survey": {
    "id": "01234567-0000-0000-0000-000000000002",
    "title": "고객 만족도 조사",
    "description": "설문 설명",
    "status": "published",
    "questions": [
      {
        "id": "01234567-0000-0000-0000-000000000003",
        "type": "single_choice",
        "title": "질문 제목",
        "options": ["옵션1", "옵션2"],
        "order_index": 0,
        "required": true,
        "config": null,
        "section_id": null
      }
    ],
    "sections": []
  }
}
```

- `expires_at`: null이면 만료 없음
- `max_responses`: null이면 응답 수 제한 없음

**에러:**

| Status | error               | 설명              |
| ------ | ------------------- | ----------------- |
| 404    | share_not_found     | 토큰 없음         |
| 409    | share_expired       | 만료된 공유 링크  |
| 409    | share_limit_reached | 최대 응답 수 초과 |
| 500    | internal_error      | DB 조회 실패      |

---

## POST /api/share/[token]/respond

> 공유 링크를 통해 익명으로 설문에 응답을 제출합니다. 인증 없이 IP/UA 기반으로만 기록됩니다.

**인증:** 불필요

**Path Parameters:**

| 파라미터 | 타입   | 설명            |
| -------- | ------ | --------------- |
| token    | string | 8자리 공유 토큰 |

**Request Body:**

```json
{
  "answers": [
    {
      "question_id": "01234567-0000-0000-0000-000000000003",
      "value": "옵션1"
    }
  ],
  "started_at": "2026-04-08T10:00:00.000Z"
}
```

| 필드       | 타입          | 필수 | 설명                  |
| ---------- | ------------- | ---- | --------------------- |
| answers    | AnswerInput[] | ✅   | 응답 배열             |
| started_at | string (ISO)  | -    | 응답 시작 시각 (선택) |

**AnswerInput:**

| 필드        | 타입                         | 설명                |
| ----------- | ---------------------------- | ------------------- |
| question_id | string (uuid)                | 설문에 속한 질문 ID |
| value       | string \| string[] \| number | 응답 값             |

**Response 201:**

```json
{
  "success": true,
  "responseId": "01234567-0000-0000-0000-000000000005"
}
```

**에러:**

| Status | error                    | 설명                                      |
| ------ | ------------------------ | ----------------------------------------- |
| 400    | invalid_body             | JSON 파싱 실패 또는 answers가 배열 아님   |
| 403    | survey_not_published     | 설문이 published 상태 아님                |
| 403    | survey_full              | max_participants 초과                     |
| 404    | share_not_found          | 토큰 없음                                 |
| 409    | share_expired            | 만료된 공유 링크                          |
| 409    | share_limit_reached      | 최대 응답 수 초과                         |
| 422    | invalid_question_id      | 설문에 속하지 않는 question_id 포함       |
| 422    | answer_too_long          | 텍스트 5,000자 초과 또는 선택지 20개 초과 |
| 422    | missing_required_answers | 필수 질문 미응답                          |
| 500    | internal_error           | DB 오류                                   |
| 500    | answers_insert_failed    | 응답 저장 실패                            |

**정책 연동:**

- 익명 응답 — `user_id = null`, IP·UA만 기록 (abuse.md §11.3)
- 중복 참여 방지 없음 — 익명이므로 persistent identity 없음
- 포인트 미지급 — 인증 사용자만 포인트 대상
- 제출 성공 시 `survey_shares.response_count` +1 증가

---

## GET /api/surveys/[id]/share

> 설문의 공유 링크 목록을 조회합니다. 소유자만 접근 가능합니다.

**인증:** 필요 (소유자)

**Response 200:**

```json
{
  "shares": [
    {
      "id": "01234567-0000-0000-0000-000000000001",
      "token": "ab12cd34",
      "expires_at": null,
      "max_responses": 100,
      "response_count": 42,
      "created_at": "2026-04-08T00:00:00.000Z"
    }
  ]
}
```

**에러:**

| Status | error            | 설명         |
| ------ | ---------------- | ------------ |
| 401    | unauthenticated  | 미인증       |
| 403    | forbidden        | 소유자 아님  |
| 404    | survey_not_found | 설문 없음    |
| 500    | internal_error   | DB 조회 실패 |

---

## POST /api/surveys/[id]/share

> 설문의 새 공유 링크를 생성합니다. 소유자만 가능합니다.

**인증:** 필요 (소유자)

**Request Body (all optional):**

```json
{
  "expires_at": "2026-05-01T00:00:00.000Z",
  "max_responses": 100
}
```

| 필드          | 타입         | 필수 | 제약                            |
| ------------- | ------------ | ---- | ------------------------------- |
| expires_at    | string (ISO) | -    | 미래 날짜여야 함; null = 무제한 |
| max_responses | number (int) | -    | 1 이상 정수; null = 무제한      |

**Response 201:**

```json
{
  "id": "01234567-0000-0000-0000-000000000001",
  "token": "ab12cd34",
  "expires_at": null,
  "max_responses": 100,
  "response_count": 0,
  "created_at": "2026-04-08T00:00:00.000Z"
}
```

**에러:**

| Status | error                 | 설명                    |
| ------ | --------------------- | ----------------------- |
| 400    | invalid_expires_at    | 유효하지 않은 날짜 형식 |
| 400    | expires_at_in_past    | 만료일이 현재 이전      |
| 400    | invalid_max_responses | 1 미만이거나 정수 아님  |
| 401    | unauthenticated       | 미인증                  |
| 403    | forbidden             | 소유자 아님             |
| 404    | survey_not_found      | 설문 없음               |
| 409    | token_collision       | 토큰 충돌 (재시도 요망) |
| 500    | internal_error        | DB 오류                 |

**토큰 생성 방식:** `crypto.randomUUID()` 앞 8자리 (하이픈 제거 후)
