import HistoryContentSection from "../components/document/history/HistoryContentSection";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Toast } from "../components/snackbar";
import { useUploadHistory } from "../hooks/useUploadHistory";
import { useToastState } from "../hooks/useToastState";
import { getRestoreToastType } from "../utils/historyToastUtils";

export default function UploadHistory() {
  const { toast, showToast, closeToast } = useToastState("info");

  const {
    items,
    loading,
    error,
    restoringId,
    isRestoringSelected,
    selectedIds,
    selectedRestorableCount,
    allRestorableSelected,
    searchInput,
    page,
    limit,
    total,
    totalPages,
    setSearchInput,
    setPage,
    setLimit,
    handleSearchSubmit,
    handleRefresh,
    handleToggleSelect,
    handleToggleSelectAll,
    handleRestore,
    handleRestoreSelected,
  } = useUploadHistory();

  const handleRestoreClick = async (id: number | string) => {
    const message = await handleRestore(id);
    const toastType = getRestoreToastType(message);

    showToast(message, toastType);
  };

  const handleRestoreSelectedClick = async () => {
    const message = await handleRestoreSelected();
    const toastType = getRestoreToastType(message);

    showToast(message, toastType);
  };

  return (
    <div className="min-h-screen flex bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />

      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Riwayat Unggah" />

        <main className="flex-1 p-1 md:p-8">
          <div className="mx-auto w-full max-w-none space-y-6">
            <HistoryContentSection
              items={items}
              loading={loading}
              error={error}
              restoringId={restoringId}
              isRestoringSelected={isRestoringSelected}
              selectedIds={selectedIds}
              selectedRestorableCount={selectedRestorableCount}
              allRestorableSelected={allRestorableSelected}
              searchValue={searchInput}
              page={page}
              pageSize={limit}
              totalItems={total}
              totalPages={totalPages}
              onSearchValueChange={setSearchInput}
              onSearchSubmit={handleSearchSubmit}
              onRefresh={handleRefresh}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelect={handleToggleSelect}
              onRestore={handleRestoreClick}
              onRestoreSelected={handleRestoreSelectedClick}
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
