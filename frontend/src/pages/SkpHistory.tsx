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

  useEffect(() => {
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
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 lg:ml-64 flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Riwayat SKP" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <select value={action} onChange={(e) => setAction(e.target.value as any)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm">
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <input type="text" value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="Filter staff target..." className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari actor/staff/aksi..." className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-4 lg:p-6">
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr className="text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left px-4 py-3">No</th>
                      <th className="text-left px-4 py-3">Aksi</th>
                      <th className="text-left px-4 py-3">Actor</th>
                      <th className="text-left px-4 py-3">Target Staff</th>
                      <th className="text-left px-4 py-3">Waktu</th>
                      <th className="text-left px-4 py-3">Perubahan</th>
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
                            <td className="px-4 py-3 text-slate-700">{(safeCurrentPage - 1) * rowsPerPage + index + 1}</td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${actionBadgeClass(item.action_type)}`}>{item.action_type}</span></td>
                            <td className="px-4 py-3 text-slate-700">{item.actor_username || "-"}<div className="text-xs text-slate-400">{item.actor_role || "-"}</div></td>
                            <td className="px-4 py-3 text-slate-700">{item.target_uploaded_by || "-"}</td>
                            <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{formatDateTime(item.created_at)}</td>
                            <td className="px-4 py-3 text-xs text-slate-600">
                              <div><span className="font-semibold">Before:</span> {before}</div>
                              <div className="mt-1"><span className="font-semibold">After:</span> {after}</div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <DocumentTablePagination totalDocuments={items.length} currentPage={safeCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} onPageChange={setCurrentPage} onRowsPerPageChange={setRowsPerPage} />
          </div>
        </main>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />}
    </div>
  );
}
