import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Immediately creates a blank draft survey and redirects to the builder canvas.
// The ?new=1 flag triggers the StartSelectionOverlay inside SurveyBuilder.
export default async function NewSurveyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/survey/new");
  }

  const { data: survey, error } = await supabase
    .from("surveys")
    .insert({ title: "새 설문", creator_id: user.id, status: "draft" })
    .select("id")
    .single();

  if (error || !survey) {
    redirect("/");
  }

  redirect(`/survey/${survey.id}/edit?new=1`);
}
