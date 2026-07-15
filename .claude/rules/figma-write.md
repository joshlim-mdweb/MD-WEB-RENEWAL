# Figma 작성 규칙 이탈 방지 — Pre-flight 체크리스트

Description / Annotation 작성 및 Figma 삽입 전 전체에 적용.
예외 없음. 이탈 발생 시 이 파일에 케이스를 추가한다.

---

## 최우선 원칙

**이 파일에 정의된 규칙 외로 자의적으로 이탈하지 않는다.**
규칙에 없는 상황을 만나거나, 규칙을 어겨야 할 이유가 생기면 → **반드시 사용자와 먼저 논의한다.**
논의 없이 판단하고 진행하는 것 금지.

---

## 작성 전 포맷 선택

```
Q1. 인터랙션 플로우 중심인가? (로그인·회원가입·플로우 다이어그램)
    YES → Format A
    NO  → Format B (기본값)

Q2. MemberType·구독 상태별 분기가 있는가?
    YES → Format B (CASE VIEW 패턴)
    NO  → Format B (일반)
```

**Format B가 거의 모든 경우에 기본값이다.** Format A는 "플로우"가 아니라 "단계가 있는 플로우"에만 쓴다.

---

## 절대 금지 패턴 5개 (가장 자주 깨진다)

### 금지 패턴 1 — 성공 후 분기를 `클릭 시:` 하위에 직접 나열

```
❌ 금지:
- 클릭 시: [결과]에 따라 분기
  - 조건 A: [화면 A]로 이동
  - 조건 B: [화면 B]로 이동

✅ 올바른 형식:
- 클릭 시: [동작]
  - 성공: 진입 경로에 따라 분기 (비즈니스 로직 참조)
  - 실패: [에러 처리]
- 비즈니스 로직:
  - IF [조건 A] → [화면 A]로 이동
  - IF [조건 B] → [화면 B]로 이동
  - ELSE → [화면 C]로 이동
```

### 금지 패턴 2 — 에러/유효성 동작을 자유 문장으로 서술

```
❌ 금지:
- 입력값이 있을 경우 유효성 검사 및 오류 문구 노출
- 형식 오류 시 버튼 비활성화

✅ 올바른 형식:
- 상태:
  - Default: 빈 입력창
  - Filled: 입력값 표시
  - Error: "이메일 형식을 다시 확인해 주세요." 인라인 에러 표시
- 입력값이 있을 때: 이메일 형식 검사
  - 유효: 통과
  - 무효: Error 상태 전환 + [버튼명] 비활성화
```

### 금지 패턴 3 — 미완성 문장·메모 혼입

```
❌ 금지:
- 필수 항목 작성해
- 여기는 추후 확인 필요
- (수정 예정)

✅ 올바른 형식:
- *(개발 확인 필요)*
- *(정책 확인 필요)*
- *(협의 필요)*
```

### 금지 패턴 4 — 컴포넌트를 불릿으로 나열

→ Case D8 참조. 독립 UI 요소는 반드시 Numbered Note로 분리.

### 금지 패턴 5 — Header Note에 불릿 추가

→ Case D2 참조. Header Note = `**[화면명]**` 한 줄만.

---

## Description 작성 케이스

### Case D1 — 상태를 "Default/Filled/Error 상태"로 압축 금지

**상황**: 상태가 여러 개일 때 압축 요약하려는 충동

**규칙**:
- 각 상태별로 실제 화면에 표시될 문자열을 따옴표로 명시
- Loading / Empty / Error는 API 연동 컴포넌트에 **항상** 필수 작성

```
❌ 금지:
- 상태: Default/Filled/Error 상태

✅ 올바른 형식:
- 상태:
  - Default: "파일을 첨부하세요." placeholder 표시
  - Filled: 업로드된 파일명 표시
  - Error: "지원하지 않는 파일 형식이에요." 인라인 에러 표시
```

### Case D2 — Header Note 불릿 추가 금지 ★ (가장 자주 깨진다)

**상황**: Header Note에 컨텍스트·접근 조건·COMMON 참조 등 불릿을 추가하려 할 때

**규칙**: Header Note는 `**[섹션명]**` 한 줄만. 불릿 절대 금지. 예외 없음.

```
❌ 금지:
**[Account]**
- 계정 정보 확인 화면
- 로그인 필요

❌ 금지 (COMMON 참조도):
**[Account]**
- GNB / SNB → COMMON 참조

❌ 금지 (CASE VIEW도):
**[Danger Zone]**
- MemberType별 노출 항목 상이

✅ 올바른 형식:
**[Account]**

**① Page Context**
- 로그인 필수

**② GNB**
→ COMMON 참조
```

**왜 반복되는가**: `figma-description.md`의 이전 템플릿에 불릿이 포함돼 있어서 충돌했음. 현재는 수정 완료 — Header Note = 한 줄만.

### Case D3 — 상태 순서는 라이프사이클 순서 고정

```
Active → Trial → Pause Scheduled → Paused → Cancel Scheduled → Cancelled → Expired
```

임의 순서(빈도순, 알파벳순) 금지.

### Case D4 — Sub-bullet 1단만 허용

```
❌ 금지 (2단 이상):
- 클릭 시:
  - 성공 시
    - 토스트 표시    ← 2단 중첩

✅ 올바른 형식:
- 클릭 시:
  - 성공: 토스트 표시
  - 실패: 에러 표시
```

### Case D5 — COMMON 참조는 반복 기술 금지

GNB / SNB 등 반복 요소는 COMMON 섹션에서 한 번만 정의.
개별 화면에서는 `→ COMMON 참조` 한 줄로 대체.

같은 요소를 두 번 이상 전체 기술하면 이탈.

### Case D6 — CASE VIEW 케이스 레이블 축약 금지

```
❌ 금지:
- 조건부 노출:
  - Indv / Std: 표시

✅ 올바른 형식:
- 조건부 노출:
  - Individual / Student: 표시
  - Company ID (Integrated): 표시
  - Company ID (Not Integrated): 미표시
```

MemberType 전체 명칭 사용. 약어 금지.

### Case D7 — 제목은 명사형, 동사 금지

```
❌ 금지: **① [비밀번호 변경하기]** / **① [구독을 취소하는 버튼]**
✅ 올바른: **① [비밀번호 변경]** / **① [구독 취소 버튼]**
```

### Case D8 — 컴포넌트를 불릿으로 나열 금지 ★ (신규)

**상황**: 화면 내 컴포넌트를 Numbered Note가 아닌 불릿 항목으로 나열할 때

**규칙**: 화면 내 독립 UI 요소는 각각 별도의 **① Numbered Note**로 분리한다. 불릿으로 나열 금지.

```
❌ 금지:
**① License Information Card**
- Plan Badge: 구독 상태 배지
- CTA Button: 구매 버튼
- Billing Info: 결제 정보 표시

✅ 올바른 형식:
**① Plan Badge**
- 구독 상태 배지
- 상태:
  - Active: ...

**② License Information Card**
- Plan Name, Expiry Date 표시

**③ CTA Button**
- 클릭 시: Checkout으로 이동
```

**빠른 판별**: L2 불릿에 `요소명: 설명` 패턴이 보이면 이탈 신호.
→ `figma-description.md` 섹션 2 (Q1~Q3 판단 기준)으로 L1 분리 여부 최종 결정.

---

## Annotation 작성 케이스

### Case A1 — Annotation에 CSS/디자인 스펙 혼입 금지

```
❌ 금지:
[카드]
- border: 1px solid #D1D1D1, radius: 8px
- padding: 12px 16px

✅ 올바른 형식:
[카드]
- 선택됨: border.strong (진한 테두리)로 강조
```

px, hex, font-size, CSS 값 전부 금지.

### Case A2 — STRUCTURE vs FEATURE 형식 혼용 금지

| 섹션 | 형식 | 버튼 기술 방식 |
|---|---|---|
| STRUCTURE | `[요소명]\n- 의도\n- 상태: 호버·클릭 필수` | 호버 + 클릭 둘 다 명시 |
| FEATURE | `→ [버튼명] 클릭 시 [결과]` | 결과만, 의도 설명 없음 |
| FEATURE end state | annotation 없음 | 결과 상태 프레임은 annotation 달지 않음 |

### Case A3 — STRUCTURE clone 후 annotation 반드시 삭제

STRUCTURE 프레임을 clone해서 FEATURE 프레임 만들 때, **clone 직후 즉시** clearAnnotations 실행.

```js
const ANNOTATABLE_TYPES = new Set([
  'FRAME','COMPONENT','INSTANCE','TEXT','RECTANGLE',
  'ELLIPSE','VECTOR','LINE','POLYGON','STAR','GROUP','BOOLEAN_OPERATION'
]);

function clearAnnotations(node) {
  if (node.type !== 'SECTION' && ANNOTATABLE_TYPES.has(node.type)) {
    try {
      if (node.annotations && node.annotations.length > 0) node.annotations = [];
    } catch(e) {}
  }
  if ('children' in node) node.children.forEach(c => clearAnnotations(c));
}

// clone 직후 — 절대 건너뛰지 않는다
clearAnnotations(clonedFrame);
```

---

## Figma 삽입 케이스

### Case F1 — Description 삽입 시 native 불릿 반드시 적용

`-` 하이픈을 plain text로 넣으면 화면에 하이픈이 그대로 노출됨.

```js
// 반드시 이 패턴으로 삽입
function applyBullets(node) {
  const parsed = node.characters.split('\n').map(line => {
    if (line.startsWith('  - ')) return { text: line.slice(4), level: 2 };
    if (line.startsWith('- '))   return { text: line.slice(2), level: 1 };
    return { text: line, level: 0 };
  });
  node.textAutoResize = 'HEIGHT';
  node.characters = parsed.map(l => l.text).join('\n');
  let pos = 0;
  for (const line of parsed) {
    const end = pos + line.text.length;
    if (line.level > 0 && line.text.length > 0) {
      node.setRangeListOptions(pos, end, { type: 'UNORDERED' });
      if (line.level === 2) node.setRangeIndentation(pos, end, 2);
    }
    pos = end + 1;
  }
}
```

### Case F2 — Description List 삽입 후 간격 시각 검증 필수

카드 여러 장 append 후 itemSpacing이 의도치 않게 변할 수 있음.
삽입 완료 후 반드시 `screenshot()`으로 gap 육안 확인.

```js
// 삽입 완료 후
const screenshot = await descListNode.screenshot();
return { screenshot };
// gap이 이상하면 descListNode.itemSpacing = 10; 재설정
```

---

## 매 작성 전 Pre-flight 체크리스트

### 계층 구조 (L0~L3)
```
[ ] Header Note(L0)가 화면명 한 줄만인가? (불릿 없음 — 패턴 5)
[ ] 모든 독립 UI 요소가 Numbered Note(L1)로 분리됐는가? (패턴 4)
[ ] L2 불릿에 "요소명: 설명" 패턴이 없는가? (있으면 L1 분리 검토)
[ ] L2 불릿 1개에 사실 1개만 담겨 있는가?
[ ] L3 서브불릿 위에 카테고리 레이블(상태:/옵션:/비즈니스 로직:)이 있는가?
[ ] L3 아래에 추가 중첩(L4)이 없는가?
```

### 상태·포맷
```
[ ] Format B가 맞는가? (A는 단계형 플로우일 때만)
[ ] 상태가 라이프사이클 순서인가? (Active → ... → Expired)
[ ] 상태별로 실제 표시 텍스트(따옴표)가 있는가?
[ ] Loading / Empty / Error가 모두 있는가? (API 연동 컴포넌트)
[ ] 성공 후 분기가 비즈니스 로직 블록으로 분리됐는가? (패턴 1)
[ ] 에러 동작이 상태: Error: 블록 안에 있는가? (패턴 2)
[ ] 제목이 명사형인가? (동사 없음)
```

### Annotation·삽입
```
[ ] Annotation에 px/hex/CSS 값이 없는가?
[ ] STRUCTURE clone 시 clearAnnotations를 실행했는가?
[ ] Figma 삽입 시 applyBullets()를 적용했는가?
[ ] 삽입 완료 후 screenshot으로 시각 검증했는가?
```
