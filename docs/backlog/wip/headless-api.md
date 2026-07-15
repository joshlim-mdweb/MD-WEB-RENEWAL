---
date: 2026-06-01
session_end: "오후"
---

## 오늘 한 것
- MD Headless API 신규 프로젝트 컨텍스트 파악 (Slack 스레드 분석)
- Team Console에 필요한 기능 정의 (Company ID admin 관점)
- Access Key / Secret Key 개념 정리 및 MD Headless 적용 방식 논의
- HWID 바인딩 vs IP 화이트리스트 보안 모델 비교
- Key 수량(5인팟 등) + HWID 슬롯 구조 설계 방향 도출
- Bryan / Reo 요구사항 대비 우리 논의 충족 여부 점검

## 내일 할 것 (우선순위순)
1. Reo Jeon에게 확인: HWID 바인딩 할지 / IP 화이트리스트 할지 / 수량 제한만 할지
2. Bryan Kim에게 확인: Key 발급 수량 플랜 제한 여부 (무제한? 플랜별 상이?)
3. Reo에게 확인: CLO3D 테이블 의존성 — 베타는 공용, 정식은 MD 전용 테이블 신설 여부
4. 위 3가지 확인 후 PRD 작성 시작

## 컨텍스트 (다음 세션이 바로 이어받으려면)

### 내린 결정
- Team Console = 운영팀이 아니라 **Company ID admin**이 쓰는 화면
- Key 구조: Access Key(이름표) + Secret Key(인감도장) 쌍으로 발급
- Secret Key는 생성 시 1회만 노출, 이후 마스킹 처리
- 5인 Key = Key 1개에 HWID 5개 슬롯 (서버 단위로 관리)
- 기존 MD 라이선스(사람 단위) → Headless Key(서버/기기 단위) 개념만 달라짐

### 미결 항목
- 보안 모델: HWID 바인딩 / IP 화이트리스트 / 제한 없음 + 로그 → **Reo 확인 필요**
- 발급 가능 Key 수량 제한 → **Bryan 확인 필요 (과금 모델 직결)**
- CLO3D.dbo.tblHeadlessKey 테이블에 product 컬럼 추가 작업 타이밍 → **Reo 확인 필요**
- 동시접속 수량 제한 로직 구체화 → 정책 미결

### 블로커
- 위 3가지 확인 전까지 PRD 작성 불가
- 베타(8-9월) 타임라인 기준으로 역산 필요

### 기술 현황 (스레드 확인)
- 현재 인증: accessKey + secretKey 매칭만, product/user 검증 없음
- 베타는 코드 변경 없이 CLO Headless 계정으로 수동 발급 가능
- 정식 전 필요: tblHeadlessKey에 product 컬럼 추가 + 인증 SP 수정
- X-User-Product 헤더: MD Enterprise = 133 (Linux = 134)
- Joseph Kim이 POC 완료, 인증 및 API 정상 동작 확인

## 관련 Jira 티켓
- 없음 (오늘 신규 프로젝트 파악만 진행, 티켓 미생성)

## 다음 세션 시작 메시지 (복붙용)
> MD Headless API Team Console 기능 기획 중. Reo/Bryan 확인 필요한 3가지(보안 모델, Key 수량 제한, CLO3D 테이블 의존성)가 블로커. 확인 결과 들어오면 PRD 작성 시작.
