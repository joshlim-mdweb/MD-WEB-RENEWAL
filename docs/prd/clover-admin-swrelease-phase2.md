# PRD: CLOver Admin SW Release UX 개선 Phase 2

> 작성일: 2026-04-27 | 출처: Slack CEV7QB151 피드백 스레드 (2026-03-05 ~ 2026-04-01)

---

## EPIC

**제목**: CLOver Admin SW Release 관리 — UX 개선 Phase 2

**Epic Key (제안)**: CLOVER-SW-EP02

### Epic 설명

CLOver Admin의 SW Release 관리 페이지(https://staging1-admin1.clo3d.com/md/clo3d/swrelease)에서 2026년 3월 릴리즈 이후 내부 운영자로부터 수집된 UX 마찰 항목 7건을 해소한다. 해당 항목들은 Import → 편집 → 상태 변경 → 정렬/탐색의 작업 흐름 전반에 걸쳐 있으며, 일부는 작업 중단을 유발한다.

### 배경

- 2026년 3월 Phase 1 릴리즈 이후 내부 QA/UX 피드백 스레드에서 총 21개 항목 수집
- #1~#8, #16, #17은 Phase 1에서 해결 완료
- 나머지 7건은 운영자 워크플로우에 직접 영향을 미치는 미결 항목으로 분류됨

### 목적

- 어드민 운영자의 반복적 수동 작업 감소
- 작업 중단을 유발하는 UX 블로커 제거
- Import → 편집 → 발행 흐름의 연속성 확보

### 성공 지표 (Success Metrics)

| 지표 | 기준 |
|---|---|
| Import Overwrite 사용률 | 릴리즈 후 4주 내 신규 Import 시 Cancel/Overwrite 선택 로그 발생 확인 |
| Set to Off 일괄 처리 사용 | 기존 개별 Off 작업 대비 클릭 수 감소 (운영자 인터뷰 기반 확인) |
| 이미지 제거 오류 CS 0건 | 이미지 재할당 관련 문의 0건 유지 |
| 운영자 만족도 | Phase 2 배포 후 내부 피드백 스레드 추가 이슈 0건 |

### 관련 페이지

- Admin: https://staging1-admin1.clo3d.com/md/clo3d/swrelease
- Client (결과 반영 확인): https://www.marvelousdesigner.com/product/newfeature

---

## STORY 1 — Import Excel Overwrite 다이얼로그

**제목**: Import Excel 시 기존 데이터 Overwrite 확인 다이얼로그 제공

**Story**:
As a SW Release 담당 운영자,
I want to 기능이 이미 등록된 상태에서 엑셀 파일을 로드할 때 Overwrite 여부를 선택할 수 있도록,
So that 기존 데이터를 수동으로 삭제하지 않고도 엑셀 파일로 빠르게 갱신할 수 있다.

**배경/현황**

기능이 1건 이상 등록된 상태에서 엑셀 파일을 Import하면 에러 메시지가 출력되고 로드가 차단된다. 운영자는 엑셀 갱신 작업을 포기하거나, 기존 데이터를 건별로 수동 삭제해야 한다. 이는 릴리즈 업데이트 사이클마다 반복되는 블로커다.

**Acceptance Criteria**

```
AC1. 기능이 1건 이상 등록된 상태에서 Import Excel 액션을 실행하면,
     기존 에러 출력 대신 Confirmation Dialog가 표시된다.

AC2. Dialog 구성:
     - 제목: "기존 데이터를 덮어쓸까요?"
     - 본문: "현재 등록된 [N]개의 기능이 엑셀 파일의 데이터로 교체됩니다. 이 작업은 되돌릴 수 없어요."
     - 버튼: [Cancel] [Overwrite]

AC3. [Cancel] 선택 시:
     - 다이얼로그 닫힘
     - 기존 데이터 유지
     - 엑셀 파일 로드 실행하지 않음

AC4. [Overwrite] 선택 시:
     - 기존 등록 데이터 전체 삭제
     - 엑셀 파일 데이터로 전체 교체
     - 완료 후 성공 토스트 출력: "엑셀 파일로 업데이트됐어요"

AC5. 기능이 0건인 상태에서 Import 시 기존과 동일하게 다이얼로그 없이 바로 로드.

AC6. Overwrite 도중 오류 발생 시:
     - 기존 데이터 롤백 (삭제 전 상태 복원)
     - 에러 토스트 출력: "업데이트 중 오류가 생겼어요. 기존 데이터는 유지됐어요"
```

**우선순위**: P1 | **Story Points**: 3

**관련 스크린/컴포넌트**
- SW Release 목록 화면 > Import Excel 버튼
- Confirmation Dialog 컴포넌트 (신규)
- Import 처리 API

---

## STORY 2 — Feature Name Sync (저장 시점 반영)

**제목**: Feature Name — 저장 시점에 왼쪽 카드 타이틀 반영

**Story**:
As a SW Release 편집 운영자,
I want to Title 필드를 편집하는 동안 왼쪽 카드에는 저장 전 원래 이름이 유지되고 저장 후에만 반영되도록,
So that 편집 중인 이름과 저장된 이름을 동시에 확인하며 작업할 수 있다.

**배경/현황**

기능 편집 화면에서 Title을 수정하면 오른쪽 Feature Title 영역에는 실시간으로 반영되나, 왼쪽 축소 카드에는 반영되지 않는다. 운영자는 편집 중인 내용과 현재 저장된 내용을 비교하기 위해 왼쪽 카드를 참조하는데, 현재는 이 비교 기준이 깨져 있다.

**Acceptance Criteria**

```
AC1. Title 필드 입력 중 왼쪽 축소 카드의 타이틀은 변경되지 않는다.
     (마지막 저장 상태를 유지)

AC2. [저장] 또는 [Save] 액션 실행 후 왼쪽 카드 타이틀이 새 이름으로 업데이트된다.

AC3. 저장하지 않고 다른 Feature를 선택하거나 편집을 취소했을 때,
     왼쪽 카드 타이틀은 원래 이름을 유지한다.

AC4. 오른쪽 편집 영역의 Feature Title 실시간 미리보기는 현행 유지
     (실시간 반영 그대로).
```

**우선순위**: P2 | **Story Points**: 1

**관련 스크린/컴포넌트**
- Feature 편집 화면 > 왼쪽 Feature 리스트 카드
- Title 입력 필드 상태 관리 로직

---

## STORY 3 — Set to Live / Set to Off 토글 일괄 처리

**제목**: Set to Live / Set to Off 토글 일괄 처리 (선택 항목 상태 기반)

**Story**:
As a SW Release 담당 운영자,
I want to 선택한 항목들의 현재 상태에 따라 일괄 Live/Off 버튼이 자동으로 전환되도록,
So that 여러 항목을 한 번에 Off 처리할 수 있고 불필요한 개별 작업을 줄일 수 있다.

**배경/현황**

현재 다중 선택 시 Set to Live 일괄 처리 기능은 존재하나, Set to Off(Hidden) 일괄 처리가 없다. Live 상태인 아이템이 많을 때 운영자는 개별 아이템을 하나씩 Off해야 한다.

**Acceptance Criteria**

```
AC1. 하나 이상의 항목을 다중 선택한 상태에서 버튼 레이블 및 동작 로직:

     조건 A — 선택 항목 중 Off(Hidden) 상태인 것이 1건 이상 존재:
       버튼 레이블: "Set to Live"
       동작: 선택 항목 전체를 Live 상태로 변경

     조건 B — 선택 항목 전체가 Live 상태:
       버튼 레이블: "Set to Off"
       동작: 선택 항목 전체를 Off(Hidden) 상태로 변경

AC2. 버튼 레이블은 선택 항목 변경 즉시 재평가되어 실시간으로 업데이트된다.

AC3. Set to Off 실행 후 성공 토스트: "[N]개 항목을 숨겼어요"

AC4. Set to Live 실행 후 성공 토스트: "[N]개 항목을 공개했어요"

AC5. 혼합 선택(Live + Off 혼재) 시 Set to Live 동작은 기존과 동일하게 유지.

AC6. 0건 선택 상태에서 버튼은 비활성(disabled) 처리.
```

**우선순위**: P1 | **Story Points**: 2

**관련 스크린/컴포넌트**
- SW Release 목록 화면 > 다중 선택 툴바
- Set to Live/Off 처리 API
- 버튼 레이블 상태 관리 로직

---

## STORY 4 — Change Sort Direction

**제목**: Feature 리스트 정렬 방향 반전 기능 추가

**Story**:
As a SW Release 담당 운영자,
I want to 리스트의 정렬 방향을 반전하는 버튼을 사용할 수 있도록,
So that Template Excel Sheet의 항목 순서와 Admin 리스트 순서를 빠르게 맞춰 작업할 수 있다.

**배경/현황**

Template Excel Sheet와 Admin에 등록된 아이템 순서가 반대다. 운영자가 엑셀 시트를 보며 Admin을 편집할 때 아이템을 찾는 방향이 달라 매번 위아래를 뒤집어 찾아야 한다.

**Acceptance Criteria**

```
AC1. 리스트 상단 또는 정렬 컨트롤 영역에 "정렬 방향 반전" 버튼(또는 아이콘)을 추가한다.

AC2. 버튼 클릭 시 현재 정렬 방향의 역순으로 리스트가 재정렬된다.
     (ASC ↔ DESC 토글)

AC3. 정렬 방향 상태는 현재 세션 내에서 유지된다.
     (페이지 새로고침 시 기본 정렬로 초기화)

AC4. 정렬 방향 변경은 클라이언트 사이드 재정렬로 처리 (API 재호출 불필요).

AC5. 현재 정렬 방향을 시각적으로 표시한다 (예: 화살표 아이콘 방향).
```

**우선순위**: P2 | **Story Points**: 1

**관련 스크린/컴포넌트**
- SW Release 목록 화면 > 리스트 정렬 컨트롤 영역

---

## STORY 5 — List View Scroll Area

**제목**: Detail 편집 화면에서 왼쪽 Feature 리스트 독립 스크롤 영역 지정

**Story**:
As a SW Release 편집 운영자,
I want to Detail 편집 화면에서 왼쪽 Feature 리스트가 독립적으로 스크롤되도록,
So that 편집 중에도 리스트를 스크롤하여 다른 항목으로 이동할 수 있다.

**배경/현황**

Detail 편집 화면(2-panel 레이아웃) 상태에서 왼쪽 Feature 리스트에 독립 스크롤 영역이 없다. 아이템 수가 많을 때 하단 항목으로 이동하려면 페이지 전체를 스크롤해야 한다.

**Acceptance Criteria**

```
AC1. Detail 편집 화면(2-panel 레이아웃)에서 왼쪽 패널은 뷰포트 높이에 고정된
     독립 스크롤 영역으로 동작한다.

AC2. 왼쪽 패널 스크롤 시 오른쪽 편집 패널은 영향받지 않는다.

AC3. 왼쪽 패널 높이: 화면 상단 헤더 영역을 제외한 뷰포트 잔여 높이로 지정.
     (height: calc(100vh - [헤더 높이]px); overflow-y: auto;)

AC4. 현재 편집 중인 Feature 카드는 리스트 내에서 시각적으로 구분된다.

AC5. 목록 화면(리스트 전용 뷰)에서는 기존 스크롤 동작을 유지한다.
```

**우선순위**: P2 | **Story Points**: 2

**관련 스크린/컴포넌트**
- SW Release Detail 편집 화면 > 2-panel 레이아웃 왼쪽 패널

---

## STORY 6 — Remove Assigned Image

**제목**: Feature에 할당된 이미지 제거 기능 추가

**Story**:
As a SW Release 편집 운영자,
I want to 이미 할당된 이미지를 제거하고 빈 상태로 되돌릴 수 있도록,
So that 잘못 할당된 이미지를 수정하거나 이미지 없는 상태로 발행할 수 있다.

**배경/현황**

현재 이미지를 한 번 할당하면 제거할 수 없다. 다른 이미지로 교체는 가능하나 "이미지 없음" 상태로 되돌리는 기능이 없다.

**Acceptance Criteria**

```
AC1. 이미지가 할당된 상태에서 이미지 영역 옆에 "이미지 제거" 액션(X 아이콘)이 노출된다.

AC2. 이미지 미할당 상태에서는 제거 액션이 노출되지 않는다.

AC3. "이미지 제거" 클릭 시:
     - 소형 Confirmation 표시: "이미지를 제거할까요?" [닫기] [제거하기]
     - [제거하기] 선택 시 이미지 필드가 빈 상태로 변경 (저장 전 임시 상태)
     - 저장 전까지 실제 데이터에는 반영되지 않음

AC4. [저장] 실행 시 이미지 제거 상태가 DB에 반영된다.

AC5. 저장하지 않고 다른 Feature를 선택하면 변경사항은 초기화된다.

AC6. 저장 완료 후 성공 토스트: "이미지를 제거했어요"
```

**우선순위**: P1 | **Story Points**: 2

**관련 스크린/컴포넌트**
- Feature 편집 화면 > 이미지 할당 필드
- 이미지 제거 Confirmation 컴포넌트 (소형)
- 이미지 저장/제거 API

---

## STORY 7 — Manual Field 2행

**제목**: 다국어 Manual URL 입력 필드 높이 2행으로 확장

**Story**:
As a SW Release 편집 운영자,
I want to 다국어 Manual 주소 입력 필드가 2행 높이로 표시되도록,
So that URL을 수정할 때 가려지는 부분 없이 전체 내용을 확인하며 편집할 수 있다.

**배경/현황**

다국어 Manual URL 입력 필드가 1행(single-line input)으로 되어 있어, 긴 URL을 입력하거나 언어별로 다른 URL 영역만 부분 수정할 때 내용이 잘려 보인다.

**Acceptance Criteria**

```
AC1. 다국어 Manual URL 입력 필드의 기본 표시 높이를 2행(rows=2)으로 변경한다.

AC2. 2행을 초과하는 내용이 입력될 경우 필드 내 스크롤로 처리한다.
     (필드 자동 확장 없음 — 레이아웃 안정성 유지)

AC3. 필드 너비는 기존 레이아웃과 동일하게 유지한다.

AC4. 변경은 다국어 Manual URL 필드에만 적용한다.

AC5. 기존 저장된 URL 데이터는 변경 없이 그대로 표시된다.
```

**우선순위**: P3 | **Story Points**: 1

**관련 스크린/컴포넌트**
- Feature 편집 화면 > 다국어 Manual URL 입력 필드

---

## 우선순위 및 스프린트 배분

| Story | 내용 | Priority | SP | 스프린트 |
|---|---|---|---|---|
| S1 | Import Excel Overwrite 다이얼로그 | P1 | 3 | Sprint 1 |
| S6 | 이미지 제거 기능 | P1 | 2 | Sprint 1 |
| S3 | Set to Live/Off 토글 일괄 처리 | P1 | 2 | Sprint 1 |
| S5 | 왼쪽 리스트 독립 스크롤 | P2 | 2 | Sprint 2 |
| S4 | 정렬 방향 반전 | P2 | 1 | Sprint 2 |
| S2 | Feature Name 저장 시점 반영 | P2 | 1 | Sprint 2 |
| S7 | Manual URL 필드 2행 확장 | P3 | 1 | Sprint 2 |

**Sprint 1 총계**: 7 SP — 작업 중단 유발 블로커 3건
**Sprint 2 총계**: 5 SP — 운영 편의 개선 4건

---

## 운영 주의 사항

| 항목 | 내용 |
|---|---|
| S1 Overwrite 롤백 | Overwrite 실패 시 기존 데이터 복원 여부 운영팀 모니터링 필요 |
| S3 Off 일괄 처리 | 실수로 전체 Off 처리 시 되돌리기 방법 없음 → 확인 다이얼로그 추가 여부 개발팀 협의 권장 |
| S6 이미지 제거 | 저장 전 상태 변경이므로 페이지 이탈 시 변경사항 초기화 정책을 기존 편집 취소 정책과 일치시켜야 함 |

---

## 이벤트 로깅 포인트

| 이벤트 | 설명 |
|---|---|
| `swrelease_import_overwrite_shown` | Overwrite 다이얼로그 노출 |
| `swrelease_import_overwrite_confirmed` | Overwrite 실행 |
| `swrelease_import_overwrite_cancelled` | Cancel 선택 |
| `swrelease_bulk_set_to_off` | Set to Off 일괄 처리 실행 (count 포함) |
| `swrelease_image_remove_confirmed` | 이미지 제거 저장 완료 |
| `swrelease_sort_direction_changed` | 정렬 방향 반전 실행 |
