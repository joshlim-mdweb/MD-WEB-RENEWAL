---
paths:
  - "src/app/(main)/**"
  - "src/components/mypage/**"
---

# Design System — Web Service Rules

웹 서비스 페이지·마이페이지 컴포넌트 작업 시 로드.

## Typography

`TYPOGRAPHY.STYLE.*` 스프레드 **필수**.

```tsx
// ✅
style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}

// ❌ Builder 패턴을 Web에 쓰지 않는다
className="text-sm" style={{ color: COLOR.TEXT_PRIMARY }}
```

| 토큰               | 사용처                    |
| ------------------ | ------------------------- |
| `DISPLAY` 30px/700 | 포인트 잔액, 히어로 숫자  |
| `H1` 26px/700      | 페이지 제목               |
| `H2` 22px/700      | 섹션 헤딩                 |
| `H3` 20px/600      | 카드 헤딩, 모달 제목      |
| `TITLE_1` 17px/600 | 네비게이션, 콘텐츠 타이틀 |
| `TITLE_2` 15px/600 | 섹션 레이블, 서브타이틀   |
| `BODY_1` 15px/400  | 주요 본문                 |
| `BODY_2` 13px/400  | 보조 설명, 메타           |
| `LABEL_1` 13px/500 | 버튼, 배지, UI 컨트롤     |
| `LABEL_2` 11px/500 | 캡션, 힌트, 타임스탬프    |

## 간격 레벨

| 레벨             | 값                        | 토큰           |
| ---------------- | ------------------------- | -------------- |
| 페이지 좌우 여백 | 24px (웹) / 16px (모바일) | `SPACING[6/4]` |
| 섹션 간 gap      | 32px                      | `SPACING[8]`   |
| 카드 내부 패딩   | 20px                      | `SPACING[5]`   |
| 카드 간 gap      | 12–16px                   | `SPACING[3/4]` |
| 폼 필드 간 gap   | 16px                      | `SPACING[4]`   |
| 레이블 → 인풋    | 8px                       | `SPACING[2]`   |
| 아이콘 → 텍스트  | 6px                       | —              |

## 카드 패턴

```tsx
<div
  className="card_wrap"
  style={{
    backgroundColor: COLOR.BG_BASE,
    border: `1px solid ${COLOR.BORDER_DEFAULT}`,
    borderRadius: RADIUS.XL, // 16px
    padding: "20px",
    boxShadow: SHADOW.CARD,
  }}
/>
```

## 폼 레이아웃

```
레이블 (LABEL_1 / TITLE_2)
  ↓ 8px
인풋 필드
  ↓ 4px
헬퍼 텍스트 / 에러 메시지 (LABEL_2)
  ↓ 16px
다음 레이블
```

## 로딩 상태

- 데이터 로딩 → Skeleton (형태 유지)
- 액션 로딩 → Button `loading` prop
- 페이지 전환 → `loading.tsx` Skeleton (Next.js Suspense)
- 전체 화면 스피너 단독 사용 금지

## 텍스트 오버플로우

| 대상      | 처리                        |
| --------- | --------------------------- |
| 카드 제목 | 2줄 line-clamp              |
| 배지·칩   | `whiteSpace: "nowrap"` 강제 |
| 테이블 셀 | 1줄 truncate + tooltip      |

## 안내 배너 (Info Banner)

정책·사용처 설명 등 상단 고정 안내 문구에 사용. 닫기 없음.

```tsx
// ✅ 정보 배너 (info)
<div
  className="info_banner_wrap"
  style={{
    backgroundColor: COLOR.ACCENT_BG,
    border: `1px solid ${COLOR.ACCENT_LIGHT}`,
    borderRadius: RADIUS.MD,  // 12px
    padding: "12px 16px",
  }}
>
  <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.ACCENT }}>안내 문구</p>
</div>

// ✅ 경고 배너 (warning/danger)
<div
  className="danger_banner_wrap"
  style={{
    backgroundColor: COLOR.NEGATIVE_BG,
    border: `1px solid ${COLOR.NEGATIVE}`,
    borderRadius: RADIUS.MD,
    padding: "12px 16px",
  }}
>
  <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.NEGATIVE }}>경고 문구</p>
</div>

// ❌ 중립 배너 — BG_SURFACE + BORDER_DEFAULT (안내 배너에 사용 금지)
<div style={{ backgroundColor: COLOR.BG_SURFACE, border: `1px solid ${COLOR.BORDER_DEFAULT}` }}>
```

| 종류 | `backgroundColor`   | `border`                       | 텍스트 색상      |
| ---- | ------------------- | ------------------------------ | ---------------- |
| 정보 | `COLOR.ACCENT_BG`   | `1px solid COLOR.ACCENT_LIGHT` | `COLOR.ACCENT`   |
| 경고 | `COLOR.NEGATIVE_BG` | `1px solid COLOR.NEGATIVE`     | `COLOR.NEGATIVE` |

공통: `padding: "12px 16px"` · `TYPOGRAPHY.STYLE.BODY_2`

### borderRadius 선택 기준

| 토큰        | 값   | 언제                                      |
| ----------- | ---- | ----------------------------------------- |
| `RADIUS.SM` | 8px  | 카드·테이블 내부 인라인 배너, 뱃지형 안내 |
| `RADIUS.MD` | 12px | 섹션 상단 독립 배너 (기본값)              |

- 다크모드: `ACCENT_BG = #1a2a4a` (네이비) 자동 대응
- Tailwind `rounded-xl` 혼용 금지 — `borderRadius: RADIUS.MD` inline style만 사용

## 반응형

- Breakpoint: `768px` (mobile/desktop 2단계만)
- 모바일 우선 (설문 응답 페이지)
