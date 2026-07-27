# [MD-ADMIN] Activity Log / Usage Time 컬럼 개편

---

## 1. Agenda

| 항목 | 내용 |
|------|------|
| TITLE | Team Console — Activity Log 컬럼 개편 + Guest 배지 |
| DESCRIPTION | 어드민 접속 현황 파악에 불필요한 컬럼 제거, 핵심 정보 직접 노출, Guest 접속자 구분 배지 추가 |
| 요청자 | Josh Lim |
| DUE DATE | (미정) |
| Jira | MDWEB-752 |
| Figma | https://www.figma.com/design/QIrvap4qCzNTGE00xH4SYd/TEAM-CONSOLE?node-id=4001-3193 |

---

## 2. Background

기업 계정 어드민이 Team Console에서 Userpool 내 구성원별 소프트웨어 접속 현황을 확인할 때, 현재 화면에는 공용 IP, 개인 IP, 버전, 상태, 지역 등 어드민 업무에 불필요한 컬럼이 다수 포함되어 있다.

핵심 정보인 로그인·로그아웃·사용 시간을 확인하려면 가로 스크롤이 필요하며, Guest 권한으로 접속한 외부 사용자와 정식 Userpool 멤버를 구분할 방법이 없다.

이번 개편은 컬럼을 정리하고 Guest 배지를 도입하여 어드민이 접속 현황을 한 화면에서 명확히 파악할 수 있도록 한다.

---

## 3. Requirements

### 화면 구조 변경

| 항목 | AS-IS | TO-BE |
|------|-------|-------|
| 탭 구조 | Activity Log / Usage Time 2탭 | 단일 테이블 (탭 없음) |

### 컬럼 변경

| 컬럼 | 변경 | 비고 |
|------|------|------|
| License ID | 추가 | 첫 번째 컬럼 |
| User ID / Email | 유지 | Guest 배지 추가 |
| Computer Name | 유지 | — |
| Hardware ID | 변경 | 전체 → 앞4+뒤4 축약 + 👁 아이콘 툴팁 |
| Login | 유지 | 직접 노출 |
| Logout | 유지 | 직접 노출 |
| Usage Time | 유지 | 직접 노출 |
| 공용 IP | 제거 | — |
| 개인 IP | 제거 | — |
| 버전 | 제거 | — |
| 상태 | 제거 | — |
| 지역 | 제거 | — |

### 최종 컬럼 순서

```
License ID | User ID/Email | Computer Name | Hardware ID | Login | Logout | Usage Time
```

### Guest 배지

- 표시 조건: Userpool Guest 권한 접속 시
- 위치: User ID/Email 셀 내 이메일 오른쪽 인라인
- 스타일: border 1px #d1d1d1, color #999, font-size 11px, border-radius 4px, padding 2px 6px, text "Guest"

### Hardware ID 툴팁

- 기본 표시: 앞 4자리 + ··· + 뒤 4자리 축약
- 👁 아이콘 클릭 시: 전체 Hardware ID 툴팁 노출
- 툴팁 닫기: 툴팁 내 X 버튼 클릭 또는 툴팁 외부 영역 클릭

---

## 4. Scope

| 영역 | 포함 | 비고 |
|------|------|------|
| Team Console > License ID 상세 > Activity Log | O | 주요 작업 대상 |
| Download as Excel 버튼 | O | 기존 유지 |
| Usage Time 탭 | — | 단일 테이블로 통합하여 탭 자체 제거 |
| 필터 / 정렬 기능 | — | 이번 범위 외 |

---

## 5. Flow

| Step | Actor | Description |
|------|-------|-------------|
| 1 | 어드민 | Team Console > License ID 상세 > Activity Log 진입 |
| 2 | 시스템 | 단일 테이블 표시: License ID · User ID/Email · Computer Name · Hardware ID · Login · Logout · Usage Time |
| 3 | 시스템 | Guest 접속 행: User ID 옆 [Guest] 배지 인라인 표시 |
| 4 | 어드민 | Hardware ID 셀 우측 👁 아이콘 클릭 |
| 5 | 시스템 | 전체 Hardware ID 툴팁 노출 |
| 6 | 어드민 | X 버튼 또는 툴팁 외부 클릭 |
| 7 | 시스템 | 툴팁 닫힘 |

---

## 6. Action Item

| 영역 | 항목 |
|------|------|
| Design | Activity Log 단일 테이블 와이어프레임 확정 (2안) |
| Design | Guest 배지 컴포넌트 스펙 |
| Design | Hardware ID 툴팁 + X 버튼 디자인 |
| FE | 탭 제거 및 단일 테이블 구현 |
| FE | 불필요 컬럼 제거 (공용 IP, 개인 IP, 버전, 상태, 지역) |
| FE | License ID 컬럼 추가 |
| FE | Guest 배지 표시 로직 (Userpool Guest 여부 판단) |
| FE | Hardware ID 축약 표시 + 👁 아이콘 + 툴팁 구현 |
| FE | 툴팁 외부 클릭 닫기 / X 버튼 닫기 |
| BE | Guest 접속 여부 API 응답 필드 확인 |

---

## History

| DATE | TITLE | DESCRIPTION |
|------|-------|-------------|
| 260511 | Draft | 초안 작성 — 컬럼 개편 + Guest 배지 + Hardware ID 축약 표시 확정 |
