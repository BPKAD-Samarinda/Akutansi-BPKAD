import { memo, useMemo } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions, ScriptableContext } from "chart.js";

type TopLoginUser = {
  username: string;
  count: number;
};

type Props = {
  data: TopLoginUser[];
};

function DashboardTopLoginChart({ data }: Props) {
  const hasData = data && data.length > 0;

  const chartData: ChartData<"bar"> = useMemo(() => {
    return {
      labels: data.map((d) => d.username),
      datasets: [
        {
          label: "Jumlah Login",
          data: data.map((d) => d.count),
          backgroundColor: (ctx: ScriptableContext<"bar">) => {
            const chart = ctx.chart;
            const area = chart.chartArea;
            if (!area) return "rgba(168, 85, 247, 0.8)";
            const gradient = chart.ctx.createLinearGradient(area.left, 0, area.right, 0);
            gradient.addColorStop(0, "rgba(168, 85, 247, 0.4)");
            gradient.addColorStop(1, "rgba(168, 85, 247, 0.9)");
            return gradient;
          },
          borderColor: "rgba(168, 85, 247, 0)",
          borderWidth: 0,
          borderRadius: 6,
          maxBarThickness: 20,
        },
      ],
    };
  }, [data]);

  const chartOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1000, easing: "easeOutQuart" },
      animations: {
        x: {
          from: 0,
          duration: (ctx: ScriptableContext<"bar">) =>
            ctx.mode === "resize" ? 0 : 1000,
          easing: "easeOutCubic",
          delay: (ctx: ScriptableContext<"bar">) =>
            ctx.mode === "default" && ctx.type === "data" ? ctx.dataIndex * 150 : 0,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(4px)",
          titleColor: "#94a3b8",
          bodyColor: "#f8fafc",
          bodyFont: { weight: "bold", size: 13 },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (ctx) => `${ctx.raw} kali login`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { precision: 0, color: "#94a3b8", font: { size: 11 } },
          grid: { 
            color: "rgba(148,163,184,0.1)",
            tickBorderDash: [4, 4],
          },
          border: { display: false }
        },
        y: {
          grid: { display: false },
          ticks: { color: "#475569", font: { size: 12, weight: "bold" } },
          border: { display: false }
        },
      },
    }),
    [],
  );

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-xl shadow-slate-200/20 dark:shadow-black/40 h-full flex flex-col relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="mb-6 flex items-start gap-3 relative z-10">
        <div className="h-10 w-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-500/10 flex items-center justify-center shrink-0 border border-fuchsia-100 dark:border-fuchsia-500/20 text-fuchsia-500 shadow-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Pengguna Teraktif
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Berdasarkan frekuensi login
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[280px] relative z-10">
        {!hasData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            Belum ada data login.
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}

export default memo(DashboardTopLoginChart);
