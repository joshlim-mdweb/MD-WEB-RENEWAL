---
name: confluence-doc
description: "MD Web 페이지용 Confluence 문서 3종(정책서/컨텐츠/기능명세서)을 작성·업데이트한다."
user_invocable: true
---

# /confluence-doc — Confluence 문서 작성 Skill

MD Web 페이지의 Confluence 문서 3종을 소스 파일 기반으로 작성·업데이트한다.

---

## 입력

```
/confluence-doc <페이지명> [문서타입]
```

- `<페이지명>`: 작업 대상 페이지 (예: Plan, Checkout, MyPage)
- `[문서타입]`: 생략 시 3종 전체. 개별 지정 가능: `정책서` / `컨텐츠` / `기능명세서`

예시:
```
/confluence-doc Plan
/confluence-doc Checkout 기능명세서
/confluence-doc MyPage 정책서
```

---

## 문서 3종 역할 정의

| 문서 | 독자 | 목적 | 문체 |
|------|------|------|------|
| **정책서** | PM, CS, 법무 | 비즈니스 규칙 — 누가 무엇을 할 수 있는가 | `~합니다` |
| **컨텐츠** | 디자이너, 마케터 | UI 텍스트 — 화면에 뭐라고 쓰는가 | 명사형 종결 |
| **기능명세서** | 개발자, QA | 구현 사양 — 시스템이 어떻게 동작하는가 | `~할 수 있다` |

---

## 소스 섹션 → 문서 배치 원칙

| 소스 섹션 | 정책서 | 컨텐츠 | 기능명세서 |
|---|---|---|---|
| Policy / Access | ✅ 접근 조건 | — | 참조용 |
| Policy / Payment | ✅ 결제 정책 | — | — |
| Policy / Permission | ✅ MemberType별 권한 테이블 | — | 참조용 |
| Policy / Status | ✅ 상태 정의 | ✅ 상태 레이블 카피 | ✅ 상태 처리 로직 |
| Policy / Limitation | ✅ 제한 조건 | ✅ 제한 안내 문구 | ✅ Validation 규칙 |
| Requirements / Feature | — | 기능명 카피 참고 | ✅ 기능 명세 |
| Requirements / Validation | — | — | ✅ 입력 검증 조건 |
| Requirements / Status Handling | — | — | ✅ 상태 처리 |
| Requirements / Error Handling | — | ✅ 에러 메시지 카피 | ✅ 에러 처리 흐름 |
| Requirements / Notification | — | ✅ 알림·토스트 문구 | ✅ 트리거 조건 |
| Edge Cases / Invalid Input | — | — | ✅ 예외 케이스 |
| Edge Cases / Expired Session | — | — | ✅ 예외 케이스 |
| Edge Cases / Duplicate Request | — | — | ✅ 예외 케이스 |

**핵심 원칙**:
- Policy 소유권 = 정책서
- Edge Cases 소유권 = 기능명세서
- 컨텐츠 = 텍스트 카피만 소유 (정책 판단 없음)

---

## 실행 흐름

### Step 1 — 소스 파일 탐색

`docs/policy/` 에서 페이지명과 관련된 파일을 읽는다.

```
Plan        → plan.md, plan-card.md, member.md
Checkout    → plan.md, plan-card.md, member.md
MyPage      → mypage.md, member.md
Auth        → auth-cn.md, member.md
Contact     → contact.md
```

파일 없으면 사용자에게 보고 후 중단.

### Step 2 — Confluence 부모 페이지 확인

MDT 스페이스의 RENEWAL 하위에서 `SITE_<페이지명>_RENEW` 패턴으로 부모 페이지를 찾는다.

```
searchConfluenceUsingCql: title = "SITE_<페이지명>_RENEW" AND space = "MDT" AND type = page
```

페이지명 → SITE_*_RENEW 매핑:
```
Plan     → SITE_PLAN_RENEW     (id: 4219142163)
MyPage   → SITE_MYPAGE_RENEW   (id: 3854794756)
Checkout → SITE_ORDER/CHECKOUT_RENEW (id: 3856007171)
```

부모 페이지가 없으면 RENEWAL (id: 3854827527) 하위에 `SITE_<페이지명>_RENEW` 신규 생성 후 진행.

### Step 3 — 기존 문서 조회

부모 페이지 하위에서 3종 페이지를 조회한다.

```
searchConfluenceUsingCql: parent = <부모ID> AND space = "MDT"
```

- 기존 페이지 있음 → 업데이트 모드
- 기존 페이지 없음 → 신규 생성 모드

### Step 4 — 섹션 구조 출력 + 사용자 확인

작성할 섹션 목록을 출력하고 OK를 받는다.

```
[<페이지명>] Confluence 문서 구조 확인

정책서:
  - 개요
  - 플랜 종류 및 가격 (plan.md)
  - 접근 조건 (member.md)
  - ...

컨텐츠:
  - 카드별 기능 불릿 (plan-card.md)
  - 버튼 분기표 5종 (plan-card.md)
  - 상태 표시 텍스트 (신규)
  - ...

기능명세서:
  - 버튼 상태 분기 + 클릭 동작 (plan-card.md)
  - 입력 검증
  - 에러 처리
  - 예외 케이스
  - ...

→ 이 구조로 진행할까요?
```

**사용자 OK 없이 작성 시작 금지.**

### Step 5 — 문서 작성/업데이트

문서 타입별로 순서대로 작성한다:

1. **정책서** → `updateConfluencePage` 또는 `createConfluencePage`
2. **컨텐츠** → `updateConfluencePage` 또는 `createConfluencePage`
3. **기능명세서** → `updateConfluencePage` 또는 `createConfluencePage`

### Step 6 — 결과 출력

```
완료: <페이지명> Confluence 문서 3종

- 정책서: https://clo.atlassian.net/wiki/spaces/MDT/pages/<id>
- 컨텐츠: https://clo.atlassian.net/wiki/spaces/MDT/pages/<id>
- 기능명세서: https://clo.atlassian.net/wiki/spaces/MDT/pages/<id>
```

---

## 문서 구조 템플릿

### 정책서

```
## 개요
## 플랜 종류 및 가격 (또는 기능 개요)
## 대상 및 자격 조건          ← Policy/Access + Permission
## 핵심 정책                   ← 페이지별 주요 정책
## 구매/사용 제한              ← Policy/Limitation
## 상태 정의                   ← Policy/Status (SWAccess 매트릭스, 인증 상태)
## 용어 정의
```

### 컨텐츠

```
## 개요
## [섹션별 카피]               ← 페이지 구조에 맞게 조정
## 버튼/CTA 문구 목록          ← Requirements/Error Handling 교차
## 상태 표시 텍스트            ← Policy/Status + Requirements/Notification
  - 상태 배지 텍스트
  - 안내 메시지
```

### 기능명세서

```
## 개요
## 기능 명세                   ← Requirements/Feature
## 버튼 상태 분기 및 클릭 동작  ← plan-card.md 분기표 + 클릭 동작 추가
## 입력 검증                   ← Requirements/Validation
## 상태 처리                   ← Requirements/Status Handling
## 에러 처리                   ← Requirements/Error Handling
## 알림                        ← Requirements/Notification
## 예외 케이스                 ← Edge Cases 전체
  - Invalid Input
  - Expired Session
  - Duplicate Request
```

---

## 문체 규칙 (rules/confluence-doc.md 요약)

| 문서 | 말투 | 예시 |
|------|------|------|
| 정책서 | `~합니다` | "14일 무료 Trial을 제공합니다." |
| 컨텐츠 | 명사형 종결 | "14일 무료 체험" |
| 기능명세서 | `~할 수 있다` | "사용자는 버튼을 클릭할 수 있다." |

- 불릿: 명사형 또는 단문 종결 (`~합니다` 금지)
- 테이블 셀: 명사형 단어 또는 값 단독

---

## Confluence 설정

| 항목 | 값 |
|------|-----|
| Cloud ID | `0edfc297-7bc2-41da-9a0c-7d5004c609d8` |
| Space | `MDT` (spaceId: `2149056535`) |
| Content Format | `markdown` |

### 스페이스 구조

```
MDT > UX✌ (2323742786)
      └── PRD_2026 (3832086557)
          └── RENEWAL (3854827527)   ← 신규 SITE_*_RENEW 생성 위치
              ├── SITE_PLAN_RENEW (4219142163)
              ├── SITE_MYPAGE_RENEW (3854794756)
              └── SITE_ORDER/CHECKOUT_RENEW (3856007171)
```

---

## 레퍼런스

Plan 페이지 완성 사례 (MDT 스페이스):
- SITE_PLAN_RENEW: `4219142163`
- 정책서: `4219699247` — SITE_PLAN_RENEW > 정책서
- 컨텐츠: `4219338762` — SITE_PLAN_RENEW > 컨텐츠
- 기능명세서: `4219961388` — SITE_PLAN_RENEW > 기능명세서
