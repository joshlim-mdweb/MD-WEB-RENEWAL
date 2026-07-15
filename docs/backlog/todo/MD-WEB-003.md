---
id: "MD-WEB-003"
title: "Plan 페이지 — 플랜 카드 구조 및 버튼 상태 정의"
priority: "P1"
status: "research"
agents:
  - owner: "md-pm"
  - reviewer: "md-qa"
  - consulted: ["md-fe"]
created: "2026-05-07"
updated: "2026-05-07"
sprint: ""
policy_refs:
  - "docs/policy/plan.md"
  - "docs/policy/plan-card.md"
  - "docs/policy/member.md"
code_refs: []
figma_ref: "PeCid7uJcg0HenViaaiHUp node 1390:2770"
---

## 목적

방문자가 Marvelous Designer 플랜을 비교하고 구매 또는 인증 진입을 결정할 수 있도록,
정책 기반 가격·버튼 상태·섹션 구조가 확정된 Plan 페이지를 기획한다.
현재 Figma Draft는 가격 오류, placeholder 피처, 비정의 플랜(Enterprise Linux)을 포함하여 정책 정합성 미완 상태.

## 현황 — Figma Draft 이슈

| 항목 | Figma Draft | 정책 기준 | 처리 방향 |
|---|---|---|---|
| Individual 가격 | $23/mo | $39/mo | **수정 필요** |
| Academics 단위 | $1,500/Mo | $1,500/Copy/yr | **수정 필요** |
| Indie 가격 표기 | "60% Off" | $800/yr | **실가격 표기로 변경** |
| Enterprise Linux | $2,300/yr | 정책 미정의 | **[미결] 아래 참조** |
| 모든 Feature 항목 | "Description" × 5 | 미확정 | **[미결] 아래 참조** |

---

## 페이지 구조

URL: `/plan`

### Section 1 — General Plans

3카드 가로 배치. 로그인 불필요 플랜.

| 카드 | 정책명 | 표시 가격 | 결제 주기 | 비고 |
|---|---|---|---|---|
| Individual | Individual Monthly | **$39/mo** | 월간 자동결제 | Monthly/Annual 토글 포함 |
| — (토글 시) | Individual Annual | $280/yr | 연간 단일결제 | 카드 내 토글로 전환 |
| Enterprise Annual | Enterprise Annual | $2,000/yr | 연간 | N Copy, Userpool |
| Enterprise Monthly | Enterprise Monthly | $199/mo | 월간 | Max 1 concurrent user |

**[미결 A] Individual 토글 방식**
현재 Figma는 카드 상단 우측에 Monthly/Annual 토글 배치.
→ 옵션 1: **카드 내 토글** (현행 Figma) — Individual 카드만 토글, 나머지 고정
→ 옵션 2: **섹션 상단 글로벌 토글** — Section 1 상단에 배치, Enterprise도 영향
→ **추천: 카드 내 토글** (Individual만 월/연 선택, Enterprise는 별도 상품이므로 분리)

### Section 2 — Verified Plans (인증 할인)

섹션 타이틀: "Lower Prices for Verified Plans"
3카드 가로 배치. 인증 완료 시에만 구매 가능.

| 카드 | 정책명 | 표시 가격 | 인증 조건 | 비고 |
|---|---|---|---|---|
| Student | Student Annual | $99/yr | 학생 인증 | 최대 2회 구매 |
| Academics | Academic Annual | **$1,500/Copy/yr** | 교육기관 인증 | Copy 수 스테퍼 포함 |
| Indie | Indie Annual | **$800/yr** | Indie 인증 | Max 5 Copy |

> Academics 카드: Copy 수 스테퍼는 유지. 단위를 "/ Copy / Year"로 명확히 표기.
> Indie 카드: "60% Off" 문구 제거. "$800/yr" 실가격 표기. "Enterprise Annual 대비 60% 할인" 설명 텍스트 추가.

### Section 3 — Enterprise Linux

**[미결 A] Enterprise Linux 포함 여부**

정책(`plan.md`)에 별도 항목 없음. 현재 Figma에 $2,300/yr로 표기.
→ 옵션 1: **포함** — "Linux-based enterprise workflows" 별도 카드로 유지, "Contact Sales" CTA만 제공
→ 옵션 2: **제외** — 이번 릴리즈 스코프 아님, Enterprise 카드에 "Linux 지원 문의" 작은 링크만 추가
→ **추천: 포함하되 CTA를 Contact Sales로만** (가격 미표기, 정책 정합성 확보 전까지)

---

## 플랜 카드 상세 스펙

### 공통 카드 구조

```
┌─────────────────────────────┐
│ [플랜명]          [뱃지?]    │
│ [한 줄 설명]                │
│                             │
│ [가격] / [주기]             │
│                             │
│ Includes:                   │
│ ✓ Feature 1                 │
│ ✓ Feature 2                 │
│ ✓ Feature 3                 │
│ ✓ Feature 4                 │
│ ✓ Feature 5                 │
│                             │
│ [Primary CTA]  [Secondary?] │
└─────────────────────────────┘
```

**[미결 B] Feature 목록 ("Includes:")**

각 플랜의 5개 피처 항목이 미확정. 별도 확정 필요.
와이어프레임 작업 시 임시 placeholder로 진행, 구현 전 최종 확정.

---

## 버튼 상태 매트릭스

`plan-card.md` 기준. 비로그인(Non-Member) 상태를 **페이지 default**로 설정.

### INDIVIDUAL 카드

| MemberType | Button State | Button Text |
|---|---|---|
| **Non-Member** (default) | **활성** | **Start Now** |
| Individual | 활성 | Start Now |
| Student | 비활성 | For Student |
| CompanyID / Academic / Indie | 비활성 | For Individual |
| License ID (라이선스 있음) | 활성 | Check my Status |
| License ID (라이선스 없음) | 비활성 | For Individual |

### ENTERPRISE ANNUAL / MONTHLY 카드

| MemberType | Button State | Button Text |
|---|---|---|
| **Non-Member** (default) | **활성** | **Start Now** |
| Individual / Student | 비활성 | For Enterprise |
| CompanyID / Academic / Indie (라이선스 없음) | 활성 | Start Now |
| License ID (라이선스 있음) | 활성 | Check my License Status |
| License ID (라이선스 없음) | 비활성 | Contact your Group Manager |

Secondary CTA "Contact us for Team Trial" — Enterprise Annual/Monthly 카드에만 표시. 모든 MemberType에서 표시.

### STUDENT 카드

| MemberType | Verification | Button State | Button Text |
|---|---|---|---|
| **Non-Member** (default) | — | **활성** | **Get Verified** |
| Individual (인증 X) | — | 활성 | Get Verified |
| Individual (인증 대기 중) | Pending | 비활성 | Start Now |
| Student (인증 완료, 라이선스 없음) | 완료 | 활성 | Start Now |
| Student (인증 완료, 라이선스 있음) | 완료 | 활성 | Check my Status |
| CompanyID / Academic / Indie / License ID | — | 비활성 | For Student |

### ACADEMICS 카드

| MemberType | Verification | Button State | Button Text |
|---|---|---|---|
| **Non-Member** (default) | — | **활성** | **Get Verified** |
| Individual / Student | — | 비활성 | For Enterprise |
| CompanyID (인증 X) | — | 활성 | Get Verified |
| CompanyID (인증 대기 중) | Pending | 비활성 | Verification in process |
| Academic (인증 완료, 라이선스 있음) | 완료 | 활성 | Start Now |
| Indie | — | 비활성 | For Academic |
| License ID (라이선스 있음) | — | 활성 | Check my License Status |
| License ID (라이선스 없음) | — | 비활성 | Contact your Group Manager |

### INDIE 카드

| MemberType | Verification | Button State | Button Text |
|---|---|---|---|
| **Non-Member** (default) | — | **활성** | **Get Verified** |
| Individual / Student | — | 비활성 | For Enterprise |
| CompanyID (인증 X) | — | 활성 | Get Verified |
| CompanyID (인증 대기 중) | Pending | 비활성 | Verification in process |
| Indie (인증 완료) | 완료 | 활성 | Check my License Status |
| Indie (재인증 필요) | — | 활성 | Get Verified |
| Academic | — | 비활성 | For Indie |
| License ID (라이선스 있음) | — | 활성 | Check my License Status |
| License ID (라이선스 없음) | — | 비활성 | Contact your Group Manager |

---

## 완료 조건 (Definition of Done)

### 기획 완료 기준
- [ ] 미결 A (Enterprise Linux 포함/제외) 확정
- [ ] 미결 A (Individual 토글 방식) 확정
- [ ] 미결 B (각 플랜 Feature 목록) 확정
- [ ] 섹션 타이틀 카피 확정

### 와이어프레임 완료 기준
- [ ] STORYBOARD 01: 비로그인 상태 — GNB + Hero + Section 1 (3카드)
- [ ] STORYBOARD 02: 비로그인 상태 — Section 2 (Verified Plans 3카드) + Section 3 (Linux)
- [ ] STORYBOARD 03: 로그인(Individual) 상태 — 버튼 상태 변화
- [ ] STORYBOARD 04: 로그인(CompanyID 인증 대기) 상태 — "Verification in process" 표시
- [ ] STORYBOARD 05: "Get Verified" 클릭 → 인증 모달 or 페이지 진입 플로우

---

## UX 핵심 결정

- **비로그인 default**: Non-Member 버튼 상태를 페이지 기본으로. 로그인 후 MemberType에 따라 hydration.
- **Verified Plans 섹션 CTA**: "Verify" 단어 제거. 비로그인은 "Get Verified", 인증 완료는 "Start Now".
- **Academics Copy 수 표시**: $1,500/Copy/yr + 스테퍼. 총 금액 = 단가 × Copy 수 실시간 표시.
- **Student 구매 제한 고지**: 카드 하단에 "Available up to 2 times" 명시 (CS 리스크 1순위).

---

## CS 문의 예상 지점

- Student 최대 2회 구매 제한 — 카드에 명시 필수
- "Verification in process" 상태에서 구매 버튼 왜 비활성인지 — 버튼 아래 "Verification in process" 상태 텍스트 표시
- Indie 60% Off 기준이 무엇인지 — "Enterprise Annual 대비 60% 할인" 명기
- Enterprise Linux 가격 문의 — "Contact Sales" CTA + 이메일/문의 폼 연결

---

## 미결 사항 요약

| # | 항목 | 옵션 | 추천 |
|---|---|---|---|
| A | Enterprise Linux | 포함(Contact Sales CTA) / 제외 | 포함, 가격 미표기 |
| A | Individual 토글 | 카드 내 / 섹션 상단 글로벌 | 카드 내 토글 |
| B | Feature 목록 | — | 별도 확정 필요 |
| E | Hero 카피 | "Plan" 단어만 / 마케팅 카피 추가 | 현행 유지, 서브카피 1줄 추가 고려 |
