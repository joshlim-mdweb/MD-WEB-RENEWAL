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
updated: "2026-07-27"
sprint: ""
policy_refs:
  - "docs/policy/plan.md"
  - "docs/policy/plan-card.md"
  - "docs/policy/member.md"
code_refs:
  - "src/app/(marketing)/pricing/page.tsx"
figma_ref: "PeCid7uJcg0HenViaaiHUp node 1390:2770 (구 draft) / node 6427:4033 (레퍼런스 모음)"
---

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-05-07 | 최초 작성 (구 MemberType 체계 기준) |
| 2026-07-27 | 6/23 계정 구조 개편 반영 (MemberType 폐지 → Member/SW Account/Group) + 6대 컨텐츠 요구사항 추가 |

## 목적

방문자가 Marvelous Designer 플랜을 비교하고 구매 또는 인증 진입을 결정할 수 있도록,
정책 기반 가격·버튼 상태·섹션 구조가 확정된 Plan 페이지를 기획한다.
`src/app/(marketing)/pricing/page.tsx`는 현재 무관한 placeholder 컨텐츠(설문 서비스 플랜) 상태 — 이번 기획으로 전면 교체 대상.

## 6대 컨텐츠 요구사항 (2026-07-27 추가)

| # | 요구사항 | 반영 방식 |
|---|---|---|
| 1 | 한 페이지에서 모든 플랜 노출 | 7개 카드 확정: Individual / Student / Enterprise Single / Enterprise Team / Enterprise Team Linux / Academics / Indie |
| 2 | Trial 존재를 잘 알림 | Individual 카드 — Monthly·Annual 둘 다 "14-Day Free Trial" 배지 + 가격 하단 안내 문구 |
| 3 | Organization 케이스 → Team Console 존재 알림 | Enterprise/Academic/Indie 카드 Includes 목록에 Team Console 항목 추가 |
| 4 | SW Account 등 계정 구조를 은은히 알림 | Seat 선택 UI 하단에 작은 캡션 텍스트 (마케팅 톤, 직접 용어 노출 안 함) |
| 5 | Trial 없는 플랜의 Contact Sales 쉽게 발견 | Enterprise/Academic/Indie/Linux 전 카드에 Secondary CTA "Contact Sales" 고정 배치 |
| 6 | Organization(Group) 생성 플로우를 Plan 페이지 여정에 포함 | Group 없는 Member가 Enterprise/Academic/Indie CTA 클릭 시 Org 생성(+인증) 단계로 우선 진입 |

### 확정된 UX 결정 (2026-07-27)

- **Trial 적용 범위**: Individual Monthly·Annual 둘 다 14일 Trial 적용 (Annual도 결제 없이 14일 사용 후 과금 시작)
- **Org 생성 진입점**:
  - Enterprise 카드: Group 없는 Member가 "Start Now" 클릭 → **Organization 생성 페이지로 먼저 이동** (인증 없음, 생성만) → 완료 후 Checkout 진행
  - Academic/Indie 카드: Group 없는 Member 또는 미인증 Group Owner가 "Get Verified" 클릭 → **Organization 생성 + 인증 신청 통합 플로우**로 이동 (Group이 이미 있으면 인증 신청만)

## 현황 — Figma Draft 이슈

| 항목 | Figma Draft | 정책 기준 | 처리 방향 |
|---|---|---|---|
| Individual 가격 | $23/mo | $39/mo | **수정 필요** |
| Student 가격 | $99/yr (구 티켓 오기) | **$8.25/mo, Monthly only (Annual 없음)** | **수정 완료 (본 갱신)** |
| Student 무료 기간 라벨 | "Trial" | "Student Benefit" — Trial 라벨 금지 | **수정 완료 (본 갱신)** |
| Academics 단위 | $1,500/Mo | $1,500/Copy/yr | **수정 필요** |
| Indie 가격 표기 | "60% Off" | $800/yr | **실가격 표기로 변경** |
| Enterprise Linux | $2,300/yr, 정책 미정의 | 정책명 "Enterprise Team Linux"로 확정, 가격은 Contact Sales only | **수정 완료 (본 갱신)** |
| Student 구매 횟수 제한 | `solutions-copy.md`: "최대 2년(2회) 구매 제한" | `plan.md`: "첫 구독일 기준 4년(48개월) 이내" — **문서 간 불일치** | **[미결] 정책 소유자 확인 필요 — 아래 참조** |
| 모든 Feature 항목 | "Description" × 5 | 4~6개 불릿 확정 | **확정 완료 (본 갱신, 아래 참조)** |

---

## 페이지 구조

URL: `/plan`

### Section 1 — General Plans

3카드 가로 배치. 로그인 불필요 플랜.

| 카드 | 정책명 | 표시 가격 | 결제 주기 | 비고 |
|---|---|---|---|---|
| Individual | Individual Monthly | **$39/mo** | 월간 자동결제 | Monthly/Annual 토글 포함, **"14-Day Free Trial" 배지** |
| — (토글 시) | Individual Annual | $280/yr | 연간 단일결제 | 카드 내 토글로 전환, **동일하게 "14-Day Free Trial" 배지** |
| Enterprise Team | Enterprise Team | $2,000/yr | 연간 (Prepaid) | N Seat, Userpool 재배정, Team Console 포함, Contact Sales |
| Enterprise Single | Enterprise Single | $199/mo | 월간 자동결제 | Max 1 concurrent user, Contact Sales |

**(요구사항 2) Trial 노출 방식**: Individual 카드 상단에 "14-Day Free Trial" 배지 고정 표시 (Monthly/Annual 토글과 무관하게 항상 노출). 가격 하단에 보조 문구 1줄 — "14일 무료로 먼저 사용해보고 결제하세요" 방향 (최종 EN 카피는 `copywriting.md` 톤으로 별도 확정 — 명사형/동사 생략형 종결 고려).

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
| Student | Student Monthly | **$8.25/mo** (Monthly only, Annual 없음) | 학생 인증 | 첫 구독일 기준 4년 이내, 첫 3개월 무료("Student Benefit" — "Trial" 표기 금지) |
| Academics | Academic Annual | **$1,500/Copy/yr** | 교육기관(Group) 인증 | Copy 수 스테퍼 포함 |
| Indie | Indie Annual | **$800/yr** | Indie(Group) 인증 | Max 5 Copy |

> Academics 카드: Copy 수 스테퍼는 유지. 단위를 "/ Copy / Year"로 명확히 표기.
> Indie 카드: "60% Off" 문구 제거. "$800/yr" 실가격 표기. "Enterprise Team 대비 60% 할인" 설명 텍스트 추가.
> Academic/Indie 두 카드 모두 Enterprise와 동일하게 **Team Console 포함 문구 + Contact Sales Secondary CTA** 노출 (요구사항 3, 5 — 아래 참조).
> **[미결] Student 구매 횟수 표기**: `solutions-copy.md`는 "최대 2년(2회) 구매 제한"을 CS 리스크 1순위로 명시하지만 `plan.md`는 "첫 구독일 기준 4년(48개월) 이내"로 정의 — 두 문서가 다른 기준을 말하고 있어 카드에 어떤 제한 문구를 넣을지 정책 오너 확인 전까지 보류. 확인 전엔 "4년 이내" 기준으로 임시 표기.

### Section 3 — Enterprise Team Linux

정책상 `Enterprise Offline`(Network Offline, Variable 가격, 별도 계약, BD 팀 협상)에 해당 — Plan 페이지 노출명은 **"Enterprise Team Linux"**로 확정.
가격 자체를 표기하지 않고 **Contact Sales 전용 카드**로 운영 (셀프서브 구매 버튼 없음).

### Business 플랜 공통 — Team Console / SW Account / Contact Sales (요구사항 3·4·5)

Enterprise Single / Enterprise Team / Enterprise Team Linux / Academics / Indie — **5개 카드** 전부에 공통 적용.

- **Team Console 언급 (요구사항 3)**: Includes 목록 마지막 줄에 고정 항목 추가 — `✓ Team Console로 좌석·라이선스 중앙 관리` (방향 초안, 최종 카피는 `solutions-copy.md` §4 Enterprise Core 2 톤과 맞춰 확정)
- **SW Account 은은한 안내 (요구사항 4)**: "SW Account", "Group", "Member" 등 내부 용어는 마케팅 페이지에 직접 노출하지 않는다. Seat 수 입력 UI 바로 아래 캡션 텍스트로 간접 전달 — 예: "구매한 좌석은 팀원에게 나눠줄 수 있어요" 방향. 상세 계정 구조 설명은 하지 않고, "팀원에게 배정 가능"이라는 결과만 전달.
- **Contact Sales 고정 배치 (요구사항 5)**: 기존 Enterprise 전용이던 Secondary CTA "Contact us for Team Trial"을 **"Contact Sales"로 통일**해 Enterprise/Academic/Indie/Linux 4개 카드 전부에 고정 노출. Verification 상태·MemberType 상태와 무관하게 항상 노출 (버튼 상태 매트릭스의 Primary CTA와 별개로 항상 활성).

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

### 카드별 Includes 목록 확정 (2026-07-27, 4~6개 불릿)

7개 카드 확정명: **Individual / Student / Enterprise Single / Enterprise Team / Enterprise Team Linux / Academics / Indie**.
아래는 방향 확정 초안 — 최종 EN 표현은 `copywriting.md`/`content-strategy.md` 톤 재검토 후 확정.

**① Individual** — 상시 판매, Trial 있음
- 14-day free trial — no card charged until trial ends
- Single-user license for your own devices
- Full access to pattern-based simulation & fabric tools
- Start faster with ready-made assets from MD CONNECT
- Export to Maya, Houdini, Unreal Engine, Unity
- Monthly or Annual — switch anytime

**② Student** — 인증 필요, "Trial" 표기 금지
- First 3 months free after verification (Student Benefit)
- $8.25/mo after your free period, Monthly only
- Valid for up to 4 years from your first subscription
- Full professional toolset — same as Individual
- Requires school email or enrollment verification
- Single-user license, no sharing

**③ Enterprise Single** — Contact Sales 노출
- 1 concurrent user, billed monthly
- No long-term commitment — cancel anytime
- Managed through your organization's Team Console
- Same simulation & pipeline tools as Enterprise Team
- Contact Sales for volume or multi-seat needs

**④ Enterprise Team** — Contact Sales 노출
- Prepaid annual, purchase seats as your team grows
- Reassign seats between team members anytime (Userpool)
- Centralized seat & license management via Team Console
- Direct integration with Maya, Houdini, Unreal Engine, Unity
- Priority technical support
- Contact Sales for custom seat counts

**⑤ Enterprise Team Linux** — 가격 미표기, Contact Sales 전용
- Custom licensing for offline & Linux-based pipelines
- No self-serve pricing — built around your studio's contract
- Same core toolset as Enterprise Team
- Centralized management via Team Console
- Dedicated account manager
- Contact Sales to get started

**⑥ Academics** — 인증 필요(교육기관 Group), Contact Sales 노출
- $1,500 per seat, per year
- Requires institution verification
- Built for classroom & semester-based operation
- Centralized management via Team Console
- Same professional toolset students use in industry
- Contact Sales for large-scale institution deals

**⑦ Indie** — 인증 필요(매출 요건 Group), 60% 할인 포지셔닝
- $800/yr — about 60% less than Enterprise Team
- For qualifying small studios (under $500K annual revenue)
- Up to 5 seats
- Requires business & revenue verification
- Same seat management via Team Console
- Same operational terms as Enterprise Team

---

## 버튼 상태 매트릭스 (2026-07-27 — 신 계정 구조 반영)

`member.md`(계정 구조) + `plan-card.md` 기준. MemberType 폐지 반영 — 계정 상태는 **Non-Member / Member / Member(Student 인증) / Group Owner(인증 없음) / Group Owner(Academic 인증) / Group Owner(Indie 인증)** 6종으로 재구성.
SW Account(구 License ID)는 Web 로그인 자체가 불가하므로 Plan 페이지에 도달하지 않음 — 기존 "License ID" 행 전체 삭제.
비로그인(Non-Member) 상태를 **페이지 default**로 설정.

### INDIVIDUAL 카드

| 계정 상태 | 라이선스 | Button State | Button Text |
|---|---|---|---|
| **Non-Member** (default) | — | **활성** | **Start Now** |
| Member (Student 인증 X) | 없음 | 활성 | Start Now |
| Member (Student 인증 X) | 있음 | 활성 | Check my Status |
| Member (Student 인증 완료) | — | 비활성 | For Student |
| Group Owner (인증 무관) | — | 비활성 | For Individual |

### ENTERPRISE SINGLE / ENTERPRISE TEAM 카드

| 계정 상태 | 라이선스 | Button State | Button Text |
|---|---|---|---|
| **Non-Member** (default) | — | **활성** | **Start Now** |
| Member (Student 인증 무관, Group 없음) | — | 활성 | Start Now → **클릭 시 Organization 생성 페이지로 우선 이동** (요구사항 6) |
| Group Owner (인증 없음) | 없음 | 활성 | Start Now → Checkout 진행 |
| Group Owner (인증 없음) | 있음 | 활성 | Check my License Status |

Secondary CTA **"Contact Sales"** — Enterprise Single/Team 카드에 고정 표시. 모든 계정 상태에서 항상 표시 (위 매트릭스와 별개).

### ENTERPRISE TEAM LINUX 카드

셀프서브 구매 버튼 없음 — Primary CTA 자체가 **"Contact Sales"** 하나. Non-Member 포함 모든 계정 상태에서 동일하게 노출 (버튼 상태 분기 없음).

### STUDENT 카드

| 계정 상태 | Verification | Button State | Button Text |
|---|---|---|---|
| **Non-Member** (default) | — | **활성** | **Get Verified** |
| Member (인증 X) | — | 활성 | Get Verified |
| Member (인증 대기 중) | Pending | 비활성 | Start Now |
| Member (인증 완료, 라이선스 없음) | 완료 | 활성 | Start Now |
| Member (인증 완료, 라이선스 있음) | 완료 | 활성 | Check my Status |
| Member (재인증 필요) | — | 활성 | Get Verified |
| Group Owner (인증 무관) | — | 비활성 | For Student |

### ACADEMICS 카드

| 계정 상태 | Verification | Button State | Button Text |
|---|---|---|---|
| **Non-Member** (default) | — | **활성** | **Get Verified** |
| Member (Group 없음) | — | 활성 | Get Verified → **클릭 시 Organization 생성 + Academic 인증 신청 통합 플로우로 이동** (요구사항 6) |
| Group Owner (Academic 인증 X) | — | 활성 | Get Verified → **클릭 시 Academic 인증 신청만 진행** (Group은 이미 존재) |
| Group Owner (Academic 인증 대기 중) | Pending | 비활성 | Verification in process |
| Group Owner (Academic 인증 완료, 라이선스 있음) | 완료 | 활성 | Start Now |
| Group Owner (Indie 인증) | — | 비활성 | For Academic |
| Member (Student 인증) | — | 비활성 | For Enterprise |

Secondary CTA **"Contact Sales"** — 고정 표시.

### INDIE 카드

| 계정 상태 | Verification | Button State | Button Text |
|---|---|---|---|
| **Non-Member** (default) | — | **활성** | **Get Verified** |
| Member (Group 없음) | — | 활성 | Get Verified → **클릭 시 Organization 생성 + Indie 인증 신청 통합 플로우로 이동** (요구사항 6) |
| Group Owner (Indie 인증 X) | — | 활성 | Get Verified → **클릭 시 Indie 인증 신청만 진행** (Group은 이미 존재) |
| Group Owner (Indie 인증 대기 중) | Pending | 비활성 | Verification in process |
| Group Owner (Indie 인증 완료) | 완료 | 활성 | Check my License Status |
| Group Owner (재인증 필요) | — | 활성 | Get Verified |
| Group Owner (Academic 인증) | — | 비활성 | For Indie |
| Member (Student 인증) | — | 비활성 | For Enterprise |

Secondary CTA **"Contact Sales"** — 고정 표시.

### 요구사항 6 — Organization 생성 진입 로직 요약

- **Enterprise**: Group이 없는 경우 → Organization 생성(인증 없음)만 거친 뒤 Checkout. Group이 이미 있는 경우 → 바로 Checkout.
- **Academic / Indie**: Group이 없는 경우 → Organization 생성 + 해당 인증 신청까지 한 플로우로 통합. Group은 있지만 해당 인증이 없는 경우 → 인증 신청만 진행.
- 버튼 텍스트 자체는 변경하지 않는다(Start Now / Get Verified 유지) — **클릭 후 진입 경로만 계정 상태에 따라 분기**.

---

## 완료 조건 (Definition of Done)

### 기획 완료 기준
- [x] Enterprise Team Linux 포함 확정 — Contact Sales 전용 카드로
- [ ] 미결 A (Individual 토글 방식) 확정
- [x] 각 플랜 Feature 목록(Includes) 4~6개 불릿 확정 — 최종 EN 워딩 재검토 필요
- [ ] 섹션 타이틀 카피 확정
- [ ] Trial 배지·안내 문구 최종 카피 확정 (요구사항 2)
- [ ] Team Console Includes 항목 카피 확정 (요구사항 3)
- [ ] SW Account 간접 안내 캡션 카피 확정 (요구사항 4)
- [ ] Organization 생성(+인증) 플로우 화면 설계 — 별도 티켓 분리 필요 여부 판단 (요구사항 6)
- [ ] Student 구매 횟수 제한 문구 — `plan.md` vs `solutions-copy.md` 불일치 정책 오너 확인

### 와이어프레임 완료 기준
- [ ] STORYBOARD 01: 비로그인 상태 — GNB + Hero + Section 1 (3카드, Trial 배지 포함)
- [ ] STORYBOARD 02: 비로그인 상태 — Section 2 (Verified Plans 3카드) + Section 3 (Linux), Contact Sales 고정 배치 확인
- [ ] STORYBOARD 03: 로그인(Member) 상태 — 버튼 상태 변화
- [ ] STORYBOARD 04: 로그인(Group Owner, 인증 대기 중) 상태 — "Verification in process" 표시
- [ ] STORYBOARD 05: "Get Verified"/"Start Now" 클릭 → Organization 생성(+인증) 페이지 진입 플로우 (요구사항 6, Group 없는 Member 기준)

---

## UX 핵심 결정

- **비로그인 default**: Non-Member 버튼 상태를 페이지 기본으로. 로그인 후 계정 상태(Member / Member+Student 인증 / Group Owner / Group Owner+Academic·Indie 인증)에 따라 hydration.
- **Verified Plans 섹션 CTA**: "Verify" 단어 제거. 비로그인은 "Get Verified", 인증 완료는 "Start Now".
- **Academics Copy 수 표시**: $1,500/Copy/yr + 스테퍼. 총 금액 = 단가 × Copy 수 실시간 표시.
- **Student 구매 제한 고지**: 카드 하단에 "Available up to 2 times" 명시 (CS 리스크 1순위).
- **Trial 가시성 (요구사항 2)**: Individual 카드는 Monthly/Annual 무관하게 항상 "14-Day Free Trial" 배지 노출 — CTA 텍스트는 그대로 "Start Now" 유지, Trial 여부는 배지+보조문구로만 전달.
- **Business 플랜 공통 신뢰 요소 (요구사항 3·4·5)**: Enterprise/Academic/Indie/Linux 4개 카드는 Includes 목록 마지막에 Team Console 항목, 카드 하단에 Contact Sales Secondary CTA를 동일하게 배치해 "이 그룹은 별도로 관리·상담받는 플랜"이라는 인상을 통일.
- **Organization 생성 여정 삽입 (요구사항 6)**: Plan 페이지 자체에 Organization 생성 UI를 만들지 않는다 — Group 없는 Member의 클릭을 별도 생성(+인증) 페이지로 라우팅하는 방식으로 처리해 Plan 페이지 카드 구조는 그대로 유지.

---

## CS 문의 예상 지점

- Student 구매 횟수/기간 제한 — 카드에 명시 필수 (단, 정확한 기준 자체가 문서 간 불일치 — 위 미결 항목 참조)
- "Verification in process" 상태에서 구매 버튼 왜 비활성인지 — 버튼 아래 "Verification in process" 상태 텍스트 표시
- Indie 60% Off 기준이 무엇인지 — "Enterprise Team 대비 60% 할인" 명기
- Enterprise Team Linux 가격 문의 — "Contact Sales" CTA + 이메일/문의 폼 연결
- Trial 종료 후 자동 결제되는 줄 몰랐다는 문의 — Trial 배지 옆 "종료 후 자동 결제" 보조 문구 필수 (요구사항 2)
- Group 없이 Enterprise/Academic/Indie 진입 시 왜 생성 페이지로 이동하는지 — 진입 화면에 "구매 전 Organization 생성이 필요해요" 안내 문구 필요 (요구사항 6)

---

## 미결 사항 요약

| # | 항목 | 옵션 | 추천 |
|---|---|---|---|
| ~~A~~ | ~~Enterprise Team Linux 포함 여부~~ | — | **해결** — 포함, Contact Sales 전용 카드 |
| A | Individual 토글 | 카드 내 / 섹션 상단 글로벌 | 카드 내 토글 |
| ~~B~~ | ~~Feature 목록~~ | — | **해결** — 카드별 4~6개 불릿 확정 (위 참조), EN 워딩만 재검토 |
| E | Hero 카피 | "Plan" 단어만 / 마케팅 카피 추가 | 현행 유지, 서브카피 1줄 추가 고려 |
| F | Trial 배지·보조문구 최종 카피 | — | `copywriting.md` 톤으로 별도 확정 필요 |
| G | Team Console Includes 문구 | — | `solutions-copy.md` Enterprise Core 2 톤 참고해 확정 필요 |
| H | SW Account 간접 안내 캡션 문구 | — | 용어 노출 없이 "팀원 배정 가능"만 전달하는 방향으로 확정 필요 |
| I | Organization 생성(+인증) 페이지 자체 설계 | 이번 티켓 범위 포함 / 별도 티켓 분리 | **별도 티켓 분리 추천** — 이 티켓은 Plan 페이지 카드·라우팅 분기까지만 |
| J | Student 구매 횟수/기간 제한 문구 | "4년 이내"(plan.md) / "2년(2회) 구매 제한"(solutions-copy.md) | **정책 오너 확인 필요** — 두 문서 불일치, 확인 전 "4년 이내" 임시 적용 |
