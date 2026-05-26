import searchIcon from "../../assets/icons/search.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  triwulanFilterOptions,
  yearOptions,
  skpSelectTriggerClass,
} from "./constants";
import type { UserApiItem } from "../../types/user";

interface SkpFilterProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearchSubmit: () => void;
  selectedTriwulan: number;
  setSelectedTriwulan: (value: number) => void;
  selectedYear: number;
  setSelectedYear: (value: number) => void;
  isAdmin: boolean;
  selectedUserFilter: string;
  setSelectedUserFilter: (value: string) => void;
  usersList: UserApiItem[];
}

export default function SkpFilter({
  searchInput,
  setSearchInput,
  handleSearchSubmit,
  selectedTriwulan,
  setSelectedTriwulan,
  selectedYear,
  setSelectedYear,
  isAdmin,
  selectedUserFilter,
  setSelectedUserFilter,
  usersList,
}: SkpFilterProps) {
  return (
    <div className="mb-4 flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-start animate-[slideUp_0.6s_ease-out_0.1s_both]">
      <div className={`flex-1 grid grid-cols-1 gap-3 lg:gap-4 w-full ${isAdmin ? 'lg:grid-cols-[minmax(0,1.3fr)_160px_160px_160px]' : 'lg:grid-cols-[minmax(0,1.3fr)_220px_220px]'}`}>
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-600 dark:text-slate-300 lg:text-sm">
            Pencarian
          </label>
          <label className="flex h-12 items-center rounded-xl border border-gray-200 bg-gray-50 px-4 shadow-sm transition focus-within:border-indigo-400 dark:border-slate-700 dark:bg-slate-900">
            <img
              src={searchIcon}
              className="mr-3 h-4 w-4 opacity-50 lg:h-5 lg:w-5"
              alt="search"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearchSubmit();
              }}
              placeholder="Cari nama SKP atau pengunggah"
              className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500 lg:text-sm"
            />
          </label>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-600 dark:text-slate-300 lg:text-sm">
            Periode
          </label>
          <Select
            value={String(selectedTriwulan)}
            onValueChange={(value) => setSelectedTriwulan(Number(value))}
          >
            <SelectTrigger className={skpSelectTriggerClass}>
              <SelectValue placeholder="Semua Periode" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              {triwulanFilterOptions.map((option) => (
                <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-600 dark:text-slate-300 lg:text-sm">
            Tahun
          </label>
          <Select
            value={String(selectedYear)}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className={skpSelectTriggerClass}>
              <SelectValue placeholder="Semua Tahun" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" value="0">Semua Tahun</SelectItem>
              {yearOptions.map((year) => (
                <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isAdmin && (
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-600 dark:text-slate-300 lg:text-sm">
              Filter User
            </label>
            <Select
              value={selectedUserFilter || "all"}
              onValueChange={(value) => setSelectedUserFilter(value === "all" ? "" : value)}
            >
              <SelectTrigger className={skpSelectTriggerClass}>
                <SelectValue placeholder="Semua User" />
              </SelectTrigger>
              <SelectContent className="max-h-60 rounded-xl border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" value="all">Semua User</SelectItem>
                {usersList.map((u) => (
                  <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={u.id} value={u.username}>
                    {u.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
