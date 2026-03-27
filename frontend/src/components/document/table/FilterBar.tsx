import { useEffect, useRef, useState } from "react";
import ActiveFilterIndicator from "./filter-bar/ActiveFilterIndicator";
import CategoryFilterSelect from "./filter-bar/CategoryFilterSelect";
import DateRangePicker from "./filter-bar/DateRangePicker";
import SearchFilterInput from "./filter-bar/SearchFilterInput";
import { FilterBarProps } from "./filter-bar/types";

export default function FilterBar({
  onSearch,
  onDateRangeChange,
  onCategoryChange,
  resetSignal,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const onSearchRef = useRef<typeof onSearch | undefined>(undefined);
  const onCategoryRef = useRef<typeof onCategoryChange | undefined>(undefined);
  const onDateRangeRef = useRef<typeof onDateRangeChange | undefined>(undefined);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange?.(value);
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    onDateRangeChange?.(start, end);
  };

  useEffect(() => {
    onSearchRef.current = onSearch;
    onCategoryRef.current = onCategoryChange;
    onDateRangeRef.current = onDateRangeChange;
  }, [onSearch, onCategoryChange, onDateRangeChange]);

  useEffect(() => {
    if (resetSignal === undefined) return;
    setSearchQuery("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    onSearchRef.current?.("");
    onCategoryRef.current?.("");
    onDateRangeRef.current?.("", "");
  }, [resetSignal]);

  const activeItems: string[] = [];
  if (searchQuery.trim()) {
    activeItems.push(`Pencarian: ${searchQuery.trim()}`);
  }
  if (category) {
    activeItems.push(`Kategori: ${category}`);
  }
  const formatDateRangeLabel = (value: string) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  };

  if (startDate || endDate) {
    if (startDate && endDate) {
      if (startDate === endDate) {
        activeItems.push(`Tanggal: ${formatDateRangeLabel(startDate)}`);
      } else {
        activeItems.push(
          `Tanggal: ${formatDateRangeLabel(startDate)} - ${formatDateRangeLabel(endDate)}`,
        );
      }
    } else {
      activeItems.push(
        `Tanggal: ${formatDateRangeLabel(startDate || endDate)}`,
      );
    }
  }

  const isActive = activeItems.length > 0;

  return (
    <div className="p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-3 lg:gap-4 items-center">
        <SearchFilterInput value={searchQuery} onChange={handleSearchChange} />

        <DateRangePicker onChange={handleDateChange} resetSignal={resetSignal} />

        <CategoryFilterSelect value={category} onChange={handleCategoryChange} />
      </div>

      {isActive && <ActiveFilterIndicator items={activeItems} />}
    </div>
  );
}
