import { memo, useEffect, useMemo, useRef, useState } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
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
  BKU: "#14B8A6",
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
  const [animationSeed, setAnimationSeed] = useState(1);
  const [allowAnimation, setAllowAnimation] = useState(true);
  const prevFiltersRef = useRef({
    selectedCategory,
    selectedMonth,
    selectedYear,
  });

  const chartKey = useMemo(() => `dist-${animationSeed}`, [animationSeed]);

  useEffect(() => {
    const prev = prevFiltersRef.current;
    const hasChanged =
      prev.selectedCategory !== selectedCategory ||
      prev.selectedMonth !== selectedMonth ||
      prev.selectedYear !== selectedYear;

    if (hasChanged) {
      setAllowAnimation(true);
      setAnimationSeed((v) => v + 1);
      prevFiltersRef.current = { selectedCategory, selectedMonth, selectedYear };
    }
  }, [selectedCategory, selectedMonth, selectedYear]);

  useEffect(() => {
    if (!allowAnimation) return;
    const timer = setTimeout(() => setAllowAnimation(false), 1200);
    return () => clearTimeout(timer);
  }, [allowAnimation, animationSeed]);

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
    "transition-none focus:outline-none focus:ring-0 focus:border-slate-200 focus-visible:ring-0";

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: allowAnimation
        ? {
            duration: 0,
            easing: "easeOutQuart",
          }
        : false,
      animations: allowAnimation
        ? {
            y: {
              from: (ctx: ScriptableContext<"bar">) => {
                if (ctx.type !== "data") return 0;
                return ctx.chart.scales.y.getPixelForValue(0);
              },
              duration: 850,
              easing: "easeOutCubic",
              delay: (ctx: ScriptableContext<"bar">) =>
                ctx.type === "data" ? ctx.dataIndex * 110 : 0,
            },
          }
        : {},
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
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
        x: { grid: { display: false } },
      },
    }),
    [allowAnimation],
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 whitespace-nowrap">
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
        <Bar key={chartKey} data={chartData} options={options} updateMode="none" />
      </div>
    </div>
  );
}

function arePropsEqual(prev: Props, next: Props) {
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
