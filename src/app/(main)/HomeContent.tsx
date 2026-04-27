"use client";

import { useEffect } from "react";
import { SurveyListClient, type SurveyListItem } from "./SurveyListClient";
import { useUIStore } from "@/lib/store/ui";
import SurveyDetailColumn from "@/components/SurveyDetailColumn";
import MySidebar from "@/components/MySidebar";

export default function HomeContent({ surveys }: { surveys: SurveyListItem[] }) {
  const setSelectedSurveyId = useUIStore((s) => s.setSelectedSurveyId);
  const selectedSurveyId = useUIStore((s) => s.selectedSurveyId);

  // 첫 진입 시 맨 위 설문 자동 선택
  useEffect(() => {
    if (surveys.length > 0 && !selectedSurveyId) {
      setSelectedSurveyId(surveys[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveys]);

  return (
    <>
      {/* 데스크탑 3-column (lg+) */}
      <div className="hidden lg:flex" style={{ alignItems: "flex-start" }}>
        {/* col 1: 페이지 흐름으로 자연 스크롤 */}
        <div className="survey_list_area flex-1 min-w-0 px-4 py-6">
          <SurveyListClient
            surveys={surveys}
            onSurveySelect={setSelectedSurveyId}
            selectedSurveyId={selectedSurveyId}
          />
        </div>

        {/* col 2: sticky 고정 패널 */}
        <div
          className="survey_detail_area overflow-y-auto"
          style={{
            position: "sticky",
            top: 52,
            height: "calc(100vh - 52px)",
            width: 600,
            flexShrink: 0,
            borderLeft: "1px solid rgba(199,200,208,0.3)",
          }}
        >
          <SurveyDetailColumn
            selectedSurveyId={selectedSurveyId}
            onClearSelection={() => setSelectedSurveyId(null)}
          />
        </div>

        {/* col 3: sticky 고정 사이드바 (GNB까지 포함) */}
        <div
          className="my_sidebar_area overflow-y-auto"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: 360,
            flexShrink: 0,
            borderLeft: "1px solid rgba(199,200,208,0.3)",
            marginTop: "-52px",
          }}
        >
          <MySidebar />
        </div>
      </div>

      {/* 모바일 1-column (lg 미만) */}
      <div className="home_content_wrap lg:hidden px-4 py-6">
        <SurveyListClient
          surveys={surveys}
          onSurveySelect={setSelectedSurveyId}
          selectedSurveyId={selectedSurveyId}
        />
      </div>
    </>
  );
}
