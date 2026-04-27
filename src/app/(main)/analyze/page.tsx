import { redirect } from "next/navigation";

// /analyze → /survey/new (진입점 통일)
export default function AnalyzePage() {
  redirect("/survey/new");
}
