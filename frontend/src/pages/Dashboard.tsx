import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import FilterBar from "../components/document/FilterBar";
import DocumentTable from "../components/document/DocumentTable";
import SelectedActionsBar from "../components/document/SelectedActionsBar";
import EditModal from "../components/document/EditModal";
import Toast from "../components/layout/ui/Toast";
import ConfirmDialog from "../components/layout/ui/ConfirmDialog";
import { useDashboardDocuments } from "../hooks/useDashboardDocuments";

export default function Dashboard() {
  const {
    loading,
    documents,
    filteredDocuments,
    selectedDocuments,
    toast,
    editingDocument,
    confirmDialog,
    setToast,
    setEditingDocument,
    handleSearch,
    handleDateRangeFilter,
    handleCategoryFilter,
    handleRefresh,
    handleSelectDocument,
    handleSelectAll,
    handleView,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleDeleteSelected,
    handleDownloadSelected,
    confirmDelete,
    cancelDelete,
  } = useDashboardDocuments();

  return (
    <div className="min-h-screen flex bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />
      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Dashboard" />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 lg:mb-8 animate-[slideUp_0.6s_ease-out_0.1s_both]">
            {/* --- FilterBar --- */}
            <FilterBar
              onSearch={handleSearch}
              onDateRangeChange={handleDateRangeFilter}
              onCategoryChange={handleCategoryFilter}
              onRefresh={handleRefresh}
            />
          </div>

          {/* --- Dokumen yang dipilih --- */}
          <SelectedActionsBar
            selectedCount={selectedDocuments.size}
            onDownloadSelected={handleDownloadSelected}
            onDeleteSelected={handleDeleteSelected}
          />

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
    </div>
  );
}
