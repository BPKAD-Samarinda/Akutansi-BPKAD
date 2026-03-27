import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import FilterBar from "../components/document/table/FilterBar";
import DocumentTable from "../components/document/table/DocumentTable";
import SelectedActionsBar from "../components/document/table/SelectedActionsBar";
import EditModal from "../components/document/modals/EditModal";
import { Toast } from "../components/snackbar";
import ConfirmDialog from "../components/layout/ui/ConfirmDialog";
import { useDocumentManagement } from "../hooks/document/useDocumentManagement";

export default function DocumentManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterResetKey, setFilterResetKey] = useState(0);
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
  } = useDocumentManagement();

  const handleRefreshClick = () => {
    handleRefresh();
    setFilterResetKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 lg:ml-64 flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header
          title="Manajemen Dokumen"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 lg:mb-8 animate-[slideUp_0.6s_ease-out_0.1s_both]">
            <FilterBar
              onSearch={handleSearch}
              onDateRangeChange={handleDateRangeFilter}
              onCategoryChange={handleCategoryFilter}
              onRefresh={handleRefreshClick}
              resetSignal={filterResetKey}
            />
          </div>

          <SelectedActionsBar
            selectedCount={selectedDocuments.size}
            onDownloadSelected={handleDownloadSelected}
            onDeleteSelected={handleDeleteSelected}
          />

          <div className="animate-[slideUp_0.6s_ease-out_0.2s_both]">
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
                onRefresh={handleRefreshClick}
                onSelectDocument={handleSelectDocument}
                onSelectAll={handleSelectAll}
              />
            )}
          </div>
        </main>
      </div>

      <EditModal
        key={editingDocument?.id ?? "no-document"}
        isOpen={editingDocument !== null}
        document={editingDocument}
        onClose={() => setEditingDocument(null)}
        onSave={handleSaveEdit}
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
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
