"use client";

import { useState, useRef, useCallback } from "react";
import type { FlowchartData, FlowNode, FlowEdge } from "@/lib/types/tool";

const H_STRIDE = 280;
const V_STRIDE = 160;
const CANVAS_PAD = 80;

const NODE_DIMS: Record<FlowNode["type"], { w: number; h: number }> = {
  start:    { w: 80,  h: 32 },
  screen:   { w: 160, h: 44 },
  decision: { w: 80,  h: 80 },
  route:    { w: 100, h: 48 },
  end:      { w: 100, h: 36 },
};

// Edge key uses __ to avoid collision with hyphens in node IDs
export function edgeKey(from: string, to: string) { return `${from}__${to}`; }
export function parseEdgeKey(key: string): { from: string; to: string } {
  const idx = key.indexOf("__");
  return { from: key.slice(0, idx), to: key.slice(idx + 2) };
}

interface NodeRect {
  x: number; y: number; w: number; h: number; cx: number; cy: number;
}

function getNodeRect(node: FlowNode): NodeRect {
  const dims = NODE_DIMS[node.type];
  const cx = CANVAS_PAD + node.step * H_STRIDE;
  const cy = CANVAS_PAD + node.track * V_STRIDE;
  return { x: cx - dims.w / 2, y: cy - dims.h / 2, w: dims.w, h: dims.h, cx, cy };
}

function getEdgePath(src: NodeRect, tgt: NodeRect): { d: string; midX: number; midY: number } {
  const adx = Math.abs(tgt.cx - src.cx);
  const ady = Math.abs(tgt.cy - src.cy);
  let x1: number, y1: number, x2: number, y2: number;
  let c1x: number, c1y: number, c2x: number, c2y: number;

  if (adx >= ady) {
    const right = tgt.cx >= src.cx;
    x1 = right ? src.x + src.w : src.x;   y1 = src.cy;
    x2 = right ? tgt.x : tgt.x + tgt.w;   y2 = tgt.cy;
    const dx = Math.abs(x2 - x1) * 0.45;
    c1x = right ? x1 + dx : x1 - dx; c1y = y1;
    c2x = right ? x2 - dx : x2 + dx; c2y = y2;
  } else {
    const down = tgt.cy >= src.cy;
    x1 = src.cx; y1 = down ? src.y + src.h : src.y;
    x2 = tgt.cx; y2 = down ? tgt.y : tgt.y + tgt.h;
    const dy = Math.abs(y2 - y1) * 0.45;
    c1x = x1; c1y = down ? y1 + dy : y1 - dy;
    c2x = x2; c2y = down ? y2 - dy : y2 + dy;
  }

  const d = `M ${x1} ${y1} C ${c1x} ${c1y} ${c2x} ${c2y} ${x2} ${y2}`;
  const midX = 0.125 * (x1 + 3 * c1x + 3 * c2x + x2);
  const midY = 0.125 * (y1 + 3 * c1y + 3 * c2y + y2);
  return { d, midX, midY };
}

function getArrow(src: NodeRect, tgt: NodeRect): string {
  const adx = Math.abs(tgt.cx - src.cx);
  const ady = Math.abs(tgt.cy - src.cy);
  if (adx >= ady) {
    const right = tgt.cx >= src.cx;
    const ax = right ? tgt.x : tgt.x + tgt.w;
    const ay = tgt.cy;
    if (right) return `${ax},${ay} ${ax - 8},${ay - 4} ${ax - 8},${ay + 4}`;
    return `${ax},${ay} ${ax + 8},${ay - 4} ${ax + 8},${ay + 4}`;
  } else {
    const down = tgt.cy >= src.cy;
    const ax = tgt.cx;
    const ay = down ? tgt.y : tgt.y + tgt.h;
    if (down) return `${ax},${ay} ${ax - 4},${ay - 8} ${ax + 4},${ay - 8}`;
    return `${ax},${ay} ${ax - 4},${ay + 8} ${ax + 4},${ay + 8}`;
  }
}

// ─── Node Shape ───────────────────────────────────────────────────────────────
function NodeShape({ node, rect, active, selected, orphan }: {
  node: FlowNode; rect: NodeRect; active: boolean; selected: boolean; orphan: boolean;
}) {
  const stroke = selected
    ? "#df4d18"
    : active
    ? "rgba(255,255,255,0.5)"
    : orphan
    ? "rgba(255,255,255,0.2)"
    : "rgba(255,255,255,0.18)";
  const fill = selected ? "#1e1218" : active ? "#1a1a28" : "#13131e";
  const textFill = active || selected ? "#ffffff" : "rgba(255,255,255,0.8)";
  const sw = selected ? 2 : 1.5;
  const dash = orphan && !selected ? "4 3" : undefined;
  const { x, y, w, h, cx, cy } = rect;

  const label = (
    <text
      x={cx} y={cy}
      textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={500} fill={textFill}
      style={{ fontFamily: "var(--font-poppins), sans-serif", pointerEvents: "none" }}
    >
      {node.label.length > 18 ? node.label.slice(0, 17) + "…" : node.label}
    </text>
  );

  if (node.type === "start") return (
    <>
      <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />
      {label}
    </>
  );

  if (node.type === "screen") return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={8} ry={8} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />
      {label}
    </>
  );

  if (node.type === "decision") {
    const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
    return (
      <>
        <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />
        <text
          x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          fontSize={10} fontWeight={500} fill={textFill}
          style={{ fontFamily: "var(--font-poppins), sans-serif", pointerEvents: "none" }}
        >
          {node.label.length > 10 ? node.label.slice(0, 9) + "…" : node.label}
        </text>
      </>
    );
  }

  if (node.type === "route") {
    const indent = 12;
    const pts = [
      `${x + indent},${y}`, `${x + w - indent},${y}`,
      `${x + w},${cy}`, `${x + w - indent},${y + h}`,
      `${x + indent},${y + h}`, `${x},${cy}`,
    ].join(" ");
    return (
      <>
        <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />
        {label}
      </>
    );
  }

  // end
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} ry={h / 2} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />
      {label}
    </>
  );
}

// ─── Canvas Props ─────────────────────────────────────────────────────────────
interface DragState {
  fromNodeId: string;
  // current mouse position in SVG coords
  mouseX: number;
  mouseY: number;
}

interface ConditionPopup {
  from: string;
  to: string;
  x: number; // SVG coords for positioning
  y: number;
}

interface Props {
  data: FlowchartData;
  selectedNodeId?: string | null;
  selectedEdgeKey?: string | null;
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeKey: string) => void;
  /** Called when user clicks right-＋ on a node */
  onAddNodeRight?: (fromNodeId: string) => void;
  /** Called when user clicks bottom-＋ on a node */
  onAddNodeBelow?: (fromNodeId: string) => void;
  /** Called when edge drag completes. condition only set for decision nodes. */
  onAddEdge?: (from: string, to: string, condition?: "yes" | "no") => void;
  /** Called when user double-clicks empty canvas area */
  onCanvasDoubleClick?: (step: number, track: number) => void;
}

// ─── FlowchartCanvas ─────────────────────────────────────────────────────────
export default function FlowchartCanvas({
  data, selectedNodeId, selectedEdgeKey,
  onNodeClick, onEdgeClick,
  onAddNodeRight, onAddNodeBelow,
  onAddEdge, onCanvasDoubleClick,
}: Props) {
  const [hoveredEdgeKey, setHoveredEdgeKey] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [conditionPopup, setConditionPopup] = useState<ConditionPopup | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, edges } = data;

  const nodeMap = new Map<string, FlowNode>();
  for (const n of nodes) nodeMap.set(n.id, n);

  const maxStep  = Math.max(0, ...nodes.map((n) => n.step));
  const maxTrack = Math.max(0, ...nodes.map((n) => n.track));
  const canvasW = CANVAS_PAD * 2 + maxStep  * H_STRIDE + 200;
  const canvasH = CANVAS_PAD * 2 + maxTrack * V_STRIDE + 120;

  // Which nodes have no incoming edges
  const nodesWithIncoming = new Set(edges.map((e) => e.to));
  const nodesWithOutgoing = new Set(edges.map((e) => e.from));

  // Convert client coords to SVG coords
  const clientToSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    // Account for CSS transform on parent — use CTM
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: svgP.x, y: svgP.y };
    void rect;
  }, []);

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleConnectStart = useCallback((e: React.MouseEvent, fromNodeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const { x, y } = clientToSvg(e.clientX, e.clientY);
    setDragState({ fromNodeId, mouseX: x, mouseY: y });
    setConditionPopup(null);
  }, [clientToSvg]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState) return;
    const { x, y } = clientToSvg(e.clientX, e.clientY);
    setDragState((d) => d ? { ...d, mouseX: x, mouseY: y } : null);
  }, [dragState, clientToSvg]);

  const handleMouseUp = useCallback((e: React.MouseEvent, toNodeId?: string) => {
    if (!dragState) return;
    e.stopPropagation();

    if (toNodeId && toNodeId !== dragState.fromNodeId) {
      const fromNode = nodeMap.get(dragState.fromNodeId);
      const toNode = nodeMap.get(toNodeId);
      if (fromNode && toNode) {
        if (fromNode.type === "decision") {
          const tgtRect = getNodeRect(toNode);
          setConditionPopup({
            from: dragState.fromNodeId,
            to: toNodeId,
            x: tgtRect.cx,
            y: tgtRect.y - 16,
          });
        } else {
          onAddEdge?.(dragState.fromNodeId, toNodeId);
        }
      }
    }
    setDragState(null);
  }, [dragState, nodeMap, onAddEdge]);

  const handleSvgMouseUp = useCallback((e: React.MouseEvent) => {
    if (dragState) setDragState(null);
  }, [dragState]);

  // ── Double-click on canvas ─────────────────────────────────────────────────
  const handleSvgDoubleClick = useCallback((e: React.MouseEvent) => {
    // Only fire if target is the SVG itself (not a node/edge)
    if (e.target !== svgRef.current && (e.target as Element).tagName !== "svg") return;
    const { x, y } = clientToSvg(e.clientX, e.clientY);
    const step  = Math.round((x - CANVAS_PAD) / H_STRIDE);
    const track = Math.round((y - CANVAS_PAD) / V_STRIDE);
    onCanvasDoubleClick?.(Math.max(0, step), Math.max(0, track));
  }, [clientToSvg, onCanvasDoubleClick]);

  // ── Drag preview line ──────────────────────────────────────────────────────
  let dragPreview: React.ReactNode = null;
  if (dragState) {
    const fromNode = nodeMap.get(dragState.fromNodeId);
    if (fromNode) {
      const src = getNodeRect(fromNode);
      const mx = dragState.mouseX;
      const my = dragState.mouseY;
      dragPreview = (
        <line
          x1={src.cx} y1={src.cy} x2={mx} y2={my}
          stroke="#df4d18" strokeWidth={1.5} strokeDasharray="6 3"
          style={{ pointerEvents: "none" }}
        />
      );
    }
  }

  return (
    <div className="w-full h-full" style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width={canvasW} height={canvasH}
        style={{ minWidth: canvasW, display: "block", cursor: dragState ? "crosshair" : undefined }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleSvgMouseUp}
        onDoubleClick={handleSvgDoubleClick}
      >
        {/* Edges */}
        {edges.map((edge: FlowEdge) => {
          const srcNode = nodeMap.get(edge.from);
          const tgtNode = nodeMap.get(edge.to);
          if (!srcNode || !tgtNode) return null;

          const srcRect = getNodeRect(srcNode);
          const tgtRect = getNodeRect(tgtNode);
          const key = edgeKey(edge.from, edge.to);
          const hovered = hoveredEdgeKey === key;
          const selected = selectedEdgeKey === key;

          const { d, midX, midY } = getEdgePath(srcRect, tgtRect);
          const arrowPoints = getArrow(srcRect, tgtRect);

          let edgeColor: string;
          if (selected) edgeColor = "#df4d18";
          else if (hovered) edgeColor = "rgba(223,77,24,0.8)";
          else if (edge.condition === "yes") edgeColor = "rgba(74,222,128,0.5)";
          else if (edge.condition === "no")  edgeColor = "rgba(223,77,24,0.5)";
          else edgeColor = "rgba(255,255,255,0.15)";

          const arrowColor = selected || hovered
            ? "#df4d18"
            : edge.condition === "yes" ? "rgba(74,222,128,0.7)"
            : edge.condition === "no"  ? "rgba(223,77,24,0.7)"
            : "rgba(255,255,255,0.2)";

          const labelText =
            edge.condition === "yes" ? "Yes"
            : edge.condition === "no" ? "No"
            : (edge.label ?? "");

          return (
            <g
              key={key}
              onMouseEnter={() => setHoveredEdgeKey(key)}
              onMouseLeave={() => setHoveredEdgeKey(null)}
              onClick={(e) => { e.stopPropagation(); onEdgeClick?.(key); }}
              style={{ cursor: "pointer" }}
            >
              <path d={d} fill="none" stroke="transparent" strokeWidth={12} />
              <path
                d={d} fill="none" stroke={edgeColor}
                strokeWidth={selected ? 2 : hovered ? 1.5 : 1}
                strokeDasharray={selected || hovered ? undefined : "4 3"}
              />
              <polygon points={arrowPoints} fill={arrowColor} />

              {labelText && (
                <>
                  <rect
                    x={midX - labelText.length * 3 - 4} y={midY - 8}
                    width={labelText.length * 6 + 8} height={16}
                    rx={3} fill="#0e0e12" opacity={0.9}
                  />
                  <text
                    x={midX} y={midY} textAnchor="middle" dominantBaseline="central"
                    fontSize={9} fontWeight={500}
                    fill={edge.condition === "yes" ? "#4ade80" : edge.condition === "no" ? "#df4d18" : "rgba(255,255,255,0.6)"}
                    style={{ fontFamily: "var(--font-poppins), sans-serif", pointerEvents: "none" }}
                  >
                    {labelText}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Drag preview */}
        {dragPreview}

        {/* Nodes */}
        {nodes.map((node: FlowNode) => {
          const rect = getNodeRect(node);
          const connectedEdgeKeys = edges
            .filter((e) => e.from === node.id || e.to === node.id)
            .map((e) => edgeKey(e.from, e.to));
          const active = connectedEdgeKeys.includes(hoveredEdgeKey ?? "");
          const selected = node.id === selectedNodeId;
          const hovered = hoveredNodeId === node.id;
          const orphan = !nodesWithIncoming.has(node.id) && !nodesWithOutgoing.has(node.id) && node.type !== "start";

          // Big hover zone: covers node body + all affordances (● points + ＋ buttons)
          // Right ＋ at rect.x+w+24 r=10 → need +36; Below ＋ at rect.y+h+24 r=10 → need +36
          // Left ＋ at rect.x-32 r=10 → need -44 (only when step>0 but we always reserve space)
          const hzX = rect.x - 44;
          const hzY = rect.y - 6;
          const hzW = rect.w + 44 + 36;
          const hzH = rect.h + 6 + 36;

          return (
            // onMouseEnter/Leave on the <g> fires based on combined hit area of all children.
            // Moving between siblings inside this <g> does NOT trigger mouseleave — that's the fix.
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              {/* ① Big transparent hit zone — covers node + affordances */}
              <rect
                x={hzX} y={hzY} width={hzW} height={hzH}
                fill="rgba(0,0,0,0)"
                style={{ pointerEvents: "all", cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); onNodeClick?.(node.id); }}
                onMouseUp={(e) => handleMouseUp(e, node.id)}
              />

              {/* ② Node shape — visual only, no pointer events (handled by big rect) */}
              <g style={{ pointerEvents: "none" }}>
                <NodeShape node={node} rect={rect} active={active} selected={selected} orphan={orphan} />
              </g>

              {/* ③ Hover affordances: connection points + ＋ buttons */}
              {hovered && !dragState && (
                <g style={{ pointerEvents: "all" }}>
                  {/* Connection point — center right */}
                  <circle
                    cx={rect.x + rect.w} cy={rect.cy} r={5}
                    fill="#df4d18" stroke="#0e0e12" strokeWidth={1.5}
                    style={{ cursor: "crosshair" }}
                    onMouseDown={(e) => handleConnectStart(e, node.id)}
                  />
                  {/* Connection point — center bottom */}
                  <circle
                    cx={rect.cx} cy={rect.y + rect.h} r={5}
                    fill="#df4d18" stroke="#0e0e12" strokeWidth={1.5}
                    style={{ cursor: "crosshair" }}
                    onMouseDown={(e) => handleConnectStart(e, node.id)}
                  />
                  {/* Connection point — center left */}
                  <circle
                    cx={rect.x} cy={rect.cy} r={5}
                    fill="rgba(255,255,255,0.3)" stroke="#0e0e12" strokeWidth={1.5}
                    style={{ cursor: "crosshair" }}
                    onMouseDown={(e) => handleConnectStart(e, node.id)}
                  />

                  {/* ＋ button — right (add next step) */}
                  <g
                    style={{ cursor: "pointer" }}
                    onClick={(e) => { e.stopPropagation(); onAddNodeRight?.(node.id); }}
                  >
                    <circle
                      cx={rect.x + rect.w + 24} cy={rect.cy} r={10}
                      fill="#1a1a28" stroke="rgba(223,77,24,0.6)" strokeWidth={1.5}
                    />
                    <text
                      x={rect.x + rect.w + 24} y={rect.cy}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize={14} fill="#df4d18"
                      style={{ fontFamily: "sans-serif", pointerEvents: "none", userSelect: "none" }}
                    >+</text>
                  </g>

                  {/* ＋ button — below (add parallel track) */}
                  <g
                    style={{ cursor: "pointer" }}
                    onClick={(e) => { e.stopPropagation(); onAddNodeBelow?.(node.id); }}
                  >
                    <circle
                      cx={rect.cx} cy={rect.y + rect.h + 24} r={10}
                      fill="#1a1a28" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}
                    />
                    <text
                      x={rect.cx} y={rect.y + rect.h + 24}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize={14} fill="rgba(255,255,255,0.5)"
                      style={{ fontFamily: "sans-serif", pointerEvents: "none", userSelect: "none" }}
                    >+</text>
                  </g>

                  {/* ＋ button — left (insert step before) */}
                  {node.step > 0 && (
                    <g
                      style={{ cursor: "pointer" }}
                      onClick={(e) => { e.stopPropagation(); onAddNodeRight?.(node.id + "__insertBefore"); }}
                    >
                      {/* Vertical dashed line */}
                      <line
                        x1={rect.x - 32} y1={rect.y - 20}
                        x2={rect.x - 32} y2={rect.y + rect.h + 20}
                        stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="3 3"
                      />
                      <circle
                        cx={rect.x - 32} cy={rect.cy} r={10}
                        fill="#1a1a28" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5}
                      />
                      <text
                        x={rect.x - 32} y={rect.cy}
                        textAnchor="middle" dominantBaseline="central"
                        fontSize={11} fill="rgba(255,255,255,0.3)"
                        style={{ fontFamily: "sans-serif", pointerEvents: "none", userSelect: "none" }}
                      >+</text>
                    </g>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Condition popup after drag-to-connect on decision node */}
        {conditionPopup && (
          <g>
            <rect
              x={conditionPopup.x - 60} y={conditionPopup.y - 16}
              width={120} height={32} rx={8}
              fill="#111119" stroke="rgba(255,255,255,0.12)" strokeWidth={1}
            />
            {/* Yes button */}
            <g
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onAddEdge?.(conditionPopup.from, conditionPopup.to, "yes");
                setConditionPopup(null);
              }}
            >
              <rect x={conditionPopup.x - 56} y={conditionPopup.y - 12} width={48} height={24} rx={6} fill="rgba(74,222,128,0.12)" />
              <text x={conditionPopup.x - 32} y={conditionPopup.y} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} fill="#4ade80" style={{ fontFamily: "var(--font-poppins), sans-serif", pointerEvents: "none" }}>Yes</text>
            </g>
            {/* No button */}
            <g
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onAddEdge?.(conditionPopup.from, conditionPopup.to, "no");
                setConditionPopup(null);
              }}
            >
              <rect x={conditionPopup.x + 8} y={conditionPopup.y - 12} width={48} height={24} rx={6} fill="rgba(223,77,24,0.12)" />
              <text x={conditionPopup.x + 32} y={conditionPopup.y} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} fill="#df4d18" style={{ fontFamily: "var(--font-poppins), sans-serif", pointerEvents: "none" }}>No</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
