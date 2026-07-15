---
project: md-article-architect
updated: 2026-07-15
---

## 관련 Jira 티켓
- 없음 (내부 툴 프로젝트, Jira 외부)

## TODO
1. Vercel 배포 — 팀 검수 공유용 (환경변수 3개 + Supabase Auth redirect URL 등록)
2. Josh: 매직링크 로그인 실테스트 (`/manual/login`, @clo3d.com) + DB 비밀번호 리셋 (채팅에 노출됨)
3. SW UX 선배·3D 디자이너 선배와 분류 규칙 미팅 — 준비된 질문 세트 + 카드 소팅 (앱 시연 기반)
4. 테이블 구조 유실 65건 복원 (원본 HTML에서 재변환)
5. 아티클 간 내부 링크 268개 리매핑 (restructure-log 기반, Zendesk 재게시 전 필수)
6. 검수 진행 — /manual/review 우선 큐 (~534건 플래그: 버전 분리 확인 284 + 기계 병합 71 + 버전 무언급 161 등)
7. 구형 UI 스크린샷 24건 재촬영 + Spiral 깨진 이미지 1건 교체 (에디터에서 업로드 가능)
8. 다국어 (ko/ja/zh-cn) — 분류·분리 확정 후 동일 결정표 적용
9. Zendesk 역반영 설계 (canonical=DB, restructure-log-v2 매핑 사용)

## 컨텍스트

### 아키텍처 (확정)
- **canonical = Supabase DB** (`MD Manual` 프로젝트, ref gaupveyrufbzrtutbuda, ap-south-1). git markdown은 초기 스냅샷 — push_supabase.py에 재적재 가드 있음
- **웹앱**: MD-WEB-RENEWAL 레포 `/manual` 라우트 그룹 (마케팅 사이트와 격리). Next.js + Tiptap 에디터 + 매직링크 인증(@clo3d.com) + 검수 워크플로우
- **구조**: Version = 아티클 속성(text[], 명시적 쉼표 나열·최신순, "all" 금지) → Category 21 → Article. Blender식 URL `/manual/{version}/{category}/{slug}`
- **버전 분리 완료**: 본문 내 버전 분기 131건 → 415 변형 (총 740건, 변형 간 버전 겹침 0). 제목에서 버전 표기 전부 제거
- 랜딩 = Dropbox 헬프센터식 (검색 히어로 + 4그룹 카테고리 카드, 그룹은 코드 상수 — 분류 규칙 확정 전 임시)

### 주요 파일
- 파이프라인: `~/md-article-architect/` (Python) — extract/analyze/normalize/split/push 스크립트, exports/에 결정표·로그 전부
- 웹앱: `src/app/(manual)/manual/**`, `src/lib/manual/**`, 마이그레이션 `supabase/migrations/202607141*.sql` (레거시 28개는 migrations_legacy/)
- 추적: `restructure-log-v2.csv` (원본 579 ↔ canonical), `canonical-versions.csv`, `split-queue.json` + `data/splits/`
- dev 서버: `nohup npm run dev` (백그라운드 태스크로 띄우면 죽음 — nohup 필수). 로그 /tmp/md-manual-dev.log

### 미결
- Confluence 산출물(TO-BE 트리 456p + 매트릭스)은 웹앱 도입 이전 세대 — 아카이브 상태, DB와 동기화 안 됨
- 분류 규칙(카테고리 기준·그룹 계층 승격·네이밍)은 선배 미팅 후 확정
- Artifact 목업: https://claude.ai/code/artifact/210285fd-3825-4c3d-9200-c875520cf4e7 (공유는 페이지 공유 메뉴에서)

## 완료 로그
### 2026-07-15
- 제목 버전 표기 78건 제거 + 범위 충돌 2쌍 해소 (UI Changes, Wind Controller)
- 본문 버전 분기 전수 탐지(131건) → LLM 분리 415 변형 생성·DB 반영 (Cut & Sew 검증 통과)
- 헬프센터형 랜딩 (검색 히어로 + 4그룹 카드) + 검색 페이지 (`/manual/{v}/search`)
- 분류 규칙 미팅 준비 — UX 선배·3D 디자이너별 질문 세트 + 확정할 규칙 6개 정리

### 2026-07-14
- Confluence TO-BE 트리 게시 (456건, 21 카테고리) → 이후 방향 전환으로 아카이브
- 버전 매트릭스 페이지 (쉼표 풀 리스트 + 분기 유형 배지)
- 이미지 감사: 구형 UI 24 / 깨진 첨부 1(Spiral, clo3d.com 잔재) / 영상 107개 복구(89 문서)
- Manual Studio Phase 1+2: Supabase 스키마·시드(456건) → 뷰어 → Tiptap 에디터 → 인증 → 검수 워크플로우 → CRUD(생성·보관)
- 목업 v1/v2 (Artifact) — 버전 스위처 데모

### 2026-07-13
- Zendesk 추출 (4로케일 × 579 Manual = 2,316 md) + NotebookLM 번들 36개
- 중복·스텁·버전 분석 → 정규화 결정표 (579 → 456 canonical)
- 버전 판별 (30개 메이저 화이트리스트, 73건 리뷰) + canonical 버전 리스트
