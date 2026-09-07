# Solutions — Academics 페이지 기획

> 대상 MemberType: Academic (CompanyID 중 교육기관 인증 완료)
> 관련 정책: docs/policy/member.md, docs/policy/plan.md, docs/policy/plan-card.md

---

## 1. 타겟 유저

### Primary Decision Maker
- 패션 디자인 학과 교수 / 학과장 — 커리큘럼 도입 결정권자
- 대학교 IT 인프라 담당자 — 라이선스 계약 · 기술 검토
- 예술대학 구매팀 / 행정실 — 예산 집행 담당

### Secondary (영향력 행사자)
- 학생 — "교수님, 이 툴 써요?" 방식으로 도입 요구
- 졸업생 (Alumni) — 현업에서 쓰는 툴을 모교에 역추천

### 기관 유형
- 패션 디자인 학과 보유 4년제 대학
- 의상학과 / 텍스타일 디자인 학과
- 게임 아트 · VFX 전공 대학원 (의류 시뮬레이션 수업 포함)
- 패션 전문 직업훈련기관 (인증 조건 충족 시)

### 페인포인트
- 실무 툴과 교육 커리큘럼의 갭 — 졸업생이 현업 적응에 시간이 걸린다
- 교육기관 예산 제약 — 상업용 라이선스 가격은 부담
- 인증 절차가 복잡할 것 같다는 막연한 걱정
- 학생 수에 따른 동시접속 관리가 어렵다

---

## 2. 핵심 메시지

> "졸업하는 날, 이미 현업 준비가 돼 있도록."

교육기관 담당자에게: 학생들이 업계 표준 툴을 교육 과정에서 직접 익힌다.
학생들에게: 학교에서 배운 툴이 곧 현업에서 쓰는 툴.
기관에게: 합리적인 Academic 가격으로 전체 학생이 혜택.

---

## 3. 섹션 구성

### Section 1 — Hero

| 항목 | 내용 |
|------|------|
| Headline | "Equip Your Students with the Industry's Go-To Tool." |
| Sub-headline | "Academic licensing for fashion, game art, and VFX programs — at a price built for education." |
| Visual | 학생들이 MD를 활용해 작업하는 교육 현장 장면 |
| Primary CTA | "Get Verified" → 교육기관 인증 플로우 |
| Secondary CTA | "See Academic Pricing" → 페이지 내 Pricing 섹션 스크롤 |

> MemberType별 CTA 분기:
> - Non-Member / CompanyID(인증 X) → "Get Verified" (활성)
> - CompanyID(인증 대기 중) → "Verification in process" (비활성)
> - Academic(인증 완료, 라이선스 있음) → "Start Now" (활성)
> - Individual / Student → "For Enterprise" (비활성) + 안내 배너
> 자동 Trial 없음: Academic은 자동으로 시작되는 무료 Trial이 없음. 제공 여부는 문의(Contact Us)를 통해 결정.

### Section 2 — Why Marvelous Designer for Education

교육기관이 MD를 도입해야 하는 근거. 커리큘럼 담당자 설득.

| 포인트 | 설명 |
|--------|------|
| Industry-Ready Skills | 졸업생이 Zara, H&M, 넥슨, EA 등에서 바로 쓰는 툴 |
| Realistic Simulation | 패턴 → 봉제 → 시뮬레이션 전 과정을 교육 가능 |
| Cross-Discipline | 패션, 게임 아트, 영화 VFX 등 다양한 전공에서 활용 |
| Easy Student Management | CompanyID로 License ID 일괄 생성 · 관리 (구매한 Seat 수 단위) |

### Section 3 — Academic Plan

플랜 카드 단일 구성 (Academic Annual 하나).

| 항목 | 내용 |
|------|------|
| 플랜명 | Academic Annual |
| 가격 | $1,500/Seat/년 |
| 라이선스 유형 | Network Online |
| 동시접속 | 구매된 N Seat (동시에 수업에 참여할 학생 수만큼 구매) |
| 갱신 방식 | Prepaid (연간 일시 납부) |
| 조건 | Academic 인증 완료된 CompanyID만 구매 가능 |
| CTA | plan-card.md CARD: ACADEMICS 매트릭스 기준 |

> 버튼 상태 핵심 분기:
> - Non-Member → "Get Verified" (활성) → 인증 플로우
> - CompanyID 인증 X → "Get Verified" (활성) → 인증 플로우
> - CompanyID 인증 대기 중 → "Verification in process" (비활성)
> - Academic(라이선스 있음) → "Start Now" (활성) → 결제/갱신 플로우
> - License ID(라이선스 있음) → "Check my License Status" (활성)
> - License ID(라이선스 없음) → "Contact your Group Manager" (비활성)

**Seat 수 선택 — 프리셋 탭** (plan.md §4-3)

```
Seat 수: [ 1 ] [ 5 ] [ 10 ] [ 직접 입력 ]
```

> 확정 정책: Seat당 $1,500/년. N Seat × $1,500 = 연간 총 비용. 예) 동시접속 10명 → 10 Seat → $15,000/년.
> Seat 선택은 **프리셋 탭 방식**으로만 제공한다. 스텝퍼 · 슬라이더 · 실시간 비용 계산기는 사용하지 않는다.
> 프리셋으로 커버되지 않는 규모는 [직접 입력] 탭으로 처리.

### Section 4 — Verification Process (인증 절차 안내)

인증이 복잡할 것이라는 우려를 낮추기 위한 단계별 시각화.

| 단계 | 설명 |
|------|------|
| Step 1 | CompanyID 계정 생성 (기관 대표 이메일로 가입) |
| Step 2 | Academic 인증 신청 — 교육기관 공식 도메인 등록 또는 서류 제출 |
| Step 3 | 검토 후 인증 완료 이메일 수신 |
| Step 4 | Academic Annual 라이선스 구매(Seat 수 선택) 및 License ID 생성 |

Visual: 4-step 수평 스텝퍼 컴포넌트

**인증 서류 안내 박스**

```
필요 서류:
- 정규 교육기관임을 증명하는 문서 사본 또는 PDF
  (예: 교육부 인가서, 학교 사업자 등록증 등)
```

### Section 5 — License Management for Admins

교육기관 IT 담당자 / 행정 담당자를 위한 관리 안내.

| 기능 | 설명 |
|------|------|
| License ID 생성 | 이메일 인증 방식 또는 ID 선생성 후 학생 직접 인증 |
| 동시접속 관리 | 구매한 Seat 수만큼 동시에 수업 진행 가능 |
| 학기 단위 재배정 | 졸업 · 수강 종료 후 License ID 재배정 가능 |
| CLO-SET 연동 | HQClosetIntegration 설정으로 학생 작업물 공유 관리 |

### Section 6 — Case Studies / Partner Institutions

파트너 교육기관 로고 또는 활용 사례. 신뢰 구축.
텍스트 형태의 도입 사례 1~2개 (인터뷰 형식).

### Section 7 — FAQ

| 질문 | 답변 요지 |
|------|---------|
| 인증까지 얼마나 걸리나요? | 서류 검토 후 이메일로 결과를 안내해 드려요. 처리 기간은 별도 안내하지 않음. |
| 학생 수보다 Seat 수가 적어도 되나요? | 동시접속 기준 — 수업 시간표를 고려해 필요한 Seat 수만 구매 가능 |
| 매년 갱신해야 하나요? | Academic Annual은 Prepaid — 만료 전 갱신 신청 필요 |
| Indie 플랜과 다른 점은? | Academic은 교육기관 인증 필요. Indie는 소규모 기업(연 매출 $500K 이하) 전용으로, Enterprise 고객이 별도 인증 후 특가로 이용 가능. |

### Section 8 — Final CTA

| 항목 | 내용 |
|------|------|
| Headline | "Ready to bring industry-standard tools into your classroom?" |
| Sub | "Academic verification is straightforward — submit your documents and we'll be in touch." |
| CTA 1 | "Get Verified" → 인증 플로우 |
| CTA 2 | "Contact Us" → 교육기관 전용 문의 폼 |

---

## 4. CTA 정의

| 위치 | 버튼 텍스트 | 연결 대상 | 비고 |
|------|------------|---------|------|
| Hero Primary | Get Verified | 인증 플로우 | MemberType 분기 적용 |
| Hero Secondary | See Academic Pricing | #pricing (앵커) | - |
| Plan 카드 | plan-card.md 기준 | 인증/결제/상태 페이지 | 매트릭스 100% 준수 |
| Step 4 인증 안내 | Start Verification | 인증 플로우 | - |
| Final CTA 1 | Get Verified | 인증 플로우 | - |
| Final CTA 2 | Contact Us | /contact?type=academic | 항상 활성 |

---

## 5. 운영 포인트

- 인증 처리 기간은 페이지에 노출하지 않음 (확정된 정책). 인증 결과는 이메일로만 안내.
- 인증 대기 중 상태에서 "Verification in process" 클릭 시 현재 진행 상태 확인 페이지로 연결 (단순 비활성만이면 CS 문의 폭증)
- Individual / Student MemberType 진입 시 상단 배너: "교육기관 계정이 아닌 경우 Individual 플랜을 확인해 보세요" + 링크
- Seat 수 선택은 프리셋 탭 [1][5][10][직접 입력]로 통일 (plan.md §4-3). 슬라이더 · 스텝퍼 · 실시간 비용 계산기 도입 금지

---

## 6. 이벤트 로깅 포인트

| 이벤트 | 발생 시점 |
|--------|---------|
| `solutions_academics_hero_cta_click` | Hero CTA 클릭 |
| `solutions_academics_get_verified_click` | "Get Verified" 클릭 (위치 파라미터 포함) |
| `solutions_academics_plan_card_click` | Plan 카드 CTA 클릭 |
| `solutions_academics_step_view` | 인증 절차 Step 섹션 진입 |
| `solutions_academics_faq_expand` | FAQ 항목 펼침 |
| `solutions_academics_contact_click` | "Contact Us" 클릭 |
