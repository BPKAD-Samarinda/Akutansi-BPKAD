import { FiX, FiFileText, FiUploadCloud } from "react-icons/fi";
import { ToastState } from "../../../types";
import { useFileUpload } from "../../../hooks/document/useFileUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (message: string, type: ToastState["type"]) => void;
};

export default function UploadModal({ isOpen, onClose, onSuccess, showToast }: UploadModalProps) {
  const {
    fileInputRef,
    formData,
    setFormData,
    selectedFile,
    isUploading,
    handleInputChange,
    handleFileInputChange,
    handleSubmit,
    handleCancel,
  } = useFileUpload(showToast, onSuccess, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl animate-[scaleIn_0.25s_ease-out] dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <div className="bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-5 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-100">
                Manajemen Dokumen
              </p>
              <h2 className="mt-2 text-2xl font-bold">Unggah Dokumen</h2>
              <p className="mt-2 text-sm text-orange-100">
                Isi informasi dan pilih file dokumen yang ingin ditambahkan ke sistem.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white transition hover:bg-white/20"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Nama Dokumen
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Contoh: Dokumen Keuangan Bulan Maret"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Tanggal Dokumen
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Kategori
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value as any }))
                }
              >
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                  <SelectItem value="Lampiran">Lampiran</SelectItem>
                  <SelectItem value="Keuangan">Keuangan</SelectItem>
                  <SelectItem value="BKU">BKU</SelectItem>
                  <SelectItem value="STS">STS</SelectItem>
                  <SelectItem value="Rekening Koran">Rekening Koran</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <label className="block rounded-[24px] border border-dashed border-orange-200 bg-orange-50/50 p-5 transition hover:border-orange-300 hover:bg-orange-50 dark:border-orange-500/30 dark:bg-orange-500/10 dark:hover:bg-orange-500/15">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                <FiFileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {selectedFile ? selectedFile.name : "Pilih dokumen file"}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white">
                <FiUploadCloud className="h-4 w-4" />
                Pilih File
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.jfif,.heic,.heif"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {isUploading ? "Menyimpan..." : "Simpan Dokumen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
