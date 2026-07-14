import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** manual 전용 서버 클라이언트 (untyped — manual_* 테이블은 legacy Database 타입에 없음) */
export async function manualServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            /* RSC에서는 set 불가 — 콜백 라우트가 처리 */
          }
        },
      },
    },
  );
}

export async function getEditorEmail(): Promise<string | null> {
  const supabase = await manualServerClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? null;
  if (!email) return null;
  if (email.endsWith("@clo3d.com")) return email;
  const { data: row } = await supabase
    .from("manual_editors")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  return row ? email : null;
}
