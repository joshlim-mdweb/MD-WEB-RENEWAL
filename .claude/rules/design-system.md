---
paths:
  - "src/**/*.{ts,tsx}"
---

# Design System — Index

규칙이 파일별로 분리되어 있다. 이 파일은 구조 안내만 한다.

| 규칙 파일          | 로드 경로                                           | 내용                                                                        |
| ------------------ | --------------------------------------------------- | --------------------------------------------------------------------------- |
| `ds-tokens.md`     | `src/**/*.{ts,tsx}`                                 | 색상 하드코딩 금지, semantic color, weight 결정 트리, CSS 네이밍, 버튼 말투 |
| `ds-components.md` | `src/components/ui/**`                              | Button/Badge/Input/Toggle/Dropdown/Toast/EmptyState 용도·규칙               |
| `ds-web.md`        | `src/app/(main)/**`, `src/components/mypage/**`     | TYPOGRAPHY 필수, 간격 레벨, 카드·폼 패턴, 로딩 상태                         |
| `builder.md`       | `src/components/builder/**`, `src/app/(builder)/**` | Builder 전용 — TYPOGRAPHY 금지, compact 밀도                                |
| `api.md`           | `src/app/api/**`, `supabase/**`                     | API 규칙                                                                    |

전체 규칙 원문은 각 파일 참조.
