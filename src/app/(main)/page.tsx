import { createClient } from "@/lib/supabase/server";
import HomeContent from "./HomeContent";
import type { SurveyListItem } from "./SurveyListClient";
import type { SurveyPurpose } from "@/lib/types/survey"; // used for cast below

export const dynamic = "force-dynamic";

// ─── Types ────────────────────────────────────────────────────────────────────

type SurveyRow = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  estimated_time: number | null;
  purpose: string | null;
  tags: string[] | null;
  end_date: string | null;
  max_responses: number | null;
  reward_amount: number | null;
  thumbnail_url: string | null;
  status: string;
  questions: { count: number }[];
  responses: { count: number }[];
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch published surveys with question count + response count in one round trip.
  // questions(count) uses Supabase's PostgREST aggregate syntax — same as responses(count).
  const { data: rawSurveys } = await supabase
    .from("surveys")
    .select(
      "id, title, description, created_at, estimated_time, purpose, tags, end_date, max_responses, reward_amount, thumbnail_url, status, questions(count), responses(count)"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50);

  const surveys: SurveyListItem[] = (rawSurveys ?? []).map((row: SurveyRow) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    created_at: row.created_at,
    estimated_time: row.estimated_time,
    purpose: row.purpose as SurveyPurpose | null,
    tags: row.tags ?? null,
    end_date: row.end_date,
    max_responses: row.max_responses,
    reward_amount: row.reward_amount,
    status: row.status,
    thumbnail_url: row.thumbnail_url,
    question_count: row.questions?.[0]?.count ?? 0,
    response_count: row.responses?.[0]?.count ?? 0,
  }));

  return <HomeContent surveys={surveys} />;
}
