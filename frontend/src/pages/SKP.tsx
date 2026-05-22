import { useEffect, useMemo, useState } from "react";
import searchIcon from "../assets/icons/search.svg";
import {
  FiDownload,
  FiEdit3,
  FiEye,
  FiFileText,
  FiRefreshCw,
  FiTrash2,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import DocumentTablePagination from "../components/document/table/DocumentTablePagination";
import ConfirmDialog from "../components/layout/ui/ConfirmDialog";
import AppTooltip from "../components/ui/app-tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Toast } from "../components/snackbar";
import {
  createSkpDocument,
  deleteSkpDocument,
  getSkpDocuments,
  updateSkpDocument,
  uploadsBaseUrl,
  getUsers,
} from "../services/api";
import { formatIndonesianDate } from "../utils/localDate";
import { getUser } from "../utils/auth";
import type { SkpDocument, ToastState } from "../types";
import type { UserApiItem } from "../types/user";

const triwulanFilterOptions = [
  { value: 0, label: "Semua Triwulan" },
  { value: 1, label: "Triwulan 1" },
  { value: 2, label: "Triwulan 2" },
  { value: 3, label: "Triwulan 3" },
  { value: 4, label: "Triwulan 4" },
];

const triwulanFormOptions = [
  { value: 1, label: "Triwulan 1" },
  { value: 2, label: "Triwulan 2" },
  { value: 3, label: "Triwulan 3" },
  { value: 4, label: "Triwulan 4" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 11 }, (_, idx) => 2031 - idx);
const MAX_SKP_FILE_SIZE = 10 * 1024 * 1024;
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
  target_user?: string;
};

type EditForm = {
  id: number;
  nama_skp: string;
  triwulan: number;
  tahun: number;
  file_path: string;
  file: File | null;
  target_user?: string;
};

const initialUploadForm = (): UploadForm => ({
  nama_skp: "",
  triwulan: 1,
  tahun: currentYear,
  file: null,
  target_user: "",
});

const skpSelectTriggerClass =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-left text-xs font-medium text-gray-700 shadow-sm transition focus:border-indigo-400 focus:ring-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 lg:text-sm";

const getFileNameFromPath = (value: string) => {
  if (!value) return "";
  const normalized = value.replace(/\\/g, "/");
  return normalized.split("/").pop() || value;
};

const buildFileUrl = (filePath: string) => {
  const normalized = String(filePath || "").trim().replace(/\\/g, "/").replace(/^\/+/, "");
  const relative = normalized.replace(/^uploads\//i, "");
  return `${uploadsBaseUrl}/${relative}`;
};

const openFileInNewTab = (filePath: string) => {
  window.open(buildFileUrl(filePath), "_blank", "noopener,noreferrer");
};

const downloadFile = (filePath: string) => {
  const link = document.createElement("a");
  link.href = buildFileUrl(filePath);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.download = getFileNameFromPath(filePath) || "dokumen-skp";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default function SkpPage() {
  const user = getUser();
  const isAdmin = user?.role === "Admin" || user?.role === "Admin Akuntansi";
  const [usersList, setUsersList] = useState<UserApiItem[]>([]);

  useEffect(() => {
    if (isAdmin) {
      getUsers().then(setUsersList).catch(() => {});
    }
  }, [isAdmin]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<SkpDocument[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedTriwulan, setSelectedTriwulan] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedUserFilter, setSelectedUserFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>(initialUploadForm);
  const [editing, setEditing] = useState<EditForm | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SkpDocument | null>(null);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  const validateSkpInput = (payload: UploadForm | Omit<EditForm, "id" | "file_path">) => {
    const name = payload.nama_skp.trim();
    if (name.length < 3 || name.length > 255) {
      return "Nama SKP harus 3-255 karakter.";
    }
    if (![1, 2, 3, 4].includes(payload.triwulan)) {
      return "Triwulan tidak valid.";
    }
    if (Number.isNaN(payload.tahun) || payload.tahun < 2000 || payload.tahun > 2031) {
      return "Tahun tidak valid.";
    }
    if (payload.file) {
      if (!allowedSkpMimeTypes.has(payload.file.type)) {
        return "Tipe file tidak didukung.";
      }
      if (payload.file.size > MAX_SKP_FILE_SIZE) {
        return "Ukuran file maksimal 10MB.";
      }
    }
    return null;
  };

  const loadData = async (overrides?: { search?: string; triwulan?: number; tahun?: number; uploader_name?: string }) => {
    setLoading(true);
    try {
      const data = await getSkpDocuments({
        search: overrides?.search ?? search,
        triwulan: overrides?.triwulan ?? (selectedTriwulan || undefined),
        tahun: overrides?.tahun ?? (selectedYear || undefined),
        uploader_name: overrides?.uploader_name ?? (selectedUserFilter || undefined),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTriwulan, selectedYear, search, selectedUserFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [documents, rowsPerPage, sortOrder]);

  useEffect(() => {
    setSelectedIds((previous) => {
      if (previous.size === 0) return previous;
      const availableIds = new Set(documents.map((item) => item.id));
      const next = new Set(Array.from(previous).filter((id) => availableIds.has(id)));
      return next.size === previous.size ? previous : next;
    });
  }, [documents]);

  const sortedDocuments = useMemo(() => {
    const next = [...documents];
    next.sort((left, right) => {
      const leftTime = new Date(left.created_at || 0).getTime();
      const rightTime = new Date(right.created_at || 0).getTime();
      if (leftTime === rightTime) {
        return sortOrder === "newest" ? right.id - left.id : left.id - right.id;
      }
      return sortOrder === "newest" ? rightTime - leftTime : leftTime - rightTime;
    });
    return next;
  }, [documents, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedDocuments.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const currentRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * rowsPerPage;
    return sortedDocuments.slice(start, start + rowsPerPage);
  }, [rowsPerPage, safeCurrentPage, sortedDocuments]);

  const allSelected =
    currentRows.length > 0 && currentRows.every((item) => selectedIds.has(item.id));
  const someSelected =
    currentRows.some((item) => selectedIds.has(item.id)) && !allSelected;

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    setSearch(searchInput.trim());
  };

  const handleOpenUploadModal = () => {
    setUploadForm(initialUploadForm());
    setIsUploadOpen(true);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setSearch("");
    setSearchInput("");
    setSelectedTriwulan(0);
    setSelectedYear(0);
    setSelectedUserFilter("");
    setSelectedIds(new Set());
    setCurrentPage(1);
    await loadData({ search: "", triwulan: undefined, tahun: undefined, uploader_name: undefined });
    showToast("Data SKP berhasil diperbarui.", "success");
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds((previous) => {
        const next = new Set(previous);
        currentRows.forEach((item) => next.delete(item.id));
        return next;
      });
      return;
    }

    setSelectedIds((previous) => {
      const next = new Set(previous);
      currentRows.forEach((item) => next.add(item.id));
      return next;
    });
  };

  const handleDownloadSelected = () => {
    const selectedDocuments = sortedDocuments.filter((item) => selectedIds.has(item.id));
    if (selectedDocuments.length === 0) {
      showToast("Pilih minimal satu dokumen SKP.", "warning");
      return;
    }

    selectedDocuments.forEach((item, index) => {
      window.setTimeout(() => downloadFile(item.file_path), index * 180);
    });
    showToast(`${selectedDocuments.length} dokumen SKP sedang diunduh.`, "success");
  };

  const handleOpenEdit = (item: SkpDocument) => {
    setEditing({
      id: item.id,
      nama_skp: item.nama_skp,
      triwulan: item.triwulan,
      tahun: item.tahun,
      file_path: item.file_path,
      target_user: item.uploaded_by || "",
      file: null,
    });
  };

  const handleSubmitUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uploadForm.file) {
      showToast("File dokumen SKP wajib dipilih.", "warning");
      return;
    }

    const validationMessage = validateSkpInput(uploadForm);
    if (validationMessage) {
      showToast(validationMessage, "warning");
      return;
    }

    setIsSubmittingUpload(true);
    try {
        await createSkpDocument({
          nama_skp: uploadForm.nama_skp.trim(),
          triwulan: uploadForm.triwulan,
          tahun: uploadForm.tahun,
          file: uploadForm.file,
          target_user: uploadForm.target_user || undefined,
        });
      showToast("Dokumen SKP berhasil diunggah.", "success");
      setIsUploadOpen(false);
      setUploadForm(initialUploadForm());
      await loadData();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showToast((error as any)?.response?.data?.message || "Gagal mengunggah dokumen SKP.", "error");
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;

    const validationMessage = validateSkpInput(editing);
    if (validationMessage) {
      showToast(validationMessage, "warning");
      return;
    }

    setIsSubmittingEdit(true);
    try {
      await updateSkpDocument(editing.id, {
        nama_skp: editing.nama_skp.trim(),
        triwulan: editing.triwulan,
        tahun: editing.tahun,
        target_user: editing.target_user || undefined,
        file: editing.file,
      });
      showToast("Dokumen SKP berhasil diperbarui.", "success");
      setEditing(null);
      await loadData();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showToast((error as any)?.response?.data?.message || "Gagal memperbarui dokumen SKP.", "error");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSkpDocument(deleteTarget.id);
      showToast("Dokumen SKP berhasil dihapus.", "success");
      setDeleteTarget(null);
      setSelectedIds((previous) => {
        const next = new Set(previous);
        next.delete(deleteTarget.id);
        return next;
      });
      await loadData();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showToast((error as any)?.response?.data?.message || "Gagal menghapus dokumen SKP.", "error");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-slate-950 font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 lg:ml-[280px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Sasaran Kinerja Pegawai" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-6">
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
                  Triwulan
                </label>
                <Select
                  value={String(selectedTriwulan)}
                  onValueChange={(value) => setSelectedTriwulan(Number(value))}
                >
                  <SelectTrigger className={skpSelectTriggerClass}>
                    <SelectValue placeholder="Semua Triwulan" />
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

          {selectedIds.size > 0 && (
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between animate-[slideDown_0.3s_ease-out] dark:border-indigo-500/30 dark:bg-indigo-500/10">
              <p className="text-sm font-semibold text-indigo-700">
                {selectedIds.size} dokumen SKP dipilih
              </p>
              <button
                type="button"
                onClick={handleDownloadSelected}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                <FiDownload className="h-4 w-4" />
                Unduh Terpilih
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-[slideUp_0.6s_ease-out_0.2s_both] dark:border-slate-800 dark:bg-slate-900">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-1 h-6 bg-[#4f46e5] rounded-full" />
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                  Daftar SKP
                </h2>
              </div>
              
              <div className="flex justify-end overflow-x-auto w-full md:w-auto pb-1 md:pb-0 gap-2 flex-wrap md:flex-nowrap">
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
                      className={`h-3.5 w-3.5 ${isRefreshing ? "animate-[spin-clean_0.8s_linear_infinite]" : ""}`}
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
                            className="block mx-auto h-4 w-4 rounded border-white/60 bg-transparent accent-indigo-400"
                            aria-label="Pilih semua dokumen SKP"
                          />
                        </AppTooltip>
                      </th>
                      <th className="py-3.5 px-3 font-bold w-12 uppercase tracking-wider text-xs text-center align-middle">
                        NO
                      </th>
                      <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-xs text-left w-[32%]">
                        NAMA SKP
                      </th>
                      <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-xs text-center w-[14%]">
                        TRIWULAN
                      </th>
                      <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-xs text-center w-[12%]">
                        TAHUN
                      </th>
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
                        <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                          Memuat data SKP...
                        </td>
                      </tr>
                    ) : currentRows.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                          Data SKP tidak ditemukan.
                        </td>
                      </tr>
                    ) : (
                      currentRows.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`border-b border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/70 ${
                            selectedIds.has(item.id) ? "bg-indigo-50/70 dark:bg-indigo-500/10" : ""
                          }`}
                        >
                          <td className="py-4 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(item.id)}
                              onChange={() => handleToggleSelect(item.id)}
                              className="block mx-auto h-4 w-4 rounded border-gray-300 accent-indigo-500"
                              aria-label={`Pilih dokumen SKP ${item.nama_skp}`}
                            />
                          </td>
                          <td className="py-3.5 px-3 text-center text-sm font-semibold text-slate-500">
                            {(safeCurrentPage - 1) * rowsPerPage + index + 1}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <AppTooltip content={item.nama_skp}>
                                <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                  {item.nama_skp}
                                </span>
                              </AppTooltip>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                              <span className="text-[#4f46e5]">🏷</span>
                              Triwulan {item.triwulan}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="inline-flex justify-center px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                              {item.tahun}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
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
                          className="mt-1 h-4 w-4 rounded border-gray-300 accent-indigo-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                                No {(safeCurrentPage - 1) * rowsPerPage + index + 1}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {item.nama_skp}
                              </p>
                            </div>
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600">
                              TW {item.triwulan}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <div>
                              <p className="uppercase tracking-wide">Tahun</p>
                              <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">{item.tahun}</p>
                            </div>
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
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-800">
              <DocumentTablePagination
                totalDocuments={sortedDocuments.length}
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
                colorTheme="indigo"
              />
            </div>
          </div>
        </main>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl animate-[scaleIn_0.25s_ease-out] dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 px-6 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-100">
                    Dokumen Kinerja
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">Unggah SKP</h2>
                  <p className="mt-2 text-sm text-indigo-100">
                    Isi data triwulan dan pilih file SKP yang ingin ditambahkan ke sistem.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white transition hover:bg-white/20"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-5 px-6 py-6">
  	              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {isAdmin && (
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Unggah Untuk User (Opsional)
                      </label>
                      <Select
                        value={uploadForm.target_user || "self"}
                        onValueChange={(value) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            target_user: value === "self" ? "" : value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                          <SelectValue placeholder="Pilih User" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                          <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" value="self">Diri Sendiri (Anda)</SelectItem>
                          {usersList.map((u) => (
                            <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={u.id} value={u.username}>
                              {u.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Nama SKP
                  </label>
                  <input
                    type="text"
                    value={uploadForm.nama_skp}
                    onChange={(event) =>
                      setUploadForm((prev) => ({ ...prev, nama_skp: event.target.value }))
                    }
                    placeholder="Contoh: SKP Triwulan 1 Staff Akuntansi"
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Triwulan
                  </label>
                  <Select
                    value={String(uploadForm.triwulan)}
                    onValueChange={(value) =>
                      setUploadForm((prev) => ({ ...prev, triwulan: Number(value) }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      {triwulanFormOptions.map((option) => (
                        <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

	                <div>
	                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
	                    Tahun
                  </label>
                  <Select
                    value={String(uploadForm.tahun)}
                    onValueChange={(value) =>
                      setUploadForm((prev) => ({ ...prev, tahun: Number(value) }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      {yearOptions.map((year) => (
                        <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
	                </div>
		              </div>
	
		              <label className="block rounded-[24px] border border-dashed border-indigo-200 bg-indigo-50/50 p-5 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/15">
	                <div className="flex flex-col items-center justify-center text-center">
	                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                    <FiFileText className="h-6 w-6" />
                  </div>
	                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
	                    {uploadForm.file ? uploadForm.file.name : "Pilih dokumen SKP"}
	                  </p>
	                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white">
                    <FiUploadCloud className="h-4 w-4" />
                    Pilih File
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.jfif,.heic,.heif"
                  onChange={(event) =>
                    setUploadForm((prev) => ({ ...prev, file: event.target.files?.[0] || null }))
                  }
                  className="hidden"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="h-12 rounded-2xl px-5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "oklch(63.7% 0.237 25.331)" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpload}
                  className="h-12 rounded-2xl px-5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-70"
                  style={{ backgroundColor: "oklch(72.3% 0.219 149.579)" }}
                >
                  {isSubmittingUpload ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl animate-[scaleIn_0.25s_ease-out] dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 px-6 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-100">
                    Pembaruan Dokumen
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">Edit SKP</h2>
                  <p className="mt-2 text-sm text-indigo-100">
                    Kamu bisa mengganti metadata SKP sekaligus mengganti file dokumennya.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white transition hover:bg-white/20"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-5 px-6 py-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {isAdmin && (
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Ubah User Dokumen (Opsional)
                    </label>
                    <Select
                      value={editing.target_user || "self"}
                      onValueChange={(value) =>
                        setEditing((prev) =>
                          prev
                            ? { ...prev, target_user: value === "self" ? "" : value }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                        <SelectValue placeholder="Pilih User" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                        <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" value="self">Diri Sendiri (Anda)</SelectItem>
                        {usersList.map((u) => (
                          <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={u.id} value={u.username}>
                            {u.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Nama SKP
                  </label>
                  <input
                    type="text"
                    value={editing.nama_skp}
                    onChange={(event) =>
                      setEditing((prev) => (prev ? { ...prev, nama_skp: event.target.value } : prev))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Triwulan
                  </label>
                  <Select
                    value={String(editing.triwulan)}
                    onValueChange={(value) =>
                      setEditing((prev) =>
                        prev ? { ...prev, triwulan: Number(value) } : prev,
                      )
                    }
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      {triwulanFormOptions.map((option) => (
                        <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Tahun
                  </label>
                  <Select
                    value={String(editing.tahun)}
                    onValueChange={(value) =>
                      setEditing((prev) =>
                        prev ? { ...prev, tahun: Number(value) } : prev,
                      )
                    }
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      {yearOptions.map((year) => (
                        <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Ganti file SKP</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Opsional. Jika tidak dipilih, file lama tetap digunakan.
                    </p>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      File saat ini:{" "}
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {getFileNameFromPath(editing.file_path)}
                      </span>
                    </p>
                    {editing.file && (
                      <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        File baru: {editing.file.name}
                      </p>
                    )}
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
                    <FiUploadCloud className="h-4 w-4" />
                    Pilih File Baru
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.jfif,.heic,.heif"
                      onChange={(event) =>
                        setEditing((prev) =>
                          prev ? { ...prev, file: event.target.files?.[0] || null } : prev,
                        )
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="h-12 rounded-2xl px-5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "oklch(63.7% 0.237 25.331)" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="h-12 rounded-2xl px-5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-70"
                  style={{ backgroundColor: "oklch(72.3% 0.219 149.579)" }}
                >
                  {isSubmittingEdit ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Hapus Dokumen SKP?"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.nama_skp ?? ""}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        type="danger"
      />

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

