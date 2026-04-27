---
id: "OPIN-061"
title: "빌더 설문 메타 편집 — 우측 패널 빈 상태를 인라인 폼으로 전환"
priority: "P2"
status: "done"
completed: "2026-04-18"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-design"]
created: "2026-04-18"
updated: "2026-04-18"
sprint: "W17"
policy_refs:
  - "docs/policy/survey.md#5.11.3"
  - "docs/policy/survey.md#5.4"
code_refs:
  - "src/components/builder/SurveyBuilder.tsx"
  - "src/components/builder/SurveyInfoEditModal.tsx"
  - "src/components/builder/QuestionList.tsx"
---

## 목적

빌더에서 설문 메타 정보(제목·설명·목적·태그·예상 소요시간)를 편집할 때, 하단 gear 아이콘으로 모달을 여는 대신 우측 패널 빈 상태 영역에 인라인 폼을 렌더링한다.

창작자가 빌더 진입 직후(질문 미선택 상태)에 자연스럽게 메타를 입력하고, 이후 질문을 선택하면 우측 패널이 QuestionSettings로 전환되는 흐름을 만든다.

## 현황

### 현재 구조

```
SurveyBuilder.tsx
  하단 플로팅 바
    ViewToggle
    PillIconButton (미리보기)       ← 유지
    PillIconButton (gear → 모달)    ← 제거 대상

  우측 패널 (flow 뷰에서만 표시)
    isCompensationOpen → CompensationPanel
    activeQuestionId   → QuestionSettings
    activeSectionId    → SectionSettings
    else               → "질문을 선택하면 설정이 여기에 표시됩니다" (dead space)
```

### 재사용 가능한 코드

- `SurveyInfoEditModal.tsx`: 제목·설명·목적·소요시간·태그 필드 전체 구현. 탭("기본 정보" / "모집·혜택") 포함.
- `useBuilderStore`: 모든 메타 필드 getter/setter 존재.
- `saveSurveyMeta()` (`SurveyBuilder.tsx` 257–282): PATCH 콜 이미 구현됨.
- `saveSurveyTitle()` (`SurveyBuilder.tsx` 241–253): 제목 단독 저장 구현됨.

### 문제점

1. Gear 아이콘이 하단 바에 미리보기 버튼과 함께 묻혀 있어 discoverability 낮음.
2. 모달이 캔버스를 가려 컨텍스트 스위칭 비용 발생.
3. 빌더 진입 직후 (질문 미선택) 우측 패널이 dead space.
4. 모집·혜택 탭(보상 설정)은 이미 CompensationPanel로 분리되어 있어 모달의 두 번째 탭이 중복.

## 완료 조건 (Definition of Done)

- [ ] 우측 패널 빈 상태(질문 미선택 + 섹션 미선택 + Compensation 미열림)에 `SurveyMetaPanel` 컴포넌트 렌더링
- [ ] `SurveyMetaPanel` — 제목, 설명, 목적 칩, 예상 소요시간, 태그 (프리셋 + 직접 입력) 포함
- [ ] 각 필드는 onBlur 시 자동 저장 (모달처럼 "저장하기" 버튼 없음 — 인라인 패턴)
- [ ] 제목 필드는 헤더 input과 zustand store를 통해 양방향 동기화됨
- [ ] 하단 플로팅 바에서 gear 아이콘(기본 정보 수정) PillIconButton 제거
- [ ] `SurveyInfoEditModal` 컴포넌트 — "기본 정보" 탭 콘텐츠를 `SurveyMetaPanel`로 분리 추출 (모달 자체는 유지하거나 제거 — 아래 결정 참조)
- [ ] flow 뷰에서만 우측 패널이 표시되는 현재 조건 유지 (`view === "flow" || isCompensationOpen`)
- [ ] list 뷰에서는 `SurveyMetaPanel`을 별도 위치에 접근 가능하게 처리 (아래 결정 참조)
- [ ] TypeScript strict 통과
- [ ] npm run build 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 레퍼런스 패턴

| 서비스       | 패턴                                                             | OPINION 적용 포인트                       |
| ------------ | ---------------------------------------------------------------- | ----------------------------------------- |
| Google Forms | 우측 패널: 폼 설정 탭 (기본값이 설정 패널)                       | 빌더 진입 시 우측 패널 = 메타 편집 기본값 |
| Typeform     | 좌측 패널 상단에 설문 제목 인라인 편집, 설정은 우측              | 제목을 헤더와 패널 양쪽에서 편집 가능     |
| Notion       | 페이지 제목 클릭 즉시 편집, 사이드바에 메타 필드                 | 인라인 편집 + onBlur 자동 저장            |
| SurveyMonkey | 우측 패널: Design / Options 탭 전환, 질문 미선택 시 폼 설정 표시 | 선택 상태에 따른 패널 콘텐츠 전환 패턴    |

### 핵심 UX 결정

- **패널 vs 모달**: 우측 패널 인라인 폼 선택 — 캔버스를 가리지 않고 컨텍스트 유지. 모달은 보상 설정(CompensationPanel)과 중복 없는 시점에만 허용.
- **저장 트리거**: onBlur 자동 저장. "저장하기" 버튼 없음 — Notion 패턴. 실패 시 인라인 에러 + 저장 점표시(header 좌측 warning dot)로 피드백.
- **제목 동기화**: 헤더 input과 패널 input 모두 `surveyTitle` zustand 상태를 바라보며 onBlur 시 `saveSurveyTitle()` 호출 — 동일 로직, 중복 없음.
- **list 뷰 처리**: list 뷰에서는 우측 패널이 없으므로 하단 바의 별도 버튼(기어 아이콘 대신 "설문 정보" 텍스트 버튼)으로 접근. 단, MVP에서는 flow 뷰에서만 접근 가능해도 허용 (policy 5.11 Step 2는 Builder 담당이며 뷰 전환은 선택 사항).
- **모달 존치 여부**: `SurveyInfoEditModal`의 "모집·혜택" 탭은 CompensationPanel이 담당하므로, "기본 정보" 탭 역할은 `SurveyMetaPanel`이 완전 대체. 모달은 삭제하거나 접근 경로를 제거. 모달 자체 파일은 사용처가 없어지므로 삭제.
- **모집·혜택 (보상 설정)**: 현재 CompensationPanel이 이미 담당 — 변경 없음. SurveyMetaPanel에 포함하지 않음.

### UX Writing (확정 문구)

| 상황                   | 문구                                                                      |
| ---------------------- | ------------------------------------------------------------------------- |
| 패널 섹션 헤더         | "설문 정보"                                                               |
| 제목 플레이스홀더      | "설문 제목을 입력해 주세요"                                               |
| 설명 플레이스홀더      | "설문에 대한 설명을 입력해 주세요"                                        |
| 목적 섹션 서브텍스트   | "어떤 목적으로 만드는지 선택하면 더 잘 맞는 질문을 추천해 드릴 수 있어요" |
| 목적 선택 힌트         | "(선택)"                                                                  |
| 소요시간 플레이스홀더  | "자동 계산"                                                               |
| 태그 한도 힌트         | "최대 5개까지 추가할 수 있어요"                                           |
| 태그 입력 플레이스홀더 | "태그를 직접 입력해 보세요"                                               |
| 태그 15자 초과 에러    | "태그는 15자 이내로 입력해 주세요"                                        |
| 태그 특수문자 에러     | "특수문자는 사용할 수 없어요"                                             |
| 자동 저장 실패 에러    | "저장하지 못했어요. 잠시 후 다시 시도해 주세요"                           |
| 저장 중 dot (헤더)     | warning dot (기존 로직 재사용)                                            |

## 구현 힌트

### 신규 컴포넌트: `SurveyMetaPanel`

파일: `src/components/builder/SurveyMetaPanel.tsx`

```typescript
// 역할: 우측 패널 빈 상태에서 렌더링되는 인라인 메타 편집 폼
// 저장: 각 필드 onBlur → 개별 또는 일괄 PATCH
// 데이터: useBuilderStore getter/setter 직접 사용
// 스타일: SurveyInfoEditModal의 Field 패턴 재사용, 모달 헤더/푸터 없음

interface SurveyMetaPanelProps {
  surveyId: string;
  onSave: () => void; // saveSurveyTitle / saveSurveyMeta 중 적절한 것을 호출
}
```

포함 필드:

1. 제목 (input, onBlur → saveSurveyTitle)
2. 설명 (textarea, onBlur → saveSurveyMeta)
3. 목적 (칩 선택, onChange → setSurveyPurpose → saveSurveyMeta)
4. 예상 소요 시간 (number input, onBlur → saveSurveyMeta)
5. 태그 (프리셋 칩 + 직접 입력, onChange → setSurveyTags → saveSurveyMeta)

미포함 (CompensationPanel이 담당):

- 보상 타입 / 보상 금액 / 당첨 인원
- 목표 참여자 수 / 마감일

### SurveyBuilder.tsx 변경 포인트

1. 우측 패널 `else` 분기 (600–606줄): `SurveyMetaPanel` 렌더링으로 교체

```tsx
// Before
) : (
  <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center">
    <p className="text-sm" style={{ color: COLOR.TEXT_DISABLED }}>
      질문을 선택하면
      <br />
      설정이 여기에 표시됩니다
    </p>
  </div>
)}

// After
) : surveyId ? (
  <div className="flex-1 overflow-y-auto">
    <SurveyMetaPanel
      surveyId={surveyId}
      onSave={saveSurveyMeta}
      onTitleSave={saveSurveyTitle}
    />
  </div>
) : null
```

2. 하단 플로팅 바에서 gear PillIconButton 제거 (638–653줄)

3. `isInfoEditOpen` state 및 `SurveyInfoEditModal` import/렌더 제거 (132줄, 657–664줄)

### SurveyInfoEditModal.tsx

모든 접근 경로 제거 후 파일 삭제. `Field` 유틸 컴포넌트는 `SurveyMetaPanel.tsx` 또는 별도 `builder-field.tsx`로 이동.

### 상태 로직 (제목 동기화)

```
헤더 input.onBlur → saveSurveyTitle(value)
SurveyMetaPanel 제목 input.onBlur → saveSurveyTitle(value)

두 input 모두 value={surveyTitle} (zustand 상태)
onChange → setSurveyTitle (zustand만 업데이트, API 미호출)
onBlur → saveSurveyTitle (API 호출)
```

### 이벤트 로깅 포인트

| 이벤트                       | 로그 항목                         |
| ---------------------------- | --------------------------------- |
| 메타 패널 포커스 (진입 감지) | survey_id, field_name             |
| 목적 칩 선택                 | survey_id, purpose                |
| 태그 추가                    | survey_id, tag, total_tag_count   |
| 저장 실패                    | survey_id, field_name, error_code |

## 예외 처리

| 케이스                              | 처리 방법                                                             |
| ----------------------------------- | --------------------------------------------------------------------- |
| 제목 비워두고 blur                  | 저장 미호출, 인라인 에러: "설문 제목을 입력해 주세요"                 |
| saveSurveyMeta API 실패             | 헤더 warning dot 유지 + 패널 하단 인라인 에러 메시지                  |
| Published 상태에서 메타 편집        | 제목·설명·태그는 편집 허용 (survey.md 5.4 — 설명/도움말 편집 허용)    |
| Published + 응답 존재 상태에서 편집 | 동일 — 메타 필드(제목 제외 주의)는 응답 데이터 구조에 영향 없음       |
| 태그 15자 초과 시 Enter             | addTag 차단 + 인라인 에러 (기존 로직 동일)                            |
| list 뷰에서 우측 패널 없음          | MVP: list 뷰 진입 시 flow 뷰 안내 토스트 없음. 별도 접근 경로 미제공. |

## 빈 상태 / 로딩 상태

- 패널 마운트 직후 로딩 없음 — `useBuilderStore`에서 직접 읽으므로 별도 fetch 불필요
- 저장 중: 헤더의 기존 warning dot 활용 (isSaving)
- 필드 blur 직후 저장 성공: 별도 토스트 없음 (silent autosave — Notion 패턴)
- 저장 실패만 피드백 노출

## Admin 수동 처리 필요 여부

없음. 전적으로 창작자 셀프서비스.

## 정책 참고

- **survey.md 5.4 (Edit Policy)**: Published + 응답 존재 시에도 설명/태그/도움말 편집 허용. 제목은 minor wording cleanup에 해당하면 허용.
- **survey.md 5.11.3 (Step 2)**: Builder에서 estimated_time은 유지 (콘텐츠 파악 후 설정 가능한 값).
- **survey.md 5.11.3 (Step 1 → Step 2 이동)**: description, tag, end_date, target_participant_count는 원칙상 Step 1으로 이동해야 하나, 빌더 내 편집 경로는 병렬로 제공 가능.

## CS 문의 예상 지점

- "설문 제목을 바꿨는데 저장이 안 돼요": onBlur 패턴이므로 blur 없이 이탈 시 미저장. 대응: "제목 입력 후 다른 곳을 클릭하면 자동으로 저장돼요."
- "설정 아이콘이 사라졌어요": 우측 패널 → 질문 선택 해제 또는 빌더 최초 진입 시 패널에서 직접 편집 가능. 안내 FAQ 업데이트 필요.
