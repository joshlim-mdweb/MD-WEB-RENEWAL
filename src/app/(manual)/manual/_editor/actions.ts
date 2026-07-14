"use server";

import { revalidatePath } from "next/cache";
import { getEditorEmail, manualServerClient } from "@/lib/manual/auth";

export type SaveResult =
  | { ok: true; rev: number }
  | { ok: false; error: "conflict" | "forbidden" | "failed"; message: string };

export async function saveArticle(input: {
  canonical_id: string;
  baseRev: number;
  title: string;
  body_md: string;
  versions: string[];
  category_slug: string;
  slug: string;
  version: string; // 현재 보던 버전 (revalidate 경로용)
}): Promise<SaveResult> {
  const email = await getEditorEmail();
  if (!email) return { ok: false, error: "forbidden", message: "편집 권한이 없어요. 로그인해 주세요." };

  const supabase = await manualServerClient();

  // 낙관적 잠금: baseRev와 일치할 때만 갱신
  const { data: updated, error } = await supabase
    .from("manual_articles")
    .update({
      title: input.title,
      body_md: input.body_md,
      versions: input.versions,
      rev: input.baseRev + 1,
      updated_at: new Date().toISOString(),
      updated_by: email,
    })
    .eq("canonical_id", input.canonical_id)
    .eq("rev", input.baseRev)
    .select("rev")
    .maybeSingle();

  if (error) return { ok: false, error: "failed", message: error.message };
  if (!updated) {
    return {
      ok: false,
      error: "conflict",
      message: "다른 사람이 먼저 저장했어요. 페이지를 새로고침해서 최신 내용을 확인해 주세요.",
    };
  }

  await supabase.from("manual_revisions").insert({
    canonical_id: input.canonical_id,
    title: input.title,
    body_md: input.body_md,
    edited_by: email,
  });

  revalidatePath(`/manual/${input.version}/${input.category_slug}/${input.slug}`);
  revalidatePath(`/manual/${input.version}/${input.category_slug}`);
  return { ok: true, rev: updated.rev };
}

export async function createArticle(input: {
  title: string;
  category_slug: string;
  version: string;
}): Promise<{ ok: true; slug: string } | { ok: false; message: string }> {
  const email = await getEditorEmail();
  if (!email) return { ok: false, message: "편집 권한이 없어요." };

  const slugBase = input.title
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-") || "untitled";
  const canonical_id = `new-${Date.now()}`;
  const slug = slugBase;

  const supabase = await manualServerClient();
  const { error } = await supabase.from("manual_articles").insert({
    canonical_id,
    slug,
    category_slug: input.category_slug,
    title: input.title,
    body_md: "",
    versions: [input.version],
    videos: [],
    tobe_action: "new",
    source_ids: [],
    updated_by: email,
  });
  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "같은 제목의 문서가 이 카테고리에 이미 있어요." };
    }
    return { ok: false, message: error.message };
  }
  revalidatePath(`/manual/${input.version}/${input.category_slug}`);
  return { ok: true, slug };
}

export async function setArchived(input: {
  canonical_id: string;
  archived: boolean;
  version: string;
  category_slug: string;
  slug: string;
}): Promise<{ ok: boolean; message?: string }> {
  const email = await getEditorEmail();
  if (!email) return { ok: false, message: "권한이 없어요." };

  const supabase = await manualServerClient();
  const { error } = await supabase
    .from("manual_articles")
    .update({
      archived_at: input.archived ? new Date().toISOString() : null,
      archived_by: input.archived ? email : null,
    })
    .eq("canonical_id", input.canonical_id);
  if (error) return { ok: false, message: error.message };
  revalidatePath(`/manual/${input.version}/${input.category_slug}`);
  revalidatePath(`/manual/${input.version}/${input.category_slug}/${input.slug}`);
  revalidatePath("/manual/review");
  return { ok: true };
}

export async function setReviewStatus(input: {
  canonical_id: string;
  status: "approved" | "needs_fix" | "pending";
  note: string;
  path: string;
}): Promise<{ ok: boolean; message?: string }> {
  const email = await getEditorEmail();
  if (!email) return { ok: false, message: "권한이 없어요." };

  const supabase = await manualServerClient();
  const { error } = await supabase
    .from("manual_articles")
    .update({ review_status: input.status, reviewed_by: email, review_note: input.note || null })
    .eq("canonical_id", input.canonical_id);
  if (error) return { ok: false, message: error.message };
  revalidatePath(input.path);
  revalidatePath("/manual/review");
  return { ok: true };
}
