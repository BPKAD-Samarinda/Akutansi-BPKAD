export const triwulanFilterOptions = [
  { value: 0, label: "Semua Periode" },
  { value: 1, label: "Triwulan 1" },
  { value: 2, label: "Triwulan 2" },
  { value: 3, label: "Triwulan 3" },
  { value: 4, label: "Triwulan 4" },
  { value: 5, label: "Tahun" },
];

export const triwulanFormOptions = [
  { value: 0, label: "Semua Periode" },
  { value: 1, label: "Triwulan 1" },
  { value: 2, label: "Triwulan 2" },
  { value: 3, label: "Triwulan 3" },
  { value: 4, label: "Triwulan 4" },
  { value: 5, label: "Tahun" },
];

export const currentYear = new Date().getFullYear();
export const yearOptions = Array.from({ length: 11 }, (_, idx) => 2031 - idx);

export const MAX_SKP_FILE_SIZE = 10 * 1024 * 1024;
export const allowedSkpMimeTypes = new Set([
  "application/pdf",
]);

export const skpSelectTriggerClass =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-left text-xs font-medium text-gray-700 shadow-sm transition focus:border-indigo-400 focus:ring-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 lg:text-sm";
