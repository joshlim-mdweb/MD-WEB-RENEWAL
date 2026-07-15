import Link from "next/link";
import { getArticlesForVersion, getCategories } from "@/lib/manual/db";

// 랜딩 그룹핑 — 분류 규칙 확정 전 임시 구성 (코드 상수라 조정 쉬움)
const GROUPS: { title: string; cats: string[] }[] = [
  {
    title: "Getting Started",
    cats: ["installation-license", "settings", "interface-windows", "troubleshooting"],
  },
  {
    title: "Design",
    cats: ["2d-pattern-creation", "2d-pattern-editing", "3d-garment", "sewing-tack", "arrangement", "avatar-measurement"],
  },
  {
    title: "Materials & Details",
    cats: ["fabric-material", "graphic-print", "button-buttonhole", "topstitch-puckering", "trims-zipper-piping", "mesh-uv-tools"],
  },
  {
    title: "Output & More",
    cats: ["file-io-automation", "animation-scene", "modular", "ai-studio", "release-notes"],
  },
];

const ICONS: Record<string, string> = {
  "installation-license": "🔑", settings: "⚙️", "interface-windows": "🪟", troubleshooting: "🛠️",
  "2d-pattern-creation": "📐", "2d-pattern-editing": "✂️", "3d-garment": "👗", "sewing-tack": "🧵",
  arrangement: "🧍", "avatar-measurement": "📏", "fabric-material": "🧶", "graphic-print": "🎨",
  "button-buttonhole": "🔘", "topstitch-puckering": "〰️", "trims-zipper-piping": "🪢", "mesh-uv-tools": "🕸️",
  "file-io-automation": "📦", "animation-scene": "🎬", modular: "🧩", "ai-studio": "✨", "release-notes": "📰",
};

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
  const counts = new Map<string, number>();
  for (const a of articles) counts.set(a.category_slug, (counts.get(a.category_slug) ?? 0) + 1);
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const grouped = new Set(GROUPS.flatMap((g) => g.cats));
  const ungrouped = categories.filter((c) => !grouped.has(c.slug) && counts.has(c.slug));

  return (
    <>
      <div className="mn-hero">
        <h1>MD {version} Manual</h1>
        <form action={`/manual/${version}/search`}>
          <input name="q" placeholder="Search the manual" autoComplete="off" />
        </form>
      </div>

      {GROUPS.map((g) => {
        const cards = g.cats.filter((slug) => counts.has(slug));
        if (cards.length === 0) return null;
        return (
          <section key={g.title} className="mn-group">
            <h2>{g.title}</h2>
            <div className="mn-cardgrid">
              {cards.map((slug) => (
                <Link key={slug} href={`/manual/${version}/${slug}`} className="mn-card">
                  <span className="ic">{ICONS[slug] ?? "📄"}</span>
                  <span>
                    <span className="nm">{catName.get(slug) ?? slug}</span>
                    <br />
                    <span className="ct">{counts.get(slug)} documents</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {ungrouped.length > 0 && (
        <section className="mn-group">
          <h2>Others</h2>
          <div className="mn-cardgrid">
            {ungrouped.map((c) => (
              <Link key={c.slug} href={`/manual/${version}/${c.slug}`} className="mn-card">
                <span className="ic">{ICONS[c.slug] ?? "📄"}</span>
                <span>
                  <span className="nm">{c.name}</span>
                  <br />
                  <span className="ct">{counts.get(c.slug)} documents</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
