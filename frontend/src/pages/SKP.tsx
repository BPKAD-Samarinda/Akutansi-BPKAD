import { useEffect, useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import DocumentTablePagination from "../components/document/table/DocumentTablePagination";
import ConfirmDialog from "../components/layout/ui/ConfirmDialog";
import { Toast } from "../components/snackbar";
import {
  createSkpDocument,
  deleteSkpDocument,
  getSkpDocuments,
  updateSkpDocument,
  getUsers,
} from "../services/api";
import { formatIndonesianDate } from "../utils/localDate";
import { getUser } from "../utils/auth";
import type { SkpDocument, ToastState } from "../types";
import type { UserApiItem } from "../types/user";

// Extracted SKP components
import SkpFilter from "../components/skp/SkpFilter";
import SkpTable from "../components/skp/SkpTable";
import SkpUploadModal from "../components/skp/SkpUploadModal";
import SkpEditModal from "../components/skp/SkpEditModal";
import { currentYear, MAX_SKP_FILE_SIZE, allowedSkpMimeTypes } from "../components/skp/constants";
import type { UploadForm, EditForm } from "../components/skp/types";
import { openFileInNewTab, downloadFile } from "../components/skp/utils";

const initialUploadForm = (): UploadForm => ({
  nama_skp: "",
  triwulan: 0,
  tahun: currentYear,
  file: null,
  target_user: "",
});

export default function SkpPage() {
  const user = getUser();
  const isAdmin = user?.role === "Admin" || user?.role === "Admin Akuntansi";
  const isPkl = user?.role === "Anak PKL";
  const [usersList, setUsersList] = useState<UserApiItem[]>([]);

  useEffect(() => {
    if (isAdmin || isPkl) {
      getUsers().then(setUsersList).catch(() => {});
    }
  }, [isAdmin, isPkl]);

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
    if (![0, 1, 2, 3, 4, 5].includes(payload.triwulan)) {
      return "Periode tidak valid.";
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
          <SkpFilter
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearchSubmit={handleSearchSubmit}
            selectedTriwulan={selectedTriwulan}
            setSelectedTriwulan={setSelectedTriwulan}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            isAdmin={isAdmin}
            selectedUserFilter={selectedUserFilter}
            setSelectedUserFilter={setSelectedUserFilter}
            usersList={usersList}
          />

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
            <SkpTable
              loading={loading}
              currentRows={currentRows}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              handleOpenUploadModal={handleOpenUploadModal}
              handleRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              allSelected={allSelected}
              someSelected={someSelected}
              handleToggleSelectAll={handleToggleSelectAll}
              selectedIds={selectedIds}
              handleToggleSelect={handleToggleSelect}
              safeCurrentPage={safeCurrentPage}
              rowsPerPage={rowsPerPage}
              formatIndonesianDate={formatIndonesianDate}
              openFileInNewTab={openFileInNewTab}
              isPkl={isPkl}
              handleOpenEdit={handleOpenEdit}
              setDeleteTarget={setDeleteTarget}
              isAdmin={isAdmin}
            />

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

      <SkpUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleSubmitUpload}
        uploadForm={uploadForm}
        setUploadForm={setUploadForm}
        isAdmin={isAdmin || isPkl}
        usersList={usersList}
        isSubmittingUpload={isSubmittingUpload}
      />

      {editing && (
        <SkpEditModal
          editing={editing}
          setEditing={setEditing}
          onSubmit={handleSubmitEdit}
          isAdmin={isAdmin}
          usersList={usersList}
          isSubmittingEdit={isSubmittingEdit}
        />
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
