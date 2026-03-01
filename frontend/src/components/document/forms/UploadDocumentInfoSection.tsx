import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { FaChevronDown } from "react-icons/fa";
import { Calendar } from "../../layout/ui/calendar";

type UploadFormData = {
  name: string;
  date: string;
  category: "Lampiran" | "Keuangan" | "BKU" | "STS" | "";
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const emitFieldChange = (name: "date" | "category", value: string) => {
    onInputChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
  };

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

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
  }, []);

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
        <h2 className="text-xl font-bold text-gray-800">Informasi Dokumen</h2>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-bold text-gray-700 mb-3"
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
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Tanggal
        </label>
        <div ref={calendarWrapperRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCalendarOpen((prev) => !prev);
              setIsCategoryOpen(false);
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-medium text-left focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white flex items-center justify-between"
          >
            <span className={selectedDate ? "text-gray-900" : "text-gray-500"}>
              {displayDate}
            </span>
            <FaChevronDown
              className={`text-xs text-gray-500 transition-transform duration-200 ${
                isCalendarOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCalendarOpen && (
            <div className="absolute top-full left-0 mt-2 z-30 border border-gray-200 rounded-xl bg-white shadow-xl p-2">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                fromYear={2000}
                toYear={new Date().getFullYear() + 10}
                selected={selectedDate}
                onSelect={(selected) => {
                  if (!selected) return;
                  emitFieldChange("date", format(selected, "yyyy-MM-dd"));
                  setIsCalendarOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Kategori
        </label>
        <div ref={categoryWrapperRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCategoryOpen((prev) => !prev);
              setIsCalendarOpen(false);
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-medium text-left focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white flex items-center justify-between"
          >
            <span
              className={formData.category ? "text-gray-900" : "text-gray-500"}
            >
              {formData.category || "Pilih Kategori"}
            </span>
            <FaChevronDown
              className={`text-xs text-gray-500 transition-transform duration-200 ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 z-30 w-full border border-gray-200 rounded-xl bg-white shadow-xl p-2">
              {(["Lampiran", "Keuangan", "BKU", "STS"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    emitFieldChange("category", option);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-base transition-colors ${
                    formData.category === option
                      ? "bg-orange-50 text-orange-600"
                      : "hover:bg-gray-100 text-gray-800"
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
