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

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateTime(dateText: string, hourSeed: number) {
  const hour = String(8 + (hourSeed % 9)).padStart(2, "0");
  const minute = String((hourSeed * 7) % 60).padStart(2, "0");
  return `${dateText} ${hour}:${minute}`;
}

function formatDateLabel(dateText: string) {
  const [year, month, day] = dateText.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const monthIndex = Number(month) - 1;
  return `${day} ${monthNames[monthIndex]} ${year}`;
}

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
  const categoryOptions = useMemo(() => ["all", ...categories] as const, []);

  const todayUploadCount = useMemo(() => {
    const todayIso = toIsoDate(new Date());
    return uploadRecords.filter((record) => record.uploadedAt === todayIso).length;
  }, []);

  const latestUploadedDocument = useMemo(() => {
    if (!uploadRecords.length) return null;

    const latest = [...uploadRecords].sort((a, b) =>
      a.uploadedAt < b.uploadedAt ? 1 : -1,
    )[0];

    return {
      name: `Dokumen_${latest.kategori}_${latest.id}.pdf`,
      uploadedAt: formatDateTime(latest.uploadedAt, latest.id),
    };
  }, []);

  const uploadActivityRows = useMemo(() => {
    return [...uploadRecords]
      .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))
      .slice(0, 7)
      .map((record) => ({
        id: record.id,
        name: `Dokumen_${record.kategori}_${record.id}.pdf`,
        kategori: record.kategori,
        tanggal: formatDateLabel(record.uploadedAt),
      }));
  }, []);

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    monthOptions,
    yearOptions,
    categoryOptions,
    totalDocuments,
    totalStaffUsers,
    totalLogins,
    todayUploadCount,
    latestUploadedDocument,
    uploadActivityRows,
    distributionData,
    trendData,
    filteredLogins,
  };
}
