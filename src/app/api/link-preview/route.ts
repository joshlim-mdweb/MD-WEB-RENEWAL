import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LinkPreview {
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  url: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractMeta(html: string, property: string): string {
  // property= (og/twitter) and name= variants
  return (
    html.match(new RegExp(`<meta[^>]+property="${property}"[^>]+content="([^"]+)"`))?.[1] ??
    html.match(new RegExp(`<meta[^>]+name="${property}"[^>]+content="([^"]+)"`))?.[1] ??
    html.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+property="${property}"`))?.[1] ??
    ""
  );
}

function extractTitle(html: string): string {
  return html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ?? "";
}

function faviconFromUrl(url: string): string {
  try {
    const origin = new URL(url).origin;
    return `${origin}/favicon.ico`;
  } catch {
    return "";
  }
}

async function fetchUrlPreview(url: string): Promise<LinkPreview> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; OpinionBot/1.0)" },
    signal: AbortSignal.timeout(5000),
  });

  const html = await res.text();

  const ogTitle = extractMeta(html, "og:title");
  const ogDesc = extractMeta(html, "og:description");
  const twitterDesc = extractMeta(html, "twitter:description");
  const metaDesc = extractMeta(html, "description");
  const ogImage = extractMeta(html, "og:image");
  const twitterImage = extractMeta(html, "twitter:image");
  const pageTitle = ogTitle || extractTitle(html);
  const description = ogDesc || twitterDesc || metaDesc;

  // Resolve relative og:image to absolute
  let image = ogImage || twitterImage || null;
  if (image && !image.startsWith("http")) {
    try {
      const base = new URL(url);
      image = new URL(image, base.origin).href;
    } catch {
      image = null;
    }
  }

  return {
    title: pageTitle || url,
    description,
    image,
    favicon: faviconFromUrl(url),
    url,
  };
}

async function fetchGitHubPreview(url: string): Promise<LinkPreview> {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) {
    return { title: url, description: "", image: null, favicon: null, url };
  }

  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "OpinionBot/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(apiUrl, {
    headers,
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    return { title: `${owner}/${repo}`, description: "", image: null, favicon: null, url };
  }

  const data = (await res.json()) as {
    full_name: string;
    description: string | null;
    owner: { avatar_url: string };
  };

  return {
    title: data.full_name,
    description: data.description ?? "",
    image: `https://opengraph.githubassets.com/1/${owner}/${repo}`,
    favicon: data.owner.avatar_url,
    url,
  };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

// GET /api/link-preview?url=https://...
// → { title, description, image, favicon, url }
export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url") ?? "";
  if (!rawUrl) {
    return NextResponse.json({ error: "url_required" }, { status: 400 });
  }

  let normalizedUrl: string;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("invalid protocol");
    }
    normalizedUrl = parsed.href;
  } catch {
    return NextResponse.json({ error: "invalid_url" }, { status: 422 });
  }

  try {
    const isGitHub = /github\.com/i.test(normalizedUrl);
    const preview = isGitHub
      ? await fetchGitHubPreview(normalizedUrl)
      : await fetchUrlPreview(normalizedUrl);

    return NextResponse.json(preview);
  } catch {
    // Fallback — never surface errors to the client, just return minimal preview
    return NextResponse.json<LinkPreview>({
      title: rawUrl,
      description: "",
      image: null,
      favicon: null,
      url: rawUrl,
    });
  }
}
