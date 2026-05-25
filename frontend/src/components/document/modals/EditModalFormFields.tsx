import { FaChevronDown } from "react-icons/fa";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import { Calendar } from "../../layout/ui/calendar";
import { EditFormData } from "./editModalTypes";
import AppTooltip from "../../ui/app-tooltip";

type EditModalFormFieldsProps = {
  formData: EditFormData;
  isSaving: boolean;
  isCategoryOpen: boolean;
  isCalendarOpen: boolean;
  fileName?: string;
  fileError?: string;
  currentFileName?: string;
  categoryWrapperRef: React.RefObject<HTMLDivElement | null>;
  categoryDropdownRef: React.RefObject<HTMLDivElement | null>;
  categoryChevronRef: React.RefObject<HTMLSpanElement | null>;
  calendarWrapperRef: React.RefObject<HTMLDivElement | null>;
  calendarPopoverRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
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
  fileName,
  fileError,
  currentFileName,
  categoryWrapperRef,
  categoryDropdownRef,
  categoryChevronRef,
  calendarWrapperRef,
  calendarPopoverRef,
  onInputChange,
  onFileChange,
  onRemoveFile,
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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Nama Dokumen
          </label>
          <AppTooltip content="Nama Dokumen">
            <input
              type="text"
              name="nama_sppd"
              value={formData.nama_sppd}
              onChange={onInputChange}
              aria-label="Nama Dokumen"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              required
            />
          </AppTooltip>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Kategori
          </label>
          <div ref={categoryWrapperRef} className="relative">
            <AppTooltip content="Pilih Kategori">
              <button
                type="button"
                onClick={onToggleCategory}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all duration-300 flex items-center justify-between dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <span
                  className={
                    formData.kategori
                      ? "text-slate-700 dark:text-slate-100"
                      : "text-slate-400 dark:text-slate-500"
                  }
                >
                  {formData.kategori || "Pilih Kategori"}
                </span>
                <span
                  ref={categoryChevronRef}
                  className="inline-block text-slate-400"
                >
                  <FaChevronDown className="text-xs" />
                </span>
              </button>
            </AppTooltip>

            {isCategoryOpen && (
              <div
                ref={categoryDropdownRef}
                className="absolute top-full left-0 mt-2 z-20 w-full rounded-xl border border-slate-200 bg-white shadow-xl p-2 dark:border-slate-700 dark:bg-slate-900"
              >
                {(["Lampiran", "Keuangan", "BKU", "STS", "Rekening Koran"] as const).map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onSelectCategory(option)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        formData.kategori === option
                          ? "bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
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
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Tanggal
          </label>
          <div ref={calendarWrapperRef} className="relative">
            <button
              type="button"
              onClick={onToggleCalendar}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all duration-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {formatDisplayDate(formData.tanggal_sppd)}
            </button>

            {isCalendarOpen && (
              <div
                ref={calendarPopoverRef}
                className="absolute top-full left-0 mt-2 z-20 rounded-xl border border-slate-200 bg-white shadow-xl p-3 dark:border-slate-700 dark:bg-slate-900"
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
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Ganti Dokumen (opsional)
        </label>
        
        <label className="block rounded-[24px] border border-dashed border-orange-200 bg-orange-50/50 p-5 transition hover:border-orange-300 hover:bg-orange-50 dark:border-orange-500/30 dark:bg-orange-500/10 dark:hover:bg-orange-500/15 cursor-pointer">
          <div className="flex flex-col items-center justify-center text-center relative">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
              <FiFileText className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 px-2 truncate w-full">
              {fileName || currentFileName || "Pilih dokumen file baru"}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white">
              <FiUploadCloud className="h-4 w-4" />
              Ganti File
            </span>
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.jfif,.heic,.heif"
            className="hidden"
            onChange={onFileChange}
            disabled={isSaving}
          />
        </label>
        
        {fileName && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={onRemoveFile}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition"
              disabled={isSaving}
            >
              Hapus file baru & gunakan file lama
            </button>
          </div>
        )}

        {fileError && (
          <p className="mt-2 text-xs text-center text-red-500">{fileError}</p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-slate-100 pt-5 dark:border-slate-800 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </>
  );
}
