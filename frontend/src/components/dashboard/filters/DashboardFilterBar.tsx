import type { DashboardCategory } from "../../../data/mockDashboardStats";

type CategoryFilter = "all" | DashboardCategory;

type Props = {
  selectedMonth: number;
  selectedYear: number;
  selectedCategory: CategoryFilter;
  onChangeMonth: (v: number) => void;
  onChangeYear: (v: number) => void;
  onChangeCategory: (v: CategoryFilter) => void;
  monthOptions: { value: number; label: string }[];
  yearOptions: number[];
  categoryOptions: readonly CategoryFilter[];
};

function SelectBox<T extends string | number>({
  value,
  onChange,
  children,
}: {
  value: T;
  onChange: (v: T) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-w-[170px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full h-12 rounded-2xl border border-orange-300 bg-white px-4 pr-10 text-[28px] text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-200"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

export default function DashboardFilterBar({
  selectedMonth,
  selectedYear,
  selectedCategory,
  onChangeMonth,
  onChangeYear,
  onChangeCategory,
  monthOptions,
  yearOptions,
  categoryOptions,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center justify-between">
      <p className="text-sm text-slate-600">Filter Dashboard</p>

      <div className="flex flex-wrap gap-2">
        <SelectBox value={selectedCategory} onChange={onChangeCategory}>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Pilih Kategori" : c}
            </option>
          ))}
        </SelectBox>

        <SelectBox value={selectedMonth} onChange={(v) => onChangeMonth(Number(v))}>
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </SelectBox>

        <SelectBox value={selectedYear} onChange={(v) => onChangeYear(Number(v))}>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </SelectBox>
      </div>
    </div>
  );
}
