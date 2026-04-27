---
id: "OPIN-051"
title: "다크모드 — CSS Semantic Color 시스템 + 라이트/다크 팔레트 전환"
priority: "P2"
status: "idea"
agents:
  - owner: "opin-fe"
  - reviewer: "opin-qa"
  - consulted: ["opin-design"]
created: "2026-04-12"
updated: "2026-04-12"
sprint: "W18"
policy_refs: []
code_refs:
  - "src/app/globals.css"
  - "src/lib/design-tokens.ts"
  - "src/components/layout/Header.tsx"
  - "src/lib/stores/useThemeStore.ts (신규)"
---

## 목적

사용자가 어두운 환경에서도 눈 피로 없이 OPINION을 사용할 수 있도록 다크모드를 지원한다.
동시에 현재 하드코딩된 hex 값들을 semantic CSS 변수 시스템으로 전환하여, 테마 추가/수정 시 단일 파일만 변경하는 구조를 만든다.

비즈니스 임팩트: CSS 변수 시스템 부재로 인한 유지보수 비용 제거 + `prefers-color-scheme` 대응으로 이탈률 감소.

## 현황

- `src/app/globals.css` `@theme {}` 블록에 라이트 팔레트 hex 값 하드코딩 (~60개 변수)
- `src/lib/design-tokens.ts` `COLOR` 객체에 hex 값 직접 하드코딩 (`COLOR.ACCENT = "#3182f6"` 등)
- `[data-theme]` 또는 `prefers-color-scheme` 다크 팔레트 없음
- `useThemeStore` 없음, 토글 버튼 없음
- Tailwind v4 `@theme {}` 블록은 CSS 변수를 직접 정의하므로, `[data-theme="dark"]` 오버라이드 방식으로 확장 가능

## 완료 조건 (Definition of Done)

- [ ] `globals.css`에 라이트/다크 두 팔레트가 CSS 변수로 분리 정의됨
  - 라이트: `:root` (또는 `[data-theme="light"]`)
  - 다크: `[data-theme="dark"]`
- [ ] `src/lib/design-tokens.ts` `COLOR` 값이 hex 직접값 대신 `var(--color-*)` 참조로 변경됨
  - 단, TSX `style` prop에서 `var()` 문자열이 정상 동작하는지 확인 필요 (브라우저 처리)
  - 대안: `COLOR` 객체 유지 + 런타임 `getComputedStyle()` 헬퍼 (복잡도 상승) → 단순 방향 우선
- [ ] `src/lib/stores/useThemeStore.ts` 생성
  - `theme: 'light' | 'dark'` 상태
  - `toggleTheme()` 액션
  - `localStorage` persist (`zustand/middleware` persist 사용)
  - 초기값: `localStorage` 저장값 → 없으면 `prefers-color-scheme: dark` 감지 → 없으면 `'light'`
- [ ] `<html>` 태그에 `data-theme` attribute 동기화
  - `layout.tsx` 서버 컴포넌트에서 `suppressHydrationWarning` 추가
  - 클라이언트 `ThemeProvider` 컴포넌트 or 인라인 script로 hydration mismatch 방지
- [ ] GNB 헤더에 라이트/다크 토글 버튼 추가
  - 위치: 헤더 오른쪽 영역 (로그인 버튼 왼쪽)
  - 아이콘: 해(라이트) / 달(다크) SVG 아이콘 (lucide-react 사용)
  - `aria-label="다크모드로 전환하기"` / `"라이트모드로 전환하기"` 동적 변경
- [ ] 전환 시 색상 전환 애니메이션: `transition: color 150ms ease, background-color 150ms ease` (전역 적용)
- [ ] TypeScript strict 통과
- [ ] `npm run build` 에러 없음
- [ ] QA 시나리오 통과

## UX 리서치

### 레퍼런스 패턴

| 서비스           | 패턴                                                                                                                                              | OPINION 적용 포인트                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Toss             | `[data-theme="dark"]` HTML attribute 기반. `prefers-color-scheme` 초기 감지 후 수동 override 허용. 전환 시 전체 레이어 색상 transition 100–150ms. | 동일 방식 채택. 짧은 transition으로 깜빡임 방지.     |
| Linear           | CSS custom properties + Radix UI의 `ThemeProvider`. 다크모드에서 회색 계열 채도 낮춤 (채도 0–10%).                                                | 다크 팔레트 설계 시 채도 억제 원칙 참고.             |
| Vercel Dashboard | `next-themes` 라이브러리. `suppressHydrationWarning` + 인라인 script로 FOUC 방지.                                                                 | `next-themes` 도입 또는 수동 구현 선택 고려.         |
| GitHub           | 시스템 따르기 / 라이트 / 다크 3가지 선택. MVP는 2가지로 단순화.                                                                                   | MVP: 토글 2가지. 시스템 자동 감지는 초기값에만 적용. |

### 핵심 UX 결정

- **테마 전환 방식**: `[data-theme="dark"]` HTML attribute — 이유: CSS 변수 오버라이드가 단순, JS 없이도 동작, Tailwind v4와 호환
- **초기값 결정 순서**: localStorage → prefers-color-scheme → light — 이유: 명시적 선택 우선, 시스템 설정 존중, 기본값은 라이트
- **FOUC 방지**: `<head>`에 인라인 `<script>` 삽입으로 렌더 전 `data-theme` 설정 — 이유: `next-themes` 외부 의존성 없이 동일 효과. `suppressHydrationWarning` 필수.
- **design-tokens.ts COLOR 처리**: `var(--color-*)` 문자열로 변경 — 이유: 런타임에 CSS 변수가 해석되므로 `style={{ color: COLOR.ACCENT }}` 패턴 유지 가능. `getComputedStyle` 헬퍼 불필요.
- **전환 transition**: CSS `*` 셀렉터 대신 `body` 수준에서만 적용 — 이유: 퍼포먼스 (SVG, 캔버스 등 불필요한 요소 제외)

### UX Writing (확정 문구)

| 상황                         | 문구                                     |
| ---------------------------- | ---------------------------------------- |
| 토글 버튼 (라이트 모드일 때) | aria-label: "다크모드로 전환하기"        |
| 토글 버튼 (다크 모드일 때)   | aria-label: "라이트모드로 전환하기"      |
| 토스트 (전환 완료)           | 생략 — 시각적으로 즉각 반영되므로 불필요 |

## 구현 힌트

### 기술 스펙

**1단계: CSS 변수 구조 재편 (globals.css)**

```css
/* :root = 라이트 팔레트 (기본값) */
:root,
[data-theme="light"] {
  --color-bg-base: #ffffff;
  --color-bg-surface: #f4f7fa;
  --color-text-primary: #2d3a4a;
  --color-accent: #3182f6;
  /* ... 기존 @theme 값을 여기로 이동 */
}

/* 다크 팔레트 */
[data-theme="dark"] {
  --color-bg-base: #0f1117;
  --color-bg-surface: #1a1d27;
  --color-text-primary: #e8edf2;
  --color-accent: #4d94ff;
  /* ... Toss 다크 팔레트 참고값 */
}

/* 전환 애니메이션 */
body {
  transition:
    color 150ms ease,
    background-color 150ms ease;
}
```

**Tailwind v4 주의**: `@theme {}` 내부 변수는 Tailwind 유틸리티 클래스로 노출됨. `:root` 또는 `[data-theme]` 블록에 정의한 CSS 변수는 Tailwind 유틸리티로 자동 노출되지 않음. 따라서:

- Tailwind 유틸리티(`bg-surface`, `text-primary` 등)가 필요하면 `@theme {}` 내에서 `:root` 변수를 참조해야 함
- `@theme { --color-bg-surface: var(--color-bg-surface-raw); }` 패턴 검토
- 또는 Tailwind 유틸리티 의존 없이 `style` prop + `COLOR` 객체로 전부 커버 (현재 패턴 유지)

**2단계: design-tokens.ts COLOR 변경**

```typescript
// 변경 전
export const COLOR = {
  ACCENT: "#3182f6",
  BG_SURFACE: "#F4F7FA",
  // ...
};

// 변경 후
export const COLOR = {
  ACCENT: "var(--color-accent)",
  BG_SURFACE: "var(--color-bg-surface)",
  // ...
};
```

주의: `var()` 문자열은 `style` prop에서 동작하지만, 일부 라이브러리(canvas, SVG fill 직접 지정 등)에서는 동작하지 않을 수 있음 → 해당 케이스 예외 처리 필요.

**3단계: useThemeStore**

```typescript
// src/lib/stores/useThemeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light", // 초기값은 ThemeProvider에서 덮어씀
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        document.documentElement.setAttribute("data-theme", next);
      },
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute("data-theme", theme);
      },
    }),
    { name: "opinion-theme" }
  )
);
```

**4단계: FOUC 방지 인라인 스크립트 (layout.tsx)**

```tsx
// app/layout.tsx <head> 내부
<script
  dangerouslySetInnerHTML={{
    __html: `
    (function() {
      var stored = localStorage.getItem('opinion-theme');
      var theme = stored ? JSON.parse(stored).state?.theme : null;
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', theme);
    })();
  `,
  }}
/>
```

`<html suppressHydrationWarning>` 필수.

**5단계: 헤더 토글 버튼**

```tsx
// GNB 헤더 컴포넌트 내
import { SunIcon, MoonIcon } from 'lucide-react'
import { useThemeStore } from '@/lib/stores/useThemeStore'

const { theme, toggleTheme } = useThemeStore()

<button
  onClick={toggleTheme}
  aria-label={theme === 'light' ? '다크모드로 전환하기' : '라이트모드로 전환하기'}
  className="p-2 rounded-lg hover:bg-[var(--color-bg-surface)] transition-colors"
>
  {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
</button>
```

### 다크 팔레트 설계 기준값 (Toss 참고)

| 시맨틱 토큰              | 라이트    | 다크      |
| ------------------------ | --------- | --------- |
| `--color-bg-base`        | `#ffffff` | `#0f1117` |
| `--color-bg-surface`     | `#f4f7fa` | `#1a1d27` |
| `--color-bg-section`     | `#eef1f4` | `#22252f` |
| `--color-text-primary`   | `#2d3a4a` | `#e8edf2` |
| `--color-text-secondary` | `#4a5c6e` | `#8fa3b4` |
| `--color-text-muted`     | `#6b7d8e` | `#5a7080` |
| `--color-text-disabled`  | `#9db0bc` | `#3a4a58` |
| `--color-border-default` | `#e6e7e9` | `#2a2f3e` |
| `--color-border-input`   | `#c4c8cc` | `#363c50` |
| `--color-accent`         | `#3182f6` | `#4d94ff` |
| `--color-accent-subtle`  | `#eaf3fe` | `#1a2a4a` |
| `--color-positive`       | `#02a262` | `#00c875` |
| `--color-negative`       | `#f04438` | `#ff6b6b` |

### 예외 처리

| 케이스                                               | 처리 방법                                                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| SSR hydration mismatch                               | `<html suppressHydrationWarning>` + 인라인 script로 FOUC 방지                                      |
| `COLOR.XXX`가 `var()` 문자열인데 canvas/SVG에서 사용 | 해당 파일에서 `getComputedStyle(document.documentElement).getPropertyValue('--color-accent')` 사용 |
| `@theme {}` 내 Tailwind 유틸리티 클래스 동작 여부    | 빌드 후 `bg-surface` 등 실제 적용 확인 필수. 미동작 시 `@theme` 내에서 `var()` 참조 패턴으로 해결  |
| 다크모드에서 이미지/차트 가독성 저하                 | 이미지는 `filter: brightness(0.9)` 적용, 차트 색상은 별도 다크 팔레트 정의 (P3 범위)               |
| `localStorage` 없는 환경 (SSR)                       | try-catch로 감싸고 fallback을 `'light'`로                                                          |

## 정책 참고

- 이 기능은 policy 파일과 무관한 순수 UX/기술 기능.

## CS 문의 예상 지점

- "앱 껐다 켜면 다크모드 풀려요": localStorage persist가 정상 동작하지 않는 케이스 → 브라우저 개인정보 보호 모드 가능성. 안내 문구: "일부 브라우저 설정에서는 테마가 유지되지 않을 수 있어요."
- "다크모드인데 일부 화면이 하얗게 보여요": 특정 컴포넌트에서 hex 하드코딩이 남아있는 경우 → 구현 시 전체 파일 grep 필수 (`#ffffff`, `#2d3a4a` 등 literal hex 검색)

## 이벤트 로깅 포인트

| 이벤트         | 파라미터          | 설명                           |
| -------------- | ----------------- | ------------------------------ | --------- | ----------------- | ------------------------- |
| `theme_toggle` | `{ from: 'light'  | 'dark', to: 'light'            | 'dark' }` | 토글 버튼 클릭 시 |
| `theme_init`   | `{ theme: 'light' | 'dark', source: 'localStorage' | 'system'  | 'default' }`      | 앱 초기 로드 시 테마 결정 |

## Admin 수동 처리

없음. 완전히 클라이언트 사이드 기능.

## 구현 순서 (권장)

1. `globals.css` — CSS 변수 구조 재편 (`:root` + `[data-theme="dark"]`)
2. `design-tokens.ts` — `COLOR` 값을 `var()` 참조로 변경
3. `useThemeStore.ts` — zustand store 생성
4. `layout.tsx` — FOUC 방지 인라인 script + `suppressHydrationWarning`
5. 헤더 토글 버튼 추가
6. 전체 화면 육안 확인 (hex 하드코딩 잔존 여부)
7. QA 시나리오 실행
