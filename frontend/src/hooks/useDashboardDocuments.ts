import { useEffect, useState } from "react";
import { getDocuments } from "../services/api";
import { Document, ToastState } from "../types";
import { useDocumentFilters } from "./useDocumentFilters";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});


type ConfirmDialogState = {
  isOpen: boolean;
  documentId: number | string | null;
  documentName: string;
  isMultiple: boolean;
};

export function useDashboardDocuments() {
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
        setDocuments(data);
        setFilteredDocuments(data);
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
    showToast(
      `Melihat ${doc?.name || "dokumen"}... (fungsi preview belum diimplementasikan)`,
      "info",
    );
  };

  const handleEdit = (id: number | string) => {
    const doc = documents.find((item) => item.id === id);
    if (doc) {
      setEditingDocument(doc);
    }
  };

  const handleSaveEdit = (
    id: number | string,
    updatedData: Partial<Document>,
  ) => {
    const updatedDocuments = documents.map((doc) =>
      doc.id === id ? { ...doc, ...updatedData } : doc,
    );
    setDocuments(updatedDocuments);
    setFilteredDocuments(updatedDocuments);
    showToast("Dokumen berhasil diperbarui (secara lokal)!", "success");
  };

  const handleDelete = (id: number | string) => {
    const doc = documents.find((item) => item.id === id);
    setConfirmDialog({
      isOpen: true,
      documentId: id,
      documentName: doc?.name || "dokumen ini",
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

      for (const id of selectedDocuments) {
        await axios.delete(`http://localhost:3001/api/documents/${id}`);
      }

      const updatedDocuments = documents.filter(
        (doc) => !selectedDocuments.has(doc.id),
      );

      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);
      setSelectedDocuments(new Set());

      showToast(
        `${selectedDocuments.size} dokumen berhasil dihapus!`,
        "success",
      );

    } else if (confirmDialog.documentId) {

      await axios.delete(
        `http://localhost:3001/api/documents/${confirmDialog.documentId}`
      );

      const updatedDocuments = documents.filter(
        (doc) => doc.id !== confirmDialog.documentId,
      );

      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);

      const newSelected = new Set(selectedDocuments);
      newSelected.delete(confirmDialog.documentId);
      setSelectedDocuments(newSelected);

      showToast("Dokumen berhasil dihapus!", "success");
    }

  } catch (error) {
    showToast("Gagal menghapus dokumen dari server", "error");
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
