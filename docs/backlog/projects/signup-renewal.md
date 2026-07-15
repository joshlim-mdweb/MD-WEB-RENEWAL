---
project: signup-renewal
updated: 2026-06-25
---

## 관련 Jira 티켓
- 없음 (아직 미생성 — 기획 단계)

## TODO
1. WF-05 Email/User ID 필드 정책 확정 — 읽기 전용 vs 수정 가능 (TBD 상태)
2. Sign In FEATURE 섹션 작업 — STRUCTURE 완료됐으니 FEATURE 섹션으로 진행 필요
3. Sign Up 플로우 정책 작성 (CLO-SET 가입 후 MD 계정 자동 생성 세부 플로우)
4. Sign In Figma DOC 작성 (STRUCTURE_SIGN_IN 기반 DOC_COVER + 정책 연동)
5. Legacy 계정 전환 강제 시점 및 방식 확정 (auth.md TBD 항목)
6. CLO-SET 리다이렉트 return_url 스펙 확인 (개발팀 협의)
7. docs/policy/member.md Legacy 표기 후 신규 정책 파일 별도 작성

## 컨텍스트
- **Sign In 정책 파일**: `docs/policy/auth.md` (V 0.4.0, 2026-06-23)
- **Figma 위치**: file `PeCid7uJcg0HenViaaiHUp`, page `Sign Up/In`, section `STRUCTURE_SIGN_IN` (4260:86)
- **완료 상태**: STRUCTURE_SIGN_IN 7개 화면 + 타이틀 카드 전부 완성
- **이메일 입력 필드 레이블**: "Email/User ID" 통일 (레거시 계정은 User ID로도 로그인 가능)
- **WF 화면 구성**: WF-01 Default / WF-02 ID/PW Form / WF-03 이메일 입력 / WF-04 이메일 발송 확인 / WF-05 CLO-SET 안내 / WF-06 새 비밀번호 설정 / WF-07 변경 완료
- **WF-03 엣지 케이스**: ③ "재설정 링크 보내기" annotation에 포함 (미가입 이메일 / 서버 오류 / 형식 오류 모두 기술)
- **WF-05 TBD**: 이전 화면에서 입력한 Email/User ID 필드가 읽기 전용인지 수정 가능인지 미결
- **계정 구조**: CLO-SET 통합 가입만 허용 / MemberType 비노출 (DB는 Individual 유지) / License ID 폐지
- **Organization**: 별도 엔티티. Account가 생성. Enterprise + Userpool + Indie/Academic 인증 포함
- **Certification 분리**: Student → Account 레벨 / Academic·Indie → Organization 레벨
- **기존 member.md는 Legacy**: 수정 금지. 신규 정책 파일 별도 작성 필요

## 완료 로그
### 2026-06-23
- MD 자체 ID/PW 신규 가입 전면 중단 확정 (Enterprise 포함)
- Sign Up 리다이렉트 화면 `4386:3157` Figma WF 완성
  - Left Panel: 로그인 화면과 동일 컴포넌트 재사용
  - Right Panel: Back link / 제목 / 설명 / 혜택 3개 / CTA / 로그인 유도 / Contact Us
- auth.md V 0.4.0 업데이트 — 리다이렉트 화면 콘텐츠 정책 정의

### 2026-06-09
- STRUCTURE_SIGN_IN 섹션 타이틀 카드 추가 (00 / STRUCTURE, 검정 배경 오렌지 텍스트)
- 7개 WF description 패널 Format B + native bullets 재작성 완료
- WF-02 description 오류 수정 (Error 상태 → ID/PW Form 상태로 정정)
- WF-05 description Email/User ID 필드 annotation 추가 (기존 누락)
- Email → Email/User ID 전체 표기 통일
- description 내 WF-XX 크로스레퍼런스 전부 제거 → 화면 이름으로 대체

### 2026-06-08
- Sign Up 구조 개편 방향 확정 (CLO-SET 단일화, MemberType 비노출, License ID 폐지)
- Account / Organization 엔티티 구조 정의
- Certification 분리 구조 확정 (Account: Student / Organization: Academic·Indie)
- auth.md V 0.2.0 작성 (Sign In 정책, Legacy 허용, 비밀번호 찾기 플로우 추가)
- My Page 탭 구조 변경 방향 분석 (5탭 유지, 단순화)
- Figma DOC 작성 완료 (MyPage 2 페이지, DOC_COVER + DOC_01 + DOC_02)
