"use client";

import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

export interface DistributionItem {
  value: string;
  count: number;
  percentage: number;
}

interface AnalysisBarChartProps {
  distribution: DistributionItem[];
  // When true the first bar (highest count) is highlighted with ACCENT color
  highlightTop?: boolean;
  // Total respondents in the base (for "전체 대비" delta calculation)
  baseDistribution?: DistributionItem[];
}

export function AnalysisBarChart({
  distribution,
  highlightTop = true,
  baseDistribution,
}: AnalysisBarChartProps) {
  if (distribution.length === 0) {
    return <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>응답이 없어요.</p>;
  }

  // Build base percentage lookup for delta badges
  const baseMap = new Map<string, number>(
    baseDistribution?.map((d) => [d.value, d.percentage]) ?? []
  );

  return (
    <ul className="analysis_bar_wrap space-y-3" role="list">
      {distribution.map((item, idx) => {
        const isTop = highlightTop && idx === 0;
        const barColor = isTop ? COLOR.ACCENT : COLOR.BORDER_STRONG;
        const delta =
          baseDistribution && baseMap.has(item.value)
            ? Math.round((item.percentage - baseMap.get(item.value)!) * 10) / 10
            : null;

        return (
          <li
            key={item.value}
            className="analysis_bar_item_wrap"
            aria-label={`${item.value}: ${item.count}명, ${item.percentage}%`}
          >
            {/* Label row */}
            <div className="flex items-center justify-between mb-1 gap-2">
              <span
                className="truncate"
                style={{
                  ...TYPOGRAPHY.STYLE.BODY_2,
                  fontWeight: isTop ? "600" : "400",
                  color: isTop ? COLOR.TEXT_PRIMARY : COLOR.TEXT_SECONDARY,
                }}
              >
                {item.value}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Delta badge */}
                {delta !== null && delta !== 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full"
                    style={{
                      ...TYPOGRAPHY.STYLE.LABEL_2,
                      backgroundColor: delta > 0 ? "#e6f6ef" : "#feecec",
                      color: delta > 0 ? COLOR.POSITIVE : COLOR.NEGATIVE,
                    }}
                  >
                    {delta > 0 ? `+${delta}%p` : `${delta}%p`}
                  </span>
                )}
                <span
                  className="tabular-nums"
                  style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.TEXT_MUTED }}
                >
                  {item.count.toLocaleString()}명 ({item.percentage}%)
                </span>
              </div>
            </div>

            {/* Bar track */}
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: COLOR.BG_SECTION }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(item.percentage, 100)}%`,
                  backgroundColor: barColor,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
