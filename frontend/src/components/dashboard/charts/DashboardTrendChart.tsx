import { memo, useMemo } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
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
  trendMode: "monthly" | "daily";
  trendUploadDays: number;
  trendEmptyDays: number;
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

// Colors are dynamically calculated using getCategoryColorPair.

type TrendCanvasProps = {
  chartKey: string;
  chartData: ChartData<"line">;
  options: ChartOptions<"line">;
};

const TrendCanvas = memo(
  function TrendCanvas({ chartKey, chartData, options }: TrendCanvasProps) {
    return <Line key={chartKey} data={chartData} options={options} updateMode="none" />;
  },
  (prev, next) => prev.chartKey === next.chartKey,
);

function DashboardTrendChart({
  data,
  animationNonce,
  trendMode,
  trendUploadDays,
  trendEmptyDays,
  selectedCategory,
  selectedMonth,
  selectedYear,
  onChangeCategory,
  onChangeMonth,
  onChangeYear,
  categoryOptions,
  monthOptions,
  yearOptions,
}: Props) {
  const chartKey = useMemo(() => `trend-${animationNonce}`, [animationNonce]);

  const colorPair = useMemo(() => {
    if (selectedCategory === "all") {
      return { light: "rgba(99,102,241,0.12)", dark: "#6366F1" };
    }
    return getCategoryColorPair(selectedCategory);
  }, [selectedCategory]);

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: trendMode === "daily" ? "Status Unggah Harian (1/0)" : "Unggah per Bulan",
          data: data.map((d) => d.value),
          borderColor: colorPair.dark,
          backgroundColor: (ctx: ScriptableContext<"line">) => {
            const chart = ctx.chart;
            const area = chart.chartArea;
            const hex = colorPair.dark;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const startColor = `rgba(${r},${g},${b},0.28)`;
            const endColor = `rgba(${r},${g},${b},0.04)`;
            if (!area) return startColor;
            const gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, endColor);
            return gradient;
          },
          pointBackgroundColor: colorPair.dark,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.55,
        },
      ],
    }),
    [data, trendMode, colorPair],
  );

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      animation: {
        duration: 1100,
        easing: "easeOutCubic",
      },
      animations: {
        x: {
          from: (ctx: ScriptableContext<"line">) => {
            if (ctx.type !== "data") return 0;
            return ctx.chart.chartArea?.left ?? 0;
          },
          duration: (ctx: ScriptableContext<"line">) =>
            ctx.mode === "resize" ? 0 : 1000,
          easing: "easeOutCubic",
          delay: (ctx: ScriptableContext<"line">) =>
            ctx.mode === "default" && ctx.type === "data" ? ctx.dataIndex * 65 : 0,
        },
        y: {
          duration: (ctx: ScriptableContext<"line">) =>
            ctx.mode === "resize" ? 0 : 1000,
          easing: "easeOutCubic",
          from: (ctx: ScriptableContext<"line">) => {
            if (ctx.type !== "data") return 0;
            const yScale = ctx.chart.scales.y;
            return yScale ? yScale.getPixelForValue(0) : 0;
          },
          delay: (ctx: ScriptableContext<"line">) =>
            ctx.mode === "default" && ctx.type === "data" ? ctx.dataIndex * 65 : 0,
        },
        tension: {
          from: 0.15,
          to: 0.55,
          duration: (ctx: ScriptableContext<"line">) =>
            ctx.mode === "resize" ? 0 : 800,
          easing: "easeOutQuart",
        },
      },
      transitions: {
        resize: { animation: { duration: 0 } },
        active: { animation: { duration: 0 } },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0F172A",
          displayColors: false,
          padding: 10,
          callbacks:
            trendMode === "daily"
              ? {
                  title: (items) => {
                    const dayLabel = items[0]?.label ?? "";
                    return `Tanggal ${dayLabel}`;
                  },
                  label: (ctx) =>
                    Number(ctx.raw ?? 0) > 0 ? "1 (Unggah)" : "0 (Tidak Unggah)",
                }
              : undefined,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: trendMode === "daily" ? 1 : undefined,
          ticks: {
            precision: 0,
            color: "#64748B",
            stepSize: trendMode === "daily" ? 1 : undefined,
          },
          grid: { color: "rgba(148,163,184,0.2)" },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "#475569",
            maxTicksLimit: trendMode === "daily" ? 31 : 12,
            autoSkip: false,
            font: { size: trendMode === "daily" ? 10 : 12 },
          },
        },
      },
    }),
    [trendMode],
  );

  const selectClass =
    "h-[30px] w-auto max-w-[125px] sm:max-w-none rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2.5 gap-1.5 text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 " +
    "transition-all hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

  const canRenderChart = !((selectedMonth !== 0 || selectedCategory !== "all") && selectedYear === 0);

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 sm:p-5 shadow-lg shadow-slate-200/20 dark:shadow-black/40 relative overflow-hidden group">
      {/* Glow effect on hover */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="mb-4 flex items-center justify-between gap-2 relative z-10">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight truncate">
            Perkembangan Unggah
          </h3>
          <p className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Tren aktivitas unggah dokumen seiring waktu
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Select
            value={selectedCategory}
            onValueChange={(v) => onChangeCategory(v as CategoryValue)}
          >
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="max-h-[12.5rem]">
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">
                  {c === "all" ? "Semua Kategori" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(selectedMonth)} onValueChange={(v) => onChangeMonth(Number(v))}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Bulan" />
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

      {canRenderChart && trendMode === "daily" && (
        <div className="mb-4 flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unggah: <span className="font-bold text-slate-800 dark:text-slate-200">{trendUploadDays} hari</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kosong: <span className="font-bold text-slate-800 dark:text-slate-200">{trendEmptyDays} hari</span>
            </p>
          </div>
        </div>
      )}

      <div className="h-[190px] sm:h-[210px] relative z-10">
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
        ) : (
          <TrendCanvas chartKey={chartKey} chartData={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

function arePropsEqual(prev: Props, next: Props) {
  if (prev.animationNonce !== next.animationNonce) return false;
  if (prev.trendMode !== next.trendMode) return false;
  if (prev.trendUploadDays !== next.trendUploadDays) return false;
  if (prev.trendEmptyDays !== next.trendEmptyDays) return false;
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

export default memo(DashboardTrendChart, arePropsEqual);
