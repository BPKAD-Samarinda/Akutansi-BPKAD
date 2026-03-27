import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HistoryContentSection from "../components/document/history/HistoryContentSection";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Toast } from "../components/snackbar";
import ConfirmDialog from "../components/layout/ui/ConfirmDialog";
import { useUploadHistory } from "../hooks/useUploadHistory";
import { useToastState } from "../hooks/useToastState";
import { getRestoreToastType } from "../utils/historyToastUtils";

export default function UploadHistory() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast, showToast, closeToast } = useToastState("info");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    items,
    loading,
    error,
    isRestoringSelected,
    isPermanentlyDeletingSelected,
    selectedIds,
    selectedRestorableCount,
    allRestorableSelected,
    searchInput,
    statusFilter,
    page,
    limit,
    total,
    totalPages,
    setSearchInput,
    setPage,
    setLimit,
    handleSearchSubmit,
    handleStatusFilterChange,
    handleRefresh,
    handleToggleSelect,
    handleToggleSelectAll,
    handleRestoreSelected,
    handlePermanentDeleteSelected,
  } = useUploadHistory();

  const handleRestoreSelectedClick = async () => {
    const message = await handleRestoreSelected();
    const toastType = getRestoreToastType(message);

    showToast(message, toastType);
  };

  const handlePermanentDeleteSelectedClick = async () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmPermanentDelete = async () => {
    if (isPermanentlyDeletingSelected) {
      return;
    }

    setIsDeleteDialogOpen(false);
    const message = await handlePermanentDeleteSelected();
    const normalizedMessage = message.toLowerCase();
    const toastType = normalizedMessage.includes("berhasil")
      ? "success"
      : "error";
    showToast(message, toastType);
  };

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-history-animate]", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen flex bg-slate-100 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="ml-0 lg:ml-64 flex-1 flex flex-col">
        <Header title="Riwayat Unggah" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-1 md:p-8" data-history-animate>
          <div className="mx-auto w-full max-w-none space-y-6" data-history-animate>
            <HistoryContentSection
              items={items}
              loading={loading}
              error={error}
              isRestoringSelected={isRestoringSelected}
              isPermanentlyDeletingSelected={isPermanentlyDeletingSelected}
              selectedIds={selectedIds}
              selectedRestorableCount={selectedRestorableCount}
              allRestorableSelected={allRestorableSelected}
              searchValue={searchInput}
              statusValue={statusFilter}
              page={page}
              pageSize={limit}
              totalItems={total}
              totalPages={totalPages}
              onSearchValueChange={setSearchInput}
              onStatusValueChange={handleStatusFilterChange}
              onSearchSubmit={handleSearchSubmit}
              onRefresh={handleRefresh}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelect={handleToggleSelect}
              onRestoreSelected={handleRestoreSelectedClick}
              onPermanentDeleteSelected={handlePermanentDeleteSelectedClick}
              onPageChange={setPage}
              onPageSizeChange={(value) => {
                setPage(1);
                setLimit(value);
              }}
            />
          </div>
        </main>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={closeToast}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Hapus Permanen File?"
        message="Dokumen yang dihapus permanen tidak dapat dipulihkan kembali."
        confirmText={isPermanentlyDeletingSelected ? "Menghapus..." : "Hapus Permanen"}
        cancelText="Batal"
        onConfirm={handleConfirmPermanentDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        type="danger"
      />
    </div>
  );
}
