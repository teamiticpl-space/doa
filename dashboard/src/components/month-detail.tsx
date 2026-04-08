"use client";

import {
  getPlantPredictions,
  getPlantRecords,
  getRiskLevel,
  THAI_MONTHS,
  type RiskLevel,
} from "@/lib/pest-data";
import { AlertTriangle, Bug, CloudRain, Shield, Sprout } from "lucide-react";

type Props = {
  plant: string;
  month: number;
};

const riskBadge: Record<RiskLevel, string> = {
  none: "bg-gray-100 text-muted-foreground",
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const riskLabel: Record<RiskLevel, string> = {
  none: "ไม่มีข้อมูล",
  low: "ความเสี่ยงต่ำ",
  medium: "ความเสี่ยงปานกลาง",
  high: "ความเสี่ยงสูง",
  critical: "ความเสี่ยงวิกฤต",
};

export function MonthDetail({ plant, month }: Props) {
  const prediction = getPlantPredictions(plant)[month - 1];
  const risk = getRiskLevel(prediction.total);
  const monthRecords = getPlantRecords(plant).filter((r) => r.month === month);

  const weatherSet = new Set(monthRecords.filter((r) => r.weather).map((r) => r.weather));
  const weathers = Array.from(weatherSet).slice(0, 3);
  const stageSet = new Set(monthRecords.filter((r) => r.growthStage).map((r) => r.growthStage));
  const stages = Array.from(stageSet);

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold gradient-text">
            {THAI_MONTHS[month - 1]}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            ข้อมูลจาก {prediction.total} รายงานใน 10 ปี (เฉลี่ย {prediction.avgPerYear}/ปี)
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${riskBadge[risk]}`}>
          {riskLabel[risk]}
        </span>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-3 text-center">
          <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-orange-600" />
          <p className="text-xl font-bold tabular-nums">{prediction.total}</p>
          <p className="text-[10px] text-muted-foreground">รายงานทั้งหมด</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <Bug className="h-4 w-4 mx-auto mb-1 text-red-600" />
          <p className="text-xl font-bold tabular-nums">{prediction.problems.length}</p>
          <p className="text-[10px] text-muted-foreground">ชนิดศัตรูพืช</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <div className="h-4 w-4 mx-auto mb-1 rounded-full flex items-center justify-center" style={{
            background: `conic-gradient(#3b82f6 ${prediction.riskScore}%, rgba(0,0,0,0.08) 0)`,
          }}>
            <div className="h-2.5 w-2.5 rounded-full bg-card" />
          </div>
          <p className="text-xl font-bold tabular-nums">{prediction.riskScore}%</p>
          <p className="text-[10px] text-muted-foreground">ดัชนีเสี่ยง</p>
        </div>
      </div>

      {/* Weather & Growth Stage */}
      {(weathers.length > 0 || stages.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {weathers.length > 0 && (
            <div className="glass-card rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <CloudRain className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">สภาพอากาศ</span>
              </div>
              {weathers.map((w, i) => (
                <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                  {w}
                </p>
              ))}
            </div>
          )}
          {stages.length > 0 && (
            <div className="glass-card rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sprout className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-600">ระยะพืช</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {stages.map((s, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Problems list */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Bug className="h-4 w-4 text-red-600" />
          ศัตรูพืชที่คาดว่าจะพบ
        </h4>
        <div className="space-y-2.5">
          {prediction.problems.length === 0 && (
            <div className="glass-card rounded-xl p-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-emerald-600/50" />
              <p className="text-sm text-muted-foreground">ไม่พบข้อมูลศัตรูพืชในเดือนนี้</p>
              <p className="text-xs text-muted-foreground/50 mt-1">พืชอยู่ในเกณฑ์ปลอดภัย</p>
            </div>
          )}
          {prediction.problems.map((problem, i) => {
            const matchingRecord = monthRecords.find((r) => r.problem === problem.name);

            return (
              <div
                key={i}
                className="glass-card rounded-xl p-4 transition-all duration-200 hover:glass-strong animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Problem header */}
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-sm font-medium leading-snug pr-2">
                    <span className="text-muted-foreground mr-1.5">{i + 1}.</span>
                    {problem.name}
                  </h5>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {problem.count} ครั้ง
                    </span>
                    <span className="text-xs font-bold text-primary tabular-nums">
                      {problem.probability}%
                    </span>
                  </div>
                </div>

                {/* Probability bar */}
                <div className="w-full bg-gray-100 rounded-full h-1 mb-3">
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(problem.probability, 100)}%`,
                      background: "linear-gradient(90deg, #60a5fa, #34d399)",
                    }}
                  />
                </div>

                {/* Details */}
                {matchingRecord && (
                  <div className="space-y-2">
                    {matchingRecord.symptoms && (
                      <div className="pl-3 border-l-2 border-orange-500/30">
                        <p className="text-[10px] font-medium text-orange-600 mb-0.5">อาการที่พบ</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {matchingRecord.symptoms}
                        </p>
                      </div>
                    )}
                    {matchingRecord.solution && (
                      <div className="pl-3 border-l-2 border-emerald-500/30">
                        <p className="text-[10px] font-medium text-emerald-600 mb-0.5 flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          แนวทางป้องกัน
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {matchingRecord.solution}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
