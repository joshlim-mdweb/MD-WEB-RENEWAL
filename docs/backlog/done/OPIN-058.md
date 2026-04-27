---
id: "OPIN-058"
title: "스테이징 환경 구성 — Supabase + Vercel"
priority: "P1"
status: "done"
completed: "2026-04-18"
agents:
  - owner: "opin-devops"
  - reviewer: "opin-qa"
  - consulted: []
created: "2026-04-14"
updated: "2026-04-14"
sprint: "W17"
policy_refs: []
code_refs:
  - "vercel.json"
  - ".env.local"
  - "supabase/migrations/"
---

## 목적

개발자가 프로덕션 DB를 오염시키지 않고 결제·인증·DB 마이그레이션을 안전하게 테스트할 수 있도록 스테이징 환경을 구성한다.

현재 로컬 dev + Toss 테스트 키로 모든 검증을 하고 있어 프로덕션 배포 전 통합 검증 단계가 없다.

## 현황

- Toss 테스트 키(`test_ck_...`, `test_sk_...`) 이미 `.env.local`에 있음
- `vercel.json` cron 설정 완료
- `supabase/migrations/` 전체 마이그레이션 파일 존재
- Supabase MCP 연결 가능 (프로젝트 생성 가능)
- CLAUDE.md에 Staging이 Deferred로 명시돼 있었으나, 결제 플로우 완성으로 필요성 확정

## 완료 조건 (Definition of Done)

- [ ] Supabase 스테이징 프로젝트 생성 (`OPINION-staging`)
- [ ] 스테이징 DB에 전체 마이그레이션 적용
- [ ] Vercel 스테이징 배포 환경 구성 (staging 브랜치 or Preview)
- [ ] 스테이징 전용 `.env` 변수 목록 문서화
- [ ] Toss 테스트 키 → 스테이징 환경 변수로 연결
- [ ] 스테이징 URL에서 결제 플로우 E2E 동작 확인
- [ ] CLAUDE.md Deferred 항목에서 Staging 제거

## 구현 힌트

### 스테이징 아키텍처

```
로컬 dev  →  로컬 Supabase (npm run dev)
스테이징  →  Supabase staging 프로젝트 + Vercel Preview
프로덕션  →  Supabase prod 프로젝트 + Vercel Production
```

### Supabase 스테이징 프로젝트

```bash
# MCP로 생성 가능
mcp__claude_ai_Supabase__create_project({
  name: "OPINION-staging",
  region: "ap-south-1",  # 프로덕션과 동일 리전
  organization_id: "lqfjhuuovbumrkyqwtfk"
})

# 생성 후 전체 마이그레이션 순서대로 apply
```

### Vercel 스테이징 설정

옵션 A (권장): Vercel Preview — `staging` 브랜치 push 시 자동 배포
옵션 B: 별도 Vercel 프로젝트 (`opinion-staging`)

스테이징 환경 변수:

```
NEXT_PUBLIC_SUPABASE_URL=https://{staging-ref}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY={staging-anon}
SUPABASE_SERVICE_ROLE_KEY={staging-service-role}
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_QbgMGZzorzKB9PpK4kz78l5E1em4  # 동일 테스트 키
TOSS_SECRET_KEY=test_sk_4yKeq5bgrpzdgvA1yRvJ3GX0lzW6              # 동일 테스트 키
NEXT_PUBLIC_APP_URL=https://{staging-url}
CRON_SECRET={별도 시크릿}
```

### 마이그레이션 순서

`supabase/migrations/` 파일을 버전 순서대로 apply:

1. `20260313000001_schema_hardening`
2. `20260313000002_rls_policies`
3. … (전체 24개)

### 예외 처리

| 케이스                                 | 처리 방법                                            |
| -------------------------------------- | ---------------------------------------------------- |
| Supabase 프로젝트 생성 후 DB 준비 대기 | 30~60초 대기 후 마이그레이션 시작                    |
| Vercel 환경 변수 설정                  | Vercel 대시보드 또는 `vercel env add` CLI            |
| Toss 웹훅 스테이징 등록                | Toss 대시보드에서 staging URL로 웹훅 엔드포인트 추가 |

## CS 문의 예상 지점

- 스테이징/프로덕션 DB 혼용 주의: 스테이징 Supabase URL이 프로덕션과 다른지 반드시 확인
