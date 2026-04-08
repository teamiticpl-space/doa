"use client";

import { getFuturePredictions, getRiskLevel, type RiskLevel } from "@/lib/pest-data";
import { ArrowRight, TrendingUp } from "lucide-react";

type Props = {
  plant: string;
  onSelectMonth: (month: number) => void;
};

const riskColors: Record<RiskLevel, string> = {
  none: "from-gray-50 to-gray-50/50 border-gray-200",
  low: "from-emerald-50 to-emerald-50/50 border-emerald-200",
  medium: "from-yellow-50 to-yellow-50/50 border-yellow-200",
  high: "from-orange-50 to-orange-50/50 border-orange-200",
  critical: "from-red-50 to-red-50/50 border-red-200",
};

const riskDotColors: Record<RiskLevel, string> = {
  none: "bg-gray-300",
  low: "bg-emerald-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

const riskLabels: Record<RiskLevel, string> = {
  none: "ปลอดภัย",
  low: "ต่ำ",
  medium: "ปานกลาง",
  high: "สูง",
  critical: "วิกฤต",
};

export function FuturePrediction({ plant, onSelectMonth }: Props) {
  const future = getFuturePredictions(plant, 6);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">พยากรณ์ 6 เดือนข้างหน้า</h3>
      </div>

      <div className="space-y-2">
        {future.map((pred) => {
          const risk = getRiskLevel(pred.total);

          return (
            <button
              key={pred.month}
              onClick={() => onSelectMonth(pred.month)}
              className={`relative z-10 w-full text-left p-3 rounded-xl border bg-gradient-to-r ${riskColors[risk]} transition-all duration-200 hover:scale-[1.02] cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${riskDotColors[risk]} ${pred.isCurrent ? "animate-pulse-glow" : ""}`} />
                  <span className="text-sm font-medium">
                    {pred.monthName}
                    {pred.isCurrent && (
                      <span className="ml-1.5 text-[10px] text-primary font-normal">
                        (เดือนนี้)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    ความเชื่อมั่น {pred.confidence}%
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {pred.total} รายงาน ({pred.avgPerYear}/ปี)
                  </span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  risk === "critical" ? "bg-red-100 text-red-600" :
                  risk === "high" ? "bg-orange-100 text-orange-600" :
                  risk === "medium" ? "bg-yellow-100 text-yellow-600" :
                  risk === "low" ? "bg-emerald-100 text-emerald-600" :
                  "bg-gray-100 text-muted-foreground"
                }`}>
                  {riskLabels[risk]}
                </span>
              </div>

              {pred.problems.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {pred.problems.slice(0, 2).map((p, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-muted-foreground">
                      {p.name.length > 20 ? p.name.slice(0, 20) + "..." : p.name}
                    </span>
                  ))}
                  {pred.problems.length > 2 && (
                    <span className="text-[10px] text-muted-foreground/50">
                      +{pred.problems.length - 2}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
