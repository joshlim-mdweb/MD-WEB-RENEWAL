# [MD|ADMIN] CLOver Admin SW Release UX 개선 — Phase 2

Epic Key: `CLOVER-SW-EP02` | 요청: Jeongsu Lim (SW QA) | 출처: [Slack CEV7QB151](https://clo3d.slack.com/archives/CEV7QB151/p1772687620249109) | 작성일: 2026-04-27

## 배경

2026년 3월 MD 12 릴리즈 후 CLOver Admin SW Release 관리 페이지에 대한 내부 운영자 피드백 21건이 수집됐다. 이 중 #1~#8, #16, #17은 3/24 배포 및 Hotfix로 해결됐고, 나머지 7건은 작업 중단·반복 수동 작업·데이터 수정 불가 등 운영 워크플로우에 직접 영향을 주는 미결 항목으로 남았다. Phase 2에서 이를 일괄 처리한다.

> 영향 정책: (미정) Confluence 정리 예정

---

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
