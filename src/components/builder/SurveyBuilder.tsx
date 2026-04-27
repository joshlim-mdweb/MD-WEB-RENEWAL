"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/lib/store/builder";
import { SurveyWithQuestions } from "@/lib/types/survey";
import { QuestionSettings } from "./QuestionSettings";
import { SectionSettings } from "./SectionSettings";
import { FlowView } from "./FlowView";
import { QuestionList } from "./QuestionList";
import { ViewToggle } from "./ViewToggle";
import { ListViewCanvas } from "./ListViewCanvas";
import { PublishValidationPanel } from "./PublishValidationPanel";
import { ResponsesView } from "./ResponsesView";
import { AnalysisView } from "./AnalysisView";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useBuilderKeyboard } from "@/hooks/useBuilderKeyboard";
import { Toast } from "@/components/ui/Toast";
import { type ValidationError } from "./PublishValidationPanel";
import { validateSurveyForPublish } from "@/lib/survey-validation";
import { Button, Badge, Tooltip } from "@/components/ui";
import { COLOR, INTERACTION, RADIUS, SHADOW, TYPOGRAPHY } from "@/lib/design-tokens";
import { useToastStore } from "@/lib/store/toast";
import { CompensationPanel } from "./CompensationPanel";
import { SurveyMetaPanel } from "./SurveyMetaPanel";
import { StartSelectionOverlay } from "./StartSelectionOverlay";

interface SurveyBuilderProps {
  // responseCount is fetched separately from the survey — it is not part of the
  // core SurveyWithQuestions type but must be passed in to seed the builder store.
  initialSurvey: SurveyWithQuestions & { responseCount?: number };
  // True when navigated from /survey/new via AI analysis — shows the AI context banner
  fromAnalyze?: boolean;
  // True when this is a brand-new survey — shows the StartSelectionOverlay on mount
  isNewSurvey?: boolean;
}

export function SurveyBuilder({
  initialSurvey,
  fromAnalyze = false,
  isNewSurvey = false,
}: SurveyBuilderProps) {
  const router = useRouter();
  const {
    surveyId,
    surveyTitle,
    surveyStatus,
    responseCount,
    setSurveyTitle,
    setSurveyStatus,
    initSurvey,
    isSaving,
    setIsSaving,
    view,
    pageTab,
    questions,
    activeQuestionId,
    activeSectionId,
    hasUnsavedChanges,
    surveyDescription,
    surveyPurpose,
    surveyEndDate,
    surveyMaxParticipants,
    surveyEstimatedTime,
    surveyRewardAmount,
    surveyRewardType,
  } = useBuilderStore();

  // isPublishing / isClosing / isReopening are local UI state — not persisted, not shared
  const [isPublishing, setIsPublishing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isReopening, setIsReopening] = useState(false);

  // ── 패널 리사이즈 ──────────────────────────────────────────────────────────
  const PANEL_GAP = 12; // px, Tailwind *-3
  const LEFT_MIN = 200;
  const LEFT_MAX = 480;
  const RIGHT_MIN = 400;

  const builderBodyRef = useRef<HTMLDivElement>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(292);
  // null → 남은 캔버스 전체 채우기 (최대 넓이), 기본값 540px
  const [rightPanelWidth, setRightPanelWidth] = useState<number | null>(540);

  const startLeftDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startW = leftPanelWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      const onMove = (ev: MouseEvent) =>
        setLeftPanelWidth(Math.max(LEFT_MIN, Math.min(LEFT_MAX, startW + ev.clientX - startX)));
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [leftPanelWidth]
  );

  const startRightDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const containerW = builderBodyRef.current?.offsetWidth ?? window.innerWidth;
      const maxW = containerW - leftPanelWidth - PANEL_GAP * 3;
      const startX = e.clientX;
      const startW = rightPanelWidth ?? maxW;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      const onMove = (ev: MouseEvent) => {
        const newW = Math.max(RIGHT_MIN, Math.min(maxW, startW + startX - ev.clientX));
        setRightPanelWidth(newW >= maxW - 4 ? null : newW);
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [leftPanelWidth, rightPanelWidth]
  );
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  // Compensation panel open state
  const [isCompensationOpen, setIsCompensationOpen] = useState(false);
  // Survey meta modal
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  // Overlay for new survey start selection (direct vs AI)
  const [showOverlay, setShowOverlay] = useState(isNewSurvey);

  const handleSelectManual = useCallback(() => setShowOverlay(false), []);
  const handleAnalyzeComplete = useCallback(() => {
    router.refresh();
    setShowOverlay(false);
  }, [router]);

  useEffect(() => {
    initSurvey(initialSurvey);
  }, [initialSurvey, initSurvey]);

  // Lock page scroll while builder is mounted — the canvas handles its own pan/zoom
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Section-First init: when a brand-new survey has no sections yet, auto-create
  // Section 1 + one default short_text question so the builder is never empty.
  // Uses optimistic add so the question appears immediately and auto-focuses.
  const {
    sections,
    addSection,
    addQuestionOptimistic,
    confirmQuestion,
    rollbackQuestion,
    setNewlyAddedQuestionId,
  } = useBuilderStore();
  const initRanRef = useRef(false);
  useEffect(() => {
    if (showOverlay) return;
    if (initRanRef.current) return;
    if (!surveyId || sections.length > 0 || questions.length > 0) return;
    initRanRef.current = true;

    (async () => {
      const sRes = await fetch(`/api/surveys/${surveyId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "" }),
      });
      if (!sRes.ok) return;
      const section = await sRes.json();
      addSection(section);

      const tempId = `temp-${crypto.randomUUID()}`;
      const tempQuestion = {
        id: tempId,
        survey_id: surveyId,
        section_id: section.id,
        type: "short_text" as const,
        title: "",
        options: null,
        order_index: 0,
        required: false,
        config: null,
        created_at: new Date().toISOString(),
      };
      addQuestionOptimistic(tempId, tempQuestion);
      setNewlyAddedQuestionId(tempId);

      const qRes = await fetch(`/api/surveys/${surveyId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "short_text", section_id: section.id }),
      });
      if (!qRes.ok) {
        rollbackQuestion(tempId);
        return;
      }
      const question = await qRes.json();
      confirmQuestion(tempId, question);
      setNewlyAddedQuestionId(question.id);
    })();
  }, [
    showOverlay,
    surveyId,
    sections,
    questions,
    addSection,
    addQuestionOptimistic,
    confirmQuestion,
    rollbackQuestion,
    setNewlyAddedQuestionId,
  ]);

  // Wire up auto-save — debounced 1500ms, only patches dirty questions
  useAutoSave({ surveyId, surveyTitle, questions });

  // Global keyboard shortcuts: Cmd+C copy, Cmd+V paste, Delete/Backspace delete active question
  useBuilderKeyboard();

  // Standard browser warning when navigating away with unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const saveSurveyTitle = useCallback(
    async (title: string) => {
      if (!surveyId) return;
      setIsSaving(true);
      await fetch(`/api/surveys/${surveyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      setIsSaving(false);
    },
    [surveyId, setIsSaving]
  );

  // Saves all meta fields (description, tag, end_date, etc.) in one PATCH call.
  // Called onBlur from each field in SurveyOverviewPanel.
  const saveSurveyMeta = useCallback(async () => {
    if (!surveyId) return;
    setIsSaving(true);
    await fetch(`/api/surveys/${surveyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: surveyDescription,
        purpose: surveyPurpose,
        end_date: surveyEndDate,
        max_participants: surveyMaxParticipants,
        estimated_time: surveyEstimatedTime,
        reward_amount: surveyRewardAmount,
      }),
    });
    setIsSaving(false);
  }, [
    surveyId,
    setIsSaving,
    surveyDescription,
    surveyPurpose,
    surveyEndDate,
    surveyMaxParticipants,
    surveyEstimatedTime,
    surveyRewardAmount,
  ]);

  const handlePublish = useCallback(async () => {
    if (!surveyId || isPublishing) return;

    // Client-side pre-flight: run the same pure validation logic the server uses.
    // This gives immediate feedback without a round-trip when the survey is obviously
    // incomplete (no title, no questions, untitled questions, etc.).
    const clientErrors = validateSurveyForPublish({
      title: surveyTitle,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        title: q.title,
        options: q.options,
        order_index: q.order_index,
        required: q.required,
        config: q.config as Record<string, unknown> | null,
        next_target: q.next_target ?? null,
      })),
      sectionIds: useBuilderStore.getState().sections.map((s) => s.id),
    });

    if (clientErrors.length > 0) {
      setValidationErrors(clientErrors);
      return; // skip server call — user must fix errors first
    }

    setIsPublishing(true);
    // Clear any previous validation errors before a new attempt
    setValidationErrors([]);

    try {
      const response = await fetch(`/api/surveys/${surveyId}/publish`, {
        method: "POST",
      });

      if (response.ok) {
        setSurveyStatus("published");
      } else if (response.status === 422) {
        const body = await response.json();
        setValidationErrors(body.errors ?? []);
      }
      // Other error codes (500, 401) are silent for now — handled server-side logs
    } finally {
      setIsPublishing(false);
    }
  }, [surveyId, isPublishing, surveyTitle, questions, setSurveyStatus]);

  const handleClose = useCallback(async () => {
    if (!surveyId || isClosing) return;
    setIsClosing(true);
    try {
      const response = await fetch(`/api/surveys/${surveyId}/close`, { method: "POST" });
      if (response.ok) setSurveyStatus("closed");
    } finally {
      setIsClosing(false);
    }
  }, [surveyId, isClosing, setSurveyStatus]);

  const handleReopen = useCallback(async () => {
    if (!surveyId || isReopening) return;
    setIsReopening(true);
    try {
      // Reopen transitions closed → draft so the creator can edit and re-publish.
      const response = await fetch(`/api/surveys/${surveyId}/reopen`, { method: "POST" });
      if (response.ok) setSurveyStatus("draft");
    } finally {
      setIsReopening(false);
    }
  }, [surveyId, isReopening, setSurveyStatus]);

  const dismissValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  const showToast = useToastStore((s) => s.showToast);

  // Opens the preview in a new tab.
  // If there are unsaved changes or a save is in progress, waits up to 5 s for
  // the store to settle before opening — avoids previewing stale content.
  const handlePreview = useCallback(async () => {
    if (!surveyId) return;

    const waitForSave = (): Promise<void> =>
      new Promise((resolve) => {
        const MAX_WAIT_MS = 5000;
        const POLL_INTERVAL_MS = 100;
        let elapsed = 0;

        const check = () => {
          const { isSaving: saving, hasUnsavedChanges: dirty } = useBuilderStore.getState();
          if (!saving && !dirty) {
            resolve();
            return;
          }
          elapsed += POLL_INTERVAL_MS;
          if (elapsed >= MAX_WAIT_MS) {
            resolve(); // timeout — open anyway
            return;
          }
          setTimeout(check, POLL_INTERVAL_MS);
        };

        check();
      });

    if (isSaving || hasUnsavedChanges) {
      await waitForSave();
    }

    const win = window.open(`/survey/${surveyId}/respond?preview=true`, "_blank");
    if (win === null) {
      showToast("팝업 차단이 설정되어 있어요. 허용 후 다시 시도해 주세요.");
    }
  }, [surveyId, isSaving, hasUnsavedChanges, showToast]);

  const hasValidationErrors = validationErrors.length > 0;
  // Once any response exists, destructive edits (delete question, change type) are locked
  const hasResponses = responseCount > 0;

  return (
    <div
      className="survey_builder flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: COLOR.BG_SURFACE }}
    >
      {/* Global toast — renders above all builder UI, anchored to viewport bottom-center */}
      <Toast />
      {/* Top bar — surface color, ghost shadow (no solid border) */}
      <header
        className="builder_header flex items-center justify-between px-5 h-[52px] flex-shrink-0"
        style={{ boxShadow: "0 1px 0 rgba(199,200,208,0.15)", backgroundColor: COLOR.BG_BASE }}
      >
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-(--color-bg-surface)"
            aria-label="홈으로 이동하기"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke={COLOR.TEXT_MUTED}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 3L5 8l5 5" />
            </svg>
          </Link>
          <input
            type="text"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            onBlur={(e) => saveSurveyTitle(e.target.value)}
            className="bg-transparent border-none outline-none w-56 truncate"
            style={{ ...TYPOGRAPHY.STYLE.TITLE_1, color: COLOR.TEXT_PRIMARY }}
            placeholder="제목 없는 설문"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Save status dot indicator — replaces verbose text */}
          {isSaving && (
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: COLOR.WARNING }}
            />
          )}
          {!isSaving && hasUnsavedChanges && (
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR.WARNING }} />
          )}
          <Badge status={surveyStatus} />
          {/* Status-aware action buttons */}
          {surveyStatus === "draft" && (
            <>
              <Button variant="solid" size="md" loading={isPublishing} onClick={handlePublish}>
                공개하기
              </Button>
            </>
          )}
          {surveyStatus === "published" && (
            <Button variant="neutral" size="md" loading={isClosing} onClick={handleClose}>
              마감하기
            </Button>
          )}
          {surveyStatus === "closed" && (
            <Button variant="solid" size="md" loading={isReopening} onClick={handleReopen}>
              재개하기
            </Button>
          )}
        </div>
      </header>

      {/* Response guard — appears below header when the survey has received responses.
          Informs creators that structural edits are locked to protect data integrity.
          Uses error_container / on_error_container POI tokens. */}
      {hasResponses && (
        <div
          className="flex items-center gap-2 px-5 py-2.5"
          style={{
            ...TYPOGRAPHY.STYLE.BODY_2,
            backgroundColor: COLOR.NEGATIVE_BG,
            color: COLOR.NEGATIVE,
          }}
        >
          <svg
            className="flex-shrink-0"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M7 1L13 13H1L7 1Z" />
            <line x1="7" y1="5.5" x2="7" y2="8.5" />
            <circle cx="7" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
          </svg>
          이미 응답이 있어 일부 항목은 수정할 수 없습니다
        </div>
      )}

      {/* Validation error panel — appears below header, dismissible */}
      {hasValidationErrors && (
        <PublishValidationPanel errors={validationErrors} onDismiss={dismissValidationErrors} />
      )}

      {/* Closed / Archived read-only banner — surface_container_low (no border) */}
      {(surveyStatus === "closed" || surveyStatus === "archived") && (
        <div
          className="flex items-center gap-2 px-5 py-2.5"
          style={{
            ...TYPOGRAPHY.STYLE.BODY_2,
            backgroundColor: COLOR.BG_SECTION,
            color: COLOR.TEXT_SECONDARY,
          }}
        >
          <svg
            className="flex-shrink-0"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="6" width="8" height="7" rx="1" />
            <path d="M5 6V4a2 2 0 0 1 4 0v2" />
          </svg>
          {surveyStatus === "closed"
            ? "마감된 설문입니다 — 읽기 전용"
            : "보관된 설문입니다 — 읽기 전용"}
        </div>
      )}

      {/* Main layout — floating panel mode */}
      <div
        ref={builderBodyRef}
        className="builder_body flex-1 relative overflow-hidden"
        style={{ backgroundColor: COLOR.BG_SURFACE }}
      >
        {/* ── Full-screen canvas ── */}
        <div className="absolute inset-0 flex flex-col">
          {pageTab === "responses" && surveyId ? (
            <ResponsesView surveyId={surveyId} surveyStatus={surveyStatus} />
          ) : pageTab === "analysis" && surveyId ? (
            <AnalysisView surveyId={surveyId} surveyStatus={surveyStatus} />
          ) : view === "list" ? (
            <ListViewCanvas />
          ) : (
            <FlowView
              leftInset={PANEL_GAP + leftPanelWidth}
              rightInset={
                view === "flow" || isCompensationOpen ? PANEL_GAP + (rightPanelWidth ?? 540) : 0
              }
            />
          )}
        </div>

        {/* ── 좌측 플로팅 패널 — QuestionList (빌더 탭만) ── */}
        {pageTab === "builder" && (
          <div
            className="absolute left-3 top-3 bottom-3 z-10 flex flex-col overflow-hidden"
            style={{
              width: leftPanelWidth,
              backgroundColor: COLOR.BG_BASE,
              boxShadow: SHADOW.MODAL,
              borderRadius: 16,
            }}
          >
            <QuestionList
              onMetaSave={saveSurveyMeta}
              onOpenMeta={() => setIsMetaOpen(true)}
              floating
            />
            {/* 우측 리사이즈 핸들 */}
            <PanelResizeHandle side="right" onMouseDown={startLeftDrag} />
          </div>
        )}

        {/* ── 우측 플로팅 패널 — Settings (flow view) / Compensation (빌더 탭만) ── */}
        {/* flow view: top=64 — FlowView 우측 상단 툴바(top-3, 높이~52px) 아래에서 시작 */}
        {pageTab === "builder" && (view === "flow" || isCompensationOpen) && (
          <div
            className="absolute right-3 bottom-3 z-10 flex flex-col overflow-hidden"
            style={{
              // null → 좌측 패널 오른쪽 끝 + gap 부터 right:12 까지 채움 (최대 넓이 = 기본값)
              ...(rightPanelWidth === null
                ? { left: leftPanelWidth + PANEL_GAP * 2, right: PANEL_GAP }
                : { width: rightPanelWidth }),
              top: view === "flow" ? 64 : 12,
              backgroundColor: COLOR.BG_BASE,
              boxShadow: SHADOW.MODAL,
              borderRadius: 16,
            }}
          >
            {/* 좌측 리사이즈 핸들 */}
            <PanelResizeHandle side="left" onMouseDown={startRightDrag} />
            {isCompensationOpen && surveyId ? (
              <div className="flex-1 overflow-y-auto">
                <CompensationPanel
                  surveyId={surveyId}
                  onPublish={handlePublish}
                  isPublishing={isPublishing}
                />
              </div>
            ) : activeQuestionId !== null ? (
              <div className="flex-1 overflow-y-auto">
                <QuestionSettings />
              </div>
            ) : activeSectionId !== null ? (
              <div className="flex-1 overflow-y-auto">
                <SectionSettings />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center">
                <p className="text-sm" style={{ color: COLOR.TEXT_DISABLED }}>
                  질문을 선택하면
                  <br />
                  설정이 여기에 표시됩니다
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── 하단 중앙 플로팅 바 — ViewToggle + 미리보기 (미리보기는 빌더 탭만) ── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <ViewToggle />
          {pageTab === "builder" && (
            <div
              className="flex items-center gap-0.5 p-1"
              style={{
                backgroundColor: COLOR.BG_BASE,
                boxShadow: SHADOW.AMBIENT,
                border: `1px solid ${COLOR.BORDER_DEFAULT}`,
                borderRadius: 16,
              }}
            >
              <PillIconButton onClick={handlePreview} label="미리보기">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse cx="8" cy="8" rx="7" ry="4.5" />
                  <circle cx="8" cy="8" r="2" />
                </svg>
              </PillIconButton>
            </div>
          )}
        </div>
      </div>

      {/* 설문 메타 편집 모달 */}
      {isMetaOpen && surveyId && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={() => setIsMetaOpen(false)}
          />
          <div
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
            style={{
              width: 540,
              maxHeight: "80vh",
              backgroundColor: COLOR.BG_BASE,
              borderRadius: RADIUS.XL,
              boxShadow: SHADOW.MODAL,
            }}
          >
            {/* 모달 헤더 */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}
            >
              <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_PRIMARY }}>
                설문 정보
              </span>
              <button
                type="button"
                onClick={() => setIsMetaOpen(false)}
                aria-label="닫기"
                className="flex items-center justify-center rounded-lg transition-colors"
                style={{
                  width: 28,
                  height: 28,
                  color: COLOR.TEXT_MUTED,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_PRIMARY)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = COLOR.TEXT_MUTED)
                }
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            {/* 모달 바디 */}
            <div className="flex-1 overflow-y-auto">
              <SurveyMetaPanel
                surveyId={surveyId}
                onSave={saveSurveyMeta}
                onTitleSave={saveSurveyTitle}
              />
            </div>
          </div>
        </>
      )}

      {/* 새 설문 시작 방식 선택 오버레이 */}
      {showOverlay && surveyId && (
        <StartSelectionOverlay
          surveyId={surveyId}
          onSelectManual={handleSelectManual}
          onAnalyzeComplete={handleAnalyzeComplete}
        />
      )}
    </div>
  );
}

function PillIconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Tooltip content={label} position="left">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
        style={{
          color: hovered ? COLOR.TEXT_PRIMARY : COLOR.TEXT_MUTED,
          backgroundColor: hovered ? INTERACTION.HOVER_BG : "transparent",
          border: "none",
          cursor: "pointer",
          transition: `color 120ms, background-color ${INTERACTION.TRANSITION_BG}`,
        }}
      >
        {children}
      </button>
    </Tooltip>
  );
}

// ─── Panel Resize Handle ──────────────────────────────────────────────────────
// 패널 가장자리에 위치하는 드래그 핸들.
// side="right" → 좌측 패널 오른쪽 끝, side="left" → 우측 패널 왼쪽 끝
function PanelResizeHandle({
  side,
  onMouseDown,
}: {
  side: "left" | "right";
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute top-0 bottom-0 w-3 z-20 flex items-center justify-center"
      style={{
        [side === "right" ? "right" : "left"]: -6,
        cursor: "col-resize",
      }}
    >
      {/* 시각적 핸들 바 — hover 시 표시 */}
      <div
        className="w-0.5 h-10 rounded-full transition-opacity duration-150"
        style={{
          backgroundColor: COLOR.ACCENT,
          opacity: hovered ? 0.6 : 0,
        }}
      />
    </div>
  );
}
