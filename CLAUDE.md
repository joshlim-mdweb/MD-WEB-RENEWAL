# MD RENEWAL – Claude Code Rules

Update this file when new rules are established. All rules are mandatory.

---

## Team & Workflow

Agents: `.claude/agents/` · Rules: `.claude/rules/` (경로별 자동 적용)

### Agents

| Agent           | Role                                                            |
| --------------- | --------------------------------------------------------------- |
| `opin-pm`       | PM — 업무 할당, 기능 정의, 플로우 설계, 정책, PRD               |
| `opin-analyze`  | 요구사항 분석 — 이벤트 로깅, 퍼널, A/B 테스트                   |
| `opin-design`   | UX 검증 — 플로우 리뷰, 상태 정의, 인터랙션 패턴 (Figma 없음)    |
| `opin-fe`       | 프론트엔드 — React, Tailwind, zustand, dnd-kit                  |
| `opin-be`       | 백엔드 — Supabase, RLS, API routes                              |
| `opin-qa`       | QA — 버그 트리아지, 테스트 케이스 (버그 시 MANDATORY 먼저 호출) |
| `opin-security` | 보안 리뷰, 어뷰즈 방지 (on-demand)                              |
| `opin-devops`   | 인프라, 배포, CI/CD (on-demand)                                 |

`ui-ux-designer` — opin-design 보조 역할

### Workflow (mandatory order)

```
PM 업무 할당
  → analyze 요구사항 분석
  → opin-design + ui-ux-designer UX/UI 설계
  → opin-fe / opin-be 개발
  → opin-qa 검증
  → 배포 (staging → live, 추후)
```

### Rules (경로별 자동 로드)

| Rule               | 경로                                                              |
| ------------------ | ----------------------------------------------------------------- |
| `ds-tokens.md`     | `src/**/*.{ts,tsx}` — 색상 토큰, weight, CSS 네이밍               |
| `ds-components.md` | `src/components/ui/**`                                            |
| `ds-web.md`        | `src/app/(main)/**`, `src/components/mypage/**`                   |
| `builder.md`       | `src/components/builder/**`, `src/app/(builder)/**`               |
| `api.md`           | `src/app/api/**`, `supabase/**`                                   |
| `ux-writing.md`    | `src/**/*.{ts,tsx}` — 한국어 UX Writing, 에러 메시지, 버튼 텍스트 |
| `button.md`        | `src/**/*.{ts,tsx}` — 버튼 variant/size/pairing/상태/접근성 규칙  |
| `prd-writing.md`   | `requirements/**/*.md` — PRD/기획서 문체, 문서 구조, 표기 규칙    |

---

## Bug Triage (MANDATORY)

버그 발생 시 순서 엄수. QA 없이 개발자에게 바로 넘기지 않는다.

```
opin-qa 진단 (재현 조건, 근본 원인, 영향 범위, 심각도)
  → opin-fe / opin-be 수정 (타입 체크 + 빌드 확인)
  → opin-qa 검증 (해결 확인 + regression 없는지)
```

예외: 오탈자, 1줄 텍스트 수정은 QA 생략 가능.

---

## Tech Stack

- Next.js 16.1.6 (App Router) · React 19.2.3 · TypeScript ^5
- Tailwind CSS ^4 · zustand ^5.0.11 · dnd-kit ^6.3.1
- Supabase (@supabase/supabase-js ^2.99.0, @supabase/ssr ^0.9.0)
- 패키지 매니저: npm

---

## Mandatory Rules

1. **Backend is Supabase only.**
2. **No local file-based storage.** `src/lib/store.ts` (JSON) 는 legacy.
3. **디자인 프로세스:** Figma 드로잉 없음. PM 명세 → opin-design UX 검증 → opin-fe 구현 → 브라우저 확인.

---

## Code Rules

- Naming: `camelCase` 변수/함수, `PascalCase` 컴포넌트, `UPPER_SNAKE` 상수, `is/has/can/should` 불리언
- 절대 모킹 금지 — 실제 동작 코드만
- 타입 안전성: TypeScript strict 준수, `any` 금지
- Comment: why만, what 금지

---

## Product Policy

Source of truth: `docs/policy/`

| Role       | Load                              |
| ---------- | --------------------------------- |
| `opin-be`  | member.md · plan.md · mypage.md   |
| `opin-fe`  | member.md · plan.md · plan-card.md · mypage.md |
| `opin-qa`  | member.md · plan.md · plan-card.md · mypage.md |

Key: MemberType 7종 (Non-Member / Personal / Student / CompanyID / Academic / Indie / License ID). 플랜 카드 5종 (Personal / Student / Enterprise / Academics / Indie). License ID는 조회 전용, 관리 책임은 Company ID.

---

## Known Issues

- [2026-03-11] `replace_all` on Edit tool replaces inside import strings — use targeted edits
- [2026-03-24] `QUESTION_TYPE_COLORS` 두 곳 정의 시 값 불일치 — `design-tokens.ts`만 수정
- [2026-03-24] MCP 서버는 `.mcp.json`에 추가 (settings.json 아님)
- [2026-03-24] `useEffect` 내 동기 setState → React 컴파일러 린트 에러 — tick counter 패턴 사용
- [2026-04-03] opin-design Figma 드로잉 제거 — UX 검증 역할만 유지

---

## Deferred (Not MVP)

Network Offline 플랜 · Back-order 구매 플로우 · CLO-SET 게스트 기능
