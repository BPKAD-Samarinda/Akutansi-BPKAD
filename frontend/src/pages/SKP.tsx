import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { Toast } from "../components/snackbar";
import DocumentTablePagination from "../components/document/table/DocumentTablePagination";
import {
  createSkpDocument,
  deleteSkpDocument,
  getSkpDocuments,
  updateSkpDocument,
  uploadsBaseUrl,
} from "../services/api";
import { getUser } from "../utils/auth";
import type { SkpDocument, ToastState } from "../types";

const triwulanOptions = [
  { value: 0, label: "Semua Triwulan" },
  { value: 1, label: "Triwulan 1" },
  { value: 2, label: "Triwulan 2" },
  { value: 3, label: "Triwulan 3" },
  { value: 4, label: "Triwulan 4" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 8 }, (_, idx) => currentYear - idx);
const MAX_SKP_FILE_SIZE = 30 * 1024 * 1024;
const allowedSkpMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/jfif",
  "image/png",
  "image/heic",
  "image/heif",
]);

type UploadForm = {
  nama_skp: string;
  triwulan: number;
  tahun: number;
  file: File | null;
};

export default function SkpPage() {
  const user = getUser();
  const isAdmin = user?.role === "Admin" || user?.role === "Admin Akuntansi";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<SkpDocument[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTriwulan, setSelectedTriwulan] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const [editing, setEditing] = useState<SkpDocument | null>(null);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    nama_skp: "",
    triwulan: 1,
    tahun: currentYear,
    file: null,
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "info" });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  const validateSkpInput = (payload: {
    nama_skp: string;
    triwulan: number;
    tahun: number;
    file?: File | null;
  }): string | null => {
    const name = payload.nama_skp.trim();
    if (name.length < 3 || name.length > 255) {
      return "Nama SKP harus 3-255 karakter.";
    }
    if (![1, 2, 3, 4].includes(payload.triwulan)) {
      return "Triwulan tidak valid.";
    }
    if (Number.isNaN(payload.tahun) || payload.tahun < 2000 || payload.tahun > currentYear + 1) {
      return "Tahun tidak valid.";
    }
    if (payload.file) {
      if (!allowedSkpMimeTypes.has(payload.file.type)) {
        return "Tipe file tidak didukung.";
      }
      if (payload.file.size > MAX_SKP_FILE_SIZE) {
        return "Ukuran file maksimal 30MB.";
      }
    }
    return null;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSkpDocuments({
        triwulan: selectedTriwulan || undefined,
        tahun: selectedYear || undefined,
      });
      setDocuments(Array.isArray(data) ? data : []);
    } catch {
      showToast("Gagal mengambil data SKP.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTriwulan, selectedYear]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTriwulan, selectedYear, rowsPerPage]);

  const filteredBySearch = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter((item) =>
      String(item.uploaded_by || "").toLowerCase().includes(query),
    );
  }, [documents, search]);

  const totalPages = Math.max(1, Math.ceil(filteredBySearch.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * rowsPerPage;
    return filteredBySearch.slice(start, start + rowsPerPage);
  }, [filteredBySearch, rowsPerPage, safeCurrentPage]);

  const handleOpenFile = (filePath: string) => {
    const rawPath = String(filePath || "").trim();
    if (!rawPath) return showToast("File tidak tersedia.", "warning");
    const normalized = rawPath.replace(/\\/g, "/").replace(/^\/+/, "");
    const relative = normalized.replace(/^uploads\//i, "");
    window.open(`${uploadsBaseUrl}/${relative}`, "_blank", "noopener,noreferrer");
  };

  const handleSubmitUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uploadForm.file) return showToast("File dokumen SKP wajib dipilih.", "warning");
    const uploadError = validateSkpInput(uploadForm);
    if (uploadError) return showToast(uploadError, "warning");

    setIsSubmittingUpload(true);
    try {
      await createSkpDocument({
        nama_skp: uploadForm.nama_skp.trim(),
        triwulan: uploadForm.triwulan,
        tahun: uploadForm.tahun,
        file: uploadForm.file,
      });
      showToast("Dokumen SKP berhasil diunggah.", "success");
      setIsUploadOpen(false);
      setUploadForm({ nama_skp: "", triwulan: 1, tahun: currentYear, file: null });
      await loadData();
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Gagal mengunggah dokumen SKP.", "error");
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const editError = validateSkpInput({
      nama_skp: editing.nama_skp,
      triwulan: editing.triwulan,
      tahun: editing.tahun,
    });
    if (editError) return showToast(editError, "warning");
    try {
      await updateSkpDocument(editing.id, {
        nama_skp: editing.nama_skp,
        triwulan: editing.triwulan,
        tahun: editing.tahun,
      });
      showToast("Dokumen SKP berhasil diperbarui.", "success");
      setEditing(null);
      await loadData();
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Gagal memperbarui dokumen SKP.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus dokumen SKP ini?")) return;
    try {
      await deleteSkpDocument(id);
      showToast("Dokumen SKP berhasil dihapus.", "success");
      await loadData();
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Gagal menghapus dokumen SKP.", "error");
    }
  };

  const handleExportCsv = () => {
    if (filteredBySearch.length === 0) return showToast("Tidak ada data untuk diekspor.", "warning");
    const header = ["Nama SKP", "Staff", "Triwulan", "Tahun", "Tanggal Upload"];
    const rows = filteredBySearch.map((item) => [
      item.nama_skp,
      item.uploaded_by || "-",
      `Triwulan ${item.triwulan}`,
      String(item.tahun),
      item.created_at ? String(item.created_at).slice(0, 10) : "-",
    ]);
    const csv = [header, ...rows]
      .map((line) => line.map((col) => `"${String(col).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skp_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 lg:ml-64 flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="SKP (Sasaran Kinerja Pegawai)" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:max-w-3xl">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama staff..." className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              <select value={selectedTriwulan} onChange={(e) => setSelectedTriwulan(Number(e.target.value))} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                {triwulanOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
              </select>
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                <option value={0}>Semua Tahun</option>
                {yearOptions.map((year) => (<option key={year} value={year}>{year}</option>))}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleExportCsv} className="h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold">Export CSV</button>
              <button type="button" onClick={() => setIsUploadOpen(true)} className="h-11 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold">Upload SKP</button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-4 lg:p-6">
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900"><tr className="text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800"><th className="text-left px-4 py-3">No</th><th className="text-left px-4 py-3">Nama SKP</th><th className="text-left px-4 py-3">Staff</th><th className="text-left px-4 py-3">Triwulan</th><th className="text-left px-4 py-3">Tahun</th><th className="text-left px-4 py-3">Tanggal Upload</th><th className="text-left px-4 py-3">Aksi</th></tr></thead>
                  <tbody>
                    {loading ? <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">Memuat data SKP...</td></tr> : pageRows.length === 0 ? <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">Data SKP tidak ditemukan.</td></tr> : pageRows.map((item, index) => (
                      <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="px-4 py-3 text-slate-700">{(safeCurrentPage - 1) * rowsPerPage + index + 1}</td>
                        <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-medium">{item.nama_skp}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.uploaded_by || "-"}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Triwulan {item.triwulan}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.tahun}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.created_at ? String(item.created_at).slice(0, 10) : "-"}</td>
                        <td className="px-4 py-3"><div className="flex gap-2"><button type="button" onClick={() => handleOpenFile(item.file_path)} className="h-8 px-3 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 text-xs font-semibold">Lihat</button>{isAdmin && <><button type="button" onClick={() => setEditing(item)} className="h-8 px-3 rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50 text-xs font-semibold">Edit</button><button type="button" onClick={() => handleDelete(item.id)} className="h-8 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold">Hapus</button></>}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <DocumentTablePagination totalDocuments={filteredBySearch.length} currentPage={safeCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} onPageChange={setCurrentPage} onRowsPerPageChange={setRowsPerPage} />
          </div>
        </main>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-slate-900">Upload SKP</h2><button type="button" onClick={() => setIsUploadOpen(false)} className="text-slate-500 hover:text-slate-700">Tutup</button></div><form onSubmit={handleSubmitUpload} className="space-y-4"><div><label className="block text-sm font-medium text-slate-700 mb-1">Nama SKP</label><input type="text" value={uploadForm.nama_skp} onChange={(e) => setUploadForm((prev) => ({ ...prev, nama_skp: e.target.value }))} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm" placeholder="Masukkan nama SKP" /></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-slate-700 mb-1">Triwulan</label><select value={uploadForm.triwulan} onChange={(e) => setUploadForm((prev) => ({ ...prev, triwulan: Number(e.target.value) }))} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm"><option value={1}>Triwulan 1</option><option value={2}>Triwulan 2</option><option value={3}>Triwulan 3</option><option value={4}>Triwulan 4</option></select></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Tahun</label><select value={uploadForm.tahun} onChange={(e) => setUploadForm((prev) => ({ ...prev, tahun: Number(e.target.value) }))} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm">{yearOptions.map((year) => (<option key={year} value={year}>{year}</option>))}</select></div></div><div><label className="block text-sm font-medium text-slate-700 mb-1">File Dokumen SKP</label><input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.jfif,.heic,.heif" onChange={(e) => setUploadForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }))} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm" /></div><div className="flex items-center justify-end gap-2 pt-2"><button type="button" onClick={() => setIsUploadOpen(false)} className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700">Batal</button><button type="submit" disabled={isSubmittingUpload} className="h-10 px-4 rounded-lg bg-orange-500 text-white font-semibold disabled:opacity-70">{isSubmittingUpload ? "Mengunggah..." : "Upload SKP"}</button></div></form></div></div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-slate-900">Edit SKP</h2><button type="button" onClick={() => setEditing(null)} className="text-slate-500 hover:text-slate-700">Tutup</button></div><form onSubmit={handleSubmitEdit} className="space-y-4"><div><label className="block text-sm font-medium text-slate-700 mb-1">Nama SKP</label><input type="text" value={editing.nama_skp} onChange={(e) => setEditing((prev) => (prev ? { ...prev, nama_skp: e.target.value } : prev))} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm" /></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-slate-700 mb-1">Triwulan</label><select value={editing.triwulan} onChange={(e) => setEditing((prev) => (prev ? { ...prev, triwulan: Number(e.target.value) } : prev))} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm"><option value={1}>Triwulan 1</option><option value={2}>Triwulan 2</option><option value={3}>Triwulan 3</option><option value={4}>Triwulan 4</option></select></div><div><label className="block text-sm font-medium text-slate-700 mb-1">Tahun</label><select value={editing.tahun} onChange={(e) => setEditing((prev) => (prev ? { ...prev, tahun: Number(e.target.value) } : prev))} className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm">{yearOptions.map((year) => (<option key={year} value={year}>{year}</option>))}</select></div></div><div className="flex items-center justify-end gap-2 pt-2"><button type="button" onClick={() => setEditing(null)} className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700">Batal</button><button type="submit" className="h-10 px-4 rounded-lg bg-sky-500 text-white font-semibold">Simpan</button></div></form></div></div>
      )}

      {toast.show && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />}
    </div>
  );
}
