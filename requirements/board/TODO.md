# TODO — 단일 투두리스트

이 파일이 유일한 작업 목록이다. 문서 축과 Figma 축을 **모두** 추적한다.
프로토콜: `.claude/rules/planner-workflow.md`

**소스**: Jira `UX |` 티켓 (기획 축). Epic = 페이지 단위. `PD | / FE | / BE |` 는 디자인·개발 축이라 넣지 않는다.
Jira는 **읽기 전용 소스** — 이 워크플로우에서 티켓을 새로 만들지 않는다.

**이 파일은 Manager가 관리한다.** 각 역할은 일만 하고, 진행 상황 기록은 Manager가 한다. 역할 터미널이 스스로 이 표를 고치지 않아도 된다 — 상태가 바뀌면 Manager에게 알리고, Manager가 여기와 세션 task list 양쪽에 반영한다.

**행 구분**

| 접두어 | 축 | 실행 |
|---|---|---|
| `T-` | 문서 (기획·정책) | Planner가 분해·배정 → Research · Policy Writer |
| `F-` | Figma | **Josh가 직접** Figma Wireframe · Figma Description 터미널과 작업 |

두 축 모두 여기서 추적한다. Josh가 Figma를 직접 통솔하는 것과, 진행 상황이 기록되는 것은 별개다.

**상태값**: `대기` · `진행중` · `검토대기` · `완료` · `보류`

**2026-09-01 정리**: MDWEB-870(Checkout)·MDWEB-868(Plan) 관련 완료 행 전체와 해소된 결정 대기 항목을 아카이브로 이관했다. 전체 이력: `requirements/board/TODO-archive-2026-09-01.md`. 아래 표는 활성 작업만 남긴 상태다.

---

## T- 문서 작업 (Planner 소유)

| ID | Jira | 작업 | 배정 | 상태 | 산출물 | 메모 | 갱신 |
|---|---|---|---|---|---|---|---|

현재 활성 `T-` 행 없음. MDWEB-870(T-01 및 하위 전건)·MDWEB-868(T-02 및 하위 전건)은 아래 "2026-09-01 정리 — 완료 처리" 참조 후 아카이브로 이관했다. MDWEB-873(T-03)·MDWEB-871·900(T-04)은 미착수 상태로 「보류·이월」로 옮겼다.

---

## F- Figma 작업 (Josh 소유)

| ID | Jira | 작업 | 배정 | 상태 | 산출물 | 메모 | 갱신 |
|---|---|---|---|---|---|---|---|
| F-01 | MDWEB-870 | Checkout WF 참조 목록 (잔여 갭) | Figma Wireframe | 대기 | — | **2026-09-01 축소** — 08-13 세운 30프레임 표 중 상당수가 F-06~F-20 개별 행으로 이미 완료됐다(Select SW Account 4행 + 상태 프레임 3장, Step 2 Organization 5프레임, Individual Monthly, Components 3섹션, Case Matrix). 옛 30프레임 표 전문은 아카이브 참조. **남은 갭만 유지**: Individual 축 — 기본(Annual) 화면·Monthly 전환·Coupon 성공/에러·Student Benefit $0 5프레임 미확인(F-16은 Monthly 1장만 확정). Organization 축 — Single→Team 즉시 전환 액션 화면. RESULT 축 — Order Complete·Payment Failed 모달·401·500 4프레임 전부 미착수. BLOCKED 축 — 차단 화면 골격 + 세부 5종 + Skeleton 전부 미착수. 그릴 프레임을 Josh가 고르면 개별 `F-` 행으로 등록 | 2026-09-01 |
| F-19 | MDWEB-870 | Checkout Organization 4프레임 2컬럼 전환 | Figma Wireframe | 검토대기 | Figma `PeCid7uJcg0HenViaaiHUp` / page `Order/Checkout (In progress🔥)` / 섹션 `Checkout_Organization`(`7793:2634`) — `Checkout Enterprise Team`(`7172:3150`), `Checkout Enterprise Single`(`7782:28043`), `Checkout Academics`(`7793:2008`), `Checkout Academics - 50% Discount applied`(`7793:2454`). 네 프레임 모두 2448×1216, Screen 1920×1080 복귀 | Josh 직접 지시. `Checkout Enterprise Team - Add/Extend`(`7905:5757`)를 예시로 나머지 4프레임에 적용. **규격**: wrap 1200 x=360, 좌 720, 우 466 x=1094, gap 14. 우 컬럼은 `COMPONENTS: ORDER SUMMARY`(`7992:1577`)의 케이스 변형을 clone. **적용 항목**: Order Summary를 우 컬럼으로 이동, 약관과 CTA를 우 컬럼 카드 안으로 옮기고 **약관을 CTA 위로** 순서 반전, Seats 계산 박스 제거, 계산식을 Subtotal 하위로 이관, 세금 행을 세 조각(`VAT` Medium + `10% applied` 회색 이탤릭 + `+ 금액`)으로, CTA `Check out`, Tax ID placeholder `Tax ID (optional)`, 금액 재산출. **세금 명칭은 네 프레임 모두 `VAT`로 통일**(Josh 확정, 더미 주소는 미국 그대로). **세금 계산은 `(Subtotal - Discount) × 세율`** — Academics 50%가 `(3,000-1,500)×10%=150`. **약관 문구는 대상 프레임 것을 살림** — Enterprise Single은 구독 6항목인데 컴포넌트 변형이 선불 문구였다. **배지를 Screen 최상위 레이어로 올림**(Josh 지시). **후속**: Description 개정(재계산 트리거 통합, CTA 활성 조건, 약관 체크박스) · Individual 4프레임 적용. `patterns.md`에 2컬럼 규격 절 신설 | 2026-08-31 |
| F-20 | — | My Page Profile Picture: 업로드 허용 형식과 크기 제약 반영 (Description + 모달 문구) | Figma Description | 검토대기 | Figma `PeCid7uJcg0HenViaaiHUp` / page `MyPage ✅` — 노트 ④ `5950:1794` · 모달 `6124:1859`(`6124:1863`), `6124:1921`(`6124:1925`) · Preferred Language 모달 `6124:1881` | Josh 직접 지시. 근거: Arden Figma 코멘트(`5950:1789`) — FE가 확장자를 jpg, jpeg, png, gif, bmp로 제한 중이고 BE도 동일하게 맞춤. SVG는 XSS 우려로 제외. 노트 ④에 허용 형식과 실패 케이스 2종(형식, 크기) 추가, 노트가 173→407로 늘어 Description이 180px 잘리므로 Contents를 2159로 키우고 아래 섹션 전부 180px 하향 이동. `spec.md` §7 `applyRichDescription()` 적용(허용 형식 SemiBold, 플래그 `#CC3300`). **모달 clone 오류 발견** — Profile Image 2장과 Preferred Language 1장이 전부 `Please enter a new username.`를 달고 있었다. 앞 2장은 업로드 안내로 교체, Preferred Language는 적용 범위 근거가 없어 삭제만 하고 D-23으로 남김. `error-copy.md` Account 탭에 에러 문구 2행 추가 | 2026-09-01 |

| F-21 | MDWEB-870 | Order Summary Next Payment 행을 문장형 배너로 전환 | Figma Wireframe | 완료 | Figma `PeCid7uJcg0HenViaaiHUp` / page `Order/Checkout ✅` — 컴포넌트 `COMPONENTS: ORDER SUMMARY`(`7992:1568`) 변형 6곳 + 화면 6곳(`7782:28345`, `7793:1366`, `7892:2882`, `7793:1681`, `7875:2476`, `7782:28043`), 배너 인스턴스 `8531:1655`~`8531:1747` | Josh 직접 지시 (2026-09-03). 문구 `Your next payment of {nextPaymentAmount} USD is due on {nextPaymentDate}.`, 첫 결제 전 케이스(Individual Trial, Student Benefit applied)는 first payment, 날짜 월 3글자 축약(`ux-writing.md` §1.1 개정). 배너는 기존 `Alert` 컴포넌트(`8489:1710`, type=Noti) 인스턴스: 기본값이 노란 테두리 + 버튼 노출이라 레퍼런스 인스턴스(`8489:1883`) 오버라이드(파랑 테두리, 버튼 숨김) 복제 필수. Description 갱신: 구성 노트(`8025:1555`) 배너 블록 신설, 화면 노트 5곳, Case Matrix 셀 6곳. `patterns.md` Order Summary 절 기록. 선불형(Enterprise Team, Academics)은 배너 없음 유지. **같은 날 추가 확정 2건**: ①합계 라벨 `Total for today`를 `Total`로 전환(화면 라벨 21곳 + 노트, Case Matrix 서술 14곳) ②USD 소수는 2자리 채움, 정수는 소수점 없음. Manager 세션 부재로 직접 기재 | 2026-09-07 |

| F-22 | MDWEB-870 | Checkout Academics Add/Extend 4케이스 와이어프레임 | Figma Wireframe | 완료 | Figma `PeCid7uJcg0HenViaaiHUp` / page `Order/Checkout ✅` / 섹션 `Checkout_Organization` — `Checkout Academics - Add Seats`(`8555:1727`), `Checkout Academics - Add Seats, 50% Discount applied`(`8556:1745`), `Checkout Academics - Add and Extend, 50% Discount on Extension`(`8547:2394`), `Checkout Academics - Add and Extend, 50% Discount applied`(`8554:1709`) | Josh 직접 지시 (2026-09-03). 케이스 변수와 할인 조건은 Josh 제공: Add 구간 {addedSeats} 10 이상, Extend 구간 {totalSeats} 10 이상 각각 50%, 단가 300 USD. Total 순서대로 1,617 / 1,155 / 4,917 / 5,445 USD (검산 완료). 구조는 `Checkout Enterprise Team - Add/Extend` 기반, Josh 사본 재활용. 구성 노트에 구간 판정 2줄 등재. 상세는 `patterns.md` 금액 요약 패널 절. checkout.md 정책 문서 반영 여부는 Josh 판단 대기. Manager 세션 부재로 직접 기재. **2026-09-07 캡션 체계 개정 반영**: Seat 할인 캡션을 Discount 행에서 Breakdown 행으로 이동(빨간 2종: `Add {n} more Seats for 50% off`, `50% off applied`), 기간 칩 신설(`Remaining Period`, `Next Period`), New 2프레임과 컴포넌트 변형 6, 7까지 적용. 상세는 `patterns.md` 09-07 항목, 시안 Artifact `8398f512`. **09-07 2차**: Seat 할인을 Discount 행에서 분리(정가 취소선 + 할인 후 금액 병기, Subtotal 선반영, Discount는 쿠폰 전용), 캡션 우측 정렬, Subtotal 행을 Breakdown 위로. 기간 칩은 Enterprise Add/Extend(`7905:5757`)와 컴포넌트 변형 4에도 적용. 요약 카드 `8668:1763`, Canvas `F0BV7UUE84T` | 2026-09-07 |

| F-23 | MDWEB-870 | Order/Checkout 페이지 Description 정리 (할인 표시 체계 확정 후속) | Figma Description | 완료 | Figma `PeCid7uJcg0HenViaaiHUp` / page `Order/Checkout ✅` — 컴포넌트 Description List(`7992:1584`) 노트 1~10, 신설 노트 3장(`8714:1763`, `8714:1770`, `8714:1777`), Screen 배지 5곳 재번호, Academics 4프레임 노트(`8555:1913`, `8556:1931`, `8547:2589`, `8554:1895`), New 2프레임 노트(`8009:1541`, `8009:1555`, `8009:1573`), Enterprise 노트(`8007:1555`) | Josh 직접 지시 (2026-09-07). ①배지와 노트 번호 정합: 배지 중복(5 두 개)과 결번(7, 8)을 읽기 순서 1~10 연속으로 재번호, 노트도 재번호(Individual Monthly 5를 3으로, Enterprise Single 8을 5로) 후 번호 순 재배치 ②Individual Trial, Student Benefit applied, Student Benefit used 노트 3장 신설 ③케이스 노트 1~7 본문 첫 줄 삭제(제목 반복 금지) ④Academics 4프레임 노트에 컴포넌트 참조 줄 추가, Case 3, 4의 {totalSeats} 판정 줄 삭제(구성 노트와 중복) ⑤New2 노트 스테일 플래그 삭제(중복 블록은 화면에서 해소 확인)와 규칙 중복 병합 ⑥이음표 2건 콜론 치환 ⑦New1 노트의 `합계 라벨은 Total` 줄 삭제. 잘림, 이음표 재스캔 전부 통과. Manager 세션 부재로 직접 기재 | 2026-09-07 |

| F-24 | MDWEB-870 | Academic Add/Extend Order Summary 노트 Case 포맷 재작성 + Enterprise Order Summary 노트 신설 | Figma Description | 검토대기 | Figma `PeCid7uJcg0HenViaaiHUp` / page `Order/Checkout ✅` — Academic 4프레임 노트(`8555:1913`, `8556:1931`, `8547:2589`, `8554:1895`), Enterprise `Checkout Enterprise Team - Add/Extend`(`7905:5757`) 신설 노트 `8732:1916` + Screen 배지 `8732:1923` | Josh 직접 지시 (2026-09-07). 계산 서술을 Josh Case 포맷으로 재작성: Case 제목, 이유 문장(제목 바로 아래), Add 여부와 Extend 여부와 Seat 수 필드, 계산식, UI 표시 블록(구간 행별 취소선과 병기 금액, 칩, 캡션, Subtotal). 화면 금액 전수 대조 후 기입(2,100 취소선 1,050 / 6,000 취소선 3,000 / 7,800 취소선 3,900). Enterprise에는 4번 Order Summary 참조 노트(공통 구성, 기간 칩, Seat 할인 없음) 신설. 개발과 디자인 공유용 슬랙 초안은 채팅으로 전달, Josh가 직접 전송. 포맷 규약은 patterns.md 09-07 4차 항목. Manager 세션 부재로 직접 기재 | 2026-09-07 |

**데이터 정리 필요 — Figma ID 중복**: `F-12`가 두 행(Wireframe "Team Add/Extend 프레임 완성" · Description "Enterprise Team Step 2 Description")에 중복 배정돼 있었다. 둘 다 완료 처리해 아카이브로 넘겼지만, 다음에 새 `F-` 행을 배정할 때 번호가 겹치지 않도록 확인할 것.

`F-` 작업은 Josh가 Figma 터미널과 직접 진행한다. Planner는 관여하지 않는다. 진행 상황은 Manager가 기록한다.

---

## 결정 대기 (Josh)

**미결이라고 그리기를 멈추지 않는다.** 해당 셀에 무엇이 필요한지 써 넣고 계속 그린다 (`figma-spec-card.md` §6.1). 이 표는 그 플래그의 실물 추적용이다. 아래는 **아직 살아 있는 항목만** — 해소된 항목은 아카이브로 이관했다.

| # | 항목 | 쟁점 | 플래그 위치 |
|---|---|---|---|
| D-1 | Tax ID 무효 시 처리 | 검증 시점과 결제 차단 여부. **BE 확인 필요** — 검증 API 유무와 응답 시점. 정책 게시본 Canvas에는 이 항목 자체가 없다 — 정책 문서 §7.2에만 있다. 확정되면 BD·CS에게 결제 차단 여부가 의미 있으므로 Canvas §2-1에 넣을지 함께 판단한다 | 정책 문서 `checkout.md` §7.2 · Flow & Case 코드 `T-08`(정의 미상, 이 항목 자체가 그 정의) · Figma Tax ID 입력 노트는 현재 F-12 계열(`7172:3150` Note⑤) · F-19(검토대기)로 이동해 있음 |
| D-2 | 라이선스 오남용 규정 | `docs/policy/**` 어디에도 근거가 없다. FAQ에 "법인도 Individual 사용 가능?" 항목이 있는데 **정책 원문이 없는 상태로 답하고 있다.** 신규 정책 확정 필요 | FAQ WF(완료, Figma `7181:132` 등) 2번 항목 |
| D-3 | `docs/policy/refund.md` main 미머지 | worktree `hazy-bubbling-quokka`에만 존재한다. FAQ가 인용하는 **24시간·3영업일의 유일한 출처**인데 main에 없어서 다른 작업이 근거로 쓸 수 없다. 병합 또는 재작성 판단 필요. **참고**: `plan.md` §3에 환불 정책이 별도 신설됐다(케이스 8종, Trial 경유 첫 결제만 24시간 환불) — 이걸로 FAQ가 인용할 출처 문제가 해소됐는지는 미확인, 병합 여부 판단 시 함께 볼 것 | FAQ WF 8번 항목 · `plan.md` §3 |
| D-5 | WF 프레임 높이 규격 | Note가 많은 화면은 Description List가 1080을 넘겨 **표준 `2448×1216`이 깨진다.** 원인은 노트 개수 × 상태·분기 기술량. **참고**: F-19의 2컬럼 전환(Order Summary를 우 컬럼으로 이동)이 Organization 4프레임의 세로 압박은 일부 줄였을 수 있다 — 검토대기 상태라 아직 확정 아님. **규격을 가변 높이로 개정할지 / 행 pitch를 실제 높이 기준으로 바꿀지** 판단 필요 | `figma-draw.md` §4 |
| D-7 | Indie Seat 상한 5의 적용 단위 | 계정이 여럿일 수 있어 **5가 Organization 전체 합계인지 SW Account당인지**가 갈린다. **범위 재확인 필요** — Indie는 이후 08-23·08-25 확정으로 웹 판매 자체에서 제외(백오더 전용)됐다. Checkout 정책 문서(`checkout.md` §9~§12)에서는 Indie 행이 이미 삭제됐을 가능성이 높다 — 이 쟁점이 여전히 유효하다면 소속을 `plan.md` Indie(백오더) 섹션으로 옮겨야 한다 | `plan.md` Indie 운영 정책 섹션 (구 `checkout.md` §12에서 이관 검토) |
| D-8 | Account Structure Canvas의 `Group` 용어 | 게시본 `F0BBYNQ3S8P`가 전체를 `Group` · `Group Owner`로 쓴다. `localization.md` §2.1은 `Group → Organization` 폐지로 확정했고 Checkout 정책 게시본은 이미 `Organization`을 쓴다. 두 게시본이 같은 개념을 다른 이름으로 부르는 상태. 전면 용어 교체라 범위가 커서 별도 판단 필요 | Canvas `F0BBYNQ3S8P` |
| D-10 | SW Account 생성 모달 입력 필드 | Step 1에서 계정을 신규 생성할 때 **무엇을 입력받는지가 정의돼 있지 않다.** `checkout.md` §9는 "Step 1 안에서 새로 생성한다"만 말하고 필드를 규정하지 않는다 | F-08 Team 원형(Create 링크, `7319:4177`) · Select SW Account 진입 프레임 전체(F-06~F-10, 완료·아카이브) |
| D-11 | 진입차단 09 라이선스 보유 차단 조건 | 진입 차단 케이스 중 **진입차단 09만 정책 문서 근거가 없다.** `checkout.md` §1 진입 조건 표에 해당 행이 없고 Figma Flow & Case 코드만 존재한다. 정확한 차단 조건과 이동 목적지가 미정. **참고**: F-08에서 "만료된 라이선스 보유 계정" 상태 자체가 존재하지 않는다는 정정이 있었다(빈 계정 취급) — 진입차단 09가 이 정정과 같은 종류의 상태를 다루는지 확인하면 실마리가 될 수 있다 | `checkout.md` §1 |
| D-12 | 레거시 Company ID 마이그레이션 방침 ↔ `member.md` §7 충돌 | Plan 페이지 카드 분기 삭제의 근거였던 **레거시 Company ID → Member+Organization 마이그레이션**이 확정됐다. 그런데 `member.md` §7은 "레거시 미통합 Company ID 계정은 일괄로 CLO-SET에 연동할 수 없다"는 전제로 쓰여 있다 — 마이그레이션이 이 전제와 정면 충돌하는지, 다른 방식(개별 처리 등)인지 확인 필요 | `docs/policy/member.md` §7 |
| D-14 | Checkout Step 2 케이스 갭 — 그릴 프레임 후보 선정 | 아직 WF가 없는 케이스들. **Team Add·Extend는 F-12로 완료됨 — 갭에서 제외.** 남은 갭 — **Individual 축**: 재구매(잔여 안내) · Trial 경유($0) · Student 유료($8.25). **Organization 축**: Convert(Single→Team 전환) — Purchase Type 표기 란과 Seat 컨트롤이 케이스마다 달라 별도 프레임이 필요할 수 있다. Josh가 어느 것을 실제로 그릴지 선정 필요 | F-11 Case Matrix(`7876:1479`) |
| D-16 | Student 4년 제한의 표현: 인증 만료인가 인증 승인일 기준 4년인가 | `plan.md` §3은 기산점을 `최초 학생 인증 승인일`로 못박았다. `mypage.md` §6-6은 `유효 기간: 인증 승인 시점으로부터 4년` + D-30 만료 임박 배너를 규정한다. 약관 문구 초안은 `plan.md`를 따라 `4 years from your first verification approval`로 썼다. 만료 모델로 가려면 `plan.md`를 고쳐야 한다 | `plan.md` §3 · `mypage.md` §6-6 |
| D-22 | 프로필 이미지 업로드 파일 크기 상한 | 값이 정책 문서·Figma 어디에도 없다. Arden 코멘트에 "기존 BE는 파일 크기만 검증"이라고만 있음. **BE 확인 필요.** 확정되면 F-20 노트 ④, 모달 문구, `error-copy.md` 세 곳의 `{maxFileSize}`를 함께 치환한다 | F-20(검토대기) 노트 ④ `5950:1794` · 모달 `6124:1863`, `6124:1925` · `error-copy.md` Account 탭 |
| D-23 | Preferred Language 모달 안내 문구 | 설정이 웹사이트 문구에만 적용되는지 이메일까지 포함하는지 근거가 없어 문구를 쓸 수 없다 | F-20(검토대기) 모달 `6124:1881` |
| D-24 | Student Benefit 카드 보조 문구 유지 여부 | T-02(Plan 페이지, 완료·아카이브) 08-20 4차 확정에서 남은 미결 P2. 단일 CTA 체제로 전환하며 Verification 상태 매트릭스는 폐기됐는데, Student Benefit 카드에 있던 보조 안내 문구(구 D-{NN})를 유지할지 판단 필요 | `plan-card.md` Student 카드 |

---

## 보류·이월 (Planner 관리)

| ID | Jira | 작업 | 사유 |
|---|---|---|---|
| T-03 | MDWEB-873 | 무료 체험 페이지 | 미착수. Individual 14일 Trial 결제 경로(구 G27)는 T-06(완료·아카이브)에서 상당 부분 해소됨 — Trial 계정당 평생 1회·즉시 유료전환 미지원·종료 후 첫 결제 실패는 Suspended 동일 적용·Student 인증과 간섭 없음이 `plan.md`에 반영됐다. **재개 시**: 남은 범위(G27 잔여 여부)를 다시 판단하고 Phase A(정책 목차 승인)부터 진행 |
| T-04 | MDWEB-871 · MDWEB-900 | 튜토리얼 페이지 + 교육기관 인증 프로그램 페이지 | 미착수. 튜토리얼(MDWEB-871)은 근거 문서 없음 — Research 선행 필요. 교육기관 인증(MDWEB-900)은 `docs/prd/solutions/academics.md`가 근거. **재개 시**: 병합 유지 여부부터 재확인(08-19 Josh 지시로 병합됐던 건) |
| — | — | MyPage — Benefit 기간 중 취소 예약 진입 수단 | D-15(Checkout 축, 해소·아카이브)에서 파생된 후속 확인. `mypage.md` §6은 Student Benefit 기간 중 `Pause for Now`·`Cancel Subscription` 버튼을 미노출로 규정하는데, 08-31 확정으로 취소 예약이 가능해졌다면 진입 수단이 있어야 한다. Checkout 범위 밖 — MyPage 작업 재개 시 다룰 것 |

---

## 참고 — 이 목록에 넣지 않는 것

| 대상 | 이유 |
|---|---|
| `PD \| / FE \| / BE \|` Jira 티켓 | 디자인·개발 축 |
| MDWEB-625 하위 Bug/유지보수 | `/slackrequest` 흐름 |
| 다국어 작업 (MDWEB-902 하위) | `/translate` 흐름 |

---

## 아카이브

**`requirements/board/TODO-archive-2026-09-01.md`** — 2026-09-01 정리 이전 전체 이력의 스냅샷. 다음이 전부 들어 있다:

- `T-01`(Checkout 정책 허브) 및 하위 `T-01-1`~`T-01-13` 전건 — 완료 이력·검수 기록
- `T-02`(Plan 페이지) 및 `T-02-1` — 완료 이력
- `T-06`(Trial·전환·자동갱신 등 엣지케이스 15건) — 완료 이력
- `F-01`~`F-20` 원본 전체(완료 처리된 F-02~F-18 포함) · Figma ID 중복(`F-12`) 발생 경위
- 결정 대기 D-1~D-23 원본 및 해소 이력(D-6, D-9, D-13, D-15, D-17~D-21 포함)
- 2026-08-11·08-13·08-23·08-24·08-25 확정 사항 표 전문
- MDWEB-870 진행 상태 로그, F-01 구 30프레임 표, Flow & Case 코드 명칭 대응표, 정의 소실 코드 27개 목록

### 2026-09-01 정리 — 완료 처리 근거

- **T-01-8** (Spec Doc 재작성 Figma 8장, 구 대기) → **완료 처리(흡수 종료).** 대상 노드(`7275:55` 등)는 Figma 조회로 실존하지 않음을 확인했다 — 2-step 전환 중 삭제됐고, 동일 역할을 F-11(Step 2 노출 매트릭스)·F-17(Case Matrix 통합)이 이미 대체했다.
- **T-01**(허브) → 하위 전건(T-01-1·3·4·5·6·8·9·10·11·13) 완료로 **완료 처리.** 남은 미결은 이번에 결정 대기 표로 이관한 D-1·D-5·D-7·D-8·D-10·D-11 등 6~7건 — 작업 행이 아니라 Josh 판단 대기 항목으로 성격이 바뀐 것.
- **T-02**(허브) → 하위 T-02-1 완료 + FAQ는 F-03(완료)로 별도 처리돼 **완료 처리.** 잔여 미결 2건 중 P1은 D-12로, P2는 신규 D-24로 결정 대기 표에 남겼다.
- **결정 대기 D-6**(Description 근거 줄) → **실제로 해소.** `planner-workflow.md` §4의 "- 근거: …" 예시가 2026-08-26 Josh 결정(근거 줄 쓰지 않음)과 충돌하는 스테일 규정이었다 — 이번에 규칙 파일을 고쳐 실제로 닫았다.
