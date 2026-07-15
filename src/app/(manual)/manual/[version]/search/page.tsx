import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { getCategories } from "@/lib/manual/db";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ version: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { version: raw } = await params;
  const version = decodeURIComponent(raw);
  const { q = "" } = await searchParams;
  const query = q.trim();

  const categories = await getCategories();
  const catName = new Map(categories.map((c) => [c.slug, c.name]));

  let results: { canonical_id: string; slug: string; category_slug: string; title: string }[] = [];
  if (query) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );
    const escaped = query.replace(/[%_]/g, "\\$&");
    const { data } = await supabase
      .from("manual_articles")
      .select("canonical_id, slug, category_slug, title")
      .contains("versions", [version])
      .is("archived_at", null)
      .or(`title.ilike.%${escaped}%,body_md.ilike.%${escaped}%`)
      .order("title")
      .limit(50);
    results = data ?? [];
  }

  return (
    <>
      <div className="mn-crumb">
        <Link href={`/manual/${version}`}>MD {version}</Link> · 검색
      </div>
      <h1 className="mn-title">“{query}”</h1>
      <div className="mn-sub">
        {results.length} results · MD {version}
      </div>
      <div className="mn-hero" style={{ textAlign: "left", padding: "0 0 16px" }}>
        <form action={`/manual/${version}/search`} style={{ margin: 0 }}>
          <input name="q" defaultValue={query} placeholder="Search the manual" autoComplete="off" />
        </form>
      </div>
      {query && results.length === 0 ? (
        <div className="mn-empty">검색 결과가 없어요. 다른 키워드로 시도해 보세요.</div>
      ) : (
        <div>
          {results.map((a) => (
            <Link
              key={a.canonical_id}
              href={`/manual/${version}/${a.category_slug}/${a.slug}`}
              className="mn-item"
            >
              <span className="t">{a.title}</span>
              <span className="meta">
                <span className="mn-vchip">{catName.get(a.category_slug)}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
