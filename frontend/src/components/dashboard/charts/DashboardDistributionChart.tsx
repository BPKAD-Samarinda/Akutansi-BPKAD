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
import { getCategoryColorPair } from "../../../hooks/dashboard/dashboardAnalytics.helpers";

type CategoryValue = string;

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

// Colors are dynamically resolved via getCategoryColorPair helper.

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
            const colors = getCategoryColorPair(label || "");
            if (!area) return colors.light;
            const gradient = chart.ctx.createLinearGradient(0, area.bottom, 0, area.top);
            gradient.addColorStop(0, colors.dark + "80"); // semi transparent at bottom
            gradient.addColorStop(1, colors.light);       // vibrant at top
            return gradient;
          },
          borderWidth: 0,
          borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
          borderSkipped: "bottom" as const,
          maxBarThickness: 40,
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
      plugins: { 
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(4px)",
          titleColor: "#94a3b8",
          titleFont: { size: 11, weight: "bold" },
          bodyFont: { size: 13, weight: "bold" },
          bodyColor: "#f8fafc",
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
          callbacks: {
            title: () => "Jumlah Dokumen",
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0, color: "#64748b", font: { size: 11 } },
          grid: { 
            color: "rgba(148,163,184,0.1)",
            tickBorderDash: [4, 4],
            lineWidth: 1
          },
          border: { dash: [4, 4], display: false }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#475569", font: { size: 11, weight: "bold" } },
          border: { display: false }
        },
      },
    }),
    [],
  );

  const selectClass =
    "h-[30px] w-auto max-w-[125px] sm:max-w-none rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2.5 gap-1.5 text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 " +
    "transition-all hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

  const canRenderChart = !((selectedMonth !== 0 || selectedCategory !== "all") && selectedYear === 0);

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 sm:p-5 shadow-lg shadow-slate-200/20 dark:shadow-black/40 relative overflow-hidden group">
      {/* Glow effect on hover */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="mb-4 flex items-center justify-between gap-2 relative z-10">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight truncate">
            Jumlah Dokumen
          </h3>
          <p className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Sebaran dokumen berdasarkan kategori
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">


          <Select value={String(selectedMonth)} onValueChange={(v) => onChangeMonth(Number(v))}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Semua Bulan" />
            </SelectTrigger>
            <SelectContent className="max-h-[12.5rem]">
              {monthOptions.map((m) => (
                <SelectItem key={m.value} value={String(m.value)} className="text-xs">
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
              <SelectItem value="0" className="text-xs">Semua Tahun</SelectItem>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)} className="text-xs">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[170px] sm:h-[190px] relative z-10">
        {!canRenderChart ? (
          <div className="h-full rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Pilih Tahun</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-xs">Silakan pilih tahun terlebih dahulu untuk melihat data spesifik kategori atau bulan.</p>
          </div>
        ) : data.length === 0 ? (
          <div className="h-full rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Tidak ada dokumen yang ditemukan.
          </div>
        ) : (
          <DistributionCanvas chartKey={chartKey} chartData={chartData} options={options} />
        )}
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
