# Solutions — Enterprise 페이지 기획

> 대상 MemberType: CompanyID / Indie / License ID
> 관련 정책: docs/policy/member.md, docs/policy/plan.md, docs/policy/plan-card.md

---

## 1. 타겟 유저

### Primary Decision Maker (구매 결정권자)
- 패션 브랜드 IT 담당자 / 구매팀 — 팀 단위 라이선스 도입 검토
- 게임 스튜디오 아트 디렉터 — 의류 파이프라인 구축 필요
- VFX 프로덕션 슈퍼바이저 — 영화/광고 의류 시뮬레이션 팀 도입

### Secondary (실무 사용자 — 구매 결정에 영향)
- 테크니컬 디자이너 / 패턴 마스터 — 실제 사용 주체
- License ID 보유 실무자 — 도구 품질 검토 후 어드민에게 어필

### Indie 세그먼트 (Enterprise 내 통합)
- 2~5인 소규모 스튜디오 — 기업 규모이지만 예산 제약
- 연 매출 $500K 이하 인증된 소규모 패션 브랜드
- 별도 Solutions 항목 없음. Enterprise 고객이 Indie 인증을 완료하면 Enterprise 페이지 내 배너를 통해 특가 안내.

### 페인포인트
- 팀원 수에 맞는 라이선스 관리가 어렵다 (입사/퇴사 시 재배분)
- 대규모 팀 도입 시 총비용(TCO)을 미리 파악하기 어렵다
- 오프라인 환경(보안 네트워크)에서도 써야 한다
- 소규모 스튜디오는 Enterprise 가격이 부담 — Enterprise 고객 인증 후 Indie 특가가 있다는 걸 모른다

---

## 2. 핵심 메시지

> "팀 전체가 같은 툴로 움직일 때, 생산성이 달라집니다."

기업 구매 결정권자에게는 ROI와 관리 편의성을 전달.
Indie 세그먼트에는 Enterprise 페이지 내 배너로 가치 제안: "Enterprise 고객이라면, 소규모 스튜디오 인증으로 더 합리적인 가격에."

---

## 3. 섹션 구성

### Section 1 — Hero

| 항목 | 내용 |
|------|------|
| Headline | "Scale Your 3D Garment Pipeline Across Your Entire Team." |
| Sub-headline | "Flexible network licensing, centralized management, and enterprise-grade support." |
| Visual | 팀 협업 장면 or 대형 스튜디오 작업 환경 (멀티 시트 활용) |
| Primary CTA | "Start Now" → Plan 페이지 (Enterprise 카드 앵커) |
| Secondary CTA | "Talk to Sales" → 문의 폼 또는 Calendly 링크 |

> Non-Member / CompanyID(라이선스 없음) → Primary CTA 활성화
> Individual / Student → "For Enterprise" 비활성 (해당 유저가 이 페이지 진입 시 상단 배너로 개인 플랜 안내)
> Trial 없음: Enterprise / Indie는 무료 Trial을 제공하지 않음. 문의(Talk to Sales) 통해 별도 협의.

### Section 2 — Why Enterprise

기업 도입 결정권자가 가장 먼저 궁금해하는 것: "왜 이 툴인가?"

| 포인트 | 설명 |
|--------|------|
| Industry Standard | Zara, H&M, Nike 등 글로벌 브랜드가 사용하는 업계 표준 |
| Scalable Licensing | 팀 규모에 따라 Copy 수 유연 조정 (Network Online) |
| Centralized Control | CompanyID 한 계정으로 전체 License ID 생성 · 관리 |
| Offline Option | 보안 환경이 필요한 팀을 위한 Network Offline (별도 계약) |

### Section 3 — Plan Comparison

Enterprise Monthly vs Enterprise Annual 비교.

| 구분 | Enterprise Monthly | Enterprise Annual |
|------|-------------------|-------------------|
| 가격 | $199/월 | $2,000/년 |
| 라이선스 유형 | Network Online | Network Online |
| 동시접속 | Max 1 Copy | 구매된 N Copy |
| 결제 방식 | 자동결제 | Prepaid (일시 납부) |
| 적합한 경우 | 단기 프로젝트, 유연성 필요 | 팀 운영, 비용 효율 중요 |
| CTA | plan-card.md 매트릭스 기준 | plan-card.md 매트릭스 기준 |

> 버튼 상태는 plan-card.md CARD: ENTERPRISE 매트릭스를 100% 따른다.
> License ID (라이선스 있음) → "Check my License Status" (활성)
> License ID (라이선스 없음) → "Contact your Group Manager" (비활성)

**Enterprise Offline 별도 섹션** (하단 배너)

| 항목 | 내용 |
|------|------|
| 대상 | 보안 네트워크, 인터넷 불가 환경 기업 |
| 가격 | Variable (별도 계약) |
| CTA | "Contact Sales" → BD 문의 폼 |

### Section 4 — Indie 특가 배너

Enterprise 페이지 내 별도 배너로 노출. Indie는 독립 Solutions 항목이 아니라, Enterprise 고객이 Indie 인증을 완료했을 때 특가로 제공하는 방식.

| 항목 | 내용 |
|------|------|
| Headline | "Running a small studio?" |
| Sub | "Indie-certified Enterprise customers get a special rate — Enterprise-grade features at a price built for teams of 2–5." |
| 가격 | $800/년, Max 5 Copy (Indie 인증 완료 CompanyID 전용) |
| 조건 | Enterprise 고객 중 Indie 인증 완료 (연 매출 $500K 이하) |
| 노출 조건 | CompanyID 계정에서만 배너 노출. Individual / Student에게는 표시 안 함. |
| CTA | "Get Verified" (Indie 인증 미완료 CompanyID) / "Check my License Status" (Indie 인증 완료) |

> 버튼 상태는 plan-card.md CARD: INDIE 매트릭스를 따른다.
> Indie 인증 대기 중 → "Verification in process" (비활성)
> Non-CompanyID MemberType → 배너 자체 미노출 (렌더링 제외)

### Section 5 — License Management 안내

CompanyID (어드민)가 실제로 어떻게 관리하는지 단계별 설명.

1. CompanyID 계정 생성 (CLO-SET 통합 선택)
2. License ID 생성 (이메일 인증 or ID 선생성)
3. 라이선스 Copy 수만큼 동시접속 허용
4. 입사/퇴사 시 License ID 재배정

Visual: 심플한 플로우 다이어그램 (3~4 step)

### Section 6 — Enterprise Support

기업 고객 전용 지원 채널 강조.

| 지원 유형 | 내용 |
|---------|------|
| Dedicated Onboarding | 도입 초기 셋업 지원 |
| Priority Support | 기업 전용 빠른 응답 채널 |
| Volume Discount | Copy 수 대량 구매 시 별도 협의 가능 |
| Custom Contract | 결제 조건, 인보이스 등 커스텀 계약 |

### Section 7 — Social Proof

글로벌 패션 브랜드 · 게임 스튜디오 로고 배열 (신뢰 지표).
사용 사례 영상 또는 케이스 스터디 링크.

### Section 8 — Final CTA (이중 CTA)

| CTA | 타겟 | 버튼 텍스트 | 연결 |
|-----|------|-----------|------|
| 바로 시작 | 이미 결정된 구매자 | "Start Now" | /plan#enterprise |
| 상담 요청 | 검토 단계 구매자 | "Talk to Sales" | 문의 폼 |

---

## 4. CTA 정의

| 위치 | 버튼 텍스트 | 연결 대상 | 비고 |
|------|------------|---------|------|
| Hero Primary | Start Now | /plan#enterprise | MemberType 분기 적용 |
| Hero Secondary | Talk to Sales | /contact 또는 외부 링크 | 항상 활성 |
| Enterprise Monthly 카드 | plan-card.md 기준 | 결제 플로우 | - |
| Enterprise Annual 카드 | plan-card.md 기준 | 결제 플로우 | - |
| Offline 배너 | Contact Sales | BD 문의 폼 | 항상 활성 |
| Indie 배너 | Get Verified / Check my License Status | 인증 플로우 / 라이선스 현황 | Verification Status 분기 |
| Final CTA (좌) | Start Now | /plan#enterprise | - |
| Final CTA (우) | Talk to Sales | /contact | - |

---

## 5. 운영 포인트

- Individual / Student MemberType이 Enterprise 페이지 방문 시: 상단 알림 배너로 "이 플랜은 기업 계정용이에요. 개인 플랜을 확인해 보세요." + Individual 페이지 링크
- Indie 인증 대기 중 유저가 재방문 시: 인증 진행 상태 표시 ("Verification in process" 상태 유지, 처리 기간은 페이지에 노출하지 않음)
- Enterprise Offline은 가격 미표시 — "Contact Sales" 단일 CTA로만 처리
- BD팀 문의 폼 연결 SLA: 영업일 기준 1~2일 내 응답 (페이지에 명시)

---

## 6. 이벤트 로깅 포인트

| 이벤트 | 발생 시점 |
|--------|---------|
| `solutions_enterprise_hero_cta_click` | Hero "Start Now" 클릭 |
| `solutions_enterprise_talk_to_sales_click` | "Talk to Sales" 클릭 (위치 파라미터 포함) |
| `solutions_enterprise_plan_card_click` | 플랜 카드 CTA 클릭 (plan_type: monthly/annual) |
| `solutions_enterprise_offline_contact_click` | Offline 배너 "Contact Sales" 클릭 |
| `solutions_enterprise_indie_banner_click` | Indie 배너 CTA 클릭 |
| `solutions_enterprise_logo_section_view` | Social Proof 섹션 scroll 진입 |
