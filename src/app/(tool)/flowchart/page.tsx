"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FlowchartCanvas, { edgeKey, parseEdgeKey } from "@/components/tool/FlowchartCanvas";
import type { FlowchartData, FlowchartSession, FlowNode, FlowEdge } from "@/lib/types/tool";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           "#0a0a0f",
  sidebar:      "#0d0d13",
  panel:        "#0d0d13",
  surface:      "#13131e",
  surfaceHover: "#18182a",
  border:       "rgba(255,255,255,0.06)",
  borderMid:    "rgba(255,255,255,0.1)",
  accent:       "#df4d18",
  accentBg:     "rgba(223,77,24,0.12)",
  text:         "rgba(255,255,255,0.88)",
  textMid:      "rgba(255,255,255,0.5)",
  textDim:      "rgba(255,255,255,0.28)",
  textMute:     "rgba(255,255,255,0.14)",
  yes:          "#4ade80",
  no:           "#f87171",
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: 6, padding: "7px 10px", fontSize: 12, color: C.text,
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, color: C.textDim,
  textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5,
};

const NODE_TYPES: FlowNode["type"][] = ["start", "screen", "decision", "route", "end"];
const NODE_TYPE_LABELS: Record<FlowNode["type"], string> = {
  start: "Start", screen: "Screen", decision: "Decision", route: "Route", end: "End",
};

const MAX_HISTORY = 20;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.1;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateId(nodes: FlowNode[], prefix = "node") {
  let i = 1;
  const ids = new Set(nodes.map((n) => n.id));
  while (ids.has(`${prefix}-${i}`)) i++;
  return `${prefix}-${i}`;
}

function hasDuplicateEdge(edges: FlowEdge[], from: string, to: string) {
  return edges.some((e) => e.from === from && e.to === to);
}

// ─── Small components ─────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "12px 0" }} />;
}

function IconBtn({ onClick, title, children, disabled }: {
  onClick: () => void; title: string; children: React.ReactNode; disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} title={title} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov && !disabled ? C.surfaceHover : "transparent",
        border: `1px solid ${hov && !disabled ? C.borderMid : C.border}`,
        borderRadius: 6, padding: "5px 10px", cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? C.textMute : hov ? C.text : C.textMid,
        fontSize: 12, display: "flex", alignItems: "center", gap: 5,
        transition: "all 0.15s", fontFamily: "inherit", opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function PrimaryBtn({ onClick, children, disabled }: {
  onClick: () => void; children: React.ReactNode; disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: disabled ? "rgba(223,77,24,0.3)" : hov ? "#c44315" : C.accent,
        border: "none", borderRadius: 6, padding: "7px 14px",
        cursor: disabled ? "not-allowed" : "pointer",
        color: "#fff", fontSize: 12, fontWeight: 500,
        transition: "all 0.15s", fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function DangerBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(248,113,113,0.15)" : "rgba(248,113,113,0.08)",
        border: "1px solid rgba(248,113,113,0.2)",
        borderRadius: 6, padding: "7px 12px", cursor: "pointer",
        color: C.no, fontSize: 12, fontFamily: "inherit", textAlign: "left",
        width: "100%", transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#111119", border: `1px solid ${C.borderMid}`,
          borderRadius: 12, padding: 24, minWidth: 360, maxWidth: 440,
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Add Node Modal ───────────────────────────────────────────────────────────
function AddNodeModal({ nodes, defaultStep, defaultTrack, onAdd, onClose }: {
  nodes: FlowNode[];
  defaultStep?: number;
  defaultTrack?: number;
  onAdd: (node: FlowNode) => void;
  onClose: () => void;
}) {
  const maxStep = Math.max(0, ...nodes.map((n) => n.step));
  const [form, setForm] = useState<FlowNode>({
    id: generateId(nodes),
    label: "",
    type: "screen",
    step: defaultStep ?? maxStep + 1,
    track: defaultTrack ?? 0,
  });
  const [idError, setIdError] = useState("");
  const set = (k: keyof FlowNode, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.id.trim() || !form.label.trim()) return;
    if (nodes.some((n) => n.id === form.id.trim())) {
      setIdError("이미 사용 중인 ID예요.");
      return;
    }
    onAdd({ ...form, id: form.id.trim(), label: form.label.trim() });
    onClose();
  };

  return (
    <Modal title="노드 추가" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>ID</label>
          <input
            style={{ ...inputStyle, borderColor: idError ? "rgba(248,113,113,0.4)" : undefined }}
            value={form.id}
            onChange={(e) => { set("id", e.target.value); setIdError(""); }}
            placeholder="my-node"
          />
          {idError && <p style={{ fontSize: 10, color: C.no, marginTop: 4 }}>{idError}</p>}
        </div>
        <div>
          <label style={labelStyle}>레이블</label>
          <input style={inputStyle} value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="화면 이름" autoFocus />
        </div>
        <div>
          <label style={labelStyle}>타입</label>
          <select style={inputStyle} value={form.type} onChange={(e) => set("type", e.target.value as FlowNode["type"])}>
            {NODE_TYPES.map((t) => <option key={t} value={t}>{NODE_TYPE_LABELS[t]}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>Step</label>
            <input style={inputStyle} type="number" min={0} value={form.step} onChange={(e) => set("step", parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label style={labelStyle}>Track</label>
            <input style={inputStyle} type="number" min={0} value={form.track} onChange={(e) => set("track", parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <IconBtn onClick={onClose} title="닫기">닫기</IconBtn>
          <PrimaryBtn onClick={handleAdd} disabled={!form.id.trim() || !form.label.trim()}>추가하기</PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Add Edge Modal ───────────────────────────────────────────────────────────
function AddEdgeModal({ nodes, edges, onAdd, onClose }: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onAdd: (edge: FlowEdge) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<{ from: string; to: string; condition: "" | "yes" | "no"; label: string }>({
    from: nodes[0]?.id ?? "", to: nodes[1]?.id ?? "", condition: "", label: "",
  });
  const [dupError, setDupError] = useState("");
  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setDupError(""); };

  const handleAdd = () => {
    if (!form.from || !form.to || form.from === form.to) return;
    if (hasDuplicateEdge(edges, form.from, form.to)) {
      setDupError("이미 연결된 엣지가 있어요.");
      return;
    }
    const edge: FlowEdge = { from: form.from, to: form.to };
    if (form.condition) edge.condition = form.condition as "yes" | "no";
    if (form.label.trim()) edge.label = form.label.trim();
    onAdd(edge);
    onClose();
  };

  return (
    <Modal title="엣지 추가" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>From</label>
          <select style={inputStyle} value={form.from} onChange={(e) => set("from", e.target.value)}>
            {nodes.map((n) => <option key={n.id} value={n.id}>{n.label} ({n.id})</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>To</label>
          <select style={inputStyle} value={form.to} onChange={(e) => set("to", e.target.value)}>
            {nodes.map((n) => <option key={n.id} value={n.id}>{n.label} ({n.id})</option>)}
          </select>
        </div>
        {dupError && <p style={{ fontSize: 10, color: C.no, margin: "-8px 0 0" }}>{dupError}</p>}
        <div>
          <label style={labelStyle}>조건</label>
          <select style={inputStyle} value={form.condition} onChange={(e) => set("condition", e.target.value)}>
            <option value="">없음</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>레이블 (선택)</label>
          <input style={inputStyle} value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="케이스명" />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <IconBtn onClick={onClose} title="닫기">닫기</IconBtn>
          <PrimaryBtn onClick={handleAdd} disabled={!form.from || !form.to || form.from === form.to}>추가하기</PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Delete Node Modal ────────────────────────────────────────────────────────
type DeleteNodeMode = "cascade" | "edges-only" | "bridge";

function DeleteNodeModal({ node, data, onConfirm, onClose }: {
  node: FlowNode;
  data: FlowchartData;
  onConfirm: (mode: DeleteNodeMode) => void;
  onClose: () => void;
}) {
  const incoming = data.edges.filter((e) => e.to === node.id);
  const outgoing = data.edges.filter((e) => e.from === node.id);
  const isJunction = outgoing.length > 1; // decision / route
  const isLinear = incoming.length === 1 && outgoing.length === 1;
  const [mode, setMode] = useState<DeleteNodeMode>(isLinear ? "bridge" : "edges-only");

  return (
    <Modal title="노드 삭제" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6 }}>
          <strong style={{ color: C.text }}>{node.label}</strong> 노드를 삭제해요.
          연결된 엣지 {incoming.length + outgoing.length}개가 영향을 받아요.
        </p>

        {isLinear && (
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <input type="radio" checked={mode === "bridge"} onChange={() => setMode("bridge")} style={{ marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 12, color: C.text, margin: 0 }}>앞뒤 노드 자동 연결</p>
              <p style={{ fontSize: 11, color: C.textMid, margin: "2px 0 0" }}>
                {incoming[0]?.from} → {outgoing[0]?.to} 로 엣지를 새로 만들어요.
              </p>
            </div>
          </label>
        )}

        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <input type="radio" checked={mode === "edges-only"} onChange={() => setMode("edges-only")} style={{ marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 12, color: C.text, margin: 0 }}>엣지만 삭제</p>
            <p style={{ fontSize: 11, color: C.textMid, margin: "2px 0 0" }}>연결된 노드들이 고아 상태가 될 수 있어요.</p>
          </div>
        </label>

        {isJunction && (
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <input type="radio" checked={mode === "cascade"} onChange={() => setMode("cascade")} style={{ marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 12, color: C.text, margin: 0 }}>하위 분기 전부 삭제</p>
              <p style={{ fontSize: 11, color: C.textMid, margin: "2px 0 0" }}>이 노드에서 나가는 {outgoing.length}개 분기의 노드를 모두 삭제해요.</p>
            </div>
          </label>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <IconBtn onClick={onClose} title="닫기">닫기</IconBtn>
          <PrimaryBtn onClick={() => onConfirm(mode)}>삭제하기</PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Properties Panel ─────────────────────────────────────────────────────────
function PropertiesPanel({
  data, selectedNodeId, selectedEdgeKey,
  selectedNodeIds,
  onChange, onDeleteNode, onDeleteEdge, onDeselect,
  onStepDelta, onTrackDelta,
}: {
  data: FlowchartData;
  selectedNodeId: string | null;
  selectedEdgeKey: string | null;
  selectedNodeIds: string[];
  onChange: (data: FlowchartData) => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (key: string) => void;
  onDeselect: () => void;
  onStepDelta: (delta: number) => void;
  onTrackDelta: (delta: number) => void;
}) {
  const node = selectedNodeId ? data.nodes.find((n) => n.id === selectedNodeId) ?? null : null;
  const edge = selectedEdgeKey
    ? (() => {
        const { from, to } = parseEdgeKey(selectedEdgeKey);
        return data.edges.find((e) => e.from === from && e.to === to) ?? null;
      })()
    : null;

  const isMulti = selectedNodeIds.length > 1;

  const updateNode = (patch: Partial<FlowNode>) => {
    if (!node) return;
    onChange({ ...data, nodes: data.nodes.map((n) => n.id === node.id ? { ...n, ...patch } : n) });
  };

  const updateEdge = (patch: Partial<FlowEdge>) => {
    if (!edge) return;
    onChange({
      ...data,
      edges: data.edges.map((e) =>
        e.from === edge.from && e.to === edge.to ? { ...e, ...patch } : e
      ),
    });
  };

  // Detect warning states for node
  const incomingCount = node ? data.edges.filter((e) => e.to === node.id).length : 0;
  const outgoingCount = node ? data.edges.filter((e) => e.from === node.id).length : 0;
  const hasWarning = node && node.type === "decision" && outgoingCount < 2;

  // Multi-select panel
  if (isMulti) {
    const selNodes = data.nodes.filter((n) => selectedNodeIds.includes(n.id));
    const types = [...new Set(selNodes.map((n) => n.type))];
    const commonType = types.length === 1 ? types[0] : "";

    return (
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ ...labelStyle, margin: 0 }}>{selectedNodeIds.length}개 선택됨</p>
          <button onClick={onDeselect} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: 14, padding: 0 }}>×</button>
        </div>
        <Divider />
        <div>
          <label style={labelStyle}>타입 일괄 변경</label>
          <select
            style={inputStyle}
            value={commonType}
            onChange={(e) => {
              if (!e.target.value) return;
              const t = e.target.value as FlowNode["type"];
              onChange({ ...data, nodes: data.nodes.map((n) => selectedNodeIds.includes(n.id) ? { ...n, type: t } : n) });
            }}
          >
            <option value="">— 혼합</option>
            {NODE_TYPES.map((t) => <option key={t} value={t}>{NODE_TYPE_LABELS[t]}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>이동 (상대값)</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: C.textMid, width: 36 }}>Step</span>
              <button onClick={() => onStepDelta(-1)} style={{ ...stepBtnStyle }}>◀ -1</button>
              <button onClick={() => onStepDelta(+1)} style={{ ...stepBtnStyle }}>+1 ▶</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: C.textMid, width: 36 }}>Track</span>
              <button onClick={() => onTrackDelta(-1)} style={{ ...stepBtnStyle }}>▲ -1</button>
              <button onClick={() => onTrackDelta(+1)} style={{ ...stepBtnStyle }}>+1 ▼</button>
            </div>
          </div>
        </div>
        <Divider />
        <DangerBtn onClick={() => selectedNodeIds.forEach(onDeleteNode)}>
          선택 항목 모두 삭제 ({selectedNodeIds.length}개)
        </DangerBtn>
      </div>
    );
  }

  if (!node && !edge) {
    return (
      <div style={{ padding: "20px 16px" }}>
        <p style={{ fontSize: 11, color: C.textMute, lineHeight: 1.7 }}>
          노드 또는 엣지를 클릭하면 속성을 편집할 수 있어요.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ ...labelStyle, margin: 0 }}>{node ? "Node" : "Edge"}</p>
        <button onClick={onDeselect} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: 14, padding: 0 }}>×</button>
      </div>
      <Divider />

      {node && (
        <>
          <div>
            <label style={labelStyle}>ID</label>
            <div style={{ fontSize: 11, color: C.textMid, padding: "7px 10px", background: C.surface, borderRadius: 6, border: `1px solid ${C.border}` }}>
              {node.id}
            </div>
          </div>
          <div>
            <label style={labelStyle}>레이블</label>
            <input style={inputStyle} value={node.label} onChange={(e) => updateNode({ label: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>타입</label>
            <select style={inputStyle} value={node.type} onChange={(e) => updateNode({ type: e.target.value as FlowNode["type"] })}>
              {NODE_TYPES.map((t) => <option key={t} value={t}>{NODE_TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>Step</label>
              <input style={inputStyle} type="number" min={0} value={node.step} onChange={(e) => updateNode({ step: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={labelStyle}>Track</label>
              <input style={inputStyle} type="number" min={0} value={node.track} onChange={(e) => updateNode({ track: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          {hasWarning && (
            <div style={{ fontSize: 11, color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "8px 10px" }}>
              ⚠ decision 노드에 yes/no 엣지가 모두 연결되지 않았어요.
            </div>
          )}
          <div style={{ fontSize: 11, color: C.textMute }}>
            진입 {incomingCount}개 · 출력 {outgoingCount}개
          </div>
          <Divider />
          {node.type === "start" ? (
            <div style={{ fontSize: 11, color: C.textMute, padding: "7px 10px", background: C.surface, borderRadius: 6 }}>
              Start 노드는 삭제할 수 없어요.
            </div>
          ) : (
            <DangerBtn onClick={() => onDeleteNode(node.id)}>노드 삭제</DangerBtn>
          )}
        </>
      )}

      {edge && (
        <>
          <div>
            <label style={labelStyle}>From → To</label>
            <div style={{ fontSize: 11, color: C.textMid, padding: "7px 10px", background: C.surface, borderRadius: 6, border: `1px solid ${C.border}` }}>
              {edge.from} → {edge.to}
            </div>
          </div>
          <div>
            <label style={labelStyle}>조건</label>
            <select
              style={inputStyle} value={edge.condition ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "yes" || val === "no") updateEdge({ condition: val, label: undefined });
                else updateEdge({ condition: undefined });
              }}
            >
              <option value="">없음</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          {!edge.condition && (
            <div>
              <label style={labelStyle}>레이블 (선택)</label>
              <input style={inputStyle} value={edge.label ?? ""} onChange={(e) => updateEdge({ label: e.target.value || undefined })} placeholder="케이스명" />
            </div>
          )}
          <Divider />
          <DangerBtn onClick={() => onDeleteEdge(selectedEdgeKey!)}>엣지 삭제</DangerBtn>
        </>
      )}
    </div>
  );
}

const stepBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 5, padding: "4px 10px", cursor: "pointer", color: "rgba(255,255,255,0.6)",
  fontSize: 11, fontFamily: "inherit",
};

// ─── Session Item ─────────────────────────────────────────────────────────────
function SessionItem({
  session, active, onSelect, onRename, onDelete,
}: {
  session: Pick<FlowchartSession, "id" | "title" | "updated_at">;
  active: boolean;
  onSelect: () => void;
  onRename: (t: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(session.title);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const commit = () => {
    setEditing(false);
    const t = draft.trim();
    if (t && t !== session.title) onRename(t);
    else setDraft(session.title);
  };

  const date = new Date(session.updated_at).toLocaleDateString("ko-KR", {
    month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "8px 10px", borderRadius: 7, cursor: "pointer",
        background: active ? C.surfaceHover : hov ? "rgba(255,255,255,0.03)" : "transparent",
        borderLeft: `2px solid ${active ? C.accent : "transparent"}`,
        transition: "all 0.12s",
      }}
    >
      {editing ? (
        <input
          ref={ref} value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setEditing(false); setDraft(session.title); } }}
          onClick={(e) => e.stopPropagation()}
          style={{ ...inputStyle, padding: "2px 4px", fontSize: 12, width: "100%" }}
        />
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span
            onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
            style={{ fontSize: 12, color: active ? C.text : C.textMid, flex: 1, lineHeight: 1.4, wordBreak: "break-all" }}
          >
            {session.title}
          </span>
          {(hov || active) && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: 12, padding: "0 0 0 6px", flexShrink: 0, lineHeight: 1 }}
            >✕</button>
          )}
        </div>
      )}
      <p style={{ fontSize: 10, color: C.textMute, marginTop: 3 }}>{date}</p>
    </div>
  );
}

// ─── CaseList ─────────────────────────────────────────────────────────────────
function CaseList({ label, accent, items, onChange }: {
  label: string; accent: string; items: string[];
  onChange: (items: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");

  const add = () => {
    if (!draft.trim()) { setAdding(false); return; }
    onChange([...items, draft.trim()]);
    setDraft(""); setAdding(false);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const startEdit = (i: number) => { setEditIdx(i); setEditVal(items[i]); };
  const commitEdit = () => {
    if (editIdx === null) return;
    if (!editVal.trim()) remove(editIdx);
    else onChange(items.map((v, i) => i === editIdx ? editVal.trim() : v));
    setEditIdx(null);
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <p style={{ ...labelStyle, margin: 0 }}>{label}</p>
        <button onClick={() => setAdding(true)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textDim, fontSize: 14, padding: 0, lineHeight: 1 }}>＋</button>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((c, i) => (
          <li key={i} style={{ fontSize: 11, color: C.textMid, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ color: accent, flexShrink: 0 }}>•</span>
            {editIdx === i ? (
              <input
                autoFocus value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditIdx(null); }}
                style={{ ...inputStyle, padding: "2px 6px", fontSize: 11, flex: 1 }}
              />
            ) : (
              <>
                <span style={{ flex: 1, cursor: "text" }} onDoubleClick={() => startEdit(i)}>{c}</span>
                <button onClick={() => remove(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMute, fontSize: 11, padding: 0, flexShrink: 0 }}>✕</button>
              </>
            )}
          </li>
        ))}
        {adding && (
          <li style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ color: accent, flexShrink: 0 }}>•</span>
            <input
              autoFocus value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={add}
              onKeyDown={(e) => { if (e.key === "Enter") add(); if (e.key === "Escape") setAdding(false); }}
              style={{ ...inputStyle, padding: "2px 6px", fontSize: 11, flex: 1 }}
              placeholder="내용 입력 후 Enter"
            />
          </li>
        )}
      </ul>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FlowchartPage() {
  const [sessions, setSessions] = useState<Pick<FlowchartSession, "id" | "title" | "updated_at">[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [data, setData] = useState<FlowchartData | null>(null);
  const [search, setSearch] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeKey, setSelectedEdgeKey] = useState<string | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]); // multi-select
  const [showAddNode, setShowAddNode] = useState(false);
  const [showAddEdge, setShowAddEdge] = useState(false);
  const [addNodeDefaults, setAddNodeDefaults] = useState<{ step?: number; track?: number }>({});
  const [deleteNodeTarget, setDeleteNodeTarget] = useState<FlowNode | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Zoom / Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Undo / Redo history
  const history = useRef<FlowchartData[]>([]);
  const historyIdx = useRef(-1);

  const prevFileRef = useRef<string>("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load sessions ──────────────────────────────────────────────────────────
  const loadSessions = useCallback(async () => {
    const res = await fetch("/api/tool/flowcharts");
    if (res.ok) setSessions(await res.json());
  }, []);
  useEffect(() => { loadSessions(); }, [loadSessions]);

  // ── Select session ─────────────────────────────────────────────────────────
  const selectSession = useCallback(async (id: string) => {
    setActiveId(id);
    setSelectedNodeId(null); setSelectedEdgeKey(null); setSelectedNodeIds([]);
    const res = await fetch(`/api/tool/flowcharts/${id}`);
    if (res.ok) {
      const row: FlowchartSession = await res.json();
      setData(row.data);
      history.current = [row.data]; historyIdx.current = 0;
      prevFileRef.current = "";
    }
  }, []);

  // ── File polling ───────────────────────────────────────────────────────────
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/flowchart-current.json?t=${Date.now()}`);
        if (!res.ok) return;
        const raw = await res.text();
        if (raw === prevFileRef.current) return;
        prevFileRef.current = raw;
        const parsed = JSON.parse(raw) as FlowchartData;
        if (!parsed.nodes || parsed.nodes.length === 0) return;
        setData(parsed);
        setSelectedNodeId(null); setSelectedEdgeKey(null); setSelectedNodeIds([]);
        history.current = [parsed]; historyIdx.current = 0;
        setSyncing(true);
        setTimeout(() => setSyncing(false), 1000);
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => scheduleAutoSave(parsed), 1200);
      } catch { /* silent */ }
    };
    const id = setInterval(poll, 2000);
    poll();
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // ── Save to Supabase ───────────────────────────────────────────────────────
  const scheduleAutoSave = useCallback(async (flowchart: FlowchartData) => {
    setSaving(true);
    try {
      if (activeId) {
        const res = await fetch(`/api/tool/flowcharts/${activeId}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: flowchart }),
        });
        if (res.ok) {
          const updated = await res.json();
          setSessions((p) => p.map((s) => s.id === activeId ? { ...s, updated_at: updated.updated_at } : s));
        }
      } else {
        const title = `플로우 ${new Date().toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
        const res = await fetch("/api/tool/flowcharts", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, data: flowchart }),
        });
        if (res.ok) {
          const row = await res.json();
          setActiveId(row.id);
          setSessions((p) => [row, ...p]);
        }
      }
    } finally { setSaving(false); }
  }, [activeId]);

  // ── Data change + history push ─────────────────────────────────────────────
  const handleDataChange = useCallback((newData: FlowchartData, skipHistory = false) => {
    setData(newData);
    if (!skipHistory) {
      const trimmed = history.current.slice(0, historyIdx.current + 1);
      history.current = [...trimmed, newData].slice(-MAX_HISTORY);
      historyIdx.current = history.current.length - 1;
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => scheduleAutoSave(newData), 1000);
  }, [scheduleAutoSave]);

  // ── Undo / Redo ────────────────────────────────────────────────────────────
  const canUndo = historyIdx.current > 0;
  const canRedo = historyIdx.current < history.current.length - 1;

  const undo = useCallback(() => {
    if (!canUndo) return;
    historyIdx.current -= 1;
    const prev = history.current[historyIdx.current];
    setData(prev);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => scheduleAutoSave(prev), 1000);
  }, [canUndo, scheduleAutoSave]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    historyIdx.current += 1;
    const next = history.current[historyIdx.current];
    setData(next);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => scheduleAutoSave(next), 1000);
  }, [canRedo, scheduleAutoSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (meta && e.key === "z" && e.shiftKey)  { e.preventDefault(); redo(); }
      if (meta && e.key === "y")                 { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  // ── Zoom / Pan handlers ────────────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, parseFloat((z + delta).toFixed(2)))));
  }, []);

  const handlePanMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start pan on middle mouse or when clicking on empty canvas
    if (e.button !== 1 && e.button !== 0) return;
    // button 0 = left, only pan if target is the canvas container itself
    if (e.button === 0 && e.target !== canvasContainerRef.current && (e.target as Element).tagName !== "svg") return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    panOrigin.current = { ...pan };
    e.preventDefault();
  }, [pan]);

  const handlePanMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({ x: panOrigin.current.x + dx, y: panOrigin.current.y + dy });
  }, []);

  const handlePanMouseUp = useCallback(() => { isPanning.current = false; }, []);

  const resetZoom = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  // ── Node operations ────────────────────────────────────────────────────────
  const handleAddNode = useCallback((node: FlowNode) => {
    if (!data) return;
    handleDataChange({ ...data, nodes: [...data.nodes, node] });
    setSelectedNodeId(node.id); setSelectedEdgeKey(null); setSelectedNodeIds([]);
  }, [data, handleDataChange]);

  const handleDeleteNode = useCallback((id: string) => {
    if (!data) return;
    const node = data.nodes.find((n) => n.id === id);
    if (!node) return;
    if (node.type === "start") return; // guarded in UI too

    const incoming = data.edges.filter((e) => e.to === id);
    const outgoing = data.edges.filter((e) => e.from === id);
    const needsModal = incoming.length > 0 || outgoing.length > 0;

    if (needsModal) {
      setDeleteNodeTarget(node);
    } else {
      // No connections — delete directly
      handleDataChange({ ...data, nodes: data.nodes.filter((n) => n.id !== id) });
      setSelectedNodeId(null);
    }
  }, [data, handleDataChange]);

  const confirmDeleteNode = useCallback((mode: DeleteNodeMode) => {
    if (!data || !deleteNodeTarget) return;
    const id = deleteNodeTarget.id;
    const incoming = data.edges.filter((e) => e.to === id);
    const outgoing = data.edges.filter((e) => e.from === id);

    let newNodes = data.nodes.filter((n) => n.id !== id);
    let newEdges = data.edges.filter((e) => e.from !== id && e.to !== id);

    if (mode === "bridge" && incoming.length === 1 && outgoing.length === 1) {
      newEdges = [...newEdges, { from: incoming[0].from, to: outgoing[0].to }];
    } else if (mode === "cascade") {
      // BFS/DFS to collect all descendant nodes through outgoing edges
      const toDelete = new Set<string>([id]);
      const queue = outgoing.map((e) => e.to);
      while (queue.length > 0) {
        const curr = queue.shift()!;
        if (toDelete.has(curr)) continue;
        toDelete.add(curr);
        data.edges.filter((e) => e.from === curr).forEach((e) => queue.push(e.to));
      }
      newNodes = data.nodes.filter((n) => !toDelete.has(n.id));
      newEdges = data.edges.filter((e) => !toDelete.has(e.from) && !toDelete.has(e.to));
    }

    handleDataChange({ ...data, nodes: newNodes, edges: newEdges });
    setSelectedNodeId(null);
    setDeleteNodeTarget(null);
  }, [data, deleteNodeTarget, handleDataChange]);

  // ── Edge operations ────────────────────────────────────────────────────────
  const handleAddEdge = useCallback((edge: FlowEdge) => {
    if (!data) return;
    if (hasDuplicateEdge(data.edges, edge.from, edge.to)) return;
    handleDataChange({ ...data, edges: [...data.edges, edge] });
  }, [data, handleDataChange]);

  const handleDeleteEdge = useCallback((key: string) => {
    if (!data) return;
    const { from, to } = parseEdgeKey(key);
    handleDataChange({ ...data, edges: data.edges.filter((e) => !(e.from === from && e.to === to)) });
    setSelectedEdgeKey(null);
  }, [data, handleDataChange]);

  // ── Hover ＋ node helpers ──────────────────────────────────────────────────
  const handleAddNodeRight = useCallback((signal: string) => {
    if (!data) return;
    if (signal.endsWith("__insertBefore")) {
      // Insert a step before this node
      const nodeId = signal.replace("__insertBefore", "");
      const node = data.nodes.find((n) => n.id === nodeId);
      if (!node) return;
      const insertAt = node.step;
      const shiftedNodes = data.nodes.map((n) => n.step >= insertAt ? { ...n, step: n.step + 1 } : n);
      const newId = generateId(data.nodes);
      const newNode: FlowNode = { id: newId, label: "새 화면", type: "screen", step: insertAt, track: node.track };
      handleDataChange({ ...data, nodes: [...shiftedNodes, newNode] });
      setSelectedNodeId(newId);
    } else {
      const fromNode = data.nodes.find((n) => n.id === signal);
      if (!fromNode) return;
      const newId = generateId(data.nodes);
      const newNode: FlowNode = { id: newId, label: "새 화면", type: "screen", step: fromNode.step + 1, track: fromNode.track };
      handleDataChange({
        ...data,
        nodes: [...data.nodes, newNode],
        edges: [...data.edges, { from: fromNode.id, to: newId }],
      });
      setSelectedNodeId(newId); setSelectedEdgeKey(null); setSelectedNodeIds([]);
    }
  }, [data, handleDataChange]);

  const handleAddNodeBelow = useCallback((fromNodeId: string) => {
    if (!data) return;
    const fromNode = data.nodes.find((n) => n.id === fromNodeId);
    if (!fromNode) return;
    const maxTrackAtStep = Math.max(0, ...data.nodes.filter((n) => n.step === fromNode.step).map((n) => n.track));
    const newId = generateId(data.nodes);
    const newNode: FlowNode = { id: newId, label: "새 화면", type: "screen", step: fromNode.step, track: maxTrackAtStep + 1 };
    handleDataChange({
      ...data,
      nodes: [...data.nodes, newNode],
      edges: [...data.edges, { from: fromNode.id, to: newId }],
    });
    setSelectedNodeId(newId); setSelectedEdgeKey(null); setSelectedNodeIds([]);
  }, [data, handleDataChange]);

  const handleCanvasDoubleClick = useCallback((step: number, track: number) => {
    if (!data) return;
    setAddNodeDefaults({ step, track });
    setShowAddNode(true);
  }, [data]);

  const handleAddEdgeFromDrag = useCallback((from: string, to: string, condition?: "yes" | "no") => {
    if (!data) return;
    if (hasDuplicateEdge(data.edges, from, to)) return;
    const edge: FlowEdge = { from, to };
    if (condition) edge.condition = condition;
    handleDataChange({ ...data, edges: [...data.edges, edge] });
  }, [data, handleDataChange]);

  // ── Multi-select helpers ───────────────────────────────────────────────────
  const handleStepDelta = useCallback((delta: number) => {
    if (!data) return;
    handleDataChange({
      ...data,
      nodes: data.nodes.map((n) =>
        selectedNodeIds.includes(n.id) ? { ...n, step: Math.max(0, n.step + delta) } : n
      ),
    });
  }, [data, selectedNodeIds, handleDataChange]);

  const handleTrackDelta = useCallback((delta: number) => {
    if (!data) return;
    handleDataChange({
      ...data,
      nodes: data.nodes.map((n) =>
        selectedNodeIds.includes(n.id) ? { ...n, track: Math.max(0, n.track + delta) } : n
      ),
    });
  }, [data, selectedNodeIds, handleDataChange]);

  // ── Session operations ─────────────────────────────────────────────────────
  const renameSession = useCallback(async (id: string, title: string) => {
    await fetch(`/api/tool/flowcharts/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setSessions((p) => p.map((s) => s.id === id ? { ...s, title } : s));
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    await fetch(`/api/tool/flowcharts/${id}`, { method: "DELETE" });
    setSessions((p) => p.filter((s) => s.id !== id));
    if (activeId === id) { setActiveId(null); setData(null); }
  }, [activeId]);

  const duplicateSession = useCallback(async () => {
    if (!data || !activeId) return;
    const src = sessions.find((s) => s.id === activeId);
    const res = await fetch("/api/tool/flowcharts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `Copy of ${src?.title ?? "Untitled"}`, data }),
    });
    if (res.ok) {
      const row = await res.json();
      setSessions((p) => [row, ...p]);
      selectSession(row.id);
    }
  }, [data, activeId, sessions, selectSession]);

  const newSession = useCallback(() => {
    setActiveId(null); setData(null); prevFileRef.current = "";
    setSelectedNodeId(null); setSelectedEdgeKey(null); setSelectedNodeIds([]);
    history.current = []; historyIdx.current = -1;
  }, []);

  const exportJSON = useCallback(() => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sessions.find((s) => s.id === activeId)?.title ?? "flowchart"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, activeId, sessions]);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );
  const currentTitle = sessions.find((s) => s.id === activeId)?.title;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "var(--font-poppins), sans-serif" }}>
      {/* Header */}
      <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.textMid }}>Flowchart</span>
        <span style={{ fontSize: 10, padding: "2px 7px", background: C.accentBg, color: C.accent, borderRadius: 4, fontWeight: 600 }}>INTERNAL</span>

        {currentTitle && (
          <>
            <span style={{ color: C.border, fontSize: 16 }}>›</span>
            <span style={{ fontSize: 13, color: C.text }}>{currentTitle}</span>
          </>
        )}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          {saving && <span style={{ fontSize: 11, color: C.textDim }}>저장 중...</span>}
          {syncing && !saving && <span style={{ fontSize: 11, color: C.yes }}>↻ 업데이트됨</span>}

          {/* Zoom controls */}
          {data && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginRight: 4 }}>
              <button onClick={() => setZoom((z) => Math.max(ZOOM_MIN, parseFloat((z - ZOOM_STEP).toFixed(2))))} style={{ ...zoomBtnStyle }}>−</button>
              <span
                onClick={resetZoom}
                style={{ fontSize: 11, color: C.textMid, cursor: "pointer", minWidth: 38, textAlign: "center", userSelect: "none" }}
                title="클릭 시 100% 리셋"
              >{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(ZOOM_MAX, parseFloat((z + ZOOM_STEP).toFixed(2))))} style={{ ...zoomBtnStyle }}>＋</button>
            </div>
          )}

          {/* Undo / Redo */}
          {data && (
            <>
              <IconBtn onClick={undo} title="실행 취소 (⌘Z)" disabled={!canUndo}>↩</IconBtn>
              <IconBtn onClick={redo} title="다시 실행 (⌘⇧Z)" disabled={!canRedo}>↪</IconBtn>
            </>
          )}

          {data && (
            <>
              <IconBtn onClick={() => { setAddNodeDefaults({}); setShowAddNode(true); }} title="노드 추가">＋ 노드</IconBtn>
              <IconBtn onClick={() => setShowAddEdge(true)} title="엣지 추가">＋ 엣지</IconBtn>
              {activeId && <IconBtn onClick={duplicateSession} title="복제">⊕ 복제</IconBtn>}
              <IconBtn onClick={exportJSON} title="JSON 내보내기">↓ JSON</IconBtn>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: `1px solid ${C.border}`, background: C.sidebar }}>
          <div style={{ padding: "12px 12px 8px" }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="검색..." style={{ ...inputStyle, fontSize: 11, padding: "6px 10px" }} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
            {filteredSessions.length === 0 && (
              <p style={{ fontSize: 11, color: C.textMute, padding: "8px 4px", lineHeight: 1.7 }}>
                {search ? "검색 결과 없음" : "저장된 플로우가 없어요."}
              </p>
            )}
            {filteredSessions.map((s) => (
              <SessionItem
                key={s.id} session={s} active={s.id === activeId}
                onSelect={() => selectSession(s.id)}
                onRename={(t) => renameSession(s.id, t)}
                onDelete={() => deleteSession(s.id)}
              />
            ))}
          </div>
          <div style={{ padding: "8px 12px 12px", borderTop: `1px solid ${C.border}` }}>
            <button
              onClick={newSession}
              style={{ width: "100%", background: "transparent", border: `1px dashed ${C.borderMid}`, borderRadius: 7, padding: "7px 12px", cursor: "pointer", color: C.textMid, fontSize: 12, fontFamily: "inherit", textAlign: "center" }}
            >+ 새 플로우</button>
          </div>
        </div>

        {/* Canvas area */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
          onClick={() => { setSelectedNodeId(null); setSelectedEdgeKey(null); setSelectedNodeIds([]); }}
        >
          {/* Zoomable canvas */}
          <div
            ref={canvasContainerRef}
            style={{ flex: 1, overflow: "hidden", position: "relative", cursor: isPanning.current ? "grabbing" : "default" }}
            onWheel={handleWheel}
            onMouseDown={handlePanMouseDown}
            onMouseMove={handlePanMouseMove}
            onMouseUp={handlePanMouseUp}
            onMouseLeave={handlePanMouseUp}
          >
            {data ? (
              <div
                style={{
                  position: "absolute", top: 0, left: 0,
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "0 0",
                }}
              >
                <FlowchartCanvas
                  data={data}
                  selectedNodeId={selectedNodeId}
                  selectedEdgeKey={selectedEdgeKey}
                  onNodeClick={(id) => {
                    setSelectedNodeId(id);
                    setSelectedEdgeKey(null);
                    setSelectedNodeIds([id]);
                  }}
                  onEdgeClick={(key) => { setSelectedEdgeKey(key); setSelectedNodeId(null); setSelectedNodeIds([]); }}
                  onAddNodeRight={handleAddNodeRight}
                  onAddNodeBelow={handleAddNodeBelow}
                  onAddEdge={handleAddEdgeFromDrag}
                  onCanvasDoubleClick={handleCanvasDoubleClick}
                />
              </div>
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", color: C.textMute, fontSize: 13, userSelect: "none", lineHeight: 2 }}>
                  <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◇</div>
                  <div>Claude Code 채팅에서 플로우를 설명하거나</div>
                  <div>왼쪽에서 세션을 선택해 주세요</div>
                </div>
              </div>
            )}
          </div>

          {/* Edge / Missing Cases */}
          {data && (
            <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", gap: 32, flexShrink: 0, minHeight: 56, maxHeight: 160, overflowY: "auto" }}>
              <CaseList label="Edge Cases" accent="#f59e0b" items={data.edge_cases} onChange={(items) => handleDataChange({ ...data, edge_cases: items })} />
              <CaseList label="Missing Cases" accent={C.accent} items={data.missing_cases} onChange={(items) => handleDataChange({ ...data, missing_cases: items })} />
            </div>
          )}
        </div>

        {/* Properties panel */}
        <div style={{ width: 252, flexShrink: 0, borderLeft: `1px solid ${C.border}`, background: C.panel, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
            <p style={{ ...labelStyle, margin: 0 }}>Properties</p>
          </div>
          <Divider />
          {data ? (
            <PropertiesPanel
              data={data}
              selectedNodeId={selectedNodeId}
              selectedEdgeKey={selectedEdgeKey}
              selectedNodeIds={selectedNodeIds}
              onChange={handleDataChange}
              onDeleteNode={handleDeleteNode}
              onDeleteEdge={handleDeleteEdge}
              onDeselect={() => { setSelectedNodeId(null); setSelectedEdgeKey(null); setSelectedNodeIds([]); }}
              onStepDelta={handleStepDelta}
              onTrackDelta={handleTrackDelta}
            />
          ) : (
            <p style={{ fontSize: 11, color: C.textMute, padding: "0 16px", lineHeight: 1.7 }}>플로우를 불러오면 노드·엣지 속성을 편집할 수 있어요.</p>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddNode && data && (
        <AddNodeModal
          nodes={data.nodes}
          defaultStep={addNodeDefaults.step}
          defaultTrack={addNodeDefaults.track}
          onAdd={handleAddNode}
          onClose={() => setShowAddNode(false)}
        />
      )}
      {showAddEdge && data && (
        <AddEdgeModal nodes={data.nodes} edges={data.edges} onAdd={handleAddEdge} onClose={() => setShowAddEdge(false)} />
      )}
      {deleteNodeTarget && data && (
        <DeleteNodeModal
          node={deleteNodeTarget}
          data={data}
          onConfirm={confirmDeleteNode}
          onClose={() => setDeleteNodeTarget(null)}
        />
      )}
    </div>
  );
}

const zoomBtnStyle: React.CSSProperties = {
  background: "transparent", border: `1px solid rgba(255,255,255,0.08)`,
  borderRadius: 4, width: 22, height: 22, cursor: "pointer",
  color: "rgba(255,255,255,0.4)", fontSize: 13, display: "flex",
  alignItems: "center", justifyContent: "center", fontFamily: "inherit",
};
