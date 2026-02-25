import { useState } from "react";
import ActiveFilterIndicator from "./filter-bar/ActiveFilterIndicator";
import CategoryFilterSelect from "./filter-bar/CategoryFilterSelect";
import DateRangePicker from "./filter-bar/DateRangePicker";
import SearchFilterInput from "./filter-bar/SearchFilterInput";
import { FilterBarProps } from "./filter-bar/types";

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
        <SearchFilterInput value={searchQuery} onChange={handleSearchChange} />

        <DateRangePicker onChange={(s, e) => onDateRangeChange?.(s, e)} />

        <CategoryFilterSelect
          value={category}
          onChange={handleCategoryChange}
        />
      </div>

      {isActive && <ActiveFilterIndicator />}
    </div>
  );
}
