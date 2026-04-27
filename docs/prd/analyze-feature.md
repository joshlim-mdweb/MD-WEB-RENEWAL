# Analyze Feature PRD — 조건부 교차 분석

<!-- version: 1.0.0 | 최초 작성: 2026-04-07 | 최종 수정: 2026-04-07 -->

작성자: OPIN_PM  
상태: 기획 완료 — opin-design UX 검증 필요

---

## 1. 기능 정의

설문 리포트 화면에서 응답자 그룹을 조건으로 필터링해 특정 질문의 응답 분포를 비교하는 **조건부 교차 분석(Cross-tabulation / Conditional Filter Analysis)** 도구.

사용자 목표: "A 질문에서 특정 답변을 선택한 사람들이 B 질문에서는 어떻게 답했는가"를 데이터로 확인해, 응답자 세그먼트별 패턴과 인사이트를 발견한다.

---

## 2. Premise Challenge (기능 설계 전 전제 점검)

1. **문제 재구성**: 전체 응답 분포(현재 리포트)만으로도 결론을 낼 수 없는가? → 맞다. "전체의 60%가 A 선택" 보다 "20대 응답자 중 80%가 A 선택"이 훨씬 실행 가능한 인사이트를 준다. 교차 분석은 세그먼트 발견에 필수.
2. **실제 고통**: 설문 5개 이상 진행 경험이 있는 설문 제작자는 "특정 그룹만 따로 보고 싶다"는 요구를 항상 갖는다. 현재 SurveyReportClient는 전체 집계만 보여줘 이 니즈를 전혀 충족하지 못한다.
3. **기존 패턴**: `page.tsx`의 `aggregateAnswers()`는 서버에서 JS로 집계. 동일 구조로 필터 조건을 추가하면 재사용 가능. `answers` 배열 전체를 이미 메모리에 가지고 있어 클라이언트 사이드 필터링도 가능하나, 응답 수 증가 시 한계가 있어 API 레이어에서 처리한다.
4. **배포 경로**: 기존 `/survey/[id]/report` 페이지에 탭 또는 패널로 추가. 별도 URL 불필요.
5. **MVP 범위**: 단일 선택(multiple_choice, dropdown) 질문 타입 + 조건 1개 + 하단 슬라이드 패널. 다중 조건 AND/OR, 텍스트/척도 타입, AI 인사이트는 추후.

---

## 3. UX Flow

### 3-1. 진입점

현재 `SurveyReportClient`는 질문 카드를 세로로 나열하는 단일 뷰다.  
Analyze 기능은 **기존 뷰 위에 레이어로 추가**하며, 진입 방식은 두 가지를 지원한다.

| 진입 방법                  | 트리거                                          | 비고                                 |
| -------------------------- | ----------------------------------------------- | ------------------------------------ |
| 질문 카드 클릭             | 카드 우상단 "분석하기" 버튼 또는 카드 전체 클릭 | 메인 진입. 카드에 hover 시 버튼 노출 |
| 리포트 상단 "교차 분석" 탭 | 탭 클릭 후 질문 목록에서 선택                   | 서브 진입. 탭 UI는 Phase 2           |

MVP는 **질문 카드 hover시 "분석하기" 버튼 노출** 방식만 구현한다.  
버튼 클릭 → 해당 질문을 분석 대상으로 설정하며 하단 패널이 슬라이드업.

### 3-2. 작업창 (Analysis Panel) UX

**패널 위치: 하단 슬라이드업 (Bottom Sheet)**

선택 이유:

- 리포트 페이지가 세로 스크롤 구조 → 우측 사이드패널은 모바일에서 레이아웃 깨짐
- 분석 결과는 별도 공간에서 집중해서 보는 것이 자연스러움
- 모바일 응답자가 Creator가 아니므로 데스크탑 기준 UX 설계지만 반응형 고려

**패널 구조:**

```
┌─────────────────────────────────────────────────────────┐
│  [분석 대상 질문 제목]                     [닫기 ×]      │
│  ──────────────────────────────────────────────────── │
│  전체 응답 기준 분포                                      │
│  ┌─────────────────────────────────────┐               │
│  │ 바 차트 (선택지별 count + %)         │               │
│  └─────────────────────────────────────┘               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ + 조건 추가                                       │   │
│  │   [조건 질문 선택 ▼]에서 [답변 선택 ▼]라고 답한  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [조건 적용 결과 — 필터된 응답자 수 / 전체 응답자 수]     │
│  ┌─────────────────────────────────────┐               │
│  │ 바 차트 (필터 후 선택지별 count + %)  │               │
│  └─────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

**패널 높이:**

- 기본: 화면 높이의 55% (조건 미추가 상태)
- 조건 추가 후: 화면 높이의 70%까지 자동 확장
- 최대: 화면 높이의 85%

### 3-3. 교차 분석 쿼리 빌더

```
[조건 질문 선택 ▼] 에서 [답변 선택 ▼] 라고 한 응답자
→ [현재(분석 대상) 질문]의 답변 분포를 보여줘요
```

**조건 질문 선택 드롭다운:**

- 현재 분석 대상 질문 제외
- 조건으로 사용 가능한 타입만 표시 (multiple_choice, dropdown — MVP)
- 선택지 없는 질문(short_text, long_text, endpoint) 비활성 처리 + 툴팁: "이 타입은 조건으로 사용할 수 없어요"

**답변 선택 드롭다운:**

- 선택한 조건 질문의 실제 응답 옵션만 표시
- 조건 질문 미선택 시 비활성

**조건 개수 제한 (MVP):**

- 최대 1개 (AND/OR 다중 조건은 추후)
- 조건 초기화: "조건 없애기" 텍스트 버튼

### 3-4. 결과 표시

**기본 분포 (조건 없음):**

- 수평 바 차트
- 각 선택지: 선택지 텍스트 / count / 비율(%)
- 가장 많이 선택된 항목 강조 (ACCENT 색상)

**필터 적용 후:**

- 패널 상단에 필터 요약 뱃지: "[질문명] = [답변값]" + × 버튼
- "조건에 맞는 응답자 N명 / 전체 M명 (X%)"
- 필터된 응답 분포 차트
- 전체 분포와 필터 분포를 동시에 보여주는 비교 뷰 (추후 — MVP는 필터 후 단독 표시)

**숫자 표기 규칙:**

- 응답 수: `N명`
- 비율: `N%` (소수점 1자리)
- 샘플 소규모 경고: 응답 수 5 미만 시 "응답이 적어 참고용으로만 활용해요" 안내 (report.md 7.5 정책 반영)

---

## 4. 질문 타입별 지원 범위

| 질문 타입                   | 조건으로 사용 가능       | 분석 대상 가능 | MVP 포함 | 비고                             |
| --------------------------- | ------------------------ | -------------- | -------- | -------------------------------- |
| 단일 선택 (multiple_choice) | ✅                       | ✅             | ✅       |                                  |
| 드롭다운 (dropdown)         | ✅                       | ✅             | ✅       | multiple_choice와 동일 집계 구조 |
| 다중 선택 (checkbox)        | ✅ (선택지 중 하나 포함) | ✅             | 추후     | "X를 포함한 응답자" 로직 필요    |
| 척도 (scale)                | ✅ (값 범위 선택)        | ✅             | 추후     | 범위 슬라이더 UI 필요            |
| 별점 (grade)                | ✅ (값 선택)             | ✅             | 추후     |                                  |
| 순위 (ranking)              | ❌                       | ✅             | 추후     | 집계 구조 복잡                   |
| 단답 (short_text)           | ❌                       | ❌             | ❌       | 키워드 분석은 AI 기능으로 추후   |
| 서술 (long_text)            | ❌                       | ❌             | ❌       |                                  |
| 마무리 (endpoint)           | ❌                       | ❌             | ❌       | 응답 없음                        |

---

## 5. API 설계

### 신규 엔드포인트: `GET /api/surveys/[id]/analyze`

기존 `/api/surveys/[id]/report` 는 **전체 집계** 전용으로 유지.  
교차 분석은 **별도 엔드포인트**로 분리 — 쿼리 파라미터 조합이 복잡하고 캐싱 전략이 다름.

**인증:** 설문 creator 전용 (report와 동일)

**Request:**

```
GET /api/surveys/[id]/analyze
  ?target_question_id={uuid}          -- 분석 대상 질문 (필수)
  &filter_question_id={uuid}          -- 조건 질문 (선택)
  &filter_answer_value={string}       -- 조건 답변값 (filter_question_id 있을 때 필수)
```

**Response (200):**

```typescript
{
  target: {
    question_id: string;
    question_title: string;
    question_type: QuestionType;
    options: string[] | null;
  };
  filter: {
    question_id: string;
    question_title: string;
    answer_value: string;
  } | null;                             // 조건 없으면 null
  result: {
    total_filtered: number;             // 조건에 맞는 응답자 수 (조건 없으면 전체와 동일)
    total_all: number;                  // 전체 응답자 수
    distribution: Array<{
      value: string;                    // 선택지 텍스트
      count: number;
      percentage: number;              // 소수점 1자리
    }>;
  };
  meta: {
    is_small_sample: boolean;          // total_filtered < 5 이면 true
  };
}
```

**에러 응답:**

| 상황                                               | HTTP | error 코드                   |
| -------------------------------------------------- | ---- | ---------------------------- |
| 미인증                                             | 401  | `unauthorized`               |
| 설문 없음 / 타인 설문                              | 404  | `survey_not_found`           |
| target_question_id 없음                            | 422  | `target_question_required`   |
| 지원 안 되는 질문 타입                             | 422  | `unsupported_question_type`  |
| filter_question_id 있는데 filter_answer_value 없음 | 422  | `filter_answer_required`     |
| 조건 질문 = 분석 대상 질문 동일                    | 422  | `filter_cannot_equal_target` |
| 서버 오류                                          | 500  | `internal_error`             |

**서버 사이드 쿼리 전략:**

```sql
-- 조건 없음: target 질문의 answers만 집계
SELECT a.value, COUNT(*) as count
FROM answers a
JOIN responses r ON r.id = a.response_id
WHERE r.survey_id = $survey_id
  AND a.question_id = $target_question_id
GROUP BY a.value;

-- 조건 있음: filter 조건에 맞는 response_id 집합을 서브쿼리로 추출 후 교차
SELECT a.value, COUNT(*) as count
FROM answers a
WHERE a.response_id IN (
  SELECT af.response_id
  FROM answers af
  JOIN responses r ON r.id = af.response_id
  WHERE r.survey_id = $survey_id
    AND af.question_id = $filter_question_id
    AND af.value::text = $filter_answer_value
)
AND a.question_id = $target_question_id
GROUP BY a.value;
```

Supabase JS 클라이언트는 위 패턴을 직접 지원하지 않으므로 **두 번의 쿼리로 분리** 구현:

1. 조건 질문에서 `filter_answer_value`를 선택한 `response_id` 목록 조회 (`.in` 필터)
2. 해당 `response_id` 목록을 사용해 target 질문의 answers 조회

비용: 최대 쿼리 2회 (조건 있을 때). 조건 없으면 1회.

---

## 6. 상태 정의 (State Map)

| 상태                       | 트리거                             | UI                                        | UX Copy                                                 |
| -------------------------- | ---------------------------------- | ----------------------------------------- | ------------------------------------------------------- |
| 패널 닫힘                  | 기본                               | 질문 카드에 hover 시 "분석하기" 버튼 노출 | —                                                       |
| 패널 열림 — 기본 분포 로딩 | "분석하기" 클릭                    | 패널 슬라이드업 + 스켈레톤                | "응답 데이터를 불러오는 중이에요"                       |
| 패널 열림 — 기본 분포 표시 | API 성공                           | 전체 분포 바 차트                         | "전체 {N}명의 응답 분포"                                |
| 패널 열림 — 조건 추가 중   | "+ 조건 추가" 클릭                 | 드롭다운 펼쳐짐                           | "조건 질문을 선택해 주세요"                             |
| 패널 열림 — 조건 적용 로딩 | 조건 확정                          | 기존 차트 유지 + 아래에 로딩 스켈레톤     | "조건에 맞는 응답을 찾는 중이에요"                      |
| 패널 열림 — 조건 적용 결과 | 필터 API 성공                      | 필터 뱃지 + 조건 분포 차트                | "{N}명 중 {M}명이 이 조건에 해당해요"                   |
| 결과 없음                  | total_filtered === 0               | 빈 상태 일러스트                          | "이 조건에 해당하는 응답이 없어요"                      |
| 소규모 샘플 경고           | is_small_sample === true           | 차트 표시 + 안내 뱃지                     | "응답이 적어 참고용으로만 활용해요"                     |
| 에러                       | API 실패                           | 에러 인라인 메시지                        | "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." |
| 지원 안 되는 타입 클릭     | endpoint/text 질문 "분석하기" 클릭 | 버튼 비활성                               | "이 질문은 분석할 수 없어요" (disabled tooltip)         |

**패널 닫기 트리거:**

- 우상단 × 버튼 클릭
- 패널 바깥 오버레이 클릭 (딤처리 없이 스크롤 허용)
- ESC 키

---

## 7. UX Writing (확정 문구)

| 위치                  | 문구                                                    |
| --------------------- | ------------------------------------------------------- |
| 질문 카드 hover 버튼  | "분석하기"                                              |
| 패널 헤더             | "[질문 제목]"                                           |
| 기본 분포 섹션 레이블 | "전체 응답 분포"                                        |
| 조건 추가 버튼        | "+ 조건 추가"                                           |
| 조건 빌더 설명        | "[질문 선택]에서 [답변 선택]이라고 한 응답자"           |
| 조건 초기화           | "조건 없애기"                                           |
| 필터 결과 섹션 레이블 | "조건 적용 결과"                                        |
| 필터 응답자 수        | "전체 {M}명 중 {N}명 ({X}%)"                            |
| 빈 상태               | "이 조건에 해당하는 응답이 없어요"                      |
| 소규모 샘플           | "응답이 적어 참고용으로만 활용해요"                     |
| 지원 불가 타입        | "이 질문은 분석할 수 없어요"                            |
| 로딩                  | "응답 데이터를 불러오는 중이에요"                       |
| 에러                  | "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." |

---

## 8. 이벤트 로깅 포인트

| 이벤트명                 | 트리거 시점          | 주요 파라미터                                                          |
| ------------------------ | -------------------- | ---------------------------------------------------------------------- |
| `analyze_panel_opened`   | "분석하기" 클릭      | survey_id, question_id, question_type                                  |
| `analyze_panel_closed`   | 패널 닫기            | survey_id, question_id, had_filter                                     |
| `analyze_filter_added`   | 조건 확정            | survey_id, target_question_id, filter_question_id, filter_answer_value |
| `analyze_filter_cleared` | "조건 없애기" 클릭   | survey_id, question_id                                                 |
| `analyze_result_viewed`  | 필터 결과 표시 완료  | survey_id, total_filtered, total_all, is_small_sample                  |
| `analyze_empty_result`   | total_filtered === 0 | survey_id, filter_question_id, filter_answer_value                     |

---

## 9. 운영 및 CS 고려사항

**Admin 수동 처리 필요 없음** — 전적으로 읽기(Read-only) 기능. 데이터 변형 없음.

**CS 문의 발생 가능 지점:**

1. "결과가 이상해요" → 소규모 샘플 경고 미확인 케이스. is_small_sample 안내 강화.
2. "조건을 추가했는데 응답이 없대요" → 실제로 해당 조건 응답자가 0명인 경우. 빈 상태 메시지로 충분히 안내.
3. "분석 버튼이 안 눌려요" → endpoint/text 타입 질문 클릭. disabled 상태 + 툴팁으로 안내.

**응답 수 0인 설문에서의 처리:**

- 리포트 페이지 진입은 가능
- "분석하기" 버튼 비활성화 (전체 응답 0개이면 분석 무의미)
- 버튼 비활성 tooltip: "응답이 없어 분석할 수 없어요"

---

## 10. MVP vs 추후 범위

### MVP에 포함 (Phase 1)

- 단일 조건 교차 분석 (AND/OR 없음)
- 지원 타입: multiple_choice, dropdown (조건 + 분석 대상 모두)
- 하단 슬라이드업 패널
- 수평 바 차트 (count + %)
- 소규모 샘플 경고 (is_small_sample)
- 전체 응답 수 대비 필터 응답 수 표시

### 추후 (Phase 2+)

| 기능                                        | 이유                                                          |
| ------------------------------------------- | ------------------------------------------------------------- |
| 다중 조건 AND/OR                            | UI 복잡도 증가 — 수요 검증 후                                 |
| checkbox, scale, grade, ranking 타입 지원   | 집계 로직 복잡 + UI 차별화 필요                               |
| 기본 분포 vs 필터 분포 비교 차트 (오버레이) | 디자인 리소스 필요                                            |
| 분석 결과 PNG 내보내기                      | 수요 검증 후                                                  |
| AI 인사이트 자동 생성                       | 크레딧 소비 기능 — 구독 플랜 연동 필요 (monetization.md 참고) |
| 분석 조건 저장 / 공유                       | 협업 기능으로 Team 플랜과 묶어 기획                           |

---

## 11. 구현 우선순위 및 담당

| 단계 | 담당    | 작업                                                                     | 선행 조건          |
| ---- | ------- | ------------------------------------------------------------------------ | ------------------ |
| 1    | opin-be | `GET /api/surveys/[id]/analyze` API 구현                                 | —                  |
| 2    | opin-fe | `SurveyReportClient`에 "분석하기" 버튼 추가 (hover 노출)                 | API 완료           |
| 3    | opin-fe | `AnalysisPanel` 바텀 시트 컴포넌트 구현                                  | API 완료           |
| 4    | opin-fe | 조건 빌더 UI (드롭다운 × 2) + 필터 결과 표시                             | 패널 컴포넌트 완료 |
| 5    | opin-qa | 교차 분석 정확도 검증 + 엣지케이스 (응답 0, 소규모 샘플, 지원 불가 타입) | FE 완료            |

**FE 구현 시 주의사항:**

- `SurveyReportClient`는 현재 Server Component 데이터를 props로 받는 Client Component
- `AnalysisPanel`은 `useState`로 패널 open/target question 상태 관리
- API 호출은 `useCallback` + `useState`로 클라이언트 사이드 fetch (SWR/React Query 미사용)
- 패널 open 시 기존 리포트 스크롤은 유지 (body scroll lock 금지 — 리포트를 보면서 패널도 보는 UX)

**BE 구현 시 주의사항:**

- 기존 `GET /api/surveys/[id]/report` 변경 금지 — 별도 route 파일 신규 생성
- Supabase JS 클라이언트로 raw SQL 없이 2-step 쿼리 패턴 사용 (5.API 설계 참고)
- `filter_answer_value`는 URL query param으로 전달 — checkbox 타입 추후 지원 시 배열 인코딩 고려
- 신규 API 완료 즉시 `docs/api/surveys.md` 업데이트 필수 (api.md 규칙)

---

## 12. QA 체크리스트

### 정확도 검증

- [ ] 조건 없음: 전체 집계가 기존 리포트와 일치하는가
- [ ] 조건 있음: 수동 계산값과 API 응답값 일치 확인
- [ ] total_filtered + (조건 불일치) = total_all 검증
- [ ] percentage 합계 100% 허용 오차 ±0.1% 이내
- [ ] is_small_sample: total_filtered < 5 일 때 true 반환

### 경계값 테스트

- [ ] 응답 0개 설문: "분석하기" 버튼 비활성
- [ ] total_filtered === 0: 빈 상태 UI 표시
- [ ] 질문 1개짜리 설문: 조건 드롭다운에 선택 가능한 질문 없음 상태 처리
- [ ] 분석 대상 = 조건 질문 동일: 422 에러 + UX 차단

### 보안

- [ ] 다른 유저의 survey_id로 요청 시 404 반환 (403 오라클 방지)
- [ ] 미인증 요청 시 401 반환
- [ ] filter_answer_value SQL 인젝션 불가 (Supabase parameterized query 사용 확인)

### UX

- [ ] 패널 열림/닫힘 애니메이션 자연스러운가
- [ ] 패널 열려 있을 때 리포트 스크롤 가능한가
- [ ] 로딩 중 스켈레톤 레이아웃 shift 없는가
- [ ] 에러 후 "다시 시도하기" 버튼 동작하는가
