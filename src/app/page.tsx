"use client";

import { FuturePrediction } from "@/components/future-prediction";
import { MonthDetail } from "@/components/month-detail";
import { MonthHeatmap } from "@/components/month-heatmap";
import { PlantSelector } from "@/components/plant-selector";
import { PredictionChart } from "@/components/prediction-chart";
import { StatsOverview } from "@/components/stats-overview";
import { getPlantTotalRecords, plants } from "@/lib/pest-data";
import {
  BarChart3,
  CalendarRange,
  ChevronLeft,
  Leaf,
  Menu,
  Radar,
} from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [selectedPlant, setSelectedPlant] = useState(plants[0]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    new Date().getMonth() + 1
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalRecords = getPlantTotalRecords(selectedPlant);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Background gradient ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 border-r border-border bg-card/95 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">เลือกชนิดพืช</h2>
                <p className="text-[10px] text-muted-foreground">
                  {plants.length} ชนิด
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-3 flex-1 overflow-hidden">
          <PlantSelector
            selected={selectedPlant}
            onSelect={(p) => {
              setSelectedPlant(p);
              setSelectedMonth(new Date().getMonth() + 1);
              setSidebarOpen(false);
            }}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-20 glass border-b border-border px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-xl bg-primary/10 glow-blue">
                <Radar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight gradient-text">
                  Pest Prediction AI
                </h1>
                <p className="text-[10px] text-muted-foreground">
                  วิเคราะห์ข้อมูลเตือนภัย 2,617 รายการ ย้อนหลัง 10 ปี (พ.ศ. 2558-2568)
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Plant title */}
          <div className="flex items-center gap-3 flex-wrap animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 glow-green">
                <Leaf className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedPlant}</h2>
                <p className="text-xs text-muted-foreground">
                  {totalRecords} รายงานย้อนหลัง
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-xs text-primary hover:underline cursor-pointer"
            >
              เปลี่ยนพืช
            </button>
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Charts & Detail */}
            <div className="xl:col-span-2 space-y-6">
              {/* Heatmap */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarRange className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">ปฏิทินความเสี่ยงรายเดือน</h3>
                </div>
                <p className="text-[10px] text-muted-foreground mb-4">
                  คลิกเดือนเพื่อดูรายละเอียด | จุดกระพริบ = เดือนปัจจุบัน
                </p>
                <MonthHeatmap
                  plant={selectedPlant}
                  selectedMonth={selectedMonth}
                  onSelectMonth={setSelectedMonth}
                />
                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground justify-center flex-wrap">
                  {[
                    { color: "bg-gray-200", label: "ไม่มีข้อมูล" },
                    { color: "bg-emerald-400", label: "ต่ำ (1-3)" },
                    { color: "bg-yellow-400", label: "ปานกลาง (4-8)" },
                    { color: "bg-orange-400", label: "สูง (9-15)" },
                    { color: "bg-red-500", label: "วิกฤต (16+)" },
                  ].map((item) => (
                    <span key={item.label} className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Area Chart */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">กราฟรายงานปัญหารายเดือน</h3>
                </div>
                <p className="text-[10px] text-muted-foreground mb-4">
                  คลิกจุดบนกราฟเพื่อดูรายละเอียดปัญหา
                </p>
                <PredictionChart
                  plant={selectedPlant}
                  selectedMonth={selectedMonth}
                  onSelectMonth={setSelectedMonth}
                />
              </div>

              {/* Future predictions */}
              <div className="glass-card rounded-2xl p-5">
                <FuturePrediction
                  plant={selectedPlant}
                  onSelectMonth={setSelectedMonth}
                />
              </div>

              {/* Month Detail */}
              {selectedMonth && (
                <div className="glass-card rounded-2xl p-5 lg:p-6">
                  <MonthDetail plant={selectedPlant} month={selectedMonth} />
                </div>
              )}
            </div>

            {/* Right: Stats sidebar */}
            <div className="xl:col-span-1">
              <div className="xl:sticky xl:top-20 space-y-4">
                <StatsOverview plant={selectedPlant} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
