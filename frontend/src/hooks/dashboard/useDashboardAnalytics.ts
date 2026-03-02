import { useMemo, useState } from "react";
import {
  categories,
  loginActivities,
  monthOptions,
  uploadRecords,
  yearOptions,
  type DashboardCategory,
} from "../../data/mockDashboardStats";

type CategoryFilter = "all" | DashboardCategory;

export function useDashboardAnalytics() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

  const filteredUploads = useMemo(() => {
    return uploadRecords.filter((r) => {
      const d = new Date(r.uploadedAt);
      const yearMatch = d.getFullYear() === selectedYear;
      const monthMatch = selectedMonth === 0 || d.getMonth() + 1 === selectedMonth;
      const categoryMatch = selectedCategory === "all" || r.kategori === selectedCategory;
      return yearMatch && monthMatch && categoryMatch;
    });
  }, [selectedYear, selectedMonth, selectedCategory]);

  const distributionData = useMemo(() => {
    const target = selectedCategory === "all" ? categories : [selectedCategory];
    return target.map((kategori) => ({
      label: kategori,
      value: filteredUploads.filter((r) => r.kategori === kategori).length,
    }));
  }, [filteredUploads, selectedCategory]);

  const trendData = useMemo(() => {
    const base = Array.from({ length: 12 }, (_, i) => ({
      label: monthOptions[i + 1].label.slice(0, 3),
      value: 0,
    }));

    uploadRecords.forEach((r) => {
      const d = new Date(r.uploadedAt);
      const yearMatch = d.getFullYear() === selectedYear;
      const categoryMatch = selectedCategory === "all" || r.kategori === selectedCategory;
      if (!yearMatch || !categoryMatch) return;
      base[d.getMonth()].value += 1;
    });

    return base;
  }, [selectedYear, selectedCategory]);

  const filteredLogins = useMemo(() => {
    return loginActivities
      .filter((l) => {
        const datePart = l.loginAt.split(" ")[0];
        const d = new Date(datePart);
        const yearMatch = d.getFullYear() === selectedYear;
        const monthMatch = selectedMonth === 0 || d.getMonth() + 1 === selectedMonth;
        return yearMatch && monthMatch;
      })
      .sort((a, b) => (a.loginAt < b.loginAt ? 1 : -1));
  }, [selectedYear, selectedMonth]);

  const totalDocuments = filteredUploads.length;
  const totalStaffUsers = new Set(
    filteredLogins.filter((x) => x.role === "Staff").map((x) => x.username),
  ).size;
  const totalLogins = filteredLogins.length;

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    monthOptions,
    yearOptions,
    categoryOptions: ["all", ...categories] as const,
    totalDocuments,
    totalStaffUsers,
    totalLogins,
    distributionData,
    trendData,
    filteredLogins,
  };
}
