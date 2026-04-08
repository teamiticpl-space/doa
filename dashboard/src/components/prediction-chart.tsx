"use client";

import { getPlantPredictions, THAI_MONTHS_SHORT } from "@/lib/pest-data";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  plant: string;
  selectedMonth: number | null;
  onSelectMonth: (month: number) => void;
};

export function PredictionChart({ plant, selectedMonth, onSelectMonth }: Props) {
  const data = getPlantPredictions(plant).map((m) => ({
    ...m,
    name: THAI_MONTHS_SHORT[m.month - 1],
  }));

  const currentMonth = new Date().getMonth() + 1;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        onClick={(state: Record<string, unknown>) => {
          const payload = state?.activePayload as Array<{ payload: { month: number } }> | undefined;
          if (payload?.[0]) {
            onSelectMonth(payload[0].payload.month);
          }
        }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "rgba(0,0,0,0.45)" }}
          axisLine={{ stroke: "rgba(0,0,0,0.06)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "rgba(0,0,0,0.45)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="glass-strong rounded-xl p-3 text-sm shadow-2xl">
                <p className="font-semibold text-foreground">{d.monthName}</p>
                <p className="text-primary font-bold text-lg">{d.total} รายงาน</p>
                <p className="text-[10px] text-muted-foreground mb-1">
                  เฉลี่ย {d.avgPerYear}/ปี | ความเสี่ยง {d.riskScore}%
                </p>
                {d.problems.slice(0, 3).map((p: { name: string; probability: number }, i: number) => (
                  <p key={i} className="text-xs text-muted-foreground mt-0.5">
                    {p.name} ({p.probability}%)
                  </p>
                ))}
              </div>
            );
          }}
        />
        {/* Reference line for current month */}
        {data.map((entry) =>
          entry.month === currentMonth ? (
            <line
              key="current-line"
              x1={0}
              y1={0}
              x2={0}
              y2={300}
              stroke="#3b82f6"
              strokeDasharray="4 4"
              strokeOpacity={0.3}
            />
          ) : null
        )}
        <Area
          type="monotone"
          dataKey="total"
          stroke="url(#lineGradient)"
          strokeWidth={2.5}
          fill="url(#areaGradient)"
          dot={((props: Record<string, unknown>) => {
            const cx = props.cx as number;
            const cy = props.cy as number;
            const dotPayload = props.payload as { month: number };
            const isActive = selectedMonth === dotPayload.month;
            const isCurr = currentMonth === dotPayload.month;
            return (
              <circle
                key={dotPayload.month}
                cx={cx}
                cy={cy}
                r={isActive ? 6 : isCurr ? 5 : 3}
                fill={isActive ? "#3b82f6" : isCurr ? "#60a5fa" : "rgba(96,165,250,0.5)"}
                stroke={isActive || isCurr ? "#fff" : "none"}
                strokeWidth={isActive ? 2 : 1.5}
                style={{ cursor: "pointer", transition: "all 200ms" }}
              />
            );
          }) as unknown as boolean}
          activeDot={{ r: 7, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
          cursor="pointer"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
