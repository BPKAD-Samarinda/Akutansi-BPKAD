import { useState } from "react";
import { Document, ToastState } from "../../types";

export function useDocumentFilters(
  initialData: Document[],
  showToast: (message: string, type: ToastState["type"]) => void,
) {
  const [documents, setDocuments] = useState<Document[]>(initialData);
  const [filteredDocuments, setFilteredDocuments] =
    useState<Document[]>(initialData);

  const applyFilters = (
    docs: Document[],
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    category?: string,
  ) => {
    let result = [...docs];

    // Search filter (nama_sppd & kategori)
    if (searchQuery) {
      result = result.filter(
        (doc) =>
          doc.nama_sppd.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.kategori.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Date range filter (aman dari masalah timezone)
    if (startDate || endDate) {
      result = result.filter((doc) => {
        // Ambil format YYYY-MM-DD dari data dokumen
        const docDate = (doc.tanggal_sppd || "").slice(0, 10);

        if (!docDate) return false;

        if (startDate && docDate < startDate) return false;
        if (endDate && docDate > endDate) return false;

        return true;
      });
    }

    // Category filter
    if (category) {
      result = result.filter((doc) => doc.kategori === category);
    }

    return result;
  };

  const handleSearch = (query: string) => {
    const filtered = applyFilters(documents, query);
    setFilteredDocuments(filtered);

    if (query && filtered.length === 0) {
      showToast("Tidak ada dokumen yang cocok dengan pencarian", "info");
    }
  };

  const handleDateRangeFilter = (startDate: string, endDate: string) => {
    const filtered = applyFilters(documents, undefined, startDate, endDate);
    setFilteredDocuments(filtered);

    if ((startDate || endDate) && filtered.length === 0) {
      showToast("Tidak ada dokumen pada rentang tanggal ini", "info");
    }
  };

  const handleCategoryFilter = (category: string) => {
    const filtered = applyFilters(
      documents,
      undefined,
      undefined,
      undefined,
      category,
    );
    setFilteredDocuments(filtered);

    if (category && filtered.length === 0) {
      showToast("Tidak ada dokumen pada kategori ini", "info");
    }
  };

  const handleRefresh = () => {
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
