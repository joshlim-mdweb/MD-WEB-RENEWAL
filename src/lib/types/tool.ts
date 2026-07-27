// Shared types for the internal Flowchart Tool.
// Used by both the API route (server) and the client-side canvas component.

export interface FlowchartSession {
  id: string;
  title: string;
  data: FlowchartData;
  created_at: string;
  updated_at: string;
}

export interface FlowNode {
  id: string;
  label: string;
  type: "start" | "screen" | "decision" | "route" | "end";
  /** Horizontal position — which step in the flow (0-based) */
  step: number;
  /** Vertical position — which parallel track at this step (0-based) */
  track: number;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  condition?: "yes" | "no";
}

export interface FlowchartData {
  nodes: FlowNode[];
  edges: FlowEdge[];
  edge_cases: string[];
  missing_cases: string[];
}
