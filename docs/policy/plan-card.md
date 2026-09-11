# PLAN CARD 정책

Source: https://clo.atlassian.net/wiki/spaces/MDT/pages/3842572289/PLAN+CARD

> 2026-08-04: 계정 구조 개편(2026-06-23) 반영 완료. 용어 기준은 `docs/policy/member.md`, 플랜 기준은 `docs/policy/plan.md`
> 2026-08-05: 구매 자격 원칙 확정 반영. 비활성 문구 전면 삭제 + Student Benefit 행 추가
> 2026-08-20 (1~4차): 신 계정 구조 기준 상태별 분기 매트릭스 작성 (클릭 시 이동 컬럼, 레거시 Company ID 행, verification 엣지 케이스)
> 2026-08-20 (5차): **회의 확정 — 단일 CTA 체제 전환.** Plan 페이지는 Verification·라이선스·계정 상태를 체크하지 않음. CTA를 `Start {cardTitle}`로 통일하고 상태별 분기 매트릭스 전체 삭제. 레거시 Company ID는 Member + Organization으로 마이그레이션 예정이라 분기 자체가 소멸
> 2026-08-25 (6차): **Indie 웹 판매 제외** — Start Indie 클릭 시 Organization 생성과 Indie 인증 신청 리다이렉트만 제공, 웹 결제 없음(백오더 전용), 가격 미노출

---

## CTA 규칙

Plan 카드의 버튼 동작은 6가지 규칙으로 정의됩니다.

* **상태 무관 단일 CTA**: Plan 페이지는 Verification 상태, 라이선스 보유, 계정 상태를 체크하지 않습니다. 카드 버튼은 누구에게나 항상 활성입니다.
* **CTA 문구**: 카드명 기준 `Start {cardTitle}`로 통일합니다. `{cardTitle}` = 카드에 표시되는 플랜명
* **분기는 클릭 이후**: 계정 상태에 따른 분기(로그인, Organization 생성, 인증 신청, 기존 라이선스 판정)는 Plan 페이지가 아니라 이후 플로우와 Backend가 처리합니다.
* **다중 Verification 허용**: 한 Member가 여러 Verification을 보유할 수 있습니다. 상태·보유 여부 판정은 Backend가 처리합니다.
* **Secondary CTA `Contact Sales`**: Enterprise Single, Enterprise Team, Enterprise Team Linux, Academics, Indie 카드에 상시 노출합니다.
* **SW Account 미도달**: SW Account는 Web 로그인이 불가해 Plan 페이지에 도달하지 않습니다. (`member.md` §1)

레거시 Company ID 계정은 Member + Organization 구조로 마이그레이션될 예정입니다. 마이그레이션 이후 일반 Member / Organization Owner와 동일한 플로우를 적용하므로 Plan 페이지에 별도 분기가 없습니다.

---

## 카드별 CTA

| 카드 | Primary CTA | Secondary CTA | 클릭 시 |
| --- | --- | --- | --- |
| Individual | Start Individual | — | Individual 구매 플로우 진입 |
| Student | Start Student | — | Student 플로우 진입 |
| Enterprise Single | Start Enterprise Single | Contact Sales | Enterprise 구매 플로우 진입 |
| Enterprise Team | Start Enterprise Team | Contact Sales | Enterprise 구매 플로우 진입 |
| Enterprise Team Linux | Start Enterprise Team Linux | Contact Sales | Enterprise 구매 플로우 진입 |
| Academics | Start Academics | Contact Sales | Academic 플로우 진입 |
| Indie | Start Indie | Contact Sales | Organization 생성과 Indie 인증 신청 진입 — 웹 결제 없음, 백오더 전용 (가격 미노출) |

---

## 클릭 후 플로우 (플로우 · Backend 처리)

클릭 이후의 분기는 5가지 축으로 처리됩니다. Plan 카드는 관여하지 않습니다.

* **로그인**: Non-Member가 클릭하면 로그인 후 플로우를 계속합니다.
* **Organization**: Enterprise, Academics, Indie 플로우에서 Organization이 없는 경우 생성 단계를 경유합니다. Back Office에서 Enterprise 유형 계정을 생성하는 경우 Member와 Organization이 동시에 생성됩니다.
* **Verification**: Student, Academics, Indie 플로우에서 인증 미보유인 경우 인증 신청으로 유도합니다. 인증이 필요한 플랜의 구매 자격 판정은 Backend가 처리합니다.
* **Indie 백오더**: Indie는 웹에서 인증 신청까지만 진행하고 구매는 백오더로 처리합니다. 사이트에 가격을 노출하지 않습니다. (2026-08-25 확정)
* **기존 라이선스**: Checkout의 SW Account 지정 화면에서 Purchase Type 카드가 계정 목록을 필터하고, 선택에 따라 `New`, `Add/Extend`, `Convert`로 처리합니다. (`checkout.md` §9, §11 — 2026-08-25 필터 모델 전환)

---

## 미결 항목

| # | 항목 | 내용 | 우선순위 |
| --- | --- | --- | --- |
| 1 | Company ID 마이그레이션 | Member + Organization 변환의 시점과 방식 *(정책 확인 필요)* | P1 |
| 2 | Student Benefit 보조 문구 | "무료 기간 종료까지 D-{NN}" 노출 유지 여부 — 카드가 구독 상태를 읽지 않는 단일 CTA 체제와 충돌 *(정책 확인 필요)* | P2 |

### 해소된 미결 항목 (2026-08-20 회의)

| 기존 # | 항목 | 해소 |
| --- | --- | --- |
| 1 | Active 외 상태 보유자 처리 | 카드가 라이선스 상태를 읽지 않으므로 무효 |
| 2 | Indie 인증 대기 표시 | 카드가 인증 상태를 읽지 않으므로 무효 |
| 3~5 | 레거시 데이터 연동, Check My Status 목적지, 레거시 갱신 경로 | Company ID → Member + Organization 마이그레이션으로 무효 |
| 6, 7 | 다중 Organization, 인증 중복 보유 | 다중 Verification 허용 확정. 판정은 Backend 처리 |
| 8 | Checkout Organization 선택 | 플로우 정의(`checkout.md`) 소관으로 이관 |

### 해소된 미결 항목 (2026-08-05)

| 기존 # | 항목 | 확정 내용 |
| --- | --- | --- |
| 1 | Student Benefit Active 상태 버튼 | 보조 문구 "무료 기간 종료까지 D-{NN}" 노출로 확정했으나, 단일 CTA 체제 전환으로 유지 여부 재확인 (미결 #2) |
| 2 | Trial 진입 시 플랜 선택 반영 | **Checkout이 Trial 진입을 겸합니다.** Trial 시작도 Checkout을 경유하고, Checkout에서 Monthly와 Annual 중 선택합니다 (spec §5, §8) |

---

## 삭제 이력 (2026-08-20 회의)

| 항목 | 사유 |
| --- | --- |
| 상태별 분기 매트릭스 전체 (계정 유형, Verification Status, Has License 행) | Plan 페이지가 상태를 체크하지 않는 단일 CTA 체제로 전환 |
| Button Text `Start Now`, `Get Verified`, `Check My Status`, `Verification in Process` | `Start {cardTitle}`로 통일되어 사용처 소멸 |
| Button Text `For Individual`, `For Student` (레거시 차단 문구) | 레거시 Company ID 분기 소멸로 사용처 소멸 |
| 레거시 Company ID 행 전체 | Member + Organization 마이그레이션 예정 — 분기 자체가 성립하지 않음 |

## 삭제 이력 (2026-08-04)

| 항목 | 사유 |
| --- | --- |
| 전 카드 `License ID` 행 | SW Account는 Web 로그인 불가 → Plan 페이지 미도달 |
| Button Text `Contact your Group Manager` | 위 행 삭제로 사용처 소멸 |

---

## Appendix — 용어 변경

| 구 용어 | 신 용어 | 바뀐 이유 |
| --- | --- | --- |
| MemberType (Personal, CompanyID, Academic, Indie 등) | (폐지) | 계정 상태가 카드 분기 조건에서 제외됨 |
| License ID | SW Account | 라이선스 할당 전용 계정임을 명칭으로 명확화 |
| Group | Organization | 조직 단위 공식 명칭 확정 |
| Start Now, Get Verified 등 상태별 CTA | Start {cardTitle} | 단일 CTA 체제 전환 (2026-08-20 회의) |

---

## 관련 문서

- 정책: `docs/policy/plan.md` (플랜 상세), `docs/policy/member.md` (계정 구조, 인증), `docs/policy/checkout.md` (Purchase Type 필터)
- 기획: `docs/backlog/todo/MD-WEB-003.md` — Plan 페이지 카드 구성. 버튼 CTA는 본 문서가 기준
- 게시본: [Slack Canvas `F0BR8CNUHKM`](https://clo3d.slack.com/docs/T04BT3VBR/F0BR8CNUHKM) — 2026-08-20 게시, 회의 확정안 반영
- Figma: [`Plan Card CTA Policy`](https://www.figma.com/design/PeCid7uJcg0HenViaaiHUp/2026-RENEWAL?page-id=237%3A3133&node-id=7656-138) — 페이지 `Plan (In progress🔥)` (237:3133), node-id 7656:138 (2026-08-20 생성)
- Jira: 미생성
