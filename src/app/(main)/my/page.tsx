import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { COLOR, TYPOGRAPHY, RADIUS, SPACING } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function MyOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthIso = monthStart.toISOString();

  const [ledgerRes, surveysRes, pollResRes, surveyResRes, profileRes] = await Promise.all([
    supabase.from("point_ledger").select("amount, status").eq("user_id", user.id),
    supabase.from("surveys").select("id, status").eq("creator_id", user.id),
    supabase
      .from("poll_responses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthIso),
    supabase
      .from("responses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthIso),
    supabase.from("profile").select("nick_name").eq("uuid", user.id).maybeSingle(),
  ]);

  let available = 0;
  let pending = 0;
  for (const row of ledgerRes.data ?? []) {
    if (row.status === "available") available += row.amount;
    if (row.status === "pending") pending += row.amount;
  }

  const surveys = surveysRes.data ?? [];
  const publishedCount = surveys.filter((s) => s.status === "published").length;
  const draftCount = surveys.filter((s) => s.status === "draft").length;
  const closedCount = surveys.filter(
    (s) => s.status === "closed" || s.status === "archived"
  ).length;

  const pollThisMonth = pollResRes.count ?? 0;
  const surveyThisMonth = surveyResRes.count ?? 0;

  const displayName = profileRes.data?.nick_name ?? user.email?.split("@")[0] ?? "사용자";
  const email = user.email ?? "";

  // AI 크레딧 — 테이블 없으면 0 fallback
  let aiCredits = 0;
  try {
    const { data } = await (
      supabase.from("ai_credits" as never) as ReturnType<typeof supabase.from>
    )
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();
    aiCredits = (data as { balance: number } | null)?.balance ?? 0;
  } catch {
    aiCredits = 0;
  }

  return (
    <div
      className="my_overview_page"
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: SPACING[8] }}
    >
      {/* ── 계정 ── */}
      <InfoSection title="계정" actionHref="/my/account" actionLabel="설정">
        <InfoCard>
          <InfoRow label="플랜" value="Starter" />
          <InfoRow label="이메일" value={email} />
          <InfoRow label="닉네임" value={displayName} />
        </InfoCard>
      </InfoSection>

      {/* ── 포인트 ── */}
      <InfoSection title="포인트" actionHref="/my/point" actionLabel="내역 보기">
        <InfoCard>
          <InfoRow
            label="사용 가능"
            value={`${available.toLocaleString("ko-KR")}P`}
            valueColor={available > 0 ? COLOR.ACCENT : undefined}
          />
          <InfoRow
            label="검토 중"
            value={`${pending.toLocaleString("ko-KR")}P`}
            valueColor={COLOR.TEXT_MUTED}
          />
        </InfoCard>
      </InfoSection>

      {/* ── AI 크레딧 ── */}
      <InfoSection title="AI 크레딧" actionHref="/pricing" actionLabel="플랜 보기">
        <InfoCard>
          <InfoRow label="잔량" value={`${aiCredits}개`} />
          <InfoRow
            label="월 기본 제공"
            value="Pro 이상 플랜에서 사용할 수 있어요"
            valueColor={COLOR.TEXT_MUTED}
          />
        </InfoCard>
      </InfoSection>

      {/* ── 이번 달 활동 ── */}
      <InfoSection title="이번 달 활동" actionHref="/my/history" actionLabel="전체 보기">
        <InfoCard>
          <InfoRow label="설문 참여" value={`${surveyThisMonth}회`} />
          <InfoRow label="폴 참여" value={`${pollThisMonth}회`} />
        </InfoCard>
      </InfoSection>

      {/* ── 내 설문 ── */}
      <InfoSection title="내 설문" actionHref="/my/survey" actionLabel="전체 보기">
        <InfoCard>
          <InfoRow
            label="진행 중"
            value={`${publishedCount}개`}
            valueColor={publishedCount > 0 ? COLOR.ACCENT : undefined}
          />
          <InfoRow label="임시저장" value={`${draftCount}개`} />
          <InfoRow label="종료" value={`${closedCount}개`} valueColor={COLOR.TEXT_MUTED} />
        </InfoCard>
      </InfoSection>
    </div>
  );
}

// ── 섹션 컴포넌트 ──────────────────────────────────────────────────────────────

function InfoSection({
  title,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="info_section_wrap">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: SPACING[3],
        }}
      >
        <p style={{ ...TYPOGRAPHY.STYLE.TITLE_1, color: COLOR.TEXT_PRIMARY }}>{title}</p>
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              color: COLOR.TEXT_MUTED,
              textDecoration: "none",
            }}
          >
            {actionLabel}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="info_card_wrap"
      style={{
        backgroundColor: COLOR.BG_BASE,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
        borderRadius: RADIUS.XL,
        padding: `${SPACING[4]} ${SPACING[5]}`,
        display: "flex",
        flexDirection: "column",
        gap: SPACING[4],
      }}
    >
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span
        style={{
          ...TYPOGRAPHY.STYLE.BODY_2,
          color: COLOR.TEXT_MUTED,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          ...TYPOGRAPHY.STYLE.BODY_2,
          color: valueColor ?? COLOR.TEXT_PRIMARY,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}
