# 문서 페이지 — Figma 구현 코드

출처: md_planning SKILL.md § 5

---

## 문서 프레임 생성

```javascript
const docFrame = figma.createFrame();
docFrame.name = "DOC — {기능명}";
docFrame.layoutMode = "VERTICAL";
docFrame.primaryAxisSizingMode = "AUTO";
docFrame.counterAxisSizingMode = "FIXED";
docFrame.resize(1440, 100);
docFrame.primaryAxisSizingMode = "AUTO";
docFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
docFrame.paddingTop = 48; docFrame.paddingBottom = 48;
docFrame.paddingLeft = 60; docFrame.paddingRight = 60;
docFrame.itemSpacing = 40;
```

---

## 상단 타이틀

```javascript
function createDocTitle(parent, title) {
  const t = figma.createText();
  t.characters = title;
  t.fontSize = 20;
  t.fontName = { family: "Poppins", style: "SemiBold" };
  t.fills = [{ type: 'SOLID', color: { r: 0.10, g: 0.10, b: 0.10 } }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  parent.appendChild(t);
  return t;
}
```

---

## 4패널 행 + 개별 패널

```javascript
// 4패널 가로 컨테이너
const panelRow = figma.createFrame();
panelRow.layoutMode = "HORIZONTAL";
panelRow.primaryAxisSizingMode = "FIXED";
panelRow.counterAxisSizingMode = "AUTO";
panelRow.resize(1320, 10);
panelRow.counterAxisSizingMode = "AUTO";
panelRow.itemSpacing = 16;
panelRow.fills = [];
docFrame.appendChild(panelRow);

// 개별 패널
function createDocPanel(parent, panelTitle, bodyText, flexGrow) {
  const panel = figma.createFrame();
  panel.layoutMode = "VERTICAL";
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";
  panel.resize(300, 10);
  panel.primaryAxisSizingMode = "AUTO";
  panel.paddingTop = 20; panel.paddingBottom = 20;
  panel.paddingLeft = 20; panel.paddingRight = 20;
  panel.itemSpacing = 12;
  panel.cornerRadius = 6;
  panel.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
  panel.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  panel.strokeWeight = 1;
  if (flexGrow) panel.layoutGrow = 1;

  const header = figma.createText();
  header.characters = panelTitle;
  header.fontSize = 11;
  header.fontName = { family: "Poppins", style: "SemiBold" };
  header.fills = [{ type: 'SOLID', color: { r: 0.40, g: 0.40, b: 0.40 } }];
  header.textAutoResize = "WIDTH_AND_HEIGHT";
  panel.appendChild(header);

  const divider = figma.createRectangle();
  divider.resize(260, 1);
  divider.fills = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  panel.appendChild(divider);

  const body = figma.createText();
  body.characters = bodyText;
  body.fontSize = 13;
  body.fontName = { family: "Pretendard", style: "Regular" };
  body.fills = [{ type: 'SOLID', color: { r: 0.20, g: 0.20, b: 0.20 } }];
  body.lineHeight = { value: 180, unit: "PERCENT" };
  body.textAutoResize = "WIDTH_AND_HEIGHT";
  panel.appendChild(body);

  parent.appendChild(panel);
  return panel;
}
```

---

## HISTORY 테이블

```javascript
function createHistoryTable(parent, rows) {
  // rows: [{ date, title, description }]
  const table = figma.createFrame();
  table.layoutMode = "VERTICAL";
  table.primaryAxisSizingMode = "AUTO";
  table.counterAxisSizingMode = "FIXED";
  table.resize(1320, 10);
  table.primaryAxisSizingMode = "AUTO";
  table.fills = [];
  table.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  table.strokeWeight = 1;
  table.cornerRadius = 6;
  table.clipsContent = true;

  const COLS = [
    { label: "DATE",  w: 120  },
    { label: "TITLE", w: 200  },
    { label: "DESCRIPTION", w: 1000 },
  ];

  // 헤더 행
  const headerRow = figma.createFrame();
  headerRow.layoutMode = "HORIZONTAL";
  headerRow.primaryAxisSizingMode = "FIXED";
  headerRow.counterAxisSizingMode = "FIXED";
  headerRow.resize(1320, 36);
  headerRow.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
  table.appendChild(headerRow);

  COLS.forEach(col => {
    const cell = figma.createFrame();
    cell.resize(col.w, 36);
    cell.layoutMode = "HORIZONTAL";
    cell.paddingLeft = 16; cell.paddingRight = 16;
    cell.primaryAxisAlignItems = "CENTER";
    cell.counterAxisAlignItems = "CENTER";
    cell.fills = [];
    cell.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
    cell.strokeWeight = 1;
    const t = figma.createText();
    t.characters = col.label;
    t.fontSize = 11;
    t.fontName = { family: "Poppins", style: "SemiBold" };
    t.fills = [{ type: 'SOLID', color: { r: 0.40, g: 0.40, b: 0.40 } }];
    t.textAutoResize = "WIDTH_AND_HEIGHT";
    cell.appendChild(t);
    headerRow.appendChild(cell);
  });

  // 데이터 행
  rows.forEach(row => {
    const dataRow = figma.createFrame();
    dataRow.layoutMode = "HORIZONTAL";
    dataRow.primaryAxisSizingMode = "FIXED";
    dataRow.counterAxisSizingMode = "FIXED";
    dataRow.resize(1320, 36);
    dataRow.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    table.appendChild(dataRow);

    [{ val: row.date, w: 120 }, { val: row.title, w: 200 }, { val: row.description, w: 1000 }]
      .forEach(d => {
        const cell = figma.createFrame();
        cell.resize(d.w, 36);
        cell.layoutMode = "HORIZONTAL";
        cell.paddingLeft = 16; cell.paddingRight = 16;
        cell.primaryAxisAlignItems = "CENTER";
        cell.counterAxisAlignItems = "CENTER";
        cell.fills = [];
        cell.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
        cell.strokeWeight = 1;
        const t = figma.createText();
        t.characters = d.val;
        t.fontSize = 12;
        t.fontName = { family: "Pretendard", style: "Regular" };
        t.fills = [{ type: 'SOLID', color: { r: 0.20, g: 0.20, b: 0.20 } }];
        t.textAutoResize = "WIDTH_AND_HEIGHT";
        cell.appendChild(t);
        dataRow.appendChild(cell);
      });
  });

  parent.appendChild(table);
  return table;
}
```

### HISTORY 초기 행

```javascript
createHistoryTable(docFrame, [
  { date: "YYMMDD", title: "Draft", description: "초안 작성" }
]);
```

날짜는 오늘 날짜 기준. 이후 변경 시 행 추가.
