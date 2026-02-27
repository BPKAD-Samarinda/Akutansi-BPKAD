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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={handleCloseWithAnimation}
      />
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6"
      >
        <h2 className="text-xl font-bold mb-4">Edit Dokumen</h2>

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
