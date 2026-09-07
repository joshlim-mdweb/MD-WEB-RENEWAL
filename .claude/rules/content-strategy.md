---
paths:
  - "src/app/(marketing)/**"
  - "requirements/**/*.md"
---

# Content Strategy — MD Renewal Website

적용 경로: `src/app/(marketing)/**`, `requirements/**/*.md`

레퍼런스: Apple (primary), Procreate, Cursor, Claude.ai, Unity

---

## 1. 핵심 원칙

### 정보 순서: 결과 → 이유 → 증거

사용자는 "이게 나한테 뭘 해주는가"를 먼저 본다.
기술 설명, 스펙, 수치는 그 다음이다.

```
❌ "패턴 기반 물리 시뮬레이션 엔진을 사용해 의상을 제작합니다"
✅ "실크는 흘러내리고, 데님은 버틴다." → (그 아래) 물성 파라미터 설명
```

### 밀도 원칙: 덜 쓸수록 더 읽힌다

한 섹션 = 한 아이디어.
설명이 2문장을 넘으면 쪼개거나 자른다.
Apple은 헤드라인 5단어, 서브카피 15단어 이내.

### 이미지가 먼저다

텍스트는 이미지를 설명하는 게 아니라, 이미지가 전달하지 못한 것만 보충한다.
이미지 70% : 텍스트 30% 비율 목표.

---

## 2. 페이지 구조 패턴

### 기본 순서 (Apple iPhone 기준)

```
1. Hero          — 핵심 가치 선언. 1문장. 이미지 풀스크린.
2. Authority     — 신뢰 마커. 수상, 로고, 숫자. (옵션)
3. Core Feature  — 기능 블록 × 3~5. 결과 중심.
4. Proof         — 실제 사용 사례, 인용구, 스크린샷.
5. Pipeline/CTA  — "지금 어떻게 시작하는가" 안내.
6. Footer CTA    — 최종 행동 유도.
```

### 섹션 간 전환 로직

각 섹션은 앞 섹션이 만든 질문에 답해야 한다.

```
Hero: "이게 뭐야?" →
Core Feature: "이렇게 동작해" →
Proof: "실제로 이렇게 쓰여" →
CTA: "지금 시작하면 돼"
```

사용자가 "그래서 왜 나한테 필요해?"라는 질문을 하기 전에 답이 나와야 한다.

---

## 3. Hero 패턴

### 구조

```
[풀스크린 이미지 또는 제품 결과물]
타이틀 (5단어 이내)
서브카피 (1문장, 15단어 이내)
CTA Primary  ·  CTA Secondary
```

### 헤드라인 작성 규칙

| 패턴 | 예시 | 레퍼런스 |
|------|------|------|
| 대비 선언 | "실크는 흘러내리고, 데님은 버틴다." | Apple |
| 결과 선언 | "Creation powered by simulation." | MD Features |
| 동사 나열 | "Sketch. Paint. Create." | Procreate |
| 생산성 선언 | "Built to make you extraordinarily productive." | Cursor |

- 추상 감성 금지: "더 나은 경험" "혁신적인" "강력한"
- 동사 또는 명사형으로 마무리
- 경쟁사 이름, 비교 수식어 금지

---

## 4. Feature Section 패턴

### 구조 (MD Web 기준)

```
[Main Image]  [Sub Image Overlay]
EYEBROW (ALL CAPS, 카테고리 레이블)
Headline (대비 또는 결과 선언)
Description (2문장 이내)
Feature Tag 1  ·  Feature Tag 2
Section CTA →
```

### 교대 배치 (Alternating Layout)

홀수 섹션: 이미지 좌 / 텍스트 우
짝수 섹션: 텍스트 좌 / 이미지 우

스크롤 리듬을 만들고 시각적 피로를 줄인다.

### 섹션 순서 원칙: 스토리가 흘러야 한다

섹션 목록이 아니라 **과정**이어야 한다.

```
✅ MD Features: "어떻게 만드는가 → 어떻게 움직이는가 → 어떻게 피팅되는가 → 어떻게 내보내는가"
❌ 기능 목록: MODELLING | FABRIC | RIGGING | ANIMATION | RENDERING (나열)
```

---

## 5. 이미지 전략

### Result First 원칙

이미지는 항상 **결과물**을 먼저 보여준다. UI 스크린샷이 메인이면 안 된다.

```
✅ Main: 완성된 의상 착용 결과물 → Sub: 패턴 에디터 UI (오버랩)
❌ Main: 툴 인터페이스 → Sub: 결과물
```

### 이미지 타입별 용도

| 타입 | 용도 | 배치 |
|------|------|------|
| 결과물 이미지 | 기능이 만들어내는 최종 산출물 | Main (크게) |
| UI 스크린샷 | 동작 방식 보조 설명 | Sub (오버랩, 작게) |
| 비교 이미지 | 차별점 시각화 (실크 vs 데님) | Main |
| 인물 사진 | 소셜 프루프, 인용구 카드 | Testimonial 섹션 |

### 이미지 없을 때 (에셋 미수급)

Placeholder는 비율과 역할을 명시한 회색 박스로 처리.
절대 텍스트만으로 섹션을 채우지 않는다.

---

## 6. CTA 전략

### 계층 원칙

한 섹션에 CTA가 둘 이상이면 위계를 명확히 한다.

```
Primary:   "Start Free Trial"   (흰 배경, 강조)
Secondary: "View Plans"         (아웃라인 또는 텍스트 링크)
```

### CTA 배치 패턴 (Apple 기준)

```
Hero 하단        — 가장 강한 CTA (구매 또는 시작)
Feature 섹션 하단 — 섹션별 Section CTA (더 보기 또는 솔루션 연결)
Footer           — 최종 전환 CTA (반복)
```

한 페이지에 동일한 CTA 문구가 3번 이상 반복되면 희석된다.
섹션 CTA는 그 섹션과 직접 연결된 행동으로 구체화한다.

```
✅ "See how garments are built →"  (MODELLING 섹션 하단)
❌ "Learn more →"  (모든 섹션 동일)
```

### 문구 규칙

- Primary: 동사 + 목적어. "Start Free Trial", "View Plans"
- Section CTA: "See [결과] →" 또는 페르소나 연결 "For individual designers →"
- 절대 금지: "Click here", "Submit", "확인"

---

## 7. 소셜 프루프 배치

상세 전략: `.claude/rules/social-proof.md`

### 배치 위치 원칙

```
Authority Bar  — Hero 바로 아래 (신뢰 마커, 로고)
Inline Quote   — Feature 섹션 내 보조 (기능 검증)
Testimonial    — Core Feature 이후 (사용 증거)
Award Badge    — Pricing 상단 (구매 직전 불안 해소)
```

소셜 프루프는 구매 결정 단계에 가까울수록 강하게 배치한다.

---

## 8. 페르소나별 콘텐츠 분기

동일 기능도 페르소나에 따라 설명 언어가 달라야 한다.

| 페르소나 | 언어 | 강조 |
|------|------|------|
| Individual | 결과물 품질, 포트폴리오, 시간 절약 | "혼자서도 스튜디오 수준" |
| Enterprise | 파이프라인, 확장성, 팀 운영 | "기존 워크플로우 유지" |
| Student | 실무 도구 경험, 커리어, 할인 | "지금 배우는 게 실무에서 쓰는 것" |

---

## 9. 경쟁 포지셔닝 원칙

경쟁사를 직접 언급하지 않는다.
카테고리 차이로 말한다.

```
❌ "Maya보다 쉽다"
✅ "폴리곤이 아닌, 패턴으로."

❌ "Houdini Vellum보다 정확하다"
✅ "파이프라인은 그대로."
```

상세: `requirements/brief-features-page-copy.md` 경쟁 구도 섹션 참조.

---

## 10. 체크리스트

콘텐츠 완성 전 확인:

- [ ] 헤드라인이 5단어 이내인가
- [ ] 결과가 기술 설명보다 먼저 나오는가
- [ ] 이미지가 텍스트보다 먼저 말하고 있는가
- [ ] 각 섹션이 앞 섹션의 질문에 답하고 있는가
- [ ] CTA가 섹션의 행동과 직접 연결되어 있는가
- [ ] 페르소나 언어가 맞는가 (Individual / Enterprise / Student)
- [ ] 추상 감성 카피가 없는가 ("혁신적인", "강력한", "더 나은")
