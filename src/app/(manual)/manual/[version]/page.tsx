import Link from "next/link";
import { getArticlesForVersion, getCategories } from "@/lib/manual/db";

export default async function VersionHome({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version: raw } = await params;
  const version = decodeURIComponent(raw);
  const [categories, articles] = await Promise.all([
    getCategories(),
    getArticlesForVersion(version),
  ]);
  const byCat = new Map(categories.map((c) => [c.slug, c.name]));

  return (
    <>
      <div className="mn-crumb">MD {version}</div>
      <h1 className="mn-title">All documents</h1>
      <div className="mn-sub">
        {articles.length} documents · valid in MD {version}
      </div>
      <div>
        {articles.map((a) => (
          <Link
            key={a.canonical_id}
            href={`/manual/${version}/${a.category_slug}/${a.slug}`}
            className="mn-item"
          >
            <span className="t">{a.title}</span>
            <span className="meta">
              <span className="mn-vchip">{byCat.get(a.category_slug)}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
