# /api/analyze

<!-- version: 1.1.0 | 최초 작성: 2026-04-07 | 최종 수정: 2026-04-12 -->

AI 기반 설문 초안 생성. URL 분석 또는 프롬프트 텍스트를 받아 Gemini로 설문 질문을 생성한다.

---

## POST /api/analyze

### Request Body

| 필드          | 타입                  | 필수 | 설명                                        |
| ------------- | --------------------- | ---- | ------------------------------------------- |
| `source`      | `string`              | ✅   | URL(http/https/GitHub) 또는 프롬프트 텍스트 |
| `source_type` | `"url"` \| `"prompt"` | -    | 생략 시 `"url"` 처리                        |

#### source_type: "url" (기본)

`source`는 `http://` 또는 `https://`로 시작하는 URL이어야 한다.
GitHub URL(`github.com/owner/repo`)은 GitHub API로 README·메타를 수집한다.
일반 URL은 OG 태그 + 본문 텍스트(3000자)를 추출한다.
`PLAYWRIGHT_ENABLED=true` 환경에서는 스크린샷 Vision 분석을 먼저 시도한다.

#### source_type: "prompt"

자유 텍스트 프롬프트. URL 검증을 건너뛰고 프롬프트를 Gemini에 직접 전달한다.

### Response 200

```json
{
  "title": "신제품 사용성 테스트 설문",
  "description": "새로 출시된 제품에 대한 솔직한 의견을 들려주세요.",
  "sourceType": "prompt",
  "questions": [
    {
      "type": "scale",
      "title": "제품 사용이 얼마나 쉬웠나요?"
    },
    {
      "type": "multiple_choice",
      "title": "가장 마음에 든 기능은 무엇인가요?",
      "options": ["디자인", "속도", "가격", "기타"]
    },
    {
      "type": "long_text",
      "title": "개선됐으면 하는 점을 자유롭게 적어 주세요."
    }
  ]
}
```

| 필드          | 설명                                                   |
| ------------- | ------------------------------------------------------ |
| `title`       | 생성된 설문 제목                                       |
| `description` | 설문 설명                                              |
| `sourceType`  | `"github"` \| `"url"` \| `"prompt"`                    |
| `questions`   | 질문 배열 (최대 6개). `type`, `title`, `options?` 포함 |

**질문 타입:** `multiple_choice` · `checkbox` · `short_text` · `long_text` · `scale` · `grade` · `dropdown` · `ranking`

### Error Responses

| Status | error             | 설명                                            |
| ------ | ----------------- | ----------------------------------------------- |
| 400    | `invalid_body`    | JSON 파싱 실패                                  |
| 422    | `source_required` | `source` 필드 없음 또는 빈 문자열               |
| 422    | `invalid_source`  | `source_type: "url"` 인데 http/https URL이 아님 |
| 500    | `analysis_failed` | URL 수집 실패 또는 AI 응답 파싱 실패            |
| 503    | `api_key_missing` | `GEMINI_API_KEY` 환경변수 미설정                |

### 인증

인증 불필요 (클라이언트에서 별도로 Supabase 세션 확인 후 호출).

### 환경변수

| 변수명               | 필수 | 설명                                              |
| -------------------- | ---- | ------------------------------------------------- |
| `GEMINI_API_KEY`     | ✅   | Google Gemini API 키                              |
| `GITHUB_TOKEN`       | -    | GitHub API rate limit 완화용 (없으면 공개 repo만) |
| `PLAYWRIGHT_ENABLED` | -    | `"true"` 시 스크린샷 Vision 분석 활성화           |
