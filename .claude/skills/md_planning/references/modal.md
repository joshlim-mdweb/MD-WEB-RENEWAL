# 모달 컴포넌트 — Figma 구현 코드

출처: md_planning SKILL.md § 3.5
원본 디자인: CLOVER-ADMIN Figma node `3721:666`

---

## createModal 전체 코드

```javascript
async function createModal(parent, storyId, title, body, actionLabel, x, y) {
  await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
  await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });

  const MW = 528, MH = 320;

  // 라벨 + 모달을 감싸는 wrapper
  const wrap = figma.createFrame();
  wrap.name = storyId + " Modal";
  wrap.layoutMode = "VERTICAL";
  wrap.primaryAxisSizingMode = "AUTO";
  wrap.counterAxisSizingMode = "AUTO";
  wrap.itemSpacing = 8;
  wrap.fills = [];
  wrap.x = x; wrap.y = y;
  parent.appendChild(wrap);

  // storyId 라벨
  const lbl = figma.createText();
  lbl.fontName = { family: "Poppins", style: "SemiBold" };
  lbl.fontSize = 11;
  lbl.fills = [{ type: "SOLID", color: { r: 0.42, g: 0.42, b: 0.42 } }];
  lbl.textAutoResize = "WIDTH_AND_HEIGHT";
  lbl.characters = storyId;
  wrap.appendChild(lbl);

  // 모달 컨테이너
  const m = figma.createFrame();
  m.name = "Modal"; m.resize(MW, MH); m.layoutMode = "NONE";
  m.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  m.cornerRadius = 8;
  m.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.12 },
    offset: { x: 0, y: 4 }, radius: 24, spread: 0,
    visible: true, blendMode: "NORMAL",
  }];
  wrap.appendChild(m);

  // Title
  const t1 = figma.createText();
  t1.fontName = { family: "Poppins", style: "SemiBold" };
  t1.fontSize = 16;
  t1.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  t1.textAutoResize = "WIDTH_AND_HEIGHT";
  t1.textAlignHorizontal = "CENTER";
  t1.characters = title;
  m.appendChild(t1);
  t1.x = (MW - t1.width) / 2; t1.y = 68;

  // Body
  const t2 = figma.createText();
  t2.fontName = { family: "Poppins", style: "Regular" };
  t2.fontSize = 14;
  t2.fills = [{ type: "SOLID", color: { r: 0.20, g: 0.20, b: 0.20 } }];
  t2.resize(MW - 64, 1); t2.textAutoResize = "HEIGHT";
  t2.textAlignHorizontal = "CENTER";
  t2.lineHeight = { unit: "PERCENT", value: 160 };
  t2.characters = body;
  m.appendChild(t2);
  t2.x = 32; t2.y = MH / 2 - t2.height / 2 - 10;

  // 버튼 생성 helper
  function btn(label, isFill) {
    const f = figma.createFrame();
    f.layoutMode = "HORIZONTAL"; f.primaryAxisSizingMode = "AUTO"; f.counterAxisSizingMode = "AUTO";
    f.paddingTop = 8; f.paddingBottom = 8; f.paddingLeft = 20; f.paddingRight = 20;
    f.cornerRadius = 6;
    f.fills = isFill ? [{ type: "SOLID", color: { r: 0.502, g: 0.588, b: 1.0 } }] : [];
    if (!isFill) {
      f.strokes = [{ type: "SOLID", color: { r: 0.573, g: 0.573, b: 0.573 } }];
      f.strokeWeight = 1;
    }
    const t = figma.createText();
    t.fontName = { family: "Poppins", style: "Regular" }; t.fontSize = 16;
    t.fills = [{ type: "SOLID", color: isFill ? { r: 1, g: 1, b: 1 } : { r: 0.271, g: 0.271, b: 0.271 } }];
    t.textAutoResize = "WIDTH_AND_HEIGHT"; t.characters = label;
    f.appendChild(t); m.appendChild(f);
    return f;
  }

  const cancelBtn = btn("Cancel", false);
  const actionBtn = btn(actionLabel, true);
  const btnY = MH - 64;
  const totalW = cancelBtn.width + 19 + actionBtn.width;
  cancelBtn.x = (MW - totalW) / 2; cancelBtn.y = btnY;
  actionBtn.x = cancelBtn.x + cancelBtn.width + 19; actionBtn.y = btnY;

  return wrap;
}
```

---

## 여러 모달 일괄 생성 예시

```javascript
const modals = [
  { storyId: "S1", title: "Overwrite existing data?", body: "...", action: "Overwrite" },
  { storyId: "S6", title: "Remove assigned image?",  body: "...", action: "Remove" },
];

let modalY = docFrame.y;
const modalX = docFrame.x + docFrame.width + 80;

for (const m of modals) {
  const wrap = await createModal(
    figma.currentPage, m.storyId, m.title, m.body, m.action, modalX, modalY
  );
  modalY += wrap.height + 80;
}
```
