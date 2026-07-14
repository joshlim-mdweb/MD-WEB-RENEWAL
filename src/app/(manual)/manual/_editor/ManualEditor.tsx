"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { createClient } from "@/lib/supabase/client";
import { saveArticle } from "./actions";
import type { ManualArticle } from "@/lib/manual/db";
import "./editor.css";

type Revision = { id: number; title: string; body_md: string; edited_by: string | null; edited_at: string };

function B({ on, label, run }: { on?: boolean; label: string; run: () => void }) {
  return (
    <button type="button" className={on ? "on" : ""} onMouseDown={(e) => { e.preventDefault(); run(); }}>
      {label}
    </button>
  );
}

const SLASH_ITEMS = [
  { ic: "H2", label: "제목 (Heading 2)", run: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { ic: "H3", label: "소제목 (Heading 3)", run: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { ic: "•", label: "불릿 리스트", run: (e: Editor) => e.chain().focus().toggleBulletList().run() },
  { ic: "1.", label: "번호 리스트", run: (e: Editor) => e.chain().focus().toggleOrderedList().run() },
  { ic: "▦", label: "테이블 3×3", run: (e: Editor) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { ic: "❝", label: "패널 (인용)", run: (e: Editor) => e.chain().focus().toggleBlockquote().run() },
  { ic: "{}", label: "코드 블록", run: (e: Editor) => e.chain().focus().toggleCodeBlock().run() },
  { ic: "—", label: "구분선", run: (e: Editor) => e.chain().focus().setHorizontalRule().run() },
];

export function ManualEditor({
  article,
  revisions,
  allVersions,
  currentVersion,
}: {
  article: ManualArticle & { rev: number };
  revisions: Revision[];
  allVersions: string[];
  currentVersion: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [versions, setVersions] = useState<string[]>(article.versions);
  const [baseRev, setBaseRev] = useState(article.rev);
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [slash, setSlash] = useState<{ x: number; y: number; sel: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = useCallback(async (file: File, editor: Editor) => {
    const supabase = createClient();
    const path = `${article.canonical_id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("manual-images").upload(path, file);
    if (error) {
      setFlash({ kind: "err", msg: `이미지 업로드에 실패했어요: ${error.message}` });
      return;
    }
    const { data } = supabase.storage.from("manual-images").getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl, alt: file.name }).run();
  }, [article.canonical_id]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Table.configure({ resizable: false }),
      TableRow, TableHeader, TableCell,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "본문 입력 — '/'로 블록 삽입" }),
      Markdown.configure({ html: false, linkify: true, breaks: false }),
    ],
    content: article.body_md,
    editorProps: {
      handleKeyDown: (view, event) => {
        if (slash) {
          if (event.key === "Escape") { setSlash(null); return true; }
          if (event.key === "ArrowDown") { setSlash((s) => s && { ...s, sel: (s.sel + 1) % SLASH_ITEMS.length }); return true; }
          if (event.key === "ArrowUp") { setSlash((s) => s && { ...s, sel: (s.sel - 1 + SLASH_ITEMS.length) % SLASH_ITEMS.length }); return true; }
          if (event.key === "Enter") {
            const item = SLASH_ITEMS[slash.sel];
            view.dispatch(view.state.tr.delete(view.state.selection.from - 1, view.state.selection.from));
            if (editor) item.run(editor);
            setSlash(null);
            return true;
          }
          setSlash(null);
          return false;
        }
        if (event.key === "/" && view.state.selection.$from.parent.content.size === 0) {
          const coords = view.coordsAtPos(view.state.selection.from);
          const box = view.dom.closest(".mn-editor")!.getBoundingClientRect();
          setSlash({ x: coords.left - box.left, y: coords.bottom - box.top + 6, sel: 0 });
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"));
        if (file && editor) { void uploadImage(file, editor); return true; }
        return false;
      },
      handleDrop: (_view, event) => {
        const file = Array.from(event.dataTransfer?.files ?? []).find((f) => f.type.startsWith("image/"));
        if (file && editor) { event.preventDefault(); void uploadImage(file, editor); return true; }
        return false;
      },
    },
  });

  async function onSave() {
    if (!editor) return;
    setSaving(true);
    setFlash(null);
    const body_md: string = (
      editor.storage as unknown as { markdown: { getMarkdown: () => string } }
    ).markdown.getMarkdown();
    const res = await saveArticle({
      canonical_id: article.canonical_id,
      baseRev,
      title,
      body_md,
      versions,
      category_slug: article.category_slug,
      slug: article.slug,
      version: currentVersion,
    });
    setSaving(false);
    if (res.ok) {
      setBaseRev(res.rev);
      setFlash({ kind: "ok", msg: "저장됐어요." });
      router.refresh();
    } else {
      setFlash({ kind: "err", msg: res.message });
    }
  }

  function toggleVersion(v: string) {
    setVersions((prev) => {
      const has = prev.includes(v);
      const next = has ? prev.filter((x) => x !== v) : [...prev, v];
      return allVersions.filter((x) => next.includes(x)); // 최신순 정렬 유지
    });
  }

  return (
    <div className="mn-editor-shell">
      <div>
        {flash && <div className={`mn-flash ${flash.kind}`}>{flash.msg}</div>}
        <div className="mn-toolbar">
          {editor && (
            <>
              <B on={editor.isActive("heading", { level: 2 })} label="H2" run={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
              <B on={editor.isActive("heading", { level: 3 })} label="H3" run={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
              <span className="sep" />
              <B on={editor.isActive("bold")} label="B" run={() => editor.chain().focus().toggleBold().run()} />
              <B on={editor.isActive("italic")} label="I" run={() => editor.chain().focus().toggleItalic().run()} />
              <B on={editor.isActive("code")} label="{}" run={() => editor.chain().focus().toggleCode().run()} />
              <span className="sep" />
              <B on={editor.isActive("bulletList")} label="• 목록" run={() => editor.chain().focus().toggleBulletList().run()} />
              <B on={editor.isActive("orderedList")} label="1. 목록" run={() => editor.chain().focus().toggleOrderedList().run()} />
              <B on={editor.isActive("blockquote")} label="❝ 패널" run={() => editor.chain().focus().toggleBlockquote().run()} />
              <span className="sep" />
              <B label="▦ 표" run={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
              {editor.isActive("table") && (
                <>
                  <B label="+행" run={() => editor.chain().focus().addRowAfter().run()} />
                  <B label="+열" run={() => editor.chain().focus().addColumnAfter().run()} />
                  <B label="−행" run={() => editor.chain().focus().deleteRow().run()} />
                  <B label="−열" run={() => editor.chain().focus().deleteColumn().run()} />
                </>
              )}
              <B label="🖼 이미지" run={() => fileRef.current?.click()} />
              <span className="spacer" />
              <button type="button" className="save" disabled={saving} onClick={onSave}>
                {saving ? "저장 중…" : "저장하기"}
              </button>
            </>
          )}
        </div>
        <div className="mn-editor" style={{ position: "relative" }}>
          <EditorContent editor={editor} />
          {slash && (
            <div className="mn-slash" style={{ left: slash.x, top: slash.y }}>
              {SLASH_ITEMS.map((it, i) => (
                <button
                  key={it.label}
                  className={i === slash.sel ? "sel" : ""}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (!editor) return;
                    const { from } = editor.state.selection;
                    editor.view.dispatch(editor.state.tr.delete(from - 1, from));
                    it.run(editor);
                    setSlash(null);
                  }}
                >
                  <span className="ic">{it.ic}</span>
                  {it.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f && editor) void uploadImage(f, editor);
            e.target.value = "";
          }}
        />
      </div>

      <aside className="mn-side">
        <div className="box">
          <label>제목</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="box">
          <label>유효 버전 ({versions.length})</label>
          <div className="mn-verlist">
            {allVersions.map((v) => (
              <label key={v}>
                <input type="checkbox" checked={versions.includes(v)} onChange={() => toggleVersion(v)} />
                {v}
              </label>
            ))}
          </div>
        </div>
        <div className="box">
          <label>수정 이력</label>
          {revisions.length === 0 && <div style={{ fontSize: 12.5, color: "var(--mn-muted)" }}>아직 수정 이력이 없어요.</div>}
          {revisions.map((r) => (
            <div key={r.id} className="mn-rev">
              <span>
                {r.edited_at.slice(0, 16).replace("T", " ")}
                <br />
                <span style={{ color: "var(--mn-muted)" }}>{r.edited_by?.split("@")[0]}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (editor) {
                    editor.commands.setContent(r.body_md);
                    setTitle(r.title);
                    setFlash({ kind: "ok", msg: "이 버전을 불러왔어요. 저장해야 반영돼요." });
                  }
                }}
              >
                불러오기
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
