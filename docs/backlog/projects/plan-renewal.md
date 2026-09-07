---
project: plan-renewal
updated: 2026-08-21
---

## 관련 Jira 티켓
- 없음 (Renewal 작업 — Jira 자동 생성 금지)
- 참고: MD-WEB-003 (Plan 페이지 기획), MDWEB-773 (Student Plan Renewal)

## TODO
1. **Trial 결제 경로 정의** — Trial 시작이 결제 페이지를 경유하는지, 결제수단 등록만 받는지 미정의 (`prd-draft.md` §14.1 · §24 G27). D1 확정으로도 해소 안 됨
2. **`solutions_enterprise_offline_contact_click` 이벤트명 개명 판단** — 구 플랜명(Offline) 기준. 개명 시 로깅 단절 위험이라 문서에 플래그만 표시해둠 (`docs/prd/solutions/enterprise.md:179`)
3. **wave 잔여 파일 D1 정합** — `policy-outline.md:34,80` (Trial·Auto Renew 맞물림 미해결 / Enterprise Linux 정의 없음) · `design-spec.md:83,368,376` (Seat 프리셋 미정의)
4. **`requirements/[MD-SITE]-checkout-redesign.md:129`** — `$1,500 × Copy 수` → Seat
5. **`requirements/content-strategy-gnb-features.md:236,238,264`** — `$1,500/Copy` 마케팅 카피 → Seat
6. **Plan Card 미결 4건** — `docs/policy/plan-card.md` 하단 표 참조. 특히 P1 2건 (Student Benefit 이용 중 버튼 상태 / Individual 카드 `Start Now`가 Trial 진입을 겸하는지)
7. **기능 비교표 — 행 설명 고정 vs open/close 결정** — Dane은 행 아코디언 과함 의견, Josh는 설명 필수 입장 (포괄적 타이틀이라). 디자이너·FE와 의논 예정. Dane에게 재고 의사 회신함 (8/5)
8. **기능 비교표 — Tech Support "Contact us vs Priority" 표현** (Hannah) — 지원 레벨 정의 존재 여부 확인 후 재표현. 스레드에 "In process"로 회신해둔 상태
9. **기능 비교표 Description 싱크** (v2 확정 시) — `6749:5020` ① 그룹명 인용을 "All plans have full access to every feature"로 교체 + ③ Feature Row Accordion 노트를 행 설명 결정에 맞춰 수정 — Josh가 "딱히 안 해도 됨"이라 했으므로 요청 시에만
> **작업 범위**: Renewal 문서 작업 대상은 `docs/policy/**` + Slack Canvas 두 곳이다. `docs/backlog/todo/MD-WEB-00X.md` · `requirements/[MD-SITE]-*.md` · `requirements/waves/**`는 구용어·폐기된 로직이 남아 있어도 renewal 산출물이 아니므로 정리 대상에 넣지 않는다.

## 컨텍스트

### 산출물
- **Slack Canvas** [[RENEWAL] Plan Renew](https://clo3d.slack.com/docs/T04BT3VBR/F0BCBS8G88N) `F0BCBS8G88N` — 기존 71개 섹션 전체 삭제 후 재작성. KR 본문 + EN 전문 (25.7KB)
- **레포** `requirements/[MD-SITE]-plan-renewal-changes.md` — KR 본문 + EN 전문 (2026-08-04 병기). Canvas와 동일 내용 + Appendix B "정책 파일 갱신 이력" 5건 (레포 경로 포함이라 Canvas에선 제외)

### 문서 구조 (KR·EN 동일, 레포·Canvas 동일)
```
독자·범위 → 1 변경 요약(5건) → 2 플랜 구매 자격 구조
→ 3 Individual  4 Student  5 Enterprise Single  6 Enterprise Team
→ 7 Enterprise Team Linux  8 Academics  9 Indie
→ Appendix A 용어 변경(10건)  Appendix B 범위 제외
```
- 플랜 섹션은 7개 전부 동일한 6항목 비교 표(`플랜명 / 가격 / 지불 방식 / 라이선스 유형 / 최대 Seat / 구매 자격`). 원문이 플랜마다 다른 축을 써서 뒤죽박죽했던 문제를 이걸로 해소
- Checkout·MyPage UI 스펙은 전부 제외 (Josh 지시)
- 원문의 문제 6가지: 취지(Why) 없음 / 계정 구조 개편 미반영 / UI 스펙 혼재 / 비교 축 불일치 / EN 섹션 깨짐(Individual 표 중복, Academic 누락) / 플랜 5개 vs 실제 7카드

### 확정된 정책 (누적)
| 항목 | 확정 내용 |
|---|---|
| Student 구매 제한 | **횟수 제한 폐지.** 최초 인증 시점부터 4년 이내 아무 때나 구매 가능 |
| Student Legacy 전환 | Legacy Annual 이용 **중에도** Monthly 전환 가능. 사용한 Annual 기간은 4년에서 차감 |
| Student 4년 기준 | 최초 **인증 시점** (첫 구독일 아님) |
| 기업용 Legacy 명칭 | `Network Online Monthly / Annual / Linux` → `Enterprise Single / Team / Team Linux` |
| Enterprise Team Linux | $2,300/연 · 연간 일시납 · Network Online (Prepaid) · **웹에서 직접 구매 가능** |
| Organization vs Owner | Organization = 조직(인증 주체), Organization Owner = 생성한 사람(구매 주체). 별개 |
| 결제 수단 | Stripe · PayPal만 유지. 국가별 분기는 이번 범위 제외 |
| **Trial 모델 (D1, 8/4)** | Trial 진입 시 Monthly·Annual 중 선택 → 14일 무료 → 선택한 플랜으로 자동 결제. Trial 없이 바로 구매하는 경로도 병존 |
| Legacy Trial 종료 후 | 자동 Subscription 시작 (원래부터 그랬음 — 신규 변경 아님) |
| Legacy Annual Trial | 있었으나 2024-04-04 폐지. 이후 월간 전용 |
| Academic Seat 선택 | 프리셋 탭. 스테퍼·슬라이더·실시간 계산기 금지 |

### 대외 노출 금지
- **Network Offline** — 별도 제품, 웹 미판매, 가격 미정 TBA. **비밀**. 문서·Canvas 어디에도 언급하지 않음 (Appendix B "범위 제외"에도 넣지 않음)

### 2026-07-30 세션에 정리한 정책 파일
| 파일 | 변경 |
|---|---|
| `docs/policy/plan.md` | Student 이용 기간 → "최초 학생 인증 승인일 기준 4년, 구매 횟수 제한 없음" |
| `docs/policy/checkout.md` | 진입 차단 조건 "Student 누적 구매 2회 초과" → "Student 인증 시점 4년 경과" |
| `.claude/rules/solutions-copy.md` | CS 리스크 1순위 고지 "최대 2년(2회) 구매 제한" → "최초 인증 시점부터 4년 이내, 횟수 제한 없음" |
| `docs/backlog/todo/MD-WEB-003.md` | Figma diff 표·카드 고지·미결 J 항목에서 2회 제한 제거 |
| `docs/backlog/todo/MD-WEB-002.md` | Checkout 체크리스트·에러 문구·E2 케이스·정책 참고 4곳 갱신 |
| `requirements/[MD-SITE]-checkout-redesign.md` | 진입 차단 요구사항·E1 플로우 갱신 |
| `docs/backlog/projects/student-plan-renew.md` | 2회 카운팅 관련 미결 항목 해소 처리 |

### 연계 프로젝트
- **`checkout-renewal`** — Checkout 기획 착수 전 결정 3건(결제 수단 지역 분기 / Trial 진입 경로 / Student Benefit 버튼)을 이월했다. Checkout WF가 참조할 정책 기준도 그 파일 컨텍스트에 정리해둠
- **`account-structure`** — 계정 구조 개편 원본. `member.md` 용어 기준이 여기서 나온다
- **`mypage-renewal`** — MyPage 탭 명칭 `Invited Projects` 확정 근거가 이 파일에 있음

### 블로커·주의
- Canvas 하단에 옛 표 셀 214개가 낱개 문단으로 남는 사고가 있었음 (원인: 표 섹션 delete 시 셀이 남음). 전부 삭제 완료. **다음에 Canvas 표를 지울 때는 삭제 후 `slack_read_file`로 잔존 확인 필수**
- Canvas 표에서 헤더 첫 칸이 `#`이면 빈 칸으로 렌더링됨. `구분` / `No.` 같은 단어를 쓸 것
- `slack_read_canvas`는 출력이 커서 파일로 떨어진다. `python3`으로 `section_id_mapping`만 슬라이싱해 읽을 것
- **Canvas section ID는 update 한 번마다 바뀐다.** 수정 직전에 반드시 `slack_read_canvas` 재호출로 ID를 다시 받을 것
- 문서 안에 있는 "업데이트 필요사항" 류 마이그레이션 표를 실행 기준으로 쓸 때, **그 표의 용어가 현재 확정 용어인지 먼저 대조**할 것 (mypage.md §11이 금지어 `Group`을 쓰고 있었음)

## 완료 로그

### 2026-08-21 — Plan 카드 Description 작성 (`6655:5885`, 파일 `PeCid7uJcg0HenViaaiHUp` Plan 화면)

- Slack Canvas `F0BR8CNUHKM`("[Renewal]Plan page button text & flow", 2026-08-20 확정)를 근거로 빈 템플릿 노트 4개를 채팅 초안 → Josh 교정 2회 → 승인 순서로 작성. Plan Mode로 진행(승인 계획 `~/.claude/plans/quiet-marinating-pillow.md`)
- **① Plan Card** — 상태·라이선스 보유·계정 상태 무관 단일 CTA 원칙, Verification 판정은 Backend 처리(카드에서 체크 안 함)
- **② Primary CTA 버튼** — 문구 규칙 `Start {cardTitle}` 확정. 클릭 후 4축 분기(로그인 → Organization → 인증 → 라이선스 판정)를 케이스 분기로 정리. `*(정책 확인 필요 — Company ID 계정이 Member+Organization 구조로 마이그레이션된 이후 이 분기 적용 여부, 시점 미확정)*` 플래그
- **③ 카드별 CTA 매핑** — 카드 7개(Individual/Student/Enterprise Single·Team·Team Linux/Academics/Indie) 개별 클릭 조건. 조건 체인이 같은 카드는 "~참조"로 처리해 2단 중첩 제한 준수
- **4번째 빈 노트 삭제** — 원래 있던 "Secondary CTA(Contact Sales)" 노트를 통째로 제거. Josh 교정: Indie도 Secondary CTA 없음 → Secondary 관련 내용 전면 삭제로 최종 3노트 확정
- **SW Account는 Organization 계열(Enterprise/Academics/Indie) 전용 — Individual/Student는 본인 계정이 라이선스 소유자**라는 교정 반영 (`[[project_sw_account_scope]]` 메모로 등록, 향후 세션에서 재발 방지)
- screenshot 검증 완료 (`noteCount: 3`, gap·클리핑 이상 없음)

### 2026-08-07 (docs/policy 전면 감사 + 3개 Slack Canvas 기준 리뉴얼)

- **발단**: Plan 페이지 FAQ 초안 작성 중 결제수단 답변이 하루 전 상태(TODO #1 "미정")로 멈춰 있었던 게 발견됨 — `plan.md` §4-7은 이미 2026-08-05에 China→AliPay로 확정된 상태였는데 백로그 TODO가 반영을 못 따라감
- **감사 방식**: 리서치 에이전트 6개 병렬 — (1) `docs/policy/**` 내부 충돌·중복·잔존 TODO 감사 3건, (2) 3개 Slack Canvas(Plan Renew `F0BCBS8G88N` 8/4 · Order/Checkout `F0BL0SRE4TZ` 8/6 · Account Structure `F0BBYNQ3S8P` 6/23) 대 `docs/policy` 대조 3건
- **스코프 오염 제거**: `docs/policy/README.md`(1057줄, OPINION 서베이앱 정책) · `.claude/rules/monetization.md`(동일 프로젝트 잔재) 삭제 — 이 레포와 무관
- **`plan.md` 수정**: §4-6 Coupon 적용범위 "Annual 전체"→"Individual Annual 최초구매만"(checkout.md·canvas와 일치) · Student 4년 카운터 기준을 "인증 승인일"로 통일(Legacy 예외였던 "첫 결제일 기준" 삭제) · Legacy Annual 활성구독자 서술에서 "잔여기간 차감" 뉘앙스 제거, 4년-인증일 원칙 하나로 재정리 · Enterprise Team Userpool 섹션 신설 · Academic Team Console 문구 추가 · Indie "직전 사이클" 한정어 추가 · §4-7 AliPay 판정 조건을 "주소 입력 전에만 IP 판정"에서 canvas의 상시 OR 로직(IP 또는 청구지 국가 중 하나라도 중국)으로 정정
- **`member.md` 수정**: §7의 "CompanyID"/"MemberType"이 오류가 아니라 실존하는 **레거시 미통합 Company ID 계정**을 가리키는 것으로 확인(Josh 컨펌) — 폐지된 프론트엔드 MemberType 분류와 구분해 명시. §3-4 Userpool 정책(Legacy Enterprise Monthly→Single 1개 제한 vs Renewal 무제한) 신규 추가. §2에 Legacy ID/PW 로그인이 레거시 미통합 Company ID 계정에 한정된다는 내용 추가
- **`auth.md` 수정**: "Legacy 계정 모두 허용" 서술을 "레거시 미통합 Company ID 계정에 한정"으로 좁혀 member.md와 정합
- **`checkout.md` 수정**: §8.4 우편번호 없는 국가 행을 "형식만 검증"에서 "형식 검증 미수행"으로 정정(canvas 기준) · §3 AliPay 조건 footnote를 상시 OR 로직으로 정정(plan.md와 동일 수정)
- **Plan Renew Canvas `F0BCBS8G88N` 수정 (KR·EN 양쪽)**:
  - Appendix B 결제수단 항목 — "AliPay·Kakao Pay는 이번 범위에서 제외합니다"(8/4 기준, 이후 뒤집힘) → "이 문서에서 다루지 않습니다. Order·Checkout 문서에서 확정했습니다 (2026-08-06). 접속 IP 또는 청구지 국가가 중국인 경우 카드·AliPay, 그 외 국가는 카드·PayPal." **"범위 제외" 헤딩은 유지하되 확정 내용과 출처를 함께 적어, 이 canvas만 읽고 옛 결론을 내리는 것을 방지**
  - §4 Student — "이미 사용한 Annual 기간은 4년에서 차감합니다" 문장 삭제. 차감 로직이 아니라 **최초 인증일 기준 4년** 단일 원칙이 맞다는 Josh 확인 반영 (바로 위 불릿에 이미 4년 규칙이 있어 중복 제거 효과도 있음)
- **작업 범위 확정 (Josh)**: Renewal 문서 대상은 `docs/policy/**` + Slack Canvas 두 곳뿐. 감사 과정에서 `MD-WEB-003.md`·`checkout-redesign.md`·`mypage-redesign.md`·`PACKET-pm.md` 등에서도 구용어·폐기 로직이 다수 발견됐으나, renewal 산출물이 아니므로 정리하지 않는다
- 전체 계획: `~/.claude/plans/eager-greeting-meteor.md`

### 2026-08-05 (Plan 기능 비교표 — Slack 피드백 반영 + Figma 적용, 파일 `PeCid7uJcg0HenViaaiHUp` Plan (In progress🔥))

- **Slack 스레드 피드백 트리아지** (`cell_mdweb` p1785399993375839) — 리뷰어 5명 피드백을 수용/미수용으로 판정하고 피드백 단위 불릿으로 회신 (Josh 직접 전송)
  - 수용: 차별 구간 최상단 이동 + core features 그룹 최하단·접힘(Hannah/Dane/Layla) · 기능명 재편 2D Pattern~AI Features(Julia) · "Per Purchased Seat"(Dane)
  - 반려(사유 회신): Jacob의 Enterprise (Team) 괄호 표기 — 동시 접속·시트 관리 등 핵심 정책이 플랜별로 달라 컬럼 분리 유지
- **Dane 2차 피드백 v2 프레임(`6873:2144`) 적용** — ① 그룹 타이틀 "All plans have full access to every feature"로 교체 ② 행 chevron 8개 제거(설명 항상 노출) ③ "Avartar"→"Avatar" 오타 수정
  - 단, 행 아코디언 제거는 Josh가 재고 의사 — 설명 필수 입장, 고정 vs open/close는 디자이너·FE 의논 (Dane에게 회신 완료)
- **차별 구간 표(`6749:4183`) Title Case 전수 정리** — 텍스트 78개 감사 → 21개 수정 (Maximum Concurrent Users, Per Purchased Seat ×4, Member Management 등 19건 Title Case + "Contact Us"→"Contact us" 2건). 예외 유지: or/and/for 단어, Alipay 완전 문장
- **기능 비교표 Description 삽입** (`6749:5020`, 8/4) — 4개 노트: ① Feature Group Accordion(케이스 분기: core features만 Default 접힘) ② Feature Comparison Table(셀 표기 3종 + Alipay 병합) ③ Feature Row Accordion ④ Contact Biz Button(→ Organization Trial Application 폼)
- **Academic Verification 국가 노트 확장** (`6545:14`, 8/4) — ③→3-1 국가 드롭다운(케이스 분기: 미국→면세 필드 노출) + 3-2 면세 증빙 서류 신규(`6819:164`, 미국 한정·필수 입력·최대 15MB·JPG/JPEG/PNG/GIF/PDF). 배지 hug 전환으로 서브 넘버 표시

### 2026-08-04
**Trial 정책 D1 확정 + 미결 해소 + 용어·명칭 전수 정리** (계획서: `~/.claude/plans/q1-drifting-pascal.md`)

확정 (Josh):
- **D1 Trial 모델** — Trial 진입 시 Monthly·Annual 중 선택 → 14일 무료 → 선택한 플랜으로 자동 결제. Trial 없이 바로 구매하는 경로도 병존. 기존 "Monthly·Annual 양쪽에 적용" 표현은 Annual에 별도 Trial 상품이 붙는 것처럼 읽혀 폐기
- **EN 병기** — 레포 문서 같은 파일 하단에 EN 전문 (Canvas와 동일 구조)
- **§1 취지** — "왜 바꾸는가"는 문서에 넣지 않음 (8/3 결정 유지)

미결 해소 — 근거 확보:
- **Legacy Trial 종료 후 = 자동 Subscription 시작** (KR 표가 정답, EN "Manual subscription required"는 오류). 근거: Emma Chang #cell_mdweb 2023-11-21 정책 결정 / Eugene Rastokin 2026-06-29 "no longer a Plan Type = Trial, users receive a paid-type license from the very beginning"
- **Legacy Annual Trial은 있었으나 2024-04-04 폐지.** 근거: Klay Kim 2024-02-21 / Dahye Jang 2024-04-09 "4/4일부터 trial page에 월간라이선스용 trial만 남겨두게 되면서". "기록 없음"이 아니라 "있었고 없앴다"가 정확

수정 파일 (11개 + Canvas):
| 대상 | 내용 |
|---|---|
| `requirements/[MD-SITE]-plan-renewal-changes.md` | Trial 서술 D1 교체 · 미결 3건 삭제 · Appendix B를 "갱신 이력"으로 · EN 전문 약 250줄 추가 |
| Canvas `F0BCBS8G88N` | KR·EN §3 Trial + Legacy와의 차이, §8 프리셋 탭. 미결 섹션 4개 delete. 잔존 셀 없음 확인 |
| `docs/policy/plan.md` | Offline 행 → Enterprise Team Linux $2,300 교체 · Copy→Seat · Trial D1 · **Individual Annual Prepaid→Subscription 정정** · **Network Offline 용어 행 삭제(대외 비밀)** |
| `docs/policy/checkout.md` | Student Annual $99 → Student Monthly $8.25 · Academic Copy→Seat |
| `docs/backlog/todo/MD-WEB-003.md` | Team Linux $2,300/Seat/yr + 웹 구매 가능 (Contact Sales는 보조 CTA) · Academic Seat + 프리셋 탭 · Trial D1 |
| `docs/backlog/todo/MD-WEB-002.md` | Copy→Seat · E11 Offline→Team Linux |
| `.claude/rules/solutions-copy.md` | Trial 문구 2곳 · Academic $1,500/Seat + 프리셋 탭 |
| `docs/prd/solutions/` 4개 | students(횟수 제한 제거) · individual(Trial D1) · academics(Copy→Seat, 계산기 개념 폐기) · enterprise(구 명칭→신 명칭, Copy→Seat) |
| `requirements/waves/active/prd-draft.md` | 251행 Annual도 Trial 진입 가능 · §14.1 두 경로 |

검증: Copy 단위 / 기업 구 명칭 / Network Offline / Student Annual $99 / 미결 플래그 / Contact Sales 전용 — **전부 잔존 0건**

추가 작업 — Canvas 링크 + 정책 파일 용어 정합 (Checkout 기획 대비):
- **Canvas 링크 7개 파일에 삽입** — Renewal Canvas 4종(Plan Renew `F0BCBS8G88N` / Order·Checkout `F0BL0SRE4TZ` / Account Structure `F0BBYNQ3S8P` / Student Plan Renew `F0B4B5D86J1`). 기준 문서 KR·EN에 「관련 Slack Canvas」표 추가, 나머지는 헤더에 링크
- **`docs/policy/plan.md` 계정 용어 정합** — Academic·Indie 구매 자격 `CompanyID` → `Organization`(인증 주체) + Organization Owner(구매 주체) 구분 명시 · Indie 최대 5개 → `5 Seat` · `License ID` → `SW Account` · Indie 참조 플랜 `Enterprise Network Online Annual` → `Enterprise Team`
- **`docs/policy/plan.md` §4-7 결제 수단** — 삭제하지 않고 "Legacy 현행 / Renewal 범위" 2단으로 분리. 현행에 한국 Kakao Pay 누락돼 있던 것 보강. Renewal 처리 방향은 미결로 명시
- **`docs/policy/member.md`** — `Group` → `Organization` 전면 교체 (§3 정책 · §4 인증 레이어 · §5-3 객체). §3 상단에 "내부 기획 용어 Group 사용 금지" 규칙 명시. `groupID` 필드명은 구현 필드일 수 있어 유지하고 개발 확인 플래그만 부착
- **`docs/policy/mypage.md`** — 계정 구조 개편 전환 집행. §1 계정 유형 정의 재작성 · §3 탭 매트릭스 6컬럼 → 2컬럼(인증별 결과 동일해 병합) · §4·§5·§6·§7·§9 신 구조 용어 · **SW Account 컬럼/행 전면 제거**(Web 로그인 불가 → MyPage 미도달) · §11 "업데이트 필요사항" 섹션 삭제(집행 완료)
- **`docs/policy/plan-card.md`** — 카드 5종 재작성. 계정 유형 신 구조 6값 · **전 카드 `License ID` 행 삭제**(Plan 페이지 미도달) · 카드명 `ENTERPRISE (Online / Linux)` → `(Single / Team / Team Linux)` · "업데이트 필요사항" → 실제 미결 4건으로 교체 · 삭제 이력 기록
- **`docs/policy/auth.md`** — `MemberType (DB 내부)` 행은 구현 필드일 수 있어 유지, 개발 확인 플래그 부착
- **MyPage 탭 명칭 통일** — `Shared License` → **`Invited Projects`** (Josh 확정). `mypage.md` §2·§4·§7, `requirements/[MD-SITE]-mypage-redesign.md` 전체 반영. 라우트 `/mypage/shared-license`는 유지하고 개발 확인 플래그만 부착
- **`docs/policy/checkout.md`** — Order Summary `단가/시트 수` → `Seat` · `결제 주기` → `지불 방식`(plan.md §4-1 금지 용어) · 소계 표 `CompanyID` 1행 → Enterprise Single/Team/Team Linux 3행 분리 · sessionStorage 키 설명 `License ID` → `SW Account`

### 2026-08-03
- 레포 문서 §1을 "개편 취지"(왜 바꾸는가) → "변경 요약"(무엇이 바뀌는가)으로 교체. 근거 없는 4개 축 서술·축 3 근거 문단·`*(취지 문구 확인 필요)*` 플래그 삭제
- Slack Canvas `F0BCBS8G88N` §1도 KR·EN 동일하게 교체 (제목·도입부·표 replace + 축 3 근거 섹션 delete). 잔존 셀 없음 확인

### 2026-07-30
- Slack Canvas `F0BCBS8G88N` 전체 재작성 — 기존 71개 섹션 삭제 후 KR 본문 9섹션 + Appendix A·B 삽입
- `requirements/[MD-SITE]-plan-renewal-changes.md` 신규 작성 (KR)
- Student 정책 3줄로 압축 (인증 시점부터 4년 내 아무 때나 / Legacy Annual 중 전환 가능 / 3개월 무료). 부수 정책·미결 5건 제거
- Student "2회 구매 제한" 관련 서술을 정책·룰·티켓 파일 7개에서 전면 제거
- 기업용 Legacy 명칭을 `Network Online *` 기준으로 3곳 통일 (취지 축 1, 섹션 5·6·7 표, Appendix A)
- Enterprise Team Linux 확정 — $2,300/연 · 연간 일시납 · Network Online (Prepaid) · 웹 구매 가능
- Organization / Organization Owner 구분을 Appendix A와 본문에 반영
- Network Offline 관련 서술 전부 삭제 (대외 비밀)
- `CompanyID` → `Company ID` 표기 통일 (Canvas·레포 양쪽 0건 잔존)
- Canvas 하단 잔존 표 셀 214개 삭제
- 영문 전문 작성 후 Canvas 하단에 삽입 (KR과 섹션·표 1:1 대응)
