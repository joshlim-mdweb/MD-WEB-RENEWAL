import { create } from "zustand";
import {
  Question,
  QuestionConfig,
  QuestionType,
  RewardType,
  Section,
  SurveyPurpose,
  SurveyStatus,
  TargetParticipantCount,
} from "@/lib/types/survey";

export type BuilderView = "list" | "flow";
export type PageTab = "builder" | "responses" | "analysis";

interface BuilderState {
  // Survey metadata
  surveyId: string | null;
  surveyTitle: string;
  surveyDescription: string;
  surveyStatus: SurveyStatus;
  surveyPurpose: SurveyPurpose | null;
  surveyEndDate: string | null;
  surveyMaxParticipants: number | null;
  surveyEstimatedTime: number | null;
  surveyRewardAmount: number | null;
  surveyRewardType: RewardType;
  surveyRewardWinnerCount: number | null;
  surveyTargetParticipantCount: TargetParticipantCount | null;
  surveyThumbnailUrl: string | null;
  surveyMaxResponses: number | null;
  surveyTags: string[] | null;
  // Tracks how many responses exist — used to gate destructive edits
  responseCount: number;

  // Questions
  questions: Question[];
  activeQuestionId: string | null;

  // Optimistic UI — IDs of questions added optimistically (before API confirms)
  // Used to trigger auto-focus on the newly-added card.
  newlyAddedQuestionId: string | null;

  // Sections — empty array means the survey has no sections (flat question list)
  sections: Section[];
  activeSectionId: string | null;

  // UI state
  view: BuilderView;
  pageTab: PageTab;
  flowDirection: "vertical" | "horizontal";
  flowCardMode: "compact" | "expanded";
  secGap: number;
  isLeftPanelOpen: boolean;
  isSaving: boolean;

  // Keyboard clipboard — holds a question copied via Cmd+C.
  // conditionalRules are stripped on copy (they reference IDs that no longer apply to the paste target).
  clipboardQuestion: Question | null;
  setClipboardQuestion: (question: Question | null) => void;

  // Keyboard-triggered delete — when set, the QuestionCard with this ID auto-opens its delete modal.
  // Cleared by the card itself after the modal is opened (or dismissed).
  pendingDeleteQuestionId: string | null;
  setPendingDeleteQuestionId: (id: string | null) => void;

  // Validation — question IDs that have issues (shown as red dots in left panel)
  validationErrors: string[];
  setValidationErrors: (ids: string[]) => void;

  // Save state — tracked separately from isSaving to support auto-save UX
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;

  // Survey actions
  initSurvey: (survey: {
    id: string;
    title: string;
    description: string | null;
    status: SurveyStatus;
    purpose?: SurveyPurpose | null;
    end_date?: string | null;
    max_participants?: number | null;
    estimated_time?: number | null;
    reward_amount?: number | null;
    reward_type?: RewardType | null;
    reward_winner_count?: number | null;
    target_participant_count?: TargetParticipantCount | null;
    thumbnail_url?: string | null;
    max_responses?: number | null;
    tags?: string[] | null;
    questions: Question[];
    sections?: Section[];
    responseCount?: number;
  }) => void;
  setSurveyTitle: (title: string) => void;
  setSurveyDescription: (description: string) => void;
  setSurveyStatus: (status: SurveyStatus) => void;
  setSurveyPurpose: (purpose: SurveyPurpose | null) => void;
  setSurveyEndDate: (date: string | null) => void;
  setSurveyMaxParticipants: (n: number | null) => void;
  setSurveyEstimatedTime: (mins: number | null) => void;
  setSurveyRewardAmount: (amount: number | null) => void;
  setSurveyRewardType: (type: RewardType) => void;
  setSurveyRewardWinnerCount: (count: number | null) => void;
  setSurveyTargetParticipantCount: (count: TargetParticipantCount | null) => void;
  setSurveyThumbnailUrl: (url: string | null) => void;
  setSurveyMaxResponses: (n: number | null) => void;
  setSurveyTags: (tags: string[] | null) => void;

  // Question actions
  setActiveQuestion: (questionId: string | null) => void;
  addQuestion: (question: Question) => void;
  insertQuestionAfter: (afterQuestionId: string, question: Question) => void;
  updateQuestion: (questionId: string, patch: Partial<Question>) => void;
  removeQuestion: (questionId: string) => void;
  reorderQuestions: (orderedIds: string[]) => void;

  // Optimistic UI actions — temp ID flow: addQuestionOptimistic → confirmQuestion / rollbackQuestion
  addQuestionOptimistic: (tempId: string, question: Question) => void;
  confirmQuestion: (tempId: string, realQuestion: Question) => void;
  rollbackQuestion: (tempId: string) => void;
  setNewlyAddedQuestionId: (id: string | null) => void;

  // Per-field helpers (used by editors to avoid full question patches)
  updateQuestionTitle: (questionId: string, title: string) => void;
  updateQuestionOptions: (questionId: string, options: string[]) => void;
  updateQuestionConfig: (questionId: string, config: QuestionConfig) => void;
  updateQuestionRequired: (questionId: string, required: boolean) => void;
  updateQuestionType: (questionId: string, type: QuestionType) => void;

  // Section actions
  addSection: (section: Section) => void;
  insertSectionAfter: (afterSectionId: string, section: Section) => void;
  updateSection: (sectionId: string, patch: Partial<Section>) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (orderedIds: string[]) => void;
  setActiveSection: (sectionId: string | null) => void;

  // UI actions
  setView: (view: BuilderView) => void;
  setPageTab: (tab: PageTab) => void;
  setFlowDirection: (dir: "vertical" | "horizontal") => void;
  setFlowCardMode: (mode: "compact" | "expanded") => void;
  setSecGap: (updater: (prev: number) => number) => void;
  toggleLeftPanel: () => void;
  setIsSaving: (isSaving: boolean) => void;
  setLastSavedAt: (date: Date) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  // Clears both question and section focus — puts the builder into IDLE state
  clearSelection: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  surveyId: null,
  surveyTitle: "Untitled Survey",
  surveyDescription: "",
  surveyStatus: "draft",
  surveyPurpose: null,
  surveyEndDate: null,
  surveyMaxParticipants: null,
  surveyEstimatedTime: null,
  surveyRewardAmount: null,
  surveyRewardType: "none",
  surveyRewardWinnerCount: null,
  surveyTargetParticipantCount: null,
  surveyThumbnailUrl: null,
  surveyMaxResponses: null,
  surveyTags: null,
  responseCount: 0,
  questions: [],
  activeQuestionId: null,
  newlyAddedQuestionId: null,
  sections: [],
  activeSectionId: null,
  view: "list",
  pageTab: "builder",
  flowDirection: "vertical",
  flowCardMode: "compact",
  secGap: 80,
  isLeftPanelOpen: true,
  isSaving: false,
  clipboardQuestion: null,
  pendingDeleteQuestionId: null,
  lastSavedAt: null,
  hasUnsavedChanges: false,
  validationErrors: [],

  initSurvey: (survey) =>
    set({
      surveyId: survey.id,
      surveyTitle: survey.title,
      surveyDescription: survey.description ?? "",
      surveyStatus: survey.status as SurveyStatus,
      surveyPurpose: survey.purpose ?? null,
      surveyEndDate: survey.end_date ?? null,
      surveyMaxParticipants: survey.max_participants ?? null,
      surveyEstimatedTime: survey.estimated_time ?? null,
      surveyRewardAmount: survey.reward_amount ?? null,
      surveyRewardType: survey.reward_type ?? "none",
      surveyRewardWinnerCount: survey.reward_winner_count ?? null,
      surveyTargetParticipantCount: survey.target_participant_count ?? null,
      surveyThumbnailUrl: survey.thumbnail_url ?? null,
      surveyMaxResponses: survey.max_responses ?? null,
      surveyTags: survey.tags ?? null,
      responseCount: survey.responseCount ?? 0,
      questions: survey.questions,
      sections: survey.sections ?? [],
      activeQuestionId: survey.questions[0]?.id ?? null,
      activeSectionId: survey.sections?.[0]?.id ?? null,
      // Reset save state on init — content is fresh from the server
      lastSavedAt: null,
      hasUnsavedChanges: false,
    }),

  setSurveyTitle: (title) => set({ surveyTitle: title, hasUnsavedChanges: true }),
  setSurveyDescription: (description) =>
    set({ surveyDescription: description, hasUnsavedChanges: true }),
  setSurveyStatus: (status) => set({ surveyStatus: status }),
  setSurveyPurpose: (purpose) => set({ surveyPurpose: purpose, hasUnsavedChanges: true }),
  setSurveyEndDate: (date) => set({ surveyEndDate: date, hasUnsavedChanges: true }),
  setSurveyMaxParticipants: (n) => set({ surveyMaxParticipants: n, hasUnsavedChanges: true }),
  setSurveyEstimatedTime: (mins) => set({ surveyEstimatedTime: mins, hasUnsavedChanges: true }),
  setSurveyRewardAmount: (amount) => set({ surveyRewardAmount: amount, hasUnsavedChanges: true }),
  setSurveyRewardType: (type) => set({ surveyRewardType: type, hasUnsavedChanges: true }),
  setSurveyRewardWinnerCount: (count) =>
    set({ surveyRewardWinnerCount: count, hasUnsavedChanges: true }),
  setSurveyTargetParticipantCount: (count) =>
    set({ surveyTargetParticipantCount: count, hasUnsavedChanges: true }),
  setSurveyThumbnailUrl: (url) => set({ surveyThumbnailUrl: url, hasUnsavedChanges: true }),
  setSurveyMaxResponses: (n) => set({ surveyMaxResponses: n, hasUnsavedChanges: true }),
  setSurveyTags: (tags) => set({ surveyTags: tags, hasUnsavedChanges: true }),

  setActiveQuestion: (questionId) => set({ activeQuestionId: questionId }),

  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
      activeQuestionId: question.id,
      hasUnsavedChanges: true,
    })),

  insertQuestionAfter: (afterQuestionId, question) =>
    set((state) => {
      const insertIndex = state.questions.findIndex((q) => q.id === afterQuestionId);
      // If the source question isn't found, fall back to appending at the end
      const spliceIndex = insertIndex === -1 ? state.questions.length : insertIndex + 1;
      const updated = [...state.questions];
      updated.splice(spliceIndex, 0, question);
      return { questions: updated, activeQuestionId: question.id, hasUnsavedChanges: true };
    }),

  updateQuestion: (questionId, patch) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === questionId ? { ...q, ...patch } : q)),
      hasUnsavedChanges: true,
    })),

  removeQuestion: (questionId) =>
    set((state) => {
      const deletedIndex = state.questions.findIndex((q) => q.id === questionId);
      const remaining = state.questions.filter((q) => q.id !== questionId);
      const wasActive = state.activeQuestionId === questionId;
      // Prefer the question that slides into the same position (next sibling),
      // fall back to the previous sibling — avoids always jumping to the top.
      const nextActive = wasActive
        ? (remaining[deletedIndex] ?? remaining[deletedIndex - 1] ?? null)
        : (state.questions.find((q) => q.id === state.activeQuestionId) ?? null);
      return {
        questions: remaining,
        activeQuestionId: nextActive?.id ?? null,
        hasUnsavedChanges: true,
      };
    }),

  reorderQuestions: (orderedIds) =>
    set((state) => {
      const questionMap = new Map(state.questions.map((q) => [q.id, q]));
      const reordered = orderedIds
        .map((id, index) => {
          const q = questionMap.get(id);
          return q ? { ...q, order_index: index } : null;
        })
        .filter((q): q is Question => q !== null);
      return { questions: reordered, hasUnsavedChanges: true };
    }),

  // Optimistic add: immediately inserts a question with a temp ID so the card
  // renders before the API responds. newlyAddedQuestionId triggers auto-focus.
  addQuestionOptimistic: (tempId, question) =>
    set((state) => ({
      questions: [...state.questions, question],
      activeQuestionId: tempId,
      newlyAddedQuestionId: tempId,
      hasUnsavedChanges: true,
    })),

  // Confirm: swaps the temp ID for the real server-assigned ID.
  confirmQuestion: (tempId, realQuestion) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === tempId ? realQuestion : q)),
      activeQuestionId:
        state.activeQuestionId === tempId ? realQuestion.id : state.activeQuestionId,
      newlyAddedQuestionId:
        state.newlyAddedQuestionId === tempId ? realQuestion.id : state.newlyAddedQuestionId,
    })),

  // Rollback: removes the optimistically-added question on API failure.
  rollbackQuestion: (tempId) =>
    set((state) => {
      const remaining = state.questions.filter((q) => q.id !== tempId);
      return {
        questions: remaining,
        activeQuestionId:
          state.activeQuestionId === tempId
            ? (remaining[remaining.length - 1]?.id ?? null)
            : state.activeQuestionId,
        newlyAddedQuestionId:
          state.newlyAddedQuestionId === tempId ? null : state.newlyAddedQuestionId,
      };
    }),

  setNewlyAddedQuestionId: (id) => set({ newlyAddedQuestionId: id }),

  updateQuestionTitle: (questionId, title) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === questionId ? { ...q, title } : q)),
      hasUnsavedChanges: true,
    })),

  updateQuestionOptions: (questionId, options) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === questionId ? { ...q, options } : q)),
      hasUnsavedChanges: true,
    })),

  updateQuestionConfig: (questionId, config) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === questionId ? { ...q, config } : q)),
      hasUnsavedChanges: true,
    })),

  updateQuestionRequired: (questionId, required) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === questionId ? { ...q, required } : q)),
      hasUnsavedChanges: true,
    })),

  updateQuestionType: (questionId, type) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        // Reset options and config when type changes to avoid stale data
        q.id === questionId ? { ...q, type, options: null, config: null } : q
      ),
      hasUnsavedChanges: true,
    })),

  // Section actions

  addSection: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
      activeSectionId: section.id,
      hasUnsavedChanges: true,
    })),

  insertSectionAfter: (afterSectionId, section) =>
    set((state) => {
      const afterIndex = state.sections.findIndex((s) => s.id === afterSectionId);
      const spliceIndex = afterIndex === -1 ? state.sections.length : afterIndex + 1;
      const updated = [...state.sections];
      updated.splice(spliceIndex, 0, section);
      return { sections: updated, activeSectionId: section.id, hasUnsavedChanges: true };
    }),

  updateSection: (sectionId, patch) =>
    set((state) => ({
      sections: state.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
      hasUnsavedChanges: true,
    })),

  removeSection: (sectionId) =>
    set((state) => {
      const remaining = state.sections.filter((s) => s.id !== sectionId);
      const wasActive = state.activeSectionId === sectionId;
      // Delete child questions — the API cascade already removed them from DB
      const remainingQuestions = state.questions.filter((q) => q.section_id !== sectionId);
      const activeQuestionWasDeleted = state.questions
        .filter((q) => q.section_id === sectionId)
        .some((q) => q.id === state.activeQuestionId);
      return {
        sections: remaining,
        activeSectionId: wasActive ? (remaining[0]?.id ?? null) : state.activeSectionId,
        questions: remainingQuestions,
        activeQuestionId: activeQuestionWasDeleted
          ? (remainingQuestions[0]?.id ?? null)
          : state.activeQuestionId,
        hasUnsavedChanges: true,
      };
    }),

  reorderSections: (orderedIds) =>
    set((state) => {
      const sectionMap = new Map(state.sections.map((s) => [s.id, s]));
      const reordered = orderedIds
        .map((id, index) => {
          const s = sectionMap.get(id);
          return s ? { ...s, order_index: index } : null;
        })
        .filter((s): s is Section => s !== null);
      return { sections: reordered, hasUnsavedChanges: true };
    }),

  setActiveSection: (sectionId) => set({ activeSectionId: sectionId }),

  clearSelection: () => set({ activeQuestionId: null, activeSectionId: null }),

  setView: (view) => set({ view }),
  setPageTab: (tab) => set({ pageTab: tab }),
  setFlowDirection: (dir) => set({ flowDirection: dir }),
  setFlowCardMode: (mode) => set({ flowCardMode: mode }),
  setSecGap: (updater) => set((state) => ({ secGap: updater(state.secGap) })),
  toggleLeftPanel: () => set((state) => ({ isLeftPanelOpen: !state.isLeftPanelOpen })),
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),
  setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
  setValidationErrors: (ids) => set({ validationErrors: ids }),
  setClipboardQuestion: (question) => set({ clipboardQuestion: question }),
  setPendingDeleteQuestionId: (id) => set({ pendingDeleteQuestionId: id }),
}));
