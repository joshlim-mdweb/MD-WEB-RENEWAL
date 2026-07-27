import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { FlowchartData } from "@/lib/types/tool";

// POST /api/tool/flowchart
//
// Internal tool endpoint — no auth required (사내 전용).
// Accepts a conversation history, calls Claude to analyze the flow,
// and returns a structured flowchart + natural language explanation.

const CLAUDE_MODEL = "claude-sonnet-4-6";

export type { FlowchartData };

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `당신은 프로덕트 기획 전문가입니다. 사용자가 설명하는 플로우를 분석해 플로우차트 구조를 만들고 엣지케이스를 발견합니다.

## 노드 타입 정의

- "start": 플로우 진입점 (1개)
- "screen": 일반 화면 또는 단계
- "decision": Yes/No 이분기 전용 (반드시 binary만 — 3개 이상 분기 금지)
- "route": 3개 이상 케이스 분기 (각 엣지에 케이스 레이블 필수)
- "end": 플로우 종료점 (1개 이상 가능)

## 그리드 좌표 규칙

- col: 0부터 시작하는 열 번호 (왼쪽 → 오른쪽 = 플로우 진행 방향)
- row: 0부터 시작하는 행 번호 (0 = 최상단, 아래로 증가)
- 메인 플로우: col 0→1→2→... row 0으로 직선
- decision YES 분기: 같은 row에서 오른쪽 (col+1)
- decision NO 분기: 아래 row (row+1), 같은 col
- route 팬아웃: route 노드는 타겟들의 중간 row, 타겟들은 col+1에 row를 균등 분산
- 같은 col에 여러 노드: row를 다르게 배치

## 응답 형식

먼저 자연어로 분석 내용을 설명하세요. 그다음 반드시 아래 태그로 JSON을 포함하세요:

<flowchart>
{
  "nodes": [
    {"id": "고유ID", "label": "노드명", "type": "screen", "col": 0, "row": 0}
  ],
  "edges": [
    {"from": "nodeId1", "to": "nodeId2", "label": "선택적 레이블", "condition": "yes"}
  ],
  "edge_cases": ["발견된 엣지케이스 1", "엣지케이스 2"],
  "missing_cases": ["누락된 케이스 1", "누락된 케이스 2"]
}
</flowchart>

## 중요 규칙

- condition 필드: decision 노드 outgoing 엣지에만 사용 ("yes" 또는 "no")
- route 노드 outgoing 엣지: label에 케이스명 필수 (condition 없음)
- 모든 엣지는 source와 target이 nodes 배열에 반드시 존재해야 함
- 노드 ID는 영문 소문자 + 숫자 + 하이픈만 사용
- 한국어 응답 (노드 label 포함)`;

export async function POST(req: NextRequest) {
  let messages: ConversationMessage[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages_required" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Only pass role + content to Claude (strip any flowchart data from assistant messages)
  const claudeMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  let rawText: string;
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: claudeMessages,
    });

    rawText = response.content[0].type === "text" ? response.content[0].text : "";
  } catch (err) {
    console.error("[tool/flowchart POST] Claude error", err);
    return NextResponse.json({ error: "claude_call_failed" }, { status: 500 });
  }

  // Extract <flowchart>...</flowchart> JSON block
  const match = rawText.match(/<flowchart>([\s\S]*?)<\/flowchart>/);
  const naturalContent = rawText.replace(/<flowchart>[\s\S]*?<\/flowchart>/g, "").trim();

  if (!match) {
    // Claude didn't produce structured output — return text only
    return NextResponse.json({ content: naturalContent, flowchart: null });
  }

  let flowchart: FlowchartData;
  try {
    flowchart = JSON.parse(match[1].trim()) as FlowchartData;
  } catch (err) {
    console.error("[tool/flowchart POST] JSON parse error", err);
    return NextResponse.json({ content: naturalContent, flowchart: null });
  }

  return NextResponse.json({ content: naturalContent, flowchart });
}
