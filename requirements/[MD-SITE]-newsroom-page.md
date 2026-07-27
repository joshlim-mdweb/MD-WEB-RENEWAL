# [MD|SITE] Newsroom 페이지 개편

Epic Key: `(미정)` | 요청: Josh Lim | 출처: 2026-05-13 기획 세션 | 작성일: 2026-05-13

## 배경

현재 Newsroom 페이지(/support/news)는 카테고리 분류 없이 릴리즈 공지, 이벤트, 챌린지, 매거진, 공지사항이 혼재되어 있다. 담당자가 제목에 `[📢 Release]` 프리픽스를 수동으로 붙이는 방식으로 운영 중이다. `/support/` 경로 하위에 있어 발견성이 낮고, Featured/Pinned 아티클 기능도 없다. 리뉴얼에서는 카테고리 체계를 도입하고, URL을 `/newsroom/`으로 이동하며, 고정 아티클 기능을 추가한다.

---

## 1. Agenda

| 항목 | 내용 |
|---|---|
| TITLE | Newsroom 페이지 개편 |
| DESCRIPTION | 카테고리 분류 체계 도입, URL 이동(/newsroom/), Featured/Pinned 아티클 기능 추가. |
| 요청자 | Josh Lim |
| DUE DATE | (미정) |

---

## 2. Background

현재 Newsroom은 Support 섹션 하위(/support/news)에 위치해 독립적인 공지 채널로서의 위상이 낮다. 콘텐츠가 카테고리 없이 나열되어 원하는 정보를 찾기 어렵고, 운영자가 수동 프리픽스로 임시 분류하는 구조는 장기적으로 유지 불가능하다. 리뉴얼을 통해 URL을 `/newsroom/`으로 독립시키고, 카테고리 체계를 시스템 레벨로 구현한다.

---

## 3. Requirements

| 기능명 | Description |
|---|---|
| URL 변경 | 시스템은 URL을 `/support/news`에서 `/newsroom/`으로 변경한다. 기존 URL은 301 리다이렉트한다. |
| Hero 섹션 | 사용자는 "NEWSROOM" 타이틀과 서브타이틀을 확인한다. |
| Featured / Pinned Article | 관리자가 지정한 아티클 1개를 최상단에 고정 표시한다. |
| 카테고리 필터 | 사용자는 카테고리 탭(ALL / Release / Event / Community / Magazine / Notice)으로 아티클을 필터링한다. |
| Article Grid | 사용자는 카테고리 배지 + 제목 + 발췌문 + 날짜로 구성된 카드 목록을 확인한다. |
| 카테고리 배지 | 각 아티클 카드에 카테고리 배지(Release / Event / Community / Magazine / Notice)를 표시한다. 배지 색상은 카테고리별로 구분한다. |
| Pagination | 사용자는 페이지네이션으로 아티클 목록을 탐색한다. |

---

## 4. Scope

### 4.1 Web (marvelousdesigner.com)

- URL 변경: `/support/news` → `/newsroom/`
- Hero: 타이틀 + 서브타이틀
- Featured/Pinned Article 영역: 최상단 고정 1개
- 카테고리 필터 탭: ALL / Release / Event / Community / Magazine / Notice
- Article Grid: 카드 컴포넌트 (카테고리 배지 + 제목 + 발췌문 + 날짜)
- Pagination

### 4.2 Admin / CMS

- 아티클 카테고리 지정 기능 (Release / Event / Community / Magazine / Notice)
- Featured/Pinned 아티클 수동 지정 기능
- 수동 프리픽스(`[📢 Release]` 등) 제거 → CMS 카테고리로 대체

---

## 5. Flow

| Step | Actor | Description |
|---|---|---|
| 1 | 사용자 | `/newsroom/`에 진입한다. |
| 2 | System | Featured/Pinned 아티클 1개를 최상단에 렌더링한다. |
| 3 | System | 카테고리 ALL 기준 아티클 목록을 날짜 역순으로 표시한다. |
| 4 | 사용자 | 카테고리 탭을 선택한다. (예: Release) |
| 5 | System | 선택한 카테고리 아티클만 필터링하여 표시한다. |
| 6 | 사용자 | 아티클 카드를 클릭한다. |
| 7 | System | 아티클 상세 페이지로 이동한다. |

---

## 6. Action Item

### Web

- [ ] URL 확정: `/newsroom/` @개발팀
- [ ] 카테고리 배지 색상 5종 확정 @디자이너 (Release / Event / Community / Magazine / Notice)
- [ ] Pinned 아티클 표시 방식 결정: 핀 아이콘 vs 별도 상단 영역 @디자이너

### Admin / CMS

- [ ] 아티클 카테고리 지정 UI 추가 @개발팀
- [ ] Featured/Pinned 지정 기능 구현 @개발팀
- [ ] 기존 아티클 카테고리 일괄 마이그레이션 계획 @콘텐츠팀

### 콘텐츠

- [ ] 기존 아티클 카테고리 분류 작업 (Release/Event/Community/Magazine/Notice 중 하나) @콘텐츠팀

### 있으면 더 좋을 것 (★★★)

- [ ] 이메일 구독 CTA 강화 (현재 하단 뉴스레터 섹션 → 더 눈에 띄는 위치로)
- [ ] OG 이미지/SNS 공유 최적화
- [ ] 관련 아티클 추천 ("이 글도 읽어보세요")

---

## 7. Impact

- 콘텐츠 탐색 효율 향상 (카테고리 분류)
- 수동 프리픽스 운영 부담 제거
- URL 이동으로 SEO 및 발견성 향상
- Featured 아티클 고정으로 중요 공지 노출 강화
