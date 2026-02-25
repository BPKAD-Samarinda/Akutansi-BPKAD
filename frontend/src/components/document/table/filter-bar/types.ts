export interface FilterBarProps {
  onSearch?: (query: string) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onCategoryChange?: (category: string) => void;
  onRefresh?: () => void;
}
