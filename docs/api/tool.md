<!-- version: 1.0.0 | 최초 작성: 2026-06-22 | 최종 수정: 2026-06-22 -->

# Tool API

내부 사내 툴 전용 API. 인증 불필요.

---

## `POST /api/tool/flowchart`

케이스 설명을 받아 Claude로 플로우차트 구조 및 엣지케이스를 분석한다.
대화 히스토리를 포함해 반복 수정을 지원한다.

### Request

```json
{
  "messages": [
    { "role": "user", "content": "Individual 플랜 구독 일시정지 플로우를 정의해줘" },
    { "role": "assistant", "content": "분석 결과..." },
    { "role": "user", "content": "결제 실패 케이스 추가해줘" }
  ]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `messages` | `Array` | Y | 전체 대화 히스토리 (최신 메시지 포함) |
| `messages[].role` | `"user" \| "assistant"` | Y | 메시지 발화자 |
| `messages[].content` | `string` | Y | 자연어 내용 (플로우차트 JSON 제외) |

### Response `200`

```json
{
  "content": "플로우를 분석했어요. 총 5개 노드, 엣지케이스 3개를 발견했어요...",
  "flowchart": {
    "nodes": [
      { "id": "start", "label": "시작", "type": "start", "col": 0, "row": 0 },
      { "id": "mypage", "label": "마이페이지", "type": "screen", "col": 1, "row": 0 },
      { "id": "check-status", "label": "구독 상태 확인", "type": "decision", "col": 2, "row": 0 },
      { "id": "pause-confirm", "label": "일시정지 확인", "type": "screen", "col": 3, "row": 0 },
      { "id": "end-success", "label": "완료", "type": "end", "col": 4, "row": 0 },
      { "id": "end-blocked", "label": "차단됨", "type": "end", "col": 3, "row": 1 }
    ],
    "edges": [
      { "from": "start", "to": "mypage" },
      { "from": "mypage", "to": "check-status" },
      { "from": "check-status", "to": "pause-confirm", "condition": "yes" },
      { "from": "check-status", "to": "end-blocked", "condition": "no" },
      { "from": "pause-confirm", "to": "end-success" }
    ],
    "edge_cases": [
      "일시정지 중 추가 일시정지 시도",
      "Trial 기간 중 일시정지 시도"
    ],
    "missing_cases": [
      "Cancel Scheduled 상태에서의 처리",
      "결제 실패 후 Suspended 상태에서 일시정지 시도"
    ]
  }
}
```

Claude가 구조화된 JSON을 반환하지 못한 경우 `flowchart: null` 반환.

### Node 타입 정의

| type | 모양 | 용도 |
|------|------|------|
| `start` | 타원 | 플로우 진입점 (1개) |
| `screen` | 둥근 직사각형 | 일반 화면/단계 |
| `decision` | 다이아몬드 | Yes/No 이분기 전용 |
| `route` | 육각형 | 3개+ 케이스 분기 |
| `end` | 필 직사각형 | 플로우 종료점 |

### Edge 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `from` | `string` | 출발 노드 ID |
| `to` | `string` | 도착 노드 ID |
| `label` | `string?` | 엣지 레이블 (route 분기 케이스명 등) |
| `condition` | `"yes" \| "no"?` | decision 노드 outgoing 엣지에만 사용 |

### Error

| Status | error | 설명 |
|--------|-------|------|
| 400 | `messages_required` | messages 배열이 없거나 빈 배열 |
| 400 | `invalid_body` | JSON 파싱 실패 |
| 500 | `claude_call_failed` | Claude API 호출 실패 |
