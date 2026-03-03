import { memo, useMemo } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

type CategoryValue = "all" | "Lampiran" | "Keuangan" | "BPKU" | "STS";

type Props = {
  data: { label: string; value: number }[];
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
    }),
    [data],
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
        duration: 1200,
        easing: "easeOutCubic",
      },
      animations: {
        y: {
          duration: 1000,
          easing: "easeOutQuart",
          delay: (ctx) => (ctx.type === "data" ? ctx.dataIndex * 80 : 0),
          from: 0,
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
    }),
    [],
  );

  const selectClass =
    "h-10 w-full xl:w-[124px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 " +
    "focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 whitespace-nowrap">
          Perkembangan Upload
        </h3>

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 xl:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => onChangeCategory(e.target.value as CategoryValue)}
            className={selectClass}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "Kategori" : c}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => onChangeMonth(Number(e.target.value))}
            className={selectClass}
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
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
        </div>
      </div>

      <div className="h-[260px] sm:h-[300px]">
        <Line key={chartKey} data={chartData} options={options} />
      </div>
    </div>
  );
}

export default memo(DashboardTrendChart);
