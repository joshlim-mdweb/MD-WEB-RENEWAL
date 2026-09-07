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

### Planner 중심 워크플로우 (멀티 터미널)

**두 축으로 나뉜다.** 문서 축(기획·정책)은 **Planner 허브**가 배정·취합하고, Figma 축은 **Josh가 직접 통솔**한다. Planner는 문서를 완료하면 Josh에게 넘기고 끝낸다 — `F-` 행을 만들지 않는다.

터미널은 `claude --name {역할}` 로 띄우고 같은 이름의 커맨드를 실행한다 (세션명·커맨드명·역할명 일치).

| 커맨드               | 역할              | 책임                                     | 배정 주체 |
| -------------------- | ----------------- | ---------------------------------------- | --------- |
| `/manager`           | Manager           | **기록** — TODO.md + task list 갱신 · 워크플로우 개선 | —         |
| `/planner`           | Planner           | 기획·문서 작업 분해·`T-` 배정 (`md-pm`)  | —         |
| `/task-manager`      | Task Manager      | **대시보드** — 알림 오면 현황표 자동 재출력 (읽기 전용) | —         |
| `/research`          | Research          | 자료 취합만 (판단 없음)                  | Planner   |
| `/policy-writer`     | Policy Writer     | 정책 문서 문장화                         | Planner   |
| `/figma-wireframe`   | Figma Wireframe   | 화면 그리기 (`md-figma`)                 | **Josh**  |
| `/figma-description` | Figma Description | Description Panel + 패턴 라이브러리 축적 | **Josh**  |

**각 역할은 상태가 바뀌면 `Manager`·`TaskManager` 두 곳에 알린다** (착수·완료·막힘 전부). Manager는 `requirements/board/TODO.md`와 세션 task list **양쪽에** 기록하고, TaskManager는 TODO.md를 다시 읽어 **현황표를 즉시 재출력**한다. 어디로 보낼지 판단하지 않는다 — 항상 둘 다.
행 ID 접두어로 축을 구분한다: **`T-` 문서 축**(Planner 배정) / **`F-` Figma 축**(Josh 직접). 둘 다 추적한다.
알림은 `SendMessage`, **폴링 금지.** 세션 task list는 세션마다 별개라 공유되지 않는다 — 공유 진실은 TODO.md.
리뷰 경로는 별개 — `T-` 검수는 Planner, `F-`는 Josh.
Figma 패턴 라이브러리: `requirements/board/patterns.md` (Figma Description 전용 갱신)
실수 로그: `docs/backlog/mistakes.md` — **유일한 실수 로그** (상황/실수/원인/다음엔 4필드)
Figma 검증(선택): `wf-validator` · `desc-validator` 에이전트 — PASS/FAIL + 이슈 목록 반환
프로토콜: `.claude/rules/planner-workflow.md` — **핵심: 플랜 승인 선행(§3) · PRD ↔ 정책 ↔ Figma Description 상호 링크(§4)**

### Rules (경로별 자동 로드)

| Rule               | 경로                                                              |
| ------------------ | ----------------------------------------------------------------- |
| `ds-tokens.md`     | `src/**/*.{ts,tsx}` — 색상 토큰, weight, CSS 네이밍               |
| `ds-components.md` | `src/components/ui/**`                                            |
| `ds-web.md`        | `src/app/(main)/**`, `src/components/mypage/**`                   |
| `builder.md`       | `src/components/builder/**`, `src/app/(builder)/**`               |
| `api.md`           | `src/app/api/**`, `supabase/**`                                   |
| `button.md`        | `src/**/*.{ts,tsx}` — 버튼 variant/size/pairing/상태/접근성 규칙  |
| `atlassian.md`     | `requirements/**/*.md` — Jira·Confluence 스페이스, 티켓 계층 규칙 |
| `jira-ticket.md`   | `requirements/**/*.md` — PRD → Jira Story 변환 형식               |
| `content-strategy.md`  | `src/app/(marketing)/**`, `requirements/**/*.md` — 페이지 구조, Hero/Feature 패턴, 이미지 전략, CTA 계층, 소셜 프루프 배치 |
| **`/spec.md` (루트)**      | **Figma 전체** — 와이어프레임·Description·기획 문서 통합 스펙 (2026-09-01 룰 7종 통합). 파이프라인, Screen Auto Layout 프레임 계층, 상황별 간격 표, 네이밍, Description L0~L3 + 텍스트 스타일(링크 파랑/중요 SemiBold/플래그 빨강), Annotation, 기획 문서 3종(PRD/기능명세/Version Table), 코드 패턴, QA. 기존 figma-* 룰 파일은 스텁 |
| **`/spec-visual.md` (루트)** | **Figma 전체** — 시각 토큰 정본: 시맨틱 컬러, 폰트, 컴포넌트 토큰과 생성 함수 |
| `planner-workflow.md` | `requirements/board/**`, 역할 커맨드 전체 — 7개 역할 정의·권한, TODO.md 갱신 규칙, 플랜 승인 선행(Phase A/B), 커버 항목 체크리스트, PRD↔정책↔Figma Description 상호 링크 규칙 |
| `policy-writing.md`        | Slack Canvas 게시본 · `docs/policy/**` · `requirements/**` — **문서 등급별 분기**(게시본=구조·불릿·검산예시 허용 / 원장=압축). 섹션 오프닝 한 문장, 불릿 A·B 2등급, 부정문 트리거, 용어 첫 등장 정의 (`/policy` 기준) |
| `localization.md`          | **전체** — 다국어 용어집, Placeholder 보호, 언어별 금지 표현 (`/writing` · `/translate` 기준) |
| `ux-writing.md`            | **사용자 노출 텍스트 전체** (UX 문구 + 마케팅 카피) — 텍스트 종류별 말투 결정표(마케팅=명사형 / 그 외 본문=합니다체 / 버튼=명사형), 작성 원칙 P1~P7, 버튼 `~하기` 금지, EN Title Case, 에러·토스트·빈 상태 템플릿. 검수는 `/copy-review` |

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
5. **Description 작성:** 루트 `spec.md` §6~§7 계층 구조(L0~L3)와 텍스트 스타일 필수 참조. 골격 선행(컴포넌트 식별 → Q1~Q3 → 구조 잠금) → 내용 채우기. 자유 작문 금지.
6. **Figma 읽기/그리기:** 루트 `spec.md` §1 파이프라인(읽기 → 스펙 매트릭스 → 그리기 → Description → Screenshot 검증) 필수. 참조 없이 그리기 금지. 스펙 매트릭스 유저 OK 없이 진행 금지. 시각 토큰은 `spec-visual.md`.
7. **문구 검수 필수:** 와이어프레임 작성·수정, Josh와의 문구 작업, FAQ·마케팅 카피 작성 시 **출력 전 `/copy-review` 검수를 반드시 거친다.** 기준은 `.claude/rules/ux-writing.md`. 보여준 뒤 지적받지 말고 보여주기 전에 잡는다.
8. **약어·줄임말 금지 — 예외 없음.** 산출물에 쓰는 모든 이름은 전체 명칭으로 쓴다. 적용 범위는 **전부**다 — Figma 프레임·섹션·케이스 라벨, Description 패널, 보드 파일(`requirements/board/**`), 티켓, 정책서, 채팅 보고.
   - 금지: 머리글자 + 번호로 만든 코드 — `BP1` · `OS3` · `BI2` · `H1` · `C4` · `SC1` · `EP1` · `PT-01` · `N-10`
   - 대신: `Billing Preference 1` · `Order Summary 3` · `Checkout Header 1` · `진입경로 1` · `계정판정 10`
   - 새 약어를 만들지 않는다. 번호 체계가 필요하면 **그룹명을 풀어 쓰고 번호를 붙인다**
   - 허용: 업계 표준(`CTA` · `GNB` · `SNB` · `VAT` · `ZIP` · `PG`)과 승인 용어집 등재어(`SW Account` · `Seat` · `Organization`)
   - `WF`는 `.md` 작업 파일에서만 쓴다. **Figma Description 등 읽는 사람용 산출물에서는 `와이어프레임`으로 쓴다**
   - 식별자는 예외: 작업 행 ID(`T-01` · `F-13` · `D-14`), Jira 키(`MDWEB-870`), 절 번호(`§6-1`), node-id
   - Figma 라벨 형식은 루트 `spec.md` §5 참조. 기능명세 페이지 코드(`CO` 등)는 `spec.md` §9.5 등록표에 있는 것만 식별자 예외
   - **이 지적은 2026-06-04 · 2026-08-25 두 번 받았다.** 범위를 "티켓·PRD"로 좁게 읽어서 재발했다 — 내부용 파일도 범위 안이다.
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
