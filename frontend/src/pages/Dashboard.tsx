import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import FilterBar from "../components/document/FilterBar";
import DocumentTable from "../components/document/DocumentTable";
import Toast from "../components/ui/Toast";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { Document } from "../types";

// Sample data
const initialDocuments: Document[] = [
  {
    id: 1,
    name: "Lampiran 26 Maret 2024",
    format: "PDF",
    size: "4.687 KB",
    date: "19 Maret 2024",
  },
  {
    id: 2,
    name: "Laporan Bulanan Februari",
    format: "XLSX",
    size: "8.123 KB",
    date: "18 Maret 2024",
  },
  {
    id: 3,
    name: "Presentasi Rapat Koordinasi",
    format: "PPTX",
    size: "12.456 KB",
    date: "15 Maret 2024",
  },
  {
    id: 4,
    name: "Dokumen Kontrak Vendor",
    format: "DOCX",
    size: "2.345 KB",
    date: "12 Maret 2024",
  },
  {
    id: 5,
    name: "Anggaran Q1 2024",
    format: "PDF",
    size: "5.234 KB",
    date: "10 Maret 2024",
  },
  {
    id: 6,
    name: "Data Transaksi Januari",
    format: "XLSX",
    size: "15.678 KB",
    date: "08 Maret 2024",
  },
  {
    id: 7,
    name: "Surat Keputusan Direksi",
    format: "PDF",
    size: "3.456 KB",
    date: "05 Maret 2024",
  },
  {
    id: 8,
    name: "Rencana Kerja Tahunan",
    format: "DOCX",
    size: "6.789 KB",
    date: "03 Maret 2024",
  },
  {
    id: 8,
    name: "Rencana Kerja Tahunan",
    format: "DOCX",
    size: "6.789 KB",
    date: "03 Maret 2024",
  },
  {
    id: 9,
    name: "Rencana Kerja Tahunan",
    format: "DOCX",
    size: "6.789 KB",
    date: "03 Maret 2024",
  },
  {
    id: 10,
    name: "Rencana Kerja Tahunan",
    format: "DOCX",
    size: "6.789 KB",
    date: "03 Maret 2024",
  },
  {
    id: 11,
    name: "Rencana Kerja Tahunan",
    format: "DOCX",
    size: "6.789 KB",
    date: "03 Maret 2024",
  },
  {
    id: 12,
    name: "Rencana Kerja Tahunan",
    format: "DOCX",
    size: "6.789 KB",
    date: "03 Maret 2024",
  },
  {
    id: 13,
    name: "Rencana Kerja Tahunan",
    format: "DOCX",
    size: "6.789 KB",
    date: "03 Maret 2024",
  },

];

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(initialDocuments);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "info" });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    documentId: null as number | string | null,
    documentName: "",
  });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  // Filter handlers
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter((doc) =>
      doc.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDocuments(filtered);

    if (filtered.length === 0) {
      showToast("Tidak ada dokumen yang cocok dengan pencarian", "info");
    }
  };

  const handleDateFilter = (date: string) => {
    if (!date) {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter((doc) => {
      const docDate = new Date(doc.date.split(" ").reverse().join("-"));
      const filterDate = new Date(date);
      return docDate.toDateString() === filterDate.toDateString();
    });
    setFilteredDocuments(filtered);

    if (filtered.length === 0) {
      showToast("Tidak ada dokumen pada tanggal ini", "info");
    }
  };

  const handleCategoryFilter = (category: string) => {
    if (!category) {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter(
      (doc) => doc.format.toLowerCase() === category.toLowerCase()
    );
    setFilteredDocuments(filtered);

    if (filtered.length === 0) {
      showToast(`Tidak ada dokumen ${category.toUpperCase()}`, "info");
    }
  };

  const handleRefresh = () => {
    setFilteredDocuments(documents);
    showToast("Filter telah direset", "info");
  };

  // Document action handlers
  const handleView = (id: number | string) => {
    const doc = documents.find((d) => d.id === id);
    showToast(`Membuka ${doc?.name || "dokumen"}...`, "info");
    console.log("View document:", id);
  };

  const handleEdit = (id: number | string) => {
    const doc = documents.find((d) => d.id === id);
    showToast(`Membuka editor untuk ${doc?.name || "dokumen"}...`, "info");
    console.log("Edit document:", id);
  };

  const handleDelete = (id: number | string) => {
    const doc = documents.find((d) => d.id === id);
    setConfirmDialog({
      isOpen: true,
      documentId: id,
      documentName: doc?.name || "dokumen ini",
    });
  };

  const confirmDelete = () => {
    if (confirmDialog.documentId) {
      const updatedDocuments = documents.filter((doc) => doc.id !== confirmDialog.documentId);
      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);

      showToast("Dokumen berhasil dihapus!", "success");
      console.log("Deleted document:", confirmDialog.documentId);
    }

    setConfirmDialog({ isOpen: false, documentId: null, documentName: "" });
  };

  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, documentId: null, documentName: "" });
  };

  return (
   <div className="min-h-screen flex bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />

      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Dashboard" />

        <main className="flex-1 p-4 lg:p-8">
          {/* Page Title */}
          <div className="mb-6 lg:mb-8 animate-[slideDown_0.6s_ease-out]">
            <h1 className="hidden lg:block text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
              Dashboard Dokumen
            </h1>
            <p className="hidden lg:block text-gray-600 mt-2 font-medium">
              Kelola dan organisir dokumen keuangan Anda
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-6 lg:mb-8 animate-[slideUp_0.6s_ease-out_0.1s_both]">
            <FilterBar
              onSearch={handleSearch}
              onDateChange={handleDateFilter}
              onCategoryChange={handleCategoryFilter}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Document Table */}
          <div className="animate-[slideUp_0.6s_ease-out_0.2s_both]">
            <DocumentTable
              documents={filteredDocuments}
              totalDocuments={documents.length}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Hapus Dokumen?"
        message={`Apakah Anda yakin ingin menghapus "${confirmDialog.documentName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        type="danger"
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}