# MD-WEB 백로그 인덱스

최종 수정: 2026-05-13 (MD-WEB-004 생성 — 기업 트라이얼 폼 개선) | 관리: md-pm

## 파일 구조

```
docs/backlog/
  index.md          ← 이 파일 (우선순위 순 목록)
  todo/OPIN-{id}.md ← 대기 중 티켓
  wip/OPIN-{id}.md  ← 진행 중 티켓
  done/OPIN-{id}.md ← 완료 티켓
```

## 티켓 상태 정의

| Status        | 의미                           |
| ------------- | ------------------------------ |
| `idea`        | 아이디어, Premise Challenge 전 |
| `research`    | UX 리서치 중                   |
| `ready`       | 구현 시작 가능                 |
| `in-progress` | 개발 중 (wip/ 폴더로 이동)     |
| `review`      | QA 검토 중                     |
| `done`        | 완료 (done/ 폴더로 이동)       |
| `deferred`    | 연기 (이유 명시)               |

## 현재 스프린트 (W16)

| ID                           | 제목                              | Priority | Status      | Owner   |
| ---------------------------- | --------------------------------- | -------- | ----------- | ------- |
| [OPIN-043](wip/OPIN-043.md)  | Survey 응답 제출 전체 플로우 완성 | P1       | in-progress | opin-fe |
| [OPIN-044](todo/OPIN-044.md) | My Page 내 설문 리포트 링크 연결  | P2       | ready       | opin-fe |
| [OPIN-045](todo/OPIN-045.md) | Survey Publish 유효성 검증 강화   | P2       | ready       | opin-be |

## W17 스프린트

| ID                              | 제목                                                               | Priority | Status | Owner   |
| ------------------------------- | ------------------------------------------------------------------ | -------- | ------ | ------- |
| [MD-WEB-004](todo/MD-WEB-004.md) | 기업 트라이얼 폼 개선 — 드롭다운 전환 + 중국 조건부 필드          | P1       | ready  | md-fe   |
| [MD-WEB-003](todo/MD-WEB-003.md) | Plan 페이지 — 플랜 카드 구조 및 버튼 상태 정의                    | P1       | research | md-pm  |
| [MD-WEB-002](todo/MD-WEB-002.md) | Checkout UX 리디자인 — 단일 페이지 폼 + 회원타입별 분기           | P1       | ready  | md-fe   |
| [OPIN-062](todo/OPIN-062.md)    | 빌더 탭 구조 개편 — 응답 관리 + AI 분석                            | P1       | ready  | opin-fe |
| [OPIN-057](todo/OPIN-057.md)    | 아이콘 시스템 적용 — SuccessScreen · EmptyState · 설문 카드 썸네일 | P2       | ready  | opin-fe |

## 완료

| ID                           | 제목                                                                  | 완료일     |
| ---------------------------- | --------------------------------------------------------------------- | ---------- |
| [OPIN-058](done/OPIN-058.md) | 스테이징 환경 구성 — Supabase + Vercel                                | 2026-04-18 |
| [OPIN-061](done/OPIN-061.md) | 빌더 플로팅 패널 레이아웃 + 설문 메타 인라인 편집                     | 2026-04-18 |
| [OPIN-060](done/OPIN-060.md) | 설문 응답 페이지 — 질문별 페이지네이션 + 섹션 전환 화면               | 2026-04-18 |
| [OPIN-059](done/OPIN-059.md) | FlowView Expanded 모드 — 질문 카드 실제 크기 렌더링 + 모드 토글       | 2026-04-18 |
| [OPIN-055](done/OPIN-055.md) | 빌더 UI 미니멀 리디자인 — 헤더·QuestionCard·섹션 헤더                 | 2026-04-12 |
| [OPIN-054](done/OPIN-054.md) | 홈 설문 리스트 미니멀 리디자인 — 타이포·밀도·카드 구조                | 2026-04-12 |
| [OPIN-053](done/OPIN-053.md) | 설문 생성 진입점 — 3-option 선택 플로우                               | 2026-04-12 |
| [OPIN-052](done/OPIN-052.md) | 플랜 페이지 — 가격 및 기능 비교                                       | 2026-04-12 |
| [OPIN-056](done/OPIN-056.md) | 지급대행 보상 구조 전환 — 기프티콘 제거 + Survey 지급 파이프라인 구축 | 2026-04-12 |
| [OPIN-051](done/OPIN-051.md) | 다크모드 — CSS Semantic Color 시스템 + 라이트/다크 팔레트             | 2026-04-12 |
| [OPIN-050](done/OPIN-050.md) | Analyze → Builder 연결 고도화 + Playwright URL 스크린샷               | 2026-04-11 |
| [OPIN-049](done/OPIN-049.md) | 피봇 — URL/GitHub AI 설문 자동 생성 + Poll/출금 제거                  | 2026-04-11 |
| [OPIN-048](done/OPIN-048.md) | 포인트 → 기프티콘 전환 시스템                                         | 2026-04-11 |
| [OPIN-047](done/OPIN-047.md) | 마이페이지 전체 리디자인                                              | —          |
| [OPIN-046](done/OPIN-046.md) | My Page 디자인 고도화                                                 | —          |

## 백로그 (미정 스프린트)

| ID  | 제목                            | Priority | Status | Owner |
| --- | ------------------------------- | -------- | ------ | ----- |
| —   | 센드비 실연동 QA (계약 완료 후) | P2       | idea   | —     |
| —   | 리포트 페이지 기본 구현         | P3       | idea   | —     |
| —   | Abuse 하드닝                    | P3       | idea   | —     |

## 에이전트 사용법

```
# 백로그에서 다음 티켓 픽업
/cowork docs/backlog/todo/OPIN-044.md

# 새 티켓 자동 생성 (UX 리서치 포함)
@opin-pm "새 기능 설명" 을 백로그 티켓으로 만들어줘

# 백로그 전체 갱신
@opin-pm 백로그 현황 분석하고 우선순위 재정렬해줘
```
