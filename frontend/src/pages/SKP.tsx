import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { Toast } from "../components/snackbar";
import { createSkpDocument, getSkpDocuments, uploadsBaseUrl } from "../services/api";
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

type UploadForm = {
  nama_skp: string;
  triwulan: number;
  tahun: number;
  file: File | null;
};

export default function SkpPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<SkpDocument[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTriwulan, setSelectedTriwulan] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    nama_skp: "",
    triwulan: 1,
    tahun: currentYear,
    file: null,
  });
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSkpDocuments({
        triwulan: selectedTriwulan || undefined,
        tahun: selectedYear || undefined,
        search,
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

  const filteredBySearch = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter((item) =>
      String(item.uploaded_by || "").toLowerCase().includes(query),
    );
  }, [documents, search]);

  const handleOpenFile = (filePath: string) => {
    const rawPath = String(filePath || "").trim();
    if (!rawPath) {
      showToast("File tidak tersedia.", "warning");
      return;
    }

    const normalized = rawPath.replace(/\\/g, "/").replace(/^\/+/, "");
    const relative = normalized.replace(/^uploads\//i, "");
    const fileUrl = `${uploadsBaseUrl}/${relative}`;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleSubmitUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!uploadForm.nama_skp.trim()) {
      showToast("Nama SKP wajib diisi.", "warning");
      return;
    }

    if (![1, 2, 3, 4].includes(uploadForm.triwulan)) {
      showToast("Triwulan tidak valid.", "warning");
      return;
    }

    if (!uploadForm.file) {
      showToast("File dokumen SKP wajib dipilih.", "warning");
      return;
    }

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
      const message = error?.response?.data?.message || "Gagal mengunggah dokumen SKP.";
      showToast(message, "error");
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="ml-0 lg:ml-64 flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="SKP (Sasaran Kinerja Pegawai)" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:max-w-3xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama staff..."
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />

              <select
                value={selectedTriwulan}
                onChange={(e) => setSelectedTriwulan(Number(e.target.value))}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                {triwulanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value={0}>Semua Tahun</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="h-11 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold"
            >
              Upload SKP
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-4 lg:p-6">
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr className="text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left px-4 py-3">No</th>
                      <th className="text-left px-4 py-3">Nama SKP</th>
                      <th className="text-left px-4 py-3">Staff</th>
                      <th className="text-left px-4 py-3">Triwulan</th>
                      <th className="text-left px-4 py-3">Tahun</th>
                      <th className="text-left px-4 py-3">Tanggal Upload</th>
                      <th className="text-left px-4 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                          Memuat data SKP...
                        </td>
                      </tr>
                    ) : filteredBySearch.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                          Data SKP tidak ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filteredBySearch.map((item, index) => (
                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="px-4 py-3 text-slate-700">{index + 1}</td>
                          <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-medium">{item.nama_skp}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.uploaded_by || "-"}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Triwulan {item.triwulan}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.tahun}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.created_at ? String(item.created_at).slice(0, 10) : "-"}</td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleOpenFile(item.file_path)}
                              className="h-8 px-3 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 text-xs font-semibold"
                            >
                              Lihat Dokumen
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Upload SKP</h2>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama SKP</label>
                <input
                  type="text"
                  value={uploadForm.nama_skp}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, nama_skp: e.target.value }))
                  }
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Masukkan nama SKP"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Triwulan</label>
                  <select
                    value={uploadForm.triwulan}
                    onChange={(e) =>
                      setUploadForm((prev) => ({ ...prev, triwulan: Number(e.target.value) }))
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value={1}>Triwulan 1</option>
                    <option value={2}>Triwulan 2</option>
                    <option value={3}>Triwulan 3</option>
                    <option value={4}>Triwulan 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tahun</label>
                  <select
                    value={uploadForm.tahun}
                    onChange={(e) =>
                      setUploadForm((prev) => ({ ...prev, tahun: Number(e.target.value) }))
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File Dokumen SKP</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      file: e.target.files && e.target.files[0] ? e.target.files[0] : null,
                    }))
                  }
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm file:mr-3 file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-orange-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpload}
                  className="h-10 px-4 rounded-lg bg-orange-500 text-white font-semibold disabled:opacity-70"
                >
                  {isSubmittingUpload ? "Mengunggah..." : "Upload SKP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
