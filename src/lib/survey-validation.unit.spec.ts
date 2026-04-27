import { describe, it, expect } from "vitest";
import { validateSurveyForPublish, type ValidationQuestion } from "./survey-validation";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeQuestion(overrides: Partial<ValidationQuestion> = {}): ValidationQuestion {
  return {
    id: "q1",
    type: "short_text",
    title: "질문 제목",
    options: null,
    order_index: 0,
    required: false,
    config: null,
    ...overrides,
  };
}

function makeSurvey(questions: ValidationQuestion[], title = "설문 제목", sectionIds?: string[]) {
  return { title, questions, sectionIds };
}

// ─── Title validation ─────────────────────────────────────────────────────────

describe("title validation", () => {
  it("passes when title is non-empty", () => {
    const errors = validateSurveyForPublish(makeSurvey([makeQuestion()], "My Survey"));
    expect(errors.find((e) => e.field === "title")).toBeUndefined();
  });

  it("fails when title is empty string", () => {
    const errors = validateSurveyForPublish(makeSurvey([makeQuestion()], ""));
    expect(errors.some((e) => e.field === "title")).toBe(true);
  });

  it("fails when title is whitespace-only", () => {
    const errors = validateSurveyForPublish(makeSurvey([makeQuestion()], "   "));
    expect(errors.some((e) => e.field === "title")).toBe(true);
  });
});

// ─── Question count validation ────────────────────────────────────────────────

describe("question count validation", () => {
  it("fails when no questions at all", () => {
    const errors = validateSurveyForPublish(makeSurvey([]));
    expect(errors.some((e) => e.field === "questions")).toBe(true);
  });

  it("fails when only endpoint question exists", () => {
    const errors = validateSurveyForPublish(makeSurvey([makeQuestion({ type: "endpoint" })]));
    expect(errors.some((e) => e.field === "questions")).toBe(true);
  });

  it("passes with one non-endpoint question", () => {
    const errors = validateSurveyForPublish(makeSurvey([makeQuestion()]));
    expect(errors.some((e) => e.field === "questions")).toBe(false);
  });

  it("passes when endpoint is present alongside a real question", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([
        makeQuestion({ id: "q1" }),
        makeQuestion({ id: "q2", type: "endpoint", order_index: 1 }),
      ])
    );
    expect(errors.some((e) => e.field === "questions")).toBe(false);
  });
});

// ─── Question title validation ────────────────────────────────────────────────

describe("question title validation", () => {
  it("fails when question title is empty", () => {
    const errors = validateSurveyForPublish(makeSurvey([makeQuestion({ title: "" })]));
    expect(errors.some((e) => e.field.includes(".title"))).toBe(true);
  });

  it("fails when question title is whitespace-only", () => {
    const errors = validateSurveyForPublish(makeSurvey([makeQuestion({ title: "   " })]));
    expect(errors.some((e) => e.field.includes(".title"))).toBe(true);
  });

  it("includes questionId in the error", () => {
    const errors = validateSurveyForPublish(makeSurvey([makeQuestion({ id: "q-abc", title: "" })]));
    const titleError = errors.find((e) => e.field.includes(".title"));
    expect(titleError?.questionId).toBe("q-abc");
  });
});

// ─── Option-bearing question validation ───────────────────────────────────────

describe("option-bearing question validation", () => {
  const optionTypes: ValidationQuestion["type"][] = [
    "multiple_choice",
    "checkbox",
    "dropdown",
    "ranking",
  ];

  optionTypes.forEach((type) => {
    describe(type, () => {
      it("fails when options is null", () => {
        const errors = validateSurveyForPublish(
          makeSurvey([makeQuestion({ type, options: null })])
        );
        expect(errors.some((e) => e.field.includes(".options"))).toBe(true);
      });

      it("fails when options has only 1 item", () => {
        const errors = validateSurveyForPublish(
          makeSurvey([makeQuestion({ type, options: ["Option A"] })])
        );
        expect(errors.some((e) => e.field.includes(".options"))).toBe(true);
      });

      it("passes with 2 valid options", () => {
        const errors = validateSurveyForPublish(
          makeSurvey([makeQuestion({ type, options: ["Option A", "Option B"] })])
        );
        expect(errors.some((e) => e.field.includes(".options"))).toBe(false);
      });

      it("fails when an option is empty string", () => {
        const errors = validateSurveyForPublish(
          makeSurvey([makeQuestion({ type, options: ["Option A", ""] })])
        );
        expect(errors.some((e) => e.field.includes(".options[1]"))).toBe(true);
      });

      it("fails when an option is whitespace-only", () => {
        const errors = validateSurveyForPublish(
          makeSurvey([makeQuestion({ type, options: ["   ", "Option B"] })])
        );
        expect(errors.some((e) => e.field.includes(".options[0]"))).toBe(true);
      });
    });
  });
});

// ─── Scale / Grade config validation ─────────────────────────────────────────

describe("scale and grade config validation", () => {
  const configTypes: ValidationQuestion["type"][] = ["scale", "grade"];

  configTypes.forEach((type) => {
    describe(type, () => {
      it("fails when config is null", () => {
        const errors = validateSurveyForPublish(makeSurvey([makeQuestion({ type, config: null })]));
        expect(errors.some((e) => e.field.includes(".config"))).toBe(true);
      });

      it("fails when min equals max", () => {
        const errors = validateSurveyForPublish(
          makeSurvey([makeQuestion({ type, config: { min: 5, max: 5 } })])
        );
        expect(errors.some((e) => e.field.includes(".config"))).toBe(true);
      });

      it("fails when min is greater than max", () => {
        const errors = validateSurveyForPublish(
          makeSurvey([makeQuestion({ type, config: { min: 10, max: 1 } })])
        );
        expect(errors.some((e) => e.field.includes(".config"))).toBe(true);
      });

      it("passes with valid min < max", () => {
        const errors = validateSurveyForPublish(
          makeSurvey([makeQuestion({ type, config: { min: 1, max: 5 } })])
        );
        expect(errors.some((e) => e.field.includes(".config"))).toBe(false);
      });

      it("fails when min or max is not a number", () => {
        const errors = validateSurveyForPublish(
          makeSurvey([makeQuestion({ type, config: { min: "1", max: 5 } })])
        );
        expect(errors.some((e) => e.field.includes(".config"))).toBe(true);
      });
    });
  });
});

// ─── Endpoint question required validation ────────────────────────────────────

describe("endpoint question required validation", () => {
  it("fails when endpoint question is marked required", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([
        makeQuestion({ id: "q1" }),
        makeQuestion({ id: "q2", type: "endpoint", required: true, order_index: 1 }),
      ])
    );
    expect(errors.some((e) => e.field.includes(".required"))).toBe(true);
  });

  it("passes when endpoint question is not required", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([
        makeQuestion({ id: "q1" }),
        makeQuestion({ id: "q2", type: "endpoint", required: false, order_index: 1 }),
      ])
    );
    expect(errors.some((e) => e.field.includes(".required"))).toBe(false);
  });
});

// ─── next_target reference validation ────────────────────────────────────────

describe("next_target reference validation", () => {
  it("fails when next_target.type=question points to non-existent question", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([
        makeQuestion({
          id: "q1",
          next_target: { type: "question", targetId: "q-nonexistent" },
        }),
      ])
    );
    expect(errors.some((e) => e.field.includes(".next_target"))).toBe(true);
  });

  it("passes when next_target.type=question points to existing question", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([
        makeQuestion({ id: "q1", next_target: { type: "question", targetId: "q2" } }),
        makeQuestion({ id: "q2", order_index: 1 }),
      ])
    );
    expect(errors.some((e) => e.field.includes(".next_target"))).toBe(false);
  });

  it("fails when next_target.type=section points to non-existent section", () => {
    const errors = validateSurveyForPublish({
      title: "Survey",
      questions: [
        makeQuestion({
          id: "q1",
          next_target: { type: "section", targetId: "s-nonexistent" },
        }),
      ],
      sectionIds: ["s-real"],
    });
    expect(errors.some((e) => e.field.includes(".next_target"))).toBe(true);
  });

  it("passes when next_target.type=section points to existing section", () => {
    const errors = validateSurveyForPublish({
      title: "Survey",
      questions: [
        makeQuestion({
          id: "q1",
          next_target: { type: "section", targetId: "s-real" },
        }),
      ],
      sectionIds: ["s-real"],
    });
    expect(errors.some((e) => e.field.includes(".next_target"))).toBe(false);
  });

  it("skips section validation when sectionIds is not provided", () => {
    const errors = validateSurveyForPublish({
      title: "Survey",
      questions: [
        makeQuestion({
          id: "q1",
          next_target: { type: "section", targetId: "s-any" },
        }),
      ],
      // no sectionIds
    });
    expect(errors.some((e) => e.field.includes(".next_target"))).toBe(false);
  });
});

// ─── Conditional logic reference validation ───────────────────────────────────

describe("conditional logic reference validation", () => {
  it("fails when config.nextQuestionId points to non-existent question", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([makeQuestion({ id: "q1", config: { nextQuestionId: "q-ghost" } })])
    );
    expect(errors.some((e) => e.questionId === "q1")).toBe(true);
  });

  it("passes when config.nextQuestionId points to existing question", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([
        makeQuestion({ id: "q1", config: { nextQuestionId: "q2" } }),
        makeQuestion({ id: "q2", order_index: 1 }),
      ])
    );
    expect(errors.filter((e) => e.questionId === "q1").length).toBe(0);
  });

  it("fails when conditionalRules references non-existent question", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([
        makeQuestion({
          id: "q1",
          config: {
            conditionalRules: [{ targetQuestionId: "q-ghost", condition: "equals", value: "A" }],
          },
        }),
      ])
    );
    expect(errors.some((e) => e.questionId === "q1")).toBe(true);
  });

  it("passes when conditionalRules references existing question", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([
        makeQuestion({
          id: "q1",
          config: {
            conditionalRules: [{ targetQuestionId: "q2", condition: "equals", value: "A" }],
          },
        }),
        makeQuestion({ id: "q2", order_index: 1 }),
      ])
    );
    expect(errors.filter((e) => e.questionId === "q1").length).toBe(0);
  });

  it("reports only one error per question for multiple broken conditionalRules", () => {
    const errors = validateSurveyForPublish(
      makeSurvey([
        makeQuestion({
          id: "q1",
          config: {
            conditionalRules: [{ targetQuestionId: "ghost-1" }, { targetQuestionId: "ghost-2" }],
          },
        }),
      ])
    );
    const configErrors = errors.filter((e) => e.questionId === "q1" && e.field.includes(".config"));
    expect(configErrors.length).toBe(1);
  });
});

// ─── Happy path — fully valid survey ─────────────────────────────────────────

describe("fully valid survey", () => {
  it("returns no errors for a well-formed survey", () => {
    const errors = validateSurveyForPublish({
      title: "Product Feedback Survey",
      questions: [
        makeQuestion({
          id: "q1",
          type: "short_text",
          title: "What is your name?",
          order_index: 0,
        }),
        makeQuestion({
          id: "q2",
          type: "multiple_choice",
          title: "Which product do you use?",
          options: ["Product A", "Product B", "Product C"],
          order_index: 1,
        }),
        makeQuestion({
          id: "q3",
          type: "scale",
          title: "Rate your satisfaction",
          config: { min: 1, max: 10 },
          order_index: 2,
        }),
        makeQuestion({
          id: "q4",
          type: "endpoint",
          title: "Thank you!",
          required: false,
          order_index: 3,
        }),
      ],
      sectionIds: ["s1"],
    });

    expect(errors).toHaveLength(0);
  });
});
