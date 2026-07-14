"use client";

import { useState, useTransition } from "react";
import { setReviewStatus } from "./actions";

const LABEL: Record<string, { text: string; cls: string }> = {
  pending: { text: "검수 대기", cls: "" },
  approved: { text: "승인됨", cls: "hl" },
  needs_fix: { text: "수정 필요", cls: "hl" },
};

export function ReviewBar({
  canonicalId,
  status,
  note,
  attention,
  reviewedBy,
  path,
}: {
  canonicalId: string;
  status: string;
  note: string | null;
  attention: string | null;
  reviewedBy: string | null;
  path: string;
}) {
  const [noteText, setNoteText] = useState(note ?? "");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function submit(next: "approved" | "needs_fix" | "pending") {
    startTransition(async () => {
      const res = await setReviewStatus({ canonical_id: canonicalId, status: next, note: noteText, path });
      setMsg(res.ok ? "저장됐어요." : res.message ?? "실패했어요.");
    });
  }

  return (
    <div className="mn-metaband" style={{ borderColor: status === "needs_fix" ? "var(--mn-accent)" : undefined }}>
      <span className="k">Review</span>
      <span className={`mn-vchip ${LABEL[status]?.cls ?? ""}`}>{LABEL[status]?.text ?? status}</span>
      {attention && <span className="mn-vchip hl">우선 검수: {attention}</span>}
      {reviewedBy && <span className="mn-vchip">{reviewedBy.split("@")[0]}</span>}
      <input
        type="text"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="검수 노트"
        style={{
          flex: 1, minWidth: 160, padding: "5px 9px", border: "1px solid var(--mn-line)",
          borderRadius: 7, background: "var(--mn-bg)", color: "var(--mn-ink)", fontSize: 12.5, fontFamily: "inherit",
        }}
      />
      <button type="button" disabled={pending} onClick={() => submit("approved")}
        style={{ border: 0, borderRadius: 7, padding: "6px 12px", background: "var(--mn-accent)", color: "#fff", fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>
        승인하기
      </button>
      <button type="button" disabled={pending} onClick={() => submit("needs_fix")}
        style={{ border: "1px solid var(--mn-accent)", borderRadius: 7, padding: "5px 12px", background: "none", color: "var(--mn-accent)", fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>
        수정 필요
      </button>
      {msg && <span style={{ fontSize: 12, color: "var(--mn-muted)" }}>{msg}</span>}
    </div>
  );
}
