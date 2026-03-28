import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastState } from "../../types";
import { apiClient } from "../../services/api";


export function useFileUpload(
  showToast: (message: string, type: ToastState["type"]) => void,
) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    category: "" as
      | "Lampiran"
      | "Keuangan"
      | "BKU"
      | "STS"
      | "Rekening Koran"
      | "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (file: File) => {
    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "jpg",
      "jpeg",
      "png",
      "jfif",
      "heic",
      "heif",
    ];

    const allowedTypes = [
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
    ];

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    const hasAllowedMimeType = allowedTypes.includes(file.type);
    const hasAllowedExtension = allowedExtensions.includes(fileExtension);

    if (!hasAllowedMimeType && !hasAllowedExtension) {
      showToast(
        "Tipe file tidak didukung. Hanya PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, dan PNG yang diperbolehkan.",
        "error",
      );
      return;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      showToast(
        "Ukuran file terlalu besar. Maksimal ukuran file adalah 20MB.",
        "error",
      );
      return;
    }

    setSelectedFile(file);

    const fileName = file.name.replace(/\.[^/.]+$/, "");
    setFormData((prev) => ({
      ...prev,
      name: fileName,
    }));

    showToast("File berhasil dipilih!", "success");
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.date ||
      !formData.category ||
      !selectedFile
    ) {
      showToast("Mohon lengkapi semua kolom sebelum mengunggah!", "warning");
      return;
    }

    const selectedDate = new Date(`${formData.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime())) {
      showToast("Tanggal dokumen tidak valid.", "error");
      return;
    }

    if (selectedDate > today) {
      showToast(
        "Tanggal dokumen tidak boleh melebihi tanggal hari ini.",
        "warning",
      );
      return;
    }

    setIsUploading(true);

    try {
      const data = new FormData();
      data.append("nama_sppd", formData.name);
      data.append("tanggal_sppd", formData.date);
      data.append("kategori", formData.category);
      data.append("file", selectedFile);

      await apiClient.post("/documents", data);

      showToast("Dokumen berhasil diunggah!", "success");

      setTimeout(() => {
        setFormData({ name: "", date: "", category: "" });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
        showToast(message || "Gagal mengunggah dokumen", "error");
        return;
      }
      showToast("Gagal mengunggah dokumen", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (formData.name || formData.date || formData.category || selectedFile) {
      showToast("Pengunggahan dibatalkan", "info");
    }
    navigate("/dashboarddokumen");
  };

  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, name: "" }));
    showToast("File dihapus", "info");
  };

  return {
    fileInputRef,
    formData,
    setFormData,
    selectedFile,
    setSelectedFile,
    isDragging,
    isUploading,
    handleInputChange,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSubmit,
    handleCancel,
    handleClickUploadArea,
    handleRemoveFile,
  };
}
