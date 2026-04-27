import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { validateSurveyForPublish } from "../_validation";
import type { ValidationQuestion } from "../_validation";
import type { QuestionType } from "@/lib/types/survey";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/surveys/[id]/publish
 *
 * Validates the survey then transitions it from 'draft' to 'published'.
 *
 * Cost: 1 read (survey + questions joined) + 1 write (status update) on success.
 *       1 read + 0 writes on validation failure.
 *
 * Returns:
 *   200  — updated survey row (id, title, description, status, timestamps)
 *   400  — survey is not in draft status
 *   401  — unauthenticated
 *   403  — authenticated but not the creator
 *   404  — survey not found
 *   422  — validation errors (array of { field, message })
 */
export async function POST(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Single joined read — select only the fields needed for validation + status check.
  // options is stored as Json in the DB; we cast it after the fetch.
  const { data: survey, error: fetchError } = await supabase
    .from("surveys")
    .select(
      `
      id,
      creator_id,
      title,
      status,
      description,
      questions (
        id,
        type,
        title,
        options,
        order_index,
        required,
        config
      )
    `
    )
    .eq("id", id)
    .single();

  if (fetchError || !survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  if (survey.creator_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (survey.status !== "draft") {
    return NextResponse.json(
      {
        error: `Survey is already '${survey.status}'. Only draft surveys can be published.`,
        code: "INVALID_TRANSITION",
      },
      { status: 400 }
    );
  }

  // Coerce the raw DB questions into the shape validateSurveyForPublish expects.
  // options comes back as Json (unknown) from Supabase — normalize to string[] | null.
  const validationQuestions: ValidationQuestion[] = survey.questions.map((q) => ({
    id: q.id,
    type: q.type as QuestionType,
    title: q.title,
    options: normalizeOptions(q.options),
    order_index: q.order_index,
    required: q.required ?? false,
    config: normalizeConfig(q.config),
  }));

  const validationErrors = validateSurveyForPublish({
    title: survey.title,
    questions: validationQuestions,
  });

  if (validationErrors.length > 0) {
    return NextResponse.json({ errors: validationErrors }, { status: 422 });
  }

  // Validation passed — write the status transition.
  const { data: updatedSurvey, error: updateError } = await supabase
    .from("surveys")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("creator_id", user.id)
    .select("id, title, description, status, created_at, updated_at")
    .single();

  if (updateError || !updatedSurvey) {
    return NextResponse.json({ error: "Failed to publish survey" }, { status: 500 });
  }

  return NextResponse.json(updatedSurvey);
}

/**
 * Normalizes the raw Supabase Json column value for `options` to string[] | null.
 * The DB stores options as a JSON array of strings. If the value is anything
 * unexpected, we treat it as null so validation correctly flags the question.
 */
function normalizeOptions(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null;
  if (raw.every((item) => typeof item === "string")) return raw as string[];
  return null;
}

/**
 * Normalizes the raw Supabase Json column value for `config` to
 * Record<string, unknown> | null. Any non-object value (including arrays) is
 * treated as null so downstream validation logic can make safe assumptions.
 */
function normalizeConfig(raw: unknown): Record<string, unknown> | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as Record<string, unknown>;
}
