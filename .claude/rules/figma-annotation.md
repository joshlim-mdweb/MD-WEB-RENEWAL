# Figma Native Annotation 작성 규칙

Figma 어노테이션 작성 시 전체에 적용.

---

## 언어

**모든 어노테이션은 한국어로 작성한다.**
- 컴포넌트명·버튼 레이블·상태값 등 UI에 실제로 표시되는 텍스트는 영문 그대로 유지
- 설명 문장은 전부 한국어

```
✅ [결제 수단 카드]
   - 사용자가 결제 수단을 선택하는 카드형 UI
   - 상태:
     - 선택됨: border.strong (진한 테두리)로 강조
     - 클릭: 해당 결제 수단 선택 → CTA 텍스트 변경

❌ [Payment Method Card]
   - Card UI for selecting payment method
```

---

## 원칙

- **의도를 설명한다**: "무엇을 하는가", "왜 이 동작인가"를 명시
- **상태값을 포함한다**: 어떤 상태가 존재하는지 열거
- **하위 옵션을 표현한다**: 드롭다운·탭·토글 등 선택 가능한 항목은 나열
- **기술·디자인 스펙은 제외한다**: CSS 값, 색상 코드, 크기 수치 금지 (디자인 파일이 source of truth)

---

## 형식

### 헤더

```
[타이틀]
```

어노테이션 대상 컴포넌트 또는 섹션명을 꺾쇠 괄호로 표기.

### 본문 — 중첩 불릿 구조

```
[타이틀]
- [의도 설명 — 이 컴포넌트가 무엇을 하는지, 왜 이 동작인지]
- 상태:
  - 상태 1
  - 상태 2
- 옵션:
  - 옵션 1
  - 옵션 2
- 조건:
  - 조건 1: 표시 결과
  - 조건 2: 표시 결과
```

- 첫 번째 불릿: 의도 설명 (자유 문장)
- `상태:` / `옵션:` / `조건:` 등 카테고리 레이블은 콜론으로 끝내고 하위 항목을 들여쓰기
- 해당하지 않는 카테고리는 생략

---

## 버튼 (필수)

버튼이 포함된 경우 반드시 작성:

```
- [버튼 의도 설명]
- 상태:
  - 호버: [동작 설명]
  - 클릭: [동작 설명]
  - Disabled: [비활성 조건] (해당 시)
```

---

## 선택 작성 (해당 시)

해당하는 카테고리만 포함. 사용 가능한 카테고리:

- **상태:** — 호버 / 클릭 / Disabled / 포커스 / 빈 상태 / Loading / Error 등
- **옵션:** — 드롭다운·탭·라디오 등 선택 가능한 항목 목록
- **조건:** — 특정 조건에 따라 UI나 값이 달라지는 경우 (조건: 결과 형태로 나열)

추가 상태가 필요하면 별도 요청.

---

## STRUCTURE vs FEATURE Annotation 분리 원칙

STRUCTURE 섹션과 FEATURE 섹션은 **annotation 범위와 형식이 다르다.**

### STRUCTURE Annotation

| 항목 | 내용 |
|------|------|
| 목적 | 화면의 모든 컴포넌트를 완전히 문서화 |
| 범위 | 모든 주요 UI 요소 |
| 형식 | `[요소명]\n- 의도\n- 상태:\n  - 호버: ...\n  - 클릭: ...` |
| 버튼 | 호버 + 클릭 필수 |
| 역할 | 이 섹션 annotation이 FEATURE 섹션의 레퍼런스가 됨 |

### FEATURE Annotation

| 항목 | 내용 |
|------|------|
| 목적 | 해당 프레임에서 일어나는 액션(사용자 행동 → 결과)만 기술 |
| 범위 | action button 또는 변화된 요소만 |
| 형식 | `→ [버튼명] 클릭 시 [결과]` |
| end state 프레임 | annotation 없음 (결과 상태는 설명 불필요) |

```
✅ FEATURE annotation 예시
→ Stop Subscription 클릭 시 Stop Subscription 모달 오픈
→ Pause for Now 클릭 시 Pause Duration Selection으로 이동
→ Confirm Pause 클릭 시 구독 일시정지 예약 (Pause Scheduled)

❌ FEATURE에서 하면 안 되는 것 (STRUCTURE 형식을 FEATURE에 사용)
[Stop Subscription 버튼]
- 구독을 중단하는 플로우를 시작하는 버튼
- 상태:
  - 호버: 강조 상태로 전환
  - 클릭: Stop Subscription 모달 오픈
```

### CASE VIEW Annotation

CASE VIEW 프레임은 STRUCTURE/FEATURE와 다르게 **Screen 내 케이스 레이블**과 **Description Panel** 두 곳에 annotation이 들어간다.

#### Screen 내 케이스 레이블 (번호 배지 + 텍스트)

각 케이스 UI 컴포넌트 위에 배치. 단순 레이블 역할 — 설명 없음.

```
Annotation Badge ①  +  "Individual"
Annotation Badge ②  +  "Company ID"
Annotation Badge ③  +  "노출 X"  ← 해당 없는 케이스
```

#### Description Panel (Format B)

`figma-description.md` Format B 기준. Header Note + Numbered Note.

```
**[섹션명]**
- [한 줄 컨텍스트]
- MemberType별 노출 항목 상이

**① [요소명]**
- [기본 설명]
- 조건부 노출:
  - Individual / Student: [결과]
  - Company ID (Integrated): [결과]
  - Company ID (Not Integrated): [결과]
  - Academic / Indie: [결과]
  - License ID: 미표시
```

**규칙:**
- Header Note에 `MemberType별 노출 항목 상이` 명시 필수
- Numbered Note는 Screen의 번호 배지와 1:1 대응
- 케이스 레이블을 `조건부 노출:` 블록 안에 그대로 사용 (축약 금지)
- "노출 X" 케이스는 Description에서 `미표시`로 처리

---

### Clone 후 annotation cleanup 필수

STRUCTURE WF를 clone해 FEATURE 프레임을 만들 때, **clone 직후 즉시** annotation 전체 삭제:

```javascript
const ANNOTATABLE_TYPES = new Set([
  'FRAME','COMPONENT','INSTANCE','TEXT','RECTANGLE',
  'ELLIPSE','VECTOR','LINE','POLYGON','STAR','GROUP','BOOLEAN_OPERATION'
]);

function clearAnnotations(node) {
  // SECTION 타입은 .annotations 프로퍼티 없음 → guard 필수
  if (node.type !== 'SECTION' && ANNOTATABLE_TYPES.has(node.type)) {
    try {
      if (node.annotations && node.annotations.length > 0) node.annotations = [];
    } catch(e) {}
  }
  if ('children' in node) node.children.forEach(child => clearAnnotations(child));
}

// clone 직후 실행 — 건너뛰기 금지
clearAnnotations(clonedFrame);
```

**왜 필수인가**: STRUCTURE WF의 모든 컴포넌트 annotation이 clone 시 그대로 복사됨.
이 상태에서 FEATURE annotation을 추가하면 두 종류가 섞여 의미가 불명확해짐.

---

## 와이어프레임 델타 어노테이션 (Flow 섹션 전용)

Flow 섹션의 두 번째 화면부터는 **변화된 요소만** annotation을 달고, prefix를 붙인다.

| prefix | 의미 | 예시 |
|--------|------|------|
| `→` | 사용자 액션 → 화면 변화 | `→ 국가를 US로 변경 — Kakao Pay 사라지고 PayPal 표시` |
| `+` | 조건에 따라 새로 등장 | `+ 만료 배너 — Trial 진행 중 첫 결제 진입 시 자동 표시` |
| `×` | 조건에 따라 사라짐 | `× Monthly 토글 — Student 플랜 진입 시 비활성 처리` |

변경되지 않은 요소는 annotation 달지 않는다.

---

## 예시

```
[저장 버튼]
- 변경 사항이 있을 때 활성화되어 저장을 수행하는 버튼
- 상태:
  - 호버: 강조 상태로 전환
  - 클릭: 변경 사항 저장 → 토스트 "저장했어요" 표시
  - Disabled: 변경 사항이 없을 때
```

```
[정렬 드롭다운]
- 목록 정렬 기준을 선택하는 드롭다운
- 상태:
  - 클릭: 드롭다운 열림
- 옵션:
  - 최신순 (기본)
  - 이름순
  - 사용 시간순
```

```
[Computer ID 셀]
- Computer ID를 축약 표시하고, 아이콘 클릭 시 전체 ID를 확인하는 셀
- 상태:
  - 기본: 앞 4자리 + ... + 뒤 4자리 축약 표시
  - 클릭 (👁 아이콘): 전체 ID 툴팁 표시 → 외부 클릭 시 닫힘
```

```
[Guest 배지]
- 해당 행 사용자가 Guest 권한으로 접속한 경우에만 표시되는 배지
- 조건:
  - Guest 권한 접속: 표시 (User ID 이름 오른쪽 인라인)
  - 일반 접속: 숨김
```

```
[멤버 목록]
- 팀에 추가된 멤버를 표시하는 목록
- 상태:
  - 빈 상태: "아직 추가된 멤버가 없어요." + 멤버 추가 버튼
```

```
[User ID / Email 컬럼]
- Userpool Guest 여부에 따라 표시 값이 달라지는 컬럼
- 조건:
  - SW 라이선스 직접 접속: License ID 그대로 표시
  - Userpool Guest 접속: 이메일 표시 + 우측에 Guest 배지 인라인 배치
```
