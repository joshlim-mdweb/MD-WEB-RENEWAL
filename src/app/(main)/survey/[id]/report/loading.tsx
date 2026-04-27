import { COLOR, RADIUS } from "@/lib/design-tokens";

export default function SurveyReportLoading() {
  const skeletonStyle = { backgroundColor: COLOR.BG_SURFACE };
  const dividerStyle = { borderColor: COLOR.BORDER_DEFAULT };

  return (
    <main className="min-h-screen px-4 py-12" style={{ backgroundColor: COLOR.BG_SURFACE }}>
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        {/* Header card skeleton */}
        <div
          className="px-8 py-7"
          style={{
            backgroundColor: COLOR.BG_BASE,
            border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            borderRadius: RADIUS.XL,
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-2 flex-1">
              <div className="h-3 rounded w-16" style={skeletonStyle} />
              <div className="h-6 rounded w-2/3" style={skeletonStyle} />
              <div className="h-4 rounded w-1/2" style={skeletonStyle} />
            </div>
            <div className="h-6 rounded-full w-20 flex-shrink-0" style={skeletonStyle} />
          </div>
          <div className="flex items-center gap-4 pt-4 border-t" style={dividerStyle}>
            <div className="h-4 rounded w-24" style={skeletonStyle} />
            <div className="h-4 rounded w-32" style={skeletonStyle} />
          </div>
        </div>

        {/* Question card skeletons */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="px-8 py-6 space-y-4"
            style={{
              backgroundColor: COLOR.BG_BASE,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
              borderRadius: RADIUS.XL,
            }}
          >
            {/* Question header */}
            <div className="space-y-1.5">
              <div className="h-3 rounded w-8" style={skeletonStyle} />
              <div className="h-5 rounded w-3/4" style={skeletonStyle} />
            </div>

            {/* Bar chart placeholder */}
            <div className="space-y-2.5 pt-2">
              {[80, 55, 35, 20].map((width) => (
                <div key={width} className="space-y-1">
                  <div className="h-3 rounded w-28" style={skeletonStyle} />
                  <div className="flex items-center gap-3">
                    <div className="h-6 rounded" style={{ ...skeletonStyle, width: `${width}%` }} />
                    <div className="h-3 rounded w-10" style={skeletonStyle} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
