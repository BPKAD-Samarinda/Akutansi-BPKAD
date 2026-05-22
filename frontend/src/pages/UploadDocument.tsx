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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen flex bg-gray-100 dark:bg-slate-950 font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="ml-0 lg:ml-64 flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header
          title="Unggah Dokumen"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-8 relative overflow-hidden flex items-center justify-center">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[100px] pointer-events-none" />

          {/* Floating Circles - Parallax / Layered Effect */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-tr from-orange-400/10 to-amber-400/10 dark:from-orange-500/5 dark:to-amber-500/5 animate-float-subtle pointer-events-none" />
          <div className="absolute bottom-12 right-20 w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400/10 to-orange-400/10 dark:from-amber-500/5 dark:to-orange-500/5 animate-float-subtle-reverse pointer-events-none" />
          <div className="absolute top-1/2 right-12 w-16 h-16 rounded-full bg-gradient-to-tr from-red-400/10 to-orange-400/10 dark:from-red-500/5 dark:to-orange-500/5 animate-float-subtle pointer-events-none animate-delay-200" />
          <div className="absolute bottom-1/3 left-16 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400/10 to-yellow-400/10 dark:from-amber-500/5 dark:to-yellow-500/5 animate-float-subtle-reverse pointer-events-none animate-delay-500" />

          <div className="w-full max-w-5xl animate-[slideUp_0.6s_ease-out_0.1s_both] relative z-10">
            <form onSubmit={handleSubmit}>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 lg:p-10 border border-slate-200/50 dark:border-slate-800/80 shadow-xl shadow-slate-100/50 dark:shadow-none hover:shadow-2xl hover:shadow-slate-200/30 transition-all duration-350">
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
            </form>
          </div>
        </main>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
