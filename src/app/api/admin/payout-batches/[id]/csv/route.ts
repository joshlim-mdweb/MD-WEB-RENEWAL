import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/payout-batches/[id]/csv
// Returns a CSV file of all reward_eligibility rows associated with the batch.
// Columns: response_id, user_id, amount, status
// Requires authenticated admin session.
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id: batchId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const adminClient = createAdminClient();

  // Verify the batch exists and retrieve its survey_id
  const { data: batch, error: batchError } = await adminClient
    .from("payout_batches")
    .select("id, survey_id")
    .eq("id", batchId)
    .maybeSingle();

  if (batchError) {
    console.error("[admin/payout-batches/csv:GET]", batchError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  if (!batch) {
    return NextResponse.json({ error: "batch_not_found" }, { status: 404 });
  }

  // Fetch eligibility rows for the batch's survey
  const { data: rows, error: rowsError } = await adminClient
    .from("reward_eligibility")
    .select("response_id, user_id, amount, status")
    .eq("survey_id", batch.survey_id)
    .order("created_at", { ascending: true });

  if (rowsError) {
    console.error("[admin/payout-batches/csv:GET] rows fetch failed", rowsError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  const csvHeader = "response_id,user_id,amount,status\n";
  const csvBody = (rows ?? [])
    .map((row) => {
      const responseId = row.response_id ?? "";
      const userId = row.user_id ?? "";
      const amount = row.amount ?? 0;
      const status = row.status ?? "";
      return `${responseId},${userId},${amount},${status}`;
    })
    .join("\n");

  const csvContent = csvHeader + csvBody;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="payout-batch-${batchId}.csv"`,
    },
  });
}
