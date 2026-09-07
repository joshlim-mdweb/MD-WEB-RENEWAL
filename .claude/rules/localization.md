---
applies_to: "**/*"
---

# CVF Localization — Global Rules

모든 다국어 작업에 자동 적용. `/writing` 및 `/translate` 실행 시 이 파일이 기준이 된다.

---

## 1. Placeholder & Markup 보호

아래 패턴은 절대 수정·번역·삭제·재배열 금지.

```
{{variable}}     {variable}     {0} {1}
%s  %d           ${variable}
<strong></strong>  <em></em>  <br/>  <a></a>
```

HTML 태그는 렌더링하지 않고 원문 그대로 출력.

```
✅ <strong>D-{{remainingBenefitDays}}</strong>일 남았어요.
❌ **D-3일 남았어요.**   ← 태그 소실
```

---

## 2. 승인된 용어집 (변경·번역 금지)

| 용어 (EN) | KO | ZH-CN | JA |
|---|---|---|---|
| CLO Virtual Fashion | CLO Virtual Fashion | CLO Virtual Fashion | CLO Virtual Fashion |
| CLO-SET | CLO-SET | CLO-SET | CLO-SET |
| Marvelous Designer | Marvelous Designer | Marvelous Designer | Marvelous Designer |
| Individual | Individual | Individual | Individual |
| Enterprise | Enterprise | Enterprise | Enterprise |
| Student | Student | Student | Student |
| Academic | Academic | Academic | Academic |
| Organization | Organization | Organization | Organization |
| Company ID | Company ID | Company ID | Company ID |
| License ID | License ID | License ID | License ID |
| User Pool | User Pool | User Pool | User Pool |
| Member | 멤버 | 成员 | メンバー |
| Admin | 관리자 | 管理员 | 管理者 |
| Owner | Owner | Owner | Owner |
| Subscription | 구독 | 订阅 | サブスクリプション |
| Trial | Trial | 试用 | トライアル |
| Billing date | 결제일 | 账单日期 | 請求日 |
| Payment method | 결제 수단 | 付款方式 | 支払い方法 |
| Assign | 배정 | 分配 | 割り当て |
| Unassign | 배정 해제 | 取消分配 | 割り当て解除 |
| Verification | 인증 | 验证 | 認証 |
| Workspace | Workspace | 工作区 | ワークスペース |

브랜드명·제품명은 번역 금지. 모든 언어에서 원어 유지.

### 2.1 폐지 용어

| 쓰지 않는다 | 쓴다 |
|---|---|
| Personal | **Individual** |
| Group | Organization |
| Copy | Seat |
| License ID | SW Account |
| MemberType | (폐지) |

`Personal`은 화면·문서·프레임명 어디에도 쓰지 않는다. 개인 계열을 통칭할 때도 `Individual`이다 (2026-08-11 확정).

---

## 3. 언어별 핵심 금지 표현

### EN
- "Please" 과다 사용 금지
- "Kindly" / "Simply" / "Just" / "With ease" 금지
- "You will be able to" / "Proceed to" 금지
- 미래 시제 남발 금지

### KO
- `~하시기 바랍니다` 금지 → `~해 주세요`
- `해당` 남용 금지
- `처리됩니다` 단독 금지 → 결과 명시
- `~해요` / `~돼요` 금지 → 합니다체 (2026-08-07 변경. 상세는 `ux-writing.md` §1)
- 명령조 `~하세요` / `~하십시오` 금지 → `~해 주세요`

### ZH-CN
- 번체자 혼용 금지
- 브랜드명 임의 번역 금지
- 과도한 공식체 금지

### JA
- 지나친 경어 금지
- 브랜드명 가타카나 변환 금지

---

## 4. 출력 기본 순서

| EN | KO | ZH-CN | JA |
