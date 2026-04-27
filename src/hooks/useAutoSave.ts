"use client";

import { useEffect, useRef } from "react";
import { Question } from "@/lib/types/survey";
import { useBuilderStore } from "@/lib/store/builder";

const DEBOUNCE_MS = 1500;

interface AutoSaveParams {
  surveyId: string | null;
  surveyTitle: string;
  questions: Question[];
}

/**
 * Handles auto-saving survey changes to the API.
 *
 * Strategy: debounce 1500ms after any change. Track a "snapshot" of the
 * last-saved question state so we only PATCH questions that are actually dirty,
 * avoiding redundant writes on every keystroke.
 */
export function useAutoSave({ surveyId, surveyTitle, questions }: AutoSaveParams): void {
  const hasUnsavedChanges = useBuilderStore((s) => s.hasUnsavedChanges);

  const lastSavedQuestionsRef = useRef<Map<string, Question>>(new Map());
  const lastSavedTitleRef = useRef<string>(surveyTitle);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!surveyId || !hasUnsavedChanges) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      // getState() gives stable action refs — not in dependency array
      const { setIsSaving, setLastSavedAt, setHasUnsavedChanges } = useBuilderStore.getState();

      setIsSaving(true);

      try {
        const savePromises: Promise<Response>[] = [];

        const titleChanged = surveyTitle !== lastSavedTitleRef.current;
        if (titleChanged) {
          savePromises.push(
            fetch(`/api/surveys/${surveyId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: surveyTitle }),
            })
          );
        }

        for (const question of questions) {
          const lastSaved = lastSavedQuestionsRef.current.get(question.id);
          const isDirty =
            !lastSaved ||
            lastSaved.title !== question.title ||
            lastSaved.required !== question.required ||
            lastSaved.type !== question.type ||
            JSON.stringify(lastSaved.options) !== JSON.stringify(question.options) ||
            JSON.stringify(lastSaved.config) !== JSON.stringify(question.config);

          if (isDirty) {
            savePromises.push(
              fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: question.title,
                  type: question.type,
                  options: question.options,
                  required: question.required,
                  config: question.config,
                }),
              })
            );
          }
        }

        if (savePromises.length === 0) {
          setHasUnsavedChanges(false);
          setIsSaving(false);
          return;
        }

        const results = await Promise.all(savePromises);
        const allOk = results.every((r) => r.ok);

        if (allOk) {
          setLastSavedAt(new Date());
          setHasUnsavedChanges(false);
          lastSavedTitleRef.current = surveyTitle;
          for (const question of questions) {
            lastSavedQuestionsRef.current.set(question.id, question);
          }
        }
      } catch (err) {
        console.error("[useAutoSave] save failed:", err);
      } finally {
        useBuilderStore.getState().setIsSaving(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [surveyId, surveyTitle, questions, hasUnsavedChanges]);
}
