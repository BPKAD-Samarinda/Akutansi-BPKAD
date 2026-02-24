import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import searchIcon from "../../assets/icons/search.svg";

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onCategoryChange?: (category: string) => void;
  onRefresh?: () => void;
}

function DateRangePicker({
  onChange,
}: {
  onChange?: (start: string, end: string) => void;
}) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(today);
  const [mode, setMode] = useState<"single" | "range">("range");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  const isoFmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const displayValue =
    startDate && endDate
      ? `${fmt(startDate)} — ${fmt(endDate)}`
      : startDate
        ? fmt(startDate)
        : "";

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handleDayClick = (day: Date) => {
    if (mode === "single") {
      setStartDate(day);
      setEndDate(null);
      return;
    }
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
      } else if (day.toDateString() === startDate.toDateString()) {
        setEndDate(null);
      } else {
        setEndDate(day);
      }
    }
  };

  const handleApply = () => {
    if (startDate) {
      onChange?.(
        isoFmt(startDate),
        endDate ? isoFmt(endDate) : isoFmt(startDate),
      );
      setOpen(false);
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
    onChange?.("", "");
    setOpen(false);
  };

  const handleModeChange = (newMode: "single" | "range") => {
    setMode(newMode);
    setStartDate(null);
    setEndDate(null);
  };

  const isInRange = (day: Date) => {
    if (mode === "single") return false;
    const end = endDate ?? hoverDate;
    if (!startDate || !end) return false;
    const [s, e] = startDate <= end ? [startDate, end] : [end, startDate];
    return day > s && day < e;
  };

  const isStart = (day: Date) =>
    startDate ? day.toDateString() === startDate.toDateString() : false;

  const isEnd = (day: Date) =>
    endDate ? day.toDateString() === endDate.toDateString() : false;

  const isTodayDate = (day: Date) =>
    day.toDateString() === today.toDateString();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Rentang tahun: 5 tahun ke belakang sampai 5 tahun ke depan
  const currentYear = today.getFullYear();
  const yearRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const calendarDays: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];

  const canApply = mode === "single" ? !!startDate : !!(startDate && endDate);

  const infoText = () => {
    if (mode === "single") return startDate ? fmt(startDate) : "Pilih tanggal";
    if (!startDate) return "Pilih tanggal mulai";
    if (!endDate) return "Pilih tanggal akhir";
    return `${fmt(startDate)} — ${fmt(endDate)}`;
  };

  const dropdown = open
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: dropdownPos.top,
            left: dropdownPos.left,
            zIndex: 99999,
          }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72"
        >
          {/* Toggle mode */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            <button
              onClick={() => handleModeChange("single")}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                mode === "single"
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Tanggal Tunggal
            </button>
            <button
              onClick={() => handleModeChange("range")}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                mode === "range"
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Rentang
            </button>
          </div>

          {/* Header navigasi: dropdown bulan & tahun + tombol panah */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <button
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition shrink-0"
              title="dropdown btn"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Dropdown Bulan */}
            <select
              value={month}
              onChange={(e) =>
                setViewDate(new Date(year, parseInt(e.target.value), 1))
              }
              className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400 cursor-pointer flex-1"
              title="dropdown btn"
            >
              {monthNames.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>

            {/* Dropdown Tahun */}
            <select
              value={year}
              onChange={(e) =>
                setViewDate(new Date(parseInt(e.target.value), month, 1))
              }
              className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400 cursor-pointer w-20"
              title="dropdown btn"
            >
              {yearRange.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition shrink-0"
              title="dropdown btn"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Nama hari */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold text-gray-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid tanggal */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const inRange = isInRange(day);
              const isS = isStart(day);
              const isE = isEnd(day);
              const isTod = isTodayDate(day);
              return (
                <div
                  key={day.toISOString()}
                  onMouseEnter={() =>
                    mode === "range" &&
                    startDate &&
                    !endDate &&
                    setHoverDate(day)
                  }
                  onMouseLeave={() => setHoverDate(null)}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative text-center text-xs py-1.5 cursor-pointer transition-all select-none
                    ${isS || isE ? "bg-orange-500 text-white rounded-lg font-semibold" : ""}
                    ${inRange ? "bg-orange-100 text-orange-700" : ""}
                    ${!isS && !isE && !inRange ? "hover:bg-gray-100 text-gray-700 rounded-lg" : ""}
                    ${isTod && !isS && !isE ? "font-bold text-orange-500 ring-1 ring-orange-400 ring-offset-1 rounded-lg" : ""}
                  `}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>

          {/* Info pilihan */}
          <div className="mt-3 text-xs text-gray-500 text-center bg-gray-50 rounded-lg py-2">
            {infoText()}
          </div>

          {/* Tombol aksi */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleClear}
              className="flex-1 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              Hapus
            </button>
            <button
              onClick={handleApply}
              disabled={!canApply}
              className="flex-1 py-2 text-xs font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Terapkan
            </button>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="relative">
      <label className="text-xs lg:text-sm font-semibold text-gray-600 mb-2 block">
        Rentang Tanggal
      </label>
      <div
        ref={triggerRef}
        onClick={handleOpen}
        className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 cursor-pointer hover:border-orange-400 transition min-w-[220px]"
      >
        <svg
          className="w-4 h-4 mr-3 opacity-50 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span
          className={`text-xs lg:text-sm ${
            displayValue ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {displayValue || "Pilih rentang tanggal"}
        </span>
      </div>
      {dropdown}
    </div>
  );
}

export default function FilterBar({
  onSearch,
  onDateRangeChange,
  onCategoryChange,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange?.(value);
  };

  const isActive = searchQuery || category;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        {/* PENCARIAN */}
        <div>
          <label className="text-xs lg:text-sm font-semibold text-gray-600 mb-2 block">
            Pencarian
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 focus-within:border-orange-400 transition">
            <img
              src={searchIcon}
              className="w-4 h-4 lg:w-5 lg:h-5 mr-3 opacity-50"
              alt="search"
            />
            <input
              type="text"
              placeholder="Cari Dokumen"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-transparent outline-none w-full text-xs lg:text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* RENTANG TANGGAL */}
        <DateRangePicker onChange={(s, e) => onDateRangeChange?.(s, e)} />

        {/* KATEGORI */}
        <div>
          <label className="text-xs lg:text-sm font-semibold text-gray-600 mb-2 block">
            Kategori
          </label>
          <div className="relative">
            <select
              value={category}
              title="Category"
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-gray-700 focus:border-orange-400 focus:outline-none transition appearance-none cursor-pointer"
            >
              <option value="">Semua Kategori</option>
              <option value="Lampiran">Lampiran</option>
              <option value="Keuangan">Keuangan</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {isActive && (
        <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-xs lg:text-sm">
          <svg
            className="w-4 h-4 lg:w-5 lg:h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">Filter Aktif</span>
        </div>
      )}
    </div>
  );
}
