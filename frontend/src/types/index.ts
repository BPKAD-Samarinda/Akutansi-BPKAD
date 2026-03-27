export interface Document {
  id: number;
  nama_sppd: string;
  tanggal_sppd: string;
  kategori: string;
  file_path: string;
  created_at?: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export interface UploadHistory {
  id: number | string;
  documentName: string;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  filePath: string;
  status?: "diunggah" | "dihapus" | "diedit";
  isDeleted?: boolean;
}

export interface UploadHistoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "diunggah" | "dihapus" | "diedit";
}

export interface UploadHistoryResult {
  items: UploadHistory[];
  total: number;
  page: number;
  limit: number;
}
