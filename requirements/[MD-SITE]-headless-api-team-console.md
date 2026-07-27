# [MD|SITE] Headless API Key 관리 — Team Console

Epic Key: `(미정)` | 요청: Bryan Kim (BD), Reo Jeon (Infra) | 출처: [Slack #proj_md-headless](https://clo3d.slack.com/archives/C1MHVBYKA/p1779094191631489) | 작성일: 2026-06-04

## 배경

MD Headless API 정식 출시 전, Company ID 관리자가 자사 서버 인증용 API Key를 직접 발급·관리할 수 있는 화면이 Team Console에 필요하다. 현재는 운영팀이 DB를 직접 조작해 수동 발급하는 구조로, 정식 운영에 적용하기 어렵다.

---

## 1. Agenda

| 항목 | 내용 |
|---|---|
| TITLE | Headless API Key 관리 — Team Console |
| DESCRIPTION | Company ID 관리자가 자사 파이프라인 서버 인증용 API Key를 Team Console에서 직접 발급·관리한다. Key 생성, HWID 슬롯 제어, 비활성화·재발급, 사용 로그 확인을 포함한다. |
| 요청자 | Bryan Kim (BD), Reo Jeon (Infra) |
| DUE DATE | 베타 2026-08 / 정식 2026-10 (웹 리뉴얼 동반) |

---

## 2. Background

### 2.1 AS-IS

- 운영팀이 `CLO3D.dbo.tblHeadlessKey`를 직접 조작하거나 CLO 어드민에서 수동으로 Key를 발급한다.
- 발급된 Key를 고객사에 외부 채널(이메일·Slack)로 전달한다.
- 베타 종료 또는 구독 만료 시 운영팀이 수동으로 Key를 회수한다.
- 현재 사용 로그가 기록되지 않아 누가 언제 인증했는지 추적할 수 없다.

### 2.2 TO-BE

- Company ID 관리자가 Team Console에서 직접 API Key를 발급·관리한다.
- Key에 HWID 슬롯을 등록해 허용 서버 단위로 접근을 제어한다.
- 비활성화·재발급·삭제를 관리자가 즉시 실행할 수 있다.
- 인증 시도 이력(시각, IP, 성공/실패)을 로그로 확인할 수 있다.

### 2.3 인증 구조

| 항목 | 내용 |
|---|---|
| 인증 방식 | accessKey + secretKey 쌍 매칭 |
| Key 저장 위치 | `CLO3D.dbo.tblHeadlessKey` (베타 기간 CLO/MD 공용 테이블 사용) |
| Product 구분 헤더 | `X-User-Product: 133` (MD Enterprise) / `134` (Linux) |
| Secret Key 노출 | 생성 시 1회만 노출. 이후 서버도 보관하지 않음 |

### 2.4 대상 사용자

| 역할 | 설명 |
|---|---|
| Company ID Admin | Team Console에서 Key 발급·관리·로그 확인을 수행하는 기업 대표 계정 |

### 2.5 Headless 사용 시나리오

서버(렌더팜, 파이프라인 서버)에 MD를 GUI 없이 설치하고, API Key로 인증해 의상 시뮬레이션을 자동 실행한다. 사람이 매번 로그인하지 않아도 서버가 Key로 자동 인증한다.

```
Company ID Admin (Team Console)
  → API Key 발급 → 자사 IT팀에 전달
  → 파이프라인 서버에 Key 설정
  → MD Headless 자동 인증 → 시뮬레이션 배치 실행
```

---

## 3. Requirements

### 3.1 Key 생성

| 기능명 | Description |
|---|---|
| Key 생성 | 사용자는 새로운 API Key(accessKey + secretKey 쌍)를 발급한다. |
| Key 이름 설정 | 사용자는 Key 생성 시 식별용 이름을 입력한다. (선택, e.g. "Render Farm #1") |
| 만료일 설정 | 사용자는 Key 생성 시 만료일을 설정한다. (선택, 미설정 시 무기한) |
| Secret Key 1회 노출 | 시스템은 생성 완료 직후 모달에서 accessKey와 secretKey를 전체 표시한다. 모달을 닫으면 secretKey는 다시 확인할 수 없다. |
| Key 복사 | 사용자는 생성 모달에서 accessKey와 secretKey를 각각 클립보드에 복사한다. |

### 3.2 Key 목록 조회

| 기능명 | Description |
|---|---|
| Key 목록 | 시스템은 발급된 Key 전체를 목록으로 표시한다. 표시 항목: 이름, accessKey, 상태(Active/Inactive), 마지막 사용 시각, HWID 슬롯 현황(n/N). |
| secretKey 마스킹 | 시스템은 목록과 상세에서 secretKey를 `sk_****` 형태로 마스킹 처리한다. |
| 미사용 Key 식별 | 시스템은 한 번도 인증에 사용되지 않은 Key를 "사용 이력 없음"으로 표시한다. |
| 만료 임박 알림 | 시스템은 만료일 7일 이내 Key에 만료 임박 표시를 노출한다. (논의 필요) |

### 3.3 Key 관리

| 기능명 | Description |
|---|---|
| Key 이름 수정 | 사용자는 발급된 Key의 이름을 수정한다. |
| Key 비활성화 | 사용자는 Key를 즉시 비활성화한다. 비활성화 즉시 해당 Key로의 인증이 차단된다. |
| Key 활성화 | 사용자는 비활성화된 Key를 다시 활성화한다. |
| Key 재발급 | 사용자는 Key를 재발급한다. 기존 Key는 즉시 폐기되고, 새 accessKey + secretKey 쌍이 발급된다. HWID 슬롯은 유지된다. |
| Key 삭제 | 사용자는 Key를 완전히 삭제한다. 삭제된 Key는 복구할 수 없다. HWID 슬롯도 함께 삭제된다. |

### 3.4 HWID 슬롯 관리

| 기능명 | Description |
|---|---|
| HWID 등록 | 사용자는 Key에 서버의 Hardware ID를 등록한다. 등록 시 식별용 서버 이름을 입력한다. (선택) |
| HWID 해제 | 사용자는 등록된 HWID를 해제한다. 해제 즉시 해당 서버의 인증이 차단된다. |
| HWID 슬롯 현황 | 시스템은 Key별 등록된 HWID 목록(서버 이름, HWID, 등록일)과 잔여 슬롯 수를 표시한다. |
| 슬롯 초과 차단 | 시스템은 플랜에서 허용하는 HWID 슬롯 수를 초과해 등록을 시도하면 차단한다. (논의 필요: 슬롯 수 기준) |

### 3.5 사용 로그

| 기능명 | Description |
|---|---|
| 인증 로그 | 사용자는 Key별 인증 시도 이력(시각, IP, 성공/실패 여부)을 확인한다. |
| 기간 필터 | 사용자는 로그를 기간으로 필터링한다. |
| 비정상 접근 식별 | 시스템은 허용되지 않은 IP 또는 HWID에서의 인증 시도 실패를 구분해 표시한다. |

---

## 4. Scope

### 4.1 Team Console (Web)

- Company ID Admin 전용. License ID 접근 불가.
- Team Console 내 별도 탭 또는 섹션으로 배치한다. (논의 필요: 정확한 IA 위치)
- Headless API 탭은 Company ID 계정에만 노출한다.

### 4.2 제외 범위

- 운영자용 Key 관리 화면 (CLOver Admin) — 별도 논의
- Headless API 자체 기능 (시뮬레이션 실행, 파이프라인 연동) — 개발팀 소관
- 베타 기간 수동 발급 플로우 — 운영팀 내부 절차 유지

---

## 5. Flow

### 5.1 Key 생성 플로우

| Step | Actor | Description |
|---|---|---|
| 1 | 사용자 | Team Console의 Headless API 탭에 진입한다. |
| 2 | 사용자 | [+ New Key] 버튼을 클릭한다. |
| 3 | 사용자 | Key 이름(선택), 만료일(선택)을 입력하고 생성을 요청한다. |
| 4 | System | accessKey + secretKey 쌍을 발급한다. |
| 5 | System | 생성 완료 모달에서 accessKey와 secretKey 전체를 표시한다. |
| 6 | 사용자 | accessKey와 secretKey를 각각 복사해 저장한다. |
| 7 | 사용자 | 모달을 닫는다. 이후 secretKey는 다시 확인할 수 없다. |
| 8 | System | Key 목록에 신규 Key를 Active 상태로 추가한다. |

### 5.2 HWID 슬롯 등록/해제 플로우

| Step | Actor | Description |
|---|---|---|
| 1 | 사용자 | Key 목록에서 대상 Key를 선택해 상세로 진입한다. |
| 2 | 사용자 | HWID 등록 버튼을 클릭한다. |
| 3 | 사용자 | 서버 HWID와 서버 이름(선택)을 입력한다. |
| 4 | System | 슬롯 잔여 여부를 확인한다. 초과 시 등록을 차단한다. |
| 5 | System | HWID를 슬롯에 등록하고 목록에 추가한다. |
| 6 | 사용자 | HWID 해제 시 해제 버튼을 클릭하고 확인한다. |
| 7 | System | 해당 HWID의 인증을 즉시 차단하고 슬롯에서 제거한다. |

### 5.3 Key 비활성화/재발급 플로우

| Step | Actor | Description |
|---|---|---|
| 1 | 사용자 | Key 목록에서 대상 Key의 더보기(`···`) 메뉴를 클릭한다. |
| 2 | 사용자 | 비활성화를 선택하고 확인 모달에서 확인한다. |
| 3 | System | Key 상태를 Inactive로 변경하고 즉시 인증을 차단한다. |
| 4 | 사용자 | Key 재발급을 선택한다. |
| 5 | System | 기존 Key를 폐기하고 새 accessKey + secretKey 쌍을 발급한다. HWID 슬롯은 유지된다. |
| 6 | System | 생성 완료 모달에서 새 Key를 1회 표시한다. |

---

## 6. Action Item

### 6.1 디자인

- [ ] Team Console 내 Headless API 탭 IA 설계
- [ ] Key 목록 화면 와이어프레임 (Key 이름, accessKey, 상태, 마지막 사용, HWID 현황)
- [ ] Key 생성 모달 — secretKey 1회 노출 + 복사 UX
- [ ] Key 상세 화면 — HWID 슬롯 목록 + 등록/해제
- [ ] 인증 로그 화면
- [ ] 더보기 메뉴 — 비활성화 / 활성화 / 재발급 / 삭제
- [ ] 비활성화·삭제 확인 모달 UX Writing

### 6.2 개발

- [ ] Team Console — Headless API 탭 라우팅 및 접근 제어 (Company ID Admin 전용)
- [ ] Key 생성 API (accessKey + secretKey 발급, 이름·만료일 저장)
- [ ] Key 목록 조회 API (상태, 마지막 사용, HWID 슬롯 현황 포함)
- [ ] Key 비활성화 / 활성화 API
- [ ] Key 재발급 API (기존 폐기 + 신규 발급, HWID 슬롯 유지)
- [ ] Key 삭제 API
- [ ] HWID 슬롯 등록 / 해제 API
- [ ] 인증 로그 저장 및 조회 API
- [ ] `CLO3D.dbo.tblHeadlessKey`에 product 컬럼 추가 + 인증 SP에 product 검증 추가

---

## 7. 미결 항목 (논의 필요)

| 항목 | 확인 대상 | 내용 |
|---|---|---|
| 보안 모델 | Reo Jeon | HWID 바인딩 필수 / IP 화이트리스트 / 제한 없음 중 선택 |
| Key 발급 수량 제한 | Bryan Kim | 플랜별 발급 가능 Key 수 (무제한 또는 n개) — 과금 모델 직결 |
| HWID 슬롯 수 기준 | Bryan Kim / Reo Jeon | Key 1개당 허용 HWID 수, 플랜별 차등 여부 |
| CLO3D 테이블 의존성 | Reo Jeon | 베타: 공용 테이블 유지 / 정식: MD 전용 테이블 신설 여부 |
| 로그 보관 기간 | Reo Jeon | 30일 / 90일 / 무제한 |
| Team Console IA 위치 | Josh Lim | 별도 탭 / 기존 탭 내 섹션 중 선택 |
| Headless API 대상 플랜 | Bryan Kim | Enterprise 전용 / 별도 add-on 구매 여부 |
