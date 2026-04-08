import plantsList from "@/data/plants-list.json";
import predictionsData from "@/data/predictions.json";
import pestRecords from "@/data/pest-data.json";

export type PestRecord = {
  plant: string;
  growthStage: string;
  problem: string;
  symptoms: string;
  solution: string;
  reportDate: string;
  weather: string;
  month: number | null;
  year: number | null;
  sheet: string;
};

export type ProblemPrediction = {
  name: string;
  count: number;
  probability: number;
};

export type MonthPrediction = {
  total: number;
  problems: ProblemPrediction[];
};

export type Predictions = Record<string, Record<string, MonthPrediction>>;

// Sanitize predictions data: some entries have corrupted "problems" as string
function sanitizePredictions(raw: Record<string, unknown>): Predictions {
  const result: Predictions = {};
  for (const [plant, months] of Object.entries(raw)) {
    result[plant] = {};
    for (const [month, info] of Object.entries(months as Record<string, { total: number; problems: unknown }>)) {
      result[plant][month] = {
        total: info.total ?? 0,
        problems: Array.isArray(info.problems) ? info.problems : [],
      };
    }
  }
  return result;
}

export const plants: string[] = plantsList;
export const predictions: Predictions = sanitizePredictions(predictionsData as Record<string, unknown>);
export const records: PestRecord[] = pestRecords as PestRecord[];

export const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

export const THAI_MONTHS_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

// Total years of data (2558-2568 = 10 years with some partial years)
const DATA_YEARS = 10;

export function getPlantPredictions(plantName: string) {
  const plantData = predictions[plantName];
  if (!plantData) return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: THAI_MONTHS[i],
    monthShort: THAI_MONTHS_SHORT[i],
    total: 0,
    avgPerYear: 0,
    problems: [] as ProblemPrediction[],
    riskScore: 0,
  }));

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const data = plantData[String(month)];
    const total = data?.total ?? 0;
    const avgPerYear = Math.round((total / DATA_YEARS) * 10) / 10;
    // Risk score 0-100 based on historical frequency
    const riskScore = Math.min(100, Math.round((total / DATA_YEARS) * 20));

    return {
      month,
      monthName: THAI_MONTHS[i],
      monthShort: THAI_MONTHS_SHORT[i],
      total,
      avgPerYear,
      problems: data?.problems ?? [],
      riskScore,
    };
  });
}

export function getPlantRecords(plantName: string) {
  return records.filter((r) => r.plant === plantName);
}

export type RiskLevel = "none" | "low" | "medium" | "high" | "critical";

export function getRiskLevel(total: number): RiskLevel {
  if (total === 0) return "none";
  if (total <= 3) return "low";
  if (total <= 8) return "medium";
  if (total <= 15) return "high";
  return "critical";
}

export function getTopProblemsForPlant(plantName: string, limit = 10) {
  const plantRecords = records.filter((r) => r.plant === plantName && r.problem);
  const counts: Record<string, number> = {};
  for (const r of plantRecords) {
    counts[r.problem] = (counts[r.problem] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function getOverallStats() {
  const totalRecords = records.length;
  const uniquePlants = new Set(records.map((r) => r.plant)).size;
  const uniqueProblems = new Set(records.filter((r) => r.problem).map((r) => r.problem)).size;
  return { totalRecords, uniquePlants, uniqueProblems, yearsRange: "2558-2568", totalYears: 10 };
}

export function getCurrentMonthPrediction(plantName: string) {
  const currentMonth = new Date().getMonth() + 1;
  const allPredictions = getPlantPredictions(plantName);
  return allPredictions[currentMonth - 1];
}

// Future prediction: next N months from current
export function getFuturePredictions(plantName: string, monthsAhead = 6) {
  const currentMonth = new Date().getMonth() + 1;
  const allPredictions = getPlantPredictions(plantName);

  return Array.from({ length: monthsAhead }, (_, i) => {
    const futureMonthIndex = (currentMonth - 1 + i) % 12;
    const pred = allPredictions[futureMonthIndex];
    const monthsFromNow = i;
    // Confidence decreases slightly for months further out
    const confidence = Math.max(60, 95 - monthsFromNow * 3);

    return {
      ...pred,
      monthsFromNow,
      confidence,
      isCurrent: i === 0,
    };
  });
}

// Yearly trend for a specific plant+problem combo
export function getYearlyTrend(plantName: string, problemName?: string) {
  const plantRecords = records.filter(
    (r) => r.plant === plantName && r.year && (problemName ? r.problem === problemName : true)
  );
  const yearCounts: Record<number, number> = {};
  for (const r of plantRecords) {
    if (r.year) yearCounts[r.year] = (yearCounts[r.year] || 0) + 1;
  }

  const years = [2558, 2559, 2560, 2561, 2562, 2563, 2564, 2565, 2566, 2567, 2568];
  return years.map((y) => ({
    year: y,
    yearCE: y - 543,
    count: yearCounts[y] ?? 0,
  }));
}

export function getPlantTotalRecords(plantName: string) {
  return records.filter((r) => r.plant === plantName).length;
}
