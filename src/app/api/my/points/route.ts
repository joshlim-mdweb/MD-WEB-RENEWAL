import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type PointStatus = "earned" | "pending" | "available" | "spent" | "reversed";

const VALID_STATUSES: PointStatus[] = ["earned", "pending", "available", "spent", "reversed"];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// GET /api/my/points — paginated point ledger history for the authenticated user.
//
// Query params:
//   page   — 1-based page number (default: 1)
//   limit  — page size (default: 20, max: 100)
//   status — filter by ledger status (optional)
//
// Cost: 1 auth + 1 count query (head) + 1 data query = 3 reads.
// Pagination uses offset-based strategy (page × limit). For very large ledgers
// (> 10k rows) cursor-based would be preferred — acceptable for MVP.
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
  const statusParam = searchParams.get("status");

  // Validate and clamp params.
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit =
    isNaN(limitParam) || limitParam < 1 ? DEFAULT_LIMIT : Math.min(limitParam, MAX_LIMIT);

  // Validate status filter.
  let statusFilter: PointStatus | null = null;
  if (statusParam !== null) {
    if (!VALID_STATUSES.includes(statusParam as PointStatus)) {
      return NextResponse.json(
        {
          error: "invalid_status",
          message: `status는 ${VALID_STATUSES.join(", ")} 중 하나여야 해요.`,
        },
        { status: 400 }
      );
    }
    statusFilter = statusParam as PointStatus;
  }

  const offset = (page - 1) * limit;

  // Build base query. We execute count and data in parallel to minimize latency.
  const baseQuery = supabase
    .from("point_ledger")
    .select("id, source_type, source_id, amount, status, created_at", { count: "exact" })
    .eq("user_id", user.id);

  const countQuery = supabase
    .from("point_ledger")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (statusFilter !== null) {
    baseQuery.eq("status", statusFilter);
    countQuery.eq("status", statusFilter);
  }

  const [countResult, dataResult] = await Promise.all([
    countQuery,
    baseQuery.order("created_at", { ascending: false }).range(offset, offset + limit - 1),
  ]);

  if (countResult.error) {
    console.error("[points GET] count query failed", countResult.error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  if (dataResult.error) {
    console.error("[points GET] data query failed", dataResult.error);
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
