import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { FlowchartData } from "@/lib/types/tool";

// GET /api/tool/flowcharts — list all sessions, newest first
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tool_flowcharts")
    .select("id, title, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/tool/flowcharts — create new session
export async function POST(req: NextRequest) {
  let title: string;
  let data: FlowchartData;
  try {
    const body = await req.json();
    title = body.title ?? "Untitled";
    data = body.data;
    if (!data?.nodes) return NextResponse.json({ error: "data_required" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("tool_flowcharts")
    .insert({ title, data: data as unknown as import("@/lib/types/database").Json })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(row, { status: 201 });
}
