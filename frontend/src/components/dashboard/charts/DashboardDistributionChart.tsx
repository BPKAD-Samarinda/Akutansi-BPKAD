import { memo, useMemo } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions, ScriptableContext } from "chart.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type CategoryValue =
  | "all"
  | "Lampiran"
  | "Keuangan"
  | "BKU"
  | "STS"
  | "Rekening Koran";

type Props = {
  data: { label: string; value: number }[];
  animationNonce: number;
  selectedCategory: CategoryValue;
  selectedMonth: number;
  selectedYear: number;
  onChangeCategory: (v: CategoryValue) => void;
  onChangeMonth: (v: number) => void;
  onChangeYear: (v: number) => void;
  categoryOptions: readonly CategoryValue[];
  monthOptions: { value: number; label: string }[];
  yearOptions: number[];
};

type DistributionCanvasProps = {
  chartKey: string;
  chartData: ChartData<"bar">;
  options: ChartOptions<"bar">;
};

const DistributionCanvas = memo(
  function DistributionCanvas({ chartKey, chartData, options }: DistributionCanvasProps) {
    return <Bar key={chartKey} data={chartData} options={options} updateMode="none" />;
  },
  (prev, next) => prev.chartKey === next.chartKey,
);

const CATEGORY_COLORS: Record<string, string> = {
  Lampiran: "#E0E7FF",
  Keuangan: "#CFFAFE",
  BKU: "#CCFBF1",
  STS: "#EDE9FE",
  "Rekening Koran": "#FFE4E6",
};

const CATEGORY_DARK: Record<string, string> = {
  Lampiran: "#6366F1",
  Keuangan: "#06B6D4",
  BKU: "#14B8A6",
  STS: "#8B5CF6",
  "Rekening Koran": "#F43F5E",
};

function DashboardDistributionChart(props: Props) {
  const {
    data,
    animationNonce,
    selectedCategory,
    selectedMonth,
    selectedYear,
    onChangeCategory,
    onChangeMonth,
    onChangeYear,
    categoryOptions,
    monthOptions,
    yearOptions,
  } = props;

  const chartKey = useMemo(() => `distribution-${animationNonce}`, [animationNonce]);

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "Jumlah Upload",
          data: data.map((d) => d.value),
          backgroundColor: (ctx: ScriptableContext<"bar">) => {
            const index = ctx.dataIndex;
            const label = data[index]?.label;
            const chart = ctx.chart;
            const area = chart.chartArea;
            if (!area) return CATEGORY_COLORS[label] ?? "#94A3B8";
            const start = CATEGORY_COLORS[label] ?? "#94A3B8";
            const end = CATEGORY_DARK[label] ?? "#64748B";
            const gradient = chart.ctx.createLinearGradient(0, area.bottom, 0, area.top);
            gradient.addColorStop(0, start);
            gradient.addColorStop(1, end);
            return gradient;
          },
          borderColor: data.map((d) => CATEGORY_DARK[d.label] ?? "#64748B"),
          borderWidth: 1,
          borderRadius: 12,
          borderSkipped: false,
          maxBarThickness: 56,
        },
      ],
    }),
    [data],
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 850,
        easing: "easeOutQuart",
      },
      animations: {
        y: {
          from: (ctx: ScriptableContext<"bar">) => {
            if (ctx.type !== "data") return 0;
            const yScale = ctx.chart.scales.y;
            return yScale ? yScale.getPixelForValue(0) : 0;
          },
          duration: (ctx: ScriptableContext<"bar">) =>
            ctx.mode === "resize" ? 0 : 850,
          easing: "easeOutCubic",
          delay: (ctx: ScriptableContext<"bar">) =>
            ctx.mode === "default" && ctx.type === "data" ? ctx.dataIndex * 110 : 0,
        },
      },
      transitions: {
        resize: { animation: { duration: 0 } },
        active: { animation: { duration: 0 } },
      },
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0, color: "#64748B" },
          grid: { color: "rgba(148,163,184,0.15)" },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#475569" },
        },
      },
    }),
    [],
  );

  const selectClass =
    "h-9 w-full xl:w-[112px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 text-xs text-slate-700 dark:text-slate-200 " +
    "transition-none focus:outline-none focus:ring-0 focus:border-slate-200 dark:focus:border-slate-600 focus-visible:ring-0";

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
          Jumlah Dokumen
        </h3>

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 xl:w-auto">
          <Select
            value={selectedCategory}
            onValueChange={(v) => onChangeCategory(v as CategoryValue)}
          >
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="max-h-[12.5rem]">
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all" ? "Kategori" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(selectedMonth)} onValueChange={(v) => onChangeMonth(Number(v))}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Semua Bulan" />
            </SelectTrigger>
            <SelectContent className="max-h-[12.5rem]">
              {monthOptions.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(selectedYear)} onValueChange={(v) => onChangeYear(Number(v))}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent className="max-h-[12.5rem]">
              <SelectItem value="0">Tahun</SelectItem>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px]">
        <DistributionCanvas chartKey={chartKey} chartData={chartData} options={options} />
      </div>
    </div>
  );
}

function arePropsEqual(prev: Props, next: Props) {
  if (prev.animationNonce !== next.animationNonce) return false;
  if (prev.selectedCategory !== next.selectedCategory) return false;
  if (prev.selectedMonth !== next.selectedMonth) return false;
  if (prev.selectedYear !== next.selectedYear) return false;
  if (prev.data.length !== next.data.length) return false;

  for (let i = 0; i < prev.data.length; i += 1) {
    if (prev.data[i].label !== next.data[i].label) return false;
    if (prev.data[i].value !== next.data[i].value) return false;
  }

  return true;
}

export default memo(DashboardDistributionChart, arePropsEqual);
