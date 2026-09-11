---
project: trial-renewal
updated: 2026-09-11
---

> **다음 세션 집중 3축** (2026-09-11 Josh 지시): ①이메일 템플릿 `email-template-renewal.md` ②랜딩 페이지 `landing-renewal.md` ③**Trial 신규 착수** (이 파일). `/initiate`는 가장 최근 파일 하나만 읽으므로 나머지 두 개는 직접 열어야 한다.

## 관련 Jira 티켓
- MDWEB-916 — Trial 정책 (참조. `plan.md` §Trial 정책의 근거 티켓)
- 신규 Epic 미생성. 착수 시 생성 여부를 Josh가 결정한다

## TODO

1. **Phase A 승인 먼저** — 기획 문서 목차(안)과 화면 목록을 Josh에게 보고하고 OK를 받은 뒤 행을 만든다 (`planner-workflow.md` §3). 집행부터 시작하지 않는다
2. **현행 정책 정독과 갭 도출** — `plan.md` §Trial 정책이 정본이다. 아래 미결 3건이 화면 설계 전에 정해져야 한다
   - Trial 진행 중 전환 대상 플랜 변경(Monthly와 Annual) 가능 여부 *(개발 확인 필요, PG 구독 구조)*
   - Trial 경유 첫 결제에 Coupon 입력을 받을지 (`plan.md:179`)
   - Enterprise 계열 Trial 제공 여부와 발급 절차 (현재 "문의를 통해 결정"까지만)
3. **화면 설계** — Figma `2026-RENEWAL`의 Trial 페이지(`6630:2`)가 비어 있다. 어떤 화면이 필요한지부터 도출한다 (Trial 시작, 플랜 선택, Trial 중 My Page 상태, 취소, 종료 후 전환)
4. **이메일 축 연결** — Trial 계열 템플릿 6종은 이미 제작됐다 (`Personal_TrialStart`, `HelpTrial`, `TrialExpiring3Continue`, `TrialExpiring3Cancel`, `TrialCancel`, `TrialExpiry`). 화면이 생기면 발송 표기와 템플릿 링크를 건다 (`wireframe-email-notes.md` 규격)
5. **Enterprise Trial 화면** — 신청 폼 이메일 2종(`Enterprise_TrialInquiryStaff`, `TrialInquiryUser`)은 있는데 화면이 없다. 계정 발급 완료 통지도 템플릿이 없다

## 컨텍스트

### 확정 정책 (`docs/policy/plan.md` §Trial 정책, 2026-08-21 보강)
- 개인은 진입 경로 2개: Trial 경유(시작 시 Monthly 또는 Annual 선택 → 14일 무료 → 종료 후 선택한 플랜으로 자동 결제), 바로 구매
- Monthly 선택 시 39 USD/월, Annual 선택 시 280 USD/년
- **계정당 1회.** 취소했든 완료했든 이력이 있으면 재진입 시 바로 구매 경로
- Trial 기간 중 취소 가능. 진행 중 즉시 유료 전환은 제공하지 않는다
- Trial 중 Student 인증을 완료해도 Trial은 유지된다
- 종료 후 첫 결제 실패는 Suspended 처리 동일 적용
- **Trial 경유 첫 자동 결제는 결제 후 24시간 이내 환불 가능** (`plan.md:68`). Monthly와 Annual 모두 해당한다
- 기업 계열은 자동 Trial 없음. 문의를 통해 결정

### 현재 상태
정책은 있고 **화면이 없다.** Figma Trial 페이지(`6630:2`)가 비어 있어 와이어프레임 작업이 첫 실물 산출물이 된다. 이메일은 Trial 계열 6종과 Enterprise 문의 2종이 이미 v2에 제작돼 있어 화면이 생기면 연결만 하면 된다.

### 왜 지금 시작하나
Klay가 Slack에 올린 1년 구독 문의(`clo3d.slack.com/archives/C04599ZA9QQ/p1789092405026119`)에서 Trial 전환 후 셀프 환불 질문이 나왔다. 정책에는 답이 있지만(24시간, 월간과 연간 모두) 화면이 없어 사용자가 어디서 환불을 요청하는지 설계돼 있지 않다.

## 완료 로그

### 2026-09-11
- 프로젝트 파일 생성. 정책 현황 정리와 미결 3건 식별 (착수 전 준비)
