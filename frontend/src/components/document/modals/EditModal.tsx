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
    toggleCategory,
    selectCategory,
    toggleCalendar,
    selectDate,
    handleSubmit,
    formatDisplayDate,
    toDateObject,
  } = useEditModal({
    isOpen,
    editingDocument,
    onClose,
    onSave,
  });

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm pointer-events-none"
      />
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 border border-orange-100 dark:border-slate-700"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 20h4l10-10-4-4L4 16v4z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 6l4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Edit Dokumen</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Perbarui informasi dokumen sebelum disimpan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseWithAnimation}
            className="h-9 w-9 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-100 transition-colors"
            aria-label="Tutup"
          >
            &#10005;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <EditModalFormFields
            formData={formData}
            isSaving={isSaving}
            isCategoryOpen={isCategoryOpen}
            isCalendarOpen={isCalendarOpen}
            categoryWrapperRef={categoryWrapperRef}
            categoryDropdownRef={categoryDropdownRef}
            categoryChevronRef={categoryChevronRef}
            calendarWrapperRef={calendarWrapperRef}
            calendarPopoverRef={calendarPopoverRef}
            onInputChange={handleInputChange}
            onToggleCategory={toggleCategory}
            onSelectCategory={selectCategory}
            onToggleCalendar={toggleCalendar}
            onSelectDate={selectDate}
            onClose={handleCloseWithAnimation}
            formatDisplayDate={formatDisplayDate}
            toDateObject={toDateObject}
          />
        </form>
      </div>
    </div>
  );
}
