import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// DELETE /api/my/account — soft-deletes the account by setting profile.status = 'deleted'.
//
// Guards:
//   1. Auth required
//   2. No available points — user must withdraw before deleting
//
// Soft delete only — the auth.users row is NOT deleted (ops can reactivate).
// Supabase session remains valid after this call; the client should sign out.
//
// Cost: 1 auth + 1 available-points count (head) + 1 profile status update.
export async function DELETE() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Check for available points before allowing deletion.
  // Using head:true — we only need the count, not the rows.
  const { count: availableCount, error: pointsError } = await supabase
    .from("point_ledger")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "available");

  if (pointsError) {
    console.error("[account DELETE] point_ledger check failed", pointsError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  if ((availableCount ?? 0) > 0) {
    return NextResponse.json(
      {
        error: "has_available_points",
        message: "출금 가능한 포인트가 있어요. 출금 후 탈퇴해 주세요.",
      },
      { status: 409 }
    );
  }

  // Soft delete — only update the status field; no rows are physically removed.
  const { error: deleteError } = await supabase
    .from("profile")
    .update({ status: "deleted" })
    .eq("uuid", user.id);

  if (deleteError) {
    console.error("[account DELETE] profile status update failed", deleteError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
