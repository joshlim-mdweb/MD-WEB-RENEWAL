Supabase 스키마에서 TypeScript 타입을 재생성하고 프로젝트에 적용한다.

## 실행 순서

1. Supabase MCP로 현재 스키마 확인:
   - `mcp__supabase__list_tables` 로 테이블 목록 확인
   - project_id: `ndqdnokwiaobmcjglvqx`

2. TypeScript 타입 생성:

```bash
npx supabase gen types typescript --project-id ndqdnokwiaobmcjglvqx > src/lib/types/database.ts
```

3. 생성된 타입과 기존 `src/lib/types/survey.ts`, `src/lib/types/poll.ts` 간 불일치 확인

4. 불일치가 있으면 수동 타입 파일을 DB 스키마 기준으로 업데이트

5. `npx tsc --noEmit`으로 타입 오류 없는지 확인

특정 테이블이나 타입을 지정한 경우: $ARGUMENTS
