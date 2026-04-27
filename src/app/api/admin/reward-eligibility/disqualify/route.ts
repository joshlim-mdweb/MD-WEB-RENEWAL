import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface DisqualifyBody {
  eligibilityId: string;
  reason: string;
}

// POST /api/admin/reward-eligibility/disqualify
// Marks a reward_eligibility row as 'disqualified' with a reason.
// Requires authenticated admin session.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: DisqualifyBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { eligibilityId, reason } = body;

  if (!eligibilityId || typeof eligibilityId !== "string") {
    return NextResponse.json({ error: "eligibilityId is required" }, { status: 422 });
  }

  if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
    return NextResponse.json({ error: "reason is required" }, { status: 422 });
  }

  const adminClient = createAdminClient();

  const { data: existing, error: fetchError } = await adminClient
    .from("reward_eligibility")
    .select("id, status")
    .eq("id", eligibilityId)
    .maybeSingle();

  if (fetchError) {
    console.error("[admin/reward-eligibility/disqualify:POST]", fetchError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  if (!existing) {
    return NextResponse.json({ error: "eligibility_not_found" }, { status: 404 });
  }

  // Can only disqualify from 'pending' or 'confirmed'
  if (existing.status === "disqualified" || existing.status === "paid") {
    return NextResponse.json(
      { error: "invalid_status_transition", current: existing.status },
      { status: 409 }
    );
  }

  const { error: updateError } = await adminClient
    .from("reward_eligibility")
    .update({ status: "disqualified", disqualify_reason: reason.trim() })
    .eq("id", eligibilityId);

  if (updateError) {
    console.error("[admin/reward-eligibility/disqualify:POST] update failed", updateError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, eligibilityId, status: "disqualified" });
}
