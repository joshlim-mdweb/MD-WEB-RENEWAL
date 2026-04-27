export default function SurveyRespondLoading() {
  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-12">
      <div className="border border-[#e5e5e5] rounded-2xl w-full max-w-2xl shadow-sm overflow-hidden animate-pulse">
        {/* Survey header skeleton */}
        <div className="px-8 pt-8 pb-6 border-b border-[#f0f0f0] space-y-3">
          <div className="h-6 bg-[#f0f0f0] rounded w-2/3" />
          <div className="h-4 bg-[#f0f0f0] rounded w-full" />
          <div className="h-4 bg-[#f0f0f0] rounded w-4/5" />
        </div>

        {/* Question skeletons */}
        <div className="px-8 py-6 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-3 bg-[#f0f0f0] rounded w-8" />
              <div className="h-5 bg-[#f0f0f0] rounded w-3/4" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-11 bg-[#f7f7f7] rounded-lg border border-[#f0f0f0]" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit button skeleton */}
        <div className="px-8 pb-8">
          <div className="h-12 bg-[#f0f0f0] rounded-xl" />
        </div>
      </div>
    </main>
  );
}
