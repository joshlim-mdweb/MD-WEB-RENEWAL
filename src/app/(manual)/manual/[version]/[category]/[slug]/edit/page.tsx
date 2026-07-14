import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEditorEmail, manualServerClient } from "@/lib/manual/auth";
import { getVersions } from "@/lib/manual/db";
import { ManualEditor } from "../../../../_editor/ManualEditor";

export default async function EditPage({
  params,
}: {
  params: Promise<{ version: string; category: string; slug: string }>;
}) {
  const { version: rawV, category, slug: rawSlug } = await params;
  const version = decodeURIComponent(rawV);
  const slug = decodeURIComponent(rawSlug);

  const email = await getEditorEmail();
  if (!email) redirect(`/manual/login`);

  const supabase = await manualServerClient();
  const [{ data: article }, { data: revisions }, versions] = await Promise.all([
    supabase.from("manual_articles").select("*").eq("category_slug", category).eq("slug", slug).maybeSingle(),
    supabase
      .from("manual_revisions")
      .select("id, title, body_md, edited_by, edited_at")
      .eq("canonical_id", (await supabase.from("manual_articles").select("canonical_id").eq("category_slug", category).eq("slug", slug).maybeSingle()).data?.canonical_id ?? "")
      .order("edited_at", { ascending: false })
      .limit(10),
    getVersions(),
  ]);
  if (!article) notFound();

  return (
    <>
      <div className="mn-crumb">
        <Link href={`/manual/${version}/${category}/${slug}`}>← 문서로 돌아가기</Link> · 편집 중 ({email})
      </div>
      <h1 className="mn-title" style={{ marginBottom: 18 }}>
        {article.title}
      </h1>
      <ManualEditor
        article={article}
        revisions={revisions ?? []}
        allVersions={versions.map((v) => v.code)}
        currentVersion={version}
      />
    </>
  );
}
