import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { RewardType, TargetParticipantCount } from "@/lib/types/survey";

const VALID_TARGET_COUNTS: TargetParticipantCount[] = [10, 30, 50];

const FORBIDDEN_TAG_CHARS = /[!@#$%^&*()+={}\[\]|\\:;"'<>,.?/~`]/;

// Returns an error string if tags are invalid, null if valid.
// Also mutates the body.tags in place (trim + lowercase + deduplicate) when valid.
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
  // normalize: trim + lowercase + deduplicate
  const normalized = (body.tags as string[]).map((t) => t.trim().toLowerCase());
  body.tags = [...new Set(normalized)];
  return null;
}

// Reward tier rules (policy 9.11.2):
//   none       → reward_amount = null, reward_winner_count = null
//   first_come → reward_amount = 1000,  reward_winner_count = null (all participants)
//   random     → reward_amount = 5000,  reward_winner_count = 10
//              → reward_amount = 10000, reward_winner_count = 5
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
  const matchingCombo = VALID_REWARD_COMBOS.find(
    (c) =>
      c.type === rewardType &&
      c.amount === (rewardAmount ?? null) &&
      c.winnerCount === (rewardWinnerCount ?? null)
  );
  if (!matchingCombo) {
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

// GET /api/surveys — list surveys for the authenticated user
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: surveys, error } = await supabase
    .from("surveys")
    .select(
      "id, title, description, status, purpose, tags, end_date, target_participant_count, reward_type, reward_amount, reward_winner_count, created_at, updated_at"
    )
    .eq("creator_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "survey_fetch_failed" }, { status: 500 });
  }

  return NextResponse.json(surveys);
}

// POST /api/surveys — create a new survey draft
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // --- Validate target_participant_count ---
  const targetCountError = validateTargetParticipantCount(body.target_participant_count);
  if (targetCountError) {
    return NextResponse.json({ error: targetCountError }, { status: 422 });
  }

  // --- Validate tags ---
  const tagsError = validateAndNormalizeTags(body);
  if (tagsError) {
    return NextResponse.json({ error: tagsError }, { status: 422 });
  }

  // --- Validate reward combination ---
  if (body.reward_type !== undefined) {
    const rewardError = validateRewardCombination(
      body.reward_type as RewardType,
      body.reward_amount,
      body.reward_winner_count
    );
    if (rewardError) {
      return NextResponse.json({ error: rewardError }, { status: 422 });
    }
  }

  const title: string = body.title?.trim() || "Untitled Survey";

  const { data: survey, error } = await supabase
    .from("surveys")
    .insert({
      creator_id: user.id,
      title,
      description: body.description ?? null,
      purpose: body.purpose ?? null,
      tags: (body.tags as string[] | null | undefined) ?? null,
      end_date: body.end_date ?? null,
      target_participant_count: body.target_participant_count ?? null,
      max_responses: body.max_responses ?? null,
      thumbnail_url: body.thumbnail_url ?? null,
      reward_type: body.reward_type ?? "none",
      reward_amount: body.reward_amount ?? null,
      reward_winner_count: body.reward_winner_count ?? null,
      status: "draft",
    })
    .select(
      "id, title, description, status, purpose, tags, end_date, target_participant_count, max_responses, thumbnail_url, reward_type, reward_amount, reward_winner_count, created_at, updated_at"
    )
    .single();

  if (error) {
    return NextResponse.json({ error: "survey_create_failed" }, { status: 500 });
  }

  // Seed default: Section 1 with one empty question
  const { data: section } = await supabase
    .from("sections")
    .insert({ survey_id: survey.id, title: "", order_index: 0 })
    .select("id")
    .single();

  if (section) {
    await supabase.from("questions").insert({
      survey_id: survey.id,
      section_id: section.id,
      type: "multiple_choice",
      title: "",
      order_index: 0,
      required: false,
      options: null,
      config: null,
    });
  }

  return NextResponse.json(survey, { status: 201 });
}
