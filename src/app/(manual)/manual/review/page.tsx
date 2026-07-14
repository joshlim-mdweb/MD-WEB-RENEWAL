import Link from "next/link";
import { redirect } from "next/navigation";
import { getEditorEmail, manualServerClient } from "@/lib/manual/auth";
import { getCategories, getVersions } from "@/lib/manual/db";
import "../manual.css";

const STATUS_LABEL: Record<string, string> = {
  pending: "대기", approved: "승인", needs_fix: "수정 필요",
};

export default async function ReviewDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; attention?: string }>;
}) {
  const email = await getEditorEmail();
  if (!email) redirect("/manual/login");
  const { status: fStatus, attention: fAttention } = await searchParams;

  const supabase = await manualServerClient();
  const [{ data: articles }, categories, versions] = await Promise.all([
    supabase
      .from("manual_articles")
      .select("canonical_id, slug, category_slug, title, review_status, needs_attention, reviewed_by")
      .order("title"),
    getCategories(),
    getVersions(),
  ]);
  const latest = versions[0].code;
  const all = articles ?? [];
  const catName = new Map(categories.map((c) => [c.slug, c.name]));

  const counts = {
    approved: all.filter((a) => a.review_status === "approved").length,
    needs_fix: all.filter((a) => a.review_status === "needs_fix").length,
    pending: all.filter((a) => a.review_status === "pending").length,
    attention: all.filter((a) => a.needs_attention).length,
  };

  let list = all;
  if (fStatus) list = list.filter((a) => a.review_status === fStatus);
  if (fAttention) list = list.filter((a) => a.needs_attention);

  return (
    <div className="mn-root">
      <div className="mn-topbar-wrap">
        <div className="mn-topbar">
          <Link href={`/manual/${latest}`} className="mn-brand">
            <b>Marvelous Designer</b>
            <span>Manual Review</span>
          </Link>
        </div>
      </div>
      <div className="mn-container">
        <div className="mn-content" style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 className="mn-title">컨텐츠 검수</h1>
          <div className="mn-sub">
            전체 {all.length}건 — 승인 {counts.approved} · 수정 필요 {counts.needs_fix} · 대기 {counts.pending}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <Link href="/manual/review" className={`mn-vchip ${!fStatus && !fAttention ? "hl" : ""}`}>전체</Link>
            <Link href="/manual/review?attention=1" className={`mn-vchip ${fAttention ? "hl" : ""}`}>
              우선 검수 {counts.attention}
            </Link>
            <Link href="/manual/review?status=pending" className={`mn-vchip ${fStatus === "pending" ? "hl" : ""}`}>대기</Link>
            <Link href="/manual/review?status=needs_fix" className={`mn-vchip ${fStatus === "needs_fix" ? "hl" : ""}`}>수정 필요</Link>
            <Link href="/manual/review?status=approved" className={`mn-vchip ${fStatus === "approved" ? "hl" : ""}`}>승인</Link>
          </div>

          <div className="mn-metaband" style={{ fontSize: 13 }}>
            <span className="k">검수 기준</span>
            <span>① 병합·흡수가 자연스러운가 ② 본문 버전 분기 표기가 맞는가 ③ 유효 버전 리스트가 릴리즈 이력과 맞는가 ④ 스크린샷이 최신 UI인가</span>
          </div>

          <div>
            {list.map((a) => (
              <Link
                key={a.canonical_id}
                href={`/manual/${latest}/${a.category_slug}/${a.slug}`}
                className="mn-item"
              >
                <span className="t">{a.title}</span>
                <span className="meta">
                  {a.needs_attention && <span className="mn-vchip hl">{a.needs_attention}</span>}
                  <span className="mn-vchip">{catName.get(a.category_slug)}</span>
                  <span className={`mn-vchip ${a.review_status !== "pending" ? "hl" : ""}`}>
                    {STATUS_LABEL[a.review_status]}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
