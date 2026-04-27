import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavAuth from "@/components/NavAuth";
import GnbNav from "@/components/GnbNav";
import BottomTabBar from "@/components/BottomTabBar";
import { COLOR } from "@/lib/design-tokens";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ backgroundColor: COLOR.BG_BASE }} className="min-h-screen">
      <header
        className="fixed top-0 left-0 right-0 h-[56px] z-50 glass"
        style={{ borderBottom: "1px solid var(--color-border-default)" }}
      >
        <div className="w-full px-4 md:px-6 h-full flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <NavAuth user={user} />
          </div>
        </div>
      </header>

      <main className="pt-[56px] min-h-screen pb-14 md:pb-0">
        <div className="w-full">{children}</div>
      </main>

      <BottomTabBar />
    </div>
  );
}
