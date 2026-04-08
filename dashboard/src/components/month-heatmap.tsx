"use client";

import { getPlantPredictions, getRiskLevel, THAI_MONTHS_SHORT } from "@/lib/pest-data";

type Props = {
  plant: string;
  selectedMonth: number | null;
  onSelectMonth: (month: number) => void;
};

const riskGlow = {
  none: "",
  low: "glow-green",
  medium: "",
  high: "glow-orange",
  critical: "glow-red",
};

const riskBorder = {
  none: "border-gray-200",
  low: "border-emerald-300",
  medium: "border-yellow-300",
  high: "border-orange-300",
  critical: "border-red-300",
};

const riskBg = {
  none: "bg-gray-50",
  low: "bg-emerald-50",
  medium: "bg-yellow-50",
  high: "bg-orange-50",
  critical: "bg-red-50",
};

const riskDot = {
  none: "bg-gray-300",
  low: "bg-emerald-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

const riskText = {
  none: "text-muted-foreground/50",
  low: "text-emerald-600",
  medium: "text-yellow-600",
  high: "text-orange-600",
  critical: "text-red-600",
};

export function MonthHeatmap({ plant, selectedMonth, onSelectMonth }: Props) {
  const monthData = getPlantPredictions(plant);
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
      {monthData.map((m) => {
        const risk = getRiskLevel(m.total);
        const isSelected = selectedMonth === m.month;
        const isCurrent = currentMonth === m.month;

        return (
          <button
            key={m.month}
            onClick={() => onSelectMonth(m.month)}
            className={`relative flex flex-col items-center p-3 rounded-xl border transition-all duration-200 cursor-pointer
              ${isSelected
                ? "ring-2 ring-primary border-primary/50 scale-105 glass-strong glow-blue"
                : `${riskBg[risk]} ${riskBorder[risk]} hover:scale-105 hover:glass-strong ${riskGlow[risk]}`
              }`}
          >
            {isCurrent && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
            )}
            <span className="text-[10px] font-medium text-muted-foreground">
              {THAI_MONTHS_SHORT[m.month - 1]}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full my-1.5 ${riskDot[risk]}`} />
            <span className={`text-lg font-bold tabular-nums ${riskText[risk]}`}>
              {m.total}
            </span>
            <span className="text-[9px] text-muted-foreground/50">รายงาน</span>
          </button>
        );
      })}
    </div>
  );
}
