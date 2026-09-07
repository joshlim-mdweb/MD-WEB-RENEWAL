---
project: account-structure
updated: 2026-06-25
---

## 관련 Jira 티켓
- 없음 (정책 문서 + Figma Description 작업)

## TODO
1. BD 팀 피드백 수집 — Slack Canvas 공유 완료 (2026-06-25), 질문 대기 중
2. Indie Verification 폼 나머지 Description 슬롯 작성 (회사소개서 필드 외 미완료)
3. Slack Canvas 빈 placeholder 표 수동 삭제 필요 (KR·EN 섹션 1 각 1개 — 직접 열어서 Delete)

## 컨텍스트
- **Slack Canvas**: [[RENEWAL] Account Structure](https://clo3d.slack.com/docs/T04BT3VBR/F0BBYNQ3S8P) `F0BBYNQ3S8P`
  - KR·EN 섹션 1 계정 유형 표를 5컬럼 매트릭스로 교체 (계정 유형 / 설명 / Web 로그인 / SW 로그인 / CLO-SET 연동)
  - Non-Member: 전체 ❌ / Member: 전체 ✅ / SW Account: SW 로그인 ✅만
- **계정 구조 정책 핵심**:
  - MemberType 폐지 → 모두 동일 Member
  - SW Account = Marvelous Designer SW 로그인 전용 (구 License ID). Web 로그인·CLO-SET 연동 불가
  - Group(Organization) Owner만 SW Account 생성 가능 (인원 제한 없음)
  - Verification은 플랜 구매 자격 부여 레이어 (Student: 개인 / Academic·Indie: Organization)
- **Figma Description 작업** (file `PeCid7uJcg0HenViaaiHUp`, Plan 페이지):
  - Academic Verification 프레임 `4614:6048` — Description 5장 완료 (Header + ①②③④)
  - Indie Verification 폼 `5074:3237` — 회사소개서 필드 완료, 나머지 미완료

## 완료 로그
### 2026-06-25
- Slack Canvas 계정 유형 표 5컬럼 매트릭스로 교체 (KR·EN 동시)
- BD 팀에 Canvas 공유 완료

### 2026-06-22
- Indie Verification 폼 `5074:3237` (회사소개서 또는 포트폴리오) Description 작성 및 Figma 삽입
  - 파일 업로드 상태(Default/Filled/Error) + URL 입력 상태 + 유효성 검사 분기 포함

### 2026-06-18
- Academic Verification 화면 UX 스펙 작성
- Figma native annotation 4개 노드(①~④) 추가
- Description Panel 5장 (Header + ①②③④) Figma 직접 삽입
