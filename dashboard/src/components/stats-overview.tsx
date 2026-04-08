"use client";

import {
  getOverallStats,
  getTopProblemsForPlant,
  getCurrentMonthPrediction,
  getRiskLevel,
  THAI_MONTHS,
  getYearlyTrend,
} from "@/lib/pest-data";
import { Activity, Bug, CalendarDays, Leaf, TrendingUp, TriangleAlert } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type Props = {
  plant: string;
};

export function StatsOverview({ plant }: Props) {
  const stats = getOverallStats();
  const topProblems = getTopProblemsForPlant(plant, 6);
  const currentPrediction = getCurrentMonthPrediction(plant);
  const currentMonth = new Date().getMonth() + 1;
  const risk = getRiskLevel(currentPrediction?.total ?? 0);
  const yearlyTrend = getYearlyTrend(plant);

  const riskGlow = {
    none: "",
    low: "glow-green",
    medium: "",
    high: "glow-orange",
    critical: "glow-red",
  };

  return (
    <div className="space-y-4">
      {/* Current month prediction - Hero card */}
      <div className={`glass-card rounded-2xl p-5 ${riskGlow[risk]}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold">
              พยากรณ์เดือน{THAI_MONTHS[currentMonth - 1]}
            </span>
            <p className="text-[10px] text-muted-foreground">เดือนปัจจุบัน</p>
          </div>
        </div>

        {currentPrediction && currentPrediction.problems.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold gradient-text tabular-nums">
                {currentPrediction.total}
              </span>
              <span className="text-sm text-muted-foreground">รายงาน</span>
              <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                risk === "critical" ? "bg-red-100 text-red-600" :
                risk === "high" ? "bg-orange-100 text-orange-600" :
                risk === "medium" ? "bg-yellow-100 text-yellow-600" :
                "bg-emerald-100 text-emerald-600"
              }`}>
                ดัชนีเสี่ยง {currentPrediction.riskScore}%
              </span>
            </div>
            {currentPrediction.problems.slice(0, 3).map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <TriangleAlert className="h-3 w-3 text-orange-600" />
                  <span className="text-foreground/80">{p.name.length > 25 ? p.name.slice(0, 25) + "..." : p.name}</span>
                </span>
                <span className="text-primary font-medium tabular-nums">{p.probability}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-2xl font-bold text-emerald-600">ปลอดภัย</p>
            <p className="text-xs text-muted-foreground mt-1">ไม่พบข้อมูลสำหรับเดือนนี้</p>
          </div>
        )}
      </div>

      {/* Dataset stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Activity, color: "text-blue-600", bg: "bg-blue-500/10", value: stats.totalRecords.toLocaleString(), label: "ข้อมูลทั้งหมด" },
          { icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-500/10", value: stats.uniquePlants, label: "ชนิดพืช" },
          { icon: Bug, color: "text-red-600", bg: "bg-red-500/10", value: stats.uniqueProblems, label: "ชนิดศัตรูพืช" },
          { icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-500/10", value: "10 ปี", label: stats.yearsRange },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yearly trend sparkline */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">แนวโน้มรายปี</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={yearlyTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="count"
              stroke="#a78bfa"
              strokeWidth={2}
              fill="url(#trendGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-between text-[10px] text-muted-foreground/50 mt-1 px-1">
          <span>2558</span>
          <span>2563</span>
          <span>2568</span>
        </div>
      </div>

      {/* Top problems */}
      <div className="glass-card rounded-xl p-4">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Bug className="h-4 w-4 text-red-600" />
          ศัตรูพืชที่พบบ่อย
        </h4>
        <div className="space-y-2.5">
          {topProblems.map((p, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors truncate pr-2">
                  {p.name}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                  {p.count}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${(p.count / topProblems[0].count) * 100}%`,
                    background: `linear-gradient(90deg, ${
                      i === 0 ? "#ef4444" : i === 1 ? "#f97316" : i === 2 ? "#eab308" : "#3b82f6"
                    }, ${
                      i === 0 ? "#f97316" : i === 1 ? "#eab308" : i === 2 ? "#22c55e" : "#60a5fa"
                    })`,
                  }}
                />
              </div>
            </div>
          ))}
          {topProblems.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">ไม่พบข้อมูล</p>
          )}
        </div>
      </div>
    </div>
  );
}
