import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

// service_role 키 사용 — RLS를 우회하므로 절대 클라이언트에 노출 금지.
// webhook 처리 등 서버 사이드 쓰기 전용으로만 사용한다.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
