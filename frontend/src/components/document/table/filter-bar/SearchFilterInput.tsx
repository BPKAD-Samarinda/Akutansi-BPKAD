import searchIcon from "../../../../assets/icons/search.svg";

type SearchFilterInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchFilterInput({
  value,
  onChange,
}: SearchFilterInputProps) {
  return (
    <div>
      <label className="text-xs lg:text-sm font-semibold text-gray-600 dark:text-slate-300 mb-2 block">
        Pencarian
      </label>
      <div className="flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 lg:py-3 focus-within:border-orange-400 transition">
        <img
          src={searchIcon}
          className="w-4 h-4 lg:w-5 lg:h-5 mr-3 opacity-50"
          alt="search"
        />
        <input
          type="text"
          placeholder="Cari Dokumen"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none w-full text-xs lg:text-sm text-gray-700 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}
