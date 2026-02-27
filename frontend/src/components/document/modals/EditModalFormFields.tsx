import { FaChevronDown } from "react-icons/fa";
import { Calendar } from "../../layout/ui/calendar";
import { EditFormData } from "./editModalTypes";

type EditModalFormFieldsProps = {
  formData: EditFormData;
  isSaving: boolean;
  isCategoryOpen: boolean;
  isCalendarOpen: boolean;
  categoryWrapperRef: React.RefObject<HTMLDivElement | null>;
  categoryDropdownRef: React.RefObject<HTMLDivElement | null>;
  categoryChevronRef: React.RefObject<HTMLSpanElement | null>;
  calendarWrapperRef: React.RefObject<HTMLDivElement | null>;
  calendarPopoverRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleCategory: () => void;
  onSelectCategory: (kategori: "Lampiran" | "Keuangan") => void;
  onToggleCalendar: () => void;
  onSelectDate: (date: Date | undefined) => void;
  onClose: () => void;
  formatDisplayDate: (dateValue: string) => string;
  toDateObject: (dateValue: string) => Date;
};

export default function EditModalFormFields({
  formData,
  isSaving,
  isCategoryOpen,
  isCalendarOpen,
  categoryWrapperRef,
  categoryDropdownRef,
  categoryChevronRef,
  calendarWrapperRef,
  calendarPopoverRef,
  onInputChange,
  onToggleCategory,
  onSelectCategory,
  onToggleCalendar,
  onSelectDate,
  onClose,
  formatDisplayDate,
  toDateObject,
}: EditModalFormFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Nama SPPD</label>
        <input
          type="text"
          name="nama_sppd"
          value={formData.nama_sppd}
          onChange={onInputChange}
          title="Nama SPPD"
          className="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kategori</label>
        <div ref={categoryWrapperRef} className="relative">
          <button
            type="button"
            onClick={onToggleCategory}
            className="w-full border rounded-lg px-3 py-2 text-left bg-white flex items-center justify-between"
            title="Pilih Kategori"
          >
            <span
              className={formData.kategori ? "text-black" : "text-gray-500"}
            >
              {formData.kategori || "Pilih Kategori"}
            </span>
            <span
              ref={categoryChevronRef}
              className="inline-block text-gray-500"
            >
              <FaChevronDown className="text-xs" />
            </span>
          </button>

          {isCategoryOpen && (
            <div
              ref={categoryDropdownRef}
              className="absolute top-full left-0 mt-2 z-20 w-full border rounded-lg bg-white shadow-lg p-1"
            >
              {(["Lampiran", "Keuangan"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelectCategory(option)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                    formData.kategori === option
                      ? "bg-orange-50 text-orange-600"
                      : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tanggal</label>
        <div ref={calendarWrapperRef} className="relative">
          <button
            type="button"
            onClick={onToggleCalendar}
            className="w-full border rounded-lg px-3 py-2 text-left bg-white"
          >
            {formatDisplayDate(formData.tanggal_sppd)}
          </button>

          {isCalendarOpen && (
            <div
              ref={calendarPopoverRef}
              className="absolute top-full left-0 mt-2 z-20 border rounded-lg bg-white shadow-lg p-2"
            >
              <Calendar
                mode="single"
                captionLayout="dropdown"
                fromYear={2000}
                toYear={new Date().getFullYear() + 10}
                selected={toDateObject(formData.tanggal_sppd)}
                onSelect={onSelectDate}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </>
  );
}
