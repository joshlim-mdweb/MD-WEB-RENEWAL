import { createClient } from "@/lib/supabase/server";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { PointHistoryList } from "@/components/mypage/PointHistoryList";

export const dynamic = "force-dynamic";

export default async function PointHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rows } = await supabase
    .from("point_ledger")
    .select("id, amount, status, source_type, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const entries = rows ?? [];

  return (
    <div className="point_history_page px-5 py-8 max-w-[800px] mx-auto w-full">
      <p className="mb-6" style={{ ...TYPOGRAPHY.STYLE.TITLE_1, color: COLOR.TEXT_PRIMARY }}>
        포인트 내역
      </p>
      <PointHistoryList entries={entries} />
    </div>
  );
}
