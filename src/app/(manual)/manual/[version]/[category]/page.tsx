import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesForVersion, getCategories } from "@/lib/manual/db";
import { getEditorEmail } from "@/lib/manual/auth";
import { NewArticleButton } from "../../_editor/ArticleAdmin";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ version: string; category: string }>;
}) {
  const { version: rawV, category } = await params;
  const version = decodeURIComponent(rawV);
  const [categories, articles, editorEmail] = await Promise.all([
    getCategories(),
    getArticlesForVersion(version),
    getEditorEmail(),
  ]);
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const list = articles.filter((a) => a.category_slug === category);

  return (
    <>
      <div className="mn-crumb">
        <Link href={`/manual/${version}`}>MD {version}</Link> · {cat.name}
      </div>
      <h1 className="mn-title">{cat.name}</h1>
      <div className="mn-sub">
        {list.length} documents · valid in MD {version}
      </div>
      {editorEmail && <NewArticleButton version={version} categorySlug={category} />}
      {list.length === 0 ? (
        <div className="mn-empty">이 버전에는 해당 카테고리 문서가 없어요.</div>
      ) : (
        <div>
          {list.map((a) => (
            <Link
              key={a.canonical_id}
              href={`/manual/${version}/${category}/${a.slug}`}
              className="mn-item"
            >
              <span className="t">{a.title}</span>
              <span className="meta">
                {a.versions[a.versions.length - 1] !== "2.2" && (
                  <span className="mn-vchip hl mn-mono">
                    {a.versions[a.versions.length - 1]}+
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
