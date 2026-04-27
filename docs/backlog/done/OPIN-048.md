---
id: "OPIN-048"
title: "포인트 → 기프티콘 전환 시스템"
priority: "P1"
status: "ready"
agents:
  - owner: "opin-be"
  - co-owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-design"]
created: "2026-04-11"
updated: "2026-04-11"
sprint: "W16"
policy_refs:
  - "docs/policy/points.md#9.7"
  - "docs/policy/points.md#9.11"
code_refs:
  - "src/components/mypage/"
  - "src/app/api/"
  - "supabase/migrations/"
---

## 목적

응답자가 적립한 포인트를 기프티콘(편의점/배민 금액권)으로 전환 신청하면, OPINION이 센드비 B2B API를 통해 카카오톡으로 자동 발송한다.

현금 출금(withdrawal) 기능을 대체하며, 선불전자지급수단 발행 규제를 완전히 회피하는 구조다.
플랫폼이 마케팅 비용으로 기프티콘 비용을 전액 부담한다. 창작자 돈은 경유하지 않는다.

## 현황

- `point_ledger` 테이블 및 포인트 적립 로직 구현 완료
- `withdrawals` 테이블 존재하나 현금 출금 UI는 미노출 상태
- `profile` 테이블에 전화번호(`phone`) 컬럼 없음
- 센드비 B2B API 계약 예정 (계약 완료 전 mock 처리)

## 완료 조건 (Definition of Done)

- [ ] `gifticon_products` 테이블 마이그레이션 완료
- [ ] `gifticon_redemptions` 테이블 마이그레이션 완료
- [ ] `profile.phone` 컬럼 추가 마이그레이션 완료
- [ ] `GET /api/gifticons/products` — 상품 목록 API
- [ ] `POST /api/gifticons/redeem` — 전환 신청 API (센드비 호출 포함)
- [ ] 마이페이지 기프티콘 전환 UI 구현
- [ ] 전화번호 입력/저장 UI 구현
- [ ] 포인트 잔액 부족 시 전환 차단
- [ ] 센드비 API 미연동 시 mock 응답으로 fallback (계약 전 개발 가능)
- [ ] RLS 적용 (본인 전환 내역만 조회 가능)
- [ ] TypeScript strict 통과
- [ ] npm run build 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 레퍼런스 패턴

| 서비스     | 패턴                              | OPINION 적용 포인트          |
| ---------- | --------------------------------- | ---------------------------- |
| 오픈서베이 | 포인트 → 기프티콘/현금 전환 탭    | 마이페이지 내 전환 섹션      |
| 캐시워크   | 잔액 노출 → 상품 선택 → 즉시 발송 | 상품 카드 선택 UI            |
| 네이버페이 | 전환 전 전화번호 확인 단계        | 전화번호 미등록 시 입력 유도 |

### 핵심 UX 결정

- **전환 단위**: 상품 1개 단위 (포인트 차감 = 상품 face_value)
- **전화번호 수집 시점**: 전환 신청 시 미등록이면 입력 모달
- **발송 방식**: 센드비 → 카카오톡 자동 발송
- **상품 목록**: MVP는 직접 큐레이션 (5~8개), 추후 기프티쇼 API 연동

### 큐레이션 상품 목록 (MVP)

| 상품명              | 금액     | 브랜드   | 전환 필요 포인트 |
| ------------------- | -------- | -------- | ---------------- |
| GS25 금액권         | 1,000원  | GS25     | 1,000P           |
| CU 금액권           | 1,000원  | CU       | 1,000P           |
| 배달의민족 금액권   | 5,000원  | 배민     | 5,000P           |
| 배달의민족 금액권   | 10,000원 | 배민     | 10,000P          |
| 스타벅스 아메리카노 | 5,500원  | 스타벅스 | 5,500P           |

### UX Writing (확정 문구)

| 상황                 | 문구                                                   |
| -------------------- | ------------------------------------------------------ |
| 전환 섹션 타이틀     | "기프티콘으로 바꾸기"                                  |
| 포인트 잔액 표시     | "전환 가능 포인트 N,000P"                              |
| 전환 버튼            | "받기"                                                 |
| 전화번호 미등록 안내 | "기프티콘을 받으려면 전화번호를 입력해 주세요"         |
| 전화번호 입력 레이블 | "카카오톡에 등록된 전화번호"                           |
| 전환 완료 토스트     | "기프티콘을 카카오톡으로 보냈어요"                     |
| 포인트 부족          | "포인트가 부족해요. N,000P 이상 모으면 바꿀 수 있어요" |
| 발송 실패            | "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요" |
| 전환 내역 없음       | "아직 바꾼 기프티콘이 없어요"                          |

## 구현 힌트

### DB 스키마

```sql
-- 기프티콘 상품 목록 (플랫폼 큐레이션)
CREATE TABLE gifticon_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,           -- "배달의민족 금액권"
  brand text NOT NULL,          -- "배민"
  face_value int NOT NULL,      -- 5000 (원)
  point_cost int NOT NULL,      -- 5000 (차감 포인트)
  sendbee_product_code text,    -- 센드비 상품 코드
  is_active boolean DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- 기프티콘 전환 내역
CREATE TABLE gifticon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  product_id uuid REFERENCES gifticon_products NOT NULL,
  point_ledger_id uuid REFERENCES point_ledger,  -- 차감된 포인트 항목
  phone text NOT NULL,           -- 발송 대상 전화번호
  sendbee_order_id text,         -- 센드비 주문 ID
  status text NOT NULL DEFAULT 'pending',  -- pending | sent | failed
  sent_at timestamptz,
  failed_reason text,
  created_at timestamptz DEFAULT now()
);

-- profile 테이블에 phone 추가
ALTER TABLE profile ADD COLUMN phone text;
```

### API 엔드포인트

```
GET  /api/gifticons/products         → 활성 상품 목록
POST /api/gifticons/redeem           → 전환 신청
  body: { product_id, phone }
  - available 포인트 충분한지 검증
  - point_ledger에 withdrawn 기록
  - gifticon_redemptions insert
  - 센드비 API 호출 → 발송
  - 실패 시 포인트 롤백 (reversed)

GET  /api/gifticons/redemptions      → 내 전환 내역
```

### 센드비 API 연동 (mock 우선)

```typescript
// src/lib/sendbee.ts
export async function sendGifticon(params: {
  phone: string;
  productCode: string;
}): Promise<{ orderId: string }> {
  if (process.env.SENDBEE_API_KEY === "mock") {
    // 계약 전 mock 응답
    return { orderId: `mock-${Date.now()}` };
  }
  // 실제 센드비 API 호출
}
```

### 포인트 차감 흐름

```
전환 신청
  → available 포인트 검증 (point_cost 이상인지)
  → point_ledger insert (status: withdrawn, source_type: gifticon)
  → gifticon_redemptions insert (status: pending)
  → 센드비 API 호출
    성공: redemptions.status = sent
    실패: redemptions.status = failed
          point_ledger.status = reversed (롤백)
```

### 예외 처리

| 케이스               | 처리 방법                         |
| -------------------- | --------------------------------- |
| 포인트 부족          | 400 반환, 전환 불가 안내          |
| 전화번호 미입력      | 입력 모달 노출 후 재시도          |
| 센드비 API 실패      | 포인트 reversed 롤백, 에러 토스트 |
| 센드비 미계약        | mock 모드로 동작 (env 분기)       |
| 잘못된 전화번호 형식 | 010-XXXX-XXXX 형식 검증           |

## 공수 산정

| 작업                   | 담당    | 예상 공수  |
| ---------------------- | ------- | ---------- |
| DB 마이그레이션 (3개)  | opin-be | 1h         |
| RLS 정책 작성          | opin-be | 0.5h       |
| 상품 목록 시드 데이터  | opin-be | 0.5h       |
| API 3개 구현           | opin-be | 3h         |
| 센드비 mock 클라이언트 | opin-be | 1h         |
| 마이페이지 전환 UI     | opin-fe | 3h         |
| 전화번호 입력 모달     | opin-fe | 1h         |
| 전환 내역 리스트       | opin-fe | 1h         |
| UX Writing 적용        | opin-fe | 0.5h       |
| QA                     | opin-qa | 2h         |
| **합계**               |         | **~13.5h** |

## 정책 참고

- **points.md#9.7**: 현금 출금 대신 기프티콘 전환으로 대체. 최소 전환 포인트 = 상품 face_value (1,000P~)
- **points.md#9.11**: Survey 보상 포인트도 available 전환 후 기프티콘 전환 가능

## CS 문의 예상 지점

- "기프티콘이 카카오톡으로 안 왔어요": 전화번호 확인, 센드비 발송 상태 확인 (redemptions.status)
- "실수로 신청했어요 취소되나요": 발송 완료 후 취소 불가 — 약관 명시 필요
- "포인트가 차감됐는데 기프티콘이 없어요": failed 상태 확인 후 포인트 reversed 처리
