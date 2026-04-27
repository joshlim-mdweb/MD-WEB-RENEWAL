import { create } from "zustand";

interface UIState {
  selectedSurveyId: string | null;
  setSelectedSurveyId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedSurveyId: null,
  setSelectedSurveyId: (id) => set({ selectedSurveyId: id }),
}));
