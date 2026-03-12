import { useCallback, useEffect, useState } from "react";
import {
  deleteDocument,
  getDocuments,
  updateDocument,
  uploadsBaseUrl,
} from "../../services/api";
import { Document, ToastState } from "../../types";
import { useDocumentFilters } from "./useDocumentFilters";

type ConfirmDialogState = {
  isOpen: boolean;
  documentId: number | string | null;
  documentName: string;
  isMultiple: boolean;
};

export function useDocumentManagement() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDocuments, setSelectedDocuments] = useState<
    Set<number | string>
  >(new Set());
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    documentId: null,
    documentName: "",
    isMultiple: false,
  });

  const showToast = (
    message: string,
    type: ToastState["type"],
    duration?: number,
  ) => {
    setToast({ show: true, message, type, duration });
  };

  const {
    documents,
    setDocuments,
    filteredDocuments,
    setFilteredDocuments,
    handleSearch,
    handleDateRangeFilter,
    handleCategoryFilter,
    handleRefresh: baseHandleRefresh,
  } = useDocumentFilters([], showToast);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data);
      setFilteredDocuments(data);
    } catch {
      showToast("Gagal mengambil data dokumen", "error");
    } finally {
      setLoading(false);
    }
  }, [setDocuments, setFilteredDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleRefresh = () => {
    baseHandleRefresh();
    setSelectedDocuments(new Set());
    fetchDocuments();
  };

  const handleSelectDocument = (id: number | string) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocuments(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredDocuments.map((doc) => doc.id));
      setSelectedDocuments(allIds);
      return;
    }

    setSelectedDocuments(new Set());
  };

  const resolveDocumentFileUrl = (filePath: string) => {
    const rawPath = String(filePath || "").trim();
    const isAbsoluteUrl = /^https?:\/\//i.test(rawPath);

    if (isAbsoluteUrl) {
      return rawPath;
    }

    const normalized = rawPath.replace(/\\/g, "/");
    const uploadsToken = "/uploads/";
    const uploadsIndex = normalized.toLowerCase().lastIndexOf(uploadsToken);

    let relativePath = normalized;
    if (uploadsIndex >= 0) {
      relativePath = normalized.slice(uploadsIndex + uploadsToken.length);
    } else {
      relativePath = normalized.replace(/^\/?uploads\/?/i, "");
    }

    relativePath = relativePath.replace(/^\/+/, "");
    return `${uploadsBaseUrl}/${relativePath}`;
  };

  const handleView = (id: number | string) => {
    const doc = documents.find((item) => item.id === id);

    if (!doc) {
      showToast("Dokumen tidak ditemukan", "error");
      return;
    }

    if (!doc.file_path) {
      showToast("File dokumen tidak tersedia", "error");
      return;
    }

    const fileUrl = resolveDocumentFileUrl(doc.file_path);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleEdit = (id: number | string) => {
    const doc = documents.find((item) => item.id === id);
    if (doc) {
      setEditingDocument(doc);
    }
  };

  const handleSaveEdit = async (
    id: number | string,
    updatedData: Partial<Document>,
  ): Promise<boolean> => {
    try {
      await updateDocument(id, updatedData);

      const updatedDocuments = documents.map((doc) =>
        doc.id === id ? { ...doc, ...updatedData } : doc,
      );

      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);
      showToast("Dokumen berhasil diperbarui!", "success");
      return true;
    } catch {
      showToast("Gagal memperbarui dokumen", "error");
      return false;
    }
  };

  const handleDelete = (id: number | string) => {
    const doc = documents.find((item) => item.id === id);
    setConfirmDialog({
      isOpen: true,
      documentId: id,
      documentName: doc?.nama_sppd || "dokumen ini",
      isMultiple: false,
    });
  };

  const handleDeleteSelected = () => {
    if (selectedDocuments.size === 0) {
      showToast("Tidak ada dokumen yang dipilih", "warning");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      documentId: null,
      documentName: `${selectedDocuments.size} dokumen`,
      isMultiple: true,
    });
  };

  const handleDownloadSelected = () => {
    const selectedDocs = documents.filter((doc) => selectedDocuments.has(doc.id));

    if (selectedDocs.length === 0) {
      showToast("Tidak ada dokumen yang dipilih", "warning");
      return;
    }

    const sanitizeFileName = (name: string) =>
      name.replace(/[\\/:*?"<>|]+/g, "-").trim() || "dokumen";

    const runDownload = async () => {
      let successCount = 0;
      let failedCount = 0;

      for (const doc of selectedDocs) {
        try {
          if (!doc.file_path) {
            failedCount += 1;
            continue;
          }

          const fileUrl = resolveDocumentFileUrl(doc.file_path);
          const extension =
            fileUrl.split("?")[0].split(".").pop()?.toLowerCase() || "";
          const response = await fetch(fileUrl);

          if (!response.ok) {
            failedCount += 1;
            continue;
          }

          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = objectUrl;
          link.download = extension
            ? `${sanitizeFileName(doc.nama_sppd)}.${extension}`
            : sanitizeFileName(doc.nama_sppd);
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

          successCount += 1;
        } catch {
          failedCount += 1;
        }
      }

      if (successCount > 0 && failedCount === 0) {
        showToast(`${successCount} dokumen berhasil diunduh.`, "success");
        return;
      }

      if (successCount > 0 && failedCount > 0) {
        showToast(
          `${successCount} dokumen berhasil diunduh, ${failedCount} gagal.`,
          "warning",
        );
        return;
      }

      showToast("Gagal mengunduh dokumen terpilih.", "error");
    };

    runDownload();
  };

  const confirmDelete = async () => {
    try {
      if (confirmDialog.isMultiple) {
        const idsToDelete = Array.from(selectedDocuments);
        await Promise.all(idsToDelete.map((id) => deleteDocument(id)));
        await fetchDocuments();
        setSelectedDocuments(new Set());
        showToast(`${idsToDelete.length} dokumen dipindahkan ke riwayat!`, "success");
      } else if (confirmDialog.documentId) {
        await deleteDocument(confirmDialog.documentId);
        await fetchDocuments();

        const newSelected = new Set(selectedDocuments);
        newSelected.delete(confirmDialog.documentId);
        setSelectedDocuments(newSelected);

        showToast("Dokumen dipindahkan ke riwayat!", "success");
      }
    } catch {
      showToast("Gagal memindahkan dokumen ke riwayat", "error");
    }

    setConfirmDialog({
      isOpen: false,
      documentId: null,
      documentName: "",
      isMultiple: false,
    });
  };

  const cancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      documentId: null,
      documentName: "",
      isMultiple: false,
    });
  };

  return {
    loading,
    documents,
    filteredDocuments,
    selectedDocuments,
    toast,
    editingDocument,
    confirmDialog,
    setToast,
    setEditingDocument,
    handleSearch,
    handleDateRangeFilter,
    handleCategoryFilter,
    handleRefresh,
    handleSelectDocument,
    handleSelectAll,
    handleView,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleDeleteSelected,
    handleDownloadSelected,
    confirmDelete,
    cancelDelete,
  };
}
