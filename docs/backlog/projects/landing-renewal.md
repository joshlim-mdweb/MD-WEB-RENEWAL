---
project: landing-renewal
updated: 2026-09-10
---

## 관련 Jira 티켓
- 없음 (기획 재시작 단계, 티켓 미생성)

## TODO
1. Phase A 마무리: 기획 문서 목차(안) 6섹션과 화면 목록(잠정 4프레임)은 09-08 보고됨. Josh 결정 2건 대기 — 문서 독자 범위(내부 PRD로 끝낼지 Brand Communication 팀 게시본까지 갈지), 6월 산출물 회수 여부(Figma 슬라이드 분석과 Section Description 룰북)
2. Use Cases 섹션 확정: Canvas 미결 6건 — 섹션 구조(페르소나 탭 vs 단일 그리드 대표 카드), CTA 패턴 공존(`Start as {플랜명}` vs Plan 카드 `Start {플랜명}`), Indie 겹침(카드 2와 페르소나 Indie Studio), Indie Studio CTA, Academics CTA 표기, 가격 언급 수위
3. 확정 후 Landing PRD를 기획 문서 3종 체계로 Figma에 생성 (`/figma-document` 사용). spec.md §9.5 페이지 코드 등록표에 Landing 코드 행 추가 선행
4. Features 섹션 확정: Core 기능 8종은 Format A(한 문단형)와 Format B(Title + Description) 중 형태 선택, AI 기능 5종은 Version 1(기능명 타이틀)과 Version 2(혜택 타이틀) 중 선택. 문구 초안은 아래 문구 킵 참조
5. 나머지 섹션 기획: Hero, 권위 마커(Social Proof), CTA 블록, Footer CTA

## 컨텍스트
- **2026-09-08 Josh 확정: 6월 브리핑 재개가 아니라 기획 새로 시작.** 6월 산출물은 참고만
- **Use Cases 섹션 선행 확정 중**: 페르소나 5종(Individual, Student, Enterprise, Academics, Indie Studio) × 카드 4~6장, 총 26장 문구 확정. **정본: Slack Canvas `F0C022SAKK5` "Landing Use Cases"** (구 제목 MemberType Persona Statement에서 개명 — 폐지 용어라 교체)
- CTA 패턴: `Start as {플랜명}`. 예외는 Indie Studio(`Contact Sales` — Indie는 웹 판매 제외)
- 시안 이미지의 `Sole Game Development`는 `Solo Game Development`로 정정 (sole은 오용)
- 4월 전략 문서 2건(`strategy-landing-feature.md`, `content-strategy-gnb-features.md`)은 Features와 Solutions 소속이고 스테일(Personal 표기, 구 GNB) — Landing 근거로 쓰지 않는다
- 6월 산출물(페르소나 5종, Section Description 룰북, 섹션 설계 의도)은 레포에 파일 없음 — Figma와 이 백로그 요약에만 존재
- Figma: `PeCid7uJcg0HenViaaiHUp`, Landing 페이지 node-id `168-2`, Example 1(현 사이트 스크린샷) `4839:8242`, Example 2(새 시안 7섹션) `4839:10836`, Section Description 컴포넌트 `4848:1453`
- 근거 룰: `content-strategy.md`(페이지 구조 패턴), `social-proof.md`(권위 마커와 인용 배치), `ux-writing.md` §3(마케팅 명사형), `solutions-copy.md`(페르소나 정의)
- 2025 Web Visitor Survey (n=638): 42.3% very difficult / 42.5% very easy 양극화 — 문제 정의의 근거

## 문구 킵: Features 섹션 (2026-09-10, EN 원본. KO는 형태 확정 후 번역)

### Core 기능 8종 Format A (한 문단형, 볼드 리드 + 본문)

**2D Pattern. Precision from the First Line.**
Draft, edit, and arrange patterns with cutting-table precision. Every curve, notch, and seam allowance stays exact.

**3D Garment. Sewing Happens on the Body.**
Edit, sew, and detail garments directly in 3D. Every change drapes on the avatar instantly.

**Simulation. Physics Does the Draping.**
Weight, elasticity, and friction drive every fold and wrinkle. Check fit in real time.

**Material. Silk Flows, Denim Holds.**
Set weight, stretch, and friction for each fabric. Graphics and trims move with the cloth.

**Avatar. Any Body, Any Pose.**
Adjust measurements, switch poses, and refit in seconds. Garments follow the body automatically.

**Animation. Cloth That Moves Like Cloth.**
Keyframe the motion and let simulation handle the garment, frame by frame. Cache the result for production.

**Pipeline. Your Tools, Already Connected.**
Import and export FBX, Alembic, and OBJ for Maya, Houdini, Unreal Engine, and Unity. LiveSync and scripting keep the pipeline connected.

**AI Features. Textures and Graphics, Generated in Place.**
Generate textures, graphics, and images with AI, inside the garment workflow.

### Core 기능 8종 Format B (Title + Description 1줄형)

| Title | Description |
|---|---|
| 2D Pattern | Draft, edit, and arrange patterns with cutting-table precision. |
| 3D Garment | Sew, layer, and detail garments directly on the avatar. |
| Simulation | Weight, elasticity, and friction drive every fold in real time. |
| Material | Set physical properties per fabric, with graphics and trims that move with the cloth. |
| Avatar | Adjust measurements, switch poses, and refit garments in seconds. |
| Animation | Keyframe motion, simulate garment response, and cache the result for production. |
| Pipeline | Import and export FBX, Alembic, and OBJ, with LiveSync and scripting for your DCC pipeline. |
| AI Features | Generate textures, graphics, and images without leaving your project. |

### AI 기능 5종 (설명은 두 버전 공유. 타이틀만 다름)

섹션 헤더(선택): **AI, Inside the Workflow.** Generate textures, graphics, poses, patterns, and images without leaving Marvelous Designer.

| Version 1 (기능명 타이틀) | Version 2 (혜택 타이틀) | Description (공유) |
|---|---|---|
| AI Texture Generator | Type a Texture | Describe the surface you want and generate options. Apply the one that fits as a new texture. |
| AI Graphic Generator | Graphics on the Pattern | Generate a graphic from a keyword and place it on the pattern. See the result in 3D in real time. |
| AI Pose Generator | Pose the Avatar | Create poses from a keyword or a reference image. Check fit and drape in any stance. |
| AI Pattern Generator | Skip the Blank Canvas | Turn measurement points or a flat sketch into a first pattern, ready to refine. |
| AI Image Generator | Edit with a Prompt | Upload an image and rework garment ideas in place. Iterate before you build. |

마무리 카드(선택, 양쪽 공용): **All Inside the Workflow.** Every generator works where you design: on the pattern, the garment, and the avatar. No switching tools.

### 미결 (Features 섹션)

- Core 기능 형태 선택: Format A vs Format B
- AI 타이틀 선택: Version 1(기능명) vs Version 2(혜택)
- 대소문자: 레퍼런스(macOS, Google 스타일)는 sentence case, 우리 룰은 제목 Title Case. 위 초안은 룰대로 Title Case. 레퍼런스 룩을 원하면 이 섹션만 예외 결정 필요
- Version 2 채택 시 정식 기능명 노출 위치: 카드 내 소형 레이블 또는 Manual 버튼
- AI Texture Generator 생성 범위 확인: "worn denim" 예시가 실제 지원 범위인지 (아니면 스크린샷의 paisley 예시만 사용)

## 완료 로그
### 2026-09-10
- **Features 섹션 문구 초안 작성**: Core 기능 8종(2D Pattern, 3D Garment, Simulation, Material, Avatar, Animation, Pipeline, AI Features)을 Format A(한 문단형)와 Format B(1줄형) 두 형태로, AI 기능 5종을 Version 1(기능명 타이틀)과 Version 2(혜택 타이틀) 두 버전으로 작성. 전부 이 파일 문구 킵 섹션에 보관
- 근거: Josh 제공 기능 목록(자료의 Avartar는 Avatar로 정정), AI 기능은 현행 사이트 카드 스크린샷, Material 리드와 Pipeline 툴 나열은 ux-writing.md §3.2 확정 레퍼런스 재사용

### 2026-09-08
- **Landing 기획 재시작 확정** (브리핑 재개, Figma 중심 옵션 대신). Phase A 목차안(6섹션)과 화면 설계서 잠정 목록(4프레임) 보고
- **Use Cases 카드 매트릭스 작성**: 페르소나 5종 × 4~6장, 총 26장 EN 문구 확정(검수 통과). 추천 4장 조합(Solo, VFX, Student, Enterprise) 제시
- **Slack Canvas `F0C022SAKK5` 게시**: 제목 `Landing Use Cases`로 개명, 섹션 헤더 문구와 페르소나별 표 5개, 미결 6건 블록 포함

### 2026-06-18
- 페르소나 5종 + 사용자 여정 정리 (영문)
- Landing Page 섹션별 설계 의도 작성 (Example 1: 4섹션, Example 2: 7섹션)
- Background 단락 초안 작성 — 랜딩 문제 중심으로 압축
- Section Description 룰북 작성 (Title 네이밍, Body 작성 순서, 분량 기준, 금지 항목)
- Figma 슬라이드 문서(24장) 전체 텍스트 추출 및 분석
