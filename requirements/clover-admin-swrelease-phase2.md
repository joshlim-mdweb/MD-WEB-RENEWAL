# CLOver Admin SW Release — Phase 2

Epic Key: `CLOVER-SW-EP02` | 출처: Slack CEV7QB151 (2026-03-05 ~ 2026-04-01) | Admin: https://staging1-admin1.clo3d.com/md/clo3d/swrelease

Phase 1(2026-03) 릴리즈 후 운영자 피드백 21건 수집. #1~#8, #16, #17 해결 완료. 미해결 7건 + 신규 개발 3건 처리.

> 영향 정책: (미정) Confluence 정리 예정

---

## Part A. UX 개선

*Slack 피드백 기반. 기존 기능의 운영 마찰 해소.*

### S1 — Import Excel Overwrite 다이얼로그 `P1`
*기능 등록 상태에서 엑셀 재Import 시 에러 출력, 로드 차단됨.*

- [ ] 기능 1건 이상일 때 Confirmation Dialog 표시
- [ ] "기존 데이터를 덮어쓸까요?" [닫기] [Overwrite]
- [ ] [Overwrite] → 전체 교체, 토스트: "엑셀 파일로 업데이트됐어요"
- [ ] 0건 상태에서는 Dialog 없이 바로 로드
- [ ] 오류 시 토스트: "업데이트 중 오류가 생겼어요. 기존 데이터는 유지됐어요"

---

### S2 — Feature Name Sync `P2`
*Title 수정 시 왼쪽 카드가 즉시 바뀌어, 편집 중/저장된 내용 비교 불가.*

- [ ] Title 입력 중 왼쪽 카드는 마지막 저장 상태 유지
- [ ] [Save] 후 왼쪽 카드 타이틀 업데이트
- [ ] 저장 없이 이탈 시 원래 이름 유지

---

### S3 — Set to Live / Set to Off 일괄 처리 `P1`
*Set to Off 일괄 기능 없어 Live 항목 많을 때 개별 처리 필요.*

- [ ] 전체 Live → 버튼 "Set to Off" (전체 Off로 변경)
- [ ] Off 1건 이상 포함 → 버튼 "Set to Live" (전체 Live로 변경)
- [ ] 버튼 레이블 선택 변경 즉시 업데이트
- [ ] 0건 선택 시 버튼 비활성
- [ ] 완료 토스트: "[N]개 항목을 숨겼어요" / "[N]개 항목을 공개했어요"

---

### S4 — Change Sort Direction `P2`
*Template Excel과 Admin 항목 순서 반대라 편집 시 탐색 방향 불일치.*

- [ ] 리스트 상단에 정렬 방향 반전 버튼 추가
- [ ] 클릭 시 ASC ↔ DESC 토글, 아이콘으로 현재 방향 표시
- [ ] 세션 내 유지, 새로고침 시 기본 정렬 초기화

---

### S5 — List View Scroll Area `P2`
*Detail 편집 화면(2-panel)에서 왼쪽 리스트 독립 스크롤 없음.*

- [ ] 왼쪽 패널 독립 스크롤 (오른쪽 편집 패널 영향 없음)
- [ ] 현재 편집 중인 카드 시각적 구분

---

### S6 — Remove Assigned Image `P1`
*이미지 할당 후 제거 불가. "이미지 없음" 상태로 되돌리는 방법 없음.*

- [ ] 이미지 할당 상태에서 제거 액션(X 아이콘) 노출
- [ ] 제거 클릭 시 Confirmation: "이미지를 제거할까요?" [닫기] [제거하기]
- [ ] [저장] 실행 시 반영, 토스트: "이미지를 제거했어요"
- [ ] 저장 없이 이탈 시 변경사항 초기화

---

### S7 — Manual Field 2행 `P3`
*Manual URL 필드 1행이라 긴 URL 편집 시 내용 잘림.*

- [ ] 다국어 Manual URL 필드 높이 2행으로 변경
- [ ] 2행 초과 시 필드 내 스크롤 처리 (자동 확장 없음)

---

## Part B. 신규 개발

*현재 연동 갭 해소. 우선순위 및 작업 순서 논의 필요.*

### 연동 현황

| 구간 | MD | CLO |
|---|---|---|
| Admin 등록 | ✅ 완료 | ⚠️ UI만 있음 (한국어 우선 등록 필요) |
| Admin → Web | ✅ 완료 | ❌ 미작업 |
| Web → WelcomeWindow | ❌ 미작업 | ❌ 미작업 |

### 미결 사항

- (논의 필요) CLO Renewal 라이브 시기에 맞춰 작업해야 하는지
- (논의 필요) WelcomeWindow 연동 작업 순서 및 방식 (MD 먼저 vs MD·CLO 동시)

---

### S8 — CLO Admin 등록 프로세스 `P?`
*CLO는 MD와 달리 한국어를 우선 등록하는 프로세스가 필요. 현재 UI만 있고 실제 등록 불가.*

- [ ] CLO Admin에서 한국어 우선 등록 프로세스 구현
- [ ] MD와 CLO 등록 프로세스 차이 명세 (논의 필요)

---

### S9 — Admin → Web CLO 연동 `P?`
*MD는 완료. CLO Admin 등록 데이터가 CLO 클라이언트 페이지에 노출되지 않음.*

- [ ] CLO SW Release 데이터를 CLO 클라이언트 페이지에서 렌더링
- [ ] S8 완료 후 진행

---

### S10 — Web → WelcomeWindow 연동 `P?`
*MD·CLO 모두 미작업. SW에서 웹 데이터를 WelcomeWindow로 받아야 함.*

- [ ] MD 클라이언트 → WelcomeWindow 데이터 전달
- [ ] CLO 클라이언트 → WelcomeWindow 데이터 전달
- [ ] MD·CLO 작업 순서 결정 (논의 필요)
- [ ] CLO Renewal 라이브 일정과 조율 (논의 필요)
