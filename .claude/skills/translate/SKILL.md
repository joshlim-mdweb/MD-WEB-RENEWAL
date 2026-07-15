---
name: translate
description: "원문 텍스트를 4개 언어(EN·KO·ZH-CN·JA)로 변환한다. Placeholder 보호, 소스 개선, 용어 일관성 포함."
user_invocable: true
---

# /translate — 다국어 변환 Skill

원문이 있고 다국어 버전이 필요할 때 사용. 처음부터 문구를 만들 때는 `/writing` 사용.

---

## 호출 방식

```
/translate [원문]
/translate [원문] [언어 범위]
```

언어 범위 미지정 시 기본: **EN · KO · ZH-CN · JA** 전체 출력.

예시:
```
/translate "Changes saved successfully."
/translate "구독이 취소됐어요." EN ZH-CN
/translate "D-{{remainingBenefitDays}}일 남았어요." 전체
```

---

## 실행 순서

### Step 1 — 소스 분석

원문을 번역 전에 먼저 검토한다.

체크 항목:
- [ ] 의미가 모호한가?
- [ ] 주어·행동·결과가 명확한가?
- [ ] 개발자 표현이 섞여 있는가? (`error occurred`, `request failed`)
- [ ] Placeholder/Markup이 포함돼 있는가?
- [ ] 용어집 외 표현이 있는가?

소스가 약하면 → 개선 후 번역. 해석 방향이 크게 바뀔 때만 상단에 메모.

### Step 2 — Placeholder 추출 및 보호

원문에서 아래 패턴을 추출하고 번역 중 보호한다.

```
{{variable}}     {variable}     {0} {1}
%s  %d           ${variable}
<strong></strong>  <em></em>  <br/>  <a></a>
```

번역 후 원문과 Placeholder 위치·개수·형태가 동일한지 확인.

### Step 3 — 번역 실행

언어별로 "처음부터 그 언어로 작성했다면"의 표현을 목표로 번역.
직역 금지. 의도·상태·행동·결과를 옮긴다.

### Step 4 — 출력

---

## 출력 형식

### 기본 (단일 문구)

```
| | EN | KO | ZH-CN | JA |
|---|---|---|---|---|
| | ... | ... | ... | ... |
```

### 복수 항목 (버튼·에러 등 세트)

```
| 항목 | EN | KO | ZH-CN | JA |
|---|---|---|---|---|
| 버튼 | ... | ... | ... | ... |
| 에러 | ... | ... | ... | ... |
| 성공 | ... | ... | ... | ... |
```

### Placeholder 포함 시

태그는 렌더링하지 않고 원문 그대로 유지:

```
| | EN | KO | ZH-CN | JA |
|---|---|---|---|---|
| | <strong>D-{{remainingBenefitDays}}</strong> days left | <strong>D-{{remainingBenefitDays}}</strong>일 남았어요. | 还剩 <strong>D-{{remainingBenefitDays}}</strong> 天 | <strong>D-{{remainingBenefitDays}}</strong>日残っています |
```

---

## 언어별 번역 기준

### EN
- Source가 KO이면 → 직역하지 않고 자연스러운 EN SaaS 표현으로
- Present tense, active voice, sentence case
- "Something went wrong. Try again." 스타일
- "Please" 최소화

### KO
- Source가 EN이면 → 해요체로 자연스럽게
- `~해요` / `~돼요` / `~이에요` 고정
- `~합니다` / `~됩니다` 금지
- 버튼 레이블: `동사 + 하기`
- 불필요한 주어 생략

### ZH-CN
- 간체자 사용
- 자연스러운 SaaS 표현
- 번체자 혼용 금지
- 브랜드명 번역 금지
- 불필요한 주어 생략 가능

### JA
- です・ます체 기본
- 버튼 레이블: 명사 또는 짧은 동사구
- 경어 과다 금지
- 브랜드명 가타카나 변환 금지

---

## 용어 충돌 감지

번역 중 두 가지 다른 소스 표현이 같은 의미로 보이면 → 상단에 플래그 표기 후 번역 진행.

```
⚠️ 용어 충돌: "Cancel"과 "Stop"이 같은 개념으로 보입니다. 
   "Cancel"로 통일했습니다. 확인 후 계속 사용해 주세요.
```

---

## 언어 범위 조정

요청에 따라 출력 언어 축소 가능:

```
/translate "..." KO만
/translate "..." EN KO
/translate "..." ZH-CN JA
```

기본값: EN · KO · ZH-CN · JA 전체
