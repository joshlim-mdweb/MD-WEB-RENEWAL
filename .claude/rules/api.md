---
paths:
  - "src/app/api/**"
  - "supabase/**"
---

# API & Database Rules

## Origin

API 룰은 에이전트가 반복한 두 가지 실수에서 만들어졌다:

1. **SELECT \* 남용:** 필요한 컬럼만 조회하지 않아 불필요한 데이터 전송과 RLS 우회 위험 발생.
2. **문서 미업데이트:** API 라우트를 수정하면서 `docs/api/` 문서를 안 고쳐서 API 명세와 실제 구현이 달라졌다. 이후 에이전트가 문서를 보고 잘못된 파라미터로 호출하는 연쇄 버그 발생.

**제거 조건:** 문서 자동 생성 도구가 코드에서 직접 API 명세를 추출하게 되면 문서 업데이트 룰 검토 가능.

## Supabase 비용 원칙

- `SELECT *` 금지 — 필요한 컬럼만
- Realtime은 product-critical 경우에만
- 폴링 패턴 금지
- 단건 write 여러 번 대신 batch write 사용

## API 라우트 패턴

- 인증: `supabase.auth.getUser()` 사용
- 에러 응답: `{ error: 'snake_case_reason' }` + 적절한 HTTP status
- 409 — 중복 (duplicate)
- 422 — 유효성 실패 (validation)
- 403 — 권한 없음

## 백엔드 전용 (Supabase only)

다른 DB/ORM 제안 금지. 마이그레이션은 `supabase/migrations/`에 작성.

## 정책 소스

`docs/policy/` — survey.md, poll.md, points.md, abuse.md 참고

## API 문서 자동 업데이트 (MANDATORY)

**`src/app/api/**`파일을 수정하는 즉시, 작업 완료 전에 반드시 대응하는`docs/api/` 문서를 업데이트한다.\*\*
이 규칙은 자동 적용된다 — 별도 지시 없이도 API 코드 변경 시 문서 업데이트가 포함되어야 한다.

### 문서 파일 매핑

| API 경로                                           | 문서 파일                                                      |
| -------------------------------------------------- | -------------------------------------------------------------- |
| `src/app/api/polls/**`                             | `docs/api/polls.md`                                            |
| `src/app/api/surveys/**`                           | `docs/api/surveys.md`                                          |
| `src/app/api/my/**`                                | `docs/api/my.md`                                               |
| `src/app/api/billing/**`, `src/app/api/credits/**` | `docs/api/billing.md`                                          |
| 신규 도메인 추가 시                                | `docs/api/[도메인].md` 생성 + `docs/api/README.md` 인덱스 추가 |

### 문서 업데이트 트리거 — 아래 변경이 하나라도 있으면 즉시 문서 반영

- 엔드포인트 추가 / 삭제
- Request body 필드 추가 / 삭제 / 타입 변경
- Response 구조 변경
- 에러 코드 추가 / 변경
- 인증 요구사항 변경
- 정책 연동 로직 변경 (한도, 상태 전환 규칙 등)

### 버전 업데이트 방법

문서 상단 주석의 `최종 수정` 날짜를 오늘 날짜로 갱신한다.

```
<!-- version: 1.0.0 | 최초 작성: 2026-04-07 | 최종 수정: 2026-04-07 -->
```

Breaking change(기존 필드 제거, 응답 구조 변경)는 버전을 올리고 해당 엔드포인트 설명 위에 경고를 추가한다.

```
> ⚠️ Breaking change (2026-04-07): `todayEarnings` → `todayEarned` 로 필드명 변경
```
