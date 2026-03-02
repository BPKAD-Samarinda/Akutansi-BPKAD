import { useEffect, useState } from "react";
import { getDocuments, updateDocument, uploadsBaseUrl } from "../../services/api";
import { Document, ToastState } from "../../types";
import { useDocumentFilters } from "./useDocumentFilters";
import {
  getHiddenDocumentIds,
  moveDocumentsToLocalHistory,
} from "../../utils/uploadHistoryLocal";

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

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDocuments();
        const hiddenDocumentIds = new Set(getHiddenDocumentIds().map(String));
        const visibleDocuments = data.filter(
          (document) => !hiddenDocumentIds.has(String(document.id)),
        );

        setDocuments(visibleDocuments);
        setFilteredDocuments(visibleDocuments);
      } catch {
        showToast("Gagal mengambil data dokumen", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setDocuments, setFilteredDocuments]);

  const handleRefresh = () => {
    baseHandleRefresh();
    setSelectedDocuments(new Set());
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

    const normalizedPath = doc.file_path
      .replace(/\\/g, "/")
      .replace(/^\/?uploads\/?/i, "")
      .replace(/^\/+/, "");

    const fileUrl = `${uploadsBaseUrl}/${normalizedPath}`;
    const previewUrl = `${window.location.origin}/preview-document?file=${encodeURIComponent(fileUrl)}&title=${encodeURIComponent(doc.nama_sppd)}`;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
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
    showToast(
      `Mengunduh ${selectedDocuments.size} dokumen... (fungsi download belum diimplementasikan)`,
      "info",
    );
  };

  const confirmDelete = async () => {
    try {
      if (confirmDialog.isMultiple) {
        const documentsToMove = documents.filter((doc) =>
          selectedDocuments.has(doc.id),
        );
        moveDocumentsToLocalHistory(documentsToMove);

        const updatedDocuments = documents.filter(
          (doc) => !selectedDocuments.has(doc.id),
        );

        setDocuments(updatedDocuments);
        setFilteredDocuments(updatedDocuments);
        setSelectedDocuments(new Set());

        showToast(
          `${selectedDocuments.size} dokumen dipindahkan ke riwayat!`,
          "success",
        );
      } else if (confirmDialog.documentId) {
        const documentToMove = documents.find(
          (doc) => doc.id === confirmDialog.documentId,
        );

        if (documentToMove) {
          moveDocumentsToLocalHistory([documentToMove]);
        }

        const updatedDocuments = documents.filter(
          (doc) => doc.id !== confirmDialog.documentId,
        );

        setDocuments(updatedDocuments);
        setFilteredDocuments(updatedDocuments);

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
