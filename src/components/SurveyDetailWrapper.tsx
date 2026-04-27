"use client";

import { useUIStore } from "@/lib/store/ui";
import SurveyDetailColumn from "./SurveyDetailColumn";

export default function SurveyDetailWrapper() {
  const selectedSurveyId = useUIStore((s) => s.selectedSurveyId);
  const setSelectedSurveyId = useUIStore((s) => s.setSelectedSurveyId);

  return (
    <SurveyDetailColumn
      selectedSurveyId={selectedSurveyId}
      onClearSelection={() => setSelectedSurveyId(null)}
    />
  );
}
