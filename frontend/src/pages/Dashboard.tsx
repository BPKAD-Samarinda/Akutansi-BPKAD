import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import DashboardDistributionChart from "../components/dashboard/charts/DashboardDistributionChart";
import DashboardTrendChart from "../components/dashboard/charts/DashboardTrendChart";
import DashboardLoginActivity from "../components/dashboard/tables/DashboardLoginActivity";
import DashboardUploadActivityCard from "../components/dashboard/cards/DashboardUploadActivityCard";
import DashboardPieChart from "../components/dashboard/charts/DashboardPieChart";
import { useDashboardAnalytics } from "../hooks/dashboard/useDashboardAnalytics";
import { useChartFilterAnimation } from "../hooks/dashboard/useChartFilterAnimation";
import { getUser } from "../utils/auth";

type AnimatedStatNumberProps = {
  value: number;
  duration?: number;
};

function AnimatedStatNumber({ value, duration = 900 }: AnimatedStatNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return <>{display}</>;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  // Pisah state per-card agar filter tidak saling mempengaruhi.
  const summary = useDashboardAnalytics();
  const distribution = useDashboardAnalytics();
  const trend = useDashboardAnalytics();
  const pie = useDashboardAnalytics();
  const login = useDashboardAnalytics();

  const pageRef = useRef<HTMLDivElement | null>(null);
  const distributionFilter = useChartFilterAnimation({
    selectedCategory: distribution.selectedCategory,
    selectedMonth: distribution.selectedMonth,
    selectedYear: distribution.selectedYear,
    setSelectedCategory: distribution.setSelectedCategory,
    setSelectedMonth: distribution.setSelectedMonth,
    setSelectedYear: distribution.setSelectedYear,
  });

  const trendFilter = useChartFilterAnimation({
    selectedCategory: trend.selectedCategory,
    selectedMonth: trend.selectedMonth,
    selectedYear: trend.selectedYear,
    setSelectedCategory: trend.setSelectedCategory,
    setSelectedMonth: trend.setSelectedMonth,
    setSelectedYear: trend.setSelectedYear,
  });

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-animate-item]", {
        y: 20,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.08,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 lg:ml-64 flex-1 flex flex-col">
        <Header title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main ref={pageRef} className="flex-1 p-4 lg:p-8 space-y-6">
          <div data-animate-item className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white p-4 shadow-md shadow-orange-500/20 transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-500/30">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15"></div>
              <div className="absolute right-10 top-8 h-16 w-16 rounded-full bg-white/10"></div>
              <div className="flex items-center justify-end">
                <span className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 3h7l5 5v13H7V3z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-2 text-center">
                <p className="text-4xl font-bold">
                  <AnimatedStatNumber value={summary.totalDocuments} />
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/85 mt-2">
                  Total Dokumen
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white p-4 shadow-md shadow-blue-500/20 transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/30">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15"></div>
              <div className="absolute right-10 top-8 h-16 w-16 rounded-full bg-white/10"></div>
              <div className="flex items-center justify-end">
                <span className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM16 14c-2.761 0-5 1.79-5 4v2h10v-2c0-2.21-2.239-4-5-4zM8 14c-2.761 0-5 1.79-5 4v2h6v-2c0-1.33.402-2.57 1.09-3.62C9.479 14.134 8.76 14 8 14z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-2 text-center">
                <p className="text-4xl font-bold">
                  <AnimatedStatNumber value={summary.totalUsers} />
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/85 mt-2">
                  Total Pengguna
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white p-4 shadow-md shadow-emerald-500/20 transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-500/30">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15"></div>
              <div className="absolute right-10 top-8 h-16 w-16 rounded-full bg-white/10"></div>
              <div className="flex items-center justify-end">
                <span className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v10m0 0l-4-4m4 4l4-4M5 19h14"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-2 text-center">
                <p className="text-4xl font-bold">
                  <AnimatedStatNumber value={summary.todayUploadCount} />
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/85 mt-2">
                  Unggah Hari Ini
                </p>
              </div>
            </div>
          </div>

          <div data-animate-item className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {distribution.isLoaded ? (
              <DashboardDistributionChart
                data={distribution.distributionData}
                animationNonce={distributionFilter.animationNonce}
                selectedCategory={distribution.selectedCategory}
                selectedMonth={distribution.selectedMonth}
                selectedYear={distribution.selectedYear}
                onChangeCategory={distributionFilter.handleCategoryChange}
                onChangeMonth={distributionFilter.handleMonthChange}
                onChangeYear={distributionFilter.handleYearChange}
                categoryOptions={distribution.categoryOptions}
                monthOptions={distribution.monthOptions}
                yearOptions={distribution.yearOptions}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-[392px]" />
            )}

            {trend.isLoaded ? (
              <DashboardTrendChart
                data={trend.trendData}
                animationNonce={trendFilter.animationNonce}
              trendMode={trend.trendMode}
              trendUploadDays={trend.trendUploadDays}
              trendEmptyDays={trend.trendEmptyDays}
              selectedCategory={trend.selectedCategory}
              selectedMonth={trend.selectedMonth}
              selectedYear={trend.selectedYear}
                onChangeCategory={trendFilter.handleCategoryChange}
                onChangeMonth={trendFilter.handleMonthChange}
                onChangeYear={trendFilter.handleYearChange}
                categoryOptions={trend.categoryOptions}
                monthOptions={trend.monthOptions}
                yearOptions={trend.yearOptions}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-[392px]" />
            )}
          </div>

          {(user?.role === "Admin" || user?.role === "Admin Akuntansi") && (
            <div
              data-animate-item
              className="grid grid-cols-1 xl:grid-cols-2 gap-4"
            >
              <DashboardPieChart data={pie.distributionData} />
              <DashboardLoginActivity data={login.filteredLogins} />
            </div>
          )}

          <div data-animate-item>
            <DashboardUploadActivityCard
              todayRows={summary.todayUploadRows}
              latestRows={summary.latestUploadRows}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
