# sync-worktrees

root `.claude/settings.json`을 7개 에이전트 워크트리에 동기화한다.

**왜 필요한가:** 워크트리는 생성 시점의 settings.json 스냅샷을 갖는다. root에 새 훅이나 권한이 추가돼도 워크트리는 자동 업데이트되지 않아서 설정 drift가 발생한다.

---

## 실행 절차

1. root settings.json 읽기: `.claude/settings.json`

2. `.claude/worktrees/` 하위 모든 디렉토리 열거

3. 각 워크트리의 `.claude/settings.json` 경로 확인:
   `.claude/worktrees/{worktree-id}/.claude/settings.json`

4. root와 diff 비교. 다른 경우 root 버전으로 덮어쓰기

5. 결과 출력:
   ```
   동기화 완료:
   - agent-a2fab87f: 업데이트됨 (hooks 2개 추가, deny 13개 추가)
   - agent-b1c2d3e4: 이미 최신
   - ...
   동기화된 워크트리: N개 / 전체: M개
   ```

---

## 주의사항

- `settings.json`만 동기화한다. `settings.local.json`은 워크트리별로 의도적으로 다를 수 있으므로 건드리지 않는다
- 워크트리가 없으면 "워크트리 없음" 출력 후 종료
- root settings.json이 유효한 JSON인지 먼저 확인 후 진행

---

## 언제 실행하는가

- root `.claude/settings.json`을 수정한 후
- `/eod` 루틴의 마지막 단계
- 워크트리에서 훅이 동작하지 않는다는 이슈 발생 시
