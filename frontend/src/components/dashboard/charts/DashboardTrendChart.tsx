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

const TREND_LINE_COLOR = "#6366F1";

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

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: trendMode === "daily" ? "Status Upload Harian (1/0)" : "Upload per Bulan",
          data: data.map((d) => d.value),
          borderColor: TREND_LINE_COLOR,
          backgroundColor: (ctx: ScriptableContext<"line">) => {
            const chart = ctx.chart;
            const area = chart.chartArea;
            if (!area) return "rgba(99,102,241,0.18)";
            const gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
            gradient.addColorStop(0, "rgba(99,102,241,0.28)");
            gradient.addColorStop(1, "rgba(99,102,241,0.04)");
            return gradient;
          },
          pointBackgroundColor: TREND_LINE_COLOR,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.55,
        },
      ],
    }),
    [data, trendMode],
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
                    Number(ctx.raw ?? 0) > 0 ? "1 (Upload)" : "0 (Tidak Upload)",
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
    "h-9 w-full sm:w-[135px] rounded-lg border border-slate-200/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 " +
    "hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-0 focus:border-indigo-400 dark:focus:border-indigo-500 focus-visible:ring-0 shadow-sm cursor-pointer";

  const canRenderChart = !(selectedMonth !== 0 && selectedYear === 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300 h-full flex flex-col">
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap flex items-center gap-2">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
          Perkembangan Upload
        </h3>

        <div className="flex flex-wrap w-full sm:w-auto gap-2">
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

      {canRenderChart && trendMode === "daily" && (
        <div className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          Hari upload: <span className="font-semibold text-slate-800">{trendUploadDays}</span>
          {" | "}
          Hari kosong: <span className="font-semibold text-slate-800 dark:text-slate-100">{trendEmptyDays}</span>
        </div>
      )}

      <div className="h-[260px] sm:h-[300px] flex-1">
        {!canRenderChart ? (
          <div className="h-full rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Pilih tahun untuk menampilkan data bulan yang dipilih.
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
