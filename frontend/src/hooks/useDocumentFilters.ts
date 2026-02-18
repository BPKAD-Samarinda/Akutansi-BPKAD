import { useState } from "react";
import { Document, ToastState } from "../types";
import { parseIndonesianDate } from "../utils/dateUtils";

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

    // Search filter
    if (searchQuery) {
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Date range filter
    if (startDate || endDate) {
      result = result.filter((doc) => {
        const docDate = parseIndonesianDate(doc.date);

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return docDate >= start && docDate <= end;
        } else if (startDate) {
          const start = new Date(startDate);
          return docDate >= start;
        } else if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return docDate <= end;
        }
        return true;
      });
    }

    // Category filter
    if (category) {
      result = result.filter((doc) => doc.category === category);
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
      showToast(`Tidak ada dokumen kategori ${category}`, "info");
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
