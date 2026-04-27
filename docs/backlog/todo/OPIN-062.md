---
id: "OPIN-062"
title: "빌더 탭 구조 개편 — 응답 관리 + AI 분석"
priority: "P1"
status: "ready"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-be", "opin-pm"]
created: "2026-04-18"
updated: "2026-04-18"
sprint: "W17"
policy_refs:
  - "docs/policy/abuse.md"
  - "docs/policy/README.md"
  - "docs/policy/survey.md"
code_refs:
  - "src/app/(builder)/survey/[id]/edit/"
  - "src/components/builder/"
  - "src/app/api/surveys/[id]/"
  - "src/app/api/admin/reward-eligibility/"
---

## 목적

설문 창작자가 빌더 한 곳에서 편집 → 응답 확인 → AI 분석까지 완결할 수 있도록, 현재 편집 전용인 빌더에 탭 구조를 추가한다.

비즈니스 임팩트: 창작자가 응답 데이터를 보기 위해 외부 경로를 탐색하거나 별도 페이지를 찾는 이탈이 없어지고, 어뷰징 응답을 빠르게 정리할 수 없어서 보상 예산이 낭비되는 문제를 해결한다.

---

## 현황

- `/survey/[id]/edit` 빌더 페이지는 현재 설문 편집만 존재
- 응답 목록 조회 경로 없음 (API는 존재: `/api/surveys/[id]/respond`)
- 어뷰징 관련 `reward_eligibility` 테이블 + 어드민 API 구현됨 (`/api/admin/reward-eligibility/confirm`, `disqualify`)
- AI 분석 API 없음 — 신규 개발 필요
- abuse.md 기준: duplicate participation, bot submissions, low-quality responses, reward farming 4가지가 핵심

---

## 완료 조건 (Definition of Done)

### 탭 구조

- [ ] 하단 중앙 플로팅 바(기존 `ViewToggle` 컨테이너)에 [빌더 | 응답 | 분석] 3탭 통합
- [ ] 빌더 탭 선택 시에만 [목록 | 흐름] pill + 미리보기 버튼 표시 (응답/분석 탭에서는 숨김)
- [ ] 탭 간 전환 시 URL 쿼리 파라미터 변경 (`?tab=builder|responses|analysis`)
- [ ] 브라우저 뒤로가기로 탭 상태 복원
- [ ] 설문 `status`에 따른 탭 활성/비활성 처리 (아래 상태표 참고)

### 응답 탭

- [ ] 응답 목록 테이블 렌더링 (컬럼 정의 섹션 참고)
- [ ] 어뷰징 의심 행에 빨간 배지/강조 표시
- [ ] 행 클릭 → 응답 상세 슬라이드 패널 (응답별 모든 답변 확인)
- [ ] "어뷰징으로 표시하기" 버튼 → 확인 모달 → `reward_eligibility.status = disqualified`
- [ ] 어뷰징 표시 후 해당 행 시각적 업데이트 (낙관적 업데이트 + 서버 반영)
- [ ] 응답 0건 빈 상태 처리
- [ ] 페이지네이션 (20건/페이지)
- [ ] 응답 CSV 다운로드 버튼

### 분석 탭

- [ ] `status !== 'closed'` 일 때 잠금 상태 + 안내 메시지 표시
- [ ] `status === 'closed'` 일 때 프롬프트 입력 패널 활성화
- [ ] 자연어 프롬프트 입력 후 "분석하기" 버튼 클릭 → AI 인과관계 분석 실행
- [ ] 분석 실행 중 로딩 상태 ("응답 데이터를 분석하고 있어요" 표시)
- [ ] 분석 결과 렌더링: 인과관계 문장 카드 + 시각적 수치 바
- [ ] 분석 결과는 히스토리로 누적 저장 (프롬프트마다 새 결과, 덮어쓰기 없음)
- [ ] 이전 분석 기록 목록 표시 (제목 + 날짜 + 보기 버튼)
- [ ] 기록 클릭 시 해당 분석 결과 재조회 및 표시
- [ ] 분석 결과 없음(첫 방문) 빈 상태 처리
- [ ] 크레딧 80 차감 (결과 분석 요약 기준, monetization.md)
- [ ] 크레딧 부족 시 업그레이드 유도 처리
- [ ] TypeScript strict 통과
- [ ] npm run build 에러 없음
- [ ] QA 시나리오 통과

---

## 상태별 탭 활성/비활성 정책

| survey.status | 빌더 탭 | 응답 탭 | 분석 탭 |
| ------------- | ------- | ------- | ------- |
| `draft`       | 활성    | 비활성  | 비활성  |
| `published`   | 활성    | 활성    | 잠금    |
| `closed`      | 비활성  | 활성    | 활성    |
| `archived`    | 비활성  | 활성    | 활성    |

- `draft` 응답 탭: "설문을 공개한 후 응답을 확인할 수 있어요"
- `published` 분석 탭: "설문을 마감한 후 분석을 시작할 수 있어요"
- `closed` 빌더 탭: 편집 불가 배너만 표시 (탭은 보임)

---

## UX 리서치

### 레퍼런스 패턴

| 서비스          | 패턴                                               | OPINION 적용 포인트                                                         |
| --------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| Typeform        | 상단 Create / Results / Share 탭                   | 탭 레이블을 동사형이 아닌 명사형으로 구성 — 한국어에 자연스러움             |
| Stitch (Google) | 빌더 내 탭 전환으로 디자인/프리뷰/코드 전환        | 탭 전환 시 URL 변경으로 딥링크 지원                                         |
| SurveyMonkey    | Analyze 탭: 질문별 차트 + AI 요약 분리             | 질문 유형별 시각화 방식 구분 (객관식 → 도넛, 주관식 → 워드클라우드 or 목록) |
| Airtable        | 의심 레코드 빨간 배경 + 플래그 아이콘              | 어뷰징 행 강조는 배경색보다 좌측 컬러 바 방식이 가독성 우수                 |
| Qualtrics       | Response Quality 탭 — 응답 시간/일관성 자동 스코어 | 자동 스코어를 UI에 노출하되 최종 판단은 창작자가 수동으로                   |

### 핵심 UX 결정

- **탭 위치**: 하단 중앙 플로팅 바 — 기존 `ViewToggle` 컨테이너에 통합. 상단 헤더를 건드리지 않고 전환 가능. 빌더 탭일 때만 [목록|흐름] + 미리보기 버튼이 옆에 표시됨
- **응답 탭 기본 정렬**: 최신순 (submitted_at DESC) — 이유: 창작자는 최신 응답부터 확인하는 패턴
- **어뷰징 표시 단위**: 응답(response) 단위 — 이유: 질문별 개별 답변이 아닌 응답 전체를 어뷰징으로 판단하는 것이 reward_eligibility 구조와 일치
- **분석 캐싱**: 한 번 생성된 분석 결과는 DB에 저장하여 재실행 없이 재조회 — 이유: 크레딧 낭비 방지, 마감 후 결과는 변하지 않음
- **어뷰징 취소(복구)**: MVP에서는 지원 안 함 — 이유: 보상 취소 후 재지급 파이프라인 미구현, CS를 통한 수동 복구로 처리

### UX Writing (확정 문구)

| 상황                        | 문구                                                                           |
| --------------------------- | ------------------------------------------------------------------------------ |
| draft 상태 응답 탭 진입     | "설문을 공개한 후 응답을 확인할 수 있어요"                                     |
| published 상태 분석 탭 진입 | "설문을 마감한 후 분석을 시작할 수 있어요"                                     |
| 응답 0건 빈 상태            | "아직 응답이 없어요. 링크를 공유하면 응답을 받을 수 있어요"                    |
| 어뷰징 표시 확인 모달 제목  | "이 응답을 어뷰징으로 표시할까요?"                                             |
| 어뷰징 표시 확인 모달 본문  | "보상이 취소되고 응답이 집계에서 제외돼요. 이 작업은 되돌릴 수 없어요."        |
| 어뷰징 모달 확인 버튼       | "어뷰징으로 표시하기"                                                          |
| 어뷰징 모달 취소 버튼       | "닫기"                                                                         |
| 어뷰징 표시 완료 토스트     | "어뷰징으로 표시했어요"                                                        |
| 분석 프롬프트 placeholder   | "어떤 인사이트가 궁금하세요? 예: 만족도가 높은 사람이 재구매를 더 선택했나요?" |
| 분석 버튼                   | "분석하기"                                                                     |
| 분석 실행 중                | "응답 데이터를 분석하고 있어요"                                                |
| 크레딧 부족                 | "크레딧이 부족해요. 충전 후 이용해 주세요."                                    |
| 분석 결과 없음 (첫 방문)    | "분석 결과가 없어요. 궁금한 점을 입력해 보세요"                                |
| 응답 CSV 다운로드 버튼      | "응답 내보내기"                                                                |

---

## 응답 탭 — 테이블 컬럼 정의

| 컬럼명      | 소스                                            | 표시 형식              | 비고                                             |
| ----------- | ----------------------------------------------- | ---------------------- | ------------------------------------------------ |
| #           | row index                                       | 숫자                   | 1부터 시작                                       |
| 응답 ID     | `responses.id`                                  | 앞 8자리               | `#a3f2b1c9` 형태                                 |
| 제출 시각   | `responses.created_at`                          | `4월 18일 14:32`       | hover 시 전체 timestamp                          |
| 응답 시간   | `responses.completed_at - responses.created_at` | `2분 34초`             | 비정상 단시간 강조                               |
| IP 주소     | `responses.respondent_ip`                       | 마스킹 (`192.168.x.x`) | 동일 IP 중복 시 강조                             |
| 어뷰징 점수 | 클라이언트 계산                                 | 0–100                  | 점수 기준 아래 섹션 참고                         |
| 상태        | `reward_eligibility.status`                     | 배지                   | `pending` / `confirmed` / `disqualified`         |
| 액션        | —                                               | 버튼                   | `disqualified` 아닌 경우만 "어뷰징으로 표시하기" |

### 상태 배지 색상

| status         | 배지 텍스트 | 색상 |
| -------------- | ----------- | ---- |
| `pending`      | 검토 중     | 회색 |
| `confirmed`    | 보상 확정   | 초록 |
| `disqualified` | 어뷰징      | 빨강 |

---

## 어뷰징 판별 기준 (Abuse Detection Rules)

abuse.md 4가지 유형에 기반한 자동 점수 계산. 최종 판단은 창작자가 수동으로.

### 판별 기준표

| 규칙 ID | 유형             | 조건                                                                    | 점수 가중치 | 소스 컬럼                             |
| ------- | ---------------- | ----------------------------------------------------------------------- | ----------- | ------------------------------------- |
| ABR-01  | 중복 참여        | 동일 설문에서 같은 `respondent_ip` 응답이 2건 이상                      | +40         | `responses.respondent_ip`             |
| ABR-02  | 비정상 응답 시간 | 응답 완료까지 걸린 시간이 (질문 수 × 5초) 미만                          | +30         | `created_at`, `completed_at`, 질문 수 |
| ABR-03  | 저품질 답변      | 주관식 응답 길이가 전체 주관식 응답 중앙값의 20% 미만인 항목이 50% 초과 | +20         | `answers.value`                       |
| ABR-04  | 패턴 없는 객관식 | 객관식 응답이 모두 동일 순번(예: 전부 1번)인 경우                       | +10         | `answers.value`                       |

### 점수 해석

| 점수 범위 | 의미 | UI 표시                               |
| --------- | ---- | ------------------------------------- |
| 0–29      | 정상 | 표시 없음                             |
| 30–59     | 주의 | 행 배경 `amber/10` + 주황 점          |
| 60–100    | 위험 | 행 배경 `red/10` + 빨간 삼각형 아이콘 |

### 계산 위치

어뷰징 점수는 **프론트엔드에서 클라이언트 계산** (응답 데이터 조회 후 파생). 서버 저장 안 함 — MVP에서는 UI 힌트 용도. 향후 백엔드 스코어링으로 전환 가능 구조로 작성할 것.

---

## 분석 탭 — 상세 명세

### UI 구조

```
┌─────────────────────────────────────────────────────────┐
│ 분석 탭 (survey closed 상태)                             │
│                                                          │
│ ┌─── 프롬프트 입력 패널 ──────────────────────────────┐ │
│ │  어떤 인사이트가 궁금하세요?                         │ │
│ │  ┌───────────────────────────────────────────────┐  │ │
│ │  │ 예: 만족도가 높은 사람이 재구매를 선택했나요?  │  │ │
│ │  └───────────────────────────────────────────────┘  │ │
│ │                             [분석하기 →] (solid)    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─── 분석 결과 패널 ──────────────────────────────────┐ │
│ │ 결과 카드 1                                          │ │
│ │ "Q1에서 4점 이상 응답자 89명 중 76%가               │ │
│ │  Q3에서 재구매 의향 '예'를 선택했습니다."            │ │
│ │  ████████████████░░░░  76%                          │ │
│ │                                                      │ │
│ │ 결과 카드 2 (추가 발견 사항)                         │ │
│ │ "4점 미만 응답자의 동일 항목 선택률은 31%로          │ │
│ │  45%p 차이를 보였습니다."                            │ │
│ │  ████████░░░░░░░░░░░░  31%                          │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│  이전 분석 기록 ──────────────────────────────────────  │
│  "만족도 높은 사람이 재구매..."  4월 18일  [보기]        │
│  "20대와 30대 차이..."          4월 17일  [보기]        │
└─────────────────────────────────────────────────────────┘
```

### 결과 문장 형태 (핵심 출력 형식)

인과관계 + 정확한 수치 + 퍼센트를 담은 문장 구조:

> "Q1(전반적 만족도)에서 **4점 이상**을 선택한 응답자 89명 중,
> Q3(재구매 의향)에서 **'예'**를 선택한 비율은 **76%**입니다."

**프롬프트 1개 = 인과관계 문장 1개 = 결과 1개.** 여러 인사이트가 필요하면 프롬프트를 여러 번 실행하며 히스토리에 쌓인다. 인사이트 하나를 만들기 위해 설문 구조 전체 + 집계 응답 데이터를 AI context로 넣으므로 토큰 소모가 크고, 이것이 크레딧 과금의 근거가 된다.

### API 설계 (신규)

```
POST /api/surveys/[id]/analysis
  - 인증: 창작자 본인만
  - 사전 조건: survey.status === 'closed'
  - body: { prompt: string }       // 자연어 질문
  - 크레딧 차감: 80 (ai_credit_transactions 기록)
  - 응답: { analysisId, status: 'processing' }
  - 히스토리 누적 저장 (UNIQUE 제약 없음 — 프롬프트마다 새 row)

GET /api/surveys/[id]/analysis
  - 해당 설문의 분석 히스토리 목록 반환
  - 없으면 [] (빈 배열)
  - 있으면 [{ id, prompt, status, created_at }] (최신순)

GET /api/surveys/[id]/analysis/[aid]
  - 특정 분석 결과 상세 조회
  - 없으면 404
  - 있으면 { id, prompt, sentence, data_point, status, created_at }
    // sentence: string (단일 인과관계 문장)
    // data_point: { label, value, comparison? } (단일 수치)
```

### DB 스키마 (신규 테이블)

```sql
CREATE TABLE survey_analyses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id    uuid NOT NULL REFERENCES surveys(id),
  creator_id   uuid NOT NULL,
  prompt       text NOT NULL,      -- 창작자가 입력한 자연어 질문
  sentence     text,               -- 인과관계 문장 1개 (결과)
  data_point   jsonb,              -- { label, value, comparison? }  수치 바 1개
  status       text NOT NULL DEFAULT 'processing',
                                   -- processing | done | failed
  credit_tx_id uuid,
  created_at   timestamptz DEFAULT now()
  -- UNIQUE(survey_id) 제거: 프롬프트마다 새 결과 누적
);

-- DataPoint 타입 (jsonb 내부 구조)
-- { label: string, value: number, comparison?: number }
-- value: 주요 수치 (0–100, 퍼센트 또는 평균점)
-- comparison: 비교 그룹 수치 (선택)
```

### 분석 결과 렌더링 구조

```
[프롬프트 입력 패널]
  - textarea: 자연어 질문 입력
    placeholder: "어떤 인사이트가 궁금하세요? 예: 만족도가 높은 사람이 재구매를 더 선택했나요?"
  - 버튼: "분석하기" (solid, 프라이머리)
  - 로딩 중: "응답 데이터를 분석하고 있어요" + 버튼 disabled

[분석 결과 패널] — 결과 완료(done) 시 표시
  - 결과 카드 1개
    - 인과관계 문장 1개 (sentence)
    - 수치 바 1개 (data_point)
      - 라벨 + 퍼센트 숫자 + 색상 바 (width: value%)
      - comparison 있으면 비교 바도 함께 표시

[빈 상태] — 히스토리 없음, 첫 방문
  - "분석 결과가 없어요. 궁금한 점을 입력해 보세요"

[이전 분석 기록 목록] — 히스토리 1개 이상
  - 프롬프트 앞 30자 미리보기 + 날짜 + [보기] 버튼
  - [보기] 클릭 → GET /api/surveys/[id]/analysis/[aid] 호출 → 결과 패널 갱신
```

### AI 프롬프트 설계

시스템 프롬프트에 설문 구조와 집계 응답 데이터를 context로 제공하고, 인과관계를 정확한 수치로 설명하는 문장 생성을 지시한다.

```
[시스템 프롬프트]
당신은 설문 응답 분석 전문가입니다.
아래 설문 데이터를 바탕으로 창작자의 질문에 답하세요.
반드시 실제 수치와 응답자 수를 포함한 인과관계 문장으로 답하세요.
추측이나 일반론은 금지합니다.

[context — 매 요청 시 동적 구성]
설문 제목: {survey.title}
설문 설명: {survey.description}

질문 목록:
  Q1. {question.title} [타입: single_choice] [선택지: 1점, 2점, 3점, 4점, 5점]
  Q2. {question.title} [타입: multi_choice] [선택지: 알림, 대시보드, 분석, 공유]
  ...

집계된 응답 데이터 (유효 응답 {N}건):
  Q1 분포: { "1점": 3, "2점": 8, "3점": 21, "4점": 47, "5점": 42 }
  Q2 분포: { "알림": 62, "대시보드": 23, "분석": 41, "공유": 18 }
  ...

[사용자 질문]
{prompt}

[출력 형식 — JSON만 반환]
{
  "sentences": string[],       // 인과관계 문장 2–4개
  "data_points": [
    {
      "label": string,         // 예: "4점 이상 + 재구매 의향 '예'"
      "value": number,         // 예: 76  (퍼센트 또는 평균점 × 20)
      "comparison": number     // 선택: 비교 그룹 수치
    }
  ]
}
```

응답 데이터 집계 로직 (서버 사이드):

- `answers` 테이블에서 해당 설문 유효 응답(disqualified 제외) 전체 로드
- 질문 타입별 집계: single_choice/multi_choice는 선택지별 카운트, rating/scale은 평균 + 분포, text는 원문 샘플 10개
- 집계 결과를 context 문자열로 직렬화하여 시스템 프롬프트에 삽입

---

## 구현 힌트

### 탭 구조 (프론트엔드)

```tsx
// URL 쿼리 기반 탭 상태 관리
const searchParams = useSearchParams();
const tab = (searchParams.get("tab") ?? "builder") as TabType;
// 'builder' | 'responses' | 'analysis'

// 탭 전환
router.push(`/survey/${id}/edit?tab=responses`, { scroll: false });
```

### 응답 목록 조회 API (기존 활용)

현재 `/api/surveys/[id]` 에는 응답이 포함되지 않음. 응답 목록 전용 엔드포인트 추가 필요:

```
GET /api/surveys/[id]/responses
  - 인증: 창작자 본인만 (RLS)
  - 쿼리: ?page=1&limit=20&order=desc
  - 응답: { responses: ResponseRow[], total: number }

ResponseRow {
  id, created_at, completed_at,
  respondent_ip, respondent_ua,
  reward_eligibility: { status, disqualify_reason } | null,
  answer_count: number,
  answers: Answer[]   // 상세 패널용
}
```

### 어뷰징 표시 흐름

```
창작자 클릭 "어뷰징으로 표시하기"
  → 확인 모달 표시
  → 확인 클릭
  → PATCH /api/surveys/[id]/responses/[responseId]/disqualify
      body: { reason: 'creator_flagged' }
  → reward_eligibility.status = 'disqualified'
  → 낙관적 업데이트: 해당 행 상태 즉시 변경
  → 토스트: "어뷰징으로 표시했어요"
```

기존 `/api/admin/reward-eligibility/disqualify` 는 어드민 전용.  
창작자 전용 엔드포인트를 별도 신설하거나 권한 분기 처리 필요.

### 기술 스펙 요약

| 항목          | 내용                                                                     |
| ------------- | ------------------------------------------------------------------------ |
| 탭 라우팅     | URL 쿼리 파라미터 (`?tab=`) + Next.js `useSearchParams`                  |
| 응답 목록     | 신규 API: `GET /api/surveys/[id]/responses`                              |
| 어뷰징 표시   | 신규 API: `PATCH /api/surveys/[id]/responses/[rid]/disqualify`           |
| 어뷰징 점수   | 클라이언트 파생 계산 (서버 저장 안 함)                                   |
| AI 분석 실행  | 신규 API: `POST /api/surveys/[id]/analysis` — body: `{ prompt: string }` |
| 분석 히스토리 | 신규 API: `GET /api/surveys/[id]/analysis` — 목록 반환                   |
| 분석 상세     | 신규 API: `GET /api/surveys/[id]/analysis/[aid]` — 특정 결과 조회        |
| 분석 저장     | 신규 테이블: `survey_analyses` — `prompt` 컬럼 포함, UNIQUE 제약 없음    |
| 크레딧 차감   | 분석 실행 시 80 크레딧, `ai_credit_transactions` 기록                    |

---

## 예외 처리

| 케이스                               | 처리 방법                                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| 응답 탭 — draft 상태 진입 시         | 탭 비활성화 + "설문을 공개한 후 응답을 확인할 수 있어요" 안내                                     |
| 분석 탭 — published 상태 진입 시     | 잠금 UI + "설문을 마감한 후 분석을 시작할 수 있어요"                                              |
| 분석 실행 중 재클릭                  | 버튼 disabled + "응답 데이터를 분석하고 있어요" 로딩 상태                                         |
| 프롬프트 빈 문자열로 분석하기 클릭   | 버튼 disabled (프롬프트 입력 없으면 비활성) + "궁금한 점을 입력해 주세요" 인라인 안내             |
| 크레딧 부족 (80 미만)                | "분석하기" 클릭 시 즉시 차단 + 업그레이드 유도 바텀시트                                           |
| AI 분석 API 타임아웃 (>30초)         | `survey_analyses.status = 'failed'` 로 업데이트 + "일시적인 오류가 생겼어요. 다시 시도해 주세요." |
| 어뷰징 표시 API 실패                 | 낙관적 업데이트 롤백 + "잠시 후 다시 시도해 주세요" 토스트                                        |
| 동일 응답 중복 어뷰징 표시 시도      | 이미 `disqualified` → 버튼 자체가 안 보임 (렌더 조건)                                             |
| 창작자가 아닌 사용자가 URL 직접 접근 | 403 → "접근 권한이 없어요"                                                                        |
| 응답 CSV 다운로드 — 응답 0건         | 버튼 disabled + tooltip "아직 응답이 없어요"                                                      |
| 응답 상세 패널 — answers 로딩 실패   | "응답 내용을 불러오지 못했어요. 다시 시도해 주세요"                                               |

---

## 데이터 포인트 (이벤트 로깅)

| 이벤트                    | 프로퍼티                                             |
| ------------------------- | ---------------------------------------------------- |
| `builder_tab_switched`    | `{ survey_id, from_tab, to_tab }`                    |
| `response_list_viewed`    | `{ survey_id, response_count, abuse_flagged_count }` |
| `response_detail_opened`  | `{ survey_id, response_id, abuse_score }`            |
| `abuse_flag_initiated`    | `{ survey_id, response_id, abuse_score }`            |
| `abuse_flag_confirmed`    | `{ survey_id, response_id }`                         |
| `abuse_flag_cancelled`    | `{ survey_id, response_id }`                         |
| `responses_exported`      | `{ survey_id, total_rows }`                          |
| `analysis_prompted`       | `{ survey_id, prompt_length: number }`               |
| `analysis_started`        | `{ survey_id, credit_balance_before }`               |
| `analysis_completed`      | `{ survey_id, analysis_id, sentence_count: number }` |
| `analysis_history_viewed` | `{ survey_id, analysis_id }`                         |

---

## 정책 참고

- **abuse.md § 11.2**: 의심 참여는 보상 보류 가능. 창작자의 어뷰징 플래그는 `reward_eligibility.status = disqualified` 로 처리
- **abuse.md § 11.3**: Trust and fraud control come before speed — 어뷰징 취소(복구) 기능 MVP 제외 근거
- **monetization.md § 2**: 결과 분석 요약 80 크레딧 차감. Free 플랜 차단. 크레딧 부족 시 402 반환
- **survey.md**: `closed` 상태 이후 빌더 편집 불가. 분석은 closed 이후에만 허용

---

## CS 문의 예상 지점

- "어뷰징으로 표시했는데 되돌리고 싶어요": MVP에서는 어드민 수동 처리 (`/api/admin/reward-eligibility/confirm` 으로 재확정). CS 안내 문구: "관리자에게 문의해 주시면 검토 후 복구해 드릴게요"
- "분석을 실행했는데 크레딧만 차감되고 결과가 안 나와요": `survey_analyses.status = 'failed'` 확인 → 크레딧 환불 수동 처리 필요. 어드민 콘솔에서 `ai_credit_transactions` 역방향 트랜잭션 삽입
- "분석 결과에 수치가 이상하게 나와요": AI가 집계 데이터를 기반으로 생성한 결과임을 안내. 원시 응답 데이터는 응답 탭에서 직접 확인 가능. CS 에스컬레이션 불가 — "다른 질문으로 다시 분석해 보세요" 유도
- "이전에 했던 분석을 다시 보고 싶어요": 이전 분석 기록 목록에서 [보기] 버튼으로 재조회 가능. UI에서 해결되어야 할 케이스 — 기록이 안 보이면 계정/설문 불일치 여부 확인
- "응답 CSV에 개인정보가 포함되어 있어요": `respondent_ip` 마스킹 처리 확인. 실명 없음 (익명 응답). 필요 시 IP 컬럼 제외 옵션 고려
