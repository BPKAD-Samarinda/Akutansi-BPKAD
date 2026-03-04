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
  // Pisah state per-card agar filter tidak saling mempengaruhi.
  const summary = useDashboardAnalytics();
  const distribution = useDashboardAnalytics();
  const trend = useDashboardAnalytics();
  const pie = useDashboardAnalytics();
  const login = useDashboardAnalytics();

  const pageRef = useRef<HTMLDivElement | null>(null);

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
    <div className="min-h-screen flex bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />
      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col">
        <Header title="Dashboard" />

        <main ref={pageRef} className="flex-1 p-4 lg:p-8 space-y-6">
          <div data-animate-item className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-orange-100 p-5">
              <p className="text-sm font-medium text-gray-500">Total Dokumen</p>
              <p className="text-3xl font-bold text-orange-500">
                <AnimatedStatNumber value={summary.totalDocuments} />
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-blue-100 p-5">
              <p className="text-sm font-medium text-gray-500">Total User Staff</p>
              <p className="text-3xl font-bold text-blue-500">
                <AnimatedStatNumber value={summary.totalStaffUsers} />
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-teal-100 p-5">
              <p className="text-sm font-medium text-gray-500">Aktivitas Hari Ini</p>
              <p className="text-3xl font-bold text-teal-500">
                <AnimatedStatNumber value={summary.todayUploadCount} />
              </p>
            </div>
          </div>

          <div data-animate-item className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <DashboardDistributionChart
              data={distribution.distributionData}
              selectedCategory={distribution.selectedCategory}
              selectedMonth={distribution.selectedMonth}
              selectedYear={distribution.selectedYear}
              onChangeCategory={distribution.setSelectedCategory}
              onChangeMonth={distribution.setSelectedMonth}
              onChangeYear={distribution.setSelectedYear}
              categoryOptions={distribution.categoryOptions}
              monthOptions={distribution.monthOptions}
              yearOptions={distribution.yearOptions}
            />

            <DashboardTrendChart
              data={trend.trendData}
              trendMode={trend.trendMode}
              trendUploadDays={trend.trendUploadDays}
              trendEmptyDays={trend.trendEmptyDays}
              selectedCategory={trend.selectedCategory}
              selectedMonth={trend.selectedMonth}
              selectedYear={trend.selectedYear}
              onChangeCategory={trend.setSelectedCategory}
              onChangeMonth={trend.setSelectedMonth}
              onChangeYear={trend.setSelectedYear}
              categoryOptions={trend.categoryOptions}
              monthOptions={trend.monthOptions}
              yearOptions={trend.yearOptions}
            />
          </div>

          <div data-animate-item className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <DashboardPieChart data={pie.distributionData} />
            <DashboardLoginActivity data={login.filteredLogins} />
          </div>

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
