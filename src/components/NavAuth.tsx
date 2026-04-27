"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

function getInitial(user: User): string {
  const email = user.email ?? "";
  return email.charAt(0).toUpperCase();
}

export default function NavAuth({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="hover:opacity-80 transition-opacity"
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_1,
          fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
          backgroundColor: COLOR.ACCENT,
          color: COLOR.TEXT_INVERSE,
          padding: "6px 16px",
          borderRadius: "8px",
        }}
      >
        로그인
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Profile avatar — links to /my overview */}
      <Link href="/my" aria-label="마이페이지">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 select-none"
          style={{
            backgroundColor: COLOR.ACCENT,
            color: COLOR.TEXT_INVERSE,
            fontSize: "13px",
            fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
            lineHeight: 1,
          }}
        >
          {getInitial(user)}
        </div>
      </Link>

      <button
        onClick={handleSignOut}
        style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}
        className="hover:opacity-80 transition-opacity"
      >
        로그아웃
      </button>
    </div>
  );
}
