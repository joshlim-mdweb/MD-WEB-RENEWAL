---
paths:
  - "**/*figma*"
  - "**/*wireframe*"
  - "**/*feature*"
---

# WF 섹션 네이밍 컨벤션

STRUCTURE / FEATURE / CASE VIEW 섹션 생성 및 리네임 시 전체 적용.

---

## 0. WF 섹션 타입

| 타입 | 정의 | 판단 기준 |
|---|---|---|
| **STRUCTURE** | 화면 전체 구조 문서화 | 특정 MemberType 또는 상태 기준의 기본 화면 |
| **FEATURE** | 특정 플로우의 액션 흐름 | 버튼 클릭 → 상태 변화 단계별 추적 |
| **CASE VIEW** | 조건별 UI 분기를 한 프레임에 나열 | MemberType·통합 여부 등으로 특정 섹션만 달라질 때 |

### STRUCTURE vs CASE VIEW 선택 기준

| 상황 | 형식 |
|---|---|
| 화면 전체 레이아웃이 MemberType별로 다름 | 별도 STRUCTURE 프레임 (`Overview_Individual` 등) |
| 특정 섹션/컴포넌트 하나만 조건별로 달라짐 | CASE VIEW (한 프레임에 세로 나열) |

---

## FEATURE 섹션 네이밍 컨벤션

FEATURE 섹션 생성 및 리네임 시 전체 적용.

---

## 1. WF 프레임 이름

### 1-1. 순서형 (단일 케이스 플로우)

한 케이스 안에서 상태가 순서대로 변하는 경우:

```
[Feature Name] N
예: Password Change 1 / 2 / 3
    Nickname 1 / 2 / 3
    Billing Address 1 / 2 / 3
```

### 1-2. 케이스 분기 (여러 케이스)

MemberType·통합 여부 등에 따라 경우가 나뉘는 경우:

```
[Feature Name] N  (케이스 내 순서 번호)
예: Password Change 1 / 2 / 3  (Case 1 — Not Integrated 내)
    Password Change 4          (Case 2 — CLO-SET Integrated 내)
    Password Change 5 / 6      (Case 3 — License ID 내)
```

> 번호는 섹션 전체에서 연속 (케이스마다 1부터 다시 시작 금지).

---

## 2. Board Header 텍스트

Board Header는 두 개의 텍스트 노드를 가진다:

| 노드 위치 | 역할 | 값 |
|---|---|---|
| `bh.children[0]` | Main Label | `"Feature Name N"` — 프레임명과 동일 |
| `bh.children[2]` | Sub Label | `"Feature Name N — Descriptive State"` |

### Sub Label 형식

```
[Feature Name] N — [현재 상태 설명]

예:
  Password Change 1 — View
  Password Change 2 — Form Open
  Password Change 3 — Changed
  Nickname 2 — Edit Mode
  Preferences 3 — Language Changed
  Billing Address 2 — Edit Mode
```

**상태 설명 키워드 가이드:**

| 상태 | 권장 표현 |
|---|---|
| 기본/초기 화면 | `View` / `Default` |
| 입력 폼 열림 | `Form Open` / `Edit Mode` |
| 저장 완료 | `Saved` / `Changed` |
| 드롭다운 열림 | `Dropdown Open` |
| 외부 서비스 이동 | `CLO-SET Redirect` / `CLO-SET Integrated` |
| 패널 펼침 | `Detail Panel Open` |
| 패널 닫힘 | `List View` |
| ON 상태 | `[Feature] ON` |
| OFF 상태 | `[Feature] OFF` |

---

## 3. Row Label

케이스 분기가 있을 때 각 케이스 영역 위에 배치하는 레이블.

### 프레임명

```
Row Label — Case N ([케이스 설명])

예:
  Row Label — Case 1 (Not Integrated)
  Row Label — Case 2 (CLO-SET Integrated, Individual / Student)
  Row Label — Case 3 (License ID)
```

### 텍스트 내용

```
Case N — [케이스 설명]

예:
  Case 1 — Not Integrated
  Case 2 — CLO-SET Integrated (Individual / Student)
  Case 3 — License ID (CLO-SET + MD 비밀번호 독립)
```

> **A/B/C 표기 금지.** 반드시 숫자 1/2/3 사용.

### 기능 그룹 레이블 (케이스가 아닌 경우)

Preferences의 Language / Notifications / AI Studio처럼 케이스가 아닌 기능 그룹을 구분하는 경우:

```
Row Label — [기능명]
텍스트: [기능명]  (Case N 형식 불필요)

예:
  Row Label — Language  →  "Language"
  Row Label — Notifications (Marketing)  →  "Notifications — Marketing"
  Row Label — AI Studio Plug-In  →  "AI Studio Plug-In"
```

---

## 4. updateFrame / updateRowLabel 헬퍼

FEATURE 섹션 리네임 시 사용하는 표준 패턴:

```javascript
// 폰트 사전 로드 (필수)
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "Medium" });

// WF 프레임: Board Header main label + sub label 동시 업데이트
function updateFrame(id, mainLabel, subLabel) {
  const frame = figma.getNodeById(id);
  if (!frame) return `NOT FOUND: ${id}`;
  const bh = frame.children?.[0];
  if (!bh || !('children' in bh)) return `OK: ${mainLabel} (no BH)`;
  if (bh.children[0]?.type === 'TEXT') bh.children[0].characters = mainLabel;
  if (bh.children.length >= 3 && bh.children[2]?.type === 'TEXT') bh.children[2].characters = subLabel;
  return `OK: ${mainLabel}`;
}

// Row Label: 프레임명 + 텍스트 동시 업데이트
function updateRowLabel(id, newFrameName, newText) {
  const node = figma.getNodeById(id);
  if (!node) return `NOT FOUND: ${id}`;
  node.name = newFrameName;
  const textNode = node.findOne(n => n.type === 'TEXT');
  if (textNode) textNode.characters = newText;
  return `OK: ${newFrameName}`;
}
```

---

## 5. 신규 생성 시 적용 시점

FEATURE 섹션을 새로 만들 때 **clone 직후** 즉시 적용:

```javascript
const clone = sourceWF.clone();
section.appendChild(clone);
clearAnnotations(clone);  // annotation 삭제 (필수)

// ✅ 이름은 clone 직후 바로 부여 — "COMMON" / "Frame" 이름으로 방치 금지
clone.name = "Password Change 1";
updateFrame(clone.id, "Password Change 1", "Password Change 1 — View");
```

> clone 후 방치하면 Board Header main label이 "COMMON"으로 남음. 반드시 즉시 지정.

---

## 6. CASE VIEW 네이밍 컨벤션

### 프레임 이름

```
[Section]_CaseView
예: DangerZone_CaseView
    ConnectedApps_CaseView
    MyLicense_CaseView
```

### Board Header 텍스트

| 노드 | 형식 | 예시 |
|---|---|---|
| Main Label | `"[SCOPE]: [SCREEN] — [SECTION]"` (ALL CAPS) | `"PERSONAL: ACCOUNT — DANGER ZONE"` |
| Sub Label | `"[Tab] \| [Screen] — [Section] \| Case View"` | `"Account \| Personal: Account — Danger Zone \| Case View"` |

### Screen 내 배치 구조

각 케이스를 세로로 나열하고, 케이스 위에 번호 배지 + 케이스 레이블을 붙인다.

```
Screen (layoutMode=NONE)
├── Annotation Badge ① + 케이스 레이블 (e.g. "Individual")
│   └── 케이스 1 UI 컴포넌트
├── Annotation Badge ② + 케이스 레이블 (e.g. "Company ID")
│   └── 케이스 2 UI 컴포넌트
└── Annotation Badge ③ + "노출 X"  ← 해당 없는 케이스
```

**케이스 레이블**: MemberType명 또는 조건명 그대로 사용 (`Individual` / `Company ID` / `Integrated` 등)

> **Row Label 프레임 사용 금지** — Row Label은 FEATURE 섹션 전용.

### Description 형식

`figma-description.md` Format B를 따른다.

- Header Note (배지 없음): 섹션명 + "MemberType별 노출 항목 상이"
- Numbered Note: 각 UI 요소 + `조건부 노출:` 블록으로 케이스별 분기 설명

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

---

## 7. 위반 시 발생하는 문제

| 위반 | 결과 |
|---|---|
| Board Header main label이 "COMMON" | Figma에서 프레임 식별 불가 |
| Sub label이 번호만 ("Password Change 1") | 상태 파악을 위해 화면을 열어야 함 |
| Row Label이 "Case A/B/C" | 숫자 기반 참조 불일치 |
| 번호가 케이스마다 1부터 재시작 | 섹션 전체 순서 혼란 |
