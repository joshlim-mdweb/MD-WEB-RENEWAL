---
paths:
  - "src/app/(marketing)/**"
  - "src/components/solutions/**"
---

# Design System — MD Renewal Website (Dark Theme)

홈페이지 전용. 다크 테마, Poppins 폰트. Survey 앱(라이트 테마)과 다른 시스템.

---

## 컬러 팔레트

hex 하드코딩 그대로 사용 (이 페이지는 별도 design-tokens.ts 없이 Tailwind + inline style 직접 사용).

| 용도 | HEX |
|------|-----|
| 페이지 배경 | `#19191e` |
| 카드 배경 | `#202027` |
| 토글 배경 | `#373743` |
| 섹션 라벨 / 부가 텍스트 | `#d7d7d7` |
| 기본 텍스트 | `#ffffff` |
| 보조 텍스트 | `rgba(255,255,255,0.6)` |
| 카드 테두리 (subtle) | `rgba(255,255,255,0.08)` |

---

## 폰트

**Poppins 전용.** 다른 폰트 사용 금지. `font-family: 'Poppins', sans-serif`.

| 역할 | size | weight | 적용처 |
|------|------|--------|--------|
| 페이지 타이틀 | 40px | 500 Medium | `/pricing` H1 |
| 섹션 그룹 라벨 | 24px | 400 Regular | "Individual", "Enterprise" 등 |
| 플랜 카드 타이틀 | 22px | 600 SemiBold | 플랜명 (Individual, Students…) |
| 플랜 카드 서브타이틀 | 14px | 400 Regular | 플랜 한 줄 설명 |
| 가격 금액 | 32px | 600 SemiBold | `$29` |
| 가격 기간 | 16px | 400 Regular | `/mo` `/year` |
| Feature 텍스트 | 14px | 400 Regular | 기능 체크리스트 항목 |
| "Includes:" 라벨 | 14px | 400 Regular | `color: #d7d7d7` |
| 네비 링크 | 14px | 400 Regular | 헤더 nav items |
| 버튼 텍스트 | 14px | 500 Medium | CTA 버튼 |

---

## Navbar

```tsx
// 구조: 로고(좌) + nav links(중앙) + Sign In + language selector(우)
<nav className="flex items-center justify-between px-[48px] py-[20px]">
  <Logo />
  <NavLinks />   {/* 중앙 */}
  <div className="flex items-center gap-3">
    <LanguageSelector />
    <SignInButton />  {/* outline pill */}
  </div>
</nav>
```

Sign In 버튼: `border border-white text-white rounded-[22px] px-[14px] py-[10px] text-[14px]`

---

## 버튼 (웹사이트 전용 — pill 형태)

앱 내 버튼(`ds-components.md`)과 다른 시스템. 웹사이트 마케팅 페이지에만 사용.

```tsx
// Primary (filled white)
<button className="bg-white text-[#19191e] rounded-[22px] px-[14px] py-[10px] text-[14px] font-medium">
  Start Now
</button>

// Secondary (outline white)
<button className="border border-white text-white rounded-[22px] px-[14px] py-[10px] text-[14px] font-medium">
  Contact us for Team Trial
</button>
```

- 두 버튼 모두 `rounded-[22px]` (pill) — `rounded-full` 아님
- hover: `opacity-90` 또는 `bg-white/90` (border 변경 금지)

---

## Plan Card

```
크기: 420×550px
배경: #202027
border-radius: rounded-[7px]
```

### 내부 구조 (위→아래)

```
┌─────────────────────────┐
│ 플랜명    22px SemiBold  │  ← 카드 상단
│ 서브타이틀 14px          │
│                         │
│ 가격                     │
│  $29   /mo              │  ← 32px + 16px
│                         │
│ ─────────────────────── │
│ Includes:               │  ← #d7d7d7, 14px
│  ✓ Feature 1   14px     │  ← 아이콘 16px + 텍스트, gap-[4px]
│  ✓ Feature 2            │  ← 아이템 간 gap-[12px]
│  ✓ Feature 3            │
│  ...                    │
│                         │
│ [Primary Button]        │  ← top-[444px] 고정 (카드 하단)
│ [Secondary Button]      │
└─────────────────────────┘
```

- Feature 아이템: `flex items-center gap-[4px]`
- Feature 목록: `flex flex-col gap-[12px]`
- 버튼 영역: `absolute top-[444px]` 또는 카드 내 `mt-auto` flex 구조

### 추천 플랜 강조 (Highlighted Card)
- border: `1px solid rgba(255,255,255,0.3)` 또는 별도 강조 테두리
- 배경 약간 밝게 또는 badge 추가

---

## Monthly/Annual Toggle

```tsx
// 컨테이너
<div className="relative bg-[#373743] rounded-[19px] h-[32px] w-[89px] flex items-center p-[3px]">
  {/* 슬라이딩 indicator */}
  <div className="absolute bg-white rounded-full h-[26px] transition-transform duration-200"
       style={{ width: '43px', transform: isAnnual ? 'translateX(43px)' : 'translateX(0)' }} />
  <span className="relative z-10 text-[12px] flex-1 text-center">Mo</span>
  <span className="relative z-10 text-[12px] flex-1 text-center">Yr</span>
</div>
```

---

## 섹션 그룹 라벨

플랜 카드 그룹 위에 위치하는 섹션 구분 텍스트.

```tsx
<p className="text-[24px] text-[#d7d7d7] font-normal font-poppins">
  Individual
</p>
```

---

## Academics 수량 입력

좌석 수 입력 필드 (Academics/Enterprise 플랜 카드에 사용).

```tsx
<div className="flex items-center border border-white/30 rounded-[7px] px-3 py-2">
  <input type="number" className="bg-transparent text-white w-16 text-center" />
  <div className="flex flex-col ml-2">
    <button>▲</button>
    <button>▼</button>
  </div>
</div>
```

---

## 페이지 레이아웃

```tsx
// 전체 페이지 배경
<div style={{ backgroundColor: '#19191e', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
  <Navbar />
  <main className="max-w-[1440px] mx-auto px-[100px] py-[80px]">
    {/* 섹션 간 수직 간격: 80~100px */}
  </main>
</div>
```

---

## 이 파일의 적용 범위

`src/app/(marketing)/**`, `src/components/solutions/**`에서만 적용.
Survey 앱(`src/app/(main)/**`)에는 `ds-web.md` 시스템을 사용. 혼용 금지.

> Next.js 라우트 그룹명은 `(marketing)`이지만, 이 페이지들은 MD 홈페이지다.
