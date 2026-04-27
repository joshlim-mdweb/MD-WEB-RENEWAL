/**
 * Survey publish validation.
 *
 * This module contains all business rules that must pass before a survey
 * transitions to 'published'. It is intentionally pure (no I/O) so it can
 * be called from both the /publish endpoint and client-side pre-flight checks
 * without additional Supabase reads.
 *
 * Import path for client components: '@/lib/survey-validation'
 * Import path for API routes:        '@/lib/survey-validation'
 */

import type { QuestionType } from "@/lib/types/survey";

// Minimal shape we need from the DB for validation — avoids over-fetching.
export interface ValidationQuestion {
  id: string;
  type: QuestionType;
  title: string;
  options: string[] | null;
  order_index: number;
  required: boolean;
  config: Record<string, unknown> | null;
  next_target?: { type: string; targetId: string | null } | null;
}

export interface ValidationSurvey {
  title: string;
  questions: ValidationQuestion[];
  sectionIds?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  // questionId is included when the error is tied to a specific question,
  // enabling the client to scroll/focus that question on click.
  questionId?: string;
}

// Question types that require options (at least 2, no empty strings).
const OPTION_BEARING_TYPES: QuestionType[] = ["multiple_choice", "checkbox", "dropdown", "ranking"];

/**
 * Validates a survey against publish requirements.
 *
 * Rules:
 * - title must not be empty or whitespace-only
 * - must have at least 1 non-endpoint question
 * - every option-bearing question must have >= 2 options
 * - no option may be an empty/whitespace-only string
 *
 * Returns an empty array when the survey is valid.
 */
export function validateSurveyForPublish(survey: ValidationSurvey): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!survey.title.trim()) {
    errors.push({ field: "title", message: "설문 제목을 입력해 주세요." });
  }

  const nonEndpointQuestions = survey.questions.filter((q) => q.type !== "endpoint");

  if (nonEndpointQuestions.length === 0) {
    errors.push({
      field: "questions",
      message: "At least one question is required",
    });
  }

  // Sort by order_index to produce stable, user-facing indices in error messages.
  const sortedQuestions = [...survey.questions].sort((a, b) => a.order_index - b.order_index);

  // Build ID sets for reference validation
  const questionIdSet = new Set(sortedQuestions.map((q) => q.id));
  const sectionIdSet = new Set(survey.sectionIds ?? []);

  for (let i = 0; i < sortedQuestions.length; i++) {
    const question = sortedQuestions[i];

    // P1-1: every question must have a non-empty title.
    if (!question.title.trim()) {
      errors.push({
        field: `questions[${i}].title`,
        message: `Question ${i + 1} must have a title`,
        questionId: question.id,
      });
    }

    // P1-2: endpoint questions may not be required — they are structural, not data-collecting.
    if (question.type === "endpoint" && question.required) {
      errors.push({
        field: `questions[${i}].required`,
        message: `Endpoint question ${i + 1} cannot be marked as required`,
        questionId: question.id,
      });
    }

    // P1-3: scale and grade questions must have valid numeric min/max in config.
    if (question.type === "scale" || question.type === "grade") {
      const cfg = question.config;
      if (
        cfg === null ||
        typeof cfg.min !== "number" ||
        typeof cfg.max !== "number" ||
        cfg.min >= cfg.max
      ) {
        errors.push({
          field: `questions[${i}].config`,
          message: `${formatQuestionTypeName(question.type)} question ${i + 1} must have a valid numeric min and max (min < max)`,
          questionId: question.id,
        });
      }
    }

    // P1-1 (options): option-bearing types must have >= 2 non-empty options.
    if (OPTION_BEARING_TYPES.includes(question.type)) {
      const options = question.options;

      if (!options || options.length < 2) {
        errors.push({
          field: `questions[${i}].options`,
          message: `${formatQuestionTypeName(question.type)} question must have at least 2 options`,
          questionId: question.id,
        });
        // Skip per-option check when count is already invalid.
      } else {
        for (let j = 0; j < options.length; j++) {
          if (!options[j].trim()) {
            errors.push({
              field: `questions[${i}].options[${j}]`,
              message: `Option ${j + 1} in question ${i + 1} must not be empty`,
              questionId: question.id,
            });
          }
        }
      }
    }

    // P1-5: validate next_target references point to real question or section IDs.
    if (question.next_target) {
      const nt = question.next_target;
      if (nt.type === "question" && nt.targetId && !questionIdSet.has(nt.targetId)) {
        errors.push({
          field: `questions[${i}].next_target`,
          message: `Question ${i + 1} has a next_target pointing to a non-existent question`,
          questionId: question.id,
        });
      }
      if (
        nt.type === "section" &&
        nt.targetId &&
        sectionIdSet.size > 0 &&
        !sectionIdSet.has(nt.targetId)
      ) {
        errors.push({
          field: `questions[${i}].next_target`,
          message: `Question ${i + 1} has a next_target pointing to a non-existent section`,
          questionId: question.id,
        });
      }
    }

    // P1-4: validate conditional-logic references point to real question IDs.
    const cfg = question.config;
    if (cfg !== null) {
      // Flat nextQuestionId pointer (simple linear skip logic).
      if (typeof cfg.nextQuestionId === "string" && !questionIdSet.has(cfg.nextQuestionId)) {
        errors.push({
          field: `questions[${i}].config`,
          message: `Question ${i + 1} references a non-existent nextQuestionId`,
          questionId: question.id,
        });
      }

      // Array-based conditional logic entries (branch rules).
      // Key must match the stored field name: conditionalRules (BUG-002)
      if (Array.isArray(cfg.conditionalRules)) {
        const branchRules = cfg.conditionalRules as Array<Record<string, unknown>>;
        for (const rule of branchRules) {
          if (
            typeof rule.targetQuestionId === "string" &&
            !questionIdSet.has(rule.targetQuestionId)
          ) {
            errors.push({
              field: `questions[${i}].config`,
              message: `Question ${i + 1} has a conditional logic rule pointing to a non-existent question`,
              questionId: question.id,
            });
            // One error per question is enough — don't flood the response.
            break;
          }
        }
      }
    }
  }

  return errors;
}

function formatQuestionTypeName(type: QuestionType): string {
  const nameMap: Record<QuestionType, string> = {
    multiple_choice: "Multiple Choice",
    short_text: "Short Text",
    long_text: "Long Text",
    scale: "Scale",
    grade: "Grade",
    checkbox: "Checkbox",
    dropdown: "Dropdown",
    ranking: "Ranking",
    startpoint: "Startpoint",
    endpoint: "Endpoint",
  };
  return nameMap[type];
}
