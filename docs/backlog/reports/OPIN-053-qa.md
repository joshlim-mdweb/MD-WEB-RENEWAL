---
ticket_id: "OPIN-053"
date: "2026-04-12"
qa_agent: "opin-qa"
result: "PARTIAL"
loop_count: 1
---

## QA 리포트

**티켓:** OPIN-053 — 설문 생성 진입점 3-option 플로우
**결과:** PARTIAL
**루프:** 1회차

---

## 완료 조건 체크

| 조건                                                       | 결과   | 비고                                                                                      |
| ---------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| PageState 전이 흐름 (select → prompt/url/analyzing/result) | ✅     | 코드상 전이 정확히 구현됨                                                                 |
| 에러 핸들링 — 각 상태에서 올바른 substate로 복귀           | ✅     | 503/non-ok/catch 모두 처리                                                                |
| UX Writing 해요체 준수                                     | ✅     | 전체 한국어 문구 해요체 적용                                                              |
| 버튼 텍스트 ~하기 형태                                     | ⚠️     | 일부 미준수 (이슈 #1)                                                                     |
| solid 1개 제한                                             | ⚠️     | result 화면에서 solid가 유일하나, select 화면에서 solid 미사용 — 규칙 해석 모호 (이슈 #2) |
| any 타입 없음                                              | ✅     | 타입 캐스트는 as 기반이나 모두 인터페이스 명시                                            |
| 빈 텍스트 제출 방어 (prompt)                               | ✅     | trimmed 체크 후 promptError 표시                                                          |
| 유효하지 않은 URL 제출 방어                                | ✅     | isValidUrl() 클라이언트 + API 서버 이중 검증                                              |
| 직접 만들기 클릭 중 다른 카드 disabled                     | ✅     | isCreatingBlank로 모든 SelectCard disabled 처리                                           |
| result 화면에서 linkPreview null일 때 1-column             | ✅     | gridTemplateColumns 조건 분기 정확함                                                      |
| previousSubstate에 따른 뒤로가기 텍스트 분기               | ✅     | "다시 입력하기" / "다시 분석하기" 분기                                                    |
| source_type="prompt"일 때 URL 검증 건너뛰기                | ✅     | API 라우트에서 sourceType 분기 후 URL 검증 생략                                           |
| TypeScript strict                                          | ✅     | any 없음, 캐스트 안전                                                                     |
| npm run build                                              | 미확인 | 정적 분석만 수행 (빌드 미실행)                                                            |

---

## 발견된 이슈

### 버그 (FAIL 원인)

없음 (블로킹 버그 없음)

### 미완성 / 규칙 불일치 항목

**이슈 #1 — Medium: 버튼 텍스트 규칙 불일치 2건**

| 위치                      | 현재 텍스트          | 규칙 준수 텍스트                             | 근거                                                                                                                                                    |
| ------------------------- | -------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prompt 화면, neutral 버튼 | "다른 방법 선택하기" | "이전으로 돌아가기" 또는 "선택으로 돌아가기" | ux-writing.md: 버튼은 동작을 명확히. "다른 방법 선택하기"는 사용자가 뭘 하는지보다 어디로 가는지 표현. 단, 기능상 문제는 없음 — Low 심각도로 조정 가능. |
| url 화면, neutral 버튼    | "다른 방법 선택하기" | 동일                                         | 동일 이유                                                                                                                                               |

참고: "다른 방법 선택하기"는 "어디로 이동하는지"가 명확해 실사용 맥락에서 이해 가능. button.md 규칙(네비게이션형 → "~보기", "~으로 가기") 관점에서는 "선택 화면으로 돌아가기"가 더 정확. 팀 판단 필요.

**이슈 #2 — Low: select 화면 solid 버튼 없음**

select 화면의 "직접 만들기"는 `SelectCard` (button 엘리먼트, 커스텀 스타일)로 구현되어 있고 `Button` 컴포넌트가 아님. button.md 기준 "가장 중요한 단 하나의 액션"인 solid가 select 화면에 없는 상태.

현재 3개 SelectCard가 동등한 위계로 노출됨 — UX 의도(사용자가 자유롭게 선택)라면 허용 가능. 단, button.md 규칙 문자대로라면 가장 추천하는 옵션("AI로 만들기", badge: "추천")에 solid 위계를 주는 것이 일관성 있음. SelectCard 컴포넌트 구조상 Button 컴포넌트와 분리된 시스템이므로 규칙 적용 범위 명확화 필요.

**이슈 #3 — Low: result 화면 뒤로가기 버튼이 raw `<button>`**

result 화면의 뒤로가기는 Button 컴포넌트가 아닌 raw `<button>` 사용. 접근성 상 `aria-label`이 없음. 텍스트("다시 입력하기" / "다시 분석하기")가 있어 스크린리더에 전달되므로 critical은 아님.

**이슈 #4 — Low: QuestionEditItem 삭제 버튼 — danger 확인 없음**

질문 삭제 버튼(X 아이콘)은 즉시 삭제 실행. button.md: "danger without confirmation" 금지 패턴. 단, result 화면은 아직 저장 전 단계이고 삭제가 되돌릴 수 있으므로 실질적 위험은 낮음.

**이슈 #5 — Low: API 에러 메시지 마침표 일관성**

```
"서비스를 준비하고 있어요. 곧 이용할 수 있어요"  ← 마침표 없음
"일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요"  ← 마침표 없음
```

ux-writing.md 규칙상 해요체는 문장 종결로 충분. 마침표 일관성은 스타일 가이드 확정 필요.

**이슈 #6 — Low: handleCreate에서 질문 직렬 fetch**

```typescript
for (const q of validQuestions) {
  await fetch(`/api/surveys/${id}/questions`, { ... });
}
```

질문 수만큼 직렬 API 호출 발생. 6개 질문이면 6번 순차 요청. 현재 MVP 범위에서 허용 가능하나 배치 API 도입 시 개선 필요.

---

## PM에게 전달 사항

**result: PARTIAL** — 핵심 플로우 동작 정상, 블로킹 버그 없음. 이슈는 모두 Low-Medium 수준.

완료된 것:

- PageState 전이 (select → prompt/url → analyzing → result) 정확히 구현
- 에러 핸들링 (503, non-ok, catch) 모든 경로 처리 + 올바른 substate 복귀
- previousSubstate 기반 뒤로가기 텍스트 분기
- 빈 입력 / 잘못된 URL 방어 (클라이언트 + 서버 이중)
- disabled 처리 (isCreatingBlank 중 카드 전체 차단)
- linkPreview null → 1-column 레이아웃
- source_type="prompt" → URL 검증 건너뜀 확인
- 타입 안전성 (any 없음)

미완성 / 개선 권장:

- 이슈 #1: "다른 방법 선택하기" 버튼 텍스트 — PM이 "이전으로 돌아가기"로 변경 여부 결정
- 이슈 #2: select 화면 SelectCard 위계 — solid 규칙 적용 범위 명확화
- 이슈 #4: QuestionEditItem 삭제 확인 여부 — 저장 전 단계이므로 생략 가능하면 예외 명시
- 이슈 #6: 질문 생성 직렬 fetch → 배치 API 후속 티켓 고려

**권장:** 이슈 #1(버튼 텍스트)만 수정 후 PASS 처리 가능. 나머지는 별도 개선 티켓 분리 권장.

---

## Regression 체크

| 영향 범위                                 | 상태                                                   |
| ----------------------------------------- | ------------------------------------------------------ |
| `/api/analyze` (기존 URL 경로)            | 정상 — source_type 기본값 "url"로 폴백, 하위 호환 유지 |
| `/api/surveys` POST                       | 정상 — 기존 인터페이스 변경 없음                       |
| `/api/link-preview`                       | 정상 — 호출 방식 변경 없음                             |
| Survey 빌더 편집 화면 (/survey/[id]/edit) | 정상 — 진입점만 변경, 빌더 코드 미수정                 |
