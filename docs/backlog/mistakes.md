# Mistakes Log

---

## 2026-07-14

**상황:** Figma Description 삽입을 위해 md-figma 서브에이전트에 위임 후, Figma MCP OAuth 인증을 서브에이전트가 진행
**실수:** 인증이 4회 반복 실패. 서브에이전트가 재개될 때마다 `authenticate`를 다시 호출해 이전 `code_verifier`를 덮어쓰거나, 재호출을 안 해도 `No OAuth flow in progress` 반환. Josh에게 콜백 URL을 3번이나 다시 요청하게 만듦
**원인:** 서브에이전트는 응답 종료 후 SendMessage로 재개될 때마다 transcript 기반 새 프로세스로 뜸 → `authenticate`가 메모리에 저장한 PKCE 상태(code_verifier)가 `complete_authentication` 시점에 유실. OAuth는 authenticate→complete가 같은 살아있는 프로세스 안에서 짝맞춰져야 함
**다음엔:** MCP OAuth 인증은 항상 **메인 세션에서 직접** 수행한다 (authenticate→complete 사이에 프로세스가 안 죽음). 서브에이전트에 인증이 필요한 MCP 작업을 위임할 때는, 위임 전에 메인 세션에서 인증을 먼저 끝내 `use_figma` 등 실제 도구가 뜬 것을 확인한 뒤 위임한다. 인증 반복 실패 시 즉시 원인 진단 — 콜백 URL 재요청 반복 금지

## 2026-06-24

**상황:** Slack Canvas 계정 유형 표를 `slack_update_canvas` `replace` 액션으로 교체
**실수:** `replace` + `section_id` 는 기존 섹션을 실제로 교체하지 않고, 새 섹션을 삽입한 뒤 원본 섹션을 빈 `||` 플레이스홀더로 남김. 이를 지우려고 빈 텍스트로 replace했더니 방금 삽입한 테이블까지 사라짐
**원인:** Slack Canvas `replace` API 동작을 "in-place 교체"로 잘못 가정. 실제로는 "새 블록 삽입 + 원본 무효화" 구조
**다음엔:** Slack Canvas 표를 변경할 때는 기존 섹션 내용을 원하는 최종 값으로 replace 1회만 실행한다. 이후 빈 플레이스홀더가 남으면 수동 삭제 안내만 제공 — 추가 replace 시도 금지

---

## 2026-06-23

**상황:** Slack 캔버스 polishing 방향 제안
**실수:** "어떻게 하면 독자가 편할지"를 물었는데 말투 통일·오탈자 수준의 에디터 관점 리스트를 먼저 제시함
**원인:** 독자 경험이 아닌 문서 일관성 검토 모드로 접근. 실제 독자가 캔버스를 열었을 때의 흐름(스캔, 신뢰, 빠른 파악)을 먼저 상상하지 않음
**다음엔:** 문서 피드백 요청 시 "이 문서를 처음 여는 사람이 30초 안에 무엇을 얻어야 하는가"를 먼저 정의하고 그 관점에서 문제를 찾는다. 기술적 수정은 그 다음

---

## 2026-06-22

**상황:** Indie Verification 폼 "회사소개서 또는 포트폴리오" 필드 Description 작성
**실수:** 상태를 `Default/Filled/Error 상태`로 한 줄 압축 요약 → 사용자 "성의 없어진 느낌" 피드백 후 재작성
**원인:** "한 칸에 다 들어가야 한다"는 공간 제약에 집중하다 실제 placeholder 텍스트, 에러 메시지 원문, 성공/실패 분기를 생략함
**다음엔:** 공간이 길어져도 각 상태에 실제 표시 문자열(따옴표 포함)과 트리거별 성공/실패 서브불릿 전부 작성. 압축하려면 내용이 아니라 표현 방식을 줄인다

---

## 2026-06-22 (Flowchart Tool)

**상황:** FlowchartCanvas.tsx 드래그 미리보기 선 렌더링
**실수:** `DragState` 인터페이스는 `mouseX`/`mouseY`인데, 드래그 preview line 코드에서 `const { x: mx, y: my } = dragState`로 destructuring → TypeScript 오류
**원인:** 인터페이스 필드명을 확인하지 않고 `x`/`y`로 가정
**다음엔:** drag 관련 state 필드는 항상 `mouseX`/`mouseY` 패턴 사용. 짧게 쓰려면 `dragState.mouseX`로 직접 접근

---

**상황:** hover 어포던스 (＋버튼, 연결 포인트 ●) 구현
**실수:** `onMouseLeave`를 노드의 작은 hit rect (`node + 4px`)에 달았더니 마우스가 ●이나 ＋로 이동하는 순간 hover가 꺼짐 → 드래그 연결도 불가
**원인:** SVG에서 `mouseleave`는 같은 `<g>`의 형제 이동 시 발동하지 않는다는 특성을 활용하지 않고, 개별 rect에 달았음
**다음엔:** 노드 + 어포던스 전체를 하나의 `<g onMouseEnter/Leave>`로 감싸고, 내부에 어포던스까지 커버하는 큰 투명 rect를 background로 추가. 이 패턴이 SVG hover zone 확장의 표준

---

## 2026-06-22

**상황:** Jira 티켓 description 초안 작성 (MDWEB-832, 833)
**실수:** 현상·기대결과·슬랙 링크만 있으면 되는 간단한 티켓에 Tasks 섹션·개선 방향·원인 추정까지 거창하게 작성 → 사용자 "졸라 거창하게 썼네" 피드백 후 전면 재작성
**원인:** Maintenance 티켓도 PRD 수준의 description이 필요하다고 가정
**다음엔:** 유저 피드백 기반 버그/개선 티켓은 슬랙 링크 + 현상 + 기대 결과 3가지만. Tasks·기술 분석은 별도 요청이 있을 때만 추가

---

## 2026-06-18 (2차)

**상황:** Brand Comm 브리핑용 Background 단락 작성
**실수:** 두 번의 시도 모두 사용자가 "별로임 그냥 챗지피티랑 썼음"으로 평가 → 내가 쓴 것보다 ChatGPT로 쓴 문서가 더 나았음
**원인:** 랜딩 관련 내용에만 집중해달라는 요청에도 결제 시스템 내용을 혼입시켰고, 문장 자체가 AI 냄새 나는 corporate 문체
**다음엔:** Brand Comm 문서 작성 시 사용자가 공유한 renewal document 스타일을 먼저 분석 — 선언 없이 사실 나열, 헤지드 랭귀지, 결론보다 관찰. 그 스타일을 모방해서 쓰기

---

**상황:** Figma Slides 파일(1zCBixRUiKPe1nFLUDCT2j) 내용 읽기
**실수:** `get_metadata`를 Slides 파일에 호출 → "This tool is not supported for Slides files" 에러
**원인:** get_metadata는 design 파일(`/design/`)만 지원. Slides(`/slides/`) 미지원
**다음엔:** Slides 파일은 `use_figma` + `getSlideGrid()` 또는 `get_screenshot`으로 접근. `get_metadata` 호출 전 URL path 확인

---

## 2026-06-18

**상황:** Description List 기존 카드 제거 후 새 카드 삽입
**실수:** `[...descList.children].forEach(child => child.remove())`로 제거했는데 `4614:6075` 카드가 남아 있었음 → descList 높이 5388px 원인
**원인:** 첫 번째 use_figma 호출에서 제거 후 append했지만 두 번째 호출 시 해당 노드가 남아 있었음. 제거 성공 여부를 검증하지 않고 바로 다음 단계로 진행
**다음엔:** 기존 카드 제거 직후 `descList.children.length`를 return해서 0인지 확인. 검증 없이 새 카드 append 금지

---

**상황:** makeCard 함수 내 card.layoutSizingHorizontal = 'FILL' 설정
**실수:** descList.appendChild(card) 이전에 FILL 설정 → "FILL can only be set on children of auto-layout frames" 에러
**원인:** makeCard 함수 내부에서 card를 만들면서 바로 FILL 설정. 부모에 append되기 전 상태
**다음엔:** FILL 설정은 반드시 makeCard() 반환 후 descList.appendChild(card) 직후에 설정. 함수 내부에서 FILL 금지

---

## 2026-06-17

**상황:** annotation box clone 후 제목 텍스트 수정
**실수:** `loadFontAsync`에 Regular + Medium만 로드하고 SemiBold 누락 → clone된 박스의 HR 텍스트 노드가 SemiBold여서 characters 설정 시 에러
**원인:** clone한 source 노드에 어떤 폰트 스타일이 들어있는지 미리 확인하지 않음
**다음엔:** annotation box clone 전 `getStyledTextSegments(['fontName'])`으로 사용된 스타일 확인 후 loadFontAsync 목록 확정

---

## 2026-06-09

**상황:** Checkout CASE VIEW 3개 프레임 생성 — 처음 시도에서 DS spec 기본값으로 그림
**실수:** Card1_CaseView를 DS spec 기준(58px label, 14px label font, 16px OS padding)으로 생성 → 사용자 "실제 structure에서의 것과 좀 다르다 component들이?" 지적
**원인:** 참조 프레임(FEATURE Annual 1)을 먼저 측정하지 않고 figma-wireframe-ds.md 기본값으로 바로 그림. 실제 프레임은 DS spec과 다른 값 다수 (80px label, 12px section label, 263×69 toggle card 등)
**다음엔:** Checkout WF 작업 시 반드시 Annual 1 (`6000:44`) 또는 해당 FEATURE 프레임을 먼저 측정. figma-wireframe-protocol.md 0단계 체크리스트 준수 — 참조 없이 그리기 금지

---

**상황:** Card1_CaseView billingToggle() 함수에서 FILL 설정
**실수:** `sec.layoutSizingHorizontal = 'FILL'`을 `parent.appendChild(sec)` 이전에 호출 → "FILL can only be set on children of auto-layout frames" 에러
**원인:** append 전 FILL 설정 시도. 같은 실수가 `dropdown()` 함수에서도 반복 발생
**다음엔:** FILL 설정은 반드시 appendChild() 이후. 새 함수 작성 시 "append → FILL" 순서 의식적으로 확인

---

**상황:** Card1_CaseView 두 번째 use_figma 스크립트에서 상수 참조
**실수:** 첫 번째 스크립트에서 정의한 `const BADGE_X = FORM_X`를 두 번째 스크립트에서 그대로 사용 → "ReferenceError: BADGE_X is not defined"
**원인:** use_figma 호출은 각각 독립 스코프. 이전 스크립트의 변수는 다음 스크립트에서 참조 불가
**다음엔:** 각 use_figma 스크립트는 완전히 독립적으로 작성. 이전 스크립트의 상수/함수는 매번 재선언

---

**상황:** Jira 티켓 생성 — Maintenance 하위 이메일 수정 티켓
**실수:** "Admin 프로젝트"를 찾다가 MW 프로젝트의 MW-654로 잘못 생성 (MW-810). MDWEB-625가 정답이었음
**원인:** cloudId 조회 없이 "marvelousdesigner.atlassian.net" 하드코딩 시도 → 실패 후 "Admin" 키워드로 프로젝트 검색하며 MW-654 발견 → 사용자가 "MDWEB 625 아니고?" 수정 요청
**다음엔:** Jira 티켓 생성 요청 시 프로젝트 키를 먼저 확인. "Admin임"이라는 힌트가 있어도 cloudId 조회 후 MDWEB 프로젝트인지 MW 프로젝트인지 구분해서 생성

---

**상황:** Jira 이슈 타입 선택 — MDWEB-819 생성
**실수:** Sub-Task(MD)로 생성 → 사용자 "Subtask면 안돼 improvement로 넣었어야지" 지적
**원인:** Maintenance 에픽 하위 직속 티켓임에도 Sub-Task(MD) (level -1) 선택. MDWEB 프로젝트 구조상 에픽 바로 하위는 level 0 타입(Improvement(MD), Task(MD) 등)이어야 함
**다음엔:** 에픽 직속 하위 티켓은 Improvement(MD) / Task(MD) / Bug(MD) 등 level 0 타입 사용. Sub-Task(MD)는 level 0 티켓의 하위에만 사용

---

## 2026-06-09

**상황:** Sign In WF description 패널 내 화면 간 크로스레퍼런스 표기
**실수:** description 본문에서 다른 화면을 "WF-01", "WF-03 (비밀번호 찾기)으로 이동" 형태로 표기 → 사용자 "WF- 이런식으로 하지마 누가 알아 진짜" 지적
**원인:** 작업 중 내부 구분자로 쓰던 WF-XX 표기를 그대로 사용자 노출 텍스트에 그대로 넣음
**다음엔:** description 텍스트에서 화면 참조는 반드시 화면명으로 — "Sign In 화면으로 이동", "비밀번호 찾기 화면으로 이동", "변경 완료 화면으로 이동". WF-XX, Frame-XX 같은 내부 구분자는 description에 절대 노출 금지

---

**상황:** Sign In WF-02 description 작성
**실수:** 외부 프레임 이름("SIGN IN — ERROR")을 보고 description을 "Error (인증 실패)" 상태로 작성 — 실제 화면은 ID/PW 입력 폼(정상 상태)이었음
**원인:** Board Header sub label("SIGN IN — ID/PW FORM")을 확인하지 않고 외부 프레임명만 보고 판단
**다음엔:** description 작성 전 반드시 Board Header texts[2] (sub label) 확인. 프레임명과 실제 화면 상태가 다를 수 있음 — sub label이 실제 상태의 source of truth

---

**상황:** Account FEATURE 섹션 작업 시작 직후 첫 번째 `setCurrentPageAsync` 호출
**실수:** `figma.root.children.find(p => p.name === 'MyPage')` — 공백 없는 이름으로 조회해 `undefined` 반환, `setCurrentPageAsync` 에러 발생
**원인:** 이전 세션 요약에서 "My Page" 페이지를 코드로 쓸 때 공백을 생략. 직전 세션에서도 같은 페이지명을 사용했지만 summary에서 정확한 이름이 소실됨
**다음엔:** 페이지 이름이 불확실하면 먼저 `figma.root.children.map(p => p.name)` 조회 스크립트를 실행해 실제 이름 확인 후 사용. "My Page" (공백 있음) — 이 파일의 페이지명 고정값으로 기억

---

## 2026-06-08

**상황:** CaseView Description 제목 텍스트에 Unicode 원문자 사용
**실수:** DangerZone Description 제목 노드에 ④처럼 Unicode 원문자를 그대로 입력 — 사용자 "④ <- 이거 절대로 쓰면 안 됨" 지적
**원인:** `figma-description.md`의 `**① [요소명]**` 형식을 Figma 텍스트 노드에도 그대로 적용. Description Title의 Annotation Badge가 시각적 번호를 담당하는데, 텍스트 노드에도 원문자를 넣어 이중 표시함
**다음엔:** Description Title 텍스트 노드에는 요소명만 (`Member Type`, `Email` 등). 번호는 Annotation Badge(원형 프레임+숫자TEXT)가 담당. 원문자 ①②③④⑤는 Figma 텍스트 노드에서 절대 사용 금지

---

**상황:** DangerZone CaseView Case 2 (Company ID) 계정 삭제 경로 작성
**실수:** Company ID 계정 삭제 시 "License Admin 이동" 버튼을 CaseView에 추가 — 실제로는 Contact Us 경로만 존재
**원인:** 정책서를 재확인하지 않고 "계정 관리자 화면에서 삭제 가능할 것"이라고 추측
**다음엔:** 계정 삭제·탈퇴 관련 플로우 작업 전 `docs/policy/mypage.md` Danger Zone 섹션 반드시 먼저 읽기. 삭제 경로는 MemberType별로 다름 — 추측 금지

---

## 2026-06-08

**상황:** Account WF clone 후 Description 작성
**실수:** clone된 10개 WF의 Description이 모두 동일한 Individual 내용 — "Description이 모두 똑같군 왜 그러지" 사용자 지적
**원인:** clone()은 모든 내용을 그대로 복사함. WF마다 policy 기반으로 내용을 다르게 써야 한다는 것을 clone 작업과 분리해서 생각하지 않음
**다음엔:** WF clone 계획 수립 시 Description 업데이트를 별도 스텝으로 명시. clone 후 즉시 정책 파일 읽고 계정 유형별 내용 차별화 작업을 이어서 실행

---

**상황:** Account WF TC 텍스트 수정 중 폰트 에러 발생
**실수:** `Cannot write to node with unloaded font "Poppins Medium"` — Poppins Semi Bold, Regular만 로드하고 Medium 누락
**원인:** 기존 노드의 폰트 스타일을 확인하지 않고 자주 쓰는 스타일만 미리 로드함
**다음엔:** 기존 텍스트 노드 수정 전 `getStyledTextSegments(['fontName'])`으로 실제 사용 중인 폰트 스타일 목록 확인 후 전부 로드. "Poppins Semi Bold + Regular"로 추정하지 않는다

---

**상황:** Figma DOC 콘텐츠 프레임 2 작성 중 addBullet 함수 호출
**실수:** `addBullet(cf2, '없어지는 것 텍스트')` 호출 시 `y` 파라미터 누락 → `Required value missing` 에러
**원인:** 반복적인 불릿 추가 코드 작성 중 일부 줄에서 `, y` 인자를 빠뜨림
**다음엔:** helper 함수 반복 호출 시 모든 필수 파라미터 일관성 재확인 후 실행. 특히 yPos처럼 매번 전달해야 하는 상태값 빠짐없이 체크

---

**상황:** 세션 재개 직후 Preferences WF 어노테이션 추가 작업
**실수:** 이전 세션에서 생성했다고 요약된 frame ID(5689:195 등)를 그대로 믿고 `getNodeById`를 호출했으나 null 반환. 프레임이 존재하지 않았음.
**원인:** 세션 요약은 "의도한 작업"을 기술하는 것이지 Figma에 실제 저장된 상태를 보장하지 않음. 이전 세션의 use_figma 결과가 실제로 저장됐는지 검증 없이 신뢰했음.
**다음엔:** 세션 재개 시 이전 요약에 기재된 node ID를 사용하기 전에 반드시 `figma.currentPage.findAll()` 또는 섹션 children 탐색으로 실존 여부를 먼저 확인한다. node ID는 검증 후 사용.

---

## 2026-06-08

**상황:** My Page 리뉴얼 정책서 Slack Canvas 초안 작성
**실수:** policy/mypage.md 기반으로 작성 → Preferences 탭 누락, Invited Projects 명칭 미반영, MDWEB-773 항목 혼입
**원인:** Figma WF 확인 없이 기존 정책 문서만 참고해 작성함
**다음엔:** My Page 관련 문서 작성 시 Figma WF 먼저 읽고 실제 확정된 화면 기준으로 작성. 정책 파일은 보조 참고용

---

**상황:** My Page 정책서 초안 작성
**실수:** 첫 초안을 기능 명세서 형태(Feature ID, Flow 테이블 등)로 작성 → BD·CX 대상 정책서와 맞지 않음
**원인:** requirements/*.md 문서 형식을 그대로 따라감
**다음엔:** 대상 독자 먼저 확인. BD·CX 대상이면 정책 브리핑 형태(합니다 체, 운영 관점)로 작성. 기능 명세는 개발팀 대상에만 사용

---

## 2026-06-04 (3차)

**상황:** GNB DOC 프레임 내용 협의 중 plan mode 반복 진입
**실수:** 사용자가 내용 좁혀달라고 할 때마다 plan 파일 수정 후 ExitPlanMode 호출 → 사용자가 세 번 거절 ("아니 님 뭐함?")
**원인:** Auto mode에서 단순 콘텐츠 작성 작업에도 plan mode 절차를 밟으려 함
**다음엔:** "내용 작성해줘" 류의 요청은 plan mode 없이 바로 실행. plan mode는 코드 변경·아키텍처 결정 등 구조적 판단이 필요한 작업에만 사용

---

**상황:** GNB 고객 지원 드롭다운 항목 설정
**실수:** 레퍼런스(3913:4119) 기준으로 "자주 묻는 질문"을 드롭다운에 넣었으나, 회의록에서 "FAQ → GNB 제외"로 결정된 상태였음
**원인:** 레퍼런스 구조를 회의록 결정보다 우선시함
**다음엔:** Figma 레퍼런스와 회의록 결정이 충돌할 경우, 반드시 회의록 결정 우선. 레퍼런스는 참고용

---

## 2026-06-04 (2차)

**상황:** MDWEB-773 티켓 description 작성 중 약어 사용
**실수:** SC1/SC2/SC3으로 표기 → 사용자가 두 번 지적 ("도대체 누가 알아듣겠어?")
**원인:** 내부 메모 습관이 외부 문서에 그대로 반영됨
**다음엔:** 티켓·PRD·Confluence 등 사람이 읽는 결과물에서는 약어 절대 사용 금지. "Student Checkout Case 1"처럼 전체 명칭으로 표기

---

**상황:** 티켓 description 초안 작성 시 표(table) 과다 사용
**실수:** 표로 작성 → 사용자가 "너무 길다, 표 쓰지 말고" 피드백
**원인:** 정보량이 많을 때 표로 정리하려는 기본값
**다음엔:** 티켓 description은 불릿 + 체크리스트만. 표는 사용 금지

---

**상황:** {} placeholder orange 처리 작업 후 스크린샷 촬영
**실수:** 사용자가 "이메일 템플릿 한정해서"라고 말했을 때 이미 작업 완료 후였음 + 불필요한 스크린샷 촬영 시도
**원인:** 범위 확인 없이 먼저 실행
**다음엔:** 범위가 명확하지 않은 작업은 실행 전 한 번 확인. 검증용 스크린샷은 사용자가 요청할 때만

---

## 2026-06-04

**상황:** `/checkout` 실행 중 `session-2026-06-04.md` 신규 파일 생성 시도
**실수:** `Write` 툴로 신규 파일 작성 → "File has not been read yet" 에러 발생
**원인:** `Write` 툴은 신규 파일이라도 Read 선행을 요구함
**다음엔:** 새 파일 생성은 항상 `Bash`로 직접 작성. `Write`는 기존 파일 수정 전용으로만 사용

---

## 2026-06-08

**상황:** 학습용 파일 생성 요청 처리
**실수:** "학습용으로 파일 만들어줘" → 즉시 `docs/learning/` 디렉토리 생성 + 문서 작성 시도 → 사용자가 "문서 만들지 말고 rule command skill 파일만 다운로드할래"로 방향 수정
**원인:** "학습용 파일"을 새 문서 생성으로 해석. 사용자가 원한 건 기존 파일을 그대로 전달하는 것이었음
**다음엔:** "파일로 만들어줘" 요청 시 기존 파일 공유인지 신규 문서 작성인지 먼저 확인. 디렉토리 생성·파일 작성 전에 "어떤 형태로 원하세요?" 한 줄 확인

---

## 2026-06-17

**상황:** 3DS suspend2 이메일 본문 1 작성
**실수:** "but the verification could not be completed"으로 작성 → 사용자 "아직 해결이 안 되었다는 것 알림이 필요" 지적
**원인:** 1회성 실패 표현("could not be")을 썼으나 2nd reminder 이메일은 "여전히 미완료" 상태를 전달해야 함
**다음엔:** reminder 이메일(2번째 이후 알림)의 지속 상태 표현은 "remains [형용사]" 패턴 사용 — "remains incomplete", "remains unresolved"

---

**상황:** suspend2 노드 탐색 중 `findAll` 호출
**실수:** `node.findAll()` 호출 시 "no such property 'findAll' on TEXT node" 에러 발생
**원인:** node 타입을 확인하지 않고 frame/section이라고 가정. 실제 node 2991:1056은 TEXT 노드였음
**다음엔:** 노드 탐색 전 `node.type` 먼저 확인. 섹션/프레임 ID인지 불확실할 때 `return { type: node.type }`으로 타입 먼저 조회

---

**상황:** Create Organization Left Panel 설명 텍스트 작성
**실수:** 첫 번째 작성 시 ~입니다/~됩니다 형태의 딱딱한 톤으로 채움 → 사용자 "더 친절하게" 재요청
**원인:** Left Panel이 마케팅 성격(solutions-copy.md의 ~입니다 톤)이라고 판단. 하지만 Create Organization 페이지는 사용자 플로우 내 기능 페이지이므로 UX Writing 해요체 규칙 적용 대상
**다음엔:** 마케팅 경로(`src/app/(marketing)/**`)가 아닌 플로우 내 UI 텍스트는 무조건 해요체. solutions-copy.md는 Solutions 페이지 전용

## 2026-07-15

**상황:** 매뉴얼 버전 트리 구축 (Confluence → 파일 → 웹앱으로 3회 방향 전환)
**실수:** "대표 버전 1곳에만 배치" 모델로 Confluence에 570건 게시 → Josh 정정("분기 없으면 전 버전 유효") 후 전량 삭제·재구축
**원인:** 버전 배치 모델의 핵심 가정(무표기 문서의 유효 범위)을 실행 전에 예시로 검증하지 않음
**다음엔:** 대량 생성 전에 "이 문서는 이 버전들에서 보인다" 구체 예시 3개로 모델을 확인받는다

---

**상황:** 이미지 감사에서 깨진 첨부 판정
**실수:** "깨진 첨부 24건"으로 보고 → 실제로는 SVG 아이콘·소형 PNG 오판, 진짜 깨진 건 1건 (판정 기준을 PNG 시그니처+1KB로 잘못 잡음)
**원인:** 검증 로직의 정상 케이스(SVG, 소형 아이콘)를 고려하지 않고 결과를 단정 보고
**다음엔:** "깨짐/유실" 같은 부정 판정은 샘플을 직접 열어 확인한 후 보고한다

---

**상황:** 버전 매트릭스 표기
**실수:** 유효 버전을 "all" → 구간 압축(~) 순으로 두 번 축약해서 두 번 정정받음
**원인:** 표가 커지는 문제를 데이터 표기를 바꿔 해결하려 함
**다음엔:** 유효 버전은 항상 명시적 쉼표 나열 (메모리에 규칙 저장됨). 표시 문제는 UI(접기)로 해결
