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
| `md-figma`     | Figma Plugin API — PRD DOC 생성, 와이어프레임, 레이아웃 버그 수정 (on-demand) |

`ui-ux-designer` — md-design 보조 역할

### 기획 Wave 워크플로우 (오케스트레이터 전용)

| 커맨드           | 역할                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| `/wave-prep`     | Wave 시작 — 스코프 정의 → pm→design→figma 순차 게이트 → Gate 3 자동 검증 |
| `/wave-integrate`| Wave 정리 — 실수노트 누적 → 로그 작성 → 파일 아카이브 → Jira 동기화  |
| `/orch`          | 오케스트레이터 상태 복구 — `/clear` 또는 새 터미널 진입 시 현황 확인  |

Wave 파일 위치: `requirements/waves/active/` (PACKET/REPORT) · `requirements/waves/archive/` (완료)
Mistake 로그: `.claude/planning-logs/pm-log.md` · `design-log.md` · `figma-log.md`
포맷 기준: `.claude/rules/planning-packet.md`

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
| `copywriting.md`        | `src/app/(marketing)/**` — 마케팅 카피 말투, 명사형 종결, 구체적 기능 묘사 |
| `content-strategy.md`  | `src/app/(marketing)/**`, `requirements/**/*.md` — 페이지 구조, Hero/Feature 패턴, 이미지 전략, CTA 계층, 소셜 프루프 배치 |
| `figma-read.md`            | **Figma 전체** — 화면 읽기 프로토콜. 분할 읽기, 측정 항목, 색상 정밀도, 스펙 매트릭스, Description 연계 |
| `figma-draw.md`            | **Figma 전체** — 화면 그리기 프로토콜. 노드 생성 Q1~Q4, Auto Layout, WF 프레임, Clone, Screenshot 검증 |
| `figma-write.md`           | **Figma 전체** — Description/Annotation 작성 이탈 방지. 5 금지 패턴, 8 Description 케이스, 3 Annotation 케이스, 2 삽입 케이스 + Pre-flight |
| `figma-annotation.md`      | Figma 어노테이션 전체 — 형식([타이틀]), 버튼 호버·클릭 필수, STRUCTURE/FEATURE/CASE VIEW 구분 |
| `figma-feature-naming.md`  | WF 섹션 네이밍 — STRUCTURE/FEATURE/CASE VIEW 타입 정의, 프레임명, Board Header, Row Label |
| `planning-packet.md`       | `requirements/waves/**` — Wave PACKET/REPORT 포맷, Gate 기준, 실수노트 프로토콜 |
| `localization.md`          | **전체** — 다국어 용어집, Placeholder 보호, 언어별 금지 표현 (`/writing` · `/translate` 기준) |

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
5. **Description 작성:** `~/.claude/rules/figma-description.md` 계층 구조(L0~L3) 필수 참조. 골격 선행(컴포넌트 식별 → Q1~Q3 → 구조 잠금) → 내용 채우기. 자유 작문 금지.
6. **Figma 읽기/그리기:** `figma-read.md` → `figma-description.md` → `figma-draw.md` 파이프라인 필수. 참조 없이 그리기 금지. 스펙 매트릭스 유저 OK 없이 진행 금지.
4. **컨텍스트 전환 감지:** 세션 중 현재 프로젝트와 다른 주제로 전환하려는 신호가 보이면, 즉시 아래 메시지를 출력하고 기다린다.
   > "지금 **{현재 프로젝트}** 진행 중이에요. 다른 일 시작하기 전에 `/checkout` 해두는 게 좋을 것 같아요."
   - 신호 예시: "이거 잠깐 보류하고", "다른 거 먼저", "급한 게 생겼어", 전혀 다른 기능/페이지 언급
   - 사용자가 `/checkout` 없이 그냥 진행하겠다고 하면 따른다 — 강제하지 않는다

---

## Product Policy

Source of truth: `docs/policy/`

| Role      | Load                                                                              |
| --------- | --------------------------------------------------------------------------------- |
| `md-be`   | member.md · plan.md · mypage.md · contact.md · auth-cn.md                        |
| `md-fe`   | member.md · plan.md · plan-card.md · mypage.md · contact.md · auth-cn.md         |
| `md-qa`   | member.md · plan.md · plan-card.md · mypage.md · contact.md · auth-cn.md         |

Key: MemberType 7종 (Non-Member / Individual / Student / CompanyID / Academic / Indie / License ID). 플랜 카드 5종 (Individual / Student / Enterprise / Academics / Indie). License ID는 조회 전용, 관리 책임은 Company ID.

신규 정책 파일:
- `contact.md` — TS(기술지원) 문의 폼 통합 정책 (MDWEB-700)
- `auth-cn.md` — WeChat CN 로그인 정책 (MDWEB-611, Q2 2026)

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
