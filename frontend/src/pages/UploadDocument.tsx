import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Toast from "../components/ui/Toast";
import uploadIcon from "../assets/icons/upload.svg";

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function UploadDocument() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "info" });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      showToast("Tipe file tidak didukung. Hanya PDF, DOCX, XLSX, dan PPTX yang diperbolehkan.", "error");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showToast("Ukuran file terlalu besar. Maksimal ukuran file adalah 10MB.", "error");
      return;
    }

    setSelectedFile(file);
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

  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !selectedFile) {
      showToast("Mohon lengkapi semua kolom sebelum mengunggah!", "warning");
      return;
    }

    setIsUploading(true);

    // Simulasi upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form Data:", formData);
    console.log("Selected File:", selectedFile);

    setIsUploading(false);
    showToast("Dokumen berhasil diunggah!", "success");

    // Wait for toast to show then navigate
    setTimeout(() => {
      setFormData({ name: "", date: "" });
      setSelectedFile(null);
      navigate("/dashboarddokumen");
    }, 1500);
  };

  const handleCancel = () => {
    if (formData.name || formData.date || selectedFile) {
      showToast("Pengunggahan dibatalkan", "info");
    }
    navigate("/dashboarddokumen");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />

      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Unggah Dokumen" />

        <main className="flex-1 p-4 lg:p-8">
          {/* Page Title */}
          <div className="mb-6 lg:mb-8 animate-[slideDown_0.6s_ease-out]">
            <h1 className="hidden lg:block text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
              Unggah Dokumen Baru
            </h1>
            <p className="hidden lg:block text-gray-600 mt-2 font-medium">
              Tambahkan dokumen baru ke catatan keuangan Anda
            </p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="animate-[slideUp_0.6s_ease-out_0.1s_both]">
            <div className="bg-white rounded-3xl shadow-xl shadow-orange-500/10 p-6 lg:p-10 border border-orange-100/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                
                {/* LEFT SECTION - Document Information */}
                <div className="space-y-6 animate-[slideInLeft_0.6s_ease-out_0.2s_both]">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-[bounce_0.6s_ease-in-out_0.3s_both]">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Informasi Dokumen
                    </h2>
                  </div>

                  {/* Document Name */}
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide"
                    >
                      Nama Dokumen
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Contoh: Laporan Keuangan Q1 2024"
                        className="relative w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="group">
                    <label
                      htmlFor="date"
                      className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide"
                    >
                      Tanggal
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="relative w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION - File Upload */}
                <div className="space-y-6 animate-[slideInRight_0.6s_ease-out_0.2s_both]">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-[bounce_0.6s_ease-in-out_0.4s_both]">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Berkas
                    </h2>
                  </div>

                  {/* Upload Area */}
                  <div
                    onClick={handleClickUploadArea}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                      border-3 border-dashed rounded-2xl 
                      min-h-[280px] lg:min-h-[320px]
                      flex flex-col items-center justify-center
                      cursor-pointer transition-all duration-500
                      relative overflow-hidden
                      ${
                        isDragging
                          ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 scale-105"
                          : "border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-gradient-to-br hover:from-orange-50 hover:to-transparent"
                      }
                      ${selectedFile ? "border-green-400 bg-gradient-to-br from-green-50 to-transparent" : ""}
                    `}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileInputChange}
                      className="hidden"
                      accept=".pdf,.docx,.xlsx,.pptx"
                    />

                    {selectedFile ? (
                      <div className="text-center p-8 animate-[scaleIn_0.4s_ease-out]">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30 animate-[bounce_0.6s_ease-in-out]">
                          <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-base font-bold text-gray-800 mb-2">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-600 mb-5">
                          {formatFileSize(selectedFile.size)}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            showToast("File dihapus", "info");
                          }}
                          className="text-sm text-red-600 hover:text-red-700 font-semibold underline transition-colors"
                        >
                          Hapus File
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                          <img
                            src={uploadIcon}
                            className="w-10 h-10 brightness-0 invert"
                            alt="Upload"
                          />
                        </div>
                        <p className="text-base font-bold text-gray-800 mb-2">
                          Klik untuk mengunggah atau seret & lepas
                        </p>
                        <p className="text-sm text-gray-600">
                          PDF, DOCX, XLSX, atau PPTX (Maks. 10MB)
                        </p>
                      </div>
                    )}

                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-orange-400 rounded-full filter blur-3xl animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-10 lg:mt-12 animate-[slideUp_0.6s_ease-out_0.3s_both]">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isUploading}
                  className="px-8 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="relative px-8 py-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-[length:200%_auto] hover:bg-[position:100%] text-white rounded-xl font-bold transition-all duration-500 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed order-1 sm:order-2 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <span>Simpan Dokumen</span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}