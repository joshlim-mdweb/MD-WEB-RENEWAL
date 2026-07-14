"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createArticle, setArchived } from "./actions";

/** 카테고리 페이지: 새 문서 만들기 */
export function NewArticleButton({ version, categorySlug }: { version: string; categorySlug: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ border: "1px dashed var(--mn-accent)", borderRadius: 8, padding: "7px 14px",
          background: "none", color: "var(--mn-accent)", fontWeight: 600, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit", marginBottom: 14 }}
      >
        + 새 문서 만들기
      </button>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setErr(null);
        start(async () => {
          const res = await createArticle({ title, category_slug: categorySlug, version });
          if (res.ok) router.push(`/manual/${version}/${categorySlug}/${res.slug}/edit`);
          else setErr(res.message);
        });
      }}
      style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}
    >
      <input
        autoFocus
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="새 문서 제목 (영문)"
        style={{ flex: 1, minWidth: 220, padding: "7px 10px", border: "1px solid var(--mn-line)",
          borderRadius: 8, background: "var(--mn-panel)", color: "var(--mn-ink)", fontSize: 13.5, fontFamily: "inherit" }}
      />
      <button type="submit" disabled={pending}
        style={{ border: 0, borderRadius: 8, padding: "8px 14px", background: "var(--mn-accent)",
          color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
        {pending ? "만드는 중…" : "만들고 편집하기"}
      </button>
      <button type="button" onClick={() => setOpen(false)}
        style={{ border: 0, background: "none", color: "var(--mn-muted)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
        닫기
      </button>
      {err && <span style={{ fontSize: 12.5, color: "var(--mn-accent)", width: "100%" }}>{err}</span>}
    </form>
  );
}

/** 아티클 페이지: 보관/복구 */
export function ArchiveButton({
  canonicalId, archived, version, categorySlug, slug,
}: {
  canonicalId: string; archived: boolean; version: string; categorySlug: string; slug: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function toggle() {
    if (!archived && !confirm("이 문서를 보관할까요? 뷰어에서 숨겨지고, 언제든 복구할 수 있어요.")) return;
    start(async () => {
      const res = await setArchived({ canonical_id: canonicalId, archived: !archived, version, category_slug: categorySlug, slug });
      if (res.ok) {
        if (!archived) router.push(`/manual/${version}/${categorySlug}`);
        else router.refresh();
      } else alert(res.message);
    });
  }

  return (
    <button type="button" onClick={toggle} disabled={pending}
      style={{ border: "1px solid var(--mn-line)", borderRadius: 7, padding: "5px 12px",
        background: "none", color: archived ? "var(--mn-accent)" : "var(--mn-muted)",
        fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>
      {pending ? "처리 중…" : archived ? "복구하기" : "보관하기"}
    </button>
  );
}
