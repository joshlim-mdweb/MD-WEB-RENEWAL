import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// GET /api/my/settlements — paginated withdrawal history for the authenticated user.
//
// Query params:
//   page  — 1-based page number (default: 1)
//   limit — page size (default: 20, max: 100)
//
// Cost: 1 auth + 1 count (head) + 1 data query = 3 reads (parallel).
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const limitParam = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);

  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit =
    isNaN(limitParam) || limitParam < 1 ? DEFAULT_LIMIT : Math.min(limitParam, MAX_LIMIT);
  const offset = (page - 1) * limit;

  const [countResult, dataResult] = await Promise.all([
    supabase
      .from("withdrawals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),

    supabase
      .from("withdrawals")
      .select("id, amount, status, payout_info, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1),
  ]);

  if (countResult.error) {
    console.error("[settlements GET] count query failed", countResult.error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  if (dataResult.error) {
    console.error("[settlements GET] data query failed", dataResult.error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  const total = countResult.count ?? 0;

  return NextResponse.json({
    items: dataResult.data ?? [],
    total,
    page,
    hasMore: offset + limit < total,
  });
}
