import { useEffect, useState } from "react";
import { Document, ToastState } from "../../types";
import { toLocalDateOnly } from "../../utils/localDate";

export function useDocumentFilters(
  initialData: Document[],
  showToast: (message: string, type: ToastState["type"]) => void,
) {
  const [documents, setDocuments] = useState<Document[]>(initialData);
  const [filteredDocuments, setFilteredDocuments] =
    useState<Document[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");

  const applyFilters = (
    docs: Document[],
    searchValue: string,
    startValue: string,
    endValue: string,
    categoryValue: string,
  ) => {
    let result = [...docs];

    // Search filter (nama_sppd & kategori)
    if (searchValue) {
      result = result.filter(
        (doc) =>
          doc.nama_sppd.toLowerCase().includes(searchValue.toLowerCase()) ||
          doc.kategori.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }

    // Date range filter (aman dari masalah timezone)
    if (startValue || endValue) {
      result = result.filter((doc) => {
        // Normalisasi ke local date agar tidak mundur 1 hari karena timezone/UTC.
        const docDate = toLocalDateOnly(doc.tanggal_sppd || "");

        if (!docDate) return false;

        if (startValue && docDate < startValue) return false;
        if (endValue && docDate > endValue) return false;

        return true;
      });
    }

    // Category filter
    if (categoryValue) {
      result = result.filter((doc) => doc.kategori === categoryValue);
    }

    return result;
  };

  const runFilters = (
    nextSearch = searchQuery,
    nextStart = startDate,
    nextEnd = endDate,
    nextCategory = category,
  ) => {
    const filtered = applyFilters(
      documents,
      nextSearch,
      nextStart,
      nextEnd,
      nextCategory,
    );
    setFilteredDocuments(filtered);
    return filtered;
  };

  useEffect(() => {
    runFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = runFilters(query);

    if (query && filtered.length === 0) {
      showToast("Tidak ada dokumen yang cocok dengan pencarian", "info");
    }
  };

  const handleDateRangeFilter = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
    const filtered = runFilters(searchQuery, startDate, endDate);

    if ((startDate || endDate) && filtered.length === 0) {
      showToast("Tidak ada dokumen pada rentang tanggal ini", "info");
    }
  };

  const handleCategoryFilter = (category: string) => {
    setCategory(category);
    const filtered = runFilters(searchQuery, startDate, endDate, category);

    if (category && filtered.length === 0) {
      showToast("Tidak ada dokumen pada kategori ini", "info");
    }
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setCategory("");
    setFilteredDocuments(documents);
    showToast("Filter telah direset", "info");
  };

  return {
    documents,
    setDocuments,
    filteredDocuments,
    setFilteredDocuments,
    handleSearch,
    handleDateRangeFilter,
    handleCategoryFilter,
    handleRefresh,
  };
}
