import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { Toast } from "../components/snackbar";
import DocumentTablePagination from "../components/document/table/DocumentTablePagination";
import { getSkpHistories } from "../services/api";
import type { SkpHistory, ToastState } from "../types";

const actionOptions = [
  { value: "all", label: "Semua Aksi" },
  { value: "upload", label: "Upload" },
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Hapus" },
] as const;

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 19);
  return d.toLocaleString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const safeJsonText = (value?: string | null) => {
  if (!value) return "-";
  try {
    return JSON.stringify(JSON.parse(value));
  } catch {
    return String(value);
  }
};

export default function SkpHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SkpHistory[]>([]);
  const [action, setAction] = useState<(typeof actionOptions)[number]["value"]>("all");
  const [staff, setStaff] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "info" });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const rows = await getSkpHistories({ action, staff, search, startDate, endDate });
        setItems(rows);
      } catch {
        showToast("Gagal mengambil riwayat SKP.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [action, staff, search, startDate, endDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [action, staff, search, startDate, endDate, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * rowsPerPage;
    return items.slice(start, start + rowsPerPage);
  }, [items, rowsPerPage, safeCurrentPage]);

  const actionBadgeClass = (value: string) => {
    if (value === "upload") return "bg-emerald-100 text-emerald-700";
    if (value === "edit") return "bg-sky-100 text-sky-700";
    if (value === "delete") return "bg-rose-100 text-rose-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-slate-950 font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 lg:ml-[280px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Riwayat SKP" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <select value={action} onChange={(e) => setAction(e.target.value as (typeof actionOptions)[number]["value"])} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm">
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <input type="text" value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="Filter staff target..." className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" />
            <div className="flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 focus-within:border-teal-400 transition w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-50 text-gray-500 dark:text-slate-400 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari actor/staff/aksi..." className="bg-transparent outline-none w-full text-sm font-medium text-gray-700 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500" />
            </div>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-1 h-6 bg-teal-500 rounded-full" />
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                  Riwayat SKP
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-full table-fixed border-collapse text-sm">
                  <thead className="bg-teal-600 text-white">
                    <tr>
                      <th className="text-center align-middle py-3.5 px-3 font-bold w-12 uppercase tracking-wider text-xs">NO</th>
                      <th className="text-left py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[12%]">AKSI</th>
                      <th className="text-left py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[18%]">ACTOR</th>
                      <th className="text-left py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[18%]">TARGET STAFF</th>
                      <th className="text-left py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[18%]">WAKTU</th>
                      <th className="text-left py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[34%]">PERUBAHAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Memuat riwayat SKP...</td></tr>
                    ) : pageRows.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Riwayat SKP belum ada.</td></tr>
                    ) : (
                      pageRows.map((item, index) => {
                        const before = safeJsonText(item.before_data);
                        const after = safeJsonText(item.after_data);
                        return (
                          <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 align-top">
                            <td className="text-center align-middle py-3.5 px-3">{(safeCurrentPage - 1) * rowsPerPage + index + 1}</td>
                            <td className="py-3.5 px-3 align-top"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${actionBadgeClass(item.action_type)}`}>{item.action_type}</span></td>
                            <td className="py-3.5 px-3 align-top text-gray-700 dark:text-slate-200">{item.actor_username || "-"}<div className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{item.actor_role || "-"}</div></td>
                            <td className="py-3.5 px-3 align-top text-gray-700 dark:text-slate-200">{item.target_uploaded_by || "-"}</td>
                            <td className="py-3.5 px-3 align-top text-gray-700 dark:text-slate-200">{formatDateTime(item.created_at)}</td>
                            <td className="py-3.5 px-3 align-top text-xs text-gray-600 dark:text-slate-300">
                              <div className="truncate"><span className="font-semibold text-gray-500 dark:text-slate-400">Before:</span> {before}</div>
                              <div className="mt-1 truncate"><span className="font-semibold text-gray-500 dark:text-slate-400">After:</span> {after}</div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-800">
              <DocumentTablePagination totalDocuments={items.length} currentPage={safeCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} onPageChange={setCurrentPage} onRowsPerPageChange={setRowsPerPage} colorTheme="teal" />
            </div>
          </div>
        </main>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />}
    </div>
  );
}
