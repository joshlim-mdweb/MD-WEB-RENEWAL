"use client";

import { useEffect } from "react";
import { useBuilderStore } from "@/lib/store/builder";
import { useToastStore } from "@/lib/store/toast";
import { type Question } from "@/lib/types/survey";

// Returns true when the currently focused element is an editable field.
// In that case, builder keyboard shortcuts must not fire — the keypress belongs to the field.
function isFocusInEditableField(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

// Strip fields that must not be copied into a pasted duplicate.
// ConditionalRules reference specific question/section IDs that are no longer valid
// on the new question, so we remove them to avoid silent routing bugs at survey runtime.
function cloneQuestionForClipboard(question: Question): Question {
  const config = question.config ? { ...question.config, conditionalRules: undefined } : null;
  return { ...question, config };
}

export function useBuilderKeyboard() {
  const {
    activeQuestionId,
    questions,
    responseCount,
    surveyId,
    clipboardQuestion,
    setClipboardQuestion,
    setPendingDeleteQuestionId,
    insertQuestionAfter,
    addQuestion,
  } = useBuilderStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    async function handleKeyDown(e: KeyboardEvent) {
      // Never intercept keypresses inside editable fields
      if (isFocusInEditableField()) return;

      const isMeta = e.metaKey || e.ctrlKey;

      // ── Cmd+C / Ctrl+C — copy active question to clipboard ──────────────────
      if (isMeta && e.key === "c" && !e.shiftKey && !e.altKey) {
        if (!activeQuestionId) return;
        const activeQuestion = questions.find((q) => q.id === activeQuestionId);
        if (!activeQuestion) return;

        // Prevent overriding browser text-selection copy when text is selected
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;

        e.preventDefault();
        setClipboardQuestion(cloneQuestionForClipboard(activeQuestion));
        showToast("질문이 복사되었습니다");
        return;
      }

      // ── Cmd+V / Ctrl+V — paste clipboard question after active question ──────
      if (isMeta && e.key === "v" && !e.shiftKey && !e.altKey) {
        if (!clipboardQuestion || !activeQuestionId || !surveyId) return;

        e.preventDefault();

        const res = await fetch(`/api/surveys/${surveyId}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: clipboardQuestion.type,
            title: clipboardQuestion.title ? `${clipboardQuestion.title} (copy)` : "",
            options: clipboardQuestion.options,
            required: clipboardQuestion.required,
            config: clipboardQuestion.config,
            // Paste into the same section as the active question, not the clipboard source.
            // The active question's section is always the user's current context.
            section_id:
              questions.find((q) => q.id === activeQuestionId)?.section_id ??
              clipboardQuestion.section_id,
          }),
        });
        if (!res.ok) return;

        const pasted: Question = await res.json();

        // Insert immediately after the active question in both store and UI
        insertQuestionAfter(activeQuestionId, pasted);
        showToast("질문이 붙여넣어졌습니다");
        return;
      }

      // ── Cmd+D / Ctrl+D — duplicate active question, insert immediately after ───
      if (isMeta && e.key === "d" && !e.shiftKey && !e.altKey) {
        if (!activeQuestionId || !surveyId) return;
        const activeQuestion = questions.find((q) => q.id === activeQuestionId);
        if (!activeQuestion) return;

        e.preventDefault();

        const newConfig = activeQuestion.config
          ? { ...activeQuestion.config, conditionalRules: undefined }
          : null;

        const res = await fetch(`/api/surveys/${surveyId}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: activeQuestion.type,
            title: activeQuestion.title ? `${activeQuestion.title} (copy)` : "",
            options: activeQuestion.options,
            required: activeQuestion.required,
            config: newConfig,
            section_id: activeQuestion.section_id,
          }),
        });
        if (!res.ok) return;

        const duplicated: Question = await res.json();
        insertQuestionAfter(activeQuestionId, duplicated);
        showToast("질문이 복제되었습니다");
        return;
      }

      // ── Delete / Backspace — trigger delete modal for active question ─────────
      // Only Delete (Windows) and Backspace (macOS) without modifiers.
      // Gated behind responseCount === 0 — structural edits are locked when responses exist.
      if ((e.key === "Delete" || e.key === "Backspace") && !isMeta && !e.shiftKey && !e.altKey) {
        if (!activeQuestionId) return;
        if (responseCount > 0) return;

        e.preventDefault();
        // Signal the QuestionCard with this ID to open its delete modal.
        // The card clears this flag itself after opening or dismissing the modal.
        setPendingDeleteQuestionId(activeQuestionId);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeQuestionId,
    questions,
    responseCount,
    surveyId,
    clipboardQuestion,
    setClipboardQuestion,
    setPendingDeleteQuestionId,
    insertQuestionAfter,
    addQuestion,
    showToast,
  ]);
}
