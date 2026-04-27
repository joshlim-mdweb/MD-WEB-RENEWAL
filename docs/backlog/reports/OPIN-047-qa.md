---
ticket_id: "OPIN-047"
date: "2026-04-10"
qa_agent: "opin-qa"
result: "PARTIAL"
loop_count: 1
---

## QA 리포트

**티켓:** OPIN-047 — 마이페이지 리디자인
**결과:** PARTIAL
**루프:** 1회차

---

## 완료 조건 체크

| 조건                                                        | 결과    | 비고                                                                                                                  |
| ----------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| 비로그인 접근 시 /login redirect                            | ✅      | layout.tsx에서 auth 확인 후 redirect("/login") 처리됨                                                                 |
| 닉네임 없음 → "닉네임을 설정해 보세요" CTA                  | ✅      | ProfileNicknameEditor에서 savedValue 없을 때 해당 문구 표시                                                           |
| 출금 가능 포인트 < 10,000 → 버튼 disabled + 안내 문구       | ✅      | canWithdraw = available >= 10000, !canWithdraw && available > 0 조건부 안내 문구                                      |
| 탈퇴 시 확인 모달 거치는가                                  | ✅      | showDeleteConfirm 상태로 인라인 확인 UI 표시                                                                          |
| 탈퇴 처리: profile.status = 'deleted' 후 signOut + redirect | ✅      | AccountActions.tsx 정확히 구현됨                                                                                      |
| 모든 사용자 노출 텍스트 해요체                              | PARTIAL | point/page.tsx의 formatDate 함수가 format.ts 미사용 (별도 이슈)                                                       |
| 에러 메시지 구조 준수                                       | ✅      | showToast 메시지 모두 해요체 + 해결책 포함                                                                            |
| 버튼 텍스트 "동사 + 하기" 형태                              | PARTIAL | AccountActions "탈퇴하기" 는 초기 버튼이지만 최종 확인 버튼은 "계정 탈퇴하기" (적절함). 단 "처리 중" 로딩 텍스트 위반 |
| 다이얼로그 취소 버튼 "닫기"                                 | ✅      | AccountActions 확인 UI에서 "닫기" 사용 중                                                                             |
| empty state: 왜 비어있는지 + 어떻게 채울 수 있는지          | ✅      | point/page.tsx의 empty state 두 줄 구조 준수                                                                          |
| 하드코딩 색상 없음                                          | ✅      | 모든 파일에서 COLOR.\* 토큰 사용, 하드코딩 #hex 없음                                                                  |
| TYPOGRAPHY.STYLE.\* 사용                                    | ✅      | 전 파일 TYPOGRAPHY.STYLE.\* 스프레드 사용                                                                             |
| hover는 배경색 전환                                         | ✅      | MySettingsNav에서 INTERACTION.HOVER_BG 사용, border 변경 없음                                                         |
| TypeScript any 없음                                         | PARTIAL | history/page.tsx에서 `as { id: string; question: string }` 타입 단언 사용 (any 대신 구체 타입이나 런타임 검증 권장)   |
| /my/survey/history → /my/history redirect                   | ✅      | survey/history/page.tsx에서 redirect("/my/history") 구현됨                                                            |
| /my/history 신규 라우트 정상 작동                           | ✅      | history/page.tsx 존재하고 올바른 데이터 페치                                                                          |
| nav active 상태 정확히 표시                                 | ✅      | MySettingsNav isActive 함수 exact/prefix 모두 처리                                                                    |
| "해당 내역이 없습니다" → "없어요" 수정                      | ✅      | point/page.tsx에서 "아직 포인트 내역이 없어요" 사용                                                                   |
| "충전하기" disabled 버튼 숨김 처리                          | ✅      | point/page.tsx 주석으로 "충전하기는 미출시라 숨김 처리" 명시, 버튼 자체 없음                                          |
| 날짜 포맷 통일 (format.ts 사용)                             | PARTIAL | point/page.tsx에 로컬 formatDate 함수 존재 (format.ts의 formatShortDate 미사용)                                       |
| npm run build                                               | 미확인  | 코드 정적 리뷰 범위 — 빌드 실행 불가                                                                                  |

---

## 발견된 이슈

### 버그 (FAIL 원인)

| #   | 심각도 | 설명                                                                            | 재현 조건                                                                                                                                 |
| --- | ------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Medium | point/page.tsx에 로컬 formatDate 함수가 format.ts의 formatShortDate를 중복 구현 | /my/point 페이지 방문 시 날짜 포맷이 동일하더라도 중앙화 원칙 위반, 향후 포맷 변경 시 불일치 발생 가능                                    |
| 2   | Low    | AccountActions "처리 중" 로딩 텍스트                                            | isDeleteLoading 시 버튼 텍스트 "처리 중" — ux-writing.md 금지 표현 목록에 "처리 중입니다"와 동일 계열. "탈퇴 처리 중이에요"로 수정 권장   |
| 3   | Low    | ProfileNicknameEditor "저장 중" 로딩 텍스트                                     | isSaving 시 버튼 텍스트 "저장 중" — 해요체 미준수. "저장하는 중이에요" 또는 "저장 중이에요"로 수정 권장                                   |
| 4   | Low    | history/page.tsx 타입 단언                                                      | `as { id: string; question: string }` 형태 타입 단언이 두 곳. Supabase 응답 타입을 제대로 선언하거나 제네릭 활용 권장                     |
| 5   | Low    | 출금 가능 포인트 = 0일 때 안내 문구 없음                                        | `!canWithdraw && available > 0` 조건이므로 available === 0 (포인트 없음)인 경우 안내 문구 미표시. "참여 내역이 없을 때" 케이스 커버 안 됨 |

### 미완성 항목

- [ ] point/page.tsx: 로컬 formatDate → format.ts의 formatShortDate 교체
- [ ] AccountActions: "처리 중" → "탈퇴 처리 중이에요" UX Writing 수정
- [ ] ProfileNicknameEditor: "저장 중" → "저장하는 중이에요" 수정
- [ ] point/page.tsx: available === 0일 때도 출금 불가 안내 문구 표시

---

## PM에게 전달 사항

**result: PARTIAL** → 블로킹 버그 없음. 현재 티켓 내 수정 또는 후속 티켓 분리 권장.

- 완료된 것: 인증 가드, 탈퇴 플로우, 출금 정책, 라우팅(redirect 포함), 디자인 토큰 준수, nav active 상태, empty state 구조, 해요체 에러 메시지, "충전하기" 버튼 숨김, "해당 내역이 없습니다" 수정
- 미완성 (블로킹 아님):
  - 날짜 포맷 중앙화 (point/page.tsx 로컬 formatDate 잔존)
  - 로딩 중 텍스트 UX Writing 위반 2건 ("처리 중", "저장 중")
  - available === 0일 때 출금 불가 안내 문구 누락
  - history/page.tsx 타입 단언 개선 권장

후속 조치 권장:

- [ ] FE: point/page.tsx formatDate → formatShortDate 교체 (1줄 수정)
- [ ] FE: AccountActions "처리 중" → "탈퇴 처리 중이에요"
- [ ] FE: ProfileNicknameEditor "저장 중" → "저장하는 중이에요"
- [ ] FE: point/page.tsx available === 0 케이스 안내 문구 추가

---

## Regression 체크

| 영향 범위                                                 | 상태                                                                          |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| /my 기존 라우트 (/my, /my/point, /my/survey, /my/account) | 정상 — 기존 파일 구조 유지됨                                                  |
| /my/survey/history 구 라우트                              | 정상 — redirect로 호환성 보장                                                 |
| /my/history 신규 라우트                                   | 정상 — 파일 존재 확인                                                         |
| MySidebar 네비게이션                                      | 미확인 — worktree 범위 외 (메인 레포 MySidebar.tsx 변경 있음, 별도 확인 필요) |
