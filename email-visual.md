# email-visual.md — v2 이메일 화면설계 시각 토큰과 생성 함수

`email-spec.md`의 참조 파일. EMAIL CONTENTS v2 이메일 뷰의 시각 규격과 Figma 컴포넌트 생성 함수를 정의한다. `spec.md` ↔ `spec-visual.md` 관계의 이메일판이다.
정본 레퍼런스: Josh 확정 프레임 `EMAIL AUTOMATION` node `2479:1017` (2026-09-03 실측). 레거시 시각 기록은 `emailTemplate-visual.md`.

## 버전 관리표

| 버전 | 날짜 | 작성자 | 변경 내용 |
|---|---|---|---|
| 1.0.00 | 2026-09-03 | Josh Lim | 최초 작성: 레퍼런스 2479:1017 실측 토큰 + 컴포넌트 생성 함수 9종. 버튼 HUG 강제 |

---

## 1. 시각 토큰 (실측)

### 구조

| 요소 | 값 |
|---|---|
| Subject 헤딩 | Poppins Medium 20 `#1A1A1A`, 컨테이너 밖 상단, 아래 gap 16 |
| Email Wrapper | 640 FIXED × HUG, `#F0F0F0`, pad 20, 자식 중앙 정렬 |
| Email Container | FILL × HUG, `#FFFFFF`, radius 8 |
| Email Body | FILL × HUG, pad 32, gap 16 |
| Email Footer 영역 | FILL × HUG, `#F5F5F5`, pad 16 상하 24 좌우, gap 12, Divider 1px `#D9D9D9` 포함 |

### 텍스트

| 요소 | 폰트 | 색 |
|---|---|---|
| Subject | Poppins Medium 20 | `#1A1A1A` |
| 본문 문단 | Poppins Regular 14 | `#3F3F3F` |
| 버튼 텍스트 | Poppins Medium 14 | `#FFFFFF` |
| 맺음 1행 (Best,) | Poppins Regular 14 | `#38383C` |
| 맺음 2행 (Marvelous Designer Team) | Poppins SemiBold 16 | `#18181C` |
| 푸터 2줄 | Poppins Regular 11, 중앙 정렬 | `#2F2F2F`, 링크만 `#4A9DFF` |
| OTP 코드 | Poppins Medium 40, letterSpacing 10 | `#1A1A1A`, 박스 `#F5F5F5` radius 8 |

### 버튼 (절대규칙)

**버튼 프레임과 내부 텍스트는 무조건 HUG × HUG.** 고정 폭 금지. `#DD6A00` 배경, radius 4, pad 상하 12 좌우 24.

## 2. 컴포넌트 체계

- **마스터 컴포넌트** (v2 페이지 `Email Components` 섹션, `figma.createComponent()`): 내용이 고정이거나 텍스트 1개만 바뀌는 것 — `Email/Subject`, `Email/Paragraph`, `Email/CTA Button`, `Email/Code Block`, `Email/Sign-off`, `Email/Footer`
- **레이아웃 함수** (컴포넌트 아님): 문단 수가 템플릿마다 달라 구조가 잠기면 안 되는 컨테이너 — `createEmailWrapper()`가 Wrapper, Container, Body를 프레임으로 생성
- 템플릿 조립 = Wrapper 프레임 + 컴포넌트 인스턴스(`createInstance()`) 나열. 마스터 수정이 전 템플릿에 전파된다
- 맺음 문구는 컴포넌트에 고정: `Best,` + `Marvelous Designer Team` (`email-spec.md` §4.6)

## 3. 생성 함수

`use_figma`에서 그대로 실행 가능. 사전에 Poppins Regular, Medium, SemiBold 로드 필수.

```javascript
const EV = {
  wrapperBg: { r: 0.9412, g: 0.9412, b: 0.9412 },   // #F0F0F0
  white: { r: 1, g: 1, b: 1 },
  bodyInk: { r: 0.2471, g: 0.2471, b: 0.2471 },      // #3F3F3F
  subjectInk: { r: 0.102, g: 0.102, b: 0.102 },      // #1A1A1A
  signInk1: { r: 0.2196, g: 0.2196, b: 0.2353 },     // #38383C
  signInk2: { r: 0.0941, g: 0.0941, b: 0.1098 },     // #18181C
  footerBg: { r: 0.9608, g: 0.9608, b: 0.9608 },     // #F5F5F5
  footerInk: { r: 0.1843, g: 0.1843, b: 0.1843 },    // #2F2F2F
  divider: { r: 0.851, g: 0.851, b: 0.851 },          // #D9D9D9
  bar: { r: 0.2196, g: 0.2196, b: 0.2196 },           // #383838
  buttonBg: { r: 0.8667, g: 0.4157, b: 0 },           // #DD6A00
  link: { r: 0.2902, g: 0.6157, b: 1 },               // #4A9DFF
};

function evText(parent, s, size, style, color, opts) {
  const t = figma.createText();
  t.fontName = { family: 'Poppins', style: style };
  t.fontSize = size;
  t.fills = [{ type: 'SOLID', color: color }];
  parent.appendChild(t);
  if (opts && opts.fixedW) { t.resize(opts.fixedW, 10); t.textAutoResize = 'HEIGHT'; }
  else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  if (opts && opts.center) t.textAlignHorizontal = 'CENTER';
  t.characters = s;
  return t;
}

// Subject 헤딩 (컨테이너 밖 상단)
function createEmailSubject(text) {
  const c = figma.createComponent();
  c.name = 'Email/Subject';
  c.layoutMode = 'VERTICAL';
  c.counterAxisSizingMode = 'AUTO';
  c.primaryAxisSizingMode = 'AUTO';
  c.fills = [];
  evText(c, text || 'Subject line', 20, 'Medium', EV.subjectInk, { fixedW: 600 });
  return c;
}

// 본문 문단
function createEmailParagraph(text) {
  const c = figma.createComponent();
  c.name = 'Email/Paragraph';
  c.layoutMode = 'VERTICAL';
  c.counterAxisSizingMode = 'AUTO';
  c.primaryAxisSizingMode = 'AUTO';
  c.fills = [];
  evText(c, text || 'Paragraph text', 14, 'Regular', EV.bodyInk, { fixedW: 536 });
  return c;
}

// CTA 버튼 — HUG x HUG 절대규칙
function createEmailButton(label) {
  const c = figma.createComponent();
  c.name = 'Email/CTA Button';
  c.layoutMode = 'HORIZONTAL';
  c.primaryAxisSizingMode = 'AUTO';    // HUG
  c.counterAxisSizingMode = 'AUTO';    // HUG
  c.primaryAxisAlignItems = 'CENTER';
  c.counterAxisAlignItems = 'CENTER';
  c.paddingTop = c.paddingBottom = 12;
  c.paddingLeft = c.paddingRight = 24;
  c.cornerRadius = 4;
  c.fills = [{ type: 'SOLID', color: EV.buttonBg }];
  evText(c, label || 'Button Label', 14, 'Medium', EV.white);   // 텍스트도 HUG
  return c;
}

// OTP 코드 블록
function createEmailCodeBlock(code) {
  const c = figma.createComponent();
  c.name = 'Email/Code Block';
  c.layoutMode = 'VERTICAL';
  c.primaryAxisSizingMode = 'AUTO';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(536, 90);
  c.primaryAxisAlignItems = 'CENTER';
  c.counterAxisAlignItems = 'CENTER';
  c.paddingTop = c.paddingBottom = 24;
  c.cornerRadius = 8;
  c.fills = [{ type: 'SOLID', color: EV.footerBg }];
  const t = evText(c, code || '{otpCode}', 32, 'Medium', EV.subjectInk);
  t.letterSpacing = { unit: 'PIXELS', value: 10 };
  return c;
}

// 맺음 (Bar + 2행, 문구 고정: email-spec.md §4.6)
function createEmailSignoff() {
  const c = figma.createComponent();
  c.name = 'Email/Sign-off';
  c.layoutMode = 'VERTICAL';
  c.primaryAxisSizingMode = 'AUTO';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(536, 90);
  c.paddingTop = 20;
  c.itemSpacing = 8;
  c.fills = [];
  const bar = figma.createFrame();
  bar.resize(28, 4);
  bar.cornerRadius = 2;
  bar.fills = [{ type: 'SOLID', color: EV.bar }];
  bar.name = 'Bar';
  c.appendChild(bar);
  evText(c, 'Best,', 14, 'Regular', EV.signInk1);
  evText(c, 'Marvelous Designer Team', 16, 'SemiBold', EV.signInk2);
  return c;
}

// 푸터 (회색 영역: Divider + 2줄, Help Center만 파랑)
function createEmailFooter() {
  const c = figma.createComponent();
  c.name = 'Email/Footer';
  c.layoutMode = 'VERTICAL';
  c.primaryAxisSizingMode = 'AUTO';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(600, 80);
  c.counterAxisAlignItems = 'CENTER';
  c.paddingTop = c.paddingBottom = 16;
  c.paddingLeft = c.paddingRight = 24;
  c.itemSpacing = 12;
  c.fills = [{ type: 'SOLID', color: EV.footerBg }];
  const div = figma.createFrame();
  div.resize(552, 1);
  div.fills = [{ type: 'SOLID', color: EV.divider }];
  div.name = 'Divider';
  c.appendChild(div);
  const col = figma.createFrame();
  col.name = 'Lines';
  col.layoutMode = 'VERTICAL';
  col.counterAxisSizingMode = 'AUTO';
  col.itemSpacing = 4;
  col.counterAxisAlignItems = 'CENTER';
  col.fills = [];
  c.appendChild(col);
  evText(col, 'Copyright (c) 2026 CLO VIRTUAL FASHION, All rights reserved.', 11, 'Regular', EV.footerInk, { fixedW: 536, center: true });
  const l2 = 'Want to learn more about Marvelous Designer? Feel free to visit our information hub, Help Center.';
  const t2 = evText(col, l2, 11, 'Regular', EV.footerInk, { fixedW: 536, center: true });
  const hc = l2.indexOf('Help Center');
  t2.setRangeFills(hc, hc + 'Help Center'.length, [{ type: 'SOLID', color: EV.link }]);
  return c;
}

// 정보 블록 (결제, 주문, 라이선스) — email-spec.md §4.3 키 세트 9행 내장
// 인스턴스에서 안 쓰는 행은 visible = false로 숨긴다 (키 세트가 고정이라 컴포넌트化 가능)
function createEmailInfoBlock() {
  const KEY_INK = { r: 0.0941, g: 0.0941, b: 0.1098 };
  const VAL_INK = { r: 0.2471, g: 0.2471, b: 0.2471 };
  const c = figma.createComponent();
  c.name = 'Email/Info Block';
  c.layoutMode = 'VERTICAL';
  c.primaryAxisSizingMode = 'AUTO';
  c.counterAxisSizingMode = 'FIXED';
  c.resize(536, 100);
  c.paddingTop = c.paddingBottom = 20;
  c.paddingLeft = c.paddingRight = 24;
  c.itemSpacing = 8;
  c.cornerRadius = 8;
  c.fills = [{ type: 'SOLID', color: EV.footerBg }];
  // 값은 더미 금지, 변수 키 표기 (email-spec.md §4.6 키 사전)
  const ROWS = [
    ['Plan', '{productName}'],
    ['Billing Cycle', '{subscriptionType}'],
    ['Order Date', '{orderDate}'],
    ['Amount', '{price} {currency}'],
    ['Payment Method', '{paymentMethod}'],
    ['Next Payment Date', '{nextPaymentDate}'],
    ['Expiry Date', '{expiryDate} (GMT)'],
    ['Seats', '{seats}'],
    ['SW Account', '{swAccount}'],
  ];
  for (const [k, v] of ROWS) {
    const row = figma.createFrame();
    row.name = k;
    row.layoutMode = 'HORIZONTAL';
    row.counterAxisSizingMode = 'AUTO';
    row.itemSpacing = 8;
    row.fills = [];
    c.appendChild(row);
    row.layoutSizingHorizontal = 'FILL';
    const kt = evText(row, k + ':', 14, 'Medium', KEY_INK, { fixedW: 170 });
    const vt = evText(row, v, 14, 'Regular', VAL_INK, { fixedW: 290 });
  }
  return c;
}

// 레이아웃 함수 (컴포넌트 아님) — Wrapper > Container > Body 골격
// 문단 수가 템플릿마다 달라 구조를 잠그지 않는다
function createEmailWrapper() {
  const wrap = figma.createFrame();
  wrap.name = 'Email Wrapper';
  wrap.layoutMode = 'VERTICAL';
  wrap.resize(640, 500);
  wrap.primaryAxisSizingMode = 'AUTO';
  wrap.counterAxisSizingMode = 'FIXED';
  wrap.counterAxisAlignItems = 'CENTER';
  wrap.paddingTop = wrap.paddingBottom = wrap.paddingLeft = wrap.paddingRight = 20;
  wrap.fills = [{ type: 'SOLID', color: EV.wrapperBg }];

  const container = figma.createFrame();
  container.name = 'Email Container';
  container.layoutMode = 'VERTICAL';
  container.counterAxisSizingMode = 'AUTO';
  container.cornerRadius = 8;
  container.fills = [{ type: 'SOLID', color: EV.white }];
  wrap.appendChild(container);
  container.layoutSizingHorizontal = 'FILL';

  const body = figma.createFrame();
  body.name = 'Email Body';
  body.layoutMode = 'VERTICAL';
  body.counterAxisSizingMode = 'AUTO';
  body.paddingTop = body.paddingBottom = body.paddingLeft = body.paddingRight = 32;
  body.itemSpacing = 16;
  body.fills = [{ type: 'SOLID', color: EV.white }];
  container.appendChild(body);
  body.layoutSizingHorizontal = 'FILL';

  return { wrap, container, body };
}
```

## 4. 조립 규칙

**변수 키 표기 (2026-09-03 확정)**: 화면의 가변 값은 더미 대신 `{키}` camelCase 표기. 키 사전과 규칙은 `email-spec.md` §4.6. 정보 블록 값, 본문 인라인, Subject 인라인, OTP 코드 전부 해당.


1. Screen 안에 `Email/Subject` 인스턴스 + `createEmailWrapper()` 골격을 세로로 배치 (Subject가 위, gap 16)
2. Body에 인스턴스를 순서대로 append: Paragraph(들), CTA Button 또는 Code Block, Paragraph(안내), 마무리 안내 Paragraph, Sign-off
3. Container 마지막에 Footer 인스턴스 append (Body 밖, Container 안)
4. 텍스트 교체는 인스턴스 내부 TEXT 노드에 직접 (`characters` 덮어쓰기, 폰트 로드 선행). 버튼은 HUG라 레이블 길이에 맞춰 자동 신축
5. 문구는 `email-spec.md` §4 블록 표준을 따른다

## 관련 문서

- 구성, 문구, 판정: `email-spec.md`
- 레거시 시각 기록: `emailTemplate-visual.md`
- 레거시 원문: `emailTemplate.md`
