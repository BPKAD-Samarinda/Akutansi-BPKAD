import { useState, useEffect } from "react";
import { parseIndonesianDate } from "../utils/dateUtils";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import FilterBar from "../components/document/FilterBar";
import DocumentTable from "../components/document/DocumentTable";
import EditModal from "../components/document/EditModal";
import Toast from "../components/ui/Toast";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { getDocuments, Document } from "../services/api"; // <-- DIUBAH

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]); // <-- DIUBAH: Mulai dengan array kosong
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]); // <-- DIUBAH: Mulai dengan array kosong
  const [loading, setLoading] = useState<boolean>(true); // <-- BARU: State untuk loading

  const [selectedDocuments, setSelectedDocuments] = useState<
    Set<number | string>
  >(new Set());
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    documentId: null as number | string | null,
    documentName: "",
    isMultiple: false,
  });

  // --- BARU: Mengambil data dari API saat komponen dimuat ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(data);
      setFilteredDocuments(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  // Fungsi parseIndonesianDate dan applyFilters tidak diubah, tetap di sini
  const parseIndonesianDate = (dateStr: string): Date => {
    const months: { [key: string]: number } = {
      Januari: 0,
      Februari: 1,
      Maret: 2,
      April: 3,
      Mei: 4,
      Juni: 5,
      Juli: 6,
      Agustus: 7,
      September: 8,
      Oktober: 9,
      November: 10,
      Desember: 11,
    };
    const parts = dateStr.split(" ");
    if (parts.length < 3) return new Date(); // Handle invalid date format
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  };

  const applyFilters = (
    docs: Document[],
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    category?: string,
  ) => {
    let result = [...docs];
    if (searchQuery) {
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (startDate || endDate) {
      result = result.filter((doc) => {
        const docDate = parseIndonesianDate(doc.date);
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return docDate >= start && docDate <= end;
        } else if (startDate) {
          return docDate >= new Date(startDate);
        } else if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return docDate <= end;
        }
        return true;
      });
    }
    if (category && "category" in result[0]) {
      // Check if category exists
      result = result.filter((doc) => (doc as any).category === category);
    }
    return result;
  };

  // Semua fungsi handler (handleSearch, handleDelete, dll) tidak perlu diubah
  // karena mereka sudah bekerja dengan state `documents` dan `filteredDocuments`.
  // ... (Sisa fungsi handler tetap sama) ...

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
    setSelectedDocuments(new Set());
    showToast("Filter telah direset", "info");
  };

  const handleSelectDocument = (id: number | string) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocuments(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredDocuments.map((doc) => doc.id));
      setSelectedDocuments(allIds);
    } else {
      setSelectedDocuments(new Set());
    }
  };

  const handleView = (id: number | string) => {
    const doc = documents.find((d) => d.id === id);
    showToast(
      `Melihat ${doc?.name || "dokumen"}... (fungsi preview belum diimplementasikan)`,
      "info",
    );
  };

  const handleEdit = (id: number | string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      setEditingDocument(doc);
    }
  };

  const handleSaveEdit = (
    id: number | string,
    updatedData: Partial<Document>,
  ) => {
    // NOTE: This now only updates the local state.
    // A full implementation would require a PUT request to the backend.
    const updatedDocuments = documents.map((doc) =>
      doc.id === id ? { ...doc, ...updatedData } : doc,
    );
    setDocuments(updatedDocuments);
    setFilteredDocuments(applyFilters(updatedDocuments)); // Re-apply filters
    showToast("Dokumen berhasil diperbarui (secara lokal)!", "success");
  };

  const handleDelete = (id: number | string) => {
    const doc = documents.find((d) => d.id === id);
    setConfirmDialog({
      isOpen: true,
      documentId: id,
      documentName: doc?.name || "dokumen ini",
      isMultiple: false,
    });
  };

  const handleDeleteSelected = () => {
    if (selectedDocuments.size === 0) {
      showToast("Tidak ada dokumen yang dipilih", "warning");
      return;
    }
    setConfirmDialog({
      isOpen: true,
      documentId: null,
      documentName: `${selectedDocuments.size} dokumen`,
      isMultiple: true,
    });
  };

  const handleDownloadSelected = () => {
    showToast(
      `Mengunduh ${selectedDocuments.size} dokumen... (fungsi download belum diimplementasikan)`,
      "info",
    );
  };

  const confirmDelete = () => {
    // NOTE: This now only updates the local state.
    // A full implementation would require a DELETE request to the backend.
    if (confirmDialog.isMultiple) {
      const updatedDocuments = documents.filter(
        (doc) => !selectedDocuments.has(doc.id),
      );
      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);
      setSelectedDocuments(new Set());
      showToast(
        `${selectedDocuments.size} dokumen berhasil dihapus (secara lokal)!`,
        "success",
      );
    } else if (confirmDialog.documentId) {
      const updatedDocuments = documents.filter(
        (doc) => doc.id !== confirmDialog.documentId,
      );
      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);
      selectedDocuments.delete(confirmDialog.documentId);
      setSelectedDocuments(new Set(selectedDocuments));
      showToast("Dokumen berhasil dihapus (secara lokal)!", "success");
    }
    setConfirmDialog({
      isOpen: false,
      documentId: null,
      documentName: "",
      isMultiple: false,
    });
  };

  const cancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      documentId: null,
      documentName: "",
      isMultiple: false,
    });
  };

  return (
    <div className="min-h-screen flex bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />
      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Dashboard" />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 lg:mb-8 animate-[slideDown_0.6s_ease-out]">
            <h1 className="hidden lg:block text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
              Dashboard Dokumen
            </h1>
            <p className="hidden lg:block text-gray-600 mt-2 font-medium">
              Kelola dan organisir dokumen keuangan Anda
            </p>
          </div>

          {/* Action Bar for Selected Documents */}
          {selectedDocuments.size > 0 && (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex justify-between items-center animate-[slideDown_0.3s_ease-out]">
              <span className="text-orange-700 font-semibold text-sm lg:text-base">
                {selectedDocuments.size} dokumen dipilih
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadSelected}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-sm shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Unduh Terpilih
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Hapus Terpilih
                </button>
              </div>
            </div>
          )}

          <div className="mb-6 lg:mb-8 animate-[slideUp_0.6s_ease-out_0.1s_both]">
            <FilterBar
              onSearch={handleSearch}
              onDateRangeChange={handleDateRangeFilter}
              onCategoryChange={handleCategoryFilter}
              onRefresh={handleRefresh}
            />
          </div>

          <div className="animate-[slideUp_0.6s_ease-out_0.2s_both]">
            {/* --- BARU: Tampilkan loading indicator --- */}
            {loading ? (
              <div className="text-center py-20 text-gray-500">
                <p>Mengambil data dari server...</p>
              </div>
            ) : (
              <DocumentTable
                documents={filteredDocuments}
                totalDocuments={documents.length}
                selectedDocuments={selectedDocuments}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelectDocument={handleSelectDocument}
                onSelectAll={handleSelectAll}
              />
            )}
          </div>
        </main>
      </div>

      <EditModal
        isOpen={editingDocument !== null}
        document={editingDocument}
        onClose={() => setEditingDocument(null)}
        onSave={handleSaveEdit}
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
