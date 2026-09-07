---
title: AI 워크플로우 발표 준비 자료 — 원본 데이터 전수 정리
purpose: Josh 발표용 자료의 원본(raw) 정리. "무엇을 했고 → 어떻게 AI를 썼고 → 어떤 효과가 있었는지" 구조로 근거를 남김없이 모은다. 시각화·슬라이드 문구는 이후 별도 작업.
scope: MD-WEB-RENEWAL 레포 세션 기록 전체 (mistakes.md 전 항목, docs/backlog/projects/*.md 전 항목, memory 61개 파일, agents/skills/rules 인벤토리, 커밋 히스토리) 기준
created: 2026-07-27
updated: 2026-09-07 (§21 병목과 해결 장 추가. §4, §5, §6, §12는 7월 시점 스냅샷으로 일부 스테일, §21.0 참조)
note: 이 문서는 요약본이 아니라 발표 준비를 위한 재료 원본이다. 편집·축약은 발표 슬라이드를 만들 때 진행한다.
---

# AI 워크플로우 발표 준비 자료

## 목차

1. 이 문서의 목적과 사용법
2. 두 축 프레임 — 기획 vs 매니지
3. 기획 축 파이프라인 — 무엇을 어떻게 했는가
4. 에이전트 인벤토리 (전체)
5. 스킬 인벤토리 (전체)
6. 룰 파일 인벤토리 (전체)
7. Memory 시스템 — 61개 파일 전수 분석
8. mistakes.md 전 항목 분석 (43개 사례)
9. 프로젝트 세션 로그 재구성 — My Page 리뉴얼 타임라인
10. 커밋 히스토리 분석
11. 정책 ↔ Figma 동기화 지연 — 사례 상세
12. wave-prep 미스매치 — 왜 이 프로젝트엔 안 맞았는가
13. 효과 분석 종합
14. 시각화 후보 — 차트별 데이터 스펙
15. 발표 스토리라인 초안 (선택 사용)
16. 다루지 않은 것 / 후속 작업
21. 2026-09-07 갱신: 병목과 해결 (발표 주제 7축 재구성, 최신 상태 반영)

---

## 1. 이 문서의 목적과 사용법

발표의 뼈대는 세 단계다.

```
무엇을 했는가 (What)
   ↓
AI를 어떻게 썼는가 (How) — 규칙 파일 기반 파이프라인 + 자가 교정 루프
   ↓
그래서 어떤 효과가 있었는가 (So what) — 산출물 규모, 재발 방지, 동기화 지연의 실체
```

이 문서는 이 세 질문에 답하기 위한 **1차 원자료**를 전부 모아둔 것이다. 발표 자료를 만들 때는:

- 4~9번 섹션(인벤토리·전수 데이터)에서 필요한 표/숫자만 골라 슬라이드로 옮긴다
- 13번(효과 분석)이 발표의 핵심 메시지 후보다
- 14번(시각화 후보)은 각 차트가 어떤 원자료를 근거로 하는지 매핑해뒀다
- 15번(스토리라인 초안)은 필요 없으면 무시해도 된다 — 순서 감 잡기용

---

## 2. 두 축 프레임 — 기획 vs 매니지

Josh의 업무를 AI 활용 관점에서 나누면 두 축이 뚜렷하게 갈린다.

### 기획 (Planning) 축 — 아이디어 → 화면/정책 확정까지

- `cowork` (아이디어 → UX 리서치 → PRD), `create-jira` (PRD → Jira)
- `wave-prep` / `wave-integrate` / `orch` — pm→design→figma 순차 게이트 오케스트레이션 (이 프로젝트에서는 미사용 — 12번 섹션 참조)
- Figma 4단 파이프라인: `figma-read` → `figma-description` → `figma-draw` → `figma-write`
- `description` 스킬, `md_figma_annotate`
- `translate` / `writing` (다국어 UX 카피), `confluence-doc`
- 담당 에이전트: md-pm, md-design, md-figma, md-analyze

### 매니지 (Management/Ops) 축 — 굴러가는 걸 유지하는 일

- `initiate` / `checkout` / `handoff` — 세션 경계 관리
- `slackrequest` / `read-slack` / `slack-to-jira` — Slack → Jira 트리아지
- `bug` / `investigate` / `qa` — 버그 대응
- `eod` — 하루 마감 컴플라이언스
- `retro` — 커밋 히스토리 회고
- `sync-claude` / `sync-agents` / `audit-claude` — 룰·에이전트 자체 유지보수
- auto memory 시스템

Josh 본인 확인 (2026-07-27 세션): **"기획이 확실히 많이 들어가긴 해."** 이 문서는 이후 전량 기획 축에 집중한다. 매니지 축은 16번 섹션에 후속 과제로만 남긴다.

두 축의 시간 비중을 뒷받침하는 정량 근거는 7번(Memory) 섹션에 있다 — 61개 memory 파일 중 43개(70%)가 Figma/화면 작업 관련이고, 매니지 축에 해당하는 memory(세션 관리, Slack 트리아지)는 사실상 거의 기록되지 않았다. 이 자체가 "기획 축에 실수·학습이 집중된다"는 방증이다.

---

## 3. 기획 축 파이프라인 — 무엇을 어떻게 했는가

### 3.1 반복되는 루프

```
정책/PRD 문서 (docs/policy/*.md, requirements/*.md, docs/backlog/todo/*.md)
        ↕  ← 이 화살표가 매번 수작업으로 연결됨 (11번 섹션 참조)
Figma 읽기 → Description 작성 → WF 드로잉 → 검증
   (figma-read.md → figma-description.md → figma-draw.md → figma-write.md)
        ↕
docs/backlog/projects/*.md 세션 로그 누적 (다음 세션 인계용)
```

### 3.2 Figma 4단계 파이프라인 상세

**Step 1 — figma-read.md (읽기)**
- 최우선 원칙: "참조 없이는 아무것도 하지 않는다"
- 20kb 출력 상한 대응: top-level children만 먼저 읽고, 섹션별 개별 호출로 분할
- 색상은 반올림 없이 실측 소수값 그대로 사용 (`r: 0.2705882489681244` 형태)
- 읽기 완료 후 "스펙 매트릭스"를 출력하고 사용자 OK 없이는 다음 단계 진행 금지

**Step 2 — figma-description.md (설명 작성)**
- Description을 L0(화면명) ~ L3(서브불릿) 4단 계층으로 고정
- 컴포넌트 판단 플로우 Q1~Q3: 독립 영역인가 / 자체 상태가 있는가 / 인터랙션이 있는가 → Numbered Note(L1)로 분리할지 불릿(L2)으로 흡수할지 결정
- 5개 절대 금지 패턴 명문화 (성공 후 분기를 클릭 시 하위에 나열 금지, 에러 상태 자유서술 금지, 미완성 문장 혼입 금지, 컴포넌트를 불릿으로 나열 금지, Header Note에 불릿 추가 금지)
- Format A(플로우형)/B(Note 카드형) 구분, 상태는 라이프사이클 순서(Active→Trial→...→Expired) 고정

**Step 3 — figma-draw.md (드로잉)**
- 노드 생성 전 Q1~Q4 의사결정: 같은 역할 노드가 이미 있는가 → clone, 라이브러리 컴포넌트인가 → import, 기존 스타일을 따라야 하는가 → getStyledTextSegments로 복사, 완전 신규인가 → 직접 생성
- Auto Layout 필수 규칙: 패딩 16px 기본, FILL은 appendChild 이후 설정, resize() 후 primaryAxisSizingMode 재설정
- Clone 시 clearAnnotations() 강제 실행 (STRUCTURE → FEATURE 전환 시 이전 annotation 잔존 방지)

**Step 4 — figma-write.md (삽입 + Pre-flight 검증)**
- 위 세 파일의 체크리스트를 종합한 최종 관문
- native 불릿(setRangeListOptions) 적용 확인
- 완료 선언 전 반드시 screenshot()으로 시각 검증

### 3.3 이 파이프라인이 다른 프로젝트와 다른 점

CLAUDE.md에는 공식 오케스트레이션 커맨드 `/wave-prep`이 있다 (pm→design→figma 순차 게이트 + Gate 3 자동 검증). 하지만 이 프로젝트에서는 **한 번도 사용되지 않았다.** 이유는 12번 섹션에서 자세히 다룬다 — 요약하면, Josh의 실제 산출물이 문서·화면까지이고 개발 게이트가 해당 없기 때문에, 형식적으로 무거운 게이트 구조 대신 `docs/backlog/projects/*.md`에 직접 세션 로그를 쌓는 방식으로 대체됐다.

---

## 4. 에이전트 인벤토리 (전체)

Josh가 실제로 호출 가능한 에이전트 전체 목록과 역할. 이번 세션에서 실제 호출한 것은 없음(직접 작업) — 하지만 발표에서 "이런 전문 에이전트 체계를 갖추고 있다"는 인프라 자체를 보여줄 수 있다.

| 에이전트 | 역할 | 이번 프로젝트에서 실사용 빈도(체감) |
|---|---|---|
| md-pm | 기능 정의, 사용자 플로우 설계, 정책 설계, PRD 작성, 상태/예외 매핑, MVP 범위 결정 | 높음 — 기획 축 핵심 |
| md-design | UX 검증 — 플로우 리뷰, 상태 정의, 접근성, 인터랙션 패턴 (Figma 드로잉 없음) | 중간 |
| md-figma | Figma Plugin API 전문 — PRD DOC 생성, 와이어프레임 드로잉, 레이아웃 버그 수정, annotation | 높음 — 실제로는 Josh 본인이 직접 figma-read/description/draw/write 파이프라인을 돌리는 경우가 더 많았음(메인 세션에서 직접 처리) |
| md-analyze | 이벤트 로깅, 퍼널 분석, A/B 테스트 설계 (on-demand) | 낮음 |
| md-fe | React/Tailwind 컴포넌트 구현, 페이지 개발 | 낮음 (Josh는 개발 담당 아님) |
| md-be | Supabase 스키마, API 라우트, RLS | 낮음 |
| md-qa | 버그 트리아지, 테스트 케이스 (버그 발생 시 최우선 호출 원칙) | 낮음 |
| md-security | 보안 리뷰, 어뷰즈 방지 (on-demand) | 낮음 |
| md-devops | 인프라/배포 (on-demand) | 낮음 |
| code-reviewer | 보안 취약점, TypeScript 타입 안전성, 에러 핸들링, 프로젝트 규칙 준수 종합 검토 | 낮음 |
| ui-ux-designer | UI/UX 디자인 검토, 접근성, 시각 인터페이스 감사 | 낮음 |
| product-strategist | 제품 전략·로드맵, 포지셔닝, 경쟁 분석, GTM | 낮음 |
| documentation-expert | 기술 문서 작성·개선 | 낮음 |
| clo-doc-reader | Josh 개인 전용 — CLO/MD Confluence 문서 읽기, 레거시 판별, 기술→PM 번역 | 개인화된 전용 도구 — 다른 곳에 없는 케이스 |

**관찰**: 에이전트 체계는 잘 갖춰져 있지만, 실제 Figma 파이프라인 작업은 md-figma 에이전트 위임보다 **메인 세션에서 직접 처리하는 비중이 컸다.** 근거: `feedback_figma_verify_before_execute`, `feedback_figma_session_node_ids` 등 다수의 memory가 "메인 세션에서 직접 검증" 원칙을 강조하고, 2026-07-14 mistakes.md 항목은 서브에이전트(md-figma) 위임 시 OAuth 인증이 4회 반복 실패한 사례를 기록하며 "MCP OAuth 인증은 항상 메인 세션에서 직접 수행한다"는 규칙으로 귀결됐다. 즉 **위임을 시도했다가 기술적 한계로 되돌아온 사례**가 존재한다.

---

## 5. 스킬 인벤토리 (전체)

### 5.1 기획 축 관련 스킬

| 스킬 | 설명 |
|---|---|
| `cowork` | 기획 루프 실행. 아이디어(자연어) → UX 리서치 → PRD 작성까지 |
| `create-jira` | PRD를 기반으로 Jira 티켓 생성 |
| `description` | 화면 캡처를 보고 Figma Description Panel용 UX 스펙 작성 |
| `md_figma_annotate` | 기존 Figma 프레임에 native annotation 추가/수정/삭제 |
| `confluence-doc` | MD Web 페이지용 Confluence 문서 3종(정책서/컨텐츠/기능명세서) 작성·업데이트 |
| `translate` | 원문 텍스트를 4개 언어(EN·KO·ZH-CN·JA)로 변환. Placeholder 보호, 용어 일관성 |
| `writing` | 상황별 다국어 UX 문구 생성 — 버튼·에러·Slack·이메일·릴리즈 노트 |
| `wave-prep` | 기획 웨이브 준비·실행 (오케스트레이터 전용) — 이 프로젝트 미사용 |
| `wave-integrate` | Wave 정리 — 실수노트 누적, 로그 작성, 파일 아카이브, Jira 동기화 — 미사용 |
| `orch` | 오케스트레이터 상태 복구 — 미사용 |

### 5.2 매니지 축 관련 스킬

| 스킬 | 설명 |
|---|---|
| `initiate` | 세션 시작 루틴. MCP 커넥터 확인 + 활성 프로젝트 TODO 로드 + Slack 요청 미리보기 |
| `checkout` | 세션 마감 — TODO 저장 + 실수 노트 |
| `handoff` | 세션 종료 전 인계 (구현 중간 상태) |
| `eod` | 하루 마감 루틴 — CLAUDE.md 규칙 준수 확인 |
| `slackrequest` | cell_mdweb·cell_request_to_mdweb 채널 72시간 내 요청을 읽고 MDWEB-625 하위에 Bug/Improvement 티켓 생성 |
| `read-slack` | 지정 채널을 읽고 미티켓 이슈를 Jira 생성 후보 표로 출력 |
| `slack-to-jira` | 슬랙 채널/스레드 내용으로 Jira 이슈 생성 |
| `bug` | 버그 트리아지 워크플로우 |
| `investigate` | 버그를 체계적으로 조사, 근본 원인 없이 수정하지 않음 |
| `qa` | OPIN_QA 역할 — 기능/파일 QA 리포트 |
| `retro` | 지난 7일 커밋 히스토리 분석 + 엔지니어링 회고 생성 |
| `review` | 현재 브랜치 변경사항 종합 코드 리뷰 |
| `sync-claude` | 오늘 작업 내용 기반 CLAUDE.md 최신화 |
| `sync-agents` | 전체 에이전트 파일 검토, CLAUDE.md 규칙과 일관성 확인 |
| `audit-claude` | CLAUDE.md 규칙이 실제 코드베이스에서 지켜지는지 감사 |

### 5.3 기타 (범용/보조)

| 스킬 | 설명 |
|---|---|
| `frontend-design`, `ui-ux-pro-max`, `ui-design-system` | UI 구현/디자인 시스템 보조 |
| `code-reviewer` | 코드 리뷰 (TS/JS/Python/Swift/Kotlin/Go) |
| `api-documentation-generator` | API 문서 자동 생성 |
| `product-strategist` | OKR, 시장 분석, 비전 설정 |
| `migrate` / `types` | Supabase 마이그레이션 작성/적용, 타입 재생성 |
| `commit` / `pr` | 커밋 메시지 작성, PR 생성 |
| `careful` / `freeze` / `unfreeze` | 안전 모드, 편집 범위 제한 |

**관찰**: 스킬 목록만 보면 기획 축(10개)과 매니지 축(15개)이 비슷한 규모로 갖춰져 있다. 그런데 실제 세션에서 호출 빈도는 기획 축(특히 Figma 파이프라인)에 압도적으로 쏠려 있다 — 이는 "도구가 없어서"가 아니라 "그 업무 자체가 시간이 오래 걸려서"라는 뜻으로 읽을 수 있다.

---

## 6. 룰 파일 인벤토리 (전체)

CLAUDE.md 기준 경로별 자동 로드 룰. 프로젝트 CLAUDE.md에 명시된 전체 목록:

| Rule | 적용 경로 |
|---|---|
| `ds-tokens.md` | `src/**/*.{ts,tsx}` — 색상 토큰, weight, CSS 네이밍 |
| `ds-components.md` | `src/components/ui/**` |
| `ds-web.md` | `src/app/(main)/**`, `src/components/mypage/**` |
| `builder.md` | `src/components/builder/**`, `src/app/(builder)/**` |
| `api.md` | `src/app/api/**`, `supabase/**` |
| `ux-writing.md` | `src/**/*.{ts,tsx}` — 한국어 UX Writing |
| `button.md` | `src/**/*.{ts,tsx}` — 버튼 규칙 |
| `prd-writing.md` | `requirements/**/*.md` — PRD 문체·구조 |
| `atlassian.md` | `requirements/**/*.md` — Jira·Confluence 규칙 |
| `jira-ticket.md` | `requirements/**/*.md` — PRD → Jira 변환 형식 |
| `copywriting.md` | `src/app/(marketing)/**` — 마케팅 카피 톤 |
| `content-strategy.md` | `src/app/(marketing)/**`, `requirements/**/*.md` — 페이지 구조 패턴 |
| `figma-read.md` | Figma 전체 — 읽기 프로토콜 |
| `figma-draw.md` | Figma 전체 — 그리기 프로토콜 |
| `figma-write.md` | Figma 전체 — Description/Annotation 작성 이탈 방지 |
| `figma-annotation.md` | Figma 어노테이션 형식 |
| `figma-feature-naming.md` | WF 섹션 네이밍 |
| `planning-packet.md` | `requirements/waves/**` — Wave PACKET/REPORT 포맷 |
| `localization.md` | 전체 — 다국어 용어집, Placeholder 보호 |

**+ 전역(글로벌, `~/.claude/rules/`) 규칙**: `figma-description.md`(4단 계층·Format A/B·템플릿, 이 문서 3.2에서 상세 다룸)

**관찰**: 19개 룰 파일 중 **7개(37%)가 Figma 관련**이다 (figma-read/draw/write/annotation/feature-naming + 전역 figma-description + planning-packet 일부). PRD/Jira 관련은 3개, UX/카피 관련은 4개, 코드 스타일 관련은 5개. 룰 파일 개수로 봐도 Figma 파이프라인이 가장 두꺼운 영역이다.

---

## 7. Memory 시스템 — 61개 파일 전수 분석

Claude Code의 auto memory 시스템에 2026-04-27 ~ 2026-07-27 (정확히 3개월) 동안 축적된 전체 기록. 이 데이터는 "실수하거나 확정된 순간 자동으로 저장된 것"이라 **가장 왜곡 없는 시계열 근거**다.

### 7.1 타입별 집계

| 타입 | 개수 | 비율 |
|---|---|---|
| feedback (사용자 피드백 기반 행동 교정) | 44 | 72% |
| project (프로젝트 상태 스냅샷) | 8 | 13% |
| reference (외부 시스템 위치 정보) | 7 | 11% |
| user (사용자 프로필) | 1 | 2% |
| index (MEMORY.md) | 1 | 2% |
| **합계** | **61** | 100% |

### 7.2 주제별 집계 (파일명·내용 기준 재분류)

| 주제 | 개수 | 비율 |
|---|---|---|
| Figma/와이어프레임/Description/Annotation 관련 | 43 | 70% |
| Jira/티켓 프로세스 관련 | 14 | 23% |
| 기타 (카피톤, 정책 스코프, 프로젝트 컨텍스트 등) | 4 | 7% |

(일부 파일은 두 카테고리에 중복 해당 — 예: Jira 티켓 작성 규칙이면서 Figma 작업 결과물은 아님. 위 %는 "Figma 키워드 포함 여부" 기준 근사치.)

### 7.3 전체 파일 목록 (생성일순)

| 날짜 | 타입 | 파일명 | 한 줄 설명 |
|---|---|---|---|
| 2026-04-27 | feedback | feedback_figma_links.md | Figma 링크 생성 시 page-id 파라미터를 항상 포함해야 함 |
| 2026-04-27 | feedback | feedback_frame_width.md | MD 웹 리뉴얼 Figma 프레임 전체 너비 1920px, 컨텐츠 1400px 중앙 정렬 |
| 2026-04-27 | project | project_context.md | MD 멀티 프로젝트 구조와 에이전트 세팅 |
| 2026-04-27 | reference | reference_clover_modal.md | CLOver Admin 와이어프레임 모달 컴포넌트 시각 스펙 |
| 2026-04-28 | feedback | feedback_copywriting_tone.md | MD 웹사이트 마케팅 카피 확정 말투 — 명사형 종결 |
| 2026-04-30 | feedback | feedback_cowork_jira_flow.md | /cowork 실행 순서 — 문서 협업 → Jira 위치 확인 → 생성 |
| 2026-05-06 | feedback | feedback_figma_annotation_content.md | Figma 어노테이션 포함/제외 기준 |
| 2026-05-06 | feedback | feedback_figma_clip_content.md | 셀 경계 밖 배지 추가 시 clipsContent=false 필수 |
| 2026-05-06 | feedback | feedback_jira_prefix.md | MDWEB Jira 티켓 타이틀 Site \| / Admin \| prefix 필수 |
| 2026-05-06 | reference | reference_sitemap.md | marvelousdesigner.com 전체 페이지 URL 목록 |
| 2026-05-07 | feedback | feedback_prd_pm_scope.md | PRD Action Item은 정책·UX·화면 구성만, 개발/CSS 제외 |
| 2026-05-07 | user | user_role.md | 사용자는 기획자(PM) — 정책·UX·화면 구성 중심 |
| 2026-05-08 | feedback | feedback_terminology_pm.md | "PM" 약어 금지, "Payment Method" 전체 표기 |
| 2026-05-11 | feedback | feedback_figma_getnode_page.md | getNodeById()는 현재 페이지 범위에서만 동작 |
| 2026-05-11 | feedback | feedback_figma_inter_font.md | 기존 페이지 Inter 폰트 노드 있으면 Poppins만으론 에러 |
| 2026-05-11 | feedback | feedback_figma_verify_before_execute.md | 노드 수정 전 반드시 현재 값 먼저 읽어 확인 |
| 2026-05-11 | feedback | feedback_prd_doc_revision_patterns.md | PRD/Figma doc 반복 수정 요청 패턴 체크리스트 |
| 2026-05-11 | project | project_checkout_wf_policy.md | Checkout 와이어프레임 확정 UI 정책 |
| 2026-05-12 | feedback | feedback_figma_frame_spacing.md | WF·TC 행 간격 1500px로 고정 |
| 2026-05-12 | feedback | feedback_figma_instance_screen.md | createInstance() WIREFRAME Screen에 append 에러 → 코드 직접 생성만 |
| 2026-05-13 | feedback | feedback_no_major_flow.md | PRD/Confluence/Jira에 "주요 플로우" 섹션 금지 |
| 2026-05-14 | feedback | feedback_figma_structure_then_feature.md | STRUCTURE 먼저 그리는 이유 — FEATURE의 clone 베이스 |
| 2026-05-14 | feedback | feedback_figma_tc_vs_wf.md | TC 문제 제보 시 WF 건드리지 않음 |
| 2026-05-14 | reference | reference_mypage_confluence.md | MyPage Confluence 부모 페이지 ID |
| 2026-05-14 | reference | reference_mypage_figma.md | MyPage Figma 파일 키·섹션 ID 목록 |
| 2026-05-18 | feedback | feedback_figma_layoutsizing_after_append.md | FILL 설정은 appendChild() 이후에만 |
| 2026-05-18 | feedback | feedback_figma_no_footnote_text.md | WF 본문에 footnote 텍스트 삽입 금지 |
| 2026-05-18 | feedback | feedback_figma_resize_sizing_mode.md | resize() 후 primaryAxisSizingMode 재설정 필수 |
| 2026-05-19 | feedback | feedback_figma_label_single_line.md | 레이블 텍스트는 항상 한 줄 |
| 2026-05-21 | feedback | feedback_jira_subtask_type.md | MDWEB 하위 티켓은 Sub-Task(MD) 타입 |
| 2026-05-21 | feedback | feedback_jira_task_format.md | Tasks 섹션 디자인/개발 구분, 담당자명 인라인 금지 |
| 2026-05-21 | project | project_student_license_strategy.md | Student 플랜 개편 — 3개월 무료 + $8.25/월 구독, MDWEB-773 |
| 2026-05-28 | feedback | feedback_ticket_distinction.md | "태스크"=Claude Code Tasks, "티켓"=Jira 혼용 금지 |
| 2026-05-29 | feedback | feedback_ticket_patterns.md | Slack→Jira 분류·작성 판단 기준 누적 |
| 2026-06-04 | feedback | feedback_figma_rules_first.md | Figma 작업 전 외부 스킬보다 프로젝트 내부 규칙 우선 |
| 2026-06-04 | feedback | feedback_mdweb773_scope.md | MDWEB-773은 Student Plan 전용, 타 프로젝트 혼용 금지 |
| 2026-06-04 | feedback | feedback_no_abbreviations.md | 티켓·문서에 약어 사용 금지 |
| 2026-06-04 | project | project_mypage_ui_decisions.md | policy 미기재 MyPage UI 레이아웃 결정 사항 |
| 2026-06-08 | feedback | feedback_figma_bullet_list.md | Description 삽입 시 native 불릿(UNORDERED) 사용 |
| 2026-06-08 | feedback | feedback_figma_session_node_ids.md | 이전 세션 node ID는 실존 확인 후 사용 |
| 2026-06-08 | reference | reference_figma_description.md | Figma Description 전역 룰 파일 위치 |
| 2026-06-09 | feedback | feedback_wf_template_enforcement.md | createWireframeFrame() 사용 강제 배경 |
| 2026-06-15 | reference | reference_clo_doc_reader.md | Josh 개인 전용 Confluence 리더 에이전트 |
| 2026-06-16 | project | project_account_structure_change.md | MemberType 폐지, SW Account/Group 신설 |
| 2026-06-22 | feedback | feedback_figma_description_detail.md | 상태 압축 요약 금지, 실제 UI 텍스트 전부 풀어쓰기 |
| 2026-06-23 | feedback | feedback_figma_desclist_gap.md | Description Panel 카드 삽입 시 spacing 변경 가능성 |
| 2026-06-30 | feedback | feedback_figma_clone_before_build.md | 신규 생성 전 기존 동일 스타일 노드 clone 우선 |
| 2026-07-02 | feedback | feedback_wf_english_text.md | WF UI 문구는 가상 데이터 제외 전부 영문 |
| 2026-07-03 | feedback | feedback_component_numbered_note.md | 독립 UI 요소는 불릿 아닌 Numbered Note로 분리 |
| 2026-07-03 | feedback | feedback_description_header_no_bullets.md | Header Note = 화면명 한 줄만 |
| 2026-07-03 | feedback | feedback_figma_rule_restructure.md | 10개 파일 → 3개 파이프라인 + 4개 도메인으로 정리 완료 |
| 2026-07-14 | feedback | feedback_condition_no_if.md | 조건 분기 표기는 "~한 경우:" 형식만, IF/ELSE 금지 |
| 2026-07-14 | feedback | feedback_version_list_format.md | 유효 버전 표기는 항상 쉼표 나열, "all"/구간압축 금지 |
| 2026-07-14 | project | project_md_article_architect.md | Zendesk Manual → Confluence TO-BE 재구성 프로젝트 상태 |
| 2026-07-15 | feedback | feedback_default_toast_copy.md | 에러/성공 토스트 기본 문구 고정값 |
| 2026-07-16 | feedback | feedback_loading_skeleton.md | 로딩 = Skeleton 통일, 로딩 휠 금지 |
| 2026-07-16 | project | project_cancel_subscription_flow.md | Cancel Subscription = 풀페이지 3단 플로우 |
| 2026-07-16 | project | project_subscription_status_banner.md | 구독 상태 배지 폐지 → 안내 배너로 대체 |
| 2026-07-16 | reference | reference_error_states_doc.md | 에러/빈/로딩/토스트 통합 기준 문서 위치 |
| 2026-07-27 | feedback | feedback_no_jira_renewal.md | MD-WEB-RENEWAL에서 Jira 자동 생성 금지 |

### 7.4 시계열로 본 흐름

- **4월 말 (프로젝트 초반)**: Figma 기본기(링크 파라미터, 프레임 너비), PM 역할 정의, PRD 스코프 확정 — "기반 다지기" 단계
- **5월 (파이프라인 확장기)**: Figma Plugin API 함정(FILL 순서, resize, font)이 집중적으로 쌓임. 동시에 Jira 티켓 규칙(prefix, subtask 타입, 약어 금지)도 이 시기에 확정
- **6월 초 (구조 정리)**: `feedback_figma_rules_first`, `feedback_wf_template_enforcement` 등 "매번 반복하지 말고 강제 규칙으로 만들자"는 성격의 항목 등장
- **6월 말 ~ 7월 초**: **7월 3일 `feedback_figma_rule_restructure`** — 10개 산재 파일을 read→description→draw 파이프라인 + 4개 도메인으로 통합. 이 시점이 파이프라인이 "성숙"한 변곡점
- **7월 중순 이후**: Figma 관련 실수는 감소하고, 대신 콘텐츠 품질(토스트 문구 고정값, Skeleton 통일, 버전 표기 형식) 쪽으로 memory 성격이 이동 — **기계적 실수에서 콘텐츠 품질 실수로 무게중심 이동**

이 흐름 자체가 발표에서 "처음엔 도구 사용법 자체가 시행착오였는데, 규칙화가 누적되면서 점점 콘텐츠 품질 이슈로 초점이 옮겨갔다"는 성장 곡선으로 쓸 수 있다.

---

## 8. mistakes.md 전 항목 분석 (43개 사례)

`docs/backlog/mistakes.md`에 기록된 전체 사례를 날짜순으로 나열하고 카테고리를 태깅했다. (memory와 달리 mistakes.md는 파일/코드 레벨 실수까지 포함해 더 광범위하다.)

### 카테고리 범례

- **[FIGMA-API]** Figma Plugin API 기계적 함정
- **[FIGMA-DESC]** Description/Annotation 콘텐츠 구조 이탈
- **[SESSION]** 세션 연속성 문제
- **[TONE]** 문서 톤/독자 미스매치
- **[JIRA]** Jira 프로세스 실수
- **[VERIFY]** 검증 없는 보고/실행
- **[TOOL]** 툴 사용 습관 오류
- **[CODE]** 코드 구현 버그 (Flowchart Tool)
- **[PROC]** 프로세스/확인 절차 오남용

### 전체 목록

| # | 날짜 | 카테고리 | 상황 | 실수 요약 | 규칙화 결과 |
|---|---|---|---|---|---|
| 1 | 2026-06-04 | [TOOL] | `/checkout` 실행 중 신규 파일 생성 | `Write` 툴로 신규 파일 작성 시도 → "File has not been read yet" 에러 | 신규 파일은 항상 `Bash`로 직접 작성 |
| 2 | 2026-06-04(2차) | [JIRA] | 티켓 description 초안 (MDWEB-773) | SC1/SC2/SC3 약어 사용 → 2회 지적 | 사람이 읽는 결과물엔 약어 절대 금지, 전체 명칭 표기 |
| 3 | 2026-06-04(2차) | [JIRA] | 티켓 description 표 과다 사용 | 표로 작성 → "너무 길다" 피드백 | 티켓 description은 불릿+체크리스트만, 표 금지 |
| 4 | 2026-06-04(2차) | [PROC] | placeholder orange 처리 후 스크린샷 | 범위 확인 없이 먼저 실행 + 불필요한 스크린샷 | 범위 불명확 작업은 실행 전 확인, 검증 스크린샷은 요청 시만 |
| 5 | 2026-06-04(3차) | [PROC] | GNB DOC 협의 중 plan mode 반복 진입 | 단순 콘텐츠 작성에도 plan mode 절차 → 3회 거절 | "내용 작성해줘"류는 plan mode 없이 바로 실행 |
| 6 | 2026-06-04(3차) | [FIGMA-DESC] | GNB 고객지원 드롭다운 항목 | 레퍼런스 구조를 회의록 결정보다 우선시 | 레퍼런스-회의록 충돌 시 회의록 우선 |
| 7 | 2026-06-08 | [TOOL] | 학습용 파일 생성 요청 | 신규 문서 작성으로 해석 → 사용자는 기존 파일 공유를 원함 | "파일로 만들어줘" 시 신규/기존 여부 먼저 확인 |
| 8 | 2026-06-08 | [FIGMA-DESC] | CaseView Description 제목에 Unicode 원문자 | ①②③④ 원문자를 텍스트 노드에 직접 입력 | 번호는 Annotation Badge 담당, 텍스트 노드엔 요소명만 |
| 9 | 2026-06-08 | [FIGMA-DESC] | DangerZone CaseView 계정 삭제 경로 | 정책 미확인 상태로 "License Admin 이동" 추측 기입 | 삭제 플로우는 정책서 먼저 확인, 추측 금지 |
| 10 | 2026-06-08 | [FIGMA-DESC] | Account WF clone 후 Description | 10개 WF Description이 전부 동일 (Individual 내용) | Clone 후 Description 차별화를 별도 스텝으로 명시 |
| 11 | 2026-06-08 | [FIGMA-API] | Account WF TC 텍스트 수정 | Poppins Medium 미로드 폰트 에러 | 기존 노드 폰트 스타일 확인 후 전부 로드 |
| 12 | 2026-06-08 | [TOOL] | Figma DOC 콘텐츠 프레임 addBullet 호출 | `y` 파라미터 누락 → Required value missing 에러 | helper 함수 반복 호출 시 필수 파라미터 재확인 |
| 13 | 2026-06-08 | [SESSION] | 세션 재개 후 Preferences WF 어노테이션 작업 | 이전 세션 요약 frame ID를 그대로 신뢰 → null 반환 | 세션 재개 시 node 실존 여부 먼저 확인 |
| 14 | 2026-06-08 | [TONE] | My Page 정책서 Slack Canvas 초안 | Preferences 탭 누락, Invited Projects 명칭 미반영 | Figma WF 먼저 확인 후 작성, 정책 파일은 보조 참고 |
| 15 | 2026-06-08 | [TONE] | My Page 정책서 초안 형식 | 기능 명세서 형태로 작성 → BD·CX 대상과 불일치 | 대상 독자 먼저 확인 후 형식 결정 |
| 16 | 2026-06-08(2차) | [FIGMA-DESC] | DangerZone CaseView Case 2 삭제 경로 | 위 9번과 동일 유형 별도 사례 | (9번과 통합 규칙 적용) |
| 17 | 2026-06-09 | [FIGMA-API] | Checkout CASE VIEW 첫 시도 | 참조 미측정, DS spec 기본값으로 그림 → 실제와 다름 | 참조 프레임 먼저 측정, 추측 그리기 금지 |
| 18 | 2026-06-09 | [FIGMA-API] | Card1_CaseView billingToggle FILL 설정 | appendChild 이전 FILL 설정 → 에러 | FILL은 항상 appendChild 이후 |
| 19 | 2026-06-09 | [FIGMA-API] | Card1_CaseView 두 번째 스크립트 상수 참조 | 이전 스크립트 상수 재사용 시도 → ReferenceError | use_figma 호출은 매번 독립 스코프, 상수 재선언 |
| 20 | 2026-06-09 | [JIRA] | Maintenance 하위 이메일 수정 티켓 생성 | 잘못된 프로젝트(MW)에 생성, MDWEB이 정답 | cloudId 조회 후 프로젝트 구분 |
| 21 | 2026-06-09 | [JIRA] | MDWEB-819 이슈 타입 선택 | Sub-Task(MD)로 생성 → Improvement여야 함 | 에픽 직속은 level 0 타입 사용 |
| 22 | 2026-06-09(2차) | [FIGMA-DESC] | Sign In WF 화면 간 크로스레퍼런스 | "WF-01", "WF-03" 내부 구분자를 노출 텍스트에 사용 | description엔 화면명으로만 표기, 내부 구분자 금지 |
| 23 | 2026-06-09(2차) | [FIGMA-DESC] | Sign In WF-02 description | 외부 프레임명만 보고 Error 상태로 오판 | Board Header sub label이 실제 상태의 source of truth |
| 24 | 2026-06-09(2차) | [FIGMA-API] | Account FEATURE 섹션 setCurrentPageAsync | 페이지명 공백 누락으로 undefined 반환 | 페이지명 불확실 시 실제 이름 먼저 조회 |
| 25 | 2026-06-17 | [FIGMA-API] | annotation box clone 후 제목 수정 | SemiBold 폰트 누락 로드 → 에러 | clone 전 getStyledTextSegments로 스타일 확인 |
| 26 | 2026-06-17 | [TONE] | 3DS suspend2 이메일 본문 | "could not be completed"(1회성) 사용, 지속 상태 표현 필요 | 반복 알림엔 "remains [형용사]" 패턴 |
| 27 | 2026-06-17 | [FIGMA-API] | suspend2 노드 탐색 findAll 호출 | TEXT 노드에 findAll 호출 → 에러 | 노드 탐색 전 type 먼저 확인 |
| 28 | 2026-06-17 | [TONE] | Create Organization Left Panel 텍스트 | 마케팅 톤(~입니다)으로 작성 → 기능 페이지엔 해요체 필요 | 마케팅 경로 외 UI 텍스트는 무조건 해요체 |
| 29 | 2026-06-18 | [TONE] | Brand Comm Background 단락 (2회 시도) | 두 시도 모두 "ChatGPT가 더 나았다" 평가 | renewal 문서 스타일 분석 후 모방 |
| 30 | 2026-06-18 | [FIGMA-API] | Figma Slides 파일 읽기 | get_metadata를 Slides에 호출 → 미지원 에러 | Slides는 use_figma+getSlideGrid 또는 get_screenshot |
| 31 | 2026-06-18(2차) | [FIGMA-API] | Description List 카드 제거 후 삽입 | 일부 카드 미제거 → 높이 5388px 폭발 | 제거 직후 children.length 검증 |
| 32 | 2026-06-18(2차) | [FIGMA-API] | makeCard FILL 설정 | 함수 내부에서 append 전 FILL 설정 → 에러 | append 이후에만 FILL 설정 |
| 33 | 2026-06-22 | [FIGMA-DESC] | Indie Verification 폼 필드 Description | 상태를 "Default/Filled/Error"로 압축 요약 | 실제 텍스트·성공/실패 분기 전부 풀어쓰기 |
| 34 | 2026-06-22 | [JIRA] | Jira 티켓 description (MDWEB-832/833) | 간단 버그에 PRD 수준 description 작성 | 버그/개선 티켓은 슬랙 링크+현상+기대결과 3가지만 |
| 35 | 2026-06-23 | [TONE] | Slack 캔버스 polishing 방향 제안 | 에디터 관점(말투 통일)으로 접근, 독자 경험 관점 누락 | "30초 안에 무엇을 얻어야 하는가" 먼저 정의 |
| 36 | 2026-06-24 | [TOOL] | Slack Canvas 표 replace | replace가 in-place 교체 아님 → 원본 테이블까지 유실 | replace 1회만, 이후 수동 삭제 안내 |
| 37 | 2026-07-14 | [TOOL] | MCP OAuth 서브에이전트 위임 | 인증 4회 반복 실패, 콜백 URL 3회 재요청 | OAuth는 항상 메인 세션에서 직접 수행 |
| 38 | 2026-07-15 | [VERIFY] | 매뉴얼 버전 트리 구축 (3회 방향 전환) | 버전 배치 모델 가정 미검증 → 570건 게시 후 전량 재구축 | 대량 생성 전 구체 예시 3개로 모델 검증 |
| 39 | 2026-07-15 | [VERIFY] | 이미지 감사 깨진 첨부 판정 | "24건" 보고 → 실제 1건 (판정 기준 오류) | 부정 판정은 샘플 직접 확인 후 보고 |
| 40 | 2026-07-15 | [VERIFY] | 버전 매트릭스 표기 | "all"→구간압축 순으로 두 번 축약, 두 번 정정 | 유효 버전은 항상 명시적 쉼표 나열 |
| 41 | 2026-07-16 | [FIGMA-DESC] | Payment History Description 작성 | 자명한 답에도 습관적으로 "정책 확인 필요" 플래그 | 화면에 답 있는지/기본 문구로 충분한지 먼저 확인 |
| 42 | 2026-07-23 | [FIGMA-DESC] | Suspended Retry Payment 모달 4종 Description | 독립 톱레벨 번호로 나열 → 서브넘버링 요청받음 | 다단계 모달은 `-1/-2/-3` 서브번호로 그룹화 |
| 43 | 2026-07-27 | [PROC] | `/checkout` 저장 대상 확인 질문 | 선택지 1개뿐인데 AskUserQuestion 사용 → 에러 | 대안 1개면 확인 질문 대신 바로 진행 |

(코드 버그 2건 — Flowchart Tool DragState 구조분해, SVG hover zone — 은 [CODE] 카테고리로 별도, 기획 축과 무관하므로 표에서 제외했으나 원본은 mistakes.md 2026-06-22 항목 참조)

### 8.1 카테고리별 재집계

| 카테고리 | 건수 |
|---|---|
| [FIGMA-DESC] Description/Annotation 콘텐츠 구조 | 12 |
| [FIGMA-API] Plugin API 기계적 함정 | 11 |
| [TONE] 문서 톤/독자 미스매치 | 6 |
| [JIRA] Jira 프로세스 | 5 |
| [TOOL] 툴 사용 습관 | 5 |
| [VERIFY] 검증 없는 보고 | 3 |
| [PROC] 확인 절차 오남용 | 2 (5번 GNB plan mode 포함 시 3) |
| [CODE] 코드 버그 (기획 축 외) | 2 |
| **합계** | **43 + 2(CODE)** |

**Figma 관련([FIGMA-DESC]+[FIGMA-API]) 합계 23건 — 전체의 약 53%.** mistakes.md 전체 실수의 절반 이상이 Figma 작업에서 나왔다는 뜻이고, 이는 7번 섹션 memory 집계(Figma 관련 70%)와 방향이 일치한다 — 다만 mistakes.md는 코드/Jira/톤 실수도 포함해 좀 더 넓은 분모라 비율이 낮게 나온다.

---

## 9. 프로젝트 세션 로그 재구성 — My Page 리뉴얼 타임라인

`docs/backlog/projects/mypage-renewal.md`에 누적된 세션 로그를 시간순으로 재구성. 이 프로젝트 하나만으로도 기획 축 파이프라인이 어떻게 굴러갔는지 전 과정을 보여줄 수 있다.

### 2026-06-04 — 착수
- License/Billing WF(Action Row 우측 정렬, Invoice Table 헤더), Account WF(CLO-SET 칩 스타일) 개별 수정
- Annual Active WF 신규 생성 (Monthly Active clone 기반)

### 2026-06-08 — Account 구조 대량 생성 (1일 13개 프레임)
- Account 섹션 TC×WF 그리드 신규 생성 — 총 13개 프레임 (TC 3 + WF 10, 계정 유형별 분기)
- 헬퍼 함수 6종 정비: `createTitleCard`, `wrapInSection`, `createActionButton`, `applyBullets`, `makeBadge`, `makeLabel`
- 이 날 mistakes.md에 5건 기록 (폰트 로드, Description 미차별화, 세션 node ID 신뢰 문제 등) — **산출량이 급증한 날 실수도 급증하는 상관관계** 관찰 가능

### 2026-06-08 (2차) — CaseView 신규
- BasicInfo_CaseView(3케이스), DangerZone_CaseView(4케이스) 신규 생성
- 정책 파일 4가지 수정과 동시 진행 (Certification 삭제, Password 분기, Email/Nickname 통합 방식, Danger Zone 설명문구)

### 2026-06-09 — License/Billing STRUCTURE 완성 (9개 프레임)
- TC + WF1~7(구독 상태 7종) + ActionRow_CaseView 신규 생성
- WF1(Monthly Active) 전체 구현 → WF2~4는 WF1 clone 후 Action Row만 수정 (Pause Scheduled/Paused/Suspended)
- WF5(Annual)는 Action Row 제거, Invoice 1행. WF6(Student Benefit)은 혜택 배너 추가
- **License ID 웹 로그인 차단 정책 확정** — 같은 날 아래 항목과 연결됨

### 2026-06-09 — License ID 정책 확정 후 전면 정리 (동기화 지연 없이 즉시 반영된 드문 사례)
- 정책 확정 직후 같은 세션에서 Figma 삭제 작업 즉시 실행: Overview_License ID WF, License/Billing WF7, CaseView 4곳의 License ID 케이스, Danger Zone Description Box 등 **총 8개 지점 일괄 삭제**
- `docs/policy/mypage.md` §1·§3·§5·§6·§8·§9 동시 업데이트
- 이 사례는 11번 섹션의 "지연 사례"와 대조되는 **"당일 동기화 성공 사례"**로 인용 가능

### 2026-06-08 (헬퍼 함수 문서화)
- `helpers-mypage.md` 신규 생성, `figma-wireframe-protocol.md` 타이틀 카드 배경값 실측 오류 교정

### 2026-06-09 (Preferences + Invited Projects STRUCTURE, 7개 프레임)
- Preferences: TC+WF1+AIStudio_CaseView(3케이스)
- Invited Projects: TC+WF1(Empty)+WF2(Active)+CaseView(2케이스)

### 2026-06-09 (Account FEATURE 섹션, 13개 프레임)
- CLO-SET Connect(3 WF) / CLO-SET Disconnect(3 WF) / Password Change(5 WF + Row Label 2개) / Nickname(2 WF)
- 각 WF마다 clearAnnotations + Board Header 업데이트 + FEATURE annotation 1줄 주입의 표준 절차 반복 적용

### 2026-07-15 (구 파일 Coupon/Payment History Description)
- Coupon 목록 Description 삽입 (Numbered Note 4개), 협의 대기 5항목 플래그 처리
- Payment History Description 삽입 (Numbered Note 3개), Empty 상태 문구 반영
- **이 세션에서 "기본 토스트 문구 고정값" 규칙 신설** — 이후 재발 방지 사례 (mistakes.md #41과 대조: 07-16에 이 규칙이 실제로 적용되어 과잉 플래그 문제 해결)

### 2026-07-16 (Coupon Description 보강)
- Add Coupon 모달 내부 동작 누락 발견 → Numbered Note 재구성 (4개 → 5개)
- Josh가 Figma에서 직접 문구 수정한 부분 확인 후 작업 스킵 — **AI가 모든 걸 하지 않고, 사람이 직접 고친 부분을 존중하고 건너뛴 사례**

### 2026-06-09 (2차 로그 — 날짜 중복 기재, 원본 그대로 유지)

### 2026-07-23 (License/Billing 상태별 배너·모달 Description — 이번 세션 직전 세션)
- Paused/Pause Scheduled/Suspended 3개 상태 + Resume Subscription 풀페이지 신규 작성
- **모달 서브넘버링 컨벤션 확정** (mistakes.md #42와 동일 사건) — 이후 확정 컨벤션으로 기록되어 규칙화 완료

### 2026-07-27 (오늘) — TODO 일괄 완료 처리 + 문서 정리
- Josh 직접 편집: TODO 1·3~11번 완료 처리, Loading 상태 표기만 진행 중으로 남김
- 미커밋 상태로 방치돼 있던 여러 워크스트림(31개 수정 + 54개 신규 파일)을 12개 커밋으로 분리 정리
- 이 문서(AI 워크플로우 발표 준비 자료) 작성

### 9.1 이 타임라인에서 읽을 수 있는 패턴

1. **작업량이 몰릴 때 실수도 몰린다** — 06-08, 06-09처럼 대량 프레임 생성이 있었던 날 mistakes.md 기록도 집중됨
2. **정책 확정과 화면 반영이 같은 세션에서 이뤄진 사례(License ID 차단)와, 한 달 넘게 지연된 사례(MemberType 개편)가 공존** — 왜 차이가 나는지는 11번에서 다룸
3. **AI가 만든 결과를 사람이 직접 고치고, AI가 그 사실을 인지해서 중복 작업을 건너뛴 사례**가 존재 (07-16 Coupon 모달) — 이건 "협업이 매끄럽게 된 지점"으로 발표에 넣을 만함
4. **같은 컨벤션(모달 서브넘버링)이 06-08 즈음엔 없다가 07-23에 처음 확정**되고, 이후 재사용됨 — 컨벤션이 쌓이는 실시간 과정을 보여줄 수 있음

---

## 10. 커밋 히스토리 분석

전체 커밋 20개 (2026-04-27 초기 커밋 ~ 2026-07-27). 성격별 분류:

| 커밋 | 날짜(추정) | 성격 |
|---|---|---|
| 32abef22 chore: initial commit | 초기 | 레포 셋업 |
| 07231ce8 feat(manual): MD Manual Studio Phase 1 | - | 매뉴얼 스튜디오 (별개 프로젝트) |
| 76dfb6ab feat(manual): Phase 2 — Tiptap 에디터 | - | 매뉴얼 스튜디오 |
| e760df83 feat(manual): create+archive articles | - | 매뉴얼 스튜디오 |
| 76e0fe51 feat(manual): help-center landing | - | 매뉴얼 스튜디오 |
| 7447bd89 docs: checkout — md-article-architect | - | 세션 마감 로그 |
| 9313173e chore(claude): 스킬·rule·figma 파이프라인 개편 | 07-03 무렵 | **파이프라인 리팩터링 자체가 커밋으로 기록됨** |
| 24fc2349 ~ 63a734d7 (오늘 12개 커밋) | 2026-07-27 | 오늘 세션 — 워크스트림별 정리 |

### 오늘(2026-07-27) 12개 커밋 상세

| 순서 | 커밋 | 워크스트림 |
|---|---|---|
| 1 | 24fc2349 | mypage License/Billing Description + Skeleton 로딩 통일 |
| 2 | 77bb4433 | 계정 구조 전면 개편 정책 반영 (member/plan/plan-card) |
| 3 | 6d45a0d8 | Clover Admin SW Release phase2/3 정리 |
| 4 | d0e129ba | Solutions 카피 개정 + Features 콘텐츠 전략 + GNB 리서치 |
| 5 | 20bc3eba | MD-SITE 리뉴얼 요구사항 초안 13종 + 기획 Wave |
| 6 | 6f761a4d | Auth/Checkout/Contact/Error/Verification 정책 문서 신규 |
| 7 | d7da56d7 | Enterprise Trial 폼 개선안 + 스펙 문서 |
| 8 | 942f8097 | BD 자료·시스템 이메일 정책·플로우차트 툴 레퍼런스 |
| 9 | 636110ce | 사내 플로우차트 분석 툴 (코드) |
| 10 | 5e341b65 | Supabase 타입 재생성 |
| 11 | 78ad0244 | Figma 레퍼런스 캡처 테스트 스펙 |
| 12 | 3a9afff0 | mypage TODO 일괄 완료 처리 |
| 13 | 63a734d7 | MD-WEB-003 Plan 페이지 계정 구조 반영 |

**관찰**: 오늘 하루에만 13개 서로 다른 워크스트림(정책 3종, PRD/요구사항 4종, 마케팅 카피, 내부 문서, 코드 기능, 테스트, 타입)이 미커밋 상태로 쌓여 있었다. 이는 "여러 작업을 병렬로 넘나들며 진행하고, 커밋/정리는 나중에 몰아서 한다"는 작업 스타일을 보여준다 — 이 자체도 발표에서 다룰 만한 "AI와의 협업 리듬" 소재다 (여러 스레드를 열어두고 AI가 각각 진행하게 한 뒤, 사람이 나중에 통합 정리).

---

## 11. 정책 ↔ Figma 동기화 지연 — 사례 상세

### 사례 A — 지연된 케이스: 계정 구조 개편 (MemberType 폐지)

- `docs/policy/member.md`: **2026-06-23** "계정 구조 전면 개편" 확정 (memory `project_account_structure_change.md`는 2026-06-16 최초 확인으로 기록 — 논의는 6/16부터, 정책 확정은 6/23)
- `docs/backlog/todo/MD-WEB-003.md`(Plan 페이지 기획서): 최초 작성 **2026-05-07** (개편 이전, 구 MemberType 체계 기준) → **2026-07-27**에야 개편 내용 반영
- **지연 기간: 약 34일 (6/23 확정 → 7/27 반영)**
- 이 기간 동안 MD-WEB-003.md의 버튼 상태 매트릭스는 폐지된 MemberType(Individual/CompanyID/Academic/Indie/License ID) 체계로 남아 있었음 — 만약 이 문서를 기준으로 개발이 진행됐다면 잘못된 스펙으로 구현될 위험이 있었던 기간

### 사례 B — 즉시 동기화된 케이스: License ID 웹 로그인 차단

- 정책 확정과 **같은 세션(2026-06-09)**에서 Figma WF 7개 삭제, CaseView 5곳 케이스 제거, Description 전체 참조 제거(0건 잔존 검증)까지 완료
- 차이점: 이 정책은 "삭제"라는 단순 액션(존재하던 것을 지운다)이라 반영 범위가 명확했던 반면, 계정 구조 개편은 "체계 자체를 재정의"하는 작업이라 영향 범위가 넓고 즉시 판단하기 어려웠을 가능성

### 사례 C — 몰아서 처리된 케이스: Coupon/Payment History Description

- 구 파일(`PeCid7uJcg0HenViaaiHUp`)의 Coupon/Payment History 화면은 정책 문서가 이미 존재했음에도 Description 작성이 **2026-07-15~16에 한 세션에서 몰아서** 진행됨
- `docs/backlog/projects/coupon-description.md`라는 별도 파일로 관리되다가, 07-16에 mypage-renewal.md로 통합 후 삭제 — **관리 파일이 쪼개져 있다가 나중에 합쳐지는 패턴**도 관찰됨

### 11.1 세 사례 비교

| 사례 | 정책 확정 → 반영 소요 | 반영 방식 |
|---|---|---|
| A. 계정 구조 개편 | 약 34일 | 나중에 한 번에, 문서 하나(MD-WEB-003)만 우선 반영 — Figma WF는 아직 미반영 상태로 남아있을 가능성 있음(별도 확인 필요) |
| B. License ID 차단 | 0일 (당일) | 삭제 액션이라 영향 범위 명확 → 정책 확정 세션에서 즉시 전면 정리 |
| C. Coupon/Payment Description | 확정 시점 불명(정책은 이전부터 존재) | 여러 세션에 걸쳐 몰아서, 관리 파일 통합까지 발생 |

**패턴 요약**: 변경이 "명확한 삭제/추가"일 때는 즉시 반영되지만, "체계 자체의 재정의"처럼 영향 범위가 넓은 변경은 지연되고 몰아서 처리되는 경향. 이건 도구의 문제라기보다 **1인 기획자가 정책 변경의 파급 범위를 그때그때 전수 파악하기 어렵다는 구조적 한계**로 보인다 — 발표에서 "이 부분이 자동 추적되면 무엇이 달라지는가"를 이야기할 수 있는 대목.

---

## 12. wave-prep 미스매치 — 왜 이 프로젝트엔 안 맞았는가

CLAUDE.md에 정의된 공식 워크플로우:

```
/wave-prep  → 스코프 정의 → pm→design→figma 순차 게이트 → Gate 3 자동 검증
/wave-integrate → 실수노트 누적 → 로그 작성 → 파일 아카이브 → Jira 동기화
/orch → 오케스트레이터 상태 복구
```

이 구조는 `requirements/waves/active/`에 PACKET-{agent}.md / REPORT-{agent}.md 파일을 만들어 채널 간 통신하는 방식이고, `planning-packet.md` 룰에 Gate 3a(wf-validator)/Gate 3b(desc-validator) 같은 **별도 검증 에이전트**까지 정의돼 있다. 빌드 게이트("`tsc --noEmit` + lint + build PASS 후 QA")도 CLAUDE.md 최상단 Cross-Project Rules에 명시돼 있다.

Josh 본인 확인 (2026-07-27): *"다른 프로젝트에선 개발까지 해서 모르겠는데, 여기서는 개발 업무는 하지 않고 기획 및 정책잡기라 문서 위주 또는 설계서 위주의 것이고 화면 그리기라서 별로 쓸 일이 없음."*

### 12.1 구조적 미스매치 지점

| wave-prep이 전제하는 것 | 이 프로젝트의 실제 |
|---|---|
| PM → 디자인 → Figma → **개발**까지 이어지는 파이프라인 | 개발자 없음, Josh 혼자 정책/PRD/화면까지만 담당 |
| PACKET/REPORT 파일을 채널별로 만들고 완료 신호로 파일 존재 여부를 확인 | 실제로는 `docs/backlog/projects/mypage-renewal.md` 하나에 세션 로그를 누적하는 방식으로 대체 |
| Gate 3a/3b처럼 별도 검증 에이전트가 wf-validator/desc-validator 역할 수행 | Josh 본인이 스크린샷 보고 직접 검증 (figma-write.md Pre-flight 체크리스트로 셀프 체크) |
| 빌드 게이트(`tsc`/lint/build) 통과 후 QA | 해당 없음 — 화면과 문서가 최종 산출물 |

### 12.2 실제로 벌어진 일 (오늘 세션 기준)

wave-prep 없이 바로 License/Billing Description 작업으로 진입 → 이건 "게이트를 생략해서 문제가 생겼다"가 아니라,애초에 **게이트가 필요한 산출물(코드)이 이 프로젝트엔 없기 때문**. `docs/backlog/projects/mypage-renewal.md`가 PACKET/REPORT를 대신해 "무엇을 했고 무엇이 남았는지"를 기록하는 역할을 이미 하고 있었고, 이번 세션 시작(`/initiate`)도 바로 이 파일을 읽어 상태를 복구했다.

### 12.3 발표에서 다룰 수 있는 각도

- "공식 오케스트레이션 도구가 있다고 무조건 써야 하는 건 아니다 — 업무 형태(코드 산출물 유무)에 따라 맞는 무게의 프로세스가 다르다"
- "1인 기획자 워크플로우에는 세션 로그(자유 형식 markdown) + 규칙 파일(rules) + memory(자동 축적) 조합이 게이트형 오케스트레이션보다 실질적으로 더 잘 맞았다"

---

## 13. 효과 분석 종합

### 13.1 산출물 규모 (My Page 리뉴얼 프로젝트, 세션 로그 기준 근사치)

| 작업 | 생성된 Figma 프레임 수 |
|---|---|
| Account 섹션 TC×WF 그리드 (계정 유형별) | 13 |
| Account CaseView (BasicInfo, DangerZone) | 2 |
| License/Billing STRUCTURE (구독 상태 7종 + CaseView) | 9 |
| Account FEATURE (CLO-SET 연결/해제, 비밀번호, 닉네임) | 13 |
| Preferences 섹션 | 3 |
| Invited Projects 섹션 | 4 |
| **합계 (근사)** | **약 44개 프레임** |

각 프레임당 평균 2~5개의 Numbered Note Description이 붙는 구조라, Description 텍스트 블록 자체는 100개 이상 작성·검증된 것으로 추정. (전수 집계 아님 — 세션 로그의 "완료" 표시 기준 근사치)

### 13.2 "규칙으로 박아두면 없어지는 실수" vs "매번 다시 발생하는 실수"

8번 섹션 표를 재해석하면:

| 유형 | 해당 카테고리 | 재발 여부 |
|---|---|---|
| 콘텐츠 구조·표기 규칙 | [FIGMA-DESC], [JIRA] | 규칙 문서화 이후 **동일 사례 재발 없음** — 다만 매번 새로운 변형(패턴)으로 등장 |
| 프로세스/역할 규칙 | [TONE] 중 일부, [PROC] | 규칙 정착 후 재발 없음 |
| API 기계적 함정 | [FIGMA-API] | 유사 유형(FILL 순서, node 검증)이 **다른 컴포넌트 작업에서 재발** |
| 검증 습관 | [VERIFY] | 세 사례가 짧은 기간(07-15) 내 반복 — 습관화 미흡 |

→ **규칙(rule)으로 강제할 수 있는 실수는 실제로 사라졌다.** 반면 "매번 다른 맥락에서 같은 종류의 실수를 반복하는" 유형(API 함정, 검증 습관)은 규칙 문서만으로는 완전히 근절되지 않았다 — 이건 "규칙이 부족해서"가 아니라 **매번 새 컴포넌트/새 맥락에서 처음부터 다시 판단해야 하는 작업 특성** 때문으로 보인다.

### 13.3 정책 → 화면 반영 지연의 실체

11번 섹션 참조. 핵심 수치: **약 34일 지연 사례 1건**, **당일 반영 사례 1건**. 차이는 "삭제처럼 명확한 변경"이냐 "체계 재정의처럼 범위가 넓은 변경"이냐에 있음.

### 13.4 세션 연속성 확보

- 이전: "이전 세션 요약을 그대로 믿고 Figma node ID를 재사용" → null 에러 (mistakes.md #13, memory `feedback_figma_session_node_ids`)
- 이후: `/initiate` 세션 시작 루틴이 표준화되어, 이번 세션도 시작과 동시에 MCP 연결 확인 + `mypage-renewal.md` 프로젝트 상태 파악 + 최근 커밋 확인까지 자동 수행

### 13.5 문서 정리 자체도 이번 세션에서 실증

오늘 세션에서 브랜치 없이 방치돼 있던 미커밋 변경사항(31개 수정 + 54개 신규, 10번 섹션 표의 13개 워크스트림 혼재)을 워크스트림별로 분리해 **13개 커밋**으로 정리 — "무엇이 무슨 작업이었는지"를 커밋 단위로 복원 가능한 상태로 전환. 이 작업 자체가 이번 발표 준비의 출발점이 됨.

---

## 14. 시각화 후보 — 차트별 데이터 스펙

| # | 차트 아이디어 | 형태 | 데이터 소스(이 문서 섹션) |
|---|---|---|---|
| 1 | 기획 vs 매니지 축 비중 | 도넛 또는 막대 | 2번 섹션 정성 설명 + 7번 memory 개수(43 vs 나머지) |
| 2 | 정책→PRD→Figma 파이프라인 흐름도 | 플로우 다이어그램 | 3.1 다이어그램 확장 |
| 3 | Figma 4단계 파이프라인 상세 다이어그램 | 플로우/스윔레인 | 3.2 섹션 |
| 4 | Memory 61개 시계열 누적 그래프 (타입별 스택) | 누적 막대/영역 | 7.3 표 전체 (날짜 x 타입) |
| 5 | Memory 타입 비중 | 파이/도넛 | 7.1 표 |
| 6 | mistakes.md 카테고리별 건수 | 막대 | 8.1 표 |
| 7 | mistakes.md 월별 발생 추이 | 라인/막대 | 8번 표의 날짜 컬럼 재집계 |
| 8 | 프로젝트별 산출 프레임 수 | 막대 | 13.1 표 |
| 9 | 정책 변경 → 화면 반영 소요 타임라인 (3사례 비교) | 간트/타임라인 | 11번 섹션 |
| 10 | 커밋 워크스트림 분포 (오늘 13개 커밋) | 막대/트리맵 | 10번 섹션 표 |
| 11 | "재발 방지 성공 vs 반복 재발" 대조 | 2열 비교 카드 | 13.2 표 |
| 12 | 룰 파일 37% Figma 비중 | 도넛 | 6번 섹션 |

---

## 15. 발표 스토리라인 초안 (선택 사용)

필요 없으면 무시. 순서 감 잡기용 초안:

1. **문제 제기**: "나는 개발자가 아닌데, 어떻게 AI와 함께 화면·정책 설계 전체를 굴렸는가"
2. **두 축 프레임 제시**: 기획 vs 매니지, 기획이 압도적
3. **파이프라인 공개**: 정책↔Figma 4단계 루프 다이어그램
4. **인프라 소개**: 에이전트/스킬/룰 파일이 실제로는 "코드처럼 문서화된 작업 매뉴얼" 역할
5. **성장 곡선**: memory 61개 시계열 — 처음엔 도구 사용법 실수, 점점 콘텐츠 품질 이슈로 무게중심 이동
6. **효과 제시**: 산출 프레임 수(약 44개), 재발 방지 성공 사례
7. **한계 솔직히**: 정책→화면 동기화 지연(34일 사례), API 기계적 실수 재발
8. **왜 공식 오케스트레이션(wave-prep)을 안 썼는가**: 업무 형태에 안 맞는 프로세스는 억지로 안 씀
9. **다음 단계 제안(선택)**: 무엇이 자동화되면 지연이 줄어들지에 대한 화두 (결론은 발표자 본인이 낸다)

---

## 16. 다루지 않은 것 / 후속 작업

- 매니지 축(Slack 트리아지, 버그 대응, 세션 관리) 상세 분석 — 이번 세션 memory에 거의 기록이 없어 별도 조사 필요
- 실제 슬라이드/다이어그램 제작 — 14번 표를 기준으로 별도 요청 시 진행
- 개선안·새 파이프라인 설계 제안 — 발표 후 별도 논의
- MD-WEB-003.md의 Figma WF 반영 여부 — 문서는 반영됐으나 실제 Figma 화면(Plan 페이지)이 6/23 개편을 반영했는지는 이번 조사에서 확인하지 못함, 별도 확인 필요

---

## 17. 용어집 (발표 청중이 비MD 인원일 경우 대비)

| 용어 | 설명 |
|---|---|
| MemberType | (폐지됨, 2026-06-23) 회원 유형 구분 체계. Non-Member/Individual/Student/CompanyID/Academic/Indie/License ID 7종이었음 |
| Member | (신규) MemberType 폐지 후 통합된 개념. 로그인한 모든 사용자 |
| SW Account | (신규, 구 License ID) Group Owner가 생성하는 라이선스 할당 전용 계정. 웹 로그인 불가, 데스크탑 앱 전용 |
| Group | (신규) Enterprise/Academic/Indie 구매 시 생성되는 조직 단위. 구 CompanyID 개념을 대체 |
| Numbered Note | Figma Description Panel에서 화면 내 독립 UI 요소 하나를 가리키는 번호(①②③) + 설명 블록 |
| L0~L3 | Description 계층 구조. L0=화면명, L1=컴포넌트(Numbered Note), L2=속성(불릿), L3=속성 상세(서브불릿) |
| STRUCTURE / FEATURE | Figma WF 섹션 타입. STRUCTURE=화면의 모든 요소를 완전히 문서화, FEATURE=액션 하나(클릭→결과)만 표기 |
| CaseView | MemberType·조건별 UI 분기를 한 화면에 케이스별로 나열해 비교하는 프레임 |
| TC (Title Card) | 와이어프레임 그리드에서 행/열 제목 역할을 하는 카드. WF(실제 화면)와 완전히 다른 요소 — 혼동 시 잘못된 걸 수정하게 됨 |
| WF (Wireframe) | 실제 화면 레이아웃을 나타내는 프레임 |
| PACKET / REPORT | wave-prep 오케스트레이션에서 에이전트 채널 간 주고받는 착수 지시서/결과 보고서 파일 |
| Gate 3a / 3b | wave-prep에서 와이어프레임 시각 검증(wf-validator)과 Description 룰 검증(desc-validator)을 병렬로 수행하는 단계 |

---

## 18. 부록 A — mistakes.md 원문 전체 (참고용, 발표 준비 시 발췌해서 사용)

이 부록은 8번 섹션 표의 근거가 된 원본 텍스트다. 발표 슬라이드에 인용문을 그대로 쓰고 싶을 때 이 부록에서 복사한다.

> ## 2026-07-23
>
> **상황:** Suspended 상태 Retry Payment 모달 4종(확인/완료/실패1/실패2)을 Description Panel에 ②③④⑤⑥ 개별 톱레벨 번호로 작성
> **실수:** 실패 모달 2개(잔액 부족 / 일반 오류)를 별도 노트로 분리해서 넣음 → 사용자가 "2 3 4를 2-1 2-2 2-3으로 바꿔서" 요청, 확인/완료/실패를 부모 버튼 번호 아래 서브 번호로 묶고 실패 2종은 하나의 `실패 케이스:` 블록으로 통합
> **원인:** 같은 트리거(버튼 하나)에서 갈라지는 모달 상태들을 전부 독립 톱레벨 Numbered Note로 나열하는 게 기본값이라고 가정
> **다음엔:** 하나의 액션에서 파생되는 다단계 모달(확인→완료/실패)은 부모 번호에 `-1/-2/-3` 서브 번호를 붙여 그룹으로 묶는다

> ## 2026-07-16
>
> **상황:** Payment History Description 작성 중 View PDF 실패 케이스와 Status Badge 상태값을 작성
> **실수:** 실제 정책이 이미 화면에 자명하거나(Status는 Paid 하나뿐) 일반적인 실패 케이스인데도 습관적으로 `*(정책 확인 필요)*` 플래그를 붙임. Josh가 "Paid 밖에 없긴 해" / "실패는 error 밖에 없고 그냥 something went wrong으로 하면 되지 않냐"며 직접 정정
> **원인:** "불확실하면 플래그부터 붙인다"는 규칙을 과도하게 적용
> **다음엔:** 플래그를 붙이기 전에 (1) 화면 스크린샷에 답이 이미 있는지, (2) 일반적인 성공/실패 케이스라 기본 문구로 충분한지 먼저 확인

> ## 2026-07-14
>
> **상황:** Figma Description 삽입을 위해 md-figma 서브에이전트에 위임 후, Figma MCP OAuth 인증을 서브에이전트가 진행
> **실수:** 인증이 4회 반복 실패. 서브에이전트가 재개될 때마다 `authenticate`를 다시 호출해 이전 `code_verifier`를 덮어쓰거나, 재호출을 안 해도 `No OAuth flow in progress` 반환. Josh에게 콜백 URL을 3번이나 다시 요청하게 만듦
> **원인:** 서브에이전트는 응답 종료 후 SendMessage로 재개될 때마다 transcript 기반 새 프로세스로 뜸 → `authenticate`가 메모리에 저장한 PKCE 상태가 유실
> **다음엔:** MCP OAuth 인증은 항상 메인 세션에서 직접 수행한다

> ## 2026-06-24
>
> **상황:** Slack Canvas 계정 유형 표를 `slack_update_canvas` `replace` 액션으로 교체
> **실수:** `replace` + `section_id`는 기존 섹션을 실제로 교체하지 않고, 새 섹션을 삽입한 뒤 원본 섹션을 빈 `||` 플레이스홀더로 남김. 이를 지우려고 빈 텍스트로 replace했더니 방금 삽입한 테이블까지 사라짐
> **원인:** Slack Canvas `replace` API 동작을 "in-place 교체"로 잘못 가정
> **다음엔:** Slack Canvas 표를 변경할 때는 기존 섹션 내용을 원하는 최종 값으로 replace 1회만 실행한다

> ## 2026-06-23
>
> **상황:** Slack 캔버스 polishing 방향 제안
> **실수:** "어떻게 하면 독자가 편할지"를 물었는데 말투 통일·오탈자 수준의 에디터 관점 리스트를 먼저 제시함
> **원인:** 독자 경험이 아닌 문서 일관성 검토 모드로 접근
> **다음엔:** 문서 피드백 요청 시 "이 문서를 처음 여는 사람이 30초 안에 무엇을 얻어야 하는가"를 먼저 정의하고 그 관점에서 문제를 찾는다

> ## 2026-06-22
>
> **상황:** Indie Verification 폼 "회사소개서 또는 포트폴리오" 필드 Description 작성
> **실수:** 상태를 `Default/Filled/Error 상태`로 한 줄 압축 요약 → 사용자 "성의 없어진 느낌" 피드백 후 재작성
> **원인:** "한 칸에 다 들어가야 한다"는 공간 제약에 집중하다 실제 placeholder 텍스트, 에러 메시지 원문, 성공/실패 분기를 생략함
> **다음엔:** 공간이 길어져도 각 상태에 실제 표시 문자열(따옴표 포함)과 트리거별 성공/실패 서브불릿 전부 작성

> ## 2026-06-22 (Flowchart Tool)
>
> **상황:** FlowchartCanvas.tsx 드래그 미리보기 선 렌더링
> **실수:** `DragState` 인터페이스는 `mouseX`/`mouseY`인데, 드래그 preview line 코드에서 `const { x: mx, y: my } = dragState`로 destructuring → TypeScript 오류
> **원인:** 인터페이스 필드명을 확인하지 않고 `x`/`y`로 가정
> **다음엔:** drag 관련 state 필드는 항상 `mouseX`/`mouseY` 패턴 사용

> **상황:** hover 어포던스 (＋버튼, 연결 포인트 ●) 구현
> **실수:** `onMouseLeave`를 노드의 작은 hit rect에 달았더니 마우스가 ●이나 ＋로 이동하는 순간 hover가 꺼짐 → 드래그 연결도 불가
> **원인:** SVG에서 `mouseleave`는 같은 `<g>`의 형제 이동 시 발동하지 않는다는 특성을 활용하지 않음
> **다음엔:** 노드 + 어포던스 전체를 하나의 `<g onMouseEnter/Leave>`로 감싸고, 내부에 어포던스까지 커버하는 큰 투명 rect를 background로 추가

> ## 2026-06-22
>
> **상황:** Jira 티켓 description 초안 작성 (MDWEB-832, 833)
> **실수:** 현상·기대결과·슬랙 링크만 있으면 되는 간단한 티켓에 Tasks 섹션·개선 방향·원인 추정까지 거창하게 작성 → 사용자 "졸라 거창하게 썼네" 피드백 후 전면 재작성
> **원인:** Maintenance 티켓도 PRD 수준의 description이 필요하다고 가정
> **다음엔:** 유저 피드백 기반 버그/개선 티켓은 슬랙 링크 + 현상 + 기대 결과 3가지만

> ## 2026-06-18 (2차)
>
> **상황:** Brand Comm 브리핑용 Background 단락 작성
> **실수:** 두 번의 시도 모두 사용자가 "별로임 그냥 챗지피티랑 썼음"으로 평가 → 내가 쓴 것보다 ChatGPT로 쓴 문서가 더 나았음
> **원인:** 랜딩 관련 내용에만 집중해달라는 요청에도 결제 시스템 내용을 혼입시켰고, 문장 자체가 AI 냄새 나는 corporate 문체
> **다음엔:** Brand Comm 문서 작성 시 사용자가 공유한 renewal document 스타일을 먼저 분석 — 선언 없이 사실 나열, 헤지드 랭귀지, 결론보다 관찰

> **상황:** Figma Slides 파일(1zCBixRUiKPe1nFLUDCT2j) 내용 읽기
> **실수:** `get_metadata`를 Slides 파일에 호출 → "This tool is not supported for Slides files" 에러
> **원인:** get_metadata는 design 파일만 지원. Slides 미지원
> **다음엔:** Slides 파일은 `use_figma` + `getSlideGrid()` 또는 `get_screenshot`으로 접근

> ## 2026-06-18
>
> **상황:** Description List 기존 카드 제거 후 새 카드 삽입
> **실수:** `[...descList.children].forEach(child => child.remove())`로 제거했는데 `4614:6075` 카드가 남아 있었음 → descList 높이 5388px 원인
> **원인:** 첫 번째 use_figma 호출에서 제거 후 append했지만 두 번째 호출 시 해당 노드가 남아 있었음. 제거 성공 여부를 검증하지 않고 바로 다음 단계로 진행
> **다음엔:** 기존 카드 제거 직후 `descList.children.length`를 return해서 0인지 확인

> **상황:** makeCard 함수 내 card.layoutSizingHorizontal = 'FILL' 설정
> **실수:** descList.appendChild(card) 이전에 FILL 설정 → "FILL can only be set on children of auto-layout frames" 에러
> **원인:** makeCard 함수 내부에서 card를 만들면서 바로 FILL 설정
> **다음엔:** FILL 설정은 반드시 makeCard() 반환 후 descList.appendChild(card) 직후에 설정

> ## 2026-06-17
>
> **상황:** annotation box clone 후 제목 텍스트 수정
> **실수:** `loadFontAsync`에 Regular + Medium만 로드하고 SemiBold 누락 → clone된 박스의 HR 텍스트 노드가 SemiBold여서 characters 설정 시 에러
> **원인:** clone한 source 노드에 어떤 폰트 스타일이 들어있는지 미리 확인하지 않음
> **다음엔:** annotation box clone 전 `getStyledTextSegments(['fontName'])`으로 사용된 스타일 확인 후 loadFontAsync 목록 확정

> ## 2026-06-09
>
> **상황:** Checkout CASE VIEW 3개 프레임 생성 — 처음 시도에서 DS spec 기본값으로 그림
> **실수:** Card1_CaseView를 DS spec 기준(58px label, 14px label font, 16px OS padding)으로 생성 → 사용자 "실제 structure에서의 것과 좀 다르다 component들이?" 지적
> **원인:** 참조 프레임(FEATURE Annual 1)을 먼저 측정하지 않고 figma-wireframe-ds.md 기본값으로 바로 그림
> **다음엔:** Checkout WF 작업 시 반드시 참조 프레임을 먼저 측정. 참조 없이 그리기 금지

> **상황:** Card1_CaseView billingToggle() 함수에서 FILL 설정
> **실수:** `sec.layoutSizingHorizontal = 'FILL'`을 `parent.appendChild(sec)` 이전에 호출 → 에러
> **원인:** append 전 FILL 설정 시도. 같은 실수가 `dropdown()` 함수에서도 반복 발생
> **다음엔:** FILL 설정은 반드시 appendChild() 이후. 새 함수 작성 시 "append → FILL" 순서 의식적으로 확인

> **상황:** Card1_CaseView 두 번째 use_figma 스크립트에서 상수 참조
> **실수:** 첫 번째 스크립트에서 정의한 `const BADGE_X = FORM_X`를 두 번째 스크립트에서 그대로 사용 → "ReferenceError: BADGE_X is not defined"
> **원인:** use_figma 호출은 각각 독립 스코프
> **다음엔:** 각 use_figma 스크립트는 완전히 독립적으로 작성

> **상황:** Jira 티켓 생성 — Maintenance 하위 이메일 수정 티켓
> **실수:** "Admin 프로젝트"를 찾다가 MW 프로젝트의 MW-654로 잘못 생성 (MW-810). MDWEB-625가 정답이었음
> **원인:** cloudId 조회 없이 "marvelousdesigner.atlassian.net" 하드코딩 시도 → 실패 후 "Admin" 키워드로 프로젝트 검색
> **다음엔:** Jira 티켓 생성 요청 시 프로젝트 키를 먼저 확인

> **상황:** Jira 이슈 타입 선택 — MDWEB-819 생성
> **실수:** Sub-Task(MD)로 생성 → 사용자 "Subtask면 안돼 improvement로 넣었어야지" 지적
> **원인:** Maintenance 에픽 하위 직속 티켓임에도 Sub-Task(MD) (level -1) 선택
> **다음엔:** 에픽 직속 하위 티켓은 Improvement(MD) / Task(MD) / Bug(MD) 등 level 0 타입 사용

> ## 2026-06-09 (2차)
>
> **상황:** Sign In WF description 패널 내 화면 간 크로스레퍼런스 표기
> **실수:** description 본문에서 다른 화면을 "WF-01", "WF-03 (비밀번호 찾기)으로 이동" 형태로 표기 → 사용자 "WF- 이런식으로 하지마 누가 알아 진짜" 지적
> **원인:** 작업 중 내부 구분자로 쓰던 WF-XX 표기를 그대로 사용자 노출 텍스트에 그대로 넣음
> **다음엔:** description 텍스트에서 화면 참조는 반드시 화면명으로 — "Sign In 화면으로 이동" 등. WF-XX, Frame-XX 같은 내부 구분자는 description에 절대 노출 금지

> **상황:** Sign In WF-02 description 작성
> **실수:** 외부 프레임 이름("SIGN IN — ERROR")을 보고 description을 "Error (인증 실패)" 상태로 작성 — 실제 화면은 ID/PW 입력 폼(정상 상태)이었음
> **원인:** Board Header sub label("SIGN IN — ID/PW FORM")을 확인하지 않고 외부 프레임명만 보고 판단
> **다음엔:** description 작성 전 반드시 Board Header texts[2] (sub label) 확인 — sub label이 실제 상태의 source of truth

> **상황:** Account FEATURE 섹션 작업 시작 직후 첫 번째 `setCurrentPageAsync` 호출
> **실수:** `figma.root.children.find(p => p.name === 'MyPage')` — 공백 없는 이름으로 조회해 `undefined` 반환, `setCurrentPageAsync` 에러 발생
> **원인:** 이전 세션 요약에서 "My Page" 페이지를 코드로 쓸 때 공백을 생략
> **다음엔:** 페이지 이름이 불확실하면 먼저 `figma.root.children.map(p => p.name)` 조회 스크립트를 실행해 실제 이름 확인 후 사용

> ## 2026-06-08
>
> **상황:** CaseView Description 제목 텍스트에 Unicode 원문자 사용
> **실수:** DangerZone Description 제목 노드에 ④처럼 Unicode 원문자를 그대로 입력 — 사용자 "④ <- 이거 절대로 쓰면 안 됨" 지적
> **원인:** `figma-description.md`의 `**① [요소명]**` 형식을 Figma 텍스트 노드에도 그대로 적용
> **다음엔:** Description Title 텍스트 노드에는 요소명만. 번호는 Annotation Badge가 담당. 원문자는 Figma 텍스트 노드에서 절대 사용 금지

> **상황:** DangerZone CaseView Case 2 (Company ID) 계정 삭제 경로 작성
> **실수:** Company ID 계정 삭제 시 "License Admin 이동" 버튼을 CaseView에 추가 — 실제로는 Contact Us 경로만 존재
> **원인:** 정책서를 재확인하지 않고 "계정 관리자 화면에서 삭제 가능할 것"이라고 추측
> **다음엔:** 계정 삭제·탈퇴 관련 플로우 작업 전 `docs/policy/mypage.md` Danger Zone 섹션 반드시 먼저 읽기

> ## 2026-06-08
>
> **상황:** Account WF clone 후 Description 작성
> **실수:** clone된 10개 WF의 Description이 모두 동일한 Individual 내용 — "Description이 모두 똑같군 왜 그러지" 사용자 지적
> **원인:** clone()은 모든 내용을 그대로 복사함. WF마다 policy 기반으로 내용을 다르게 써야 한다는 것을 clone 작업과 분리해서 생각하지 않음
> **다음엔:** WF clone 계획 수립 시 Description 업데이트를 별도 스텝으로 명시

> **상황:** Account WF TC 텍스트 수정 중 폰트 에러 발생
> **실수:** `Cannot write to node with unloaded font "Poppins Medium"` — Poppins Semi Bold, Regular만 로드하고 Medium 누락
> **원인:** 기존 노드의 폰트 스타일을 확인하지 않고 자주 쓰는 스타일만 미리 로드함
> **다음엔:** 기존 텍스트 노드 수정 전 `getStyledTextSegments(['fontName'])`으로 실제 사용 중인 폰트 스타일 목록 확인 후 전부 로드

> **상황:** Figma DOC 콘텐츠 프레임 2 작성 중 addBullet 함수 호출
> **실수:** `addBullet(cf2, '없어지는 것 텍스트')` 호출 시 `y` 파라미터 누락 → `Required value missing` 에러
> **원인:** 반복적인 불릿 추가 코드 작성 중 일부 줄에서 `, y` 인자를 빠뜨림
> **다음엔:** helper 함수 반복 호출 시 모든 필수 파라미터 일관성 재확인 후 실행

> **상황:** 세션 재개 직후 Preferences WF 어노테이션 추가 작업
> **실수:** 이전 세션에서 생성했다고 요약된 frame ID(5689:195 등)를 그대로 믿고 `getNodeById`를 호출했으나 null 반환. 프레임이 존재하지 않았음.
> **원인:** 세션 요약은 "의도한 작업"을 기술하는 것이지 Figma에 실제 저장된 상태를 보장하지 않음
> **다음엔:** 세션 재개 시 이전 요약에 기재된 node ID를 사용하기 전에 반드시 실존 여부를 먼저 확인한다

> ## 2026-06-08
>
> **상황:** My Page 리뉴얼 정책서 Slack Canvas 초안 작성
> **실수:** policy/mypage.md 기반으로 작성 → Preferences 탭 누락, Invited Projects 명칭 미반영, MDWEB-773 항목 혼입
> **원인:** Figma WF 확인 없이 기존 정책 문서만 참고해 작성함
> **다음엔:** My Page 관련 문서 작성 시 Figma WF 먼저 읽고 실제 확정된 화면 기준으로 작성

> **상황:** My Page 정책서 초안 작성
> **실수:** 첫 초안을 기능 명세서 형태(Feature ID, Flow 테이블 등)로 작성 → BD·CX 대상 정책서와 맞지 않음
> **원인:** requirements/*.md 문서 형식을 그대로 따라감
> **다음엔:** 대상 독자 먼저 확인. BD·CX 대상이면 정책 브리핑 형태로 작성

> ## 2026-06-04 (3차)
>
> **상황:** GNB DOC 프레임 내용 협의 중 plan mode 반복 진입
> **실수:** 사용자가 내용 좁혀달라고 할 때마다 plan 파일 수정 후 ExitPlanMode 호출 → 사용자가 세 번 거절 ("아니 님 뭐함?")
> **원인:** Auto mode에서 단순 콘텐츠 작성 작업에도 plan mode 절차를 밟으려 함
> **다음엔:** "내용 작성해줘" 류의 요청은 plan mode 없이 바로 실행

> **상황:** GNB 고객 지원 드롭다운 항목 설정
> **실수:** 레퍼런스(3913:4119) 기준으로 "자주 묻는 질문"을 드롭다운에 넣었으나, 회의록에서 "FAQ → GNB 제외"로 결정된 상태였음
> **원인:** 레퍼런스 구조를 회의록 결정보다 우선시함
> **다음엔:** Figma 레퍼런스와 회의록 결정이 충돌할 경우, 반드시 회의록 결정 우선

> ## 2026-06-04 (2차)
>
> **상황:** MDWEB-773 티켓 description 작성 중 약어 사용
> **실수:** SC1/SC2/SC3으로 표기 → 사용자가 두 번 지적 ("도대체 누가 알아듣겠어?")
> **원인:** 내부 메모 습관이 외부 문서에 그대로 반영됨
> **다음엔:** 티켓·PRD·Confluence 등 사람이 읽는 결과물에서는 약어 절대 사용 금지

> **상황:** 티켓 description 초안 작성 시 표(table) 과다 사용
> **실수:** 표로 작성 → 사용자가 "너무 길다, 표 쓰지 말고" 피드백
> **원인:** 정보량이 많을 때 표로 정리하려는 기본값
> **다음엔:** 티켓 description은 불릿 + 체크리스트만. 표는 사용 금지

> **상황:** {} placeholder orange 처리 작업 후 스크린샷 촬영
> **실수:** 사용자가 "이메일 템플릿 한정해서"라고 말했을 때 이미 작업 완료 후였음 + 불필요한 스크린샷 촬영 시도
> **원인:** 범위 확인 없이 먼저 실행
> **다음엔:** 범위가 명확하지 않은 작업은 실행 전 한 번 확인

> ## 2026-06-04
>
> **상황:** `/checkout` 실행 중 `session-2026-06-04.md` 신규 파일 생성 시도
> **실수:** `Write` 툴로 신규 파일 작성 → "File has not been read yet" 에러 발생
> **원인:** `Write` 툴은 신규 파일이라도 Read 선행을 요구함
> **다음엔:** 새 파일 생성은 항상 `Bash`로 직접 작성

> ## 2026-06-08
>
> **상황:** 학습용 파일 생성 요청 처리
> **실수:** "학습용으로 파일 만들어줘" → 즉시 `docs/learning/` 디렉토리 생성 + 문서 작성 시도 → 사용자가 "문서 만들지 말고 rule command skill 파일만 다운로드할래"로 방향 수정
> **원인:** "학습용 파일"을 새 문서 생성으로 해석
> **다음엔:** "파일로 만들어줘" 요청 시 기존 파일 공유인지 신규 문서 작성인지 먼저 확인

> ## 2026-06-17
>
> **상황:** 3DS suspend2 이메일 본문 1 작성
> **실수:** "but the verification could not be completed"으로 작성 → 사용자 "아직 해결이 안 되었다는 것 알림이 필요" 지적
> **원인:** 1회성 실패 표현("could not be")을 썼으나 2nd reminder 이메일은 "여전히 미완료" 상태를 전달해야 함
> **다음엔:** reminder 이메일의 지속 상태 표현은 "remains [형용사]" 패턴 사용

> **상황:** suspend2 노드 탐색 중 `findAll` 호출
> **실수:** `node.findAll()` 호출 시 "no such property 'findAll' on TEXT node" 에러 발생
> **원인:** node 타입을 확인하지 않고 frame/section이라고 가정
> **다음엔:** 노드 탐색 전 `node.type` 먼저 확인

> **상황:** Create Organization Left Panel 설명 텍스트 작성
> **실수:** 첫 번째 작성 시 ~입니다/~됩니다 형태의 딱딱한 톤으로 채움 → 사용자 "더 친절하게" 재요청
> **원인:** Left Panel이 마케팅 성격이라고 판단했으나 Create Organization 페이지는 사용자 플로우 내 기능 페이지이므로 UX Writing 해요체 규칙 적용 대상
> **다음엔:** 마케팅 경로가 아닌 플로우 내 UI 텍스트는 무조건 해요체

> ## 2026-07-15
>
> **상황:** 매뉴얼 버전 트리 구축 (Confluence → 파일 → 웹앱으로 3회 방향 전환)
> **실수:** "대표 버전 1곳에만 배치" 모델로 Confluence에 570건 게시 → Josh 정정("분기 없으면 전 버전 유효") 후 전량 삭제·재구축
> **원인:** 버전 배치 모델의 핵심 가정을 실행 전에 예시로 검증하지 않음
> **다음엔:** 대량 생성 전에 "이 문서는 이 버전들에서 보인다" 구체 예시 3개로 모델을 확인받는다

> **상황:** 이미지 감사에서 깨진 첨부 판정
> **실수:** "깨진 첨부 24건"으로 보고 → 실제로는 SVG 아이콘·소형 PNG 오판, 진짜 깨진 건 1건
> **원인:** 검증 로직의 정상 케이스를 고려하지 않고 결과를 단정 보고
> **다음엔:** "깨짐/유실" 같은 부정 판정은 샘플을 직접 열어 확인한 후 보고한다

> **상황:** 버전 매트릭스 표기
> **실수:** 유효 버전을 "all" → 구간 압축(~) 순으로 두 번 축약해서 두 번 정정받음
> **원인:** 표가 커지는 문제를 데이터 표기를 바꿔 해결하려 함
> **다음엔:** 유효 버전은 항상 명시적 쉼표 나열

> ## 2026-07-27
>
> **상황:** /checkout 저장 대상 프로젝트를 확인하려고 AskUserQuestion 호출
> **실수:** 선택지가 "mypage-renewal" 1개뿐인 질문을 보내 InputValidationError 발생 (options는 최소 2개 필요)
> **원인:** 사실상 선택의 여지가 없는 상황인데도 확인 질문 형식을 그대로 사용
> **다음엔:** 대안이 1개뿐이면 질문 대신 "~로 저장할게요" 형태로 바로 진행

---

## 19. 부록 B — mypage-renewal.md 프로젝트 로그 원문 전체 (날짜순 재정렬)

부록 A와 마찬가지로, 9번 섹션 요약의 원본. 발표에서 특정 세션의 디테일이 더 필요할 때 여기서 찾는다.

### 2026-06-04

- `Personal: License/Billing — Monthly Active` (`5679:191`): Action Row 우측 정렬 + Invoice Table 헤더 재작성
- `Personal: License/Billing — Student Benefit Active` (`5680:192`): Edit Row 수정
- `Personal: Account — Individual` (`5665:204`): CLO-SET 칩 스타일 적용
- `Personal: License/Billing — Annual Active` (`5707:167`) 신규 생성 — Monthly Active clone → Annual 전용 수정

### 2026-06-08 (구 MyPage 파일 `PeCid7uJcg0HenViaaiHUp`)

- MyPage 5개 탭 WF 전체 완료 확인 (STRUCTURE_COMMON 3710:2163 기준)
- Slack Canvas용 My Page 정책서 초안 완성 (5탭 구조, BD·CX 대상, 합니다 체)
- 정책 3종 확정 (Invited Projects 명칭 / Team Console 명칭 / 인라인 편집 / Paused→Suspended 이메일)

### 2026-06-08 (Account WF 그리드 — AI 파일 `NYShAqeBVSmpQYdk3HgPwN` Page 7)

- Account 섹션 TC×WF 그리드 신규 생성 (총 13개 프레임 — TC 3 + WF 10)
- 기본 정보 행 7개 WF Board Header 텍스트 업데이트 (계정 유형별)
- CLO-SET 행 2개 WF: 미연결 / 연결됨 상태 분기
- Danger Zone 행 1개 WF: 기본 상태
- 10개 WF Description 전체 작성 (mypage.md Section 5 기반)

### 2026-06-08 (Account CaseView — AI 파일 `NYShAqeBVSmpQYdk3HgPwN` Page 7)

- `docs/policy/mypage.md` 4가지 정책 수정 (Certification 삭제, Password 분기, Email/Nickname 통합 수정 방식, Danger Zone 설명문구)
- Account_STRUCTURE (`5778:5952`) Description 수정 — Certification 어노테이션 삭제, 배지 번호 재정렬, 내용 업데이트
- `BasicInfo_CaseView` (`5997:365`) 신규 생성 — 3케이스 + Description 6노트
- `DangerZone_CaseView` (`6019:365`) 신규 생성 — 4케이스 + Description 5노트

### 2026-06-08 (헬퍼 함수 정비 — `.claude/skills/md_figma_wireframe/`)

- `helpers-mypage.md` 신규 생성 — 6개 함수 완전 정의: `createTitleCard`, `wrapInSection`, `createActionButton`, `applyBullets`, `makeBadge`, `makeLabel`
- `figma-wireframe-protocol.md` 5a 수정 — 타이틀 카드 배경 `fills=[]`(오류) → 실측값 `{r:0.0606, g:0.0606, b:0.0606}`(거의 검정)로 교정
- `md_figma_wireframe/SKILL.md` — 헬퍼 함수 참조 테이블 추가
- `mistakes.md` 2개 항목 추가 (Unicode 원문자 사용, Company ID 삭제 경로 추측)
- `docs/backlog/projects/mypage-wf.md` 삭제 (내용 mypage-renewal.md에 통합 완료)

### 2026-06-09 (License/Billing STRUCTURE — AI 파일 `NYShAqeBVSmpQYdk3HgPwN` My Page)

- License/Billing 섹션 TC + WF1~7 + ActionRow_CaseView 신규 생성 (총 9개 프레임)
- WF1 Monthly Active: 전체 콘텐츠 구현 (LicenseInfo + PaymentMethod + BillingAddress + Invoice)
- WF2~4: WF1 clone → Action Row 수정 (Pause Scheduled / Paused / Suspended)
- WF5 Annual: Action Row 제거, Invoice 1행 Paid
- WF6 Student Benefit: 혜택 배너 추가, Invoice Upcoming $0
- WF7 License ID: 관리자 배너, PM/BA/Invoice 섹션 전체 제거 (이후 06-09 정책으로 완전 삭제)
- ActionRow_CaseView: 7가지 구독 상태별 Action Row 비교
- Section `License/Billing` (`6122:338`) 래핑 완료
- 전체 WF + CaseView Description 작성 완료

### 2026-06-09 (Preferences + Invited Projects STRUCTURE)

- Preferences 섹션 TC + WF1 + AIStudio_CaseView 생성 (Section `6249:150`)
  - WF1: Language 드롭다운 / Notifications 토글 / App Settings 토글 + 재시작 안내
  - AIStudio_CaseView: 3케이스 (Individual/Student/Academic/Indie · License ID · Company ID)
- Invited Projects 섹션 TC + WF1(Empty) + WF2(Active) + InvitedProjects_CaseView 생성 (Section `6266:152`)
  - WF1: 빈 상태 카드 ("초대된 프로젝트가 없어요.")
  - WF2: Project Card (License Type / My Status / Contact)
  - InvitedProjects_CaseView: 2케이스 (기본 카드 · License ID + 안내 배너)
- 전체 프레임 Description 작성 완료

### 2026-06-09 (Preferences WF1 + AIStudio_CaseView UI 수정)

- Language 행: 드롭다운 → `English ›` 탐색 행 패턴
- Notifications / App Settings toggle: pill toggle 복원 (ON 상태) + chevron `›`
- AIStudio_CaseView Case 2: "관리자 설정" 텍스트 (chevron 없음) — 이후 License ID 삭제로 제거

### 2026-06-09 (License ID 웹 차단 — Figma 전체 정리)

- **정책 확정**: License ID = MD Web 로그인 불가, 데스크탑 앱 전용
- `docs/policy/mypage.md` §1·§3·§5·§6·§8·§9 업데이트
- Figma `NYShAqeBVSmpQYdk3HgPwN` My Page — License ID 케이스 전체 삭제 (Overview WF, License/Billing WF7, AIStudio/InvitedProjects/BasicInfo/DangerZone CaseView 각 케이스, ActionRow_CaseView 행, Invoice CaseView 케이스)
- 전체 Description/Annotation License ID 참조 제거 (잔존 0건 검증 완료)

### 2026-06-09 (Account FEATURE 섹션 — 4개 섹션 13 WF 생성)

- **CLO-SET Connect** 섹션 (`6338:134`) — 3 WF: View(Not Connected+Connect 버튼) / CLO-SET Redirect / Connected(end state)
- **CLO-SET Disconnect** 섹션 (`6342:185`) — 3 WF: View(Connected+Disconnect 버튼) / Confirm Modal(Dim+모달 직접생성) / Disconnected(end state)
- **Password Change** 섹션 (`6343:236`) — 5 WF + Row Label 2개: Case 1(Not Integrated: Individual/Student) → View+Form Open / Case 2(CLO-SET Integrated) → View+Redirect+Changed
- **Nickname** 섹션 (`6345:321`) — 2 WF: View(Edit 버튼) / CLO-SET Redirect(end state)
- 각 WF: clearAnnotations + Board Header 업데이트 + Description List 초기화 후 FEATURE annotation 1줄 주입
- End state WF: Description Panel 비움 (annotation 없음 원칙 준수)

### 2026-07-16 (구 MyPage 파일 `PeCid7uJcg0HenViaaiHUp` — Coupon + Payment History Description 삽입)

- Coupon 목록 Description 삽입 완료 (node `6131:3016`) — Numbered Note 4개: ① Add Coupon Button ② Coupon Card ③ Apply Button ④ Already Subscribed 안내 모달
- Payment History Description 삽입 완료 (node `6131:2615`) — Numbered Note 3개: ① Payment History Table ② Status Badge ③ View PDF
- **신규 규칙 확정 — 기본 토스트 문구 고정값**: 에러 "Something went wrong. Please try again." / 성공 "Changes have been saved."
- `docs/backlog/projects/coupon-description.md` 내용을 이 파일로 통합 후 삭제

### 2026-07-16 (Coupon Description — Add Coupon 모달 내용 보강)

- ② Add Coupon 모달 Numbered Note 신규 삽입 (기존 ②③④ → ③④⑤로 renumber), 총 5개로 재구성
- Add Coupon 모달의 출처 불명 문구는 Josh가 이미 Figma에서 직접 수정 완료 확인 — 중복 작업 스킵

### 2026-07-23 (License/Billing 상태별 배너·모달 Description — 구 파일 `PeCid7uJcg0HenViaaiHUp`)

- Paused / Resume Subscription 풀페이지 / Pause Scheduled / Suspended 4개 상태 화면 Description 신규 작성
- **모달 서브 넘버링 컨벤션 확정** (`-1/-2/-3`)
- 컴포넌트 구조(License Info Card / Payment Method Card / Status Banner / Action Row / Modal Shell) 식별 완료 — 실제 드로잉은 다음 세션 이관

### 2026-07-27 (TODO 일괄 완료 처리)

- Josh 직접 편집 — TODO 1·3~11번 완료 처리, Loading 상태 표기만 진행 중으로 남김

---

## 20. 부록 C — 정책 파일 확정 사항 원문 발췌

### docs/policy/mypage.md (2026-06-08~09 세션 확정)

- Card 구조: 4카드 → 2카드 (계정 정보 카드 + Danger Zone 카드)
- Certification 행: 정책·Figma 모두 완전 삭제
- Password 분기: Individual/Student = CLO-SET PW 1행 / Company ID·Academic·Indie = CLO-SET PW + MD PW 2행
- Email·Nickname: CLO-SET 통합 시 CLO-SET에서만 수정 (MemberType 무관)
- 탭 명칭: "Shared License" → "Invited Projects"
- 관리자 콘솔 명칭: "License Account Admin" → "Team Console"
- 비밀번호 변경 방식: 인라인 편집
- Annual = 무조건 갱신 → Auto Renew toggle 미노출
- Annual Invoice = 연간 단일 결제 1행만
- 만료일 라벨: "만료일" (다음 결제일 아님)
- Pause 기능: Annual 미지원
- Paused → Suspended 전환 시 이메일 알림 발송

### docs/policy/member.md (2026-06-23 계정 구조 전면 개편)

- MemberType 폐지: Individual/CompanyID/Academic/Indie/License ID 구분 제거
- Non-Member / Member / SW Account(구 License ID) 3종 체계로 전환
- Group(구 CompanyID) 신설 — Enterprise/Academic/Indie 구매 시 생성

### docs/backlog/todo/MD-WEB-003.md (2026-07-27, 계정 구조 개편 반영 + 6대 요구사항)

- 버튼 상태 매트릭스를 Member/Group Owner 6종 체계로 재구성
- 6대 컨텐츠 요구사항: Trial 가시성, Team Console 안내, SW Account 간접 안내, Contact Sales 고정 배치, Organization 생성 여정 삽입, 한 페이지 전체 플랜 노출

---

## 21. 2026-09-07 갱신: 병목과 해결 (발표 주제 7축 재구성)

이 장은 2026-09-07에 추가됐다. 발표 주제를 "구성요소별로 어떤 병목이 있었고, 그걸 왜, 어떻게 해결했는지"의 서사로 재구성한 것이다. 근거는 `docs/backlog/projects/claude-workflow.md`(워크플로우 변경 시계열), `docs/backlog/mistakes.md`, 이 문서 §8, §11, §13이다.

### 21.0 7월 28일 이후 바뀐 것 (스테일 섹션 안내)

이 문서의 §4(에이전트), §5(스킬), §6(룰) 인벤토리와 §12(wave-prep 미스매치), §17 용어집의 wave 관련 항목은 7월 28일 시점 스냅샷이다. 이후 변화 4건:

| # | 변경 | 시점 | 내용 |
|---|---|---|---|
| 1 | wave 오케스트레이션 폐지, Planner 허브 전환 | 08-11 | `/orch`, `/wave-prep`, `/wave-integrate`와 planning-logs 삭제. 역할 커맨드 7종(`/planner`, `/manager`, `/task-manager`, `/research`, `/policy-writer`, `/figma-wireframe`, `/figma-description`)과 공유 보드 `requirements/board/TODO.md` 신설. §12의 관찰이 실행으로 옮겨진 것 |
| 2 | Figma 룰 7종을 루트 `spec.md`로 통합 | 09-01 | figma-read, figma-draw, figma-write, figma-annotation, figma-spec-card, figma-feature-naming, figma-wireframe-ds 전부 경로 안내 스텁화. 정본은 루트 `spec.md`(구조 규격)와 `spec-visual.md`(시각 토큰) |
| 3 | 문구 룰 재편 | 08-07 | 구 copywriting과 구 ux-writing을 병합해 새 `ux-writing.md` 작성, `policy-writing.md` 신설, `/copy-review` 스킬 신설 후 CLAUDE.md 필수 룰 승격 |
| 4 | 이메일 축 신설 | 09월 | 루트 `email-spec.md`, `email-visual.md`와 `docs/email/` 5종. 7월 자료에는 없는 신규 축 |

### 21.1 기획 관련

**병목**: 정책이 바뀌어도 화면에 반영되지 않는 동기화 지연. §11의 34일 지연 사례(MemberType 개편)와 당일 반영 사례(License ID 차단, 8개 지점 일괄 삭제)가 공존했다. 차이는 능력이 아니라 구조였다: 정책과 화면을 잇는 강제 장치가 없었다.

**해결**:

| 장치 | 내용 |
|---|---|
| 단일 진실 소스 | `docs/policy/**`가 정책 정본. 화면과 문서가 다르면 정책 문서가 이긴다 |
| 착수 순서 강제 | 정책 문서 → 기획 → 기획 문서 3종(PRD, 기능명세, Version Table) → Figma. 문서 없이 화면 착수 금지 (spec.md) |
| 상호 링크 검수 | PRD, 정책 문서, Figma Description 세 축이 서로 최신 경로를 가리켜야 완료 처리 (planner-workflow.md §4). 취합의 핵심 검수 항목 |
| 결정 대기 표 | 미결이라고 멈추지 않는다. 플래그를 달고 계속 그리되, D- 번호로 실물 추적 |

### 21.2 Jira 티켓 관련

**병목**: Slack 채널에 흩어진 요청의 수동 티켓화. 누락되고, 형식이 흔들리고, 티켓화하면 안 되는 것(조언, 현황 확인)까지 티켓이 됐다. §8 실수 로그의 Jira 카테고리 5건이 전부 여기서 나왔다(prefix 규칙, Sub-Task(MD) 타입, Tasks 디자인/개발 구분 등).

**해결**:
- `/slackrequest` 스킬: 채널 72시간 내 요청을 읽고 MDWEB-625 하위에 Bug/Improvement 자동 생성. 08-11에 변경 지점 필터 추가: 변경 지점 없는 건은 티켓화 금지, 제외 사유 표기
- `atlassian.md`, `jira-ticket.md` 룰: 티켓 계층(Story 타입 금지, Sub-Task(MD) 필수), PRD를 티켓으로 변환하는 형식, 수정 후 재조회 검증 의무
- 기획 워크플로우에서 Jira는 읽기 전용: 티켓은 소스이지 산출물이 아니다. 티켓 상태와 TODO.md를 억지로 동기화하지 않는다(granularity가 다름)

### 21.3 Figma MCP

가장 병목이 컸던 곳이고, 그래서 인프라 투자도 가장 컸다. memory의 70%, 실수 로그의 53%(23/43건)가 Figma 관련이다 (§7, §8).

**병목 두 층위**:
- 기계적 함정 (11건): getNodeById가 페이지 전환 없이 null 반환, resize()가 sizing mode를 초기화, FILL 설정은 append 이후에만 가능, 이전 세션의 node ID는 신뢰 불가, 서브에이전트 OAuth는 PKCE 상태 유실로 4회 연속 실패
- 규격 이탈 반복 (12건): 소수 gap이 HUG를 타고 소수 높이로 전파, Screen 절대좌표, Description 구조 이탈

**해결**:

| 장치 | 병목 대응 |
|---|---|
| 4단계 파이프라인 | 읽기 → 스펙 매트릭스(유저 OK 필수) → 그리기 → Description → 스크린샷 검증. 참조 없이 그리기 금지 |
| `spec.md` 통합 (09-01) | 룰 7종이 흩어져 있어 이탈이 반복됐다. 실측(Account 섹션)으로 소수 gap 전파 메커니즘을 특정한 뒤 5대 변경을 확정하고 정본 1파일로 통합. 분산이 곧 이탈의 원인이었다 |
| `spec-visual.md` | 색, 폰트, 컴포넌트 토큰을 값이 아니라 생성 함수로 배포: 매번 새로 그리지 않고 함수를 호출 |
| `requirements/board/patterns.md` | 반복 화면 패턴 축적: 한 번 풀었던 레이아웃 문제를 다시 풀지 않는다 |
| 기계적 함정은 memory에 | API 함정은 룰이 아니라 memory에 기록(setCurrentPageAsync 필수, 폰트 프리로드 등): 세션이 바뀌어도 재발 차단 |

### 21.4 스킬: 무엇을, 왜 만들었나

스킬은 반복 작업의 표준 절차를 캡슐화한 것이다. 각각이 특정 병목에서 태어났다.

| 스킬 | 병목 | 해결 |
|---|---|---|
| `/copy-review` (08-07) | 문구를 보여준 뒤에 지적받는 순서. 같은 지적 반복 | 출력 전 4단계 자체 검수(종류 판별 → 기계 검출 → 판단 → 정책 사실 대조). CLAUDE.md 필수 룰로 승격 |
| `/slackrequest` | Slack 요청 수동 티켓화 | §21.2 참조 |
| `/translate`, `/writing` | 4개 언어(EN, KO, ZH-CN, JA) 시트 반복 작성, placeholder 파손 | EN 원본 검수 후 번역, placeholder 보호 규칙 내장 |
| `/checkout`, `/initiate`, `/handoff` (06-04부터) | 세션이 끝나면 컨텍스트가 사라진다: 가장 오래된 병목 | 세션 마감 시 프로젝트 파일 갱신, 실수 노트, 규칙 제안. 다음 세션이 이어받는 프로토콜 |
| `/flowchart` | 분기 플로우를 손으로 그리는 비용 | 직선 커넥터 렌더러. 이후 User Flow 에디터(자기 저장 아티팩트)로 발전 |
| `/overtime` (08-11) | 야근 일지 Canvas 수기 기입 | 계획/실적 2모드 자동 기입 |
| `/policy`, `/description`, `/cowork` | 정책 문장화, Description 작성, 아이디어에서 PRD까지가 매번 자유 작문 | 단계와 템플릿 고정 |

### 21.5 에이전트와 서브에이전트 설계

**설계 원칙 3가지**:

1. 역할 분리는 실제 팀 구조를 복제한다. 전역 `md-*` 로스터(md-pm, md-fe, md-be, md-qa, md-design, md-figma, md-analyze, md-security, md-devops). 병목 사례: 버그를 md-fe나 md-be에 바로 넘기면 원인 진단 없이 수정만 한다. 해결: md-qa 진단 우선 규칙으로 트리아지 순서 강제
2. 생성자와 검증자를 분리한다. `wf-validator`, `desc-validator`는 읽기와 판정만 하고 PASS/FAIL과 이슈 목록만 반환한다. 만든 세션이 스스로 검증하면 자기 실수를 못 본다. 이 둘은 wave 시대 Gate 3a/3b에서 태어났고, wave 폐지 때 삭제하지 않고 경량화(PACKET/REPORT 의존 제거)해 살렸다
3. 가장 큰 에이전트가 가장 큰 병목을 가리킨다. md-figma가 14K로 최대: Plugin API 함정 룰셋을 통째로 들고 있다. 개인용 `clo-doc-reader`는 별개 병목(기술 문서를 기획자 언어로 번역, 레거시 판별) 전용

**서브에이전트 교훈**: MCP OAuth를 서브에이전트에 위임하면 재개될 때마다 새 프로세스로 떠서 인증 상태가 유실된다(4회 반복 실패, mistakes 07-14). 인증은 항상 메인 세션에서 하고, 서브에이전트는 상태 없는 작업에만 쓴다.

### 21.6 룰: 어떤 병목을, 왜, 어떻게

룰은 취향 정리가 아니라 전부 사고에서 태어났다. 대표 서사 5개:

| 룰 | 병목 (실제 사건) | 해결 |
|---|---|---|
| `ux-writing.md` (08-07) | FAQ를 쓰다가 발견: 말투 기준이 파일마다 충돌(구 룰은 해요체 강제, solutions-copy는 지양, copywriting은 명사형). 같은 질문에 파일마다 다른 답 | 화면 위치가 아니라 텍스트 종류로 말투 결정(마케팅=명사형, 본문=합니다체, 버튼=명사형). Cursor와 Anthropic 문서 전수 조사로 근거 확보. EN 원본 규칙 신설 |
| `policy-writing.md` (08-07) | Canvas 게시본이 전사 공개인데 규칙만 끊어 나열됐다. Josh: "필자가 아마추어 같음. 사람들은 내가 쓴 줄 알 텐데" | 문서 등급 분기: 게시본은 읽히는 문서(섹션 오프닝 한 문장, 검산 예시 허용), 정본은 압축 |
| `spec.md` (09-01) | 와이어프레임이 반복해서 규격을 이탈. 원인을 실측으로 특정: 소수 gap 6.52…가 소수 높이 328.61…을 만드는 전파 메커니즘 | 5대 변경 확정 + 룰 7종을 정본 1파일로 통합. 분산이 곧 이탈의 원인이었다 |
| `planner-workflow.md` (08-11) | §21.7 참조 | §21.7 참조 |
| 약어 금지 (CLAUDE.md 8항) | 같은 지적을 3번 받았다(06-04, 08-25 외). 원인: 범위를 "티켓, PRD"로 좁게 읽고 내부 파일에서 재발 | 예외 없는 전면 금지로 명문화하고, 재발 경위 자체를 룰에 기록 |

작은 규칙들도 같은 패턴이다: 기본 토스트 문구 고정값(07-15 과잉 플래그 사건에서 신설, 07-16 실제 적용으로 재발 방지 확인), 모달 서브넘버링(07-23 지적 후 컨벤션 확정), 이음표 금지(08-27), 금액 `n USD` 표기(08-26).

순환 구조가 핵심이다: `mistakes.md`(상황/실수/원인/다음엔 4필드) → 카테고리 집계(§8.1) → 상위 카테고리가 룰 투자 우선순위 → 룰과 memory로 승격 → 재발 여부로 룰 효과 검증(§13.2). 실수 로그가 룰의 원료 공급처다.

### 21.7 워크플로우: 병목과 해결 시계열

| 시기 | 병목 | 해결 |
|---|---|---|
| 6월 | 세션이 끝나면 컨텍스트 소실 | `/checkout`, `/initiate` 세션 연속성 프로토콜 |
| 7월 | 대형 프로젝트의 단계 관리 | wave 오케스트레이션 도입(pm에서 design, figma로 순차 게이트) |
| 08-11 | wave 1년간 완주 0건. 증거: archive 폴더가 완전히 비어 있음, planning-logs 3개는 헤더만 있는 빈 템플릿. 원인: wave는 한 세션이 순차 게이트를 통과하는 구조인데 실제 작업은 멀티 터미널 병행 | 폐지가 아니라 이전. Planner 허브 개편: 역할 커맨드 7종 + 단일 TODO.md. wave의 자산(Phase A 플랜 승인, 커버 체크리스트, validator)은 흡수해서 살림 |
| 08-11 | 초안은 Planner가 Figma까지 배정하는 구조였는데, Josh는 Figma를 직접 통솔하길 원함 | `T-`/`F-` 접두어로 소유권 분리: 문서 축은 Planner, Figma 축은 Josh. 추적은 한 파일에서 하고 배정과 리뷰 주체만 분리 |
| 08-11 | 세션 간 폴링은 낭비인데, 알림만 믿으면 유실 | 파일이 진실, 알림은 속도 개선. SendMessage 실측(첫 접촉 [ref] 해시, 대소문자 무관)까지 하고 룰에 기록 |
| 08-11 | 착수 알림 구멍: 지금 누가 뭘 그리는지 알 수 없음 | 역할 전원이 착수 시에도 알리도록 수정 (Josh 지적) |
| 08-18 | 알림이 파일 반영보다 먼저 도착하는 시차 | TaskManager는 알림을 옮기지 않고 매번 TODO.md를 재독하며 실물 대조. 이 방식이 정책 문서 결함 2건을 선제 발견했고 Planner 검수와 교차검증이 성립 |

### 21.8 관통 메시지 후보

도구를 배운 게 아니라, 실수를 로그로 만들고, 로그를 규칙으로 만들고, 규칙이 워크플로우를 다시 설계하게 했다. wave 폐지(완주 0건 증거 발견)가 그 사이클의 가장 큰 실행 사례다.
