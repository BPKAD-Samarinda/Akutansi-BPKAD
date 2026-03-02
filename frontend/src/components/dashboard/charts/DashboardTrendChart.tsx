import "chart.js/auto";
import { Line } from "react-chartjs-2";
import type { ScriptableContext } from "chart.js";

type CategoryValue = "all" | "Lampiran" | "Keuangan" | "BPKU" | "STS";
type PeriodValue = "week" | "month" | "year";

type Props = {
  data: { label: string; value: number }[];
  selectedCategory: CategoryValue;
  selectedYear: number;
  selectedPeriod: PeriodValue;
  onChangeCategory: (v: CategoryValue) => void;
  onChangeYear: (v: number) => void;
  onChangePeriod: (v: PeriodValue) => void;
  categoryOptions: readonly CategoryValue[];
  yearOptions: number[];
};

export default function DashboardTrendChart({
  data,
  selectedCategory,
  selectedYear,
  selectedPeriod,
  onChangeCategory,
  onChangeYear,
  onChangePeriod,
  categoryOptions,
  yearOptions,
}: Props) {
  const chartKey = `${selectedCategory}-${selectedYear}-${selectedPeriod}-${JSON.stringify(data)}`;

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Upload per Bulan",
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
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    animation: {
      duration: 1400,
      easing: "easeOutCubic" as const,
    },
    animations: {
      x: {
        duration: 900,
        easing: "easeOutQuart" as const,
      },
      y: {
        duration: 1200,
        easing: "easeOutQuart" as const,
        from: (ctx: ScriptableContext<"line">) => (ctx.type === "data" ? 0 : undefined),
        delay: (ctx: ScriptableContext<"line">) => (ctx.type === "data" ? ctx.dataIndex * 120 : 0),
      },
      tension: {
        duration: 900,
        easing: "linear" as const,
        from: 0.9,
        to: 0.42,
      },
      radius: {
        duration: 600,
        easing: "easeOutBack" as const,
        delay: (ctx: ScriptableContext<"line">) => (ctx.type === "data" ? ctx.dataIndex * 120 : 0),
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
        ticks: { color: "#475569" },
      },
    },
  };

  const selectClass =
    "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 " +
    "focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Tren Upload (1 Tahun)</h3>

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => onChangeCategory(e.target.value as CategoryValue)}
            className={selectClass}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "Pilih Kategori" : c}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => onChangeYear(Number(e.target.value))}
            className={selectClass}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => onChangePeriod(e.target.value as PeriodValue)}
            className={selectClass}
          >
            <option value="week">Minggu</option>
            <option value="month">Bulan</option>
            <option value="year">Tahun</option>
          </select>
        </div>
      </div>

      <div className="h-[260px] sm:h-[300px]">
        <Line key={chartKey} data={chartData} options={options} />
      </div>
    </div>
  );
}
