import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesForVersion, getCategories, getVersions } from "@/lib/manual/db";
import { VersionSelect } from "./VersionSelect";
import "../manual.css";

export default async function ManualLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ version: string }>;
}) {
  const { version: raw } = await params;
  const version = decodeURIComponent(raw);
  const [versions, categories, articles] = await Promise.all([
    getVersions(),
    getCategories(),
    getArticlesForVersion(version),
  ]);
  if (!versions.some((v) => v.code === version)) notFound();

  const counts = new Map<string, number>();
  for (const a of articles) counts.set(a.category_slug, (counts.get(a.category_slug) ?? 0) + 1);

  return (
    <div className="mn-root">
      <div className="mn-topbar-wrap">
        <div className="mn-topbar">
          <Link href={`/manual/${version}`} className="mn-brand">
            <b>Marvelous Designer</b>
            <span>Manual</span>
          </Link>
        </div>
      </div>
      <div className="mn-container">
        <div className="mn-main">
          <nav className="mn-rail">
            <div className="mn-ver-block">
              <label>Version</label>
              <VersionSelect versions={versions.map((v) => v.code)} current={version} />
              <div className="mn-stat">
                <b>{articles.length}</b> documents
              </div>
            </div>
            <h3>Categories</h3>
            <div>
              {categories
                .filter((c) => counts.has(c.slug))
                .map((c) => (
                  <Link key={c.slug} href={`/manual/${version}/${c.slug}`} className="mn-cat">
                    <span>{c.name}</span>
                    <span className="n">{counts.get(c.slug)}</span>
                  </Link>
                ))}
            </div>
          </nav>
          <div className="mn-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
