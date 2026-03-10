import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Toast } from "../components/snackbar";
import UploadDocumentInfoSection from "../components/document/forms/UploadDocumentInfoSection";
import UploadFileSection from "../components/document/forms/UploadFileSection";
import UploadFormActions from "../components/document/forms/UploadFormActions";
import { ToastState } from "../types";
import { useFileUpload } from "../hooks/document/useFileUpload";

export default function UploadDocument() {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  const {
    fileInputRef,
    formData,
    selectedFile,
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
  } = useFileUpload(showToast);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-amber-50 via-white to-orange-100 font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />

      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Unggah Dokumen" />

        <main className="flex-1 p-4 lg:p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl"></div>
          <div className="animate-[slideUp_0.6s_ease-out_0.1s_both]">
            <form onSubmit={handleSubmit}>
              <div className="rounded-3xl bg-gradient-to-br from-orange-100/70 via-white to-sky-100/60 p-[1px] shadow-sm">
                <div className="bg-white rounded-3xl p-6 lg:p-10 border border-orange-100/60">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <UploadDocumentInfoSection
                    formData={formData}
                    onInputChange={handleInputChange}
                  />

                  <UploadFileSection
                    fileInputRef={fileInputRef}
                    selectedFile={selectedFile}
                    isDragging={isDragging}
                    onFileInputChange={handleFileInputChange}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClickUploadArea={handleClickUploadArea}
                    onRemoveFile={handleRemoveFile}
                  />
                </div>

                <div className="animate-[slideUp_0.6s_ease-out_0.2s_both]">
                  <UploadFormActions
                    isUploading={isUploading}
                    onCancel={handleCancel}
                  />
                </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
