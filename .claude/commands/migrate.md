Supabase 데이터베이스 마이그레이션을 작성하고 적용한다.

## 실행 순서

1. 현재 마이그레이션 상태 확인:
   - Supabase MCP `mcp__supabase__list_migrations` 로 기존 마이그레이션 목록 확인

2. 마이그레이션 파일 작성:
   - 파일명: `supabase/migrations/YYYYMMDDHHMMSS_<설명>.sql`
   - 반드시 `-- Migration: <설명>` 주석으로 시작
   - `IF NOT EXISTS` / `IF EXISTS` 조건 사용으로 멱등성 보장
   - RLS 정책도 함께 작성 (opin-be 정책 기준)

3. 마이그레이션 내용 검토:
   - 롤백 가능한지 확인
   - 기존 데이터에 영향이 있는지 확인
   - 비용 증가 요소가 있는지 확인 (인덱스 추가 등)

4. 적용:
   - Supabase MCP `mcp__supabase__apply_migration` 으로 적용
   - 적용 후 `mcp__supabase__list_tables`로 확인

5. `/types` 스킬 실행하여 TypeScript 타입 재생성

마이그레이션 내용: $ARGUMENTS
