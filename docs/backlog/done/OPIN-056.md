---
id: "OPIN-056"
title: "지급대행 보상 구조 전환 — 기프티콘 제거 + Survey 지급 파이프라인 구축"
priority: "P1"
status: "ready"
agents:
  - owner: "opin-be"
  - co-owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-pm"]
created: "2026-04-12"
updated: "2026-04-12"
sprint: "W16"
policy_refs:
  - "docs/policy/points.md"
  - "docs/policy/survey.md"
  - "docs/policy/poll.md"
code_refs:
  - "src/app/api/gifticons/"
  - "src/components/mypage/GifticonSection.tsx"
  - "src/components/mypage/RedemptionHistory.tsx"
  - "src/components/mypage/PhoneInputModal.tsx"
  - "src/app/(main)/my/point/page.tsx"
  - "supabase/migrations/"
---

## 목적

설문 창작자가 응답자에게 보상을 지급하는 파이프라인을 구축한다.
기존 기프티콘 전환 시스템(BM 실현 불가)을 제거하고, 포인트를 Survey 추가 참여권으로만 사용하는 구조로 전환한다.
이 전환 없이는 Survey 보상 BM 자체가 성립하지 않아 서비스 수익 경로가 막힌다.

## 현황

- `gifticon_products`, `gifticon_redemptions` 테이블 존재 (신규 생성 중단 대상)
- `/api/gifticons/*` API 라우트 3개 존재
- `GifticonSection`, `RedemptionHistory`, `PhoneInputModal` 컴포넌트 존재
- `point_ledger` 상태값: `earned | pending | available | withdrawn | reversed`
- `/my/point` 페이지가 기프티콘 UI를 렌더링 중
- Survey 참여 횟수 제한 로직 미구현

## Phase 0 — MVP 범위 (이 티켓에서 구현할 것)

### Phase 0-A: 기프티콘 코드 제거 (opin-fe + opin-be)

**제거 대상:**

- `src/app/api/gifticons/products/route.ts`
- `src/app/api/gifticons/redeem/route.ts`
- `src/app/api/gifticons/redemptions/route.ts`
- `src/components/mypage/GifticonSection.tsx`
- `src/components/mypage/RedemptionHistory.tsx`
- `src/components/mypage/PhoneInputModal.tsx`
- `/my/point` 페이지에서 위 컴포넌트 import/렌더링 제거

**주의:** 테이블(`gifticon_products`, `gifticon_redemptions`)은 DROP하지 않는다. 기존 데이터 보존, 신규 생성만 중단.

### Phase 0-B: point_ledger 상태값 변경 (opin-be)

**DB 마이그레이션:**

```sql
-- point_ledger.status 체크 제약 수정
-- 기존: earned | pending | available | withdrawn | reversed
-- 신규: earned | pending | available | spent | reversed
ALTER TABLE point_ledger DROP CONSTRAINT IF EXISTS point_ledger_status_check;
ALTER TABLE point_ledger ADD CONSTRAINT point_ledger_status_check
  CHECK (status IN ('earned', 'pending', 'available', 'spent', 'reversed'));
```

**TypeScript 타입 변경:**

```typescript
// 기존
type PointStatus = "earned" | "pending" | "available" | "withdrawn" | "reversed";
// 신규
type PointStatus = "earned" | "pending" | "available" | "spent" | "reversed";
```

### Phase 0-C: Survey 참여 일 5회 제한 + 500P 차감 로직 (opin-be)

**정책:**

- Survey 참여는 기본 5회/일 무료
- 6회 이상: 참여 전 500P 차감 (available 잔액에서)
- 차감 시 `point_ledger`에 `source_type: 'survey_access'`, `status: 'spent'`, `amount: -500` 기록
- available 잔액 부족 시 참여 차단 (HTTP 402)

**API 변경 위치:** Survey 응답 제출 API (`POST /api/surveys/[id]/respond` 또는 응답 생성 로직)

**차감 트랜잭션 구조:**

```typescript
// point_ledger insert
{
  user_id,
  source_type: 'survey_access',
  source_id: surveyId,
  amount: -500,
  status: 'spent'
}
```

### Phase 0-D: reward_budgets 테이블 + 설문 보상 예산 설정 UI (opin-be + opin-fe)

**DB 마이그레이션 — 새 테이블:**

```sql
CREATE TABLE reward_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  total_amount INTEGER NOT NULL CHECK (total_amount > 0), -- 원 단위
  per_response_amount INTEGER NOT NULL CHECK (per_response_amount > 0),
  max_recipients INTEGER NOT NULL CHECK (max_recipients > 0),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'payment_pending', 'paid', 'payment_failed', 'cancelled')),
  payment_method TEXT, -- 결제 수단 (Phase 0에서는 mock)
  payment_ref TEXT,    -- PG 거래 참조 (Phase 0에서는 null)
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(survey_id) -- 설문당 1개의 예산
);

-- RLS
ALTER TABLE reward_budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator can manage own budget"
  ON reward_budgets FOR ALL
  USING (creator_id = auth.uid());

-- updated_at trigger
CREATE TRIGGER set_reward_budgets_updated_at
  BEFORE UPDATE ON reward_budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Builder UI — 보상 예산 설정 (선택 사항):**

- Survey 설정 탭 또는 Publish 플로우에 "응답자 보상 설정" 섹션 추가
- 필드: 1인당 보상금액(원), 최대 지급 인원, 총 예산(자동 계산)
- 결제 버튼 → Phase 0에서는 "예산 예약됨 (검토 중)" mock 처리 (status: `payment_pending`)
- 보상 없이 publish도 가능 (선택 필드)

**API:**

- `GET /api/surveys/[id]/reward-budget` — 예산 조회
- `POST /api/surveys/[id]/reward-budget` — 예산 생성/수정 (draft 상태만)
- `POST /api/surveys/[id]/reward-budget/pay` — 결제 시작 (Phase 0: mock, status → payment_pending)

### Phase 0-E: reward_eligibility 어드민 관리 (opin-be)

**DB 마이그레이션:**

```sql
CREATE TABLE reward_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES reward_budgets(id),
  survey_id UUID NOT NULL REFERENCES surveys(id),
  response_id UUID NOT NULL REFERENCES responses(id),
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,          -- 실수령 예정 금액 (원)
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'disqualified', 'paid', 'failed')),
  disqualify_reason TEXT,
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE reward_eligibility ENABLE ROW LEVEL SECURITY;
-- 어드민만 접근 (서비스 롤 사용)
CREATE POLICY "service role only"
  ON reward_eligibility FOR ALL
  USING (false); -- 클라이언트 직접 접근 차단, API route 경유
```

**어드민 API (내부 전용, auth 체크 필수):**

- `GET /api/admin/reward-eligibility?surveyId=` — 대상자 목록
- `POST /api/admin/reward-eligibility/confirm` — 대상 확정 (status: confirmed)
- `POST /api/admin/reward-eligibility/disqualify` — 제외 처리

### Phase 0-F: payout_batches 어드민 생성 + CSV 다운로드 (opin-be)

**DB 마이그레이션:**

```sql
CREATE TABLE payout_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES reward_budgets(id),
  survey_id UUID NOT NULL REFERENCES surveys(id),
  total_recipients INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'ready', 'requested', 'partially_paid', 'paid', 'failed', 'closed')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payout_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only"
  ON payout_batches FOR ALL
  USING (false);
```

**어드민 API:**

- `POST /api/admin/payout-batches` — 배치 생성 (confirmed 대상자 자동 포함)
- `GET /api/admin/payout-batches/[id]/csv` — CSV 다운로드 (지급 파트너 업로드용)
  - CSV 컬럼: `response_id, user_id, amount, status`

## 완료 조건 (Definition of Done)

**Phase 0-A (기프티콘 제거):**

- [ ] `/api/gifticons/*` 3개 파일 삭제
- [ ] GifticonSection, RedemptionHistory, PhoneInputModal 컴포넌트 삭제
- [ ] `/my/point` 페이지에서 기프티콘 UI 완전 제거
- [ ] 포인트 현황 (잔액, pending/available 표시)만 남긴 최소 UI 유지

**Phase 0-B (point_ledger 상태값):**

- [ ] DB 체크 제약 `withdrawn` → `spent` 변경 마이그레이션 적용
- [ ] TypeScript 타입 `PointStatus`에서 `withdrawn` 제거, `spent` 추가
- [ ] `withdrawn` 참조하는 코드 전수 검색 후 `spent`로 변경

**Phase 0-C (Survey 참여 차감):**

- [ ] Survey 응답 제출 시 당일 참여 횟수 집계 로직 구현
- [ ] 6회 이상 시 available 잔액 500P 차감 후 참여 허용
- [ ] available 잔액 부족 시 HTTP 402 + 에러 메시지 반환
- [ ] point_ledger에 `source_type: 'survey_access'`, `status: 'spent'` 기록

**Phase 0-D (reward_budgets):**

- [ ] `reward_budgets` 테이블 마이그레이션 적용 + RLS 확인
- [ ] 보상 예산 CRUD API 3개 구현
- [ ] Builder/Publish 플로우에 보상 설정 UI 추가 (선택 필드)
- [ ] Phase 0 결제는 mock (status: payment_pending)

**Phase 0-E (reward_eligibility):**

- [ ] `reward_eligibility` 테이블 마이그레이션 적용
- [ ] 어드민 API 3개 구현 (목록/확정/제외)
- [ ] 어드민 인증 체크 (미인증 시 401)

**Phase 0-F (payout_batches):**

- [ ] `payout_batches` 테이블 마이그레이션 적용
- [ ] 배치 생성 API 구현
- [ ] CSV 다운로드 API 구현 (올바른 컬럼 순서)

**공통:**

- [ ] TypeScript strict 통과 (`npx tsc --noEmit`)
- [ ] `npm run build` 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 레퍼런스 패턴

| 서비스                | 패턴                                              | OPINION 적용 포인트                           |
| --------------------- | ------------------------------------------------- | --------------------------------------------- |
| Typeform Rewards      | 설문 publish 전 보상 예산 설정 → 결제 → 응답 수집 | 동일 플로우. Phase 0에서 결제를 mock으로 처리 |
| SurveyMonkey Audience | 응답자 수 × 단가로 예산 자동 계산                 | reward_budgets의 total_amount 자동 계산 UX    |
| Toss 포인트 사용      | 포인트 차감 전 잔액/차감액 명시적 안내            | Survey 6회 진입 시 "500P가 차감돼요" 안내     |

### 핵심 UX 결정

- **포인트 사용처**: Poll 적립 포인트 → Survey 추가 참여권 전용 — 현금 전환 불가. 사용처를 단일화해 유저 혼란 최소화.
- **보상 설정 선택성**: 보상 없이도 Survey publish 가능 — 모든 설문 창작자가 보상을 제공할 수 없으므로 선택 필드로 처리.
- **Phase 0 결제 mock**: 실제 PG 연동 전이므로 "보상 예약됨 — 검토 중" 상태로 표시. 창작자에게 명확히 안내.

### UX Writing (확정 문구)

| 상황                             | 문구                                                     |
| -------------------------------- | -------------------------------------------------------- |
| Survey 6회 차감 안내 (진입 시)   | "오늘 설문 추가 참여에 500P가 차감돼요. 현재 잔액: {n}P" |
| Survey 6회 차감 안내 (버튼)      | "500P 차감하고 참여하기"                                 |
| available 포인트 부족            | "포인트가 부족해요. 폴에 참여해서 포인트를 모아보세요."  |
| 보상 예산 설정 섹션 제목         | "응답자 보상 설정"                                       |
| 보상 예산 mock 결제 완료         | "보상 예산이 예약됐어요. 검토 후 확정돼요."              |
| 포인트 페이지 (기프티콘 제거 후) | "쌓인 포인트로 설문에 더 많이 참여할 수 있어요."         |
| available 포인트 설명            | "설문 추가 참여에 사용할 수 있어요"                      |

## 구현 힌트

### 기술 스펙

**Survey 참여 횟수 집계 쿼리:**

```sql
SELECT COUNT(*) FROM responses
WHERE user_id = $1
  AND created_at >= date_trunc('day', NOW() AT TIME ZONE 'Asia/Seoul')
  AND created_at < date_trunc('day', NOW() AT TIME ZONE 'Asia/Seoul') + INTERVAL '1 day';
```

**Survey 참여 차감 트랜잭션 (atomic):**

```typescript
// 1. 당일 참여 횟수 확인
// 2. 5회 초과 시 available 잔액 확인
// 3. 부족 시 → 402 반환
// 4. 충분 시 → 응답 저장 + point_ledger spent 기록 (하나의 트랜잭션)
// Supabase에서 RPC 함수로 원자성 보장 권장
```

**CSV 생성 (payout batches):**

```typescript
// Node.js 내장 or fast-csv 없이 수동 생성
const csv = [
  "response_id,user_id,amount,status",
  ...rows.map((r) => `${r.responseId},${r.userId},${r.amount},${r.status}`),
].join("\n");
// Content-Type: text/csv
// Content-Disposition: attachment; filename="payout-batch-{id}.csv"
```

**`withdrawn` 참조 전수 검색 후 수정:**

```
# 수정 전 검색
grep -r "withdrawn" src/ supabase/
```

### 예외 처리

| 케이스                                     | 처리 방법                                      |
| ------------------------------------------ | ---------------------------------------------- |
| Survey 6회 이상 & available 0P             | HTTP 402, "포인트가 부족해요"                  |
| reward_budgets 중복 생성 (same survey_id)  | UNIQUE 제약으로 DB 레벨 차단, API에서 409 반환 |
| payout_batches 생성 시 confirmed 대상 없음 | 400 + "확정된 대상자가 없어요"                 |
| 어드민 API 미인증 접근                     | 401 반환                                       |
| point_ledger spent 기록 실패               | 응답 저장 롤백 (RPC 함수 원자성 필수)          |

## 정책 참고

- **points.md § available**: available 포인트는 Survey 추가 참여권으로만 사용 (현금 전환 불가)
- **poll.md § daily_limit**: 5회/일, 500P/일 한도 — 변경 없음
- **survey.md § participation**: 기본 5회/일 무료, 6회 이상 500P/회 차감

## CS 문의 예상 지점

- "왜 포인트를 현금으로 못 바꿔요?": 포인트는 서비스 내 Survey 참여권 전용임을 안내. `/my/point` 페이지 문구로 사전 방어.
- "설문 6번째 참여 시 포인트가 차감됐는데 설문이 닫혔어요": 참여 완료 직전 설문이 closed로 변경된 엣지 케이스. 차감된 포인트 복구 어드민 처리 필요 (reversal 기록).
- "보상 예산을 냈는데 지급이 안 됐어요": Phase 0에서 실결제 없음. "검토 중" 상태임을 안내. Phase 1(실연동) 이후 처리.
- "어드민이 나를 보상 제외했어요": disqualify_reason 필드를 CS에서 조회해 안내.

## 이벤트 로깅 포인트

| 이벤트                                      | 위치             | 속성                                                     |
| ------------------------------------------- | ---------------- | -------------------------------------------------------- |
| `gifticon_section_removed`                  | 배포 시 1회      | —                                                        |
| `survey_access_point_spent`                 | Survey 6회+ 참여 | `userId, surveyId, amount: -500, remainingBalance`       |
| `survey_access_blocked_insufficient_points` | 차단 시          | `userId, surveyId, requiredPoints: 500, availablePoints` |
| `reward_budget_created`                     | 예산 생성        | `surveyId, creatorId, totalAmount, perResponseAmount`    |
| `reward_budget_payment_mock`                | mock 결제        | `surveyId, budgetId`                                     |
| `payout_batch_created`                      | 배치 생성        | `batchId, totalRecipients, totalAmount`                  |
| `payout_csv_downloaded`                     | CSV 다운로드     | `batchId, downloadedBy`                                  |

## 구현 순서 (권장)

1. Phase 0-B: point_ledger 상태값 변경 (마이그레이션 + 타입) → 빌드 깨짐 없이 먼저 처리
2. Phase 0-A: 기프티콘 코드 제거 → 빌드 확인
3. Phase 0-C: Survey 참여 차감 로직 (RPC 함수 포함)
4. Phase 0-D: reward_budgets 마이그레이션 + API + UI
5. Phase 0-E: reward_eligibility 마이그레이션 + 어드민 API
6. Phase 0-F: payout_batches 마이그레이션 + API + CSV
