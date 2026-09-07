---
project: checkout-policy-wave
updated: 2026-07-29
---

## 관련 Jira 티켓
- MDWEB-870 — UX | 결제 페이지 & 흐름 (Epic MDWEB-827 "2026 | 결제 페이지")

## TODO
1. **Slack canvas 정책 문서 전면 재작성 (KO)** — 조각 패치로 구성·표현이 누더기가 됨. `policy-doc.md`를 소스로 삼아 캔버스 본문 전부 delete → 한 배치 append. 문체는 `~합니다`(정책서)
2. **Slack canvas 영문 섹션 재작성 (EN)** — 1번 완료 후. 현재 영문 §8이 구 정책(Reserve)으로 남아 사실 오류
3. **screen-list.md 재구성** — CASE VIEW 제거, 행(row) 기반 7 rows 구조로 (승인된 구성 아래 참조)
4. **PACKET-figma.md 작성 + Row 1·2 드로잉 하달** — 3번 완료 후. clone 소스 `5933:3667`
5. **문서 동기화 정리** — 로컬 policy-doc ↔ 캔버스 정합 · design-spec G15/G26/G28 해소 · memory `feedback_figma_frame_spacing` 갱신

## 재개 방법 (`/clear` 이후)

```
1. /initiate          — 이 파일이 최신이므로 자동 로드됨
2. /orch              — wave 상태 복구 (requirements/waves/active/ PACKET·REPORT 확인)
3. TaskList           — 태스크 5개 확인 (2번은 1번 blocked, 4번은 3번 blocked)
```

`/initiate`만으로도 이 파일의 TODO가 올라온다. wave 채널 상태까지 필요하면 `/orch`를 이어서 실행.

**먼저 읽을 파일 3개** — 이것만 읽으면 맥락이 복원된다:
- `requirements/waves/active/policy-doc.md` — 확정 정책 전문 (캔버스 재작성 소스)
- `requirements/waves/active/screen-list.md` — 화면 목록 (재구성 대상)
- `requirements/waves/active/design-spec.md` — 화면 설계 상세 + 정책 격차 G1~G30

---

## 산출물 위치

| 항목 | 위치 |
|---|---|
| 정책 문서 (게시본) | Slack canvas `F0BL0SRE4TZ` — https://clo3d.slack.com/docs/T04BT3VBR/F0BL0SRE4TZ |
| 정책 문서 (로컬 원본) | `requirements/waves/active/policy-doc.md` |
| 화면 설계 상세 | `requirements/waves/active/design-spec.md` |
| 화면 목록 | `requirements/waves/active/screen-list.md` |
| 분할 전 원본 (동결) | `requirements/waves/active/prd-draft.md` |
| pm 채널 | `PACKET-pm.md` · `REPORT-pm.md` |
| Figma 타깃 | file `PeCid7uJcg0HenViaaiHUp` / page `Order/Checkout (In progress🔥)` (`237:3132`) |
| Figma 레퍼런스 | My Page 섹션 `5926:3009` — 구성 방식 기준 |

---

## 확정 정책 (Josh·Klay 답변으로 확정된 것 — 다시 묻지 말 것)

### 계정·용어
- **Group → Organization** 으로 용어 통일. Group Owner → Organization Owner
- MemberType 폐지 → Non-Member / Member / SW Account 3종
- License ID → SW Account (Web 로그인 없음)

### Seat
- **Seat 수 = 동시접속 허용 수.** 계정 개수가 아님
- 동시접속 집계 = SW Account 로그인 + **Userpool Guest 접속**
- 한 번의 결제로 구매한 Seat는 **하나의 SW Account에 배정**. 배정 시점은 **결제 시점**
- 최대: Enterprise Team · Team Linux **99** / Indie **5**(초과 시 Enterprise 구매 요구)
- Seat 선택 UI 구성(프리셋 탭)은 **Team Console 소관** — 이 문서에서 다루지 않음

### 플랜
- Group 플랜 표기 금액은 **Seat 단가**. 총액 = 단가 × Seat 수
- **Enterprise Team Linux** (구 Network Online Linux) — Enterprise Team과 동일 구조, Linux OS 전용, Annual Prepaid only, $2,300/Seat
- Individual Annual은 Prepaid 아님 → **연간 자동결제**. 자동 갱신 상시, 결제 페이지에 on/off 제어 없음

### 결제 모드
- **Reserve 미구현.** 결제 페이지의 "구매 유형" 선택 행 **자체 폐기** (`plan.md` §4-2 폐기 대상)
- Add(Seat 추가) · Extend(기간 연장)는 **Team Console에서 시작**, 결제 단계만 결제 페이지로 넘어옴
- Add/Extend 여부는 진입 컨텍스트로 이미 결정 — 사용자가 고르지 않음
- Indie는 Add만 가능, Extend 불가

### 금액 계산
- Add(Seat만): 기존 `endDate`까지 남은 기간 **일할 계산**. 추가 Seat 만료일 = 기존 `endDate`
- Extend: `연장 연수 × Seat 수`
- Extend + Seat 추가: 위 둘의 합
- **일할 계산은 Annual 라이선스의 Add · Extend에만 적용.** Single→Team 전환에는 적용 안 함
- 세금은 **Avalara 기준**, Coupon·Discount 적용 **후** 금액 기준
- Coupon은 **연간 결제만**

### Enterprise Single → Team 전환 (2026-07-29 Klay Kim 확인 — 확정)
- **즉시 전환. 전환 예약(Reserve) 아님**
- 전환 시점: 구매 즉시 Annual로 변경
- 기간: **기존 만료일 + 1년**
- 일할 정산: **없음** (즉시 변경이므로)
- Seat 수: 구매 시점에 선택
- SW Account: 기존 계정 그대로 승계 (라이선스 할당 상태도 승계)

### 진입 조건
- **라이선스 보유 시 동일 계층 플랜 재구매 차단.** 단 개인 라이선스(Individual·Student) 보유자도 Organization 생성 · 인증 신청 · Organization 플랜 구매·배정은 **가능**
- **Indie 인증 대기 상태는 노출하지 않음.** 인증 미완료와 동일한 안내 표시
- Student 이용 기간: **최초 학생 인증 승인일 기준 4년**, 구매 횟수 제한 **없음** (구 2회 제한 폐기)

### 무료 기간
- Student Benefit: 결제 금액 **$0** 표시. **"Trial" 라벨 금지**
- Individual 14일 Trial: **결제 페이지 경유** (결제 수단 등록 필요), 금액 $0

### 범위 제외
- **결제수단 국가 분기(Kakao Pay · AliPay) 이번에 안 함** — 기본 구성(신용/체크카드 + PayPal)만

## 남은 미결 (1건)
- 결제수단 국가 분기 — 이번 범위 제외. 이후 별도 확정 필요

## 확인 필요 (그리기 전)
- **§6 지불 방식 — Annual이 "기본 선택"인가 "우선 유도"인가.** 서두는 "기본값은 연간", 표는 `가능 (우선 유도)`. Row 1 프레임에서 Annual 토글 selected 여부가 갈림. 잠정: Annual selected + 권장 표기, Annotation에 *(정책 확인 필요)*

---

## screen-list 승인 구성 (재작성 시 이 표 그대로)

SECTION `CHECKOUT` — 7 rows · 풀 WF 10 · 작은 프레임 16 · TITLE 7

| Row | TITLE | 풀 WF (2448×1216) | 작은 프레임 (≈960) |
|---|---|---|---|
| 1 | CHECKOUT: INDIVIDUAL | Individual 기본(Annual 선택) · Monthly 전환 | Coupon 성공 · Coupon 에러 · Student Benefit $0 |
| 2 | CHECKOUT: ORGANIZATION | Organization 기본(SW Account + Seat) | SW Account 드롭다운 Open · 신규 생성 · Empty · Seat 직접 입력 |
| 3 | CHECKOUT: TAX & ADDRESS | US·CA ZIP 미입력 · ZIP 입력 완료 | 사업자 링크→VAT ID 확장 · VAT 0% Reverse Charge |
| 4 | CHECKOUT: ADD & EXTEND | Seat Add · Extend | — |
| 5 | CHECKOUT: SINGLE TO TEAM | 즉시 전환 (기존 만료일+1년) | — |
| 6 | CHECKOUT: RESULT | Order Complete | Payment Failed 모달 · 401 · 500 |
| 7 | CHECKOUT: BLOCKED | 차단 화면 골격 | 라이선스 보유 · Student 기간 초과 · 인증 미완료 · 인증 대기 · Organization 없음 · Skeleton |

**CASE VIEW 프레임 만들지 않는다.** 이 파일은 상태 변이를 행 안 서브컬럼의 작은 프레임으로 표현한다.

---

## Figma 실측 스펙 (레퍼런스 `5926:3009` 측정 완료 — 추측 금지)

**WF 프레임 구조**
```
Frame 2448 × 1216  (VERTICAL, itemSpacing 24, padding 24)
├── Header 2400 × 64  (HORIZONTAL, gap 12)
│   ├── Board Header 1920 × 64
│   └── Description Header 468 × 64
└── Contents 2400 × 1080  (HORIZONTAL, gap 12)
    ├── Screen 1920 × 1080
    │   └── Page 1920 × 1080
    │       ├── Header Default (instance) 1920 × 96
    │       └── Body 1920 × 984
    └── Description 468 × 1080   ← 레이어명에 U+0008 선행문자 있음
        └── Description List  w 444 (VERTICAL, itemSpacing 10, padding 10)
            └── Annotation Box  w 424 (VERTICAL, padding 8, radius 6, itemSpacing 6)
```
- Description 프레임: VERTICAL, itemSpacing 8, padding 12, fill SOLID white

**그리드**
| 항목 | 실측값 |
|---|---|
| TITLE x | 97 |
| 첫 WF x | 2586 |
| 가로 pitch | 2488 (gap 40) |
| 행 pitch | ≈1310 (gap 74~161 편차) |

**TITLE 카드** — 2448×1216, bg `r=0.0606`, Poppins Medium 60px, 오렌지 `r=1 g=0.5412 b=0`, ALL CAPS

**clone 소스 후보**
| node-id | 이름 | 비고 |
|---|---|---|
| `5933:3667` | Account | 표준 2448×1216 — **1순위** |
| `6155:1910` | Change Email | 표준 |
| `6155:2035` | Change Password | 표준 |

**타깃 페이지 현재 상태** — `237:3132`에 TEXT 노드 15개만 있고 FRAME/SECTION 0개. 전부 x=0,y=0에 겹쳐 있음 (이전 탐색 잔재, 정리 대상)

**주의 (memory 기반)**
- `resize()` 후 `primaryAxisSizingMode` 재설정
- `layoutSizingHorizontal = "FILL"` 은 `appendChild()` 이후
- Poppins + Inter 폰트 사전 로드
- WF 내 UI 문구 **영문**, Annotation·Description **한국어**
- screenshot 없이 완료 선언 금지

---

## 이번 세션에서 배운 것 (반복 금지)

1. **Slack canvas 조각 패치는 누더기를 만든다.** 섹션별 targeted replace를 20번 넘게 하면 구성·문장 층이 깨진다. 문서가 크게 바뀔 때는 **전부 delete → 한 배치 append**.
2. **Josh가 캔버스를 실시간 편집한다.** section ID가 수시로 무효화되고 `target_section_not_found`가 난다. 쓰기 직전에 `slack_read_canvas`로 ID를 다시 읽고, 한 번에 끝낸다. 실패한 배치는 Josh 편집분을 덮어쓸 뻔한 것이므로 실패가 오히려 안전장치였다.
3. **문체는 저장 위치가 아니라 문서 타입으로 결정.** 정책서 = `~합니다`(`confluence-doc.md`), PRD = `~한다`(`prd-writing.md`). 처음에 PRD 규칙을 적용해서 전면 재작성이 필요했다. → memory `feedback_doc_tone_by_type`
4. **결제 문서에 플랜 정책을 끌어들이지 않는다.** `plan.md` 변경을 따라가다 Student 4년 규칙·Legacy 처리까지 결제 문서에 들어갔고 덜어내야 했다. 플랜 정책은 다른 담당자 소관.
5. **md-pm이 하달을 놓칠 수 있다.** SendMessage 후 파일이 안 생기면 재하달. 1회 발생.

## 완료 로그
### 2026-07-29
- 전역 규칙에 **Gate A "플랜 먼저 보고"** 신설 — `planning-packet.md` §1(Phase A/B 분리)·§2(3개 표)·§5·§9(Gate A 블록), `wave-prep.md` Step 2-3 삽입 + Step 재정렬
- pm 채널 Phase A(policy-outline·screen-list) → Gate A 승인 → Phase B(prd-draft 733줄) 완료
- prd-draft를 독자 기준으로 분할 — `policy-doc.md`(정책, 이해관계자용) + `design-spec.md`(화면 상세, 419줄)
- 미결 12건 중 11건 확정 (Josh 답변 10건 + Klay Kim §8 확정)
- 정책 문서 한국어판 Slack canvas 게시 → `~합니다` 체로 전면 전환 → 영문 섹션 append
- Figma 레퍼런스 `5926:3009` 실측 완료 (WF 구조·그리드·Description 스펙)
- memory `feedback_doc_tone_by_type` 신규 작성
