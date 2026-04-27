import { createClient } from "@/lib/supabase/server";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { AccountActions } from "@/components/mypage/AccountActions";
import { formatKoreanDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profile")
    .select("nick_name, status, signup_type")
    .eq("uuid", user.id)
    .maybeSingle();

  const joinDate = user.created_at ? formatKoreanDate(user.created_at) : "—";

  const rows: { label: string; value: string }[] = [
    { label: "이메일", value: user.email ?? "—" },
    { label: "닉네임", value: profile?.nick_name ?? "—" },
    { label: "가입 방식", value: profile?.signup_type ?? "—" },
    {
      label: "계정 상태",
      value: profile?.status === "active" ? "정상" : (profile?.status ?? "—"),
    },
    { label: "가입일", value: joinDate },
  ];

  return (
    <div className="account_settings_page">
      {/* Section header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            ...TYPOGRAPHY.STYLE.TITLE_1,
            color: COLOR.TEXT_PRIMARY,
            marginBottom: "16px",
          }}
        >
          계정 설정
        </h1>
        <div style={{ height: "1px", backgroundColor: COLOR.BORDER_DEFAULT }} />
      </div>

      {/* Account info fields */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "480px",
          marginBottom: "48px",
        }}
      >
        {rows.map((row) => (
          <div key={row.label}>
            <label
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_1,
                color: COLOR.TEXT_SECONDARY,
                marginBottom: "6px",
                display: "block",
              }}
            >
              {row.label}
            </label>
            <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>{row.value}</p>
          </div>
        ))}
      </div>

      {/* Danger zone — logout / withdraw */}
      <div
        style={{
          borderTop: `1px solid ${COLOR.BORDER_DEFAULT}`,
          paddingTop: "32px",
        }}
      >
        <AccountActions userId={user.id} />
      </div>
    </div>
  );
}
