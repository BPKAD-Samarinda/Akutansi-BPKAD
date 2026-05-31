import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  FiFileText,
  FiClipboard,
  FiUsers,
  FiUploadCloud,
} from "react-icons/fi";
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

// ── Animated counter ─────────────────────────────────────────────────────────
type AnimatedStatNumberProps = { value: number; duration?: number };
function AnimatedStatNumber({ value, duration = 900 }: AnimatedStatNumberProps) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frameId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);
  return <>{display}</>;
}



// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  const isAdmin = user?.role === "Admin" || user?.role === "Admin Akuntansi";

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
    <div className="min-h-screen w-full flex bg-slate-50/50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 lg:ml-[280px] flex-1 min-w-0 flex flex-col relative transition-all duration-300 overflow-x-hidden">
        <Header title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main ref={pageRef} className="flex-1 p-4 lg:p-6 space-y-5 lg:space-y-6 relative z-10">

          {/* ═══════════════════════════════════════════════════════════════════
              Baris 1: 4 Stat Cards + badge Naik/Turun
          ═══════════════════════════════════════════════════════════════════ */}
          <div data-animate-item className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">

            {/* Manajemen Dokumen */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 border-l-[5px] border-l-orange-500 p-4 sm:p-5 pl-5 sm:pl-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-3xl -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1">
                  Manajemen Dokumen
                </p>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  <AnimatedStatNumber value={summary.totalDocuments} />
                </h3>
              </div>
            </div>

            {/* Dokumen SKP */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 border-l-[5px] border-l-indigo-500 p-4 sm:p-5 pl-5 sm:pl-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-full blur-3xl -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1">
                  Dokumen Sasaran Kinerja Pegawai
                </p>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  <AnimatedStatNumber value={summary.totalSkpDocuments} />
                </h3>
              </div>
            </div>

            {/* Total Pengguna */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 border-l-[5px] border-l-sky-500 p-4 sm:p-5 pl-5 sm:pl-6 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-500/10 to-blue-500/5 rounded-full blur-3xl -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1">
                  Total Pengguna
                </p>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  <AnimatedStatNumber value={summary.totalUsers} />
                </h3>
              </div>
            </div>

            {/* Unggah Hari Ini */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 border-l-[5px] border-l-emerald-500 p-4 sm:p-5 pl-5 sm:pl-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-3xl -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1">
                  Unggah Hari Ini
                </p>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  <AnimatedStatNumber value={summary.todayUploadCount} />
                </h3>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              Baris 2: Kiri (Trend & Jumlah Dokumen), Kanan (Pie Chart)
          ═══════════════════════════════════════════════════════════════════ */}
          <div
            data-animate-item
            className="grid grid-cols-1 gap-4 items-stretch lg:grid-cols-[1fr_400px]"
          >
            {/* Kolom Kiri: Trend Chart & Distribution Chart */}
            <div className="flex flex-col gap-4 min-w-0">
              {/* Trend Chart */}
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
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm h-[300px]" />
              )}

              {/* Distribution Chart */}
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
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm h-[280px]" />
              )}
            </div>

            {/* Kolom Kanan: Pie Chart (Stretching down) */}
            <div className="h-full min-w-0">
              {pie.isLoaded ? (
                <DashboardPieChart data={pie.distributionData} />
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm h-full min-h-[460px]" />
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              Baris 4: Aktivitas Login (Kiri) + Top Login Chart (Kanan)
          ═══════════════════════════════════════════════════════════════════ */}
          {isAdmin && (
            <div data-animate-item className="w-full">
              <DashboardLoginActivity data={login.filteredLogins} />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              Baris 5: Aktivitas Dokumen (Hari Ini + Terakhir Diunggah)
          ═══════════════════════════════════════════════════════════════════ */}
          <div data-animate-item>
            <DashboardUploadActivityCard
              activities={summary.allUploadsActivity}
            />
          </div>

        </main>
      </div>
    </div>
  );
}
