"use client";

import { useEffect, useState, useRef, useCallback, type FC } from "react";
import { COLOR, INTERACTION, TYPOGRAPHY } from "@/lib/design-tokens";

interface StartSelectionOverlayProps {
  surveyId: string;
  onSelectManual: () => void;
  onAnalyzeComplete: () => void;
}

type OverlayStep = "select" | "url_input" | "prompt_input" | "analyzing";
type Plan = "free" | "pro" | "max";

const ANALYZING_MESSAGES = [
  "AI가 분석하고 있어요...",
  "질문을 구성하는 중이에요...",
  "설문을 완성하는 중이에요...",
];

export const StartSelectionOverlay: FC<StartSelectionOverlayProps> = ({
  surveyId,
  onSelectManual,
  onAnalyzeComplete,
}) => {
  const [step, setStep] = useState<OverlayStep>("select");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [analyzingMsgIdx, setAnalyzingMsgIdx] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const createdSectionRef = useRef<string | null>(null);
  const analyzingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/billing/subscription")
      .then((r) => r.json())
      .then((data) => {
        const p = data?.plan as Plan | undefined;
        if (p === "pro" || p === "max") {
          setPlan(p);
        } else {
          setPlan("free");
        }
      })
      .catch(() => setPlan("free"));
  }, []);

  // rotating analyzing messages
  useEffect(() => {
    if (step === "analyzing") {
      setAnalyzingMsgIdx(0);
      analyzingIntervalRef.current = setInterval(() => {
        setAnalyzingMsgIdx((prev) => (prev + 1) % ANALYZING_MESSAGES.length);
      }, 2500);
    } else {
      if (analyzingIntervalRef.current) {
        clearInterval(analyzingIntervalRef.current);
        analyzingIntervalRef.current = null;
      }
    }
    return () => {
      if (analyzingIntervalRef.current) {
        clearInterval(analyzingIntervalRef.current);
      }
    };
  }, [step]);

  // ESC handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (step === "analyzing") return; // ESC disabled during analysis
      if (step === "url_input" || step === "prompt_input") {
        setStep("select");
        setError("");
      } else if (step === "select") {
        onSelectManual();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, onSelectManual]);

  const handleCancel = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    // best-effort cleanup of created section
    if (createdSectionRef.current) {
      const sectionId = createdSectionRef.current;
      createdSectionRef.current = null;
      try {
        await fetch(`/api/surveys/${surveyId}/sections/${sectionId}`, {
          method: "DELETE",
        });
      } catch {
        // best effort — ignore
      }
    }
    setStep("select");
    setError("");
  }, [surveyId]);

  const runAnalyze = useCallback(
    async (sourceType: "url" | "prompt", source: string) => {
      setError("");
      setStep("analyzing");
      createdSectionRef.current = null;

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // 1. AI 분석
        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source, source_type: sourceType }),
          signal: controller.signal,
        });

        if (!analyzeRes.ok) {
          const body = await analyzeRes.json();
          throw new Error(body.message ?? "분석 중 오류가 생겼어요.");
        }

        const { title, description, questions } = await analyzeRes.json();

        // 2. 설문 title/description 업데이트
        await fetch(`/api/surveys/${surveyId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
          signal: controller.signal,
        });

        // 3. 섹션 생성
        const sRes = await fetch(`/api/surveys/${surveyId}/sections`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "" }),
          signal: controller.signal,
        });
        if (!sRes.ok) throw new Error("섹션 생성에 실패했어요.");
        const section = await sRes.json();
        createdSectionRef.current = section.id;

        // 4. 질문 생성 (순서 보장을 위해 순차 실행)
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i] as {
            type: string;
            title: string;
            options?: string[];
          };
          await fetch(`/api/surveys/${surveyId}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: q.type,
              title: q.title,
              options: q.options ?? null,
              section_id: section.id,
              order_index: i,
            }),
            signal: controller.signal,
          });
        }

        abortRef.current = null;
        onAnalyzeComplete();
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // handleCancel already handles cleanup — just return
          return;
        }
        const msg = err instanceof Error ? err.message : "분석 중 오류가 생겼어요.";
        setError(msg);
        setStep(sourceType === "url" ? "url_input" : "prompt_input");
      }
    },
    [surveyId, onAnalyzeComplete]
  );

  const handleAnalyzeUrl = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("URL을 입력해 주세요.");
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setError("올바른 URL을 입력해 주세요.");
      return;
    }
    runAnalyze("url", trimmed);
  }, [url, runAnalyze]);

  const handleAnalyzePrompt = useCallback(() => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("설문 설명을 입력해 주세요.");
      return;
    }
    runAnalyze("prompt", trimmed);
  }, [prompt, runAnalyze]);

  const planLoading = plan === null;
  const isPro = plan === "pro" || plan === "max";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="overlay-heading"
      className="start_selection_overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="start_selection_panel w-full rounded-2xl overflow-hidden"
        style={{
          maxWidth: 480,
          backgroundColor: COLOR.BG_BASE,
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          margin: "0 16px",
        }}
      >
        {/* Header */}
        <div className="px-7 pt-8 pb-2">
          <p
            id="overlay-heading"
            style={{
              ...TYPOGRAPHY.STYLE.H3,
              color: COLOR.TEXT_PRIMARY,
              marginBottom: 6,
            }}
          >
            어떻게 시작할까요?
          </p>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_SECONDARY }}>
            설문을 만드는 방법을 골라주세요
          </p>
        </div>

        {/* ── Select ── */}
        {step === "select" && (
          <div className="px-7 py-6 flex flex-col gap-3">
            {/* Option 1: URL AI (Pro/Max only) */}
            <button
              type="button"
              onClick={() => !planLoading && isPro && setStep("url_input")}
              disabled={planLoading || !isPro}
              className="w-full text-left rounded-xl px-5 py-4"
              style={{
                border: `1.5px solid ${COLOR.BORDER_DEFAULT}`,
                backgroundColor:
                  !planLoading && isPro && hoveredCard === "url"
                    ? INTERACTION.HOVER_BG
                    : COLOR.BG_BASE,
                transition: INTERACTION.TRANSITION_BG,
                cursor: planLoading || !isPro ? "default" : "pointer",
                opacity: planLoading ? 0.5 : !isPro ? 0.55 : 1,
              }}
              onMouseEnter={() => !planLoading && isPro && setHoveredCard("url")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🌐</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>
                      URL로 AI가 만들어줘요
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        ...TYPOGRAPHY.STYLE.LABEL_2,
                        backgroundColor: isPro ? COLOR.ACCENT_BG : COLOR.BG_SECTION,
                        color: isPro ? COLOR.ACCENT : COLOR.TEXT_DISABLED,
                      }}
                    >
                      Pro
                    </span>
                  </div>
                  <p
                    className="mt-1"
                    style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_SECONDARY }}
                  >
                    {isPro
                      ? "서비스 URL만 있으면 AI가 질문을 완성해요"
                      : "Pro를 써보면 URL 하나로 설문이 완성돼요"}
                  </p>
                  {!planLoading && !isPro && (
                    <a
                      href="/pricing"
                      className="inline-block mt-1 underline"
                      style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.ACCENT }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Pro로 업그레이드하기
                    </a>
                  )}
                </div>
              </div>
            </button>

            {/* Option 2: Prompt AI (all plans) */}
            <button
              type="button"
              onClick={() => setStep("prompt_input")}
              className="w-full text-left rounded-xl px-5 py-4"
              style={{
                border: `1.5px solid ${COLOR.BORDER_DEFAULT}`,
                backgroundColor: hoveredCard === "prompt" ? INTERACTION.HOVER_BG : COLOR.BG_BASE,
                transition: INTERACTION.TRANSITION_BG,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredCard("prompt")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">✨</span>
                <div>
                  <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>
                    한 줄 설명으로 AI가 만들어줘요
                  </p>
                  <p
                    className="mt-1"
                    style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_SECONDARY }}
                  >
                    어떤 설문인지 설명하면 AI가 질문을 구성해요
                  </p>
                </div>
              </div>
            </button>

            {/* Option 3: Manual (all plans) */}
            <button
              type="button"
              onClick={onSelectManual}
              className="w-full text-left rounded-xl px-5 py-4"
              style={{
                border: `1.5px solid ${COLOR.BORDER_DEFAULT}`,
                backgroundColor: hoveredCard === "manual" ? INTERACTION.HOVER_BG : COLOR.BG_BASE,
                transition: INTERACTION.TRANSITION_BG,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredCard("manual")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">✏️</span>
                <div>
                  <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>
                    직접 만들며 시작하기
                  </p>
                  <p
                    className="mt-1"
                    style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_SECONDARY }}
                  >
                    빈 캔버스에서 바로 시작해요
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ── URL Input ── */}
        {step === "url_input" && (
          <div className="px-7 py-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="analyze-url"
                className="block mb-2"
                style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_SECONDARY }}
              >
                분석할 URL을 붙여주세요
              </label>
              <input
                id="analyze-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyzeUrl()}
                placeholder="https://example.com"
                autoFocus
                className="w-full rounded-xl px-4 py-3 opinion-input"
                data-error={error ? "true" : undefined}
                style={{
                  ...TYPOGRAPHY.STYLE.BODY_1,
                  color: COLOR.TEXT_PRIMARY,
                  backgroundColor: COLOR.BG_SURFACE,
                  border: `1.5px solid ${error ? COLOR.NEGATIVE : COLOR.BORDER_DEFAULT}`,
                }}
              />
              {error && (
                <p className="mt-2" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.NEGATIVE }}>
                  {error}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep("select");
                  setError("");
                  setUrl("");
                }}
                className="flex-1 rounded-xl py-3"
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  color: COLOR.TEXT_SECONDARY,
                  backgroundColor: COLOR.BG_SURFACE,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                이전으로
              </button>
              <button
                type="button"
                onClick={handleAnalyzeUrl}
                className="flex-[2] rounded-xl py-3"
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  color: COLOR.TEXT_INVERSE,
                  backgroundColor: COLOR.ACCENT,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                분석하기
              </button>
            </div>
          </div>
        )}

        {/* ── Prompt Input ── */}
        {step === "prompt_input" && (
          <div className="px-7 py-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="analyze-prompt"
                className="block mb-2"
                style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_SECONDARY }}
              >
                어떤 설문을 만들까요?
              </label>
              <textarea
                id="analyze-prompt"
                rows={4}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleAnalyzePrompt();
                  }
                }}
                placeholder="예: 스타트업 직원 만족도 조사, 5문항 내외, 주관식 포함"
                autoFocus
                className="w-full rounded-xl px-4 py-3 opinion-input resize-none"
                data-error={error ? "true" : undefined}
                style={{
                  ...TYPOGRAPHY.STYLE.BODY_1,
                  color: COLOR.TEXT_PRIMARY,
                  backgroundColor: COLOR.BG_SURFACE,
                  border: `1.5px solid ${error ? COLOR.NEGATIVE : COLOR.BORDER_DEFAULT}`,
                }}
              />
              <p
                className="mt-1.5"
                style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
              >
                ⌘ Enter로 바로 분석할 수 있어요
              </p>
              {error && (
                <p className="mt-1" style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.NEGATIVE }}>
                  {error}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep("select");
                  setError("");
                  setPrompt("");
                }}
                className="flex-1 rounded-xl py-3"
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  color: COLOR.TEXT_SECONDARY,
                  backgroundColor: COLOR.BG_SURFACE,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                이전으로
              </button>
              <button
                type="button"
                onClick={handleAnalyzePrompt}
                className="flex-[2] rounded-xl py-3"
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  color: COLOR.TEXT_INVERSE,
                  backgroundColor: COLOR.ACCENT,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                분석하기
              </button>
            </div>
          </div>
        )}

        {/* ── Analyzing ── */}
        {step === "analyzing" && (
          <div className="px-7 py-10 flex flex-col items-center gap-5">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{
                borderColor: COLOR.ACCENT,
                borderTopColor: "transparent",
              }}
            />
            <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_SECONDARY }}>
              {ANALYZING_MESSAGES[analyzingMsgIdx]}
            </p>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                color: COLOR.TEXT_MUTED,
                backgroundColor: COLOR.BG_SURFACE,
                border: "none",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  backgroundColor: COLOR.TEXT_MUTED,
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
              멈추기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
