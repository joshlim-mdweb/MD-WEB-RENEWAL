---
id: "OPIN-060"
title: "설문 응답 페이지 — 질문별 페이지네이션 + 섹션 전환 화면"
priority: "P2"
status: "ready"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-design"]
created: "2026-04-18"
updated: "2026-04-18"
sprint: "W17"
policy_refs:
  - "docs/policy/survey.md"
  - "docs/policy/shared.md"
code_refs:
  - "src/app/(main)/survey/[id]/respond/SurveyRespondClient.tsx"
  - "src/app/(main)/survey/[id]/respond/page.tsx"
  - "src/lib/types/survey.ts"
---

## 목적

응답자가 설문 질문을 한 번에 하나씩 보면서 집중해서 답할 수 있도록, 현재 전체 플랫 리스트 방식을
질문별 단일 화면 + 섹션 전환 인터스티셜 방식으로 전환한다.

섹션이 있는 설문에서 섹션 경계마다 "지금 몇 번째 섹션인지"를 명시적으로 안내해 응답자 이탈을 줄이고,
창작자의 섹션 구성 의도를 응답 경험에서 가시화한다.

## 현황

**현재 구현 (문제)**

- `SurveyRespondClient.tsx`: 모든 질문을 `space-y-4`로 수직 나열. 스크롤하며 전부 보임.
- `page.tsx`: `sections` 테이블 fetch 없음. `totalSections={0}` 하드코딩.
- `Question.section_id` 필드 존재 (nullable). 질문마다 어느 섹션인지 알 수 있음.
- `Section` 타입: `id, survey_id, title, description, color, border_color, order_index` 정의됨.
- startpoint는 `phase === "intro"` 로 별도 처리. `type !== "startpoint"` 필터로 응답 폼 제외 중.
- endpoint는 `QuestionCard`에서 별도 렌더 (`cfg?.message`). 응답 폼 하단에 포함됨.

**재사용 가능한 것**

- `QuestionCard` 컴포넌트 — input 렌더 로직 전체 재사용
- `isAnswerEmpty`, `getFirstUnansweredRequired` 헬퍼 — 유지
- `SuccessScreen`, `BlockedScreen`, `PointDeductionModal`, `PointBlockScreen` — 변경 없음
- `handleSubmit` 비동기 로직 — 변경 없음
- Intro phase (`phase === "intro"`) — 변경 없음

## 완료 조건 (Definition of Done)

- [ ] `page.tsx`에서 `sections` 테이블을 추가 fetch하고 `SurveyRespondClient`에 전달
- [ ] 상태 머신 `{ sectionIdx: number; questionIdx: number }` 기반으로 진행 위치 추적
- [ ] 질문을 한 번에 하나씩 표시 — "다음" 버튼으로 진행
- [ ] 섹션 경계에서 `SectionTransitionScreen` 표시 — "계속하기" 버튼으로 다음 섹션 진입
- [ ] 진행 표시바: "섹션 N / M · 질문 K / L" 형태
- [ ] 섹션 없는 설문 (section_id 전부 null) 정상 동작 — 섹션 전환 화면 없이 질문만 순서대로
- [ ] 섹션 1개 설문 — 섹션 전환 화면 없이 질문만 순서대로 (전환 불필요)
- [ ] 빈 섹션 (questions 없음) — 섹션 전환 화면 표시 후 즉시 다음 섹션으로 건너뜀
- [ ] required 질문에 미답 시 현재 질문에서 에러 인라인 표시 후 진행 차단
- [ ] endpoint 질문 도달 시 메시지 표시 후 제출 화면으로 자동 전환
- [ ] TypeScript strict 통과
- [ ] `npm run build` 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 레퍼런스 패턴

| 서비스                    | 패턴                                                                      | OPINION 적용 포인트                                                        |
| ------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Typeform                  | 질문 1개씩 표시, 키보드 Enter 진행, 부드러운 수직 슬라이드 전환           | 1-at-a-time 기본 개념. OPINION은 모바일 중심이므로 슬라이드 대신 fade 사용 |
| SurveyMonkey (Page Break) | 사용자가 설정한 페이지 단위로 분리. "다음 페이지" 버튼. 진행 바 상단 표시 | 섹션 = 페이지 개념. 전환 시 섹션 제목 표시 패턴 참고                       |
| Google Forms (Section)    | 섹션 제목 + 설명이 섹션 상단에 항상 노출. 한 섹션 내 질문 전부 표시       | OPINION은 섹션 전환 인터스티셜로 강화 — 더 명시적                          |
| Qualtrics                 | "Block" 개념. 블록 간 화면 전환 시 별도 페이지. 진행률 블록 단위 표시     | SectionTransitionScreen 디자인 레퍼런스                                    |
| Toss 설문 (내부)          | 단일 질문 카드, 상단 스텝 인디케이터 ("2 / 5"), 하단 고정 다음 버튼       | 진행 표시 + 하단 고정 CTA 패턴 그대로 적용                                 |

### 핵심 UX 결정

- **페이지 전환 애니메이션**: fade (opacity 0→1, 200ms) — 슬라이드는 모바일에서 방향 혼동 유발. Intro 화면과 동일한 느낌.
- **"다음" 버튼 위치**: 하단 고정 (`sticky bottom-0`) — 스크롤 없이 항상 접근 가능. 모바일 엄지 영역.
- **진행 표시**: 상단 바 (`섹션 1 / 3 · 질문 2 / 5`) — 섹션과 질문 번호 동시 표시.
- **섹션 없는 설문**: 섹션 전환 화면 없이 질문만 순서대로. totalSections=1 미만이면 섹션 카운터 숨김.
- **섹션 1개짜리 설문**: 전환 화면 없음 (첫 섹션 진입 = 설문 시작이므로 중복).
- **빈 섹션**: 전환 화면 표시 후 "계속하기" 클릭 시 다음 섹션으로 자동 진행 (또는 섹션 전환 화면 skip).
- **endpoint**: 마지막 endpoint 질문 도달 시 메시지 표시 + 자동으로 제출 준비 상태 진입. "제출하기" 버튼 표시.
- **뒤로 가기**: 브라우저 뒤로 가기는 설문 나가기 처리 (기존과 동일). 인앱 "이전" 버튼은 MVP 범위 밖.

### UX Writing (확정 문구)

| 상황                              | 문구                                                             |
| --------------------------------- | ---------------------------------------------------------------- |
| 섹션 전환 화면 — 섹션 번호 레이블 | `{N}번째 섹션`                                                   |
| 섹션 전환 화면 — CTA              | `계속하기`                                                       |
| 진행 표시 (섹션 있음)             | `섹션 {N} / {M} · 질문 {K} / {L}`                                |
| 진행 표시 (섹션 없음)             | `질문 {K} / {L}`                                                 |
| 다음 질문 이동 버튼               | `다음으로`                                                       |
| 마지막 질문에서 제출 버튼         | `제출하기`                                                       |
| required 미답 인라인 에러         | `필수 항목이에요. 답해 주세요.` (기존 문구 유지)                 |
| endpoint 도달 메시지 (기본)       | endpoint 질문의 `config.message` or `question.title` 그대로 표시 |

## 구현 힌트

### 데이터 모델 — page.tsx 변경

```typescript
// page.tsx: sections fetch 추가
const [
  { data: survey },
  { data: questions },
  { data: sections },
] = await Promise.all([
  supabase.from("surveys").select("...").eq("id", id).single(),
  supabase.from("questions").select("...").eq("survey_id", id).order("order_index"),
  supabase.from("sections").select("*").eq("survey_id", id).order("order_index"),
]);

// SurveyRespondClient에 전달
<SurveyRespondClient
  ...
  sections={sections ?? []}
  totalSections={sections?.length ?? 0}
/>
```

### 상태 머신 설계

```typescript
// SurveyRespondClient Props 확장
interface Props {
  // 기존 props 유지
  sections: Section[]; // 추가
  // totalSections는 sections.length로 대체 가능
}

// 진행 위치를 표현하는 "스텝" 타입
type RespondStep =
  | { kind: "section_transition"; sectionIdx: number } // 섹션 전환 화면
  | { kind: "question"; sectionIdx: number; questionIdx: number }; // 질문 화면

// 상태
const [currentStep, setCurrentStep] = useState<RespondStep>(
  computeInitialStep(groupedQuestions, sections)
);
```

### 질문 그룹핑 로직

```typescript
interface QuestionGroup {
  section: Section | null; // null = 섹션 없음
  questions: Question[];
}

function groupQuestionsBySection(questions: Question[], sections: Section[]): QuestionGroup[] {
  if (sections.length === 0) {
    // 섹션 없음 — 단일 그룹
    return [{ section: null, questions }];
  }

  const sectionMap = new Map(sections.map((s) => [s.id, s]));
  const groups: QuestionGroup[] = sections.map((s) => ({ section: s, questions: [] }));
  const unsectioned: Question[] = [];

  for (const q of questions) {
    const group = q.section_id ? groups.find((g) => g.section?.id === q.section_id) : null;
    if (group) group.questions.push(q);
    else unsectioned.push(q);
  }

  // section_id=null 질문은 마지막 그룹에 붙이거나 별도 처리
  if (unsectioned.length > 0) {
    groups.push({ section: null, questions: unsectioned });
  }

  // 빈 섹션 포함 유지 (전환 화면 표시 위해 — 이후 "다음" 클릭 시 skip)
  return groups;
}
```

### 진행 "다음" 로직

```typescript
function goNext(groups: QuestionGroup[], currentStep: RespondStep): RespondStep {
  if (currentStep.kind === "section_transition") {
    const group = groups[currentStep.sectionIdx];
    if (group.questions.length === 0) {
      // 빈 섹션 — 다음 섹션으로 skip
      return goNextSection(groups, currentStep.sectionIdx);
    }
    return { kind: "question", sectionIdx: currentStep.sectionIdx, questionIdx: 0 };
  }

  // kind === "question"
  const group = groups[currentStep.sectionIdx];
  const nextQuestionIdx = currentStep.questionIdx + 1;

  if (nextQuestionIdx < group.questions.length) {
    // 같은 섹션 내 다음 질문
    return { kind: "question", sectionIdx: currentStep.sectionIdx, questionIdx: nextQuestionIdx };
  }

  // 섹션 내 마지막 질문 → 다음 섹션으로
  return goNextSection(groups, currentStep.sectionIdx);
}

function goNextSection(groups: QuestionGroup[], currentSectionIdx: number): RespondStep {
  const nextSectionIdx = currentSectionIdx + 1;
  if (nextSectionIdx >= groups.length) {
    // 모든 섹션 완료 → 제출 단계 (별도 처리)
    return { kind: "question", sectionIdx: currentSectionIdx, questionIdx: Infinity }; // sentinel
  }
  // 섹션이 1개뿐이면 전환 화면 skip
  if (groups.length === 1) {
    return { kind: "question", sectionIdx: 0, questionIdx: 0 };
  }
  return { kind: "section_transition", sectionIdx: nextSectionIdx };
}
```

### 컴포넌트 구조

```
SurveyRespondClient
  ├── IntroPhase (기존 유지)
  ├── SectionTransitionScreen (신규)
  │   ├── "{N}번째 섹션" 레이블
  │   ├── 섹션 제목 (H2)
  │   ├── 섹션 설명 (BODY_1, optional)
  │   └── "계속하기" 버튼 (solid, lg)
  ├── QuestionStepScreen (신규 — 현재 form 영역을 대체)
  │   ├── 상단: 진행 표시 ("섹션 N / M · 질문 K / L")
  │   ├── 진행 표시바 (단일 progress bar)
  │   ├── QuestionCard (기존 컴포넌트 재사용)
  │   └── 하단 고정: "다음으로" / "제출하기" 버튼
  ├── SuccessScreen (기존 유지)
  └── BlockedScreen (기존 유지)
```

### 진행 표시바 계산

```typescript
// 전체 진행률 = 완료한 질문 수 / 전체 answerableQuestions 수
// sectionTransition 화면도 진행률에 포함하지 않음 (질문 답변 기준)
const totalAnswerable = groups
  .flatMap((g) => g.questions)
  .filter((q) => q.type !== "endpoint").length;

const answeredCount = Object.entries(answers).filter(([qId]) => {
  const q = allQuestions.find((q) => q.id === qId);
  return q && q.type !== "endpoint" && !isAnswerEmpty(answers[qId]);
}).length;

const progressPercent =
  totalAnswerable > 0 ? Math.round((answeredCount / totalAnswerable) * 100) : 0;
```

### 페이드 애니메이션

CSS transition으로 처리. 스텝 변경 시 `opacity: 0` → re-render → `opacity: 1`.
`key` prop으로 React가 컴포넌트를 unmount/mount하게 해 animation 트리거.

```tsx
<div
  key={`${currentStep.kind}-${currentStep.sectionIdx}-${
    currentStep.kind === "question" ? currentStep.questionIdx : ""
  }`}
  className="animate-fadeIn"
>
  {/* 현재 스텝 콘텐츠 */}
</div>
```

Tailwind 커스텀 animation (globals.css 또는 tailwind.config):

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 200ms ease forwards;
}
```

### required 검증 위치 변경

기존: submit 시 전체 검사  
변경: "다음으로" 클릭 시 현재 질문만 검사 → 실패 시 해당 질문 카드 에러 표시 + 진행 차단

```typescript
function handleNext() {
  if (currentStep.kind === "question") {
    const q = currentGroup.questions[currentStep.questionIdx];
    if (q.required && q.type !== "endpoint" && isAnswerEmpty(answers[q.id])) {
      setErrorQuestionIds(new Set([q.id]));
      return; // 진행 차단
    }
    setErrorQuestionIds(new Set()); // 에러 클리어
  }
  setCurrentStep(goNext(groups, currentStep));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
```

### endpoint 질문 처리

endpoint 질문에 도달하면 `QuestionCard`의 endpoint 렌더(`cfg?.message` 표시) 그대로 사용.  
하단 버튼은 "다음으로" 대신 "제출하기"로 전환.

```typescript
const isEndpoint = currentQ?.type === "endpoint";
const isLastStep = isLastQuestion && !hasNextSection;

// 버튼 텍스트
const ctaLabel = isEndpoint || isLastStep ? "제출하기" : "다음으로";
const ctaAction = isEndpoint || isLastStep ? handleSubmit : handleNext;
```

## 예외 처리

| 케이스                           | 처리 방법                                                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 섹션 없는 설문 (sections = [])   | 단일 그룹으로 처리. 섹션 전환 화면 없음. 진행 표시에서 섹션 카운터 숨김 → "질문 K / L"만 표시                                     |
| 섹션 1개짜리 설문                | 첫 번째 섹션 전환 화면 skip. 바로 첫 질문으로 진입 (intro 이후). 섹션 카운터 숨김                                                 |
| 빈 섹션 (questions.length === 0) | SectionTransitionScreen 표시 → "계속하기" 클릭 시 즉시 다음 섹션으로 이동. 섹션 전환 화면은 표시 (창작자가 의도한 구분일 수 있음) |
| section_id = null 질문           | 마지막 그룹에 모아서 처리. 섹션 전환 화면 없이 이전 섹션 이후 연속 표시                                                           |
| questions가 0개인 설문           | 기존과 동일. 제출 버튼 바로 표시                                                                                                  |
| endpoint 질문 중간 위치          | endpoint는 항상 마지막 질문으로 가정. 중간에 있어도 도달 시 제출 처리                                                             |
| sections fetch 실패              | sections = [] 폴백. 섹션 없는 설문과 동일하게 처리 (서비스 중단 방지)                                                             |
| preview 모드                     | 섹션 fetch는 동일하게 수행. 섹션 전환 화면 포함 정상 렌더. 제출 시 preview 성공 처리 기존과 동일                                  |

## 이벤트 로깅 포인트

| 이벤트                             | 속성                                                               | 시점                          |
| ---------------------------------- | ------------------------------------------------------------------ | ----------------------------- |
| `survey_section_transition_viewed` | `survey_id, section_idx, section_title`                            | SectionTransitionScreen mount |
| `survey_question_viewed`           | `survey_id, section_idx, question_idx, question_id, question_type` | QuestionStepScreen mount      |
| `survey_question_next_clicked`     | `survey_id, question_id, has_answer`                               | "다음으로" 클릭 (성공)        |
| `survey_question_next_blocked`     | `survey_id, question_id, reason: "required"`                       | required 미답으로 진행 차단   |

(MVP에서는 `console.log` 레벨. 추후 Amplitude/Mixpanel 연결)

## CS 문의 예상 지점

- **"다음으로 못 넘어가요"**: required 질문 미답으로 진행 차단된 경우 — 인라인 에러 문구 "필수 항목이에요. 답해 주세요."로 자가 해결 가능.
- **"섹션 전환 화면이 뜨는데 이게 뭔가요"**: 창작자의 섹션 구성을 응답자에게 안내. 대응: "설문이 여러 주제로 구성되어 있어요. '계속하기'를 눌러 다음 주제로 넘어가세요."
- **"이전 질문으로 돌아갈 수 없어요"**: MVP에서 인앱 뒤로 가기 미지원. 브라우저 뒤로 가기 시 설문 처음으로 돌아가거나 이탈됨. — Admin 수동 처리 불필요.

## Admin 수동 처리

없음. 이 티켓은 응답자 UX 변경만 포함. 데이터 스키마 변경 없음.

## 정책 참고

- **survey.md § 응답 플로우**: 응답 제출은 모든 질문 완료 후 1회. 중간 저장 없음.
- **shared.md § 상태 시스템**: survey: published 상태에서만 응답 가능. 기존 guards 유지.
