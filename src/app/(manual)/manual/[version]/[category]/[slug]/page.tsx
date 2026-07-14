import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getArticle, getCategories } from "@/lib/manual/db";
import { getEditorEmail } from "@/lib/manual/auth";
import { ReviewBar } from "../../../_editor/ReviewBar";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ version: string; category: string; slug: string }>;
}) {
  const { version: rawV, category, slug } = await params;
  const version = decodeURIComponent(rawV);
  const [article, categories, editorEmail] = await Promise.all([
    getArticle(category, decodeURIComponent(slug)),
    getCategories(),
    getEditorEmail(),
  ]);
  if (!article) notFound();
  const cat = categories.find((c) => c.slug === category);
  const validHere = article.versions.includes(version);
  const html = await marked.parse(article.body_md, { gfm: true });

  return (
    <>
      <div className="mn-crumb">
        <Link href={`/manual/${version}`}>MD {version}</Link> ·{" "}
        <Link href={`/manual/${version}/${category}`}>{cat?.name ?? category}</Link>
      </div>
      <h1 className="mn-title">
        {article.title}
        {editorEmail && (
          <Link
            href={`/manual/${version}/${category}/${article.slug}/edit`}
            style={{ fontSize: 13, fontWeight: 600, color: "var(--mn-accent)", marginLeft: 12, textDecoration: "none" }}
          >
            ✎ Edit
          </Link>
        )}
      </h1>
      {editorEmail && (
        <ReviewBar
          canonicalId={article.canonical_id}
          status={article.review_status}
          note={article.review_note}
          attention={article.needs_attention}
          reviewedBy={article.reviewed_by}
          path={`/manual/${version}/${category}/${article.slug}`}
        />
      )}
      <div className="mn-metaband">
        <span className="k">Applies to</span>
        {article.versions.slice(0, 8).map((v) => (
          <span key={v} className={`mn-vchip mn-mono ${v === version ? "hl" : ""}`}>
            {v}
          </span>
        ))}
        {article.versions.length > 8 && (
          <span className="mn-vchip mn-mono">+{article.versions.length - 8}</span>
        )}
      </div>
      {!validHere && (
        <div className="mn-notice">
          이 문서는 MD {version}에는 없어요. 유효한 최신 버전:{" "}
          <Link href={`/manual/${article.versions[0]}/${category}/${article.slug}`}>
            MD {article.versions[0]}
          </Link>
        </div>
      )}
      <div className="mn-article" dangerouslySetInnerHTML={{ __html: html }} />
      {article.videos.length > 0 && (
        <div className="mn-article">
          <h2>Videos</h2>
          {article.videos.map((v) => (
            <a key={v} className="mn-video" href={v} target="_blank" rel="noopener noreferrer">
              <span className="play">▶</span>
              <span>{v}</span>
            </a>
          ))}
        </div>
      )}
      <div className="mn-note">
        원본 article {article.canonical_id} · 정리 방식: {article.tobe_action} · 최종 수정{" "}
        {article.updated_at.slice(0, 10)}
      </div>
    </>
  );
}
