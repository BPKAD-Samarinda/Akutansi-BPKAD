import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { FaChevronDown } from "react-icons/fa";
import { Calendar } from "../../layout/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type UploadFormData = {
  name: string;
  date: string;
  category:
    | "Lampiran"
    | "Keuangan"
    | "BKU"
    | "STS"
    | "Rekening Koran"
    | "";
};

type UploadDocumentInfoSectionProps = {
  formData: UploadFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
};

export default function UploadDocumentInfoSection({
  formData,
  onInputChange,
}: UploadDocumentInfoSectionProps) {
  const today = useMemo(() => new Date(), []);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMonthSelectOpen, setIsMonthSelectOpen] = useState(false);
  const [isYearSelectOpen, setIsYearSelectOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(new Date());

  const categoryWrapperRef = useRef<HTMLDivElement>(null);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);

  const selectedDate = useMemo(() => {
    if (!formData.date) return undefined;
    const dateObject = new Date(`${formData.date}T00:00:00`);
    return Number.isNaN(dateObject.getTime()) ? undefined : dateObject;
  }, [formData.date]);

  const displayDate = useMemo(() => {
    if (!selectedDate) return "Pilih Tanggal";
    return format(selectedDate, "dd MMMM yyyy", { locale: localeId });
  }, [selectedDate]);

  const calendarYears = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: current - 2000 + 11 }, (_, i) => 2000 + i);
  }, []);

  const monthOptions = useMemo(
    () => [
      { value: 0, label: "Januari" },
      { value: 1, label: "Februari" },
      { value: 2, label: "Maret" },
      { value: 3, label: "April" },
      { value: 4, label: "Mei" },
      { value: 5, label: "Juni" },
      { value: 6, label: "Juli" },
      { value: 7, label: "Agustus" },
      { value: 8, label: "September" },
      { value: 9, label: "Oktober" },
      { value: 10, label: "November" },
      { value: 11, label: "Desember" },
    ],
    [],
  );

  const emitFieldChange = (name: "date" | "category", value: string) => {
    onInputChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
  };

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const path =
        typeof event.composedPath === "function" ? event.composedPath() : [];
      const isCalendarSelectLayer = path.some((node) => {
        if (!(node instanceof Element)) return false;
        return (
          node.classList.contains("upload-date-month-trigger") ||
          node.classList.contains("upload-date-month-content") ||
          node.classList.contains("upload-date-year-trigger") ||
          node.classList.contains("upload-date-year-content") ||
          node.matches("[data-radix-popper-content-wrapper]") ||
          node.matches('[role="listbox"]')
        );
      });

      // Jangan tutup popover tanggal saat user sedang interaksi dropdown bulan/tahun.
      if (isCalendarSelectLayer || isMonthSelectOpen || isYearSelectOpen) return;

      if (
        categoryWrapperRef.current &&
        !categoryWrapperRef.current.contains(target)
      ) {
        setIsCategoryOpen(false);
      }

      if (
        calendarWrapperRef.current &&
        !calendarWrapperRef.current.contains(target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isMonthSelectOpen, isYearSelectOpen]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-bounce animate-delay-300">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Informasi Dokumen</h2>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-3"
        >
          Nama Dokumen
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Nama akan otomatis terisi dari file..."
          className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">
          Tanggal
        </label>
        <div ref={calendarWrapperRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCalendarOpen((prev) => {
                const next = !prev;
                if (next) {
                  const baseDate = selectedDate ?? today;
                  setViewMonth(
                    new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
                  );
                }
                return next;
              });
              setIsCategoryOpen(false);
            }}
            className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-medium text-left focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 flex items-center justify-between"
          >
            <span
              className={
                selectedDate
                  ? "text-gray-900 dark:text-slate-100"
                  : "text-gray-500 dark:text-slate-500"
              }
            >
              {displayDate}
            </span>
            <FaChevronDown
              className={`text-xs text-gray-500 dark:text-slate-400 transition-transform duration-200 ${
                isCalendarOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCalendarOpen && (
            <div className="absolute top-full left-0 mt-2 z-30 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xl p-2">
              <div className="mb-2 grid grid-cols-[1fr_110px] gap-2 px-1">
                <Select
                  value={String(viewMonth.getMonth())}
                  onOpenChange={setIsMonthSelectOpen}
                  onValueChange={(value) =>
                    setViewMonth(
                      new Date(viewMonth.getFullYear(), Number(value), 1),
                    )
                  }
                >
                  <SelectTrigger className="h-9 text-sm upload-date-month-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 upload-date-month-content z-[100000]">
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={String(month.value)}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={String(viewMonth.getFullYear())}
                  onOpenChange={setIsYearSelectOpen}
                  onValueChange={(value) =>
                    setViewMonth(
                      new Date(Number(value), viewMonth.getMonth(), 1),
                    )
                  }
                >
                  <SelectTrigger className="h-9 text-sm upload-date-year-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 upload-date-year-content z-[100000]">
                    {calendarYears.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Calendar
                mode="single"
                month={viewMonth}
                onMonthChange={(month) => setViewMonth(month)}
                captionLayout="label"
                disabled={{ after: today }}
                selected={selectedDate}
                onSelect={(selected) => {
                  if (!selected) return;
                  if (selected > today) return;
                  emitFieldChange("date", format(selected, "yyyy-MM-dd"));
                  setIsCalendarOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">
          Kategori
        </label>
        <div ref={categoryWrapperRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCategoryOpen((prev) => !prev);
              setIsCalendarOpen(false);
            }}
            className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-medium text-left focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 flex items-center justify-between"
          >
            <span
              className={
                formData.category
                  ? "text-gray-900 dark:text-slate-100"
                  : "text-gray-500 dark:text-slate-500"
              }
            >
              {formData.category || "Pilih Kategori"}
            </span>
            <FaChevronDown
              className={`text-xs text-gray-500 dark:text-slate-400 transition-transform duration-200 ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 z-30 w-full border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xl p-2">
              {(["Lampiran", "Keuangan", "BKU", "STS", "Rekening Koran"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    emitFieldChange("category", option);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-base transition-colors ${
                    formData.category === option
                      ? "bg-orange-50 text-orange-600 dark:bg-slate-800 dark:text-slate-100"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          <input type="hidden" name="category" value={formData.category} required />
          <input type="hidden" name="date" value={formData.date} required />
        </div>
      </div>
    </div>
  );
}
