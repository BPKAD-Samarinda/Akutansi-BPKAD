import {
  FiUploadCloud,
  FiRefreshCw,
  FiEye,
  FiEdit3,
  FiTrash2,
} from "react-icons/fi";
import AppTooltip from "../ui/app-tooltip";
import type { SkpDocument } from "../../types";

interface SkpTableProps {
  loading: boolean;
  currentRows: SkpDocument[];
  sortOrder: "newest" | "oldest";
  setSortOrder: (order: "newest" | "oldest") => void;
  handleOpenUploadModal: () => void;
  handleRefresh: () => void;
  isRefreshing: boolean;
  allSelected: boolean;
  someSelected: boolean;
  handleToggleSelectAll: (checked: boolean) => void;
  selectedIds: Set<number>;
  handleToggleSelect: (id: number) => void;
  safeCurrentPage: number;
  rowsPerPage: number;
  formatIndonesianDate: (date: string) => string;
  openFileInNewTab: (path: string) => void;
  isPkl: boolean;
  handleOpenEdit: (item: SkpDocument) => void;
  setDeleteTarget: (item: SkpDocument) => void;
  isAdmin: boolean;
}

export default function SkpTable({
  loading,
  currentRows,
  sortOrder,
  setSortOrder,
  handleOpenUploadModal,
  handleRefresh,
  isRefreshing,
  allSelected,
  someSelected,
  handleToggleSelectAll,
  selectedIds,
  handleToggleSelect,
  safeCurrentPage,
  rowsPerPage,
  formatIndonesianDate,
  openFileInNewTab,
  isPkl,
  handleOpenEdit,
  setDeleteTarget,
  isAdmin,
}: SkpTableProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-1 h-6 bg-[#4f46e5] rounded-full" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Daftar SKP
          </h2>
        </div>

        <div className="flex justify-end items-center overflow-x-auto w-full md:w-auto pb-1 md:pb-0 gap-2 flex-nowrap">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setSortOrder("newest")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortOrder === "newest"
                  ? "bg-[#4f46e5] text-white shadow-sm"
                  : "border border-gray-200 text-slate-500 hover:border-indigo-300 hover:text-[#4f46e5]"
              }`}
            >
              TERBARU
            </button>
            <button
              type="button"
              onClick={() => setSortOrder("oldest")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortOrder === "oldest"
                  ? "bg-[#4f46e5] text-white shadow-sm"
                  : "border border-gray-200 text-slate-500 hover:border-indigo-300 hover:text-[#4f46e5]"
              }`}
            >
              TERLAMA
            </button>
          </div>
          <div className="w-px h-5 bg-gray-200 mx-1 hidden sm:block" />
          <button
            type="button"
            onClick={handleOpenUploadModal}
            className="bg-[#4f46e5] text-white px-4 py-1.5 rounded-lg inline-flex items-center gap-1.5 text-xs font-bold transition-all hover:bg-indigo-600 active:scale-95"
          >
            <FiUploadCloud className="h-3.5 w-3.5" />
            Unggah
          </button>
          <AppTooltip content="Refresh data">
            <button
              type="button"
              onClick={handleRefresh}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-slate-500 hover:border-indigo-300 hover:text-[#4f46e5] transition-all active:scale-95 disabled:opacity-60"
            >
              <FiRefreshCw
                className={`h-3.5 w-3.5 ${
                  isRefreshing ? "animate-[spin-clean_0.8s_linear_infinite]" : ""
                }`}
              />
            </button>
          </AppTooltip>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="py-3.5 px-3 text-center w-12 align-middle">
                <AppTooltip content="Pilih Semua">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(event) => handleToggleSelectAll(event.target.checked)}
                    className="block mx-auto premium-checkbox-indigo-header"
                    aria-label="Pilih semua dokumen SKP"
                  />
                </AppTooltip>
              </th>
              <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-xs text-left w-[32%]">
                NAMA SKP
              </th>
              <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-xs text-center w-[14%]">
                PERIODE
              </th>
              <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-xs text-center w-[12%]">
                TAHUN
              </th>
              {isAdmin && (
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-xs text-center w-[15%]">
                  PEMILIK
                </th>
              )}
              <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-xs text-center w-[18%]">
                TANGGAL UNGGAH
              </th>
              <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-xs text-center w-[16%]">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900">
            {loading ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  className="py-12 text-center text-slate-400 dark:text-slate-500"
                >
                  Memuat data SKP...
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  className="py-12 text-center text-slate-400 dark:text-slate-500"
                >
                  Data SKP tidak ditemukan.
                </td>
              </tr>
            ) : (
              currentRows.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/70 ${
                    selectedIds.has(item.id)
                      ? "bg-indigo-50/70 dark:bg-indigo-500/10"
                      : ""
                  }`}
                >
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                      className="block mx-auto premium-checkbox-indigo"
                      aria-label={`Pilih dokumen SKP ${item.nama_skp}`}
                    />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-[18px] h-[18px] text-gray-300 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <AppTooltip content={item.nama_skp}>
                        <span className="block truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                          {item.nama_skp}
                        </span>
                      </AppTooltip>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                      {item.triwulan === 5 ? "Tahun" : `Triwulan ${item.triwulan}`}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex justify-center px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                      {item.tahun}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="py-3.5 px-3 text-center">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {item.uploaded_by || "-"}
                      </span>
                    </td>
                  )}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                      {formatIndonesianDate(item.created_at || "")}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex justify-center gap-1.5">
                      <AppTooltip content="Buka dokumen SKP">
                        <button
                          type="button"
                          onClick={() => openFileInNewTab(item.file_path)}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                      </AppTooltip>
                        <>
                          <AppTooltip content="Edit dokumen SKP">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                            >
                              <FiEdit3 className="h-4 w-4" />
                            </button>
                          </AppTooltip>
                          <AppTooltip content="Hapus dokumen SKP">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </AppTooltip>
                        </>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
            Memuat data SKP...
          </div>
        ) : currentRows.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
            Data SKP tidak ditemukan.
          </div>
        ) : (
          currentRows.map((item, index) => (
            <div key={item.id} className="p-4 dark:bg-slate-900">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => handleToggleSelect(item.id)}
                  className="mt-1 premium-checkbox-indigo"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
                        {item.nama_skp}
                      </p>
                    </div>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600">
                      {item.triwulan === 5 ? "Tahun" : `TW ${item.triwulan}`}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <p className="uppercase tracking-wide">Tahun</p>
                      <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">
                        {item.tahun}
                      </p>
                    </div>
                    {isAdmin && (
                      <div>
                        <p className="uppercase tracking-wide">Pemilik</p>
                        <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">
                          {item.uploaded_by || "-"}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="uppercase tracking-wide">Tanggal</p>
                      <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">
                        {formatIndonesianDate(item.created_at || "")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 mt-4">
                    <AppTooltip content="Buka dokumen SKP">
                      <button
                        type="button"
                        onClick={() => openFileInNewTab(item.file_path)}
                        className="flex-1 py-2.5 flex justify-center items-center rounded-lg bg-blue-50/50 hover:bg-blue-100 text-blue-600 transition-colors dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </AppTooltip>
                        <>
                          <AppTooltip content="Edit dokumen SKP">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="flex-1 py-2.5 flex justify-center items-center rounded-lg bg-amber-50/50 hover:bg-amber-100 text-amber-600 transition-colors dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-400"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                          </AppTooltip>
                          <AppTooltip content="Hapus dokumen SKP">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="flex-1 py-2.5 flex justify-center items-center rounded-lg bg-rose-50/50 hover:bg-rose-100 text-rose-600 transition-colors dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </AppTooltip>
                        </>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
