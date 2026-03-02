import "chart.js/auto";
import { Bar } from "react-chartjs-2";

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

export default function DashboardDistributionChart(props: Props) {
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

  const chartKey = `${selectedCategory}-${selectedMonth}-${selectedYear}-${JSON.stringify(data)}`;

  const chartData = {
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
  };

  const selectClass =
    "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 " +
    "focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Distribusi Upload per Kategori</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
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
        <Bar
          key={chartKey}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1200,
              easing: "easeOutQuart",
              delay: (ctx) => (ctx.type === "data" ? ctx.dataIndex * 140 : 0),
            },
            animations: {
              y: {
                duration: 900,
                easing: "easeOutBack",
                from: (ctx) => {
                  const yScale = ctx.chart.scales.y;
                  return yScale.getPixelForValue(0); // start dari bawah (baseline)
                },
              },
            },
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { precision: 0 } },
              x: { grid: { display: false } },
            },
          }}
        />
      </div>
    </div>
  );
}
