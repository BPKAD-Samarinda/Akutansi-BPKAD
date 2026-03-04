import { memo, useMemo } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import type { ChartOptions, ScriptableContext } from "chart.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type CategoryValue = "all" | "Lampiran" | "Keuangan" | "BKU" | "STS";

type Props = {
  data: { label: string; value: number }[];
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

function DashboardTrendChart({
  data,
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
  const chartKey = useMemo(
    () =>
      `${selectedCategory}-${selectedMonth}-${selectedYear}-${data.map((d) => `${d.label}:${d.value}`).join("|")}`,
    [selectedCategory, selectedMonth, selectedYear, data],
  );

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: trendMode === "daily" ? "Upload per Hari" : "Upload per Bulan",
          data: data.map((d) => d.value),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,0.16)",
          pointBackgroundColor: "#F97316",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.42,
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
        duration: 0,
        easing: "easeOutCubic",
      },
      animations: {
        x: {
          from: (ctx: ScriptableContext<"line">) => {
            if (ctx.type !== "data") return 0;
            return ctx.chart.chartArea?.left ?? 0;
          },
          duration: 900,
          easing: "easeOutQuart",
          delay: (ctx: ScriptableContext<"line">) =>
            ctx.type === "data" ? ctx.dataIndex * 75 : 0,
        },
        y: {
          duration: 900,
          easing: "easeOutQuart",
          from: (ctx: ScriptableContext<"line">) => {
            if (ctx.type !== "data") return 0;
            return ctx.chart.scales.y.getPixelForValue(0);
          },
          delay: (ctx: ScriptableContext<"line">) =>
            ctx.type === "data" ? ctx.dataIndex * 75 : 0,
        },
      },
      transitions: {
        resize: {
          animation: {
            duration: 0,
          },
        },
        active: {
          animation: {
            duration: 0,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0F172A",
          displayColors: false,
          padding: 10,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0, color: "#64748B" },
          grid: { color: "rgba(148,163,184,0.2)" },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "#475569",
            maxTicksLimit: trendMode === "daily" ? 31 : 12,
            autoSkip: false,
            font: {
              size: trendMode === "daily" ? 10 : 12,
            },
          },
        },
      },
    }),
    [trendMode],
  );

  const selectClass =
    "h-10 w-full xl:w-[124px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 " +
    "transition-none focus:outline-none focus:ring-0 focus:border-slate-200 focus-visible:ring-0";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 whitespace-nowrap">
          Perkembangan Upload
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

      {trendMode === "daily" && (
        <div className="mb-3 text-sm text-slate-600">
          Hari upload: <span className="font-semibold text-slate-800">{trendUploadDays}</span>
          {" | "}
          Hari kosong: <span className="font-semibold text-slate-800">{trendEmptyDays}</span>
        </div>
      )}

      <div className="h-[260px] sm:h-[300px]">
        <Line key={chartKey} data={chartData} options={options} updateMode="none" />
      </div>
    </div>
  );
}

function arePropsEqual(prev: Props, next: Props) {
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
