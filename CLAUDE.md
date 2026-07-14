@../../md-shared/CLAUDE.md

# MD RENEWAL – Claude Code Rules

PROJECT_PREFIX: MD-WEB
JIRA_PROJECT_KEY: MDWEB
TICKET_FORMAT: MD-WEB-{id}
BACKLOG_PATH: docs/backlog

Update this file when new rules are established. All rules are mandatory.

---

## Team & Workflow

Agents: `~/.claude/agents/` (global md-*) · Rules: `.claude/rules/` (경로별 자동 적용)

### Agents

| Agent          | Role                                                           |
| -------------- | -------------------------------------------------------------- |
| `md-pm`        | PM — 업무 할당, 기능 정의, 플로우 설계, 정책, PRD              |
| `md-analyze`   | 요구사항 분석 — 이벤트 로깅, 퍼널, A/B 테스트                  |
| `md-design`    | UX 검증 — 플로우 리뷰, 상태 정의, 인터랙션 패턴 (Figma 없음)   |
| `md-fe`        | 프론트엔드 — React, Tailwind, zustand, dnd-kit                 |
| `md-be`        | 백엔드 — Supabase, RLS, API routes                             |
| `md-qa`        | QA — 버그 트리아지, 테스트 케이스 (버그 시 MANDATORY 먼저 호출)|
| `md-security`  | 보안 리뷰, 어뷰즈 방지 (on-demand)                             |
| `md-devops`    | 인프라, 배포, CI/CD (on-demand)                                |

`ui-ux-designer` — md-design 보조 역할

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
| `atlassian.md`     | `requirements/**/*.md` — Jira·Confluence 스페이스, 티켓 계층 규칙 |
| `jira-ticket.md`   | `requirements/**/*.md` — PRD → Jira Story 변환 형식               |

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
3. **디자인 프로세스:** Figma 드로잉 없음. PM 명세 → md-design UX 검증 → md-fe 구현 → 브라우저 확인.

---

## Product Policy

Source of truth: `docs/policy/`

| Role      | Load                                                    |
| --------- | ------------------------------------------------------- |
| `md-be`   | member.md · plan.md · mypage.md                         |
| `md-fe`   | member.md · plan.md · plan-card.md · mypage.md          |
| `md-qa`   | member.md · plan.md · plan-card.md · mypage.md          |

Key: MemberType 7종 (Non-Member / Personal / Student / CompanyID / Academic / Indie / License ID). 플랜 카드 5종 (Personal / Student / Enterprise / Academics / Indie). License ID는 조회 전용, 관리 책임은 Company ID.

---

## Known Issues

- [2026-03-11] `replace_all` on Edit tool replaces inside import strings — use targeted edits
- [2026-03-24] `QUESTION_TYPE_COLORS` 두 곳 정의 시 값 불일치 — `design-tokens.ts`만 수정
- [2026-03-24] MCP 서버는 `.mcp.json`에 추가 (settings.json 아님)
- [2026-03-24] `useEffect` 내 동기 setState → React 컴파일러 린트 에러 — tick counter 패턴 사용
- [2026-04-03] md-design Figma 드로잉 제거 — UX 검증 역할만 유지

---

## Deferred (Not MVP)

Network Offline 플랜 · Back-order 구매 플로우 · CLO-SET 게스트 기능
