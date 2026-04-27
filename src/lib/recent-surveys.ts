// localStorage 기반 최근 본 설문 관리
// 비로그인 사용자 전용 — 로그인 시에는 Supabase 응답 이력 사용

const STORAGE_KEY = "opinion_recent_surveys";
const MAX_ENTRIES = 5;

export interface RecentSurveyEntry {
  id: string;
  title: string;
  viewedAt: string; // ISO string
}

export function getRecentSurveys(): RecentSurveyEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecentSurveyEntry[];
  } catch {
    return [];
  }
}

export function addRecentSurvey(entry: Omit<RecentSurveyEntry, "viewedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentSurveys().filter((s) => s.id !== entry.id);
    const updated: RecentSurveyEntry[] = [
      { ...entry, viewedAt: new Date().toISOString() },
      ...existing,
    ].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage 접근 실패 시 무시
  }
}
