import { FiX } from "react-icons/fi";
import EditModalFormFields from "./EditModalFormFields";
import { EditModalProps } from "./editModalTypes";
import { useEditModal } from "./useEditModal";

export default function EditModal({
  isOpen,
  document: editingDocument,
  onClose,
  onSave,
}: EditModalProps) {
  const {
    formData,
    isSaving,
    shouldRender,
    isCalendarOpen,
    isCategoryOpen,
    overlayRef,
    modalRef,
    calendarPopoverRef,
    calendarWrapperRef,
    categoryDropdownRef,
    categoryWrapperRef,
    categoryChevronRef,
    handleCloseWithAnimation,
    handleInputChange,
    handleFileChange,
    handleRemoveFile,
    toggleCategory,
    selectCategory,
    toggleCalendar,
    selectDate,
    handleSubmit,
    formatDisplayDate,
    toDateObject,
    selectedFileName,
    fileError,
    isAddingNew,
    setIsAddingNew,
  } = useEditModal({
    isOpen,
    editingDocument,
    onClose,
    onSave,
  });

  const currentFileName = editingDocument?.file_path
    ? String(editingDocument.file_path).split(/[\\/]/).pop()
    : "";

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl animate-[scaleIn_0.25s_ease-out] dark:bg-slate-900 dark:ring-1 dark:ring-slate-800"
      >
        <div className="bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-5 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-100">
                Pembaruan Dokumen
              </p>
              <h2 className="mt-2 text-2xl font-bold">Edit Dokumen</h2>
              <p className="mt-2 text-sm text-orange-100">
                Perbarui informasi nama, kategori, atau file dokumen.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseWithAnimation}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white transition hover:bg-white/20"
              aria-label="Tutup"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 overflow-y-auto">
          <EditModalFormFields
            formData={formData}
            isSaving={isSaving}
            isCategoryOpen={isCategoryOpen}
            isCalendarOpen={isCalendarOpen}
            fileName={selectedFileName}
            fileError={fileError}
            currentFileName={currentFileName}
            categoryWrapperRef={categoryWrapperRef}
            categoryDropdownRef={categoryDropdownRef}
            categoryChevronRef={categoryChevronRef}
            calendarWrapperRef={calendarWrapperRef}
            calendarPopoverRef={calendarPopoverRef}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            onToggleCategory={toggleCategory}
            onSelectCategory={selectCategory}
            onToggleCalendar={toggleCalendar}
            onSelectDate={selectDate}
            onClose={handleCloseWithAnimation}
            formatDisplayDate={formatDisplayDate}
            toDateObject={toDateObject}
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
          />
        </form>
      </div>
    </div>
  );
}
