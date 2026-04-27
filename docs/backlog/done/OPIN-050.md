---
id: "OPIN-050"
title: "Analyze → Builder 연결 고도화 + Playwright URL 스크린샷"
priority: "P1"
status: "done"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-be"]
created: "2026-04-11"
updated: "2026-04-11"
sprint: "W15"
policy_refs: []
code_refs:
  - "src/app/(main)/analyze/page.tsx"
  - "src/app/api/analyze/route.ts"
  - "src/app/(builder)/survey/[id]/edit/page.tsx"
---

## 목적

서비스 창작자가 AI가 생성한 질문을 그대로 쓰는 게 아니라, 제출 전에 검토·편집할 수 있어야 한다.
또한 분석 품질을 높이기 위해 og 텍스트 대신 실제 화면(스크린샷) 기반 Claude Vision 분석을 도입한다.

## 현황

- `/analyze` 페이지: 질문 미리보기만 가능, 편집 불가 → "이 설문으로 만들기" 누르면 바로 생성
- `/api/analyze`: HTML fetch + og 파싱 기반 (텍스트만, 시각 정보 없음)
- Builder: AI 생성 맥락 인식 없음

## 완료 조건 (Definition of Done)

- [ ] `/analyze` 페이지에서 질문 inline 편집 가능 (텍스트 수정, 삭제, 순서 변경)
- [ ] 질문 직접 추가 버튼 (+ 질문 추가하기)
- [ ] Builder 진입 시 `?from=analyze` 감지 → "AI가 만든 설문이에요" 배너 표시
- [ ] `/api/analyze` Playwright 스크린샷 분기: `PLAYWRIGHT_ENABLED=true`일 때 스크린샷 → Claude Vision
- [ ] 로컬 환경에서 Playwright 스크린샷 동작 확인
- [ ] 환경변수 없으면 기존 HTML fetch 방식 fallback
- [ ] TypeScript strict 통과
- [ ] npm run build 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 레퍼런스 패턴

| 서비스      | 패턴                                       | OPINION 적용 포인트                    |
| ----------- | ------------------------------------------ | -------------------------------------- |
| Typeform AI | 생성 후 inline 편집, 개별 질문 삭제/재생성 | 질문별 삭제 버튼 + 텍스트 직접 수정    |
| Weavely     | AI Copilot으로 질문 rephrasing             | MVP에선 단순 텍스트 edit으로 충분      |
| involve.me  | 생성 → 리뷰 화면 → 발행 3단계              | analyze → 편집 → 만들기 2단계로 단순화 |

### 핵심 UX 결정

- **편집 방식**: contenteditable 또는 input 전환 — 클릭 시 input 전환 (더 명확)
- **삭제**: 질문 hover 시 휴지통 아이콘 노출
- **순서 변경**: MVP에선 생략 (Builder에서 dnd로 가능)
- **Builder 배너**: 상단 고정, "AI가 생성한 질문이에요. 자유롭게 수정하세요." + 닫기 버튼

### UX Writing

| 상황                    | 문구                                              |
| ----------------------- | ------------------------------------------------- |
| 질문 편집 힌트          | "클릭해서 수정할 수 있어요"                       |
| 질문 추가 버튼          | "+ 질문 추가하기"                                 |
| Builder 배너            | "AI가 생성한 설문이에요. 자유롭게 수정해 보세요." |
| 질문 0개 시 만들기 버튼 | "질문을 1개 이상 추가해 주세요" (disabled)        |

## 구현 힌트

### Part 1 — Analyze 페이지 inline 편집

```typescript
// 편집 가능한 질문 상태
const [questions, setQuestions] = useState<GeneratedQuestion[]>(result.questions);

// 질문 텍스트 수정
function updateQuestion(index: number, title: string) {
  setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, title } : q)));
}

// 질문 삭제
function deleteQuestion(index: number) {
  setQuestions((prev) => prev.filter((_, i) => i !== index));
}

// 질문 추가
function addQuestion() {
  setQuestions((prev) => [...prev, { type: "text", title: "" }]);
}
```

각 질문: 클릭 시 `<textarea>` 로 전환, blur 시 저장. hover 시 삭제 버튼 노출.

### Part 2 — Builder AI 배너

`/survey/[id]/edit` 에서 `useSearchParams()`로 `from=analyze` 감지.
`localStorage`에 dismissal 저장 (새로고침 시 다시 안 뜸).

```typescript
const searchParams = useSearchParams();
const [showAiBanner, setShowAiBanner] = useState(
  searchParams.get("from") === "analyze" && !localStorage.getItem(`ai-banner-${id}`)
);
```

redirect 시 URL: `/survey/${id}/edit?from=analyze`

### Part 3 — Playwright 스크린샷 (로컬 우선)

```typescript
// /api/analyze/route.ts 분기
if (process.env.PLAYWRIGHT_ENABLED === "true") {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
  const screenshot = await page.screenshot({ type: "jpeg", quality: 70, fullPage: false });
  await browser.close();
  // Claude Vision으로 분석
  // image/jpeg base64 → claude messages API
} else {
  // 기존 HTML fetch 방식
}
```

Claude Vision 메시지:

```typescript
{
  role: 'user',
  content: [
    { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: screenshotB64 } },
    { type: 'text', text: '이 서비스 화면을 보고 사용자 피드백 설문 6개를 만들어줘...' }
  ]
}
```

### 예외 처리

| 케이스                  | 처리 방법                                                |
| ----------------------- | -------------------------------------------------------- |
| Playwright 타임아웃     | 15초 후 HTML fetch fallback                              |
| 질문 전체 삭제          | "만들기" 버튼 disabled + "질문을 1개 이상 추가해 주세요" |
| 빈 질문 텍스트          | 만들기 전 필터링 (빈 텍스트 질문 제외)                   |
| PLAYWRIGHT_ENABLED 없음 | 자동 fallback (에러 없음)                                |

## 배포 고려사항

Vercel 서버리스에서 Playwright는 50MB 제약으로 기본 동작 불가.
→ 로컬/Node.js 배포 환경에서만 `PLAYWRIGHT_ENABLED=true` 설정.
→ 추후 `@sparticuz/chromium` 도입 또는 Browserless.io API 연동 검토 (OPIN-051).
