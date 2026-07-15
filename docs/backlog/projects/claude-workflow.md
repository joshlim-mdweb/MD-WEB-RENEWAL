---
project: claude-workflow
updated: 2026-06-25
---

## 관련 Jira 티켓
- 없음 (내부 툴링 작업)

## TODO
### /checkout · /initiate
1. 실제 업무 세션에서 `/checkout` 실사용 → 포맷·흐름 검증 후 보완

### Flowchart Tool
2. 브라우저에서 드래그 연결 동작 최종 확인 (hover zone 수정 후 미검증)
3. 집에서 standalone으로 재구현 — `docs/flowchart-tool-reference.md` 참조
4. 기존 Supabase 세션 데이터 마이그레이션 검토 (col/row → step/track 구 포맷 잔존)
5. 더블클릭 빈 영역 → 노드 추가 동작 확인 (zoom/pan 환경에서 좌표 정확도)

## 컨텍스트
### /checkout · /initiate
- `/checkout` 커맨드 운영 중 (`.claude/commands/checkout.md`)
  - Step 0: 프로젝트 선택 + 네이밍 규칙 안내
  - Step 1: 프로젝트 파일 덮어쓰기 갱신
  - Step 2: 세션 대화 자동 분석 → 실수 노트
  - Step 3: 상태 리포트
- `/initiate` Step 2 동작 검증 완료 — `docs/backlog/projects/` 최신 파일 읽어 TODO 출력 정상

### Flowchart Tool
- `localhost:3001/flowchart` — 내부 기획 툴, Supabase `tool_flowcharts` 테이블 사용
- Phase 1~7 전부 구현 완료 (step/track 리네임, hover ＋버튼, drag-to-connect, zoom/pan, undo/redo, 삭제 모달, 멀티선택)
- hover zone 버그 수정: `<g> onMouseEnter/Leave` + 큰 투명 rect 패턴 적용 (미최종 확인)
- 파일 폴링: Claude Code → `public/flowchart-current.json` → 브라우저 2초 간격 auto-detect
- 레퍼런스 문서: `docs/flowchart-tool-reference.md` (집에서 재구현용 올인원)

## 완료 로그
### 2026-06-22
- FlowNode `col`/`row` → `step`/`track` 타입 리네임
- 엣지 key 파싱 버그 수정 (`${from}-${to}` → `${from}__${to}`)
- 노드 hover ＋버튼 (right/below/left insert) 구현
- 연결 포인트(●) drag-to-connect 구현 (decision → yes/no 팝업)
- Ctrl+스크롤 줌 (25~200%) + 빈 영역 드래그 패닝
- Cmd+Z / Cmd+Shift+Z Undo/Redo (20단계 ref 스택)
- 노드 삭제 모달 (bridge/edges-only/cascade 모드)
- 멀티 선택 + step/track delta 이동
- hover zone 버그 수정 (어포던스 전체 커버)
- `docs/flowchart-tool-reference.md` 올인원 레퍼런스 문서 작성

### 2026-06-08
- `/initiate` Step 2 동작 검증 완료
- `/checkout` Step 0에 프로젝트 네이밍 규칙 추가

### 2026-06-04
- `/checkout` 커맨드 초안 작성 → project 기반 구조로 전환
- `/initiate` 커맨드 목록 업데이트
