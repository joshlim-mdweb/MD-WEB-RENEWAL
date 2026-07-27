# [MD|SITE] Enterprise Trial 신청 폼 개선

---

## 1. Agenda

| 항목 | 내용 |
|------|------|
| TITLE | Enterprise Trial 신청 폼 개선 — 리드 품질 향상 및 중국 조건부 필드 추가 |
| DESCRIPTION | 기업 트라이얼 신청 폼의 기존 자유 입력 필드(200자)를 구조화 드롭다운으로 대체하고, 국가 = China 선택 시 WeChat ID / Mobile Number 필드를 조건부 표시한다. |
| 요청자 | BD팀 |
| JIRA | MDWEB-762 (Maintenance Epic: MDWEB-625) |
| DUE DATE | ASAP |

---

## 2. Background

기업 트라이얼 신청 폼 하단의 "요청 사항" 자유 입력 필드(최대 200자)가 두 가지 문제를 야기한다.

첫째, 품질 좋은 리드가 폼 완료를 포기한다. 자유로운 질문 형식은 신청자에게 어떤 정보를 써야 하는지 명확하지 않아 작성 부담을 높인다.

둘째, 스팸성·무의미 입력이 다수 접수된다. "asdfasdf", 동일 문장 반복, 제품 설명을 그대로 복붙하는 사례가 BD팀 후속 처리를 방해한다. 진짜 기업 신청인도 자유 서술보다 선택지가 주어졌을 때 더 정확하게 자신의 상황을 표현한다.

추가로, 중국 사용자는 이메일 외 WeChat / 모바일 번호가 주요 연락 수단이다. 국가 = China 선택 시 이 두 필드를 수집하면 BD 중국 팀의 후속 연락 성공률을 높인다.

---

## 3. Requirements

### 3-A. 폼 상단 헤더 (폼 카드 외부)

폼 카드 위, 페이지 배경 영역에 아래 순서로 배치한다.

**구성 순서 (위 → 아래)**

| 순서 | 요소 | 스펙 |
|------|------|------|
| 1 | 페이지 타이틀 | `ENTERPRISE TRIAL` — All Caps, Bold, letter-spacing 적용, 폼 가장 상단 배치 |
| 2 | 대상 배지 행 | `Enterprise` / `Academic Institution` — 타이틀 바로 아래, 중앙 정렬, Pill 형태, border.default 테두리, 12px Regular |
| 3 | 서비스 안내 박스 | surface.subtle 배경, border.default 테두리, ✓ 아이콘 + 안내 문구 2줄 |

**서비스 안내 박스 내용**

| 언어 | 항목 1 | 항목 2 |
|------|--------|--------|
| KO | `Enterprise Trial은 기업 및 교육기관이 구매 전 소프트웨어를 사용해볼 수 있는 서비스입니다.` | `트라이얼 기간 동안 최신 버전의 모든 기능을 사용할 수 있습니다.` |
| EN | `Enterprise trial is a service for Enterprise and Educational Institutions to try out the software before committing.` | `During the trial, you have access to all of the features we provide from the latest version.` |

- 폼 카드 내부에 있던 기존 안내 배너(기업·교육기관 전용 헤딩 + 개인 플랜 유도 문구)는 제거한다.
- 배지 행과 서비스 안내 박스는 폼 카드 진입 전 신청 자격을 명확히 인지할 수 있도록 폼 카드 외부에 배치한다.

---

### 3-B. 신청 정보 섹션 (기존 200자 자유 입력 대체)

| # | 필드명 (KO) | 필드명 (EN) | 타입 | 필수 | 선택지 |
|---|------------|------------|------|------|--------|
| ① | 신청 구분 | Organization Type | 라디오 버튼 (단일 선택) | 필수 | Corporate Studio / Agency / Educational Institution |
| ② | 트라이얼 목적 | Trial Purpose | 체크박스 (다중 선택) | 필수 | 캐릭터 의상 모델링 / 시뮬레이션 / 애니메이션 / 배경·환경 아트 / 파이프라인 호환성 테스트 (Maya, Unreal 등) / 기타 |
| ③ | 예상 도입 시기 | Expected Adoption Timeline | 라디오 버튼 (단일 선택) | 필수 | 1개월 이내 / 1~3개월 / 3~6개월 / 단순 기능 검토 |
| ④ | MD 도입 현황 | Current MD Usage | 라디오 버튼 (단일 선택) | 필수 | 처음 도입 검토 중 / 팀 내 개인 라이선스 사용자가 있고, 기업 전환 검토 중 / 다른 팀·프로젝트를 위해 도입 검토 중 / 기존 기업용 사용 중 (갱신·확장) |
| ⑤ | 기타 요청 사항 | Additional Notes | Textarea | 선택 | — (자유 입력, 기존 200자 필드 역할 유지) |

- 기존 요청 사항 자유 입력 필드는 완전히 삭제하지 않고 "기타 요청 사항 (선택)" 으로 격하 배치한다.
- 신규 필드 ①~④는 기존 7개 필드 하단에 "트라이얼 신청 정보" 섹션 구분선 이후 배치한다.
- ①③④는 선택지가 4개 이하로 적으므로 드롭다운 대신 라디오 버튼으로 표시하여 옵션을 한눈에 확인할 수 있도록 한다.
- 신청 구분(Organization Type) 필드는 섹션 최상단(①)에 배치한다. (2026-05-18 확정)
- "Freelancer / Personal" 옵션은 제거한다. Enterprise Trial은 기업 및 교육기관 전용임을 명확히 한다. (2026-05-18 확정)
- 신청 구분 필드 하단에 Personal Trial 안내 배너를 **상시 노출**한다. (조건부 표시 아님) (2026-05-18 확정)
- "예상 사용 인원" 필드는 최종 기획에서 제외되었으며 "신청 구분(Organization Type)"으로 대체된다.

#### 신청 구분 — Personal Trial 안내 배너 (상시 노출)

| 항목 | 내용 |
|------|------|
| 표시 조건 | 상시 노출 — 선택값에 무관하게 항상 표시 |
| 표시 위치 | ① 신청 구분 필드 바로 아래 인라인 |
| UI 형태 | 인라인 안내 배너 (info 타입, surface.subtle 배경) |
| 문구 (KO) | `Enterprise Trial은 기업 및 교육기관을 위한 서비스입니다. 개인 사용자는 Personal Trial을 이용해 주세요.` |
| 문구 (EN) | `For Freelancing or individual use, please redirect to Personal Trial` |
| CTA (KO) | `Personal Trial 신청하기 →` |
| CTA (EN) | `Apply for Personal Trial →` |
| GA 이벤트 | `enterprise_trial_personal_link_click` — CTA 클릭 시 (구현: Arsen) |
| 제출 차단 여부 | 차단 없음 |

### 3-C. 중국 조건부 필드 (국가 = China 선택 시)

| # | 필드명 | 타입 | 필수 | 비고 |
|---|--------|------|------|------|
| C-1 | WeChat ID | Text Input | 필수 | 국가 = China 선택 즉시 표시 |
| C-2 | Mobile Number (China) | Text Input | 필수 | +86 국가코드 고정 prefix 표시 |

- 국가 필드 값이 China 가 아닌 경우 두 필드는 DOM에서 숨긴다 (렌더링 제외).
- China 선택 즉시 안내 배너("중국 사용자를 위한 추가 정보를 입력해 주세요.") 를 국가 필드 아래에 표시한다.
- 국가가 China → 다른 국가로 변경되면 두 필드는 즉시 숨기고 값을 초기화한다.

### 3-D. 기관 홈페이지 DNS 검증

기관 홈페이지 필드 입력값의 도메인이 실제로 존재하는지 DNS 조회로 확인한다.

| 항목 | 내용 |
|------|------|
| 트리거 | 폼 제출(submit) 시점 |
| 검증 대상 | 입력된 URL에서 hostname 추출 → DNS A/CNAME 레코드 조회 |
| 검증 실패 조건 | 도메인이 존재하지 않음 (NXDOMAIN) |
| 실패 시 동작 | 제출 블로킹 + 필드 하단에 인라인 에러 표시 |
| 에러 문구 | "유효하지 않은 도메인입니다. 기관 홈페이지 주소를 다시 확인해 주세요." |
| 네트워크 오류 / 타임아웃 | 검증 불가 상태 → 블로킹 없이 제출 허용 (false negative 허용) |
| 차단 대상 | `localhost`, 사설 IP(192.168.x.x, 10.x.x.x 등), IP 직접 입력 |
| HubSpot 연동 | DNS 검증 결과(pass/fail/skip)를 별도 hidden 필드로 함께 전송 |

**제약 사항**
- 서버사이드 DNS 조회 필요 (브라우저 DNS API 없음) → API Route 구현
- 조회 타임아웃: 3초. 초과 시 skip 처리
- 업무용 이메일 도메인 검증과 별개 — 홈페이지 URL 기반이므로 false positive 위험 낮음

### 3-E. 업무용 이메일 자동 채우기 ("내 이메일 사용")

로그인한 회원이 폼 작성 시 이메일 입력 부담을 줄이기 위한 기능.

| 항목 | 내용 |
|------|------|
| 표시 위치 | 업무용 이메일 입력 필드 바로 아래 (인라인 텍스트 링크) |
| 표시 조건 | 항상 표시 (비회원 포함) |
| 활성 상태 | 로그인 회원 — 계정 이메일로 자동 채우기 |
| 비활성 상태 | 비회원 — 버튼 비활성화, hover 시 "로그인 후 이용 가능" 툴팁 |
| KO 레이블 | `내 이메일 사용` |
| EN 레이블 | `Use my email` |
| 색상 | 브랜드 오렌지 (#e8622a) — 실제 사이트 기준 |

---

### 3-F. 제출 전 지원 안내 박스 (폼 카드 내부, 약관 위)

BD팀 확인 요청 및 정보 보호 안내를 약관 위에 배치한다.

**위치**: 기타 요청 사항(⑤) 아래, 약관 체크박스 위

**내용 구성**

| 요소 | KO | EN |
|------|----|----|
| 제목 | `정확한 지원을 위해` | `Helping You Get the Best Support` |
| 본문 | `정보 확인이 어렵거나 기업 현황에 대한 충분한 정보가 없으면 정확한 지원이 어려울 수 있습니다.` | `We may be unable to respond if your corporate information cannot be verified or is insufficient.` |
| ⓘ 줄 | `제공하신 정보는 안전하게 보호됩니다.` | `Information you provided will be kept confidential.` |

---

### 3-G. 약관 텍스트 (BD팀 확인 트리밍 버전)

약관 체크박스 2개의 확정 텍스트.

**체크박스 1 (필수)**

| 언어 | 텍스트 |
|------|--------|
| KO | `담당자가 이메일로 안내 드립니다. 정보 확인이 어려운 경우, 다음 단계 진행이 어려울 수 있습니다.*` |
| EN | `I understand that a representative will follow up by email after verification. If information cannot be verified, we may not be able to proceed.*` |

**체크박스 2 (선택)**

| 언어 | 텍스트 |
|------|--------|
| KO | `[선택] 마케팅 정보 수신에 동의합니다.` |
| EN | `I would like to receive more information about Marvelous Designer events, updates, special promotions, and other offers. (optional)` |

**약관 하단 note**

| 언어 | 텍스트 |
|------|--------|
| KO | `*언제든지 동의를 철회할 수 있습니다.` |
| EN | `*You may withdraw your consent at any time.` |

---

### 3-H. GA 이벤트 명세

| 이벤트명 | 트리거 | 구현 담당 |
|----------|--------|-----------|
| `enterprise_trial_personal_link_click` | 신청 구분 하단 "Personal Trial 신청하기 →" / "Apply for Personal Trial →" 클릭 시 | Arsen |
| `enterprise_trial_submit` | 폼 Submit 버튼 클릭 시 | Arsen |

---

### 3-I. 보류 항목

- 업무용 이메일 도메인 검증(개인 이메일 차단): 소규모 스튜디오가 gmail을 업무용으로 사용하는 사례가 많아 false positive 위험이 높음. 기존 회원 가입 플로우와 정책 불일치 문제도 있어 이번 개선에서 제외.

---

## 8. Change History

| 날짜 | 변경 내용 | 결정자 |
|------|-----------|--------|
| 2026-05-18 | 신청 구분(Organization Type) 필드를 섹션 최상단으로 이동 | Jacob Jung, Josh |
| 2026-05-18 | Organization Type 선택지에서 "Freelancer / Personal" 제거 | Jay Lee, Josh, Jacob Jung |
| 2026-05-18 | Personal Trial 안내 배너 상시 노출로 변경 (조건부 → 항상) | Jacob Jung, Josh |
| 2026-05-18 | GA 이벤트 2개 추가 명세 (enterprise_trial_personal_link_click, enterprise_trial_submit) | Arsen |

---

## 4. Scope

| 영역 | 포함 | 제외 |
|------|------|------|
| MD Site (프론트엔드) | 신청 폼 필드 추가·재배치, 조건부 필드 로직 | 기존 폼 레이아웃 구조 변경 |
| HubSpot (연동) | 신규 필드 HubSpot 매핑, China 조건부 필드 포함 | HubSpot 워크플로우 변경 |
| 이메일 도메인 검증 | — | 이번 릴리즈 제외 (보류) |
| BD 운영 | — | 운영 가이드 문서 (별도 논의) |

---

## 5. Flow

### 기본 플로우 (비중국 사용자)

1. 사용자가 Enterprise Trial 신청 폼 진입
2. 기존 7개 필드 입력 (이름 / 업무용 이메일 / 직무 / 국가 / 기관명 / 기관 홈페이지 / 산업 분류)
3. "트라이얼 신청 정보" 섹션에서 ①~④ 라디오 버튼 필수 입력
4. 기타 요청 사항 선택 입력
5. 약관 동의 체크 (2개) 후 제출
6. HubSpot으로 전송

### 조건부 플로우 (중국 사용자)

1. 사용자가 국가 드롭다운에서 "China" 선택
2. 국가 필드 아래 안내 배너 표시 + WeChat ID / Mobile Number 필드 표시
3. WeChat ID + Mobile Number 입력 (필수)
4. 이후 기본 플로우와 동일

---

## 6. Action Item

### MD Site (fe)

- [ ] 기존 200자 요청 사항 필드를 "기타 요청 사항 (선택)" 으로 격하
- [ ] "트라이얼 신청 정보" 섹션 구분선 + 신규 필드 ①~④ 추가
- [ ] 트라이얼 목적 체크박스 다중 선택 UI 구현
- [ ] 신청 구분 / 예상 도입 시기 / MD 도입 현황 라디오 버튼 구현 (신청 구분은 섹션 최상단 배치, Corporate Studio/Agency + Educational Institution 2개 옵션만)
- [ ] 신청 구분 필드 하단 Personal Trial 안내 배너 상시 노출 (조건부 아님, GA 이벤트 enterprise_trial_personal_link_click 포함)
- [ ] 국가 = China 조건부 WeChat ID / Mobile Number 필드 표시·숨김 로직
- [ ] China 선택 시 안내 배너 표시
- [ ] HubSpot 신규 필드 매핑 연결
- [ ] GA 이벤트 구현: enterprise_trial_personal_link_click (Personal Trial CTA 클릭 시)
- [ ] GA 이벤트 구현: enterprise_trial_submit (Submit 버튼 클릭 시)

### 검증

- [ ] China 선택 시 필드 표시, 타 국가 선택 시 숨김·초기화 동작 확인
- [ ] 필수 필드 미입력 시 제출 블로킹 확인
- [ ] HubSpot에 모든 신규 필드 값 정상 전송 확인

---

## 7. Impact

| 지표 | 기대 효과 |
|------|-----------|
| 폼 완료율 | 구조화 입력으로 작성 부담 감소 → 완료율 향상 |
| 리드 품질 | BD팀 후속 처리 기준 정보 수집 → 스팸성 신청 감소 |
| 중국 BD 연락 성공률 | WeChat / Mobile 수집으로 이메일 외 연락 경로 확보 |
