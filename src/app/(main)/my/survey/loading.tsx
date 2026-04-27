import { COLOR, RADIUS } from "@/lib/design-tokens";

function SkeletonBlock({
  height,
  width = "100%",
  borderRadius,
  className = "",
}: {
  height: number;
  width?: number | string;
  borderRadius?: string;
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        height,
        width,
        backgroundColor: COLOR.BG_SECTION,
        borderRadius: borderRadius ?? RADIUS.XL,
      }}
    />
  );
}

function SurveyItemSkeleton() {
  return (
    <li
      className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
      style={{ backgroundColor: COLOR.BG_SURFACE }}
    >
      {/* Thumbnail circle */}
      <div
        className="flex-shrink-0 animate-pulse"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: COLOR.BG_SECTION,
        }}
      />

      {/* Text lines */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <SkeletonBlock height={11} width={80} borderRadius={RADIUS.SM} />
        <SkeletonBlock height={17} width="70%" borderRadius={RADIUS.SM} />
        <SkeletonBlock height={11} width={60} borderRadius={RADIUS.SM} />
      </div>

      {/* Action buttons placeholder */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <SkeletonBlock height={32} width={72} borderRadius={RADIUS.MD} />
        <SkeletonBlock height={32} width={60} borderRadius={RADIUS.MD} />
      </div>
    </li>
  );
}

// Mirrors my/survey/page.tsx: page title → filter tabs → toolbar → list
export default function MySurveyLoading() {
  return (
    <div className="my_surveys_page px-5 py-8 max-w-[800px] mx-auto w-full">
      {/* Page title */}
      <div className="mb-6">
        <SkeletonBlock height={17} width={60} borderRadius={RADIUS.SM} />
      </div>

      {/* Filter tabs skeleton */}
      <div
        className="flex gap-4 mb-4"
        style={{ borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`, paddingBottom: 0 }}
      >
        {[80, 60, 80, 48].map((w, i) => (
          <SkeletonBlock key={i} height={13} width={w} borderRadius={RADIUS.SM} className="mb-3" />
        ))}
      </div>

      {/* Search + sort toolbar skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <SkeletonBlock height={36} className="flex-1" borderRadius={RADIUS.SM} />
        <SkeletonBlock height={36} width={80} borderRadius={RADIUS.SM} />
      </div>

      {/* Survey list skeleton */}
      <ul className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SurveyItemSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
}
