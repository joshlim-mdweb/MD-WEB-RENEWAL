# [MD|ADMIN] CLOver Admin SW Release — Phase 3

Epic Key: (미정) | 요청: SW QA팀 | 출처: Slack CEV7QB151 | 작성일: 2026-05-18

## 배경

Phase 2(S1~S7) 기획 과정에서 범위 초과로 제외된 UX 개선 7건과 신규 기능 요청 1건을 다음 배치로 처리한다. Phase 1·2 운영 피드백 수집 결과, 편집 효율·데이터 관리·검색성 측면에서 추가 개선이 필요한 항목이 남아 있다.

> 영향 정책: (미정) Confluence 정리 예정

---

## 1. Requirements

### 1.1 편집 UX 개선

| 기능명 | Description |
|---|---|
| Save 버튼 변경 감지 | 시스템은 폼 필드 변경 여부를 감지해 Save 버튼 활성/비활성을 자동 전환한다. |
| Key Feature Indicator | 시스템은 Key Feature 항목에 배지 또는 아이콘을 표시해 리스트에서 즉시 식별할 수 있게 한다. |
| 리스트 아이템 Numbering | 시스템은 Feature 리스트 각 항목에 순번(#N)을 표시하고, 순서 변경 시 자동 재계산한다. |

### 1.2 데이터 표현

| 기능명 | Description |
|---|---|
| Release Date 표시 | 시스템은 Feature 카드와 상세 페이지에 Release Date를 노출해 버전 기준으로 기능을 파악할 수 있게 한다. |

### 1.3 Excel / 데이터 관리

| 기능명 | Description |
|---|---|
| 현재 데이터 포함 Template 다운로드 | 사용자는 현재 등록된 기능 데이터가 채워진 Excel 파일을 다운로드할 수 있다. |
| 다국어 포함 Excel Template Import | 사용자는 다국어 필드가 포함된 Excel 파일로 기능 데이터를 일괄 등록할 수 있다. |
| URL 유효성 검사 | 시스템은 URL 입력 필드에서 형식을 검증하고, 유효하지 않은 경우 에러 메시지를 표시한다. |

### 1.4 신규 기능

| 기능명 | Description |
|---|---|
| 버전별 기능 리스트 검색 | 사용자는 버전 선택 후 기능 리스트에서 키워드로 검색해 원하는 기능을 빠르게 찾을 수 있다. |

---

## 2. Scope

### 2.1 Admin (CLOver Admin SW Release)

- Save 버튼 변경 감지 활성/비활성 처리
- Key Feature Indicator 배지/아이콘 표시
- 리스트 아이템 순번 표시 및 자동 재계산
- Feature 카드 및 상세 페이지 Release Date 노출
- 현재 데이터 포함 Excel 다운로드 기능
- 다국어 필드 포함 Excel Import 지원
- URL 필드 유효성 검증 및 에러 처리
- 버전별 기능 리스트 검색 필드

### 2.2 미포함

- Web(marvelousdesigner.com) 노출 변경 — 별도 Phase에서 처리
- CLO Admin — MD와 별도 일정으로 처리

---

## 3. 상세 명세

### S1 — Save 버튼 변경 감지 활성/비활성

*변경사항이 있든 없든 Save 버튼이 항상 활성화되어 불필요한 저장 액션이 발생한다.*

- [ ] 폼 최초 진입 시 Save 버튼 비활성
- [ ] 필드 1개 이상 변경 시 Save 버튼 활성화
- [ ] 저장 완료 후 Save 버튼 다시 비활성
- [ ] 저장 없이 이탈 시 변경사항 초기화 (기존 동작 유지)

---

### S2 — Key Feature Indicator 표시

*Key Feature 항목과 일반 항목이 목록에서 시각적으로 구분되지 않는다.*

- [ ] Key Feature로 설정된 항목에 배지 또는 아이콘 표시
- [ ] 리스트 카드 뷰에서 즉시 식별 가능하도록 처리
- [ ] (논의 필요) Key Feature 설정 권한 및 최대 개수 정의

---

### S3 — 리스트 아이템 Numbering

*Feature 리스트에 순번이 없어 위치 파악 및 팀 간 커뮤니케이션이 어렵다.*

- [ ] 리스트 각 항목에 순번(#N) 표시
- [ ] 드래그 등으로 순서 변경 시 순번 자동 재계산
- [ ] Excel Export/Import 시 순번 포함 여부 정의 (논의 필요)

---

### S4 — Release Date 표시

*Feature 카드와 상세 화면에서 출시일을 확인할 수 없다.*

- [ ] Feature 카드에 Release Date 표시
- [ ] Feature 상세 편집 화면에 Release Date 필드 노출
- [ ] (논의 필요) 날짜 포맷 정의 (YYYY-MM-DD vs "2026년 3월")
- [ ] Release Date 미입력 시 카드에 노출 처리 정의 (논의 필요)

---

### S5 — 현재 데이터 포함 Template 다운로드

*Excel 템플릿이 빈 양식으로만 제공되어 기존 데이터 확인 시 Admin에서 직접 조회해야 한다.*

- [ ] 현재 등록된 기능 데이터가 채워진 Excel 파일 다운로드 기능 추가
- [ ] 다운로드 버튼에 옵션 제공: "빈 템플릿" / "현재 데이터 포함" (논의 필요)
- [ ] 다운로드 시 버전 선택 기준 정의 (현재 선택 버전 vs 전체) (논의 필요)

---

### S6 — 다국어 포함 Excel Template Import

*Excel Import 시 다국어 필드가 포함되지 않아 다국어 입력은 Admin에서 직접 해야 한다.*

- [ ] 다국어 필드가 포함된 Excel 템플릿 구조 정의
- [ ] 다국어 필드 포함 Excel Import 지원
- [ ] Import 후 다국어 데이터 정합성 검증 및 에러 처리
- [ ] 지원 언어 목록 및 필드 컬럼 명세 정의 (논의 필요)

---

### S7 — URL 유효성 검사

*URL 입력 필드에 형식 검증이 없어 잘못된 URL이 저장될 수 있다.*

- [ ] URL 필드 입력 시 형식 검증 (https:// 프로토콜 포함 여부 등)
- [ ] 유효하지 않은 URL 입력 시 인라인 에러 메시지 표시
- [ ] 저장 시점에도 최종 검증 수행
- [ ] 에러 메시지 문안: "유효하지 않은 URL 형식이에요. https://로 시작하는 URL을 입력해주세요"

---

### S8 — 버전별 기능 리스트 검색 (신규)

*버전 선택 후 기능 목록을 검색하는 기능이 없어 특정 기능을 찾으려면 전체 리스트를 스크롤해야 한다.*

- [ ] 버전 선택 후 기능 리스트 상단에 검색 필드 제공
- [ ] 키워드 입력 시 기능명 기준 실시간 필터링 (onChange)
- [ ] 검색 결과 없을 때 Empty State 처리: "검색 결과가 없어요"
- [ ] 검색 필드 초기화 버튼 제공
- [ ] (논의 필요) 검색 기준 확장 여부 (기능명 외 설명 텍스트 포함)

---

## 4. Action Item

| 영역 | 항목 | 담당 | 비고 |
|---|---|---|---|
| Admin FE | S1 Save 버튼 변경 감지 구현 | (미정) | |
| Admin FE | S2 Key Feature 배지/아이콘 UI | (미정) | 디자인 협의 필요 |
| Admin FE | S3 리스트 순번 표시 | (미정) | |
| Admin FE | S4 Release Date 필드 UI | (미정) | 날짜 포맷 정의 후 진행 |
| Admin BE | S4 Release Date 데이터 모델 | (미정) | |
| Admin BE | S5 현재 데이터 포함 Excel 다운로드 API | (미정) | |
| Admin BE | S6 다국어 Excel Import API | (미정) | 템플릿 구조 정의 선행 |
| Admin FE | S7 URL 유효성 검사 | (미정) | |
| Admin FE/BE | S8 버전별 검색 기능 | (미정) | |
| 기획 | Key Feature 설정 정책 정의 | @Josh Lim | S2 선행 |
| 기획 | Release Date 포맷 정의 | @Josh Lim | S4 선행 |
| 기획 | Excel 다국어 필드 구조 정의 | @Josh Lim | S6 선행 |
