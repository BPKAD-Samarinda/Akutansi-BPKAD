import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiFileText, FiClipboard, FiUsers, FiUploadCloud, FiTrendingUp } from "react-icons/fi";
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
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 lg:ml-[280px] flex-1 flex flex-col relative transition-all duration-300">
        <Header title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main ref={pageRef} className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 relative z-10">
          <div data-animate-item className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
            {/* Card 1: Manajemen Dokumen */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/5 dark:from-orange-500/10 dark:to-transparent rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 tracking-wide">
                    Manajemen Dokumen
                  </p>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    <AnimatedStatNumber value={summary.totalDocuments} />
                  </h3>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <FiFileText className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full">
                <FiTrendingUp className="w-3.5 h-3.5" />
                <span>Selalu diperbarui</span>
              </div>
            </div>

            {/* Card 2: Dokumen SKP */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 dark:from-indigo-500/10 dark:to-transparent rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 tracking-wide">
                    Dokumen SKP
                  </p>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    <AnimatedStatNumber value={summary.totalSkpDocuments} />
                  </h3>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <FiClipboard className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 w-fit px-2.5 py-1 rounded-full">
                <FiTrendingUp className="w-3.5 h-3.5" />
                <span>Kinerja termonitor</span>
              </div>
            </div>

            {/* Card 3: Total Pengguna */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-blue-500/5 dark:from-sky-500/10 dark:to-transparent rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 tracking-wide">
                    Total Pengguna
                  </p>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    <AnimatedStatNumber value={summary.totalUsers} />
                  </h3>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <FiUsers className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 w-fit px-2.5 py-1 rounded-full">
                <FiUsers className="w-3.5 h-3.5" />
                <span>Akses aktif</span>
              </div>
            </div>

            {/* Card 4: Unggah Hari Ini */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/10 dark:to-transparent rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 tracking-wide">
                    Unggah Hari Ini
                  </p>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    <AnimatedStatNumber value={summary.todayUploadCount} />
                  </h3>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <FiUploadCloud className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full">
                <FiUploadCloud className="w-3.5 h-3.5" />
                <span>Data terbaru</span>
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
