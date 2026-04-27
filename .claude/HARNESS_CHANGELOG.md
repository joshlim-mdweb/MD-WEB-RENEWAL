# HARNESS_CHANGELOG

OPINION 하네스의 모든 변경 이력. 룰이 왜 추가됐는지, 언제 제거해야 하는지를 기록한다.

**원칙:** AI가 실수했을 때 AI를 탓하지 말고, 같은 실수가 반복되지 않도록 환경을 수정한다. (Mitchell Hashimoto)

분기마다 `/retro` 실행 시 이 파일을 검토해 제거 조건이 충족된 룰을 삭제한다.

---

## 포맷

```
| 날짜 | 레이어 | 변경 내용 | 실수 패턴 | 제거 조건 |
```

---

## Active — 현재 적용 중인 룰

| 날짜       | 레이어         | 변경 내용                                                              | 실수 패턴                                                                              | 제거 조건                                                                            |
| ---------- | -------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 2026-03-11 | 1. Rules       | `replace_all` 경고 CLAUDE.md Known Issues 등록                         | Edit tool의 replace_all이 import 문자열 내부까지 치환해서 다른 파일 import가 깨짐      | Edit tool 버그가 upstream에서 수정되거나, 30일간 해당 패턴의 실수가 git log에 없으면 |
| 2026-03-24 | 1. Rules       | `QUESTION_TYPE_COLORS` 단일 소스 룰 (design-tokens.ts만)               | 두 곳에 정의하다 값이 조용히 달라져서 빌더에서 색상 불일치 발생                        | TypeScript가 COLOR 토큰 타입을 컴파일 레벨에서 강제하게 되면                         |
| 2026-03-24 | 1. Rules       | MCP 서버는 `.mcp.json`에 추가 (settings.json 아님)                     | settings.json에 추가했더니 Claude Code에서 MCP 서버가 로드되지 않음                    | Claude Code가 settings.json MCP 설정을 지원하거나, 공식 문서가 변경되면              |
| 2026-03-24 | 1. Rules       | `useEffect` 내 동기 setState → tick counter 패턴                       | React 컴파일러 린트 에러 발생. 직접 setState 하면 무한 루프 가능성                     | React 컴파일러가 이 패턴을 자동 처리하거나, 60일간 해당 린트 에러가 없으면           |
| 2026-04-03 | 5. Agents      | opin-design에서 Figma 드로잉 역할 제거, UX 검증만 유지                 | Figma MCP가 불안정해서 드로잉 작업이 세션을 낭비함. 제품 결정으로 Figma 직접 작업 제거 | 영구 유지 (제품 정책 결정)                                                           |
| 2026-04-14 | 2. Permissions | `deny` 블록 추가 (rm -rf, git push --force, DROP TABLE 등)             | deny 없이 allow-only 구조 → 파괴적 명령이 구조적으로 차단되지 않음                     | 마지막까지 유지. 파괴적 명령은 모델이 아무리 좋아져도 구조적 차단이 필요             |
| 2026-04-14 | 3. Hooks       | TypeScript + ESLint PostToolUse 훅 추가                                | ts/tsx 파일 수정 후 타입 에러가 수동 빌드까지 안 잡혀서 세션이 "완료"로 끝남           | Claude의 TypeScript 자가 수정이 완전해져서 훅 없이도 에러 0건이 60일 지속되면        |
| 2026-04-14 | 4. Testing     | `npm run smoke` 스크립트 추가, smoke.spec.ts를 공식 verify 도구로 등록 | Playwright 테스트가 존재했지만 npm 명령이 없어서 아무도 안 돌렸음                      | 영구 유지. 브라우저 테스트는 모델 성능과 무관하게 필요                               |
| 2026-04-14 | 5. Agents      | opin-qa Independence Rule 추가                                         | 구현 세션과 같은 컨텍스트에서 QA하면 self-evaluation bias 발생. 항상 "잘 됐다"고 함    | Claude의 독립적 평가 능력이 검증되면. 현재는 구조적 분리가 필요                      |
| 2026-04-14 | 3. Hooks       | `/cowork` Step 4에 빌드 게이트(HARD STOP) 추가                         | QA 전에 빌드 검증이 없어서 빌드 실패 코드를 QA하는 낭비 발생                           | 영구 유지. 빌드 게이트는 QA 비용 절감의 기본                                         |
| 2026-04-14 | 2. Permissions | settings.local.json stale 권한 제거                                    | poll 기능 제거 후에도 poll 파일 경로 grep 권한, 사라진 디렉토리 mkdir 권한이 잔존      | 해당 없음 (제거 완료)                                                                |

---

## Removed — 제거된 룰

| 날짜   | 무엇을 제거했는가 | 제거 이유 |
| ------ | ----------------- | --------- |
| (없음) |                   |           |

---

## 분기 검토 체크리스트

`/retro` 실행 시 아래를 검토한다:

- [ ] 최근 30일 git log에서 각 룰이 실제로 위반된 적 있는가?
- [ ] 없다면: Claude가 룰 없이도 자가 수정하는가? (임시로 룰 제거 후 테스트)
- [ ] 훅이 추가한 latency 대비 실제로 잡은 에러 수가 가치 있는가?
- [ ] 워크트리 settings.json이 root와 동기화되어 있는가?
- [ ] Known Issues 중 업스트림에서 수정된 항목이 있는가?
