import { useEffect, useState } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { getCategoryColorPair } from "../../../hooks/dashboard/dashboardAnalytics.helpers";

type Props = {
  data: { label: string; value: number }[];
};

const numberFormatter = new Intl.NumberFormat("id-ID");

type AnimatedNumberProps = {
  value: number;
  decimals?: number;
  suffix?: string;
  formatThousands?: boolean;
};

function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  formatThousands = false,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 900;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(value * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const roundedNumber =
    decimals > 0 ? Number(displayValue.toFixed(decimals)) : Math.round(displayValue);
  const textValue = formatThousands
    ? numberFormatter.format(roundedNumber)
    : decimals > 0
      ? roundedNumber.toFixed(decimals)
      : roundedNumber.toString();

  return (
    <>
      {textValue}
      {suffix}
    </>
  );
}

export default function DashboardPieChart({ data }: Props) {
  const detailData = [...data].sort((a, b) => b.value - a.value);
  const total = detailData.reduce((acc, item) => acc + item.value, 0);
  const hasData = total > 0;

  const detailWithPercentage = detailData.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }));

  const topCategory = detailWithPercentage[0];
  const chartKey = `${JSON.stringify(detailWithPercentage)}-${hasData ? "1" : "0"}`;

  const chartData: ChartData<"doughnut"> = {
    labels: detailWithPercentage.map((d) => d.label),
    datasets: [
      {
        data: detailWithPercentage.map((d) => d.value),
        backgroundColor: detailWithPercentage.map(
          (d) => getCategoryColorPair(d.label).dark,
        ),
        borderWidth: 2,
        borderColor: "transparent",
        hoverBorderWidth: 0,
        hoverOffset: 28, // Animasi pop-out yang jauh lebih besar dan jelas saat kursor diarahkan
        offset: detailWithPercentage.map((_, idx) => (idx === 0 ? 8 : 0)), // Hanya juara 1 yang sedikit menonjol dari awal
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    layout: {
      padding: 15, // Memberikan ruang agar saat hoverOffset (pop-out) grafiknya tidak terpotong tepi canvas
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1300,
      easing: "easeOutQuart",
      delay: (ctx) =>
        ctx.type === "data" && ctx.mode === "default" ? ctx.dataIndex * 180 : 0,
    },
    transitions: {
      active: {
        animation: {
          duration: 400, // Animasi transisi hover yang mulus
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (ctx) => {
            const value = Number(ctx.raw ?? 0);
            const percentage = total > 0 ? (value / total) * 100 : 0;
            return ` ${numberFormatter.format(value)} dokumen (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100/80 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xl shadow-slate-200/20 dark:shadow-black/40 h-full flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growWidth {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>

      <div className="mb-6 relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Persentase Kategori
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distribusi dokumen berdasarkan jenis
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-sm">Belum ada data dokumen.</p>
        </div>
      ) : (
        <div key={chartKey} className="flex flex-col flex-1 gap-7 relative z-10">
          {/* 3 Top Stats - More premium look */}
          <div
            className="grid grid-cols-3 gap-3"
            style={{ animation: "fadeSlideUp 600ms ease-out both" }}
          >
            <div className="flex flex-col p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-0.5">
              <p className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider mb-1">Total Kategori</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">
                  <AnimatedNumber value={detailWithPercentage.length} />
                </span>
                <span className="text-xs text-slate-400">jenis</span>
              </div>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-0.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl -mr-4 -mt-4" />
              <p className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider mb-1">Dominan</p>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 truncate relative z-10">
                {topCategory?.label ?? "-"}
              </span>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-0.5">
              <p className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider mb-1">Persentase</p>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">
                {topCategory ? (
                  <AnimatedNumber value={topCategory.percentage} decimals={1} suffix="%" />
                ) : (
                  "0%"
                )}
              </span>
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="relative flex-1 min-h-[250px] w-full flex flex-col justify-center" style={{ animation: "fadeSlideUp 600ms ease-out 100ms both" }}>
            <Doughnut data={chartData} options={chartOptions} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center mt-2">
              <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-full h-24 w-24 flex flex-col items-center justify-center shadow-sm border border-slate-100/50 dark:border-slate-800/50">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Total</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                  <AnimatedNumber value={total} formatThousands />
                </p>
              </div>
            </div>
          </div>

          {/* Legend List (Leaderboard Style) */}
          <div className="flex flex-col gap-3 mt-auto">
            {detailWithPercentage.map((item, idx) => {
              const colors = getCategoryColorPair(item.label);
              return (
                <div
                  key={item.label}
                  className="group relative flex flex-col gap-1.5"
                  style={{
                    animation: "fadeSlideUp 500ms ease-out both",
                    animationDelay: `${200 + idx * 75}ms`,
                  }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-md shadow-sm flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: colors.dark }}
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        <AnimatedNumber value={item.value} formatThousands />
                      </span>
                      <span className="text-xs font-medium text-slate-400 w-10 text-right">
                        <AnimatedNumber value={item.percentage} decimals={1} suffix="%" />
                      </span>
                    </div>
                  </div>

                  {/* Sleek Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.percentage}%`,
                        background: `linear-gradient(90deg, ${colors.light} 0%, ${colors.dark} 100%)`,
                        transformOrigin: "left center",
                        animation: "growWidth 1s ease-out both",
                        animationDelay: `${400 + idx * 75}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
