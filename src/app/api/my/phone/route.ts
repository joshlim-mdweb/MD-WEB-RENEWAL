import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/my/phone — saves or updates the authenticated user's phone number.
//
// Used before gifticon redemption when the user has no phone registered.
// Format enforced: 010-XXXX-XXXX (Korean mobile number).
//
// Cost: 1 auth read + 1 profile update.
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { phone } = body as { phone?: unknown };

  if (typeof phone !== "string") {
    return NextResponse.json({ error: "phone_required" }, { status: 400 });
  }

  const trimmed = phone.trim();

  // Enforce 010-XXXX-XXXX format
  if (!/^010-\d{4}-\d{4}$/.test(trimmed)) {
    return NextResponse.json(
      {
        error: "phone_invalid_format",
        message: "010-XXXX-XXXX 형식으로 입력해 주세요.",
      },
      { status: 422 }
    );
  }

  const { error: updateError } = await supabase
    .from("profile")
    .update({ phone: trimmed })
    .eq("uuid", user.id);

  if (updateError) {
    console.error("[phone PATCH] profile update failed", updateError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json({ phone: trimmed });
}
