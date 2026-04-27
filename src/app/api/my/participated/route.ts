import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// GET /api/my/participated — paginated list of surveys the user has participated in.
//
// Query params:
//   page  — 1-based page number (default: 1)
//   limit — page size (default: 20, max: 100)
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
    supabase.from("responses").select("id", { count: "exact", head: true }).eq("user_id", user.id),

    supabase
      .from("responses")
      .select("id, created_at, surveys!inner(id, title, status)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1),
  ]);

  if (countResult.error || dataResult.error) {
    console.error("[participated GET] query failed", countResult.error ?? dataResult.error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  type SurveyRow = {
    id: string;
    created_at: string;
    surveys: { id: string; title: string; status: string };
  };

  const items = ((dataResult.data as SurveyRow[]) ?? []).map((r) => ({
    type: "survey" as const,
    participation_id: r.id,
    content_id: r.surveys.id,
    title: r.surveys.title,
    status: r.surveys.status,
    created_at: r.created_at,
  }));

  const total = countResult.count ?? 0;

  return NextResponse.json({ items, total, hasMore: offset + limit < total });
}
