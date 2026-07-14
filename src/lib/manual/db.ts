import { createClient } from "@supabase/supabase-js";

export type ManualVersion = { code: string; sort: number };
export type ManualCategory = { slug: string; name: string; sort: number };
export type ManualArticle = {
  canonical_id: string;
  slug: string;
  category_slug: string;
  title: string;
  body_md: string;
  versions: string[];
  videos: string[];
  tobe_action: string;
  updated_at: string;
};

function client() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function getVersions(): Promise<ManualVersion[]> {
  const { data, error } = await client()
    .from("manual_versions")
    .select("*")
    .order("sort");
  if (error) throw error;
  return data;
}

export async function getCategories(): Promise<ManualCategory[]> {
  const { data, error } = await client()
    .from("manual_categories")
    .select("*")
    .order("sort");
  if (error) throw error;
  return data;
}

/** 해당 버전에 유효한 아티클 목록 (본문 제외) */
export async function getArticlesForVersion(version: string) {
  const { data, error } = await client()
    .from("manual_articles")
    .select("canonical_id, slug, category_slug, title, versions")
    .contains("versions", [version])
    .order("title");
  if (error) throw error;
  return data as Omit<ManualArticle, "body_md" | "videos" | "tobe_action" | "updated_at">[];
}

export async function getArticle(categorySlug: string, slug: string) {
  const { data, error } = await client()
    .from("manual_articles")
    .select("*")
    .eq("category_slug", categorySlug)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as ManualArticle | null;
}
