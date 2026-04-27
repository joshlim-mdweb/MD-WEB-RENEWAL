# Survey Builder UI — Feature Definition

**Document version:** 1.0
**Date:** 2026-03-18
**Author:** OPIN_RESEARCHER
**Status:** Ready for handoff

---

## 1. Overview

OPINION's Survey Builder must serve two distinct mental models simultaneously:

1. **Structured data editing** — creators think of surveys as a list of typed questions with settings (like a database schema editor)
2. **Flow authoring** — creators think of surveys as branching paths (like a flowchart)

The interface must make these two models feel native and complementary. The builder must also clearly communicate survey status, response-driven edit locks, and publish readiness at all times.

---

## 2. Reference Analysis

### 2.1 Supabase Studio / Table Editor

**Layout:** Far-left 56px icon strip for global nav, 240–280px collapsible context panel (table list), full-width main content area. No persistent right panel — settings appear as modals or inline drawers.

| Pattern                         | Detail                                                                |
| ------------------------------- | --------------------------------------------------------------------- |
| Left sidebar always visible     | Icon strip provides global orientation                                |
| Type badges on column headers   | Type shown as abbreviation badge (int, text, uuid)                    |
| Dark node headers in schema viz | Table cards use dark header row to separate table name from data rows |
| Inline cell editing             | Click a cell to edit — no modal required                              |
| No autosave; explicit commit    | Save button required; unsaved state marked clearly                    |

**Applicable to OPINION:** The dark-header section card pattern in FlowView's `SectionCard` is directly borrowed from this. The type-badge concept (MC, ST, LT abbreviations in QuestionCard) matches Supabase's column type badge.

---

### 2.2 FigJam

**Layout:** Full-screen infinite canvas with no persistent panels. Floating top toolbar (tools), floating bottom toolbar (reactions). Properties appear as a floating bar above selected elements.

| Pattern             | Detail                                                                 |
| ------------------- | ---------------------------------------------------------------------- |
| Click to select     | Single click selects; shows resize handles and connection ports        |
| Connection ports    | Hover near edge → blue dot appears; drag from port to create connector |
| Connector labels    | Double-click connector to add inline text label                        |
| Zoom                | Scroll-wheel / pinch; bottom-right controls; Shift+1 to fit screen     |
| Dot-grid background | 24px radial gradient — moves with pan offset                           |
| Grab cursor         | Click-drag on empty canvas to pan                                      |

**What FigJam does that OPINION's current FlowView is missing:**

- **Zoom** (critical gap — users with 20+ questions have no way to see the full canvas)
- **"Fit to screen" button** — users can pan off-screen with no recovery
- Connection port affordance

---

### 2.3 Figma Slides

**Layout:** Left panel 256px (slide thumbnails with drag-to-reorder), center full-canvas editor, right panel 240–280px (element properties).

| Pattern                          | Detail                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------ |
| Thumbnail list = navigation      | Click thumbnail → center canvas switches to that slide                         |
| Active state = blue left border  | Currently active item has a 2px blue left-border highlight                     |
| Add slide = bottom of left panel | "+ Add Slide" always at the bottom, never in the center                        |
| Center shows one thing at a time | Unlike Figma design mode's multi-frame canvas                                  |
| Right panel = contextual         | Shows element properties when selected, slide properties when nothing selected |

**Applicable to OPINION:** QuestionCard blue left-border active state is correct and matches this pattern exactly.

---

### 2.4 Top Survey Builders

**Typeform:**

- Left panel: question list with Logic tab at top
- Logic View is a dedicated view with a node canvas
- Logic rules: "If answer is [condition] → go to [question]" inline form rows

**SurveyMonkey:**

- Three tabs: Design / Preview / Results
- Skip Logic format: "If answer to Q3 is [X], skip to Q7" — most applicable for OPINION

**Tally:**

- Document-editor style (Notion-like) — "/" command menu for adding question types

**Google Forms:**

- Single-column, no panels, section-level branching only

---

## 3. Best-in-Class Pick

| Goal                    | Best reference               | Why                                                               |
| ----------------------- | ---------------------------- | ----------------------------------------------------------------- |
| Left panel navigation   | Figma Slides thumbnail list  | Blue left-border active, drag-to-reorder, numbered, add at bottom |
| List View center editor | SurveyMonkey / Typeform      | Type + required at top, field-specific settings below             |
| Flow canvas             | FigJam + Supabase node style | Dot-grid bg, pan/zoom, section cards as DB table cards            |
| Branching UI            | SurveyMonkey Skip Logic      | "If Q [condition] [value] → go to [destination]" rows             |
| Section cards in Flow   | Supabase Database Diagram    | Dark header, light rows, type badges in each row                  |
| Save state indicator    | Linear / Supabase Studio     | "Saving…" / "Saved X min ago" / amber dot for unsaved             |
| View toggle             | FigJam bottom toolbar        | Floating pill, doesn't compete with top bar                       |
| Empty state             | FigJam / Tally               | Centered illustration + single primary CTA                        |

---

## 4. Recommended Implementation for OPINION

### 4.1 Panel Layout and Widths

```
[Left Panel 240–280px] [Drag Handle 4px] [Center Canvas flex-1] [Right Panel 360–440px (Flow View only)]
```

- **Left Panel:** 240px default (xl: 260px), resizable 180–420px. White bg, `border-r border-[#e5e8eb]`
- **Center (List View):** White bg, max-content 900px centered, 48px padding, vertical scroll
- **Center (Flow View):** `#f6f7f9` dot-grid background, pan + zoom (50%–200%), "Fit to screen" button bottom-right
- **Right Panel (Flow View only):** 360px (lg: 400px, xl: 440px), white bg, `border-l border-[#e5e8eb]`
- **Top Bar (52px):** Left = breadcrumb + editable title. Right = save indicator + status badge + Publish button

---

### 4.2 List View Behavior

**Left Panel:**

- Numbered QuestionCards (Q1, Q2, Q3…)
- Active: 2px blue left border + `#ebf3fe` bg
- Hover: `#f6f7f9` bg, fade-in drag handle + duplicate/delete icons
- Delete disabled when `responseCount > 0`: muted icon, cursor-not-allowed, tooltip
- "Add question" at bottom, "Add section" at very bottom of footer

**Center (QuestionSettings `variant="center"`):**

- Max-width 900px, centered
- Header row: [type dropdown] [Required toggle]
- Title input below header
- Type-specific editor below title
- Empty state: icon + "왼쪽 패널에서 질문을 선택하세요"

---

### 4.3 Flow View Behavior

**Canvas enhancements over current state:**

- Zoom: scroll-wheel / trackpad pinch, 50%–200%
- Zoom indicator: bottom-right, "75%" with +/- buttons
- "Fit to screen": button at bottom-right; auto-triggers on first Flow View entry per session
- "Drag to pan" hint: bottom-left, visible when canvas has content

**Nodes (no sections):** 220×80px, white bg, rounded-lg, shadow-sm. Active: `outline: 2px solid #3182f6`

**Section cards (section mode):** 280px wide, dark header (`#1a1a1a`), 36px question rows with type badge + truncated title + Q-index

**Connectors:**

- Default chain: solid gray, 1.5px, arrowhead
- Branch: dashed blue, condition value label on mid-path pill
- Cubic bezier paths with 40% control points

---

### 4.4 Question Editing Experience

- **Type selector:** Disabled when `responseCount > 0` (opacity-50, cursor-not-allowed, tooltip)
- **Title input:** Full-width, `bg-[#f6f7f9]`, placeholder "What would you ask?", saves on blur
- **Required toggle:** Right-aligned in header row, 40×22px pill, blue when on
- **Logic section (P1):** Below type-specific editor. Rule: "If answer is [condition] [value] → go to [destination]". "+ Add condition" button. Broken reference: warning icon if destination deleted

---

### 4.5 States

| State                          | Visual indicators                                                             |
| ------------------------------ | ----------------------------------------------------------------------------- |
| Default (Draft, has questions) | Gray "Draft" badge, full editing enabled, save timestamp shown                |
| Loading                        | Skeleton cards in left panel, pulsing center block                            |
| Empty (no questions)           | Left panel empty state icon, center primary CTA "첫 번째 질문을 추가해보세요" |
| Edit-locked (responses exist)  | Amber banner, delete/type-change disabled                                     |
| Publish Validation Error       | PublishValidationPanel list below top bar, dismissible                        |
| Published (zero responses)     | Green badge, Publish button disabled, all editing allowed                     |
| Closed / Archived              | Status badge (red/gray), read-only banner, all editing disabled               |
| Saving                         | "Saving…" in top bar                                                          |
| Unsaved changes                | Amber dot + "Unsaved changes" in top bar                                      |

---

## 5. Interaction Flow Definition

### 5.1 Adding a Question (List View)

1. Click "+ 질문 추가" → type picker dropdown appears above button
2. Select type → `POST /api/surveys/{id}/questions`
3. New QuestionCard appears in left panel, auto-selected
4. Center canvas shows empty editor, title input focused
5. Type title → `updateQuestionTitle` (zustand); blur → `saveField("title", value)`

### 5.2 Switching to Flow View

1. Click "Flow" in ViewToggle → `setView("flow")`
2. FlowView fills center, right panel appears
3. FlowView computes positions from questions state
4. Active question highlighted (blue outline/border)
5. Click any node → `setActiveQuestion` → right panel updates

### 5.3 Publishing

1. Click "Publish" → `isPublishing = true`, button shows "Publishing…"
2. `POST /api/surveys/{id}/publish`
3. 200: `setSurveyStatus("published")`, green badge, button disabled
4. 422: PublishValidationPanel appears with error list
5. User fixes errors, retries

### 5.4 Setting a Branch Condition (P1 target)

1. In right panel, "Logic" section visible below type-specific editor
2. Click "+ Add condition"
3. Rule row: [If answer] [is] [value dropdown] [→ go to] [destination picker]
4. Select value + destination → saved to `question.config.conditions`
5. In Flow View: dashed blue arrow renders with condition label

### 5.5 Reordering Questions

1. Hover QuestionCard → drag handle fades in
2. Press and drag → dnd-kit activates, card semi-transparent, placeholder appears
3. Release → `arrayMove` → `reorderQuestions(orderedIds)` → `POST .../questions/reorder`
4. Flow View reactively recomputes positions from new order

---

## 6. States to Design (Figma Screens)

### Core Builder Screens

| ID    | Name                                                          |
| ----- | ------------------------------------------------------------- |
| SB-01 | List View — Default                                           |
| SB-02 | List View — Empty (no questions)                              |
| SB-03 | List View — Section Mode                                      |
| SB-04 | Flow View — Default (flat/no sections)                        |
| SB-05 | Flow View — Section Mode                                      |
| SB-06 | Flow View — Branching (dashed blue arrows + condition labels) |
| SB-07 | Flow View — Empty canvas                                      |

### Status / Overlay Screens

| ID    | Name                              |
| ----- | --------------------------------- |
| SB-08 | Edit-Locked Warning Banner        |
| SB-09 | Publish Validation Panel          |
| SB-10 | Published State                   |
| SB-11 | Closed / Archived Read-Only State |
| SB-12 | Saving Indicator                  |
| SB-13 | Unsaved Changes Indicator         |

### Component States

| ID    | Name                                |
| ----- | ----------------------------------- |
| SB-14 | QuestionCard — Default              |
| SB-15 | QuestionCard — Active               |
| SB-16 | QuestionCard — Hover (with actions) |
| SB-17 | QuestionCard — Delete Locked        |
| SB-18 | QuestionCard — Dragging             |
| SB-19 | Question Type Menu                  |
| SB-20 | ViewToggle — List Active            |
| SB-21 | ViewToggle — Flow Active            |
| SB-22 | SectionHeader — Default             |
| SB-23 | SectionHeader — Editing Title       |
| SB-24 | Logic Rule Row — Default            |
| SB-25 | Logic Rule Row — Broken Reference   |
| SB-26 | FlowNode — Default                  |
| SB-27 | FlowNode — Active                   |
| SB-28 | FlowNode — Hover                    |

---

## 7. Acceptance Criteria

### P0 — Blockers (gaps in current implementation)

- [ ] Flow View supports zoom via scroll-wheel + trackpad pinch (range 50%–200%)
- [ ] Flow View has a "Fit to screen" button that resets pan + zoom to frame all nodes
- [ ] ViewToggle "Q" button toggles left panel collapse/expand (currently unconnected)
- [ ] ViewToggle "Grid" button has a connected action or is removed
- [ ] `surveyStatus === 'closed' || 'archived'` shows a read-only banner and disables all editing
- [ ] List View center empty state has a primary CTA button when no questions exist

### P1 — Should Have

- [ ] Conditional logic editor in right panel (If/Then rule rows)
- [ ] Branch arrows in Flow View derived from `question.config.conditions`
- [ ] Branch arrow labels show condition value as mid-path pill
- [ ] Broken logic reference warning badge on QuestionCards
- [ ] Section collapse/expand toggle in left panel
- [ ] Positional add question (hover-triggered "+" between cards)

### P2 — Nice to Have

- [ ] Keyboard shortcuts (Escape deselect, Arrow keys navigate, D duplicate, Delete remove)
- [ ] Question search/filter in left panel
- [ ] Mini-map in Flow View for large surveys
- [ ] Undo/Redo (Ctrl+Z / Ctrl+Y)
- [ ] Full-screen preview modal from within the builder

---

## 8. Open Questions

1. **Logic as dedicated tab vs. Flow view toggle?** Typeform makes Logic a separate left-panel tab. Monitor usage before changing.
2. **Mobile strategy?** 3-panel layout doesn't work below 768px. Recommend: builder is desktop-only.
3. **Positional insertion?** Currently "Add question" appends to end. API must accept `insert_after_id` for positional inserts.
4. **Type change after responses — block or warn?** Currently fully blocked. Alternative: allow with warning modal. Product decision needed.
5. **Logic destination: questions or sections?** Recommend: route to individual questions (more precise).
6. **Section collapse persistence?** Use `localStorage` for MVP.

---

## 9. Handoff Summary

### → opin-ux-manager

Design all screens from Section 6. Priority order:

1. SB-01, SB-04, SB-02, SB-08, SB-09 (core + critical states)
2. SB-03, SB-05, SB-06 (section + branching)
3. Component states SB-14 through SB-28

Design constraints:

- Colors: `#3182f6` primary, `#333d4b` text, `#8b95a1` secondary, `#e5e8eb` border, `#f6f7f9` surface
- Dark section card header (`#1a1a1a`) is correct — do not lighten it
- ViewToggle stays at `bottom: 24px, center: 50%` in both views

---

### → opin-be

- **Publish validation:** Check all `config.conditions[].targetQuestionId` — if references non-existent question, return 422 "Broken logic reference in Question N"
- **Positional insertion:** Accept optional `insert_after_id` in `POST /api/surveys/{id}/questions`, reassign `order_index` from insertion point onwards
- **Logic conditions schema** (JSONB, no migration needed): `conditions: [{ value: string, targetQuestionId: string }]`

---

### → opin-fe

**P0 (immediate):**

1. **Zoom for FlowView:** Add `zoomLevel` state (default 1.0, range 0.5–2.0); handle `onWheel` event; apply `transform: scale(zoomLevel)` to canvas div; add +/- buttons + "Fit to screen"
2. **"Fit to screen":** Compute bounding box of all node positions, set `panOffset` + `zoomLevel` to center all nodes with 40px padding
3. **Left panel collapse:** Add `isLeftPanelCollapsed: boolean` to `BuilderStore`; wire to "Q" button in ViewToggle
4. **Closed/Archived banner:** Add read-only banner for closed/archived status below top bar

**P1 (next sprint):** 5. **`LogicRuleEditor` component** in `src/components/builder/editors/` 6. **Branch arrows from conditions:** In FlowView, read `question.config?.conditions` and add to `arrows` array 7. **Section collapse:** Add `collapsedSectionIds: Set<string>` to store; SectionHeader gets chevron toggle

---

### → opin-qa

Key test scenarios to add to `docs/policy/qa-scenarios.md`:

**View switching:**

- [ ] Switch List → Flow → List; active question preserved
- [ ] Adding question while in Flow View reflects in canvas immediately

**Edit lock:**

- [ ] `responseCount > 0`: delete button disabled with tooltip
- [ ] `responseCount > 0`: type selector disabled
- [ ] `surveyStatus === 'published'`: Publish button disabled

**Publish flow:**

- [ ] Succeeds with title + 1 complete question
- [ ] Returns 422 + error list when title missing
- [ ] Returns 422 + error list when question has insufficient options

**Auto-save:**

- [ ] Edit title → wait 1.5s → PATCH request fires
- [ ] `hasUnsavedChanges` true on first keystroke, false after save
- [ ] `beforeunload` dialog on navigation with unsaved changes

**Drag-to-reorder:**

- [ ] Drag question to new position → order updates in UI immediately
- [ ] Flow View node positions reflect new order

**Zoom (after P0):**

- [ ] Scroll-wheel zooms in/out; stays in 50–200% bounds
- [ ] "Fit to screen" frames all nodes with padding
