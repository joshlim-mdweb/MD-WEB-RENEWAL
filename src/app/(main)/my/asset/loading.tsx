import { COLOR } from "@/lib/design-tokens";

// Skeleton block used for each card — pulse animation indicates loading state
function SkeletonBlock({ height, className = "" }: { height: number; className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl ${className}`}
      style={{
        height,
        backgroundColor: COLOR.BG_SECTION,
        border: `1px solid ${COLOR.BORDER_DEFAULT}`,
      }}
    />
  );
}

export default function AssetLoading() {
  return (
    <div className="asset_page px-8 py-8 max-w-2xl">
      {/* Account Summary skeleton */}
      <section className="asset_account_summary mb-6">
        <SkeletonBlock height={160} />
      </section>

      {/* 2-col Available + Spending cards skeleton */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <SkeletonBlock height={140} />
        <SkeletonBlock height={140} />
      </div>

      {/* Monthly Summary skeleton */}
      <SkeletonBlock height={180} />
    </div>
  );
}
