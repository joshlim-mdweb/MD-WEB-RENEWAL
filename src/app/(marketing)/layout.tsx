import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavAuth from "@/components/NavAuth";
import GnbNav from "@/components/GnbNav";
import { COLOR } from "@/lib/design-tokens";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ backgroundColor: COLOR.BG_BASE }} className="min-h-screen">
      {/* 전체 너비 헤더 — 사이드바 없음 */}
      <header
        className="fixed top-0 left-0 right-0 h-[52px] z-50 glass"
        style={{ boxShadow: "0 1px 0 rgba(199,200,208,0.15)" }}
      >
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-base hover:opacity-80 transition-opacity"
              style={{ fontWeight: 800, letterSpacing: "-0.02em", color: COLOR.TEXT_PRIMARY }}
            >
              OPINION
            </Link>
            <GnbNav />
          </div>
          <NavAuth user={user} />
        </div>
      </header>

      <main className="pt-[52px] min-h-screen">{children}</main>
    </div>
  );
}
