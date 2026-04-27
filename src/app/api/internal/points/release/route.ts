import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/internal/points/release
//
// Batch-transitions point_ledger rows from 'pending' → 'available' for all rows
// whose created_at is before today KST 00:00 (i.e. earned on a previous day).
//
// Intended to be called by a Vercel cron job at UTC 15:00 (= KST 00:00).
// See vercel.json for the cron schedule.
//
// Authorization: Bearer ${CRON_SECRET} header. Requests without a valid secret
// are rejected with 401 to prevent public invocation.
//
// Cost: 1 UPDATE targeting only pending rows older than today's KST midnight.
//       No N+1 — single batch UPDATE regardless of row count.
//
// Returns:
//   200 { released: number }  — count of rows transitioned
//   401                       — missing or invalid CRON_SECRET
//   500                       — DB update failed
export async function POST(req: NextRequest) {
  // Authorization guard — must come before any DB work.
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Compute today's KST midnight in UTC.
  // KST = UTC+9. "Today KST 00:00" = "Yesterday UTC 15:00".
  // We use the wall-clock approach: take now in UTC, subtract 9h to get KST date,
  // then reconstruct midnight KST as UTC.
  const nowUtc = new Date();
  const kstOffsetMs = 9 * 60 * 60 * 1000;
  const nowKst = new Date(nowUtc.getTime() + kstOffsetMs);

  // Build KST midnight: year/month/day at 00:00:00 KST = subtract 9h for UTC
  const kstMidnight = new Date(
    Date.UTC(nowKst.getUTCFullYear(), nowKst.getUTCMonth(), nowKst.getUTCDate()) - kstOffsetMs
  );

  const supabase = await createClient();

  // Single batch UPDATE: pending rows created before today KST midnight → available.
  // We select back the updated IDs to get a count — Supabase JS does not expose an
  // affected-rows count directly on update(); selecting "id" is the minimal-cost approach.
  const { data: updated, error } = await supabase
    .from("point_ledger")
    .update({ status: "available" })
    .eq("status", "pending")
    .lt("created_at", kstMidnight.toISOString())
    .select("id");

  if (error) {
    console.error("[points/release POST] batch update failed", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json({ released: (updated ?? []).length });
}
