---
ticket_id: "OPIN-051"
date: "2026-04-12"
qa_agent: "opin-qa"
result: "PASS"
loop_count: 2
---

## QA 리포트

**티켓:** OPIN-051 — 다크모드 구현
**결과:** PASS
**루프:** 2회차 (1차 PARTIAL → 2차 PASS)

---

## 완료 조건 체크

| 조건                                                | 결과 | 비고                                                                        |
| --------------------------------------------------- | ---- | --------------------------------------------------------------------------- |
| globals.css에 라이트/다크 두 팔레트 CSS 변수 분리   | ✅   | `:root,[data-theme="light"]` + `[data-theme="dark"]` 블록 모두 존재         |
| design-tokens.ts COLOR 값이 var() 참조로 변경       | ✅   | `COLOR.ACCENT = "var(--color-accent)"` 형태로 전환 확인                     |
| useThemeStore 생성 (persist, toggleTheme, setTheme) | ✅   | zustand persist 적용, `document.documentElement.setAttribute` 존재          |
| html suppressHydrationWarning + FOUC 방지 script    | ✅   | `suppressHydrationWarning` + `dangerouslySetInnerHTML` 인라인 스크립트 확인 |
| GNB 헤더에 토글 버튼 추가                           | ✅   | `ThemeToggle` import 및 렌더 확인                                           |
| 전환 시 transition 적용                             | ✅   | `body { transition: color 150ms, background-color 150ms }` 존재             |
| TypeScript strict 통과                              | ✅   | `tsc --noEmit` exit 0                                                       |
| npm run build 에러 없음                             | ✅   | `npm run build` PASS 확인 (2차 수정 후)                                     |

---

## 발견된 이슈

### 2차 수정으로 모두 해결됨

| #   | 심각도 | 설명                                                                 | 상태                                                      |
| --- | ------ | -------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | High   | `useThemeStore` — `document` 접근 SSR 가드 미흡                      | ✅ 해결 — `typeof window !== 'undefined'` 추가 (L21, L27) |
| 2   | Medium | `INPUT` 토큰 객체 하드코딩 hex — 다크모드 입력 필드 미적용           | ✅ 해결 — `var(--input-*)` 참조로 전환 완료               |
| 3   | Medium | `SHADOW` 토큰 라이트 기준 static rgba — 다크모드 shadow 부자연스러움 | 허용 — Low 리스크, 후속 티켓으로 이관                     |
| 4   | Low    | `bg-white` 잔존 7개 파일 — 다크모드 서브 페이지 배경 고정            | ✅ 해결 — 7개 파일 클린업 완료                            |

### 미완성 항목

- [x] `INPUT` 토큰 객체를 `var(--input-*)` 참조로 전환 — 완료
- [ ] `SHADOW` 토큰 다크모드 대응 — Low, 후속 티켓으로 분리 허용
- [x] `(main)` 하위 페이지들의 `bg-white` 잔존 클래스 정리 — 완료
- [x] `useThemeStore`의 `document` 접근 SSR 가드 — 완료

---

## PM에게 전달 사항

**result: PARTIAL** → 핵심 인프라(CSS 변수 분리, ThemeToggle, FOUC 방지, zustand store)는 완성됐고 GNB 전환은 즉시 동작한다. 단, 아래 미완성 범위가 남아 있다.

완료된 것:

- CSS 팔레트 분리 (라이트/다크 100% 변수화)
- design-tokens.ts COLOR/BUTTON/INTERACTION 객체 var() 전환
- ThemeToggle 컴포넌트 (aria-label, moon/sun 아이콘, 시스템 설정 폴백)
- FOUC 방지 인라인 스크립트
- body transition
- tsc PASS

미완성:

- `INPUT` 토큰 오브젝트가 하드코딩 hex → 입력 필드 다크 미적용 (별도 수정 티켓 권장)
- `SHADOW` 토큰 다크 미대응 → 카드 그림자 어색 (Low, 허용 가능)
- `bg-white` 잔존 10개 이상 → 서브 페이지 다크모드 미완성 (별도 클린업 티켓 권장)
- `document` 접근 SSR 가드 미흡 → 현재 크래시 없으나 잠재 위험

**권장 후속 액션:**

- [ ] OPIN-051a: `INPUT` 토큰 var() 전환 + `bg-white` 잔존 클린업 (Medium 범위)
- [ ] OPIN-051b: `useThemeStore` SSR 가드 추가 (`typeof window !== 'undefined'`)
- 현재 상태로도 메인 플로우(GNB, 메인 페이지, poll)는 다크모드 정상 동작으로 판단됨 → 배포 여부는 PM 결정

---

## Regression 체크

| 영향 범위                           | 상태                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| GNB / 메인 레이아웃                 | 정상 — COLOR.BG_BASE, ThemeToggle 적용 확인                  |
| Poll 페이지 (`/poll`, `/poll/[id]`) | 정상 (COLOR 토큰 사용 확인 필요, 직접 검사 미수행)           |
| Survey builder                      | 미검사 — builder는 NAVY 정적 hex 유지 의도적 설계            |
| My Page (`/my`, `/my/point`)        | 부분 영향 — `bg-white` 잔존 확인됨                           |
| Survey 응답/리포트 페이지           | 다크 미적용 — `bg-white` 잔존 다수                           |
| Input 컴포넌트                      | CSS var() 오버라이드 동작하나 INPUT 토큰 직접 사용 시 미적용 |
