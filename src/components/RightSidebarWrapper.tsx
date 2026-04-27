"use client";

import { useUIStore } from "@/lib/store/ui";
import RightSidebar from "./RightSidebar";

export default function RightSidebarWrapper() {
  const selectedSurveyId = useUIStore((s) => s.selectedSurveyId);
  const setSelectedSurveyId = useUIStore((s) => s.setSelectedSurveyId);

  return (
    <RightSidebar
      selectedSurveyId={selectedSurveyId}
      onClearSelection={() => setSelectedSurveyId(null)}
    />
  );
}
