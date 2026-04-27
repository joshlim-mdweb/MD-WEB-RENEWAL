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

// Mirrors the my/page.tsx layout: greeting → 2-col grid (point card col-span-2, participation, surveys)
export default function MyOverviewLoading() {
  return (
    <div className="my_overview_page px-5 py-8 max-w-[800px] mx-auto w-full">
      {/* Greeting skeleton */}
      <div className="mb-8 flex flex-col gap-2">
        <SkeletonBlock height={11} width={60} borderRadius={RADIUS.SM} />
        <SkeletonBlock height={17} width={120} borderRadius={RADIUS.SM} />
        <SkeletonBlock height={11} width={160} borderRadius={RADIUS.SM} />
      </div>

      {/* Summary card grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Point card — full width */}
        <div className="col-span-2">
          <SkeletonBlock height={120} />
        </div>

        {/* Participation card */}
        <SkeletonBlock height={110} />

        {/* My surveys card */}
        <SkeletonBlock height={110} />
      </div>
    </div>
  );
}
