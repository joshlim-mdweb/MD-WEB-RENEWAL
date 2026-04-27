# OPINION 스테이징 환경 가이드

## 스테이징 Supabase 프로젝트

| 항목             | 값                                         |
| ---------------- | ------------------------------------------ |
| Project ID       | `lrstquucjtvmfojbhyzn`                     |
| Region           | `ap-south-1` (프로덕션과 동일)             |
| Project URL      | `https://lrstquucjtvmfojbhyzn.supabase.co` |
| Anon Key (JWT)   | 아래 환경변수 섹션 참고                    |
| Service Role Key | Supabase 대시보드 → Project Settings → API |

프로덕션 Project ID: `ndqdnokwiaobmcjglvqx` (혼용 절대 금지)

---

## 스테이징 환경변수 목록

Vercel 대시보드 또는 `vercel env add` CLI로 `Preview` 환경에 설정한다.

```
# Supabase — 스테이징 전용 (프로덕션 값 사용 금지)
NEXT_PUBLIC_SUPABASE_URL=https://lrstquucjtvmfojbhyzn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyc3RxdXVjanR2bWZvamJoeXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwODI5MDIsImV4cCI6MjA5MTY1ODkwMn0.PT1g1ycCMAChPASkGF5uo-qj8jI8c-FRb1hK8bNnQ6E
SUPABASE_SERVICE_ROLE_KEY=<Supabase 대시보드 → lrstquucjtvmfojbhyzn → Settings → API → service_role>

# Toss 결제 — 테스트 키 (스테이징/로컬 공용)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_QbgMGZzorzKB9PpK4kz78l5E1em4
TOSS_SECRET_KEY=test_sk_4yKeq5bgrpzdgvA1yRvJ3GX0lzW6

# 앱 URL — 스테이징 Vercel Preview URL로 교체
NEXT_PUBLIC_APP_URL=https://<staging-vercel-preview-url>

# Cron 보안 시크릿 — 스테이징 전용으로 별도 생성
# openssl rand -hex 32 으로 생성 후 설정
CRON_SECRET=<별도_생성_시크릿>
```

service_role 키는 절대 코드베이스에 커밋하지 않는다.
Supabase 대시보드 경로: https://supabase.com/dashboard/project/lrstquucjtvmfojbhyzn/settings/api

---

## Vercel 스테이징 배포 구성

권장 방식: Vercel Preview (옵션 A)

1. GitHub 저장소에 `staging` 브랜치 생성

   ```bash
   git checkout -b staging
   git push -u origin staging
   ```

2. Vercel 대시보드 → Project → Settings → Git
   - "Preview Branches"가 자동으로 `staging` 브랜치를 감지해 Preview 배포를 생성함

3. Vercel 대시보드 → Project → Settings → Environment Variables
   - Environment: `Preview` 선택
   - 위 환경변수 목록을 모두 입력
   - `NEXT_PUBLIC_APP_URL`은 Preview URL 확정 후 업데이트

4. `staging` 브랜치에 push할 때마다 스테이징 Preview가 자동 재배포됨

### Toss 웹훅 스테이징 등록

Toss 대시보드 → 개발자센터 → 웹훅 설정에서 스테이징 URL 추가:

```
https://<staging-vercel-preview-url>/api/payments/webhook
```

---

## 아키텍처

```
로컬 dev   →  로컬 Supabase (npm run dev)
스테이징   →  Supabase lrstquucjtvmfojbhyzn + Vercel Preview (staging 브랜치)
프로덕션   →  Supabase ndqdnokwiaobmcjglvqx + Vercel Production (main 브랜치)
```

---

## DB 마이그레이션 적용 방법

새 마이그레이션을 스테이징 DB에 적용할 때는 Supabase MCP를 사용한다.

```
mcp__claude_ai_Supabase__apply_migration({
  project_id: "lrstquucjtvmfojbhyzn",
  name: "<migration_name>",
  query: "<SQL>"
})
```

프로덕션과 동일한 마이그레이션 파일을 `supabase/migrations/`에서 읽어 순서대로 적용한다.
스테이징에서 검증 완료 후 프로덕션(`ndqdnokwiaobmcjglvqx`)에 동일하게 적용한다.

---

## 비용 메모

스테이징 Supabase 프로젝트는 현재 Free tier ($0/월).
사용하지 않는 기간에는 Supabase 대시보드에서 Pause 처리해 리소스를 절약한다.
(Pause 시 7일 후 데이터 유지, Resume 후 자동 복구)
