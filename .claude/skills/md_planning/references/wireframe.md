# 와이어프레임 — Figma 구현 코드

출처: md_planning SKILL.md § 3

---

## 폰트 로드 (필수)

```javascript
await figma.loadFontAsync({ family: "Pretendard", style: "Regular" });
await figma.loadFontAsync({ family: "Pretendard", style: "Medium" });
await figma.loadFontAsync({ family: "Pretendard", style: "SemiBold" });
await figma.loadFontAsync({ family: "Pretendard", style: "Bold" });
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
await figma.loadFontAsync({ family: "Poppins", style: "Bold" });
```

---

## 메인 프레임 (Auto Layout)

```javascript
const mainFrame = figma.createFrame();
mainFrame.name = "화면명";
mainFrame.layoutMode = "VERTICAL";
mainFrame.primaryAxisSizingMode = "AUTO";
mainFrame.counterAxisSizingMode = "FIXED";
mainFrame.resize(1440, 100);
mainFrame.primaryAxisSizingMode = "AUTO"; // resize 후 재설정
mainFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
```

---

## 헬퍼 함수

### createText

```javascript
function createText(parent, text, fontSize, fontWeight, color, isEnglish) {
  const t = figma.createText();
  t.characters = text;
  t.fontSize = fontSize;
  t.fontName = { family: isEnglish ? "Poppins" : "Pretendard", style: fontWeight || "Regular" };
  t.fills = [{ type: 'SOLID', color: color || { r: 0.20, g: 0.20, b: 0.20 } }];
  t.lineHeight = { value: fontSize >= 24 ? 140 : 180, unit: "PERCENT" };
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  parent.appendChild(t);
  return t;
}
```

### createAutoFrame

```javascript
function createAutoFrame(parent, name, direction, spacing, padding, fills) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction || "VERTICAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "FIXED";
  f.itemSpacing = spacing || 0;
  if (padding) {
    f.paddingTop = padding; f.paddingBottom = padding;
    f.paddingLeft = padding; f.paddingRight = padding;
  }
  f.fills = fills || [];
  parent.appendChild(f);
  return f;
}
```

### createImagePlaceholder

```javascript
function createImagePlaceholder(parent, w, h, label) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = [{ type: 'SOLID', color: { r: 0.80, g: 0.80, b: 0.80 } }];
  r.cornerRadius = 4;
  parent.appendChild(r);
  if (label) {
    const t = figma.createText();
    t.characters = label || "IMG";
    t.fontSize = 12;
    t.fontName = { family: "Poppins", style: "Regular" };
    t.fills = [{ type: 'SOLID', color: { r: 0.60, g: 0.60, b: 0.60 } }];
    t.textAutoResize = "WIDTH_AND_HEIGHT";
    parent.appendChild(t);
  }
  return r;
}
```

---

## 섹션 분할 호출 패턴

한 번의 `use_figma` 호출당 노드 수 제한 → 3단계로 분할:

```
1차: 메인 프레임 + Header + Hero
2차: 본문 섹션
3차: CTA + Footer
```

재참조:
```javascript
figma.currentPage.findOne(n => n.name === "프레임명")
```

---

## 페이지 전환 (다른 페이지에 그릴 때)

```javascript
const targetPage = figma.root.children.find(p => p.id === "3712:2");
await figma.setCurrentPageAsync(targetPage);
// 이후 createFrame() 등 실행
```

**주의:** `figma.currentPage`가 Cover 등 다른 페이지인 채로 그리면 엉뚱한 곳에 올라감. 항상 먼저 페이지 전환.
