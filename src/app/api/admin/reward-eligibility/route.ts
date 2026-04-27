import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/reward-eligibility?surveyId=<uuid>
// Lists all reward_eligibility rows for a given survey.
// Requires authenticated admin session.
export async function GET(req: NextRequest) {
  // Verify the caller is authenticated via Supabase session
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const surveyId = searchParams.get("surveyId");

  if (!surveyId) {
    return NextResponse.json({ error: "surveyId is required" }, { status: 422 });
  }

  // Use admin client to bypass RLS (service role only table)
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("reward_eligibility")
    .select(
      "id, budget_id, survey_id, response_id, user_id, amount, status, disqualify_reason, confirmed_at, paid_at, created_at, updated_at"
    )
    .eq("survey_id", surveyId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[admin/reward-eligibility:GET]", error);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: data ?? [] });
}
