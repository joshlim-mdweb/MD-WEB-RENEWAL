# POLICY_AUTH_CN

Source: MDWEB-611 (Site | Login System Update using WeChat)
Status: 진행 중 (Q2 2026 완료 목표)

---

## 1. 적용 범위

CLO-SET CN(중국) 사이트 전용 인증 체계.
MD/CLO3D 사이트에서 중국 IP 접속 시 CLO-SET CN 도메인으로 자동 리다이렉트 후 인증 → 원 사이트 복귀.
수동 리전 선택 옵션 병행 제공.

---

## 2. 인증 아키텍처

| 식별자 | 설명 |
| --- | --- |
| Primary Key | WeChat UnionID (불변, 영구 앵커) |
| 보조 식별자 | 검증된 Mobile Number |

**원칙**: WeChat은 인증 키 역할만. 소셜 프로필 자동 상속 금지.

---

## 3. 가입 / 온보딩 플로우

```
QR 스캔 → WeChat 권한 승인 → 폰번호 one-click 인증
```

| 온보딩 필드 | 필수 여부 |
| --- | --- |
| Real Name | 필수 |
| Mobile Number | 필수 |
| Profile picture | 선택 |
| Email | 선택 |

---

## 4. PC 웹 로그인

- 중국 B2B 표준: ID/PW + WeChat QR 하이브리드
- PC에서 WeChat 앱으로 초대 메시지 직접 전송 불가 → Copy-and-Paste 워크플로우 사용

---

## 5. 팀 초대: Whitelisted Identity 패턴

1. 초대자가 PC에서 초대 대상 폰번호 입력 → QR 생성
2. 피초대자가 WeChat에서 스캔
3. "폰번호 인증 허용" 팝업 승인
4. 시스템이 WeChat이 넘긴 폰번호 vs whitelist 매칭
5. 일치 시 가입 폼 없이 Space/Content 바로 접근

대안 보안: Admin Manual Approval 패턴 병행

---

## 6. 사용자 식별 UX

- 동명이인 구분: `@Name (*8901)` 마스킹 폰번호 또는 부서 태그 (중국 B2B 표준)
- 조직 초대 최종 게이트: Admin Dashboard 승인

---

## 7. 계정 관리 정책

| 항목 | 정책 |
| --- | --- |
| WeChat 링크 해제/교체 | 지원 (업계 관행) |
| 해제 조건 | 다른 검증된 identity 1개 이상 있을 때만 허용 |
| WeChat 단독 로그인 수단일 때 | 해제 차단 |
| 폰번호 변경 | 수동 변경 기능 필수 (WeChat 변경 시 자동 동기화 안 됨) |

---

## 8. 결정 기록

| 날짜 | 결정 사항 | 확인자 |
| --- | --- | --- |
| 2026-03-26 | WeChat Open Platform 등록에 중국 법인 사업자등록증 사용 확정 | Ted, Hannah, HAIQIN MA |
| 2026-03-18 | Global vs Mainland 구분은 등록 법인 유형 차이 (물리적 구분 없음) | WeChat 지원 확인 |
| 2026-02-11 | Whitelisted Identity 플로우 표준으로 확정 | Hannah |

---

## 9. 오픈 이슈 (미확정)

- MD China 사이트에 CONNECT 편입 시 중국 사용자 데이터 풀 분리 여부
- 폰번호 인증 skip 허용 여부 (실명제 회색지대)
