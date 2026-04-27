import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface DashboardPoints {
  total: number;
  pending: number;
  available: number;
  todayEarned: number;
}

interface DashboardSurveys {
  draft: number;
  published: number;
  closed: number;
}

interface DashboardActivity {
  contentType: "survey";
  id: string;
  title: string;
  createdAt: string;
}

interface DashboardResponse {
  points: DashboardPoints;
  surveys: DashboardSurveys;
  recentActivity: DashboardActivity[];
}

// GET /api/my/dashboard — aggregated dashboard for the authenticated user.
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  const [pointLedgerResult, surveysResult, recentSurveysResult] = await Promise.all([
    supabase.from("point_ledger").select("amount, status, created_at").eq("user_id", user.id),
    supabase.from("surveys").select("status").eq("creator_id", user.id),
    supabase
      .from("surveys")
      .select("id, title, created_at")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (pointLedgerResult.error) {
    return NextResponse.json({ error: pointLedgerResult.error.message }, { status: 500 });
  }
  if (surveysResult.error) {
    return NextResponse.json({ error: surveysResult.error.message }, { status: 500 });
  }

  const ledgerRows = pointLedgerResult.data ?? [];
  let totalPoints = 0;
  let pendingPoints = 0;
  let availablePoints = 0;
  let todayEarned = 0;

  for (const row of ledgerRows) {
    totalPoints += row.amount;
    if (row.status === "pending") pendingPoints += row.amount;
    if (row.status === "available") availablePoints += row.amount;
    if (row.created_at >= todayIso) todayEarned += row.amount;
  }

  const surveyRows = surveysResult.data ?? [];
  const surveyDraftCount = surveyRows.filter((s) => s.status === "draft").length;
  const surveyPublishedCount = surveyRows.filter((s) => s.status === "published").length;
  const surveyClosedCount = surveyRows.filter((s) => s.status === "closed").length;

  const recentActivity: DashboardActivity[] = (recentSurveysResult.data ?? []).map((s) => ({
    contentType: "survey" as const,
    id: s.id,
    title: s.title,
    createdAt: s.created_at,
  }));

  const response: DashboardResponse = {
    points: {
      total: totalPoints,
      pending: pendingPoints,
      available: availablePoints,
      todayEarned,
    },
    surveys: {
      draft: surveyDraftCount,
      published: surveyPublishedCount,
      closed: surveyClosedCount,
    },
    recentActivity,
  };

  return NextResponse.json(response);
}
