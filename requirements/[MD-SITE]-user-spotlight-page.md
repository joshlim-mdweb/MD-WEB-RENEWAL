# [MD|SITE] User Spotlight 페이지 개편

Epic Key: `(미정)` | 요청: Josh Lim | 출처: 2026-05-13 기획 세션 | 작성일: 2026-05-13

## 배경

현재 User Spotlight 페이지(/learn/userspotlight)는 Featured article 중복 렌더링 버그, 소프트웨어 태그와 도메인 태그의 혼재, 리뉴얼 톤과 맞지 않는 Hero 텍스트("FIND OUT HOW WE MAKE A DIFFERENCE")로 인해 품질이 낮다. 리뉴얼을 통해 아티스트 인터뷰와 프로젝트 쇼케이스를 명확한 필터 체계와 함께 제공하고, Hero 카피를 브랜드 톤에 맞게 개선한다.

---

## 1. Agenda

| 항목 | 내용 |
|---|---|
| TITLE | User Spotlight 페이지 개편 |
| DESCRIPTION | Hero 텍스트 개선, 태그 체계 정리(도메인 1차/소프트웨어 2차), Featured article 버그 수정, 썸네일 비율 통일. |
| 요청자 | Josh Lim |
| DUE DATE | (미정) |

---

## 2. Background

User Spotlight는 MD 유저의 실제 작업물과 워크플로우를 소개해 커뮤니티 신뢰도를 높이고 학습 동기를 부여하는 페이지다. 현재 Featured article이 목록에 중복 렌더링되는 버그가 있고, 소프트웨어 태그(Simulation, Substance, Blender...)와 도메인 태그(Game, Animation, VFX...)가 같은 레벨로 혼재되어 필터 체계가 불명확하다. 리뉴얼에서는 태그를 도메인(1차) + 소프트웨어(2차)로 분리하고, 썸네일 비율을 통일하며, copywriting.md 규칙에 맞는 Hero 카피를 적용한다.

---

## 3. Requirements

| 기능명 | Description |
|---|---|
| Hero 개선 | 시스템은 Hero 텍스트를 리뉴얼 카피 규칙(명사형 종결)에 맞게 변경한다. |
| Featured Article | 사용자는 최신 또는 에디터픽 아티클 1개를 대형 카드 형태로 최상단에서 확인한다. Featured article은 하단 목록에 중복 표시하지 않는다. |
| 도메인 필터 (1차) | 사용자는 도메인 탭(ALL / Game / Animation / VFX / Fashion / MotionGraphic / Entertainment)으로 아티클을 필터링한다. |
| 소프트웨어 필터 (2차) | 사용자는 소프트웨어 태그(Blender / Substance / Cinema4D / 기타)로 추가 필터링한다. 선택 시 즉시 적용한다. |
| Article Grid | 사용자는 썸네일 + 도메인 태그 + 제목 + 발췌문 + 날짜 + Read More로 구성된 카드 목록을 확인한다. |
| 썸네일 비율 통일 | 시스템은 모든 아티클 카드 썸네일을 동일 비율(16:9 또는 3:2 — 디자이너 결정)로 표시한다. |
| 썸네일 없는 경우 | 썸네일 이미지가 없으면 대체 이미지(플레이스홀더 또는 MD 브랜드 이미지)를 표시한다. |
| Pagination / Load More | 사용자는 페이지네이션 또는 Load More 버튼으로 추가 아티클을 로드한다. 방식은 디자이너 결정. |

---

## 4. Scope

### 4.1 Web (marvelousdesigner.com)

- Hero 카피 변경 (명사형 종결, copywriting.md 적용)
- Featured Article 컴포넌트: 대형 카드, 하단 목록 중복 제거
- 필터 바: 도메인(1차 탭) + 소프트웨어(2차 드롭다운 또는 태그 — 디자이너 결정)
- Article Grid: 카드 컴포넌트 통일, 썸네일 비율 고정
- 썸네일 없을 때 대체 이미지 처리

### 4.2 Admin / CMS

- 에디터픽 지정 기능: Featured article 수동 지정 (논의 필요)
- 도메인 태그 / 소프트웨어 태그 관리 (기존 유지)

---

## 5. Flow

| Step | Actor | Description |
|---|---|---|
| 1 | 사용자 | `/learn/userspotlight`에 진입한다. |
| 2 | System | Featured article 1개를 대형 카드로 렌더링한다. Featured article은 하단 그리드에 제외한다. |
| 3 | 사용자 | 도메인 필터 탭에서 카테고리를 선택한다. (기본: ALL) |
| 4 | System | 선택한 도메인에 해당하는 아티클만 그리드에 표시한다. |
| 5 | 사용자 | 소프트웨어 태그를 추가로 선택한다. |
| 6 | System | 도메인 + 소프트웨어 조건에 맞는 아티클을 표시한다. |
| 7 | 사용자 | 카드에서 Read More를 클릭한다. |
| 8 | System | 아티클 상세 페이지로 이동한다. |

---

## 6. Action Item

### Web

- [ ] Hero 카피 확정 @PM (copywriting.md 명사형 종결 규칙 적용)
- [ ] Featured article 로직 확정: 최신 1개 자동 노출 vs 에디터픽 수동 지정 @PM
- [ ] 필터 탭 UX 결정: 클릭 즉시 필터 vs 적용 버튼 @디자이너
- [ ] 소프트웨어 필터 형태 결정: 드롭다운 vs 인라인 태그 버튼 @디자이너
- [ ] 썸네일 비율 확정: 16:9 vs 3:2 @디자이너
- [ ] Featured article 카드 vs 일반 카드 구분 스펙 @디자이너
- [ ] Pagination vs Load More 결정 @디자이너

### 버그 수정

- [ ] Featured article 중복 렌더링 버그 수정 (현재 Featured 아티클이 하단 목록에도 중복 표시됨)

### 있으면 더 좋을 것 (★★)

- [ ] 에디터픽 큐레이션 섹션 ("이달의 추천")
- [ ] 아티스트 프로필 연결 (ArtStation / 개인 사이트 링크)
- [ ] 관련 아티클 추천 ("이 글도 읽어보세요")
- [ ] OG 이미지/SNS 공유 최적화

---

## 7. Impact

- 아티클 탐색 효율 향상 (명확한 도메인/소프트웨어 필터)
- Featured article 중복 버그 해소 → 신뢰도 향상
- 리뉴얼 브랜드 톤 통일
