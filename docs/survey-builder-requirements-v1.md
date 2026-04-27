# Survey Builder — Section / Question List & Flow Mode

## Implementation-Ready Requirements

### Document Version: 1.0 | Analyst: OPIN_REQ_ANALYZER | Date: 2026-03-21

---

## 0. Codebase Baseline (Pre-PRD State)

The following is already implemented and must NOT be re-implemented:

| Area               | Current State                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Data hierarchy     | `surveys` → `sections` → `questions` (all tables exist with RLS)                                                          |
| Builder store      | `useBuilderStore` in `src/lib/store/builder.ts` — has sections, questions, activeQuestionId, activeSectionId, view toggle |
| Types              | `Section`, `Question`, `ConditionalRule`, `MultipleChoiceConfig` all exist in `src/lib/types/survey.ts`                   |
| List Mode          | `QuestionList.tsx` renders sections with `SectionCard` sub-component; question cards use dnd-kit sortable                 |
| Flow Mode          | `FlowView.tsx` renders pan/zoom canvas with section-DB-style cards and legacy flat mode                                   |
| Conditional logic  | `ConditionalLogicEditor.tsx` handles `multiple_choice` rules with `jump_to_section` and `jump_to_question` actions        |
| API routes         | CRUD for surveys, sections, questions all exist; section_id is required on question creation                              |
| Publish validation | `_validation.ts` validates title, options, scale/grade config, conditional logic references                               |
| Edit guard         | `responseCount > 0` disables delete and type-change in `QuestionCard.tsx`                                                 |

**Key gaps identified from PRD analysis:**

1. `NextTarget` data model is absent — questions and answer options have no typed routing pointer beyond `ConditionalRule` inside `MultipleChoiceConfig.conditionalRules`
2. List Mode lacks hover-triggered inline add buttons (section-level "add section below", question-level "add question below")
3. Cross-section drag: `handleDragEnd` in `QuestionList.tsx` does not update `section_id` when a question moves to a different section
4. Flow Mode is read-only — no edge creation via drag from node handle
5. Empty states exist for the section list but not per-section (empty section has no CTA)
6. Delete confirmation modals with impact warnings do not exist
7. `removeSection` in builder store reassigns orphaned questions to the first remaining section but does not delete the section from Supabase
8. Flow validation states (orphaned section, broken logic) are not surfaced in either mode
9. Section-level `NextTarget` (which section comes after this one) is not modeled at all

---

## 1. Information Architecture

### Purpose

Define the canonical three-tier hierarchy and the routing pointer model that governs how a respondent traverses a survey.

### Hierarchy

```
Survey
  └── Section (1..N, ordered by order_index)
        └── Question (1..N within section, ordered by order_index)
              └── Answer Options (for option-bearing types)
```

### NextTarget Model

A `NextTarget` describes where the respondent goes after completing a node. It is a discriminated union:

```typescript
type NextTargetType = "question" | "section" | "end";

interface NextTarget {
  type: NextTargetType;
  // Populated when type === "question"
  questionId?: string;
  // Populated when type === "section"
  sectionId?: string;
  // type === "end" requires no additional fields
}
```

`NextTarget` attaches to two places:

**A. Question-level default routing** — where the respondent goes after completing this question when no conditional rule matches.

```typescript
// Added to Question interface
interface Question {
  // ... existing fields
  next_target: NextTarget | null;
  // null means "continue to next question in order_index sequence" (current default behavior)
}
```

**B. Answer-option-level routing** — currently stored in `MultipleChoiceConfig.conditionalRules` as `ConditionalRule[]`. The existing `ConditionalRule` type must be extended to align with `NextTarget`:

```typescript
// Extended ConditionalRule (replaces current shape — backward compatible via optional fields)
interface ConditionalRule {
  answerValue: string;
  // Replaces the action + targetSectionId + targetQuestionId triple
  nextTarget: NextTarget;
}
```

**Migration note**: The existing `action / targetSectionId / targetQuestionId` fields in `ConditionalRule` must be preserved as optional deprecated fields during migration. The canonical field is `nextTarget`. The `ConditionalLogicEditor` must write `nextTarget` and also populate the deprecated fields for backward compat until a data migration is run.

### Section-level routing

Sections currently have no routing pointer. After the last question of a section, the runtime assumes "go to the next section by order_index". To support section-level conditional jumps (e.g., "skip Section 3 if user came from Section 1 path A"), the `sections` table needs a `next_target` column. This is a **P2 feature** — do not block P0/P1 on it.

---

## 2. Feature: List Mode — Section and Question Interaction

### Purpose

Give builders a keyboard-friendly, hover-driven panel for constructing the survey tree without leaving the panel.

### Priority: P0

---

### FR-1: Hover-based inline add actions

#### Normal Flow

1. User hovers over a `SectionCard` header row.
2. A ghost "+" button appears at the bottom edge of the section card (outside the card boundary, centered horizontally).
3. Clicking "+" creates a new section immediately below the hovered section (not at the end of the list).
4. User hovers over a `QuestionCard` row.
5. A ghost "+" button appears at the bottom edge of the question row.
6. Clicking "+" creates a new question of type `multiple_choice` immediately below the hovered question, in the same section.

#### Exception Flows

- If the survey is published (`surveyStatus === "published"`), the "+" buttons are visible but clicking them shows an inline tooltip: "Published surveys cannot be modified. Close the survey to edit."
- If `responseCount > 0` and status is `published`, same tooltip.
- If the API call to create a section/question fails (non-2xx), show a transient error toast and do not add to the store.

#### State Transition

```
QuestionCard state:
  default → hover (mouse enters) → [click "+"] → creating (spinner on "+" icon) → created (new card animates in)
  hover → default (mouse leaves without click)
  creating → error (API failure) → default
```

#### Conditions & Permissions

- Only survey creator can see the builder — auth is enforced by the page route, not repeated here.
- Inline add is disabled (grayed, cursor-not-allowed) when `surveyStatus !== "draft"`.

#### Edge Cases

- User rapidly hovers multiple question cards — only the currently hovered card shows the "+", previous one hides immediately.
- User moves mouse from question to the "+" button — the "+" must not disappear during this transition (use a hover group spanning both elements or a small delay).
- Survey has only 1 section and user adds a section below it — new section gets `order_index = 1`, existing section keeps `order_index = 0`.
- User adds a question below the last question of a section — the new question must get `section_id` of that section and `order_index = lastQuestion.order_index + 1`.
- User adds a question below a question that has `next_target` pointing to another question — the `next_target` of the source question does not automatically update (this is a non-obvious gap; document as a warning in the UI and in the validation layer).

#### Acceptance Criteria

- [ ] FE: `QuestionCard` exposes a hover group; the "+" button is only rendered when `group-hover` is active
- [ ] FE: `SectionCard` exposes a "+" at its bottom edge on hover
- [ ] FE: Both "+" buttons trigger `insertQuestionAfter` or a new `insertSectionAfter` store action respectively
- [ ] FE: Creating state shows a spinner / disabled "+" to prevent double-submission
- [ ] FE: Disabled state when `surveyStatus !== "draft"` — button is present but non-functional with tooltip
- [ ] BE: `POST /api/surveys/[id]/questions` already accepts `section_id` — no change needed for question add
- [ ] BE: `POST /api/surveys/[id]/sections` currently always appends at end — needs an optional `after_section_id` parameter to support insert-after behavior
- [ ] BE: When `after_section_id` is provided, all sections with `order_index >= target.order_index + 1` must have their `order_index` incremented by 1 in a single batch update before inserting the new section
- [ ] QA: Add section below first section — verify second section has order_index=1
- [ ] QA: Add question below middle question — verify section_id matches parent section
- [ ] QA: Rapid hover over 5 cards — verify only last hovered shows "+"
- [ ] QA: Published survey — verify "+" is visible but click shows tooltip, no API call fires

---

### FR-2: Section Auto-Height

#### Normal Flow

- Section card height in List Mode is determined by CSS flex/auto-height based on the number of question rows it contains.
- Adding or removing a question causes the section card to expand or contract without any explicit height calculation.

#### Current State

The `SectionCard` in `QuestionList.tsx` already uses `overflow-visible` with no fixed height — CSS auto-height is in effect. This requirement is functionally met.

#### Edge Cases

- Section with 0 questions: the section card must still display its header row and an empty-state CTA (see FR-5: Empty Section State).
- Section with 50+ questions: scroll within the panel, not within the section card. The section card grows but the parent `overflow-y-auto` container handles scrolling.

#### Acceptance Criteria

- [ ] FE: Verify section card height expands by exactly 40px per question added (current `h-10` per `QuestionCard`)
- [ ] FE: Section with 0 questions shows empty state row, not a collapsed header
- [ ] QA: Add 20 questions to one section — verify no overflow clipping, scroll works in panel

---

### FR-3: Cross-Section Question Drag

#### Purpose

Allow builders to drag a question from one section and drop it into a different section, updating both `order_index` and `section_id`.

#### Priority: P0

#### Normal Flow

1. User initiates drag on a question card in Section A.
2. During drag, question card shows reduced opacity (already implemented via `isDragging`).
3. User drags over Section B — Section B highlights with a blue border to indicate it can accept a drop.
4. User drops in Section B at position N.
5. Question is removed from Section A's question list and inserted at position N in Section B.
6. `section_id` on the question is updated to Section B's id.
7. `order_index` values for both sections' questions are recalculated.
8. API: `PATCH /api/surveys/[id]/questions/[qid]` is called with `{ section_id: sectionBId }`.
9. API: `POST /api/surveys/[id]/questions/reorder` is called with the new `orderedIds` for both affected sections.

#### Current Gap

`handleDragEnd` in `QuestionList.tsx` uses a flat `questions` array and calls `arrayMove` without checking whether the source and target questions belong to different sections. It does not update `section_id`. This must be fixed.

#### State Transition

```
Dragging:
  idle → drag-start (pointerdown) → dragging (pointer moves > threshold)
  dragging → drag-over-same-section → drop-same-section → reorder-only
  dragging → drag-over-other-section → drop-other-section → section_id + reorder update
  dragging → drag-cancel (Escape key) → idle (no change)
```

#### Conditions & Permissions

- Cross-section drag is disabled when `surveyStatus !== "draft"` or `responseCount > 0`.
- When disabled, drag handle renders with `cursor-not-allowed` and the drag sensor does not activate.

#### Edge Cases

- Dragging the only question in a section to another section — the source section becomes empty; it must not be automatically deleted. Show empty-section state (FR-5).
- Dragging a question that has `ConditionalRule` entries pointing to questions in a different section — the rules remain valid. No automatic invalidation.
- Dragging a question to a section that already contains 50 questions — no hard limit enforced in MVP; only warn if a soft limit is defined in policy (currently none).
- Dropping at the very top of a section (before all existing questions) — new `order_index` = 0, all other questions in that section increment by 1.
- Dropping between two questions in a different section — use dnd-kit's `over` position to determine insertion index.
- Two simultaneous users editing (not in MVP scope — document as known gap).

#### Acceptance Criteria

- [ ] FE: `DndContext` in `QuestionList.tsx` wraps all sections so cross-section drops are detected
- [ ] FE: `handleDragEnd` checks `active.data.current.sectionId !== over.data.current.sectionId` to detect cross-section drops
- [ ] FE: On cross-section drop, calls `updateQuestion(id, { section_id: newSectionId })` on the store AND fires `PATCH` to API
- [ ] FE: Section card renders a visual drop zone highlight (`ring-2 ring-[#3182f6]`) when a dragged question is over it
- [ ] BE: `PATCH /api/surveys/[id]/questions/[qid]` already accepts `section_id` — verify this path is exercised
- [ ] BE: `POST /api/surveys/[id]/questions/reorder` must accept a section-scoped or global reorder payload — currently accepts flat `orderedIds`; verify it correctly updates `order_index` for all affected questions
- [ ] QA: Drag question from Section 1 to Section 2 — verify DB `section_id` updated
- [ ] QA: Drag last question out of Section 1 — verify Section 1 shows empty-section state
- [ ] QA: Drag question to top of Section 2 — verify it gets order_index 0
- [ ] QA: Escape key during drag — verify no state change

---

### FR-4: Section Reorder via Drag

#### Purpose

Allow builders to reorder sections themselves (not just questions within sections).

#### Priority: P1

#### Normal Flow

1. User grabs the section drag handle (located in the section header row).
2. The entire section card (including its questions) becomes a drag overlay.
3. User drops the section between two other sections.
4. `order_index` values for all sections are recalculated.
5. API: `POST /api/surveys/[id]/sections/reorder` is called.

#### Current Gap

No section reorder API route exists. `reorderSections` store action exists but has no corresponding API call.

#### Edge Cases

- Reordering sections does not change question `order_index` values — questions are scoped to their section.
- If a question has a `ConditionalRule` pointing to a section that moves, the rule target ID remains valid (IDs do not change). No side effect.
- If a section has `next_target` (P2 feature), reordering may invalidate the pointer — this is not in scope for P1.

#### Acceptance Criteria

- [ ] FE: Section header row has a drag handle icon; `useSortable` wraps the section card
- [ ] FE: The DndContext for section drag is separate from (or correctly nested with) the question drag context
- [ ] FE: `handleSectionDragEnd` calls `reorderSections(newOrderedIds)` and fires `POST /api/surveys/[id]/sections/reorder`
- [ ] BE: New route `POST /api/surveys/[id]/sections/reorder` — accepts `{ orderedIds: string[] }`, batch-updates `order_index` for each section
- [ ] BE: Ownership check (creator_id === user.id) before executing reorder
- [ ] QA: Drag Section 3 to position 1 — verify all section order_index values are correct in DB
- [ ] QA: Reorder sections with questions — verify questions remain in their original sections

---

## 3. Feature: List Mode — Delete Confirmation with Impact Warning

### Purpose

Prevent accidental deletion of sections or questions that have downstream impact (questions in the section, conditional logic references).

### Priority: P0

---

### FR-6: Section Delete Confirmation Modal

#### Normal Flow

1. User clicks the delete icon on a section header.
2. A modal appears with:
   - Title: "Delete Section?"
   - Impact statement: "This section contains N question(s). All questions will also be deleted."
   - If any question in this section is referenced by a `ConditionalRule` in another question: "Warning: N question(s) in other sections have conditional logic pointing to questions in this section. Those rules will become broken."
   - CTA: "Delete Section" (destructive, red) | "Cancel"
3. User clicks "Delete Section".
4. API: `DELETE /api/surveys/[id]/sections/[sid]` is called.
5. All questions with `section_id === sid` are deleted (cascade in DB or explicit delete in API).
6. Store: `removeSection(sid)` runs.
7. Any `ConditionalRule` in remaining questions that references a now-deleted question ID is removed from config and saved.

#### Current Gap

- `removeSection` in the store reassigns orphaned questions to the first remaining section — this is wrong for delete. Delete should remove those questions or the API must handle cascade.
- No `DELETE /api/surveys/[id]/sections/[sid]` route exists.
- No modal component exists.

#### Exception Flows

- Section delete is blocked (`responseCount > 0`): the delete icon is hidden or disabled with tooltip "응답이 있어 삭제할 수 없습니다".
- If the section being deleted is the only section: modal message changes to "This is the only section. Deleting it will remove all questions and leave the survey empty."
- If the API call fails, the modal remains open and shows an inline error.

#### State Transition

```
Section header: idle → hover (delete icon appears) → click → modal-open
Modal: open → [Cancel] → closed (no change)
Modal: open → [Delete] → deleting (spinner on CTA) → success → closed + section removed from store
Modal: open → [Delete] → deleting → error → modal stays open + error message shown
```

#### Edge Cases

- Deleting a section with questions that themselves have ConditionalRules — the API must cascade-delete questions and their config data.
- After section delete, if `activeSectionId === sid`, set `activeSectionId` to the first remaining section or null.
- If the deleted section's questions were the `activeQuestionId`, set `activeQuestionId` to null.
- Survey has 2 sections; user deletes one — remaining section becomes the only section. No special state needed.
- Section has 0 questions — impact statement says "This section is empty." (no question count warning).

#### Acceptance Criteria

- [ ] FE: `DeleteSectionModal` component — shows question count + conditional logic impact warning
- [ ] FE: Delete icon on `SectionCard` header is hidden when `responseCount > 0`
- [ ] FE: On confirm, calls `DELETE /api/surveys/[id]/sections/[sid]`, then `removeSection(sid)` in store
- [ ] FE: After deletion, cleans up any `ConditionalRule` entries in remaining questions that point to deleted question IDs
- [ ] BE: `DELETE /api/surveys/[id]/sections/[sid]` — ownership check, then deletes section and all its questions (cascade or explicit)
- [ ] BE: Returns 204 on success, 404 if section not found or not owned
- [ ] QA: Delete section with 3 questions — verify all 3 questions deleted from DB
- [ ] QA: Delete section referenced by conditional logic in another section — verify broken rules are cleaned up
- [ ] QA: Cancel delete modal — verify no data changed
- [ ] QA: Survey with responseCount > 0 — verify delete icon is not present

---

### FR-7: Question Delete Confirmation Modal

#### Normal Flow

1. User clicks the delete icon on a question card.
2. A modal appears:
   - Title: "Delete Question?"
   - Impact: "This question will be permanently removed."
   - If another question has a `ConditionalRule` targeting this question: "Warning: N question(s) have conditional logic pointing to this question. Those rules will break."
   - CTA: "Delete Question" | "Cancel"
3. On confirm: `DELETE /api/surveys/[id]/questions/[qid]`, then `removeQuestion(qid)` in store.
4. Broken `ConditionalRule` entries in other questions are patched — remove the rule and save config.

#### Current State

`handleDelete` in `QuestionCard.tsx` deletes immediately with no modal. This must be upgraded.

#### Exception Flows

- `responseCount > 0`: delete icon is disabled, clicking shows tooltip (already implemented for `canDelete`). No modal needed.
- Last question in its section: question is deleted, section shows empty-section state.

#### Edge Cases

- Deleting the active question — `activeQuestionId` must auto-advance to next question or null.
- Deleting a question that is the target of a section-level `next_target` (P2 concern) — no action in P0.
- The question has `next_target` pointing to another question — that pointer is irrelevant once the question is deleted; no cleanup needed (the deleted question is gone).

#### Acceptance Criteria

- [ ] FE: `DeleteQuestionModal` component or inline confirm popover
- [ ] FE: Detect other questions' `ConditionalRule` entries that reference this question's id and show count in warning
- [ ] FE: On confirm, delete from API and remove from store; patch broken ConditionalRules in other questions
- [ ] QA: Delete question referenced by 2 conditional rules — verify both rules removed from other questions' configs
- [ ] QA: Delete last question in a section — verify section shows empty-section state

---

## 4. Feature: Empty States

### Purpose

Prevent builder confusion when the survey, a section, or the flow canvas has no content.

### Priority: P0

---

### FR-5: Empty Section State (List Mode)

#### Normal Flow

- When a section has 0 questions, the section card body (below the header row) renders an empty state.
- Empty state content: a muted placeholder row with text "질문이 없습니다" and a "+ 질문 추가" inline link.
- Clicking "+ 질문 추가" executes the same logic as the section-header "Add Question" button (creates `multiple_choice` question at the top of the section).

#### Current State

`QuestionList.tsx` `SectionCard` renders nothing in the question area when `questions.length === 0`. The `h-0` state is invisible and gives no affordance.

#### Edge Cases

- Section is newly created (just added) — it has 0 questions by default because the current `handleAddSection` auto-adds a question. If this behavior changes, the empty state must display.
- User deletes the last question from a section — empty state appears immediately without page reload.

#### Acceptance Criteria

- [ ] FE: `SectionCard` in `QuestionList.tsx` renders empty state row when `questions.length === 0`
- [ ] FE: Empty state row has "질문이 없습니다 — + 추가" text; clicking triggers `handleAddQuestion`
- [ ] QA: Delete all questions from a section — verify empty state appears
- [ ] QA: Click empty state CTA — verify new question is created and selected

---

### FR-8: Empty Survey State (List Mode)

#### Normal Flow

- When the survey has 0 sections (which by extension means 0 questions), the entire list panel area renders a centered empty state.
- Content: icon + "섹션을 추가하여 시작하세요" text + "섹션 추가" primary button.

#### Current State

`QuestionList.tsx` already implements this empty state for the `sections.length === 0` case.

#### Acceptance Criteria

- [ ] FE: Verify empty state renders when `sections.length === 0` — already implemented, write regression test
- [ ] QA: New survey (sections=0) — verify empty state with CTA button is visible

---

### FR-9: Empty Flow State

#### Normal Flow

- When `questions.length === 0`, `FlowView.tsx` renders a centered message.

#### Current State

`FlowView.tsx` already implements this: "No questions yet. Add questions in List view to see the flow."

#### Acceptance Criteria

- [ ] FE: Verify empty flow state message is present — already implemented
- [ ] QA: Empty survey in flow mode — verify message is shown, not a blank canvas

---

## 5. Feature: Flow Mode — NextTarget Visualization

### Purpose

Make the respondent's routing path visible as directed edges on the canvas, including conditional branches.

### Priority: P1

---

### FR-10: Conditional Branch Edges in Flow Mode

#### Current State

`FlowView.tsx` renders straight vertical arrows between sections (section-DB-diagram style). Conditional jumps from `MultipleChoiceConfig.conditionalRules` are not visualized in section mode — only in the legacy flat mode via `LegacyArrow`.

#### Normal Flow

1. When section mode is active and a question has `conditionalRules`, the `SectionCard` renders that question row with a branch indicator icon (a split-arrow symbol).
2. The `SectionArrows` SVG layer renders additional curved arrows:
   - From the source question row's right edge to the target section's top-left corner (for `jump_to_section` rules).
   - From the source question row's right edge to the target question row's right edge (for `jump_to_question` rules), rendered as a curved path that goes outside the card boundaries.
3. Each branch arrow has a label chip showing the `answerValue` that triggers it (truncated to 12 chars).

#### Conditions

- Branch arrows are only rendered when the source question's `config.conditionalRules` array is non-empty.
- A `jump_to_section` rule pointing to a non-existent section ID renders the arrow with a dashed red stroke (broken rule indicator).
- A `jump_to_question` rule pointing to a non-existent question ID renders the arrow with a dashed red stroke.

#### Edge Cases

- Multiple conditional rules from the same question: render one arrow per rule, fanned out at the source.
- Circular rule (Question A → jump to Question A): renders as a self-loop arrow; does not crash rendering but is flagged as a validation error in the publish panel.
- The source question is in Section 1 and the target question is in Section 3: the arrow spans across Section 2's card. The SVG `overflow: visible` already handles this.
- Zoom level is very small (0.5): label chips may overlap. They are rendered regardless; zoom handling is a UX concern.

#### Acceptance Criteria

- [ ] FE: `SectionArrows` component accepts a `branchEdges` prop that describes each conditional jump
- [ ] FE: Branch edges render as `strokeDasharray="5,3"` curved paths in blue (`#3182f6`)
- [ ] FE: Broken branch edges (target not found) render in red with `strokeDasharray="4,4"`
- [ ] FE: Branch label chips show truncated `answerValue`
- [ ] FE: Section mode question row shows a branch icon when `conditionalRules.length > 0`
- [ ] QA: Question with 3 conditional rules — verify 3 branch arrows render
- [ ] QA: Delete the target question — refresh flow view — verify broken rule shown in red

---

### FR-11: Flow Mode — Read-Only (No Edge Drag)

#### Decision

Edge creation via drag-from-handle is a P2 feature. In P0/P1, Flow Mode remains read-only (pan, zoom, click to select). Edge routing is configured exclusively in the QuestionSettings panel (via `ConditionalLogicEditor`).

#### Reason

Implementing drag-to-connect on the SVG canvas requires significant pointer event coordination that conflicts with the existing pan/zoom logic. The current `handleMouseDown` in `PanCanvas` propagates to the canvas background and already has a `[data-flow-node]` guard. Adding handle-specific drag logic risks breaking pan behavior.

#### Acceptance Criteria

- [ ] FE: No drag-from-handle UI is added in P0/P1
- [ ] FE: Flow node hover shows a tooltip: "조건 분기는 질문 설정에서 구성하세요" (configure branching in question settings)
- [ ] QA: Hover over section card — verify no drag handles appear on card edges

---

## 6. Feature: List/Flow Sync

### Purpose

Ensure that selecting a question in one mode automatically reflects in the other, so switching views feels coherent.

### Priority: P0

---

### FR-12: Bidirectional Selection Sync

#### Normal Flow

- Clicking a question card in List Mode sets `activeQuestionId` in the builder store.
- Switching to Flow Mode: the canvas auto-scrolls/pans to bring the active question's node into view and highlights it.
- Clicking a question row inside a `SectionCard` in Flow Mode sets `activeQuestionId` (already implemented via `onSelectQuestion`).
- Switching to List Mode: the `QuestionList` scrolls to the active question card using `data-question-id` attr (already implemented via `scrollToQuestion`).

#### Current Gap

Flow Mode does not pan to center the active question node when the mode is switched. `PanCanvas` only auto-fits on mount (`useEffect` with empty dep array).

#### Edge Cases

- Active question is in a section that is outside the viewport after pan — flow view must re-pan to it.
- Active question is deleted while in Flow Mode — `activeQuestionId` becomes null; no scroll target; canvas stays at current position.
- Rapid view toggle (List → Flow → List in < 200ms) — store state is synchronous; no race condition.

#### Acceptance Criteria

- [ ] FE: When `view` changes from "list" to "flow", `PanCanvas` checks `activeQuestionId` and pans to center the corresponding section card
- [ ] FE: The pan animation uses the same `setPanOffset` mechanism; duration ~150ms
- [ ] FE: When `view` changes from "flow" to "list", `scrollToQuestion(activeQuestionId)` is called
- [ ] QA: Select question in List Mode, switch to Flow Mode — verify question's section card is centered
- [ ] QA: Select question in Flow Mode, switch to List Mode — verify question card is scrolled into view

---

## 7. Feature: Publish Validation Enhancements

### Purpose

Surface all validation errors — including broken conditional logic — as annotated warnings in both List Mode and Flow Mode before publish.

### Priority: P1

---

### FR-13: Per-Question Validation Indicators in List Mode

#### Normal Flow

- The publish validation runs client-side on the zustand store state (not only on server publish attempt).
- Each question card in List Mode that has a validation error shows a red dot on its type badge.
- Each question card with a warning (e.g., has a conditional rule pointing to an ID that is later in order but is in a lower-numbered section — technically valid but unusual) shows an amber dot.
- Hovering the dot shows a tooltip with the specific error message.

#### Current State

`PublishValidationPanel.tsx` shows a list of errors in the builder header area but does not annotate individual question cards.

#### Conditions

- Validation runs after every debounced content change (300ms debounce to avoid re-running on every keystroke).
- Validation state is stored in the builder store as `validationErrors: ValidationError[]`.

#### Edge Cases

- A question has both an error (no title) and a warning (broken conditional rule) — show red dot (error takes priority).
- Validation runs while auto-save is in progress — run validation on local store state, not server state.

#### Acceptance Criteria

- [ ] FE: `useBuilderStore` gains a `validationErrors: ValidationError[]` field and a `setValidationErrors` action
- [ ] FE: `validateSurveyForPublish` from `_validation.ts` is imported into a client-side hook that re-runs on store change (debounced)
- [ ] FE: `QuestionCard` reads from `validationErrors` and renders a red dot when its question ID appears in errors
- [ ] QA: Question with no title — verify red dot appears on card
- [ ] QA: Fix question title — verify red dot disappears within 300ms

---

## 8. Data Model Changes

### Priority: P0

---

### 8.1 `questions` Table — Add `next_target` Column

```sql
ALTER TABLE questions
  ADD COLUMN next_target JSONB DEFAULT NULL;

-- Example value:
-- { "type": "section", "sectionId": "uuid-here" }
-- { "type": "question", "questionId": "uuid-here" }
-- { "type": "end" }
-- NULL means "continue to next in sequence"
```

**Validation constraint (enforced at API layer, not DB constraint):**

- `next_target.type` must be one of `"question" | "section" | "end"`.
- If `type === "question"`, `questionId` must be a non-empty string. Existence check is done at publish validation time, not on every save.
- If `type === "section"`, `sectionId` must be a non-empty string.

**API change:** `PATCH /api/surveys/[id]/questions/[qid]` must add `next_target` to `allowedFields`.

**Type change:** `Question` interface gains `next_target: NextTarget | null`.

---

### 8.2 `ConditionalRule` — Add `nextTarget` Field

The existing `ConditionalRule` type in `src/lib/types/survey.ts` is extended:

```typescript
interface ConditionalRule {
  answerValue: string;
  // New canonical field
  nextTarget: NextTarget;
  // Deprecated — keep for backward compat until migration
  action?: "jump_to_section" | "jump_to_question";
  targetSectionId?: string;
  targetQuestionId?: string;
}
```

The `ConditionalLogicEditor` must write both `nextTarget` and the deprecated fields when saving rules. This ensures any code still reading the deprecated shape continues to work.

---

### 8.3 New API Route — `DELETE /api/surveys/[id]/sections/[sid]`

```
DELETE /api/surveys/[id]/sections/[sid]
Auth: required (creator_id === user.id)

Steps:
1. Verify survey ownership.
2. Delete all questions WHERE section_id = sid (hard delete — only allowed when responseCount = 0).
3. Delete the section WHERE id = sid.
4. Return 204.

Errors:
- 404: section not found or not owned
- 403: survey has responses (responseCount > 0) — do not delete
- 500: DB error
```

---

### 8.4 New API Route — `POST /api/surveys/[id]/sections/reorder`

```
POST /api/surveys/[id]/sections/reorder
Body: { orderedIds: string[] }
Auth: required

Steps:
1. Verify survey ownership.
2. Verify all IDs in orderedIds belong to this survey.
3. Batch update: for each id at index i, set order_index = i.
4. Return 200 with updated sections array.

Errors:
- 400: orderedIds contains IDs not belonging to this survey
- 404: survey not found
```

---

### 8.5 API Route Change — `POST /api/surveys/[id]/sections` — Support `after_section_id`

```
POST /api/surveys/[id]/sections
Body: { title?: string, after_section_id?: string }

If after_section_id is provided:
  1. Fetch the target section, get its order_index (targetIndex).
  2. Increment order_index for all sections WHERE order_index > targetIndex by 1 (batch update).
  3. Insert new section with order_index = targetIndex + 1.

If after_section_id is not provided (existing behavior):
  Append at end (order_index = max + 1).
```

---

## 9. Builder Store Changes

### Priority: P0

---

### 9.1 New actions needed in `useBuilderStore`

```typescript
// Insert a section at a specific position (after a given section ID)
insertSectionAfter: (afterSectionId: string, section: Section) => void;

// Validation state
validationErrors: ValidationError[];
setValidationErrors: (errors: ValidationError[]) => void;
```

### 9.2 Fix `removeSection`

Current behavior: reassigns orphaned questions to the first remaining section.

Required behavior: removes all questions that belong to the deleted section (hard delete from local state). The API handles server-side cascade.

```typescript
removeSection: (sectionId: string) =>
  set((state) => {
    const remaining = state.sections.filter((s) => s.id !== sectionId);
    const remainingQuestions = state.questions.filter((q) => q.section_id !== sectionId);
    const wasActive = state.activeSectionId === sectionId;
    const wasActiveQuestion = state.questions.find(
      (q) => q.section_id === sectionId && q.id === state.activeQuestionId
    );
    return {
      sections: remaining,
      questions: remainingQuestions,
      activeSectionId: wasActive ? (remaining[0]?.id ?? null) : state.activeSectionId,
      activeQuestionId: wasActiveQuestion
        ? (remainingQuestions[0]?.id ?? null)
        : state.activeQuestionId,
      hasUnsavedChanges: true,
    };
  });
```

---

## 10. Complete Edge Case Registry

### Survey / Section / Question Structural Edge Cases

| ID    | Scenario                                                              | Expected Behavior                                                                                                                 | Priority                 |
| ----- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| EC-01 | Survey has 0 sections                                                 | Empty state panel with "섹션 추가" CTA                                                                                            | P0                       |
| EC-02 | Section has 0 questions                                               | Empty section row with "+ 질문 추가" CTA                                                                                          | P0                       |
| EC-03 | Survey has 1 section only                                             | Delete section modal warns "only section — all questions will be removed"                                                         | P0                       |
| EC-04 | Delete section with questions that are referenced by ConditionalRules | Show impact count in modal; clean up orphaned rules after delete                                                                  | P0                       |
| EC-05 | Delete question that is target of a ConditionalRule                   | Show impact count in modal; remove the rule from source question's config                                                         | P0                       |
| EC-06 | Cross-section drag of question with ConditionalRules                  | Rules remain valid — target IDs do not change; no cleanup needed                                                                  | P0                       |
| EC-07 | Drag last question out of a section                                   | Source section becomes empty; show empty-section state                                                                            | P0                       |
| EC-08 | Add question below a question with next_target set                    | next_target of source question is NOT auto-updated                                                                                | P0 — document as warning |
| EC-09 | Survey published — all edit actions                                   | Edit actions (add/delete/drag) disabled; tooltip shown                                                                            | P0                       |
| EC-10 | responseCount > 0 — delete actions                                    | Delete disabled; drag disabled                                                                                                    | P0                       |
| EC-11 | ConditionalRule circular reference (Q → Q)                            | Renders as self-loop in Flow Mode; publish validation blocks publish                                                              | P1                       |
| EC-12 | ConditionalRule pointing to a lower-order question (backward jump)    | Valid — no restriction. Displayed in Flow Mode as a backward edge                                                                 | P1                       |
| EC-13 | Flow Mode: active question outside current viewport after pan         | Re-pan to center active section card when view toggles                                                                            | P1                       |
| EC-14 | Rapid section add (double-click on "+ 섹션 추가")                     | Second API call must not fire while first is in-flight; disable button during creation                                            | P0                       |
| EC-15 | Section title empty string                                            | Allowed — renders as "Section N" in UI                                                                                            | P0                       |
| EC-16 | Question title empty string                                           | Allowed in draft; blocked at publish                                                                                              | P0                       |
| EC-17 | 50+ questions in one section                                          | No hard limit; scroll within list panel; Flow Mode card grows; no crash                                                           | P1                       |
| EC-18 | section_id on a question references a non-existent section            | Should not happen via the builder (API enforces section ownership); treat as data integrity error; show warning in UI if detected | P2                       |
| EC-19 | Reorder sections while auto-save is in flight                         | Optimistic update applied immediately; server reconciles on next auto-save trigger                                                | P1                       |
| EC-20 | Drag question to a different section while auto-save is in flight     | Optimistic update applied; PATCH for section_id is batched with the next auto-save                                                | P1                       |

---

## 11. FE Component Specification

### New Components Required

| Component             | Location                  | Props                                                                                                           | Responsibility                                                   |
| --------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `DeleteSectionModal`  | `src/components/builder/` | `section: Section, questionCount: number, brokenRuleCount: number, onConfirm: () => void, onCancel: () => void` | Confirm section delete with impact warning                       |
| `DeleteQuestionModal` | `src/components/builder/` | `question: Question, brokenRuleCount: number, onConfirm: () => void, onCancel: () => void`                      | Confirm question delete with impact warning                      |
| `InlineAddButton`     | `src/components/builder/` | `onClick: () => void, isCreating: boolean, disabled: boolean, tooltip?: string`                                 | Hover-revealed "+" button — reused by section and question cards |

### Existing Components Requiring Change

| Component                | File                                                        | Change Required                                                                                                                             |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `QuestionCard`           | `src/components/builder/QuestionCard.tsx`                   | Replace immediate-delete with modal trigger; add hover-group "+" button at bottom; add red-dot validation indicator                         |
| `SectionCard` (list)     | `src/components/builder/QuestionList.tsx`                   | Add delete icon in header; add drag handle for section reorder; add empty-section state; add hover "+" at bottom edge                       |
| `QuestionList`           | `src/components/builder/QuestionList.tsx`                   | Fix cross-section drag in `handleDragEnd`; add `insertSectionAfter` call; wrap sections in a separate `SortableContext` for section reorder |
| `FlowView`               | `src/components/builder/FlowView.tsx`                       | Add branch edge rendering for `conditionalRules` in section mode; add auto-pan to active question on view switch                            |
| `SectionArrows`          | Inside `FlowView.tsx`                                       | Accept `branchEdges` prop; render branch arrows with labels                                                                                 |
| `ConditionalLogicEditor` | `src/components/builder/editors/ConditionalLogicEditor.tsx` | Write `nextTarget` field on `ConditionalRule` in addition to deprecated fields                                                              |

---

## 12. BE Specification Summary

### New Routes

| Method   | Path                                 | Body                       | Response         | Notes                                                  |
| -------- | ------------------------------------ | -------------------------- | ---------------- | ------------------------------------------------------ |
| `DELETE` | `/api/surveys/[id]/sections/[sid]`   | —                          | 204              | Cascade-delete questions; blocked if responseCount > 0 |
| `POST`   | `/api/surveys/[id]/sections/reorder` | `{ orderedIds: string[] }` | 200 + sections[] | Batch-update order_index                               |

### Changed Routes

| Method  | Path                                | Change                                                                               |
| ------- | ----------------------------------- | ------------------------------------------------------------------------------------ |
| `POST`  | `/api/surveys/[id]/sections`        | Add optional `after_section_id` param; increment siblings' order_index before insert |
| `PATCH` | `/api/surveys/[id]/questions/[qid]` | Add `next_target` to `allowedFields`                                                 |

### DB Migration Required

```sql
-- Add next_target to questions
ALTER TABLE questions ADD COLUMN next_target JSONB DEFAULT NULL;

-- No constraint at DB level — validation is application-level
-- No migration of existing conditionalRules data required in P0
```

### Validation Layer (`_validation.ts`) Changes

Add check for `next_target` references at publish time:

```
For each question:
  If question.next_target is not null:
    If next_target.type === "question" AND next_target.questionId not in questionIdSet:
      → Error: "Question N references a non-existent next question target"
    If next_target.type === "section" AND next_target.sectionId not in sectionIdSet:
      → Error: "Question N references a non-existent next section target"
```

---

## 13. QA Scenarios Checklist

### List Mode — Section Management

- [ ] QA-L-01: Create new survey — verify Section 1 with one blank question is auto-created
- [ ] QA-L-02: Add section via header button — verify new section appears at end, gets correct order_index
- [ ] QA-L-03: Add section below Section 1 via hover "+" — verify new section gets order_index=1 and Section 2 becomes order_index=2
- [ ] QA-L-04: Rename section (click title, type, blur) — verify update saved to DB
- [ ] QA-L-05: Delete section with 0 questions — verify modal shows empty section message, confirm removes section
- [ ] QA-L-06: Delete section with 3 questions — verify all 3 questions removed from DB
- [ ] QA-L-07: Delete section whose questions are referenced by ConditionalRules — verify warning count in modal, verify rules removed after confirm
- [ ] QA-L-08: Cancel delete section modal — verify no data changed
- [ ] QA-L-09: Reorder sections by drag — verify order_index values correct in DB after drop
- [ ] QA-L-10: Delete only section — verify modal warns it's the only section

### List Mode — Question Management

- [ ] QA-L-11: Add question in section (via section header button) — verify created with correct section_id and order_index
- [ ] QA-L-12: Add question below middle question (hover "+") — verify inserted at correct position
- [ ] QA-L-13: Drag question within same section (reorder) — verify order_index updated, section_id unchanged
- [ ] QA-L-14: Drag question to different section — verify section_id updated in DB, order_index correct in both sections
- [ ] QA-L-15: Drag last question out of its section — verify source section shows empty-section state
- [ ] QA-L-16: Delete question with no impact — confirm removes it
- [ ] QA-L-17: Delete question referenced by ConditionalRule — verify warning count in modal, rule removed after confirm
- [ ] QA-L-18: Duplicate question — verify copy inserted after original with "(copy)" title suffix and same section_id

### List Mode — Disabled States

- [ ] QA-L-19: Published survey — hover over question card — verify delete and drag disabled
- [ ] QA-L-20: Published survey — hover "+" buttons — verify buttons present but clicking shows tooltip, no API call
- [ ] QA-L-21: Survey with responseCount > 0 — verify question delete disabled

### Flow Mode

- [ ] QA-F-01: Empty survey in flow mode — verify placeholder message, not blank canvas
- [ ] QA-F-02: Survey with 2 sections, 3 questions each — verify 2 section cards render with correct question rows
- [ ] QA-F-03: Select question in list mode, switch to flow mode — verify that section card is centered in viewport
- [ ] QA-F-04: Select question row in flow mode section card, switch to list mode — verify question card scrolled into view
- [ ] QA-F-05: Question with ConditionalRule → jump_to_section — verify branch arrow renders in blue
- [ ] QA-F-06: Question with ConditionalRule referencing non-existent section — verify red dashed arrow
- [ ] QA-F-07: Zoom to 50% — verify branch labels still render (no crash)
- [ ] QA-F-08: Pan canvas — verify dot grid moves with pan

### Validation

- [ ] QA-V-01: Question with empty title — verify red dot on card in list mode
- [ ] QA-V-02: Fix question title — verify red dot disappears within 300ms
- [ ] QA-V-03: Multiple choice with 1 option — verify red dot on card
- [ ] QA-V-04: Publish with broken ConditionalRule reference — verify server returns validation error
- [ ] QA-V-05: Publish with next_target pointing to deleted question — verify server returns error

### Data Integrity

- [ ] QA-D-01: Add section below Section 1 — check DB: new section order_index=1, old Section 2 now order_index=2
- [ ] QA-D-02: Delete section — check DB: section row gone, all child questions gone
- [ ] QA-D-03: Cross-section drag — check DB: question.section_id updated, order_index correct
- [ ] QA-D-04: Reorder sections — check DB: order_index reflects new order
- [ ] QA-D-05: Set next_target on question — check DB: questions.next_target JSONB column has correct value

---

## 14. Open Questions

| #    | Question                                                                                                                                                                                                                                 | Owner             | Decision Needed By  |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------- |
| OQ-1 | Should section delete be allowed when responseCount > 0 (only block question delete)? Current spec blocks both.                                                                                                                          | OPINION_MASTER    | Before P0 sprint    |
| OQ-2 | Is backward jump (Q5 → Q2 via ConditionalRule) valid in the respondent runtime? If yes, must the flow renderer show it as a backward-curving edge?                                                                                       | OPIN_FE + OPIN_BE | Before P1 sprint    |
| OQ-3 | Does the `next_target` column on `questions` replace `ConditionalRule` or complement it? Current spec treats `next_target` as the "default next" pointer and `ConditionalRule` as the "conditional override". Confirm this mental model. | OPINION_MASTER    | Before DB migration |
| OQ-4 | Should cross-section drag be disabled when `responseCount > 0`, or only question delete? Reordering does not lose data, so an argument exists for allowing it.                                                                           | OPINION_MASTER    | Before P0 sprint    |
| OQ-5 | What is the maximum number of sections per survey in MVP? No policy limit is defined. Without a limit, Flow Mode canvas height is unbounded. Recommended: soft warn at 10 sections.                                                      | OPINION_MASTER    | Before P1 sprint    |
| OQ-6 | Should the `ConditionalLogicEditor` surface `next_target` for non-option-bearing question types (e.g., short_text → jump to section on completion)? Current scope: option-bearing types only.                                            | OPIN_UX_MANAGER   | Before P1 sprint    |

---

## 15. Feature Priority Summary

| Feature                                                        | FR ID                  | Priority | Effort Estimate |
| -------------------------------------------------------------- | ---------------------- | -------- | --------------- |
| NextTarget data model (type + DB column)                       | Section 8.1            | P0       | S               |
| Cross-section question drag                                    | FR-3                   | P0       | M               |
| Hover-based inline add (question below)                        | FR-1                   | P0       | S               |
| Section delete with cascade + modal                            | FR-6                   | P0       | M               |
| Question delete with modal (replace immediate delete)          | FR-7                   | P0       | S               |
| Empty section state (CTA row)                                  | FR-5                   | P0       | XS              |
| `removeSection` store fix (delete children, not reassign)      | Section 9.2            | P0       | XS              |
| `DELETE /api/surveys/[id]/sections/[sid]` API                  | Section 8.3            | P0       | S               |
| `next_target` in `allowedFields` for PATCH questions           | Section 8.2            | P0       | XS              |
| Section reorder via drag                                       | FR-4                   | P1       | M               |
| `POST /api/surveys/[id]/sections/reorder` API                  | Section 8.4            | P1       | S               |
| Hover "add section below"                                      | FR-1 (section variant) | P1       | S               |
| `POST /api/surveys/[id]/sections` — `after_section_id` support | Section 8.5            | P1       | S               |
| Branch edge visualization in Flow Mode section cards           | FR-10                  | P1       | M               |
| Auto-pan to active question on view switch                     | FR-12                  | P1       | S               |
| Per-question validation indicators in List Mode                | FR-13                  | P1       | S               |
| ConditionalRule nextTarget field + backward compat             | Section 8.2            | P1       | S               |
| Flow Mode hover tooltip (read-only)                            | FR-11                  | P1       | XS              |
| Section-level next_target routing                              | Section 1              | P2       | L               |
| Flow Mode edge creation by drag                                | FR-11 (inverted)       | P2       | XL              |

**Effort key:** XS < 2h, S < 4h, M < 1 day, L < 3 days, XL > 3 days
