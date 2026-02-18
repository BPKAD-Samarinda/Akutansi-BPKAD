import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastState } from "../types";

export function useFileUpload(
  showToast: (message: string, type: ToastState["type"]) => void,
) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    category: "" as "Lampiran" | "Keuangan" | "",
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
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast(
        "Tipe file tidak didukung. Hanya PDF, DOCX, XLSX, dan PPTX yang diperbolehkan.",
        "error",
      );
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showToast(
        "Ukuran file terlalu besar. Maksimal ukuran file adalah 10MB.",
        "error",
      );
      return;
    }

    setSelectedFile(file);

    // AUTO-FILL: Set nama dokumen dari nama file (tanpa ekstensi)
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

    setIsUploading(true);

    // Simulasi upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    showToast("Dokumen berhasil diunggah!", "success");

    // Wait for toast to show then navigate
    setTimeout(() => {
      setFormData({ name: "", date: "", category: "" });
      setSelectedFile(null);
      navigate("/dashboarddokumen");
    }, 1500);
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
  };
}
