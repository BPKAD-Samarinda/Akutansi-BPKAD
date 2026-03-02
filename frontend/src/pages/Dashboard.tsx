import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import DashboardDistributionChart from "../components/dashboard/charts/DashboardDistributionChart";
import DashboardTrendChart from "../components/dashboard/charts/DashboardTrendChart";
import DashboardLoginActivity from "../components/dashboard/tables/DashboardLoginActivity";
import DashboardPieChart from "../components/dashboard/charts/DashboardPieChart";
import { useDashboardAnalytics } from "../hooks/dashboard/useDashboardAnalytics";

export default function Dashboard() {
  const dist = useDashboardAnalytics();
  const trend = useDashboardAnalytics();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [trendPeriod, setTrendPeriod] = useState<"week" | "month" | "year">("year");

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate-item]",
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.1,
          clearProps: "transform,opacity,visibility",
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />
      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Dashboard" />

        <main ref={pageRef} className="flex-1 p-4 lg:p-8 space-y-6">
          <div data-animate-item className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-orange-100 p-5">
              <p className="text-sm font-medium text-gray-500">Total Dokumen</p>
              <p className="text-3xl font-bold text-orange-500">{dist.totalDocuments}</p>
            </div>
            <div className="bg-white rounded-2xl border border-blue-100 p-5">
              <p className="text-sm font-medium text-gray-500">Total User Staff</p>
              <p className="text-3xl font-bold text-blue-500">{dist.totalStaffUsers}</p>
            </div>
            <div className="bg-white rounded-2xl border border-teal-100 p-5">
              <p className="text-sm font-medium text-gray-500">Total Login</p>
              <p className="text-3xl font-bold text-teal-500">{dist.totalLogins}</p>
            </div>
          </div>

          <div data-animate-item className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <DashboardDistributionChart
              data={dist.distributionData}
              selectedCategory={dist.selectedCategory}
              selectedMonth={dist.selectedMonth}
              selectedYear={dist.selectedYear}
              onChangeCategory={dist.setSelectedCategory}
              onChangeMonth={dist.setSelectedMonth}
              onChangeYear={dist.setSelectedYear}
              categoryOptions={dist.categoryOptions}
              monthOptions={dist.monthOptions}
              yearOptions={dist.yearOptions}
            />

            <DashboardTrendChart
              data={trend.trendData}
              selectedCategory={trend.selectedCategory}
              selectedYear={trend.selectedYear}
              selectedPeriod={trendPeriod}
              onChangeCategory={trend.setSelectedCategory}
              onChangeYear={trend.setSelectedYear}
              onChangePeriod={setTrendPeriod}
              categoryOptions={trend.categoryOptions}
              yearOptions={trend.yearOptions}
            />
          </div>

          <div data-animate-item>
            <DashboardPieChart data={dist.distributionData} />
          </div>

          <div data-animate-item>
            <DashboardLoginActivity data={dist.filteredLogins} />
          </div>
        </main>
      </div>
    </div>
  );
}
