import { useState } from "react";
import searchIcon from "../../assets/icons/search.svg";
import refreshIcon from "../../assets/icons/refresh.svg";

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onCategoryChange?: (category: string) => void;
  onRefresh?: () => void;
}

export default function FilterBar({
  onSearch,
  onDateRangeChange,
  onCategoryChange,
  onRefresh,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    onDateRangeChange?.(value, endDate);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    onDateRangeChange?.(startDate, value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange?.(value);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setCategory("");
    onRefresh?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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

        {/* DARI TANGGAL */}
        <div>
          <label className="text-xs lg:text-sm font-semibold text-gray-600 mb-2 block">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-gray-700 focus:border-orange-400 focus:outline-none transition"
          />
        </div>

        {/* SAMPAI TANGGAL */}
        <div>
          <label className="text-xs lg:text-sm font-semibold text-gray-600 mb-2 block">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-gray-700 focus:border-orange-400 focus:outline-none transition"
          />
        </div>

        {/* KATEGORI - UPDATED: Lampiran & Keuangan */}
        <div>
          <label className="text-xs lg:text-sm font-semibold text-gray-600 mb-2 block">
            Kategori
          </label>
          <div className="relative">
            <select
              value={category}
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

        {/* REFRESH */}
        <div className="flex justify-start lg:justify-center">
          <button
            onClick={handleRefresh}
            className="bg-orange-500 hover:bg-orange-600 p-3 lg:p-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            title="Refresh"
          >
            <img
              src={refreshIcon}
              className="w-4 h-4 lg:w-5 lg:h-5"
              alt="refresh"
            />
          </button>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(searchQuery || startDate || endDate || category) && (
        <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-xs lg:text-sm">
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Filter Aktif</span>
        </div>
      )}
    </div>
  );
}