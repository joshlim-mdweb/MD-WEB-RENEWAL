import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface ConfirmBody {
  eligibilityId: string;
}

// POST /api/admin/reward-eligibility/confirm
// Marks a reward_eligibility row as 'confirmed'.
// Requires authenticated admin session.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: ConfirmBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { eligibilityId } = body;

  if (!eligibilityId || typeof eligibilityId !== "string") {
    return NextResponse.json({ error: "eligibilityId is required" }, { status: 422 });
  }

  const adminClient = createAdminClient();

  // Only transition from 'pending' to 'confirmed'
  const { data: existing, error: fetchError } = await adminClient
    .from("reward_eligibility")
    .select("id, status")
    .eq("id", eligibilityId)
    .maybeSingle();

  if (fetchError) {
    console.error("[admin/reward-eligibility/confirm:POST]", fetchError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  if (!existing) {
    return NextResponse.json({ error: "eligibility_not_found" }, { status: 404 });
  }

  if (existing.status !== "pending") {
    return NextResponse.json(
      { error: "invalid_status_transition", current: existing.status },
      { status: 409 }
    );
  }

  const { error: updateError } = await adminClient
    .from("reward_eligibility")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", eligibilityId);

  if (updateError) {
    console.error("[admin/reward-eligibility/confirm:POST] update failed", updateError);
    return NextResponse.json(
      { error: "일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, eligibilityId, status: "confirmed" });
}
