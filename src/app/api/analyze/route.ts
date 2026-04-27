import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

// ─── URL 분석 ─────────────────────────────────────────────────────────────────

async function fetchUrlContext(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; OpinionBot/1.0)" },
    signal: AbortSignal.timeout(8000),
  });
  const html = await res.text();

  const ogTitle = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1] ?? "";
  const ogDesc = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/)?.[1] ?? "";
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";

  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);

  return `서비스명: ${ogTitle || title}
설명: ${ogDesc}
본문: ${bodyText}`;
}

// ─── GitHub 분석 ──────────────────────────────────────────────────────────────

async function fetchGitHubContext(url: string): Promise<string> {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) throw new Error("유효한 GitHub URL이 아니에요.");

  const [, owner, repo] = match;
  const base = `https://api.github.com/repos/${owner}/${repo}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "OpinionBot/1.0",
  };
  if (process.env.GITHUB_TOKEN) headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;

  const [repoRes, readmeRes] = await Promise.allSettled([
    fetch(base, { headers }),
    fetch(`${base}/readme`, { headers }),
  ]);

  let repoInfo = "";
  let readme = "";

  if (repoRes.status === "fulfilled" && repoRes.value.ok) {
    const data = await repoRes.value.json();
    repoInfo = `이름: ${data.full_name}
설명: ${data.description ?? ""}
언어: ${data.language ?? ""}
토픽: ${(data.topics ?? []).join(", ")}
스타: ${data.stargazers_count}`;
  }

  if (readmeRes.status === "fulfilled" && readmeRes.value.ok) {
    const data = await readmeRes.value.json();
    const raw = Buffer.from(data.content, "base64").toString("utf-8");
    readme = raw.replace(/!\[.*?\]\(.*?\)/g, "").slice(0, 2000);
  }

  return `${repoInfo}\n\nREADME:\n${readme}`;
}

// ─── Playwright 스크린샷 분석 (PLAYWRIGHT_ENABLED=true 시) ───────────────────

async function fetchUrlContextWithPlaywright(url: string): Promise<string> {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    const screenshot = await page.screenshot({ type: "jpeg", quality: 70, fullPage: false });
    const title = await page.title();
    const screenshotB64 = Buffer.from(screenshot).toString("base64");

    const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
      {
        inlineData: { mimeType: "image/jpeg", data: screenshotB64 },
      },
      `이 서비스 화면을 분석해줘. 서비스명: ${title}. 어떤 서비스인지 한국어로 설명해줘.`,
    ]);

    const text = result.response.text();
    return `서비스명: ${title}\nVision 분석: ${text.slice(0, 2000)}`;
  } finally {
    await browser.close();
  }
}

// ─── Gemini 설문 생성 ─────────────────────────────────────────────────────────

interface GeneratedQuestion {
  type:
    | "multiple_choice"
    | "checkbox"
    | "short_text"
    | "long_text"
    | "scale"
    | "grade"
    | "dropdown"
    | "ranking";
  title: string;
  options?: string[];
}

interface GeneratedSurvey {
  title: string;
  description: string;
  questions: GeneratedQuestion[];
}

async function generateSurveyQuestions(context: string): Promise<GeneratedQuestion[]> {
  const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `다음 서비스/프로젝트 정보를 바탕으로 사용자 피드백을 수집하기 위한 설문 질문 6개를 만들어줘.

서비스 정보:
${context}

사용 가능한 질문 유형 (각 질문에 가장 적합한 유형을 골라줘):
- multiple_choice: 단일 선택 (보기 중 하나만, options 필요)
- checkbox: 복수 선택 (여러 개 가능, options 필요)
- short_text: 짧은 주관식 (한 줄 답변)
- long_text: 긴 주관식 (자세한 의견, 개선점 등)
- scale: 1~5점 척도 (만족도, 가능성 등)
- grade: 별점 (전반적 만족도)
- dropdown: 드롭다운 선택 (options 필요, 선택지 많을 때)
- ranking: 순위 매기기 (우선순위, options 필요)

규칙:
- 질문은 한국어로
- 실제 사용자 경험, 첫인상, 개선점, 재방문 의향 등에 집중
- options가 필요한 유형(multiple_choice, checkbox, dropdown, ranking)은 반드시 options 배열 포함 (3~5개)
- options 불필요한 유형(short_text, long_text, scale, grade)은 options 생략
- 반드시 아래 JSON 형식으로만 응답. 다른 텍스트 없이.

[
  { "type": "multiple_choice", "title": "질문", "options": ["선택지1", "선택지2", "선택지3"] },
  { "type": "scale", "title": "질문" },
  { "type": "long_text", "title": "질문" }
]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("AI 응답 파싱 실패");

  return JSON.parse(jsonMatch[0]) as GeneratedQuestion[];
}

async function generateSurveyFromPrompt(prompt: string): Promise<GeneratedSurvey> {
  const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const geminiPrompt = `다음 요청에 맞는 설문을 만들어줘.

요청: ${prompt}

사용 가능한 질문 유형 (각 질문에 가장 적합한 유형을 골라줘):
- multiple_choice: 단일 선택 (options 필요)
- checkbox: 복수 선택 (options 필요)
- short_text: 짧은 주관식
- long_text: 긴 주관식
- scale: 1~5점 척도
- grade: 별점
- dropdown: 드롭다운 (options 필요)
- ranking: 순위 매기기 (options 필요)

규칙:
- 질문 6개 이내
- 한국어로
- options가 필요한 유형은 반드시 options 배열 포함 (3~5개)
- 반드시 아래 JSON 형식으로만 응답.

{ "title": "설문 제목", "description": "설문 설명", "questions": [...] }`;

  const result = await model.generateContent(geminiPrompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI 응답 파싱 실패");

  return JSON.parse(jsonMatch[0]) as GeneratedSurvey;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "api_key_missing", message: "GEMINI_API_KEY가 설정되지 않았어요." },
      { status: 503 }
    );
  }

  let source: string;
  let sourceType: "url" | "prompt";
  try {
    const body = await req.json();
    source = (body.source ?? "").trim();
    sourceType = body.source_type === "prompt" ? "prompt" : "url";
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!source) {
    return NextResponse.json(
      { error: "source_required", message: "내용을 입력해 주세요." },
      { status: 422 }
    );
  }

  // ── 인증 체크 ─────────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // ── URL 분석은 Pro/Max 전용 ───────────────────────────────────────────────────
  if (sourceType === "url") {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if ((sub?.plan ?? "free") === "free") {
      return NextResponse.json(
        { error: "plan_required", message: "Pro 이상에서 사용할 수 있어요." },
        { status: 403 }
      );
    }
  }

  // ── Prompt 경로 ──────────────────────────────────────────────────────────────
  if (sourceType === "prompt") {
    try {
      const survey = await generateSurveyFromPrompt(source);
      return NextResponse.json({
        title: survey.title,
        description: survey.description,
        sourceType: "prompt",
        questions: survey.questions,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "분석 중 오류가 생겼어요.";
      console.error("[analyze POST prompt]", err);
      return NextResponse.json({ error: "analysis_failed", message }, { status: 500 });
    }
  }

  // ── URL 경로 ─────────────────────────────────────────────────────────────────
  const isGitHub = /github\.com/i.test(source);
  const isUrl = /^https?:\/\//i.test(source);

  if (!isUrl) {
    return NextResponse.json(
      { error: "invalid_source", message: "올바른 URL을 입력해 주세요." },
      { status: 422 }
    );
  }

  try {
    let context: string;
    if (isGitHub) {
      context = await fetchGitHubContext(source);
    } else if (process.env.PLAYWRIGHT_ENABLED === "true") {
      try {
        context = await fetchUrlContextWithPlaywright(source);
      } catch {
        context = await fetchUrlContext(source);
      }
    } else {
      context = await fetchUrlContext(source);
    }

    const questions = await generateSurveyQuestions(context);

    const titleLine = context.split("\n")[0].replace("서비스명: ", "").replace("이름: ", "");
    const descLine =
      context
        .split("\n")
        .find((l) => l.startsWith("설명:"))
        ?.replace("설명: ", "") ?? "";

    return NextResponse.json({
      title: titleLine ? `${titleLine} 피드백 설문` : "서비스 피드백 설문",
      description: descLine || "이 서비스에 대한 솔직한 의견을 들려주세요.",
      sourceType: isGitHub ? "github" : "url",
      questions,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "분석 중 오류가 생겼어요.";
    console.error("[analyze POST url]", err);
    return NextResponse.json({ error: "analysis_failed", message }, { status: 500 });
  }
}
