import { memo, useMemo } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
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

const CATEGORY_COLORS: Record<string, string> = {
  Lampiran: "#F97316",
  Keuangan: "#3B82F6",
  BPKU: "#14B8A6",
  STS: "#6366F1",
};

function DashboardDistributionChart(props: Props) {
  const {
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
  } = props;
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
          label: "Jumlah Upload",
          data: data.map((d) => d.value),
          backgroundColor: data.map((d) => CATEGORY_COLORS[d.label] ?? "#94A3B8"),
          borderRadius: 10,
          maxBarThickness: 52,
        },
      ],
    }),
    [data],
  );

  const selectClass =
    "h-10 w-full xl:w-[124px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 " +
    "focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300";

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 950,
        easing: "easeOutQuart",
        delay: (ctx) => (ctx.type === "data" ? ctx.dataIndex * 110 : 0),
      },
      animations: {
        y: {
          from: 0,
          duration: 850,
          easing: "easeOutCubic",
        },
      },
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
        x: { grid: { display: false } },
      },
    }),
    [],
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 whitespace-nowrap">
          Jumlah Dokumen
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

      <div className="h-[300px]">
        <Bar key={chartKey} data={chartData} options={options} />
      </div>
    </div>
  );
}

export default memo(DashboardDistributionChart);
