type CategoryFilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CategoryFilterSelect({
  value,
  onChange,
}: CategoryFilterSelectProps) {
  return (
    <div>
      <label className="text-xs lg:text-sm font-semibold text-gray-600 mb-2 block">
        Kategori
      </label>
      <div className="relative">
        <select
          value={value}
          title="Category"
          onChange={(e) => onChange(e.target.value)}
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
  );
}
