import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { RewardType, SurveyStatus, TargetParticipantCount } from "@/lib/types/survey";

const FORBIDDEN_TAG_CHARS = /[!@#$%^&*()+={}\[\]|\\:;"'<>,.?/~`]/;

function validateAndNormalizeTags(body: Record<string, unknown>): string | null {
  if (body.tags === undefined || body.tags === null) return null;
  if (!Array.isArray(body.tags)) {
    return "invalid_tags_format";
  }
  if ((body.tags as unknown[]).length > 5) {
    return "tags_limit_exceeded: max 5";
  }
  for (const tag of body.tags as unknown[]) {
    if (typeof tag !== "string") {
      return "invalid_tag_type";
    }
    const trimmed = tag.trim();
    if (trimmed.length === 0 || trimmed.length > 15) {
      return "tag_length_invalid: must be 1-15 chars";
    }
    if (FORBIDDEN_TAG_CHARS.test(trimmed)) {
      return "tag_contains_forbidden_chars";
    }
  }
  const normalized = (body.tags as string[]).map((t) => t.trim().toLowerCase());
  body.tags = [...new Set(normalized)];
  return null;
}

const VALID_TARGET_COUNTS: TargetParticipantCount[] = [10, 30, 50];

// Mirrors the same reward-combination table used in POST /api/surveys (policy 9.11.2).
const VALID_REWARD_COMBOS: Array<{
  type: RewardType;
  amount: number | null;
  winnerCount: number | null;
}> = [
  { type: "none", amount: null, winnerCount: null },
  { type: "first_come", amount: 1000, winnerCount: null },
  { type: "random", amount: 5000, winnerCount: 10 },
  { type: "random", amount: 10000, winnerCount: 5 },
];

function validateRewardCombination(
  rewardType: RewardType,
  rewardAmount: number | null | undefined,
  rewardWinnerCount: number | null | undefined
): string | null {
  const match = VALID_REWARD_COMBOS.find(
    (c) =>
      c.type === rewardType &&
      c.amount === (rewardAmount ?? null) &&
      c.winnerCount === (rewardWinnerCount ?? null)
  );
  if (!match) {
    return `invalid_reward_combination: reward_type '${rewardType}' does not allow amount=${rewardAmount ?? null} winner_count=${rewardWinnerCount ?? null}`;
  }
  return null;
}

function validateTargetParticipantCount(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (!VALID_TARGET_COUNTS.includes(value as TargetParticipantCount)) {
    return `invalid_target_participant_count: must be one of ${VALID_TARGET_COUNTS.join(", ")} or null`;
  }
  return null;
}

type RouteParams = { params: Promise<{ id: string }> };

// Valid status transitions. The 'published' transition is intentionally absent
// here — use POST /publish which runs full validation before the status write.
const ALLOWED_PATCH_TRANSITIONS: Record<SurveyStatus, SurveyStatus[]> = {
  draft: [], // draft → published requires /publish endpoint
  published: ["closed"],
  // closed surveys can be archived (hide from active lists) or reopened as draft
  closed: ["draft", "archived"],
  archived: [],
};

// GET /api/surveys/[id] — fetch survey with its questions and response count
//
// Access rules:
//   - Unauthenticated: published surveys only
//   - Authenticated creator: own surveys (any status)
//   - Authenticated non-creator: published surveys only
//
// responseCount is fetched as a head-only count (no row transfer) in parallel
// with the survey+questions query, adding zero extra latency vs a sequential read.
// Cost: 2 reads instead of 1 — the count read transfers 0 bytes (head: true).
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Build survey query based on auth state.
  // Creators can view their own surveys at any status; others see published only.
  const surveyQuery = supabase
    .from("surveys")
    .select(
      `
      id, title, description, status, purpose, tags, end_date,
      target_participant_count, max_responses, thumbnail_url,
      reward_type, reward_amount, reward_winner_count,
      estimated_time, max_participants,
      created_at, updated_at,
      questions (
        id, survey_id, type, title, options, order_index, required, config, created_at
      )
    `
    )
    .eq("id", id);

  const filteredQuery = user
    ? surveyQuery.or(`creator_id.eq.${user.id},status.eq.published`)
    : surveyQuery.eq("status", "published");

  // Fire both queries in parallel — survey+questions and response count.
  const [surveyResult, countResult] = await Promise.all([
    filteredQuery.single(),
    // head: true means no rows are transferred — only the count header.
    supabase.from("responses").select("*", { count: "exact", head: true }).eq("survey_id", id),
  ]);

  if (surveyResult.error) {
    return NextResponse.json({ error: surveyResult.error.message }, { status: 404 });
  }

  const survey = surveyResult.data;

  // Sort questions by order_index client-side to avoid extra DB round-trip
  survey.questions.sort(
    (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
  );

  return NextResponse.json({
    ...survey,
    responseCount: countResult.count ?? 0,
  });
}

// PATCH /api/surveys/[id] — update survey title, description, or status
//
// Status transitions allowed via PATCH:
//   published → closed
//   closed    → draft (reopen)
//
// draft → published must go through POST /api/surveys/[id]/publish,
// which runs full publish validation before transitioning.
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // If a status transition is requested, validate it before touching the DB.
  if ("status" in body) {
    const requestedStatus = body.status as string;

    const validStatuses: SurveyStatus[] = ["draft", "published", "closed", "archived"];
    if (!validStatuses.includes(requestedStatus as SurveyStatus)) {
      return NextResponse.json(
        { error: `Invalid status value: ${requestedStatus}`, code: "INVALID_STATUS" },
        { status: 400 }
      );
    }

    // Fetch current status — single lightweight read (id + status only).
    const { data: current, error: fetchError } = await supabase
      .from("surveys")
      .select("status")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    const currentStatus = current.status as SurveyStatus;
    const allowedTargets = ALLOWED_PATCH_TRANSITIONS[currentStatus];

    if (!allowedTargets.includes(requestedStatus as SurveyStatus)) {
      // Provide a specific message for the common case of trying to publish via PATCH.
      if (currentStatus === "draft" && requestedStatus === "published") {
        return NextResponse.json(
          {
            error: "Use POST /api/surveys/:id/publish to publish a draft survey",
            code: "USE_PUBLISH_ENDPOINT",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: `Cannot transition survey from '${currentStatus}' to '${requestedStatus}'`,
          code: "INVALID_TRANSITION",
        },
        { status: 400 }
      );
    }
  }

  // --- Validate tags if present ---
  if ("tags" in body) {
    const tagsError = validateAndNormalizeTags(body);
    if (tagsError) {
      return NextResponse.json({ error: tagsError }, { status: 422 });
    }
  }

  // --- Validate target_participant_count if present ---
  if ("target_participant_count" in body) {
    const targetCountError = validateTargetParticipantCount(body.target_participant_count);
    if (targetCountError) {
      return NextResponse.json({ error: targetCountError }, { status: 422 });
    }
  }

  // --- Validate reward combination if any reward field is present ---
  if ("reward_type" in body || "reward_amount" in body || "reward_winner_count" in body) {
    // Fetch current reward state so we can fill missing fields from the existing row.
    const { data: currentReward, error: rewardFetchError } = await supabase
      .from("surveys")
      .select("reward_type, reward_amount, reward_winner_count")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (rewardFetchError || !currentReward) {
      return NextResponse.json({ error: "survey_not_found" }, { status: 404 });
    }

    const mergedType: RewardType = (
      "reward_type" in body ? body.reward_type : currentReward.reward_type
    ) as RewardType;
    const mergedAmount: number | null =
      "reward_amount" in body
        ? (body.reward_amount ?? null)
        : (currentReward.reward_amount ?? null);
    const mergedWinnerCount: number | null =
      "reward_winner_count" in body
        ? (body.reward_winner_count ?? null)
        : (currentReward.reward_winner_count ?? null);

    const rewardError = validateRewardCombination(mergedType, mergedAmount, mergedWinnerCount);
    if (rewardError) {
      return NextResponse.json({ error: rewardError }, { status: 422 });
    }
  }

  const allowedFields = [
    "title",
    "description",
    "status",
    "purpose",
    "tags",
    "end_date",
    "target_participant_count",
    "max_responses",
    "thumbnail_url",
    "max_participants",
    "estimated_time",
    "reward_type",
    "reward_amount",
    "reward_winner_count",
  ] as const;
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  const { data: survey, error } = await supabase
    .from("surveys")
    .update(updates)
    .eq("id", id)
    .eq("creator_id", user.id)
    .select(
      "id, title, description, status, purpose, tags, end_date, target_participant_count, max_responses, thumbnail_url, max_participants, estimated_time, reward_type, reward_amount, reward_winner_count, created_at, updated_at"
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(survey);
}

// DELETE /api/surveys/[id] — delete survey and cascade questions
//
// Hard delete is blocked when responses exist. Prefer archiving or closing:
// the response data belongs to participants and should not be silently destroyed.
// Cost: 1 head-only count read before attempting the delete.
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check for existing responses before allowing hard delete.
  // head: true transfers zero row data — only the count header.
  const { count: responseCount, error: countError } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq("survey_id", id);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((responseCount ?? 0) > 0) {
    return NextResponse.json(
      {
        error: "Cannot delete a survey with existing responses. Close or archive it instead.",
        code: "HAS_RESPONSES",
      },
      { status: 409 }
    );
  }

  const { error } = await supabase.from("surveys").delete().eq("id", id).eq("creator_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
