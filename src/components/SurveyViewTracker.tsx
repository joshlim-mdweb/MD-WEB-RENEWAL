"use client";

import { useEffect } from "react";
import { addRecentSurvey } from "@/lib/recent-surveys";

interface Props {
  id: string;
  title: string;
}

// 비로그인 사용자의 최근 본 설문 기록을 localStorage에 저장
export default function SurveyViewTracker({ id, title }: Props) {
  useEffect(() => {
    addRecentSurvey({ id, title });
  }, [id, title]);

  return null;
}
