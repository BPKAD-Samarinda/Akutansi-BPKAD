import { useState } from "react";
import { Document, ToastState } from "../types";

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
  ) => {
    let result = [...docs];

    // 🔍 Search filter (cari di nama_sppd & kategori)
    if (searchQuery) {
      result = result.filter((doc) =>
        doc.nama_sppd.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.kategori.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 📅 Date range filter (pakai tanggal_sppd langsung)
    if (startDate || endDate) {
      result = result.filter((doc) => {
        const docDate = new Date(doc.tanggal_sppd);

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
    handleRefresh,
  };
}