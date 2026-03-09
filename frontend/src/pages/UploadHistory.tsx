import { useEffect, useRef } from "react";
import gsap from "gsap";
import HistoryContentSection from "../components/document/history/HistoryContentSection";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Toast } from "../components/snackbar";
import { useUploadHistory } from "../hooks/useUploadHistory";
import { useToastState } from "../hooks/useToastState";
import { getRestoreToastType } from "../utils/historyToastUtils";

export default function UploadHistory() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const { toast, showToast, closeToast } = useToastState("info");

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
    const shouldDelete = window.confirm(
      "Yakin ingin menghapus permanen dokumen terpilih? Tindakan ini tidak dapat dibatalkan.",
    );

    if (!shouldDelete) {
      return;
    }

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
      className="min-h-screen flex bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <Sidebar />

      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col">
        <Header title="Upload History" />

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
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}
