import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/types/database";
import { NextRequest, NextResponse } from "next/server";

interface EventRequestBody {
  event_name: string;
  properties?: Record<string, unknown>;
  session_id?: string;
}

// POST /api/events — collect a user behaviour event into user_events.
// Auth is optional: logged-in users have user_id recorded, anonymous users do not.
// Failures are swallowed (204 on any error) so event collection never breaks the caller's UX.
// Cost: 1 auth read + 1 insert.
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    // Malformed body — still silently succeed from the client's perspective.
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const { event_name, properties, session_id } = body as Partial<EventRequestBody>;

  if (!event_name || typeof event_name !== "string" || event_name.trim().length === 0) {
    // Invalid event — swallow rather than erroring the client.
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // Auth is optional — failure here should not block event ingestion.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("user_events").insert({
    user_id: user?.id ?? null,
    session_id: typeof session_id === "string" ? session_id : null,
    event_name: event_name.trim(),
    properties: (properties ?? {}) as Json,
  });

  if (error) {
    // Log server-side for observability, but never surface to the client.
    console.error("[events POST] insert failed", error);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
