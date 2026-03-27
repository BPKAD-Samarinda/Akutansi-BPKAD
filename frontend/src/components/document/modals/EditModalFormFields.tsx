import { FaChevronDown } from "react-icons/fa";
import { Calendar } from "../../layout/ui/calendar";
import { EditFormData } from "./editModalTypes";
import AppTooltip from "../../ui/app-tooltip";

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
  onSelectCategory: (
    kategori:
      | "Lampiran"
      | "Keuangan"
      | "BKU"
      | "STS"
      | "Rekening Koran",
  ) => void;
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
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
          Nama 
        </label>
        <AppTooltip content="Nama">
          <input
            type="text"
            name="nama_sppd"
            value={formData.nama_sppd}
            onChange={onInputChange}
            title=""
            aria-label="Nama SPPD"
            className="w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            required
          />
        </AppTooltip>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
          Kategori
        </label>
        <div ref={categoryWrapperRef} className="relative">
          <AppTooltip content="Pilih Kategori">
            <button
              type="button"
              onClick={onToggleCategory}
              className="w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-left bg-white dark:bg-slate-900 flex items-center justify-between text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
            >
              <span
                className={
                  formData.kategori
                    ? "text-gray-800 dark:text-slate-100"
                    : "text-gray-400 dark:text-slate-500"
                }
              >
                {formData.kategori || "Pilih Kategori"}
              </span>
              <span
                ref={categoryChevronRef}
                className="inline-block text-gray-400 dark:text-slate-500"
              >
                <FaChevronDown className="text-xs" />
              </span>
            </button>
          </AppTooltip>

          {isCategoryOpen && (
            <div
              ref={categoryDropdownRef}
              className="absolute top-full left-0 mt-2 z-20 w-full border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xl p-2"
            >
              {(["Lampiran", "Keuangan", "BKU", "STS", "Rekening Koran"] as const).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSelectCategory(option)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-orange-50 dark:hover:bg-slate-800 ${
                      formData.kategori === option
                        ? "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300"
                        : "text-gray-600 dark:text-slate-300"
                    }`}
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
          Tanggal
        </label>
        <div ref={calendarWrapperRef} className="relative">
          <button
            type="button"
            onClick={onToggleCalendar}
            className="w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-left bg-white dark:bg-slate-900 text-sm font-medium text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
          >
            {formatDisplayDate(formData.tanggal_sppd)}
          </button>

          {isCalendarOpen && (
            <div
              ref={calendarPopoverRef}
              className="absolute top-full left-0 mt-2 z-20 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xl p-3"
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

      <div className="flex justify-end gap-3 pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="px-5 py-2.5 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </>
  );
}
