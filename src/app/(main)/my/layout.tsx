import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MySettingsNav } from "@/components/mypage/MySettingsNav";

export default async function MyAccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="my_account_layout max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex gap-10 items-start">
        {/* Left: sticky settings nav — desktop only */}
        <aside className="my_settings_nav_area hidden md:block w-[220px] flex-shrink-0 sticky top-[72px]">
          <MySettingsNav />
        </aside>

        {/* Right: page content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
