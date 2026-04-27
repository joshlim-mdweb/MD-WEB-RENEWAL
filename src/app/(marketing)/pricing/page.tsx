import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { COLOR, TYPOGRAPHY, RADIUS, SPACING } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

// ── 플랜 데이터 ───────────────────────────────────────────────────────────────

interface Plan {
  id: string;
  name: string;
  desc: string;
  price: number | null;
  credits: number;
  highlight: boolean;
  available: boolean;
  features: string[];
  unavailable: string[];
  cta: string;
  ctaHref: string | null;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    desc: "누구나 부담 없이 시작",
    price: null,
    credits: 0,
    highlight: false,
    available: true,
    features: ["설문 최대 3개", "설문 응답자 무제한", "기본 결과 확인", "출금 수수료 10%"],
    unavailable: ["AI 설문 자동 생성", "AI 결과 분석", "어뷰저 탐지 & 필터링", "응답자 타겟팅"],
    cta: "무료로 시작하기",
    ctaHref: "/login",
  },
  {
    id: "pro",
    name: "Pro",
    desc: "정기적으로 설문을 운영한다면",
    price: 29000,
    credits: 200,
    highlight: true,
    available: true,
    features: [
      "설문 무제한",
      "설문 응답자 무제한",
      "AI 설문 자동 생성",
      "AI 결과 분석",
      "어뷰저 탐지 & 필터링",
      "결과 CSV 내보내기",
      "출금 수수료 8%",
    ],
    unavailable: ["응답자 타겟팅", "API 접근"],
    cta: "Pro 시작하기",
    ctaHref: "/login",
  },
  {
    id: "max",
    name: "Max",
    desc: "타겟 응답자가 필요한 리서처·기업",
    price: 59000,
    credits: 600,
    highlight: false,
    available: true,
    features: [
      "Pro 모든 기능 포함",
      "응답자 타겟팅 (성별·연령·지역)",
      "AI 크레딧 월 600개",
      "결과 API 접근",
      "출금 수수료 6%",
    ],
    unavailable: [],
    cta: "Max 시작하기",
    ctaHref: "/login",
  },
];

const CREDIT_ACTIONS = [
  { label: "AI 설문 자동 생성", credits: 50 },
  { label: "질문 개선 제안", credits: 15 },
  { label: "결과 분석 요약", credits: 80 },
  { label: "인사이트 생성", credits: 60 },
];

type CompareRow = { feature: string; free: string; pro: string; max: string };

const COMPARE_ROWS: CompareRow[] = [
  { feature: "설문 생성", free: "최대 3개", pro: "무제한", max: "무제한" },
  { feature: "설문 응답자", free: "무제한", pro: "무제한", max: "무제한" },
  { feature: "AI 설문 자동 생성", free: "—", pro: "✓", max: "✓" },
  { feature: "AI 결과 분석", free: "—", pro: "✓", max: "✓" },
  { feature: "AI 크레딧/월", free: "—", pro: "200개", max: "600개" },
  { feature: "어뷰저 탐지 & 필터링", free: "—", pro: "✓", max: "✓" },
  { feature: "결과 CSV 내보내기", free: "—", pro: "✓", max: "✓" },
  { feature: "응답자 타겟팅", free: "—", pro: "—", max: "✓" },
  { feature: "API 접근", free: "—", pro: "—", max: "✓" },
  { feature: "출금 수수료", free: "10%", pro: "8%", max: "6%" },
];

// ── SVG 아이콘 ─────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <circle cx="8" cy="8" r="7" fill={COLOR.POSITIVE_MUTED} />
      <path
        d="M5 8l2 2 4-4"
        stroke={COLOR.POSITIVE}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <circle cx="8" cy="8" r="7" fill={COLOR.BG_SURFACE} />
      <path
        d="M5.5 10.5l5-5M10.5 10.5l-5-5"
        stroke={COLOR.TEXT_DISABLED}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckTableIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill={COLOR.POSITIVE_MUTED} />
      <path
        d="M5 8l2 2 4-4"
        stroke={COLOR.POSITIVE}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}
    >
      <path
        d="M9 2l1.5 4.5L15 8l-4.5 1.5L9 14l-1.5-4.5L3 8l4.5-1.5L9 2z"
        fill={COLOR.ACCENT}
        opacity="0.85"
      />
    </svg>
  );
}

// ── 페이지 ────────────────────────────────────────────────────────────────────

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인한 경우 현재 플랜 조회
  let currentPlan: string | null = null;
  if (user) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    currentPlan = sub?.plan ?? "free";
  }

  return (
    <div className="pricing_page px-5 py-16 max-w-[960px] mx-auto w-full">
      {/* ── 1. 헤더 섹션 ── */}
      <div className="pricing_header_area text-center mb-14">
        {/* 뱃지 */}
        <div className="inline-flex justify-center mb-4">
          <span
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_2,
              backgroundColor: COLOR.ACCENT_BG,
              color: COLOR.ACCENT,
              padding: `${SPACING[1]} ${SPACING[3]}`,
              borderRadius: RADIUS.PILL,
              display: "inline-block",
            }}
          >
            AI 기반 설문 도구
          </span>
        </div>
        {/* 타이틀 */}
        <p
          style={{
            ...TYPOGRAPHY.STYLE.H1,
            color: COLOR.TEXT_PRIMARY,
            marginBottom: SPACING[2],
          }}
        >
          제품에 맞는 플랜을 선택하세요
        </p>
        {/* 부제목 */}
        <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_MUTED }}>
          모든 플랜은 무료로 시작할 수 있어요
        </p>
      </div>

      {/* ── 2. 플랜 카드 ── */}
      <div className="pricing_cards_area grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} currentPlan={currentPlan} isLoggedIn={!!user} />
        ))}
      </div>

      {/* ── 3. 플랜별 기능 비교 ── */}
      <div className="pricing_compare_area mb-14">
        <p className="mb-5" style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>
          플랜 비교
        </p>
        <div
          className="overflow-hidden"
          style={{
            borderRadius: RADIUS.XL,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
          }}
        >
          {/* 헤더 행 */}
          <div
            className="grid grid-cols-4 px-5 py-3"
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
            }}
          >
            <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>기능</span>
            {PLANS.map((p) => (
              <span
                key={p.id}
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  color: p.highlight ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
                  textAlign: "center",
                  fontWeight: p.highlight ? TYPOGRAPHY.WEIGHT.SEMIBOLD : TYPOGRAPHY.WEIGHT.MEDIUM,
                }}
              >
                {p.name}
              </span>
            ))}
          </div>
          {/* 데이터 행 */}
          {COMPARE_ROWS.map((row, i) => (
            <div
              key={row.feature}
              className="grid grid-cols-4 px-5 py-3 items-center"
              style={{
                backgroundColor: COLOR.BG_BASE,
                borderBottom:
                  i < COMPARE_ROWS.length - 1 ? `1px solid ${COLOR.BORDER_DEFAULT}` : undefined,
              }}
            >
              <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_PRIMARY }}>
                {row.feature}
              </span>
              {[row.free, row.pro, row.max].map((val, idx) => (
                <span
                  key={idx}
                  className="flex justify-center items-center"
                  style={{
                    ...TYPOGRAPHY.STYLE.BODY_2,
                    color: val === "—" ? COLOR.TEXT_DISABLED : COLOR.TEXT_SECONDARY,
                    textAlign: "center",
                  }}
                >
                  {val === "✓" ? <CheckTableIcon /> : val}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. 크레딧 섹션 ── */}
      <div className="pricing_credits_area">
        <p className="mb-5" style={{ ...TYPOGRAPHY.STYLE.H3, color: COLOR.TEXT_PRIMARY }}>
          <SparkleIcon />
          AI 크레딧이란?
        </p>
        <div
          className="px-6 py-6"
          style={{
            backgroundColor: COLOR.BG_SURFACE,
            borderRadius: RADIUS["2XL"],
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
          }}
        >
          <p className="mb-5" style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_SECONDARY }}>
            AI 기능을 사용할 때마다 크레딧이 차감돼요. Pro는 월 200개, Max는 월 600개가 제공돼요.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {CREDIT_ACTIONS.map((action) => (
              <div
                key={action.label}
                className="px-4 py-4 rounded-xl"
                style={{
                  backgroundColor: COLOR.BG_BASE,
                  border: `1px solid ${COLOR.BORDER_DEFAULT}`,
                }}
              >
                <p
                  style={{
                    ...TYPOGRAPHY.STYLE.LABEL_2,
                    color: COLOR.TEXT_MUTED,
                    marginBottom: SPACING[2],
                  }}
                >
                  {action.label}
                </p>
                <p style={{ ...TYPOGRAPHY.STYLE.TITLE_1, color: COLOR.TEXT_PRIMARY }}>
                  {action.credits}
                  <span
                    style={{
                      ...TYPOGRAPHY.STYLE.LABEL_2,
                      color: COLOR.TEXT_MUTED,
                      marginLeft: SPACING[1],
                    }}
                  >
                    크레딧
                  </span>
                </p>
              </div>
            ))}
          </div>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
            크레딧이 부족하면 추가 구매할 수 있어요.{" "}
            <span style={{ color: COLOR.TEXT_SECONDARY, fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM }}>
              100 크레딧 = 2,900원
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 플랜 카드 컴포넌트 ─────────────────────────────────────────────────────────

function PlanCard({
  plan,
  currentPlan,
  isLoggedIn,
}: {
  plan: Plan;
  currentPlan: string | null;
  isLoggedIn: boolean;
}) {
  const isCurrent = currentPlan === plan.id;
  const isDisabled = !plan.available;

  return (
    <div
      className="plan_card_wrap flex flex-col relative"
      style={{
        backgroundColor: COLOR.BG_BASE,
        borderRadius: RADIUS.XL,
        border: plan.highlight ? `2px solid ${COLOR.ACCENT}` : `1px solid ${COLOR.BORDER_DEFAULT}`,
        opacity: isDisabled ? 0.55 : 1,
        overflow: "hidden",
      }}
    >
      {/* Pro 상단 accent 라인 */}
      {plan.highlight && (
        <div
          style={{
            height: 3,
            backgroundColor: COLOR.ACCENT,
            borderRadius: `${RADIUS.XL} ${RADIUS.XL} 0 0`,
          }}
        />
      )}

      {/* 인기 뱃지 (Pro) */}
      {plan.highlight && (
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: COLOR.ACCENT,
            color: COLOR.TEXT_INVERSE,
            padding: `2px ${SPACING[3]}`,
            borderRadius: `0 0 ${RADIUS.SM} ${RADIUS.SM}`,
            ...TYPOGRAPHY.STYLE.LABEL_2,
            whiteSpace: "nowrap",
          }}
        >
          인기
        </div>
      )}

      {/* 준비 중 뱃지 */}
      {isDisabled && (
        <div
          className="absolute top-4 right-4 px-2 py-1"
          style={{
            backgroundColor: COLOR.BG_SURFACE,
            borderRadius: RADIUS.SM,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
          }}
        >
          <span style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_DISABLED }}>준비 중</span>
        </div>
      )}

      <div
        className="flex flex-col flex-1 px-5 py-6"
        style={{ paddingTop: plan.highlight ? SPACING[6] : SPACING[6] }}
      >
        {/* 플랜명 + 설명 */}
        <div className="mb-5">
          <p
            style={{
              ...TYPOGRAPHY.STYLE.TITLE_1,
              color: COLOR.TEXT_PRIMARY,
              marginBottom: SPACING[1],
            }}
          >
            {plan.name}
          </p>
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>{plan.desc}</p>
        </div>

        {/* 가격 */}
        <div className="mb-5 pb-5" style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}` }}>
          {plan.price === null ? (
            <p style={{ ...TYPOGRAPHY.STYLE.DISPLAY, color: COLOR.TEXT_PRIMARY }}>무료</p>
          ) : (
            <p className="flex items-baseline gap-1">
              <span style={{ ...TYPOGRAPHY.STYLE.DISPLAY, color: COLOR.TEXT_PRIMARY }}>
                {plan.price.toLocaleString("ko-KR")}
              </span>
              <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>원 / 월</span>
            </p>
          )}
        </div>

        {/* 기능 목록 */}
        <div className="flex-1 mb-6">
          <ul className="flex flex-col gap-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckIcon />
                <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_PRIMARY }}>{f}</span>
              </li>
            ))}
            {plan.unavailable.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CrossIcon />
                <span style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_DISABLED }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA 버튼 */}
        {isCurrent ? (
          <div
            className="w-full py-3 text-center"
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              borderRadius: RADIUS.LG,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            }}
          >
            <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}>현재 플랜</span>
          </div>
        ) : isDisabled ? (
          <div
            className="w-full py-3 text-center"
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              borderRadius: RADIUS.LG,
            }}
          >
            <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_DISABLED }}>
              {plan.cta}
            </span>
          </div>
        ) : plan.highlight ? (
          <Link
            href={
              isLoggedIn && plan.id !== "free"
                ? `/checkout?plan=${plan.id}`
                : (plan.ctaHref ?? "/login")
            }
            className="w-full py-3 text-center block transition-opacity hover:opacity-90"
            style={{
              backgroundColor: COLOR.ACCENT,
              color: COLOR.TEXT_INVERSE,
              ...TYPOGRAPHY.STYLE.LABEL_1,
              textDecoration: "none",
              borderRadius: RADIUS.LG,
            }}
          >
            {plan.cta}
          </Link>
        ) : (
          <Link
            href={
              isLoggedIn && plan.id !== "free"
                ? `/checkout?plan=${plan.id}`
                : (plan.ctaHref ?? "/login")
            }
            className="w-full py-3 text-center block transition-colors hover:opacity-80"
            style={{
              backgroundColor: COLOR.BG_BASE,
              color: COLOR.TEXT_PRIMARY,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              ...TYPOGRAPHY.STYLE.LABEL_1,
              textDecoration: "none",
              borderRadius: RADIUS.LG,
            }}
          >
            {plan.cta}
          </Link>
        )}
      </div>
    </div>
  );
}
