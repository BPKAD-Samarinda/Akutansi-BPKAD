import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

type Props = {
  data: { label: string; value: number }[];
};

const CATEGORY_COLORS: Record<string, string> = {
  Lampiran: "#F97316",
  Keuangan: "#3B82F6",
  BPKU: "#14B8A6",
  STS: "#6366F1",
};

const numberFormatter = new Intl.NumberFormat("id-ID");

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
          (d) => CATEGORY_COLORS[d.label] ?? "#94A3B8",
        ),
        borderWidth: 0,
        hoverOffset: 14,
        offset: detailWithPercentage.map((_, idx) => (idx === 0 ? 10 : 4)),
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1300,
      easing: "easeOutQuart",
      delay: (ctx) =>
        ctx.type === "data" && ctx.mode === "default" ? ctx.dataIndex * 180 : 0,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = Number(ctx.raw ?? 0);
            const percentage = total > 0 ? (value / total) * 100 : 0;
            return `${ctx.label}: ${numberFormatter.format(value)} dokumen (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
      <style>{`
        @keyframes slideInRightSoft {
          from {
            opacity: 0;
            transform: translateX(-22px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes growRight {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>

      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Komposisi Dokumen</h3>
        <p className="text-sm text-slate-500 mt-1">
          Distribusi dokumen berdasarkan kategori dengan persentase kontribusi.
        </p>
      </div>

      {!hasData ? (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          Belum ada data pada filter ini.
        </div>
      ) : (
        <div key={chartKey} className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="relative h-[300px] lg:col-span-2">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
              <p className="text-3xl font-bold text-slate-800">
                {numberFormatter.format(total)}
              </p>
              <p className="text-xs text-slate-500">Dokumen</p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-2"
              style={{
                animation: "slideInRightSoft 520ms ease-out both",
                animationDelay: "80ms",
              }}
            >
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Total Kategori</p>
                <p className="text-lg font-semibold text-slate-800">
                  {detailWithPercentage.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Kategori Dominan</p>
                <p className="text-lg font-semibold text-slate-800">
                  {topCategory?.label ?? "-"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Persentase Tertinggi</p>
                <p className="text-lg font-semibold text-slate-800">
                  {topCategory ? `${topCategory.percentage.toFixed(1)}%` : "0%"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {detailWithPercentage.map((item, idx) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-100 p-3"
                  style={{
                    animation: "slideInRightSoft 500ms ease-out both",
                    animationDelay: `${180 + idx * 100}ms`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[item.label] ?? "#94A3B8" }}
                      />
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {numberFormatter.format(item.value)} ({item.percentage.toFixed(1)}%)
                    </p>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: CATEGORY_COLORS[item.label] ?? "#94A3B8",
                        transformOrigin: "left center",
                        animation: "growRight 900ms ease-out both",
                        animationDelay: `${260 + idx * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
