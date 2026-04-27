<!-- version: 1.0.0 | 최초 작성: 2026-04-10 | 최종 수정: 2026-04-10 -->

# Gifticons API

포인트 → 기프티콘 전환 시스템. 센드비 B2B API를 통해 카카오톡으로 자동 발송.

---

## GET /api/gifticons/products

활성 기프티콘 상품 목록 반환.

### 인증

Bearer token (Supabase session) 필수

### Response 200

```json
{
  "products": [
    {
      "id": "uuid",
      "name": "스타벅스 아메리카노",
      "brand": "스타벅스",
      "face_value": 5500,
      "point_cost": 5500,
      "image_url": null
    }
  ]
}
```

### 에러

| status | error           | 설명        |
| ------ | --------------- | ----------- |
| 401    | unauthenticated | 로그인 필요 |
| 500    | internal_error  | 서버 오류   |

---

## POST /api/gifticons/redeem

포인트를 차감하고 기프티콘 발송 신청.

### 인증

Bearer token (Supabase session) 필수

### Request Body

```json
{
  "product_id": "uuid",
  "phone": "010-1234-5678"
}
```

| 필드       | 타입   | 필수 | 설명                 |
| ---------- | ------ | ---- | -------------------- |
| product_id | string | Y    | gifticon_products.id |
| phone      | string | Y    | 010-XXXX-XXXX 형식   |

### 처리 흐름

```
available 포인트 검증 (point_cost 이상)
  → point_ledger INSERT (status: withdrawn, source_type: gifticon)
  → gifticon_redemptions INSERT (status: pending)
  → 센드비 API 호출
    성공: redemptions.status = sent
    실패: redemptions.status = failed
          point_ledger.status = reversed (롤백)
```

### Response 200

```json
{
  "success": true,
  "redemption_id": "uuid",
  "order_id": "mock-1234567890-abc123"
}
```

### 에러

| status | error                | 설명                                    |
| ------ | -------------------- | --------------------------------------- |
| 400    | insufficient_points  | 포인트 부족 (available + required 포함) |
| 401    | unauthenticated      | 로그인 필요                             |
| 404    | product_not_found    | 존재하지 않는 상품                      |
| 409    | product_unavailable  | 비활성 상품                             |
| 422    | missing_product_id   | product_id 누락                         |
| 422    | missing_phone        | phone 누락                              |
| 422    | invalid_phone_format | 전화번호 형식 오류 (010-XXXX-XXXX)      |
| 500    | gifticon_send_failed | 센드비 발송 실패 (포인트 자동 롤백)     |
| 500    | internal_error       | 서버 오류                               |

---

## GET /api/gifticons/redemptions

본인의 기프티콘 전환 내역 조회.

### 인증

Bearer token (Supabase session) 필수

### Response 200

```json
{
  "redemptions": [
    {
      "id": "uuid",
      "phone": "010-1234-5678",
      "status": "sent",
      "sendbee_order_id": "mock-1234567890-abc123",
      "sent_at": "2026-04-10T12:00:00Z",
      "failed_reason": null,
      "created_at": "2026-04-10T11:59:00Z",
      "product_id": "uuid",
      "gifticon_products": {
        "name": "스타벅스 아메리카노",
        "brand": "스타벅스",
        "face_value": 5500,
        "point_cost": 5500,
        "image_url": null
      }
    }
  ]
}
```

### status 값

| status  | 의미                             |
| ------- | -------------------------------- |
| pending | 센드비 호출 전 (일반적으로 순간) |
| sent    | 발송 완료                        |
| failed  | 발송 실패 (포인트 reversed)      |

### 에러

| status | error           | 설명        |
| ------ | --------------- | ----------- |
| 401    | unauthenticated | 로그인 필요 |
| 500    | internal_error  | 서버 오류   |

---

## 센드비 mock 모드

`SENDBEE_API_KEY=mock` 환경변수 설정 시 실제 API 호출 없이 mock 응답 반환.
계약 완료 후 `SENDBEE_API_KEY` (실제 키) + `SENDBEE_API_URL`을 설정하면 실 API로 전환.
