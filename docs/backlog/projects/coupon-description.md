---
project: coupon-description
updated: 2026-07-15
---

## 관련 Jira 티켓
- 없음 (Renewal 작업 — 명시적 요청 전 Jira 생성 금지)

## TODO
1. **협의/확인 대기 항목 확정**
   - `Subscription End Notice`("Your subscription will end on {endDate}.") 출처 불명 → 삭제 or 재정의 (현재 스펙에서 제외됨)
   - Apply 시 비구독자 처리 정책 (Checkout 유도 or 비활성)
   - 만료 쿠폰 목록 노출 여부
   - Coupon Card "Expires on" 만료일 레이블 카드별 표기 불일치 → 통일
   - Empty 상태 안내 문구

## 컨텍스트
- **대상 화면 3종 Description 확정** (My Page — Coupon 목록 / Already Subscribed Notice 모달 / Add Coupon 모달)
- **Apply 동작 확정**: 클릭 → 성공 시 Checkout으로 이동(쿠폰 적용 상태). 실패는 "이미 구독 중" 케이스 하나뿐 → Already Subscribed 안내 모달(문구만) 오픈. → 쿠폰 카드에 `Applied` 상태 없음(적용=Checkout 구매).
- **Add Coupon 모달 확정**: 코드 형식 클라 검사 없음(서버 검증만). Add 버튼 Empty=Disabled/Filled=활성. 성공 시 모달 닫힘+`Changes have been saved` 토스트. 실패 케이스 = invalid/already used/expired/can't be applied(인라인 에러) + 서버오류 `Something went wrong. Please try again.`(토스트).
- **절대규칙 신설**: 조건 분기 `IF/ELSE/→` 금지, `~한 경우:` 형식만. 다중 실패는 `실패 케이스:` 블록으로 분리. → `~/.claude/rules/figma-description.md` 반영 완료 + 메모리 `feedback_condition_no_if.md` 저장.
- **Figma 삽입 완료** (2026-07-15): node `6131:3016`의 Description List(`6131:3017`)에 Numbered Note 4개 삽입 완료 — ① Add Coupon Button ② Coupon Card ③ Apply Button ④ Already Subscribed 안내 모달. 협의 대기 5항목은 카드 내 `*(협의 필요)*` `*(정책 확인 필요)*` 플래그로 표시. screenshot 검증 완료.
- **범위 확인**: Add Coupon 모달(`6156:2807`)·에러 프레임(`6156:2834`, `6218:4329`)은 Description List가 없는 FEATURE형 모달 프레임 — 별도 Description 삽입 대상 아님. Already Subscribed 안내 모달은 Figma 화면 자체가 아직 그려져 있지 않음(협의 필요 플래그로 대체).

## 완료 로그
### 2026-07-15
- Figma MCP 재인증 완료
- 쿠폰 목록 화면(node `6131:2935`) Description 삽입 완료 — Numbered Note 4개, native 불릿 적용, screenshot 검증
- 잔여 협의 대기 5항목은 삭제하지 않고 Description 카드 내 플래그로 반영

### 2026-07-14
- 스크린샷 분석 → Coupon 목록/Add Coupon 모달/에러 4종 Description 초안 작성
- Apply 동작 3차 반복 수정 후 확정 (→ Checkout 이동 + Already Subscribed 모달)
- Add Coupon 모달 확정 (형식검사 없음, Disabled 조건, 성공/실패 토스트·인라인)
- 조건 분기 `~한 경우:` 절대규칙 신설 → figma-description.md + 메모리 반영
- Figma 삽입 시도 → MCP 인증 블로커로 미완 (다음 세션 이어받기)
